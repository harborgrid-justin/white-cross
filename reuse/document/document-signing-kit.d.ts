/**
 * LOC: DOC-SIGN-001
 * File: /reuse/document/document-signing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - node-forge
 *   - pdf-lib
 *   - crypto (Node.js)
 *   - sequelize (v6.x)
 *   - jsrsasign
 *
 * DOWNSTREAM (imported by):
 *   - Document signing controllers
 *   - Digital signature services
 *   - Certificate management modules
 *   - Healthcare compliance services
 */
/**
 * File: /reuse/document/document-signing-kit.ts
 * Locator: WC-UTL-DOCSIGN-001
 * Purpose: Digital Signatures & Certificates Kit - PDF signing, certificate management, PKI integration, signature verification
 *
 * Upstream: @nestjs/common, node-forge, pdf-lib, crypto, sequelize, jsrsasign
 * Downstream: Signing controllers, certificate services, PKI modules, compliance handlers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, node-forge 1.3.x, pdf-lib 1.17.x
 * Exports: 40 utility functions for digital signatures, certificates, PKI, timestamps, verification, compliance
 *
 * LLM Context: Production-grade digital signature utilities for White Cross healthcare platform.
 * Provides PDF digital signatures, X.509 certificate management, PKI infrastructure integration,
 * timestamp authority support, signature appearance customization, multiple signature handling,
 * signature validation, HIPAA/eIDAS compliance, certificate chains, revocation checking (OCSP/CRL),
 * and audit logging. Essential for legally binding medical documents, consent forms, and healthcare records.
 */
import { Sequelize } from 'sequelize';
/**
 * Digital signature algorithm types
 */
export type SignatureAlgorithm = 'RSA' | 'ECDSA' | 'DSA' | 'EdDSA';
/**
 * Hash algorithm for signatures
 */
export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512' | 'SHA-1';
/**
 * Certificate key usage flags
 */
export type KeyUsage = 'digitalSignature' | 'nonRepudiation' | 'keyEncipherment' | 'dataEncipherment' | 'keyAgreement' | 'keyCertSign' | 'cRLSign';
/**
 * Digital signature configuration
 */
export interface SignatureConfig {
    algorithm: SignatureAlgorithm;
    hashAlgorithm: HashAlgorithm;
    certificate: string | Buffer;
    privateKey: string | Buffer;
    password?: string;
    reason?: string;
    location?: string;
    contactInfo?: string;
    timestamp?: boolean;
    timestampServer?: string;
    appearance?: SignatureAppearance;
}
/**
 * Signature appearance configuration
 */
export interface SignatureAppearance {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    showSignerName?: boolean;
    showDate?: boolean;
    showReason?: boolean;
    showLocation?: boolean;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    image?: Buffer;
    text?: string;
    fontSize?: number;
    fontColor?: string;
}
/**
 * X.509 Certificate information
 */
export interface CertificateInfo {
    subject: {
        commonName: string;
        organization?: string;
        organizationalUnit?: string;
        locality?: string;
        state?: string;
        country?: string;
        email?: string;
    };
    issuer: {
        commonName: string;
        organization?: string;
        country?: string;
    };
    serialNumber: string;
    validFrom: Date;
    validTo: Date;
    publicKey: string;
    keyUsage?: KeyUsage[];
    subjectAltNames?: string[];
    fingerprint: string;
    algorithm: string;
}
/**
 * Certificate creation request
 */
export interface CertificateRequest {
    subject: CertificateInfo['subject'];
    keySize?: number;
    validityDays?: number;
    keyUsage?: KeyUsage[];
    extendedKeyUsage?: string[];
    subjectAltNames?: string[];
}
/**
 * PKI (Public Key Infrastructure) configuration
 */
export interface PKIConfig {
    caUrl?: string;
    caCertificate?: string | Buffer;
    ocspUrl?: string;
    crlUrl?: string;
    timestampUrl?: string;
    strictValidation?: boolean;
}
/**
 * Signature verification result
 */
export interface SignatureVerification {
    valid: boolean;
    signedBy: string;
    signedAt: Date;
    certificateValid: boolean;
    certificateChainValid?: boolean;
    timestampValid?: boolean;
    documentIntact: boolean;
    revocationStatus?: 'valid' | 'revoked' | 'unknown';
    errors?: string[];
    warnings?: string[];
    signatureData?: {
        algorithm: string;
        hashAlgorithm: string;
        reason?: string;
        location?: string;
    };
}
/**
 * Timestamp token information
 */
