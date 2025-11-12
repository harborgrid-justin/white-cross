/**
 * Configuration Store - CRUD Thunks
 * 
 * Async thunks for configuration CRUD operations
 * 
 * @module stores/slices/configuration/thunks/configurationThunks
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { configurationService } from '../service';
import type {
  ConfigurationFilter,
  ConfigurationUpdate,
  CreateConfigurationPayload,
  BulkUpdatePayload,
} from '../../../../services/configurationApi';

/**
 * Fetch all configurations with optional filtering.
 * 
 * @example
 * ```typescript
 * dispatch(fetchConfigurations({
 *   category: 'clinical_workflows',
 *   scope: 'department',
 *   scopeId: 'cardiology'
 * }));
 * ```
 */
export const fetchConfigurations = createAsyncThunk(
  'configuration/fetchConfigurations',
  async (filter?: ConfigurationFilter) => {
    const response = await configurationService.getConfigurations(filter);
    return response;
  }
);

/**
 * Fetch public configurations only.
 * 
 * Public configurations are accessible without authentication
 * and typically include general system settings.
 */
export const fetchPublicConfigurations = createAsyncThunk(
  'configuration/fetchPublicConfigurations',
  async () => {
    const response = await configurationService.getPublicConfigurations();
    return response;
  }
);

/**
 * Fetch a single configuration by key.
 * 
 * @param key - Configuration key
 * @param scopeId - Optional scope ID for scoped configurations
 * 
 * @example
 * ```typescript
 * dispatch(fetchConfigurationByKey({
 *   key: 'patient_chart_timeout',
 *   scopeId: 'user_123'
 * }));
 * ```
 */
export const fetchConfigurationByKey = createAsyncThunk(
  'configuration/fetchConfigurationByKey',
  async ({ key, scopeId }: { key: string; scopeId?: string }) => {
    const response = await configurationService.getConfigurationByKey(key, scopeId);
    return response;
  }
);

/**
 * Fetch configurations by category.
 * 
 * @param category - Configuration category
 * @param scopeId - Optional scope ID
 * 
 * @example
 * ```typescript
 * dispatch(fetchConfigurationsByCategory({
 *   category: 'security',
 *   scopeId: 'org_456'
 * }));
 * ```
 */
export const fetchConfigurationsByCategory = createAsyncThunk(
  'configuration/fetchConfigurationsByCategory',
  async ({ category, scopeId }: { category: string; scopeId?: string }) => {
    const response = await configurationService.getConfigurationsByCategory(category, scopeId);
    return response;
  }
);

/**
 * Update a configuration.
 * 
 * @param key - Configuration key to update
 * @param data - Configuration update data
 * 
 * @example
 * ```typescript
 * dispatch(updateConfiguration({
 *   key: 'medication_alert_threshold',
 *   data: {
 *     value: '72',
 *     description: 'Hours before medication expiry alert',
 *     requiresRestart: false
 *   }
 * }));
 * ```
 */
export const updateConfiguration = createAsyncThunk(
  'configuration/updateConfiguration',
  async ({ key, data }: { key: string; data: ConfigurationUpdate }) => {
    const response = await configurationService.updateConfiguration(key, data);
    return { key, ...response };
  }
);

/**
 * Bulk update multiple configurations.
 * 
 * @param data - Bulk update payload with multiple configuration updates
 * 
 * @example
 * ```typescript
 * dispatch(bulkUpdateConfigurations({
 *   updates: [
 *     { key: 'session_timeout', value: '30' },
 *     { key: 'password_complexity', value: 'high' },
 *     { key: 'mfa_required', value: 'true' }
 *   ],
 *   reason: 'Security policy update Q4 2024'
 * }));
 * ```
 */
export const bulkUpdateConfigurations = createAsyncThunk(
  'configuration/bulkUpdateConfigurations',
  async (data: BulkUpdatePayload) => {
    const response = await configurationService.bulkUpdateConfigurations(data);
    return response;
  }
);

/**
 * Create a new configuration.
 * 
 * @param data - Configuration creation payload
 * 
 * @example
 * ```typescript
 * dispatch(createConfiguration({
 *   key: 'new_feature_enabled',
 *   value: 'true',
 *   category: 'features',
 *   scope: 'organization',
 *   scopeId: 'org_789'
 * }));
 * ```
 */
export const createConfiguration = createAsyncThunk(
  'configuration/createConfiguration',
  async (data: CreateConfigurationPayload) => {
    const response = await configurationService.createConfiguration(data);
    return response;
  }
);

/**
 * Delete a configuration.
 * 
 * @param key - Configuration key to delete
 * @param scopeId - Optional scope ID
 * 
 * @example
 * ```typescript
 * dispatch(deleteConfiguration({
 *   key: 'deprecated_setting',
 *   scopeId: 'dept_123'
 * }));
 * ```
 */
export const deleteConfiguration = createAsyncThunk(
  'configuration/deleteConfiguration',
  async ({ key, scopeId }: { key: string; scopeId?: string }) => {
    await configurationService.deleteConfiguration(key, scopeId);
    return { key, scopeId };
  }
);

/**
 * Reset a configuration to its default value.
 * 
 * @param key - Configuration key to reset
 * @param scopeId - Optional scope ID
 * 
 * @example
 * ```typescript
 * dispatch(resetConfigurationToDefault({
 *   key: 'dashboard_layout',
 *   scopeId: 'user_123'
 * }));
 * ```
 */
export const resetConfigurationToDefault = createAsyncThunk(
  'configuration/resetConfigurationToDefault',
  async ({ key, scopeId }: { key: string; scopeId?: string }) => {
    const response = await configurationService.resetConfigurationToDefault(key, scopeId);
    return { key, ...response };
  }
);
