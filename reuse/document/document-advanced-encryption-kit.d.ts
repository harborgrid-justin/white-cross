/**
 * LOC: DOC-ENC-001
 * File: /reuse/document/document-advanced-encryption-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto (Node.js)
 *   - sequelize (v6.x)
 *   - argon2
 *   - node-forge
 *   - @aws-sdk/client-kms
 *   - @azure/keyvault-keys
 *
 * DOWNSTREAM (imported by):
 *   - Document encryption controllers
 *   - DRM policy services
 *   - Key management modules
 *   - HSM integration services
 *   - Quantum-resistant encryption handlers
 */
/**
 * File: /reuse/document/document-advanced-encryption-kit.ts
 * Locator: WC-UTL-DOCENC-001
 * Purpose: Advanced Document Encryption & DRM Kit - AES-256, quantum-resistant encryption, DRM policy enforcement, key rotation, HSM integration
 *
 * Upstream: @nestjs/common, crypto, sequelize, argon2, node-forge, @aws-sdk/client-kms, @azure/keyvault-keys
 * Downstream: Encryption controllers, DRM services, key rotation schedulers, HSM handlers, quantum-resistant crypto modules
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Node.js crypto, argon2 2.x, AWS KMS SDK 3.x
 * Exports: 40 utility functions for AES-256 encryption, CRYSTALS-KYBER quantum-resistant encryption, DRM policies, key rotation, HSM integration, document rights management
 *
 * LLM Context: Production-grade document encryption utilities for White Cross healthcare platform.
 * Provides military-grade AES-256-GCM encryption, post-quantum cryptography (CRYSTALS-KYBER), comprehensive
 * DRM policy enforcement, automated key rotation, Hardware Security Module (HSM) integration, field-level encryption,
 * document watermarking, access control policies, usage tracking, secure key escrow, HIPAA-compliant encryption at rest
 * and in transit. Exceeds Adobe Acrobat security with quantum-resistant algorithms, multi-layer encryption, and
 * enterprise-grade key management. Essential for protecting PHI, medical records, research data, and sensitive healthcare documents.
 */
import { Sequelize } from 'sequelize';
/**
 * Encryption algorithm types
 */
export type EncryptionAlgorithm = 'AES-256-GCM' | 'AES-256-CBC' | 'CHACHA20-POLY1305' | 'CRYSTALS-KYBER';
/**
 * Key derivation function types
 */
export type KDFAlgorithm = 'PBKDF2' | 'ARGON2ID' | 'SCRYPT' | 'HKDF';
/**
 * DRM permission types
 */
export type DRMPermission = 'read' | 'print' | 'copy' | 'edit' | 'download' | 'share' | 'annotate' | 'extract';
/**
 * Key rotation strategy
 */
export type KeyRotationStrategy = 'time-based' | 'usage-based' | 'manual' | 'automatic';
/**
 * HSM provider types
 */
export type HSMProvider = 'AWS-KMS' | 'AZURE-KEYVAULT' | 'GCP-KMS' | 'THALES' | 'SOFTHSM';
/**
 * Encryption configuration
 */
export interface EncryptionConfig {
    algorithm: EncryptionAlgorithm;
    keySize?: number;
    keyId?: string;
    associatedData?: Buffer;
    compressionEnabled?: boolean;
    metadataEncrypted?: boolean;
}
/**
 * AES-256-GCM encryption result
 */
export interface AESEncryptionResult {
    ciphertext: Buffer;
    iv: Buffer;
    authTag: Buffer;
    algorithm: string;
    keyId: string;
    encryptedAt: Date;
}
/**
 * Quantum-resistant encryption result (CRYSTALS-KYBER)
 */
export interface QuantumEncryptionResult {
    ciphertext: Buffer;
    publicKey: Buffer;
    encapsulatedKey: Buffer;
    algorithm: string;
    securityLevel: number;
    encryptedAt: Date;
}
/**
 * DRM policy configuration
 */
export interface DRMPolicy {
    documentId: string;
    permissions: DRMPermission[];
    expiresAt?: Date;
    maxPrints?: number;
    maxCopies?: number;
    watermark?: WatermarkConfig;
    allowedUsers?: string[];
    allowedDomains?: string[];
    geoRestrictions?: GeoRestriction[];
    deviceBinding?: boolean;
    onlineValidationRequired?: boolean;
}
/**
 * Watermark configuration
 */
export interface WatermarkConfig {
    text: string;
    opacity: number;
    fontSize?: number;
    color?: string;
    position?: 'center' | 'diagonal' | 'header' | 'footer';
    includeUserId?: boolean;
    includeTimestamp?: boolean;
    includeIPAddress?: boolean;
}
/**
 * Geographic restriction
 */
export interface GeoRestriction {
    allowedCountries?: string[];
    blockedCountries?: string[];
    allowedRegions?: string[];
}
/**
 * Key rotation configuration
 */
export interface KeyRotationConfig {
    strategy: KeyRotationStrategy;
    rotationIntervalDays?: number;
    maxUsageCount?: number;
    gracePeriodDays?: number;
    reEncryptOnRotation?: boolean;
    notifyBeforeDays?: number;
}
/**
 * HSM configuration
 */
export interface HSMConfig {
    provider: HSMProvider;
    keyId: string;
    region?: string;
    endpoint?: string;
    credentials?: {
        accessKeyId?: string;
        secretAccessKey?: string;
        tenantId?: string;
        clientId?: string;
    };
    encryptionContext?: Record<string, string>;
}
/**
 * Field-level encryption configuration
 */
