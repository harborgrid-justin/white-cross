/**
 * @fileoverview Document repository interface.
 * Auto-generated repository interface for Document data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Document repository interface
 * Extends base repository with Document-specific operations
 */
export interface IDocumentRepository extends IRepository<any, any, any> {
  // Add Document-specific methods here if needed
}

/**
 * Create Document DTO
 */
export interface CreateDocumentDTO {
  [key: string]: any;
}

/**
 * Update Document DTO
 */
export interface UpdateDocumentDTO {
  [key: string]: any;
}
