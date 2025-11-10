/**
 * @fileoverview Aggregate Analytics Query Operations for Sequelize + NestJS
 * @module reuse/data/composites/aggregate-analytics-queries
 * @description Production-ready analytics operations with complex aggregations,
 * window functions, statistical analysis, time-series operations, and business intelligence queries.
 * Exceeds Informatica capabilities with advanced statistical and analytical functions.
 *
 * @version 1.0.0
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^10.x
 */

import { Logger, InternalServerErrorException } from '@nestjs/common';
import {
  Sequelize,
  Model,
  ModelCtor,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
  QueryTypes,
  Attributes,
  OrderItem,
  literal,
  fn,
  col,
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
 * Time series configuration
 */
export interface TimeSeriesConfig {
  dateField: string;
  interval: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
  aggregateField: string;
  aggregateFunction: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
  startDate: Date;
  endDate: Date;
  fillGaps?: boolean;
}

/**
 * Percentile calculation configuration
 */
export interface PercentileConfig {
  field: string;
  percentiles: number[]; // e.g., [25, 50, 75, 95, 99]
  where?: WhereOptions<any>;
}

/**
 * Cohort analysis configuration
 */
export interface CohortConfig {
  userIdField: string;
  eventDateField: string;
  cohortDateField: string;
  metricField?: string;
  periods: number;
  periodType: 'day' | 'week' | 'month';
}

/**
 * Rolling window configuration
 */
export interface RollingWindowConfig {
  field: string;
  windowSize: number;
  function: 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT';
  orderBy: string;
}

/**
 * Execute basic aggregation query
 *
 * @param model - Sequelize model
 * @param field - Field to aggregate
 * @param aggregateType - Type of aggregation
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Aggregate result with statistics
 *
 * @example
 * ```typescript
 * const result = await executeAggregate(
 *   Order,
 *   'amount',
 *   'SUM',
 *   { status: 'completed', date: { [Op.gte]: startDate } }
 * );
 * console.log(`Total revenue: $${result.value}`);
 * ```
 */
export async function executeAggregate<M extends Model>(
  model: ModelCtor<M>,
  field: string,
  aggregateType: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX',
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<AggregateResult> {
  const logger = new Logger('AggregateAnalytics::executeAggregate');

  try {
    let value: number | null = null;

    switch (aggregateType) {
      case 'COUNT':
        value = await model.count({ where, transaction } as any);
        break;

      case 'SUM':
        value = await model.sum(field, { where, transaction } as any);
        break;

      case 'AVG': {
        const result = await model.findOne({
          attributes: [[fn('AVG', col(field)), 'avg']],
          where,
          transaction,
          raw: true,
        } as any);
        value = result ? parseFloat((result as any).avg) : null;
        break;
      }

      case 'MIN':
        value = await model.min(field, { where, transaction } as any);
        break;

      case 'MAX':
        value = await model.max(field, { where, transaction } as any);
        break;
    }

    const count = await model.count({ where, transaction } as any);

    logger.log(`Aggregate ${aggregateType}(${field}): ${value} (${count} records)`);

    return {
      value,
      count,
    };
  } catch (error) {
    logger.error('Aggregate query failed', error);
    throw new InternalServerErrorException('Aggregate query failed');
  }
}

/**
 * Execute grouped aggregation with multiple metrics
 *
 * @param model - Sequelize model
 * @param groupBy - Fields to group by
 * @param aggregates - Array of aggregate configurations
 * @param where - Where conditions
 * @param having - Having conditions
 * @param orderBy - Order by configuration
 * @param transaction - Optional transaction
 * @returns Array of grouped results
 *
 * @example
 * ```typescript
 * const results = await groupedAggregate(
 *   Sale,
 *   ['region', 'productCategory'],
 *   [
 *     { field: 'amount', function: 'SUM', alias: 'totalRevenue' },
 *     { field: 'id', function: 'COUNT', alias: 'orderCount' },
 *     { field: 'amount', function: 'AVG', alias: 'avgOrderValue' }
 *   ],
 *   { status: 'completed' },
 *   { totalRevenue: { [Op.gt]: 10000 } },
 *   [['totalRevenue', 'DESC']]
 * );
 * ```
 */
export async function groupedAggregate<M extends Model>(
  model: ModelCtor<M>,
  groupBy: string[],
  aggregates: Array<{
    field: string;
    function: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
    alias: string;
  }>,
  where?: WhereOptions<any>,
  having?: WhereOptions<any>,
  orderBy?: OrderItem[],
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::groupedAggregate');

  try {
    const attributes: any[] = [...groupBy];

    aggregates.forEach(agg => {
      const aggregateFn = fn(agg.function, col(agg.field));
      attributes.push([aggregateFn, agg.alias]);
    });

    const results = await model.findAll({
      attributes,
      where,
      group: groupBy,
      having,
      order: orderBy,
      transaction,
      raw: true,
    } as any);

    logger.log(`Grouped aggregate: ${results.length} groups`);
    return results;
  } catch (error) {
    logger.error('Grouped aggregate failed', error);
    throw new InternalServerErrorException('Grouped aggregate failed');
  }
}

/**
 * Calculate percentiles for a numeric field
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param config - Percentile configuration
 * @param transaction - Optional transaction
 * @returns Map of percentile to value
 *
 * @example
 * ```typescript
 * const percentiles = await calculatePercentiles(
 *   sequelize,
 *   Order,
 *   {
 *     field: 'amount',
 *     percentiles: [25, 50, 75, 95, 99],
 *     where: { status: 'completed' }
 *   }
 * );
 * console.log(`Median: ${percentiles.get(50)}`);
 * console.log(`95th percentile: ${percentiles.get(95)}`);
 * ```
 */
export async function calculatePercentiles<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  config: PercentileConfig,
  transaction?: Transaction
): Promise<Map<number, number>> {
  const logger = new Logger('AggregateAnalytics::calculatePercentiles');

  try {
    const tableName = model.tableName;
    const whereClause = config.where
      ? `WHERE ${Object.entries(config.where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const percentileClauses = config.percentiles
      .map(p => `PERCENTILE_CONT(${p / 100}) WITHIN GROUP (ORDER BY "${config.field}") AS p${p}`)
      .join(', ');

    const query = `
      SELECT ${percentileClauses}
      FROM "${tableName}"
      ${whereClause}
    `;

    const [results] = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    const percentileMap = new Map<number, number>();
    config.percentiles.forEach(p => {
      percentileMap.set(p, parseFloat((results as any)[`p${p}`]));
    });

    logger.log(`Calculated percentiles: ${config.percentiles.join(', ')}`);
    return percentileMap;
  } catch (error) {
    logger.error('Percentile calculation failed', error);
    throw new InternalServerErrorException('Percentile calculation failed');
  }
}

/**
 * Calculate standard deviation and variance
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param field - Field to analyze
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Statistical measures
 *
 * @example
 * ```typescript
 * const stats = await calculateStatistics(
 *   sequelize,
 *   ResponseTime,
 *   'duration',
 *   { endpoint: '/api/users' }
 * );
 * console.log(`Mean: ${stats.mean}ms, StdDev: ${stats.stddev}ms`);
 * ```
 */
export async function calculateStatistics<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  field: string,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<{
  count: number;
  mean: number;
  stddev: number;
  variance: number;
  min: number;
  max: number;
}> {
  const logger = new Logger('AggregateAnalytics::calculateStatistics');

  try {
    const result = await model.findOne({
      attributes: [
        [fn('COUNT', col(field)), 'count'],
        [fn('AVG', col(field)), 'mean'],
        [fn('STDDEV', col(field)), 'stddev'],
        [fn('VARIANCE', col(field)), 'variance'],
        [fn('MIN', col(field)), 'min'],
        [fn('MAX', col(field)), 'max'],
      ],
      where,
      transaction,
      raw: true,
    } as any);

    const stats = {
      count: parseInt((result as any).count),
      mean: parseFloat((result as any).mean),
      stddev: parseFloat((result as any).stddev),
      variance: parseFloat((result as any).variance),
      min: parseFloat((result as any).min),
      max: parseFloat((result as any).max),
    };

    logger.log(`Statistics for ${field}: mean=${stats.mean.toFixed(2)}, stddev=${stats.stddev.toFixed(2)}`);
    return stats;
  } catch (error) {
    logger.error('Statistics calculation failed', error);
    throw new InternalServerErrorException('Statistics calculation failed');
  }
}

/**
 * Generate time series data with aggregations
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param config - Time series configuration
 * @param transaction - Optional transaction
 * @returns Time series data points
 *
 * @example
 * ```typescript
 * const timeSeries = await generateTimeSeries(
 *   sequelize,
 *   Order,
 *   {
 *     dateField: 'createdAt',
 *     interval: 'day',
 *     aggregateField: 'amount',
 *     aggregateFunction: 'SUM',
 *     startDate: new Date('2024-01-01'),
 *     endDate: new Date('2024-12-31'),
 *     fillGaps: true
 *   }
 * );
 * ```
 */
export async function generateTimeSeries<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  config: TimeSeriesConfig,
  transaction?: Transaction
): Promise<Array<{ period: string; value: number }>> {
  const logger = new Logger('AggregateAnalytics::generateTimeSeries');

  try {
    const tableName = model.tableName;

    const truncateFunction = {
      hour: "DATE_TRUNC('hour', \"" + config.dateField + '")::date',
      day: "DATE_TRUNC('day', \"" + config.dateField + '")::date',
      week: "DATE_TRUNC('week', \"" + config.dateField + '")::date',
      month: "DATE_TRUNC('month', \"" + config.dateField + '")::date',
      quarter: "DATE_TRUNC('quarter', \"" + config.dateField + '")::date',
      year: "DATE_TRUNC('year', \"" + config.dateField + '")::date',
    }[config.interval];

    const query = `
      SELECT
        ${truncateFunction} AS period,
        ${config.aggregateFunction}("${config.aggregateField}") AS value
      FROM "${tableName}"
      WHERE "${config.dateField}" BETWEEN :startDate AND :endDate
      GROUP BY period
      ORDER BY period
    `;

    const results = await sequelize.query<{ period: string; value: number }>(query, {
      replacements: {
        startDate: config.startDate,
        endDate: config.endDate,
      },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Time series: ${results.length} data points`);
    return results;
  } catch (error) {
    logger.error('Time series generation failed', error);
    throw new InternalServerErrorException('Time series generation failed');
  }
}

