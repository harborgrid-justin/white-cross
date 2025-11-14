/**
 * ComplianceEvidenceTable component
 * Table view for evidence items
 */

import React from 'react'
import { Download, Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import type { ComplianceEvidenceTableProps } from './ComplianceEvidenceTypes'
import {
  getStatusColor,
  getPriorityColor,
  getTypeIcon,
  formatFileSize,
  formatStatus,
  capitalizeFirst
} from './ComplianceEvidenceUtils'

/**
 * ComplianceEvidenceTable component
 *
 * Displays evidence in table format with columns for:
 * - Evidence details (title, description, thumbnail)
 * - Type
 * - Category
 * - Status
 * - Priority
 * - Upload date and user
 * - File size
 * - Actions (download, approve, reject)
 */
export default function ComplianceEvidenceTable({
  evidence,
  onSelect,
  onDownload,
  onApprove,
  onReject
}: ComplianceEvidenceTableProps) {
  const handleRowClick = (item: typeof evidence[0]) => {
    onSelect?.(item)
  }

  const handleDownloadClick = (e: React.MouseEvent<HTMLButtonElement>, evidenceId: string) => {
    e.stopPropagation()
    onDownload?.(evidenceId)
  }

  const handleApproveClick = (e: React.MouseEvent<HTMLButtonElement>, evidenceId: string) => {
    e.stopPropagation()
    onApprove?.(evidenceId)
  }

  const handleRejectClick = (e: React.MouseEvent<HTMLButtonElement>, evidenceId: string) => {
    e.stopPropagation()
    onReject?.(evidenceId)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>, item: typeof evidence[0]) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleRowClick(item)
    }
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evidence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {evidence.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, item)}
                aria-label={`View details for ${item.title}`}
              >
                {/* Evidence Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                          {getTypeIcon(item.type)}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        {item.isConfidential && <Lock className="h-3 w-3 text-red-600 ml-2" />}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Type Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTypeIcon(item.type)}
                    <span className="ml-2 text-sm text-gray-900 capitalize">{item.type}</span>
                  </div>
                </td>

                {/* Category Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 capitalize">{item.category}</span>
                </td>

                {/* Status Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {formatStatus(item.status)}
                  </span>
                </td>

                {/* Priority Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                      item.priority
                    )}`}
                  >
                    {capitalizeFirst(item.priority)}
                  </span>
                </td>

                {/* Uploaded Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div>{new Date(item.uploadedDate).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">by {item.uploadedBy}</div>
                  </div>
                </td>

                {/* Size Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatFileSize(item.metadata.fileSize)}
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={(e) => handleDownloadClick(e, item.id)}
                      className="text-blue-600 hover:text-blue-900"
                      aria-label={`Download ${item.title}`}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={(e) => handleApproveClick(e, item.id)}
                          className="text-green-600 hover:text-green-900"
                          aria-label={`Approve ${item.title}`}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleRejectClick(e, item.id)}
                          className="text-red-600 hover:text-red-900"
                          aria-label={`Reject ${item.title}`}
                        >
                          <AlertCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
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
