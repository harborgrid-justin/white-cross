"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeAggregate = executeAggregate;
exports.executeMultipleAggregates = executeMultipleAggregates;
exports.generateTimeSeries = generateTimeSeries;
exports.calculatePercentiles = calculatePercentiles;
exports.performCohortAnalysis = performCohortAnalysis;
exports.calculateRollingWindow = calculateRollingWindow;
exports.calculateCorrelation = calculateCorrelation;
exports.calculateStatisticalSummary = calculateStatisticalSummary;
exports.generateHistogram = generateHistogram;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
async function executeAggregate(model, field, aggregateType, where, transaction) {
    const logger = new common_1.Logger('AnalyticsOperations::executeAggregate');
    try {
        let value = null;
        switch (aggregateType) {
            case 'COUNT':
                value = await model.count({ where, transaction });
                break;
            case 'SUM':
                value = await model.sum(field, { where, transaction });
                break;
            case 'AVG': {
                const result = await model.findOne({
                    attributes: [[(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)(field)), 'avg']],
                    where,
                    transaction,
                    raw: true,
                });
                value = result ? parseFloat(result.avg) : null;
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
    }
    catch (error) {
        logger.error('Aggregate query failed', error);
        throw new common_1.InternalServerErrorException('Aggregate query failed');
    }
}
async function executeMultipleAggregates(model, field, aggregateTypes, where, transaction) {
    const logger = new common_1.Logger('AnalyticsOperations::executeMultipleAggregates');
    try {
        const results = {};
        const attributes = [];
        aggregateTypes.forEach(type => {
            if (type === 'COUNT') {
                attributes.push([(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('*')), type.toLowerCase()]);
            }
            else {
                attributes.push([(0, sequelize_1.fn)(type, (0, sequelize_1.col)(field)), type.toLowerCase()]);
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
                const value = result[key];
                results[type] = {
                    value: value !== null ? Number(value) : null,
                    count,
                };
            });
        }
        logger.log(`Multiple aggregates executed on ${field}: ${aggregateTypes.join(', ')}`);
        return results;
    }
    catch (error) {
        logger.error('Multiple aggregates query failed', error);
        throw new common_1.InternalServerErrorException('Multiple aggregates query failed');
    }
}
async function generateTimeSeries(sequelize, model, config, transaction) {
    const logger = new common_1.Logger('AnalyticsOperations::generateTimeSeries');
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
        const results = await sequelize.query(query, {
            replacements: {
                startDate: config.startDate,
                endDate: config.endDate,
            },
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Time series: ${results.length} data points`);
        return results;
    }
    catch (error) {
        logger.error('Time series generation failed', error);
        throw new common_1.InternalServerErrorException('Time series generation failed');
    }
}
async function calculatePercentiles(sequelize, model, config, transaction) {
    const logger = new common_1.Logger('AnalyticsOperations::calculatePercentiles');
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
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        const percentileMap = new Map();
        config.percentiles.forEach(p => {
            percentileMap.set(p, parseFloat(results[`p${p}`]));
        });
        logger.log(`Calculated percentiles: ${config.percentiles.join(', ')}`);
        return percentileMap;
    }
    catch (error) {
        logger.error('Percentile calculation failed', error);
        throw new common_1.InternalServerErrorException('Percentile calculation failed');
    }
}
async function performCohortAnalysis(sequelize, tableName, config, transaction) {
    const logger = new common_1.Logger('AnalyticsOperations::performCohortAnalysis');
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
        const results = await sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Cohort analysis: ${results.length} data points`);
        return results;
    }
    catch (error) {
        logger.error('Cohort analysis failed', error);
        throw new common_1.InternalServerErrorException('Cohort analysis failed');
    }
}
async function calculateRollingWindow(sequelize, tableName, config, transaction) {
    const logger = new common_1.Logger('AnalyticsOperations::calculateRollingWindow');
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
        const results = await sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Rolling window calculation: ${results.length} data points`);
        return results;
    }
    catch (error) {
        logger.error('Rolling window calculation failed', error);
        throw new common_1.InternalServerErrorException('Rolling window calculation failed');
    }
}
async function calculateCorrelation(sequelize, tableName, field1, field2, where, transaction) {
    const logger = new common_1.Logger('AnalyticsOperations::calculateCorrelation');
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
        const [result] = await sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Correlation between ${field1} and ${field2}: ${result.correlation}`);
        return result;
    }
    catch (error) {
        logger.error('Correlation calculation failed', error);
        throw new common_1.InternalServerErrorException('Correlation calculation failed');
    }
}
async function calculateStatisticalSummary(sequelize, tableName, field, where, transaction) {
    const logger = new common_1.Logger('AnalyticsOperations::calculateStatisticalSummary');
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
        const [result] = await sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Statistical summary for ${field}: ${result.count} records analyzed`);
        return result;
    }
    catch (error) {
        logger.error('Statistical summary calculation failed', error);
        throw new common_1.InternalServerErrorException('Statistical summary calculation failed');
    }
}
async function generateHistogram(sequelize, tableName, field, buckets = 10, where, transaction) {
    const logger = new common_1.Logger('AnalyticsOperations::generateHistogram');
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
        const results = await sequelize.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        logger.log(`Histogram generated for ${field}: ${buckets} buckets`);
        return results;
    }
    catch (error) {
        logger.error('Histogram generation failed', error);
        throw new common_1.InternalServerErrorException('Histogram generation failed');
    }
}
//# sourceMappingURL=analytics-operations.service.js.map