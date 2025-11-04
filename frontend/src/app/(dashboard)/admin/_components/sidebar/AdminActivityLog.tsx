/**
 * @fileoverview Admin Activity Log - Recent admin actions display
 * @module app/(dashboard)/admin/_components/sidebar/AdminActivityLog
 * @category Admin - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { ActivityLogEntry } from './types';
import {
  getActivityBackgroundColor,
  getActivityTextColor,
  getActivityIconColor
} from './utils';

interface AdminActivityLogProps {
  activities: ActivityLogEntry[];
  onViewAll?: () => void;
  className?: string;
}

/**
 * Admin Activity Log Component
 *
 * Displays recent administrative actions and system events:
 * - User management actions
 * - System configuration changes
 * - Database operations
 * - Security events
 *
 * Features:
 * - Color-coded activity types
 * - Chronological display
 * - View full activity log
 *
 * @param activities - Array of activity log entries
 * @param onViewAll - Optional handler for viewing full log
 */
export function AdminActivityLog({
  activities,
  onViewAll,
  className = '',
}: AdminActivityLogProps) {
  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      console.log('View activity log');
    }
  };

  return (
    <Card className={className}>
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
          <Clock className="h-4 w-4 mr-2 text-orange-600" />
          Recent Activity
        </h3>
      </div>

      <div className="p-4">
        {activities.length > 0 ? (
          <>
            <div className="space-y-3">
              {activities.map((activity) => {
                const Icon = activity.icon;
                const bgColor = getActivityBackgroundColor(activity.type);
                const textColor = getActivityTextColor(activity.type);
                const iconColor = getActivityIconColor(activity.type);

                return (
                  <div
                    key={activity.id}
                    className={`flex items-center gap-3 p-2 ${bgColor} rounded-lg`}
                    role="log"
                  >
                    <Icon className={`h-4 w-4 ${iconColor}`} aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${textColor}`}>
                        {activity.title}
                      </p>
                      <p className={`text-xs ${textColor.replace('-900', '-700')}`}>
                        {activity.description}
                      </p>
                      {activity.timestamp && (
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.timestamp}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={handleViewAll}
              >
                View Activity Log
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </Card>
  );
}
