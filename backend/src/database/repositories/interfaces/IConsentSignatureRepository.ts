/**
 * @fileoverview ConsentSignature repository interface.
 * Auto-generated repository interface for ConsentSignature data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * ConsentSignature repository interface
 * Extends base repository with ConsentSignature-specific operations
 */
export interface IConsentSignatureRepository extends IRepository<any, any, any> {
  // Add ConsentSignature-specific methods here if needed
}

/**
 * Create ConsentSignature DTO
 */
export interface CreateConsentSignatureDTO {
  [key: string]: any;
}

/**
 * Update ConsentSignature DTO
 */
export interface UpdateConsentSignatureDTO {
  [key: string]: any;
}
