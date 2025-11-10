/**
 * LOC: CEFMSAC005
 * File: /reuse/financial/cefms/composites/cefms-audit-compliance-tracking-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../financial-compliance-audit-kit.ts
 *   - ../../aml-audit-quality-assurance-kit.ts
 *   - ../../regulatory-filing-submission-kit.ts
 *   - ../../financial-risk-assessment-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS audit services
 *   - USACE compliance tracking systems
 *   - Audit finding modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-audit-compliance-tracking-composite.ts
 * Locator: WC-CEFMS-AC-005
 * Purpose: USACE CEFMS Audit and Compliance Tracking - audit trails, compliance checks, findings management
 *
 * Upstream: Composes utilities from financial kits for audit and compliance
 * Downstream: ../../../backend/cefms/*, Audit controllers, compliance reporting, findings tracking
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ composite functions for USACE CEFMS audit and compliance operations
 *
 * LLM Context: Production-ready USACE CEFMS audit and compliance tracking system.
 * Comprehensive audit trail management, compliance monitoring, finding tracking, corrective action plans,
 * internal controls testing, SOX compliance, federal audit requirements, risk assessment,
 * audit schedule management, evidence collection, audit report generation, and remediation tracking.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

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
}

interface EvidenceDocumentData {
  documentId: string;
  auditId: string;
  findingId?: string;
  documentType: string;
  documentName: string;
  documentPath: string;
  uploadedBy: string;
  uploadedDate: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Audit Trail with comprehensive change tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AuditTrail model
 *
 * @example
 * ```typescript
 * const AuditTrail = createAuditTrailModel(sequelize);
 * const trail = await AuditTrail.create({
 *   auditId: 'AUDIT-2024-001',
 *   entityType: 'journal_entry',
 *   entityId: 'JE-001',
 *   action: 'update',
 *   userId: 'user123',
 *   userName: 'John Doe',
 *   timestamp: new Date(),
 *   changes: { amount: { old: 1000, new: 1500 } }
 * });
 * ```
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
        comment: 'Entity type',
      },
      entityId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Entity identifier',
      },
      action: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Action performed',
      },
      userId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'User ID',
      },
      userName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'User name',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Action timestamp',
      },
      changes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Change details',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: 'IP address',
      },
      sessionId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Session ID',
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
      tableName: 'audit_trails',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['auditId'] },
        { fields: ['entityType', 'entityId'] },
        { fields: ['userId'] },
        { fields: ['timestamp'] },
        { fields: ['action'] },
      ],
    },
  );

  return AuditTrail;
};

/**
 * Sequelize model for Compliance Checks with risk categorization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ComplianceCheck model
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
        comment: 'Check identifier',
      },
      checkType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Check type',
      },
      checkCategory: {
        type: DataTypes.ENUM('financial', 'operational', 'regulatory', 'sox', 'grants'),
        allowNull: false,
        comment: 'Check category',
      },
      checkDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Check date',
      },
      performedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Performed by user',
      },
      status: {
        type: DataTypes.ENUM('passed', 'failed', 'needs_review'),
        allowNull: false,
        comment: 'Check status',
      },
      scope: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Check scope',
      },
      findings: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Findings',
      },
      riskLevel: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        comment: 'Risk level',
      },
      nextCheckDue: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Next check due date',
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
      tableName: 'compliance_checks',
      timestamps: true,
      indexes: [
        { fields: ['checkId'], unique: true },
        { fields: ['checkType'] },
        { fields: ['checkCategory'] },
        { fields: ['status'] },
        { fields: ['riskLevel'] },
        { fields: ['checkDate'] },
      ],
    },
  );

  return ComplianceCheck;
};

/**
 * Sequelize model for Audit Findings with severity tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AuditFinding model
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
    public resolvedDate!: Date | null;
    public resolvedBy!: string | null;
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
        comment: 'Related audit',
      },
      findingCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Finding category',
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        comment: 'Severity level',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Finding description',
      },
      recommendation: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Recommendation',
      },
      affectedArea: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Affected area',
      },
      identifiedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Identified date',
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
        comment: 'Due date for resolution',
      },
      resolvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Resolved date',
      },
      resolvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Resolved by user',
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
      tableName: 'audit_findings',
      timestamps: true,
      indexes: [
        { fields: ['findingId'], unique: true },
        { fields: ['auditId'] },
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['dueDate'] },
        { fields: ['findingCategory'] },
      ],
    },
  );

  return AuditFinding;
};

/**
 * Sequelize model for Corrective Actions with progress tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CorrectiveAction model
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
    public progressPercent!: number;
    public evidence!: string | null;
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
        comment: 'Related finding',
      },
      actionDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Action description',
      },
      responsibleParty: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Responsible party',
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
      progressPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Progress percentage',
        validate: {
          min: 0,
          max: 100,
        },
      },
      evidence: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Evidence of completion',
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
      tableName: 'corrective_actions',
      timestamps: true,
      indexes: [
        { fields: ['actionId'], unique: true },
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
 * Sequelize model for Internal Controls with testing schedule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InternalControl model
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
    public nextTestDue!: Date | null;
    public isKey!: boolean;
    public description!: string;
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
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Control name',
      },
      controlType: {
        type: DataTypes.ENUM('preventive', 'detective', 'corrective'),
        allowNull: false,
        comment: 'Control type',
      },
      controlOwner: {
        type: DataTypes.STRING(50),
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
        comment: 'Test result',
      },
      nextTestDue: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Next test due date',
      },
      isKey: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is key control',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Control description',
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
      tableName: 'internal_controls',
      timestamps: true,
      indexes: [
        { fields: ['controlId'], unique: true },
        { fields: ['controlType'] },
        { fields: ['controlOwner'] },
        { fields: ['isKey'] },
        { fields: ['nextTestDue'] },
        { fields: ['testResult'] },
      ],
    },
  );

  return InternalControl;
};

/**
 * Sequelize model for Risk Assessment with scoring matrix.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RiskAssessment model
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
    public residualRisk!: number;
    public mitigationStrategy!: string;
    public owner!: string;
    public assessmentDate!: Date;
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
        comment: 'Risk score (1-25)',
        validate: {
          min: 1,
          max: 25,
        },
      },
      residualRisk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Residual risk after mitigation',
      },
      mitigationStrategy: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Mitigation strategy',
      },
      owner: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Risk owner',
      },
      assessmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Assessment date',
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
      tableName: 'risk_assessments',
      timestamps: true,
      indexes: [
        { fields: ['assessmentId'], unique: true },
        { fields: ['riskCategory'] },
        { fields: ['riskScore'] },
        { fields: ['owner'] },
        { fields: ['assessmentDate'] },
      ],
    },
  );

  return RiskAssessment;
};

/**
 * Sequelize model for Audit Schedule with milestone tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AuditSchedule model
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
        comment: 'Schedule identifier',
      },
      auditType: {
        type: DataTypes.ENUM('internal', 'external', 'sox', 'federal', 'grant'),
        allowNull: false,
        comment: 'Audit type',
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
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Lead auditor',
      },
      scope: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Audit scope',
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
      tableName: 'audit_schedules',
      timestamps: true,
      indexes: [
        { fields: ['scheduleId'], unique: true },
        { fields: ['auditType'] },
        { fields: ['status'] },
        { fields: ['plannedStartDate', 'plannedEndDate'] },
        { fields: ['auditor'] },
      ],
    },
  );

  return AuditSchedule;
};

// ============================================================================
// AUDIT TRAIL MANAGEMENT (1-7)
// ============================================================================

/**
 * Records audit trail entry.
 *
 * @param {AuditTrailData} trailData - Audit trail data
 * @param {Model} AuditTrail - AuditTrail model
 * @returns {Promise<any>} Created audit trail
 */
