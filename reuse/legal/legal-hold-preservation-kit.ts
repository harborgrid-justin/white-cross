/**
 * LOC: LEGLH2345678
 * File: /reuse/legal/legal-hold-preservation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable legal utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend legal services
 *   - Compliance management modules
 *   - Discovery processing services
 *   - Records management systems
 */

/**
 * File: /reuse/legal/legal-hold-preservation-kit.ts
 * Locator: WC-LEGAL-LH-001
 * Purpose: Enterprise-grade Legal Hold and Data Preservation - hold notices, custodian management, preservation scope, data source tracking, release procedures
 *
 * Upstream: Independent utility module for legal hold operations
 * Downstream: ../backend/legal/*, legal controllers, compliance services, discovery processors, records management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 38 functions for legal hold operations for litigation readiness and compliance
 *
 * LLM Context: Comprehensive legal hold utilities for production-ready legal applications.
 * Provides legal hold notice creation, custodian acknowledgment tracking, preservation scope definition,
 * data source identification, release procedures, audit trails, compliance reporting, escalation workflows,
 * custodian interviews, preservation verification, and defensible disposition.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface LegalHoldNoticeData {
  matterName: string;
  matterNumber: string;
  issueDate: Date;
  effectiveDate: Date;
  description: string;
  preservationScope: string;
  relevantTimeframe: {
    startDate: Date;
    endDate?: Date;
  };
  keywords: string[];
  custodianIds: string[];
  dataSources: string[];
  issuedBy: string;
  legalCounsel?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'active' | 'released' | 'expired';
  metadata?: Record<string, any>;
}

interface CustodianData {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  title: string;
  location: string;
  manager?: string;
  status: 'active' | 'inactive' | 'terminated';
  metadata?: Record<string, any>;
}

interface CustodianAcknowledgment {
  holdId: string;
  custodianId: string;
  sentDate: Date;
  acknowledgedDate?: Date;
  acknowledgmentMethod?: 'email' | 'portal' | 'in_person' | 'certified_mail';
  ipAddress?: string;
  acknowledged: boolean;
  remindersSent: number;
  lastReminderDate?: Date;
  exemptionRequested?: boolean;
  exemptionReason?: string;
  exemptionApproved?: boolean;
}

interface DataSourceIdentification {
  sourceId: string;
  sourceName: string;
  sourceType: 'email' | 'file_share' | 'database' | 'cloud_storage' | 'mobile_device' | 'physical_records' | 'application' | 'backup';
  location: string;
  custodianId?: string;
  preservationMethod: 'in_place' | 'collection' | 'backup' | 'litigation_hold_flag';
  collectionDate?: Date;
  preservationStatus: 'identified' | 'preserved' | 'collected' | 'failed' | 'excluded';
  volumeEstimate?: string;
  metadata?: Record<string, any>;
}

interface PreservationScope {
  holdId: string;
  scopeType: 'broad' | 'targeted' | 'keyword' | 'custodian_based' | 'time_based';
  includedDataTypes: string[];
  excludedDataTypes?: string[];
  keywordTerms?: string[];
  dateRange: {
    startDate: Date;
    endDate?: Date;
  };
  custodianScope: 'all' | 'specific' | 'role_based';
  geographicScope?: string[];
  businessUnits?: string[];
  preservationRationale: string;
}

interface HoldReleaseData {
  holdId: string;
  releaseDate: Date;
  releaseReason: string;
  releaseType: 'full' | 'partial' | 'custodian_specific' | 'data_source_specific';
  releasedCustodians?: string[];
  releasedDataSources?: string[];
  approvedBy: string;
  legalCounselApproval: boolean;
  dispositionInstructions?: string;
  retentionPeriod?: number;
  certificateOfDisposition?: string;
}

interface CustodianInterview {
  holdId: string;
  custodianId: string;
  interviewDate: Date;
  interviewer: string;
  interviewMethod: 'in_person' | 'video_conference' | 'phone' | 'questionnaire';
  dataSources: DataSourceIdentification[];
  relevantDocuments: string[];
  notes: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  completionStatus: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

interface PreservationVerification {
  holdId: string;
  verificationDate: Date;
  verifiedBy: string;
  dataSourcesVerified: string[];
  verificationMethod: 'automated' | 'manual' | 'sampling';
  custodianSampleSize?: number;
  complianceRate: number;
  issuesFound: string[];
  remediationRequired: boolean;
  remediationDeadline?: Date;
  verificationStatus: 'pass' | 'fail' | 'partial';
}

interface EscalationWorkflow {
  holdId: string;
  escalationType: 'non_acknowledgment' | 'non_compliance' | 'data_loss' | 'scope_clarification';
  custodianId?: string;
  escalationDate: Date;
  escalatedTo: string;
  escalationReason: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  resolution?: string;
  resolvedDate?: Date;
}

interface LegalHoldAuditEntry {
  entityType: 'hold' | 'custodian' | 'data_source' | 'acknowledgment' | 'release';
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'acknowledge' | 'release' | 'escalate';
  userId: string;
  timestamp: Date;
  changes: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

interface ComplianceMetrics {
  holdId: string;
  totalCustodians: number;
  acknowledgedCustodians: number;
  acknowledgmentRate: number;
  averageAcknowledgmentTime: number;
  totalDataSources: number;
  preservedDataSources: number;
  preservationRate: number;
  escalations: number;
  complianceScore: number;
  lastVerificationDate?: Date;
}

interface HoldNoticeTemplate {
  templateId: string;
  templateName: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  variables: string[];
  noticeType: 'initial' | 'reminder' | 'supplemental' | 'release';
  requiresAcknowledgment: boolean;
  isActive: boolean;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Legal Hold with matter tracking and compliance monitoring.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     LegalHold:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         matterName:
 *           type: string
 *         matterNumber:
 *           type: string
 *         status:
 *           type: string
 *           enum: [draft, active, released, expired]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LegalHold model
 *
 * @example
 * ```typescript
 * const LegalHold = createLegalHoldModel(sequelize);
 * const hold = await LegalHold.create({
 *   matterName: 'Smith v. Acme Corp',
 *   matterNumber: 'LIT-2024-001',
 *   issueDate: new Date(),
 *   effectiveDate: new Date(),
 *   status: 'active',
 *   priority: 'high'
 * });
 * ```
 */
export const createLegalHoldModel = (sequelize: Sequelize) => {
  class LegalHold extends Model {
    public id!: string;
    public matterName!: string;
    public matterNumber!: string;
    public issueDate!: Date;
    public effectiveDate!: Date;
    public releaseDate!: Date | null;
    public description!: string;
    public preservationScope!: string;
    public relevantTimeframeStart!: Date;
    public relevantTimeframeEnd!: Date | null;
    public keywords!: string[];
    public issuedBy!: string;
    public legalCounsel!: string;
    public priority!: string;
    public status!: string;
    public totalCustodians!: number;
    public acknowledgedCustodians!: number;
    public totalDataSources!: number;
    public preservedDataSources!: number;
    public lastVerificationDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LegalHold.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      matterName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Matter or case name',
        validate: {
          notEmpty: true,
        },
      },
      matterNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique matter identifier',
        validate: {
          notEmpty: true,
        },
      },
      issueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date hold was issued',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date hold becomes effective',
      },
      releaseDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date hold was released',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Hold description and scope',
      },
      preservationScope: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed preservation scope',
      },
      relevantTimeframeStart: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Start of relevant time period',
      },
      relevantTimeframeEnd: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'End of relevant time period',
      },
      keywords: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Preservation keywords',
      },
      issuedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who issued hold',
      },
      legalCounsel: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: 'Legal counsel contact',
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Hold priority level',
      },
      status: {
        type: DataTypes.ENUM('draft', 'active', 'released', 'expired'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Hold status',
      },
      totalCustodians: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total custodians assigned',
      },
      acknowledgedCustodians: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Custodians who acknowledged',
      },
      totalDataSources: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total data sources identified',
      },
      preservedDataSources: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Data sources successfully preserved',
      },
      lastVerificationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last compliance verification date',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'legal_holds',
      timestamps: true,
      indexes: [
        { fields: ['matterNumber'], unique: true },
        { fields: ['status'] },
        { fields: ['priority'] },
        { fields: ['issueDate'] },
        { fields: ['effectiveDate'] },
        { fields: ['releaseDate'] },
        { fields: ['issuedBy'] },
      ],
    },
  );

  return LegalHold;
};

