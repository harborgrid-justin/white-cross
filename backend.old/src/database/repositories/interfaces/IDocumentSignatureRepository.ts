/**
 * @fileoverview DocumentSignature repository interface.
 * Repository interface for DocumentSignature data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * DocumentSignature repository interface
 * Extends base repository with DocumentSignature-specific operations
 */
export interface IDocumentSignatureRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create DocumentSignature DTO
 */
export interface CreateDocumentSignatureDTO {
  // Properties defined by DocumentSignature model
  id?: string;
}

/**
 * Update DocumentSignature DTO
 */
export interface UpdateDocumentSignatureDTO {
  // Properties defined by DocumentSignature model  
  id?: string;
}
