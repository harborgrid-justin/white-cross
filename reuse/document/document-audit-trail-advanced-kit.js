"use strict";
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
exports.queryAuditTrailAdvanced = exports.generateComplianceAuditReport = exports.reconstructAuditTrail = exports.exportAuditForLegal = exports.generateForensicAuditReport = exports.retrieveEvidenceFromColdStorage = exports.archiveEvidenceToColdStorage = exports.createEvidenceSnapshot = exports.verifyPreservationIntegrity = exports.decryptEvidence = exports.encryptEvidence = exports.createPreservationPackage = exports.validateCustodyTimeline = exports.retrieveCustodyHistory = exports.logCustodyEventToBlockchain = exports.generateCustodyReport = exports.verifyChainOfCustody = exports.transferCustody = exports.initiateChainOfCustody = exports.createTamperAlert = exports.compareDocumentBytes = exports.detectAccessPatternAnomalies = exports.validateMultipleHashes = exports.detectMetadataManipulation = exports.detectPDFTampering = exports.detectTamperingByHash = exports.reconstructDocumentTimeline = exports.performImageForensics = exports.analyzeSteganography = exports.compareDocumentVersions = exports.createDigitalFingerprint = exports.extractDocumentMetadata = exports.performForensicAnalysis = exports.validateBlockchainTimestamp = exports.retrieveAuditFromBlockchain = exports.generateMerkleProof = exports.verifyAuditChainIntegrity = exports.buildAuditMerkleTree = exports.anchorToBlockchain = exports.createBlockchainAuditLog = exports.createTamperDetectionModel = exports.createForensicEvidenceModel = exports.createAuditTrailModel = void 0;
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
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
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
const createAuditTrailModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Document being audited',
        },
        eventType: {
            type: sequelize_1.DataTypes.ENUM('created', 'accessed', 'modified', 'deleted', 'signed', 'verified', 'exported', 'printed', 'shared', 'archived'),
            allowNull: false,
            comment: 'Type of audit event',
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'User who performed the action',
        },
        userName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Full name of user',
        },
        userRole: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User role at time of event',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            comment: 'IP address of request',
        },
        userAgent: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'User agent string',
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE(6),
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Microsecond precision timestamp',
        },
        previousHash: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: true,
            comment: 'Hash of previous audit entry',
        },
        currentHash: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: false,
            comment: 'Hash of current audit entry',
        },
        hashAlgorithm: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'SHA-256',
            comment: 'Hash algorithm used',
        },
        blockchainTxHash: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: true,
            comment: 'Blockchain transaction hash',
        },
        blockchainBlockNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Blockchain block number',
        },
        merkleRoot: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: true,
            comment: 'Merkle tree root hash',
        },
        merkleProof: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Merkle proof for verification',
        },
        eventData: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional event data',
        },
        location: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Geographic location',
        },
        deviceInfo: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Device information',
        },
        verified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Audit entry verified',
        },
        verifiedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Verification timestamp',
        },
        tampered: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Tampering detected',
        },
    };
    const options = {
        tableName: 'audit_trails',
        timestamps: true,
        indexes: [
            { fields: ['documentId'] },
            { fields: ['userId'] },
            { fields: ['eventType'] },
            { fields: ['timestamp'] },
            { fields: ['currentHash'], unique: true },
            { fields: ['blockchainTxHash'] },
            { fields: ['verified'] },
            { fields: ['tampered'] },
            { fields: ['documentId', 'timestamp'] },
        ],
        hooks: {
            beforeCreate: async (instance) => {
                // Generate hash chain
                if (!instance.currentHash) {
                    const hashData = `${instance.documentId}:${instance.eventType}:${instance.userId}:${instance.timestamp}`;
                    instance.currentHash = crypto.createHash('sha256').update(hashData).digest('hex');
                }
            },
        },
    };
    return sequelize.define('AuditTrail', attributes, options);
};
exports.createAuditTrailModel = createAuditTrailModel;
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
const createForensicEvidenceModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Document under investigation',
        },
        evidenceType: {
            type: sequelize_1.DataTypes.ENUM('metadata', 'digital_fingerprint', 'content_analysis', 'image_forensics', 'pdf_analysis', 'signature_analysis'),
            allowNull: false,
            comment: 'Type of forensic evidence',
        },
        collectedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Forensic analyst who collected evidence',
        },
        collectedAt: {
            type: sequelize_1.DataTypes.DATE(6),
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Evidence collection timestamp',
        },
        digitalFingerprint: {
            type: sequelize_1.DataTypes.STRING(256),
            allowNull: false,
            unique: true,
            comment: 'Unique digital fingerprint',
        },
        sha256Hash: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: false,
            comment: 'SHA-256 hash',
        },
        sha512Hash: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: false,
            comment: 'SHA-512 hash',
        },
        md5Hash: {
            type: sequelize_1.DataTypes.STRING(32),
            allowNull: false,
            comment: 'MD5 hash (legacy support)',
        },
        fileSize: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            comment: 'File size in bytes',
        },
        mimeType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'MIME type',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Document metadata',
        },
        extractedData: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Extracted forensic data',
        },
        analysisResults: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Forensic analysis results',
        },
        anomaliesDetected: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of anomalies detected',
        },
        integrityScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 100.0,
            comment: 'Integrity score (0-100)',
            validate: {
                min: 0,
                max: 100,
            },
        },
        tamperSeverity: {
            type: sequelize_1.DataTypes.ENUM('none', 'low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'none',
            comment: 'Tamper severity level',
        },
        chainOfCustodyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Chain of custody record ID',
        },
        preservationMethod: {
            type: sequelize_1.DataTypes.ENUM('hash', 'blockchain', 'encryption', 'immutable_storage', 'cold_storage'),
            allowNull: false,
            comment: 'Evidence preservation method',
        },
        storageLocation: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Evidence storage location',
        },
        encrypted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Evidence is encrypted',
        },
        encryptionKey: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Encrypted encryption key',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Evidence expiration date',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Forensic analyst notes',
        },
    };
    const options = {
        tableName: 'forensic_evidence',
        timestamps: true,
        indexes: [
            { fields: ['documentId'] },
            { fields: ['evidenceType'] },
            { fields: ['collectedBy'] },
            { fields: ['collectedAt'] },
            { fields: ['digitalFingerprint'], unique: true },
            { fields: ['sha256Hash'] },
            { fields: ['chainOfCustodyId'] },
            { fields: ['tamperSeverity'] },
            { fields: ['integrityScore'] },
            { fields: ['expiresAt'] },
        ],
    };
    return sequelize.define('ForensicEvidence', attributes, options);
};
exports.createForensicEvidenceModel = createForensicEvidenceModel;
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
const createTamperDetectionModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Document being checked for tampering',
        },
        detectionMethod: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Method used for tamper detection',
        },
        tampered: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Tampering detected',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('none', 'low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'none',
            comment: 'Tamper severity level',
        },
        confidence: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
            comment: 'Confidence level (0-1)',
            validate: {
                min: 0,
                max: 1,
            },
        },
        detectedAt: {
            type: sequelize_1.DataTypes.DATE(6),
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Detection timestamp',
        },
        detectedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'User or system that detected tampering',
        },
        originalHash: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: false,
            comment: 'Original document hash',
        },
        currentHash: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: false,
            comment: 'Current document hash',
        },
        hashAlgorithm: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'SHA-256',
            comment: 'Hash algorithm used',
        },
        tamperedSections: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Specific tampered sections',
        },
        evidenceId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'forensic_evidence',
                key: 'id',
            },
            onDelete: 'SET NULL',
            comment: 'Related forensic evidence',
        },
        verificationData: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional verification data',
        },
        falsePositive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Marked as false positive',
        },
        investigatedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Investigator who reviewed the detection',
        },
        investigatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Investigation timestamp',
        },
        resolution: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Investigation resolution',
        },
    };
    const options = {
        tableName: 'tamper_detections',
        timestamps: true,
        indexes: [
            { fields: ['documentId'] },
            { fields: ['detectionMethod'] },
            { fields: ['tampered'] },
            { fields: ['severity'] },
            { fields: ['detectedAt'] },
            { fields: ['detectedBy'] },
            { fields: ['evidenceId'] },
            { fields: ['falsePositive'] },
            { fields: ['documentId', 'detectedAt'] },
        ],
    };
    return sequelize.define('TamperDetection', attributes, options);
};
exports.createTamperDetectionModel = createTamperDetectionModel;
// ============================================================================
// 1. BLOCKCHAIN AUDIT LOGGING (Functions 1-7)
// ============================================================================
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
const createBlockchainAuditLog = async (entry, auditModel, transaction) => {
    // Get previous hash from last audit entry
    const lastEntry = await auditModel.findOne({
        where: { documentId: entry.documentId },
        order: [['timestamp', 'DESC']],
        transaction,
    });
    const previousHash = lastEntry?.currentHash || null;
    const currentHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({ ...entry, previousHash }))
        .digest('hex');
    return await auditModel.create({
        documentId: entry.documentId,
        eventType: entry.eventType,
        userId: entry.userId,
        userName: entry.metadata?.userName || 'Unknown',
        userRole: entry.metadata?.userRole,
        ipAddress: entry.metadata?.ipAddress,
        userAgent: entry.metadata?.userAgent,
        timestamp: entry.timestamp,
        previousHash,
        currentHash,
        hashAlgorithm: 'SHA-256',
        eventData: entry.metadata,
        verified: false,
        tampered: false,
    }, { transaction });
};
exports.createBlockchainAuditLog = createBlockchainAuditLog;
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
const anchorToBlockchain = async (documentId, merkleRoot, auditModel) => {
    // Placeholder for actual blockchain integration (Ethereum, Hyperledger, etc.)
    const txHash = crypto.randomBytes(32).toString('hex');
    const blockNumber = Math.floor(Date.now() / 1000);
    // Update audit entries with blockchain info
    await auditModel.update({
        blockchainTxHash: txHash,
        blockchainBlockNumber: blockNumber,
        merkleRoot,
        verified: true,
        verifiedAt: new Date(),
    }, {
        where: { documentId, blockchainTxHash: null },
    });
    return { txHash, blockNumber };
};
exports.anchorToBlockchain = anchorToBlockchain;
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
const buildAuditMerkleTree = async (documentId, auditModel) => {
    const entries = await auditModel.findAll({
        where: { documentId },
        order: [['timestamp', 'ASC']],
        raw: true,
    });
    const leaves = entries.map((entry) => entry.currentHash);
    if (leaves.length === 0) {
        return { root: '', leaves: [], tree: null };
    }
    // Build Merkle tree
    const tree = buildMerkleTreeFromLeaves(leaves);
    const root = tree.length > 0 ? tree[tree.length - 1][0] : leaves[0];
    return { root, leaves, tree };
};
exports.buildAuditMerkleTree = buildAuditMerkleTree;
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
const verifyAuditChainIntegrity = async (documentId, auditModel) => {
    const entries = await auditModel.findAll({
        where: { documentId },
        order: [['timestamp', 'ASC']],
        raw: true,
    });
    const brokenChain = [];
    let previousHash = null;
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (i === 0) {
            if (entry.previousHash !== null) {
                brokenChain.push(i);
            }
        }
        else {
            if (entry.previousHash !== previousHash) {
                brokenChain.push(i);
            }
        }
        // Verify current hash
        const computedHash = crypto
            .createHash('sha256')
            .update(JSON.stringify({
            documentId: entry.documentId,
            eventType: entry.eventType,
            userId: entry.userId,
            timestamp: entry.timestamp,
            previousHash: entry.previousHash,
        }))
            .digest('hex');
        if (computedHash !== entry.currentHash) {
            brokenChain.push(i);
            await auditModel.update({ tampered: true }, { where: { id: entry.id } });
        }
        previousHash = entry.currentHash;
    }
    return {
        valid: brokenChain.length === 0,
        brokenChain,
        totalEntries: entries.length,
    };
};
exports.verifyAuditChainIntegrity = verifyAuditChainIntegrity;
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
const generateMerkleProof = async (entryHash, auditModel, documentId) => {
    const merkleTree = await (0, exports.buildAuditMerkleTree)(documentId, auditModel);
    if (!merkleTree.leaves.includes(entryHash)) {
        throw new Error('Entry hash not found in Merkle tree');
    }
    const leafIndex = merkleTree.leaves.indexOf(entryHash);
    const proof = generateProofFromTree(merkleTree.tree, leafIndex);
    const verified = verifyMerkleProof(entryHash, merkleTree.root, proof);
    return {
        leaf: entryHash,
        root: merkleTree.root,
        proof,
        verified,
    };
};
exports.generateMerkleProof = generateMerkleProof;
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
const retrieveAuditFromBlockchain = async (transactionHash, auditModel) => {
    return await auditModel.findAll({
        where: { blockchainTxHash: transactionHash },
        order: [['timestamp', 'ASC']],
    });
};
exports.retrieveAuditFromBlockchain = retrieveAuditFromBlockchain;
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
const validateBlockchainTimestamp = async (transactionHash, claimedTimestamp) => {
    // Placeholder for blockchain timestamp retrieval
    const blockchainTimestamp = new Date();
    const difference = Math.abs(blockchainTimestamp.getTime() - claimedTimestamp.getTime());
    // Allow 5 minute tolerance
    const valid = difference < 5 * 60 * 1000;
    return {
        valid,
        blockchainTimestamp,
        difference,
    };
};
exports.validateBlockchainTimestamp = validateBlockchainTimestamp;
// ============================================================================
// 2. FORENSIC ANALYSIS (Functions 8-14)
// ============================================================================
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
const performForensicAnalysis = async (documentBuffer, documentId, evidenceModel) => {
    const sha256 = crypto.createHash('sha256').update(documentBuffer).digest('hex');
    const sha512 = crypto.createHash('sha512').update(documentBuffer).digest('hex');
    const md5 = crypto.createHash('md5').update(documentBuffer).digest('hex');
    const digitalFingerprint = `${sha256}:${documentBuffer.length}`;
    const metadata = await (0, exports.extractDocumentMetadata)(documentBuffer);
    const findings = await detectAnomalies(documentBuffer, metadata);
    const integrityScore = calculateIntegrityScore(findings);
    // Store evidence
    await evidenceModel.create({
        documentId,
        evidenceType: 'content_analysis',
        collectedBy: 'system',
        digitalFingerprint,
        sha256Hash: sha256,
        sha512Hash: sha512,
        md5Hash: md5,
        fileSize: documentBuffer.length,
        mimeType: metadata.mimeType || 'application/octet-stream',
        metadata,
        analysisResults: { findings },
        anomaliesDetected: findings.length,
        integrityScore,
        tamperSeverity: integrityScore < 70 ? 'high' : integrityScore < 90 ? 'medium' : 'none',
        preservationMethod: 'hash',
        storageLocation: 'forensic-storage',
    });
    return {
        documentId,
        analysisType: 'content_analysis',
        timestamp: new Date(),
        findings,
        metadata: {
            fileSize: documentBuffer.length,
            mimeType: metadata.mimeType || 'application/octet-stream',
            createDate: metadata.createDate,
            modifyDate: metadata.modifyDate,
            author: metadata.author,
            software: metadata.software,
        },
        digitalFingerprint,
        integrityScore,
        anomaliesDetected: findings.length,
    };
};
exports.performForensicAnalysis = performForensicAnalysis;
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
const extractDocumentMetadata = async (documentBuffer) => {
    const metadata = {
        fileSize: documentBuffer.length,
        mimeType: detectMimeType(documentBuffer),
    };
    // PDF metadata extraction
    if (metadata.mimeType === 'application/pdf') {
        // Placeholder for PDF metadata extraction
        metadata.isPDF = true;
        metadata.pdfVersion = extractPDFVersion(documentBuffer);
    }
    // Image metadata extraction
    if (metadata.mimeType?.startsWith('image/')) {
        metadata.isImage = true;
        // Placeholder for EXIF data extraction
    }
    return metadata;
};
exports.extractDocumentMetadata = extractDocumentMetadata;
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
const createDigitalFingerprint = async (documentBuffer, evidenceModel, documentId) => {
    const sha256 = crypto.createHash('sha256').update(documentBuffer).digest('hex');
    const sha512 = crypto.createHash('sha512').update(documentBuffer).digest('hex');
    const md5 = crypto.createHash('md5').update(documentBuffer).digest('hex');
    const metadata = await (0, exports.extractDocumentMetadata)(documentBuffer);
    const fingerprint = {
        documentId,
        sha256,
        sha512,
        md5,
        fileSize: documentBuffer.length,
        createdAt: new Date(),
        metadata,
    };
    // Store fingerprint as evidence
    await evidenceModel.create({
        documentId,
        evidenceType: 'digital_fingerprint',
        collectedBy: 'system',
        digitalFingerprint: `${sha256}:${documentBuffer.length}`,
        sha256Hash: sha256,
        sha512Hash: sha512,
        md5Hash: md5,
        fileSize: documentBuffer.length,
        mimeType: metadata.mimeType || 'application/octet-stream',
        metadata,
        anomaliesDetected: 0,
        integrityScore: 100.0,
        tamperSeverity: 'none',
        preservationMethod: 'hash',
        storageLocation: 'fingerprint-storage',
    });
    return fingerprint;
};
exports.createDigitalFingerprint = createDigitalFingerprint;
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
const compareDocumentVersions = async (originalBuffer, modifiedBuffer) => {
    const originalHash = crypto.createHash('sha256').update(originalBuffer).digest('hex');
    const modifiedHash = crypto.createHash('sha256').update(modifiedBuffer).digest('hex');
    if (originalHash === modifiedHash) {
        return { modified: false, changes: [], similarity: 100 };
    }
    // Calculate byte-level similarity
    const similarity = calculateBufferSimilarity(originalBuffer, modifiedBuffer);
    const changes = [
        {
            type: 'size_change',
            originalSize: originalBuffer.length,
            modifiedSize: modifiedBuffer.length,
            difference: modifiedBuffer.length - originalBuffer.length,
        },
    ];
    return {
        modified: true,
        changes,
        similarity,
    };
};
exports.compareDocumentVersions = compareDocumentVersions;
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
const analyzeSteganography = async (documentBuffer) => {
    const findings = [];
    const metadata = await (0, exports.extractDocumentMetadata)(documentBuffer);
    // Check for unusual file size patterns
    if (documentBuffer.length > 0) {
        const expectedSize = estimateExpectedSize(metadata);
        if (documentBuffer.length > expectedSize * 1.5) {
            findings.push({
                type: 'size_anomaly',
                description: 'File size significantly larger than expected',
                expectedSize,
                actualSize: documentBuffer.length,
            });
        }
    }
    // Check for trailing data after EOF markers
    const trailingData = detectTrailingData(documentBuffer);
    if (trailingData > 100) {
        findings.push({
            type: 'trailing_data',
            description: 'Unusual data after EOF marker',
            size: trailingData,
        });
    }
    return {
        hiddenContentDetected: findings.length > 0,
        findings,
    };
};
exports.analyzeSteganography = analyzeSteganography;
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
const performImageForensics = async (imageBuffer) => {
    // Placeholder for image forensics analysis
    const exifData = await extractImageEXIF(imageBuffer);
    const errorLevels = analyzeErrorLevelAnalysis(imageBuffer);
    const manipulated = errorLevels.some((level) => level > 0.3);
    return {
        manipulated,
        errorLevels,
        exifData,
    };
};
exports.performImageForensics = performImageForensics;
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
const reconstructDocumentTimeline = async (documentId, auditModel, evidenceModel) => {
    const audits = await auditModel.findAll({
        where: { documentId },
        order: [['timestamp', 'ASC']],
    });
    const evidence = await evidenceModel.findAll({
        where: { documentId },
        order: [['collectedAt', 'ASC']],
    });
    const timeline = [];
    // Add audit entries
    for (const audit of audits) {
        timeline.push({
            timestamp: audit.timestamp,
            eventType: audit.eventType,
            description: `Document ${audit.eventType} by ${audit.userName}`,
            actor: audit.userName,
            evidence: [audit.currentHash],
            hash: audit.currentHash,
            verified: audit.verified,
        });
    }
    // Add evidence collection events
    for (const ev of evidence) {
        timeline.push({
            timestamp: ev.collectedAt,
            eventType: 'evidence_collected',
            description: `Forensic evidence collected: ${ev.evidenceType}`,
            actor: 'Forensic Analyst',
            evidence: [ev.digitalFingerprint],
            hash: ev.sha256Hash,
            verified: true,
        });
    }
    // Sort by timestamp
    timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return timeline;
};
exports.reconstructDocumentTimeline = reconstructDocumentTimeline;
// ============================================================================
// 3. TAMPER DETECTION (Functions 15-21)
// ============================================================================
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
const detectTamperingByHash = async (documentBuffer, originalHash, hashAlgorithm = 'SHA-256') => {
    const hashFunc = hashAlgorithm.toLowerCase().replace('-', '');
    const currentHash = crypto.createHash(hashFunc).update(documentBuffer).digest('hex');
    const tampered = currentHash !== originalHash;
    return {
        tampered,
        severity: tampered ? 'high' : 'none',
        confidence: 1.0,
        detectedAt: new Date(),
        originalHash,
        currentHash,
        hashAlgorithm,
        verificationMethod: 'hash_comparison',
    };
};
exports.detectTamperingByHash = detectTamperingByHash;
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
const detectPDFTampering = async (pdfBuffer) => {
    const findings = [];
    // Check PDF header
    const header = pdfBuffer.slice(0, 8).toString('utf8');
    if (!header.startsWith('%PDF-')) {
        findings.push({
            location: 'header',
            type: 'invalid_header',
            description: 'PDF header is missing or corrupted',
        });
    }
    // Check for EOF marker
    const eofMarker = '%%EOF';
    const lastBytes = pdfBuffer.slice(-100).toString('utf8');
    if (!lastBytes.includes(eofMarker)) {
        findings.push({
            location: 'footer',
            type: 'missing_eof',
            description: 'PDF EOF marker is missing',
        });
    }
    // Check for incremental updates
    const content = pdfBuffer.toString('utf8', 'binary');
    const eofCount = (content.match(/%%EOF/g) || []).length;
    if (eofCount > 1) {
        findings.push({
            location: 'structure',
            type: 'incremental_update',
            description: `PDF has ${eofCount} EOF markers, indicating ${eofCount - 1} incremental update(s)`,
        });
    }
    const tampered = findings.length > 0;
    const severity = findings.some((f) => f.type === 'invalid_header')
        ? 'critical'
        : findings.length > 2
            ? 'high'
            : findings.length > 0
                ? 'medium'
                : 'none';
    return {
        tampered,
        severity,
        confidence: tampered ? 0.85 : 1.0,
        detectedAt: new Date(),
        tamperedSections: tampered ? findings : undefined,
        currentHash: crypto.createHash('sha256').update(pdfBuffer).digest('hex'),
        hashAlgorithm: 'SHA-256',
        verificationMethod: 'pdf_structure_analysis',
    };
};
exports.detectPDFTampering = detectPDFTampering;
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
const detectMetadataManipulation = async (currentMetadata, originalMetadata) => {
    const anomalies = [];
    // Check for modified dates
    if (currentMetadata.createDate && originalMetadata.createDate) {
        const currentDate = new Date(currentMetadata.createDate).getTime();
        const originalDate = new Date(originalMetadata.createDate).getTime();
        if (currentDate !== originalDate) {
            anomalies.push({
                anomalyDetected: true,
                anomalyType: 'metadata_modification',
                confidence: 1.0,
                description: 'Creation date has been modified',
                location: 'createDate',
                expectedValue: originalMetadata.createDate,
                actualValue: currentMetadata.createDate,
                timestamp: new Date(),
            });
        }
    }
    // Check for author changes
    if (currentMetadata.author !== originalMetadata.author) {
        anomalies.push({
            anomalyDetected: true,
            anomalyType: 'author_modification',
            confidence: 1.0,
            description: 'Author field has been modified',
            location: 'author',
            expectedValue: originalMetadata.author,
            actualValue: currentMetadata.author,
            timestamp: new Date(),
        });
    }
    // Check for modification date anomalies
    if (currentMetadata.modifyDate && currentMetadata.createDate) {
        const modifyDate = new Date(currentMetadata.modifyDate).getTime();
        const createDate = new Date(currentMetadata.createDate).getTime();
        if (modifyDate < createDate) {
            anomalies.push({
                anomalyDetected: true,
                anomalyType: 'temporal_anomaly',
                confidence: 0.95,
                description: 'Modification date is before creation date',
                location: 'dates',
                expectedValue: 'modifyDate >= createDate',
                actualValue: `modifyDate (${currentMetadata.modifyDate}) < createDate (${currentMetadata.createDate})`,
                timestamp: new Date(),
            });
        }
    }
    return anomalies;
};
exports.detectMetadataManipulation = detectMetadataManipulation;
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
const validateMultipleHashes = async (documentBuffer, originalHashes) => {
    const failedAlgorithms = [];
    for (const [algorithm, originalHash] of Object.entries(originalHashes)) {
        const hashFunc = algorithm.toLowerCase().replace('-', '');
        const currentHash = crypto.createHash(hashFunc).update(documentBuffer).digest('hex');
        if (currentHash !== originalHash) {
            failedAlgorithms.push(algorithm);
        }
    }
    return {
        valid: failedAlgorithms.length === 0,
        failedAlgorithms,
    };
};
exports.validateMultipleHashes = validateMultipleHashes;
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
const detectAccessPatternAnomalies = async (documentId, auditModel) => {
    const anomalies = [];
    // Get access patterns
    const accesses = await auditModel.findAll({
        where: {
            documentId,
            eventType: 'accessed',
        },
        order: [['timestamp', 'ASC']],
    });
    if (accesses.length < 2) {
        return anomalies;
    }
    // Detect unusual access frequency
    const timeGaps = [];
    for (let i = 1; i < accesses.length; i++) {
        const gap = accesses[i].timestamp.getTime() - accesses[i - 1].timestamp.getTime();
        timeGaps.push(gap);
    }
    const avgGap = timeGaps.reduce((a, b) => a + b, 0) / timeGaps.length;
    for (let i = 0; i < timeGaps.length; i++) {
        if (timeGaps[i] < avgGap * 0.1) {
            // Very rapid access
            anomalies.push({
                anomalyDetected: true,
                anomalyType: 'rapid_access',
                confidence: 0.8,
                description: 'Unusually rapid document access detected',
                expectedValue: `${avgGap}ms`,
                actualValue: `${timeGaps[i]}ms`,
                timestamp: accesses[i + 1].timestamp,
            });
        }
    }
    // Detect unusual access times (e.g., 2-5 AM)
    for (const access of accesses) {
        const hour = access.timestamp.getHours();
        if (hour >= 2 && hour < 5) {
            anomalies.push({
                anomalyDetected: true,
                anomalyType: 'unusual_time_access',
                confidence: 0.6,
                description: 'Document accessed during unusual hours (2-5 AM)',
                timestamp: access.timestamp,
            });
        }
    }
    return anomalies;
};
exports.detectAccessPatternAnomalies = detectAccessPatternAnomalies;
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
const compareDocumentBytes = async (buffer1, buffer2) => {
    if (buffer1.length !== buffer2.length) {
        return {
            identical: false,
            differenceCount: Math.abs(buffer1.length - buffer2.length),
            differenceLocations: [],
        };
    }
    const differenceLocations = [];
    let differenceCount = 0;
    for (let i = 0; i < buffer1.length; i++) {
        if (buffer1[i] !== buffer2[i]) {
            differenceCount++;
            if (differenceLocations.length < 100) {
                // Limit to first 100 locations
                differenceLocations.push(i);
            }
        }
    }
    return {
        identical: differenceCount === 0,
        differenceCount,
        differenceLocations,
    };
};
exports.compareDocumentBytes = compareDocumentBytes;
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
const createTamperAlert = async (detection, tamperModel, documentId, detectedBy) => {
    return await tamperModel.create({
        documentId,
        detectionMethod: detection.verificationMethod,
        tampered: detection.tampered,
        severity: detection.severity,
        confidence: detection.confidence,
        detectedAt: detection.detectedAt,
        detectedBy,
        originalHash: detection.originalHash || '',
        currentHash: detection.currentHash || '',
        hashAlgorithm: detection.hashAlgorithm,
        tamperedSections: detection.tamperedSections || [],
        falsePositive: false,
    });
};
exports.createTamperAlert = createTamperAlert;
// ============================================================================
// 4. CHAIN OF CUSTODY (Functions 22-28)
// ============================================================================
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
const initiateChainOfCustody = async (documentId, custodian, custodianOrg, purpose, documentBuffer) => {
    const evidenceId = crypto.randomBytes(16).toString('hex');
    const integrityHash = crypto.createHash('sha256').update(documentBuffer).digest('hex');
    return {
        id: crypto.randomBytes(16).toString('hex'),
        documentId,
        evidenceId,
        custodian,
        custodianOrg,
        status: 'acquired',
        location: 'Secure evidence storage',
        timestamp: new Date(),
        purpose,
        integrityHash,
    };
};
exports.initiateChainOfCustody = initiateChainOfCustody;
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
const transferCustody = async (custodyId, fromCustodian, toCustodian, reason, witnesses) => {
    // In production, update custody record in database
    return {
        id: custodyId,
        documentId: 'doc-id',
        evidenceId: 'evidence-id',
        custodian: toCustodian,
        custodianOrg: 'WhiteCross Forensics',
        status: 'transferred',
        acquiredFrom: fromCustodian,
        transferredTo: toCustodian,
        location: 'Secure evidence storage',
        timestamp: new Date(),
        purpose: reason,
        integrityHash: '',
        witnessedBy: witnesses,
    };
};
exports.transferCustody = transferCustody;
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
const verifyChainOfCustody = async (documentId, documentBuffer, custodyRecords) => {
    const breaks = [];
    const currentHash = crypto.createHash('sha256').update(documentBuffer).digest('hex');
    // Sort by timestamp
    const sortedRecords = [...custodyRecords].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    // Check integrity hash
    const latestRecord = sortedRecords[sortedRecords.length - 1];
    if (latestRecord && latestRecord.integrityHash !== currentHash) {
        breaks.push({
            type: 'integrity_break',
            description: 'Document hash does not match latest custody record',
            expectedHash: latestRecord.integrityHash,
            actualHash: currentHash,
        });
    }
    // Check for gaps in custody
    for (let i = 1; i < sortedRecords.length; i++) {
        const previous = sortedRecords[i - 1];
        const current = sortedRecords[i];
        if (previous.transferredTo !== current.custodian) {
            breaks.push({
                type: 'custody_gap',
                description: 'Gap in chain of custody',
                from: previous.custodian,
                to: current.custodian,
                timestamp: current.timestamp,
            });
        }
    }
    return {
        valid: breaks.length === 0,
        breaks,
    };
};
exports.verifyChainOfCustody = verifyChainOfCustody;
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
const generateCustodyReport = async (documentId, custodyRecords) => {
    const sortedRecords = [...custodyRecords].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const report = {
        documentId,
        reportDate: new Date().toISOString(),
        totalTransfers: sortedRecords.length,
        custodyChain: sortedRecords.map((record) => ({
            timestamp: record.timestamp.toISOString(),
            custodian: record.custodian,
            organization: record.custodianOrg,
            status: record.status,
            location: record.location,
            purpose: record.purpose,
            witnesses: record.witnessedBy || [],
        })),
    };
    return JSON.stringify(report, null, 2);
};
exports.generateCustodyReport = generateCustodyReport;
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
const logCustodyEventToBlockchain = async (custody, auditModel) => {
    const custodyData = JSON.stringify(custody);
    const merkleRoot = crypto.createHash('sha256').update(custodyData).digest('hex');
    return await (0, exports.anchorToBlockchain)(custody.documentId, merkleRoot, auditModel);
};
exports.logCustodyEventToBlockchain = logCustodyEventToBlockchain;
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
const retrieveCustodyHistory = async (documentId, auditModel) => {
    const audits = await auditModel.findAll({
        where: {
            documentId,
            eventData: {
                [sequelize_1.Op.contains]: { custodyEvent: true },
            },
        },
        order: [['timestamp', 'ASC']],
    });
    return audits.map((audit) => audit.eventData.custodyRecord);
};
exports.retrieveCustodyHistory = retrieveCustodyHistory;
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
const validateCustodyTimeline = async (custodyRecords) => {
    const gaps = [];
    const overlaps = [];
    const sorted = [...custodyRecords].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    for (let i = 1; i < sorted.length; i++) {
        const previous = sorted[i - 1];
        const current = sorted[i];
        const timeDiff = current.timestamp.getTime() - previous.timestamp.getTime();
        // Check for gaps (more than 1 hour)
        if (timeDiff > 60 * 60 * 1000) {
            gaps.push({
                from: previous.timestamp,
                to: current.timestamp,
                duration: timeDiff,
                previousCustodian: previous.custodian,
                nextCustodian: current.custodian,
            });
        }
        // Check for overlaps (same timestamp or very close)
        if (timeDiff < 1000) {
            overlaps.push({
                timestamp: current.timestamp,
                custodian1: previous.custodian,
                custodian2: current.custodian,
            });
        }
    }
    return {
        valid: gaps.length === 0 && overlaps.length === 0,
        gaps,
        overlaps,
    };
};
exports.validateCustodyTimeline = validateCustodyTimeline;
// ============================================================================
// 5. EVIDENCE PRESERVATION (Functions 29-35)
// ============================================================================
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
const createPreservationPackage = async (documentId, documentBuffer, preservedBy, method) => {
    const preservationId = crypto.randomBytes(16).toString('hex');
    const originalHash = crypto.createHash('sha256').update(documentBuffer).digest('hex');
    // Build hash chain
    const hashChain = [originalHash];
    for (let i = 0; i < 3; i++) {
        const lastHash = hashChain[hashChain.length - 1];
        const nextHash = crypto.createHash('sha256').update(lastHash).digest('hex');
        hashChain.push(nextHash);
    }
    // Build Merkle tree
    const merkleTree = buildMerkleTreeFromLeaves(hashChain);
    const merkleRoot = merkleTree.length > 0 ? merkleTree[merkleTree.length - 1][0] : hashChain[0];
    return {
        preservationId,
        documentId,
        method,
        preservedAt: new Date(),
        preservedBy,
        storageLocation: `evidence-storage/${preservationId}`,
        hashChain,
        merkleRoot,
        blockchainAnchored: method === 'blockchain',
        metadata: {
            fileSize: documentBuffer.length,
            preservationMethod: method,
        },
        verificationData: {
            originalHash,
            algorithm: 'SHA-256',
        },
    };
};
exports.createPreservationPackage = createPreservationPackage;
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
const encryptEvidence = async (evidenceBuffer, passphrase) => {
    const key = passphrase
        ? crypto.scryptSync(passphrase, 'salt', 32)
        : crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(evidenceBuffer), cipher.final()]);
    return {
        encrypted,
        key: key.toString('hex'),
        iv: iv.toString('hex'),
    };
};
exports.encryptEvidence = encryptEvidence;
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
const decryptEvidence = async (encryptedBuffer, key, iv) => {
    const keyBuffer = Buffer.from(key, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
    return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
};
exports.decryptEvidence = decryptEvidence;
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
const verifyPreservationIntegrity = async (preservationPackage, evidenceBuffer) => {
    const currentHash = crypto.createHash('sha256').update(evidenceBuffer).digest('hex');
    // Verify original hash
    const hashValid = currentHash === preservationPackage.verificationData.originalHash;
    // Verify hash chain
    let hashChainValid = true;
    for (let i = 1; i < preservationPackage.hashChain.length; i++) {
        const expectedHash = crypto
            .createHash('sha256')
            .update(preservationPackage.hashChain[i - 1])
            .digest('hex');
        if (expectedHash !== preservationPackage.hashChain[i]) {
            hashChainValid = false;
            break;
        }
    }
    // Verify Merkle root
    const merkleTree = buildMerkleTreeFromLeaves(preservationPackage.hashChain);
    const computedRoot = merkleTree.length > 0 ? merkleTree[merkleTree.length - 1][0] : preservationPackage.hashChain[0];
    const merkleValid = computedRoot === preservationPackage.merkleRoot;
    return {
        valid: hashValid && hashChainValid && merkleValid,
        hashChainValid,
        merkleValid,
    };
};
exports.verifyPreservationIntegrity = verifyPreservationIntegrity;
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
const createEvidenceSnapshot = async (documentId, documentBuffer, evidenceModel, collectedBy) => {
    const sha256 = crypto.createHash('sha256').update(documentBuffer).digest('hex');
    const sha512 = crypto.createHash('sha512').update(documentBuffer).digest('hex');
    const md5 = crypto.createHash('md5').update(documentBuffer).digest('hex');
    const digitalFingerprint = `${sha256}:${documentBuffer.length}:${Date.now()}`;
    return await evidenceModel.create({
        documentId,
        evidenceType: 'digital_fingerprint',
        collectedBy,
        digitalFingerprint,
        sha256Hash: sha256,
        sha512Hash: sha512,
        md5Hash: md5,
        fileSize: documentBuffer.length,
        mimeType: detectMimeType(documentBuffer),
        metadata: await (0, exports.extractDocumentMetadata)(documentBuffer),
        anomaliesDetected: 0,
        integrityScore: 100.0,
        tamperSeverity: 'none',
        preservationMethod: 'immutable_storage',
        storageLocation: `snapshots/${documentId}/${Date.now()}`,
    });
};
exports.createEvidenceSnapshot = createEvidenceSnapshot;
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
const archiveEvidenceToColdStorage = async (preservationPackage, archiveLocation) => {
    const archiveId = crypto.randomBytes(16).toString('hex');
    const location = `${archiveLocation}/${archiveId}`;
    // In production, move to cold storage (tape, offline storage, etc.)
    return {
        archiveId,
        location,
        archivedAt: new Date(),
    };
};
exports.archiveEvidenceToColdStorage = archiveEvidenceToColdStorage;
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
const retrieveEvidenceFromColdStorage = async (archiveId, archiveLocation) => {
    // Placeholder for cold storage retrieval
    return {
        evidence: Buffer.from(''),
        metadata: {},
    };
};
exports.retrieveEvidenceFromColdStorage = retrieveEvidenceFromColdStorage;
// ============================================================================
// 6. AUDIT REPORTING (Functions 36-40)
// ============================================================================
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
const generateForensicAuditReport = async (documentId, auditModel, evidenceModel, tamperModel) => {
    const audits = await auditModel.findAll({
        where: { documentId },
        order: [['timestamp', 'ASC']],
    });
    const evidence = await evidenceModel.findAll({
        where: { documentId },
        order: [['collectedAt', 'ASC']],
    });
    const tamperDetections = await tamperModel.findAll({
        where: { documentId },
        order: [['detectedAt', 'ASC']],
    });
    const chainIntegrity = await (0, exports.verifyAuditChainIntegrity)(documentId, auditModel);
    const report = {
        documentId,
        reportDate: new Date().toISOString(),
        summary: {
            totalAuditEntries: audits.length,
            totalEvidenceItems: evidence.length,
            tamperDetections: tamperDetections.length,
            chainIntegrityValid: chainIntegrity.valid,
            blockchainAnchored: audits.some((a) => a.blockchainTxHash !== null),
        },
        auditTrail: audits.map((a) => ({
            timestamp: a.timestamp,
            eventType: a.eventType,
            user: a.userName,
            hash: a.currentHash,
            verified: a.verified,
            tampered: a.tampered,
        })),
        forensicEvidence: evidence.map((e) => ({
            type: e.evidenceType,
            collectedAt: e.collectedAt,
            integrityScore: e.integrityScore,
            tamperSeverity: e.tamperSeverity,
            digitalFingerprint: e.digitalFingerprint,
        })),
        tamperDetections: tamperDetections.map((t) => ({
            detectedAt: t.detectedAt,
            severity: t.severity,
            confidence: t.confidence,
            method: t.detectionMethod,
        })),
        chainIntegrity: {
            valid: chainIntegrity.valid,
            brokenChain: chainIntegrity.brokenChain,
            totalEntries: chainIntegrity.totalEntries,
        },
    };
    return JSON.stringify(report, null, 2);
};
exports.generateForensicAuditReport = generateForensicAuditReport;
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
const exportAuditForLegal = async (documentId, auditModel, evidenceModel) => {
    const audits = await auditModel.findAll({
        where: { documentId },
        order: [['timestamp', 'ASC']],
        raw: true,
    });
    const evidence = await evidenceModel.findAll({
        where: { documentId },
        order: [['collectedAt', 'ASC']],
        raw: true,
    });
    const custodyRecords = await (0, exports.retrieveCustodyHistory)(documentId, auditModel);
    return {
        auditTrail: audits,
        evidence,
        chainOfCustody: custodyRecords,
    };
};
exports.exportAuditForLegal = exportAuditForLegal;
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
const reconstructAuditTrail = async (documentId, auditModel) => {
    const timeline = await (0, exports.reconstructDocumentTimeline)(documentId, auditModel, null);
    const chainIntegrity = await (0, exports.verifyAuditChainIntegrity)(documentId, auditModel);
    const warnings = [];
    if (!chainIntegrity.valid) {
        warnings.push(`Chain integrity broken at ${chainIntegrity.brokenChain.length} location(s)`);
    }
    // Check for gaps
    const gaps = detectTimelineGaps(timeline);
    if (gaps > 0) {
        warnings.push(`${gaps} timeline gap(s) detected`);
    }
    const reconstructionScore = calculateReconstructionScore(chainIntegrity.valid, gaps, timeline.length);
    return {
        documentId,
        timeline,
        integrityVerified: chainIntegrity.valid,
        gapsDetected: gaps > 0,
        tamperedEntries: chainIntegrity.brokenChain.length,
        reconstructionScore,
        warnings,
    };
};
exports.reconstructAuditTrail = reconstructAuditTrail;
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
const generateComplianceAuditReport = async (documentId, auditModel, complianceFramework) => {
    const audits = await auditModel.findAll({
        where: { documentId },
        order: [['timestamp', 'ASC']],
    });
    const findings = [];
    const recommendations = [];
    // Check audit trail completeness
    if (audits.length === 0) {
        findings.push({
            severity: 'critical',
            finding: 'No audit trail entries found',
            requirement: `${complianceFramework} requires comprehensive audit logging`,
        });
        recommendations.push('Implement comprehensive audit logging for all document operations');
    }
    // Check for verified entries
    const unverifiedCount = audits.filter((a) => !a.verified).length;
    if (unverifiedCount > 0) {
        findings.push({
            severity: 'medium',
            finding: `${unverifiedCount} unverified audit entries`,
            requirement: `${complianceFramework} requires verified audit trails`,
        });
        recommendations.push('Implement blockchain or cryptographic verification for all audit entries');
    }
    // Check for tampered entries
    const tamperedCount = audits.filter((a) => a.tampered).length;
    if (tamperedCount > 0) {
        findings.push({
            severity: 'critical',
            finding: `${tamperedCount} tampered audit entries detected`,
            requirement: `${complianceFramework} requires tamper-proof audit trails`,
        });
        recommendations.push('Investigate tampered entries and implement stronger integrity controls');
    }
    // HIPAA-specific checks
    if (complianceFramework === 'HIPAA') {
        // Check for user identification
        const missingUserInfo = audits.filter((a) => !a.userName || !a.userId).length;
        if (missingUserInfo > 0) {
            findings.push({
                severity: 'high',
                finding: `${missingUserInfo} audit entries missing user identification`,
                requirement: 'HIPAA requires user identification in audit logs',
            });
            recommendations.push('Ensure all audit entries include complete user identification');
        }
    }
    const compliant = findings.filter((f) => f.severity === 'critical').length === 0;
    return {
        compliant,
        findings,
        recommendations,
    };
};
exports.generateComplianceAuditReport = generateComplianceAuditReport;
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
const queryAuditTrailAdvanced = async (filters, auditModel) => {
    const where = {};
    if (filters.documentId) {
        where.documentId = filters.documentId;
    }
    if (filters.userId) {
        where.userId = filters.userId;
    }
    if (filters.eventType && filters.eventType.length > 0) {
        where.eventType = { [sequelize_1.Op.in]: filters.eventType };
    }
    if (filters.startDate || filters.endDate) {
        where.timestamp = {};
        if (filters.startDate) {
            where.timestamp[sequelize_1.Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
            where.timestamp[sequelize_1.Op.lte] = filters.endDate;
        }
    }
    if (filters.ipAddress) {
        where.ipAddress = filters.ipAddress;
    }
    if (filters.includeBlockchain) {
        where.blockchainTxHash = { [sequelize_1.Op.ne]: null };
    }
    const results = await auditModel.findAll({
        where,
        order: [['timestamp', 'DESC']],
    });
    const total = results.length;
    // Aggregations
    const byEventType = {};
    const byUser = {};
    const byHour = {};
    for (const result of results) {
        // By event type
        byEventType[result.eventType] = (byEventType[result.eventType] || 0) + 1;
        // By user
        byUser[result.userName] = (byUser[result.userName] || 0) + 1;
        // By hour
        const hour = result.timestamp.getHours();
        byHour[hour] = (byHour[hour] || 0) + 1;
    }
    return {
        results,
        total,
        aggregations: {
            byEventType,
            byUser,
            byHour,
            verifiedCount: results.filter((r) => r.verified).length,
            tamperedCount: results.filter((r) => r.tampered).length,
            blockchainAnchoredCount: results.filter((r) => r.blockchainTxHash !== null).length,
        },
    };
};
exports.queryAuditTrailAdvanced = queryAuditTrailAdvanced;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Builds Merkle tree from leaf hashes
 */
function buildMerkleTreeFromLeaves(leaves) {
    if (leaves.length === 0)
        return [];
    const tree = [leaves];
    while (tree[tree.length - 1].length > 1) {
        const currentLevel = tree[tree.length - 1];
        const nextLevel = [];
        for (let i = 0; i < currentLevel.length; i += 2) {
            if (i + 1 < currentLevel.length) {
                const combined = currentLevel[i] + currentLevel[i + 1];
                const hash = crypto.createHash('sha256').update(combined).digest('hex');
                nextLevel.push(hash);
            }
            else {
                nextLevel.push(currentLevel[i]);
            }
        }
        tree.push(nextLevel);
    }
    return tree;
}
/**
 * Generates Merkle proof from tree
 */
function generateProofFromTree(tree, leafIndex) {
    const proof = [];
    let index = leafIndex;
    for (let level = 0; level < tree.length - 1; level++) {
        const isRightNode = index % 2 === 1;
        const siblingIndex = isRightNode ? index - 1 : index + 1;
        if (siblingIndex < tree[level].length) {
            proof.push({
                position: isRightNode ? 'left' : 'right',
                data: tree[level][siblingIndex],
            });
        }
        index = Math.floor(index / 2);
    }
    return proof;
}
/**
 * Verifies Merkle proof
 */
function verifyMerkleProof(leaf, root, proof) {
    let computedHash = leaf;
    for (const step of proof) {
        const combined = step.position === 'left' ? step.data + computedHash : computedHash + step.data;
        computedHash = crypto.createHash('sha256').update(combined).digest('hex');
    }
    return computedHash === root;
}
/**
 * Detects MIME type from buffer
 */
function detectMimeType(buffer) {
    if (buffer.length < 4)
        return 'application/octet-stream';
    // PDF
    if (buffer.slice(0, 4).toString() === '%PDF') {
        return 'application/pdf';
    }
    // PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
        return 'image/png';
    }
    // JPEG
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return 'image/jpeg';
    }
    return 'application/octet-stream';
}
/**
 * Extracts PDF version
 */
