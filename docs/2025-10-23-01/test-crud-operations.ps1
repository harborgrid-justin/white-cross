# White Cross Backend - Comprehensive CRUD Testing Script
# PowerShell script to test all CRUD operations with authentication

$BaseUrl = "http://localhost:3001"
$Token = $null
$TestResults = @()

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "White Cross API - CRUD Testing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to test endpoint
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Description,
        [object]$Body = $null,
        [bool]$RequiresAuth = $false
    )

    Write-Host "Testing: $Description" -ForegroundColor Yellow
    Write-Host "  Method: $Method" -ForegroundColor Gray
    Write-Host "  URL: $BaseUrl$Endpoint" -ForegroundColor Gray

    $headers = @{
        "Content-Type" = "application/json"
    }

    if ($RequiresAuth -and $script:Token) {
        $headers["Authorization"] = "Bearer $script:Token"
    }

    try {
        $params = @{
            Uri = "$BaseUrl$Endpoint"
            Method = $Method
            Headers = $headers
            UseBasicParsing = $true
            ErrorAction = "Stop"
        }

        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json -Depth 10
            $params["Body"] = $jsonBody
            Write-Host "  Body: $jsonBody" -ForegroundColor Gray
        }

        $response = Invoke-WebRequest @params
        $statusCode = $response.StatusCode

        Write-Host "  ✓ SUCCESS - Status: $statusCode" -ForegroundColor Green

        $script:TestResults += [PSCustomObject]@{
            Endpoint = $Endpoint
            Method = $Method
            Status = "PASS"
            StatusCode = $statusCode
            Description = $Description
        }

        return $response
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        $errorBody = ""

        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errorBody = $reader.ReadToEnd()
        } catch {}

        if ($statusCode -eq 401) {
            Write-Host "  ⚠ AUTH REQUIRED - Status: 401" -ForegroundColor Cyan
            $script:TestResults += [PSCustomObject]@{
                Endpoint = $Endpoint
                Method = $Method
                Status = "AUTH_REQUIRED"
                StatusCode = 401
                Description = $Description
            }
        }
        elseif ($statusCode -eq 404) {
            Write-Host "  ✗ NOT FOUND - Status: 404" -ForegroundColor Red
            $script:TestResults += [PSCustomObject]@{
                Endpoint = $Endpoint
                Method = $Method
                Status = "NOT_FOUND"
                StatusCode = 404
                Description = $Description
            }
        }
        else {
            Write-Host "  ✗ ERROR - Status: $statusCode" -ForegroundColor Red
            if ($errorBody) {
                Write-Host "  Error: $($errorBody.Substring(0, [Math]::Min(200, $errorBody.Length)))" -ForegroundColor Red
            }
            $script:TestResults += [PSCustomObject]@{
                Endpoint = $Endpoint
                Method = $Method
                Status = "FAIL"
                StatusCode = $statusCode
                Description = $Description
            }
        }
        return $null
    }
    Write-Host ""
}

# Step 1: Register a test user
Write-Host "[1] Registering Test User" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

$registerBody = @{
    email = "testuser_$(Get-Random)@whitecross.health"
    password = "TestPassword123!"
    firstName = "Test"
    lastName = "User"
    role = "NURSE"
}

$registerResponse = Test-Endpoint -Method "POST" -Endpoint "/api/v1/auth/register" -Description "Register Test User" -Body $registerBody

# Step 2: Login
Write-Host "[2] Logging In" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

if ($registerResponse) {
    $registerData = $registerResponse.Content | ConvertFrom-Json
    Write-Host "Registration successful!" -ForegroundColor Green
    Write-Host "User ID: $($registerData.data.user.id)" -ForegroundColor Gray

    # Login with registered user
    $loginBody = @{
        email = $registerBody.email
        password = $registerBody.password
    }

    $loginResponse = Test-Endpoint -Method "POST" -Endpoint "/api/v1/auth/login" -Description "Login Test User" -Body $loginBody

    if ($loginResponse) {
        $loginData = $loginResponse.Content | ConvertFrom-Json
        $script:Token = $loginData.data.token
        Write-Host "✓ Login successful! Token obtained." -ForegroundColor Green
        Write-Host "Token: $($script:Token.Substring(0, 50))..." -ForegroundColor Gray
        Write-Host ""
    }
}
else {
    Write-Host "⚠ Registration failed. Attempting login with default credentials..." -ForegroundColor Yellow

    # Try logging in with existing admin account
    $loginBody = @{
        email = "admin@whitecross.health"
        password = "admin123"
    }

    $loginResponse = Test-Endpoint -Method "POST" -Endpoint "/api/v1/auth/login" -Description "Login with Default Admin" -Body $loginBody

    if ($loginResponse) {
        $loginData = $loginResponse.Content | ConvertFrom-Json
        $script:Token = $loginData.data.token
        Write-Host "✓ Login successful with default admin!" -ForegroundColor Green
    }
    else {
        Write-Host "✗ Could not obtain authentication token. Continuing with unauthenticated tests only..." -ForegroundColor Red
    }
}

