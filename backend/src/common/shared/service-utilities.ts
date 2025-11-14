import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
// TypeORM removed - using generic types for database-agnostic service utilities
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * Generic repository interface for database-agnostic operations
 */
interface GenericRepository<T> {
  find(options?: any): Promise<T[]>;
  findOne(options?: any): Promise<T | null>;
  findOneBy(criteria: any): Promise<T | null>;
  findByIds?(ids: any[]): Promise<T[]>;
  findAndCount(options?: any): Promise<[T[], number]>;
  create(entity: any): T;
  save(entity: T | T[]): Promise<T | T[]>;
  update(criteria: any, partialEntity: any): Promise<any>;
  delete(criteria: any): Promise<any>;
  softDelete?(criteria: any): Promise<any>;
  restore?(criteria: any): Promise<any>;
  createQueryBuilder?(alias?: string): any;
  count(options?: any): Promise<number>;
  manager?: any;
}

/**
 * Service Utilities for NestJS Applications
 * 
 * Provides standardized patterns for service layer implementations to reduce code duplication
 * and ensure consistency across service classes.
 */

/**
 * Standard pagination interface
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Standard pagination result interface
 */
export interface PaginationResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Standard filter options interface
 */
export interface FilterOptions {
  isActive?: boolean;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
  [key: string]: any;
}

/**
 * Standard service options interface
 */
export interface ServiceOptions {
  enableCache?: boolean;
  enableEvents?: boolean;
  enableAudit?: boolean;
  entityName?: string;
}

/**
 * Base service class providing common CRUD operations and utilities
 */
@Injectable()
export abstract class BaseService<TEntity, TCreateDto, TUpdateDto> {
  protected readonly logger: Logger;
  protected readonly entityName: string;
  protected readonly options: ServiceOptions;

  constructor(
    protected readonly repository: GenericRepository<TEntity>,
    protected readonly eventEmitter?: EventEmitter2,
    options: ServiceOptions = {}
  ) {
    this.entityName = options.entityName || this.constructor.name.replace('Service', '');
    this.logger = new Logger(this.constructor.name);
    this.options = {
      enableCache: false,
      enableEvents: true,
      enableAudit: true,
      ...options,
    };
  }

  /**
   * Find all entities with pagination and filtering
   */
  async findAll(options: PaginationOptions & FilterOptions = {}): Promise<PaginationResult<TEntity>> {
    const {
      page = 1,
      limit = 20,
      orderBy = 'createdAt',
      orderDirection = 'DESC',
      ...filters
    } = options;

    try {
      const skip = (page - 1) * limit;
      const findOptions = this.buildFindOptions(filters, orderBy, orderDirection);

      const [data, total] = await this.repository.findAndCount({
        ...findOptions,
        skip,
        take: limit,
      });

      const pages = Math.ceil(total / limit);

      return {
        data,
        meta: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to find ${this.entityName} entities`, error);
      throw error;
    }
  }

  /**
   * Find one entity by ID
   */
  async findOne(id: string, relations: string[] = []): Promise<TEntity> {
    try {
      const entity = await this.repository.findOne({
        where: { id } as any,
        relations,
      });

      if (!entity) {
        throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
      }

      return entity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find ${this.entityName} with ID ${id}`, error);
      throw error;
    }
  }

  /**
   * Find one entity by ID (nullable)
   */
  async findOneOrNull(id: string, relations: string[] = []): Promise<TEntity | null> {
    try {
      return await this.repository.findOne({
        where: { id } as any,
        relations,
      });
    } catch (error) {
      this.logger.error(`Failed to find ${this.entityName} with ID ${id}`, error);
      return null;
    }
  }

  /**
   * Create a new entity
   */
  async create(createDto: TCreateDto, userId?: string): Promise<TEntity> {
    try {
      const entityData = {
        ...createDto,
        ...(userId && { createdBy: userId }),
      } as any;

      const entity = this.repository.create(entityData);
      const savedEntity = await this.repository.save(entity);

      if (this.options.enableEvents && this.eventEmitter) {
        this.eventEmitter.emit(`${this.entityName.toLowerCase()}.created`, {
          entity: savedEntity,
          userId,
        });
      }

      this.logger.log(`${this.entityName} created with ID ${(savedEntity as any).id}`);
      return savedEntity;
    } catch (error) {
      this.logger.error(`Failed to create ${this.entityName}`, error);
      throw error;
    }
  }

  /**
   * Update an existing entity
   */
  async update(id: string, updateDto: TUpdateDto, userId?: string): Promise<TEntity> {
    try {
      const existingEntity = await this.findOne(id);

      const updateData = {
        ...updateDto,
        ...(userId && { updatedBy: userId }),
        updatedAt: new Date(),
      } as any;

      Object.assign(existingEntity, updateData);
      const savedEntity = await this.repository.save(existingEntity);

      if (this.options.enableEvents && this.eventEmitter) {
        this.eventEmitter.emit(`${this.entityName.toLowerCase()}.updated`, {
          entity: savedEntity,
          previousEntity: existingEntity,
          userId,
        });
      }

      this.logger.log(`${this.entityName} updated with ID ${id}`);
      return savedEntity;
    } catch (error) {
      this.logger.error(`Failed to update ${this.entityName} with ID ${id}`, error);
      throw error;
    }
  }

