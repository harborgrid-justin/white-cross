/**
 * Jest Global Type Definitions
 *
 * Provides TypeScript type definitions for Jest globals used throughout test files.
 * This ensures proper type checking for test functions, mocks, and matchers.
 */

/// <reference types="jest" />

import '@testing-library/jest-dom';

/**
 * Custom matcher type definitions for healthcare-specific validations
 */
declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Validates that a string is a properly formatted email address
       * @example expect('test@example.com').toBeValidEmail()
       */
      toBeValidEmail(): R;

      /**
       * Validates that a string represents a valid date
       * @example expect('2024-01-15').toBeValidDate()
       */
      toBeValidDate(): R;

      /**
       * Validates that a string is a properly formatted phone number
       * @example expect('555-123-4567').toBeValidPhoneNumber()
       */
      toBeValidPhoneNumber(): R;

      /**
       * Validates that a number falls within a specified range (inclusive)
       * @param min - Minimum value (inclusive)
       * @param max - Maximum value (inclusive)
       * @example expect(5).toBeWithinRange(1, 10)
       */
      toBeWithinRange(min: number, max: number): R;
    }

    interface Expect {
      /**
       * Validates that a string is a properly formatted email address
       */
      toBeValidEmail(): jest.Matchers<void>;

      /**
       * Validates that a string represents a valid date
       */
      toBeValidDate(): jest.Matchers<void>;

      /**
       * Validates that a string is a properly formatted phone number
       */
      toBeValidPhoneNumber(): jest.Matchers<void>;

      /**
       * Validates that a number falls within a specified range (inclusive)
       */
      toBeWithinRange(min: number, max: number): jest.Matchers<void>;
    }
  }

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
