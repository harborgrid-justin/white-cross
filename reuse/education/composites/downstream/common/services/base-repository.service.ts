/**
 * Base Repository Service
 *
 * Abstract base class for repository pattern implementation.
 */

import { Injectable, Logger, Inject } from '@nestjs/common';
import { Sequelize, Model, Transaction, ModelCtor } from 'sequelize';
import { DATABASE_CONNECTION } from '../tokens/database.tokens';
import {
  IBaseRepository,
  PaginationDto,
  PaginatedResponse,
  QueryOptions
} from '../interfaces/repository.interface';

/**
 * Abstract base repository with common CRUD operations
 */
@Injectable()
export abstract class BaseRepository<
  T extends Model,
  CreateDto,
  UpdateDto
> implements IBaseRepository<T, CreateDto, UpdateDto> {

  protected readonly logger: Logger;

  constructor(
    @Inject(DATABASE_CONNECTION) protected readonly sequelize: Sequelize,
    protected readonly model: ModelCtor<T>,
    loggerContext: string
  ) {
    this.logger = new Logger(loggerContext);
  }

  /**
   * Find entity by ID
   */
  async findById(id: string, transaction?: Transaction): Promise<T | null> {
    try {
      return await this.model.findByPk(id, { transaction });
    } catch (error) {
      this.logger.error(`Failed to find entity by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find all entities with pagination
   */
  async findAll(
    pagination: PaginationDto,
    transaction?: Transaction
  ): Promise<PaginatedResponse<T>> {
    try {
      const { rows, count } = await this.model.findAndCountAll({
        limit: pagination.limit,
        offset: pagination.offset,
        transaction
      });

      return {
        data: rows,
        total: count,
        page: pagination.page,
        pageSize: pagination.limit,
        totalPages: Math.ceil(count / pagination.limit)
      };
    } catch (error) {
      this.logger.error('Failed to find all entities:', error);
      throw error;
    }
  }

  /**
   * Create new entity
   */
  async create(data: CreateDto, transaction?: Transaction): Promise<T> {
    try {
      return await this.model.create(data as any, { transaction });
    } catch (error) {
      this.logger.error('Failed to create entity:', error);
      throw error;
    }
  }

  /**
   * Update entity
   */
  async update(
    id: string,
    data: UpdateDto,
    transaction?: Transaction
  ): Promise<T> {
    try {
      const entity = await this.findById(id, transaction);
      if (!entity) {
        throw new Error(`Entity with ID ${id} not found`);
      }

      await entity.update(data as any, { transaction });
      return entity;
    } catch (error) {
      this.logger.error(`Failed to update entity ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete entity
   */
  async delete(id: string, transaction?: Transaction): Promise<boolean> {
    try {
      const result = await this.model.destroy({
        where: { id } as any,
        transaction
      });
      return result > 0;
    } catch (error) {
      this.logger.error(`Failed to delete entity ${id}:`, error);
      throw error;
    }
  }

  /**
   * Check if entity exists
   */
  async exists(id: string, transaction?: Transaction): Promise<boolean> {
    try {
      const count = await this.model.count({
        where: { id } as any,
        transaction
      });
      return count > 0;
    } catch (error) {
      this.logger.error(`Failed to check existence of entity ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find one entity with options
   */
  async findOne(options: QueryOptions): Promise<T | null> {
    try {
      return await this.model.findOne(options);
    } catch (error) {
      this.logger.error('Failed to find one entity:', error);
      throw error;
    }
  }

  /**
   * Find multiple entities with options
   */
  async findMany(options: QueryOptions): Promise<T[]> {
    try {
      return await this.model.findAll(options);
    } catch (error) {
      this.logger.error('Failed to find entities:', error);
      throw error;
    }
  }

  /**
   * Count entities
   */
  async count(where?: any, transaction?: Transaction): Promise<number> {
    try {
      return await this.model.count({ where, transaction });
    } catch (error) {
      this.logger.error('Failed to count entities:', error);
      throw error;
    }
  }

  /**
   * Bulk create entities
   */
  async bulkCreate(data: CreateDto[], transaction?: Transaction): Promise<T[]> {
    try {
      return await this.model.bulkCreate(data as any[], { transaction });
    } catch (error) {
      this.logger.error('Failed to bulk create entities:', error);
      throw error;
    }
  }

  /**
   * Execute raw query
   */
  async executeRawQuery<R = any>(
    query: string,
    replacements?: any,
    transaction?: Transaction
  ): Promise<R> {
    try {
      const [results] = await this.sequelize.query(query, {
        replacements,
        transaction
      });
      return results as R;
    } catch (error) {
      this.logger.error('Failed to execute raw query:', error);
      throw error;
    }
  }
}
