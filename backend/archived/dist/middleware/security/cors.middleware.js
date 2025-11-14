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
var CorsMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorsMiddleware = exports.DEFAULT_CORS_CONFIG = exports.CorsMethod = void 0;
const common_1 = require("@nestjs/common");
var CorsMethod;
(function (CorsMethod) {
    CorsMethod["GET"] = "GET";
    CorsMethod["POST"] = "POST";
    CorsMethod["PUT"] = "PUT";
    CorsMethod["DELETE"] = "DELETE";
    CorsMethod["PATCH"] = "PATCH";
    CorsMethod["OPTIONS"] = "OPTIONS";
    CorsMethod["HEAD"] = "HEAD";
})(CorsMethod || (exports.CorsMethod = CorsMethod = {}));
exports.DEFAULT_CORS_CONFIG = {
    enabled: true,
    allowedOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    allowedMethods: [
        CorsMethod.GET,
        CorsMethod.POST,
        CorsMethod.PUT,
        CorsMethod.DELETE,
        CorsMethod.OPTIONS,
    ],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-Request-ID',
        'X-Correlation-ID',
        'X-Healthcare-Context',
    ],
    exposedHeaders: [
        'X-Total-Count',
        'X-Request-ID',
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
    ],
    allowCredentials: true,
    maxAge: 86400,
    enableHealthcareCors: true,
    strictMode: process.env.NODE_ENV === 'production',
    enableDynamicOrigins: false,
    trustedDomains: ['.healthcare.gov', '.hhs.gov', '.local'],
    enableAuditLogging: true,
    preflightRateLimit: {
        enabled: true,
        windowMs: 300000,
        maxRequests: 100,
    },
    errorHandling: {
        logRejections: true,
        customErrorResponse: false,
        includeOriginInError: false,
    },
};
class PreflightCache {
    cache = new Map();
    maxAge;
    constructor(maxAge) {
        this.maxAge = maxAge * 1000;
        setInterval(() => this.cleanup(), 3600000);
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (Date.now() - entry.timestamp > this.maxAge) {
            this.cache.delete(key);
            return null;
        }
        return entry.headers;
    }
    set(key, headers) {
        this.cache.set(key, { timestamp: Date.now(), headers });
    }
    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > this.maxAge) {
                this.cache.delete(key);
            }
        }
    }
    clear() {
        this.cache.clear();
    }
}
class HealthcareCorsValidators {
    static isHealthcareDomain(origin) {
        const healthcarePatterns = [
            /\.healthcare\.gov$/,
            /\.hhs\.gov$/,
            /\.hospital\./,
            /\.clinic\./,
            /\.medical\./,
            /\.health\./,
        ];
        try {
            const url = new URL(origin);
            const domain = url.hostname;
            return healthcarePatterns.some((pattern) => pattern.test(domain));
        }
        catch {
            return false;
        }
    }
    static isTrustedEnvironment(origin, trustedDomains) {
        try {
            const url = new URL(origin);
            const domain = url.hostname;
            return trustedDomains.some((trusted) => {
                if (trusted.startsWith('.')) {
                    return domain.endsWith(trusted) || domain === trusted.slice(1);
                }
                return domain === trusted;
            });
        }
        catch {
            return false;
        }
    }
    static isSecureOrigin(origin) {
        try {
            const url = new URL(origin);
            if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
                return true;
            }
            return url.protocol === 'https:';
        }
        catch {
            return false;
        }
    }
}
let CorsMiddleware = CorsMiddleware_1 = class CorsMiddleware {
    logger = new common_1.Logger(CorsMiddleware_1.name);
    config;
    preflightCache;
    constructor() {
        this.config = exports.DEFAULT_CORS_CONFIG;
        this.preflightCache = new PreflightCache(this.config.maxAge);
    }
    async use(req, res, next) {
        if (!this.config.enabled) {
            return next();
        }
        try {
            const origin = req.headers['origin'] || null;
            const isPreflight = req.method === 'OPTIONS' &&
                req.headers['access-control-request-method'] !== undefined;
            const isAllowedOrigin = await this.validateOrigin(origin, req);
            if (!isAllowedOrigin && origin) {
                await this.handleCorsRejection(res, origin, 'Origin not allowed');
                return;
            }
            await this.setCorsHeaders(res, origin);
            if (isPreflight) {
                await this.handlePreflightRequest(res, origin);
                return;
            }
            if (this.config.enableAuditLogging) {
                this.logCorsRequest(req, origin);
            }
            next();
        }
        catch (error) {
            this.logger.error('CORS middleware error', error);
            next();
        }
    }
    async validateOrigin(origin, request) {
        if (!origin)
            return true;
        if (this.config.originValidator) {
            try {
                return await this.config.originValidator(origin, request);
            }
            catch (error) {
                this.logger.error('Origin validator error', error);
                return false;
            }
        }
        if (this.config.enableHealthcareCors) {
            if (this.config.strictMode &&
                !HealthcareCorsValidators.isSecureOrigin(origin)) {
                return false;
            }
            if (this.config.trustedDomains.length > 0) {
                if (HealthcareCorsValidators.isTrustedEnvironment(origin, this.config.trustedDomains)) {
                    return true;
                }
            }
        }
        if (typeof this.config.allowedOrigins === 'function') {
            return this.config.allowedOrigins(origin, request);
        }
        if (Array.isArray(this.config.allowedOrigins)) {
            return this.config.allowedOrigins.includes(origin);
        }
        return false;
    }
    async setCorsHeaders(res, origin) {
        if (origin) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        if (this.config.allowCredentials) {
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        }
        if (this.config.exposedHeaders.length > 0) {
            res.setHeader('Access-Control-Expose-Headers', this.config.exposedHeaders.join(', '));
        }
        const varyHeaders = ['Origin'];
        if (this.config.allowCredentials) {
            varyHeaders.push('Credentials');
        }
        res.setHeader('Vary', varyHeaders.join(', '));
        if (this.config.enableHealthcareCors) {
            res.setHeader('X-Healthcare-CORS', 'enabled');
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
    }
    async handlePreflightRequest(res, origin) {
        const cacheKey = `${origin}:${res.req.method}`;
        const cachedHeaders = this.preflightCache.get(cacheKey);
        if (cachedHeaders) {
            Object.entries(cachedHeaders).forEach(([key, value]) => {
                res.setHeader(key, value);
            });
            res.status(204).send();
            return;
        }
        const preflightHeaders = {};
        preflightHeaders['Access-Control-Allow-Methods'] =
            this.config.allowedMethods.join(', ');
        if (this.config.allowedHeaders.length > 0) {
            preflightHeaders['Access-Control-Allow-Headers'] =
                this.config.allowedHeaders.join(', ');
        }
        preflightHeaders['Access-Control-Max-Age'] = this.config.maxAge.toString();
        this.preflightCache.set(cacheKey, preflightHeaders);
        Object.entries(preflightHeaders).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
        if (this.config.enableAuditLogging) {
            this.logger.log(`[AUDIT] CORS Preflight Request: ${origin}`);
        }
        res.status(204).send();
    }
    async handleCorsRejection(res, origin, reason) {
        if (this.config.errorHandling.logRejections) {
            this.logger.warn(`[SECURITY] CORS Request Rejected: ${origin} - ${reason}`);
        }
        if (this.config.errorHandling.customErrorResponse) {
            res.status(403).json({
                error: 'CORS Policy Violation',
                message: 'Cross-origin request blocked by CORS policy',
                timestamp: new Date().toISOString(),
            });
        }
        else {
            res.status(403).send();
        }
    }
    logCorsRequest(req, origin) {
        const logEntry = {
            event: 'CORS_REQUEST',
            timestamp: new Date().toISOString(),
            origin,
            method: req.method,
            path: req.path,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
        };
        this.logger.log(`[AUDIT] CORS Request: ${JSON.stringify(logEntry)}`);
    }
};
exports.CorsMiddleware = CorsMiddleware;
exports.CorsMiddleware = CorsMiddleware = CorsMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CorsMiddleware);
//# sourceMappingURL=cors.middleware.js.map