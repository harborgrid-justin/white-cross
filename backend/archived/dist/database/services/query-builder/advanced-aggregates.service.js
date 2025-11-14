"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedAggregates = void 0;
exports.buildAggregateQuery = buildAggregateQuery;
exports.buildGroupedAggregate = buildGroupedAggregate;
exports.buildWindowFunctionQuery = buildWindowFunctionQuery;
exports.buildStatisticalAggregate = buildStatisticalAggregate;
exports.buildPercentileQuery = buildPercentileQuery;
exports.buildRollingAggregate = buildRollingAggregate;
exports.buildCumulativeAggregate = buildCumulativeAggregate;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
async function buildAggregateQuery(model, aggregateType, field, where, groupBy, transaction) {
    const logger = new common_1.Logger('AdvancedAggregates::buildAggregateQuery');
    try {
        const options = {
            where,
            transaction,
            raw: true,
        };
        if (groupBy) {
            options.group = groupBy;
            options.attributes = [
                ...groupBy,
                [(0, sequelize_1.fn)(aggregateType, field ? (0, sequelize_1.col)(field) : (0, sequelize_1.col)('*')), 'aggregate']
            ];
            return await model.findAll(options);
        }
        const aggregateFn = (0, sequelize_1.fn)(aggregateType, field ? (0, sequelize_1.col)(field) : (0, sequelize_1.col)('*'));
        switch (aggregateType) {
            case 'COUNT':
                return await model.count({ where, transaction });
            case 'SUM':
                return await model.sum(field, { where, transaction });
            case 'MIN':
                return await model.min(field, { where, transaction });
            case 'MAX':
                return await model.max(field, { where, transaction });
            case 'AVG':
                const result = await model.findOne({
                    attributes: [[(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)(field)), 'average']],
                    where,
                    transaction,
                    raw: true,
                });
                return result ? result.average : null;
            default:
                throw new common_1.BadRequestException(`Unknown aggregate type: ${aggregateType}`);
        }
    }
    catch (error) {
        logger.error(`Aggregate query failed for ${model.name}`, error);
        throw new common_1.InternalServerErrorException(`Aggregate query failed for ${model.name}`);
    }
}
async function buildGroupedAggregate(model, groupBy, aggregates, where, having, transaction) {
    const logger = new common_1.Logger('AdvancedAggregates::buildGroupedAggregate');
    try {
        const attributes = [...groupBy];
        aggregates.forEach(agg => {
            const aggregateFn = (0, sequelize_1.fn)(agg.type, agg.field ? (0, sequelize_1.col)(agg.field) : (0, sequelize_1.col)('*'));
            attributes.push([aggregateFn, agg.alias]);
        });
        const results = await model.findAll({
            attributes,
            where,
            group: groupBy,
            having,
            transaction,
            raw: true,
        });
        logger.log(`Grouped aggregate query executed for ${model.name}: ${results.length} groups`);
        return results;
    }
    catch (error) {
        logger.error(`Grouped aggregate query failed for ${model.name}`, error);
        throw new common_1.InternalServerErrorException(`Grouped aggregate query failed for ${model.name}`);
    }
}
async function buildWindowFunctionQuery(model, windowFunction, where, transaction) {
    const logger = new common_1.Logger('AdvancedAggregates::buildWindowFunctionQuery');
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
        const windowFn = (0, sequelize_1.literal)(`${windowFunction.function}() OVER (${partitionClause} ORDER BY ${orderClause})`);
        const results = await model.findAll({
            attributes: {
                include: [[windowFn, windowFunction.alias]]
            },
            where,
            transaction,
            raw: true,
        });
        logger.log(`Window function query executed for ${model.name}: ${results.length} records`);
        return results;
    }
    catch (error) {
        logger.error(`Window function query failed for ${model.name}`, error);
        throw new common_1.InternalServerErrorException(`Window function query failed for ${model.name}`);
    }
}
async function buildStatisticalAggregate(model, field, where, transaction) {
    const logger = new common_1.Logger('AdvancedAggregates::buildStatisticalAggregate');
    try {
        const result = await model.findOne({
            attributes: [
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)(field)), 'count'],
                [(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)(field)), 'sum'],
                [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)(field)), 'avg'],
                [(0, sequelize_1.fn)('MIN', (0, sequelize_1.col)(field)), 'min'],
                [(0, sequelize_1.fn)('MAX', (0, sequelize_1.col)(field)), 'max'],
                [(0, sequelize_1.fn)('STDDEV', (0, sequelize_1.col)(field)), 'stddev'],
                [(0, sequelize_1.fn)('VAR_SAMP', (0, sequelize_1.col)(field)), 'variance'],
            ],
            where,
            transaction,
            raw: true,
        });
        const stats = result;
        const aggregateResult = {
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
    }
    catch (error) {
        logger.error(`Statistical aggregate failed for ${model.name}.${field}`, error);
        throw new common_1.InternalServerErrorException(`Statistical aggregate failed for ${model.name}.${field}`);
    }
}
async function buildPercentileQuery(sequelize, model, field, percentiles, where, transaction) {
    const logger = new common_1.Logger('AdvancedAggregates::buildPercentileQuery');
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
        const percentileMap = new Map();
        percentiles.forEach(p => {
            percentileMap.set(p, parseFloat(results[`p${p}`]));
        });
        logger.log(`Percentile calculation completed for ${model.name}.${field}: ${percentiles.join(', ')}`);
        return percentileMap;
    }
    catch (error) {
        logger.error(`Percentile calculation failed for ${model.name}.${field}`, error);
        throw new common_1.InternalServerErrorException(`Percentile calculation failed for ${model.name}.${field}`);
    }
}
async function buildRollingAggregate(model, field, aggregateType, windowSize, orderBy, where, transaction) {
    const logger = new common_1.Logger('AdvancedAggregates::buildRollingAggregate');
    try {
        const orderClause = orderBy
            .map(order => {
            if (Array.isArray(order)) {
                return `"${order[0]}" ${order[1] || 'ASC'}`;
            }
            return `"${order}" ASC`;
        })
            .join(', ');
        const windowFn = (0, sequelize_1.literal)(`${aggregateType}("${field}") OVER (ORDER BY ${orderClause} ROWS ${windowSize - 1} PRECEDING)`);
        const results = await model.findAll({
            attributes: {
                include: [[windowFn, `rolling_${aggregateType.toLowerCase()}`]]
            },
            where,
            order: orderBy,
            transaction,
            raw: true,
        });
        logger.log(`Rolling ${aggregateType} query executed for ${model.name}.${field}: ${results.length} records`);
        return results;
    }
    catch (error) {
        logger.error(`Rolling aggregate failed for ${model.name}.${field}`, error);
        throw new common_1.InternalServerErrorException(`Rolling aggregate failed for ${model.name}.${field}`);
    }
}
async function buildCumulativeAggregate(model, field, aggregateType, orderBy, partitionBy, where, transaction) {
    const logger = new common_1.Logger('AdvancedAggregates::buildCumulativeAggregate');
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
        const windowFn = (0, sequelize_1.literal)(`${aggregateType}("${field}") OVER (${partitionClause} ORDER BY ${orderClause} ROWS UNBOUNDED PRECEDING)`);
        const results = await model.findAll({
            attributes: {
                include: [[windowFn, `cumulative_${aggregateType.toLowerCase()}`]]
            },
            where,
            order: orderBy,
            transaction,
            raw: true,
        });
        logger.log(`Cumulative ${aggregateType} query executed for ${model.name}.${field}: ${results.length} records`);
        return results;
    }
    catch (error) {
        logger.error(`Cumulative aggregate failed for ${model.name}.${field}`, error);
        throw new common_1.InternalServerErrorException(`Cumulative aggregate failed for ${model.name}.${field}`);
    }
}
exports.AdvancedAggregates = {
    buildAggregateQuery,
    buildGroupedAggregate,
    buildWindowFunctionQuery,
    buildStatisticalAggregate,
    buildPercentileQuery,
    buildRollingAggregate,
    buildCumulativeAggregate,
};
//# sourceMappingURL=advanced-aggregates.service.js.map