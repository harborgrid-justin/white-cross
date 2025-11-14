"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
exports.createPaginationMetadata = createPaginationMetadata;
exports.calculateSkip = calculateSkip;
function createPaginationMetadata(page, limit, total) {
    const pages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrevious: page > 1,
    };
}
function calculateSkip(page, limit) {
    return (page - 1) * limit;
}
class QueryBuilder {
    criteria;
    options;
    constructor() {
        this.criteria = {
            where: {},
        };
        this.options = {};
    }
    where(conditions) {
        this.criteria.where = conditions;
        return this;
    }
    orderBy(orderBy) {
        this.criteria.orderBy = orderBy;
        return this;
    }
    paginate(page, limit) {
        this.criteria.pagination = {
            page,
            limit,
            skip: calculateSkip(page, limit),
        };
        return this;
    }
    include(include) {
        this.options.include = include;
        return this;
    }
    select(select) {
        this.options.select = select;
        return this;
    }
    cache(key, ttl) {
        this.options.cacheKey = key;
        this.options.cacheTTL = ttl;
        return this;
    }
    build() {
        return {
            criteria: this.criteria,
            options: this.options,
        };
    }
}
exports.QueryBuilder = QueryBuilder;
//# sourceMappingURL=query.types.js.map