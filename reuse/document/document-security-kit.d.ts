/**
 * LOC: DOC-SEC-001
 * File: /reuse/document/document-security-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - pdf-lib
 *   - crypto (Node.js)
 *   - node-forge
 *
 * DOWNSTREAM (imported by):
 *   - Document security services
 *   - HIPAA compliance modules
 *   - Document encryption services
 *   - Audit logging services
 */
/**
 * File: /reuse/document/document-security-kit.ts
 * Locator: WC-UTL-DOCSEC-001
 * Purpose: Document Security & Permissions - Comprehensive security, encryption, and access control
 *
 * Upstream: @nestjs/common, sequelize, pdf-lib, crypto, node-forge
 * Downstream: Security services, compliance modules, encryption services, audit logging
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, pdf-lib 1.x, node-forge 1.x
 * Exports: 45 utility functions for encryption, passwords, permissions, redaction, HIPAA compliance
 *
 * LLM Context: Production-grade document security utilities for White Cross healthcare platform.
 * Provides AES-256 encryption, password protection, user/owner permissions, redaction, sanitization,
 * metadata removal, HIPAA compliance features, and comprehensive audit logging. Essential for securing
 * protected health information (PHI) and ensuring regulatory compliance in healthcare applications.
 */
import { Sequelize } from 'sequelize';
/**
 * Document encryption configuration
 */
export interface DocumentEncryptionConfig {
    algorithm?: 'AES-256' | 'AES-192' | 'AES-128';
    userPassword?: string;
    ownerPassword?: string;
    permissions?: PDFPermission[];
    keyDerivationRounds?: number;
    encryptMetadata?: boolean;
}
/**
 * PDF permission types
 */
export type PDFPermission = 'print' | 'modify' | 'copy' | 'annotate' | 'fill-forms' | 'extract' | 'assemble' | 'print-high-quality';
/**
 * Permission set configuration
 */
export interface PermissionSet {
    name: string;
    description?: string;
    permissions: PDFPermission[];
    allowPrinting?: boolean;
    allowModifying?: boolean;
    allowCopying?: boolean;
    allowAnnotations?: boolean;
}
/**
 * Redaction configuration
 */
export interface RedactionConfig {
    areas?: RedactionArea[];
    patterns?: RegExp[];
    replaceWith?: string;
    removeMetadata?: boolean;
    sanitizeText?: boolean;
}
/**
 * Redaction area coordinates
 */
export interface RedactionArea {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    reason?: string;
}
/**
 * Sanitization options
 */
export interface SanitizationOptions {
    removeJavaScript?: boolean;
    removeEmbeddedFiles?: boolean;
    removeExternalLinks?: boolean;
    removeForms?: boolean;
    removeAnnotations?: boolean;
    removeMetadata?: boolean;
    flattenTransparency?: boolean;
}
/**
 * Metadata removal configuration
 */
export interface MetadataRemovalConfig {
    removeAll?: boolean;
    preserveFields?: string[];
    removeCustomProperties?: boolean;
    removeXMP?: boolean;
    removeFileInfo?: boolean;
}
/**
 * HIPAA compliance configuration
 */
export interface HIPAAComplianceConfig {
    encryptionRequired: boolean;
    auditLoggingRequired: boolean;
    accessControlRequired: boolean;
    retentionPeriodDays?: number;
    autoRedactPHI?: boolean;
    requireDigitalSignature?: boolean;
}
/**
 * Audit log entry
 */
export interface AuditLogEntry {
    documentId: string;
    userId?: string;
    action: DocumentAction;
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
    details?: Record<string, any>;
    complianceLevel?: 'HIPAA' | 'GDPR' | 'SOC2';
}
/**
 * Document action types
 */
export type DocumentAction = 'view' | 'download' | 'print' | 'modify' | 'delete' | 'encrypt' | 'decrypt' | 'redact' | 'share' | 'export';
/**
 * Access control entry
 */
export interface AccessControlEntry {
    documentId: string;
    userId?: string;
    roleId?: string;
    permissions: PDFPermission[];
    expiresAt?: Date;
    conditions?: AccessCondition[];
}
/**
 * Access conditions
 */
