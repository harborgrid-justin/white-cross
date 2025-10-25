/**
 * @fileoverview TrainingModule repository interface.
 * Auto-generated repository interface for TrainingModule data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * TrainingModule repository interface
 * Extends base repository with TrainingModule-specific operations
 */
export interface ITrainingModuleRepository extends IRepository<any, any, any> {
  // Add TrainingModule-specific methods here if needed
}

/**
 * Create TrainingModule DTO
 */
export interface CreateTrainingModuleDTO {
  [key: string]: any;
}

/**
 * Update TrainingModule DTO
 */
export interface UpdateTrainingModuleDTO {
  [key: string]: any;
}
