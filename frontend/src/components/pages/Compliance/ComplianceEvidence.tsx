'use client'

import React, { useState, useMemo } from 'react'
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Tag, 
  Archive, 
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Paperclip,
  Image,
  Video,
  File,
  Folder,
  Lock,
  Unlock,
  Star,
  Share2,
  Copy
} from 'lucide-react'

/**
 * Evidence type classification
 */
export type EvidenceType = 
  | 'document' 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'screenshot' 
  | 'certificate' 
  | 'report' 
  | 'other'

/**
 * Evidence status for tracking
 */
export type EvidenceStatus = 'pending' | 'approved' | 'rejected' | 'under-review' | 'archived'

/**
 * Evidence category for organization
 */
export type EvidenceCategory = 
  | 'audit' 
  | 'training' 
  | 'policy' 
  | 'incident' 
  | 'regulatory' 
  | 'assessment' 
  | 'monitoring'

/**
 * Evidence priority level
 */
export type EvidencePriority = 'critical' | 'high' | 'medium' | 'low'

/**
 * Evidence verification status
 */
export type VerificationStatus = 'verified' | 'unverified' | 'disputed' | 'expired'

/**
 * Evidence metadata interface
 */
export interface EvidenceMetadata {
  fileSize: number
  mimeType: string
  dimensions?: { width: number; height: number }
  duration?: number // for video/audio in seconds
  pages?: number // for documents
  checksum: string
  version: string
}

/**
 * Evidence tag interface
 */
export interface EvidenceTag {
  id: string
  name: string
  color: string
}

/**
 * Evidence comment interface
 */
export interface EvidenceComment {
  id: string
  author: string
  content: string
  timestamp: string
  isInternal: boolean
}

/**
 * Compliance evidence interface
 */
export interface ComplianceEvidence {
  id: string
  title: string
  description: string
  type: EvidenceType
  category: EvidenceCategory
  status: EvidenceStatus
  priority: EvidencePriority
  verificationStatus: VerificationStatus
  fileUrl: string
  thumbnailUrl?: string
  metadata: EvidenceMetadata
  uploadedBy: string
  uploadedDate: string
  lastModified: string
  expiryDate?: string
  retentionPeriod?: number // in years
  relatedCompliance: string[]
  tags: EvidenceTag[]
  comments: EvidenceComment[]
  isConfidential: boolean
  accessLevel: 'public' | 'internal' | 'restricted' | 'confidential'
  approvedBy?: string
  approvedDate?: string
  reviewedBy?: string
  reviewDate?: string
}

/**
 * Props for the ComplianceEvidence component
 */
