/**
 * FollowUpActionDetails Component
 *
 * Detailed view of a follow-up action with full information, activity timeline, and comments.
 * Features Edit/Complete/Delete actions and comprehensive audit trail.
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/buttons/Button';
import { Card } from '@/components/ui/layout/Card';
import { Alert } from '@/components/ui/feedback/Alert';
import { LoadingSpinner } from '@/components/ui/feedback/LoadingSpinner';
import { cn } from '@/utils/cn';
import { useFollowUpActions } from '@/hooks/domains/incidents/FollowUpActionContext';
import { ActionStatus, ActionPriority, type FollowUpAction } from '@/types/incidents';
import { format } from 'date-fns';
import AddFollowUpDialog from './AddFollowUpDialog';

interface FollowUpActionDetailsProps {
  actionId: string;
  className?: string;
}

/**
 * Activity timeline entry interface
 */
interface ActivityEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  description: string;
  icon: 'created' | 'updated' | 'completed' | 'assigned' | 'commented';
}

/**
 * FollowUpActionDetails component - Detailed action view
 */
const FollowUpActionDetails: React.FC<FollowUpActionDetailsProps> = ({
  actionId,
  className = '',
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const {
    actions,
    isLoading,
    error,
    isActionOverdue,
    canEditAction,
    canAssignAction,
    completeAction,
    deleteFollowUpAction,
    isUpdating,
    isDeleting,
  } = useFollowUpActions();

  // Find the action by ID
  const action = actions.find((a) => a.id === actionId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" title="Error loading action details">
        {error.message || 'Failed to load action details. Please try again.'}
      </Alert>
    );
  }

  if (!action) {
    return (
      <Alert variant="warning" title="Action not found">
        The requested follow-up action could not be found.
      </Alert>
    );
  }

  const isOverdue = isActionOverdue(action);
  const canEdit = canEditAction(action);
  const canAssign = canAssignAction(action);
  const isCompleted = action.status === ActionStatus.COMPLETED;
  const isCancelled = action.status === ActionStatus.CANCELLED;

  // Generate mock activity timeline (in production, this would come from API)
  const activityTimeline: ActivityEntry[] = [
    {
      id: '1',
      timestamp: action.createdAt,
      user: 'System',
      action: 'Created',
      description: 'Follow-up action created',
      icon: 'created',
    },
    ...(action.assignedTo
      ? [
          {
            id: '2',
            timestamp: action.createdAt,
            user: 'Admin',
            action: 'Assigned',
            description: `Assigned to ${action.assignedToUser?.firstName || 'User'}`,
            icon: 'assigned' as const,
          },
        ]
      : []),
    ...(action.status === ActionStatus.IN_PROGRESS
      ? [
          {
            id: '3',
            timestamp: action.updatedAt || action.createdAt,
            user: action.assignedToUser?.firstName || 'User',
            action: 'Updated',
            description: 'Status changed to In Progress',
            icon: 'updated' as const,
          },
        ]
      : []),
    ...(action.completedAt
      ? [
          {
            id: '4',
            timestamp: action.completedAt,
            user: action.assignedToUser?.firstName || 'User',
            action: 'Completed',
            description: 'Action marked as completed',
            icon: 'completed' as const,
          },
        ]
      : []),
  ];

  const handleComplete = async () => {
    const notes = window.prompt('Add completion notes:');
    if (notes !== null) {
      try {
        await completeAction(action.id, notes || 'Completed');
      } catch (err) {
        console.error('Failed to complete action:', err);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this follow-up action?')) {
      try {
        await deleteFollowUpAction(action.id);
      } catch (err) {
        console.error('Failed to delete action:', err);
      }
    }
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  // Status badge config
  const getStatusConfig = (status: ActionStatus) => {
    switch (status) {
      case ActionStatus.PENDING:
        return { variant: 'default' as const, label: 'Pending' };
      case ActionStatus.IN_PROGRESS:
        return { variant: 'info' as const, label: 'In Progress' };
      case ActionStatus.COMPLETED:
        return { variant: 'success' as const, label: 'Completed' };
      case ActionStatus.CANCELLED:
        return { variant: 'error' as const, label: 'Cancelled' };
      default:
        return { variant: 'default' as const, label: status };
    }
  };

  // Priority badge config
  const getPriorityConfig = (priority: ActionPriority) => {
    switch (priority) {
      case ActionPriority.URGENT:
        return { variant: 'error' as const, label: 'Urgent' };
      case ActionPriority.HIGH:
        return { variant: 'warning' as const, label: 'High' };
      case ActionPriority.MEDIUM:
        return { variant: 'info' as const, label: 'Medium' };
      case ActionPriority.LOW:
        return { variant: 'default' as const, label: 'Low' };
      default:
        return { variant: 'default' as const, label: priority };
    }
  };

  const statusConfig = getStatusConfig(action.status);
  const priorityConfig = getPriorityConfig(action.priority);

  // Get timeline icon
  const getActivityIcon = (icon: ActivityEntry['icon']) => {
    switch (icon) {
      case 'created':
        return (
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full p-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'updated':
        return (
          <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 rounded-full p-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      case 'completed':
        return (
          <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full p-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'assigned':
        return (
          <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full p-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'commented':
        return (
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full p-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className={cn('follow-up-action-details space-y-6', className)}>
      {/* Header Card */}
      <Card>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={statusConfig.variant} size="md" shape="pill">
                  {statusConfig.label}
                </Badge>
                <Badge variant={priorityConfig.variant} size="md" shape="pill">
                  {priorityConfig.label}
                </Badge>
                {isOverdue && !isCompleted && !isCancelled && (
                  <Badge variant="error" size="md" shape="pill">
                    Overdue
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {action.action}
              </h2>
            </div>

            {/* Action Buttons */}
            {canEdit && (
              <div className="flex items-center gap-2">
                {!isCompleted && !isCancelled && (
                  <Button
                    variant="primary"
                    onClick={handleComplete}
                    disabled={isUpdating}
                  >
                    Complete
                  </Button>
                )}
                {!isCompleted && (
                  <Button
                    variant="secondary"
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Due Date</h3>
              <p className={cn(
                'text-base font-medium',
                isOverdue && !isCompleted && !isCancelled ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'
              )}>
                {format(new Date(action.dueDate), 'MMMM dd, yyyy')}
                {isOverdue && !isCompleted && !isCancelled && ' (Overdue)'}
              </p>
            </div>

            {/* Assigned To */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Assigned To</h3>
              <p className="text-base text-gray-900 dark:text-gray-100">
                {action.assignedTo ? action.assignedToUser?.firstName || 'User' : 'Unassigned'}
              </p>
            </div>

            {/* Created */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created</h3>
              <p className="text-base text-gray-900 dark:text-gray-100">
                {format(new Date(action.createdAt), 'MMMM dd, yyyy HH:mm')}
              </p>
            </div>

            {/* Completed */}
            {action.completedAt && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Completed</h3>
                <p className="text-base text-gray-900 dark:text-gray-100">
                  {format(new Date(action.completedAt), 'MMMM dd, yyyy HH:mm')}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          {action.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Notes</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {action.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Activity Timeline
          </h3>

          <div className="space-y-4">
            {activityTimeline.map((entry, index) => (
              <div key={entry.id} className="flex gap-4">
                {/* Icon */}
                <div className="relative">
                  {getActivityIcon(entry.icon)}
                  {index < activityTimeline.length - 1 && (
                    <div className="absolute top-10 left-1/2 w-0.5 h-full -ml-px bg-gray-200 dark:bg-gray-700" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {entry.action}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      by {entry.user}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {entry.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {format(new Date(entry.timestamp), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Comments Section (Placeholder) */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Comments
            </h3>
            <Button variant="secondary" size="sm" onClick={() => setShowComments(!showComments)}>
              {showComments ? 'Hide' : 'Show'} Comments
            </Button>
          </div>

          {showComments && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <p>Comments functionality coming soon...</p>
            </div>
          )}
        </div>
      </Card>

      {/* Edit Dialog */}
      <AddFollowUpDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        incidentId={action.incidentReportId}
        action={action}
      />
    </div>
  );
};

export default FollowUpActionDetails;
