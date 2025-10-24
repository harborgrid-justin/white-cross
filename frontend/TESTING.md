# Frontend Testing Strategy & Documentation

## Overview

This document outlines the comprehensive testing strategy implemented for the White Cross Healthcare Platform frontend application. The testing infrastructure is built using **Vitest** and **React Testing Library** with MSW for API mocking.

## Table of Contents

- [Testing Infrastructure](#testing-infrastructure)
- [Test Organization](#test-organization)
- [Testing Utilities](#testing-utilities)
- [Test Data Factories](#test-data-factories)
- [Component Testing](#component-testing)
- [Hook Testing](#hook-testing)
- [Integration Testing](#integration-testing)
- [Running Tests](#running-tests)
- [Coverage Requirements](#coverage-requirements)
- [Best Practices](#best-practices)

## Testing Infrastructure

### Test Framework

- **Vitest**: Fast, Vite-native test runner with Jest-compatible API
- **React Testing Library**: User-centric component testing
- **MSW (Mock Service Worker)**: API mocking for isolated tests
- **@testing-library/user-event**: Realistic user interaction simulation

### Configuration

The project uses `vitest.config.ts` with the following key settings:

```typescript
{
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 65,
        statements: 70,
      }
    }
  }
}
```

## Test Organization

```
src/
├── components/
│   ├── ui/
│   │   ├── buttons/
│   │   │   ├── Button.tsx
│   │   │   └── Button.test.tsx
│   │   ├── inputs/
│   │   │   ├── Input.tsx
│   │   │   └── Input.test.tsx
│   │   └── ... (other UI components)
│   └── ...
├── hooks/
│   └── domains/
│       └── students/
│           ├── useStudents.ts
│           └── useStudents.test.ts
├── pages/
│   └── students/
│       ├── StudentsPage.tsx
│       └── StudentsPage.test.tsx
└── test/
    ├── setup.ts              # Global test setup
    ├── mocks/
    │   ├── handlers.ts       # MSW request handlers
    │   └── server.ts         # MSW server setup
    └── utils/
        ├── test-utils.tsx    # Custom render functions
        └── test-factories.ts # Test data generators
```

## Testing Utilities

### Custom Render Functions

Located in `/src/test/utils/test-utils.tsx`:

#### `renderWithProviders`
Renders components with all necessary providers (Redux, React Query, Router).

```typescript
import { render } from '@/test/utils/test-utils';

test('renders with providers', () => {
  const { store } = render(<MyComponent />, {
    preloadedState: { auth: { user: mockUser } }
  });
});
```

#### `renderHookWithProviders`
Tests custom hooks with provider context.

```typescript
import { renderHookWithProviders } from '@/test/utils/test-utils';

test('hook returns correct data', () => {
  const { result } = renderHookWithProviders(() => useMyHook());
  expect(result.current.data).toBeDefined();
});
```

#### `setupStore`
Creates a test Redux store with optional preloaded state.

```typescript
const store = setupStore({
  auth: { user: mockUser, isAuthenticated: true }
});
```

#### `createTestQueryClient`
Creates a React Query client configured for testing.

```typescript
const queryClient = createTestQueryClient();
```

## Test Data Factories

Located in `/src/test/utils/test-factories.ts`:

### Available Factories

```typescript
// User data
const user = createMockUser({ role: 'NURSE' });

// Student data
const student = createMockStudent({ grade: '5' });

// Health records
const healthRecord = createMockHealthRecord({ type: 'VITALS' });

// Medications
const medication = createMockMedication({ active: true });

// Appointments
const appointment = createMockAppointment({ status: 'SCHEDULED' });

// Allergies
const allergy = createMockAllergy({ severity: 'SEVERE' });

// Lists
const students = createMockList(createMockStudent, 10);

// API responses
const response = createMockApiResponse(data);
const error = createMockApiError({ message: 'Error' });

// Query results
const queryResult = createMockQueryResult(data);
const mutationResult = createMockMutationResult();
```

## Component Testing

### UI Component Test Structure

All UI components follow this testing pattern:

```typescript
describe('ComponentName', () => {
  describe('Rendering', () => {
    // Basic rendering tests
  });

  describe('Variants/Props', () => {
    // Test different prop variations
  });

  describe('User Interactions', () => {
    // Test user events (click, type, etc.)
  });

  describe('States', () => {
    // Test loading, disabled, error states
  });

  describe('Accessibility', () => {
    // Test ARIA attributes, keyboard navigation
  });
});
```

### Example: Button Component Test

```typescript
import { render, screen } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';

test('button handles click events', async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();

  render(<Button onClick={handleClick}>Click me</Button>);

  await user.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Example: Input Component Test

```typescript
test('input validates and shows error', async () => {
  const user = userEvent.setup();

  render(<Input label="Email" error="Invalid email" />);

  const input = screen.getByLabelText(/email/i);
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});
```

## Hook Testing

### Query Hook Pattern

```typescript
import { renderHookWithProviders } from '@/test/utils/test-utils';
import { waitFor } from '@testing-library/react';

test('useStudents fetches student data', async () => {
  const { result } = renderHookWithProviders(() => useStudents());

  await waitFor(() => {
    expect(result.current.students.isLoading).toBe(false);
  });

  expect(result.current.students.data).toHaveLength(25);
});
```

### Mutation Hook Pattern

```typescript
test('useCreateStudent creates a student', async () => {
  const { result } = renderHookWithProviders(() => useStudentMutations());

  await act(async () => {
    await result.current.createStudent.mutateAsync({
      firstName: 'John',
      lastName: 'Doe'
    });
  });

  await waitFor(() => {
    expect(result.current.createStudent.isSuccess).toBe(true);
  });
});
```

## Integration Testing

### Page Component Testing

```typescript
test('Students page loads and displays data', async () => {
  render(<StudentsPage />);

  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  // Verify data is displayed
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### User Workflow Testing

```typescript
test('creates a new student', async () => {
  const user = userEvent.setup();

  render(<StudentsPage />);

  // Open create modal
  await user.click(screen.getByRole('button', { name: /add student/i }));

  // Fill form
  await user.type(screen.getByLabelText(/first name/i), 'John');
  await user.type(screen.getByLabelText(/last name/i), 'Doe');

  // Submit
  await user.click(screen.getByRole('button', { name: /save/i }));

  // Verify success
  await waitFor(() => {
    expect(screen.getByText('Student created successfully')).toBeInTheDocument();
  });
});
```

## API Mocking with MSW

### Handler Structure

Located in `/src/test/mocks/handlers.ts`:

```typescript
export const handlers = [
  http.get('/api/students', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');

    let students = createMockList(createMockStudent, 25);

    if (search) {
      students = students.filter(s =>
        s.firstName.toLowerCase().includes(search.toLowerCase())
      );
    }

    return HttpResponse.json(createMockApiResponse({ students }));
  }),

  http.post('/api/students', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      createMockApiResponse(createMockStudent(body)),
      { status: 201 }
    );
  }),
];
```

### Override Handlers in Tests

```typescript
test('handles API error', async () => {
  server.use(
    http.get('/api/students', () => {
      return HttpResponse.json(
        createMockApiError({ message: 'Server error' }),
        { status: 500 }
      );
    })
  );

  render(<StudentsPage />);

  await waitFor(() => {
    expect(screen.getByText(/error loading students/i)).toBeInTheDocument();
  });
});
```

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- Button.test.tsx

# Run tests matching pattern
npm test -- --grep "Button"
```

### Watch Mode

```bash
# In watch mode, use these commands:
# a - run all tests
# f - run failed tests
# p - filter by filename
# t - filter by test name pattern
# q - quit watch mode
```

## Coverage Requirements

### Thresholds

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 65%
- **Statements**: 70%

### Excluded from Coverage

- Test files (`*.test.ts`, `*.spec.ts`)
- Test utilities (`src/test/**`)
- Type definitions (`*.d.ts`)
- Configuration files (`*.config.ts`)
- Index files exporting modules (`index.ts`)

### Viewing Coverage

```bash
npm run test:coverage

# Opens HTML report
open coverage/index.html
```

## Best Practices

### 1. Test User Behavior, Not Implementation

❌ **Bad**: Testing internal state
```typescript
expect(component.state.count).toBe(1);
```

✅ **Good**: Testing user-visible behavior
```typescript
expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
```

### 2. Use Accessible Queries

Priority order:
1. `getByRole` - Most accessible
2. `getByLabelText` - Form inputs
3. `getByPlaceholderText` - When no label
4. `getByText` - Non-interactive content
5. `getByTestId` - Last resort

### 3. Await Async Operations

```typescript
// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});

// Or use findBy queries (built-in async)
const element = await screen.findByText(/success/i);
```

### 4. Clean Up After Tests

```typescript
afterEach(() => {
  cleanup(); // Automatically done by setup
  server.resetHandlers(); // Reset MSW handlers
});
```

### 5. Test Error States

```typescript
test('shows error when API fails', async () => {
  server.use(
    http.get('/api/data', () => HttpResponse.error())
  );

  render(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('Error loading data');
  });
});
```

### 6. Test Loading States

```typescript
test('shows loading spinner', () => {
  render(<MyComponent />);
  expect(screen.getByRole('status')).toBeInTheDocument();
});
```

### 7. Use User Events, Not fireEvent

```typescript
// ❌ Avoid fireEvent
fireEvent.click(button);

// ✅ Use userEvent
const user = userEvent.setup();
await user.click(button);
```

### 8. Test Accessibility

```typescript
test('is accessible', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 9. Descriptive Test Names

```typescript
// ❌ Bad
test('works', () => {});

// ✅ Good
test('creates a student when form is submitted with valid data', () => {});
```

### 10. Arrange-Act-Assert Pattern

```typescript
test('example test', async () => {
  // Arrange: Set up test data and render
  const user = userEvent.setup();
  render(<MyComponent />);

  // Act: Perform user actions
  await user.click(screen.getByRole('button'));

  // Assert: Verify expected outcomes
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

## Common Patterns

### Testing Forms

```typescript
test('validates form and submits', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<StudentForm onSubmit={onSubmit} />);

  // Fill required fields
  await user.type(screen.getByLabelText(/first name/i), 'John');
  await user.type(screen.getByLabelText(/last name/i), 'Doe');

  // Submit
  await user.click(screen.getByRole('button', { name: /submit/i }));

  // Verify submission
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe'
    });
  });
});
```

### Testing Modals

```typescript
test('opens and closes modal', async () => {
  const user = userEvent.setup();

  render(<MyComponent />);

  // Open modal
  await user.click(screen.getByRole('button', { name: /open/i }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();

  // Close modal
  await user.click(screen.getByRole('button', { name: /close/i }));
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

### Testing Tables

```typescript
test('displays and sorts table data', async () => {
  const user = userEvent.setup();

  render(<StudentsTable />);

  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  // Verify rows
  const rows = screen.getAllByRole('row');
  expect(rows).toHaveLength(11); // Header + 10 data rows

  // Sort by column
  await user.click(screen.getByRole('button', { name: /sort by name/i }));

  // Verify sort order changed
  const firstRow = screen.getAllByRole('row')[1];
  expect(firstRow).toHaveTextContent('Alice');
});
```

### Testing Search/Filter

```typescript
test('filters students by search query', async () => {
  const user = userEvent.setup();

  render(<StudentsPage />);

  // Wait for initial load
  await waitFor(() => {
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  // Type search query
  const searchInput = screen.getByRole('searchbox');
  await user.type(searchInput, 'John');

  // Verify filtered results
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });
});
```

## Troubleshooting

### Tests Timeout

```typescript
// Increase timeout for specific test
test('slow operation', async () => {
  // ...
}, 10000); // 10 seconds
```

### Act Warnings

```typescript
// Wrap state updates in act()
await act(async () => {
  result.current.doSomething();
});
```

### Cleanup Issues

```typescript
// Ensure cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

### Query Not Found

```typescript
// Use findBy for elements that appear asynchronously
const element = await screen.findByText(/text/i);

// Use queryBy to assert element doesn't exist
expect(screen.queryByText(/text/i)).not.toBeInTheDocument();
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Test Coverage Status

### Components Tested
- ✅ Button (27 tests)
- ✅ Input (40+ tests)
- ✅ LoadingSpinner (10 tests)
- 🔄 Additional UI components (in progress)

### Hooks Tested
- 🔄 Query hooks (in progress)
- 🔄 Mutation hooks (in progress)
- 🔄 Composite hooks (in progress)

### Pages Tested
- 🔄 Critical user flows (in progress)

### Infrastructure
- ✅ Test utilities configured
- ✅ MSW handlers implemented
- ✅ Test factories created
- ✅ Vitest configuration updated
- ✅ Coverage thresholds set

## Contributing

When adding new tests:

1. Follow the established patterns
2. Use descriptive test names
3. Test user behavior, not implementation
4. Include accessibility tests
5. Cover error and edge cases
6. Maintain coverage thresholds
7. Update this documentation as needed

---

**Last Updated**: 2025-10-24
**Maintained By**: Frontend Team
**Version**: 1.0.0
