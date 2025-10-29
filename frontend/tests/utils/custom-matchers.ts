import { expect } from '@jest/globals';

/**
 * Custom Jest matchers for testing
 */

expect.extend({
  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);

    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid email`
          : `expected ${received} to be a valid email`,
    };
  },

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

  toBeValidPhoneNumber(received: string) {
    // Simple phone number validation (US format)
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const pass = phoneRegex.test(received);

    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid phone number`
          : `expected ${received} to be a valid phone number`,
    };
  },

  toContainObject(received: any[], expected: any) {
    const pass = received.some((item) =>
      Object.keys(expected).every((key) => item[key] === expected[key])
    );

    return {
      pass,
      message: () =>
        pass
          ? `expected array not to contain object matching ${JSON.stringify(expected)}`
          : `expected array to contain object matching ${JSON.stringify(expected)}`,
    };
  },

  toHaveBeenCalledWithMatch(received: jest.Mock, expected: any) {
    const calls = received.mock.calls;
    const pass = calls.some((call) => {
      const arg = call[0];
      return Object.keys(expected).every((key) => arg[key] === expected[key]);
    });

    return {
      pass,
      message: () =>
        pass
          ? `expected function not to have been called with object matching ${JSON.stringify(expected)}`
          : `expected function to have been called with object matching ${JSON.stringify(expected)}`,
    };
  },

  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;

    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be within range ${floor} - ${ceiling}`
          : `expected ${received} to be within range ${floor} - ${ceiling}`,
    };
  },

  toHaveLoadingState(received: HTMLElement) {
    const hasLoadingText = received.textContent?.toLowerCase().includes('loading');
    const hasSpinner = received.querySelector('[role="status"]') !== null;
    const pass = hasLoadingText || hasSpinner;

    return {
      pass,
      message: () =>
        pass
          ? 'expected element not to have loading state'
          : 'expected element to have loading state (loading text or spinner)',
    };
  },

  toHaveErrorMessage(received: HTMLElement, expectedMessage?: string) {
    const errorElement = received.querySelector('[role="alert"]');
    const pass = expectedMessage
      ? errorElement?.textContent?.includes(expectedMessage) || false
      : errorElement !== null;

    return {
      pass,
      message: () =>
        pass
          ? `expected element not to have error message${expectedMessage ? ` "${expectedMessage}"` : ''}`
          : `expected element to have error message${expectedMessage ? ` "${expectedMessage}"` : ''}`,
    };
  },
});

// TypeScript type augmentation for custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidEmail(): R;
      toBeValidDate(): R;
      toBeValidPhoneNumber(): R;
      toContainObject(expected: any): R;
      toHaveBeenCalledWithMatch(expected: any): R;
      toBeWithinRange(floor: number, ceiling: number): R;
      toHaveLoadingState(): R;
      toHaveErrorMessage(expectedMessage?: string): R;
    }
  }
}

export {};
