# Frontend Testing Quick Reference
**White Cross Healthcare Platform**

---

## Quick Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run specific test file
npm test -- authApi.test.ts

# Run E2E tests
npm run cypress:open
npm run cypress:run
```

---

## Test File Naming

```
Component: Button.tsx → Button.test.tsx
Service: authApi.ts → authApi.test.ts
Hook: useAuth.ts → useAuth.test.tsx
Utils: sanitize.ts → sanitize.test.ts
```

---

## Test Structure Template

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('ComponentName', () => {
  // Setup runs before each test
  beforeEach(() => {
    // Reset mocks, clear storage, etc.
  });

  // Cleanup runs after each test
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Group related tests
  describe('feature or method name', () => {
    it('should describe expected behavior', () => {
      // Arrange - setup test data
      const input = 'test';

      // Act - execute code
      const result = functionToTest(input);

      // Assert - verify result
      expect(result).toBe('expected');
    });
  });
});
```

---

## Component Testing Patterns

### Basic Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

it('should render button text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### User Interaction
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

it('should handle form submission', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<LoginForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
});
```

### With Providers
```typescript
import { renderWithProviders } from '@/__tests__/utils/test-utils';

it('should access context', () => {
  renderWithProviders(<ComponentNeedingContext />);
  // Component has access to QueryClient, Router, etc.
});
```

---

## Hook Testing Patterns

### Basic Hook Test
```typescript
import { renderHook } from '@testing-library/react';
import { useCounter } from './useCounter';

it('should increment counter', () => {
  const { result } = renderHook(() => useCounter());

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

### React Query Hook
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStudents } from './useStudents';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

it('should fetch students', async () => {
  const { result } = renderHook(() => useStudents(), {
    wrapper: createWrapper(),
  });

  expect(result.current.isLoading).toBe(true);

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toBeDefined();
});
```

---

## Service/API Testing Patterns

### API Service Test
```typescript
import { vi } from 'vitest';
import { AuthApi } from './authApi';

describe('AuthApi', () => {
  const mockClient = {
    post: vi.fn(),
    get: vi.fn(),
  };

  const authApi = new AuthApi(mockClient);

  it('should login successfully', async () => {
    mockClient.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          token: 'test-token',
          user: { id: '1', email: 'test@example.com' },
        },
      },
    });

    const result = await authApi.login({
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(result.token).toBe('test-token');
    expect(mockClient.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        email: 'test@example.com',
      })
    );
  });
});
```

---

## Mocking Patterns

### Mock Function
```typescript
const mockFn = vi.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue(Promise.resolve('async value'));
mockFn.mockRejectedValue(new Error('error'));

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(2);
```

### Mock Module
```typescript
vi.mock('@/services/api', () => ({
  authApi: {
    login: vi.fn().mockResolvedValue({ token: 'test-token' }),
  },
}));
```

### Mock Service Worker
```typescript
import { http, HttpResponse } from 'msw';
import { server } from '@/__tests__/mocks/server';

// Override handler for specific test
server.use(
  http.post('/api/auth/login', () => {
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  })
);
```

---

## Common Assertions

### Basic Matchers
```typescript
expect(value).toBe(expected);           // Exact equality (===)
expect(value).toEqual(expected);        // Deep equality
expect(value).toBeTruthy();             // Truthy check
expect(value).toBeFalsy();              // Falsy check
expect(value).toBeNull();               // Null check
expect(value).toBeUndefined();          // Undefined check
expect(value).toBeDefined();            // Not undefined
```

### Numbers
```typescript
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3);
expect(value).toBeLessThan(10);
expect(value).toBeCloseTo(0.3, 5);      // Floating point
```

### Strings
```typescript
expect(str).toMatch(/pattern/);
expect(str).toContain('substring');
```

### Arrays
```typescript
expect(array).toHaveLength(3);
expect(array).toContain(item);
expect(array).toContainEqual({ id: 1 });
```

### Objects
```typescript
expect(obj).toHaveProperty('key');
expect(obj).toHaveProperty('key', 'value');
expect(obj).toMatchObject({ key: 'value' });
```

### DOM Testing Library
```typescript
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeDisabled();
expect(element).toHaveTextContent('text');
expect(element).toHaveClass('class-name');
expect(element).toHaveAttribute('type', 'text');
```

---

## Queries Priority

Use in this order (most to least preferred):

1. **Accessible to Everyone**
   ```typescript
   getByRole('button', { name: /submit/i })
   getByLabelText(/email/i)
   getByPlaceholderText(/search/i)
   getByText(/hello world/i)
   ```

2. **Semantic Queries**
   ```typescript
   getByAltText(/profile picture/i)
   getByTitle(/close/i)
   ```

3. **Test IDs** (last resort)
   ```typescript
   getByTestId('custom-element')
   ```

### Query Variants
```typescript
getBy...      // Throws if not found
queryBy...    // Returns null if not found
findBy...     // Async, waits for element (returns Promise)

