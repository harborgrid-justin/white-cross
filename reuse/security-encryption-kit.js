"use strict";
/**
 * LOC: SECENC1234567
 * File: /reuse/security-encryption-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS security services
 *   - Encryption middleware
 *   - Data protection services
 *   - Security interceptors
 *   - HIPAA compliance modules
 *   - Sequelize models
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
exports.getEncryptionKeyModelAttributes = getEncryptionKeyModelAttributes;
exports.getSecurityEventModelAttributes = getSecurityEventModelAttributes;
exports.getTokenizedDataModelAttributes = getTokenizedDataModelAttributes;
exports.getSecureSessionModelAttributes = getSecureSessionModelAttributes;
exports.encryptAES = encryptAES;
exports.decryptAES = decryptAES;
exports.encryptAESCBC = encryptAESCBC;
exports.decryptAESCBC = decryptAESCBC;
exports.generateRSAKeyPair = generateRSAKeyPair;
exports.encryptRSA = encryptRSA;
exports.decryptRSA = decryptRSA;
exports.hashSHA256 = hashSHA256;
exports.hashSHA512 = hashSHA512;
exports.hashData = hashData;
exports.hashPasswordBcrypt = hashPasswordBcrypt;
exports.verifyPasswordBcrypt = verifyPasswordBcrypt;
exports.hashPasswordArgon2 = hashPasswordArgon2;
exports.verifyPasswordArgon2 = verifyPasswordArgon2;
exports.generateHMAC = generateHMAC;
exports.verifyHMAC = verifyHMAC;
exports.generateTimestampedHMAC = generateTimestampedHMAC;
exports.verifyTimestampedHMAC = verifyTimestampedHMAC;
exports.generateEncryptionKey = generateEncryptionKey;
exports.createKeyRotationPolicy = createKeyRotationPolicy;
exports.shouldRotateKey = shouldRotateKey;
exports.rotateEncryptionKey = rotateEncryptionKey;
exports.deriveKeyFromMaster = deriveKeyFromMaster;
exports.generateSecureRandomBytes = generateSecureRandomBytes;
exports.generateSecureRandomString = generateSecureRandomString;
exports.generateSecureRandomInt = generateSecureRandomInt;
exports.generateSecureToken = generateSecureToken;
exports.maskPIIData = maskPIIData;
exports.maskEmail = maskEmail;
exports.maskPhoneNumber = maskPhoneNumber;
exports.maskCreditCard = maskCreditCard;
exports.maskSSN = maskSSN;
exports.tokenizeSensitiveData = tokenizeSensitiveData;
exports.detokenizeSensitiveData = detokenizeSensitiveData;
exports.checkSQLInjection = checkSQLInjection;
exports.sanitizeSQLInput = sanitizeSQLInput;
exports.sanitizeSQLLikePattern = sanitizeSQLLikePattern;
exports.checkXSS = checkXSS;
exports.sanitizeHTML = sanitizeHTML;
exports.stripHTMLTags = stripHTMLTags;
exports.sanitizeInput = sanitizeInput;
exports.generateCSRFToken = generateCSRFToken;
exports.verifyCSRFToken = verifyCSRFToken;
exports.generateDoubleSubmitCSRFToken = generateDoubleSubmitCSRFToken;
exports.buildCSPHeader = buildCSPHeader;
exports.getStrictCSP = getStrictCSP;
exports.generateCSPNonce = generateCSPNonce;
exports.getSecurityHeaders = getSecurityHeaders;
exports.getHIPAASecurityHeaders = getHIPAASecurityHeaders;
exports.encodeOutput = encodeOutput;
exports.decodeOutput = decodeOutput;
exports.deriveKeyPBKDF2 = deriveKeyPBKDF2;
exports.verifyPBKDF2 = verifyPBKDF2;
exports.deriveMultipleKeys = deriveMultipleKeys;
exports.createSecurityEvent = createSecurityEvent;
exports.logSecurityEvent = logSecurityEvent;
/**
 * File: /reuse/security-encryption-kit.ts
 * Locator: WC-UTL-SECENC-001
 * Purpose: Comprehensive Security & Encryption Kit - Complete cryptography and security toolkit for NestJS + Sequelize
 *
 * Upstream: Independent utility module for encryption, hashing, and security operations
 * Downstream: ../backend/*, Security services, Encryption middleware, Data protection, HIPAA compliance modules
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, bcrypt, argon2, crypto, sequelize
 * Exports: 45+ utility functions for encryption, hashing, HMAC, key management, PII masking, SQL/XSS prevention, CSP, security headers, Sequelize models
 *
 * LLM Context: Enterprise-grade security and encryption utilities for White Cross healthcare platform.
 * Provides comprehensive AES/RSA encryption, SHA/bcrypt/argon2 hashing, HMAC signatures, cryptographic key
 * derivation (PBKDF2), secure key management and rotation, PII data masking and tokenization, SQL injection
 * prevention, XSS protection, CSRF token generation, Content Security Policy helpers, security headers management,
 * input sanitization, output encoding, secure random generation, and HIPAA-compliant encryption patterns for
 * protecting sensitive healthcare data (PHI). Includes Sequelize models for encryption_keys and security_events.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Sequelize EncryptionKey model attributes for key management.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class EncryptionKey extends Model {
 *   declare id: string;
 *   declare keyId: string;
 *   declare encryptedKey: string;
 *   // ... other fields
 * }
 *
 * EncryptionKey.init(getEncryptionKeyModelAttributes(), {
 *   sequelize,
 *   tableName: 'encryption_keys',
 *   timestamps: true
 * });
 * ```
 */
function getEncryptionKeyModelAttributes() {
    return {
        id: {
            type: 'UUID',
            defaultValue: 'UUIDV4',
            primaryKey: true,
        },
        keyId: {
            type: 'STRING',
            allowNull: false,
            unique: true,
            comment: 'Unique identifier for the encryption key',
        },
        encryptedKey: {
            type: 'TEXT',
            allowNull: false,
            comment: 'The encryption key itself (encrypted at rest)',
        },
        kekId: {
            type: 'STRING',
            allowNull: true,
            comment: 'Key Encryption Key ID used to encrypt this key',
        },
        algorithm: {
            type: 'STRING',
            allowNull: false,
            defaultValue: 'aes-256-gcm',
            comment: 'Encryption algorithm (e.g., aes-256-gcm, rsa-2048)',
        },
        version: {
            type: 'INTEGER',
            allowNull: false,
            defaultValue: 1,
            comment: 'Key version for rotation tracking',
        },
        purpose: {
            type: 'STRING',
            allowNull: false,
            comment: 'Purpose of the key (e.g., data, session, pii)',
        },
        status: {
            type: 'ENUM',
            values: ['active', 'rotating', 'deprecated', 'revoked'],
            defaultValue: 'active',
            comment: 'Current status of the key',
        },
        createdAt: {
            type: 'DATE',
            allowNull: false,
        },
        rotatedAt: {
            type: 'DATE',
            allowNull: true,
            comment: 'When the key was last rotated',
        },
        expiresAt: {
            type: 'DATE',
            allowNull: true,
            comment: 'When the key expires',
        },
        rotateAfterDays: {
            type: 'INTEGER',
            allowNull: true,
            defaultValue: 90,
            comment: 'Number of days before automatic rotation',
        },
        metadata: {
            type: 'JSONB',
            allowNull: true,
            comment: 'Additional key metadata',
        },
    };
}
/**
 * Sequelize SecurityEvent model attributes for security audit logging.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class SecurityEvent extends Model {
 *   declare id: string;
 *   declare eventType: string;
 *   declare severity: string;
 *   // ... other fields
 * }
 *
 * SecurityEvent.init(getSecurityEventModelAttributes(), {
 *   sequelize,
 *   tableName: 'security_events',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['eventType'] },
 *     { fields: ['severity'] },
 *     { fields: ['userId'] },
 *     { fields: ['timestamp'] }
 *   ]
 * });
 * ```
 */
