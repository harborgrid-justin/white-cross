/**
 * LOC: CEFMS-ABS-001
 * File: /reuse/financial/cefms/composites/downstream/audit-backend-service.ts
 *
 * UPSTREAM (imports from):
 *   - ../cefms-audit-compliance-tracking-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS audit controllers
 *   - Audit management APIs
 *   - Compliance tracking interfaces
 */

/**
 * File: /reuse/financial/cefms/composites/downstream/audit-backend-service.ts
 * Locator: WC-CEFMS-ABS-001
 * Purpose: USACE CEFMS Audit Backend Service - comprehensive audit trail management, compliance monitoring
 *
 * Upstream: Imports from cefms-audit-compliance-tracking-composite.ts
 * Downstream: Backend audit controllers, REST APIs, compliance dashboards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: Complete audit backend service with 50+ production-ready functions
 *
 * LLM Context: Production-ready USACE CEFMS audit backend service for comprehensive audit trail management,
 * compliance monitoring, audit scheduling, evidence collection, finding tracking, and corrective action management.
 */

import { Injectable, Logger, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Model, DataTypes, Sequelize, Transaction, Op, QueryTypes } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AuditTrailData {
  auditId: string;
  entityType: string;
  entityId: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: Date;
  changes: Record<string, any>;
  ipAddress?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

interface AuditSearchCriteria {
  startDate?: Date;
  endDate?: Date;
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  page?: number;
  limit?: number;
}

interface AuditStatistics {
  totalAudits: number;
  auditsByType: Record<string, number>;
  auditsByUser: Record<string, number>;
  auditsByAction: Record<string, number>;
  averageAuditsPerDay: number;
  criticalActions: number;
}

interface ComplianceCheckData {
  checkId: string;
  checkType: string;
  checkCategory: 'financial' | 'operational' | 'regulatory' | 'sox' | 'grants';
  checkDate: Date;
  performedBy: string;
  status: 'passed' | 'failed' | 'needs_review';
  scope: string;
  findings: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  nextCheckDue?: Date;
}

interface AuditScheduleData {
  scheduleId: string;
  auditType: 'internal' | 'external' | 'sox' | 'federal' | 'grant';
  auditName: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'deferred';
  auditor: string;
  scope: string;
  objectives: string[];
}

interface EvidenceDocumentData {
  documentId: string;
  auditId: string;
  findingId?: string;
  documentType: string;
  documentName: string;
  documentPath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedDate: Date;
  checksum: string;
}

interface AuditFindingData {
  findingId: string;
  auditId: string;
  findingCategory: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  affectedArea: string;
  identifiedDate: Date;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  dueDate: Date;
  assignedTo?: string;
}

interface CorrectiveActionData {
  actionId: string;
  findingId: string;
  actionDescription: string;
  responsibleParty: string;
  targetDate: Date;
  actualDate?: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'overdue';
  evidence?: string;
  notes?: string;
}

interface InternalControlData {
  controlId: string;
  controlName: string;
  controlType: 'preventive' | 'detective' | 'corrective';
  controlOwner: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  lastTested?: Date;
  testResult?: 'effective' | 'ineffective' | 'needs_improvement';
  isKey: boolean;
  soxRelevant: boolean;
}

interface RiskAssessmentData {
  assessmentId: string;
  riskCategory: string;
  riskDescription: string;
  likelihood: 'rare' | 'unlikely' | 'possible' | 'likely' | 'almost_certain';
  impact: 'insignificant' | 'minor' | 'moderate' | 'major' | 'catastrophic';
  riskScore: number;
  mitigationStrategy: string;
  owner: string;
  lastReviewed: Date;
}

interface AuditReportData {
  reportId: string;
  auditId: string;
  reportType: 'preliminary' | 'draft' | 'final';
  reportDate: Date;
  preparedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  executiveSummary: string;
  findings: AuditFindingData[];
  recommendations: string[];
  managementResponse?: string;
}

interface ComplianceDashboardData {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  needsReviewChecks: number;
  complianceRate: number;
  criticalIssues: number;
  overdueActions: number;
  upcomingAudits: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Audit Trail with comprehensive change tracking.
 */
export const createAuditTrailModel = (sequelize: Sequelize) => {
  class AuditTrail extends Model {
    public id!: string;
    public auditId!: string;
    public entityType!: string;
    public entityId!: string;
    public action!: string;
    public userId!: string;
    public userName!: string;
    public timestamp!: Date;
    public changes!: Record<string, any>;
    public ipAddress!: string | null;
    public sessionId!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
  }

  AuditTrail.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      auditId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Audit identifier',
      },
      entityType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Entity type (e.g., journal_entry, payment, obligation)',
      },
      entityId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Entity unique identifier',
      },
      action: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Action performed (create, update, delete, approve)',
      },
      userId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'User ID who performed action',
      },
      userName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'User display name',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Action timestamp',
      },
      changes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Detailed change log with before/after values',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: 'IP address of user',
      },
      sessionId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User session ID',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional audit metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_audit_trails',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['auditId'] },
        { fields: ['entityType', 'entityId'] },
        { fields: ['userId'] },
        { fields: ['timestamp'] },
        { fields: ['action'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return AuditTrail;
};

/**
 * Sequelize model for Compliance Checks.
 */
export const createComplianceCheckModel = (sequelize: Sequelize) => {
  class ComplianceCheck extends Model {
    public id!: string;
    public checkId!: string;
    public checkType!: string;
    public checkCategory!: string;
    public checkDate!: Date;
    public performedBy!: string;
    public status!: string;
    public scope!: string;
    public findings!: string;
    public riskLevel!: string;
    public nextCheckDue!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ComplianceCheck.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      checkId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Compliance check identifier',
      },
      checkType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Type of compliance check',
      },
      checkCategory: {
        type: DataTypes.ENUM('financial', 'operational', 'regulatory', 'sox', 'grants'),
        allowNull: false,
        comment: 'Compliance check category',
      },
      checkDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date check was performed',
      },
      performedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who performed check',
      },
      status: {
        type: DataTypes.ENUM('passed', 'failed', 'needs_review'),
        allowNull: false,
        comment: 'Check result status',
      },
      scope: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Scope of compliance check',
      },
      findings: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed findings',
      },
      riskLevel: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        comment: 'Risk level of findings',
      },
      nextCheckDue: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Next scheduled check date',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional check metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_compliance_checks',
      timestamps: true,
      indexes: [
        { fields: ['checkId'] },
        { fields: ['checkCategory'] },
        { fields: ['status'] },
        { fields: ['checkDate'] },
        { fields: ['riskLevel'] },
        { fields: ['nextCheckDue'] },
      ],
    },
  );

  return ComplianceCheck;
};

