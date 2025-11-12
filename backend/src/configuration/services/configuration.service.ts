/**
 * @fileoverview Configuration Service - Refactored Implementation
 * @module configuration/services/configuration.service
 * @description Main configuration service that delegates to specialized services
 *
 * Responsibilities:
 * - Configuration lifecycle management (create, update, delete)
 * - Coordination between specialized services
 * - Public API for configuration operations
 *
 * Delegates to:
 * - ConfigCrudService: Basic CRUD operations
 * - ConfigValidationService: Value validation
 * - ConfigHistoryService: Audit trail and history
 * - ConfigImportExportService: Data migration
 * - ConfigStatisticsService: Statistics and reporting
 */

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigCategory, SystemConfig } from '../database/models/system-config.model';
import { ConfigurationHistory } from '../database/models/configuration-history.model';
import {
  ConfigurationBulkUpdateDto,
  CreateConfigurationDto,
  FilterConfigurationDto,
  ImportConfigurationsDto,
  UpdateConfigurationDto,
} from './dto';
import { ConfigCrudService } from './services/config-crud.service';
import { ConfigValidationService, ConfigurationValidationResult } from './services/config-validation.service';
import { ConfigHistoryService } from './services/config-history.service';
import { ConfigImportExportService } from './services/config-import-export.service';
import { ConfigStatisticsService } from './services/config-statistics.service';

