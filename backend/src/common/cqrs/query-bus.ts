/**
 * Query Bus Implementation
 *
 * Handles query execution with caching, performance monitoring, and optimized read operations
 * for the White Cross healthcare platform.
 */

import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  IQuery,
  IQueryResult,
  IQueryHandler,
  IQueryBus
} from './interfaces';

@Injectable()
export class QueryBus implements IQueryBus {
  private readonly logger = new Logger(QueryBus.name);
  private readonly handlers = new Map<string, IQueryHandler<any, any>>();
  private readonly cache = new Map<string, { result: any; timestamp: number; ttl: number }>();

  constructor(
    @Inject('CACHE_MANAGER') private readonly cacheManager?: any,
  ) {}

  /**
   * Register a query handler
   */
  registerHandler<TQuery extends IQuery, TResult = any>(
    queryType: string,
    handler: IQueryHandler<TQuery, TResult>
  ): void {
    this.handlers.set(queryType, handler);
    this.logger.log(`Registered query handler for: ${queryType}`);
  }

  /**
   * Execute a query with optional caching
   */
  async execute<TQuery extends IQuery, TResult = any>(
    query: TQuery
  ): Promise<IQueryResult<TResult>> {
    const startTime = Date.now();
    const correlationId = this.generateCorrelationId();

    try {
      this.logger.debug(`Executing query: ${query.type}`, {
        correlationId,
        queryType: query.type
      });

      const handler = this.handlers.get(query.type);
      if (!handler) {
        throw new Error(`No handler registered for query: ${query.type}`);
      }

      // Check cache first if available
      const cacheKey = this.generateCacheKey(query);
      const cachedResult = await this.getCachedResult(cacheKey);

      if (cachedResult) {
        this.logger.debug(`Query result served from cache: ${query.type}`, {
          correlationId,
          cacheKey
        });

        return {
          ...cachedResult,
          correlationId
        };
      }

      // Execute query
      const result = await handler.execute(query);
      const executionTime = Date.now() - startTime;

      // Cache result if successful
      if (result.success && this.shouldCache(query)) {
        await this.setCachedResult(cacheKey, result, this.getCacheTTL(query));
      }

      this.logger.debug(`Query executed successfully: ${query.type}`, {
        correlationId,
        executionTime,
        success: result.success,
        cached: false
      });

      return {
        ...result,
        correlationId
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.logger.error(`Query execution failed: ${query.type}`, {
        correlationId,
        executionTime,
        error: error.message,
        stack: error.stack
      });

      return {
        success: false,
        error: error.message,
        correlationId
      };
    }
  }

  /**
   * Clear cache for specific query types
   */
  async clearCache(queryTypes?: string[]): Promise<void> {
    if (queryTypes) {
      for (const queryType of queryTypes) {
        const pattern = `query:${queryType}:*`;
        // In a real implementation, this would clear Redis cache by pattern
        this.logger.log(`Clearing cache for query type: ${queryType}`);
      }
    } else {
      this.cache.clear();
      this.logger.log('Cleared all query cache');
    }
  }

  /**
   * Get registered query types
   */
  getRegisteredQueries(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Check if a query type is registered
   */
  hasHandler(queryType: string): boolean {
    return this.handlers.has(queryType);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { hits: number; misses: number; hitRate: number } {
    // Placeholder for cache statistics
    return { hits: 0, misses: 0, hitRate: 0 };
  }

  /**
   * Generate cache key for query
   */
  private generateCacheKey(query: IQuery): string {
    return `query:${query.type}:${JSON.stringify(query)}`;
  }

  /**
   * Get cached result if available and not expired
   */
  private async getCachedResult(cacheKey: string): Promise<IQueryResult | null> {
    if (this.cacheManager) {
      try {
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (error) {
        this.logger.warn(`Cache read error for key ${cacheKey}:`, error);
      }
    }

    // Fallback to in-memory cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.result;
    }

    return null;
  }

  /**
   * Cache query result
   */
  private async setCachedResult(
    cacheKey: string,
    result: IQueryResult,
    ttl: number
  ): Promise<void> {
    if (this.cacheManager) {
      try {
        await this.cacheManager.set(cacheKey, JSON.stringify(result), ttl / 1000); // Convert to seconds
      } catch (error) {
        this.logger.warn(`Cache write error for key ${cacheKey}:`, error);
      }
    }

    // Fallback to in-memory cache
    this.cache.set(cacheKey, {
      result,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Determine if query should be cached
   */
  private shouldCache(query: IQuery): boolean {
    // Cache read queries by default, but not write operations
    return !query.type.includes('Create') &&
           !query.type.includes('Update') &&
           !query.type.includes('Delete');
  }

  /**
   * Get cache TTL for query
   */
  private getCacheTTL(query: IQuery): number {
    // Default 5 minutes, customizable per query type
    const ttlMap: Record<string, number> = {
      'GetPatient': 10 * 60 * 1000, // 10 minutes
      'GetMedication': 5 * 60 * 1000,  // 5 minutes
      'GetAppointment': 2 * 60 * 1000, // 2 minutes
    };

    return ttlMap[query.type] || 5 * 60 * 1000; // 5 minutes default
  }

  /**
   * Generate correlation ID for request tracing
   */
  private generateCorrelationId(): string {
    return `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}