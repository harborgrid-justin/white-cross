/**
 * Documents Domain Configuration (Backward Compatibility)
 *
 * This file maintains backward compatibility with the original config.ts structure.
 * All exports now come from the modular files in the config/ directory.
 *
 * @deprecated Import directly from individual modules or from index.ts
 * @module hooks/domains/documents/config
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

// Query Keys
export { DOCUMENTS_QUERY_KEYS } from './documentQueryKeys';

// Cache Configuration
export { DOCUMENTS_CACHE_CONFIG } from './documentCacheConfig';

// Core Types
export type {
  Document,
  DocumentCategory,
  DocumentMetadata,
  DocumentPermission,
  DocumentUser,
} from './documentTypes';

// Version Types
export type { DocumentVersion } from './documentVersionTypes';

// Template Types
export type {
  DocumentTemplate,
  TemplateField,
  FieldValidation,
} from './documentTemplateTypes';

// Share Types
export type {
  DocumentShare,
  ShareRecipient,
} from './documentShareTypes';

// Activity and Comment Types
export type {
  DocumentActivity,
  DocumentComment,
  CommentPosition,
} from './documentActivityTypes';

// Utility Functions
export {
  invalidateDocumentsQueries,
  invalidateDocumentQueries,
  invalidateCategoryQueries,
  invalidateTemplateQueries,
  invalidateShareQueries,
} from './documentUtils';
