# Testing Quick Reference Card
## White Cross Healthcare Platform

**Quick access to common testing commands and patterns**

---

## Run Tests

### Backend Tests

```bash
# All backend tests
cd backend && npm test

# With coverage
cd backend && npm test -- --coverage

# Watch mode
cd backend && npm test -- --watch

# Single test file
cd backend && npx jest src/services/__tests__/PhiDisclosureService.test.ts

# Specific test suite
cd backend && npx jest --testNamePattern="PHI Disclosure"

# Integration tests only
cd backend && npm test -- --testPathPattern="integration"
```

### Frontend Tests

```bash
# All frontend tests
cd frontend && npm test

# With coverage
cd frontend && npm test -- --coverage

# Watch mode (interactive)
cd frontend && npm test -- --watch

# UI mode (browser interface)
cd frontend && npm run test:ui

# Single test file
cd frontend && npx vitest src/features/phi-disclosure/__tests__/phiDisclosureApi.test.ts

# Run specific test
cd frontend && npx vitest -t "should create disclosure"
```

### E2E Tests

```bash
# All E2E tests
cd frontend && npx playwright test

# Single feature
cd frontend && npx playwright test tests/e2e/phi-disclosure

# Single test file
cd frontend && npx playwright test tests/e2e/phi-disclosure/01-disclosure-creation.spec.ts

# Headed mode (see browser)
cd frontend && npx playwright test --headed

# Debug mode (step through)
cd frontend && npx playwright test --debug

# UI mode (interactive)
cd frontend && npx playwright test --ui

# Specific browser
cd frontend && npx playwright test --project=chromium

# Update snapshots
cd frontend && npx playwright test --update-snapshots
```

### Coverage

```bash
# All tests with coverage
npm run test:coverage

# Backend only
cd backend && npm test -- --coverage

# Frontend only
cd frontend && npm test -- --coverage

# Generate HTML report
cd frontend && npm test -- --coverage --reporter=html

# Open HTML report
open frontend/coverage/index.html
```

---

## Debug Tests

### Vitest Debugging

```bash
# UI mode - best for component tests
cd frontend && npm run test:ui

# Watch mode - auto-rerun on changes
cd frontend && npm test -- --watch

# Run with console logs
cd frontend && npm test -- --reporter=verbose

# Debug specific test
cd frontend && npx vitest -t "should create disclosure" --reporter=verbose
```

### Playwright Debugging

```bash
# Debug mode - step through test
cd frontend && npx playwright test --debug

# UI mode - interactive test runner
cd frontend && npx playwright test --ui

# Headed mode - see browser
cd frontend && npx playwright test --headed

# Slow motion - see actions
cd frontend && npx playwright test --headed --slow-mo=1000

# Trace on failure
cd frontend && npx playwright test --trace on

# Show trace
cd frontend && npx playwright show-trace trace.zip
```

### VSCode Debugging

**Add to `.vscode/launch.json`:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Vitest Tests",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["test", "--", "--run"],
      "cwd": "${workspaceFolder}/frontend",
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Playwright Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/frontend/node_modules/.bin/playwright",
      "args": ["test", "--headed"],
      "cwd": "${workspaceFolder}/frontend",
      "console": "integratedTerminal"
    }
  ]
}
```

---

## Common Test Patterns

### Unit Test Template

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FeatureService', () => {
  let service: FeatureService;

  beforeEach(() => {
    service = new FeatureService();
    vi.clearAllMocks();
  });

  describe('methodName', () => {
    it('should do something successfully', async () => {
      const result = await service.methodName(input);

      expect(result).toBeDefined();
      expect(result.property).toBe(expected);
    });

    it('should handle errors gracefully', async () => {
      await expect(service.methodName(invalidInput)).rejects.toThrow(/error/i);
    });
  });
});
```

### Component Test Template

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestWrapper } from '@/test/helpers/test-utils';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(
      <TestWrapper>
        <ComponentName />
      </TestWrapper>
    );

    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ComponentName />
      </TestWrapper>
    );

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });
});
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/feature');
  });

  test('should complete workflow', async ({ page }) => {
    await page.getByRole('button', { name: /action/i }).click();

    await expect(page.getByText(/success/i)).toBeVisible();
  });
});
```

---

## MSW Mock Setup

### Add Handler

```typescript
// frontend/src/test/mocks/handlers/feature.handlers.ts
import { http, HttpResponse } from 'msw';

export const featureHandlers = [
  http.get('/api/feature', () => {
    return HttpResponse.json({
      success: true,
      data: { items: [] },
    });
  }),

  http.post('/api/feature', async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json({
      success: true,
      data: { item: { id: '123', ...body } },
    });
  }),
];
```

### Use Handler

```typescript
// frontend/src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { featureHandlers } from './handlers/feature.handlers';

export const server = setupServer(...featureHandlers);
```

### Override in Test

```typescript
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

