/**
 * @fileoverview VitalSigns repository interface.
 * Repository interface for VitalSigns data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * VitalSigns repository interface
 * Extends base repository with VitalSigns-specific operations
 */
export interface IVitalSignsRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create VitalSigns DTO
 */
export interface CreateVitalSignsDTO {
  // Properties defined by VitalSigns model
  id?: string;
}

/**
 * Update VitalSigns DTO
 */
export interface UpdateVitalSignsDTO {
  // Properties defined by VitalSigns model  
  id?: string;
}
