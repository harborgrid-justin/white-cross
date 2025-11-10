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
interface EncryptionConfig {
    algorithm?: 'aes-256-gcm' | 'aes-256-cbc' | 'aes-192-gcm' | 'aes-128-gcm';
    key?: Buffer | string;
    iv?: Buffer;
    authTagLength?: number;
}
interface EncryptedData {
    encryptedData: string;
    iv: string;
    authTag?: string;
    algorithm: string;
    keyId?: string;
}
interface RSAKeyPair {
    publicKey: string;
    privateKey: string;
    format: 'pem' | 'der';
    keySize: number;
}
interface RSAEncryptionOptions {
    padding?: number;
    oaepHash?: string;
}
interface HashConfig {
    algorithm?: 'sha256' | 'sha384' | 'sha512' | 'sha3-256' | 'sha3-512';
    encoding?: 'hex' | 'base64' | 'base64url';
    iterations?: number;
}
interface BcryptConfig {
    saltRounds?: number;
    pepper?: string;
}
interface Argon2Config {
    type?: 0 | 1 | 2;
    memoryCost?: number;
    timeCost?: number;
    parallelism?: number;
    hashLength?: number;
    salt?: Buffer;
}
interface HMACConfig {
    algorithm?: 'sha256' | 'sha384' | 'sha512';
    key: string | Buffer;
    encoding?: 'hex' | 'base64' | 'base64url';
}
interface HMACSignature {
    signature: string;
    algorithm: string;
    timestamp: number;
}
interface KeyRotationPolicy {
    keyId: string;
    algorithm: string;
    createdAt: Date;
    rotateAfterDays?: number;
    expiresAt?: Date;
    status: 'active' | 'rotating' | 'deprecated' | 'revoked';
    metadata?: Record<string, any>;
}
interface PIIMaskingConfig {
    maskChar?: string;
    visibleStart?: number;
    visibleEnd?: number;
    preserveFormat?: boolean;
}
interface TokenizationConfig {
    tokenLength?: number;
    tokenPrefix?: string;
    algorithm?: string;
    preserveLength?: boolean;
}
interface TokenizationResult {
    token: string;
    tokenHash: string;
    originalLength: number;
    createdAt: Date;
    expiresAt?: Date;
}
interface SQLInjectionCheckResult {
    isSafe: boolean;
    threats: string[];
    sanitized: string;
    severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
}
interface XSSCheckResult {
    isSafe: boolean;
    threats: string[];
    sanitized: string;
    severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
}
interface CSRFTokenConfig {
    secret: string;
    sessionId?: string;
    expiresIn?: number;
    algorithm?: 'sha256' | 'sha512';
}
interface CSRFToken {
    token: string;
    hash: string;
    createdAt: Date;
    expiresAt: Date;
}
interface CSPDirectives {
    defaultSrc?: string[];
    scriptSrc?: string[];
    styleSrc?: string[];
    imgSrc?: string[];
    fontSrc?: string[];
    connectSrc?: string[];
    frameSrc?: string[];
    objectSrc?: string[];
    mediaSrc?: string[];
    workerSrc?: string[];
    manifestSrc?: string[];
    baseUri?: string[];
    formAction?: string[];
    frameAncestors?: string[];
    reportUri?: string;
    upgradeInsecureRequests?: boolean;
}
interface SecurityHeaders {
    'Strict-Transport-Security'?: string;
    'X-Content-Type-Options'?: string;
    'X-Frame-Options'?: string;
    'X-XSS-Protection'?: string;
    'Content-Security-Policy'?: string;
    'Referrer-Policy'?: string;
    'Permissions-Policy'?: string;
    'X-DNS-Prefetch-Control'?: string;
    'X-Download-Options'?: string;
    'X-Permitted-Cross-Domain-Policies'?: string;
}
interface SanitizationConfig {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    stripTags?: boolean;
    escapeHtml?: boolean;
    maxLength?: number;
}
interface EncodingOptions {
    encoding?: 'html' | 'xml' | 'js' | 'css' | 'url' | 'base64';
    doubleEncode?: boolean;
}
interface PBKDF2Config {
    password: string;
    salt?: Buffer | string;
    iterations?: number;
    keyLength?: number;
    digest?: 'sha256' | 'sha512';
}
interface PBKDF2Result {
    derivedKey: Buffer;
    salt: Buffer;
    iterations: number;
    keyLength: number;
    algorithm: string;
}
interface SecurityEvent {
    eventId: string;
    eventType: 'encryption' | 'decryption' | 'key_rotation' | 'key_access' | 'pii_access' | 'sql_injection_attempt' | 'xss_attempt' | 'csrf_validation' | 'auth_failure';
    severity: 'info' | 'warning' | 'error' | 'critical';
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    details: Record<string, any>;
    timestamp: Date;
}
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
export declare function getEncryptionKeyModelAttributes(): {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    keyId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
    encryptedKey: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    kekId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    algorithm: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    version: {
        type: string;
        allowNull: boolean;
        defaultValue: number;
        comment: string;
    };
    purpose: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
        comment: string;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    rotatedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    rotateAfterDays: {
        type: string;
        allowNull: boolean;
        defaultValue: number;
        comment: string;
    };
    metadata: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
};
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
export declare function getSecurityEventModelAttributes(): {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    eventId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
    eventType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    severity: {
        type: string;
        values: string[];
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    userId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    ipAddress: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    userAgent: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    resource: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    action: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    result: {
        type: string;
        values: string[];
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    details: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
        comment: string;
    };
    metadata: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    timestamp: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
};
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
export declare function getTokenizedDataModelAttributes(): {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    token: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
    tokenHash: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
    encryptedOriginal: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    iv: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    authTag: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    dataType: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    userId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    keyId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    algorithm: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    accessCount: {
        type: string;
        allowNull: boolean;
        defaultValue: number;
        comment: string;
    };
    lastAccessedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    metadata: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
};
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
export declare function getSecureSessionModelAttributes(): {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    sessionId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
    userId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    encryptedData: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    iv: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    authTag: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    keyId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    ipAddress: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    userAgent: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    lastAccessedAt: {
        type: string;
        allowNull: boolean;
        defaultValue: string;
        comment: string;
    };
    isActive: {
        type: string;
        allowNull: boolean;
        defaultValue: boolean;
        comment: string;
    };
    metadata: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
};
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
export declare function encryptAES(data: string, key: Buffer | string, config?: Partial<EncryptionConfig>): EncryptedData;
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
export declare function decryptAES(encryptedData: EncryptedData, key: Buffer | string): string;
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
export declare function encryptAESCBC(data: string, key: Buffer | string, iv?: Buffer): EncryptedData;
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
export declare function decryptAESCBC(encryptedData: EncryptedData, key: Buffer | string): string;
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
export declare function generateRSAKeyPair(keySize?: 2048 | 3072 | 4096, format?: 'pem' | 'der'): RSAKeyPair;
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
export declare function encryptRSA(data: string, publicKey: string, options?: RSAEncryptionOptions): string;
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
export declare function decryptRSA(encryptedData: string, privateKey: string, options?: RSAEncryptionOptions): string;
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
export declare function hashSHA256(data: string, encoding?: 'hex' | 'base64' | 'base64url'): string;
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
export declare function hashSHA512(data: string, encoding?: 'hex' | 'base64' | 'base64url'): string;
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
export declare function hashData(data: string, config?: HashConfig): string;
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
export declare function hashPasswordBcrypt(password: string, config?: BcryptConfig): Promise<string>;
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
export declare function verifyPasswordBcrypt(password: string, hash: string, pepper?: string): Promise<boolean>;
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
export declare function hashPasswordArgon2(password: string, config?: Argon2Config): Promise<string>;
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
export declare function verifyPasswordArgon2(password: string, hash: string): Promise<boolean>;
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
export declare function generateHMAC(data: string, config: HMACConfig): HMACSignature;
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
export declare function verifyHMAC(data: string, signature: string, config: HMACConfig): boolean;
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
export declare function generateTimestampedHMAC(data: string, key: string, expiresInMs?: number): string;
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
export declare function verifyTimestampedHMAC(data: string, signedData: string, key: string): boolean;
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
export declare function generateEncryptionKey(keyLength?: 16 | 24 | 32): Buffer;
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
export declare function createKeyRotationPolicy(keyId: string, algorithm: string, rotateAfterDays?: number): KeyRotationPolicy;
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
export declare function shouldRotateKey(policy: KeyRotationPolicy): boolean;
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
export declare function rotateEncryptionKey(currentPolicy: KeyRotationPolicy, keyLength?: 16 | 24 | 32): {
    newKey: Buffer;
    newPolicy: KeyRotationPolicy;
    oldPolicy: KeyRotationPolicy;
};
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
export declare function deriveKeyFromMaster(masterKey: Buffer, context: string, keyLength?: number): Buffer;
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
export declare function generateSecureRandomBytes(length: number): Buffer;
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
export declare function generateSecureRandomString(length: number, encoding?: 'hex' | 'base64' | 'base64url'): string;
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
export declare function generateSecureRandomInt(min: number, max: number): number;
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
export declare function generateSecureToken(length?: number, prefix?: string): string;
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
export declare function maskPIIData(data: string, config?: PIIMaskingConfig): string;
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
export declare function maskEmail(email: string): string;
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
export declare function maskPhoneNumber(phone: string): string;
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
export declare function maskCreditCard(cardNumber: string): string;
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
export declare function maskSSN(ssn: string): string;
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
export declare function tokenizeSensitiveData(data: string, key: Buffer, config?: TokenizationConfig): TokenizationResult;
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
export declare function detokenizeSensitiveData(token: string, encryptedData: EncryptedData, key: Buffer): string;
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
export declare function checkSQLInjection(input: string): SQLInjectionCheckResult;
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
export declare function sanitizeSQLInput(input: string): string;
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
export declare function sanitizeSQLLikePattern(pattern: string): string;
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
export declare function checkXSS(input: string): XSSCheckResult;
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
export declare function sanitizeHTML(html: string): string;
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
export declare function stripHTMLTags(html: string, allowedTags?: string[]): string;
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
export declare function sanitizeInput(input: string, config?: SanitizationConfig): string;
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
export declare function generateCSRFToken(config: CSRFTokenConfig): CSRFToken;
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
export declare function verifyCSRFToken(token: string, config: CSRFTokenConfig): boolean;
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
export declare function generateDoubleSubmitCSRFToken(): string;
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
export declare function buildCSPHeader(directives: CSPDirectives): string;
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
export declare function getStrictCSP(): CSPDirectives;
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
export declare function generateCSPNonce(): string;
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
export declare function getSecurityHeaders(): SecurityHeaders;
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
export declare function getHIPAASecurityHeaders(): SecurityHeaders;
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
export declare function encodeOutput(data: string, options?: EncodingOptions): string;
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
export declare function decodeOutput(data: string, encoding: 'html' | 'url' | 'base64'): string;
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
export declare function deriveKeyPBKDF2(config: PBKDF2Config): PBKDF2Result;
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
export declare function verifyPBKDF2(password: string, result: PBKDF2Result): boolean;
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
export declare function deriveMultipleKeys(password: string, purposes: string[], keyLength?: number): Map<string, Buffer>;
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
export declare function createSecurityEvent(event: Omit<SecurityEvent, 'eventId' | 'timestamp'>): SecurityEvent;
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
export declare function logSecurityEvent(event: Omit<SecurityEvent, 'eventId' | 'timestamp'>): void;
export {};
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
//# sourceMappingURL=security-encryption-kit.d.ts.map