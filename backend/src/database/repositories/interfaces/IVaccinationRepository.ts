/**
 * @fileoverview Vaccination repository interface.
 * Auto-generated repository interface for Vaccination data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * Vaccination repository interface
 * Extends base repository with Vaccination-specific operations
 */
export interface IVaccinationRepository extends IRepository<any, any, any> {
  // Add Vaccination-specific methods here if needed
}

/**
 * Create Vaccination DTO
 */
export interface CreateVaccinationDTO {
  [key: string]: any;
}

/**
 * Update Vaccination DTO
 */
export interface UpdateVaccinationDTO {
  [key: string]: any;
}
