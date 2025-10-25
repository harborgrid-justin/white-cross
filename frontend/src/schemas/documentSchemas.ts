/**
 * WF-COMP-250 | documentSchemas.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../types/documents | Dependencies: zod, ../types/documents
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, types | Key Features: arrow component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Document Validation Schemas
 * Zod schemas for document management operations
 * Matches backend Sequelize validations exactly
 */

import { z } from 'zod';
import {
  DocumentCategory,
  DocumentStatus,
  DocumentAccessLevel,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from '../types/documents';

// ============================================================================
// Constants for Validation
// ============================================================================

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const MIN_FILE_SIZE_BYTES = 1024; // 1KB
const MAX_TITLE_LENGTH = 255;
const MIN_TITLE_LENGTH = 3;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_TAGS_COUNT = 10;
const MAX_TAG_LENGTH = 50;
const MIN_TAG_LENGTH = 2;
const MAX_VERSIONS = 100;
const MAX_SHARE_RECIPIENTS = 50;

// ============================================================================
// Base Field Schemas
// ============================================================================

/**
 * UUID validation schema
 */
const uuidSchema = z.string().uuid({ message: 'Must be a valid UUID' });

/**
 * Document title validation
 */
const titleSchema = z
  .string({ message: 'Document title is required' })
  .min(MIN_TITLE_LENGTH, `Title must be at least ${MIN_TITLE_LENGTH} characters`)
  .max(MAX_TITLE_LENGTH, `Title must not exceed ${MAX_TITLE_LENGTH} characters`)
  .refine(
    (val) => !/<script|<iframe|javascript:/i.test(val),
    'Title contains potentially malicious content'
  )
  .transform((val) => val.trim());

/**
 * Document description validation
 */
const descriptionSchema = z
  .string()
  .max(MAX_DESCRIPTION_LENGTH, `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`)
  .refine(
    (val) => !/<script|<iframe|javascript:/i.test(val),
    'Description contains potentially malicious content'
  )
  .transform((val) => val.trim())
  .optional();

/**
 * Document category validation
 */
const categorySchema = z.nativeEnum(DocumentCategory, {
  error: () => ({
    message: `Category must be one of: ${Object.values(DocumentCategory).join(', ')}`,
  }),
});

/**
 * Document status validation
 */
const statusSchema = z.nativeEnum(DocumentStatus, {
  error: () => ({
    message: `Status must be one of: ${Object.values(DocumentStatus).join(', ')}`,
  }),
});

/**
 * Document access level validation
 */
const accessLevelSchema = z.nativeEnum(DocumentAccessLevel, {
  error: () => ({
    message: `Access level must be one of: ${Object.values(DocumentAccessLevel).join(', ')}`,
  }),
});

/**
 * File type (MIME type) validation
 */
const fileTypeSchema = z
  .string({ message: 'File type is required' })
  .min(1, 'File type cannot be empty')
  .refine(
    (val) => ALLOWED_FILE_TYPES.all.includes(val.toLowerCase().trim()),
    (val) => ({
      message: `Invalid file type "${val}". Allowed types: ${ALLOWED_FILE_TYPES.all.join(', ')}`,
    })
  )
  .transform((val) => val.toLowerCase().trim());

/**
 * File name validation
 */
const fileNameSchema = z
  .string({ message: 'File name is required' })
  .min(1, 'File name cannot be empty')
  .max(255, 'File name must not exceed 255 characters')
  .refine(
    (val) => /^[a-zA-Z0-9._\-\s]+$/.test(val),
    'File name contains invalid characters. Only letters, numbers, spaces, dots, hyphens, and underscores are allowed'
  )
  .transform((val) => val.trim());

/**
 * File size validation
 */
const fileSizeSchema = z
  .number({ message: 'File size is required' })
  .int('File size must be an integer')
  .min(MIN_FILE_SIZE_BYTES, `File size must be at least ${MIN_FILE_SIZE_BYTES / 1024}KB`)
  .max(MAX_FILE_SIZE_BYTES, `File size must not exceed ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`);

/**
 * File URL validation
 */
const fileUrlSchema = z
  .string({ message: 'File URL is required' })
  .url('File URL must be a valid URL')
  .max(500, 'File URL must not exceed 500 characters');

/**
 * Document tags validation
 */
const tagsSchema = z
  .array(
    z
      .string()
      .min(MIN_TAG_LENGTH, `Tag must be at least ${MIN_TAG_LENGTH} characters`)
      .max(MAX_TAG_LENGTH, `Tag must not exceed ${MAX_TAG_LENGTH} characters`)
      .refine(
        (val) => /^[a-zA-Z0-9\-_\s]+$/.test(val.trim()),
        'Tag contains invalid characters. Only letters, numbers, spaces, hyphens, and underscores are allowed'
      )
      .transform((val) => val.trim())
  )
  .max(MAX_TAGS_COUNT, `Maximum of ${MAX_TAGS_COUNT} tags allowed`)
  .refine((tags) => {
    const uniqueTags = new Set(tags.map((t) => t.toLowerCase()));
    return uniqueTags.size === tags.length;
  }, 'Duplicate tags are not allowed')
  .optional()
  .default([]);

/**
 * Retention date validation
 */
const retentionDateSchema = z
  .string()
  .datetime({ message: 'Invalid retention date format' })
  .refine((val) => new Date(val) > new Date(), 'Retention date cannot be in the past')
  .optional();

/**
 * Version number validation
 */
const versionSchema = z
  .number()
  .int('Version must be an integer')
  .min(1, 'Version must be at least 1')
  .max(MAX_VERSIONS, `Version cannot exceed ${MAX_VERSIONS}`);

// ============================================================================
// Complex Validation Schemas
// ============================================================================

/**
 * File extension matches MIME type validation
 */
const fileExtensionMimeTypeSchema = z
  .object({
    fileName: z.string(),
    fileType: z.string(),
  })
  .refine(
    (data) => {
      const extension = data.fileName.substring(data.fileName.lastIndexOf('.')).toLowerCase();
      const extensionMap: Record<string, string[]> = {
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

      const allowedMimeTypes = extensionMap[extension];
      if (!allowedMimeTypes) {
        return false;
      }
      return allowedMimeTypes.includes(data.fileType.toLowerCase().trim());
    },
    (data) => {
      const extension = data.fileName.substring(data.fileName.lastIndexOf('.')).toLowerCase();
      return {
        message: `File type "${data.fileType}" does not match extension "${extension}"`,
      };
    }
  );

// ============================================================================
// Document Request Schemas
// ============================================================================

/**
 * Create Document Request Schema
 */
export const createDocumentSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    category: categorySchema,
    fileType: fileTypeSchema,
    fileName: fileNameSchema,
    fileSize: fileSizeSchema,
    fileUrl: fileUrlSchema,
    uploadedBy: uuidSchema.describe('Uploader user ID'),
    studentId: uuidSchema.optional(),
    tags: tagsSchema,
    isTemplate: z.boolean().optional().default(false),
    templateData: z.record(z.any()).optional(),
    accessLevel: accessLevelSchema.optional().default(DocumentAccessLevel.STAFF_ONLY),
  })
  .refine(
    (data) => {
      const extension = data.fileName.substring(data.fileName.lastIndexOf('.')).toLowerCase();
      const extensionMap: Record<string, string[]> = {
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
      const allowedMimeTypes = extensionMap[extension];
      return !allowedMimeTypes || allowedMimeTypes.includes(data.fileType);
    },
    {
      message: 'File extension does not match MIME type',
      path: ['fileType'],
    }
  )
  .refine(
    (data) => !data.isTemplate || data.templateData,
    'Template data is required for template documents'
  );

/**
 * Update Document Request Schema
 */
export const updateDocumentSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema,
  status: statusSchema.optional(),
  tags: tagsSchema,
  retentionDate: retentionDateSchema,
  accessLevel: accessLevelSchema.optional(),
});

