/**
 * @fileoverview NurseAvailability repository interface.
 * Repository interface for NurseAvailability data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * NurseAvailability repository interface
 * Extends base repository with NurseAvailability-specific operations
 */
export interface INurseAvailabilityRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create NurseAvailability DTO
 */
export interface CreateNurseAvailabilityDTO {
  // Properties defined by NurseAvailability model
  id?: string;
}

/**
 * Update NurseAvailability DTO
 */
export interface UpdateNurseAvailabilityDTO {
  // Properties defined by NurseAvailability model  
  id?: string;
}
