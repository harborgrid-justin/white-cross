/**
 * Utility functions for Compliance Evidence management
 *
 * This module contains helper functions for formatting, styling,
 * and displaying evidence-related data.
 */

import React from 'react'
import {
  FileText,
  Image,
  Video,
  CheckCircle2,
  File
} from 'lucide-react'

import type {
  EvidenceType,
  EvidenceStatus,
  EvidencePriority,
  VerificationStatus
} from './types'

/**
 * Get CSS classes for evidence status badges
 *
 * @param status - The evidence status
 * @returns CSS class string for styling the status badge
 */
export function getStatusColor(status: EvidenceStatus): string {
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
 * Get CSS classes for evidence priority badges
 *
 * @param priority - The evidence priority level
 * @returns CSS class string for styling the priority badge
 */
export function getPriorityColor(priority: EvidencePriority): string {
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
 * Get CSS classes for verification status badges
 *
 * @param status - The verification status
 * @returns CSS class string for styling the verification badge
 */
export function getVerificationColor(status: VerificationStatus): string {
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
 * Get the appropriate icon component for an evidence type
 *
 * @param type - The evidence type
 * @returns React element representing the icon
 */
export function getTypeIcon(type: EvidenceType): React.ReactElement {
  switch (type) {
    case 'document':
      return React.createElement(FileText, { className: 'h-4 w-4' })
    case 'image':
      return React.createElement(Image, { className: 'h-4 w-4' })
    case 'video':
      return React.createElement(Video, { className: 'h-4 w-4' })
    case 'certificate':
      return React.createElement(CheckCircle2, { className: 'h-4 w-4' })
    default:
      return React.createElement(File, { className: 'h-4 w-4' })
  }
}

/**
 * Format file size in bytes to human-readable format
 *
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format total storage size with higher precision
 *
 * @param bytes - Total size in bytes
 * @returns Formatted string with 2 decimal places (e.g., "1.53 GB")
 */
export function formatTotalSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Capitalize first letter of each word in a string
 *
 * @param str - Input string
 * @returns Capitalized string
 */
export function capitalizeWords(str: string): string {
  return str.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Capitalize first letter of a string
 *
 * @param str - Input string
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
