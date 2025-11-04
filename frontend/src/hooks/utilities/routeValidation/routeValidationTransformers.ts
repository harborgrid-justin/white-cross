/**
 * WF-COMP-350 | routeValidationTransformers.ts - Parameter transformation utilities
 * Purpose: Transform and parse route parameters to different types
 * Upstream: routeValidationSchemas, routeValidationSecurity | Dependencies: None
 * Downstream: Validation utilities | Called by: Parameter validators
 * Related: routeValidationUtils, routeValidationSchemas
 * Exports: Parser functions | Key Features: Type transformation, parsing
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: String input → Type detection → Transformation → Typed output
 * LLM Context: Parameter transformation utilities for route validation
 */

'use client';

import { DateParamSchema } from './routeValidationSchemas';
import { performSecurityChecks } from './routeValidationSecurity';

// =====================
// PARAMETER TRANSFORMATION
// =====================

/**
 * Parses a date parameter from string to Date object
 *
 * @param param - Date string in ISO 8601 format
 * @returns Date object or null if invalid
 *
 * @example
 * const date = parseDate('2024-03-15T10:30:00Z');
 */
export function parseDate(param: string | undefined): Date | null {
  if (!param) return null;

  try {
    const result = DateParamSchema.safeParse(param);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Parses a boolean parameter from string
 * Accepts: 'true', 'false', '1', '0', 'yes', 'no'
 *
 * @param param - Boolean string parameter
 * @returns boolean or null if invalid
 *
 * @example
 * const isActive = parseBoolean('true'); // true
 * const isEnabled = parseBoolean('1'); // true
 */
export function parseBoolean(param: string | undefined): boolean | null {
  if (!param) return null;

  const normalized = param.toLowerCase().trim();

  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;

  return null;
}

/**
 * Parses an array parameter from delimited string
 *
 * @param param - Delimited string (e.g., "item1,item2,item3")
 * @param delimiter - Delimiter character (default: ',')
 * @returns Array of strings or empty array if invalid
 *
 * @example
 * const ids = parseArray('id1,id2,id3'); // ['id1', 'id2', 'id3']
 * const tags = parseArray('tag1|tag2|tag3', '|'); // ['tag1', 'tag2', 'tag3']
 */
export function parseArray(
  param: string | undefined,
  delimiter: string = ','
): string[] {
  if (!param) return [];

  return param
    .split(delimiter)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/**
 * Parses a JSON parameter from string
 *
 * @param param - JSON string parameter
 * @returns Parsed object or null if invalid JSON
 *
 * @example
 * const filters = parseJSON('{"type":"INJURY","severity":"HIGH"}');
 */
export function parseJSON<T = any>(param: string | undefined): T | null {
  if (!param) return null;

  try {
    // Perform security checks before parsing
    performSecurityChecks(param, 'json');
    return JSON.parse(param) as T;
  } catch {
    return null;
  }
}

/**
 * Parses parameters based on type definitions
 *
 * @param params - Raw parameters
 * @param types - Type definitions for each parameter
 * @returns Parsed parameters with correct types
 *
 * @example
 * const parsed = parseParams(
 *   { page: '2', active: 'true', tags: 'red,blue,green' },
 *   { page: 'number', active: 'boolean', tags: 'array' }
 * );
 * // Result: { page: 2, active: true, tags: ['red', 'blue', 'green'] }
 */
export function parseParams(
  params: Record<string, string | undefined>,
  types: Record<string, 'number' | 'boolean' | 'date' | 'array' | 'json'>
): Record<string, any> {
  const parsed: Record<string, any> = {};

  for (const [key, type] of Object.entries(types)) {
    const value = params[key];
    if (value === undefined) continue;

    switch (type) {
      case 'number':
        const num = parseInt(value, 10);
        parsed[key] = isNaN(num) ? null : num;
        break;
      case 'boolean':
        parsed[key] = parseBoolean(value);
        break;
      case 'date':
        parsed[key] = parseDate(value);
        break;
      case 'array':
        parsed[key] = parseArray(value);
        break;
      case 'json':
        parsed[key] = parseJSON(value);
        break;
      default:
        parsed[key] = value;
    }
  }

  return parsed;
}
