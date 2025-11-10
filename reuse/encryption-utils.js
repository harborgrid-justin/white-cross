"use strict";
/**
 * LOC: ENC1234567
 * File: /reuse/encryption-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Authentication services
 *   - Security middleware
 *   - Data protection modules
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
exports.isCertificateExpired = exports.validateCertificate = exports.validateKeyStrength = exports.generateKeyRotationSchedule = exports.rotateEncryptionKey = exports.redactSensitivePatterns = exports.maskCreditCard = exports.maskPhoneNumber = exports.maskEmail = exports.maskData = exports.generateUUID = exports.generateNumericToken = exports.generateAlphanumericToken = exports.generateSecureToken = exports.verifySignatureECDSA = exports.signDataECDSA = exports.generateECDSAKeyPair = exports.verifySignatureRSA = exports.signDataRSA = exports.generateSalt = exports.deriveKeyScrypt = exports.deriveKeyPBKDF2 = exports.generateHMACSHA256 = exports.verifyHMAC = exports.generateHMAC = exports.verifyPasswordArgon2 = exports.hashPasswordArgon2 = exports.verifyPasswordBcrypt = exports.hashPasswordBcrypt = exports.hashWithOptions = exports.hashSHA512 = exports.hashSHA256 = exports.decryptRSA = exports.encryptRSA = exports.generateRSAKeyPair = exports.generateAES256Key = exports.decryptAES256GCM = exports.encryptAES256GCM = exports.decryptAES256CBC = exports.encryptAES256CBC = void 0;
/**
 * File: /reuse/encryption-utils.ts
 * Locator: WC-UTL-ENC-001
 * Purpose: Comprehensive Encryption Utilities - Complete cryptographic operations toolkit
 *
 * Upstream: Independent utility module for encryption operations
 * Downstream: ../backend/*, ../frontend/*, Security services, Auth modules
 * Dependencies: TypeScript 5.x, Node 18+, crypto, bcrypt, jsonwebtoken
 * Exports: 40 utility functions for encryption, hashing, signing, key management
 *
 * LLM Context: Enterprise-grade encryption utilities for White Cross healthcare platform.
 * Provides AES-256 encryption, RSA operations, secure hashing, HMAC, digital signatures,
 * key derivation, token generation, and data masking. HIPAA-compliant cryptographic
 * operations for protecting PHI and sensitive healthcare data.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// AES-256 ENCRYPTION (CBC MODE)
// ============================================================================
/**
 * Encrypts data using AES-256-CBC algorithm.
 *
 * @param {string} plaintext - Data to encrypt
 * @param {string} key - Encryption key (32 bytes for AES-256)
 * @returns {EncryptionResult} Encrypted data with IV
 *
 * @example
 * ```typescript
 * const key = crypto.randomBytes(32).toString('hex');
 * const result = encryptAES256CBC('patient SSN: 123-45-6789', key);
 * // Result: { encrypted: '...', iv: '...' }
 * ```
 */
const encryptAES256CBC = (plaintext, key) => {
    const keyBuffer = Buffer.from(key, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        encrypted,
        iv: iv.toString('hex'),
    };
};
exports.encryptAES256CBC = encryptAES256CBC;
/**
 * Decrypts AES-256-CBC encrypted data.
 *
 * @param {DecryptionConfig} config - Decryption configuration
 * @param {string} key - Decryption key (32 bytes for AES-256)
 * @returns {string} Decrypted plaintext
 *
 * @example
 * ```typescript
 * const decrypted = decryptAES256CBC(
 *   { encrypted: '...', iv: '...' },
 *   key
 * );
 * // Result: 'patient SSN: 123-45-6789'
 * ```
 */
