/**
 * WF-COMP-117-TYPES | FollowUpAction/types.ts - Type definitions
 * Purpose: Type definitions for Follow-Up Action context
 * Upstream: @/types/domain/incidents
 * Downstream: FollowUpActionProvider, hooks, helpers
 * Related: FollowUpAction domain types
 * Exports: TypeScript interfaces and types
 * Last Updated: 2025-11-12 | File Type: .ts
 * LLM Context: Type definitions for follow-up action state management
 */

/**
 * Follow-Up Action Type Definitions
 * Comprehensive type definitions for incident follow-up action management
 *
 * @module FollowUpAction/types
 */

import type { FollowUpAction } from '@/types/domain/incidents';
import type { ActionStatus, ActionPriority } from '@/types/domain/incidents';

// =====================
// ALERT TYPES
// =====================

/**
 * Overdue action alert information
 * Contains details about actions that have passed their due date
 */
export interface OverdueAlert {
  /** The overdue action */
  action: FollowUpAction;
  /** Number of days past the due date */
  daysOverdue: number;
  /** Alert severity level based on how overdue the action is */
  severity: 'warning' | 'critical';
}

// =====================
// FILTER TYPES
// =====================

/**
 * Filter configuration for follow-up actions
 * Used to filter and narrow down the list of actions displayed
 */
export interface ActionFilters {
  /** Filter by action status (can be multiple) */
  status?: ActionStatus[];
  /** Filter by priority level (can be multiple) */
  priority?: ActionPriority[];
  /** Show only actions assigned to current user */
  assignedToMe?: boolean;
  /** Show only overdue actions */
  overduedOnly?: boolean;
  /** Filter by incident report ID */
  incidentReportId?: string;
}

// =====================
// CONTEXT STATE TYPES
// =====================

/**
 * Context state interface
 * Represents the complete state managed by the Follow-Up Action context
 */
export interface FollowUpActionContextState {
  // Data State
  /** Filtered and sorted list of follow-up actions */
  actions: FollowUpAction[];
  /** Currently selected action for detail view */
  selectedAction: FollowUpAction | null;
  /** List of overdue actions with alert metadata */
  overdueActions: OverdueAlert[];

  // Loading States
  /** Loading state for initial data fetch */
  isLoading: boolean;
  /** Loading state for create operation */
  isCreating: boolean;
  /** Loading state for update operation */
  isUpdating: boolean;
  /** Loading state for delete operation */
  isDeleting: boolean;

  // Error States
  /** Current error if any operation failed */
  error: Error | null;

  // Filters and Sorting
  /** Active filter configuration */
  filters: ActionFilters;
  /** Current sort field */
  sortBy: 'dueDate' | 'priority' | 'createdAt';
  /** Current sort direction */
  sortOrder: 'asc' | 'desc';

  // Statistics
  /** Aggregated statistics about actions */
  stats: {
    /** Total number of actions */
    total: number;
    /** Number of pending actions */
    pending: number;
    /** Number of in-progress actions */
    inProgress: number;
    /** Number of completed actions */
    completed: number;
    /** Number of cancelled actions */
    cancelled: number;
    /** Number of overdue actions */
    overdue: number;
  };
}

// =====================
// CONTEXT METHOD TYPES
// =====================

/**
 * Context methods interface
 * Defines all operations available through the Follow-Up Action context
 */
export interface FollowUpActionContextMethods {
  // Data Loading
  /** Load follow-up actions for a specific incident */
  loadFollowUpActions: (incidentId: string) => Promise<void>;
  /** Refresh the current list of actions */
  refreshActions: () => Promise<void>;

  // CRUD Operations
  /** Create a new follow-up action */
  createFollowUpAction: (data: CreateFollowUpActionRequest) => Promise<FollowUpAction>;
  /** Update an existing follow-up action */
  updateFollowUpAction: (id: string, data: UpdateFollowUpActionRequest) => Promise<FollowUpAction>;
  /** Delete a follow-up action */
  deleteFollowUpAction: (id: string) => Promise<void>;

  // Status Management
  /** Update action status with optional notes */
  updateActionStatus: (id: string, status: ActionStatus, notes?: string) => Promise<FollowUpAction>;
  /** Mark an action as completed with completion notes */
  completeAction: (id: string, notes: string) => Promise<FollowUpAction>;
  /** Cancel an action with a reason */
  cancelAction: (id: string, reason: string) => Promise<FollowUpAction>;

  // Assignment
  /** Assign an action to a user */
  assignAction: (id: string, userId: string) => Promise<FollowUpAction>;
  /** Unassign an action from its current user */
  unassignAction: (id: string) => Promise<FollowUpAction>;

  // Selection
  /** Set the currently selected action */
  setSelectedAction: (action: FollowUpAction | null) => void;
  /** Clear the selected action */
  clearSelectedAction: () => void;

  // Filtering and Sorting
  /** Update filter configuration */
  setFilters: (filters: Partial<ActionFilters>) => void;
  /** Reset all filters to defaults */
  clearFilters: () => void;
  /** Set the field to sort by */
  setSortBy: (sortBy: 'dueDate' | 'priority' | 'createdAt') => void;
  /** Set the sort direction */
  setSortOrder: (order: 'asc' | 'desc') => void;

  // Utilities
  /** Get list of overdue actions with alert information */
  getOverdueActions: () => OverdueAlert[];
  /** Get all actions with a specific status */
  getActionsByStatus: (status: ActionStatus) => FollowUpAction[];
  /** Get all actions with a specific priority */
  getActionsByPriority: (priority: ActionPriority) => FollowUpAction[];
  /** Check if a specific action is overdue */
  isActionOverdue: (action: FollowUpAction) => boolean;
  /** Check if current user can assign the action */
  canAssignAction: (action: FollowUpAction) => boolean;
  /** Check if current user can edit the action */
  canEditAction: (action: FollowUpAction) => boolean;
}

// =====================
// COMPLETE CONTEXT TYPE
// =====================

/**
 * Complete context type
 * Combines state and methods into a single context interface
 */
export type FollowUpActionContextType = FollowUpActionContextState & FollowUpActionContextMethods;

// =====================
// PROVIDER PROPS
// =====================

/**
 * Props for the FollowUpActionProvider component
 */
export interface FollowUpActionProviderProps {
  /** Child components to render */
  children: React.ReactNode;
  /** Optional initial incident ID to load actions for */
  initialIncidentId?: string;
  /** Enable automatic refresh interval (in milliseconds) */
  refreshInterval?: number;
  /** Show overdue notifications automatically */
  autoNotifyOverdue?: boolean;
}

// =====================
// REQUEST/RESPONSE TYPES (Re-export for convenience)
// =====================

/**
 * Request payload for creating a follow-up action
 * Re-exported from domain types for convenience
 */
export type { CreateFollowUpActionRequest, UpdateFollowUpActionRequest } from '@/types/domain/incidents';
