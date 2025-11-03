# Testing Phase 1 - Next Steps & Quick Fix Guide

**Status**: 70% Complete - Tests written, execution blocked by Edge Runtime mocking
**Quick Fix**: 1-2 hours to resolve and execute all tests

---

## Immediate Action Required

### Problem
Jest cannot properly mock Next.js Edge Runtime globals (Request, Response, Headers, Cookies) required by `NextRequest` class.

**Current Error**:
```
TypeError: Cannot read properties of undefined (reading 'get')
  at new RequestCookies (node_modules/next/dist/compiled/@edge-runtime/cookies/index.js:179:35)
```

### Solution Options (Choose One)

---

## Option 1: Use Undici for Proper Fetch Mocking (RECOMMENDED)

Undici provides proper Web API implementations that Next.js Edge Runtime uses.

### Step 1: Install Undici
```bash
cd /home/user/white-cross/nextjs
npm install --save-dev undici @types/undici
```

### Step 2: Update jest.setup.ts
Replace the Request/Response/Headers mocks with:

```typescript
import { Request, Response, Headers } from 'undici';

// Make Undici's implementations available globally
global.Request = Request as any;
global.Response = Response as any;
global.Headers = Headers as any;
```

### Step 3: Run Tests
```bash
npm test -- src/app/api/v1/students/__tests__/route.test.ts
```

**Expected Result**: All 14 tests pass ✅

---

## Option 2: Switch to Vitest (BEST LONG-TERM)

Vitest has better ES module support and native Next.js integration.

### Step 1: Install Vitest
```bash
cd /home/user/white-cross/nextjs
npm install --save-dev vitest @vitest/ui @vitejs/plugin-react
```

### Step 2: Create vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 95,
      functions: 95,
      branches: 90,
      statements: 95,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Step 3: Create vitest.setup.ts
```typescript
import '@testing-library/jest-dom/vitest';
import 'vitest-canvas-mock';

// Vitest handles ES modules natively, no mocking needed for @faker-js/faker
```

