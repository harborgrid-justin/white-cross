/**
 * @fileoverview ConsentForm repository interface.
 * Repository interface for ConsentForm data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * ConsentForm repository interface
 * Extends base repository with ConsentForm-specific operations
 */
export interface IConsentFormRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create ConsentForm DTO
 */
export interface CreateConsentFormDTO {
  // Properties defined by ConsentForm model
  id?: string;
}

/**
 * Update ConsentForm DTO
 */
export interface UpdateConsentFormDTO {
  // Properties defined by ConsentForm model  
  id?: string;
}
