/**
 * Core document types for document management system
 *
 * @module types/documents/core
 * @description Defines core document, folder, and file types with HIPAA compliance
 */

/**
 * Document status throughout its lifecycle
 */
export enum DocumentStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
  EXPIRED = 'expired'
}

/**
 * Document access levels for HIPAA compliance
 */
export enum DocumentAccessLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  PHI = 'phi', // Protected Health Information - highest security
  RESTRICTED = 'restricted'
}

/**
 * Document category for organization
 */
export enum DocumentCategory {
  CONSENT_FORM = 'consent_form',
  MEDICAL_RECORD = 'medical_record',
  IMMUNIZATION_RECORD = 'immunization_record',
  EMERGENCY_CONTACT = 'emergency_contact',
  MEDICATION_ORDER = 'medication_order',
  CARE_PLAN = 'care_plan',
  INCIDENT_REPORT = 'incident_report',
  PARENT_COMMUNICATION = 'parent_communication',
  POLICY = 'policy',
  PROCEDURE = 'procedure',
  TRAINING = 'training',
  OTHER = 'other'
}

/**
 * File MIME types supported by the system
 */
export enum SupportedMimeType {
  PDF = 'application/pdf',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  TXT = 'text/plain',
  CSV = 'text/csv'
}

/**
 * File metadata extracted from uploaded files
 */
export interface FileMetadata {
  /** Original file name */
  originalName: string;

  /** File size in bytes */
  size: number;

  /** MIME type */
  mimeType: SupportedMimeType | string;

  /** File extension */
  extension: string;

  /** MD5 hash for integrity verification */
  checksum: string;

  /** Virus scan status */
  virusScanStatus: 'pending' | 'clean' | 'infected' | 'failed';

  /** Virus scan timestamp */
  virusScanDate?: Date;

  /** OCR text extracted from document */
  ocrText?: string;

  /** Thumbnail URL */
  thumbnailUrl?: string;

  /** Preview URL (for images, PDFs) */
  previewUrl?: string;

  /** Number of pages (for PDFs, documents) */
  pageCount?: number;
}

/**
 * Document metadata for organization and search
 */
export interface DocumentMetadata {
  /** Document title */
  title: string;

  /** Document description */
  description?: string;

  /** Document category */
  category: DocumentCategory;

  /** Access level for HIPAA compliance */
  accessLevel: DocumentAccessLevel;

  /** Tags for search and organization */
  tags: string[];

  /** Custom metadata key-value pairs */
  customFields: Record<string, unknown>;

  /** Student ID if document is associated with a student */
  studentId?: string;

  /** School ID */
  schoolId?: string;

  /** District ID */
  districtId?: string;

  /** Retention period in days (for compliance) */
  retentionDays?: number;

  /** Auto-delete after retention period */
  autoDelete: boolean;

  /** Requires signature before use */
  requiresSignature: boolean;

  /** Is this a PHI document requiring special handling */
  isPHI: boolean;
}

/**
 * Core document entity
 */
export interface Document {
  /** Unique document ID */
  id: string;

  /** Document metadata */
  metadata: DocumentMetadata;

  /** File information */
  file: FileMetadata;

  /** Current document status */
  status: DocumentStatus;

  /** Parent folder ID */
  folderId?: string;

  /** Current version number */
  version: number;

  /** Storage path (internal) */
  storagePath: string;

  /** Public URL (if accessible) */
  publicUrl?: string;

  /** Download URL (time-limited, signed) */
  downloadUrl?: string;

  /** Created by user ID */
  createdBy: string;

  /** Created by user name */
  createdByName: string;

  /** Created timestamp */
  createdAt: Date;

  /** Last modified by user ID */
  modifiedBy?: string;

  /** Last modified by user name */
  modifiedByName?: string;

  /** Last modified timestamp */
  modifiedAt?: Date;

  /** Deleted by user ID (soft delete) */
  deletedBy?: string;

  /** Deleted timestamp (soft delete) */
  deletedAt?: Date;

  /** Expiration date for document */
  expiresAt?: Date;

  /** Signature workflow ID if document requires signature */
  signatureWorkflowId?: string;

  /** Is document locked for editing */
  isLocked: boolean;

  /** Locked by user ID */
  lockedBy?: string;

  /** Lock expiration */
  lockedUntil?: Date;
}

/**
 * Folder permissions
 */
export interface FolderPermission {
  /** User or role ID */
  principalId: string;

  /** Principal type */
  principalType: 'user' | 'role' | 'group';

