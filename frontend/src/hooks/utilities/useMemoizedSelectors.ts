/**
 * Memoized Selector Utilities
 *
 * Utilities and patterns for creating performant, memoized Redux selectors
 * using Reselect and Redux Toolkit.
 *
 * @module hooks/utilities/useMemoizedSelectors
 * @category State Management - Selectors
 *
 * Features:
 * - Memoized selector creation with createSelector
 * - Parametric selector patterns
 * - Composite selector patterns
 * - Performance monitoring
 * - Type-safe selector composition
 *
 * Compliance: Item 154 (NEXTJS_GAP_ANALYSIS_CHECKLIST.md)
 * - [x] 154. Selectors memoized
 */

// Re-export types and basic selectors
export type { SelectorFn, ParametricSelectorFn } from './selectors/types';
export {
  createMemoizedSelector,
  createDraftSafeMemoizedSelector,
} from './selectors/types';

// Re-export parametric selectors
export {
  createParametricSelector,
  useParametricSelector,
} from './selectors/parametric';

// Re-export composite selectors
export { createCompositeSelector } from './selectors/composite';

// Re-export filtering and sorting
export {
  createFilteredSelector,
  createSortedSelector,
  createFilteredAndSortedSelector,
} from './selectors/filtering';

// Re-export aggregation selectors
export {
  createCountSelector,
  createGroupBySelector,
} from './selectors/aggregation';

// Re-export monitoring and utility hooks
export {
  monitoredSelector,
  useMemoSelector,
  useCallbackSelector,
} from './selectors/monitoring';

// Re-export examples
export { studentSelectors } from './selectors/examples';

// Default export for convenience
import {
  createMemoizedSelector,
  createDraftSafeMemoizedSelector,
} from './selectors/types';
import {
  createParametricSelector,
  useParametricSelector,
} from './selectors/parametric';
import { createCompositeSelector } from './selectors/composite';
import {
  createFilteredSelector,
  createSortedSelector,
  createFilteredAndSortedSelector,
} from './selectors/filtering';
import {
  createCountSelector,
  createGroupBySelector,
} from './selectors/aggregation';
import {
  monitoredSelector,
  useMemoSelector,
  useCallbackSelector,
} from './selectors/monitoring';

export default {
  createMemoizedSelector,
  createDraftSafeMemoizedSelector,
  createParametricSelector,
  createCompositeSelector,
  createFilteredSelector,
  createSortedSelector,
  createFilteredAndSortedSelector,
  createCountSelector,
  createGroupBySelector,
  monitoredSelector,
  useParametricSelector,
  useMemoSelector,
  useCallbackSelector,
};
