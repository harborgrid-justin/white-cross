/**
 * WF-COMP-315 | administration-training.ts - Training Module Type Definitions
 * Purpose: Type definitions for training module management and completion tracking
 * Upstream: administration-enums.ts | Dependencies: None
 * Downstream: Training management components | Called by: Training UI, completion tracking
 * Related: administration-users.ts (training completions are per user)
 * Exports: Training module types, completion tracking interfaces
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Training module management and compliance tracking
 * LLM Context: Type definitions for training modules with completion tracking
 */

import type { TrainingCategory } from './administration-enums';

/**
 * Training Module Types
 *
 * Type definitions for:
 * - Training module entities
 * - Completion tracking
 * - User progress monitoring
 * - Certification management
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