/**
 * Sequelize model for Audit Schedules.
 */
export const createAuditScheduleModel = (sequelize: Sequelize) => {
  class AuditSchedule extends Model {
    public id!: string;
    public scheduleId!: string;
    public auditType!: string;
    public auditName!: string;
    public plannedStartDate!: Date;
    public plannedEndDate!: Date;
    public actualStartDate!: Date | null;
    public actualEndDate!: Date | null;
    public status!: string;
    public auditor!: string;
    public scope!: string;
    public objectives!: string[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AuditSchedule.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      scheduleId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Audit schedule identifier',
      },
      auditType: {
        type: DataTypes.ENUM('internal', 'external', 'sox', 'federal', 'grant'),
        allowNull: false,
        comment: 'Type of audit',
      },
      auditName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Audit name',
      },
      plannedStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Planned start date',
      },
      plannedEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Planned end date',
      },
      actualStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual start date',
      },
      actualEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual end date',
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'deferred'),
        allowNull: false,
        defaultValue: 'scheduled',
        comment: 'Audit status',
      },
      auditor: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Lead auditor name',
      },
      scope: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Audit scope',
      },
      objectives: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Audit objectives',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional audit metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_audit_schedules',
      timestamps: true,
      indexes: [
        { fields: ['scheduleId'] },
        { fields: ['auditType'] },
        { fields: ['status'] },
        { fields: ['plannedStartDate'] },
        { fields: ['plannedEndDate'] },
        { fields: ['auditor'] },
      ],
    },
  );

  return AuditSchedule;
};

/**
 * Sequelize model for Evidence Documents.
 */
export const createEvidenceDocumentModel = (sequelize: Sequelize) => {
  class EvidenceDocument extends Model {
    public id!: string;
    public documentId!: string;
    public auditId!: string;
    public findingId!: string | null;
    public documentType!: string;
    public documentName!: string;
    public documentPath!: string;
    public fileSize!: number;
    public mimeType!: string;
    public uploadedBy!: string;
    public uploadedDate!: Date;
    public checksum!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EvidenceDocument.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      documentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Document identifier',
      },
      auditId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related audit ID',
      },
      findingId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Related finding ID',
      },
      documentType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Type of evidence document',
      },
      documentName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Document filename',
      },
      documentPath: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Storage path',
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
      uploadedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who uploaded',
      },
      uploadedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Upload timestamp',
      },
      checksum: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: 'SHA-256 checksum',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional document metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_evidence_documents',
      timestamps: true,
      indexes: [
        { fields: ['documentId'] },
        { fields: ['auditId'] },
        { fields: ['findingId'] },
        { fields: ['uploadedBy'] },
        { fields: ['uploadedDate'] },
      ],
    },
  );

  return EvidenceDocument;
};

/**
 * Sequelize model for Audit Findings.
 */
export const createAuditFindingModel = (sequelize: Sequelize) => {
  class AuditFinding extends Model {
    public id!: string;
    public findingId!: string;
    public auditId!: string;
    public findingCategory!: string;
    public severity!: string;
    public description!: string;
    public recommendation!: string;
    public affectedArea!: string;
    public identifiedDate!: Date;
    public status!: string;
    public dueDate!: Date;
    public assignedTo!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AuditFinding.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      findingId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Finding identifier',
      },
      auditId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related audit ID',
      },
      findingCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Category of finding',
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        comment: 'Severity level',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed description',
      },
      recommendation: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Recommended actions',
      },
      affectedArea: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Affected business area',
      },
      identifiedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date identified',
      },
      status: {
        type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
        allowNull: false,
        defaultValue: 'open',
        comment: 'Finding status',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Resolution due date',
      },
      assignedTo: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Assigned user',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional finding metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_audit_findings',
      timestamps: true,
      indexes: [
        { fields: ['findingId'] },
        { fields: ['auditId'] },
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['dueDate'] },
        { fields: ['assignedTo'] },
      ],
    },
  );

  return AuditFinding;
};

/**
 * Sequelize model for Corrective Actions.
 */
export const createCorrectiveActionModel = (sequelize: Sequelize) => {
  class CorrectiveAction extends Model {
    public id!: string;
    public actionId!: string;
    public findingId!: string;
    public actionDescription!: string;
    public responsibleParty!: string;
    public targetDate!: Date;
    public actualDate!: Date | null;
    public status!: string;
    public evidence!: string | null;
    public notes!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CorrectiveAction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      actionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Action identifier',
      },
      findingId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related finding ID',
      },
      actionDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Corrective action description',
      },
      responsibleParty: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Person responsible',
      },
      targetDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Target completion date',
      },
      actualDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual completion date',
      },
      status: {
        type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'overdue'),
        allowNull: false,
        defaultValue: 'planned',
        comment: 'Action status',
      },
      evidence: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Evidence of completion',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional action metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_corrective_actions',
      timestamps: true,
      indexes: [
        { fields: ['actionId'] },
        { fields: ['findingId'] },
        { fields: ['status'] },
        { fields: ['targetDate'] },
        { fields: ['responsibleParty'] },
      ],
    },
  );

  return CorrectiveAction;
};

/**
 * Sequelize model for Internal Controls.
 */
