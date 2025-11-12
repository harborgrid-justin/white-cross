/**
 * Report Metrics Dashboard Component
 *
 * Displays key metrics about reports in card format
 */

import React from 'react'
import { FileText, Calendar, CheckCircle2, RefreshCw } from 'lucide-react'
import type { ReportStats } from '../../hooks/useReportStats'

export interface ReportMetricsProps {
  /** Report statistics */
  stats: ReportStats
}

/**
 * Report metrics dashboard component
 *
 * Shows overview statistics including total reports, scheduled reports,
 * completed reports, and reports in progress.
 *
 * @param props - Component props
 * @returns JSX element
 */
export function ReportMetrics({ stats }: ReportMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Reports</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Scheduled</p>
            <p className="text-2xl font-bold text-purple-600">{stats.scheduled}</p>
          </div>
          <Calendar className="h-8 w-8 text-purple-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{stats.generating}</p>
          </div>
          <RefreshCw className="h-8 w-8 text-blue-600" />
        </div>
      </div>
    </div>
  )
}