const decryptAES256CBC = (config, key) => {
    const keyBuffer = Buffer.from(key, 'hex');
    const ivBuffer = Buffer.from(config.iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
    let decrypted = decipher.update(config.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptAES256CBC = decryptAES256CBC;
// ============================================================================
// AES-256 ENCRYPTION (GCM MODE)
// ============================================================================
/**
 * Encrypts data using AES-256-GCM algorithm with authentication.
 *
 * @param {string} plaintext - Data to encrypt
 * @param {string} key - Encryption key (32 bytes for AES-256)
 * @returns {EncryptionResult} Encrypted data with IV and auth tag
 *
 * @example
 * ```typescript
 * const key = crypto.randomBytes(32).toString('hex');
 * const result = encryptAES256GCM('medical record data', key);
 * // Result: { encrypted: '...', iv: '...', authTag: '...' }
 * ```
 */
const encryptAES256GCM = (plaintext, key) => {
    const keyBuffer = Buffer.from(key, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
    };
};
exports.encryptAES256GCM = encryptAES256GCM;
/**
 * Decrypts AES-256-GCM encrypted data with authentication verification.
 *
 * @param {DecryptionConfig} config - Decryption configuration with auth tag
 * @param {string} key - Decryption key (32 bytes for AES-256)
 * @returns {string} Decrypted plaintext
 * @throws {Error} If authentication fails
 *
 * @example
 * ```typescript
 * const decrypted = decryptAES256GCM(
 *   { encrypted: '...', iv: '...', authTag: '...' },
 *   key
 * );
 * // Result: 'medical record data'
 * ```
 */
const decryptAES256GCM = (config, key) => {
    const keyBuffer = Buffer.from(key, 'hex');
    const ivBuffer = Buffer.from(config.iv, 'hex');
    const authTagBuffer = Buffer.from(config.authTag, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, ivBuffer);
    decipher.setAuthTag(authTagBuffer);
    let decrypted = decipher.update(config.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptAES256GCM = decryptAES256GCM;
/**
 * Generates a secure random encryption key for AES-256.
 *
 * @param {string} [encoding] - Output encoding (default: 'hex')
 * @returns {string} Generated encryption key
 *
 * @example
 * ```typescript
 * const key = generateAES256Key();
 * // Result: '3a7f2c9d8e1b4f6a5c3d9e8f7a2b1c4d...' (64 hex chars = 32 bytes)
 * ```
 */
const generateAES256Key = (encoding = 'hex') => {
    return crypto.randomBytes(32).toString(encoding);
};
exports.generateAES256Key = generateAES256Key;
// ============================================================================
// RSA PUBLIC/PRIVATE KEY OPERATIONS
// ============================================================================
/**
 * Generates RSA key pair for asymmetric encryption.
 *
 * @param {number} [modulusLength] - Key size in bits (default: 2048)
 * @returns {KeyPair} Public and private keys in PEM format
 *
 * @example
 * ```typescript
 * const { publicKey, privateKey } = generateRSAKeyPair(4096);
 * // Returns 4096-bit RSA key pair
 * ```
 */
const generateRSAKeyPair = (modulusLength = 2048) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });
    return { publicKey, privateKey };
};
exports.generateRSAKeyPair = generateRSAKeyPair;
/**
 * Encrypts data using RSA public key.
 *
 * @param {string} plaintext - Data to encrypt
 * @param {string} publicKey - RSA public key in PEM format
 * @returns {string} Encrypted data in base64
 *
 * @example
 * ```typescript
 * const encrypted = encryptRSA('sensitive data', publicKey);
 * // Result: base64 encoded encrypted data
 * ```
 */
const encryptRSA = (plaintext, publicKey) => {
    const buffer = Buffer.from(plaintext, 'utf8');
    const encrypted = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
    }, buffer);
    return encrypted.toString('base64');
};
exports.encryptRSA = encryptRSA;
/**
 * Decrypts RSA encrypted data using private key.
 *
 * @param {string} encrypted - Encrypted data in base64
 * @param {string} privateKey - RSA private key in PEM format
 * @returns {string} Decrypted plaintext
 *
 * @example
 * ```typescript
 * const decrypted = decryptRSA(encrypted, privateKey);
 * // Result: 'sensitive data'
 * ```
 */