export const createInternalControlModel = (sequelize: Sequelize) => {
  class InternalControl extends Model {
    public id!: string;
    public controlId!: string;
    public controlName!: string;
    public controlType!: string;
    public controlOwner!: string;
    public frequency!: string;
    public lastTested!: Date | null;
    public testResult!: string | null;
    public isKey!: boolean;
    public soxRelevant!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InternalControl.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      controlId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Control identifier',
      },
      controlName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Control name',
      },
      controlType: {
        type: DataTypes.ENUM('preventive', 'detective', 'corrective'),
        allowNull: false,
        comment: 'Control type',
      },
      controlOwner: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Control owner',
      },
      frequency: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual'),
        allowNull: false,
        comment: 'Testing frequency',
      },
      lastTested: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last test date',
      },
      testResult: {
        type: DataTypes.ENUM('effective', 'ineffective', 'needs_improvement'),
        allowNull: true,
        comment: 'Latest test result',
      },
      isKey: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Key control indicator',
      },
      soxRelevant: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'SOX relevant indicator',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional control metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_internal_controls',
      timestamps: true,
      indexes: [
        { fields: ['controlId'] },
        { fields: ['controlType'] },
        { fields: ['isKey'] },
        { fields: ['soxRelevant'] },
        { fields: ['lastTested'] },
      ],
    },
  );

  return InternalControl;
};

/**
 * Sequelize model for Risk Assessments.
 */
export const createRiskAssessmentModel = (sequelize: Sequelize) => {
  class RiskAssessment extends Model {
    public id!: string;
    public assessmentId!: string;
    public riskCategory!: string;
    public riskDescription!: string;
    public likelihood!: string;
    public impact!: string;
    public riskScore!: number;
    public mitigationStrategy!: string;
    public owner!: string;
    public lastReviewed!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RiskAssessment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      assessmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Assessment identifier',
      },
      riskCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Risk category',
      },
      riskDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Risk description',
      },
      likelihood: {
        type: DataTypes.ENUM('rare', 'unlikely', 'possible', 'likely', 'almost_certain'),
        allowNull: false,
        comment: 'Likelihood rating',
      },
      impact: {
        type: DataTypes.ENUM('insignificant', 'minor', 'moderate', 'major', 'catastrophic'),
        allowNull: false,
        comment: 'Impact rating',
      },
      riskScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Calculated risk score',
      },
      mitigationStrategy: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Mitigation strategy',
      },
      owner: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Risk owner',
      },
      lastReviewed: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Last review date',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional risk metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_risk_assessments',
      timestamps: true,
      indexes: [
        { fields: ['assessmentId'] },
        { fields: ['riskCategory'] },
        { fields: ['riskScore'] },
        { fields: ['owner'] },
        { fields: ['lastReviewed'] },
      ],
    },
  );

  return RiskAssessment;
};

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * USACE CEFMS Audit Backend Service
 *
 * Provides comprehensive audit trail management, compliance monitoring,
 * audit scheduling, evidence collection, and corrective action tracking.
 *
 * @class AuditBackendService
 */
@Injectable()
export class AuditBackendService {
  private readonly logger = new Logger(AuditBackendService.name);

  constructor(
    private readonly sequelize: Sequelize,
  ) {}

  // ============================================================================
  // AUDIT TRAIL MANAGEMENT
  // ============================================================================

