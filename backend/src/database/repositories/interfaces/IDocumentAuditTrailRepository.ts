/**
 * @fileoverview DocumentAuditTrail repository interface.
 * Repository interface for DocumentAuditTrail data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * DocumentAuditTrail repository interface
 * Extends base repository with DocumentAuditTrail-specific operations
 */
export interface IDocumentAuditTrailRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create DocumentAuditTrail DTO
 */
export interface CreateDocumentAuditTrailDTO {
  // Properties defined by DocumentAuditTrail model
  id?: string;
}

/**
 * Update DocumentAuditTrail DTO
 */
export interface UpdateDocumentAuditTrailDTO {
  // Properties defined by DocumentAuditTrail model  
  id?: string;
}
