/**
 * File: /reuse/frontend/composites/usace/downstream/shared-utilities.ts
 * Locator: WC-USACE-DS-SHARED-UTILS-001
 * Purpose: Shared utilities for USACE downstream composites
 *
 * LLM Context: Common utilities for all USACE downstream composites including
 * SSR-safe browser APIs, error boundaries, validation helpers, and formatting functions.
 * Ensures consistent enterprise patterns across all downstream modules.
 */

'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';

// ============================================================================
// SSR-SAFE BROWSER APIs
// ============================================================================

/**
 * SSR-safe window.confirm replacement
 *
 * @param {string} message - Confirmation message
 * @returns {boolean} User's confirmation result (false if SSR)
 *
 * @example
 * ```tsx
 * const confirmed = safeConfirm('Are you sure you want to delete this item?');
 * if (confirmed) {
 *   deleteItem();
 * }
 * ```
 */
export function safeConfirm(message: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.confirm(message);
}

/**
 * SSR-safe window.alert replacement
 *
 * @param {string} message - Alert message
 *
 * @example
 * ```tsx
 * safeAlert('Operation completed successfully');
 * ```
 */
export function safeAlert(message: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.alert(message);
}

/**
 * SSR-safe window.prompt replacement
 *
 * @param {string} message - Prompt message
 * @param {string} defaultValue - Default input value
 * @returns {string | null} User input (null if SSR or cancelled)
 *
 * @example
 * ```tsx
 * const name = safePrompt('Enter your name:', 'John Doe');
 * if (name) {
 *   console.log(`Hello, ${name}!`);
 * }
 * ```
 */
export function safePrompt(message: string, defaultValue?: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.prompt(message, defaultValue);
}

/**
 * SSR-safe localStorage wrapper
 *
 * @param {string} key - Storage key
 * @param {T} defaultValue - Default value if not found or SSR
 * @returns {T} Stored value or default
 *
 * @example
 * ```tsx
 * const userPrefs = safeLocalStorage('userPreferences', { theme: 'light' });
 * ```
 */
export function safeLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * SSR-safe localStorage setter
 *
 * @param {string} key - Storage key
 * @param {T} value - Value to store
 *
 * @example
 * ```tsx
 * safeSetLocalStorage('userPreferences', { theme: 'dark' });
 * ```
 */
export function safeSetLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// ============================================================================
// ERROR BOUNDARY COMPONENT
// ============================================================================

/**
 * Error boundary props interface
 */
export interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Custom fallback UI */
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  /** Error callback */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Error boundary state interface
 */
interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error: Error | null;
  /** Error information */
  errorInfo: ErrorInfo | null;
}

/**
 * React Error Boundary component for catching rendering errors
 *
 * @description Catches JavaScript errors anywhere in child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   onError={(error, errorInfo) => logErrorToService(error, errorInfo)}
 *   fallback={(error) => <CustomErrorUI error={error} />}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const { fallback } = this.props;
      const { error, errorInfo } = this.state;

      if (typeof fallback === 'function' && error && errorInfo) {
        return fallback(error, errorInfo);
      }

      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div
          role="alert"
          className="p-6 bg-red-50 border border-red-200 rounded-lg"
        >
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600 mb-4">
            An error occurred while rendering this component.
          </p>
          {process.env.NODE_ENV === 'development' && error && (
            <details className="text-sm text-red-700">
              <summary className="cursor-pointer font-medium mb-2">
                Error details (development only)
              </summary>
              <pre className="bg-red-100 p-4 rounded overflow-auto">
                {error.toString()}
                {errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates email format
 *
 * @param {string} email - Email address to validate
 * @returns {boolean} Whether email is valid
 *
 * @example
 * ```typescript
 * const isValid = isValidEmail('user@example.com'); // true
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates date is not in the past
 *
 * @param {Date} date - Date to validate
 * @returns {boolean} Whether date is in the future
 *
 * @example
 * ```typescript
 * const isFuture = isFutureDate(new Date('2025-12-31')); // true
 * ```
 */