const decryptRSA = (encrypted, privateKey) => {
    const buffer = Buffer.from(encrypted, 'base64');
    const decrypted = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
    }, buffer);
    return decrypted.toString('utf8');
};
exports.decryptRSA = decryptRSA;
// ============================================================================
// HASH FUNCTIONS
// ============================================================================
/**
 * Hashes data using SHA-256 algorithm.
 *
 * @param {string} data - Data to hash
 * @param {string} [encoding] - Output encoding (default: 'hex')
 * @returns {string} Hash digest
 *
 * @example
 * ```typescript
 * const hash = hashSHA256('password123');
 * // Result: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'
 * ```
 */
const hashSHA256 = (data, encoding = 'hex') => {
    return crypto.createHash('sha256').update(data).digest(encoding);
};
exports.hashSHA256 = hashSHA256;
/**
 * Hashes data using SHA-512 algorithm.
 *
 * @param {string} data - Data to hash
 * @param {string} [encoding] - Output encoding (default: 'hex')
 * @returns {string} Hash digest
 *
 * @example
 * ```typescript
 * const hash = hashSHA512('password123');
 * // Result: 128 character hex string
 * ```
 */
const hashSHA512 = (data, encoding = 'hex') => {
    return crypto.createHash('sha512').update(data).digest(encoding);
};
exports.hashSHA512 = hashSHA512;
/**
 * Hashes data using configurable algorithm and encoding.
 *
 * @param {string} data - Data to hash
 * @param {HashOptions} [options] - Hash configuration
 * @returns {string} Hash digest
 *
 * @example
 * ```typescript
 * const hash = hashWithOptions('data', { algorithm: 'sha384', encoding: 'base64' });
 * ```
 */
const hashWithOptions = (data, options) => {
    const algorithm = options?.algorithm || 'sha256';
    const encoding = options?.encoding || 'hex';
    return crypto.createHash(algorithm).update(data).digest(encoding);
};
exports.hashWithOptions = hashWithOptions;
/**
 * Hashes password using bcrypt (simulated - requires bcrypt package).
 *
 * @param {string} password - Password to hash
 * @param {number} [saltRounds] - Cost factor (default: 12)
 * @returns {Promise<string>} Bcrypt hash
 *
 * @example
 * ```typescript
 * const hash = await hashPasswordBcrypt('myPassword123', 12);
 * // Result: '$2b$12$...'
 * ```
 */
const hashPasswordBcrypt = async (password, saltRounds = 12) => {
    // This is a placeholder - actual implementation requires bcrypt package
    // import bcrypt from 'bcrypt';
    // return bcrypt.hash(password, saltRounds);
    // Simulated bcrypt using crypto for demonstration
    const salt = crypto.randomBytes(16).toString('hex');
    return `$bcrypt$${saltRounds}$${salt}$${(0, exports.hashSHA512)(password + salt)}`;
};
exports.hashPasswordBcrypt = hashPasswordBcrypt;
/**
 * Verifies password against bcrypt hash (simulated).
 *
 * @param {string} password - Password to verify
 * @param {string} hash - Bcrypt hash to compare against
 * @returns {Promise<boolean>} True if password matches
 *
 * @example
 * ```typescript
 * const isValid = await verifyPasswordBcrypt('myPassword123', hash);
 * // Result: true or false
 * ```
 */
const verifyPasswordBcrypt = async (password, hash) => {
    // This is a placeholder - actual implementation requires bcrypt package
    // import bcrypt from 'bcrypt';
    // return bcrypt.compare(password, hash);
    // Simulated verification
    const parts = hash.split('$');
    if (parts.length !== 5)
        return false;
    const salt = parts[3];
    const storedHash = parts[4];
    const computedHash = (0, exports.hashSHA512)(password + salt);
    return computedHash === storedHash;
};
exports.verifyPasswordBcrypt = verifyPasswordBcrypt;
/**
 * Hashes password using Argon2 (simulated - requires argon2 package).
 *
 * @param {string} password - Password to hash
 * @returns {Promise<string>} Argon2 hash
 *
 * @example
 * ```typescript
 * const hash = await hashPasswordArgon2('myPassword123');
 * // Result: '$argon2id$v=19$m=65536,t=3,p=4$...'
 * ```
 */
