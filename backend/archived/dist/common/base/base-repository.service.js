"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepositoryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const base_service_1 = require("./base.service");
let BaseRepositoryService = class BaseRepositoryService extends base_service_1.BaseService {
    sequelize;
    cache = new Map();
    metrics = {
        queriesExecuted: 0,
        cacheHits: 0,
        cacheMisses: 0,
        averageQueryTime: 0,
    };
    constructor(sequelize, context) {
        super(context);
        this.sequelize = sequelize;
    }
    async executeQuery(operation, queryFn, cacheOptions = {}) {
        const startTime = Date.now();
        const cacheKey = cacheOptions.key || `${this.model.name}:${operation}:${Date.now()}`;
        if (cacheOptions.enabled !== false && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (cached.expiry > new Date()) {
                this.metrics.cacheHits++;
                this.logDebug(`Cache hit for ${operation}`);
                return cached.data;
            }
            else {
                this.cache.delete(cacheKey);
            }
        }
        try {
            const result = await queryFn();
            const queryTime = Date.now() - startTime;
            this.metrics.queriesExecuted++;
            this.metrics.cacheMisses++;
            this.metrics.averageQueryTime =
                (this.metrics.averageQueryTime * (this.metrics.queriesExecuted - 1) + queryTime) /
                    this.metrics.queriesExecuted;
            if (cacheOptions.enabled !== false && cacheOptions.ttl) {
                const expiry = new Date();
                expiry.setSeconds(expiry.getSeconds() + (cacheOptions.ttl || 300));
                this.cache.set(cacheKey, { data: result, expiry });
            }
            this.logDebug(`Query ${operation} executed in ${queryTime}ms`);
            return result;
        }
        catch (error) {
            this.logError(`Query ${operation} failed`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
    }
    async findWithOptimization(options = {}, cacheOptions = {}, queryOpt = {}) {
        return this.executeQuery('findWithOptimization', async () => {
            let queryOptions = { ...options };
            if (queryOpt.selectFields && queryOpt.selectFields.length > 0) {
                queryOptions.attributes = queryOpt.selectFields;
            }
            if (queryOpt.enableEagerLoading && !queryOptions.include) {
                queryOptions = this.addEagerLoading(queryOptions, queryOpt.maxDepth || 2);
            }
            return await this.model.findAll(queryOptions);
        }, cacheOptions);
    }
    async executeBatchOperation(operation, batchFn, useTransaction = true) {
        return this.executeWithLogging(`batch ${operation}`, async () => {
            if (useTransaction && this.sequelize) {
                return await this.sequelize.transaction(async (transaction) => {
                    return await batchFn(transaction);
                });
            }
            else {
                return await batchFn(null);
            }
        });
    }
    async bulkUpsert(records, options = {}) {
        return this.executeBatchOperation('bulkUpsert', async (transaction) => {
            const results = { created: 0, updated: 0, errors: [] };
            for (const record of records) {
                try {
                    const [instance, created] = await this.model.upsert(record, {
                        ...options,
                        transaction,
                        returning: true,
                    });
                    if (created) {
                        results.created++;
                    }
                    else {
                        results.updated++;
                    }
                }
                catch (error) {
                    results.errors.push({
                        record,
                        error: error.message,
                    });
                }
            }
            this.logInfo(`Bulk upsert completed: ${results.created} created, ${results.updated} updated, ${results.errors.length} errors`);
            return results;
        });
    }
    async findWithComplexFilters(filters, pagination, sorting) {
        return this.executeQuery('findWithComplexFilters', async () => {
            const whereClause = this.buildWhereClause(filters);
            const orderClause = sorting.map((sort) => [sort.field, sort.direction]);
            const { page, limit } = pagination;
            const offset = (page - 1) * limit;
            const { rows, count } = await this.model.findAndCountAll({
                where: whereClause,
                order: orderClause,
                limit,
                offset,
                distinct: true,
            });
            return {
                rows,
                count,
                metadata: {
                    currentPage: page,
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    itemsPerPage: limit,
                    appliedFilters: Object.keys(filters),
                    sortingFields: sorting.map((s) => s.field),
                },
            };
        }, {
            enabled: true,
            ttl: 300,
            key: `complex:${JSON.stringify({ filters, pagination, sorting })}`,
        });
    }
    buildWhereClause(filters) {
        const where = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                return;
            }
            if (typeof value === 'string') {
                where[key] = { [sequelize_1.Op.iLike]: `%${value}%` };
            }
            else if (Array.isArray(value)) {
                where[key] = { [sequelize_1.Op.in]: value };
            }
            else if (typeof value === 'object' && value.from && value.to) {
                where[key] = { [sequelize_1.Op.between]: [value.from, value.to] };
            }
            else {
                where[key] = value;
            }
        });
        return where;
    }
    addEagerLoading(options, maxDepth) {
        return options;
    }
    clearCache(pattern) {
        if (pattern) {
            const keysToDelete = Array.from(this.cache.keys()).filter((key) => key.includes(pattern));
            keysToDelete.forEach((key) => this.cache.delete(key));
            this.logDebug(`Cleared ${keysToDelete.length} cache entries matching pattern: ${pattern}`);
        }
        else {
            this.cache.clear();
            this.logDebug('Cleared all cache entries');
        }
    }
    getMetrics() {
        return { ...this.metrics };
    }
    resetMetrics() {
        Object.assign(this.metrics, {
            queriesExecuted: 0,
            cacheHits: 0,
            cacheMisses: 0,
            averageQueryTime: 0,
        });
    }
};
exports.BaseRepositoryService = BaseRepositoryService;
exports.BaseRepositoryService = BaseRepositoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)('SEQUELIZE')),
    __metadata("design:paramtypes", [sequelize_1.Sequelize, String])
], BaseRepositoryService);
//# sourceMappingURL=base-repository.service.js.map