# Fix Hook Import Paths - PowerShell Script
# Systematically fixes incorrect import paths in frontend hooks

Write-Host "Starting Hook Import Path Fixes..." -ForegroundColor Cyan

$ErrorCount = 0
$FixCount = 0
$FilesProcessed = 0

# Pattern 1: Fix lowercase API instance imports to use apiServiceRegistry
Write-Host "`n[1/6] Fixing API instance imports..." -ForegroundColor Yellow

$apiPatterns = @{
    "from '@/services/api'" = "from '@/services'"
    "import { appointmentsApi }" = "import { apiServiceRegistry }"
    "import { studentsApi }" = "import { apiServiceRegistry }"
    "import { medicationsApi }" = "import { apiServiceRegistry }"
    "import { administrationApi }" = "import { apiServiceRegistry }"
    "import { authApi }" = "import { apiServiceRegistry }"
    "import { integrationApi }" = "import { apiServiceRegistry }"
    "import { healthRecordsApi }" = "import { apiServiceRegistry }"
    "import { emergencyContactsApi }" = "import { apiServiceRegistry }"
    "import { documentsApi }" = "import { apiServiceRegistry }"
    "import { communicationApi }" = "import { apiServiceRegistry }"
    "import { reportsApi }" = "import { apiServiceRegistry }"
    "import { incidentReportsApi }" = "import { apiServiceRegistry }"
}

Get-ChildItem -Path "frontend/src/hooks" -Recurse -Filter "*.ts" -File | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    foreach ($pattern in $apiPatterns.GetEnumerator()) {
        if ($content -match [regex]::Escape($pattern.Key)) {
            $content = $content -replace [regex]::Escape($pattern.Key), $pattern.Value
            $FixCount++
        }
    }

    # Fix usage patterns - add .apiName before method calls
    $apiUsagePatterns = @(
        @{ old = 'appointmentsApi\.'; new = 'apiServiceRegistry.appointmentsApi.' }
        @{ old = 'studentsApi\.'; new = 'apiServiceRegistry.studentsApi.' }
        @{ old = 'medicationsApi\.'; new = 'apiServiceRegistry.medicationsApi.' }
        @{ old = 'administrationApi\.'; new = 'apiServiceRegistry.administrationApi.' }
        @{ old = 'authApi\.'; new = 'apiServiceRegistry.authApi.' }
        @{ old = 'integrationApi\.'; new = 'apiServiceRegistry.integrationApi.' }
        @{ old = 'healthRecordsApi\.'; new = 'apiServiceRegistry.healthRecordsApi.' }
        @{ old = 'emergencyContactsApi\.'; new = 'apiServiceRegistry.emergencyContactsApi.' }
        @{ old = 'documentsApi\.'; new = 'apiServiceRegistry.documentsApi.' }
        @{ old = 'communicationApi\.'; new = 'apiServiceRegistry.communicationApi.' }
        @{ old = 'reportsApi\.'; new = 'apiServiceRegistry.reportsApi.' }
        @{ old = 'incidentReportsApi\.'; new = 'apiServiceRegistry.incidentReportsApi.' }
    )

    foreach ($usagePattern in $apiUsagePatterns) {
        # Only replace if not already prefixed with apiServiceRegistry
        if ($content -match $usagePattern.old -and $content -notmatch "apiServiceRegistry\.$($usagePattern.old)") {
            $content = $content -replace $usagePattern.old, $usagePattern.new
        }
    }

    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
        $FilesProcessed++
    }
}

# Pattern 2: Fix module-specific imports
Write-Host "`n[2/6] Fixing module-specific imports..." -ForegroundColor Yellow

$modulePatterns = @{
    "from '@/services/modules/studentsApi'" = "from '@/services'"
    "from '@/services/modules/medicationsApi'" = "from '@/services'"
    "from '@/services/modules/incidentReportsApi'" = "from '@/services'"
    "{ studentsApi }" = "{ apiServiceRegistry }"
    "{ medicationsApi }" = "{ apiServiceRegistry }"
    "{ incidentReportsApi }" = "{ apiServiceRegistry }"
}

Get-ChildItem -Path "frontend/src/hooks" -Recurse -Filter "*.ts" -File | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    foreach ($pattern in $modulePatterns.GetEnumerator()) {
        if ($content -match [regex]::Escape($pattern.Key)) {
            $content = $content -replace [regex]::Escape($pattern.Key), $pattern.Value
            $FixCount++
        }
    }

    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
        $FilesProcessed++
    }
}

# Pattern 3: Fix relative service imports
Write-Host "`n[3/6] Fixing relative service imports..." -ForegroundColor Yellow

Get-ChildItem -Path "frontend/src/hooks" -Recurse -Filter "*.ts" -File | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    # Fix various levels of relative imports for services
    $content = $content -replace "from '\.\./\.\./\.\./services/", "from '@/services/"
    $content = $content -replace "from '\.\./\.\./services/", "from '@/services/"
    $content = $content -replace "from '\.\./services/", "from '@/services/"

    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
        $FilesProcessed++
    }
}

# Pattern 4: Fix hook imports
Write-Host "`n[4/6] Fixing hook imports..." -ForegroundColor Yellow

Get-ChildItem -Path "frontend/src/hooks" -Recurse -Filter "*.ts" -File | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    # Fix relative imports for hooks
    $content = $content -replace "from '\.\./\.\./\.\./hooks/", "from '@/hooks/"
    $content = $content -replace "from '\.\./\.\./hooks/", "from '@/hooks/"
    $content = $content -replace "from '\.\./hooks/", "from '@/hooks/"

    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
        $FilesProcessed++
    }
}

# Pattern 5: Fix store/slice imports
Write-Host "`n[5/6] Fixing store/slice imports..." -ForegroundColor Yellow

Get-ChildItem -Path "frontend/src/hooks" -Recurse -Filter "*.ts" -File | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    # Fix relative imports for stores
    $content = $content -replace "from '\.\./\.\./\.\./slices/", "from '@/stores/slices/"
    $content = $content -replace "from '\.\./\.\./slices/", "from '@/stores/slices/"
    $content = $content -replace "from '\.\./slices/", "from '@/stores/slices/"
    $content = $content -replace "from 'slices/", "from '@/stores/slices/"

    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
        $FilesProcessed++
    }
}

# Pattern 6: Fix type imports
Write-Host "`n[6/6] Fixing type imports..." -ForegroundColor Yellow

Get-ChildItem -Path "frontend/src/hooks" -Recurse -Filter "*.ts" -File | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    # Fix relative imports for types
    $content = $content -replace "from '\.\./\.\./\.\./types/", "from '@/types/"
    $content = $content -replace "from '\.\./\.\./types/", "from '@/types/"
    $content = $content -replace "from '\.\./types/", "from '@/types/"

    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
        $FilesProcessed++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Hook Import Fixes Complete!" -ForegroundColor Green
Write-Host "Files Processed: $FilesProcessed" -ForegroundColor White
Write-Host "Patterns Fixed: $FixCount" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
