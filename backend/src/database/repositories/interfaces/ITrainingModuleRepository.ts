/**
 * @fileoverview TrainingModule repository interface.
 * Repository interface for TrainingModule data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * TrainingModule repository interface
 * Extends base repository with TrainingModule-specific operations
 */
export interface ITrainingModuleRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create TrainingModule DTO
 */
export interface CreateTrainingModuleDTO {
  // Properties defined by TrainingModule model
  id?: string;
}

/**
 * Update TrainingModule DTO
 */
export interface UpdateTrainingModuleDTO {
  // Properties defined by TrainingModule model  
  id?: string;
}
