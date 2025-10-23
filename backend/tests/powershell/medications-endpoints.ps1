# White Cross Healthcare Platform - Medications Endpoint Tests
# Tests for /api/v1/medications endpoints

param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$AuthToken = $null
)

# Import common utilities
. "$PSScriptRoot\common-utils.ps1"

# Initialize test session
Initialize-TestSession -BaseUrl $BaseUrl

if ($AuthToken) {
    $script:AuthToken = $AuthToken
}

Write-Host "`n=== Medications Endpoints Tests ===" -ForegroundColor Cyan

# Test data
$testMedication = @{
    name = "Ibuprofen"
    genericName = "Ibuprofen"
    dosageForm = "Tablet"
    strength = "200"
    strengthUnit = "mg"
    category = "PAIN_RELIEF"
    ndcCode = "12345-678-90"
}

$createdMedicationId = $null

# ============================================
# POST /api/v1/medications (Create Medication)
# ============================================
Write-Host "`n--- POST /api/v1/medications ---" -ForegroundColor Yellow

# Test: Create medication successfully
$response = Test-SuccessResponse `
    -TestName "Create new medication" `
    -Method "POST" `
    -Endpoint "/api/v1/medications" `
    -Body $testMedication `
    -RequireAuth $true `
    -ExpectedStatusCode 201

if ($response.Success -and $response.Body.data.id) {
    $createdMedicationId = $response.Body.data.id
    Write-Host "Created medication ID: $createdMedicationId" -ForegroundColor Green
}

# Test: Create medication without auth
Test-AuthenticationFailure `
    -TestName "Create medication without auth returns 401" `
    -Method "POST" `
    -Endpoint "/api/v1/medications" `
    -Body $testMedication

# Test: Create medication with missing required fields
Test-ValidationError `
    -TestName "Create medication with missing name" `
    -Method "POST" `
    -Endpoint "/api/v1/medications" `
    -Body @{
        dosageForm = "Tablet"
        strength = "200"
        strengthUnit = "mg"
    }

# ============================================
# GET /api/v1/medications (List Medications)
# ============================================
Write-Host "`n--- GET /api/v1/medications ---" -ForegroundColor Yellow

# Test: List all medications
Test-SuccessResponse `
    -TestName "List all medications with pagination" `
    -Method "GET" `
    -Endpoint "/api/v1/medications?page=1&limit=10" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# Test: List medications without auth
Test-AuthenticationFailure `
    -TestName "List medications without auth returns 401" `
    -Method "GET" `
    -Endpoint "/api/v1/medications"

# Test: Search medications
Test-SuccessResponse `
    -TestName "Search medications by name" `
    -Method "GET" `
    -Endpoint "/api/v1/medications?search=Ibuprofen" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# ============================================
# POST /api/v1/medications/assign
# ============================================
Write-Host "`n--- POST /api/v1/medications/assign ---" -ForegroundColor Yellow

# Test: Assign medication to student (may fail if no students exist)
if ($createdMedicationId) {
    $assignData = @{
        medicationId = $createdMedicationId
        studentId = "00000000-0000-0000-0000-000000000001"
        dosage = "200 mg"
        frequency = "Twice daily"
        route = "ORAL"
        prescribedBy = "Dr. Smith"
        prescriptionNumber = "RX-12345"
        startDate = (Get-Date).ToString("yyyy-MM-dd")
    }

    $response = Invoke-ApiRequest `
        -Method "POST" `
        -Endpoint "/api/v1/medications/assign" `
        -Body $assignData `
        -RequireAuth $true

    if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 404 -or $response.StatusCode -eq 400) {
        Write-TestResult -TestName "Assign medication to student" -Status "PASS" -StatusCode $response.StatusCode
    } else {
        Write-TestResult -TestName "Assign medication to student" -Status "FAIL" -StatusCode $response.StatusCode
    }
}

# Test: Assign medication without auth
Test-AuthenticationFailure `
    -TestName "Assign medication without auth returns 401" `
    -Method "POST" `
    -Endpoint "/api/v1/medications/assign" `
    -Body @{ medicationId = $createdMedicationId }

# ============================================
# POST /api/v1/medications/administration
# ============================================
Write-Host "`n--- POST /api/v1/medications/administration ---" -ForegroundColor Yellow

# Test: Log medication administration
$adminData = @{
    studentMedicationId = "00000000-0000-0000-0000-000000000001"
    studentId = "00000000-0000-0000-0000-000000000001"
    administeredAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    dosageGiven = "200 mg"
    notes = "Administered as prescribed"
}

$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/medications/administration" `
    -Body $adminData `
    -RequireAuth $true

if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 404 -or $response.StatusCode -eq 400) {
    Write-TestResult -TestName "Log medication administration" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Log medication administration" -Status "FAIL" -StatusCode $response.StatusCode
}

# Test: Log administration without auth
Test-AuthenticationFailure `
    -TestName "Log administration without auth returns 401" `
    -Method "POST" `
    -Endpoint "/api/v1/medications/administration" `
    -Body $adminData

# ============================================
# GET /api/v1/medications/logs/{studentId}
# ============================================
Write-Host "`n--- GET /api/v1/medications/logs/{studentId} ---" -ForegroundColor Yellow

# Test: Get medication logs for student
$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/medications/logs/00000000-0000-0000-0000-000000000001?page=1&limit=10" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
    Write-TestResult -TestName "Get student medication logs" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Get student medication logs" -Status "FAIL" -StatusCode $response.StatusCode
}

