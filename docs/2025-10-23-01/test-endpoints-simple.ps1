# White Cross Backend - Simple Endpoint Testing Script
# PowerShell script to test key API endpoints with curl

$BaseUrl = "http://localhost:3001"
$testResults = @()

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "White Cross API - Endpoint Testing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to test endpoint
function Test-Endpoint {
    param([string]$Endpoint, [string]$Description)

    Write-Host "Testing: $Description" -ForegroundColor Yellow
    Write-Host "  URL: $BaseUrl$Endpoint" -ForegroundColor Gray

    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl$Endpoint" -UseBasicParsing -ErrorAction Stop
        Write-Host "  ✓ SUCCESS - Status: $($response.StatusCode)" -ForegroundColor Green
        $script:testResults += [PSCustomObject]@{
            Endpoint = $Endpoint
            Status = "PASS"
            StatusCode = $response.StatusCode
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        if ($statusCode -eq 401) {
            Write-Host "  ⚠ AUTH REQUIRED - Status: 401" -ForegroundColor Cyan
            $script:testResults += [PSCustomObject]@{
                Endpoint = $Endpoint
                Status = "AUTH_REQUIRED"
                StatusCode = 401
            }
        }
        elseif ($statusCode -eq 404) {
            Write-Host "  ✗ NOT FOUND - Status: 404" -ForegroundColor Red
            $script:testResults += [PSCustomObject]@{
                Endpoint = $Endpoint
                Status = "NOT_FOUND"
                StatusCode = 404
            }
        }
        else {
            Write-Host "  ✗ ERROR - Status: $statusCode" -ForegroundColor Red
            $script:testResults += [PSCustomObject]@{
                Endpoint = $Endpoint
                Status = "FAIL"
                StatusCode = $statusCode
            }
        }
    }
    Write-Host ""
}

# Test 1: Health Check
Write-Host "[1] Testing Core Endpoints" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan
Test-Endpoint "/health" "Health Check"
Test-Endpoint "/documentation/swagger.json" "Swagger JSON"
Test-Endpoint "/documentation" "Swagger UI"

# Test 2: Module Endpoints
Write-Host "[2] Testing Module Endpoints" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

# Core Module
Test-Endpoint "/api/v1/auth/me" "Auth - Get Current User"
Test-Endpoint "/api/v1/users" "Users - List All"

# Healthcare Module
Test-Endpoint "/api/v1/medications" "Medications - List All"
Test-Endpoint "/api/v1/health-records/student/123" "Health Records - Student"

# Operations Module
Test-Endpoint "/api/v1/students" "Students - List All"
Test-Endpoint "/api/v1/appointments" "Appointments - List All"
Test-Endpoint "/api/v1/inventory" "Inventory - List All"

# Communications Module
Test-Endpoint "/api/v1/communications/messages" "Messages - List All"
Test-Endpoint "/api/v1/communications/broadcasts" "Broadcasts - List All"

# Compliance & System Module
Test-Endpoint "/api/v1/audit/logs" "Audit - Logs"
Test-Endpoint "/api/v1/compliance/reports" "Compliance - Reports"
Test-Endpoint "/api/v1/system/config" "System - Configuration"

# Documents & Incidents Module
Test-Endpoint "/api/v1/documents" "Documents - List All"
Test-Endpoint "/api/v1/incidents" "Incidents - List All"

# Analytics Module
Test-Endpoint "/api/v1/analytics/health-metrics" "Analytics - Health Metrics"

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$passCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$authCount = ($testResults | Where-Object { $_.Status -eq "AUTH_REQUIRED" }).Count
$notFoundCount = ($testResults | Where-Object { $_.Status -eq "NOT_FOUND" }).Count
$failCount = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$totalCount = $testResults.Count

Write-Host "Total Tests: $totalCount" -ForegroundColor White
Write-Host "✓ Passed: $passCount" -ForegroundColor Green
Write-Host "⚠ Auth Required: $authCount" -ForegroundColor Cyan
Write-Host "✗ Not Found: $notFoundCount" -ForegroundColor Red
Write-Host "✗ Failed: $failCount" -ForegroundColor Red
Write-Host ""

# Display table
$testResults | Format-Table -Property Endpoint, Status, StatusCode -AutoSize

# Save results
$resultsPath = "F:\temp\white-cross\test-results.json"
$testResults | ConvertTo-Json | Out-File -FilePath $resultsPath -Encoding UTF8
Write-Host "Results saved to: $resultsPath" -ForegroundColor Gray
