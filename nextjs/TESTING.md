# Testing Infrastructure - White Cross Next.js

## Table of Contents
- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Testing Pyramid](#testing-pyramid)
- [Running Tests](#running-tests)
- [Test Patterns](#test-patterns)
- [Code Coverage](#code-coverage)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## Overview

This Next.js application uses a comprehensive testing strategy with Jest for unit/integration tests and Playwright for E2E tests. All tests use **synthetic data only** - no real PHI data is ever used in tests per HIPAA compliance requirements.

### Testing Goals
- ✅ **95%+ code coverage** for critical code paths
- ✅ **Zero flaky tests** - all tests must be deterministic
- ✅ **Fast execution** - unit tests < 10s, E2E < 5 minutes
- ✅ **Accessibility testing** for all interactive components
- ✅ **HIPAA compliance** - audit logging verification

## Testing Stack

### Unit & Integration Testing
- **Framework**: Jest 29
- **React Testing**: @testing-library/react 16
- **Test Environment**: jsdom
- **Mocking**: MSW (Mock Service Worker) 2.0
- **Coverage**: v8

### E2E Testing
- **Framework**: Playwright 1.56
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Parallel Execution**: Enabled
- **Screenshots**: On failure
- **Trace**: On first retry

### Installed Dependencies
```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "jest-axe": "^10.0.0",
    "@testing-library/react": "16.3.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@playwright/test": "^1.56.1",
    "msw": "^2.11.6",
    "@swc/jest": "^0.2.39"
  }
}
```

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
- Custom hooks
- Redux slices
- API modules

### Integration Tests (20%)
- Component interactions
- Data flow
- TanStack Query hooks
- Form submissions
- API integrations

### E2E Tests (10%)
- Login/authentication flow
- Student management
- Medication administration
- Appointment scheduling
- Critical user paths

## Running Tests

### All Tests
```bash
npm test                 # Run all unit/integration tests
npm run test:watch       # Watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests
```

### Specific Test Suites
```bash
# Run specific test file
npx jest src/components/Button.test.tsx

# Run tests matching pattern
npx jest --testNamePattern="renders correctly"

# Run tests for changed files
npx jest --onlyChanged

# E2E specific test
npx playwright test tests/e2e/01-auth/login.spec.ts
```

### Coverage Reports
```bash
npm run test:coverage                # Generate coverage
open coverage/lcov-report/index.html # View in browser
```

### E2E Test Options
```bash
npm run test:e2e           # Headless mode
npm run test:e2e:headed    # Headed mode
npx playwright test --ui   # UI mode with time travel
npx playwright test --debug # Debug mode
npx playwright show-report # View test report
```

## Test Patterns

### 1. Client Component Testing

```typescript
/**
 * Example: Testing a Client Component with user interactions
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StudentCard } from '../StudentCard';

describe('StudentCard', () => {
  const mockStudent = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    grade: '10',
  };

  it('renders student information', () => {
    render(<StudentCard student={mockStudent} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Grade 10')).toBeInTheDocument();
  });

  it('handles edit action', async () => {
    const onEdit = jest.fn();
    const user = userEvent.setup();

    render(<StudentCard student={mockStudent} onEdit={onEdit} />);

    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledWith(mockStudent.id);
  });
});
```

### 2. API Route Testing

```typescript
/**
 * Example: Testing Next.js API Routes
 */
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';

describe('Students API Route', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('returns students list', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        success: true,
        data: { students: [] },
      }),
      headers: new Headers(),
    });

    const request = new NextRequest('http://localhost:3000/api/proxy/students');
    const response = await GET(request, { params: { path: ['students'] } });

    expect(response.status).toBe(200);
  });
});
```

### 3. TanStack Query Hooks Testing

```typescript
/**
 * Example: Testing React Query hooks
 */
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStudents } from '../useStudents';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useStudents', () => {
  it('fetches students successfully', async () => {
    const { result } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.students).toBeDefined();
  });
});
```

### 4. MSW API Mocking

```typescript
/**
 * Mock API handlers for consistent testing
 */
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/v1/students', ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';

    return HttpResponse.json({
      success: true,
      data: {
        students: [
          { id: '1', firstName: 'John', lastName: 'Doe' },
        ],
        pagination: { page: parseInt(page), total: 1 },
      },
    });
  }),
];
```

### 5. E2E Testing with Playwright

```typescript
/**
 * Example: E2E test with authentication and navigation
 */
import { test, expect } from '@playwright/test';

test.describe('Student Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'nurse@school.edu');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('creates new student', async ({ page }) => {
    await page.goto('/students/new');

    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.selectOption('select[name="grade"]', '10');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/students\/\w+/);
    await expect(page.locator('h1')).toContainText('John Doe');
  });
});
```

### 6. Accessibility Testing

```typescript
/**
 * Example: Testing with jest-axe for a11y violations
 */
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('StudentForm Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<StudentForm />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
```

## Code Coverage

### Current Coverage Thresholds
```json
{
  "coverageThreshold": {
    "global": {
      "branches": 90,
      "functions": 95,
      "lines": 95,
      "statements": 95
    }
  }
}
```

### Coverage Exclusions
- Type definition files (`*.d.ts`)
- Storybook files (`*.stories.tsx`)
- Test files (`*.test.tsx`, `__tests__/`)
- Mock data (`__mocks__/`)
- Layout files (`layout.tsx`, `providers.tsx`)

### Viewing Coverage
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

### Coverage by Module (Target)
| Module | Lines | Functions | Branches | Statements |
|--------|-------|-----------|----------|------------|
| Components | 95%+ | 95%+ | 90%+ | 95%+ |
| Hooks | 95%+ | 95%+ | 90%+ | 95%+ |
| Services | 95%+ | 95%+ | 90%+ | 95%+ |
| Utils | 95%+ | 95%+ | 90%+ | 95%+ |
| Pages | 80%+ | 80%+ | 75%+ | 80%+ |

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Pre-commit Hooks (Optional)

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm test",
      "pre-push": "npm run test:coverage"
    }
  }
}
```

## Best Practices

### DO ✅

1. **Test User Behavior, Not Implementation**
   ```typescript
   // Good
   await user.click(screen.getByRole('button', { name: /submit/i }));

   // Avoid
   wrapper.find('button').simulate('click');
   ```

2. **Use Accessible Queries**
   ```typescript
   // Priority order
   getByRole()
   getByLabelText()
   getByPlaceholderText()
   getByText()
   getByDisplayValue()
   getByAltText()
   getByTitle()
   getByTestId() // Last resort
   ```

3. **Test Error States**
   ```typescript
   it('displays error message on API failure', async () => {
     server.use(
       http.get('/api/v1/students', () => {
         return HttpResponse.error();
       })
     );

     render(<StudentsPage />);

     await waitFor(() => {
       expect(screen.getByText(/error loading/i)).toBeInTheDocument();
     });
   });
   ```

4. **Test Loading States**
   ```typescript
   it('shows loading spinner while fetching', () => {
     (apiClient.get as jest.Mock).mockImplementation(
       () => new Promise(() => {}) // Never resolves
     );

     render(<StudentsPage />);

     expect(screen.getByText(/loading/i)).toBeInTheDocument();
   });
   ```

5. **Use MSW for API Mocking**
   - Intercepts network requests at the network level
   - More realistic than mocking fetch/axios
   - Shared between tests and Storybook

6. **Test Accessibility**
   - Use jest-axe for automated a11y testing
   - Test keyboard navigation
   - Verify ARIA labels and roles

### DON'T ❌

1. **Don't Test Implementation Details**
   ```typescript
   // Bad - tests internal state
   expect(component.state.isLoading).toBe(false);

   // Good - tests user-visible behavior
   expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
   ```

2. **Don't Use Snapshots for Everything**
   - Snapshots are brittle and hard to maintain
   - Use for error messages, data structures, not entire UI

3. **Don't Create Flaky Tests**
   - Always use `waitFor` for async operations
   - Avoid hardcoded timeouts
   - Use MSW instead of real network requests

4. **Don't Use Real PHI Data**
   - HIPAA violation
   - Use synthetic test fixtures only
   - Faker.js for generating test data

5. **Don't Over-Mock**
   ```typescript
   // Bad - mocking too much
   jest.mock('./StudentCard');
   jest.mock('./StudentList');
   jest.mock('./utils');

   // Good - test real interactions
   render(<StudentPage />);
   ```

## HIPAA Compliance in Tests

### PHI Data Rules
- ❌ **NEVER** use real patient data in tests
- ✅ Use `@faker-js/faker` for synthetic data
- ✅ Mock audit logging calls
- ✅ Verify audit logs are created for PHI access

### Example: Audit Logging Test
```typescript
import { auditService } from '@/services/audit/AuditService';

jest.mock('@/services/audit/AuditService');

it('logs PHI access', async () => {
  render(<StudentHealthRecords studentId="1" />);

  await waitFor(() => {
    expect(auditService.logAccess).toHaveBeenCalledWith({
      action: 'view',
      resource: 'health_record',
      resourceId: '1',
      userId: expect.any(String),
    });
  });
});
```

## Test Organization

### File Structure
```
src/
  app/
    students/
      page.tsx
      __tests__/
        page.test.tsx
    api/
      proxy/
        [...path]/
          route.ts
          __tests__/
            route.test.ts
  components/
    Button/
      Button.tsx
      Button.test.tsx
      Button.stories.tsx
  hooks/
    useStudents/
      useStudents.ts
      __tests__/
        useStudents.test.ts

tests/
  e2e/
    01-auth/
      login.spec.ts
    02-students/
      student-management.spec.ts
  fixtures/
    students.json
  mocks/
    handlers.ts
    server.ts
  utils/
    test-utils.tsx
    custom-matchers.ts
```

### Naming Conventions
- Unit tests: `ComponentName.test.tsx`
- Integration tests: `featureName.integration.test.tsx`
- E2E tests: `userFlow.spec.ts`
- Test suites: `describe('ComponentName', () => {})`
- Test cases: `it('should do something', () => {})`

## Debugging Tests

### Jest Debug Mode
```bash
# Run single test in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand Component.test.tsx

# Open chrome://inspect in Chrome
```

### Playwright Debug Mode
```bash
# Debug mode with browser visible
npx playwright test --debug

# UI mode for time travel debugging
npx playwright test --ui

# Pause on failure
npx playwright test --headed --slowMo=1000
```

### Common Issues

1. **Test times out**
   - Increase timeout: `jest.setTimeout(10000)`
   - Use `waitFor` for async operations
   - Check for unresolved promises

2. **Can't find element**
   - Use `screen.debug()` to see DOM
   - Check query priority (role > label > text > testId)
   - Verify element is rendered conditionally

3. **Flaky test**
   - Add proper `waitFor` conditions
   - Avoid hardcoded delays
   - Use MSW for consistent API responses

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [jest-axe for Accessibility](https://github.com/nickcolley/jest-axe)

## Support

For questions or issues with testing:
1. Check this documentation
2. Review existing tests for examples
3. Consult team testing standards
4. Create GitHub issue if bug found

---

**Last Updated**: 2025-10-26
**Maintained By**: Engineering Team
