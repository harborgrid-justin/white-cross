/**
 * @fileoverview Document Management Server Actions - Next.js v14+ Compatible
 * @module app/documents/actions
 *
 * HIPAA-compliant server actions for document management with comprehensive
 * caching, audit logging, and error handling.
 *
 * This is a barrel file that re-exports from specialized document modules:
 * - documents.types.ts - Type definitions and constants
 * - documents.cache.ts - Caching utilities
 * - documents.upload.ts - Upload operations
 * - documents.crud.ts - CRUD operations
 * - documents.sharing.ts - Sharing and permissions
 * - documents.signatures.ts - Digital signatures
 * - documents.utils.ts - Utility functions
 * - documents.stats.ts - Statistics and dashboard data
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all PHI operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 */

'use server';

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  ActionResult,
  DocumentMetadata,
  DocumentInfo,
  DocumentSignature,
  DocumentShareData,
  SignatureAgreement,
  DocumentStats
} from './documents.types';

export {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  DOCUMENT_CACHE_TAGS
} from './documents.types';

// ==========================================
// CACHE EXPORTS
// ==========================================

export {
  getDocument,
  getDocuments,
  clearDocumentCache
} from './documents.cache';

// ==========================================
// UPLOAD EXPORTS
// ==========================================

export {
  uploadDocumentAction,
  uploadDocumentFromForm
} from './documents.upload';

// ==========================================
// CRUD EXPORTS
// ==========================================

export {
  getDocumentAction,
  updateDocumentAction,
  updateDocumentFromForm,
  deleteDocumentAction
} from './documents.crud';

// ==========================================
// SHARING EXPORTS
// ==========================================

export {
  shareDocumentAction
} from './documents.sharing';

// ==========================================
// SIGNATURE EXPORTS
// ==========================================

export {
  signDocumentAction
} from './documents.signatures';

// ==========================================
// UTILITY EXPORTS
// ==========================================

export {
  documentExists,
  getDocumentCount
} from './documents.utils';

// ==========================================
// STATISTICS EXPORTS
// ==========================================

export {
  getDocumentStats,
  getDocumentsDashboardData
} from './documents.stats';
