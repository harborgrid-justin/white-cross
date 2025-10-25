/**
 * @fileoverview ConsentSignature repository interface.
 * Repository interface for ConsentSignature data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * ConsentSignature repository interface
 * Extends base repository with ConsentSignature-specific operations
 */
export interface IConsentSignatureRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create ConsentSignature DTO
 */
export interface CreateConsentSignatureDTO {
  // Properties defined by ConsentSignature model
  id?: string;
}

/**
 * Update ConsentSignature DTO
 */
export interface UpdateConsentSignatureDTO {
  // Properties defined by ConsentSignature model  
  id?: string;
}