### Step 4: Update package.json
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### Step 5: Update Test Files
Replace `jest` with `vitest` imports:
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Change jest.fn() to vi.fn()
// Change jest.mock() to vi.mock()
```

### Step 6: Run Tests
```bash
npm test
```

**Advantages**:
- Native ES module support (no @faker-js/faker issues)
- Faster test execution
- Better Next.js integration
- Modern, actively maintained

---

## Option 3: Use MSW (Mock Service Worker) for API Testing

MSW intercepts network requests at a lower level, avoiding Edge Runtime issues.

### Step 1: MSW is already installed
```bash
# Already in package.json: "msw": "^2.11.6"
```

### Step 2: Update Test Approach
Instead of testing route handlers directly, test through MSW interceptors:

```typescript
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('http://localhost:3001/api/v1/students', () => {
    return HttpResponse.json({
      success: true,
      data: [createStudent(), createStudent()],
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('should fetch students', async () => {
  const response = await fetch('http://localhost:3001/api/v1/students', {
    headers: { Authorization: 'Bearer token' },
  });

  const data = await response.json();
  expect(data.success).toBe(true);
  expect(data.data).toHaveLength(2);
});
```

**Note**: This tests the full API flow including proxy, but requires rewriting tests.

---

## Option 4: Minimal Fix - Just Mock What's Needed

Quick fix to unblock immediate testing.

### Update jest.setup.ts
```typescript
// Add URLSearchParams
global.URLSearchParams = URLSearchParams;

// Add ReadableStream
global.ReadableStream = class ReadableStream {
  constructor() {}
} as any;

// Enhance Headers mock
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    private headers: Map<string, string> = new Map();

    constructor(init?: any) {
      if (init) {
        if (init instanceof Headers) {
          init.forEach((value: string, key: string) => {
            this.headers.set(key.toLowerCase(), value);
          });
        } else if (typeof init === 'object') {
          Object.entries(init).forEach(([key, value]) => {
            this.headers.set(key.toLowerCase(), value as string);
          });
        }
      }
    }

    get(name: string) {
      return this.headers.get(name.toLowerCase()) || null;
    }

    set(name: string, value: string) {
      this.headers.set(name.toLowerCase(), value);
    }

    has(name: string) {
      return this.headers.has(name.toLowerCase());
    }

    delete(name: string) {
      this.headers.delete(name.toLowerCase());
    }

    forEach(callback: (value: string, key: string) => void) {
      this.headers.forEach((value, key) => callback(value, key));
    }

    entries() {
      return this.headers.entries();
    }

    keys() {
      return this.headers.keys();
    }

    values() {
      return this.headers.values();
    }

    [Symbol.iterator]() {
      return this.headers[Symbol.iterator]();
    }
  } as any;
}

// Enhance Request mock to handle cookies
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    private _url: string;
    public init?: any;
    public headers: any;
    public method: string;
    public body: any;
    public signal: any;
    public integrity: string;
    public keepalive: boolean;
    public referrer: string;
    public referrerPolicy: string;

    constructor(url: string, init?: any) {
      this._url = url;
      this.init = init;
      this.method = init?.method || 'GET';
      this.body = init?.body;
      this.signal = init?.signal || null;
      this.integrity = init?.integrity || '';
      this.keepalive = init?.keepalive || false;
      this.referrer = init?.referrer || 'about:client';
      this.referrerPolicy = init?.referrerPolicy || '';

      // Convert headers object to Headers instance
      if (init?.headers) {
        if (init.headers instanceof Headers) {
          this.headers = init.headers;
        } else {
          this.headers = new Headers(init.headers);
        }
      } else {
        this.headers = new Headers();
      }
    }

    get url() {
      return this._url;
    }

    clone() {
      return new Request(this._url, this.init);
    }
  } as any;
}
```

Then run:
```bash
npm test -- src/app/api/v1/students/__tests__/route.test.ts
```

---

## Verification Steps

### After Applying Fix

1. **Run Single Test Suite**
```bash
npm test -- src/app/api/v1/students/__tests__/route.test.ts
```

Expected output:
```
PASS src/app/api/v1/students/__tests__/route.test.ts
  /api/v1/students
    GET /api/v1/students
      ✓ should require authentication (Xms)
      ✓ should return list of students for authenticated nurse (Xms)
      ✓ should use caching for student list (Xms)
      ... 11 more tests

Tests:       14 passed, 14 total
```

2. **Run All API Route Tests**
```bash
npm test -- --testPathPattern="api/v1/(students|medications|health-records)|api/auth"
```

Expected output:
```
PASS src/app/api/v1/students/__tests__/route.test.ts (14 tests)
PASS src/app/api/v1/medications/__tests__/route.test.ts (20 tests)
PASS src/app/api/v1/health-records/__tests__/route.test.ts (22 tests)
PASS src/app/api/auth/login/__tests__/route.test.ts (17 tests)

Tests:       73 passed, 73 total
Time:        ~5-10s
```

3. **Generate Coverage Report**
```bash
npm run test:coverage
```

Expected coverage:
```
File                                  | % Stmts | % Branch | % Funcs | % Lines |
--------------------------------------|---------|----------|---------|---------|
All files                             |   25-30 |    20-25 |   25-30 |   25-30 |
 src/app/api/v1/students/route.ts     |     100 |      100 |     100 |     100 |
 src/app/api/v1/medications/route.ts  |     100 |      100 |     100 |     100 |
 src/app/api/v1/health-records/route.ts|    100 |      100 |     100 |     100 |
 src/app/api/auth/login/route.ts      |     100 |      100 |     100 |     100 |
 ... (other files with lower coverage)
