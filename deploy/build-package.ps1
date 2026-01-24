# ============================================
# DBI Task - Build Deployment Package
# Run this on development machine to create deployment package
# ============================================

$ErrorActionPreference = "Stop"
$RootPath = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$DeployPath = Join-Path $RootPath "deploy"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  DBI Task - Build Deployment Package" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Root Path: $RootPath" -ForegroundColor DarkGray
Write-Host "Deploy Path: $DeployPath" -ForegroundColor DarkGray
Write-Host ""

# ============================================
# 1. Build .NET API
# ============================================

Write-Host "[*] Building .NET API..." -ForegroundColor Yellow

$apiProject = Join-Path $RootPath "src\DBI.Task.API\DBI.Task.API.csproj"
$apiOutput = Join-Path $DeployPath "api"

# Clean output
if (Test-Path $apiOutput) {
    Remove-Item $apiOutput -Recurse -Force
}

# Publish
dotnet publish $apiProject -c Release -o $apiOutput --self-contained false

if ($LASTEXITCODE -ne 0) {
    Write-Host "[-] API build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "[+] API built successfully" -ForegroundColor Green

# ============================================
# 2. Build React Frontend
# ============================================

Write-Host "[*] Building React Frontend..." -ForegroundColor Yellow

$clientPath = Join-Path $RootPath "client"
$webOutput = Join-Path $DeployPath "web"

# Clean output
if (Test-Path $webOutput) {
    Remove-Item $webOutput -Recurse -Force
}

# Install dependencies and build
Push-Location $clientPath

npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[-] npm install failed!" -ForegroundColor Red
    Pop-Location
    exit 1
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[-] npm build failed!" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location

# Copy dist to web folder
$distPath = Join-Path $clientPath "dist"
if (Test-Path $distPath) {
    Copy-Item -Path $distPath -Destination $webOutput -Recurse -Force
    Write-Host "[+] Frontend built successfully" -ForegroundColor Green
} else {
    Write-Host "[-] Frontend build output not found!" -ForegroundColor Red
    exit 1
}

# ============================================
# 3. Download NSSM
# ============================================

Write-Host "[*] Downloading NSSM (Service Manager)..." -ForegroundColor Yellow

$toolsPath = Join-Path $DeployPath "tools"
$nssmExe = Join-Path $toolsPath "nssm.exe"

if (-not (Test-Path $toolsPath)) {
    New-Item -ItemType Directory -Path $toolsPath -Force | Out-Null
}

if (-not (Test-Path $nssmExe)) {
    # Try multiple sources for NSSM
    $nssmUrls = @(
        "https://github.com/kirillkovalenko/nssm/releases/download/v2.24.101/nssm-2.24.101.zip",
        "https://raw.githubusercontent.com/nickcui/nssm/master/nssm-2.24.zip"
    )
    
    $nssmZip = "$env:TEMP\nssm.zip"
    $downloaded = $false
    
    foreach ($url in $nssmUrls) {
        try {
            Write-Host "  Trying: $url" -ForegroundColor DarkGray
            Invoke-WebRequest -Uri $url -OutFile $nssmZip -TimeoutSec 30 -ErrorAction Stop
            $downloaded = $true
            break
        } catch {
            Write-Host "  Failed, trying next source..." -ForegroundColor DarkYellow
        }
    }
    
    if ($downloaded) {
        Expand-Archive -Path $nssmZip -DestinationPath "$env:TEMP\nssm-extract" -Force
        
        # Find nssm.exe in extracted folder
        $nssmFound = Get-ChildItem "$env:TEMP\nssm-extract" -Recurse -Filter "nssm.exe" | 
                     Where-Object { $_.DirectoryName -match "win64|x64" } | 
                     Select-Object -First 1
        
        if (-not $nssmFound) {
            $nssmFound = Get-ChildItem "$env:TEMP\nssm-extract" -Recurse -Filter "nssm.exe" | Select-Object -First 1
        }
        
        if ($nssmFound) {
            Copy-Item $nssmFound.FullName $nssmExe -Force
            Write-Host "[+] NSSM downloaded" -ForegroundColor Green
        } else {
            Write-Host "[-] NSSM not found in archive" -ForegroundColor Red
        }
        
        # Cleanup
        Remove-Item $nssmZip -Force -ErrorAction SilentlyContinue
        Remove-Item "$env:TEMP\nssm-extract" -Force -Recurse -ErrorAction SilentlyContinue
    } else {
        Write-Host "[-] Could not download NSSM. Please download manually from https://nssm.cc" -ForegroundColor Red
        Write-Host "    Place nssm.exe in: $nssmExe" -ForegroundColor Yellow
    }
} else {
    Write-Host "[+] NSSM already exists" -ForegroundColor Green
}

# ============================================
# 4. Create ZIP Package
# ============================================

Write-Host "[*] Creating deployment package..." -ForegroundColor Yellow

$packageName = "DBI-Task-Deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
$packagePath = Join-Path $RootPath $packageName

# Create ZIP
Compress-Archive -Path "$DeployPath\*" -DestinationPath $packagePath -Force

$packageSize = [math]::Round((Get-Item $packagePath).Length / 1MB, 2)

Write-Host "[+] Package created: $packagePath ($packageSize MB)" -ForegroundColor Green

# ============================================
# Done
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Build Complete!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Deployment package: $packagePath" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Copy the ZIP to target machine" -ForegroundColor DarkGray
Write-Host "  2. Extract to any folder" -ForegroundColor DarkGray
Write-Host "  3. Run install.ps1 as Administrator" -ForegroundColor DarkGray
Write-Host ""