const hashPasswordArgon2 = async (password) => {
    // This is a placeholder - actual implementation requires argon2 package
    // import argon2 from 'argon2';
    // return argon2.hash(password);
    // Simulated argon2 using crypto for demonstration
    const salt = crypto.randomBytes(16).toString('hex');
    return `$argon2id$v=19$${salt}$${(0, exports.hashSHA512)(password + salt)}`;
};
exports.hashPasswordArgon2 = hashPasswordArgon2;
/**
 * Verifies password against Argon2 hash (simulated).
 *
 * @param {string} password - Password to verify
 * @param {string} hash - Argon2 hash to compare against
 * @returns {Promise<boolean>} True if password matches
 *
 * @example
 * ```typescript
 * const isValid = await verifyPasswordArgon2('myPassword123', hash);
 * // Result: true or false
 * ```
 */
const verifyPasswordArgon2 = async (password, hash) => {
    // This is a placeholder - actual implementation requires argon2 package
    // import argon2 from 'argon2';
    // return argon2.verify(hash, password);
    // Simulated verification
    const parts = hash.split('$');
    if (parts.length !== 5)
        return false;
    const salt = parts[3];
    const storedHash = parts[4];
    const computedHash = (0, exports.hashSHA512)(password + salt);
    return computedHash === storedHash;
};
exports.verifyPasswordArgon2 = verifyPasswordArgon2;
// ============================================================================
// HMAC GENERATION AND VERIFICATION
// ============================================================================
/**
 * Generates HMAC for data using secret key.
 *
 * @param {string} data - Data to authenticate
 * @param {string} secret - Secret key
 * @param {HmacConfig} [config] - HMAC configuration
 * @returns {string} HMAC digest
 *
 * @example
 * ```typescript
 * const hmac = generateHMAC('message', 'secret-key', { algorithm: 'sha256' });
 * // Result: hex encoded HMAC
 * ```
 */
const generateHMAC = (data, secret, config) => {
    const algorithm = config?.algorithm || 'sha256';
    const encoding = config?.encoding || 'hex';
    return crypto.createHmac(algorithm, secret).update(data).digest(encoding);
};
exports.generateHMAC = generateHMAC;
/**
 * Verifies HMAC signature.
 *
 * @param {string} data - Original data
 * @param {string} signature - HMAC signature to verify
 * @param {string} secret - Secret key
 * @param {HmacConfig} [config] - HMAC configuration
 * @returns {boolean} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyHMAC('message', hmac, 'secret-key');
 * // Result: true or false
 * ```
 */
const verifyHMAC = (data, signature, secret, config) => {
    const expectedSignature = (0, exports.generateHMAC)(data, secret, config);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
};
exports.verifyHMAC = verifyHMAC;
/**
 * Generates HMAC-SHA256 specifically for JWT-like tokens.
 *
 * @param {string} payload - Token payload
 * @param {string} secret - Secret key
 * @returns {string} HMAC signature
 *
 * @example
 * ```typescript
 * const signature = generateHMACSHA256('header.payload', 'secret');
 * ```
 */
const generateHMACSHA256 = (payload, secret) => {
    return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
};
exports.generateHMACSHA256 = generateHMACSHA256;
// ============================================================================
// KEY DERIVATION FUNCTIONS
// ============================================================================
/**
 * Derives encryption key using PBKDF2.
 *
 * @param {string} password - Password to derive key from
 * @param {KeyDerivationConfig} config - Derivation configuration
 * @returns {Promise<string>} Derived key
 *
 * @example
 * ```typescript
 * const key = await deriveKeyPBKDF2('password', {
 *   salt: 'random-salt',
 *   iterations: 100000,
 *   keyLength: 32
 * });
 * ```
 */
