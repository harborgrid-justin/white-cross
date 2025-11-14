/**
 * @fileoverview Training Management Service Module
 * @module services/modules/administration/TrainingManagement
 * @category Services - Administration - Training Management
 *
 * Provides training module and progress tracking functionality including:
 * - Training module CRUD operations with validation
 * - Training completion tracking
 * - User progress monitoring
 * - Category-based filtering
 * - Type-safe training operations
 *
 * @example
 * ```typescript
 * import { TrainingManagementService } from '@/services/modules/administration/TrainingManagement';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const trainingService = new TrainingManagementService(apiClient);
 * const modules = await trainingService.getTrainingModules('HIPAA_COMPLIANCE');
 * await trainingService.recordTrainingCompletion(moduleId);
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { ApiResponse } from '../../utils/apiUtils';
import { z } from 'zod';
import { createApiError, createValidationError } from '../../core/errors';
import {
  TrainingModule,
  TrainingCompletion,
  UserTrainingProgress,
  CreateTrainingModuleData,
  UpdateTrainingModuleData,
  RecordTrainingCompletionData,
  TrainingCategory,
} from '../../../types/domain/administration';

// ==================== TRAINING MODULE VALIDATION SCHEMAS ====================

/**
 * Validation schema for creating a new training module
 */
export const createTrainingModuleSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z.string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(50000, 'Content cannot exceed 50,000 characters'),
  duration: z.number()
    .min(1, 'Duration must be at least 1 minute')
    .max(600, 'Duration cannot exceed 600 minutes (10 hours)')
    .optional(),
  category: z.enum(['HIPAA_COMPLIANCE', 'MEDICATION_MANAGEMENT', 'EMERGENCY_PROCEDURES', 'SYSTEM_TRAINING', 'SAFETY_PROTOCOLS', 'DATA_SECURITY']),
  isRequired: z.boolean().optional(),
  order: z.number()
    .min(0, 'Order cannot be negative')
    .max(10000, 'Order cannot exceed 10,000')
    .optional(),
  attachments: z.array(z.string().max(500, 'Attachment URL cannot exceed 500 characters'))
    .max(20, 'Cannot have more than 20 attachments')
    .optional(),
});

/**
 * Validation schema for updating an existing training module
 */
export const updateTrainingModuleSchema = createTrainingModuleSchema.partial();

// ==================== TRAINING MANAGEMENT SERVICE ====================

/**
 * Service class for training management operations
 */
export class TrainingManagementService {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get all training modules with optional category filtering
   * @param category - Optional training category filter
   * @returns Array of training modules
   * @throws {ApiError} When the API request fails
   */
  async getTrainingModules(category?: TrainingCategory): Promise<TrainingModule[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);

      const response = await this.client.get<ApiResponse<{ modules: TrainingModule[] }>>(
        `${API_ENDPOINTS.ADMIN.TRAINING}${params.toString() ? '?' + params.toString() : ''}`
      );

      return response.data.data.modules;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch training modules');
    }
  }

  /**
   * Get training module by ID
   * @param id - Training module ID
   * @returns Training module object
   * @throws {ApiError} When the API request fails or module not found
   */
  async getTrainingModuleById(id: string): Promise<TrainingModule> {
    try {
      if (!id) throw new Error('Module ID is required');

      const response = await this.client.get<ApiResponse<{ module: TrainingModule }>>(
        API_ENDPOINTS.ADMIN.TRAINING_BY_ID(id)
      );

      return response.data.data.module;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch training module');
    }
  }

  /**
   * Create new training module with validation
   * @param moduleData - Training module data to create
   * @returns Created training module object
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When the API request fails
   */
  async createTrainingModule(moduleData: CreateTrainingModuleData): Promise<TrainingModule> {
    try {
      createTrainingModuleSchema.parse(moduleData);

      const response = await this.client.post<ApiResponse<{ module: TrainingModule }>>(
        API_ENDPOINTS.ADMIN.TRAINING,
        moduleData
      );

      return response.data.data.module;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to create training module');
    }
  }

  /**
   * Update existing training module
   * @param id - Training module ID to update
   * @param moduleData - Partial training module data to update
   * @returns Updated training module object
   * @throws {ApiError} When the API request fails or module not found
   */
  async updateTrainingModule(id: string, moduleData: UpdateTrainingModuleData): Promise<TrainingModule> {
    try {
      if (!id) throw new Error('Module ID is required');

      const response = await this.client.put<ApiResponse<{ module: TrainingModule }>>(
        API_ENDPOINTS.ADMIN.TRAINING_BY_ID(id),
        moduleData
      );

      return response.data.data.module;
    } catch (error) {
      throw createApiError(error, 'Failed to update training module');
    }
  }

  /**
   * Delete training module
   * @param id - Training module ID to delete
   * @returns Success message
   * @throws {ApiError} When the API request fails or module not found
   */
  async deleteTrainingModule(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('Module ID is required');

      const response = await this.client.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.ADMIN.TRAINING_BY_ID(id)
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to delete training module');
    }
  }

  /**
   * Record training completion for a user
   * @param moduleId - Training module ID
   * @param completionData - Optional completion data (score, notes)
   * @returns Training completion record
   * @throws {ApiError} When the API request fails
   */
  async recordTrainingCompletion(
    moduleId: string,
    completionData: RecordTrainingCompletionData = {}
  ): Promise<TrainingCompletion> {
    try {
      if (!moduleId) throw new Error('Module ID is required');

      const response = await this.client.post<ApiResponse<{ completion: TrainingCompletion }>>(
        API_ENDPOINTS.ADMIN.TRAINING_COMPLETE(moduleId),
        completionData
      );

      return response.data.data.completion;
    } catch (error) {
      throw createApiError(error, 'Failed to record training completion');
    }
  }

  /**
   * Get user training progress
   * @param userId - User ID
   * @returns User training progress including completed and pending modules
   * @throws {ApiError} When the API request fails or user not found
   */
  async getUserTrainingProgress(userId: string): Promise<UserTrainingProgress> {
    try {
      if (!userId) throw new Error('User ID is required');

      const response = await this.client.get<ApiResponse<UserTrainingProgress>>(
        API_ENDPOINTS.ADMIN.TRAINING_PROGRESS(userId)
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch user training progress');
    }
  }
}

/**
 * Factory function to create a TrainingManagementService instance
 * @param client - ApiClient instance
 * @returns TrainingManagementService instance
 */
export function createTrainingManagementService(client: ApiClient): TrainingManagementService {
  return new TrainingManagementService(client);
}
