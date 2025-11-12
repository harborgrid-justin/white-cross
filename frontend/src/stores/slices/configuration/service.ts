/**
 * Configuration Store - Service Adapter
 * 
 * Service layer adapter for configuration API operations
 * 
 * @module stores/slices/configuration/service
 */

import { configurationApi } from '../../../services/configurationApi';
import type {
  ConfigurationFilter,
  ConfigurationUpdate,
  CreateConfigurationPayload,
  BulkUpdatePayload,
  ImportConfigurationsPayload,
} from '../../../services/configurationApi';

/**
 * Service adapter class for configuration API operations.
 * 
 * Provides a clean interface for Redux thunks to interact with the configuration API,
 * abstracting away direct API calls and providing a consistent interface.
 */
export class ConfigurationApiService {
  /**
   * Fetch all configurations with optional filtering
   */
  async getConfigurations(filter?: ConfigurationFilter) {
    return await configurationApi.getAll(filter);
  }

  /**
   * Fetch public configurations only
   */
  async getPublicConfigurations() {
    return await configurationApi.getPublic();
  }

  /**
   * Fetch a single configuration by key
   */
  async getConfigurationByKey(key: string, scopeId?: string) {
    return await configurationApi.getByKey(key, scopeId);
  }

  /**
   * Fetch configurations by category
   */
  async getConfigurationsByCategory(category: string, scopeId?: string) {
    return await configurationApi.getByCategory(category, scopeId);
  }

  /**
   * Update a configuration
   */
  async updateConfiguration(key: string, data: ConfigurationUpdate) {
    return await configurationApi.update(key, data);
  }

  /**
   * Bulk update multiple configurations
   */
  async bulkUpdateConfigurations(data: BulkUpdatePayload) {
    return await configurationApi.bulkUpdate(data);
  }

  /**
   * Create a new configuration
   */
  async createConfiguration(data: CreateConfigurationPayload) {
    return await configurationApi.create(data);
  }

  /**
   * Delete a configuration
   */
  async deleteConfiguration(key: string, scopeId?: string) {
    return await configurationApi.delete(key, scopeId);
  }

  /**
   * Reset a configuration to its default value
   */
  async resetConfigurationToDefault(key: string, scopeId?: string) {
    return await configurationApi.resetToDefault(key, scopeId);
  }

  /**
   * Fetch configuration history
   */
  async getConfigurationHistory(key: string, limit?: number) {
    return await configurationApi.getHistory(key, limit);
  }

  /**
   * Fetch recent configuration changes
   */
  async getRecentChanges(limit?: number) {
    return await configurationApi.getRecentChanges(limit);
  }

  /**
   * Fetch configuration changes by user
   */
  async getChangesByUser(userId: string, limit?: number) {
    return await configurationApi.getChangesByUser(userId, limit);
  }

  /**
   * Export configurations
   */
  async exportConfigurations(filter?: { category?: string; scope?: string }) {
    return await configurationApi.export(filter);
  }

  /**
   * Import configurations
   */
  async importConfigurations(data: ImportConfigurationsPayload) {
    return await configurationApi.import(data);
  }
}

/**
 * Singleton service instance
 */
export const configurationService = new ConfigurationApiService();
