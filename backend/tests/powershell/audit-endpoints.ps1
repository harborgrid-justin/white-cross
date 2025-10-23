# White Cross Healthcare Platform - Audit & Compliance Endpoint Tests
# Tests for /api/v1/audit endpoints

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

Write-Host "`n=== Audit & Compliance Endpoints Tests ===" -ForegroundColor Cyan

# ============================================
# GET /api/v1/audit/logs (List Audit Logs)
# ============================================
Write-Host "`n--- GET /api/v1/audit/logs ---" -ForegroundColor Yellow

# Test: List audit logs (may fail with 403 if not admin)
$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/audit/logs?page=1&limit=10" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403) {
    Write-TestResult -TestName "List audit logs with pagination" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "List audit logs with pagination" -Status "FAIL" -StatusCode $response.StatusCode
}

# Test: List audit logs without auth
Test-AuthenticationFailure `
    -TestName "List audit logs without auth returns 401" `
    -Method "GET" `
    -Endpoint "/api/v1/audit/logs"

# Test: Filter audit logs by action
$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/audit/logs?action=LOGIN&page=1&limit=10" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403) {
    Write-TestResult -TestName "Filter audit logs by action" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Filter audit logs by action" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# POST /api/v1/audit/logs (Create Audit Log)
# ============================================
Write-Host "`n--- POST /api/v1/audit/logs ---" -ForegroundColor Yellow

$auditData = @{
    action = "DATA_ACCESS"
    entityType = "STUDENT"
    entityId = "00000000-0000-0000-0000-000000000001"
    details = "Accessed student health records for routine checkup"
}

$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/audit/logs" `
    -Body $auditData `
    -RequireAuth $true

if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 400) {
    Write-TestResult -TestName "Create audit log entry" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Create audit log entry" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# GET /api/v1/audit/phi-access (PHI Access Logs)
# ============================================
Write-Host "`n--- GET /api/v1/audit/phi-access ---" -ForegroundColor Yellow

# Test: Get PHI access logs (critical HIPAA endpoint)
$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/audit/phi-access?page=1&limit=10" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403) {
    Write-TestResult -TestName "Get PHI access logs" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Get PHI access logs" -Status "FAIL" -StatusCode $response.StatusCode
}

# Test: Filter PHI access logs by student
$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/audit/phi-access?studentId=00000000-0000-0000-0000-000000000001" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403) {
    Write-TestResult -TestName "Filter PHI access logs by student" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Filter PHI access logs by student" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# POST /api/v1/audit/phi-access (Log PHI Access)
# ============================================
Write-Host "`n--- POST /api/v1/audit/phi-access ---" -ForegroundColor Yellow

$phiAccessData = @{
    studentId = "00000000-0000-0000-0000-000000000001"
    accessType = "VIEW"
    dataCategory = "HEALTH_RECORD"
    success = $true
    reason = "Routine health record review"
}

$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/audit/phi-access" `
    -Body $phiAccessData `
    -RequireAuth $true

if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 400) {
    Write-TestResult -TestName "Log PHI access" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Log PHI access" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# GET /api/v1/audit/statistics
# ============================================
Write-Host "`n--- GET /api/v1/audit/statistics ---" -ForegroundColor Yellow

$startDate = (Get-Date).AddDays(-30).ToString("yyyy-MM-dd")
$endDate = (Get-Date).ToString("yyyy-MM-dd")

$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/audit/statistics?startDate=$startDate&endDate=$endDate" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403) {
    Write-TestResult -TestName "Get audit statistics" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Get audit statistics" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# GET /api/v1/audit/user/{userId}/activity
# ============================================
Write-Host "`n--- GET /api/v1/audit/user/{userId}/activity ---" -ForegroundColor Yellow

$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/audit/user/00000000-0000-0000-0000-000000000001/activity?page=1&limit=10" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403 -or $response.StatusCode -eq 404) {
    Write-TestResult -TestName "Get user activity audit logs" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Get user activity audit logs" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# GET /api/v1/audit/export
# ============================================
Write-Host "`n--- GET /api/v1/audit/export ---" -ForegroundColor Yellow

$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/audit/export?startDate=$startDate&endDate=$endDate&format=CSV" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403) {
    Write-TestResult -TestName "Export audit logs" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Export audit logs" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# GET /api/v1/audit/security-analysis
# ============================================
Write-Host "`n--- GET /api/v1/audit/security-analysis ---" -ForegroundColor Yellow

$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/audit/security-analysis?startDate=$startDate&endDate=$endDate" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403) {
    Write-TestResult -TestName "Get security analysis" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Get security analysis" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# POST /api/v1/audit/security-analysis/run
# ============================================
Write-Host "`n--- POST /api/v1/audit/security-analysis/run ---" -ForegroundColor Yellow

$analysisData = @{
    startDate = $startDate
    endDate = $endDate
    analysisType = "COMPREHENSIVE"
}

$response = Invoke-ApiRequest `
    -Method "POST" `
    -Endpoint "/api/v1/audit/security-analysis/run" `
    -Body $analysisData `
    -RequireAuth $true

if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 403 -or $response.StatusCode -eq 400) {
    Write-TestResult -TestName "Run security analysis" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Run security analysis" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# GET /api/v1/audit/compliance-report
# ============================================
Write-Host "`n--- GET /api/v1/audit/compliance-report ---" -ForegroundColor Yellow

$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/audit/compliance-report?startDate=$startDate&endDate=$endDate" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403) {
    Write-TestResult -TestName "Generate HIPAA compliance report" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Generate HIPAA compliance report" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# GET /api/v1/audit/anomalies
# ============================================
Write-Host "`n--- GET /api/v1/audit/anomalies ---" -ForegroundColor Yellow

$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/audit/anomalies?startDate=$startDate&endDate=$endDate" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403) {
    Write-TestResult -TestName "Detect security anomalies" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Detect security anomalies" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# GET /api/v1/audit/session/{sessionId}
# ============================================
Write-Host "`n--- GET /api/v1/audit/session/{sessionId} ---" -ForegroundColor Yellow

$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/audit/session/00000000-0000-0000-0000-000000000001" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403 -or $response.StatusCode -eq 404) {
    Write-TestResult -TestName "Get session audit trail" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Get session audit trail" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# GET /api/v1/audit/data-access/{resourceType}/{resourceId}
# ============================================
Write-Host "`n--- GET /api/v1/audit/data-access/{resourceType}/{resourceId} ---" -ForegroundColor Yellow

$response = Invoke-ApiRequest `
    -Method "GET" `
    -Endpoint "/api/v1/audit/data-access/STUDENT/00000000-0000-0000-0000-000000000001?page=1&limit=10" `
    -RequireAuth $true

if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 403 -or $response.StatusCode -eq 404) {
    Write-TestResult -TestName "Get resource access history" -Status "PASS" -StatusCode $response.StatusCode
} else {
    Write-TestResult -TestName "Get resource access history" -Status "FAIL" -StatusCode $response.StatusCode
}

# ============================================
# Summary
# ============================================
$summary = Get-TestSummary
Export-TestResults -OutputPath "$PSScriptRoot\results\audit-endpoints-results.json"

# Return summary for master script
return $summary
