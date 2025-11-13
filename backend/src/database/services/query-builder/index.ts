/**
 * @fileoverview Query Builder Module Barrel Export
 * @module @/database/services/query-builder
 * @description Consolidated exports for all query builder functionality
 * including basic builders, advanced aggregates, unions/subqueries, and optimization
 *
 * @version 1.0.0
 */

// Export all interfaces and types
export * from './interfaces';

// Export basic query building functions
export * from './basic-builders.service';

// Export advanced aggregate functions
export * from './advanced-aggregates.service';

// Export union and subquery functions
export * from './unions-subqueries.service';

// Export optimization and utility functions
export * from './optimization.service';

// Consolidated query builder object for convenience
import { BasicBuilders } from './basic-builders.service';
import { AdvancedAggregates } from './advanced-aggregates.service';
import { UnionsSubqueries } from './unions-subqueries.service';
import { Optimization } from './optimization.service';

/**
 * Unified Query Builder with all functionality
 *
 * @example
 * ```typescript
 * import { QueryBuilder } from '@/database/services/query-builder';
 *
 * // Use basic builders
 * const whereClause = QueryBuilder.Basic.buildWhereClause(filters);
 *
 * // Use advanced aggregates
 * const stats = await QueryBuilder.Aggregates.buildStatisticalAggregate(model, field);
 *
 * // Use unions/subqueries
 * const unionResults = await QueryBuilder.Unions.buildUnionQuery(queries, 'UNION', sequelize);
 *
 * // Use optimization functions
 * const optimized = QueryBuilder.Optimization.buildOptimizedQuery(config);
 * ```
 */
export const QueryBuilder = {
  Basic: BasicBuilders,
  Aggregates: AdvancedAggregates,
  Unions: UnionsSubqueries,
  Optimization: Optimization,
} as const;
