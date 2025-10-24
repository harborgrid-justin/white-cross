# Cypress to Playwright Migration Guide

## Overview

This guide helps migrate the 248 Cypress tests to Playwright for the White Cross Healthcare Management System.

## Quick Reference

### Import Changes

**Cypress:**
```typescript
/// <reference types="cypress" />
```

**Playwright:**
```typescript
import { test, expect } from '@playwright/test';
// Or use custom fixtures:
import { test, expect } from '../setup/base-test';
```

### Basic Commands

| Cypress | Playwright |
|---------|-----------|
| `cy.visit('/path')` | `await page.goto('/path')` |
| `cy.get('[data-cy=button]')` | `page.locator('[data-cy=button]')` |
| `cy.contains('text')` | `page.locator('text=text')` or `page.getByText('text')` |
| `cy.get('.class').click()` | `await page.locator('.class').click()` |
| `cy.get('input').type('text')` | `await page.locator('input').fill('text')` |
| `cy.get('input').clear()` | `await page.locator('input').clear()` |
| `cy.get('select').select('value')` | `await page.selectOption('select', 'value')` |
| `cy.get('[type="checkbox"]').check()` | `await page.locator('[type="checkbox"]').check()` |

### Assertions

| Cypress | Playwright |
|---------|-----------|
| `.should('be.visible')` | `await expect(locator).toBeVisible()` |
| `.should('not.be.visible')` | `await expect(locator).toBeHidden()` |
| `.should('exist')` | `await expect(locator).toHaveCount(>0)` |
| `.should('have.text', 'text')` | `await expect(locator).toHaveText('text')` |
| `.should('contain.text', 'text')` | `await expect(locator).toContainText('text')` |
| `.should('have.value', 'value')` | `await expect(locator).toHaveValue('value')` |
| `.should('be.checked')` | `await expect(locator).toBeChecked()` |
| `.should('be.disabled')` | `await expect(locator).toBeDisabled()` |
| `.should('have.attr', 'name')` | `await expect(locator).toHaveAttribute('name')` |
| `cy.url().should('include', '/path')` | `await expect(page).toHaveURL(/path/)` |

### Waiting and Timeouts

| Cypress | Playwright |
|---------|-----------|
| `cy.wait(1000)` | `await page.waitForTimeout(1000)` |
| `cy.wait('@alias')` | `await page.waitForResponse('**/api/path')` |
| `cy.get('.el').should('be.visible')` | `await page.locator('.el').waitFor({ state: 'visible' })` |
| `cy.waitForUrl('/path')` | `await page.waitForURL('/path')` |

### API Mocking

**Cypress:**
```typescript
cy.intercept('GET', '/api/users', { fixture: 'users' }).as('getUsers');
cy.wait('@getUsers');
```

**Playwright:**
```typescript
await page.route('**/api/users', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(mockUsers)
  });
});
```

### Custom Commands

| Cypress Custom Command | Playwright Helper |
|----------------------|-------------------|
| `cy.login('nurse')` | `await login(page, 'nurse')` |
| `cy.logout()` | `await logout(page)` |
| `cy.typeIntoField('email', 'test@test.com')` | `await typeIntoField(page, 'email', 'test@test.com')` |
| `cy.clickButton('submit')` | `await clickButton(page, 'submit')` |
| `cy.waitForHealthcareData()` | `await setupHealthcareMocks(page)` |

## Migration Steps

### Step 1: Update Test File Structure

**Before (Cypress):**
```typescript
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully', () => {
    cy.get('[data-cy=email-input]').type('nurse@school.edu');
    cy.get('[data-cy=password-input]').type('NursePassword123!');
    cy.get('[data-cy=login-button]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

**After (Playwright):**
```typescript
import { test, expect } from '../setup/base-test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login successfully', async ({ page }) => {
    await page.locator('[data-cy=email-input]').fill('nurse@school.edu');
    await page.locator('[data-cy=password-input]').fill('NursePassword123!');
    await page.locator('[data-cy=login-button]').click();
    await expect(page).toHaveURL(/dashboard/);
  });
});
```

### Step 2: Use Custom Fixtures for Authentication

**Before (Cypress):**
```typescript
describe('Student Management', () => {
  beforeEach(() => {
    cy.login('nurse');
    cy.visit('/students');
  });

  it('should display students list', () => {
    cy.get('[data-cy=students-table]').should('be.visible');
  });
});
```

**After (Playwright):**
```typescript
import { test, expect } from '../setup/base-test';

test.describe('Student Management', () => {
  test('should display students list', async ({ nursePage }) => {
    await nursePage.goto('/students');
    await expect(nursePage.locator('[data-cy=students-table]')).toBeVisible();
  });
});
```

### Step 3: Update API Mocking

**Before (Cypress):**
```typescript
cy.intercept('GET', '/api/students', { fixture: 'students' }).as('getStudents');
cy.wait('@getStudents');
```

**After (Playwright):**
```typescript
import { MOCK_STUDENTS } from '../support/fixtures';

