/**
 * Type definitions and interfaces for ComplianceEvidence component
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
 * View mode for evidence display
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
 * Evidence statistics interface
 */
export interface EvidenceStats {
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
 * Props for ComplianceEvidenceStats component
 */
export interface ComplianceEvidenceStatsProps {
  stats: EvidenceStats
}

/**
 * Props for ComplianceEvidenceControls component
 */
export interface ComplianceEvidenceControlsProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterType: EvidenceType | 'all'
  onFilterTypeChange: (value: EvidenceType | 'all') => void
  filterCategory: EvidenceCategory | 'all'
  onFilterCategoryChange: (value: EvidenceCategory | 'all') => void
  filterStatus: EvidenceStatus | 'all'
  onFilterStatusChange: (value: EvidenceStatus | 'all') => void
  filterPriority: EvidencePriority | 'all'
  onFilterPriorityChange: (value: EvidencePriority | 'all') => void
  viewMode: ViewMode
  onViewModeChange: (value: ViewMode) => void
  onUploadEvidence?: () => void
}

/**
 * Props for ComplianceEvidenceCard component
 */
export interface ComplianceEvidenceCardProps {
  evidence: ComplianceEvidence
  onSelect?: (evidence: ComplianceEvidence) => void
  onDownload?: (evidenceId: string) => void
}

/**
 * Props for ComplianceEvidenceTable component
 */
export interface ComplianceEvidenceTableProps {
  evidence: ComplianceEvidence[]
  onSelect?: (evidence: ComplianceEvidence) => void
  onDownload?: (evidenceId: string) => void
  onApprove?: (evidenceId: string) => void
  onReject?: (evidenceId: string) => void
}