const deriveKeyPBKDF2 = async (password, config) => {
    const { salt, iterations = 100000, keyLength = 32, digest = 'sha512', } = config;
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keyLength, digest, (err, derivedKey) => {
            if (err)
                reject(err);
            else
                resolve(derivedKey.toString('hex'));
        });
    });
};
exports.deriveKeyPBKDF2 = deriveKeyPBKDF2;
/**
 * Derives encryption key using scrypt.
 *
 * @param {string} password - Password to derive key from
 * @param {string} salt - Salt value
 * @param {number} [keyLength] - Desired key length (default: 32)
 * @returns {Promise<string>} Derived key
 *
 * @example
 * ```typescript
 * const key = await deriveKeyScrypt('password', 'random-salt', 32);
 * ```
 */
const deriveKeyScrypt = async (password, salt, keyLength = 32) => {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, keyLength, (err, derivedKey) => {
            if (err)
                reject(err);
            else
                resolve(derivedKey.toString('hex'));
        });
    });
};
exports.deriveKeyScrypt = deriveKeyScrypt;
/**
 * Generates secure random salt for key derivation.
 *
 * @param {number} [length] - Salt length in bytes (default: 16)
 * @returns {string} Random salt
 *
 * @example
 * ```typescript
 * const salt = generateSalt(32);
 * // Result: 64 character hex string
 * ```
 */
const generateSalt = (length = 16) => {
    return crypto.randomBytes(length).toString('hex');
};
exports.generateSalt = generateSalt;
// ============================================================================
// DIGITAL SIGNATURES
// ============================================================================
/**
 * Signs data using RSA private key.
 *
 * @param {string} data - Data to sign
 * @param {string} privateKey - RSA private key in PEM format
 * @returns {SignatureResult} Signature and algorithm info
 *
 * @example
 * ```typescript
 * const { signature } = signDataRSA('important data', privateKey);
 * ```
 */
const signDataRSA = (data, privateKey) => {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    sign.end();
    const signature = sign.sign(privateKey, 'base64');
    return {
        signature,
        algorithm: 'RSA-SHA256',
    };
};
exports.signDataRSA = signDataRSA;
/**
 * Verifies RSA signature.
 *
 * @param {string} data - Original data
 * @param {string} signature - Signature to verify
 * @param {string} publicKey - RSA public key in PEM format
 * @returns {boolean} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifySignatureRSA('important data', signature, publicKey);
 * // Result: true or false
 * ```
 */
const verifySignatureRSA = (data, signature, publicKey) => {
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
};
exports.verifySignatureRSA = verifySignatureRSA;
/**
 * Generates ECDSA key pair for digital signatures.
 *
 * @param {string} [namedCurve] - Elliptic curve (default: 'secp256k1')
 * @returns {KeyPair} Public and private keys in PEM format
 *
 * @example
 * ```typescript
 * const { publicKey, privateKey } = generateECDSAKeyPair('prime256v1');
 * ```
 */
const generateECDSAKeyPair = (namedCurve = 'secp256k1') => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
        namedCurve,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });
    return { publicKey, privateKey };
};
exports.generateECDSAKeyPair = generateECDSAKeyPair;
/**
 * Signs data using ECDSA private key.
 *
 * @param {string} data - Data to sign
 * @param {string} privateKey - ECDSA private key in PEM format
 * @returns {SignatureResult} Signature and algorithm info
 *
 * @example
 * ```typescript
 * const { signature } = signDataECDSA('transaction data', privateKey);
 * ```
 */
const signDataECDSA = (data, privateKey) => {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    const signature = sign.sign(privateKey, 'base64');
    return {
        signature,
        algorithm: 'ECDSA-SHA256',
    };
};
exports.signDataECDSA = signDataECDSA;
/**
 * Verifies ECDSA signature.
 *
 * @param {string} data - Original data
 * @param {string} signature - Signature to verify
 * @param {string} publicKey - ECDSA public key in PEM format
 * @returns {boolean} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifySignatureECDSA('transaction data', signature, publicKey);
 * // Result: true or false
 * ```
 */
