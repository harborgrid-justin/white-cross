/**
 * @fileoverview Advanced Aggregate Query Builder Service
 * @module @/database/services/query-builder/advanced-aggregates
 * @description Specialized service for complex aggregation queries including
 * window functions, CTEs, grouped aggregates, and statistical functions
 *
 * @version 1.0.0
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^10.x
 */

import { Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import {
  Model,
  ModelCtor,
  WhereOptions,
  Sequelize,
  OrderItem,
  Transaction,
  literal,
  fn,
  col,
  Attributes,
} from 'sequelize';

/**
 * Aggregate result with statistical metadata
 */
export interface AggregateResult {
  value: number | null;
  count: number;
  min?: number;
  max?: number;
  avg?: number;
  sum?: number;
  stddev?: number;
  variance?: number;
}

/**
 * Window function configuration
 */
export interface WindowFunctionConfig {
  function: 'ROW_NUMBER' | 'RANK' | 'DENSE_RANK' | 'LAG' | 'LEAD' | 'FIRST_VALUE' | 'LAST_VALUE';
  partitionBy?: string[];
  orderBy: OrderItem[];
  alias: string;
}

/**
 * Build aggregate query (COUNT, SUM, AVG, MIN, MAX)
 *
 * @param model - Model to aggregate
 * @param aggregateType - Type of aggregation
 * @param field - Field to aggregate
 * @param where - Where conditions
 * @param groupBy - Group by fields
 * @param transaction - Optional transaction
 * @returns Aggregate result
 */
export async function buildAggregateQuery<M extends Model>(
  model: ModelCtor<M>,
  aggregateType: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX',
  field?: string,
  where?: WhereOptions<any>,
  groupBy?: string[],
  transaction?: Transaction
): Promise<any> {
  const logger = new Logger('AdvancedAggregates::buildAggregateQuery');

  try {
    const options: any = {
      where,
      transaction,
      raw: true,
    };

    if (groupBy) {
      options.group = groupBy;
      options.attributes = [
        ...groupBy,
        [fn(aggregateType, field ? col(field) : col('*')), 'aggregate']
      ];

      return await model.findAll(options);
    }

    // Single aggregate value
    const aggregateFn = fn(aggregateType, field ? col(field) : col('*'));

    switch (aggregateType) {
      case 'COUNT':
        return await model.count({ where, transaction } as any);

      case 'SUM':
        return await model.sum(field!, { where, transaction } as any);

      case 'MIN':
        return await model.min(field!, { where, transaction } as any);

      case 'MAX':
        return await model.max(field!, { where, transaction } as any);

      case 'AVG':
        const result = await model.findOne({
          attributes: [[fn('AVG', col(field!)), 'average']],
          where,
          transaction,
          raw: true,
        } as any);
        return result ? (result as any).average : null;

      default:
        throw new BadRequestException(`Unknown aggregate type: ${aggregateType}`);
    }
  } catch (error) {
    logger.error(`Aggregate query failed for ${model.name}`, error);
    throw new InternalServerErrorException(`Aggregate query failed for ${model.name}`);
  }
}

/**
 * Build grouped aggregate query
 *
 * @param model - Model to query
 * @param groupBy - Fields to group by
 * @param aggregates - Aggregations to perform
 * @param where - Where conditions
 * @param having - Having conditions
 * @param transaction - Optional transaction
 * @returns Grouped results
 */
export async function buildGroupedAggregate<M extends Model>(
  model: ModelCtor<M>,
  groupBy: string[],
  aggregates: Array<{
    type: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';
    field?: string;
    alias: string;
  }>,
  where?: WhereOptions<any>,
  having?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AdvancedAggregates::buildGroupedAggregate');

  try {
    const attributes: any[] = [...groupBy];

    aggregates.forEach(agg => {
      const aggregateFn = fn(
        agg.type,
        agg.field ? col(agg.field) : col('*')
      );
      attributes.push([aggregateFn, agg.alias]);
    });

    const results = await model.findAll({
      attributes,
      where,
      group: groupBy,
      having,
      transaction,
      raw: true,
    } as any);

    logger.log(`Grouped aggregate query executed for ${model.name}: ${results.length} groups`);
    return results;
  } catch (error) {
    logger.error(`Grouped aggregate query failed for ${model.name}`, error);
    throw new InternalServerErrorException(`Grouped aggregate query failed for ${model.name}`);
  }
}

/**
 * Build window function query
 *
 * @param model - Model to query
 * @param windowFunction - Window function configuration
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Query results with window function
 */
export async function buildWindowFunctionQuery<M extends Model>(
  model: ModelCtor<M>,
  windowFunction: WindowFunctionConfig,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AdvancedAggregates::buildWindowFunctionQuery');

  try {
    const partitionClause = windowFunction.partitionBy
      ? `PARTITION BY ${windowFunction.partitionBy.map(f => `"${f}"`).join(', ')}`
      : '';

    const orderClause = windowFunction.orderBy
      .map(order => {
        if (Array.isArray(order)) {
          return `"${order[0]}" ${order[1] || 'ASC'}`;
        }
        return `"${order}" ASC`;
      })
      .join(', ');

    const windowFn = literal(`${windowFunction.function}() OVER (${partitionClause} ORDER BY ${orderClause})`);

    const results = await model.findAll({
      attributes: {
        include: [[windowFn, windowFunction.alias]]
      },
      where,
      transaction,
      raw: true,
    } as any);

    logger.log(`Window function query executed for ${model.name}: ${results.length} records`);
    return results;
  } catch (error) {
    logger.error(`Window function query failed for ${model.name}`, error);
    throw new InternalServerErrorException(`Window function query failed for ${model.name}`);
  }
}

/**
 * Build statistical aggregate query with comprehensive metrics
 *
 * @param model - Model to query
 * @param field - Numeric field for statistics
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Statistical aggregate result
 */
export async function buildStatisticalAggregate<M extends Model>(
  model: ModelCtor<M>,
  field: string,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<AggregateResult> {
  const logger = new Logger('AdvancedAggregates::buildStatisticalAggregate');

  try {
    const result = await model.findOne({
      attributes: [
        [fn('COUNT', col(field)), 'count'],
        [fn('SUM', col(field)), 'sum'],
        [fn('AVG', col(field)), 'avg'],
        [fn('MIN', col(field)), 'min'],
        [fn('MAX', col(field)), 'max'],
        [fn('STDDEV', col(field)), 'stddev'],
        [fn('VAR_SAMP', col(field)), 'variance'],
      ],
      where,
      transaction,
      raw: true,
    } as any);

    const stats = result as any;

    const aggregateResult: AggregateResult = {
      value: parseFloat(stats.sum) || null,
      count: parseInt(stats.count) || 0,
      min: parseFloat(stats.min) || undefined,
      max: parseFloat(stats.max) || undefined,
      avg: parseFloat(stats.avg) || undefined,
      sum: parseFloat(stats.sum) || undefined,
      stddev: parseFloat(stats.stddev) || undefined,
      variance: parseFloat(stats.variance) || undefined,
    };

    logger.log(`Statistical aggregate computed for ${model.name}.${field}: ${aggregateResult.count} records`);
    return aggregateResult;
  } catch (error) {
    logger.error(`Statistical aggregate failed for ${model.name}.${field}`, error);
    throw new InternalServerErrorException(`Statistical aggregate failed for ${model.name}.${field}`);
  }
}

/**
 * Build percentile query for statistical analysis
 *
 * @param sequelize - Sequelize instance
 * @param model - Model to query
 * @param field - Field to calculate percentiles for
 * @param percentiles - Array of percentiles (0-100)
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Map of percentile to value
 */
export async function buildPercentileQuery<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  field: string,
  percentiles: number[],
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<Map<number, number>> {
  const logger = new Logger('AdvancedAggregates::buildPercentileQuery');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const percentileClauses = percentiles
      .map(p => `PERCENTILE_CONT(${p / 100}) WITHIN GROUP (ORDER BY "${field}") AS p${p}`)
      .join(', ');

    const query = `
      SELECT ${percentileClauses}
      FROM "${tableName}"
      ${whereClause}
    `;

    const [results] = await sequelize.query(query, {
      type: 'SELECT',
      transaction,
    });

    const percentileMap = new Map<number, number>();
    percentiles.forEach(p => {
      percentileMap.set(p, parseFloat((results as any)[`p${p}`]));
    });

    logger.log(`Percentile calculation completed for ${model.name}.${field}: ${percentiles.join(', ')}`);
    return percentileMap;
  } catch (error) {
    logger.error(`Percentile calculation failed for ${model.name}.${field}`, error);
    throw new InternalServerErrorException(`Percentile calculation failed for ${model.name}.${field}`);
  }
}

/**
 * Build rolling aggregate query with window functions
 *
 * @param model - Model to query
 * @param field - Field to aggregate
 * @param aggregateType - Type of rolling aggregate
 * @param windowSize - Number of rows in window
 * @param orderBy - Order for window
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Rolling aggregate results
 */
export async function buildRollingAggregate<M extends Model>(
  model: ModelCtor<M>,
  field: string,
  aggregateType: 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT',
  windowSize: number,
  orderBy: OrderItem[],
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AdvancedAggregates::buildRollingAggregate');

  try {
    const orderClause = orderBy
      .map(order => {
        if (Array.isArray(order)) {
          return `"${order[0]}" ${order[1] || 'ASC'}`;
        }
        return `"${order}" ASC`;
      })
      .join(', ');

    const windowFn = literal(
      `${aggregateType}("${field}") OVER (ORDER BY ${orderClause} ROWS ${windowSize - 1} PRECEDING)`
    );

    const results = await model.findAll({
      attributes: {
        include: [[windowFn, `rolling_${aggregateType.toLowerCase()}`]]
      },
      where,
      order: orderBy,
      transaction,
      raw: true,
    } as any);

    logger.log(`Rolling ${aggregateType} query executed for ${model.name}.${field}: ${results.length} records`);
    return results;
  } catch (error) {
    logger.error(`Rolling aggregate failed for ${model.name}.${field}`, error);
    throw new InternalServerErrorException(`Rolling aggregate failed for ${model.name}.${field}`);
  }
}

/**
 * Build cumulative aggregate query
 *
 * @param model - Model to query
 * @param field - Field to aggregate
 * @param aggregateType - Type of cumulative aggregate
 * @param orderBy - Order for cumulation
 * @param partitionBy - Fields to partition by
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Cumulative aggregate results
 */
export async function buildCumulativeAggregate<M extends Model>(
  model: ModelCtor<M>,
  field: string,
  aggregateType: 'SUM' | 'COUNT',
  orderBy: OrderItem[],
  partitionBy?: string[],
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AdvancedAggregates::buildCumulativeAggregate');

  try {
    const partitionClause = partitionBy
      ? `PARTITION BY ${partitionBy.map(f => `"${f}"`).join(', ')}`
      : '';

    const orderClause = orderBy
      .map(order => {
        if (Array.isArray(order)) {
          return `"${order[0]}" ${order[1] || 'ASC'}`;
        }
        return `"${order}" ASC`;
      })
      .join(', ');

    const windowFn = literal(
      `${aggregateType}("${field}") OVER (${partitionClause} ORDER BY ${orderClause} ROWS UNBOUNDED PRECEDING)`
    );

    const results = await model.findAll({
      attributes: {
        include: [[windowFn, `cumulative_${aggregateType.toLowerCase()}`]]
      },
      where,
      order: orderBy,
      transaction,
      raw: true,
    } as any);

    logger.log(`Cumulative ${aggregateType} query executed for ${model.name}.${field}: ${results.length} records`);
    return results;
  } catch (error) {
    logger.error(`Cumulative aggregate failed for ${model.name}.${field}`, error);
    throw new InternalServerErrorException(`Cumulative aggregate failed for ${model.name}.${field}`);
  }
}

/**
 * Export all advanced aggregate functions
 */
export const AdvancedAggregates = {
  buildAggregateQuery,
  buildGroupedAggregate,
  buildWindowFunctionQuery,
  buildStatisticalAggregate,
  buildPercentileQuery,
  buildRollingAggregate,
  buildCumulativeAggregate,
};