/**
 * Status transition validation
 */
export const validateStatusTransition = (currentStatus: DocumentStatus, newStatus: DocumentStatus): boolean => {
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

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
};

/**
 * Sign Document Request Schema
 */
export const signDocumentSchema = z.object({
  documentId: uuidSchema,
  signedBy: uuidSchema.describe('Signer user ID'),
  signedByRole: z
    .string({ message: 'Signer role is required' })
    .min(1, 'Signer role cannot be empty')
    .max(100, 'Signer role must not exceed 100 characters')
    .transform((val) => val.trim()),
  signatureData: z.string().max(10000, 'Signature data must not exceed 10000 characters').optional(),
  ipAddress: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/, 'Must be a valid IP address').optional(),
});

/**
 * Create Document Version Request Schema
 */
export const createDocumentVersionSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema,
  fileType: fileTypeSchema,
  fileName: fileNameSchema,
  fileSize: fileSizeSchema,
  fileUrl: fileUrlSchema,
  uploadedBy: uuidSchema.describe('Uploader user ID'),
  tags: tagsSchema,
  templateData: z.record(z.any()).optional(),
});

/**
 * Create from Template Request Schema
 */
export const createFromTemplateSchema = z.object({
  title: titleSchema,
  uploadedBy: uuidSchema.describe('Uploader user ID'),
  studentId: uuidSchema.optional(),
  templateData: z.record(z.any()).optional(),
});

