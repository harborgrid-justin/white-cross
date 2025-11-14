/**
 * Custom Jest Matchers for White Cross Healthcare Platform
 *
 * Provides domain-specific matchers for healthcare data validation including:
 * - Email validation
 * - Date validation
 * - Phone number validation
 * - Numeric range validation
 *
 * These matchers improve test readability and provide clear error messages
 * for healthcare-specific validation scenarios.
 *
 * @module tests/utils/custom-matchers
 */

import { expect } from '@jest/globals';

/**
 * Custom matcher type definitions
 */
interface CustomMatchers<R = unknown> {
  /**
   * Validates that a string is a properly formatted email address
   * @example
   * expect('test@example.com').toBeValidEmail()
   */
  toBeValidEmail(): R;

  /**
   * Validates that a string represents a valid date
   * @example
   * expect('2024-01-15').toBeValidDate()
   */
  toBeValidDate(): R;

  /**
   * Validates that a string is a properly formatted phone number
   * @example
   * expect('555-123-4567').toBeValidPhoneNumber()
   */
  toBeValidPhoneNumber(): R;

  /**
   * Validates that a number falls within a specified range (inclusive)
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @example
   * expect(5).toBeWithinRange(1, 10)
   */
  toBeWithinRange(min: number, max: number): R;
}

// Extend Jest matchers with custom matchers
declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

/**
 * Validates email format using RFC 5322 simplified regex
 */
expect.extend({
  toBeValidEmail(received: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const pass = emailRegex.test(received);

    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid email`
          : `expected ${received} to be a valid email`,
    };
  },
});

/**
 * Validates date format (ISO 8601, MM/DD/YYYY, etc.) and parsability
 */
expect.extend({
  toBeValidDate(received: string) {
    const date = new Date(received);
    const pass = !isNaN(date.getTime());

    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid date`
          : `expected ${received} to be a valid date`,
    };
  },
});

/**
 * Validates US phone number formats
 * Accepts: (555) 123-4567, 555-123-4567, 5551234567
 */
expect.extend({
  toBeValidPhoneNumber(received: string) {
    const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    const pass = phoneRegex.test(received);

    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid phone number`
          : `expected ${received} to be a valid phone number`,
    };
  },
});

/**
 * Validates that a number is within a specified range (inclusive)
 */
expect.extend({
  toBeWithinRange(received: number, min: number, max: number) {
    const pass = received >= min && received <= max;

    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be within range ${min}-${max}`
          : `expected ${received} to be within range ${min}-${max} but got ${received}`,
    };
  },
});

export {};
