/**
 * Utility functions for ComplianceWorkflow components
 * Extracted from ComplianceWorkflow.tsx for better organization and reusability
 */

import React from 'react'
import {
  Play,
  Calendar,
  Zap,
  GitBranch,
  Activity,
  Settings
} from 'lucide-react'
import type { WorkflowStatus, WorkflowPriority, StepStatus, TriggerType } from './types'

/**
 * Get the appropriate color classes for a workflow status
 * @param status - The workflow status
 * @returns Tailwind CSS classes for the status badge
 */
export function getStatusColor(status: WorkflowStatus): string {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-50'
    case 'completed':
      return 'text-blue-600 bg-blue-50'
    case 'paused':
      return 'text-yellow-600 bg-yellow-50'
    case 'failed':
      return 'text-red-600 bg-red-50'
    case 'cancelled':
      return 'text-gray-600 bg-gray-50'
    case 'draft':
      return 'text-purple-600 bg-purple-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

/**
 * Get the appropriate color classes for a workflow priority
 * @param priority - The workflow priority level
 * @returns Tailwind CSS classes for the priority badge
 */
export function getPriorityColor(priority: WorkflowPriority): string {
  switch (priority) {
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

/**
 * Get the appropriate color classes for a step status
 * @param status - The step status
 * @returns Tailwind CSS classes for the step status badge
 */
export function getStepStatusColor(status: StepStatus): string {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50'
    case 'in-progress':
      return 'text-blue-600 bg-blue-50'
    case 'pending':
      return 'text-gray-600 bg-gray-50'
    case 'failed':
      return 'text-red-600 bg-red-50'
    case 'skipped':
      return 'text-yellow-600 bg-yellow-50'
    case 'cancelled':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

/**
 * Get the appropriate icon for a trigger type
 * @param trigger - The trigger type
 * @returns React element representing the trigger icon
 */
export function getTriggerIcon(trigger: TriggerType): React.ReactElement {
  switch (trigger) {
    case 'manual':
      return React.createElement(Play, { className: 'h-4 w-4' })
    case 'scheduled':
      return React.createElement(Calendar, { className: 'h-4 w-4' })
    case 'event':
      return React.createElement(Zap, { className: 'h-4 w-4' })
    case 'conditional':
      return React.createElement(GitBranch, { className: 'h-4 w-4' })
    case 'webhook':
      return React.createElement(Activity, { className: 'h-4 w-4' })
    default:
      return React.createElement(Settings, { className: 'h-4 w-4' })
  }
}

/**
 * Format execution time in a human-readable format
 * @param hours - Execution time in hours
 * @returns Formatted string (e.g., "30m", "2.5h", "3d 4.5h")
 */
export function formatExecutionTime(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`
  }
  if (hours < 24) {
    return `${hours.toFixed(1)}h`
  }
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  return remainingHours > 0 ? `${days}d ${remainingHours.toFixed(1)}h` : `${days}d`
}
