/**
 * Follow-Up Action Context
 * Enterprise-grade context for managing incident follow-up actions
 *
 * Features:
 * - Comprehensive state management for follow-up actions
 * - TanStack Query integration for real-time updates
 * - Priority-based filtering and sorting
 * - Overdue action detection and alerts
 * - Optimistic UI updates
 * - Permission-based action assignments
 * - Status tracking and lifecycle management
 *
 * @module FollowUpActionContext
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentReportsApi } from '../services';
import { useAuthContext } from './AuthContext';
import {
  ActionStatus,
  ActionPriority,
  type FollowUpAction,
  type CreateFollowUpActionRequest,
  type UpdateFollowUpActionRequest,
} from '../types/incidents';

// =====================
// TYPE DEFINITIONS
// =====================

/**
 * Overdue action alert information
 */
interface OverdueAlert {
  action: FollowUpAction;
  daysOverdue: number;
  severity: 'warning' | 'critical';
}

/**
 * Filter configuration for follow-up actions
 */
interface ActionFilters {
  status?: ActionStatus[];
  priority?: ActionPriority[];
  assignedToMe?: boolean;
  overduedOnly?: boolean;
  incidentReportId?: string;
}

/**
 * Context state interface
 */
interface FollowUpActionContextState {
  // Data State
  actions: FollowUpAction[];
  selectedAction: FollowUpAction | null;
  overdueActions: OverdueAlert[];

  // Loading States
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Error States
  error: Error | null;

  // Filters and Sorting
  filters: ActionFilters;
  sortBy: 'dueDate' | 'priority' | 'createdAt';
  sortOrder: 'asc' | 'desc';

  // Statistics
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    overdue: number;
  };
}

/**
 * Context methods interface
 */
interface FollowUpActionContextMethods {
  // Data Loading
  loadFollowUpActions: (incidentId: string) => Promise<void>;
  refreshActions: () => Promise<void>;

  // CRUD Operations
  createFollowUpAction: (data: CreateFollowUpActionRequest) => Promise<FollowUpAction>;
  updateFollowUpAction: (id: string, data: UpdateFollowUpActionRequest) => Promise<FollowUpAction>;
  deleteFollowUpAction: (id: string) => Promise<void>;

  // Status Management
  updateActionStatus: (id: string, status: ActionStatus, notes?: string) => Promise<FollowUpAction>;
  completeAction: (id: string, notes: string) => Promise<FollowUpAction>;
  cancelAction: (id: string, reason: string) => Promise<FollowUpAction>;

  // Assignment
  assignAction: (id: string, userId: string) => Promise<FollowUpAction>;
  unassignAction: (id: string) => Promise<FollowUpAction>;

  // Selection
  setSelectedAction: (action: FollowUpAction | null) => void;
  clearSelectedAction: () => void;

  // Filtering and Sorting
  setFilters: (filters: Partial<ActionFilters>) => void;
  clearFilters: () => void;
  setSortBy: (sortBy: 'dueDate' | 'priority' | 'createdAt') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;

  // Utilities
  getOverdueActions: () => OverdueAlert[];
  getActionsByStatus: (status: ActionStatus) => FollowUpAction[];
  getActionsByPriority: (priority: ActionPriority) => FollowUpAction[];
  isActionOverdue: (action: FollowUpAction) => boolean;
  canAssignAction: (action: FollowUpAction) => boolean;
  canEditAction: (action: FollowUpAction) => boolean;
}

/**
 * Complete context type
 */
type FollowUpActionContextType = FollowUpActionContextState & FollowUpActionContextMethods;

// =====================
// CONTEXT CREATION
// =====================

const FollowUpActionContext = createContext<FollowUpActionContextType | undefined>(undefined);

/**
 * Custom hook to access Follow-Up Action context
 * @throws {Error} If used outside of FollowUpActionProvider
 */
export function useFollowUpActions(): FollowUpActionContextType {
  const context = useContext(FollowUpActionContext);
  if (context === undefined) {
    throw new Error('useFollowUpActions must be used within a FollowUpActionProvider');
  }
  return context;
}

// =====================
// PROVIDER PROPS
// =====================

interface FollowUpActionProviderProps {
  children: React.ReactNode;
  /** Optional initial incident ID to load actions for */
  initialIncidentId?: string;
  /** Enable automatic refresh interval (in ms) */
  refreshInterval?: number;
  /** Show overdue notifications automatically */
  autoNotifyOverdue?: boolean;
}

// =====================
// CONSTANTS
// =====================

const QUERY_KEYS = {
  actions: (incidentId?: string) => ['followUpActions', incidentId].filter(Boolean),
  action: (id: string) => ['followUpAction', id],
} as const;