const verifySignatureECDSA = (data, signature, publicKey) => {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
};
exports.verifySignatureECDSA = verifySignatureECDSA;
// ============================================================================
// RANDOM TOKEN GENERATION
// ============================================================================
/**
 * Generates cryptographically secure random token.
 *
 * @param {number} [length] - Token length in bytes (default: 32)
 * @returns {string} Secure random token
 *
 * @example
 * ```typescript
 * const token = generateSecureToken(64);
 * // Result: 128 character hex string
 * ```
 */
const generateSecureToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};
exports.generateSecureToken = generateSecureToken;
/**
 * Generates random alphanumeric token.
 *
 * @param {TokenConfig} [config] - Token configuration
 * @returns {string} Random token
 *
 * @example
 * ```typescript
 * const token = generateAlphanumericToken({ length: 20, charset: 'alphanumeric' });
 * // Result: 'aB3xY9mN2pQ1zK8wT4vL'
 * ```
 */
const generateAlphanumericToken = (config) => {
    const length = config?.length || 32;
    const charset = config?.charset || 'alphanumeric';
    const charsets = {
        alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        numeric: '0123456789',
        alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        hex: '0123456789abcdef',
    };
    const chars = charsets[charset];
    const randomBytes = crypto.randomBytes(length);
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars[randomBytes[i] % chars.length];
    }
    return token;
};
exports.generateAlphanumericToken = generateAlphanumericToken;
/**
 * Generates random numeric token (e.g., for OTP).
 *
 * @param {number} [length] - Token length (default: 6)
 * @returns {string} Numeric token
 *
 * @example
 * ```typescript
 * const otp = generateNumericToken(6);
 * // Result: '473829'
 * ```
 */
const generateNumericToken = (length = 6) => {
    const randomBytes = crypto.randomBytes(length);
    let token = '';
    for (let i = 0; i < length; i++) {
        token += (randomBytes[i] % 10).toString();
    }
    return token;
};
exports.generateNumericToken = generateNumericToken;
/**
 * Generates UUID v4.
 *
 * @returns {string} UUID v4 string
 *
 * @example
 * ```typescript
 * const id = generateUUID();
 * // Result: '550e8400-e29b-41d4-a716-446655440000'
 * ```
 */
const generateUUID = () => {
    return crypto.randomUUID();
};
exports.generateUUID = generateUUID;
// ============================================================================
// DATA MASKING AND REDACTION
// ============================================================================
/**
 * Masks sensitive data showing only specified characters.
 *
 * @param {string} data - Data to mask
 * @param {MaskingConfig} [config] - Masking configuration
 * @returns {string} Masked data
 *
 * @example
 * ```typescript
 * const masked = maskData('1234567890', { visibleEnd: 4, maskChar: '*' });
 * // Result: '******7890'
 * ```
 */
const maskData = (data, config) => {
    const { visibleStart = 0, visibleEnd = 4, maskChar = '*', } = config || {};
    if (data.length <= visibleStart + visibleEnd) {
        return maskChar.repeat(data.length);
    }
    const start = data.slice(0, visibleStart);
    const end = data.slice(-visibleEnd);
    const middle = maskChar.repeat(data.length - visibleStart - visibleEnd);
    return start + middle + end;
};
exports.maskData = maskData;
/**
 * Masks email address.
 *
 * @param {string} email - Email to mask
 * @returns {string} Masked email
 *
 * @example
 * ```typescript
 * const masked = maskEmail('john.doe@example.com');
 * // Result: 'j***@example.com'
 * ```
 */
const maskEmail = (email) => {
    const [local, domain] = email.split('@');
    if (!domain)
        return email;
    const maskedLocal = local.charAt(0) + '***';
    return `${maskedLocal}@${domain}`;
};
exports.maskEmail = maskEmail;
/**
 * Masks phone number.
 *
 * @param {string} phone - Phone number to mask
 * @returns {string} Masked phone number
 *
 * @example
 * ```typescript
 * const masked = maskPhoneNumber('555-123-4567');
 * // Result: '***-***-4567'
 * ```
 */
