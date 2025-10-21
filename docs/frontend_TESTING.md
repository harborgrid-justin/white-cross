# White Cross Testing Guide

Comprehensive testing documentation for the White Cross Healthcare Platform frontend application.

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Test Configuration](#test-configuration)
3. [Running Tests](#running-tests)
4. [Test Coverage](#test-coverage)
5. [Writing Tests](#writing-tests)
6. [Test Utilities](#test-utilities)
7. [E2E Testing with Cypress](#e2e-testing-with-cypress)
8. [CI/CD Integration](#cicd-integration)
9. [Best Practices](#best-practices)

## Testing Overview

### Testing Stack

- **Unit/Integration Tests**: Vitest + React Testing Library
- **E2E Tests**: Cypress
- **Coverage**: Vitest Coverage (v8)
- **Assertions**: Vitest (Jest-compatible)
- **Mocking**: Vitest mocking utilities

### Test Organization

```
frontend/
├── src/
│   ├── __tests__/
│   │   ├── setup.ts                    # Global test setup
│   │   ├── utils/
│   │   │   └── testHelpers.ts          # Test utility functions
│   │   ├── integration/                # Integration tests
│   │   └── performance/                # Performance tests
│   ├── services/
│   │   ├── security/__tests__/         # Security service tests
│   │   ├── audit/__tests__/            # Audit service tests
│   │   ├── resilience/__tests__/       # Resilience pattern tests
│   │   └── cache/__tests__/            # Cache management tests
│   └── components/
│       └── **/__tests__/               # Component tests
└── cypress/
    ├── e2e/                            # E2E test specs
    │   ├── security/                   # Security E2E tests
    │   ├── audit/                      # Audit E2E tests
    │   └── resilience/                 # Resilience E2E tests
    ├── support/                        # Cypress support files
    └── fixtures/                       # Test data fixtures
```

### Coverage Requirements

- **Lines**: 95%
- **Functions**: 95%
- **Branches**: 90%
- **Statements**: 95%

## Test Configuration

### Vitest Configuration

Configuration file: `vitest.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      lines: 95,
      functions: 95,
      branches: 90,
      statements: 95,
    },
    testTimeout: 10000,
    isolate: true,
    threads: true,
  },
});
```

### Cypress Configuration

Configuration file: `cypress.config.ts`

Key settings:
- Base URL: `http://localhost:5173`
- Default timeout: 10s
- Request timeout: 30s
- Video recording: Enabled
- Screenshot on failure: Enabled
- Retry configuration: 2 retries in CI, 0 in dev

## Running Tests

### Unit and Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/services/security/__tests__/SecureTokenManager.test.ts

# Run tests matching pattern
npm test -- --grep "CircuitBreaker"
```

### E2E Tests with Cypress

```bash
# Open Cypress UI
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run

# Run specific spec
npm run cypress:run -- --spec "cypress/e2e/security/secure-authentication.cy.ts"

# Run in specific browser
npm run cypress:run:chrome
npm run cypress:run:edge
```

### Quick Test Commands

```bash
# All tests (unit + E2E)
npm run test:all

# Fast unit tests only
npm run test:unit

# Security tests only
npm test -- src/services/security

# Audit tests only
npm test -- src/services/audit
```

## Test Coverage

### Viewing Coverage Reports

After running `npm run test:coverage`:

1. **Terminal Output**: Summary in console
2. **HTML Report**: Open `coverage/index.html` in browser
3. **LCOV Report**: For CI/CD integration at `coverage/lcov.info`

### Coverage Thresholds

The project enforces strict coverage thresholds:

- Any commit that reduces coverage below thresholds will fail CI
- Focus on testing critical paths and edge cases
- 100% coverage is not required but encouraged for critical modules

## Writing Tests

### Test File Structure

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { YourService } from '../YourService';

describe('YourService', () => {
  let service: YourService;

  beforeEach(() => {
    // Setup before each test
    service = new YourService();
  });

  afterEach(() => {
    // Cleanup after each test
    vi.clearAllMocks();
  });

  describe('Feature Group', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = service.doSomething(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Testing Async Code

```typescript
it('should handle async operations', async () => {
  const promise = service.asyncOperation();

  await expect(promise).resolves.toBe('success');
});

it('should handle errors', async () => {
  await expect(service.failingOperation()).rejects.toThrow('Error message');
});
```

### Testing React Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';

it('should manage state', () => {
  const { result } = renderHook(() => useCustomHook());

  expect(result.current.value).toBe(initial);

  act(() => {
    result.current.setValue('new');
  });

  expect(result.current.value).toBe('new');
});
```

### Testing React Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

it('should render and interact', async () => {
  render(<YourComponent />);

  expect(screen.getByText('Hello')).toBeInTheDocument();

  const button = screen.getByRole('button');
  fireEvent.click(button);

  await waitFor(() => {
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

## Test Utilities

### Available Helpers

Located in `src/__tests__/utils/testHelpers.ts`:

#### JWT Token Helpers

```typescript
import { createMockJWT, createExpiredJWT } from '@/__tests__/utils/testHelpers';

const token = createMockJWT({ userId: '123' }, 3600); // Expires in 1 hour
const expired = createExpiredJWT();
```

#### Storage Mocking

```typescript
import { mockSessionStorage, mockLocalStorage } from '@/__tests__/utils/testHelpers';

const storage = mockSessionStorage();
storage.setItem('key', 'value');
expect(storage.getItem('key')).toBe('value');
```

#### Axios Mocking

```typescript
import { createMockAxiosConfig, createMockAxiosResponse, createMockAxiosError } from '@/__tests__/utils/testHelpers';

const config = createMockAxiosConfig({ method: 'POST' });
const response = createMockAxiosResponse({ data: 'test' });
const error = createMockAxiosError('Network Error', 'ERR_NETWORK', 500);
```

#### CSRF Helpers

```typescript
import { createMockCsrfMetaTag, createMockCsrfCookie } from '@/__tests__/utils/testHelpers';

const cleanup = createMockCsrfMetaTag('csrf-token-123');
// ... run tests ...
cleanup(); // Remove meta tag
```

#### Timer Utilities

```typescript
import { wait, waitForNextTick, advanceTimersAndFlush } from '@/__tests__/utils/testHelpers';

await wait(1000); // Wait 1 second
await waitForNextTick(); // Wait for microtask queue
await advanceTimersAndFlush(5000); // Advance fake timers and flush promises
```

### Custom Matchers

```typescript
// Check if string is a valid JWT
expect(token).toBeValidToken();

// Check if timestamp is within range
expect(timestamp).toBeWithinTimeRange(expected, toleranceMs);

// Check if request has CSRF token
expect(axiosConfig).toHaveCsrfToken();
```

## E2E Testing with Cypress

### Writing Cypress Tests

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Login and setup
    cy.login(Cypress.env('TEST_NURSE_EMAIL'), Cypress.env('TEST_NURSE_PASSWORD'));
    cy.visit('/students');
  });

  it('should perform action', () => {
    cy.get('[data-testid="student-list"]').should('be.visible');
    cy.get('[data-testid="add-button"]').click();

    // Fill form
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');

    // Submit
    cy.get('button[type="submit"]').click();

    // Verify
    cy.contains('John Doe').should('be.visible');
  });
});
```

### Cypress Best Practices

1. **Use data-testid attributes** for reliable selectors
2. **Avoid waiting with arbitrary timeouts** - use Cypress's built-in retry
3. **Clear test data** before/after tests
4. **Mock API responses** for predictable tests
5. **Test user flows** not implementation details

### Cypress Commands

Custom commands available in `cypress/support/commands.ts`:

```typescript
// Authentication
cy.login(email, password);
cy.logout();

// Navigation
cy.visitStudentProfile(studentId);
cy.visitHealthRecords(studentId);

// PHI Access
cy.accessPHI(resourceType, resourceId);

// Assertions
cy.checkAuditLog(action, resourceType);
```

## CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Pull requests
- Pushes to main/master
- Manual workflow dispatch

Example workflow:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

      - name: Run E2E tests
        run: npm run cypress:run

      - name: Upload Cypress artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-screenshots
          path: cypress/screenshots
```

### Coverage Reporting

- Coverage reports automatically uploaded to Codecov
- PR comments show coverage diff
- Failing coverage prevents merge

## Best Practices

### General Testing Principles

1. **Write tests first** (TDD) when possible
2. **Test behavior, not implementation**
3. **Keep tests isolated** - no interdependencies
4. **Use descriptive test names** - describe what and why
5. **Follow AAA pattern**: Arrange, Act, Assert
6. **Mock external dependencies** to control test environment
7. **Test edge cases and error paths**
8. **Keep tests fast** - under 2 minutes for full suite

### Healthcare-Specific Testing

1. **Test PHI protection** - ensure audit logging works
2. **Test access control** - verify RBAC enforcement
3. **Test data validation** - critical for patient safety
4. **Test error handling** - healthcare apps must fail safely
5. **Test offline behavior** - handle network issues gracefully

### Security Testing

1. **Test authentication flows** completely
2. **Test authorization** at every level
3. **Test CSRF protection** on state-changing operations
4. **Test XSS prevention** in user input
5. **Test token expiration** and refresh flows

### Performance Testing

```typescript
import { benchmark } from '@/__tests__/utils/performance';

it('should perform efficiently', async () => {
  const duration = await benchmark(() => {
    return service.expensiveOperation();
  });

  expect(duration).toBeLessThan(100); // 100ms threshold
});
```

### Debugging Tests

```typescript
// Enable debug output
import.meta.env.DEBUG = 'app:*';

// Use debug points
it('should debug', () => {
  const result = service.method();
  debugger; // Breakpoint here
  expect(result).toBe('expected');
});

// Console output in tests
it('should show values', () => {
  console.log('Value:', someValue); // Visible in test output
});
```

### Common Pitfalls

1. **Forgetting to cleanup** - Use afterEach for cleanup
2. **Not waiting for async** - Use async/await or waitFor
3. **Testing implementation details** - Test public API only
4. **Flaky tests** - Usually timing issues, use proper waits
5. **Over-mocking** - Mock at boundaries, not internals

## Test Categories

### Security Tests

Location: `src/services/security/__tests__/`

Tests:
- ✅ SecureTokenManager: Token storage, validation, expiration
- ✅ CsrfProtection: Token injection, caching, state-changing methods

### Audit Tests

Location: `src/services/audit/__tests__/`

Tests:
- ✅ AuditService: Event batching, local backup, retry logic
- ✅ useAudit: Hook functionality, user context

### Resilience Tests

Location: `src/services/resilience/__tests__/`

Tests:
- ✅ CircuitBreaker: State transitions, failure threshold, recovery
- ⏳ Bulkhead: Priority queues, concurrency limits
- ⏳ RequestDeduplicator: Duplicate detection, promise sharing

### Cache Tests

Location: `src/services/cache/__tests__/`

Tests:
- ⏳ CacheManager: LRU eviction, TTL expiration
- ⏳ InvalidationStrategy: Granular invalidation
- ⏳ OptimisticUpdateManager: Conflict detection, rollback
- ⏳ Persistence: IndexedDB storage, PHI exclusion

### Integration Tests

Location: `src/__tests__/integration/`

Scenarios:
- ⏳ Login → PHI access → Audit logged
- ⏳ Create student → Optimistic update → Cache invalidation
- ⏳ API failure → Circuit breaker → Fallback

### E2E Tests

Location: `cypress/e2e/`

Suites:
- ⏳ Security: Authentication, token expiration, CSRF
- ⏳ Audit: PHI access logging verification
- ⏳ Resilience: Circuit breaker behavior, request deduplication

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Cypress Documentation](https://docs.cypress.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Support

For questions or issues with tests:
1. Check this documentation
2. Review existing tests for patterns
3. Ask in #engineering-testing Slack channel
4. Create an issue in the repository

---

**Legend**: ✅ Complete | ⏳ In Progress | ❌ Not Started

Last Updated: 2025-10-21
