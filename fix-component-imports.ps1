# Fix Component Import Paths - PowerShell Script
# Fixes incorrect API imports in components

Write-Host "Starting Component Import Path Fixes..." -ForegroundColor Cyan

$ErrorCount = 0
$FixCount = 0
$FilesProcessed = 0

# Fix components importing from @/services/api
Write-Host "`n[1/3] Fixing settings component imports..." -ForegroundColor Yellow

$settingsFiles = @(
    "frontend/src/components/features/settings/components/tabs/AuditLogsTab.tsx",
    "frontend/src/components/features/settings/components/tabs/BackupsTab.tsx",
    "frontend/src/components/features/settings/components/tabs/DistrictsTab.tsx",
    "frontend/src/components/features/settings/components/tabs/LicensesTab.tsx",
    "frontend/src/components/features/settings/components/tabs/OverviewTab.tsx",
    "frontend/src/components/features/settings/components/tabs/SchoolsTab.tsx",
    "frontend/src/components/features/settings/components/tabs/TrainingTab.tsx",
    "frontend/src/components/features/settings/components/tabs/IntegrationModal.tsx",
    "frontend/src/components/features/settings/components/tabs/IntegrationsTab.tsx"
)

foreach ($filePath in $settingsFiles) {
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $originalContent = $content

        # Replace imports
        $content = $content -replace "from '@/services/api'", "from '@/services'"
        $content = $content -replace "import \{ administrationApi \}", "import { apiServiceRegistry }"
        $content = $content -replace "import \{ integrationApi \}", "import { apiServiceRegistry }"

        # Replace usage
        $content = $content -replace "administrationApi\.", "apiServiceRegistry.administrationApi."
        $content = $content -replace "integrationApi\.", "apiServiceRegistry.integrationApi."

        if ($content -ne $originalContent) {
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "  Fixed: $filePath" -ForegroundColor Green
            $FilesProcessed++
            $FixCount++
        }
    }
}

# Fix other service imports
Write-Host "`n[2/3] Fixing misc component imports..." -ForegroundColor Yellow

$componentPatterns = @{
    "from '@/services/api'" = "from '@/services'"
    "import \{ auditService \}" = "import { apiServiceRegistry }"
    "auditService\." = "apiServiceRegistry.auditApi."
}

Get-ChildItem -Path "frontend/src/components" -Recurse -Include "*.tsx","*.ts" -File | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    foreach ($pattern in $componentPatterns.GetEnumerator()) {
        if ($content -match $pattern.Key) {
            $content = $content -replace $pattern.Key, $pattern.Value
        }
    }

    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
        $FilesProcessed++
    }
}

# Fix security service imports
Write-Host "`n[3/3] Fixing security service imports..." -ForegroundColor Yellow

$securityFiles = @(
    "frontend/src/bootstrap.ts",
    "frontend/src/components/shared/errors/GlobalErrorBoundary.tsx"
)

foreach ($filePath in $securityFiles) {
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $originalContent = $content

        # Fix security imports
        $content = $content -replace "import \{ secureTokenManager \} from", "import { SecureTokenManager } from"
        $content = $content -replace "import \{ csrfProtection, setupCsrfProtection \} from", "import { CsrfProtection } from"
        $content = $content -replace "import \{ auditService \} from", "import { AuditService } from"

        # Fix instantiation patterns
        $content = $content -replace "setupCsrfProtection\(\)", "CsrfProtection.getInstance().initialize()"
        $content = $content -replace "secureTokenManager\.", "SecureTokenManager.getInstance()."
        $content = $content -replace "auditService\.", "AuditService.getInstance()."

        if ($content -ne $originalContent) {
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "  Fixed: $filePath" -ForegroundColor Green
            $FilesProcessed++
            $FixCount++
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Component Import Fixes Complete!" -ForegroundColor Green
Write-Host "Files Processed: $FilesProcessed" -ForegroundColor White
Write-Host "Patterns Fixed: $FixCount" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