export interface ComplianceEvidenceProps {
  /** Array of evidence items to display */
  evidence?: ComplianceEvidence[]
  /** Callback when evidence is selected */
  onEvidenceSelect?: (evidence: ComplianceEvidence) => void
  /** Callback when uploading new evidence */
  onUploadEvidence?: () => void
  /** Callback when downloading evidence */
  onDownloadEvidence?: (evidenceId: string) => void
  /** Callback when approving evidence */
  onApproveEvidence?: (evidenceId: string) => void
  /** Callback when rejecting evidence */
  onRejectEvidence?: (evidenceId: string) => void
  /** Loading state */
  loading?: boolean
  /** Error state */
  error?: string | null
  /** Additional CSS classes */
  className?: string
}

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
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<EvidenceType | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<EvidenceCategory | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<EvidenceStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<EvidencePriority | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid')
  const [sortBy, setSortBy] = useState<'uploadedDate' | 'title' | 'type' | 'priority'>('uploadedDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Filter and sort evidence
  const filteredEvidence = useMemo(() => {
    return evidence
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  const evidenceStats = useMemo(() => {
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

  const getStatusColor = (status: EvidenceStatus): string => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'under-review': return 'text-blue-600 bg-blue-50'
      case 'rejected': return 'text-red-600 bg-red-50'
      case 'archived': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: EvidencePriority): string => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getVerificationColor = (status: VerificationStatus): string => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50'
      case 'unverified': return 'text-gray-600 bg-gray-50'
      case 'disputed': return 'text-red-600 bg-red-50'
      case 'expired': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTypeIcon = (type: EvidenceType) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4" />
      case 'image': return <Image className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'certificate': return <CheckCircle2 className="h-4 w-4" />
      default: return <File className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatTotalSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Evidence Library</h2>
          <p className="text-gray-600 mt-1">Manage compliance evidence and documentation</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onUploadEvidence}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            aria-label="Upload new evidence"
          >
            <Upload className="h-4 w-4" />
            Upload Evidence
          </button>
        </div>
      </div>

      {/* Evidence Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Evidence</p>
              <p className="text-2xl font-bold text-gray-900">{evidenceStats.total}</p>
            </div>
            <Archive className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{evidenceStats.pending + evidenceStats.underReview}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{evidenceStats.approved}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">{formatTotalSize(evidenceStats.totalSize)}</p>
            </div>
            <Folder className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-lg border">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search evidence..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search evidence"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={filterType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value as EvidenceType | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by type"
          >
            <option value="all">All Types</option>
            <option value="document">Document</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="screenshot">Screenshot</option>
            <option value="certificate">Certificate</option>
            <option value="report">Report</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterCategory(e.target.value as EvidenceCategory | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="audit">Audit</option>
            <option value="training">Training</option>
            <option value="policy">Policy</option>
            <option value="incident">Incident</option>
            <option value="regulatory">Regulatory</option>
            <option value="assessment">Assessment</option>
            <option value="monitoring">Monitoring</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as EvidenceStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="under-review">Under Review</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={viewMode}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setViewMode(e.target.value as 'grid' | 'list' | 'table')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Change view mode"
          >
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
            <option value="table">Table View</option>
          </select>
        </div>
      </div>

      {/* Evidence Content */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEvidence.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onEvidenceSelect?.(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onEvidenceSelect?.(item)
                }
              }}
              aria-label={`View details for ${item.title}`}
            >
              {/* Thumbnail */}
              <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {item.thumbnailUrl ? (
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">
                    {getTypeIcon(item.type)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{item.title}</h3>
                  {item.isConfidential && <Lock className="h-3 w-3 text-red-600 flex-shrink-0 ml-1" />}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getPriorityColor(item.priority)}`}>
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>{formatFileSize(item.metadata.fileSize)}</span>
                    <span>{new Date(item.uploadedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        onDownloadEvidence?.(item.id)
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      aria-label={`Download ${item.title}`}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs ${getVerificationColor(item.verificationStatus)}`}>
                      {item.verificationStatus === 'verified' && <CheckCircle2 className="h-3 w-3" />}
                      {item.verificationStatus === 'unverified' && <AlertCircle className="h-3 w-3" />}
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
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
                {filteredEvidence.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onEvidenceSelect?.(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onEvidenceSelect?.(item)
                      }
                    }}
                    aria-label={`View details for ${item.title}`}
                  >
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
                          <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(item.type)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">{item.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{new Date(item.uploadedDate).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">by {item.uploadedBy}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatFileSize(item.metadata.fileSize)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation()
                            onDownloadEvidence?.(item.id)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label={`Download ${item.title}`}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation()
                                onApproveEvidence?.(item.id)
                              }}
                              className="text-green-600 hover:text-green-900"
                              aria-label={`Approve ${item.title}`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation()
                                onRejectEvidence?.(item.id)
                              }}
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
      )}

      {/* Empty State */}
      {filteredEvidence.length === 0 && (
        <div className="text-center py-12">
          <Archive className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No evidence found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterType !== 'all' || filterCategory !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by uploading your first piece of evidence'}
          </p>
          {(!searchTerm && filterType === 'all' && filterCategory === 'all' && filterStatus === 'all') && (
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
