# Bulk fix all shadcn/ui import issues

Write-Host "Starting bulk import fix..."

# Define replacement patterns
$patterns = @(
    @{ Find = "from\s+''\s*components/ui/"; Replace = "from '@/components/ui/" },
    @{ Find = 'from\s+""\s*components/ui/'; Replace = "from '@/components/ui/" },
    @{ Find = "from\s+'\s*'\s*components/ui/"; Replace = "from '@/components/ui/" },
    @{ Find = 'from\s+"\s*"\s*components/ui/'; Replace = "from '@/components/ui/" },
    @{ Find = "from\s+'components/ui/"; Replace = "from '@/components/ui/" },
    @{ Find = 'from\s+"components/ui/'; Replace = "from '@/components/ui/" }
)

# Process files in batches to avoid timeout
$allFiles = Get-ChildItem -Path "frontend/src" -Recurse -Include "*.tsx","*.ts" | Where-Object { Test-Path $_.FullName }
$batchSize = 100
$totalFiles = $allFiles.Count
$processedFiles = 0
$fixedFiles = 0

Write-Host "Found $totalFiles files to process"

for ($i = 0; $i -lt $totalFiles; $i += $batchSize) {
    $batch = $allFiles | Select-Object -Skip $i -First $batchSize
    
    foreach ($file in $batch) {
        try {
            $content = Get-Content $file.FullName -ErrorAction Stop
            $originalContent = $content -join "`n"
            $newContent = $originalContent
            
            # Apply all patterns
            foreach ($pattern in $patterns) {
                $newContent = $newContent -replace $pattern.Find, $pattern.Replace
            }
            
            if ($originalContent -ne $newContent) {
                $newContent | Set-Content -Path $file.FullName -NoNewline
                Write-Host "Fixed: $($file.Name)"
                $fixedFiles++
            }
            
            $processedFiles++
            if ($processedFiles % 50 -eq 0) {
                Write-Host "Processed $processedFiles/$totalFiles files..."
            }
        }
        catch {
            Write-Host "Skipped: $($file.Name) (error: $($_.Exception.Message))"
        }
    }
}

Write-Host "Completed! Processed $processedFiles files, fixed $fixedFiles files"
