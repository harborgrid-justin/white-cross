/**
 * Type definitions for Compliance Reports
 *
 * This module contains all type definitions, interfaces, and type aliases
 * used throughout the Compliance Reports feature.
 */

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
 * Report status indicating current state of the report
 */
export type ReportStatus =
  | 'draft'
  | 'scheduled'
  | 'generating'
  | 'completed'
  | 'failed'

/**
 * Report frequency for scheduled reports
 */
export type ReportFrequency =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annually'
  | 'one-time'

/**
 * Report format options for export
 */
export type ReportFormat =
  | 'pdf'
  | 'excel'
  | 'csv'
  | 'html'

/**
 * Chart type for data visualizations
 */
export type ChartType =
  | 'bar'
  | 'line'
  | 'pie'
  | 'doughnut'
  | 'area'
  | 'table'

/**
 * View mode for displaying reports
 */
export type ViewMode =
  | 'grid'
  | 'list'
  | 'dashboard'

/**
 * Sort field options for report sorting
 */
export type SortField =
  | 'lastGenerated'
  | 'nextScheduled'
  | 'title'
  | 'type'

/**
 * Sort order direction
 */
export type SortOrder =
  | 'asc'
  | 'desc'

/**
 * Report filter configuration
 *
 * Defines how to filter report data based on field values and operators
 */
export interface ReportFilter {
  /** Field name to filter on */
  field: string
  /** Comparison operator */
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in'
  /** Filter value(s) */
  value: string | number | string[] | number[]
}

/**
 * Report chart configuration
 *
 * Defines visualization settings for report charts
 */
export interface ReportChart {
  /** Unique chart identifier */
  id: string
  /** Chart display title */
  title: string
  /** Chart visualization type */
  type: ChartType
  /** Data source identifier */
  dataSource: string
  /** X-axis field name */
  xAxis: string
  /** Y-axis field name */
  yAxis: string
  /** Optional grouping field */
  groupBy?: string
  /** Filters applied to chart data */
  filters: ReportFilter[]
}

/**
 * Compliance report interface
 *
 * Represents a complete compliance report with all metadata,
 * configuration, and status information
 */
export interface ComplianceReport {
  /** Unique report identifier */
  id: string
  /** Report title */
  title: string
  /** Report description */
  description: string
  /** Report type category */
  type: ComplianceReportType
  /** Current report status */
  status: ReportStatus
  /** Report generation frequency */
  frequency: ReportFrequency
  /** Export format */
  format: ReportFormat
  /** User who created the report */
  createdBy: string
  /** Report creation date (ISO string) */
  createdDate: string
  /** Last generation timestamp (ISO string) */
  lastGenerated?: string
  /** Next scheduled generation timestamp (ISO string) */
  nextScheduled?: string
  /** Email recipients for report distribution */
  recipients: string[]
  /** Data filters applied to report */
  filters: ReportFilter[]
  /** Chart configurations for report visualizations */
  charts: ReportChart[]
  /** Whether report is active for scheduled generation */
  isActive: boolean
  /** Tags for categorization */
  tags: string[]
  /** URL to generated report file */
  fileUrl?: string
  /** File size in bytes */
  fileSize?: number
  /** Generation time in seconds */
  generationTime?: number
}

/**
 * Report metrics for dashboard display
 *
 * Aggregated statistics about reports
 */
export interface ReportMetrics {
  /** Total number of reports */
  totalReports: number
  /** Number of scheduled reports */
  scheduledReports: number
  /** Reports completed this month */
  completedThisMonth: number
  /** Average generation time in seconds */
  averageGenerationTime: number
  /** Total storage used in bytes */
  storageUsed: number
  /** Most frequently used report type */
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
