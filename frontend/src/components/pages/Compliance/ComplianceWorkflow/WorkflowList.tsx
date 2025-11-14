/**
 * WorkflowList component - Displays workflows in a table/list view
 * Extracted from ComplianceWorkflow.tsx for better component organization
 */

'use client'

import React from 'react'
import { Play, Pause } from 'lucide-react'
import type { ComplianceWorkflow } from './types'
import { getStatusColor, getPriorityColor, getTriggerIcon } from './utils'

/**
 * Props for the WorkflowList component
 */
export interface WorkflowListProps {
  /** Array of workflows to display */
  workflows: ComplianceWorkflow[]
  /** Callback when a workflow is selected */
  onWorkflowSelect?: (workflow: ComplianceWorkflow) => void
  /** Callback when starting a workflow */
  onStartWorkflow?: (workflowId: string) => void
  /** Callback when pausing a workflow */
  onPauseWorkflow?: (workflowId: string) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * WorkflowList - Displays workflows in a table format
 *
 * Features:
 * - Sortable columns
 * - Status and priority badges
 * - Progress indicators
 * - Action buttons inline
 * - Keyboard navigation support
 *
 * @param props - Component props
 * @returns JSX element
 */
export function WorkflowList({
  workflows,
  onWorkflowSelect,
  onStartWorkflow,
  onPauseWorkflow,
  className = ''
}: WorkflowListProps): React.ReactElement {
  const handleRowClick = (workflow: ComplianceWorkflow): void => {
    onWorkflowSelect?.(workflow)
  }

  const handleRowKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    workflow: ComplianceWorkflow
  ): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onWorkflowSelect?.(workflow)
    }
  }

  const handleStartClick = (e: React.MouseEvent<HTMLButtonElement>, workflowId: string): void => {
    e.stopPropagation()
    onStartWorkflow?.(workflowId)
  }

  const handlePauseClick = (e: React.MouseEvent<HTMLButtonElement>, workflowId: string): void => {
    e.stopPropagation()
    onPauseWorkflow?.(workflowId)
  }

  const handleViewClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    workflow: ComplianceWorkflow
  ): void => {
    e.stopPropagation()
    onWorkflowSelect?.(workflow)
  }

  return (
    <div className={`bg-white rounded-lg border overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Workflow
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trigger
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Run
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workflows.map((workflow) => (
              <tr
                key={workflow.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(workflow)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleRowKeyDown(e, workflow)}
                aria-label={`View details for ${workflow.name}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {workflow.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      workflow.status
                    )}`}
                  >
                    {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                      workflow.priority
                    )}`}
                  >
                    {workflow.priority.charAt(0).toUpperCase() + workflow.priority.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTriggerIcon(workflow.trigger)}
                    <span className="ml-2 text-sm text-gray-900 capitalize">
                      {workflow.trigger}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${workflow.completionRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {workflow.completionRate.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {workflow.lastRun ? new Date(workflow.lastRun).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {workflow.status === 'draft' || workflow.status === 'paused' ? (
                      <button
                        onClick={(e) => handleStartClick(e, workflow.id)}
                        className="text-green-600 hover:text-green-900"
                        aria-label={`Start ${workflow.name}`}
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    ) : workflow.status === 'active' ? (
                      <button
                        onClick={(e) => handlePauseClick(e, workflow.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                        aria-label={`Pause ${workflow.name}`}
                      >
                        <Pause className="h-4 w-4" />
                      </button>
                    ) : null}
                    <button
                      onClick={(e) => handleViewClick(e, workflow)}
                      className="text-blue-600 hover:text-blue-900"
                      aria-label={`View ${workflow.name}`}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
