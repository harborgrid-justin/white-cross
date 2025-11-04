'use client';

/**
 * Recent Activity component for Forms Sidebar
 * Displays recent form-related activities with user information
 */

import React from 'react';
import {
  Clock,
  Plus,
  Play,
  Eye,
  Users,
  Archive,
  FileText,
  Activity as ActivityIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { RecentActivity, ActivityType } from './sidebar.types';
import { getActivityTypeLabel, formatTimeAgo } from './sidebar.utils';

interface SidebarActivityProps {
  activities: RecentActivity[];
  isExpanded: boolean;
  onToggle: () => void;
  maxVisible?: number;
}

/**
 * Get the appropriate icon component for an activity type
 */
function getActivityIcon(type: ActivityType): React.ReactNode {
  const iconClass = 'h-4 w-4';

  switch (type) {
    case 'form_created':
      return <Plus className={`${iconClass} text-blue-500`} />;
    case 'form_published':
      return <Play className={`${iconClass} text-green-500`} />;
    case 'response_received':
      return <Eye className={`${iconClass} text-purple-500`} />;
    case 'form_shared':
      return <Users className={`${iconClass} text-indigo-500`} />;
    case 'form_archived':
      return <Archive className={`${iconClass} text-gray-500`} />;
    default:
      return <FileText className={`${iconClass} text-gray-500`} />;
  }
}

export function SidebarActivity({
  activities,
  isExpanded,
  onToggle,
  maxVisible = 5,
}: SidebarActivityProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3 hover:text-gray-700"
        aria-expanded={isExpanded}
        aria-controls="sidebar-activity"
      >
        <span>Recent Activity</span>
        <Clock className="h-4 w-4" />
      </button>

      {isExpanded && (
        <div id="sidebar-activity" className="space-y-3">
          {activities.slice(0, maxVisible).map((activity) => (
            <div
              key={activity.id}
              className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-900">
                      {getActivityTypeLabel(activity.type)}
                    </span>
                    <Badge className="bg-gray-100 text-gray-600 text-xs">
                      {activity.user.role}
                    </Badge>
                  </div>

                  <a
                    href={`/forms/${activity.formId}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium line-clamp-1"
                  >
                    {activity.formTitle}
                  </a>

                  {activity.details && (
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {activity.details}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      by {activity.user.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <a href="/forms/activity">
            <Button variant="outline" size="sm" className="w-full">
              <ActivityIcon className="h-4 w-4 mr-2" />
              View All Activity
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
