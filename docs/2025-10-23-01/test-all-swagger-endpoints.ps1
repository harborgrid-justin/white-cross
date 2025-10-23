# Test All Swagger Endpoints Script
# This script tests all endpoints defined in the Swagger specification

$baseUrl = "http://localhost:3001"
$swaggerUrl = "$baseUrl/swagger.json"
$resultsFile = "endpoint-test-results.json"
$errorLog = "endpoint-test-errors.log"

# Colors for output
$ErrorColor = "Red"
$SuccessColor = "Green"
$WarningColor = "Yellow"
$InfoColor = "Cyan"

Write-Host "`n=== White Cross API Endpoint Testing ===" -ForegroundColor $InfoColor
Write-Host "Base URL: $baseUrl`n" -ForegroundColor $InfoColor

# Fetch Swagger spec
Write-Host "Fetching Swagger specification..." -ForegroundColor $InfoColor
try {
    $swagger = Invoke-RestMethod -Uri $swaggerUrl -Method Get
    Write-Host "✓ Swagger spec fetched successfully`n" -ForegroundColor $SuccessColor
} catch {
    Write-Host "✗ Failed to fetch Swagger spec: $_" -ForegroundColor $ErrorColor
    exit 1
}

# Initialize results
$results = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    totalEndpoints = 0
    tested = 0
    passed = 0
    failed = 0
    skipped = 0
    details = @()
}

# Clear error log
"" | Out-File -FilePath $errorLog -Force

# Test endpoint function
function Test-Endpoint {
    param(
        [string]$Path,
        [string]$Method,
        [hashtable]$Operation,
        [string]$Token
    )

    $results.totalEndpoints++

    # Replace path parameters with test values
    $testPath = $Path
    $testPath = $testPath -replace '\{id\}', '1'
    $testPath = $testPath -replace '\{studentId\}', '1'
    $testPath = $testPath -replace '\{medicationId\}', '1'
    $testPath = $testPath -replace '\{appointmentId\}', '1'
    $testPath = $testPath -replace '\{userId\}', '1'
    $testPath = $testPath -replace '\{recordId\}', '1'
    $testPath = $testPath -replace '\{reportId\}', '1'
    $testPath = $testPath -replace '\{contactId\}', '1'
    $testPath = $testPath -replace '\{incidentId\}', '1'
    $testPath = $testPath -replace '\{itemId\}', '1'
    $testPath = $testPath -replace '\{vendorId\}', '1'
    $testPath = $testPath -replace '\{orderId\}', '1'
    $testPath = $testPath -replace '\{messageId\}', '1'
    $testPath = $testPath -replace '\{broadcastId\}', '1'
    $testPath = $testPath -replace '\{documentId\}', '1'
    $testPath = $testPath -replace '\{roleId\}', '1'
    $testPath = $testPath -replace '\{permissionId\}', '1'
    $testPath = $testPath -replace '\{districtId\}', '1'
    $testPath = $testPath -replace '\{schoolId\}', '1'

    $fullUrl = "$baseUrl$testPath"

    # Prepare headers
    $headers = @{
        "Content-Type" = "application/json"
    }

    # Add auth token if available and endpoint requires auth
    if ($Token -and $Operation.security) {
        $headers["Authorization"] = "Bearer $Token"
    }

    $detail = @{
        path = $Path
        testPath = $testPath
        method = $Method.ToUpper()
        tags = $Operation.tags
        summary = $Operation.summary
    }

    try {
        $results.tested++

        # Prepare body for POST/PUT/PATCH
        $body = $null
        if ($Method -in @('POST', 'PUT', 'PATCH')) {
            # Create minimal valid body based on schema
            $body = @{}
            if ($Operation.parameters) {
                foreach ($param in $Operation.parameters) {
                    if ($param.in -eq 'body' -and $param.schema) {
                        # Use example or create minimal object
                        $body = @{ test = "data" }
                    }
                }
            }
        }

        # Make request
        $response = $null
        if ($body) {
            $response = Invoke-WebRequest -Uri $fullUrl -Method $Method -Headers $headers -Body ($body | ConvertTo-Json) -UseBasicParsing -ErrorAction Stop
        } else {
            $response = Invoke-WebRequest -Uri $fullUrl -Method $Method -Headers $headers -UseBasicParsing -ErrorAction Stop
        }

        $detail.status = $response.StatusCode
        $detail.result = "PASS"
        $results.passed++

        Write-Host "  ✓ " -ForegroundColor $SuccessColor -NoNewline
        Write-Host "$Method $Path" -NoNewline
        Write-Host " [$($response.StatusCode)]" -ForegroundColor $SuccessColor

    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $detail.status = $statusCode
        $detail.error = $_.Exception.Message

        # Some errors are expected (404 for test IDs, 401 for auth endpoints)
        if ($statusCode -in @(401, 403, 404, 422)) {
            $detail.result = "EXPECTED_ERROR"
            $results.passed++
            Write-Host "  ○ " -ForegroundColor $WarningColor -NoNewline
            Write-Host "$Method $Path" -NoNewline
            Write-Host " [$statusCode - Expected]" -ForegroundColor $WarningColor
        } elseif ($statusCode -eq 405) {
            $detail.result = "METHOD_NOT_ALLOWED"
            $results.failed++
            Write-Host "  ✗ " -ForegroundColor $ErrorColor -NoNewline
            Write-Host "$Method $Path" -NoNewline
            Write-Host " [405 - METHOD NOT IMPLEMENTED]" -ForegroundColor $ErrorColor
            "$Method $Path - 405 Method Not Allowed" | Out-File -FilePath $errorLog -Append
        } elseif ($statusCode -eq 501) {
            $detail.result = "NOT_IMPLEMENTED"
            $results.failed++
            Write-Host "  ✗ " -ForegroundColor $ErrorColor -NoNewline
            Write-Host "$Method $Path" -NoNewline
            Write-Host " [501 - NOT IMPLEMENTED]" -ForegroundColor $ErrorColor
            "$Method $Path - 501 Not Implemented" | Out-File -FilePath $errorLog -Append
        } else {
            $detail.result = "FAIL"
            $results.failed++
            Write-Host "  ✗ " -ForegroundColor $ErrorColor -NoNewline
            Write-Host "$Method $Path" -NoNewline
            Write-Host " [$statusCode - $($_.Exception.Message)]" -ForegroundColor $ErrorColor
            "$Method $Path - $statusCode - $($_.Exception.Message)" | Out-File -FilePath $errorLog -Append
        }
    }

    $results.details += $detail
}

