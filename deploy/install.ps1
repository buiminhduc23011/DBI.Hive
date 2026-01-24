# ============================================
# DBI Task - Windows Installation Script (WinSW)
# Run as Administrator
# ============================================

#Requires -RunAsAdministrator

$ErrorActionPreference = "Stop"
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Load configuration
. "$ScriptPath\config.ps1"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  DBI Task - Windows Installation" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# Interactive Configuration
# ============================================

Write-Host "=== Network Configuration ===" -ForegroundColor Yellow
Write-Host ""

# Get default IP (first non-loopback IPv4)
$defaultIP = (Get-NetIPAddress -AddressFamily IPv4 | 
    Where-Object { $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -notmatch '^169\.' -and $_.IPAddress -ne '127.0.0.1' } | 
    Select-Object -First 1).IPAddress
if (-not $defaultIP) { $defaultIP = "localhost" }

Write-Host "Detected IP: $defaultIP" -ForegroundColor DarkGray
Write-Host ""

# Ask for Server IP
$inputIP = Read-Host "Enter Server IP address (default: $defaultIP)"
if ([string]::IsNullOrWhiteSpace($inputIP)) { 
    $ServerIP = $defaultIP 
} else { 
    $ServerIP = $inputIP 
}

# Ask for API Port
$inputApiPort = Read-Host "Enter API Port (default: $ApiPort)"
if ([string]::IsNullOrWhiteSpace($inputApiPort)) { 
    $ApiPort = $global:ApiPort 
} else { 
    $ApiPort = [int]$inputApiPort 
}

# Ask for Web Port
$inputWebPort = Read-Host "Enter Web Port (default: $WebPort)"
if ([string]::IsNullOrWhiteSpace($inputWebPort)) { 
    $WebPort = $global:WebPort 
} else { 
    $WebPort = [int]$inputWebPort 
}

