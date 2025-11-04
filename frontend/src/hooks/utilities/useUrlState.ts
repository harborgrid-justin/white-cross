/**
 * URL State Management Hook
 *
 * Modern Next.js 15 hook for managing state in URL search parameters.
 * Provides type-safe, React-friendly interface for shareable URL state.
 *
 * @module hooks/utilities/useUrlState
 * @category State Management - URL State
 *
 * Features:
 * - Type-safe URL parameter management
 * - Automatic synchronization with UI state
 * - Browser history management
 * - Deep linking support
 * - Server/client compatibility
 *
 * Compliance: Items 166-170 (NEXTJS_GAP_ANALYSIS_CHECKLIST.md)
 * - [x] 166. Search params used for shareable state
 * - [x] 167. useSearchParams hook utilized
 * - [x] 168. URL state synchronized with UI
 * - [x] 169. Browser history managed properly
 * - [x] 170. Deep linking supported
 */

// Re-export all types
export type {
  UrlStateValue,
  UrlStateObject,
  UrlStateOptions,
  UseUrlStateResult,
} from './useUrlState/types';

// Re-export serialization utilities
export {
  isArrayValue,
  parseUrlValue,
  stringifyUrlValue,
} from './useUrlState/serialization';

// Re-export core hook
export { useUrlState } from './useUrlState/core';

// Re-export specialized hooks
export {
  usePaginationState,
  useFilterState,
} from './useUrlState/specialized';

// Default export
export { useUrlState as default } from './useUrlState/core';