export const recordAuditTrail = async (
  trailData: AuditTrailData,
  AuditTrail: any,
): Promise<any> => {
  return await AuditTrail.create(trailData);
};

/**
 * Retrieves audit trail by entity.
 *
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {Model} AuditTrail - AuditTrail model
 * @returns {Promise<any[]>} Audit trail entries
 */
export const getAuditTrailByEntity = async (
  entityType: string,
  entityId: string,
  AuditTrail: any,
): Promise<any[]> => {
  return await AuditTrail.findAll({
    where: { entityType, entityId },
    order: [['timestamp', 'DESC']],
  });
};

/**
 * Retrieves audit trail by user.
 *
 * @param {string} userId - User ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} AuditTrail - AuditTrail model
 * @returns {Promise<any[]>} User audit trail
 */
export const getAuditTrailByUser = async (
  userId: string,
  startDate: Date,
  endDate: Date,
  AuditTrail: any,
): Promise<any[]> => {
  return await AuditTrail.findAll({
    where: {
      userId,
      timestamp: { [Op.between]: [startDate, endDate] },
    },
    order: [['timestamp', 'DESC']],
  });
};

/**
 * Generates audit trail report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} AuditTrail - AuditTrail model
 * @returns {Promise<any>} Audit trail report
 */
export const generateAuditTrailReport = async (
  startDate: Date,
  endDate: Date,
  AuditTrail: any,
): Promise<any> => {
  const trails = await AuditTrail.findAll({
    where: { timestamp: { [Op.between]: [startDate, endDate] } },
  });

  const actionCounts = new Map<string, number>();
  const userCounts = new Map<string, number>();

  trails.forEach((trail: any) => {
    const actionCount = actionCounts.get(trail.action) || 0;
    actionCounts.set(trail.action, actionCount + 1);

    const userCount = userCounts.get(trail.userId) || 0;
    userCounts.set(trail.userId, userCount + 1);
  });

  return {
    period: { startDate, endDate },
    totalEntries: trails.length,
    actionBreakdown: Array.from(actionCounts.entries()).map(([action, count]) => ({
      action,
      count,
    })),
    userActivity: Array.from(userCounts.entries()).map(([userId, count]) => ({
      userId,
      count,
    })),
  };
};

/**
 * Exports audit trail to CSV.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} AuditTrail - AuditTrail model
 * @returns {Promise<string>} CSV content
 */
export const exportAuditTrailCSV = async (
  startDate: Date,
  endDate: Date,
  AuditTrail: any,
): Promise<string> => {
  const trails = await AuditTrail.findAll({
    where: { timestamp: { [Op.between]: [startDate, endDate] } },
    order: [['timestamp', 'ASC']],
  });

  const headers = 'Timestamp,User,Entity Type,Entity ID,Action,Changes\n';
  const rows = trails.map((t: any) =>
    `${t.timestamp.toISOString()},${t.userName},${t.entityType},${t.entityId},${t.action},"${JSON.stringify(t.changes)}"`
  );

  return headers + rows.join('\n');
};

