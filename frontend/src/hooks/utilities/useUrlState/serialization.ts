/**
 * URL State Serialization Utilities
 * @module hooks/utilities/useUrlState/serialization
 */

import type { UrlStateValue } from './types';

/**
 * Type guard for array values
 */
export function isArrayValue(value: UrlStateValue | UrlStateValue[]): value is UrlStateValue[] {
  return Array.isArray(value);
}

/**
 * Convert URL parameter to typed value
 */
export function parseUrlValue(value: string | null, type?: 'string' | 'number' | 'boolean'): UrlStateValue {
  if (value === null) return null;

  if (type === 'number') {
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  if (type === 'boolean') {
    return value === 'true';
  }

  return value;
}

/**
 * Convert value to URL string
 */
export function stringifyUrlValue(value: UrlStateValue): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}
