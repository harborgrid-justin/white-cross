/**
 * ActivityFeedWidget Component - Recent Activity Timeline
 *
 * Displays a timeline of recent user actions and system events.
 * Features user avatars, timestamps, and action types with icons.
 *
 * @module components/features/dashboard/ActivityFeedWidget
 */

import React, { useMemo } from 'react';
import {
  User,
  Calendar,
  FileText,
  AlertTriangle,
  Activity,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Activity types for categorization and icon display
 * @typedef {'appointment' | 'record' | 'incident' | 'medication' | 'success' | 'error' | 'other'} ActivityType
 */
export type ActivityType =
  | 'appointment'
  | 'record'
  | 'incident'
  | 'medication'
  | 'success'
  | 'error'
  | 'other';

/**
 * Activity item data structure
 * @interface ActivityItem
 * @property {string} id - Unique identifier
 * @property {ActivityType} type - Activity category affecting icon and color
 * @property {string} user - Username who performed the action
 * @property {string} [userAvatar] - URL to user's avatar image
 * @property {string} action - Action description
 * @property {string} [description] - Additional details
 * @property {Date | string} timestamp - When activity occurred
 * @property {Record<string, any>} [metadata] - Additional metadata
 */
export interface ActivityItem {
  id: string;
  type: ActivityType;
  user: string;
  userAvatar?: string;
  action: string;
  description?: string;
  timestamp: Date | string;
  metadata?: Record<string, any>;
}

/**
 * Props for ActivityFeedWidget component
 * @interface ActivityFeedWidgetProps
 * @property {ActivityItem[]} activities - Array of activity items
 * @property {boolean} [loading=false] - Show loading state
 * @property {boolean} [darkMode=false] - Enable dark theme
 * @property {string} [className=''] - Additional CSS classes
 * @property {number} [maxItems=10] - Maximum activities to display
 * @property {boolean} [showViewAll=true] - Show "View All" button
 * @property {() => void} [onViewAll] - Callback for "View All"
 * @property {string} [emptyMessage='No recent activity'] - Message when no activities
 */
export interface ActivityFeedWidgetProps {
  activities: ActivityItem[];
  loading?: boolean;
  darkMode?: boolean;
  className?: string;
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  emptyMessage?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

const getActivityIcon = (type: ActivityType) => {
  const iconProps = { className: 'w-4 h-4' };

  switch (type) {
    case 'appointment':
      return <Calendar {...iconProps} />;
    case 'record':
      return <FileText {...iconProps} />;
    case 'incident':
      return <AlertTriangle {...iconProps} />;
    case 'medication':
      return <Activity {...iconProps} />;
    case 'success':
      return <CheckCircle {...iconProps} />;
    case 'error':
      return <XCircle {...iconProps} />;
    default:
      return <User {...iconProps} />;
  }
};

const getActivityColor = (type: ActivityType, darkMode: boolean) => {
  const colors = {
    appointment: {
      bg: darkMode ? 'bg-green-900/20' : 'bg-green-100',
      text: darkMode ? 'text-green-400' : 'text-green-600',
      border: darkMode ? 'border-green-700' : 'border-green-200'
    },
    record: {
      bg: darkMode ? 'bg-blue-900/20' : 'bg-blue-100',
      text: darkMode ? 'text-blue-400' : 'text-blue-600',
      border: darkMode ? 'border-blue-700' : 'border-blue-200'
    },
    incident: {
      bg: darkMode ? 'bg-red-900/20' : 'bg-red-100',
      text: darkMode ? 'text-red-400' : 'text-red-600',
      border: darkMode ? 'border-red-700' : 'border-red-200'
    },
    medication: {
      bg: darkMode ? 'bg-orange-900/20' : 'bg-orange-100',
      text: darkMode ? 'text-orange-400' : 'text-orange-600',
      border: darkMode ? 'border-orange-700' : 'border-orange-200'
    },
    success: {
      bg: darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100',
      text: darkMode ? 'text-emerald-400' : 'text-emerald-600',
      border: darkMode ? 'border-emerald-700' : 'border-emerald-200'
    },
    error: {
      bg: darkMode ? 'bg-rose-900/20' : 'bg-rose-100',
      text: darkMode ? 'text-rose-400' : 'text-rose-600',
      border: darkMode ? 'border-rose-700' : 'border-rose-200'
    },
    other: {
      bg: darkMode ? 'bg-gray-700' : 'bg-gray-100',
      text: darkMode ? 'text-gray-400' : 'text-gray-600',
      border: darkMode ? 'border-gray-600' : 'border-gray-200'
    }
  };

  return colors[type] || colors.other;
};

const formatTimestamp = (timestamp: Date | string): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ActivityFeedWidget Component - Recent activity timeline display
 *
 * Displays a chronological feed of user actions and system events with
 * type-based icons, colors, and relative timestamps. Useful for audit trails
 * and user activity monitoring.
 *
 * @component
 * @param {ActivityFeedWidgetProps} props - Component props
 * @returns {React.ReactElement} Rendered activity feed widget
 *
 * @example
 * ```tsx
 * <ActivityFeedWidget
 *   activities={[
 *     {
 *       id: '1',
 *       type: 'appointment',
 *       user: 'Nurse Smith',
 *       action: 'scheduled an appointment',
 *       description: 'Physical exam for John Doe',
 *       timestamp: new Date()
 *     }
 *   ]}
 *   maxItems={5}
 *   onViewAll={() => navigate('/activity')}
 * />
 * ```
 */
export const ActivityFeedWidget = React.memo<ActivityFeedWidgetProps>(({
  activities,
  loading = false,
  darkMode = false,
  className = '',
  maxItems = 10,
  showViewAll = true,
  onViewAll,
  emptyMessage = 'No recent activity'
}) => {
  // Limit displayed activities
  const displayedActivities = useMemo(
    () => activities.slice(0, maxItems),
    [activities, maxItems]
  );

  // Theme classes
  const themeClasses = useMemo(() => ({
    container: darkMode
      ? 'bg-gray-800 border-gray-700 text-gray-200'
      : 'bg-white border-gray-200 text-gray-900',
    subtitle: darkMode ? 'text-gray-400' : 'text-gray-600',
    divider: darkMode ? 'border-gray-700' : 'border-gray-200',
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
  }), [darkMode]);

  return (
    <div
      className={`rounded-lg border shadow-sm ${themeClasses.container} ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <p className={`text-sm mt-1 ${themeClasses.subtitle}`}>
          Latest actions and events
        </p>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {loading && (
          <div className="p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        )}

        {!loading && displayedActivities.length === 0 && (
          <div className="p-8 text-center">
            <Clock className={`w-12 h-12 mx-auto mb-3 ${themeClasses.subtitle}`} />
            <p className={themeClasses.subtitle}>{emptyMessage}</p>
          </div>
        )}

        {!loading && displayedActivities.map((activity) => {
          const colors = getActivityColor(activity.type, darkMode);
          const icon = getActivityIcon(activity.type);

          return (
            <div
              key={activity.id}
              className={`px-6 py-4 transition-colors ${themeClasses.hover}`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${colors.bg} ${colors.text} ${colors.border}`}
                >
                  {activity.userAvatar ? (
                    <img
                      src={activity.userAvatar}
                      alt={activity.user}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    icon
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    <span className={colors.text}>{activity.user}</span>
                    {' '}
                    {activity.action}
                  </p>
                  {activity.description && (
                    <p className={`text-sm mt-1 ${themeClasses.subtitle}`}>
                      {activity.description}
                    </p>
                  )}
                  <p className={`text-xs mt-1 ${themeClasses.subtitle}`}>
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Footer */}
      {showViewAll && onViewAll && activities.length > maxItems && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onViewAll}
            className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            View all {activities.length} activities
          </button>
        </div>
      )}
    </div>
  );
});

ActivityFeedWidget.displayName = 'ActivityFeedWidget';

export default ActivityFeedWidget;