/**
 * Validates audit trail completeness.
 *
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {Model} AuditTrail - AuditTrail model
 * @returns {Promise<{ complete: boolean; missingActions: string[] }>}
 */
export const validateAuditTrailCompleteness = async (
  entityType: string,
  entityId: string,
  AuditTrail: any,
): Promise<{ complete: boolean; missingActions: string[] }> => {
  const trails = await AuditTrail.findAll({
    where: { entityType, entityId },
  });

  const requiredActions = ['create', 'update', 'approve'];
  const recordedActions = new Set(trails.map((t: any) => t.action));
  const missingActions = requiredActions.filter(action => !recordedActions.has(action));

  return {
    complete: missingActions.length === 0,
    missingActions,
  };
};

/**
 * Detects suspicious audit patterns.
 *
 * @param {Model} AuditTrail - AuditTrail model
 * @returns {Promise<any[]>} Suspicious patterns
 */
export const detectSuspiciousAuditPatterns = async (
  AuditTrail: any,
): Promise<any[]> => {
  const patterns: any[] = [];

  // Detect excessive activity from single user
  const userActivity = await AuditTrail.findAll({
    attributes: [
      'userId',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
    ],
    where: {
      timestamp: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    group: ['userId'],
    having: Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('id')), Op.gt, 1000),
  });

  userActivity.forEach((activity: any) => {
    patterns.push({
      type: 'excessive_activity',
      userId: activity.userId,
      count: activity.get('count'),
    });
  });

  return patterns;
};

// ============================================================================
// COMPLIANCE CHECK MANAGEMENT (8-14)
// ============================================================================

/**
 * Performs compliance check.
 *
 * @param {ComplianceCheckData} checkData - Check data
 * @param {Model} ComplianceCheck - ComplianceCheck model
 * @returns {Promise<any>} Created check
 */
export const performComplianceCheck = async (
  checkData: ComplianceCheckData,
  ComplianceCheck: any,
): Promise<any> => {
  const check = await ComplianceCheck.create(checkData);

  // Schedule next check based on category
  const nextCheckDue = new Date(checkData.checkDate);
  switch (checkData.checkCategory) {
    case 'sox':
      nextCheckDue.setMonth(nextCheckDue.getMonth() + 3); // Quarterly
      break;
    case 'grants':
      nextCheckDue.setMonth(nextCheckDue.getMonth() + 6); // Semi-annual
      break;
    default:
      nextCheckDue.setFullYear(nextCheckDue.getFullYear() + 1); // Annual
  }

  check.nextCheckDue = nextCheckDue;
  await check.save();

  return check;
};

/**
 * Retrieves failed compliance checks.
 *
 * @param {Model} ComplianceCheck - ComplianceCheck model
 * @returns {Promise<any[]>} Failed checks
 */
export const getFailedComplianceChecks = async (
  ComplianceCheck: any,
): Promise<any[]> => {
  return await ComplianceCheck.findAll({
    where: { status: 'failed' },
    order: [['riskLevel', 'DESC'], ['checkDate', 'DESC']],
  });
};

/**
 * Retrieves checks due for review.
 *
 * @param {Model} ComplianceCheck - ComplianceCheck model
 * @returns {Promise<any[]>} Checks due
 */
export const getChecksDueForReview = async (
  ComplianceCheck: any,
): Promise<any[]> => {
  return await ComplianceCheck.findAll({
    where: {
      nextCheckDue: { [Op.lte]: new Date() },
    },
    order: [['nextCheckDue', 'ASC']],
  });
};

/**
 * Generates compliance dashboard.
 *
 * @param {Model} ComplianceCheck - ComplianceCheck model
 * @returns {Promise<any>} Compliance dashboard
 */
export const generateComplianceDashboard = async (
  ComplianceCheck: any,
): Promise<any> => {
  const checks = await ComplianceCheck.findAll();

  const totalChecks = checks.length;
  const passed = checks.filter((c: any) => c.status === 'passed').length;
  const failed = checks.filter((c: any) => c.status === 'failed').length;
  const needsReview = checks.filter((c: any) => c.status === 'needs_review').length;

  const criticalIssues = checks.filter(
    (c: any) => c.status === 'failed' && c.riskLevel === 'critical',
  ).length;

  return {
    totalChecks,
    passed,
    failed,
    needsReview,
    criticalIssues,
    passRate: totalChecks > 0 ? (passed / totalChecks) * 100 : 0,
    overallHealth: criticalIssues === 0 ? (passed >= totalChecks * 0.8 ? 'good' : 'needs_attention') : 'critical',
  };
};

/**
 * Validates SOX compliance controls.
 *
 * @param {Model} ComplianceCheck - ComplianceCheck model
 * @param {Model} InternalControl - InternalControl model
 * @returns {Promise<{ compliant: boolean; issues: string[] }>}
 */
