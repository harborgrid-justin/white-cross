/**
 * LOC: D77590BD9B
 * WC-GEN-344 | documentValidation.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-344 | documentValidation.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../database/types/enums | Dependencies: ../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, interfaces, constants, functions | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Document Validation Utilities
 * Comprehensive validation for document management operations
 * Ensures HIPAA compliance, data integrity, and business rule enforcement
 */

import { DocumentCategory, DocumentStatus, DocumentAccessLevel } from '../database/types/enums';

// ============================================================================
// File Validation Constants
// ============================================================================

/**
 * Allowed MIME types by category
 */
export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
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
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
  all: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'text/plain',
    'text/csv',
  ],
};

/**
 * File extension to MIME type mapping
 */
export const FILE_EXTENSION_MIME_MAP: Record<string, string[]> = {
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  '.xls': ['application/vnd.ms-excel'],
  '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  '.txt': ['text/plain'],
  '.csv': ['text/csv'],
  '.jpg': ['image/jpeg', 'image/jpg'],
  '.jpeg': ['image/jpeg', 'image/jpg'],
  '.png': ['image/png'],
  '.gif': ['image/gif'],
  '.webp': ['image/webp'],
};

/**
 * Maximum file size (50MB)
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Minimum file size (1KB - prevent empty files)
 */
export const MIN_FILE_SIZE = 1024;

/**
 * Maximum title length
 */
export const MAX_TITLE_LENGTH = 255;

/**
 * Minimum title length
 */
export const MIN_TITLE_LENGTH = 3;

/**
 * Maximum description length
 */
export const MAX_DESCRIPTION_LENGTH = 5000;

/**
 * Maximum number of tags
 */
export const MAX_TAGS_COUNT = 10;

/**
 * Maximum tag length
 */
export const MAX_TAG_LENGTH = 50;

/**
 * Minimum tag length
 */
export const MIN_TAG_LENGTH = 2;

/**
 * Document retention years by category
 */
export const RETENTION_YEARS: Record<DocumentCategory, number> = {
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

/**
 * Categories that require signatures
 */
export const SIGNATURE_REQUIRED_CATEGORIES: DocumentCategory[] = [
  DocumentCategory.MEDICAL_RECORD,
  DocumentCategory.CONSENT_FORM,
  DocumentCategory.INCIDENT_REPORT,
];

// ============================================================================
// Validation Error Types
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export class DocumentValidationError extends Error {
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Document validation failed');
    this.name = 'DocumentValidationError';
    this.errors = errors;
  }
}

// ============================================================================
// File Upload Validation
// ============================================================================

/**
 * Validates file size
 */
export function validateFileSize(fileSize: number): ValidationError | null {
  if (fileSize < MIN_FILE_SIZE) {
    return {
      field: 'fileSize',
      message: `File size must be at least ${MIN_FILE_SIZE / 1024}KB`,
      code: 'FILE_TOO_SMALL',
      value: fileSize,
    };
  }

  if (fileSize > MAX_FILE_SIZE) {
    return {
      field: 'fileSize',
      message: `File size must not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      code: 'FILE_TOO_LARGE',
      value: fileSize,
    };
  }

  return null;
}

/**
 * Validates file type (MIME type)
 */
export function validateFileType(fileType: string, allowedTypes: string[] = ALLOWED_MIME_TYPES.all): ValidationError | null {
  if (!fileType || fileType.trim() === '') {
    return {
      field: 'fileType',
      message: 'File type is required',
      code: 'MISSING_FILE_TYPE',
    };
  }

  const normalizedFileType = fileType.toLowerCase().trim();

  if (!allowedTypes.includes(normalizedFileType)) {
    return {
      field: 'fileType',
      message: `File type "${fileType}" is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      code: 'INVALID_FILE_TYPE',
      value: fileType,
    };
  }

  return null;
}

/**
 * Validates that file extension matches MIME type
 */
export function validateFileExtensionMatchesMimeType(fileName: string, fileType: string): ValidationError | null {
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  const normalizedFileType = fileType.toLowerCase().trim();

  const allowedMimeTypes = FILE_EXTENSION_MIME_MAP[extension];

  if (!allowedMimeTypes) {
    return {
      field: 'fileName',
      message: `File extension "${extension}" is not supported`,
      code: 'UNSUPPORTED_FILE_EXTENSION',
      value: extension,
    };
  }

  if (!allowedMimeTypes.includes(normalizedFileType)) {
    return {
      field: 'fileType',
      message: `File type "${fileType}" does not match extension "${extension}". Expected: ${allowedMimeTypes.join(', ')}`,
      code: 'FILE_TYPE_EXTENSION_MISMATCH',
      value: { fileName, fileType },
    };
  }

  return null;
}

