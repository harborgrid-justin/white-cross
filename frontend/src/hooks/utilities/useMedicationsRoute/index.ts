/**
 * WF-ROUTE-002 | index.ts - Barrel exports for useMedicationsRoute
 * Purpose: Centralized exports for medication route modules
 * Upstream: All useMedicationsRoute modules | Dependencies: None
 * Downstream: @/hooks/utilities | Called by: Application code
 * Related: useMedicationsRoute
 * Exports: All types and hooks
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Barrel exports for medication route management
 */

export * from './types';
export * from './state';
export * from './queries';
export * from './mutations';
export * from './computed';
export * from './actions';
export { useMedicationsRoute } from './useMedicationsRoute';