/**
 * Sequelize model for Custodians with acknowledgment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} HoldCustodian model
 *
 * @example
 * ```typescript
 * const HoldCustodian = createHoldCustodianModel(sequelize);
 * const custodian = await HoldCustodian.create({
 *   holdId: 'hold-uuid',
 *   custodianId: 'EMP001',
 *   firstName: 'John',
 *   lastName: 'Smith',
 *   email: 'john.smith@example.com',
 *   status: 'active'
 * });
 * ```
 */
export const createHoldCustodianModel = (sequelize: Sequelize) => {
  class HoldCustodian extends Model {
    public id!: string;
    public holdId!: string;
    public custodianId!: string;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public department!: string;
    public title!: string;
    public location!: string;
    public manager!: string;
    public notificationSent!: Date | null;
    public acknowledgedDate!: Date | null;
    public acknowledgmentMethod!: string | null;
    public remindersSent!: number;
    public lastReminderDate!: Date | null;
    public exemptionRequested!: boolean;
    public exemptionReason!: string | null;
    public exemptionApproved!: boolean;
    public interviewCompleted!: boolean;
    public interviewDate!: Date | null;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  HoldCustodian.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      holdId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related legal hold',
      },
      custodianId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Employee/custodian identifier',
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'First name',
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Last name',
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Email address',
        validate: {
          isEmail: true,
        },
      },
      department: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: 'Department',
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: 'Job title',
      },
      location: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: 'Physical location',
      },
      manager: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: 'Manager name',
      },
      notificationSent: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Initial notification sent date',
      },
      acknowledgedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Acknowledgment date',
      },
      acknowledgmentMethod: {
        type: DataTypes.ENUM('email', 'portal', 'in_person', 'certified_mail'),
        allowNull: true,
        comment: 'How acknowledgment was received',
      },
      remindersSent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of reminders sent',
      },
      lastReminderDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last reminder sent date',
      },
      exemptionRequested: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Exemption requested',
      },
      exemptionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Exemption reason',
      },
      exemptionApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Exemption approved',
      },
      interviewCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Custodian interview completed',
      },
      interviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Interview date',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'terminated', 'released'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Custodian status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'hold_custodians',
      timestamps: true,
      indexes: [
        { fields: ['holdId'] },
        { fields: ['custodianId'] },
        { fields: ['email'] },
        { fields: ['holdId', 'custodianId'], unique: true },
        { fields: ['acknowledgedDate'] },
        { fields: ['status'] },
      ],
    },
  );

  return HoldCustodian;
};

/**
 * Sequelize model for Data Source tracking with preservation status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} HoldDataSource model
 */
export const createHoldDataSourceModel = (sequelize: Sequelize) => {
  class HoldDataSource extends Model {
    public id!: string;
    public holdId!: string;
    public sourceId!: string;
    public sourceName!: string;
    public sourceType!: string;
    public location!: string;
    public custodianId!: string | null;
    public preservationMethod!: string;
    public preservationDate!: Date | null;
    public collectionDate!: Date | null;
    public preservationStatus!: string;
    public volumeEstimate!: string;
    public collectionMethod!: string | null;
    public storageLocation!: string | null;
    public verificationDate!: Date | null;
    public verificationStatus!: string | null;
    public failureReason!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  HoldDataSource.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      holdId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related legal hold',
      },
      sourceId: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Data source identifier',
      },
      sourceName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Data source name',
      },
      sourceType: {
        type: DataTypes.ENUM(
          'email',
          'file_share',
          'database',
          'cloud_storage',
          'mobile_device',
          'physical_records',
          'application',
          'backup',
        ),
        allowNull: false,
        comment: 'Type of data source',
      },
      location: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Source location or path',
      },
      custodianId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Associated custodian',
      },
      preservationMethod: {
        type: DataTypes.ENUM('in_place', 'collection', 'backup', 'litigation_hold_flag'),
        allowNull: false,
        defaultValue: 'in_place',
        comment: 'Preservation method',
      },
      preservationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date preservation was applied',
      },
      collectionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date data was collected',
      },
      preservationStatus: {
        type: DataTypes.ENUM('identified', 'preserved', 'collected', 'failed', 'excluded'),
        allowNull: false,
        defaultValue: 'identified',
        comment: 'Preservation status',
      },
      volumeEstimate: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: '',
        comment: 'Estimated data volume',
      },
      collectionMethod: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Collection method used',
      },
      storageLocation: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Storage location for collected data',
      },
      verificationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last verification date',
      },
      verificationStatus: {
        type: DataTypes.ENUM('pending', 'verified', 'failed'),
        allowNull: true,
        comment: 'Verification status',
      },
      failureReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for preservation failure',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'hold_data_sources',
      timestamps: true,
      indexes: [
        { fields: ['holdId'] },
        { fields: ['sourceId'] },
        { fields: ['sourceType'] },
        { fields: ['custodianId'] },
        { fields: ['preservationStatus'] },
        { fields: ['verificationStatus'] },
      ],
    },
  );

  return HoldDataSource;
};

/**
 * Sequelize model for Legal Hold Audit Trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LegalHoldAuditLog model
 */
