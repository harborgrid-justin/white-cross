/**
 * Administration API - Training Completion Tracking
 *
 * @deprecated This service is deprecated and will be removed in a future version.
 * Use '@/lib/actions/compliance.training' server actions instead.
 *
 * Migration Path:
 * 1. Replace ApiClient-based service with server actions
 * 2. Update imports from '@/lib/actions/compliance.training'
 * 3. Remove service instantiation code
 *
 * @example Migration example
 * ```typescript
 * // DEPRECATED: Legacy approach
 * import { createTrainingCompletionService } from '@/services/modules/administrationApi/training';
 * const service = createTrainingCompletionService(apiClient);
 * const completion = await service.recordTrainingCompletion(userId, moduleId, data);
 * const progress = await service.getUserTrainingProgress(userId);
 *
 * // RECOMMENDED: Server actions approach
 * import { recordTrainingCompletion, getUserTrainingProgress } from '@/lib/actions/compliance.training';
 * const completion = await recordTrainingCompletion(userId, moduleId, data);
 * const progress = await getUserTrainingProgress(userId);
 * ```
 *
 * Training completion and progress tracking including:
 * - Completion recording
 * - User progress monitoring
 * - Certificate generation
 * - Training statistics and reporting
 * - Reminder notifications
 *
 * @module services/modules/administrationApi/training/training-completions
 */

import type { ApiClient } from '../../../core/ApiClient';
import { API_ENDPOINTS } from '../../../../constants/api';
import { z, type ZodIssue } from 'zod';
import {
  ApiResponse,
  PaginatedResponse,
} from '../../../types';
import { createApiError, createValidationError } from '../../../core/errors';
import type {
  TrainingCompletion,
  RecordTrainingCompletionData,
  UserTrainingProgress,
} from '../types';
import { TrainingCategory } from '../types';
import {
  recordTrainingCompletionSchema,
} from '../validation';

/**
 * Training Completion Tracking Service
 */
export class TrainingCompletionService {
  private readonly baseEndpoint = API_ENDPOINTS.ADMIN.TRAINING;

  constructor(private readonly client: ApiClient) {}

  /**
   * Sanitize error messages to prevent sensitive information exposure
   */
  private sanitizeError(error: unknown): Error {
    return createApiError(error, 'Training completion operation failed');
  }

