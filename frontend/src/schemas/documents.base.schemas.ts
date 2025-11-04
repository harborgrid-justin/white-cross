/**
 * @fileoverview Base document schemas
 * @module schemas/documents.base
 *
 * Base schemas for document uploads, metadata, and folder management.
 */

import { z } from 'zod';
import {
  DocumentStatus,
  DocumentAccessLevel,
  DocumentCategory,
} from '@/types/documents';

/**
 * File upload schema
 */
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  folderId: z.string().uuid().optional(),
  metadata: z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().max(1000).optional(),
    category: z.nativeEnum(DocumentCategory),
    accessLevel: z.nativeEnum(DocumentAccessLevel),
    tags: z.array(z.string()).default([]),
    customFields: z.record(z.string(), z.unknown()).default({}),
    studentId: z.string().uuid().optional(),
    schoolId: z.string().uuid().optional(),
    districtId: z.string().uuid().optional(),
    retentionDays: z.number().int().positive().optional(),
    autoDelete: z.boolean().default(false),
    requiresSignature: z.boolean().default(false),
    isPHI: z.boolean().default(false)
  })
});

export type FileUploadFormData = z.infer<typeof fileUploadSchema>;

/**
 * Bulk upload schema
 */
export const bulkUploadSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, 'At least one file is required').max(50, 'Maximum 50 files allowed'),
  folderId: z.string().uuid().optional(),
  defaultMetadata: z.object({
    category: z.nativeEnum(DocumentCategory),
    accessLevel: z.nativeEnum(DocumentAccessLevel),
    tags: z.array(z.string()).default([]),
    schoolId: z.string().uuid().optional(),
    districtId: z.string().uuid().optional(),
    autoDelete: z.boolean().default(false),
    requiresSignature: z.boolean().default(false),
    isPHI: z.boolean().default(false)
  })
});

export type BulkUploadFormData = z.infer<typeof bulkUploadSchema>;

/**
 * Document metadata update schema
 */
export const documentMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional(),
  category: z.nativeEnum(DocumentCategory),
  accessLevel: z.nativeEnum(DocumentAccessLevel),
  tags: z.array(z.string()).default([]),
  customFields: z.record(z.string(), z.unknown()).default({}),
  retentionDays: z.number().int().positive().optional(),
  autoDelete: z.boolean().default(false),
  requiresSignature: z.boolean().default(false),
  isPHI: z.boolean().default(false)
});

export type DocumentMetadataFormData = z.infer<typeof documentMetadataSchema>;

/**
 * Document search schema
 */
export const documentSearchSchema = z.object({
  query: z.string().optional(),
  category: z.array(z.nativeEnum(DocumentCategory)).optional(),
  status: z.array(z.nativeEnum(DocumentStatus)).optional(),
  accessLevel: z.array(z.nativeEnum(DocumentAccessLevel)).optional(),
  tags: z.array(z.string()).optional(),
  folderId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  schoolId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  fileType: z.array(z.string()).optional(),
  createdBy: z.string().uuid().optional(),
  includeDeleted: z.boolean().default(false),
  requiresSignature: z.boolean().optional(),
  isPHI: z.boolean().optional(),
  sortBy: z.enum(['name', 'date', 'size', 'category', 'status']).default('date'),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20)
});

export type DocumentSearchFormData = z.infer<typeof documentSearchSchema>;
