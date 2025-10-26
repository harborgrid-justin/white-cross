/**
 * Vitest Type Declarations
 * Provides TypeScript support for Vitest globals and custom matchers
 */

/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace Vi {
    interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {
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

  // Augment globalThis with test-specific properties
  var IntersectionObserver: {
    new (): {
      disconnect(): void;
      observe(): void;
      takeRecords(): any[];
      unobserve(): void;
    };
  };

  var ResizeObserver: {
    new (): {
      disconnect(): void;
      observe(): void;
      unobserve(): void;
    };
  };

  // IndexedDB types for testing
  var indexedDB: {
    open(name: string, version?: number): Promise<any>;
    deleteDatabase(name: string): Promise<void>;
  };
}

export {};
