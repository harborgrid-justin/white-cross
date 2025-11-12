/**
 * Report Grid View Component
 *
 * Displays reports in a card grid layout
 */

import React from 'react'
import { Download, RefreshCw, MoreHorizontal } from 'lucide-react'
import type { ComplianceReport } from '../../ComplianceReports.types'
import { getStatusColor, getTypeColor, formatFileSize } from '../../ComplianceReports.utils'

export interface ReportGridViewProps {
  /** Array of reports to display */
  reports: ComplianceReport[]
  /** Callback when a report is selected */
  onReportSelect?: (report: ComplianceReport) => void
  /** Callback when generating a report */
  onGenerateReport?: (reportId: string) => void
  /** Callback when downloading a report */
  onDownloadReport?: (reportId: string) => void
}

/**
 * Report grid view component
 *
 * Renders reports as cards in a responsive grid layout
 *
 * @param props - Component props
 * @returns JSX element
 */
export function ReportGridView({
  reports,
  onReportSelect,
  onGenerateReport,
  onDownloadReport
}: ReportGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reports.map((report) => (
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
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                  report.type
                )}`}
              >
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
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  report.status
                )}`}
              >
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Frequency:</span>
              <span className="font-medium text-gray-900 capitalize">
                {report.frequency.replace('-', ' ')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Format:</span>
              <span className="font-medium text-gray-900 uppercase">{report.format}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Last Generated:</span>
              <span className="font-medium text-gray-900">
                {report.lastGenerated
                  ? new Date(report.lastGenerated).toLocaleDateString()
                  : 'Never'}
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
  )
}
