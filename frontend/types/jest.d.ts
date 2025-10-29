/**
 * Jest Global Type Definitions
 *
 * Provides TypeScript type definitions for Jest globals used throughout test files.
 * This ensures proper type checking for test functions, mocks, and matchers.
 */

/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';

declare global {
  namespace NodeJS {
    interface Global {
      React: typeof import('react');
      fetch: typeof fetch;
      Request: typeof Request;
      Response: typeof Response;
      Headers: typeof Headers;
    }
  }
}

export {};
