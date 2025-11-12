/**
 * @fileoverview Configuration Import/Export Service
 * @module configuration/services/config-import-export.service
 * @description Handles import/export functionality for configuration data
 */

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SystemConfig } from '../../database/models/system-config.model';
import { FilterConfigurationDto, ImportConfigurationsDto } from '../dto';
import { ConfigCrudService } from './config-crud.service';
import { ConfigValidationService } from './config-validation.service';

@Injectable()
export class ConfigImportExportService {
  private readonly logger = new Logger(ConfigImportExportService.name);

  constructor(
    private readonly configCrudService: ConfigCrudService,
    private readonly configValidationService: ConfigValidationService,
  ) {}

  /**
   * Export configurations as JSON
   */
  async exportConfigurations(
    filter: FilterConfigurationDto = {},
  ): Promise<string> {
    try {
      const configs = await this.configCrudService.getConfigurations(filter);

      // Transform configs for export (remove internal fields)
      const exportData = configs.map(config => ({
        key: config.key,
        value: config.value,
        valueType: config.valueType,
        category: config.category,
        subCategory: config.subCategory,
        description: config.description,
        defaultValue: config.defaultValue,
        validValues: config.validValues,
        minValue: config.minValue,
        maxValue: config.maxValue,
        isPublic: config.isPublic,
        isEditable: config.isEditable,
        requiresRestart: config.requiresRestart,
        scope: config.scope,
        scopeId: config.scopeId,
        tags: config.tags,
        sortOrder: config.sortOrder,
      }));

      this.logger.log(`Exported ${exportData.length} configurations`);
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      this.logger.error('Error exporting configurations:', error);
      throw error;
    }
  }

  /**
   * Import configurations from JSON
   */
  async importConfigurations(
    importData: ImportConfigurationsDto,
  ): Promise<{ created: number; updated: number; errors: string[] }> {
    try {
      const configs = JSON.parse(importData.configsJson);

      if (!Array.isArray(configs)) {
        throw new BadRequestException(
          'Invalid JSON format: expected an array of configurations',
        );
      }

      const results = { created: 0, updated: 0, errors: [] as string[] };

      for (const config of configs) {
        try {
          if (!config.key) {
            results.errors.push('Configuration missing required field: key');
            continue;
          }

          // Validate the configuration data
          const validation = this.configValidationService.validateConfigurationData(config);
          if (!validation.isValid) {
            results.errors.push(`Validation error for ${config.key}: ${validation.error}`);
            continue;
          }

          const existing = await this.configCrudService.configKeyExists(config.key);

          if (existing) {
            if (importData.overwrite) {
              // Update existing configuration
              const existingConfig = await this.configCrudService.getConfigByKey(config.key);
              await this.configCrudService.updateConfigAttributes(
                existingConfig,
                { value: config.value, updatedAt: new Date() },
              );
              results.updated++;
            } else {
              results.errors.push(
                `Configuration '${config.key}' already exists (use overwrite=true to update)`,
              );
            }
          } else {
            await this.configCrudService.createConfiguration(config);
            results.created++;
          }
        } catch (error) {
          results.errors.push(
            `Error processing ${config.key || 'unknown'}: ${(error as Error).message}`,
          );
        }
      }

      this.logger.log(
        `Import completed: ${results.created} created, ${results.updated} updated, ${results.errors.length} errors`,
      );
      return results;
    } catch (error) {
      this.logger.error('Error importing configurations:', error);
      throw error;
    }
  }

  /**
   * Export configurations to CSV format
   */
  async exportConfigurationsToCSV(
    filter: FilterConfigurationDto = {},
  ): Promise<string> {
    try {
      const configs = await this.configCrudService.getConfigurations(filter);

      // CSV headers
      const headers = [
        'key',
        'value',
        'valueType',
        'category',
        'subCategory',
        'description',
        'defaultValue',
        'isPublic',
        'isEditable',
        'requiresRestart',
        'scope',
        'scopeId',
        'sortOrder',
      ];

      // Convert to CSV
      const csvRows = [headers.join(',')];

      for (const config of configs) {
        const row = [
          this.escapeCsvValue(config.key),
          this.escapeCsvValue(config.value),
          this.escapeCsvValue(config.valueType),
          this.escapeCsvValue(config.category),
          this.escapeCsvValue(config.subCategory || ''),
          this.escapeCsvValue(config.description || ''),
          this.escapeCsvValue(config.defaultValue || ''),
          config.isPublic.toString(),
          config.isEditable.toString(),
          config.requiresRestart.toString(),
          this.escapeCsvValue(config.scope),
          this.escapeCsvValue(config.scopeId || ''),
          config.sortOrder.toString(),
        ];
        csvRows.push(row.join(','));
      }

      this.logger.log(`Exported ${configs.length} configurations to CSV`);
      return csvRows.join('\n');
    } catch (error) {
      this.logger.error('Error exporting configurations to CSV:', error);
      throw error;
    }
  }

  /**
   * Create configuration backup
   */
  async createBackup(
    filter: FilterConfigurationDto = {},
  ): Promise<{
    timestamp: string;
    count: number;
    data: string;
    metadata: {
      exportedAt: Date;
      filter: FilterConfigurationDto;
      version: string;
    };
  }> {
    try {
      const timestamp = new Date().toISOString();
      const data = await this.exportConfigurations(filter);
      const configs = JSON.parse(data);

      const backup = {
        timestamp,
        count: configs.length,
        data,
        metadata: {
          exportedAt: new Date(),
          filter,
          version: '1.0.0',
        },
      };

      this.logger.log(`Created backup with ${configs.length} configurations`);
      return backup;
    } catch (error) {
      this.logger.error('Error creating configuration backup:', error);
      throw error;
    }
  }

  /**
   * Restore from backup
   */
  async restoreFromBackup(
    backupData: string,
    overwrite: boolean = false,
  ): Promise<{ created: number; updated: number; errors: string[] }> {
    try {
      const backup = JSON.parse(backupData);

      if (!backup.data) {
        throw new BadRequestException('Invalid backup format: missing data field');
      }

      const importData: ImportConfigurationsDto = {
        configsJson: backup.data,
        overwrite,
        changedBy: 'system',
      };

      const result = await this.importConfigurations(importData);

      this.logger.log(
        `Restored from backup: ${result.created} created, ${result.updated} updated`,
      );
      return result;
    } catch (error) {
      this.logger.error('Error restoring from backup:', error);
      throw error;
    }
  }

  /**
   * Validate import data format
   */
  validateImportData(data: string): { isValid: boolean; error?: string } {
    try {
      const parsed = JSON.parse(data);

      if (!Array.isArray(parsed)) {
        return {
          isValid: false,
          error: 'Data must be an array of configuration objects',
        };
      }

      for (const config of parsed) {
        if (!config.key) {
          return {
            isValid: false,
            error: 'Each configuration must have a key field',
          };
        }

        if (!config.value) {
          return {
            isValid: false,
            error: `Configuration ${config.key} must have a value field`,
          };
        }
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid JSON format',
      };
    }
  }

  /**
   * Escape CSV value
   */
  private escapeCsvValue(value: string): string {
    if (!value) return '';
    
    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    
    return value;
  }
}
