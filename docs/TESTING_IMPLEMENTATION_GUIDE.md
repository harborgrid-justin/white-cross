# Testing Implementation Guide
## 15 Critical Features - White Cross Healthcare Platform

**Quick Start:** This guide provides step-by-step instructions to implement comprehensive testing for 15 critical features identified in the gap analysis.

**Time Estimate:** 20-24 weeks with 5-6 developers
**Target Coverage:** 95% lines/functions, 90% branches

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Setup (Week 1)](#phase-1-setup)
3. [Phase 2: Implementation (Weeks 2-22)](#phase-2-implementation)
4. [Phase 3: CI/CD Integration (Week 23)](#phase-3-cicd-integration)
5. [Phase 4: Validation (Week 24)](#phase-4-validation)
6. [Maintenance](#maintenance)

---

## Prerequisites

### Environment Setup

```bash
# Install all dependencies
npm ci

# Verify test infrastructure
cd frontend && npm test -- --run
cd ../backend && npm test
```

### Required Tools

- Node.js 20+
- PostgreSQL 15+ (for integration tests)
- Redis 7+ (for integration tests)
- Playwright browsers: `npx playwright install`

### Development Team

- **Team Lead** (1): Coordinates testing strategy, reviews PRs
- **Frontend Test Engineers** (2): Component and E2E tests
- **Backend Test Engineers** (2): Unit and integration tests
- **QA Engineer** (1): Test planning, coverage analysis, flaky test hunting

---

## Phase 1: Setup (Week 1)

### Day 1-2: Test Infrastructure

**Goal:** Set up shared test utilities and fixtures

```bash
# Create directory structure
mkdir -p frontend/src/test/{fixtures,mocks/handlers,helpers,types}
mkdir -p backend/src/__tests__/{integration,unit}
mkdir -p frontend/tests/e2e/{phi-disclosure,encryption,tamper-alerts,drug-interactions,outbreak-detection,real-time-alerts,clinic-visits,immunization-dashboard,medicaid-billing,pdf-reports,immunization-ui,document-sharing,state-registry,export-scheduling,sis-integration}
```

**Tasks:**
1. ✅ Copy `frontend/src/test/fixtures/*.fixtures.ts` from strategy document
2. ✅ Copy `frontend/src/test/mocks/handlers/*.handlers.ts` from strategy document
3. ✅ Create `frontend/src/test/helpers/hipaa-helpers.ts`
4. ✅ Create `frontend/src/test/helpers/rbac-helpers.ts`
5. ✅ Update `frontend/src/test/setup.ts` with global test configuration

**Files to Create:**
- ✅ `phi-disclosure.fixtures.ts`
- ✅ `drug-interactions.fixtures.ts`
- ✅ `clinic-visits.fixtures.ts`
- ✅ `immunizations.fixtures.ts`
- `outbreak-detection.fixtures.ts`
- `real-time-alerts.fixtures.ts`
- `encryption.fixtures.ts`
- `tamper-alerts.fixtures.ts`
- `medicaid-billing.fixtures.ts`
- `integrations.fixtures.ts`

### Day 3-4: MSW Handlers

**Goal:** Create comprehensive API mocking

```typescript
// frontend/src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { phiDisclosureHandlers } from './handlers/phi-disclosure.handlers';
import { drugInteractionHandlers } from './handlers/drug-interactions.handlers';
// Import all other handlers...

export const server = setupServer(
  ...phiDisclosureHandlers,
  ...drugInteractionHandlers,
  // Add all handlers...
);
```

**Tasks:**
1. Create handler files for each feature (15 total)
2. Implement CRUD operations for each API
3. Add error simulation handlers
4. Add HIPAA audit logging simulation

### Day 5: CI/CD Pipeline

**Goal:** Set up automated testing workflow

```bash
# Copy workflow file
cp .github/workflows/test-critical-features.yml .github/workflows/
```

**Tasks:**
1. Configure GitHub Actions workflow
2. Set up test database in CI
3. Configure Playwright CI settings
4. Set up coverage reporting (Codecov)
5. Test pipeline with sample PR

---

## Phase 2: Implementation (Weeks 2-22)

### Sprint Structure

Each sprint focuses on one feature with complete test coverage:
- **Week 1-2:** PHI Disclosure Tracking
- **Week 3-4:** Encryption UI
- **Week 5:** Tamper Alerts
- **Week 6-8:** Drug Interaction Checker
- **Week 9-10:** Outbreak Detection
- **Week 11-13:** Real-Time Alerts
- **Week 14-16:** Clinic Visit Tracking
- **Week 17-18:** Immunization Dashboard
- **Week 19-22:** Medicaid Billing

### Per-Feature Checklist

For **each feature**, complete the following:

#### Backend Unit Tests

```bash
# Location: backend/src/services/<feature>/__tests__/
# Example: backend/src/services/phi-disclosure/__tests__/PhiDisclosureService.test.ts
```

**Required Tests:**
- [ ] Service CRUD operations (create, read, update, delete)
- [ ] Business logic validation
- [ ] Error handling (network, validation, authorization)
- [ ] Edge cases (null values, boundary conditions)
- [ ] Data transformation logic
- [ ] Async operations (promises, callbacks)

**Template:**
```typescript
import { PhiDisclosureService } from '../PhiDisclosureService';
import { phiDisclosureFixtures } from '@/test/fixtures/phi-disclosure.fixtures';

describe('PhiDisclosureService', () => {
  let service: PhiDisclosureService;

  beforeEach(() => {
    service = new PhiDisclosureService();
  });

  describe('createDisclosure', () => {
    it('should create disclosure with valid data', async () => {
      const result = await service.createDisclosure(
        phiDisclosureFixtures.createData
      );

      expect(result.id).toBeDefined();
      expect(result.studentId).toBe('student-456');
    });

    it('should validate required fields', async () => {
      await expect(
        service.createDisclosure({} as any)
      ).rejects.toThrow(/validation/i);
    });

    it('should audit disclosure creation', async () => {
      const auditSpy = jest.spyOn(AuditService, 'log');

      await service.createDisclosure(phiDisclosureFixtures.createData);

      expect(auditSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'PHI_DISCLOSURE_CREATED',
        })
      );
    });
  });

  // Add more test suites...
});
```

**Coverage Target:** 95% lines, 90% branches

#### Frontend Unit Tests (API Layer)

```bash
# Location: frontend/src/features/<feature>/__tests__/
# Example: frontend/src/features/phi-disclosure/__tests__/phiDisclosureApi.test.ts
```

**Required Tests:**
- [ ] API client initialization
- [ ] GET requests with query parameters
- [ ] POST requests with validation
- [ ] PUT/PATCH updates
- [ ] DELETE operations
- [ ] Error response handling
- [ ] Request/response transformation
- [ ] Network error handling
- [ ] Timeout handling

**Template:**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { PhiDisclosureApi } from '../services/phiDisclosureApi';
import { phiDisclosureFixtures } from '@/test/fixtures/phi-disclosure.fixtures';

describe('PhiDisclosureApi', () => {
  let api: PhiDisclosureApi;

  beforeEach(() => {
    api = new PhiDisclosureApi();
  });

  describe('createDisclosure', () => {
    it('should create disclosure successfully', async () => {
      server.use(
        http.post('/api/phi-disclosures', async ({ request }) => {
          const body = await request.json();

          return HttpResponse.json({
            success: true,
            data: { disclosure: { id: 'new-id', ...body } },
          });
        })
      );

      const result = await api.createDisclosure(
        phiDisclosureFixtures.createData
      );

      expect(result.id).toBe('new-id');
    });

    it('should handle validation errors', async () => {
      server.use(
        http.post('/api/phi-disclosures', () => {
          return HttpResponse.json(
            { error: { message: 'Validation failed' } },
            { status: 400 }
          );
        })
      );

      await expect(
        api.createDisclosure({} as any)
      ).rejects.toThrow(/validation/i);
    });
  });
});
```

**Coverage Target:** 95% lines, 90% branches

#### Component Tests (React Testing Library)

```bash
# Location: frontend/src/features/<feature>/components/__tests__/
# Example: frontend/src/features/phi-disclosure/components/__tests__/PhiDisclosureForm.test.tsx
```

**Required Tests:**
- [ ] Component rendering
- [ ] User interactions (clicks, typing, selections)
- [ ] Form validation
- [ ] Form submission
- [ ] Error state display
- [ ] Loading states
- [ ] Success/failure feedback
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Conditional rendering

**Template:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhiDisclosureForm } from '../PhiDisclosureForm';
import { TestWrapper } from '@/test/helpers/test-utils';

describe('PhiDisclosureForm', () => {
  const mockOnSuccess = vi.fn();

  it('should render all form fields', () => {
    render(
      <TestWrapper>
        <PhiDisclosureForm onSuccess={mockOnSuccess} />
      </TestWrapper>
    );

    expect(screen.getByLabelText(/disclosed to/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/purpose/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <PhiDisclosureForm onSuccess={mockOnSuccess} />
      </TestWrapper>
    );

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/disclosed to is required/i)).toBeInTheDocument();
    });
  });

  it('should submit form successfully', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <PhiDisclosureForm onSuccess={mockOnSuccess} />
      </TestWrapper>
    );

    await user.type(screen.getByLabelText(/disclosed to/i), 'Dr. Smith');
    await user.selectOptions(screen.getByLabelText(/purpose/i), 'Treatment');
    await user.type(
      screen.getByLabelText(/information disclosed/i),
      'Medical records'
    );

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
```

**Coverage Target:** 95% lines, 90% branches

#### E2E Tests (Playwright)

```bash
# Location: frontend/tests/e2e/<feature>/
# Example: frontend/tests/e2e/phi-disclosure/01-disclosure-creation.spec.ts
```

**Required Test Scenarios:**
- [ ] Happy path workflow
- [ ] Form validation errors
- [ ] Error handling (network failures, API errors)
- [ ] RBAC permission checks
- [ ] HIPAA audit logging verification
- [ ] Accessibility checks
- [ ] Performance checks
- [ ] Cross-browser compatibility

**Template:**
```typescript
import { test, expect } from '@playwright/test';
import { loginAsNurse } from '../helpers/auth-helpers';

test.describe('PHI Disclosure - Creation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsNurse(page);
    await page.goto('/phi-disclosures');
  });

  test('should create disclosure successfully', async ({ page }) => {
    await page.getByRole('button', { name: /new disclosure/i }).click();

    await page.getByLabel(/disclosed to/i).fill('Dr. Smith');
    await page.getByLabel(/purpose/i).selectOption('Treatment');
    await page.getByLabel(/information disclosed/i).fill('Medical records');

    await page.getByRole('button', { name: /submit/i }).click();

    await expect(page.getByText(/disclosure created successfully/i)).toBeVisible();
  });

  test('should enforce RBAC permissions', async ({ page }) => {
    // Log out and login as teacher
    await page.getByTestId('logout-button').click();
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('teacher@school.edu');
    await page.getByLabel(/password/i).fill('teacher123');
    await page.getByRole('button', { name: /login/i }).click();

    // Try to access PHI disclosures
    await page.goto('/phi-disclosures');

    await expect(page.getByText(/access denied/i)).toBeVisible();
  });
});
```

**Coverage Target:** All critical user flows tested

#### HIPAA Compliance Tests

**Required for Every Feature:**
- [ ] All PHI access is audited
- [ ] Audit logs contain correct metadata
- [ ] PHI is never exposed in error messages
- [ ] Encryption is used for sensitive data
- [ ] Minimum necessary principle is followed
- [ ] Access control is enforced

**Template:**
```typescript
describe('HIPAA Compliance', () => {
  it('should audit all PHI access', async () => {
    const auditTracker = new AuditLogTracker();

    await api.getDisclosuresByStudent('student-123');

    auditTracker.assertAuditLogged(
      'PHI_DISCLOSURE_ACCESS',
      'PHI_DISCLOSURE',
      'student-123'
    );
  });

  it('should not expose PHI in errors', async () => {
    server.use(
      http.get('/api/phi-disclosures/:id', () => {
        return HttpResponse.json(
          { error: { message: 'Not found' } },
          { status: 404 }
        );
      })
    );

    try {
      await api.getDisclosureById('disclosure-with-sensitive-data');
    } catch (error: any) {
      expect(error.message).not.toContain('patient');
      expect(error.message).not.toContain('diagnosis');
    }
  });
});
```

#### RBAC Tests

**Required for Every Feature:**
- [ ] Admin has full access
- [ ] Nurse has appropriate access
- [ ] Teacher has read-only or no access
- [ ] Parent has own-student-only access
- [ ] Unauthorized access is blocked

**Template:**
```typescript
import { generateRbacTests, phiDisclosurePermissions } from '@/test/helpers/rbac-helpers';

generateRbacTests(
  'PHI Disclosures',
  phiDisclosurePermissions,
  {
    create: async () => api.createDisclosure(createData),
    read: async () => api.getDisclosureById('disclosure-123'),
    update: async () => api.updateDisclosure('disclosure-123', updateData),
    delete: async () => api.deleteDisclosure('disclosure-123'),
  }
);
```

---

## Phase 3: CI/CD Integration (Week 23)

### GitHub Actions Workflow

**File:** `.github/workflows/test-critical-features.yml`

```yaml
name: Test Critical Features

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: whitecross_test
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: cd backend && npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: cd frontend && npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run dev &
      - run: npx wait-on http://localhost:5173
      - run: cd frontend && npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

### Pull Request Checks

**Configure:**
1. Required status checks
2. Code coverage thresholds (95% lines, 90% branches)
3. No flaky tests allowed
4. All E2E tests must pass

---

## Phase 4: Validation (Week 24)

### Coverage Analysis

```bash
# Generate coverage reports
npm run test:coverage

# Check thresholds
npx nyc check-coverage --lines 95 --functions 95 --branches 90
```

### Quality Metrics

**Checklist:**
- [ ] All 15 features have 95%+ line coverage
- [ ] All 15 features have 90%+ branch coverage
- [ ] Zero flaky tests
- [ ] All E2E tests pass consistently (5 consecutive runs)
- [ ] HIPAA compliance tests pass 100%
- [ ] RBAC tests pass for all roles
- [ ] Performance tests meet thresholds
- [ ] Accessibility tests pass

### Final Deliverables

1. **Test Report** - Coverage metrics per feature
2. **HIPAA Compliance Certificate** - All features audited
3. **Performance Report** - E2E test execution times
4. **Accessibility Report** - WCAG 2.1 AA compliance

---

## Maintenance

### Weekly Tasks
- Review flaky test reports
- Update fixtures with new data scenarios
- Review test execution times
- Update test documentation

### Monthly Tasks
- Coverage trend analysis
- Test suite optimization
- Update E2E test scenarios
- Security dependency updates

### Quarterly Tasks
- Full test suite audit
- HIPAA compliance review
- Performance benchmark updates
- Accessibility audit

---

## Quick Reference

### Run Tests

```bash
# Backend unit tests
cd backend && npm test

# Frontend unit tests
cd frontend && npm test

# E2E tests (all)
cd frontend && npx playwright test

# E2E tests (single feature)
cd frontend && npx playwright test tests/e2e/phi-disclosure

# E2E tests (headed mode for debugging)
cd frontend && npx playwright test --headed

# Coverage
npm run test:coverage

# Watch mode
cd frontend && npm test -- --watch
```

### Debug Tests

```bash
# Vitest UI
cd frontend && npm run test:ui

# Playwright UI
cd frontend && npx playwright test --ui

# Playwright debug mode
cd frontend && npx playwright test --debug
```

### Common Issues

**Issue:** MSW handlers not working
**Solution:** Ensure server is started in `setup.ts` and handlers are imported

**Issue:** E2E tests timing out
**Solution:** Increase timeout in `playwright.config.ts` or use `waitFor` helpers

**Issue:** Flaky E2E tests
**Solution:** Use Playwright's auto-waiting, avoid `waitForTimeout`, ensure proper test isolation

**Issue:** Coverage not meeting threshold
**Solution:** Check uncovered lines with `npx nyc report --reporter=html`, add missing test cases

---

## Resources

- **Vitest Docs:** https://vitest.dev
- **Playwright Docs:** https://playwright.dev
- **React Testing Library:** https://testing-library.com/react
- **MSW Docs:** https://mswjs.io
- **HIPAA Compliance:** https://www.hhs.gov/hipaa

---

## Support

**Questions?** Contact:
- Testing Lead: testing-lead@whitecross.health
- DevOps: devops@whitecross.health
- HIPAA Officer: privacy@whitecross.health

**Slack Channels:**
- `#testing-strategy`
- `#hipaa-compliance`
- `#ci-cd-pipeline`
