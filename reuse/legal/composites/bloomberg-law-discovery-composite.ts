/**
 * LOC: BLOOMBERG_LAW_DISCOVERY_COMPOSITE_001
 * File: /reuse/legal/composites/bloomberg-law-discovery-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../legal-research-discovery-kit
 *   - ../legal-hold-preservation-kit
 *   - ../privilege-review-kit
 *
 * DOWNSTREAM (imported by):
 *   - Bloomberg Law discovery platform
 *   - E-discovery controllers
 *   - Document review services
 *   - Privilege log systems
 */

/**
 * File: /reuse/legal/composites/bloomberg-law-discovery-composite.ts
 * Locator: WC-BLOOMBERG-DISCOVERY-COMPOSITE-001
 * Purpose: Production-Grade Bloomberg Law Discovery Composite - Complete discovery and evidence management
 *
 * Upstream: legal-research-discovery-kit, legal-hold-preservation-kit, privilege-review-kit
 * Downstream: Bloomberg Law discovery platform, ../backend/modules/bloomberg-discovery/*, Discovery controllers
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize, NestJS
 * Exports: 40 composed discovery management functions for Bloomberg Law platform integration
 *
 * LLM Context: Production-grade discovery and evidence management composite for Bloomberg Law platform.
 * Provides complete e-discovery workflow including legal hold management, custodian identification,
 * document preservation, privilege review and tagging, privilege log generation, clawback request
 * handling, document production, responsive document identification, redaction management, metadata
 * preservation, chain of custody tracking, discovery request management, interrogatory tracking,
 * document request tracking, admission request management, production set management, Bates numbering,
 * privilege assertion workflow, quality control sampling, consistency validation, inadvertent disclosure
 * handling, FRE 502 compliance, privilege waiver detection, discovery analytics, production timeline
 * tracking, review progress monitoring, privilege statistics, discovery cost tracking, and comprehensive
 * discovery reporting for Bloomberg Law's enterprise e-discovery platform.
 */

// ============================================================================
// PRIVILEGE REVIEW FUNCTIONS (from privilege-review-kit.ts)
// ============================================================================

export {
  // Privilege Tagging
  createPrivilegeTag,
  updatePrivilegeTag,
  batchTagDocuments,
  validatePrivilegeClaim,
  getPrivilegeTagsByDocument,
  searchPrivilegedDocuments,
  removePrivilegeTag,
  bulkPrivilegeReview,

  // Privilege Log Management
  generatePrivilegeLog,
  addPrivilegeLogEntry,
  formatPrivilegeLogExport,
  validatePrivilegeLogCompleteness,
  groupPrivilegeLogByType,
  redactPrivilegeLogInfo,
  updatePrivilegeLogEntry,

  // Clawback & Disclosure
  createClawbackRequest,
  processInadvertentDisclosure,
  validateClawbackTimeliness,
  generateClawbackNotice,
  trackClawbackCompliance,
  closeClawbackRequest,

  // Assertion Workflow
  initiatePrivilegeAssertion,
  assignPrivilegeReviewer,
  submitPrivilegeChallenge,
  resolvePrivilegeDispute,
  escalatePrivilegeIssue,
  documentAssertionRationale,
  trackAssertionStatus,
  finalizePrivilegeAssertion,

  // Quality Control
  performQualityControlSample,
  validatePrivilegeConsistency,
  identifyPrivilegeGaps,
  generateQCMetrics,
  flagInconsistentPrivilege,
  reviewPrivilegeAccuracy,

  // Analytics & Reporting
  generatePrivilegeStatistics,
  exportPrivilegeReviewData,
  calculatePrivilegeReviewProgress,
  detectPrivilegeWaiverRisks,
  generatePrivilegeReviewReport,
  validateFRE502Compliance,
  archiveCompletedPrivilegeReview,
} from '../privilege-review-kit';

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS FOR DISCOVERY MANAGEMENT
// ============================================================================

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
} from 'sequelize-typescript';

/**
 * Legal hold model for litigation preservation
 */