// Re-export validation result interface
export { ConfigurationValidationResult } from './services/config-validation.service';

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name);

  constructor(
    private readonly configCrudService: ConfigCrudService,
    private readonly configValidationService: ConfigValidationService,
    private readonly configHistoryService: ConfigHistoryService,
    private readonly configImportExportService: ConfigImportExportService,
    private readonly configStatisticsService: ConfigStatisticsService,
  ) {}

  /**
   * Get a single configuration by key - delegates to CRUD service
   */
  async getConfigByKey(key: string, scopeId?: string): Promise<SystemConfig> {
    return this.configCrudService.getConfigByKey(key, scopeId);
  }

  /**
   * Get multiple configurations with filtering - delegates to CRUD service
   */
  async getConfigurations(filter: FilterConfigurationDto = {}): Promise<SystemConfig[]> {
    return this.configCrudService.getConfigurations(filter);
  }

  /**
   * Get configurations by category - delegates to CRUD service
   */
  async getConfigsByCategory(category: ConfigCategory, scopeId?: string): Promise<SystemConfig[]> {
    return this.configCrudService.getConfigsByCategory(category, scopeId);
  }

  /**
   * Get public configurations - delegates to CRUD service
   */
  async getPublicConfigurations(): Promise<SystemConfig[]> {
    return this.configCrudService.getPublicConfigurations();
  }

  /**
   * Validate a configuration value - delegates to validation service
   */
  validateConfigValue(config: SystemConfig, newValue: string): ConfigurationValidationResult {
    return this.configValidationService.validateConfigValue(config, newValue);
  }

  /**
   * Update a configuration value with full audit trail
   */
  async updateConfiguration(
    key: string,
    updateData: UpdateConfigurationDto,
    scopeId?: string,
  ): Promise<SystemConfig> {
    const transaction = await this.configHistoryService.createTransaction();

    try {
      // Get the current configuration
      const config = await this.configCrudService.getConfigByKey(key, scopeId);

      // Validate the new value
      const validation = this.configValidationService.validateConfigValue(config, updateData.value);
      if (!validation.isValid) {
        throw new BadRequestException(validation.error);
      }

      // Store old value for history
      const oldValue = config.value;

      // Update the configuration within transaction
      await this.configCrudService.updateConfigAttributes(
        config,
        {
          value: updateData.value,
          updatedAt: new Date(),
        },
        transaction,
      );

      // Create history record within same transaction
      await this.configHistoryService.createHistoryRecord(
        config,
        oldValue,
        updateData.value,
        updateData,
        transaction,
      );

      // Commit transaction
      await this.configHistoryService.commitTransaction(transaction);

      // Fetch updated config
      const updatedConfig = await this.configCrudService.findConfigById(config.id);

      if (!updatedConfig) {
        throw new NotFoundException(`Configuration ${key} not found after update`);
      }

      this.logger.log(`Configuration updated: ${key} = ${updateData.value} by ${updateData.changedBy}`);
      return updatedConfig;
    } catch (error) {
      // Rollback transaction on error
      await this.configHistoryService.rollbackTransaction(transaction);
      this.logger.error(`Error updating configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Bulk update multiple configurations
   */
  async bulkUpdateConfigurations(
    bulkUpdate: ConfigurationBulkUpdateDto,
  ): Promise<Array<SystemConfig | { key: string; error: string }>> {
    const results: Array<SystemConfig | { key: string; error: string }> = [];

    for (const update of bulkUpdate.updates) {
      try {
        const result = await this.updateConfiguration(
          update.key,
          {
            value: update.value,
            changedBy: bulkUpdate.changedBy,
            changeReason: bulkUpdate.changeReason,
          },
          update.scopeId,
        );
        results.push(result);
      } catch (error) {
        this.logger.error(`Error updating ${update.key}:`, error);
        results.push({ key: update.key, error: (error as Error).message });
      }
    }

    this.logger.log(`Bulk update completed: ${results.length} configurations processed`);
    return results;
  }

  /**
   * Create a new configuration - delegates to CRUD service
   */
  async createConfiguration(data: CreateConfigurationDto): Promise<SystemConfig> {
    return this.configCrudService.createConfiguration(data);
  }

  /**
   * Delete a configuration - delegates to CRUD service
   */
  async deleteConfiguration(key: string, scopeId?: string): Promise<void> {
    return this.configCrudService.deleteConfiguration(key, scopeId);
  }

  /**
   * Reset configuration to its default value
   */
  async resetToDefault(key: string, changedBy: string, scopeId?: string): Promise<SystemConfig> {
    try {
      const config = await this.configCrudService.getConfigByKey(key, scopeId);

      if (!config.defaultValue) {
        throw new BadRequestException('No default value specified for this configuration');
      }

      const result = await this.updateConfiguration(
        key,
        {
          value: config.defaultValue,
          changedBy,
          changeReason: 'Reset to default value',
        },
        scopeId,
      );

      this.logger.log(`Configuration reset to default: ${key}`);
      return result;
    } catch (error) {
      this.logger.error(`Error resetting configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get configuration change history - delegates to history service
   */
  async getConfigHistory(key: string, limit: number = 50): Promise<ConfigurationHistory[]> {
    return this.configHistoryService.getConfigHistory(key, limit);
  }

  /**
   * Get all configuration changes by a user - delegates to history service
   */
  async getConfigChangesByUser(userId: string, limit: number = 50): Promise<ConfigurationHistory[]> {
    return this.configHistoryService.getConfigChangesByUser(userId, limit);
  }

  /**
   * Get recent configuration changes - delegates to history service
   */
  async getRecentChanges(limit: number = 100): Promise<ConfigurationHistory[]> {
    return this.configHistoryService.getRecentChanges(limit);
  }

  /**
   * Get configurations that require system restart - delegates to CRUD service
   */
  async getConfigsRequiringRestart(): Promise<SystemConfig[]> {
    return this.configCrudService.getConfigsRequiringRestart();
  }

  /**
   * Export configurations as JSON - delegates to import/export service
   */
  async exportConfigurations(filter: FilterConfigurationDto = {}): Promise<string> {
    return this.configImportExportService.exportConfigurations(filter);
  }

  /**
   * Import configurations from JSON - delegates to import/export service
   */
  async importConfigurations(
    importData: ImportConfigurationsDto,
  ): Promise<{ created: number; updated: number; errors: string[] }> {
    return this.configImportExportService.importConfigurations(importData);
  }

  /**
   * Get configuration statistics - delegates to statistics service
   */
  async getConfigurationStatistics(): Promise<any> {
    return this.configStatisticsService.getConfigurationStatistics();
  }

  /**
   * Export configurations to CSV - delegates to import/export service
   */
  async exportConfigurationsToCSV(filter: FilterConfigurationDto = {}): Promise<string> {
    return this.configImportExportService.exportConfigurationsToCSV(filter);
  }

  /**
   * Create configuration backup - delegates to import/export service
   */
  async createBackup(filter: FilterConfigurationDto = {}): Promise<any> {
    return this.configImportExportService.createBackup(filter);
  }

  /**
   * Restore from backup - delegates to import/export service
   */
  async restoreFromBackup(
    backupData: string,
    overwrite: boolean = false,
  ): Promise<{ created: number; updated: number; errors: string[] }> {
    return this.configImportExportService.restoreFromBackup(backupData, overwrite);
  }

  /**
   * Get configuration health metrics - delegates to statistics service
   */
  async getHealthMetrics(): Promise<any> {
    return this.configStatisticsService.getHealthMetrics();
  }

  /**
   * Generate configuration summary report - delegates to statistics service
   */
  async generateSummaryReport(): Promise<any> {
    return this.configStatisticsService.generateSummaryReport();
  }
}