await page.route('**/api/students', async (route) => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({
      success: true,
      data: { students: MOCK_STUDENTS }
    })
  });
});
```

### Step 4: Update Assertions

**Before (Cypress):**
```typescript
cy.get('[data-cy=error-message]').should('be.visible');
cy.get('[data-cy=error-message]').should('contain.text', 'Invalid credentials');
cy.url().should('include', '/login');
```

**After (Playwright):**
```typescript
await expect(page.locator('[data-cy=error-message]')).toBeVisible();
await expect(page.locator('[data-cy=error-message]')).toContainText('Invalid credentials');
await expect(page).toHaveURL(/login/);
```

## Common Patterns

### Pattern 1: Form Submission

**Cypress:**
```typescript
cy.get('[data-cy=first-name]').type('John');
cy.get('[data-cy=last-name]').type('Doe');
cy.get('[data-cy=submit-button]').click();
cy.get('[data-cy=success-message]').should('be.visible');
```

**Playwright:**
```typescript
await page.locator('[data-cy=first-name]').fill('John');
await page.locator('[data-cy=last-name]').fill('Doe');
await page.locator('[data-cy=submit-button]').click();
await expect(page.locator('[data-cy=success-message]')).toBeVisible();
```

### Pattern 2: Navigation and URL Checks

**Cypress:**
```typescript
cy.visit('/students');
cy.url().should('include', '/students');
cy.get('[data-cy=student-link]').click();
cy.url().should('match', /\/students\/\d+/);
```

**Playwright:**
```typescript
await page.goto('/students');
await expect(page).toHaveURL(/students/);
await page.locator('[data-cy=student-link]').click();
await expect(page).toHaveURL(/\/students\/\d+/);
```

### Pattern 3: Conditional Logic

**Cypress:**
```typescript
cy.get('body').then($body => {
  if ($body.find('[data-cy=modal]').length > 0) {
    cy.get('[data-cy=close-modal]').click();
  }
});
```

**Playwright:**
```typescript
const modal = page.locator('[data-cy=modal]');
if (await modal.isVisible()) {
  await page.locator('[data-cy=close-modal]').click();
}
```

### Pattern 4: Table Interactions

**Cypress:**
```typescript
cy.get('table tbody tr').should('have.length', 5);
cy.get('table tbody tr').first().click();
cy.get('table').contains('John Doe').should('be.visible');
```

**Playwright:**
```typescript
await expect(page.locator('table tbody tr')).toHaveCount(5);
await page.locator('table tbody tr').first().click();
await expect(page.locator('table', { hasText: 'John Doe' })).toBeVisible();
```

## Test Organization

### File Naming

- Cypress: `*.cy.ts` → Playwright: `*.spec.ts`
- Location: `cypress/e2e/` → `tests/e2e/`

### Test Structure

**Cypress:**
```typescript
describe('Suite', () => {
  context('Context', () => {
    it('test case', () => {});
  });
});
```

**Playwright:**
```typescript
test.describe('Suite', () => {
  test.describe('Context', () => {
    test('test case', async ({ page }) => {});
  });
});
```

## Best Practices

1. **Use Auto-waiting**: Playwright auto-waits for elements, no need for manual waits
2. **Use Locators**: Always use `page.locator()` instead of direct selectors
3. **Async/Await**: All Playwright actions are async, use `await`
4. **Fixtures**: Use custom fixtures for common setup (authentication, etc.)
5. **Page Objects**: Consider creating page objects for complex pages
6. **Selectors**: Prefer `data-cy` attributes, then semantic selectors
7. **Assertions**: Use `expect()` from `@playwright/test`
8. **Parallel Tests**: Playwright runs tests in parallel by default

## Troubleshooting

### Issue: "Element not found"
- **Solution**: Add `await` before locator actions
- **Solution**: Check if element is in shadow DOM
- **Solution**: Wait for element: `await locator.waitFor()`

### Issue: "Timeout waiting for element"
- **Solution**: Increase timeout: `await locator.click({ timeout: 30000 })`
- **Solution**: Check if element is behind another element
- **Solution**: Use `force: true` option if needed

### Issue: "Tests running too fast"
- **Solution**: This is expected! Playwright is faster than Cypress
- **Solution**: Remove unnecessary `wait()` calls

### Issue: "Authentication not working"
- **Solution**: Use custom fixtures from `base-test.ts`
- **Solution**: Ensure mocks are set up with `setupAuthMocks(page)`

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Migration from Cypress](https://playwright.dev/docs/test-runners#cypress)

## Support Files Reference

- `tests/setup/base-test.ts` - Custom test fixtures and setup
- `tests/support/auth-helpers.ts` - Authentication utilities
- `tests/support/test-helpers.ts` - Common test helpers
- `tests/support/fixtures.ts` - Test data and mocks
- `tests/support/custom-matchers.ts` - Custom assertions
- `tests/utils/cypress-to-playwright-converter.ts` - Migration utilities

## Example Migration

See `tests/e2e/example.spec.ts` for a complete example of a migrated test.