  /**
   * Soft delete an entity
   */
  async remove(id: string, userId?: string): Promise<void> {
    try {
      const entity = await this.findOne(id);

      const result = await this.repository.softDelete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
      }

      if (this.options.enableEvents && this.eventEmitter) {
        this.eventEmitter.emit(`${this.entityName.toLowerCase()}.deleted`, {
          entityId: id,
          entity,
          userId,
        });
      }

      this.logger.log(`${this.entityName} soft deleted with ID ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete ${this.entityName} with ID ${id}`, error);
      throw error;
    }
  }

  /**
   * Hard delete an entity (use with caution)
   */
  async hardRemove(id: string, userId?: string): Promise<void> {
    try {
      const entity = await this.findOne(id);

      const result = await this.repository.delete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
      }

      if (this.options.enableEvents && this.eventEmitter) {
        this.eventEmitter.emit(`${this.entityName.toLowerCase()}.hardDeleted`, {
          entityId: id,
          entity,
          userId,
        });
      }

      this.logger.warn(`${this.entityName} hard deleted with ID ${id}`);
    } catch (error) {
      this.logger.error(`Failed to hard delete ${this.entityName} with ID ${id}`, error);
      throw error;
    }
  }

  /**
   * Bulk create entities
   */
  async bulkCreate(createDtos: TCreateDto[], userId?: string): Promise<TEntity[]> {
    try {
      const entityData = createDtos.map(dto => ({
        ...dto,
        ...(userId && { createdBy: userId }),
      })) as any[];

      const entities = this.repository.create(entityData);
      const savedEntities = await this.repository.save(entities);

      if (this.options.enableEvents && this.eventEmitter) {
        this.eventEmitter.emit(`${this.entityName.toLowerCase()}.bulkCreated`, {
          entities: savedEntities,
          count: savedEntities.length,
          userId,
        });
      }

      this.logger.log(`${savedEntities.length} ${this.entityName} entities created`);
      return savedEntities;
    } catch (error) {
      this.logger.error(`Failed to bulk create ${this.entityName} entities`, error);
      throw error;
    }
  }

  /**
   * Check if entity exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.repository.count({ where: { id } as any });
      return count > 0;
    } catch (error) {
      this.logger.error(`Failed to check existence of ${this.entityName} with ID ${id}`, error);
      return false;
    }
  }

  /**
   * Count entities with optional filters
   */
  async count(filters: FilterOptions = {}): Promise<number> {
    try {
      const findOptions = this.buildFindOptions(filters);
      return await this.repository.count(findOptions);
    } catch (error) {
      this.logger.error(`Failed to count ${this.entityName} entities`, error);
      throw error;
    }
  }

  /**
   * Find entities by IDs (for DataLoader)
   */
  async findByIds(ids: string[]): Promise<TEntity[]> {
    try {
      if (ids.length === 0) return [];

      const entities = this.repository.findByIds
        ? await this.repository.findByIds(ids)
        : await this.repository.find({ where: { id: { $in: ids } } as any });

      // Return entities in the same order as requested IDs
      return ids.map(id => entities.find((entity: any) => entity.id === id)).filter(Boolean) as TEntity[];
    } catch (error) {
      this.logger.error(`Failed to find ${this.entityName} entities by IDs`, error);
      throw error;
    }
  }

  /**
   * Build generic find options from filters
   */
  protected buildFindOptions(
    filters: FilterOptions,
    orderBy?: string,
    orderDirection?: 'ASC' | 'DESC'
  ): any {
    const where: any = {};
    const relations: string[] = [];

    // Handle common filters
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) where.createdAt.gte = filters.fromDate;
      if (filters.toDate) where.createdAt.lte = filters.toDate;
    }

    // Handle search (override in subclasses for entity-specific search)
    if (filters.search) {
      this.applySearchFilter(where, filters.search);
    }

    // Apply custom filters (override in subclasses)
    this.applyCustomFilters(where, filters);

    const findOptions: any = { where };

    if (orderBy && orderDirection) {
      findOptions.order = { [orderBy]: orderDirection } as any;
    }

    if (relations.length > 0) {
      findOptions.relations = relations;
    }

    return findOptions;
  }

  /**
   * Apply search filter (override in subclasses)
   */
  protected applySearchFilter(where: any, search: string): void {
    // Default implementation - override in subclasses
    // Example: where.name = Like(`%${search}%`);
  }

  /**
   * Apply custom filters (override in subclasses)
   */
  protected applyCustomFilters(where: any, filters: FilterOptions): void {
    // Default implementation - override in subclasses
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && !['page', 'limit', 'orderBy', 'orderDirection', 'isActive', 'search', 'fromDate', 'toDate'].includes(key)) {
        where[key] = value;
      }
    });
  }

  /**
   * Get default relations (override in subclasses)
   */
  protected getDefaultRelations(): string[] {
    return [];
  }

  /**
   * Validate create DTO (override in subclasses)
   */
  protected validateCreateDto(createDto: TCreateDto): void {
    // Default implementation - override in subclasses for custom validation
    if (!createDto) {
      throw new BadRequestException('Create data is required');
    }
  }

  /**
   * Validate update DTO (override in subclasses)
   */
  protected validateUpdateDto(updateDto: TUpdateDto): void {
    // Default implementation - override in subclasses for custom validation
    if (!updateDto) {
      throw new BadRequestException('Update data is required');
    }
  }

  /**
   * Execute within database transaction
   */
  async executeInTransaction<T>(fn: (manager: any) => Promise<T>): Promise<T> {
    return await this.repository.manager.transaction(fn);
  }

  /**
   * Get repository for custom queries
   */
  getRepository(): GenericRepository<TEntity> {
    return this.repository;
  }

  /**
   * Get query builder for complex queries
   */
  createQueryBuilder(alias?: string): any {
    return this.repository.createQueryBuilder(alias || this.entityName.toLowerCase());
  }
}

