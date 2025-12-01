# Final comprehensive fix for all namespace conflicts
Write-Host "Final fix for namespace conflicts..."

$files = Get-ChildItem -Path "src" -Filter "*.cs" -Recurse | Where-Object { $_.FullName -match "Application|API" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Remove TaskType alias
    $content = $content -replace "using TaskType = System.Threading.Tasks.Task;`r`n", ""
   $content = $content -replace "using TaskType = System.Threading.Tasks.Task;`n", ""
    
    # Replace TaskType usage with full qualification
    $content = $content -replace "async TaskType<", "async System.Threading.Tasks.Task<"
    $content = $content -replace "async TaskType ", "async System.Threading.Tasks.Task "
    $content = $content -replace "TaskType<", "System.Threading.Tasks.Task<"
    $content = $content -replace ": TaskType<", ": System.Threading.Tasks.Task<"
    $content = $content -replace " TaskType<", " System.Threading.Tasks.Task<"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Fixed all files in Application and API layers!"
Write-Host "Building..."

cd $PSScriptRoot
dotnet build
