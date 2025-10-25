/**
 * @fileoverview NurseAvailability repository interface.
 * Auto-generated repository interface for NurseAvailability data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * NurseAvailability repository interface
 * Extends base repository with NurseAvailability-specific operations
 */
export interface INurseAvailabilityRepository extends IRepository<any, any, any> {
  // Add NurseAvailability-specific methods here if needed
}

/**
 * Create NurseAvailability DTO
 */
export interface CreateNurseAvailabilityDTO {
  [key: string]: any;
}

/**
 * Update NurseAvailability DTO
 */
export interface UpdateNurseAvailabilityDTO {
  [key: string]: any;
}
