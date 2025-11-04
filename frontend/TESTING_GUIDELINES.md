# Testing Guidelines for White Cross Healthcare Platform

**Version:** 1.0.0
**Last Updated:** 2025-11-04
**Status:** Active

## Table of Contents

1. [Overview](#overview)
2. [Testing Pyramid](#testing-pyramid)
3. [Testing Best Practices](#testing-best-practices)
4. [Test Organization](#test-organization)
5. [Writing Tests](#writing-tests)
6. [Test Data Management](#test-data-management)
7. [CI/CD Integration](#cicd-integration)
8. [Coverage Requirements](#coverage-requirements)

---

## Overview

This document outlines testing standards and best practices for the White Cross Healthcare Platform frontend. All developers must follow these guidelines to ensure consistent, reliable, and maintainable test coverage.

### Testing Stack

- **Unit Tests:** Jest + React Testing Library
- **Integration Tests:** Jest + MSW (Mock Service Worker)
- **E2E Tests:** Playwright (primary) + Cypress (secondary)
- **Accessibility Tests:** jest-axe
- **Visual Regression:** Playwright screenshots
- **Coverage:** Jest coverage reports

---

## Testing Pyramid

Follow the testing pyramid for optimal coverage and speed:

```
        /\
       /E2E\         10% - Critical user journeys
      /------\
     /  INT   \      20% - API flows, state management
    /----------\
   /    UNIT    \    70% - Utilities, hooks, components
  /--------------\
```

### Distribution

- **Unit Tests (70%):** Fast, isolated tests for utilities, hooks, and components
- **Integration Tests (20%):** Medium-speed tests for API integration and workflows
- **E2E Tests (10%):** Slow, expensive tests for critical user journeys

---

## Testing Best Practices

### Item 146: Tests are Deterministic (No Flaky Tests)

✅ **DO:**
- Use `waitFor()` for async operations
- Mock external dependencies (APIs, timers, random values)
- Use fixed test data from factories
- Reset state between tests
- Use stable selectors (getByRole, getByLabelText)

❌ **DON'T:**
- Use arbitrary `setTimeout()` delays
- Depend on network requests
- Rely on test execution order
- Use unstable selectors (getByClassName)
- Share state between tests

**Example:**

```typescript
// ✅ Good: Deterministic with waitFor
test('should load user data', async () => {
  render(<UserProfile userId="123" />);

  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

// ❌ Bad: Flaky with arbitrary timeout
test('should load user data', async () => {
  render(<UserProfile userId="123" />);
  await new Promise(resolve => setTimeout(resolve, 1000));
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Item 147: Test Data Factories/Fixtures Used

✅ **DO:**
- Use test factories for consistent data
- Create reusable test data builders
- Use faker.js for synthetic data
- Keep test data in separate files
- Document PHI compliance in test data

❌ **DON'T:**
- Hardcode test data in tests
- Use real patient data
- Duplicate test data across files
- Create inconsistent data structures

**Example:**

```typescript
// ✅ Good: Use factory
import { createTestStudent } from '@/tests/utils/test-factories';

test('should display student info', () => {
  const student = createTestStudent({ firstName: 'John', grade: '5th' });
  render(<StudentCard student={student} />);
  expect(screen.getByText('John')).toBeInTheDocument();
});

// ❌ Bad: Hardcoded data
test('should display student info', () => {
  const student = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    // ... many more fields
  };
  render(<StudentCard student={student} />);
});
```

### Item 148: Tests Isolated and Independent

✅ **DO:**
- Clean up after each test (`afterEach`)
- Reset mocks between tests
- Use fresh render for each test
- Avoid shared state
- Run tests in any order

❌ **DON'T:**
- Rely on test execution order
- Share state between tests
- Leak global state
- Skip cleanup

**Example:**

```typescript
// ✅ Good: Isolated tests
describe('Counter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start at 0', () => {
    render(<Counter />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should increment', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole('button', { name: /increment/i }));
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});

// ❌ Bad: Tests depend on each other
describe('Counter', () => {
  let counter: number;

  it('should start at 0', () => {
    counter = 0;
    expect(counter).toBe(0);
  });

  it('should increment', () => {
    counter++; // Depends on previous test
    expect(counter).toBe(1);
  });
});
```

### Item 149: Proper Test Descriptions (Given-When-Then)

✅ **DO:**
- Use descriptive test names
- Follow Given-When-Then pattern
- Describe behavior, not implementation
- Use clear assertion messages
- Group related tests with `describe()`

❌ **DON'T:**
- Use vague test names
- Test implementation details
- Write unclear assertions
- Mix unrelated tests

**Example:**

```typescript
// ✅ Good: Clear description with Given-When-Then
describe('LoginForm', () => {
  describe('when user submits valid credentials', () => {
    it('should redirect to dashboard', async () => {
      // Given: User is on login page
      const user = userEvent.setup();
      render(<LoginForm />);

      // When: User enters valid credentials and submits
      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /login/i }));

      // Then: User is redirected to dashboard
      await waitFor(() => {
        expect(window.location.pathname).toBe('/dashboard');
      });
    });
  });

  describe('when user submits invalid credentials', () => {
    it('should show error message', async () => {
      // Given, When, Then...
    });
  });
});

// ❌ Bad: Unclear description
test('login works', () => {
  // What scenario? What's expected?
});

test('test1', () => {
  // No context at all
});
```

### Item 150: CI/CD Pipeline Includes All Test Suites

✅ **DO:**
- Run all test suites in CI/CD
- Fail builds on test failures
- Generate coverage reports
- Run tests in parallel when possible
- Cache dependencies
- Run tests on all PRs

❌ **DON'T:**
- Skip tests in CI/CD
- Ignore test failures
- Run tests only locally
- Disable failing tests

**CI/CD Configuration Example:**

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3

      - name: Fail if coverage below threshold
        run: |
          if [ $(jq '.total.lines.pct' coverage/coverage-summary.json) -lt 80 ]; then
            echo "Coverage below 80%"
            exit 1
          fi
```

---

## Test Organization

### File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.stories.tsx
│   ├── hooks/
│   │   ├── useAuth.tsx
│   │   └── useAuth.test.tsx
│   ├── lib/
│   │   └── utils/
│   │       ├── format.ts
│   │       └── format.test.ts
├── tests/
│   ├── e2e/
│   │   ├── login.spec.ts
│   │   └── navigation.spec.ts
│   ├── integration/
│   │   └── auth-flow.integration.test.tsx
│   ├── mocks/
│   │   ├── handlers.ts
│   │   └── server.ts
│   └── utils/
│       ├── test-factories.ts
│       ├── test-utils.tsx
│       └── custom-matchers.ts
├── jest.config.ts
└── setupTests.ts
```

### Naming Conventions

- **Unit tests:** `ComponentName.test.tsx` or `utilityName.test.ts`
- **Integration tests:** `featureName.integration.test.tsx`
- **E2E tests:** `userFlow.spec.ts` (Playwright) or `userFlow.cy.ts` (Cypress)
- **Test suites:** `describe('ComponentName', () => {})`
- **Test cases:** `it('should do something when condition', () => {})`

---

## Writing Tests

### Query Priority (React Testing Library)

Use queries in this order:

1. **getByRole** - Most accessible
2. **getByLabelText** - Forms
3. **getByPlaceholderText** - If no label
4. **getByText** - Non-interactive
5. **getByDisplayValue** - Form values
6. **getByAltText** - Images
7. **getByTitle** - Last resort
8. **getByTestId** - Only when necessary

### User Interactions

Always use `@testing-library/user-event` for realistic interactions:

```typescript
import userEvent from '@testing-library/user-event';

test('should handle click', async () => {
  const user = userEvent.setup();
  render(<Button onClick={handleClick}>Click</Button>);

  await user.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});
```

### Async Testing

Use `waitFor` for async operations:

```typescript
// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});

// Wait for element to disappear
await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

// Find queries (built-in async)
const element = await screen.findByText(/async content/i);
```

### Accessibility Testing

Include accessibility tests for all components:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Test Data Management

### Test Factories

Use test factories from `tests/utils/test-factories.ts`:

```typescript
import {
  createTestUser,
  createTestStudent,
  createTestMedication,
  createNurse,
  createAdmin,
} from '@/tests/utils/test-factories';

// Create single entity
const user = createTestUser({ role: 'nurse' });

// Create multiple entities
const students = createTestStudents(5, (index) => ({
  firstName: `Student ${index}`,
}));

// Use specialized factories
const nurse = createNurse({ email: 'nurse@example.com' });
const admin = createAdmin({ permissions: ['*'] });
```

### Mock API with MSW

Use Mock Service Worker for API mocking:

```typescript
import { server } from '@/tests/mocks/server';
import { http, HttpResponse } from 'msw';

// Override handler for specific test
test('should handle API error', async () => {
  server.use(
    http.get('/api/v1/students', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<StudentsList />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

---

## CI/CD Integration

### GitHub Actions

All tests run automatically on:
- Push to any branch
- Pull request creation
- Pull request updates

### Pre-commit Hooks

Use Husky for pre-commit test checks:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  }
}
```

### Coverage Reports

Coverage reports are:
- Generated on every test run
- Uploaded to Codecov
- Required to meet 80% threshold
- Displayed in PR comments

---

## Coverage Requirements

### Global Thresholds

- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%
- **Statements:** 80%

### Critical Code Thresholds

- **Security utilities:** 95%
- **Data utilities:** 90%
- **Hooks:** 85%

### Coverage Commands

```bash
# Run tests with coverage
npm test -- --coverage

# View coverage report
open coverage/lcov-report/index.html

# Check coverage threshold
npm test -- --coverage --coverageThreshold
```

---

## Quick Reference

### Common Test Patterns

```typescript
// Component test
test('should render component', () => {
  render(<Component />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

// User interaction
test('should handle click', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(<Button onClick={onClick}>Click</Button>);
  await user.click(screen.getByRole('button'));
  expect(onClick).toHaveBeenCalled();
});

// Async data loading
test('should load data', async () => {
  render(<DataComponent />);
  await waitFor(() => {
    expect(screen.getByText(/loaded/i)).toBeInTheDocument();
  });
});

// Form validation
test('should validate form', async () => {
  const user = userEvent.setup();
  render(<Form />);
  await user.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByText(/required/i)).toBeInTheDocument();
});

// Accessibility
test('should be accessible', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Resources

- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [jest-axe Documentation](https://github.com/nickcolley/jest-axe)

---

## Contact

For questions about testing, contact the QA team or post in #testing Slack channel.

**Last Updated:** 2025-11-04
**Maintained by:** Frontend Team