function getSecurityEventModelAttributes() {
    return {
        id: {
            type: 'UUID',
            defaultValue: 'UUIDV4',
            primaryKey: true,
        },
        eventId: {
            type: 'STRING',
            allowNull: false,
            unique: true,
            comment: 'Unique identifier for the security event',
        },
        eventType: {
            type: 'ENUM',
            values: [
                'encryption',
                'decryption',
                'key_rotation',
                'key_access',
                'pii_access',
                'pii_masking',
                'tokenization',
                'sql_injection_attempt',
                'xss_attempt',
                'csrf_validation',
                'csrf_failure',
                'auth_failure',
                'unauthorized_access',
                'data_breach_attempt',
                'suspicious_activity',
            ],
            allowNull: false,
            comment: 'Type of security event',
        },
        severity: {
            type: 'ENUM',
            values: ['info', 'warning', 'error', 'critical'],
            allowNull: false,
            defaultValue: 'info',
            comment: 'Severity level of the event',
        },
        userId: {
            type: 'UUID',
            allowNull: true,
            comment: 'User ID associated with the event',
        },
        ipAddress: {
            type: 'STRING',
            allowNull: true,
            comment: 'IP address of the request',
        },
        userAgent: {
            type: 'TEXT',
            allowNull: true,
            comment: 'User agent string',
        },
        resource: {
            type: 'STRING',
            allowNull: true,
            comment: 'Resource being accessed or affected',
        },
        action: {
            type: 'STRING',
            allowNull: true,
            comment: 'Action being performed',
        },
        result: {
            type: 'ENUM',
            values: ['success', 'failure', 'blocked', 'warning'],
            allowNull: false,
            defaultValue: 'success',
            comment: 'Result of the security operation',
        },
        details: {
            type: 'JSONB',
            allowNull: false,
            defaultValue: {},
            comment: 'Detailed information about the event',
        },
        metadata: {
            type: 'JSONB',
            allowNull: true,
            comment: 'Additional event metadata',
        },
        timestamp: {
            type: 'DATE',
            allowNull: false,
            defaultValue: 'NOW',
            comment: 'When the event occurred',
        },
    };
}
/**
 * Sequelize TokenizedData model attributes for PII tokenization tracking.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class TokenizedData extends Model {
 *   declare id: string;
 *   declare token: string;
 *   declare tokenHash: string;
 *   // ... other fields
 * }
 *
 * TokenizedData.init(getTokenizedDataModelAttributes(), {
 *   sequelize,
 *   tableName: 'tokenized_data',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['tokenHash'], unique: true },
 *     { fields: ['userId'] },
 *     { fields: ['dataType'] }
 *   ]
 * });
 * ```
 */
function getTokenizedDataModelAttributes() {
    return {
        id: {
            type: 'UUID',
            defaultValue: 'UUIDV4',
            primaryKey: true,
        },
        token: {
            type: 'STRING',
            allowNull: false,
            unique: true,
            comment: 'The tokenized value',
        },
        tokenHash: {
            type: 'STRING',
            allowNull: false,
            unique: true,
            comment: 'Hash of the token for verification',
        },
        encryptedOriginal: {
            type: 'TEXT',
            allowNull: false,
            comment: 'The original value (encrypted)',
        },
        iv: {
            type: 'STRING',
            allowNull: false,
            comment: 'Initialization vector for encryption',
        },
        authTag: {
            type: 'STRING',
            allowNull: true,
            comment: 'Authentication tag for GCM mode',
        },
        dataType: {
            type: 'STRING',
            allowNull: false,
            comment: 'Type of data (e.g., ssn, credit_card, email)',
        },
        userId: {
            type: 'UUID',
            allowNull: true,
            comment: 'User ID associated with the tokenized data',
        },
        keyId: {
            type: 'STRING',
            allowNull: false,
            comment: 'Encryption key ID used',
        },
        algorithm: {
            type: 'STRING',
            allowNull: false,
            defaultValue: 'aes-256-gcm',
            comment: 'Encryption algorithm used',
        },
        createdAt: {
            type: 'DATE',
            allowNull: false,
        },
        expiresAt: {
            type: 'DATE',
            allowNull: true,
            comment: 'When the token expires',
        },
        accessCount: {
            type: 'INTEGER',
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of times the token was accessed',
        },
        lastAccessedAt: {
            type: 'DATE',
            allowNull: true,
            comment: 'When the token was last accessed',
        },
        metadata: {
            type: 'JSONB',
            allowNull: true,
            comment: 'Additional tokenization metadata',
        },
    };
}
/**
 * Sequelize SecureSession model attributes for encrypted session storage.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class SecureSession extends Model {
 *   declare id: string;
 *   declare sessionId: string;
 *   declare encryptedData: string;
 *   // ... other fields
 * }
 *
 * SecureSession.init(getSecureSessionModelAttributes(), {
 *   sequelize,
 *   tableName: 'secure_sessions',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['sessionId'], unique: true },
 *     { fields: ['userId'] },
 *     { fields: ['expiresAt'] }
 *   ]
 * });
 * ```
 */
function getSecureSessionModelAttributes() {
    return {
        id: {
            type: 'UUID',
            defaultValue: 'UUIDV4',
            primaryKey: true,
        },
        sessionId: {
            type: 'STRING',
            allowNull: false,
            unique: true,
            comment: 'Unique session identifier',
        },
        userId: {
            type: 'UUID',
            allowNull: false,
            comment: 'User ID associated with the session',
        },
        encryptedData: {
            type: 'TEXT',
            allowNull: false,
            comment: 'Encrypted session data',
        },
        iv: {
            type: 'STRING',
            allowNull: false,
            comment: 'Initialization vector for encryption',
        },
        authTag: {
            type: 'STRING',
            allowNull: true,
            comment: 'Authentication tag for GCM mode',
        },
        keyId: {
            type: 'STRING',
            allowNull: false,
            comment: 'Encryption key ID used',
        },
        ipAddress: {
            type: 'STRING',
            allowNull: true,
            comment: 'IP address of the session',
        },
        userAgent: {
            type: 'TEXT',
            allowNull: true,
            comment: 'User agent string',
        },
        createdAt: {
            type: 'DATE',
            allowNull: false,
        },
        expiresAt: {
            type: 'DATE',
            allowNull: false,
            comment: 'When the session expires',
        },
        lastAccessedAt: {
            type: 'DATE',
            allowNull: false,
            defaultValue: 'NOW',
            comment: 'When the session was last accessed',
        },
        isActive: {
            type: 'BOOLEAN',
            allowNull: false,
            defaultValue: true,
            comment: 'Whether the session is active',
        },
        metadata: {
            type: 'JSONB',
            allowNull: true,
            comment: 'Additional session metadata',
        },
    };
}
// ============================================================================
// AES ENCRYPTION UTILITIES
// ============================================================================
/**
 * Encrypts data using AES-256-GCM encryption.
 *
 * @param data - The data to encrypt
 * @param key - The encryption key (32 bytes for AES-256)
 * @param config - Optional encryption configuration
 * @returns The encrypted data with IV and auth tag
 *
 * @example
 * ```typescript
 * const key = crypto.randomBytes(32);
 * const encrypted = encryptAES('sensitive data', key);
 * console.log(encrypted.encryptedData); // Base64 encoded
 * ```
 */
function encryptAES(data, key, config) {
    const algorithm = config?.algorithm || 'aes-256-gcm';
    const keyBuffer = typeof key === 'string' ? Buffer.from(key, 'hex') : key;
    const iv = config?.iv || crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const authTag = algorithm.includes('gcm') ? cipher.getAuthTag().toString('base64') : undefined;
    return {
        encryptedData: encrypted,
        iv: iv.toString('base64'),
        authTag,
        algorithm,
        keyId: config?.key,
    };
}
/**
 * Decrypts data encrypted with AES-256-GCM.
 *
 * @param encryptedData - The encrypted data object
 * @param key - The decryption key
 * @returns The decrypted plaintext
 *
 * @example
 * ```typescript
 * const key = crypto.randomBytes(32);
 * const encrypted = encryptAES('sensitive data', key);
 * const decrypted = decryptAES(encrypted, key);
 * console.log(decrypted); // 'sensitive data'
 * ```
 */
