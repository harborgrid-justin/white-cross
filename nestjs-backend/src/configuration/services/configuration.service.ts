import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { SystemConfiguration } from '../../administration/entities/system-configuration.entity';
import { ConfigurationHistory } from '../../administration/entities/configuration-history.entity';
import { ConfigCategory, ConfigValueType, ConfigScope } from '../../administration/enums/administration.enums';
import {
  CreateConfigurationDto,
  UpdateConfigurationDto,
  FilterConfigurationDto,
  BulkUpdateDto,
  ImportConfigurationsDto
} from '../dto';

/**
 * Configuration Validation Result Interface
 */
interface ConfigurationValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Configuration Service
 *
 * Manages system, district, and school-level configuration settings with:
 * - Hierarchical scoping (system, district, school, user)
 * - Type-safe validation
 * - Complete audit trail via ConfigurationHistory
 * - Transactional updates to ensure history integrity
 * - Support for various data types (string, number, boolean, JSON, etc.)
 *
 * All configuration changes are tracked with who made the change, when,
 * and optionally why (for compliance and debugging purposes).
 */
@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name);

  constructor(
    @InjectRepository(SystemConfiguration)
    private readonly configRepository: Repository<SystemConfiguration>,
    @InjectRepository(ConfigurationHistory)
    private readonly historyRepository: Repository<ConfigurationHistory>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Get a single configuration by key with optional scope filtering
   *
   * Implements scope priority: more specific scopes take precedence
   * (e.g., SCHOOL > DISTRICT > SYSTEM for the same key)
   */
  async getConfigByKey(key: string, scopeId?: string): Promise<SystemConfiguration> {
    try {
      const whereClause: any = { key };

      if (scopeId) {
        whereClause.scopeId = scopeId;
      }

      const configs = await this.configRepository.find({
        where: whereClause,
        order: {
          scope: 'DESC', // Prioritize more specific scopes
          createdAt: 'DESC'
        }
      });

      const config = configs[0];

      if (!config) {
        throw new NotFoundException(`Configuration not found: ${key}`);
      }

      return config;
    } catch (error) {
      this.logger.error(`Error fetching configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get multiple configurations with advanced filtering
   *
   * Supports filtering by category, subcategory, scope, tags, visibility, and editability
   * Results are ordered by sortOrder, category, subcategory, and key
   */
  async getConfigurations(filter: FilterConfigurationDto = {}): Promise<SystemConfiguration[]> {
    try {
      const { category, subCategory, scope, scopeId, tags, isPublic, isEditable } = filter;

      const queryBuilder = this.configRepository.createQueryBuilder('config');

      if (category) {
        queryBuilder.andWhere('config.category = :category', { category });
      }

      if (subCategory) {
        queryBuilder.andWhere('config.subCategory = :subCategory', { subCategory });
      }

      if (scope) {
        queryBuilder.andWhere('config.scope = :scope', { scope });
      }

      if (scopeId) {
        queryBuilder.andWhere('config.scopeId = :scopeId', { scopeId });
      }

      // Handle array overlap search for tags (PostgreSQL specific)
      if (tags && tags.length > 0) {
        queryBuilder.andWhere('config.tags && :tags', { tags });
      }

      if (isPublic !== undefined) {
        queryBuilder.andWhere('config.isPublic = :isPublic', { isPublic });
      }

      if (isEditable !== undefined) {
        queryBuilder.andWhere('config.isEditable = :isEditable', { isEditable });
      }

      queryBuilder.orderBy({
        'config.sortOrder': 'ASC',
        'config.category': 'ASC',
        'config.subCategory': 'ASC',
        'config.key': 'ASC'
      });

      const configs = await queryBuilder.getMany();
      return configs;
    } catch (error) {
      this.logger.error('Error fetching configurations:', error);
      throw error;
    }
  }

  /**
   * Get configurations by category with optional scope filtering
   */
  async getConfigsByCategory(category: ConfigCategory, scopeId?: string): Promise<SystemConfiguration[]> {
    return this.getConfigurations({ category, scopeId });
  }

  /**
   * Get public configurations safe to expose to frontend
   */
  async getPublicConfigurations(): Promise<SystemConfiguration[]> {
    return this.getConfigurations({ isPublic: true });
  }

  /**
   * Validate a configuration value against its type and constraints
   *
   * Performs comprehensive validation including:
   * - Editability check
   * - Type-specific validation (number, boolean, email, URL, color, JSON, enum)
   * - Range validation for numbers (min/max)
   * - Enumeration validation for restricted value sets
   */
  validateConfigValue(config: SystemConfiguration, newValue: string): ConfigurationValidationResult {
    // Check if config is editable
    if (!config.isEditable) {
      return {
        isValid: false,
        error: 'This configuration is not editable'
      };
    }

    // Type-specific validation
    switch (config.valueType) {
      case ConfigValueType.NUMBER:
        const numValue = parseFloat(newValue);
        if (isNaN(numValue)) {
          return { isValid: false, error: 'Value must be a valid number' };
        }
        if (config.minValue !== null && config.minValue !== undefined && numValue < config.minValue) {
          return { isValid: false, error: `Value must be at least ${config.minValue}` };
        }
        if (config.maxValue !== null && config.maxValue !== undefined && numValue > config.maxValue) {
          return { isValid: false, error: `Value must be at most ${config.maxValue}` };
        }
        break;

      case ConfigValueType.BOOLEAN:
        if (!['true', 'false', '1', '0'].includes(newValue.toLowerCase())) {
          return { isValid: false, error: 'Value must be a boolean (true/false)' };
        }
        break;

      case ConfigValueType.EMAIL:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newValue)) {
          return { isValid: false, error: 'Value must be a valid email address' };
        }
        break;

      case ConfigValueType.URL:
        try {
          new URL(newValue);
        } catch {
          return { isValid: false, error: 'Value must be a valid URL' };
        }
        break;

      case ConfigValueType.COLOR:
        const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!colorRegex.test(newValue)) {
          return { isValid: false, error: 'Value must be a valid hex color (e.g., #3b82f6)' };
        }
        break;

      case ConfigValueType.JSON:
        try {
          JSON.parse(newValue);
        } catch {
          return { isValid: false, error: 'Value must be valid JSON' };
        }
        break;

      case ConfigValueType.ENUM:
        if (config.validValues && config.validValues.length > 0) {
          if (!config.validValues.includes(newValue)) {
            return {
              isValid: false,
              error: `Value must be one of: ${config.validValues.join(', ')}`
            };
          }
        }
        break;

      case ConfigValueType.ARRAY:
        try {
          const parsed = JSON.parse(newValue);
          if (!Array.isArray(parsed)) {
            return { isValid: false, error: 'Value must be a valid JSON array' };
          }
        } catch {
          return { isValid: false, error: 'Value must be a valid JSON array' };
        }
        break;
    }

    // Check valid values constraint if specified (for non-ENUM types)
    if (config.validValues && config.validValues.length > 0 && config.valueType !== ConfigValueType.ENUM) {
      if (!config.validValues.includes(newValue)) {
        return {
          isValid: false,
          error: `Value must be one of: ${config.validValues.join(', ')}`
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Update a configuration value with full audit trail
   *
   * Uses a database transaction to ensure atomicity between configuration
   * update and history record creation. This guarantees audit trail integrity.
   */
  async updateConfiguration(
    key: string,
    updateData: UpdateConfigurationDto,
    scopeId?: string
  ): Promise<SystemConfiguration> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get the current configuration
      const config = await this.getConfigByKey(key, scopeId);

      // Validate the new value
      const validation = this.validateConfigValue(config, updateData.value);
      if (!validation.isValid) {
        throw new BadRequestException(validation.error);
      }

      // Store old value for history
      const oldValue = config.value;

      // Update the configuration within transaction
      await queryRunner.manager.update(
        SystemConfiguration,
        { id: config.id },
        {
          value: updateData.value,
          updatedAt: new Date()
        }
      );

      // Create history record within same transaction
      const history = queryRunner.manager.create(ConfigurationHistory, {
        configurationId: config.id,
        configKey: key,
        oldValue,
        newValue: updateData.value,
        changedBy: updateData.changedBy,
        changedByName: updateData.changedByName,
        changeReason: updateData.changeReason,
        ipAddress: updateData.ipAddress,
        userAgent: updateData.userAgent
      });
      await queryRunner.manager.save(history);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Fetch updated config
      const updatedConfig = await this.configRepository.findOne({ where: { id: config.id } });

      if (!updatedConfig) {
        throw new NotFoundException(`Configuration ${key} not found after update`);
      }

      this.logger.log(`Configuration updated: ${key} = ${updateData.value} by ${updateData.changedBy}`);
      return updatedConfig;
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error updating configuration ${key}:`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Bulk update multiple configurations
   *
   * Updates multiple configurations in sequence. Each update is independent
   * with its own transaction. Failures are logged but don't stop other updates.
   */
  async bulkUpdateConfigurations(
    bulkUpdate: BulkUpdateDto
  ): Promise<Array<SystemConfiguration | { key: string; error: string }>> {
    const results: Array<SystemConfiguration | { key: string; error: string }> = [];

    for (const update of bulkUpdate.updates) {
      try {
        const result = await this.updateConfiguration(
          update.key,
          {
            value: update.value,
            changedBy: bulkUpdate.changedBy,
            changeReason: bulkUpdate.changeReason
          },
          update.scopeId
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
   * Create a new configuration
   *
   * Creates a new system configuration with all specified attributes.
   * Key must be unique across all configurations.
   */
  async createConfiguration(data: CreateConfigurationDto): Promise<SystemConfiguration> {
    try {
      // Check if key already exists
      const existing = await this.configRepository.findOne({
        where: { key: data.key }
      });

      if (existing) {
        throw new BadRequestException(`Configuration with key '${data.key}' already exists`);
      }

      const config = this.configRepository.create({
        key: data.key,
        value: data.value,
        valueType: data.valueType,
        category: data.category,
        subCategory: data.subCategory,
        description: data.description,
        defaultValue: data.defaultValue,
        validValues: data.validValues,
        minValue: data.minValue,
        maxValue: data.maxValue,
        isPublic: data.isPublic !== undefined ? data.isPublic : false,
        isEditable: data.isEditable !== undefined ? data.isEditable : true,
        requiresRestart: data.requiresRestart !== undefined ? data.requiresRestart : false,
        scope: data.scope || ConfigScope.SYSTEM,
        scopeId: data.scopeId,
        tags: data.tags,
        sortOrder: data.sortOrder !== undefined ? data.sortOrder : 0
      });

      const savedConfig = await this.configRepository.save(config);

      this.logger.log(`Configuration created: ${data.key} in category ${data.category}`);
      return savedConfig;
    } catch (error) {
      this.logger.error('Error creating configuration:', error);
      throw error;
    }
  }

  /**
   * Delete a configuration
   *
   * Deletes a configuration by key. Associated history records are
   * automatically deleted via CASCADE constraint.
   */
  async deleteConfiguration(key: string, scopeId?: string): Promise<void> {
    try {
      const config = await this.getConfigByKey(key, scopeId);
      await this.configRepository.remove(config);
      this.logger.log(`Configuration deleted: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Reset configuration to its default value
   *
   * Resets a configuration to its default value with full audit trail.
   * Only works if a default value was specified when creating the config.
   */
  async resetToDefault(key: string, changedBy: string, scopeId?: string): Promise<SystemConfiguration> {
    try {
      const config = await this.getConfigByKey(key, scopeId);

      if (!config.defaultValue) {
        throw new BadRequestException('No default value specified for this configuration');
      }

      const result = await this.updateConfiguration(
        key,
        {
          value: config.defaultValue,
          changedBy,
          changeReason: 'Reset to default value'
        },
        scopeId
      );

      this.logger.log(`Configuration reset to default: ${key}`);
      return result;
    } catch (error) {
      this.logger.error(`Error resetting configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get configuration change history
   *
   * Retrieves the change history for a specific configuration key,
   * including the configuration details for context.
   */
  async getConfigHistory(key: string, limit: number = 50): Promise<ConfigurationHistory[]> {
    try {
      const history = await this.historyRepository.find({
        where: { configKey: key },
        relations: ['configuration'],
        order: { createdAt: 'DESC' },
        take: limit
      });

      return history;
    } catch (error) {
      this.logger.error(`Error fetching history for ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get all configuration changes by a user
   *
   * Retrieves all configuration changes made by a specific user,
   * useful for auditing and compliance reporting.
   */
  async getConfigChangesByUser(userId: string, limit: number = 50): Promise<ConfigurationHistory[]> {
    try {
      const history = await this.historyRepository.find({
        where: { changedBy: userId },
        relations: ['configuration'],
        order: { createdAt: 'DESC' },
        take: limit
      });

      return history;
    } catch (error) {
      this.logger.error(`Error fetching user changes for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get recent configuration changes across all configurations
   *
   * Retrieves the most recent configuration changes system-wide,
   * useful for monitoring and audit dashboards.
   */
  async getRecentChanges(limit: number = 100): Promise<ConfigurationHistory[]> {
    try {
      const history = await this.historyRepository.find({
        relations: ['configuration'],
        order: { createdAt: 'DESC' },
        take: limit
      });

      return history;
    } catch (error) {
      this.logger.error('Error fetching recent changes:', error);
      throw error;
    }
  }

  /**
   * Get configurations that require system restart
   *
   * Returns all configurations marked with requiresRestart = true.
   * Used to warn administrators when changes need a restart to take effect.
   */
  async getConfigsRequiringRestart(): Promise<SystemConfiguration[]> {
    try {
      const configs = await this.configRepository.find({
        where: { requiresRestart: true },
        order: {
          category: 'ASC',
          key: 'ASC'
        }
      });

      return configs;
    } catch (error) {
      this.logger.error('Error fetching configs requiring restart:', error);
      throw error;
    }
  }

  /**
   * Export configurations as JSON
   *
   * Exports configurations matching the filter criteria as formatted JSON.
   * Useful for backup, migration, or configuration templates.
   */
  async exportConfigurations(filter: FilterConfigurationDto = {}): Promise<string> {
    try {
      const configs = await this.getConfigurations(filter);

      this.logger.log(`Exported ${configs.length} configurations`);
      return JSON.stringify(configs, null, 2);
    } catch (error) {
      this.logger.error('Error exporting configurations:', error);
      throw error;
    }
  }

  /**
   * Import configurations from JSON
   *
   * Imports configurations from a JSON string. Can either create new
   * configurations or overwrite existing ones based on the overwrite flag.
   */
  async importConfigurations(
    importData: ImportConfigurationsDto
  ): Promise<{ created: number; updated: number; errors: string[] }> {
    try {
      const configs = JSON.parse(importData.configsJson);

      if (!Array.isArray(configs)) {
        throw new BadRequestException('Invalid JSON format: expected an array of configurations');
      }

      const results = { created: 0, updated: 0, errors: [] as string[] };

      for (const config of configs) {
        try {
          if (!config.key) {
            results.errors.push('Configuration missing required field: key');
            continue;
          }

          const existing = await this.configRepository.findOne({
            where: { key: config.key }
          });

          if (existing) {
            if (importData.overwrite) {
              await this.updateConfiguration(
                config.key,
                {
                  value: config.value,
                  changedBy: importData.changedBy,
                  changeReason: 'Imported from JSON'
                }
              );
              results.updated++;
            } else {
              results.errors.push(`Configuration '${config.key}' already exists (use overwrite=true to update)`);
            }
          } else {
            await this.createConfiguration(config);
            results.created++;
          }
        } catch (error) {
          results.errors.push(`Error processing ${config.key}: ${(error as Error).message}`);
        }
      }

      this.logger.log(`Import completed: ${results.created} created, ${results.updated} updated, ${results.errors.length} errors`);
      return results;
    } catch (error) {
      this.logger.error('Error importing configurations:', error);
      throw error;
    }
  }

  /**
   * Get configuration statistics
   *
   * Returns aggregate statistics about configurations:
   * - Total configuration count
   * - Count by category
   * - Count by scope
   * - Public vs private count
   * - Editable vs locked count
   */
  async getConfigurationStatistics() {
    try {
      const [
        totalCount,
        categoryBreakdown,
        scopeBreakdown,
        publicCount,
        editableCount
      ] = await Promise.all([
        this.configRepository.count(),
        this.configRepository
          .createQueryBuilder('config')
          .select('config.category', 'category')
          .addSelect('COUNT(*)', 'count')
          .groupBy('config.category')
          .getRawMany(),
        this.configRepository
          .createQueryBuilder('config')
          .select('config.scope', 'scope')
          .addSelect('COUNT(*)', 'count')
          .groupBy('config.scope')
          .getRawMany(),
        this.configRepository.count({ where: { isPublic: true } }),
        this.configRepository.count({ where: { isEditable: true } })
      ]);

      const statistics = {
        totalCount,
        publicCount,
        privateCount: totalCount - publicCount,
        editableCount,
        lockedCount: totalCount - editableCount,
        categoryBreakdown: categoryBreakdown.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.category] = parseInt(curr.count, 10);
          return acc;
        }, {} as Record<string, number>),
        scopeBreakdown: scopeBreakdown.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.scope] = parseInt(curr.count, 10);
          return acc;
        }, {} as Record<string, number>)
      };

      this.logger.log('Retrieved configuration statistics');
      return statistics;
    } catch (error) {
      this.logger.error('Error getting configuration statistics:', error);
      throw error;
    }
  }
}
