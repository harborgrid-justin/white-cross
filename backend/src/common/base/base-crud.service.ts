/**
 * Base CRUD Service - Standardized Create, Read, Update, Delete Operations
 * 
 * Provides common CRUD functionality that eliminates duplicate code patterns
 * across all domain services. Includes validation, error handling, and logging.
 */
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { Model, ModelCtor, FindOptions, WhereOptions, CreateOptions } from 'sequelize';
import { BaseService } from './base.service';

export interface CrudOperationResult<T> {
  success: boolean;
  data?: T;
  message?: string;
  metadata?: Record<string, any>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface FilterParams {
  where?: WhereOptions;
  include?: any[];
  order?: any[];
}

@Injectable()
export abstract class BaseCrudService<T extends Model> extends BaseService {
  protected abstract readonly model: ModelCtor<T>;
  protected readonly defaultLimit = 50;
  protected readonly maxLimit = 1000;

  constructor(context?: string) {
    super(context);
  }

  /**
   * Create a new entity with validation and logging
   */
  protected async createEntity(
    data: Partial<T>,
    options: CreateOptions = {}
  ): Promise<CrudOperationResult<T>> {
    return this.executeWithLogging(
      'create entity',
      async () => {
        this.validateCreateData(data);
        
        const entity = await this.model.create(data as any, options);
        
        this.logInfo(`Entity created: ${entity.constructor.name} ID ${(entity as any).id}`);
        
        return {
          success: true,
          data: entity,
          message: 'Entity created successfully'
        };
      }
    );
  }

  /**
   * Find entity by primary key with validation
   */
  protected async findEntityById(
    id: string,
    options: FindOptions = {}
  ): Promise<CrudOperationResult<T>> {
    return this.executeWithLogging(
      'find entity by ID',
      async () => {
        this.validateUUID(id, 'Entity ID');
        
        const entity = await this.model.findByPk(id, options);
        
        if (!entity) {
          throw new NotFoundException(`${this.model.name} with ID ${id} not found`);
        }
        
        return {
          success: true,
          data: entity
        };
      }
    );
  }

  /**
   * Find entities with pagination and filtering
   */
  protected async findEntities(
    params: PaginationParams & FilterParams = {}
  ): Promise<CrudOperationResult<{ rows: T[]; count: number; pagination: any }>> {
    return this.executeWithLogging(
      'find entities',
      async () => {
        const { page = 1, limit = this.defaultLimit, where, include, order } = params;
        
        const validatedLimit = Math.min(limit, this.maxLimit);
        const offset = (page - 1) * validatedLimit;
        
        const { rows, count } = await this.model.findAndCountAll({
          where,
          include,
          order: order || [['createdAt', 'DESC']],
          limit: validatedLimit,
          offset,
          distinct: true
        });
        
        const totalPages = Math.ceil(count / validatedLimit);
        
        return {
          success: true,
          data: {
            rows,
            count,
            pagination: {
              currentPage: page,
              totalPages,
              totalItems: count,
              itemsPerPage: validatedLimit,
              hasNextPage: page < totalPages,
              hasPreviousPage: page > 1
            }
          }
        };
      }
    );
  }

  /**
   * Update entity by ID with validation
   */
  protected async updateEntityById(
    id: string,
    updates: Partial<T>,
    options: any = {}
  ): Promise<CrudOperationResult<T>> {
    return this.executeWithLogging(
      'update entity',
      async () => {
        this.validateUUID(id, 'Entity ID');
        this.validateUpdateData(updates);
        
        const entity = await this.model.findByPk(id);
        if (!entity) {
          throw new NotFoundException(`${this.model.name} with ID ${id} not found`);
        }
        
        const updatedEntity = await entity.update(updates, options);
        
        this.logInfo(`Entity updated: ${this.model.name} ID ${id}`);
        
        return {
          success: true,
          data: updatedEntity,
          message: 'Entity updated successfully'
        };
      }
    );
  }

  /**
   * Soft delete entity by ID
   */
  protected async deleteEntityById(
    id: string,
    soft: boolean = true
  ): Promise<CrudOperationResult<null>> {
    return this.executeWithLogging(
      'delete entity',
      async () => {
        this.validateUUID(id, 'Entity ID');
        
        const entity = await this.model.findByPk(id);
        if (!entity) {
          throw new NotFoundException(`${this.model.name} with ID ${id} not found`);
        }
        
        if (soft && 'deletedAt' in entity) {
          await entity.update({ deletedAt: new Date() } as any);
        } else {
          await entity.destroy();
        }
        
        this.logInfo(`Entity ${soft ? 'soft deleted' : 'permanently deleted'}: ${this.model.name} ID ${id}`);
        
        return {
          success: true,
          data: null,
          message: `Entity ${soft ? 'soft deleted' : 'permanently deleted'} successfully`
        };
      }
    );
  }

  /**
   * Batch operations with transaction support
   */
  protected async batchCreateEntities(
    dataArray: Partial<T>[],
    options: CreateOptions = {}
  ): Promise<CrudOperationResult<T[]>> {
    return this.executeWithLogging(
      'batch create entities',
      async () => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          throw new BadRequestException('Data array cannot be empty');
        }
        
        // Validate all entries
        dataArray.forEach((data, index) => {
          try {
            this.validateCreateData(data);
          } catch (error: any) {
            throw new BadRequestException(`Invalid data at index ${index}: ${error.message}`);
          }
        });
        
        const entities = await this.model.bulkCreate(dataArray as any[], {
          ...options,
          validate: true,
          returning: true
        });
        
        this.logInfo(`Batch created ${entities.length} ${this.model.name} entities`);
        
        return {
          success: true,
          data: entities,
          message: `${entities.length} entities created successfully`,
          metadata: { count: entities.length }
        };
      }
    );
  }

  /**
   * Count entities with optional filtering
   */
  protected async countEntities(
    where: WhereOptions = {}
  ): Promise<CrudOperationResult<number>> {
    return this.executeWithLogging(
      'count entities',
      async () => {
        const count = await this.model.count({ where });
        
        return {
          success: true,
          data: count,
          metadata: { filter: where }
        };
      }
    );
  }

  /**
   * Check if entity exists
   */
  protected async entityExists(
    id: string
  ): Promise<boolean> {
    this.validateUUID(id, 'Entity ID');
    const count = await this.model.count({ where: { id } as any });
    return count > 0;
  }

  /**
   * Validate create data - override in subclasses
   */
  protected validateCreateData(data: Partial<T>): void {
    if (!data || typeof data !== 'object') {
      throw new BadRequestException('Invalid data provided');
    }
  }

  /**
   * Validate update data - override in subclasses
   */
  protected validateUpdateData(data: Partial<T>): void {
    if (!data || typeof data !== 'object') {
      throw new BadRequestException('Invalid update data provided');
    }
    
    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No update fields provided');
    }
  }
}