/**
 * Base Repository Implementation
 * Provides common functionality for all repositories
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { IRepository } from '../interfaces/IRepository';
import { ExecutionContext } from '../../types/ExecutionContext';
import { QueryOptions, QueryCriteria, PaginatedResult, createPaginationMetadata } from '../../types/QueryTypes';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

/**
 * Repository error for domain-specific errors
 */
export class RepositoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}

/**
 * Abstract base repository implementation
 */
export abstract class BaseRepository<T, CreateDTO, UpdateDTO>
  implements IRepository<T, CreateDTO, UpdateDTO>
{
  protected prisma: Prisma.TransactionClient | PrismaClient;
  protected auditLogger: IAuditLogger;
  protected cacheManager: ICacheManager;
  protected entityName: string;

  constructor(
    prisma: Prisma.TransactionClient | PrismaClient,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager,
    entityName: string
  ) {
    this.prisma = prisma;
    this.auditLogger = auditLogger;
    this.cacheManager = cacheManager;
    this.entityName = entityName;
  }

  /**
   * Get Prisma delegate for this entity
   * Must be implemented by concrete repositories
   */
  protected abstract getDelegate(): any;

  /**
   * Map database result to entity
   * Can be overridden for custom mapping logic
   */
  protected mapToEntity(data: any): T {
    return data as T;
  }

  /**
   * Build include clause for relations
   * Can be overridden for custom includes
   */
  protected buildInclude(options?: QueryOptions): any {
    return options?.include || undefined;
  }

  /**
   * Build select clause for field selection
   */
  protected buildSelect(options?: QueryOptions): any {
    return options?.select || undefined;
  }

  /**
   * Find entity by ID
   */
  async findById(id: string, options?: QueryOptions): Promise<T | null> {
    try {
      // Check cache first
      if (options?.cacheKey) {
        const cached = await this.cacheManager.get<T>(options.cacheKey);
        if (cached) {
          logger.debug(`Cache hit for ${this.entityName}:${id}`);
          return cached;
        }
      }

      const result = await this.getDelegate().findUnique({
        where: { id },
        include: this.buildInclude(options),
        select: this.buildSelect(options)
      });

      if (!result) {
        return null;
      }

      const entity = this.mapToEntity(result);

      // Cache result
      if (options?.cacheKey && entity) {
        await this.cacheManager.set(options.cacheKey, entity, options.cacheTTL || 300);
      }

      return entity;
    } catch (error) {
      logger.error(`Error finding ${this.entityName} by ID:`, error);
      throw new RepositoryError(
        `Failed to find ${this.entityName}`,
        'FIND_ERROR',
        500
      );
    }
  }

  /**
   * Find multiple entities
   */
  async findMany(
    criteria: QueryCriteria<T>,
    options?: QueryOptions
  ): Promise<PaginatedResult<T>> {
    try {
      const skip = criteria.pagination?.skip || 0;
      const take = criteria.pagination?.limit || 20;

      const [data, total] = await Promise.all([
        this.getDelegate().findMany({
          where: criteria.where,
          orderBy: criteria.orderBy || options?.orderBy,
          skip,
          take,
          include: this.buildInclude(options),
          select: this.buildSelect(options)
        }),
        this.getDelegate().count({
          where: criteria.where
        })
      ]);

      const entities = data.map((item: any) => this.mapToEntity(item));
      const page = criteria.pagination?.page || Math.floor(skip / take) + 1;

      return {
        data: entities,
        pagination: createPaginationMetadata(page, take, total)
      };
    } catch (error) {
      logger.error(`Error finding ${this.entityName} records:`, error);
      throw new RepositoryError(
        `Failed to find ${this.entityName} records`,
        'FIND_MANY_ERROR',
        500
      );
    }
  }

  /**
   * Create new entity
   */
  async create(data: CreateDTO, context: ExecutionContext): Promise<T> {
    try {
      // Validate before creation
      await this.validateCreate(data);

      const result = await this.getDelegate().create({
        data,
        include: this.buildInclude()
      });

      const entity = this.mapToEntity(result);

      // Audit log
      await this.auditLogger.logCreate(
        this.entityName,
        result.id,
        context,
        this.sanitizeForAudit(data)
      );

      // Invalidate related caches
      await this.invalidateCaches(result);

      logger.info(`Created ${this.entityName}:${result.id} by user ${context.userId}`);

      return entity;
    } catch (error) {
      logger.error(`Error creating ${this.entityName}:`, error);
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw new RepositoryError(
        `Failed to create ${this.entityName}`,
        'CREATE_ERROR',
        500
      );
    }
  }

  /**
   * Update existing entity
   */
  async update(id: string, data: UpdateDTO, context: ExecutionContext): Promise<T> {
    try {
      // Get existing record for audit trail
      const existing = await this.getDelegate().findUnique({
        where: { id }
      });

      if (!existing) {
        throw new RepositoryError(`${this.entityName} not found`, 'NOT_FOUND', 404);
      }

      // Validate before update
      await this.validateUpdate(id, data);

      const result = await this.getDelegate().update({
        where: { id },
        data,
        include: this.buildInclude()
      });

      const entity = this.mapToEntity(result);

      // Audit log with changes
      const changes = this.calculateChanges(existing, result);
      if (Object.keys(changes).length > 0) {
        await this.auditLogger.logUpdate(this.entityName, id, context, changes);
      }

      // Invalidate related caches
      await this.invalidateCaches(result);

      logger.info(`Updated ${this.entityName}:${id} by user ${context.userId}`);

      return entity;
    } catch (error) {
      logger.error(`Error updating ${this.entityName}:`, error);
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw new RepositoryError(
        `Failed to update ${this.entityName}`,
        'UPDATE_ERROR',
        500
      );
    }
  }

  /**
   * Delete entity
   */
  async delete(id: string, context: ExecutionContext): Promise<void> {
    try {
      const existing = await this.getDelegate().findUnique({
        where: { id }
      });

      if (!existing) {
        throw new RepositoryError(`${this.entityName} not found`, 'NOT_FOUND', 404);
      }

      await this.getDelegate().delete({
        where: { id }
      });

      // Audit log
      await this.auditLogger.logDelete(
        this.entityName,
        id,
        context,
        this.sanitizeForAudit(existing)
      );

      // Invalidate related caches
      await this.invalidateCaches(existing);

      logger.info(`Deleted ${this.entityName}:${id} by user ${context.userId}`);
    } catch (error) {
      logger.error(`Error deleting ${this.entityName}:`, error);
      if (error instanceof RepositoryError) {
        throw error;
      }
      throw new RepositoryError(
        `Failed to delete ${this.entityName}`,
        'DELETE_ERROR',
        500
      );
    }
  }

  /**
   * Check if entity exists
   */
  async exists(criteria: Partial<T>): Promise<boolean> {
    try {
      const count = await this.getDelegate().count({
        where: criteria,
        take: 1
      });
      return count > 0;
    } catch (error) {
      logger.error(`Error checking ${this.entityName} existence:`, error);
      return false;
    }
  }

  /**
   * Validate data before creation
   * Can be overridden for custom validation
   */
  protected async validateCreate(data: CreateDTO): Promise<void> {
    // Default: no validation
    // Override in concrete repositories for specific validation
  }

  /**
   * Validate data before update
   * Can be overridden for custom validation
   */
  protected async validateUpdate(id: string, data: UpdateDTO): Promise<void> {
    // Default: no validation
    // Override in concrete repositories for specific validation
  }

  /**
   * Invalidate related caches
   * Must be implemented by concrete repositories
   */
  protected abstract invalidateCaches(entity: any): Promise<void>;

  /**
   * Sanitize data for audit logging
   * Removes sensitive fields that shouldn't be logged
   */
  protected abstract sanitizeForAudit(data: any): any;

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
   * Execute operation with error handling
   */
  protected async executeWithErrorHandling<R>(
    operation: () => Promise<R>,
    errorMessage: string
  ): Promise<R> {
    try {
      return await operation();
    } catch (error) {
      logger.error(errorMessage, error);
      throw new RepositoryError(errorMessage, 'OPERATION_ERROR', 500);
    }
  }
}
