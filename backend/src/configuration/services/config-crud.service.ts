/**
 * @fileoverview Configuration CRUD Service
 * @module configuration/services/config-crud.service
 * @description Handles basic CRUD operations for system configurations
 */

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ConfigCategory, ConfigScope, SystemConfig } from '../../database/models/system-config.model';
import { CreateConfigurationDto, FilterConfigurationDto } from '../dto';

import { BaseService } from '../../common/base';
@Injectable()
export class ConfigCrudService extends BaseService {
  constructor(
    @InjectModel(SystemConfig)
    private readonly configModel: typeof SystemConfig,
  ) {}

  /**
   * Get a single configuration by key with optional scope filtering
   */
  async getConfigByKey(key: string, scopeId?: string): Promise<SystemConfig> {
    try {
      const whereClause: any = { key };

      if (scopeId) {
        whereClause.scopeId = scopeId;
      }

      const configs = await this.configModel.findAll({
        where: whereClause,
        order: [
          ['scope', 'DESC'],
          ['createdAt', 'DESC'],
        ],
      });

      const config = configs[0];

      if (!config) {
        throw new NotFoundException(`Configuration not found: ${key}`);
      }

      return config;
    } catch (error) {
      this.logError(`Error fetching configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get multiple configurations with advanced filtering
   */
  async getConfigurations(
    filter: FilterConfigurationDto = {},
  ): Promise<SystemConfig[]> {
    try {
      const {
        category,
        subCategory,
        scope,
        scopeId,
        tags,
        isPublic,
        isEditable,
      } = filter;

      const where: any = {};

      if (category) {
        where.category = category;
      }

      if (subCategory) {
        where.subCategory = subCategory;
      }

      if (scope) {
        where.scope = scope;
      }

      if (scopeId) {
        where.scopeId = scopeId;
      }

      // Handle array overlap search for tags (PostgreSQL specific)
      if (tags && tags.length > 0) {
        where.tags = { [Op.overlap]: tags };
      }

      if (isPublic !== undefined) {
        where.isPublic = isPublic;
      }

      if (isEditable !== undefined) {
        where.isEditable = isEditable;
      }

      const configs = await this.configModel.findAll({
        where,
        order: [
          ['sortOrder', 'ASC'],
          ['category', 'ASC'],
          ['subCategory', 'ASC'],
          ['key', 'ASC'],
        ],
      });
      return configs;
    } catch (error) {
      this.logError('Error fetching configurations:', error);
      throw error;
    }
  }

  /**
   * Get configurations by category with optional scope filtering
   */
  async getConfigsByCategory(
    category: ConfigCategory,
    scopeId?: string,
  ): Promise<SystemConfig[]> {
    return this.getConfigurations({ category, scopeId });
  }

  /**
   * Get public configurations safe to expose to frontend
   */
  async getPublicConfigurations(): Promise<SystemConfig[]> {
    return this.getConfigurations({ isPublic: true });
  }

  /**
   * Create a new configuration
   */
  async createConfiguration(
    data: CreateConfigurationDto,
  ): Promise<SystemConfig> {
    try {
      // Check if key already exists
      const existing = await this.configModel.findOne({
        where: { key: data.key },
      });

      if (existing) {
        throw new BadRequestException(
          `Configuration with key '${data.key}' already exists`,
        );
      }

      const config = await this.configModel.create({
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
        requiresRestart:
          data.requiresRestart !== undefined ? data.requiresRestart : false,
        scope: data.scope || ConfigScope.SYSTEM,
        scopeId: data.scopeId,
        tags: data.tags,
        sortOrder: data.sortOrder !== undefined ? data.sortOrder : 0,
      } as any);

      this.logInfo(
        `Configuration created: ${data.key} in category ${data.category}`,
      );
      return config;
    } catch (error) {
      this.logError('Error creating configuration:', error);
      throw error;
    }
  }

  /**
   * Delete a configuration
   */
  async deleteConfiguration(key: string, scopeId?: string): Promise<void> {
    try {
      const config = await this.getConfigByKey(key, scopeId);
      await config.destroy();
      this.logInfo(`Configuration deleted: ${key}`);
    } catch (error) {
      this.logError(`Error deleting configuration ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get configurations that require system restart
   */
  async getConfigsRequiringRestart(): Promise<SystemConfig[]> {
    try {
      const configs = await this.configModel.findAll({
        where: { requiresRestart: true },
        order: [
          ['category', 'ASC'],
          ['key', 'ASC'],
        ],
      });

      return configs;
    } catch (error) {
      this.logError('Error fetching configs requiring restart:', error);
      throw error;
    }
  }

  /**
   * Update configuration basic attributes (used by other services)
   */
  async updateConfigAttributes(
    config: SystemConfig,
    updateData: { value: string; updatedAt: Date },
    transaction?: any,
  ): Promise<SystemConfig> {
    return config.update(updateData, { transaction });
  }

  /**
   * Find configuration by ID
   */
  async findConfigById(id: string): Promise<SystemConfig | null> {
    return this.configModel.findOne({ where: { id } });
  }

  /**
   * Check if configuration key exists
   */
  async configKeyExists(key: string): Promise<boolean> {
    const count = await this.configModel.count({ where: { key } });
    return count > 0;
  }
}
