# PowerShell script to fix double-wrapped API response types in Health APIs
# Root cause: Passing ApiResponse<T> as type parameter creates ApiResponse<ApiResponse<T>>
# Fix: Remove ApiResponse wrapper from type parameters

$healthApiFiles = @(
    "frontend/src/services/modules/health/allergiesApi.ts",
    "frontend/src/services/modules/health/chronicConditionsApi.ts",
    "frontend/src/services/modules/health/vaccinationsApi.ts",
    "frontend/src/services/modules/health/screeningsApi.ts",
    "frontend/src/services/modules/health/healthRecordsApi.ts",
    "frontend/src/services/modules/health/growthMeasurementsApi.ts",
    "frontend/src/services/modules/health/vitalSignsApi.ts"
)

$patterns = @{
    # Pattern: client.get<ApiResponse<Type>>(...) -> client.get<Type>(...)
    'client\.get<ApiResponse<([^>]+)>>' = 'client.get<$1>'

    # Pattern: client.post<ApiResponse<Type>>(...) -> client.post<Type>(...)
    'client\.post<ApiResponse<([^>]+)>>' = 'client.post<$1>'

    # Pattern: client.put<ApiResponse<Type>>(...) -> client.put<Type>(...)
    'client\.put<ApiResponse<([^>]+)>>' = 'client.put<$1>'

    # Pattern: client.patch<ApiResponse<Type>>(...) -> client.patch<Type>(...)
    'client\.patch<ApiResponse<([^>]+)>>' = 'client.patch<$1>'

    # Pattern: client.delete<ApiResponse<Type>>(...) -> client.delete<Type>(...)
    'client\.delete<ApiResponse<([^>]+)>>' = 'client.delete<$1>'
}

foreach ($file in $healthApiFiles) {
    $filePath = Join-Path $PSScriptRoot $file

    if (Test-Path $filePath) {
        Write-Host "Processing $file..." -ForegroundColor Cyan

        $content = Get-Content $filePath -Raw
        $originalContent = $content
        $changeCount = 0

        foreach ($pattern in $patterns.GetEnumerator()) {
            $matches = [regex]::Matches($content, $pattern.Key)
            if ($matches.Count -gt 0) {
                Write-Host "  Found $($matches.Count) matches for pattern: $($pattern.Key)" -ForegroundColor Yellow
                $content = $content -replace $pattern.Key, $pattern.Value
                $changeCount += $matches.Count
            }
        }

        if ($content -ne $originalContent) {
            Set-Content $filePath $content -NoNewline
            Write-Host "  Fixed $changeCount double-wrapping issues in $file" -ForegroundColor Green
        } else {
            Write-Host "  No changes needed for $file" -ForegroundColor Gray
        }
    } else {
        Write-Host "  File not found: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done! Now run npx tsc to verify fixes." -ForegroundColor Green
