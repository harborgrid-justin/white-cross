/**
 * Custom hook for filtering and sorting reports
 *
 * This hook provides filtering and sorting logic for compliance reports
 * based on search term, type, status, frequency, and sort criteria.
 */

import { useMemo } from 'react'
import type {
  ComplianceReport,
  ComplianceReportType,
  ReportStatus,
  ReportFrequency,
  SortField,
  SortOrder
} from '../ComplianceReports.types'

export interface UseReportsFilterParams {
  reports: ComplianceReport[]
  searchTerm: string
  filterType: ComplianceReportType | 'all'
  filterStatus: ReportStatus | 'all'
  filterFrequency: ReportFrequency | 'all'
  sortBy: SortField
  sortOrder: SortOrder
}

/**
 * Filter and sort reports based on provided criteria
 *
 * @param params - Filter and sort parameters
 * @returns Filtered and sorted array of reports
 */
export function useReportsFilter({
  reports,
  searchTerm,
  filterType,
  filterStatus,
  filterFrequency,
  sortBy,
  sortOrder
}: UseReportsFilterParams): ComplianceReport[] {
  return useMemo(() => {
    return reports
      .filter(report => {
        const matchesSearch =
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
}
