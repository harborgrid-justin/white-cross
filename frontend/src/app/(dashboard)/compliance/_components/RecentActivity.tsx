/**
 * @fileoverview Recent Activity Component - Display recent compliance activities
 * @module app/(dashboard)/compliance/_components/RecentActivity
 * @category Compliance - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Activity, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import type { RecentActivityProps, ComplianceActivity } from './compliance.types';

// Mock activity data - will be replaced with actual data from API
const mockActivities: ComplianceActivity[] = [
  {
    id: '1',
    type: 'audit_completed',
    title: 'HIPAA Privacy Rule audit completed',
    description: 'Annual privacy audit completed successfully',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    user: 'Sarah Johnson',
    status: 'COMPLIANT'
  },
  {
    id: '2',
    type: 'under_review',
    title: 'Emergency Response Protocols under review',
    description: 'Quarterly review in progress',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    user: 'James Wilson',
    status: 'UNDER_REVIEW'
  },
  {
    id: '3',
    type: 'needs_attention',
    title: 'FERPA compliance needs attention',
    description: 'Student records access control update required',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    user: 'Michael Chen',
    status: 'NEEDS_ATTENTION'
  },
  {
    id: '4',
    type: 'policy_updated',
    title: 'Data Breach Response Plan updated',
    description: 'Policy version 2.1 published',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    user: 'Lisa Thompson',
  }
];

/**
 * Gets icon and style for activity type
 */
function getActivityDisplay(type: ComplianceActivity['type']) {
  switch (type) {
    case 'audit_completed':
      return {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600'
      };
    case 'under_review':
      return {
        icon: Clock,
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600'
      };
    case 'needs_attention':
      return {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-50',
        iconColor: 'text-yellow-600'
      };
    case 'policy_updated':
      return {
        icon: FileText,
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600'
      };
    default:
      return {
        icon: Activity,
        bgColor: 'bg-gray-50',
        iconColor: 'text-gray-600'
      };
  }
}

/**
 * Formats timestamp to relative time
 */
function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const activityTime = new Date(timestamp).getTime();
  const diffMs = now - activityTime;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
}

/**
 * Recent activity component
 * Displays recent compliance-related activities and updates
 *
 * @param activities - Optional array of activities (uses mock data if not provided)
 * @param limit - Optional limit on number of activities to display (default: 5)
 */
export function RecentActivity({ activities = mockActivities, limit = 5 }: RecentActivityProps) {
  const displayActivities = activities.slice(0, limit);

  if (displayActivities.length === 0) {
    return (
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-600" aria-hidden="true" />
            Recent Activity
          </h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 text-center py-4">
            No recent activity to display
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-600" aria-hidden="true" />
          Recent Activity
        </h3>
      </div>

      {/* Activity List */}
      <div className="p-6">
        <div className="space-y-3" role="list" aria-label="Recent compliance activities">
          {displayActivities.map((activity) => {
            const { icon: Icon, bgColor, iconColor } = getActivityDisplay(activity.type);

            return (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-3 ${bgColor} rounded-lg`}
                role="listitem"
              >
                <Icon
                  className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    <time dateTime={activity.timestamp}>
                      {formatRelativeTime(activity.timestamp)}
                    </time>
                    {' • '}
                    {activity.user}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
