# Test Results Directory

This directory contains generated test results when you run the White Cross API testing suite.

## Generated Files

When you execute `run-all-tests.ps1`, the following files will be created here:

### Main Reports

- **TEST_RESULTS.md** - Comprehensive markdown report with:
  - Executive summary
  - Test suite breakdown
  - Pass/fail statistics
  - Recommendations

- **test-summary.json** - JSON summary containing:
  - Overall statistics
  - Duration
  - Test suite results
  - Timestamp

### Individual Test Suite Results

Each test suite generates a detailed JSON file:

- **auth-endpoints-results.json** - Authentication test results
- **students-endpoints-results.json** - Student management test results
- **medications-endpoints-results.json** - Medication test results
- **health-records-endpoints-results.json** - Health records test results
- **appointments-endpoints-results.json** - Appointments test results
- **audit-endpoints-results.json** - Audit & compliance test results

## File Structure

### test-summary.json Format

```json
{
  "GeneratedAt": "2024-10-23 15:30:00",
  "BaseUrl": "http://localhost:3000",
  "Duration": {
    "Seconds": 45.32,
    "Minutes": 0.76
  },
  "Summary": {
    "TotalTests": 180,
    "Passed": 165,
    "Failed": 5,
    "Skipped": 10,
    "PassRate": 91.67
  },
  "TestSuites": [...]
}
```

### Individual Test Result Format

```json
{
  "TestName": "Login with valid credentials",
  "Status": "PASS",
  "StatusCode": 200,
  "Details": "",
  "Timestamp": "2024-10-23 15:30:15"
}
```

## Viewing Results

### Command Line

```powershell
# View summary
Get-Content test-summary.json | ConvertFrom-Json | ConvertTo-Json -Depth 10

# View specific test suite
Get-Content auth-endpoints-results.json | ConvertFrom-Json

# View markdown report
notepad TEST_RESULTS.md
```

### In Browser

Many markdown viewers can open TEST_RESULTS.md directly, or you can use VS Code, GitHub Desktop, or other markdown-compatible tools.

## Retention

These files are generated each time tests run and will be overwritten. To preserve results:

1. Copy files to a backup location
2. Commit to version control
3. Archive with timestamp in filename

Example archiving:
```powershell
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item TEST_RESULTS.md "TEST_RESULTS_$timestamp.md"
```

## Notes

- Files are created only when tests are executed
- This directory should be in .gitignore to avoid committing test results
- Results contain sensitive endpoint information - handle appropriately
