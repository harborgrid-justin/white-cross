/**
 * @fileoverview ConsentForm repository interface.
 * Auto-generated repository interface for ConsentForm data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * ConsentForm repository interface
 * Extends base repository with ConsentForm-specific operations
 */
export interface IConsentFormRepository extends IRepository<any, any, any> {
  // Add ConsentForm-specific methods here if needed
}

/**
 * Create ConsentForm DTO
 */
export interface CreateConsentFormDTO {
  [key: string]: any;
}

/**
 * Update ConsentForm DTO
 */
export interface UpdateConsentFormDTO {
  [key: string]: any;
}
