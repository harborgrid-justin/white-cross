/**
 * Document Management Utilities
 *
 * Comprehensive document security and management for HIPAA compliance.
 *
 * @module lib/documents
 */

// Encryption
export {
  encryptDocument,
  decryptDocument,
  encryptFile,
  generateEncryptionKey,
  createEncryptedMetadata,
  parseEncryptedMetadata,
  type EncryptedDocument
} from './encryption';

// Digital Signatures
export {
  createDocumentSignature,
  verifySignature,
  hashSignatureData,
  hashDocument,
  validateSignatureFormat,
  createSignatureCertificate,
  createTrustedTimestamp,
  verifyTimestamp,
  generateSignatureId,
  type DocumentSignature,
  type TrustedTimestamp,
  type SignatureMetadata
} from './signatures';

// Virus Scanning
export {
  scanFile,
  validateScanResult,
  getRecommendedConfig,
  type ScanResult,
  type ScannerConfig
} from './virus-scan';

// Access Control
export {
  checkDocumentAccess,
  canDeleteDocument,
  canShareDocument,
  canSignDocument,
  createDocumentShare,
  isAccessValid,
  getEffectivePermissions,
  requiresPHIAudit,
  getRolePermissions,
  roleHasPermission,
  type DocumentPermission,
  type DocumentAccess,
  type SharedAccess
} from './access-control';

// Storage
export {
  storeDocument,
  retrieveDocument,
  deleteDocument,
  getDocumentMetadata,
  generateDocumentId,
  type DocumentMetadata,
  type StoredDocument
} from './storage';

// Request Context
export {
  getRequestContext,
  getClientIP,
  getUserAgent,
  type RequestContext
} from './request-context';
