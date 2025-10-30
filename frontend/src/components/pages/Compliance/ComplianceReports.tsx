'use client'

import React, { useState, useMemo } from 'react'
import { 
  FileText, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter, 
  Search, 
  Eye, 
  Settings, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Users,
  Target,
  Activity,
  RefreshCw,
  Share2,
  Printer,
  Mail,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'

/**
 * Report type for compliance reporting
 */
export type ComplianceReportType = 
  | 'summary' 
  | 'audit' 
  | 'training' 
  | 'risk' 
  | 'regulatory' 
  | 'custom'

/**
 * Report status
 */
export type ReportStatus = 'draft' | 'scheduled' | 'generating' | 'completed' | 'failed'

/**
 * Report frequency for scheduled reports
 */
export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'one-time'

/**
 * Report format options
 */
export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'html'

/**
 * Chart type for visualizations
 */
export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'table'

/**
 * Report filter configuration
 */
export interface ReportFilter {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in'
  value: string | number | string[] | number[]
}

/**
 * Report chart configuration
 */
export interface ReportChart {
  id: string
  title: string
  type: ChartType
  dataSource: string
  xAxis: string
  yAxis: string
  groupBy?: string
  filters: ReportFilter[]
}

/**
 * Compliance report interface
 */
export interface ComplianceReport {
  id: string
  title: string
  description: string
  type: ComplianceReportType
  status: ReportStatus
  frequency: ReportFrequency
  format: ReportFormat
  createdBy: string
  createdDate: string
  lastGenerated?: string
  nextScheduled?: string
  recipients: string[]
  filters: ReportFilter[]
  charts: ReportChart[]
  isActive: boolean
  tags: string[]
  fileUrl?: string
  fileSize?: number
  generationTime?: number
}

/**
 * Report metrics for dashboard
 */
export interface ReportMetrics {
  totalReports: number
  scheduledReports: number
  completedThisMonth: number
  averageGenerationTime: number
  storageUsed: number
  mostPopularType: ComplianceReportType
}

/**
 * Props for the ComplianceReports component
 */
export interface ComplianceReportsProps {
  /** Array of compliance reports to display */
  reports?: ComplianceReport[]
  /** Report metrics for dashboard */
  metrics?: ReportMetrics
  /** Callback when a report is selected */
  onReportSelect?: (report: ComplianceReport) => void
  /** Callback when creating a new report */
  onCreateReport?: () => void
  /** Callback when generating a report */
  onGenerateReport?: (reportId: string) => void
  /** Callback when downloading a report */
  onDownloadReport?: (reportId: string) => void
  /** Callback when scheduling a report */
  onScheduleReport?: (reportId: string, frequency: ReportFrequency) => void
  /** Loading state */
  loading?: boolean
  /** Error state */
  error?: string | null
  /** Additional CSS classes */
  className?: string
}

/**
 * ComplianceReports component for managing compliance reports and analytics
 * 
 * Features:
 * - Report dashboard with key metrics
 * - Report creation and scheduling
 * - Multiple report types and formats
 * - Chart and visualization configuration
 * - Report generation and distribution
 * - Report history and management
 * - Filtering and search capabilities
 * 
 * @param props - Component props
 * @returns JSX element
 */
export default function ComplianceReports({
  reports = [],
  metrics,
  onReportSelect,
  onCreateReport,
  onGenerateReport,
  onDownloadReport,
  onScheduleReport,
  loading = false,
  error = null,
  className = ''
}: ComplianceReportsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<ComplianceReportType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'all'>('all')
  const [filterFrequency, setFilterFrequency] = useState<ReportFrequency | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'dashboard'>('dashboard')
  const [sortBy, setSortBy] = useState<'lastGenerated' | 'nextScheduled' | 'title' | 'type'>('lastGenerated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    return reports
      .filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = filterType === 'all' || report.type === filterType
        const matchesStatus = filterStatus === 'all' || report.status === filterStatus
        const matchesFrequency = filterFrequency === 'all' || report.frequency === filterFrequency
        
        return matchesSearch && matchesType && matchesStatus && matchesFrequency
      })
      .sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1
        
        if (sortBy === 'lastGenerated') {
          const dateA = a.lastGenerated ? new Date(a.lastGenerated).getTime() : 0
          const dateB = b.lastGenerated ? new Date(b.lastGenerated).getTime() : 0
          return (dateA - dateB) * multiplier
        } else if (sortBy === 'nextScheduled') {
          const dateA = a.nextScheduled ? new Date(a.nextScheduled).getTime() : 0
          const dateB = b.nextScheduled ? new Date(b.nextScheduled).getTime() : 0
          return (dateA - dateB) * multiplier
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title) * multiplier
        } else {
          return a.type.localeCompare(b.type) * multiplier
        }
      })
  }, [reports, searchTerm, filterType, filterStatus, filterFrequency, sortBy, sortOrder])

  // Calculate report statistics
  const reportStats = useMemo(() => {
    const total = reports.length
    const scheduled = reports.filter(r => r.frequency !== 'one-time' && r.isActive).length
    const completed = reports.filter(r => r.status === 'completed').length
    const failed = reports.filter(r => r.status === 'failed').length
    const generating = reports.filter(r => r.status === 'generating').length

    return { total, scheduled, completed, failed, generating }
  }, [reports])

  const getStatusColor = (status: ReportStatus): string => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'generating': return 'text-blue-600 bg-blue-50'
      case 'scheduled': return 'text-purple-600 bg-purple-50'
      case 'failed': return 'text-red-600 bg-red-50'
      case 'draft': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTypeColor = (type: ComplianceReportType): string => {
    switch (type) {
      case 'summary': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'audit': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'training': return 'text-green-600 bg-green-50 border-green-200'
      case 'risk': return 'text-red-600 bg-red-50 border-red-200'
      case 'regulatory': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'custom': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'N/A'
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
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
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Error loading reports: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compliance Reports</h2>
          <p className="text-gray-600 mt-1">Generate and manage compliance reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            aria-label="Create new report"
          >
            <Plus className="h-4 w-4" />
            New Report
          </button>
        </div>
      </div>

      {/* Report Metrics Dashboard */}
      {viewMode === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{reportStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-purple-600">{reportStats.scheduled}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{reportStats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{reportStats.generating}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-600" />
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
          onClick={() => setViewMode('grid')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            viewMode === 'grid' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Grid view"
        >
          Grid View
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            viewMode === 'list' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-label="List view"
        >
          List View
        </button>
      </div>

      {/* Controls */}
      {(viewMode === 'grid' || viewMode === 'list') && (
        <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-lg border">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search reports"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value as ComplianceReportType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by type"
            >
              <option value="all">All Types</option>
              <option value="summary">Summary</option>
              <option value="audit">Audit</option>
              <option value="training">Training</option>
              <option value="risk">Risk</option>
              <option value="regulatory">Regulatory</option>
              <option value="custom">Custom</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as ReportStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="generating">Generating</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={filterFrequency}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterFrequency(e.target.value as ReportFrequency | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by frequency"
            >
              <option value="all">All Frequencies</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
              <option value="one-time">One-time</option>
            </select>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onReportSelect?.(report)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onReportSelect?.(report)
                }
              }}
              aria-label={`View details for ${report.title}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                  </span>
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

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Frequency:</span>
                  <span className="font-medium text-gray-900 capitalize">{report.frequency.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Format:</span>
                  <span className="font-medium text-gray-900 uppercase">{report.format}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last Generated:</span>
                  <span className="font-medium text-gray-900">
                    {report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {report.status === 'completed' && report.fileUrl && (
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation()
                          onDownloadReport?.(report.id)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label={`Download ${report.title}`}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        onGenerateReport?.(report.id)
                      }}
                      className="text-green-600 hover:text-green-900"
                      aria-label={`Generate ${report.title}`}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {report.fileSize ? formatFileSize(report.fileSize) : ''}
                  </span>
                </div>
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
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Scheduled
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onReportSelect?.(report)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onReportSelect?.(report)
                      }
                    }}
                    aria-label={`View details for ${report.title}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{report.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {report.frequency.replace('-', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.nextScheduled ? new Date(report.nextScheduled).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {report.status === 'completed' && report.fileUrl && (
                          <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation()
                              onDownloadReport?.(report.id)
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            aria-label={`Download ${report.title}`}
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation()
                            onGenerateReport?.(report.id)
                          }}
                          className="text-green-600 hover:text-green-900"
                          aria-label={`Generate ${report.title}`}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation()
                            onReportSelect?.(report)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label={`View ${report.title}`}
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

      {/* Empty States */}
      {(viewMode === 'grid' || viewMode === 'list') && filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' || filterFrequency !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first compliance report'}
          </p>
          {(!searchTerm && filterType === 'all' && filterStatus === 'all' && filterFrequency === 'all') && (
            <div className="mt-6">
              <button
                onClick={onCreateReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Report
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