/**
 * Healthcare-specific base service with PHI handling
 */
@Injectable()
export abstract class HealthcareBaseService<TEntity, TCreateDto, TUpdateDto> extends BaseService<TEntity, TCreateDto, TUpdateDto> {
  constructor(
    repository: GenericRepository<TEntity>,
    eventEmitter?: EventEmitter2,
    options: ServiceOptions = {}
  ) {
    super(repository, eventEmitter, {
      enableAudit: true,
      enableEvents: true,
      ...options,
    });
  }

  /**
   * Find entities by student ID with PHI audit logging
   */
  async findByStudentId(studentId: string, userId?: string): Promise<TEntity[]> {
    try {
      // Log PHI access for HIPAA compliance
      this.logger.log(`PHI ACCESS: ${this.entityName} records accessed for student ${studentId}`, {
        userId,
        studentId,
        entityType: this.entityName,
        timestamp: new Date().toISOString(),
      });

      return await this.repository.find({
        where: { studentId } as any,
        order: { createdAt: 'DESC' } as any,
      });
    } catch (error) {
      this.logger.error(`Failed to find ${this.entityName} entities for student ${studentId}`, error);
      throw error;
    }
  }

  /**
   * Create entity with PHI audit logging
   */
  async create(createDto: TCreateDto, userId?: string): Promise<TEntity> {
    this.logger.log(`PHI MODIFICATION: ${this.entityName} created`, {
      userId,
      entityType: this.entityName,
      timestamp: new Date().toISOString(),
    });

    return await super.create(createDto, userId);
  }

  /**
   * Update entity with PHI audit logging
   */
  async update(id: string, updateDto: TUpdateDto, userId?: string): Promise<TEntity> {
    this.logger.log(`PHI MODIFICATION: ${this.entityName} updated`, {
      userId,
      entityId: id,
      entityType: this.entityName,
      timestamp: new Date().toISOString(),
    });

    return await super.update(id, updateDto, userId);
  }

  /**
   * Delete entity with PHI audit logging
   */
  async remove(id: string, userId?: string): Promise<void> {
    this.logger.warn(`PHI MODIFICATION: ${this.entityName} deleted`, {
      userId,
      entityId: id,
      entityType: this.entityName,
      timestamp: new Date().toISOString(),
    });

    return await super.remove(id, userId);
  }
}

/**
 * Service utility functions
 */
export class ServiceUtils {
  /**
   * Standard error handling wrapper
   */
  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    errorContext: string,
    logger: Logger
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      logger.error(`${errorContext}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Validate pagination parameters
   */
  static validatePagination(options: PaginationOptions): void {
    const { page = 1, limit = 20 } = options;

    if (page < 1) {
      throw new BadRequestException('Page must be greater than 0');
    }

    if (limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }
  }

  /**
   * Build search query for multiple fields
   */
  static buildSearchQuery(searchTerm: string, fields: string[]): any {
    if (!searchTerm || fields.length === 0) return {};

    const searchConditions = fields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' }
    }));

    return { $or: searchConditions };
  }

  /**
   * Sanitize sort parameters
   */
  static sanitizeSortParams(
    orderBy: string = 'createdAt',
    orderDirection: string = 'DESC',
    allowedFields: string[] = ['createdAt', 'updatedAt', 'name', 'id']
  ): { orderBy: string; orderDirection: 'ASC' | 'DESC' } {
    const sanitizedOrderBy = allowedFields.includes(orderBy) ? orderBy : 'createdAt';
    const sanitizedDirection = ['ASC', 'DESC'].includes(orderDirection.toUpperCase()) 
      ? orderDirection.toUpperCase() as 'ASC' | 'DESC'
      : 'DESC';

    return {
      orderBy: sanitizedOrderBy,
      orderDirection: sanitizedDirection,
    };
  }
}

/**
 * Export all utilities
 */
export {
  PaginationOptions,
  PaginationResult,
  FilterOptions,
  ServiceOptions,
  BaseService,
  HealthcareBaseService,
  ServiceUtils,
};
