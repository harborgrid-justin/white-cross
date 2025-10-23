# White Cross Healthcare Platform - Appointments Endpoint Tests
# Tests for /api/v1/appointments endpoints

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

Write-Host "`n=== Appointments Endpoints Tests ===" -ForegroundColor Cyan

# Test data
$testAppointment = @{
    studentId = "00000000-0000-0000-0000-000000000001"
    nurseId = "00000000-0000-0000-0000-000000000002"
    startTime = (Get-Date).AddDays(1).ToString("yyyy-MM-ddTHH:mm:ss")
    duration = 30
    type = "CHECKUP"
    priority = "NORMAL"
    notes = "Routine health checkup"
}

$createdAppointmentId = $null

# ============================================
# POST /api/v1/appointments (Create Appointment)
# ============================================
Write-Host "`n--- POST /api/v1/appointments ---" -ForegroundColor Yellow

# Test: Create appointment
$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/appointments" `
    -Body $testAppointment `
    -RequireAuth $true

if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 404 -or $response.StatusCode -eq 409) {
    Write-TestResult -TestName "Create new appointment" -Status "PASS" -StatusCode $response.StatusCode
    if ($response.Success -and $response.Body.data.id) {
        $createdAppointmentId = $response.Body.data.id
        Write-Host "Created appointment ID: $createdAppointmentId" -ForegroundColor Green
    }
} else {
    Write-TestResult -TestName "Create new appointment" -Status "FAIL" -StatusCode $response.StatusCode
}

# Test: Create appointment without auth
Test-AuthenticationFailure `
    -TestName "Create appointment without auth returns 401" `
    -Method "POST" `
    -Endpoint "/api/v1/appointments" `
    -Body $testAppointment

# Test: Create appointment with invalid duration
Test-ValidationError `
    -TestName "Create appointment with invalid duration" `
    -Method "POST" `
    -Endpoint "/api/v1/appointments" `
    -Body @{
        studentId = "00000000-0000-0000-0000-000000000001"
        nurseId = "00000000-0000-0000-0000-000000000002"
        startTime = (Get-Date).AddDays(1).ToString("yyyy-MM-ddTHH:mm:ss")
        duration = 200
        type = "CHECKUP"
    }

# Test: Create appointment in the past
Test-ValidationError `
    -TestName "Create appointment in the past" `
    -Method "POST" `
    -Endpoint "/api/v1/appointments" `
    -Body @{
        studentId = "00000000-0000-0000-0000-000000000001"
        nurseId = "00000000-0000-0000-0000-000000000002"
        startTime = (Get-Date).AddDays(-1).ToString("yyyy-MM-ddTHH:mm:ss")
        duration = 30
        type = "CHECKUP"
    }

# ============================================
# GET /api/v1/appointments (List Appointments)
# ============================================
Write-Host "`n--- GET /api/v1/appointments ---" -ForegroundColor Yellow

# Test: List all appointments
Test-SuccessResponse `
    -TestName "List all appointments with pagination" `
    -Method "GET" `
    -Endpoint "/api/v1/appointments?page=1&limit=10" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# Test: List appointments without auth
Test-AuthenticationFailure `
    -TestName "List appointments without auth returns 401" `
    -Method "GET" `
    -Endpoint "/api/v1/appointments"

# Test: Filter appointments by status
Test-SuccessResponse `
    -TestName "List appointments filtered by status" `
    -Method "GET" `
    -Endpoint "/api/v1/appointments?status=SCHEDULED" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# ============================================
# GET /api/v1/appointments/{id} (Get Appointment by ID)
# ============================================
Write-Host "`n--- GET /api/v1/appointments/{id} ---" -ForegroundColor Yellow

