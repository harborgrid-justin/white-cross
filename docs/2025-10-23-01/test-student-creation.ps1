# Test Student Creation API
# This script tests the fixed student creation endpoint

$baseUrl = "http://localhost:5000"
$apiUrl = "$baseUrl/api/v1/students"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Student Creation API Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if server is running
Write-Host "Checking if server is running..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get -ErrorAction Stop
    Write-Host "✓ Server is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Server is not running. Please start the server first." -ForegroundColor Red
    Write-Host "  Run: cd backend && npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test Case 1: Create student with minimal required fields
Write-Host "Test 1: Create student with minimal required fields" -ForegroundColor Yellow
Write-Host "----------------------------------------------" -ForegroundColor Gray

$student1 = @{
    firstName = "John"
    lastName = "Doe"
    dateOfBirth = "2015-05-20"
    grade = "3"
    studentNumber = "STU-TEST-001"
    gender = "MALE"
} | ConvertTo-Json

Write-Host "Payload:" -ForegroundColor Cyan
Write-Host $student1 -ForegroundColor Gray
Write-Host ""

try {
    $response1 = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $student1 -ContentType "application/json" -Headers @{
        Authorization = "Bearer test-token-here"
    } -ErrorAction Stop
    Write-Host "✓ Test 1 PASSED: Student created successfully" -ForegroundColor Green
    Write-Host "  Student ID: $($response1.data.student.id)" -ForegroundColor Gray
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorBody = $_.ErrorDetails.Message

    if ($statusCode -eq 401) {
        Write-Host "⚠ Test 1 SKIPPED: Authentication required (401)" -ForegroundColor Yellow
        Write-Host "  Note: This is expected without a valid JWT token" -ForegroundColor Gray
        Write-Host "  To test with authentication, replace 'test-token-here' with a real token" -ForegroundColor Gray
    } elseif ($statusCode -eq 400) {
        Write-Host "✗ Test 1 FAILED: Validation error (400)" -ForegroundColor Red
        Write-Host "  Error: $errorBody" -ForegroundColor Red
    } elseif ($statusCode -eq 409) {
        Write-Host "⚠ Test 1 PARTIAL: Student number already exists (409)" -ForegroundColor Yellow
        Write-Host "  Note: This is expected if test was run before" -ForegroundColor Gray
    } else {
        Write-Host "✗ Test 1 FAILED: Unexpected error ($statusCode)" -ForegroundColor Red
        Write-Host "  Error: $errorBody" -ForegroundColor Red
    }
}

Write-Host ""

# Test Case 2: Create student with all optional fields
Write-Host "Test 2: Create student with all optional fields" -ForegroundColor Yellow
Write-Host "----------------------------------------------" -ForegroundColor Gray

$student2 = @{
    firstName = "Emma"
    lastName = "Wilson"
    dateOfBirth = "2016-03-15"
    grade = "2"
    studentNumber = "STU-TEST-002"
    gender = "FEMALE"
    photo = "https://example.com/photo.jpg"
    medicalRecordNum = "MRN-TEST-002"
    enrollmentDate = "2023-09-01"
} | ConvertTo-Json

Write-Host "Payload:" -ForegroundColor Cyan
Write-Host $student2 -ForegroundColor Gray
Write-Host ""

try {
    $response2 = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $student2 -ContentType "application/json" -Headers @{
        Authorization = "Bearer test-token-here"
    } -ErrorAction Stop
    Write-Host "✓ Test 2 PASSED: Student created with all fields" -ForegroundColor Green
    Write-Host "  Student ID: $($response2.data.student.id)" -ForegroundColor Gray
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorBody = $_.ErrorDetails.Message

    if ($statusCode -eq 401) {
        Write-Host "⚠ Test 2 SKIPPED: Authentication required (401)" -ForegroundColor Yellow
    } elseif ($statusCode -eq 400) {
        Write-Host "✗ Test 2 FAILED: Validation error (400)" -ForegroundColor Red
        Write-Host "  Error: $errorBody" -ForegroundColor Red
    } elseif ($statusCode -eq 409) {
        Write-Host "⚠ Test 2 PARTIAL: Duplicate record (409)" -ForegroundColor Yellow
    } else {
        Write-Host "✗ Test 2 FAILED: Unexpected error ($statusCode)" -ForegroundColor Red
        Write-Host "  Error: $errorBody" -ForegroundColor Red
    }
}

Write-Host ""

# Test Case 3: Validation test - missing required field (grade)
Write-Host "Test 3: Validation test - missing required field" -ForegroundColor Yellow
Write-Host "----------------------------------------------" -ForegroundColor Gray

$student3 = @{
    firstName = "Test"
    lastName = "Validation"
    dateOfBirth = "2015-01-01"
    studentNumber = "STU-TEST-003"
    gender = "OTHER"
    # Missing: grade (should fail)
} | ConvertTo-Json

Write-Host "Payload (missing grade):" -ForegroundColor Cyan
Write-Host $student3 -ForegroundColor Gray
Write-Host ""

try {
    $response3 = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $student3 -ContentType "application/json" -Headers @{
        Authorization = "Bearer test-token-here"
    } -ErrorAction Stop
    Write-Host "✗ Test 3 FAILED: Should have failed validation" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__

    if ($statusCode -eq 400) {
        Write-Host "✓ Test 3 PASSED: Correctly rejected missing required field (400)" -ForegroundColor Green
    } elseif ($statusCode -eq 401) {
        Write-Host "⚠ Test 3 SKIPPED: Authentication required (401)" -ForegroundColor Yellow
    } else {
        Write-Host "✗ Test 3 FAILED: Wrong error code ($statusCode, expected 400)" -ForegroundColor Red
    }
}

Write-Host ""

# Test Case 4: Validation test - invalid gender enum
Write-Host "Test 4: Validation test - invalid gender value" -ForegroundColor Yellow
Write-Host "----------------------------------------------" -ForegroundColor Gray

$student4 = @{
    firstName = "Test"
    lastName = "Gender"
    dateOfBirth = "2015-01-01"
    grade = "1"
    studentNumber = "STU-TEST-004"
    gender = "Male"  # Should be "MALE" (uppercase)
} | ConvertTo-Json

Write-Host "Payload (invalid gender 'Male' instead of 'MALE'):" -ForegroundColor Cyan
Write-Host $student4 -ForegroundColor Gray
Write-Host ""

try {
    $response4 = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $student4 -ContentType "application/json" -Headers @{
        Authorization = "Bearer test-token-here"
    } -ErrorAction Stop
    Write-Host "✗ Test 4 FAILED: Should have failed validation" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__

    if ($statusCode -eq 400) {
        Write-Host "✓ Test 4 PASSED: Correctly rejected invalid gender enum (400)" -ForegroundColor Green
    } elseif ($statusCode -eq 401) {
        Write-Host "⚠ Test 4 SKIPPED: Authentication required (401)" -ForegroundColor Yellow
    } else {
        Write-Host "✗ Test 4 FAILED: Wrong error code ($statusCode, expected 400)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tests completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Notes:" -ForegroundColor Yellow
Write-Host "- To run with actual authentication, replace 'test-token-here' with a valid JWT" -ForegroundColor Gray
Write-Host "- Test data may persist in database - check for duplicates" -ForegroundColor Gray
Write-Host "- Gender must be: MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY" -ForegroundColor Gray
Write-Host "- Required fields: firstName, lastName, dateOfBirth, grade, studentNumber, gender" -ForegroundColor Gray
Write-Host ""