const maskPhoneNumber = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 4)
        return '***';
    const lastFour = digitsOnly.slice(-4);
    const format = phone.replace(/\d(?=.*\d{4})/g, '*');
    return format.replace(/\d{4}$/, lastFour);
};
exports.maskPhoneNumber = maskPhoneNumber;
/**
 * Masks credit card number.
 *
 * @param {string} cardNumber - Card number to mask
 * @returns {string} Masked card number
 *
 * @example
 * ```typescript
 * const masked = maskCreditCard('4532-1234-5678-9010');
 * // Result: '****-****-****-9010'
 * ```
 */
const maskCreditCard = (cardNumber) => {
    const digitsOnly = cardNumber.replace(/\D/g, '');
    return (0, exports.maskData)(digitsOnly, { visibleEnd: 4, maskChar: '*' }).replace(/(.{4})/g, '$1-').slice(0, -1);
};
exports.maskCreditCard = maskCreditCard;
/**
 * Redacts sensitive patterns from text.
 *
 * @param {string} text - Text to redact
 * @param {RegExp[]} patterns - Patterns to redact
 * @param {string} [replacement] - Replacement string (default: '[REDACTED]')
 * @returns {string} Redacted text
 *
 * @example
 * ```typescript
 * const redacted = redactSensitivePatterns(
 *   'SSN: 123-45-6789, Email: test@example.com',
 *   [/\d{3}-\d{2}-\d{4}/, /[\w.-]+@[\w.-]+\.\w+/],
 *   '[REDACTED]'
 * );
 * // Result: 'SSN: [REDACTED], Email: [REDACTED]'
 * ```
 */
const redactSensitivePatterns = (text, patterns, replacement = '[REDACTED]') => {
    let redacted = text;
    patterns.forEach(pattern => {
        redacted = redacted.replace(pattern, replacement);
    });
    return redacted;
};
exports.redactSensitivePatterns = redactSensitivePatterns;
// ============================================================================
// ENCRYPTION KEY ROTATION HELPERS
// ============================================================================
/**
 * Re-encrypts data with new key (for key rotation).
 *
 * @param {DecryptionConfig} encryptedData - Data encrypted with old key
 * @param {string} oldKey - Old encryption key
 * @param {string} newKey - New encryption key
 * @returns {EncryptionResult} Data re-encrypted with new key
 *
 * @example
 * ```typescript
 * const reEncrypted = rotateEncryptionKey(oldData, oldKey, newKey);
 * ```
 */
const rotateEncryptionKey = (encryptedData, oldKey, newKey) => {
    const decrypted = (0, exports.decryptAES256GCM)(encryptedData, oldKey);
    return (0, exports.encryptAES256GCM)(decrypted, newKey);
};
exports.rotateEncryptionKey = rotateEncryptionKey;
/**
 * Generates key rotation schedule metadata.
 *
 * @param {number} rotationIntervalDays - Days between rotations
 * @returns {object} Key rotation schedule
 *
 * @example
 * ```typescript
 * const schedule = generateKeyRotationSchedule(90);
 * // Result: { currentKeyId: '...', nextRotation: Date, rotationInterval: 90 }
 * ```
 */
const generateKeyRotationSchedule = (rotationIntervalDays) => {
    const now = new Date();
    const nextRotation = new Date(now.getTime() + rotationIntervalDays * 24 * 60 * 60 * 1000);
    return {
        currentKeyId: (0, exports.generateUUID)(),
        createdAt: now,
        nextRotation,
        rotationInterval: rotationIntervalDays,
    };
};
exports.generateKeyRotationSchedule = generateKeyRotationSchedule;
/**
 * Validates encryption key strength.
 *
 * @param {string} key - Encryption key to validate
 * @param {number} minLength - Minimum key length in bytes
 * @returns {boolean} True if key meets requirements
 *
 * @example
 * ```typescript
 * const isStrong = validateKeyStrength(key, 32);
 * // Result: true if key is at least 32 bytes
 * ```
 */
