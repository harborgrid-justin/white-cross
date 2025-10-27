# Testing Quick Start Guide
## Get Testing in 30 Minutes

**Goal**: Fix critical issues and write your first tests TODAY

---

## Step 1: Fix Test Runner (5 minutes)

### Current Problem
- Package.json has `jest` but tests use `vitest`
- `npm test` doesn't work
- Can't run coverage

### Solution: Choose Vitest (Recommended)

```bash
# 1. Install Vitest
cd /home/user/white-cross/nextjs
npm install -D vitest @vitest/ui @vitest/coverage-v8

# 2. Create vitest.config.ts
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        'tests/',
        '**/*.d.ts',
        '**/*.stories.tsx',
      ],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 90,
        statements: 95,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
EOF

# 3. Rename jest.setup.ts to vitest.setup.ts
mv jest.setup.ts vitest.setup.ts

# 4. Update package.json scripts
npm pkg set scripts.test="vitest"
npm pkg set scripts.test:watch="vitest --watch"
npm pkg set scripts.test:coverage="vitest --coverage"
npm pkg set scripts.test:ui="vitest --ui"

# 5. Test it works
npm test
```

✅ Done! Tests should now run.

---

## Step 2: Write Your First Server Component Test (10 minutes)

### Create a test for a server component

```typescript
// src/app/(dashboard)/students/__tests__/page.test.tsx

import { render, screen } from '@testing-library/react';
import StudentsPage from '../page';

// Mock Next.js server dependencies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: 'mock-token' })),
  })),
}));

// Mock your API client
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

import { apiClient } from '@/lib/api-client';

describe('Students Page (Server Component)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders student list from server data', async () => {
    // Mock API response
    (apiClient.get as jest.Mock).mockResolvedValue({
      students: [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          grade: '10th',
          studentNumber: 'STU001',
        },
      ],
      pagination: { total: 1, page: 1, limit: 20 },
    });

    // Render server component
    const page = await StudentsPage();
    render(page);

    // Verify data rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('STU001')).toBeInTheDocument();
  });

  it('handles errors without exposing PHI', async () => {
    // Mock error
    (apiClient.get as jest.Mock).mockRejectedValue(
      new Error('Database error with SSN 123-45-6789')
    );

    const page = await StudentsPage();
    render(page);

    // Should show generic error
    expect(screen.getByText(/unable to load/i)).toBeInTheDocument();

    // Should NOT show database details or PHI
    expect(screen.queryByText(/123-45-6789/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/database error/i)).not.toBeInTheDocument();
  });
});
```

**Run it**:
```bash
npm test src/app/(dashboard)/students/__tests__/page.test.tsx
```

---

## Step 3: Write Your First API Route Test (10 minutes)

### Create a test for an API route handler

```typescript
// src/app/api/students/__tests__/route.test.ts

import { GET, POST } from '../route';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/auth', () => ({
  verifyAuth: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  getStudents: jest.fn(),
  createStudent: jest.fn(),
}));

import { verifyAuth } from '@/lib/auth';
import { getStudents, createStudent } from '@/lib/db';

describe('Students API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/students', () => {
    it('requires authentication', async () => {
      (verifyAuth as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/students');
      const response = await GET(request);

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({
        error: 'Unauthorized',
      });
    });

    it('returns students for authenticated nurse', async () => {
      (verifyAuth as jest.Mock).mockResolvedValue({
        id: 'nurse-1',
        role: 'nurse',
      });

      (getStudents as jest.Mock).mockResolvedValue([
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
        },
      ]);

      const request = new NextRequest('http://localhost:3000/api/students');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.students).toHaveLength(1);
      expect(data.students[0].firstName).toBe('John');
    });

    it('sanitizes errors to prevent PHI leakage', async () => {
      (verifyAuth as jest.Mock).mockResolvedValue({
        id: 'nurse-1',
        role: 'nurse',
      });

      (getStudents as jest.Mock).mockRejectedValue(
        new Error('Database error: duplicate SSN 123-45-6789')
      );

      const request = new NextRequest('http://localhost:3000/api/students');
      const response = await GET(request);

      const data = await response.json();

      // Should NOT expose SSN or database details
      expect(data.error).not.toContain('123-45-6789');
      expect(data.error).not.toContain('Database error');
      expect(data.error).toMatch(/internal server error/i);
    });
  });

  describe('POST /api/students', () => {
    it('validates required fields', async () => {
      (verifyAuth as jest.Mock).mockResolvedValue({
        id: 'nurse-1',
        role: 'nurse',
      });

      const request = new NextRequest('http://localhost:3000/api/students', {
        method: 'POST',
        body: JSON.stringify({
          firstName: 'John',
          // Missing lastName, dateOfBirth
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.errors).toContainEqual(
        expect.objectContaining({
          field: 'lastName',
          message: expect.stringContaining('required'),
        })
      );
    });
  });
});
```

