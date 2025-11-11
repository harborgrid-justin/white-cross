/**
 * @fileoverview Specialized administration operations for advanced system management
 * 
 * This module provides advanced administration operations including backup management,
 * license management, system configuration, performance metrics, training modules,
 * and audit logging capabilities.
 * 
 * @module services/modules/administrationApi/specialized-operations
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse, PaginatedResponse } from '../../utils/apiUtils';
import { createApiError, createValidationError } from '../../core/errors';
import { z } from 'zod';

// Import validation schemas
import {
  createLicenseSchema,
  updateLicenseSchema,
  createTrainingModuleSchema,
  updateTrainingModuleSchema,
  configurationSchema,
} from './validation';

// Import types
import type {
  BackupLog,
  License,
  SystemConfiguration,
  PerformanceMetric,
  TrainingModule,
  TrainingCompletion,
  UserTrainingProgress,
  AuditLog,
  CreateLicenseData,
  UpdateLicenseData,
  CreateTrainingModuleData,
  UpdateTrainingModuleData,
  RecordTrainingCompletionData,
  RecordMetricData,
  ConfigurationData,
  ConfigCategory,
  TrainingCategory,
  MetricFilters,
  AuditLogQueryFilters,
} from './types';

/**
 * Specialized administration operations class containing advanced system management functions
 * 
 * This class handles complex administration tasks including backup management, license
 * management, system configuration, performance monitoring, training management, and
 * audit logging with proper error handling, validation, and compliance capabilities.
 */
export class AdministrationSpecializedOperations {
  constructor(private readonly client: ApiClient) {}

  // ==================== Backup Management ====================

