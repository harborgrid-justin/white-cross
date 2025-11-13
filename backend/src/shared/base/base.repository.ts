/**
 * @fileoverview Base Repository Class
 * @module shared/base/base.repository
 * @description Common data access patterns for all repositories
 */

import { Injectable, Logger } from '@nestjs/common';
import { Model, ModelStatic, Op, Transaction, WhereOptions } from 'sequelize';
import { LoggerService } from '../logging/logger.service';
import { QueryCacheService } from '../../database/services/query-cache.service';

/**
 * Base Repository Configuration
 */
export interface BaseRepositoryConfig {
  model: ModelStatic<Model>;
  logger: LoggerService;
  cacheService?: QueryCacheService;
  enableCache?: boolean;
  cacheTTL?: number;
}

/**
 * Repository Query Options
 */
export interface RepositoryQueryOptions {
  where?: WhereOptions;
  include?: any[];
  order?: any[];
  limit?: number;
  offset?: number;
  attributes?: string[];
  transaction?: Transaction;
  paranoid?: boolean;
}

/**
 * Pagination Options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  order?: any[];
  include?: any[];
}

/**
 * Base Repository Class
 *
 * Provides common data access patterns with:
 * - Standardized CRUD operations
 * - Caching integration
 * - Transaction support
 * - Error handling
 * - Audit logging
 * - Performance monitoring
 */
@Injectable()
export abstract class BaseRepository<T extends Model> {
  protected readonly model: ModelStatic<T>;
  protected readonly logger: LoggerService;
  protected readonly cacheService?: QueryCacheService;
  protected readonly enableCache: boolean;
  protected readonly cacheTTL: number;
  protected readonly repositoryName: string;

  constructor(config: BaseRepositoryConfig) {
    this.model = config.model as ModelStatic<T>;
    this.logger = config.logger;
    this.cacheService = config.cacheService;
    this.enableCache = config.enableCache ?? true;
    this.cacheTTL = config.cacheTTL ?? 300; // 5 minutes default
    this.repositoryName = this.constructor.name;
  }

  /**
   * Find entity by ID with caching
   */
  async findById(
    id: string,
    options: Omit<RepositoryQueryOptions, 'where'> = {},
  ): Promise<T | null> {
    try {
      const cacheKey = `repo_${this.repositoryName}_findById_${id}`;

      if (this.enableCache && this.cacheService) {
        const cached = await this.cacheService.getFromCache(cacheKey);
        if (cached) {
          this.logger.log(`Cache hit for ${this.repositoryName}.findById(${id})`);
          return cached as T;
        }
      }

      const entity = await this.model.findByPk(id, options);

      if (this.enableCache && this.cacheService && entity) {
        await this.cacheService.setCache(cacheKey, entity, this.cacheTTL);
      }

      this.logger.log(`Found entity ${this.repositoryName} with ID ${id}`);
      return entity;
    } catch (error) {
      this.logger.error(`Error finding ${this.repositoryName} by ID ${id}`, error);
      throw error;
    }
  }

  /**
   * Find entities with pagination
   */
  async findWithPagination(
    options: RepositoryQueryOptions & PaginationOptions,
  ): Promise<{ data: T[]; total: number; pages: number }> {
    try {
      const { page, limit, where, include, order, attributes, transaction } = options;
      const offset = (page - 1) * limit;

      const queryOptions: any = {
        where,
        include,
        order: order || [['createdAt', 'DESC']],
        attributes,
        limit,
        offset,
        transaction,
        distinct: true, // Important for accurate counts with joins
      };

      const { rows: data, count: total } = await this.model.findAndCountAll(queryOptions);
      const pages = Math.ceil(total / limit);

      this.logger.log(
        `Found ${data.length} ${this.repositoryName} entities (page ${page}/${pages}, total: ${total})`,
      );

      return { data, total, pages };
    } catch (error) {
      this.logger.error(`Error finding ${this.repositoryName} with pagination`, error);
      throw error;
    }
  }

  /**
   * Find all entities matching criteria
   */
  async findAll(options: RepositoryQueryOptions = {}): Promise<T[]> {
    try {
      const entities = await this.model.findAll(options);
      this.logger.log(`Found ${entities.length} ${this.repositoryName} entities`);
      return entities;
    } catch (error) {
      this.logger.error(`Error finding all ${this.repositoryName}`, error);
      throw error;
    }
  }

  /**
   * Find one entity matching criteria
   */
  async findOne(options: RepositoryQueryOptions = {}): Promise<T | null> {
    try {
      const entity = await this.model.findOne(options);
      this.logger.log(`Found ${this.repositoryName} entity: ${entity ? 'exists' : 'not found'}`);
      return entity;
    } catch (error) {
      this.logger.error(`Error finding one ${this.repositoryName}`, error);
      throw error;
    }
  }

  /**
   * Create new entity
   */
  async create(data: Partial<T>, options: { transaction?: Transaction } = {}): Promise<T> {
    try {
      const entity = await this.model.create(data as any, options);

      // Invalidate related caches
      if (this.enableCache && this.cacheService) {
        await this.invalidateCache();
      }

      this.logger.log(`Created new ${this.repositoryName} entity`);
      return entity;
    } catch (error) {
      this.logger.error(`Error creating ${this.repositoryName}`, error);
      throw error;
    }
  }

