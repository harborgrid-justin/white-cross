/**
 * WF-COMP-338 | documentValidation.operations.ts - Document operations validation
 * Purpose: Document operation permissions and constraints validation
 * Upstream: ../types/documents, ./documentValidation.types | Dependencies: Document types
 * Downstream: documentValidation.ts | Called by: Document operation handlers
 * Related: documentValidation.lifecycle, documentValidation.security
 * Exports: operation validation functions | Key Features: Edit, sign, delete permissions
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: User action → Permission check → Operation execution
 * LLM Context: Document operation validation, enforces business rules for operations
 */

/**
 * Document Operations Validation - Frontend
 * Client-side validation for document operations
 * Validates permissions for edit, sign, and delete operations
 */

import {
  DocumentCategory,
  DocumentStatus,
} from '../types/domain/documents';
import { ValidationError } from './documentValidation.types';

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
