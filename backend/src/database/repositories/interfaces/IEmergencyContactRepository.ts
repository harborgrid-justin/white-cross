/**
 * @fileoverview EmergencyContact repository interface.
 * Auto-generated repository interface for EmergencyContact data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * EmergencyContact repository interface
 * Extends base repository with EmergencyContact-specific operations
 */
export interface IEmergencyContactRepository extends IRepository<any, any, any> {
  // Add EmergencyContact-specific methods here if needed
}

/**
 * Create EmergencyContact DTO
 */
export interface CreateEmergencyContactDTO {
  [key: string]: any;
}

/**
 * Update EmergencyContact DTO
 */
export interface UpdateEmergencyContactDTO {
  [key: string]: any;
}
