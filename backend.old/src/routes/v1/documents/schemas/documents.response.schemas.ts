/**
 * Documents Module Response Schemas for Swagger Documentation
 * Comprehensive Joi schemas for document management responses
 *
 * Usage in routes:
 * import { DocumentResponseSchema, DocumentListResponseSchema } from '../schemas/documents.response.schemas';
 *
 * options: {
 *   response: {
 *     schema: DocumentResponseSchema
 *   },
 *   plugins: {
 *     'hapi-swagger': {
 *       responses: {
 *         '200': { description: 'Success', schema: DocumentResponseSchema }
 *       }
 *     }
 *   }
 * }
 */

import Joi from 'joi';
import { createPaginatedResponseSchema } from '../../RESPONSE_SCHEMAS';

/**
 * ============================================================================
 * DOCUMENT SCHEMAS
 * ============================================================================
 */

/**
 * Document Schema
 */
export const DocumentSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174000').description('Document UUID'),
  title: Joi.string().example('Student Medical Consent Form').description('Document title'),
  description: Joi.string().allow(null).example('Annual medical consent for student care').description('Document description'),
  category: Joi.string()
    .valid('MEDICAL_RECORD', 'CONSENT_FORM', 'POLICY', 'INCIDENT_REPORT', 'TRAINING', 'ADMINISTRATIVE', 'STUDENT_FILE', 'INSURANCE', 'OTHER')
    .example('CONSENT_FORM')
    .description('Document category'),
  fileType: Joi.string().example('pdf').description('File type/extension'),
  fileName: Joi.string().example('medical-consent-2025.pdf').description('Original filename'),
  fileSize: Joi.number().integer().example(245760).description('File size in bytes'),
  fileUrl: Joi.string().uri().example('https://storage.example.com/documents/file.pdf').description('Storage URL'),
  status: Joi.string()
    .valid('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED', 'EXPIRED')
    .example('APPROVED')
    .description('Document status'),
  studentId: Joi.string().uuid().allow(null).example('456e7890-e89b-12d3-a456-426614174001').description('Associated student ID'),
  uploadedBy: Joi.string().uuid().example('789e0123-e89b-12d3-a456-426614174002').description('Uploader user ID'),
  uploadedByName: Joi.string().optional().example('Jane Nurse').description('Uploader name'),
  tags: Joi.array().items(Joi.string()).example(['medical', 'consent', '2025']).description('Document tags'),
  accessLevel: Joi.string()
    .valid('PUBLIC', 'STAFF_ONLY', 'ADMIN_ONLY', 'RESTRICTED')
    .example('STAFF_ONLY')
    .description('Access level'),
  retentionDate: Joi.date().iso().allow(null).example('2032-12-31T23:59:59Z').description('Retention/expiration date'),
  containsPHI: Joi.boolean().example(true).description('Contains Protected Health Information'),
  lastAccessedAt: Joi.date().iso().allow(null).example('2025-10-23T10:30:00Z').description('Last access timestamp'),
  accessCount: Joi.number().integer().example(15).description('Number of times accessed'),
  createdAt: Joi.date().iso().example('2025-01-15T08:00:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2025-10-23T10:30:00Z').description('Last update timestamp')
}).label('Document');

/**
 * Document with Extended Info (includes versions, signatures, etc.)
 */
export const DocumentWithExtendedInfoSchema = DocumentSchema.keys({
  versions: Joi.array().items(Joi.object({
    versionNumber: Joi.number().integer(),
    fileUrl: Joi.string().uri(),
    fileSize: Joi.number().integer(),
    uploadedBy: Joi.string().uuid(),
    uploadedAt: Joi.date().iso()
  })).optional().description('Version history (last 5 versions)'),
  signatures: Joi.array().items(Joi.object({
    id: Joi.string().uuid(),
    signedBy: Joi.string().uuid(),
    signedByName: Joi.string(),
    signedByRole: Joi.string(),
    signedAt: Joi.date().iso(),
    ipAddress: Joi.string().ip()
  })).optional().description('Digital signatures'),
  auditTrail: Joi.array().items(Joi.object({
    action: Joi.string(),
    userId: Joi.string().uuid(),
    userName: Joi.string(),
    timestamp: Joi.date().iso()
  })).optional().description('Recent audit entries (last 50)')
}).label('DocumentWithExtendedInfo');

/**
 * Document Signature Schema
 */
export const DocumentSignatureSchema = Joi.object({
  id: Joi.string().uuid().example('sig-123').description('Signature UUID'),
  documentId: Joi.string().uuid().description('Document UUID'),
  signedBy: Joi.string().uuid().description('Signer user ID'),
  signedByName: Joi.string().example('Dr. Smith').description('Signer name'),
  signedByRole: Joi.string().example('School Nurse').description('Signer role'),
  signatureData: Joi.string().allow(null).description('Signature image data (base64)'),
  ipAddress: Joi.string().ip().example('192.168.1.100').description('IP address'),
  signedAt: Joi.date().iso().example('2025-10-23T10:00:00Z').description('Signature timestamp'),
  createdAt: Joi.date().iso().description('Creation timestamp')
}).label('DocumentSignature');

/**
 * Document Template Schema
 */
export const DocumentTemplateSchema = Joi.object({
  id: Joi.string().uuid().description('Template UUID'),
  title: Joi.string().example('Medical Consent Template').description('Template title'),
  category: Joi.string().example('CONSENT_FORM').description('Template category'),
  description: Joi.string().description('Template description'),
  templateData: Joi.object().description('Template field definitions'),
  isActive: Joi.boolean().example(true).description('Whether template is active'),
  usageCount: Joi.number().integer().example(45).description('Number of documents created from template'),
  createdAt: Joi.date().iso().description('Creation timestamp')
}).label('DocumentTemplate');

