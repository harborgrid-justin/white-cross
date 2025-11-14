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
exports.RedisCacheManager = exports.CACHING_METADATA = void 0;
exports.CacheResult = CacheResult;
exports.CacheInvalidate = CacheInvalidate;
exports.CacheWarmup = CacheWarmup;
exports.CacheConditional = CacheConditional;
const common_1 = require("@nestjs/common");
exports.CACHING_METADATA = 'enterprise:caching';
let RedisCacheManager = class RedisCacheManager {
    redisClient;
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    async get(key) {
        try {
            const value = await this.redisClient.get(key);
            return value ? JSON.parse(value) : null;
        }
        catch (error) {
            console.warn(`Cache get error for key ${key}:`, error);
            return null;
        }
    }
    async set(key, value, ttl) {
        try {
            const serializedValue = JSON.stringify(value);
            if (ttl) {
                await this.redisClient.setex(key, ttl, serializedValue);
            }
            else {
                await this.redisClient.set(key, serializedValue);
            }
        }
        catch (error) {
            console.warn(`Cache set error for key ${key}:`, error);
        }
    }
    async del(key) {
        try {
            await this.redisClient.del(key);
        }
        catch (error) {
            console.warn(`Cache delete error for key ${key}:`, error);
        }
    }
    async delPattern(pattern) {
        try {
            const keys = await this.redisClient.keys(pattern);
            if (keys.length > 0) {
                await this.redisClient.del(keys);
            }
        }
        catch (error) {
            console.warn(`Cache delete pattern error for ${pattern}:`, error);
        }
    }
    async exists(key) {
        try {
            const result = await this.redisClient.exists(key);
            return result === 1;
        }
        catch (error) {
            console.warn(`Cache exists error for key ${key}:`, error);
            return false;
        }
    }
    async ttl(key) {
        try {
            return await this.redisClient.ttl(key);
        }
        catch (error) {
            console.warn(`Cache TTL error for key ${key}:`, error);
            return -1;
        }
    }
};
exports.RedisCacheManager = RedisCacheManager;
exports.RedisCacheManager = RedisCacheManager = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [Object])
], RedisCacheManager);
function CacheResult(options = {}) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const cacheManager = this.cacheManager;
            if (!cacheManager) {
                console.warn(`No cache manager available for ${methodName}`);
                return await originalMethod.apply(this, args);
            }
            const cacheKey = options.keyGenerator
                ? options.keyGenerator({})
                : `${methodName}:${JSON.stringify(args)}`;
            const fullKey = `${options.keyPrefix || 'cache'}:${cacheKey}`;
            try {
                const cachedResult = await cacheManager.get(fullKey);
                if (cachedResult !== null || (cachedResult === null && options.cacheNulls)) {
                    return cachedResult;
                }
                const result = await originalMethod.apply(this, args);
                if (result !== null || options.cacheNulls) {
                    await cacheManager.set(fullKey, result, options.ttl || 300);
                }
                return result;
            }
            catch (error) {
                console.warn(`Cache operation failed for ${methodName}:`, error);
                return await originalMethod.apply(this, args);
            }
        };
        (0, common_1.SetMetadata)(exports.CACHING_METADATA, options)(target, propertyKey, descriptor);
    };
}
function CacheInvalidate(patterns) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const cacheManager = this.cacheManager;
            try {
                const result = await originalMethod.apply(this, args);
                if (cacheManager) {
                    const patternArray = Array.isArray(patterns) ? patterns : [patterns];
                    for (const pattern of patternArray) {
                        await cacheManager.delPattern(pattern);
                    }
                }
                return result;
            }
            catch (error) {
                console.warn(`Cache invalidation failed for ${methodName}:`, error);
                return await originalMethod.apply(this, args);
            }
        };
    };
}
function CacheWarmup(options) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        (0, common_1.SetMetadata)('enterprise:cache-warmup', {
            method: methodName,
            interval: options.interval || 300000,
            enabled: options.enabled !== false
        })(target, propertyKey, descriptor);
        return descriptor;
    };
}
function CacheConditional(condition, options = {}) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const cacheManager = this.cacheManager;
            if (!cacheManager) {
                return await originalMethod.apply(this, args);
            }
            const cacheKey = options.keyGenerator
                ? options.keyGenerator({})
                : `${methodName}:${JSON.stringify(args)}`;
            const fullKey = `${options.keyPrefix || 'cache'}:${cacheKey}`;
            try {
                const cachedResult = await cacheManager.get(fullKey);
                if (cachedResult !== null) {
                    return cachedResult;
                }
                const result = await originalMethod.apply(this, args);
                if (condition(result)) {
                    await cacheManager.set(fullKey, result, options.ttl || 300);
                }
                return result;
            }
            catch (error) {
                console.warn(`Conditional cache operation failed for ${methodName}:`, error);
                return await originalMethod.apply(this, args);
            }
        };
        (0, common_1.SetMetadata)(exports.CACHING_METADATA, { ...options, conditional: true })(target, propertyKey, descriptor);
    };
}
//# sourceMappingURL=caching.decorators.js.map