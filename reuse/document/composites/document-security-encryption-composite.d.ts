/**
 * LOC: DOCSECENC001
 * File: /reuse/document/composites/document-security-encryption-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - node-forge
 *   - ../document-security-kit
 *   - ../document-advanced-encryption-kit
 *   - ../document-permission-management-kit
 *   - ../document-redaction-kit
 *   - ../document-signing-kit
 *
 * DOWNSTREAM (imported by):
 *   - Document security services
 *   - Encryption management modules
 *   - DRM systems
 *   - Access control services
 *   - Digital signature services
 */
/**
 * File: /reuse/document/composites/document-security-encryption-composite.ts
 * Locator: WC-DOCUMENT-SECURITY-ENCRYPTION-001
 * Purpose: Comprehensive Document Security & Encryption Toolkit - Production-ready encryption, DRM, and access control
 *
 * Upstream: Composed from document-security-kit, document-advanced-encryption-kit, document-permission-management-kit, document-redaction-kit, document-signing-kit
 * Downstream: ../backend/*, Security services, Encryption management, DRM systems, Access control, Digital signatures
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto, node-forge
 * Exports: 48 utility functions for advanced encryption, DRM, access control, rights management, redaction, digital signatures
 *
 * LLM Context: Enterprise-grade security and encryption toolkit for White Cross healthcare platform.
 * Provides comprehensive document security including AES-256/RSA-4096 encryption, quantum-resistant algorithms,
 * zero-knowledge encryption, DRM with watermarking, granular permission management, role-based access control (RBAC),
 * attribute-based access control (ABAC), automatic redaction of PII/PHI, pattern-based sanitization, qualified
 * electronic signatures (QES), blockchain-anchored signatures, multi-factor authentication integration, and
 * HIPAA-compliant security controls. Composes functions from multiple security kits to provide unified operations
 * for protecting sensitive healthcare documents and ensuring regulatory compliance.
 */
import { Model } from 'sequelize-typescript';
/**
 * Encryption algorithms
 */
export declare enum EncryptionAlgorithm {
    AES_256_GCM = "AES_256_GCM",
    AES_256_CBC = "AES_256_CBC",
    AES_192_GCM = "AES_192_GCM",
    AES_128_GCM = "AES_128_GCM",
    RSA_4096 = "RSA_4096",
    RSA_2048 = "RSA_2048",
    CHACHA20_POLY1305 = "CHACHA20_POLY1305",
    QUANTUM_RESISTANT = "QUANTUM_RESISTANT"
}
/**
 * Key derivation functions
 */
export declare enum KeyDerivationFunction {
    PBKDF2 = "PBKDF2",
    ARGON2 = "ARGON2",
    SCRYPT = "SCRYPT",
    BCRYPT = "BCRYPT"
}
/**
 * Document permission types
 */
export declare enum DocumentPermission {
    VIEW = "VIEW",
    EDIT = "EDIT",
    DELETE = "DELETE",
    SHARE = "SHARE",
    PRINT = "PRINT",
    DOWNLOAD = "DOWNLOAD",
    ANNOTATE = "ANNOTATE",
    WATERMARK = "WATERMARK",
    REDACT = "REDACT",
    SIGN = "SIGN",
    ADMIN = "ADMIN"
}
/**
 * Access control models
 */
export declare enum AccessControlModel {
    RBAC = "RBAC",// Role-Based Access Control
    ABAC = "ABAC",// Attribute-Based Access Control
    MAC = "MAC",// Mandatory Access Control
    DAC = "DAC"
}
/**
 * Signature types
 */
export declare enum SignatureType {
    ELECTRONIC = "ELECTRONIC",
    QUALIFIED = "QUALIFIED",// QES per eIDAS
    ADVANCED = "ADVANCED",
    SIMPLE = "SIMPLE",
    BLOCKCHAIN_ANCHORED = "BLOCKCHAIN_ANCHORED"
}
/**
 * Redaction types
 */
export declare enum RedactionType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    AREA = "AREA",
    PATTERN = "PATTERN",
    PII = "PII",
    PHI = "PHI",
    FINANCIAL = "FINANCIAL"
}
/**
 * DRM protection levels
 */
export declare enum DRMProtectionLevel {
    NONE = "NONE",
    BASIC = "BASIC",
    STANDARD = "STANDARD",
    ADVANCED = "ADVANCED",
    MAXIMUM = "MAXIMUM"
}
/**
 * Encryption configuration
 */
export interface EncryptionConfig {
    algorithm: EncryptionAlgorithm;
    keySize: number;
    kdf: KeyDerivationFunction;
    kdfIterations: number;
    saltSize: number;
    ivSize: number;
    authTagSize?: number;
    metadata?: Record<string, any>;
}
/**
 * Encryption result
 */
