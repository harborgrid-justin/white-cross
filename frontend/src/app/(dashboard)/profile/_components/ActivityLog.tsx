/**
 * @fileoverview Activity log component for recent user activities
 * @module app/(dashboard)/profile/_components/ActivityLog
 * @category Profile - Components
 */

'use client';

import { Activity } from 'lucide-react';
import { useState } from 'react';
import type { UserProfile } from '@/lib/actions/profile.actions';

interface ActivityLogProps {
  profile: UserProfile;
  onExport?: () => void;
  onViewAll?: () => void;
}

type TimeFilter = '7' | '30' | '90';

/**
 * Activity log component
 * Displays recent user activities with filtering and export options
 *
 * @component
 * @example
 * ```tsx
 * <ActivityLog
 *   profile={userProfile}
 *   onExport={handleExport}
 *   onViewAll={handleViewAll}
 * />
 * ```
 */
export function ActivityLog({ profile, onExport, onViewAll }: ActivityLogProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('7');

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter activities based on selected time period
  const filteredActivities = profile.recentActivity.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    const daysAgo = parseInt(timeFilter);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    return activityDate >= cutoffDate;
  });

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="flex gap-2">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            className="px-3 py-1 border border-gray-300 rounded text-sm bg-white"
            aria-label="Time filter for activities"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          {onExport && (
            <button
              onClick={onExport}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
            >
              Export
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No activities in the selected time period</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.resource}</div>
                  <div className="text-xs text-gray-500">{activity.device}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm">{formatDateTime(activity.timestamp)}</div>
                <div className="text-xs text-gray-500">IP: {activity.ipAddress}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredActivities.length > 0 && onViewAll && (
        <div className="mt-4 text-center">
          <button
            onClick={onViewAll}
            className="px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
}
