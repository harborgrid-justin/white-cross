/**
 * Jest Test Environment Setup - White Cross Healthcare Platform
 *
 * This file configures the Jest test environment with necessary polyfills, mocks,
 * and global utilities for testing React components and Next.js features. It runs
 * once before each test file execution to establish a consistent testing environment.
 *
 * Key Responsibilities:
 * - Import testing utilities (@testing-library/jest-dom)
 * - Configure global polyfills (TextEncoder, Request, Response, Headers)
 * - Mock Next.js-specific APIs (navigation, router)
 * - Mock browser APIs (IntersectionObserver, ResizeObserver, matchMedia)
 * - Mock external dependencies (@faker-js/faker)
 * - Configure localStorage and sessionStorage mocks
 * - Set up environment variables for testing
 * - Suppress expected console errors in tests
 *
 * Healthcare Testing Context:
 * - All test data is synthetic (no real PHI)
 * - Mocks ensure HIPAA compliance in test environment
 * - Environment variables configure test API endpoints
 * - Storage mocks prevent PHI from persisting in tests
 *
 * Performance Considerations:
 * - Global mocks reduce per-test setup overhead
 * - Deterministic faker mocks improve test consistency
 * - Timeout set to 10 seconds for complex healthcare workflows
 *
 * @module jest.setup
 * @see https://jestjs.io/docs/configuration#setupfilesafterenv-array
 * @see https://testing-library.com/docs/react-testing-library/setup
 * @version 1.0.0
 * @since 2025-10-26
 */

import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import './tests/utils/custom-matchers';
import React from 'react';
import { TextEncoder, TextDecoder } from 'util';

// ==========================================
// GLOBAL REACT SETUP
// ==========================================

/**
 * Make React available globally for all test files.
 * Required for some testing utilities and older component tests.
 */
global.React = React;

// ==========================================
// NEXT.JS EDGE RUNTIME POLYFILLS
// ==========================================

/**
 * Polyfill TextEncoder for Next.js Edge Runtime compatibility.
 * Required for Server Components and middleware testing.
 */
global.TextEncoder = TextEncoder;

/**
 * Polyfill TextDecoder for Next.js Edge Runtime compatibility.
 * Required for Server Components and middleware testing.
 */
global.TextDecoder = TextDecoder as any;

// ==========================================
// WEB API MOCKS (Request, Response, Headers)
// ==========================================

/**
 * Mock Request class for Next.js Edge Runtime and Server Actions testing.
 *
 * Provides a minimal implementation of the Fetch API Request interface
 * for testing healthcare API interactions without a real network.
 */
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    private _url: string;
    public init?: any;
    public headers: any;
    public method: string;
    public body: any;

    constructor(url: string, init?: any) {
      this._url = url;
      this.init = init;
      this.method = init?.method || 'GET';
      this.body = init?.body;

      // Convert headers object to Headers instance if needed
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
  } as any;
}

/**
 * Mock Response class for Next.js Edge Runtime and Server Actions testing.
 *
 * Provides a minimal implementation of the Fetch API Response interface
 * with support for JSON responses commonly used in healthcare APIs.
 */
if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(public body?: any, public init?: any) {}

    /**
     * Creates a JSON response with appropriate headers.
     *
     * @param {any} data - Data to serialize as JSON
     * @param {any} init - Response initialization options
     * @returns {Response} Response object with JSON content type
     */
    static json(data: any, init?: any) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
      });
    }
  } as any;
}

/**
 * Mock Headers class for HTTP header manipulation in tests.
 *
 * Provides a minimal implementation of the Fetch API Headers interface
 * for testing authentication, CORS, and healthcare-specific headers.
 */
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    private headers: Map<string, string> = new Map();

    constructor(init?: any) {
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this.headers.set(key.toLowerCase(), value as string);
        });
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
  } as any;
}

// ==========================================
// ENVIRONMENT VARIABLES
// ==========================================

/**
 * Configure test environment variables for healthcare API endpoints.
 *
 * These variables point to localhost test servers and are used consistently
 * across all tests to ensure reliable healthcare data API interactions.
 */
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001/api/v1';
process.env.NEXT_PUBLIC_GRAPHQL_URL = 'http://localhost:3001/graphql';
process.env.NEXT_PUBLIC_WS_URL = 'ws://localhost:3001';

// ==========================================
// NEXT.JS NAVIGATION MOCKS
// ==========================================

/**
 * Mock Next.js navigation hooks and functions.
 *
 * Provides test doubles for Next.js 13+ App Router navigation APIs,
 * enabling testing of healthcare workflows without actual route changes.
 *
 * Mocked APIs:
 * - useRouter: Access router programmatically
 * - usePathname: Get current pathname
 * - useSearchParams: Access URL search parameters
 * - useParams: Access dynamic route parameters
 * - notFound: Trigger 404 page
 * - redirect: Perform server-side redirect
 */
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      query: {},
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  useParams() {
    return {};
  },
  notFound: jest.fn(),
  redirect: jest.fn(),
}));

// ==========================================
// FETCH API MOCK
// ==========================================

