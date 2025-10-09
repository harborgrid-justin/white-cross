import { PrismaClient, ConfigCategory, ConfigValueType, ConfigScope } from '@prisma/client';

const prisma = new PrismaClient();

export interface ConfigurationFilter {
  category?: ConfigCategory;
  subCategory?: string;
  scope?: ConfigScope;
  scopeId?: string;
  tags?: string[];
  isPublic?: boolean;
  isEditable?: boolean;
}

export interface ConfigurationUpdate {
  value: string;
  changedBy: string;
  changedByName?: string;
  changeReason?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ConfigurationValidationResult {
  isValid: boolean;
  error?: string;
}

export class ConfigurationService {
  /**
   * Get a single configuration by key
   */
  async getConfigByKey(key: string, scopeId?: string): Promise<any> {
    try {
      const config = await prisma.systemConfiguration.findFirst({
        where: {
          key,
          ...(scopeId && { scopeId })
        },
        orderBy: {
          // Prioritize more specific scopes
          scope: 'desc'
        }
      });

      if (!config) {
        throw new Error(`Configuration not found: ${key}`);
      }

      return config;
    } catch (error) {
      console.error(`Error fetching configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get multiple configurations with filtering
   */
  async getConfigurations(filter: ConfigurationFilter = {}): Promise<any[]> {
    try {
      const { category, subCategory, scope, scopeId, tags, isPublic, isEditable } = filter;

      const configs = await prisma.systemConfiguration.findMany({
        where: {
          ...(category && { category }),
          ...(subCategory && { subCategory }),
          ...(scope && { scope }),
          ...(scopeId && { scopeId }),
          ...(tags && tags.length > 0 && { tags: { hasSome: tags } }),
          ...(isPublic !== undefined && { isPublic }),
          ...(isEditable !== undefined && { isEditable })
        },
        orderBy: [
          { sortOrder: 'asc' },
          { category: 'asc' },
          { subCategory: 'asc' },
          { key: 'asc' }
        ]
      });

      return configs;
    } catch (error) {
      console.error('Error fetching configurations:', error);
      throw error;
    }
  }

  /**
   * Get configurations by category
   */
  async getConfigsByCategory(category: ConfigCategory, scopeId?: string): Promise<any[]> {
    return this.getConfigurations({ category, scopeId });
  }

  /**
   * Get public configurations (safe to expose to frontend)
   */
  async getPublicConfigurations(): Promise<any[]> {
    return this.getConfigurations({ isPublic: true });
  }

  /**
   * Validate a configuration value
   */
  validateConfigValue(config: any, newValue: string): ConfigurationValidationResult {
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
        if (config.minValue !== null && numValue < config.minValue) {
          return { isValid: false, error: `Value must be at least ${config.minValue}` };
        }
        if (config.maxValue !== null && numValue > config.maxValue) {
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
    }

    // Check valid values constraint if specified
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
   * Update a configuration value
   */
  async updateConfiguration(
    key: string,
    updateData: ConfigurationUpdate,
    scopeId?: string
  ): Promise<any> {
    try {
      // Get the current configuration
      const config = await this.getConfigByKey(key, scopeId);

      // Validate the new value
      const validation = this.validateConfigValue(config, updateData.value);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Update the configuration
      const updatedConfig = await prisma.systemConfiguration.update({
        where: { id: config.id },
        data: {
          value: updateData.value,
          updatedAt: new Date()
        }
      });

      // Create history record
      await this.createConfigHistory({
        configurationId: config.id,
        configKey: key,
        oldValue: config.value,
        newValue: updateData.value,
        changedBy: updateData.changedBy,
        changedByName: updateData.changedByName,
        changeReason: updateData.changeReason,
        ipAddress: updateData.ipAddress,
        userAgent: updateData.userAgent
      });

      return updatedConfig;
    } catch (error) {
      console.error(`Error updating configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Bulk update configurations
   */
  async bulkUpdateConfigurations(
    updates: Array<{ key: string; value: string; scopeId?: string }>,
    changedBy: string,
    changeReason?: string
  ): Promise<any[]> {
    const results = [];

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
        console.error(`Error updating ${update.key}:`, error);
        results.push({ key: update.key, error: (error as Error).message });
      }
    }

    return results;
  }

  /**
   * Create a new configuration
   */
  async createConfiguration(data: {
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
  }): Promise<any> {
    try {
      const config = await prisma.systemConfiguration.create({
        data
      });

      return config;
    } catch (error) {
      console.error('Error creating configuration:', error);
      throw error;
    }
  }

  /**
   * Delete a configuration
   */
  async deleteConfiguration(key: string, scopeId?: string): Promise<void> {
    try {
      const config = await this.getConfigByKey(key, scopeId);

      await prisma.systemConfiguration.delete({
        where: { id: config.id }
      });
    } catch (error) {
      console.error(`Error deleting configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Reset configuration to default value
   */
  async resetToDefault(key: string, changedBy: string, scopeId?: string): Promise<any> {
    try {
      const config = await this.getConfigByKey(key, scopeId);

      if (!config.defaultValue) {
        throw new Error('No default value specified for this configuration');
      }

      return this.updateConfiguration(
        key,
        {
          value: config.defaultValue,
          changedBy,
          changeReason: 'Reset to default value'
        },
        scopeId
      );
    } catch (error) {
      console.error(`Error resetting configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get configuration history
   */
  async getConfigHistory(key: string, limit: number = 50): Promise<any[]> {
    try {
      const history = await prisma.configurationHistory.findMany({
        where: { configKey: key },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          configuration: {
            select: {
              key: true,
              category: true,
              description: true
            }
          }
        }
      });

      return history;
    } catch (error) {
      console.error(`Error fetching history for ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get all configuration changes by a user
   */
  async getConfigChangesByUser(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const history = await prisma.configurationHistory.findMany({
        where: { changedBy: userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          configuration: {
            select: {
              key: true,
              category: true,
              description: true
            }
          }
        }
      });

      return history;
    } catch (error) {
      console.error(`Error fetching user changes for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get recent configuration changes
   */
  async getRecentChanges(limit: number = 100): Promise<any[]> {
    try {
      const history = await prisma.configurationHistory.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          configuration: {
            select: {
              key: true,
              category: true,
              description: true
            }
          }
        }
      });

      return history;
    } catch (error) {
      console.error('Error fetching recent changes:', error);
      throw error;
    }
  }

  /**
   * Create a configuration history record
   */
  private async createConfigHistory(data: {
    configurationId: string;
    configKey: string;
    oldValue: string | null;
    newValue: string;
    changedBy: string;
    changedByName?: string;
    changeReason?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<any> {
    try {
      const history = await prisma.configurationHistory.create({
        data
      });

      return history;
    } catch (error) {
      console.error('Error creating configuration history:', error);
      throw error;
    }
  }

  /**
   * Get configurations that require restart
   */
  async getConfigsRequiringRestart(): Promise<any[]> {
    try {
      const configs = await prisma.systemConfiguration.findMany({
        where: { requiresRestart: true }
      });

      return configs;
    } catch (error) {
      console.error('Error fetching configs requiring restart:', error);
      throw error;
    }
  }

  /**
   * Export configurations as JSON
   */
  async exportConfigurations(filter: ConfigurationFilter = {}): Promise<string> {
    try {
      const configs = await this.getConfigurations(filter);
      return JSON.stringify(configs, null, 2);
    } catch (error) {
      console.error('Error exporting configurations:', error);
      throw error;
    }
  }

  /**
   * Import configurations from JSON
   */
  async importConfigurations(
    configsJson: string,
    changedBy: string,
    overwrite: boolean = false
  ): Promise<{ created: number; updated: number; errors: string[] }> {
    try {
      const configs = JSON.parse(configsJson);
      const results = { created: 0, updated: 0, errors: [] as string[] };

      for (const config of configs) {
        try {
          const existing = await prisma.systemConfiguration.findFirst({
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
            }
          } else {
            await this.createConfiguration(config);
            results.created++;
          }
        } catch (error) {
          results.errors.push(`Error processing ${config.key}: ${(error as Error).message}`);
        }
      }

      return results;
    } catch (error) {
      console.error('Error importing configurations:', error);
      throw error;
    }
  }
}

export default new ConfigurationService();
