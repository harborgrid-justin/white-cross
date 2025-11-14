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
exports.KeyManagementService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
const cache_service_1 = require("../cache/cache.service");
const interfaces_1 = require("./interfaces");
let KeyManagementService = class KeyManagementService extends base_1.BaseService {
    cacheService;
    configService;
    DEFAULT_KEY_SIZE = 4096;
    DEFAULT_EXPIRATION = 365 * 24 * 60 * 60;
    PBKDF2_ITERATIONS = 100000;
    KEY_DERIVATION_LENGTH = 32;
    constructor(logger, cacheService, configService) {
        super({
            serviceName: 'KeyManagementService',
            logger,
            enableAuditLogging: true,
        });
        this.cacheService = cacheService;
        this.configService = configService;
    }
    async generateKeyPair(options) {
        const startTime = Date.now();
        try {
            const keySize = options.keySize || this.DEFAULT_KEY_SIZE;
            const keyId = options.keyId || this.generateKeyId(options.userId);
            this.logInfo(`Generating RSA-${keySize} key pair for user: ${this.sanitizeUserId(options.userId)}`);
            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: keySize,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                },
            });
            const keyPair = {
                publicKey,
                privateKey,
                keySize,
                createdAt: new Date(),
                expiresAt: options.expirationTime
                    ? new Date(Date.now() + options.expirationTime * 1000)
                    : new Date(Date.now() + this.DEFAULT_EXPIRATION * 1000),
            };
            const metadata = {
                keyId,
                userId: options.userId,
                keyType: interfaces_1.KeyType.PRIVATE,
                status: interfaces_1.KeyStatus.ACTIVE,
                version: 1,
                createdAt: Date.now(),
                expiresAt: keyPair.expiresAt?.getTime(),
                algorithm: 'RSA-OAEP',
            };
            if (options.cache !== false) {
                await this.cachePublicKey(options.userId, publicKey, keyId);
            }
            const duration = Date.now() - startTime;
            this.logInfo(`Key pair generated successfully in ${duration}ms for user: ${this.sanitizeUserId(options.userId)}`);
            return {
                success: true,
                keyPair,
                keyId,
                metadata,
            };
        }
        catch (error) {
            this.logError(`Key generation failed for user: ${this.sanitizeUserId(options.userId)}`, {
                error: error.message,
                userId: this.sanitizeUserId(options.userId),
            });
            return {
                success: false,
                error: 'KEY_GENERATION_FAILED',
                message: 'Failed to generate encryption keys',
            };
        }
    }
    async getPublicKey(userId) {
        try {
            const cacheKey = this.buildCacheKey('public', userId);
            const cached = await this.cacheService.get(cacheKey);
            if (cached) {
                this.logDebug(`Public key retrieved from cache for user: ${this.sanitizeUserId(userId)}`);
                return cached;
            }
            this.logDebug(`Public key not found for user: ${this.sanitizeUserId(userId)}`);
            return null;
        }
        catch (error) {
            this.logError(`Failed to retrieve public key for user: ${this.sanitizeUserId(userId)}`, {
                error: error.message,
            });
            return null;
        }
    }
    async getPrivateKey(userId, passphrase) {
        try {
            const cacheKey = this.buildCacheKey('private', userId);
            const encryptedStorage = await this.cacheService.get(cacheKey);
            if (!encryptedStorage) {
                this.logDebug(`Private key not found for user: ${this.sanitizeUserId(userId)}`);
                return null;
            }
            const privateKey = await this.decryptPrivateKey(encryptedStorage, passphrase);
            this.logDebug(`Private key decrypted for user: ${this.sanitizeUserId(userId)}`);
            return privateKey;
        }
        catch (error) {
            this.logError(`Failed to retrieve/decrypt private key for user: ${this.sanitizeUserId(userId)}`, {
                error: error.message,
            });
            return null;
        }
    }
    async storeUserKeys(userId, keyPair, passphrase) {
        const keyId = this.generateKeyId(userId);
        try {
            const encryptedStorage = await this.encryptPrivateKey(keyPair.privateKey, passphrase);
            const privateKeyCache = this.buildCacheKey('private', userId);
            await this.cacheService.set(privateKeyCache, encryptedStorage, {
                ttl: 24 * 60 * 60,
                namespace: 'encryption',
            });
            await this.cachePublicKey(userId, keyPair.publicKey, keyId);
            this.logInfo(`User keys stored successfully for user: ${this.sanitizeUserId(userId)}`);
            return keyId;
        }
        catch (error) {
            this.logError(`Failed to store user keys for user: ${this.sanitizeUserId(userId)}`, {
                error: error.message,
            });
            throw new Error('Failed to store encryption keys');
        }
    }
    async rotateUserKeys(userId, options) {
        this.logInfo(`Rotating keys for user: ${this.sanitizeUserId(userId)}`, {
            reason: options?.reason || 'scheduled_rotation',
        });
        try {
            const currentKeyId = await this.getCurrentKeyId(userId);
            const result = await this.generateKeyPair({
                userId,
                keySize: 4096,
            });
            if (!result.success) {
                return result;
            }
            if (currentKeyId && !options?.revokeOldKey) {
                await this.markKeyAsRotated(currentKeyId, result.keyId);
            }
            else if (currentKeyId && options?.revokeOldKey) {
                await this.revokeKey(currentKeyId, 'rotated');
            }
            this.logInfo(`Key rotation completed for user: ${this.sanitizeUserId(userId)}`);
            return result;
        }
        catch (error) {
            this.logError(`Key rotation failed for user: ${this.sanitizeUserId(userId)}`, {
                error: error.message,
            });
            return {
                success: false,
                error: 'KEY_ROTATION_FAILED',
                message: 'Failed to rotate encryption keys',
            };
        }
    }
    async revokeUserKeys(userId, reason) {
        try {
            this.logWarning(`Revoking keys for user: ${this.sanitizeUserId(userId)}`, { reason });
            const keyId = await this.getCurrentKeyId(userId);
            if (keyId) {
                await this.revokeKey(keyId, reason);
            }
            await this.cacheService.delete(this.buildCacheKey('public', userId));
            await this.cacheService.delete(this.buildCacheKey('private', userId));
            await this.cacheService.delete(this.buildCacheKey('metadata', userId));
            this.logInfo(`Keys revoked successfully for user: ${this.sanitizeUserId(userId)}`);
            return true;
        }
        catch (error) {
            this.logError(`Key revocation failed for user: ${this.sanitizeUserId(userId)}`, {
                error: error.message,
            });
            return false;
        }
    }
    async getKeyMetadata(keyId) {
        try {
            const cacheKey = `encryption:metadata:${keyId}`;
            return await this.cacheService.get(cacheKey);
        }
        catch (error) {
            this.logError(`Failed to retrieve key metadata for key: ${keyId}`, {
                error: error.message,
            });
            return null;
        }
    }
    async hasValidKeys(userId) {
        const publicKey = await this.getPublicKey(userId);
        return publicKey !== null;
    }
    async encryptWithPublicKey(data, publicKey) {
        try {
            const buffer = Buffer.from(data, 'utf8');
            const encrypted = crypto.publicEncrypt({
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            }, buffer);
            return encrypted.toString('base64');
        }
        catch (error) {
            this.logError('Public key encryption failed', {
                error: error.message,
            });
            throw new Error('Failed to encrypt with public key');
        }
    }
    async decryptWithPrivateKey(encryptedData, privateKey) {
        try {
            const buffer = Buffer.from(encryptedData, 'base64');
            const decrypted = crypto.privateDecrypt({
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            }, buffer);
            return decrypted.toString('utf8');
        }
        catch (error) {
            this.logError('Private key decryption failed', {
                error: error.message,
            });
            throw new Error('Failed to decrypt with private key');
        }
    }
    async deriveKey(passphrase, salt, iterations = this.PBKDF2_ITERATIONS) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(passphrase, salt, iterations, this.KEY_DERIVATION_LENGTH, 'sha256', (err, derivedKey) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(derivedKey);
                }
            });
        });
    }
    generateRandomKey(length) {
        return crypto.randomBytes(length);
    }
    async encryptPrivateKey(privateKey, passphrase) {
        const salt = this.generateRandomKey(32);
        const derivedKey = await this.deriveKey(passphrase, salt);
        const iv = this.generateRandomKey(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);
        let encrypted = cipher.update(privateKey, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        const authTag = cipher.getAuthTag();
        return {
            encryptedKey: encrypted,
            algorithm: 'aes-256-gcm',
            iv: iv.toString('base64'),
            authTag: authTag.toString('base64'),
            kdf: 'pbkdf2',
            salt: salt.toString('base64'),
        };
    }
    async decryptPrivateKey(storage, passphrase) {
        const salt = Buffer.from(storage.salt, 'base64');
        const derivedKey = await this.deriveKey(passphrase, salt);
        const iv = Buffer.from(storage.iv, 'base64');
        const authTag = Buffer.from(storage.authTag, 'base64');
        const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(storage.encryptedKey, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    async cachePublicKey(userId, publicKey, keyId) {
        const cacheKey = this.buildCacheKey('public', userId);
        await this.cacheService.set(cacheKey, publicKey, {
            ttl: 24 * 60 * 60,
            namespace: 'encryption',
        });
        const keyIdCache = this.buildCacheKey('key-id', userId);
        await this.cacheService.set(keyIdCache, keyId, {
            ttl: 24 * 60 * 60,
            namespace: 'encryption',
        });
    }
    generateKeyId(userId) {
        const timestamp = Date.now();
        const random = crypto.randomBytes(8).toString('hex');
        return `key_${userId}_${timestamp}_${random}`;
    }
    buildCacheKey(type, userId) {
        return `encryption:${type}:${userId}`;
    }
    async getCurrentKeyId(userId) {
        const cacheKey = this.buildCacheKey('key-id', userId);
        return await this.cacheService.get(cacheKey);
    }
    async markKeyAsRotated(oldKeyId, newKeyId) {
        const metadata = await this.getKeyMetadata(oldKeyId);
        if (metadata) {
            metadata.status = interfaces_1.KeyStatus.ROTATED;
            const cacheKey = `encryption:metadata:${oldKeyId}`;
            await this.cacheService.set(cacheKey, metadata, {
                ttl: 30 * 24 * 60 * 60,
                namespace: 'encryption',
            });
        }
    }
    async revokeKey(keyId, reason) {
        const metadata = await this.getKeyMetadata(keyId);
        if (metadata) {
            metadata.status = interfaces_1.KeyStatus.REVOKED;
            const cacheKey = `encryption:metadata:${keyId}`;
            await this.cacheService.set(cacheKey, metadata, {
                ttl: 90 * 24 * 60 * 60,
                namespace: 'encryption',
            });
            this.logWarning(`Key revoked: ${keyId}`, { reason });
        }
    }
    sanitizeUserId(userId) {
        if (userId.length <= 8)
            return userId;
        return `${userId.substring(0, 8)}...`;
    }
};
exports.KeyManagementService = KeyManagementService;
exports.KeyManagementService = KeyManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        cache_service_1.CacheService,
        config_1.ConfigService])
], KeyManagementService);
//# sourceMappingURL=key-management.service.js.map