/**
 * Document Schemas
 * 
 * Zod validation schemas for document management operations.
 * Provides type-safe validation for document creation, updates, sharing, and versioning.
 */

import { z } from 'zod';

// ============================================================================
// Base Document Schemas
// ============================================================================

export const createDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  fileUrl: z.string().url('Valid file URL is required'),
  fileType: z.string().min(1, 'File type is required'),
  fileSize: z.number().positive('File size must be positive'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional().default(false),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createFromTemplateSchema = z.object({
  templateId: z.string().min(1, 'Template ID is required'),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  variables: z.record(z.string(), z.unknown()).optional(),
});

export const shareDocumentSchema = z.object({
  documentId: z.string().min(1, 'Document ID is required'),
  userIds: z.array(z.string()).min(1, 'At least one user ID is required'),
  permissions: z.enum(['view', 'edit', 'admin']).default('view'),
  expiresAt: z.string().datetime().optional(),
  message: z.string().optional(),
});

export const bulkDeleteDocumentsSchema = z.object({
  documentIds: z.array(z.string()).min(1, 'At least one document ID is required'),
  permanent: z.boolean().optional().default(false),
});

export const documentFiltersSchema = z.object({
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
  createdBy: z.string().optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
});

// ============================================================================
// Version Management Schemas
// ============================================================================

export const createDocumentVersionSchema = z.object({
  documentId: z.string().min(1, 'Document ID is required'),
  fileUrl: z.string().url('Valid file URL is required'),
  fileType: z.string().min(1, 'File type is required'),
  fileSize: z.number().positive('File size must be positive'),
  changeNotes: z.string().optional(),
  isMajorVersion: z.boolean().optional().default(false),
});

export const signDocumentSchema = z.object({
  documentId: z.string().min(1, 'Document ID is required'),
  signedBy: z.string().min(1, 'Signer ID is required'),
  signedByRole: z.string().optional(),
  signatureType: z.enum(['ELECTRONIC', 'DIGITAL', 'BIOMETRIC', 'PIN']).default('ELECTRONIC'),
  signatureData: z.string().min(1, 'Signature data is required'),
  ipAddress: z.string().optional(),
  certificateId: z.string().optional(),
  location: z.string().optional(),
  deviceInfo: z.string().optional(),
  pin: z.string().optional(),
  biometricData: z.string().optional(),
});

// ============================================================================
// Advanced Search Schemas
// ============================================================================

export const advancedSearchFiltersSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  studentId: z.string().optional(),
  createdBy: z.string().optional(),
  signedBy: z.string().optional(),
  dateRange: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }).optional(),
  expiringWithinDays: z.number().int().positive().optional(),
  hasSignatures: z.boolean().optional(),
  isExpired: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  minFileSize: z.number().positive().optional(),
  maxFileSize: z.number().positive().optional(),
  fileTypes: z.array(z.string()).optional(),
});

export const searchSortOptionsSchema = z.object({
  field: z.enum(['createdAt', 'updatedAt', 'title', 'category', 'fileSize', 'expirationDate']),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const searchDocumentsRequestSchema = z.object({
  filters: advancedSearchFiltersSchema,
  sort: searchSortOptionsSchema.optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
  includeAggregations: z.boolean().optional().default(false),
  includeHighlights: z.boolean().optional().default(true),
});

// ============================================================================
// Version Comparison Schemas
// ============================================================================

export const versionComparisonSchema = z.object({
  documentId: z.string().uuid('Invalid document ID format'),
  versionId1: z.string().uuid('Invalid version ID format'),
  versionId2: z.string().uuid('Invalid version ID format'),
  comparisonType: z.enum(['text', 'metadata', 'full']).optional().default('full'),
  includeContent: z.boolean().optional().default(false),
});

// ============================================================================
// Bulk Operations Schemas
// ============================================================================

export const bulkDownloadRequestSchema = z.object({
  documentIds: z.array(z.string().uuid('Invalid document ID format')).min(1, 'At least one document ID is required'),
  includeVersions: z.boolean().optional().default(false),
  includeMetadata: z.boolean().optional().default(true),
  format: z.enum(['zip', 'tar', 'tar.gz']).optional().default('zip'),
  fileName: z.string().optional(),
  excludeArchived: z.boolean().optional().default(true),
  excludeExpired: z.boolean().optional().default(false),
  maxFileSize: z.number().positive().optional(),
  metadataFormat: z.enum(['json', 'csv', 'xml']).optional().default('json'),
  includeSignatures: z.boolean().optional().default(true),
  includeAuditTrail: z.boolean().optional().default(false),
});

// ============================================================================
// Type Exports
// ============================================================================

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type CreateFromTemplateInput = z.infer<typeof createFromTemplateSchema>;
export type ShareDocumentInput = z.infer<typeof shareDocumentSchema>;
export type BulkDeleteDocumentsInput = z.infer<typeof bulkDeleteDocumentsSchema>;
export type DocumentFiltersInput = z.infer<typeof documentFiltersSchema>;
export type CreateDocumentVersionInput = z.infer<typeof createDocumentVersionSchema>;
export type SignDocumentInput = z.infer<typeof signDocumentSchema>;