/**
 * Validates complete file upload
 */
export function validateFileUpload(fileName: string, fileType: string, fileSize: number): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate file name
  if (!fileName || fileName.trim() === '') {
    errors.push({
      field: 'fileName',
      message: 'File name is required',
      code: 'MISSING_FILE_NAME',
    });
  } else if (fileName.length > 255) {
    errors.push({
      field: 'fileName',
      message: 'File name must not exceed 255 characters',
      code: 'FILE_NAME_TOO_LONG',
      value: fileName,
    });
  } else if (!/^[a-zA-Z0-9._\-\s]+$/.test(fileName)) {
    errors.push({
      field: 'fileName',
      message: 'File name contains invalid characters. Only letters, numbers, spaces, dots, hyphens, and underscores are allowed',
      code: 'INVALID_FILE_NAME_CHARACTERS',
      value: fileName,
    });
  }

  // Validate file type
  const fileTypeError = validateFileType(fileType);
  if (fileTypeError) errors.push(fileTypeError);

  // Validate file size
  const fileSizeError = validateFileSize(fileSize);
  if (fileSizeError) errors.push(fileSizeError);

  // Validate extension matches MIME type
  if (fileName && fileType) {
    const extensionError = validateFileExtensionMatchesMimeType(fileName, fileType);
    if (extensionError) errors.push(extensionError);
  }

  return errors;
}

// ============================================================================
// Document Metadata Validation
// ============================================================================

/**
 * Validates document title
 */
export function validateDocumentTitle(title: string): ValidationError | null {
  if (!title || title.trim() === '') {
    return {
      field: 'title',
      message: 'Document title is required',
      code: 'MISSING_TITLE',
    };
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length < MIN_TITLE_LENGTH) {
    return {
      field: 'title',
      message: `Title must be at least ${MIN_TITLE_LENGTH} characters`,
      code: 'TITLE_TOO_SHORT',
      value: trimmedTitle,
    };
  }

  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    return {
      field: 'title',
      message: `Title must not exceed ${MAX_TITLE_LENGTH} characters`,
      code: 'TITLE_TOO_LONG',
      value: trimmedTitle,
    };
  }

  // Check for special characters that could cause issues
  if (/<script|<iframe|javascript:/i.test(trimmedTitle)) {
    return {
      field: 'title',
      message: 'Title contains potentially malicious content',
      code: 'INVALID_TITLE_CONTENT',
      value: trimmedTitle,
    };
  }

  return null;
}

/**
 * Validates document description
 */
export function validateDocumentDescription(description: string | undefined): ValidationError | null {
  if (!description) return null; // Description is optional

  const trimmedDescription = description.trim();

  if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
    return {
      field: 'description',
      message: `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`,
      code: 'DESCRIPTION_TOO_LONG',
      value: trimmedDescription,
    };
  }

  // Check for malicious content
  if (/<script|<iframe|javascript:/i.test(trimmedDescription)) {
    return {
      field: 'description',
      message: 'Description contains potentially malicious content',
      code: 'INVALID_DESCRIPTION_CONTENT',
      value: trimmedDescription,
    };
  }

  return null;
}

/**
 * Validates document category
 */
export function validateDocumentCategory(category: string): ValidationError | null {
  if (!category) {
    return {
      field: 'category',
      message: 'Document category is required',
      code: 'MISSING_CATEGORY',
    };
  }

  if (!Object.values(DocumentCategory).includes(category as DocumentCategory)) {
    return {
      field: 'category',
      message: `Invalid document category. Allowed values: ${Object.values(DocumentCategory).join(', ')}`,
      code: 'INVALID_CATEGORY',
      value: category,
    };
  }

  return null;
}

/**
 * Validates document access level
 */
export function validateAccessLevel(accessLevel: string): ValidationError | null {
  if (!accessLevel) {
    return {
      field: 'accessLevel',
      message: 'Access level is required',
      code: 'MISSING_ACCESS_LEVEL',
    };
  }

  if (!Object.values(DocumentAccessLevel).includes(accessLevel as DocumentAccessLevel)) {
    return {
      field: 'accessLevel',
      message: `Invalid access level. Allowed values: ${Object.values(DocumentAccessLevel).join(', ')}`,
      code: 'INVALID_ACCESS_LEVEL',
      value: accessLevel,
    };
  }

  return null;
}

