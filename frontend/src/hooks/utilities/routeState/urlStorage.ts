/**
 * WF-COMP-145 | urlStorage.ts - URL and storage utilities for route state
 * Purpose: URL manipulation and localStorage utilities
 * Upstream: None | Dependencies: serialization
 * Downstream: Route state hooks | Called by: useRouteState, usePersistedFilters, etc.
 * Related: Route state types, hooks, serialization
 * Exports: URL and storage functions | Key Features: URL building, localStorage helpers
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: URL/Storage operations → State persistence → State restoration
 * LLM Context: URL and storage utilities for Next.js App Router route state management
 */

/**
 * URL and Storage Utilities for Enterprise Route-Level State Persistence
 *
 * Provides URL manipulation and localStorage utility functions for managing
 * state across route changes with error handling.
 *
 * @module hooks/utilities/routeState/urlStorage
 * @author White Cross Healthcare Platform
 */

'use client';

import { defaultSerialize } from './serialization';

// =====================
// URL UTILITIES
// =====================

/**
 * Build query string from URLSearchParams, handling empty values.
 *
 * @param params - URLSearchParams to convert
 * @param pathname - Base pathname to append query string to
 * @returns Full path with query string or just pathname if no params
 * @internal
 *
 * @example
 * ```ts
 * const params = new URLSearchParams({ page: '1', search: 'test' })
 * buildQueryString(params, '/students') // '/students?page=1&search=test'
 * ```
 */
export const buildQueryString = (
  params: URLSearchParams,
  pathname: string
): string => {
  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
};

/**
 * Update a single URL parameter without affecting others.
 *
 * @param searchParams - Current URLSearchParams
 * @param key - Parameter key to update
 * @param value - Parameter value (deleted if null/undefined/empty)
 * @param defaultValue - Default value to compare against (deletes if matches)
 * @returns New URLSearchParams with update applied
 * @internal
 *
 * @example
 * ```ts
 * const params = new URLSearchParams('page=1&sort=name')
 * updateUrlParam(params, 'page', '2') // page=2&sort=name
 * updateUrlParam(params, 'page', '1', '1') // sort=name (removed default)
 * ```
 */
export const updateUrlParam = (
  searchParams: URLSearchParams,
  key: string,
  value: any,
  defaultValue?: any
): URLSearchParams => {
  const newParams = new URLSearchParams(searchParams.toString());

  if (
    value === defaultValue ||
    value === null ||
    value === undefined ||
    value === ''
  ) {
    newParams.delete(key);
  } else {
    newParams.set(key, String(value));
  }

  return newParams;
};

/**
 * Update multiple URL parameters at once.
 *
 * @param searchParams - Current URLSearchParams
 * @param updates - Object with key-value pairs to update
 * @param defaults - Default values to compare against
 * @returns New URLSearchParams with all updates applied
 * @internal
 *
 * @example
 * ```ts
 * const params = new URLSearchParams('page=1')
 * updateUrlParams(params, { page: 2, sort: 'name' }, { page: 1 })
 * // page=2&sort=name
 * ```
 */
export const updateUrlParams = (
  searchParams: URLSearchParams,
  updates: Record<string, any>,
  defaults?: Record<string, any>
): URLSearchParams => {
  const newParams = new URLSearchParams(searchParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    const defaultValue = defaults?.[key];
    if (
      value === defaultValue ||
      value === null ||
      value === undefined ||
      value === ''
    ) {
      newParams.delete(key);
    } else {
      newParams.set(key, defaultSerialize(value));
    }
  });

  return newParams;
};

// =====================
// STORAGE UTILITIES
// =====================

/**
 * Safely get item from localStorage with error handling.
 *
 * @param key - Storage key
 * @returns Stored value or null if not found or error
 * @internal
 *
 * @example
 * ```ts
 * const value = getStorageItem('user-preferences')
 * ```
 */
export const getStorageItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to get item from localStorage (${key}):`, error);
    return null;
  }
};

/**
 * Safely set item in localStorage with error handling.
 *
 * @param key - Storage key
 * @param value - Value to store
 * @returns Success status
 * @internal
 *
 * @example
 * ```ts
 * setStorageItem('user-preferences', JSON.stringify(prefs))
 * ```
 */
export const setStorageItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set item in localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Safely remove item from localStorage with error handling.
 *
 * @param key - Storage key
 * @returns Success status
 * @internal
 *
 * @example
 * ```ts
 * removeStorageItem('user-preferences')
 * ```
 */
export const removeStorageItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove item from localStorage (${key}):`, error);
    return false;
  }
};
