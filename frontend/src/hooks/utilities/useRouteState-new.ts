/**
 * WF-COMP-145 | useRouteState-new.ts - Backward compatibility wrapper
 * Purpose: Re-export route state hooks for backward compatibility
 * Upstream: routeState module | Dependencies: routeState/*
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: All route state modules
 * Exports: All hooks, types, and utilities | Key Features: Backward compatibility
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Import → Module resolution → Hook usage
 * LLM Context: Backward compatibility wrapper for Next.js App Router route state management
 */

/**
 * Enterprise Route-Level State Persistence Hooks
 *
 * MIGRATION NOTE: This file has been refactored into smaller modules.
 * The original 1202-line file has been split into:
 * - routeState/types.ts (254 lines) - Type definitions
 * - routeState/serialization.ts (140 lines) - Serialization utilities
 * - routeState/urlStorage.ts (200 lines) - URL and storage utilities
 * - routeState/useRouteStateCore.ts (203 lines) - Core useRouteState hook
 * - routeState/usePersistedFilters.ts (257 lines) - Persisted filters hook
 * - routeState/useNavigationState.ts (177 lines) - Navigation state hook
 * - routeState/usePageState.ts (222 lines) - Pagination state hook
 * - routeState/useSortState.ts (256 lines) - Sort state hook
 * - routeState/index.ts (97 lines) - Barrel exports
 *
 * This file re-exports everything for backward compatibility.
 * New code should import from '@/hooks/utilities/routeState' instead.
 *
 * @module hooks/useRouteState
 * @author White Cross Healthcare Platform
 */

'use client';

// Re-export all types
export type {
  SerializationConfig,
  RouteStateOptions,
  UseRouteStateReturn,
  FilterConfig,
  UsePersistedFiltersReturn,
  NavigationState,
  UseNavigationStateReturn,
  PaginationState,
  PaginationConfig,
  UsePageStateReturn,
  SortDirection,
  SortState,
  SortConfig,
  UseSortStateReturn,
} from './routeState/types';

// Re-export all utilities
export {
  defaultSerialize,
  defaultDeserialize,
  safeJsonParse,
  buildQueryString,
  updateUrlParam,
  updateUrlParams,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from './routeState';

// Re-export all hooks
export {
  useRouteState,
  usePersistedFilters,
  useNavigationState,
  usePageState,
  useSortState,
} from './routeState';

// Default export
export { default } from './routeState';
