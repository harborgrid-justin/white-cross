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
var RateLimitGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimit = exports.RateLimitGuard = exports.RATE_LIMIT_CONFIGS = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
var CircuitState;
(function (CircuitState) {
    CircuitState["CLOSED"] = "CLOSED";
    CircuitState["OPEN"] = "OPEN";
    CircuitState["HALF_OPEN"] = "HALF_OPEN";
})(CircuitState || (CircuitState = {}));
exports.RATE_LIMIT_CONFIGS = {
    auth: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 5,
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
        blockDuration: 15 * 60 * 1000,
    },
    communication: {
        windowMs: 60 * 1000,
        maxRequests: 10,
        message: 'Message rate limit exceeded. Please wait before sending more messages.',
        blockDuration: 5 * 60 * 1000,
    },
    emergencyAlert: {
        windowMs: 60 * 60 * 1000,
        maxRequests: 3,
        message: 'Emergency alert rate limit exceeded. Contact system administrator.',
        blockDuration: 60 * 60 * 1000,
    },
    export: {
        windowMs: 60 * 60 * 1000,
        maxRequests: 10,
        message: 'Export rate limit exceeded. Please wait before exporting more data.',
        blockDuration: 60 * 60 * 1000,
    },
    api: {
        windowMs: 60 * 1000,
        maxRequests: 100,
        message: 'API rate limit exceeded. Please slow down your requests.',
        blockDuration: 60 * 1000,
    },
    reports: {
        windowMs: 5 * 60 * 1000,
        maxRequests: 5,
        message: 'Report generation rate limit exceeded.',
        blockDuration: 5 * 60 * 1000,
    },
};
class MemoryRateLimitStore {
    store = new Map();
    async increment(key, windowMs) {
        const now = Date.now();
        const record = this.store.get(key);
        if (!record || record.resetAt < now) {
            const newRecord = {
                count: 1,
                resetAt: now + windowMs,
                firstHit: now,
            };
            this.store.set(key, newRecord);
            return {
                totalHits: 1,
                remainingPoints: 0,
                msBeforeNext: windowMs,
                isFirstInDuration: true,
            };
        }
        record.count++;
        return {
            totalHits: record.count,
            remainingPoints: 0,
            msBeforeNext: record.resetAt - now,
            isFirstInDuration: false,
        };
    }
    async reset(key) {
        this.store.delete(key);
    }
    async cleanup() {
        const now = Date.now();
        let cleaned = 0;
        const entries = Array.from(this.store.entries());
        for (const [key, record] of entries) {
            if (record.resetAt < now) {
                this.store.delete(key);
                cleaned++;
            }
        }
        return cleaned;
    }
}
class CircuitBreaker {
    config;
    state = CircuitState.CLOSED;
    failureCount = 0;
    lastFailureTime = 0;
    nextAttemptTime = 0;
    constructor(config) {
        this.config = config;
    }
    recordSuccess() {
        if (this.state === CircuitState.HALF_OPEN) {
            this.state = CircuitState.CLOSED;
            this.failureCount = 0;
        }
    }
    recordFailure() {
        const now = Date.now();
        this.lastFailureTime = now;
        if (now - this.lastFailureTime > this.config.monitoringWindow) {
            this.failureCount = 0;
        }
        this.failureCount++;
        if (this.failureCount >= this.config.failureThreshold) {
            this.state = CircuitState.OPEN;
            this.nextAttemptTime = now + this.config.resetTimeout;
        }
    }
    canAttempt() {
        if (this.state === CircuitState.CLOSED) {
            return true;
        }
        if (this.state === CircuitState.OPEN) {
            const now = Date.now();
            if (now >= this.nextAttemptTime) {
                this.state = CircuitState.HALF_OPEN;
                return true;
            }
            return false;
        }
        return true;
    }
    getState() {
        return this.state;
    }
}
let RateLimitGuard = RateLimitGuard_1 = class RateLimitGuard {
    reflector;
    logger = new common_1.Logger(RateLimitGuard_1.name);
    store;
    circuitBreaker;
    constructor(reflector) {
        this.reflector = reflector;
        this.store = new MemoryRateLimitStore();
        this.circuitBreaker = new CircuitBreaker({
            failureThreshold: 5,
            resetTimeout: 30000,
            monitoringWindow: 60000,
        });
        setInterval(() => {
            this.store
                .cleanup()
                .then((cleaned) => {
                if (cleaned > 0) {
                    this.logger.debug(`Cleaned up ${cleaned} expired rate limit records`);
                }
            })
                .catch((error) => {
                this.logger.error('Rate limit cleanup failed', {
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            });
        }, 5 * 60 * 1000);
    }
    async canActivate(context) {
        const rateLimitType = this.reflector.get('rateLimit', context.getHandler());
        if (!rateLimitType) {
            return true;
        }
        const config = exports.RATE_LIMIT_CONFIGS[rateLimitType];
        if (!config) {
            this.logger.warn(`Unknown rate limit type: ${rateLimitType}`);
            return true;
        }
        if (!this.circuitBreaker.canAttempt()) {
            const state = this.circuitBreaker.getState();
            this.logger.error('Rate limit service circuit breaker OPEN', {
                state,
                rateLimitType,
            });
            throw new common_1.ServiceUnavailableException({
                statusCode: common_1.HttpStatus.SERVICE_UNAVAILABLE,
                error: 'Service Temporarily Unavailable',
                message: 'Rate limiting service is temporarily unavailable. Please try again later.',
                retryAfter: 30,
            });
        }
        const request = context.switchToHttp().getRequest();
        const identifier = rateLimitType;
        const ip = this.getClientIP(request);
        const userId = request.user?.id;
        const key = `ratelimit:${identifier}:${userId || ip}`;
        try {
            const info = await this.store.increment(key, config.windowMs);
            const remainingPoints = Math.max(0, config.maxRequests - info.totalHits);
            const allowed = info.totalHits <= config.maxRequests;
            const response = context.switchToHttp().getResponse();
            response.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
            response.setHeader('X-RateLimit-Remaining', remainingPoints.toString());
            response.setHeader('X-RateLimit-Window', config.windowMs.toString());
            if (!allowed) {
                const retryAfter = Math.ceil(info.msBeforeNext / 1000);
                response.setHeader('Retry-After', retryAfter.toString());
                response.setHeader('X-RateLimit-Reset', new Date(Date.now() + info.msBeforeNext).toISOString());
                this.logger.warn(`Rate limit exceeded: ${identifier}`, {
                    key,
                    totalHits: info.totalHits,
                    maxRequests: config.maxRequests,
                    userId,
                    ip,
                    path: request.path,
                    method: request.method,
                });
                throw new common_1.HttpException({
                    statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
                    error: 'Rate Limit Exceeded',
                    message: config.message,
                    retryAfter,
                }, common_1.HttpStatus.TOO_MANY_REQUESTS);
            }
            this.circuitBreaker.recordSuccess();
            this.logger.debug(`Rate limit check passed: ${identifier}`, {
                totalHits: info.totalHits,
                remainingPoints,
                userId,
                ip,
            });
            return true;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.circuitBreaker.recordFailure();
            this.logger.error('Rate limit check failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                rateLimitType,
                userId,
                ip,
                circuitState: this.circuitBreaker.getState(),
            });
            throw new common_1.ServiceUnavailableException({
                statusCode: common_1.HttpStatus.SERVICE_UNAVAILABLE,
                error: 'Rate Limiting Unavailable',
                message: 'Rate limiting service is temporarily unavailable. Please try again later.',
                retryAfter: 30,
            });
        }
    }
    getClientIP(req) {
        const forwarded = req.headers['x-forwarded-for'];
        const realIP = req.headers['x-real-ip'];
        if (typeof forwarded === 'string') {
            const firstIP = forwarded.split(',')[0];
            return firstIP ? firstIP.trim() : undefined;
        }
        if (typeof realIP === 'string') {
            return realIP;
        }
        return req.ip || req.socket.remoteAddress || 'unknown';
    }
    getHealth() {
        const state = this.circuitBreaker.getState();
        let status;
        if (state === CircuitState.CLOSED) {
            status = 'healthy';
        }
        else if (state === CircuitState.HALF_OPEN) {
            status = 'degraded';
        }
        else {
            status = 'unhealthy';
        }
        return { status, circuitState: state };
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = RateLimitGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RateLimitGuard);
const RateLimit = (_type) => core_1.Reflector.createDecorator({ key: 'rateLimit' });
exports.RateLimit = RateLimit;
//# sourceMappingURL=rate-limit.guard.js.map