/**
 * Administration API - Configuration Management
 * 
 * Comprehensive system configuration management including:
 * - System settings CRUD operations
 * - Configuration validation and backup
 * - Environment-specific configurations
 * - Feature flags and toggles
 * - Integration settings
 * 
 * @module services/modules/administrationApi/configuration
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
  SystemConfiguration,
  ConfigurationData,
  BaseEntity
} from './types';

// Define ConfigurationBackup type locally since it's not in the main types file
interface ConfigurationBackup extends BaseEntity {
  name: string;
  description?: string;
  fileSize: number;
  configCount: number;
  categories: string[];
  createdBy: string;
}
import {
  configurationSchema
} from './validation';

/**
 * System Configuration Management Service
 */
export class ConfigurationService {
  private readonly baseEndpoint = API_ENDPOINTS.ADMIN.CONFIGURATIONS;

  constructor(private readonly client: ApiClient) {}

  /**
   * Sanitize error messages to prevent sensitive information exposure
   */
  private sanitizeError(error: unknown): Error {
    return createApiError(error, 'Configuration operation failed');
  }

  /**
   * Get all configurations with pagination and filtering
   */
  async getConfigurations(filters: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    environment?: string;
    isActive?: boolean;
  } = {}): Promise<PaginatedResponse<SystemConfiguration>> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.environment) params.append('environment', filters.environment);
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const response = await this.client.get<ApiResponse<PaginatedResponse<SystemConfiguration>>>(
        `${this.baseEndpoint}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get configuration by ID
   */
  async getConfigurationById(id: string): Promise<SystemConfiguration> {
    try {
      if (!id) throw new Error('Configuration ID is required');

      const response = await this.client.get<ApiResponse<{ configuration: SystemConfiguration }>>(
        `${this.baseEndpoint}/${id}`
      );

      return response.data.data.configuration;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get configuration by key
   */
  async getConfigurationByKey(key: string): Promise<SystemConfiguration> {
    try {
      if (!key) throw new Error('Configuration key is required');

      const response = await this.client.get<ApiResponse<{ configuration: SystemConfiguration }>>(
        API_ENDPOINTS.ADMIN.CONFIGURATION_BY_KEY(key)
      );

      return response.data.data.configuration;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get configurations by category
   */
  async getConfigurationsByCategory(category: string, filters: {
    page?: number;
    limit?: number;
    environment?: string;
    isActive?: boolean;
  } = {}): Promise<PaginatedResponse<SystemConfiguration>> {
    try {
      if (!category) throw new Error('Category is required');

      const filtersWithCategory = { ...filters, category };
      return await this.getConfigurations(filtersWithCategory);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create configuration
   */
  async createConfiguration(configData: ConfigurationData): Promise<SystemConfiguration> {
    try {
      configurationSchema.parse(configData);

      const response = await this.client.post<ApiResponse<{ configuration: SystemConfiguration }>>(
        this.baseEndpoint,
        configData
      );

      return response.data.data.configuration;
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
   * Update configuration
   */
  async updateConfiguration(id: string, configData: Partial<ConfigurationData>): Promise<SystemConfiguration> {
    try {
      if (!id) throw new Error('Configuration ID is required');

      configurationSchema.partial().parse(configData);

      const response = await this.client.put<ApiResponse<{ configuration: SystemConfiguration }>>(
        `${this.baseEndpoint}/${id}`,
        configData
      );

      return response.data.data.configuration;
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
   * Update configuration by key
   */
  async updateConfigurationByKey(key: string, value: unknown, metadata?: Record<string, unknown>): Promise<SystemConfiguration> {
    try {
      if (!key) throw new Error('Configuration key is required');

      const updateData = {
        value,
        ...(metadata && { metadata })
      };

      const response = await this.client.put<ApiResponse<{ configuration: SystemConfiguration }>>(
        API_ENDPOINTS.ADMIN.CONFIGURATION_BY_KEY(key),
        updateData
      );

      return response.data.data.configuration;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete configuration
   */
  async deleteConfiguration(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('Configuration ID is required');

      const response = await this.client.delete<ApiResponse<{ message: string }>>(
        `${this.baseEndpoint}/${id}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Validate configuration
   */
  async validateConfiguration(configData: ConfigurationData | Partial<ConfigurationData>): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const response = await this.client.post<ApiResponse<{
        isValid: boolean;
        errors: string[];
        warnings: string[];
      }>>(
        `${this.baseEndpoint}/validate`,
        configData
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Bulk update configurations
   */
  async bulkUpdateConfigurations(updates: Array<{
    id: string;
    data: Partial<ConfigurationData>;
  }>): Promise<{
    successful: number;
    failed: number;
    results: Array<{
      id: string;
      success: boolean;
      configuration?: SystemConfiguration;
      error?: string;
    }>;
  }> {
    try {
      const bulkSchema = z.array(z.object({
        id: z.string().uuid('Invalid configuration ID'),
        data: configurationSchema.partial(),
      })).min(1, 'At least one update is required').max(50, 'Maximum 50 updates per request');

      bulkSchema.parse(updates);

      const response = await this.client.post<ApiResponse<{
        successful: number;
        failed: number;
        results: Array<{
          id: string;
          success: boolean;
          configuration?: SystemConfiguration;
          error?: string;
        }>;
      }>>(
        `${this.baseEndpoint}/bulk-update`,
        { updates }
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
   * Create configuration backup
   */
  async createBackup(options: {
    name?: string;
    description?: string;
    includeCategories?: string[];
    excludeCategories?: string[];
  } = {}): Promise<ConfigurationBackup> {
    try {
      const backupSchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        includeCategories: z.array(z.string()).optional(),
        excludeCategories: z.array(z.string()).optional(),
      });

      backupSchema.parse(options);

      const response = await this.client.post<ApiResponse<{ backup: ConfigurationBackup }>>(
        `${this.baseEndpoint}/backup`,
        options
      );

      return response.data.data.backup;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          'Invalid backup options',
          'backup',
          { backup: ['Invalid backup configuration'] },
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Restore configuration from backup
   */
  async restoreFromBackup(backupId: string, options: {
    overwriteExisting?: boolean;
    includeCategories?: string[];
    excludeCategories?: string[];
  } = {}): Promise<{
    restored: number;
    skipped: number;
    errors: Array<{
      key: string;
      error: string;
    }>;
  }> {
    try {
      if (!backupId) throw new Error('Backup ID is required');

      const restoreSchema = z.object({
        overwriteExisting: z.boolean().optional().default(false),
        includeCategories: z.array(z.string()).optional(),
        excludeCategories: z.array(z.string()).optional(),
      });

      restoreSchema.parse(options);

      const response = await this.client.post<ApiResponse<{
        restored: number;
        skipped: number;
        errors: Array<{
          key: string;
          error: string;
        }>;
      }>>(
        `${this.baseEndpoint}/restore/${backupId}`,
        options
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          'Invalid restore options',
          'restore',
          { restore: ['Invalid restore configuration'] },
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get configuration backups
   */
  async getBackups(filters: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<PaginatedResponse<ConfigurationBackup>> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.search) params.append('search', filters.search);

      const response = await this.client.get<ApiResponse<PaginatedResponse<ConfigurationBackup>>>(
        `${this.baseEndpoint}/backups?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete configuration backup
   */
  async deleteBackup(backupId: string): Promise<{ message: string }> {
    try {
      if (!backupId) throw new Error('Backup ID is required');

      const response = await this.client.delete<ApiResponse<{ message: string }>>(
        `${this.baseEndpoint}/backups/${backupId}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get configuration categories
   */
  async getCategories(): Promise<Array<{
    name: string;
    description: string;
    count: number;
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ categories: Array<{
        name: string;
        description: string;
        count: number;
      }> }>>(
        `${this.baseEndpoint}/categories`
      );

      return response.data.data.categories;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get configuration environments
   */
  async getEnvironments(): Promise<Array<{
    name: string;
    description: string;
    count: number;
    isActive: boolean;
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ environments: Array<{
        name: string;
        description: string;
        count: number;
        isActive: boolean;
      }> }>>(
        `${this.baseEndpoint}/environments`
      );

      return response.data.data.environments;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Reset configuration to default value
   */
  async resetToDefault(id: string): Promise<SystemConfiguration> {
    try {
      if (!id) throw new Error('Configuration ID is required');

      const response = await this.client.post<ApiResponse<{ configuration: SystemConfiguration }>>(
        `${this.baseEndpoint}/${id}/reset`,
        {}
      );

      return response.data.data.configuration;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get configuration history
   */
  async getConfigurationHistory(id: string, filters: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<PaginatedResponse<{
    id: string;
    configurationId: string;
    previousValue: unknown;
    newValue: unknown;
    changedBy: string;
    changedAt: string;
    reason?: string;
  }>> {
    try {
      if (!id) throw new Error('Configuration ID is required');

      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await this.client.get<ApiResponse<PaginatedResponse<{
        id: string;
        configurationId: string;
        previousValue: unknown;
        newValue: unknown;
        changedBy: string;
        changedAt: string;
        reason?: string;
      }>>>(
        `${this.baseEndpoint}/${id}/history?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Export configurations
   */
  async exportConfigurations(options: {
    format?: 'json' | 'yaml' | 'env';
    categories?: string[];
    environment?: string;
  } = {}): Promise<Blob> {
    try {
      const exportSchema = z.object({
        format: z.enum(['json', 'yaml', 'env']).optional().default('json'),
        categories: z.array(z.string()).optional(),
        environment: z.string().optional(),
      });

      const validatedOptions = exportSchema.parse(options);

      const params = new URLSearchParams();
      params.append('format', validatedOptions.format);
      if (validatedOptions.categories) {
        validatedOptions.categories.forEach(cat => params.append('categories', cat));
      }
      if (validatedOptions.environment) params.append('environment', validatedOptions.environment);

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

  /**
   * Import configurations
   */
  async importConfigurations(file: File, options: {
    overwriteExisting?: boolean;
    validateOnly?: boolean;
    environment?: string;
  } = {}): Promise<{
    imported: number;
    skipped: number;
    errors: Array<{
      key: string;
      error: string;
    }>;
    warnings: string[];
  }> {
    try {
      const importSchema = z.object({
        overwriteExisting: z.boolean().optional().default(false),
        validateOnly: z.boolean().optional().default(false),
        environment: z.string().optional(),
      });

      importSchema.parse(options);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(options));

      const response = await this.client.post<ApiResponse<{
        imported: number;
        skipped: number;
        errors: Array<{
          key: string;
          error: string;
        }>;
        warnings: string[];
      }>>(
        `${this.baseEndpoint}/import`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          'Invalid import options',
          'import',
          { import: ['Invalid import configuration'] },
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }
}

/**
 * Factory function
 */
export function createConfigurationService(client: ApiClient): ConfigurationService {
  return new ConfigurationService(client);
}
