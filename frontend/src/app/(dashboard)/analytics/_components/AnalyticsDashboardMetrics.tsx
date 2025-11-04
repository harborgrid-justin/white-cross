/**
 * @fileoverview Analytics Dashboard Metrics Component - Summary statistics cards
 * @module app/(dashboard)/analytics/_components/AnalyticsDashboardMetrics
 * @category Analytics - Components
 */

'use client';

import React from 'react';
import { Users, AlertTriangle, Heart, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatNumber } from './utils/analytics.helpers';
import type { AnalyticsDashboardMetricsProps } from './utils/analytics.types';

/**
 * Analytics Dashboard Metrics Component
 *
 * Displays high-level summary statistics in a responsive grid of metric cards
 *
 * @param props - Component props
 * @param props.summary - Summary statistics object containing all dashboard metrics
 *
 * @example
 * ```tsx
 * <AnalyticsDashboardMetrics summary={summaryData} />
 * ```
 */
export const AnalyticsDashboardMetrics = React.memo(function AnalyticsDashboardMetrics({
  summary
}: AnalyticsDashboardMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Students Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(summary.totalStudents)}
              </p>
              <p className="text-xs text-gray-500">Enrolled students</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Incidents Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Incidents</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.activeIncidents}
              </p>
              <p className="text-xs text-gray-500">Requiring attention</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Health Screenings Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Heart className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Health Screenings</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(summary.healthScreenings)}
              </p>
              <p className="text-xs text-gray-500">This academic year</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Reports Generated Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" aria-hidden="true" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reports Generated</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.reportGenerated}
              </p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});
