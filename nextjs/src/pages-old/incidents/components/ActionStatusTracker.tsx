/**
 * ActionStatusTracker Component
 *
 * Compact progress tracker widget for follow-up actions.
 * Shows completion percentage, status breakdown, and overdue actions.
 */

import React, { useEffect } from 'react';
import { Badge } from '@/components/ui/display/Badge';
import { Progress } from '@/components/ui/feedback/Progress';
import { cn } from '@/utils/cn';
import { useFollowUpActions } from '@/hooks/domains/incidents/FollowUpActionContext';
import { ActionStatus, type FollowUpAction } from '@/types/incidents';
import { format } from 'date-fns';

interface ActionStatusTrackerProps {
  incidentId: string;
  className?: string;
  showOverdueList?: boolean;
}

/**
 * ActionStatusTracker component - Progress tracker widget
 */
const ActionStatusTracker: React.FC<ActionStatusTrackerProps> = ({
  incidentId,
  className = '',
  showOverdueList = true,
}) => {
  const {
    stats,
    overdueActions,
    loadFollowUpActions,
    isLoading,
  } = useFollowUpActions();

  // Load actions on mount
  useEffect(() => {
    if (incidentId) {
      loadFollowUpActions(incidentId);
    }
  }, [incidentId, loadFollowUpActions]);

  // Calculate completion percentage
  const completionPercentage = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  // Get progress bar color based on completion
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'info';
    if (percentage >= 25) return 'warning';
    return 'danger';
  };

  const progressColor = getProgressColor(completionPercentage);

  return (
    <div
      className={cn(
        'action-status-tracker bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Follow-Up Actions Progress
        </h3>
        {stats.overdue > 0 && (
          <Badge variant="error" size="sm" shape="pill">
            {stats.overdue} Overdue
          </Badge>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Completion Rate
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {completionPercentage}%
          </span>
        </div>
        <Progress
          value={completionPercentage}
          variant={progressColor}
          size="md"
          showValue={false}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {stats.completed} of {stats.total} actions completed
        </p>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Pending */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Pending</span>
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {stats.pending}
          </span>
        </div>

        {/* In Progress */}
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm text-blue-700 dark:text-blue-300">In Progress</span>
          </div>
          <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
            {stats.inProgress}
          </span>
        </div>

        {/* Completed */}
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-green-700 dark:text-green-300">Completed</span>
          </div>
          <span className="text-sm font-bold text-green-900 dark:text-green-100">
            {stats.completed}
          </span>
        </div>

        {/* Cancelled */}
        {stats.cancelled > 0 && (
          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm text-red-700 dark:text-red-300">Cancelled</span>
            </div>
            <span className="text-sm font-bold text-red-900 dark:text-red-100">
              {stats.cancelled}
            </span>
          </div>
        )}
      </div>

      {/* Overdue Actions List */}
      {showOverdueList && overdueActions.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Overdue Actions ({overdueActions.length})
            </h4>
          </div>

          <div className="space-y-2">
            {overdueActions.slice(0, 3).map((alert) => (
              <div
                key={alert.action.id}
                className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Badge
                    variant={alert.severity === 'critical' ? 'error' : 'warning'}
                    size="sm"
                    shape="pill"
                  >
                    {alert.daysOverdue}d
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                    {alert.action.action}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Due: {format(new Date(alert.action.dueDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            ))}

            {overdueActions.length > 3 && (
              <button
                type="button"
                className="w-full text-xs text-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 py-2 font-medium transition-colors"
              >
                View {overdueActions.length - 3} more overdue actions
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats.total === 0 && !isLoading && (
        <div className="text-center py-6">
          <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No follow-up actions yet
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      )}

      {/* Summary Footer */}
      {stats.total > 0 && !isLoading && (
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Total Actions</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.total}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
            <span>Remaining</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {stats.pending + stats.inProgress}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionStatusTracker;
