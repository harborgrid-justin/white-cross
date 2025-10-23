# PowerShell script to fix TS7006 errors in frontend codebase
# This script adds type annotations to parameters that implicitly have 'any' type

$ErrorActionPreference = 'Continue'
$frontendPath = "F:\temp\white-cross\frontend"

Write-Host "Starting TS7006 error fixes..." -ForegroundColor Green
Write-Host "Working directory: $frontendPath" -ForegroundColor Cyan

# Function to replace text in file
function Update-FileContent {
    param(
        [string]$FilePath,
        [string]$OldText,
        [string]$NewText
    )

    try {
        $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
        if ($content -match [regex]::Escape($OldText)) {
            $content = $content -replace [regex]::Escape($OldText), $NewText
            Set-Content -Path $FilePath -Value $content -Encoding UTF8 -NoNewline
            Write-Host "  ✓ Updated: $FilePath" -ForegroundColor Green
            return $true
        } else {
            Write-Host "  ⚠ Pattern not found in: $FilePath" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "  ✗ Error updating: $FilePath - $_" -ForegroundColor Red
        return $false
    }
}

# Fix 1: Student statistics hooks
Write-Host "`nFixing student statistics hooks..." -ForegroundColor Yellow
$file = "$frontendPath\src\hooks\domains\students\queries\statistics.ts"
Update-FileContent $file "students.filter(s => s.isActive)" "students.filter((s: Student) => s.isActive)"
Update-FileContent $file "students.filter(s => !s.isActive)" "students.filter((s: Student) => !s.isActive)"
Update-FileContent $file "students.filter(s => `r`n        s.enrollmentDate" "students.filter((s: Student) =>`r`n        s.enrollmentDate"
Update-FileContent $file "students.reduce((acc, student) =>" "students.reduce((acc: Record<string, number>, student: Student) =>"

Write-Host "`nFix script completed!" -ForegroundColor Green
