/**
 * WF-COMP-116 | FollowUpActionContext.test.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./FollowUpActionContext, ../types/incidents, ../services | Dependencies: vitest, @testing-library/react, @tanstack/react-query
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: React components/utilities | Key Features: component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Follow-Up Action Context Tests
 * Comprehensive test suite for FollowUpActionContext functionality
 *
 * @module FollowUpActionContextTests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { FollowUpActionProvider, useFollowUpActions } from '../contexts/FollowUpActionContext';
import { ActionStatus, ActionPriority, type FollowUpAction } from '../types/incidents';
import * as services from '../services';

// Mock the services
vi.mock('../services', () => ({
  incidentReportsApi: {
    getFollowUpActions: vi.fn(),
    addFollowUpAction: vi.fn(),
    updateFollowUpAction: vi.fn(),
    deleteFollowUpAction: vi.fn(),
  },
}));

// Mock AuthContext
vi.mock('./AuthContext', () => ({
  useAuthContext: () => ({
    user: {
      id: 'user-123',
      role: 'NURSE',
      email: 'nurse@test.com',
      firstName: 'Test',
      lastName: 'Nurse',
    },
    loading: false,
  }),
}));

// Test data
const mockActions: FollowUpAction[] = [
  {
    id: 'action-1',
    incidentReportId: 'incident-123',
    action: 'Follow up with parent',
    priority: ActionPriority.HIGH,
    status: ActionStatus.PENDING,
    dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'action-2',
    incidentReportId: 'incident-123',
    action: 'Schedule medical evaluation',
    priority: ActionPriority.URGENT,
    status: ActionStatus.IN_PROGRESS,
    dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday (overdue)
    assignedTo: 'user-123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'action-3',
    incidentReportId: 'incident-123',
    action: 'Update health records',
    priority: ActionPriority.MEDIUM,
    status: ActionStatus.COMPLETED,
    dueDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    completedAt: new Date().toISOString(),
    completedBy: 'user-456',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper to create wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <FollowUpActionProvider initialIncidentId="incident-123">
        {children}
      </FollowUpActionProvider>
    </QueryClientProvider>
  );
}

describe('FollowUpActionContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(services.incidentReportsApi.getFollowUpActions).mockResolvedValue({
      actions: mockActions,
    });
  });

  // =====================
  // INITIALIZATION TESTS
  // =====================

  describe('Initialization', () => {
    it('should throw error when used outside provider', () => {
      const { result } = renderHook(() => useFollowUpActions());
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('must be used within a FollowUpActionProvider');
    });

    it('should initialize with default state', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.actions).toHaveLength(3);
      expect(result.current.selectedAction).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should load actions for initial incident ID', async () => {
      renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(services.incidentReportsApi.getFollowUpActions).toHaveBeenCalledWith('incident-123');
      });
    });
  });

  // =====================
  // DATA LOADING TESTS
  // =====================

  describe('Data Loading', () => {
    it('should load follow-up actions for specific incident', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.loadFollowUpActions('incident-456');
      });

      expect(services.incidentReportsApi.getFollowUpActions).toHaveBeenCalledWith('incident-456');
    });

    it('should handle loading errors', async () => {
      const error = new Error('Failed to load actions');
      vi.mocked(services.incidentReportsApi.getFollowUpActions).mockRejectedValue(error);

      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });

    it('should refresh actions', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshActions();
      });

      expect(services.incidentReportsApi.getFollowUpActions).toHaveBeenCalledTimes(2);
    });
  });

  // =====================
  // CREATE ACTION TESTS
  // =====================

  describe('Create Action', () => {
    it('should create new follow-up action', async () => {
      const newAction: FollowUpAction = {
        id: 'action-4',
        incidentReportId: 'incident-123',
        action: 'Test action',
        priority: ActionPriority.LOW,
        status: ActionStatus.PENDING,
        dueDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(services.incidentReportsApi.addFollowUpAction).mockResolvedValue({
        action: newAction,
      });

      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let createdAction: FollowUpAction | undefined;
      await act(async () => {
        createdAction = await result.current.createFollowUpAction({
          incidentReportId: 'incident-123',
          action: 'Test action',
          priority: ActionPriority.LOW,
          dueDate: new Date().toISOString(),
        });
      });

      expect(createdAction).toEqual(newAction);
      expect(services.incidentReportsApi.addFollowUpAction).toHaveBeenCalledWith({
        incidentReportId: 'incident-123',
        action: 'Test action',
        priority: ActionPriority.LOW,
        dueDate: expect.any(String),
      });
    });
  });

  // =====================
  // UPDATE ACTION TESTS
  // =====================

  describe('Update Action', () => {
    it('should update follow-up action', async () => {
      const updatedAction = { ...mockActions[0], status: ActionStatus.IN_PROGRESS };
      vi.mocked(services.incidentReportsApi.updateFollowUpAction).mockResolvedValue({
        action: updatedAction,
      });

      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateFollowUpAction('action-1', {
          status: ActionStatus.IN_PROGRESS,
        });
      });

      expect(services.incidentReportsApi.updateFollowUpAction).toHaveBeenCalledWith('action-1', {
        status: ActionStatus.IN_PROGRESS,
      });
    });

    it('should update action status', async () => {
      const updatedAction = { ...mockActions[0], status: ActionStatus.COMPLETED };
      vi.mocked(services.incidentReportsApi.updateFollowUpAction).mockResolvedValue({
        action: updatedAction,
      });

      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateActionStatus('action-1', ActionStatus.COMPLETED, 'Done!');
      });

      expect(services.incidentReportsApi.updateFollowUpAction).toHaveBeenCalledWith('action-1', {
        status: ActionStatus.COMPLETED,
        notes: 'Done!',
      });
    });

    it('should complete action with notes', async () => {
      const completedAction = { ...mockActions[0], status: ActionStatus.COMPLETED };
      vi.mocked(services.incidentReportsApi.updateFollowUpAction).mockResolvedValue({
        action: completedAction,
      });

      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.completeAction('action-1', 'Completed successfully');
      });

      expect(services.incidentReportsApi.updateFollowUpAction).toHaveBeenCalledWith('action-1', {
        status: ActionStatus.COMPLETED,
        notes: 'Completed successfully',
      });
    });

    it('should cancel action with reason', async () => {
      const cancelledAction = { ...mockActions[0], status: ActionStatus.CANCELLED };
      vi.mocked(services.incidentReportsApi.updateFollowUpAction).mockResolvedValue({
        action: cancelledAction,
      });

      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.cancelAction('action-1', 'No longer needed');
      });

      expect(services.incidentReportsApi.updateFollowUpAction).toHaveBeenCalledWith('action-1', {
        status: ActionStatus.CANCELLED,
        notes: 'Cancelled: No longer needed',
      });
    });
  });

  // =====================
  // DELETE ACTION TESTS
  // =====================

  describe('Delete Action', () => {
    it('should delete follow-up action', async () => {
      vi.mocked(services.incidentReportsApi.deleteFollowUpAction).mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteFollowUpAction('action-1');
      });

      expect(services.incidentReportsApi.deleteFollowUpAction).toHaveBeenCalledWith('action-1');
    });

    it('should clear selected action when deleted', async () => {
      vi.mocked(services.incidentReportsApi.deleteFollowUpAction).mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.setSelectedAction(mockActions[0]);
      });

      expect(result.current.selectedAction).toBe(mockActions[0]);

      await act(async () => {
        await result.current.deleteFollowUpAction('action-1');
      });

      expect(result.current.selectedAction).toBeNull();
    });
  });

  // =====================
  // ASSIGNMENT TESTS
  // =====================

  describe('Assignment', () => {
    it('should assign action to user', async () => {
      const assignedAction = { ...mockActions[0], assignedTo: 'user-456' };
      vi.mocked(services.incidentReportsApi.updateFollowUpAction).mockResolvedValue({
        action: assignedAction,
      });

      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.assignAction('action-1', 'user-456');
      });

      expect(services.incidentReportsApi.updateFollowUpAction).toHaveBeenCalledWith('action-1', {
        assignedTo: 'user-456',
      });
    });

    it('should unassign action', async () => {
      const unassignedAction = { ...mockActions[1], assignedTo: undefined };
      vi.mocked(services.incidentReportsApi.updateFollowUpAction).mockResolvedValue({
        action: unassignedAction,
      });

      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.unassignAction('action-2');
      });

      expect(services.incidentReportsApi.updateFollowUpAction).toHaveBeenCalledWith('action-2', {
        assignedTo: undefined,
      });
    });
  });

  // =====================
  // FILTERING TESTS
  // =====================

  describe('Filtering', () => {
    it('should filter actions by status', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.setFilters({ status: [ActionStatus.PENDING] });
      });

      expect(result.current.actions).toHaveLength(1);
      expect(result.current.actions[0].status).toBe(ActionStatus.PENDING);
    });

    it('should filter actions by priority', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.setFilters({ priority: [ActionPriority.URGENT] });
      });

      expect(result.current.actions).toHaveLength(1);
      expect(result.current.actions[0].priority).toBe(ActionPriority.URGENT);
    });

    it('should filter actions assigned to current user', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.setFilters({ assignedToMe: true });
      });

      expect(result.current.actions).toHaveLength(1);
      expect(result.current.actions[0].assignedTo).toBe('user-123');
    });

    it('should filter overdue actions only', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.setFilters({ overduedOnly: true });
      });

      expect(result.current.actions.length).toBeGreaterThan(0);
      result.current.actions.forEach((action) => {
        expect(result.current.isActionOverdue(action)).toBe(true);
      });
    });

    it('should clear filters', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.setFilters({ status: [ActionStatus.PENDING] });
      });

      expect(result.current.actions).toHaveLength(1);

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.actions).toHaveLength(3);
    });
  });

  // =====================
  // SORTING TESTS
  // =====================

  describe('Sorting', () => {
    it('should sort actions by due date', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.setSortBy('dueDate');
        result.current.setSortOrder('asc');
      });

      const dates = result.current.actions.map((a) => new Date(a.dueDate).getTime());
      expect(dates).toEqual([...dates].sort((a, b) => a - b));
    });

    it('should sort actions by priority', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.setSortBy('priority');
        result.current.setSortOrder('desc');
      });

      // First action should be URGENT (highest priority)
      expect(result.current.actions[0].priority).toBe(ActionPriority.URGENT);
    });
  });

  // =====================
  // STATISTICS TESTS
  // =====================

  describe('Statistics', () => {
    it('should calculate correct statistics', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.stats.total).toBe(3);
      expect(result.current.stats.pending).toBe(1);
      expect(result.current.stats.inProgress).toBe(1);
      expect(result.current.stats.completed).toBe(1);
      expect(result.current.stats.cancelled).toBe(0);
      expect(result.current.stats.overdue).toBeGreaterThan(0);
    });
  });

  // =====================
  // OVERDUE DETECTION TESTS
  // =====================

  describe('Overdue Detection', () => {
    it('should identify overdue actions', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const overdueActions = result.current.getOverdueActions();
      expect(overdueActions.length).toBeGreaterThan(0);
      expect(overdueActions[0].action.id).toBe('action-2');
    });

    it('should calculate days overdue', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const overdueActions = result.current.getOverdueActions();
      expect(overdueActions[0].daysOverdue).toBeGreaterThan(0);
    });

    it('should not mark completed actions as overdue', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const completedAction = mockActions.find((a) => a.status === ActionStatus.COMPLETED);
      if (completedAction) {
        expect(result.current.isActionOverdue(completedAction)).toBe(false);
      }
    });
  });

  // =====================
  // PERMISSION TESTS
  // =====================

  describe('Permissions', () => {
    it('should check if user can assign action', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canAssignAction(mockActions[0])).toBe(true);
    });

    it('should check if user can edit action', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // User should be able to edit their own assigned actions
      const assignedAction = mockActions.find((a) => a.assignedTo === 'user-123');
      if (assignedAction) {
        expect(result.current.canEditAction(assignedAction)).toBe(true);
      }
    });
  });

  // =====================
  // UTILITY METHOD TESTS
  // =====================

  describe('Utility Methods', () => {
    it('should get actions by status', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const pendingActions = result.current.getActionsByStatus(ActionStatus.PENDING);
      expect(pendingActions).toHaveLength(1);
      expect(pendingActions[0].status).toBe(ActionStatus.PENDING);
    });

    it('should get actions by priority', async () => {
      const { result } = renderHook(() => useFollowUpActions(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const urgentActions = result.current.getActionsByPriority(ActionPriority.URGENT);
      expect(urgentActions).toHaveLength(1);
      expect(urgentActions[0].priority).toBe(ActionPriority.URGENT);
    });
  });
});
