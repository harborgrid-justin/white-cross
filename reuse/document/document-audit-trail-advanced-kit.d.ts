/**
 * LOC: DOC-AUDIT-ADV-001
 * File: /reuse/document/document-audit-trail-advanced-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - crypto (Node.js)
 *   - merkletreejs
 *   - ethers (blockchain)
 *   - sharp (image forensics)
 *
 * DOWNSTREAM (imported by):
 *   - Document audit controllers
 *   - Forensic analysis services
 *   - Tamper detection modules
 *   - Chain of custody handlers
 *   - Evidence preservation services
 *   - Compliance reporting modules
 */
/**
 * File: /reuse/document/document-audit-trail-advanced-kit.ts
 * Locator: WC-UTL-DOCAUDIT-001
 * Purpose: Forensic-Grade Audit Trail Kit - Blockchain audit, forensic analysis, tamper detection, chain of custody
 *
 * Upstream: @nestjs/common, sequelize, crypto, merkletreejs, ethers, sharp
 * Downstream: Audit controllers, forensic services, tamper detection modules, custody handlers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, merkletreejs 0.3.x, ethers 6.x
 * Exports: 40 utility functions for blockchain auditing, forensic analysis, tamper detection, chain of custody
 *
 * LLM Context: Production-grade forensic audit trail utilities for White Cross healthcare platform.
 * Provides blockchain-based immutable audit logs, forensic document analysis, tamper detection,
 * cryptographic chain of custody, evidence preservation, digital fingerprinting, hash chain verification,
 * metadata extraction, anomaly detection, audit trail reconstruction, compliance reporting, and
 * forensic-grade evidence handling. Essential for regulatory compliance, legal proceedings, security
 * investigations, and maintaining HIPAA audit trail requirements for medical documents.
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Audit trail event types
 */
export type AuditEventType = 'created' | 'accessed' | 'modified' | 'deleted' | 'signed' | 'verified' | 'exported' | 'printed' | 'shared' | 'archived';
/**
 * Forensic analysis types
 */
export type ForensicAnalysisType = 'metadata' | 'digital_fingerprint' | 'content_analysis' | 'image_forensics' | 'pdf_analysis' | 'signature_analysis';
/**
 * Tamper detection severity levels
 */
export type TamperSeverity = 'none' | 'low' | 'medium' | 'high' | 'critical';
/**
 * Chain of custody status
 */
export type CustodyStatus = 'acquired' | 'transferred' | 'analyzed' | 'stored' | 'disposed';
/**
 * Evidence preservation methods
 */
export type PreservationMethod = 'hash' | 'blockchain' | 'encryption' | 'immutable_storage' | 'cold_storage';
/**
 * Blockchain audit log entry
 */
export interface BlockchainAuditEntry {
    blockNumber: number;
    transactionHash: string;
    timestamp: Date;
    documentId: string;
    eventType: AuditEventType;
    userId: string;
    dataHash: string;
    previousHash?: string;
    merkleRoot?: string;
    metadata?: Record<string, any>;
}
/**
 * Forensic analysis result
 */
export interface ForensicAnalysisResult {
    documentId: string;
    analysisType: ForensicAnalysisType;
    timestamp: Date;
    findings: Array<{
        category: string;
        description: string;
        severity: TamperSeverity;
        evidence?: string;
    }>;
    metadata: {
        fileSize: number;
        mimeType: string;
        createDate?: Date;
        modifyDate?: Date;
        author?: string;
        software?: string;
    };
    digitalFingerprint: string;
    integrityScore: number;
    anomaliesDetected: number;
}
/**
 * Tamper detection result
 */
export interface TamperDetectionResult {
    tampered: boolean;
    severity: TamperSeverity;
    confidence: number;
    detectedAt: Date;
    tamperedSections?: Array<{
        location: string;
        type: string;
        description: string;
    }>;
    originalHash?: string;
    currentHash?: string;
    hashAlgorithm: string;
    verificationMethod: string;
}
/**
 * Chain of custody record
 */
export interface ChainOfCustodyRecord {
    id: string;
    documentId: string;
    evidenceId: string;
    custodian: string;
    custodianOrg: string;
    status: CustodyStatus;
    acquiredFrom?: string;
    transferredTo?: string;
    location: string;
    timestamp: Date;
    purpose: string;
    integrityHash: string;
    witnessedBy?: string[];
    notes?: string;
}
/**
 * Evidence preservation package
 */
export interface EvidencePreservationPackage {
    preservationId: string;
    documentId: string;
    method: PreservationMethod;
    preservedAt: Date;
    preservedBy: string;
    expiresAt?: Date;
    encryptionKey?: string;
    storageLocation: string;
    hashChain: string[];
    merkleRoot?: string;
    blockchainAnchored?: boolean;
    metadata: Record<string, any>;
    verificationData: {
        originalHash: string;
        algorithm: string;
        signature?: string;
    };
}
/**
 * Audit trail query filters
 */
export interface AuditTrailFilters {
    documentId?: string;
    userId?: string;
    eventType?: AuditEventType[];
    startDate?: Date;
    endDate?: Date;
    ipAddress?: string;
    includeBlockchain?: boolean;
}
/**
 * Forensic timeline entry
 */
export interface ForensicTimelineEntry {
    timestamp: Date;
    eventType: string;
    description: string;
    actor: string;
    evidence: string[];
    hash: string;
    verified: boolean;
}
/**
 * Merkle tree proof
 */
export interface MerkleProof {
    leaf: string;
    root: string;
    proof: Array<{
        position: 'left' | 'right';
        data: string;
    }>;
    verified: boolean;
}
/**
 * Digital fingerprint data
 */