/**
 * Document Category Metadata Schema
 */
export const DocumentCategorySchema = Joi.object({
  category: Joi.string().example('MEDICAL_RECORD').description('Category name'),
  description: Joi.string().example('Student medical records').description('Category description'),
  requiresSignature: Joi.boolean().example(true).description('Whether signature is required'),
  retentionPeriodYears: Joi.number().integer().example(7).description('Retention period in years'),
  documentCount: Joi.number().integer().example(1250).description('Number of documents in category')
}).label('DocumentCategory');

/**
 * Document Analytics Schema
 */
export const DocumentAnalyticsSchema = Joi.object({
  totalDocuments: Joi.number().integer().example(5420).description('Total document count'),
  byCategory: Joi.object().pattern(Joi.string(), Joi.number()).example({
    'MEDICAL_RECORD': 1200,
    'CONSENT_FORM': 980,
    'INCIDENT_REPORT': 450
  }).description('Documents by category'),
  byStatus: Joi.object().pattern(Joi.string(), Joi.number()).example({
    'APPROVED': 4200,
    'DRAFT': 850,
    'ARCHIVED': 370
  }).description('Documents by status'),
  totalStorageBytes: Joi.number().integer().example(10485760000).description('Total storage in bytes'),
  recentDocuments: Joi.number().integer().example(125).description('Documents created in last 7 days')
}).label('DocumentAnalytics');

/**
 * ============================================================================
 * RESPONSE SCHEMAS
 * ============================================================================
 */

/**
 * Single Document Response
 */
export const DocumentResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    document: DocumentWithExtendedInfoSchema
  })
}).label('DocumentResponse');

/**
 * Document List Response (Paginated)
 */
export const DocumentListResponseSchema = createPaginatedResponseSchema(DocumentSchema, 'DocumentListResponse');

/**
 * Document Created Response
 */
export const DocumentCreatedResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    document: DocumentSchema
  })
}).label('DocumentCreatedResponse');

/**
 * Document Signatures Response
 */
export const DocumentSignaturesResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    signatures: Joi.array().items(DocumentSignatureSchema)
  })
}).label('DocumentSignaturesResponse');

/**
 * Signature Created Response
 */
export const SignatureCreatedResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    signature: DocumentSignatureSchema,
    message: Joi.string().example('Document signed successfully')
  })
}).label('SignatureCreatedResponse');

/**
 * Document Versions Response
 */
export const DocumentVersionsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    versions: Joi.array().items(Joi.object({
      versionNumber: Joi.number().integer(),
      fileUrl: Joi.string().uri(),
      fileSize: Joi.number().integer(),
      uploadedBy: Joi.string().uuid(),
      uploadedByName: Joi.string(),
      uploadedAt: Joi.date().iso()
    }))
  })
}).label('DocumentVersionsResponse');

/**
 * Document Share Response
 */
export const DocumentShareResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    message: Joi.string().example('Document shared with 5 user(s)'),
    sharedWith: Joi.array().items(Joi.string().uuid()).description('User IDs shared with'),
    sharedCount: Joi.number().integer().example(5)
  })
}).label('DocumentShareResponse');

/**
 * Document Templates Response
 */
export const DocumentTemplatesResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    templates: Joi.array().items(DocumentTemplateSchema)
  })
}).label('DocumentTemplatesResponse');

/**
 * Student Documents Response
 */
export const StudentDocumentsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    documents: Joi.array().items(DocumentSchema),
    studentId: Joi.string().uuid(),
    totalDocuments: Joi.number().integer()
  })
}).label('StudentDocumentsResponse');

/**
 * Document Search Response
 */
export const DocumentSearchResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    documents: Joi.array().items(DocumentSchema),
    query: Joi.string().description('Search query'),
    resultCount: Joi.number().integer().example(12)
  })
}).label('DocumentSearchResponse');

/**
 * Document Analytics Response
 */
export const DocumentAnalyticsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    statistics: DocumentAnalyticsSchema
  })
}).label('DocumentAnalyticsResponse');

/**
 * Document Categories Response
 */
export const DocumentCategoriesResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    categories: Joi.array().items(DocumentCategorySchema)
  })
}).label('DocumentCategoriesResponse');

/**
 * Audit Trail Response
 */
export const DocumentAuditTrailResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    auditTrail: Joi.array().items(Joi.object({
      id: Joi.string().uuid(),
      action: Joi.string().example('VIEW'),
      userId: Joi.string().uuid(),
      userName: Joi.string(),
      ipAddress: Joi.string().ip(),
      timestamp: Joi.date().iso(),
      changes: Joi.object().optional()
    }))
  })
}).label('DocumentAuditTrailResponse');

/**
 * Expiring Documents Response
 */
export const ExpiringDocumentsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    documents: Joi.array().items(DocumentSchema),
    expiringWithinDays: Joi.number().integer().example(30),
    count: Joi.number().integer().example(8)
  })
}).label('ExpiringDocumentsResponse');

/**
 * ============================================================================
 * ERROR SCHEMAS
 * ============================================================================
 */

/**
 * Standard Error Response
 */
export const ErrorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Document not found'),
    code: Joi.string().example('NOT_FOUND').optional(),
    details: Joi.any().optional()
  })
}).label('ErrorResponse');

/**
 * Validation Error Response
 */
export const ValidationErrorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Validation failed'),
    code: Joi.string().example('VALIDATION_ERROR'),
    details: Joi.array().items(
      Joi.object({
        field: Joi.string().example('title'),
        message: Joi.string().example('Title is required'),
        value: Joi.any().optional()
      })
    )
  })
}).label('ValidationErrorResponse');
