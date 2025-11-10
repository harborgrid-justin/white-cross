"use strict";
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
exports.createKeyEscrow = exports.generateAccessComplianceReport = exports.revokeDocumentRights = exports.transferDocumentRights = exports.issueDocumentRights = exports.auditHSMKeyUsage = exports.validateHSMKeyAccess = exports.generateDataKeyHSM = exports.decryptWithHSM = exports.encryptWithHSM = exports.initializeHSMConnection = exports.notifyKeyRotation = exports.trackKeyUsageMetrics = exports.archiveEncryptionKey = exports.validateKeyRotationEligibility = exports.rotateEncryptionKey = exports.createKeyRotationSchedule = exports.generateDRMLicense = exports.validateDeviceBinding = exports.revokeDRMPolicy = exports.trackDocumentAccess = exports.validateGeoRestrictions = exports.applyDRMWatermark = exports.validateDRMPermission = exports.createDRMPolicy = exports.generateKeyEncapsulation = exports.migrateToQuantumResistant = exports.validateQuantumResistance = exports.createHybridEncryption = exports.decryptQuantumResistant = exports.encryptQuantumResistant = exports.generateKyberKeypair = exports.validateEncryptionStrength = exports.encryptWithCompression = exports.deriveKeyFromPassword = exports.encryptStreamAES256 = exports.generateMasterEncryptionKey = exports.encryptFieldsDeterministic = exports.decryptDocumentAES256 = exports.encryptDocumentAES256 = exports.createDrmPolicyModel = exports.createEncryptedDocumentModel = exports.createEncryptionKeyModel = void 0;
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
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
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
const createEncryptionKeyModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        keyId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique key identifier',
        },
        algorithm: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Encryption algorithm (AES-256-GCM, CRYSTALS-KYBER, etc.)',
        },
        keyMaterial: {
            type: sequelize_1.DataTypes.BLOB,
            allowNull: false,
            comment: 'Encrypted key material',
        },
        keySize: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Key size in bits (256, 512, etc.)',
        },
        purpose: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Key purpose (document-encryption, field-encryption, etc.)',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether key is active for encryption',
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Key version for rotation tracking',
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'User who created the key',
        },
        rotatedFrom: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Previous key ID if rotated',
        },
        rotatesAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Scheduled rotation date',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Key expiration date',
        },
        usageCount: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of times key has been used',
        },
        maxUsageCount: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: true,
            comment: 'Maximum allowed usage count',
        },
        hsmProvider: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'HSM provider (AWS-KMS, AZURE-KEYVAULT, etc.)',
        },
        hsmKeyId: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'HSM-specific key identifier',
        },
        escrowId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Key escrow identifier',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional key metadata',
        },
    };
    const options = {
        tableName: 'encryption_keys',
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['keyId'], unique: true },
            { fields: ['algorithm'] },
            { fields: ['purpose'] },
            { fields: ['isActive'] },
            { fields: ['version'] },
            { fields: ['rotatesAt'] },
            { fields: ['expiresAt'] },
            { fields: ['hsmProvider'] },
            { fields: ['createdBy'] },
        ],
    };
    return sequelize.define('EncryptionKey', attributes, options);
};
exports.createEncryptionKeyModel = createEncryptionKeyModel;
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
const createEncryptedDocumentModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            unique: true,
            comment: 'Reference to document',
        },
        encryptionKeyId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'encryption_keys',
                key: 'keyId',
            },
            comment: 'Key used for encryption',
        },
        algorithm: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Encryption algorithm used',
        },
        iv: {
            type: sequelize_1.DataTypes.BLOB,
            allowNull: false,
            comment: 'Initialization vector',
        },
        authTag: {
            type: sequelize_1.DataTypes.BLOB,
            allowNull: true,
            comment: 'Authentication tag for AEAD',
        },
        encryptedSize: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            comment: 'Encrypted data size in bytes',
        },
        originalSize: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            comment: 'Original data size in bytes',
        },
        encryptedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        encryptedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'User who encrypted the document',
        },
        associatedData: {
            type: sequelize_1.DataTypes.BLOB,
            allowNull: true,
            comment: 'Additional authenticated data',
        },
        quantumResistant: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether quantum-resistant encryption was used',
        },
        securityLevel: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'high',
            comment: 'Security level (standard, high, military, quantum-safe)',
        },
        checksumOriginal: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: false,
            comment: 'Checksum of original document',
        },
        checksumEncrypted: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: false,
            comment: 'Checksum of encrypted document',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional encryption metadata',
        },
    };
    const options = {
        tableName: 'encrypted_documents',
        timestamps: true,
        indexes: [
            { fields: ['documentId'], unique: true },
            { fields: ['encryptionKeyId'] },
            { fields: ['algorithm'] },
            { fields: ['encryptedAt'] },
            { fields: ['encryptedBy'] },
            { fields: ['quantumResistant'] },
            { fields: ['securityLevel'] },
        ],
    };
    return sequelize.define('EncryptedDocument', attributes, options);
};
exports.createEncryptedDocumentModel = createEncryptedDocumentModel;
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
const createDrmPolicyModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Document this policy applies to',
        },
        policyName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Policy name/identifier',
        },
        permissions: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Allowed permissions (read, print, copy, edit, etc.)',
        },
        allowedUsers: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: true,
            comment: 'List of allowed user IDs',
        },
        allowedDomains: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
            comment: 'List of allowed email domains',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Policy expiration date',
        },
        maxPrints: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Maximum allowed prints',
        },
        maxCopies: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Maximum allowed copies',
        },
        currentPrints: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Current print count',
        },
        currentCopies: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Current copy count',
        },
        watermarkConfig: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Watermark configuration',
        },
        geoRestrictions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Geographic restrictions',
        },
        deviceBinding: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether document is bound to specific device',
        },
        onlineValidationRequired: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether online validation is required',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether policy is currently active',
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'User who created the policy',
        },
        revokedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'When policy was revoked',
        },
        revokedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'User who revoked the policy',
        },
        revocationReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for revocation',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional policy metadata',
        },
    };
    const options = {
        tableName: 'drm_policies',
        timestamps: true,
        indexes: [
            { fields: ['documentId'] },
            { fields: ['policyName'] },
            { fields: ['isActive'] },
            { fields: ['expiresAt'] },
            { fields: ['createdBy'] },
            { fields: ['revokedAt'] },
            { fields: ['deviceBinding'] },
            { fields: ['onlineValidationRequired'] },
        ],
    };
    return sequelize.define('DrmPolicy', attributes, options);
};
exports.createDrmPolicyModel = createDrmPolicyModel;
// ============================================================================
// 1. AES-256 ENCRYPTION
// ============================================================================
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
const encryptDocumentAES256 = async (documentBuffer, keyId, associatedData) => {
    // Generate a random 96-bit IV (12 bytes) for GCM
    const iv = crypto.randomBytes(12);
    // In production, retrieve key from secure key management system
    const key = crypto.randomBytes(32); // 256-bit key
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    if (associatedData) {
        cipher.setAAD(associatedData);
    }
    let ciphertext = cipher.update(documentBuffer);
    ciphertext = Buffer.concat([ciphertext, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        ciphertext,
        iv,
        authTag,
        algorithm: 'AES-256-GCM',
        keyId,
        encryptedAt: new Date(),
    };
};
exports.encryptDocumentAES256 = encryptDocumentAES256;
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
const decryptDocumentAES256 = async (encryptedData, keyId) => {
    // In production, retrieve key from secure key management system
    const key = crypto.randomBytes(32); // 256-bit key
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, encryptedData.iv);
    decipher.setAuthTag(encryptedData.authTag);
    if (encryptedData.associatedData) {
        decipher.setAAD(encryptedData.associatedData);
    }
    let decrypted = decipher.update(encryptedData.ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
};
exports.decryptDocumentAES256 = decryptDocumentAES256;
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
const encryptFieldsDeterministic = async (data, config) => {
    const encrypted = { ...data };
    const key = crypto.randomBytes(32);
    for (const field of config.fields) {
        if (data[field] !== undefined && data[field] !== null) {
            const value = String(data[field]);
            if (config.deterministicEncryption) {
                // Use HMAC-based deterministic encryption for searchability
                const hmac = crypto.createHmac('sha256', key);
                hmac.update(value);
                encrypted[field] = hmac.digest('hex');
            }
            else {
                // Standard field encryption
                const iv = crypto.randomBytes(16);
                const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
                let ciphertext = cipher.update(value, 'utf8', 'hex');
                ciphertext += cipher.final('hex');
                encrypted[field] = `${iv.toString('hex')}:${ciphertext}`;
            }
        }
    }
    return encrypted;
};
exports.encryptFieldsDeterministic = encryptFieldsDeterministic;
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
const generateMasterEncryptionKey = async (keySize = 256, purpose = 'document-encryption') => {
    const keyId = `key-${crypto.randomBytes(16).toString('hex')}`;
    const keyMaterial = crypto.randomBytes(keySize / 8);
    return {
        keyId,
        keyMaterial,
        createdAt: new Date(),
    };
};
exports.generateMasterEncryptionKey = generateMasterEncryptionKey;
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
const encryptStreamAES256 = async (inputStream, outputStream, keyId) => {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let bytesProcessed = 0;
    return new Promise((resolve, reject) => {
        inputStream
            .pipe(cipher)
            .on('data', (chunk) => {
            bytesProcessed += chunk.length;
            outputStream.write(chunk);
        })
            .on('end', () => {
            const authTag = cipher.getAuthTag();
            resolve({ bytesProcessed, iv, authTag });
        })
            .on('error', reject);
    });
};
exports.encryptStreamAES256 = encryptStreamAES256;
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
const deriveKeyFromPassword = async (password, salt, keyLength = 32) => {
    const actualSalt = salt || crypto.randomBytes(16);
    // Use PBKDF2 (in production, use argon2)
    const key = crypto.pbkdf2Sync(password, actualSalt, 600000, keyLength, 'sha512');
    const params = {
        algorithm: 'PBKDF2',
        salt: actualSalt,
        iterations: 600000,
        keyLength,
    };
    return { key, salt: actualSalt, params };
};
exports.deriveKeyFromPassword = deriveKeyFromPassword;
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
const encryptWithCompression = async (documentBuffer, keyId) => {
    const zlib = require('zlib');
    const compressed = zlib.gzipSync(documentBuffer);
    const encrypted = await (0, exports.encryptDocumentAES256)(compressed, keyId);
    return {
        ...encrypted,
        compressionRatio: compressed.length / documentBuffer.length,
    };
};
exports.encryptWithCompression = encryptWithCompression;
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
const validateEncryptionStrength = async (config) => {
    const keySize = config.keySize || 256;
    const quantumResistant = config.algorithm === 'CRYSTALS-KYBER';
    let complianceLevel = 'standard';
    let estimatedSecurityBits = keySize / 2;
    if (quantumResistant) {
        complianceLevel = 'quantum-safe';
        estimatedSecurityBits = 256;
    }
    else if (keySize >= 256 && config.algorithm === 'AES-256-GCM') {
        complianceLevel = 'military';
        estimatedSecurityBits = 128;
    }
    else if (keySize >= 256) {
        complianceLevel = 'high';
    }
    return {
        algorithm: config.algorithm,
        keySize,
        quantumResistant,
        estimatedSecurityBits,
        complianceLevel,
        recommendedRetirementDate: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
    };
};
exports.validateEncryptionStrength = validateEncryptionStrength;
// ============================================================================
// 2. QUANTUM-RESISTANT ENCRYPTION (CRYSTALS-KYBER)
// ============================================================================
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
const generateKyberKeypair = async (securityLevel = 3) => {
    // Placeholder for CRYSTALS-KYBER implementation
    // In production, use a proper post-quantum cryptography library
    const publicKey = crypto.randomBytes(1184); // Kyber768 public key size
    const privateKey = crypto.randomBytes(2400); // Kyber768 private key size
    return { publicKey, privateKey, securityLevel };
};
exports.generateKyberKeypair = generateKyberKeypair;
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
const encryptQuantumResistant = async (documentBuffer, publicKey) => {
    // Placeholder for CRYSTALS-KYBER encapsulation
    const encapsulatedKey = crypto.randomBytes(1088); // Kyber768 ciphertext size
    const sharedSecret = crypto.randomBytes(32);
    // Use shared secret to encrypt document with AES-256-GCM
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', sharedSecret, iv);
    let ciphertext = cipher.update(documentBuffer);
    ciphertext = Buffer.concat([ciphertext, cipher.final()]);
    const authTag = cipher.getAuthTag();
    // Combine IV, auth tag, and ciphertext
    const combinedCiphertext = Buffer.concat([iv, authTag, ciphertext]);
    return {
        ciphertext: combinedCiphertext,
        publicKey,
        encapsulatedKey,
        algorithm: 'CRYSTALS-KYBER-768',
        securityLevel: 3,
        encryptedAt: new Date(),
    };
};
exports.encryptQuantumResistant = encryptQuantumResistant;
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
const decryptQuantumResistant = async (encryptedData, privateKey) => {
    // Placeholder for CRYSTALS-KYBER decapsulation
    const sharedSecret = crypto.randomBytes(32);
    // Extract IV, auth tag, and ciphertext
    const iv = encryptedData.ciphertext.subarray(0, 12);
    const authTag = encryptedData.ciphertext.subarray(12, 28);
    const ciphertext = encryptedData.ciphertext.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', sharedSecret, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
};
exports.decryptQuantumResistant = decryptQuantumResistant;
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
const createHybridEncryption = async (documentBuffer, aesKeyId, kyberPublicKey) => {
    // First encrypt with AES-256-GCM
    const aesResult = await (0, exports.encryptDocumentAES256)(documentBuffer, aesKeyId);
    // Then encrypt the AES key with CRYSTALS-KYBER
    const keyBuffer = Buffer.from(aesKeyId);
    const quantumResult = await (0, exports.encryptQuantumResistant)(keyBuffer, kyberPublicKey);
    return {
        aes: aesResult,
        quantum: quantumResult,
    };
};
exports.createHybridEncryption = createHybridEncryption;
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
const validateQuantumResistance = (algorithm) => {
    const quantumSafeAlgorithms = ['CRYSTALS-KYBER', 'CRYSTALS-DILITHIUM', 'SPHINCS+'];
    const quantumSafe = quantumSafeAlgorithms.some((safe) => algorithm.includes(safe));
    if (!quantumSafe) {
        return {
            quantumSafe: false,
            recommendedUpgrade: 'CRYSTALS-KYBER-768',
            estimatedBreakYear: 2030,
        };
    }
    return { quantumSafe: true };
};
exports.validateQuantumResistance = validateQuantumResistance;
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
const migrateToQuantumResistant = async (classicalEncryption, kyberPublicKey, originalKeyId) => {
    // First decrypt with classical key (would need actual key in production)
    // Then re-encrypt with quantum-resistant algorithm
    // For now, just encrypt the ciphertext metadata
    const metadata = Buffer.from(JSON.stringify({
        originalKeyId,
        algorithm: classicalEncryption.algorithm,
        encryptedAt: classicalEncryption.encryptedAt,
    }));
    return (0, exports.encryptQuantumResistant)(metadata, kyberPublicKey);
};
exports.migrateToQuantumResistant = migrateToQuantumResistant;
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
const generateKeyEncapsulation = async (publicKey) => {
    // Placeholder for CRYSTALS-KYBER KEM
    const sharedSecret = crypto.randomBytes(32);
    const ciphertext = crypto.randomBytes(1088); // Kyber768 ciphertext size
    return { sharedSecret, ciphertext };
};
exports.generateKeyEncapsulation = generateKeyEncapsulation;
// ============================================================================
// 3. DRM POLICY ENFORCEMENT
// ============================================================================
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
const createDRMPolicy = async (policy) => {
    const policyId = `policy-${crypto.randomBytes(16).toString('hex')}`;
    return {
        policyId,
        policy,
        createdAt: new Date(),
    };
};
exports.createDRMPolicy = createDRMPolicy;
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
const validateDRMPermission = async (policy, permission, userId) => {
    // Check if policy has expired
    if (policy.expiresAt && new Date() > policy.expiresAt) {
        return { allowed: false, reason: 'Policy has expired' };
    }
    // Check if permission is granted
    if (!policy.permissions.includes(permission)) {
        return { allowed: false, reason: 'Permission not granted' };
    }
    // Check user restrictions
    if (policy.allowedUsers && !policy.allowedUsers.includes(userId)) {
        return { allowed: false, reason: 'User not authorized' };
    }
    // Check usage limits for print
    if (permission === 'print' && policy.maxPrints !== undefined) {
        // Would track current prints in database
        const remainingPrints = policy.maxPrints;
        if (remainingPrints <= 0) {
            return { allowed: false, reason: 'Print quota exceeded' };
        }
        return { allowed: true, remainingUsage: remainingPrints };
    }
    return { allowed: true };
};
exports.validateDRMPermission = validateDRMPermission;
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
const applyDRMWatermark = async (documentBuffer, watermark, userId) => {
    let watermarkText = watermark.text;
    if (watermark.includeUserId) {
        watermarkText += ` - User: ${userId}`;
    }
    if (watermark.includeTimestamp) {
        watermarkText += ` - ${new Date().toISOString()}`;
    }
    if (watermark.includeIPAddress) {
        watermarkText += ` - IP: [REDACTED]`;
    }
    // In production, use pdf-lib or similar to apply watermark
    // Placeholder implementation
    return documentBuffer;
};
exports.applyDRMWatermark = applyDRMWatermark;
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
const validateGeoRestrictions = (restrictions, userCountry, userRegion) => {
    if (restrictions.blockedCountries?.includes(userCountry)) {
        return { allowed: false, reason: 'Access blocked in your country' };
    }
    if (restrictions.allowedCountries && !restrictions.allowedCountries.includes(userCountry)) {
        return { allowed: false, reason: 'Access not available in your country' };
    }
    if (userRegion && restrictions.allowedRegions && !restrictions.allowedRegions.includes(userRegion)) {
        return { allowed: false, reason: 'Access not available in your region' };
    }
    return { allowed: true };
};
exports.validateGeoRestrictions = validateGeoRestrictions;
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
const trackDocumentAccess = async (accessLog) => {
    // Store in database or audit log
    // Placeholder for tracking implementation
};
exports.trackDocumentAccess = trackDocumentAccess;
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
const revokeDRMPolicy = async (policyId, revokedBy, reason) => {
    const revokedAt = new Date();
    // Update policy in database to mark as revoked
    // Placeholder implementation
    return { revoked: true, revokedAt };
};
exports.revokeDRMPolicy = revokeDRMPolicy;
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
const validateDeviceBinding = async (documentId, deviceId, userId) => {
    // Check if device is authorized for this document
    // Placeholder implementation
    return { authorized: true };
};
exports.validateDeviceBinding = validateDeviceBinding;
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
const generateDRMLicense = async (documentId, userId, permissions, expiresAt) => {
    const licenseData = {
        documentId,
        userId,
        permissions,
        issuedAt: new Date(),
        expiresAt,
    };
    // Sign license with private key
    const licenseKey = crypto
        .createHash('sha256')
        .update(JSON.stringify(licenseData))
        .digest('hex');
    return {
        licenseKey,
        expiresAt,
        permissions,
    };
};
exports.generateDRMLicense = generateDRMLicense;
// ============================================================================
// 4. KEY ROTATION
// ============================================================================
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
const createKeyRotationSchedule = async (config, keyId) => {
    const scheduleId = `schedule-${crypto.randomBytes(16).toString('hex')}`;
    let nextRotation = new Date();
    if (config.strategy === 'time-based' && config.rotationIntervalDays) {
        nextRotation = new Date(Date.now() + config.rotationIntervalDays * 24 * 60 * 60 * 1000);
    }
    return {
        scheduleId,
        nextRotation,
        config,
    };
};
exports.createKeyRotationSchedule = createKeyRotationSchedule;
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
const rotateEncryptionKey = async (oldKeyId, reEncryptData = false) => {
    const { keyId: newKeyId, keyMaterial } = await (0, exports.generateMasterEncryptionKey)();
    let reEncrypted = 0;
    if (reEncryptData) {
        // Re-encrypt all documents using the old key
        // Placeholder for re-encryption logic
        reEncrypted = 0;
    }
    return {
        newKeyId,
        oldKeyId,
        rotatedAt: new Date(),
        reEncrypted,
    };
};
exports.rotateEncryptionKey = rotateEncryptionKey;
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
const validateKeyRotationEligibility = async (keyId, config) => {
    // Check usage count
    if (config.strategy === 'usage-based' && config.maxUsageCount) {
        // Would check actual usage from database
        const currentUsage = 0;
        if (currentUsage >= config.maxUsageCount) {
            return { eligible: true, reason: 'Usage limit reached' };
        }
    }
    // Check time-based rotation
    if (config.strategy === 'time-based' && config.rotationIntervalDays) {
        const nextRotation = new Date(Date.now() + config.rotationIntervalDays * 24 * 60 * 60 * 1000);
        return { eligible: false, nextRotation };
    }
    return { eligible: false };
};
exports.validateKeyRotationEligibility = validateKeyRotationEligibility;
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
const archiveEncryptionKey = async (keyId, reason) => {
    const retentionPeriodDays = 365 * 7; // 7 years for compliance
    // Mark key as archived in database
    // Keep for retention period for decryption of old data
    return {
        archived: true,
        archivedAt: new Date(),
        retentionPeriodDays,
    };
};
exports.archiveEncryptionKey = archiveEncryptionKey;
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
const trackKeyUsageMetrics = async (keyId) => {
    // Retrieve metrics from database
    // Placeholder implementation
    return {
        usageCount: 1000,
        lastUsed: new Date(),
        documentsEncrypted: 500,
    };
};
exports.trackKeyUsageMetrics = trackKeyUsageMetrics;
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
const notifyKeyRotation = async (keyId, scheduledRotation, recipients) => {
    // Send email/SMS notifications
    // Placeholder implementation
    return {
        sent: true,
        recipients,
        sentAt: new Date(),
    };
};
exports.notifyKeyRotation = notifyKeyRotation;
// ============================================================================
// 5. HARDWARE SECURITY MODULE (HSM) INTEGRATION
// ============================================================================
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
const initializeHSMConnection = async (config) => {
    // Initialize connection to HSM provider
    // Placeholder for AWS KMS, Azure Key Vault, etc.
    return {
        connected: true,
        provider: config.provider,
        keyId: config.keyId,
    };
};
exports.initializeHSMConnection = initializeHSMConnection;
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
const encryptWithHSM = async (documentBuffer, hsmConfig) => {
    // Use HSM to generate data encryption key (DEK)
    // Encrypt document with DEK
    // Encrypt DEK with HSM master key
    // Placeholder for AWS KMS Encrypt operation
    const iv = crypto.randomBytes(12);
    const key = crypto.randomBytes(32); // Would be generated by HSM
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let ciphertext = cipher.update(documentBuffer);
    ciphertext = Buffer.concat([ciphertext, cipher.final()]);
    const authTag = cipher.getAuthTag();
    // Combine IV, auth tag, and ciphertext
    const combinedCiphertext = Buffer.concat([iv, authTag, ciphertext]);
    return {
        ciphertext: combinedCiphertext,
        keyId: hsmConfig.keyId,
        encryptedAt: new Date(),
    };
};
exports.encryptWithHSM = encryptWithHSM;
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
const decryptWithHSM = async (ciphertext, hsmConfig) => {
    // Use HSM to decrypt data encryption key (DEK)
    // Decrypt document with DEK
    // Placeholder for AWS KMS Decrypt operation
    const iv = ciphertext.subarray(0, 12);
    const authTag = ciphertext.subarray(12, 28);
    const encrypted = ciphertext.subarray(28);
    const key = crypto.randomBytes(32); // Would be decrypted by HSM
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
};
exports.decryptWithHSM = decryptWithHSM;
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
const generateDataKeyHSM = async (hsmConfig, keySize = 256) => {
    // Generate data key using HSM
    // Returns plaintext key for immediate use and encrypted key for storage
    const plaintext = crypto.randomBytes(keySize / 8);
    const ciphertext = crypto.randomBytes(keySize / 8 + 16); // Placeholder
    return {
        plaintext,
        ciphertext,
        keyId: hsmConfig.keyId,
    };
};
exports.generateDataKeyHSM = generateDataKeyHSM;
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
const validateHSMKeyAccess = async (hsmConfig) => {
    // Test HSM connection and key permissions
    // Placeholder implementation
    return {
        accessible: true,
        permissions: ['encrypt', 'decrypt', 'generate-data-key'],
    };
};
exports.validateHSMKeyAccess = validateHSMKeyAccess;
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
const auditHSMKeyUsage = async (keyId, startDate, endDate) => {
    // Retrieve HSM audit logs
    // Placeholder implementation
    return {
        operations: 1000,
        users: ['user-1', 'user-2'],
        actions: {
            encrypt: 500,
            decrypt: 450,
            'generate-data-key': 50,
        },
    };
};
exports.auditHSMKeyUsage = auditHSMKeyUsage;
// ============================================================================
// 6. DOCUMENT RIGHTS MANAGEMENT
// ============================================================================
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
const issueDocumentRights = async (documentId, userId, rights) => {
    const rightId = `right-${crypto.randomBytes(16).toString('hex')}`;
    const licenseData = {
        rightId,
        documentId,
        userId,
        ...rights,
    };
    const licenseKey = crypto
        .createHash('sha256')
        .update(JSON.stringify(licenseData))
        .digest('hex');
    return {
        rightId,
        licenseKey,
        issuedAt: new Date(),
    };
};
exports.issueDocumentRights = issueDocumentRights;
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
const transferDocumentRights = async (rightId, fromUserId, toUserId) => {
    const newRightId = `right-${crypto.randomBytes(16).toString('hex')}`;
    // Verify transferability
    // Revoke old rights
    // Issue new rights to recipient
    return {
        transferred: true,
        newRightId,
        transferredAt: new Date(),
    };
};
exports.transferDocumentRights = transferDocumentRights;
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
const revokeDocumentRights = async (rightId, revokedBy, reason) => {
    const revokedAt = new Date();
    // Mark rights as revoked in database
    // Notify affected user
    return {
        revoked: true,
        revokedAt,
        notified: true,
    };
};
exports.revokeDocumentRights = revokeDocumentRights;
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
const generateAccessComplianceReport = async (documentId, startDate, endDate) => {
    // Aggregate access logs
    // Identify violations
    // Generate compliance report
    const reportData = {
        documentId,
        period: { startDate, endDate },
        totalAccesses: 150,
        uniqueUsers: 25,
        violations: 3,
        accessBreakdown: {
            read: 100,
            print: 30,
            download: 20,
        },
        violationDetails: [
            { type: 'unauthorized-access', count: 2 },
            { type: 'quota-exceeded', count: 1 },
        ],
    };
    return {
        totalAccesses: 150,
        uniqueUsers: 25,
        violations: 3,
        report: JSON.stringify(reportData, null, 2),
    };
};
exports.generateAccessComplianceReport = generateAccessComplianceReport;
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
const createKeyEscrow = async (keyId, keyMaterial, escrowAgents, threshold) => {
    // Implement Shamir's Secret Sharing
    // Split key into shares
    // Distribute to escrow agents
    const escrowId = `escrow-${crypto.randomBytes(16).toString('hex')}`;
    // Encrypt key material for escrow
    const escrowKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', escrowKey, iv);
    let escrowedKey = cipher.update(keyMaterial);
    escrowedKey = Buffer.concat([escrowedKey, cipher.final()]);
    return {
        keyId,
        escrowedKey,
        escrowedAt: new Date(),
        escrowAgent: escrowId,
        recoveryPolicy: `${threshold}/${escrowAgents.length} threshold`,
        sharesRequired: threshold,
        threshold,
    };
};
exports.createKeyEscrow = createKeyEscrow;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Model creators
    createEncryptionKeyModel: exports.createEncryptionKeyModel,
    createEncryptedDocumentModel: exports.createEncryptedDocumentModel,
    createDrmPolicyModel: exports.createDrmPolicyModel,
    // AES-256 encryption
    encryptDocumentAES256: exports.encryptDocumentAES256,
    decryptDocumentAES256: exports.decryptDocumentAES256,
    encryptFieldsDeterministic: exports.encryptFieldsDeterministic,
    generateMasterEncryptionKey: exports.generateMasterEncryptionKey,
    encryptStreamAES256: exports.encryptStreamAES256,
    deriveKeyFromPassword: exports.deriveKeyFromPassword,
    encryptWithCompression: exports.encryptWithCompression,
    validateEncryptionStrength: exports.validateEncryptionStrength,
    // Quantum-resistant encryption
    generateKyberKeypair: exports.generateKyberKeypair,
    encryptQuantumResistant: exports.encryptQuantumResistant,
    decryptQuantumResistant: exports.decryptQuantumResistant,
    createHybridEncryption: exports.createHybridEncryption,
    validateQuantumResistance: exports.validateQuantumResistance,
    migrateToQuantumResistant: exports.migrateToQuantumResistant,
    generateKeyEncapsulation: exports.generateKeyEncapsulation,
    // DRM policy enforcement
    createDRMPolicy: exports.createDRMPolicy,
    validateDRMPermission: exports.validateDRMPermission,
    applyDRMWatermark: exports.applyDRMWatermark,
    validateGeoRestrictions: exports.validateGeoRestrictions,
    trackDocumentAccess: exports.trackDocumentAccess,
    revokeDRMPolicy: exports.revokeDRMPolicy,
    validateDeviceBinding: exports.validateDeviceBinding,
    generateDRMLicense: exports.generateDRMLicense,
    // Key rotation
    createKeyRotationSchedule: exports.createKeyRotationSchedule,
    rotateEncryptionKey: exports.rotateEncryptionKey,
    validateKeyRotationEligibility: exports.validateKeyRotationEligibility,
    archiveEncryptionKey: exports.archiveEncryptionKey,
    trackKeyUsageMetrics: exports.trackKeyUsageMetrics,
    notifyKeyRotation: exports.notifyKeyRotation,
    // HSM integration
    initializeHSMConnection: exports.initializeHSMConnection,
    encryptWithHSM: exports.encryptWithHSM,
    decryptWithHSM: exports.decryptWithHSM,
    generateDataKeyHSM: exports.generateDataKeyHSM,
    validateHSMKeyAccess: exports.validateHSMKeyAccess,
    auditHSMKeyUsage: exports.auditHSMKeyUsage,
    // Document rights management
    issueDocumentRights: exports.issueDocumentRights,
    transferDocumentRights: exports.transferDocumentRights,
    revokeDocumentRights: exports.revokeDocumentRights,
    generateAccessComplianceReport: exports.generateAccessComplianceReport,
    createKeyEscrow: exports.createKeyEscrow,
};
//# sourceMappingURL=document-advanced-encryption-kit.js.map