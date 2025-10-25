/**
 * @fileoverview Document repository interface.
 * Repository interface for Document data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Document repository interface
 * Extends base repository with Document-specific operations
 */
export interface IDocumentRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create Document DTO
 */
export interface CreateDocumentDTO {
  // Properties defined by Document model
  id?: string;
}

/**
 * Update Document DTO
 */
export interface UpdateDocumentDTO {
  // Properties defined by Document model  
  id?: string;
}
