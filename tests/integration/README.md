# Integration Testing Suite - White Cross Platform

Comprehensive integration testing for the White Cross healthcare platform, ensuring zero regressions and 100% feature parity.

## 📋 Test Coverage

### Module Tests (10 suites)
- ✅ **Students** - CRUD operations, allergies, conditions, emergency contacts, health timeline
- ✅ **Medications** - Prescriptions, administration, inventory, scheduling, compliance
- ✅ **Appointments** - Scheduling, calendar, reminders, conflicts, status management
- ✅ **Health Records** - Vital signs, immunizations, injuries, medical history
- ✅ **Incidents** - Reporting, tracking, witnesses, follow-ups, parent notifications
- ✅ **Inventory** - Stock management, expiration tracking, reorder alerts
- ✅ **Communications** - Messages, broadcasts, alerts, notifications
- ✅ **Compliance** - Audit logs, reports, policy adherence
- ✅ **Analytics** - Dashboard metrics, trends, performance indicators
- ✅ **Admin** - User management, settings, system configuration

### Workflow Tests (4 suites)
- ✅ **Medication Administration** - Complete prescription-to-administration workflow
- ✅ **Appointment Scheduling** - End-to-end appointment booking and management
- ✅ **Incident Reporting** - Full incident documentation and follow-up
- ✅ **Student Health Tracking** - Comprehensive health monitoring workflow

### Authentication & Authorization (3 suites)
- ✅ **Login** - Authentication, token management, session handling
- ✅ **RBAC** - Role-based permissions (Nurse, Admin, Read-only)
- ✅ **Session** - Session management, concurrent sessions, revocation

### HIPAA Compliance (3 suites)
- ✅ **Audit Logging** - PHI access tracking, modification logs, immutability
- ✅ **PHI Access** - Protected health information security
- ✅ **Data Encryption** - Encryption at rest and in transit

### Performance Tests (2 suites)
- ✅ **API Response** - Response time benchmarks (< 500ms target)
- ✅ **Page Load** - Frontend loading performance (LCP < 2.5s)

## 🎯 Test Requirements

### Coverage Targets
- **Backend**: 95% lines/functions, 90% branches
- **Frontend**: 95% lines/functions, 90% branches
- **Integration**: 100% critical user paths
- **E2E**: All major workflows

### Performance Benchmarks
| Operation | Target | Critical |
|-----------|--------|----------|
| Health Check | < 100ms | < 200ms |
| Authentication | < 500ms | < 1000ms |
| GET Single Record | < 200ms | < 500ms |
| GET List (10 items) | < 500ms | < 1000ms |
| POST Create | < 500ms | < 1000ms |
| Complex Query | < 1000ms | < 2000ms |
| Dashboard Analytics | < 3000ms | < 5000ms |

### HIPAA Compliance Requirements
- ✅ All PHI access must be logged
- ✅ Audit logs are immutable
- ✅ Audit logs retained for 6+ years
- ✅ User, timestamp, IP, action captured
- ✅ No PHI in localStorage
- ✅ Encryption in transit (HTTPS)
- ✅ Encryption at rest (database)

## 🚀 Running Tests

### Run All Integration Tests
```bash
# From project root
npm run test:integration

# Or using Playwright directly
npx playwright test --config=playwright.config.integration.ts
```

### Run Specific Test Suite
```bash
# Module tests
npx playwright test --config=playwright.config.integration.ts --project=students-module
npx playwright test --config=playwright.config.integration.ts --project=medications-module

# Workflow tests
npx playwright test --config=playwright.config.integration.ts --project=medication-workflow

# Auth tests
npx playwright test --config=playwright.config.integration.ts --project=auth-login
npx playwright test --config=playwright.config.integration.ts --project=auth-rbac

# HIPAA tests
npx playwright test --config=playwright.config.integration.ts --project=hipaa-audit-logging

# Performance tests
npx playwright test --config=playwright.config.integration.ts --project=performance-api
```

### Run Tests in UI Mode
```bash
npx playwright test --config=playwright.config.integration.ts --ui
```

### Run Tests in Debug Mode
```bash
npx playwright test --config=playwright.config.integration.ts --debug
```

### Run Tests with Coverage
```bash
# Backend coverage
cd backend && npm run test:coverage

# Frontend coverage
cd frontend && npm run test:coverage

# Combined coverage report
npm run test:coverage
```

## 📊 Test Reports

### HTML Report
```bash
npx playwright show-report playwright-report/integration
```

### JSON Report
Located at: `playwright-report/integration-results.json`

### JUnit Report (for CI)
Located at: `playwright-report/integration-junit.xml`

## 🧪 Test Structure

