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

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface EncryptionResult {
  encrypted: string;
  iv: string;
  authTag?: string;
}

interface DecryptionConfig {
  encrypted: string;
  iv: string;
  authTag?: string;
}

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

interface HashOptions {
  algorithm?: 'sha256' | 'sha512' | 'sha384';
  encoding?: 'hex' | 'base64';
}

interface HmacConfig {
  algorithm?: string;
  encoding?: 'hex' | 'base64';
}

interface SignatureResult {
  signature: string;
  algorithm: string;
}

interface TokenConfig {
  length?: number;
  charset?: 'alphanumeric' | 'numeric' | 'alpha' | 'hex';
}

interface KeyDerivationConfig {
  salt: string;
  iterations?: number;
  keyLength?: number;
  digest?: string;
}

interface MaskingConfig {
  visibleStart?: number;
  visibleEnd?: number;
  maskChar?: string;
}

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
export const encryptAES256CBC = (plaintext: string, key: string): EncryptionResult => {
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
export const decryptAES256CBC = (config: DecryptionConfig, key: string): string => {
  const keyBuffer = Buffer.from(key, 'hex');
  const ivBuffer = Buffer.from(config.iv, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);

  let decrypted = decipher.update(config.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

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
export const encryptAES256GCM = (plaintext: string, key: string): EncryptionResult => {
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
export const decryptAES256GCM = (config: DecryptionConfig, key: string): string => {
  const keyBuffer = Buffer.from(key, 'hex');
  const ivBuffer = Buffer.from(config.iv, 'hex');
  const authTagBuffer = Buffer.from(config.authTag!, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, ivBuffer);
  decipher.setAuthTag(authTagBuffer);

  let decrypted = decipher.update(config.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

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
export const generateAES256Key = (encoding: 'hex' | 'base64' = 'hex'): string => {
  return crypto.randomBytes(32).toString(encoding);
};

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
export const generateRSAKeyPair = (modulusLength: number = 2048): KeyPair => {
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
export const encryptRSA = (plaintext: string, publicKey: string): string => {
  const buffer = Buffer.from(plaintext, 'utf8');
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer
  );

  return encrypted.toString('base64');
};

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
export const decryptRSA = (encrypted: string, privateKey: string): string => {
  const buffer = Buffer.from(encrypted, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    buffer
  );

  return decrypted.toString('utf8');
};

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
export const hashSHA256 = (data: string, encoding: 'hex' | 'base64' = 'hex'): string => {
  return crypto.createHash('sha256').update(data).digest(encoding);
};

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
export const hashSHA512 = (data: string, encoding: 'hex' | 'base64' = 'hex'): string => {
  return crypto.createHash('sha512').update(data).digest(encoding);
};

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
export const hashWithOptions = (data: string, options?: HashOptions): string => {
  const algorithm = options?.algorithm || 'sha256';
  const encoding = options?.encoding || 'hex';
  return crypto.createHash(algorithm).update(data).digest(encoding);
};

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
export const hashPasswordBcrypt = async (
  password: string,
  saltRounds: number = 12
): Promise<string> => {
  // This is a placeholder - actual implementation requires bcrypt package
  // import bcrypt from 'bcrypt';
  // return bcrypt.hash(password, saltRounds);

  // Simulated bcrypt using crypto for demonstration
  const salt = crypto.randomBytes(16).toString('hex');
  return `$bcrypt$${saltRounds}$${salt}$${hashSHA512(password + salt)}`;
};

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
export const verifyPasswordBcrypt = async (
  password: string,
  hash: string
): Promise<boolean> => {
  // This is a placeholder - actual implementation requires bcrypt package
  // import bcrypt from 'bcrypt';
  // return bcrypt.compare(password, hash);

  // Simulated verification
  const parts = hash.split('$');
  if (parts.length !== 5) return false;
  const salt = parts[3];
  const storedHash = parts[4];
  const computedHash = hashSHA512(password + salt);
  return computedHash === storedHash;
};

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
export const hashPasswordArgon2 = async (password: string): Promise<string> => {
  // This is a placeholder - actual implementation requires argon2 package
  // import argon2 from 'argon2';
  // return argon2.hash(password);

  // Simulated argon2 using crypto for demonstration
  const salt = crypto.randomBytes(16).toString('hex');
  return `$argon2id$v=19$${salt}$${hashSHA512(password + salt)}`;
};

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
export const verifyPasswordArgon2 = async (
  password: string,
  hash: string
): Promise<boolean> => {
  // This is a placeholder - actual implementation requires argon2 package
  // import argon2 from 'argon2';
  // return argon2.verify(hash, password);

  // Simulated verification
  const parts = hash.split('$');
  if (parts.length !== 5) return false;
  const salt = parts[3];
  const storedHash = parts[4];
  const computedHash = hashSHA512(password + salt);
  return computedHash === storedHash;
};

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
export const generateHMAC = (
  data: string,
  secret: string,
  config?: HmacConfig
): string => {
  const algorithm = config?.algorithm || 'sha256';
  const encoding = config?.encoding || 'hex';

  return crypto.createHmac(algorithm, secret).update(data).digest(encoding);
};

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
export const verifyHMAC = (
  data: string,
  signature: string,
  secret: string,
  config?: HmacConfig
): boolean => {
  const expectedSignature = generateHMAC(data, secret, config);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

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
export const generateHMACSHA256 = (payload: string, secret: string): string => {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
};

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
export const deriveKeyPBKDF2 = async (
  password: string,
  config: KeyDerivationConfig
): Promise<string> => {
  const {
    salt,
    iterations = 100000,
    keyLength = 32,
    digest = 'sha512',
  } = config;

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keyLength, digest, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });
};

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
export const deriveKeyScrypt = async (
  password: string,
  salt: string,
  keyLength: number = 32
): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });
};

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
export const generateSalt = (length: number = 16): string => {
  return crypto.randomBytes(length).toString('hex');
};

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
export const signDataRSA = (data: string, privateKey: string): SignatureResult => {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(data);
  sign.end();

  const signature = sign.sign(privateKey, 'base64');

  return {
    signature,
    algorithm: 'RSA-SHA256',
  };
};

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
export const verifySignatureRSA = (
  data: string,
  signature: string,
  publicKey: string
): boolean => {
  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(data);
  verify.end();

  return verify.verify(publicKey, signature, 'base64');
};

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
export const generateECDSAKeyPair = (namedCurve: string = 'secp256k1'): KeyPair => {
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
export const signDataECDSA = (data: string, privateKey: string): SignatureResult => {
  const sign = crypto.createSign('SHA256');
  sign.update(data);
  sign.end();

  const signature = sign.sign(privateKey, 'base64');

  return {
    signature,
    algorithm: 'ECDSA-SHA256',
  };
};

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
export const verifySignatureECDSA = (
  data: string,
  signature: string,
  publicKey: string
): boolean => {
  const verify = crypto.createVerify('SHA256');
  verify.update(data);
  verify.end();

  return verify.verify(publicKey, signature, 'base64');
};

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
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

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
export const generateAlphanumericToken = (config?: TokenConfig): string => {
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
export const generateNumericToken = (length: number = 6): string => {
  const randomBytes = crypto.randomBytes(length);
  let token = '';

  for (let i = 0; i < length; i++) {
    token += (randomBytes[i] % 10).toString();
  }

  return token;
};

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
export const generateUUID = (): string => {
  return crypto.randomUUID();
};

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
export const maskData = (data: string, config?: MaskingConfig): string => {
  const {
    visibleStart = 0,
    visibleEnd = 4,
    maskChar = '*',
  } = config || {};

  if (data.length <= visibleStart + visibleEnd) {
    return maskChar.repeat(data.length);
  }

  const start = data.slice(0, visibleStart);
  const end = data.slice(-visibleEnd);
  const middle = maskChar.repeat(data.length - visibleStart - visibleEnd);

  return start + middle + end;
};

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
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!domain) return email;

  const maskedLocal = local.charAt(0) + '***';
  return `${maskedLocal}@${domain}`;
};

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
export const maskPhoneNumber = (phone: string): string => {
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 4) return '***';

  const lastFour = digitsOnly.slice(-4);
  const format = phone.replace(/\d(?=.*\d{4})/g, '*');
  return format.replace(/\d{4}$/, lastFour);
};

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
export const maskCreditCard = (cardNumber: string): string => {
  const digitsOnly = cardNumber.replace(/\D/g, '');
  return maskData(digitsOnly, { visibleEnd: 4, maskChar: '*' }).replace(
    /(.{4})/g,
    '$1-'
  ).slice(0, -1);
};

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
export const redactSensitivePatterns = (
  text: string,
  patterns: RegExp[],
  replacement: string = '[REDACTED]'
): string => {
  let redacted = text;
  patterns.forEach(pattern => {
    redacted = redacted.replace(pattern, replacement);
  });
  return redacted;
};

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
export const rotateEncryptionKey = (
  encryptedData: DecryptionConfig,
  oldKey: string,
  newKey: string
): EncryptionResult => {
  const decrypted = decryptAES256GCM(encryptedData, oldKey);
  return encryptAES256GCM(decrypted, newKey);
};

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
export const generateKeyRotationSchedule = (rotationIntervalDays: number) => {
  const now = new Date();
  const nextRotation = new Date(now.getTime() + rotationIntervalDays * 24 * 60 * 60 * 1000);

  return {
    currentKeyId: generateUUID(),
    createdAt: now,
    nextRotation,
    rotationInterval: rotationIntervalDays,
  };
};

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
export const validateKeyStrength = (key: string, minLength: number = 32): boolean => {
  const keyBuffer = Buffer.from(key, 'hex');
  return keyBuffer.length >= minLength;
};

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
export const validateCertificate = (certificate: string) => {
  // This is a placeholder - actual implementation requires node-forge or similar
  return {
    valid: true,
    subject: 'CN=example.com',
    issuer: 'CN=CA',
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  };
};

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
export const isCertificateExpired = (expirationDate: Date): boolean => {
  return expirationDate < new Date();
};

export default {
  // AES-256 CBC
  encryptAES256CBC,
  decryptAES256CBC,

  // AES-256 GCM
  encryptAES256GCM,
  decryptAES256GCM,
  generateAES256Key,

  // RSA
  generateRSAKeyPair,
  encryptRSA,
  decryptRSA,

  // Hash functions
  hashSHA256,
  hashSHA512,
  hashWithOptions,
  hashPasswordBcrypt,
  verifyPasswordBcrypt,
  hashPasswordArgon2,
  verifyPasswordArgon2,

  // HMAC
  generateHMAC,
  verifyHMAC,
  generateHMACSHA256,

  // Key derivation
  deriveKeyPBKDF2,
  deriveKeyScrypt,
  generateSalt,

  // Digital signatures
  signDataRSA,
  verifySignatureRSA,
  generateECDSAKeyPair,
  signDataECDSA,
  verifySignatureECDSA,

  // Token generation
  generateSecureToken,
  generateAlphanumericToken,
  generateNumericToken,
  generateUUID,

  // Data masking
  maskData,
  maskEmail,
  maskPhoneNumber,
  maskCreditCard,
  redactSensitivePatterns,

  // Key rotation
  rotateEncryptionKey,
  generateKeyRotationSchedule,
  validateKeyStrength,

  // Certificate validation
  validateCertificate,
  isCertificateExpired,
};