export interface DigitalFingerprint {
    documentId: string;
    sha256: string;
    sha512: string;
    md5: string;
    ssdeep?: string;
    perceptualHash?: string;
    fileSize: number;
    pageCount?: number;
    createdAt: Date;
    metadata: Record<string, any>;
}
/**
 * Anomaly detection result
 */
export interface AnomalyDetectionResult {
    anomalyDetected: boolean;
    anomalyType: string;
    confidence: number;
    description: string;
    location?: string;
    expectedValue?: any;
    actualValue?: any;
    timestamp: Date;
}
/**
 * Audit trail reconstruction data
 */
export interface AuditTrailReconstruction {
    documentId: string;
    timeline: ForensicTimelineEntry[];
    integrityVerified: boolean;
    gapsDetected: boolean;
    tamperedEntries: number;
    reconstructionScore: number;
    warnings: string[];
}
/**
 * AuditTrail model attributes
 */
export interface AuditTrailAttributes {
    id: string;
    documentId: string;
    eventType: AuditEventType;
    userId: string;
    userName: string;
    userRole?: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
    previousHash?: string;
    currentHash: string;
    hashAlgorithm: string;
    blockchainTxHash?: string;
    blockchainBlockNumber?: number;
    merkleRoot?: string;
    merkleProof?: Record<string, any>;
    eventData?: Record<string, any>;
    location?: string;
    deviceInfo?: Record<string, any>;
    verified: boolean;
    verifiedAt?: Date;
    tampered: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * ForensicEvidence model attributes
 */
export interface ForensicEvidenceAttributes {
    id: string;
    documentId: string;
    evidenceType: ForensicAnalysisType;
    collectedBy: string;
    collectedAt: Date;
    digitalFingerprint: string;
    sha256Hash: string;
    sha512Hash: string;
    md5Hash: string;
    fileSize: number;
    mimeType: string;
    metadata: Record<string, any>;
    extractedData?: Record<string, any>;
    analysisResults?: Record<string, any>;
    anomaliesDetected: number;
    integrityScore: number;
    tamperSeverity: TamperSeverity;
    chainOfCustodyId?: string;
    preservationMethod: PreservationMethod;
    storageLocation: string;
    encrypted: boolean;
    encryptionKey?: string;
    expiresAt?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * TamperDetection model attributes
 */
export interface TamperDetectionAttributes {
    id: string;
    documentId: string;
    detectionMethod: string;
    tampered: boolean;
    severity: TamperSeverity;
    confidence: number;
    detectedAt: Date;
    detectedBy: string;
    originalHash: string;
    currentHash: string;
    hashAlgorithm: string;
    tamperedSections?: Record<string, any>[];
    evidenceId?: string;
    verificationData?: Record<string, any>;
    falsePositive: boolean;
    investigatedBy?: string;
    investigatedAt?: Date;
    resolution?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates AuditTrail model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AuditTrailAttributes>>} AuditTrail model
 *
 * @example
 * ```typescript
 * const AuditModel = createAuditTrailModel(sequelize);
 * const audit = await AuditModel.create({
 *   documentId: 'doc-uuid',
 *   eventType: 'modified',
 *   userId: 'user-uuid',
 *   userName: 'Dr. John Doe',
 *   currentHash: 'sha256-hash',
 *   hashAlgorithm: 'SHA-256',
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const createAuditTrailModel: (sequelize: Sequelize) => any;
/**
 * Creates ForensicEvidence model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ForensicEvidenceAttributes>>} ForensicEvidence model
 *
 * @example
 * ```typescript
 * const EvidenceModel = createForensicEvidenceModel(sequelize);
 * const evidence = await EvidenceModel.create({
 *   documentId: 'doc-uuid',
 *   evidenceType: 'digital_fingerprint',
 *   collectedBy: 'forensic-analyst-id',
 *   digitalFingerprint: 'unique-fingerprint',
 *   sha256Hash: 'hash-value',
 *   fileSize: 1024000,
 *   mimeType: 'application/pdf'
 * });
 * ```
 */
export declare const createForensicEvidenceModel: (sequelize: Sequelize) => any;
/**
 * Creates TamperDetection model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<TamperDetectionAttributes>>} TamperDetection model
 *
 * @example
 * ```typescript
 * const TamperModel = createTamperDetectionModel(sequelize);
 * const detection = await TamperModel.create({
 *   documentId: 'doc-uuid',
 *   detectionMethod: 'hash_comparison',
 *   tampered: true,
 *   severity: 'high',
 *   confidence: 0.95,
 *   originalHash: 'original-hash',
 *   currentHash: 'current-hash'
 * });
 * ```
 */
export declare const createTamperDetectionModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates immutable blockchain audit log entry.
 *
 * @param {BlockchainAuditEntry} entry - Audit entry data
 * @param {any} auditModel - AuditTrail Sequelize model
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<any>} Created audit log entry
 *
 * @example
 * ```typescript
 * const auditEntry = await createBlockchainAuditLog({
 *   documentId: 'doc-123',
 *   eventType: 'modified',
 *   userId: 'user-456',
 *   dataHash: 'sha256-hash',
 *   timestamp: new Date()
 * }, AuditTrailModel);
 * ```
 */
export declare const createBlockchainAuditLog: (entry: Omit<BlockchainAuditEntry, "blockNumber" | "transactionHash">, auditModel: any, transaction?: Transaction) => Promise<any>;
/**
 * 2. Anchors audit trail to blockchain network.
 *
 * @param {string} documentId - Document identifier
 * @param {string} merkleRoot - Merkle root hash
 * @param {any} auditModel - AuditTrail Sequelize model
 * @returns {Promise<{ txHash: string; blockNumber: number }>} Blockchain transaction info
 *
 * @example
 * ```typescript
 * const blockchain = await anchorToBlockchain('doc-123', merkleRoot, AuditTrailModel);
 * console.log('Anchored at block:', blockchain.blockNumber);
 * ```
 */
export declare const anchorToBlockchain: (documentId: string, merkleRoot: string, auditModel: any) => Promise<{
    txHash: string;
    blockNumber: number;
}>;
/**
 * 3. Builds Merkle tree from audit trail entries.
 *
 * @param {string} documentId - Document identifier
 * @param {any} auditModel - AuditTrail Sequelize model
 * @returns {Promise<{ root: string; leaves: string[]; tree: any }>} Merkle tree data
 *
 * @example
 * ```typescript
 * const merkleTree = await buildAuditMerkleTree('doc-123', AuditTrailModel);
 * console.log('Merkle root:', merkleTree.root);
 * ```
 */
export declare const buildAuditMerkleTree: (documentId: string, auditModel: any) => Promise<{
    root: string;
    leaves: string[];
    tree: any;
}>;
/**
 * 4. Verifies audit chain integrity using hash chain.
 *
 * @param {string} documentId - Document identifier
 * @param {any} auditModel - AuditTrail Sequelize model
 * @returns {Promise<{ valid: boolean; brokenChain: number[]; totalEntries: number }>} Chain integrity result
 *
 * @example
 * ```typescript
 * const integrity = await verifyAuditChainIntegrity('doc-123', AuditTrailModel);
 * if (!integrity.valid) {
 *   console.log('Broken chain at entries:', integrity.brokenChain);
 * }
 * ```
 */
export declare const verifyAuditChainIntegrity: (documentId: string, auditModel: any) => Promise<{
    valid: boolean;
    brokenChain: number[];
    totalEntries: number;
}>;
/**
 * 5. Generates Merkle proof for specific audit entry.
 *
 * @param {string} entryHash - Audit entry hash to prove
 * @param {any} auditModel - AuditTrail Sequelize model
 * @param {string} documentId - Document identifier
 * @returns {Promise<MerkleProof>} Merkle proof data
 *
 * @example
 * ```typescript
 * const proof = await generateMerkleProof(entryHash, AuditTrailModel, 'doc-123');
 * console.log('Proof verified:', proof.verified);
 * ```
 */
export declare const generateMerkleProof: (entryHash: string, auditModel: any, documentId: string) => Promise<MerkleProof>;
/**
 * 6. Retrieves audit trail from blockchain.
 *
 * @param {string} transactionHash - Blockchain transaction hash
 * @param {any} auditModel - AuditTrail Sequelize model
 * @returns {Promise<any[]>} Audit trail entries from blockchain
 *
 * @example
 * ```typescript
 * const entries = await retrieveAuditFromBlockchain(txHash, AuditTrailModel);
 * ```
 */
export declare const retrieveAuditFromBlockchain: (transactionHash: string, auditModel: any) => Promise<any[]>;
/**
 * 7. Validates blockchain timestamp authenticity.
 *
 * @param {string} transactionHash - Blockchain transaction hash
 * @param {Date} claimedTimestamp - Claimed timestamp
 * @returns {Promise<{ valid: boolean; blockchainTimestamp: Date; difference: number }>} Timestamp validation result
 *
 * @example
 * ```typescript
 * const validation = await validateBlockchainTimestamp(txHash, new Date());
 * console.log('Time difference (ms):', validation.difference);
 * ```
 */
export declare const validateBlockchainTimestamp: (transactionHash: string, claimedTimestamp: Date) => Promise<{
    valid: boolean;
    blockchainTimestamp: Date;
    difference: number;
}>;
/**
 * 8. Performs comprehensive forensic document analysis.
 *
 * @param {Buffer} documentBuffer - Document data
 * @param {string} documentId - Document identifier
 * @param {any} evidenceModel - ForensicEvidence Sequelize model
 * @returns {Promise<ForensicAnalysisResult>} Forensic analysis result
 *
 * @example
 * ```typescript
 * const analysis = await performForensicAnalysis(pdfBuffer, 'doc-123', EvidenceModel);
 * console.log('Integrity score:', analysis.integrityScore);
 * console.log('Anomalies:', analysis.anomaliesDetected);
 * ```
 */
export declare const performForensicAnalysis: (documentBuffer: Buffer, documentId: string, evidenceModel: any) => Promise<ForensicAnalysisResult>;
/**
 * 9. Extracts metadata from document for forensic analysis.
 *
 * @param {Buffer} documentBuffer - Document data
 * @returns {Promise<Record<string, any>>} Extracted metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractDocumentMetadata(pdfBuffer);
 * console.log('Author:', metadata.author);
 * console.log('Creation date:', metadata.createDate);
 * ```
 */
export declare const extractDocumentMetadata: (documentBuffer: Buffer) => Promise<Record<string, any>>;
/**
 * 10. Creates digital fingerprint for document.
 *
 * @param {Buffer} documentBuffer - Document data
 * @param {any} evidenceModel - ForensicEvidence Sequelize model
 * @param {string} documentId - Document identifier
 * @returns {Promise<DigitalFingerprint>} Digital fingerprint data
 *
 * @example
 * ```typescript
 * const fingerprint = await createDigitalFingerprint(pdfBuffer, EvidenceModel, 'doc-123');
 * console.log('SHA-256:', fingerprint.sha256);
 * ```
 */
export declare const createDigitalFingerprint: (documentBuffer: Buffer, evidenceModel: any, documentId: string) => Promise<DigitalFingerprint>;
/**
 * 11. Compares document versions to detect modifications.
 *
 * @param {Buffer} originalBuffer - Original document
 * @param {Buffer} modifiedBuffer - Modified document
 * @returns {Promise<{ modified: boolean; changes: any[]; similarity: number }>} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareDocumentVersions(originalPdf, modifiedPdf);
 * console.log('Modified:', comparison.modified);
 * console.log('Similarity:', comparison.similarity + '%');
 * ```
 */
export declare const compareDocumentVersions: (originalBuffer: Buffer, modifiedBuffer: Buffer) => Promise<{
    modified: boolean;
    changes: any[];
    similarity: number;
}>;
/**
 * 12. Analyzes document for steganography or hidden content.
 *
 * @param {Buffer} documentBuffer - Document data
 * @returns {Promise<{ hiddenContentDetected: boolean; findings: any[] }>} Steganography analysis result
 *
 * @example
 * ```typescript
 * const stegAnalysis = await analyzeSteganography(imageBuffer);
 * if (stegAnalysis.hiddenContentDetected) {
 *   console.log('Hidden content found:', stegAnalysis.findings);
 * }
 * ```
 */
export declare const analyzeSteganography: (documentBuffer: Buffer) => Promise<{
    hiddenContentDetected: boolean;
    findings: any[];
}>;
/**
 * 13. Performs image forensics analysis (error level, metadata).
 *
 * @param {Buffer} imageBuffer - Image data
 * @returns {Promise<{ manipulated: boolean; errorLevels: number[]; exifData: any }>} Image forensics result
 *
 * @example
 * ```typescript
 * const imageForensics = await performImageForensics(jpegBuffer);
 * if (imageForensics.manipulated) {
 *   console.log('Image may have been manipulated');
 * }
 * ```
 */
export declare const performImageForensics: (imageBuffer: Buffer) => Promise<{
    manipulated: boolean;
    errorLevels: number[];
    exifData: any;
}>;
/**
 * 14. Reconstructs document timeline from forensic evidence.
 *
 * @param {string} documentId - Document identifier
 * @param {any} auditModel - AuditTrail Sequelize model
 * @param {any} evidenceModel - ForensicEvidence Sequelize model
 * @returns {Promise<ForensicTimelineEntry[]>} Reconstructed timeline
 *
 * @example
 * ```typescript
 * const timeline = await reconstructDocumentTimeline('doc-123', AuditModel, EvidenceModel);
 * timeline.forEach(entry => {
 *   console.log(`${entry.timestamp}: ${entry.eventType} by ${entry.actor}`);
 * });
 * ```
 */
export declare const reconstructDocumentTimeline: (documentId: string, auditModel: any, evidenceModel: any) => Promise<ForensicTimelineEntry[]>;
/**
 * 15. Detects tampering using hash comparison.
 *
 * @param {Buffer} documentBuffer - Current document data
 * @param {string} originalHash - Original document hash
 * @param {string} hashAlgorithm - Hash algorithm to use
 * @returns {Promise<TamperDetectionResult>} Tamper detection result
 *
 * @example
 * ```typescript
 * const tamperCheck = await detectTamperingByHash(currentPdf, originalHash, 'SHA-256');
 * if (tamperCheck.tampered) {
 *   console.log('Tampering detected! Severity:', tamperCheck.severity);
 * }
 * ```
 */
export declare const detectTamperingByHash: (documentBuffer: Buffer, originalHash: string, hashAlgorithm?: string) => Promise<TamperDetectionResult>;
/**
 * 16. Detects tampering in PDF document structure.
 *
 * @param {Buffer} pdfBuffer - PDF document data
 * @returns {Promise<TamperDetectionResult>} PDF tamper detection result
 *
 * @example
 * ```typescript
 * const pdfTamper = await detectPDFTampering(pdfBuffer);
 * if (pdfTamper.tampered) {
 *   console.log('PDF structure compromised:', pdfTamper.tamperedSections);
 * }
 * ```
 */
export declare const detectPDFTampering: (pdfBuffer: Buffer) => Promise<TamperDetectionResult>;
/**
 * 17. Detects metadata manipulation in documents.
 *
 * @param {Record<string, any>} currentMetadata - Current document metadata
 * @param {Record<string, any>} originalMetadata - Original document metadata
 * @returns {Promise<AnomalyDetectionResult[]>} Metadata anomalies detected
 *
 * @example
 * ```typescript
 * const anomalies = await detectMetadataManipulation(currentMeta, originalMeta);
 * anomalies.forEach(anomaly => {
 *   console.log(`${anomaly.anomalyType}: ${anomaly.description}`);
 * });
 * ```
 */
export declare const detectMetadataManipulation: (currentMetadata: Record<string, any>, originalMetadata: Record<string, any>) => Promise<AnomalyDetectionResult[]>;
/**
 * 18. Validates document integrity using multiple hash algorithms.
 *
 * @param {Buffer} documentBuffer - Document data
 * @param {Record<string, string>} originalHashes - Original hashes (algorithm: hash)
 * @returns {Promise<{ valid: boolean; failedAlgorithms: string[] }>} Multi-hash validation result
 *
 * @example
 * ```typescript
 * const validation = await validateMultipleHashes(pdfBuffer, {
 *   'SHA-256': 'original-sha256-hash',
 *   'SHA-512': 'original-sha512-hash',
 *   'MD5': 'original-md5-hash'
 * });
 * ```
 */
export declare const validateMultipleHashes: (documentBuffer: Buffer, originalHashes: Record<string, string>) => Promise<{
    valid: boolean;
    failedAlgorithms: string[];
}>;
/**
 * 19. Detects anomalies in document access patterns.
 *
 * @param {string} documentId - Document identifier
 * @param {any} auditModel - AuditTrail Sequelize model
 * @returns {Promise<AnomalyDetectionResult[]>} Access pattern anomalies
 *
 * @example
 * ```typescript
 * const accessAnomalies = await detectAccessPatternAnomalies('doc-123', AuditModel);
 * accessAnomalies.forEach(anomaly => {
 *   console.log(`Access anomaly: ${anomaly.description}`);
 * });
 * ```
 */
export declare const detectAccessPatternAnomalies: (documentId: string, auditModel: any) => Promise<AnomalyDetectionResult[]>;
/**
 * 20. Performs byte-level document comparison.
 *
 * @param {Buffer} buffer1 - First document
 * @param {Buffer} buffer2 - Second document
 * @returns {Promise<{ identical: boolean; differenceCount: number; differenceLocations: number[] }>} Byte comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareDocumentBytes(originalPdf, modifiedPdf);
 * console.log('Different bytes:', comparison.differenceCount);
 * ```
 */
export declare const compareDocumentBytes: (buffer1: Buffer, buffer2: Buffer) => Promise<{
    identical: boolean;
    differenceCount: number;
    differenceLocations: number[];
}>;
/**
 * 21. Creates tamper detection alert.
 *
 * @param {TamperDetectionResult} detection - Tamper detection result
 * @param {any} tamperModel - TamperDetection Sequelize model
 * @param {string} documentId - Document identifier
 * @param {string} detectedBy - User or system that detected tampering
 * @returns {Promise<any>} Created tamper detection record
 *
 * @example
 * ```typescript
 * const alert = await createTamperAlert(detectionResult, TamperModel, 'doc-123', 'system');
 * ```
 */
export declare const createTamperAlert: (detection: TamperDetectionResult, tamperModel: any, documentId: string, detectedBy: string) => Promise<any>;
/**
 * 22. Initiates chain of custody for document evidence.
 *
 * @param {string} documentId - Document identifier
 * @param {string} custodian - Custodian identifier
 * @param {string} custodianOrg - Custodian organization
 * @param {string} purpose - Purpose of custody
 * @param {Buffer} documentBuffer - Document data
 * @returns {Promise<ChainOfCustodyRecord>} Chain of custody record
 *
 * @example
 * ```typescript
 * const custody = await initiateChainOfCustody(
 *   'doc-123',
 *   'forensic-analyst-456',
 *   'WhiteCross Forensics',
 *   'Legal investigation',
 *   pdfBuffer
 * );
 * console.log('Custody ID:', custody.id);
 * ```
 */
export declare const initiateChainOfCustody: (documentId: string, custodian: string, custodianOrg: string, purpose: string, documentBuffer: Buffer) => Promise<ChainOfCustodyRecord>;
/**
 * 23. Transfers custody of document evidence.
 *
 * @param {string} custodyId - Chain of custody record ID
 * @param {string} fromCustodian - Current custodian
 * @param {string} toCustodian - New custodian
 * @param {string} reason - Reason for transfer
 * @param {string[]} [witnesses] - Witness identifiers
 * @returns {Promise<ChainOfCustodyRecord>} Updated custody record
 *
 * @example
 * ```typescript
 * const transfer = await transferCustody(
 *   custodyId,
 *   'analyst-1',
 *   'analyst-2',
 *   'Shift change',
 *   ['supervisor-123']
 * );
 * ```
 */
export declare const transferCustody: (custodyId: string, fromCustodian: string, toCustodian: string, reason: string, witnesses?: string[]) => Promise<ChainOfCustodyRecord>;
/**
 * 24. Verifies chain of custody integrity.
 *
 * @param {string} documentId - Document identifier
 * @param {Buffer} documentBuffer - Current document data
 * @param {ChainOfCustodyRecord[]} custodyRecords - Custody records
 * @returns {Promise<{ valid: boolean; breaks: any[] }>} Chain of custody verification
 *
 * @example
 * ```typescript
 * const verification = await verifyChainOfCustody('doc-123', pdfBuffer, custodyRecords);
 * if (!verification.valid) {
 *   console.log('Chain breaks:', verification.breaks);
 * }
 * ```
 */
export declare const verifyChainOfCustody: (documentId: string, documentBuffer: Buffer, custodyRecords: ChainOfCustodyRecord[]) => Promise<{
    valid: boolean;
    breaks: any[];
}>;
/**
 * 25. Generates chain of custody report.
 *
 * @param {string} documentId - Document identifier
 * @param {ChainOfCustodyRecord[]} custodyRecords - Custody records
 * @returns {Promise<string>} Chain of custody report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateCustodyReport('doc-123', custodyRecords);
 * console.log(JSON.parse(report));
 * ```
 */
export declare const generateCustodyReport: (documentId: string, custodyRecords: ChainOfCustodyRecord[]) => Promise<string>;
/**
 * 26. Logs custody event in blockchain.
 *
 * @param {ChainOfCustodyRecord} custody - Custody record
 * @param {any} auditModel - AuditTrail Sequelize model
 * @returns {Promise<{ txHash: string; blockNumber: number }>} Blockchain transaction info
 *
 * @example
 * ```typescript
 * const blockchain = await logCustodyEventToBlockchain(custodyRecord, AuditModel);
 * console.log('Custody logged at:', blockchain.txHash);
 * ```
 */
export declare const logCustodyEventToBlockchain: (custody: ChainOfCustodyRecord, auditModel: any) => Promise<{
    txHash: string;
    blockNumber: number;
}>;
/**
 * 27. Retrieves custody history for document.
 *
 * @param {string} documentId - Document identifier
 * @param {any} auditModel - AuditTrail Sequelize model
 * @returns {Promise<ChainOfCustodyRecord[]>} Custody history
 *
 * @example
 * ```typescript
 * const history = await retrieveCustodyHistory('doc-123', AuditModel);
 * history.forEach(record => {
 *   console.log(`${record.timestamp}: ${record.custodian} - ${record.status}`);
 * });
 * ```
 */
export declare const retrieveCustodyHistory: (documentId: string, auditModel: any) => Promise<ChainOfCustodyRecord[]>;
/**
 * 28. Validates custody timeline for gaps or overlaps.
 *
 * @param {ChainOfCustodyRecord[]} custodyRecords - Custody records
 * @returns {Promise<{ valid: boolean; gaps: any[]; overlaps: any[] }>} Timeline validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCustodyTimeline(custodyRecords);
 * if (!validation.valid) {
 *   console.log('Gaps:', validation.gaps.length);
 *   console.log('Overlaps:', validation.overlaps.length);
 * }
 * ```
 */
export declare const validateCustodyTimeline: (custodyRecords: ChainOfCustodyRecord[]) => Promise<{
    valid: boolean;
    gaps: any[];
    overlaps: any[];
}>;
/**
 * 29. Creates evidence preservation package with encryption.
 *
 * @param {string} documentId - Document identifier
 * @param {Buffer} documentBuffer - Document data
 * @param {string} preservedBy - User preserving evidence
 * @param {PreservationMethod} method - Preservation method
 * @returns {Promise<EvidencePreservationPackage>} Preservation package
 *
 * @example
 * ```typescript
 * const preserved = await createPreservationPackage(
 *   'doc-123',
 *   pdfBuffer,
 *   'forensic-analyst-456',
 *   'blockchain'
 * );
 * console.log('Preservation ID:', preserved.preservationId);
 * ```
 */
export declare const createPreservationPackage: (documentId: string, documentBuffer: Buffer, preservedBy: string, method: PreservationMethod) => Promise<EvidencePreservationPackage>;
/**
 * 30. Encrypts evidence for long-term preservation.
 *
 * @param {Buffer} evidenceBuffer - Evidence data
 * @param {string} [passphrase] - Optional encryption passphrase
 * @returns {Promise<{ encrypted: Buffer; key: string; iv: string }>} Encrypted evidence and keys
 *
 * @example
 * ```typescript
 * const encrypted = await encryptEvidence(documentBuffer, 'secure-passphrase');
 * // Store encrypted.encrypted, encrypted.key, encrypted.iv separately
 * ```
 */
export declare const encryptEvidence: (evidenceBuffer: Buffer, passphrase?: string) => Promise<{
    encrypted: Buffer;
    key: string;
    iv: string;
}>;
/**
 * 31. Decrypts preserved evidence.
 *
 * @param {Buffer} encryptedBuffer - Encrypted evidence
 * @param {string} key - Encryption key (hex)
 * @param {string} iv - Initialization vector (hex)
 * @returns {Promise<Buffer>} Decrypted evidence
 *
 * @example
 * ```typescript
 * const decrypted = await decryptEvidence(encryptedBuffer, keyHex, ivHex);
 * ```
 */
export declare const decryptEvidence: (encryptedBuffer: Buffer, key: string, iv: string) => Promise<Buffer>;
/**
 * 32. Verifies preserved evidence integrity.
 *
 * @param {EvidencePreservationPackage} preservationPackage - Preservation package
 * @param {Buffer} evidenceBuffer - Current evidence data
 * @returns {Promise<{ valid: boolean; hashChainValid: boolean; merkleValid: boolean }>} Integrity verification
 *
 * @example
 * ```typescript
 * const integrity = await verifyPreservationIntegrity(preservationPkg, evidenceBuffer);
 * if (!integrity.valid) {
 *   console.log('Evidence integrity compromised!');
 * }
 * ```
 */
export declare const verifyPreservationIntegrity: (preservationPackage: EvidencePreservationPackage, evidenceBuffer: Buffer) => Promise<{
    valid: boolean;
    hashChainValid: boolean;
    merkleValid: boolean;
}>;
/**
 * 33. Creates immutable evidence snapshot.
 *
 * @param {string} documentId - Document identifier
 * @param {Buffer} documentBuffer - Document data
 * @param {any} evidenceModel - ForensicEvidence Sequelize model
 * @param {string} collectedBy - Evidence collector
 * @returns {Promise<any>} Created evidence snapshot
 *
 * @example
 * ```typescript
 * const snapshot = await createEvidenceSnapshot('doc-123', pdfBuffer, EvidenceModel, 'analyst-456');
 * ```
 */
export declare const createEvidenceSnapshot: (documentId: string, documentBuffer: Buffer, evidenceModel: any, collectedBy: string) => Promise<any>;
/**
 * 34. Archives evidence to cold storage.
 *
 * @param {EvidencePreservationPackage} preservationPackage - Preservation package
 * @param {string} archiveLocation - Archive storage location
 * @returns {Promise<{ archiveId: string; location: string; archivedAt: Date }>} Archive information
 *
 * @example
 * ```typescript
 * const archive = await archiveEvidenceToColdStorage(preservationPkg, '/cold-storage/legal');
 * console.log('Archived to:', archive.location);
 * ```
 */
export declare const archiveEvidenceToColdStorage: (preservationPackage: EvidencePreservationPackage, archiveLocation: string) => Promise<{
    archiveId: string;
    location: string;
    archivedAt: Date;
}>;
/**
 * 35. Retrieves evidence from cold storage.
 *
 * @param {string} archiveId - Archive identifier
 * @param {string} archiveLocation - Archive storage location
 * @returns {Promise<{ evidence: Buffer; metadata: Record<string, any> }>} Retrieved evidence
 *
 * @example
 * ```typescript
 * const retrieved = await retrieveEvidenceFromColdStorage(archiveId, '/cold-storage/legal');
 * ```
 */
export declare const retrieveEvidenceFromColdStorage: (archiveId: string, archiveLocation: string) => Promise<{
    evidence: Buffer;
    metadata: Record<string, any>;
}>;
/**
 * 36. Generates comprehensive forensic audit report.
 *
 * @param {string} documentId - Document identifier
 * @param {any} auditModel - AuditTrail Sequelize model
 * @param {any} evidenceModel - ForensicEvidence Sequelize model
 * @param {any} tamperModel - TamperDetection Sequelize model
 * @returns {Promise<string>} Comprehensive audit report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateForensicAuditReport(
 *   'doc-123',
 *   AuditModel,
 *   EvidenceModel,
 *   TamperModel
 * );
 * console.log(JSON.parse(report));
 * ```
 */
export declare const generateForensicAuditReport: (documentId: string, auditModel: any, evidenceModel: any, tamperModel: any) => Promise<string>;
/**
 * 37. Exports audit trail for legal proceedings.
 *
 * @param {string} documentId - Document identifier
 * @param {any} auditModel - AuditTrail Sequelize model
 * @param {any} evidenceModel - ForensicEvidence Sequelize model
 * @returns {Promise<{ auditTrail: any[]; evidence: any[]; chainOfCustody: any[] }>} Legal export package
 *
 * @example
 * ```typescript
 * const legalExport = await exportAuditForLegal('doc-123', AuditModel, EvidenceModel);
 * ```
 */
export declare const exportAuditForLegal: (documentId: string, auditModel: any, evidenceModel: any) => Promise<{
    auditTrail: any[];
    evidence: any[];
    chainOfCustody: any[];
}>;
/**
 * 38. Reconstructs audit trail from blockchain.
 *
 * @param {string} documentId - Document identifier
 * @param {any} auditModel - AuditTrail Sequelize model
 * @returns {Promise<AuditTrailReconstruction>} Reconstructed audit trail
 *
 * @example
 * ```typescript
 * const reconstruction = await reconstructAuditTrail('doc-123', AuditModel);
 * console.log('Integrity verified:', reconstruction.integrityVerified);
 * console.log('Reconstruction score:', reconstruction.reconstructionScore);
 * ```
 */
export declare const reconstructAuditTrail: (documentId: string, auditModel: any) => Promise<AuditTrailReconstruction>;
/**
 * 39. Generates compliance audit report (HIPAA, SOC 2, ISO 27001).
 *
 * @param {string} documentId - Document identifier
 * @param {any} auditModel - AuditTrail Sequelize model
 * @param {string} complianceFramework - Compliance framework (HIPAA, SOC2, ISO27001)
 * @returns {Promise<{ compliant: boolean; findings: any[]; recommendations: string[] }>} Compliance report
 *
 * @example
 * ```typescript
 * const compliance = await generateComplianceAuditReport('doc-123', AuditModel, 'HIPAA');
 * console.log('HIPAA compliant:', compliance.compliant);
 * ```
 */
export declare const generateComplianceAuditReport: (documentId: string, auditModel: any, complianceFramework: string) => Promise<{
    compliant: boolean;
    findings: any[];
    recommendations: string[];
}>;
/**
 * 40. Queries audit trail with advanced filters and aggregations.
 *
 * @param {AuditTrailFilters} filters - Query filters
 * @param {any} auditModel - AuditTrail Sequelize model
 * @returns {Promise<{ results: any[]; total: number; aggregations: Record<string, any> }>} Query results
 *
 * @example
 * ```typescript
 * const results = await queryAuditTrailAdvanced({
 *   documentId: 'doc-123',
 *   eventType: ['modified', 'accessed'],
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   includeBlockchain: true
 * }, AuditModel);
 * console.log('Total results:', results.total);
 * console.log('Event breakdown:', results.aggregations.byEventType);
 * ```
 */
export declare const queryAuditTrailAdvanced: (filters: AuditTrailFilters, auditModel: any) => Promise<{
    results: any[];
    total: number;
    aggregations: Record<string, any>;
}>;
declare const _default: {
    createAuditTrailModel: (sequelize: Sequelize) => any;
    createForensicEvidenceModel: (sequelize: Sequelize) => any;
    createTamperDetectionModel: (sequelize: Sequelize) => any;
    createBlockchainAuditLog: (entry: Omit<BlockchainAuditEntry, "blockNumber" | "transactionHash">, auditModel: any, transaction?: Transaction) => Promise<any>;
    anchorToBlockchain: (documentId: string, merkleRoot: string, auditModel: any) => Promise<{
        txHash: string;
        blockNumber: number;
    }>;
    buildAuditMerkleTree: (documentId: string, auditModel: any) => Promise<{
        root: string;
        leaves: string[];
        tree: any;
    }>;
    verifyAuditChainIntegrity: (documentId: string, auditModel: any) => Promise<{
        valid: boolean;
        brokenChain: number[];
        totalEntries: number;
    }>;
    generateMerkleProof: (entryHash: string, auditModel: any, documentId: string) => Promise<MerkleProof>;
    retrieveAuditFromBlockchain: (transactionHash: string, auditModel: any) => Promise<any[]>;
    validateBlockchainTimestamp: (transactionHash: string, claimedTimestamp: Date) => Promise<{
        valid: boolean;
        blockchainTimestamp: Date;
        difference: number;
    }>;
    performForensicAnalysis: (documentBuffer: Buffer, documentId: string, evidenceModel: any) => Promise<ForensicAnalysisResult>;
    extractDocumentMetadata: (documentBuffer: Buffer) => Promise<Record<string, any>>;
    createDigitalFingerprint: (documentBuffer: Buffer, evidenceModel: any, documentId: string) => Promise<DigitalFingerprint>;
    compareDocumentVersions: (originalBuffer: Buffer, modifiedBuffer: Buffer) => Promise<{
        modified: boolean;
        changes: any[];
        similarity: number;
    }>;
    analyzeSteganography: (documentBuffer: Buffer) => Promise<{
        hiddenContentDetected: boolean;
        findings: any[];
    }>;
    performImageForensics: (imageBuffer: Buffer) => Promise<{
        manipulated: boolean;
        errorLevels: number[];
        exifData: any;
    }>;
    reconstructDocumentTimeline: (documentId: string, auditModel: any, evidenceModel: any) => Promise<ForensicTimelineEntry[]>;
    detectTamperingByHash: (documentBuffer: Buffer, originalHash: string, hashAlgorithm?: string) => Promise<TamperDetectionResult>;
    detectPDFTampering: (pdfBuffer: Buffer) => Promise<TamperDetectionResult>;
    detectMetadataManipulation: (currentMetadata: Record<string, any>, originalMetadata: Record<string, any>) => Promise<AnomalyDetectionResult[]>;
    validateMultipleHashes: (documentBuffer: Buffer, originalHashes: Record<string, string>) => Promise<{
        valid: boolean;
        failedAlgorithms: string[];
    }>;
    detectAccessPatternAnomalies: (documentId: string, auditModel: any) => Promise<AnomalyDetectionResult[]>;
    compareDocumentBytes: (buffer1: Buffer, buffer2: Buffer) => Promise<{
        identical: boolean;
        differenceCount: number;
        differenceLocations: number[];
    }>;
    createTamperAlert: (detection: TamperDetectionResult, tamperModel: any, documentId: string, detectedBy: string) => Promise<any>;
    initiateChainOfCustody: (documentId: string, custodian: string, custodianOrg: string, purpose: string, documentBuffer: Buffer) => Promise<ChainOfCustodyRecord>;
    transferCustody: (custodyId: string, fromCustodian: string, toCustodian: string, reason: string, witnesses?: string[]) => Promise<ChainOfCustodyRecord>;
    verifyChainOfCustody: (documentId: string, documentBuffer: Buffer, custodyRecords: ChainOfCustodyRecord[]) => Promise<{
        valid: boolean;
        breaks: any[];
    }>;
    generateCustodyReport: (documentId: string, custodyRecords: ChainOfCustodyRecord[]) => Promise<string>;
    logCustodyEventToBlockchain: (custody: ChainOfCustodyRecord, auditModel: any) => Promise<{
        txHash: string;
        blockNumber: number;
    }>;
    retrieveCustodyHistory: (documentId: string, auditModel: any) => Promise<ChainOfCustodyRecord[]>;
    validateCustodyTimeline: (custodyRecords: ChainOfCustodyRecord[]) => Promise<{
        valid: boolean;
        gaps: any[];
        overlaps: any[];
    }>;
    createPreservationPackage: (documentId: string, documentBuffer: Buffer, preservedBy: string, method: PreservationMethod) => Promise<EvidencePreservationPackage>;
    encryptEvidence: (evidenceBuffer: Buffer, passphrase?: string) => Promise<{
        encrypted: Buffer;
        key: string;
        iv: string;
    }>;
    decryptEvidence: (encryptedBuffer: Buffer, key: string, iv: string) => Promise<Buffer>;
    verifyPreservationIntegrity: (preservationPackage: EvidencePreservationPackage, evidenceBuffer: Buffer) => Promise<{
        valid: boolean;
        hashChainValid: boolean;
        merkleValid: boolean;
    }>;
    createEvidenceSnapshot: (documentId: string, documentBuffer: Buffer, evidenceModel: any, collectedBy: string) => Promise<any>;
    archiveEvidenceToColdStorage: (preservationPackage: EvidencePreservationPackage, archiveLocation: string) => Promise<{
        archiveId: string;
        location: string;
        archivedAt: Date;
    }>;
    retrieveEvidenceFromColdStorage: (archiveId: string, archiveLocation: string) => Promise<{
        evidence: Buffer;
        metadata: Record<string, any>;
    }>;
    generateForensicAuditReport: (documentId: string, auditModel: any, evidenceModel: any, tamperModel: any) => Promise<string>;
    exportAuditForLegal: (documentId: string, auditModel: any, evidenceModel: any) => Promise<{
        auditTrail: any[];
        evidence: any[];
        chainOfCustody: any[];
    }>;
    reconstructAuditTrail: (documentId: string, auditModel: any) => Promise<AuditTrailReconstruction>;
    generateComplianceAuditReport: (documentId: string, auditModel: any, complianceFramework: string) => Promise<{
        compliant: boolean;
        findings: any[];
        recommendations: string[];
    }>;
    queryAuditTrailAdvanced: (filters: AuditTrailFilters, auditModel: any) => Promise<{
        results: any[];
        total: number;
        aggregations: Record<string, any>;
    }>;
};
export default _default;
//# sourceMappingURL=document-audit-trail-advanced-kit.d.ts.map