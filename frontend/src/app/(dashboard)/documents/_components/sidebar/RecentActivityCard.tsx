/**
 * RecentActivityCard Component
 * Displays recent document activity feed in the sidebar
 */

'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DocumentActivity } from './sidebar.types';
import { useSidebarFormatters } from './useSidebarFormatters';

interface RecentActivityCardProps {
  activities: DocumentActivity[];
  onViewActivityLog?: () => void;
  className?: string;
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activities,
  onViewActivityLog,
  className = ''
}) => {
  const { formatRelativeTime, getActivityIcon } = useSidebarFormatters();

  return (
    <Card className={className}>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-600" />
          Recent Activity
        </h3>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {activities.map((activity) => {
            const ActivityIcon = getActivityIcon(activity.type);

            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0"
              >
                <div
                  className={`p-1.5 rounded-full ${
                    activity.type === 'uploaded'
                      ? 'bg-blue-100'
                      : activity.type === 'downloaded'
                        ? 'bg-green-100'
                        : activity.type === 'shared'
                          ? 'bg-purple-100'
                          : activity.type === 'modified'
                            ? 'bg-orange-100'
                            : activity.type === 'reviewed'
                              ? 'bg-yellow-100'
                              : 'bg-gray-100'
                  }`}
                >
                  <ActivityIcon
                    className={`h-3 w-3 ${
                      activity.type === 'uploaded'
                        ? 'text-blue-600'
                        : activity.type === 'downloaded'
                          ? 'text-green-600'
                          : activity.type === 'shared'
                            ? 'text-purple-600'
                            : activity.type === 'modified'
                              ? 'text-orange-600'
                              : activity.type === 'reviewed'
                                ? 'text-yellow-600'
                                : 'text-gray-600'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.documentTitle}
                    </p>
                  </div>
                  {activity.studentName && (
                    <p className="text-xs text-gray-600 mb-1">
                      Student: {activity.studentName}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mb-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      by {activity.user}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3"
          onClick={onViewActivityLog}
        >
          View Activity Log
        </Button>
      </div>
    </Card>
  );
};
