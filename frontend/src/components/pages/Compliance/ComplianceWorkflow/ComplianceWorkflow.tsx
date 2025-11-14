/**
 * ComplianceWorkflow component - Main workflow management interface
 * Refactored for better maintainability and organization
 */

'use client'

import React, { useState, useMemo } from 'react'
import { GitBranch, AlertCircle, Plus } from 'lucide-react'
import type {
  ComplianceWorkflow as ComplianceWorkflowType,
  ComplianceWorkflowProps,
  WorkflowStatus,
  WorkflowPriority,
  TriggerType,
  WorkflowStats as WorkflowStatsType
} from './types'
import { WorkflowStats } from './WorkflowStats'
import { WorkflowCard } from './WorkflowCard'
import { WorkflowList } from './WorkflowList'
import { WorkflowControls } from './WorkflowControls'

/**
 * ComplianceWorkflow component for managing compliance workflows and processes
 *
 * Features:
 * - Workflow dashboard with execution metrics
 * - Workflow builder and editor
 * - Step-by-step process tracking
 * - Automated workflow execution
 * - Approval and review processes
 * - Workflow templates and reusability
 * - Real-time status monitoring
 * - Execution logs and audit trails
 *
 * @param props - Component props
 * @returns JSX element
 */
export default function ComplianceWorkflow({
  workflows = [],
  onWorkflowSelect,
  onCreateWorkflow,
  onStartWorkflow,
  onPauseWorkflow,
  onStopWorkflow,
  loading = false,
  error = null,
  className = ''
}: ComplianceWorkflowProps): React.ReactElement {
  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<WorkflowStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<WorkflowPriority | 'all'>('all')
  const [filterTrigger, setFilterTrigger] = useState<TriggerType | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid')
  const [sortBy, setSortBy] = useState<'lastRun' | 'nextRun' | 'name' | 'priority'>('lastRun')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Filter and sort workflows
  const filteredWorkflows = useMemo(() => {
    return workflows
      .filter((workflow) => {
        const matchesSearch =
          workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workflow.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          workflow.category.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' || workflow.status === filterStatus
        const matchesPriority = filterPriority === 'all' || workflow.priority === filterPriority
        const matchesTrigger = filterTrigger === 'all' || workflow.trigger === filterTrigger

        return matchesSearch && matchesStatus && matchesPriority && matchesTrigger
      })
      .sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1

        if (sortBy === 'lastRun') {
          const dateA = a.lastRun ? new Date(a.lastRun).getTime() : 0
          const dateB = b.lastRun ? new Date(b.lastRun).getTime() : 0
          return (dateA - dateB) * multiplier
        } else if (sortBy === 'nextRun') {
          const dateA = a.nextRun ? new Date(a.nextRun).getTime() : 0
          const dateB = b.nextRun ? new Date(b.nextRun).getTime() : 0
          return (dateA - dateB) * multiplier
        } else if (sortBy === 'name') {
          return a.name.localeCompare(b.name) * multiplier
        } else {
          const priorityOrder: Record<WorkflowPriority, number> = {
            critical: 4,
            high: 3,
            medium: 2,
            low: 1
          }
          return (priorityOrder[a.priority] - priorityOrder[b.priority]) * multiplier
        }
      })
  }, [workflows, searchTerm, filterStatus, filterPriority, filterTrigger, sortBy, sortOrder])

  // Calculate workflow statistics
  const workflowStats: WorkflowStatsType = useMemo(() => {
    const total = workflows.length
    const active = workflows.filter((w) => w.status === 'active').length
    const completed = workflows.filter((w) => w.status === 'completed').length
    const failed = workflows.filter((w) => w.status === 'failed').length
    const paused = workflows.filter((w) => w.status === 'paused').length
    const avgCompletionRate =
      workflows.length > 0
        ? workflows.reduce((sum, w) => sum + w.completionRate, 0) / workflows.length
        : 0
    const avgExecutionTime =
      workflows.length > 0
        ? workflows.reduce((sum, w) => sum + w.averageExecutionTime, 0) / workflows.length
        : 0

    return { total, active, completed, failed, paused, avgCompletionRate, avgExecutionTime }
  }, [workflows])

  // Check if no filters are active
  const hasActiveFilters =
    searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterTrigger !== 'all'

  // Loading state
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Error loading workflows: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compliance Workflows</h2>
          <p className="text-gray-600 mt-1">Manage compliance processes and workflows</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateWorkflow}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            aria-label="Create new workflow"
          >
            <Plus className="h-4 w-4" />
            New Workflow
          </button>
        </div>
      </div>

      {/* Workflow Statistics */}
      <WorkflowStats stats={workflowStats} />

      {/* Controls */}
      <WorkflowControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onStatusFilterChange={setFilterStatus}
        filterPriority={filterPriority}
        onPriorityFilterChange={setFilterPriority}
        filterTrigger={filterTrigger}
        onTriggerFilterChange={setFilterTrigger}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Workflow Content - Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onSelect={onWorkflowSelect}
              onStart={onStartWorkflow}
              onPause={onPauseWorkflow}
              onStop={onStopWorkflow}
            />
          ))}
        </div>
      )}

      {/* Workflow Content - List View */}
      {viewMode === 'list' && (
        <WorkflowList
          workflows={filteredWorkflows}
          onWorkflowSelect={onWorkflowSelect}
          onStartWorkflow={onStartWorkflow}
          onPauseWorkflow={onPauseWorkflow}
        />
      )}

      {/* Empty State */}
      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {hasActiveFilters
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first compliance workflow'}
          </p>
          {!hasActiveFilters && (
            <div className="mt-6">
              <button
                onClick={onCreateWorkflow}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Workflow
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