/**
 * Calculate moving average
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param config - Rolling window configuration
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Array of values with moving averages
 *
 * @example
 * ```typescript
 * const movingAvg = await calculateMovingAverage(
 *   sequelize,
 *   StockPrice,
 *   {
 *     field: 'price',
 *     windowSize: 7,
 *     function: 'AVG',
 *     orderBy: 'date'
 *   },
 *   { symbol: 'AAPL' }
 * );
 * ```
 */
export async function calculateMovingAverage<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  config: RollingWindowConfig,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateMovingAverage');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const query = `
      SELECT
        *,
        ${config.function}("${config.field}") OVER (
          ORDER BY "${config.orderBy}"
          ROWS BETWEEN ${config.windowSize - 1} PRECEDING AND CURRENT ROW
        ) AS moving_${config.function.toLowerCase()}
      FROM "${tableName}"
      ${whereClause}
      ORDER BY "${config.orderBy}"
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Moving average: ${results.length} data points`);
    return results;
  } catch (error) {
    logger.error('Moving average calculation failed', error);
    throw new InternalServerErrorException('Moving average calculation failed');
  }
}

/**
 * Calculate cumulative sum/running total
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param field - Field to sum
 * @param orderBy - Order by field
 * @param partitionBy - Optional partition field
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Array with cumulative sums
 *
 * @example
 * ```typescript
 * const runningTotal = await calculateCumulativeSum(
 *   sequelize,
 *   Transaction,
 *   'amount',
 *   'date',
 *   'userId',
 *   { year: 2024 }
 * );
 * ```
 */
export async function calculateCumulativeSum<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  field: string,
  orderBy: string,
  partitionBy?: string,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateCumulativeSum');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const partitionClause = partitionBy ? `PARTITION BY "${partitionBy}"` : '';

    const query = `
      SELECT
        *,
        SUM("${field}") OVER (
          ${partitionClause}
          ORDER BY "${orderBy}"
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS cumulative_sum
      FROM "${tableName}"
      ${whereClause}
      ORDER BY ${partitionBy ? `"${partitionBy}", ` : ''}"${orderBy}"
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Cumulative sum: ${results.length} data points`);
    return results;
  } catch (error) {
    logger.error('Cumulative sum calculation failed', error);
    throw new InternalServerErrorException('Cumulative sum calculation failed');
  }
}

/**
 * Perform cohort analysis
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param config - Cohort configuration
 * @param transaction - Optional transaction
 * @returns Cohort analysis results
 *
 * @example
 * ```typescript
 * const cohorts = await cohortAnalysis(
 *   sequelize,
 *   UserEvent,
 *   {
 *     userIdField: 'userId',
 *     eventDateField: 'eventDate',
 *     cohortDateField: 'userCreatedAt',
 *     periods: 12,
 *     periodType: 'month'
 *   }
 * );
 * ```
 */
export async function cohortAnalysis<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  config: CohortConfig,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::cohortAnalysis');

  try {
    const tableName = model.tableName;

    const periodExtract = {
      day: 'DAY',
      week: 'WEEK',
      month: 'MONTH',
    }[config.periodType];

    const query = `
      WITH cohorts AS (
        SELECT
          "${config.userIdField}",
          DATE_TRUNC('${config.periodType}', "${config.cohortDateField}") AS cohort_period,
          DATE_TRUNC('${config.periodType}', "${config.eventDateField}") AS event_period
        FROM "${tableName}"
      )
      SELECT
        cohort_period,
        event_period,
        COUNT(DISTINCT "${config.userIdField}") AS active_users,
        EXTRACT(${periodExtract} FROM event_period - cohort_period) AS period_number
      FROM cohorts
      WHERE EXTRACT(${periodExtract} FROM event_period - cohort_period) <= ${config.periods}
      GROUP BY cohort_period, event_period, period_number
      ORDER BY cohort_period, period_number
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Cohort analysis: ${results.length} cohort periods`);
    return results;
  } catch (error) {
    logger.error('Cohort analysis failed', error);
    throw new InternalServerErrorException('Cohort analysis failed');
  }
}

/**
 * Calculate retention rate by cohort
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param userIdField - User ID field name
 * @param dateField - Date field for events
 * @param cohortDateField - Date field for cohort grouping
 * @param periodType - Period type for analysis
 * @param transaction - Optional transaction
 * @returns Retention rates by cohort
 *
 * @example
 * ```typescript
 * const retention = await calculateRetentionRate(
 *   sequelize,
 *   UserLogin,
 *   'userId',
 *   'loginDate',
 *   'signupDate',
 *   'month'
 * );
 * ```
 */
export async function calculateRetentionRate<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  userIdField: string,
  dateField: string,
  cohortDateField: string,
  periodType: 'day' | 'week' | 'month' = 'month',
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateRetentionRate');

  try {
    const tableName = model.tableName;

    const query = `
      WITH cohort_sizes AS (
        SELECT
          DATE_TRUNC('${periodType}', "${cohortDateField}") AS cohort,
          COUNT(DISTINCT "${userIdField}") AS cohort_size
        FROM "${tableName}"
        GROUP BY cohort
      ),
      cohort_activity AS (
        SELECT
          DATE_TRUNC('${periodType}', "${cohortDateField}") AS cohort,
          DATE_TRUNC('${periodType}', "${dateField}") AS period,
          COUNT(DISTINCT "${userIdField}") AS active_users
        FROM "${tableName}"
        GROUP BY cohort, period
      )
      SELECT
        ca.cohort,
        ca.period,
        ca.active_users,
        cs.cohort_size,
        (ca.active_users::float / cs.cohort_size * 100) AS retention_rate
      FROM cohort_activity ca
      JOIN cohort_sizes cs ON ca.cohort = cs.cohort
      ORDER BY ca.cohort, ca.period
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Retention rate: ${results.length} periods analyzed`);
    return results;
  } catch (error) {
    logger.error('Retention rate calculation failed', error);
    throw new InternalServerErrorException('Retention rate calculation failed');
  }
}

/**
 * Calculate year-over-year growth
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param dateField - Date field name
 * @param valueField - Value field to compare
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns YoY growth data
 *
 * @example
 * ```typescript
 * const growth = await calculateYoYGrowth(
 *   sequelize,
 *   Revenue,
 *   'date',
 *   'amount',
 *   { region: 'North America' }
 * );
 * ```
 */
export async function calculateYoYGrowth<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  dateField: string,
  valueField: string,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateYoYGrowth');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const query = `
      WITH yearly_data AS (
        SELECT
          EXTRACT(YEAR FROM "${dateField}") AS year,
          SUM("${valueField}") AS total_value
        FROM "${tableName}"
        ${whereClause}
        GROUP BY year
      )
      SELECT
        curr.year,
        curr.total_value AS current_value,
        prev.total_value AS previous_value,
        ((curr.total_value - prev.total_value) / prev.total_value * 100) AS yoy_growth_percent
      FROM yearly_data curr
      LEFT JOIN yearly_data prev ON curr.year = prev.year + 1
      ORDER BY curr.year
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`YoY growth: ${results.length} years analyzed`);
    return results;
  } catch (error) {
    logger.error('YoY growth calculation failed', error);
    throw new InternalServerErrorException('YoY growth calculation failed');
  }
}

