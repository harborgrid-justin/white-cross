# Testing Guide for White Cross Healthcare Platform

> **Comprehensive testing strategy for enterprise-grade healthcare application**
>
> **Coverage Target**: 95%+ for critical paths | HIPAA-compliant testing | Accessibility-first approach

## Table of Contents

1. [Overview](#overview)
2. [Testing Philosophy](#testing-philosophy)
3. [Testing Pyramid](#testing-pyramid)
4. [Test Types & Tools](#test-types--tools)
5. [Writing Tests](#writing-tests)
6. [Running Tests](#running-tests)
7. [Healthcare-Specific Testing](#healthcare-specific-testing)
8. [CI/CD Integration](#cicd-integration)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

White Cross uses a comprehensive, multi-layered testing strategy to ensure:

- ✅ **HIPAA Compliance**: All PHI access is properly controlled and audited
- ✅ **Accessibility (WCAG 2.1 AA)**: Healthcare interfaces are accessible to all users
- ✅ **Reliability**: Critical healthcare workflows work flawlessly
- ✅ **Security**: Data protection and access controls are enforced
- ✅ **Performance**: Fast, responsive user experience

### Test Coverage Goals

| Layer | Target | Current |
|-------|--------|---------|
| Unit Tests | 95% | TBD |
| Integration Tests | 90% | TBD |
| E2E Tests | Critical paths | TBD |
| Accessibility | 100% WCAG AA | TBD |
| HIPAA Compliance | 100% | TBD |

---

## Testing Philosophy

### 1. Test User Behavior, Not Implementation

❌ **Don't test**:
```typescript
// Testing implementation details
expect(component.state.isOpen).toBe(true);
```

✅ **Do test**:
```typescript
// Testing user-visible behavior
expect(screen.getByRole('dialog')).toBeVisible();
```

### 2. Accessibility-First Testing

Every interactive element must be tested for keyboard navigation and screen reader support:

```typescript
it('should be keyboard accessible', async () => {
  const user = userEvent.setup();
  render(<MedicationForm />);

  await user.tab(); // Focus first input
  expect(screen.getByLabelText('Medication Name')).toHaveFocus();
});
```

### 3. HIPAA-Compliant Testing

- ✅ No real PHI in tests
- ✅ Verify audit logging
- ✅ Check access controls
- ✅ Validate data encryption

```typescript
import { hipaaSecurityTests } from '@/tests/utils/hipaa-test-utils';

it('should log PHI access', async () => {
  const auditLog = await accessStudentRecord(user, studentId);
  expect(hipaaSecurityTests.technical.testAuditControls(auditLog)).toBe(true);
});
```

---

## Testing Pyramid

```
        /\
       /E2E\         10% - Critical user flows
      /------\
     /  INT   \      20% - Feature integration
    /----------\
   /    UNIT    \    70% - Component & function tests
  /--------------\
```

### Unit Tests (70%)
- Individual components
- Utility functions
- React hooks
- State management

### Integration Tests (20%)
- API integration
- Multi-component interactions
- User flows
- State persistence

### E2E Tests (10%)
- Critical healthcare workflows
- Cross-browser testing
- Real user scenarios

---

## Test Types & Tools

### 1. Unit Tests - Jest + React Testing Library

**Purpose**: Test individual components and functions in isolation

**Tools**:
- Jest: Test runner and assertion library
- React Testing Library: Component testing
- @testing-library/user-event: User interaction simulation

**Example**:
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('should handle click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 2. Integration Tests - React Testing Library + MSW

**Purpose**: Test component interactions and API integration

**Tools**:
- MSW (Mock Service Worker): API mocking
- React Testing Library: Component rendering
- Test fixtures: Realistic test data

**Example**:
```typescript
import { renderWithProviders } from '@/tests/utils/test-providers';
import { server } from '@/tests/mocks/server';
import { http, HttpResponse } from 'msw';

describe('Student List Integration', () => {
  it('should fetch and display students', async () => {
    renderWithProviders(<StudentListPage />);

    // Wait for data to load
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    server.use(
      http.get('/api/v1/students', () => {
        return HttpResponse.json(
          { error: 'Server error' },
          { status: 500 }
        );
      })
    );

    renderWithProviders(<StudentListPage />);

    expect(await screen.findByText(/error loading students/i)).toBeInTheDocument();
  });
});
```

### 3. E2E Tests - Playwright

**Purpose**: Test complete user workflows across the application

**Tools**:
- Playwright: Cross-browser E2E testing
- Page Object Model: Maintainable test structure

**Example**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Medication Administration', () => {
  test('nurse can administer medication with witness', async ({ page }) => {
    // Login as nurse
    await page.goto('/login');
    await page.getByLabel('Email').fill('nurse@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();

    // Navigate to medications
    await page.getByRole('link', { name: 'Medications' }).click();

    // Find medication to administer
    await page.getByRole('button', { name: 'Administer' }).first().click();

    // Fill administration form
    await page.getByLabel('Witnessed By').selectOption('witness-id');
    await page.getByLabel('Notes').fill('Student took medication without issue');

    // Submit
    await page.getByRole('button', { name: 'Confirm Administration' }).click();

    // Verify success
    await expect(page.getByText('Medication administered successfully')).toBeVisible();

    // Verify audit log created
    await page.goto('/audit-logs');
    await expect(page.getByText('ADMINISTER_MEDICATION')).toBeVisible();
  });
});
```

### 4. Accessibility Tests - jest-axe

**Purpose**: Ensure WCAG 2.1 AA compliance

**Tools**:
- jest-axe: Automated accessibility testing
- @axe-core/react: Runtime accessibility checks

**Example**:
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MedicationForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<MedicationForm />);

    await user.tab(); // Tab to first field
    expect(screen.getByLabelText('Medication Name')).toHaveFocus();

    await user.tab(); // Tab to second field
    expect(screen.getByLabelText('Dosage')).toHaveFocus();
  });
});
```

### 5. HIPAA Compliance Tests

**Purpose**: Verify PHI protection and access controls

**Tools**:
- Custom HIPAA test utilities
- Audit log verification
- Access control testing

**Example**:
```typescript
import { hipaaTestScenarios } from '@/tests/utils/hipaa-test-utils';

describe('HIPAA Compliance', () => {
  it('should audit all PHI access', async () => {
    const nurse = createNurse();
    const student = createStudent();

    // Access student record
    const response = await api.get(`/students/${student.id}`);

    // Verify audit log
    const auditLog = await api.get('/audit-logs', {
      params: { resource: 'student', resourceId: student.id }
    });

    expect(auditLog.data.logs).toHaveLength(1);
    expect(auditLog.data.logs[0]).toMatchObject({
      action: 'READ',
      resource: 'student',
      userId: nurse.id,
    });
  });

  it('should prevent unauthorized PHI access', async () => {
    const unauthorizedUser = createUser({ role: 'parent' });

    await expect(
      api.get('/students/123', {
        headers: { Authorization: `Bearer ${unauthorizedUser.token}` }
      })
    ).rejects.toThrow('Forbidden');
  });
});
```

---

## Writing Tests

### Test Structure

Use **AAA Pattern** (Arrange-Act-Assert):

```typescript
describe('Component/Feature', () => {
  it('should do something when condition', async () => {
    // ARRANGE: Set up test data and render component
    const user = createUser();
    const { container } = renderWithProviders(<Component user={user} />);

    // ACT: Perform user actions
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // ASSERT: Verify expected outcome
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});
```

### Query Priority (React Testing Library)

1. **getByRole** - Most accessible (preferred)
2. **getByLabelText** - Form elements
3. **getByPlaceholderText** - If no label
4. **getByText** - Non-interactive content
5. **getByTestId** - Last resort

```typescript
// ✅ Preferred: Accessible query
const button = screen.getByRole('button', { name: 'Submit' });

// ❌ Avoid: Implementation detail
const button = screen.getByClassName('submit-btn');
```

### Async Testing

Always use `await` and proper matchers:

```typescript
// ✅ Correct: Wait for element to appear
expect(await screen.findByText('Loaded')).toBeInTheDocument();

// ✅ Correct: Wait for condition
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// ❌ Wrong: No waiting
expect(screen.getByText('Loaded')).toBeInTheDocument(); // May fail
```

### Mocking API Calls

Use MSW for API mocking:

```typescript
import { server } from '@/tests/mocks/server';
import { http, HttpResponse } from 'msw';

// Override handler for specific test
server.use(
  http.get('/api/v1/students/:id', ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        firstName: 'Test',
        lastName: 'Student',
      },
    });
  })
);
```

---

## Running Tests

### Command Reference

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- Button.test.tsx

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run E2E tests in UI mode
npm run playwright:ui

# Run accessibility tests only
npm test -- --testNamePattern="accessibility|a11y"

# Run HIPAA compliance tests only
npm test -- --testNamePattern="HIPAA|compliance"
```

### Coverage Reports

Generate coverage reports:

```bash
npm run test:coverage
```

View coverage report:
```bash
open coverage/lcov-report/index.html
```

Coverage thresholds (enforced in CI):
- **Lines**: 95%
- **Functions**: 95%
- **Branches**: 90%
- **Statements**: 95%

---

## Healthcare-Specific Testing

### 1. Medication Administration Testing

```typescript
describe('Medication Administration', () => {
  it('should require witness for controlled substances', async () => {
    const medication = createMedication({ isControlled: true });

    render(<MedicationAdminForm medication={medication} />);

    // Witness field should be required
    expect(screen.getByLabelText('Witnessed By')).toBeRequired();
  });

  it('should record exact timestamp', async () => {
    const beforeTime = new Date();

    await administerMedication(medicationId, nurseId, witnessId);

    const afterTime = new Date();
    const record = await getMedicationRecord(medicationId);

    const administeredTime = new Date(record.administeredAt);
    expect(administeredTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
    expect(administeredTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
  });
});
```

### 2. Emergency Contact Testing

```typescript
describe('Emergency Contacts', () => {
  it('should validate phone numbers', async () => {
    render(<EmergencyContactForm />);

    await userEvent.type(screen.getByLabelText('Phone'), 'invalid');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText(/invalid phone number/i)).toBeVisible();
  });

  it('should require at least one primary contact', async () => {
    const student = createStudent({ emergencyContacts: [] });

    render(<EmergencyContactList student={student} />);

    expect(screen.getByText(/no primary contact/i)).toBeVisible();
  });
});
```

### 3. Incident Reporting Testing

```typescript
describe('Incident Reporting', () => {
  it('should notify parents for serious incidents', async () => {
    const incident = createIncident({ severity: 'serious' });

    await submitIncidentReport(incident);

    // Verify parent notification
    expect(mockNotificationService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'sms',
        to: expect.arrayContaining([student.emergencyContacts[0].phone]),
      })
    );
  });
});
```

---

## CI/CD Integration

Tests run automatically on:
- ✅ Every push to `main`, `master`, or `develop`
- ✅ Every pull request
- ✅ Manual workflow dispatch

### GitHub Actions Workflow

The testing workflow includes:

1. **Linting & Type Checking**
2. **Unit Tests** (with coverage upload to Codecov)
3. **E2E Tests** (across Chromium, Firefox, WebKit)
4. **Accessibility Tests**
5. **HIPAA Compliance Tests**
6. **Security Scanning** (npm audit, Snyk, TruffleHog)
7. **Lighthouse CI** (performance, accessibility, best practices)
8. **Bundle Size Analysis**

### Required Checks

Pull requests must pass:
- ✅ All unit tests
- ✅ All E2E tests
- ✅ 95%+ code coverage
- ✅ No accessibility violations (critical/serious)
- ✅ No HIPAA compliance failures
- ✅ No high/critical security vulnerabilities
- ✅ Lighthouse scores: Performance > 90, Accessibility > 95

---

## Best Practices

### ✅ DO

- **Test user behavior, not implementation**
- **Use accessible queries** (getByRole, getByLabelText)
- **Write descriptive test names** ("should do X when Y")
- **Keep tests focused and simple** (one assertion per test when possible)
- **Use realistic test data** (via factories)
- **Mock external dependencies** (APIs, third-party services)
- **Test error states and edge cases**
- **Maintain test independence** (no test should depend on another)
- **Use TypeScript for tests** (catch errors early)

### ❌ DON'T

- **Don't test implementation details**
- **Don't use getByClassName or CSS selectors** (prefer accessible queries)
- **Don't rely on snapshot tests alone**
- **Don't skip accessibility testing**
- **Don't use real PHI data** (use factories/fixtures)
- **Don't create flaky tests** (use proper waits)
- **Don't test third-party libraries** (assume they work)
- **Don't over-mock** (test realistic scenarios)

### HIPAA Testing Guidelines

1. **Never use real patient data** in tests
2. **Always verify audit logging** for PHI access
3. **Test access controls rigorously**
4. **Verify data encryption in transit**
5. **Check for PHI in logs and error messages**
6. **Test session timeout and auto-logout**
7. **Verify role-based access control (RBAC)**

---

## Troubleshooting

### Common Issues

#### Issue: Tests fail with "Not wrapped in act(...)"

**Solution**: Use `await` with async operations:

```typescript
// ❌ Wrong
userEvent.click(button);

// ✅ Correct
await userEvent.click(button);
```

#### Issue: "Unable to find element"

**Solution**: Element may load asynchronously:

```typescript
// ❌ Wrong
expect(screen.getByText('Loaded')).toBeInTheDocument();

// ✅ Correct
expect(await screen.findByText('Loaded')).toBeInTheDocument();
```

#### Issue: MSW handlers not working

**Solution**: Ensure server is started in test setup:

```typescript
// jest.setup.ts
import { server } from './tests/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

#### Issue: Accessibility violations in tests

**Solution**: Fix the accessibility issue in the component:

```typescript
// ❌ Missing label
<input type="text" />

// ✅ Proper label
<label htmlFor="name">Name</label>
<input id="name" type="text" />
```

---

## Resources

### Internal Documentation
- [Component Library](./COMPONENT_LIBRARY.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [HIPAA Compliance Guide](./HIPAA_COMPLIANCE.md)

### External Resources
- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev)
- [axe-core Accessibility Rules](https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Support

For testing questions or issues:
1. Check this guide first
2. Review existing tests for examples
3. Ask in #testing Slack channel
4. Open an issue in the repository

---

**Last Updated**: October 26, 2025
**Version**: 1.0.0
**Maintained by**: Testing & QA Team
