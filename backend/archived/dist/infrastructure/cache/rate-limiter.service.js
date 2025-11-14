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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiterService = void 0;
const common_1 = require("@nestjs/common");
const cache_service_1 = require("./cache.service");
const base_1 = require("../../common/base");
let RateLimiterService = class RateLimiterService extends base_1.BaseService {
    cacheService;
    configs = new Map();
    stats = {
        totalRequests: 0,
        limitedRequests: 0,
        uniqueKeys: new Set(),
    };
    constructor(cacheService) {
        super("RateLimiterService");
        this.cacheService = cacheService;
    }
    registerConfig(name, config) {
        this.configs.set(name, config);
        this.logInfo(`Registered rate limit config: ${name} (${config.max} requests per ${config.windowMs}ms)`);
    }
    async checkLimit(configName, context) {
        const config = this.configs.get(configName);
        if (!config) {
            this.logWarning(`Rate limit config not found: ${configName}`);
            return this.allowRequest();
        }
        if (config.skip && config.skip(context)) {
            return this.allowRequest();
        }
        const key = this.buildRateLimitKey(configName, config.keyGenerator(context));
        this.stats.totalRequests++;
        this.stats.uniqueKeys.add(key);
        const windowData = await this.getWindowData(key, config);
        if (windowData.count >= config.max) {
            this.stats.limitedRequests++;
            if (config.handler) {
                try {
                    await config.handler(context);
                }
                catch (error) {
                    this.logError('Rate limit handler error:', error);
                }
            }
            return {
                limited: true,
                remaining: 0,
                limit: config.max,
                resetAt: windowData.resetAt,
                retryAfter: Math.ceil((windowData.resetAt - Date.now()) / 1000),
            };
        }
        await this.incrementCounter(key, config);
        return {
            limited: false,
            remaining: config.max - windowData.count - 1,
            limit: config.max,
            resetAt: windowData.resetAt,
            retryAfter: 0,
        };
    }
    async consumeTokens(configName, identifier, tokens = 1) {
        const config = this.configs.get(configName);
        if (!config) {
            return true;
        }
        const key = this.buildRateLimitKey(configName, identifier);
        const windowData = await this.getWindowData(key, config);
        if (windowData.count + tokens > config.max) {
            return false;
        }
        await this.incrementCounter(key, config, tokens);
        return true;
    }
    async getRemainingTokens(configName, identifier) {
        const config = this.configs.get(configName);
        if (!config) {
            return Number.MAX_SAFE_INTEGER;
        }
        const key = this.buildRateLimitKey(configName, identifier);
        const windowData = await this.getWindowData(key, config);
        return Math.max(0, config.max - windowData.count);
    }
    async reset(configName, identifier) {
        const key = this.buildRateLimitKey(configName, identifier);
        await this.cacheService.delete(key);
    }
    getStats() {
        const limitRate = this.stats.totalRequests > 0
            ? (this.stats.limitedRequests / this.stats.totalRequests) * 100
            : 0;
        return {
            totalRequests: this.stats.totalRequests,
            limitedRequests: this.stats.limitedRequests,
            limitRate: Math.round(limitRate * 100) / 100,
            uniqueKeys: this.stats.uniqueKeys.size,
            configurations: this.configs.size,
        };
    }
    resetStats() {
        this.stats = {
            totalRequests: 0,
            limitedRequests: 0,
            uniqueKeys: new Set(),
        };
    }
    buildRateLimitKey(configName, identifier) {
        return `ratelimit:${configName}:${identifier}`;
    }
    async getWindowData(key, config) {
        const now = Date.now();
        const windowKey = `${key}:${Math.floor(now / config.windowMs)}`;
        const count = await this.cacheService.get(windowKey);
        const resetAt = Math.ceil(now / config.windowMs) * config.windowMs;
        return {
            count: count || 0,
            resetAt,
        };
    }
    async incrementCounter(key, config, amount = 1) {
        const now = Date.now();
        const windowKey = `${key}:${Math.floor(now / config.windowMs)}`;
        const ttl = Math.ceil(config.windowMs / 1000) + 1;
        try {
            const current = await this.cacheService.get(windowKey);
            const newCount = (current || 0) + amount;
            await this.cacheService.set(windowKey, newCount, { ttl });
        }
        catch (error) {
            this.logError('Failed to increment rate limit counter:', error);
        }
    }
    allowRequest() {
        return {
            limited: false,
            remaining: Number.MAX_SAFE_INTEGER,
            limit: Number.MAX_SAFE_INTEGER,
            resetAt: Date.now() + 60000,
            retryAfter: 0,
        };
    }
};
exports.RateLimiterService = RateLimiterService;
exports.RateLimiterService = RateLimiterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], RateLimiterService);
//# sourceMappingURL=rate-limiter.service.js.map