```
tests/integration/
├── modules/                    # Module-specific integration tests
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
├── workflows/                  # End-to-end workflow tests
│   ├── medication-administration.test.ts
│   ├── appointment-scheduling.test.ts
│   ├── incident-reporting.test.ts
│   └── student-health-tracking.test.ts
├── auth/                       # Authentication & authorization
│   ├── login.test.ts
│   ├── rbac.test.ts
│   └── session.test.ts
├── hipaa/                      # HIPAA compliance tests
│   ├── audit-logging.test.ts
│   ├── phi-access.test.ts
│   └── data-encryption.test.ts
├── performance/                # Performance benchmarks
│   ├── api-response.test.ts
│   └── page-load.test.ts
└── helpers/                    # Test utilities
    ├── test-client.ts         # Authenticated API client
    └── test-data.ts           # Test fixtures
```

## 🔧 Test Helpers

### Authenticated Context
```typescript
import { test, expect } from '../helpers/test-client';

test('should access protected resource', async ({ authenticatedContext }) => {
  const response = await authenticatedContext.get('/api/v1/students');
  expect(response.ok()).toBeTruthy();
});
```

### Role-Based Contexts
```typescript
test('should allow admin access', async ({ adminContext }) => {
  const response = await adminContext.get('/api/v1/admin/settings');
  expect(response.ok()).toBeTruthy();
});

test('should allow nurse access', async ({ nurseContext }) => {
  const response = await nurseContext.get('/api/v1/students');
  expect(response.ok()).toBeTruthy();
});
```

### Helper Functions
```typescript
import {
  createTestStudent,
  createTestMedication,
  createTestAppointment,
  createTestHealthRecord,
  verifyAuditLog,
} from '../helpers/test-client';

test('workflow test', async ({ authenticatedContext }) => {
  const student = await createTestStudent(authenticatedContext);
  const medication = await createTestMedication(authenticatedContext, student.id);

  await verifyAuditLog(authenticatedContext, 'medication', medication.id, 'created');
});
```

## 📝 Writing New Tests

### Test Structure
```typescript
import { test, expect } from '../helpers/test-client';

test.describe('Feature Name', () => {
  test.describe('Specific Functionality', () => {
    test('should do something specific', async ({ authenticatedContext }) => {
      // Arrange
      const testData = { /* ... */ };

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

### Testing Best Practices
1. **Arrange-Act-Assert** - Clear test structure
2. **Descriptive Names** - Test names explain what they verify
3. **Independent Tests** - No test dependencies
4. **Clean Up** - Remove test data when possible
5. **Verify Audit Logs** - Always check PHI operations are logged
6. **Performance Aware** - Monitor response times
7. **Error Cases** - Test validation and error handling
8. **HIPAA Compliant** - Verify security requirements

## 🔍 Debugging Tests

### View Test Output
```bash
npx playwright test --config=playwright.config.integration.ts --reporter=list
```

### Debug Single Test
```bash
npx playwright test --config=playwright.config.integration.ts --debug -g "test name"
```

### Inspect Test Artifacts
```bash
# Screenshots (on failure)
ls playwright-report/integration/screenshots/

# Videos (on failure)
ls playwright-report/integration/videos/

# Traces (on retry)
ls playwright-report/integration/traces/
```

## 🎯 CI/CD Integration

### GitHub Actions
```yaml
- name: Run Integration Tests
  run: |
    npm run test:integration

- name: Upload Test Report
  uses: actions/upload-artifact@v3
  with:
    name: integration-test-report
    path: playwright-report/integration/
```

### Environment Variables
```bash
# API Base URL
export API_BASE_URL=http://localhost:3001

# Skip server start (if already running)
export SKIP_SERVER_START=true

# CI mode (affects retries, workers)
export CI=true
```

## ✅ Test Checklist

Before considering migration complete, verify:

- [ ] All module tests passing (10/10)
- [ ] All workflow tests passing (4/4)
- [ ] All auth tests passing (3/3)
- [ ] All HIPAA tests passing (3/3)
- [ ] All performance tests passing (2/2)
- [ ] Code coverage ≥ 95%
- [ ] No flaky tests (100% consistent)
- [ ] Performance benchmarks met
- [ ] All audit logging verified
- [ ] Zero regressions detected

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Testing Best Practices](https://testingjavascript.com/)
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa/index.html)
- [API Testing Guide](https://martinfowler.com/articles/practical-test-pyramid.html)

## 🆘 Troubleshooting

### Tests Timing Out
- Increase `timeout` in playwright.config.integration.ts
- Check backend server is running
- Verify database is accessible

### Authentication Failures
- Verify test user credentials in test-data.ts
- Check JWT token generation
- Verify auth middleware configuration

### Flaky Tests
- Add explicit waits where needed
- Verify test independence
- Check for race conditions
- Use `test.describe.serial()` if needed

### Performance Test Failures
- Check server resources
- Verify database indexes
- Monitor network latency
- Review caching configuration

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Contact the QA team
- Review test documentation
- Check CI/CD logs
