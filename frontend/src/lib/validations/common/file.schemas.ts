/**
 * File Upload Validation Schemas
 *
 * Reusable Zod schemas for file upload validation.
 * Includes HIPAA-compliant file type restrictions.
 */

import { z } from 'zod';

/**
 * Allowed file types for different contexts
 */
export const FILE_TYPES = {
  // Document uploads
  DOCUMENTS: ['pdf', 'doc', 'docx', 'txt', 'rtf'],

  // Image uploads
  IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],

  // Medical records (HIPAA-compliant formats only)
  MEDICAL: ['pdf', 'jpg', 'jpeg', 'png'],

  // Spreadsheets
  SPREADSHEETS: ['xls', 'xlsx', 'csv'],

  // All allowed types
  ALL: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'xls', 'xlsx', 'csv']
} as const;

/**
 * File size limits (in bytes)
 */
export const FILE_SIZE_LIMITS = {
  // Standard document (5MB)
  DOCUMENT: 5 * 1024 * 1024,

  // Image (2MB)
  IMAGE: 2 * 1024 * 1024,

  // Medical record (10MB - higher for scanned documents)
  MEDICAL: 10 * 1024 * 1024,

  // Large document (20MB)
  LARGE: 20 * 1024 * 1024
} as const;

/**
 * Base file schema with type and size validation
 */
export const fileSchema = z
  .instanceof(File, { message: 'File is required' })
  .refine((file) => file.size <= FILE_SIZE_LIMITS.DOCUMENT, {
    message: `File size must be less than ${FILE_SIZE_LIMITS.DOCUMENT / (1024 * 1024)}MB`
  });

/**
 * Optional file schema
 */
export const optionalFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= FILE_SIZE_LIMITS.DOCUMENT, {
    message: `File size must be less than ${FILE_SIZE_LIMITS.DOCUMENT / (1024 * 1024)}MB`
  })
  .optional()
  .nullable();

/**
 * Image file schema
 */
export const imageFileSchema = z
  .instanceof(File, { message: 'Image file is required' })
  .refine((file) => file.size <= FILE_SIZE_LIMITS.IMAGE, {
    message: `Image size must be less than ${FILE_SIZE_LIMITS.IMAGE / (1024 * 1024)}MB`
  })
  .refine((file) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension && FILE_TYPES.IMAGES.includes(extension);
  }, {
    message: `Only ${FILE_TYPES.IMAGES.join(', ')} files are allowed`
  });

/**
 * Medical document file schema (HIPAA-compliant)
 */
export const medicalFileSchema = z
  .instanceof(File, { message: 'Medical document is required' })
  .refine((file) => file.size <= FILE_SIZE_LIMITS.MEDICAL, {
    message: `File size must be less than ${FILE_SIZE_LIMITS.MEDICAL / (1024 * 1024)}MB`
  })
  .refine((file) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension && FILE_TYPES.MEDICAL.includes(extension);
  }, {
    message: `Only ${FILE_TYPES.MEDICAL.join(', ')} files are allowed for medical records`
  });

/**
 * Document file schema (general documents)
 */
export const documentFileSchema = z
  .instanceof(File, { message: 'Document is required' })
  .refine((file) => file.size <= FILE_SIZE_LIMITS.DOCUMENT, {
    message: `File size must be less than ${FILE_SIZE_LIMITS.DOCUMENT / (1024 * 1024)}MB`
  })
  .refine((file) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension && FILE_TYPES.DOCUMENTS.includes(extension);
  }, {
    message: `Only ${FILE_TYPES.DOCUMENTS.join(', ')} files are allowed`
  });

/**
 * Multiple files schema
 */
export const multipleFilesSchema = z
  .array(fileSchema)
  .min(1, 'At least one file is required')
  .max(10, 'Maximum 10 files allowed');

/**
 * Optional multiple files schema
 */
export const optionalMultipleFilesSchema = z
  .array(fileSchema)
  .max(10, 'Maximum 10 files allowed')
  .optional()
  .nullable();

/**
 * File metadata schema (for tracking uploaded files)
 */
export const fileMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  uploadedAt: z.string(),
  uploadedBy: z.string(),
  url: z.string().url().optional(),
  isEncrypted: z.boolean().default(false)
});

/**
 * Helper function to format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Helper function to extract file extension
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Type exports
 */
export type FileMetadata = z.infer<typeof fileMetadataSchema>;
export type MultipleFiles = z.infer<typeof multipleFilesSchema>;
