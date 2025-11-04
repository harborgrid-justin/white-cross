/**
 * DocumentAlertsCard Component
 * Displays document alerts and notifications in the sidebar
 */

'use client';

import React from 'react';
import { AlertTriangle, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DocumentAlert } from './sidebar.types';
import { useSidebarFormatters } from './useSidebarFormatters';

interface DocumentAlertsCardProps {
  alerts: DocumentAlert[];
  onViewAllAlerts?: () => void;
  className?: string;
}

export const DocumentAlertsCard: React.FC<DocumentAlertsCardProps> = ({
  alerts,
  onViewAllAlerts,
  className = ''
}) => {
  const { formatRelativeTime, getSeverityColor } = useSidebarFormatters();

  return (
    <Card className={className}>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
          Document Alerts
        </h3>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{alert.title}</h4>
                <Badge className={getSeverityColor(alert.severity)}>
                  {alert.severity}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
              {alert.count && (
                <div className="flex items-center text-xs text-gray-500">
                  <FileText className="h-3 w-3 mr-1" />
                  {alert.count} documents
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                {formatRelativeTime(alert.timestamp)}
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3"
          onClick={onViewAllAlerts}
        >
          View All Alerts
        </Button>
      </div>
    </Card>
  );
};
