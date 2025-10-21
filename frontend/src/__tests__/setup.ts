/**
 * Vitest global setup file
 * Configures testing environment for all unit and integration tests
 */

import { expect, afterEach, vi, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  sessionStorage.clear();
  localStorage.clear();
});

// Setup global test environment
beforeAll(() => {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  } as any;

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;

  // Suppress console errors in tests (optional)
  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('Warning: ReactDOM.render') ||
          args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterAll(() => {
    console.error = originalError;
  });
});

// Extended matchers for healthcare-specific assertions
expect.extend({
  toBeValidToken(received: string) {
    const parts = received.split('.');
    const isValid = parts.length === 3;

    return {
      message: () => `expected ${received} to be a valid JWT token`,
      pass: isValid,
    };
  },

  toBeWithinTimeRange(received: number, expected: number, toleranceMs = 1000) {
    const diff = Math.abs(received - expected);
    const pass = diff <= toleranceMs;

    return {
      message: () =>
        `expected ${received} to be within ${toleranceMs}ms of ${expected} (diff: ${diff}ms)`,
      pass,
    };
  },

  toHaveCsrfToken(received: any) {
    const hasToken = received.headers &&
      (received.headers['X-CSRF-Token'] || received.headers['x-csrf-token']);

    return {
      message: () => `expected request to have CSRF token in headers`,
      pass: !!hasToken,
    };
  },
});

// Extend Vitest matchers type definitions
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeValidToken(): T;
    toBeWithinTimeRange(expected: number, toleranceMs?: number): T;
    toHaveCsrfToken(): T;
  }
  interface AsymmetricMatchersContaining {
    toBeValidToken(): any;
    toBeWithinTimeRange(expected: number, toleranceMs?: number): any;
    toHaveCsrfToken(): any;
  }
}
