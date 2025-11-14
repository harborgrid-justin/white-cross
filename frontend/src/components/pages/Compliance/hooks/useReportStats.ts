/**
 * Custom hook for calculating report statistics
 *
 * This hook computes various statistics about reports for dashboard display.
 */

import { useMemo } from 'react'
import type { ComplianceReport } from '../ComplianceReports.types'

export interface ReportStats {
  total: number
  scheduled: number
  completed: number
  failed: number
  generating: number
}

/**
 * Calculate statistics about reports
 *
 * @param reports - Array of compliance reports
 * @returns Report statistics object
 */
export function useReportStats(reports: ComplianceReport[]): ReportStats {
  return useMemo(() => {
    const total = reports.length
    const scheduled = reports.filter(r => r.frequency !== 'one-time' && r.isActive).length
    const completed = reports.filter(r => r.status === 'completed').length
    const failed = reports.filter(r => r.status === 'failed').length
    const generating = reports.filter(r => r.status === 'generating').length

    return { total, scheduled, completed, failed, generating }
  }, [reports])
}
