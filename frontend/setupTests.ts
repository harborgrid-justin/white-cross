/**
 * Jest Test Setup and Global Configuration
 *
 * Configures testing environment with:
 * - Jest-DOM custom matchers
 * - Mock Service Worker (MSW) for API mocking
 * - Global test utilities
 * - Custom matchers for accessibility
 * - Canvas mock for chart testing
 * - IntersectionObserver mock
 * - ResizeObserver mock
 *
 * This file runs once before all tests.
 *
 * @module setupTests
 * @version 1.0.0
 * @since 2025-11-04
 */

import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import { toHaveNoViolations } from 'jest-axe';
import { server } from './tests/mocks/server';

/**
 * Extend Jest matchers with custom accessibility matchers
 */
expect.extend(toHaveNoViolations);

/**
 * Mock Service Worker Setup
 * Intercepts network requests and provides mock responses
 */

// Enable MSW before all tests
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn', // Warn about unhandled requests
  });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Cleanup after all tests
afterAll(() => {
  server.close();
});

/**
 * Global Mocks for Browser APIs
 */

// Mock IntersectionObserver (used by lazy loading, infinite scroll)
global.IntersectionObserver = class IntersectionObserver {
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}

  observe() {
    return null;
  }

  unobserve() {
    return null;
  }

  disconnect() {
    return null;
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
};

// Mock ResizeObserver (used by responsive components, charts)
global.ResizeObserver = class ResizeObserver {
  constructor(public callback: ResizeObserverCallback) {}

  observe() {
    return null;
  }

  unobserve() {
    return null;
  }

  disconnect() {
    return null;
  }
};

// Mock matchMedia (used by responsive hooks, theme detection)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo (used by navigation, modals)
window.scrollTo = jest.fn();

// Mock scrollIntoView (used by focus management)
Element.prototype.scrollIntoView = jest.fn();

// Mock crypto.randomUUID (used by ID generation)
if (!global.crypto) {
  global.crypto = {} as Crypto;
}
global.crypto.randomUUID = jest.fn(() => '123e4567-e89b-12d3-a456-426614174000');

// Mock crypto.getRandomValues (used by encryption utilities)
global.crypto.getRandomValues = jest.fn((arr: any) => {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
});

/**
 * Mock Next.js Router
 */
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

/**
 * Mock Next.js Image component
 */
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

/**
 * Mock Next.js Font
 */
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'inter',
  }),
  Roboto: () => ({
    className: 'roboto',
  }),
}));

/**
 * Suppress console errors/warnings in tests
 * Uncomment specific lines to suppress expected errors/warnings
 */

const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // Suppress specific React warnings in tests
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (
        args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Warning: useLayoutEffect') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.requestSubmit')
      )
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('componentWillReceiveProps')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

/**
 * Global test timeout
 * Increase if tests are timing out
 */
jest.setTimeout(10000);

/**
 * Clean up after each test
 */
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
});

/**
 * Custom global matchers
 */
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}
