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
var ApiKeyGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireApiKeyScope = exports.ApiKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const api_key_auth_service_1 = require("../api-key-auth.service");
let ApiKeyGuard = ApiKeyGuard_1 = class ApiKeyGuard {
    apiKeyAuthService;
    reflector;
    logger = new common_1.Logger(ApiKeyGuard_1.name);
    constructor(apiKeyAuthService, reflector) {
        this.apiKeyAuthService = apiKeyAuthService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const apiKey = this.extractApiKey(request);
        if (!apiKey) {
            this.logger.warn('API key missing from request', {
                path: request.path,
                ip: request.ip,
            });
            throw new common_1.UnauthorizedException('API key required. Provide X-API-Key header.');
        }
        try {
            const apiKeyRecord = await this.apiKeyAuthService.validateApiKey(apiKey);
            if (apiKeyRecord.ipRestriction) {
                const clientIP = this.extractClientIP(request);
                if (!this.matchesIPPattern(clientIP, apiKeyRecord.ipRestriction)) {
                    this.logger.warn('API key IP restriction violated', {
                        keyPrefix: apiKeyRecord.keyPrefix,
                        clientIP,
                        allowedPattern: apiKeyRecord.ipRestriction,
                    });
                    throw new common_1.UnauthorizedException('API key not allowed from this IP address');
                }
            }
            request.apiKey = {
                id: apiKeyRecord.id,
                name: apiKeyRecord.name,
                keyPrefix: apiKeyRecord.keyPrefix,
                scopes: apiKeyRecord.scopes,
                rateLimit: apiKeyRecord.rateLimit,
            };
            return true;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error('Error validating API key', { error });
            throw new common_1.UnauthorizedException('Invalid API key');
        }
    }
    extractApiKey(request) {
        const headerKey = request.headers['x-api-key'];
        if (headerKey) {
            return headerKey;
        }
        const authHeader = request.headers['authorization'];
        if (authHeader && authHeader.startsWith('ApiKey ')) {
            return authHeader.substring(7);
        }
        return null;
    }
    extractClientIP(request) {
        const forwarded = request.headers['x-forwarded-for'];
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }
        const realIP = request.headers['x-real-ip'];
        if (realIP) {
            return realIP;
        }
        return request.ip || request.connection?.remoteAddress || '127.0.0.1';
    }
    matchesIPPattern(clientIP, pattern) {
        if (clientIP === pattern) {
            return true;
        }
        if (pattern.includes('*')) {
            const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '\\d+');
            const regex = new RegExp(`^${regexPattern}$`);
            if (regex.test(clientIP)) {
                return true;
            }
        }
        if (pattern.includes('/')) {
            this.logger.warn(`CIDR matching requires 'ip-cidr' library. Install with: npm install ip-cidr`, {
                clientIP,
                pattern,
            });
            const [networkIP, prefixLength] = pattern.split('/');
            const prefix = parseInt(prefixLength, 10);
            if (this.isIPv4(clientIP) && this.isIPv4(networkIP)) {
                return this.simpleIPv4CIDRMatch(clientIP, networkIP, prefix);
            }
            this.logger.warn(`Denying access due to incomplete CIDR validation. Install ip-cidr library.`);
            return false;
        }
        return false;
    }
    isIPv4(ip) {
        const parts = ip.split('.');
        if (parts.length !== 4)
            return false;
        return parts.every((part) => {
            const num = parseInt(part, 10);
            return num >= 0 && num <= 255;
        });
    }
    simpleIPv4CIDRMatch(clientIP, networkIP, prefixLength) {
        try {
            const clientParts = clientIP.split('.').map(Number);
            const networkParts = networkIP.split('.').map(Number);
            const clientInt = (clientParts[0] << 24) |
                (clientParts[1] << 16) |
                (clientParts[2] << 8) |
                clientParts[3];
            const networkInt = (networkParts[0] << 24) |
                (networkParts[1] << 16) |
                (networkParts[2] << 8) |
                networkParts[3];
            const mask = (0xffffffff << (32 - prefixLength)) >>> 0;
            const match = (clientInt & mask) === (networkInt & mask);
            this.logger.debug('Simple CIDR match', {
                clientIP,
                networkIP,
                prefixLength,
                match,
            });
            return match;
        }
        catch (error) {
            this.logger.error('Error in simple CIDR matching', { error });
            return false;
        }
    }
};
exports.ApiKeyGuard = ApiKeyGuard;
exports.ApiKeyGuard = ApiKeyGuard = ApiKeyGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [api_key_auth_service_1.ApiKeyAuthService,
        core_1.Reflector])
], ApiKeyGuard);
const RequireApiKeyScope = (scope) => core_1.Reflector.createDecorator({ key: 'apiKeyScope' });
exports.RequireApiKeyScope = RequireApiKeyScope;
//# sourceMappingURL=api-key.guard.js.map