**Run it**:
```bash
npm test src/app/api/students/__tests__/route.test.ts
```

---

## Step 4: Write a Healthcare Component Test (5 minutes)

### Use the excellent test utilities already built

```typescript
// src/components/medications/__tests__/MedicationCard.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MedicationCard } from '../MedicationCard';
import { createMedication } from '@/tests/utils/test-factories';

describe('MedicationCard', () => {
  it('displays medication information', () => {
    const medication = createMedication({
      name: 'Ibuprofen',
      dosage: '200mg',
      frequency: 'Twice daily',
    });

    render(<MedicationCard medication={medication} />);

    expect(screen.getByText('Ibuprofen')).toBeInTheDocument();
    expect(screen.getByText('200mg')).toBeInTheDocument();
    expect(screen.getByText(/twice daily/i)).toBeInTheDocument();
  });

  it('shows critical allergy warning', () => {
    const medication = createMedication({
      name: 'Penicillin',
      allergyWarning: true,
      allergyDetails: {
        allergen: 'Penicillin',
        severity: 'severe',
      },
    });

    render(<MedicationCard medication={medication} />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/severe allergy/i);
    expect(alert).toHaveClass('bg-danger-100'); // Critical styling
  });

  it('requires witness for high-risk medications', async () => {
    const user = userEvent.setup();
    const medication = createMedication({
      name: 'Insulin',
      requiresDoubleCheck: true,
    });
    const onAdminister = jest.fn();

    render(
      <MedicationCard
        medication={medication}
        onAdminister={onAdminister}
      />
    );

    // Try to administer
    await user.click(screen.getByRole('button', { name: /administer/i }));

    // Should show witness requirement
    expect(screen.getByText(/witness required/i)).toBeInTheDocument();
    expect(onAdminister).not.toHaveBeenCalled();
  });

  it('meets accessibility standards', async () => {
    const { container } = render(
      <MedicationCard medication={createMedication()} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## Test Templates

### Server Component Template

```typescript
// Copy-paste template for testing server components

import { render, screen } from '@testing-library/react';
import PageComponent from '../page';

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: 'mock-token' })),
  })),
}));

jest.mock('@/lib/api-client', () => ({
  apiClient: { get: jest.fn(), post: jest.fn() },
}));

import { apiClient } from '@/lib/api-client';

describe('PageComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders data from server', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { /* your data */ },
    });

    const page = await PageComponent({ params: { id: '1' } });
    render(page);

    expect(screen.getByText(/expected content/i)).toBeInTheDocument();
  });

  it('handles errors gracefully', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('Failed'));

    const page = await PageComponent({ params: { id: '1' } });
    render(page);

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### API Route Template

