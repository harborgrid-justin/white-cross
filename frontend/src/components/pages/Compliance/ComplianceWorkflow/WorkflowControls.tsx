/**
 * WorkflowControls component - Search and filter controls for workflows
 * Extracted from ComplianceWorkflow.tsx for better component organization
 */

'use client'

import React from 'react'
import { Search } from 'lucide-react'
import type { WorkflowStatus, WorkflowPriority, TriggerType } from './types'

/**
 * Props for the WorkflowControls component
 */
export interface WorkflowControlsProps {
  /** Current search term */
  searchTerm: string
  /** Callback when search term changes */
  onSearchChange: (value: string) => void
  /** Current status filter */
  filterStatus: WorkflowStatus | 'all'
  /** Callback when status filter changes */
  onStatusFilterChange: (value: WorkflowStatus | 'all') => void
  /** Current priority filter */
  filterPriority: WorkflowPriority | 'all'
  /** Callback when priority filter changes */
  onPriorityFilterChange: (value: WorkflowPriority | 'all') => void
  /** Current trigger filter */
  filterTrigger: TriggerType | 'all'
  /** Callback when trigger filter changes */
  onTriggerFilterChange: (value: TriggerType | 'all') => void
  /** Current view mode */
  viewMode: 'grid' | 'list' | 'kanban'
  /** Callback when view mode changes */
  onViewModeChange: (value: 'grid' | 'list' | 'kanban') => void
  /** Additional CSS classes */
  className?: string
}

/**
 * WorkflowControls - Search and filter controls for workflow management
 *
 * Features:
 * - Full-text search input
 * - Status filter dropdown
 * - Priority filter dropdown
 * - Trigger type filter dropdown
 * - View mode selector
 *
 * @param props - Component props
 * @returns JSX element
 */
export function WorkflowControls({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusFilterChange,
  filterPriority,
  onPriorityFilterChange,
  filterTrigger,
  onTriggerFilterChange,
  viewMode,
  onViewModeChange,
  className = ''
}: WorkflowControlsProps): React.ReactElement {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(e.target.value)
  }

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onStatusFilterChange(e.target.value as WorkflowStatus | 'all')
  }

  const handlePriorityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onPriorityFilterChange(e.target.value as WorkflowPriority | 'all')
  }

  const handleTriggerFilterChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onTriggerFilterChange(e.target.value as TriggerType | 'all')
  }

  const handleViewModeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onViewModeChange(e.target.value as 'grid' | 'list' | 'kanban')
  }

  return (
    <div className={`flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-lg border ${className}`}>
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search workflows..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Search workflows"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filterStatus}
          onChange={handleStatusFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={filterPriority}
          onChange={handlePriorityFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by priority"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={filterTrigger}
          onChange={handleTriggerFilterChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by trigger"
        >
          <option value="all">All Triggers</option>
          <option value="manual">Manual</option>
          <option value="scheduled">Scheduled</option>
          <option value="event">Event</option>
          <option value="conditional">Conditional</option>
          <option value="webhook">Webhook</option>
        </select>

        <select
          value={viewMode}
          onChange={handleViewModeChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Change view mode"
        >
          <option value="grid">Grid View</option>
          <option value="list">List View</option>
          <option value="kanban">Kanban Board</option>
        </select>
      </div>
    </div>
  )
}
