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
exports.SessionKeyManagerService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
const logger_service_1 = require("../../../common/logging/logger.service");
const crypto = __importStar(require("crypto"));
const cache_service_1 = require("../../cache/cache.service");
const key_management_service_1 = require("../key-management.service");
let SessionKeyManagerService = class SessionKeyManagerService extends base_1.BaseService {
    cacheService;
    keyManagementService;
    DEFAULT_SESSION_KEY_TTL = 24 * 60 * 60;
    constructor(logger, cacheService, keyManagementService) {
        super({
            serviceName: 'SessionKeyManagerService',
            logger,
            enableAuditLogging: true,
        });
        this.cacheService = cacheService;
        this.keyManagementService = keyManagementService;
    }
    async getSessionKey(conversationId, options = {}) {
        try {
            if (!options.skipCache) {
                const cached = await this.getCachedSessionKey(conversationId);
                if (cached) {
                    this.logDebug('Session key retrieved from cache', {
                        conversationId,
                        keyId: cached.id,
                    });
                    return cached;
                }
            }
            const sessionKey = this.generateSessionKey(conversationId, options);
            await this.cacheSessionKey(sessionKey, options);
            this.logInfo('New session key generated', {
                conversationId,
                keyId: sessionKey.id,
                ttl: options.keyTTL || this.DEFAULT_SESSION_KEY_TTL,
            });
            return sessionKey;
        }
        catch (error) {
            this.logError('Failed to get/create session key', {
                error: error instanceof Error ? error.message : 'Unknown error',
                conversationId,
            });
            throw error;
        }
    }
    async rotateSessionKey(conversationId) {
        this.logInfo('Rotating session key', { conversationId });
        try {
            const currentKey = await this.getCachedSessionKey(conversationId);
            const newKey = this.generateSessionKey(conversationId, {});
            if (currentKey) {
                await this.markKeyAsRotated(currentKey);
            }
            await this.cacheSessionKey(newKey, {});
            this.logInfo('Session key rotated successfully', {
                conversationId,
                oldKeyId: currentKey?.id,
                newKeyId: newKey.id,
            });
            return newKey;
        }
        catch (error) {
            this.logError('Session key rotation failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                conversationId,
            });
            throw error;
        }
    }
    async getDecryptionKey(metadata, options) {
        try {
            if (options.conversationId) {
                const sessionKey = await this.getCachedSessionKey(options.conversationId);
                if (sessionKey) {
                    return Buffer.from(sessionKey.key, 'base64');
                }
            }
            if (metadata.keyId === 'ephemeral') {
                this.logWarning('Cannot decrypt message with ephemeral key');
                return null;
            }
            const cacheKey = `encryption:session-key:${metadata.keyId}`;
            const sessionKey = await this.cacheService.get(cacheKey);
            if (sessionKey) {
                return Buffer.from(sessionKey.key, 'base64');
            }
            return null;
        }
        catch (error) {
            this.logError('Failed to get decryption key', {
                error: error instanceof Error ? error.message : 'Unknown error',
                keyId: metadata.keyId,
            });
            return null;
        }
    }
    generateSessionKey(conversationId, options) {
        const keyMaterial = this.keyManagementService.generateRandomKey(32);
        const keyId = this.generateSessionKeyId(conversationId);
        const now = Date.now();
        const ttl = options.keyTTL || this.DEFAULT_SESSION_KEY_TTL;
        return {
            id: keyId,
            key: keyMaterial.toString('base64'),
            conversationId,
            createdAt: now,
            expiresAt: now + ttl * 1000,
            version: 1,
        };
    }
    async cacheSessionKey(sessionKey, options) {
        const ttl = options.keyTTL || this.DEFAULT_SESSION_KEY_TTL;
        const conversationKey = `encryption:session-key:conversation:${sessionKey.conversationId}`;
        await this.cacheService.set(conversationKey, sessionKey, {
            ttl,
            namespace: 'encryption',
        });
        const keyIdKey = `encryption:session-key:${sessionKey.id}`;
        await this.cacheService.set(keyIdKey, sessionKey, {
            ttl,
            namespace: 'encryption',
        });
    }
    async getCachedSessionKey(conversationId) {
        const cacheKey = `encryption:session-key:conversation:${conversationId}`;
        const sessionKey = await this.cacheService.get(cacheKey);
        if (sessionKey && sessionKey.expiresAt > Date.now()) {
            return sessionKey;
        }
        return null;
    }
    async markKeyAsRotated(sessionKey) {
        const cacheKey = `encryption:session-key:rotated:${sessionKey.id}`;
        await this.cacheService.set(cacheKey, sessionKey, {
            ttl: 7 * 24 * 60 * 60,
            namespace: 'encryption',
        });
    }
    generateSessionKeyId(conversationId) {
        const timestamp = Date.now();
        const random = crypto.randomBytes(8).toString('hex');
        return `session_${conversationId}_${timestamp}_${random}`;
    }
    sanitizeId(id) {
        if (id.length <= 8)
            return id;
        return `${id.substring(0, 8)}...`;
    }
};
exports.SessionKeyManagerService = SessionKeyManagerService;
exports.SessionKeyManagerService = SessionKeyManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        cache_service_1.CacheService,
        key_management_service_1.KeyManagementService])
], SessionKeyManagerService);
//# sourceMappingURL=session-key-manager.service.js.map