```

4. **Verify HIPAA Compliance**
All tests should verify:
- ✅ Authentication required
- ✅ PHI access logged
- ✅ Audit trail captured (timestamp, IP, user agent)
- ✅ Cache invalidation
- ✅ Error message sanitization

---

## Success Criteria

### Tests Passing
- [ ] Students API: 14/14 tests pass
- [ ] Medications API: 20/20 tests pass
- [ ] Health Records API: 22/22 tests pass
- [ ] Auth/Login API: 17/17 tests pass
- [ ] **Total**: 73/73 tests pass

### Coverage
- [ ] Overall coverage: 25-30%
- [ ] API routes coverage: 90%+
- [ ] Critical PHI routes: 100%

### CI/CD
- [ ] GitHub Actions workflow created
- [ ] Tests run automatically on PRs
- [ ] Coverage reports generated

---

## Timeline Estimate

| Task | Time | Person |
|------|------|--------|
| Choose and implement fix (Option 1 recommended) | 1-2 hours | Developer |
| Run and verify all tests pass | 30 mins | Developer |
| Generate coverage report | 15 mins | Developer |
| Set up CI/CD workflow | 1 hour | DevOps |
| Review and approve | 1 hour | Team Lead |
| **Total** | **4-5 hours** | - |

---

## Recommended Approach

**I recommend Option 1 (Undici)** for immediate unblocking because:

✅ **Fastest to implement** (1-2 hours)
✅ **Minimal code changes** (just jest.setup.ts)
✅ **Works with existing tests** (no test rewrites)
✅ **Proper Web API compatibility** (official implementations)
✅ **Maintains Jest** (team familiarity)

**Long-term**: Consider migrating to Vitest (Option 2) in Phase 2 for better ES module support and faster execution.

---

## Commands Quick Reference

```bash
# Install Undici (Option 1)
npm install --save-dev undici @types/undici

# Run specific test suite
npm test -- src/app/api/v1/students/__tests__/route.test.ts

# Run all API tests
npm test -- --testPathPattern="api/v1|api/auth"

# Run with coverage
npm run test:coverage

# Watch mode (for development)
npm run test:watch

# CI mode (no watch, single run)
CI=true npm test
```

---

## Support & Troubleshooting

### If tests still fail after fix:

1. **Check mock setup**
   ```bash
   # Verify Undici is installed
   npm list undici
   ```

2. **Clear Jest cache**
   ```bash
   npm test -- --clearCache
   ```

3. **Check for conflicting mocks**
   ```bash
   # Search for other Request/Response mocks
   grep -r "global.Request" src/
   ```

4. **Verify TypeScript compilation**
   ```bash
   npm run type-check
   ```

### Common Issues

**Issue**: "Cannot find module 'undici'"
**Fix**: Run `npm install` again

**Issue**: Tests timeout
**Fix**: Increase timeout in jest.config.ts:
```typescript
testTimeout: 10000
```

**Issue**: Coverage report not generated
**Fix**: Ensure collectCoverageFrom is set in jest.config.ts

---

## After Tests Pass

1. **Commit the working tests**
   ```bash
   git add .
   git commit -m "feat(tests): Add comprehensive API route tests for critical PHI endpoints

   - Add 73 test cases covering students, medications, health-records, auth
   - Implement HIPAA compliance testing (PHI access logging, audit trails)
   - Create reusable test utilities and factories
   - Fix Jest configuration for Next.js Edge Runtime
   - Achieve 25-30% test coverage (up from 4.2%)

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

2. **Create PR**
   ```bash
   gh pr create --title "feat(tests): Phase 1 - Critical API Route Tests" \
     --body "Implements comprehensive testing for highest-priority HIPAA compliance and security risks"
   ```

3. **Set up CI/CD** (see main report for GitHub Actions workflow)

4. **Move to Phase 2** (server components, integration tests)

---

## Questions?

Contact the development team or refer to:
- `TESTING_PHASE1_IMPLEMENTATION_REPORT.md` - Full implementation details
- `TESTING_STRATEGY_AUDIT.md` - Overall strategy and gaps
- `TESTING_QUICK_START.md` - Testing templates and examples

---

**Created**: 2025-10-27
**Last Updated**: 2025-10-27
**Status**: Ready for Implementation
**Priority**: HIGH (blocks Phase 1 completion)
