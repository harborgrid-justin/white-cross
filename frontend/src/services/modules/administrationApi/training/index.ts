/**
 * Training Management Module - Public API
 *
 * @deprecated This module is deprecated and will be removed in a future version.
 * Migrate to server actions for better performance and type safety.
 *
 * Migration Guide:
 * - Training Modules: Use '@/lib/actions/compliance.training' server actions
 * - API Client: Use '@/lib/api/server' for server-side operations
 *
 * @example Migration from legacy to server actions
 * ```typescript
 * // DEPRECATED: Legacy API client approach
 * import { createTrainingService } from './services/modules/administrationApi/training';
 * import { apiClient } from './services/core/ApiClient';
 * const trainingService = createTrainingService(apiClient);
 * const modules = await trainingService.modules.getTrainingModules();
 * const progress = await trainingService.completions.getUserTrainingProgress(userId);
 *
 * // RECOMMENDED: Server actions approach
 * import { getTrainingModules, getUserTrainingProgress } from '@/lib/actions/compliance.training';
 * const modules = await getTrainingModules();
 * const progress = await getUserTrainingProgress(userId);
 * ```
 *
 * This module provides comprehensive training and compliance management
 * capabilities including module creation, completion tracking, progress
 * monitoring, and reporting.
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
