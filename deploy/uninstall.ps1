# ============================================
# DBI Task - Windows Uninstallation Script
# Run as Administrator
# ============================================

#Requires -RunAsAdministrator

$ErrorActionPreference = "SilentlyContinue"
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Load configuration
. "$ScriptPath\config.ps1"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  DBI Task - Uninstallation" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$confirm = Read-Host "Are you sure you want to uninstall DBI Task? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

$servicesDir = "$InstallPath\services"

# Stop and remove services
$services = @($WebServiceName, $ApiServiceName, $MongoServiceName)
foreach ($svc in $services) {
    Write-Host "[*] Removing service: $svc" -ForegroundColor Yellow
    
    $service = Get-Service -Name $svc -ErrorAction SilentlyContinue
    if ($service) {
        Stop-Service -Name $svc -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
        
        # Uninstall using WinSW
        if (Test-Path "$servicesDir\$svc.exe") {
            Push-Location $servicesDir
            & ".\$svc.exe" uninstall 2>$null
            Pop-Location
        } else {
            sc.exe delete $svc 2>$null
        }
        
        Write-Host "  [OK] Removed" -ForegroundColor Green
    } else {
        Write-Host "  [SKIP] Not found" -ForegroundColor DarkGray
    }
}

# Remove firewall rules
Write-Host "[*] Removing firewall rules..." -ForegroundColor Yellow
netsh advfirewall firewall delete rule name="DBI-Task-API" 2>$null
netsh advfirewall firewall delete rule name="DBI-Task-Web" 2>$null
netsh advfirewall firewall delete rule name="DBI-Task-MongoDB" 2>$null
Write-Host "  [OK] Firewall rules removed" -ForegroundColor Green

# Remove installation directory
$removeData = Read-Host "Remove installation directory and all data? (y/N)"
if ($removeData -eq "y" -or $removeData -eq "Y") {
    Write-Host "[*] Removing installation directory..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    Remove-Item -Path $InstallPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  [OK] Removed $InstallPath" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Uninstallation Complete!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
