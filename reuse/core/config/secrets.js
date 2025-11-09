"use strict";
/**
 * @fileoverview Secrets Management Utilities
 * @module core/config/secrets
 *
 * Secure secrets management including encryption, decryption,
 * secret rotation, and integration with secret management services.
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretManager = void 0;
exports.encryptSecret = encryptSecret;
exports.decryptSecret = decryptSecret;
exports.generateEncryptionKey = generateEncryptionKey;
exports.createMemorySecretStorage = createMemorySecretStorage;
exports.createSecretManager = createSecretManager;
exports.hashSecret = hashSecret;
exports.compareHash = compareHash;
exports.maskSecret = maskSecret;
exports.validateSecretStrength = validateSecretStrength;
exports.generateRandomSecret = generateRandomSecret;
const crypto = __importStar(require("crypto"));
/**
 * Encrypts a secret value
 *
 * @param value - Secret value to encrypt
 * @param key - Encryption key (32 bytes for AES-256)
 * @param algorithm - Encryption algorithm
 * @returns Encrypted secret object
 *
 * @example
 * ```typescript
 * const key = crypto.randomBytes(32);
 * const encrypted = encryptSecret('my-secret-value', key);
 * ```
 */
function encryptSecret(value, key, algorithm = 'aes-256-gcm') {
    // Validate key length
    if (key.length !== 32) {
        throw new Error('Encryption key must be 32 bytes for AES-256');
    }
    // Generate random IV
    const iv = crypto.randomBytes(16);
    if (algorithm === 'aes-256-gcm') {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
        const authTag = cipher.getAuthTag();
        return {
            encrypted: encrypted.toString('base64'),
            iv: iv.toString('base64'),
            authTag: authTag.toString('base64'),
            algorithm,
        };
    }
    else {
        // AES-256-CBC
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
        return {
            encrypted: encrypted.toString('base64'),
            iv: iv.toString('base64'),
            algorithm,
        };
    }
}
/**
 * Decrypts an encrypted secret
 *
 * @param encrypted - Encrypted secret object
 * @param key - Decryption key (must match encryption key)
 * @returns Decrypted secret value
 *
 * @example
 * ```typescript
 * const decrypted = decryptSecret(encrypted, key);
 * ```
 */
function decryptSecret(encrypted, key) {
    // Validate key length
    if (key.length !== 32) {
        throw new Error('Decryption key must be 32 bytes for AES-256');
    }
    const iv = Buffer.from(encrypted.iv, 'base64');
    const encryptedData = Buffer.from(encrypted.encrypted, 'base64');
    if (encrypted.algorithm === 'aes-256-gcm') {
        if (!encrypted.authTag) {
            throw new Error('Authentication tag is required for GCM mode');
        }
        const decipher = crypto.createDecipheriv(encrypted.algorithm, key, iv);
        decipher.setAuthTag(Buffer.from(encrypted.authTag, 'base64'));
        const decrypted = Buffer.concat([
            decipher.update(encryptedData),
            decipher.final(),
        ]);
        return decrypted.toString('utf8');
    }
    else {
        // AES-256-CBC
        const decipher = crypto.createDecipheriv(encrypted.algorithm, key, iv);
        const decrypted = Buffer.concat([
            decipher.update(encryptedData),
            decipher.final(),
        ]);
        return decrypted.toString('utf8');
    }
}
/**
 * Generates a secure random encryption key
 *
 * @param length - Key length in bytes (default: 32 for AES-256)
 * @returns Random encryption key
 */
function generateEncryptionKey(length = 32) {
    return crypto.randomBytes(length);
}
/**
 * Creates an in-memory secret storage
 *
 * @returns Secret storage instance
 */
function createMemorySecretStorage() {
    const secrets = new Map();
    return {
        async get(key) {
            return secrets.get(key) || null;
        },
        async set(key, value) {
            secrets.set(key, value);
        },
        async delete(key) {
            secrets.delete(key);
        },
        async list() {
            return Array.from(secrets.keys());
        },
    };
}
/**
 * Secret manager for handling encrypted secrets
 */
