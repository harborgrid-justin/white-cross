"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Optimization = void 0;
exports.buildPaginatedQuery = buildPaginatedQuery;
exports.buildOptimizedQuery = buildOptimizedQuery;
exports.buildDynamicQuery = buildDynamicQuery;
exports.buildBatchQuery = buildBatchQuery;
exports.optimizeQuery = optimizeQuery;
exports.buildJSONQuery = buildJSONQuery;
exports.buildArrayQuery = buildArrayQuery;
exports.buildSpatialQuery = buildSpatialQuery;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const interfaces_1 = require("./interfaces");
async function buildPaginatedQuery(model, options, pagination) {
    const logger = new common_1.Logger('Optimization::buildPaginatedQuery');
    try {
        const { rows: data, count: total } = await model.findAndCountAll({
            ...options,
            limit: pagination.limit,
            offset: pagination.offset ?? (pagination.page - 1) * pagination.limit,
            distinct: true,
        });
        const totalPages = Math.ceil(total / pagination.limit);
        const result = {
            data,
            pagination: {
                total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages,
                hasNext: pagination.page < totalPages,
                hasPrev: pagination.page > 1,
            },
        };
        logger.log(`Paginated query executed for ${model.name}: page ${pagination.page}, ${data.length}/${total} records`);
        return result;
    }
    catch (error) {
        logger.error(`Paginated query failed for ${model.name}`, error);
        throw new common_1.InternalServerErrorException(`Paginated query failed for ${model.name}`);
    }
}
function buildOptimizedQuery(config) {
    const options = {
        where: config.where,
        include: config.include,
        order: config.order,
        limit: config.limit,
        offset: config.offset,
        transaction: config.transaction,
    };
    if (config.include && config.include.length > 0) {
        options.subQuery = config.subQuery ?? false;
    }
    if (config.distinct !== undefined) {
        options.distinct = config.distinct;
    }
    else if (config.include &&
        config.include.length > 0 &&
        (config.limit || config.offset !== undefined)) {
        options.distinct = true;
    }
    if (config.attributes) {
        options.attributes = config.attributes;
    }
    if (config.group) {
        options.group = config.group;
    }
    if (config.having) {
        options.having = config.having;
    }
    return options;
}
function buildDynamicQuery(model, params) {
    const options = {};
    const whereConditions = [];
    if (params.filters && params.filters.length > 0) {
        whereConditions.push(buildWhereClause(params.filters));
    }
    if (params.search && params.search.term && params.search.fields.length > 0) {
        whereConditions.push(buildFullTextSearch(params.search.term, params.search.fields));
    }
    if (whereConditions.length > 0) {
        options.where = buildLogicalWhere(whereConditions, 'AND');
    }
    if (params.sort && params.sort.length > 0) {
        options.order = buildOrderClause(params.sort);
    }
    if (params.page && params.limit) {
        const pagination = buildPagination(params.page, params.limit);
        options.limit = pagination.limit;
        options.offset = pagination.offset;
    }
    if (params.include && params.include.length > 0) {
        options.include = params.include.map((assoc) => ({
            association: assoc,
            required: false,
        }));
    }
    return options;
}
async function buildBatchQuery(model, ids, config = {}) {
    const logger = new common_1.Logger('Optimization::buildBatchQuery');
    try {
        const { batchSize = 100, includeOptions, transaction } = config;
        const recordMap = new Map();
        for (let i = 0; i < ids.length; i += batchSize) {
            const batchIds = ids.slice(i, i + batchSize);
            const records = await model.findAll({
                where: { id: { [sequelize_1.Op.in]: batchIds } },
                include: includeOptions,
                transaction,
            });
            records.forEach((record) => {
                recordMap.set(record.id, record);
            });
        }
        logger.log(`Batch query executed for ${model.name}: ${recordMap.size}/${ids.length} records found`);
        return recordMap;
    }
    catch (error) {
        logger.error(`Batch query failed for ${model.name}`, error);
        throw new common_1.InternalServerErrorException(`Batch query failed for ${model.name}`);
    }
}
function optimizeQuery(options, optimization) {
    const optimized = { ...options };
    if (optimization.disableSubQuery) {
        optimized.subQuery = false;
    }
    if (optimization.limitIncludes && optimized.include) {
        optimized.include = optimized.include.map((inc) => ({
            ...inc,
            attributes: inc.attributes || ['id'],
        }));
    }
    return optimized;
}
function buildJSONQuery(field, path, operator, value) {
    const jsonPath = `${field}->'${path}'`;
    switch (operator) {
        case interfaces_1.FilterOperator.EQ:
            return (0, sequelize_1.where)((0, sequelize_1.literal)(jsonPath), value);
        case interfaces_1.FilterOperator.CONTAINS:
            return { [field]: { [sequelize_1.Op.contains]: value } };
        case interfaces_1.FilterOperator.CONTAINED:
            return { [field]: { [sequelize_1.Op.contained]: value } };
        default:
            return (0, sequelize_1.where)((0, sequelize_1.literal)(jsonPath), { [sequelize_1.Op.eq]: value });
    }
}
function buildArrayQuery(field, operator, value) {
    switch (operator) {
        case 'contains':
            return { [field]: { [sequelize_1.Op.contains]: value } };
        case 'contained':
            return { [field]: { [sequelize_1.Op.contained]: value } };
        case 'overlap':
            return { [field]: { [sequelize_1.Op.overlap]: value } };
        case 'any':
            return { [field]: { [sequelize_1.Op.any]: value } };
        default:
            return { [field]: value };
    }
}
function buildSpatialQuery(field, operator, value, distance) {
    switch (operator) {
        case 'intersects':
            return (0, sequelize_1.where)((0, sequelize_1.fn)('ST_Intersects', (0, sequelize_1.col)(field), (0, sequelize_1.fn)('ST_GeomFromGeoJSON', value)), true);
        case 'contains':
            return (0, sequelize_1.where)((0, sequelize_1.fn)('ST_Contains', (0, sequelize_1.col)(field), (0, sequelize_1.fn)('ST_GeomFromGeoJSON', value)), true);
        case 'within':
            return (0, sequelize_1.where)((0, sequelize_1.fn)('ST_Within', (0, sequelize_1.col)(field), (0, sequelize_1.fn)('ST_GeomFromGeoJSON', value)), true);
        case 'distance':
            return (0, sequelize_1.where)((0, sequelize_1.fn)('ST_DWithin', (0, sequelize_1.col)(field), (0, sequelize_1.fn)('ST_GeomFromGeoJSON', value), distance || 1000), true);
        default:
            throw new common_1.BadRequestException(`Unknown spatial operator: ${operator}`);
    }
}
function buildWhereClause(filters) {
    const logger = new common_1.Logger('Optimization::buildWhereClause');
    const where = {};
    filters.forEach((filter) => {
        try {
            const { field, operator, value, caseSensitive } = filter;
            switch (operator) {
                case interfaces_1.FilterOperator.EQ:
                    where[field] = value;
                    break;
                case interfaces_1.FilterOperator.NE:
                    where[field] = { [sequelize_1.Op.ne]: value };
                    break;
                case interfaces_1.FilterOperator.GT:
                    where[field] = { [sequelize_1.Op.gt]: value };
                    break;
                case interfaces_1.FilterOperator.GTE:
                    where[field] = { [sequelize_1.Op.gte]: value };
                    break;
                case interfaces_1.FilterOperator.LT:
                    where[field] = { [sequelize_1.Op.lt]: value };
                    break;
                case interfaces_1.FilterOperator.LTE:
                    where[field] = { [sequelize_1.Op.lte]: value };
                    break;
                case interfaces_1.FilterOperator.IN:
                    where[field] = { [sequelize_1.Op.in]: value };
                    break;
                case interfaces_1.FilterOperator.NOT_IN:
                    where[field] = { [sequelize_1.Op.notIn]: value };
                    break;
                case interfaces_1.FilterOperator.LIKE:
                    where[field] = caseSensitive ? { [sequelize_1.Op.like]: value } : { [sequelize_1.Op.iLike]: value };
                    break;
                case interfaces_1.FilterOperator.ILIKE:
                    where[field] = { [sequelize_1.Op.iLike]: value };
                    break;
                case interfaces_1.FilterOperator.NOT_LIKE:
                    where[field] = { [sequelize_1.Op.notLike]: value };
                    break;
                case interfaces_1.FilterOperator.BETWEEN:
                    where[field] = { [sequelize_1.Op.between]: value };
                    break;
                case interfaces_1.FilterOperator.IS_NULL:
                    where[field] = { [sequelize_1.Op.is]: null };
                    break;
                case interfaces_1.FilterOperator.NOT_NULL:
                    where[field] = { [sequelize_1.Op.not]: null };
                    break;
                case interfaces_1.FilterOperator.CONTAINS:
                    where[field] = { [sequelize_1.Op.contains]: value };
                    break;
                case interfaces_1.FilterOperator.CONTAINED:
                    where[field] = { [sequelize_1.Op.contained]: value };
                    break;
                case interfaces_1.FilterOperator.OVERLAP:
                    where[field] = { [sequelize_1.Op.overlap]: value };
                    break;
                case interfaces_1.FilterOperator.REGEXP:
                    where[field] = { [sequelize_1.Op.regexp]: value };
                    break;
                default:
                    logger.warn(`Unknown filter operator: ${operator}`);
            }
        }
        catch (error) {
            logger.error(`Failed to build filter for field ${filter.field}`, error);
        }
    });
    return where;
}
function buildLogicalWhere(conditions, operator = 'AND') {
    if (conditions.length === 0) {
        return {};
    }
    if (conditions.length === 1) {
        return conditions[0];
    }
    const op = operator === 'AND' ? sequelize_1.Op.and : sequelize_1.Op.or;
    return { [op]: conditions };
}
function buildFullTextSearch(searchTerm, fields, caseSensitive = false) {
    if (!searchTerm || fields.length === 0) {
        return {};
    }
    const searchPattern = `%${searchTerm}%`;
    const operator = caseSensitive ? sequelize_1.Op.like : sequelize_1.Op.iLike;
    return {
        [sequelize_1.Op.or]: fields.map((field) => ({
            [field]: { [operator]: searchPattern },
        })),
    };
}
function buildOrderClause(sorts) {
    return sorts.map((sort) => {
        const orderItem = [sort.field, sort.direction];
        if (sort.nulls) {
            return [...orderItem, `NULLS ${sort.nulls}`];
        }
        return orderItem;
    });
}
function buildPagination(page, limit) {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(limit, 1000));
    return {
        page: validPage,
        limit: validLimit,
        offset: (validPage - 1) * validLimit,
    };
}
exports.Optimization = {
    buildPaginatedQuery,
    buildOptimizedQuery,
    buildDynamicQuery,
    buildBatchQuery,
    optimizeQuery,
    buildJSONQuery,
    buildArrayQuery,
    buildSpatialQuery,
};
//# sourceMappingURL=optimization.service.js.map