/**
 * WorkflowCard component - Displays a workflow in grid view
 * Extracted from ComplianceWorkflow.tsx for better component organization
 */

'use client'

import React from 'react'
import { Play, Pause, Square, MoreHorizontal } from 'lucide-react'
import type { ComplianceWorkflow } from './types'
import { getStatusColor, getPriorityColor, getTriggerIcon } from './utils'

/**
 * Props for the WorkflowCard component
 */
export interface WorkflowCardProps {
  /** Workflow data to display */
  workflow: ComplianceWorkflow
  /** Callback when the card is clicked */
  onSelect?: (workflow: ComplianceWorkflow) => void
  /** Callback when starting a workflow */
  onStart?: (workflowId: string) => void
  /** Callback when pausing a workflow */
  onPause?: (workflowId: string) => void
  /** Callback when stopping a workflow */
  onStop?: (workflowId: string) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * WorkflowCard - Displays workflow information in a card format
 *
 * Features:
 * - Workflow name and description
 * - Status and priority badges
 * - Trigger type indicator
 * - Progress bar
 * - Action buttons (start/pause/stop)
 * - Key workflow metrics
 *
 * @param props - Component props
 * @returns JSX element
 */
export function WorkflowCard({
  workflow,
  onSelect,
  onStart,
  onPause,
  onStop,
  className = ''
}: WorkflowCardProps): React.ReactElement {
  const handleCardClick = (): void => {
    onSelect?.(workflow)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.(workflow)
    }
  }

  const handleStartClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    onStart?.(workflow.id)
  }

  const handlePauseClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    onPause?.(workflow.id)
  }

  const handleStopClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    onStop?.(workflow.id)
  }

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    // Handle menu actions - can be implemented by parent component
  }

  return (
    <div
      className={`bg-white p-6 rounded-lg border hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${workflow.name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{workflow.name}</h3>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                workflow.status
              )}`}
            >
              {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                workflow.priority
              )}`}
            >
              {workflow.priority.charAt(0).toUpperCase() + workflow.priority.slice(1)}
            </span>
          </div>
        </div>
        <button
          onClick={handleMenuClick}
          className="text-gray-400 hover:text-gray-600"
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{workflow.description}</p>

      {/* Workflow Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Trigger:</span>
          <div className="flex items-center gap-1">
            {getTriggerIcon(workflow.trigger)}
            <span className="font-medium text-gray-900 capitalize">{workflow.trigger}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Steps:</span>
          <span className="font-medium text-gray-900">{workflow.steps.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Completion:</span>
          <span className="font-medium text-gray-900">{workflow.completionRate.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Last Run:</span>
          <span className="font-medium text-gray-900">
            {workflow.lastRun ? new Date(workflow.lastRun).toLocaleDateString() : 'Never'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="text-gray-900">{workflow.completionRate.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${workflow.completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {workflow.status === 'draft' || workflow.status === 'paused' ? (
            <button
              onClick={handleStartClick}
              className="text-green-600 hover:text-green-900"
              aria-label={`Start ${workflow.name}`}
            >
              <Play className="h-4 w-4" />
            </button>
          ) : workflow.status === 'active' ? (
            <button
              onClick={handlePauseClick}
              className="text-yellow-600 hover:text-yellow-900"
              aria-label={`Pause ${workflow.name}`}
            >
              <Pause className="h-4 w-4" />
            </button>
          ) : null}

          {(workflow.status === 'active' || workflow.status === 'paused') && (
            <button
              onClick={handleStopClick}
              className="text-red-600 hover:text-red-900"
              aria-label={`Stop ${workflow.name}`}
            >
              <Square className="h-4 w-4" />
            </button>
          )}
        </div>
        <span className="text-xs text-gray-500">{workflow.isTemplate && 'Template'}</span>
      </div>
    </div>
  )
}
