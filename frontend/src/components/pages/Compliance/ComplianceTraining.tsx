'use client'

import React, { useState, useMemo } from 'react'
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Play,
  Pause,
  RotateCcw,
  Award,
  Target,
  TrendingUp,
  User,
  FileText,
  Download,
  Upload,
  Settings,
  Bell
} from 'lucide-react'

/**
 * Training status for tracking completion
 */
export type TrainingStatus = 'not-started' | 'in-progress' | 'completed' | 'overdue' | 'expired'

/**
 * Training type classification
 */
export type TrainingType = 
  | 'mandatory' 
  | 'recommended' 
  | 'certification' 
  | 'refresher' 
  | 'specialized'

/**
 * Training delivery method
 */
export type DeliveryMethod = 'online' | 'in-person' | 'hybrid' | 'self-paced' | 'webinar'

/**
 * Training priority level
 */
export type TrainingPriority = 'critical' | 'high' | 'medium' | 'low'

/**
 * Training assignment interface
 */
export interface TrainingAssignment {
  id: string
  userId: string
  trainingId: string
  assignedDate: string
  dueDate: string
  completedDate?: string
  status: TrainingStatus
  progress: number
  score?: number
  attempts: number
  notes: string
}

/**
 * Training module interface
 */
export interface TrainingModule {
  id: string
  title: string
  description: string
  type: TrainingType
  priority: TrainingPriority
  deliveryMethod: DeliveryMethod
  duration: number // in minutes
  validityPeriod: number // in months
  prerequisites: string[]
  learningObjectives: string[]
  materials: string[]
  assessmentRequired: boolean
  passingScore?: number
  maxAttempts: number
  tags: string[]
  createdDate: string
  lastUpdated: string
  isActive: boolean
}

/**
 * Training record for an individual
 */
export interface TrainingRecord {
  id: string
  userId: string
  userName: string
  userRole: string
  trainingModule: TrainingModule
  assignment: TrainingAssignment
  certificateUrl?: string
  nextDueDate?: string
}

/**
 * Props for the ComplianceTraining component
 */
export interface ComplianceTrainingProps {
  /** Array of training records to display */
  trainingRecords?: TrainingRecord[]
  /** Array of available training modules */
  trainingModules?: TrainingModule[]
  /** Callback when a training record is selected */
  onRecordSelect?: (record: TrainingRecord) => void
  /** Callback when assigning training */
  onAssignTraining?: (moduleId: string, userIds: string[]) => void
  /** Callback when creating a new training module */
  onCreateModule?: () => void
  /** Loading state */
  loading?: boolean
  /** Error state */
  error?: string | null
  /** Additional CSS classes */
  className?: string
}

/**
 * ComplianceTraining component for managing training and education compliance
 * 
 * Features:
 * - Training dashboard with completion metrics
 * - Training assignment and tracking
 * - Progress monitoring and reporting
 * - Certificate management
 * - Training calendar and scheduling
 * - Multiple view modes (individual, training, summary)
 * - Filtering and search capabilities
 * 
 * @param props - Component props
 * @returns JSX element
 */