export const validateSOXCompliance = async (
  ComplianceCheck: any,
  InternalControl: any,
): Promise<{ compliant: boolean; issues: string[] }> => {
  const issues: string[] = [];

  // Check for recent SOX checks
  const soxChecks = await ComplianceCheck.findAll({
    where: {
      checkCategory: 'sox',
      checkDate: { [Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
    },
  });

  if (soxChecks.length === 0) {
    issues.push('No recent SOX compliance checks');
  }

  const failedSOXChecks = soxChecks.filter((c: any) => c.status === 'failed');
  if (failedSOXChecks.length > 0) {
    issues.push(`${failedSOXChecks.length} failed SOX checks`);
  }

  // Check key controls testing
  const keyControls = await InternalControl.findAll({ where: { isKey: true } });
  const untestedControls = keyControls.filter(
    (c: any) => !c.lastTested || new Date(c.lastTested) < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
  );

  if (untestedControls.length > 0) {
    issues.push(`${untestedControls.length} key controls not tested in past year`);
  }

  return {
    compliant: issues.length === 0,
    issues,
  };
};

/**
 * Exports compliance report to PDF.
 *
 * @param {Date} reportDate - Report date
 * @param {Model} ComplianceCheck - ComplianceCheck model
 * @returns {Promise<Buffer>} PDF buffer
 */
export const exportComplianceReportPDF = async (
  reportDate: Date,
  ComplianceCheck: any,
): Promise<Buffer> => {
  const dashboard = await generateComplianceDashboard(ComplianceCheck);

  const content = `
COMPLIANCE REPORT
Report Date: ${reportDate.toISOString().split('T')[0]}

Overall Health: ${dashboard.overallHealth}

Summary:
- Total Checks: ${dashboard.totalChecks}
- Passed: ${dashboard.passed}
- Failed: ${dashboard.failed}
- Needs Review: ${dashboard.needsReview}
- Critical Issues: ${dashboard.criticalIssues}
- Pass Rate: ${dashboard.passRate.toFixed(2)}%

Generated: ${new Date().toISOString()}
`;

  return Buffer.from(content, 'utf-8');
};

/**
 * Generates compliance trend analysis.
 *
 * @param {number} months - Number of months to analyze
 * @param {Model} ComplianceCheck - ComplianceCheck model
 * @returns {Promise<any[]>} Trend data
 */
export const generateComplianceTrend = async (
  months: number,
  ComplianceCheck: any,
): Promise<any[]> => {
  const trends: any[] = [];

  for (let i = 0; i < months; i++) {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() - i);
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 1);

    const checks = await ComplianceCheck.findAll({
      where: {
        checkDate: { [Op.between]: [startDate, endDate] },
      },
    });

    const passed = checks.filter((c: any) => c.status === 'passed').length;
    const total = checks.length;

    trends.push({
      month: endDate.toISOString().substring(0, 7),
      totalChecks: total,
      passed,
      passRate: total > 0 ? (passed / total) * 100 : 0,
    });
  }

  return trends.reverse();
};

// ============================================================================
// AUDIT FINDING MANAGEMENT (15-21)
// ============================================================================

/**
 * Creates audit finding.
 *
 * @param {AuditFindingData} findingData - Finding data
 * @param {Model} AuditFinding - AuditFinding model
 * @returns {Promise<any>} Created finding
 */
export const createAuditFinding = async (
  findingData: AuditFindingData,
  AuditFinding: any,
): Promise<any> => {
  return await AuditFinding.create(findingData);
};

/**
 * Updates finding status.
 *
 * @param {string} findingId - Finding ID
 * @param {string} status - New status
 * @param {string} [userId] - User updating status
 * @param {Model} AuditFinding - AuditFinding model
 * @returns {Promise<any>} Updated finding
 */
export const updateFindingStatus = async (
  findingId: string,
  status: string,
  userId: string | undefined,
  AuditFinding: any,
): Promise<any> => {
  const finding = await AuditFinding.findOne({ where: { findingId } });
  if (!finding) throw new Error('Finding not found');

  finding.status = status;
  if (status === 'resolved' || status === 'closed') {
    finding.resolvedDate = new Date();
    finding.resolvedBy = userId;
  }
  await finding.save();

  return finding;
};

/**
 * Retrieves overdue findings.
 *
 * @param {Model} AuditFinding - AuditFinding model
 * @returns {Promise<any[]>} Overdue findings
 */
export const getOverdueFindings = async (
  AuditFinding: any,
): Promise<any[]> => {
  return await AuditFinding.findAll({
    where: {
      status: { [Op.in]: ['open', 'in_progress'] },
      dueDate: { [Op.lt]: new Date() },
    },
    order: [['severity', 'DESC'], ['dueDate', 'ASC']],
  });
};

/**
 * Retrieves findings by severity.
 *
 * @param {string} severity - Severity level
 * @param {Model} AuditFinding - AuditFinding model
 * @returns {Promise<any[]>} Findings by severity
 */
export const getFindingsBySeverity = async (
  severity: string,
  AuditFinding: any,
): Promise<any[]> => {
  return await AuditFinding.findAll({
    where: { severity, status: { [Op.ne]: 'closed' } },
    order: [['identifiedDate', 'DESC']],
  });
};

/**
 * Generates finding status report.
 *
 * @param {string} auditId - Audit ID
 * @param {Model} AuditFinding - AuditFinding model
 * @returns {Promise<any>} Status report
 */
export const generateFindingStatusReport = async (
  auditId: string,
  AuditFinding: any,
): Promise<any> => {
  const findings = await AuditFinding.findAll({ where: { auditId } });

  const statusCounts = new Map<string, number>();
  const severityCounts = new Map<string, number>();

  findings.forEach((finding: any) => {
    const statusCount = statusCounts.get(finding.status) || 0;
    statusCounts.set(finding.status, statusCount + 1);

    const severityCount = severityCounts.get(finding.severity) || 0;
    severityCounts.set(finding.severity, severityCount + 1);
  });

  return {
    auditId,
    totalFindings: findings.length,
    byStatus: Array.from(statusCounts.entries()).map(([status, count]) => ({
      status,
      count,
    })),
    bySeverity: Array.from(severityCounts.entries()).map(([severity, count]) => ({
      severity,
      count,
    })),
  };
};

