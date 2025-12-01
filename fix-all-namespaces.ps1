# Comprehensive fix for namespace conflicts
Write-Host "Fixing namespace conflicts..."

# Fix all C# files in Application and API layers
$patterns = @(
    @{Find = "Task<AuthResponse"; Replace = "System.Threading.Tasks.Task<AuthResponse"},
    @{Find = "async Task<"; Replace = "async System.Threading.Tasks.Task<"},
    @{Find = "async Task "; Replace = "async System.Threading.Tasks.Task "},
    @{Find = ": Task<"; Replace = ": System.Threading.Tasks.Task<"},
    @{Find = "Task<IActionResult>"; Replace = "System.Threading.Tasks.Task<IActionResult>"},
    @{Find = "Task<DashboardDto>"; Replace = "System.Threading.Tasks.Task<DashboardDto>"},
    @{Find = "Task<IEnumerable"; Replace = "System.Threading.Tasks.Task<IEnumerable"},
    @{Find = "Task<TaskDto"; Replace = "System.Threading.Tasks.Task<TaskDto"},
    @{Find = "Task<bool>"; Replace = "System.Threading.Tasks.Task<bool>"}
)

$files = Get-ChildItem -Path "src\DBI.Task.Application", "src\DBI.Task.API" -Filter "*.cs" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    foreach ($pattern in $patterns) {
        if ($content -match [regex]::Escape($pattern.Find)) {
            $content = $content -replace [regex]::Escape($pattern.Find), $pattern.Replace
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)"
    }
}

Write-Host "Done! Run 'dotnet build' to verify."
