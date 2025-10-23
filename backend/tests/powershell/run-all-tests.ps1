# White Cross Healthcare Platform - Master Test Runner
# Executes all endpoint tests and generates comprehensive report

param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$TestEmail = "test.admin@whitecross.test",
    [string]$TestPassword = "Admin123!",
    [switch]$SkipAuth = $false
)

# Set error action preference
$ErrorActionPreference = "Continue"

# Clear screen and show header
Clear-Host
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "White Cross API Testing Suite" -ForegroundColor Cyan
Write-Host "Master Test Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor White
Write-Host "Start Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n" -ForegroundColor White

# Create results directory
$resultsDir = "$PSScriptRoot\results"
if (-not (Test-Path $resultsDir)) {
    New-Item -Path $resultsDir -ItemType Directory -Force | Out-Null
    Write-Host "Created results directory: $resultsDir`n" -ForegroundColor Green
}

# Import common utilities
. "$PSScriptRoot\common-utils.ps1"

# Initialize test session
Initialize-TestSession -BaseUrl $BaseUrl

# Track overall results
$allResults = @()
$startTime = Get-Date

# ============================================
# STEP 1: Authentication Setup
# ============================================
Write-Host "`n=== STEP 1: Authentication Setup ===" -ForegroundColor Magenta

if (-not $SkipAuth) {
    Write-Host "Attempting to login with test credentials..." -ForegroundColor Yellow

    # Try to register test user first (may fail if already exists)
    $registerData = @{
        email = $TestEmail
        password = $TestPassword
        firstName = "Test"
        lastName = "Admin"
        role = "ADMIN"
    }

    $response = Invoke-ApiRequest `
        -Method "POST" `
        -Endpoint "/api/v1/auth/register" `
        -Body $registerData `
        -RequireAuth $false

    if ($response.Success) {
        Write-Host "Test user registered successfully" -ForegroundColor Green
    } elseif ($response.StatusCode -eq 409) {
        Write-Host "Test user already exists (this is OK)" -ForegroundColor Yellow
    } else {
        Write-Host "Warning: Could not register test user" -ForegroundColor Yellow
    }

    # Login to get auth token
    $loginSuccess = Login-AsUser -Email $TestEmail -Password $TestPassword

    if (-not $loginSuccess) {
        Write-Host "`nERROR: Could not authenticate. Tests will likely fail.`n" -ForegroundColor Red
        Write-Host "Please ensure:" -ForegroundColor Yellow
        Write-Host "  1. The backend server is running at $BaseUrl" -ForegroundColor Yellow
        Write-Host "  2. You can create a test user manually and provide credentials`n" -ForegroundColor Yellow

        $continue = Read-Host "Continue anyway? (y/n)"
        if ($continue -ne "y") {
            Write-Host "Test run cancelled" -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "Skipping authentication (using existing token or no auth)" -ForegroundColor Yellow
}

# ============================================
# STEP 2: Run Test Suites
# ============================================
Write-Host "`n=== STEP 2: Running Test Suites ===" -ForegroundColor Magenta

$testSuites = @(
    @{ Name = "Authentication"; Script = "auth-endpoints.ps1" },
    @{ Name = "Students"; Script = "students-endpoints.ps1" },
    @{ Name = "Medications"; Script = "medications-endpoints.ps1" },
    @{ Name = "Health Records"; Script = "health-records-endpoints.ps1" },
    @{ Name = "Appointments"; Script = "appointments-endpoints.ps1" },
    @{ Name = "Audit & Compliance"; Script = "audit-endpoints.ps1" }
)

foreach ($suite in $testSuites) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Running: $($suite.Name) Tests" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan

    $scriptPath = Join-Path $PSScriptRoot $suite.Script

    if (Test-Path $scriptPath) {
        try {
            # Run the test script and capture summary
            $summary = & $scriptPath -BaseUrl $BaseUrl -AuthToken $script:AuthToken

            # Store results
            $allResults += @{
                Suite = $suite.Name
                Script = $suite.Script
                Summary = $summary
                Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            }

            Write-Host "`n[$($suite.Name)] Completed - Pass: $($summary.Passed), Fail: $($summary.Failed), Skip: $($summary.Skipped)" -ForegroundColor $(if ($summary.Failed -eq 0) { "Green" } else { "Yellow" })
        }
        catch {
            Write-Host "ERROR running $($suite.Name) tests: $($_.Exception.Message)" -ForegroundColor Red
            $allResults += @{
                Suite = $suite.Name
                Script = $suite.Script
                Error = $_.Exception.Message
                Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            }
        }
    }
    else {
        Write-Host "SKIP: Test script not found: $scriptPath" -ForegroundColor Yellow
        $allResults += @{
            Suite = $suite.Name
            Script = $suite.Script
            Skipped = $true
            Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        }
    }
}

# ============================================
# STEP 3: Generate Comprehensive Report
# ============================================
Write-Host "`n=== STEP 3: Generating Comprehensive Report ===" -ForegroundColor Magenta

$endTime = Get-Date
$duration = $endTime - $startTime

# Calculate overall statistics
$totalTests = 0
$totalPassed = 0
$totalFailed = 0
$totalSkipped = 0

foreach ($result in $allResults) {
    if ($result.Summary) {
        $totalTests += $result.Summary.Total
        $totalPassed += $result.Summary.Passed
        $totalFailed += $result.Summary.Failed
        $totalSkipped += $result.Summary.Skipped
    }
}

$overallPassRate = if ($totalTests -gt 0) { [math]::Round(($totalPassed / $totalTests) * 100, 2) } else { 0 }

# Generate markdown report
$reportPath = "$resultsDir\TEST_RESULTS.md"
$markdownReport = @"
# White Cross Healthcare Platform - API Test Results

**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Base URL:** $BaseUrl
**Duration:** $([math]::Round($duration.TotalSeconds, 2)) seconds

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Tests** | $totalTests |
| **Passed** | $totalPassed |
| **Failed** | $totalFailed |
| **Skipped** | $totalSkipped |
| **Pass Rate** | $overallPassRate% |

$(if ($totalFailed -eq 0 -and $totalTests -gt 0) { "### :white_check_mark: ALL TESTS PASSED!" } elseif ($overallPassRate -ge 80) { "### :large_orange_diamond: Most tests passed, but some failures require attention" } else { "### :x: Multiple failures detected - immediate attention required" })

---

## Test Suite Results

"@

foreach ($result in $allResults) {
    $markdownReport += @"

### $($result.Suite)

"@

    if ($result.Summary) {
        $suitePassRate = if ($result.Summary.Total -gt 0) { [math]::Round(($result.Summary.Passed / $result.Summary.Total) * 100, 2) } else { 0 }
        $status = if ($result.Summary.Failed -eq 0 -and $result.Summary.Total -gt 0) { ":white_check_mark: PASS" } elseif ($result.Summary.Total -eq 0) { ":grey_question: NO TESTS" } else { ":x: FAIL" }

        $markdownReport += @"

| Metric | Value |
|--------|-------|
| **Status** | $status |
| **Total Tests** | $($result.Summary.Total) |
| **Passed** | $($result.Summary.Passed) |
| **Failed** | $($result.Summary.Failed) |
| **Skipped** | $($result.Summary.Skipped) |
| **Pass Rate** | $suitePassRate% |
| **Script** | ``$($result.Script)`` |
| **Results File** | ``results/$($result.Script -replace '\.ps1$', '-results.json')`` |

"@
    }
    elseif ($result.Skipped) {
        $markdownReport += ":warning: **SKIPPED** - Test script not found`n`n"
    }
    elseif ($result.Error) {
        $markdownReport += ":x: **ERROR** - $($result.Error)`n`n"
    }
}

$markdownReport += @"

---

## Detailed Test Results

For detailed results of each test, including request/response data, see the JSON files in the ``results/`` directory:

"@

foreach ($result in $allResults) {
    if ($result.Summary) {
        $jsonFile = $result.Script -replace '\.ps1$', '-results.json'
        $markdownReport += "- **$($result.Suite):** ``results/$jsonFile```n"
    }
}

$markdownReport += @"

---

## Test Coverage

The following API endpoint categories were tested:

1. **Authentication** (``/api/v1/auth``)
   - User registration and login
   - Token verification and refresh
   - Current user profile

2. **Students** (``/api/v1/students``)
   - CRUD operations
   - Student search and filtering
   - Health records access
   - Student transfer and deactivation

3. **Medications** (``/api/v1/medications``)
   - Medication formulary management
   - Prescription assignments
   - Administration logging
   - Inventory management
   - Adverse reaction reporting

4. **Health Records** (``/api/v1/health-records``)
   - General health records
   - Allergies
   - Chronic conditions
   - Vaccinations
   - Vital signs
   - Medical summaries

5. **Appointments** (``/api/v1/appointments``)
   - Appointment scheduling
   - Appointment management
   - Recurring appointments
   - Waitlist management
   - Available slots

6. **Audit & Compliance** (``/api/v1/audit``)
   - Audit log management
   - PHI access logging (HIPAA)
   - Security analysis
   - Compliance reporting
   - Anomaly detection

---

## Test Execution Details

- **Test Framework:** PowerShell with custom test utilities
- **Base URL:** $BaseUrl
- **Authentication:** $(if ($SkipAuth) { "Skipped" } else { "Performed" })
- **Test User:** $TestEmail
- **Start Time:** $($startTime.ToString("yyyy-MM-dd HH:mm:ss"))
- **End Time:** $($endTime.ToString("yyyy-MM-dd HH:mm:ss"))
- **Total Duration:** $([math]::Round($duration.TotalSeconds, 2)) seconds
- **Average Time per Test:** $([math]::Round($duration.TotalSeconds / [Math]::Max($totalTests, 1), 2)) seconds

---

## Recommendations

"@

if ($totalFailed -eq 0 -and $totalTests -gt 0) {
    $markdownReport += @"
:white_check_mark: **All tests passed!** The API is functioning correctly.

Continue with:
- Regular automated testing in CI/CD pipeline
- Load testing for performance validation
- Security penetration testing
"@
}
elseif ($totalFailed -gt 0) {
    $markdownReport += @"
:warning: **Action Required:** $totalFailed test(s) failed.

1. Review the detailed test results in the JSON files
2. Check server logs for error details
3. Verify database connectivity and schema
4. Ensure all required environment variables are set
5. Re-run failed tests individually for debugging

Common issues:
- Database not initialized or missing tables
- Missing test data (students, nurses, etc.)
- Incorrect permissions for test user role
- Server not running or wrong URL
"@
}

if ($totalSkipped -gt 0) {
    $markdownReport += @"

:grey_question: **Note:** $totalSkipped test(s) were skipped. This may be due to:
- Missing test data (e.g., no student ID to test with)
- Insufficient permissions for certain operations
- Tests that depend on previous test results
"@
}

$markdownReport += @"


---

## Next Steps

1. **Review Failed Tests:** Check individual test results in JSON files
2. **Update Test Data:** Ensure test database has necessary seed data
3. **Fix Issues:** Address any endpoint failures or validation errors
4. **Re-run Tests:** Execute ``run-all-tests.ps1`` again after fixes
5. **Automate:** Integrate into CI/CD pipeline for continuous testing

---

*Generated by White Cross API Testing Suite*
"@

# Save markdown report
$markdownReport | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "Comprehensive report generated: $reportPath" -ForegroundColor Green

# Generate JSON summary
$jsonSummary = @{
    GeneratedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    BaseUrl = $BaseUrl
    Duration = @{
        Seconds = [math]::Round($duration.TotalSeconds, 2)
        Minutes = [math]::Round($duration.TotalMinutes, 2)
    }
    Summary = @{
        TotalTests = $totalTests
        Passed = $totalPassed
        Failed = $totalFailed
        Skipped = $totalSkipped
        PassRate = $overallPassRate
    }
    TestSuites = $allResults
}

$jsonPath = "$resultsDir\test-summary.json"
$jsonSummary | ConvertTo-Json -Depth 10 | Out-File -FilePath $jsonPath -Encoding UTF8
Write-Host "JSON summary generated: $jsonPath" -ForegroundColor Green

# ============================================
# STEP 4: Display Final Summary
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Final Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $totalPassed" -ForegroundColor Green
Write-Host "Failed: $totalFailed" -ForegroundColor $(if ($totalFailed -eq 0) { "Green" } else { "Red" })
Write-Host "Skipped: $totalSkipped" -ForegroundColor Yellow
Write-Host "Pass Rate: $overallPassRate%" -ForegroundColor $(if ($overallPassRate -ge 80) { "Green" } elseif ($overallPassRate -ge 60) { "Yellow" } else { "Red" })
Write-Host "Duration: $([math]::Round($duration.TotalSeconds, 2)) seconds" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Reports generated in: $resultsDir" -ForegroundColor Green
Write-Host "  - TEST_RESULTS.md (comprehensive markdown report)" -ForegroundColor White
Write-Host "  - test-summary.json (JSON summary)" -ForegroundColor White
Write-Host "  - Individual test suite JSON files`n" -ForegroundColor White

# Exit with appropriate code
if ($totalFailed -eq 0 -and $totalTests -gt 0) {
    Write-Host "SUCCESS: All tests passed!" -ForegroundColor Green
    exit 0
}
elseif ($totalTests -eq 0) {
    Write-Host "WARNING: No tests were executed" -ForegroundColor Yellow
    exit 1
}
else {
    Write-Host "FAILURE: $totalFailed test(s) failed" -ForegroundColor Red
    exit 1
}