Write-Host ""
Write-Host "=== Configuration Summary ===" -ForegroundColor Green
Write-Host "  Server IP:  $ServerIP" -ForegroundColor White
Write-Host "  API Port:   $ApiPort" -ForegroundColor White
Write-Host "  Web Port:   $WebPort" -ForegroundColor White
Write-Host "  API URL:    http://${ServerIP}:${ApiPort}" -ForegroundColor Yellow
Write-Host "  Web URL:    http://${ServerIP}:${WebPort}" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Continue with this configuration? (Y/n)"
if ($confirm -eq "n" -or $confirm -eq "N") {
    Write-Host "Installation cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""

# ============================================
# Helper Functions
# ============================================

function Write-Step {
    param([string]$Message)
    Write-Host "[*] $Message" -ForegroundColor Yellow
}

function Write-Success {
    param([string]$Message)
    Write-Host "[+] $Message" -ForegroundColor Green
}

function Write-Err {
    param([string]$Message)
    Write-Host "[-] $Message" -ForegroundColor Red
}

function Test-Command {
    param([string]$Command)
    return [bool](Get-Command $Command -ErrorAction SilentlyContinue)
}

# ============================================
# 1. Check Prerequisites
# ============================================

Write-Step "Checking prerequisites..."

# Check .NET Runtime
$dotnetInstalled = $false
if (Test-Command "dotnet") {
    $runtimes = dotnet --list-runtimes 2>$null
    if ($runtimes -match "Microsoft.AspNetCore.App 8") {
        $dotnetInstalled = $true
        Write-Success ".NET 8 Runtime found"
    }
}

if (-not $dotnetInstalled) {
    Write-Step "Installing .NET 8 Runtime..."
    
    $dotnetUrl = "https://dot.net/v1/dotnet-install.ps1"
    $dotnetScript = "$env:TEMP\dotnet-install.ps1"
    
    Invoke-WebRequest -Uri $dotnetUrl -OutFile $dotnetScript
    & $dotnetScript -Channel 8.0 -Runtime aspnetcore -InstallDir "$env:ProgramFiles\dotnet"
    
    # Add to PATH
    $env:PATH = "$env:ProgramFiles\dotnet;$env:PATH"
    [Environment]::SetEnvironmentVariable("PATH", $env:PATH, [EnvironmentVariableTarget]::Machine)
    
    Write-Success ".NET 8 Runtime installed"
}

# ============================================
# 2. Create Installation Directory
# ============================================

Write-Step "Creating installation directory..."

if (Test-Path $InstallPath) {
    Write-Host "  Installation directory exists. Stopping existing services..." -ForegroundColor DarkYellow
    
    # Stop existing services
    $services = @($ApiServiceName, $WebServiceName, $MongoServiceName)
    foreach ($svc in $services) {
        $service = Get-Service -Name $svc -ErrorAction SilentlyContinue
        if ($service) {
            Stop-Service -Name $svc -Force -ErrorAction SilentlyContinue
            sc.exe delete $svc 2>$null
        }
    }
    Start-Sleep -Seconds 2
}

New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
New-Item -ItemType Directory -Path "$InstallPath\api" -Force | Out-Null
New-Item -ItemType Directory -Path "$InstallPath\web" -Force | Out-Null
New-Item -ItemType Directory -Path "$InstallPath\mongodb" -Force | Out-Null
New-Item -ItemType Directory -Path "$InstallPath\mongodb\data" -Force | Out-Null
New-Item -ItemType Directory -Path "$InstallPath\logs" -Force | Out-Null
New-Item -ItemType Directory -Path "$InstallPath\services" -Force | Out-Null

Write-Success "Directory structure created"

# ============================================
# 3. Copy Application Files
# ============================================

Write-Step "Copying application files..."

# Copy API
if (Test-Path "$ScriptPath\api") {
    Copy-Item -Path "$ScriptPath\api\*" -Destination "$InstallPath\api" -Recurse -Force
    Write-Success "API files copied"
} else {
    Write-Err "API folder not found! Run build-package.ps1 first."
    exit 1
}

# Copy Web
if (Test-Path "$ScriptPath\web") {
    Copy-Item -Path "$ScriptPath\web\*" -Destination "$InstallPath\web" -Recurse -Force
    Write-Success "Web files copied"
} else {
    Write-Err "Web folder not found! Run build-package.ps1 first."
    exit 1
}

# Copy WinSW
$winsw = "$ScriptPath\tools\winsw.exe"
if (Test-Path $winsw) {
    Copy-Item $winsw "$InstallPath\services\winsw.exe" -Force
    Write-Success "WinSW copied"
} else {
    Write-Err "WinSW not found! Run build-package.ps1 first."
    exit 1
}

# ============================================
# 4. Install MongoDB (or use existing)
# ============================================

Write-Step "Checking MongoDB..."

# Check if MongoDB is already running on the target port
$mongoRunning = $false
$existingMongo = $false

try {
    $conn = Test-NetConnection -ComputerName localhost -Port $MongoPort -WarningAction SilentlyContinue
    if ($conn.TcpTestSucceeded) {
        $mongoRunning = $true
    }
} catch {}

# Check if MongoDB service exists
$existingMongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if ($existingMongoService) {
    $existingMongo = $true
}

if ($mongoRunning -or $existingMongo) {
    Write-Host "  MongoDB detected on port $MongoPort!" -ForegroundColor Green
    Write-Host ""
    $useExisting = Read-Host "Use existing MongoDB? (Y/n)"
    
    if ($useExisting -ne "n" -and $useExisting -ne "N") {
        $global:UseExistingMongo = $true
        $global:SkipMongoService = $true
        Write-Success "Will use existing MongoDB on port $MongoPort"
    } else {
        Write-Host "  Will install separate MongoDB instance" -ForegroundColor DarkYellow
        $global:UseExistingMongo = $false
        $global:SkipMongoService = $false
    }
} else {
    $global:UseExistingMongo = $false
    $global:SkipMongoService = $false
}

# Install MongoDB if not using existing
if (-not $global:UseExistingMongo) {
    $mongoExe = "$InstallPath\mongodb\bin\mongod.exe"
    
    if (-not (Test-Path $mongoExe)) {
        Write-Host "  Downloading MongoDB..." -ForegroundColor DarkYellow
        
        $mongoZipUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.5.zip"
        $mongoZip = "$env:TEMP\mongodb.zip"
        
        Invoke-WebRequest -Uri $mongoZipUrl -OutFile $mongoZip -TimeoutSec 300
        Expand-Archive -Path $mongoZip -DestinationPath "$env:TEMP\mongodb-extract" -Force
        
        # Find extracted folder and copy bin
        $extractedFolder = Get-ChildItem "$env:TEMP\mongodb-extract" -Directory | Select-Object -First 1
        Copy-Item -Path "$($extractedFolder.FullName)\bin" -Destination "$InstallPath\mongodb\bin" -Recurse -Force
        
        # Cleanup
        Remove-Item $mongoZip -Force -ErrorAction SilentlyContinue
        Remove-Item "$env:TEMP\mongodb-extract" -Force -Recurse -ErrorAction SilentlyContinue
        
        Write-Success "MongoDB downloaded and extracted"
    } else {
        Write-Success "MongoDB already exists"
    }
} else {
    Write-Success "Using existing MongoDB installation"
}

# ============================================
# 5. Configure API
# ============================================

Write-Step "Configuring API..."

$appsettingsPath = "$InstallPath\api\appsettings.json"

if (Test-Path $appsettingsPath) {
    $config = Get-Content $appsettingsPath -Raw | ConvertFrom-Json
    
    # Update MongoDB connection
    if (-not $config.MongoDB) {
        $config | Add-Member -Type NoteProperty -Name "MongoDB" -Value @{} -Force
    }
    $config.MongoDB.ConnectionString = $MongoConnectionString
    $config.MongoDB.DatabaseName = $DatabaseName
    
    # Update JWT
    if (-not $config.Jwt) {
        $config | Add-Member -Type NoteProperty -Name "Jwt" -Value @{} -Force
    }
    $config.Jwt.Secret = $JwtSecret
    
    # Update CORS - allow both localhost and server IP
    if (-not $config.Cors) {
        $config | Add-Member -Type NoteProperty -Name "Cors" -Value @{} -Force
    }
    $config.Cors.AllowedOrigins = "http://localhost:$WebPort,http://${ServerIP}:${WebPort}"
    
    $config | ConvertTo-Json -Depth 10 | Set-Content $appsettingsPath -Encoding UTF8
    Write-Success "API configured"
}

# Configure Frontend config.json
$webConfigPath = "$InstallPath\web\config.json"
$webConfig = @{
    apiUrl = "http://${ServerIP}:${ApiPort}/api"
}
$webConfig | ConvertTo-Json | Set-Content $webConfigPath -Encoding UTF8
Write-Success "Frontend configured with API URL: http://${ServerIP}:${ApiPort}/api"

# ============================================
# 6. Create WinSW Service Configs
# ============================================

Write-Step "Creating service configurations..."

# MongoDB Service Config
$mongoConfig = @"
<service>
  <id>$MongoServiceName</id>
  <name>DBI Task - MongoDB</name>
  <description>MongoDB database for DBI Task</description>
  <executable>$InstallPath\mongodb\bin\mongod.exe</executable>
  <arguments>--dbpath "$MongoDataPath" --port $MongoPort</arguments>
  <log mode="roll-by-size">
    <sizeThreshold>10240</sizeThreshold>
    <keepFiles>3</keepFiles>
  </log>
  <startmode>Automatic</startmode>
</service>
"@

# API Service Config
$apiConfig = @"
<service>
  <id>$ApiServiceName</id>
  <name>DBI Task - API</name>
  <description>ASP.NET Core API for DBI Task</description>
  <executable>$InstallPath\api\DBI.Task.API.exe</executable>
  <arguments></arguments>
  <workingdirectory>$InstallPath\api</workingdirectory>
  <env name="ASPNETCORE_URLS" value="http://0.0.0.0:$ApiPort"/>
  <log mode="roll-by-size">
    <sizeThreshold>10240</sizeThreshold>
    <keepFiles>3</keepFiles>
  </log>
  <startmode>Automatic</startmode>
  <depend>$MongoServiceName</depend>
</service>
"@

# Web Service Config (PowerShell HTTP Server)
$webServerScript = @'
$port = WEBPORT_PLACEHOLDER
$webRoot = "WEBROOT_PLACEHOLDER"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:$port/")
$listener.Start()
Write-Host "DBI Task Web Server started on port $port"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }
        
        $filePath = Join-Path $webRoot $localPath.TrimStart("/")
        
        # Determine content type
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = switch ($ext) {
            ".html" { "text/html" }
            ".css" { "text/css" }
            ".js" { "application/javascript" }
            ".json" { "application/json" }
            ".png" { "image/png" }
            ".jpg" { "image/jpeg" }
            ".svg" { "image/svg+xml" }
            ".ico" { "image/x-icon" }
            ".woff" { "font/woff" }
            ".woff2" { "font/woff2" }
            default { "application/octet-stream" }
        }
        
        if (Test-Path $filePath -PathType Leaf) {
            $buffer = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        } else {
            # SPA fallback - serve index.html
            $indexPath = Join-Path $webRoot "index.html"
            if (Test-Path $indexPath) {
                $buffer = [System.IO.File]::ReadAllBytes($indexPath)
                $response.ContentType = "text/html"
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            } else {
                $response.StatusCode = 404
            }
        }
        $response.Close()
    } catch {
        # Ignore errors and continue
    }
}
'@

