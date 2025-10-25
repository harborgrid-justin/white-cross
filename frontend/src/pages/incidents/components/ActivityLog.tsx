/**
 * ActivityLog Component
 *
 * Real-time activity feed for incident reports showing recent actions and updates.
 * Displays chronological stream of activities with user avatars, relative timestamps,
 * and auto-refresh capability. Optimized for quick incident status monitoring.
 *
 * @module pages/incidents/components/ActivityLog
 * @version 1.0.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Activity,
  RefreshCw,
  Clock,
  User,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Zap,
} from 'lucide-react';
import { incidentsApi } from '@/services/modules/incidentsApi';
import { useApiError } from '@/hooks/shared/useApiError';
import { useHealthcareCompliance } from '@/hooks/shared/useHealthcareCompliance';
import { formatDistanceToNow, format, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Activity Item Interface
 */
export interface ActivityItem {
  id: string;
  incidentId: string;
  timestamp: string;
  userId: string;
  userName: string;
  userInitials: string;
  actionType: string;
  actionLabel: string;
  description: string;
  icon?: string;
  metadata?: Record<string, any>;
}

/**
 * Props for ActivityLog component
 */
interface ActivityLogProps {
  /** Incident ID to fetch activities for */
  incidentId: string;
  /** Optional CSS class name */
  className?: string;
  /** Maximum number of activities to display (default: 50) */
  limit?: number;
  /** Enable auto-refresh (default: false) */
  autoRefresh?: boolean;
  /** Auto-refresh interval in milliseconds (default: 30000) */
  refreshInterval?: number;
}

/**
 * Get user initials from name
 */
const getUserInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

/**
 * Get avatar color based on user ID
 */
const getAvatarColor = (userId: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
  ];
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

/**
 * Format timestamp for display
 */
const formatTimestamp = (timestamp: string): string => {
  const date = parseISO(timestamp);

  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }

  return format(date, 'MMM d at h:mm a');
};

/**
 * Group activities by date
 */
const groupActivitiesByDate = (activities: ActivityItem[]) => {
  const grouped: Record<string, ActivityItem[]> = {};

  activities.forEach((activity) => {
    const date = parseISO(activity.timestamp);
    let dateKey: string;

    if (isToday(date)) {
      dateKey = 'Today';
    } else if (isYesterday(date)) {
      dateKey = 'Yesterday';
    } else {
      dateKey = format(date, 'MMMM d, yyyy');
    }

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(activity);
  });

  return grouped;
};

/**
 * Activity Item Component
 */