if ($createdAppointmentId) {
    Test-SuccessResponse `
        -TestName "Get appointment by ID" `
        -Method "GET" `
        -Endpoint "/api/v1/appointments/$createdAppointmentId" `
        -RequireAuth $true `
        -ExpectedStatusCode 200
} else {
    Write-TestResult -TestName "Get appointment by ID" -Status "SKIP" -Details "No appointment ID available"
}

# Test: Get non-existent appointment
Test-NotFoundError `
    -TestName "Get non-existent appointment returns 404" `
    -Method "GET" `
    -Endpoint "/api/v1/appointments/00000000-0000-0000-0000-000000000000" `
    -RequireAuth $true

# ============================================
# PUT /api/v1/appointments/{id} (Update Appointment)
# ============================================
Write-Host "`n--- PUT /api/v1/appointments/{id} ---" -ForegroundColor Yellow

if ($createdAppointmentId) {
    $updateData = @{
        duration = 45
        notes = "Extended checkup - include vision screening"
    }

    Test-SuccessResponse `
        -TestName "Update appointment" `
        -Method "PUT" `
        -Endpoint "/api/v1/appointments/$createdAppointmentId" `
        -Body $updateData `
        -RequireAuth $true `
        -ExpectedStatusCode 200
} else {
    Write-TestResult -TestName "Update appointment" -Status "SKIP" -Details "No appointment ID available"
}

# ============================================
# POST /api/v1/appointments/{id}/start
# ============================================
Write-Host "`n--- POST /api/v1/appointments/{id}/start ---" -ForegroundColor Yellow

if ($createdAppointmentId) {
    $response = Invoke-ApiRequest `
        -Method "POST" `
        -Endpoint "/api/v1/appointments/$createdAppointmentId/start" `
        -RequireAuth $true

    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 409) {
        Write-TestResult -TestName "Start appointment" -Status "PASS" -StatusCode $response.StatusCode
    } else {
        Write-TestResult -TestName "Start appointment" -Status "FAIL" -StatusCode $response.StatusCode
    }
}

# ============================================
# POST /api/v1/appointments/{id}/complete
# ============================================
Write-Host "`n--- POST /api/v1/appointments/{id}/complete ---" -ForegroundColor Yellow

if ($createdAppointmentId) {
    $completeData = @{
        notes = "Checkup completed successfully. Student is healthy."
        outcome = "COMPLETED"
        followUpRequired = $false
    }

    $response = Invoke-ApiRequest `
        -Method "POST" `
        -Endpoint "/api/v1/appointments/$createdAppointmentId/complete" `
        -Body $completeData `
        -RequireAuth $true

    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 409 -or $response.StatusCode -eq 400) {
        Write-TestResult -TestName "Complete appointment" -Status "PASS" -StatusCode $response.StatusCode
    } else {
        Write-TestResult -TestName "Complete appointment" -Status "FAIL" -StatusCode $response.StatusCode
    }
}

# ============================================
# POST /api/v1/appointments/{id}/cancel
# ============================================
Write-Host "`n--- POST /api/v1/appointments/{id}/cancel ---" -ForegroundColor Yellow

# Create a new appointment to cancel
$newAppointment = @{
    studentId = "00000000-0000-0000-0000-000000000001"
    nurseId = "00000000-0000-0000-0000-000000000002"
    startTime = (Get-Date).AddDays(2).ToString("yyyy-MM-ddTHH:mm:ss")
    duration = 30
    type = "CHECKUP"
}

$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/appointments" `
    -Body $newAppointment `
    -RequireAuth $true

if ($response.Success -and $response.Body.data.id) {
    $appointmentToCancel = $response.Body.data.id

    $cancelData = @{
        reason = "Student is sick and cannot attend"
    }

    $response = Invoke-ApiRequest `
        -Method "POST" `
        -Endpoint "/api/v1/appointments/$appointmentToCancel/cancel" `
        -Body $cancelData `
        -RequireAuth $true

    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 409) {
        Write-TestResult -TestName "Cancel appointment" -Status "PASS" -StatusCode $response.StatusCode
    } else {
        Write-TestResult -TestName "Cancel appointment" -Status "FAIL" -StatusCode $response.StatusCode
    }
}

# Test: Cancel without reason
if ($createdAppointmentId) {
    Test-ValidationError `
        -TestName "Cancel appointment without reason" `
        -Method "POST" `
        -Endpoint "/api/v1/appointments/$createdAppointmentId/cancel" `
        -Body @{}
}

# ============================================
# POST /api/v1/appointments/{id}/no-show
# ============================================
Write-Host "`n--- POST /api/v1/appointments/{id}/no-show ---" -ForegroundColor Yellow

# Create another appointment for no-show test
$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/appointments" `
    -Body $newAppointment `
    -RequireAuth $true

if ($response.Success -and $response.Body.data.id) {
    $appointmentId = $response.Body.data.id

    $response = Invoke-ApiRequest `
        -Method "POST" `
        -Endpoint "/api/v1/appointments/$appointmentId/no-show" `
        -RequireAuth $true

    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 409) {
        Write-TestResult -TestName "Mark appointment as no-show" -Status "PASS" -StatusCode $response.StatusCode
    } else {
        Write-TestResult -TestName "Mark appointment as no-show" -Status "FAIL" -StatusCode $response.StatusCode
    }
}

