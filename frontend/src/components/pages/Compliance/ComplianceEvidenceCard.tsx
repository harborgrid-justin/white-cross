/**
 * ComplianceEvidenceCard component
 * Individual evidence card for grid view
 */

import React from 'react'
import { Download, MoreHorizontal, Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import type { ComplianceEvidenceCardProps } from './ComplianceEvidenceTypes'
import {
  getStatusColor,
  getPriorityColor,
  getVerificationColor,
  getTypeIcon,
  formatFileSize,
  formatStatus,
  capitalizeFirst
} from './ComplianceEvidenceUtils'

/**
 * ComplianceEvidenceCard component
 *
 * Displays a single evidence item in card format with:
 * - Thumbnail preview
 * - Title and confidentiality indicator
 * - Status and priority badges
 * - File size and upload date
 * - Tags
 * - Action buttons (download, verify)
 */
export default function ComplianceEvidenceCard({
  evidence,
  onSelect,
  onDownload
}: ComplianceEvidenceCardProps) {
  const handleCardClick = () => {
    onSelect?.(evidence)
  }

  const handleDownloadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onDownload?.(evidence.id)
  }

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    // Handle menu actions
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardClick()
    }
  }

  return (
    <div
      className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${evidence.title}`}
    >
      {/* Thumbnail */}
      <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        {evidence.thumbnailUrl ? (
          <img
            src={evidence.thumbnailUrl}
            alt={evidence.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400">
            {getTypeIcon(evidence.type)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Title with Confidentiality Badge */}
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
            {evidence.title}
          </h3>
          {evidence.isConfidential && (
            <Lock className="h-3 w-3 text-red-600 flex-shrink-0 ml-1" />
          )}
        </div>

        {/* Status and Priority Badges */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              evidence.status
            )}`}
          >
            {formatStatus(evidence.status)}
          </span>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getPriorityColor(
              evidence.priority
            )}`}
          >
            {capitalizeFirst(evidence.priority)}
          </span>
        </div>

        {/* File Info */}
        <div className="text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>{formatFileSize(evidence.metadata.fileSize)}</span>
            <span>{new Date(evidence.uploadedDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Tags */}
        {evidence.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {evidence.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                {tag.name}
              </span>
            ))}
            {evidence.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{evidence.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadClick}
              className="text-blue-600 hover:text-blue-900"
              aria-label={`Download ${evidence.title}`}
            >
              <Download className="h-4 w-4" />
            </button>
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs ${getVerificationColor(
                evidence.verificationStatus
              )}`}
            >
              {evidence.verificationStatus === 'verified' && (
                <CheckCircle2 className="h-3 w-3" />
              )}
              {evidence.verificationStatus === 'unverified' && (
                <AlertCircle className="h-3 w-3" />
              )}
            </span>
          </div>
          <button
            onClick={handleMenuClick}
            className="text-gray-400 hover:text-gray-600"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
