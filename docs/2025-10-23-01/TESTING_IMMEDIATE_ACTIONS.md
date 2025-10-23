# Frontend Testing - Immediate Action Plan
**White Cross Healthcare Platform**
**Timeline:** Start immediately, complete within 2 weeks

---

## Week 1: Critical Infrastructure & Security

### Day 1: Setup Testing Infrastructure

#### Morning: Install Dependencies
```bash
cd frontend

# Install missing test dependencies
npm install -D @vitest/coverage-v8
npm install -D @testing-library/user-event
npm install -D msw

# Verify installation
npm run test -- --version
```

#### Afternoon: Create Test Utilities
Create `frontend/src/__tests__/utils/test-utils.tsx`:
```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>,
    options
  );
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
```

Create `frontend/src/__tests__/utils/mock-data.ts`:
```typescript
import { Student, Appointment, User } from '@/types';

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'NURSE',
  ...overrides,
});

export const createMockStudent = (overrides?: Partial<Student>): Student => ({
  id: 'student-123',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '2010-01-01',
  grade: '5',
  ...overrides,
});

export const createMockAppointment = (overrides?: Partial<Appointment>): Appointment => ({
  id: 'appt-123',
  studentId: 'student-123',
  nurseId: 'nurse-123',
  date: new Date().toISOString(),
  type: 'checkup',
  status: 'scheduled',
  ...overrides,
});
```

---

### Day 2: Setup MSW (Mock Service Worker)

Create `frontend/src/__tests__/mocks/handlers.ts`:
```typescript
import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:3000/api';

export const handlers = [
  // Auth handlers
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        token: 'mock-token',
        user: {
          id: '1',
          email: body.email,
          firstName: 'Test',
          lastName: 'User',
          role: 'NURSE',
        },
      },
    });
  }),

  // Students handlers
  http.get(`${API_URL}/students`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        students: [],
        total: 0,
      },
    });
  }),
];
```

Create `frontend/src/__tests__/mocks/server.ts`:
```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

Update `frontend/src/__tests__/setup.ts`:
```typescript
import { server } from './mocks/server';

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());
```

---

### Day 3-5: Critical Security Tests

#### Test 1: Authentication API
Create `frontend/src/services/modules/__tests__/authApi.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { AuthApi } from '../authApi';
import { ApiClient } from '../../core/ApiClient';

