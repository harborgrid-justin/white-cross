/**
 * HealthAlertsPanel Component
 *
 * Displays health alerts and notifications with:
 * - Severity-based filtering
 * - Alert acknowledgment actions
 * - Visual severity indicators
 * - Action buttons (view, acknowledge, more options)
 *
 * @component
 */

'use client';

import React from 'react';
import { Eye, CheckCircle, MoreVertical, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { HealthAlert } from '@/lib/actions/dashboard.actions';
import type { AlertFilterType } from './useDashboardFilters';
import { getAlertIcon, getAlertColor } from './dashboard.utils';

interface HealthAlertsPanelProps {
  alerts: HealthAlert[];
  alertFilter: AlertFilterType;
  onFilterChange: (filter: AlertFilterType) => void;
  onAcknowledgeAlert?: (alertId: string) => void;
  onViewAlert?: (alertId: string) => void;
}

interface AlertItemProps {
  alert: HealthAlert;
  onAcknowledge?: (alertId: string) => void;
  onView?: (alertId: string) => void;
}

function AlertItem({ alert, onAcknowledge, onView }: AlertItemProps) {
  const AlertIcon = getAlertIcon(alert.type);

  return (
    <div
      className={`flex items-start space-x-3 p-3 rounded-lg border ${getAlertColor(alert.severity)}`}
      role="listitem"
      aria-label={`${alert.severity} severity ${alert.type} alert for ${alert.studentName}`}
    >
      <AlertIcon className="h-5 w-5 mt-0.5" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{alert.studentName}</h3>
          <div className="flex items-center space-x-2">
            <Badge variant={alert.status === 'new' ? 'error' : 'secondary'}>
              {alert.status}
            </Badge>
            <span
              className="text-xs text-gray-500"
              aria-label={`Alert time: ${new Date(alert.timestamp).toLocaleTimeString()}`}
            >
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
        <p className="text-sm mt-1">{alert.message}</p>
        <div className="flex items-center justify-between mt-2">
          <Badge variant="info" className="text-xs">
            {alert.type} • {alert.severity}
          </Badge>
          <div className="flex space-x-1" role="group" aria-label="Alert actions">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView?.(alert.id)}
              aria-label={`View details for ${alert.studentName} alert`}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAcknowledge?.(alert.id)}
              aria-label={`Mark ${alert.studentName} alert as acknowledged`}
            >
              <CheckCircle className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label={`More options for ${alert.studentName} alert`}
            >
              <MoreVertical className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HealthAlertsPanel({
  alerts,
  alertFilter,
  onFilterChange,
  onAcknowledgeAlert,
  onViewAlert,
}: HealthAlertsPanelProps) {
  // Filter alerts based on selected severity
  const filteredAlerts =
    alertFilter === 'all'
      ? alerts
      : alerts.filter((alert) => alert.severity === alertFilter);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Health Alerts & Notifications</CardTitle>
          <div className="flex items-center space-x-2">
            <Select
              value={alertFilter}
              onValueChange={(value) => onFilterChange(value as AlertFilterType)}
            >
              <SelectTrigger className="w-32" aria-label="Filter health alerts by severity">
                <SelectValue placeholder="Select alert filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" aria-label="Show filter options">
              <Filter className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3" role="list" aria-label="Health alerts">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onAcknowledge={onAcknowledgeAlert}
                onView={onViewAlert}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No {alertFilter !== 'all' ? `${alertFilter} ` : ''}alerts found</p>
            </div>
          )}
        </div>
        {alerts.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              aria-label={`View all ${alerts.length + 8} health alerts`}
            >
              View All Alerts ({alerts.length + 8} total)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
