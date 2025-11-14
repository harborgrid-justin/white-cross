# PowerShell script to update import paths for folders moved to services/

param(
    [string]$RootPath = "/workspaces/white-cross/backend/src"
)

# Folders that were moved to services/
$movedFolders = @("clinical", "communication", "student", "user", "allergy", "chronic-condition", "academic-transcript", "administration", "access-control", "mobile", "workers", "audit", "security")

# Function to update imports in a file
function Update-Imports {
    param([string]$FilePath)

    $content = Get-Content $FilePath -Raw
    $updated = $false

    foreach ($folder in $movedFolders) {
        # Pattern for imports like '../../clinical/'
        $oldPattern = "../../$folder/"
        $newPattern = "../../../services/$folder/"

        if ($content -match $oldPattern) {
            $content = $content -replace [regex]::Escape($oldPattern), $newPattern
            $updated = $true
            Write-Host "Updated import in $FilePath : $oldPattern -> $newPattern"
        }
    }

    if ($updated) {
        Set-Content $FilePath $content -Encoding UTF8
    }
}

# Find all TypeScript files
$tsFiles = Get-ChildItem -Path $RootPath -Recurse -Filter "*.ts" | Where-Object { $_.FullName -notlike "*node_modules*" }

foreach ($file in $tsFiles) {
    Update-Imports -FilePath $file.FullName
}

Write-Host "Import path update completed."