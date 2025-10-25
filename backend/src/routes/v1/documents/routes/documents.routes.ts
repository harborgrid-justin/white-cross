/**
 * Documents Routes
 * HTTP endpoints for comprehensive document lifecycle management
 * All routes prefixed with /api/v1/documents
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { DocumentsController } from '../controllers/documents.controller';
import {
  documentQuerySchema,
  createDocumentSchema,
  updateDocumentSchema,
  signDocumentSchema,
  shareDocumentSchema,
  createFromTemplateSchema,
  templateQuerySchema,
  searchQuerySchema,
  analyticsQuerySchema,
  bulkDeleteSchema,
  documentIdParamSchema,
  studentIdParamSchema,
  templateIdParamSchema,
  auditTrailQuerySchema,
  expiringDocumentsQuerySchema
} from '../validators/documents.validators';

/**
 * DOCUMENT CRUD ROUTES
 */

const listDocumentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/documents',
  handler: asyncHandler(DocumentsController.listDocuments),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'v1'],
    description: 'Get all documents with pagination and filters',
    notes: '**PHI PROTECTED ENDPOINT** - Returns paginated list of documents. Supports comprehensive filtering by category (CONSENT_FORM, HEALTH_FORM, MEDICAL_REPORT, INCIDENT_REPORT, etc.), status, student, date range, and full-text search. Used for document library, compliance tracking, and record management. All access is logged for HIPAA compliance.',
    validate: {
      query: documentQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Documents retrieved successfully with pagination metadata' },
          '401': { description: 'Unauthorized - Authentication required' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getDocumentByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/documents/{id}',
  handler: asyncHandler(DocumentsController.getDocumentById),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'v1'],
    description: 'Get document by ID',
    notes: '**PHI PROTECTED ENDPOINT** - Returns complete document metadata including file info, signatures, version history (last 5 versions), audit trail (last 50 entries), and access tracking. Used for document detail view and verification. Access is logged for HIPAA compliance.',
    validate: {
      params: documentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Document retrieved successfully with full metadata' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Document not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const createDocumentRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/documents',
  handler: asyncHandler(DocumentsController.createDocument),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'v1'],
    description: 'Upload new document',
    notes: '**PHI PROTECTED ENDPOINT** - Creates new document record with file metadata. Supports multiple categories: MEDICAL_RECORD, CONSENT_FORM, INCIDENT_REPORT, STUDENT_FILE, INSURANCE, etc. File must be uploaded to storage first (separate upload endpoint). Validates file type, size (max 100MB), and required metadata. Creates initial audit trail entry. Default status: DRAFT.',
    validate: {
      payload: createDocumentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Document created successfully with audit trail entry' },
          '400': { description: 'Validation error - Invalid document data or file metadata' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found (if studentId provided)' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const updateDocumentRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/documents/{id}',
  handler: asyncHandler(DocumentsController.updateDocument),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'v1'],
    description: 'Update document metadata',
    notes: '**PHI PROTECTED ENDPOINT** - Updates document metadata (title, description, tags, status, retention date, access level). Cannot modify file content - use versioning instead. Status changes: DRAFT → PENDING → APPROVED/REJECTED. All updates logged with timestamp and user for complete audit trail. Cannot modify ARCHIVED or EXPIRED documents.',
    validate: {
      params: documentIdParamSchema,
      payload: updateDocumentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Document updated successfully with audit entry' },
          '400': { description: 'Validation error - Invalid update data or status transition' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Cannot modify archived/expired documents' },
          '404': { description: 'Document not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const deleteDocumentRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/documents/{id}',
  handler: asyncHandler(DocumentsController.deleteDocument),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'v1'],
    description: 'Delete/archive document',
    notes: '**PHI PROTECTED ENDPOINT** - Deletes document record. Some categories (MEDICAL_RECORD, CONSENT_FORM) may be archived instead of deleted for compliance. Creates audit trail entry before deletion. Cascade deletes signatures and audit entries. Requires appropriate permissions. Admin or document owner only.',
    validate: {
      params: documentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': { description: 'Document deleted successfully (no content)' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Insufficient permissions or undeletable category' },
          '404': { description: 'Document not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * DOCUMENT FILE OPERATIONS ROUTES
 */

const downloadDocumentRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/documents/{id}/download',
  handler: asyncHandler(DocumentsController.downloadDocument),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'FileOperations', 'v1'],
    description: 'Download document file',
    notes: '**PHI PROTECTED ENDPOINT** - Downloads document file and tracks access for HIPAA compliance. Updates lastAccessedAt and increments accessCount. Creates audit trail entry with IP address and PHI flag. Returns document metadata with file URL for client-side download. All downloads logged for security and compliance audits.',
    validate: {
      params: documentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Document file URL retrieved successfully with access logged' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Insufficient access level' },
          '404': { description: 'Document not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * DOCUMENT SIGNATURE ROUTES
 */

const signDocumentRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/documents/{id}/sign',
  handler: asyncHandler(DocumentsController.signDocument),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'Signatures', 'v1'],
    description: 'E-sign document',
    notes: '**CRITICAL PHI ENDPOINT** - Applies digital signature to document for legal compliance. Validates document can be signed (status must be DRAFT or PENDING, not expired). Records signer ID, role, timestamp, IP address, and optional signature image data. Automatically changes status to APPROVED. Creates audit trail entry. Used for consent forms, medical authorizations, incident reports, and policy acknowledgments. Legally binding.',
    validate: {
      params: documentIdParamSchema,
      payload: signDocumentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Document signed successfully with signature record created' },
          '400': { description: 'Validation error - Document cannot be signed (archived/expired)' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Insufficient signing authority' },
          '404': { description: 'Document not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getDocumentSignaturesRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/documents/{id}/signatures',
  handler: asyncHandler(DocumentsController.getDocumentSignatures),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'Signatures', 'v1'],
    description: 'Get all signatures for document',
    notes: '**PHI PROTECTED ENDPOINT** - Returns all digital signatures applied to document. Includes signer details, role, timestamp, IP address, and signature data. Ordered by signature date (most recent first). Used for signature verification, compliance auditing, and legal documentation. Critical for consent forms and authorization documents.',
    validate: {
      params: documentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Signatures retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Document not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * DOCUMENT VERSIONING ROUTES
 */

const getDocumentVersionsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/documents/{id}/versions',
  handler: asyncHandler(DocumentsController.getDocumentVersions),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'Versioning', 'v1'],
    description: 'Get document version history',
    notes: '**PHI PROTECTED ENDPOINT** - Returns complete version history for document. Each version includes file metadata, upload timestamp, uploader info, and version number. Ordered by version (newest first). Used for tracking document evolution, compliance auditing, and reverting to previous versions. Critical for policies and medical forms.',
    validate: {
      params: documentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Version history retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Document not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * DOCUMENT SHARING ROUTE
 */

const shareDocumentRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/documents/{id}/share',
  handler: asyncHandler(DocumentsController.shareDocument),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'Sharing', 'v1'],
    description: 'Share document with users',
    notes: '**PHI PROTECTED ENDPOINT** - Shares document with specified users (nurses, parents, administrators). Validates document is not ARCHIVED or EXPIRED. Records sharing action in audit trail with recipient list. Used for distributing medical reports, incident reports, and health updates. Max 50 recipients per request. Requires appropriate permissions.',
    validate: {
      params: documentIdParamSchema,
      payload: shareDocumentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Document shared successfully with audit entry' },
          '400': { description: 'Validation error - Invalid recipients or unshareable document' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Cannot share archived/expired documents' },
          '404': { description: 'Document not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * DOCUMENT TEMPLATE ROUTES
 */

const listTemplatesRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/documents/templates',
  handler: asyncHandler(DocumentsController.listTemplates),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'Templates', 'v1'],
    description: 'List all document templates',
    notes: 'Returns all available document templates for form generation. Templates include consent forms, health assessment forms, incident reports, and policy acknowledgment forms. Can filter by category. Used for standardized document creation and workflow automation. Templates include field definitions and validation rules.',
    validate: {
      query: templateQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Templates retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const createFromTemplateRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/documents/templates/{templateId}/create',
  handler: asyncHandler(DocumentsController.createFromTemplate),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'Templates', 'v1'],
    description: 'Create document from template',
    notes: '**PHI PROTECTED ENDPOINT** - Generates new document from template with pre-filled data. Merges template structure with provided field values. Used for rapid creation of consent forms, health assessments, and incident reports. Validates required template fields. Creates document in DRAFT status. Maintains reference to source template.',
    validate: {
      params: templateIdParamSchema,
      payload: createFromTemplateSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Document created from template successfully' },
          '400': { description: 'Validation error - Invalid template data or missing required fields' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Template not found or student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * DOCUMENT SEARCH & RETRIEVAL ROUTES
 */

const getStudentDocumentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/documents/student/{studentId}',
  handler: asyncHandler(DocumentsController.getStudentDocuments),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'Students', 'v1'],
    description: 'Get all documents for a student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns all documents associated with a specific student including medical records, consent forms, incident reports, and health assessments. Ordered by creation date (newest first). Used for student file management and comprehensive record review. Access restricted to assigned nurse or admin. All access logged.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Student documents retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Must be assigned nurse or admin' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const searchDocumentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/documents/search',
  handler: asyncHandler(DocumentsController.searchDocuments),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'Search', 'v1'],
    description: 'Search documents by query',
    notes: '**PHI PROTECTED ENDPOINT** - Full-text search across document titles, descriptions, and filenames. Supports additional filtering by category, status, and student. Case-insensitive partial matching. Returns max 50 results. Used for quick document lookup and compliance searches. All searches logged for security auditing.',
    validate: {
      query: searchQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Search results returned successfully' },
          '400': { description: 'Validation error - Query must be at least 1 character' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * DOCUMENT ANALYTICS & REPORTING ROUTES
 */

const getDocumentAnalyticsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/documents/analytics',
  handler: asyncHandler(DocumentsController.getDocumentAnalytics),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'Analytics', 'Reporting', 'v1'],
    description: 'Get document analytics and statistics',
    notes: 'Returns comprehensive document statistics: total count, breakdown by category (consent forms, medical records, etc.), breakdown by status (draft, approved, archived), total storage size, and recent document count (last 7 days). Used for dashboard widgets, compliance reporting, and capacity planning. No PHI - aggregate data only.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Analytics retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getDocumentCategoriesRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/documents/categories',
  handler: asyncHandler(DocumentsController.getDocumentCategories),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'Metadata', 'v1'],
    description: 'Get document categories with metadata',
    notes: 'Returns all available document categories with rich metadata: category name, description, whether signature is required, retention period (years), and current document count. Used for dropdowns, validation, and UI guidance. Includes MEDICAL_RECORD (7yr), CONSENT_FORM (7yr), INCIDENT_REPORT (7yr), POLICY (5yr), INSURANCE (7yr), etc.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Categories retrieved successfully with metadata' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * DOCUMENT AUDIT & COMPLIANCE ROUTES
 */

const getDocumentAuditTrailRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/documents/{id}/audit-trail',
  handler: asyncHandler(DocumentsController.getDocumentAuditTrail),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'Audit', 'Compliance', 'v1'],
    description: 'Get document audit trail',
    notes: '**PHI PROTECTED ENDPOINT** - Returns complete audit trail for document: all access, modifications, signatures, shares, and deletions. Each entry includes action type, user ID, timestamp, IP address, and change details. Ordered chronologically (newest first). Max 500 entries. Critical for HIPAA compliance, security investigations, and legal requirements.',
    validate: {
      params: documentIdParamSchema,
      query: auditTrailQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Audit trail retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Document not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getExpiringDocumentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/documents/expiring',
  handler: asyncHandler(DocumentsController.getExpiringDocuments),
  options: {
    auth: 'jwt',
    tags: ['api', 'Documents', 'Compliance', 'v1'],
    description: 'Get expiring documents',
    notes: 'Returns documents approaching retention/expiration date within specified days (default 30). Ordered by expiration date (soonest first). Used for compliance alerts and proactive renewal workflows. Helps ensure consent forms, medical authorizations, and insurance documents are renewed before expiration. Excludes already ARCHIVED documents.',
    validate: {
      query: expiringDocumentsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Expiring documents retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * EXPORT ROUTES
 */

export const documentsRoutes: ServerRoute[] = [
  // Document CRUD
  listDocumentsRoute,
  getDocumentByIdRoute,
  createDocumentRoute,
  updateDocumentRoute,
  deleteDocumentRoute,

  // File operations
  downloadDocumentRoute,

  // Signatures
  signDocumentRoute,
  getDocumentSignaturesRoute,

  // Versioning
  getDocumentVersionsRoute,

  // Sharing
  shareDocumentRoute,

  // Templates
  listTemplatesRoute,
  createFromTemplateRoute,

  // Search & retrieval
  getStudentDocumentsRoute,
  searchDocumentsRoute,

  // Analytics & reporting
  getDocumentAnalyticsRoute,
  getDocumentCategoriesRoute,

  // Audit & compliance
  getDocumentAuditTrailRoute,
  getExpiringDocumentsRoute
];
