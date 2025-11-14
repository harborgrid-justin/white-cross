# PowerShell script to fix broken imports for moved services

# Define the mapping of old import paths to new ones
$importMappings = @{
    "'../../emergency-broadcast/emergency-broadcast.enums'" = "'@/services/communication/emergency-broadcast/emergency-broadcast.enums'"
    '"../../emergency-broadcast/emergency-broadcast.enums"' = '"@/services/communication/emergency-broadcast/emergency-broadcast.enums"'
    "'../../../services/communication/emergency-broadcast/emergency-broadcast.enums'" = "'@/services/communication/emergency-broadcast/emergency-broadcast.enums'"
    '"../../../services/communication/emergency-broadcast/emergency-broadcast.enums"' = '"@/services/communication/emergency-broadcast/emergency-broadcast.enums"'
    "'../../services/communication/emergency-broadcast/emergency-broadcast.enums'" = "'@/services/communication/emergency-broadcast/emergency-broadcast.enums'"
    '"../../services/communication/emergency-broadcast/emergency-broadcast.enums"' = '"@/services/communication/emergency-broadcast/emergency-broadcast.enums"'
    "'@/emergency-broadcast'" = "'../emergency-broadcast.enums'"
    '"@/emergency-broadcast"' = '"../emergency-broadcast.enums"'
    "'@/contact'" = "'../../contact/enums'"
    '"@/contact"' = '"../../contact/enums"'
    "'@/contact/services'" = "'./services'"
    '"@/contact/services"' = '"./services"'
    # Add more mappings as needed for other moved services
}

function Fix-ImportsInFile {
    param([string]$filePath)

    try {
        $content = Get-Content $filePath -Raw
        $changed = $false

        foreach ($mapping in $importMappings.GetEnumerator()) {
            $oldImport = $mapping.Key
            $newImport = $mapping.Value

            if ($content -match [regex]::Escape($oldImport)) {
                $content = $content -replace [regex]::Escape($oldImport), $newImport
                $changed = $true
                Write-Host "Fixed import in $filePath`: $oldImport -> $newImport"
            }
        }

        if ($changed) {
            Set-Content $filePath $content -NoNewline
        }
    } catch {
        Write-Error "Error processing $filePath`: $($_.Exception.Message)"
    }
}

function Walk-Directory {
    param([string]$dir)

    $files = Get-ChildItem $dir

    foreach ($file in $files) {
        $filePath = Join-Path $dir $file.Name

        if ($file.PSIsContainer -and -not $file.Name.StartsWith('.') -and $file.Name -ne 'node_modules' -and $file.Name -ne 'dist') {
            Walk-Directory $filePath
        } elseif (-not $file.PSIsContainer -and $file.Name.EndsWith('.ts')) {
            Fix-ImportsInFile $filePath
        }
    }
}

# Start from the src directory
$srcDir = Join-Path $PSScriptRoot 'src'
Write-Host 'Starting import fix process...'
Walk-Directory $srcDir
Write-Host 'Import fix process completed.'