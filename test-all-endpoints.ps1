# White Cross Backend - Comprehensive Endpoint Testing Script
# PowerShell script to test all major API endpoints with curl

param(
    [string]$BaseUrl = "http://localhost:3001",
    [int]$WaitTime = 30
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "White Cross API - Endpoint Testing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$testResults = @()
$jwt_token = $null

# Function to make HTTP request and record result
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Description,
        [string]$Body = $null,
        [bool]$RequiresAuth = $false,
        [string]$ExpectedStatus = "200"
    )

    Write-Host "Testing: $Description" -ForegroundColor Yellow
    Write-Host "  Method: $Method" -ForegroundColor Gray
    Write-Host "  URL: $BaseUrl$Endpoint" -ForegroundColor Gray

    $headers = @{
        "Content-Type" = "application/json"
    }

    if ($RequiresAuth -and $jwt_token) {
        $headers["Authorization"] = "Bearer $jwt_token"
    }

    try {
        $response = $null
        $statusCode = $null

        if ($Method -eq "GET") {
            $response = Invoke-WebRequest -Uri "$BaseUrl$Endpoint" -Method GET -Headers $headers -UseBasicParsing -ErrorAction Stop
            $statusCode = $response.StatusCode
        }
        elseif ($Method -eq "POST" -and $Body) {
            $response = Invoke-WebRequest -Uri "$BaseUrl$Endpoint" -Method POST -Headers $headers -Body $Body -UseBasicParsing -ErrorAction Stop
            $statusCode = $response.StatusCode
        }
        elseif ($Method -eq "POST") {
            $response = Invoke-WebRequest -Uri "$BaseUrl$Endpoint" -Method POST -Headers $headers -UseBasicParsing -ErrorAction Stop
            $statusCode = $response.StatusCode
        }

        if ($statusCode -eq $ExpectedStatus -or $statusCode -eq 200 -or $statusCode -eq 201) {
            Write-Host "  ✓ SUCCESS - Status: $statusCode" -ForegroundColor Green
            $script:testResults += [PSCustomObject]@{
                Endpoint = $Endpoint
                Status = "PASS"
                StatusCode = $statusCode
                Description = $Description
            }
            return $response
        }
        else {
            Write-Host "  ✗ UNEXPECTED STATUS - Status: $statusCode (Expected: $ExpectedStatus)" -ForegroundColor Yellow
            $script:testResults += [PSCustomObject]@{
                Endpoint = $Endpoint
                Status = "WARN"
                StatusCode = $statusCode
                Description = $Description
            }
            return $response
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        if ($statusCode -eq 401 -and $RequiresAuth) {
            Write-Host "  ⚠ EXPECTED AUTH FAILURE - Status: 401 (Requires authentication)" -ForegroundColor Cyan
            $script:testResults += [PSCustomObject]@{
                Endpoint = $Endpoint
                Status = "AUTH_REQUIRED"
                StatusCode = 401
                Description = $Description
            }
        }
        elseif ($statusCode -eq 404) {
            Write-Host "  ✗ NOT FOUND - Status: 404" -ForegroundColor Red
            $script:testResults += [PSCustomObject]@{
                Endpoint = $Endpoint
                Status = "NOT_FOUND"
                StatusCode = 404
                Description = $Description
            }
        }
        else {
            Write-Host "  ✗ FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
            $script:testResults += [PSCustomObject]@{
                Endpoint = $Endpoint
                Status = "FAIL"
                StatusCode = $statusCode
                Description = $Description
            }
        }
        return $null
    }

    Write-Host ""
}

