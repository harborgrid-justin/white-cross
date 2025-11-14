/**
 * @fileoverview Configuration Management Service Module
 * @module services/modules/administration/ConfigurationManagement
 * @category Services - Administration - Configuration Management
 *
 * Provides system configuration and settings management including:
 * - System-wide configuration CRUD operations
 * - Settings grouped by category
 * - Scoped configurations (system, district, school, user)
 * - Type-safe configuration value handling
 * - Comprehensive validation and error handling
 *
 * @example
 * ```typescript
 * import { ConfigurationManagementService } from '@/services/modules/administration/ConfigurationManagement';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const configService = new ConfigurationManagementService(apiClient);
 * const settings = await configService.getSettings();
 * await configService.setConfiguration({
 *   key: 'max_file_size',
 *   value: '10485760',
 *   category: 'FILE_UPLOAD'
 * });
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../../constants/api';
import { ApiResponse } from '../../utils/apiUtils';
import { z } from 'zod';
import { createApiError } from '../../core/errors';
import {
  SystemConfiguration,
  SystemSettings,
  SystemSettingItem,
  ConfigurationData,
  ConfigCategory,
} from '../../../types/domain/administration';

// ==================== CONFIGURATION VALIDATION SCHEMAS ====================

/**
 * Validation schema for configuration data
 */
export const configurationSchema = z.object({
  key: z.string()
    .min(2, 'Configuration key must be at least 2 characters')
    .max(255, 'Configuration key cannot exceed 255 characters')
    .regex(/^[a-zA-Z][a-zA-Z0-9._-]*$/, 'Key must start with a letter and contain only letters, numbers, dots, hyphens, and underscores'),
  value: z.string()
    .min(1, 'Configuration value is required'),
  category: z.enum(['GENERAL', 'SECURITY', 'NOTIFICATION', 'INTEGRATION', 'BACKUP', 'PERFORMANCE', 'HEALTHCARE', 'MEDICATION', 'APPOINTMENTS', 'UI', 'QUERY', 'FILE_UPLOAD', 'RATE_LIMITING', 'SESSION', 'EMAIL', 'SMS']),
  valueType: z.enum(['STRING', 'NUMBER', 'BOOLEAN', 'JSON', 'ARRAY', 'DATE', 'TIME', 'DATETIME', 'EMAIL', 'URL', 'COLOR', 'ENUM']).optional(),
  subCategory: z.string()
    .max(100, 'Sub-category cannot exceed 100 characters')
    .optional(),
  description: z.string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  isPublic: z.boolean().optional(),
  isEditable: z.boolean().optional(),
  requiresRestart: z.boolean().optional(),
  scope: z.enum(['SYSTEM', 'DISTRICT', 'SCHOOL', 'USER']).optional(),
  scopeId: z.string().uuid('Scope ID must be a valid UUID').optional(),
  tags: z.array(z.string()).optional(),
  sortOrder: z.number()
    .min(0, 'Sort order cannot be negative')
    .optional(),
});

// ==================== CONFIGURATION MANAGEMENT SERVICE ====================

/**
 * System settings update data
 */
export interface SystemSettingsUpdateData {
  settings: SystemSettingItem[];
}

/**
 * Service class for configuration and settings management operations
 */
export class ConfigurationManagementService {
  constructor(private readonly client: ApiClient) {}

  // ==================== SYSTEM SETTINGS METHODS ====================

  /**
   * Get system settings grouped by category
   * @returns System settings organized by category
   * @throws {ApiError} When the API request fails
   */
  async getSettings(): Promise<SystemSettings> {
    try {
      const response = await this.client.get<ApiResponse<SystemSettings>>(
        API_ENDPOINTS.ADMIN.SETTINGS
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch system settings');
    }
  }

  /**
   * Update system settings
   * @param settings - Array of settings to update
   * @returns Updated settings array
   * @throws {ApiError} When the API request fails
   */
  async updateSettings(settings: SystemSettingItem[]): Promise<SystemSettingItem[]> {
    try {
      const response = await this.client.put<ApiResponse<SystemSettingItem[]>>(
        API_ENDPOINTS.ADMIN.SETTINGS,
        { settings }
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to update system settings');
    }
  }

  // ==================== CONFIGURATION METHODS ====================

  /**
   * Get all system configurations with optional category filtering
   * @param category - Optional configuration category filter
   * @returns Array of system configurations
   * @throws {ApiError} When the API request fails
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
   * @param key - Configuration key
   * @returns System configuration object
   * @throws {ApiError} When the API request fails or configuration not found
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
   * Set or update configuration
   * @param configData - Configuration data to set
   * @param changedBy - Optional user ID who made the change
   * @returns Updated or created system configuration
   * @throws {ApiError} When the API request fails
   */
  async setConfiguration(configData: ConfigurationData, changedBy?: string): Promise<SystemConfiguration> {
    try {
      const response = await this.client.post<ApiResponse<{ config: SystemConfiguration }>>(
        API_ENDPOINTS.ADMIN.CONFIGURATIONS,
        { ...configData, changedBy }
      );

      return response.data.data.config;
    } catch (error) {
      throw createApiError(error, 'Failed to set configuration');
    }
  }

  /**
   * Delete configuration
   * @param key - Configuration key to delete
   * @returns Success message
   * @throws {ApiError} When the API request fails or configuration not found
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
}

/**
 * Factory function to create a ConfigurationManagementService instance
 * @param client - ApiClient instance
 * @returns ConfigurationManagementService instance
 */
export function createConfigurationManagementService(client: ApiClient): ConfigurationManagementService {
  return new ConfigurationManagementService(client);
}
