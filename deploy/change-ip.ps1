# ============================================
# DBI Task - Change IP/Port Configuration
# Run as Administrator
# ============================================

param(
    [string]$ApiIP = "",
    [string]$ApiPort = "",
    [string]$WebPort = ""
)

$ErrorActionPreference = "Stop"
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Load configuration
. "$ScriptPath\config.ps1"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  DBI Task - Change IP Configuration" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Current values
Write-Host "Current configuration:" -ForegroundColor Yellow
Write-Host "  API Port: $global:ApiPort" -ForegroundColor DarkGray
Write-Host "  Web Port: $global:WebPort" -ForegroundColor DarkGray
Write-Host ""

# Get new values if not provided as parameters
if (-not $ApiIP) {
    $defaultIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -notmatch '^169\.' } | Select-Object -First 1).IPAddress
    if (-not $defaultIP) { $defaultIP = "localhost" }
    
    $ApiIP = Read-Host "Enter API IP address (default: $defaultIP)"
    if (-not $ApiIP) { $ApiIP = $defaultIP }
}

if (-not $ApiPort) {
    $ApiPort = Read-Host "Enter API port (default: $($global:ApiPort))"
    if (-not $ApiPort) { $ApiPort = $global:ApiPort }
}

if (-not $WebPort) {
    $WebPort = Read-Host "Enter Web port (default: $($global:WebPort))"
    if (-not $WebPort) { $WebPort = $global:WebPort }
}

Write-Host ""
Write-Host "New configuration:" -ForegroundColor Green
Write-Host "  API URL: http://${ApiIP}:${ApiPort}/api" -ForegroundColor Yellow
Write-Host "  Web URL: http://${ApiIP}:${WebPort}" -ForegroundColor Yellow
Write-Host ""

# Update frontend config.json
$webConfigPath = "$InstallPath\web\config.json"
if (Test-Path $webConfigPath) {
    $webConfig = @{
        apiUrl = "http://${ApiIP}:${ApiPort}/api"
    }
    $webConfig | ConvertTo-Json | Set-Content $webConfigPath -Encoding UTF8
    Write-Host "[+] Frontend config updated" -ForegroundColor Green
} else {
    Write-Host "[-] Frontend config not found at: $webConfigPath" -ForegroundColor Red
}

# Update API CORS configuration
$appsettingsPath = "$InstallPath\api\appsettings.json"
if (Test-Path $appsettingsPath) {
    $config = Get-Content $appsettingsPath -Raw | ConvertFrom-Json
    
    # Update CORS to allow the new origin
    if (-not $config.Cors) {
        $config | Add-Member -Type NoteProperty -Name "Cors" -Value @{} -Force
    }
    $config.Cors.AllowedOrigins = "http://${ApiIP}:${WebPort}"
    
    $config | ConvertTo-Json -Depth 10 | Set-Content $appsettingsPath -Encoding UTF8
    Write-Host "[+] API CORS config updated" -ForegroundColor Green
} else {
    Write-Host "[-] API config not found at: $appsettingsPath" -ForegroundColor Red
}

# Restart services to apply changes
Write-Host ""
$restart = Read-Host "Restart services to apply changes? (Y/n)"
if ($restart -ne "n" -and $restart -ne "N") {
    Write-Host "[*] Restarting services..." -ForegroundColor Yellow
    
    Restart-Service $global:WebServiceName -ErrorAction SilentlyContinue
    Restart-Service $global:ApiServiceName -ErrorAction SilentlyContinue
    
    Start-Sleep -Seconds 3
    Write-Host "[+] Services restarted" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Configuration Updated!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor White
Write-Host "  http://${ApiIP}:${WebPort}" -ForegroundColor Yellow
Write-Host ""
