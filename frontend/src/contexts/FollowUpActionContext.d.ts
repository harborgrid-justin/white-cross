/**
 * Type declarations for Follow-Up Action Context
 * Provides TypeScript definitions for IDE support and type checking
 *
 * @module FollowUpActionContext.d
 */

import type { ReactNode } from 'react';
import type {
  FollowUpAction,
  ActionStatus,
  ActionPriority,
  CreateFollowUpActionRequest,
  UpdateFollowUpActionRequest,
} from '../types/incidents';

/**
 * Overdue action alert information
 */
export interface OverdueAlert {
  /** The follow-up action that is overdue */
  action: FollowUpAction;
  /** Number of days past the due date */
  daysOverdue: number;
  /** Severity level based on days overdue */
  severity: 'warning' | 'critical';
}

/**
 * Filter configuration for follow-up actions
 */
export interface ActionFilters {
  /** Filter by one or more action statuses */
  status?: ActionStatus[];
  /** Filter by one or more priority levels */
  priority?: ActionPriority[];
  /** Show only actions assigned to current user */
  assignedToMe?: boolean;
  /** Show only overdue actions */
  overduedOnly?: boolean;
  /** Filter by incident report ID */
  incidentReportId?: string;
}

/**
 * Context state interface
 * Contains all state managed by the FollowUpActionContext
 */
export interface FollowUpActionContextState {
  // Data State
  /** Filtered and sorted follow-up actions */
  actions: FollowUpAction[];
  /** Currently selected action for editing/viewing */
  selectedAction: FollowUpAction | null;
  /** List of overdue actions with alert information */
  overdueActions: OverdueAlert[];

  // Loading States
  /** True when initially loading actions */
  isLoading: boolean;
  /** True when creating a new action */
  isCreating: boolean;
  /** True when updating an existing action */
  isUpdating: boolean;
  /** True when deleting an action */
  isDeleting: boolean;

  // Error State
  /** Current error, if any */
  error: Error | null;

  // Filters and Sorting
  /** Current filter configuration */
  filters: ActionFilters;
  /** Current sort field */
  sortBy: 'dueDate' | 'priority' | 'createdAt';
  /** Current sort order */
  sortOrder: 'asc' | 'desc';

  // Statistics
  /** Computed statistics for actions */
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

/**
 * Context methods interface
 * Contains all methods provided by the FollowUpActionContext
 */
export interface FollowUpActionContextMethods {
  // Data Loading
  /**
   * Load follow-up actions for a specific incident
   * @param incidentId - The incident report ID
   * @throws {Error} If loading fails
   */
  loadFollowUpActions: (incidentId: string) => Promise<void>;

  /**
   * Refresh current actions from the server
   * @throws {Error} If refresh fails
   */
  refreshActions: () => Promise<void>;

  // CRUD Operations
  /**
   * Create a new follow-up action
   * @param data - The action data
   * @returns The created action
   * @throws {Error} If creation fails
   */
  createFollowUpAction: (data: CreateFollowUpActionRequest) => Promise<FollowUpAction>;

  /**
   * Update an existing follow-up action
   * @param id - The action ID
   * @param data - The update data
   * @returns The updated action
   * @throws {Error} If update fails
   */
  updateFollowUpAction: (
    id: string,
    data: UpdateFollowUpActionRequest
  ) => Promise<FollowUpAction>;

  /**
   * Delete a follow-up action
   * @param id - The action ID
   * @throws {Error} If deletion fails
   */
  deleteFollowUpAction: (id: string) => Promise<void>;

  // Status Management
  /**
   * Update the status of a follow-up action
   * @param id - The action ID
   * @param status - The new status
   * @param notes - Optional notes about the status change
   * @returns The updated action
   * @throws {Error} If status update fails
   */
  updateActionStatus: (
    id: string,
    status: ActionStatus,
    notes?: string
  ) => Promise<FollowUpAction>;

  /**
   * Mark an action as completed with notes
   * @param id - The action ID
   * @param notes - Completion notes (required)
   * @returns The completed action
   * @throws {Error} If completion fails
   */
  completeAction: (id: string, notes: string) => Promise<FollowUpAction>;

  /**
   * Cancel an action with a reason
   * @param id - The action ID
   * @param reason - Cancellation reason (required)
   * @returns The cancelled action
   * @throws {Error} If cancellation fails
   */
  cancelAction: (id: string, reason: string) => Promise<FollowUpAction>;

