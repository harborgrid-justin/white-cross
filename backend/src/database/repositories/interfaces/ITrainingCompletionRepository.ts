/**
 * @fileoverview TrainingCompletion repository interface.
 * Auto-generated repository interface for TrainingCompletion data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * TrainingCompletion repository interface
 * Extends base repository with TrainingCompletion-specific operations
 */
export interface ITrainingCompletionRepository extends IRepository<any, any, any> {
  // Add TrainingCompletion-specific methods here if needed
}

/**
 * Create TrainingCompletion DTO
 */
export interface CreateTrainingCompletionDTO {
  [key: string]: any;
}

/**
 * Update TrainingCompletion DTO
 */
export interface UpdateTrainingCompletionDTO {
  [key: string]: any;
}
