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
export declare const encryptAES256CBC: (plaintext: string, key: string) => EncryptionResult;
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
export declare const decryptAES256CBC: (config: DecryptionConfig, key: string) => string;
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
export declare const encryptAES256GCM: (plaintext: string, key: string) => EncryptionResult;
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
export declare const decryptAES256GCM: (config: DecryptionConfig, key: string) => string;
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
export declare const generateAES256Key: (encoding?: "hex" | "base64") => string;
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
export declare const generateRSAKeyPair: (modulusLength?: number) => KeyPair;
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
export declare const encryptRSA: (plaintext: string, publicKey: string) => string;
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
export declare const decryptRSA: (encrypted: string, privateKey: string) => string;
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
export declare const hashSHA256: (data: string, encoding?: "hex" | "base64") => string;
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
export declare const hashSHA512: (data: string, encoding?: "hex" | "base64") => string;
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
export declare const hashWithOptions: (data: string, options?: HashOptions) => string;
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
export declare const hashPasswordBcrypt: (password: string, saltRounds?: number) => Promise<string>;
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
export declare const verifyPasswordBcrypt: (password: string, hash: string) => Promise<boolean>;
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
export declare const hashPasswordArgon2: (password: string) => Promise<string>;
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
export declare const verifyPasswordArgon2: (password: string, hash: string) => Promise<boolean>;
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
export declare const generateHMAC: (data: string, secret: string, config?: HmacConfig) => string;
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
export declare const verifyHMAC: (data: string, signature: string, secret: string, config?: HmacConfig) => boolean;
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
export declare const generateHMACSHA256: (payload: string, secret: string) => string;
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
export declare const deriveKeyPBKDF2: (password: string, config: KeyDerivationConfig) => Promise<string>;
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
export declare const deriveKeyScrypt: (password: string, salt: string, keyLength?: number) => Promise<string>;
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
export declare const generateSalt: (length?: number) => string;
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
export declare const signDataRSA: (data: string, privateKey: string) => SignatureResult;
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
export declare const verifySignatureRSA: (data: string, signature: string, publicKey: string) => boolean;
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
export declare const generateECDSAKeyPair: (namedCurve?: string) => KeyPair;
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
export declare const signDataECDSA: (data: string, privateKey: string) => SignatureResult;
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
export declare const verifySignatureECDSA: (data: string, signature: string, publicKey: string) => boolean;
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
export declare const generateSecureToken: (length?: number) => string;
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
export declare const generateAlphanumericToken: (config?: TokenConfig) => string;
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
export declare const generateNumericToken: (length?: number) => string;
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
export declare const generateUUID: () => string;
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
export declare const maskData: (data: string, config?: MaskingConfig) => string;
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
export declare const maskEmail: (email: string) => string;
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
export declare const maskPhoneNumber: (phone: string) => string;
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
export declare const maskCreditCard: (cardNumber: string) => string;
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
export declare const redactSensitivePatterns: (text: string, patterns: RegExp[], replacement?: string) => string;
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
export declare const rotateEncryptionKey: (encryptedData: DecryptionConfig, oldKey: string, newKey: string) => EncryptionResult;
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
export declare const generateKeyRotationSchedule: (rotationIntervalDays: number) => {
    currentKeyId: string;
    createdAt: Date;
    nextRotation: Date;
    rotationInterval: number;
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
export declare const validateKeyStrength: (key: string, minLength?: number) => boolean;
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
export declare const validateCertificate: (certificate: string) => {
    valid: boolean;
    subject: string;
    issuer: string;
    expiresAt: Date;
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
export declare const isCertificateExpired: (expirationDate: Date) => boolean;
declare const _default: {
    encryptAES256CBC: (plaintext: string, key: string) => EncryptionResult;
    decryptAES256CBC: (config: DecryptionConfig, key: string) => string;
    encryptAES256GCM: (plaintext: string, key: string) => EncryptionResult;
    decryptAES256GCM: (config: DecryptionConfig, key: string) => string;
    generateAES256Key: (encoding?: "hex" | "base64") => string;
    generateRSAKeyPair: (modulusLength?: number) => KeyPair;
    encryptRSA: (plaintext: string, publicKey: string) => string;
    decryptRSA: (encrypted: string, privateKey: string) => string;
    hashSHA256: (data: string, encoding?: "hex" | "base64") => string;
    hashSHA512: (data: string, encoding?: "hex" | "base64") => string;
    hashWithOptions: (data: string, options?: HashOptions) => string;
    hashPasswordBcrypt: (password: string, saltRounds?: number) => Promise<string>;
    verifyPasswordBcrypt: (password: string, hash: string) => Promise<boolean>;
    hashPasswordArgon2: (password: string) => Promise<string>;
    verifyPasswordArgon2: (password: string, hash: string) => Promise<boolean>;
    generateHMAC: (data: string, secret: string, config?: HmacConfig) => string;
    verifyHMAC: (data: string, signature: string, secret: string, config?: HmacConfig) => boolean;
    generateHMACSHA256: (payload: string, secret: string) => string;
    deriveKeyPBKDF2: (password: string, config: KeyDerivationConfig) => Promise<string>;
    deriveKeyScrypt: (password: string, salt: string, keyLength?: number) => Promise<string>;
    generateSalt: (length?: number) => string;
    signDataRSA: (data: string, privateKey: string) => SignatureResult;
    verifySignatureRSA: (data: string, signature: string, publicKey: string) => boolean;
    generateECDSAKeyPair: (namedCurve?: string) => KeyPair;
    signDataECDSA: (data: string, privateKey: string) => SignatureResult;
    verifySignatureECDSA: (data: string, signature: string, publicKey: string) => boolean;
    generateSecureToken: (length?: number) => string;
    generateAlphanumericToken: (config?: TokenConfig) => string;
    generateNumericToken: (length?: number) => string;
    generateUUID: () => string;
    maskData: (data: string, config?: MaskingConfig) => string;
    maskEmail: (email: string) => string;
    maskPhoneNumber: (phone: string) => string;
    maskCreditCard: (cardNumber: string) => string;
    redactSensitivePatterns: (text: string, patterns: RegExp[], replacement?: string) => string;
    rotateEncryptionKey: (encryptedData: DecryptionConfig, oldKey: string, newKey: string) => EncryptionResult;
    generateKeyRotationSchedule: (rotationIntervalDays: number) => {
        currentKeyId: string;
        createdAt: Date;
        nextRotation: Date;
        rotationInterval: number;
    };
    validateKeyStrength: (key: string, minLength?: number) => boolean;
    validateCertificate: (certificate: string) => {
        valid: boolean;
        subject: string;
        issuer: string;
        expiresAt: Date;
    };
    isCertificateExpired: (expirationDate: Date) => boolean;
};
export default _default;
//# sourceMappingURL=encryption-utils.d.ts.map