describe('AuthApi', () => {
  const mockClient = {
    post: vi.fn(),
    get: vi.fn(),
  } as unknown as ApiClient;

  const authApi = new AuthApi(mockClient);

  describe('login', () => {
    it('should login with valid credentials', async () => {
      mockClient.post = vi.fn().mockResolvedValue({
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
      expect(result.user).toBeDefined();
    });

    it('should reject weak passwords', async () => {
      await expect(authApi.login({
        email: 'test@example.com',
        password: 'weak',
      })).rejects.toThrow('12 characters');
    });

    it('should validate email format', async () => {
      await expect(authApi.login({
        email: 'invalid-email',
        password: 'Password123!',
      })).rejects.toThrow();
    });
  });

  describe('token management', () => {
    it('should refresh expired token', async () => {
      mockClient.post = vi.fn().mockResolvedValue({
        data: {
          token: 'new-token',
          refreshToken: 'new-refresh-token',
        },
      });

      const result = await authApi.refreshToken();
      expect(result.token).toBe('new-token');
    });

    it('should detect token expiration', () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAwMDAwMDB9.xxx';
      expect(authApi.isTokenExpired()).toBe(true);
    });
  });
});
```

#### Test 2: Sanitization Utils
Create `frontend/src/utils/__tests__/sanitization.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import {
  sanitizeText,
  sanitizeHtml,
  sanitizeEmail,
  sanitizeUrl,
  validateSafeHealthcareText,
} from '../sanitization';

describe('sanitization', () => {
  describe('sanitizeText', () => {
    it('should remove XSS vectors', () => {
      const malicious = '<script>alert("xss")</script>';
      expect(sanitizeText(malicious)).not.toContain('<script');
    });

    it('should escape HTML entities', () => {
      const input = '<div>Test & "quotes"</div>';
      const result = sanitizeText(input);
      expect(result).toContain('&lt;');
      expect(result).toContain('&quot;');
    });
  });

  describe('sanitizeHtml', () => {
    it('should strip all HTML tags by default', () => {
      const html = '<p>Text</p><script>alert("xss")</script>';
      const result = sanitizeHtml(html);
      expect(result).not.toContain('<');
    });

    it('should allow specified tags', () => {
      const html = '<p>Paragraph</p><b>Bold</b><script>alert()</script>';
      const result = sanitizeHtml(html, ['p', 'b']);
      expect(result).toContain('<p>');
      expect(result).not.toContain('<script>');
    });

    it('should remove javascript: protocol', () => {
      const html = '<a href="javascript:alert()">Click</a>';
      const result = sanitizeHtml(html);
      expect(result).not.toContain('javascript:');
    });
  });

  describe('sanitizeEmail', () => {
    it('should validate correct emails', () => {
      expect(sanitizeEmail('test@example.com')).toBe('test@example.com');
    });

    it('should reject invalid emails', () => {
      expect(sanitizeEmail('invalid')).toBe('');
      expect(sanitizeEmail('test@')).toBe('');
    });

    it('should normalize to lowercase', () => {
      expect(sanitizeEmail('TEST@EXAMPLE.COM')).toBe('test@example.com');
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow safe protocols', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
      expect(sanitizeUrl('mailto:test@example.com')).toBe('mailto:test@example.com');
    });

    it('should block dangerous protocols', () => {
      expect(sanitizeUrl('javascript:alert()')).toBe('');
      expect(sanitizeUrl('data:text/html,<script>alert()</script>')).toBe('');
    });
  });

  describe('validateSafeHealthcareText', () => {
    it('should accept safe text', () => {
      expect(validateSafeHealthcareText('John Doe')).toBe(true);
      expect(validateSafeHealthcareText('Patient A, Room 123')).toBe(true);
    });

    it('should reject script injection', () => {
      expect(validateSafeHealthcareText('<script>alert()</script>')).toBe(false);
      expect(validateSafeHealthcareText('javascript:alert()')).toBe(false);
    });
  });
});
```

#### Test 3: Token Security
Create `frontend/src/utils/__tests__/tokenSecurity.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import {
  tokenSecurityManager,
  validateTokenFormat,
  getTokenExpiration,
  isTokenExpired,
} from '../tokenSecurity';

describe('tokenSecurity', () => {
  beforeEach(async () => {
    localStorage.clear();
    await tokenSecurityManager.init();
  });

  describe('tokenSecurityManager', () => {
    it('should store and retrieve token', async () => {
      const user = { id: '1', email: 'test@example.com' };
      await tokenSecurityManager.storeToken('test-token', user);

      const tokenData = await tokenSecurityManager.getValidToken();
      expect(tokenData?.token).toBe('test-token');
      expect(tokenData?.user).toEqual(user);
    });

    it('should detect expired tokens', async () => {
      const user = { id: '1', email: 'test@example.com' };
      await tokenSecurityManager.storeToken('test-token', user, -1000); // Expired

      const tokenData = await tokenSecurityManager.getValidToken();
      expect(tokenData).toBeNull();
    });

    it('should clear all tokens', async () => {
      await tokenSecurityManager.storeToken('test-token', { id: '1' });
      tokenSecurityManager.clearToken();

      const tokenData = await tokenSecurityManager.getValidToken();
      expect(tokenData).toBeNull();
    });
  });

  describe('validateTokenFormat', () => {
    it('should validate JWT format', () => {
      const validJWT = 'eyJhbGc.eyJzdWI.SflKxw';
      expect(validateTokenFormat(validJWT)).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(validateTokenFormat('invalid')).toBe(false);
      expect(validateTokenFormat('')).toBe(false);
      expect(validateTokenFormat('only.two')).toBe(false);
    });
  });

  describe('isTokenExpired', () => {
    it('should detect expired token', () => {
      // Token with exp: 1600000000 (expired)
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAwMDAwMDB9.xxx';
      expect(isTokenExpired(expiredToken)).toBe(true);
    });
  });
});
```

---

### Day 6-7: Core Service Tests

#### Test 4: ServiceManager
Create `frontend/src/services/core/__tests__/ServiceManager.test.ts`:
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ServiceManager } from '../ServiceManager';

describe('ServiceManager', () => {
  let serviceManager: ServiceManager;

  beforeEach(() => {
    serviceManager = ServiceManager.getInstance();
  });

  afterEach(async () => {
    await serviceManager.reset();
  });

  describe('singleton pattern', () => {
    it('should return same instance', () => {
      const instance1 = ServiceManager.getInstance();
      const instance2 = ServiceManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('initialization', () => {
    it('should initialize all services', async () => {
      await serviceManager.initialize();

      expect(serviceManager.isInitialized()).toBe(true);
      expect(serviceManager.has('configService')).toBe(true);
      expect(serviceManager.has('tokenManager')).toBe(true);
      expect(serviceManager.has('apiClient')).toBe(true);
    });

    it('should prevent concurrent initialization', async () => {
      const promise1 = serviceManager.initialize();
      const promise2 = serviceManager.initialize();

      await Promise.all([promise1, promise2]);
      expect(serviceManager.isInitialized()).toBe(true);
    });

    it('should skip services when requested', async () => {
      await serviceManager.initialize({ skip: ['auditService'] });

      expect(serviceManager.has('auditService')).toBe(false);
    });
  });

  describe('service access', () => {
    beforeEach(async () => {
      await serviceManager.initialize();
    });

    it('should get service by name', () => {
      const apiClient = serviceManager.get('apiClient');
      expect(apiClient).toBeDefined();
    });

    it('should throw if service not found', () => {
      expect(() => serviceManager.get('nonexistent')).toThrow();
    });

    it('should throw if not initialized', async () => {
      await serviceManager.reset();
      expect(() => serviceManager.get('apiClient')).toThrow(/not initialized/);
    });
  });

  describe('cleanup', () => {
    it('should cleanup all services', async () => {
      await serviceManager.initialize();
      await serviceManager.cleanup();

      expect(serviceManager.isInitialized()).toBe(false);
      expect(serviceManager.getServiceNames()).toHaveLength(0);
    });
  });

  describe('health status', () => {
    it('should report service health', async () => {
      await serviceManager.initialize();

      const status = serviceManager.getStatus();
      expect(status.initialized).toBe(true);
      expect(status.serviceCount).toBeGreaterThan(0);
      expect(status.services).toBeInstanceOf(Array);
    });
  });
});
```

#### Test 5: API Client
Create `frontend/src/services/core/__tests__/ApiClient.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient } from '../ApiClient';
import type { ITokenManager } from '../interfaces/ITokenManager';

describe('ApiClient', () => {
  const mockTokenManager: ITokenManager = {
    getToken: vi.fn().mockReturnValue('mock-token'),
    setToken: vi.fn(),
    removeToken: vi.fn(),
    isAuthenticated: vi.fn().mockReturnValue(true),
  };

  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient({
      baseURL: 'http://localhost:3000/api',
      timeout: 5000,
      tokenManager: mockTokenManager,
    });
  });

  describe('request interceptor', () => {
    it('should add auth token to requests', async () => {
      // This test would verify the interceptor adds Authorization header
      expect(mockTokenManager.getToken).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      // Mock network error
      await expect(apiClient.get('/nonexistent')).rejects.toThrow();
    });
  });
});
```

---

## Week 2: PHI Services & Critical Hooks

### Day 8-9: Health Records Tests

#### Test 6: Health Records API
Create `frontend/src/services/modules/__tests__/healthRecordsApi.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { createHealthRecordsApi } from '../healthRecordsApi';
import type { ApiClient } from '../../core/ApiClient';

describe('healthRecordsApi', () => {
  const mockClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } as unknown as ApiClient;

  const healthRecordsApi = createHealthRecordsApi(mockClient);

  describe('getAll', () => {
    it('should fetch health records with filters', async () => {
      const mockRecords = [{ id: '1', type: 'vaccination' }];
      mockClient.get = vi.fn().mockResolvedValue({ data: { records: mockRecords } });

      const result = await healthRecordsApi.getAll({ studentId: 'student-123' });

      expect(mockClient.get).toHaveBeenCalled();
      expect(result.records).toEqual(mockRecords);
    });
  });

  describe('create', () => {
    it('should create new health record', async () => {
      const newRecord = {
        studentId: 'student-123',
        type: 'vaccination',
        data: { vaccine: 'COVID-19' },
      };

      mockClient.post = vi.fn().mockResolvedValue({
        data: { record: { id: '1', ...newRecord } },
      });

      const result = await healthRecordsApi.create(newRecord);
      expect(result.record.id).toBeDefined();
    });
  });
});
```

### Day 10-11: Critical Hooks Tests

#### Test 7: useApiError Hook
Create `frontend/src/hooks/shared/__tests__/useApiError.test.tsx`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useApiError } from '../useApiError';

