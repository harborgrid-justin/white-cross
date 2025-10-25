/**
 * FollowUpActionsList Component
 *
 * Displays a list of follow-up actions for an incident with filtering and sorting.
 * Features status filter, Add Action button, and empty states.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/buttons/Button';
import { EmptyState } from '@/components/ui/feedback/EmptyState';
import { LoadingSpinner } from '@/components/ui/feedback/LoadingSpinner';
import { Alert } from '@/components/ui/feedback/Alert';
import { Select } from '@/components/ui/inputs/Select';
import { cn } from '@/utils/cn';
import { useFollowUpActions } from '@/hooks/domains/incidents/FollowUpActionContext';
import { ActionStatus, ActionPriority, type FollowUpAction } from '@/types/incidents';
import FollowUpActionCard from './FollowUpActionCard';
import AddFollowUpDialog from './AddFollowUpDialog';

interface FollowUpActionsListProps {
  incidentId: string;
  className?: string;
}

/**
 * FollowUpActionsList component - Displays list of follow-up actions
 */
const FollowUpActionsList: React.FC<FollowUpActionsListProps> = ({ incidentId, className = '' }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<FollowUpAction | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<ActionStatus[]>([]);
  const [sortField, setSortField] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const {
    actions,
    isLoading,
    error,
    stats,
    filters,
    setFilters,
    loadFollowUpActions,
    deleteFollowUpAction,
    completeAction,
    setSortBy,
    setSortOrder: setContextSortOrder,
    isDeleting,
  } = useFollowUpActions();

  // Load actions on mount
  useEffect(() => {
    if (incidentId) {
      loadFollowUpActions(incidentId);
    }
  }, [incidentId, loadFollowUpActions]);

  // Update context sorting when local state changes
  useEffect(() => {
    setSortBy(sortField);
    setContextSortOrder(sortOrder);
  }, [sortField, sortOrder, setSortBy, setContextSortOrder]);

  const handleFilterByStatus = (statuses: ActionStatus[]) => {
    setSelectedStatuses(statuses);
    setFilters({ status: statuses.length > 0 ? statuses : undefined });
  };

  const handleAddAction = () => {
    setEditingAction(null);
    setIsAddDialogOpen(true);
  };

  const handleEditAction = (action: FollowUpAction) => {
    setEditingAction(action);
    setIsAddDialogOpen(true);
  };

  const handleDeleteAction = async (actionId: string) => {
    if (window.confirm('Are you sure you want to delete this follow-up action?')) {
      try {
        await deleteFollowUpAction(actionId);
      } catch (err) {
        console.error('Failed to delete action:', err);
      }
    }
  };

  const handleCompleteAction = async (actionId: string) => {
    const notes = window.prompt('Add completion notes (optional):');
    if (notes !== null) {
      try {
        await completeAction(actionId, notes || 'Completed');
      } catch (err) {
        console.error('Failed to complete action:', err);
      }
    }
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingAction(null);
  };

  // Status filter options
  const statusOptions = [
    { value: ActionStatus.PENDING, label: 'Pending' },
    { value: ActionStatus.IN_PROGRESS, label: 'In Progress' },
    { value: ActionStatus.COMPLETED, label: 'Completed' },
    { value: ActionStatus.CANCELLED, label: 'Cancelled' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'createdAt', label: 'Created Date' },
  ];

  if (error) {
    return (
      <div className={cn('follow-up-actions-list', className)}>
        <Alert variant="error" title="Error loading follow-up actions">
          {error.message || 'Failed to load follow-up actions. Please try again.'}
        </Alert>
      </div>
    );
  }

  return (
    <div className={cn('follow-up-actions-list', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Follow-Up Actions
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {stats.total} total actions ({stats.pending} pending, {stats.inProgress} in progress, {stats.completed} completed)
            {stats.overdue > 0 && (
              <span className="ml-2 text-red-600 dark:text-red-400 font-medium">
                • {stats.overdue} overdue
              </span>
            )}
          </p>
        </div>
        <Button variant="primary" onClick={handleAddAction}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Action
        </Button>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        {/* Status Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Status
          </label>
          <Select
            options={statusOptions}
            value={selectedStatuses}
            onChange={(value) => handleFilterByStatus(value as ActionStatus[])}
            placeholder="All statuses"
            multiple
            clearable
          />
        </div>

        {/* Sort Field */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <Select
            options={sortOptions}
            value={sortField}
            onChange={(value) => setSortField(value as 'dueDate' | 'priority' | 'createdAt')}
            placeholder="Select sort field"
          />
        </div>

        {/* Sort Order */}
        <div className="flex items-end">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            )}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Actions List */}
      {!isLoading && actions.length > 0 && (
        <div className="space-y-4">
          {actions.map((action) => (
            <FollowUpActionCard
              key={action.id}
              action={action}
              onEdit={handleEditAction}
              onDelete={handleDeleteAction}
              onComplete={handleCompleteAction}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && actions.length === 0 && (
        <EmptyState
          title={selectedStatuses.length > 0 ? 'No actions match filters' : 'No follow-up actions yet'}
          description={
            selectedStatuses.length > 0
              ? 'Try adjusting your filters to see more actions.'
              : 'Get started by adding a follow-up action for this incident.'
          }
          icon={
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          action={
            selectedStatuses.length === 0 ? (
              <Button variant="primary" onClick={handleAddAction}>
                Add First Action
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Add/Edit Dialog */}
      <AddFollowUpDialog
        isOpen={isAddDialogOpen}
        onClose={handleCloseDialog}
        incidentId={incidentId}
        action={editingAction}
      />
    </div>
  );
};

export default FollowUpActionsList;
