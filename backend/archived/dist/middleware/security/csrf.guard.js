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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CsrfGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipCsrf = exports.CsrfGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const crypto = __importStar(require("crypto"));
const app_config_service_1 = require("../../common/config/app-config.service");
const DEFAULT_CSRF_CONFIG = {
    cookieName: 'XSRF-TOKEN',
    headerName: 'X-CSRF-Token',
    tokenLifetimeMs: 24 * 60 * 60 * 1000,
    skipPaths: new Set([
        '/api/auth/login',
        '/api/v1/auth/login',
        '/api/auth/logout',
        '/api/v1/auth/logout',
        '/api/auth/register',
        '/api/v1/auth/register',
        '/api/auth/forgot-password',
        '/api/v1/auth/forgot-password',
        '/api/auth/reset-password',
        '/api/v1/auth/reset-password',
        '/api/webhook',
        '/api/v1/webhook',
        '/api/public',
        '/api/v1/public',
    ]),
};
class CSRFTokenCache {
    cache = new Map();
    TTL = 24 * 60 * 60 * 1000;
    set(userId, sessionId, token) {
        this.cache.set(userId, {
            token,
            timestamp: Date.now(),
            sessionId,
        });
        this.cleanup();
    }
    get(userId, sessionId) {
        const entry = this.cache.get(userId);
        if (!entry)
            return null;
        if (Date.now() - entry.timestamp > this.TTL) {
            this.cache.delete(userId);
            return null;
        }
        if (entry.sessionId !== sessionId) {
            return null;
        }
        return entry.token;
    }
    validate(userId, sessionId, token) {
        const cachedToken = this.get(userId, sessionId);
        if (!cachedToken)
            return false;
        return cachedToken === token;
    }
    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > this.TTL) {
                this.cache.delete(key);
            }
        }
    }
}
let CsrfGuard = CsrfGuard_1 = class CsrfGuard {
    reflector;
    configService;
    logger = new common_1.Logger(CsrfGuard_1.name);
    config;
    tokenCache;
    CSRF_PROTECTED_METHODS = new Set([
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
    ]);
    constructor(reflector, configService) {
        this.reflector = reflector;
        this.configService = configService;
        this.config = {
            cookieName: this.configService.security.csrf.cookieName,
            headerName: this.configService.security.csrf.headerName,
            tokenLifetimeMs: this.configService.security.csrf.tokenLifetimeMs,
            skipPaths: DEFAULT_CSRF_CONFIG.skipPaths,
        };
        this.tokenCache = new CSRFTokenCache();
        this.logger.log('CSRF Guard initialized', {
            enabled: this.configService.security.csrf.enabled,
            environment: this.configService.environment,
        });
    }
    async canActivate(context) {
        const skipCsrf = this.reflector.get('skipCsrf', context.getHandler());
        if (skipCsrf) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const method = request.method.toUpperCase();
        if (this.shouldSkipCSRF(request.path)) {
            return true;
        }
        if (!this.CSRF_PROTECTED_METHODS.has(method)) {
            this.handleSafeMethod(request, response);
            return true;
        }
        return this.handleUnsafeMethod(request, response);
    }
    shouldSkipCSRF(path) {
        if (this.config.skipPaths.has(path)) {
            return true;
        }
        for (const skipPath of this.config.skipPaths) {
            if (path.startsWith(skipPath)) {
                return true;
            }
        }
        return false;
    }
    handleSafeMethod(req, res) {
        const user = req.user;
        if (!user || !user.id) {
            return;
        }
        const userId = user.id;
        const sessionId = req.session?.id || 'no-session';
        const csrfToken = this.generateCSRFToken(userId, sessionId);
        this.tokenCache.set(userId, sessionId, csrfToken);
        res.cookie(this.config.cookieName, csrfToken, {
            httpOnly: true,
            secure: this.configService.isProduction,
            sameSite: 'strict',
            maxAge: this.config.tokenLifetimeMs,
        });
        res.setHeader(this.config.headerName, csrfToken);
        res.locals.csrfToken = csrfToken;
    }
    handleUnsafeMethod(req, res) {
        const user = req.user;
        if (!user || !user.id) {
            this.logger.warn('CSRF: Unauthenticated request to CSRF-protected endpoint', {
                path: req.path,
                method: req.method,
                ip: req.ip,
            });
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.UNAUTHORIZED,
                error: 'Authentication Required',
                message: 'Authentication required for this operation',
            }, common_1.HttpStatus.UNAUTHORIZED);
        }
        const userId = user.id;
        const sessionId = req.session?.id || 'no-session';
        const token = this.getCSRFTokenFromRequest(req);
        if (!token) {
            this.logger.warn('CSRF: Token missing', {
                userId,
                path: req.path,
                method: req.method,
                ip: req.ip,
            });
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.FORBIDDEN,
                error: 'CSRF Validation Failed',
                message: 'CSRF token required. Please include X-CSRF-Token header or _csrf form field.',
            }, common_1.HttpStatus.FORBIDDEN);
        }
        const isValid = this.validateCSRFToken(token, userId, sessionId);
        if (!isValid) {
            this.logger.warn('CSRF: Token validation failed', {
                userId,
                path: req.path,
                method: req.method,
                ip: req.ip,
            });
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.FORBIDDEN,
                error: 'CSRF Validation Failed',
                message: 'Invalid or expired CSRF token',
            }, common_1.HttpStatus.FORBIDDEN);
        }
        this.logger.debug('CSRF: Token validated successfully', {
            userId,
            path: req.path,
            method: req.method,
        });
        return true;
    }
    generateCSRFToken(userId, sessionId) {
        const timestamp = Date.now().toString();
        const randomBytes = crypto.randomBytes(32).toString('hex');
        const payload = `${userId}:${sessionId}:${timestamp}:${randomBytes}`;
        const secret = this.configService.csrfSecret;
        if (!secret) {
            throw new Error('CRITICAL SECURITY ERROR: CSRF_SECRET not configured. ' +
                'Please set CSRF_SECRET in your .env file.');
        }
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(payload);
        const signature = hmac.digest('hex');
        return Buffer.from(`${payload}:${signature}`).toString('base64');
    }
    validateCSRFToken(token, userId, sessionId) {
        try {
            if (this.tokenCache.validate(userId, sessionId, token)) {
                return true;
            }
            const decoded = Buffer.from(token, 'base64').toString('utf-8');
            const parts = decoded.split(':');
            if (parts.length !== 5) {
                return false;
            }
            const [tokenUserId, tokenSessionId, timestamp, randomBytes, signature] = parts;
            if (!tokenUserId || !tokenSessionId || !timestamp || !randomBytes || !signature) {
                return false;
            }
            if (tokenUserId !== userId || tokenSessionId !== sessionId) {
                return false;
            }
            const tokenAge = Date.now() - parseInt(timestamp, 10);
            if (tokenAge > this.config.tokenLifetimeMs) {
                return false;
            }
            const payload = `${tokenUserId}:${tokenSessionId}:${timestamp}:${randomBytes}`;
            const secret = this.configService.csrfSecret;
            if (!secret) {
                this.logger.error('CSRF_SECRET not configured');
                return false;
            }
            const hmac = crypto.createHmac('sha256', secret);
            hmac.update(payload);
            const expectedSignature = hmac.digest('hex');
            if (signature !== expectedSignature) {
                return false;
            }
            this.tokenCache.set(userId, sessionId, token);
            return true;
        }
        catch (error) {
            this.logger.error('CSRF token validation error', error);
            return false;
        }
    }
    getCSRFTokenFromRequest(req) {
        const headerToken = req.headers[this.config.headerName.toLowerCase()];
        if (headerToken) {
            return headerToken;
        }
        const bodyToken = req.body?._csrf;
        if (bodyToken) {
            return bodyToken;
        }
        const queryToken = req.query?._csrf;
        if (queryToken) {
            return queryToken;
        }
        const cookieToken = req.cookies?.[this.config.cookieName];
        if (cookieToken) {
            return cookieToken;
        }
        return null;
    }
};
exports.CsrfGuard = CsrfGuard;
exports.CsrfGuard = CsrfGuard = CsrfGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        app_config_service_1.AppConfigService])
], CsrfGuard);
const SkipCsrf = () => core_1.Reflector.createDecorator({ key: 'skipCsrf' });
exports.SkipCsrf = SkipCsrf;
//# sourceMappingURL=csrf.guard.js.map