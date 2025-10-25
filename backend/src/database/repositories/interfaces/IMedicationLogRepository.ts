/**
 * @fileoverview MedicationLog repository interface.
 * Auto-generated repository interface for MedicationLog data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * MedicationLog repository interface
 * Extends base repository with MedicationLog-specific operations
 */
export interface IMedicationLogRepository extends IRepository<any, any, any> {
  // Add MedicationLog-specific methods here if needed
}

/**
 * Create MedicationLog DTO
 */
export interface CreateMedicationLogDTO {
  [key: string]: any;
}

/**
 * Update MedicationLog DTO
 */
export interface UpdateMedicationLogDTO {
  [key: string]: any;
}