function decryptAES(encryptedData, key) {
    const keyBuffer = typeof key === 'string' ? Buffer.from(key, 'hex') : key;
    const iv = Buffer.from(encryptedData.iv, 'base64');
    const decipher = crypto.createDecipheriv(encryptedData.algorithm, keyBuffer, iv);
    if (encryptedData.authTag) {
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'base64'));
    }
    let decrypted = decipher.update(encryptedData.encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
/**
 * Encrypts data using AES-256-CBC encryption.
 *
 * @param data - The data to encrypt
 * @param key - The encryption key (32 bytes for AES-256)
 * @param iv - Optional initialization vector (16 bytes)
 * @returns The encrypted data with IV
 *
 * @example
 * ```typescript
 * const key = crypto.randomBytes(32);
 * const encrypted = encryptAESCBC('sensitive data', key);
 * ```
 */
function encryptAESCBC(data, key, iv) {
    const keyBuffer = typeof key === 'string' ? Buffer.from(key, 'hex') : key;
    const ivBuffer = iv || crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return {
        encryptedData: encrypted,
        iv: ivBuffer.toString('base64'),
        algorithm: 'aes-256-cbc',
    };
}
/**
 * Decrypts data encrypted with AES-256-CBC.
 *
 * @param encryptedData - The encrypted data object
 * @param key - The decryption key
 * @returns The decrypted plaintext
 *
 * @example
 * ```typescript
 * const key = crypto.randomBytes(32);
 * const encrypted = encryptAESCBC('sensitive data', key);
 * const decrypted = decryptAESCBC(encrypted, key);
 * ```
 */
function decryptAESCBC(encryptedData, key) {
    const keyBuffer = typeof key === 'string' ? Buffer.from(key, 'hex') : key;
    const iv = Buffer.from(encryptedData.iv, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    let decrypted = decipher.update(encryptedData.encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
// ============================================================================
// RSA ENCRYPTION UTILITIES
// ============================================================================
/**
 * Generates an RSA key pair for asymmetric encryption.
 *
 * @param keySize - The key size in bits (2048, 3072, or 4096)
 * @param format - The output format ('pem' or 'der')
 * @returns The RSA key pair
 *
 * @example
 * ```typescript
 * const keyPair = generateRSAKeyPair(2048, 'pem');
 * console.log(keyPair.publicKey);
 * console.log(keyPair.privateKey);
 * ```
 */
function generateRSAKeyPair(keySize = 2048, format = 'pem') {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: keySize,
        publicKeyEncoding: {
            type: 'spki',
            format,
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format,
        },
    });
    return {
        publicKey: publicKey.toString(),
        privateKey: privateKey.toString(),
        format,
        keySize,
    };
}
/**
 * Encrypts data using RSA public key encryption.
 *
 * @param data - The data to encrypt
 * @param publicKey - The RSA public key in PEM format
 * @param options - Optional RSA encryption options
 * @returns The encrypted data in base64 format
 *
 * @example
 * ```typescript
 * const keyPair = generateRSAKeyPair();
 * const encrypted = encryptRSA('sensitive data', keyPair.publicKey);
 * ```
 */
function encryptRSA(data, publicKey, options) {
    const encrypted = crypto.publicEncrypt({
        key: publicKey,
        padding: options?.padding || crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: options?.oaepHash || 'sha256',
    }, Buffer.from(data, 'utf8'));
    return encrypted.toString('base64');
}
/**
 * Decrypts data encrypted with RSA public key.
 *
 * @param encryptedData - The encrypted data in base64 format
 * @param privateKey - The RSA private key in PEM format
 * @param options - Optional RSA decryption options
 * @returns The decrypted plaintext
 *
 * @example
 * ```typescript
 * const keyPair = generateRSAKeyPair();
 * const encrypted = encryptRSA('sensitive data', keyPair.publicKey);
 * const decrypted = decryptRSA(encrypted, keyPair.privateKey);
 * ```
 */
function decryptRSA(encryptedData, privateKey, options) {
    const decrypted = crypto.privateDecrypt({
        key: privateKey,
        padding: options?.padding || crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: options?.oaepHash || 'sha256',
    }, Buffer.from(encryptedData, 'base64'));
    return decrypted.toString('utf8');
}
// ============================================================================
// HASHING UTILITIES
// ============================================================================
/**
 * Generates a SHA-256 hash of the input data.
 *
 * @param data - The data to hash
 * @param encoding - The output encoding (hex, base64, base64url)
 * @returns The hash string
 *
 * @example
 * ```typescript
 * const hash = hashSHA256('password123');
 * console.log(hash); // SHA-256 hash in hex
 * ```
 */
function hashSHA256(data, encoding = 'hex') {
    return crypto.createHash('sha256').update(data).digest(encoding);
}
/**
 * Generates a SHA-512 hash of the input data.
 *
 * @param data - The data to hash
 * @param encoding - The output encoding (hex, base64, base64url)
 * @returns The hash string
 *
 * @example
 * ```typescript
 * const hash = hashSHA512('password123');
 * console.log(hash); // SHA-512 hash in hex
 * ```
 */
function hashSHA512(data, encoding = 'hex') {
    return crypto.createHash('sha512').update(data).digest(encoding);
}
/**
 * Generates a hash using the specified algorithm.
 *
 * @param data - The data to hash
 * @param config - Hash configuration
 * @returns The hash string
 *
 * @example
 * ```typescript
 * const hash = hashData('password123', { algorithm: 'sha384', encoding: 'base64' });
 * ```
 */
function hashData(data, config) {
    const algorithm = config?.algorithm || 'sha256';
    const encoding = config?.encoding || 'hex';
    return crypto.createHash(algorithm).update(data).digest(encoding);
}
/**
 * Hashes a password using bcrypt or PBKDF2 fallback.
 * Attempts to use bcrypt library if available, otherwise uses secure PBKDF2 implementation.
 *
 * @param password - The password to hash
 * @param config - Bcrypt configuration
 * @returns Promise resolving to the hashed password
 *
 * @example
 * ```typescript
 * const hash = await hashPasswordBcrypt('password123', { saltRounds: 12 });
 * ```
 */
async function hashPasswordBcrypt(password, config) {
    const saltRounds = config?.saltRounds || 10;
    const pepper = config?.pepper || '';
    const passwordWithPepper = password + pepper;
    try {
        // Try to use bcrypt if available
        const bcrypt = require('bcrypt');
        return await bcrypt.hash(passwordWithPepper, saltRounds);
    }
    catch (error) {
        // Bcrypt not available, use PBKDF2 as secure alternative
        console.warn('bcrypt library not available. Using PBKDF2 fallback. Install bcrypt for better performance: npm install bcrypt');
        const salt = crypto.randomBytes(16).toString('hex');
        const iterations = 100000 + saltRounds * 10000; // Scale iterations with salt rounds
        const hash = crypto.pbkdf2Sync(passwordWithPepper, salt, iterations, 64, 'sha512').toString('hex');
        return `pbkdf2:${iterations}:${salt}:${hash}`;
    }
}
/**
 * Verifies a password against a bcrypt hash or PBKDF2 hash.
 * Supports both bcrypt hashes and PBKDF2 fallback hashes.
 *
 * @param password - The password to verify
 * @param hash - The hash to verify against
 * @param pepper - Optional pepper value
 * @returns Promise resolving to true if password matches
 *
 * @example
 * ```typescript
 * const isValid = await verifyPasswordBcrypt('password123', hash);
 * ```
 */
async function verifyPasswordBcrypt(password, hash, pepper) {
    const passwordWithPepper = password + (pepper || '');
    // Check if this is a PBKDF2 fallback hash
    if (hash.startsWith('pbkdf2:')) {
        const parts = hash.split(':');
        const iterations = parseInt(parts[1], 10);
        const salt = parts[2];
        const originalHash = parts[3];
        const verifyHash = crypto.pbkdf2Sync(passwordWithPepper, salt, iterations, 64, 'sha512').toString('hex');
        return originalHash === verifyHash;
    }
    try {
        // Try to use bcrypt if available
        const bcrypt = require('bcrypt');
        return await bcrypt.compare(passwordWithPepper, hash);
    }
    catch (error) {
        console.warn('bcrypt library not available and hash format not recognized');
        return false;
    }
}
/**
 * Hashes a password using Argon2 or PBKDF2 fallback.
 * Attempts to use argon2 library if available, otherwise uses secure PBKDF2 implementation.
 *
 * @param password - The password to hash
 * @param config - Argon2 configuration
 * @returns Promise resolving to the hashed password
 *
 * @example
 * ```typescript
 * const hash = await hashPasswordArgon2('password123', { memoryCost: 65536 });
 * ```
 */
async function hashPasswordArgon2(password, config) {
    try {
        // Try to use argon2 if available
        const argon2 = require('argon2');
        return await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: config?.memoryCost || 65536,
            timeCost: config?.timeCost || 3,
            parallelism: config?.parallelism || 4,
            hashLength: config?.hashLength || 32,
            salt: config?.salt,
        });
    }
    catch (error) {
        // Argon2 not available, use PBKDF2 as secure alternative
        console.warn('argon2 library not available. Using PBKDF2 fallback. Install argon2 for better performance: npm install argon2');
        const salt = config?.salt || crypto.randomBytes(16);
        const iterations = (config?.timeCost || 3) * 30000; // Scale iterations
        const keyLength = config?.hashLength || 32;
        const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha512');
        return `pbkdf2:${iterations}:${salt.toString('hex')}:${hash.toString('hex')}`;
    }
}
/**
 * Verifies a password against an Argon2 hash or PBKDF2 fallback hash.
 * Supports both argon2 hashes and PBKDF2 fallback hashes.
 *
 * @param password - The password to verify
 * @param hash - The hash to verify against
 * @returns Promise resolving to true if password matches
 *
 * @example
 * ```typescript
 * const isValid = await verifyPasswordArgon2('password123', hash);
 * ```
 */