$webServerScript = $webServerScript -replace "WEBPORT_PLACEHOLDER", $WebPort
$webServerScript = $webServerScript -replace "WEBROOT_PLACEHOLDER", "$InstallPath\web"
$webServerScript | Out-File "$InstallPath\services\web-server.ps1" -Encoding UTF8

$webConfig = @"
<service>
  <id>$WebServiceName</id>
  <name>DBI Task - Web</name>
  <description>Web frontend for DBI Task</description>
  <executable>powershell.exe</executable>
  <arguments>-ExecutionPolicy Bypass -File "$InstallPath\services\web-server.ps1"</arguments>
  <log mode="roll-by-size">
    <sizeThreshold>10240</sizeThreshold>
    <keepFiles>3</keepFiles>
  </log>
  <startmode>Automatic</startmode>
  <depend>$ApiServiceName</depend>
</service>
"@

# Write config files
$mongoConfig | Out-File "$InstallPath\services\$MongoServiceName.xml" -Encoding UTF8
$apiConfig | Out-File "$InstallPath\services\$ApiServiceName.xml" -Encoding UTF8
$webConfig | Out-File "$InstallPath\services\$WebServiceName.xml" -Encoding UTF8

# Copy WinSW for each service
Copy-Item "$InstallPath\services\winsw.exe" "$InstallPath\services\$MongoServiceName.exe" -Force
Copy-Item "$InstallPath\services\winsw.exe" "$InstallPath\services\$ApiServiceName.exe" -Force
Copy-Item "$InstallPath\services\winsw.exe" "$InstallPath\services\$WebServiceName.exe" -Force