/**
 * Share Document Request Schema
 */
export const shareDocumentSchema = z.object({
  userIds: z
    .array(uuidSchema)
    .min(1, 'At least one user must be specified to share with')
    .max(MAX_SHARE_RECIPIENTS, `Cannot share with more than ${MAX_SHARE_RECIPIENTS} users at once`)
    .refine((ids) => {
      const uniqueIds = new Set(ids);
      return uniqueIds.size === ids.length;
    }, 'Duplicate user IDs in share list'),
  permissions: z.array(z.enum(['VIEW', 'EDIT', 'ADMIN'])),
  expiresAt: z.string().datetime().optional(),
  message: z.string().max(500, 'Message must not exceed 500 characters').optional(),
});

/**
 * Bulk Delete Documents Request Schema
 */
export const bulkDeleteDocumentsSchema = z.object({
  documentIds: z.array(uuidSchema).min(1, 'At least one document ID must be provided'),
  reason: z.string().max(500, 'Reason must not exceed 500 characters').optional(),
});

/**
 * File Upload Request Schema
 */
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  category: categorySchema,
  title: titleSchema.optional(),
  description: descriptionSchema,
  studentId: uuidSchema.optional(),
  tags: tagsSchema,
  accessLevel: accessLevelSchema.optional(),
});

/**
 * Document Filters Schema
 */
export const documentFiltersSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  category: categorySchema.optional(),
  status: statusSchema.optional(),
  studentId: uuidSchema.optional(),
  uploadedBy: uuidSchema.optional(),
  searchTerm: z.string().max(255).optional(),
  tags: z.array(z.string()).optional(),
  accessLevel: accessLevelSchema.optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  retentionDateFrom: z.string().datetime().optional(),
  retentionDateTo: z.string().datetime().optional(),
  isTemplate: z.boolean().optional(),
  hasSignatures: z.boolean().optional(),
});

/**
 * Advanced Search Filters Schema
 */
export const advancedSearchFiltersSchema = documentFiltersSchema.extend({
  fullTextSearch: z.string().max(500).optional(),
  tags: z.array(z.string()).max(MAX_TAGS_COUNT).optional(),
  metadataFilters: z.record(z.any()).optional(),
  uploadedByIds: z.array(uuidSchema).optional(),
  sharedWithIds: z.array(uuidSchema).optional(),
  signedStatus: z.enum(['SIGNED', 'UNSIGNED', 'PENDING']).optional(),
  hasAttachments: z.boolean().optional(),
  minVersion: z.number().int().min(1).optional(),
  maxVersion: z.number().int().min(1).optional(),
  retentionStatus: z.enum(['ACTIVE', 'ARCHIVED', 'EXPIRED']).optional(),
});

