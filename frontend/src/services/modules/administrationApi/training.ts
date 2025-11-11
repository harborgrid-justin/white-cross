/**
 * Administration API - Training Management
 * 
 * Comprehensive training and compliance management including:
 * - Training module CRUD operations
 * - Training completion tracking
 * - User progress monitoring
 * - Compliance reporting
 * - Certificate generation
 * 
 * @module services/modules/administrationApi/training
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { z, type ZodIssue } from 'zod';
import {
  ApiResponse,
  PaginatedResponse,
} from '../../types';
import { createApiError, createValidationError } from '../../core/errors';
import type {
  TrainingModule,
  CreateTrainingModuleData,
  UpdateTrainingModuleData,
  TrainingCompletion,
  RecordTrainingCompletionData,
  UserTrainingProgress
} from './types';
import { TrainingCategory } from './types';
import {
  createTrainingModuleSchema,
  updateTrainingModuleSchema,
  recordTrainingCompletionSchema
} from './validation';

/**
 * Training Modules Management Service
 */
export class TrainingModulesService {
  private readonly baseEndpoint = API_ENDPOINTS.ADMIN.TRAINING;

  constructor(private readonly client: ApiClient) {}

  /**
   * Sanitize error messages to prevent sensitive information exposure
   */
  private sanitizeError(error: unknown): Error {
    return createApiError(error, 'Training module operation failed');
  }

