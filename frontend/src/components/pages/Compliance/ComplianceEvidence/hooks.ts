/**
 * Custom React hooks for Compliance Evidence management
 *
 * This module contains custom hooks for filtering, sorting,
 * and calculating statistics for evidence data.
 */

import { useMemo } from 'react'

import type {
  ComplianceEvidence,
  EvidenceType,
  EvidenceCategory,
  EvidenceStatus,
  EvidencePriority,
  EvidenceStatistics,
  SortField,
  SortOrder
} from './types'

/**
 * Priority ordering for sorting
 */
const PRIORITY_ORDER: Record<EvidencePriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
}

/**
 * Hook for filtering and sorting evidence
 *
 * @param evidence - Array of evidence items
 * @param searchTerm - Search term to filter by
 * @param filterType - Evidence type filter
 * @param filterCategory - Evidence category filter
 * @param filterStatus - Evidence status filter
 * @param filterPriority - Evidence priority filter
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort order (ascending or descending)
 * @returns Filtered and sorted array of evidence items
 */
export function useEvidenceFiltering(
  evidence: ComplianceEvidence[],
  searchTerm: string,
  filterType: EvidenceType | 'all',
  filterCategory: EvidenceCategory | 'all',
  filterStatus: EvidenceStatus | 'all',
  filterPriority: EvidencePriority | 'all',
  sortBy: SortField,
  sortOrder: SortOrder
): ComplianceEvidence[] {
  return useMemo(() => {
    return evidence
      .filter(item => {
        // Search filter - check title, description, uploader, and tags
        const matchesSearch =
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))

        // Type filter
        const matchesType = filterType === 'all' || item.type === filterType

        // Category filter
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory

        // Status filter
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus

        // Priority filter
        const matchesPriority = filterPriority === 'all' || item.priority === filterPriority

        return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesPriority
      })
      .sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1

        if (sortBy === 'uploadedDate') {
          return (new Date(a.uploadedDate).getTime() - new Date(b.uploadedDate).getTime()) * multiplier
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title) * multiplier
        } else if (sortBy === 'type') {
          return a.type.localeCompare(b.type) * multiplier
        } else {
          // Sort by priority
          return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * multiplier
        }
      })
  }, [evidence, searchTerm, filterType, filterCategory, filterStatus, filterPriority, sortBy, sortOrder])
}

/**
 * Hook for calculating evidence statistics
 *
 * @param evidence - Array of evidence items
 * @returns Statistics object with counts and totals
 */
export function useEvidenceStatistics(evidence: ComplianceEvidence[]): EvidenceStatistics {
  return useMemo(() => {
    const total = evidence.length
    const pending = evidence.filter(e => e.status === 'pending').length
    const approved = evidence.filter(e => e.status === 'approved').length
    const rejected = evidence.filter(e => e.status === 'rejected').length
    const underReview = evidence.filter(e => e.status === 'under-review').length

    // Calculate expired evidence (items with expiry date in the past)
    const now = new Date()
    const expired = evidence.filter(e => e.expiryDate && new Date(e.expiryDate) < now).length

    // Count confidential evidence
    const confidential = evidence.filter(e => e.isConfidential).length

    // Calculate total storage size
    const totalSize = evidence.reduce((sum, e) => sum + e.metadata.fileSize, 0)

    return {
      total,
      pending,
      approved,
      rejected,
      underReview,
      expired,
      confidential,
      totalSize
    }
  }, [evidence])
}