/**
 * Mock global fetch for API request testing.
 *
 * Tests should mock fetch responses per-test to simulate healthcare
 * API interactions. Global mock prevents real network requests during tests.
 *
 * @example
 * ```typescript
 * (global.fetch as jest.Mock).mockResolvedValueOnce({
 *   ok: true,
 *   json: async () => ({ students: [...] })
 * });
 * ```
 */
global.fetch = jest.fn();

// ==========================================
// FAKER.JS MOCK
// ==========================================

/**
 * Mock @faker-js/faker with deterministic values for consistent testing.
 *
 * Provides fake data generation for healthcare test fixtures with predictable
 * outputs. Ensures test consistency and prevents flaky tests due to random data.
 *
 * HIPAA Note: All generated data is synthetic and does not represent real patients.
 *
 * Mocked modules:
 * - string: UUIDs, alphanumeric strings
 * - internet: Emails, URLs, IPs
 * - person: Names (synthetic patients)
 * - date: Birthdays, appointment dates
 * - location: Addresses (synthetic)
 * - phone: Phone numbers (synthetic)
 * - lorem: Text content
 * - helpers: Array utilities
 * - number: Numeric values
 * - datatype: Booleans
 */
jest.mock('@faker-js/faker', () => ({
  faker: {
    string: {
      uuid: () => '123e4567-e89b-12d3-a456-426614174000',
      alphanumeric: (length: number) => 'ABCD1234',
    },
    internet: {
      email: () => 'test@example.com',
      url: () => 'https://example.com',
      ip: () => '192.168.1.1',
      userAgent: () => 'Mozilla/5.0',
    },
    person: {
      firstName: () => 'John',
      lastName: () => 'Doe',
      fullName: () => 'John Doe',
    },
    date: {
      past: () => new Date('2023-01-15'),
      recent: () => new Date('2024-01-15'),
      future: () => new Date('2025-01-15'),
      birthdate: () => new Date('2010-05-15'),
    },
    location: {
      streetAddress: () => '123 Main St',
      city: () => 'Springfield',
      state: () => 'CA',
      zipCode: () => '12345',
    },
    phone: {
      number: () => '555-0123',
    },
    lorem: {
      sentence: () => 'Lorem ipsum dolor sit amet.',
      paragraph: () => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      words: (count: number) => 'lorem ipsum dolor',
    },
    helpers: {
      arrayElement: (arr: any[]) => arr[0],
    },
    number: {
      int: (options: any) => options?.min || 50,
      float: (options: any) => options?.min || 50.0,
    },
    datatype: {
      boolean: () => true,
    },
  },
}));

// ==========================================
// BROWSER API MOCKS
// ==========================================

/**
 * Mock IntersectionObserver API for component visibility testing.
 *
 * Used by infinite scroll, lazy loading, and viewport-based animations
 * in healthcare dashboards. Mock prevents "IntersectionObserver is not defined" errors.
 */
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

/**
 * Mock ResizeObserver API for responsive component testing.
 *
 * Used by charts, responsive tables, and dashboard layouts that adapt
 * to container size changes. Mock prevents "ResizeObserver is not defined" errors.
 */
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

/**
 * Mock window.matchMedia for responsive design testing.
 *
 * Enables testing of media query-based layouts and responsive healthcare
 * dashboards without a real browser viewport.
 *
 * @example
 * ```typescript
 * window.matchMedia('(min-width: 768px)').matches // Returns false in tests
 * ```
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ==========================================
// STORAGE API MOCKS
// ==========================================

/**
 * Mock localStorage for client-side storage testing.
 *
 * Healthcare Note: Per HIPAA compliance, PHI is never stored in localStorage.
 * This mock is primarily for non-PHI settings like UI preferences and auth tokens.
 *
 * @example
 * ```typescript
 * localStorage.getItem('theme') // Mocked in tests
 * localStorage.setItem('lastVisitedPage', '/dashboard')
 * ```
 */
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

global.localStorage = localStorageMock as Storage;

/**
 * Mock sessionStorage for temporary client-side storage testing.
 *
 * Healthcare Note: Session storage may contain PHI but is cleared on tab close.
 * Tests verify proper cleanup of sensitive data.
 *
 * @example
 * ```typescript
 * sessionStorage.setItem('currentPatient', JSON.stringify(patient))
 * sessionStorage.clear() // Verify cleanup in tests
 * ```
 */
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

global.sessionStorage = sessionStorageMock as Storage;

// ==========================================
// CONSOLE ERROR SUPPRESSION
// ==========================================

/**
 * Suppress expected console errors in tests to reduce noise.
 *
 * Filters out known React warnings and JSDOM limitations that don't indicate
 * real test failures. Actual application errors still appear in test output.
 */
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Warning: useLayoutEffect') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

/**
 * Restore original console.error after all tests complete.
 */
afterAll(() => {
  console.error = originalError;
});

// ==========================================
// GLOBAL TEST CONFIGURATION
// ==========================================

/**
 * Set global test timeout to 10 seconds.
 *
 * Healthcare workflows may involve complex component trees, multiple API calls,
 * and async operations. 10 second timeout prevents false failures while still
 * catching genuinely slow operations.
 *
 * @default 10000ms (10 seconds)
 */
jest.setTimeout(10000);

