'use client'

import React, { useState, useMemo } from 'react'
import { 
  GitBranch, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  FastForward, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  Users, 
  Calendar, 
  Search, 
  Filter, 
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowRight,
  ArrowDown,
  Zap,
  Settings,
  Bell,
  Flag,
  Target,
  Activity,
  FileText,
  MessageSquare
} from 'lucide-react'

/**
 * Workflow status for tracking execution
 */
export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed' | 'cancelled'

/**
 * Workflow step status
 */
export type StepStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped' | 'cancelled'

/**
 * Workflow trigger type
 */
export type TriggerType = 'manual' | 'scheduled' | 'event' | 'conditional' | 'webhook'

/**
 * Workflow priority level
 */
export type WorkflowPriority = 'critical' | 'high' | 'medium' | 'low'

/**
 * Step action type
 */
export type StepAction = 
  | 'approval' 
  | 'review' 
  | 'notification' 
  | 'document' 
  | 'assessment' 
  | 'training' 
  | 'audit' 
  | 'custom'

/**
 * Workflow step interface
 */
export interface WorkflowStep {
  id: string
  name: string
  description: string
  action: StepAction
  status: StepStatus
  assignedTo?: string
  assignedGroup?: string
  dueDate?: string
  completedDate?: string
  completedBy?: string
  duration?: number // in hours
  prerequisites: string[]
  approvalRequired: boolean
  autoComplete: boolean
  conditions: string[]
  notes: string
  attachments: string[]
  order: number
}

/**
 * Workflow execution log entry
 */
export interface WorkflowLogEntry {
  id: string
  timestamp: string
  stepId: string
  action: string
  user: string
  details: string
  status: 'success' | 'warning' | 'error' | 'info'
}

/**
 * Compliance workflow interface
 */
export interface ComplianceWorkflow {
  id: string
  name: string
  description: string
  category: string
  status: WorkflowStatus
  priority: WorkflowPriority
  trigger: TriggerType
  createdBy: string
  createdDate: string
  lastModified: string
  lastRun?: string
  nextRun?: string
  completionRate: number
  averageExecutionTime: number
  steps: WorkflowStep[]
  logs: WorkflowLogEntry[]
  isTemplate: boolean
  tags: string[]
  participants: string[]
  approvers: string[]
  notifications: string[]
  retryPolicy: {
    maxRetries: number
    retryDelay: number
    escalationEnabled: boolean
  }
}

/**
 * Props for the ComplianceWorkflow component
 */
