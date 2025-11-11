/**
 * WF-COMP-334 | state/index.ts - State management types main export
 * Purpose: Main export file for state management types with backward compatibility
 * Upstream: All state modules | Dependencies: Modular state type files
 * Downstream: Components, stores, hooks | Called by: Application code
 * Related: Redux store, React Context, async thunks, helpers
 * Exports: All state types and utilities
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: Type imports → State management → Component usage
 * LLM Context: Centralized exports for all state management types
 */

// Re-export all utility types
export type {
  RequestStatus,
  LoadingState,
  ErrorState,
  PaginationState,
  SortState,
  SelectOption,
  FormState
} from './utility-types';

// Re-export all entity types
export type {
  FilterState,
  SelectionState,
  EntityState,
  AsyncThunkConfig,
  AppAsyncThunk,
  SerializedError
} from './entity-types';

// Re-export all Redux state types
export type {
  IncidentReportsState,
  WitnessStatementsState,
  FollowUpActionsState,
  UIState,
  NavigationState,
  CacheState,
  RootState
} from './redux-state';

// Re-export all Context state types
export type {
  WitnessStatementContextState,
  FollowUpActionContextState,
  FilterContextState,
  ModalContextState
} from './context-state';

// Re-export all action payload types
export type {
  IncidentReportActionPayloads,
  WitnessStatementActionPayloads,
  FollowUpActionActionPayloads,
  FilterActionPayloads
} from './action-payloads';

// Re-export all helper functions
export {
  // State guard functions
  isLoadingState,
  isErrorState,
  hasData,
  isStale,
  isIdleState,
  getLoadingProgress,
  
  // Initial state helpers
  createInitialLoadingState,
  createInitialPaginationState,
  createInitialEntityState,
  createInitialSelectionState,
  createInitialFilterState,
  createInitialFormState,
  
  // State update helpers
  updatePaginationState,
  updateEntityState,
  removeEntitiesFromState,
  updateSelectionState,
  toggleItemSelection
} from './state-helpers';