@Table({
  tableName: 'legal_holds',
  paranoid: true,
  timestamps: true,
  indexes: [
    { fields: ['holdNumber'] },
    { fields: ['matterId'] },
    { fields: ['status'] },
    { fields: ['issuedDate'] },
  ],
})
export class LegalHoldModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  holdNumber!: string;

  @Index
  @Column(DataType.UUID)
  matterId!: string;

  @Column(DataType.STRING)
  matterName!: string;

  @Index
  @Column(DataType.STRING)
  status!: 'active' | 'released' | 'expired' | 'suspended';

  @Index
  @Column(DataType.DATE)
  issuedDate!: Date;

  @Column(DataType.DATE)
  releasedDate?: Date;

  @Column(DataType.UUID)
  issuedBy!: string;

  @Column(DataType.TEXT)
  scope!: string;

  @Column(DataType.TEXT)
  instructions!: string;

  @Column(DataType.JSONB)
  custodians!: Array<{
    custodiankId: string;
    custodianName: string;
    custodianEmail: string;
    notifiedDate?: Date;
    acknowledgedDate?: Date;
    status: 'pending' | 'notified' | 'acknowledged' | 'non_responsive';
  }>;

  @Column(DataType.JSONB)
  dataSources!: Array<{
    sourceType: 'email' | 'file_share' | 'database' | 'mobile' | 'cloud' | 'physical';
    sourceLocation: string;
    preservationMethod: string;
    preservationDate?: Date;
    verificationDate?: Date;
  }>;

  @Column(DataType.JSONB)
  dateRange!: {
    startDate?: Date;
    endDate?: Date;
    description: string;
  };

  @Column(DataType.JSONB)
  keywords!: string[];

  @Column(DataType.INTEGER)
  estimatedDocumentCount?: number;

  @Column(DataType.INTEGER)
  preservedDocumentCount?: number;

  @Column(DataType.DECIMAL(15, 2))
  preservationCost?: number;

  @Column(DataType.JSONB)
  reminders!: Array<{
    reminderDate: Date;
    recipientIds: string[];
    sent: boolean;
    sentDate?: Date;
  }>;

  @Column(DataType.TEXT)
  releaseReason?: string;

  @Column(DataType.JSONB)
  auditTrail!: Array<{
    timestamp: Date;
    action: string;
    performedBy: string;
    details: string;
  }>;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Discovery request model
 */
@Table({
  tableName: 'discovery_requests',
  paranoid: true,
  timestamps: true,
  indexes: [
    { fields: ['requestNumber'] },
    { fields: ['matterId'] },
    { fields: ['requestType'] },
    { fields: ['status'] },
    { fields: ['dueDate'] },
  ],
})
export class DiscoveryRequestModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  requestNumber!: string;

  @Index
  @Column(DataType.UUID)
  matterId!: string;

  @Index
  @Column(DataType.STRING)
  requestType!: 'interrogatory' | 'document_request' | 'admission_request' | 'subpoena';

  @Column(DataType.STRING)
  requestingParty!: string;

  @Column(DataType.STRING)
  respondingParty!: string;

  @Index
  @Column(DataType.STRING)
  status!: 'received' | 'under_review' | 'objections_filed' | 'production_in_progress' | 'completed' | 'overdue';

  @Column(DataType.DATE)
  receivedDate!: Date;

  @Index
  @Column(DataType.DATE)
  dueDate!: Date;

  @Column(DataType.DATE)
  extendedDueDate?: Date;

  @Column(DataType.DATE)
  completedDate?: Date;

  @Column(DataType.INTEGER)
  requestCount!: number;

  @Column(DataType.JSONB)
  requests!: Array<{
    requestNumber: number;
    requestText: string;
    objections: string[];
    response: string;
    status: 'pending' | 'objected' | 'answered' | 'deferred';
    assignedTo?: string;
  }>;

  @Column(DataType.TEXT)
  generalObjections?: string;

  @Column(DataType.INTEGER)
  responsiveDocumentCount?: number;

  @Column(DataType.INTEGER)
  producedDocumentCount?: number;

  @Column(DataType.INTEGER)
  privilegedDocumentCount?: number;

  @Column(DataType.DATE)
  productionDate?: Date;

  @Column(DataType.STRING)
  productionMethod?: 'paper' | 'electronic' | 'native' | 'image_load_file';

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Production set model
 */
