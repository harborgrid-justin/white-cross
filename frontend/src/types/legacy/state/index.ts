/**
 * WF-COMP-334 | index.ts - State types barrel export
 * Purpose: Central export point for all state management types
 * Upstream: All state modules | Dependencies: All state type modules
 * Downstream: Application code | Called by: All consumers
 * Related: All state modules
 * Exports: All state types and helpers | Key Features: Backward compatibility
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Import → Type resolution → Usage
 * LLM Context: Barrel export providing backward compatibility for state types
 */

/**
 * State Management Types - Barrel Export
 *
 * Central export point for all state management types.
 * Maintains backward compatibility with the original state.ts file.
 *
 * @module types/state
 */

// =====================
// UTILITY STATE TYPES
// =====================

export type {
  RequestStatus,
  LoadingState,
  ErrorState,
  PaginationState,
  SortState,
  FilterState,
  SelectionState,
  EntityState,
  SelectOption,
  FormState,
} from './utility-state';

// =====================
// REDUX STATE TYPES
// =====================

export type {
  IncidentReportsState,
  WitnessStatementsState,
  FollowUpActionsState,
  UIState,
  NavigationState,
  CacheState,
  RootState,
} from './redux-state';

// =====================
// CONTEXT STATE TYPES
// =====================

export type {
  WitnessStatementContextState,
  FollowUpActionContextState,
  FilterContextState,
  ModalContextState,
  ModalComponent,
  ModalComponentProps,
  ModalOptions,
} from './context-state';

// =====================
// ACTION PAYLOAD TYPES
// =====================

export type {
  IncidentReportActionPayloads,
  WitnessStatementActionPayloads,
  FollowUpActionActionPayloads,
  FilterActionPayloads,
} from './action-payloads';

// =====================
// ASYNC THUNK TYPES
// =====================

export type {
  AsyncThunkConfig,
  AppAsyncThunk,
  SerializedError,
} from './async-thunk';

// =====================
// STATE HELPER FUNCTIONS
// =====================

export {
  // Type guards
  isLoadingState,
  isErrorState,
  hasData,
  isStale,
  isIdleState,
  getLoadingProgress,
  // Initial state creators
  createInitialLoadingState,
  createInitialPaginationState,
  createInitialEntityState,
  createInitialSelectionState,
  createInitialFilterState,
} from './state-helpers';
