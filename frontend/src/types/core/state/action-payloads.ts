/**
 * WF-COMP-334 | action-payloads.ts - Redux action payload type definitions
 * Purpose: Type definitions for all Redux action payloads
 * Upstream: Redux Toolkit, domain types | Dependencies: State types, domain models
 * Downstream: Redux slices, thunks | Called by: Action creators
 * Related: Incident reports, witness statements, follow-up actions, filters
 * Exports: Action payload interfaces for Redux actions
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: Action dispatch → Payload validation → Reducer processing
 * LLM Context: Redux action payload definitions for type-safe state management
 */

import type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  ActionPriority,
  ActionStatus
} from '../../domain/incidents';
import type {
  PaginationState,
  SortState
} from './utility-types';
import type {
  IncidentReportsState,
  WitnessStatementsState,
  FollowUpActionsState
} from './redux-state';

/**
 * Incident Report action payloads
 * Type definitions for all incident report actions
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
  fetchIncidentsFailure: import('./utility-types').ErrorState;
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

/**
 * Witness Statement action payloads
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
    error: import('./utility-types').ErrorState;
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

/**
 * Follow-Up Action action payloads
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
    error: import('./utility-types').ErrorState;
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

/**
 * Filter action payloads
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
