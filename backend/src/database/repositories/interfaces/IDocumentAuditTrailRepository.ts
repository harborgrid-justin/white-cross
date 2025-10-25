/**
 * @fileoverview DocumentAuditTrail repository interface.
 * Auto-generated repository interface for DocumentAuditTrail data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * DocumentAuditTrail repository interface
 * Extends base repository with DocumentAuditTrail-specific operations
 */
export interface IDocumentAuditTrailRepository extends IRepository<any, any, any> {
  // Add DocumentAuditTrail-specific methods here if needed
}

/**
 * Create DocumentAuditTrail DTO
 */
export interface CreateDocumentAuditTrailDTO {
  [key: string]: any;
}

/**
 * Update DocumentAuditTrail DTO
 */
export interface UpdateDocumentAuditTrailDTO {
  [key: string]: any;
}
