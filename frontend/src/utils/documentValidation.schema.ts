/**
 * WF-COMP-338 | documentValidation.schema.ts - Schema validation
 * Purpose: Combined schema validation for document operations
 * Upstream: All other documentValidation modules | Dependencies: All validation modules
 * Downstream: documentValidation.ts | Called by: Document forms and handlers
 * Related: All documentValidation modules
 * Exports: combined validation functions | Key Features: Complete document validation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Form submission → Schema validation → API call
 * LLM Context: Combined validation schemas for document operations
 */

/**
 * Schema Validation - Frontend
 * Combined validation functions for complete document operations
 * Orchestrates validation across multiple modules
 */

import {
  DocumentCategory,
  DocumentStatus,
} from '../types/domain/documents';
import { ValidationError, ValidationResult } from './documentValidation.types';
import { validateFile } from './documentValidation.fileTypes';
import {
  validateDocumentTitle,
  validateDocumentDescription,
  validateDocumentCategory,
  validateAccessLevel,
  validateDocumentTags,
} from './documentValidation.security';
import {
  validateDocumentStatus,
  validateStatusTransition,
  validateRetentionDate,
} from './documentValidation.lifecycle';
import {
  validateDocumentCanBeEdited,
} from './documentValidation.operations';

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