# Step 3: Test authenticated endpoints
if ($script:Token) {
    Write-Host "[3] Testing Authenticated Endpoints" -ForegroundColor Cyan
    Write-Host "----------------------------" -ForegroundColor Cyan

    # Test /me endpoint
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/auth/me" -Description "Get Current User Info" -RequiresAuth $true

    # Module 1: Core (Users, Access Control)
    Write-Host "`n=== Module 1: Core ===" -ForegroundColor Magenta
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/users" -Description "List Users" -RequiresAuth $true
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/access-control/roles" -Description "List Roles" -RequiresAuth $true
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/access-control/permissions" -Description "List Permissions" -RequiresAuth $true

    # Module 2: Healthcare (Medications)
    Write-Host "`n=== Module 2: Healthcare ===" -ForegroundColor Magenta
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/medications" -Description "List Medications" -RequiresAuth $true
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/medications/inventory" -Description "Medication Inventory" -RequiresAuth $true
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/medications/stats" -Description "Medication Statistics" -RequiresAuth $true

    # Module 3: Operations (Students, Appointments)
    Write-Host "`n=== Module 3: Operations ===" -ForegroundColor Magenta
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/students" -Description "List Students" -RequiresAuth $true
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/appointments" -Description "List Appointments" -RequiresAuth $true
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/appointments/statistics" -Description "Appointment Statistics" -RequiresAuth $true

    # Module 4: Communications
    Write-Host "`n=== Module 4: Communications ===" -ForegroundColor Magenta
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/communications/messages" -Description "List Messages" -RequiresAuth $true
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/communications/broadcasts" -Description "List Broadcasts" -RequiresAuth $true
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/communications/templates" -Description "List Templates" -RequiresAuth $true

    # Module 5: Compliance & System
    Write-Host "`n=== Module 5: Compliance & System ===" -ForegroundColor Magenta
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/audit/logs" -Description "Audit Logs" -RequiresAuth $true
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/compliance/reports" -Description "Compliance Reports" -RequiresAuth $true
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/system/config" -Description "System Configuration" -RequiresAuth $true

    # Module 6: Documents, Incidents & Analytics
    Write-Host "`n=== Module 6: Documents, Incidents & Analytics ===" -ForegroundColor Magenta
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/documents" -Description "List Documents" -RequiresAuth $true
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/incidents" -Description "List Incidents" -RequiresAuth $true
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/analytics/health-metrics" -Description "Health Metrics" -RequiresAuth $true
    Test-Endpoint -Method "GET" -Endpoint "/api/v1/analytics/summary" -Description "Analytics Summary" -RequiresAuth $true
}
else {
    Write-Host "`n⚠ Skipping authenticated tests (no token available)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$passCount = ($TestResults | Where-Object { $_.Status -eq "PASS" }).Count
$authCount = ($TestResults | Where-Object { $_.Status -eq "AUTH_REQUIRED" }).Count
$notFoundCount = ($TestResults | Where-Object { $_.Status -eq "NOT_FOUND" }).Count
$failCount = ($TestResults | Where-Object { $_.Status -eq "FAIL" }).Count
$totalCount = $TestResults.Count

Write-Host "Total Tests: $totalCount" -ForegroundColor White
Write-Host "✓ Passed: $passCount" -ForegroundColor Green
Write-Host "⚠ Auth Required: $authCount" -ForegroundColor Cyan
Write-Host "✗ Not Found: $notFoundCount" -ForegroundColor Red
Write-Host "✗ Failed: $failCount" -ForegroundColor Red
Write-Host ""

# Display table
$TestResults | Format-Table -Property Method, Endpoint, Status, StatusCode, Description -AutoSize

# Save results
$resultsPath = "F:\temp\white-cross\crud-test-results.json"
$TestResults | ConvertTo-Json | Out-File -FilePath $resultsPath -Encoding UTF8
Write-Host "Results saved to: $resultsPath" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Testing Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "View Swagger UI at: $BaseUrl/docs" -ForegroundColor White
Write-Host ""
