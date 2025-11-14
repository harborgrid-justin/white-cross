/**
 * Document Constants Module
 * Constant definitions and mappings for document types
 * Dependencies: enums.ts
 */

import {
  DocumentCategory,
  DocumentStatus,
  DocumentAccessLevel,
  DocumentAction,
} from './enums';

/**
 * Document Category Labels
 * Human-readable labels for document categories
 */
export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  [DocumentCategory.MEDICAL_RECORD]: 'Medical Record',
  [DocumentCategory.INCIDENT_REPORT]: 'Incident Report',
  [DocumentCategory.CONSENT_FORM]: 'Consent Form',
  [DocumentCategory.POLICY]: 'Policy Document',
  [DocumentCategory.TRAINING]: 'Training Materials',
  [DocumentCategory.ADMINISTRATIVE]: 'Administrative',
  [DocumentCategory.STUDENT_FILE]: 'Student File',
  [DocumentCategory.INSURANCE]: 'Insurance',
  [DocumentCategory.OTHER]: 'Other',
};

/**
 * Document Status Labels
 * Human-readable labels for document statuses
 */
export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  [DocumentStatus.DRAFT]: 'Draft',
  [DocumentStatus.PENDING_REVIEW]: 'Pending Review',
  [DocumentStatus.APPROVED]: 'Approved',
  [DocumentStatus.ARCHIVED]: 'Archived',
  [DocumentStatus.EXPIRED]: 'Expired',
};

/**
 * Document Access Level Labels
 * Human-readable labels for access levels
 */
export const DOCUMENT_ACCESS_LEVEL_LABELS: Record<DocumentAccessLevel, string> = {
  [DocumentAccessLevel.PUBLIC]: 'Public',
  [DocumentAccessLevel.STAFF_ONLY]: 'Staff Only',
  [DocumentAccessLevel.ADMIN_ONLY]: 'Admin Only',
  [DocumentAccessLevel.RESTRICTED]: 'Restricted',
};

/**
 * Document Action Labels
 * Human-readable labels for document actions
 */
export const DOCUMENT_ACTION_LABELS: Record<DocumentAction, string> = {
  [DocumentAction.CREATED]: 'Created',
  [DocumentAction.VIEWED]: 'Viewed',
  [DocumentAction.DOWNLOADED]: 'Downloaded',
  [DocumentAction.UPDATED]: 'Updated',
  [DocumentAction.DELETED]: 'Deleted',
  [DocumentAction.SHARED]: 'Shared',
  [DocumentAction.SIGNED]: 'Signed',
};

/**
 * Allowed File Types
 * MIME types allowed for document uploads by category
 */
export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
  images: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  all: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'text/csv',
  ],
};

/**
 * Maximum File Size
 * Maximum allowed file size in bytes (50MB)
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Default Retention Years
 * Default retention period by category
 */
export const DEFAULT_RETENTION_YEARS: Record<DocumentCategory, number> = {
  [DocumentCategory.MEDICAL_RECORD]: 7,
  [DocumentCategory.INCIDENT_REPORT]: 7,
  [DocumentCategory.CONSENT_FORM]: 7,
  [DocumentCategory.POLICY]: 5,
  [DocumentCategory.TRAINING]: 5,
  [DocumentCategory.ADMINISTRATIVE]: 3,
  [DocumentCategory.STUDENT_FILE]: 7,
  [DocumentCategory.INSURANCE]: 7,
  [DocumentCategory.OTHER]: 3,
};