export interface EncryptionResult {
    id: string;
    encryptedData: Buffer;
    algorithm: EncryptionAlgorithm;
    iv: Buffer;
    authTag?: Buffer;
    salt: Buffer;
    keyId?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
/**
 * Permission set
 */
export interface PermissionSet {
    id: string;
    userId: string;
    documentId: string;
    permissions: DocumentPermission[];
    grantedBy: string;
    grantedAt: Date;
    expiresAt?: Date;
    conditions?: PermissionCondition[];
    metadata?: Record<string, any>;
}
/**
 * Permission condition
 */
export interface PermissionCondition {
    type: 'TIME' | 'LOCATION' | 'DEVICE' | 'NETWORK' | 'CUSTOM';
    operator: 'EQUALS' | 'NOT_EQUALS' | 'IN' | 'NOT_IN' | 'GREATER_THAN' | 'LESS_THAN';
    value: any;
}
/**
 * Access control policy
 */
export interface AccessControlPolicy {
    id: string;
    name: string;
    description: string;
    model: AccessControlModel;
    rules: AccessControlRule[];
    priority: number;
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Access control rule
 */
export interface AccessControlRule {
    id: string;
    subject: string;
    action: DocumentPermission;
    resource: string;
    conditions?: PermissionCondition[];
    effect: 'ALLOW' | 'DENY';
}
/**
 * Redaction area
 */
export interface RedactionArea {
    id: string;
    type: RedactionType;
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    pattern?: RegExp;
    replacement?: string;
    metadata?: Record<string, any>;
}
/**
 * Digital signature
 */
export interface DigitalSignature {
    id: string;
    signatureType: SignatureType;
    signerId: string;
    signerName: string;
    signerEmail?: string;
    certificateId?: string;
    signatureData: string;
    algorithm: string;
    timestamp: Date;
    timestampAuthority?: string;
    blockchainTxId?: string;
    verified: boolean;
    metadata?: Record<string, any>;
}
/**
 * DRM configuration
 */
export interface DRMConfig {
    id: string;
    protectionLevel: DRMProtectionLevel;
    watermarkText?: string;
    dynamicWatermark: boolean;
    allowedDevices?: string[];
    maxCopies?: number;
    expirationDate?: Date;
    geofencing?: GeofenceConfig;
    metadata?: Record<string, any>;
}
/**
 * Geofencing configuration
 */
export interface GeofenceConfig {
    allowedCountries?: string[];
    allowedRegions?: string[];
    deniedCountries?: string[];
    deniedRegions?: string[];
}
/**
 * Key management entry
 */
export interface KeyManagementEntry {
    id: string;
    keyId: string;
    algorithm: EncryptionAlgorithm;
    purpose: 'ENCRYPTION' | 'SIGNING' | 'AUTHENTICATION';
    status: 'ACTIVE' | 'ROTATED' | 'EXPIRED' | 'REVOKED';
    createdAt: Date;
    expiresAt?: Date;
    rotatedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Encryption Configuration Model
 * Stores encryption configurations
 */
export declare class EncryptionConfigModel extends Model {
    id: string;
    algorithm: EncryptionAlgorithm;
    keySize: number;
    kdf: KeyDerivationFunction;
    kdfIterations: number;
    saltSize: number;
    ivSize: number;
    authTagSize?: number;
    metadata?: Record<string, any>;
}
/**
 * Permission Set Model
 * Stores document permissions
 */
export declare class PermissionSetModel extends Model {
    id: string;
    userId: string;
    documentId: string;
    permissions: DocumentPermission[];
    grantedBy: string;
    grantedAt: Date;
    expiresAt?: Date;
    conditions?: PermissionCondition[];
    metadata?: Record<string, any>;
}
/**
 * Access Control Policy Model
 * Stores access control policies
 */
export declare class AccessControlPolicyModel extends Model {
    id: string;
    name: string;
    description: string;
    model: AccessControlModel;
    rules: AccessControlRule[];
    priority: number;
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Digital Signature Model
 * Stores digital signatures
 */
export declare class DigitalSignatureModel extends Model {
    id: string;
    signatureType: SignatureType;
    signerId: string;
    signerName: string;
    signerEmail?: string;
    certificateId?: string;
    signatureData: string;
    algorithm: string;
    timestamp: Date;
    timestampAuthority?: string;
    blockchainTxId?: string;
    verified: boolean;
    metadata?: Record<string, any>;
}
/**
 * DRM Configuration Model
 * Stores DRM configurations
 */
export declare class DRMConfigModel extends Model {
    id: string;
    protectionLevel: DRMProtectionLevel;
    watermarkText?: string;
    dynamicWatermark: boolean;
    allowedDevices?: string[];
    maxCopies?: number;
    expirationDate?: Date;
    geofencing?: GeofenceConfig;
    metadata?: Record<string, any>;
}
/**
 * Encrypts document using AES-256-GCM with PBKDF2 key derivation.
 * Provides authenticated encryption with additional data (AEAD).
 *
 * @param {Buffer} documentData - Document data to encrypt
 * @param {string} password - Encryption password
 * @param {Partial<EncryptionConfig>} [config] - Optional encryption configuration
 * @returns {Promise<EncryptionResult>} Encryption result with encrypted data
 *
 * @example
 * ```typescript
 * const encrypted = await encryptDocumentAES256(documentBuffer, 'strongPassword123!');
 * // Store encrypted.encryptedData, encrypted.iv, encrypted.salt, encrypted.authTag
 * ```
 */
export declare const encryptDocumentAES256: (documentData: Buffer, password: string, config?: Partial<EncryptionConfig>) => Promise<EncryptionResult>;
/**
 * Decrypts document encrypted with AES-256-GCM.
 * Verifies authentication tag to ensure data integrity.
 *
 * @param {EncryptionResult} encryptionResult - Encryption result from encryptDocumentAES256
 * @param {string} password - Decryption password
 * @returns {Promise<Buffer>} Decrypted document data
 *
 * @example
 * ```typescript
 * const decrypted = await decryptDocumentAES256(encryptedResult, 'strongPassword123!');
 * ```
 */
export declare const decryptDocumentAES256: (encryptionResult: EncryptionResult, password: string) => Promise<Buffer>;
/**
 * Generates RSA-4096 key pair for asymmetric encryption.
 * Suitable for encrypting document encryption keys.
 *
 * @returns {Promise<{ publicKey: string; privateKey: string; keyId: string }>} RSA key pair
 *
 * @example
 * ```typescript
 * const keyPair = await generateRSAKeyPair();
 * // Store keyPair.publicKey and securely store keyPair.privateKey
 * ```
 */
export declare const generateRSAKeyPair: () => Promise<{
    publicKey: string;
    privateKey: string;
    keyId: string;
}>;
/**
 * Encrypts data using RSA public key.
 *
 * @param {Buffer} data - Data to encrypt
 * @param {string} publicKey - RSA public key (PEM format)
 * @returns {Promise<Buffer>} Encrypted data
 *
 * @example
 * ```typescript
 * const encrypted = await encryptWithRSA(dataBuffer, publicKey);
 * ```
 */
export declare const encryptWithRSA: (data: Buffer, publicKey: string) => Promise<Buffer>;
/**
 * Decrypts data using RSA private key.
 *
 * @param {Buffer} encryptedData - Encrypted data
 * @param {string} privateKey - RSA private key (PEM format)
 * @returns {Promise<Buffer>} Decrypted data
 *
 * @example
 * ```typescript
 * const decrypted = await decryptWithRSA(encryptedBuffer, privateKey);
 * ```
 */
export declare const decryptWithRSA: (encryptedData: Buffer, privateKey: string) => Promise<Buffer>;
/**
 * Implements zero-knowledge encryption where server never sees plaintext.
 * Client-side encryption with server-side encrypted storage.
 *
 * @param {Buffer} documentData - Document data
 * @param {string} clientPassword - Client-provided password
 * @returns {Promise<EncryptionResult>} Zero-knowledge encrypted result
 *
 * @example
 * ```typescript
 * const encrypted = await implementZeroKnowledgeEncryption(document, userPassword);
 * ```
 */
export declare const implementZeroKnowledgeEncryption: (documentData: Buffer, clientPassword: string) => Promise<EncryptionResult>;
/**
 * Grants permissions to user for specific document.
 *
 * @param {string} userId - User ID
 * @param {string} documentId - Document ID
 * @param {DocumentPermission[]} permissions - Permissions to grant
 * @param {string} grantedBy - User granting permissions
 * @param {Date} [expiresAt] - Optional expiration date
 * @returns {Promise<PermissionSet>} Created permission set
 *
 * @example
 * ```typescript
 * const permissions = await grantDocumentPermissions(
 *   'user123',
 *   'doc456',
 *   [DocumentPermission.VIEW, DocumentPermission.EDIT],
 *   'admin'
 * );
 * ```
 */
export declare const grantDocumentPermissions: (userId: string, documentId: string, permissions: DocumentPermission[], grantedBy: string, expiresAt?: Date) => Promise<PermissionSet>;
/**
 * Revokes permissions from user for specific document.
 *
 * @param {string} permissionSetId - Permission set ID to revoke
 * @param {string} revokedBy - User revoking permissions
 * @returns {Promise<{ revoked: boolean; timestamp: Date }>} Revocation result
 *
 * @example
 * ```typescript
 * const result = await revokeDocumentPermissions('perm123', 'admin');
 * ```
 */
export declare const revokeDocumentPermissions: (permissionSetId: string, revokedBy: string) => Promise<{
    revoked: boolean;
    timestamp: Date;
}>;
/**
 * Checks if user has specific permission for document.
 *
 * @param {string} userId - User ID
 * @param {string} documentId - Document ID
 * @param {DocumentPermission} permission - Permission to check
 * @returns {Promise<{ hasPermission: boolean; reason?: string }>} Permission check result
 *
 * @example
 * ```typescript
 * const canEdit = await checkDocumentPermission('user123', 'doc456', DocumentPermission.EDIT);
 * if (canEdit.hasPermission) {
 *   // Allow edit operation
 * }
 * ```
 */
export declare const checkDocumentPermission: (userId: string, documentId: string, permission: DocumentPermission) => Promise<{
    hasPermission: boolean;
    reason?: string;
}>;
/**
 * Evaluates access control policy against request context.
 *
 * @param {AccessControlPolicy} policy - Access control policy
 * @param {Object} context - Request context
 * @param {string} context.userId - User ID
 * @param {string} context.documentId - Document ID
 * @param {DocumentPermission} context.action - Requested action
 * @returns {Promise<{ allowed: boolean; matchedRule?: AccessControlRule }>} Evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateAccessControlPolicy(policy, {
 *   userId: 'user123',
 *   documentId: 'doc456',
 *   action: DocumentPermission.VIEW
 * });
 * ```
 */
export declare const evaluateAccessControlPolicy: (policy: AccessControlPolicy, context: {
    userId: string;
    documentId: string;
    action: DocumentPermission;
}) => Promise<{
    allowed: boolean;
    matchedRule?: AccessControlRule;
}>;
/**
 * Applies redaction to document areas containing sensitive information.
 *
 * @param {Buffer} documentData - Document data
 * @param {RedactionArea[]} redactionAreas - Areas to redact
 * @param {RedactionType} type - Type of redaction
 * @returns {Promise<{ redactedDocument: Buffer; redactionCount: number }>} Redaction result
 *
 * @example
 * ```typescript
 * const result = await applyDocumentRedaction(pdfBuffer, [
 *   { id: '1', type: RedactionType.PII, page: 1, x: 100, y: 200, width: 200, height: 20 }
 * ], RedactionType.PII);
 * ```
 */
export declare const applyDocumentRedaction: (documentData: Buffer, redactionAreas: RedactionArea[], type: RedactionType) => Promise<{
    redactedDocument: Buffer;
    redactionCount: number;
}>;
/**
 * Automatically detects and redacts PII/PHI using pattern matching.
 *
 * @param {Buffer} documentData - Document data
 * @param {('PII' | 'PHI')[]} categories - Categories to detect
 * @returns {Promise<{ redactedDocument: Buffer; detectedPatterns: string[]; redactionCount: number }>} Auto-redaction result
 *
 * @example
 * ```typescript
 * const result = await autoRedactSensitiveData(document, ['PII', 'PHI']);
 * console.log(`Redacted ${result.redactionCount} sensitive items`);
 * ```
 */
export declare const autoRedactSensitiveData: (documentData: Buffer, categories: ("PII" | "PHI")[]) => Promise<{
    redactedDocument: Buffer;
    detectedPatterns: string[];
    redactionCount: number;
}>;
/**
 * Creates digital signature for document.
 *
 * @param {Buffer} documentData - Document data to sign
 * @param {string} privateKey - Private key for signing
 * @param {Object} signerInfo - Signer information
 * @param {string} signerInfo.signerId - Signer ID
 * @param {string} signerInfo.signerName - Signer name
 * @param {string} [signerInfo.signerEmail] - Signer email
 * @param {SignatureType} signatureType - Type of signature
 * @returns {Promise<DigitalSignature>} Created digital signature
 *
 * @example
 * ```typescript
 * const signature = await createDigitalSignature(
 *   documentBuffer,
 *   privateKey,
 *   { signerId: 'user123', signerName: 'Dr. Smith', signerEmail: 'smith@example.com' },
 *   SignatureType.QUALIFIED
 * );
 * ```
 */
export declare const createDigitalSignature: (documentData: Buffer, privateKey: string, signerInfo: {
    signerId: string;
    signerName: string;
    signerEmail?: string;
}, signatureType: SignatureType) => Promise<DigitalSignature>;
/**
 * Verifies digital signature authenticity.
 *
 * @param {Buffer} documentData - Original document data
 * @param {DigitalSignature} signature - Signature to verify
 * @param {string} publicKey - Public key for verification
 * @returns {Promise<{ valid: boolean; timestamp: Date; signerInfo: Record<string, string> }>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyDigitalSignature(documentBuffer, signature, publicKey);
 * if (verification.valid) {
 *   console.log('Signature is valid');
 * }
 * ```
 */
export declare const verifyDigitalSignature: (documentData: Buffer, signature: DigitalSignature, publicKey: string) => Promise<{
    valid: boolean;
    timestamp: Date;
    signerInfo: Record<string, string>;
}>;
/**
 * Creates blockchain-anchored signature for tamper-proof verification.
 *
 * @param {Buffer} documentData - Document data
 * @param {DigitalSignature} signature - Digital signature
 * @returns {Promise<{ blockchainTxId: string; blockNumber: number; timestamp: Date }>} Blockchain anchor result
 *
 * @example
 * ```typescript
 * const anchor = await createBlockchainAnchoredSignature(document, signature);
 * console.log(`Anchored to blockchain: ${anchor.blockchainTxId}`);
 * ```
 */
export declare const createBlockchainAnchoredSignature: (documentData: Buffer, signature: DigitalSignature) => Promise<{
    blockchainTxId: string;
    blockNumber: number;
    timestamp: Date;
}>;
/**
 * Applies DRM protection to document.
 *
 * @param {Buffer} documentData - Document data
 * @param {DRMConfig} drmConfig - DRM configuration
 * @returns {Promise<{ protectedDocument: Buffer; drmId: string }>} DRM protection result
 *
 * @example
 * ```typescript
 * const protected = await applyDRMProtection(document, {
 *   id: 'drm1',
 *   protectionLevel: DRMProtectionLevel.ADVANCED,
 *   watermarkText: 'CONFIDENTIAL',
 *   dynamicWatermark: true,
 *   expirationDate: new Date('2025-12-31')
 * });
 * ```
 */
export declare const applyDRMProtection: (documentData: Buffer, drmConfig: DRMConfig) => Promise<{
    protectedDocument: Buffer;
    drmId: string;
}>;
/**
 * Adds dynamic watermark to document based on user context.
 *
 * @param {Buffer} documentData - Document data
 * @param {Object} context - User context for watermark
 * @param {string} context.userId - User ID
 * @param {string} context.userName - User name
 * @param {Date} context.accessTime - Access timestamp
 * @returns {Promise<Buffer>} Watermarked document
 *
 * @example
 * ```typescript
 * const watermarked = await addDynamicWatermark(document, {
 *   userId: 'user123',
 *   userName: 'Dr. Smith',
 *   accessTime: new Date()
 * });
 * ```
 */
export declare const addDynamicWatermark: (documentData: Buffer, context: {
    userId: string;
    userName: string;
    accessTime: Date;
}) => Promise<Buffer>;
/**
 * Enforces geofencing restrictions for document access.
 *
 * @param {string} documentId - Document ID
 * @param {GeofenceConfig} geofenceConfig - Geofencing configuration
 * @param {Object} accessContext - Access context
 * @param {string} accessContext.ipAddress - Client IP address
 * @param {string} [accessContext.country] - Client country
 * @returns {Promise<{ allowed: boolean; reason?: string }>} Geofence check result
 *
 * @example
 * ```typescript
 * const result = await enforceGeofencing('doc123', geofenceConfig, {
 *   ipAddress: '192.168.1.1',
 *   country: 'US'
 * });
 * ```
 */
export declare const enforceGeofencing: (documentId: string, geofenceConfig: GeofenceConfig, accessContext: {
    ipAddress: string;
    country?: string;
}) => Promise<{
    allowed: boolean;
    reason?: string;
}>;
/**
 * Rotates encryption keys for enhanced security.
 *
 * @param {string} oldKeyId - Old key ID
 * @param {Buffer} documentData - Document data encrypted with old key
 * @param {string} oldPassword - Old password
 * @param {string} newPassword - New password
 * @returns {Promise<{ encryptionResult: EncryptionResult; keyRotationId: string }>} Key rotation result
 *
 * @example
 * ```typescript
 * const rotated = await rotateEncryptionKeys('key1', encryptedDoc, 'oldPass', 'newPass');
 * ```
 */
export declare const rotateEncryptionKeys: (oldKeyId: string, documentData: Buffer, oldPassword: string, newPassword: string) => Promise<{
    encryptionResult: EncryptionResult;
    keyRotationId: string;
}>;
/**
 * Implements multi-factor authentication for document access.
 *
 * @param {string} userId - User ID
 * @param {string} documentId - Document ID
 * @param {string[]} factors - Authentication factors provided
 * @returns {Promise<{ authenticated: boolean; sessionToken?: string }>} MFA result
 *
 * @example
 * ```typescript
 * const auth = await implementMFAForAccess('user123', 'doc456', ['password', 'totp', 'biometric']);
 * ```
 */
export declare const implementMFAForAccess: (userId: string, documentId: string, factors: string[]) => Promise<{
    authenticated: boolean;
    sessionToken?: string;
}>;
/**
 * Generates secure sharing link with time-limited access.
 *
 * @param {string} documentId - Document ID
 * @param {Object} options - Sharing options
 * @param {number} options.expirationHours - Hours until link expires
 * @param {number} [options.maxAccessCount] - Maximum access count
 * @param {string} [options.password] - Optional password protection
 * @returns {Promise<{ shareLink: string; shareToken: string; expiresAt: Date }>} Sharing link
 *
 * @example
 * ```typescript
 * const share = await generateSecureSharingLink('doc123', {
 *   expirationHours: 24,
 *   maxAccessCount: 5,
 *   password: 'share123'
 * });
 * ```
 */
export declare const generateSecureSharingLink: (documentId: string, options: {
    expirationHours: number;
    maxAccessCount?: number;
    password?: string;
}) => Promise<{
    shareLink: string;
    shareToken: string;
    expiresAt: Date;
}>;
/**
 * Validates document integrity using cryptographic hash.
 *
 * @param {Buffer} documentData - Document data
 * @param {string} expectedHash - Expected hash value
 * @param {'sha256' | 'sha512'} algorithm - Hash algorithm
 * @returns {Promise<{ valid: boolean; actualHash: string }>} Integrity check result
 *
 * @example
 * ```typescript
 * const integrity = await validateDocumentIntegrity(document, expectedHash, 'sha512');
 * ```
 */
export declare const validateDocumentIntegrity: (documentData: Buffer, expectedHash: string, algorithm?: "sha256" | "sha512") => Promise<{
    valid: boolean;
    actualHash: string;
}>;
/**
 * Creates secure audit log for security events.
 *
 * @param {Object} event - Security event
 * @param {string} event.eventType - Event type
 * @param {string} event.userId - User ID
 * @param {string} event.documentId - Document ID
 * @param {string} event.action - Action performed
 * @param {boolean} event.success - Whether action succeeded
 * @returns {Promise<{ logId: string; timestamp: Date; hash: string }>} Audit log entry
 *
 * @example
 * ```typescript
 * const log = await createSecurityAuditLog({
 *   eventType: 'DECRYPTION_ATTEMPT',
 *   userId: 'user123',
 *   documentId: 'doc456',
 *   action: 'decrypt',
 *   success: true
 * });
 * ```
 */
export declare const createSecurityAuditLog: (event: {
    eventType: string;
    userId: string;
    documentId: string;
    action: string;
    success: boolean;
}) => Promise<{
    logId: string;
    timestamp: Date;
    hash: string;
}>;
/**
 * Implements role-based access control (RBAC).
 *
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @param {string} documentId - Document ID
 * @param {DocumentPermission} requestedPermission - Requested permission
 * @returns {Promise<{ granted: boolean; rolePermissions: DocumentPermission[] }>} RBAC check result
 *
 * @example
 * ```typescript
 * const access = await implementRBAC('user123', 'doctor', 'doc456', DocumentPermission.EDIT);
 * ```
 */
export declare const implementRBAC: (userId: string, role: string, documentId: string, requestedPermission: DocumentPermission) => Promise<{
    granted: boolean;
    rolePermissions: DocumentPermission[];
}>;
/**
 * Implements attribute-based access control (ABAC).
 *
 * @param {Record<string, any>} userAttributes - User attributes
 * @param {Record<string, any>} documentAttributes - Document attributes
 * @param {Record<string, any>} environmentAttributes - Environment attributes
 * @param {DocumentPermission} requestedPermission - Requested permission
 * @returns {Promise<{ granted: boolean; matchedPolicies: string[] }>} ABAC evaluation result
 *
 * @example
 * ```typescript
 * const access = await implementABAC(
 *   { role: 'doctor', department: 'cardiology' },
 *   { type: 'patient_record', department: 'cardiology' },
 *   { time: '09:00', location: 'hospital' },
 *   DocumentPermission.EDIT
 * );
 * ```
 */
export declare const implementABAC: (userAttributes: Record<string, any>, documentAttributes: Record<string, any>, environmentAttributes: Record<string, any>, requestedPermission: DocumentPermission) => Promise<{
    granted: boolean;
    matchedPolicies: string[];
}>;
/**
 * Sanitizes document metadata to remove sensitive information.
 *
 * @param {Record<string, any>} metadata - Document metadata
 * @param {string[]} sensitiveFields - Fields to sanitize
 * @returns {Promise<Record<string, any>>} Sanitized metadata
 *
 * @example
 * ```typescript
 * const clean = await sanitizeDocumentMetadata(metadata, ['author', 'creator', 'keywords']);
 * ```
 */
export declare const sanitizeDocumentMetadata: (metadata: Record<string, any>, sensitiveFields: string[]) => Promise<Record<string, any>>;
/**
 * Creates time-based one-time password (TOTP) for document access.
 *
 * @param {string} documentId - Document ID
 * @param {string} secret - Shared secret
 * @returns {Promise<{ totp: string; validUntil: Date }>} TOTP
 *
 * @example
 * ```typescript
 * const totp = await generateDocumentAccessTOTP('doc123', secret);
 * ```
 */
export declare const generateDocumentAccessTOTP: (documentId: string, secret: string) => Promise<{
    totp: string;
    validUntil: Date;
}>;
/**
 * Encrypts document with quantum-resistant algorithm.
 *
 * @param {Buffer} documentData - Document data
 * @param {string} publicKey - Quantum-resistant public key
 * @returns {Promise<EncryptionResult>} Quantum-resistant encryption result
 *
 * @example
 * ```typescript
 * const encrypted = await encryptWithQuantumResistant(document, quantumPublicKey);
 * ```
 */
export declare const encryptWithQuantumResistant: (documentData: Buffer, publicKey: string) => Promise<EncryptionResult>;
/**
 * Implements perfect forward secrecy for document encryption.
 *
 * @param {Buffer} documentData - Document data
 * @returns {Promise<{ encryptionResult: EncryptionResult; ephemeralKeyId: string }>} PFS encryption result
 *
 * @example
 * ```typescript
 * const pfs = await implementPerfectForwardSecrecy(document);
 * ```
 */
export declare const implementPerfectForwardSecrecy: (documentData: Buffer) => Promise<{
    encryptionResult: EncryptionResult;
    ephemeralKeyId: string;
}>;
/**
 * Validates certificate chain for digital signatures.
 *
 * @param {string} certificateChain - Certificate chain (PEM format)
 * @param {string} rootCA - Root CA certificate
 * @returns {Promise<{ valid: boolean; issuer: string; expiresAt: Date }>} Certificate validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCertificateChain(certChain, rootCA);
 * ```
 */
export declare const validateCertificateChain: (certificateChain: string, rootCA: string) => Promise<{
    valid: boolean;
    issuer: string;
    expiresAt: Date;
}>;
/**
 * Creates hardware security module (HSM) backed encryption.
 *
 * @param {Buffer} documentData - Document data
 * @param {string} hsmKeyId - HSM key identifier
 * @returns {Promise<EncryptionResult>} HSM-backed encryption result
 *
 * @example
 * ```typescript
 * const encrypted = await encryptWithHSM(document, 'hsm-key-123');
 * ```
 */
export declare const encryptWithHSM: (documentData: Buffer, hsmKeyId: string) => Promise<EncryptionResult>;
/**
 * Implements document expiration with automatic deletion.
 *
 * @param {string} documentId - Document ID
 * @param {Date} expirationDate - Expiration date
 * @param {boolean} autoDelete - Whether to auto-delete on expiration
 * @returns {Promise<{ scheduled: boolean; expiresAt: Date }>} Expiration schedule result
 *
 * @example
 * ```typescript
 * const schedule = await implementDocumentExpiration('doc123', new Date('2025-12-31'), true);
 * ```
 */
export declare const implementDocumentExpiration: (documentId: string, expirationDate: Date, autoDelete: boolean) => Promise<{
    scheduled: boolean;
    expiresAt: Date;
}>;
/**
 * Tracks and logs all encryption key usage.
 *
 * @param {string} keyId - Key identifier
 * @param {string} operation - Operation performed
 * @param {string} userId - User ID
 * @returns {Promise<{ logId: string; timestamp: Date }>} Key usage log
 *
 * @example
 * ```typescript
 * const log = await trackKeyUsage('key123', 'encrypt', 'user456');
 * ```
 */
export declare const trackKeyUsage: (keyId: string, operation: string, userId: string) => Promise<{
    logId: string;
    timestamp: Date;
}>;
/**
 * Generates compliance report for encryption and security controls.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>} Security compliance report
 *
 * @example
 * ```typescript
 * const report = await generateSecurityComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare const generateSecurityComplianceReport: (startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * Monitors real-time security threats and alerts.
 *
 * @param {string} documentId - Document ID
 * @param {Record<string, any>} activity - Activity data
 * @returns {Promise<{ threatDetected: boolean; threatLevel: string; actions: string[] }>} Threat monitoring result
 *
 * @example
 * ```typescript
 * const threat = await monitorSecurityThreats('doc123', activityData);
 * if (threat.threatDetected) {
 *   console.error(`Threat level: ${threat.threatLevel}`);
 * }
 * ```
 */
export declare const monitorSecurityThreats: (documentId: string, activity: Record<string, any>) => Promise<{
    threatDetected: boolean;
    threatLevel: string;
    actions: string[];
}>;
/**
 * Implements secure document sharing with end-to-end encryption.
 *
 * @param {Buffer} documentData - Document data
 * @param {string} recipientPublicKey - Recipient's public key
 * @param {string} senderPrivateKey - Sender's private key
 * @returns {Promise<{ encryptedDocument: Buffer; encryptedKey: Buffer; signature: string }>} E2E encrypted share
 *
 * @example
 * ```typescript
 * const shared = await implementE2ESharing(document, recipientPubKey, senderPrivKey);
 * ```
 */
export declare const implementE2ESharing: (documentData: Buffer, recipientPublicKey: string, senderPrivateKey: string) => Promise<{
    encryptedDocument: Buffer;
    encryptedKey: Buffer;
    signature: string;
}>;
/**
 * Validates password strength for encryption keys.
 *
 * @param {string} password - Password to validate
 * @returns {Promise<{ strong: boolean; score: number; suggestions: string[] }>} Password strength result
 *
 * @example
 * ```typescript
 * const strength = await validatePasswordStrength('MyP@ssw0rd123!');
 * if (!strength.strong) {
 *   console.log('Suggestions:', strength.suggestions);
 * }
 * ```
 */
export declare const validatePasswordStrength: (password: string) => Promise<{
    strong: boolean;
    score: number;
    suggestions: string[];
}>;
/**
 * Archives encryption keys securely for long-term storage.
 *
 * @param {string} keyId - Key ID to archive
 * @param {string} archiveLocation - Archive storage location
 * @returns {Promise<{ archiveId: string; archivedAt: Date }>} Archive result
 *
 * @example
 * ```typescript
 * const archive = await archiveEncryptionKeys('key123', 's3://key-archive/');
 * ```
 */
export declare const archiveEncryptionKeys: (keyId: string, archiveLocation: string) => Promise<{
    archiveId: string;
    archivedAt: Date;
}>;
/**
 * Implements biometric authentication for document access.
 *
 * @param {string} userId - User ID
 * @param {string} documentId - Document ID
 * @param {Buffer} biometricData - Biometric data (fingerprint, face, etc.)
 * @returns {Promise<{ authenticated: boolean; confidence: number }>} Biometric auth result
 *
 * @example
 * ```typescript
 * const auth = await implementBiometricAuth('user123', 'doc456', fingerprintData);
 * ```
 */
export declare const implementBiometricAuth: (userId: string, documentId: string, biometricData: Buffer) => Promise<{
    authenticated: boolean;
    confidence: number;
}>;
/**
 * Creates secure backup of encrypted documents with redundancy.
 *
 * @param {string} documentId - Document ID
 * @param {Buffer} encryptedData - Encrypted document data
 * @param {number} redundancyLevel - Number of backup copies
 * @returns {Promise<{ backupIds: string[]; locations: string[] }>} Backup result
 *
 * @example
 * ```typescript
 * const backup = await createSecureBackup('doc123', encrypted, 3);
 * ```
 */
export declare const createSecureBackup: (documentId: string, encryptedData: Buffer, redundancyLevel: number) => Promise<{
    backupIds: string[];
    locations: string[];
}>;
/**
 * Document Security Service
 * Production-ready NestJS service for document security operations
 */
export declare class DocumentSecurityService {
    /**
     * Encrypts and secures document with full DRM protection
     */
    secureDocument(documentData: Buffer, password: string, drmConfig: DRMConfig): Promise<{
        encrypted: EncryptionResult;
        protected: Buffer;
        drmId: string;
    }>;
}
declare const _default: {
    EncryptionConfigModel: typeof EncryptionConfigModel;
    PermissionSetModel: typeof PermissionSetModel;
    AccessControlPolicyModel: typeof AccessControlPolicyModel;
    DigitalSignatureModel: typeof DigitalSignatureModel;
    DRMConfigModel: typeof DRMConfigModel;
    encryptDocumentAES256: (documentData: Buffer, password: string, config?: Partial<EncryptionConfig>) => Promise<EncryptionResult>;
    decryptDocumentAES256: (encryptionResult: EncryptionResult, password: string) => Promise<Buffer>;
    generateRSAKeyPair: () => Promise<{
        publicKey: string;
        privateKey: string;
        keyId: string;
    }>;
    encryptWithRSA: (data: Buffer, publicKey: string) => Promise<Buffer>;
    decryptWithRSA: (encryptedData: Buffer, privateKey: string) => Promise<Buffer>;
    implementZeroKnowledgeEncryption: (documentData: Buffer, clientPassword: string) => Promise<EncryptionResult>;
    grantDocumentPermissions: (userId: string, documentId: string, permissions: DocumentPermission[], grantedBy: string, expiresAt?: Date) => Promise<PermissionSet>;
    revokeDocumentPermissions: (permissionSetId: string, revokedBy: string) => Promise<{
        revoked: boolean;
        timestamp: Date;
    }>;
    checkDocumentPermission: (userId: string, documentId: string, permission: DocumentPermission) => Promise<{
        hasPermission: boolean;
        reason?: string;
    }>;
    evaluateAccessControlPolicy: (policy: AccessControlPolicy, context: {
        userId: string;
        documentId: string;
        action: DocumentPermission;
    }) => Promise<{
        allowed: boolean;
        matchedRule?: AccessControlRule;
    }>;
    applyDocumentRedaction: (documentData: Buffer, redactionAreas: RedactionArea[], type: RedactionType) => Promise<{
        redactedDocument: Buffer;
        redactionCount: number;
    }>;
    autoRedactSensitiveData: (documentData: Buffer, categories: ("PII" | "PHI")[]) => Promise<{
        redactedDocument: Buffer;
        detectedPatterns: string[];
        redactionCount: number;
    }>;
    createDigitalSignature: (documentData: Buffer, privateKey: string, signerInfo: {
        signerId: string;
        signerName: string;
        signerEmail?: string;
    }, signatureType: SignatureType) => Promise<DigitalSignature>;
    verifyDigitalSignature: (documentData: Buffer, signature: DigitalSignature, publicKey: string) => Promise<{
        valid: boolean;
        timestamp: Date;
        signerInfo: Record<string, string>;
    }>;
    createBlockchainAnchoredSignature: (documentData: Buffer, signature: DigitalSignature) => Promise<{
        blockchainTxId: string;
        blockNumber: number;
        timestamp: Date;
    }>;
    applyDRMProtection: (documentData: Buffer, drmConfig: DRMConfig) => Promise<{
        protectedDocument: Buffer;
        drmId: string;
    }>;
    addDynamicWatermark: (documentData: Buffer, context: {
        userId: string;
        userName: string;
        accessTime: Date;
    }) => Promise<Buffer>;
    enforceGeofencing: (documentId: string, geofenceConfig: GeofenceConfig, accessContext: {
        ipAddress: string;
        country?: string;
    }) => Promise<{
        allowed: boolean;
        reason?: string;
    }>;
    rotateEncryptionKeys: (oldKeyId: string, documentData: Buffer, oldPassword: string, newPassword: string) => Promise<{
        encryptionResult: EncryptionResult;
        keyRotationId: string;
    }>;
    implementMFAForAccess: (userId: string, documentId: string, factors: string[]) => Promise<{
        authenticated: boolean;
        sessionToken?: string;
    }>;
    generateSecureSharingLink: (documentId: string, options: {
        expirationHours: number;
        maxAccessCount?: number;
        password?: string;
    }) => Promise<{
        shareLink: string;
        shareToken: string;
        expiresAt: Date;
    }>;
    validateDocumentIntegrity: (documentData: Buffer, expectedHash: string, algorithm?: "sha256" | "sha512") => Promise<{
        valid: boolean;
        actualHash: string;
    }>;
    createSecurityAuditLog: (event: {
        eventType: string;
        userId: string;
        documentId: string;
        action: string;
        success: boolean;
    }) => Promise<{
        logId: string;
        timestamp: Date;
        hash: string;
    }>;
    implementRBAC: (userId: string, role: string, documentId: string, requestedPermission: DocumentPermission) => Promise<{
        granted: boolean;
        rolePermissions: DocumentPermission[];
    }>;
    implementABAC: (userAttributes: Record<string, any>, documentAttributes: Record<string, any>, environmentAttributes: Record<string, any>, requestedPermission: DocumentPermission) => Promise<{
        granted: boolean;
        matchedPolicies: string[];
    }>;
    sanitizeDocumentMetadata: (metadata: Record<string, any>, sensitiveFields: string[]) => Promise<Record<string, any>>;
    generateDocumentAccessTOTP: (documentId: string, secret: string) => Promise<{
        totp: string;
        validUntil: Date;
    }>;
    encryptWithQuantumResistant: (documentData: Buffer, publicKey: string) => Promise<EncryptionResult>;
    implementPerfectForwardSecrecy: (documentData: Buffer) => Promise<{
        encryptionResult: EncryptionResult;
        ephemeralKeyId: string;
    }>;
    validateCertificateChain: (certificateChain: string, rootCA: string) => Promise<{
        valid: boolean;
        issuer: string;
        expiresAt: Date;
    }>;
    encryptWithHSM: (documentData: Buffer, hsmKeyId: string) => Promise<EncryptionResult>;
    implementDocumentExpiration: (documentId: string, expirationDate: Date, autoDelete: boolean) => Promise<{
        scheduled: boolean;
        expiresAt: Date;
    }>;
    trackKeyUsage: (keyId: string, operation: string, userId: string) => Promise<{
        logId: string;
        timestamp: Date;
    }>;
    generateSecurityComplianceReport: (startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    monitorSecurityThreats: (documentId: string, activity: Record<string, any>) => Promise<{
        threatDetected: boolean;
        threatLevel: string;
        actions: string[];
    }>;
    implementE2ESharing: (documentData: Buffer, recipientPublicKey: string, senderPrivateKey: string) => Promise<{
        encryptedDocument: Buffer;
        encryptedKey: Buffer;
        signature: string;
    }>;
    validatePasswordStrength: (password: string) => Promise<{
        strong: boolean;
        score: number;
        suggestions: string[];
    }>;
    archiveEncryptionKeys: (keyId: string, archiveLocation: string) => Promise<{
        archiveId: string;
        archivedAt: Date;
    }>;
    implementBiometricAuth: (userId: string, documentId: string, biometricData: Buffer) => Promise<{
        authenticated: boolean;
        confidence: number;
    }>;
    createSecureBackup: (documentId: string, encryptedData: Buffer, redundancyLevel: number) => Promise<{
        backupIds: string[];
        locations: string[];
    }>;
    DocumentSecurityService: typeof DocumentSecurityService;
};
export default _default;
//# sourceMappingURL=document-security-encryption-composite.d.ts.map