export interface TimestampToken {
    timestamp: Date;
    serialNumber: string;
    authority: string;
    hashAlgorithm: string;
    messageImprint: string;
    accuracy?: string;
    certificate?: CertificateInfo;
}
/**
 * Multiple signature information
 */
export interface MultiSignatureInfo {
    signatureCount: number;
    signatures: Array<{
        name: string;
        signedAt: Date;
        valid: boolean;
        fieldName: string;
    }>;
    allValid: boolean;
}
/**
 * Certificate chain
 */
export interface CertificateChain {
    certificate: CertificateInfo;
    issuerCertificate?: CertificateInfo;
    rootCertificate?: CertificateInfo;
    intermediates?: CertificateInfo[];
    valid: boolean;
    trustAnchor?: string;
}
/**
 * Certificate revocation status
 */
export interface RevocationStatus {
    revoked: boolean;
    revokedAt?: Date;
    reason?: string;
    checkedVia: 'OCSP' | 'CRL' | 'CACHE';
    checkedAt: Date;
    nextUpdate?: Date;
}
/**
 * Signature audit log entry
 */
export interface SignatureAuditLog {
    documentId: string;
    signatureId: string;
    action: 'signed' | 'verified' | 'revoked';
    performedBy: string;
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
    details?: Record<string, any>;
}
/**
 * Long-term validation (LTV) data
 */
export interface LTVData {
    documentHash: string;
    signatures: Array<{
        signatureHash: string;
        certificate: string;
        timestamp: Date;
        revocationData?: string;
    }>;
    archiveTimestamp?: Date;
    validationData?: Buffer;
}
/**
 * Digital signature model attributes
 */
