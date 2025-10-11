/**
 * Document Validation Utilities - Frontend
 * Client-side validation for document management operations
 * Mirrors backend validation logic for immediate user feedback
 */

import {
  DocumentCategory,
  DocumentStatus,
  DocumentAccessLevel,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  DEFAULT_RETENTION_YEARS,
} from '../types/documents';

// ============================================================================
// Validation Constants
// ============================================================================

export const MIN_FILE_SIZE = 1024; // 1KB
export const MAX_TITLE_LENGTH = 255;
export const MIN_TITLE_LENGTH = 3;
export const MAX_DESCRIPTION_LENGTH = 5000;
export const MAX_TAGS_COUNT = 10;
export const MAX_TAG_LENGTH = 50;
export const MIN_TAG_LENGTH = 2;
export const MAX_SHARE_RECIPIENTS = 50;

// ============================================================================
// Validation Error Types
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
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
      message: `File must be at least ${MIN_FILE_SIZE / 1024}KB`,
      code: 'FILE_TOO_SMALL',
      value: fileSize,
    };
  }

  if (fileSize > MAX_FILE_SIZE) {
    return {
      field: 'fileSize',
      message: `File must not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      code: 'FILE_TOO_LARGE',
      value: fileSize,
    };
  }

  return null;
}

/**
 * Validates file type (MIME type)
 */
export function validateFileType(file: File): ValidationError | null {
  const allowedTypes = ALLOWED_FILE_TYPES.all;

  if (!allowedTypes.includes(file.type)) {
    return {
      field: 'fileType',
      message: `File type "${file.type}" is not allowed. Allowed types: PDF, Word, Excel, Images, Text`,
      code: 'INVALID_FILE_TYPE',
      value: file.type,
    };
  }

  return null;
}

/**
 * Validates file extension matches MIME type
 */
export function validateFileExtensionMatchesMimeType(file: File): ValidationError | null {
  const fileName = file.name;
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  const fileType = file.type.toLowerCase();

  const extensionMimeMap: Record<string, string[]> = {
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

  const allowedMimeTypes = extensionMimeMap[extension];

  if (!allowedMimeTypes) {
    return {
      field: 'fileName',
      message: `File extension "${extension}" is not supported`,
      code: 'UNSUPPORTED_FILE_EXTENSION',
      value: extension,
    };
  }

  if (!allowedMimeTypes.includes(fileType)) {
    return {
      field: 'fileType',
      message: `File type "${fileType}" does not match extension "${extension}"`,
      code: 'FILE_TYPE_EXTENSION_MISMATCH',
      value: { fileName, fileType },
    };
  }

  return null;
}

/**
 * Validates file name
 */
export function validateFileName(fileName: string): ValidationError | null {
  if (!fileName || fileName.trim() === '') {
    return {
      field: 'fileName',
      message: 'File name is required',
      code: 'MISSING_FILE_NAME',
    };
  }

  if (fileName.length > 255) {
    return {
      field: 'fileName',
      message: 'File name must not exceed 255 characters',
      code: 'FILE_NAME_TOO_LONG',
      value: fileName,
    };
  }

  if (!/^[a-zA-Z0-9._\-\s]+$/.test(fileName)) {
    return {
      field: 'fileName',
      message: 'File name contains invalid characters',
      code: 'INVALID_FILE_NAME_CHARACTERS',
      value: fileName,
    };
  }

  return null;
}

/**
 * Validates complete file upload
 */
export function validateFile(file: File): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate file name
  const fileNameError = validateFileName(file.name);
  if (fileNameError) errors.push(fileNameError);

  // Validate file type
  const fileTypeError = validateFileType(file);
  if (fileTypeError) errors.push(fileTypeError);

  // Validate file size
  const fileSizeError = validateFileSize(file.size);
  if (fileSizeError) errors.push(fileSizeError);

  // Validate extension matches MIME type
  if (!fileNameError && !fileTypeError) {
    const extensionError = validateFileExtensionMatchesMimeType(file);
    if (extensionError) errors.push(extensionError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
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

  // Check for potentially malicious content
  if (/<script|<iframe|javascript:/i.test(trimmedTitle)) {
    return {
      field: 'title',
      message: 'Title contains invalid content',
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

  // Check for potentially malicious content
  if (/<script|<iframe|javascript:/i.test(trimmedDescription)) {
    return {
      field: 'description',
      message: 'Description contains invalid content',
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
      message: 'Invalid document category',
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
      message: 'Invalid access level',
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
        message: 'Tag contains invalid characters',
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
      message: 'Invalid document status',
      code: 'INVALID_STATUS',
      value: status,
    };
  }

  return null;
}

/**
 * Validates document status transition
 */
export function validateStatusTransition(
  currentStatus: DocumentStatus,
  newStatus: DocumentStatus
): ValidationError | null {
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
    [DocumentStatus.APPROVED]: [DocumentStatus.ARCHIVED, DocumentStatus.EXPIRED],
    [DocumentStatus.ARCHIVED]: [],
    [DocumentStatus.EXPIRED]: [DocumentStatus.ARCHIVED],
  };

  const allowedStatuses = validTransitions[currentStatus];

  if (!allowedStatuses.includes(newStatus)) {
    return {
      field: 'status',
      message: `Cannot transition from ${currentStatus} to ${newStatus}`,
      code: 'INVALID_STATUS_TRANSITION',
      value: { currentStatus, newStatus },
    };
  }

  return null;
}

/**
 * Validates retention date
 */
export function validateRetentionDate(
  retentionDate: Date | string,
  category: DocumentCategory
): ValidationError | null {
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

  // Check if retention date is within reasonable range
  const retentionYears = DEFAULT_RETENTION_YEARS[category];
  const maxRetentionDate = new Date();
  maxRetentionDate.setFullYear(maxRetentionDate.getFullYear() + retentionYears + 1);

  if (date > maxRetentionDate) {
    return {
      field: 'retentionDate',
      message: `Retention date exceeds recommended ${retentionYears} years for this category`,
      code: 'RETENTION_DATE_TOO_FAR',
      value: retentionDate,
    };
  }

  return null;
}

/**
 * Calculates default retention date
 */
export function calculateDefaultRetentionDate(
  category: DocumentCategory,
  createdAt: Date = new Date()
): Date {
  const retentionYears = DEFAULT_RETENTION_YEARS[category];
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
export function validateDocumentCanBeSigned(
  status: DocumentStatus,
  retentionDate?: string
): ValidationError | null {
  if (status === DocumentStatus.ARCHIVED || status === DocumentStatus.EXPIRED) {
    return {
      field: 'status',
      message: `Documents with status ${status} cannot be signed`,
      code: 'DOCUMENT_NOT_SIGNABLE',
      value: status,
    };
  }

  if (retentionDate) {
    const date = new Date(retentionDate);
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
export function validateDocumentCanBeDeleted(
  status: DocumentStatus,
  category: DocumentCategory
): ValidationError | null {
  if (
    status === DocumentStatus.APPROVED &&
    (category === DocumentCategory.MEDICAL_RECORD ||
      category === DocumentCategory.INCIDENT_REPORT)
  ) {
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
      message: 'Signature data is too large',
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
      message: 'At least one user must be specified',
      code: 'MISSING_SHARE_RECIPIENTS',
    });
  } else if (sharedWith.length > MAX_SHARE_RECIPIENTS) {
    errors.push({
      field: 'sharedWith',
      message: `Cannot share with more than ${MAX_SHARE_RECIPIENTS} users at once`,
      code: 'TOO_MANY_SHARE_RECIPIENTS',
      value: sharedWith.length,
    });
  }

  // Check for duplicates
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
// Combined Validation Functions
// ============================================================================

/**
 * Validates complete document creation
 */
export function validateDocumentCreation(data: {
  title: string;
  description?: string;
  category: string;
  file: File;
  tags?: string[];
  accessLevel?: string;
}): ValidationResult {
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

  // Validate file
  const fileValidation = validateFile(data.file);
  errors.push(...fileValidation.errors);

  // Validate tags
  const tagErrors = validateDocumentTags(data.tags);
  errors.push(...tagErrors);

  // Validate access level
  if (data.accessLevel) {
    const accessLevelError = validateAccessLevel(data.accessLevel);
    if (accessLevelError) errors.push(accessLevelError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates document update
 */
export function validateDocumentUpdate(
  currentStatus: DocumentStatus,
  category: DocumentCategory,
  updateData: {
    title?: string;
    description?: string;
    status?: string;
    tags?: string[];
    retentionDate?: Date | string;
    accessLevel?: string;
  }
): ValidationResult {
  const errors: ValidationError[] = [];

  // Check if document can be edited
  if (Object.keys(updateData).length > 0 && updateData.status !== DocumentStatus.ARCHIVED) {
    const editableError = validateDocumentCanBeEdited(currentStatus);
    if (editableError && updateData.title) {
      errors.push(editableError);
    }
  }

  // Validate title
  if (updateData.title) {
    const titleError = validateDocumentTitle(updateData.title);
    if (titleError) errors.push(titleError);
  }

  // Validate description
  if (updateData.description !== undefined) {
    const descriptionError = validateDocumentDescription(updateData.description);
    if (descriptionError) errors.push(descriptionError);
  }

  // Validate status transition
  if (updateData.status) {
    const statusError = validateDocumentStatus(updateData.status);
    if (statusError) {
      errors.push(statusError);
    } else {
      const transitionError = validateStatusTransition(
        currentStatus,
        updateData.status as DocumentStatus
      );
      if (transitionError) errors.push(transitionError);
    }
  }

  // Validate tags
  if (updateData.tags) {
    const tagErrors = validateDocumentTags(updateData.tags);
    errors.push(...tagErrors);
  }

  // Validate retention date
  if (updateData.retentionDate) {
    const retentionError = validateRetentionDate(updateData.retentionDate, category);
    if (retentionError) errors.push(retentionError);
  }

  // Validate access level
  if (updateData.accessLevel) {
    const accessLevelError = validateAccessLevel(updateData.accessLevel);
    if (accessLevelError) errors.push(accessLevelError);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map(error => error.message).join(', ');
}

/**
 * Gets first validation error message
 */
export function getFirstErrorMessage(errors: ValidationError[]): string {
  return errors.length > 0 ? errors[0].message : '';
}

/**
 * Checks if category requires signature
 */
export function categoryRequiresSignature(category: DocumentCategory): boolean {
  const signatureRequired = [
    DocumentCategory.MEDICAL_RECORD,
    DocumentCategory.CONSENT_FORM,
    DocumentCategory.INCIDENT_REPORT,
  ];
  return signatureRequired.includes(category);
}