Write-Success "Service configurations created"

# ============================================
# 7. Install Windows Services
# ============================================

Write-Step "Installing Windows Services..."

$servicesDir = "$InstallPath\services"

# Install MongoDB Service (skip if using existing)
if (-not $global:SkipMongoService) {
    Write-Host "  Installing MongoDB service..." -ForegroundColor DarkYellow
    Push-Location $servicesDir
    & ".\$MongoServiceName.exe" install 2>$null
    Pop-Location
    Write-Success "MongoDB service installed"
} else {
    Write-Host "  [SKIP] MongoDB service (using existing)" -ForegroundColor DarkGray
}

# Install API Service
Write-Host "  Installing API service..." -ForegroundColor DarkYellow
Push-Location $servicesDir
& ".\$ApiServiceName.exe" install 2>$null
Pop-Location
Write-Success "API service installed"

# Install Web Service
Write-Host "  Installing Web service..." -ForegroundColor DarkYellow
Push-Location $servicesDir
& ".\$WebServiceName.exe" install 2>$null
Pop-Location
Write-Success "Web service installed"

# ============================================
# 8. Configure Firewall
# ============================================

Write-Step "Configuring firewall..."

netsh advfirewall firewall delete rule name="DBI-Task-API" 2>$null
netsh advfirewall firewall delete rule name="DBI-Task-Web" 2>$null
netsh advfirewall firewall delete rule name="DBI-Task-MongoDB" 2>$null