export default function ComplianceTraining({
  trainingRecords = [],
  trainingModules = [],
  onRecordSelect,
  onAssignTraining,
  onCreateModule,
  loading = false,
  error = null,
  className = ''
}: ComplianceTrainingProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<TrainingStatus | 'all'>('all')
  const [filterType, setFilterType] = useState<TrainingType | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<TrainingPriority | 'all'>('all')
  const [viewMode, setViewMode] = useState<'records' | 'modules' | 'dashboard'>('dashboard')
  const [sortBy, setSortBy] = useState<'dueDate' | 'progress' | 'userName' | 'priority'>('dueDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Filter and sort training records
  const filteredRecords = useMemo(() => {
    return trainingRecords
      .filter(record => {
        const matchesSearch = record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.trainingModule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.userRole.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' || record.assignment.status === filterStatus
        const matchesType = filterType === 'all' || record.trainingModule.type === filterType
        const matchesPriority = filterPriority === 'all' || record.trainingModule.priority === filterPriority
        
        return matchesSearch && matchesStatus && matchesType && matchesPriority
      })
      .sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1
        
        if (sortBy === 'dueDate') {
          return (new Date(a.assignment.dueDate).getTime() - new Date(b.assignment.dueDate).getTime()) * multiplier
        } else if (sortBy === 'progress') {
          return (a.assignment.progress - b.assignment.progress) * multiplier
        } else if (sortBy === 'userName') {
          return a.userName.localeCompare(b.userName) * multiplier
        } else {
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return (priorityOrder[a.trainingModule.priority] - priorityOrder[b.trainingModule.priority]) * multiplier
        }
      })
  }, [trainingRecords, searchTerm, filterStatus, filterType, filterPriority, sortBy, sortOrder])

  // Calculate training metrics
  const trainingMetrics = useMemo(() => {
    const total = trainingRecords.length
    const completed = trainingRecords.filter(r => r.assignment.status === 'completed').length
    const inProgress = trainingRecords.filter(r => r.assignment.status === 'in-progress').length
    const overdue = trainingRecords.filter(r => r.assignment.status === 'overdue').length
    const notStarted = trainingRecords.filter(r => r.assignment.status === 'not-started').length
    const completionRate = total > 0 ? (completed / total) * 100 : 0
    const avgProgress = total > 0 ? trainingRecords.reduce((sum, r) => sum + r.assignment.progress, 0) / total : 0
    const criticalOverdue = trainingRecords.filter(r => 
      r.assignment.status === 'overdue' && r.trainingModule.priority === 'critical'
    ).length

    return { 
      total, 
      completed, 
      inProgress, 
      overdue, 
      notStarted, 
      completionRate, 
      avgProgress, 
      criticalOverdue 
    }
  }, [trainingRecords])

  const getStatusColor = (status: TrainingStatus): string => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'in-progress': return 'text-blue-600 bg-blue-50'
      case 'overdue': return 'text-red-600 bg-red-50'
      case 'expired': return 'text-red-600 bg-red-50'
      case 'not-started': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: TrainingPriority): string => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getProgressColor = (progress: number): string => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 75) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    if (progress >= 25) return 'bg-orange-500'
    return 'bg-gray-300'
  }

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
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
          <span className="text-red-800">Error loading training data: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Training Management</h2>
          <p className="text-gray-600 mt-1">Track compliance training and certifications</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateModule}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            aria-label="Create new training module"
          >
            <GraduationCap className="h-4 w-4" />
            New Training Module
          </button>
        </div>
      </div>

      {/* Training Metrics Dashboard */}
      {viewMode === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{trainingMetrics.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">{trainingMetrics.completionRate.toFixed(1)}%</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Training</p>
                <p className="text-2xl font-bold text-red-600">{trainingMetrics.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Overdue</p>
                <p className="text-2xl font-bold text-red-600">{trainingMetrics.criticalOverdue}</p>
              </div>
              <Bell className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      )}

      {/* View Mode Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setViewMode('dashboard')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            viewMode === 'dashboard' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Dashboard view"
        >
          Dashboard
        </button>
        <button
          onClick={() => setViewMode('records')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            viewMode === 'records' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Training records view"
        >
          Training Records
        </button>
        <button
          onClick={() => setViewMode('modules')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            viewMode === 'modules' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Training modules view"
        >
          Training Modules
        </button>
      </div>

      {/* Controls */}
      {(viewMode === 'records' || viewMode === 'modules') && (
        <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-lg border">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={viewMode === 'records' ? 'Search training records...' : 'Search training modules...'}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search training"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {viewMode === 'records' && (
              <select
                value={filterStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as TrainingStatus | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="expired">Expired</option>
              </select>
            )}

            <select
              value={filterType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value as TrainingType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by type"
            >
              <option value="all">All Types</option>
              <option value="mandatory">Mandatory</option>
              <option value="recommended">Recommended</option>
              <option value="certification">Certification</option>
              <option value="refresher">Refresher</option>
              <option value="specialized">Specialized</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterPriority(e.target.value as TrainingPriority | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      )}

      {/* Training Records View */}
      {viewMode === 'records' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Training
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onRecordSelect?.(record)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onRecordSelect?.(record)
                      }
                    }}
                    aria-label={`View training record for ${record.userName}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{record.userName}</div>
                          <div className="text-sm text-gray-500">{record.userRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.trainingModule.title}</div>
                        <div className="text-sm text-gray-500">
                          {record.trainingModule.type} • {formatDuration(record.trainingModule.duration)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(record.trainingModule.priority)}`}>
                        {record.trainingModule.priority.charAt(0).toUpperCase() + record.trainingModule.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.assignment.status)}`}>
                        {record.assignment.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(record.assignment.progress)}`}
                            style={{ width: `${record.assignment.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{record.assignment.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.assignment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation()
                          onRecordSelect?.(record)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label={`View ${record.userName} training record`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Training Modules View */}
      {viewMode === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingModules.map((module) => (
            <div
              key={module.id}
              className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(module.priority)}`}>
                    {module.priority.charAt(0).toUpperCase() + module.priority.slice(1)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    // Handle module menu actions
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{module.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium text-gray-900 capitalize">{module.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium text-gray-900">{formatDuration(module.duration)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Delivery:</span>
                  <span className="font-medium text-gray-900 capitalize">{module.deliveryMethod.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Validity:</span>
                  <span className="font-medium text-gray-900">{module.validityPeriod} months</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    {module.assessmentRequired ? 'Assessment Required' : 'No Assessment'}
                  </div>
                  <button
                    onClick={() => onAssignTraining?.(module.id, [])}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    aria-label={`Assign ${module.title} training`}
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty States */}
      {viewMode === 'records' && filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No training records found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all' || filterPriority !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Training records will appear here once assignments are made'}
          </p>
        </div>
      )}

      {viewMode === 'modules' && trainingModules.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No training modules found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first training module
          </p>
          <div className="mt-6">
            <button
              onClick={onCreateModule}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Training Module
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
