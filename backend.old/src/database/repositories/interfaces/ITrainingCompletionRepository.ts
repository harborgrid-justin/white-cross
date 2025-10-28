/**
 * @fileoverview TrainingCompletion repository interface.
 * Repository interface for TrainingCompletion data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * TrainingCompletion repository interface
 * Extends base repository with TrainingCompletion-specific operations
 */
export interface ITrainingCompletionRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create TrainingCompletion DTO
 */
export interface CreateTrainingCompletionDTO {
  // Properties defined by TrainingCompletion model
  id?: string;
}

/**
 * Update TrainingCompletion DTO
 */
export interface UpdateTrainingCompletionDTO {
  // Properties defined by TrainingCompletion model  
  id?: string;
}
