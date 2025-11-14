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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
const config_1 = require("@nestjs/config");
const crypto_service_1 = require("./services/crypto.service");
const session_key_manager_service_1 = require("./services/session-key-manager.service");
const message_encryption_service_1 = require("./services/message-encryption.service");
let EncryptionService = class EncryptionService extends base_1.BaseService {
    configService;
    cryptoService;
    sessionKeyManager;
    messageEncryption;
    config;
    constructor(logger, configService, cryptoService, sessionKeyManager, messageEncryption) {
        super({
            serviceName: 'EncryptionService',
            logger,
            enableAuditLogging: true,
        });
        this.configService = configService;
        this.cryptoService = cryptoService;
        this.sessionKeyManager = sessionKeyManager;
        this.messageEncryption = messageEncryption;
        this.config = {
            algorithm: 'aes-256-gcm',
            rsaKeySize: 4096,
            sessionKeyTTL: 24 * 60 * 60,
            enableKeyRotation: true,
            keyRotationInterval: 7 * 24 * 60 * 60,
            version: '1.0.0',
            enabled: this.configService.get('ENCRYPTION_ENABLED', true),
        };
        this.logInfo('Encryption service initialized', {
            enabled: this.config.enabled,
            version: this.config.version,
            algorithm: this.config.algorithm,
        });
    }
    async encrypt(data, options = {}) {
        try {
            if (!this.isEncryptionEnabled()) {
                this.logWarning('Encryption is disabled, returning unencrypted data');
                return {
                    success: false,
                    error: 'failed',
                    message: 'Encryption is disabled',
                };
            }
            const sessionKey = options.conversationId
                ? await this.sessionKeyManager.getSessionKey(options.conversationId, options)
                : null;
            const encryptionKey = sessionKey
                ? Buffer.from(sessionKey.key, 'base64')
                : this.cryptoService.generateEncryptionKey();
            return this.cryptoService.encrypt(data, encryptionKey, options);
        }
        catch (error) {
            this.logError('Encryption failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                conversationId: options.conversationId,
            });
            return {
                success: false,
                error: 'failed',
                message: 'Encryption operation failed',
            };
        }
    }
    async decrypt(encryptedData, metadata, options = {}) {
        try {
            const decryptionKey = await this.sessionKeyManager.getDecryptionKey(metadata, options);
            if (!decryptionKey) {
                return {
                    success: false,
                    error: 'key_not_found',
                    message: 'Decryption key not found',
                };
            }
            return this.cryptoService.decrypt(encryptedData, metadata, decryptionKey, options);
        }
        catch (error) {
            this.logError('Decryption failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                keyId: metadata?.keyId,
            });
            return {
                success: false,
                error: 'decryption_error',
                message: 'Decryption operation failed',
            };
        }
    }
    async encryptMessage(message, senderId, recipientIds, conversationId) {
        return this.messageEncryption.encryptMessage(message, senderId, recipientIds, conversationId);
    }
    async decryptMessage(encryptedMessage, recipientId) {
        return this.messageEncryption.decryptMessage(encryptedMessage, recipientId);
    }
    async getSessionKey(conversationId, options = {}) {
        return this.sessionKeyManager.getSessionKey(conversationId, options);
    }
    async rotateSessionKey(conversationId) {
        return this.sessionKeyManager.rotateSessionKey(conversationId);
    }
    isEncryptionEnabled() {
        return this.config.enabled;
    }
};
exports.EncryptionService = EncryptionService;
exports.EncryptionService = EncryptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.ConfigService,
        crypto_service_1.CryptoService,
        session_key_manager_service_1.SessionKeyManagerService,
        message_encryption_service_1.MessageEncryptionService])
], EncryptionService);
//# sourceMappingURL=encryption.service.js.map