  // Assignment
  /**
   * Assign an action to a user
   * Requires NURSE, ADMIN, SCHOOL_ADMIN, or DISTRICT_ADMIN role
   * @param id - The action ID
   * @param userId - The user ID to assign to
   * @returns The updated action
   * @throws {Error} If user lacks permission or assignment fails
   */
  assignAction: (id: string, userId: string) => Promise<FollowUpAction>;

  /**
   * Unassign an action from its current user
   * @param id - The action ID
   * @returns The updated action
   * @throws {Error} If unassignment fails
   */
  unassignAction: (id: string) => Promise<FollowUpAction>;

  // Selection
  /**
   * Set the currently selected action
   * @param action - The action to select, or null to clear
   */
  setSelectedAction: (action: FollowUpAction | null) => void;

  /**
   * Clear the currently selected action
   */
  clearSelectedAction: () => void;

  // Filtering and Sorting
  /**
   * Update filter configuration
   * @param filters - Partial filter configuration to apply
   */
  setFilters: (filters: Partial<ActionFilters>) => void;

  /**
   * Clear all filters
   */
  clearFilters: () => void;

  /**
   * Set the field to sort by
   * @param sortBy - The field name
   */
  setSortBy: (sortBy: 'dueDate' | 'priority' | 'createdAt') => void;

  /**
   * Set the sort order
   * @param order - 'asc' for ascending, 'desc' for descending
   */
  setSortOrder: (order: 'asc' | 'desc') => void;

  // Utilities
  /**
   * Get all overdue actions with alert information
   * @returns Array of overdue alerts sorted by days overdue
   */
  getOverdueActions: () => OverdueAlert[];

  /**
   * Get all actions with a specific status
   * @param status - The status to filter by
   * @returns Array of matching actions
   */
  getActionsByStatus: (status: ActionStatus) => FollowUpAction[];

  /**
   * Get all actions with a specific priority
   * @param priority - The priority to filter by
   * @returns Array of matching actions
   */
  getActionsByPriority: (priority: ActionPriority) => FollowUpAction[];

  /**
   * Check if an action is overdue
   * Completed and cancelled actions are never considered overdue
   * @param action - The action to check
   * @returns True if the action is overdue
   */
  isActionOverdue: (action: FollowUpAction) => boolean;

  /**
   * Check if the current user can assign actions
   * @param action - The action to check
   * @returns True if user has permission to assign
   */
  canAssignAction: (action: FollowUpAction) => boolean;

  /**
   * Check if the current user can edit an action
   * Admins can edit any action, users can edit their own assigned actions
   * @param action - The action to check
   * @returns True if user has permission to edit
   */
  canEditAction: (action: FollowUpAction) => boolean;
}

/**
 * Complete context type combining state and methods
 */
export type FollowUpActionContextType = FollowUpActionContextState &
  FollowUpActionContextMethods;

/**
 * Provider component props
 */
export interface FollowUpActionProviderProps {
  /** Child components to render */
  children: ReactNode;
  /** Optional initial incident ID to load actions for */
  initialIncidentId?: string;
  /** Enable automatic refresh interval (in milliseconds) */
  refreshInterval?: number;
  /** Show overdue notifications automatically */
  autoNotifyOverdue?: boolean;
}

/**
 * Follow-Up Action Provider Component
 * Manages state and operations for incident follow-up actions
 *
 * @example
 * ```tsx
 * <FollowUpActionProvider
 *   initialIncidentId="incident-123"
 *   refreshInterval={60000}
 *   autoNotifyOverdue={true}
 * >
 *   <YourComponents />
 * </FollowUpActionProvider>
 * ```
 */
export function FollowUpActionProvider(
  props: FollowUpActionProviderProps
): JSX.Element;

/**
 * Custom hook to access Follow-Up Action context
 *
 * @returns Context value with all state and methods
 * @throws {Error} If used outside of FollowUpActionProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const {
 *     actions,
 *     isLoading,
 *     createFollowUpAction,
 *     updateActionStatus
 *   } = useFollowUpActions();
 *
 *   // Use context...
 * }
 * ```
 */
export function useFollowUpActions(): FollowUpActionContextType;

// Re-export types for convenience
export type {
  FollowUpAction,
  ActionStatus,
  ActionPriority,
  CreateFollowUpActionRequest,
  UpdateFollowUpActionRequest,
} from '../types/incidents';
