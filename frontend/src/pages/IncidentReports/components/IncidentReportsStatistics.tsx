/**
 * WF-COMP-199 | IncidentReportsStatistics.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Incident Reports Statistics Component
 *
 * Displays statistical summary cards for incident reports
 *
 * @module components/IncidentReportsStatistics
 */

import React from 'react';
import { FileText, Bell, Clock, AlertTriangle } from 'lucide-react';
import type { ReportStatistics } from '../../../types/incidents';

interface IncidentReportsStatisticsProps {
  statistics: ReportStatistics;
}

/**
 * Statistics cards component for incident reports
 */
export default function IncidentReportsStatistics({
  statistics,
}: IncidentReportsStatisticsProps) {
  if (statistics.total === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Reports</p>
            <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
          </div>
          <FileText className="h-8 w-8 text-blue-500" />
        </div>
      </div>
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Parent Notified</p>
            <p className="text-2xl font-bold text-gray-900">
              {statistics.parentNotificationRate.toFixed(0)}%
            </p>
          </div>
          <Bell className="h-8 w-8 text-green-500" />
        </div>
      </div>
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Follow-up Required</p>
            <p className="text-2xl font-bold text-gray-900">
              {statistics.followUpRate.toFixed(0)}%
            </p>
          </div>
          <Clock className="h-8 w-8 text-orange-500" />
        </div>
      </div>
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Critical Incidents</p>
            <p className="text-2xl font-bold text-gray-900">
              {(statistics.bySeverity.CRITICAL || 0) + (statistics.bySeverity.HIGH || 0)}
            </p>
          </div>
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
      </div>
    </div>
  );
}
