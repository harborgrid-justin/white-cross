'use client'

import React, { useState } from 'react'
import { AlertTriangle, Plus } from 'lucide-react'
import type {
  ComplianceReportsProps,
  ComplianceReportType,
  ReportStatus,
  ReportFrequency,
  ViewMode,
  SortField,
  SortOrder
} from './ComplianceReports.types'
import { useReportsFilter } from './hooks/useReportsFilter'
import { useReportStats } from './hooks/useReportStats'
import {
  ReportMetrics,
  ReportFilters,
  ReportGridView,
  ReportListView,
  EmptyState
} from './components/ComplianceReports'

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
  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<ComplianceReportType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'all'>('all')
  const [filterFrequency, setFilterFrequency] = useState<ReportFrequency | 'all'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [sortBy, setSortBy] = useState<SortField>('lastGenerated')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // Custom hooks for filtering and statistics
  const filteredReports = useReportsFilter({
    reports,
    searchTerm,
    filterType,
    filterStatus,
    filterFrequency,
    sortBy,
    sortOrder
  })

  const reportStats = useReportStats(reports)

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm !== '' ||
    filterType !== 'all' ||
    filterStatus !== 'all' ||
    filterFrequency !== 'all'

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
      {viewMode === 'dashboard' && <ReportMetrics stats={reportStats} />}

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

      {/* Filters */}
      {(viewMode === 'grid' || viewMode === 'list') && (
        <ReportFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onTypeChange={setFilterType}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          filterFrequency={filterFrequency}
          onFrequencyChange={setFilterFrequency}
        />
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <>
          {filteredReports.length > 0 ? (
            <ReportGridView
              reports={filteredReports}
              onReportSelect={onReportSelect}
              onGenerateReport={onGenerateReport}
              onDownloadReport={onDownloadReport}
            />
          ) : (
            <EmptyState hasActiveFilters={hasActiveFilters} onCreateReport={onCreateReport} />
          )}
        </>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          {filteredReports.length > 0 ? (
            <ReportListView
              reports={filteredReports}
              onReportSelect={onReportSelect}
              onGenerateReport={onGenerateReport}
              onDownloadReport={onDownloadReport}
            />
          ) : (
            <EmptyState hasActiveFilters={hasActiveFilters} onCreateReport={onCreateReport} />
          )}
        </>
      )}
    </div>
  )
}
