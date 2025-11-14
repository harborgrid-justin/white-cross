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
var DiscoveryRateLimitGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryRateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rate_limit_decorator_1 = require("../decorators/rate-limit.decorator");
const discovery_exceptions_1 = require("../exceptions/discovery.exceptions");
let DiscoveryRateLimitGuard = DiscoveryRateLimitGuard_1 = class DiscoveryRateLimitGuard {
    reflector;
    logger = new common_1.Logger(DiscoveryRateLimitGuard_1.name);
    requests = new Map();
    cleanupInterval;
    constructor(reflector) {
        this.reflector = reflector;
        this.cleanupInterval = setInterval(() => {
            this.cleanupOldEntries();
        }, 5 * 60 * 1000);
    }
    onModuleDestroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
    canActivate(context) {
        const rateLimitConfig = this.reflector.getAllAndOverride(rate_limit_decorator_1.RATE_LIMIT_KEY, [context.getHandler(), context.getClass()]);
        if (!rateLimitConfig) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const identifier = this.getIdentifier(request);
        return this.checkRateLimit(identifier, rateLimitConfig, request);
    }
    getIdentifier(request) {
        const user = request.user;
        if (user?.id) {
            return `user:${user.id}`;
        }
        const ip = request.ip ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            'unknown';
        return `ip:${ip}`;
    }
    checkRateLimit(identifier, config, request) {
        const now = Date.now();
        const windowStart = now - config.windowMs;
        let record = this.requests.get(identifier);
        if (!record) {
            record = {
                count: 0,
                windowStart: now,
                requests: [],
            };
            this.requests.set(identifier, record);
        }
        record.requests = record.requests.filter((timestamp) => timestamp > windowStart);
        record.count = record.requests.length;
        if (record.count >= config.limit) {
            const oldestRequest = Math.min(...record.requests);
            const resetTime = oldestRequest + config.windowMs;
            const retryAfter = resetTime - now;
            this.logger.warn(`Rate limit exceeded for ${identifier}: ${record.count}/${config.limit} requests in ${config.windowMs}ms window`, {
                identifier,
                currentCount: record.count,
                limit: config.limit,
                windowMs: config.windowMs,
                path: request.url,
                method: request.method,
            });
            throw new discovery_exceptions_1.RateLimitExceededException(config.limit, config.windowMs, identifier);
        }
        record.requests.push(now);
        record.count = record.requests.length;
        if (record.count > config.limit * 0.8) {
            this.logger.warn(`Rate limit approaching for ${identifier}: ${record.count}/${config.limit}`, {
                identifier,
                currentCount: record.count,
                limit: config.limit,
                path: request.url,
            });
        }
        return true;
    }
    cleanupOldEntries() {
        const now = Date.now();
        let cleanedCount = 0;
        for (const [identifier, record] of this.requests.entries()) {
            const lastRequestTime = Math.max(...record.requests, record.windowStart);
            const timeSinceLastRequest = now - lastRequestTime;
            if (timeSinceLastRequest > 60 * 60 * 1000) {
                this.requests.delete(identifier);
                cleanedCount++;
            }
        }
        if (cleanedCount > 0) {
            this.logger.log(`Cleaned up ${cleanedCount} old rate limit entries`);
        }
    }
    getRateLimitStatus(identifier) {
        const record = this.requests.get(identifier);
        if (!record) {
            return null;
        }
        return {
            count: record.count,
        };
    }
    resetRateLimit(identifier) {
        return this.requests.delete(identifier);
    }
};
exports.DiscoveryRateLimitGuard = DiscoveryRateLimitGuard;
exports.DiscoveryRateLimitGuard = DiscoveryRateLimitGuard = DiscoveryRateLimitGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], DiscoveryRateLimitGuard);
//# sourceMappingURL=discovery-rate-limit.guard.js.map