/**
 * Report List View Component
 *
 * Displays reports in a table list format
 */

import React from 'react'
import { Download, RefreshCw } from 'lucide-react'
import type { ComplianceReport } from '../../ComplianceReports.types'
import { getStatusColor, getTypeColor } from '../../ComplianceReports.utils'

export interface ReportListViewProps {
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
 * Report list view component
 *
 * Renders reports in a table format with sortable columns
 *
 * @param props - Component props
 * @returns JSX element
 */
export function ReportListView({
  reports,
  onReportSelect,
  onGenerateReport,
  onDownloadReport
}: ReportListViewProps) {
  return (
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
            {reports.map((report) => (
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
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {report.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                      report.type
                    )}`}
                  >
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {report.frequency.replace('-', ' ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.lastGenerated
                    ? new Date(report.lastGenerated).toLocaleDateString()
                    : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.nextScheduled
                    ? new Date(report.nextScheduled).toLocaleDateString()
                    : 'N/A'}
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
  )
}