/**
 * Calculate top N records with percentage of total
 *
 * @param model - Sequelize model
 * @param field - Field to sum
 * @param groupBy - Field to group by
 * @param topN - Number of top records
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Top N records with percentage
 *
 * @example
 * ```typescript
 * const topProducts = await calculateTopN(
 *   Sale,
 *   'revenue',
 *   'productId',
 *   10,
 *   { year: 2024 }
 * );
 * ```
 */
export async function calculateTopN<M extends Model>(
  model: ModelCtor<M>,
  field: string,
  groupBy: string,
  topN: number = 10,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateTopN');

  try {
    const sequelize = model.sequelize!;
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const query = `
      WITH totals AS (
        SELECT SUM("${field}") AS grand_total
        FROM "${tableName}"
        ${whereClause}
      ),
      grouped AS (
        SELECT
          "${groupBy}",
          SUM("${field}") AS total
        FROM "${tableName}"
        ${whereClause}
        GROUP BY "${groupBy}"
        ORDER BY total DESC
        LIMIT ${topN}
      )
      SELECT
        g."${groupBy}",
        g.total,
        (g.total / t.grand_total * 100) AS percentage_of_total
      FROM grouped g, totals t
      ORDER BY g.total DESC
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Top ${topN}: ${results.length} records`);
    return results;
  } catch (error) {
    logger.error('Top N calculation failed', error);
    throw new InternalServerErrorException('Top N calculation failed');
  }
}

