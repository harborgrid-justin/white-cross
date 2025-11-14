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
const base_1 = require("../../../common/base");
let RateLimiterService = class RateLimiterService extends base_1.BaseService {
    buckets = new Map();
    configs = new Map();
    CLEANUP_INTERVAL = 5 * 60 * 1000;
    ENTRY_TTL = 30 * 60 * 1000;
    constructor() {
        super('RateLimiterService');
        this.initializeConfigs();
        this.startCleanup();
    }
    async checkLimit(userId, eventType) {
        const key = this.getBucketKey(userId, eventType);
        const config = this.getConfig(eventType);
        if (!config) {
            this.logWarning(`No rate limit config for event type: ${eventType}`);
            return true;
        }
        let bucket = this.buckets.get(key);
        if (!bucket) {
            bucket = {
                tokens: config.maxTokens,
                lastRefill: Date.now(),
                lastAccess: Date.now(),
            };
            this.buckets.set(key, bucket);
        }
        this.refillTokens(bucket, config);
        bucket.lastAccess = Date.now();
        if (bucket.tokens >= 1) {
            bucket.tokens -= 1;
            return true;
        }
        else {
            this.logWarning(`Rate limit exceeded for user ${userId} on event ${eventType}`);
            return false;
        }
    }
    getTokenCount(userId, eventType) {
        const key = this.getBucketKey(userId, eventType);
        const bucket = this.buckets.get(key);
        if (!bucket) {
            const config = this.getConfig(eventType);
            return config?.maxTokens || 0;
        }
        const config = this.getConfig(eventType);
        if (config) {
            this.refillTokens(bucket, config);
        }
        return Math.floor(bucket.tokens);
    }
    reset(userId) {
        const keysToDelete = [];
        for (const key of this.buckets.keys()) {
            if (key.startsWith(`${userId}:`)) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach((key) => this.buckets.delete(key));
        this.logInfo(`Rate limits reset for user ${userId}`);
    }
    getConfig(eventType) {
        return this.configs.get(eventType);
    }
    refillTokens(bucket, config) {
        const now = Date.now();
        const elapsed = now - bucket.lastRefill;
        const intervals = Math.floor(elapsed / config.refillInterval);
        if (intervals > 0) {
            const tokensToAdd = intervals * config.refillRate;
            bucket.tokens = Math.min(bucket.tokens + tokensToAdd, config.maxTokens);
            bucket.lastRefill = now;
        }
    }
    getBucketKey(userId, eventType) {
        return `${userId}:${eventType}`;
    }
    initializeConfigs() {
        this.configs.set('message:send', {
            maxTokens: 10,
            refillRate: 1,
            refillInterval: 6000,
        });
        this.configs.set('message:typing', {
            maxTokens: 5,
            refillRate: 1,
            refillInterval: 2000,
        });
        this.configs.set('message:edit', {
            maxTokens: 3,
            refillRate: 1,
            refillInterval: 20000,
        });
        this.configs.set('message:delete', {
            maxTokens: 3,
            refillRate: 1,
            refillInterval: 20000,
        });
        this.configs.set('conversation:join', {
            maxTokens: 20,
            refillRate: 1,
            refillInterval: 3000,
        });
        this.logInfo('Rate limit configurations initialized');
    }
    startCleanup() {
        setInterval(() => {
            this.cleanup();
        }, this.CLEANUP_INTERVAL);
        this.logInfo('Rate limiter cleanup scheduler started');
    }
    cleanup() {
        const now = Date.now();
        const keysToDelete = [];
        for (const [key, bucket] of this.buckets.entries()) {
            if (now - bucket.lastAccess > this.ENTRY_TTL) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach((key) => this.buckets.delete(key));
        if (keysToDelete.length > 0) {
            this.logDebug(`Cleaned up ${keysToDelete.length} stale rate limit entries`);
        }
    }
    getStats() {
        return {
            totalBuckets: this.buckets.size,
            eventTypes: Array.from(this.configs.keys()),
        };
    }
};
exports.RateLimiterService = RateLimiterService;
exports.RateLimiterService = RateLimiterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RateLimiterService);
//# sourceMappingURL=rate-limiter.service.js.map