async function verifyPasswordArgon2(password, hash) {
    // Check if this is a PBKDF2 fallback hash
    if (hash.startsWith('pbkdf2:')) {
        const parts = hash.split(':');
        const iterations = parseInt(parts[1], 10);
        const salt = Buffer.from(parts[2], 'hex');
        const originalHash = parts[3];
        const keyLength = originalHash.length / 2; // Hex string length / 2 = byte length
        const verifyHash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha512');
        return originalHash === verifyHash.toString('hex');
    }
    try {
        // Try to use argon2 if available
        const argon2 = require('argon2');
        return await argon2.verify(hash, password);
    }
    catch (error) {
        console.warn('argon2 library not available and hash format not recognized');
        return false;
    }
}
// ============================================================================
// HMAC SIGNATURE UTILITIES
// ============================================================================
/**
 * Generates an HMAC signature for the given data.
 *
 * @param data - The data to sign
 * @param config - HMAC configuration including the secret key
 * @returns The HMAC signature
 *
 * @example
 * ```typescript
 * const signature = generateHMAC('message', { key: 'secret-key' });
 * console.log(signature.signature);
 * ```
 */
function generateHMAC(data, config) {
    const algorithm = config.algorithm || 'sha256';
    const encoding = config.encoding || 'hex';
    const key = typeof config.key === 'string' ? config.key : config.key.toString();
    const hmac = crypto.createHmac(algorithm, key);
    hmac.update(data);
    const signature = hmac.digest(encoding);
    return {
        signature,
        algorithm,
        timestamp: Date.now(),
    };
}
/**
 * Verifies an HMAC signature.
 *
 * @param data - The original data
 * @param signature - The signature to verify
 * @param config - HMAC configuration including the secret key
 * @returns True if signature is valid
 *
 * @example
 * ```typescript
 * const signature = generateHMAC('message', { key: 'secret-key' });
 * const isValid = verifyHMAC('message', signature.signature, { key: 'secret-key' });
 * ```
 */
function verifyHMAC(data, signature, config) {
    const computed = generateHMAC(data, config);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed.signature));
}
/**
 * Generates a timestamped HMAC signature with expiration.
 *
 * @param data - The data to sign
 * @param key - The secret key
 * @param expiresInMs - Expiration time in milliseconds
 * @returns The HMAC signature with timestamp
 *
 * @example
 * ```typescript
 * const signature = generateTimestampedHMAC('message', 'secret-key', 3600000); // 1 hour
 * ```
 */
function generateTimestampedHMAC(data, key, expiresInMs = 3600000) {
    const timestamp = Date.now();
    const expiresAt = timestamp + expiresInMs;
    const payload = `${data}:${timestamp}:${expiresAt}`;
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(payload);
    const signature = hmac.digest('hex');
    return `${timestamp}:${expiresAt}:${signature}`;
}
/**
 * Verifies a timestamped HMAC signature.
 *
 * @param data - The original data
 * @param signedData - The timestamped signature
 * @param key - The secret key
 * @returns True if signature is valid and not expired
 *
 * @example
 * ```typescript
 * const signed = generateTimestampedHMAC('message', 'secret-key');
 * const isValid = verifyTimestampedHMAC('message', signed, 'secret-key');
 * ```
 */
function verifyTimestampedHMAC(data, signedData, key) {
    const [timestamp, expiresAt, signature] = signedData.split(':');
    // Check expiration
    if (Date.now() > parseInt(expiresAt, 10)) {
        return false;
    }
    const payload = `${data}:${timestamp}:${expiresAt}`;
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(payload);
    const computedSignature = hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature));
}
// ============================================================================
// KEY MANAGEMENT AND ROTATION
// ============================================================================
/**
 * Generates a random encryption key of the specified length.
 *
 * @param keyLength - The key length in bytes (16, 24, or 32 for AES)
 * @returns The generated key as a Buffer
 *
 * @example
 * ```typescript
 * const key = generateEncryptionKey(32); // 256-bit key for AES-256
 * ```
 */
function generateEncryptionKey(keyLength = 32) {
    return crypto.randomBytes(keyLength);
}
/**
 * Creates a key rotation policy for managing encryption key lifecycle.
 *
 * @param keyId - Unique identifier for the key
 * @param algorithm - Encryption algorithm
 * @param rotateAfterDays - Number of days before rotation
 * @returns The key rotation policy
 *
 * @example
 * ```typescript
 * const policy = createKeyRotationPolicy('key-001', 'aes-256-gcm', 90);
 * ```
 */
function createKeyRotationPolicy(keyId, algorithm, rotateAfterDays = 90) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + rotateAfterDays * 24 * 60 * 60 * 1000);
    return {
        keyId,
        algorithm,
        createdAt: now,
        rotateAfterDays,
        expiresAt,
        status: 'active',
    };
}
/**
 * Checks if a key needs rotation based on its policy.
 *
 * @param policy - The key rotation policy
 * @returns True if the key needs rotation
 *
 * @example
 * ```typescript
 * const policy = createKeyRotationPolicy('key-001', 'aes-256-gcm', 90);
 * const needsRotation = shouldRotateKey(policy);
 * ```
 */
function shouldRotateKey(policy) {
    if (policy.status !== 'active') {
        return false;
    }
    if (policy.expiresAt && new Date() >= policy.expiresAt) {
        return true;
    }
    return false;
}
/**
 * Rotates an encryption key by generating a new key and updating the policy.
 *
 * @param currentPolicy - The current key rotation policy
 * @param keyLength - The key length in bytes
 * @returns The new key and updated policy
 *
 * @example
 * ```typescript
 * const policy = createKeyRotationPolicy('key-001', 'aes-256-gcm', 90);
 * const { newKey, newPolicy } = rotateEncryptionKey(policy, 32);
 * ```
 */
