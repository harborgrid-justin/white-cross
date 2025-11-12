/**
 * Report Filters Component
 *
 * Provides search and filter controls for reports
 */

import React from 'react'
import { Search } from 'lucide-react'
import type {
  ComplianceReportType,
  ReportStatus,
  ReportFrequency
} from '../../ComplianceReports.types'

export interface ReportFiltersProps {
  /** Current search term */
  searchTerm: string
  /** Search term change handler */
  onSearchChange: (value: string) => void
  /** Current filter type */
  filterType: ComplianceReportType | 'all'
  /** Type filter change handler */
  onTypeChange: (value: ComplianceReportType | 'all') => void
  /** Current filter status */
  filterStatus: ReportStatus | 'all'
  /** Status filter change handler */
  onStatusChange: (value: ReportStatus | 'all') => void
  /** Current filter frequency */
  filterFrequency: ReportFrequency | 'all'
  /** Frequency filter change handler */
  onFrequencyChange: (value: ReportFrequency | 'all') => void
}

/**
 * Report filters component
 *
 * Renders search bar and filter dropdowns for reports
 *
 * @param props - Component props
 * @returns JSX element
 */
export function ReportFilters({
  searchTerm,
  onSearchChange,
  filterType,
  onTypeChange,
  filterStatus,
  onStatusChange,
  filterFrequency,
  onFrequencyChange
}: ReportFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-lg border">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Search reports"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filterType}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onTypeChange(e.target.value as ComplianceReportType | 'all')
          }
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
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onStatusChange(e.target.value as ReportStatus | 'all')
          }
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
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onFrequencyChange(e.target.value as ReportFrequency | 'all')
          }
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
  )
}
