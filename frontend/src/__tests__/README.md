# White Cross Testing Suite

## Quick Start

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run cypress:run

# Open Cypress UI
npm run cypress:open
```

## Test Structure

### Unit Tests
- **Security**: `src/services/security/__tests__/`
  - SecureTokenManager: JWT token management
  - CsrfProtection: CSRF token handling

- **Audit**: `src/services/audit/__tests__/`
  - AuditService: HIPAA-compliant audit logging
  - useAudit: React hook for audit logging

- **Resilience**: `src/services/resilience/__tests__/`
  - CircuitBreaker: Failure prevention pattern
  - Bulkhead: Concurrency management (pending)
  - RequestDeduplicator: Duplicate prevention (pending)

- **Cache**: `src/services/cache/__tests__/`
  - CacheManager: LRU cache with TTL (pending)
  - InvalidationStrategy: Cache invalidation (pending)
  - OptimisticUpdateManager: Optimistic updates (pending)
  - Persistence: IndexedDB persistence (pending)

### E2E Tests
- **Security**: `cypress/e2e/security/`
  - secure-authentication.cy.ts: Auth flow
  - token-expiration.cy.ts: Token lifecycle
  - csrf-protection.cy.ts: CSRF validation (pending)

- **Audit**: `cypress/e2e/audit/`
  - phi-access-logging.cy.ts: PHI audit compliance

- **Resilience**: `cypress/e2e/resilience/`
  - circuit-breaker.cy.ts: Circuit breaker E2E (pending)
  - request-deduplication.cy.ts: Deduplication E2E (pending)

## Test Utilities

Located in `utils/testHelpers.ts`:

### JWT Helpers
```typescript
import { createMockJWT, createExpiredJWT } from './testHelpers';

const token = createMockJWT({ userId: '123' }, 3600);
const expired = createExpiredJWT();
```

### Storage Mocking
```typescript
import { mockSessionStorage } from './testHelpers';

const storage = mockSessionStorage();
storage.setItem('key', 'value');
```

### CSRF Helpers
```typescript
import { createMockCsrfMetaTag } from './testHelpers';

const cleanup = createMockCsrfMetaTag('token');
// ... tests ...
cleanup();
```

### Timer Utilities
```typescript
import { advanceTimersAndFlush } from './testHelpers';

await advanceTimersAndFlush(5000); // Advance 5 seconds
```

## Custom Matchers

```typescript
// Validate JWT format
expect(token).toBeValidToken();

// Time-based assertions
expect(timestamp).toBeWithinTimeRange(expected, toleranceMs);

// CSRF token validation
expect(request).toHaveCsrfToken();
```

## Writing New Tests

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('YourFeature', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
    vi.clearAllMocks();
  });

  describe('Feature Group', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = service.method(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Testing Async Code

```typescript
it('should handle async operations', async () => {
  const result = await service.asyncMethod();
  expect(result).toBe('success');
});

it('should handle errors', async () => {
  await expect(service.failingMethod()).rejects.toThrow('Error');
});
```

### Testing React Hooks

```typescript
import { renderHook } from '@testing-library/react';

it('should manage state', () => {
  const { result } = renderHook(() => useCustomHook());

  expect(result.current.value).toBe(initial);

  act(() => {
    result.current.setValue('new');
  });

  expect(result.current.value).toBe('new');
});
```

## Coverage Requirements

- **Lines**: 95%
- **Functions**: 95%
- **Branches**: 90%
- **Statements**: 95%

## Best Practices

1. ✅ **Test behavior, not implementation**
2. ✅ **Use descriptive test names**
3. ✅ **Follow AAA pattern** (Arrange, Act, Assert)
4. ✅ **Mock external dependencies**
5. ✅ **Test edge cases and error paths**
6. ✅ **Keep tests isolated**
7. ✅ **Use type-safe assertions**

## Healthcare-Specific Testing

1. **PHI Protection**: Verify audit logs
2. **Access Control**: Test RBAC enforcement
3. **Data Validation**: Validate medical data
4. **Error Handling**: Apps must fail safely
5. **Offline Support**: Test sync and recovery

## Documentation

- **Main Guide**: `../../../TESTING.md`
- **Test Summary**: `../../../TEST_SUITE_SUMMARY.md`
- **Cypress Config**: `../../../cypress.config.ts`
- **Vitest Config**: `../../../vitest.config.ts`

## Support

For questions:
1. Check `TESTING.md` documentation
2. Review existing tests for patterns
3. Consult test utilities in `testHelpers.ts`
4. Create an issue in the repository

---

**Status**: Core modules complete (60%)
**Coverage**: 272 test cases
**Target**: 95%+ code coverage
**Last Updated**: 2025-10-21
