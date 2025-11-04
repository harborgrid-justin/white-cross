/**
 * WF-COMP-145 | index.ts - Route state management barrel export
 * Purpose: Main entry point for all route state hooks and utilities
 * Upstream: Route state modules | Dependencies: All route state files
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: All route state modules
 * Exports: All hooks, types, and utilities | Key Features: Backward compatibility
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Import → Module resolution → Hook usage
 * LLM Context: Barrel export for Next.js App Router route state management
 */

/**
 * Route State Management - Main Entry Point
 *
 * This file provides a centralized export for all route state management
 * hooks, types, and utilities. It maintains backward compatibility with
 * the original useRouteState.ts file.
 *
 * @module hooks/utilities/routeState
 * @author White Cross Healthcare Platform
 */

'use client';

// =====================
// TYPE EXPORTS
// =====================

export type {
  // Serialization types
  SerializationConfig,

  // Route state types
  RouteStateOptions,
  UseRouteStateReturn,

  // Filter types
  FilterConfig,
  UsePersistedFiltersReturn,

  // Navigation types
  NavigationState,
  UseNavigationStateReturn,

  // Pagination types
  PaginationState,
  PaginationConfig,
  UsePageStateReturn,

  // Sort types
  SortDirection,
  SortState,
  SortConfig,
  UseSortStateReturn,
} from './types';

// =====================
// UTILITY EXPORTS
// =====================

// Serialization utilities
export {
  defaultSerialize,
  defaultDeserialize,
  safeJsonParse,
} from './serialization';

// URL and Storage utilities
export {
  buildQueryString,
  updateUrlParam,
  updateUrlParams,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from './urlStorage';

// =====================
// HOOK EXPORTS
// =====================

export { useRouteState } from './useRouteStateCore';
export { usePersistedFilters } from './usePersistedFilters';
export { useNavigationState } from './useNavigationState';
export { usePageState } from './usePageState';
export { useSortState } from './useSortState';

// =====================
// DEFAULT EXPORT
// =====================

/**
 * Default export for backward compatibility
 * Exports the main useRouteState hook
 */
export { useRouteState as default } from './useRouteStateCore';
