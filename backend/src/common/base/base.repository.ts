import { Repository, SelectQueryBuilder, ObjectLiteral, FindOptionsWhere } from 'typeorm';
import { BaseService } from './base.service';
import { NotFoundException } from '@nestjs/common';

/**
 * Base repository class that provides common database operations and patterns.
 * Eliminates duplication in repository implementations.
 */
export abstract class BaseRepository<T extends ObjectLiteral> extends BaseService {
  constructor(
    protected readonly repository: Repository<T>,
    context?: string,
  ) {
    super(context);
  }

  /**
   * Find entity by ID with error handling and logging
   */
  async findById(id: string | number): Promise<T | null> {
    return this.executeWithLogging(`find entity by ID: ${id}`, async () => {
      const entity = await this.repository.findOne({ 
        where: { id } as FindOptionsWhere<T> 
      });
      return entity || null;
    });
  }

  /**
   * Find entity by ID or throw error if not found
   */
  async findByIdOrFail(id: string | number): Promise<T> {
    return this.executeWithLogging(`find entity by ID: ${id}`, async () => {
      const entity = await this.repository.findOne({ 
        where: { id } as FindOptionsWhere<T> 
      });
      if (!entity) {
        throw new NotFoundException(`Entity with ID ${id} not found`);
      }
      return entity;
    });
  }

  /**
   * Find all entities with optional query builder modifications
   */
  async findAll(queryModifier?: (qb: SelectQueryBuilder<T>) => void): Promise<T[]> {
    return this.executeWithLogging('find all entities', async () => {
      if (queryModifier) {
        const queryBuilder = this.repository.createQueryBuilder();
        queryModifier(queryBuilder);
        return await queryBuilder.getMany();
      }
      return await this.repository.find();
    });
  }

  /**
   * Find entities with pagination
   */
  async findWithPagination(
    page: number = 1,
    limit: number = 10,
    queryModifier?: (qb: SelectQueryBuilder<T>) => void,
  ): Promise<{ data: T[]; total: number; page: number; totalPages: number }> {
    return this.executeWithLogging('find entities with pagination', async () => {
      const skip = (page - 1) * limit;

      if (queryModifier) {
        const queryBuilder = this.repository.createQueryBuilder();
        queryModifier(queryBuilder);
        const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();
        return {
          data,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        };
      }

      const [data, total] = await this.repository.findAndCount({
        skip,
        take: limit,
      });

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    });
  }

  /**
   * Create and save entity
   */
  async create(entityData: Partial<T>): Promise<T> {
    return this.executeWithLogging('create entity', async () => {
      const entity = this.repository.create(entityData);
      return await this.repository.save(entity);
    });
  }

  /**
   * Update entity by ID
   */
  async updateById(id: string | number, updateData: Partial<T>): Promise<T> {
    return this.executeWithLogging(`update entity by ID: ${id}`, async () => {
      await this.repository.update(id, updateData);
      const updated = await this.findByIdOrFail(id);
      return updated;
    });
  }

  /**
   * Delete entity by ID
   */
  async deleteById(id: string | number): Promise<void> {
    return this.executeWithLogging(`delete entity by ID: ${id}`, async () => {
      const result = await this.repository.delete(id);
      if (!result.affected || result.affected === 0) {
        throw new NotFoundException(`Entity with ID ${id} not found`);
      }
    });
  }

  /**
   * Check if entity exists by ID
   */
  async existsById(id: string | number): Promise<boolean> {
    return this.executeWithLogging(`check entity exists by ID: ${id}`, async () => {
      const count = await this.repository.count({ 
        where: { id } as FindOptionsWhere<T> 
      });
      return count > 0;
    });
  }
}
