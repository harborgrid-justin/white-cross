/**
 * Training Management Module - Public API
 *
 * This module provides comprehensive training and compliance management
 * capabilities including module creation, completion tracking, progress
 * monitoring, and reporting.
 *
 * @example
 * ```typescript
 * import { createTrainingService } from './services/modules/administrationApi/training';
 * import { apiClient } from './services/core/ApiClient';
 *
 * const trainingService = createTrainingService(apiClient);
 *
 * // Access module management
 * const modules = await trainingService.modules.getTrainingModules();
 *
 * // Access completion tracking
 * const progress = await trainingService.completions.getUserTrainingProgress(userId);
 *
 * // Get dashboard data
 * const dashboard = await trainingService.getTrainingDashboard();
 * ```
 *
 * @module services/modules/administrationApi/training
 */

// Export service classes
export { TrainingModulesService } from './training-modules';
export { TrainingCompletionService } from './training-completions';
export { TrainingService } from './training-service';

// Export factory functions
export {
  createTrainingModulesService,
} from './training-modules';
export {
  createTrainingCompletionService,
} from './training-completions';
export {
  createTrainingService,
} from './training-service';

// Re-export types from parent module for convenience
export type {
  TrainingModule,
  CreateTrainingModuleData,
  UpdateTrainingModuleData,
  TrainingCompletion,
  RecordTrainingCompletionData,
  UserTrainingProgress,
  TrainingCategory,
} from '../types';