# Check if server is already running
Write-Host "[1] Checking if server is running..." -ForegroundColor Cyan
try {
    $healthCheck = Invoke-WebRequest -Uri "$BaseUrl/health" -UseBasicParsing -ErrorAction Stop
    Write-Host "✓ Server is already running!" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "✗ Server is not running. Starting server..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Starting backend server (this will take $WaitTime seconds)..." -ForegroundColor Yellow

    # Start server in background
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd F:\temp\white-cross\backend; npm run dev" -WindowStyle Minimized

    Write-Host "Waiting $WaitTime seconds for server to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds $WaitTime

    # Verify server started
    try {
        $healthCheck = Invoke-WebRequest -Uri "$BaseUrl/health" -UseBasicParsing -ErrorAction Stop
        Write-Host "✓ Server started successfully!" -ForegroundColor Green
        Write-Host ""
    }
    catch {
        Write-Host "✗ Server failed to start. Please start manually and run this script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[2] Testing Core Endpoints" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test Health Check
Test-Endpoint -Method "GET" -Endpoint "/health" -Description "Health Check Endpoint"

# Test Swagger JSON
Test-Endpoint -Method "GET" -Endpoint "/documentation/swagger.json" -Description "Swagger JSON Specification"

# Test Swagger UI (HTML)
Test-Endpoint -Method "GET" -Endpoint "/documentation" -Description "Swagger UI Documentation Page"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[3] Testing Module Endpoints (Sample)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Core Module - Authentication (These should work without auth)
Write-Host "--- Core Module: Authentication ---" -ForegroundColor Magenta
# These will fail because we don't have valid credentials, but we're testing that the routes exist
Test-Endpoint -Method "GET" -Endpoint "/api/v1/auth/me" -Description "Get Current User (Auth Required)" -RequiresAuth $true

# Core Module - Users (Requires auth)
Write-Host "--- Core Module: Users ---" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/v1/users" -Description "List Users (Auth Required)" -RequiresAuth $true

# Healthcare Module
Write-Host "--- Healthcare Module ---" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/v1/medications" -Description "List Medications (Auth Required)" -RequiresAuth $true
Test-Endpoint -Method "GET" -Endpoint "/api/v1/medications/inventory" -Description "Medication Inventory (Auth Required)" -RequiresAuth $true

# Operations Module
Write-Host "--- Operations Module ---" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/v1/students" -Description "List Students (Auth Required)" -RequiresAuth $true
Test-Endpoint -Method "GET" -Endpoint "/api/v1/appointments" -Description "List Appointments (Auth Required)" -RequiresAuth $true
Test-Endpoint -Method "GET" -Endpoint "/api/v1/inventory" -Description "Inventory Items (Auth Required)" -RequiresAuth $true

# Communications Module
Write-Host "--- Communications Module ---" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/v1/communications/messages" -Description "List Messages (Auth Required)" -RequiresAuth $true
Test-Endpoint -Method "GET" -Endpoint "/api/v1/communications/broadcasts" -Description "List Broadcasts (Auth Required)" -RequiresAuth $true

# Compliance Module
Write-Host "--- Compliance Module ---" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/v1/audit/logs" -Description "Audit Logs (Auth Required)" -RequiresAuth $true
Test-Endpoint -Method "GET" -Endpoint "/api/v1/compliance/reports" -Description "Compliance Reports (Auth Required)" -RequiresAuth $true

# System Module
Write-Host "--- System Module ---" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/v1/system/config" -Description "System Configuration (Auth Required)" -RequiresAuth $true
Test-Endpoint -Method "GET" -Endpoint "/api/v1/system/integrations" -Description "System Integrations (Auth Required)" -RequiresAuth $true

# Documents Module
Write-Host "--- Documents Module ---" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/v1/documents" -Description "List Documents (Auth Required)" -RequiresAuth $true

# Incidents Module
Write-Host "--- Incidents Module ---" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/v1/incidents" -Description "List Incidents (Auth Required)" -RequiresAuth $true

# Analytics Module
Write-Host "--- Analytics Module ---" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/v1/analytics/health-metrics" -Description "Health Metrics Analytics (Auth Required)" -RequiresAuth $true

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[4] Test Results Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Count results
$passCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$authRequiredCount = ($testResults | Where-Object { $_.Status -eq "AUTH_REQUIRED" }).Count
$notFoundCount = ($testResults | Where-Object { $_.Status -eq "NOT_FOUND" }).Count
$failCount = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$totalCount = $testResults.Count

Write-Host "Total Tests: $totalCount" -ForegroundColor White
Write-Host "✓ Passed (Public): $passCount" -ForegroundColor Green
Write-Host "⚠ Auth Required (Expected): $authRequiredCount" -ForegroundColor Cyan
Write-Host "✗ Not Found: $notFoundCount" -ForegroundColor Red
Write-Host "✗ Failed: $failCount" -ForegroundColor Red
Write-Host ""

# Display detailed results
Write-Host "Detailed Results:" -ForegroundColor Yellow
$testResults | Format-Table -Property Endpoint, Status, StatusCode, Description -AutoSize

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Testing Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access Swagger UI at: $BaseUrl/documentation" -ForegroundColor White
Write-Host ""

# Export results to JSON
$resultsPath = "F:\temp\white-cross\test-results.json"
$testResults | ConvertTo-Json | Out-File -FilePath $resultsPath -Encoding UTF8
Write-Host "Test results saved to: $resultsPath" -ForegroundColor Gray
Write-Host ""
