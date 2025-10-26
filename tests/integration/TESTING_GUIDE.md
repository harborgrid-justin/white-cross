# Integration Testing Guide - White Cross Platform

Comprehensive guide for running and maintaining integration tests for the White Cross healthcare platform.

## 📋 Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Writing New Tests](#writing-new-tests)
- [Test Patterns](#test-patterns)
- [HIPAA Compliance Testing](#hipaa-compliance-testing)
- [Performance Testing](#performance-testing)
- [Troubleshooting](#troubleshooting)
- [CI/CD Integration](#cicd-integration)

## Overview

The integration test suite ensures comprehensive coverage of all White Cross platform features with zero regressions and 100% feature parity. Tests are organized into five main categories:

1. **Module Tests** - Individual feature testing (students, medications, appointments, etc.)
2. **Workflow Tests** - End-to-end user workflows
3. **Authentication Tests** - Login, RBAC, session management
4. **HIPAA Compliance Tests** - Audit logging, PHI access, encryption
5. **Performance Tests** - API response times, page load metrics

### Coverage Targets

- **Backend**: 95% lines/functions, 90% branches
- **Frontend**: 95% lines/functions, 90% branches
- **Integration**: 100% critical user paths
- **E2E**: All major workflows

## Test Structure

```
tests/integration/
├── modules/                    # Module integration tests (10 suites)
│   ├── students.integration.test.ts
│   ├── medications.integration.test.ts
│   ├── appointments.integration.test.ts
│   ├── health-records.integration.test.ts
│   ├── incidents.integration.test.ts
│   ├── inventory.integration.test.ts
│   ├── communications.integration.test.ts
│   ├── compliance.integration.test.ts
│   ├── analytics.integration.test.ts
│   └── admin.integration.test.ts
├── workflows/                  # Workflow tests (4 suites)
│   ├── medication-administration.test.ts
│   ├── appointment-scheduling.test.ts
│   ├── incident-reporting.test.ts
│   └── student-health-tracking.test.ts
├── auth/                       # Authentication tests (3 suites)
│   ├── login.test.ts
│   ├── rbac.test.ts
│   └── session.test.ts
├── hipaa/                      # HIPAA compliance tests (3 suites)
│   ├── audit-logging.test.ts
│   ├── phi-access.test.ts
│   └── data-encryption.test.ts
├── performance/                # Performance tests (2 suites)
│   ├── api-response.test.ts
│   └── page-load.test.ts
├── helpers/                    # Test utilities
│   ├── test-client.ts         # Authenticated API client
│   └── test-data.ts           # Test fixtures
├── README.md                   # Integration tests overview
└── TESTING_GUIDE.md           # This guide
```

## Running Tests

### Prerequisites

1. **Install Dependencies**
```bash
npm install
npx playwright install
```

2. **Start Backend Server**
```bash
npm run dev:backend
```

3. **Set Environment Variables**
```bash
export API_BASE_URL=http://localhost:3001
export CI=false  # Set to true in CI environment
```

### Run All Integration Tests

```bash
# From project root
npm run test:integration

# Or using Playwright directly
npx playwright test --config=playwright.config.integration.ts
```

### Run Specific Test Suites

#### Module Tests
```bash
# All module tests
npm run test:integration:modules

# Specific module
npx playwright test --config=playwright.config.integration.ts --project=students-module
npx playwright test --config=playwright.config.integration.ts --project=medications-module
npx playwright test --config=playwright.config.integration.ts --project=appointments-module
npx playwright test --config=playwright.config.integration.ts --project=health-records-module
npx playwright test --config=playwright.config.integration.ts --project=incidents-module
npx playwright test --config=playwright.config.integration.ts --project=inventory-module
npx playwright test --config=playwright.config.integration.ts --project=communications-module
npx playwright test --config=playwright.config.integration.ts --project=compliance-module
npx playwright test --config=playwright.config.integration.ts --project=analytics-module
npx playwright test --config=playwright.config.integration.ts --project=admin-module
```

#### Workflow Tests
```bash
# All workflow tests
npm run test:integration:workflows

# Specific workflow
npx playwright test --config=playwright.config.integration.ts --project=medication-workflow
npx playwright test --config=playwright.config.integration.ts --project=appointment-workflow
npx playwright test --config=playwright.config.integration.ts --project=incident-workflow
npx playwright test --config=playwright.config.integration.ts --project=student-health-workflow
```

#### Authentication Tests
```bash
# All auth tests
npm run test:integration:auth

# Specific auth test
npx playwright test --config=playwright.config.integration.ts --project=auth-login
npx playwright test --config=playwright.config.integration.ts --project=auth-rbac
npx playwright test --config=playwright.config.integration.ts --project=auth-session
```

#### HIPAA Compliance Tests
```bash
# All HIPAA tests
npm run test:integration:hipaa

# Specific HIPAA test
npx playwright test --config=playwright.config.integration.ts --project=hipaa-audit-logging
npx playwright test --config=playwright.config.integration.ts --project=hipaa-phi-access
npx playwright test --config=playwright.config.integration.ts --project=hipaa-data-encryption
```

#### Performance Tests
```bash
# All performance tests
npm run test:integration:performance

# Specific performance test
npx playwright test --config=playwright.config.integration.ts --project=performance-api
npx playwright test --config=playwright.config.integration.ts --project=performance-page-load
```

### Interactive Test Modes

#### UI Mode
```bash
npm run test:integration:ui
```

#### Debug Mode
```bash
npm run test:integration:debug
```

#### Specific Test Debug
```bash
npx playwright test --config=playwright.config.integration.ts --debug -g "test name"
```

### View Test Reports

```bash
# HTML report
npm run test:integration:report
npx playwright show-report playwright-report/integration

# JSON report
cat playwright-report/integration-results.json

# JUnit report (for CI)
cat playwright-report/integration-junit.xml
```

## Writing New Tests

### Test Structure

```typescript
import { test, expect } from '../helpers/test-client';
import { createTestStudent } from '../helpers/test-client';

test.describe('Feature Name', () => {
  test.describe('Specific Functionality', () => {
    test('should do something specific', async ({ authenticatedContext }) => {
      // Arrange
      const testData = { /* ... */ };
      const student = await createTestStudent(authenticatedContext);

      // Act
      const response = await authenticatedContext.post('/api/v1/endpoint', {
        data: testData,
      });

      // Assert
      expect(response.ok()).toBeTruthy();
      const result = await response.json();
      expect(result.property).toBe(expectedValue);
    });
  });
});
```

### Using Test Contexts

```typescript
// Authenticated context (default nurse user)
test('test with auth', async ({ authenticatedContext }) => {
  const response = await authenticatedContext.get('/api/v1/students');
  expect(response.ok()).toBeTruthy();
});

// Admin context
test('admin test', async ({ adminContext }) => {
  const response = await adminContext.get('/api/v1/admin/settings');
  expect(response.ok()).toBeTruthy();
});

// Nurse context
test('nurse test', async ({ nurseContext }) => {
  const response = await nurseContext.get('/api/v1/students');
  expect(response.ok()).toBeTruthy();
});

// No auth context
test('public endpoint', async ({ apiContext }) => {
  const response = await apiContext.get('/health');
  expect(response.ok()).toBeTruthy();
});
```

### Using Helper Functions

```typescript
import {
  createTestStudent,
  createTestMedication,
  createTestAppointment,
  createTestHealthRecord,
  createTestIncident,
  verifyAuditLog,
  cleanupTestStudent,
} from '../helpers/test-client';

test('workflow test', async ({ authenticatedContext }) => {
  // Create test data
  const student = await createTestStudent(authenticatedContext);
  const medication = await createTestMedication(authenticatedContext, student.id);

  // Perform actions
  const response = await authenticatedContext.post('/api/v1/medication-administrations', {
    data: { /* ... */ },
  });

  // Verify audit log
  await verifyAuditLog(authenticatedContext, 'medication', medication.id, 'administered');

  // Cleanup (optional)
  await cleanupTestStudent(authenticatedContext, student.id);
});
```

### Using Test Data Fixtures

```typescript
import {
  TEST_STUDENTS,
  TEST_MEDICATIONS,
  TEST_APPOINTMENTS,
  TEST_HEALTH_RECORDS,
  TEST_INCIDENTS,
  generateStudentId,
  generateTestEmail,
  getFutureDate,
  getPastDate,
  getScheduledDateTime,
} from '../helpers/test-data';

test('test with fixtures', async ({ authenticatedContext }) => {
  const studentData = {
    ...TEST_STUDENTS.valid,
    schoolId: generateStudentId(),
  };

  const response = await authenticatedContext.post('/api/v1/students', {
    data: studentData,
  });

  expect(response.ok()).toBeTruthy();
});
```

## Test Patterns

### 1. CRUD Operations Pattern

```typescript
test.describe('Entity CRUD Operations', () => {
  test('should create entity', async ({ authenticatedContext }) => {
    // Create
  });

  test('should retrieve entity by ID', async ({ authenticatedContext }) => {
    // Read
  });

  test('should update entity', async ({ authenticatedContext }) => {
    // Update
  });

  test('should delete entity', async ({ authenticatedContext }) => {
    // Delete
  });

  test('should list entities with pagination', async ({ authenticatedContext }) => {
    // List
  });
});
```

### 2. Workflow Pattern

```typescript
test('should complete full workflow', async ({ authenticatedContext }) => {
  // 1. Setup
  const student = await createTestStudent(authenticatedContext);

  // 2. Step 1
  const step1Response = await authenticatedContext.post('/api/v1/step1', {
    data: { /* ... */ },
  });
  expect(step1Response.ok()).toBeTruthy();

  // 3. Step 2
  const step2Response = await authenticatedContext.post('/api/v1/step2', {
    data: { /* ... */ },
  });
  expect(step2Response.ok()).toBeTruthy();

  // 4. Verify final state
  const finalState = await authenticatedContext.get('/api/v1/verify');
  expect(finalState.ok()).toBeTruthy();
});
```

### 3. Error Handling Pattern

```typescript
test.describe('Validation and Error Handling', () => {
  test('should reject missing required fields', async ({ authenticatedContext }) => {
    const invalidData = { /* missing fields */ };
    const response = await authenticatedContext.post('/api/v1/endpoint', {
      data: invalidData,
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
  });

  test('should return 404 for non-existent resource', async ({ authenticatedContext }) => {
    const response = await authenticatedContext.get(
      '/api/v1/resource/00000000-0000-0000-0000-000000000000'
    );

    expect(response.status()).toBe(404);
  });
});
```

### 4. Audit Logging Pattern

```typescript
test('should create audit log for action', async ({ authenticatedContext }) => {
  // Perform action
  const student = await createTestStudent(authenticatedContext);

  // Verify audit log
  const auditLog = await verifyAuditLog(
    authenticatedContext,
    'student',
    student.id,
    'create'
  );

  expect(auditLog.userId).toBeDefined();
  expect(auditLog.timestamp).toBeDefined();
  expect(auditLog.ipAddress).toBeDefined();
});
```

## HIPAA Compliance Testing

### PHI Access Logging

All PHI access must be logged:

```typescript
test('should log PHI access', async ({ authenticatedContext }) => {
  const student = await createTestStudent(authenticatedContext);

  // Access PHI
  await authenticatedContext.get(`/api/v1/students/${student.id}`);

  // Verify audit log
  const auditLog = await verifyAuditLog(
    authenticatedContext,
    'student',
    student.id,
    'view'
  );

  expect(auditLog).toBeDefined();
  expect(auditLog.action).toBe('view');
  expect(auditLog.entityType).toBe('student');
});
```

### Data Encryption

Verify data is encrypted:

```typescript
test('should encrypt sensitive data', async ({ authenticatedContext }) => {
  const student = await createTestStudent(authenticatedContext);

  // Add sensitive data
  const response = await authenticatedContext.put(`/api/v1/students/${student.id}`, {
    data: {
      ssn: '123-45-6789',
    },
  });

  expect(response.ok()).toBeTruthy();

  // SSN should not be returned or should be masked
  const retrieved = await authenticatedContext.get(`/api/v1/students/${student.id}`);
  const data = await retrieved.json();

  expect(data.ssn === undefined || data.ssn.includes('*')).toBeTruthy();
});
```

### Audit Log Immutability

```typescript
test('audit logs should be immutable', async ({ authenticatedContext }) => {
  const student = await createTestStudent(authenticatedContext);
  const auditLog = await verifyAuditLog(
    authenticatedContext,
    'student',
    student.id,
    'create'
  );

  // Attempt to modify audit log should fail
  const updateResponse = await authenticatedContext.put(
    `/api/v1/audit-logs/${auditLog.id}`,
    {
      data: { action: 'modified' },
    }
  );

  expect(updateResponse.ok()).toBeFalsy();
  expect(updateResponse.status()).toBe(403);
});
```

## Performance Testing

### API Response Time

```typescript
test('API should respond within 500ms', async ({ authenticatedContext }) => {
  const startTime = Date.now();
  const response = await authenticatedContext.get('/api/v1/students');
  const duration = Date.now() - startTime;

  expect(response.ok()).toBeTruthy();
  expect(duration).toBeLessThan(500);
});
```

### Page Load Performance

```typescript
test('page should load within 2.5 seconds', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  const loadTime = Date.now() - startTime;

  expect(loadTime).toBeLessThan(2500);
});
```

## Troubleshooting

### Tests Timing Out

**Problem**: Tests timeout after 60 seconds

**Solutions**:
1. Increase timeout in `playwright.config.integration.ts`:
   ```typescript
   timeout: 120000, // 2 minutes
   ```

2. Check backend server is running:
   ```bash
   npm run dev:backend
   ```

3. Verify database is accessible

### Authentication Failures

**Problem**: Tests fail with 401 errors

**Solutions**:
1. Verify test user credentials in `helpers/test-data.ts`
2. Check JWT token generation in backend
3. Ensure auth middleware is configured correctly

### Flaky Tests

**Problem**: Tests pass sometimes and fail other times

**Solutions**:
1. Add explicit waits:
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

2. Verify test independence (no shared state)
3. Check for race conditions
4. Use `test.describe.serial()` if tests must run sequentially

### Performance Test Failures

**Problem**: Performance tests consistently fail

**Solutions**:
1. Check server resources (CPU, memory)
2. Verify database indexes
3. Monitor network latency
4. Review caching configuration

### Database Issues

**Problem**: Tests fail due to database errors

**Solutions**:
1. Reset database:
   ```bash
   npm run db:reset
   ```

2. Run migrations:
   ```bash
   npm run db:migrate
   ```

3. Check database connection string in `.env`

## CI/CD Integration

### GitHub Actions

```yaml
name: Integration Tests

on: [push, pull_request]

jobs:
  integration-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run database migrations
        run: npm run db:migrate

      - name: Run database seeders
        run: npm run db:seed

      - name: Run integration tests
        run: npm run test:integration

      - name: Upload test report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/integration/
```

### Environment Variables for CI

```bash
export CI=true
export API_BASE_URL=http://localhost:3001
export DATABASE_URL=postgresql://user:password@localhost:5432/whitecross_test
export JWT_SECRET=test-secret-key
export SKIP_SERVER_START=false
```

## Best Practices

1. **Test Independence**: Each test should be independent and not rely on other tests
2. **Clean State**: Use unique identifiers for created resources
3. **Error Handling**: Test both success and error scenarios
4. **Timeouts**: Use appropriate timeouts for API requests
5. **Clear Assertions**: Make specific assertions about expected behavior
6. **HIPAA Compliance**: Always verify audit logging for PHI operations
7. **Performance**: Monitor response times and page load metrics
8. **Documentation**: Keep tests well-documented and maintainable

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Testing Best Practices](https://testingjavascript.com/)
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa/index.html)
- [API Testing Guide](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Integration Testing README](./README.md)

## Support

For questions or issues:
- Create an issue in the repository
- Review existing test documentation
- Check CI/CD logs for failures
- Contact the QA team

---

**Last Updated**: 2025-10-26
**Version**: 1.0.0
