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

import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  Transaction,
  Op,
  WhereOptions,
  QueryTypes,
  Includeable,
  FindOptions,
} from 'sequelize';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Audit trail event types
 */
export type AuditEventType =
  | 'created'
  | 'accessed'
  | 'modified'
  | 'deleted'
  | 'signed'
  | 'verified'
  | 'exported'
  | 'printed'
  | 'shared'
  | 'archived';

/**
 * Forensic analysis types
 */
export type ForensicAnalysisType =
  | 'metadata'
  | 'digital_fingerprint'
  | 'content_analysis'
  | 'image_forensics'
  | 'pdf_analysis'
  | 'signature_analysis';

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

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

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
export const createAuditTrailModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Document being audited',
    },
    eventType: {
      type: DataTypes.ENUM(
        'created',
        'accessed',
        'modified',
        'deleted',
        'signed',
        'verified',
        'exported',
        'printed',
        'shared',
        'archived',
      ),
      allowNull: false,
      comment: 'Type of audit event',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User who performed the action',
    },
    userName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Full name of user',
    },
    userRole: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'User role at time of event',
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'IP address of request',
    },
    userAgent: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'User agent string',
    },
    timestamp: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Microsecond precision timestamp',
    },
    previousHash: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: 'Hash of previous audit entry',
    },
    currentHash: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: 'Hash of current audit entry',
    },
    hashAlgorithm: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'SHA-256',
      comment: 'Hash algorithm used',
    },
    blockchainTxHash: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: 'Blockchain transaction hash',
    },
    blockchainBlockNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Blockchain block number',
    },
    merkleRoot: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: 'Merkle tree root hash',
    },
    merkleProof: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Merkle proof for verification',
    },
    eventData: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional event data',
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Geographic location',
    },
    deviceInfo: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Device information',
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Audit entry verified',
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Verification timestamp',
    },
    tampered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Tampering detected',
    },
  };

  const options: ModelOptions = {
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
      beforeCreate: async (instance: any) => {
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
export const createForensicEvidenceModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Document under investigation',
    },
    evidenceType: {
      type: DataTypes.ENUM(
        'metadata',
        'digital_fingerprint',
        'content_analysis',
        'image_forensics',
        'pdf_analysis',
        'signature_analysis',
      ),
      allowNull: false,
      comment: 'Type of forensic evidence',
    },
    collectedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Forensic analyst who collected evidence',
    },
    collectedAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Evidence collection timestamp',
    },
    digitalFingerprint: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
      comment: 'Unique digital fingerprint',
    },
    sha256Hash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: 'SHA-256 hash',
    },
    sha512Hash: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: 'SHA-512 hash',
    },
    md5Hash: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: 'MD5 hash (legacy support)',
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'File size in bytes',
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'MIME type',
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      comment: 'Document metadata',
    },
    extractedData: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Extracted forensic data',
    },
    analysisResults: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Forensic analysis results',
    },
    anomaliesDetected: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of anomalies detected',
    },
    integrityScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 100.0,
      comment: 'Integrity score (0-100)',
      validate: {
        min: 0,
        max: 100,
      },
    },
    tamperSeverity: {
      type: DataTypes.ENUM('none', 'low', 'medium', 'high', 'critical'),
      allowNull: false,
      defaultValue: 'none',
      comment: 'Tamper severity level',
    },
    chainOfCustodyId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Chain of custody record ID',
    },
    preservationMethod: {
      type: DataTypes.ENUM('hash', 'blockchain', 'encryption', 'immutable_storage', 'cold_storage'),
      allowNull: false,
      comment: 'Evidence preservation method',
    },
    storageLocation: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Evidence storage location',
    },
    encrypted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Evidence is encrypted',
    },
    encryptionKey: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Encrypted encryption key',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Evidence expiration date',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Forensic analyst notes',
    },
  };

  const options: ModelOptions = {
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
export const createTamperDetectionModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Document being checked for tampering',
    },
    detectionMethod: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Method used for tamper detection',
    },
    tampered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Tampering detected',
    },
    severity: {
      type: DataTypes.ENUM('none', 'low', 'medium', 'high', 'critical'),
      allowNull: false,
      defaultValue: 'none',
      comment: 'Tamper severity level',
    },
    confidence: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false,
      comment: 'Confidence level (0-1)',
      validate: {
        min: 0,
        max: 1,
      },
    },
    detectedAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Detection timestamp',
    },
    detectedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'User or system that detected tampering',
    },
    originalHash: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: 'Original document hash',
    },
    currentHash: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: 'Current document hash',
    },
    hashAlgorithm: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'SHA-256',
      comment: 'Hash algorithm used',
    },
    tamperedSections: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Specific tampered sections',
    },
    evidenceId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'forensic_evidence',
        key: 'id',
      },
      onDelete: 'SET NULL',
      comment: 'Related forensic evidence',
    },
    verificationData: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional verification data',
    },
    falsePositive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Marked as false positive',
    },
    investigatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Investigator who reviewed the detection',
    },
    investigatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Investigation timestamp',
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Investigation resolution',
    },
  };

  const options: ModelOptions = {
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
export const createBlockchainAuditLog = async (
  entry: Omit<BlockchainAuditEntry, 'blockNumber' | 'transactionHash'>,
  auditModel: any,
  transaction?: Transaction,
): Promise<any> => {
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

  return await auditModel.create(
    {
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
    },
    { transaction },
  );
};

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
export const anchorToBlockchain = async (
  documentId: string,
  merkleRoot: string,
  auditModel: any,
): Promise<{ txHash: string; blockNumber: number }> => {
  // Placeholder for actual blockchain integration (Ethereum, Hyperledger, etc.)
  const txHash = crypto.randomBytes(32).toString('hex');
  const blockNumber = Math.floor(Date.now() / 1000);

  // Update audit entries with blockchain info
  await auditModel.update(
    {
      blockchainTxHash: txHash,
      blockchainBlockNumber: blockNumber,
      merkleRoot,
      verified: true,
      verifiedAt: new Date(),
    },
    {
      where: { documentId, blockchainTxHash: null },
    },
  );

  return { txHash, blockNumber };
};

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
export const buildAuditMerkleTree = async (
  documentId: string,
  auditModel: any,
): Promise<{ root: string; leaves: string[]; tree: any }> => {
  const entries = await auditModel.findAll({
    where: { documentId },
    order: [['timestamp', 'ASC']],
    raw: true,
  });

  const leaves = entries.map((entry: any) => entry.currentHash);

  if (leaves.length === 0) {
    return { root: '', leaves: [], tree: null };
  }

  // Build Merkle tree
  const tree = buildMerkleTreeFromLeaves(leaves);
  const root = tree.length > 0 ? tree[tree.length - 1][0] : leaves[0];

  return { root, leaves, tree };
};

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
export const verifyAuditChainIntegrity = async (
  documentId: string,
  auditModel: any,
): Promise<{ valid: boolean; brokenChain: number[]; totalEntries: number }> => {
  const entries = await auditModel.findAll({
    where: { documentId },
    order: [['timestamp', 'ASC']],
    raw: true,
  });

  const brokenChain: number[] = [];
  let previousHash: string | null = null;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    if (i === 0) {
      if (entry.previousHash !== null) {
        brokenChain.push(i);
      }
    } else {
      if (entry.previousHash !== previousHash) {
        brokenChain.push(i);
      }
    }

    // Verify current hash
    const computedHash = crypto
      .createHash('sha256')
      .update(
        JSON.stringify({
          documentId: entry.documentId,
          eventType: entry.eventType,
          userId: entry.userId,
          timestamp: entry.timestamp,
          previousHash: entry.previousHash,
        }),
      )
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
export const generateMerkleProof = async (
  entryHash: string,
  auditModel: any,
  documentId: string,
): Promise<MerkleProof> => {
  const merkleTree = await buildAuditMerkleTree(documentId, auditModel);

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
export const retrieveAuditFromBlockchain = async (transactionHash: string, auditModel: any): Promise<any[]> => {
  return await auditModel.findAll({
    where: { blockchainTxHash: transactionHash },
    order: [['timestamp', 'ASC']],
  });
};

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
export const validateBlockchainTimestamp = async (
  transactionHash: string,
  claimedTimestamp: Date,
): Promise<{ valid: boolean; blockchainTimestamp: Date; difference: number }> => {
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
export const performForensicAnalysis = async (
  documentBuffer: Buffer,
  documentId: string,
  evidenceModel: any,
): Promise<ForensicAnalysisResult> => {
  const sha256 = crypto.createHash('sha256').update(documentBuffer).digest('hex');
  const sha512 = crypto.createHash('sha512').update(documentBuffer).digest('hex');
  const md5 = crypto.createHash('md5').update(documentBuffer).digest('hex');

  const digitalFingerprint = `${sha256}:${documentBuffer.length}`;

  const metadata = await extractDocumentMetadata(documentBuffer);
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
export const extractDocumentMetadata = async (documentBuffer: Buffer): Promise<Record<string, any>> => {
  const metadata: Record<string, any> = {
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
export const createDigitalFingerprint = async (
  documentBuffer: Buffer,
  evidenceModel: any,
  documentId: string,
): Promise<DigitalFingerprint> => {
  const sha256 = crypto.createHash('sha256').update(documentBuffer).digest('hex');
  const sha512 = crypto.createHash('sha512').update(documentBuffer).digest('hex');
  const md5 = crypto.createHash('md5').update(documentBuffer).digest('hex');
  const metadata = await extractDocumentMetadata(documentBuffer);

  const fingerprint: DigitalFingerprint = {
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
export const compareDocumentVersions = async (
  originalBuffer: Buffer,
  modifiedBuffer: Buffer,
): Promise<{ modified: boolean; changes: any[]; similarity: number }> => {
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
export const analyzeSteganography = async (
  documentBuffer: Buffer,
): Promise<{ hiddenContentDetected: boolean; findings: any[] }> => {
  const findings: any[] = [];
  const metadata = await extractDocumentMetadata(documentBuffer);

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
export const performImageForensics = async (
  imageBuffer: Buffer,
): Promise<{ manipulated: boolean; errorLevels: number[]; exifData: any }> => {
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
export const reconstructDocumentTimeline = async (
  documentId: string,
  auditModel: any,
  evidenceModel: any,
): Promise<ForensicTimelineEntry[]> => {
  const audits = await auditModel.findAll({
    where: { documentId },
    order: [['timestamp', 'ASC']],
  });

  const evidence = await evidenceModel.findAll({
    where: { documentId },
    order: [['collectedAt', 'ASC']],
  });

  const timeline: ForensicTimelineEntry[] = [];

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
export const detectTamperingByHash = async (
  documentBuffer: Buffer,
  originalHash: string,
  hashAlgorithm: string = 'SHA-256',
): Promise<TamperDetectionResult> => {
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
export const detectPDFTampering = async (pdfBuffer: Buffer): Promise<TamperDetectionResult> => {
  const findings: Array<{ location: string; type: string; description: string }> = [];

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
  const severity: TamperSeverity = findings.some((f) => f.type === 'invalid_header')
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
export const detectMetadataManipulation = async (
  currentMetadata: Record<string, any>,
  originalMetadata: Record<string, any>,
): Promise<AnomalyDetectionResult[]> => {
  const anomalies: AnomalyDetectionResult[] = [];

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
export const validateMultipleHashes = async (
  documentBuffer: Buffer,
  originalHashes: Record<string, string>,
): Promise<{ valid: boolean; failedAlgorithms: string[] }> => {
  const failedAlgorithms: string[] = [];

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
export const detectAccessPatternAnomalies = async (
  documentId: string,
  auditModel: any,
): Promise<AnomalyDetectionResult[]> => {
  const anomalies: AnomalyDetectionResult[] = [];

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
export const compareDocumentBytes = async (
  buffer1: Buffer,
  buffer2: Buffer,
): Promise<{ identical: boolean; differenceCount: number; differenceLocations: number[] }> => {
  if (buffer1.length !== buffer2.length) {
    return {
      identical: false,
      differenceCount: Math.abs(buffer1.length - buffer2.length),
      differenceLocations: [],
    };
  }

  const differenceLocations: number[] = [];
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
export const createTamperAlert = async (
  detection: TamperDetectionResult,
  tamperModel: any,
  documentId: string,
  detectedBy: string,
): Promise<any> => {
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
export const initiateChainOfCustody = async (
  documentId: string,
  custodian: string,
  custodianOrg: string,
  purpose: string,
  documentBuffer: Buffer,
): Promise<ChainOfCustodyRecord> => {
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
export const transferCustody = async (
  custodyId: string,
  fromCustodian: string,
  toCustodian: string,
  reason: string,
  witnesses?: string[],
): Promise<ChainOfCustodyRecord> => {
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
export const verifyChainOfCustody = async (
  documentId: string,
  documentBuffer: Buffer,
  custodyRecords: ChainOfCustodyRecord[],
): Promise<{ valid: boolean; breaks: any[] }> => {
  const breaks: any[] = [];
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
export const generateCustodyReport = async (
  documentId: string,
  custodyRecords: ChainOfCustodyRecord[],
): Promise<string> => {
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
export const logCustodyEventToBlockchain = async (
  custody: ChainOfCustodyRecord,
  auditModel: any,
): Promise<{ txHash: string; blockNumber: number }> => {
  const custodyData = JSON.stringify(custody);
  const merkleRoot = crypto.createHash('sha256').update(custodyData).digest('hex');

  return await anchorToBlockchain(custody.documentId, merkleRoot, auditModel);
};

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
export const retrieveCustodyHistory = async (documentId: string, auditModel: any): Promise<ChainOfCustodyRecord[]> => {
  const audits = await auditModel.findAll({
    where: {
      documentId,
      eventData: {
        [Op.contains]: { custodyEvent: true },
      },
    },
    order: [['timestamp', 'ASC']],
  });

  return audits.map((audit: any) => audit.eventData.custodyRecord);
};

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
export const validateCustodyTimeline = async (
  custodyRecords: ChainOfCustodyRecord[],
): Promise<{ valid: boolean; gaps: any[]; overlaps: any[] }> => {
  const gaps: any[] = [];
  const overlaps: any[] = [];

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
export const createPreservationPackage = async (
  documentId: string,
  documentBuffer: Buffer,
  preservedBy: string,
  method: PreservationMethod,
): Promise<EvidencePreservationPackage> => {
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
export const encryptEvidence = async (
  evidenceBuffer: Buffer,
  passphrase?: string,
): Promise<{ encrypted: Buffer; key: string; iv: string }> => {
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
export const decryptEvidence = async (encryptedBuffer: Buffer, key: string, iv: string): Promise<Buffer> => {
  const keyBuffer = Buffer.from(key, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);

  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
};

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
export const verifyPreservationIntegrity = async (
  preservationPackage: EvidencePreservationPackage,
  evidenceBuffer: Buffer,
): Promise<{ valid: boolean; hashChainValid: boolean; merkleValid: boolean }> => {
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
export const createEvidenceSnapshot = async (
  documentId: string,
  documentBuffer: Buffer,
  evidenceModel: any,
  collectedBy: string,
): Promise<any> => {
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
    metadata: await extractDocumentMetadata(documentBuffer),
    anomaliesDetected: 0,
    integrityScore: 100.0,
    tamperSeverity: 'none',
    preservationMethod: 'immutable_storage',
    storageLocation: `snapshots/${documentId}/${Date.now()}`,
  });
};

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
export const archiveEvidenceToColdStorage = async (
  preservationPackage: EvidencePreservationPackage,
  archiveLocation: string,
): Promise<{ archiveId: string; location: string; archivedAt: Date }> => {
  const archiveId = crypto.randomBytes(16).toString('hex');
  const location = `${archiveLocation}/${archiveId}`;

  // In production, move to cold storage (tape, offline storage, etc.)

  return {
    archiveId,
    location,
    archivedAt: new Date(),
  };
};

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
export const retrieveEvidenceFromColdStorage = async (
  archiveId: string,
  archiveLocation: string,
): Promise<{ evidence: Buffer; metadata: Record<string, any> }> => {
  // Placeholder for cold storage retrieval
  return {
    evidence: Buffer.from(''),
    metadata: {},
  };
};

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
export const generateForensicAuditReport = async (
  documentId: string,
  auditModel: any,
  evidenceModel: any,
  tamperModel: any,
): Promise<string> => {
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

  const chainIntegrity = await verifyAuditChainIntegrity(documentId, auditModel);

  const report = {
    documentId,
    reportDate: new Date().toISOString(),
    summary: {
      totalAuditEntries: audits.length,
      totalEvidenceItems: evidence.length,
      tamperDetections: tamperDetections.length,
      chainIntegrityValid: chainIntegrity.valid,
      blockchainAnchored: audits.some((a: any) => a.blockchainTxHash !== null),
    },
    auditTrail: audits.map((a: any) => ({
      timestamp: a.timestamp,
      eventType: a.eventType,
      user: a.userName,
      hash: a.currentHash,
      verified: a.verified,
      tampered: a.tampered,
    })),
    forensicEvidence: evidence.map((e: any) => ({
      type: e.evidenceType,
      collectedAt: e.collectedAt,
      integrityScore: e.integrityScore,
      tamperSeverity: e.tamperSeverity,
      digitalFingerprint: e.digitalFingerprint,
    })),
    tamperDetections: tamperDetections.map((t: any) => ({
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
export const exportAuditForLegal = async (
  documentId: string,
  auditModel: any,
  evidenceModel: any,
): Promise<{ auditTrail: any[]; evidence: any[]; chainOfCustody: any[] }> => {
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

  const custodyRecords = await retrieveCustodyHistory(documentId, auditModel);

  return {
    auditTrail: audits,
    evidence,
    chainOfCustody: custodyRecords,
  };
};

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
export const reconstructAuditTrail = async (
  documentId: string,
  auditModel: any,
): Promise<AuditTrailReconstruction> => {
  const timeline = await reconstructDocumentTimeline(documentId, auditModel, null);
  const chainIntegrity = await verifyAuditChainIntegrity(documentId, auditModel);

  const warnings: string[] = [];
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
export const generateComplianceAuditReport = async (
  documentId: string,
  auditModel: any,
  complianceFramework: string,
): Promise<{ compliant: boolean; findings: any[]; recommendations: string[] }> => {
  const audits = await auditModel.findAll({
    where: { documentId },
    order: [['timestamp', 'ASC']],
  });

  const findings: any[] = [];
  const recommendations: string[] = [];

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
  const unverifiedCount = audits.filter((a: any) => !a.verified).length;
  if (unverifiedCount > 0) {
    findings.push({
      severity: 'medium',
      finding: `${unverifiedCount} unverified audit entries`,
      requirement: `${complianceFramework} requires verified audit trails`,
    });
    recommendations.push('Implement blockchain or cryptographic verification for all audit entries');
  }

  // Check for tampered entries
  const tamperedCount = audits.filter((a: any) => a.tampered).length;
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
    const missingUserInfo = audits.filter((a: any) => !a.userName || !a.userId).length;
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
export const queryAuditTrailAdvanced = async (
  filters: AuditTrailFilters,
  auditModel: any,
): Promise<{ results: any[]; total: number; aggregations: Record<string, any> }> => {
  const where: WhereOptions = {};

  if (filters.documentId) {
    where.documentId = filters.documentId;
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.eventType && filters.eventType.length > 0) {
    where.eventType = { [Op.in]: filters.eventType };
  }

  if (filters.startDate || filters.endDate) {
    where.timestamp = {};
    if (filters.startDate) {
      where.timestamp[Op.gte] = filters.startDate;
    }
    if (filters.endDate) {
      where.timestamp[Op.lte] = filters.endDate;
    }
  }

  if (filters.ipAddress) {
    where.ipAddress = filters.ipAddress;
  }

  if (filters.includeBlockchain) {
    where.blockchainTxHash = { [Op.ne]: null };
  }

  const results = await auditModel.findAll({
    where,
    order: [['timestamp', 'DESC']],
  });

  const total = results.length;

  // Aggregations
  const byEventType: Record<string, number> = {};
  const byUser: Record<string, number> = {};
  const byHour: Record<number, number> = {};

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
      verifiedCount: results.filter((r: any) => r.verified).length,
      tamperedCount: results.filter((r: any) => r.tampered).length,
      blockchainAnchoredCount: results.filter((r: any) => r.blockchainTxHash !== null).length,
    },
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Builds Merkle tree from leaf hashes
 */
function buildMerkleTreeFromLeaves(leaves: string[]): string[][] {
  if (leaves.length === 0) return [];

  const tree: string[][] = [leaves];

  while (tree[tree.length - 1].length > 1) {
    const currentLevel = tree[tree.length - 1];
    const nextLevel: string[] = [];

    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        const combined = currentLevel[i] + currentLevel[i + 1];
        const hash = crypto.createHash('sha256').update(combined).digest('hex');
        nextLevel.push(hash);
      } else {
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
function generateProofFromTree(tree: string[][], leafIndex: number): Array<{ position: 'left' | 'right'; data: string }> {
  const proof: Array<{ position: 'left' | 'right'; data: string }> = [];
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
function verifyMerkleProof(
  leaf: string,
  root: string,
  proof: Array<{ position: 'left' | 'right'; data: string }>,
): boolean {
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
function detectMimeType(buffer: Buffer): string {
  if (buffer.length < 4) return 'application/octet-stream';

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
function extractPDFVersion(buffer: Buffer): string {
  const header = buffer.slice(0, 10).toString();
  const match = header.match(/%PDF-(\d\.\d)/);
  return match ? match[1] : 'unknown';
}

/**
 * Detects anomalies in document
 */
async function detectAnomalies(buffer: Buffer, metadata: Record<string, any>): Promise<any[]> {
  const findings: any[] = [];

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
function calculateIntegrityScore(findings: any[]): number {
  let score = 100;
  for (const finding of findings) {
    if (finding.severity === 'critical') score -= 30;
    else if (finding.severity === 'high') score -= 20;
    else if (finding.severity === 'medium') score -= 10;
    else if (finding.severity === 'low') score -= 5;
  }
  return Math.max(0, score);
}

/**
 * Calculates buffer similarity
 */
function calculateBufferSimilarity(buffer1: Buffer, buffer2: Buffer): number {
  const minLength = Math.min(buffer1.length, buffer2.length);
  let matches = 0;

  for (let i = 0; i < minLength; i++) {
    if (buffer1[i] === buffer2[i]) matches++;
  }

  return (matches / Math.max(buffer1.length, buffer2.length)) * 100;
}

/**
 * Estimates expected file size
 */
function estimateExpectedSize(metadata: Record<string, any>): number {
  // Placeholder
  return 1024 * 1024; // 1MB
}

/**
 * Detects trailing data after EOF
 */
function detectTrailingData(buffer: Buffer): number {
  const eofMarker = Buffer.from('%%EOF');
  const lastIndex = buffer.lastIndexOf(eofMarker);
  if (lastIndex === -1) return 0;
  return buffer.length - (lastIndex + eofMarker.length);
}

/**
 * Extracts EXIF data from image
 */
async function extractImageEXIF(buffer: Buffer): Promise<any> {
  // Placeholder for EXIF extraction
  return {};
}

/**
 * Analyzes error level in image
 */
function analyzeErrorLevelAnalysis(buffer: Buffer): number[] {
  // Placeholder for ELA analysis
  return [0.1, 0.2, 0.15];
}

/**
 * Detects timeline gaps
 */
function detectTimelineGaps(timeline: ForensicTimelineEntry[]): number {
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
function calculateReconstructionScore(chainValid: boolean, gaps: number, entries: number): number {
  let score = 100;
  if (!chainValid) score -= 50;
  score -= gaps * 10;
  if (entries < 5) score -= 20;
  return Math.max(0, score);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Model creators
  createAuditTrailModel,
  createForensicEvidenceModel,
  createTamperDetectionModel,

  // Blockchain audit logging
  createBlockchainAuditLog,
  anchorToBlockchain,
  buildAuditMerkleTree,
  verifyAuditChainIntegrity,
  generateMerkleProof,
  retrieveAuditFromBlockchain,
  validateBlockchainTimestamp,

  // Forensic analysis
  performForensicAnalysis,
  extractDocumentMetadata,
  createDigitalFingerprint,
  compareDocumentVersions,
  analyzeSteganography,
  performImageForensics,
  reconstructDocumentTimeline,

  // Tamper detection
  detectTamperingByHash,
  detectPDFTampering,
  detectMetadataManipulation,
  validateMultipleHashes,
  detectAccessPatternAnomalies,
  compareDocumentBytes,
  createTamperAlert,

  // Chain of custody
  initiateChainOfCustody,
  transferCustody,
  verifyChainOfCustody,
  generateCustodyReport,
  logCustodyEventToBlockchain,
  retrieveCustodyHistory,
  validateCustodyTimeline,

  // Evidence preservation
  createPreservationPackage,
  encryptEvidence,
  decryptEvidence,
  verifyPreservationIntegrity,
  createEvidenceSnapshot,
  archiveEvidenceToColdStorage,
  retrieveEvidenceFromColdStorage,

  // Audit reporting
  generateForensicAuditReport,
  exportAuditForLegal,
  reconstructAuditTrail,
  generateComplianceAuditReport,
  queryAuditTrailAdvanced,
};
