# White Cross Healthcare Platform - Test Execution Guide

## Complete Testing Workflow

This guide provides step-by-step instructions for executing the comprehensive API endpoint tests for the White Cross Healthcare Platform.

---

## Prerequisites Checklist

Before running tests, ensure the following are in place:

### 1. Backend Server Setup

- [ ] Node.js installed (v14+ recommended)
- [ ] All npm dependencies installed: `npm install`
- [ ] Database configured and running (PostgreSQL)
- [ ] Database schema initialized
- [ ] Environment variables configured (`.env` file)

### 2. Database Preparation

- [ ] Database server running
- [ ] Database created
- [ ] All migrations applied
- [ ] (Optional) Seed data loaded for comprehensive testing

### 3. PowerShell Environment

- [ ] PowerShell 5.1 or higher (check with `$PSVersionTable.PSVersion`)
- [ ] Execution policy allows script execution: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

### 4. Test Configuration

- [ ] Backend URL known (default: `http://localhost:3000`)
- [ ] Test user credentials available OR registration enabled
- [ ] Firewall allows local connections

---

## Step-by-Step Execution

### Step 1: Start the Backend Server

Navigate to the backend directory and start the server:

```bash
cd F:\temp\white-cross\backend
npm start
```

**Verify server is running:**
```bash
curl http://localhost:3000/api/v1/health
# Should return server health status
```

Or in PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/health"
```

### Step 2: Navigate to Test Directory

```powershell
cd F:\temp\white-cross\backend\tests\powershell
```

### Step 3: Review Test Configuration

**Check the default parameters in `run-all-tests.ps1`:**
- Base URL: `http://localhost:3000`
- Test Email: `test.admin@whitecross.test`
- Test Password: `Admin123!`

**If you need different values, use command-line parameters (see examples below).**

### Step 4: Run the Complete Test Suite

**Basic execution (uses defaults):**
```powershell
.\run-all-tests.ps1
```

**With custom URL:**
```powershell
.\run-all-tests.ps1 -BaseUrl "http://192.168.1.100:3000"
```

**With custom credentials:**
```powershell
.\run-all-tests.ps1 -TestEmail "your.email@example.com" -TestPassword "YourPassword123!"
```

**Skip authentication setup (if you already have a token):**
```powershell
.\run-all-tests.ps1 -SkipAuth
```

### Step 5: Monitor Test Execution

The script will:
1. Display a header with configuration details
2. Attempt to register/login with test credentials
3. Run each test suite in sequence:
   - Authentication endpoints
   - Students endpoints
   - Medications endpoints
   - Health Records endpoints
   - Appointments endpoints
   - Audit & Compliance endpoints
4. Display real-time pass/fail results for each test
5. Generate comprehensive reports

**Watch for:**
- Green `[PASS]` - Tests passing successfully
- Red `[FAIL]` - Tests failing (needs investigation)
- Yellow `[SKIP]` - Tests skipped (usually due to missing prerequisites)

### Step 6: Review Results

After execution completes, review the generated reports:

**1. Console Summary:**
Shows immediate pass/fail statistics for each suite and overall.

**2. TEST_RESULTS.md:**
```powershell
# Open in your preferred markdown viewer
notepad results\TEST_RESULTS.md
# Or use a markdown viewer
```

**3. JSON Summary:**
```powershell
# View JSON summary
Get-Content results\test-summary.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**4. Individual Test Suite Results:**
```powershell
# View specific test suite results
Get-Content results\auth-endpoints-results.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
Get-Content results\students-endpoints-results.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
# etc.
```

---

## Running Individual Test Suites

For focused testing or debugging, run individual test suites:

### Authentication Tests Only

```powershell
.\auth-endpoints.ps1 -BaseUrl "http://localhost:3000"
```

### Students Tests Only

```powershell
# First, login to get a token
. .\common-utils.ps1
Initialize-TestSession -BaseUrl "http://localhost:3000"
Login-AsUser -Email "your.email@example.com" -Password "YourPassword123!"

