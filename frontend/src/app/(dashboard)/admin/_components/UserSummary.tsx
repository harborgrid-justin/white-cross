/**
 * @fileoverview User Summary Component - Displays user role statistics and trends
 * @module app/(dashboard)/admin/_components/UserSummary
 * @category Admin - Components
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import type { UserSummary as UserSummaryType } from './admin-types';
import { getTrendIcon, getTrendColor } from './admin-utils';

/**
 * Props for UserSummary component
 */
interface UserSummaryProps {
  /** Array of user role summaries */
  userSummary: UserSummaryType[];
  /** Callback when managing users */
  onManageUsers?: () => void;
}

/**
 * UserSummary component
 *
 * Displays statistics for different user roles including:
 * - Total count per role
 * - Active user count
 * - Trend indicators (up/down/stable)
 * - Change amount
 *
 * @example
 * ```tsx
 * <UserSummary
 *   userSummary={userSummary}
 *   onManageUsers={() => console.log('Manage users')}
 * />
 * ```
 */
export const UserSummary = React.memo<UserSummaryProps>(({
  userSummary,
  onManageUsers
}) => {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          User Summary
        </h3>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {userSummary.map((summary) => {
            const TrendIcon = getTrendIcon(summary.trend);
            return (
              <div
                key={summary.role}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {summary.role}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {summary.active} active of {summary.count} total
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {summary.count}
                    </p>
                    {summary.change !== 0 && (
                      <div className={`flex items-center gap-1 ${getTrendColor(summary.trend)}`}>
                        <TrendIcon className="h-3 w-3" />
                        <span className="text-xs font-medium">
                          {Math.abs(summary.change)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={onManageUsers}
          >
            Manage Users
          </Button>
        </div>
      </div>
    </Card>
  );
});

UserSummary.displayName = 'UserSummary';
