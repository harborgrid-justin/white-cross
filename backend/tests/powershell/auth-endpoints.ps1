# White Cross Healthcare Platform - Authentication Endpoint Tests
# Tests for /api/v1/auth endpoints

param(
    [string]$BaseUrl = "http://localhost:3000"
)

# Import common utilities
. "$PSScriptRoot\common-utils.ps1"

# Initialize test session
Initialize-TestSession -BaseUrl $BaseUrl

Write-Host "`n=== Authentication Endpoints Tests ===" -ForegroundColor Cyan

# Test data
$testUser = @{
    email = "test.nurse.$(Get-Random)@whitecross.test"
    password = "SecurePass123!"
    firstName = "Test"
    lastName = "Nurse"
    role = "NURSE"
}

# ============================================
# POST /api/v1/auth/register
# ============================================
Write-Host "`n--- POST /api/v1/auth/register ---" -ForegroundColor Yellow

# Test: Successful registration
$response = Test-SuccessResponse `
    -TestName "Register new user" `
    -Method "POST" `
    -Endpoint "/api/v1/auth/register" `
    -Body $testUser `
    -RequireAuth $false `
    -ExpectedStatusCode 201

# Test: Registration with missing fields
Test-ValidationError `
    -TestName "Register with missing email" `
    -Method "POST" `
    -Endpoint "/api/v1/auth/register" `
    -Body @{
        password = "SecurePass123!"
        firstName = "Test"
        lastName = "User"
        role = "NURSE"
    } `
    -RequireAuth $false

# Test: Registration with invalid email
Test-ValidationError `
    -TestName "Register with invalid email format" `
    -Method "POST" `
    -Endpoint "/api/v1/auth/register" `
    -Body @{
        email = "invalid-email"
        password = "SecurePass123!"
        firstName = "Test"
        lastName = "User"
        role = "NURSE"
    } `
    -RequireAuth $false

# Test: Registration with weak password
Test-ValidationError `
    -TestName "Register with weak password" `
    -Method "POST" `
    -Endpoint "/api/v1/auth/register" `
    -Body @{
        email = "test@whitecross.test"
        password = "weak"
        firstName = "Test"
        lastName = "User"
        role = "NURSE"
    } `
    -RequireAuth $false

# Test: Duplicate registration (409 conflict expected)
$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/auth/register" `
    -Body $testUser `
    -RequireAuth $false

if ($response.StatusCode -eq 409) {
    Write-TestResult -TestName "Register duplicate user returns 409" -Status "PASS" -StatusCode 409
} else {
    Write-TestResult -TestName "Register duplicate user returns 409" -Status "FAIL" -StatusCode $response.StatusCode -Details "Expected 409 Conflict"
}

# ============================================
# POST /api/v1/auth/login
# ============================================
Write-Host "`n--- POST /api/v1/auth/login ---" -ForegroundColor Yellow

# Test: Successful login
$loginResponse = Test-SuccessResponse `
    -TestName "Login with valid credentials" `
    -Method "POST" `
    -Endpoint "/api/v1/auth/login" `
    -Body @{
        email = $testUser.email
        password = $testUser.password
    } `
    -RequireAuth $false `
    -ExpectedStatusCode 200

# Store token for subsequent tests
if ($loginResponse.Success -and $loginResponse.Body.data.token) {
    $script:AuthToken = $loginResponse.Body.data.token
    Write-Host "Auth token stored for subsequent tests" -ForegroundColor Green
}

# Test: Login with invalid credentials
$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/auth/login" `
    -Body @{
        email = $testUser.email
        password = "WrongPassword123!"
    } `
    -RequireAuth $false

if ($response.StatusCode -eq 401) {
    Write-TestResult -TestName "Login with invalid password returns 401" -Status "PASS" -StatusCode 401
} else {
    Write-TestResult -TestName "Login with invalid password returns 401" -Status "FAIL" -StatusCode $response.StatusCode -Details "Expected 401 Unauthorized"
}

# Test: Login with non-existent user
$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/auth/login" `
    -Body @{
        email = "nonexistent@whitecross.test"
        password = "SomePassword123!"
    } `
    -RequireAuth $false

if ($response.StatusCode -eq 401) {
    Write-TestResult -TestName "Login with non-existent user returns 401" -Status "PASS" -StatusCode 401
} else {
    Write-TestResult -TestName "Login with non-existent user returns 401" -Status "FAIL" -StatusCode $response.StatusCode -Details "Expected 401 Unauthorized"
}

# Test: Login with missing fields
Test-ValidationError `
    -TestName "Login with missing email" `
    -Method "POST" `
    -Endpoint "/api/v1/auth/login" `
    -Body @{
        password = "SecurePass123!"
    } `
    -RequireAuth $false