# Then run the tests
.\students-endpoints.ps1 -BaseUrl "http://localhost:3000" -AuthToken $script:AuthToken
```

### Medications Tests Only

```powershell
.\medications-endpoints.ps1 -BaseUrl "http://localhost:3000" -AuthToken $script:AuthToken
```

### Health Records Tests Only

```powershell
.\health-records-endpoints.ps1 -BaseUrl "http://localhost:3000" -AuthToken $script:AuthToken
```

### Appointments Tests Only

```powershell
.\appointments-endpoints.ps1 -BaseUrl "http://localhost:3000" -AuthToken $script:AuthToken
```

### Audit & Compliance Tests Only

```powershell
.\audit-endpoints.ps1 -BaseUrl "http://localhost:3000" -AuthToken $script:AuthToken
```

---

## Understanding Test Results

### Pass Rates

| Pass Rate | Interpretation | Action Required |
|-----------|----------------|-----------------|
| 100% | Excellent - All tests passed | Continue regular testing |
| 80-99% | Good - Minor issues | Investigate failures |
| 60-79% | Acceptable - Some issues | Address failures soon |
| Below 60% | Critical - Major issues | Immediate action required |

### Common Test Outcomes

**Test Passes (Expected):**
- `[PASS] (200)` - Successful GET request
- `[PASS] (201)` - Successful resource creation
- `[PASS] (401)` - Properly blocked unauthorized access
- `[PASS] (400)` - Validation errors caught correctly
- `[PASS] (404)` - Non-existent resources properly handled

**Test Failures (Investigate):**
- `[FAIL] (500)` - Server error (check server logs)
- `[FAIL] (000)` - Connection refused (server not running)
- `[FAIL] (200)` when expecting 401/403 - Security issue
- `[FAIL] (400)` when expecting 200 - Validation too strict or bad test data

**Test Skips (Normal in some cases):**
- `[SKIP]` - Test couldn't run due to missing prerequisites (e.g., no student ID from creation)

---

## Troubleshooting Guide

### Issue: "Execution policy" error

**Error:**
```
.\run-all-tests.ps1 : File ... cannot be loaded because running scripts is disabled on this system.
```

**Solution:**
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Server not responding / Connection refused

**Symptoms:**
- All tests show `[FAIL] (000)`
- Error message about connection refused

**Solutions:**
1. Verify server is running: `curl http://localhost:3000/api/v1/health`
2. Check server logs for errors
3. Verify port 3000 is not blocked by firewall
4. Try with explicit URL: `.\run-all-tests.ps1 -BaseUrl "http://127.0.0.1:3000"`

### Issue: Authentication failures

**Symptoms:**
- Login test fails
- All subsequent tests show 401

**Solutions:**
1. Check if user registration is enabled in backend
2. Manually create test user in database
3. Use existing credentials: `.\run-all-tests.ps1 -TestEmail "existing@user.com" -TestPassword "Pass123!"`
4. Check JWT configuration in backend

### Issue: Many 404 errors

**Symptoms:**
- Tests for GET/PUT/DELETE specific resources return 404
- "Student not found" or "Medication not found" errors

**Solutions:**
1. This is partially expected - tests use fake UUIDs
2. For comprehensive testing, seed database with test data
3. Some tests create resources, but others test with non-existent IDs (this is intentional)

### Issue: Many 403 Forbidden errors

**Symptoms:**
- Admin-only endpoints return 403
- "Forbidden - Admin only" errors

**Solutions:**
1. Ensure test user has correct role (ADMIN or NURSE)
2. Check role-based access control configuration
3. Some 403 responses are expected for authorization testing
4. Create test user with admin role manually if needed

### Issue: Database errors

**Symptoms:**
- 500 errors with database messages
- Connection pool errors
- Schema errors

**Solutions:**
1. Verify database is running
2. Check database connection string in `.env`
3. Run migrations: `npm run migrate`
4. Check database logs

### Issue: Slow test execution

**Causes:**
- Large number of tests
- Network latency
- Slow database

**Solutions:**
1. Run individual test suites instead of all
2. Optimize database queries
3. Ensure database is local (not remote)
4. Check server performance

---

## Test Data Recommendations

For optimal test coverage, seed your database with:

### Users
```sql
-- Admin user
INSERT INTO users (email, password, first_name, last_name, role)
VALUES ('admin@whitecross.test', '<hashed>', 'Admin', 'User', 'ADMIN');

-- Nurse users
INSERT INTO users (email, password, first_name, last_name, role)
VALUES ('nurse1@whitecross.test', '<hashed>', 'Nurse', 'One', 'NURSE');
```

### Students (at least 5-10 for testing)
```sql
INSERT INTO students (first_name, last_name, date_of_birth, grade, ...)
VALUES ('John', 'Doe', '2010-05-15', '8', ...);
```

