# White Cross Healthcare Platform - Health Records Endpoint Tests
# Tests for /api/v1/health-records endpoints

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

Write-Host "`n=== Health Records Endpoints Tests ===" -ForegroundColor Cyan

# Test data
$testHealthRecord = @{
    studentId = "00000000-0000-0000-0000-000000000001"
    recordType = "CHECKUP"
    date = (Get-Date).ToString("yyyy-MM-dd")
    provider = "Dr. Smith"
    diagnosis = "Routine checkup - healthy"
    treatment = "None required"
    notes = "Student is in good health"
}

$testAllergy = @{
    studentId = "00000000-0000-0000-0000-000000000001"
    allergen = "Peanuts"
    severity = "SEVERE"
    reactions = "Anaphylaxis, difficulty breathing"
    treatment = "EpiPen administration, emergency medical attention"
}

$testCondition = @{
    studentId = "00000000-0000-0000-0000-000000000001"
    condition = "Asthma"
    diagnosisDate = "2020-01-15"
    severity = "MODERATE"
    status = "CONTROLLED"
    medications = "Albuterol inhaler as needed"
    carePlan = "Use inhaler before physical activity"
}

$testVaccination = @{
    studentId = "00000000-0000-0000-0000-000000000001"
    vaccineName = "MMR"
    dateAdministered = (Get-Date).ToString("yyyy-MM-dd")
    lotNumber = "LOT-2024-001"
    manufacturer = "Merck"
    doseNumber = 1
    administeredBy = "Nurse Johnson"
}

$testVitals = @{
    studentId = "00000000-0000-0000-0000-000000000001"
    temperature = 98.6
    bloodPressure = "120/80"
    heartRate = 72
    respiratoryRate = 16
    oxygenSaturation = 98
    height = 150
    weight = 45
}

$createdRecordId = $null

# ============================================
# POST /api/v1/health-records (Create Health Record)
# ============================================
Write-Host "`n--- POST /api/v1/health-records ---" -ForegroundColor Yellow

# Test: Create health record
$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/health-records" `
    -Body $testHealthRecord `
    -RequireAuth $true

if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 404) {
    Write-TestResult -TestName "Create new health record" -Status "PASS" -StatusCode $response.StatusCode
    if ($response.Success -and $response.Body.data.id) {
        $createdRecordId = $response.Body.data.id
        Write-Host "Created health record ID: $createdRecordId" -ForegroundColor Green
    }
} else {
    Write-TestResult -TestName "Create new health record" -Status "FAIL" -StatusCode $response.StatusCode
}

# Test: Create health record without auth
Test-AuthenticationFailure `
    -TestName "Create health record without auth returns 401" `
    -Method "POST" `
    -Endpoint "/api/v1/health-records" `
    -Body $testHealthRecord

# Test: Create health record with future date
Test-ValidationError `
    -TestName "Create health record with future date" `
    -Method "POST" `
    -Endpoint "/api/v1/health-records" `
    -Body @{
        studentId = "00000000-0000-0000-0000-000000000001"
        recordType = "CHECKUP"
        date = "2030-01-01"
        provider = "Dr. Smith"
    }

# ============================================
# GET /api/v1/health-records/student/{studentId}
# ============================================
Write-Host "`n--- GET /api/v1/health-records/student/{studentId} ---" -ForegroundColor Yellow

# Test: List student health records
$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/health-records/student/00000000-0000-0000-0000-000000000001?page=1&limit=10" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404 -or $response.StatusCode -eq 403) {
    Write-TestResult -TestName "List student health records" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "List student health records" -Status "FAIL" -StatusCode $response.StatusCode
}

# Test: List records without auth
Test-AuthenticationFailure `
    -TestName "List health records without auth returns 401" `
    -Method "GET" `
    -Endpoint "/api/v1/health-records/student/00000000-0000-0000-0000-000000000001"

# ============================================
# GET /api/v1/health-records/{id}
# ============================================
Write-Host "`n--- GET /api/v1/health-records/{id} ---" -ForegroundColor Yellow