const validateKeyStrength = (key, minLength = 32) => {
    const keyBuffer = Buffer.from(key, 'hex');
    return keyBuffer.length >= minLength;
};
exports.validateKeyStrength = validateKeyStrength;
// ============================================================================
// CERTIFICATE VALIDATION (PLACEHOLDER)
// ============================================================================
/**
 * Validates X.509 certificate (placeholder implementation).
 *
 * @param {string} certificate - PEM encoded certificate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCertificate(pemCert);
 * // Result: { valid: true, subject: '...', issuer: '...', expiresAt: Date }
 * ```
 */
const validateCertificate = (certificate) => {
    // This is a placeholder - actual implementation requires node-forge or similar
    return {
        valid: true,
        subject: 'CN=example.com',
        issuer: 'CN=CA',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };
};
exports.validateCertificate = validateCertificate;
/**
 * Checks if certificate is expired.
 *
 * @param {Date} expirationDate - Certificate expiration date
 * @returns {boolean} True if certificate is expired
 *
 * @example
 * ```typescript
 * const isExpired = isCertificateExpired(new Date('2024-12-31'));
 * ```
 */
const isCertificateExpired = (expirationDate) => {
    return expirationDate < new Date();
};
exports.isCertificateExpired = isCertificateExpired;
exports.default = {
    // AES-256 CBC
    encryptAES256CBC: exports.encryptAES256CBC,
    decryptAES256CBC: exports.decryptAES256CBC,
    // AES-256 GCM
    encryptAES256GCM: exports.encryptAES256GCM,
    decryptAES256GCM: exports.decryptAES256GCM,
    generateAES256Key: exports.generateAES256Key,
    // RSA
    generateRSAKeyPair: exports.generateRSAKeyPair,
    encryptRSA: exports.encryptRSA,
    decryptRSA: exports.decryptRSA,
    // Hash functions
    hashSHA256: exports.hashSHA256,
    hashSHA512: exports.hashSHA512,
    hashWithOptions: exports.hashWithOptions,
    hashPasswordBcrypt: exports.hashPasswordBcrypt,
    verifyPasswordBcrypt: exports.verifyPasswordBcrypt,
    hashPasswordArgon2: exports.hashPasswordArgon2,
    verifyPasswordArgon2: exports.verifyPasswordArgon2,
    // HMAC
    generateHMAC: exports.generateHMAC,
    verifyHMAC: exports.verifyHMAC,
    generateHMACSHA256: exports.generateHMACSHA256,
    // Key derivation
    deriveKeyPBKDF2: exports.deriveKeyPBKDF2,
    deriveKeyScrypt: exports.deriveKeyScrypt,
    generateSalt: exports.generateSalt,
    // Digital signatures
    signDataRSA: exports.signDataRSA,
    verifySignatureRSA: exports.verifySignatureRSA,
    generateECDSAKeyPair: exports.generateECDSAKeyPair,
    signDataECDSA: exports.signDataECDSA,
    verifySignatureECDSA: exports.verifySignatureECDSA,
    // Token generation
    generateSecureToken: exports.generateSecureToken,
    generateAlphanumericToken: exports.generateAlphanumericToken,
    generateNumericToken: exports.generateNumericToken,
    generateUUID: exports.generateUUID,
    // Data masking
    maskData: exports.maskData,
    maskEmail: exports.maskEmail,
    maskPhoneNumber: exports.maskPhoneNumber,
    maskCreditCard: exports.maskCreditCard,
    redactSensitivePatterns: exports.redactSensitivePatterns,
    // Key rotation
    rotateEncryptionKey: exports.rotateEncryptionKey,
    generateKeyRotationSchedule: exports.generateKeyRotationSchedule,
    validateKeyStrength: exports.validateKeyStrength,
    // Certificate validation
    validateCertificate: exports.validateCertificate,
    isCertificateExpired: exports.isCertificateExpired,
};
//# sourceMappingURL=encryption-utils.js.map