/**
 * WF-COMP-338 | documentValidation.fileTypes.ts - File validation
 * Purpose: File type and upload validation utilities
 * Upstream: ../types/documents, ./documentValidation.types | Dependencies: Document types
 * Downstream: documentValidation.ts | Called by: Document upload components
 * Related: documentValidation.security, documentValidation.schema
 * Exports: file validation functions | Key Features: File type, size, extension validation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: File upload → Validation → Storage
 * LLM Context: File validation utilities, part of document management system
 */

/**
 * File Type and Upload Validation - Frontend
 * Client-side validation for file uploads
 * Validates file size, type, extension, and naming
 */

import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../types/domain/documents';
import { ValidationError, ValidationResult, MIN_FILE_SIZE } from './documentValidation.types';

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