/**
 * Calculate conversion funnel metrics
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param stages - Array of stage configurations
 * @param userIdField - User ID field name
 * @param dateField - Date field for filtering
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Funnel metrics with conversion rates
 *
 * @example
 * ```typescript
 * const funnel = await calculateFunnelMetrics(
 *   sequelize,
 *   UserEvent,
 *   [
 *     { name: 'Visit', eventType: 'page_view' },
 *     { name: 'Signup', eventType: 'signup' },
 *     { name: 'Purchase', eventType: 'purchase' }
 *   ],
 *   'userId',
 *   'eventDate',
 *   { date: { [Op.gte]: startDate } }
 * );
 * ```
 */
export async function calculateFunnelMetrics<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  stages: Array<{ name: string; eventType: string }>,
  userIdField: string,
  dateField: string,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateFunnelMetrics');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `AND ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const stageCTEs = stages
      .map(
        (stage, idx) => `
      stage_${idx} AS (
        SELECT DISTINCT "${userIdField}"
        FROM "${tableName}"
        WHERE "eventType" = '${stage.eventType}' ${whereClause}
      )
    `
      )
      .join(',\n');

    const stageSelects = stages
      .map(
        (stage, idx) => `
      (SELECT COUNT(*) FROM stage_${idx}) AS "${stage.name}_count"
    `
      )
      .join(',\n');

    const query = `
      WITH ${stageCTEs}
      SELECT ${stageSelects}
    `;

    const [result] = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    // Calculate conversion rates
    const metrics = stages.map((stage, idx) => {
      const count = (result as any)[`${stage.name}_count`];
      const prevCount = idx > 0 ? (result as any)[`${stages[idx - 1].name}_count`] : count;
      const conversionRate = prevCount > 0 ? (count / prevCount) * 100 : 0;

      return {
        stage: stage.name,
        count,
        conversionRate: idx > 0 ? conversionRate : 100,
        dropoffRate: idx > 0 ? 100 - conversionRate : 0,
      };
    });

    logger.log(`Funnel metrics: ${stages.length} stages analyzed`);
    return metrics;
  } catch (error) {
    logger.error('Funnel metrics calculation failed', error);
    throw new InternalServerErrorException('Funnel metrics calculation failed');
  }
}