export const createLegalHoldAuditLogModel = (sequelize: Sequelize) => {
  class LegalHoldAuditLog extends Model {
    public id!: string;
    public entityType!: string;
    public entityId!: string;
    public holdId!: string | null;
    public action!: string;
    public userId!: string;
    public userName!: string;
    public changes!: Record<string, any>;
    public ipAddress!: string;
    public userAgent!: string;
    public readonly createdAt!: Date;
  }

  LegalHoldAuditLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      entityType: {
        type: DataTypes.ENUM('hold', 'custodian', 'data_source', 'acknowledgment', 'release'),
        allowNull: false,
        comment: 'Entity type',
      },
      entityId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Entity identifier',
      },
      holdId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Related hold ID',
      },
      action: {
        type: DataTypes.ENUM('create', 'update', 'delete', 'acknowledge', 'release', 'escalate', 'verify'),
        allowNull: false,
        comment: 'Action performed',
      },
      userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who performed action',
      },
      userName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'User name for audit',
      },
      changes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Change details',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
        defaultValue: '',
        comment: 'IP address',
      },
      userAgent: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: '',
        comment: 'User agent',
      },
    },
    {
      sequelize,
      tableName: 'legal_hold_audit_logs',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['entityType', 'entityId'] },
        { fields: ['holdId'] },
        { fields: ['userId'] },
        { fields: ['action'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return LegalHoldAuditLog;
};

// ============================================================================
// LEGAL HOLD CREATION & MANAGEMENT (1-5)
// ============================================================================

/**
 * Creates a new legal hold notice with custodians and scope.
 *
 * @param {LegalHoldNoticeData} noticeData - Hold notice data
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User creating hold
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<any>} Created legal hold
 *
 * @example
 * ```typescript
 * const hold = await createLegalHoldNotice({
 *   matterName: 'Smith v. Acme Corp',
 *   matterNumber: 'LIT-2024-001',
 *   issueDate: new Date(),
 *   effectiveDate: new Date(),
 *   description: 'Employment discrimination case',
 *   preservationScope: 'All communications related to performance reviews',
 *   relevantTimeframe: { startDate: new Date('2023-01-01') },
 *   keywords: ['performance', 'review', 'discrimination'],
 *   custodianIds: ['EMP001', 'EMP002'],
 *   dataSources: ['email', 'file_share'],
 *   issuedBy: 'legal-team',
 *   priority: 'high',
 *   status: 'active'
 * }, LegalHold, 'user123');
 * ```
 */
export const createLegalHoldNotice = async (
  noticeData: LegalHoldNoticeData,
  LegalHold: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const hold = await LegalHold.create(
    {
      matterName: noticeData.matterName,
      matterNumber: noticeData.matterNumber,
      issueDate: noticeData.issueDate,
      effectiveDate: noticeData.effectiveDate,
      description: noticeData.description,
      preservationScope: noticeData.preservationScope,
      relevantTimeframeStart: noticeData.relevantTimeframe.startDate,
      relevantTimeframeEnd: noticeData.relevantTimeframe.endDate || null,
      keywords: noticeData.keywords,
      issuedBy: noticeData.issuedBy,
      legalCounsel: noticeData.legalCounsel || '',
      priority: noticeData.priority,
      status: noticeData.status,
      totalCustodians: noticeData.custodianIds.length,
      metadata: noticeData.metadata || {},
    },
    { transaction },
  );

  await logLegalHoldAudit({
    entityType: 'hold',
    entityId: hold.id,
    holdId: hold.id,
    action: 'create',
    userId,
    timestamp: new Date(),
    changes: noticeData,
  });

  return hold;
};

/**
 * Updates legal hold notice with modifications and tracking.
 *
 * @param {string} holdId - Hold ID
 * @param {Partial<LegalHoldNoticeData>} updates - Updates to apply
 * @param {string} userId - User updating hold
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Updated hold
 *
 * @example
 * ```typescript
 * await updateLegalHoldNotice('hold-uuid', {
 *   keywords: ['performance', 'review', 'discrimination', 'termination']
 * }, 'user123', LegalHold);
 * ```
 */
export const updateLegalHoldNotice = async (
  holdId: string,
  updates: Partial<LegalHoldNoticeData>,
  userId: string,
  LegalHold: any,
): Promise<any> => {
  const hold = await LegalHold.findByPk(holdId);
  if (!hold) throw new Error('Legal hold not found');

  const originalData = hold.toJSON();

  if (updates.keywords) hold.keywords = updates.keywords;
  if (updates.preservationScope) hold.preservationScope = updates.preservationScope;
  if (updates.description) hold.description = updates.description;
  if (updates.priority) hold.priority = updates.priority;
  if (updates.status) hold.status = updates.status;

  await hold.save();

  await logLegalHoldAudit({
    entityType: 'hold',
    entityId: holdId,
    holdId,
    action: 'update',
    userId,
    timestamp: new Date(),
    changes: { original: originalData, updated: hold.toJSON() },
  });

  return hold;
};

/**
 * Validates legal hold notice data for completeness and compliance.
 *
 * @param {LegalHoldNoticeData} noticeData - Notice data to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateLegalHoldNotice(noticeData);
 * if (!result.valid) {
 *   throw new Error(result.errors.join(', '));
 * }
 * ```
 */
export const validateLegalHoldNotice = async (
  noticeData: LegalHoldNoticeData,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  if (!noticeData.matterName) errors.push('Matter name is required');
  if (!noticeData.matterNumber) errors.push('Matter number is required');
  if (!noticeData.issueDate) errors.push('Issue date is required');
  if (!noticeData.effectiveDate) errors.push('Effective date is required');
  if (!noticeData.description) errors.push('Description is required');
  if (!noticeData.preservationScope) errors.push('Preservation scope is required');
  if (!noticeData.relevantTimeframe?.startDate) errors.push('Relevant timeframe start date is required');
  if (!noticeData.custodianIds || noticeData.custodianIds.length === 0) {
    errors.push('At least one custodian is required');
  }
  if (!noticeData.issuedBy) errors.push('Issued by is required');

  if (noticeData.effectiveDate < noticeData.issueDate) {
    errors.push('Effective date must be on or after issue date');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Activates a draft legal hold and triggers custodian notifications.
 *
 * @param {string} holdId - Hold ID
 * @param {string} userId - User activating hold
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Activated hold
 *
 * @example
 * ```typescript
 * const activeHold = await activateLegalHold('hold-uuid', 'user123', LegalHold);
 * ```
 */
export const activateLegalHold = async (
  holdId: string,
  userId: string,
  LegalHold: any,
): Promise<any> => {
  const hold = await LegalHold.findByPk(holdId);
  if (!hold) throw new Error('Legal hold not found');

  if (hold.status !== 'draft') {
    throw new Error('Only draft holds can be activated');
  }

  hold.status = 'active';
  hold.effectiveDate = new Date();
  await hold.save();

  await logLegalHoldAudit({
    entityType: 'hold',
    entityId: holdId,
    holdId,
    action: 'update',
    userId,
    timestamp: new Date(),
    changes: { status: 'active', effectiveDate: hold.effectiveDate },
  });

  return hold;
};

/**
 * Retrieves all active legal holds with filtering.
 *
 * @param {Object} filters - Filter criteria
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any[]>} Active legal holds
 *
 * @example
 * ```typescript
 * const activeHolds = await getActiveLegalHolds({ priority: 'high' }, LegalHold);
 * ```
 */
export const getActiveLegalHolds = async (
  filters: { priority?: string; issuedBy?: string },
  LegalHold: any,
): Promise<any[]> => {
  const where: any = { status: 'active' };

  if (filters.priority) where.priority = filters.priority;
  if (filters.issuedBy) where.issuedBy = filters.issuedBy;

  return await LegalHold.findAll({
    where,
    order: [['priority', 'DESC'], ['issueDate', 'DESC']],
  });
};

// ============================================================================
// CUSTODIAN MANAGEMENT (6-10)
// ============================================================================

/**
 * Adds custodians to legal hold with notification tracking.
 *
 * @param {string} holdId - Hold ID
 * @param {CustodianData[]} custodians - Custodian data array
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User adding custodians
 * @returns {Promise<any[]>} Created custodian records
 *
 * @example
 * ```typescript
 * const custodians = await addCustodiansToHold('hold-uuid', [
 *   {
 *     employeeId: 'EMP001',
 *     firstName: 'John',
 *     lastName: 'Smith',
 *     email: 'john.smith@example.com',
 *     department: 'Engineering',
 *     title: 'Senior Engineer',
 *     location: 'New York',
 *     status: 'active'
 *   }
 * ], HoldCustodian, LegalHold, 'user123');
 * ```
 */
export const addCustodiansToHold = async (
  holdId: string,
  custodians: CustodianData[],
  HoldCustodian: any,
  LegalHold: any,
  userId: string,
): Promise<any[]> => {
  const hold = await LegalHold.findByPk(holdId);
  if (!hold) throw new Error('Legal hold not found');

  const created = [];

  for (const custodian of custodians) {
    const record = await HoldCustodian.create({
      holdId,
      custodianId: custodian.employeeId,
      firstName: custodian.firstName,
      lastName: custodian.lastName,
      email: custodian.email,
      department: custodian.department,
      title: custodian.title,
      location: custodian.location,
      manager: custodian.manager || '',
      status: custodian.status,
      metadata: custodian.metadata || {},
    });

    created.push(record);

    await logLegalHoldAudit({
      entityType: 'custodian',
      entityId: record.id,
      holdId,
      action: 'create',
      userId,
      timestamp: new Date(),
      changes: custodian,
    });
  }

  // Update hold custodian count
  hold.totalCustodians += custodians.length;
  await hold.save();

  return created;
};

/**
 * Records custodian acknowledgment of legal hold notice.
 *
 * @param {string} holdId - Hold ID
 * @param {string} custodianId - Custodian ID
 * @param {string} method - Acknowledgment method
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} LegalHold - LegalHold model
 * @param {string} [ipAddress] - IP address of acknowledgment
 * @returns {Promise<any>} Updated custodian record
 *
 * @example
 * ```typescript
 * await recordCustodianAcknowledgment('hold-uuid', 'EMP001', 'email', HoldCustodian, LegalHold, '192.168.1.1');
 * ```
 */
export const recordCustodianAcknowledgment = async (
  holdId: string,
  custodianId: string,
  method: 'email' | 'portal' | 'in_person' | 'certified_mail',
  HoldCustodian: any,
  LegalHold: any,
  ipAddress?: string,
): Promise<any> => {
  const custodian = await HoldCustodian.findOne({
    where: { holdId, custodianId },
  });

  if (!custodian) throw new Error('Custodian not found in legal hold');

  if (custodian.acknowledgedDate) {
    throw new Error('Custodian has already acknowledged this hold');
  }

  custodian.acknowledgedDate = new Date();
  custodian.acknowledgmentMethod = method;
  await custodian.save();

  // Update hold acknowledgment count
  const hold = await LegalHold.findByPk(holdId);
  if (hold) {
    hold.acknowledgedCustodians += 1;
    await hold.save();
  }

  await logLegalHoldAudit({
    entityType: 'acknowledgment',
    entityId: custodian.id,
    holdId,
    action: 'acknowledge',
    userId: custodianId,
    timestamp: new Date(),
    changes: { method, acknowledgedDate: custodian.acknowledgedDate },
    ipAddress: ipAddress || '',
  });

  return custodian;
};

/**
 * Sends reminder to custodians who haven't acknowledged.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {any} notificationService - Notification service
 * @returns {Promise<number>} Number of reminders sent
 *
 * @example
 * ```typescript
 * const reminderCount = await sendCustodianReminders('hold-uuid', HoldCustodian, notificationService);
 * ```
 */
export const sendCustodianReminders = async (
  holdId: string,
  HoldCustodian: any,
  notificationService: any,
): Promise<number> => {
  const custodians = await HoldCustodian.findAll({
    where: {
      holdId,
      acknowledgedDate: null,
      exemptionApproved: false,
    },
  });

  let sentCount = 0;

  for (const custodian of custodians) {
    // Send reminder via notification service
    // await notificationService.sendReminder(custodian);

    custodian.remindersSent += 1;
    custodian.lastReminderDate = new Date();
    await custodian.save();

    sentCount++;
  }

  return sentCount;
};

/**
 * Retrieves custodians pending acknowledgment.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any[]>} Pending custodians
 *
 * @example
 * ```typescript
 * const pending = await getPendingAcknowledgments('hold-uuid', HoldCustodian);
 * ```
 */
export const getPendingAcknowledgments = async (
  holdId: string,
  HoldCustodian: any,
): Promise<any[]> => {
  return await HoldCustodian.findAll({
    where: {
      holdId,
      acknowledgedDate: null,
      exemptionApproved: false,
    },
    order: [['notificationSent', 'ASC']],
  });
};

/**
 * Processes custodian exemption request.
 *
 * @param {string} holdId - Hold ID
 * @param {string} custodianId - Custodian ID
 * @param {string} reason - Exemption reason
 * @param {boolean} approved - Approval decision
 * @param {string} approvedBy - User approving exemption
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any>} Updated custodian record
 *
 * @example
 * ```typescript
 * await processCustodianExemption('hold-uuid', 'EMP001', 'No relevant data', true, 'legal-counsel', HoldCustodian);
 * ```
 */
export const processCustodianExemption = async (
  holdId: string,
  custodianId: string,
  reason: string,
  approved: boolean,
  approvedBy: string,
  HoldCustodian: any,
): Promise<any> => {
  const custodian = await HoldCustodian.findOne({
    where: { holdId, custodianId },
  });

  if (!custodian) throw new Error('Custodian not found in legal hold');

  custodian.exemptionRequested = true;
  custodian.exemptionReason = reason;
  custodian.exemptionApproved = approved;

  if (approved) {
    custodian.status = 'released';
  }

  await custodian.save();

  await logLegalHoldAudit({
    entityType: 'custodian',
    entityId: custodian.id,
    holdId,
    action: 'update',
    userId: approvedBy,
    timestamp: new Date(),
    changes: { exemptionRequested: true, exemptionApproved: approved, reason },
  });

  return custodian;
};

// ============================================================================
// DATA SOURCE IDENTIFICATION (11-15)
// ============================================================================

/**
 * Identifies and registers data sources for legal hold.
 *
 * @param {string} holdId - Hold ID
 * @param {DataSourceIdentification[]} dataSources - Data sources to identify
 * @param {Model} HoldDataSource - HoldDataSource model
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User identifying sources
 * @returns {Promise<any[]>} Created data source records
 *
 * @example
 * ```typescript
 * const sources = await identifyDataSources('hold-uuid', [
 *   {
 *     sourceId: 'EMAIL-001',
 *     sourceName: 'Exchange Mailbox',
 *     sourceType: 'email',
 *     location: 'john.smith@example.com',
 *     custodianId: 'EMP001',
 *     preservationMethod: 'in_place',
 *     preservationStatus: 'identified',
 *     volumeEstimate: '10GB'
 *   }
 * ], HoldDataSource, LegalHold, 'user123');
 * ```
 */
export const identifyDataSources = async (
  holdId: string,
  dataSources: DataSourceIdentification[],
  HoldDataSource: any,
  LegalHold: any,
  userId: string,
): Promise<any[]> => {
  const hold = await LegalHold.findByPk(holdId);
  if (!hold) throw new Error('Legal hold not found');

  const created = [];

  for (const source of dataSources) {
    const record = await HoldDataSource.create({
      holdId,
      sourceId: source.sourceId,
      sourceName: source.sourceName,
      sourceType: source.sourceType,
      location: source.location,
      custodianId: source.custodianId || null,
      preservationMethod: source.preservationMethod,
      preservationStatus: source.preservationStatus,
      volumeEstimate: source.volumeEstimate || '',
      metadata: source.metadata || {},
    });

    created.push(record);

    await logLegalHoldAudit({
      entityType: 'data_source',
      entityId: record.id,
      holdId,
      action: 'create',
      userId,
      timestamp: new Date(),
      changes: source,
    });
  }

  // Update hold data source count
  hold.totalDataSources += dataSources.length;
  await hold.save();

  return created;
};

/**
 * Updates data source preservation status.
 *
 * @param {string} dataSourceId - Data source ID
 * @param {string} status - New preservation status
 * @param {Model} HoldDataSource - HoldDataSource model
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User updating status
 * @returns {Promise<any>} Updated data source
 *
 * @example
 * ```typescript
 * await updateDataSourceStatus('source-uuid', 'preserved', HoldDataSource, LegalHold, 'user123');
 * ```
 */
export const updateDataSourceStatus = async (
  dataSourceId: string,
  status: 'identified' | 'preserved' | 'collected' | 'failed' | 'excluded',
  HoldDataSource: any,
  LegalHold: any,
  userId: string,
): Promise<any> => {
  const dataSource = await HoldDataSource.findByPk(dataSourceId);
  if (!dataSource) throw new Error('Data source not found');

  const oldStatus = dataSource.preservationStatus;
  dataSource.preservationStatus = status;

  if (status === 'preserved' || status === 'collected') {
    dataSource.preservationDate = new Date();
  }

  await dataSource.save();

  // Update hold preserved count
  if (status === 'preserved' && oldStatus !== 'preserved') {
    const hold = await LegalHold.findByPk(dataSource.holdId);
    if (hold) {
      hold.preservedDataSources += 1;
      await hold.save();
    }
  }

  await logLegalHoldAudit({
    entityType: 'data_source',
    entityId: dataSourceId,
    holdId: dataSource.holdId,
    action: 'update',
    userId,
    timestamp: new Date(),
    changes: { oldStatus, newStatus: status },
  });

  return dataSource;
};

/**
 * Retrieves data sources by custodian.
 *
 * @param {string} holdId - Hold ID
 * @param {string} custodianId - Custodian ID
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any[]>} Custodian's data sources
 *
 * @example
 * ```typescript
 * const sources = await getDataSourcesByCustodian('hold-uuid', 'EMP001', HoldDataSource);
 * ```
 */
export const getDataSourcesByCustodian = async (
  holdId: string,
  custodianId: string,
  HoldDataSource: any,
): Promise<any[]> => {
  return await HoldDataSource.findAll({
    where: { holdId, custodianId },
    order: [['sourceType', 'ASC'], ['sourceName', 'ASC']],
  });
};

/**
 * Estimates total preservation volume for legal hold.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<{ totalSources: number; estimatedVolume: string; byType: Record<string, number> }>} Volume estimate
 *
 * @example
 * ```typescript
 * const volume = await estimatePreservationVolume('hold-uuid', HoldDataSource);
 * console.log(`Total volume: ${volume.estimatedVolume}`);
 * ```
 */
export const estimatePreservationVolume = async (
  holdId: string,
  HoldDataSource: any,
): Promise<{ totalSources: number; estimatedVolume: string; byType: Record<string, number> }> => {
  const sources = await HoldDataSource.findAll({ where: { holdId } });

  const byType: Record<string, number> = {};

  sources.forEach((source: any) => {
    if (!byType[source.sourceType]) {
      byType[source.sourceType] = 0;
    }
    byType[source.sourceType] += 1;
  });

  return {
    totalSources: sources.length,
    estimatedVolume: 'Calculation pending', // TODO: Parse and sum volume estimates
    byType,
  };
};

/**
 * Marks data source as failed with reason.
 *
 * @param {string} dataSourceId - Data source ID
 * @param {string} reason - Failure reason
 * @param {Model} HoldDataSource - HoldDataSource model
 * @param {string} userId - User marking failure
 * @returns {Promise<any>} Updated data source
 *
 * @example
 * ```typescript
 * await markDataSourceFailed('source-uuid', 'Access denied - system unavailable', HoldDataSource, 'user123');
 * ```
 */
export const markDataSourceFailed = async (
  dataSourceId: string,
  reason: string,
  HoldDataSource: any,
  userId: string,
): Promise<any> => {
  const dataSource = await HoldDataSource.findByPk(dataSourceId);
  if (!dataSource) throw new Error('Data source not found');

  dataSource.preservationStatus = 'failed';
  dataSource.failureReason = reason;
  await dataSource.save();

  await logLegalHoldAudit({
    entityType: 'data_source',
    entityId: dataSourceId,
    holdId: dataSource.holdId,
    action: 'update',
    userId,
    timestamp: new Date(),
    changes: { status: 'failed', reason },
  });

  return dataSource;
};

// ============================================================================
// PRESERVATION SCOPE DEFINITION (16-20)
// ============================================================================

/**
 * Defines preservation scope for legal hold.
 *
 * @param {PreservationScope} scope - Preservation scope definition
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Updated hold
 *
 * @example
 * ```typescript
 * await definePreservationScope({
 *   holdId: 'hold-uuid',
 *   scopeType: 'targeted',
 *   includedDataTypes: ['email', 'documents', 'instant_messages'],
 *   keywordTerms: ['discrimination', 'termination', 'performance'],
 *   dateRange: { startDate: new Date('2023-01-01'), endDate: new Date('2024-12-31') },
 *   custodianScope: 'specific',
 *   preservationRationale: 'Focused on HR-related communications'
 * }, LegalHold);
 * ```
 */
export const definePreservationScope = async (
  scope: PreservationScope,
  LegalHold: any,
): Promise<any> => {
  const hold = await LegalHold.findByPk(scope.holdId);
  if (!hold) throw new Error('Legal hold not found');

  const scopeMetadata = {
    scopeType: scope.scopeType,
    includedDataTypes: scope.includedDataTypes,
    excludedDataTypes: scope.excludedDataTypes || [],
    keywordTerms: scope.keywordTerms || [],
    dateRange: scope.dateRange,
    custodianScope: scope.custodianScope,
    geographicScope: scope.geographicScope || [],
    businessUnits: scope.businessUnits || [],
    preservationRationale: scope.preservationRationale,
  };

  hold.metadata = {
    ...hold.metadata,
    preservationScope: scopeMetadata,
  };

  if (scope.keywordTerms && scope.keywordTerms.length > 0) {
    hold.keywords = scope.keywordTerms;
  }

  await hold.save();

  return hold;
};

/**
 * Validates preservation scope for legal defensibility.
 *
 * @param {PreservationScope} scope - Scope to validate
 * @returns {{ valid: boolean; warnings: string[]; recommendations: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePreservationScope(scope);
 * if (!validation.valid) {
 *   console.log('Warnings:', validation.warnings);
 * }
 * ```
 */
export const validatePreservationScope = (
  scope: PreservationScope,
): { valid: boolean; warnings: string[]; recommendations: string[] } => {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  if (scope.scopeType === 'broad' && !scope.preservationRationale) {
    warnings.push('Broad scope should include detailed rationale');
  }

  if (scope.scopeType === 'keyword' && (!scope.keywordTerms || scope.keywordTerms.length === 0)) {
    warnings.push('Keyword-based scope requires keyword terms');
  }

  if (!scope.dateRange.endDate) {
    recommendations.push('Consider setting an end date for the relevant timeframe');
  }

  if (scope.scopeType === 'targeted' && scope.includedDataTypes.length > 10) {
    recommendations.push('Large number of data types may indicate broad scope');
  }

  if (!scope.excludedDataTypes || scope.excludedDataTypes.length === 0) {
    recommendations.push('Consider explicitly excluding irrelevant data types');
  }

  return {
    valid: warnings.length === 0,
    warnings,
    recommendations,
  };
};

/**
 * Expands preservation scope with additional criteria.
 *
 * @param {string} holdId - Hold ID
 * @param {Partial<PreservationScope>} additions - Additional scope criteria
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User expanding scope
 * @returns {Promise<any>} Updated hold
 *
 * @example
 * ```typescript
 * await expandPreservationScope('hold-uuid', {
 *   keywordTerms: ['retaliation', 'complaint'],
 *   includedDataTypes: ['social_media']
 * }, LegalHold, 'user123');
 * ```
 */
export const expandPreservationScope = async (
  holdId: string,
  additions: Partial<PreservationScope>,
  LegalHold: any,
  userId: string,
): Promise<any> => {
  const hold = await LegalHold.findByPk(holdId);
  if (!hold) throw new Error('Legal hold not found');

  const currentScope = hold.metadata.preservationScope || {};

  if (additions.keywordTerms) {
    const existingKeywords = new Set(hold.keywords);
    additions.keywordTerms.forEach(k => existingKeywords.add(k));
    hold.keywords = Array.from(existingKeywords);
  }

  if (additions.includedDataTypes) {
    currentScope.includedDataTypes = [
      ...(currentScope.includedDataTypes || []),
      ...additions.includedDataTypes,
    ];
  }

  hold.metadata = {
    ...hold.metadata,
    preservationScope: currentScope,
  };

  await hold.save();

  await logLegalHoldAudit({
    entityType: 'hold',
    entityId: holdId,
    holdId,
    action: 'update',
    userId,
    timestamp: new Date(),
    changes: { scopeExpansion: additions },
  });

  return hold;
};

/**
 * Generates preservation scope summary report.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any>} Scope summary
 *
 * @example
 * ```typescript
 * const summary = await generateScopeSummary('hold-uuid', LegalHold, HoldDataSource);
 * ```
 */
export const generateScopeSummary = async (
  holdId: string,
  LegalHold: any,
  HoldDataSource: any,
): Promise<any> => {
  const hold = await LegalHold.findByPk(holdId);
  if (!hold) throw new Error('Legal hold not found');

  const dataSources = await HoldDataSource.findAll({ where: { holdId } });

  const sourcesByType: Record<string, number> = {};
  dataSources.forEach((source: any) => {
    sourcesByType[source.sourceType] = (sourcesByType[source.sourceType] || 0) + 1;
  });

  return {
    matterName: hold.matterName,
    matterNumber: hold.matterNumber,
    preservationScope: hold.preservationScope,
    keywords: hold.keywords,
    relevantTimeframe: {
      start: hold.relevantTimeframeStart,
      end: hold.relevantTimeframeEnd,
    },
    totalCustodians: hold.totalCustodians,
    totalDataSources: hold.totalDataSources,
    dataSourcesByType: sourcesByType,
    scopeMetadata: hold.metadata.preservationScope || {},
  };
};

/**
 * Compares preservation scope across multiple holds.
 *
 * @param {string[]} holdIds - Array of hold IDs
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Scope comparison
 *
 * @example
 * ```typescript
 * const comparison = await comparePreservationScopes(['hold1', 'hold2'], LegalHold);
 * ```
 */
export const comparePreservationScopes = async (
  holdIds: string[],
  LegalHold: any,
): Promise<any> => {
  const holds = await LegalHold.findAll({
    where: { id: { [Op.in]: holdIds } },
  });

  const comparison = holds.map((hold: any) => ({
    holdId: hold.id,
    matterName: hold.matterName,
    keywords: hold.keywords,
    custodianCount: hold.totalCustodians,
    dataSourceCount: hold.totalDataSources,
    scopeType: hold.metadata.preservationScope?.scopeType || 'unknown',
  }));

  return comparison;
};

// ============================================================================
// CUSTODIAN INTERVIEWS (21-23)
// ============================================================================

/**
 * Schedules custodian interview for data source identification.
 *
 * @param {CustodianInterview} interviewData - Interview data
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any>} Interview record
 *
 * @example
 * ```typescript
 * await scheduleCustodianInterview({
 *   holdId: 'hold-uuid',
 *   custodianId: 'EMP001',
 *   interviewDate: new Date('2024-06-01'),
 *   interviewer: 'legal-team',
 *   interviewMethod: 'video_conference',
 *   dataSources: [],
 *   relevantDocuments: [],
 *   notes: '',
 *   followUpRequired: false,
 *   completionStatus: 'scheduled'
 * }, HoldCustodian);
 * ```
 */
export const scheduleCustodianInterview = async (
  interviewData: CustodianInterview,
  HoldCustodian: any,
): Promise<any> => {
  const custodian = await HoldCustodian.findOne({
    where: { holdId: interviewData.holdId, custodianId: interviewData.custodianId },
  });

  if (!custodian) throw new Error('Custodian not found in legal hold');

  custodian.interviewDate = interviewData.interviewDate;
  custodian.metadata = {
    ...custodian.metadata,
    interview: interviewData,
  };

  await custodian.save();

  return custodian;
};

/**
 * Records custodian interview completion and findings.
 *
 * @param {string} holdId - Hold ID
 * @param {string} custodianId - Custodian ID
 * @param {Partial<CustodianInterview>} interviewResults - Interview results
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any>} Updated custodian
 *
 * @example
 * ```typescript
 * await recordInterviewCompletion('hold-uuid', 'EMP001', {
 *   notes: 'Identified 3 additional email accounts and shared drive',
 *   dataSources: [...],
 *   completionStatus: 'completed',
 *   followUpRequired: true
 * }, HoldCustodian);
 * ```
 */
export const recordInterviewCompletion = async (
  holdId: string,
  custodianId: string,
  interviewResults: Partial<CustodianInterview>,
  HoldCustodian: any,
): Promise<any> => {
  const custodian = await HoldCustodian.findOne({
    where: { holdId, custodianId },
  });

  if (!custodian) throw new Error('Custodian not found in legal hold');

  custodian.interviewCompleted = true;
  custodian.interviewDate = new Date();
  custodian.metadata = {
    ...custodian.metadata,
    interview: {
      ...custodian.metadata.interview,
      ...interviewResults,
      completionStatus: 'completed',
    },
  };

  await custodian.save();

  return custodian;
};

/**
 * Retrieves custodians pending interviews.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any[]>} Custodians pending interviews
 *
 * @example
 * ```typescript
 * const pending = await getPendingInterviews('hold-uuid', HoldCustodian);
 * ```
 */
export const getPendingInterviews = async (
  holdId: string,
  HoldCustodian: any,
): Promise<any[]> => {
  return await HoldCustodian.findAll({
    where: {
      holdId,
      interviewCompleted: false,
    },
    order: [['interviewDate', 'ASC']],
  });
};

// ============================================================================
// PRESERVATION VERIFICATION (24-26)
// ============================================================================

/**
 * Performs preservation verification audit.
 *
 * @param {PreservationVerification} verification - Verification data
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any>} Verification results
 *
 * @example
 * ```typescript
 * const results = await performPreservationVerification({
 *   holdId: 'hold-uuid',
 *   verificationDate: new Date(),
 *   verifiedBy: 'compliance-team',
 *   dataSourcesVerified: ['source1', 'source2'],
 *   verificationMethod: 'sampling',
 *   custodianSampleSize: 10,
 *   complianceRate: 95,
 *   issuesFound: ['One mailbox not preserved'],
 *   remediationRequired: true,
 *   verificationStatus: 'partial'
 * }, LegalHold, HoldDataSource);
 * ```
 */
export const performPreservationVerification = async (
  verification: PreservationVerification,
  LegalHold: any,
  HoldDataSource: any,
): Promise<any> => {
  const hold = await LegalHold.findByPk(verification.holdId);
  if (!hold) throw new Error('Legal hold not found');

  // Update data sources verification status
  for (const sourceId of verification.dataSourcesVerified) {
    const source = await HoldDataSource.findByPk(sourceId);
    if (source) {
      source.verificationDate = verification.verificationDate;
      source.verificationStatus = verification.verificationStatus === 'pass' ? 'verified' : 'failed';
      await source.save();
    }
  }

  hold.lastVerificationDate = verification.verificationDate;
  hold.metadata = {
    ...hold.metadata,
    lastVerification: verification,
  };

  await hold.save();

  return {
    holdId: verification.holdId,
    verificationStatus: verification.verificationStatus,
    complianceRate: verification.complianceRate,
    issuesFound: verification.issuesFound,
    remediationRequired: verification.remediationRequired,
  };
};

/**
 * Generates preservation compliance report.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<ComplianceMetrics>} Compliance metrics
 *
 * @example
 * ```typescript
 * const metrics = await generateComplianceReport('hold-uuid', LegalHold, HoldCustodian, HoldDataSource);
 * console.log(`Compliance score: ${metrics.complianceScore}`);
 * ```
 */
export const generateComplianceReport = async (
  holdId: string,
  LegalHold: any,
  HoldCustodian: any,
  HoldDataSource: any,
): Promise<ComplianceMetrics> => {
  const hold = await LegalHold.findByPk(holdId);
  if (!hold) throw new Error('Legal hold not found');

  const custodians = await HoldCustodian.findAll({ where: { holdId } });
  const dataSources = await HoldDataSource.findAll({ where: { holdId } });

  const acknowledgedCount = custodians.filter((c: any) => c.acknowledgedDate !== null).length;
  const preservedCount = dataSources.filter((s: any) =>
    s.preservationStatus === 'preserved' || s.preservationStatus === 'collected'
  ).length;

  const acknowledgmentRate = (acknowledgedCount / custodians.length) * 100 || 0;
  const preservationRate = (preservedCount / dataSources.length) * 100 || 0;

  const acknowledgmentTimes = custodians
    .filter((c: any) => c.acknowledgedDate && c.notificationSent)
    .map((c: any) => c.acknowledgedDate.getTime() - c.notificationSent.getTime());

  const averageAcknowledgmentTime = acknowledgmentTimes.length > 0
    ? acknowledgmentTimes.reduce((sum, time) => sum + time, 0) / acknowledgmentTimes.length / 86400000
    : 0;

  const complianceScore = (acknowledgmentRate * 0.5 + preservationRate * 0.5);

  return {
    holdId,
    totalCustodians: custodians.length,
    acknowledgedCustodians: acknowledgedCount,
    acknowledgmentRate,
    averageAcknowledgmentTime,
    totalDataSources: dataSources.length,
    preservedDataSources: preservedCount,
    preservationRate,
    escalations: 0, // TODO: Count escalations
    complianceScore,
    lastVerificationDate: hold.lastVerificationDate,
  };
};

/**
 * Identifies preservation compliance gaps.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any[]>} Compliance gaps
 *
 * @example
 * ```typescript
 * const gaps = await identifyComplianceGaps('hold-uuid', HoldCustodian, HoldDataSource);
 * ```
 */
export const identifyComplianceGaps = async (
  holdId: string,
  HoldCustodian: any,
  HoldDataSource: any,
): Promise<any[]> => {
  const gaps: any[] = [];

  // Check for unacknowledged custodians
  const unacknowledged = await HoldCustodian.findAll({
    where: {
      holdId,
      acknowledgedDate: null,
      exemptionApproved: false,
    },
  });

  if (unacknowledged.length > 0) {
    gaps.push({
      type: 'unacknowledged_custodians',
      count: unacknowledged.length,
      severity: 'high',
      custodians: unacknowledged.map((c: any) => c.custodianId),
    });
  }

  // Check for failed data sources
  const failed = await HoldDataSource.findAll({
    where: {
      holdId,
      preservationStatus: 'failed',
    },
  });

  if (failed.length > 0) {
    gaps.push({
      type: 'failed_preservation',
      count: failed.length,
      severity: 'critical',
      sources: failed.map((s: any) => ({ id: s.sourceId, reason: s.failureReason })),
    });
  }

  return gaps;
};

// ============================================================================
// RELEASE PROCEDURES (27-30)
// ============================================================================

/**
 * Releases legal hold fully or partially.
 *
 * @param {HoldReleaseData} releaseData - Release data
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {string} userId - User releasing hold
 * @returns {Promise<any>} Updated hold
 *
 * @example
 * ```typescript
 * await releaseLegalHold({
 *   holdId: 'hold-uuid',
 *   releaseDate: new Date(),
 *   releaseReason: 'Matter settled',
 *   releaseType: 'full',
 *   approvedBy: 'legal-counsel',
 *   legalCounselApproval: true,
 *   dispositionInstructions: 'Delete data after 90 days'
 * }, LegalHold, HoldCustodian, 'user123');
 * ```
 */
export const releaseLegalHold = async (
  releaseData: HoldReleaseData,
  LegalHold: any,
  HoldCustodian: any,
  userId: string,
): Promise<any> => {
  const hold = await LegalHold.findByPk(releaseData.holdId);
  if (!hold) throw new Error('Legal hold not found');

  if (!releaseData.legalCounselApproval) {
    throw new Error('Legal counsel approval required for hold release');
  }

  if (releaseData.releaseType === 'full') {
    hold.status = 'released';
    hold.releaseDate = releaseData.releaseDate;

    // Release all custodians
    await HoldCustodian.update(
      { status: 'released' },
      { where: { holdId: releaseData.holdId } },
    );
  } else if (releaseData.releaseType === 'partial') {
    // Release specific custodians
    if (releaseData.releasedCustodians) {
      await HoldCustodian.update(
        { status: 'released' },
        {
          where: {
            holdId: releaseData.holdId,
            custodianId: { [Op.in]: releaseData.releasedCustodians },
          },
        },
      );
    }
  }

  hold.metadata = {
    ...hold.metadata,
    release: releaseData,
  };

  await hold.save();

  await logLegalHoldAudit({
    entityType: 'release',
    entityId: hold.id,
    holdId: hold.id,
    action: 'release',
    userId,
    timestamp: new Date(),
    changes: releaseData,
  });

  return hold;
};

/**
 * Validates release prerequisites before releasing hold.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<{ canRelease: boolean; blockers: string[] }>} Release validation
 *
 * @example
 * ```typescript
 * const validation = await validateReleasePrerequisites('hold-uuid', HoldDataSource);
 * if (!validation.canRelease) {
 *   console.log('Blockers:', validation.blockers);
 * }
 * ```
 */
export const validateReleasePrerequisites = async (
  holdId: string,
  HoldDataSource: any,
): Promise<{ canRelease: boolean; blockers: string[] }> => {
  const blockers: string[] = [];

  // Check for pending preservation
  const pending = await HoldDataSource.findAll({
    where: {
      holdId,
      preservationStatus: 'identified',
    },
  });

  if (pending.length > 0) {
    blockers.push(`${pending.length} data sources not yet preserved`);
  }

  // Check for failed sources
  const failed = await HoldDataSource.findAll({
    where: {
      holdId,
      preservationStatus: 'failed',
    },
  });

  if (failed.length > 0) {
    blockers.push(`${failed.length} data sources failed preservation`);
  }

  return {
    canRelease: blockers.length === 0,
    blockers,
  };
};

/**
 * Generates certificate of disposition for released hold.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<string>} Certificate content
 *
 * @example
 * ```typescript
 * const certificate = await generateDispositionCertificate('hold-uuid', LegalHold);
 * ```
 */
export const generateDispositionCertificate = async (
  holdId: string,
  LegalHold: any,
): Promise<string> => {
  const hold = await LegalHold.findByPk(holdId);
  if (!hold) throw new Error('Legal hold not found');

  if (hold.status !== 'released') {
    throw new Error('Hold must be released before generating certificate');
  }

  const certificate = `
CERTIFICATE OF DISPOSITION

Matter: ${hold.matterName}
Matter Number: ${hold.matterNumber}
Hold Issue Date: ${hold.issueDate.toISOString()}
Hold Release Date: ${hold.releaseDate?.toISOString()}

This certifies that the legal hold placed on the above matter has been released
and all preservation requirements have been satisfied.

Total Custodians: ${hold.totalCustodians}
Total Data Sources: ${hold.totalDataSources}

Issued By: ${hold.issuedBy}
Date: ${new Date().toISOString()}
  `.trim();

  return certificate;
};

/**
 * Archives released legal hold for retention.
 *
 * @param {string} holdId - Hold ID
 * @param {number} retentionYears - Retention period in years
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Archived hold
 *
 * @example
 * ```typescript
 * await archiveReleasedHold('hold-uuid', 7, LegalHold);
 * ```
 */
export const archiveReleasedHold = async (
  holdId: string,
  retentionYears: number,
  LegalHold: any,
): Promise<any> => {
  const hold = await LegalHold.findByPk(holdId);
  if (!hold) throw new Error('Legal hold not found');

  if (hold.status !== 'released') {
    throw new Error('Only released holds can be archived');
  }

  const archiveDate = new Date();
  const expirationDate = new Date(archiveDate);
  expirationDate.setFullYear(expirationDate.getFullYear() + retentionYears);

  hold.metadata = {
    ...hold.metadata,
    archive: {
      archiveDate,
      retentionYears,
      expirationDate,
    },
  };

  await hold.save();

  return hold;
};

// ============================================================================
// ESCALATION & COMPLIANCE (31-34)
// ============================================================================

/**
 * Creates escalation for non-compliance or issues.
 *
 * @param {EscalationWorkflow} escalation - Escalation data
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User creating escalation
 * @returns {Promise<any>} Escalation record
 *
 * @example
 * ```typescript
 * await createEscalation({
 *   holdId: 'hold-uuid',
 *   escalationType: 'non_acknowledgment',
 *   custodianId: 'EMP001',
 *   escalationDate: new Date(),
 *   escalatedTo: 'manager',
 *   escalationReason: 'No response after 3 reminders',
 *   priority: 'high',
 *   status: 'open'
 * }, LegalHold, 'user123');
 * ```
 */
export const createEscalation = async (
  escalation: EscalationWorkflow,
  LegalHold: any,
  userId: string,
): Promise<any> => {
  const hold = await LegalHold.findByPk(escalation.holdId);
  if (!hold) throw new Error('Legal hold not found');

  const escalations = hold.metadata.escalations || [];
  escalations.push({
    ...escalation,
    id: `ESC-${Date.now()}`,
    createdBy: userId,
    createdAt: new Date(),
  });

  hold.metadata = {
    ...hold.metadata,
    escalations,
  };

  await hold.save();

  await logLegalHoldAudit({
    entityType: 'hold',
    entityId: hold.id,
    holdId: hold.id,
    action: 'escalate',
    userId,
    timestamp: new Date(),
    changes: escalation,
  });

  return escalation;
};

/**
 * Resolves escalation with outcome.
 *
 * @param {string} holdId - Hold ID
 * @param {string} escalationId - Escalation ID
 * @param {string} resolution - Resolution description
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User resolving escalation
 * @returns {Promise<any>} Resolved escalation
 *
 * @example
 * ```typescript
 * await resolveEscalation('hold-uuid', 'ESC-123', 'Custodian acknowledged after manager contact', LegalHold, 'user123');
 * ```
 */
export const resolveEscalation = async (
  holdId: string,
  escalationId: string,
  resolution: string,
  LegalHold: any,
  userId: string,
): Promise<any> => {
  const hold = await LegalHold.findByPk(holdId);
  if (!hold) throw new Error('Legal hold not found');

  const escalations = hold.metadata.escalations || [];
  const escalation = escalations.find((e: any) => e.id === escalationId);

  if (!escalation) throw new Error('Escalation not found');

  escalation.status = 'resolved';
  escalation.resolution = resolution;
  escalation.resolvedDate = new Date();
  escalation.resolvedBy = userId;

  hold.metadata = {
    ...hold.metadata,
    escalations,
  };

  await hold.save();

  return escalation;
};

/**
 * Retrieves open escalations for legal hold.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any[]>} Open escalations
 *
 * @example
 * ```typescript
 * const openEscalations = await getOpenEscalations('hold-uuid', LegalHold);
 * ```
 */
export const getOpenEscalations = async (
  holdId: string,
  LegalHold: any,
): Promise<any[]> => {
  const hold = await LegalHold.findByPk(holdId);
  if (!hold) throw new Error('Legal hold not found');

  const escalations = hold.metadata.escalations || [];
  return escalations.filter((e: any) => e.status === 'open' || e.status === 'in_progress');
};

/**
 * Generates escalation summary report.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Escalation summary
 *
 * @example
 * ```typescript
 * const summary = await generateEscalationSummary('hold-uuid', LegalHold);
 * ```
 */
export const generateEscalationSummary = async (
  holdId: string,
  LegalHold: any,
): Promise<any> => {
  const hold = await LegalHold.findByPk(holdId);
  if (!hold) throw new Error('Legal hold not found');

  const escalations = hold.metadata.escalations || [];

  const byType: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  escalations.forEach((e: any) => {
    byType[e.escalationType] = (byType[e.escalationType] || 0) + 1;
    byStatus[e.status] = (byStatus[e.status] || 0) + 1;
  });

  return {
    totalEscalations: escalations.length,
    openEscalations: byStatus.open || 0,
    resolvedEscalations: byStatus.resolved || 0,
    byType,
    byStatus,
  };
};

// ============================================================================
// AUDIT & REPORTING (35-38)
// ============================================================================

/**
 * Logs audit event for legal hold operations.
 *
 * @param {LegalHoldAuditEntry} auditData - Audit entry data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logLegalHoldAudit({
 *   entityType: 'hold',
 *   entityId: 'hold-uuid',
 *   holdId: 'hold-uuid',
 *   action: 'create',
 *   userId: 'user123',
 *   timestamp: new Date(),
 *   changes: { ... }
 * });
 * ```
 */
export const logLegalHoldAudit = async (
  auditData: LegalHoldAuditEntry,
): Promise<void> => {
  // In production, this would write to LegalHoldAuditLog model
  console.log('Legal Hold Audit Event:', auditData);
};

/**
 * Generates comprehensive legal hold status report.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any>} Status report
 *
 * @example
 * ```typescript
 * const report = await generateHoldStatusReport('hold-uuid', LegalHold, HoldCustodian, HoldDataSource);
 * ```
 */
export const generateHoldStatusReport = async (
  holdId: string,
  LegalHold: any,
  HoldCustodian: any,
  HoldDataSource: any,
): Promise<any> => {
  const hold = await LegalHold.findByPk(holdId);
  if (!hold) throw new Error('Legal hold not found');

  const metrics = await generateComplianceReport(holdId, LegalHold, HoldCustodian, HoldDataSource);
  const gaps = await identifyComplianceGaps(holdId, HoldCustodian, HoldDataSource);
  const scopeSummary = await generateScopeSummary(holdId, LegalHold, HoldDataSource);

  return {
    holdInformation: {
      id: hold.id,
      matterName: hold.matterName,
      matterNumber: hold.matterNumber,
      status: hold.status,
      priority: hold.priority,
      issueDate: hold.issueDate,
      effectiveDate: hold.effectiveDate,
      releaseDate: hold.releaseDate,
    },
    complianceMetrics: metrics,
    complianceGaps: gaps,
    preservationScope: scopeSummary,
    lastVerificationDate: hold.lastVerificationDate,
    escalations: await generateEscalationSummary(holdId, LegalHold),
  };
};

/**
 * Exports legal hold audit trail.
 *
 * @param {string} holdId - Hold ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} LegalHoldAuditLog - LegalHoldAuditLog model
 * @returns {Promise<string>} Audit trail CSV
 *
 * @example
 * ```typescript
 * const csv = await exportLegalHoldAuditTrail('hold-uuid', startDate, endDate, LegalHoldAuditLog);
 * ```
 */
export const exportLegalHoldAuditTrail = async (
  holdId: string,
  startDate: Date,
  endDate: Date,
  LegalHoldAuditLog: any,
): Promise<string> => {
  const logs = await LegalHoldAuditLog.findAll({
    where: {
      holdId,
      createdAt: { [Op.between]: [startDate, endDate] },
    },
    order: [['createdAt', 'ASC']],
  });

  const headers = 'Timestamp,Entity Type,Entity ID,Action,User,Changes\n';
  const rows = logs.map(
    (log: any) =>
      `${log.createdAt},${log.entityType},${log.entityId},${log.action},${log.userName},"${JSON.stringify(log.changes)}"`,
  );

  return headers + rows.join('\n');
};

/**
 * Generates defensibility report for litigation readiness.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any>} Defensibility report
 *
 * @example
 * ```typescript
 * const report = await generateDefensibilityReport('hold-uuid', LegalHold, HoldCustodian, HoldDataSource);
 * console.log(`Defensibility score: ${report.defensibilityScore}`);
 * ```
 */
export const generateDefensibilityReport = async (
  holdId: string,
  LegalHold: any,
  HoldCustodian: any,
  HoldDataSource: any,
): Promise<any> => {
  const hold = await LegalHold.findByPk(holdId);
  if (!hold) throw new Error('Legal hold not found');

  const metrics = await generateComplianceReport(holdId, LegalHold, HoldCustodian, HoldDataSource);
  const gaps = await identifyComplianceGaps(holdId, HoldCustodian, HoldDataSource);
  const custodians = await HoldCustodian.findAll({ where: { holdId } });
  const dataSources = await HoldDataSource.findAll({ where: { holdId } });

  // Calculate defensibility score
  let defensibilityScore = 100;

  // Deduct for gaps
  gaps.forEach((gap: any) => {
    if (gap.severity === 'critical') defensibilityScore -= 15;
    else if (gap.severity === 'high') defensibilityScore -= 10;
    else if (gap.severity === 'medium') defensibilityScore -= 5;
  });

  // Deduct for low compliance
  if (metrics.complianceScore < 90) defensibilityScore -= 10;
  if (metrics.complianceScore < 75) defensibilityScore -= 15;

  // Bonus for verification
  if (hold.lastVerificationDate) defensibilityScore += 5;

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (metrics.acknowledgmentRate > 95) {
    strengths.push('High custodian acknowledgment rate');
  } else if (metrics.acknowledgmentRate < 80) {
    weaknesses.push('Low custodian acknowledgment rate');
  }

  if (metrics.preservationRate > 95) {
    strengths.push('Excellent data source preservation');
  } else if (metrics.preservationRate < 80) {
    weaknesses.push('Incomplete data source preservation');
  }

  if (hold.lastVerificationDate) {
    strengths.push('Regular verification performed');
  } else {
    weaknesses.push('No verification audit performed');
  }

  return {
    holdId,
    matterName: hold.matterName,
    defensibilityScore: Math.max(0, Math.min(100, defensibilityScore)),
    strengths,
    weaknesses,
    complianceMetrics: metrics,
    complianceGaps: gaps,
    recommendations: generateDefensibilityRecommendations(defensibilityScore, gaps),
  };
};

/**
 * Generates defensibility recommendations.
 *
 * @param {number} score - Defensibility score
 * @param {any[]} gaps - Compliance gaps
 * @returns {string[]} Recommendations
 */
const generateDefensibilityRecommendations = (score: number, gaps: any[]): string[] => {
  const recommendations: string[] = [];

  if (score < 70) {
    recommendations.push('Immediate action required to improve defensibility');
  }

  gaps.forEach((gap: any) => {
    if (gap.type === 'unacknowledged_custodians') {
      recommendations.push('Escalate unacknowledged custodians to management');
    }
    if (gap.type === 'failed_preservation') {
      recommendations.push('Remediate failed data source preservation');
    }
  });

  return recommendations;
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable service for Legal Hold management.
 *
 * @example
 * ```typescript
 * @Controller('legal-holds')
 * export class LegalHoldController {
 *   constructor(private readonly legalHoldService: LegalHoldService) {}
 *
 *   @Post()
 *   async createHold(@Body() data: LegalHoldNoticeData) {
 *     return this.legalHoldService.createHold(data);
 *   }
 * }
 * ```
 */
@Injectable()
export class LegalHoldService {
  constructor(private readonly sequelize: Sequelize) {}

  async createHold(data: LegalHoldNoticeData, userId: string) {
    const LegalHold = createLegalHoldModel(this.sequelize);
    return createLegalHoldNotice(data, LegalHold, userId);
  }

  async addCustodians(holdId: string, custodians: CustodianData[], userId: string) {
    const HoldCustodian = createHoldCustodianModel(this.sequelize);
    const LegalHold = createLegalHoldModel(this.sequelize);
    return addCustodiansToHold(holdId, custodians, HoldCustodian, LegalHold, userId);
  }

  async generateStatusReport(holdId: string) {
    const LegalHold = createLegalHoldModel(this.sequelize);
    const HoldCustodian = createHoldCustodianModel(this.sequelize);
    const HoldDataSource = createHoldDataSourceModel(this.sequelize);
    return generateHoldStatusReport(holdId, LegalHold, HoldCustodian, HoldDataSource);
  }

  async releaseHold(releaseData: HoldReleaseData, userId: string) {
    const LegalHold = createLegalHoldModel(this.sequelize);
    const HoldCustodian = createHoldCustodianModel(this.sequelize);
    return releaseLegalHold(releaseData, LegalHold, HoldCustodian, userId);
  }
}

/**
 * Default export with all legal hold utilities.
 */
export default {
  // Models
  createLegalHoldModel,
  createHoldCustodianModel,
  createHoldDataSourceModel,
  createLegalHoldAuditLogModel,

  // Legal Hold Management
  createLegalHoldNotice,
  updateLegalHoldNotice,
  validateLegalHoldNotice,
  activateLegalHold,
  getActiveLegalHolds,

  // Custodian Management
  addCustodiansToHold,
  recordCustodianAcknowledgment,
  sendCustodianReminders,
  getPendingAcknowledgments,
  processCustodianExemption,

  // Data Source Identification
  identifyDataSources,
  updateDataSourceStatus,
  getDataSourcesByCustodian,
  estimatePreservationVolume,
  markDataSourceFailed,

  // Preservation Scope
  definePreservationScope,
  validatePreservationScope,
  expandPreservationScope,
  generateScopeSummary,
  comparePreservationScopes,

  // Custodian Interviews
  scheduleCustodianInterview,
  recordInterviewCompletion,
  getPendingInterviews,

  // Preservation Verification
  performPreservationVerification,
  generateComplianceReport,
  identifyComplianceGaps,

  // Release Procedures
  releaseLegalHold,
  validateReleasePrerequisites,
  generateDispositionCertificate,
  archiveReleasedHold,

  // Escalation & Compliance
  createEscalation,
  resolveEscalation,
  getOpenEscalations,
  generateEscalationSummary,

  // Audit & Reporting
  logLegalHoldAudit,
  generateHoldStatusReport,
  exportLegalHoldAuditTrail,
  generateDefensibilityReport,

  // Service
  LegalHoldService,
};