it('should handle error', async () => {
  server.use(
    http.get('/api/feature', () => {
      return HttpResponse.json(
        { error: { message: 'Error' } },
        { status: 500 }
      );
    })
  );

  await expect(api.getFeature()).rejects.toThrow(/error/i);
});
```

---

## Test Data Fixtures

### Create Fixture

```typescript
// frontend/src/test/fixtures/feature.fixtures.ts
export const featureFixtures = {
  valid: {
    id: '123',
    name: 'Test Item',
    status: 'ACTIVE',
  },

  invalid: {
    // Missing required fields
  },

  multiple: (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `item-${i}`,
      name: `Item ${i}`,
    }));
  },
};
```

### Use Fixture

```typescript
import { featureFixtures } from '@/test/fixtures/feature.fixtures';

it('should work with valid data', () => {
  const result = processItem(featureFixtures.valid);
  expect(result).toBeDefined();
});
```

---

## HIPAA Testing

### Audit Log Tracking

```typescript
import { AuditLogTracker } from '@/test/helpers/hipaa-helpers';

it('should audit PHI access', async () => {
  const auditTracker = new AuditLogTracker();

  await api.getStudentData('student-123');

  auditTracker.assertAuditLogged(
    'PHI_ACCESS',
    'STUDENT',
    'student-123'
  );
});
```

### PHI Protection

```typescript
import { assertNoPhiInError } from '@/test/helpers/hipaa-helpers';

it('should not expose PHI in errors', async () => {
  try {
    await api.getStudent('student-123');
  } catch (error: any) {
    assertNoPhiInError(error, {
      studentName: 'John Doe',
      diagnosis: 'Diabetes',
    });
  }
});
```

---

## RBAC Testing

### Test Permissions

```typescript
import { testPermission, testUserContexts } from '@/test/helpers/rbac-helpers';

it('should allow admin access', async () => {
  await testPermission(
    'ADMIN',
    'create',
    true, // should succeed
    async () => api.createItem(data)
  );
});

it('should deny teacher access', async () => {
  await testPermission(
    'TEACHER',
    'create',
    false, // should fail
    async () => api.createItem(data)
  );
});
```

### Auto-Generate RBAC Tests

```typescript
import { generateRbacTests } from '@/test/helpers/rbac-helpers';

generateRbacTests(
  'Feature Name',
  permissionMatrix,
  {
    create: async () => api.create(data),
    read: async () => api.getById('123'),
    update: async () => api.update('123', data),
    delete: async () => api.delete('123'),
  }
);
```

---

## Performance Testing

### Component Render Time

```typescript
import { measureRenderTime } from '@/test/helpers/performance-helpers';

it('should render quickly', () => {
  const duration = measureRenderTime(() => {
    render(<LargeComponent data={largeDataset} />);
  });

  expect(duration).toBeLessThan(100); // 100ms
});
```

### E2E Performance

```typescript
test('should load page quickly', async ({ page }) => {
  const startTime = Date.now();

  await page.goto('/dashboard');
  await expect(page.getByRole('heading')).toBeVisible();

  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(2000); // 2 seconds
});
```

---

## CI/CD Commands

### Local CI Simulation

```bash
# Run all tests like CI does
npm run ci:test

# Check coverage thresholds
npx nyc check-coverage --lines 95 --functions 95 --branches 90

# Run linter
npm run lint

# Type check
npm run type-check
```

### GitHub Actions Triggers

```bash
# Push to main (auto-triggers CI)
git push origin main

# Create PR (auto-triggers CI)
gh pr create --title "Feature" --body "Description"

# Re-run failed workflow
gh run rerun <run-id>

# View workflow status
gh run list
gh run view <run-id>
```

---

## Troubleshooting

### Common Issues

**Issue:** Tests timeout
**Fix:**
```typescript
// Increase timeout
test('long test', async () => { }, { timeout: 30000 });

// Or in config
timeout: 30000
```

**Issue:** MSW handlers not working
**Fix:**
```typescript
// Ensure server is started
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Issue:** Playwright can't find element
**Fix:**
```typescript
// Use auto-waiting
await expect(page.getByRole('button')).toBeVisible();

// Increase timeout
await expect(page.getByText('text')).toBeVisible({ timeout: 10000 });
```

**Issue:** Flaky tests
**Fix:**
- Remove `waitForTimeout`, use `waitFor` instead
- Use Playwright's auto-waiting
- Ensure proper test isolation
- Check for race conditions

---

## Keyboard Shortcuts

### Vitest UI Mode

- `r` - Rerun tests
- `f` - Filter by file name
- `t` - Filter by test name
- `w` - Watch mode toggle
- `c` - Clear console

### Playwright UI Mode

- `r` - Run all tests
- `Shift+R` - Run failed tests
- `Ctrl+F` - Search tests
- `Ctrl+,` - Settings

---

## Resources

- **Vitest:** https://vitest.dev
- **Playwright:** https://playwright.dev
- **Testing Library:** https://testing-library.com
- **MSW:** https://mswjs.io

---

## Quick Help

**Need help?**
- Slack: `#testing-strategy`
- Docs: `TESTING_IMPLEMENTATION_GUIDE.md`
- Examples: `frontend/src/__tests__/` and `frontend/tests/e2e/`