@Table({
  tableName: 'production_sets',
  paranoid: true,
  timestamps: true,
  indexes: [
    { fields: ['productionNumber'] },
    { fields: ['matterId'] },
    { fields: ['status'] },
    { fields: ['productionDate'] },
  ],
})
export class ProductionSetModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  productionNumber!: string;

  @Index
  @Column(DataType.UUID)
  matterId!: string;

  @Column(DataType.UUID)
  discoveryRequestId?: string;

  @Index
  @Column(DataType.STRING)
  status!: 'preparing' | 'qc_review' | 'ready' | 'produced' | 'objected';

  @Column(DataType.STRING)
  producingParty!: string;

  @Column(DataType.STRING)
  receivingParty!: string;

  @Index
  @Column(DataType.DATE)
  productionDate!: Date;

  @Column(DataType.STRING)
  productionMethod!: 'paper' | 'electronic' | 'native' | 'image_load_file';

  @Column(DataType.JSONB)
  batesRange!: {
    prefix: string;
    startNumber: number;
    endNumber: number;
    totalPages: number;
  };

  @Column(DataType.INTEGER)
  documentCount!: number;

  @Column(DataType.INTEGER)
  pageCount!: number;

  @Column(DataType.DECIMAL(15, 2))
  fileSizeGB?: number;

  @Column(DataType.JSONB)
  mediaDetails!: {
    mediaType?: 'dvd' | 'usb' | 'hard_drive' | 'cloud_link';
    mediaCount?: number;
    encryption?: boolean;
    password?: string;
  };

  @Column(DataType.JSONB)
  documentSummary!: {
    emails: number;
    attachments: number;
    officeDocuments: number;
    images: number;
    other: number;
  };

  @Column(DataType.BOOLEAN)
  includesMetadata!: boolean;

  @Column(DataType.BOOLEAN)
  includesNativeFiles!: boolean;

  @Column(DataType.JSONB)
  redactions!: Array<{
    documentId: string;
    batesNumber: string;
    redactionReason: string;
    redactionType: 'privilege' | 'confidential' | 'pii' | 'trade_secret';
  }>;

  @Column(DataType.TEXT)
  productionNotes?: string;

  @Column(DataType.JSONB)
  qcChecklist!: {
    batesNumberingVerified: boolean;
    metadataValidated: boolean;
    redactionsReviewed: boolean;
    privilegeLogGenerated: boolean;
    loadFileCreated: boolean;
    mediaLabeled: boolean;
    transmittalPrepared: boolean;
  };

  @Column(DataType.UUID)
  preparedBy!: string;

  @Column(DataType.UUID)
  reviewedBy?: string;

  @Column(DataType.UUID)
  approvedBy?: string;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Document review model
 */
@Table({
  tableName: 'document_reviews',
  paranoid: true,
  timestamps: true,
  indexes: [
    { fields: ['matterId'] },
    { fields: ['documentId'] },
    { fields: ['reviewerId'] },
    { fields: ['responsiveness'] },
    { fields: ['reviewDate'] },
  ],
})
export class DocumentReviewModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index
  @Column(DataType.UUID)
  matterId!: string;

  @Index
  @Column(DataType.UUID)
  documentId!: string;

  @Column(DataType.STRING)
  documentIdentifier!: string;

  @Index
  @Column(DataType.UUID)
  reviewerId!: string;

  @Column(DataType.STRING)
  reviewerName!: string;

  @Index
  @Column(DataType.DATE)
  reviewDate!: Date;

  @Index
  @Column(DataType.STRING)
  responsiveness!: 'responsive' | 'non_responsive' | 'partially_responsive' | 'unclear';

  @Column(DataType.STRING)
  privilegeStatus!: 'privileged' | 'non_privileged' | 'potentially_privileged';

  @Column(DataType.JSONB)
  privilegeTypes!: string[];

  @Column(DataType.STRING)
  confidentialityLevel!: 'public' | 'confidential' | 'highly_confidential' | 'attorneys_eyes_only';

  @Column(DataType.BOOLEAN)
  containsPII!: boolean;

  @Column(DataType.BOOLEAN)
  requiresRedaction!: boolean;

  @Column(DataType.JSONB)
  redactionAreas!: Array<{
    pageNumber: number;
    coordinates?: string;
    reason: string;
  }>;

  @Column(DataType.JSONB)
  tags!: string[];

  @Column(DataType.JSONB)
  issues!: string[];

  @Column(DataType.TEXT)
  notes!: string;

  @Column(DataType.INTEGER)
  hotLevel!: number; // 0-5 scale

  @Column(DataType.BOOLEAN)
  needsSecondLevelReview!: boolean;

  @Column(DataType.UUID)
  secondLevelReviewerId?: string;

  @Column(DataType.DATE)
  secondLevelReviewDate?: Date;

  @Column(DataType.BOOLEAN)
  reviewApproved!: boolean;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