export function isFutureDate(date: Date): boolean {
  return date > new Date();
}

/**
 * Validates date range
 *
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {boolean} Whether start is before end
 *
 * @example
 * ```typescript
 * const isValid = isValidDateRange(
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * ); // true
 * ```
 */
export function isValidDateRange(start: Date, end: Date): boolean {
  return start <= end;
}

/**
 * Validates positive number
 *
 * @param {number} value - Number to validate
 * @returns {boolean} Whether number is positive
 *
 * @example
 * ```typescript
 * const isValid = isPositiveNumber(42); // true
 * ```
 */
export function isPositiveNumber(value: number): boolean {
  return typeof value === 'number' && !isNaN(value) && value > 0;
}

/**
 * Validates non-negative number
 *
 * @param {number} value - Number to validate
 * @returns {boolean} Whether number is non-negative
 *
 * @example
 * ```typescript
 * const isValid = isNonNegativeNumber(0); // true
 * ```
 */
export function isNonNegativeNumber(value: number): boolean {
  return typeof value === 'number' && !isNaN(value) && value >= 0;
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

/**
 * Formats currency value
 *
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 *
 * @example
 * ```typescript
 * formatCurrency(1234.56); // "$1,234.56"
 * formatCurrency(1234.56, 'EUR'); // "€1,234.56"
 * ```
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats percentage value
 *
 * @param {number} value - Value to format (0-100)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 *
 * @example
 * ```typescript
 * formatPercentage(75.5); // "75.50%"
 * formatPercentage(75.5, 0); // "76%"
 * ```
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats date as locale string
 *
 * @param {Date} date - Date to format
 * @param {string} locale - Locale code (default: 'en-US')
 * @returns {string} Formatted date string
 *
 * @example
 * ```typescript
 * formatDate(new Date('2025-01-15')); // "1/15/2025"
 * ```
 */
export function formatDate(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale).format(date);
}

/**
 * Formats date and time
 *
 * @param {Date} date - Date to format
 * @param {string} locale - Locale code (default: 'en-US')
 * @returns {string} Formatted date/time string
 *
 * @example
 * ```typescript
 * formatDateTime(new Date()); // "1/15/2025, 3:45 PM"
 * ```
 */
export function formatDateTime(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Formats number with thousands separator
 *
 * @param {number} value - Number to format
 * @returns {string} Formatted number string
 *
 * @example
 * ```typescript
 * formatNumber(1234567); // "1,234,567"
 * ```
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounces a function
 *
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query) => search(query), 300);
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttles a function
 *
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in milliseconds
 * @returns {Function} Throttled function
 *
 * @example
 * ```typescript
 * const throttledScroll = throttle(() => handleScroll(), 100);
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Generates a unique ID
 *
 * @param {string} prefix - ID prefix (default: 'id')
 * @returns {string} Unique ID
 *
 * @example
 * ```typescript
 * const id = generateId('user'); // "user_1641234567890_xyz123"
 * ```
 */
export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Deep clones an object
 *
 * @param {T} obj - Object to clone
 * @returns {T} Cloned object
 *
 * @example
 * ```typescript
 * const cloned = deepClone(originalObject);
 * ```
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Checks if object is empty
 *
 * @param {object} obj - Object to check
 * @returns {boolean} Whether object is empty
 *
 * @example
 * ```typescript
 * isEmpty({}); // true
 * isEmpty({ name: 'John' }); // false
 * ```
 */
export function isEmpty(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // SSR-safe browser APIs
  safeConfirm,
  safeAlert,
  safePrompt,
  safeLocalStorage,
  safeSetLocalStorage,

  // Error boundary
  ErrorBoundary,

  // Validation
  isValidEmail,
  isFutureDate,
  isValidDateRange,
  isPositiveNumber,
  isNonNegativeNumber,

  // Formatting
  formatCurrency,
  formatPercentage,
  formatDate,
  formatDateTime,
  formatNumber,

  // Utilities
  debounce,
  throttle,
  generateId,
  deepClone,
  isEmpty,
};
