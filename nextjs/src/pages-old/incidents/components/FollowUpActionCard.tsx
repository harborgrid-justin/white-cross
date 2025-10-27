/**
 * FollowUpActionCard Component
 *
 * Displays a single follow-up action with status, priority, assignment, and actions.
 * Features expandable notes section and visual indicators for overdue status.
 */

import React, { useState } from 'react';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { useFollowUpActions } from '@/hooks/domains/incidents/FollowUpActionContext';
import { ActionStatus, ActionPriority, type FollowUpAction } from '@/types/incidents';
import { format, isPast } from 'date-fns';

interface FollowUpActionCardProps {
  action: FollowUpAction;
  onEdit?: (action: FollowUpAction) => void;
  onDelete?: (actionId: string) => void;
  onComplete?: (actionId: string) => void;
  className?: string;
}

/**
 * FollowUpActionCard component - Displays follow-up action information
 */
const FollowUpActionCard: React.FC<FollowUpActionCardProps> = ({
  action,
  onEdit,
  onDelete,
  onComplete,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isActionOverdue, canEditAction, completeAction, isUpdating } = useFollowUpActions();

  const isOverdue = isActionOverdue(action);
  const canEdit = canEditAction(action);
  const isCompleted = action.status === ActionStatus.COMPLETED;
  const isCancelled = action.status === ActionStatus.CANCELLED;

  const handleComplete = async () => {
    if (onComplete) {
      onComplete(action.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(action);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(action.id);
    }
  };

  // Status badge configuration
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

  // Priority badge configuration
  const getPriorityConfig = (priority: ActionPriority) => {
    switch (priority) {
      case ActionPriority.URGENT:
        return { variant: 'error' as const, label: 'Urgent', icon: '🔴' };
      case ActionPriority.HIGH:
        return { variant: 'warning' as const, label: 'High', icon: '🟠' };
      case ActionPriority.MEDIUM:
        return { variant: 'info' as const, label: 'Medium', icon: '🟡' };
      case ActionPriority.LOW:
        return { variant: 'default' as const, label: 'Low', icon: '🟢' };
      default:
        return { variant: 'default' as const, label: priority, icon: '⚪' };
    }
  };

  const statusConfig = getStatusConfig(action.status);
  const priorityConfig = getPriorityConfig(action.priority);

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow',
        isOverdue && !isCompleted && !isCancelled && 'border-l-4 border-l-red-500',
        isCompleted && 'border-l-4 border-l-green-500',
        isCancelled && 'opacity-60',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Status and Priority Badges */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={statusConfig.variant} size="sm" shape="pill">
              {statusConfig.label}
            </Badge>
            <Badge variant={priorityConfig.variant} size="sm" shape="pill">
              <span className="mr-1">{priorityConfig.icon}</span>
              {priorityConfig.label}
            </Badge>
            {isOverdue && !isCompleted && !isCancelled && (
              <Badge variant="error" size="sm" shape="pill">
                Overdue
              </Badge>
            )}
          </div>

          {/* Action Description */}
          <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2 break-words">
            {action.action}
          </h4>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {/* Due Date */}
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={cn(isOverdue && !isCompleted && !isCancelled && 'text-red-600 dark:text-red-400 font-medium')}>
                Due: {format(new Date(action.dueDate), 'MMM dd, yyyy')}
              </span>
            </div>

            {/* Assigned To */}
            {action.assignedTo && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Assigned to: {action.assignedToUser?.firstName || 'User'}</span>
              </div>
            )}

            {/* Completed Date */}
            {action.completedAt && (
              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Completed: {format(new Date(action.completedAt), 'MMM dd, yyyy')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isCompleted && !isCancelled && canEdit && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleComplete}
              disabled={isUpdating}
              title="Mark as complete"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </Button>
          )}
          {canEdit && !isCompleted && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEdit}
              title="Edit action"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
          )}
          {canEdit && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              title="Delete action"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          )}
        </div>
      </div>

      {/* Notes Section (Expandable) */}
      {action.notes && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <svg
              className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-90')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>{isExpanded ? 'Hide' : 'Show'} Notes</span>
          </button>

          {isExpanded && (
            <div className="mt-2 ml-6 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {action.notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Created Date (Footer) */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-500">
        Created: {format(new Date(action.createdAt), 'MMM dd, yyyy HH:mm')}
      </div>
    </div>
  );
};

export default FollowUpActionCard;