export interface FieldEncryptionConfig {
    fields: string[];
    keyId: string;
    deterministicEncryption?: boolean;
    searchableEncryption?: boolean;
    maskingPattern?: string;
}
/**
 * Document access log
 */
export interface DocumentAccessLog {
    documentId: string;
    userId: string;
    action: 'view' | 'print' | 'download' | 'copy' | 'edit';
    timestamp: Date;
    ipAddress?: string;
    deviceId?: string;
    location?: string;
    success: boolean;
    denialReason?: string;
}
/**
 * Key escrow information
 */
export interface KeyEscrowInfo {
    keyId: string;
    escrowedKey: Buffer;
    escrowedAt: Date;
    escrowAgent: string;
    recoveryPolicy: string;
    sharesRequired?: number;
    threshold?: number;
}
/**
 * Encryption strength assessment
 */
export interface EncryptionStrength {
    algorithm: string;
    keySize: number;
    quantumResistant: boolean;
    estimatedSecurityBits: number;
    recommendedRetirementDate?: Date;
    complianceLevel: 'standard' | 'high' | 'military' | 'quantum-safe';
}
/**
 * Document rights metadata
 */
export interface DocumentRights {
    ownerId: string;
    permissions: DRMPermission[];
    issuedAt: Date;
    expiresAt?: Date;
    revocable: boolean;
    transferable: boolean;
    auditRequired: boolean;
    licenseKey?: string;
}
/**
 * Multi-layer encryption configuration
 */
export interface MultiLayerEncryptionConfig {
    layers: Array<{
        algorithm: EncryptionAlgorithm;
        keyId: string;
        order: number;
    }>;
    combineMethod: 'cascade' | 'parallel';
}
/**
 * Key derivation parameters
 */
export interface KeyDerivationParams {
    algorithm: KDFAlgorithm;
    salt: Buffer;
    iterations?: number;
    memoryLimit?: number;
    parallelism?: number;
    keyLength: number;
}
/**
 * Encryption key model attributes
 */
