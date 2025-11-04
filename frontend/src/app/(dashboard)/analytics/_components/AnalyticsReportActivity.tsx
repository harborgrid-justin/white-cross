/**
 * @fileoverview Analytics Report Activity Component - Recent reports list
 * @module app/(dashboard)/analytics/_components/AnalyticsReportActivity
 * @category Analytics - Components
 */

'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getTypeIcon, getStatusBadgeVariant, formatDate } from './utils/analytics.helpers';
import type { AnalyticsReportActivityProps } from './utils/analytics.types';

/**
 * Analytics Report Activity Component
 *
 * Displays a list of recent report generation activity with status, metadata, and download counts
 *
 * @param props - Component props
 * @param props.reportActivity - Array of report activity objects
 * @param props.onViewAll - Optional callback for "View All Reports" button click
 *
 * @example
 * ```tsx
 * <AnalyticsReportActivity
 *   reportActivity={reports}
 *   onViewAll={handleViewAll}
 * />
 * ```
 */
export const AnalyticsReportActivity = React.memo(function AnalyticsReportActivity({
  reportActivity,
  onViewAll
}: AnalyticsReportActivityProps) {
  return (
    <Card>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" aria-hidden="true" />
          Recent Report Activity
        </h3>
      </div>

      {/* Report List */}
      <div className="p-6">
        <div className="space-y-3">
          {reportActivity.map((report) => {
            const TypeIcon = getTypeIcon(report.type);

            return (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                {/* Report Info */}
                <div className="flex items-center gap-3">
                  <TypeIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.title}</p>
                    <p className="text-xs text-gray-600">
                      {formatDate(report.generatedAt)} • {report.generatedBy}
                    </p>
                  </div>
                </div>

                {/* Report Metadata */}
                <div className="text-right">
                  <Badge
                    variant={getStatusBadgeVariant(report.status)}
                    className="text-xs mb-1"
                  >
                    {report.status}
                  </Badge>
                  <p className="text-xs text-gray-500">
                    {report.size} • {report.downloadCount} downloads
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        {onViewAll && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={onViewAll}
              aria-label="View all reports"
            >
              View All Reports
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
});