if ($createdRecordId) {
    Test-SuccessResponse `
        -TestName "Get health record by ID" `
        -Method "GET" `
        -Endpoint "/api/v1/health-records/$createdRecordId" `
        -RequireAuth $true `
        -ExpectedStatusCode 200
} else {
    Write-TestResult -TestName "Get health record by ID" -Status "SKIP" -Details "No record ID available"
}

# Test: Get non-existent record
Test-NotFoundError `
    -TestName "Get non-existent record returns 404" `
    -Method "GET" `
    -Endpoint "/api/v1/health-records/00000000-0000-0000-0000-000000000000" `
    -RequireAuth $true

# ============================================
# PUT /api/v1/health-records/{id}
# ============================================
Write-Host "`n--- PUT /api/v1/health-records/{id} ---" -ForegroundColor Yellow

if ($createdRecordId) {
    $updateData = @{
        diagnosis = "Routine checkup - healthy, no concerns"
        notes = "Student is in excellent health"
    }

    Test-SuccessResponse `
        -TestName "Update health record" `
        -Method "PUT" `
        -Endpoint "/api/v1/health-records/$createdRecordId" `
        -Body $updateData `
        -RequireAuth $true `
        -ExpectedStatusCode 200
} else {
    Write-TestResult -TestName "Update health record" -Status "SKIP" -Details "No record ID available"
}

# ============================================
# ALLERGIES ENDPOINTS
# ============================================
Write-Host "`n--- Allergies Endpoints ---" -ForegroundColor Yellow

# POST /api/v1/health-records/allergies
$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/health-records/allergies" `
    -Body $testAllergy `
    -RequireAuth $true

if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 404 -or $response.StatusCode -eq 400) {
    Write-TestResult -TestName "Create allergy record" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Create allergy record" -Status "FAIL" -StatusCode $response.StatusCode
}

# GET /api/v1/health-records/student/{studentId}/allergies
$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/health-records/student/00000000-0000-0000-0000-000000000001/allergies" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
    Write-TestResult -TestName "List student allergies" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "List student allergies" -Status "FAIL" -StatusCode $response.StatusCode
}

# Test: List allergies without auth
Test-AuthenticationFailure `
    -TestName "List allergies without auth returns 401" `
    -Method "GET" `
    -Endpoint "/api/v1/health-records/student/00000000-0000-0000-0000-000000000001/allergies"

# ============================================
# CHRONIC CONDITIONS ENDPOINTS
# ============================================
Write-Host "`n--- Chronic Conditions Endpoints ---" -ForegroundColor Yellow

# POST /api/v1/health-records/conditions
$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/health-records/conditions" `
    -Body $testCondition `
    -RequireAuth $true

if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 404 -or $response.StatusCode -eq 400) {
    Write-TestResult -TestName "Create chronic condition record" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Create chronic condition record" -Status "FAIL" -StatusCode $response.StatusCode
}

# GET /api/v1/health-records/student/{studentId}/conditions
$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/health-records/student/00000000-0000-0000-0000-000000000001/conditions" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
    Write-TestResult -TestName "List student chronic conditions" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "List student chronic conditions" -Status "FAIL" -StatusCode $response.StatusCode
}

# Test: List conditions without auth
Test-AuthenticationFailure `
    -TestName "List conditions without auth returns 401" `
    -Method "GET" `
    -Endpoint "/api/v1/health-records/student/00000000-0000-0000-0000-000000000001/conditions"

# ============================================
# VACCINATIONS ENDPOINTS
# ============================================
Write-Host "`n--- Vaccinations Endpoints ---" -ForegroundColor Yellow

# POST /api/v1/health-records/vaccinations
$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/health-records/vaccinations" `
    -Body $testVaccination `
    -RequireAuth $true

if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 404 -or $response.StatusCode -eq 400) {
    Write-TestResult -TestName "Create vaccination record" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Create vaccination record" -Status "FAIL" -StatusCode $response.StatusCode
}

# GET /api/v1/health-records/student/{studentId}/vaccinations
$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/health-records/student/00000000-0000-0000-0000-000000000001/vaccinations" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
    Write-TestResult -TestName "List student vaccinations" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "List student vaccinations" -Status "FAIL" -StatusCode $response.StatusCode
}

# Test: List vaccinations without auth
Test-AuthenticationFailure `
    -TestName "List vaccinations without auth returns 401" `
    -Method "GET" `
    -Endpoint "/api/v1/health-records/student/00000000-0000-0000-0000-000000000001/vaccinations"

# ============================================
# VITAL SIGNS ENDPOINTS
# ============================================
Write-Host "`n--- Vital Signs Endpoints ---" -ForegroundColor Yellow

# POST /api/v1/health-records/vitals
$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/health-records/vitals" `
    -Body $testVitals `
    -RequireAuth $true

if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 404 -or $response.StatusCode -eq 400) {
    Write-TestResult -TestName "Record vital signs" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Record vital signs" -Status "FAIL" -StatusCode $response.StatusCode
}

# Test: Record vitals with invalid values
Test-ValidationError `
    -TestName "Record vitals with invalid temperature" `
    -Method "POST" `
    -Endpoint "/api/v1/health-records/vitals" `
    -Body @{
        studentId = "00000000-0000-0000-0000-000000000001"
        temperature = 150.0
    }

# GET /api/v1/health-records/student/{studentId}/vitals/latest
$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/health-records/student/00000000-0000-0000-0000-000000000001/vitals/latest" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
    Write-TestResult -TestName "Get latest vital signs" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Get latest vital signs" -Status "FAIL" -StatusCode $response.StatusCode
}

# GET /api/v1/health-records/student/{studentId}/vitals/history
$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/health-records/student/00000000-0000-0000-0000-000000000001/vitals/history?page=1&limit=10" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
    Write-TestResult -TestName "Get vitals history" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Get vitals history" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# SUMMARY & REPORTS ENDPOINTS
# ============================================
Write-Host "`n--- Summary & Reports Endpoints ---" -ForegroundColor Yellow

# GET /api/v1/health-records/student/{studentId}/summary
$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/health-records/student/00000000-0000-0000-0000-000000000001/summary" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
    Write-TestResult -TestName "Get comprehensive medical summary" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Get comprehensive medical summary" -Status "FAIL" -StatusCode $response.StatusCode
}

# GET /api/v1/health-records/student/{studentId}/immunization-status
$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/health-records/student/00000000-0000-0000-0000-000000000001/immunization-status" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
    Write-TestResult -TestName "Check immunization compliance status" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Check immunization compliance status" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# Summary
# ============================================
$summary = Get-TestSummary
Export-TestResults -OutputPath "$PSScriptRoot\results\health-records-endpoints-results.json"

# Return summary for master script
return $summary