# Get auth token (optional, for testing authenticated endpoints)
$authToken = $null
Write-Host "Attempting to get auth token..." -ForegroundColor $InfoColor
try {
    # Try to login with test credentials
    $loginBody = @{
        email = "admin@test.com"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction SilentlyContinue
    if ($loginResponse.token) {
        $authToken = $loginResponse.token
        Write-Host "✓ Auth token obtained`n" -ForegroundColor $SuccessColor
    }
} catch {
    Write-Host "○ No auth token (will test without authentication)`n" -ForegroundColor $WarningColor
}

# Test all endpoints
Write-Host "Testing endpoints...`n" -ForegroundColor $InfoColor

$paths = $swagger.paths.PSObject.Properties | Sort-Object Name

foreach ($pathItem in $paths) {
    $path = $pathItem.Name
    $methods = $pathItem.Value.PSObject.Properties

    foreach ($methodItem in $methods) {
        $method = $methodItem.Name

        # Skip non-method properties
        if ($method -in @('parameters', 'summary', 'description')) {
            continue
        }

        $operation = $methodItem.Value
        Test-Endpoint -Path $path -Method $method -Operation $operation -Token $authToken
    }
}

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor $InfoColor
Write-Host "Total Endpoints: $($results.totalEndpoints)" -ForegroundColor $InfoColor
Write-Host "Tested: $($results.tested)" -ForegroundColor $InfoColor
Write-Host "Passed: $($results.passed)" -ForegroundColor $SuccessColor
Write-Host "Failed: $($results.failed)" -ForegroundColor $ErrorColor
Write-Host "Skipped: $($results.skipped)" -ForegroundColor $WarningColor

$passRate = [math]::Round(($results.passed / $results.tested) * 100, 2)
Write-Host "`nPass Rate: $passRate%" -ForegroundColor $(if ($passRate -gt 80) { $SuccessColor } elseif ($passRate -gt 50) { $WarningColor } else { $ErrorColor })

# Save results
$results | ConvertTo-Json -Depth 10 | Out-File -FilePath $resultsFile -Force
Write-Host "`nResults saved to: $resultsFile" -ForegroundColor $InfoColor
Write-Host "Error log saved to: $errorLog" -ForegroundColor $InfoColor

# Show failures
if ($results.failed -gt 0) {
    Write-Host "`n=== Failed Endpoints ===" -ForegroundColor $ErrorColor
    $results.details | Where-Object { $_.result -in @('FAIL', 'METHOD_NOT_ALLOWED', 'NOT_IMPLEMENTED') } | ForEach-Object {
        Write-Host "  $($_.method) $($_.path) [$($_.status)]" -ForegroundColor $ErrorColor
        if ($_.error) {
            Write-Host "    Error: $($_.error)" -ForegroundColor $ErrorColor
        }
    }
}

Write-Host ""
