"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWhereClause = buildWhereClause;
exports.buildLogicalWhere = buildLogicalWhere;
exports.buildDateRangeFilter = buildDateRangeFilter;
exports.buildFullTextSearch = buildFullTextSearch;
exports.buildPagination = buildPagination;
exports.buildCursorPagination = buildCursorPagination;
exports.buildOrderClause = buildOrderClause;
exports.buildAttributes = buildAttributes;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const interfaces_1 = require("./interfaces");
function buildWhereClause(filters) {
    const logger = new common_1.Logger('QueryBuilder::buildWhereClause');
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
                    where[field] = caseSensitive
                        ? { [sequelize_1.Op.like]: value }
                        : { [sequelize_1.Op.iLike]: value };
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
function buildDateRangeFilter(field, startDate, endDate) {
    const where = {};
    if (startDate && endDate) {
        where[field] = { [sequelize_1.Op.between]: [startDate, endDate] };
    }
    else if (startDate) {
        where[field] = { [sequelize_1.Op.gte]: startDate };
    }
    else if (endDate) {
        where[field] = { [sequelize_1.Op.lte]: endDate };
    }
    return where;
}
function buildFullTextSearch(searchTerm, fields, caseSensitive = false) {
    if (!searchTerm || fields.length === 0) {
        return {};
    }
    const searchPattern = `%${searchTerm}%`;
    const operator = caseSensitive ? sequelize_1.Op.like : sequelize_1.Op.iLike;
    return {
        [sequelize_1.Op.or]: fields.map((field) => ({
            [field]: { [operator]: searchPattern }
        }))
    };
}
function buildPagination(page, limit) {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(limit, 1000));
    return {
        page: validPage,
        limit: validLimit,
        offset: (validPage - 1) * validLimit
    };
}
function buildCursorPagination(cursor, cursorField, direction = 'next', limit = 20) {
    const where = {};
    const order = [];
    if (cursor) {
        where[cursorField] = direction === 'next'
            ? { [sequelize_1.Op.gt]: cursor }
            : { [sequelize_1.Op.lt]: cursor };
    }
    order.push([cursorField, direction === 'next' ? 'ASC' : 'DESC']);
    return { where, limit: limit + 1, order };
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
function buildAttributes(include, exclude) {
    if (!include && !exclude) {
        return [];
    }
    const attributes = {};
    if (include) {
        return include;
    }
    if (exclude) {
        attributes.exclude = exclude;
    }
    return attributes;
}
//# sourceMappingURL=basic-builders.service.js.map