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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyAuthService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const models_1 = require("../database/models");
const crypto = __importStar(require("crypto"));
const app_config_service_1 = require("../common/config/app-config.service");
const base_1 = require("../common/base");
let ApiKeyAuthService = class ApiKeyAuthService extends base_1.BaseService {
    apiKeyModel;
    configService;
    constructor(apiKeyModel, configService) {
        super('ApiKeyAuthService');
        this.apiKeyModel = apiKeyModel;
        this.configService = configService;
    }
    async generateApiKey(createDto, userId) {
        try {
            const randomBytes = crypto.randomBytes(32).toString('hex');
            const environment = this.configService.isProduction ? 'live' : 'test';
            const apiKey = `wc_${environment}_${randomBytes}`;
            const keyHash = this.hashApiKey(apiKey);
            const keyPrefix = apiKey.substring(0, 12);
            const expiresAt = createDto.expiresInDays
                ? new Date(Date.now() + createDto.expiresInDays * 24 * 60 * 60 * 1000)
                : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
            const apiKeyRecord = await this.apiKeyModel.create({
                name: createDto.name,
                keyHash,
                keyPrefix,
                description: createDto.description,
                scopes: createDto.scopes || ['api:read'],
                isActive: true,
                expiresAt,
                createdBy: userId,
                ipRestriction: createDto.ipRestriction,
                rateLimit: createDto.rateLimit || 1000,
                usageCount: 0,
            });
            this.logInfo(`API key created: ${keyPrefix}... for user ${userId}`);
            return {
                apiKey,
                id: apiKeyRecord.id,
                name: apiKeyRecord.name,
                keyPrefix: apiKeyRecord.keyPrefix,
                scopes: apiKeyRecord.scopes,
                expiresAt: apiKeyRecord.expiresAt,
                createdAt: apiKeyRecord.createdAt,
            };
        }
        catch (error) {
            this.logError('Error generating API key', { error, userId });
            throw new common_1.BadRequestException('Failed to generate API key');
        }
    }
    async validateApiKey(apiKey) {
        try {
            const keyHash = this.hashApiKey(apiKey);
            const apiKeyRecord = await this.apiKeyModel.findOne({
                where: { keyHash },
            });
            if (!apiKeyRecord) {
                this.logWarning('Invalid API key attempted', {
                    keyPrefix: apiKey.substring(0, 12),
                });
                throw new common_1.UnauthorizedException('Invalid API key');
            }
            if (!apiKeyRecord.isActive) {
                this.logWarning('Inactive API key attempted', {
                    keyPrefix: apiKeyRecord.keyPrefix,
                    id: apiKeyRecord.id,
                });
                throw new common_1.UnauthorizedException('API key is inactive');
            }
            if (apiKeyRecord.isExpired()) {
                this.logWarning('Expired API key attempted', {
                    keyPrefix: apiKeyRecord.keyPrefix,
                    id: apiKeyRecord.id,
                    expiresAt: apiKeyRecord.expiresAt,
                });
                throw new common_1.UnauthorizedException('API key has expired');
            }
            await apiKeyRecord.update({
                lastUsedAt: new Date(),
                usageCount: apiKeyRecord.usageCount + 1,
            });
            this.logInfo('API key validated successfully', {
                keyPrefix: apiKeyRecord.keyPrefix,
                id: apiKeyRecord.id,
            });
            return apiKeyRecord;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logError('Error validating API key', { error });
            throw new common_1.UnauthorizedException('Invalid API key');
        }
    }
    async rotateApiKey(apiKeyId, userId) {
        try {
            const oldKey = await this.apiKeyModel.findByPk(apiKeyId);
            if (!oldKey) {
                throw new common_1.BadRequestException('API key not found');
            }
            if (oldKey.createdBy !== userId) {
                throw new common_1.BadRequestException('Not authorized to rotate this API key');
            }
            const newKey = await this.generateApiKey({
                name: oldKey.name,
                description: oldKey.description,
                scopes: oldKey.scopes,
                ipRestriction: oldKey.ipRestriction,
                rateLimit: oldKey.rateLimit,
            }, userId);
            await oldKey.update({ isActive: false });
            this.logInfo(`API key rotated: ${oldKey.keyPrefix}... -> ${newKey.keyPrefix}...`);
            return newKey;
        }
        catch (error) {
            this.logError('Error rotating API key', { error, apiKeyId, userId });
            throw new common_1.BadRequestException('Failed to rotate API key');
        }
    }
    hashApiKey(apiKey) {
        return crypto.createHash('sha256').update(apiKey).digest('hex');
    }
    hasScope(apiKey, requiredScope) {
        if (!apiKey.scopes)
            return false;
        if (apiKey.scopes.includes('api:*'))
            return true;
        return apiKey.scopes.includes(requiredScope);
    }
};
exports.ApiKeyAuthService = ApiKeyAuthService;
exports.ApiKeyAuthService = ApiKeyAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.ApiKey)),
    __metadata("design:paramtypes", [Object, app_config_service_1.AppConfigService])
], ApiKeyAuthService);
//# sourceMappingURL=api-key-auth.service.js.map