/**
 * @fileoverview Analytics Operations Service for Database Operations
 * @module @/database/services/operations/analytics-operations
 * @description Advanced analytics and aggregation operations for data analysis
 *
 * @version 1.0.0
 */

import { Logger, InternalServerErrorException } from '@nestjs/common';
import {
  Model,
  ModelCtor,
  Sequelize,
  WhereOptions,
  Transaction,
  QueryTypes,
  fn,
  col,
  Attributes,
} from 'sequelize';
import {
  AggregateResult,
  TimeSeriesConfig,
  PercentileConfig,
  CohortConfig,
  RollingWindowConfig,
} from './interfaces';

/**
 * Execute basic aggregation query
 */
export async function executeAggregate<M extends Model>(
  model: ModelCtor<M>,
  field: string,
  aggregateType: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX',
  where?: WhereOptions<Attributes<M>>,
  transaction?: Transaction
): Promise<AggregateResult> {
  const logger = new Logger('AnalyticsOperations::executeAggregate');

  try {
    let value: number | null = null;

    switch (aggregateType) {
      case 'COUNT':
        value = await model.count({ where, transaction });
        break;

      case 'SUM':
        value = await model.sum(field, { where, transaction });
        break;

      case 'AVG': {
        const result = await model.findOne({
          attributes: [[fn('AVG', col(field)), 'avg']],
          where,
          transaction,
          raw: true,
        });
        value = result ? parseFloat((result as { avg: string }).avg) : null;
        break;
      }

      case 'MIN':
        value = await model.min(field, { where, transaction });
        break;

      case 'MAX':
        value = await model.max(field, { where, transaction });
        break;
    }

    const count = await model.count({ where, transaction });

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
 * Execute multiple aggregate functions on the same dataset
 */
export async function executeMultipleAggregates<M extends Model>(
  model: ModelCtor<M>,
  field: string,
  aggregateTypes: Array<'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX'>,
  where?: WhereOptions<Attributes<M>>,
  transaction?: Transaction
): Promise<Record<string, AggregateResult>> {
  const logger = new Logger('AnalyticsOperations::executeMultipleAggregates');

  try {
    const results: Record<string, AggregateResult> = {};

    // Build attributes for all aggregates in one query
    const attributes: Array<[ReturnType<typeof fn>, string]> = [];

    aggregateTypes.forEach(type => {
      if (type === 'COUNT') {
        attributes.push([fn('COUNT', col('*')), type.toLowerCase()]);
      } else {
        attributes.push([fn(type, col(field)), type.toLowerCase()]);
      }
    });

    const result = await model.findOne({
      attributes,
      where,
      transaction,
      raw: true,
    });

    if (result) {
      const count = await model.count({ where, transaction });

      aggregateTypes.forEach(type => {
        const key = type.toLowerCase();
        const value = result[key as keyof typeof result] as number | null;

        results[type] = {
          value: value !== null ? Number(value) : null,
          count,
        };
      });
    }

    logger.log(`Multiple aggregates executed on ${field}: ${aggregateTypes.join(', ')}`);

    return results;
  } catch (error) {
    logger.error('Multiple aggregates query failed', error);
    throw new InternalServerErrorException('Multiple aggregates query failed');
  }
}

/**
 * Generate time series data with aggregations
 */
export async function generateTimeSeries<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  config: TimeSeriesConfig,
  transaction?: Transaction
): Promise<Array<{ period: string; value: number }>> {
  const logger = new Logger('AnalyticsOperations::generateTimeSeries');

  try {
    const tableName = model.tableName;

    const truncateFunction = {
      hour: `DATE_TRUNC('hour', "${config.dateField}")::date`,
      day: `DATE_TRUNC('day', "${config.dateField}")::date`,
      week: `DATE_TRUNC('week', "${config.dateField}")::date`,
      month: `DATE_TRUNC('month', "${config.dateField}")::date`,
      quarter: `DATE_TRUNC('quarter', "${config.dateField}")::date`,
      year: `DATE_TRUNC('year', "${config.dateField}")::date`,
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
 * Calculate percentiles for a numeric field
 */
export async function calculatePercentiles<M extends Model>(
  sequelize: Sequelize,
  model: ModelCtor<M>,
  config: PercentileConfig,
  transaction?: Transaction
): Promise<Map<number, number>> {
  const logger = new Logger('AnalyticsOperations::calculatePercentiles');

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
      percentileMap.set(p, parseFloat((results as Record<string, string>)[`p${p}`]));
    });

    logger.log(`Calculated percentiles: ${config.percentiles.join(', ')}`);
    return percentileMap;
  } catch (error) {
    logger.error('Percentile calculation failed', error);
    throw new InternalServerErrorException('Percentile calculation failed');
  }
}

/**
 * Perform cohort analysis
 */
export async function performCohortAnalysis(
  sequelize: Sequelize,
  tableName: string,
  config: CohortConfig,
  transaction?: Transaction
): Promise<Array<{ cohort: string; period: number; users: number; retention: number }>> {
  const logger = new Logger('AnalyticsOperations::performCohortAnalysis');

  try {
    const periodInterval = {
      day: '1 DAY',
      week: '1 WEEK',
      month: '1 MONTH',
    }[config.periodType];

    const query = `
      WITH cohorts AS (
        SELECT
          ${config.userIdField} as user_id,
          DATE_TRUNC('${config.periodType}', ${config.cohortDateField}) as cohort_date,
          DATE_TRUNC('${config.periodType}', ${config.eventDateField}) as event_date
        FROM "${tableName}"
        WHERE ${config.eventDateField} >= ${config.cohortDateField}
      ),
      cohort_data AS (
        SELECT
          cohort_date,
          event_date,
          COUNT(DISTINCT user_id) as users,
          EXTRACT(${config.periodType} FROM AGE(event_date, cohort_date)) as period_number
        FROM cohorts
        GROUP BY cohort_date, event_date
      ),
      cohort_sizes AS (
        SELECT
          cohort_date,
          COUNT(DISTINCT user_id) as cohort_size
        FROM cohorts
        WHERE event_date = cohort_date
        GROUP BY cohort_date
      )
      SELECT
        cd.cohort_date::text as cohort,
        cd.period_number::integer as period,
        cd.users,
        ROUND((cd.users::decimal / cs.cohort_size) * 100, 2) as retention
      FROM cohort_data cd
      JOIN cohort_sizes cs ON cd.cohort_date = cs.cohort_date
      WHERE cd.period_number <= ${config.periods}
      ORDER BY cd.cohort_date, cd.period_number
    `;

    const results = await sequelize.query<{
      cohort: string;
      period: number;
      users: number;
      retention: number;
    }>(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Cohort analysis: ${results.length} data points`);
    return results;
  } catch (error) {
    logger.error('Cohort analysis failed', error);
    throw new InternalServerErrorException('Cohort analysis failed');
  }
}

/**
 * Calculate rolling window aggregates
 */
export async function calculateRollingWindow(
  sequelize: Sequelize,
  tableName: string,
  config: RollingWindowConfig,
  transaction?: Transaction
): Promise<Array<{ value: number; rolling_value: number }>> {
  const logger = new Logger('AnalyticsOperations::calculateRollingWindow');

  try {
    const windowFunction = {
      SUM: 'SUM',
      AVG: 'AVG',
      MIN: 'MIN',
      MAX: 'MAX',
      COUNT: 'COUNT',
    }[config.function];

    const query = `
      SELECT
        "${config.field}" as value,
        ${windowFunction}("${config.field}") OVER (
          ORDER BY "${config.orderBy}"
          ROWS BETWEEN ${config.windowSize - 1} PRECEDING AND CURRENT ROW
        ) as rolling_value
      FROM "${tableName}"
      ORDER BY "${config.orderBy}"
    `;

    const results = await sequelize.query<{
      value: number;
      rolling_value: number;
    }>(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Rolling window calculation: ${results.length} data points`);
    return results;
  } catch (error) {
    logger.error('Rolling window calculation failed', error);
    throw new InternalServerErrorException('Rolling window calculation failed');
  }
}

/**
 * Calculate correlation between two numeric fields
 */
export async function calculateCorrelation(
  sequelize: Sequelize,
  tableName: string,
  field1: string,
  field2: string,
  where?: string,
  transaction?: Transaction
): Promise<{ correlation: number; count: number }> {
  const logger = new Logger('AnalyticsOperations::calculateCorrelation');

  try {
    const whereClause = where ? `WHERE ${where}` : '';

    const query = `
      SELECT
        CORR("${field1}", "${field2}") as correlation,
        COUNT(*) as count
      FROM "${tableName}"
      ${whereClause}
      AND "${field1}" IS NOT NULL
      AND "${field2}" IS NOT NULL
    `;

    const [result] = await sequelize.query<{
      correlation: number;
      count: number;
    }>(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Correlation between ${field1} and ${field2}: ${result.correlation}`);
    return result;
  } catch (error) {
    logger.error('Correlation calculation failed', error);
    throw new InternalServerErrorException('Correlation calculation failed');
  }
}

/**
 * Calculate statistical summary for a numeric field
 */
export async function calculateStatisticalSummary(
  sequelize: Sequelize,
  tableName: string,
  field: string,
  where?: string,
  transaction?: Transaction
): Promise<{
  count: number;
  mean: number;
  median: number;
  mode: number;
  stddev: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
}> {
  const logger = new Logger('AnalyticsOperations::calculateStatisticalSummary');

  try {
    const whereClause = where ? `WHERE ${where}` : '';

    const query = `
      SELECT
        COUNT("${field}") as count,
        AVG("${field}") as mean,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY "${field}") as median,
        MODE() WITHIN GROUP (ORDER BY "${field}") as mode,
        STDDEV("${field}") as stddev,
        VARIANCE("${field}") as variance,
        MIN("${field}") as min,
        MAX("${field}") as max,
        (MAX("${field}") - MIN("${field}")) as range,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY "${field}") as q1,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY "${field}") as q3,
        (PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY "${field}") - 
         PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY "${field}")) as iqr
      FROM "${tableName}"
      ${whereClause}
      AND "${field}" IS NOT NULL
    `;

    const [result] = await sequelize.query<{
      count: number;
      mean: number;
      median: number;
      mode: number;
      stddev: number;
      variance: number;
      min: number;
      max: number;
      range: number;
      q1: number;
      q3: number;
      iqr: number;
    }>(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Statistical summary for ${field}: ${result.count} records analyzed`);
    return result;
  } catch (error) {
    logger.error('Statistical summary calculation failed', error);
    throw new InternalServerErrorException('Statistical summary calculation failed');
  }
}