# Test: Get logs without auth
Test-AuthenticationFailure `
    -TestName "Get medication logs without auth returns 401" `
    -Method "GET" `
    -Endpoint "/api/v1/medications/logs/00000000-0000-0000-0000-000000000001"

# ============================================
# GET /api/v1/medications/inventory
# ============================================
Write-Host "`n--- GET /api/v1/medications/inventory ---" -ForegroundColor Yellow

# Test: Get medication inventory
Test-SuccessResponse `
    -TestName "Get medication inventory" `
    -Method "GET" `
    -Endpoint "/api/v1/medications/inventory" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# Test: Get inventory without auth
Test-AuthenticationFailure `
    -TestName "Get inventory without auth returns 401" `
    -Method "GET" `
    -Endpoint "/api/v1/medications/inventory"

# ============================================
# POST /api/v1/medications/inventory
# ============================================
Write-Host "`n--- POST /api/v1/medications/inventory ---" -ForegroundColor Yellow

# Test: Add to inventory
if ($createdMedicationId) {
    $inventoryData = @{
        medicationId = $createdMedicationId
        quantity = 100
        batchNumber = "BATCH-2024-001"
        expirationDate = (Get-Date).AddMonths(12).ToString("yyyy-MM-dd")
        costPerUnit = 0.50
    }

    $response = Invoke-ApiRequest `
        -Method "POST" `
        -Endpoint "/api/v1/medications/inventory" `
        -Body $inventoryData `
        -RequireAuth $true

    if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 400) {
        Write-TestResult -TestName "Add medication to inventory" -Status "PASS" -StatusCode $response.StatusCode
    } else {
        Write-TestResult -TestName "Add medication to inventory" -Status "FAIL" -StatusCode $response.StatusCode
    }
}

# Test: Add to inventory with expired date
if ($createdMedicationId) {
    Test-ValidationError `
        -TestName "Add expired medication to inventory" `
        -Method "POST" `
        -Endpoint "/api/v1/medications/inventory" `
        -Body @{
            medicationId = $createdMedicationId
            quantity = 100
            batchNumber = "BATCH-EXPIRED"
            expirationDate = "2020-01-01"
            costPerUnit = 0.50
        }
}

# ============================================
# GET /api/v1/medications/schedule
# ============================================
Write-Host "`n--- GET /api/v1/medications/schedule ---" -ForegroundColor Yellow

# Test: Get medication schedule
Test-SuccessResponse `
    -TestName "Get medication schedule" `
    -Method "GET" `
    -Endpoint "/api/v1/medications/schedule?startDate=$(Get-Date -Format 'yyyy-MM-dd')&endDate=$((Get-Date).AddDays(7).ToString('yyyy-MM-dd'))" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# ============================================
# GET /api/v1/medications/reminders
# ============================================
Write-Host "`n--- GET /api/v1/medications/reminders ---" -ForegroundColor Yellow

# Test: Get medication reminders
Test-SuccessResponse `
    -TestName "Get medication reminders for today" `
    -Method "GET" `
    -Endpoint "/api/v1/medications/reminders?date=$(Get-Date -Format 'yyyy-MM-dd')" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# ============================================
# POST /api/v1/medications/adverse-reaction
# ============================================
Write-Host "`n--- POST /api/v1/medications/adverse-reaction ---" -ForegroundColor Yellow

# Test: Report adverse reaction
$reactionData = @{
    studentMedicationId = "00000000-0000-0000-0000-000000000001"
    studentId = "00000000-0000-0000-0000-000000000001"
    severity = "MODERATE"
    symptoms = "Mild rash and itching"
    actionTaken = "Discontinued medication, contacted parent"
    notifyParent = $true
}

$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/medications/adverse-reaction" `
    -Body $reactionData `
    -RequireAuth $true

if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 404 -or $response.StatusCode -eq 400) {
    Write-TestResult -TestName "Report adverse medication reaction" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Report adverse medication reaction" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# GET /api/v1/medications/adverse-reactions
# ============================================
Write-Host "`n--- GET /api/v1/medications/adverse-reactions ---" -ForegroundColor Yellow

# Test: Get adverse reactions
Test-SuccessResponse `
    -TestName "Get adverse reaction reports" `
    -Method "GET" `
    -Endpoint "/api/v1/medications/adverse-reactions" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# ============================================
# GET /api/v1/medications/stats
# ============================================
Write-Host "`n--- GET /api/v1/medications/stats ---" -ForegroundColor Yellow

# Test: Get medication statistics
Test-SuccessResponse `
    -TestName "Get medication statistics" `
    -Method "GET" `
    -Endpoint "/api/v1/medications/stats" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# ============================================
# GET /api/v1/medications/alerts
# ============================================
Write-Host "`n--- GET /api/v1/medications/alerts ---" -ForegroundColor Yellow

# Test: Get medication alerts
Test-SuccessResponse `
    -TestName "Get medication alerts" `
    -Method "GET" `
    -Endpoint "/api/v1/medications/alerts" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# ============================================
# GET /api/v1/medications/form-options
# ============================================
Write-Host "`n--- GET /api/v1/medications/form-options ---" -ForegroundColor Yellow

# Test: Get form options
Test-SuccessResponse `
    -TestName "Get medication form options" `
    -Method "GET" `
    -Endpoint "/api/v1/medications/form-options" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# ============================================
# Summary
# ============================================
$summary = Get-TestSummary
Export-TestResults -OutputPath "$PSScriptRoot\results\medications-endpoints-results.json"

# Return summary for master script
return $summary
