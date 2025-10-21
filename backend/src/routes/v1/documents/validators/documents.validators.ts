/**
 * Documents Validators
 * Validation schemas for comprehensive document management
 */

import Joi from 'joi';
import { paginationSchema } from '../../../shared/validators';

/**
 * Document Query & Filter Schemas
 */

export const documentQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit']),
  category: Joi.string()
    .valid('MEDICAL_RECORD', 'CONSENT_FORM', 'POLICY', 'INCIDENT_REPORT', 'TRAINING', 'ADMINISTRATIVE', 'STUDENT_FILE', 'INSURANCE', 'OTHER')
    .optional()
    .description('Filter by document category'),
  status: Joi.string()
    .valid('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED', 'EXPIRED')
    .optional()
    .description('Filter by document status'),
  studentId: Joi.string().uuid().optional().description('Filter by student ID'),
  uploadedBy: Joi.string().uuid().optional().description('Filter by uploader user ID'),
  searchTerm: Joi.string().trim().min(1).max(200).optional().description('Search term for title, description, or filename'),
  tags: Joi.string().optional().description('Comma-separated tags to filter by'),
  dateFrom: Joi.date().iso().optional().description('Filter documents from this date'),
  dateTo: Joi.date().iso().optional().description('Filter documents to this date')
});

/**
 * Document CRUD Schemas
 */

export const createDocumentSchema = Joi.object({
  title: Joi.string().trim().min(3).max(300).required()
    .description('Document title'),
  description: Joi.string().trim().max(2000).optional()
    .description('Document description'),
  category: Joi.string()
    .valid('MEDICAL_RECORD', 'CONSENT_FORM', 'POLICY', 'INCIDENT_REPORT', 'TRAINING', 'ADMINISTRATIVE', 'STUDENT_FILE', 'INSURANCE', 'OTHER')
    .required()
    .description('Document category'),
  fileType: Joi.string().trim().min(2).max(10).required()
    .description('File type/extension (e.g., pdf, docx, jpg)'),
  fileName: Joi.string().trim().min(1).max(255).required()
    .description('Original filename'),
  fileSize: Joi.number().integer().min(0).max(100000000).required()
    .description('File size in bytes (max 100MB)'),
  fileUrl: Joi.string().uri().required()
    .description('Storage URL for the file'),
  studentId: Joi.string().uuid().optional()
    .description('Associated student ID (if student-specific document)'),
  tags: Joi.array().items(Joi.string().trim().min(1).max(50)).max(20).optional()
    .description('Document tags for categorization'),
  isTemplate: Joi.boolean().optional()
    .description('Whether this is a template document'),
  templateData: Joi.object().optional()
    .description('Template-specific data for form generation'),
  accessLevel: Joi.string()
    .valid('PUBLIC', 'STAFF_ONLY', 'ADMIN_ONLY', 'RESTRICTED')
    .optional()
    .description('Document access level'),
  retentionDate: Joi.date().iso().min('now').optional()
    .description('Document retention/expiration date'),
  containsPHI: Joi.boolean().optional()
    .description('Whether document contains Protected Health Information')
});

export const updateDocumentSchema = Joi.object({
  title: Joi.string().trim().min(3).max(300).optional()
    .description('Document title'),
  description: Joi.string().trim().max(2000).optional()
    .description('Document description'),
  status: Joi.string()
    .valid('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED', 'EXPIRED')
    .optional()
    .description('Document status'),
  tags: Joi.array().items(Joi.string().trim().min(1).max(50)).max(20).optional()
    .description('Document tags'),
  retentionDate: Joi.date().iso().min('now').optional()
    .description('Document retention/expiration date'),
  accessLevel: Joi.string()
    .valid('PUBLIC', 'STAFF_ONLY', 'ADMIN_ONLY', 'RESTRICTED')
    .optional()
    .description('Document access level')
}).min(1);

/**
 * Document Signature Schemas
 */

export const signDocumentSchema = Joi.object({
  signatureData: Joi.string().trim().max(10000).optional()
    .description('Digital signature data (base64 encoded image or cryptographic signature)'),
  signedByRole: Joi.string().trim().min(2).max(100).required()
    .description('Role/title of the signer (e.g., School Nurse, Parent, Administrator)')
});

/**
 * Document Sharing Schemas
 */

export const shareDocumentSchema = Joi.object({
  sharedWith: Joi.array()
    .items(Joi.string().uuid())
    .min(1)
    .max(50)
    .required()
    .description('Array of user IDs to share document with')
});

/**
 * Document Template Schemas
 */

export const createFromTemplateSchema = Joi.object({
  title: Joi.string().trim().min(3).max(300).required()
    .description('Title for the new document'),
  studentId: Joi.string().uuid().optional()
    .description('Associated student ID'),
  templateData: Joi.object().optional()
    .description('Data to populate template fields')
});

export const templateQuerySchema = Joi.object({
  category: Joi.string()
    .valid('MEDICAL_RECORD', 'CONSENT_FORM', 'POLICY', 'INCIDENT_REPORT', 'TRAINING', 'ADMINISTRATIVE', 'STUDENT_FILE', 'INSURANCE', 'OTHER')
    .optional()
    .description('Filter templates by category')
});

/**
 * Document Search Schemas
 */

export const searchQuerySchema = Joi.object({
  q: Joi.string().trim().min(1).max(200).required()
    .description('Search query string'),
  category: Joi.string()
    .valid('MEDICAL_RECORD', 'CONSENT_FORM', 'POLICY', 'INCIDENT_REPORT', 'TRAINING', 'ADMINISTRATIVE', 'STUDENT_FILE', 'INSURANCE', 'OTHER')
    .optional()
    .description('Filter search by category'),
  status: Joi.string()
    .valid('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED', 'EXPIRED')
    .optional()
    .description('Filter search by status'),
  studentId: Joi.string().uuid().optional()
    .description('Filter search by student ID')
});

/**
 * Document Analytics Schemas
 */

export const analyticsQuerySchema = Joi.object({
  dateFrom: Joi.date().iso().optional()
    .description('Analytics period start date'),
  dateTo: Joi.date().iso().optional()
    .description('Analytics period end date'),
  groupBy: Joi.string()
    .valid('category', 'status', 'student', 'uploader', 'day', 'week', 'month')
    .optional()
    .description('Group analytics by dimension')
});

/**
 * Bulk Operations Schemas
 */

export const bulkDeleteSchema = Joi.object({
  documentIds: Joi.array()
    .items(Joi.string().uuid())
    .min(1)
    .max(100)
    .required()
    .description('Array of document IDs to delete (max 100)')
});

/**
 * Parameter Schemas
 */

export const documentIdParamSchema = Joi.object({
  id: Joi.string().uuid().required()
    .description('Document UUID')
});

export const studentIdParamSchema = Joi.object({
  studentId: Joi.string().uuid().required()
    .description('Student UUID')
});

export const templateIdParamSchema = Joi.object({
  templateId: Joi.string().uuid().required()
    .description('Template document UUID')
});

export const auditTrailQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(500).optional().default(100)
    .description('Maximum number of audit entries to retrieve')
});

export const expiringDocumentsQuerySchema = Joi.object({
  days: Joi.number().integer().min(1).max(365).optional().default(30)
    .description('Number of days to look ahead for expiring documents')
});
