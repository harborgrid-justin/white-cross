/**
 * WF-COMP-334 | action-payloads.ts - Redux action payload types
 * Purpose: Type definitions for Redux action payloads
 * Upstream: redux-state.ts, utility-state.ts, incidents.ts | Dependencies: State and domain types
 * Downstream: Redux slices, action creators | Called by: Redux actions
 * Related: redux-state.ts, async-thunk.ts
 * Exports: Action payload interfaces | Key Features: Type-safe actions
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Action dispatch → Payload validation → Reducer execution → State update
 * LLM Context: Redux action payload type definitions for type-safe dispatching
 */

/**
 * Redux Action Payload Type Definitions
 *
 * Type definitions for all Redux action payloads.
 * Ensures type safety when dispatching actions and handling them in reducers.
 *
 * @module types/state/action-payloads
 */

import type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  ActionPriority,
  ActionStatus,
} from '../incidents';
import type {
  ErrorState,
  PaginationState,
  SortState,
} from './utility-state';
import type { IncidentReportsState } from './redux-state';

// =====================
// INCIDENT REPORT ACTIONS
// =====================

/**
 * Incident Report action payloads
 * Type definitions for all incident report actions
 *
 * @example
 * ```typescript
 * // Usage in action creator
 * const fetchIncidents = createAction<IncidentReportActionPayloads['fetchIncidents']>(
 *   'incidents/fetch'
 * );
 *
 * // Dispatch
 * dispatch(fetchIncidents({ page: 1, limit: 20 }));
 * ```
 */
export interface IncidentReportActionPayloads {
  /** Fetch incidents payload */
  fetchIncidents: {
    page?: number;
    limit?: number;
    filters?: IncidentReportsState['filters']['filters'];
    sort?: SortState;
  };
  /** Fetch incidents success */
  fetchIncidentsSuccess: {
    incidents: IncidentReport[];
    pagination: PaginationState;
  };
  /** Fetch incidents failure */
  fetchIncidentsFailure: ErrorState;
  /** Fetch single incident */
  fetchIncident: string; // incident ID
  /** Fetch incident success */
  fetchIncidentSuccess: IncidentReport;
  /** Create incident */
  createIncident: Omit<IncidentReport, 'id' | 'createdAt' | 'updatedAt'>;
  /** Create incident success */
  createIncidentSuccess: IncidentReport;
  /** Update incident */
  updateIncident: {
    id: string;
    updates: Partial<IncidentReport>;
  };
  /** Update incident success */
  updateIncidentSuccess: IncidentReport;
  /** Delete incident */
  deleteIncident: string; // incident ID
  /** Delete incident success */
  deleteIncidentSuccess: string; // incident ID
  /** Set filters */
  setFilters: Partial<IncidentReportsState['filters']['filters']>;
  /** Set sort */
  setSort: SortState;
  /** Set page */
  setPage: number;
  /** Select incidents */
  selectIncidents: string[]; // incident IDs
  /** Deselect incidents */
  deselectIncidents: string[]; // incident IDs
  /** Select all incidents */
  selectAllIncidents: boolean;
  /** Clear selection */
  clearSelection: void;
}

// =====================
// WITNESS STATEMENT ACTIONS
// =====================

/**
 * Witness Statement action payloads
 * Type definitions for witness statement actions
 *
 * @example
 * ```typescript
 * const createStatement = createAsyncThunk<
 *   WitnessStatement,
 *   WitnessStatementActionPayloads['createStatement']
 * >(
 *   'witnessStatements/create',
 *   async (payload) => {
 *     // payload is properly typed
 *   }
 * );
 * ```
 */
export interface WitnessStatementActionPayloads {
  /** Fetch statements for incident */
  fetchStatements: string; // incident ID
  /** Fetch statements success */
  fetchStatementsSuccess: {
    incidentId: string;
    statements: WitnessStatement[];
  };
  /** Fetch statements failure */
  fetchStatementsFailure: {
    incidentId: string;
    error: ErrorState;
  };
  /** Create statement */
  createStatement: Omit<WitnessStatement, 'id' | 'createdAt' | 'updatedAt'>;
  /** Create statement success */
  createStatementSuccess: WitnessStatement;
  /** Update statement */
  updateStatement: {
    id: string;
    updates: Partial<WitnessStatement>;
  };
  /** Update statement success */
  updateStatementSuccess: WitnessStatement;
  /** Delete statement */
  deleteStatement: string; // statement ID
  /** Verify statement */
  verifyStatement: string; // statement ID
}

// =====================
// FOLLOW-UP ACTION ACTIONS
// =====================

/**
 * Follow-Up Action action payloads
 * Type definitions for follow-up action actions
 *
 * @example
 * ```typescript
 * const assignAction = createAsyncThunk<
 *   FollowUpAction,
 *   FollowUpActionActionPayloads['assignAction']
 * >(
 *   'followUpActions/assign',
 *   async ({ id, userId }) => {
 *     // Properly typed parameters
 *   }
 * );
 * ```
 */
export interface FollowUpActionActionPayloads {
  /** Fetch actions for incident */
  fetchActions: string; // incident ID
  /** Fetch actions success */
  fetchActionsSuccess: {
    incidentId: string;
    actions: FollowUpAction[];
  };
  /** Fetch actions failure */
  fetchActionsFailure: {
    incidentId: string;
    error: ErrorState;
  };
  /** Create action */
  createAction: Omit<FollowUpAction, 'id' | 'createdAt' | 'updatedAt'>;
  /** Create action success */
  createActionSuccess: FollowUpAction;
  /** Update action */
  updateAction: {
    id: string;
    updates: Partial<FollowUpAction>;
  };
  /** Update action success */
  updateActionSuccess: FollowUpAction;
  /** Delete action */
  deleteAction: string; // action ID
  /** Complete action */
  completeAction: {
    id: string;
    notes?: string;
  };
  /** Assign action */
  assignAction: {
    id: string;
    userId: string;
  };
  /** Set priority filter */
  setPriorityFilter: ActionPriority | 'ALL';
  /** Set status filter */
  setStatusFilter: ActionStatus | 'ALL';
}

// =====================
// FILTER ACTIONS
// =====================

/**
 * Filter action payloads
 * Generic type definitions for filter actions
 *
 * @template T - Type of filter values
 *
 * @example
 * ```typescript
 * interface IncidentFilters {
 *   type?: IncidentType;
 *   severity?: IncidentSeverity;
 * }
 *
 * type IncidentFilterPayloads = FilterActionPayloads<IncidentFilters>;
 * ```
 */
export interface FilterActionPayloads<T extends Record<string, unknown>> {
  /** Set filters */
  setFilters: Partial<T>;
  /** Clear filters */
  clearFilters: void;
  /** Reset filters */
  resetFilters: void;
  /** Update single filter */
  updateFilter: {
    key: keyof T;
    value: T[keyof T] | undefined;
  };
  /** Apply filters */
  applyFilters: void;
}