export interface AccessCondition {
    type: 'ip-range' | 'time-window' | 'location' | 'device';
    value: any;
}
/**
 * Digital signature configuration
 */
export interface DigitalSignatureConfig {
    certificate: Buffer;
    privateKey: Buffer;
    reason?: string;
    location?: string;
    contactInfo?: string;
    signatureAppearance?: SignatureAppearance;
}
/**
 * Signature appearance
 */
export interface SignatureAppearance {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
    image?: Buffer;
}
/**
 * Encryption result
 */
export interface EncryptionResult {
    success: boolean;
    encryptedData?: Buffer;
    algorithm: string;
    keyId?: string;
    iv?: Buffer;
    error?: string;
}
/**
 * Decryption result
 */
export interface DecryptionResult {
    success: boolean;
    decryptedData?: Buffer;
    error?: string;
}
/**
 * Security audit result
 */
export interface SecurityAuditResult {
    documentId: string;
    isEncrypted: boolean;
    hasPassword: boolean;
    permissions: PDFPermission[];
    hasRedactions: boolean;
    metadataPresent: boolean;
    hipaaCompliant: boolean;
    vulnerabilities: string[];
    recommendations: string[];
    auditDate: Date;
}
/**
 * Document encryption attributes
 */
export interface DocumentEncryptionAttributes {
    id: string;
    documentId: string;
    algorithm: string;
    keyId: string;
    iv: string;
    encryptedAt: Date;
    encryptedBy?: string;
    expiresAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Document permission attributes
 */
export interface DocumentPermissionAttributes {
    id: string;
    documentId: string;
    userId?: string;
    roleId?: string;
    permissions: string[];
    grantedBy?: string;
    grantedAt: Date;
    expiresAt?: Date;
    conditions?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Document audit log attributes
 */
export interface DocumentAuditLogAttributes {
    id: string;
    documentId: string;
    userId?: string;
    action: string;
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
    details?: Record<string, any>;
    complianceLevel?: string;
    createdAt: Date;
}
/**
 * Document redaction attributes
 */
export interface DocumentRedactionAttributes {
    id: string;
    documentId: string;
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    reason?: string;
    redactedBy?: string;
    redactedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates DocumentEncryption model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentEncryptionAttributes>>} DocumentEncryption model
 *
 * @example
 * ```typescript
 * const EncryptionModel = createDocumentEncryptionModel(sequelize);
 * const encryption = await EncryptionModel.create({
 *   documentId: 'doc-123',
 *   algorithm: 'AES-256',
 *   keyId: 'key-456',
 *   iv: 'iv-789',
 *   encryptedBy: 'user-123'
 * });
 * ```
 */
export declare const createDocumentEncryptionModel: (sequelize: Sequelize) => any;
/**
 * Creates DocumentPermission model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentPermissionAttributes>>} DocumentPermission model
 *
 * @example
 * ```typescript
 * const PermissionModel = createDocumentPermissionModel(sequelize);
 * const permission = await PermissionModel.create({
 *   documentId: 'doc-123',
 *   userId: 'user-456',
 *   permissions: ['print', 'view'],
 *   grantedBy: 'admin-789'
 * });
 * ```
 */
export declare const createDocumentPermissionModel: (sequelize: Sequelize) => any;
/**
 * Creates DocumentAuditLog model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentAuditLogAttributes>>} DocumentAuditLog model
 *
 * @example
 * ```typescript
 * const AuditLogModel = createDocumentAuditLogModel(sequelize);
 * const log = await AuditLogModel.create({
 *   documentId: 'doc-123',
 *   userId: 'user-456',
 *   action: 'view',
 *   ipAddress: '192.168.1.1',
 *   complianceLevel: 'HIPAA'
 * });
 * ```
 */
export declare const createDocumentAuditLogModel: (sequelize: Sequelize) => any;
/**
 * Creates DocumentRedaction model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentRedactionAttributes>>} DocumentRedaction model
 *
 * @example
 * ```typescript
 * const RedactionModel = createDocumentRedactionModel(sequelize);
 * const redaction = await RedactionModel.create({
 *   documentId: 'doc-123',
 *   page: 1,
 *   x: 100,
 *   y: 200,
 *   width: 150,
 *   height: 20,
 *   reason: 'SSN redaction',
 *   redactedBy: 'user-456'
 * });
 * ```
 */
export declare const createDocumentRedactionModel: (sequelize: Sequelize) => any;
/**
 * 1. Encrypts document using AES-256.
 *
 * @param {Buffer} documentBuffer - Document buffer to encrypt
 * @param {string} password - Encryption password
 * @param {string} [algorithm] - Encryption algorithm
 * @returns {Promise<EncryptionResult>} Encryption result with metadata
 *
 * @example
 * ```typescript
 * const result = await encryptDocument(pdfBuffer, 'SecurePassword123!', 'AES-256');
 * if (result.success) {
 *   console.log('Encrypted with key ID:', result.keyId);
 * }
 * ```
 */
export declare const encryptDocument: (documentBuffer: Buffer, password: string, algorithm?: string) => Promise<EncryptionResult>;
/**
 * 2. Decrypts encrypted document.
 *
 * @param {Buffer} encryptedBuffer - Encrypted document buffer
 * @param {string} password - Decryption password
 * @param {Buffer} iv - Initialization vector
 * @param {string} [algorithm] - Encryption algorithm
 * @returns {Promise<DecryptionResult>} Decryption result
 *
 * @example
 * ```typescript
 * const result = await decryptDocument(encryptedBuffer, 'SecurePassword123!', ivBuffer);
 * if (result.success) {
 *   console.log('Document decrypted successfully');
 * }
 * ```
 */
export declare const decryptDocument: (encryptedBuffer: Buffer, password: string, iv: Buffer, algorithm?: string) => Promise<DecryptionResult>;
/**
 * 3. Encrypts PDF with user and owner passwords.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {DocumentEncryptionConfig} config - Encryption configuration
 * @returns {Promise<Buffer>} Encrypted PDF buffer
 *
 * @example
 * ```typescript
 * const encrypted = await encryptPDF(pdfBuffer, {
 *   userPassword: 'UserPass123',
 *   ownerPassword: 'OwnerPass456',
 *   permissions: ['print', 'copy'],
 *   algorithm: 'AES-256'
 * });
 * ```
 */
export declare const encryptPDF: (pdfBuffer: Buffer, config: DocumentEncryptionConfig) => Promise<Buffer>;
/**
 * 4. Generates secure encryption key.
 *
 * @param {number} [keyLength] - Key length in bytes
 * @returns {Buffer} Generated encryption key
 *
 * @example
 * ```typescript
 * const key = generateEncryptionKey(32); // 256-bit key
 * ```
 */
export declare const generateEncryptionKey: (keyLength?: number) => Buffer;
/**
 * 5. Derives key from password using PBKDF2.
 *
 * @param {string} password - Password
 * @param {string} [salt] - Salt for key derivation
 * @param {number} [iterations] - PBKDF2 iterations
 * @returns {Buffer} Derived key
 *
 * @example
 * ```typescript
 * const key = deriveKeyFromPassword('MyPassword123', 'salt', 100000);
 * ```
 */
export declare const deriveKeyFromPassword: (password: string, salt?: string, iterations?: number) => Buffer;
/**
 * 6. Rotates encryption key for document.
 *
 * @param {Buffer} encryptedBuffer - Current encrypted document
 * @param {string} oldPassword - Old password
 * @param {string} newPassword - New password
 * @param {Buffer} iv - Initialization vector
 * @returns {Promise<EncryptionResult>} Re-encryption result
 *
 * @example
 * ```typescript
 * const result = await rotateEncryptionKey(
 *   encryptedBuffer,
 *   'OldPassword',
 *   'NewPassword',
 *   ivBuffer
 * );
 * ```
 */
export declare const rotateEncryptionKey: (encryptedBuffer: Buffer, oldPassword: string, newPassword: string, iv: Buffer) => Promise<EncryptionResult>;
/**
 * 7. Sets user password for PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} userPassword - User password
 * @returns {Promise<Buffer>} Password-protected PDF
 *
 * @example
 * ```typescript
 * const protected = await setUserPassword(pdfBuffer, 'UserPassword123');
 * ```
 */
export declare const setUserPassword: (pdfBuffer: Buffer, userPassword: string) => Promise<Buffer>;
/**
 * 8. Sets owner password for PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} ownerPassword - Owner password
 * @returns {Promise<Buffer>} Owner-protected PDF
 *
 * @example
 * ```typescript
 * const protected = await setOwnerPassword(pdfBuffer, 'OwnerPassword456');
 * ```
 */
export declare const setOwnerPassword: (pdfBuffer: Buffer, ownerPassword: string) => Promise<Buffer>;
/**
 * 9. Sets both user and owner passwords.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} userPassword - User password
 * @param {string} ownerPassword - Owner password
 * @returns {Promise<Buffer>} Dual-password protected PDF
 *
 * @example
 * ```typescript
 * const protected = await setDualPasswords(pdfBuffer, 'User123', 'Owner456');
 * ```
 */
export declare const setDualPasswords: (pdfBuffer: Buffer, userPassword: string, ownerPassword: string) => Promise<Buffer>;
/**
 * 10. Validates password strength.
 *
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean; score: number; feedback: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePasswordStrength('MyPassword123!');
 * if (!validation.valid) {
 *   console.log('Feedback:', validation.feedback);
 * }
 * ```
 */
export declare const validatePasswordStrength: (password: string) => {
    valid: boolean;
    score: number;
    feedback: string[];
};
/**
 * 11. Removes password protection from PDF.
 *
 * @param {Buffer} pdfBuffer - Password-protected PDF
 * @param {string} password - Current password
 * @returns {Promise<Buffer>} Unprotected PDF
 *
 * @example
 * ```typescript
 * const unprotected = await removePasswordProtection(protectedPdf, 'Password123');
 * ```
 */
export declare const removePasswordProtection: (pdfBuffer: Buffer, password: string) => Promise<Buffer>;
/**
 * 12. Changes PDF password.
 *
 * @param {Buffer} pdfBuffer - Password-protected PDF
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Buffer>} PDF with new password
 *
 * @example
 * ```typescript
 * const updated = await changePassword(pdfBuffer, 'OldPass', 'NewPass');
 * ```
 */
export declare const changePassword: (pdfBuffer: Buffer, oldPassword: string, newPassword: string) => Promise<Buffer>;
/**
 * 13. Sets PDF permissions.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {PDFPermission[]} permissions - Allowed permissions
 * @param {string} [ownerPassword] - Owner password
 * @returns {Promise<Buffer>} PDF with permissions set
 *
 * @example
 * ```typescript
 * const restricted = await setPDFPermissions(pdfBuffer, [
 *   'print', 'copy'
 * ], 'OwnerPassword');
 * ```
 */
export declare const setPDFPermissions: (pdfBuffer: Buffer, permissions: PDFPermission[], ownerPassword?: string) => Promise<Buffer>;
/**
 * 14. Creates permission set for document.
 *
 * @param {string} name - Permission set name
 * @param {PDFPermission[]} permissions - Permissions to include
 * @returns {PermissionSet} Created permission set
 *
 * @example
 * ```typescript
 * const readOnly = createPermissionSet('read-only', ['print']);
 * ```
 */
export declare const createPermissionSet: (name: string, permissions: PDFPermission[]) => PermissionSet;
/**
 * 15. Applies permission set to PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {PermissionSet} permissionSet - Permission set to apply
 * @returns {Promise<Buffer>} PDF with permission set applied
 *
 * @example
 * ```typescript
 * const restricted = await applyPermissionSet(pdfBuffer, readOnlySet);
 * ```
 */
export declare const applyPermissionSet: (pdfBuffer: Buffer, permissionSet: PermissionSet) => Promise<Buffer>;
/**
 * 16. Grants user access to document.
 *
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @param {PDFPermission[]} permissions - Permissions to grant
 * @param {Date} [expiresAt] - Expiration date
 * @returns {Promise<AccessControlEntry>} Created access control entry
 *
 * @example
 * ```typescript
 * const access = await grantUserAccess(
 *   'doc-123',
 *   'user-456',
 *   ['print', 'view'],
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare const grantUserAccess: (documentId: string, userId: string, permissions: PDFPermission[], expiresAt?: Date) => Promise<AccessControlEntry>;
/**
 * 17. Revokes user access to document.
 *
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if revoked successfully
 *
 * @example
 * ```typescript
 * await revokeUserAccess('doc-123', 'user-456');
 * ```
 */
export declare const revokeUserAccess: (documentId: string, userId: string) => Promise<boolean>;
/**
 * 18. Checks if user has permission.
 *
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @param {PDFPermission} permission - Permission to check
 * @returns {Promise<boolean>} True if user has permission
 *
 * @example
 * ```typescript
 * const canPrint = await checkUserPermission('doc-123', 'user-456', 'print');
 * ```
 */
export declare const checkUserPermission: (documentId: string, userId: string, permission: PDFPermission) => Promise<boolean>;
/**
 * 19. Redacts areas in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {RedactionArea[]} areas - Areas to redact
 * @returns {Promise<Buffer>} Redacted PDF
 *
 * @example
 * ```typescript
 * const redacted = await redactPDFAreas(pdfBuffer, [
 *   { page: 0, x: 100, y: 200, width: 150, height: 20, reason: 'SSN' }
 * ]);
 * ```
 */
export declare const redactPDFAreas: (pdfBuffer: Buffer, areas: RedactionArea[]) => Promise<Buffer>;
/**
 * 20. Redacts text matching patterns.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {RegExp[]} patterns - Regex patterns to match
 * @returns {Promise<Buffer>} Redacted PDF
 *
 * @example
 * ```typescript
 * const redacted = await redactTextPatterns(pdfBuffer, [
 *   /\d{3}-\d{2}-\d{4}/, // SSN pattern
 *   /\d{16}/ // Credit card pattern
 * ]);
 * ```
 */
export declare const redactTextPatterns: (pdfBuffer: Buffer, patterns: RegExp[]) => Promise<Buffer>;
/**
 * 21. Auto-redacts PHI (Protected Health Information).
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} Redacted PDF
 *
 * @example
 * ```typescript
 * const redacted = await autoRedactPHI(pdfBuffer);
 * ```
 */
export declare const autoRedactPHI: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 22. Applies redaction configuration.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {RedactionConfig} config - Redaction configuration
 * @returns {Promise<Buffer>} Redacted PDF
 *
 * @example
 * ```typescript
 * const redacted = await applyRedactionConfig(pdfBuffer, {
 *   areas: [...],
 *   patterns: [/\d{3}-\d{2}-\d{4}/],
 *   removeMetadata: true
 * });
 * ```
 */
export declare const applyRedactionConfig: (pdfBuffer: Buffer, config: RedactionConfig) => Promise<Buffer>;
/**
 * 23. Sanitizes PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {SanitizationOptions} options - Sanitization options
 * @returns {Promise<Buffer>} Sanitized PDF
 *
 * @example
 * ```typescript
 * const sanitized = await sanitizePDF(pdfBuffer, {
 *   removeJavaScript: true,
 *   removeEmbeddedFiles: true,
 *   removeExternalLinks: true
 * });
 * ```
 */
export declare const sanitizePDF: (pdfBuffer: Buffer, options: SanitizationOptions) => Promise<Buffer>;
/**
 * 24. Removes JavaScript from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF without JavaScript
 *
 * @example
 * ```typescript
 * const cleaned = await removeJavaScript(pdfBuffer);
 * ```
 */
export declare const removeJavaScript: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 25. Removes embedded files from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF without embedded files
 *
 * @example
 * ```typescript
 * const cleaned = await removeEmbeddedFiles(pdfBuffer);
 * ```
 */
export declare const removeEmbeddedFiles: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 26. Removes external links from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF without external links
 *
 * @example
 * ```typescript
 * const cleaned = await removeExternalLinks(pdfBuffer);
 * ```
 */
export declare const removeExternalLinks: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 27. Flattens PDF forms.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF with flattened forms
 *
 * @example
 * ```typescript
 * const flattened = await flattenForms(pdfBuffer);
 * ```
 */
export declare const flattenForms: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 28. Removes all metadata from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF without metadata
 *
 * @example
 * ```typescript
 * const cleaned = await removeAllMetadata(pdfBuffer);
 * ```
 */
export declare const removeAllMetadata: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 29. Removes specific metadata fields.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string[]} fields - Metadata fields to remove
 * @returns {Promise<Buffer>} PDF with fields removed
 *
 * @example
 * ```typescript
 * const cleaned = await removeMetadataFields(pdfBuffer, ['Author', 'Creator']);
 * ```
 */
export declare const removeMetadataFields: (pdfBuffer: Buffer, fields: string[]) => Promise<Buffer>;
/**
 * 30. Removes XMP metadata.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF without XMP metadata
 *
 * @example
 * ```typescript
 * const cleaned = await removeXMPMetadata(pdfBuffer);
 * ```
 */
export declare const removeXMPMetadata: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 31. Removes file info metadata.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF without file info
 *
 * @example
 * ```typescript
 * const cleaned = await removeFileInfo(pdfBuffer);
 * ```
 */
export declare const removeFileInfo: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 32. Applies metadata removal configuration.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {MetadataRemovalConfig} config - Metadata removal configuration
 * @returns {Promise<Buffer>} PDF with metadata removed
 *
 * @example
 * ```typescript
 * const cleaned = await applyMetadataRemovalConfig(pdfBuffer, {
 *   removeAll: true,
 *   preserveFields: ['Title']
 * });
 * ```
 */
export declare const applyMetadataRemovalConfig: (pdfBuffer: Buffer, config: MetadataRemovalConfig) => Promise<Buffer>;
/**
 * 33. Ensures HIPAA compliance for document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {HIPAAComplianceConfig} config - HIPAA configuration
 * @returns {Promise<Buffer>} HIPAA-compliant PDF
 *
 * @example
 * ```typescript
 * const compliant = await ensureHIPAACompliance(pdfBuffer, {
 *   encryptionRequired: true,
 *   auditLoggingRequired: true,
 *   autoRedactPHI: true
 * });
 * ```
 */
export declare const ensureHIPAACompliance: (pdfBuffer: Buffer, config: HIPAAComplianceConfig) => Promise<Buffer>;
/**
 * 34. Validates HIPAA compliance.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Compliance validation
 *
 * @example
 * ```typescript
 * const validation = await validateHIPAACompliance(pdfBuffer);
 * if (!validation.compliant) {
 *   console.log('Issues:', validation.issues);
 * }
 * ```
 */
export declare const validateHIPAACompliance: (pdfBuffer: Buffer) => Promise<{
    compliant: boolean;
    issues: string[];
}>;
/**
 * 35. Generates HIPAA compliance report.
 *
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateHIPAAComplianceReport('doc-123');
 * ```
 */
export declare const generateHIPAAComplianceReport: (documentId: string) => Promise<{
    documentId: string;
    isCompliant: boolean;
    encryptionStatus: string;
    auditLogsPresent: boolean;
    phiRedacted: boolean;
    generatedAt: Date;
}>;
/**
 * 36. Logs document access event.
 *
 * @param {AuditLogEntry} entry - Audit log entry
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logDocumentAccess({
 *   documentId: 'doc-123',
 *   userId: 'user-456',
 *   action: 'view',
 *   timestamp: new Date(),
 *   ipAddress: '192.168.1.1',
 *   complianceLevel: 'HIPAA'
 * });
 * ```
 */
export declare const logDocumentAccess: (entry: AuditLogEntry) => Promise<void>;
/**
 * 37. Retrieves audit logs for document.
 *
 * @param {string} documentId - Document ID
 * @param {Object} [options] - Query options
 * @returns {Promise<AuditLogEntry[]>} Audit log entries
 *
 * @example
 * ```typescript
 * const logs = await getDocumentAuditLogs('doc-123', {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export declare const getDocumentAuditLogs: (documentId: string, options?: {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
}) => Promise<AuditLogEntry[]>;
/**
 * 38. Exports audit logs to file.
 *
 * @param {string} documentId - Document ID
 * @param {string} format - Export format (csv, json, pdf)
 * @returns {Promise<Buffer>} Exported audit logs
 *
 * @example
 * ```typescript
 * const csvLogs = await exportAuditLogs('doc-123', 'csv');
 * ```
 */
export declare const exportAuditLogs: (documentId: string, format: "csv" | "json" | "pdf") => Promise<Buffer>;
/**
 * 39. Generates audit trail report.
 *
 * @param {string} documentId - Document ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Object>} Audit trail report
 *
 * @example
 * ```typescript
 * const report = await generateAuditTrailReport(
 *   'doc-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare const generateAuditTrailReport: (documentId: string, startDate: Date, endDate: Date) => Promise<{
    documentId: string;
    totalAccess: number;
    uniqueUsers: number;
    actions: Record<string, number>;
    complianceViolations: number;
}>;
/**
 * 40. Signs PDF with digital signature.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {DigitalSignatureConfig} config - Signature configuration
 * @returns {Promise<Buffer>} Signed PDF
 *
 * @example
 * ```typescript
 * const signed = await signPDF(pdfBuffer, {
 *   certificate: certBuffer,
 *   privateKey: keyBuffer,
 *   reason: 'Document approval',
 *   location: 'New York, NY'
 * });
 * ```
 */
export declare const signPDF: (pdfBuffer: Buffer, config: DigitalSignatureConfig) => Promise<Buffer>;
/**
 * 41. Verifies PDF digital signature.
 *
 * @param {Buffer} pdfBuffer - Signed PDF buffer
 * @returns {Promise<{ valid: boolean; signer?: string; signedAt?: Date }>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyPDFSignature(signedPdf);
 * if (verification.valid) {
 *   console.log('Signed by:', verification.signer);
 * }
 * ```
 */
export declare const verifyPDFSignature: (pdfBuffer: Buffer) => Promise<{
    valid: boolean;
    signer?: string;
    signedAt?: Date;
}>;
/**
 * 42. Adds timestamp to PDF signature.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} timestampServerUrl - Timestamp server URL
 * @returns {Promise<Buffer>} Timestamped PDF
 *
 * @example
 * ```typescript
 * const timestamped = await addTimestampToSignature(
 *   signedPdf,
 *   'https://timestamp.example.com'
 * );
 * ```
 */
export declare const addTimestampToSignature: (pdfBuffer: Buffer, timestampServerUrl: string) => Promise<Buffer>;
/**
 * 43. Performs comprehensive security audit.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} documentId - Document ID
 * @returns {Promise<SecurityAuditResult>} Security audit result
 *
 * @example
 * ```typescript
 * const audit = await performSecurityAudit(pdfBuffer, 'doc-123');
 * console.log('HIPAA Compliant:', audit.hipaaCompliant);
 * ```
 */
export declare const performSecurityAudit: (pdfBuffer: Buffer, documentId: string) => Promise<SecurityAuditResult>;
/**
 * 44. Detects security vulnerabilities.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<string[]>} List of detected vulnerabilities
 *
 * @example
 * ```typescript
 * const vulnerabilities = await detectSecurityVulnerabilities(pdfBuffer);
 * ```
 */
export declare const detectSecurityVulnerabilities: (pdfBuffer: Buffer) => Promise<string[]>;
/**
 * 45. Generates security recommendations.
 *
 * @param {SecurityAuditResult} auditResult - Security audit result
 * @returns {string[]} Security recommendations
 *
 * @example
 * ```typescript
 * const recommendations = generateSecurityRecommendations(auditResult);
 * console.log('Recommendations:', recommendations);
 * ```
 */
export declare const generateSecurityRecommendations: (auditResult: SecurityAuditResult) => string[];
declare const _default: {
    encryptDocument: (documentBuffer: Buffer, password: string, algorithm?: string) => Promise<EncryptionResult>;
    decryptDocument: (encryptedBuffer: Buffer, password: string, iv: Buffer, algorithm?: string) => Promise<DecryptionResult>;
    encryptPDF: (pdfBuffer: Buffer, config: DocumentEncryptionConfig) => Promise<Buffer>;
    generateEncryptionKey: (keyLength?: number) => Buffer;
    deriveKeyFromPassword: (password: string, salt?: string, iterations?: number) => Buffer;
    rotateEncryptionKey: (encryptedBuffer: Buffer, oldPassword: string, newPassword: string, iv: Buffer) => Promise<EncryptionResult>;
    setUserPassword: (pdfBuffer: Buffer, userPassword: string) => Promise<Buffer>;
    setOwnerPassword: (pdfBuffer: Buffer, ownerPassword: string) => Promise<Buffer>;
    setDualPasswords: (pdfBuffer: Buffer, userPassword: string, ownerPassword: string) => Promise<Buffer>;
    validatePasswordStrength: (password: string) => {
        valid: boolean;
        score: number;
        feedback: string[];
    };
    removePasswordProtection: (pdfBuffer: Buffer, password: string) => Promise<Buffer>;
    changePassword: (pdfBuffer: Buffer, oldPassword: string, newPassword: string) => Promise<Buffer>;
    setPDFPermissions: (pdfBuffer: Buffer, permissions: PDFPermission[], ownerPassword?: string) => Promise<Buffer>;
    createPermissionSet: (name: string, permissions: PDFPermission[]) => PermissionSet;
    applyPermissionSet: (pdfBuffer: Buffer, permissionSet: PermissionSet) => Promise<Buffer>;
    grantUserAccess: (documentId: string, userId: string, permissions: PDFPermission[], expiresAt?: Date) => Promise<AccessControlEntry>;
    revokeUserAccess: (documentId: string, userId: string) => Promise<boolean>;
    checkUserPermission: (documentId: string, userId: string, permission: PDFPermission) => Promise<boolean>;
    redactPDFAreas: (pdfBuffer: Buffer, areas: RedactionArea[]) => Promise<Buffer>;
    redactTextPatterns: (pdfBuffer: Buffer, patterns: RegExp[]) => Promise<Buffer>;
    autoRedactPHI: (pdfBuffer: Buffer) => Promise<Buffer>;
    applyRedactionConfig: (pdfBuffer: Buffer, config: RedactionConfig) => Promise<Buffer>;
    sanitizePDF: (pdfBuffer: Buffer, options: SanitizationOptions) => Promise<Buffer>;
    removeJavaScript: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeEmbeddedFiles: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeExternalLinks: (pdfBuffer: Buffer) => Promise<Buffer>;
    flattenForms: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeAllMetadata: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeMetadataFields: (pdfBuffer: Buffer, fields: string[]) => Promise<Buffer>;
    removeXMPMetadata: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeFileInfo: (pdfBuffer: Buffer) => Promise<Buffer>;
    applyMetadataRemovalConfig: (pdfBuffer: Buffer, config: MetadataRemovalConfig) => Promise<Buffer>;
    ensureHIPAACompliance: (pdfBuffer: Buffer, config: HIPAAComplianceConfig) => Promise<Buffer>;
    validateHIPAACompliance: (pdfBuffer: Buffer) => Promise<{
        compliant: boolean;
        issues: string[];
    }>;
    generateHIPAAComplianceReport: (documentId: string) => Promise<{
        documentId: string;
        isCompliant: boolean;
        encryptionStatus: string;
        auditLogsPresent: boolean;
        phiRedacted: boolean;
        generatedAt: Date;
    }>;
    logDocumentAccess: (entry: AuditLogEntry) => Promise<void>;
    getDocumentAuditLogs: (documentId: string, options?: {
        startDate?: Date;
        endDate?: Date;
        userId?: string;
    }) => Promise<AuditLogEntry[]>;
    exportAuditLogs: (documentId: string, format: "csv" | "json" | "pdf") => Promise<Buffer>;
    generateAuditTrailReport: (documentId: string, startDate: Date, endDate: Date) => Promise<{
        documentId: string;
        totalAccess: number;
        uniqueUsers: number;
        actions: Record<string, number>;
        complianceViolations: number;
    }>;
    signPDF: (pdfBuffer: Buffer, config: DigitalSignatureConfig) => Promise<Buffer>;
    verifyPDFSignature: (pdfBuffer: Buffer) => Promise<{
        valid: boolean;
        signer?: string;
        signedAt?: Date;
    }>;
    addTimestampToSignature: (pdfBuffer: Buffer, timestampServerUrl: string) => Promise<Buffer>;
    performSecurityAudit: (pdfBuffer: Buffer, documentId: string) => Promise<SecurityAuditResult>;
    detectSecurityVulnerabilities: (pdfBuffer: Buffer) => Promise<string[]>;
    generateSecurityRecommendations: (auditResult: SecurityAuditResult) => string[];
};
export default _default;
//# sourceMappingURL=document-security-kit.d.ts.map