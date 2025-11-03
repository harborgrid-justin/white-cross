# Fix corrupted shadcn/ui imports - Compatible with older PowerShell

Write-Host "Searching for corrupted imports..."

# Search for imports with malformed paths
$files = Get-ChildItem -Path "frontend/src" -Recurse -Include "*.tsx","*.ts"

Write-Host "Found $($files.Count) TypeScript files to check"

$fixedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName | Out-String
    $originalContent = $content
    
    # Fix common corruption patterns
    $content = $content -replace "from\s+[`"'][`"']components/ui", "from '@/components/ui"
    $content = $content -replace "from\s+[`"']components/ui", "from '@/components/ui"
    $content = $content -replace "from\s+[`"']\s+[`"']components", "from '@/components"
    
    # Check if any changes were made
    if ($content -ne $originalContent) {
        Write-Host "Fixing imports in: $($file.FullName)"
        $content | Set-Content -Path $file.FullName -NoNewline
        $fixedCount++
    }
}

Write-Host "Fixed imports in $fixedCount files"
Write-Host "Import fixing complete!"
