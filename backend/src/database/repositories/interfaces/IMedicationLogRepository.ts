/**
 * @fileoverview MedicationLog repository interface.
 * Repository interface for MedicationLog data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * MedicationLog repository interface
 * Extends base repository with MedicationLog-specific operations
 */
export interface IMedicationLogRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create MedicationLog DTO
 */
export interface CreateMedicationLogDTO {
  // Properties defined by MedicationLog model
  id?: string;
}

/**
 * Update MedicationLog DTO
 */
export interface UpdateMedicationLogDTO {
  // Properties defined by MedicationLog model  
  id?: string;
}
