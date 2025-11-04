/**
 * WF-COMP-350 | index.ts - Selector utilities barrel export
 * Purpose: Central export point for memoized Redux selector utilities
 * Upstream: All selector modules | Dependencies: Redux Toolkit
 * Downstream: Components, hooks | Called by: Application code
 * Related: Redux store, state management
 * Exports: All selector utilities, types, and helpers | Key Features: Memoization
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Import resolution → Module re-export → Consumer access
 * LLM Context: Main entry point for Redux selector utilities
 */

'use client';

// =====================
// TYPE DEFINITIONS
// =====================
export type {
  SelectorFn,
  ParametricSelectorFn,
} from './types';

// =====================
// BASIC SELECTOR CREATION
// =====================
export {
  createMemoizedSelector,
  createDraftSafeMemoizedSelector,
} from './types';

// =====================
// PARAMETRIC SELECTORS
// =====================
export {
  createParametricSelector,
  useParametricSelector,
} from './parametric';

// =====================
// FILTERING & SORTING
// =====================
export {
  createFilteredSelector,
  createSortedSelector,
  createFilteredAndSortedSelector,
} from './filtering';

// =====================
// COMPOSITE SELECTORS
// =====================
export {
  createCompositeSelector,
} from './composite';

// =====================
// MONITORING & PERFORMANCE
// =====================
export {
  monitoredSelector,
  useMemoSelector,
  useCallbackSelector,
} from './monitoring';

// =====================
// AGGREGATION
// =====================
export {
  createCountSelector,
  createGroupBySelector,
} from './aggregation';

// =====================
// EXAMPLES (For reference)
// =====================
export {
  studentSelectors,
} from './examples';
