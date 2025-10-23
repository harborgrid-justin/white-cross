# White Cross Healthcare Platform - Students Endpoint Tests
# Tests for /api/v1/students endpoints

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

Write-Host "`n=== Students Endpoints Tests ===" -ForegroundColor Cyan

# Test data
$testStudent = @{
    firstName = "John"
    lastName = "Doe"
    dateOfBirth = "2010-05-15"
    gender = "MALE"
    grade = "8"
    bloodType = "A+"
    parentName = "Jane Doe"
    parentPhone = "555-0100"
    parentEmail = "jane.doe@example.com"
    emergencyContactName = "John Doe Sr."
    emergencyContactPhone = "555-0101"
    emergencyContactRelation = "Father"
}

$createdStudentId = $null

# ============================================
# POST /api/v1/students (Create Student)
# ============================================
Write-Host "`n--- POST /api/v1/students ---" -ForegroundColor Yellow

# Test: Create student successfully
$response = Test-SuccessResponse `
    -TestName "Create new student" `
    -Method "POST" `
    -Endpoint "/api/v1/students" `
    -Body $testStudent `
    -RequireAuth $true `
    -ExpectedStatusCode 201

if ($response.Success -and $response.Body.data.id) {
    $createdStudentId = $response.Body.data.id
    Write-Host "Created student ID: $createdStudentId" -ForegroundColor Green
}

# Test: Create student without authentication
Test-AuthenticationFailure `
    -TestName "Create student without auth returns 401" `
    -Method "POST" `
    -Endpoint "/api/v1/students" `
    -Body $testStudent

# Test: Create student with missing required fields
Test-ValidationError `
    -TestName "Create student with missing firstName" `
    -Method "POST" `
    -Endpoint "/api/v1/students" `
    -Body @{
        lastName = "Doe"
        dateOfBirth = "2010-05-15"
        gender = "MALE"
    }

# Test: Create student with invalid date of birth (future date)
Test-ValidationError `
    -TestName "Create student with future date of birth" `
    -Method "POST" `
    -Endpoint "/api/v1/students" `
    -Body @{
        firstName = "John"
        lastName = "Doe"
        dateOfBirth = "2030-01-01"
        gender = "MALE"
        grade = "8"
    }

# Test: Create student with invalid blood type
Test-ValidationError `
    -TestName "Create student with invalid blood type" `
    -Method "POST" `
    -Endpoint "/api/v1/students" `
    -Body @{
        firstName = "John"
        lastName = "Doe"
        dateOfBirth = "2010-05-15"
        gender = "MALE"
        grade = "8"
        bloodType = "Z+"
    }

# ============================================
# GET /api/v1/students (List Students)
# ============================================
Write-Host "`n--- GET /api/v1/students ---" -ForegroundColor Yellow

# Test: List all students with pagination
Test-SuccessResponse `
    -TestName "List all students" `
    -Method "GET" `
    -Endpoint "/api/v1/students?page=1&limit=10" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# Test: List students without authentication
Test-AuthenticationFailure `
    -TestName "List students without auth returns 401" `
    -Method "GET" `
    -Endpoint "/api/v1/students"

# Test: List students with filters
Test-SuccessResponse `
    -TestName "List students filtered by grade" `
    -Method "GET" `
    -Endpoint "/api/v1/students?grade=8" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# Test: List active students only
Test-SuccessResponse `
    -TestName "List active students only" `
    -Method "GET" `
    -Endpoint "/api/v1/students?active=true" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# ============================================
# GET /api/v1/students/{id} (Get Student by ID)
# ============================================
Write-Host "`n--- GET /api/v1/students/{id} ---" -ForegroundColor Yellow

if ($createdStudentId) {
    # Test: Get student by ID
    Test-SuccessResponse `
        -TestName "Get student by ID" `
        -Method "GET" `
        -Endpoint "/api/v1/students/$createdStudentId" `
        -RequireAuth $true `
        -ExpectedStatusCode 200
} else {
    Write-TestResult -TestName "Get student by ID" -Status "SKIP" -Details "No student ID available"
}

# Test: Get student without authentication
if ($createdStudentId) {
    Test-AuthenticationFailure `
        -TestName "Get student without auth returns 401" `
        -Method "GET" `
        -Endpoint "/api/v1/students/$createdStudentId"
}

