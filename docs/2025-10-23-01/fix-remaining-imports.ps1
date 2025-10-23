# Fix Remaining Import Issues - PowerShell Script

Write-Host "Starting Final Import Fixes..." -ForegroundColor Cyan

$FilesProcessed = 0

# Fix 1: AuthContext import - useAuthContext → useAuth
Write-Host "`n[1/5] Fixing AuthContext imports..." -ForegroundColor Yellow

Get-ChildItem -Path "frontend/src" -Recurse -Include "*.tsx","*.ts" -File | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    # Fix import statement
    $content = $content -replace "import \{ useAuthContext \}", "import { useAuth }"
    # Fix usage
    $content = $content -replace "const .* = useAuthContext\(\)", "const auth = useAuth()"
    $content = $content -replace "useAuthContext", "useAuth"

    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
        $FilesProcessed++
    }
}

# Fix 2: GlobalErrorBoundary - wrong import path
Write-Host "`n[2/5] Fixing GlobalErrorBoundary imports..." -ForegroundColor Yellow

$errorBoundaryFile = "frontend/src/components/shared/errors/GlobalErrorBoundary.tsx"
if (Test-Path $errorBoundaryFile) {
    $content = Get-Content $errorBoundaryFile -Raw
    $originalContent = $content

    # Fix import - should import from @/services not audit/AuditService
    $content = $content -replace "from '\.\./\.\./services/audit/AuditService'", "from '@/services'"

    if ($content -ne $originalContent) {
        Set-Content -Path $errorBoundaryFile -Value $content -NoNewline
        Write-Host "  Fixed: GlobalErrorBoundary.tsx" -ForegroundColor Green
        $FilesProcessed++
    }
}

# Fix 3: Health records type imports
Write-Host "`n[3/5] Fixing health records type imports..." -ForegroundColor Yellow

$healthRecordsFile = "frontend/src/hooks/domains/health/queries/useHealthRecords.ts"
if (Test-Path $healthRecordsFile) {
    $content = Get-Content $healthRecordsFile -Raw
    $originalContent = $content

    # Fix type names
    $content = $content -replace "CreateHealthRecordRequest", "CreateHealthRecordData"
    $content = $content -replace "CreateAllergyRequest", "CreateAllergyData"
    $content = $content -replace "CreateChronicConditionRequest", "CreateChronicConditionData"
    $content = $content -replace "CreateVaccinationRequest", "CreateVaccinationData"
    $content = $content -replace "HealthRecordsApiError", "ApiError"

    if ($content -ne $originalContent) {
        Set-Content -Path $healthRecordsFile -Value $content -NoNewline
        Write-Host "  Fixed: useHealthRecords.ts" -ForegroundColor Green
        $FilesProcessed++
    }
}

# Fix 4: Medication type imports
Write-Host "`n[4/5] Fixing medication type imports..." -ForegroundColor Yellow

$medicationFiles = @(
    "frontend/src/hooks/domains/medications/mutations/useOptimisticMedications.ts",
    "frontend/src/hooks/domains/medications/queries/useMedicationsData.ts"
)

foreach ($filePath in $medicationFiles) {
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $originalContent = $content

        # Fix type names
        $content = $content -replace "CreateMedicationRequest", "CreateMedicationData"
        $content = $content -replace "CreateInventoryRequest", "CreateInventoryItemRequest"
        $content = $content -replace "UpdateInventoryRequest", "UpdateInventoryItemRequest"
        $content = $content -replace "MedicationStatsResponse", "MedicationStats"

        # Fix Medication type import - should come from @/types not @/types/medications
        $content = $content -replace "from '@/types/medications'", "from '@/types'"

        if ($content -ne $originalContent) {
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "  Fixed: $(Split-Path $filePath -Leaf)" -ForegroundColor Green
            $FilesProcessed++
        }
    }
}

# Fix 5: Student type imports
Write-Host "`n[5/5] Fixing student type imports..." -ForegroundColor Yellow

Get-ChildItem -Path "frontend/src/hooks/domains/students" -Recurse -Filter "*.ts" -File | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    # Fix type imports - use @/types instead of @/types/student.types
    if ($content -match "from '@/types/student\.types'") {
        $content = $content -replace "from '@/types/student\.types'", "from '@/types'"
        $content = $content -replace "CreateStudentData", "CreateStudentRequest"
        $content = $content -replace "UpdateStudentData", "UpdateStudentRequest"
    }

    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
        $FilesProcessed++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Final Import Fixes Complete!" -ForegroundColor Green
Write-Host "Files Processed: $FilesProcessed" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