  /** Can view folder contents */
  canView: boolean;

  /** Can add documents to folder */
  canAdd: boolean;

  /** Can edit documents in folder */
  canEdit: boolean;

  /** Can delete documents from folder */
  canDelete: boolean;

  /** Can manage folder permissions */
  canManage: boolean;

  /** Granted by user ID */
  grantedBy: string;

  /** Granted timestamp */
  grantedAt: Date;
}

/**
 * Folder entity for document organization
 */
export interface Folder {
  /** Unique folder ID */
  id: string;

  /** Folder name */
  name: string;

  /** Folder description */
  description?: string;

  /** Parent folder ID (null for root folders) */
  parentId?: string;

  /** Full path for breadcrumbs */
  path: string;

  /** Folder color for UI */
  color?: string;

  /** Folder icon */
  icon?: string;

  /** Access level inherited by documents */
  defaultAccessLevel: DocumentAccessLevel;

  /** Folder permissions */
  permissions: FolderPermission[];

  /** Number of documents in folder */
  documentCount: number;

  /** Number of subfolders */
  subfolderCount: number;

  /** Total size of all documents in bytes */
  totalSize: number;

  /** Created by user ID */
  createdBy: string;

  /** Created timestamp */
  createdAt: Date;

  /** Last modified timestamp */
  modifiedAt?: Date;

  /** Is folder shared */
  isShared: boolean;

  /** School ID */
  schoolId?: string;

  /** District ID */
  districtId?: string;
}

/**
 * Folder tree node for hierarchical display
 */
export interface FolderTreeNode extends Folder {
  /** Child folders */
  children: FolderTreeNode[];

  /** Is node expanded in UI */
  isExpanded: boolean;

  /** Is node selected */
  isSelected: boolean;

  /** Tree depth level */
  level: number;
}

/**
 * Document share information
 */
export interface DocumentShare {
  /** Share ID */
  id: string;

  /** Document ID */
  documentId: string;

  /** Shared with user ID */
  sharedWith: string;

  /** Shared with user name */
  sharedWithName: string;

  /** Share permissions */
  canView: boolean;
  canDownload: boolean;
  canEdit: boolean;
  canShare: boolean;

  /** Share expiration */
  expiresAt?: Date;

  /** Shared by user ID */
  sharedBy: string;

  /** Shared by user name */
  sharedByName: string;

  /** Shared timestamp */
  sharedAt: Date;

  /** Share message */
  message?: string;

  /** Require password for access */
  requiresPassword: boolean;

  /** Public share link */
  shareLink?: string;
}

/**
 * Document access log for HIPAA audit trail
 */
export interface DocumentAccessLog {
  /** Log entry ID */
  id: string;

  /** Document ID */
  documentId: string;

  /** User ID who accessed document */
  userId: string;

  /** User name */
  userName: string;

  /** Access action */
  action: 'view' | 'download' | 'edit' | 'delete' | 'share' | 'print';

  /** Access timestamp */
  accessedAt: Date;

  /** IP address */
  ipAddress: string;

  /** User agent */
  userAgent: string;

  /** Success or failure */
  success: boolean;

  /** Failure reason */
  failureReason?: string;

  /** Additional context */
  metadata?: Record<string, unknown>;
}

/**
 * Upload progress tracking
 */
export interface UploadProgress {
  /** Upload ID */
  uploadId: string;

  /** File name */
  fileName: string;

  /** Total file size */
  totalSize: number;

  /** Bytes uploaded */
  uploadedSize: number;

  /** Upload percentage (0-100) */
  percentage: number;

  /** Upload speed in bytes/second */
  speed: number;

  /** Estimated time remaining in seconds */
  remainingTime: number;

  /** Upload status */
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'failed' | 'cancelled';

  /** Error message if failed */
  error?: string;

  /** Chunk index (for chunked uploads) */
  currentChunk?: number;

  /** Total chunks */
  totalChunks?: number;
}

/**
 * Chunked upload session
 */
export interface ChunkedUploadSession {
  /** Session ID */
  sessionId: string;

  /** File name */
  fileName: string;

  /** Total file size */
  totalSize: number;

  /** Chunk size in bytes */
  chunkSize: number;

  /** Total number of chunks */
  totalChunks: number;

  /** Uploaded chunks */
  uploadedChunks: number[];

  /** Upload started */
  startedAt: Date;

  /** Last chunk uploaded */
  lastChunkAt?: Date;

  /** Session expires at */
  expiresAt: Date;

  /** File metadata */
  metadata: Partial<DocumentMetadata>;
}