  /**
   * Get all training modules with pagination and filtering
   */
  async getTrainingModules(filters: {
    page?: number;
    limit?: number;
    search?: string;
    category?: TrainingCategory;
    isRequired?: boolean;
    isActive?: boolean;
  } = {}): Promise<PaginatedResponse<TrainingModule>> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.isRequired !== undefined) params.append('isRequired', String(filters.isRequired));
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const response = await this.client.get<ApiResponse<PaginatedResponse<TrainingModule>>>(
        `${this.baseEndpoint}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get training module by ID
   */
  async getTrainingModuleById(id: string): Promise<TrainingModule> {
    try {
      if (!id) throw new Error('Training module ID is required');

      const response = await this.client.get<ApiResponse<{ module: TrainingModule }>>(
        API_ENDPOINTS.ADMIN.TRAINING_BY_ID(id)
      );

      return response.data.data.module;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create training module
   */
  async createTrainingModule(moduleData: CreateTrainingModuleData): Promise<TrainingModule> {
    try {
      createTrainingModuleSchema.parse(moduleData);

      const response = await this.client.post<ApiResponse<{ module: TrainingModule }>>(
        this.baseEndpoint,
        moduleData
      );

      return response.data.data.module;
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
   * Update training module
   */
  async updateTrainingModule(id: string, moduleData: UpdateTrainingModuleData): Promise<TrainingModule> {
    try {
      if (!id) throw new Error('Training module ID is required');

      updateTrainingModuleSchema.parse(moduleData);

      const response = await this.client.put<ApiResponse<{ module: TrainingModule }>>(
        API_ENDPOINTS.ADMIN.TRAINING_BY_ID(id),
        moduleData
      );

      return response.data.data.module;
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
   * Delete training module
   */
  async deleteTrainingModule(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('Training module ID is required');

      const response = await this.client.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.ADMIN.TRAINING_BY_ID(id)
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Duplicate training module
   */
  async duplicateTrainingModule(id: string, newTitle?: string): Promise<TrainingModule> {
    try {
      if (!id) throw new Error('Training module ID is required');

      const data = newTitle ? { title: newTitle } : {};

      const response = await this.client.post<ApiResponse<{ module: TrainingModule }>>(
        `${API_ENDPOINTS.ADMIN.TRAINING_BY_ID(id)}/duplicate`,
        data
      );

      return response.data.data.module;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get training modules by category
   */
  async getTrainingModulesByCategory(category: TrainingCategory, filters: Omit<Parameters<TrainingModulesService['getTrainingModules']>[0], 'category'> = {}): Promise<PaginatedResponse<TrainingModule>> {
    try {
      const filtersWithCategory = { ...filters, category };
      return await this.getTrainingModules(filtersWithCategory);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Reorder training modules
   */
  async reorderTrainingModules(moduleIds: string[]): Promise<{ message: string }> {
    try {
      if (!moduleIds.length) throw new Error('Module IDs are required');

      const reorderSchema = z.array(z.string().uuid('Invalid module ID')).min(1, 'At least one module ID is required');
      reorderSchema.parse(moduleIds);

      const response = await this.client.post<ApiResponse<{ message: string }>>(
        `${this.baseEndpoint}/reorder`,
        { moduleIds }
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          'Invalid module IDs',
          'moduleIds',
          { moduleIds: ['Invalid module ID format'] },
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Bulk operations for training modules
   */
  async bulkUpdateTrainingModules(operations: Array<{
    moduleId: string;
    operation: 'activate' | 'deactivate' | 'delete' | 'update';
    data?: Partial<UpdateTrainingModuleData>;
  }>): Promise<{
    successful: number;
    failed: number;
    errors: Array<{
      moduleId: string;
      operation: string;
      error: string;
    }>;
  }> {
    try {
      const bulkSchema = z.array(z.object({
        moduleId: z.string().uuid('Invalid module ID'),
        operation: z.enum(['activate', 'deactivate', 'delete', 'update']),
        data: updateTrainingModuleSchema.partial().optional(),
      })).min(1, 'At least one operation is required').max(50, 'Maximum 50 operations per request');

      bulkSchema.parse(operations);

      const response = await this.client.post<ApiResponse<{
        successful: number;
        failed: number;
        errors: Array<{
          moduleId: string;
          operation: string;
          error: string;
        }>;
      }>>(
        `${this.baseEndpoint}/bulk`,
        { operations }
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

  /**
   * Export training modules
   */
  async exportTrainingModules(options: {
    format?: 'json' | 'csv' | 'pdf';
    category?: TrainingCategory;
    isActive?: boolean;
  } = {}): Promise<Blob> {
    try {
      const exportSchema = z.object({
        format: z.enum(['json', 'csv', 'pdf']).optional().default('csv'),
        category: z.nativeEnum(TrainingCategory).optional(),
        isActive: z.boolean().optional(),
      });

      const validatedOptions = exportSchema.parse(options);

      const params = new URLSearchParams();
      params.append('format', validatedOptions.format);
      if (validatedOptions.category) params.append('category', validatedOptions.category);
      if (validatedOptions.isActive !== undefined) params.append('isActive', String(validatedOptions.isActive));

      const response = await this.client.get<Blob>(
        `${this.baseEndpoint}/export?${params.toString()}`,
        { responseType: 'blob' }
      );

      return response.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          'Invalid export options',
          'export',
          { export: ['Invalid export configuration'] },
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }
}

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
 * Combined Training Management Service
 */
export class TrainingService {
  public readonly modules: TrainingModulesService;
  public readonly completions: TrainingCompletionService;

  constructor(client: ApiClient) {
    this.modules = new TrainingModulesService(client);
    this.completions = new TrainingCompletionService(client);
  }

  /**
   * Get training dashboard data
   */
  async getTrainingDashboard(): Promise<{
    totalModules: number;
    activeModules: number;
    requiredModules: number;
    totalCompletions: number;
    recentCompletions: TrainingCompletion[];
    overdueUsers: number;
    averageScore: number;
    completionRate: number;
    modulesByCategory: Array<{
      category: TrainingCategory;
      count: number;
      requiredCount: number;
    }>;
  }> {
    try {
      const response = await this.modules['client'].get<ApiResponse<{
        totalModules: number;
        activeModules: number;
        requiredModules: number;
        totalCompletions: number;
        recentCompletions: TrainingCompletion[];
        overdueUsers: number;
        averageScore: number;
        completionRate: number;
        modulesByCategory: Array<{
          category: TrainingCategory;
          count: number;
          requiredCount: number;
        }>;
      }>>(
        `${this.modules['baseEndpoint']}/dashboard`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch training dashboard');
    }
  }

  /**
   * Get compliance report
   */
  async getComplianceReport(filters: {
    category?: TrainingCategory;
    includeExpired?: boolean;
    format?: 'json' | 'csv' | 'pdf';
  } = {}): Promise<Blob | {
    users: Array<{
      userId: string;
      userName: string;
      email: string;
      completionRate: number;
      requiredCompleted: number;
      requiredTotal: number;
      overdueModules: string[];
      lastActivity?: string;
    }>;
    summary: {
      totalUsers: number;
      compliantUsers: number;
      nonCompliantUsers: number;
      averageCompletionRate: number;
    };
  }> {
    try {
      const reportSchema = z.object({
        category: z.nativeEnum(TrainingCategory).optional(),
        includeExpired: z.boolean().optional().default(false),
        format: z.enum(['json', 'csv', 'pdf']).optional().default('json'),
      });

      const validatedFilters = reportSchema.parse(filters);

      const params = new URLSearchParams();
      if (validatedFilters.category) params.append('category', validatedFilters.category);
      if (validatedFilters.includeExpired !== undefined) params.append('includeExpired', String(validatedFilters.includeExpired));
      params.append('format', validatedFilters.format);

      if (validatedFilters.format === 'json') {
        const response = await this.modules['client'].get<ApiResponse<{
          users: Array<{
            userId: string;
            userName: string;
            email: string;
            completionRate: number;
            requiredCompleted: number;
            requiredTotal: number;
            overdueModules: string[];
            lastActivity?: string;
          }>;
          summary: {
            totalUsers: number;
            compliantUsers: number;
            nonCompliantUsers: number;
            averageCompletionRate: number;
          };
        }>>(
          `${this.modules['baseEndpoint']}/compliance-report?${params.toString()}`
        );

        return response.data.data;
      } else {
        const response = await this.modules['client'].get<Blob>(
          `${this.modules['baseEndpoint']}/compliance-report?${params.toString()}`,
          { responseType: 'blob' }
        );

        return response.data;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          'Invalid report filters',
          'filters',
          { filters: ['Invalid report configuration'] },
          error
        );
      }
      throw createApiError(error, 'Failed to generate compliance report');
    }
  }
}

/**
 * Factory functions
 */
export function createTrainingModulesService(client: ApiClient): TrainingModulesService {
  return new TrainingModulesService(client);
}

export function createTrainingCompletionService(client: ApiClient): TrainingCompletionService {
  return new TrainingCompletionService(client);
}

export function createTrainingService(client: ApiClient): TrainingService {
  return new TrainingService(client);
}
