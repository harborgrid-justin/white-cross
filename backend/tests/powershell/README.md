# White Cross Healthcare Platform - PowerShell API Testing Suite

Comprehensive PowerShell-based testing framework for all White Cross API endpoints.

## Overview

This testing suite provides complete coverage of the White Cross Healthcare Platform API, testing all endpoints for:
- Successful responses (200, 201, 204)
- Authentication failures (401)
- Authorization failures (403)
- Validation errors (400)
- Not found errors (404)
- Server errors (500)

## Directory Structure

```
backend/tests/powershell/
├── README.md                          # This file
├── common-utils.ps1                   # Shared testing utilities and helpers
├── run-all-tests.ps1                  # Master test runner script
├── auth-endpoints.ps1                 # Authentication endpoint tests
├── students-endpoints.ps1             # Student management endpoint tests
├── medications-endpoints.ps1          # Medication endpoint tests
├── health-records-endpoints.ps1       # Health records endpoint tests
├── appointments-endpoints.ps1         # Appointments endpoint tests
├── audit-endpoints.ps1                # Audit & compliance endpoint tests
└── results/                           # Generated test results
    ├── TEST_RESULTS.md               # Comprehensive markdown report
    ├── test-summary.json             # JSON summary of all tests
    └── *-results.json                # Individual test suite results
```

## Prerequisites