export interface ComplianceWorkflowProps {
  /** Array of compliance workflows to display */
  workflows?: ComplianceWorkflow[]
  /** Callback when a workflow is selected */
  onWorkflowSelect?: (workflow: ComplianceWorkflow) => void
  /** Callback when creating a new workflow */
  onCreateWorkflow?: () => void
  /** Callback when starting a workflow */
  onStartWorkflow?: (workflowId: string) => void
  /** Callback when pausing a workflow */
  onPauseWorkflow?: (workflowId: string) => void
  /** Callback when stopping a workflow */
  onStopWorkflow?: (workflowId: string) => void
  /** Loading state */
  loading?: boolean
  /** Error state */
  error?: string | null
  /** Additional CSS classes */
  className?: string
}

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
}: ComplianceWorkflowProps) {
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
      .filter(workflow => {
        const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return (priorityOrder[a.priority] - priorityOrder[b.priority]) * multiplier
        }
      })
  }, [workflows, searchTerm, filterStatus, filterPriority, filterTrigger, sortBy, sortOrder])

  // Calculate workflow statistics
  const workflowStats = useMemo(() => {
    const total = workflows.length
    const active = workflows.filter(w => w.status === 'active').length
    const completed = workflows.filter(w => w.status === 'completed').length
    const failed = workflows.filter(w => w.status === 'failed').length
    const paused = workflows.filter(w => w.status === 'paused').length
    const avgCompletionRate = workflows.length > 0 
      ? workflows.reduce((sum, w) => sum + w.completionRate, 0) / workflows.length 
      : 0
    const avgExecutionTime = workflows.length > 0 
      ? workflows.reduce((sum, w) => sum + w.averageExecutionTime, 0) / workflows.length 
      : 0

    return { total, active, completed, failed, paused, avgCompletionRate, avgExecutionTime }
  }, [workflows])

  const getStatusColor = (status: WorkflowStatus): string => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'completed': return 'text-blue-600 bg-blue-50'
      case 'paused': return 'text-yellow-600 bg-yellow-50'
      case 'failed': return 'text-red-600 bg-red-50'
      case 'cancelled': return 'text-gray-600 bg-gray-50'
      case 'draft': return 'text-purple-600 bg-purple-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: WorkflowPriority): string => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStepStatusColor = (status: StepStatus): string => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'in-progress': return 'text-blue-600 bg-blue-50'
      case 'pending': return 'text-gray-600 bg-gray-50'
      case 'failed': return 'text-red-600 bg-red-50'
      case 'skipped': return 'text-yellow-600 bg-yellow-50'
      case 'cancelled': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTriggerIcon = (trigger: TriggerType) => {
    switch (trigger) {
      case 'manual': return <Play className="h-4 w-4" />
      case 'scheduled': return <Calendar className="h-4 w-4" />
      case 'event': return <Zap className="h-4 w-4" />
      case 'conditional': return <GitBranch className="h-4 w-4" />
      case 'webhook': return <Activity className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  const formatExecutionTime = (hours: number): string => {
    if (hours < 1) return `${Math.round(hours * 60)}m`
    if (hours < 24) return `${hours.toFixed(1)}h`
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return remainingHours > 0 ? `${days}d ${remainingHours.toFixed(1)}h` : `${days}d`
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Workflows</p>
              <p className="text-2xl font-bold text-gray-900">{workflowStats.total}</p>
            </div>
            <GitBranch className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{workflowStats.active}</p>
            </div>
            <Play className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Completion</p>
              <p className="text-2xl font-bold text-blue-600">{workflowStats.avgCompletionRate.toFixed(1)}%</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-purple-600">{formatExecutionTime(workflowStats.avgExecutionTime)}</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-lg border">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search workflows"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filterStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as WorkflowStatus | 'all')}
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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterPriority(e.target.value as WorkflowPriority | 'all')}
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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterTrigger(e.target.value as TriggerType | 'all')}
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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setViewMode(e.target.value as 'grid' | 'list' | 'kanban')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Change view mode"
          >
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
            <option value="kanban">Kanban Board</option>
          </select>
        </div>
      </div>

      {/* Workflow Content */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onWorkflowSelect?.(workflow)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onWorkflowSelect?.(workflow)
                }
              }}
              aria-label={`View details for ${workflow.name}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{workflow.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                      {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(workflow.priority)}`}>
                      {workflow.priority.charAt(0).toUpperCase() + workflow.priority.slice(1)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation()
                    // Handle menu actions
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{workflow.description}</p>

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
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        onStartWorkflow?.(workflow.id)
                      }}
                      className="text-green-600 hover:text-green-900"
                      aria-label={`Start ${workflow.name}`}
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  ) : workflow.status === 'active' ? (
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        onPauseWorkflow?.(workflow.id)
                      }}
                      className="text-yellow-600 hover:text-yellow-900"
                      aria-label={`Pause ${workflow.name}`}
                    >
                      <Pause className="h-4 w-4" />
                    </button>
                  ) : null}
                  
                  {(workflow.status === 'active' || workflow.status === 'paused') && (
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        onStopWorkflow?.(workflow.id)
                      }}
                      className="text-red-600 hover:text-red-900"
                      aria-label={`Stop ${workflow.name}`}
                    >
                      <Square className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {workflow.isTemplate && 'Template'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg border overflow-hidden">
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
                {filteredWorkflows.map((workflow) => (
                  <tr
                    key={workflow.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onWorkflowSelect?.(workflow)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onWorkflowSelect?.(workflow)
                      }
                    }}
                    aria-label={`View details for ${workflow.name}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{workflow.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                        {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(workflow.priority)}`}>
                        {workflow.priority.charAt(0).toUpperCase() + workflow.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTriggerIcon(workflow.trigger)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">{workflow.trigger}</span>
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
                        <span className="text-sm text-gray-600">{workflow.completionRate.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {workflow.lastRun ? new Date(workflow.lastRun).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {workflow.status === 'draft' || workflow.status === 'paused' ? (
                          <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation()
                              onStartWorkflow?.(workflow.id)
                            }}
                            className="text-green-600 hover:text-green-900"
                            aria-label={`Start ${workflow.name}`}
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        ) : workflow.status === 'active' ? (
                          <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation()
                              onPauseWorkflow?.(workflow.id)
                            }}
                            className="text-yellow-600 hover:text-yellow-900"
                            aria-label={`Pause ${workflow.name}`}
                          >
                            <Pause className="h-4 w-4" />
                          </button>
                        ) : null}
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation()
                            onWorkflowSelect?.(workflow)
                          }}
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
      )}

      {/* Empty State */}
      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterTrigger !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first compliance workflow'}
          </p>
          {(!searchTerm && filterStatus === 'all' && filterPriority === 'all' && filterTrigger === 'all') && (
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