  /**
   * Get backup logs with pagination
   */
  async getBackupLogs(page: number = 1, limit: number = 20): Promise<PaginatedResponse<BackupLog>> {
    try {
      const response = await this.client.get<ApiResponse<PaginatedResponse<BackupLog>>>(
        `${API_ENDPOINTS.ADMIN.BACKUPS}?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch backup logs');
    }
  }

  /**
   * Create manual backup
   */
  async createBackup(): Promise<BackupLog> {
    try {
      const response = await this.client.post<ApiResponse<{ backup: BackupLog }>>(
        API_ENDPOINTS.ADMIN.BACKUPS
      );
      return response.data.data.backup;
    } catch (error) {
      throw createApiError(error, 'Failed to create backup');
    }
  }

  // ==================== License Management ====================

  /**
   * Get licenses with pagination
   */
  async getLicenses(page: number = 1, limit: number = 20): Promise<PaginatedResponse<License>> {
    try {
      const response = await this.client.get<ApiResponse<PaginatedResponse<License>>>(
        `${API_ENDPOINTS.ADMIN.LICENSES}?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch licenses');
    }
  }

  /**
   * Get license by ID
   */
  async getLicenseById(id: string): Promise<License> {
    try {
      if (!id) throw new Error('License ID is required');

      const response = await this.client.get<ApiResponse<{ license: License }>>(
        API_ENDPOINTS.ADMIN.LICENSE_BY_ID(id)
      );
      return response.data.data.license;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch license');
    }
  }

  /**
   * Create license
   */
  async createLicense(licenseData: CreateLicenseData): Promise<License> {
    try {
      // Validate input data
      createLicenseSchema.parse(licenseData);

      const response = await this.client.post<ApiResponse<{ license: License }>>(
        API_ENDPOINTS.ADMIN.LICENSES,
        licenseData
      );
      return response.data.data.license;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'License validation failed',
          error.issues[0]?.path.join('.') || 'license',
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to create license');
    }
  }

  /**
   * Update license
   */
  async updateLicense(id: string, data: UpdateLicenseData): Promise<License> {
    try {
      if (!id) throw new Error('License ID is required');

      // Validate input data
      updateLicenseSchema.parse(data);

      const response = await this.client.put<ApiResponse<{ license: License }>>(
        API_ENDPOINTS.ADMIN.LICENSE_BY_ID(id),
        data
      );
      return response.data.data.license;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'License validation failed',
          error.issues[0]?.path.join('.') || 'license',
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to update license');
    }
  }

  /**
   * Deactivate license
   */
  async deactivateLicense(id: string): Promise<License> {
    try {
      if (!id) throw new Error('License ID is required');

      const response = await this.client.post<ApiResponse<{ license: License }>>(
        API_ENDPOINTS.ADMIN.LICENSE_DEACTIVATE(id)
      );
      return response.data.data.license;
    } catch (error) {
      throw createApiError(error, 'Failed to deactivate license');
    }
  }

  // ==================== System Configuration ====================

  /**
   * Get all system configurations
   */
  async getConfigurations(category?: ConfigCategory): Promise<SystemConfiguration[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);

      const response = await this.client.get<ApiResponse<{ configurations: SystemConfiguration[] }>>(
        `${API_ENDPOINTS.ADMIN.CONFIGURATIONS}${params.toString() ? '?' + params.toString() : ''}`
      );
      return response.data.data.configurations;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch configurations');
    }
  }

  /**
   * Get configuration by key
   */
  async getConfigurationByKey(key: string): Promise<SystemConfiguration> {
    try {
      if (!key) throw new Error('Configuration key is required');

      const response = await this.client.get<ApiResponse<{ config: SystemConfiguration }>>(
        API_ENDPOINTS.ADMIN.CONFIGURATION_BY_KEY(key)
      );
      return response.data.data.config;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch configuration');
    }
  }

  /**
   * Set/update configuration
   */
  async setConfiguration(configData: ConfigurationData, changedBy?: string): Promise<SystemConfiguration> {
    try {
      // Validate input data
      configurationSchema.parse(configData);

      const response = await this.client.post<ApiResponse<{ config: SystemConfiguration }>>(
        API_ENDPOINTS.ADMIN.CONFIGURATIONS,
        { ...configData, changedBy }
      );
      return response.data.data.config;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Configuration validation failed',
          error.issues[0]?.path.join('.') || 'configuration',
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to set configuration');
    }
  }

  /**
   * Delete configuration
   */
  async deleteConfiguration(key: string): Promise<{ message: string }> {
    try {
      if (!key) throw new Error('Configuration key is required');

      const response = await this.client.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.ADMIN.CONFIGURATION_BY_KEY(key)
      );
      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to delete configuration');
    }
  }

  // ==================== Performance Metrics ====================

  /**
   * Get performance metrics
   */
  async getMetrics(filters: MetricFilters = {}): Promise<PerformanceMetric[]> {
    try {
      const params = new URLSearchParams();
      if (filters.metricType) params.append('metricType', filters.metricType);
      if (filters.startDate) {
        const startDateStr = typeof filters.startDate === 'string' 
          ? filters.startDate 
          : filters.startDate.toISOString();
        params.append('startDate', startDateStr);
      }
      if (filters.endDate) {
        const endDateStr = typeof filters.endDate === 'string' 
          ? filters.endDate 
          : filters.endDate.toISOString();
        params.append('endDate', endDateStr);
      }
      if (filters.limit) params.append('limit', String(filters.limit));

      const response = await this.client.get<ApiResponse<{ metrics: PerformanceMetric[] }>>(
        `${API_ENDPOINTS.ADMIN.METRICS}?${params.toString()}`
      );
      return response.data.data.metrics;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch metrics');
    }
  }

  /**
   * Record a performance metric
   */
  async recordMetric(metricData: RecordMetricData): Promise<PerformanceMetric> {
    try {
      const response = await this.client.post<ApiResponse<{ metric: PerformanceMetric }>>(
        API_ENDPOINTS.ADMIN.METRICS,
        metricData
      );
      return response.data.data.metric;
    } catch (error) {
      throw createApiError(error, 'Failed to record metric');
    }
  }

  // ==================== Training Modules ====================

  /**
   * Get all training modules
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
   * Create training module
   */
  async createTrainingModule(moduleData: CreateTrainingModuleData): Promise<TrainingModule> {
    try {
      // Validate input data
      createTrainingModuleSchema.parse(moduleData);

      const response = await this.client.post<ApiResponse<{ module: TrainingModule }>>(
        API_ENDPOINTS.ADMIN.TRAINING,
        moduleData
      );
      return response.data.data.module;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Training module validation failed',
          error.issues[0]?.path.join('.') || 'trainingModule',
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
   * Update training module
   */
  async updateTrainingModule(id: string, moduleData: UpdateTrainingModuleData): Promise<TrainingModule> {
    try {
      if (!id) throw new Error('Module ID is required');

      // Validate input data
      updateTrainingModuleSchema.parse(moduleData);

      const response = await this.client.put<ApiResponse<{ module: TrainingModule }>>(
        API_ENDPOINTS.ADMIN.TRAINING_BY_ID(id),
        moduleData
      );
      return response.data.data.module;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Training module validation failed',
          error.issues[0]?.path.join('.') || 'trainingModule',
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to update training module');
    }
  }

  /**
   * Delete training module
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
   * Record training completion
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

  // ==================== Audit Logs ====================

  /**
   * Get audit logs with filtering and pagination
   */
  async getAuditLogs(filters: AuditLogQueryFilters = {}): Promise<PaginatedResponse<AuditLog>> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.entityId) params.append('entityId', filters.entityId);
      if (filters.action) params.append('action', filters.action);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await this.client.get<ApiResponse<PaginatedResponse<AuditLog>>>(
        `${API_ENDPOINTS.ADMIN.AUDIT_LOGS}?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch audit logs');
    }
  }
}
