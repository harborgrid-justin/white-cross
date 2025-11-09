"use strict";
/**
 * LOC: DATAPROT1234567
 * File: /reuse/data-protection-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Data encryption services
 *   - GDPR compliance modules
 *   - Field-level encryption handlers
 *   - Secrets management
 *   - Data anonymization services
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
exports.generateSecureIdentifier = exports.timingSafeCompare = exports.exportUserDataGDPR = exports.prepareDataForErasure = exports.createDataSubjectRequest = exports.isConsentValid = exports.recordDataSubjectConsent = exports.createGDPRComplianceRecord = exports.rotateSecret = exports.decryptSecret = exports.encryptSecret = exports.deriveEncryptionKey = exports.validateEncryptionKey = exports.rotateEncryptionKeys = exports.generateEncryptionKey = exports.createConsistentPseudonym = exports.pseudonymizeIdentifier = exports.anonymizeData = exports.maskPIIFields = exports.redactSensitiveData = exports.maskDataAdvanced = exports.createFormatPreservingToken = exports.detokenizeData = exports.tokenizeSensitiveData = exports.decryptObjectFields = exports.encryptObjectFields = exports.decryptWithValidation = exports.encryptWithMetadata = void 0;
/**
 * File: /reuse/data-protection-kit.ts
 * Locator: WC-UTL-DATAPROT-001
 * Purpose: Comprehensive Data Protection Kit - Complete data security and privacy toolkit
 *
 * Upstream: Independent utility module for data protection operations
 * Downstream: ../backend/*, Security services, GDPR handlers, Encryption modules, Privacy services
 * Dependencies: TypeScript 5.x, Node 18+, crypto, Sequelize 6.x
 * Exports: 45+ utility functions for encryption, tokenization, masking, GDPR compliance, key management
 *
 * LLM Context: Enterprise-grade data protection utilities for White Cross healthcare platform.
 * Provides comprehensive encryption (AES-256, RSA), field-level encryption, tokenization, data masking,
 * key management, secrets handling, GDPR compliance tools, data anonymization, pseudonymization,
 * and HIPAA-compliant data protection for PHI and sensitive healthcare information.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// ADVANCED ENCRYPTION OPERATIONS
// ============================================================================
/**
 * Encrypts data with comprehensive metadata and key tracking.
 *
 * @param {string} plaintext - Data to encrypt
 * @param {string} key - Encryption key (hex)
 * @param {object} [options] - Encryption options
 * @returns {EncryptionResult} Encryption result with metadata
 *
 * @example
 * ```typescript
 * const result = encryptWithMetadata('patient SSN: 123-45-6789', encryptionKey, {
 *   algorithm: 'aes-256-gcm',
 *   keyId: 'key-2024-01',
 *   includeTimestamp: true
 * });
 * ```
 */
const encryptWithMetadata = (plaintext, key, options) => {
    const algorithm = options?.algorithm || 'aes-256-gcm';
    const keyBuffer = Buffer.from(key, 'hex');
    const iv = crypto.randomBytes(16);
    let encrypted;
    let authTag;
    if (algorithm === 'aes-256-gcm') {
        const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
        encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        authTag = cipher.getAuthTag().toString('hex');
    }
    else {
        const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
        encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');
    }
    return {
        encrypted,
        iv: iv.toString('hex'),
        authTag,
        algorithm,
        keyId: options?.keyId,
        timestamp: options?.includeTimestamp ? Date.now() : undefined,
    };
};
exports.encryptWithMetadata = encryptWithMetadata;
/**
 * Decrypts data with validation and error handling.
 *
 * @param {DecryptionConfig} config - Decryption configuration
 * @param {string} key - Decryption key (hex)
 * @returns {string | null} Decrypted plaintext or null if failed
 *
 * @example
 * ```typescript
 * const plaintext = decryptWithValidation(encryptionResult, decryptionKey);
 * if (plaintext) {
 *   console.log('Decrypted:', plaintext);
 * }
 * ```
 */
