/**
 * Type definitions for Compliance Evidence management
 *
 * This module contains all type definitions, interfaces, and type aliases
 * used throughout the ComplianceEvidence component system.
 */

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
 * Evidence statistics interface
 */
export interface EvidenceStatistics {
  total: number
  pending: number
  approved: number
  rejected: number
  underReview: number
  expired: number
  confidential: number
  totalSize: number
}

/**
 * View mode options for evidence display
 */
export type ViewMode = 'grid' | 'list' | 'table'

/**
 * Sort field options
 */
export type SortField = 'uploadedDate' | 'title' | 'type' | 'priority'

/**
 * Sort order options
 */
export type SortOrder = 'asc' | 'desc'

/**
 * Filter state interface
 */
export interface FilterState {
  searchTerm: string
  type: EvidenceType | 'all'
  category: EvidenceCategory | 'all'
  status: EvidenceStatus | 'all'
  priority: EvidencePriority | 'all'
}
