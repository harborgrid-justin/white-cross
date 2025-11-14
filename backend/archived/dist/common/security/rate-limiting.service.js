"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RATE_LIMIT_CONFIGS = void 0;
exports.initializeRateLimiting = initializeRateLimiting;
exports.createRateLimiter = createRateLimiter;
exports.applyRateLimit = applyRateLimit;
const redis_1 = require("redis");
const logger_1 = require("../logging/logger");
const Boom = __importStar(require("@hapi/boom"));
let redisClient = null;
const inMemoryStore = new Map();
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
    api: {
        windowMs: 60 * 1000,
        maxRequests: 100,
        message: 'API rate limit exceeded. Please slow down your requests.',
        blockDuration: 60 * 1000,
    },
};
async function initializeRateLimiting(redisUrl) {
    if (!redisUrl) {
        logger_1.logger.warn('Redis URL not provided. Using in-memory rate limiting (not suitable for production)');
        return;
    }
    try {
        redisClient = (0, redis_1.createClient)({ url: redisUrl });
        redisClient.on('error', (err) => {
            logger_1.logger.error('Redis rate limiting error', err);
        });
        redisClient.on('connect', () => {
            logger_1.logger.info('Redis rate limiting connected');
        });
        await redisClient.connect();
    }
    catch (error) {
        logger_1.logger.error('Failed to initialize Redis rate limiting', error);
        redisClient = null;
    }
}
function getRateLimitKey(request, identifier) {
    const userId = request.auth.credentials?.userId;
    const ip = request.info.remoteAddress;
    const userIdentifier = userId || ip;
    return `ratelimit:${identifier}:${userIdentifier}`;
}
function createRateLimiter(identifier, config) {
    return async (request, h) => {
        const key = getRateLimitKey(request, identifier);
        try {
            const now = Date.now();
            const record = inMemoryStore.get(key);
            if (!record || record.resetAt < now) {
                inMemoryStore.set(key, { count: 1, resetAt: now + config.windowMs });
                return h.continue;
            }
            record.count++;
            const remaining = Math.max(0, config.maxRequests - record.count);
            const response = request.response;
            if (response && !response.isBoom) {
                response.header('X-RateLimit-Limit', String(config.maxRequests));
                response.header('X-RateLimit-Remaining', String(remaining));
                response.header('X-RateLimit-Reset', new Date(record.resetAt).toISOString());
            }
            if (record.count > config.maxRequests) {
                logger_1.logger.warn('Rate limit exceeded', {
                    identifier,
                    userId: request.auth.credentials?.userId,
                    ip: request.info.remoteAddress,
                    path: request.path,
                });
                throw Boom.tooManyRequests(config.message, {
                    retryAfter: Math.ceil((record.resetAt - Date.now()) / 1000),
                });
            }
            return h.continue;
        }
        catch (error) {
            if (Boom.isBoom(error)) {
                throw error;
            }
            logger_1.logger.error('Rate limiting check failed', error);
            return h.continue;
        }
    };
}
function applyRateLimit(identifier, config) {
    return {
        assign: 'rateLimit',
        method: createRateLimiter(identifier, config),
    };
}
exports.default = {
    RATE_LIMIT_CONFIGS: exports.RATE_LIMIT_CONFIGS,
    initializeRateLimiting,
    createRateLimiter,
    applyRateLimit,
};
//# sourceMappingURL=rate-limiting.service.js.map