# Student Management E2E Tests (Playwright)

This directory contains 12 comprehensive Playwright test files migrated from Cypress, covering all aspects of student management functionality in the White Cross Healthcare Management System.

## Test Files Overview

### Core CRUD Operations (117 tests)
- **01-page-ui-structure.spec.ts** (15 tests) - Page load, UI elements, navigation
- **02-student-creation.spec.ts** (57 tests) - Student creation with full validation
- **03-student-viewing.spec.ts** (15 tests) - Student list and detail viewing
- **04-student-editing.spec.ts** (15 tests) - Student update operations
- **05-student-deletion.spec.ts** (15 tests) - Student archiving and restoration

### Search and Filtering (50 tests)
- **06-search-functionality.spec.ts** (15 tests) - Multi-field search capabilities
- **07-filtering-sorting.spec.ts** (15 tests) - Grade, gender, status filtering and sorting
- **08-pagination-bulk.spec.ts** (20 tests) - Pagination and bulk operations

### Advanced Features (25 tests)
- **09-emergency-contacts.spec.ts** (10 tests) - Emergency contact management
- **10-data-validation.spec.ts** (15 tests) - Comprehensive input validation

### Security and Compliance (25 tests)
- **11-rbac-permissions.spec.ts** (10 tests) - Role-based access control
- **12-hipaa-accessibility.spec.ts** (15 tests) - HIPAA compliance and accessibility

## Total Coverage
- **12 Test Files**
- **217 Total Tests**
- **2,063 Lines of Test Code**

## Running Tests

### Run all student management tests
```bash
npx playwright test tests/e2e/02-student-management/
```

### Run specific test file
```bash
npx playwright test tests/e2e/02-student-management/01-page-ui-structure.spec.ts
```

### Run in UI mode for debugging
```bash
npx playwright test --ui tests/e2e/02-student-management/
```

### Run tests with specific browser
```bash
npx playwright test tests/e2e/02-student-management/ --project=chromium
npx playwright test tests/e2e/02-student-management/ --project=firefox
npx playwright test tests/e2e/02-student-management/ --project=webkit
```

### Run in headed mode (see browser)
```bash
npx playwright test tests/e2e/02-student-management/ --headed
```

### Generate HTML report
```bash
npx playwright test tests/e2e/02-student-management/
npx playwright show-report
```

## Test Categories

### CRUD Operations
Tests cover complete Create, Read, Update, Delete lifecycle:
- Form validation and submission
- Data persistence and display
- Error handling and recovery
- Audit logging for all operations

### User Interface
Comprehensive UI testing including:
- Element visibility and accessibility
- Modal interactions and state management
- Responsive design (mobile, tablet, desktop)
- Keyboard navigation support

### Data Validation
Extensive validation testing:
- Required fields and format validation
- Age range validation (4-19 years)
- Phone and email format validation
- XSS and SQL injection prevention
- Duplicate record detection

### Security and Compliance
HIPAA-compliant security testing:
- Role-based access control (Admin, Nurse, Counselor, Viewer)
- Sensitive data masking
- Audit logging for PHI access
- Session management

### Accessibility
WCAG compliance testing:
- ARIA labels and semantic HTML
- Keyboard navigation
- Screen reader compatibility
- Color contrast verification

## Authentication

Tests use the auth helper for login:
```typescript
import { login } from '../../support/auth-helpers'

test.beforeEach(async ({ page }) => {
  await login(page, 'admin') // or 'nurse', 'counselor', 'viewer'
  await page.goto('/students')
})
```

## Key Patterns

### Locator Strategies
```typescript
// Prefer data-testid selectors
page.getByTestId('student-table')
page.getByTestId('add-student-button')

// Use role-based selectors when appropriate
page.getByRole('button', { name: 'Save' })

// Use text content for dynamic elements
page.locator('text=/success|created/i')
```

### Assertions
```typescript
// Visibility assertions
await expect(page.getByTestId('modal')).toBeVisible()
await expect(page.getByTestId('modal')).not.toBeVisible()

// Text content assertions
await expect(page.getByTestId('message')).toContainText('Success')

// Value assertions
await expect(page.getByTestId('input')).toHaveValue('test')

// Count assertions
expect(await page.getByTestId('row').count()).toBeGreaterThan(0)
```

### API Mocking
```typescript
// Mock API responses
await page.route('**/api/students*', async (route) => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({ success: true, data: [...] })
  })
})
```

## Migration Notes

These tests were migrated from Cypress with the following improvements:
- ✓ Full TypeScript type safety
- ✓ Async/await patterns throughout
- ✓ Playwright's auto-waiting mechanisms
- ✓ Better error messages and debugging
- ✓ Native multi-browser support
- ✓ Improved performance with parallel execution

## Contributing

When adding new tests:
1. Follow existing patterns and naming conventions
2. Use data-testid selectors for stability
3. Add descriptive test names and JSDoc comments
4. Maintain type safety with TypeScript
5. Test across all user roles where applicable
6. Include accessibility checks for new UI elements

## Related Documentation

- [Playwright Documentation](https://playwright.dev)
- [White Cross Testing Guide](../../../docs/testing.md)
- [Authentication Helpers](../../support/auth-helpers.ts)