/**
 * Calculate histogram/distribution
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param field - Field to analyze
 * @param buckets - Number of buckets
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Histogram data
 *
 * @example
 * ```typescript
 * const distribution = await calculateHistogram(
 *   sequelize,
 *   Order,
 *   'amount',
 *   10,
 *   { status: 'completed' }
 * );
 * ```
 */
export async function calculateHistogram<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  field: string,
  buckets: number = 10,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateHistogram');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const query = `
      WITH stats AS (
        SELECT
          MIN("${field}") AS min_val,
          MAX("${field}") AS max_val,
          (MAX("${field}") - MIN("${field}")) / ${buckets}::float AS bucket_width
        FROM "${tableName}"
        ${whereClause}
      )
      SELECT
        FLOOR(("${field}" - stats.min_val) / stats.bucket_width) AS bucket,
        COUNT(*) AS frequency,
        stats.min_val + (FLOOR(("${field}" - stats.min_val) / stats.bucket_width) * stats.bucket_width) AS bucket_start,
        stats.min_val + ((FLOOR(("${field}" - stats.min_val) / stats.bucket_width) + 1) * stats.bucket_width) AS bucket_end
      FROM "${tableName}", stats
      ${whereClause}
      GROUP BY bucket, stats.min_val, stats.bucket_width
      ORDER BY bucket
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Histogram: ${results.length} buckets`);
    return results;
  } catch (error) {
    logger.error('Histogram calculation failed', error);
    throw new InternalServerErrorException('Histogram calculation failed');
  }
}

/**
 * Calculate correlation between two fields
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param field1 - First field
 * @param field2 - Second field
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Correlation coefficient
 *
 * @example
 * ```typescript
 * const correlation = await calculateCorrelation(
 *   sequelize,
 *   Marketing,
 *   'adSpend',
 *   'revenue',
 *   { year: 2024 }
 * );
 * console.log(`Correlation: ${correlation}`);
 * ```
 */
export async function calculateCorrelation<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  field1: string,
  field2: string,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<number> {
  const logger = new Logger('AggregateAnalytics::calculateCorrelation');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const query = `
      SELECT CORR("${field1}", "${field2}") AS correlation
      FROM "${tableName}"
      ${whereClause}
    `;

    const [result] = await sequelize.query<{ correlation: number }>(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    const correlation = result ? result.correlation : 0;
    logger.log(`Correlation between ${field1} and ${field2}: ${correlation.toFixed(4)}`);

    return correlation;
  } catch (error) {
    logger.error('Correlation calculation failed', error);
    throw new InternalServerErrorException('Correlation calculation failed');
  }
}

/**
 * Calculate rank and dense rank
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param field - Field to rank by
 * @param orderDirection - Order direction
 * @param partitionBy - Optional partition field
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Records with rank and dense rank
 *
 * @example
 * ```typescript
 * const ranked = await calculateRank(
 *   sequelize,
 *   Student,
 *   'score',
 *   'DESC',
 *   'grade',
 *   { year: 2024 }
 * );
 * ```
 */
export async function calculateRank<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  field: string,
  orderDirection: 'ASC' | 'DESC' = 'DESC',
  partitionBy?: string,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateRank');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const partitionClause = partitionBy ? `PARTITION BY "${partitionBy}"` : '';

    const query = `
      SELECT
        *,
        RANK() OVER (${partitionClause} ORDER BY "${field}" ${orderDirection}) AS rank,
        DENSE_RANK() OVER (${partitionClause} ORDER BY "${field}" ${orderDirection}) AS dense_rank,
        ROW_NUMBER() OVER (${partitionClause} ORDER BY "${field}" ${orderDirection}) AS row_number
      FROM "${tableName}"
      ${whereClause}
      ORDER BY ${partitionBy ? `"${partitionBy}", ` : ''}"${field}" ${orderDirection}
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Rank calculation: ${results.length} records ranked`);
    return results;
  } catch (error) {
    logger.error('Rank calculation failed', error);
    throw new InternalServerErrorException('Rank calculation failed');
  }
}

/**
 * Calculate lag and lead values
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param field - Field to analyze
 * @param orderBy - Order by field
 * @param offset - Offset for lag/lead
 * @param partitionBy - Optional partition field
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Records with lag and lead values
 *
 * @example
 * ```typescript
 * const withLagLead = await calculateLagLead(
 *   sequelize,
 *   StockPrice,
 *   'price',
 *   'date',
 *   1,
 *   'symbol'
 * );
 * ```
 */
export async function calculateLagLead<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  field: string,
  orderBy: string,
  offset: number = 1,
  partitionBy?: string,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateLagLead');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const partitionClause = partitionBy ? `PARTITION BY "${partitionBy}"` : '';

    const query = `
      SELECT
        *,
        LAG("${field}", ${offset}) OVER (${partitionClause} ORDER BY "${orderBy}") AS lag_value,
        LEAD("${field}", ${offset}) OVER (${partitionClause} ORDER BY "${orderBy}") AS lead_value,
        "${field}" - LAG("${field}", ${offset}) OVER (${partitionClause} ORDER BY "${orderBy}") AS change_from_prev
      FROM "${tableName}"
      ${whereClause}
      ORDER BY ${partitionBy ? `"${partitionBy}", ` : ''}"${orderBy}"
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Lag/Lead calculation: ${results.length} records`);
    return results;
  } catch (error) {
    logger.error('Lag/Lead calculation failed', error);
    throw new InternalServerErrorException('Lag/Lead calculation failed');
  }
}

/**
 * Calculate first and last values in partition
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param field - Field to analyze
 * @param orderBy - Order by field
 * @param partitionBy - Partition field
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Records with first and last values
 *
 * @example
 * ```typescript
 * const withFirstLast = await calculateFirstLastValue(
 *   sequelize,
 *   Transaction,
 *   'amount',
 *   'date',
 *   'userId'
 * );
 * ```
 */
export async function calculateFirstLastValue<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  field: string,
  orderBy: string,
  partitionBy: string,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateFirstLastValue');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const query = `
      SELECT
        *,
        FIRST_VALUE("${field}") OVER (PARTITION BY "${partitionBy}" ORDER BY "${orderBy}") AS first_value,
        LAST_VALUE("${field}") OVER (
          PARTITION BY "${partitionBy}"
          ORDER BY "${orderBy}"
          ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS last_value
      FROM "${tableName}"
      ${whereClause}
      ORDER BY "${partitionBy}", "${orderBy}"
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`First/Last value: ${results.length} records`);
    return results;
  } catch (error) {
    logger.error('First/Last value calculation failed', error);
    throw new InternalServerErrorException('First/Last value calculation failed');
  }
}