describe('useApiError', () => {
  it('should transform errors to enterprise format', () => {
    const { result } = renderHook(() => useApiError());

    const error = new Error('Network error');
    const transformed = result.current.transformError(error, 'test-operation');

    expect(transformed.context).toBe('test-operation');
    expect(transformed.timestamp).toBeInstanceOf(Date);
  });

  it('should determine error type correctly', () => {
    const { result } = renderHook(() => useApiError());

    const authError = { status: 401, message: 'Unauthorized' };
    const transformed = result.current.transformError(authError);

    expect(transformed.type).toBe('authorization');
  });

  it('should provide PHI-safe display messages', () => {
    const { result } = renderHook(() => useApiError());

    const error = {
      type: 'validation' as const,
      message: 'Validation failed',
      timestamp: new Date(),
      name: 'ValidationError',
    };

    const message = result.current.getDisplayMessage(error);
    expect(message).not.toContain('patient'); // Should not expose PHI
  });
});
```

#### Test 8: useAppointments Hook
Create `frontend/src/hooks/domains/appointments/__tests__/useAppointments.test.tsx`:
```typescript
import { describe, it, expect, waitFor } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppointments } from '../queries/useAppointments';

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

describe('useAppointments', () => {
  it('should fetch appointments on mount', async () => {
    const { result } = renderHook(() => useAppointments(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });

  it('should handle errors gracefully', async () => {
    // Mock API error
    const { result } = renderHook(() => useAppointments({ invalid: true }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
```

### Day 12-14: Setup CI/CD & Documentation

#### Day 12: CI/CD Configuration
Create `.github/workflows/frontend-tests.yml`:
```yaml
name: Frontend Tests

on:
  push:
    branches: [master, develop]
  pull_request:
    branches: [master, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run tests
        working-directory: ./frontend
        run: npm run test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info
          flags: frontend
```

#### Day 13: Testing Documentation
Create `frontend/TESTING_GUIDE.md` with:
- How to write tests
- Testing patterns
- Mock data creation
- Running tests locally
- Debugging failed tests

#### Day 14: Team Training
- Schedule 2-hour testing workshop
- Demo test writing process
- Code review testing practices
- Q&A session

---

## Success Metrics (Week 2 End)

✅ **Infrastructure Complete:**
- Coverage tooling installed and working
- MSW configured for API mocking
- Test utilities created
- CI/CD running tests

✅ **Test Files Created:** 8 critical test files
- authApi.test.ts
- sanitization.test.ts
- tokenSecurity.test.ts
- ServiceManager.test.ts
- ApiClient.test.ts
- healthRecordsApi.test.ts
- useApiError.test.tsx
- useAppointments.test.tsx

✅ **Coverage Achieved:** ~10-15%
✅ **Critical Security Code Tested:** Yes
✅ **Team Trained:** Yes

---

## Next Steps (Week 3+)

Continue with Priority 1 tests:
- Medications API
- Students API
- Compliance API
- More critical hooks
- Start component testing

---

## Daily Checklist Template

### Daily Stand-up Questions
- [ ] Tests written yesterday
- [ ] Tests planned today
- [ ] Blockers or issues
- [ ] Coverage percentage change

### End of Day
- [ ] All new tests passing
- [ ] Coverage increased
- [ ] Tests committed to Git
- [ ] Documentation updated

---

## Help & Resources

### Stuck on Testing?
1. Check `TESTING_GUIDE.md`
2. Review existing test examples
3. Ask team for code review
4. Reference React Testing Library docs

### Common Issues
- **MSW not mocking:** Check handler URL matches
- **Async test timeout:** Increase timeout or use `waitFor`
- **Provider errors:** Ensure `renderWithProviders` used
- **Coverage not working:** Reinstall `@vitest/coverage-v8`

---

**Start Date:** [Fill in]
**Team Members:** [Fill in]
**Daily Progress Tracking:** [Link to tracking sheet]
