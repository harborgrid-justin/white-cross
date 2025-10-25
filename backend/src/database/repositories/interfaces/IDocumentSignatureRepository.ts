/**
 * @fileoverview DocumentSignature repository interface.
 * Auto-generated repository interface for DocumentSignature data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * DocumentSignature repository interface
 * Extends base repository with DocumentSignature-specific operations
 */
export interface IDocumentSignatureRepository extends IRepository<any, any, any> {
  // Add DocumentSignature-specific methods here if needed
}

/**
 * Create DocumentSignature DTO
 */
export interface CreateDocumentSignatureDTO {
  [key: string]: any;
}

/**
 * Update DocumentSignature DTO
 */
export interface UpdateDocumentSignatureDTO {
  [key: string]: any;
}