const DEFAULT_FILTERS: ActionFilters = {
  status: undefined,
  priority: undefined,
  assignedToMe: false,
  overduedOnly: false,
  incidentReportId: undefined,
};

const OVERDUE_WARNING_DAYS = 1; // Days before showing warning
const OVERDUE_CRITICAL_DAYS = 3; // Days before showing critical alert

// =====================
// HELPER FUNCTIONS
// =====================

/**
 * Calculate if an action is overdue
 */
function isOverdue(action: FollowUpAction): boolean {
  if (action.status === ActionStatus.COMPLETED || action.status === ActionStatus.CANCELLED) {
    return false;
  }
  return new Date(action.dueDate) < new Date();
}

/**
 * Calculate days overdue
 */
function getDaysOverdue(action: FollowUpAction): number {
  if (!isOverdue(action)) return 0;
  const now = new Date();
  const dueDate = new Date(action.dueDate);
  const diffTime = Math.abs(now.getTime() - dueDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get overdue severity level
 */
function getOverdueSeverity(daysOverdue: number): 'warning' | 'critical' {
  return daysOverdue >= OVERDUE_CRITICAL_DAYS ? 'critical' : 'warning';
}

/**
 * Sort actions by priority
 */
function sortByPriority(a: FollowUpAction, b: FollowUpAction, order: 'asc' | 'desc'): number {
  const priorityOrder = {
    [ActionPriority.URGENT]: 4,
    [ActionPriority.HIGH]: 3,
    [ActionPriority.MEDIUM]: 2,
    [ActionPriority.LOW]: 1,
  };
  const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
  return order === 'asc' ? diff : -diff;
}

/**
 * Sort actions by date
 */
function sortByDate(a: FollowUpAction, b: FollowUpAction, field: 'dueDate' | 'createdAt', order: 'asc' | 'desc'): number {
  const dateA = new Date(a[field]).getTime();
  const dateB = new Date(b[field]).getTime();
  const diff = dateA - dateB;
  return order === 'asc' ? diff : -diff;
}

// =====================
// PROVIDER COMPONENT
// =====================

/**
 * Follow-Up Action Provider
 * Manages state and operations for incident follow-up actions
 */
export function FollowUpActionProvider({
  children,
  initialIncidentId,
  refreshInterval,
  autoNotifyOverdue = true,
}: FollowUpActionProviderProps) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  // =====================
  // LOCAL STATE
  // =====================

  const [selectedAction, setSelectedAction] = useState<FollowUpAction | null>(null);
  const [filters, setFiltersState] = useState<ActionFilters>(DEFAULT_FILTERS);
  const [sortBy, setSortByState] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate');
  const [sortOrder, setSortOrderState] = useState<'asc' | 'desc'>('asc');
  const [currentIncidentId, setCurrentIncidentId] = useState<string | undefined>(initialIncidentId);

  // =====================
  // TANSTACK QUERY
  // =====================

  /**
   * Query for fetching follow-up actions
   */
  const {
    data: actionsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.actions(currentIncidentId),
    queryFn: async () => {
      if (!currentIncidentId) {
        return { actions: [] };
      }
      return await incidentReportsApi.getFollowUpActions(currentIncidentId);
    },
    enabled: !!currentIncidentId,
    refetchInterval: refreshInterval,
    staleTime: 30000, // 30 seconds
  });

  const actions = actionsData?.actions || [];

  // =====================
  // MUTATIONS
  // =====================

  /**
   * Mutation for creating a follow-up action
   */
  const createMutation = useMutation({
    mutationFn: (data: CreateFollowUpActionRequest) => incidentReportsApi.addFollowUpAction(data),
    onSuccess: (response) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.actions(response.action.incidentReportId) });
      // Also invalidate the incident query to update follow-up action count
      queryClient.invalidateQueries({ queryKey: ['incidentReport', response.action.incidentReportId] });
    },
  });

  /**
   * Mutation for updating a follow-up action
   */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFollowUpActionRequest }) =>
      incidentReportsApi.updateFollowUpAction(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.actions(currentIncidentId) });

      // Snapshot previous value
      const previousActions = queryClient.getQueryData(QUERY_KEYS.actions(currentIncidentId));

      // Optimistically update
      queryClient.setQueryData(QUERY_KEYS.actions(currentIncidentId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          actions: old.actions.map((action: FollowUpAction) =>
            action.id === id ? { ...action, ...data } : action
          ),
        };
      });

      return { previousActions };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousActions) {
        queryClient.setQueryData(QUERY_KEYS.actions(currentIncidentId), context.previousActions);
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.actions(response.action.incidentReportId) });
    },
  });

  /**
   * Mutation for deleting a follow-up action
   */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => incidentReportsApi.deleteFollowUpAction(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.actions(currentIncidentId) });

      const previousActions = queryClient.getQueryData(QUERY_KEYS.actions(currentIncidentId));

      // Optimistically remove
      queryClient.setQueryData(QUERY_KEYS.actions(currentIncidentId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          actions: old.actions.filter((action: FollowUpAction) => action.id !== id),
        };
      });

      return { previousActions };
    },
    onError: (err, variables, context) => {
      if (context?.previousActions) {
        queryClient.setQueryData(QUERY_KEYS.actions(currentIncidentId), context.previousActions);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.actions(currentIncidentId) });
    },
  });

  // =====================
  // COMPUTED VALUES
  // =====================

  /**
   * Filter and sort actions based on current state
   */
  const filteredAndSortedActions = useMemo(() => {
    let filtered = [...actions];

    // Apply filters
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((action) => filters.status!.includes(action.status));
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter((action) => filters.priority!.includes(action.priority));
    }

    if (filters.assignedToMe && user) {
      filtered = filtered.filter((action) => action.assignedTo === user.id);
    }

    if (filters.overduedOnly) {
      filtered = filtered.filter(isOverdue);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        return sortByPriority(a, b, sortOrder);
      } else {
        return sortByDate(a, b, sortBy, sortOrder);
      }
    });

    return filtered;
  }, [actions, filters, sortBy, sortOrder, user]);

  /**
   * Calculate overdue actions with alerts
   */
  const overdueActions = useMemo<OverdueAlert[]>(() => {
    return actions
      .filter(isOverdue)
      .map((action) => {
        const daysOverdue = getDaysOverdue(action);
        return {
          action,
          daysOverdue,
          severity: getOverdueSeverity(daysOverdue),
        };
      })
      .sort((a, b) => b.daysOverdue - a.daysOverdue);
  }, [actions]);

  /**
   * Calculate statistics
   */
  const stats = useMemo(() => {
    return {
      total: actions.length,
      pending: actions.filter((a) => a.status === ActionStatus.PENDING).length,
      inProgress: actions.filter((a) => a.status === ActionStatus.IN_PROGRESS).length,
      completed: actions.filter((a) => a.status === ActionStatus.COMPLETED).length,
      cancelled: actions.filter((a) => a.status === ActionStatus.CANCELLED).length,
      overdue: overdueActions.length,
    };
  }, [actions, overdueActions]);

  // =====================
  // NOTIFICATION EFFECT
  // =====================

  /**
   * Show notifications for overdue actions
   */
  useEffect(() => {
    if (!autoNotifyOverdue) return;

    const criticalOverdue = overdueActions.filter((alert) => alert.severity === 'critical');
    if (criticalOverdue.length > 0) {
      console.warn(
        `[FollowUpActions] ${criticalOverdue.length} critical overdue action(s) detected`,
        criticalOverdue
      );
      // You can integrate with a notification system here
      // e.g., toast.error(`You have ${criticalOverdue.length} critical overdue actions!`)
    }
  }, [overdueActions, autoNotifyOverdue]);

  // =====================
  // CONTEXT METHODS
  // =====================

  /**
   * Load follow-up actions for a specific incident
   */
  const loadFollowUpActions = useCallback(
    async (incidentId: string): Promise<void> => {
      setCurrentIncidentId(incidentId);
      setFiltersState((prev) => ({ ...prev, incidentReportId: incidentId }));
      await refetch();
    },
    [refetch]
  );

  /**
   * Refresh current actions
   */
  const refreshActions = useCallback(async (): Promise<void> => {
    await refetch();
  }, [refetch]);

  /**
   * Create a new follow-up action
   */
  const createFollowUpAction = useCallback(
    async (data: CreateFollowUpActionRequest): Promise<FollowUpAction> => {
      const response = await createMutation.mutateAsync(data);
      return response.action;
    },
    [createMutation]
  );

  /**
   * Update a follow-up action
   */
  const updateFollowUpAction = useCallback(
    async (id: string, data: UpdateFollowUpActionRequest): Promise<FollowUpAction> => {
      const response = await updateMutation.mutateAsync({ id, data });
      return response.action;
    },
    [updateMutation]
  );

  /**
   * Delete a follow-up action
   */
  const deleteFollowUpAction = useCallback(
    async (id: string): Promise<void> => {
      await deleteMutation.mutateAsync(id);
      if (selectedAction?.id === id) {
        setSelectedAction(null);
      }
    },
    [deleteMutation, selectedAction]
  );

  /**
   * Update action status with optional notes
   */
  const updateActionStatus = useCallback(
    async (id: string, status: ActionStatus, notes?: string): Promise<FollowUpAction> => {
      return await updateFollowUpAction(id, { status, notes });
    },
    [updateFollowUpAction]
  );

  /**
   * Complete an action with completion notes
   */
  const completeAction = useCallback(
    async (id: string, notes: string): Promise<FollowUpAction> => {
      return await updateFollowUpAction(id, {
        status: ActionStatus.COMPLETED,
        notes,
      });
    },
    [updateFollowUpAction]
  );

  /**
   * Cancel an action with reason
   */
  const cancelAction = useCallback(
    async (id: string, reason: string): Promise<FollowUpAction> => {
      return await updateFollowUpAction(id, {
        status: ActionStatus.CANCELLED,
        notes: `Cancelled: ${reason}`,
      });
    },
    [updateFollowUpAction]
  );

  /**
   * Assign action to a user
   * @permission Requires NURSE, ADMIN, or SCHOOL_ADMIN role
   */
  const assignAction = useCallback(
    async (id: string, userId: string): Promise<FollowUpAction> => {
      if (!user) {
        throw new Error('User must be authenticated to assign actions');
      }

      // Permission check
      const allowedRoles = ['NURSE', 'ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'];
      if (!allowedRoles.includes(user.role)) {
        throw new Error('Insufficient permissions to assign actions');
      }

      return await updateFollowUpAction(id, { assignedTo: userId });
    },
    [updateFollowUpAction, user]
  );

  /**
   * Unassign action from current user
   */
  const unassignAction = useCallback(
    async (id: string): Promise<FollowUpAction> => {
      return await updateFollowUpAction(id, { assignedTo: undefined });
    },
    [updateFollowUpAction]
  );

  /**
   * Clear selected action
   */
  const clearSelectedAction = useCallback(() => {
    setSelectedAction(null);
  }, []);

  /**
   * Set filters
   */
  const setFilters = useCallback((newFilters: Partial<ActionFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  /**
   * Set sort field
   */
  const setSortBy = useCallback((field: 'dueDate' | 'priority' | 'createdAt') => {
    setSortByState(field);
  }, []);

  /**
   * Set sort order
   */
  const setSortOrder = useCallback((order: 'asc' | 'desc') => {
    setSortOrderState(order);
  }, []);

  /**
   * Get overdue actions
   */
  const getOverdueActions = useCallback((): OverdueAlert[] => {
    return overdueActions;
  }, [overdueActions]);

  /**
   * Get actions by status
   */
  const getActionsByStatus = useCallback(
    (status: ActionStatus): FollowUpAction[] => {
      return actions.filter((action) => action.status === status);
    },
    [actions]
  );

  /**
   * Get actions by priority
   */
  const getActionsByPriority = useCallback(
    (priority: ActionPriority): FollowUpAction[] => {
      return actions.filter((action) => action.priority === priority);
    },
    [actions]
  );

  /**
   * Check if action is overdue
   */
  const isActionOverdue = useCallback((action: FollowUpAction): boolean => {
    return isOverdue(action);
  }, []);

  /**
   * Check if user can assign action
   */
  const canAssignAction = useCallback(
    (action: FollowUpAction): boolean => {
      if (!user) return false;
      const allowedRoles = ['NURSE', 'ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'];
      return allowedRoles.includes(user.role);
    },
    [user]
  );

  /**
   * Check if user can edit action
   */
  const canEditAction = useCallback(
    (action: FollowUpAction): boolean => {
      if (!user) return false;
      // Admin roles can edit any action
      if (['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
        return true;
      }
      // User can edit actions assigned to them or unassigned actions
      return !action.assignedTo || action.assignedTo === user.id;
    },
    [user]
  );

  // =====================
  // CONTEXT VALUE
  // =====================

  const value: FollowUpActionContextType = {
    // State
    actions: filteredAndSortedActions,
    selectedAction,
    overdueActions,
    isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error: error as Error | null,
    filters,
    sortBy,
    sortOrder,
    stats,

    // Methods
    loadFollowUpActions,
    refreshActions,
    createFollowUpAction,
    updateFollowUpAction,
    deleteFollowUpAction,
    updateActionStatus,
    completeAction,
    cancelAction,
    assignAction,
    unassignAction,
    setSelectedAction,
    clearSelectedAction,
    setFilters,
    clearFilters,
    setSortBy,
    setSortOrder,
    getOverdueActions,
    getActionsByStatus,
    getActionsByPriority,
    isActionOverdue,
    canAssignAction,
    canEditAction,
  };

  return <FollowUpActionContext.Provider value={value}>{children}</FollowUpActionContext.Provider>;
}

// =====================
// EXPORTS
// =====================

export type { FollowUpActionContextType, ActionFilters, OverdueAlert };