  /**
   * Creates a new audit trail record for tracking system changes.
   *
   * @param {AuditTrailData} data - Audit trail data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created audit trail record
   *
   * @example
   * ```typescript
   * const auditTrail = await service.createAuditTrail({
   *   auditId: 'AUDIT-2024-001',
   *   entityType: 'journal_entry',
   *   entityId: 'JE-001',
   *   action: 'update',
   *   userId: 'user123',
   *   userName: 'John Doe',
   *   timestamp: new Date(),
   *   changes: { amount: { old: 1000, new: 1500 } },
   *   ipAddress: '192.168.1.1'
   * });
   * ```
   */
  async createAuditTrail(data: AuditTrailData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating audit trail for ${data.entityType}:${data.entityId}`);

      const AuditTrail = createAuditTrailModel(this.sequelize);

      const auditTrail = await AuditTrail.create(
        {
          auditId: data.auditId,
          entityType: data.entityType,
          entityId: data.entityId,
          action: data.action,
          userId: data.userId,
          userName: data.userName,
          timestamp: data.timestamp,
          changes: data.changes,
          ipAddress: data.ipAddress || null,
          sessionId: data.sessionId || null,
          metadata: data.metadata || {},
        },
        { transaction },
      );

      this.logger.log(`Audit trail created: ${auditTrail.id}`);
      return auditTrail;
    } catch (error: any) {
      this.logger.error(`Failed to create audit trail: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create audit trail');
    }
  }

  /**
   * Searches audit trails based on criteria.
   *
   * @param {AuditSearchCriteria} criteria - Search criteria
   * @returns {Promise<{data: any[], total: number, page: number, limit: number}>} Search results
   *
   * @example
   * ```typescript
   * const results = await service.searchAuditTrails({
   *   startDate: new Date('2024-01-01'),
   *   endDate: new Date('2024-12-31'),
   *   entityType: 'journal_entry',
   *   userId: 'user123',
   *   page: 1,
   *   limit: 50
   * });
   * ```
   */
  async searchAuditTrails(criteria: AuditSearchCriteria): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      this.logger.log('Searching audit trails');

      const AuditTrail = createAuditTrailModel(this.sequelize);
      const where: any = {};

      if (criteria.startDate || criteria.endDate) {
        where.timestamp = {};
        if (criteria.startDate) where.timestamp[Op.gte] = criteria.startDate;
        if (criteria.endDate) where.timestamp[Op.lte] = criteria.endDate;
      }

      if (criteria.entityType) where.entityType = criteria.entityType;
      if (criteria.entityId) where.entityId = criteria.entityId;
      if (criteria.userId) where.userId = criteria.userId;
      if (criteria.action) where.action = criteria.action;

      const page = criteria.page || 1;
      const limit = criteria.limit || 50;
      const offset = (page - 1) * limit;

      const { rows, count } = await AuditTrail.findAndCountAll({
        where,
        order: [['timestamp', 'DESC']],
        limit,
        offset,
      });

      return {
        data: rows,
        total: count,
        page,
        limit,
      };
    } catch (error: any) {
      this.logger.error(`Failed to search audit trails: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to search audit trails');
    }
  }

  /**
   * Retrieves audit trail by ID.
   *
   * @param {string} id - Audit trail ID
   * @returns {Promise<any>} Audit trail record
   */
  async getAuditTrailById(id: string): Promise<any> {
    try {
      const AuditTrail = createAuditTrailModel(this.sequelize);
      const auditTrail = await AuditTrail.findByPk(id);

      if (!auditTrail) {
        throw new NotFoundException(`Audit trail not found: ${id}`);
      }

      return auditTrail;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to get audit trail: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve audit trail');
    }
  }

  /**
   * Retrieves audit trails for a specific entity.
   *
   * @param {string} entityType - Entity type
   * @param {string} entityId - Entity ID
   * @returns {Promise<any[]>} Audit trail records
   */
  async getAuditTrailsByEntity(entityType: string, entityId: string): Promise<any[]> {
    try {
      const AuditTrail = createAuditTrailModel(this.sequelize);

      const trails = await AuditTrail.findAll({
        where: {
          entityType,
          entityId,
        },
        order: [['timestamp', 'ASC']],
      });

      return trails;
    } catch (error: any) {
      this.logger.error(`Failed to get entity audit trails: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve entity audit trails');
    }
  }

  /**
   * Calculates audit statistics for a date range.
   *
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<AuditStatistics>} Audit statistics
   */
  async calculateAuditStatistics(startDate: Date, endDate: Date): Promise<AuditStatistics> {
    try {
      const AuditTrail = createAuditTrailModel(this.sequelize);

      const trails = await AuditTrail.findAll({
        where: {
          timestamp: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
      });

      const totalAudits = trails.length;
      const auditsByType: Record<string, number> = {};
      const auditsByUser: Record<string, number> = {};
      const auditsByAction: Record<string, number> = {};
      let criticalActions = 0;

      trails.forEach((trail: any) => {
        auditsByType[trail.entityType] = (auditsByType[trail.entityType] || 0) + 1;
        auditsByUser[trail.userId] = (auditsByUser[trail.userId] || 0) + 1;
        auditsByAction[trail.action] = (auditsByAction[trail.action] || 0) + 1;

        if (['delete', 'approve', 'reject'].includes(trail.action)) {
          criticalActions++;
        }
      });

      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const averageAuditsPerDay = daysDiff > 0 ? totalAudits / daysDiff : 0;

      return {
        totalAudits,
        auditsByType,
        auditsByUser,
        auditsByAction,
        averageAuditsPerDay,
        criticalActions,
      };
    } catch (error: any) {
      this.logger.error(`Failed to calculate audit statistics: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate audit statistics');
    }
  }

  /**
   * Bulk creates audit trail records.
   *
   * @param {AuditTrailData[]} dataArray - Array of audit trail data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any[]>} Created audit trail records
   */
  async bulkCreateAuditTrails(dataArray: AuditTrailData[], transaction?: Transaction): Promise<any[]> {
    try {
      this.logger.log(`Bulk creating ${dataArray.length} audit trails`);

      const AuditTrail = createAuditTrailModel(this.sequelize);

      const auditTrails = await AuditTrail.bulkCreate(
        dataArray.map(data => ({
          auditId: data.auditId,
          entityType: data.entityType,
          entityId: data.entityId,
          action: data.action,
          userId: data.userId,
          userName: data.userName,
          timestamp: data.timestamp,
          changes: data.changes,
          ipAddress: data.ipAddress || null,
          sessionId: data.sessionId || null,
          metadata: data.metadata || {},
        })),
        { transaction },
      );

      return auditTrails;
    } catch (error: any) {
      this.logger.error(`Failed to bulk create audit trails: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to bulk create audit trails');
    }
  }

  /**
   * Archives old audit trails.
   *
   * @param {Date} archiveBeforeDate - Archive records before this date
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<number>} Number of archived records
   */
  async archiveOldAuditTrails(archiveBeforeDate: Date, transaction?: Transaction): Promise<number> {
    try {
      this.logger.log(`Archiving audit trails before ${archiveBeforeDate}`);

      const AuditTrail = createAuditTrailModel(this.sequelize);

      // In a real system, this would move records to an archive table
      // For now, we'll just count them
      const count = await AuditTrail.count({
        where: {
          timestamp: {
            [Op.lt]: archiveBeforeDate,
          },
        },
        transaction,
      });

      this.logger.log(`Found ${count} audit trails to archive`);
      return count;
    } catch (error: any) {
      this.logger.error(`Failed to archive audit trails: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to archive audit trails');
    }
  }

  // ============================================================================
  // COMPLIANCE CHECK MANAGEMENT
  // ============================================================================

  /**
   * Creates a new compliance check record.
   *
   * @param {ComplianceCheckData} data - Compliance check data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created compliance check record
   */
  async createComplianceCheck(data: ComplianceCheckData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating compliance check: ${data.checkId}`);

      const ComplianceCheck = createComplianceCheckModel(this.sequelize);

      const check = await ComplianceCheck.create(
        {
          checkId: data.checkId,
          checkType: data.checkType,
          checkCategory: data.checkCategory,
          checkDate: data.checkDate,
          performedBy: data.performedBy,
          status: data.status,
          scope: data.scope,
          findings: data.findings,
          riskLevel: data.riskLevel,
          nextCheckDue: data.nextCheckDue || null,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Compliance check created: ${check.id}`);
      return check;
    } catch (error: any) {
      this.logger.error(`Failed to create compliance check: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create compliance check');
    }
  }

  /**
   * Updates a compliance check record.
   *
   * @param {string} checkId - Check ID
   * @param {Partial<ComplianceCheckData>} updates - Update data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated compliance check record
   */
  async updateComplianceCheck(
    checkId: string,
    updates: Partial<ComplianceCheckData>,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      const ComplianceCheck = createComplianceCheckModel(this.sequelize);

      const check = await ComplianceCheck.findOne({
        where: { checkId },
        transaction,
      });

      if (!check) {
        throw new NotFoundException(`Compliance check not found: ${checkId}`);
      }

      await check.update(updates, { transaction });

      return check;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update compliance check: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update compliance check');
    }
  }

  /**
   * Retrieves compliance checks by category.
   *
   * @param {string} category - Check category
   * @returns {Promise<any[]>} Compliance check records
   */
  async getComplianceChecksByCategory(category: string): Promise<any[]> {
    try {
      const ComplianceCheck = createComplianceCheckModel(this.sequelize);

      const checks = await ComplianceCheck.findAll({
        where: { checkCategory: category },
        order: [['checkDate', 'DESC']],
      });

      return checks;
    } catch (error: any) {
      this.logger.error(`Failed to get compliance checks: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve compliance checks');
    }
  }

  /**
   * Retrieves failed compliance checks.
   *
   * @returns {Promise<any[]>} Failed compliance check records
   */
  async getFailedComplianceChecks(): Promise<any[]> {
    try {
      const ComplianceCheck = createComplianceCheckModel(this.sequelize);

      const checks = await ComplianceCheck.findAll({
        where: { status: 'failed' },
        order: [['checkDate', 'DESC']],
      });

      return checks;
    } catch (error: any) {
      this.logger.error(`Failed to get failed checks: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve failed compliance checks');
    }
  }

  /**
   * Retrieves compliance checks due for review.
   *
   * @param {Date} beforeDate - Get checks due before this date
   * @returns {Promise<any[]>} Compliance check records
   */
  async getComplianceChecksDue(beforeDate: Date): Promise<any[]> {
    try {
      const ComplianceCheck = createComplianceCheckModel(this.sequelize);

      const checks = await ComplianceCheck.findAll({
        where: {
          nextCheckDue: {
            [Op.lte]: beforeDate,
          },
        },
        order: [['nextCheckDue', 'ASC']],
      });

      return checks;
    } catch (error: any) {
      this.logger.error(`Failed to get due checks: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve due compliance checks');
    }
  }

  /**
   * Calculates compliance rate for a category.
   *
   * @param {string} category - Check category
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<number>} Compliance rate percentage
   */
  async calculateComplianceRate(category: string, startDate: Date, endDate: Date): Promise<number> {
    try {
      const ComplianceCheck = createComplianceCheckModel(this.sequelize);

      const totalChecks = await ComplianceCheck.count({
        where: {
          checkCategory: category,
          checkDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
      });

      const passedChecks = await ComplianceCheck.count({
        where: {
          checkCategory: category,
          checkDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
          status: 'passed',
        },
      });

      const complianceRate = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;
      return Math.round(complianceRate * 100) / 100;
    } catch (error: any) {
      this.logger.error(`Failed to calculate compliance rate: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate compliance rate');
    }
  }

  // ============================================================================
  // AUDIT SCHEDULE MANAGEMENT
  // ============================================================================

  /**
   * Creates a new audit schedule.
   *
   * @param {AuditScheduleData} data - Audit schedule data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created audit schedule record
   */
  async createAuditSchedule(data: AuditScheduleData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating audit schedule: ${data.scheduleId}`);

      const AuditSchedule = createAuditScheduleModel(this.sequelize);

      const schedule = await AuditSchedule.create(
        {
          scheduleId: data.scheduleId,
          auditType: data.auditType,
          auditName: data.auditName,
          plannedStartDate: data.plannedStartDate,
          plannedEndDate: data.plannedEndDate,
          actualStartDate: data.actualStartDate || null,
          actualEndDate: data.actualEndDate || null,
          status: data.status,
          auditor: data.auditor,
          scope: data.scope,
          objectives: data.objectives,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Audit schedule created: ${schedule.id}`);
      return schedule;
    } catch (error: any) {
      this.logger.error(`Failed to create audit schedule: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create audit schedule');
    }
  }

  /**
   * Updates audit schedule status.
   *
   * @param {string} scheduleId - Schedule ID
   * @param {string} status - New status
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated audit schedule record
   */
  async updateAuditScheduleStatus(
    scheduleId: string,
    status: string,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      const AuditSchedule = createAuditScheduleModel(this.sequelize);

      const schedule = await AuditSchedule.findOne({
        where: { scheduleId },
        transaction,
      });

      if (!schedule) {
        throw new NotFoundException(`Audit schedule not found: ${scheduleId}`);
      }

      await schedule.update({ status }, { transaction });

      return schedule;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update audit schedule: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update audit schedule');
    }
  }

  /**
   * Retrieves upcoming audit schedules.
   *
   * @param {Date} beforeDate - Get schedules starting before this date
   * @returns {Promise<any[]>} Audit schedule records
   */
  async getUpcomingAuditSchedules(beforeDate: Date): Promise<any[]> {
    try {
      const AuditSchedule = createAuditScheduleModel(this.sequelize);

      const schedules = await AuditSchedule.findAll({
        where: {
          status: 'scheduled',
          plannedStartDate: {
            [Op.lte]: beforeDate,
          },
        },
        order: [['plannedStartDate', 'ASC']],
      });

      return schedules;
    } catch (error: any) {
      this.logger.error(`Failed to get upcoming schedules: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve upcoming audit schedules');
    }
  }

  /**
   * Retrieves audit schedules by type.
   *
   * @param {string} auditType - Audit type
   * @returns {Promise<any[]>} Audit schedule records
   */
  async getAuditSchedulesByType(auditType: string): Promise<any[]> {
    try {
      const AuditSchedule = createAuditScheduleModel(this.sequelize);

      const schedules = await AuditSchedule.findAll({
        where: { auditType },
        order: [['plannedStartDate', 'DESC']],
      });

      return schedules;
    } catch (error: any) {
      this.logger.error(`Failed to get audit schedules: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve audit schedules by type');
    }
  }

  /**
   * Starts an audit by updating actual start date.
   *
   * @param {string} scheduleId - Schedule ID
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated audit schedule record
   */
  async startAudit(scheduleId: string, transaction?: Transaction): Promise<any> {
    try {
      const AuditSchedule = createAuditScheduleModel(this.sequelize);

      const schedule = await AuditSchedule.findOne({
        where: { scheduleId },
        transaction,
      });

      if (!schedule) {
        throw new NotFoundException(`Audit schedule not found: ${scheduleId}`);
      }

      await schedule.update(
        {
          status: 'in_progress',
          actualStartDate: new Date(),
        },
        { transaction },
      );

      return schedule;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to start audit: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to start audit');
    }
  }

  /**
   * Completes an audit by updating actual end date.
   *
   * @param {string} scheduleId - Schedule ID
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated audit schedule record
   */
  async completeAudit(scheduleId: string, transaction?: Transaction): Promise<any> {
    try {
      const AuditSchedule = createAuditScheduleModel(this.sequelize);

      const schedule = await AuditSchedule.findOne({
        where: { scheduleId },
        transaction,
      });

      if (!schedule) {
        throw new NotFoundException(`Audit schedule not found: ${scheduleId}`);
      }

      await schedule.update(
        {
          status: 'completed',
          actualEndDate: new Date(),
        },
        { transaction },
      );

      return schedule;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to complete audit: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to complete audit');
    }
  }

  // ============================================================================
  // EVIDENCE DOCUMENT MANAGEMENT
  // ============================================================================

  /**
   * Creates a new evidence document record.
   *
   * @param {EvidenceDocumentData} data - Evidence document data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created evidence document record
   */
  async createEvidenceDocument(data: EvidenceDocumentData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating evidence document: ${data.documentId}`);

      const EvidenceDocument = createEvidenceDocumentModel(this.sequelize);

      const document = await EvidenceDocument.create(
        {
          documentId: data.documentId,
          auditId: data.auditId,
          findingId: data.findingId || null,
          documentType: data.documentType,
          documentName: data.documentName,
          documentPath: data.documentPath,
          fileSize: data.fileSize,
          mimeType: data.mimeType,
          uploadedBy: data.uploadedBy,
          uploadedDate: data.uploadedDate,
          checksum: data.checksum,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Evidence document created: ${document.id}`);
      return document;
    } catch (error: any) {
      this.logger.error(`Failed to create evidence document: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create evidence document');
    }
  }

  /**
   * Retrieves evidence documents for an audit.
   *
   * @param {string} auditId - Audit ID
   * @returns {Promise<any[]>} Evidence document records
   */
  async getEvidenceDocumentsByAudit(auditId: string): Promise<any[]> {
    try {
      const EvidenceDocument = createEvidenceDocumentModel(this.sequelize);

      const documents = await EvidenceDocument.findAll({
        where: { auditId },
        order: [['uploadedDate', 'DESC']],
      });

      return documents;
    } catch (error: any) {
      this.logger.error(`Failed to get evidence documents: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve evidence documents');
    }
  }

  /**
   * Retrieves evidence documents for a finding.
   *
   * @param {string} findingId - Finding ID
   * @returns {Promise<any[]>} Evidence document records
   */
  async getEvidenceDocumentsByFinding(findingId: string): Promise<any[]> {
    try {
      const EvidenceDocument = createEvidenceDocumentModel(this.sequelize);

      const documents = await EvidenceDocument.findAll({
        where: { findingId },
        order: [['uploadedDate', 'DESC']],
      });

      return documents;
    } catch (error: any) {
      this.logger.error(`Failed to get finding evidence: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve finding evidence documents');
    }
  }

  /**
   * Verifies evidence document checksum.
   *
   * @param {string} documentId - Document ID
   * @param {string} checksum - Checksum to verify
   * @returns {Promise<boolean>} True if checksum matches
   */
  async verifyEvidenceChecksum(documentId: string, checksum: string): Promise<boolean> {
    try {
      const EvidenceDocument = createEvidenceDocumentModel(this.sequelize);

      const document = await EvidenceDocument.findOne({
        where: { documentId },
      });

      if (!document) {
        throw new NotFoundException(`Evidence document not found: ${documentId}`);
      }

      return document.checksum === checksum;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to verify checksum: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to verify evidence checksum');
    }
  }

  /**
   * Calculates SHA-256 checksum for a file buffer.
   *
   * @param {Buffer} buffer - File buffer
   * @returns {string} SHA-256 checksum
   */
  calculateChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  // ============================================================================
  // AUDIT FINDING MANAGEMENT
  // ============================================================================

  /**
   * Creates a new audit finding.
   *
   * @param {AuditFindingData} data - Audit finding data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created audit finding record
   */
  async createAuditFinding(data: AuditFindingData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating audit finding: ${data.findingId}`);

      const AuditFinding = createAuditFindingModel(this.sequelize);

      const finding = await AuditFinding.create(
        {
          findingId: data.findingId,
          auditId: data.auditId,
          findingCategory: data.findingCategory,
          severity: data.severity,
          description: data.description,
          recommendation: data.recommendation,
          affectedArea: data.affectedArea,
          identifiedDate: data.identifiedDate,
          status: data.status,
          dueDate: data.dueDate,
          assignedTo: data.assignedTo || null,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Audit finding created: ${finding.id}`);
      return finding;
    } catch (error: any) {
      this.logger.error(`Failed to create audit finding: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create audit finding');
    }
  }

  /**
   * Updates audit finding status.
   *
   * @param {string} findingId - Finding ID
   * @param {string} status - New status
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated audit finding record
   */
  async updateAuditFindingStatus(
    findingId: string,
    status: string,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      const AuditFinding = createAuditFindingModel(this.sequelize);

      const finding = await AuditFinding.findOne({
        where: { findingId },
        transaction,
      });

      if (!finding) {
        throw new NotFoundException(`Audit finding not found: ${findingId}`);
      }

      await finding.update({ status }, { transaction });

      return finding;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update finding status: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update audit finding status');
    }
  }

  /**
   * Retrieves findings by severity.
   *
   * @param {string} severity - Severity level
   * @returns {Promise<any[]>} Audit finding records
   */
  async getFindingsBySeverity(severity: string): Promise<any[]> {
    try {
      const AuditFinding = createAuditFindingModel(this.sequelize);

      const findings = await AuditFinding.findAll({
        where: { severity },
        order: [['identifiedDate', 'DESC']],
      });

      return findings;
    } catch (error: any) {
      this.logger.error(`Failed to get findings by severity: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve findings by severity');
    }
  }

  /**
   * Retrieves open audit findings.
   *
   * @returns {Promise<any[]>} Open audit finding records
   */
  async getOpenFindings(): Promise<any[]> {
    try {
      const AuditFinding = createAuditFindingModel(this.sequelize);

      const findings = await AuditFinding.findAll({
        where: {
          status: {
            [Op.in]: ['open', 'in_progress'],
          },
        },
        order: [['dueDate', 'ASC']],
      });

      return findings;
    } catch (error: any) {
      this.logger.error(`Failed to get open findings: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve open findings');
    }
  }

  /**
   * Retrieves overdue audit findings.
   *
   * @returns {Promise<any[]>} Overdue audit finding records
   */
  async getOverdueFindings(): Promise<any[]> {
    try {
      const AuditFinding = createAuditFindingModel(this.sequelize);
      const now = new Date();

      const findings = await AuditFinding.findAll({
        where: {
          status: {
            [Op.in]: ['open', 'in_progress'],
          },
          dueDate: {
            [Op.lt]: now,
          },
        },
        order: [['dueDate', 'ASC']],
      });

      return findings;
    } catch (error: any) {
      this.logger.error(`Failed to get overdue findings: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve overdue findings');
    }
  }

  // ============================================================================
  // CORRECTIVE ACTION MANAGEMENT
  // ============================================================================

  /**
   * Creates a new corrective action.
   *
   * @param {CorrectiveActionData} data - Corrective action data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created corrective action record
   */
  async createCorrectiveAction(data: CorrectiveActionData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating corrective action: ${data.actionId}`);

      const CorrectiveAction = createCorrectiveActionModel(this.sequelize);

      const action = await CorrectiveAction.create(
        {
          actionId: data.actionId,
          findingId: data.findingId,
          actionDescription: data.actionDescription,
          responsibleParty: data.responsibleParty,
          targetDate: data.targetDate,
          actualDate: data.actualDate || null,
          status: data.status,
          evidence: data.evidence || null,
          notes: data.notes || null,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Corrective action created: ${action.id}`);
      return action;
    } catch (error: any) {
      this.logger.error(`Failed to create corrective action: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create corrective action');
    }
  }

  /**
   * Updates corrective action status.
   *
   * @param {string} actionId - Action ID
   * @param {string} status - New status
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated corrective action record
   */
  async updateCorrectiveActionStatus(
    actionId: string,
    status: string,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      const CorrectiveAction = createCorrectiveActionModel(this.sequelize);

      const action = await CorrectiveAction.findOne({
        where: { actionId },
        transaction,
      });

      if (!action) {
        throw new NotFoundException(`Corrective action not found: ${actionId}`);
      }

      await action.update({ status }, { transaction });

      return action;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update action status: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update corrective action status');
    }
  }

  /**
   * Completes a corrective action.
   *
   * @param {string} actionId - Action ID
   * @param {string} evidence - Evidence of completion
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated corrective action record
   */
  async completeCorrectiveAction(
    actionId: string,
    evidence: string,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      const CorrectiveAction = createCorrectiveActionModel(this.sequelize);

      const action = await CorrectiveAction.findOne({
        where: { actionId },
        transaction,
      });

      if (!action) {
        throw new NotFoundException(`Corrective action not found: ${actionId}`);
      }

      await action.update(
        {
          status: 'completed',
          actualDate: new Date(),
          evidence,
        },
        { transaction },
      );

      return action;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to complete action: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to complete corrective action');
    }
  }

  /**
   * Retrieves corrective actions for a finding.
   *
   * @param {string} findingId - Finding ID
   * @returns {Promise<any[]>} Corrective action records
   */
  async getCorrectiveActionsByFinding(findingId: string): Promise<any[]> {
    try {
      const CorrectiveAction = createCorrectiveActionModel(this.sequelize);

      const actions = await CorrectiveAction.findAll({
        where: { findingId },
        order: [['targetDate', 'ASC']],
      });

      return actions;
    } catch (error: any) {
      this.logger.error(`Failed to get corrective actions: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve corrective actions');
    }
  }

  /**
   * Retrieves overdue corrective actions.
   *
   * @returns {Promise<any[]>} Overdue corrective action records
   */
  async getOverdueCorrectiveActions(): Promise<any[]> {
    try {
      const CorrectiveAction = createCorrectiveActionModel(this.sequelize);
      const now = new Date();

      const actions = await CorrectiveAction.findAll({
        where: {
          status: {
            [Op.in]: ['planned', 'in_progress'],
          },
          targetDate: {
            [Op.lt]: now,
          },
        },
        order: [['targetDate', 'ASC']],
      });

      // Update status to overdue
      for (const action of actions) {
        if (action.status !== 'overdue') {
          await action.update({ status: 'overdue' });
        }
      }

      return actions;
    } catch (error: any) {
      this.logger.error(`Failed to get overdue actions: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve overdue corrective actions');
    }
  }

  // ============================================================================
  // INTERNAL CONTROL MANAGEMENT
  // ============================================================================

  /**
   * Creates a new internal control.
   *
   * @param {InternalControlData} data - Internal control data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created internal control record
   */
  async createInternalControl(data: InternalControlData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating internal control: ${data.controlId}`);

      const InternalControl = createInternalControlModel(this.sequelize);

      const control = await InternalControl.create(
        {
          controlId: data.controlId,
          controlName: data.controlName,
          controlType: data.controlType,
          controlOwner: data.controlOwner,
          frequency: data.frequency,
          lastTested: data.lastTested || null,
          testResult: data.testResult || null,
          isKey: data.isKey,
          soxRelevant: data.soxRelevant,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Internal control created: ${control.id}`);
      return control;
    } catch (error: any) {
      this.logger.error(`Failed to create internal control: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create internal control');
    }
  }

  /**
   * Records internal control test result.
   *
   * @param {string} controlId - Control ID
   * @param {string} testResult - Test result
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated internal control record
   */
  async recordControlTestResult(
    controlId: string,
    testResult: string,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      const InternalControl = createInternalControlModel(this.sequelize);

      const control = await InternalControl.findOne({
        where: { controlId },
        transaction,
      });

      if (!control) {
        throw new NotFoundException(`Internal control not found: ${controlId}`);
      }

      await control.update(
        {
          testResult,
          lastTested: new Date(),
        },
        { transaction },
      );

      return control;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to record test result: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to record control test result');
    }
  }

  /**
   * Retrieves key controls.
   *
   * @returns {Promise<any[]>} Key internal control records
   */
  async getKeyControls(): Promise<any[]> {
    try {
      const InternalControl = createInternalControlModel(this.sequelize);

      const controls = await InternalControl.findAll({
        where: { isKey: true },
        order: [['controlName', 'ASC']],
      });

      return controls;
    } catch (error: any) {
      this.logger.error(`Failed to get key controls: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve key controls');
    }
  }

  /**
   * Retrieves SOX-relevant controls.
   *
   * @returns {Promise<any[]>} SOX-relevant internal control records
   */
  async getSOXControls(): Promise<any[]> {
    try {
      const InternalControl = createInternalControlModel(this.sequelize);

      const controls = await InternalControl.findAll({
        where: { soxRelevant: true },
        order: [['controlName', 'ASC']],
      });

      return controls;
    } catch (error: any) {
      this.logger.error(`Failed to get SOX controls: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve SOX controls');
    }
  }

  /**
   * Retrieves controls due for testing.
   *
   * @param {Date} asOfDate - As of date
   * @returns {Promise<any[]>} Internal control records due for testing
   */
  async getControlsDueForTesting(asOfDate: Date): Promise<any[]> {
    try {
      const InternalControl = createInternalControlModel(this.sequelize);

      const controls = await InternalControl.findAll({
        where: {
          [Op.or]: [
            { lastTested: null },
            // This is simplified - in production, you'd calculate based on frequency
            {
              lastTested: {
                [Op.lt]: new Date(asOfDate.getTime() - 90 * 24 * 60 * 60 * 1000),
              },
            },
          ],
        },
        order: [['lastTested', 'ASC']],
      });

      return controls;
    } catch (error: any) {
      this.logger.error(`Failed to get controls due: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve controls due for testing');
    }
  }

  // ============================================================================
  // RISK ASSESSMENT MANAGEMENT
  // ============================================================================

  /**
   * Creates a new risk assessment.
   *
   * @param {RiskAssessmentData} data - Risk assessment data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created risk assessment record
   */
  async createRiskAssessment(data: RiskAssessmentData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating risk assessment: ${data.assessmentId}`);

      const RiskAssessment = createRiskAssessmentModel(this.sequelize);

      const assessment = await RiskAssessment.create(
        {
          assessmentId: data.assessmentId,
          riskCategory: data.riskCategory,
          riskDescription: data.riskDescription,
          likelihood: data.likelihood,
          impact: data.impact,
          riskScore: data.riskScore,
          mitigationStrategy: data.mitigationStrategy,
          owner: data.owner,
          lastReviewed: data.lastReviewed,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Risk assessment created: ${assessment.id}`);
      return assessment;
    } catch (error: any) {
      this.logger.error(`Failed to create risk assessment: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create risk assessment');
    }
  }

  /**
   * Calculates risk score based on likelihood and impact.
   *
   * @param {string} likelihood - Likelihood rating
   * @param {string} impact - Impact rating
   * @returns {number} Risk score
   */
  calculateRiskScore(likelihood: string, impact: string): number {
    const likelihoodScores: Record<string, number> = {
      rare: 1,
      unlikely: 2,
      possible: 3,
      likely: 4,
      almost_certain: 5,
    };

    const impactScores: Record<string, number> = {
      insignificant: 1,
      minor: 2,
      moderate: 3,
      major: 4,
      catastrophic: 5,
    };

    return likelihoodScores[likelihood] * impactScores[impact];
  }

  /**
   * Retrieves high-risk assessments.
   *
   * @param {number} threshold - Risk score threshold (default 15)
   * @returns {Promise<any[]>} High-risk assessment records
   */
  async getHighRiskAssessments(threshold: number = 15): Promise<any[]> {
    try {
      const RiskAssessment = createRiskAssessmentModel(this.sequelize);

      const assessments = await RiskAssessment.findAll({
        where: {
          riskScore: {
            [Op.gte]: threshold,
          },
        },
        order: [['riskScore', 'DESC']],
      });

      return assessments;
    } catch (error: any) {
      this.logger.error(`Failed to get high-risk assessments: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve high-risk assessments');
    }
  }

  /**
   * Updates risk assessment review date.
   *
   * @param {string} assessmentId - Assessment ID
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated risk assessment record
   */
  async updateRiskReviewDate(assessmentId: string, transaction?: Transaction): Promise<any> {
    try {
      const RiskAssessment = createRiskAssessmentModel(this.sequelize);

      const assessment = await RiskAssessment.findOne({
        where: { assessmentId },
        transaction,
      });

      if (!assessment) {
        throw new NotFoundException(`Risk assessment not found: ${assessmentId}`);
      }

      await assessment.update({ lastReviewed: new Date() }, { transaction });

      return assessment;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update review date: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update risk review date');
    }
  }

  // ============================================================================
  // DASHBOARD & REPORTING
  // ============================================================================

  /**
   * Generates compliance dashboard data.
   *
   * @returns {Promise<ComplianceDashboardData>} Dashboard data
   */
  async generateComplianceDashboard(): Promise<ComplianceDashboardData> {
    try {
      const ComplianceCheck = createComplianceCheckModel(this.sequelize);
      const CorrectiveAction = createCorrectiveActionModel(this.sequelize);
      const AuditSchedule = createAuditScheduleModel(this.sequelize);
      const now = new Date();

      const totalChecks = await ComplianceCheck.count();
      const passedChecks = await ComplianceCheck.count({ where: { status: 'passed' } });
      const failedChecks = await ComplianceCheck.count({ where: { status: 'failed' } });
      const needsReviewChecks = await ComplianceCheck.count({ where: { status: 'needs_review' } });

      const criticalIssues = await ComplianceCheck.count({
        where: {
          riskLevel: 'critical',
          status: 'failed',
        },
      });

      const overdueActions = await CorrectiveAction.count({
        where: {
          status: {
            [Op.in]: ['planned', 'in_progress'],
          },
          targetDate: {
            [Op.lt]: now,
          },
        },
      });

      const upcomingAudits = await AuditSchedule.count({
        where: {
          status: 'scheduled',
          plannedStartDate: {
            [Op.lte]: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      });

      const complianceRate = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;

      return {
        totalChecks,
        passedChecks,
        failedChecks,
        needsReviewChecks,
        complianceRate: Math.round(complianceRate * 100) / 100,
        criticalIssues,
        overdueActions,
        upcomingAudits,
      };
    } catch (error: any) {
      this.logger.error(`Failed to generate dashboard: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to generate compliance dashboard');
    }
  }
}