export interface DigitalSignatureAttributes {
    id: string;
    documentId: string;
    signedBy: string;
    signerName: string;
    signerEmail?: string;
    certificateId?: string;
    certificateSerialNumber: string;
    signatureAlgorithm: string;
    hashAlgorithm: string;
    signatureData: Buffer;
    reason?: string;
    location?: string;
    contactInfo?: string;
    signedAt: Date;
    timestampToken?: string;
    appearance?: Record<string, any>;
    fieldName?: string;
    isValid: boolean;
    verifiedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Certificate model attributes
 */
export interface CertificateAttributes {
    id: string;
    serialNumber: string;
    subjectCommonName: string;
    subjectOrganization?: string;
    subjectEmail?: string;
    issuerCommonName: string;
    issuerOrganization?: string;
    publicKey: string;
    privateKey?: string;
    certificatePem: string;
    validFrom: Date;
    validTo: Date;
    fingerprint: string;
    keyUsage?: string[];
    isCA: boolean;
    isRevoked: boolean;
    revokedAt?: Date;
    revocationReason?: string;
    ownerId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Signature audit log model attributes
 */
export interface SignatureAuditLogAttributes {
    id: string;
    documentId: string;
    signatureId?: string;
    action: string;
    performedBy: string;
    ipAddress?: string;
    userAgent?: string;
    details?: Record<string, any>;
    timestamp: Date;
    createdAt: Date;
}
/**
 * Creates DigitalSignature model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DigitalSignatureAttributes>>} DigitalSignature model
 *
 * @example
 * ```typescript
 * const SignatureModel = createDigitalSignatureModel(sequelize);
 * const signature = await SignatureModel.create({
 *   documentId: 'doc-uuid',
 *   signedBy: 'user-uuid',
 *   signerName: 'Dr. John Doe',
 *   certificateSerialNumber: '1234567890',
 *   signatureAlgorithm: 'RSA',
 *   hashAlgorithm: 'SHA-256',
 *   signedAt: new Date()
 * });
 * ```
 */
export declare const createDigitalSignatureModel: (sequelize: Sequelize) => any;
/**
 * Creates Certificate model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<CertificateAttributes>>} Certificate model
 *
 * @example
 * ```typescript
 * const CertModel = createCertificateModel(sequelize);
 * const cert = await CertModel.create({
 *   serialNumber: '1234567890',
 *   subjectCommonName: 'Dr. John Doe',
 *   issuerCommonName: 'WhiteCross CA',
 *   publicKey: '...',
 *   certificatePem: '-----BEGIN CERTIFICATE-----...',
 *   validFrom: new Date(),
 *   validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
 * });
 * ```
 */
export declare const createCertificateModel: (sequelize: Sequelize) => any;
/**
 * Creates SignatureAuditLog model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<SignatureAuditLogAttributes>>} SignatureAuditLog model
 *
 * @example
 * ```typescript
 * const AuditModel = createSignatureAuditLogModel(sequelize);
 * const log = await AuditModel.create({
 *   documentId: 'doc-uuid',
 *   signatureId: 'sig-uuid',
 *   action: 'signed',
 *   performedBy: 'user-uuid',
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const createSignatureAuditLogModel: (sequelize: Sequelize) => any;
/**
 * 1. Generates RSA key pair for signing.
 *
 * @param {number} [keySize] - Key size in bits (default: 2048)
 * @returns {Promise<{ publicKey: string; privateKey: string }>} Key pair in PEM format
 *
 * @example
 * ```typescript
 * const keys = await generateKeyPair(4096);
 * console.log('Public key:', keys.publicKey);
 * ```
 */
export declare const generateKeyPair: (keySize?: number) => Promise<{
    publicKey: string;
    privateKey: string;
}>;
/**
 * 2. Signs PDF document with digital signature.
 *
 * @param {Buffer} pdfBuffer - PDF document to sign
 * @param {SignatureConfig} config - Signature configuration
 * @returns {Promise<Buffer>} Signed PDF buffer
 *
 * @example
 * ```typescript
 * const signedPdf = await signPdfDocument(pdfBuffer, {
 *   algorithm: 'RSA',
 *   hashAlgorithm: 'SHA-256',
 *   certificate: certPem,
 *   privateKey: keyPem,
 *   reason: 'Medical consent approval',
 *   location: 'San Francisco, CA'
 * });
 * ```
 */
export declare const signPdfDocument: (pdfBuffer: Buffer, config: SignatureConfig) => Promise<Buffer>;
/**
 * 3. Creates detached signature for document.
 *
 * @param {Buffer} documentBuffer - Document to sign
 * @param {string} privateKey - Private key in PEM format
 * @param {HashAlgorithm} [hashAlgorithm] - Hash algorithm
 * @returns {Promise<Buffer>} Detached signature
 *
 * @example
 * ```typescript
 * const signature = await createDetachedSignature(documentBuffer, privateKeyPem, 'SHA-256');
 * ```
 */
export declare const createDetachedSignature: (documentBuffer: Buffer, privateKey: string, hashAlgorithm?: HashAlgorithm) => Promise<Buffer>;
/**
 * 4. Adds visible signature to PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document
 * @param {SignatureAppearance} appearance - Signature appearance
 * @param {SignatureConfig} config - Signature configuration
 * @returns {Promise<Buffer>} PDF with visible signature
 *
 * @example
 * ```typescript
 * const signedPdf = await addVisibleSignature(pdfBuffer, {
 *   page: 1,
 *   x: 100,
 *   y: 100,
 *   width: 200,
 *   height: 80,
 *   showSignerName: true,
 *   showDate: true,
 *   text: 'Signed by Dr. John Doe'
 * }, signatureConfig);
 * ```
 */
export declare const addVisibleSignature: (pdfBuffer: Buffer, appearance: SignatureAppearance, config: SignatureConfig) => Promise<Buffer>;
/**
 * 5. Creates PKCS#7 signature container.
 *
 * @param {Buffer} data - Data to sign
 * @param {string} certificate - Certificate in PEM format
 * @param {string} privateKey - Private key in PEM format
 * @returns {Promise<Buffer>} PKCS#7 signature
 *
 * @example
 * ```typescript
 * const pkcs7 = await createPKCS7Signature(documentHash, certPem, keyPem);
 * ```
 */
export declare const createPKCS7Signature: (data: Buffer, certificate: string, privateKey: string) => Promise<Buffer>;
/**
 * 6. Signs document with timestamp.
 *
 * @param {Buffer} pdfBuffer - PDF document
 * @param {SignatureConfig} config - Signature configuration with timestamp
 * @returns {Promise<Buffer>} Timestamped signed PDF
 *
 * @example
 * ```typescript
 * const signedPdf = await signWithTimestamp(pdfBuffer, {
 *   ...signatureConfig,
 *   timestamp: true,
 *   timestampServer: 'http://timestamp.digicert.com'
 * });
 * ```
 */
export declare const signWithTimestamp: (pdfBuffer: Buffer, config: SignatureConfig) => Promise<Buffer>;
/**
 * 7. Creates signature hash for document.
 *
 * @param {Buffer} documentBuffer - Document to hash
 * @param {HashAlgorithm} algorithm - Hash algorithm
 * @returns {string} Hex-encoded hash
 *
 * @example
 * ```typescript
 * const hash = createSignatureHash(documentBuffer, 'SHA-256');
 * ```
 */
export declare const createSignatureHash: (documentBuffer: Buffer, algorithm: HashAlgorithm) => string;
/**
 * 8. Signs multiple documents in batch.
 *
 * @param {Buffer[]} documents - Array of documents to sign
 * @param {SignatureConfig} config - Signature configuration
 * @returns {Promise<Buffer[]>} Array of signed documents
 *
 * @example
 * ```typescript
 * const signedDocs = await batchSignDocuments([pdf1, pdf2, pdf3], signatureConfig);
 * ```
 */
export declare const batchSignDocuments: (documents: Buffer[], config: SignatureConfig) => Promise<Buffer[]>;
/**
 * 9. Verifies PDF digital signature.
 *
 * @param {Buffer} pdfBuffer - Signed PDF document
 * @returns {Promise<SignatureVerification>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyPdfSignature(signedPdf);
 * if (verification.valid) {
 *   console.log('Signed by:', verification.signedBy);
 * }
 * ```
 */
export declare const verifyPdfSignature: (pdfBuffer: Buffer) => Promise<SignatureVerification>;
/**
 * 10. Verifies detached signature.
 *
 * @param {Buffer} documentBuffer - Original document
 * @param {Buffer} signatureBuffer - Detached signature
 * @param {string} publicKey - Public key in PEM format
 * @param {HashAlgorithm} [hashAlgorithm] - Hash algorithm used
 * @returns {Promise<boolean>} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = await verifyDetachedSignature(documentBuffer, signatureBuffer, publicKeyPem);
 * ```
 */
export declare const verifyDetachedSignature: (documentBuffer: Buffer, signatureBuffer: Buffer, publicKey: string, hashAlgorithm?: HashAlgorithm) => Promise<boolean>;
/**
 * 11. Verifies certificate chain validity.
 *
 * @param {string} certificate - Certificate in PEM format
 * @param {string[]} [chain] - Intermediate certificates
 * @param {string} [rootCA] - Root CA certificate
 * @returns {Promise<{ valid: boolean; errors?: string[] }>} Chain verification result
 *
 * @example
 * ```typescript
 * const result = await verifyCertificateChain(userCert, [intermediateCert], rootCACert);
 * ```
 */
export declare const verifyCertificateChain: (certificate: string, chain?: string[], rootCA?: string) => Promise<{
    valid: boolean;
    errors?: string[];
}>;
/**
 * 12. Validates certificate expiration.
 *
 * @param {CertificateInfo} certificate - Certificate information
 * @returns {boolean} True if certificate is currently valid
 *
 * @example
 * ```typescript
 * const isValid = validateCertificateExpiration(certInfo);
 * ```
 */
export declare const validateCertificateExpiration: (certificate: CertificateInfo) => boolean;
/**
 * 13. Verifies document integrity after signing.
 *
 * @param {Buffer} originalBuffer - Original document
 * @param {Buffer} signedBuffer - Signed document
 * @returns {Promise<boolean>} True if document was not modified
 *
 * @example
 * ```typescript
 * const intact = await verifyDocumentIntegrity(originalPdf, signedPdf);
 * ```
 */
export declare const verifyDocumentIntegrity: (originalBuffer: Buffer, signedBuffer: Buffer) => Promise<boolean>;
/**
 * 14. Verifies multiple signatures on document.
 *
 * @param {Buffer} pdfBuffer - PDF with multiple signatures
 * @returns {Promise<MultiSignatureInfo>} Multiple signature verification
 *
 * @example
 * ```typescript
 * const info = await verifyMultipleSignatures(multiSignedPdf);
 * console.log(`${info.signatureCount} signatures, all valid: ${info.allValid}`);
 * ```
 */
export declare const verifyMultipleSignatures: (pdfBuffer: Buffer) => Promise<MultiSignatureInfo>;
/**
 * 15. Validates signature timestamp.
 *
 * @param {string} timestampToken - RFC 3161 timestamp token
 * @returns {Promise<{ valid: boolean; timestamp: Date; authority: string }>} Timestamp validation
 *
 * @example
 * ```typescript
 * const result = await validateTimestamp(timestampToken);
 * console.log('Signed at:', result.timestamp);
 * ```
 */
export declare const validateTimestamp: (timestampToken: string) => Promise<{
    valid: boolean;
    timestamp: Date;
    authority: string;
}>;
/**
 * 16. Creates self-signed certificate.
 *
 * @param {CertificateRequest} request - Certificate request
 * @param {string} privateKey - Private key for certificate
 * @returns {Promise<string>} Certificate in PEM format
 *
 * @example
 * ```typescript
 * const cert = await createSelfSignedCertificate({
 *   subject: {
 *     commonName: 'Dr. John Doe',
 *     organization: 'WhiteCross Medical',
 *     country: 'US'
 *   },
 *   validityDays: 365
 * }, privateKey);
 * ```
 */
export declare const createSelfSignedCertificate: (request: CertificateRequest, privateKey: string) => Promise<string>;
/**
 * 17. Parses X.509 certificate.
 *
 * @param {string | Buffer} certificate - Certificate in PEM or DER format
 * @returns {Promise<CertificateInfo>} Parsed certificate information
 *
 * @example
 * ```typescript
 * const info = await parseCertificate(certPem);
 * console.log('Subject:', info.subject.commonName);
 * console.log('Valid until:', info.validTo);
 * ```
 */
export declare const parseCertificate: (certificate: string | Buffer) => Promise<CertificateInfo>;
/**
 * 18. Extracts public key from certificate.
 *
 * @param {string} certificate - Certificate in PEM format
 * @returns {Promise<string>} Public key in PEM format
 *
 * @example
 * ```typescript
 * const publicKey = await extractPublicKey(certPem);
 * ```
 */
export declare const extractPublicKey: (certificate: string) => Promise<string>;
/**
 * 19. Calculates certificate fingerprint.
 *
 * @param {string} certificate - Certificate in PEM format
 * @param {HashAlgorithm} [algorithm] - Hash algorithm
 * @returns {Promise<string>} Fingerprint in hex format
 *
 * @example
 * ```typescript
 * const fingerprint = await calculateCertificateFingerprint(certPem, 'SHA-256');
 * ```
 */
export declare const calculateCertificateFingerprint: (certificate: string, algorithm?: HashAlgorithm) => Promise<string>;
/**
 * 20. Validates certificate key usage.
 *
 * @param {CertificateInfo} certificate - Certificate information
 * @param {KeyUsage} requiredUsage - Required key usage
 * @returns {boolean} True if certificate has required usage
 *
 * @example
 * ```typescript
 * const canSign = validateCertificateKeyUsage(certInfo, 'digitalSignature');
 * ```
 */
export declare const validateCertificateKeyUsage: (certificate: CertificateInfo, requiredUsage: KeyUsage) => boolean;
/**
 * 21. Renews expiring certificate.
 *
 * @param {string} certificate - Expiring certificate
 * @param {string} privateKey - Private key
 * @param {number} [validityDays] - Validity period in days
 * @returns {Promise<string>} Renewed certificate
 *
 * @example
 * ```typescript
 * const renewed = await renewCertificate(oldCert, privateKey, 365);
 * ```
 */
export declare const renewCertificate: (certificate: string, privateKey: string, validityDays?: number) => Promise<string>;
/**
 * 22. Revokes certificate.
 *
 * @param {string} certificateSerialNumber - Certificate serial number
 * @param {string} reason - Revocation reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeCertificate('1234567890', 'Key compromise');
 * ```
 */
export declare const revokeCertificate: (certificateSerialNumber: string, reason: string) => Promise<void>;
/**
 * 23. Exports certificate to PKCS#12 format.
 *
 * @param {string} certificate - Certificate in PEM format
 * @param {string} privateKey - Private key in PEM format
 * @param {string} password - Password for PKCS#12
 * @returns {Promise<Buffer>} PKCS#12 bundle
 *
 * @example
 * ```typescript
 * const p12 = await exportToPKCS12(cert, key, 'password123');
 * await fs.writeFile('certificate.p12', p12);
 * ```
 */
export declare const exportToPKCS12: (certificate: string, privateKey: string, password: string) => Promise<Buffer>;
/**
 * 24. Requests certificate from Certificate Authority.
 *
 * @param {CertificateRequest} request - Certificate signing request
 * @param {PKIConfig} pkiConfig - PKI configuration
 * @returns {Promise<string>} Issued certificate
 *
 * @example
 * ```typescript
 * const cert = await requestCertificateFromCA(csrData, {
 *   caUrl: 'https://ca.whitecross.com',
 *   caCertificate: rootCert
 * });
 * ```
 */
export declare const requestCertificateFromCA: (request: CertificateRequest, pkiConfig: PKIConfig) => Promise<string>;
/**
 * 25. Checks certificate revocation via OCSP.
 *
 * @param {string} certificate - Certificate to check
 * @param {string} issuerCertificate - Issuer certificate
 * @param {string} ocspUrl - OCSP responder URL
 * @returns {Promise<RevocationStatus>} Revocation status
 *
 * @example
 * ```typescript
 * const status = await checkOCSPRevocation(cert, issuerCert, 'http://ocsp.example.com');
 * if (status.revoked) {
 *   console.log('Certificate revoked on:', status.revokedAt);
 * }
 * ```
 */
export declare const checkOCSPRevocation: (certificate: string, issuerCertificate: string, ocspUrl: string) => Promise<RevocationStatus>;
/**
 * 26. Checks certificate revocation via CRL.
 *
 * @param {string} certificate - Certificate to check
 * @param {string} crlUrl - CRL distribution point URL
 * @returns {Promise<RevocationStatus>} Revocation status
 *
 * @example
 * ```typescript
 * const status = await checkCRLRevocation(cert, 'http://crl.example.com/ca.crl');
 * ```
 */
export declare const checkCRLRevocation: (certificate: string, crlUrl: string) => Promise<RevocationStatus>;
/**
 * 27. Builds certificate chain to root CA.
 *
 * @param {string} certificate - End-entity certificate
 * @param {PKIConfig} pkiConfig - PKI configuration
 * @returns {Promise<CertificateChain>} Certificate chain
 *
 * @example
 * ```typescript
 * const chain = await buildCertificateChain(userCert, pkiConfig);
 * console.log('Chain length:', chain.intermediates?.length);
 * ```
 */
export declare const buildCertificateChain: (certificate: string, pkiConfig: PKIConfig) => Promise<CertificateChain>;
/**
 * 28. Validates certificate against PKI policy.
 *
 * @param {CertificateInfo} certificate - Certificate to validate
 * @param {PKIConfig} pkiConfig - PKI configuration
 * @returns {Promise<{ valid: boolean; errors?: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateAgainstPKIPolicy(certInfo, pkiConfig);
 * ```
 */
export declare const validateAgainstPKIPolicy: (certificate: CertificateInfo, pkiConfig: PKIConfig) => Promise<{
    valid: boolean;
    errors?: string[];
}>;
/**
 * 29. Requests RFC 3161 timestamp.
 *
 * @param {Buffer} data - Data to timestamp
 * @param {string} tsaUrl - Timestamp authority URL
 * @returns {Promise<TimestampToken>} Timestamp token
 *
 * @example
 * ```typescript
 * const token = await requestTimestamp(documentHash, 'http://timestamp.digicert.com');
 * console.log('Timestamp:', token.timestamp);
 * ```
 */
export declare const requestTimestamp: (data: Buffer, tsaUrl: string) => Promise<TimestampToken>;
/**
 * 30. Verifies timestamp token.
 *
 * @param {TimestampToken} token - Timestamp token
 * @param {Buffer} originalData - Original data that was timestamped
 * @returns {Promise<boolean>} True if timestamp is valid
 *
 * @example
 * ```typescript
 * const valid = await verifyTimestampToken(token, documentHash);
 * ```
 */
export declare const verifyTimestampToken: (token: TimestampToken, originalData: Buffer) => Promise<boolean>;
/**
 * 31. Extracts timestamp from signed document.
 *
 * @param {Buffer} signedPdf - Signed PDF with timestamp
 * @returns {Promise<TimestampToken | null>} Timestamp token if present
 *
 * @example
 * ```typescript
 * const timestamp = await extractTimestamp(signedPdf);
 * if (timestamp) {
 *   console.log('Document timestamped at:', timestamp.timestamp);
 * }
 * ```
 */
export declare const extractTimestamp: (signedPdf: Buffer) => Promise<TimestampToken | null>;
/**
 * 32. Creates custom signature appearance.
 *
 * @param {SignatureAppearance} config - Appearance configuration
 * @returns {Promise<Buffer>} Signature appearance image
 *
 * @example
 * ```typescript
 * const appearance = await createSignatureAppearance({
 *   page: 1,
 *   x: 100,
 *   y: 100,
 *   width: 200,
 *   height: 80,
 *   text: 'Digitally signed by Dr. John Doe',
 *   showDate: true
 * });
 * ```
 */
export declare const createSignatureAppearance: (config: SignatureAppearance) => Promise<Buffer>;
/**
 * 33. Adds signature image to PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document
 * @param {Buffer} signatureImage - Signature image
 * @param {SignatureAppearance} position - Position configuration
 * @returns {Promise<Buffer>} PDF with signature image
 *
 * @example
 * ```typescript
 * const pdfWithSig = await addSignatureImage(pdfBuffer, signatureImg, {
 *   page: 1,
 *   x: 100,
 *   y: 100,
 *   width: 200,
 *   height: 80
 * });
 * ```
 */
export declare const addSignatureImage: (pdfBuffer: Buffer, signatureImage: Buffer, position: SignatureAppearance) => Promise<Buffer>;
/**
 * 34. Generates QR code for signature verification.
 *
 * @param {string} signatureId - Signature identifier
 * @param {string} verificationUrl - URL for verification
 * @returns {Promise<Buffer>} QR code image
 *
 * @example
 * ```typescript
 * const qrCode = await generateSignatureQRCode('sig-123', 'https://verify.whitecross.com/sig-123');
 * ```
 */
export declare const generateSignatureQRCode: (signatureId: string, verificationUrl: string) => Promise<Buffer>;
/**
 * 35. Creates signature audit log entry.
 *
 * @param {SignatureAuditLog} log - Audit log data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createSignatureAuditLog({
 *   documentId: 'doc-123',
 *   signatureId: 'sig-456',
 *   action: 'signed',
 *   performedBy: 'user-789',
 *   timestamp: new Date(),
 *   ipAddress: '192.168.1.1'
 * });
 * ```
 */
export declare const createSignatureAuditLog: (log: SignatureAuditLog) => Promise<void>;
/**
 * 36. Validates signature for HIPAA compliance.
 *
 * @param {SignatureVerification} verification - Signature verification result
 * @returns {{ compliant: boolean; issues?: string[] }} HIPAA compliance result
 *
 * @example
 * ```typescript
 * const compliance = validateHIPAACompliance(verificationResult);
 * if (!compliance.compliant) {
 *   console.error('HIPAA issues:', compliance.issues);
 * }
 * ```
 */
export declare const validateHIPAACompliance: (verification: SignatureVerification) => {
    compliant: boolean;
    issues?: string[];
};
/**
 * 37. Generates signature compliance report.
 *
 * @param {string} documentId - Document identifier
 * @param {SignatureVerification[]} verifications - Signature verifications
 * @returns {Promise<string>} Compliance report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport('doc-123', [verification1, verification2]);
 * ```
 */
export declare const generateComplianceReport: (documentId: string, verifications: SignatureVerification[]) => Promise<string>;
/**
 * 38. Creates long-term validation (LTV) data.
 *
 * @param {Buffer} signedPdf - Signed PDF document
 * @param {PKIConfig} pkiConfig - PKI configuration
 * @returns {Promise<LTVData>} LTV data for archival
 *
 * @example
 * ```typescript
 * const ltvData = await createLTVData(signedPdf, pkiConfig);
 * // Store LTV data for long-term signature validation
 * ```
 */
export declare const createLTVData: (signedPdf: Buffer, pkiConfig: PKIConfig) => Promise<LTVData>;
/**
 * 39. Validates long-term signature.
 *
 * @param {LTVData} ltvData - Long-term validation data
 * @param {Buffer} document - Original document
 * @returns {Promise<{ valid: boolean; archiveTimestamp: Date }>} LTV validation result
 *
 * @example
 * ```typescript
 * const validation = await validateLongTermSignature(ltvData, documentBuffer);
 * console.log('Archive timestamp:', validation.archiveTimestamp);
 * ```
 */
export declare const validateLongTermSignature: (ltvData: LTVData, document: Buffer) => Promise<{
    valid: boolean;
    archiveTimestamp: Date;
}>;
/**
 * 40. Archives signed document with compliance metadata.
 *
 * @param {Buffer} signedDocument - Signed document
 * @param {SignatureVerification[]} verifications - Signature verifications
 * @param {Record<string, any>} metadata - Additional metadata
 * @returns {Promise<string>} Archive identifier
 *
 * @example
 * ```typescript
 * const archiveId = await archiveSignedDocument(signedPdf, verifications, {
 *   patientId: 'patient-123',
 *   documentType: 'consent-form',
 *   retentionPeriod: 7 // years
 * });
 * ```
 */
export declare const archiveSignedDocument: (signedDocument: Buffer, verifications: SignatureVerification[], metadata: Record<string, any>) => Promise<string>;
declare const _default: {
    createDigitalSignatureModel: (sequelize: Sequelize) => any;
    createCertificateModel: (sequelize: Sequelize) => any;
    createSignatureAuditLogModel: (sequelize: Sequelize) => any;
    generateKeyPair: (keySize?: number) => Promise<{
        publicKey: string;
        privateKey: string;
    }>;
    signPdfDocument: (pdfBuffer: Buffer, config: SignatureConfig) => Promise<Buffer>;
    createDetachedSignature: (documentBuffer: Buffer, privateKey: string, hashAlgorithm?: HashAlgorithm) => Promise<Buffer>;
    addVisibleSignature: (pdfBuffer: Buffer, appearance: SignatureAppearance, config: SignatureConfig) => Promise<Buffer>;
    createPKCS7Signature: (data: Buffer, certificate: string, privateKey: string) => Promise<Buffer>;
    signWithTimestamp: (pdfBuffer: Buffer, config: SignatureConfig) => Promise<Buffer>;
    createSignatureHash: (documentBuffer: Buffer, algorithm: HashAlgorithm) => string;
    batchSignDocuments: (documents: Buffer[], config: SignatureConfig) => Promise<Buffer[]>;
    verifyPdfSignature: (pdfBuffer: Buffer) => Promise<SignatureVerification>;
    verifyDetachedSignature: (documentBuffer: Buffer, signatureBuffer: Buffer, publicKey: string, hashAlgorithm?: HashAlgorithm) => Promise<boolean>;
    verifyCertificateChain: (certificate: string, chain?: string[], rootCA?: string) => Promise<{
        valid: boolean;
        errors?: string[];
    }>;
    validateCertificateExpiration: (certificate: CertificateInfo) => boolean;
    verifyDocumentIntegrity: (originalBuffer: Buffer, signedBuffer: Buffer) => Promise<boolean>;
    verifyMultipleSignatures: (pdfBuffer: Buffer) => Promise<MultiSignatureInfo>;
    validateTimestamp: (timestampToken: string) => Promise<{
        valid: boolean;
        timestamp: Date;
        authority: string;
    }>;
    createSelfSignedCertificate: (request: CertificateRequest, privateKey: string) => Promise<string>;
    parseCertificate: (certificate: string | Buffer) => Promise<CertificateInfo>;
    extractPublicKey: (certificate: string) => Promise<string>;
    calculateCertificateFingerprint: (certificate: string, algorithm?: HashAlgorithm) => Promise<string>;
    validateCertificateKeyUsage: (certificate: CertificateInfo, requiredUsage: KeyUsage) => boolean;
    renewCertificate: (certificate: string, privateKey: string, validityDays?: number) => Promise<string>;
    revokeCertificate: (certificateSerialNumber: string, reason: string) => Promise<void>;
    exportToPKCS12: (certificate: string, privateKey: string, password: string) => Promise<Buffer>;
    requestCertificateFromCA: (request: CertificateRequest, pkiConfig: PKIConfig) => Promise<string>;
    checkOCSPRevocation: (certificate: string, issuerCertificate: string, ocspUrl: string) => Promise<RevocationStatus>;
    checkCRLRevocation: (certificate: string, crlUrl: string) => Promise<RevocationStatus>;
    buildCertificateChain: (certificate: string, pkiConfig: PKIConfig) => Promise<CertificateChain>;
    validateAgainstPKIPolicy: (certificate: CertificateInfo, pkiConfig: PKIConfig) => Promise<{
        valid: boolean;
        errors?: string[];
    }>;
    requestTimestamp: (data: Buffer, tsaUrl: string) => Promise<TimestampToken>;
    verifyTimestampToken: (token: TimestampToken, originalData: Buffer) => Promise<boolean>;
    extractTimestamp: (signedPdf: Buffer) => Promise<TimestampToken | null>;
    createSignatureAppearance: (config: SignatureAppearance) => Promise<Buffer>;
    addSignatureImage: (pdfBuffer: Buffer, signatureImage: Buffer, position: SignatureAppearance) => Promise<Buffer>;
    generateSignatureQRCode: (signatureId: string, verificationUrl: string) => Promise<Buffer>;
    createSignatureAuditLog: (log: SignatureAuditLog) => Promise<void>;
    validateHIPAACompliance: (verification: SignatureVerification) => {
        compliant: boolean;
        issues?: string[];
    };
    generateComplianceReport: (documentId: string, verifications: SignatureVerification[]) => Promise<string>;
    createLTVData: (signedPdf: Buffer, pkiConfig: PKIConfig) => Promise<LTVData>;
    validateLongTermSignature: (ltvData: LTVData, document: Buffer) => Promise<{
        valid: boolean;
        archiveTimestamp: Date;
    }>;
    archiveSignedDocument: (signedDocument: Buffer, verifications: SignatureVerification[], metadata: Record<string, any>) => Promise<string>;
};
export default _default;
//# sourceMappingURL=document-signing-kit.d.ts.map