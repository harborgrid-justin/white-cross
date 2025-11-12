/**
 * WorkflowStats component - Displays workflow statistics dashboard
 * Extracted from ComplianceWorkflow.tsx for better component organization
 */

'use client'

import React from 'react'
import { GitBranch, Play, Target, Clock } from 'lucide-react'
import type { WorkflowStats } from './types'
import { formatExecutionTime } from './utils'

/**
 * Props for the WorkflowStats component
 */
export interface WorkflowStatsProps {
  /** Workflow statistics data */
  stats: WorkflowStats
  /** Additional CSS classes */
  className?: string
}

/**
 * WorkflowStats - Displays key workflow metrics in a dashboard grid
 *
 * Features:
 * - Total workflow count
 * - Active workflows count
 * - Average completion rate
 * - Average execution duration
 *
 * @param props - Component props
 * @returns JSX element
 */
export function WorkflowStats({ stats, className = '' }: WorkflowStatsProps): React.ReactElement {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Workflows</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <GitBranch className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <Play className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Completion</p>
            <p className="text-2xl font-bold text-blue-600">{stats.avgCompletionRate.toFixed(1)}%</p>
          </div>
          <Target className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Duration</p>
            <p className="text-2xl font-bold text-purple-600">{formatExecutionTime(stats.avgExecutionTime)}</p>
          </div>
          <Clock className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  )
}