  /**
   * Update entity by ID
   */
  async updateById(
    id: string,
    data: Partial<T>,
    options: { transaction?: Transaction } = {},
  ): Promise<T | null> {
    try {
      const [affectedCount] = await this.model.update(data as any, {
        where: { id },
        ...options,
      });

      if (affectedCount === 0) {
        this.logger.warn(`No ${this.repositoryName} entity found with ID ${id} to update`);
        return null;
      }

      // Fetch updated entity
      const updatedEntity = await this.findById(id, options);

      // Invalidate caches
      if (this.enableCache && this.cacheService) {
        await this.invalidateCache();
      }

      this.logger.log(`Updated ${this.repositoryName} entity with ID ${id}`);
      return updatedEntity;
    } catch (error) {
      this.logger.error(`Error updating ${this.repositoryName} with ID ${id}`, error);
      throw error;
    }
  }

  /**
   * Delete entity by ID (soft delete if paranoid)
   */
  async deleteById(
    id: string,
    options: { transaction?: Transaction; force?: boolean } = {},
  ): Promise<boolean> {
    try {
      const deletedCount = await this.model.destroy({
        where: { id },
        ...options,
      });

      const deleted = deletedCount > 0;

      if (deleted) {
        // Invalidate caches
        if (this.enableCache && this.cacheService) {
          await this.invalidateCache();
        }

        this.logger.log(`Deleted ${this.repositoryName} entity with ID ${id}`);
      } else {
        this.logger.warn(`No ${this.repositoryName} entity found with ID ${id} to delete`);
      }

      return deleted;
    } catch (error) {
      this.logger.error(`Error deleting ${this.repositoryName} with ID ${id}`, error);
      throw error;
    }
  }

  /**
   * Count entities matching criteria
   */
  async count(options: Omit<RepositoryQueryOptions, 'limit' | 'offset'> = {}): Promise<number> {
    try {
      const count = await this.model.count(options);
      this.logger.log(`Counted ${count} ${this.repositoryName} entities`);
      return count;
    } catch (error) {
      this.logger.error(`Error counting ${this.repositoryName}`, error);
      throw error;
    }
  }

  /**
   * Check if entity exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.model.count({ where: { id } });
      const exists = count > 0;
      this.logger.log(`${this.repositoryName} entity ${id} ${exists ? 'exists' : 'does not exist'}`);
      return exists;
    } catch (error) {
      this.logger.error(`Error checking existence of ${this.repositoryName} ${id}`, error);
      throw error;
    }
  }

  /**
   * Execute within transaction
   */
  async executeInTransaction<T>(
    callback: (transaction: Transaction) => Promise<T>,
  ): Promise<T> {
    const transaction = await this.model.sequelize!.transaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      this.logger.log(`Transaction completed successfully for ${this.repositoryName}`);
      return result;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Transaction rolled back for ${this.repositoryName}`, error);
      throw error;
    }
  }

  /**
   * Bulk create entities
   */
  async bulkCreate(
    data: Partial<T>[],
    options: { transaction?: Transaction; validate?: boolean } = {},
  ): Promise<T[]> {
    try {
      const entities = await this.model.bulkCreate(data as any[], options);

      // Invalidate caches
      if (this.enableCache && this.cacheService) {
        await this.invalidateCache();
      }

      this.logger.log(`Bulk created ${entities.length} ${this.repositoryName} entities`);
      return entities;
    } catch (error) {
      this.logger.error(`Error bulk creating ${this.repositoryName}`, error);
      throw error;
    }
  }

  /**
   * Bulk update entities
   */
  async bulkUpdate(
    updates: Array<{ id: string; data: Partial<T> }>,
    options: { transaction?: Transaction } = {},
  ): Promise<number> {
    try {
      let totalAffected = 0;

      for (const update of updates) {
        const [affectedCount] = await this.model.update(update.data as any, {
          where: { id: update.id },
          ...options,
        });
        totalAffected += affectedCount;
      }

      if (totalAffected > 0 && this.enableCache && this.cacheService) {
        await this.invalidateCache();
      }

      this.logger.log(`Bulk updated ${totalAffected} ${this.repositoryName} entities`);
      return totalAffected;
    } catch (error) {
      this.logger.error(`Error bulk updating ${this.repositoryName}`, error);
      throw error;
    }
  }

  /**
   * Search entities with text search
   */
  async search(
    searchTerm: string,
    searchFields: string[],
    options: RepositoryQueryOptions & { page?: number; limit?: number } = {},
  ): Promise<{ data: T[]; total: number; pages: number }> {
    try {
      const where: any = {
        ...options.where,
        [Op.or]: searchFields.map((field) => ({
          [field]: { [Op.iLike]: `%${searchTerm}%` },
        })),
      };

      if (options.page && options.limit) {
        return this.findWithPagination({ ...options, where });
      } else {
        const data = await this.findAll({ ...options, where });
        return { data, total: data.length, pages: 1 };
      }
    } catch (error) {
      this.logger.error(`Error searching ${this.repositoryName}`, error);
      throw error;
    }
  }

  /**
   * Invalidate cache for this repository
   */
  protected async invalidateCache(): Promise<void> {
    if (this.cacheService) {
      try {
        // Invalidate all cache keys for this repository
        const pattern = `repo_${this.repositoryName}_*`;
        await this.cacheService.invalidatePattern(pattern);
        this.logger.log(`Invalidated cache for ${this.repositoryName}`);
      } catch (error) {
        this.logger.warn(`Failed to invalidate cache for ${this.repositoryName}`, error);
      }
    }
  }

  /**
   * Get repository statistics
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    recent: number; // Last 30 days
  }> {
    try {
      const total = await this.count();
      const active = await this.count({ where: { isActive: true } });
      const inactive = await this.count({ where: { isActive: false } });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recent = await this.count({
        where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
      });

      return { total, active, inactive, recent };
    } catch (error) {
      this.logger.error(`Error getting stats for ${this.repositoryName}`, error);
      throw error;
    }
  }
}
