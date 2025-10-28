/**
 * Base Repository Implementation for Sequelize
 * Provides enterprise-grade data access abstraction with NestJS integration
 *
 * Features:
 * - Transaction support
 * - Audit logging for HIPAA compliance
 * - Cache management with Redis
 * - Query optimization
 * - Soft delete support
 * - Error handling with custom errors
 * - Type-safe operations
 */

import { Logger } from '@nestjs/common';
import {
  Model,
  ModelStatic,
  Transaction,
  FindOptions,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  WhereOptions,
  Attributes,
  CreationAttributes,
  Op
} from 'sequelize';
import { IRepository, RepositoryError } from '../interfaces/repository.interface';
import { ExecutionContext, QueryOptions, QueryCriteria, PaginatedResult, createPaginationMetadata, calculateSkip } from '../../types';
import { IAuditLogger, sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager, CacheKeyBuilder } from '../../interfaces/cache/cache-manager.interface';
import { getCacheTTL } from '../../types/database.enums';

/**
 * Abstract base repository for Sequelize models
 * Implements common CRUD operations with enterprise patterns
 */
export abstract class BaseRepository<
  TModel extends Model & { id: string },
  TAttributes extends { id: string } = Attributes<TModel>,
  TCreationAttributes = CreationAttributes<TModel>