/**
 * Validates document tags
 */
export function validateDocumentTags(tags: string[] | undefined): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!tags || tags.length === 0) return errors; // Tags are optional

  if (tags.length > MAX_TAGS_COUNT) {
    errors.push({
      field: 'tags',
      message: `Maximum of ${MAX_TAGS_COUNT} tags allowed`,
      code: 'TOO_MANY_TAGS',
      value: tags.length,
    });
  }

  tags.forEach((tag, index) => {
    const trimmedTag = tag.trim();

    if (trimmedTag.length < MIN_TAG_LENGTH) {
      errors.push({
        field: `tags[${index}]`,
        message: `Tag must be at least ${MIN_TAG_LENGTH} characters`,
        code: 'TAG_TOO_SHORT',
        value: trimmedTag,
      });
    }

    if (trimmedTag.length > MAX_TAG_LENGTH) {
      errors.push({
        field: `tags[${index}]`,
        message: `Tag must not exceed ${MAX_TAG_LENGTH} characters`,
        code: 'TAG_TOO_LONG',
        value: trimmedTag,
      });
    }

    if (!/^[a-zA-Z0-9\-_\s]+$/.test(trimmedTag)) {
      errors.push({
        field: `tags[${index}]`,
        message: 'Tag contains invalid characters. Only letters, numbers, spaces, hyphens, and underscores are allowed',
        code: 'INVALID_TAG_CHARACTERS',
        value: trimmedTag,
      });
    }
  });

  // Check for duplicate tags
  const uniqueTags = new Set(tags.map(t => t.trim().toLowerCase()));
  if (uniqueTags.size < tags.length) {
    errors.push({
      field: 'tags',
      message: 'Duplicate tags are not allowed',
      code: 'DUPLICATE_TAGS',
    });
  }

  return errors;
}

// ============================================================================
// Document Lifecycle Validation
// ============================================================================

/**
 * Validates document status
 */
export function validateDocumentStatus(status: string): ValidationError | null {
  if (!status) {
    return {
      field: 'status',
      message: 'Document status is required',
      code: 'MISSING_STATUS',
    };
  }

  if (!Object.values(DocumentStatus).includes(status as DocumentStatus)) {
    return {
      field: 'status',
      message: `Invalid document status. Allowed values: ${Object.values(DocumentStatus).join(', ')}`,
      code: 'INVALID_STATUS',
      value: status,
    };
  }

  return null;
}

/**
 * Validates document status transition
 */
export function validateStatusTransition(currentStatus: DocumentStatus, newStatus: DocumentStatus): ValidationError | null {
  const validTransitions: Record<DocumentStatus, DocumentStatus[]> = {
    [DocumentStatus.DRAFT]: [
      DocumentStatus.PENDING_REVIEW,
      DocumentStatus.APPROVED,
      DocumentStatus.ARCHIVED,
    ],
    [DocumentStatus.PENDING_REVIEW]: [
      DocumentStatus.DRAFT,
      DocumentStatus.APPROVED,
      DocumentStatus.ARCHIVED,
    ],
    [DocumentStatus.APPROVED]: [
      DocumentStatus.ARCHIVED,
      DocumentStatus.EXPIRED,
    ],
    [DocumentStatus.ARCHIVED]: [
      // Archived documents cannot change status
    ],
    [DocumentStatus.EXPIRED]: [
      DocumentStatus.ARCHIVED,
    ],
  };

  const allowedStatuses = validTransitions[currentStatus];

  if (!allowedStatuses.includes(newStatus)) {
    return {
      field: 'status',
      message: `Cannot transition from ${currentStatus} to ${newStatus}. Allowed transitions: ${allowedStatuses.join(', ') || 'none'}`,
      code: 'INVALID_STATUS_TRANSITION',
      value: { currentStatus, newStatus },
    };
  }

  return null;
}

/**
 * Validates retention date
 */
