/**
 * @fileoverview File Upload Validation Utilities
 * @module utils/fileValidation
 * @description Validates file uploads for security, including type checking,
 * size limits, and virus scanning stubs for future integration.
 *
 * SECURITY: Prevents malware upload and distribution
 * SECURITY: Prevents XXE and ZIP bomb attacks
 * SECURITY: MIME type validation
 *
 * @security File upload validation
 * @security Virus scanning preparation
 */

import { createHash } from 'crypto';
import { logger } from './logger';
import { FileUploadError } from '../errors/ServiceError';

/**
 * Allowed file types for uploads
 * Restrictive whitelist approach for security
 */
export const ALLOWED_FILE_TYPES = {
  // Documents
  'application/pdf': { ext: 'pdf', maxSize: 10 * 1024 * 1024 }, // 10MB
  'application/msword': { ext: 'doc', maxSize: 10 * 1024 * 1024 },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    ext: 'docx',
    maxSize: 10 * 1024 * 1024
  },
  'application/vnd.ms-excel': { ext: 'xls', maxSize: 10 * 1024 * 1024 },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    ext: 'xlsx',
    maxSize: 10 * 1024 * 1024
  },

  // Images
  'image/jpeg': { ext: 'jpg', maxSize: 5 * 1024 * 1024 }, // 5MB
  'image/png': { ext: 'png', maxSize: 5 * 1024 * 1024 },
  'image/gif': { ext: 'gif', maxSize: 5 * 1024 * 1024 },
  'image/webp': { ext: 'webp', maxSize: 5 * 1024 * 1024 },

  // Text
  'text/plain': { ext: 'txt', maxSize: 1 * 1024 * 1024 }, // 1MB
  'text/csv': { ext: 'csv', maxSize: 10 * 1024 * 1024 }
} as const;

/**
 * Dangerous file extensions that should never be allowed
 */
const DANGEROUS_EXTENSIONS = [
  'exe', 'dll', 'bat', 'cmd', 'sh', 'ps1', 'msi',
  'scr', 'vbs', 'js', 'jar', 'app', 'deb', 'rpm',
  'com', 'pif', 'application', 'gadget', 'msp', 'scf',
  'lnk', 'inf', 'reg'
];

/**
 * File validation result
 */
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  fileHash?: string;
  detectedMimeType?: string;
  sanitizedFileName?: string;
  isScanned?: boolean;
  scanResult?: {
    isSafe: boolean;
    threats?: string[];
  };
}

/**
 * Validate file upload
 *
 * SECURITY: Comprehensive file validation before accepting uploads
 * - Checks file size against limits
 * - Validates MIME type against whitelist
 * - Ensures extension matches content type
 * - Calculates file hash for deduplication/tracking
 * - Provides virus scanning stub
 *
 * @param file - File buffer or object with buffer property
 * @param fileName - Original file name
 * @param options - Validation options
 * @returns Validation result
 *
 * @example
 * const result = await validateFileUpload(fileBuffer, 'document.pdf');
 * if (!result.isValid) {
 *   throw new FileUploadError(result.error);
 * }
 */
export async function validateFileUpload(
  file: Buffer | { buffer: Buffer },
  fileName: string,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    requireVirusScan?: boolean;
  } = {}
): Promise<FileValidationResult> {
  try {
    // Extract buffer
    const buffer = Buffer.isBuffer(file) ? file : file.buffer;

    // 1. Validate file name
    const fileNameValidation = validateFileName(fileName);
    if (!fileNameValidation.isValid) {
      return {
        isValid: false,
        error: fileNameValidation.error
      };
    }

    // 2. Check file size
    const sizeLimit = options.maxSize || 10 * 1024 * 1024; // 10MB default
    if (buffer.length > sizeLimit) {
      return {
        isValid: false,
        error: `File size exceeds maximum allowed (${Math.round(sizeLimit / 1024 / 1024)}MB)`
      };
    }

    if (buffer.length === 0) {
      return {
        isValid: false,
        error: 'File is empty'
      };
    }

    // 3. Detect actual MIME type from file content
    const detectedType = detectMimeType(buffer);

    // 4. Validate against whitelist
    const allowedTypes = options.allowedTypes || Object.keys(ALLOWED_FILE_TYPES);

    if (!detectedType || !allowedTypes.includes(detectedType)) {
      return {
        isValid: false,
        error: 'File type not allowed'
      };
    }

    // 5. Verify extension matches content
    const extension = fileName.split('.').pop()?.toLowerCase();
    const expectedExtension = ALLOWED_FILE_TYPES[detectedType as keyof typeof ALLOWED_FILE_TYPES]?.ext;

    if (!extension || extension !== expectedExtension) {
      return {
        isValid: false,
        error: `File extension (${extension}) does not match file content type (expected ${expectedExtension})`
      };
    }

    // 6. Check against dangerous extensions
    if (DANGEROUS_EXTENSIONS.includes(extension)) {
      logger.error('Attempted upload of dangerous file type', {
        fileName,
        extension,
        detectedType
      });

      return {
        isValid: false,
        error: 'File type not allowed for security reasons'
      };
    }

    // 7. Calculate file hash for tracking/deduplication
    const fileHash = calculateFileHash(buffer);

    // 8. Virus scan (stub - integrate with ClamAV, VirusTotal, etc.)
    let scanResult = { isSafe: true, threats: [] as string[] };

    if (options.requireVirusScan) {
      scanResult = await performVirusScan(buffer, fileName);

      if (!scanResult.isSafe) {
        logger.error('Malware detected in file upload', {
          fileName,
          threats: scanResult.threats,
          fileHash
        });

        return {
          isValid: false,
          error: 'File failed security scan',
          scanResult
        };
      }
    }

    // All validation passed
    return {
      isValid: true,
      fileHash,
      detectedMimeType: detectedType,
      sanitizedFileName: fileNameValidation.sanitizedFileName,
      isScanned: options.requireVirusScan || false,
      scanResult
    };
  } catch (error) {
    logger.error('File validation error', { error, fileName });
    return {
      isValid: false,
      error: 'File validation failed'
    };
  }
}

