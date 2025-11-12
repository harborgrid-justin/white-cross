/**
 * Document Type Utilities Module
 * Helper types and utility types for document operations
 * Dependencies: core.ts
 */

import { Document } from './core';

/**
 * Document without relations
 * Document type without associations for simpler operations
 */
export type DocumentWithoutRelations = Omit<Document, 'parent' | 'versions' | 'signatures' | 'auditTrail'>;

/**
 * Partial Document Update
 * Partial type for document updates
 */
export type PartialDocumentUpdate = Partial<Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'uploadedBy'>>;

/**
 * Document Sort Field
 * Valid fields for sorting documents
 */
export type DocumentSortField = 'createdAt' | 'updatedAt' | 'title' | 'category' | 'status' | 'fileSize' | 'version';

/**
 * Document Sort Order
 * Valid sort orders
 */
export type DocumentSortOrder = 'ASC' | 'DESC';
