/**
 * WF-COMP-315 | administration/training.ts - Type definitions
 * Purpose: Training module type definitions for administration module
 * Upstream: enums.ts | Dependencies: TrainingCategory
 * Downstream: Training management components | Called by: React components
 * Related: Other administration type files
 * Exports: Interfaces | Key Features: Type definitions
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type definitions for training module management
 * LLM Context: Training module and completion tracking types
 */

import type { TrainingCategory } from './enums';

/**
 * Training Module Types
 *
 * Type definitions for training modules including:
 * - Training module entities aligned with backend models
 * - Completion tracking
 * - User progress tracking
 */

// ==================== TRAINING MODULE TYPES ====================

/**
 * Training module entity
 *
 * @aligned_with backend/src/database/models/administration/TrainingModule.ts
 */
export interface TrainingModule {
  id: string;
  title: string;
  description?: string;
  content: string;
  duration?: number;
  category: TrainingCategory;
  isRequired: boolean;
  order: number;
  attachments: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Frontend-only relationship field
  completions?: TrainingCompletion[];
}

/**
 * Training completion tracking
 *
 * @aligned_with backend/src/database/models/administration/TrainingCompletion.ts
 * @note Backend has timestamps: false, so no updatedAt field
 */
export interface TrainingCompletion {
  id: string;
  userId: string;
  moduleId: string;
  score?: number;
  completedAt: string;
  expiresAt?: string;
  certificateUrl?: string;
  notes?: string;
  createdAt: string;

  // Frontend-only relationship field
  module?: TrainingModule;
}

/**
 * Create training module request
 */
export interface CreateTrainingModuleData {
  title: string;
  description?: string;
  content: string;
  duration?: number;
  category: TrainingCategory;
  isRequired?: boolean;
  order?: number;
  attachments?: string[];
}

/**
 * Update training module request
 */
export interface UpdateTrainingModuleData {
  title?: string;
  description?: string;
  content?: string;
  duration?: number;
  category?: TrainingCategory;
  isRequired?: boolean;
  order?: number;
  attachments?: string[];
}

/**
 * Training completion request
 */
export interface RecordTrainingCompletionData {
  score?: number;
}

/**
 * User training progress
 */
export interface UserTrainingProgress {
  completions: TrainingCompletion[];
  totalModules: number;
  completedModules: number;
  requiredModules: number;
  completedRequired: number;
  completionPercentage: number;
}
