/**
 * @fileoverview StudentMedication repository interface.
 * Repository interface for StudentMedication data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * StudentMedication repository interface
 * Extends base repository with StudentMedication-specific operations
 */
export interface IStudentMedicationRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create StudentMedication DTO
 */
export interface CreateStudentMedicationDTO {
  // Properties defined by StudentMedication model
  id?: string;
}

/**
 * Update StudentMedication DTO
 */
export interface UpdateStudentMedicationDTO {
  // Properties defined by StudentMedication model  
  id?: string;
}
