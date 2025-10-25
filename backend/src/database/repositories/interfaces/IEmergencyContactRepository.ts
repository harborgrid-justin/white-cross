/**
 * @fileoverview EmergencyContact repository interface.
 * Repository interface for EmergencyContact data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * EmergencyContact repository interface
 * Extends base repository with EmergencyContact-specific operations
 */
export interface IEmergencyContactRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create EmergencyContact DTO
 */
export interface CreateEmergencyContactDTO {
  // Properties defined by EmergencyContact model
  id?: string;
}

/**
 * Update EmergencyContact DTO
 */
export interface UpdateEmergencyContactDTO {
  // Properties defined by EmergencyContact model  
  id?: string;
}
