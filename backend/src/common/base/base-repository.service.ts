/**
 * Base Repository Service - Database operations with caching and optimization
 *
 * Provides optimized database operations with intelligent caching,
 * query optimization, and transaction management for repository patterns.
 */
import { Injectable, Inject, Optional } from '@nestjs/common';
import { Model, ModelCtor, Transaction, Sequelize, Op } from 'sequelize';
import { BaseService } from './base.service';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string; // Custom cache key
  enabled?: boolean;
}

export interface QueryOptimization {
  enableEagerLoading?: boolean;
  selectFields?: string[];
  maxDepth?: number;
}

export interface RepositoryMetrics {
  queriesExecuted: number;
  cacheHits: number;
  cacheMisses: number;
  averageQueryTime: number;
}

@Injectable()
export abstract class BaseRepositoryService<T extends Model> extends BaseService {
  protected abstract readonly model: ModelCtor<T>;
  protected readonly cache: Map<string, { data: any; expiry: Date }> = new Map();
  protected readonly metrics: RepositoryMetrics = {
    queriesExecuted: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageQueryTime: 0,
  };

  constructor(
    @Optional() @Inject('SEQUELIZE') protected readonly sequelize?: Sequelize,
    context?: string,
  ) {
    super(context);
  }

  /**
   * Execute query with caching and metrics
   */
  protected async executeQuery<R>(
    operation: string,
    queryFn: () => Promise<R>,
    cacheOptions: CacheOptions = {},
  ): Promise<R> {
    const startTime = Date.now();
    const cacheKey = cacheOptions.key || `${this.model.name}:${operation}:${Date.now()}`;

    // Check cache first
    if (cacheOptions.enabled !== false && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached.expiry > new Date()) {
        this.metrics.cacheHits++;
        this.logDebug(`Cache hit for ${operation}`);
        return cached.data as R;
      } else {
        this.cache.delete(cacheKey);
      }
    }

    try {
      // Execute query
      const result = await queryFn();
      const queryTime = Date.now() - startTime;

      // Update metrics
      this.metrics.queriesExecuted++;
      this.metrics.cacheMisses++;
      this.metrics.averageQueryTime =
        (this.metrics.averageQueryTime * (this.metrics.queriesExecuted - 1) + queryTime) /
        this.metrics.queriesExecuted;

      // Cache result if enabled
      if (cacheOptions.enabled !== false && cacheOptions.ttl) {
        const expiry = new Date();
        expiry.setSeconds(expiry.getSeconds() + (cacheOptions.ttl || 300));
        this.cache.set(cacheKey, { data: result, expiry });
      }

      this.logDebug(`Query ${operation} executed in ${queryTime}ms`);
      return result;
    } catch (error) {
      this.logError(`Query ${operation} failed`, error instanceof Error ? error.stack : undefined);
      throw error;
    }
  }

  /**
   * Find with intelligent query optimization
   */
  protected async findWithOptimization(
    options: any = {},
    cacheOptions: CacheOptions = {},
    queryOpt: QueryOptimization = {},
  ): Promise<T[]> {
    return this.executeQuery(
      'findWithOptimization',
      async () => {
        let queryOptions = { ...options };

        // Apply query optimizations
        if (queryOpt.selectFields && queryOpt.selectFields.length > 0) {
          queryOptions.attributes = queryOpt.selectFields;
        }

        if (queryOpt.enableEagerLoading && !queryOptions.include) {
          queryOptions = this.addEagerLoading(queryOptions, queryOpt.maxDepth || 2);
        }

        return await this.model.findAll(queryOptions);
      },
      cacheOptions,
    );
  }

  /**
   * Batch operations with transaction support
   */
  protected async executeBatchOperation<R>(
    operation: string,
    batchFn: (transaction: Transaction) => Promise<R>,
    useTransaction: boolean = true,
  ): Promise<R> {
    return this.executeWithLogging(`batch ${operation}`, async () => {
      if (useTransaction && this.sequelize) {
        return await this.sequelize.transaction(async (transaction) => {
          return await batchFn(transaction);
        });
      } else {
        return await batchFn(null as any);
      }
    });
  }

  /**
   * Bulk upsert with conflict resolution
   */
  protected async bulkUpsert(
    records: Partial<T>[],
    options: any = {},
  ): Promise<{ created: number; updated: number; errors: any[] }> {
    return this.executeBatchOperation('bulkUpsert', async (transaction) => {
      const results = { created: 0, updated: 0, errors: [] as any[] };

      for (const record of records) {
        try {
          const [instance, created] = await this.model.upsert(record as any, {
            ...options,
            transaction,
            returning: true,
          });

          if (created) {
            results.created++;
          } else {
            results.updated++;
          }
        } catch (error: any) {
          results.errors.push({
            record,
            error: error.message,
          });
        }
      }

      this.logInfo(
        `Bulk upsert completed: ${results.created} created, ${results.updated} updated, ${results.errors.length} errors`,
      );

      return results;
    });
  }

  /**
   * Complex queries with pagination and sorting
   */
  protected async findWithComplexFilters(
    filters: Record<string, any>,
    pagination: { page: number; limit: number },
    sorting: { field: string; direction: 'ASC' | 'DESC' }[],
  ): Promise<{ rows: T[]; count: number; metadata: any }> {
    return this.executeQuery(
      'findWithComplexFilters',
      async () => {
        const whereClause = this.buildWhereClause(filters);
        const orderClause = sorting.map((sort) => [sort.field, sort.direction]);
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;

        const { rows, count } = await this.model.findAndCountAll({
          where: whereClause,
          order: orderClause as any,
          limit,
          offset,
          distinct: true,
        });

        return {
          rows,
          count,
          metadata: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: limit,
            appliedFilters: Object.keys(filters),
            sortingFields: sorting.map((s) => s.field),
          },
        };
      },
      {
        enabled: true,
        ttl: 300,
        key: `complex:${JSON.stringify({ filters, pagination, sorting })}`,
      },
    );
  }

  /**
   * Build dynamic WHERE clause from filters
   */
  protected buildWhereClause(filters: Record<string, any>): any {
    const where: any = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }

      // Handle different filter types
      if (typeof value === 'string') {
        // String search with ILIKE for partial matching
        where[key] = { [Op.iLike]: `%${value}%` };
      } else if (Array.isArray(value)) {
        // Array values use IN operator
        where[key] = { [Op.in]: value };
      } else if (typeof value === 'object' && value.from && value.to) {
        // Date range
        where[key] = { [Op.between]: [value.from, value.to] };
      } else {
        // Exact match
        where[key] = value;
      }
    });

    return where;
  }

  /**
   * Add eager loading includes intelligently
   */
  protected addEagerLoading(options: any, maxDepth: number): any {
    // This would be model-specific implementation
    // Override in subclasses to define relationships
    return options;
  }

  /**
   * Clear cache for specific patterns
   */
  protected clearCache(pattern?: string): void {
    if (pattern) {
      const keysToDelete = Array.from(this.cache.keys()).filter((key) => key.includes(pattern));
      keysToDelete.forEach((key) => this.cache.delete(key));
      this.logDebug(`Cleared ${keysToDelete.length} cache entries matching pattern: ${pattern}`);
    } else {
      this.cache.clear();
      this.logDebug('Cleared all cache entries');
    }
  }

  /**
   * Get repository performance metrics
   */
  getMetrics(): RepositoryMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    Object.assign(this.metrics, {
      queriesExecuted: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageQueryTime: 0,
    });
  }
}
