/**
 * ExportHistory Component
 *
 * Displays audit trail and history with:
 * - Export activity log (created, downloaded, deleted)
 * - User information and timestamps
 * - IP address tracking
 * - HIPAA compliance badge
 * - Full audit log access
 *
 * @component ExportHistory
 */

'use client';

import React from 'react';
import { Clock, Archive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface AuditEntry {
  id: string;
  action: 'Export downloaded' | 'Export created' | 'Template modified' | 'Export deleted' | string;
  details: string;
  user: string;
  timestamp: string;
  ip: string;
}

interface ExportHistoryProps {
  entries: AuditEntry[];
  onViewFullLog?: () => void;
  isHipaaCompliant?: boolean;
}

const getActionColor = (action: string): string => {
  if (action.includes('downloaded')) return 'text-blue-600';
  if (action.includes('created')) return 'text-green-600';
  if (action.includes('modified')) return 'text-yellow-600';
  if (action.includes('deleted')) return 'text-red-600';
  return 'text-gray-600';
};

export default function ExportHistory({
  entries,
  onViewFullLog,
  isHipaaCompliant = true
}: ExportHistoryProps) {
  const handleViewFullLog = () => {
    onViewFullLog?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export History & Audit Trail</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* HIPAA Compliance Banner */}
          <div
            className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center space-x-2">
              <Archive className="h-5 w-5 text-blue-600 flex-shrink-0" aria-hidden="true" />
              <span className="font-medium text-blue-900">Audit Compliance</span>
            </div>
            {isHipaaCompliant && (
              <Badge variant="info">HIPAA Compliant</Badge>
            )}
          </div>

          {/* Audit Entries */}
          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No audit entries available</p>
              <p className="text-sm mt-1">Export activity will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => {
                const actionColor = getActionColor(entry.action);

                return (
                  <div
                    key={entry.id}
                    className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Time Icon */}
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>

                    {/* Entry Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${actionColor}`}>
                          {entry.action}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {entry.details}
                      </p>

                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                        <span>User: {entry.user}</span>
                        <span>IP: {entry.ip}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View Full Log Button */}
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleViewFullLog}
            >
              View Full Audit Log
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