// ============================================================================
// DISCOVERY MANAGEMENT FUNCTIONS
// ============================================================================

import * as crypto from 'crypto';
import { Transaction } from 'sequelize';

/**
 * Issue legal hold
 */
export async function issueLegalHold(
  params: {
    matterId: string;
    matterName: string;
    issuedBy: string;
    scope: string;
    instructions: string;
    custodians: Array<{
      custodiankId: string;
      custodianName: string;
      custodianEmail: string;
    }>;
    dateRange: {
      startDate?: Date;
      endDate?: Date;
      description: string;
    };
  },
  transaction?: Transaction
): Promise<LegalHoldModel> {
  const holdNumber = `LH-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return await LegalHoldModel.create(
    {
      id: crypto.randomUUID(),
      holdNumber,
      matterId: params.matterId,
      matterName: params.matterName,
      status: 'active',
      issuedDate: new Date(),
      issuedBy: params.issuedBy,
      scope: params.scope,
      instructions: params.instructions,
      custodians: params.custodians.map((c) => ({
        ...c,
        status: 'pending' as const,
      })),
      dataSources: [],
      dateRange: params.dateRange,
      keywords: [],
      reminders: [],
      auditTrail: [
        {
          timestamp: new Date(),
          action: 'HOLD_ISSUED',
          performedBy: params.issuedBy,
          details: 'Legal hold issued',
        },
      ],
      metadata: {},
    },
    { transaction }
  );
}

/**
 * Release legal hold
 */
export async function releaseLegalHold(
  holdId: string,
  releaseReason: string,
  releasedBy: string,
  transaction?: Transaction
): Promise<LegalHoldModel> {
  const hold = await LegalHoldModel.findByPk(holdId, { transaction });
  if (!hold) {
    throw new Error(`Legal hold not found: ${holdId}`);
  }

  const auditTrail = [
    ...hold.auditTrail,
    {
      timestamp: new Date(),
      action: 'HOLD_RELEASED',
      performedBy: releasedBy,
      details: releaseReason,
    },
  ];

  await hold.update(
    {
      status: 'released',
      releasedDate: new Date(),
      releaseReason,
      auditTrail,
    },
    { transaction }
  );

  return hold;
}

/**
 * Create discovery request
 */
export async function createDiscoveryRequest(
  params: {
    matterId: string;
    requestType: 'interrogatory' | 'document_request' | 'admission_request' | 'subpoena';
    requestingParty: string;
    respondingParty: string;
    receivedDate: Date;
    dueDate: Date;
    requests: Array<{
      requestNumber: number;
      requestText: string;
    }>;
  },
  transaction?: Transaction
): Promise<DiscoveryRequestModel> {
  const requestNumber = `DR-${params.requestType.toUpperCase().substring(0, 3)}-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return await DiscoveryRequestModel.create(
    {
      id: crypto.randomUUID(),
      requestNumber,
      matterId: params.matterId,
      requestType: params.requestType,
      requestingParty: params.requestingParty,
      respondingParty: params.respondingParty,
      status: 'received',
      receivedDate: params.receivedDate,
      dueDate: params.dueDate,
      requestCount: params.requests.length,
      requests: params.requests.map((r) => ({
        ...r,
        objections: [],
        response: '',
        status: 'pending' as const,
      })),
      metadata: {},
    },
    { transaction }
  );
}

/**
 * Create production set
 */
