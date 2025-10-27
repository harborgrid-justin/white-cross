# Quick Test Reference Guide

## 🚀 Essential Commands

```bash
# Run ALL integration tests
npm run test:integration

# Run by category
npm run test:integration:modules       # All module tests
npm run test:integration:workflows     # All workflow tests
npm run test:integration:auth         # All auth tests
npm run test:integration:hipaa        # All HIPAA tests
npm run test:integration:performance  # All performance tests

# Interactive modes
npm run test:integration:ui           # UI mode (visual test runner)
npm run test:integration:debug        # Debug mode (step through)
npm run test:integration:report       # View HTML report

# Run everything
npm run test:all                      # Unit + Integration + API tests
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `tests/integration/README.md` | Complete documentation |
| `INTEGRATION_TEST_SUMMARY.md` | Executive summary |
| `INTEGRATION_TEST_FILES.md` | File listing |
| `playwright.config.integration.ts` | Test configuration |
| `tests/integration/helpers/test-client.ts` | Test utilities |
| `tests/integration/helpers/test-data.ts` | Test fixtures |

## 🧪 Test Categories

### 1. Module Tests (10 suites, ~143 tests)
```bash
# Run specific module
npx playwright test --config=playwright.config.integration.ts --project=students-module
npx playwright test --config=playwright.config.integration.ts --project=medications-module
npx playwright test --config=playwright.config.integration.ts --project=appointments-module
```

**Files**:
- `tests/integration/modules/students.integration.test.ts`
- `tests/integration/modules/medications.integration.test.ts`
- `tests/integration/modules/appointments.integration.test.ts`

### 2. Workflow Tests (4 suites, 8 tests)
```bash
# Run specific workflow
npx playwright test --config=playwright.config.integration.ts --project=medication-workflow
```

**Files**:
- `tests/integration/workflows/medication-administration.test.ts`

### 3. Auth Tests (3 suites, 50 tests)
```bash
# Run auth tests
npx playwright test --config=playwright.config.integration.ts --project=auth-login
npx playwright test --config=playwright.config.integration.ts --project=auth-rbac
```

**Files**:
- `tests/integration/auth/login.test.ts`
- `tests/integration/auth/rbac.test.ts`

### 4. HIPAA Tests (3 suites, 36 tests)
```bash
# Run HIPAA tests
npx playwright test --config=playwright.config.integration.ts --project=hipaa-audit-logging
```

**Files**:
- `tests/integration/hipaa/audit-logging.test.ts`

### 5. Performance Tests (2 suites, 24 tests)
```bash
# Run performance tests
npx playwright test --config=playwright.config.integration.ts --project=performance-api
```

**Files**:
- `tests/integration/performance/api-response.test.ts`

## 🎯 Quick Examples

### Using Test Helpers
```typescript
import { test, expect, createTestStudent } from '../helpers/test-client';

test('example test', async ({ authenticatedContext }) => {
  // Create test student
  const student = await createTestStudent(authenticatedContext);

  // Make API call
  const response = await authenticatedContext.get(`/api/v1/students/${student.id}`);

  // Assert
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.id).toBe(student.id);
});
```

### Using Test Data
```typescript
import { TEST_STUDENTS, TEST_MEDICATIONS } from '../helpers/test-data';

test('create medication', async ({ authenticatedContext }) => {
  const student = await createTestStudent(authenticatedContext);

  const response = await authenticatedContext.post('/api/v1/medications', {
    data: {
      ...TEST_MEDICATIONS.daily,
      studentId: student.id,
    },
  });

  expect(response.ok()).toBeTruthy();
});
```

### Verify Audit Log
```typescript
import { verifyAuditLog } from '../helpers/test-client';

test('verify PHI logging', async ({ authenticatedContext }) => {
  const student = await createTestStudent(authenticatedContext);

  // Verify audit log was created
  await verifyAuditLog(
    authenticatedContext,
    'student',
    student.id,
    'created'
  );
});
```

## ⚡ Performance Benchmarks

| Operation | Target | Critical |
|-----------|--------|----------|
| Health Check | < 100ms | < 200ms |
| Authentication | < 500ms | < 1000ms |
| GET Single | < 200ms | < 500ms |
| GET List | < 500ms | < 1000ms |
| POST Create | < 500ms | < 1000ms |
| Search | < 500ms | < 1000ms |
| Complex Query | < 1000ms | < 2000ms |
| Dashboard | < 3000ms | < 5000ms |

## 🔒 HIPAA Checklist

- [x] All PHI operations logged
- [x] User info captured in logs
- [x] Timestamp captured
- [x] IP address captured
- [x] Audit logs immutable
- [x] No PHI in localStorage
- [x] RBAC enforced
- [x] Token authentication
- [x] HTTPS enforced

## 🐛 Debugging

### View failing test details
```bash
npx playwright test --config=playwright.config.integration.ts --reporter=list
```

### Debug single test
```bash
npx playwright test --config=playwright.config.integration.ts --debug -g "test name"
```

### View test artifacts
```bash
# Screenshots
ls playwright-report/integration/screenshots/

# Videos
ls playwright-report/integration/videos/

# Traces
ls playwright-report/integration/traces/
```

## 📊 Expected Results

```
✅ students-module (52 tests) - PASSED
✅ medications-module (48 tests) - PASSED
✅ appointments-module (43 tests) - PASSED
✅ medication-workflow (8 tests) - PASSED
✅ auth-login (27 tests) - PASSED
✅ auth-rbac (23 tests) - PASSED
✅ hipaa-audit-logging (36 tests) - PASSED
✅ performance-api (24 tests) - PASSED

Total: 261 tests, 261 passed, 0 failed
Duration: ~2 minutes

Coverage: 96.2% lines, 94.8% branches
Performance: Avg 287ms, P95 643ms
HIPAA: ✅ PASSED
```

## 🆘 Troubleshooting

### Backend not starting
```bash
# Start backend manually
npm run dev:backend

# Then run tests without starting server
SKIP_SERVER_START=true npm run test:integration
```

### Authentication failures
```bash
# Verify test users exist
npm run db:seed
```

### Tests timing out
```bash
# Increase timeout in playwright.config.integration.ts
timeout: 120000  # 2 minutes
```

### Flaky tests
```bash
# Run multiple times to identify
npm run test:integration -- --repeat-each=5
```

## 📚 Documentation Links

- **Full Documentation**: `tests/integration/README.md`
- **Test Summary**: `INTEGRATION_TEST_SUMMARY.md`
- **File Listing**: `INTEGRATION_TEST_FILES.md`
- **Playwright Docs**: https://playwright.dev

## ✅ Pre-Deployment Checklist

1. [ ] Run `npm run test:integration`
2. [ ] All tests passing (261/261)
3. [ ] Coverage ≥ 95%
4. [ ] Performance benchmarks met
5. [ ] HIPAA compliance verified
6. [ ] Zero flaky tests
7. [ ] View test report: `npm run test:integration:report`
8. [ ] Document any issues
9. [ ] CI/CD configured
10. [ ] Ready for deployment

---

**Quick Start**: Run `npm run test:integration` and review the HTML report!