# Test: Get non-existent student
Test-NotFoundError `
    -TestName "Get non-existent student returns 404" `
    -Method "GET" `
    -Endpoint "/api/v1/students/00000000-0000-0000-0000-000000000000" `
    -RequireAuth $true

# ============================================
# PUT /api/v1/students/{id} (Update Student)
# ============================================
Write-Host "`n--- PUT /api/v1/students/{id} ---" -ForegroundColor Yellow

if ($createdStudentId) {
    # Test: Update student successfully
    $updateData = @{
        firstName = "John"
        lastName = "Smith"
        grade = "9"
        parentPhone = "555-0200"
    }

    Test-SuccessResponse `
        -TestName "Update student information" `
        -Method "PUT" `
        -Endpoint "/api/v1/students/$createdStudentId" `
        -Body $updateData `
        -RequireAuth $true `
        -ExpectedStatusCode 200
} else {
    Write-TestResult -TestName "Update student information" -Status "SKIP" -Details "No student ID available"
}

# Test: Update student without authentication
if ($createdStudentId) {
    Test-AuthenticationFailure `
        -TestName "Update student without auth returns 401" `
        -Method "PUT" `
        -Endpoint "/api/v1/students/$createdStudentId" `
        -Body @{ firstName = "Updated" }
}

# Test: Update non-existent student
Test-NotFoundError `
    -TestName "Update non-existent student returns 404" `
    -Method "PUT" `
    -Endpoint "/api/v1/students/00000000-0000-0000-0000-000000000000" `
    -Body @{ firstName = "Updated" } `
    -RequireAuth $true

# Test: Update with invalid data
if ($createdStudentId) {
    Test-ValidationError `
        -TestName "Update student with invalid blood type" `
        -Method "PUT" `
        -Endpoint "/api/v1/students/$createdStudentId" `
        -Body @{ bloodType = "INVALID" }
}

# ============================================
# GET /api/v1/students/grade/{grade}
# ============================================
Write-Host "`n--- GET /api/v1/students/grade/{grade} ---" -ForegroundColor Yellow

# Test: Get students by grade
Test-SuccessResponse `
    -TestName "Get students by grade" `
    -Method "GET" `
    -Endpoint "/api/v1/students/grade/8" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# Test: Get students by grade without auth
Test-AuthenticationFailure `
    -TestName "Get students by grade without auth returns 401" `
    -Method "GET" `
    -Endpoint "/api/v1/students/grade/8"

# ============================================
# GET /api/v1/students/search/{query}
# ============================================
Write-Host "`n--- GET /api/v1/students/search/{query} ---" -ForegroundColor Yellow

# Test: Search students
Test-SuccessResponse `
    -TestName "Search students by name" `
    -Method "GET" `
    -Endpoint "/api/v1/students/search/John" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# Test: Search students without auth
Test-AuthenticationFailure `
    -TestName "Search students without auth returns 401" `
    -Method "GET" `
    -Endpoint "/api/v1/students/search/John"

# ============================================
# GET /api/v1/students/assigned
# ============================================
Write-Host "`n--- GET /api/v1/students/assigned ---" -ForegroundColor Yellow

# Test: Get assigned students
Test-SuccessResponse `
    -TestName "Get assigned students for current nurse" `
    -Method "GET" `
    -Endpoint "/api/v1/students/assigned" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# Test: Get assigned students without auth
Test-AuthenticationFailure `
    -TestName "Get assigned students without auth returns 401" `
    -Method "GET" `
    -Endpoint "/api/v1/students/assigned"

# ============================================
# GET /api/v1/students/{id}/health-records
# ============================================
Write-Host "`n--- GET /api/v1/students/{id}/health-records ---" -ForegroundColor Yellow