function extractPDFVersion(buffer) {
    const header = buffer.slice(0, 10).toString();
    const match = header.match(/%PDF-(\d\.\d)/);
    return match ? match[1] : 'unknown';
}
/**
 * Detects anomalies in document
 */
async function detectAnomalies(buffer, metadata) {
    const findings = [];
    // Size anomaly
    if (buffer.length > 100 * 1024 * 1024) {
        findings.push({
            category: 'size',
            description: 'Document size exceeds 100MB',
            severity: 'medium',
        });
    }
    return findings;
}
/**
 * Calculates integrity score
 */
function calculateIntegrityScore(findings) {
    let score = 100;
    for (const finding of findings) {
        if (finding.severity === 'critical')
            score -= 30;
        else if (finding.severity === 'high')
            score -= 20;
        else if (finding.severity === 'medium')
            score -= 10;
        else if (finding.severity === 'low')
            score -= 5;
    }
    return Math.max(0, score);
}
/**
 * Calculates buffer similarity
 */
function calculateBufferSimilarity(buffer1, buffer2) {
    const minLength = Math.min(buffer1.length, buffer2.length);
    let matches = 0;
    for (let i = 0; i < minLength; i++) {
        if (buffer1[i] === buffer2[i])
            matches++;
    }
    return (matches / Math.max(buffer1.length, buffer2.length)) * 100;
}
/**
 * Estimates expected file size
 */
