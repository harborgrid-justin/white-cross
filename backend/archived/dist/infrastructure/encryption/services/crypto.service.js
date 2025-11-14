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
exports.CryptoService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
const logger_service_1 = require("../../../common/logging/logger.service");
const crypto = __importStar(require("crypto"));
const encryption_types_1 = require("../types/encryption.types");
const key_management_service_1 = require("../key-management.service");
let CryptoService = class CryptoService extends base_1.BaseService {
    keyManagementService;
    ALGORITHM = 'aes-256-gcm';
    KEY_LENGTH = 32;
    IV_LENGTH = 16;
    AUTH_TAG_LENGTH = 16;
    VERSION = '1.0.0';
    constructor(logger, keyManagementService) {
        super({
            serviceName: 'CryptoService',
            logger,
            enableAuditLogging: true,
        });
        this.keyManagementService = keyManagementService;
    }
    async encrypt(data, encryptionKey, options = {}) {
        const startTime = Date.now();
        try {
            if (!data) {
                return {
                    success: false,
                    error: encryption_types_1.EncryptionStatus.INVALID_DATA,
                    message: 'Invalid data for encryption',
                };
            }
            const iv = this.keyManagementService.generateRandomKey(this.IV_LENGTH);
            const cipher = crypto.createCipheriv(this.ALGORITHM, encryptionKey, iv);
            if (options.aad) {
                cipher.setAAD(Buffer.from(options.aad, 'utf8'));
            }
            let encrypted = cipher.update(data, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            const authTag = cipher.getAuthTag();
            const metadata = {
                algorithm: encryption_types_1.EncryptionAlgorithm.AES_256_GCM,
                iv: iv.toString('base64'),
                authTag: authTag.toString('base64'),
                keyId: options.keyId || 'ephemeral',
                timestamp: Date.now(),
                version: this.VERSION,
            };
            const duration = Date.now() - startTime;
            this.logDebug(`Encryption completed in ${duration}ms`, {
                keyId: metadata.keyId,
                dataLength: data.length,
            });
            return {
                success: true,
                data: encrypted,
                metadata,
            };
        }
        catch (error) {
            this.logError('Encryption failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                keyId: options.keyId,
            });
            return {
                success: false,
                error: encryption_types_1.EncryptionStatus.FAILED,
                message: 'Encryption operation failed',
            };
        }
    }
    async decrypt(encryptedData, metadata, decryptionKey, options = {}) {
        const startTime = Date.now();
        try {
            if (!encryptedData || !metadata) {
                return {
                    success: false,
                    error: encryption_types_1.EncryptionStatus.INVALID_DATA,
                    message: 'Invalid encrypted data or metadata',
                };
            }
            if (metadata.version !== this.VERSION) {
                this.logWarning('Version mismatch detected', {
                    expected: this.VERSION,
                    received: metadata.version,
                });
            }
            const iv = Buffer.from(metadata.iv, 'base64');
            const authTag = Buffer.from(metadata.authTag, 'base64');
            const decipher = crypto.createDecipheriv(this.ALGORITHM, decryptionKey, iv);
            decipher.setAuthTag(authTag);
            if (options.aad) {
                decipher.setAAD(Buffer.from(options.aad, 'utf8'));
            }
            let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            const duration = Date.now() - startTime;
            this.logDebug(`Decryption completed in ${duration}ms`, {
                keyId: metadata.keyId,
            });
            return {
                success: true,
                data: decrypted,
                metadata,
            };
        }
        catch (error) {
            this.logError('Decryption failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                keyId: metadata?.keyId,
            });
            return {
                success: false,
                error: encryption_types_1.EncryptionStatus.DECRYPTION_ERROR,
                message: 'Decryption operation failed',
            };
        }
    }
    generateEncryptionKey() {
        return this.keyManagementService.generateRandomKey(this.KEY_LENGTH);
    }
    getAlgorithmConstants() {
        return {
            algorithm: this.ALGORITHM,
            keyLength: this.KEY_LENGTH,
            ivLength: this.IV_LENGTH,
            authTagLength: this.AUTH_TAG_LENGTH,
            version: this.VERSION,
        };
    }
};
exports.CryptoService = CryptoService;
exports.CryptoService = CryptoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        key_management_service_1.KeyManagementService])
], CryptoService);
//# sourceMappingURL=crypto.service.js.map