/**
 * Calculate NTILE (percentile groups)
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param field - Field to partition by
 * @param tiles - Number of tiles (e.g., 4 for quartiles)
 * @param orderBy - Order by field
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Records with tile assignments
 *
 * @example
 * ```typescript
 * const quartiles = await calculateNTile(
 *   sequelize,
 *   Customer,
 *   'lifetimeValue',
 *   4, // Quartiles
 *   'lifetimeValue'
 * );
 * ```
 */
export async function calculateNTile<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  field: string,
  tiles: number,
  orderBy: string,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateNTile');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const query = `
      SELECT
        *,
        NTILE(${tiles}) OVER (ORDER BY "${orderBy}") AS tile
      FROM "${tableName}"
      ${whereClause}
      ORDER BY "${orderBy}"
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`NTILE calculation: ${results.length} records in ${tiles} tiles`);
    return results;
  } catch (error) {
    logger.error('NTILE calculation failed', error);
    throw new InternalServerErrorException('NTILE calculation failed');
  }
}

/**
 * Calculate month-over-month growth
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param dateField - Date field name
 * @param valueField - Value field to compare
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns MoM growth data
 *
 * @example
 * ```typescript
 * const momGrowth = await calculateMoMGrowth(
 *   sequelize,
 *   Revenue,
 *   'date',
 *   'amount'
 * );
 * ```
 */
export async function calculateMoMGrowth<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  dateField: string,
  valueField: string,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateMoMGrowth');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const query = `
      WITH monthly_data AS (
        SELECT
          DATE_TRUNC('month', "${dateField}") AS month,
          SUM("${valueField}") AS total_value
        FROM "${tableName}"
        ${whereClause}
        GROUP BY month
      )
      SELECT
        month,
        total_value AS current_value,
        LAG(total_value) OVER (ORDER BY month) AS previous_value,
        ((total_value - LAG(total_value) OVER (ORDER BY month)) /
         LAG(total_value) OVER (ORDER BY month) * 100) AS mom_growth_percent
      FROM monthly_data
      ORDER BY month
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`MoM growth: ${results.length} months analyzed`);
    return results;
  } catch (error) {
    logger.error('MoM growth calculation failed', error);
    throw new InternalServerErrorException('MoM growth calculation failed');
  }
}

/**
 * Calculate average daily active users (DAU)
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param userIdField - User ID field
 * @param dateField - Date field
 * @param startDate - Start date
 * @param endDate - End date
 * @param transaction - Optional transaction
 * @returns DAU metrics
 *
 * @example
 * ```typescript
 * const dau = await calculateDAU(
 *   sequelize,
 *   UserSession,
 *   'userId',
 *   'sessionDate',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function calculateDAU<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  userIdField: string,
  dateField: string,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateDAU');

  try {
    const tableName = model.tableName;

    const query = `
      SELECT
        DATE_TRUNC('day', "${dateField}")::date AS date,
        COUNT(DISTINCT "${userIdField}") AS daily_active_users
      FROM "${tableName}"
      WHERE "${dateField}" BETWEEN :startDate AND :endDate
      GROUP BY date
      ORDER BY date
    `;

    const results = await sequelize.query(query, {
      replacements: { startDate, endDate },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`DAU calculation: ${results.length} days`);
    return results;
  } catch (error) {
    logger.error('DAU calculation failed', error);
    throw new InternalServerErrorException('DAU calculation failed');
  }
}

/**
 * Calculate monthly active users (MAU) and DAU/MAU ratio
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param userIdField - User ID field
 * @param dateField - Date field
 * @param startDate - Start date
 * @param endDate - End date
 * @param transaction - Optional transaction
 * @returns MAU metrics with DAU/MAU ratio
 *
 * @example
 * ```typescript
 * const mau = await calculateMAU(
 *   sequelize,
 *   UserActivity,
 *   'userId',
 *   'activityDate',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function calculateMAU<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  userIdField: string,
  dateField: string,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateMAU');

  try {
    const tableName = model.tableName;

    const query = `
      WITH daily_users AS (
        SELECT
          DATE_TRUNC('day', "${dateField}")::date AS date,
          COUNT(DISTINCT "${userIdField}") AS dau
        FROM "${tableName}"
        WHERE "${dateField}" BETWEEN :startDate AND :endDate
        GROUP BY date
      ),
      monthly_users AS (
        SELECT
          DATE_TRUNC('month', "${dateField}") AS month,
          COUNT(DISTINCT "${userIdField}") AS mau
        FROM "${tableName}"
        WHERE "${dateField}" BETWEEN :startDate AND :endDate
        GROUP BY month
      )
      SELECT
        du.date,
        du.dau,
        mu.mau,
        (du.dau::float / mu.mau * 100) AS dau_mau_ratio
      FROM daily_users du
      JOIN monthly_users mu ON DATE_TRUNC('month', du.date) = mu.month
      ORDER BY du.date
    `;

    const results = await sequelize.query(query, {
      replacements: { startDate, endDate },
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`MAU calculation: ${results.length} data points`);
    return results;
  } catch (error) {
    logger.error('MAU calculation failed', error);
    throw new InternalServerErrorException('MAU calculation failed');
  }
}

/**
 * Calculate customer lifetime value (CLV)
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param customerIdField - Customer ID field
 * @param revenueField - Revenue field
 * @param dateField - Date field
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns CLV by customer
 *
 * @example
 * ```typescript
 * const clv = await calculateCLV(
 *   sequelize,
 *   Transaction,
 *   'customerId',
 *   'amount',
 *   'date',
 *   { status: 'completed' }
 * );
 * ```
 */