### Medications (common medications)
```sql
INSERT INTO medications (name, generic_name, dosage_form, strength, ...)
VALUES ('Ibuprofen', 'Ibuprofen', 'Tablet', '200', ...);
```

### Health Records, Allergies, Conditions, etc.

Add sample data for each category to test CRUD operations comprehensively.

---

## Interpreting the Comprehensive Report

### TEST_RESULTS.md Structure

1. **Executive Summary** - Overall statistics and pass rate
2. **Test Suite Results** - Per-suite breakdown
3. **Detailed Test Results** - Links to JSON files
4. **Test Coverage** - What was tested
5. **Test Execution Details** - Timing and configuration
6. **Recommendations** - Next steps based on results

### JSON Result Files

Each test suite generates a JSON file with detailed results:

```json
{
  "TestName": "Get all students",
  "Status": "PASS",
  "StatusCode": 200,
  "Details": "",
  "Timestamp": "2024-10-23 15:30:45"
}
```

**Key fields:**
- `TestName` - Human-readable test description
- `Status` - PASS, FAIL, or SKIP
- `StatusCode` - HTTP status code received
- `Details` - Additional information (usually for failures)
- `Timestamp` - When the test ran

---

## Next Steps After Testing

### All Tests Pass (100%)

1. ✅ **Celebrate!** Your API is working correctly
2. 📋 Schedule regular test runs (daily/weekly)
3. 🔄 Integrate into CI/CD pipeline
4. 🧪 Consider adding more edge case tests
5. 📊 Run load/performance tests

### Some Tests Fail (80-99%)

1. 📖 Review TEST_RESULTS.md for failed tests
2. 🔍 Check individual JSON files for error details
3. 📋 Create issues/tickets for each failure
4. 🔧 Fix issues one by one
5. ✅ Re-run tests after fixes

### Many Tests Fail (<80%)

1. 🚨 **Priority:** Address immediately
2. 🗄️ Check database connectivity and schema
3. ⚙️ Verify environment variables
4. 📝 Review server logs for errors
5. 🔍 Debug individual endpoints
6. 👥 Consult with development team

---

## CI/CD Integration

### Automated Testing in Pipeline

Add to your CI/CD pipeline to run tests automatically on every commit:

**GitHub Actions Example:**
```yaml
- name: Run API Tests
  run: |
    cd backend/tests/powershell
    pwsh -File run-all-tests.ps1
```

**Azure DevOps Example:**
```yaml
- task: PowerShell@2
  inputs:
    filePath: 'backend/tests/powershell/run-all-tests.ps1'
    arguments: '-BaseUrl "http://localhost:3000"'
```

**Jenkins Example:**
```groovy
stage('API Tests') {
    steps {
        powershell './backend/tests/powershell/run-all-tests.ps1'
    }
}
```

---

## Best Practices

1. **Run Before Commits** - Test locally before pushing
2. **Run in CI/CD** - Automated testing on every commit
3. **Review Results** - Don't ignore failures
4. **Keep Data Fresh** - Regularly refresh test database
5. **Update Tests** - When API changes, update tests
6. **Document Changes** - Update README when adding tests
7. **Version Results** - Commit test results for comparison

---

## Support and Resources

### Documentation
- [README.md](README.md) - Main documentation
- [TEST_RESULTS.md](results/TEST_RESULTS.md) - Latest test results
- API documentation (Swagger) - `http://localhost:3000/documentation`

### Common Commands Reference

```powershell
# Check PowerShell version
$PSVersionTable.PSVersion

# Set execution policy
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run all tests
.\run-all-tests.ps1

# Run with custom URL
.\run-all-tests.ps1 -BaseUrl "http://localhost:3000"

# Run specific test suite
.\auth-endpoints.ps1

# View results
Get-Content results\TEST_RESULTS.md
Get-Content results\test-summary.json | ConvertFrom-Json

# Test server connectivity
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/health"
```

---

## Conclusion

This comprehensive testing suite ensures all White Cross Healthcare Platform API endpoints function correctly across:

- ✅ Authentication and authorization
- ✅ Student management
- ✅ Medication administration
- ✅ Health records
- ✅ Appointment scheduling
- ✅ Audit and compliance (HIPAA)

Regular execution of these tests helps maintain API reliability, catch regressions early, and ensure HIPAA compliance requirements are met.

---

*For questions or issues, contact the development team or consult the project documentation.*

*Last Updated: 2024-10-23*
