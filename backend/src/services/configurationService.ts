/**
 * WC-GEN-246 | configurationService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../utils/logger, ../database/models, ../database/types/enums | Dependencies: sequelize, ../utils/logger, ../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, interfaces, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op, Transaction } from 'sequelize';
import { logger } from '../utils/logger';
import { SystemConfiguration, ConfigurationHistory, sequelize } from '../database/models';
import { ConfigValueType, ConfigCategory, ConfigScope } from '../database/types/enums';

/**
 * Configuration Service Filter Interface
 * Defines available filters for querying system configurations
 */
export interface ConfigurationFilter {
  category?: ConfigCategory;
  subCategory?: string;
  scope?: ConfigScope;
  scopeId?: string;
  tags?: string[];
  isPublic?: boolean;
  isEditable?: boolean;
}

/**
 * Configuration Update Interface
 * Contains all fields needed to update a configuration with audit trail
 */
export interface ConfigurationUpdate {
  value: string;
  changedBy: string;
  changedByName?: string;
  changeReason?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Configuration Validation Result Interface
 * Standardized validation response structure
 */
export interface ConfigurationValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Create Configuration Data Interface
 * Defines all fields available when creating a new configuration
 */
export interface CreateConfigurationData {
  key: string;
  value: string;
  valueType: ConfigValueType;
  category: ConfigCategory;
  subCategory?: string;
  description?: string;
  defaultValue?: string;
  validValues?: string[];
  minValue?: number;
  maxValue?: number;
  isPublic?: boolean;
  isEditable?: boolean;
  requiresRestart?: boolean;
  scope?: ConfigScope;
  scopeId?: string;
  tags?: string[];
  sortOrder?: number;
}

/**
 * Configuration History Data Interface
 * Internal interface for creating history records
 */
interface CreateConfigHistoryData {
  configurationId: string;
  configKey: string;
  oldValue: string | null;
  newValue: string;
  changedBy: string;
  changedByName?: string;
  changeReason?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Configuration Service Class
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
export class ConfigurationService {
  /**
   * Get a single configuration by key with optional scope filtering
   *
   * Implements scope priority: more specific scopes take precedence
   * (e.g., SCHOOL > DISTRICT > SYSTEM for the same key)
   *
   * @param key - Configuration key to retrieve
   * @param scopeId - Optional scope ID to filter by
   * @returns Configuration object
   * @throws Error if configuration not found
   */
  async getConfigByKey(key: string, scopeId?: string): Promise<SystemConfiguration> {
    try {
      const whereClause: any = { key };

      if (scopeId) {
        whereClause.scopeId = scopeId;
      }

      const config = await SystemConfiguration.findOne({
        where: whereClause,
        order: [
          // Prioritize more specific scopes (reverse alphabetical order)
          ['scope', 'DESC'],
          ['createdAt', 'DESC']
        ]
      });

      if (!config) {
        throw new Error(`Configuration not found: ${key}`);
      }

      return config;
    } catch (error) {
      logger.error(`Error fetching configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get multiple configurations with advanced filtering
   *
   * Supports filtering by category, subcategory, scope, tags, visibility, and editability
   * Results are ordered by sortOrder, category, subcategory, and key
   *
   * @param filter - Optional filter criteria
   * @returns Array of configuration objects
   */
  async getConfigurations(filter: ConfigurationFilter = {}): Promise<SystemConfiguration[]> {
    try {
      const { category, subCategory, scope, scopeId, tags, isPublic, isEditable } = filter;

      const whereClause: any = {};

      if (category) {
        whereClause.category = category;
      }

      if (subCategory) {
        whereClause.subCategory = subCategory;
      }

      if (scope) {
        whereClause.scope = scope;
      }

      if (scopeId) {
        whereClause.scopeId = scopeId;
      }

      // Handle array overlap search for tags
      if (tags && tags.length > 0) {
        whereClause.tags = {
          [Op.overlap]: tags
        };
      }

      if (isPublic !== undefined) {
        whereClause.isPublic = isPublic;
      }

      if (isEditable !== undefined) {
        whereClause.isEditable = isEditable;
      }

      const configs = await SystemConfiguration.findAll({
        where: whereClause,
        order: [
          ['sortOrder', 'ASC'],
          ['category', 'ASC'],
          ['subCategory', 'ASC'],
          ['key', 'ASC']
        ]
      });

      return configs;
    } catch (error) {
      logger.error('Error fetching configurations:', error);
      throw error;
    }
  }

  /**
   * Get configurations by category with optional scope filtering
   *
   * Convenience method for category-based retrieval
   *
   * @param category - Configuration category
   * @param scopeId - Optional scope ID to filter by
   * @returns Array of configuration objects in the category
   */
  async getConfigsByCategory(category: ConfigCategory, scopeId?: string): Promise<SystemConfiguration[]> {
    return this.getConfigurations({ category, scopeId });
  }

  /**
   * Get public configurations safe to expose to frontend
   *
   * Only returns configurations marked as public (isPublic = true)
   * Used for client-side configuration without exposing sensitive settings
   *
   * @returns Array of public configuration objects
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
   *
   * @param config - Configuration object to validate against
   * @param newValue - New value to validate
   * @returns Validation result with success flag and optional error message
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
   *
   * @param key - Configuration key to update
   * @param updateData - Update data including new value and audit information
   * @param scopeId - Optional scope ID for scoped configurations
   * @returns Updated configuration object
   * @throws Error if configuration not found, not editable, or validation fails
   */
  async updateConfiguration(
    key: string,
    updateData: ConfigurationUpdate,
    scopeId?: string
  ): Promise<SystemConfiguration> {
    const transaction = await sequelize.transaction();

    try {
      // Get the current configuration
      const config = await this.getConfigByKey(key, scopeId);

      // Validate the new value
      const validation = this.validateConfigValue(config, updateData.value);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Store old value for history
      const oldValue = config.value;

      // Update the configuration within transaction
      await config.update(
        {
          value: updateData.value,
          updatedAt: new Date()
        },
        { transaction }
      );

      // Create history record within same transaction
      await this.createConfigHistory(
        {
          configurationId: config.id,
          configKey: key,
          oldValue,
          newValue: updateData.value,
          changedBy: updateData.changedBy,
          changedByName: updateData.changedByName,
          changeReason: updateData.changeReason,
          ipAddress: updateData.ipAddress,
          userAgent: updateData.userAgent
        },
        transaction
      );

      // Commit transaction
      await transaction.commit();

      logger.info(`Configuration updated: ${key} = ${updateData.value} by ${updateData.changedBy}`);
      return config;
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      logger.error(`Error updating configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Bulk update multiple configurations
   *
   * Updates multiple configurations in sequence. Each update is independent
   * with its own transaction. Failures are logged but don't stop other updates.
   *
   * @param updates - Array of configuration updates
   * @param changedBy - User ID making the changes
   * @param changeReason - Optional reason for the changes
   * @returns Array of results (successful updates or error objects)
   */
  async bulkUpdateConfigurations(
    updates: Array<{ key: string; value: string; scopeId?: string }>,
    changedBy: string,
    changeReason?: string
  ): Promise<Array<SystemConfiguration | { key: string; error: string }>> {
    const results: Array<SystemConfiguration | { key: string; error: string }> = [];

    for (const update of updates) {
      try {
        const result = await this.updateConfiguration(
          update.key,
          {
            value: update.value,
            changedBy,
            changeReason
          },
          update.scopeId
        );
        results.push(result);
      } catch (error) {
        logger.error(`Error updating ${update.key}:`, error);
        results.push({ key: update.key, error: (error as Error).message });
      }
    }

    logger.info(`Bulk update completed: ${results.length} configurations processed`);
    return results;
  }

  /**
   * Create a new configuration
   *
   * Creates a new system configuration with all specified attributes.
   * Key must be unique across all configurations.
   *
   * @param data - Configuration creation data
   * @returns Created configuration object
   * @throws Error if key already exists or validation fails
   */
  async createConfiguration(data: CreateConfigurationData): Promise<SystemConfiguration> {
    try {
      // Check if key already exists
      const existing = await SystemConfiguration.findOne({
        where: { key: data.key }
      });

      if (existing) {
        throw new Error(`Configuration with key '${data.key}' already exists`);
      }

      const config = await SystemConfiguration.create({
        key: data.key,
        value: data.value,
        valueType: data.valueType,
        category: data.category,
        subCategory: data.subCategory,
        description: data.description,
        defaultValue: data.defaultValue,
        validValues: data.validValues || [],
        minValue: data.minValue,
        maxValue: data.maxValue,
        isPublic: data.isPublic !== undefined ? data.isPublic : false,
        isEditable: data.isEditable !== undefined ? data.isEditable : true,
        requiresRestart: data.requiresRestart !== undefined ? data.requiresRestart : false,
        scope: data.scope || ConfigScope.SYSTEM,
        scopeId: data.scopeId,
        tags: data.tags || [],
        sortOrder: data.sortOrder !== undefined ? data.sortOrder : 0
      });

      logger.info(`Configuration created: ${data.key} in category ${data.category}`);
      return config;
    } catch (error) {
      logger.error('Error creating configuration:', error);
      throw error;
    }
  }

  /**
   * Delete a configuration
   *
   * Deletes a configuration by key. Associated history records are
   * automatically deleted via CASCADE constraint.
   *
   * @param key - Configuration key to delete
   * @param scopeId - Optional scope ID for scoped configurations
   * @throws Error if configuration not found
   */
  async deleteConfiguration(key: string, scopeId?: string): Promise<void> {
    try {
      const config = await this.getConfigByKey(key, scopeId);

      await config.destroy();

      logger.info(`Configuration deleted: ${key}`);
    } catch (error) {
      logger.error(`Error deleting configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Reset configuration to its default value
   *
   * Resets a configuration to its default value with full audit trail.
   * Only works if a default value was specified when creating the config.
   *
   * @param key - Configuration key to reset
   * @param changedBy - User ID performing the reset
   * @param scopeId - Optional scope ID for scoped configurations
   * @returns Updated configuration object
   * @throws Error if no default value exists
   */
  async resetToDefault(key: string, changedBy: string, scopeId?: string): Promise<SystemConfiguration> {
    try {
      const config = await this.getConfigByKey(key, scopeId);

      if (!config.defaultValue) {
        throw new Error('No default value specified for this configuration');
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

      logger.info(`Configuration reset to default: ${key}`);
      return result;
    } catch (error) {
      logger.error(`Error resetting configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get configuration change history
   *
   * Retrieves the change history for a specific configuration key,
   * including the configuration details for context.
   *
   * @param key - Configuration key to get history for
   * @param limit - Maximum number of history records to return (default: 50)
   * @returns Array of history records with configuration details
   */
  async getConfigHistory(key: string, limit: number = 50): Promise<ConfigurationHistory[]> {
    try {
      const history = await ConfigurationHistory.findAll({
        where: { configKey: key },
        include: [
          {
            model: SystemConfiguration,
            as: 'configuration',
            attributes: ['id', 'key', 'category', 'description']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit
      });

      return history;
    } catch (error) {
      logger.error(`Error fetching history for ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get all configuration changes by a user
   *
   * Retrieves all configuration changes made by a specific user,
   * useful for auditing and compliance reporting.
   *
   * @param userId - User ID to get changes for
   * @param limit - Maximum number of history records to return (default: 50)
   * @returns Array of history records with configuration details
   */
  async getConfigChangesByUser(userId: string, limit: number = 50): Promise<ConfigurationHistory[]> {
    try {
      const history = await ConfigurationHistory.findAll({
        where: { changedBy: userId },
        include: [
          {
            model: SystemConfiguration,
            as: 'configuration',
            attributes: ['id', 'key', 'category', 'description']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit
      });

      return history;
    } catch (error) {
      logger.error(`Error fetching user changes for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get recent configuration changes across all configurations
   *
   * Retrieves the most recent configuration changes system-wide,
   * useful for monitoring and audit dashboards.
   *
   * @param limit - Maximum number of history records to return (default: 100)
   * @returns Array of history records with configuration details
   */
  async getRecentChanges(limit: number = 100): Promise<ConfigurationHistory[]> {
    try {
      const history = await ConfigurationHistory.findAll({
        include: [
          {
            model: SystemConfiguration,
            as: 'configuration',
            attributes: ['id', 'key', 'category', 'description']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit
      });

      return history;
    } catch (error) {
      logger.error('Error fetching recent changes:', error);
      throw error;
    }
  }

  /**
   * Create a configuration history record
   *
   * Private method to create audit trail entries. Always called within
   * a transaction to ensure atomicity with configuration updates.
   *
   * @param data - History record data
   * @param transaction - Database transaction (optional)
   * @returns Created history record
   */
  private async createConfigHistory(
    data: CreateConfigHistoryData,
    transaction?: Transaction
  ): Promise<ConfigurationHistory> {
    try {
      const history = await ConfigurationHistory.create(
        {
          configurationId: data.configurationId,
          configKey: data.configKey,
          oldValue: data.oldValue,
          newValue: data.newValue,
          changedBy: data.changedBy,
          changedByName: data.changedByName,
          changeReason: data.changeReason,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent
        },
        { transaction }
      );

      return history;
    } catch (error) {
      logger.error('Error creating configuration history:', error);
      throw error;
    }
  }

  /**
   * Get configurations that require system restart
   *
   * Returns all configurations marked with requiresRestart = true.
   * Used to warn administrators when changes need a restart to take effect.
   *
   * @returns Array of configurations requiring restart
   */
  async getConfigsRequiringRestart(): Promise<SystemConfiguration[]> {
    try {
      const configs = await SystemConfiguration.findAll({
        where: { requiresRestart: true },
        order: [
          ['category', 'ASC'],
          ['key', 'ASC']
        ]
      });

      return configs;
    } catch (error) {
      logger.error('Error fetching configs requiring restart:', error);
      throw error;
    }
  }

  /**
   * Export configurations as JSON
   *
   * Exports configurations matching the filter criteria as formatted JSON.
   * Useful for backup, migration, or configuration templates.
   *
   * @param filter - Optional filter criteria
   * @returns JSON string representation of configurations
   */
  async exportConfigurations(filter: ConfigurationFilter = {}): Promise<string> {
    try {
      const configs = await this.getConfigurations(filter);

      // Convert to plain objects for JSON serialization
      const plainConfigs = configs.map(config => config.get({ plain: true }));

      logger.info(`Exported ${configs.length} configurations`);
      return JSON.stringify(plainConfigs, null, 2);
    } catch (error) {
      logger.error('Error exporting configurations:', error);
      throw error;
    }
  }

  /**
   * Import configurations from JSON
   *
   * Imports configurations from a JSON string. Can either create new
   * configurations or overwrite existing ones based on the overwrite flag.
   *
   * @param configsJson - JSON string containing configuration array
   * @param changedBy - User ID performing the import
   * @param overwrite - Whether to overwrite existing configurations (default: false)
   * @returns Import results summary with counts and errors
   */
  async importConfigurations(
    configsJson: string,
    changedBy: string,
    overwrite: boolean = false
  ): Promise<{ created: number; updated: number; errors: string[] }> {
    try {
      const configs = JSON.parse(configsJson);

      if (!Array.isArray(configs)) {
        throw new Error('Invalid JSON format: expected an array of configurations');
      }

      const results = { created: 0, updated: 0, errors: [] as string[] };

      for (const config of configs) {
        try {
          if (!config.key) {
            results.errors.push('Configuration missing required field: key');
            continue;
          }

          const existing = await SystemConfiguration.findOne({
            where: { key: config.key }
          });

          if (existing) {
            if (overwrite) {
              await this.updateConfiguration(
                config.key,
                {
                  value: config.value,
                  changedBy,
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

      logger.info(`Import completed: ${results.created} created, ${results.updated} updated, ${results.errors.length} errors`);
      return results;
    } catch (error) {
      logger.error('Error importing configurations:', error);
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
   *
   * @returns Statistics object
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
        SystemConfiguration.count(),
        SystemConfiguration.findAll({
          attributes: [
            'category',
            [sequelize.fn('COUNT', sequelize.col('category')), 'count']
          ],
          group: ['category'],
          raw: true
        }),
        SystemConfiguration.findAll({
          attributes: [
            'scope',
            [sequelize.fn('COUNT', sequelize.col('scope')), 'count']
          ],
          group: ['scope'],
          raw: true
        }),
        SystemConfiguration.count({
          where: { isPublic: true }
        }),
        SystemConfiguration.count({
          where: { isEditable: true }
        })
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

      logger.info('Retrieved configuration statistics');
      return statistics;
    } catch (error) {
      logger.error('Error getting configuration statistics:', error);
      throw error;
    }
  }
}

export default new ConfigurationService();