if ($createdStudentId) {
    # Test: Get student health records
    Test-SuccessResponse `
        -TestName "Get student health records" `
        -Method "GET" `
        -Endpoint "/api/v1/students/$createdStudentId/health-records?page=1&limit=10" `
        -RequireAuth $true `
        -ExpectedStatusCode 200
} else {
    Write-TestResult -TestName "Get student health records" -Status "SKIP" -Details "No student ID available"
}

# Test: Get health records without auth
if ($createdStudentId) {
    Test-AuthenticationFailure `
        -TestName "Get health records without auth returns 401" `
        -Method "GET" `
        -Endpoint "/api/v1/students/$createdStudentId/health-records"
}

# ============================================
# GET /api/v1/students/{id}/mental-health-records
# ============================================
Write-Host "`n--- GET /api/v1/students/{id}/mental-health-records ---" -ForegroundColor Yellow

if ($createdStudentId) {
    # Test: Get student mental health records (may return 403 if not authorized)
    $response = Invoke-ApiRequest `
        -Method "GET" `
        -Endpoint "/api/v1/students/$createdStudentId/mental-health-records?page=1&limit=10" `
        -RequireAuth $true

    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403) {
        Write-TestResult -TestName "Get mental health records" -Status "PASS" -StatusCode $response.StatusCode -Details "200 (authorized) or 403 (not authorized)"
    } else {
        Write-TestResult -TestName "Get mental health records" -Status "FAIL" -StatusCode $response.StatusCode -Details "Expected 200 or 403"
    }
} else {
    Write-TestResult -TestName "Get mental health records" -Status "SKIP" -Details "No student ID available"
}

# ============================================
# POST /api/v1/students/{id}/transfer
# ============================================
Write-Host "`n--- POST /api/v1/students/{id}/transfer ---" -ForegroundColor Yellow

if ($createdStudentId) {
    # Test: Transfer student (may fail with 403 if not admin)
    $response = Invoke-ApiRequest `
        -Method "POST" `
        -Endpoint "/api/v1/students/$createdStudentId/transfer" `
        -Body @{ newNurseId = "00000000-0000-0000-0000-000000000001" } `
        -RequireAuth $true

    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403 -or $response.StatusCode -eq 404) {
        Write-TestResult -TestName "Transfer student to different nurse" -Status "PASS" -StatusCode $response.StatusCode
    } else {
        Write-TestResult -TestName "Transfer student to different nurse" -Status "FAIL" -StatusCode $response.StatusCode
    }
} else {
    Write-TestResult -TestName "Transfer student to different nurse" -Status "SKIP" -Details "No student ID available"
}

# ============================================
# POST /api/v1/students/{id}/deactivate
# ============================================
Write-Host "`n--- POST /api/v1/students/{id}/deactivate ---" -ForegroundColor Yellow

if ($createdStudentId) {
    # Test: Deactivate student (may fail with 403 if not admin)
    $response = Invoke-ApiRequest `
        -Method "POST" `
        -Endpoint "/api/v1/students/$createdStudentId/deactivate" `
        -Body @{
            reason = "Test deactivation - student transferred to different school"
            deactivationType = "TRANSFER"
        } `
        -RequireAuth $true

    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403) {
        Write-TestResult -TestName "Deactivate student" -Status "PASS" -StatusCode $response.StatusCode
    } else {
        Write-TestResult -TestName "Deactivate student" -Status "FAIL" -StatusCode $response.StatusCode
    }
} else {
    Write-TestResult -TestName "Deactivate student" -Status "SKIP" -Details "No student ID available"
}

# Test: Deactivate without reason (validation error)
if ($createdStudentId) {
    Test-ValidationError `
        -TestName "Deactivate student without reason" `
        -Method "POST" `
        -Endpoint "/api/v1/students/$createdStudentId/deactivate" `
        -Body @{}
}

# ============================================
# Summary
# ============================================
$summary = Get-TestSummary
Export-TestResults -OutputPath "$PSScriptRoot\results\students-endpoints-results.json"

# Return summary for master script
return $summary
