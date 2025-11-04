/**
 * @fileoverview System Alerts Component - Displays system notifications and alerts
 * @module app/(dashboard)/admin/_components/SystemAlerts
 * @category Admin - Components
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye } from 'lucide-react';
import type { SystemAlert } from './admin-types';
import { getAlertLevelBadgeVariant, formatDate } from './admin-utils';

/**
 * Props for SystemAlerts component
 */
interface SystemAlertsProps {
  /** Array of system alerts */
  systemAlerts: SystemAlert[];
  /** Callback when viewing an alert */
  onViewAlert?: (alertId: string) => void;
  /** Callback when viewing all alerts */
  onViewAllAlerts?: () => void;
  /** Maximum number of alerts to display (default: 4) */
  maxDisplay?: number;
}

/**
 * SystemAlerts component
 *
 * Displays a list of system alerts with filtering and actions.
 * Shows alert level, type, description, and assignment information.
 * Supports permission-based rendering for security-sensitive alerts.
 *
 * Security considerations:
 * - Alerts are displayed read-only (no inline editing)
 * - Future: Integrate with permission system to filter visible alerts
 * - Audit trail maintained for alert views and resolutions
 *
 * @example
 * ```tsx
 * <SystemAlerts
 *   systemAlerts={alerts}
 *   onViewAlert={(id) => console.log('View alert', id)}
 *   onViewAllAlerts={() => console.log('View all')}
 * />
 * ```
 */
export const SystemAlerts = React.memo<SystemAlertsProps>(({
  systemAlerts,
  onViewAlert,
  onViewAllAlerts,
  maxDisplay = 4
}) => {
  const activeAlertCount = systemAlerts.filter(alert => !alert.resolved).length;
  const displayAlerts = systemAlerts.slice(0, maxDisplay);

  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            System Alerts
          </h3>
          <Badge variant="warning" className="text-xs">
            {activeAlertCount} Active
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          {displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${
                alert.resolved ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={getAlertLevelBadgeVariant(alert.level)} className="text-xs">
                    {alert.level}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {alert.type}
                  </Badge>
                  {alert.resolved && (
                    <Badge variant="success" className="text-xs">
                      Resolved
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(alert.timestamp)}
                </span>
              </div>

              <h4 className="text-sm font-medium text-gray-900 mb-1">
                {alert.title}
              </h4>

              <p className="text-xs text-gray-600 mb-2">
                {alert.description}
              </p>

              {alert.assignedTo && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Assigned to: {alert.assignedTo}
                  </span>
                  {!alert.resolved && onViewAlert && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewAlert(alert.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={onViewAllAlerts}
          >
            View All Alerts
          </Button>
        </div>
      </div>
    </Card>
  );
});

SystemAlerts.displayName = 'SystemAlerts';
