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
exports.MessageEncryptionService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
const logger_service_1 = require("../../../common/logging/logger.service");
const crypto_service_1 = require("./crypto.service");
const session_key_manager_service_1 = require("./session-key-manager.service");
let MessageEncryptionService = class MessageEncryptionService extends base_1.BaseService {
    cryptoService;
    sessionKeyManager;
    constructor(logger, cryptoService, sessionKeyManager) {
        super({
            serviceName: 'MessageEncryptionService',
            logger,
            enableAuditLogging: true,
        });
        this.cryptoService = cryptoService;
        this.sessionKeyManager = sessionKeyManager;
    }
    async encryptMessage(message, senderId, recipientIds, conversationId) {
        try {
            const sessionKey = await this.sessionKeyManager.getSessionKey(conversationId);
            const result = await this.cryptoService.encrypt(message, Buffer.from(sessionKey.key, 'base64'), {
                conversationId,
                aad: `${senderId}:${conversationId}`,
                keyId: sessionKey.id,
            });
            if (!result.success) {
                throw new Error(result.message);
            }
            const encryptedMessage = {
                encryptedContent: result.data,
                metadata: result.metadata,
                senderId,
                recipientIds,
                conversationId,
                isEncrypted: true,
            };
            this.logInfo('Message encrypted successfully', {
                conversationId,
                recipientCount: recipientIds.length,
            });
            return encryptedMessage;
        }
        catch (error) {
            this.logError('Message encryption failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                conversationId,
            });
            return {
                encryptedContent: message,
                metadata: {
                    algorithm: 'aes-256-gcm',
                    iv: '',
                    authTag: '',
                    keyId: 'failed',
                    timestamp: Date.now(),
                    version: '1.0.0',
                },
                senderId,
                recipientIds,
                conversationId,
                isEncrypted: false,
            };
        }
    }
    async decryptMessage(encryptedMessage, recipientId) {
        try {
            if (!encryptedMessage.isEncrypted) {
                this.logDebug('Message is not encrypted, returning as-is');
                return {
                    success: true,
                    data: encryptedMessage.encryptedContent,
                    metadata: encryptedMessage.metadata,
                };
            }
            if (!encryptedMessage.recipientIds.includes(recipientId)) {
                this.logWarning('Unauthorized decryption attempt', {
                    recipientId: this.sessionKeyManager.sanitizeId(recipientId),
                    conversationId: encryptedMessage.conversationId,
                });
                return {
                    success: false,
                    error: 'unauthorized',
                    message: 'Unauthorized to decrypt this message',
                };
            }
            const decryptionKey = await this.sessionKeyManager.getDecryptionKey(encryptedMessage.metadata, { conversationId: encryptedMessage.conversationId });
            if (!decryptionKey) {
                return {
                    success: false,
                    error: 'key_not_found',
                    message: 'Decryption key not found',
                };
            }
            const result = await this.cryptoService.decrypt(encryptedMessage.encryptedContent, encryptedMessage.metadata, decryptionKey, {
                conversationId: encryptedMessage.conversationId,
                aad: `${encryptedMessage.senderId}:${encryptedMessage.conversationId}`,
            });
            if (result.success) {
                this.logDebug('Message decrypted successfully', {
                    conversationId: encryptedMessage.conversationId,
                });
            }
            return result;
        }
        catch (error) {
            this.logError('Message decryption failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                conversationId: encryptedMessage.conversationId,
            });
            return {
                success: false,
                error: 'decryption_error',
                message: 'Failed to decrypt message',
            };
        }
    }
    async rotateSessionKey(conversationId) {
        await this.sessionKeyManager.rotateSessionKey(conversationId);
    }
};
exports.MessageEncryptionService = MessageEncryptionService;
exports.MessageEncryptionService = MessageEncryptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        crypto_service_1.CryptoService,
        session_key_manager_service_1.SessionKeyManagerService])
], MessageEncryptionService);
//# sourceMappingURL=message-encryption.service.js.map