> implements IRepository<TAttributes, TCreationAttributes, Partial<TAttributes>> {

  protected readonly logger: Logger;
  protected readonly model: ModelStatic<TModel>;
  protected readonly auditLogger: IAuditLogger;
  protected readonly cacheManager: ICacheManager;
  protected readonly entityName: string;
  protected readonly cacheKeyBuilder: CacheKeyBuilder;

  constructor(
    model: ModelStatic<TModel>,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager,
    entityName: string
  ) {
    this.model = model;
    this.auditLogger = auditLogger;
    this.cacheManager = cacheManager;
    this.entityName = entityName;
    this.cacheKeyBuilder = new CacheKeyBuilder();
    this.logger = new Logger(`${entityName}Repository`);
  }

  /**
   * Find entity by ID
   */
  async findById(
    id: string,
    options?: QueryOptions
  ): Promise<TAttributes | null> {
    try {
      // Check cache first if enabled
      const cacheKey = this.cacheKeyBuilder.entity(this.entityName, id);
      if (options?.cacheKey || this.shouldCache()) {
        const cached = await this.cacheManager.get<TAttributes>(cacheKey);
        if (cached) {
          this.logger.debug(`Cache hit for ${this.entityName}:${id}`);
          return cached;
        }
      }

      const findOptions = this.buildFindOptions(options);
      const result = await this.model.findByPk(id, findOptions);

      if (!result) {
        return null;
      }

      const entity = this.mapToEntity(result);

      // Cache result if enabled
      if (this.shouldCache()) {
        const ttl = options?.cacheTTL || getCacheTTL(this.entityName);
        await this.cacheManager.set(cacheKey, entity, ttl);
      }

      return entity;
    } catch (error) {
      this.logger.error(`Error finding ${this.entityName} by ID:`, error);
      throw new RepositoryError(
        `Failed to find ${this.entityName}`,
        'FIND_ERROR',
        500,
        { id, error: (error as Error).message }
      );
    }
  }

  /**
   * Find multiple entities matching criteria
   */
  async findMany(
    criteria: QueryCriteria<TAttributes>,
    options?: QueryOptions
  ): Promise<PaginatedResult<TAttributes>> {
    try {
      const page = criteria.pagination?.page || 1;
      const limit = criteria.pagination?.limit || 20;
      const offset = calculateSkip(page, limit);

      const whereClause = this.buildWhereClause(criteria.where);
      const orderClause = this.buildOrderClause(criteria.orderBy || options?.orderBy);

      const findOptions: FindOptions = {
        where: whereClause,
        order: orderClause,
        limit,
        offset,
        ...this.buildFindOptions(options)
      };

      const { rows, count } = await this.model.findAndCountAll(findOptions);

      const entities = rows.map((row) => this.mapToEntity(row));

      return {
        data: entities,
        pagination: createPaginationMetadata(page, limit, count)
      };
    } catch (error) {
      this.logger.error(`Error finding ${this.entityName} records:`, error);
      throw new RepositoryError(
        `Failed to find ${this.entityName} records`,
        'FIND_MANY_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  /**
   * Create new entity
   */
  async create(
    data: TCreationAttributes,
    context: ExecutionContext
  ): Promise<TAttributes> {
    let transaction: Transaction | undefined;

    try {
      // Validate before creation
      await this.validateCreate(data);

      // Start transaction if not provided
      transaction = await this.model.sequelize!.transaction();

      const createOptions: CreateOptions = {
        transaction
      };

      const result = await this.model.create(data as any, createOptions);

      // Audit log
      await this.auditLogger.logCreate(
        this.entityName,
        result.id as string,
        context,
        this.sanitizeForAudit(result.get())
      );

      // Invalidate related caches
      await this.invalidateCaches(result);

      await transaction.commit();

      this.logger.log(`Created ${this.entityName}:${result.id} by user ${context.userId}`);

      return this.mapToEntity(result);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error(`Error creating ${this.entityName}:`, error);

      if (error instanceof RepositoryError) {
        throw error;
      }

      throw new RepositoryError(
        `Failed to create ${this.entityName}`,
        'CREATE_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  /**
   * Update existing entity
   */
  async update(
    id: string,
    data: Partial<TAttributes>,
    context: ExecutionContext
  ): Promise<TAttributes> {
    let transaction: Transaction | undefined;

    try {
      // Get existing record for audit trail
      const existing = await this.model.findByPk(id);

      if (!existing) {
        throw new RepositoryError(
          `${this.entityName} not found`,
          'NOT_FOUND',
          404,
          { id }
        );
      }

      // Validate before update
      await this.validateUpdate(id, data);

      // Start transaction
      transaction = await this.model.sequelize!.transaction();

      const updateOptions: UpdateOptions = {
        where: { id } as any,
        transaction,
        returning: true
      };

      await this.model.update(data as any, updateOptions);

      // Fetch updated record
      const updated = await this.model.findByPk(id, { transaction });

      if (!updated) {
        throw new RepositoryError(
          `${this.entityName} not found after update`,
          'UPDATE_ERROR',
          500,
          { id }
        );
      }

      // Calculate changes for audit
      const changes = this.calculateChanges(
        existing.get(),
        updated.get()
      );

      // Audit log with changes
      if (Object.keys(changes).length > 0) {
        await this.auditLogger.logUpdate(
          this.entityName,
          id,
          context,
          changes
        );
      }

      // Invalidate related caches
      await this.invalidateCaches(updated);

      await transaction.commit();

      this.logger.log(`Updated ${this.entityName}:${id} by user ${context.userId}`);

      return this.mapToEntity(updated);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error(`Error updating ${this.entityName}:`, error);

      if (error instanceof RepositoryError) {
        throw error;
      }

      throw new RepositoryError(
        `Failed to update ${this.entityName}`,
        'UPDATE_ERROR',
        500,
        { id, error: (error as Error).message }
      );
    }
  }

  /**
   * Delete entity (hard delete)
   */
  async delete(id: string, context: ExecutionContext): Promise<void> {
    let transaction: Transaction | undefined;

    try {
      const existing = await this.model.findByPk(id);

      if (!existing) {
        throw new RepositoryError(
          `${this.entityName} not found`,
          'NOT_FOUND',
          404,
          { id }
        );
      }

      transaction = await this.model.sequelize!.transaction();

      const destroyOptions: DestroyOptions = {
        where: { id } as any,
        transaction
      };

      await this.model.destroy(destroyOptions);

      // Audit log
      await this.auditLogger.logDelete(
        this.entityName,
        id,
        context,
        this.sanitizeForAudit(existing.get())
      );

      // Invalidate related caches
      await this.invalidateCaches(existing);

      await transaction.commit();

      this.logger.log(`Deleted ${this.entityName}:${id} by user ${context.userId}`);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error(`Error deleting ${this.entityName}:`, error);

      if (error instanceof RepositoryError) {
        throw error;
      }

      throw new RepositoryError(
        `Failed to delete ${this.entityName}`,
        'DELETE_ERROR',
        500,
        { id, error: (error as Error).message }
      );
    }
  }

  /**
   * Check if entity exists matching criteria
   */
  async exists(criteria: Partial<TAttributes>): Promise<boolean> {
    try {
      const count = await this.model.count({
        where: criteria as WhereOptions
      });
      return count > 0;
    } catch (error) {
      this.logger.error(`Error checking ${this.entityName} existence:`, error);
      return false;
    }
  }

  /**
   * Bulk create entities
   */
  async bulkCreate(
    data: TCreationAttributes[],
    context: ExecutionContext
  ): Promise<TAttributes[]> {
    let transaction: Transaction | undefined;

    try {
      transaction = await this.model.sequelize!.transaction();

      const results = await this.model.bulkCreate(data as any[], {
        transaction,
        validate: true,
        returning: true
      });

      // Audit log bulk operation
      await this.auditLogger.logBulkOperation(
        'BULK_CREATE',
        this.entityName,
        context,
        { count: results.length }
      );

      await transaction.commit();

      this.logger.log(`Bulk created ${results.length} ${this.entityName} records`);

      return results.map((r) => this.mapToEntity(r));
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error(`Error bulk creating ${this.entityName}:`, error);
      throw new RepositoryError(
        `Failed to bulk create ${this.entityName}`,
        'BULK_CREATE_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  /**
   * Count entities matching criteria
   */
  async count(criteria?: Partial<TAttributes>): Promise<number> {
    try {
      return await this.model.count({
        where: criteria as WhereOptions
      });
    } catch (error) {
      this.logger.error(`Error counting ${this.entityName}:`, error);
      throw new RepositoryError(
        `Failed to count ${this.entityName}`,
        'COUNT_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  // ============ Protected Helper Methods ============

  /**
   * Map database model to entity
   * Override for custom mapping logic
   */
  protected mapToEntity(model: TModel): TAttributes {
    return model.get({ plain: true }) as TAttributes;
  }

  /**
   * Build Sequelize find options from query options
   */
  protected buildFindOptions(options?: QueryOptions): FindOptions {
    const findOptions: FindOptions = {};

    if (options?.include) {
      findOptions.include = this.buildIncludeClause(options.include);
    }

    if (options?.select) {
      findOptions.attributes = this.buildAttributesClause(options.select);
    }

    return findOptions;
  }

  /**
   * Build include clause for relations
   */
  protected buildIncludeClause(include: QueryOptions['include']): any[] {
    if (!include) return [];
    return Object.keys(include).filter((key) => include[key]);
  }

  /**
   * Build attributes clause for field selection
   */
  protected buildAttributesClause(select: QueryOptions['select']): string[] {
    if (!select) return [];
    return Object.keys(select).filter((key) => select[key]);
  }

  /**
   * Build where clause from criteria
   */
  protected buildWhereClause(where: any): WhereOptions {
    if (!where) return {};

    // Handle complex where clauses (AND, OR, NOT)
    if (where.AND || where.OR || where.NOT) {
      const clause: any = {};

      if (where.AND) {
        clause[Op.and] = where.AND;
      }

      if (where.OR) {
        clause[Op.or] = where.OR;
      }

      if (where.NOT) {
        clause[Op.not] = where.NOT;
      }

      return clause;
    }

    return where as WhereOptions;
  }

  /**
   * Build order clause from criteria
   */
  protected buildOrderClause(orderBy: any): any {
    if (!orderBy) return [];

    if (Array.isArray(orderBy)) {
      return orderBy.map((order) => {
        const key = Object.keys(order)[0];
        return [key, order[key].toUpperCase()];
      });
    }

    return Object.entries(orderBy).map(([key, direction]) => [
      key,
      (direction as string).toUpperCase()
    ]);
  }

  /**
   * Calculate changes between before and after states
   */
  protected calculateChanges(
    before: any,
    after: any
  ): Record<string, { before: any; after: any }> {
    const changes: Record<string, { before: any; after: any }> = {};

    for (const key in after) {
      if (
        before[key] !== after[key] &&
        key !== 'updatedAt' &&
        key !== 'createdAt'
      ) {
        changes[key] = {
          before: before[key],
          after: after[key]
        };
      }
    }

    return changes;
  }

  /**
   * Validate data before creation
   * Override for custom validation
   */
  protected async validateCreate(data: TCreationAttributes): Promise<void> {
    // Default: no validation
  }

  /**
   * Validate data before update
   * Override for custom validation
   */
  protected async validateUpdate(id: string, data: Partial<TAttributes>): Promise<void> {
    // Default: no validation
  }

  /**
   * Determine if caching should be enabled for this entity
   */
  protected shouldCache(): boolean {
    return true;
  }

  /**
   * Invalidate related caches
   * Must be implemented by concrete repositories
   */
  protected abstract invalidateCaches(entity: TModel): Promise<void>;

  /**
   * Sanitize data for audit logging
   * Removes sensitive fields that shouldn't be logged
   */
  protected abstract sanitizeForAudit(data: any): any;
}