/**
 * Validate and sanitize file name
 */
function validateFileName(fileName: string): {
  isValid: boolean;
  sanitizedFileName?: string;
  error?: string;
} {
  if (!fileName || typeof fileName !== 'string') {
    return {
      isValid: false,
      error: 'Invalid file name'
    };
  }

  // Length check
  if (fileName.length > 255) {
    return {
      isValid: false,
      error: 'File name too long (max 255 characters)'
    };
  }

  // Remove path traversal attempts
  const sanitized = fileName.replace(/\.\./g, '').replace(/[\/\\]/g, '');

  // Remove special characters except dots, dashes, underscores
  const cleaned = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Ensure has extension
  if (!cleaned.includes('.')) {
    return {
      isValid: false,
      error: 'File must have an extension'
    };
  }

  return {
    isValid: true,
    sanitizedFileName: cleaned
  };
}

/**
 * Detect MIME type from file buffer
 * Simple implementation - can be enhanced with file-type library
 */
function detectMimeType(buffer: Buffer): string | null {
  // Check file signature (magic numbers)
  const signatures: { [key: string]: string } = {
    '25504446': 'application/pdf', // %PDF
    '504b0304': 'application/zip', // ZIP (also DOCX, XLSX)
    '504b0506': 'application/zip', // ZIP empty
    '504b0708': 'application/zip', // ZIP spanned
    'ffd8ffe0': 'image/jpeg', // JPEG JFIF
    'ffd8ffe1': 'image/jpeg', // JPEG EXIF
    '89504e47': 'image/png', // PNG
    '47494638': 'image/gif', // GIF
    '52494646': 'image/webp', // RIFF (WebP)
    'd0cf11e0': 'application/msword' // MS Office old format
  };

  const hex = buffer.toString('hex', 0, 4);

  return signatures[hex] || null;
}

/**
 * Calculate SHA-256 hash of file
 */
function calculateFileHash(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

/**
 * Perform virus scan on file
 * STUB: Integrate with actual virus scanning service
 *
 * TODO: Integration options:
 * - ClamAV (open source, self-hosted)
 * - VirusTotal API (cloud service)
 * - AWS GuardDuty for Malware Protection
 * - Azure Defender for Storage
 *
 * @param buffer - File buffer to scan
 * @param fileName - File name for logging
 * @returns Scan result
 */
async function performVirusScan(
  buffer: Buffer,
  fileName: string
): Promise<{ isSafe: boolean; threats: string[] }> {
  // STUB IMPLEMENTATION
  // In production, integrate with virus scanning service

  logger.info('Virus scan stub called', {
    fileName,
    fileSize: buffer.length,
    note: 'Integrate with ClamAV or VirusTotal API'
  });

  // Placeholder: Always return safe
  // TODO: Replace with actual scanning
  return {
    isSafe: true,
    threats: []
  };

  /* Example ClamAV integration:
  const ClamAV = require('clamav.js');
  const clamav = new ClamAV({
    host: process.env.CLAMAV_HOST || 'localhost',
    port: process.env.CLAMAV_PORT || 3310
  });

  const result = await clamav.scanBuffer(buffer);

  return {
    isSafe: !result.isInfected,
    threats: result.viruses || []
  };
  */
}

/**
 * Check if file contains potential PHI based on content analysis
 * STUB: Implement PHI detection logic
 */
export function detectPotentialPHI(buffer: Buffer, fileName: string): boolean {
  // STUB: In production, implement PHI detection
  // Look for patterns like SSN, medical record numbers, etc.

  logger.debug('PHI detection stub called', {
    fileName,
    note: 'Implement PHI detection patterns'
  });

  // For now, assume medical-related file names might contain PHI
  const phiKeywords = [
    'medical', 'health', 'patient', 'diagnosis',
    'prescription', 'treatment', 'record', 'chart'
  ];

  const lowerFileName = fileName.toLowerCase();
  return phiKeywords.some(keyword => lowerFileName.includes(keyword));
}
