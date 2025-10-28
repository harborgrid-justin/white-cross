import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SystemConfiguration } from '../entities/system-configuration.entity';
import { ConfigurationHistory } from '../entities/configuration-history.entity';
import { ConfigCategory } from '../enums/administration.enums';
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
    @InjectRepository(SystemConfiguration)
    private configRepository: Repository<SystemConfiguration>,
    @InjectRepository(ConfigurationHistory)
    private historyRepository: Repository<ConfigurationHistory>,
    private dataSource: DataSource,
  ) {}

  /**
   * Get a single configuration by key
   */
  async getConfiguration(key: string): Promise<SystemConfiguration> {
    try {
      const config = await this.configRepository.findOne({ where: { key } });
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
  ): Promise<SystemConfiguration[]> {
    try {
      const whereClause: any = {};
      if (category) {
        whereClause.category = category;
      }

      const configs = await this.configRepository.find({
        where: whereClause,
        order: {
          category: 'ASC',
          sortOrder: 'ASC',
          key: 'ASC',
        },
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
  ): Promise<SystemConfiguration> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingConfig = await queryRunner.manager.findOne(
        SystemConfiguration,
        { where: { key: data.key } },
      );

      let config: SystemConfiguration;
      const oldValue = existingConfig?.value;

      if (existingConfig) {
        await queryRunner.manager.update(
          SystemConfiguration,
          { key: data.key },
          { ...data },
        );
        const foundConfig = await queryRunner.manager.findOne(SystemConfiguration, {
          where: { key: data.key },
        });
        if (!foundConfig) {
          throw new Error(`Configuration with key '${data.key}' not found after update`);
        }
        config = foundConfig;
      } else {
        config = queryRunner.manager.create(SystemConfiguration, data);
        config = await queryRunner.manager.save(config);
      }

      if (changedBy) {
        const history = queryRunner.manager.create(ConfigurationHistory, {
          configKey: data.key,
          oldValue,
          newValue: data.value,
          changedBy,
          configurationId: config.id,
        });
        await queryRunner.manager.save(history);
      }

      await queryRunner.commitTransaction();
      this.logger.log(`Configuration set: ${data.key} = ${data.value}`);
      return config;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error setting configuration:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Delete configuration
   */
  async deleteConfiguration(key: string): Promise<void> {
    try {
      const config = await this.configRepository.findOne({ where: { key } });
      if (!config) {
        throw new NotFoundException(`Configuration with key '${key}' not found`);
      }
      await this.configRepository.remove(config);
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
      return await this.historyRepository.find({
        where: { configKey },
        take: limit,
        order: { createdAt: 'DESC' },
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
