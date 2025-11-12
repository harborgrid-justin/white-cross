/**
 * Utility functions for Compliance Reports
 *
 * This module provides helper functions for formatting, styling,
 * and data manipulation in the Compliance Reports feature.
 */

import type { ReportStatus, ComplianceReportType } from './ComplianceReports.types'

/**
 * Get CSS classes for report status badge
 *
 * @param status - The report status
 * @returns CSS class string for styling the status badge
 */
export function getStatusColor(status: ReportStatus): string {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50'
    case 'generating':
      return 'text-blue-600 bg-blue-50'
    case 'scheduled':
      return 'text-purple-600 bg-purple-50'
    case 'failed':
      return 'text-red-600 bg-red-50'
    case 'draft':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

/**
 * Get CSS classes for report type badge
 *
 * @param type - The report type
 * @returns CSS class string for styling the type badge
 */
export function getTypeColor(type: ComplianceReportType): string {
  switch (type) {
    case 'summary':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'audit':
      return 'text-purple-600 bg-purple-50 border-purple-200'
    case 'training':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'risk':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'regulatory':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'custom':
      return 'text-gray-600 bg-gray-50 border-gray-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

/**
 * Format file size in bytes to human-readable format
 *
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB") or "N/A" if bytes is undefined
 *
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1536) // "1.5 KB"
 * formatFileSize(undefined) // "N/A"
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes) return 'N/A'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format duration in seconds to human-readable format
 *
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "2m 30s") or "N/A" if seconds is undefined
 *
 * @example
 * formatDuration(30) // "30s"
 * formatDuration(90) // "1m 30s"
 * formatDuration(120) // "2m"
 * formatDuration(undefined) // "N/A"
 */
export function formatDuration(seconds?: number): string {
  if (!seconds) return 'N/A'
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
}
