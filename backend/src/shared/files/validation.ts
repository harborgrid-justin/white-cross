/**
 * WC-GEN-310 | validation.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: crypto, path
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, functions | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * File validation and security utilities
 * 
 * Provides utilities for file type validation, secure filename generation,
 * file integrity checking, and metadata extraction.
 */

import * as crypto from 'crypto';
import * as path from 'path';

export interface DocumentMetadata {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  extension: string;
  hash: string;
  uploadDate: Date;
  isSecure: boolean;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  detectedMimeType?: string;
}

// MIME types allowed for healthcare documents
const ALLOWED_MIME_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
  'application/rtf',
  
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/webp',
  
  // Medical formats
  'application/dicom',
  'application/hl7-v2',
  'application/fhir+json',
  'application/fhir+xml',
  
  // Archives (for bulk uploads)
  'application/zip',
  'application/x-zip-compressed'
];

// File extensions mapped to MIME types
const EXTENSION_MIME_MAP: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.rtf': 'application/rtf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
  '.webp': 'image/webp',
  '.dcm': 'application/dicom',
  '.hl7': 'application/hl7-v2',
  '.zip': 'application/zip'
};

/**
 * Validate file type against allowed types
 * 
 * @param filename - Name of the file
 * @param allowedTypes - Array of allowed MIME types (optional, uses default healthcare types)
 * @param fileBuffer - File buffer for magic number validation (optional)
 * @returns FileValidationResult with validation details
 */
export function validateFileType(
  filename: string, 
  allowedTypes: string[] = ALLOWED_MIME_TYPES,
  fileBuffer?: Buffer
): FileValidationResult {
  const result: FileValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!filename || typeof filename !== 'string') {
    result.isValid = false;
    result.errors.push('Filename is required');
    return result;
  }

  // Get file extension
  const extension = path.extname(filename).toLowerCase();
  if (!extension) {
    result.isValid = false;
    result.errors.push('File must have an extension');
    return result;
  }

  // Check if extension is recognized
  const expectedMimeType = EXTENSION_MIME_MAP[extension];
  if (!expectedMimeType) {
    result.isValid = false;
    result.errors.push(`File extension '${extension}' is not supported`);
    return result;
  }

  // Check if MIME type is allowed
  if (!allowedTypes.includes(expectedMimeType)) {
    result.isValid = false;
    result.errors.push(`File type '${expectedMimeType}' is not allowed`);
    return result;
  }

  result.detectedMimeType = expectedMimeType;

  // Magic number validation if buffer is provided
  if (fileBuffer && fileBuffer.length > 0) {
    const detectedType = detectMimeTypeFromBuffer(fileBuffer);
    if (detectedType && detectedType !== expectedMimeType) {
      result.warnings.push(`File extension suggests '${expectedMimeType}' but content appears to be '${detectedType}'`);
    }
  }

  // Additional security checks
  const suspiciousPatterns = [
    /\.(exe|bat|cmd|scr|pif|com)$/i,
    /\.(js|vbs|jar|app)$/i,
    /\.(php|asp|jsp|cgi)$/i
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(filename)) {
      result.isValid = false;
      result.errors.push('File type is potentially dangerous and not allowed');
      break;
    }
  }

  return result;
}

/**
 * Generate secure filename for storage
 * 
 * @param originalName - Original filename
 * @param prefix - Optional prefix for the filename
 * @returns Secure filename with timestamp and random component
 */
export function generateSecureFilename(originalName: string, prefix?: string): string {
  if (!originalName || typeof originalName !== 'string') {
    originalName = 'unnamed_file';
  }

  // Sanitize original name
  const sanitizedName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .substring(0, 50); // Limit length

  // Extract extension
  const extension = path.extname(sanitizedName).toLowerCase();
  const nameWithoutExt = path.basename(sanitizedName, extension);

  // Generate timestamp
  const timestamp = new Date().toISOString()
    .replace(/[^0-9]/g, '') // Remove non-digits
    .substring(0, 14); // YYYYMMDDHHMMSS

  // Generate random component
  const randomBytes = crypto.randomBytes(8);
  const randomHex = randomBytes.toString('hex');

  // Build secure filename
  const parts = [
    prefix,
    timestamp,
    nameWithoutExt,
    randomHex
  ].filter(Boolean);

  return `${parts.join('_')}${extension}`;
}

/**
 * Calculate file hash for integrity verification
 * 
 * @param buffer - File buffer
 * @param algorithm - Hash algorithm (default: sha256)
 * @returns Hash string
 */
export function calculateFileHash(buffer: Buffer, algorithm: string = 'sha256'): string {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid buffer provided');
  }

  const hash = crypto.createHash(algorithm);
  hash.update(buffer);
  return hash.digest('hex');
}

/**
 * Extract document metadata from file
 * 
 * @param file - File object with buffer and metadata
 * @returns DocumentMetadata object
 */
export function extractDocumentMetadata(file: {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
}): DocumentMetadata {
  const secureFilename = generateSecureFilename(file.originalname, 'doc');
  const hash = calculateFileHash(file.buffer);
  const extension = path.extname(file.originalname).toLowerCase();

  // Validate file security
  const validation = validateFileType(file.originalname);
  const isSecure = validation.isValid && validation.errors.length === 0;

  return {
    filename: secureFilename,
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    extension,
    hash,
    uploadDate: new Date(),
    isSecure
  };
}

/**
 * Check if file size is within acceptable limits
 * 
 * @param size - File size in bytes
 * @param maxSize - Maximum allowed size (default: 10MB)
 * @returns boolean indicating if size is acceptable
 */
export function validateFileSize(size: number, maxSize: number = 10 * 1024 * 1024): boolean {
  return typeof size === 'number' && size > 0 && size <= maxSize;
}

/**
 * Detect MIME type from file buffer using magic numbers
 * 
 * @param buffer - File buffer
 * @returns Detected MIME type or null if unknown
 */
function detectMimeTypeFromBuffer(buffer: Buffer): string | null {
  if (!buffer || buffer.length < 4) {
    return null;
  }

  // Check magic numbers
  const magicNumbers: { [key: string]: string } = {
    '25504446': 'application/pdf', // %PDF
    'D0CF11E0': 'application/msword', // MS Office
    '504B0304': 'application/zip', // ZIP/DOCX/XLSX
    'FFD8FFE0': 'image/jpeg', // JPEG
    'FFD8FFE1': 'image/jpeg', // JPEG
    '89504E47': 'image/png', // PNG
    '47494638': 'image/gif', // GIF
    '424D': 'image/bmp', // BMP
    '49492A00': 'image/tiff', // TIFF
    '4D4D002A': 'image/tiff', // TIFF
    '52494646': 'image/webp' // RIFF (WebP)
  };

  // Check first 8 bytes
  const hex = buffer.subarray(0, 8).toString('hex').toUpperCase();
  
  for (const [magic, mimeType] of Object.entries(magicNumbers)) {
    if (hex.startsWith(magic)) {
      return mimeType;
    }
  }

  return null;
}

/**
 * Generate file upload path with proper directory structure
 * 
 * @param userId - ID of the user uploading the file
 * @param category - File category (medical, document, image, etc.)
 * @param filename - Secure filename
 * @returns Full upload path
 */
export function generateUploadPath(userId: string, category: string, filename: string): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  return path.join(
    'uploads',
    category,
    String(year),
    month,
    userId,
    filename
  );
}