1. **PowerShell**: Version 5.1 or higher (PowerShell Core 7+ recommended)
2. **Backend Server**: Running at the configured URL (default: http://localhost:3000)
3. **Database**: Initialized with schema and optionally seeded with test data
4. **Test User**: Either create manually or let the script register one

### Checking PowerShell Version

```powershell
$PSVersionTable.PSVersion
```

## Quick Start

### 1. Navigate to the test directory

```powershell
cd F:\temp\white-cross\backend\tests\powershell
```

### 2. Run all tests with default settings

```powershell
.\run-all-tests.ps1
```

### 3. View results

Results are automatically generated in the `results/` directory:
- **TEST_RESULTS.md** - Human-readable comprehensive report
- **test-summary.json** - Machine-readable summary
- Individual JSON files for each test suite

## Usage Examples

### Run all tests with custom URL

```powershell
.\run-all-tests.ps1 -BaseUrl "http://192.168.1.100:3000"
```

### Run all tests with custom credentials

```powershell
.\run-all-tests.ps1 -TestEmail "admin@example.com" -TestPassword "MyPassword123!"
```

### Run all tests and skip authentication setup

```powershell
.\run-all-tests.ps1 -SkipAuth
```

### Run a specific test suite

```powershell
# Authentication tests only
.\auth-endpoints.ps1

# Students tests only
.\students-endpoints.ps1

# Medications tests only
.\medications-endpoints.ps1

# Health records tests only
.\health-records-endpoints.ps1

# Appointments tests only
.\appointments-endpoints.ps1

# Audit & compliance tests only
.\audit-endpoints.ps1
```

### Run specific test with custom URL and auth token

```powershell
$token = "your-jwt-token-here"
.\students-endpoints.ps1 -BaseUrl "http://localhost:3000" -AuthToken $token
```

## Test Suite Details

### 1. Authentication Tests (`auth-endpoints.ps1`)

Tests for `/api/v1/auth` endpoints:

- **POST /api/v1/auth/register** - User registration
  - Successful registration (201)
  - Missing required fields (400)
  - Invalid email format (400)
  - Weak password (400)
  - Duplicate user (409)

- **POST /api/v1/auth/login** - User login
  - Valid credentials (200)
  - Invalid credentials (401)
  - Non-existent user (401)
  - Missing fields (400)

- **POST /api/v1/auth/verify** - Token verification
  - Valid token (200)
  - Invalid token (401)
  - Missing token (401)

- **POST /api/v1/auth/refresh** - Token refresh
  - Valid token (200)
  - Invalid token (401)
  - Missing token (401)

- **GET /api/v1/auth/me** - Current user
  - With valid token (200)
  - Without token (401)
  - With invalid token (401)

### 2. Students Tests (`students-endpoints.ps1`)

Tests for `/api/v1/students` endpoints:

- Student CRUD operations
- Listing with pagination and filters
- Search functionality
- Grade-based filtering
- Assigned students for nurses
- Health records access
- Mental health records access
- Student transfer
- Student deactivation

### 3. Medications Tests (`medications-endpoints.ps1`)

Tests for `/api/v1/medications` endpoints:

- Medication formulary management
- Prescription assignments to students
- Administration logging
- Inventory management
- Medication schedule and reminders
- Adverse reaction reporting
- Statistics and alerts
- Form options

### 4. Health Records Tests (`health-records-endpoints.ps1`)

Tests for `/api/v1/health-records` endpoints:

- General health records CRUD
- Allergies management
- Chronic conditions tracking
- Vaccination/immunization records
- Vital signs recording
- Medical summaries
- Immunization compliance checking

### 5. Appointments Tests (`appointments-endpoints.ps1`)

Tests for `/api/v1/appointments` endpoints:

- Appointment CRUD operations
- Appointment status transitions (start, complete, cancel, no-show)
- Available time slots
- Upcoming appointments
- Statistics and analytics
- Recurring appointments
- Waitlist management
- Calendar exports

### 6. Audit & Compliance Tests (`audit-endpoints.ps1`)

Tests for `/api/v1/audit` endpoints:

- Audit log management
- PHI access logging (HIPAA compliance)
- User activity tracking
- Security analysis
- Compliance reporting
- Anomaly detection
- Session audit trails
- Data access history

## Understanding Test Results

### Console Output

Tests display real-time results with color coding:
- **[PASS]** in green - Test passed
- **[FAIL]** in red - Test failed
- **[SKIP]** in yellow - Test skipped

Each test shows:
- Test name
- HTTP status code
- Optional details

### TEST_RESULTS.md

Comprehensive markdown report including:
- Executive summary with overall pass/fail statistics
- Pass rate percentage
- Results for each test suite
- Test coverage overview
- Detailed recommendations
- Next steps

### JSON Files

- **test-summary.json** - Overall summary with all test suite results
- **auth-endpoints-results.json** - Authentication test details
- **students-endpoints-results.json** - Students test details
- **medications-endpoints-results.json** - Medications test details
- **health-records-endpoints-results.json** - Health records test details
- **appointments-endpoints-results.json** - Appointments test details
- **audit-endpoints-results.json** - Audit test details

## Common Issues and Solutions

### Issue: "Connection refused" or "Cannot connect to server"

**Solution:**
- Ensure the backend server is running: `npm start` or `node server.js`
- Verify the correct URL with `-BaseUrl` parameter
- Check firewall settings

### Issue: "Authentication failed" / 401 errors

**Solution:**
- Verify test user credentials
- Ensure user registration is enabled
- Check JWT configuration in backend
- Manually create a test user in the database

### Issue: "404 Not Found" on all endpoints

**Solution:**
- Check that the backend server is running the correct version
- Verify API routes are properly registered
- Check server logs for routing errors

### Issue: Many tests show 404 for student/resource IDs

**Solution:**
- Seed the database with test data
- Tests create some test data, but may need existing records
- Some tests are designed to test with non-existent IDs (this is expected)

### Issue: "403 Forbidden" on admin-only endpoints

**Solution:**
- Ensure test user has appropriate role (ADMIN or NURSE)
- Check role-based access control configuration
- Some 403 responses are expected for authorization testing

### Issue: Tests pass but database shows no changes

**Solution:**
- Some tests use fake IDs and are expected to fail
- Check which tests actually create data vs. validation tests
- Review individual test JSON results for actual vs. expected behavior

## Interpreting Pass Rates

- **100%** - Perfect! All endpoints functioning correctly
- **80-99%** - Good, but investigate failures
- **60-79%** - Acceptable for development, needs attention
- **Below 60%** - Serious issues, requires immediate investigation

## Test Data Recommendations

For best results, seed your test database with:

1. **Users:**
   - Admin user
   - Multiple nurse users
   - Various role combinations

2. **Students:**
   - At least 10 students
   - Different grades (K-12)
   - Some with health records
   - Some with medications

3. **Medications:**
   - Common medications (Tylenol, Ibuprofen, etc.)
   - Various dosage forms
   - Some with inventory

4. **Health Records:**
   - Various record types
   - Allergies for some students
   - Chronic conditions
   - Vaccination records

## Extending the Test Suite

### Adding a New Test

1. Create a new test script or add to existing suite
2. Import common utilities: `. "$PSScriptRoot\common-utils.ps1"`
3. Use helper functions:
   - `Test-SuccessResponse` for 200/201 tests
   - `Test-AuthenticationFailure` for 401 tests
   - `Test-ValidationError` for 400 tests
   - `Test-NotFoundError` for 404 tests
   - `Test-AuthorizationFailure` for 403 tests

Example:
```powershell
Test-SuccessResponse `
    -TestName "Get all users" `
    -Method "GET" `
    -Endpoint "/api/v1/users" `
    -RequireAuth $true `
    -ExpectedStatusCode 200
```

### Adding a New Test Suite

1. Create new file: `your-module-endpoints.ps1`
2. Follow the pattern from existing test suites
3. Add to `run-all-tests.ps1` in the `$testSuites` array
4. Document in this README

## CI/CD Integration

### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2
      - name: Start backend server
        run: npm start &
        working-directory: ./backend
      - name: Run API tests
        run: .\run-all-tests.ps1 -BaseUrl "http://localhost:3000"
        working-directory: ./backend/tests/powershell
      - name: Upload test results
        uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: backend/tests/powershell/results/
```

### Jenkins Pipeline Example

```groovy
stage('API Tests') {
    steps {
        powershell '''
            cd backend/tests/powershell
            .\\run-all-tests.ps1 -BaseUrl "http://localhost:3000"
        '''
    }
    post {
        always {
            archiveArtifacts artifacts: 'backend/tests/powershell/results/**'
        }
    }
}
```

## Best Practices

1. **Run tests regularly** - After every significant change
2. **Review failed tests immediately** - Don't let failures accumulate
3. **Keep test data fresh** - Regularly refresh test database
4. **Document changes** - Update this README when adding tests
5. **Version control** - Commit test results for comparison
6. **Automate** - Integrate into CI/CD pipeline

## Troubleshooting

### Enable Verbose Output

Set PowerShell verbose preference:
```powershell
$VerbosePreference = "Continue"
.\run-all-tests.ps1
```

### Check Individual Requests

Review JSON result files for detailed request/response data.

### Test Single Endpoint

Use `Invoke-ApiRequest` directly:
```powershell
. .\common-utils.ps1
Initialize-TestSession -BaseUrl "http://localhost:3000"
$response = Invoke-ApiRequest -Method "GET" -Endpoint "/api/v1/students" -RequireAuth $false
$response
```

## Support

For issues or questions:
1. Check this README
2. Review test result JSON files
3. Check backend server logs
4. Consult API documentation
5. Contact development team

## License

Copyright (c) 2024 White Cross Healthcare Platform. All rights reserved.

---

*Last updated: 2024-10-23*
