/**
 * URL State Management Hook - Main Entry Point
 * @module hooks/utilities/useUrlState
 */

// Re-export types
export type {
  UrlStateValue,
  UrlStateObject,
  UrlStateOptions,
  UseUrlStateResult,
} from './types';

// Re-export serialization utilities
export {
  isArrayValue,
  parseUrlValue,
  stringifyUrlValue,
} from './serialization';

// Re-export core hook
export { useUrlState } from './core';

// Re-export specialized hooks
export {
  usePaginationState,
  useFilterState,
} from './specialized';

// Default export
export { useUrlState as default } from './core';
