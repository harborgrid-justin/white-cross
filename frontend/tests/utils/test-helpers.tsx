/**
 * Test Helper Utilities
 * Shared utilities for testing across the application
 */

import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';

/**
 * Create a QueryClient for testing with retry disabled
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Silence errors in tests
    },
  });
}

/**
 * Providers wrapper for testing components
 */
interface TestProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

export function TestProviders({ children, queryClient }: TestProvidersProps) {
  const client = queryClient || createTestQueryClient();

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * Custom render with all providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { queryClient, ...renderOptions } = options || {};

  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: ({ children }) => (
        <TestProviders queryClient={queryClient}>
          {children}
        </TestProviders>
      ),
      ...renderOptions,
    }),
  };
}

/**
 * Wait for loading to complete
 */
export async function waitForLoadingToComplete(container: HTMLElement) {
  const { waitForElementToBeRemoved } = await import('@testing-library/react');

  try {
    await waitForElementToBeRemoved(
      () => container.querySelector('[role="status"]') ||
            container.querySelector('.loading-spinner') ||
            container.querySelector('[aria-busy="true"]'),
      { timeout: 5000 }
    );
  } catch {
    // Element might not exist or already be removed
  }
}

/**
 * Mock authenticated user
 */
export function mockAuthenticatedUser(overrides = {}) {
  return {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'nurse',
    permissions: ['students:read', 'students:write'],
    ...overrides,
  };
}

/**
 * Mock student data
 */
export function mockStudent(overrides = {}) {
  return {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2010-05-15',
    grade: '10',
    studentNumber: 'STU001',
    status: 'active',
    emergencyContacts: [],
    allergies: [],
    chronicConditions: [],
    ...overrides,
  };
}

/**
 * Mock medication data
 */
export function mockMedication(overrides = {}) {
  return {
    id: '1',
    studentId: '1',
    name: 'Ibuprofen',
    dosage: '200mg',
    frequency: 'As needed',
    route: 'Oral',
    prescribedBy: 'Dr. Smith',
    startDate: '2024-01-01',
    status: 'active',
    ...overrides,
  };
}

/**
 * Mock appointment data
 */
export function mockAppointment(overrides = {}) {
  return {
    id: '1',
    studentId: '1',
    type: 'Health Screening',
    scheduledAt: '2024-02-15T10:00:00Z',
    duration: 30,
    status: 'scheduled',
    notes: 'Annual health screening',
    ...overrides,
  };
}

/**
 * Mock API response structure
 */
export function mockApiResponse<T>(data: T, overrides = {}) {
  return {
    success: true,
    data,
    ...overrides,
  };
}

/**
 * Mock paginated API response
 */
export function mockPaginatedResponse<T>(
  data: T[],
  page = 1,
  limit = 10,
  total?: number
) {
  return {
    success: true,
    data: {
      items: data,
      pagination: {
        page,
        limit,
        total: total ?? data.length,
        totalPages: Math.ceil((total ?? data.length) / limit),
      },
    },
  };
}

/**
 * Mock error response
 */
export function mockErrorResponse(message = 'An error occurred', status = 500) {
  return {
    success: false,
    error: message,
    status,
  };
}

/**
 * Simulate network delay
 */
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fill form fields
 */
export async function fillForm(
  fields: Record<string, string>,
  user: ReturnType<typeof userEvent.setup>
) {
  const { screen } = await import('@testing-library/react');

  for (const [label, value] of Object.entries(fields)) {
    const input = screen.getByLabelText(new RegExp(label, 'i'));
    await user.clear(input);
    await user.type(input, value);
  }
}

/**
 * Submit form
 */
export async function submitForm(
  buttonText = /submit/i,
  user: ReturnType<typeof userEvent.setup>
) {
  const { screen } = await import('@testing-library/react');

  const submitButton = screen.getByRole('button', { name: buttonText });
  await user.click(submitButton);
}

/**
 * Check for validation errors
 */
export async function expectValidationError(errorText: string | RegExp) {
  const { screen } = await import('@testing-library/react');
  const { waitFor } = await import('@testing-library/react');

  await waitFor(() => {
    expect(screen.getByText(errorText)).toBeInTheDocument();
  });
}

/**
 * Mock localStorage
 */
export function mockLocalStorage() {
  const storage: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => storage[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      storage[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete storage[key];
    }),
    clear: jest.fn(() => {
      Object.keys(storage).forEach((key) => delete storage[key]);
    }),
    get length() {
      return Object.keys(storage).length;
    },
    key: jest.fn((index: number) => {
      const keys = Object.keys(storage);
      return keys[index] || null;
    }),
  };
}

/**
 * Mock sessionStorage
 */
export function mockSessionStorage() {
  return mockLocalStorage(); // Same implementation
}

/**
 * Assert API call was made
 */
export function expectApiCall(
  mockFn: jest.Mock,
  endpoint: string,
  method = 'GET',
  body?: any
) {
  if (body) {
    expect(mockFn).toHaveBeenCalledWith(
      expect.stringContaining(endpoint),
      expect.objectContaining({
        method,
        body: expect.any(String),
      })
    );
  } else {
    expect(mockFn).toHaveBeenCalledWith(
      expect.stringContaining(endpoint),
      expect.objectContaining({
        method,
      })
    );
  }
}

/**
 * Reset all mocks between tests
 */
export function resetAllMocks() {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
}

/**
 * Create mock router
 */
export function mockRouter(overrides = {}) {
  return {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    query: {},
    ...overrides,
  };
}

/**
 * Create mock searchParams
 */
export function mockSearchParams(params: Record<string, string> = {}) {
  return new URLSearchParams(params);
}

/**
 * Snapshot test helper
 */
export function createSnapshot(ui: ReactElement) {
  const { container } = render(ui);
  expect(container).toMatchSnapshot();
}

/**
 * Accessibility test helper
 */
export async function expectNoA11yViolations(container: HTMLElement) {
  const { axe, toHaveNoViolations } = await import('jest-axe');
  expect.extend(toHaveNoViolations);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

/**
 * Generate test ID
 */
export function generateTestId(prefix = 'test') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Mock intersection observer
 */
export function mockIntersectionObserver() {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(() => []),
  })) as any;
}

/**
 * Mock resize observer
 */
export function mockResizeObserver() {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })) as any;
}

/**
 * Mock window.matchMedia
 */
export function mockMatchMedia(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

/**
 * Create test file
 */
export function createTestFile(
  name = 'test.txt',
  content = 'test content',
  type = 'text/plain'
) {
  return new File([content], name, { type });
}

/**
 * Trigger file upload
 */
export async function uploadFile(
  input: HTMLElement,
  file: File,
  user: ReturnType<typeof userEvent.setup>
) {
  await user.upload(input, file);
}

// Re-export commonly used testing utilities
export * from '@testing-library/react';
export { userEvent };