export async function calculateCLV<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  customerIdField: string,
  revenueField: string,
  dateField: string,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateCLV');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const query = `
      SELECT
        "${customerIdField}",
        SUM("${revenueField}") AS total_revenue,
        COUNT(*) AS transaction_count,
        AVG("${revenueField}") AS avg_transaction_value,
        MIN("${dateField}") AS first_purchase_date,
        MAX("${dateField}") AS last_purchase_date,
        EXTRACT(DAY FROM MAX("${dateField}") - MIN("${dateField}")) AS customer_lifespan_days
      FROM "${tableName}"
      ${whereClause}
      GROUP BY "${customerIdField}"
      ORDER BY total_revenue DESC
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`CLV calculation: ${results.length} customers`);
    return results;
  } catch (error) {
    logger.error('CLV calculation failed', error);
    throw new InternalServerErrorException('CLV calculation failed');
  }
}

/**
 * Calculate RFM (Recency, Frequency, Monetary) scores
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param customerIdField - Customer ID field
 * @param dateField - Transaction date field
 * @param amountField - Transaction amount field
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns RFM scores by customer
 *
 * @example
 * ```typescript
 * const rfm = await calculateRFM(
 *   sequelize,
 *   Purchase,
 *   'customerId',
 *   'purchaseDate',
 *   'amount'
 * );
 * ```
 */
export async function calculateRFM<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  customerIdField: string,
  dateField: string,
  amountField: string,
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateRFM');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const query = `
      WITH customer_metrics AS (
        SELECT
          "${customerIdField}",
          EXTRACT(DAY FROM NOW() - MAX("${dateField}")) AS recency_days,
          COUNT(*) AS frequency,
          SUM("${amountField}") AS monetary
        FROM "${tableName}"
        ${whereClause}
        GROUP BY "${customerIdField}"
      )
      SELECT
        "${customerIdField}",
        recency_days,
        frequency,
        monetary,
        NTILE(5) OVER (ORDER BY recency_days DESC) AS recency_score,
        NTILE(5) OVER (ORDER BY frequency) AS frequency_score,
        NTILE(5) OVER (ORDER BY monetary) AS monetary_score
      FROM customer_metrics
      ORDER BY monetary DESC
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`RFM calculation: ${results.length} customers scored`);
    return results;
  } catch (error) {
    logger.error('RFM calculation failed', error);
    throw new InternalServerErrorException('RFM calculation failed');
  }
}

/**
 * Calculate churn rate
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param customerIdField - Customer ID field
 * @param dateField - Activity date field
 * @param churnThresholdDays - Days of inactivity to consider churned
 * @param periodType - Period type for analysis
 * @param transaction - Optional transaction
 * @returns Churn rate by period
 *
 * @example
 * ```typescript
 * const churnRate = await calculateChurnRate(
 *   sequelize,
 *   UserActivity,
 *   'userId',
 *   'lastActiveDate',
 *   30, // 30 days of inactivity = churned
 *   'month'
 * );
 * ```
 */
export async function calculateChurnRate<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  customerIdField: string,
  dateField: string,
  churnThresholdDays: number = 30,
  periodType: 'day' | 'week' | 'month' = 'month',
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateChurnRate');

  try {
    const tableName = model.tableName;

    const query = `
      WITH customer_activity AS (
        SELECT
          "${customerIdField}",
          DATE_TRUNC('${periodType}', "${dateField}") AS period,
          MAX("${dateField}") AS last_activity
        FROM "${tableName}"
        GROUP BY "${customerIdField}", period
      ),
      churned_customers AS (
        SELECT
          period,
          COUNT(DISTINCT CASE
            WHEN EXTRACT(DAY FROM NOW() - last_activity) > ${churnThresholdDays}
            THEN "${customerIdField}"
          END) AS churned,
          COUNT(DISTINCT "${customerIdField}") AS total_customers
        FROM customer_activity
        GROUP BY period
      )
      SELECT
        period,
        churned,
        total_customers,
        (churned::float / NULLIF(total_customers, 0) * 100) AS churn_rate
      FROM churned_customers
      ORDER BY period
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Churn rate: ${results.length} periods analyzed`);
    return results;
  } catch (error) {
    logger.error('Churn rate calculation failed', error);
    throw new InternalServerErrorException('Churn rate calculation failed');
  }
}

