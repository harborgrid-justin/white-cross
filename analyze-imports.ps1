# Categorize TS2307 errors
$errorLines = Get-Content "remaining-imports.txt"

$categories = @{
    'stores-slices' = @()
    'missing-components' = @()
    'missing-hooks' = @()
    'wrong-api-paths' = @()
    'missing-types' = @()
    'legacy-paths' = @()
    'other' = @()
}

foreach ($line in $errorLines) {
    if ($line -match "stores/slices/") {
        $categories['stores-slices'] += $line
    }
    elseif ($line -match "Cannot find module '\./components/" -or $line -match "Cannot find module '\.\./\.\./components/") {
        $categories['missing-components'] += $line
    }
    elseif ($line -match "hooks/" -and $line -match "Cannot find") {
        $categories['missing-hooks'] += $line
    }
    elseif ($line -match "services/(api|modules)" -or $line -match "Api'" -or $line -match "apiServiceRegistry") {
        $categories['wrong-api-paths'] += $line
    }
    elseif ($line -match "types/" -or $line -match "\.types") {
        $categories['missing-types'] += $line
    }
    elseif ($line -match "\.\./\.\./reduxStore" -or $line -match "\.\./\.\./api" -or $line -match "sliceFactory") {
        $categories['legacy-paths'] += $line
    }
    else {
        $categories['other'] += $line
    }
}

Write-Host "`n=== Import Error Categories ==="
foreach ($cat in $categories.Keys | Sort-Object) {
    Write-Host "`n$cat : $($categories[$cat].Count) errors"
}
