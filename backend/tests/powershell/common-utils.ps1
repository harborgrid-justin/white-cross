# White Cross Healthcare Platform - PowerShell Testing Utilities
# Common functions for API endpoint testing

# Configuration
$script:BaseUrl = "http://localhost:3000"
$script:AuthToken = $null
$script:TestResults = @()

# Color coding for output
function Write-TestResult {
    param(
        [string]$TestName,
        [string]$Status,
        [string]$Details = "",
        [int]$StatusCode = 0
    )

    $statusColor = switch ($Status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "SKIP" { "Yellow" }
        default { "White" }
    }

    Write-Host "[$Status] " -ForegroundColor $statusColor -NoNewline
    Write-Host "$TestName" -NoNewline
    if ($StatusCode -gt 0) {
        Write-Host " ($StatusCode)" -NoNewline
    }
    if ($Details) {
        Write-Host " - $Details"
    } else {
        Write-Host ""
    }

    # Store result
    $script:TestResults += @{
        TestName = $TestName
        Status = $Status
        StatusCode = $StatusCode
        Details = $Details
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }
}

# HTTP request wrapper with error handling
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [bool]$RequireAuth = $true,
        [int]$ExpectedStatusCode = 200
    )

    $uri = "$script:BaseUrl$Endpoint"
    $headers = @{
        "Content-Type" = "application/json"
    }

    if ($RequireAuth -and $script:AuthToken) {
        $headers["Authorization"] = "Bearer $script:AuthToken"
    }

    try {
        $params = @{
            Uri = $uri
            Method = $Method
            Headers = $headers
            TimeoutSec = 30
        }

        if ($Body) {
            $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
        }

        $response = Invoke-WebRequest @params -ErrorAction Stop

        $result = @{
            Success = $true
            StatusCode = $response.StatusCode
            Body = if ($response.Content) { $response.Content | ConvertFrom-Json } else { $null }
            Headers = $response.Headers
        }

        return $result
    }
    catch {
        $statusCode = 0
        $errorBody = $null

        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
            try {
                $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
                $errorBody = $reader.ReadToEnd() | ConvertFrom-Json
                $reader.Close()
            }
            catch {
                $errorBody = $_.Exception.Message
            }
        }

        return @{
            Success = $false
            StatusCode = $statusCode
            Error = $_.Exception.Message
            ErrorBody = $errorBody
        }
    }
}

# Test a successful response
function Test-SuccessResponse {
    param(
        [string]$TestName,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [bool]$RequireAuth = $true,
        [int]$ExpectedStatusCode = 200
    )

    $response = Invoke-ApiRequest -Method $Method -Endpoint $Endpoint -Body $Body -RequireAuth $RequireAuth -ExpectedStatusCode $ExpectedStatusCode

    if ($response.Success -and $response.StatusCode -eq $ExpectedStatusCode) {
        Write-TestResult -TestName $TestName -Status "PASS" -StatusCode $response.StatusCode
        return $response
    }
    else {
        Write-TestResult -TestName $TestName -Status "FAIL" -StatusCode $response.StatusCode -Details $response.Error
        return $response
    }
}

# Test an authentication failure (401)
function Test-AuthenticationFailure {
    param(
        [string]$TestName,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null
    )

    # Temporarily clear auth token
    $tempToken = $script:AuthToken
    $script:AuthToken = $null

    $response = Invoke-ApiRequest -Method $Method -Endpoint $Endpoint -Body $Body -RequireAuth $false -ExpectedStatusCode 401

    # Restore auth token
    $script:AuthToken = $tempToken

    if ($response.StatusCode -eq 401) {
        Write-TestResult -TestName $TestName -Status "PASS" -StatusCode $response.StatusCode
        return $response
    }
    else {
        Write-TestResult -TestName $TestName -Status "FAIL" -StatusCode $response.StatusCode -Details "Expected 401, got $($response.StatusCode)"
        return $response
    }
}

# Test a validation error (400)
function Test-ValidationError {
    param(
        [string]$TestName,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body,
        [bool]$RequireAuth = $true
    )

    $response = Invoke-ApiRequest -Method $Method -Endpoint $Endpoint -Body $Body -RequireAuth $RequireAuth -ExpectedStatusCode 400

    if ($response.StatusCode -eq 400) {
        Write-TestResult -TestName $TestName -Status "PASS" -StatusCode $response.StatusCode
        return $response
    }
    else {
        Write-TestResult -TestName $TestName -Status "FAIL" -StatusCode $response.StatusCode -Details "Expected 400, got $($response.StatusCode)"
        return $response
    }
}