netsh advfirewall firewall add rule name="DBI-Task-API" dir=in action=allow protocol=TCP localport=$ApiPort | Out-Null
netsh advfirewall firewall add rule name="DBI-Task-Web" dir=in action=allow protocol=TCP localport=$WebPort | Out-Null
netsh advfirewall firewall add rule name="DBI-Task-MongoDB" dir=in action=allow protocol=TCP localport=$MongoPort | Out-Null

Write-Success "Firewall rules configured"

# ============================================
# 9. Start Services
# ============================================

Write-Step "Starting services..."

# Start MongoDB (skip if using existing)
if (-not $global:SkipMongoService) {
    Start-Service $MongoServiceName
    Write-Host "  Waiting for MongoDB to start..." -ForegroundColor DarkYellow
    Start-Sleep -Seconds 5
} else {
    Write-Host "  [SKIP] MongoDB already running" -ForegroundColor DarkGray
    Start-Sleep -Seconds 1
}

Start-Service $ApiServiceName
Write-Host "  Waiting for API to start..." -ForegroundColor DarkYellow
Start-Sleep -Seconds 3

Start-Service $WebServiceName
Start-Sleep -Seconds 2

Write-Success "All services started"

# ============================================
# 10. Verify Installation
# ============================================

Write-Step "Verifying installation..."

$services = @(
    @{Name=$MongoServiceName; Port=$MongoPort},
    @{Name=$ApiServiceName; Port=$ApiPort},
    @{Name=$WebServiceName; Port=$WebPort}
)

$allOk = $true
foreach ($svc in $services) {
    $service = Get-Service -Name $svc.Name -ErrorAction SilentlyContinue
    if ($service -and $service.Status -eq "Running") {
        Write-Host "  [OK] $($svc.Name) - Running on port $($svc.Port)" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $($svc.Name) - Not running" -ForegroundColor Red
        $allOk = $false
    }
}

# ============================================
# Done
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Installation Complete!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access the application:" -ForegroundColor White
Write-Host "  Frontend: http://${ServerIP}:$WebPort" -ForegroundColor Yellow
Write-Host "  API:      http://${ServerIP}:$ApiPort" -ForegroundColor Yellow
Write-Host "  Swagger:  http://${ServerIP}:$ApiPort/swagger" -ForegroundColor Yellow
Write-Host ""
Write-Host "Services will start automatically on boot." -ForegroundColor White
Write-Host ""
Write-Host "Logs located at: $InstallPath\services\*.wrapper.log" -ForegroundColor DarkGray
Write-Host ""

if (-not $allOk) {
    Write-Host "WARNING: Some services failed to start. Check logs for details." -ForegroundColor Red
}
