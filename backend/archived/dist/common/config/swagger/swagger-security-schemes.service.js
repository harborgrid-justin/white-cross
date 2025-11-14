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
exports.SwaggerSecuritySchemesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const base_1 = require("../../base");
let SwaggerSecuritySchemesService = class SwaggerSecuritySchemesService extends base_1.BaseService {
    configService;
    constructor(configService) {
        super("SwaggerSecuritySchemesService");
        this.configService = configService;
    }
    createJwtBearerScheme(options = {}) {
        return {
            secret: options.secret || this.configService.get('JWT_SECRET'),
            issuer: options.issuer || 'white-cross-healthcare',
            audience: options.audience || ['api'],
            algorithm: options.algorithm || 'RS256',
            expiresIn: options.expiresIn || '15m',
            ...options,
        };
    }
    createApiKeyScheme(name = 'X-API-Key', location = 'header', options = {}) {
        return {
            name,
            in: location,
            description: options.description || `API key via ${location}`,
            ...options,
        };
    }
    createHmacScheme(options = {}) {
        return {
            algorithm: options.algorithm || 'sha256',
            signatureHeader: options.signatureHeader || 'X-Signature',
            timestampHeader: options.timestampHeader || 'X-Timestamp',
            clockSkewTolerance: options.clockSkewTolerance || 300,
            ...options,
        };
    }
    createMutualTlsScheme(options = {}) {
        return {
            validationLevel: options.validationLevel || 'basic',
            trustedCAs: options.trustedCAs || [],
            clientCertRequired: options.clientCertRequired ?? true,
            ...options,
        };
    }
    getDefaultSecurityConfig() {
        const jwtSecret = this.configService.get('JWT_SECRET');
        const environment = this.configService.get('NODE_ENV', 'development');
        const config = {
            jwt: {
                secret: jwtSecret,
                issuer: 'white-cross-healthcare',
                audience: environment === 'production' ? ['white-cross-prod'] : ['white-cross-dev'],
                algorithm: 'RS256',
                expiresIn: '15m',
            },
            apiKey: {
                name: 'X-API-Key',
                in: 'header',
                description: 'API key for external integrations',
            },
        };
        if (environment === 'production') {
            config.hmac = {
                algorithm: 'sha256',
                signatureHeader: 'X-Signature',
                timestampHeader: 'X-Timestamp',
                clockSkewTolerance: 300,
            };
        }
        return config;
    }
};
exports.SwaggerSecuritySchemesService = SwaggerSecuritySchemesService;
exports.SwaggerSecuritySchemesService = SwaggerSecuritySchemesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SwaggerSecuritySchemesService);
//# sourceMappingURL=swagger-security-schemes.service.js.map