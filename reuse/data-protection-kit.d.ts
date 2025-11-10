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
interface EncryptionResult {
    encrypted: string;
    iv: string;
    authTag?: string;
    algorithm: string;
    keyId?: string;
    timestamp?: number;
}
interface DecryptionConfig {
    encrypted: string;
    iv: string;
    authTag?: string;
    algorithm?: string;
    keyId?: string;
}
interface FieldEncryptionConfig {
    fields: string[];
    algorithm?: 'aes-256-gcm' | 'aes-256-cbc';
    keyId?: string;
    preserveNull?: boolean;
}
interface TokenizationConfig {
    preserveFormat?: boolean;
    preserveLength?: boolean;
    tokenPrefix?: string;
    tokenType?: 'reversible' | 'irreversible';
}
interface TokenizationResult {
    token: string;
    original?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
interface MaskingConfig {
    strategy: 'partial' | 'full' | 'hash' | 'format-preserving';
    visibleStart?: number;
    visibleEnd?: number;
    maskChar?: string;
    preserveFormat?: boolean;
}
interface RedactionConfig {
    patterns: RegExp[];
    replacement?: string;
    preserveLength?: boolean;
}
interface AnonymizationConfig {
    method: 'generalization' | 'suppression' | 'perturbation' | 'aggregation';
    precision?: number;
    suppressionValue?: string;
}
interface PseudonymizationConfig {
    algorithm: 'sha256' | 'sha512' | 'hmac';
    salt?: string;
    format?: 'hex' | 'base64' | 'uuid';
}
interface KeyRotationConfig {
    oldKeyId: string;
    newKeyId: string;
    rotationDate: Date;
    autoRotate?: boolean;
    rotationIntervalDays?: number;
}
interface KeyMetadata {
    keyId: string;
    algorithm: string;
    createdAt: Date;
    expiresAt?: Date;
    rotatedFrom?: string;
    status: 'active' | 'rotating' | 'deprecated' | 'revoked';
    metadata?: Record<string, any>;
}
interface SecretConfig {
    name: string;
    value: string;
    encrypted?: boolean;
    expiresAt?: Date;
    rotationPolicy?: {
        enabled: boolean;
        intervalDays: number;
    };
    metadata?: Record<string, any>;
}
interface GDPRComplianceConfig {
    dataSubjectId: string;
    processingPurpose: string;
    legalBasis: 'consent' | 'contract' | 'legal-obligation' | 'vital-interests' | 'public-task' | 'legitimate-interests';
    retentionPeriod?: number;
    dataCategories: string[];
}
interface ConsentRecord {
    dataSubjectId: string;
    consentId: string;
    purpose: string;
    granted: boolean;
    timestamp: Date;
    expiresAt?: Date;
    revokedAt?: Date;
    metadata?: Record<string, any>;
}
interface DataSubjectRequest {
    requestId: string;
    dataSubjectId: string;
    requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection';
    status: 'pending' | 'processing' | 'completed' | 'rejected';
    submittedAt: Date;
    completedAt?: Date;
}
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
export declare const encryptWithMetadata: (plaintext: string, key: string, options?: {
    algorithm?: "aes-256-gcm" | "aes-256-cbc";
    keyId?: string;
    includeTimestamp?: boolean;
}) => EncryptionResult;
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
export declare const decryptWithValidation: (config: DecryptionConfig, key: string) => string | null;
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
export declare const encryptObjectFields: (data: any, config: FieldEncryptionConfig, key: string) => any;
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
export declare const decryptObjectFields: (data: any, fields: string[], key: string) => any;
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
export declare const tokenizeSensitiveData: (data: string, config?: TokenizationConfig) => TokenizationResult;
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
export declare const detokenizeData: (token: string, tokenStore: Map<string, string>) => string | null;
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
export declare const createFormatPreservingToken: (data: string, type: "ssn" | "credit-card" | "phone" | "email") => string;
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
export declare const maskDataAdvanced: (data: string, config: MaskingConfig) => string;
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
export declare const redactSensitiveData: (text: string, config: RedactionConfig) => string;
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
export declare const maskPIIFields: (data: any, piiFields: string[], config?: MaskingConfig) => any;
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
export declare const anonymizeData: (data: any, config: AnonymizationConfig) => any;
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
export declare const pseudonymizeIdentifier: (identifier: string, config: PseudonymizationConfig) => string;
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
export declare const createConsistentPseudonym: (identifier: string, pseudonymMap: Map<string, string>) => string;
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
export declare const generateEncryptionKey: (algorithm: "aes-256-gcm" | "aes-256-cbc", options?: {
    keyId?: string;
    expiresInDays?: number;
    metadata?: Record<string, any>;
}) => {
    key: string;
    metadata: KeyMetadata;
};
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
export declare const rotateEncryptionKeys: (encryptedData: EncryptionResult, oldKey: string, newKey: string, config: KeyRotationConfig) => EncryptionResult;
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
export declare const validateEncryptionKey: (key: string, metadata: KeyMetadata) => {
    valid: boolean;
    reasons?: string[];
};
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
export declare const deriveEncryptionKey: (masterKey: string, context: string, keyLength?: number) => string;
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
export declare const encryptSecret: (secret: SecretConfig, masterKey: string) => {
    encrypted: EncryptionResult;
    metadata: SecretConfig;
};
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
export declare const decryptSecret: (encryptedSecret: EncryptionResult, masterKey: string) => string | null;
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
export declare const rotateSecret: (currentSecret: SecretConfig, newValue: string, masterKey: string) => {
    encrypted: EncryptionResult;
    metadata: SecretConfig;
};
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
export declare const createGDPRComplianceRecord: (config: GDPRComplianceConfig) => GDPRComplianceConfig & {
    recordId: string;
    createdAt: Date;
};
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
export declare const recordDataSubjectConsent: (dataSubjectId: string, purpose: string, granted: boolean, options?: {
    expiresAt?: Date;
    metadata?: Record<string, any>;
}) => ConsentRecord;
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
export declare const isConsentValid: (consent: ConsentRecord) => boolean;
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
export declare const createDataSubjectRequest: (dataSubjectId: string, requestType: "access" | "rectification" | "erasure" | "portability" | "restriction" | "objection") => DataSubjectRequest;
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
export declare const prepareDataForErasure: (data: any, fieldsToErase: string[], pseudonymize?: boolean) => any;
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
export declare const exportUserDataGDPR: (userData: any, format?: "json" | "csv" | "xml") => string;
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
export declare const timingSafeCompare: (a: string, b: string) => boolean;
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
export declare const generateSecureIdentifier: (prefix?: string, length?: number) => string;
declare const _default: {
    encryptWithMetadata: (plaintext: string, key: string, options?: {
        algorithm?: "aes-256-gcm" | "aes-256-cbc";
        keyId?: string;
        includeTimestamp?: boolean;
    }) => EncryptionResult;
    decryptWithValidation: (config: DecryptionConfig, key: string) => string | null;
    encryptObjectFields: (data: any, config: FieldEncryptionConfig, key: string) => any;
    decryptObjectFields: (data: any, fields: string[], key: string) => any;
    tokenizeSensitiveData: (data: string, config?: TokenizationConfig) => TokenizationResult;
    detokenizeData: (token: string, tokenStore: Map<string, string>) => string | null;
    createFormatPreservingToken: (data: string, type: "ssn" | "credit-card" | "phone" | "email") => string;
    maskDataAdvanced: (data: string, config: MaskingConfig) => string;
    redactSensitiveData: (text: string, config: RedactionConfig) => string;
    maskPIIFields: (data: any, piiFields: string[], config?: MaskingConfig) => any;
    anonymizeData: (data: any, config: AnonymizationConfig) => any;
    pseudonymizeIdentifier: (identifier: string, config: PseudonymizationConfig) => string;
    createConsistentPseudonym: (identifier: string, pseudonymMap: Map<string, string>) => string;
    generateEncryptionKey: (algorithm: "aes-256-gcm" | "aes-256-cbc", options?: {
        keyId?: string;
        expiresInDays?: number;
        metadata?: Record<string, any>;
    }) => {
        key: string;
        metadata: KeyMetadata;
    };
    rotateEncryptionKeys: (encryptedData: EncryptionResult, oldKey: string, newKey: string, config: KeyRotationConfig) => EncryptionResult;
    validateEncryptionKey: (key: string, metadata: KeyMetadata) => {
        valid: boolean;
        reasons?: string[];
    };
    deriveEncryptionKey: (masterKey: string, context: string, keyLength?: number) => string;
    encryptSecret: (secret: SecretConfig, masterKey: string) => {
        encrypted: EncryptionResult;
        metadata: SecretConfig;
    };
    decryptSecret: (encryptedSecret: EncryptionResult, masterKey: string) => string | null;
    rotateSecret: (currentSecret: SecretConfig, newValue: string, masterKey: string) => {
        encrypted: EncryptionResult;
        metadata: SecretConfig;
    };
    createGDPRComplianceRecord: (config: GDPRComplianceConfig) => GDPRComplianceConfig & {
        recordId: string;
        createdAt: Date;
    };
    recordDataSubjectConsent: (dataSubjectId: string, purpose: string, granted: boolean, options?: {
        expiresAt?: Date;
        metadata?: Record<string, any>;
    }) => ConsentRecord;
    isConsentValid: (consent: ConsentRecord) => boolean;
    createDataSubjectRequest: (dataSubjectId: string, requestType: "access" | "rectification" | "erasure" | "portability" | "restriction" | "objection") => DataSubjectRequest;
    prepareDataForErasure: (data: any, fieldsToErase: string[], pseudonymize?: boolean) => any;
    exportUserDataGDPR: (userData: any, format?: "json" | "csv" | "xml") => string;
    timingSafeCompare: (a: string, b: string) => boolean;
    generateSecureIdentifier: (prefix?: string, length?: number) => string;
};
export default _default;
//# sourceMappingURL=data-protection-kit.d.ts.map