export function validateRetentionDate(retentionDate: Date | string, category: DocumentCategory): ValidationError | null {
  if (!retentionDate) return null; // Retention date is optional

  const date = typeof retentionDate === 'string' ? new Date(retentionDate) : retentionDate;

  if (isNaN(date.getTime())) {
    return {
      field: 'retentionDate',
      message: 'Invalid retention date format',
      code: 'INVALID_RETENTION_DATE',
      value: retentionDate,
    };
  }

  const now = new Date();
  if (date < now) {
    return {
      field: 'retentionDate',
      message: 'Retention date cannot be in the past',
      code: 'RETENTION_DATE_IN_PAST',
      value: retentionDate,
    };
  }

  // Check if retention date is within reasonable range based on category
  const retentionYears = RETENTION_YEARS[category];
  const maxRetentionDate = new Date();
  maxRetentionDate.setFullYear(maxRetentionDate.getFullYear() + retentionYears + 1); // Allow 1 year buffer

  if (date > maxRetentionDate) {
    return {
      field: 'retentionDate',
      message: `Retention date exceeds recommended retention period of ${retentionYears} years for ${category} category`,
      code: 'RETENTION_DATE_TOO_FAR',
      value: retentionDate,
    };
  }

  return null;
}

/**
 * Calculates default retention date based on category
 */
export function calculateDefaultRetentionDate(category: DocumentCategory, createdAt: Date = new Date()): Date {
  const retentionYears = RETENTION_YEARS[category];
  const retentionDate = new Date(createdAt);
  retentionDate.setFullYear(retentionDate.getFullYear() + retentionYears);
  return retentionDate;
}

// ============================================================================
// Document Operation Validation
// ============================================================================

/**
 * Validates if document can be edited
 */
export function validateDocumentCanBeEdited(status: DocumentStatus): ValidationError | null {
  const editableStatuses = [DocumentStatus.DRAFT, DocumentStatus.PENDING_REVIEW];

  if (!editableStatuses.includes(status)) {
    return {
      field: 'status',
      message: `Documents with status ${status} cannot be edited`,
      code: 'DOCUMENT_NOT_EDITABLE',
      value: status,
    };
  }

  return null;
}

/**
 * Validates if document can be signed
 */
export function validateDocumentCanBeSigned(status: DocumentStatus, retentionDate: Date | string | undefined): ValidationError | null {
  // Cannot sign archived or expired documents
  if (status === DocumentStatus.ARCHIVED || status === DocumentStatus.EXPIRED) {
    return {
      field: 'status',
      message: `Documents with status ${status} cannot be signed`,
      code: 'DOCUMENT_NOT_SIGNABLE',
      value: status,
    };
  }

  // Cannot sign expired documents
  if (retentionDate) {
    const date = typeof retentionDate === 'string' ? new Date(retentionDate) : retentionDate;
    const now = new Date();

    if (date < now) {
      return {
        field: 'retentionDate',
        message: 'Expired documents cannot be signed',
        code: 'DOCUMENT_EXPIRED',
        value: retentionDate,
      };
    }
  }

  return null;
}

/**
 * Validates if document can be deleted
 */
export function validateDocumentCanBeDeleted(status: DocumentStatus, category: DocumentCategory): ValidationError | null {
  // Approved medical records cannot be deleted, only archived
  if (status === DocumentStatus.APPROVED &&
      (category === DocumentCategory.MEDICAL_RECORD ||
       category === DocumentCategory.INCIDENT_REPORT)) {
    return {
      field: 'status',
      message: `Approved ${category} documents cannot be deleted. Archive them instead.`,
      code: 'DOCUMENT_NOT_DELETABLE',
      value: { status, category },
    };
  }

  return null;
}

/**
 * Validates signature data
 */
export function validateSignatureData(
  signedBy: string,
  signedByRole: string,
  signatureData?: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!signedBy || signedBy.trim() === '') {
    errors.push({
      field: 'signedBy',
      message: 'Signer ID is required',
      code: 'MISSING_SIGNER',
    });
  }

  if (!signedByRole || signedByRole.trim() === '') {
    errors.push({
      field: 'signedByRole',
      message: 'Signer role is required',
      code: 'MISSING_SIGNER_ROLE',
    });
  } else if (signedByRole.length > 100) {
    errors.push({
      field: 'signedByRole',
      message: 'Signer role must not exceed 100 characters',
      code: 'SIGNER_ROLE_TOO_LONG',
      value: signedByRole,
    });
  }

  if (signatureData && signatureData.length > 10000) {
    errors.push({
      field: 'signatureData',
      message: 'Signature data must not exceed 10000 characters',
      code: 'SIGNATURE_DATA_TOO_LONG',
      value: signatureData.length,
    });
  }

  return errors;
}

/**
 * Validates share permissions
 */