/**
 * Generate histogram data for a numeric field
 */
export async function generateHistogram(
  sequelize: Sequelize,
  tableName: string,
  field: string,
  buckets: number = 10,
  where?: string,
  transaction?: Transaction
): Promise<Array<{ bucket: number; min_value: number; max_value: number; count: number }>> {
  const logger = new Logger('AnalyticsOperations::generateHistogram');

  try {
    const whereClause = where ? `WHERE ${where}` : '';

    const query = `
      WITH stats AS (
        SELECT
          MIN("${field}") as min_val,
          MAX("${field}") as max_val,
          (MAX("${field}") - MIN("${field}")) / ${buckets} as bucket_width
        FROM "${tableName}"
        ${whereClause}
        AND "${field}" IS NOT NULL
      ),
      histogram AS (
        SELECT
          WIDTH_BUCKET("${field}", stats.min_val, stats.max_val, ${buckets}) as bucket,
          COUNT(*) as count,
          stats.min_val + (WIDTH_BUCKET("${field}", stats.min_val, stats.max_val, ${buckets}) - 1) * stats.bucket_width as min_value,
          stats.min_val + WIDTH_BUCKET("${field}", stats.min_val, stats.max_val, ${buckets}) * stats.bucket_width as max_value
        FROM "${tableName}", stats
        ${whereClause}
        AND "${field}" IS NOT NULL
        GROUP BY bucket, stats.min_val, stats.bucket_width
      )
      SELECT
        bucket,
        min_value,
        max_value,
        count
      FROM histogram
      ORDER BY bucket
    `;

    const results = await sequelize.query<{
      bucket: number;
      min_value: number;
      max_value: number;
      count: number;
    }>(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    logger.log(`Histogram generated for ${field}: ${buckets} buckets`);
    return results;
  } catch (error) {
    logger.error('Histogram generation failed', error);
    throw new InternalServerErrorException('Histogram generation failed');
  }
}