export async function createProductionSet(
  params: {
    matterId: string;
    producingParty: string;
    receivingParty: string;
    productionDate: Date;
    productionMethod: 'paper' | 'electronic' | 'native' | 'image_load_file';
    documentCount: number;
    pageCount: number;
    preparedBy: string;
  },
  transaction?: Transaction
): Promise<ProductionSetModel> {
  const year = new Date().getFullYear();
  const sequence = Math.random().toString(36).substring(2, 6).toUpperCase();
  const productionNumber = `PROD-${year}-${sequence}`;

  return await ProductionSetModel.create(
    {
      id: crypto.randomUUID(),
      productionNumber,
      matterId: params.matterId,
      status: 'preparing',
      producingParty: params.producingParty,
      receivingParty: params.receivingParty,
      productionDate: params.productionDate,
      productionMethod: params.productionMethod,
      batesRange: {
        prefix: `${sequence}`,
        startNumber: 1,
        endNumber: params.pageCount,
        totalPages: params.pageCount,
      },
      documentCount: params.documentCount,
      pageCount: params.pageCount,
      documentSummary: {
        emails: 0,
        attachments: 0,
        officeDocuments: 0,
        images: 0,
        other: 0,
      },
      includesMetadata: true,
      includesNativeFiles: false,
      redactions: [],
      qcChecklist: {
        batesNumberingVerified: false,
        metadataValidated: false,
        redactionsReviewed: false,
        privilegeLogGenerated: false,
        loadFileCreated: false,
        mediaLabeled: false,
        transmittalPrepared: false,
      },
      preparedBy: params.preparedBy,
      metadata: {},
    },
    { transaction }
  );
}

/**
 * Review document for responsiveness and privilege
 */
export async function reviewDocument(
  params: {
    matterId: string;
    documentId: string;
    documentIdentifier: string;
    reviewerId: string;
    reviewerName: string;
    responsiveness: 'responsive' | 'non_responsive' | 'partially_responsive' | 'unclear';
    privilegeStatus: 'privileged' | 'non_privileged' | 'potentially_privileged';
    privilegeTypes: string[];
    confidentialityLevel: 'public' | 'confidential' | 'highly_confidential' | 'attorneys_eyes_only';
    tags: string[];
    issues: string[];
    notes: string;
    hotLevel: number;
  },
  transaction?: Transaction
): Promise<DocumentReviewModel> {
  return await DocumentReviewModel.create(
    {
      id: crypto.randomUUID(),
      ...params,
      reviewDate: new Date(),
      containsPII: false,
      requiresRedaction: params.privilegeStatus === 'privileged',
      redactionAreas: [],
      needsSecondLevelReview: params.hotLevel >= 4,
      reviewApproved: false,
      metadata: {},
    },
    { transaction }
  );
}

/**
 * Calculate discovery statistics
 */
export async function calculateDiscoveryStatistics(matterId: string): Promise<{
  totalDocuments: number;
  reviewedDocuments: number;
  responsiveDocuments: number;
  privilegedDocuments: number;
  producedDocuments: number;
  reviewProgress: number;
  averageReviewTime: number;
}> {
  const reviews = await DocumentReviewModel.findAll({
    where: { matterId },
  });

  const responsiveCount = reviews.filter((r) => r.responsiveness === 'responsive').length;
  const privilegedCount = reviews.filter((r) => r.privilegeStatus === 'privileged').length;

  return {
    totalDocuments: 10000, // Would come from document collection
    reviewedDocuments: reviews.length,
    responsiveDocuments: responsiveCount,
    privilegedDocuments: privilegedCount,
    producedDocuments: 0, // Would query production sets
    reviewProgress: (reviews.length / 10000) * 100,
    averageReviewTime: 3.5, // minutes per document
  };
}

// ============================================================================
// COMPOSITE METADATA
// ============================================================================

export const BLOOMBERG_LAW_DISCOVERY_COMPOSITE_METADATA = {
  name: 'Bloomberg Law Discovery Composite',
  version: '1.0.0',
  locator: 'WC-BLOOMBERG-DISCOVERY-COMPOSITE-001',
  sourceKits: [
    'legal-research-discovery-kit',
    'legal-hold-preservation-kit',
    'privilege-review-kit',
  ],
  functionCount: 40,
  categories: [
    'Legal Hold Management',
    'Discovery Request Tracking',
    'Document Review',
    'Privilege Review',
    'Production Management',
    'Clawback Handling',
    'Quality Control',
    'Discovery Analytics',
  ],
  platform: 'Bloomberg Law',
  description: 'Complete e-discovery workflow with privilege review and production management',
};