```typescript
// Copy-paste template for testing API routes

import { GET, POST, PUT, DELETE } from '../route';
import { NextRequest } from 'next/server';

jest.mock('@/lib/auth', () => ({
  verifyAuth: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  getData: jest.fn(),
  createData: jest.fn(),
}));

import { verifyAuth } from '@/lib/auth';
import { getData, createData } from '@/lib/db';

describe('API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('requires authentication', async () => {
      (verifyAuth as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/endpoint');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('returns data for authenticated user', async () => {
      (verifyAuth as jest.Mock).mockResolvedValue({ id: 'user-1', role: 'nurse' });
      (getData as jest.Mock).mockResolvedValue([{ id: '1', name: 'Test' }]);

      const request = new NextRequest('http://localhost:3000/api/endpoint');
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveLength(1);
    });
  });

  describe('POST', () => {
    it('validates request body', async () => {
      (verifyAuth as jest.Mock).mockResolvedValue({ id: 'user-1', role: 'nurse' });

      const request = new NextRequest('http://localhost:3000/api/endpoint', {
        method: 'POST',
        body: JSON.stringify({ /* invalid data */ }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });
});
```

### Component Template

```typescript
// Copy-paste template for testing components

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from '../ComponentName';
import { createFactoryData } from '@/tests/utils/test-factories';

describe('ComponentName', () => {
  it('renders with default props', () => {
    render(<ComponentName />);

    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<ComponentName onClick={handleClick} />);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('displays loading state', () => {
    render(<ComponentName loading />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles error state', () => {
    render(<ComponentName error="Something went wrong" />);

    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
  });

  it('meets accessibility standards', async () => {
    const { container } = render(<ComponentName />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Hook Template

```typescript
// Copy-paste template for testing hooks

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCustomHook } from '../useCustomHook';

describe('useCustomHook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('fetches data successfully', async () => {
    const { result } = renderHook(() => useCustomHook(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  it('handles errors gracefully', async () => {
    // Mock error condition
    const { result } = renderHook(() => useCustomHook({ shouldError: true }), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});
```

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Single File
```bash
npm test src/path/to/file.test.tsx
```

### Run with Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

### UI Mode (Vitest)
```bash
npm run test:ui
```

---

## Next Steps

1. ✅ Fix test runner (Step 1)
2. ✅ Write 1 server component test (Step 2)
3. ✅ Write 1 API route test (Step 3)
4. ✅ Write 1 healthcare component test (Step 4)
5. ✅ Run coverage report: `npm run test:coverage`
6. ✅ Read full audit: [TESTING_STRATEGY_AUDIT.md](./TESTING_STRATEGY_AUDIT.md)
7. ✅ Follow 8-week roadmap

---

## Common Issues & Solutions

### Issue: "Cannot find module '@/...'"

**Solution**: Check `vitest.config.ts` has correct alias:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Issue: "ReferenceError: jest is not defined"

**Solution**: Either:
1. Use Vitest: `import { vi as jest } from 'vitest'`
2. Or add to vitest.config.ts: `globals: true`

### Issue: "Cannot read properties of undefined (reading 'getByText')"

**Solution**: Import from correct location:
```typescript
import { render, screen } from '@testing-library/react';
```

### Issue: "Element type is invalid"

**Solution**: Check component export/import:
```typescript
// Component file
export function Button() { ... }

// Test file
import { Button } from '../Button'; // ✅ Correct
```

---

## Resources

- **Test Utilities**: `/home/user/white-cross/nextjs/tests/utils/`
- **Test Factories**: `/home/user/white-cross/nextjs/tests/utils/test-factories.ts`
- **MSW Handlers**: `/home/user/white-cross/nextjs/tests/mocks/enhanced-handlers.ts`
- **Full Audit**: `/home/user/white-cross/nextjs/TESTING_STRATEGY_AUDIT.md`
- **Documentation**: `/home/user/white-cross/nextjs/docs/TESTING_GUIDE.md`

---

**Questions?** Read the full audit for detailed explanations and examples.

**Time to first test**: 30 minutes ⏱️
**Time to fix critical gaps**: 7 days 📅
**Time to 95% coverage**: 8 weeks 🎯