# Test a not found error (404)
function Test-NotFoundError {
    param(
        [string]$TestName,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [bool]$RequireAuth = $true
    )

    $response = Invoke-ApiRequest -Method $Method -Endpoint $Endpoint -Body $Body -RequireAuth $RequireAuth -ExpectedStatusCode 404

    if ($response.StatusCode -eq 404) {
        Write-TestResult -TestName $TestName -Status "PASS" -StatusCode $response.StatusCode
        return $response
    }
    else {
        Write-TestResult -TestName $TestName -Status "FAIL" -StatusCode $response.StatusCode -Details "Expected 404, got $($response.StatusCode)"
        return $response
    }
}

# Test an authorization failure (403)
function Test-AuthorizationFailure {
    param(
        [string]$TestName,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [bool]$RequireAuth = $true
    )

    $response = Invoke-ApiRequest -Method $Method -Endpoint $Endpoint -Body $Body -RequireAuth $RequireAuth -ExpectedStatusCode 403

    if ($response.StatusCode -eq 403) {
        Write-TestResult -TestName $TestName -Status "PASS" -StatusCode $response.StatusCode
        return $response
    }
    else {
        Write-TestResult -TestName $TestName -Status "FAIL" -StatusCode $response.StatusCode -Details "Expected 403, got $($response.StatusCode)"
        return $response
    }
}

# Initialize test session
function Initialize-TestSession {
    param(
        [string]$BaseUrl = "http://localhost:3000"
    )

    $script:BaseUrl = $BaseUrl
    $script:TestResults = @()

    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "White Cross API Testing Suite" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Base URL: $script:BaseUrl`n" -ForegroundColor Cyan
}

# Generate test summary
function Get-TestSummary {
    $total = $script:TestResults.Count
    $passed = ($script:TestResults | Where-Object { $_.Status -eq "PASS" }).Count
    $failed = ($script:TestResults | Where-Object { $_.Status -eq "FAIL" }).Count
    $skipped = ($script:TestResults | Where-Object { $_.Status -eq "SKIP" }).Count

    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Test Summary" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Total Tests: $total" -ForegroundColor White
    Write-Host "Passed: $passed" -ForegroundColor Green
    Write-Host "Failed: $failed" -ForegroundColor Red
    Write-Host "Skipped: $skipped" -ForegroundColor Yellow

    if ($total -gt 0) {
        $passRate = [math]::Round(($passed / $total) * 100, 2)
        Write-Host "Pass Rate: $passRate%" -ForegroundColor $(if ($passRate -ge 80) { "Green" } elseif ($passRate -ge 60) { "Yellow" } else { "Red" })
    }
    Write-Host "========================================`n" -ForegroundColor Cyan

    return @{
        Total = $total
        Passed = $passed
        Failed = $failed
        Skipped = $skipped
        PassRate = if ($total -gt 0) { ($passed / $total) * 100 } else { 0 }
        Results = $script:TestResults
    }
}

# Export test results to file
function Export-TestResults {
    param(
        [string]$OutputPath
    )

    $summary = Get-TestSummary
    $output = @{
        Summary = @{
            Total = $summary.Total
            Passed = $summary.Passed
            Failed = $summary.Failed
            Skipped = $summary.Skipped
            PassRate = $summary.PassRate
        }
        Results = $script:TestResults
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }

    $output | ConvertTo-Json -Depth 10 | Out-File -FilePath $OutputPath -Encoding UTF8
    Write-Host "Test results exported to: $OutputPath" -ForegroundColor Green
}

# Login helper
function Login-AsUser {
    param(
        [string]$Email,
        [string]$Password
    )

    $body = @{
        email = $Email
        password = $Password
    }

    $response = Invoke-ApiRequest -Method "POST" -Endpoint "/api/v1/auth/login" -Body $body -RequireAuth $false -ExpectedStatusCode 200

    if ($response.Success -and $response.Body.data.token) {
        $script:AuthToken = $response.Body.data.token
        Write-Host "Logged in as: $Email" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "Login failed for: $Email" -ForegroundColor Red
        return $false
    }
}

# Logout helper
function Logout-User {
    $script:AuthToken = $null
    Write-Host "Logged out" -ForegroundColor Yellow
}

# Export functions
Export-ModuleMember -Function *
