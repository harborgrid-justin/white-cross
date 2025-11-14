/**
 * UserEngagementPanel Component
 *
 * Displays user engagement metrics and top active users
 */

import React from 'react';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { UserEngagement } from './ReportAnalytics.types';
import { formatDuration } from './ReportAnalytics.helpers';

interface UserEngagementPanelProps {
  userEngagement: UserEngagement[];
  expanded: boolean;
  onToggle: () => void;
}

const UserEngagementPanel: React.FC<UserEngagementPanelProps> = ({
  userEngagement,
  expanded,
  onToggle
}) => {
  // Calculate engagement metrics
  const totalActiveUsers = userEngagement.length;
  const avgReportsPerUser = totalActiveUsers > 0
    ? (userEngagement.reduce((acc, user) => acc + user.reportsViewed, 0) / totalActiveUsers).toFixed(1)
    : '0';
  const avgSessionTime = totalActiveUsers > 0
    ? formatDuration((userEngagement.reduce((acc, user) => acc + user.avgSessionTime, 0) / totalActiveUsers) * 1000)
    : '0s';
  const totalReportsCreated = userEngagement.reduce((acc, user) => acc + user.reportsCreated, 0);

  return (
    <div className="space-y-4">
      <button
        onClick={onToggle}
        className="flex items-center w-full text-left"
        aria-label="Toggle user engagement section"
      >
        {expanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
        )}
        <h2 className="text-lg font-semibold text-gray-900">User Engagement</h2>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Active Users */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Active Users</h3>
            <div className="space-y-4">
              {userEngagement.slice(0, 5).map((user) => (
                <div key={user.userId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                      <div className="text-xs text-gray-500">{user.department}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {user.reportsViewed} views
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDuration(user.avgSessionTime * 1000)} avg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Active Users</span>
                <span className="text-sm font-medium text-gray-900">
                  {totalActiveUsers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Reports per User</span>
                <span className="text-sm font-medium text-gray-900">
                  {avgReportsPerUser}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Session Time</span>
                <span className="text-sm font-medium text-gray-900">
                  {avgSessionTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reports Created</span>
                <span className="text-sm font-medium text-gray-900">
                  {totalReportsCreated}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEngagementPanel;
