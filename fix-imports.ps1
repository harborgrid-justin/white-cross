# Fix corrupted shadcn/ui imports

Write-Host "Searching for corrupted imports..."

# Search for imports with double quotes or malformed paths
$files = Get-ChildItem -Path "frontend/src" -Recurse -Include "*.tsx","*.ts"

$corruptedFiles = @()

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Check for various corruption patterns
    if ($content -match "from\s+[`"'][`"']components/ui" -or 
        $content -match "from\s+[`"'][^@]*components/ui" -or
        $content -match "from\s+[`"']\s*[`"']components") {
        
        Write-Host "Found corrupted import in: $($file.FullName)"
        $corruptedFiles += $file
    }
}

if ($corruptedFiles.Count -eq 0) {
    Write-Host "No corrupted imports found. Checking for missing @ symbols..."
    
    # Search for imports missing @ symbol
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw
        if ($content -match "from\s+[`"'][^@/]*components/ui" -and $content -notmatch "from\s+[`"']@/components/ui") {
            Write-Host "Found import missing @ symbol in: $($file.FullName)"
            $corruptedFiles += $file
        }
    }
}

Write-Host "Found $($corruptedFiles.Count) files with potential import issues"

# Fix the imports
foreach ($file in $corruptedFiles) {
    Write-Host "Fixing imports in: $($file.FullName)"
    
    $content = Get-Content $file.FullName -Raw
    
    # Fix double quotes
    $content = $content -replace "from\s+[`"'][`"']components/ui", "from '@/components/ui"
    
    # Fix missing @ symbol
    $content = $content -replace "from\s+[`"']components/ui", "from '@/components/ui"
    
    # Fix malformed quotes
    $content = $content -replace "from\s+[`"']\s*[`"']components", "from '@/components"
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Import fixing complete!"
