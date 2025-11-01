import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SystemConfig, ConfigCategory } from '../../database/models/system-config.model';
import { ConfigurationHistory } from '../../database/models/configuration-history.model';
import { ConfigurationDto } from '../dto/configuration.dto';

/**
 * ConfigurationService
 *
 * Manages system configuration settings with change history tracking
 */
@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name);

  constructor(
    @InjectModel(SystemConfig)
    private configModel: typeof SystemConfig,
    @InjectModel(ConfigurationHistory)
    private historyModel: typeof ConfigurationHistory,
    private sequelize: Sequelize,
  ) {}

  /**
   * Get a single configuration by key
   */
  async getConfiguration(key: string): Promise<SystemConfig> {
    try {
      const config = await this.configModel.findOne({ where: { key } });
      if (!config) {
        throw new NotFoundException(`Configuration with key '${key}' not found`);
      }
      return config;
    } catch (error) {
      this.logger.error(`Error fetching configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get all configurations, optionally filtered by category
   */
  async getAllConfigurations(
    category?: ConfigCategory,
  ): Promise<SystemConfig[]> {
    try {
      const whereClause: any = {};
      if (category) {
        whereClause.category = category;
      }

      const configs = await this.configModel.findAll({
        where: whereClause,
        order: [
          ['category', 'ASC'],
          ['sortOrder', 'ASC'],
          ['key', 'ASC'],
        ],
      });

      return configs;
    } catch (error) {
      this.logger.error('Error fetching configurations:', error);
      throw error;
    }
  }

  /**
   * Set configuration with change history tracking
   */
  async setConfiguration(
    data: ConfigurationDto,
    changedBy?: string,
  ): Promise<SystemConfig> {
    const transaction = await this.sequelize.transaction();

    try {
      const existingConfig = await this.configModel.findOne({
        where: { key: data.key },
        transaction,
      });

      let config: SystemConfig;
      const oldValue = existingConfig?.value;

      if (existingConfig) {
        await existingConfig.update(data, { transaction });
        config = existingConfig;
      } else {
        config = await this.configModel.create(data, { transaction });
      }

      if (changedBy && config.id) {
        await this.historyModel.create({
          configKey: data.key,
          oldValue,
          newValue: data.value,
          changedBy,
          configurationId: config.id,
        }, { transaction });
      }

      await transaction.commit();
      this.logger.log(`Configuration set: ${data.key} = ${data.value}`);
      return config;
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Error setting configuration:', error);
      throw error;
    }
  }

  /**
   * Delete configuration
   */
  async deleteConfiguration(key: string): Promise<void> {
    try {
      const config = await this.configModel.findOne({ where: { key } });
      if (!config) {
        throw new NotFoundException(`Configuration with key '${key}' not found`);
      }
      await config.destroy();
      this.logger.log(`Configuration deleted: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get configuration change history
   */
  async getConfigurationHistory(
    configKey: string,
    limit: number = 50,
  ): Promise<ConfigurationHistory[]> {
    try {
      return await this.historyModel.findAll({
        where: { configKey },
        limit,
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      this.logger.error(`Error fetching configuration history:`, error);
      throw error;
    }
  }

  /**
   * Get all system settings grouped by category
   */
  async getSystemSettings(): Promise<Record<string, any[]>> {
    try {
      const configs = await this.getAllConfigurations();
      const groupedSettings: Record<string, any[]> = {};

      configs.forEach((config) => {
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
          tags: config.tags,
        });
      });

      return groupedSettings;
    } catch (error) {
      this.logger.error('Error fetching system settings:', error);
      throw error;
    }
  }
}