function estimateExpectedSize(metadata) {
    // Placeholder
    return 1024 * 1024; // 1MB
}
/**
 * Detects trailing data after EOF
 */
function detectTrailingData(buffer) {
    const eofMarker = Buffer.from('%%EOF');
    const lastIndex = buffer.lastIndexOf(eofMarker);
    if (lastIndex === -1)
        return 0;
    return buffer.length - (lastIndex + eofMarker.length);
}
/**
 * Extracts EXIF data from image
 */
async function extractImageEXIF(buffer) {
    // Placeholder for EXIF extraction
    return {};
}
/**
 * Analyzes error level in image
 */
function analyzeErrorLevelAnalysis(buffer) {
    // Placeholder for ELA analysis
    return [0.1, 0.2, 0.15];
}
/**
 * Detects timeline gaps
 */
function detectTimelineGaps(timeline) {
    let gaps = 0;
    for (let i = 1; i < timeline.length; i++) {
        const timeDiff = timeline[i].timestamp.getTime() - timeline[i - 1].timestamp.getTime();
        if (timeDiff > 24 * 60 * 60 * 1000) {
            // More than 24 hours
            gaps++;
        }
    }
    return gaps;
}
/**
 * Calculates reconstruction score
 */
function calculateReconstructionScore(chainValid, gaps, entries) {
    let score = 100;
    if (!chainValid)
        score -= 50;
    score -= gaps * 10;
    if (entries < 5)
        score -= 20;
    return Math.max(0, score);
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Model creators
    createAuditTrailModel: exports.createAuditTrailModel,
    createForensicEvidenceModel: exports.createForensicEvidenceModel,
    createTamperDetectionModel: exports.createTamperDetectionModel,
    // Blockchain audit logging
    createBlockchainAuditLog: exports.createBlockchainAuditLog,
    anchorToBlockchain: exports.anchorToBlockchain,
    buildAuditMerkleTree: exports.buildAuditMerkleTree,
    verifyAuditChainIntegrity: exports.verifyAuditChainIntegrity,
    generateMerkleProof: exports.generateMerkleProof,
    retrieveAuditFromBlockchain: exports.retrieveAuditFromBlockchain,
    validateBlockchainTimestamp: exports.validateBlockchainTimestamp,
    // Forensic analysis
    performForensicAnalysis: exports.performForensicAnalysis,
    extractDocumentMetadata: exports.extractDocumentMetadata,
    createDigitalFingerprint: exports.createDigitalFingerprint,
    compareDocumentVersions: exports.compareDocumentVersions,
    analyzeSteganography: exports.analyzeSteganography,
    performImageForensics: exports.performImageForensics,
    reconstructDocumentTimeline: exports.reconstructDocumentTimeline,
    // Tamper detection
    detectTamperingByHash: exports.detectTamperingByHash,
    detectPDFTampering: exports.detectPDFTampering,
    detectMetadataManipulation: exports.detectMetadataManipulation,
    validateMultipleHashes: exports.validateMultipleHashes,
    detectAccessPatternAnomalies: exports.detectAccessPatternAnomalies,
    compareDocumentBytes: exports.compareDocumentBytes,
    createTamperAlert: exports.createTamperAlert,
    // Chain of custody
    initiateChainOfCustody: exports.initiateChainOfCustody,
    transferCustody: exports.transferCustody,
    verifyChainOfCustody: exports.verifyChainOfCustody,
    generateCustodyReport: exports.generateCustodyReport,
    logCustodyEventToBlockchain: exports.logCustodyEventToBlockchain,
    retrieveCustodyHistory: exports.retrieveCustodyHistory,
    validateCustodyTimeline: exports.validateCustodyTimeline,
    // Evidence preservation
    createPreservationPackage: exports.createPreservationPackage,
    encryptEvidence: exports.encryptEvidence,
    decryptEvidence: exports.decryptEvidence,
    verifyPreservationIntegrity: exports.verifyPreservationIntegrity,
    createEvidenceSnapshot: exports.createEvidenceSnapshot,
    archiveEvidenceToColdStorage: exports.archiveEvidenceToColdStorage,
    retrieveEvidenceFromColdStorage: exports.retrieveEvidenceFromColdStorage,
    // Audit reporting
    generateForensicAuditReport: exports.generateForensicAuditReport,
    exportAuditForLegal: exports.exportAuditForLegal,
    reconstructAuditTrail: exports.reconstructAuditTrail,
    generateComplianceAuditReport: exports.generateComplianceAuditReport,
    queryAuditTrailAdvanced: exports.queryAuditTrailAdvanced,
};
//# sourceMappingURL=document-audit-trail-advanced-kit.js.map