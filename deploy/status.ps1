# ============================================
# DBI Task - Service Status
# ============================================

$ErrorActionPreference = "SilentlyContinue"
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Try to load config
$configPath = "$ScriptPath\config.ps1"
if (Test-Path $configPath) {
    . $configPath
} else {
    # Default values
    $ApiServiceName = "DBI-Task-API"
    $WebServiceName = "DBI-Task-Web"
    $MongoServiceName = "DBI-Task-MongoDB"
    $ApiPort = 5000
    $WebPort = 3000
    $MongoPort = 27017
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  DBI Task - Service Status" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$services = @(
    @{Name=$MongoServiceName; Port=$MongoPort; Label="MongoDB"},
    @{Name=$ApiServiceName; Port=$ApiPort; Label="API"},
    @{Name=$WebServiceName; Port=$WebPort; Label="Web"}
)

foreach ($svc in $services) {
    $service = Get-Service -Name $svc.Name -ErrorAction SilentlyContinue
    $status = if ($service) { $service.Status } else { "Not Installed" }
    
    $color = switch ($status) {
        "Running" { "Green" }
        "Stopped" { "Red" }
        default { "DarkGray" }
    }
    
    $portCheck = ""
    if ($status -eq "Running") {
        $conn = Test-NetConnection -ComputerName localhost -Port $svc.Port -WarningAction SilentlyContinue
        if ($conn.TcpTestSucceeded) {
            $portCheck = " (Port $($svc.Port) OK)"
        } else {
            $portCheck = " (Port $($svc.Port) NOT responding)"
            $color = "Yellow"
        }
    }
    
    Write-Host "  $($svc.Label): " -NoNewline
    Write-Host "$status$portCheck" -ForegroundColor $color
}

Write-Host ""
Write-Host "Commands:" -ForegroundColor DarkGray
Write-Host "  Start all:   Start-Service $MongoServiceName, $ApiServiceName, $WebServiceName" -ForegroundColor DarkGray
Write-Host "  Stop all:    Stop-Service $WebServiceName, $ApiServiceName, $MongoServiceName" -ForegroundColor DarkGray
Write-Host "  Restart API: Restart-Service $ApiServiceName" -ForegroundColor DarkGray
Write-Host ""