getAllBy...   // Multiple elements (throws if none)
queryAllBy... // Multiple elements (returns [] if none)
findAllBy...  // Async multiple elements
```

---

## Async Testing

### waitFor
```typescript
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText(/loaded/i)).toBeInTheDocument();
});

// With options
await waitFor(
  () => expect(mockFn).toHaveBeenCalled(),
  { timeout: 3000, interval: 100 }
);
```

### findBy Queries (built-in async)
```typescript
// Automatically waits up to 1000ms
const element = await screen.findByText(/async content/i);
```

### waitForElementToBeRemoved
```typescript
await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
```

---

## Error Testing

### Expect Error
```typescript
expect(() => functionThatThrows()).toThrow();
expect(() => functionThatThrows()).toThrow('specific error');
expect(() => functionThatThrows()).toThrow(ErrorClass);
```

### Async Error
```typescript
await expect(asyncFunction()).rejects.toThrow();
await expect(asyncFunction()).rejects.toThrow('error message');
```

---

## Snapshot Testing

### Create Snapshot
```typescript
import { render } from '@testing-library/react';
import { Button } from './Button';

it('should match snapshot', () => {
  const { container } = render(<Button>Click me</Button>);
  expect(container.firstChild).toMatchSnapshot();
});
```

### Inline Snapshot
```typescript
expect(formatDate('2024-01-15')).toMatchInlineSnapshot(`"January 15, 2024"`);
```

### Update Snapshots
```bash
npm test -- -u
```

---

## Coverage Commands

### View Coverage
```bash
# Generate coverage report
npm run test:coverage

# View in browser
open coverage/index.html
```

### Coverage Thresholds (vitest.config.ts)
```typescript
coverage: {
  lines: 95,        // 95% of lines covered
  functions: 95,    // 95% of functions covered
  branches: 90,     // 90% of branches covered
  statements: 95,   // 95% of statements covered
}
```

---

## Common Patterns

### Test Loading State
```typescript
it('should show loading state', () => {
  render(<ComponentWithLoading />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

### Test Error State
```typescript
it('should show error message', async () => {
  server.use(
    http.get('/api/data', () => {
      return HttpResponse.json({ error: 'Failed' }, { status: 500 });
    })
  );

  render(<ComponentWithError />);

  await waitFor(() => {
    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
  });
});
```

### Test Form Validation
```typescript
it('should show validation error', async () => {
  const user = userEvent.setup();
  render(<Form />);

  const input = screen.getByLabelText(/email/i);
  await user.type(input, 'invalid-email');
  await user.tab(); // Trigger blur

  expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});
```

### Test Optimistic Update
```typescript
it('should optimistically update UI', async () => {
  const user = userEvent.setup();
  render(<TodoList />);

  await user.type(screen.getByPlaceholderText(/new todo/i), 'Buy milk');
  await user.click(screen.getByRole('button', { name: /add/i }));

  // Should appear immediately (optimistic)
  expect(screen.getByText('Buy milk')).toBeInTheDocument();

  // Wait for server confirmation
  await waitFor(() => {
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });
});
```

---

## Debugging Tests

### Debug Output
```typescript
import { screen } from '@testing-library/react';

// Print rendered DOM
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));
```

### Console Logging
```typescript
console.log(result.current); // In hook tests
```

### Run Single Test
```bash
# Run only tests with "login" in the name
npm test -- -t login

# Run specific file
npm test -- authApi.test.ts
```

### VS Code Debugging
1. Set breakpoint in test
2. Run "Debug Test" from test file
3. Use debugger console

---

## Best Practices

✅ **DO:**
- Test user behavior, not implementation
- Use semantic queries (getByRole)
- Write descriptive test names
- Use async utilities (waitFor, findBy)
- Mock external dependencies
- Test error states
- Keep tests isolated
- Use setup/teardown

❌ **DON'T:**
- Test implementation details
- Use getByTestId unless necessary
- Test third-party libraries
- Write flaky tests
- Share state between tests
- Mock too much
- Skip accessibility

---

## Healthcare-Specific Patterns

### PHI Handling Test
```typescript
it('should not expose PHI in error messages', () => {
  const error = handleError({ patient: 'John Doe', ssn: '123-45-6789' });
  expect(error.message).not.toContain('John Doe');
  expect(error.message).not.toContain('123-45-6789');
});
```

### Audit Logging Test
```typescript
it('should log PHI access', async () => {
  const logSpy = vi.spyOn(auditService, 'log');

  await viewHealthRecord('patient-123');

  expect(logSpy).toHaveBeenCalledWith({
    action: 'PHI_ACCESS',
    resource: 'health-record',
    resourceId: 'patient-123',
  });
});
```

### HIPAA Compliance Test
```typescript
it('should require authentication for PHI', async () => {
  // Remove auth token
  tokenManager.clearToken();

  await expect(healthRecordsApi.getAll()).rejects.toThrow('Unauthorized');
});
```

---

## Quick Links

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Docs](https://mswjs.io/)
- [User Event Docs](https://testing-library.com/docs/user-event/intro)

---

**Need Help?** Check `TESTING_GUIDE.md` or ask the team!
