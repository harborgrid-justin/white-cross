/**
 * WF-COMP-145 | useRouteState.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, react-router-dom
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, types | Key Features: useState, useEffect, useMemo
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Enterprise Route-Level State Persistence Hooks
 *
 * This file serves as a backward-compatible re-export layer for the
 * refactored route state management hooks. All implementation has been
 * moved to the routeState/ directory for better maintainability.
 *
 * MIGRATION COMPLETE: This file now properly re-exports all functionality
 * from the broken-down modules in the routeState/ directory.
 *
 * @module hooks/useRouteState
 * @author White Cross Healthcare Platform
 */

'use client';

// =====================
// RE-EXPORT ALL TYPES
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
} from './routeState/types';

// =====================
// RE-EXPORT UTILITIES
// =====================

// Serialization utilities
export {
  defaultSerialize,
  defaultDeserialize,
  safeJsonParse,
} from './routeState/serialization';

// URL and Storage utilities
export {
  buildQueryString,
  updateUrlParam,
  updateUrlParams,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from './routeState/urlStorage';

// =====================
// RE-EXPORT ALL HOOKS
// =====================

export { useRouteState } from './routeState/useRouteStateCore';
export { usePersistedFilters } from './routeState/usePersistedFilters';
export { useNavigationState } from './routeState/useNavigationState';
export { usePageState } from './routeState/usePageState';
export { useSortState } from './routeState/useSortState';

// =====================
// DEFAULT EXPORT
// =====================

/**
 * Default export for backward compatibility
 * Exports the main useRouteState hook
 */
export { useRouteState as default } from './routeState/useRouteStateCore';