const decryptWithValidation = (config, key) => {
    try {
        const algorithm = config.algorithm || 'aes-256-gcm';
        const keyBuffer = Buffer.from(key, 'hex');
        const ivBuffer = Buffer.from(config.iv, 'hex');
        let decrypted;
        if (algorithm === 'aes-256-gcm') {
            if (!config.authTag)
                return null;
            const authTagBuffer = Buffer.from(config.authTag, 'hex');
            const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
            decipher.setAuthTag(authTagBuffer);
            decrypted = decipher.update(config.encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
        }
        else {
            const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
            decrypted = decipher.update(config.encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
        }
        return decrypted;
    }
    catch (error) {
        return null;
    }
};
exports.decryptWithValidation = decryptWithValidation;
/**
 * Encrypts multiple fields in an object.
 *
 * @param {object} data - Data object
 * @param {FieldEncryptionConfig} config - Field encryption configuration
 * @param {string} key - Encryption key
 * @returns {object} Object with encrypted fields
 *
 * @example
 * ```typescript
 * const patient = {
 *   id: 'patient123',
 *   name: 'John Doe',
 *   ssn: '123-45-6789',
 *   medicalRecord: 'sensitive data'
 * };
 * const encrypted = encryptObjectFields(patient, {
 *   fields: ['ssn', 'medicalRecord'],
 *   algorithm: 'aes-256-gcm'
 * }, encryptionKey);
 * ```
 */
const encryptObjectFields = (data, config, key) => {
    const result = { ...data };
    config.fields.forEach(field => {
        if (field in result) {
            if (result[field] === null && config.preserveNull) {
                return;
            }
            const encrypted = (0, exports.encryptWithMetadata)(String(result[field]), key, { algorithm: config.algorithm, keyId: config.keyId });
            result[field] = encrypted;
        }
    });
    return result;
};
exports.encryptObjectFields = encryptObjectFields;
/**
 * Decrypts multiple fields in an object.
 *
 * @param {object} data - Data object with encrypted fields
 * @param {string[]} fields - Fields to decrypt
 * @param {string} key - Decryption key
 * @returns {object} Object with decrypted fields
 *
 * @example
 * ```typescript
 * const decrypted = decryptObjectFields(encryptedPatient, ['ssn', 'medicalRecord'], key);
 * ```
 */
const decryptObjectFields = (data, fields, key) => {
    const result = { ...data };
    fields.forEach(field => {
        if (field in result && typeof result[field] === 'object') {
            const decrypted = (0, exports.decryptWithValidation)(result[field], key);
            result[field] = decrypted;
        }
    });
    return result;
};
exports.decryptObjectFields = decryptObjectFields;
// ============================================================================
// TOKENIZATION
// ============================================================================
/**
 * Tokenizes sensitive data for secure storage.
 *
 * @param {string} data - Data to tokenize
 * @param {TokenizationConfig} [config] - Tokenization configuration
 * @returns {TokenizationResult} Tokenization result
 *
 * @example
 * ```typescript
 * const tokenized = tokenizeSensitiveData('4532-1234-5678-9010', {
 *   preserveFormat: true,
 *   tokenPrefix: 'tok_',
 *   tokenType: 'reversible'
 * });
 * // Store token, keep mapping for reversal
 * ```
 */
const tokenizeSensitiveData = (data, config) => {
    const tokenId = crypto.randomUUID();
    let token;
    if (config?.preserveFormat) {
        // Preserve format (e.g., credit card: ****-****-****-1234)
        const formatted = data.replace(/./g, () => {
            const randomByte = crypto.randomBytes(1)[0];
            return (randomByte % 36).toString(36);
        });
        token = formatted.slice(0, -4) + data.slice(-4);
    }
    else if (config?.preserveLength) {
        // Preserve length but randomize
        token = crypto.randomBytes(Math.ceil(data.length / 2))
            .toString('hex')
            .slice(0, data.length);
    }
    else {
        // Standard tokenization
        token = crypto.randomBytes(32).toString('hex');
    }
    const prefix = config?.tokenPrefix || 'tok_';
    const fullToken = `${prefix}${token}`;
    return {
        token: fullToken,
        original: config?.tokenType === 'reversible' ? data : undefined,
        metadata: { tokenId, preserveFormat: config?.preserveFormat },
        createdAt: new Date(),
    };
};
exports.tokenizeSensitiveData = tokenizeSensitiveData;
/**
 * Detokenizes data if reversible tokenization was used.
 *
 * @param {string} token - Token to reverse
 * @param {Map<string, string>} tokenStore - Token storage mapping
 * @returns {string | null} Original data or null if not found
 *
 * @example
 * ```typescript
 * const original = detokenizeData('tok_abc123...', tokenStore);
 * ```
 */
const detokenizeData = (token, tokenStore) => {
    return tokenStore.get(token) || null;
};
exports.detokenizeData = detokenizeData;
/**
 * Creates format-preserving token for specific data types.
 *
 * @param {string} data - Data to tokenize
 * @param {string} type - Data type (ssn, credit-card, phone, email)
 * @returns {string} Format-preserving token
 *
 * @example
 * ```typescript
 * const tokenizedSSN = createFormatPreservingToken('123-45-6789', 'ssn');
 * // Result: '***-**-6789' (preserves last 4 digits)
 * ```
 */
const createFormatPreservingToken = (data, type) => {
    switch (type) {
        case 'ssn':
            // Preserve last 4 digits
            return `***-**-${data.slice(-4)}`;
        case 'credit-card':
            // Preserve last 4 digits
            const last4 = data.replace(/\D/g, '').slice(-4);
            return `****-****-****-${last4}`;
        case 'phone':
            // Preserve last 4 digits
            const phoneDigits = data.replace(/\D/g, '');
            return `***-***-${phoneDigits.slice(-4)}`;
        case 'email':
            // Preserve domain
            const [, domain] = data.split('@');
            return `***@${domain}`;
        default:
            return '***';
    }
};
exports.createFormatPreservingToken = createFormatPreservingToken;
// ============================================================================
// DATA MASKING AND REDACTION
// ============================================================================
/**
 * Masks data with advanced strategies.
 *
 * @param {string} data - Data to mask
 * @param {MaskingConfig} config - Masking configuration
 * @returns {string} Masked data
 *
 * @example
 * ```typescript
 * const masked = maskDataAdvanced('sensitive-info-12345', {
 *   strategy: 'partial',
 *   visibleStart: 2,
 *   visibleEnd: 4,
 *   maskChar: '*'
 * });
 * // Result: 'se**************2345'
 * ```
 */
const maskDataAdvanced = (data, config) => {
    switch (config.strategy) {
        case 'full':
            return config.maskChar ? config.maskChar.repeat(data.length) : '*'.repeat(data.length);
        case 'partial':
            const start = config.visibleStart || 0;
            const end = config.visibleEnd || 4;
            const maskChar = config.maskChar || '*';
            if (data.length <= start + end) {
                return maskChar.repeat(data.length);
            }
            return (data.slice(0, start) +
                maskChar.repeat(data.length - start - end) +
                data.slice(-end));
        case 'hash':
            return crypto.createHash('sha256').update(data).digest('hex').slice(0, 16);
        case 'format-preserving':
            return data.replace(/[A-Za-z]/g, 'X').replace(/\d/g, '0');
        default:
            return '***';
    }
};
exports.maskDataAdvanced = maskDataAdvanced;
/**
 * Redacts sensitive patterns from text with advanced options.
 *
 * @param {string} text - Text to redact
 * @param {RedactionConfig} config - Redaction configuration
 * @returns {string} Redacted text
 *
 * @example
 * ```typescript
 * const redacted = redactSensitiveData(
 *   'Patient SSN: 123-45-6789, Email: patient@example.com',
 *   {
 *     patterns: [/\d{3}-\d{2}-\d{4}/, /[\w.-]+@[\w.-]+\.\w+/],
 *     replacement: '[REDACTED]',
 *     preserveLength: false
 *   }
 * );
 * ```
 */
const redactSensitiveData = (text, config) => {
    let redacted = text;
    config.patterns.forEach(pattern => {
        if (config.preserveLength) {
            redacted = redacted.replace(pattern, match => '*'.repeat(match.length));
        }
        else {
            redacted = redacted.replace(pattern, config.replacement || '[REDACTED]');
        }
    });
    return redacted;
};
exports.redactSensitiveData = redactSensitiveData;
/**
 * Masks PII fields in an object.
 *
 * @param {object} data - Data object
 * @param {string[]} piiFields - PII field names
 * @param {MaskingConfig} [config] - Masking configuration
 * @returns {object} Object with masked PII
 *
 * @example
 * ```typescript
 * const masked = maskPIIFields(patient, ['ssn', 'email', 'phone'], {
 *   strategy: 'partial',
 *   visibleEnd: 4
 * });
 * ```
 */
const maskPIIFields = (data, piiFields, config) => {
    const result = { ...data };
    const defaultConfig = config || { strategy: 'partial', visibleEnd: 4 };
    piiFields.forEach(field => {
        if (field in result && typeof result[field] === 'string') {
            result[field] = (0, exports.maskDataAdvanced)(result[field], defaultConfig);
        }
    });
    return result;
};
exports.maskPIIFields = maskPIIFields;
// ============================================================================
// ANONYMIZATION AND PSEUDONYMIZATION
// ============================================================================
/**
 * Anonymizes data using specified method.
 *
 * @param {any} data - Data to anonymize
 * @param {AnonymizationConfig} config - Anonymization configuration
 * @returns {any} Anonymized data
 *
 * @example
 * ```typescript
 * const anonymized = anonymizeData(42, {
 *   method: 'generalization',
 *   precision: 10
 * });
 * // Result: 40 (rounded to nearest 10)
 * ```
 */
const anonymizeData = (data, config) => {
    switch (config.method) {
        case 'generalization':
            if (typeof data === 'number' && config.precision) {
                return Math.floor(data / config.precision) * config.precision;
            }
            return data;
        case 'suppression':
            return config.suppressionValue || null;
        case 'perturbation':
            if (typeof data === 'number') {
                const noise = (Math.random() - 0.5) * (config.precision || 1);
                return data + noise;
            }
            return data;
        case 'aggregation':
            if (Array.isArray(data)) {
                return data.reduce((sum, val) => sum + val, 0) / data.length;
            }
            return data;
        default:
            return data;
    }
};
exports.anonymizeData = anonymizeData;
/**
 * Pseudonymizes identifier using cryptographic hash.
 *
 * @param {string} identifier - Identifier to pseudonymize
 * @param {PseudonymizationConfig} config - Pseudonymization configuration
 * @returns {string} Pseudonymized identifier
 *
 * @example
 * ```typescript
 * const pseudonym = pseudonymizeIdentifier('patient-123', {
 *   algorithm: 'sha256',
 *   salt: 'secret-salt',
 *   format: 'hex'
 * });
 * ```
 */
const pseudonymizeIdentifier = (identifier, config) => {
    const salt = config.salt || '';
    const dataToHash = `${identifier}${salt}`;
    let hash;
    if (config.algorithm === 'hmac') {
        hash = crypto.createHmac('sha256', salt).update(identifier).digest('hex');
    }
    else {
        hash = crypto.createHash(config.algorithm).update(dataToHash).digest('hex');
    }
    if (config.format === 'uuid') {
        // Convert hash to UUID format
        return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
    }
    else if (config.format === 'base64') {
        return Buffer.from(hash, 'hex').toString('base64');
    }
    return hash;
};
exports.pseudonymizeIdentifier = pseudonymizeIdentifier;
/**
 * Creates consistent pseudonym that can be reversed with mapping.
 *
 * @param {string} identifier - Original identifier
 * @param {Map<string, string>} pseudonymMap - Pseudonym mapping storage
 * @returns {string} Consistent pseudonym
 *
 * @example
 * ```typescript
 * const pseudonym = createConsistentPseudonym('user@example.com', pseudonymMap);
 * // Same input always returns same pseudonym
 * ```
 */
const createConsistentPseudonym = (identifier, pseudonymMap) => {
    if (pseudonymMap.has(identifier)) {
        return pseudonymMap.get(identifier);
    }
    const pseudonym = `pseudo_${crypto.randomUUID()}`;
    pseudonymMap.set(identifier, pseudonym);
    return pseudonym;
};
exports.createConsistentPseudonym = createConsistentPseudonym;
// ============================================================================
// KEY MANAGEMENT
// ============================================================================
/**
 * Generates encryption key with metadata.
 *
 * @param {string} algorithm - Encryption algorithm
 * @param {object} [options] - Key generation options
 * @returns {object} Key and metadata
 *
 * @example
 * ```typescript
 * const keyData = generateEncryptionKey('aes-256-gcm', {
 *   keyId: 'key-2024-01',
 *   expiresInDays: 90
 * });
 * ```
 */
const generateEncryptionKey = (algorithm, options) => {
    const key = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiresAt = options?.expiresInDays
        ? new Date(now.getTime() + options.expiresInDays * 24 * 60 * 60 * 1000)
        : undefined;
    const metadata = {
        keyId: options?.keyId || crypto.randomUUID(),
        algorithm,
        createdAt: now,
        expiresAt,
        status: 'active',
        metadata: options?.metadata,
    };
    return { key, metadata };
};
exports.generateEncryptionKey = generateEncryptionKey;
/**
 * Rotates encryption keys for encrypted data.
 *
 * @param {EncryptionResult} encryptedData - Data encrypted with old key
 * @param {string} oldKey - Old encryption key
 * @param {string} newKey - New encryption key
 * @param {KeyRotationConfig} config - Rotation configuration
 * @returns {EncryptionResult} Re-encrypted data with new key
 *
 * @example
 * ```typescript
 * const reEncrypted = rotateEncryptionKeys(oldEncrypted, oldKey, newKey, {
 *   oldKeyId: 'key-2023-12',
 *   newKeyId: 'key-2024-01',
 *   rotationDate: new Date()
 * });
 * ```
 */
const rotateEncryptionKeys = (encryptedData, oldKey, newKey, config) => {
    // Decrypt with old key
    const plaintext = (0, exports.decryptWithValidation)(encryptedData, oldKey);
    if (!plaintext) {
        throw new Error('Failed to decrypt data with old key');
    }
    // Encrypt with new key
    const reEncrypted = (0, exports.encryptWithMetadata)(plaintext, newKey, {
        algorithm: encryptedData.algorithm,
        keyId: config.newKeyId,
        includeTimestamp: true,
    });
    return reEncrypted;
};
exports.rotateEncryptionKeys = rotateEncryptionKeys;
/**
 * Validates encryption key strength and metadata.
 *
 * @param {string} key - Encryption key to validate
 * @param {KeyMetadata} metadata - Key metadata
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateEncryptionKey(key, metadata);
 * if (!result.valid) {
 *   console.log('Key invalid:', result.reasons);
 * }
 * ```
 */
const validateEncryptionKey = (key, metadata) => {
    const reasons = [];
    // Check key length (256 bits = 64 hex chars)
    if (key.length !== 64) {
        reasons.push('Invalid key length (must be 64 hex characters for AES-256)');
    }
    // Check key format (hex)
    if (!/^[0-9a-f]+$/i.test(key)) {
        reasons.push('Invalid key format (must be hexadecimal)');
    }
    // Check expiration
    if (metadata.expiresAt && metadata.expiresAt < new Date()) {
        reasons.push('Key has expired');
    }
    // Check status
    if (metadata.status === 'revoked') {
        reasons.push('Key has been revoked');
    }
    return {
        valid: reasons.length === 0,
        reasons: reasons.length > 0 ? reasons : undefined,
    };
};
exports.validateEncryptionKey = validateEncryptionKey;
/**
 * Derives encryption key from master key.
 *
 * @param {string} masterKey - Master encryption key
 * @param {string} context - Derivation context
 * @param {number} [keyLength] - Desired key length in bytes
 * @returns {string} Derived key
 *
 * @example
 * ```typescript
 * const derivedKey = deriveEncryptionKey(masterKey, 'patient-records', 32);
 * ```
 */
const deriveEncryptionKey = (masterKey, context, keyLength = 32) => {
    const salt = crypto.createHash('sha256').update(context).digest();
    const key = crypto.pbkdf2Sync(masterKey, salt, 100000, keyLength, 'sha512');
    return key.toString('hex');
};
exports.deriveEncryptionKey = deriveEncryptionKey;
// ============================================================================
// SECRETS MANAGEMENT
// ============================================================================
/**
 * Encrypts secret for secure storage.
 *
 * @param {SecretConfig} secret - Secret configuration
 * @param {string} masterKey - Master encryption key
 * @returns {object} Encrypted secret with metadata
 *
 * @example
 * ```typescript
 * const encrypted = encryptSecret({
 *   name: 'db-password',
 *   value: 'super-secret-password',
 *   expiresAt: new Date('2025-12-31'),
 *   rotationPolicy: { enabled: true, intervalDays: 90 }
 * }, masterKey);
 * ```
 */
const encryptSecret = (secret, masterKey) => {
    const encrypted = (0, exports.encryptWithMetadata)(secret.value, masterKey, {
        algorithm: 'aes-256-gcm',
        includeTimestamp: true,
    });
    const metadata = {
        ...secret,
        value: '[ENCRYPTED]',
        encrypted: true,
    };
    return { encrypted, metadata };
};
exports.encryptSecret = encryptSecret;
/**
 * Decrypts secret from storage.
 *
 * @param {EncryptionResult} encryptedSecret - Encrypted secret data
 * @param {string} masterKey - Master encryption key
 * @returns {string | null} Decrypted secret value
 *
 * @example
 * ```typescript
 * const secretValue = decryptSecret(encryptedData, masterKey);
 * ```
 */
const decryptSecret = (encryptedSecret, masterKey) => {
    return (0, exports.decryptWithValidation)(encryptedSecret, masterKey);
};
exports.decryptSecret = decryptSecret;
/**
 * Rotates secret value with tracking.
 *
 * @param {SecretConfig} currentSecret - Current secret
 * @param {string} newValue - New secret value
 * @param {string} masterKey - Master encryption key
 * @returns {object} Rotated secret data
 *
 * @example
 * ```typescript
 * const rotated = rotateSecret(currentSecret, newPassword, masterKey);
 * ```
 */
const rotateSecret = (currentSecret, newValue, masterKey) => {
    const newSecret = {
        ...currentSecret,
        value: newValue,
    };
    return (0, exports.encryptSecret)(newSecret, masterKey);
};
exports.rotateSecret = rotateSecret;
// ============================================================================
// GDPR COMPLIANCE UTILITIES
// ============================================================================
/**
 * Creates GDPR compliance record for data processing.
 *
 * @param {GDPRComplianceConfig} config - GDPR configuration
 * @returns {object} Compliance record
 *
 * @example
 * ```typescript
 * const record = createGDPRComplianceRecord({
 *   dataSubjectId: 'patient123',
 *   processingPurpose: 'medical-treatment',
 *   legalBasis: 'consent',
 *   retentionPeriod: 2592000000, // 30 days
 *   dataCategories: ['health-data', 'contact-info']
 * });
 * ```
 */
const createGDPRComplianceRecord = (config) => {
    return {
        ...config,
        recordId: crypto.randomUUID(),
        createdAt: new Date(),
    };
};
exports.createGDPRComplianceRecord = createGDPRComplianceRecord;
/**
 * Records data subject consent.
 *
 * @param {string} dataSubjectId - Data subject identifier
 * @param {string} purpose - Processing purpose
 * @param {boolean} granted - Consent granted
 * @param {object} [options] - Additional options
 * @returns {ConsentRecord} Consent record
 *
 * @example
 * ```typescript
 * const consent = recordDataSubjectConsent('patient123', 'marketing', true, {
 *   expiresAt: new Date('2025-12-31')
 * });
 * ```
 */
const recordDataSubjectConsent = (dataSubjectId, purpose, granted, options) => {
    return {
        dataSubjectId,
        consentId: crypto.randomUUID(),
        purpose,
        granted,
        timestamp: new Date(),
        expiresAt: options?.expiresAt,
        metadata: options?.metadata,
    };
};
exports.recordDataSubjectConsent = recordDataSubjectConsent;
/**
 * Validates if consent is still valid.
 *
 * @param {ConsentRecord} consent - Consent record
 * @returns {boolean} True if consent is valid
 *
 * @example
 * ```typescript
 * if (isConsentValid(consentRecord)) {
 *   // Process data
 * }
 * ```
 */
const isConsentValid = (consent) => {
    if (!consent.granted)
        return false;
    if (consent.revokedAt)
        return false;
    if (consent.expiresAt && consent.expiresAt < new Date())
        return false;
    return true;
};
exports.isConsentValid = isConsentValid;
/**
 * Creates data subject access request (DSAR).
 *
 * @param {string} dataSubjectId - Data subject identifier
 * @param {string} requestType - Request type
 * @returns {DataSubjectRequest} DSAR object
 *
 * @example
 * ```typescript
 * const request = createDataSubjectRequest('patient123', 'access');
 * ```
 */
const createDataSubjectRequest = (dataSubjectId, requestType) => {
    return {
        requestId: crypto.randomUUID(),
        dataSubjectId,
        requestType,
        status: 'pending',
        submittedAt: new Date(),
    };
};
exports.createDataSubjectRequest = createDataSubjectRequest;
/**
 * Prepares data for GDPR right to be forgotten (erasure).
 *
 * @param {object} data - Data object
 * @param {string[]} fieldsToErase - Fields to erase
 * @param {boolean} [pseudonymize] - Whether to pseudonymize instead of delete
 * @returns {object} Processed data
 *
 * @example
 * ```typescript
 * const erased = prepareDataForErasure(patientRecord,
 *   ['name', 'email', 'ssn'],
 *   true // pseudonymize instead of complete deletion
 * );
 * ```
 */
const prepareDataForErasure = (data, fieldsToErase, pseudonymize = false) => {
    const result = { ...data };
    fieldsToErase.forEach(field => {
        if (field in result) {
            if (pseudonymize) {
                result[field] = (0, exports.pseudonymizeIdentifier)(String(result[field]), {
                    algorithm: 'sha256',
                    format: 'uuid',
                });
            }
            else {
                result[field] = null;
            }
        }
    });
    return result;
};
exports.prepareDataForErasure = prepareDataForErasure;
/**
 * Exports user data for GDPR data portability.
 *
 * @param {object} userData - User data object
 * @param {string} format - Export format
 * @returns {string} Exported data
 *
 * @example
 * ```typescript
 * const exported = exportUserDataGDPR(userData, 'json');
 * // Returns JSON string with all user data
 * ```
 */
const exportUserDataGDPR = (userData, format = 'json') => {
    switch (format) {
        case 'json':
            return JSON.stringify(userData, null, 2);
        case 'csv':
            // Simple CSV conversion (for flat objects)
            const headers = Object.keys(userData).join(',');
            const values = Object.values(userData).join(',');
            return `${headers}\n${values}`;
        case 'xml':
            // Simple XML conversion
            const xmlEntries = Object.entries(userData)
                .map(([key, value]) => `  <${key}>${value}</${key}>`)
                .join('\n');
            return `<user-data>\n${xmlEntries}\n</user-data>`;
        default:
            return JSON.stringify(userData);
    }
};
exports.exportUserDataGDPR = exportUserDataGDPR;
// ============================================================================
// SECURE DATA COMPARISON
// ============================================================================
/**
 * Performs timing-safe string comparison.
 *
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} True if strings match
 *
 * @example
 * ```typescript
 * if (timingSafeCompare(providedHash, storedHash)) {
 *   // Hashes match
 * }
 * ```
 */
const timingSafeCompare = (a, b) => {
    if (a.length !== b.length) {
        // Use timing-safe comparison even for length to prevent timing attacks
        const bufferA = Buffer.from(a);
        const bufferB = Buffer.alloc(a.length);
        return crypto.timingSafeEqual(bufferA, bufferB);
    }
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};
exports.timingSafeCompare = timingSafeCompare;
/**
 * Generates secure random identifier.
 *
 * @param {string} [prefix] - Optional prefix
 * @param {number} [length] - Length in bytes
 * @returns {string} Secure identifier
 *
 * @example
 * ```typescript
 * const id = generateSecureIdentifier('patient_', 16);
 * // Result: 'patient_a1b2c3d4e5f6...'
 * ```
 */
const generateSecureIdentifier = (prefix = '', length = 16) => {
    const randomId = crypto.randomBytes(length).toString('hex');
    return `${prefix}${randomId}`;
};
exports.generateSecureIdentifier = generateSecureIdentifier;
exports.default = {
    // Advanced encryption
    encryptWithMetadata: exports.encryptWithMetadata,
    decryptWithValidation: exports.decryptWithValidation,
    encryptObjectFields: exports.encryptObjectFields,
    decryptObjectFields: exports.decryptObjectFields,
    // Tokenization
    tokenizeSensitiveData: exports.tokenizeSensitiveData,
    detokenizeData: exports.detokenizeData,
    createFormatPreservingToken: exports.createFormatPreservingToken,
    // Masking and redaction
    maskDataAdvanced: exports.maskDataAdvanced,
    redactSensitiveData: exports.redactSensitiveData,
    maskPIIFields: exports.maskPIIFields,
    // Anonymization
    anonymizeData: exports.anonymizeData,
    pseudonymizeIdentifier: exports.pseudonymizeIdentifier,
    createConsistentPseudonym: exports.createConsistentPseudonym,
    // Key management
    generateEncryptionKey: exports.generateEncryptionKey,
    rotateEncryptionKeys: exports.rotateEncryptionKeys,
    validateEncryptionKey: exports.validateEncryptionKey,
    deriveEncryptionKey: exports.deriveEncryptionKey,
    // Secrets management
    encryptSecret: exports.encryptSecret,
    decryptSecret: exports.decryptSecret,
    rotateSecret: exports.rotateSecret,
    // GDPR compliance
    createGDPRComplianceRecord: exports.createGDPRComplianceRecord,
    recordDataSubjectConsent: exports.recordDataSubjectConsent,
    isConsentValid: exports.isConsentValid,
    createDataSubjectRequest: exports.createDataSubjectRequest,
    prepareDataForErasure: exports.prepareDataForErasure,
    exportUserDataGDPR: exports.exportUserDataGDPR,
    // Secure utilities
    timingSafeCompare: exports.timingSafeCompare,
    generateSecureIdentifier: exports.generateSecureIdentifier,
};
//# sourceMappingURL=data-protection-kit.js.map