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
var QueryBus_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBus = void 0;
const common_1 = require("@nestjs/common");
let QueryBus = QueryBus_1 = class QueryBus {
    cacheManager;
    logger = new common_1.Logger(QueryBus_1.name);
    handlers = new Map();
    cache = new Map();
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    registerHandler(queryType, handler) {
        this.handlers.set(queryType, handler);
        this.logger.log(`Registered query handler for: ${queryType}`);
    }
    async execute(query) {
        const startTime = Date.now();
        const correlationId = this.generateCorrelationId();
        try {
            this.logger.debug(`Executing query: ${query.type}`, {
                correlationId,
                queryType: query.type
            });
            const handler = this.handlers.get(query.type);
            if (!handler) {
                throw new Error(`No handler registered for query: ${query.type}`);
            }
            const cacheKey = this.generateCacheKey(query);
            const cachedResult = await this.getCachedResult(cacheKey);
            if (cachedResult) {
                this.logger.debug(`Query result served from cache: ${query.type}`, {
                    correlationId,
                    cacheKey
                });
                return {
                    ...cachedResult,
                    correlationId
                };
            }
            const result = await handler.execute(query);
            const executionTime = Date.now() - startTime;
            if (result.success && this.shouldCache(query)) {
                await this.setCachedResult(cacheKey, result, this.getCacheTTL(query));
            }
            this.logger.debug(`Query executed successfully: ${query.type}`, {
                correlationId,
                executionTime,
                success: result.success,
                cached: false
            });
            return {
                ...result,
                correlationId
            };
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            this.logger.error(`Query execution failed: ${query.type}`, {
                correlationId,
                executionTime,
                error: error.message,
                stack: error.stack
            });
            return {
                success: false,
                error: error.message,
                correlationId
            };
        }
    }
    async clearCache(queryTypes) {
        if (queryTypes) {
            for (const queryType of queryTypes) {
                const pattern = `query:${queryType}:*`;
                this.logger.log(`Clearing cache for query type: ${queryType}`);
            }
        }
        else {
            this.cache.clear();
            this.logger.log('Cleared all query cache');
        }
    }
    getRegisteredQueries() {
        return Array.from(this.handlers.keys());
    }
    hasHandler(queryType) {
        return this.handlers.has(queryType);
    }
    getCacheStats() {
        return { hits: 0, misses: 0, hitRate: 0 };
    }
    generateCacheKey(query) {
        return `query:${query.type}:${JSON.stringify(query)}`;
    }
    async getCachedResult(cacheKey) {
        if (this.cacheManager) {
            try {
                const cached = await this.cacheManager.get(cacheKey);
                if (cached) {
                    return JSON.parse(cached);
                }
            }
            catch (error) {
                this.logger.warn(`Cache read error for key ${cacheKey}:`, error);
            }
        }
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
            return cached.result;
        }
        return null;
    }
    async setCachedResult(cacheKey, result, ttl) {
        if (this.cacheManager) {
            try {
                await this.cacheManager.set(cacheKey, JSON.stringify(result), ttl / 1000);
            }
            catch (error) {
                this.logger.warn(`Cache write error for key ${cacheKey}:`, error);
            }
        }
        this.cache.set(cacheKey, {
            result,
            timestamp: Date.now(),
            ttl
        });
    }
    shouldCache(query) {
        return !query.type.includes('Create') &&
            !query.type.includes('Update') &&
            !query.type.includes('Delete');
    }
    getCacheTTL(query) {
        const ttlMap = {
            'GetPatient': 10 * 60 * 1000,
            'GetMedication': 5 * 60 * 1000,
            'GetAppointment': 2 * 60 * 1000,
        };
        return ttlMap[query.type] || 5 * 60 * 1000;
    }
    generateCorrelationId() {
        return `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};
exports.QueryBus = QueryBus;
exports.QueryBus = QueryBus = QueryBus_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)('CACHE_MANAGER')),
    __metadata("design:paramtypes", [Object])
], QueryBus);
//# sourceMappingURL=query-bus.js.map