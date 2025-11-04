/**
 * WF-COMP-338 | documentValidation.lifecycle.ts - Document lifecycle validation
 * Purpose: Document lifecycle and status validation utilities
 * Upstream: ../types/documents, ./documentValidation.types | Dependencies: Document types
 * Downstream: documentValidation.ts | Called by: Document status management
 * Related: documentValidation.security, documentValidation.operations
 * Exports: lifecycle validation functions | Key Features: Status transitions, retention dates
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Status change → Validation → State update
 * LLM Context: Document lifecycle validation, manages status transitions and retention
 */

/**
 * Document Lifecycle Validation - Frontend
 * Client-side validation for document lifecycle operations
 * Validates status transitions and retention dates
 */

import {
  DocumentCategory,
  DocumentStatus,
  DEFAULT_RETENTION_YEARS,
} from '../types/domain/documents';
import { ValidationError } from './documentValidation.types';

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