export function validateSharePermissions(sharedWith: string[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!sharedWith || sharedWith.length === 0) {
    errors.push({
      field: 'sharedWith',
      message: 'At least one user must be specified to share with',
      code: 'MISSING_SHARE_RECIPIENTS',
    });
  } else if (sharedWith.length > 50) {
    errors.push({
      field: 'sharedWith',
      message: 'Cannot share with more than 50 users at once',
      code: 'TOO_MANY_SHARE_RECIPIENTS',
      value: sharedWith.length,
    });
  }

  // Check for duplicate user IDs
  const uniqueUsers = new Set(sharedWith);
  if (uniqueUsers.size < sharedWith.length) {
    errors.push({
      field: 'sharedWith',
      message: 'Duplicate user IDs in share list',
      code: 'DUPLICATE_SHARE_RECIPIENTS',
    });
  }

  return errors;
}

// ============================================================================
// Version Control Validation
// ============================================================================

/**
 * Validates if a new version can be created
 */
export function validateVersionCreation(
  parentStatus: DocumentStatus,
  parentVersionCount: number
): ValidationError | null {
  const maxVersions = 100; // Maximum number of versions per document

  if (parentStatus === DocumentStatus.ARCHIVED) {
    return {
      field: 'status',
      message: 'Cannot create new version of archived document',
      code: 'PARENT_ARCHIVED',
      value: parentStatus,
    };
  }

  if (parentVersionCount >= maxVersions) {
    return {
      field: 'version',
      message: `Maximum number of versions (${maxVersions}) reached`,
      code: 'MAX_VERSIONS_REACHED',
      value: parentVersionCount,
    };
  }

  return null;
}

// ============================================================================
// Combined Validation Functions
// ============================================================================

/**
 * Validates complete document creation data
 */
export function validateDocumentCreation(data: {
  title: string;
  description?: string;
  category: string;
  fileType: string;
  fileName: string;
  fileSize: number;
  tags?: string[];
  accessLevel?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate title
  const titleError = validateDocumentTitle(data.title);
  if (titleError) errors.push(titleError);

  // Validate description
  const descriptionError = validateDocumentDescription(data.description);
  if (descriptionError) errors.push(descriptionError);

  // Validate category
  const categoryError = validateDocumentCategory(data.category);
  if (categoryError) errors.push(categoryError);

  // Validate file upload
  const fileErrors = validateFileUpload(data.fileName, data.fileType, data.fileSize);
  errors.push(...fileErrors);

  // Validate tags
  const tagErrors = validateDocumentTags(data.tags);
  errors.push(...tagErrors);

  // Validate access level
  if (data.accessLevel) {
    const accessLevelError = validateAccessLevel(data.accessLevel);
    if (accessLevelError) errors.push(accessLevelError);
  }

  return errors;
}

/**
 * Validates document update data
 */
export function validateDocumentUpdate(
  currentStatus: DocumentStatus,
  updateData: {
    title?: string;
    description?: string;
    status?: string;
    tags?: string[];
    retentionDate?: Date | string;
    accessLevel?: string;
  },
  category: DocumentCategory
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check if document can be edited
  if (Object.keys(updateData).length > 0 && updateData.status !== DocumentStatus.ARCHIVED) {
    const editableError = validateDocumentCanBeEdited(currentStatus);
    if (editableError && updateData.title) {
      errors.push(editableError);
    }
  }

  // Validate title if provided
  if (updateData.title) {
    const titleError = validateDocumentTitle(updateData.title);
    if (titleError) errors.push(titleError);
  }

  // Validate description if provided
  if (updateData.description !== undefined) {
    const descriptionError = validateDocumentDescription(updateData.description);
    if (descriptionError) errors.push(descriptionError);
  }

  // Validate status transition if provided
  if (updateData.status) {
    const statusError = validateDocumentStatus(updateData.status);
    if (statusError) {
      errors.push(statusError);
    } else {
      const transitionError = validateStatusTransition(currentStatus, updateData.status as DocumentStatus);
      if (transitionError) errors.push(transitionError);
    }
  }

  // Validate tags if provided
  if (updateData.tags) {
    const tagErrors = validateDocumentTags(updateData.tags);
    errors.push(...tagErrors);
  }

  // Validate retention date if provided
  if (updateData.retentionDate) {
    const retentionError = validateRetentionDate(updateData.retentionDate, category);
    if (retentionError) errors.push(retentionError);
  }

  // Validate access level if provided
  if (updateData.accessLevel) {
    const accessLevelError = validateAccessLevel(updateData.accessLevel);
    if (accessLevelError) errors.push(accessLevelError);
  }

  return errors;
}

/**
 * Helper to throw validation error if any errors exist
 */
export function throwIfValidationErrors(errors: ValidationError[]): void {
  if (errors.length > 0) {
    throw new DocumentValidationError(errors);
  }
}