function rotateEncryptionKey(currentPolicy, keyLength = 32) {
    const newKey = generateEncryptionKey(keyLength);
    const newKeyId = `${currentPolicy.keyId}-v${Date.now()}`;
    const newPolicy = createKeyRotationPolicy(newKeyId, currentPolicy.algorithm, currentPolicy.rotateAfterDays);
    const oldPolicy = {
        ...currentPolicy,
        status: 'deprecated',
    };
    return { newKey, newPolicy, oldPolicy };
}
/**
 * Derives a key from a master key using a context string.
 *
 * @param masterKey - The master encryption key
 * @param context - Context string for key derivation
 * @param keyLength - Derived key length in bytes
 * @returns The derived key
 *
 * @example
 * ```typescript
 * const masterKey = generateEncryptionKey(32);
 * const derivedKey = deriveKeyFromMaster(masterKey, 'user-123-data', 32);
 * ```
 */
function deriveKeyFromMaster(masterKey, context, keyLength = 32) {
    const hmac = crypto.createHmac('sha256', masterKey);
    hmac.update(context);
    const derived = hmac.digest();
    // If we need more bytes, use HKDF-like expansion
    if (keyLength > derived.length) {
        const expanded = Buffer.alloc(keyLength);
        derived.copy(expanded, 0);
        let offset = derived.length;
        let counter = 1;
        while (offset < keyLength) {
            const hmac2 = crypto.createHmac('sha256', masterKey);
            hmac2.update(Buffer.concat([derived, Buffer.from(counter.toString())]));
            const block = hmac2.digest();
            const copyLength = Math.min(block.length, keyLength - offset);
            block.copy(expanded, offset, 0, copyLength);
            offset += copyLength;
            counter++;
        }
        return expanded;
    }
    return derived.slice(0, keyLength);
}
// ============================================================================
// SECURE RANDOM GENERATION
// ============================================================================
/**
 * Generates cryptographically secure random bytes.
 *
 * @param length - Number of bytes to generate
 * @returns The random bytes
 *
 * @example
 * ```typescript
 * const randomBytes = generateSecureRandomBytes(32);
 * ```
 */
function generateSecureRandomBytes(length) {
    return crypto.randomBytes(length);
}
/**
 * Generates a cryptographically secure random string.
 *
 * @param length - Length of the string
 * @param encoding - Encoding format (hex, base64, base64url)
 * @returns The random string
 *
 * @example
 * ```typescript
 * const randomString = generateSecureRandomString(32, 'base64url');
 * ```
 */
function generateSecureRandomString(length, encoding = 'hex') {
    const bytes = crypto.randomBytes(Math.ceil(length / 2));
    const str = bytes.toString(encoding);
    return str.slice(0, length);
}
/**
 * Generates a cryptographically secure random integer between min and max.
 *
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (exclusive)
 * @returns The random integer
 *
 * @example
 * ```typescript
 * const randomInt = generateSecureRandomInt(0, 100);
 * ```
 */
function generateSecureRandomInt(min, max) {
    const range = max - min;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const maxValid = Math.floor(256 ** bytesNeeded / range) * range;
    let randomValue;
    do {
        randomValue = crypto.randomBytes(bytesNeeded).readUIntBE(0, bytesNeeded);
    } while (randomValue >= maxValid);
    return min + (randomValue % range);
}
/**
 * Generates a secure random token with optional prefix.
 *
 * @param length - Length of the token
 * @param prefix - Optional prefix (e.g., 'sk_', 'pk_')
 * @returns The random token
 *
 * @example
 * ```typescript
 * const apiKey = generateSecureToken(32, 'sk_');
 * console.log(apiKey); // sk_a1b2c3d4...
 * ```
 */
function generateSecureToken(length = 32, prefix) {
    const token = generateSecureRandomString(length, 'base64url');
    return prefix ? `${prefix}${token}` : token;
}
// ============================================================================
// PII DATA MASKING AND TOKENIZATION
// ============================================================================
/**
 * Masks PII data by replacing characters with mask characters.
 *
 * @param data - The data to mask
 * @param config - Masking configuration
 * @returns The masked data
 *
 * @example
 * ```typescript
 * const masked = maskPIIData('123-45-6789', { visibleEnd: 4 });
 * console.log(masked); // *****6789
 * ```
 */
function maskPIIData(data, config) {
    if (!data)
        return '';
    const maskChar = config?.maskChar || '*';
    const visibleStart = config?.visibleStart || 0;
    const visibleEnd = config?.visibleEnd || 0;
    const preserveFormat = config?.preserveFormat || false;
    if (visibleStart + visibleEnd >= data.length) {
        return data;
    }
    let masked = '';
    for (let i = 0; i < data.length; i++) {
        if (i < visibleStart || i >= data.length - visibleEnd) {
            masked += data[i];
        }
        else if (preserveFormat && !data[i].match(/[a-zA-Z0-9]/)) {
            masked += data[i]; // Preserve special characters
        }
        else {
            masked += maskChar;
        }
    }
    return masked;
}
/**
 * Masks an email address showing only partial information.
 *
 * @param email - The email to mask
 * @returns The masked email
 *
 * @example
 * ```typescript
 * const masked = maskEmail('john.doe@example.com');
 * console.log(masked); // j***@example.com
 * ```
 */
function maskEmail(email) {
    const [localPart, domain] = email.split('@');
    if (!domain)
        return email;
    const maskedLocal = localPart.length > 2
        ? localPart[0] + '*'.repeat(localPart.length - 1)
        : localPart[0] + '*';
    return `${maskedLocal}@${domain}`;
}
/**
 * Masks a phone number showing only the last 4 digits.
 *
 * @param phone - The phone number to mask
 * @returns The masked phone number
 *
 * @example
 * ```typescript
 * const masked = maskPhoneNumber('555-123-4567');
 * console.log(masked); // ***-***-4567
 * ```
 */
function maskPhoneNumber(phone) {
    return maskPIIData(phone, { visibleEnd: 4, preserveFormat: true });
}
/**
 * Masks a credit card number showing only the last 4 digits.
 *
 * @param cardNumber - The credit card number to mask
 * @returns The masked card number
 *
 * @example
 * ```typescript
 * const masked = maskCreditCard('4111-1111-1111-1111');
 * console.log(masked); // ****-****-****-1111
 * ```
 */
function maskCreditCard(cardNumber) {
    return maskPIIData(cardNumber, { visibleEnd: 4, preserveFormat: true });
}
/**
 * Masks a Social Security Number showing only the last 4 digits.
 *
 * @param ssn - The SSN to mask
 * @returns The masked SSN
 *
 * @example
 * ```typescript
 * const masked = maskSSN('123-45-6789');
 * console.log(masked); // ***-**-6789
 * ```
 */
function maskSSN(ssn) {
    return maskPIIData(ssn, { visibleEnd: 4, preserveFormat: true });
}
/**
 * Tokenizes sensitive data for secure storage and retrieval.
 *
 * @param data - The data to tokenize
 * @param key - Encryption key for the original data
 * @param config - Tokenization configuration
 * @returns The tokenization result with token and metadata
 *
 * @example
 * ```typescript
 * const key = generateEncryptionKey(32);
 * const result = tokenizeSensitiveData('123-45-6789', key, { tokenPrefix: 'ssn_' });
 * console.log(result.token); // ssn_abc123...
 * ```
 */
