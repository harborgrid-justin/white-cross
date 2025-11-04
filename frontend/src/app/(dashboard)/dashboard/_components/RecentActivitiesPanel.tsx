/**
 * RecentActivitiesPanel Component
 *
 * Displays recent healthcare activities with:
 * - Search functionality
 * - Export capabilities
 * - Status-based styling
 * - Activity type icons
 *
 * @component
 */

'use client';

import React, { useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { RecentActivity } from '@/lib/actions/dashboard.actions';
import {
  getActivityIcon,
  getActivityStatusColor,
  getActivityBadgeVariant,
} from './dashboard.utils';

interface RecentActivitiesPanelProps {
  activities: RecentActivity[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExport?: () => void;
}

interface ActivityItemProps {
  activity: RecentActivity;
}

function ActivityItem({ activity }: ActivityItemProps) {
  const ActivityIcon = getActivityIcon(activity.type);
  const { bgColor, textColor } = getActivityStatusColor(activity.status);

  return (
    <div
      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
      role="listitem"
      aria-label={`${activity.status} activity: ${activity.description} for ${activity.studentAffected || 'System'}`}
    >
      <div className={`p-2 rounded-full ${bgColor}`} aria-hidden="true">
        <ActivityIcon className={`h-4 w-4 ${textColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">
            {activity.studentAffected || 'System'}
          </h3>
          <span
            className="text-xs text-gray-500"
            aria-label={`Activity time: ${new Date(activity.timestamp).toLocaleTimeString()}`}
          >
            {new Date(activity.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">By {activity.performedBy}</span>
          <Badge variant={getActivityBadgeVariant(activity.status)}>
            {activity.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export function RecentActivitiesPanel({
  activities,
  searchQuery,
  onSearchChange,
  onExport,
}: RecentActivitiesPanelProps) {
  // Filter activities based on search query
  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) {
      return activities;
    }

    const query = searchQuery.toLowerCase();
    return activities.filter(
      (activity) =>
        activity.description.toLowerCase().includes(query) ||
        activity.studentAffected?.toLowerCase().includes(query) ||
        activity.performedBy.toLowerCase().includes(query) ||
        activity.type.toLowerCase().includes(query)
    );
  }, [activities, searchQuery]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Healthcare Activities</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search
                className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 w-64"
                aria-label="Search recent activities"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              aria-label="Export activities to file"
            >
              <Download className="h-4 w-4 mr-2" aria-hidden="true" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3" role="list" aria-label="Recent healthcare activities">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>
                {searchQuery.trim()
                  ? `No activities found matching "${searchQuery}"`
                  : 'No recent activities'}
              </p>
            </div>
          )}
        </div>
        {activities.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full" aria-label="View all recent activities">
              View All Activities
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
