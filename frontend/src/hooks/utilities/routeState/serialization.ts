/**
 * WF-COMP-145 | serialization.ts - Serialization utilities for route state
 * Purpose: Serialization and deserialization functions
 * Upstream: None | Dependencies: None
 * Downstream: Route state hooks | Called by: useRouteState, usePersistedFilters, etc.
 * Related: Route state types, hooks
 * Exports: Serialization functions | Key Features: Type-safe serialization, JSON parsing
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Data → Serialization → URL/Storage → Deserialization → Data
 * LLM Context: Serialization utilities for Next.js App Router route state management
 */

/**
 * Serialization Utilities for Enterprise Route-Level State Persistence
 *
 * Provides serialization and deserialization functions for managing
 * state across route changes with type safety and error handling.
 *
 * @module hooks/utilities/routeState/serialization
 * @author White Cross Healthcare Platform
 */

'use client';

// =====================
// SERIALIZATION UTILITIES
// =====================

/**
 * Default serialization for common types.
 * Handles primitives, arrays, and objects safely.
 *
 * @param value - Value to serialize
 * @returns Serialized string representation
 * @internal
 *
 * @example
 * ```ts
 * defaultSerialize('hello') // 'hello'
 * defaultSerialize(42) // '42'
 * defaultSerialize([1, 2, 3]) // '[1,2,3]'
 * defaultSerialize({ key: 'value' }) // '{"key":"value"}'
 * ```
 */
export const defaultSerialize = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

/**
 * Default deserialization with type inference.
 * Attempts to parse JSON for arrays and objects.
 *
 * @param value - String value to deserialize
 * @returns Deserialized value with inferred type
 * @internal
 *
 * @example
 * ```ts
 * defaultDeserialize('hello') // 'hello'
 * defaultDeserialize('42') // 42
 * defaultDeserialize('true') // true
 * defaultDeserialize('[1,2,3]') // [1, 2, 3]
 * defaultDeserialize('{"key":"value"}') // { key: 'value' }
 * ```
 */
export const defaultDeserialize = (value: string): any => {
  if (!value) {
    return null;
  }

  // Try boolean
  if (value === 'true') return true;
  if (value === 'false') return false;

  // Try number
  const num = Number(value);
  if (!isNaN(num) && value === String(num)) {
    return num;
  }

  // Try JSON (arrays/objects)
  if (value.startsWith('[') || value.startsWith('{')) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
};

/**
 * Safe JSON parse with error handling and fallback value.
 *
 * @template T - Expected type of parsed value
 * @param value - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed value or fallback
 * @internal
 *
 * @example
 * ```ts
 * safeJsonParse('{"key":"value"}', {}) // { key: 'value' }
 * safeJsonParse('invalid json', {}) // {}
 * safeJsonParse(null, { default: true }) // { default: true }
 * ```
 */
export const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
};
