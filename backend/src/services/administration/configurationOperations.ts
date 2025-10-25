/**
 * LOC: 17C3E9D263
 * WC-GEN-184 | configurationOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - types.ts (services/administration/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/administration/index.ts)
 *   - settingsOperations.ts (services/administration/settingsOperations.ts)
 */

/**
 * WC-GEN-184 | configurationOperations.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: ../../utils/logger, ../../database/models, ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Configuration Operations Module
 *
 * @module services/administration/configurationOperations
 */

import { logger } from '../../utils/logger';
import { SystemConfiguration, ConfigurationHistory, sequelize } from '../../database/models';
import { ConfigCategory } from '../../database/types/enums';
import { ConfigurationData } from './administration.types';

/**
 * Get a single configuration by key
 */
export async function getConfiguration(key: string) {
  try {
    const config = await SystemConfiguration.findOne({
      where: { key }
    });

    return config;
  } catch (error) {
    logger.error('Error fetching configuration:', error);
    throw error;
  }
}

/**
 * Get all configurations, optionally filtered by category
 */
export async function getAllConfigurations(category?: ConfigCategory) {
  try {
    const whereClause: any = {};

    if (category) {
      whereClause.category = category;
    }

    const configs = await SystemConfiguration.findAll({
      where: whereClause,
      order: [
        ['category', 'ASC'],
        ['sortOrder', 'ASC'],
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
 * Set configuration with change history tracking
 */
export async function setConfiguration(data: ConfigurationData, changedBy?: string) {
  const transaction = await sequelize.transaction();

  try {
    // Find existing configuration
    const existingConfig = await SystemConfiguration.findOne({
      where: { key: data.key },
      transaction
    });

    let config: SystemConfiguration;
    const oldValue = existingConfig?.value;

    if (existingConfig) {
      // Update existing configuration
      await existingConfig.update(
        {
          value: data.value,
          category: data.category,
          valueType: data.valueType,
          subCategory: data.subCategory,
          description: data.description,
          isPublic: data.isPublic,
          isEditable: data.isEditable,
          requiresRestart: data.requiresRestart,
          scope: data.scope,
          scopeId: data.scopeId,
          tags: data.tags,
          sortOrder: data.sortOrder
        },
        { transaction }
      );
      config = existingConfig;
    } else {
      // Create new configuration
      config = await SystemConfiguration.create(data, { transaction });
    }

    // Create configuration history record
    if (changedBy) {
      await ConfigurationHistory.create(
        {
          configKey: data.key,
          oldValue,
          newValue: data.value,
          changedBy,
          configurationId: config.id
        },
        { transaction }
      );
    }

    await transaction.commit();

    logger.info(`Configuration set: ${data.key} = ${data.value}`);
    return config;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error setting configuration:', error);
    throw error;
  }
}

/**
 * Delete configuration
 */
export async function deleteConfiguration(key: string) {
  try {
    const config = await SystemConfiguration.findOne({
      where: { key }
    });

    if (!config) {
      throw new Error('Configuration not found');
    }

    await config.destroy();

    logger.info(`Configuration deleted: ${key}`);
    return { success: true };
  } catch (error) {
    logger.error('Error deleting configuration:', error);
    throw error;
  }
}

/**
 * Get configuration change history
 */
export async function getConfigurationHistory(configKey: string, limit: number = 50) {
  try {
    const history = await ConfigurationHistory.findAll({
      where: { configKey },
      limit,
      order: [['createdAt', 'DESC']]
    });

    return history;
  } catch (error) {
    logger.error('Error fetching configuration history:', error);
    throw error;
  }
}

/**
 * Get all system settings grouped by category
 */
export async function getSystemSettings() {
  try {
    const configs = await getAllConfigurations();

    // Group configurations by category for easier consumption
    const groupedSettings: Record<string, any[]> = {};
    configs.forEach(config => {
      if (!groupedSettings[config.category]) {
        groupedSettings[config.category] = [];
      }
      groupedSettings[config.category].push({
        key: config.key,
        value: config.value,
        valueType: config.valueType,
        description: config.description,
        isPublic: config.isPublic,
        isEditable: config.isEditable,
        requiresRestart: config.requiresRestart,
        category: config.category,
        subCategory: config.subCategory,
        scope: config.scope,
        tags: config.tags
      });
    });

    return groupedSettings;
  } catch (error) {
    logger.error('Error fetching system settings:', error);
    throw new Error('Failed to fetch system settings');
  }
}

/**
 * Update multiple system settings
 */
export async function updateSystemSettings(settings: ConfigurationData[], changedBy?: string) {
  try {
    const results = await Promise.all(
      settings.map(setting => setConfiguration(setting, changedBy))
    );

    logger.info(`Updated ${results.length} system settings`);
    return results;
  } catch (error) {
    logger.error('Error updating system settings:', error);
    throw error;
  }
}
