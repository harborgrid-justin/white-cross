"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActiveRecordsScope = createActiveRecordsScope;
exports.createPublishedContentScope = createPublishedContentScope;
exports.createTenantIsolationScope = createTenantIsolationScope;
exports.createPrivacyCompliantScope = createPrivacyCompliantScope;
exports.createStatusFilterScope = createStatusFilterScope;
exports.createArchivedScope = createArchivedScope;
exports.createDraftScope = createDraftScope;
exports.createRecentScope = createRecentScope;
exports.createDateRangeScope = createDateRangeScope;
exports.createTodayScope = createTodayScope;
exports.createExpiredScope = createExpiredScope;
exports.createUpcomingScope = createUpcomingScope;
exports.createSearchScope = createSearchScope;
exports.createTagFilterScope = createTagFilterScope;
exports.createCategoryFilterScope = createCategoryFilterScope;
exports.createPriceRangeScope = createPriceRangeScope;
exports.createWithAssociationsScope = createWithAssociationsScope;
exports.createHasAssociationScope = createHasAssociationScope;
exports.createAssociationCountScope = createAssociationCountScope;
exports.createSortedScope = createSortedScope;
exports.createPaginatedScope = createPaginatedScope;
exports.createPopularScope = createPopularScope;
exports.createOwnedByUserScope = createOwnedByUserScope;
exports.createRoleBasedScope = createRoleBasedScope;
exports.createPermissionBasedScope = createPermissionBasedScope;
exports.createSharedWithUserScope = createSharedWithUserScope;
exports.mergeScopes = mergeScopes;
exports.createConditionalScope = createConditionalScope;
exports.createScopeBuilder = createScopeBuilder;
exports.createOptimizedScope = createOptimizedScope;
exports.createSeparateQueryScope = createSeparateQueryScope;
exports.createCountOptimizedScope = createCountOptimizedScope;
exports.applyScopes = applyScopes;
exports.createScopeFromFindOptions = createScopeFromFindOptions;
exports.validateScope = validateScope;
exports.exportScopeDefinitions = exportScopeDefinitions;
const sequelize_1 = require("sequelize");
function createActiveRecordsScope(options = {}) {
    const where = {};
    if (options.deletedAtField) {
        where[options.deletedAtField] = null;
    }
    if (options.statusField && options.activeValue !== undefined) {
        where[options.statusField] = options.activeValue;
    }
    return {
        where: Object.keys(where).length > 0 ? where : undefined,
    };
}
function createPublishedContentScope(options = {}) {
    const where = {};
    if (options.publishedField) {
        where[options.publishedField] = { [sequelize_1.Op.lte]: new Date() };
    }
    if (options.statusField) {
        where[options.statusField] = options.statusValue || 'published';
    }
    if (options.visibilityField) {
        where[options.visibilityField] = options.visibilityValue || 'public';
    }
    return { where };
}
function createTenantIsolationScope(tenantIdField, tenantResolver) {
    return {
        where: {
            [tenantIdField]: tenantResolver(),
        },
    };
}
function createPrivacyCompliantScope(sensitiveFields) {
    return {
        attributes: {
            exclude: sensitiveFields,
        },
    };
}
function createStatusFilterScope(statusField = 'status') {
    return (status) => {
        const statuses = Array.isArray(status) ? status : [status];
        return {
            where: {
                [statusField]: statuses.length === 1 ? statuses[0] : { [sequelize_1.Op.in]: statuses },
            },
        };
    };
}
function createArchivedScope(archivedField = 'deletedAt') {
    return {
        where: {
            [archivedField]: { [sequelize_1.Op.ne]: null },
        },
    };
}
function createDraftScope(statusField = 'status', draftValue = 'draft') {
    return {
        where: {
            [statusField]: draftValue,
        },
    };
}
function createRecentScope(days = 7, timeField = 'createdAt') {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return {
        where: {
            [timeField]: { [sequelize_1.Op.gte]: cutoffDate },
        },
        order: [[timeField, 'DESC']],
    };
}
function createDateRangeScope(dateField) {
    return (startDate, endDate, inclusive = true) => {
        const operators = inclusive ? { [sequelize_1.Op.gte]: startDate, [sequelize_1.Op.lte]: endDate } : { [sequelize_1.Op.gt]: startDate, [sequelize_1.Op.lt]: endDate };
        return {
            where: {
                [dateField]: operators,
            },
        };
    };
}
function createTodayScope(dateField = 'createdAt') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
        where: {
            [dateField]: {
                [sequelize_1.Op.gte]: today,
                [sequelize_1.Op.lt]: tomorrow,
            },
        },
    };
}
function createExpiredScope(expirationField = 'expiresAt') {
    return {
        where: {
            [expirationField]: { [sequelize_1.Op.lt]: new Date() },
        },
    };
}
function createUpcomingScope(dateField, days = 7) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    return {
        where: {
            [dateField]: {
                [sequelize_1.Op.gte]: now,
                [sequelize_1.Op.lte]: future,
            },
        },
        order: [[dateField, 'ASC']],
    };
}
function createSearchScope(searchFields) {
    return (query) => {
        const conditions = searchFields.map((field) => ({
            [field]: { [sequelize_1.Op.iLike]: `%${query}%` },
        }));
        return {
            where: {
                [sequelize_1.Op.or]: conditions,
            },
        };
    };
}
function createTagFilterScope(tagField = 'tags') {
    return (tags, matchAll = false) => {
        if (matchAll) {
            return {
                where: {
                    [tagField]: { [sequelize_1.Op.contains]: tags },
                },
            };
        }
        return {
            where: {
                [tagField]: { [sequelize_1.Op.overlap]: tags },
            },
        };
    };
}
function createCategoryFilterScope(categoryField = 'categoryId') {
    return (categoryId) => {
        const ids = Array.isArray(categoryId) ? categoryId : [categoryId];
        return {
            where: {
                [categoryField]: ids.length === 1 ? ids[0] : { [sequelize_1.Op.in]: ids },
            },
        };
    };
}
function createPriceRangeScope(priceField = 'price') {
    return (minPrice, maxPrice) => {
        const where = {};
        if (minPrice !== undefined) {
            where[priceField] = { [sequelize_1.Op.gte]: minPrice };
        }
        if (maxPrice !== undefined) {
            where[priceField] = {
                ...where[priceField],
                [sequelize_1.Op.lte]: maxPrice,
            };
        }
        return { where };
    };
}
function createWithAssociationsScope(associations) {
    return (...additionalAssociations) => {
        const allAssociations = [...associations];
        for (const assoc of additionalAssociations) {
            allAssociations.push(assoc);
        }
        return {
            include: allAssociations.map((assoc) => typeof assoc === 'string' ? { association: assoc } : assoc),
        };
    };
}
function createHasAssociationScope(association, exists = true) {
    return {
        include: [
            {
                association,
                required: exists,
                attributes: [],
            },
        ],
        subQuery: false,
    };
}
function createAssociationCountScope(association) {
    return (count, operator = 'gte') => {
        const opMap = {
            eq: sequelize_1.Op.eq,
            gt: sequelize_1.Op.gt,
            gte: sequelize_1.Op.gte,
            lt: sequelize_1.Op.lt,
            lte: sequelize_1.Op.lte,
        };
        return {
            include: [
                {
                    association,
                    attributes: [],
                },
            ],
            having: sequelize_1.Sequelize.literal(`COUNT("${association}"."id") ${operator === 'eq' ? '=' : operator === 'gt' ? '>' : operator === 'gte' ? '>=' : operator === 'lt' ? '<' : '<='} ${count}`),
            group: ['id'],
            subQuery: false,
        };
    };
}
function createSortedScope(defaultField = 'createdAt', defaultDirection = 'DESC') {
    return (field, direction) => {
        return {
            order: [[field || defaultField, direction || defaultDirection]],
        };
    };
}
function createPaginatedScope(defaultPageSize = 10) {
    return (page = 1, pageSize) => {
        const limit = pageSize || defaultPageSize;
        const offset = (page - 1) * limit;
        return {
            limit,
            offset,
        };
    };
}
function createPopularScope(metricField, timeField) {
    return (days) => {
        const where = {};
        if (timeField && days) {
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);
            where[timeField] = { [sequelize_1.Op.gte]: cutoff };
        }
        return {
            where: Object.keys(where).length > 0 ? where : undefined,
            order: [[metricField, 'DESC']],
        };
    };
}
function createOwnedByUserScope(userIdField = 'userId') {
    return (userId) => {
        return {
            where: {
                [userIdField]: userId,
            },
        };
    };
}
function createRoleBasedScope(roleField = 'role') {
    return (role) => {
        const roles = Array.isArray(role) ? role : [role];
        return {
            where: {
                [roleField]: roles.length === 1 ? roles[0] : { [sequelize_1.Op.in]: roles },
            },
        };
    };
}
function createPermissionBasedScope(permissionField = 'permissions') {
    return (requiredPermissions, matchAll = false) => {
        const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
        if (matchAll) {
            return {
                where: {
                    [permissionField]: { [sequelize_1.Op.contains]: permissions },
                },
            };
        }
        return {
            where: {
                [permissionField]: { [sequelize_1.Op.overlap]: permissions },
            },
        };
    };
}
function createSharedWithUserScope(shareTableAssociation) {
    return (userId) => {
        return {
            include: [
                {
                    association: shareTableAssociation,
                    where: {
                        userId,
                    },
                    required: true,
                },
            ],
        };
    };
}
function mergeScopes(scopes, strategy = 'merge') {
    const merged = {
        where: {},
        include: [],
        attributes: undefined,
        order: [],
    };
    for (const scope of scopes) {
        if (scope.where) {
            if (strategy === 'merge') {
                merged.where = { ...merged.where, ...scope.where };
            }
            else {
                merged.where = scope.where;
            }
        }
        if (scope.include) {
            const includes = Array.isArray(scope.include) ? scope.include : [scope.include];
            merged.include.push(...includes);
        }
        if (scope.attributes) {
            merged.attributes = scope.attributes;
        }
        if (scope.order) {
            const orders = Array.isArray(scope.order[0]) ? scope.order : [scope.order];
            merged.order.push(...orders);
        }
        if (scope.limit !== undefined)
            merged.limit = scope.limit;
        if (scope.offset !== undefined)
            merged.offset = scope.offset;
        if (scope.group !== undefined)
            merged.group = scope.group;
        if (scope.having !== undefined)
            merged.having = scope.having;
        if (scope.subQuery !== undefined)
            merged.subQuery = scope.subQuery;
        if (scope.distinct !== undefined)
            merged.distinct = scope.distinct;
    }
    return merged;
}
function createConditionalScope(conditions, defaultScope) {
    return (context) => {
        for (const [condition, scope] of Object.entries(conditions)) {
            try {
                const conditionFn = new Function('context', `with (context) { return ${condition}; }`);
                if (conditionFn(context)) {
                    return scope;
                }
            }
            catch (error) {
                continue;
            }
        }
        return defaultScope || {};
    };
}
function createScopeBuilder() {
    return new ScopeBuilder();
}
class ScopeBuilder {
    scope = {};
    where(conditions) {
        this.scope.where = { ...this.scope.where, ...conditions };
        return this;
    }
    include(association) {
        if (!this.scope.include) {
            this.scope.include = [];
        }
        const includes = Array.isArray(this.scope.include) ? this.scope.include : [this.scope.include];
        includes.push(typeof association === 'string' ? { association } : association);
        this.scope.include = includes;
        return this;
    }
    attributes(attrs) {
        this.scope.attributes = attrs;
        return this;
    }
    orderBy(field, direction = 'ASC') {
        if (!this.scope.order) {
            this.scope.order = [];
        }
        const order = Array.isArray(this.scope.order) ? this.scope.order : [this.scope.order];
        order.push([field, direction]);
        this.scope.order = order;
        return this;
    }
    limit(limit) {
        this.scope.limit = limit;
        return this;
    }
    offset(offset) {
        this.scope.offset = offset;
        return this;
    }
    group(fields) {
        this.scope.group = fields;
        return this;
    }
    having(conditions) {
        this.scope.having = conditions;
        return this;
    }
    build() {
        return this.scope;
    }
}
function createOptimizedScope(options = {}) {
    const scope = {
        subQuery: options.useSubQuery,
        distinct: options.distinct,
    };
    if (options.selectOnlyIds) {
        scope.attributes = ['id'];
    }
    return scope;
}
function createSeparateQueryScope(associations) {
    return {
        include: associations.map((assoc) => ({
            association: assoc,
            separate: true,
        })),
    };
}
function createCountOptimizedScope() {
    return {
        attributes: ['id'],
        include: undefined,
        subQuery: false,
    };
}
function applyScopes(model, scopes) {
    return model.scope(scopes);
}
function createScopeFromFindOptions(findOptions) {
    return {
        where: findOptions.where,
        include: findOptions.include,
        attributes: findOptions.attributes,
        order: findOptions.order,
        limit: findOptions.limit,
        offset: findOptions.offset,
        group: findOptions.group,
        having: findOptions.having,
        subQuery: findOptions.subQuery,
    };
}
function validateScope(scope) {
    const warnings = [];
    const suggestions = [];
    if (scope.include && Array.isArray(scope.include)) {
        const hasManyCount = scope.include.filter((inc) => !inc.separate && !inc.required).length;
        if (hasManyCount > 1) {
            warnings.push('Multiple includes without separate:true may cause cartesian product');
            suggestions.push('Consider adding separate:true to hasMany associations');
        }
    }
    if (scope.include && scope.limit && scope.subQuery === undefined) {
        warnings.push('Using limit with include without explicit subQuery setting');
        suggestions.push('Set subQuery:false to avoid incorrect limit behavior');
    }
    if (!scope.attributes || (Array.isArray(scope.attributes) && scope.attributes.length === 0)) {
        suggestions.push('Consider specifying attributes to reduce data transfer');
    }
    return {
        valid: warnings.length === 0,
        warnings,
        suggestions,
    };
}
function exportScopeDefinitions(model) {
    const scopes = {};
    const modelOptions = model.options;
    if (modelOptions.scopes) {
        for (const [name, scopeDef] of Object.entries(modelOptions.scopes)) {
            scopes[name] = scopeDef;
        }
    }
    return scopes;
}
//# sourceMappingURL=model-scope-patterns.service.js.map