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
exports.IntegrationEncryptionService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const config_1 = require("@nestjs/config");
const base_1 = require("../../common/base");
let IntegrationEncryptionService = class IntegrationEncryptionService extends base_1.BaseService {
    configService;
    ALGORITHM = 'aes-256-gcm';
    KEY_LENGTH = 32;
    IV_LENGTH = 16;
    SALT_LENGTH = 32;
    constructor(configService) {
        super("IntegrationEncryptionService");
        this.configService = configService;
    }
    getEncryptionKey() {
        const secret = this.configService.get('ENCRYPTION_SECRET');
        const salt = this.configService.get('ENCRYPTION_SALT');
        if (!secret || !salt) {
            this.logError('CRITICAL: ENCRYPTION_SECRET and ENCRYPTION_SALT must be set');
            throw new Error('Encryption configuration missing - ENCRYPTION_SECRET and ENCRYPTION_SALT are required');
        }
        if (secret.length < 32) {
            this.logWarning('SECURITY WARNING: ENCRYPTION_SECRET should be at least 32 characters');
        }
        if (salt.length < 16) {
            this.logWarning('SECURITY WARNING: ENCRYPTION_SALT should be at least 16 characters');
        }
        return (0, crypto_1.scryptSync)(secret, salt, this.KEY_LENGTH);
    }
    encryptSensitiveData(data) {
        return {
            apiKey: data.apiKey ? this.encryptCredential(data.apiKey) : undefined,
            password: data.password
                ? this.encryptCredential(data.password)
                : undefined,
        };
    }
    encryptCredential(credential) {
        try {
            const iv = (0, crypto_1.randomBytes)(this.IV_LENGTH);
            const salt = (0, crypto_1.randomBytes)(this.SALT_LENGTH);
            const key = this.getEncryptionKey();
            const cipher = (0, crypto_1.createCipheriv)(this.ALGORITHM, key, iv);
            let encrypted = cipher.update(credential, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            const authTag = cipher.getAuthTag();
            const combined = `${iv.toString('base64')}:${salt.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
            this.logDebug('Credential encrypted successfully');
            return combined;
        }
        catch (error) {
            this.logError('Failed to encrypt credential', error);
            throw new Error('Encryption failed');
        }
    }
    decryptCredential(encryptedCredential) {
        try {
            const parts = encryptedCredential.split(':');
            if (parts.length !== 4 || !parts[0] || !parts[2] || !parts[3]) {
                throw new Error('Invalid encrypted credential format');
            }
            const iv = Buffer.from(parts[0], 'base64');
            const authTag = Buffer.from(parts[2], 'base64');
            const encrypted = parts[3];
            const key = this.getEncryptionKey();
            const decipher = (0, crypto_1.createDecipheriv)(this.ALGORITHM, key, iv);
            decipher.setAuthTag(authTag);
            let decrypted = decipher.update(encrypted, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            this.logDebug('Credential decrypted successfully');
            return decrypted;
        }
        catch (error) {
            this.logError('Failed to decrypt credential', error);
            throw new Error('Decryption failed');
        }
    }
    isEncrypted(credential) {
        const parts = credential.split(':');
        return parts.length === 4;
    }
};
exports.IntegrationEncryptionService = IntegrationEncryptionService;
exports.IntegrationEncryptionService = IntegrationEncryptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], IntegrationEncryptionService);
//# sourceMappingURL=integration-encryption.service.js.map