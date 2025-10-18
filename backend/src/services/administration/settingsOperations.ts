/**
 * LOC: 062EC27F4E
 * WC-GEN-190 | settingsOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - types.ts (services/administration/types.ts)
 *   - configurationOperations.ts (services/administration/configurationOperations.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/administration/index.ts)
 */

/**
 * WC-GEN-190 | settingsOperations.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ./types, ./configurationOperations | Dependencies: ../../utils/logger, ./types, ./configurationOperations
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Settings Operations Module
 *
 * Handles system settings management
 *
 * @module services/administration/settingsOperations
 */

import { logger } from '../../utils/logger';
import { ConfigurationData } from './types';
import { getAllConfigurations, setConfiguration } from './configurationOperations';

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
