/**
 * Vitest Setup File
 *
 * Global test setup and configuration for Vitest tests.
 * Runs before all test files to configure the testing environment.
 *
 * @module vitest.setup
 */

import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { toHaveNoViolations } from 'jest-axe';

// ===========================================================================
// JEST-AXE SETUP
// ===========================================================================

// Extend Vitest's expect with jest-axe matchers for accessibility testing
expect.extend(toHaveNoViolations);

// ===========================================================================
// REACT TESTING LIBRARY CLEANUP
// ===========================================================================

// Automatically cleanup after each test
// Unmounts React trees that were mounted with render
afterEach(() => {
  cleanup();
});

// ===========================================================================
// JSDOM SETUP
// ===========================================================================

// Mock window.matchMedia for components that use media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.ResizeObserver for components that use it
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.IntersectionObserver for components that use it
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: vi.fn(),
}));

// Mock scrollTo for components that use it
window.scrollTo = vi.fn();

// Mock requestAnimationFrame for animation testing
window.requestAnimationFrame = vi.fn((callback) => {
  callback(0);
  return 0;
});

window.cancelAnimationFrame = vi.fn();

// ===========================================================================
// NAVIGATOR MOCKS
// ===========================================================================

// Mock navigator.clipboard for clipboard operations
Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
});

// Mock navigator.platform for OS-specific keyboard shortcuts
Object.defineProperty(navigator, 'platform', {
  writable: true,
  value: 'MacIntel', // Default to Mac, tests can override
});

// ===========================================================================
// CONSOLE SUPPRESSIONS
// ===========================================================================

// Suppress specific console warnings during tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    // Suppress React 18 warnings that are expected in tests
    const suppressedWarnings = [
      'Warning: ReactDOM.render',
      'Warning: useLayoutEffect does nothing on the server',
      'Not implemented: HTMLFormElement.prototype.submit',
    ];

    const shouldSuppress = suppressedWarnings.some((warning) =>
      args[0]?.toString().includes(warning)
    );

    if (!shouldSuppress) {
      originalError(...args);
    }
  };

  console.warn = (...args: any[]) => {
    // Suppress specific warnings
    const suppressedWarnings = [
      'componentWillReceiveProps',
      'componentWillMount',
    ];

    const shouldSuppress = suppressedWarnings.some((warning) =>
      args[0]?.toString().includes(warning)
    );

    if (!shouldSuppress) {
      originalWarn(...args);
    }
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// ===========================================================================
// CANVAS MOCK
// ===========================================================================

// Mock HTMLCanvasElement for components that use canvas
HTMLCanvasElement.prototype.getContext = vi.fn((contextType: string) => {
  if (contextType === '2d') {
    return {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
    };
  }
  return null;
});

// ===========================================================================
// STRUCTUREDCLONE POLYFILL
// ===========================================================================

// Ensure structuredClone is available (for Node < 17)
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}

// ===========================================================================
// ZUSTAND CLEANUP
// ===========================================================================

// Reset Zustand stores between tests to prevent state leakage
afterEach(() => {
  // Clear all Zustand store subscriptions
  const stores = (global as any).__ZUSTAND_STORES__ || [];
  stores.forEach((store: any) => {
    if (store && typeof store.destroy === 'function') {
      store.destroy();
    }
  });
});

// ===========================================================================
// TEST UTILITIES
// ===========================================================================

/**
 * Wait for async operations to complete
 */
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Flush all promises in the microtask queue
 */
export const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

/**
 * Create a mock File object for file upload testing
 */
export const createMockFile = (
  name: string = 'test.txt',
  content: string = 'test content',
  type: string = 'text/plain'
): File => {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
};

/**
 * Create a mock DragEvent for drag and drop testing
 */
export const createMockDragEvent = (
  type: string,
  dataTransfer?: Partial<DataTransfer>
): DragEvent => {
  const event = new Event(type, { bubbles: true, cancelable: true }) as DragEvent;

  Object.defineProperty(event, 'dataTransfer', {
    value: {
      dropEffect: 'none',
      effectAllowed: 'all',
      files: [],
      items: [],
      types: [],
      getData: vi.fn(),
      setData: vi.fn(),
      clearData: vi.fn(),
      setDragImage: vi.fn(),
      ...dataTransfer,
    },
    writable: true,
  });

  return event;
};

// ===========================================================================
// GLOBAL TEST ENVIRONMENT INFO
// ===========================================================================

console.log('✓ Vitest test environment initialized');
console.log(`  - Node version: ${process.version}`);
console.log(`  - Platform: ${process.platform}`);
console.log(`  - Environment: jsdom`);
console.log(`  - Accessibility testing: Enabled (jest-axe)`);
