/**
 * Administration API - Training Modules Management
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
 * import { createTrainingModulesService } from '@/services/modules/administrationApi/training';
 * const service = createTrainingModulesService(apiClient);
 * const modules = await service.getTrainingModules({ category: 'HIPAA' });
 * const module = await service.createTrainingModule(data);
 *
 * // RECOMMENDED: Server actions approach
 * import { getTrainingModules, createTrainingModule } from '@/lib/actions/compliance.training';
 * const modules = await getTrainingModules({ category: 'HIPAA' });
 * const module = await createTrainingModule(data);
 * ```
 *
 * Training module CRUD operations including:
 * - Module creation and updates
 * - Bulk operations and reordering
 * - Category-based filtering
 * - Export functionality
 *
 * @module services/modules/administrationApi/training/training-modules
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
  TrainingModule,
  CreateTrainingModuleData,
  UpdateTrainingModuleData,
} from '../types';
import { TrainingCategory } from '../types';
import {
  createTrainingModuleSchema,
  updateTrainingModuleSchema,
} from '../validation';

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
 * Factory function for TrainingModulesService
 */
export function createTrainingModulesService(client: ApiClient): TrainingModulesService {
  return new TrainingModulesService(client);
}
