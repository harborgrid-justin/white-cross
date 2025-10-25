/**
 * @fileoverview StudentMedication repository interface.
 * Auto-generated repository interface for StudentMedication data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * StudentMedication repository interface
 * Extends base repository with StudentMedication-specific operations
 */
export interface IStudentMedicationRepository extends IRepository<any, any, any> {
  // Add StudentMedication-specific methods here if needed
}

/**
 * Create StudentMedication DTO
 */
export interface CreateStudentMedicationDTO {
  [key: string]: any;
}

/**
 * Update StudentMedication DTO
 */
export interface UpdateStudentMedicationDTO {
  [key: string]: any;
}