  /**
   * Record training completion
   */
  async recordTrainingCompletion(userId: string, moduleId: string, completionData: RecordTrainingCompletionData = {}): Promise<TrainingCompletion> {
    try {
      if (!userId) throw new Error('User ID is required');
      if (!moduleId) throw new Error('Module ID is required');

      recordTrainingCompletionSchema.parse(completionData);

      const response = await this.client.post<ApiResponse<{ completion: TrainingCompletion }>>(
        API_ENDPOINTS.ADMIN.TRAINING_COMPLETE(moduleId),
        { userId, ...completionData }
      );

      return response.data.data.completion;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get training completion by ID
   */
  async getTrainingCompletionById(id: string): Promise<TrainingCompletion> {
    try {
      if (!id) throw new Error('Completion ID is required');

      const response = await this.client.get<ApiResponse<{ completion: TrainingCompletion }>>(
        `${this.baseEndpoint}/completions/${id}`
      );

      return response.data.data.completion;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get training completions with filtering
   */
  async getTrainingCompletions(filters: {
    page?: number;
    limit?: number;
    userId?: string;
    moduleId?: string;
    startDate?: string;
    endDate?: string;
    minScore?: number;
  } = {}): Promise<PaginatedResponse<TrainingCompletion>> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.moduleId) params.append('moduleId', filters.moduleId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.minScore) params.append('minScore', String(filters.minScore));

      const response = await this.client.get<ApiResponse<PaginatedResponse<TrainingCompletion>>>(
        `${this.baseEndpoint}/completions?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get user training progress
   */
  async getUserTrainingProgress(userId: string): Promise<UserTrainingProgress> {
    try {
      if (!userId) throw new Error('User ID is required');

      const response = await this.client.get<ApiResponse<{ progress: UserTrainingProgress }>>(
        API_ENDPOINTS.ADMIN.TRAINING_PROGRESS(userId)
      );

      return response.data.data.progress;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get all users training progress with filtering
   */
  async getAllUsersTrainingProgress(filters: {
    page?: number;
    limit?: number;
    incompleteOnly?: boolean;
    overdueOnly?: boolean;
    category?: TrainingCategory;
  } = {}): Promise<PaginatedResponse<UserTrainingProgress>> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.incompleteOnly !== undefined) params.append('incompleteOnly', String(filters.incompleteOnly));
      if (filters.overdueOnly !== undefined) params.append('overdueOnly', String(filters.overdueOnly));
      if (filters.category) params.append('category', filters.category);

      const response = await this.client.get<ApiResponse<PaginatedResponse<UserTrainingProgress>>>(
        `${this.baseEndpoint}/progress?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Download training certificate
   */
  async downloadTrainingCertificate(completionId: string): Promise<Blob> {
    try {
      if (!completionId) throw new Error('Completion ID is required');

      const response = await this.client.get<Blob>(
        `${this.baseEndpoint}/completions/${completionId}/certificate`,
        { responseType: 'blob' }
      );

      return response.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Generate certificate for completion
   */
  async generateCertificate(completionId: string): Promise<{ certificateUrl: string }> {
    try {
      if (!completionId) throw new Error('Completion ID is required');

      const response = await this.client.post<ApiResponse<{ certificateUrl: string }>>(
        `${this.baseEndpoint}/completions/${completionId}/generate-certificate`,
        {}
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get training statistics
   */
  async getTrainingStatistics(filters: {
    startDate?: string;
    endDate?: string;
    category?: TrainingCategory;
    userId?: string;
  } = {}): Promise<{
    totalCompletions: number;
    averageScore: number;
    averageCompletionTime: number;
    completionRate: number;
    topPerformers: Array<{
      userId: string;
      userName: string;
      completedModules: number;
      averageScore: number;
    }>;
    categoryBreakdown: Array<{
      category: TrainingCategory;
      completions: number;
      averageScore: number;
    }>;
    overdueUsers: Array<{
      userId: string;
      userName: string;
      overdueModules: number;
    }>;
  }> {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.category) params.append('category', filters.category);
      if (filters.userId) params.append('userId', filters.userId);

      const response = await this.client.get<ApiResponse<{
        totalCompletions: number;
        averageScore: number;
        averageCompletionTime: number;
        completionRate: number;
        topPerformers: Array<{
          userId: string;
          userName: string;
          completedModules: number;
          averageScore: number;
        }>;
        categoryBreakdown: Array<{
          category: TrainingCategory;
          completions: number;
          averageScore: number;
        }>;
        overdueUsers: Array<{
          userId: string;
          userName: string;
          overdueModules: number;
        }>;
      }>>(
        `${this.baseEndpoint}/statistics?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Send training reminders
   */
  async sendTrainingReminders(options: {
    userIds?: string[];
    category?: TrainingCategory;
    overdueOnly?: boolean;
    customMessage?: string;
  } = {}): Promise<{
    sent: number;
    failed: number;
    errors: Array<{
      userId: string;
      error: string;
    }>;
  }> {
    try {
      const reminderSchema = z.object({
        userIds: z.array(z.string().uuid('Invalid user ID')).optional(),
        category: z.nativeEnum(TrainingCategory).optional(),
        overdueOnly: z.boolean().optional().default(true),
        customMessage: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
      });

      reminderSchema.parse(options);

      const response = await this.client.post<ApiResponse<{
        sent: number;
        failed: number;
        errors: Array<{
          userId: string;
          error: string;
        }>;
      }>>(
        `${this.baseEndpoint}/send-reminders`,
        options
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }
}

/**
 * Factory function for TrainingCompletionService
 */
export function createTrainingCompletionService(client: ApiClient): TrainingCompletionService {
  return new TrainingCompletionService(client);
}
