/**
 * @fileoverview Admin Activity Log Component - Displays audit trail of admin actions
 * @module app/(dashboard)/admin/_components/AdminActivityLog
 * @category Admin - Components
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Filter,
  Search,
  Download
} from 'lucide-react';
import type { AdminActivity } from './admin-types';
import { getStatusBadgeVariant, formatDate } from './admin-utils';

/**
 * Props for AdminActivityLog component
 */
interface AdminActivityLogProps {
  /** Array of admin activities */
  adminActivity: AdminActivity[];
  /** Callback when filtering activities */
  onFilter?: () => void;
  /** Callback when searching activities */
  onSearch?: () => void;
  /** Callback when exporting activities */
  onExport?: () => void;
  /** Callback when viewing full audit log */
  onViewAuditLog?: () => void;
}

/**
 * Gets the icon component for an activity status
 */
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'SUCCESS': return CheckCircle;
    case 'WARNING': return AlertTriangle;
    case 'ERROR': return AlertTriangle;
    case 'INFO': return Activity;
    default: return Activity;
  }
};

/**
 * Gets the background color class for an activity status
 */
const getStatusBgColor = (status: string): string => {
  switch (status) {
    case 'SUCCESS': return 'bg-green-100';
    case 'WARNING': return 'bg-yellow-100';
    case 'ERROR': return 'bg-red-100';
    case 'INFO': return 'bg-blue-100';
    default: return 'bg-gray-100';
  }
};

/**
 * Gets the icon color class for an activity status
 */
const getStatusIconColor = (status: string): string => {
  switch (status) {
    case 'SUCCESS': return 'text-green-600';
    case 'WARNING': return 'text-yellow-600';
    case 'ERROR': return 'text-red-600';
    case 'INFO': return 'text-blue-600';
    default: return 'text-gray-600';
  }
};

/**
 * AdminActivityLog component
 *
 * Displays a comprehensive audit trail of admin actions including:
 * - Action type and description
 * - User who performed the action
 * - Target of the action
 * - Timestamp and IP address
 * - Status indicator (SUCCESS, WARNING, ERROR, INFO)
 *
 * Security and audit trail considerations:
 * - Read-only display (no inline editing)
 * - Immutable audit records
 * - Full timestamp preservation (ISO 8601)
 * - IP address tracking
 * - HIPAA compliance: 7-year retention period
 *
 * @example
 * ```tsx
 * <AdminActivityLog
 *   adminActivity={activities}
 *   onFilter={() => console.log('Filter')}
 *   onSearch={() => console.log('Search')}
 *   onExport={() => console.log('Export')}
 *   onViewAuditLog={() => console.log('View full log')}
 * />
 * ```
 */
export const AdminActivityLog = React.memo<AdminActivityLogProps>(({
  adminActivity,
  onFilter,
  onSearch,
  onExport,
  onViewAuditLog
}) => {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-600" />
            Recent Admin Activity
          </h3>
          <div className="flex gap-2">
            {onFilter && (
              <Button variant="outline" size="sm" onClick={onFilter}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            )}
            {onSearch && (
              <Button variant="outline" size="sm" onClick={onSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          {adminActivity.map((activity) => {
            const StatusIcon = getStatusIcon(activity.status);
            return (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${getStatusBgColor(activity.status)}`}>
                    <StatusIcon className={`h-4 w-4 ${getStatusIconColor(activity.status)}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {activity.user} → {activity.target}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.details}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusBadgeVariant(activity.status)} className="text-xs mb-1">
                    {activity.status}
                  </Badge>
                  <p className="text-xs text-gray-500">
                    {formatDate(activity.timestamp)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {activity.ip}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {adminActivity.length} of {adminActivity.length} activities
            </p>
            <div className="flex gap-2">
              {onViewAuditLog && (
                <Button variant="outline" size="sm" onClick={onViewAuditLog}>
                  View Audit Log
                </Button>
              )}
              {onExport && (
                <Button variant="outline" size="sm" onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

AdminActivityLog.displayName = 'AdminActivityLog';