/**
 * Search Documents Request Schema
 */
export const searchDocumentsRequestSchema = z.object({
  query: z.string().max(500).optional(),
  filters: advancedSearchFiltersSchema.optional(),
  sortOptions: z.object({
    field: z.enum(['createdAt', 'updatedAt', 'title', 'category', 'status', 'fileSize', 'version']),
    order: z.enum(['ASC', 'DESC']),
  }).optional(),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(20),
  includeArchived: z.boolean().optional().default(false),
});

/**
 * Bulk Download Request Schema
 */
export const bulkDownloadRequestSchema = z.object({
  documentIds: z.array(uuidSchema).min(1, 'At least one document ID must be provided').max(100, 'Cannot download more than 100 documents at once'),
  options: z.object({
    format: z.enum(['ZIP', 'TAR']).optional().default('ZIP'),
    includeMetadata: z.boolean().optional().default(true),
    compression: z.enum(['NONE', 'FAST', 'BEST']).optional().default('FAST'),
    maxSize: z.number().int().positive().optional(),
  }).optional(),
  includeVersions: z.boolean().optional().default(false),
});

/**
 * Version Comparison Request Schema
 */
export const versionComparisonSchema = z.object({
  documentId: uuidSchema,
  version1Id: uuidSchema,
  version2Id: uuidSchema,
  compareOptions: z.object({
    ignoreWhitespace: z.boolean().optional().default(false),
    showDiff: z.boolean().optional().default(true),
  }).optional(),
}).refine(
  (data) => data.version1Id !== data.version2Id,
  'Cannot compare a version with itself'
);

// ============================================================================
// HIPAA Compliance Validation
// ============================================================================

/**
 * Check if document category contains PHI (Protected Health Information)
 */
export const isPHICategory = (category: DocumentCategory): boolean => {
  const phiCategories: DocumentCategory[] = [
    DocumentCategory.MEDICAL_RECORD,
    DocumentCategory.INCIDENT_REPORT,
    DocumentCategory.CONSENT_FORM,
    DocumentCategory.INSURANCE,
  ];
  return phiCategories.includes(category);
};

/**
 * Check if document requires signature
 */
export const requiresSignature = (category: DocumentCategory): boolean => {
  const signatureRequiredCategories: DocumentCategory[] = [
    DocumentCategory.MEDICAL_RECORD,
    DocumentCategory.CONSENT_FORM,
    DocumentCategory.INCIDENT_REPORT,
  ];
  return signatureRequiredCategories.includes(category);
};

/**
 * Get retention years for category
 */
export const getRetentionYears = (category: DocumentCategory): number => {
  const retentionYears: Record<DocumentCategory, number> = {
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
  return retentionYears[category];
};

/**
 * Calculate default retention date
 */
export const calculateDefaultRetentionDate = (
  category: DocumentCategory,
  createdAt: Date = new Date()
): Date => {
  const retentionYears = getRetentionYears(category);
  const retentionDate = new Date(createdAt);
  retentionDate.setFullYear(retentionDate.getFullYear() + retentionYears);
  return retentionDate;
};

// ============================================================================
// Type Exports
// ============================================================================

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type SignDocumentInput = z.infer<typeof signDocumentSchema>;
export type CreateDocumentVersionInput = z.infer<typeof createDocumentVersionSchema>;
export type CreateFromTemplateInput = z.infer<typeof createFromTemplateSchema>;
export type ShareDocumentInput = z.infer<typeof shareDocumentSchema>;
export type BulkDeleteDocumentsInput = z.infer<typeof bulkDeleteDocumentsSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type DocumentFiltersInput = z.infer<typeof documentFiltersSchema>;
export type AdvancedSearchFiltersInput = z.infer<typeof advancedSearchFiltersSchema>;
export type SearchDocumentsRequestInput = z.infer<typeof searchDocumentsRequestSchema>;
export type BulkDownloadRequestInput = z.infer<typeof bulkDownloadRequestSchema>;
export type VersionComparisonInput = z.infer<typeof versionComparisonSchema>;
