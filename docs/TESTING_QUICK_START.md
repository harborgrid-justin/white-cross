# Testing Quick Start Guide

## 🚀 Getting Started

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test:coverage
```

### Run E2E Tests
```bash
npm run test:e2e
```

---

## 📝 Common Test Commands

```bash
# Watch mode (auto-rerun on changes)
npm test:watch

# Run specific test file
npm test -- src/components/ui/buttons/Button.test.tsx

# Run tests matching pattern
npm test -- --testPathPattern=student

# E2E in headed mode (see browser)
npm run test:e2e:headed

# E2E in UI mode (interactive)
npm run playwright:ui

# View Playwright report
npm run playwright:report
```

---

## ✅ Quick Test Checklist

Before committing code:

- [ ] All unit tests pass (`npm test`)
- [ ] No test coverage decrease
- [ ] E2E tests pass for affected features
- [ ] New features have tests
- [ ] Bug fixes have regression tests
- [ ] No PHI in test data
- [ ] Accessibility tested

---

## 📖 Writing Your First Test

### Component Test

```typescript
// src/components/MyButton.test.tsx
import { render, screen } from '../../../tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { MyButton } from './MyButton';

describe('MyButton', () => {
  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<MyButton onClick={onClick}>Click Me</MyButton>);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Test

```typescript
// src/hooks/useMyHook.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useMyHook } from './useMyHook';

describe('useMyHook', () => {
  it('should fetch data successfully', async () => {
    const { result } = renderHook(() => useMyHook());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

### E2E Test

```typescript
// tests/e2e/my-feature.spec.ts
import { test, expect } from '@playwright/test';

test('should complete user workflow', async ({ page }) => {
  await page.goto('/my-feature');

  await page.getByLabel('Name').fill('John Doe');
  await page.getByRole('button', { name: /submit/i }).click();

  await expect(page.getByText(/success/i)).toBeVisible();
});
```

---

## 🎯 Test Examples

### Testing Forms

```typescript
const user = userEvent.setup();

render(<StudentForm />);

// Fill form
await user.type(screen.getByLabelText(/first name/i), 'John');
await user.selectOption(screen.getByLabelText(/grade/i), '8');

// Submit
await user.click(screen.getByRole('button', { name: /submit/i }));

// Assert
await expect(screen.getByText(/success/i)).toBeInTheDocument();
```

### Testing API Calls

```typescript
import { server } from '../../../tests/mocks/server';
import { http, HttpResponse } from 'msw';

// Mock API response
server.use(
  http.get('http://localhost:3001/api/v1/students', () => {
    return HttpResponse.json({
      success: true,
      data: { students: [...] },
    });
  })
);

// Test component that calls API
const { result } = renderHook(() => useStudents());

await waitFor(() => {
  expect(result.current.isSuccess).toBe(true);
});
```

### Testing Accessibility

```typescript
import { testA11y } from '../../../tests/utils/accessibility-helpers';

it('should be accessible', async () => {
  await testA11y(<MyComponent />);
});
```

---

## 🔍 Debugging Tests

### Debug Single Test

```bash
# Run one test in watch mode
npm test -- Button.test.tsx --watch

# Run with verbose output
npm test -- Button.test.tsx --verbose
```

### Debug E2E Test

```bash
# Run in debug mode (pauses execution)
npm run playwright:debug

# Run in headed mode (see browser)
npm run test:e2e:headed
```

### View Test in Browser

```typescript
import { screen, debug } from '@testing-library/react';

// Print DOM to console
debug();

// Print specific element
debug(screen.getByRole('button'));
```

---

## 🚨 Common Issues

### Issue: Test times out
```typescript
// Increase timeout
jest.setTimeout(10000);

// Or in specific test
it('long test', async () => {
  // ...
}, 10000);
```

### Issue: Can't find element
```typescript
// Use screen.debug() to see DOM
debug();

// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText('Loading')).toBeInTheDocument();
});

// Or use findBy (built-in wait)
const element = await screen.findByText('Loaded');
```

### Issue: Mock not working
```typescript
// Ensure MSW server is started (automatic in jest.setup.ts)

// Reset handlers between tests
beforeEach(() => {
  server.resetHandlers();
});

// Override handler for specific test
server.use(
  http.get('**/api/students', () => {
    return HttpResponse.json({ ... });
  })
);
```

---

## 📚 Useful Resources

- **Full Documentation**: See [TESTING.md](./TESTING.md)
- **Coverage Report**: Run `npm test:coverage` then open `coverage/lcov-report/index.html`
- **Playwright Report**: Run `npm run playwright:report`

---

## 💡 Tips

- ✅ Test user behavior, not implementation
- ✅ Use `getByRole` and `getByLabel` (most accessible)
- ✅ Avoid `getByTestId` unless necessary
- ✅ Test error states and edge cases
- ✅ Keep tests simple and focused
- ✅ Use descriptive test names
- ✅ Don't test third-party libraries

---

## 🎓 Learning Path

1. **Start Here**: Read [TESTING.md](./TESTING.md)
2. **See Examples**: Review existing tests in `src/**/*.test.tsx`
3. **Try Writing**: Add test for new component
4. **Run Tests**: `npm test:watch` for instant feedback
5. **Check Coverage**: `npm test:coverage`
6. **Write E2E**: Try adding scenario to `tests/e2e/`

---

**Happy Testing! 🧪**
