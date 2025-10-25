/**
 * @fileoverview VitalSigns repository interface.
 * Auto-generated repository interface for VitalSigns data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * VitalSigns repository interface
 * Extends base repository with VitalSigns-specific operations
 */
export interface IVitalSignsRepository extends IRepository<any, any, any> {
  // Add VitalSigns-specific methods here if needed
}

/**
 * Create VitalSigns DTO
 */
export interface CreateVitalSignsDTO {
  [key: string]: any;
}

/**
 * Update VitalSigns DTO
 */
export interface UpdateVitalSignsDTO {
  [key: string]: any;
}