function tokenizeSensitiveData(data, key, config) {
    const tokenLength = config?.tokenLength || 32;
    const tokenPrefix = config?.tokenPrefix || '';
    const preserveLength = config?.preserveLength || false;
    // Generate token
    const actualLength = preserveLength ? data.length : tokenLength;
    const token = tokenPrefix + generateSecureRandomString(actualLength, 'base64url');
    // Encrypt original data
    const encrypted = encryptAES(data, key);
    // Hash token for verification
    const tokenHash = hashSHA256(token);
    return {
        token,
        tokenHash,
        originalLength: data.length,
        createdAt: new Date(),
    };
}
/**
 * Detokenizes a token back to its original value.
 * Note: This requires access to the tokenization mapping.
 *
 * @param token - The token to detokenize
 * @param encryptedData - The encrypted original data
 * @param key - Decryption key
 * @returns The original data
 *
 * @example
 * ```typescript
 * const key = generateEncryptionKey(32);
 * const tokenResult = tokenizeSensitiveData('123-45-6789', key);
 * // Store tokenResult and encrypted data in database
 * // Later retrieve and detokenize
 * const original = detokenizeSensitiveData(tokenResult.token, encrypted, key);
 * ```
 */
function detokenizeSensitiveData(token, encryptedData, key) {
    return decryptAES(encryptedData, key);
}
// ============================================================================
// SQL INJECTION PREVENTION
// ============================================================================
/**
 * Checks input for SQL injection patterns and sanitizes it.
 *
 * @param input - The input to check
 * @returns SQL injection check result
 *
 * @example
 * ```typescript
 * const result = checkSQLInjection("admin' OR '1'='1");
 * if (!result.isSafe) {
 *   console.error('SQL injection attempt detected!');
 * }
 * ```
 */
