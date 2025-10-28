/**
 * @fileoverview Vaccination repository interface.
 * Repository interface for Vaccination data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Vaccination repository interface
 * Extends base repository with Vaccination-specific operations
 */
export interface IVaccinationRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create Vaccination DTO
 */
export interface CreateVaccinationDTO {
  // Properties defined by Vaccination model
  id?: string;
}

/**
 * Update Vaccination DTO
 */
export interface UpdateVaccinationDTO {
  // Properties defined by Vaccination model  
  id?: string;
}
