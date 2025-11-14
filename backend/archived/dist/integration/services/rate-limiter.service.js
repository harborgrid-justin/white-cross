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
const base_1 = require("../../common/base");
let RateLimiterService = class RateLimiterService extends base_1.BaseService {
    constructor() {
        super("RateLimiterService");
    }
    limiters = new Map();
    initialize(serviceName, config = {}) {
        const defaultConfig = {
            maxRequests: 100,
            windowMs: 60000,
        };
        this.limiters.set(serviceName, {
            timestamps: [],
            config: { ...defaultConfig, ...config },
        });
        this.logInfo(`Rate limiter initialized for ${serviceName}: ${defaultConfig.maxRequests} requests per ${defaultConfig.windowMs}ms`);
    }
    checkLimit(serviceName) {
        if (!this.limiters.has(serviceName)) {
            this.initialize(serviceName);
        }
        const limiter = this.limiters.get(serviceName);
        const now = Date.now();
        const windowStart = now - limiter.config.windowMs;
        limiter.timestamps = limiter.timestamps.filter((ts) => ts > windowStart);
        if (limiter.timestamps.length >= limiter.config.maxRequests) {
            const oldestTimestamp = limiter.timestamps[0];
            if (oldestTimestamp !== undefined) {
                const waitTime = oldestTimestamp + limiter.config.windowMs - now;
                this.logWarning(`Rate limit exceeded for ${serviceName}. Wait ${waitTime}ms`);
                throw new Error(`Rate limit exceeded for ${serviceName}. ` +
                    `Max ${limiter.config.maxRequests} requests per ${limiter.config.windowMs}ms. ` +
                    `Try again in ${Math.ceil(waitTime / 1000)}s.`);
            }
        }
        limiter.timestamps.push(now);
    }
    getStatus(serviceName) {
        const limiter = this.limiters.get(serviceName);
        if (!limiter)
            return null;
        const now = Date.now();
        const windowStart = now - limiter.config.windowMs;
        const currentRequests = limiter.timestamps.filter((ts) => ts > windowStart).length;
        return {
            current: currentRequests,
            max: limiter.config.maxRequests,
            window: limiter.config.windowMs,
            remaining: limiter.config.maxRequests - currentRequests,
        };
    }
    reset(serviceName) {
        const limiter = this.limiters.get(serviceName);
        if (!limiter)
            return;
        limiter.timestamps = [];
        this.logInfo(`${serviceName} rate limiter reset`);
    }
};
exports.RateLimiterService = RateLimiterService;
exports.RateLimiterService = RateLimiterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RateLimiterService);
//# sourceMappingURL=rate-limiter.service.js.map