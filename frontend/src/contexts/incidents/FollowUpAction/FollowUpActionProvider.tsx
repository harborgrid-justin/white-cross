/**
 * WF-COMP-117-PROVIDER | FollowUpAction/FollowUpActionProvider.tsx - React provider component
 * Purpose: Provider component for Follow-Up Action context
 * Upstream: @tanstack/react-query, @/services, @/identity-access/contexts/AuthContext
 * Downstream: Components consuming follow-up action context
 * Related: TanStack Query, incident services
 * Exports: FollowUpActionProvider component
 * Last Updated: 2025-11-12 | File Type: .tsx
 * LLM Context: React provider component managing follow-up action state with TanStack Query
 */

/**
 * Follow-Up Action Provider Component
 * Enterprise-grade React provider for managing incident follow-up actions
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
 * @module FollowUpAction/FollowUpActionProvider
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { incidentReportsApi } from '@/services';
import { useAuth } from '@/identity-access/contexts/AuthContext';
import {
  ActionStatus,
  ActionPriority,
  type FollowUpAction,
  type CreateFollowUpActionRequest,
  type UpdateFollowUpActionRequest,
} from '@/types/domain/incidents';

// Import local modules
import type {
  FollowUpActionContextType,
  FollowUpActionProviderProps,
  ActionFilters,
  OverdueAlert,
} from './types';
import { QUERY_KEYS, DEFAULT_FILTERS } from './constants';
import { isOverdue } from './helpers';
import { FollowUpActionContext } from './hooks';
import { useMutations } from './useMutations';
import { useComputedValues } from './useComputedValues';

// =====================
// TYPE DEFINITIONS
// =====================

/**
 * Response type for follow-up actions query
 */
interface FollowUpActionsResponse {
  actions: FollowUpAction[];
}

// =====================
// PROVIDER COMPONENT
// =====================

/**
 * Follow-Up Action Provider
 * Manages state and operations for incident follow-up actions
 *
 * @example Basic usage
 * ```typescript
 * <FollowUpActionProvider initialIncidentId="incident-123">
 *   <IncidentDetails />
 * </FollowUpActionProvider>
 * ```
 *
 * @example With refresh interval
 * ```typescript
 * <FollowUpActionProvider
 *   initialIncidentId="incident-123"
 *   refreshInterval={30000}
 *   autoNotifyOverdue={true}
 * >
 *   <IncidentDashboard />
 * </FollowUpActionProvider>
 * ```
 */
export function FollowUpActionProvider({
  children,
  initialIncidentId,
  refreshInterval,
  autoNotifyOverdue = true,
}: FollowUpActionProviderProps) {
  const { user } = useAuth();

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
  } = useQuery<FollowUpActionsResponse>({
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
  // CUSTOM HOOKS
  // =====================

  const { createMutation, updateMutation, deleteMutation } = useMutations(currentIncidentId);
  const { filteredAndSortedActions, overdueActions, stats } = useComputedValues(
    actions,
    filters,
    sortBy,
    sortOrder,
    user
  );

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
    }
  }, [overdueActions, autoNotifyOverdue]);

  // =====================
  // CONTEXT METHODS
  // =====================

  const loadFollowUpActions = useCallback(
    async (incidentId: string): Promise<void> => {
      setCurrentIncidentId(incidentId);
      setFiltersState((prev) => ({ ...prev, incidentReportId: incidentId }));
      await refetch();
    },
    [refetch]
  );

  const refreshActions = useCallback(async (): Promise<void> => {
    await refetch();
  }, [refetch]);

  const createFollowUpAction = useCallback(
    async (data: CreateFollowUpActionRequest): Promise<FollowUpAction> => {
      const response = await createMutation.mutateAsync(data);
      return response.action;
    },
    [createMutation]
  );

  const updateFollowUpAction = useCallback(
    async (id: string, data: UpdateFollowUpActionRequest): Promise<FollowUpAction> => {
      const response = await updateMutation.mutateAsync({ id, data });
      return response.action;
    },
    [updateMutation]
  );

  const deleteFollowUpAction = useCallback(
    async (id: string): Promise<void> => {
      await deleteMutation.mutateAsync(id);
      if (selectedAction?.id === id) {
        setSelectedAction(null);
      }
    },
    [deleteMutation, selectedAction]
  );

  const updateActionStatus = useCallback(
    async (id: string, status: ActionStatus, notes?: string): Promise<FollowUpAction> => {
      return await updateFollowUpAction(id, { status, notes });
    },
    [updateFollowUpAction]
  );

  const completeAction = useCallback(
    async (id: string, notes: string): Promise<FollowUpAction> => {
      return await updateFollowUpAction(id, {
        status: ActionStatus.COMPLETED,
        notes,
      });
    },
    [updateFollowUpAction]
  );

  const cancelAction = useCallback(
    async (id: string, reason: string): Promise<FollowUpAction> => {
      return await updateFollowUpAction(id, {
        status: ActionStatus.CANCELLED,
        notes: `Cancelled: ${reason}`,
      });
    },
    [updateFollowUpAction]
  );

  const assignAction = useCallback(
    async (id: string, userId: string): Promise<FollowUpAction> => {
      if (!user) {
        throw new Error('User must be authenticated to assign actions');
      }

      const allowedRoles = ['NURSE', 'ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'];
      if (!allowedRoles.includes(user.role)) {
        throw new Error('Insufficient permissions to assign actions');
      }

      return await updateFollowUpAction(id, { assignedTo: userId });
    },
    [updateFollowUpAction, user]
  );

  const unassignAction = useCallback(
    async (id: string): Promise<FollowUpAction> => {
      return await updateFollowUpAction(id, { assignedTo: undefined });
    },
    [updateFollowUpAction]
  );

  const clearSelectedAction = useCallback(() => {
    setSelectedAction(null);
  }, []);

  const setFilters = useCallback((newFilters: Partial<ActionFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const setSortBy = useCallback((field: 'dueDate' | 'priority' | 'createdAt') => {
    setSortByState(field);
  }, []);

  const setSortOrder = useCallback((order: 'asc' | 'desc') => {
    setSortOrderState(order);
  }, []);

  const getOverdueActions = useCallback((): OverdueAlert[] => {
    return overdueActions;
  }, [overdueActions]);

  const getActionsByStatus = useCallback(
    (status: ActionStatus): FollowUpAction[] => {
      return actions.filter((action) => action.status === status);
    },
    [actions]
  );

  const getActionsByPriority = useCallback(
    (priority: ActionPriority): FollowUpAction[] => {
      return actions.filter((action) => action.priority === priority);
    },
    [actions]
  );

  const isActionOverdue = useCallback((action: FollowUpAction): boolean => {
    return isOverdue(action);
  }, []);

  const canAssignAction = useCallback(
    (action: FollowUpAction): boolean => {
      if (!user) return false;
      const allowedRoles = ['NURSE', 'ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'];
      return allowedRoles.includes(user.role);
    },
    [user]
  );

  const canEditAction = useCallback(
    (action: FollowUpAction): boolean => {
      if (!user) return false;
      if (['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
        return true;
      }
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