/**
 * Calculate basket analysis (market basket analysis)
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param transactionIdField - Transaction ID field
 * @param productIdField - Product ID field
 * @param minSupport - Minimum support threshold
 * @param transaction - Optional transaction
 * @returns Product associations
 *
 * @example
 * ```typescript
 * const associations = await calculateBasketAnalysis(
 *   sequelize,
 *   OrderItem,
 *   'orderId',
 *   'productId',
 *   0.01 // 1% minimum support
 * );
 * ```
 */
export async function calculateBasketAnalysis<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  transactionIdField: string,
  productIdField: string,
  minSupport: number = 0.01,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateBasketAnalysis');

  try {
    const tableName = model.tableName;

    const query = `
      WITH total_transactions AS (
        SELECT COUNT(DISTINCT "${transactionIdField}") AS total
        FROM "${tableName}"
      ),
      product_pairs AS (
        SELECT
          a."${productIdField}" AS product_a,
          b."${productIdField}" AS product_b,
          COUNT(DISTINCT a."${transactionIdField}") AS pair_count
        FROM "${tableName}" a
        JOIN "${tableName}" b ON a."${transactionIdField}" = b."${transactionIdField}"
        WHERE a."${productIdField}" < b."${productIdField}"
        GROUP BY product_a, product_b
      )
      SELECT
        product_a,
        product_b,
        pair_count,
        (pair_count::float / tt.total) AS support,
        (pair_count::float / tt.total * 100) AS confidence
      FROM product_pairs, total_transactions tt
      WHERE (pair_count::float / tt.total) >= ${minSupport}
      ORDER BY support DESC
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Basket analysis: ${results.length} product associations found`);
    return results;
  } catch (error) {
    logger.error('Basket analysis failed', error);
    throw new InternalServerErrorException('Basket analysis failed');
  }
}

/**
 * Calculate seasonality index
 *
 * @param sequelize - Sequelize instance
 * @param model - Sequelize model
 * @param dateField - Date field
 * @param valueField - Value field to analyze
 * @param seasonalityType - Type of seasonality (monthly, quarterly, weekly)
 * @param where - Where conditions
 * @param transaction - Optional transaction
 * @returns Seasonality index
 *
 * @example
 * ```typescript
 * const seasonality = await calculateSeasonalityIndex(
 *   sequelize,
 *   Sale,
 *   'saleDate',
 *   'amount',
 *   'monthly'
 * );
 * ```
 */
export async function calculateSeasonalityIndex<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  dateField: string,
  valueField: string,
  seasonalityType: 'monthly' | 'quarterly' | 'weekly' = 'monthly',
  where?: WhereOptions<any>,
  transaction?: Transaction
): Promise<any[]> {
  const logger = new Logger('AggregateAnalytics::calculateSeasonalityIndex');

  try {
    const tableName = model.tableName;
    const whereClause = where
      ? `WHERE ${Object.entries(where)
          .map(([key, value]) => `"${key}" = ${sequelize.escape(value)}`)
          .join(' AND ')}`
      : '';

    const seasonExtract = {
      monthly: "EXTRACT(MONTH FROM \"" + dateField + '")',
      quarterly: "EXTRACT(QUARTER FROM \"" + dateField + '")',
      weekly: "EXTRACT(WEEK FROM \"" + dateField + '")',
    }[seasonalityType];

    const query = `
      WITH seasonal_avg AS (
        SELECT
          ${seasonExtract} AS season,
          AVG("${valueField}") AS avg_value
        FROM "${tableName}"
        ${whereClause}
        GROUP BY season
      ),
      overall_avg AS (
        SELECT AVG("${valueField}") AS overall_avg
        FROM "${tableName}"
        ${whereClause}
      )
      SELECT
        sa.season,
        sa.avg_value,
        oa.overall_avg,
        (sa.avg_value / oa.overall_avg) AS seasonality_index
      FROM seasonal_avg sa, overall_avg oa
      ORDER BY sa.season
    `;

    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Seasonality index: ${results.length} seasons analyzed`);
    return results;
  } catch (error) {
    logger.error('Seasonality index calculation failed', error);
    throw new InternalServerErrorException('Seasonality index calculation failed');
  }
}

/**
 * Export all aggregate analytics functions
 */
export const AggregateAnalyticsQueries = {
  executeAggregate,
  groupedAggregate,
  calculatePercentiles,
  calculateStatistics,
  generateTimeSeries,
  calculateMovingAverage,
  calculateCumulativeSum,
  cohortAnalysis,
  calculateRetentionRate,
  calculateYoYGrowth,
  calculateTopN,
  calculateFunnelMetrics,
  calculateHistogram,
  calculateCorrelation,
  calculateRank,
  calculateLagLead,
  calculateFirstLastValue,
  calculateNTile,
  calculateMoMGrowth,
  calculateDAU,
  calculateMAU,
  calculateCLV,
  calculateRFM,
  calculateChurnRate,
  calculateBasketAnalysis,
  calculateSeasonalityIndex,
};
