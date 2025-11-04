/**
 * Core URL State Management Hook
 * @module hooks/utilities/useUrlState/core
 */

'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { UrlStateObject, UrlStateOptions, UseUrlStateResult, UrlStateValue } from './types';
import { parseUrlValue, stringifyUrlValue } from './serialization';

/**
 * Modern URL state management hook
 *
 * @template T - Type of state object
 * @param defaults - Default values for URL parameters
 * @param options - Configuration options
 * @returns URL state management interface
 *
 * @example Basic usage
 * ```tsx
 * function StudentsList() {
 *   const { state, setState, setParam } = useUrlState({
 *     page: 1,
 *     search: '',
 *     grade: null as string | null,
 *     sortBy: 'name',
 *   });
 *
 *   // Read state
 *   console.log(state.page, state.search);
 *
 *   // Update single param
 *   setParam('page', 2);
 *
 *   // Update multiple params
 *   setState({ search: 'john', page: 1 });
 * }
 * ```
 *
 * @example With filters
 * ```tsx
 * function IncidentsList() {
 *   const filters = useUrlState({
 *     type: null as string | null,
 *     severity: null as string | null,
 *     status: null as string | null,
 *     dateFrom: null as string | null,
 *     dateTo: null as string | null,
 *   });
 *
 *   // Clear all filters
 *   filters.clearAll();
 *
 *   // Apply filters
 *   filters.setState({
 *     type: 'INJURY',
 *     severity: 'HIGH',
 *   });
 * }
 * ```
 *
 * @example Deep linking
 * ```tsx
 * function ShareableReport() {
 *   const { state, getUrl } = useUrlState({
 *     reportId: '',
 *     dateRange: '30d',
 *     format: 'pdf',
 *   });
 *
 *   const shareableLink = getUrl({
 *     reportId: 'report-123',
 *     dateRange: '90d',
 *   });
 *
 *   // shareableLink: "/reports?reportId=report-123&dateRange=90d&format=pdf"
 * }
 * ```
 */
export function useUrlState<T extends UrlStateObject>(
  defaults: T,
  globalOptions: UrlStateOptions = {}
): UseUrlStateResult<T> {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Parse current URL state
  const state = useMemo(() => {
    const result = { ...defaults } as T;

    Object.keys(defaults).forEach((key) => {
      const paramValue = searchParams.get(key);
      const defaultValue = defaults[key];

      if (paramValue !== null) {
        // Infer type from default value
        if (typeof defaultValue === 'number') {
          result[key as keyof T] = parseUrlValue(paramValue, 'number') as T[keyof T];
        } else if (typeof defaultValue === 'boolean') {
          result[key as keyof T] = parseUrlValue(paramValue, 'boolean') as T[keyof T];
        } else {
          result[key as keyof T] = paramValue as T[keyof T];
        }
      }
    });

    return result;
  }, [searchParams, defaults]);

  /**
   * Build URL with updated parameters
   */
  const getUrl = useCallback((updates: Partial<T> = {}): string => {
    const newParams = new URLSearchParams();
    const mergedState = { ...state, ...updates };

    Object.entries(mergedState).forEach(([key, value]) => {
      const stringValue = stringifyUrlValue(value as UrlStateValue);
      if (stringValue !== null && stringValue !== '' && value !== defaults[key as keyof T]) {
        newParams.set(key, stringValue);
      }
    });

    const queryString = newParams.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [state, pathname, defaults]);

  /**
   * Update URL state
   */
  const setState = useCallback((
    updates: Partial<T>,
    options: UrlStateOptions = {}
  ) => {
    const opts = { ...globalOptions, ...options };
    const url = getUrl(updates);

    if (opts.replace) {
      router.replace(url, { scroll: opts.scroll ?? false });
    } else {
      router.push(url, { scroll: opts.scroll ?? false });
    }
  }, [router, getUrl, globalOptions]);

  /**
   * Set single parameter
   */
  const setParam = useCallback((
    key: keyof T,
    value: UrlStateValue,
    options: UrlStateOptions = {}
  ) => {
    setState({ [key]: value } as Partial<T>, options);
  }, [setState]);

  /**
   * Remove parameters
   */
  const removeParams = useCallback((
    keys: (keyof T)[],
    options: UrlStateOptions = {}
  ) => {
    const updates = {} as Partial<T>;
    keys.forEach(key => {
      updates[key] = defaults[key];
    });
    setState(updates, options);
  }, [setState, defaults]);

  /**
   * Clear all parameters
   */
  const clearAll = useCallback((options: UrlStateOptions = {}) => {
    const opts = { ...globalOptions, ...options };
    if (opts.replace) {
      router.replace(pathname, { scroll: opts.scroll ?? false });
    } else {
      router.push(pathname, { scroll: opts.scroll ?? false });
    }
  }, [router, pathname, globalOptions]);

  return {
    state,
    setState,
    setParam,
    removeParams,
    clearAll,
    getUrl,
    searchParams: searchParams as URLSearchParams,
  };
}