class SecretManager {
    constructor(storage, encryptionKey) {
        this.storage = storage;
        this.encryptionKey = encryptionKey;
    }
    /**
     * Stores an encrypted secret
     *
     * @param key - Secret key
     * @param value - Secret value
     * @param algorithm - Encryption algorithm
     */
    async setSecret(key, value, algorithm = 'aes-256-gcm') {
        const encrypted = encryptSecret(value, this.encryptionKey, algorithm);
        await this.storage.set(key, JSON.stringify(encrypted));
    }
    /**
     * Retrieves and decrypts a secret
     *
     * @param key - Secret key
     * @returns Decrypted secret value or null if not found
     */
    async getSecret(key) {
        const encryptedData = await this.storage.get(key);
        if (!encryptedData) {
            return null;
        }
        try {
            const encrypted = JSON.parse(encryptedData);
            return decryptSecret(encrypted, this.encryptionKey);
        }
        catch (error) {
            console.error(`Failed to decrypt secret ${key}:`, error);
            return null;
        }
    }
    /**
     * Deletes a secret
     *
     * @param key - Secret key
     */
    async deleteSecret(key) {
        await this.storage.delete(key);
    }
    /**
     * Lists all secret keys
     *
     * @returns Array of secret keys
     */
    async listSecrets() {
        return this.storage.list();
    }
    /**
     * Rotates encryption key by re-encrypting all secrets
     *
     * @param newKey - New encryption key
     */
    async rotateKey(newKey) {
        const keys = await this.listSecrets();
        for (const key of keys) {
            const value = await this.getSecret(key);
            if (value) {
                // Re-encrypt with new key
                const encrypted = encryptSecret(value, newKey);
                await this.storage.set(key, JSON.stringify(encrypted));
            }
        }
        this.encryptionKey = newKey;
    }
    /**
     * Checks if a secret exists
     *
     * @param key - Secret key
     * @returns True if secret exists
     */
    async hasSecret(key) {
        const value = await this.storage.get(key);
        return value !== null;
    }
}
exports.SecretManager = SecretManager;
/**
 * Creates a secret manager instance
 *
 * @param storage - Secret storage implementation
 * @param encryptionKey - Encryption key (will be generated if not provided)
 * @returns Secret manager instance
 *
 * @example
 * ```typescript
 * const manager = createSecretManager(createMemorySecretStorage());
 * await manager.setSecret('api-key', 'my-secret-api-key');
 * const apiKey = await manager.getSecret('api-key');
 * ```
 */
function createSecretManager(storage, encryptionKey) {
    const key = encryptionKey || generateEncryptionKey();
    return new SecretManager(storage, key);
}
/**
 * Hashes a secret value (one-way)
 *
 * @param value - Value to hash
 * @param algorithm - Hash algorithm
 * @returns Hashed value
 */
function hashSecret(value, algorithm = 'sha256') {
    return crypto.createHash(algorithm).update(value).digest('hex');
}
/**
 * Compares a value with a hashed secret
 *
 * @param value - Value to compare
 * @param hash - Hashed value
 * @param algorithm - Hash algorithm
 * @returns True if values match
 */
function compareHash(value, hash, algorithm = 'sha256') {
    const valueHash = hashSecret(value, algorithm);
    return crypto.timingSafeEqual(Buffer.from(valueHash), Buffer.from(hash));
}
/**
 * Masks a secret value for display
 *
 * @param value - Secret value
 * @param visibleChars - Number of characters to show at start and end
 * @returns Masked value
 *
 * @example
 * ```typescript
 * maskSecret('my-secret-api-key', 3);
 * // 'my-***-key'
 * ```
 */
function maskSecret(value, visibleChars = 4) {
    if (value.length <= visibleChars * 2) {
        return '*'.repeat(value.length);
    }
    const start = value.substring(0, visibleChars);
    const end = value.substring(value.length - visibleChars);
    const middle = '*'.repeat(Math.min(10, value.length - visibleChars * 2));
    return `${start}${middle}${end}`;
}
/**
 * Validates secret strength
 *
 * @param value - Secret value to validate
 * @param options - Validation options
 * @returns Validation result
 */
function validateSecretStrength(value, options = {}) {
    const { minLength = 12, requireUppercase = true, requireLowercase = true, requireNumbers = true, requireSpecialChars = true, } = options;
    const errors = [];
    if (value.length < minLength) {
        errors.push(`Secret must be at least ${minLength} characters`);
    }
    if (requireUppercase && !/[A-Z]/.test(value)) {
        errors.push('Secret must contain at least one uppercase letter');
    }
    if (requireLowercase && !/[a-z]/.test(value)) {
        errors.push('Secret must contain at least one lowercase letter');
    }
    if (requireNumbers && !/[0-9]/.test(value)) {
        errors.push('Secret must contain at least one number');
    }
    if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
        errors.push('Secret must contain at least one special character');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Generates a random secret value
 *
 * @param length - Secret length
 * @param charset - Character set to use
 * @returns Random secret
 */
function generateRandomSecret(length = 32, charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*') {
    const bytes = crypto.randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset[bytes[i] % charset.length];
    }
    return result;
}
//# sourceMappingURL=secrets.js.map