const ActivityItemComponent: React.FC<{ activity: ActivityItem }> = ({
  activity,
}) => {
  const avatarColor = getAvatarColor(activity.userId);

  return (
    <div className="flex gap-3 group hover:bg-gray-50 p-3 rounded-lg transition-colors">
      {/* Avatar */}
      <div
        className={`flex-shrink-0 h-10 w-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-sm`}
      >
        {activity.userInitials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900">
              <span className="font-medium">{activity.userName}</span>{' '}
              <span className="text-gray-600">{activity.description}</span>
            </p>
            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
              <div className="mt-1 space-y-1">
                {Object.entries(activity.metadata).map(([key, value]) => (
                  <div
                    key={key}
                    className="text-xs text-gray-500 flex items-center gap-1"
                  >
                    <ChevronRight className="h-3 w-3" />
                    <span className="font-medium capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
            <Clock className="h-3 w-3" />
            {formatTimestamp(activity.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ActivityLog Component
 *
 * Displays real-time activity stream for an incident with optional auto-refresh.
 * Activities are grouped by date and support "load more" pagination.
 *
 * @component
 * @param {ActivityLogProps} props - Component props
 * @returns {React.ReactElement} Rendered activity log component
 *
 * @example
 * ```tsx
 * <ActivityLog
 *   incidentId="incident-uuid-123"
 *   limit={50}
 *   autoRefresh={true}
 *   refreshInterval={30000}
 * />
 * ```
 */
const ActivityLog: React.FC<ActivityLogProps> = ({
  incidentId,
  className = '',
  limit = 50,
  autoRefresh = false,
  refreshInterval = 30000,
}) => {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();
  const queryClient = useQueryClient();

  const [displayLimit, setDisplayLimit] = useState(limit);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch activity data
  const {
    data: activities = [],
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery<ActivityItem[]>({
    queryKey: ['incident-activity-log', incidentId, displayLimit],
    queryFn: async () => {
      try {
        // Log PHI access for compliance
        await logCompliantAccess(
          'view_incident_activity',
          'incident',
          'low',
          { incidentId }
        );

        // TODO: Replace with actual API endpoint when available
        // const response = await incidentsApi.getActivityLog(incidentId, displayLimit);
        // return response.activities;

        // Placeholder data
        return [
          {
            id: '1',
            incidentId,
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            userInitials: getUserInitials('Sarah Johnson'),
            actionType: 'comment',
            actionLabel: 'Added comment',
            description: 'added a comment',
            metadata: {
              comment_preview: 'Student is recovering well...',
            },
          },
          {
            id: '2',
            incidentId,
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            userId: 'user-2',
            userName: 'Mike Davis',
            userInitials: getUserInitials('Mike Davis'),
            actionType: 'status_change',
            actionLabel: 'Status changed',
            description: 'changed status from OPEN to INVESTIGATING',
            metadata: {
              old_status: 'OPEN',
              new_status: 'INVESTIGATING',
            },
          },
          {
            id: '3',
            incidentId,
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            userId: 'user-3',
            userName: 'Emily Roberts',
            userInitials: getUserInitials('Emily Roberts'),
            actionType: 'document_upload',
            actionLabel: 'Uploaded document',
            description: 'uploaded a document',
            metadata: {
              file_name: 'incident-photo.jpg',
              file_size: '2.4 MB',
            },
          },
          {
            id: '4',
            incidentId,
            timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            userInitials: getUserInitials('Sarah Johnson'),
            actionType: 'parent_notification',
            actionLabel: 'Parent notified',
            description: 'notified parent via phone call',
            metadata: {
              method: 'VOICE',
              contact_name: 'John Smith',
            },
          },
          {
            id: '5',
            incidentId,
            timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
            userId: 'user-2',
            userName: 'Mike Davis',
            userInitials: getUserInitials('Mike Davis'),
            actionType: 'follow_up_created',
            actionLabel: 'Follow-up created',
            description: 'created a follow-up action',
            metadata: {
              action: 'Schedule parent meeting',
              priority: 'HIGH',
            },
          },
          {
            id: '6',
            incidentId,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            userInitials: getUserInitials('Sarah Johnson'),
            actionType: 'witness_added',
            actionLabel: 'Witness added',
            description: 'added witness statement',
            metadata: {
              witness_name: 'Mrs. Anderson',
              witness_type: 'STAFF',
            },
          },
          {
            id: '7',
            incidentId,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            userId: 'user-2',
            userName: 'Mike Davis',
            userInitials: getUserInitials('Mike Davis'),
            actionType: 'severity_change',
            actionLabel: 'Severity changed',
            description: 'changed severity from MEDIUM to HIGH',
            metadata: {
              old_severity: 'MEDIUM',
              new_severity: 'HIGH',
            },
          },
          {
            id: '8',
            incidentId,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
            userId: 'user-1',
            userName: 'Sarah Johnson',
            userInitials: getUserInitials('Sarah Johnson'),
            actionType: 'created',
            actionLabel: 'Incident created',
            description: 'created this incident report',
            metadata: {
              type: 'INJURY',
              severity: 'MEDIUM',
            },
          },
        ].slice(0, displayLimit) as ActivityItem[];
      } catch (err: any) {
        throw handleApiError(err, 'fetch_incident_activity_log');
      }
    },
    staleTime: autoRefresh ? 0 : 1000 * 60 * 5, // 5 minutes if not auto-refresh
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchInterval: autoRefresh ? refreshInterval : false,
    enabled: !!incidentId,
  });

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Load more activities
  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 20);
  };

  // Group activities by date
  const groupedActivities = useMemo(() => {
    return groupActivitiesByDate(activities);
  }, [activities]);

  const hasMore = activities.length >= displayLimit;

  if (isLoading && !isRefreshing) {
    return (
      <div className={`activity-log ${className}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Log
          </h3>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`activity-log ${className}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Log
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Failed to load activities
                </h4>
                <p className="mt-1 text-sm text-red-700">
                  {error instanceof Error ? error.message : 'An error occurred'}
                </p>
                <button
                  onClick={handleRefresh}
                  className="mt-3 text-sm font-medium text-red-800 hover:text-red-900"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`activity-log ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Log
              {autoRefresh && (
                <span className="ml-2 flex items-center gap-1 text-xs font-normal text-gray-500">
                  <Zap className="h-3 w-3 text-green-500" />
                  Auto-refresh
                </span>
              )}
            </h3>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
          </div>
          {autoRefresh && (
            <p className="mt-1 text-xs text-gray-500">
              Last updated:{' '}
              {formatDistanceToNow(new Date(dataUpdatedAt), { addSuffix: true })}
            </p>
          )}
        </div>

        {/* Activity Feed */}
        {activities.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Activity className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No activity yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Activity will appear here as actions are taken on this incident.
            </p>
          </div>
        ) : (
          <div className="px-6 py-4">
            <div className="space-y-6">
              {Object.entries(groupedActivities).map(([date, dateActivities]) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      {date}
                    </h4>
                  </div>

                  {/* Activities for this date */}
                  <div className="space-y-1 ml-6 border-l-2 border-gray-200 pl-2">
                    {dateActivities.map((activity) => (
                      <ActivityItemComponent
                        key={activity.id}
                        activity={activity}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Load more activities
                </button>
              </div>
            )}

            {/* Activity Count */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Showing {activities.length} of recent activities
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
