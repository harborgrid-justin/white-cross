/**
 * Utility functions for ComplianceEvidence component
 */

import React from 'react'
import {
  FileText,
  Image,
  Video,
  File,
  CheckCircle2
} from 'lucide-react'
import type {
  EvidenceType,
  EvidenceStatus,
  EvidencePriority,
  VerificationStatus
} from './ComplianceEvidenceTypes'

/**
 * Get color classes for evidence status
 */
export const getStatusColor = (status: EvidenceStatus): string => {
  switch (status) {
    case 'approved':
      return 'text-green-600 bg-green-50'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50'
    case 'under-review':
      return 'text-blue-600 bg-blue-50'
    case 'rejected':
      return 'text-red-600 bg-red-50'
    case 'archived':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

/**
 * Get color classes for evidence priority
 */
export const getPriorityColor = (priority: EvidencePriority): string => {
  switch (priority) {
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

/**
 * Get color classes for verification status
 */
export const getVerificationColor = (status: VerificationStatus): string => {
  switch (status) {
    case 'verified':
      return 'text-green-600 bg-green-50'
    case 'unverified':
      return 'text-gray-600 bg-gray-50'
    case 'disputed':
      return 'text-red-600 bg-red-50'
    case 'expired':
      return 'text-orange-600 bg-orange-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

/**
 * Get icon component for evidence type
 */
export const getTypeIcon = (type: EvidenceType): JSX.Element => {
  switch (type) {
    case 'document':
      return <FileText className="h-4 w-4" />
    case 'image':
      return <Image className="h-4 w-4" />
    case 'video':
      return <Video className="h-4 w-4" />
    case 'certificate':
      return <CheckCircle2 className="h-4 w-4" />
    default:
      return <File className="h-4 w-4" />
  }
}

/**
 * Format file size in bytes to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format total storage size in bytes to human-readable format
 */
export const formatTotalSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Capitalize first letter of string
 */
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Format status string for display
 */
export const formatStatus = (status: EvidenceStatus): string => {
  return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
}