export interface EncryptionKeyAttributes {
    id: string;
    keyId: string;
    algorithm: string;
    keyMaterial: Buffer;
    keySize: number;
    purpose: string;
    isActive: boolean;
    version: number;
    createdBy: string;
    rotatedFrom?: string;
    rotatesAt?: Date;
    expiresAt?: Date;
    usageCount: number;
    maxUsageCount?: number;
    hsmProvider?: string;
    hsmKeyId?: string;
    escrowId?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Encrypted document model attributes
 */
export interface EncryptedDocumentAttributes {
    id: string;
    documentId: string;
    encryptionKeyId: string;
    algorithm: string;
    iv: Buffer;
    authTag?: Buffer;
    encryptedSize: number;
    originalSize: number;
    encryptedAt: Date;
    encryptedBy: string;
    associatedData?: Buffer;
    quantumResistant: boolean;
    securityLevel: string;
    checksumOriginal: string;
    checksumEncrypted: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * DRM policy model attributes
 */
export interface DrmPolicyAttributes {
    id: string;
    documentId: string;
    policyName: string;
    permissions: string[];
    allowedUsers?: string[];
    allowedDomains?: string[];
    expiresAt?: Date;
    maxPrints?: number;
    maxCopies?: number;
    currentPrints: number;
    currentCopies: number;
    watermarkConfig?: Record<string, any>;
    geoRestrictions?: Record<string, any>;
    deviceBinding: boolean;
    onlineValidationRequired: boolean;
    isActive: boolean;
    createdBy: string;
    revokedAt?: Date;
    revokedBy?: string;
    revocationReason?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates EncryptionKey model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<EncryptionKeyAttributes>>} EncryptionKey model
 *
 * @example
 * ```typescript
 * const KeyModel = createEncryptionKeyModel(sequelize);
 * const key = await KeyModel.create({
 *   keyId: 'key-12345',
 *   algorithm: 'AES-256-GCM',
 *   keyMaterial: keyBuffer,
 *   keySize: 256,
 *   purpose: 'document-encryption',
 *   isActive: true,
 *   version: 1,
 *   createdBy: 'user-uuid'
 * });
 * ```
 */
export declare const createEncryptionKeyModel: (sequelize: Sequelize) => any;
/**
 * Creates EncryptedDocument model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<EncryptedDocumentAttributes>>} EncryptedDocument model
 *
 * @example
 * ```typescript
 * const DocModel = createEncryptedDocumentModel(sequelize);
 * const encDoc = await DocModel.create({
 *   documentId: 'doc-uuid',
 *   encryptionKeyId: 'key-12345',
 *   algorithm: 'AES-256-GCM',
 *   iv: ivBuffer,
 *   authTag: authTagBuffer,
 *   encryptedSize: 1048576,
 *   originalSize: 524288,
 *   encryptedAt: new Date(),
 *   encryptedBy: 'user-uuid'
 * });
 * ```
 */
export declare const createEncryptedDocumentModel: (sequelize: Sequelize) => any;
/**
 * Creates DrmPolicy model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DrmPolicyAttributes>>} DrmPolicy model
 *
 * @example
 * ```typescript
 * const PolicyModel = createDrmPolicyModel(sequelize);
 * const policy = await PolicyModel.create({
 *   documentId: 'doc-uuid',
 *   policyName: 'confidential-medical-record',
 *   permissions: ['read', 'print'],
 *   maxPrints: 5,
 *   deviceBinding: true,
 *   onlineValidationRequired: true,
 *   createdBy: 'user-uuid'
 * });
 * ```
 */
export declare const createDrmPolicyModel: (sequelize: Sequelize) => any;
/**
 * 1. Encrypts document using AES-256-GCM.
 *
 * @param {Buffer} documentBuffer - Document data to encrypt
 * @param {string} keyId - Encryption key identifier
 * @param {Buffer} [associatedData] - Additional authenticated data
 * @returns {Promise<AESEncryptionResult>} Encryption result with ciphertext, IV, and auth tag
 *
 * @example
 * ```typescript
 * const encrypted = await encryptDocumentAES256(documentBuffer, 'key-12345');
 * // Store encrypted.ciphertext, encrypted.iv, and encrypted.authTag
 * ```
 */
export declare const encryptDocumentAES256: (documentBuffer: Buffer, keyId: string, associatedData?: Buffer) => Promise<AESEncryptionResult>;
/**
 * 2. Decrypts document using AES-256-GCM.
 *
 * @param {AESEncryptionResult} encryptedData - Encrypted data with metadata
 * @param {string} keyId - Encryption key identifier
 * @returns {Promise<Buffer>} Decrypted document buffer
 *
 * @example
 * ```typescript
 * const decrypted = await decryptDocumentAES256(encryptedData, 'key-12345');
 * ```
 */
export declare const decryptDocumentAES256: (encryptedData: AESEncryptionResult, keyId: string) => Promise<Buffer>;
/**
 * 3. Encrypts specific fields with deterministic encryption.
 *
 * @param {Record<string, any>} data - Object with fields to encrypt
 * @param {FieldEncryptionConfig} config - Field encryption configuration
 * @returns {Promise<Record<string, any>>} Data with encrypted fields
 *
 * @example
 * ```typescript
 * const encrypted = await encryptFieldsDeterministic({
 *   ssn: '123-45-6789',
 *   name: 'John Doe',
 *   dob: '1990-01-01'
 * }, {
 *   fields: ['ssn', 'dob'],
 *   keyId: 'field-key-123',
 *   deterministicEncryption: true
 * });
 * ```
 */
export declare const encryptFieldsDeterministic: (data: Record<string, any>, config: FieldEncryptionConfig) => Promise<Record<string, any>>;
/**
 * 4. Generates master encryption key with secure parameters.
 *
 * @param {number} [keySize] - Key size in bits (default: 256)
 * @param {string} [purpose] - Key purpose identifier
 * @returns {Promise<{ keyId: string; keyMaterial: Buffer; createdAt: Date }>} Generated key
 *
 * @example
 * ```typescript
 * const key = await generateMasterEncryptionKey(256, 'document-encryption');
 * ```
 */
export declare const generateMasterEncryptionKey: (keySize?: number, purpose?: string) => Promise<{
    keyId: string;
    keyMaterial: Buffer;
    createdAt: Date;
}>;
/**
 * 5. Encrypts large files with streaming AES-256.
 *
 * @param {NodeJS.ReadableStream} inputStream - Input file stream
 * @param {NodeJS.WritableStream} outputStream - Output encrypted stream
 * @param {string} keyId - Encryption key identifier
 * @returns {Promise<{ bytesProcessed: number; iv: Buffer; authTag: Buffer }>} Encryption result
 *
 * @example
 * ```typescript
 * const result = await encryptStreamAES256(
 *   fs.createReadStream('large-document.pdf'),
 *   fs.createWriteStream('large-document.pdf.enc'),
 *   'key-12345'
 * );
 * ```
 */
export declare const encryptStreamAES256: (inputStream: NodeJS.ReadableStream, outputStream: NodeJS.WritableStream, keyId: string) => Promise<{
    bytesProcessed: number;
    iv: Buffer;
    authTag: Buffer;
}>;
/**
 * 6. Derives encryption key from password using ARGON2.
 *
 * @param {string} password - Password to derive key from
 * @param {Buffer} [salt] - Salt (generated if not provided)
 * @param {number} [keyLength] - Desired key length in bytes
 * @returns {Promise<{ key: Buffer; salt: Buffer; params: KeyDerivationParams }>} Derived key
 *
 * @example
 * ```typescript
 * const { key, salt } = await deriveKeyFromPassword('secure-password', undefined, 32);
 * ```
 */
export declare const deriveKeyFromPassword: (password: string, salt?: Buffer, keyLength?: number) => Promise<{
    key: Buffer;
    salt: Buffer;
    params: KeyDerivationParams;
}>;
/**
 * 7. Encrypts document with compression enabled.
 *
 * @param {Buffer} documentBuffer - Document to encrypt
 * @param {string} keyId - Encryption key identifier
 * @returns {Promise<AESEncryptionResult & { compressionRatio: number }>} Encryption result
 *
 * @example
 * ```typescript
 * const result = await encryptWithCompression(documentBuffer, 'key-12345');
 * console.log('Compression ratio:', result.compressionRatio);
 * ```
 */
export declare const encryptWithCompression: (documentBuffer: Buffer, keyId: string) => Promise<AESEncryptionResult & {
    compressionRatio: number;
}>;
/**
 * 8. Validates encryption strength and compliance.
 *
 * @param {EncryptionConfig} config - Encryption configuration
 * @returns {Promise<EncryptionStrength>} Strength assessment
 *
 * @example
 * ```typescript
 * const strength = await validateEncryptionStrength({
 *   algorithm: 'AES-256-GCM',
 *   keySize: 256
 * });
 * console.log('Compliance level:', strength.complianceLevel);
 * ```
 */
export declare const validateEncryptionStrength: (config: EncryptionConfig) => Promise<EncryptionStrength>;
/**
 * 9. Generates CRYSTALS-KYBER keypair for quantum-resistant encryption.
 *
 * @param {number} [securityLevel] - Security level (2, 3, or 5)
 * @returns {Promise<{ publicKey: Buffer; privateKey: Buffer; securityLevel: number }>} Keypair
 *
 * @example
 * ```typescript
 * const { publicKey, privateKey } = await generateKyberKeypair(3);
 * ```
 */
export declare const generateKyberKeypair: (securityLevel?: number) => Promise<{
    publicKey: Buffer;
    privateKey: Buffer;
    securityLevel: number;
}>;
/**
 * 10. Encrypts document using CRYSTALS-KYBER post-quantum algorithm.
 *
 * @param {Buffer} documentBuffer - Document to encrypt
 * @param {Buffer} publicKey - CRYSTALS-KYBER public key
 * @returns {Promise<QuantumEncryptionResult>} Quantum-resistant encryption result
 *
 * @example
 * ```typescript
 * const encrypted = await encryptQuantumResistant(documentBuffer, kyberPublicKey);
 * ```
 */
export declare const encryptQuantumResistant: (documentBuffer: Buffer, publicKey: Buffer) => Promise<QuantumEncryptionResult>;
/**
 * 11. Decrypts document using CRYSTALS-KYBER private key.
 *
 * @param {QuantumEncryptionResult} encryptedData - Quantum-encrypted data
 * @param {Buffer} privateKey - CRYSTALS-KYBER private key
 * @returns {Promise<Buffer>} Decrypted document
 *
 * @example
 * ```typescript
 * const decrypted = await decryptQuantumResistant(encryptedData, kyberPrivateKey);
 * ```
 */
export declare const decryptQuantumResistant: (encryptedData: QuantumEncryptionResult, privateKey: Buffer) => Promise<Buffer>;
/**
 * 12. Creates hybrid encryption (classical + quantum-resistant).
 *
 * @param {Buffer} documentBuffer - Document to encrypt
 * @param {string} aesKeyId - AES key identifier
 * @param {Buffer} kyberPublicKey - CRYSTALS-KYBER public key
 * @returns {Promise<{ aes: AESEncryptionResult; quantum: QuantumEncryptionResult }>} Hybrid result
 *
 * @example
 * ```typescript
 * const hybrid = await createHybridEncryption(documentBuffer, 'aes-key-123', kyberPublicKey);
 * ```
 */
export declare const createHybridEncryption: (documentBuffer: Buffer, aesKeyId: string, kyberPublicKey: Buffer) => Promise<{
    aes: AESEncryptionResult;
    quantum: QuantumEncryptionResult;
}>;
/**
 * 13. Validates quantum-resistance of encryption algorithm.
 *
 * @param {string} algorithm - Algorithm to validate
 * @returns {{ quantumSafe: boolean; recommendedUpgrade?: string; estimatedBreakYear?: number }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateQuantumResistance('AES-256-GCM');
 * if (!validation.quantumSafe) {
 *   console.log('Upgrade to:', validation.recommendedUpgrade);
 * }
 * ```
 */
export declare const validateQuantumResistance: (algorithm: string) => {
    quantumSafe: boolean;
    recommendedUpgrade?: string;
    estimatedBreakYear?: number;
};
/**
 * 14. Migrates classical encryption to quantum-resistant.
 *
 * @param {AESEncryptionResult} classicalEncryption - Classical encryption data
 * @param {Buffer} kyberPublicKey - Target CRYSTALS-KYBER public key
 * @param {string} originalKeyId - Original AES key ID
 * @returns {Promise<QuantumEncryptionResult>} Migrated quantum-resistant encryption
 *
 * @example
 * ```typescript
 * const migrated = await migrateToQuantumResistant(aesEncryption, kyberKey, 'old-key-123');
 * ```
 */
export declare const migrateToQuantumResistant: (classicalEncryption: AESEncryptionResult, kyberPublicKey: Buffer, originalKeyId: string) => Promise<QuantumEncryptionResult>;
/**
 * 15. Generates quantum-safe key encapsulation.
 *
 * @param {Buffer} publicKey - CRYSTALS-KYBER public key
 * @returns {Promise<{ sharedSecret: Buffer; ciphertext: Buffer }>} Encapsulation result
 *
 * @example
 * ```typescript
 * const { sharedSecret, ciphertext } = await generateKeyEncapsulation(kyberPublicKey);
 * // Use sharedSecret for symmetric encryption
 * ```
 */
export declare const generateKeyEncapsulation: (publicKey: Buffer) => Promise<{
    sharedSecret: Buffer;
    ciphertext: Buffer;
}>;
/**
 * 16. Creates DRM policy for document.
 *
 * @param {DRMPolicy} policy - DRM policy configuration
 * @returns {Promise<{ policyId: string; policy: DRMPolicy; createdAt: Date }>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createDRMPolicy({
 *   documentId: 'doc-123',
 *   permissions: ['read', 'print'],
 *   maxPrints: 5,
 *   expiresAt: new Date('2025-12-31'),
 *   watermark: {
 *     text: 'CONFIDENTIAL',
 *     opacity: 0.3,
 *     includeUserId: true
 *   }
 * });
 * ```
 */
export declare const createDRMPolicy: (policy: DRMPolicy) => Promise<{
    policyId: string;
    policy: DRMPolicy;
    createdAt: Date;
}>;
/**
 * 17. Validates DRM permission for user action.
 *
 * @param {DRMPolicy} policy - DRM policy to check
 * @param {DRMPermission} permission - Permission to validate
 * @param {string} userId - User requesting permission
 * @returns {Promise<{ allowed: boolean; reason?: string; remainingUsage?: number }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateDRMPermission(policy, 'print', 'user-123');
 * if (!result.allowed) {
 *   console.log('Denied:', result.reason);
 * }
 * ```
 */
export declare const validateDRMPermission: (policy: DRMPolicy, permission: DRMPermission, userId: string) => Promise<{
    allowed: boolean;
    reason?: string;
    remainingUsage?: number;
}>;
/**
 * 18. Applies watermark to document based on DRM policy.
 *
 * @param {Buffer} documentBuffer - Document to watermark
 * @param {WatermarkConfig} watermark - Watermark configuration
 * @param {string} userId - User ID for personalization
 * @returns {Promise<Buffer>} Watermarked document
 *
 * @example
 * ```typescript
 * const watermarked = await applyDRMWatermark(pdfBuffer, {
 *   text: 'CONFIDENTIAL',
 *   opacity: 0.3,
 *   includeUserId: true,
 *   includeTimestamp: true
 * }, 'user-123');
 * ```
 */
export declare const applyDRMWatermark: (documentBuffer: Buffer, watermark: WatermarkConfig, userId: string) => Promise<Buffer>;
/**
 * 19. Validates geographic restrictions.
 *
 * @param {GeoRestriction} restrictions - Geographic restrictions
 * @param {string} userCountry - User's country code
 * @param {string} [userRegion] - User's region
 * @returns {{ allowed: boolean; reason?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateGeoRestrictions({
 *   allowedCountries: ['US', 'CA', 'GB'],
 *   blockedCountries: ['KP']
 * }, 'US');
 * ```
 */
export declare const validateGeoRestrictions: (restrictions: GeoRestriction, userCountry: string, userRegion?: string) => {
    allowed: boolean;
    reason?: string;
};
/**
 * 20. Tracks document access for DRM compliance.
 *
 * @param {DocumentAccessLog} accessLog - Access log data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackDocumentAccess({
 *   documentId: 'doc-123',
 *   userId: 'user-456',
 *   action: 'print',
 *   timestamp: new Date(),
 *   success: true,
 *   ipAddress: '192.168.1.1'
 * });
 * ```
 */
export declare const trackDocumentAccess: (accessLog: DocumentAccessLog) => Promise<void>;
/**
 * 21. Revokes DRM policy for document.
 *
 * @param {string} policyId - Policy identifier to revoke
 * @param {string} revokedBy - User revoking the policy
 * @param {string} reason - Revocation reason
 * @returns {Promise<{ revoked: boolean; revokedAt: Date }>} Revocation result
 *
 * @example
 * ```typescript
 * const result = await revokeDRMPolicy('policy-123', 'admin-456', 'Security breach');
 * ```
 */
export declare const revokeDRMPolicy: (policyId: string, revokedBy: string, reason: string) => Promise<{
    revoked: boolean;
    revokedAt: Date;
}>;
/**
 * 22. Validates device binding for DRM.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @param {string} userId - User identifier
 * @returns {Promise<{ authorized: boolean; reason?: string }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateDeviceBinding('doc-123', 'device-abc', 'user-456');
 * ```
 */
export declare const validateDeviceBinding: (documentId: string, deviceId: string, userId: string) => Promise<{
    authorized: boolean;
    reason?: string;
}>;
/**
 * 23. Generates DRM license key for document.
 *
 * @param {string} documentId - Document identifier
 * @param {string} userId - User identifier
 * @param {DRMPermission[]} permissions - Granted permissions
 * @param {Date} [expiresAt] - License expiration
 * @returns {Promise<{ licenseKey: string; expiresAt?: Date; permissions: DRMPermission[] }>} License
 *
 * @example
 * ```typescript
 * const license = await generateDRMLicense('doc-123', 'user-456', ['read', 'print']);
 * ```
 */
export declare const generateDRMLicense: (documentId: string, userId: string, permissions: DRMPermission[], expiresAt?: Date) => Promise<{
    licenseKey: string;
    expiresAt?: Date;
    permissions: DRMPermission[];
}>;
/**
 * 24. Creates key rotation schedule.
 *
 * @param {KeyRotationConfig} config - Rotation configuration
 * @param {string} keyId - Key identifier
 * @returns {Promise<{ scheduleId: string; nextRotation: Date; config: KeyRotationConfig }>} Schedule
 *
 * @example
 * ```typescript
 * const schedule = await createKeyRotationSchedule({
 *   strategy: 'time-based',
 *   rotationIntervalDays: 90,
 *   reEncryptOnRotation: true,
 *   notifyBeforeDays: 7
 * }, 'key-123');
 * ```
 */
export declare const createKeyRotationSchedule: (config: KeyRotationConfig, keyId: string) => Promise<{
    scheduleId: string;
    nextRotation: Date;
    config: KeyRotationConfig;
}>;
/**
 * 25. Rotates encryption key and re-encrypts data.
 *
 * @param {string} oldKeyId - Current key identifier
 * @param {boolean} [reEncryptData] - Whether to re-encrypt existing data
 * @returns {Promise<{ newKeyId: string; oldKeyId: string; rotatedAt: Date; reEncrypted: number }>} Rotation result
 *
 * @example
 * ```typescript
 * const result = await rotateEncryptionKey('old-key-123', true);
 * console.log('Re-encrypted', result.reEncrypted, 'documents');
 * ```
 */
export declare const rotateEncryptionKey: (oldKeyId: string, reEncryptData?: boolean) => Promise<{
    newKeyId: string;
    oldKeyId: string;
    rotatedAt: Date;
    reEncrypted: number;
}>;
/**
 * 26. Validates key rotation eligibility.
 *
 * @param {string} keyId - Key identifier
 * @param {KeyRotationConfig} config - Rotation configuration
 * @returns {Promise<{ eligible: boolean; reason?: string; nextRotation?: Date }>} Eligibility result
 *
 * @example
 * ```typescript
 * const eligible = await validateKeyRotationEligibility('key-123', rotationConfig);
 * ```
 */
export declare const validateKeyRotationEligibility: (keyId: string, config: KeyRotationConfig) => Promise<{
    eligible: boolean;
    reason?: string;
    nextRotation?: Date;
}>;
/**
 * 27. Archives old encryption keys securely.
 *
 * @param {string} keyId - Key identifier to archive
 * @param {string} reason - Archive reason
 * @returns {Promise<{ archived: boolean; archivedAt: Date; retentionPeriodDays: number }>} Archive result
 *
 * @example
 * ```typescript
 * const result = await archiveEncryptionKey('old-key-123', 'Rotated to new key');
 * ```
 */
export declare const archiveEncryptionKey: (keyId: string, reason: string) => Promise<{
    archived: boolean;
    archivedAt: Date;
    retentionPeriodDays: number;
}>;
/**
 * 28. Tracks key usage metrics for rotation decisions.
 *
 * @param {string} keyId - Key identifier
 * @returns {Promise<{ usageCount: number; lastUsed: Date; documentsEncrypted: number }>} Usage metrics
 *
 * @example
 * ```typescript
 * const metrics = await trackKeyUsageMetrics('key-123');
 * console.log('Key used', metrics.usageCount, 'times');
 * ```
 */
export declare const trackKeyUsageMetrics: (keyId: string) => Promise<{
    usageCount: number;
    lastUsed: Date;
    documentsEncrypted: number;
}>;
/**
 * 29. Sends key rotation notifications to administrators.
 *
 * @param {string} keyId - Key identifier
 * @param {Date} scheduledRotation - Scheduled rotation date
 * @param {string[]} recipients - Notification recipients
 * @returns {Promise<{ sent: boolean; recipients: string[]; sentAt: Date }>} Notification result
 *
 * @example
 * ```typescript
 * await notifyKeyRotation('key-123', new Date('2025-12-31'), ['admin@example.com']);
 * ```
 */
export declare const notifyKeyRotation: (keyId: string, scheduledRotation: Date, recipients: string[]) => Promise<{
    sent: boolean;
    recipients: string[];
    sentAt: Date;
}>;
/**
 * 30. Initializes connection to HSM provider.
 *
 * @param {HSMConfig} config - HSM configuration
 * @returns {Promise<{ connected: boolean; provider: HSMProvider; keyId: string }>} Connection result
 *
 * @example
 * ```typescript
 * const connection = await initializeHSMConnection({
 *   provider: 'AWS-KMS',
 *   keyId: 'arn:aws:kms:us-east-1:123456789012:key/abcd-1234',
 *   region: 'us-east-1'
 * });
 * ```
 */
export declare const initializeHSMConnection: (config: HSMConfig) => Promise<{
    connected: boolean;
    provider: HSMProvider;
    keyId: string;
}>;
/**
 * 31. Encrypts document using HSM-managed keys.
 *
 * @param {Buffer} documentBuffer - Document to encrypt
 * @param {HSMConfig} hsmConfig - HSM configuration
 * @returns {Promise<{ ciphertext: Buffer; keyId: string; encryptedAt: Date }>} HSM encryption result
 *
 * @example
 * ```typescript
 * const encrypted = await encryptWithHSM(documentBuffer, {
 *   provider: 'AWS-KMS',
 *   keyId: 'arn:aws:kms:us-east-1:123456789012:key/abcd-1234',
 *   encryptionContext: { department: 'medical-records' }
 * });
 * ```
 */
export declare const encryptWithHSM: (documentBuffer: Buffer, hsmConfig: HSMConfig) => Promise<{
    ciphertext: Buffer;
    keyId: string;
    encryptedAt: Date;
}>;
/**
 * 32. Decrypts document using HSM-managed keys.
 *
 * @param {Buffer} ciphertext - Encrypted document
 * @param {HSMConfig} hsmConfig - HSM configuration
 * @returns {Promise<Buffer>} Decrypted document
 *
 * @example
 * ```typescript
 * const decrypted = await decryptWithHSM(encryptedBuffer, hsmConfig);
 * ```
 */
export declare const decryptWithHSM: (ciphertext: Buffer, hsmConfig: HSMConfig) => Promise<Buffer>;
/**
 * 33. Generates data encryption key (DEK) using HSM.
 *
 * @param {HSMConfig} hsmConfig - HSM configuration
 * @param {number} [keySize] - Key size in bits
 * @returns {Promise<{ plaintext: Buffer; ciphertext: Buffer; keyId: string }>} DEK result
 *
 * @example
 * ```typescript
 * const { plaintext, ciphertext } = await generateDataKeyHSM(hsmConfig, 256);
 * // Use plaintext for encryption, store ciphertext
 * ```
 */
export declare const generateDataKeyHSM: (hsmConfig: HSMConfig, keySize?: number) => Promise<{
    plaintext: Buffer;
    ciphertext: Buffer;
    keyId: string;
}>;
/**
 * 34. Validates HSM key accessibility and permissions.
 *
 * @param {HSMConfig} hsmConfig - HSM configuration
 * @returns {Promise<{ accessible: boolean; permissions: string[]; errors?: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateHSMKeyAccess(hsmConfig);
 * if (!validation.accessible) {
 *   console.error('HSM errors:', validation.errors);
 * }
 * ```
 */
export declare const validateHSMKeyAccess: (hsmConfig: HSMConfig) => Promise<{
    accessible: boolean;
    permissions: string[];
    errors?: string[];
}>;
/**
 * 35. Audits HSM key usage and operations.
 *
 * @param {string} keyId - HSM key identifier
 * @param {Date} startDate - Audit start date
 * @param {Date} endDate - Audit end date
 * @returns {Promise<{ operations: number; users: string[]; actions: Record<string, number> }>} Audit result
 *
 * @example
 * ```typescript
 * const audit = await auditHSMKeyUsage('arn:aws:kms:...', new Date('2025-01-01'), new Date());
 * console.log('Total operations:', audit.operations);
 * ```
 */
export declare const auditHSMKeyUsage: (keyId: string, startDate: Date, endDate: Date) => Promise<{
    operations: number;
    users: string[];
    actions: Record<string, number>;
}>;
/**
 * 36. Issues document access rights to user.
 *
 * @param {string} documentId - Document identifier
 * @param {string} userId - User identifier
 * @param {DocumentRights} rights - Rights configuration
 * @returns {Promise<{ rightId: string; licenseKey: string; issuedAt: Date }>} Issued rights
 *
 * @example
 * ```typescript
 * const rights = await issueDocumentRights('doc-123', 'user-456', {
 *   ownerId: 'owner-789',
 *   permissions: ['read', 'print'],
 *   issuedAt: new Date(),
 *   expiresAt: new Date('2025-12-31'),
 *   revocable: true,
 *   transferable: false,
 *   auditRequired: true
 * });
 * ```
 */
export declare const issueDocumentRights: (documentId: string, userId: string, rights: DocumentRights) => Promise<{
    rightId: string;
    licenseKey: string;
    issuedAt: Date;
}>;
/**
 * 37. Transfers document rights to another user.
 *
 * @param {string} rightId - Right identifier
 * @param {string} fromUserId - Current rights holder
 * @param {string} toUserId - New rights holder
 * @returns {Promise<{ transferred: boolean; newRightId: string; transferredAt: Date }>} Transfer result
 *
 * @example
 * ```typescript
 * const result = await transferDocumentRights('right-123', 'user-456', 'user-789');
 * ```
 */
export declare const transferDocumentRights: (rightId: string, fromUserId: string, toUserId: string) => Promise<{
    transferred: boolean;
    newRightId: string;
    transferredAt: Date;
}>;
/**
 * 38. Revokes document access rights.
 *
 * @param {string} rightId - Right identifier
 * @param {string} revokedBy - User revoking rights
 * @param {string} reason - Revocation reason
 * @returns {Promise<{ revoked: boolean; revokedAt: Date; notified: boolean }>} Revocation result
 *
 * @example
 * ```typescript
 * await revokeDocumentRights('right-123', 'admin-456', 'Employment terminated');
 * ```
 */
export declare const revokeDocumentRights: (rightId: string, revokedBy: string, reason: string) => Promise<{
    revoked: boolean;
    revokedAt: Date;
    notified: boolean;
}>;
/**
 * 39. Generates compliance report for document access.
 *
 * @param {string} documentId - Document identifier
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<{ totalAccesses: number; uniqueUsers: number; violations: number; report: string }>} Report
 *
 * @example
 * ```typescript
 * const report = await generateAccessComplianceReport('doc-123',
 *   new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare const generateAccessComplianceReport: (documentId: string, startDate: Date, endDate: Date) => Promise<{
    totalAccesses: number;
    uniqueUsers: number;
    violations: number;
    report: string;
}>;
/**
 * 40. Creates secure key escrow for emergency recovery.
 *
 * @param {string} keyId - Key identifier
 * @param {Buffer} keyMaterial - Key material to escrow
 * @param {string[]} escrowAgents - Escrow agent identifiers
 * @param {number} threshold - Minimum agents required for recovery
 * @returns {Promise<KeyEscrowInfo>} Escrow information
 *
 * @example
 * ```typescript
 * const escrow = await createKeyEscrow('key-123', keyBuffer,
 *   ['agent-1', 'agent-2', 'agent-3'], 2);
 * // Requires 2 out of 3 agents for key recovery
 * ```
 */
export declare const createKeyEscrow: (keyId: string, keyMaterial: Buffer, escrowAgents: string[], threshold: number) => Promise<KeyEscrowInfo>;
declare const _default: {
    createEncryptionKeyModel: (sequelize: Sequelize) => any;
    createEncryptedDocumentModel: (sequelize: Sequelize) => any;
    createDrmPolicyModel: (sequelize: Sequelize) => any;
    encryptDocumentAES256: (documentBuffer: Buffer, keyId: string, associatedData?: Buffer) => Promise<AESEncryptionResult>;
    decryptDocumentAES256: (encryptedData: AESEncryptionResult, keyId: string) => Promise<Buffer>;
    encryptFieldsDeterministic: (data: Record<string, any>, config: FieldEncryptionConfig) => Promise<Record<string, any>>;
    generateMasterEncryptionKey: (keySize?: number, purpose?: string) => Promise<{
        keyId: string;
        keyMaterial: Buffer;
        createdAt: Date;
    }>;
    encryptStreamAES256: (inputStream: NodeJS.ReadableStream, outputStream: NodeJS.WritableStream, keyId: string) => Promise<{
        bytesProcessed: number;
        iv: Buffer;
        authTag: Buffer;
    }>;
    deriveKeyFromPassword: (password: string, salt?: Buffer, keyLength?: number) => Promise<{
        key: Buffer;
        salt: Buffer;
        params: KeyDerivationParams;
    }>;
    encryptWithCompression: (documentBuffer: Buffer, keyId: string) => Promise<AESEncryptionResult & {
        compressionRatio: number;
    }>;
    validateEncryptionStrength: (config: EncryptionConfig) => Promise<EncryptionStrength>;
    generateKyberKeypair: (securityLevel?: number) => Promise<{
        publicKey: Buffer;
        privateKey: Buffer;
        securityLevel: number;
    }>;
    encryptQuantumResistant: (documentBuffer: Buffer, publicKey: Buffer) => Promise<QuantumEncryptionResult>;
    decryptQuantumResistant: (encryptedData: QuantumEncryptionResult, privateKey: Buffer) => Promise<Buffer>;
    createHybridEncryption: (documentBuffer: Buffer, aesKeyId: string, kyberPublicKey: Buffer) => Promise<{
        aes: AESEncryptionResult;
        quantum: QuantumEncryptionResult;
    }>;
    validateQuantumResistance: (algorithm: string) => {
        quantumSafe: boolean;
        recommendedUpgrade?: string;
        estimatedBreakYear?: number;
    };
    migrateToQuantumResistant: (classicalEncryption: AESEncryptionResult, kyberPublicKey: Buffer, originalKeyId: string) => Promise<QuantumEncryptionResult>;
    generateKeyEncapsulation: (publicKey: Buffer) => Promise<{
        sharedSecret: Buffer;
        ciphertext: Buffer;
    }>;
    createDRMPolicy: (policy: DRMPolicy) => Promise<{
        policyId: string;
        policy: DRMPolicy;
        createdAt: Date;
    }>;
    validateDRMPermission: (policy: DRMPolicy, permission: DRMPermission, userId: string) => Promise<{
        allowed: boolean;
        reason?: string;
        remainingUsage?: number;
    }>;
    applyDRMWatermark: (documentBuffer: Buffer, watermark: WatermarkConfig, userId: string) => Promise<Buffer>;
    validateGeoRestrictions: (restrictions: GeoRestriction, userCountry: string, userRegion?: string) => {
        allowed: boolean;
        reason?: string;
    };
    trackDocumentAccess: (accessLog: DocumentAccessLog) => Promise<void>;
    revokeDRMPolicy: (policyId: string, revokedBy: string, reason: string) => Promise<{
        revoked: boolean;
        revokedAt: Date;
    }>;
    validateDeviceBinding: (documentId: string, deviceId: string, userId: string) => Promise<{
        authorized: boolean;
        reason?: string;
    }>;
    generateDRMLicense: (documentId: string, userId: string, permissions: DRMPermission[], expiresAt?: Date) => Promise<{
        licenseKey: string;
        expiresAt?: Date;
        permissions: DRMPermission[];
    }>;
    createKeyRotationSchedule: (config: KeyRotationConfig, keyId: string) => Promise<{
        scheduleId: string;
        nextRotation: Date;
        config: KeyRotationConfig;
    }>;
    rotateEncryptionKey: (oldKeyId: string, reEncryptData?: boolean) => Promise<{
        newKeyId: string;
        oldKeyId: string;
        rotatedAt: Date;
        reEncrypted: number;
    }>;
    validateKeyRotationEligibility: (keyId: string, config: KeyRotationConfig) => Promise<{
        eligible: boolean;
        reason?: string;
        nextRotation?: Date;
    }>;
    archiveEncryptionKey: (keyId: string, reason: string) => Promise<{
        archived: boolean;
        archivedAt: Date;
        retentionPeriodDays: number;
    }>;
    trackKeyUsageMetrics: (keyId: string) => Promise<{
        usageCount: number;
        lastUsed: Date;
        documentsEncrypted: number;
    }>;
    notifyKeyRotation: (keyId: string, scheduledRotation: Date, recipients: string[]) => Promise<{
        sent: boolean;
        recipients: string[];
        sentAt: Date;
    }>;
    initializeHSMConnection: (config: HSMConfig) => Promise<{
        connected: boolean;
        provider: HSMProvider;
        keyId: string;
    }>;
    encryptWithHSM: (documentBuffer: Buffer, hsmConfig: HSMConfig) => Promise<{
        ciphertext: Buffer;
        keyId: string;
        encryptedAt: Date;
    }>;
    decryptWithHSM: (ciphertext: Buffer, hsmConfig: HSMConfig) => Promise<Buffer>;
    generateDataKeyHSM: (hsmConfig: HSMConfig, keySize?: number) => Promise<{
        plaintext: Buffer;
        ciphertext: Buffer;
        keyId: string;
    }>;
    validateHSMKeyAccess: (hsmConfig: HSMConfig) => Promise<{
        accessible: boolean;
        permissions: string[];
        errors?: string[];
    }>;
    auditHSMKeyUsage: (keyId: string, startDate: Date, endDate: Date) => Promise<{
        operations: number;
        users: string[];
        actions: Record<string, number>;
    }>;
    issueDocumentRights: (documentId: string, userId: string, rights: DocumentRights) => Promise<{
        rightId: string;
        licenseKey: string;
        issuedAt: Date;
    }>;
    transferDocumentRights: (rightId: string, fromUserId: string, toUserId: string) => Promise<{
        transferred: boolean;
        newRightId: string;
        transferredAt: Date;
    }>;
    revokeDocumentRights: (rightId: string, revokedBy: string, reason: string) => Promise<{
        revoked: boolean;
        revokedAt: Date;
        notified: boolean;
    }>;
    generateAccessComplianceReport: (documentId: string, startDate: Date, endDate: Date) => Promise<{
        totalAccesses: number;
        uniqueUsers: number;
        violations: number;
        report: string;
    }>;
    createKeyEscrow: (keyId: string, keyMaterial: Buffer, escrowAgents: string[], threshold: number) => Promise<KeyEscrowInfo>;
};
export default _default;
//# sourceMappingURL=document-advanced-encryption-kit.d.ts.map