function checkSQLInjection(input) {
    const threats = [];
    let severity = 'none';
    // SQL injection patterns
    const sqlPatterns = [
        { pattern: /(\bOR\b|\bAND\b)\s+['"]\d+['"]\s*=\s*['"]\d+['"]/gi, threat: 'Boolean-based blind injection', severity: 'critical' },
        { pattern: /UNION\s+SELECT/gi, threat: 'UNION-based injection', severity: 'critical' },
        { pattern: /;\s*(DROP|DELETE|TRUNCATE|ALTER)\s+/gi, threat: 'Destructive SQL command', severity: 'critical' },
        { pattern: /--\s*$/gm, threat: 'SQL comment', severity: 'medium' },
        { pattern: /\/\*.*?\*\//g, threat: 'SQL block comment', severity: 'medium' },
        { pattern: /'\s*(OR|AND)\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?/gi, threat: 'OR/AND condition injection', severity: 'high' },
        { pattern: /;\s*EXEC\s*\(/gi, threat: 'Command execution attempt', severity: 'critical' },
        { pattern: /xp_cmdshell/gi, threat: 'xp_cmdshell injection', severity: 'critical' },
        { pattern: /\bINTO\s+OUTFILE\b/gi, threat: 'File write attempt', severity: 'critical' },
        { pattern: /\bLOAD_FILE\b/gi, threat: 'File read attempt', severity: 'high' },
    ];
    for (const { pattern, threat, severity: patternSeverity } of sqlPatterns) {
        if (pattern.test(input)) {
            threats.push(threat);
            if (severity === 'none' ||
                (patternSeverity === 'critical') ||
                (patternSeverity === 'high' && severity !== 'critical') ||
                (patternSeverity === 'medium' && !['critical', 'high'].includes(severity))) {
                severity = patternSeverity;
            }
        }
    }
    // Sanitize by escaping special characters
    const sanitized = input
        .replace(/'/g, "''")
        .replace(/"/g, '""')
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '')
        .replace(/--/g, '')
        .replace(/\/\*/g, '')
        .replace(/\*\//g, '');
    return {
        isSafe: threats.length === 0,
        threats,
        sanitized,
        severity,
    };
}
/**
 * Sanitizes SQL input by escaping special characters.
 * WARNING: This is not a replacement for parameterized queries!
 *
 * @param input - The input to sanitize
 * @returns The sanitized input
 *
 * @example
 * ```typescript
 * const safe = sanitizeSQLInput("O'Brien");
 * console.log(safe); // O''Brien
 * ```
 */
function sanitizeSQLInput(input) {
    return checkSQLInjection(input).sanitized;
}
/**
 * Validates and sanitizes SQL LIKE pattern input.
 *
 * @param pattern - The LIKE pattern to sanitize
 * @returns The sanitized pattern
 *
 * @example
 * ```typescript
 * const safe = sanitizeSQLLikePattern('test%_value');
 * ```
 */
function sanitizeSQLLikePattern(pattern) {
    // Escape special LIKE characters
    return pattern
        .replace(/\\/g, '\\\\')
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_')
        .replace(/'/g, "''");
}
// ============================================================================
// XSS PROTECTION HELPERS
// ============================================================================
/**
 * Checks input for XSS (Cross-Site Scripting) patterns.
 *
 * @param input - The input to check
 * @returns XSS check result
 *
 * @example
 * ```typescript
 * const result = checkXSS('<script>alert("XSS")</script>');
 * if (!result.isSafe) {
 *   console.error('XSS attempt detected!');
 * }
 * ```
 */
function checkXSS(input) {
    const threats = [];
    let severity = 'none';
    // XSS patterns
    const xssPatterns = [
        { pattern: /<script\b[^>]*>.*?<\/script>/gi, threat: 'Script tag injection', severity: 'critical' },
        { pattern: /javascript:/gi, threat: 'JavaScript protocol', severity: 'high' },
        { pattern: /on\w+\s*=\s*["'][^"']*["']/gi, threat: 'Event handler injection', severity: 'high' },
        { pattern: /<iframe\b[^>]*>/gi, threat: 'Iframe injection', severity: 'high' },
        { pattern: /<object\b[^>]*>/gi, threat: 'Object tag injection', severity: 'medium' },
        { pattern: /<embed\b[^>]*>/gi, threat: 'Embed tag injection', severity: 'medium' },
        { pattern: /eval\s*\(/gi, threat: 'eval() usage', severity: 'high' },
        { pattern: /expression\s*\(/gi, threat: 'CSS expression', severity: 'medium' },
        { pattern: /vbscript:/gi, threat: 'VBScript protocol', severity: 'high' },
        { pattern: /data:text\/html/gi, threat: 'Data URI HTML injection', severity: 'high' },
    ];
    for (const { pattern, threat, severity: patternSeverity } of xssPatterns) {
        if (pattern.test(input)) {
            threats.push(threat);
            if (severity === 'none' ||
                (patternSeverity === 'critical') ||
                (patternSeverity === 'high' && severity !== 'critical') ||
                (patternSeverity === 'medium' && !['critical', 'high'].includes(severity))) {
                severity = patternSeverity;
            }
        }
    }
    // Sanitize by HTML encoding
    const sanitized = sanitizeHTML(input);
    return {
        isSafe: threats.length === 0,
        threats,
        sanitized,
        severity,
    };
}
/**
 * Sanitizes HTML by encoding special characters.
 *
 * @param html - The HTML to sanitize
 * @returns The sanitized HTML
 *
 * @example
 * ```typescript
 * const safe = sanitizeHTML('<script>alert("XSS")</script>');
 * console.log(safe); // &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
 * ```
 */
function sanitizeHTML(html) {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}
/**
 * Strips HTML tags from input.
 *
 * @param html - The HTML to strip
 * @param allowedTags - Optional array of allowed tags
 * @returns The stripped text
 *
 * @example
 * ```typescript
 * const text = stripHTMLTags('<p>Hello <b>World</b></p>');
 * console.log(text); // Hello World
 * ```
 */
function stripHTMLTags(html, allowedTags) {
    if (!allowedTags || allowedTags.length === 0) {
        return html.replace(/<[^>]*>/g, '');
    }
    // Keep only allowed tags
    const allowedPattern = allowedTags.join('|');
    const regex = new RegExp(`<(?!\\/?(${allowedPattern})\\b)[^>]*>`, 'gi');
    return html.replace(regex, '');
}
/**
 * Sanitizes user input for safe display.
 *
 * @param input - The input to sanitize
 * @param config - Sanitization configuration
 * @returns The sanitized input
 *
 * @example
 * ```typescript
 * const safe = sanitizeInput('<script>alert("XSS")</script>', { stripTags: true });
 * ```
 */
function sanitizeInput(input, config) {
    let sanitized = input;
    // Apply max length
    if (config?.maxLength && sanitized.length > config.maxLength) {
        sanitized = sanitized.substring(0, config.maxLength);
    }
    // Strip or escape HTML
    if (config?.stripTags) {
        sanitized = stripHTMLTags(sanitized, config.allowedTags);
    }
    else if (config?.escapeHtml !== false) {
        sanitized = sanitizeHTML(sanitized);
    }
    return sanitized;
}
// ============================================================================
// CSRF TOKEN GENERATION
// ============================================================================
/**
 * Generates a CSRF token for form protection.
 *
 * @param config - CSRF token configuration
 * @returns The CSRF token
 *
 * @example
 * ```typescript
 * const token = generateCSRFToken({ secret: 'app-secret', sessionId: 'sess-123' });
 * ```
 */
function generateCSRFToken(config) {
    const expiresIn = config.expiresIn || 3600000; // 1 hour default
    const algorithm = config.algorithm || 'sha256';
    const tokenData = crypto.randomBytes(32).toString('base64url');
    const timestamp = Date.now();
    const expiresAt = new Date(timestamp + expiresIn);
    // Create HMAC of token with secret and session
    const hmac = crypto.createHmac(algorithm, config.secret);
    hmac.update(`${tokenData}:${config.sessionId || ''}:${timestamp}`);
    const hash = hmac.digest('hex');
    const token = `${tokenData}.${timestamp}.${hash}`;
    return {
        token,
        hash,
        createdAt: new Date(timestamp),
        expiresAt,
    };
}
/**
 * Verifies a CSRF token.
 *
 * @param token - The token to verify
 * @param config - CSRF token configuration (must match generation config)
 * @returns True if token is valid and not expired
 *
 * @example
 * ```typescript
 * const token = generateCSRFToken({ secret: 'app-secret', sessionId: 'sess-123' });
 * const isValid = verifyCSRFToken(token.token, { secret: 'app-secret', sessionId: 'sess-123' });
 * ```
 */
function verifyCSRFToken(token, config) {
    try {
        const [tokenData, timestamp, hash] = token.split('.');
        if (!tokenData || !timestamp || !hash) {
            return false;
        }
        const ts = parseInt(timestamp, 10);
        const expiresIn = config.expiresIn || 3600000;
        // Check expiration
        if (Date.now() - ts > expiresIn) {
            return false;
        }
        // Verify HMAC
        const algorithm = config.algorithm || 'sha256';
        const hmac = crypto.createHmac(algorithm, config.secret);
        hmac.update(`${tokenData}:${config.sessionId || ''}:${timestamp}`);
        const computedHash = hmac.digest('hex');
        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computedHash));
    }
    catch (error) {
        return false;
    }
}
/**
 * Generates a double-submit CSRF token (cookie + header).
 *
 * @returns The CSRF token for both cookie and form
 *
 * @example
 * ```typescript
 * const csrfToken = generateDoubleSubmitCSRFToken();
 * // Set as cookie and include in form
 * ```
 */
function generateDoubleSubmitCSRFToken() {
    return crypto.randomBytes(32).toString('base64url');
}
// ============================================================================
// CONTENT SECURITY POLICY HELPERS
// ============================================================================
/**
 * Builds a Content Security Policy header string from directives.
 *
 * @param directives - CSP directives configuration
 * @returns The CSP header string
 *
 * @example
 * ```typescript
 * const csp = buildCSPHeader({
 *   defaultSrc: ["'self'"],
 *   scriptSrc: ["'self'", "'unsafe-inline'"],
 *   styleSrc: ["'self'", 'https://fonts.googleapis.com']
 * });
 * ```
 */
function buildCSPHeader(directives) {
    const policies = [];
    if (directives.defaultSrc) {
        policies.push(`default-src ${directives.defaultSrc.join(' ')}`);
    }
    if (directives.scriptSrc) {
        policies.push(`script-src ${directives.scriptSrc.join(' ')}`);
    }
    if (directives.styleSrc) {
        policies.push(`style-src ${directives.styleSrc.join(' ')}`);
    }
    if (directives.imgSrc) {
        policies.push(`img-src ${directives.imgSrc.join(' ')}`);
    }
    if (directives.fontSrc) {
        policies.push(`font-src ${directives.fontSrc.join(' ')}`);
    }
    if (directives.connectSrc) {
        policies.push(`connect-src ${directives.connectSrc.join(' ')}`);
    }
    if (directives.frameSrc) {
        policies.push(`frame-src ${directives.frameSrc.join(' ')}`);
    }
    if (directives.objectSrc) {
        policies.push(`object-src ${directives.objectSrc.join(' ')}`);
    }
    if (directives.mediaSrc) {
        policies.push(`media-src ${directives.mediaSrc.join(' ')}`);
    }
    if (directives.workerSrc) {
        policies.push(`worker-src ${directives.workerSrc.join(' ')}`);
    }
    if (directives.manifestSrc) {
        policies.push(`manifest-src ${directives.manifestSrc.join(' ')}`);
    }
    if (directives.baseUri) {
        policies.push(`base-uri ${directives.baseUri.join(' ')}`);
    }
    if (directives.formAction) {
        policies.push(`form-action ${directives.formAction.join(' ')}`);
    }
    if (directives.frameAncestors) {
        policies.push(`frame-ancestors ${directives.frameAncestors.join(' ')}`);
    }
    if (directives.reportUri) {
        policies.push(`report-uri ${directives.reportUri}`);
    }
    if (directives.upgradeInsecureRequests) {
        policies.push('upgrade-insecure-requests');
    }
    return policies.join('; ');
}
/**
 * Gets strict CSP directives for maximum security.
 *
 * @returns Strict CSP directives
 *
 * @example
 * ```typescript
 * const strictCSP = getStrictCSP();
 * const cspHeader = buildCSPHeader(strictCSP);
 * ```
 */
function getStrictCSP() {
    return {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: true,
    };
}
/**
 * Generates a nonce for inline scripts/styles in CSP.
 *
 * @returns A random nonce value
 *
 * @example
 * ```typescript
 * const nonce = generateCSPNonce();
 * // Add to CSP: script-src 'nonce-${nonce}'
 * // Use in HTML: <script nonce="${nonce}">...</script>
 * ```
 */
function generateCSPNonce() {
    return crypto.randomBytes(16).toString('base64');
}
// ============================================================================
// SECURITY HEADERS MANAGEMENT
// ============================================================================
/**
 * Gets recommended security headers for production.
 *
 * @returns Security headers object
 *
 * @example
 * ```typescript
 * const headers = getSecurityHeaders();
 * // Apply to response
 * Object.entries(headers).forEach(([key, value]) => {
 *   res.setHeader(key, value);
 * });
 * ```
 */
function getSecurityHeaders() {
    return {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Content-Security-Policy': buildCSPHeader(getStrictCSP()),
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        'X-DNS-Prefetch-Control': 'off',
        'X-Download-Options': 'noopen',
        'X-Permitted-Cross-Domain-Policies': 'none',
    };
}
/**
 * Gets HIPAA-compliant security headers for healthcare applications.
 *
 * @returns HIPAA-compliant security headers
 *
 * @example
 * ```typescript
 * const headers = getHIPAASecurityHeaders();
 * ```
 */
function getHIPAASecurityHeaders() {
    return {
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Content-Security-Policy': buildCSPHeader({
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            fontSrc: ["'self'"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            upgradeInsecureRequests: true,
        }),
        'Referrer-Policy': 'no-referrer',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',
        'X-DNS-Prefetch-Control': 'off',
        'X-Download-Options': 'noopen',
        'X-Permitted-Cross-Domain-Policies': 'none',
    };
}
// ============================================================================
// OUTPUT ENCODING
// ============================================================================
/**
 * Encodes output for safe rendering in different contexts.
 *
 * @param data - The data to encode
 * @param options - Encoding options
 * @returns The encoded data
 *
 * @example
 * ```typescript
 * const encoded = encodeOutput('<script>alert("XSS")</script>', { encoding: 'html' });
 * ```
 */
function encodeOutput(data, options) {
    const encoding = options?.encoding || 'html';
    switch (encoding) {
        case 'html':
            return sanitizeHTML(data);
        case 'xml':
            return data
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        case 'js':
            return data
                .replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'")
                .replace(/"/g, '\\"')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/\t/g, '\\t');
        case 'css':
            return data.replace(/[<>"'&]/g, (char) => `\\${char.charCodeAt(0).toString(16)} `);
        case 'url':
            return encodeURIComponent(data);
        case 'base64':
            return Buffer.from(data, 'utf8').toString('base64');
        default:
            return data;
    }
}
/**
 * Decodes previously encoded output.
 *
 * @param data - The data to decode
 * @param encoding - The encoding type used
 * @returns The decoded data
 *
 * @example
 * ```typescript
 * const encoded = encodeOutput('test data', { encoding: 'base64' });
 * const decoded = decodeOutput(encoded, 'base64');
 * ```
 */
function decodeOutput(data, encoding) {
    switch (encoding) {
        case 'html':
            return data
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#x27;/g, "'")
                .replace(/&#x2F;/g, '/');
        case 'url':
            return decodeURIComponent(data);
        case 'base64':
            return Buffer.from(data, 'base64').toString('utf8');
        default:
            return data;
    }
}
// ============================================================================
// CRYPTOGRAPHIC KEY DERIVATION (PBKDF2)
// ============================================================================
/**
 * Derives a cryptographic key using PBKDF2.
 *
 * @param config - PBKDF2 configuration
 * @returns The derived key result
 *
 * @example
 * ```typescript
 * const result = deriveKeyPBKDF2({
 *   password: 'user-password',
 *   iterations: 100000,
 *   keyLength: 32
 * });
 * ```
 */
function deriveKeyPBKDF2(config) {
    const iterations = config.iterations || 100000;
    const keyLength = config.keyLength || 32;
    const digest = config.digest || 'sha256';
    const salt = typeof config.salt === 'string'
        ? Buffer.from(config.salt, 'hex')
        : config.salt || crypto.randomBytes(16);
    const derivedKey = crypto.pbkdf2Sync(config.password, salt, iterations, keyLength, digest);
    return {
        derivedKey,
        salt,
        iterations,
        keyLength,
        algorithm: `pbkdf2-${digest}`,
    };
}
/**
 * Verifies a password against a PBKDF2-derived key.
 *
 * @param password - The password to verify
 * @param result - The original PBKDF2 result
 * @returns True if password matches
 *
 * @example
 * ```typescript
 * const derived = deriveKeyPBKDF2({ password: 'user-password' });
 * const isValid = verifyPBKDF2('user-password', derived);
 * ```
 */
function verifyPBKDF2(password, result) {
    const digest = result.algorithm.replace('pbkdf2-', '');
    const derivedKey = crypto.pbkdf2Sync(password, result.salt, result.iterations, result.keyLength, digest);
    return crypto.timingSafeEqual(derivedKey, result.derivedKey);
}
/**
 * Derives multiple keys from a single password using PBKDF2.
 *
 * @param password - The master password
 * @param purposes - Array of key purposes
 * @param keyLength - Length of each derived key
 * @returns Map of purpose to derived key
 *
 * @example
 * ```typescript
 * const keys = deriveMultipleKeys('master-password', ['encryption', 'authentication', 'signing']);
 * const encryptionKey = keys.get('encryption');
 * ```
 */
function deriveMultipleKeys(password, purposes, keyLength = 32) {
    const keys = new Map();
    for (const purpose of purposes) {
        const salt = crypto.createHash('sha256').update(purpose).digest();
        const key = crypto.pbkdf2Sync(password, salt, 100000, keyLength, 'sha256');
        keys.set(purpose, key);
    }
    return keys;
}
// ============================================================================
// SECURITY EVENT LOGGING
// ============================================================================
/**
 * Creates a security event log entry.
 *
 * @param event - Security event details
 * @returns The formatted security event
 *
 * @example
 * ```typescript
 * const event = createSecurityEvent({
 *   eventType: 'encryption',
 *   severity: 'info',
 *   userId: 'user-123',
 *   details: { algorithm: 'aes-256-gcm', keyId: 'key-001' }
 * });
 * ```
 */
function createSecurityEvent(event) {
    return {
        eventId: `sec-${crypto.randomBytes(16).toString('hex')}`,
        timestamp: new Date(),
        ...event,
    };
}
/**
 * Logs a security event (placeholder for actual logging implementation).
 *
 * @param event - The security event to log
 *
 * @example
 * ```typescript
 * logSecurityEvent({
 *   eventType: 'pii_access',
 *   severity: 'warning',
 *   userId: 'user-123',
 *   details: { resource: 'patient-records', action: 'read' }
 * });
 * ```
 */
function logSecurityEvent(event) {
    const securityEvent = createSecurityEvent(event);
    // In production, this would send to a logging service
    console.log('[SECURITY EVENT]', JSON.stringify(securityEvent, null, 2));
    // For critical events, send alerts
    if (event.severity === 'critical') {
        console.error('[CRITICAL SECURITY EVENT]', securityEvent);
        // Send to alerting system (PagerDuty, Slack, etc.)
    }
}
// ============================================================================
// EXPORTS SUMMARY
// ============================================================================
/**
 * Security & Encryption Kit - Complete Summary
 *
 * This module provides 45+ comprehensive security and encryption utilities:
 *
 * AES Encryption (4 functions):
 * - encryptAES, decryptAES, encryptAESCBC, decryptAESCBC
 *
 * RSA Encryption (3 functions):
 * - generateRSAKeyPair, encryptRSA, decryptRSA
 *
 * Hashing (6 functions):
 * - hashSHA256, hashSHA512, hashData, hashPasswordBcrypt, verifyPasswordBcrypt,
 *   hashPasswordArgon2, verifyPasswordArgon2
 *
 * HMAC Signatures (4 functions):
 * - generateHMAC, verifyHMAC, generateTimestampedHMAC, verifyTimestampedHMAC
 *
 * Key Management (5 functions):
 * - generateEncryptionKey, createKeyRotationPolicy, shouldRotateKey,
 *   rotateEncryptionKey, deriveKeyFromMaster
 *
 * Secure Random (4 functions):
 * - generateSecureRandomBytes, generateSecureRandomString, generateSecureRandomInt,
 *   generateSecureToken
 *
 * PII Masking & Tokenization (7 functions):
 * - maskPIIData, maskEmail, maskPhoneNumber, maskCreditCard, maskSSN,
 *   tokenizeSensitiveData, detokenizeSensitiveData
 *
 * SQL Injection Prevention (3 functions):
 * - checkSQLInjection, sanitizeSQLInput, sanitizeSQLLikePattern
 *
 * XSS Protection (4 functions):
 * - checkXSS, sanitizeHTML, stripHTMLTags, sanitizeInput
 *
 * CSRF Protection (3 functions):
 * - generateCSRFToken, verifyCSRFToken, generateDoubleSubmitCSRFToken
 *
 * Content Security Policy (3 functions):
 * - buildCSPHeader, getStrictCSP, generateCSPNonce
 *
 * Security Headers (2 functions):
 * - getSecurityHeaders, getHIPAASecurityHeaders
 *
 * Output Encoding (2 functions):
 * - encodeOutput, decodeOutput
 *
 * PBKDF2 Key Derivation (3 functions):
 * - deriveKeyPBKDF2, verifyPBKDF2, deriveMultipleKeys
 *
 * Security Event Logging (2 functions):
 * - createSecurityEvent, logSecurityEvent
 *
 * Sequelize Models (4 models):
 * - EncryptionKey, SecurityEvent, TokenizedData, SecureSession
 */
//# sourceMappingURL=security-encryption-kit.js.map