/**
 * WF-COMP-338 | documentValidation.security.ts - Security validation
 * Purpose: Security-related validation utilities
 * Upstream: ../types/documents, ./documentValidation.types | Dependencies: Document types
 * Downstream: documentValidation.ts | Called by: Document metadata validation
 * Related: documentValidation.fileTypes, documentValidation.schema
 * Exports: security validation functions | Key Features: XSS prevention, content validation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Content input → Security validation → Storage
 * LLM Context: Security validation utilities, prevents XSS and injection attacks
 */

/**
 * Security Validation - Frontend
 * Client-side security validation for document content
 * Validates against potentially malicious content
 */

import {
  DocumentCategory,
  DocumentStatus,
  DocumentAccessLevel,
} from '../types/domain/documents';
import {
  ValidationError,
  MAX_TITLE_LENGTH,
  MIN_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_TAGS_COUNT,
  MAX_TAG_LENGTH,
  MIN_TAG_LENGTH,
  MAX_SHARE_RECIPIENTS,
} from './documentValidation.types';

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
