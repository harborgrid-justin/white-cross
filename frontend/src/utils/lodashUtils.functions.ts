/**
 * WF-COMP-343 | lodashUtils.functions.ts - Function, date, validation, and math utilities
 * Purpose: General-purpose utility functions using lodash
 * Upstream: React, external libs | Dependencies: lodash
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: lodashUtils.ts, other utility modules
 * Exports: functionUtils, dateUtils, validationUtils, mathUtils
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Data processing → Function operations
 * LLM Context: Function utilities module, part of refactored lodashUtils
 */

import _ from 'lodash';

/**
 * Function utility functions for common operations
 * Provides type-safe lodash wrappers for function manipulation
 */
export const functionUtils = {
  /**
   * Debounces function calls
   */
  debounce: <TFunc extends (...args: readonly unknown[]) => unknown>(
    func: TFunc,
    wait: number,
    options?: _.DebounceSettings
  ) => _.debounce(func, wait, options),

  /**
   * Throttles function calls
   */
  throttle: <TFunc extends (...args: readonly unknown[]) => unknown>(
    func: TFunc,
    wait: number,
    options?: _.ThrottleSettings
  ) => _.throttle(func, wait, options),

  /**
   * Memoizes function results
   */
  memoize: <TFunc extends (...args: readonly unknown[]) => unknown>(func: TFunc) => _.memoize(func),

  /**
   * Creates a function that negates the result of the predicate
   */
  negate: <T>(predicate: (...args: T[]) => boolean) => _.negate(predicate),

  /**
   * Creates a function that performs a partial deep comparison
   */
  matches: <T>(source: T) => () => _.matches(source),

  /**
   * Creates a function that checks if all predicates return truthy
   */
  overEvery: <T>(predicates: (() => boolean)[]) => () => _.overEvery(predicates),

  /**
   * Creates a function that checks if some predicates return truthy
   */
  overSome: <T>(predicates: (() => boolean)[]) => () => _.overSome(predicates),
};

/**
 * Date utility functions for common operations
 * Provides date manipulation and formatting utilities
 */
export const dateUtils = {
  /**
   * Checks if date is today
   */
  isToday: (date: Date | string) => {
    const today = new Date();
    const compareDate = new Date(date);
    return _.isEqual(
      { year: today.getFullYear(), month: today.getMonth(), date: today.getDate() },
      { year: compareDate.getFullYear(), month: compareDate.getMonth(), date: compareDate.getDate() }
    );
  },

  /**
   * Checks if date is within last N days
   */
  isWithinLastDays: (date: Date | string, days: number) => {
    const compareDate = new Date(date);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return compareDate >= cutoffDate;
  },

  /**
   * Groups dates by day/week/month
   */
  groupByPeriod: <T extends { date: Date | string }>(
    items: T[],
    period: 'day' | 'week' | 'month'
  ) => {
    return _.groupBy(items, (item: T) => {
      const date = new Date(item.date);
      switch (period) {
        case 'day':
          return date.toDateString();
        case 'week': {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          return weekStart.toDateString();
        }
        case 'month':
          return `${date.getFullYear()}-${date.getMonth()}`;
        default:
          return date.toDateString();
      }
    });
  },

  /**
   * Formats date for display
   */
  formatDate: (date: Date | string, _format: string = 'MM/DD/YYYY') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  },

  /**
   * Gets relative time (e.g., "2 hours ago")
   */
  getRelativeTime: (date: Date | string) => {
    const now = new Date();
    const compareDate = new Date(date);
    const diffInMs = now.getTime() - compareDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return compareDate.toLocaleDateString();
  },
};

/**
 * Validation utility functions for common operations
 * Provides validation helpers for forms and data
 */
export const validationUtils = {
  /**
   * Checks if value is empty (null, undefined, empty string, empty array, empty object)
   */
  isEmpty: (value: unknown) => _.isEmpty(value),

  /**
   * Checks if value is not empty
   */
  isNotEmpty: (value: unknown) => !_.isEmpty(value),

  /**
   * Checks if all values in array are unique
   */
  isUnique: <T>(array: T[]) => _.uniq(array).length === array.length,

  /**
   * Validates email format
   */
  isValidEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validates phone number format
   */
  isValidPhoneNumber: (phone: string) => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 10;
  },

  /**
   * Validates URL format
   */
  isValidUrl: (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Checks if string is alphanumeric
   */
  isAlphaNumeric: (str: string) => /^[a-zA-Z0-9]+$/.test(str),

  /**
   * Checks if string contains only letters
   */
  isAlpha: (str: string) => /^[a-zA-Z]+$/.test(str),

  /**
   * Checks if string contains only numbers
   */
  isNumeric: (str: string) => /^[0-9]+$/.test(str),
};

/**
 * Math utility functions for common operations
 * Provides mathematical calculations and formatting
 */
export const mathUtils = {
  /**
   * Calculates sum of array of numbers
   */
  sum: (array: number[]) => _.sum(array),

  /**
   * Calculates average of array of numbers
   */
  mean: (array: number[]) => _.mean(array),

  /**
   * Finds minimum value in array
   */
  min: (array: number[]) => _.min(array),

  /**
   * Finds maximum value in array
   */
  max: (array: number[]) => _.max(array),

  /**
   * Rounds number to specified precision
   */
  round: (num: number, precision: number = 0) => _.round(num, precision),

  /**
   * Generates random number between min and max
   */
  random: (min: number = 0, max: number = 1) => _.random(min, max),

  /**
   * Clamps number between min and max
   */
  clamp: (num: number, min: number, max: number) => _.clamp(num, min, max),

  /**
   * Calculates percentage of a number
   */
  percentage: (num: number, total: number) => _.round((num / total) * 100, 2),

  /**
   * Formats number as currency
   */
  formatCurrency: (num: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(num);
  },

  /**
   * Formats number with commas
   */
  formatNumber: (num: number) => _.toNumber(num.toLocaleString()),
};
