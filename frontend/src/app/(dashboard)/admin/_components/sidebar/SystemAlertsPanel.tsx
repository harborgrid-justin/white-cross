/**
 * @fileoverview System Alerts Panel - Display system alerts and warnings
 * @module app/(dashboard)/admin/_components/sidebar/SystemAlertsPanel
 * @category Admin - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { SystemAlert } from './types';
import {
  getAlertBackgroundColor,
  getAlertTextColor,
  getAlertIconColor
} from './utils';

interface SystemAlertsPanelProps {
  alerts: SystemAlert[];
  isExpanded: boolean;
  onToggle: () => void;
  onViewAll?: () => void;
  className?: string;
}

/**
 * System Alerts Panel Component
 *
 * Displays critical system alerts and warnings:
 * - Error alerts (red)
 * - Warning alerts (yellow)
 * - Info alerts (blue)
 *
 * Features:
 * - Color-coded alert types
 * - Alert count badge
 * - View all alerts action
 * - Expandable/collapsible section
 *
 * @param alerts - Array of system alerts to display
 * @param isExpanded - Whether the section is expanded
 * @param onToggle - Handler for section toggle
 * @param onViewAll - Optional handler for viewing all alerts
 */
export function SystemAlertsPanel({
  alerts,
  isExpanded,
  onToggle,
  onViewAll,
  className = '',
}: SystemAlertsPanelProps) {
  const alertCount = alerts.length;
  const hasWarnings = alerts.some(alert => alert.type === 'warning');
  const hasErrors = alerts.some(alert => alert.type === 'error');

  const getBadgeVariant = (): "error" | "warning" | "info" => {
    if (hasErrors) return 'error';
    if (hasWarnings) return 'warning';
    return 'info';
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      console.log('View all alerts');
    }
  };

  return (
    <Card className={className}>
      <div
        className="px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between"
        onClick={onToggle}
      >
        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
          System Alerts
        </h3>
        {alertCount > 0 && (
          <Badge variant={getBadgeVariant()} className="text-xs">
            {alertCount}
          </Badge>
        )}
      </div>

      {isExpanded && (
        <div className="p-4">
          {alerts.length > 0 ? (
            <>
              <div className="space-y-3">
                {alerts.map((alert) => {
                  const Icon = alert.icon;
                  const bgColor = getAlertBackgroundColor(alert.type);
                  const textColor = getAlertTextColor(alert.type);
                  const iconColor = getAlertIconColor(alert.type);

                  return (
                    <div
                      key={alert.id}
                      className={`flex items-center gap-3 p-2 ${bgColor} rounded-lg`}
                      role="alert"
                    >
                      <Icon className={`h-4 w-4 ${iconColor}`} aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${textColor}`}>
                          {alert.title}
                        </p>
                        <p className={`text-xs ${textColor.replace('-900', '-700')}`}>
                          {alert.description}
                        </p>
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
                  View All Alerts
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-gray-500">No active alerts</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
