/**
 * @fileoverview Reports Type Definitions
 * @module types/reports
 *
 * @description
 * TypeScript type definitions for reports functionality.
 * Provides type safety for report data structures.
 *
 * @since 1.0.0
 */

export interface ReportHistory {
  id: string | number
  title: string
  type: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string | Date
  createdBy?: string
  format?: 'pdf' | 'csv' | 'xlsx'
  downloadUrl?: string
  description?: string
  parameters?: Record<string, unknown>
}

export interface ReportTemplate {
  id: string | number
  name: string
  description?: string
  type: string
  category?: string
  parameters?: ReportParameter[]
  isCustom?: boolean
}

export interface ReportParameter {
  name: string
  label: string
  type: 'string' | 'number' | 'date' | 'select' | 'boolean'
  required?: boolean
  defaultValue?: unknown
  options?: Array<{ label: string; value: string | number }>
}

export interface ReportMetrics {
  totalReports: number
  reportsToday: number
  reportsThisWeek: number
  reportsThisMonth: number
  avgGenerationTime?: number
}

export interface ReportFilter {
  search?: string
  type?: string
  status?: string
  dateFrom?: string | Date
  dateTo?: string | Date
  createdBy?: string
}

export interface ComplianceReport extends ReportHistory {
  complianceType?: 'ferpa' | 'hipaa' | 'state' | 'federal' | 'other'
  regulatoryBody?: string
  auditTrail?: Array<{
    timestamp: string | Date
    action: string
    user: string
  }>
}
