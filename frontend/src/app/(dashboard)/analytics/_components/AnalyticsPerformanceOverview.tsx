/**
 * @fileoverview Analytics Performance Overview Component - Key performance indicators
 * @module app/(dashboard)/analytics/_components/AnalyticsPerformanceOverview
 * @category Analytics - Components
 */

'use client';

import React from 'react';
import { Target, Pill, Clock, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AnalyticsPerformanceOverviewProps } from './utils/analytics.types';

/**
 * Analytics Performance Overview Component
 *
 * Displays key performance indicators with color-coded cards and status badges
 *
 * @param props - Component props
 * @param props.summary - Summary statistics object containing performance metrics
 *
 * @example
 * ```tsx
 * <AnalyticsPerformanceOverview summary={summaryData} />
 * ```
 */
export const AnalyticsPerformanceOverview = React.memo(function AnalyticsPerformanceOverview({
  summary
}: AnalyticsPerformanceOverviewProps) {
  return (
    <Card>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="h-5 w-5 mr-2 text-green-600" aria-hidden="true" />
          Performance Overview
        </h3>
      </div>

      {/* Performance Metrics */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Medication Compliance */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Pill className="h-5 w-5 text-green-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-green-900">Medication Compliance</p>
                <p className="text-xs text-green-700">Above target threshold</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-900">
                {summary.medicationCompliance}%
              </p>
              <Badge variant="success" className="text-xs">
                Excellent
              </Badge>
            </div>
          </div>

          {/* Emergency Response Time */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-blue-900">Response Time</p>
                <p className="text-xs text-blue-700">Emergency incidents</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-900">
                {summary.emergencyResponseTime}min
              </p>
              <Badge variant="info" className="text-xs">
                Good
              </Badge>
            </div>
          </div>

          {/* Inventory Utilization */}
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-purple-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-purple-900">Inventory Utilization</p>
                <p className="text-xs text-purple-700">Medical supplies efficiency</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-purple-900">
                {summary.inventoryUtilization}%
              </p>
              <Badge variant="secondary" className="text-xs">
                Optimal
              </Badge>
            </div>
          </div>

          {/* Compliance Score */}
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-yellow-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Compliance Score</p>
                <p className="text-xs text-yellow-700">Regulatory adherence</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-yellow-900">
                {summary.complianceScore}%
              </p>
              <Badge variant="warning" className="text-xs">
                Monitor
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});
