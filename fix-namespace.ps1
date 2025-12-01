# Fix namespace conflicts
$files = @(
    "src\DBI.Task.Application\Services\AuthService.cs",
    "src\DBI.Task.Application\Services\TaskService.cs",
    "src\DBI.Task.Application\Services\DashboardService.cs",
    "src\DBI.Task.API\Controllers\AuthController.cs",
    "src\DBI.Task.API\Controllers\ProjectsController.cs",
    "src\DBI.Task.API\Controllers\TasksController.cs",
    "src\DBI.Task.API\Controllers\DashboardController.cs",
    "src\DBI.Task.API\Controllers\CommentsController.cs",
    "src\DBI.Task.API\Controllers\NotificationsController.cs"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Only modify if it contains async Task
        if ($content -match "async Task") {
            # Add using alias if not already present
            if ($content -notmatch "using TaskType") {
                $content = $content -replace "(namespace [^;]+;)", "using TaskType = System.Threading.Tasks.Task;`r`n`$1"
            }
            
            # Replace Task with TaskType in method signatures
            $content = $content -replace "async Task<", "async TaskType<"
            $content = $content -replace "async Task\s+", "async TaskType "
            
            Set-Content -Path $file -Value $content -NoNewline
            Write-Host "Fixed: $file"
        }
    }
}

Write-Host "Done!"
