'use client'

import React, { useState, useMemo } from 'react'
import { AlertCircle, Archive } from 'lucide-react'
import type {
  ComplianceEvidenceProps,
  EvidenceType,
  EvidenceCategory,
  EvidenceStatus,
  EvidencePriority,
  ViewMode,
  SortField,
  SortOrder,
  EvidenceStats
} from './ComplianceEvidenceTypes'
import ComplianceEvidenceStats from './ComplianceEvidenceStats'
import ComplianceEvidenceControls from './ComplianceEvidenceControls'
import ComplianceEvidenceCard from './ComplianceEvidenceCard'
import ComplianceEvidenceTable from './ComplianceEvidenceTable'

/**
 * ComplianceEvidence component for managing compliance evidence and documentation
 *
 * Features:
 * - Evidence library with categorization
 * - File upload and management
 * - Evidence approval workflow
 * - Search and filtering capabilities
 * - Evidence viewer with preview
 * - Version control and metadata
 * - Access control and permissions
 * - Evidence retention management
 *
 * @param props - Component props
 * @returns JSX element
 */
export default function ComplianceEvidence({
  evidence = [],
  onEvidenceSelect,
  onUploadEvidence,
  onDownloadEvidence,
  onApproveEvidence,
  onRejectEvidence,
  loading = false,
  error = null,
  className = ''
}: ComplianceEvidenceProps) {
  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<EvidenceType | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<EvidenceCategory | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<EvidenceStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<EvidencePriority | 'all'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortField>('uploadedDate')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // Filter and sort evidence
  const filteredEvidence = useMemo(() => {
    return evidence
      .filter(item => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesType = filterType === 'all' || item.type === filterType
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus
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
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return (priorityOrder[a.priority] - priorityOrder[b.priority]) * multiplier
        }
      })
  }, [evidence, searchTerm, filterType, filterCategory, filterStatus, filterPriority, sortBy, sortOrder])

  // Calculate evidence statistics
  const evidenceStats: EvidenceStats = useMemo(() => {
    const total = evidence.length
    const pending = evidence.filter(e => e.status === 'pending').length
    const approved = evidence.filter(e => e.status === 'approved').length
    const rejected = evidence.filter(e => e.status === 'rejected').length
    const underReview = evidence.filter(e => e.status === 'under-review').length
    const expired = evidence.filter(e => e.expiryDate && new Date(e.expiryDate) < new Date()).length
    const confidential = evidence.filter(e => e.isConfidential).length
    const totalSize = evidence.reduce((sum, e) => sum + e.metadata.fileSize, 0)

    return { total, pending, approved, rejected, underReview, expired, confidential, totalSize }
  }, [evidence])

  // Loading state
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Error loading evidence: {error}</span>
        </div>
      </div>
    )
  }

  // Check if filters are active
  const hasActiveFilters =
    searchTerm !== '' || filterType !== 'all' || filterCategory !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls (Header + Search/Filters) */}
      <ComplianceEvidenceControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        filterPriority={filterPriority}
        onFilterPriorityChange={setFilterPriority}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onUploadEvidence={onUploadEvidence}
      />

      {/* Evidence Statistics */}
      <ComplianceEvidenceStats stats={evidenceStats} />

      {/* Evidence Content - Grid View */}
      {viewMode === 'grid' && filteredEvidence.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEvidence.map((item) => (
            <ComplianceEvidenceCard
              key={item.id}
              evidence={item}
              onSelect={onEvidenceSelect}
              onDownload={onDownloadEvidence}
            />
          ))}
        </div>
      )}

      {/* Evidence Content - Table View */}
      {viewMode === 'table' && filteredEvidence.length > 0 && (
        <ComplianceEvidenceTable
          evidence={filteredEvidence}
          onSelect={onEvidenceSelect}
          onDownload={onDownloadEvidence}
          onApprove={onApproveEvidence}
          onReject={onRejectEvidence}
        />
      )}

      {/* Empty State */}
      {filteredEvidence.length === 0 && (
        <div className="text-center py-12">
          <Archive className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No evidence found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {hasActiveFilters
              ? 'Try adjusting your search or filters'
              : 'Get started by uploading your first piece of evidence'}
          </p>
          {!hasActiveFilters && (
            <div className="mt-6">
              <button
                onClick={onUploadEvidence}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Evidence
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
