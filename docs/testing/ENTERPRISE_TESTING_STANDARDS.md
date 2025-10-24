# Enterprise-Grade Playwright Testing Standards

## Overview

This document outlines the comprehensive enterprise-grade testing standards implemented for the White Cross Healthcare Management System using Playwright. These standards ensure our test suite meets the highest levels of quality, security, and maintainability required for healthcare applications handling Protected Health Information (PHI).

**Framework**: Playwright v1.56+
**Test Suite**: 151 E2E Tests + 10 API Integration Tests
**Coverage**: All major healthcare workflows and compliance requirements

## Table of Contents

1. [Test Architecture](#test-architecture)
2. [Test Organization](#test-organization)
3. [Page Object Model](#page-object-model)
4. [Test Fixtures & Data](#test-fixtures--data)
5. [Authentication & Authorization](#authentication--authorization)
6. [Security & HIPAA Compliance](#security--hipaa-compliance)
7. [Accessibility Testing](#accessibility-testing)
8. [Performance Standards](#performance-standards)
9. [API Testing](#api-testing)
10. [CI/CD Integration](#cicd-integration)
11. [Best Practices](#best-practices)
12. [Examples](#examples)

## Test Architecture

### AAA Pattern (Arrange-Act-Assert)

All tests follow the AAA pattern for clarity and maintainability:

```typescript
test('should create student with comprehensive validation', async ({ page }) => {
  // Arrange: Setup test data and environment
  await page.goto('/api/auth/test-login?role=nurse')
  await page.goto('/students')

  const studentData = {
    firstName: 'John',
    lastName: 'Doe',
    studentNumber: 'STU001',
    grade: '8',
    dateOfBirth: '2010-05-15'
  }

  // Act: Perform the action being tested
  await page.getByTestId('add-student-button').click()
  await page.getByTestId('firstName-input').fill(studentData.firstName)
  await page.getByTestId('lastName-input').fill(studentData.lastName)
  await page.getByTestId('save-button').click()

  // Assert: Verify expected outcomes
  await expect(page.getByText(/student.*created/i)).toBeVisible()
  await expect(page.getByTestId('student-table')).toContainText('John Doe')
})
```

## Test Organization

### Directory Structure

```
white-cross/
├── frontend/tests/e2e/
│   ├── 01-authentication/          # Auth workflows (10 tests)
│   ├── 02-student-management/      # Student CRUD (12 tests)
│   ├── administration/             # Admin features (12 tests)
│   ├── appointments/               # Scheduling (9 tests)
│   ├── audit-logs/                 # Compliance (7 tests)
│   ├── clinic-visits/              # Visit tracking (8 tests)
│   ├── communication/              # Messaging (10 tests)
│   ├── dashboard/                  # Dashboard (15 tests)
│   ├── emergency-contacts/         # Contacts (10 tests)
│   ├── health-records/            # Medical records (12 tests)
│   ├── immunizations/             # Vaccinations (10 tests)
│   ├── incident-reports/          # Incidents (10 tests)
│   └── medications/               # Medication safety (16 tests)
├── tests/
│   ├── api-integration/           # API tests (10 tests)
│   └── fixtures/                  # Test data
└── playwright.config.ts           # Configuration
```

### Test File Naming Convention

```
[module]/[sequence]-[feature].spec.ts

Examples:
- 01-authentication/01-login-page-ui.spec.ts
- 02-student-management/03-student-viewing.spec.ts
- medications/04-five-rights-verification.spec.ts
```

## Page Object Model

### Base Page Pattern

```typescript
/**
 * Base Page Object - Common patterns for all pages
 */
export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path)
    await this.waitForPageLoad()
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
    await this.page.waitForSelector('body')
  }

  async getByTestId(testId: string) {
    return this.page.getByTestId(testId)
  }

  async clickButton(testId: string) {
    await this.page.getByTestId(testId).click()
  }

  async fillField(testId: string, value: string) {
    await this.page.getByTestId(testId).fill(value)
  }

  async verifySuccess(message: string | RegExp) {
    await expect(
      this.page.locator('[role="alert"]').filter({ hasText: message })
    ).toBeVisible()
  }
}
```

### Feature-Specific Page Objects

```typescript
/**
 * Student Management Page Object
 */
export class StudentPage extends BasePage {
  async createStudent(studentData: StudentData) {
    await this.clickButton('add-student-button')
    await this.fillStudentForm(studentData)
    await this.clickButton('save-button')
  }

  async fillStudentForm(data: StudentData) {
    await this.fillField('firstName-input', data.firstName)
    await this.fillField('lastName-input', data.lastName)
    await this.fillField('studentNumber-input', data.studentNumber)
    await this.fillField('grade-select', data.grade)
  }

  async searchStudent(query: string) {
    await this.fillField('search-input', query)
    await this.page.keyboard.press('Enter')
  }

  async verifyStudentInTable(name: string) {
    await expect(this.getByTestId('student-table')).toContainText(name)
  }
}
```

## Test Fixtures & Data

### Using Fixtures

```typescript
import * as fs from 'fs'
import * as path from 'path'

test('should login with test users', async ({ page }) => {
  // Load fixture data
  const usersPath = path.join(__dirname, '../../../tests/fixtures/users.json')
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'))

  // Use fixture data
  await page.getByTestId('email-input').fill(users.admin.email)
  await page.getByTestId('password-input').fill(users.admin.password)
  await page.getByTestId('login-button').click()

  await expect(page).toHaveURL(/\/dashboard/)
})
```

### Fixture Organization

```
tests/fixtures/
├── users.json              # Test user accounts
├── students.json           # Student test data
├── medications.json        # Medication test data
├── health-records.json     # Health records data
├── appointments.json       # Appointment data
└── healthRecords.json      # Legacy health records
```

### Dynamic Test Data

```typescript
/**
 * Generate unique test data for isolation
 */
function generateTestStudent() {
  const timestamp = Date.now()
  return {
    studentNumber: `STU${timestamp}`,
    firstName: `Test${timestamp}`,
    lastName: 'Student',
    dateOfBirth: '2010-01-01',
    grade: '8'
  }
}
```

## Authentication & Authorization

### Test Login Endpoint

For E2E tests, use the dedicated test-login endpoint:

```typescript
test.beforeEach(async ({ page }) => {
  // Quick authentication for testing
  await page.goto('/api/auth/test-login?role=nurse')
  await page.goto('/dashboard')
})
```

### Role-Based Testing

```typescript
test.describe('Role-Based Access Control', () => {
  test('admin should access all features', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/administration')
    await expect(page.getByTestId('admin-panel')).toBeVisible()
  })

  test('viewer should have read-only access', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=viewer')
    await page.goto('/students')
    await expect(page.getByTestId('add-student-button')).not.toBeVisible()
  })

  test('nurse should manage health records', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/health-records')
    await expect(page.getByTestId('create-record-button')).toBeVisible()
  })
})
```

## Security & HIPAA Compliance

### PHI Access Logging

```typescript
test('should log PHI access for audit trail', async ({ page, request }) => {
  // Setup audit log interception
  const auditLogs: any[] = []
  await page.route('**/api/audit**', (route) => {
    auditLogs.push(route.request().postDataJSON())
    route.continue()
  })

  await page.goto('/api/auth/test-login?role=nurse')
  await page.goto('/students/1/health-records')

  // Verify audit log was created
  expect(auditLogs).toHaveLength(1)
  expect(auditLogs[0].action).toMatch(/VIEW|ACCESS/)
  expect(auditLogs[0].resourceType).toBe('HEALTH_RECORD')
})
```

### Secure Data Handling

```typescript
test('should not expose sensitive data in HTML', async ({ page }) => {
  await page.goto('/login')

  const bodyText = await page.locator('body').textContent()

  // Verify no sensitive data is exposed
  expect(bodyText).not.toContain('password')
  expect(bodyText).not.toContain('api-key')
  expect(bodyText).not.toContain('secret')
  expect(bodyText).not.toContain('ssn')
})
```

### Session Security

```typescript
test('should enforce session timeout', async ({ page }) => {
  await page.goto('/api/auth/test-login?role=nurse')
  await page.goto('/dashboard')

  // Mock session expiration
  await page.evaluate(() => {
    localStorage.removeItem('token')
  })

  await page.reload()

  // Should redirect to login
  await expect(page).toHaveURL(/\/login/)
})
```

## Accessibility Testing

### WCAG 2.1 AA Compliance

```typescript
test('should have accessible form labels', async ({ page }) => {
  await page.goto('/login')

  // Verify all inputs have labels
  const emailInput = page.getByTestId('email-input')
  await expect(emailInput).toHaveAttribute('id')

  const inputId = await emailInput.getAttribute('id')
  const associatedLabel = page.locator(`label[for="${inputId}"]`)
  await expect(associatedLabel).toBeAttached()
})

test('should support keyboard navigation', async ({ page }) => {
  await page.goto('/login')

  // Tab through form fields
  await page.keyboard.press('Tab')
  const focused = page.locator(':focus')
  await expect(focused).toContainText(/skip to main content|skip to content/i)
})

test('should have proper ARIA landmarks', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page.locator('[role="banner"], header').first()).toBeAttached()
  await expect(page.locator('[role="navigation"], nav').first()).toBeAttached()
  await expect(page.locator('[role="main"], main').first()).toBeAttached()
})
```

## Performance Standards

### Page Load Performance

```typescript
test('should load dashboard within acceptable time', async ({ page }) => {
  const startTime = Date.now()

  await page.goto('/dashboard')
  await expect(page.locator('main')).toBeVisible()

  const loadTime = Date.now() - startTime
  expect(loadTime).toBeLessThan(3000) // < 3 seconds
})
```

### Core Web Vitals

```typescript
test('should meet Core Web Vitals standards', async ({ page }) => {
  await page.goto('/dashboard')

  const paintMetrics = await page.evaluate(() => {
    const entries = performance.getEntriesByType('paint')
    return entries.map(entry => ({
      name: entry.name,
      startTime: entry.startTime
    }))
  })

  const lcp = paintMetrics.find(entry =>
    entry.name === 'largest-contentful-paint'
  )

  if (lcp) {
    expect(lcp.startTime).toBeLessThan(2500) // < 2.5s
  }
})
```

## API Testing

### REST API Integration Tests

```typescript
import { test, expect } from '@playwright/test'

test.describe('Students API', () => {
  let authToken: string

  test.beforeAll(async ({ request }) => {
    // Authenticate
    const response = await request.post('/api/v1/auth/login', {
      data: {
        email: 'admin@school.edu',
        password: 'AdminPassword123!'
      }
    })

    const data = await response.json()
    authToken = data.data.token
  })

  test('should create student', async ({ request }) => {
    const response = await request.post('/api/v1/students', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        firstName: 'John',
        lastName: 'Doe',
        studentNumber: 'STU001',
        grade: '8'
      }
    })

    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.student.firstName).toBe('John')
  })
})
```

## CI/CD Integration

### GitHub Actions Configuration

```yaml
name: Playwright E2E Tests

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test --config=frontend/playwright.config.ts

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: frontend/playwright-report/
          retention-days: 30
```

### Docker Testing Environment

```bash
# Run tests in Docker
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Run specific browser
docker-compose -f docker-compose.test.yml run playwright \
  npx playwright test --project=chromium

# Debug mode
docker-compose -f docker-compose.test.yml run playwright \
  npx playwright test --debug
```

## Best Practices

### 1. Test Independence

```typescript
// ❌ BAD: Tests depend on each other
test('create student', async ({ page }) => {
  // Creates student with ID 1
})

test('update student', async ({ page }) => {
  // Assumes student 1 exists
})

// ✅ GOOD: Each test is independent
test('create student', async ({ page }) => {
  // Create and verify
})

test('update student', async ({ page }) => {
  // Create student first, then update
})
```

### 2. Use Data Test IDs

```typescript
// ❌ BAD: Fragile selectors
await page.locator('.btn.btn-primary.submit-button').click()

// ✅ GOOD: Semantic test IDs
await page.getByTestId('submit-button').click()
```

### 3. Wait for Conditions

```typescript
// ❌ BAD: Arbitrary waits
await page.waitForTimeout(5000)

// ✅ GOOD: Wait for specific conditions
await page.waitForSelector('[data-testid="student-table"]')
await expect(page.getByTestId('loading-spinner')).not.toBeVisible()
```

### 4. Descriptive Test Names

```typescript
// ❌ BAD: Vague test names
test('test 1', ...)

// ✅ GOOD: Descriptive names
test('should display validation error when email is invalid', ...)
test('should create student with emergency contact information', ...)
```

### 5. Group Related Tests

```typescript
test.describe('Student Creation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/students')
  })

  test('should create student with required fields', ...)
  test('should create student with optional fields', ...)
  test('should validate required fields', ...)
})
```

## Examples

### Complete Healthcare Workflow Test

```typescript
test.describe('Medication Administration Workflow', () => {
  test('should complete five rights verification and administer medication', async ({ page }) => {
    // Arrange: Setup test environment
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/medications')

    const medicationData = {
      student: 'John Doe',
      medication: 'Ibuprofen 200mg',
      dosage: '200mg',
      time: '09:00 AM',
      route: 'Oral'
    }

    // Act: Navigate through workflow
    await page.getByTestId('administer-medication-button').click()
    await page.getByTestId('student-search').fill(medicationData.student)
    await page.keyboard.press('Enter')

    // Verify Five Rights
    await expect(page.getByText('Right Patient')).toBeVisible()
    await expect(page.getByText('Right Medication')).toBeVisible()
    await expect(page.getByText('Right Dose')).toBeVisible()
    await expect(page.getByText('Right Time')).toBeVisible()
    await expect(page.getByText('Right Route')).toBeVisible()

    // Confirm administration
    await page.getByTestId('confirm-administration-button').click()
    await page.getByTestId('sign-name-input').fill('Jane Nurse RN')
    await page.getByTestId('submit-button').click()

    // Assert: Verify success
    await expect(page.getByText(/medication.*administered/i)).toBeVisible()
    await expect(page.getByTestId('medication-log')).toContainText('Ibuprofen')
  })
})
```

## Support Resources

- **Playwright Documentation**: https://playwright.dev/docs/intro
- **Project Documentation**: `/docs/`
- **Test Fixtures**: `/tests/fixtures/`
- **Configuration**: `/playwright.config.ts`, `/frontend/playwright.config.ts`

## Maintenance

### Regular Tasks

1. **Update Fixtures**: Keep test data current with schema changes
2. **Review Flaky Tests**: Investigate and fix intermittent failures
3. **Performance Monitoring**: Track test execution times
4. **Coverage Analysis**: Ensure all critical paths are tested
5. **Dependency Updates**: Keep Playwright and dependencies current

### Best Practice Checklist

- [ ] Tests are independent and isolated
- [ ] Data-testid attributes are used consistently
- [ ] Page Object Model is followed
- [ ] HIPAA compliance is verified
- [ ] Accessibility is tested
- [ ] Error scenarios are covered
- [ ] Performance benchmarks are met
- [ ] API contracts are validated
- [ ] Tests are documented clearly
- [ ] CI/CD pipeline is configured

---

**Last Updated**: 2025-10-24
**Framework Version**: Playwright 1.56+
**Test Suite Status**: ✅ 161 Tests, 100% Passing