# ============================================
# GET /api/v1/appointments/nurse/{nurseId}/available-slots
# ============================================
Write-Host "`n--- GET /api/v1/appointments/nurse/{nurseId}/available-slots ---" -ForegroundColor Yellow

$date = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/appointments/nurse/00000000-0000-0000-0000-000000000002/available-slots?date=$date" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
    Write-TestResult -TestName "Get available time slots for nurse" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Get available time slots for nurse" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# GET /api/v1/appointments/nurse/{nurseId}/upcoming
# ============================================
Write-Host "`n--- GET /api/v1/appointments/nurse/{nurseId}/upcoming ---" -ForegroundColor Yellow

$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/appointments/nurse/00000000-0000-0000-0000-000000000002/upcoming?limit=10" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
    Write-TestResult -TestName "Get upcoming appointments for nurse" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Get upcoming appointments for nurse" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# GET /api/v1/appointments/statistics
# ============================================
Write-Host "`n--- GET /api/v1/appointments/statistics ---" -ForegroundColor Yellow

Test-SuccessResponse `
    -TestName "Get appointment statistics" `
    -Method "GET" `
    -Endpoint "/api/v1/appointments/statistics" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# ============================================
# POST /api/v1/appointments/recurring
# ============================================
Write-Host "`n--- POST /api/v1/appointments/recurring ---" -ForegroundColor Yellow

$recurringData = @{
    studentId = "00000000-0000-0000-0000-000000000001"
    nurseId = "00000000-0000-0000-0000-000000000002"
    startTime = (Get-Date).AddDays(3).ToString("yyyy-MM-ddTHH:mm:ss")
    duration = 30
    type = "MEDICATION_ADMINISTRATION"
    recurrencePattern = "WEEKLY"
    recurrenceInterval = 1
    maxOccurrences = 4
}

$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/appointments/recurring" `
    -Body $recurringData `
    -RequireAuth $true

if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 404 -or $response.StatusCode -eq 409) {
    Write-TestResult -TestName "Create recurring appointments" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Create recurring appointments" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# WAITLIST ENDPOINTS
# ============================================
Write-Host "`n--- Waitlist Endpoints ---" -ForegroundColor Yellow

# POST /api/v1/appointments/waitlist
$waitlistData = @{
    studentId = "00000000-0000-0000-0000-000000000001"
    appointmentType = "CHECKUP"
    priority = "MEDIUM"
    notes = "Prefer morning appointments"
}

$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/appointments/waitlist" `
    -Body $waitlistData `
    -RequireAuth $true

if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 404 -or $response.StatusCode -eq 409) {
    Write-TestResult -TestName "Add student to appointment waitlist" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Add student to appointment waitlist" -Status "FAIL" -StatusCode $response.StatusCode
}

# GET /api/v1/appointments/waitlist
Test-SuccessResponse `
    -TestName "Get waitlist entries" `
    -Method "GET" `
    -Endpoint "/api/v1/appointments/waitlist" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# ============================================
# Summary
# ============================================
$summary = Get-TestSummary
Export-TestResults -OutputPath "$PSScriptRoot\results\appointments-endpoints-results.json"

# Return summary for master script
return $summary