# Test: Login with missing password
Test-ValidationError `
    -TestName "Login with missing password" `
    -Method "POST" `
    -Endpoint "/api/v1/auth/login" `
    -Body @{
        email = $testUser.email
    } `
    -RequireAuth $false

# ============================================
# POST /api/v1/auth/verify
# ============================================
Write-Host "`n--- POST /api/v1/auth/verify ---" -ForegroundColor Yellow

# Test: Verify valid token
Test-SuccessResponse `
    -TestName "Verify valid JWT token" `
    -Method "POST" `
    -Endpoint "/api/v1/auth/verify" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# Test: Verify invalid token
$tempToken = $script:AuthToken
$script:AuthToken = "invalid.jwt.token"

$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/auth/verify" `
    -RequireAuth $true

if ($response.StatusCode -eq 401) {
    Write-TestResult -TestName "Verify invalid token returns 401" -Status "PASS" -StatusCode 401
} else {
    Write-TestResult -TestName "Verify invalid token returns 401" -Status "FAIL" -StatusCode $response.StatusCode -Details "Expected 401 Unauthorized"
}

$script:AuthToken = $tempToken

# Test: Verify without token
Test-AuthenticationFailure `
    -TestName "Verify without token returns 401" `
    -Method "POST" `
    -Endpoint "/api/v1/auth/verify"

# ============================================
# POST /api/v1/auth/refresh
# ============================================
Write-Host "`n--- POST /api/v1/auth/refresh ---" -ForegroundColor Yellow

# Test: Refresh valid token
$refreshResponse = Test-SuccessResponse `
    -TestName "Refresh valid JWT token" `
    -Method "POST" `
    -Endpoint "/api/v1/auth/refresh" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# Update token if refresh succeeded
if ($refreshResponse.Success -and $refreshResponse.Body.data.token) {
    $script:AuthToken = $refreshResponse.Body.data.token
    Write-Host "Auth token refreshed" -ForegroundColor Green
}

# Test: Refresh invalid token
$tempToken = $script:AuthToken
$script:AuthToken = "invalid.jwt.token"

$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/auth/refresh" `
    -RequireAuth $true

if ($response.StatusCode -eq 401) {
    Write-TestResult -TestName "Refresh invalid token returns 401" -Status "PASS" -StatusCode 401
} else {
    Write-TestResult -TestName "Refresh invalid token returns 401" -Status "FAIL" -StatusCode $response.StatusCode -Details "Expected 401 Unauthorized"
}

$script:AuthToken = $tempToken

# Test: Refresh without token
Test-AuthenticationFailure `
    -TestName "Refresh without token returns 401" `
    -Method "POST" `
    -Endpoint "/api/v1/auth/refresh"

# ============================================
# GET /api/v1/auth/me
# ============================================
Write-Host "`n--- GET /api/v1/auth/me ---" -ForegroundColor Yellow

# Test: Get current user with valid token
Test-SuccessResponse `
    -TestName "Get current authenticated user" `
    -Method "GET" `
    -Endpoint "/api/v1/auth/me" `
    -RequireAuth $true `
    -ExpectedStatusCode 200

# Test: Get current user without token
Test-AuthenticationFailure `
    -TestName "Get current user without token returns 401" `
    -Method "GET" `
    -Endpoint "/api/v1/auth/me"

# Test: Get current user with invalid token
$tempToken = $script:AuthToken
$script:AuthToken = "invalid.jwt.token"

$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/auth/me" `
    -RequireAuth $true

if ($response.StatusCode -eq 401) {
    Write-TestResult -TestName "Get current user with invalid token returns 401" -Status "PASS" -StatusCode 401
} else {
    Write-TestResult -TestName "Get current user with invalid token returns 401" -Status "FAIL" -StatusCode $response.StatusCode -Details "Expected 401 Unauthorized"
}

$script:AuthToken = $tempToken

# ============================================
# Summary
# ============================================
$summary = Get-TestSummary
Export-TestResults -OutputPath "$PSScriptRoot\results\auth-endpoints-results.json"

# Return summary for master script
return $summary