/**
 * Escalates critical findings.
 *
 * @param {Model} AuditFinding - AuditFinding model
 * @returns {Promise<any[]>} Escalated findings
 */
export const escalateCriticalFindings = async (
  AuditFinding: any,
): Promise<any[]> => {
  const criticalFindings = await AuditFinding.findAll({
    where: {
      severity: 'critical',
      status: { [Op.in]: ['open', 'in_progress'] },
    },
  });

  criticalFindings.forEach((finding: any) => {
    finding.metadata = {
      ...finding.metadata,
      escalated: true,
      escalatedAt: new Date().toISOString(),
    };
    finding.save();
  });

  return criticalFindings;
};

/**
 * Exports findings to Excel.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} AuditFinding - AuditFinding model
 * @returns {Promise<Buffer>} Excel buffer
 */
export const exportFindingsExcel = async (
  startDate: Date,
  endDate: Date,
  AuditFinding: any,
): Promise<Buffer> => {
  const findings = await AuditFinding.findAll({
    where: {
      identifiedDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const csv = 'Finding ID,Audit ID,Severity,Description,Status,Due Date,Affected Area\n' +
    findings.map((f: any) =>
      `${f.findingId},${f.auditId},${f.severity},${f.description},${f.status},${f.dueDate.toISOString().split('T')[0]},${f.affectedArea}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

// ============================================================================
// CORRECTIVE ACTION MANAGEMENT (22-28)
// ============================================================================

/**
 * Creates corrective action plan.
 *
 * @param {CorrectiveActionData} actionData - Action data
 * @param {Model} CorrectiveAction - CorrectiveAction model
 * @returns {Promise<any>} Created action
 */
export const createCorrectiveAction = async (
  actionData: CorrectiveActionData,
  CorrectiveAction: any,
): Promise<any> => {
  return await CorrectiveAction.create(actionData);
};

/**
 * Updates action progress.
 *
 * @param {string} actionId - Action ID
 * @param {number} progressPercent - Progress percentage
 * @param {Model} CorrectiveAction - CorrectiveAction model
 * @returns {Promise<any>} Updated action
 */
export const updateActionProgress = async (
  actionId: string,
  progressPercent: number,
  CorrectiveAction: any,
): Promise<any> => {
  const action = await CorrectiveAction.findOne({ where: { actionId } });
  if (!action) throw new Error('Action not found');

  action.progressPercent = progressPercent;

  if (progressPercent >= 100) {
    action.status = 'completed';
    action.actualDate = new Date();
  } else if (progressPercent > 0) {
    action.status = 'in_progress';
  }

  await action.save();
  return action;
};

/**
 * Marks action as completed.
 *
 * @param {string} actionId - Action ID
 * @param {string} evidence - Evidence of completion
 * @param {Model} CorrectiveAction - CorrectiveAction model
 * @returns {Promise<any>} Completed action
 */
export const completeCorrectiveAction = async (
  actionId: string,
  evidence: string,
  CorrectiveAction: any,
): Promise<any> => {
  const action = await CorrectiveAction.findOne({ where: { actionId } });
  if (!action) throw new Error('Action not found');

  action.status = 'completed';
  action.actualDate = new Date();
  action.progressPercent = 100;
  action.evidence = evidence;
  await action.save();

  return action;
};

/**
 * Retrieves overdue actions.
 *
 * @param {Model} CorrectiveAction - CorrectiveAction model
 * @returns {Promise<any[]>} Overdue actions
 */
export const getOverdueActions = async (
  CorrectiveAction: any,
): Promise<any[]> => {
  return await CorrectiveAction.findAll({
    where: {
      status: { [Op.in]: ['planned', 'in_progress'] },
      targetDate: { [Op.lt]: new Date() },
    },
    order: [['targetDate', 'ASC']],
  });
};

/**
 * Generates action plan report.
 *
 * @param {string} findingId - Finding ID
 * @param {Model} CorrectiveAction - CorrectiveAction model
 * @returns {Promise<any>} Action plan report
 */
export const generateActionPlanReport = async (
  findingId: string,
  CorrectiveAction: any,
): Promise<any> => {
  const actions = await CorrectiveAction.findAll({ where: { findingId } });

  const totalActions = actions.length;
  const completed = actions.filter((a: any) => a.status === 'completed').length;
  const overdue = actions.filter(
    (a: any) => a.status !== 'completed' && new Date(a.targetDate) < new Date(),
  ).length;

  const avgProgress = actions.reduce(
    (sum: number, a: any) => sum + parseFloat(a.progressPercent),
    0,
  ) / totalActions || 0;

  return {
    findingId,
    totalActions,
    completed,
    overdue,
    inProgress: totalActions - completed - overdue,
    completionRate: totalActions > 0 ? (completed / totalActions) * 100 : 0,
    avgProgress,
  };
};

/**
 * Validates action plan effectiveness.
 *
 * @param {string} findingId - Finding ID
 * @param {Model} CorrectiveAction - CorrectiveAction model
 * @param {Model} AuditFinding - AuditFinding model
 * @returns {Promise<{ effective: boolean; reason: string }>}
 */
export const validateActionPlanEffectiveness = async (
  findingId: string,
  CorrectiveAction: any,
  AuditFinding: any,
): Promise<{ effective: boolean; reason: string }> => {
  const finding = await AuditFinding.findOne({ where: { findingId } });
  if (!finding) throw new Error('Finding not found');

  const actions = await CorrectiveAction.findAll({ where: { findingId } });

  if (actions.length === 0) {
    return { effective: false, reason: 'No corrective actions defined' };
  }

  const allCompleted = actions.every((a: any) => a.status === 'completed');
  if (!allCompleted) {
    return { effective: false, reason: 'Not all actions completed' };
  }

  if (finding.status === 'resolved' || finding.status === 'closed') {
    return { effective: true, reason: 'Finding resolved with completed actions' };
  }

  return { effective: false, reason: 'Finding not yet resolved' };
};

/**
 * Exports action plan to PDF.
 *
 * @param {string} findingId - Finding ID
 * @param {Model} CorrectiveAction - CorrectiveAction model
 * @param {Model} AuditFinding - AuditFinding model
 * @returns {Promise<Buffer>} PDF buffer
 */
export const exportActionPlanPDF = async (
  findingId: string,
  CorrectiveAction: any,
  AuditFinding: any,
): Promise<Buffer> => {
  const finding = await AuditFinding.findOne({ where: { findingId } });
  const actions = await CorrectiveAction.findAll({ where: { findingId } });

  const content = `
CORRECTIVE ACTION PLAN
Finding ID: ${findingId}
Description: ${finding?.description || 'N/A'}
Severity: ${finding?.severity || 'N/A'}

Actions:
${actions.map((a: any, i: number) => `
${i + 1}. ${a.actionDescription}
   Responsible: ${a.responsibleParty}
   Target Date: ${a.targetDate.toISOString().split('T')[0]}
   Status: ${a.status}
   Progress: ${a.progressPercent}%
`).join('\n')}

Generated: ${new Date().toISOString()}
`;

  return Buffer.from(content, 'utf-8');
};

// ============================================================================
// INTERNAL CONTROLS TESTING (29-35)
// ============================================================================

/**
 * Creates internal control.
 *
 * @param {InternalControlData} controlData - Control data
 * @param {Model} InternalControl - InternalControl model
 * @returns {Promise<any>} Created control
 */
export const createInternalControl = async (
  controlData: InternalControlData,
  InternalControl: any,
): Promise<any> => {
  return await InternalControl.create(controlData);
};

/**
 * Tests internal control effectiveness.
 *
 * @param {string} controlId - Control ID
 * @param {string} testResult - Test result
 * @param {string} userId - User testing control
 * @param {Model} InternalControl - InternalControl model
 * @returns {Promise<any>} Updated control
 */
export const testInternalControl = async (
  controlId: string,
  testResult: string,
  userId: string,
  InternalControl: any,
): Promise<any> => {
  const control = await InternalControl.findOne({ where: { controlId } });
  if (!control) throw new Error('Control not found');

  control.lastTested = new Date();
  control.testResult = testResult;

  // Calculate next test due
  const nextDue = new Date();
  switch (control.frequency) {
    case 'daily':
      nextDue.setDate(nextDue.getDate() + 1);
      break;
    case 'weekly':
      nextDue.setDate(nextDue.getDate() + 7);
      break;
    case 'monthly':
      nextDue.setMonth(nextDue.getMonth() + 1);
      break;
    case 'quarterly':
      nextDue.setMonth(nextDue.getMonth() + 3);
      break;
    case 'annual':
      nextDue.setFullYear(nextDue.getFullYear() + 1);
      break;
  }

  control.nextTestDue = nextDue;
  control.metadata = {
    ...control.metadata,
    lastTestedBy: userId,
  };

  await control.save();
  return control;
};

/**
 * Retrieves controls due for testing.
 *
 * @param {Model} InternalControl - InternalControl model
 * @returns {Promise<any[]>} Controls due
 */
export const getControlsDueForTesting = async (
  InternalControl: any,
): Promise<any[]> => {
  return await InternalControl.findAll({
    where: {
      nextTestDue: { [Op.lte]: new Date() },
    },
    order: [['isKey', 'DESC'], ['nextTestDue', 'ASC']],
  });
};

/**
 * Retrieves ineffective controls.
 *
 * @param {Model} InternalControl - InternalControl model
 * @returns {Promise<any[]>} Ineffective controls
 */
export const getIneffectiveControls = async (
  InternalControl: any,
): Promise<any[]> => {
  return await InternalControl.findAll({
    where: {
      testResult: { [Op.in]: ['ineffective', 'needs_improvement'] },
    },
    order: [['isKey', 'DESC']],
  });
};

/**
 * Generates control testing schedule.
 *
 * @param {number} months - Number of months to schedule
 * @param {Model} InternalControl - InternalControl model
 * @returns {Promise<any[]>} Testing schedule
 */
export const generateControlTestingSchedule = async (
  months: number,
  InternalControl: any,
): Promise<any[]> => {
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + months);

  return await InternalControl.findAll({
    where: {
      nextTestDue: { [Op.lte]: endDate },
    },
    order: [['nextTestDue', 'ASC']],
  });
};

/**
 * Generates control effectiveness report.
 *
 * @param {Model} InternalControl - InternalControl model
 * @returns {Promise<any>} Effectiveness report
 */
export const generateControlEffectivenessReport = async (
  InternalControl: any,
): Promise<any> => {
  const controls = await InternalControl.findAll({
    where: { testResult: { [Op.ne]: null } },
  });

  const totalControls = controls.length;
  const effective = controls.filter((c: any) => c.testResult === 'effective').length;
  const ineffective = controls.filter((c: any) => c.testResult === 'ineffective').length;
  const needsImprovement = controls.filter((c: any) => c.testResult === 'needs_improvement').length;

  const keyControls = controls.filter((c: any) => c.isKey);
  const keyEffective = keyControls.filter((c: any) => c.testResult === 'effective').length;

  return {
    totalControls,
    effective,
    ineffective,
    needsImprovement,
    effectivenessRate: totalControls > 0 ? (effective / totalControls) * 100 : 0,
    keyControlsTotal: keyControls.length,
    keyControlsEffective: keyEffective,
    keyControlsEffectivenessRate: keyControls.length > 0 ? (keyEffective / keyControls.length) * 100 : 0,
  };
};

/**
 * Exports control matrix to Excel.
 *
 * @param {Model} InternalControl - InternalControl model
 * @returns {Promise<Buffer>} Excel buffer
 */
export const exportControlMatrixExcel = async (
  InternalControl: any,
): Promise<Buffer> => {
  const controls = await InternalControl.findAll();

  const csv = 'Control ID,Control Name,Type,Owner,Frequency,Last Tested,Result,Is Key\n' +
    controls.map((c: any) =>
      `${c.controlId},${c.controlName},${c.controlType},${c.controlOwner},${c.frequency},${c.lastTested?.toISOString().split('T')[0] || 'N/A'},${c.testResult || 'Not Tested'},${c.isKey}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

// ============================================================================
// RISK ASSESSMENT (36-40)
// ============================================================================

/**
 * Performs risk assessment.
 *
 * @param {RiskAssessmentData} riskData - Risk data
 * @param {Model} RiskAssessment - RiskAssessment model
 * @returns {Promise<any>} Created assessment
 */
export const performRiskAssessment = async (
  riskData: RiskAssessmentData,
  RiskAssessment: any,
): Promise<any> => {
  return await RiskAssessment.create({
    ...riskData,
    assessmentDate: new Date(),
  });
};

/**
 * Calculates risk score matrix.
 *
 * @param {string} likelihood - Likelihood rating
 * @param {string} impact - Impact rating
 * @returns {number} Risk score
 */
export const calculateRiskScore = (
  likelihood: string,
  impact: string,
): number => {
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
};

/**
 * Retrieves high-risk items.
 *
 * @param {Model} RiskAssessment - RiskAssessment model
 * @returns {Promise<any[]>} High-risk items
 */
export const getHighRiskItems = async (
  RiskAssessment: any,
): Promise<any[]> => {
  return await RiskAssessment.findAll({
    where: { riskScore: { [Op.gte]: 15 } },
    order: [['riskScore', 'DESC']],
  });
};

/**
 * Generates risk heat map.
 *
 * @param {Model} RiskAssessment - RiskAssessment model
 * @returns {Promise<any>} Heat map data
 */
export const generateRiskHeatMap = async (
  RiskAssessment: any,
): Promise<any> => {
  const assessments = await RiskAssessment.findAll();

  const heatMap: Record<string, Record<string, number>> = {};

  assessments.forEach((assessment: any) => {
    if (!heatMap[assessment.likelihood]) {
      heatMap[assessment.likelihood] = {};
    }
    heatMap[assessment.likelihood][assessment.impact] = (heatMap[assessment.likelihood][assessment.impact] || 0) + 1;
  });

  return heatMap;
};

/**
 * Updates risk mitigation status.
 *
 * @param {string} assessmentId - Assessment ID
 * @param {number} residualRisk - Residual risk score
 * @param {Model} RiskAssessment - RiskAssessment model
 * @returns {Promise<any>} Updated assessment
 */
export const updateRiskMitigation = async (
  assessmentId: string,
  residualRisk: number,
  RiskAssessment: any,
): Promise<any> => {
  const assessment = await RiskAssessment.findOne({ where: { assessmentId } });
  if (!assessment) throw new Error('Assessment not found');

  assessment.residualRisk = residualRisk;
  await assessment.save();

  return assessment;
};

// ============================================================================
// AUDIT SCHEDULING & REPORTING (41-45)
// ============================================================================

/**
 * Schedules audit engagement.
 *
 * @param {AuditScheduleData} scheduleData - Schedule data
 * @param {Model} AuditSchedule - AuditSchedule model
 * @returns {Promise<any>} Created schedule
 */
export const scheduleAudit = async (
  scheduleData: AuditScheduleData,
  AuditSchedule: any,
): Promise<any> => {
  return await AuditSchedule.create(scheduleData);
};

/**
 * Starts audit engagement.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {Model} AuditSchedule - AuditSchedule model
 * @returns {Promise<any>} Started audit
 */
export const startAuditEngagement = async (
  scheduleId: string,
  AuditSchedule: any,
): Promise<any> => {
  const schedule = await AuditSchedule.findOne({ where: { scheduleId } });
  if (!schedule) throw new Error('Schedule not found');

  schedule.status = 'in_progress';
  schedule.actualStartDate = new Date();
  await schedule.save();

  return schedule;
};

/**
 * Completes audit engagement.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {Model} AuditSchedule - AuditSchedule model
 * @returns {Promise<any>} Completed audit
 */
export const completeAuditEngagement = async (
  scheduleId: string,
  AuditSchedule: any,
): Promise<any> => {
  const schedule = await AuditSchedule.findOne({ where: { scheduleId } });
  if (!schedule) throw new Error('Schedule not found');

  schedule.status = 'completed';
  schedule.actualEndDate = new Date();
  await schedule.save();

  return schedule;
};

/**
 * Generates annual audit plan.
 *
 * @param {number} year - Fiscal year
 * @param {Model} AuditSchedule - AuditSchedule model
 * @returns {Promise<any>} Annual plan
 */
export const generateAnnualAuditPlan = async (
  year: number,
  AuditSchedule: any,
): Promise<any> => {
  const audits = await AuditSchedule.findAll({
    where: {
      plannedStartDate: {
        [Op.between]: [
          new Date(year, 0, 1),
          new Date(year, 11, 31),
        ],
      },
    },
    order: [['plannedStartDate', 'ASC']],
  });

  const byType = new Map<string, number>();
  audits.forEach((audit: any) => {
    const count = byType.get(audit.auditType) || 0;
    byType.set(audit.auditType, count + 1);
  });

  return {
    year,
    totalAudits: audits.length,
    byType: Array.from(byType.entries()).map(([type, count]) => ({
      auditType: type,
      count,
    })),
    audits,
  };
};

/**
 * Exports comprehensive audit report package.
 *
 * @param {string} auditId - Audit ID
 * @param {Model} AuditFinding - AuditFinding model
 * @param {Model} CorrectiveAction - CorrectiveAction model
 * @param {Model} AuditTrail - AuditTrail model
 * @returns {Promise<any>} Audit report package
 */
export const exportAuditReportPackage = async (
  auditId: string,
  AuditFinding: any,
  CorrectiveAction: any,
  AuditTrail: any,
): Promise<any> => {
  const findings = await AuditFinding.findAll({ where: { auditId } });
  const findingIds = findings.map((f: any) => f.findingId);

  const actions = await CorrectiveAction.findAll({
    where: { findingId: { [Op.in]: findingIds } },
  });

  const auditTrails = await AuditTrail.findAll({ where: { auditId } });

  return {
    auditId,
    generatedDate: new Date(),
    findings,
    correctiveActions: actions,
    auditTrails,
    summary: {
      totalFindings: findings.length,
      criticalFindings: findings.filter((f: any) => f.severity === 'critical').length,
      openFindings: findings.filter((f: any) => f.status === 'open').length,
      totalActions: actions.length,
      completedActions: actions.filter((a: any) => a.status === 'completed').length,
    },
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSAuditComplianceService {
  constructor(private readonly sequelize: Sequelize) {}

  async recordAudit(trailData: AuditTrailData) {
    const AuditTrail = createAuditTrailModel(this.sequelize);
    return recordAuditTrail(trailData, AuditTrail);
  }

  async performCheck(checkData: ComplianceCheckData) {
    const ComplianceCheck = createComplianceCheckModel(this.sequelize);
    return performComplianceCheck(checkData, ComplianceCheck);
  }

  async createFinding(findingData: AuditFindingData) {
    const AuditFinding = createAuditFindingModel(this.sequelize);
    return createAuditFinding(findingData, AuditFinding);
  }

  async getComplianceDashboard() {
    const ComplianceCheck = createComplianceCheckModel(this.sequelize);
    return generateComplianceDashboard(ComplianceCheck);
  }
}

export default {
  // Models
  createAuditTrailModel,
  createComplianceCheckModel,
  createAuditFindingModel,
  createCorrectiveActionModel,
  createInternalControlModel,
  createRiskAssessmentModel,
  createAuditScheduleModel,

  // Audit Trail
  recordAuditTrail,
  getAuditTrailByEntity,
  getAuditTrailByUser,
  generateAuditTrailReport,
  exportAuditTrailCSV,
  validateAuditTrailCompleteness,
  detectSuspiciousAuditPatterns,

  // Compliance Checks
  performComplianceCheck,
  getFailedComplianceChecks,
  getChecksDueForReview,
  generateComplianceDashboard,
  validateSOXCompliance,
  exportComplianceReportPDF,
  generateComplianceTrend,

  // Findings
  createAuditFinding,
  updateFindingStatus,
  getOverdueFindings,
  getFindingsBySeverity,
  generateFindingStatusReport,
  escalateCriticalFindings,
  exportFindingsExcel,

  // Corrective Actions
  createCorrectiveAction,
  updateActionProgress,
  completeCorrectiveAction,
  getOverdueActions,
  generateActionPlanReport,
  validateActionPlanEffectiveness,
  exportActionPlanPDF,

  // Internal Controls
  createInternalControl,
  testInternalControl,
  getControlsDueForTesting,
  getIneffectiveControls,
  generateControlTestingSchedule,
  generateControlEffectivenessReport,
  exportControlMatrixExcel,

  // Risk Assessment
  performRiskAssessment,
  calculateRiskScore,
  getHighRiskItems,
  generateRiskHeatMap,
  updateRiskMitigation,

  // Audit Scheduling
  scheduleAudit,
  startAuditEngagement,
  completeAuditEngagement,
  generateAnnualAuditPlan,
  exportAuditReportPackage,

  // Service
  CEFMSAuditComplianceService,
};
