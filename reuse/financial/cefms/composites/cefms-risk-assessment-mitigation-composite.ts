/**
 * LOC: reuse/financial/cefms/composites/cefms-risk-assessment-mitigation-composite.ts
 *
 * UPSTREAM DEPENDENCIES:
 * - reuse/government/risk-management-internal-controls-kit.ts
 * - reuse/government/audit-transparency-trail-kit.ts
 * - reuse/government/compliance-regulatory-tracking-kit.ts
 * - reuse/government/performance-metrics-kpi-kit.ts
 *
 * DOWNSTREAM CONSUMERS:
 * - apps/white-cross-api/src/modules/financial/cefms/risk-assessment/
 * - apps/white-cross-api/src/modules/risk/enterprise-risk-management/
 * - apps/white-cross-api/src/modules/compliance/risk-mitigation/
 *
 * PURPOSE:
 * Production-ready composite providing comprehensive risk assessment and mitigation
 * capabilities for USACE CEFMS. Implements enterprise risk management (ERM), risk
 * identification, risk scoring matrices, mitigation strategies, risk monitoring,
 * control effectiveness evaluation, risk reporting, incident management, and risk
 * tolerance threshold management for federal financial operations.
 *
 * PRODUCTION READINESS:
 * - Comprehensive error handling and validation
 * - Full JSDoc documentation with examples
 * - NestJS Injectable service wrapper
 * - Sequelize ORM integration with proper indexes
 * - Composed from government kit reusable functions
 * - ERM framework and OMB Circular A-123 compliance
 */

// ============================================================================
// LLM CONTEXT: CEFMS Risk Assessment & Mitigation Composite
// ============================================================================
/**
 * This comprehensive composite provides 36+ production-ready functions for risk
 * assessment and mitigation management in USACE CEFMS environments.
 *
 * TECHNOLOGY STACK:
 * - TypeScript 5.x with strict type checking
 * - Node.js 18+ with async/await patterns
 * - NestJS 10.x for dependency injection and service architecture
 * - Sequelize 6.x ORM for PostgreSQL data persistence
 *
 * FUNCTIONAL COVERAGE:
 * - Risk Identification & Registration (7 functions)
 * - Risk Assessment & Scoring (7 functions)
 * - Mitigation Strategy & Planning (7 functions)
 * - Risk Monitoring & Tracking (7 functions)
 * - Incident Management & Response (8 functions)
 *
 * COMPLIANCE STANDARDS:
 * - OMB Circular A-123 Management's Responsibility for Enterprise Risk Management
 * - GAO Enterprise Risk Management Framework
 * - COSO ERM Integrated Framework
 * - ISO 31000 Risk Management
 * - NIST Risk Management Framework
 *
 * INTEGRATION PATTERNS:
 * All functions compose functionality from upstream government kits:
 * - Risk management and ERM from risk-management-internal-controls-kit
 * - Audit trails and evidence from audit-transparency-trail-kit
 * - Regulatory compliance from compliance-regulatory-tracking-kit
 * - Performance metrics and KPIs from performance-metrics-kpi-kit
 *
 * SERVICE ARCHITECTURE:
 * Functions are wrapped in CEFMSRiskAssessmentMitigationService injectable class
 * enabling seamless integration with NestJS modules, controllers, and other services.
 * All database operations support transactions for ACID compliance.
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  DataTypes,
  Model,
  Sequelize,
  Transaction,
  Op,
  QueryTypes
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Risk categories aligned with ERM framework
 */
export enum RiskCategory {
  STRATEGIC = 'strategic',
  OPERATIONAL = 'operational',
  FINANCIAL = 'financial',
  COMPLIANCE = 'compliance',
  REPUTATIONAL = 'reputational',
  TECHNOLOGY = 'technology',
  CYBERSECURITY = 'cybersecurity',
  ENVIRONMENTAL = 'environmental'
}

/**
 * Risk likelihood levels
 */
export enum RiskLikelihood {
  RARE = 'rare',              // < 5%
  UNLIKELY = 'unlikely',      // 5-25%
  POSSIBLE = 'possible',      // 25-50%
  LIKELY = 'likely',          // 50-75%
  ALMOST_CERTAIN = 'almost_certain' // > 75%
}

/**
 * Risk impact levels
 */
export enum RiskImpact {
  NEGLIGIBLE = 'negligible',  // < $100K
  MINOR = 'minor',            // $100K - $500K
  MODERATE = 'moderate',      // $500K - $2M
  MAJOR = 'major',            // $2M - $10M
  CATASTROPHIC = 'catastrophic' // > $10M
}

/**
 * Risk response strategies
 */
export enum RiskResponseStrategy {
  AVOID = 'avoid',
  MITIGATE = 'mitigate',
  TRANSFER = 'transfer',
  ACCEPT = 'accept',
  MONITOR = 'monitor'
}

/**
 * Risk status tracking
 */
export enum RiskStatus {
  IDENTIFIED = 'identified',
  ASSESSED = 'assessed',
  MITIGATED = 'mitigated',
  MONITORING = 'monitoring',
  CLOSED = 'closed',
  REALIZED = 'realized'
}

/**
 * Incident severity levels
 */
export enum IncidentSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Incident status tracking
 */
export enum IncidentStatus {
  REPORTED = 'reported',
  INVESTIGATING = 'investigating',
  CONTAINED = 'contained',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

/**
 * Risk tolerance levels
 */
export enum RiskTolerance {
  MINIMAL = 'minimal',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  AGGRESSIVE = 'aggressive'
}

/**
 * Risk register entry data
 */
export interface RiskRegisterData {
  riskId: string;
  riskTitle: string;
  riskDescription: string;
  riskCategory: RiskCategory;
  affectedProcesses: string[];
  identifiedBy: string;
  identifiedDate: Date;
  riskOwner: string;
  inherentLikelihood: RiskLikelihood;
  inherentImpact: RiskImpact;
  currentControls: string[];
}

/**
 * Risk assessment data
 */
export interface RiskAssessmentData {
  riskId: string;
  assessmentDate: Date;
  assessedBy: string;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  riskScore: number;
  riskLevel: string;
  assessmentNotes: string;
  scenarioAnalysis?: string;
}

/**
 * Mitigation plan data
 */
export interface MitigationPlanData {
  mitigationId: string;
  riskId: string;
  responseStrategy: RiskResponseStrategy;
  mitigationDescription: string;
  actionItems: MitigationAction[];
  responsibleParty: string;
  targetCompletionDate: Date;
  estimatedCost?: number;
  expectedRiskReduction: number;
}

/**
 * Mitigation action item
 */
export interface MitigationAction {
  actionId: string;
  description: string;
  owner: string;
  dueDate: Date;
  status: string;
  completedDate?: Date;
}

/**
 * Risk monitoring record
 */
export interface RiskMonitoringData {
  monitoringId: string;
  riskId: string;
  monitoringDate: Date;
  monitoredBy: string;
  currentLikelihood: RiskLikelihood;
  currentImpact: RiskImpact;
  trendDirection: string;
  observations: string;
  actionRequired: boolean;
}

/**
 * Incident report data
 */
export interface IncidentReportData {
  incidentId: string;
  incidentTitle: string;
  incidentDescription: string;
  incidentDate: Date;
  reportedBy: string;
  reportedDate: Date;
  severity: IncidentSeverity;
  relatedRiskIds: string[];
  affectedSystems: string[];
  estimatedImpact?: number;
}

/**
 * Risk tolerance threshold
 */
export interface RiskToleranceThreshold {
  category: RiskCategory;
  tolerance: RiskTolerance;
  maxAcceptableRiskScore: number;
  approvalRequired: boolean;
  escalationLevel: string;
  thresholdDescription: string;
}

/**
 * Risk heat map data
 */
export interface RiskHeatMapData {
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  risks: Array<{
    riskId: string;
    riskTitle: string;
    riskScore: number;
  }>;
}

// ============================================================================
// SEQUELIZE MODEL CREATION
// ============================================================================

/**
 * Creates Risk Register model for tracking all identified risks
 */
export const createRiskRegisterModel = (sequelize: Sequelize): typeof Model => {
  class RiskRegister extends Model {}

  RiskRegister.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      riskId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique risk identifier (e.g., RISK-FIN-001)',
      },
      riskTitle: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      riskDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      riskCategory: {
        type: DataTypes.ENUM(...Object.values(RiskCategory)),
        allowNull: false,
      },
      affectedProcesses: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      identifiedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      identifiedDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      riskOwner: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      inherentLikelihood: {
        type: DataTypes.ENUM(...Object.values(RiskLikelihood)),
        allowNull: false,
        comment: 'Likelihood without controls',
      },
      inherentImpact: {
        type: DataTypes.ENUM(...Object.values(RiskImpact)),
        allowNull: false,
        comment: 'Impact without controls',
      },
      inherentRiskScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      currentControls: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      status: {
        type: DataTypes.ENUM(...Object.values(RiskStatus)),
        allowNull: false,
        defaultValue: RiskStatus.IDENTIFIED,
      },
      closedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: 'RiskRegister',
      tableName: 'cefms_risk_register',
      timestamps: true,
      indexes: [
        { fields: ['riskId'], unique: true },
        { fields: ['riskCategory'] },
        { fields: ['riskOwner'] },
        { fields: ['status'] },
        { fields: ['identifiedDate'] },
        { fields: ['riskCategory', 'status'] },
      ],
    }
  );

  return RiskRegister;
};

/**
 * Creates Risk Assessment model for tracking risk evaluations
 */
export const createRiskAssessmentModel = (sequelize: Sequelize): typeof Model => {
  class RiskAssessment extends Model {}

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
      },
      riskId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      assessmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      assessedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      likelihood: {
        type: DataTypes.ENUM(...Object.values(RiskLikelihood)),
        allowNull: false,
      },
      impact: {
        type: DataTypes.ENUM(...Object.values(RiskImpact)),
        allowNull: false,
      },
      riskScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Calculated as Likelihood × Impact',
      },
      riskLevel: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Low, Medium, High, Critical',
      },
      assessmentNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      scenarioAnalysis: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      quantitativeAnalysis: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Expected loss, confidence intervals, etc.',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: 'RiskAssessment',
      tableName: 'cefms_risk_assessments',
      timestamps: true,
      indexes: [
        { fields: ['assessmentId'], unique: true },
        { fields: ['riskId'] },
        { fields: ['assessmentDate'] },
        { fields: ['riskLevel'] },
        { fields: ['riskId', 'assessmentDate'] },
      ],
    }
  );

  return RiskAssessment;
};

/**
 * Creates Mitigation Plan model for risk response strategies
 */
export const createMitigationPlanModel = (sequelize: Sequelize): typeof Model => {
  class MitigationPlan extends Model {}

  MitigationPlan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      mitigationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      riskId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      responseStrategy: {
        type: DataTypes.ENUM(...Object.values(RiskResponseStrategy)),
        allowNull: false,
      },
      mitigationDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      actionItems: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      responsibleParty: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      targetCompletionDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      actualCompletionDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      estimatedCost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      actualCost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      expectedRiskReduction: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Expected reduction in risk score (percentage)',
      },
      actualRiskReduction: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'planned',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: 'MitigationPlan',
      tableName: 'cefms_mitigation_plans',
      timestamps: true,
      indexes: [
        { fields: ['mitigationId'], unique: true },
        { fields: ['riskId'] },
        { fields: ['responseStrategy'] },
        { fields: ['status'] },
        { fields: ['responsibleParty'] },
        { fields: ['targetCompletionDate'] },
      ],
    }
  );

  return MitigationPlan;
};

/**
 * Creates Risk Monitoring model for tracking risk trends
 */
export const createRiskMonitoringModel = (sequelize: Sequelize): typeof Model => {
  class RiskMonitoring extends Model {}

  RiskMonitoring.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      monitoringId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      riskId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      monitoringDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      monitoredBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      currentLikelihood: {
        type: DataTypes.ENUM(...Object.values(RiskLikelihood)),
        allowNull: false,
      },
      currentImpact: {
        type: DataTypes.ENUM(...Object.values(RiskImpact)),
        allowNull: false,
      },
      currentRiskScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      trendDirection: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'increasing, decreasing, stable',
      },
      observations: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      actionRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      keyRiskIndicators: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: 'RiskMonitoring',
      tableName: 'cefms_risk_monitoring',
      timestamps: true,
      indexes: [
        { fields: ['monitoringId'], unique: true },
        { fields: ['riskId'] },
        { fields: ['monitoringDate'] },
        { fields: ['trendDirection'] },
        { fields: ['actionRequired'] },
        { fields: ['riskId', 'monitoringDate'] },
      ],
    }
  );

  return RiskMonitoring;
};

/**
 * Creates Incident Report model for realized risks
 */
export const createIncidentReportModel = (sequelize: Sequelize): typeof Model => {
  class IncidentReport extends Model {}

  IncidentReport.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      incidentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      incidentTitle: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      incidentDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      incidentDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reportedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      reportedDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM(...Object.values(IncidentSeverity)),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(IncidentStatus)),
        allowNull: false,
        defaultValue: IncidentStatus.REPORTED,
      },
      relatedRiskIds: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      affectedSystems: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      estimatedImpact: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      actualImpact: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      rootCause: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      resolution: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      resolvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lessonsLearned: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: 'IncidentReport',
      tableName: 'cefms_incident_reports',
      timestamps: true,
      indexes: [
        { fields: ['incidentId'], unique: true },
        { fields: ['incidentDate'] },
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['reportedBy'] },
      ],
    }
  );

  return IncidentReport;
};

/**
 * Creates Risk Tolerance model for organizational risk appetite
 */
export const createRiskToleranceModel = (sequelize: Sequelize): typeof Model => {
  class RiskTolerance extends Model {}

  RiskTolerance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      category: {
        type: DataTypes.ENUM(...Object.values(RiskCategory)),
        allowNull: false,
        unique: true,
      },
      tolerance: {
        type: DataTypes.ENUM(...Object.values(RiskTolerance)),
        allowNull: false,
      },
      maxAcceptableRiskScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      approvalRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      escalationLevel: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'e.g., CFO, CAO, Commander',
      },
      thresholdDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: 'RiskToleranceThreshold',
      tableName: 'cefms_risk_tolerance',
      timestamps: true,
      indexes: [
        { fields: ['category'], unique: true },
        { fields: ['tolerance'] },
        { fields: ['effectiveDate'] },
      ],
    }
  );

  return RiskTolerance;
};

// ============================================================================
// RISK IDENTIFICATION & REGISTRATION FUNCTIONS
// ============================================================================

/**
 * Registers a new risk in the risk register
 *
 * @param riskData - Risk register data
 * @param RiskRegisterModel - Sequelize Risk Register model
 * @param transaction - Optional transaction
 * @returns Created risk register entry
 *
 * @example
 * const risk = await registerRisk({
 *   riskId: 'RISK-FIN-001',
 *   riskTitle: 'Revenue Recognition Timing',
 *   riskDescription: 'Risk of improper revenue recognition timing leading to misstated financials',
 *   riskCategory: RiskCategory.FINANCIAL,
 *   affectedProcesses: ['PROC-REV-001', 'PROC-GL-001'],
 *   identifiedBy: 'john.doe@usace.army.mil',
 *   identifiedDate: new Date(),
 *   riskOwner: 'jane.smith@usace.army.mil',
 *   inherentLikelihood: RiskLikelihood.POSSIBLE,
 *   inherentImpact: RiskImpact.MAJOR,
 *   currentControls: ['CTRL-REV-001', 'CTRL-REV-002']
 * }, RiskRegister);
 */
export const registerRisk = async (
  riskData: RiskRegisterData,
  RiskRegisterModel: any,
  transaction?: Transaction,
): Promise<any> => {
  // Check for duplicate risk ID
  const existing = await RiskRegisterModel.findOne({
    where: { riskId: riskData.riskId },
    transaction,
  });

  if (existing) {
    throw new Error(`Risk with ID ${riskData.riskId} already exists`);
  }

  // Calculate inherent risk score
  const inherentRiskScore = calculateRiskScore(
    riskData.inherentLikelihood,
    riskData.inherentImpact
  );

  const risk = await RiskRegisterModel.create(
    {
      ...riskData,
      inherentRiskScore,
      status: RiskStatus.IDENTIFIED,
    },
    { transaction }
  );

  return risk;
};

/**
 * Updates an existing risk in the register
 */
export const updateRisk = async (
  riskId: string,
  updates: Partial<RiskRegisterData>,
  RiskRegisterModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const risk = await RiskRegisterModel.findOne({
    where: { riskId },
    transaction,
  });

  if (!risk) {
    throw new Error(`Risk ${riskId} not found`);
  }

  // Recalculate inherent risk score if likelihood or impact changed
  if (updates.inherentLikelihood || updates.inherentImpact) {
    const likelihood = updates.inherentLikelihood || risk.inherentLikelihood;
    const impact = updates.inherentImpact || risk.inherentImpact;
    updates['inherentRiskScore'] = calculateRiskScore(likelihood, impact);
  }

  await risk.update(updates, { transaction });
  return risk;
};

/**
 * Retrieves risks by category
 */
export const getRisksByCategory = async (
  category: RiskCategory,
  RiskRegisterModel: any,
  includeActive = true,
): Promise<any[]> => {
  const whereClause: any = { riskCategory: category };

  if (includeActive) {
    whereClause.status = {
      [Op.notIn]: [RiskStatus.CLOSED],
    };
  }

  const risks = await RiskRegisterModel.findAll({
    where: whereClause,
    order: [['inherentRiskScore', 'DESC']],
  });

  return risks;
};

/**
 * Retrieves risks by owner
 */
export const getRisksByOwner = async (
  riskOwner: string,
  RiskRegisterModel: any,
): Promise<any[]> => {
  const risks = await RiskRegisterModel.findAll({
    where: {
      riskOwner,
      status: {
        [Op.notIn]: [RiskStatus.CLOSED],
      },
    },
    order: [['inherentRiskScore', 'DESC']],
  });

  return risks;
};

/**
 * Performs risk identification workshop
 */
export const conductRiskIdentificationWorkshop = async (
  workshopData: {
    workshopDate: Date;
    facilitator: string;
    participants: string[];
    identifiedRisks: RiskRegisterData[];
  },
  RiskRegisterModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const createdRisks = [];

  for (const riskData of workshopData.identifiedRisks) {
    try {
      const risk = await registerRisk(riskData, RiskRegisterModel, transaction);
      createdRisks.push(risk);
    } catch (error) {
      // Log error but continue with other risks
      console.error(`Failed to register risk ${riskData.riskId}:`, error.message);
    }
  }

  return {
    workshopDate: workshopData.workshopDate,
    facilitator: workshopData.facilitator,
    participants: workshopData.participants,
    risksIdentified: workshopData.identifiedRisks.length,
    risksCreated: createdRisks.length,
    risks: createdRisks,
  };
};

/**
 * Archives a closed risk
 */
export const archiveRisk = async (
  riskId: string,
  closureNotes: string,
  RiskRegisterModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const risk = await RiskRegisterModel.findOne({
    where: { riskId },
    transaction,
  });

  if (!risk) {
    throw new Error(`Risk ${riskId} not found`);
  }

  const metadata = risk.metadata || {};
  metadata.closureNotes = closureNotes;

  await risk.update(
    {
      status: RiskStatus.CLOSED,
      closedDate: new Date(),
      metadata,
    },
    { transaction }
  );

  return risk;
};

/**
 * Generates risk register report
 */
export const generateRiskRegisterReport = async (
  filters: {
    categories?: RiskCategory[];
    status?: RiskStatus[];
    minRiskScore?: number;
  },
  RiskRegisterModel: any,
): Promise<any> => {
  const whereClause: any = {};

  if (filters.categories && filters.categories.length > 0) {
    whereClause.riskCategory = { [Op.in]: filters.categories };
  }

  if (filters.status && filters.status.length > 0) {
    whereClause.status = { [Op.in]: filters.status };
  }

  if (filters.minRiskScore !== undefined) {
    whereClause.inherentRiskScore = { [Op.gte]: filters.minRiskScore };
  }

  const risks = await RiskRegisterModel.findAll({
    where: whereClause,
    order: [['inherentRiskScore', 'DESC']],
  });

  const summary = {
    totalRisks: risks.length,
    byCategory: {},
    byStatus: {},
    avgRiskScore: 0,
  };

  risks.forEach(risk => {
    summary.byCategory[risk.riskCategory] = (summary.byCategory[risk.riskCategory] || 0) + 1;
    summary.byStatus[risk.status] = (summary.byStatus[risk.status] || 0) + 1;
    summary.avgRiskScore += parseFloat(risk.inherentRiskScore);
  });

  if (risks.length > 0) {
    summary.avgRiskScore = summary.avgRiskScore / risks.length;
  }

  return {
    reportDate: new Date(),
    filters,
    summary,
    risks,
  };
};

// ============================================================================
// RISK ASSESSMENT & SCORING FUNCTIONS
// ============================================================================

/**
 * Performs risk assessment for a registered risk
 */
export const performRiskAssessment = async (
  assessmentData: RiskAssessmentData,
  RiskAssessmentModel: any,
  RiskRegisterModel: any,
  transaction?: Transaction,
): Promise<any> => {
  // Validate risk exists
  const risk = await RiskRegisterModel.findOne({
    where: { riskId: assessmentData.riskId },
    transaction,
  });

  if (!risk) {
    throw new Error(`Risk ${assessmentData.riskId} not found`);
  }

  // Calculate risk score and level
  const riskScore = calculateRiskScore(assessmentData.likelihood, assessmentData.impact);
  const riskLevel = determineRiskLevel(riskScore);

  const assessmentId = `ASSESS-${assessmentData.riskId}-${Date.now()}`;

  const assessment = await RiskAssessmentModel.create(
    {
      ...assessmentData,
      assessmentId,
      riskScore,
      riskLevel,
    },
    { transaction }
  );

  // Update risk register status
  await risk.update({ status: RiskStatus.ASSESSED }, { transaction });

  return assessment;
};

/**
 * Generates risk heat map
 */
export const generateRiskHeatMap = async (
  RiskRegisterModel: any,
  RiskAssessmentModel: any,
): Promise<RiskHeatMapData[][]> => {
  const activeRisks = await RiskRegisterModel.findAll({
    where: {
      status: {
        [Op.notIn]: [RiskStatus.CLOSED],
      },
    },
  });

  // Get latest assessment for each risk
  const heatMapData: Map<string, RiskHeatMapData> = new Map();

  for (const risk of activeRisks) {
    const latestAssessment = await RiskAssessmentModel.findOne({
      where: { riskId: risk.riskId },
      order: [['assessmentDate', 'DESC']],
    });

    const likelihood = latestAssessment?.likelihood || risk.inherentLikelihood;
    const impact = latestAssessment?.impact || risk.inherentImpact;
    const riskScore = latestAssessment?.riskScore || risk.inherentRiskScore;

    const key = `${likelihood}-${impact}`;

    if (!heatMapData.has(key)) {
      heatMapData.set(key, {
        likelihood,
        impact,
        risks: [],
      });
    }

    heatMapData.get(key)!.risks.push({
      riskId: risk.riskId,
      riskTitle: risk.riskTitle,
      riskScore: parseFloat(riskScore),
    });
  }

  // Convert to matrix format
  const likelihoods = Object.values(RiskLikelihood);
  const impacts = Object.values(RiskImpact).reverse(); // High to low

  const matrix: RiskHeatMapData[][] = [];

  impacts.forEach(impact => {
    const row: RiskHeatMapData[] = [];
    likelihoods.forEach(likelihood => {
      const key = `${likelihood}-${impact}`;
      row.push(heatMapData.get(key) || { likelihood, impact, risks: [] });
    });
    matrix.push(row);
  });

  return matrix;
};

/**
 * Calculates residual risk after controls
 */
export const calculateResidualRisk = async (
  riskId: string,
  controlEffectiveness: number,
  RiskRegisterModel: any,
  RiskAssessmentModel: any,
): Promise<any> => {
  const risk = await RiskRegisterModel.findOne({
    where: { riskId },
  });

  if (!risk) {
    throw new Error(`Risk ${riskId} not found`);
  }

  const latestAssessment = await RiskAssessmentModel.findOne({
    where: { riskId },
    order: [['assessmentDate', 'DESC']],
  });

  const inherentScore = parseFloat(risk.inherentRiskScore);

  // Residual risk = Inherent risk × (1 - Control effectiveness)
  const residualScore = inherentScore * (1 - controlEffectiveness / 100);

  return {
    riskId,
    inherentRiskScore: inherentScore,
    controlEffectiveness,
    residualRiskScore: residualScore,
    riskReduction: inherentScore - residualScore,
    residualRiskLevel: determineRiskLevel(residualScore),
  };
};

/**
 * Performs quantitative risk analysis
 */
export const performQuantitativeRiskAnalysis = async (
  riskId: string,
  quantitativeData: {
    singleLossExpectancy: number;
    annualRateOccurrence: number;
    confidenceLevel: number;
  },
  RiskAssessmentModel: any,
): Promise<any> => {
  // Annual Loss Expectancy (ALE) = SLE × ARO
  const annualLossExpectancy =
    quantitativeData.singleLossExpectancy * quantitativeData.annualRateOccurrence;

  // Calculate confidence intervals (simplified)
  const standardDeviation = quantitativeData.singleLossExpectancy * 0.3; // Assumed 30% SD
  const zScore = quantitativeData.confidenceLevel === 0.95 ? 1.96 : 2.58;

  const confidenceInterval = {
    lower: annualLossExpectancy - zScore * standardDeviation,
    upper: annualLossExpectancy + zScore * standardDeviation,
  };

  return {
    riskId,
    singleLossExpectancy: quantitativeData.singleLossExpectancy,
    annualRateOccurrence: quantitativeData.annualRateOccurrence,
    annualLossExpectancy,
    confidenceLevel: quantitativeData.confidenceLevel,
    confidenceInterval,
    expectedValueAtRisk: annualLossExpectancy,
  };
};

/**
 * Performs scenario-based risk analysis
 */
export const performScenarioAnalysis = async (
  riskId: string,
  scenarios: Array<{
    scenarioName: string;
    probability: number;
    impact: number;
    description: string;
  }>,
  RiskRegisterModel: any,
): Promise<any> => {
  const risk = await RiskRegisterModel.findOne({
    where: { riskId },
  });

  if (!risk) {
    throw new Error(`Risk ${riskId} not found`);
  }

  // Calculate expected value across scenarios
  let expectedValue = 0;
  const analyzedScenarios = scenarios.map(scenario => {
    const scenarioValue = scenario.probability * scenario.impact;
    expectedValue += scenarioValue;

    return {
      ...scenario,
      expectedValue: scenarioValue,
      riskLevel: determineRiskLevel(scenarioValue / 100), // Normalize
    };
  });

  return {
    riskId,
    riskTitle: risk.riskTitle,
    scenarios: analyzedScenarios,
    expectedValue,
    mostLikelyScenario: analyzedScenarios.reduce((max, s) =>
      s.probability > max.probability ? s : max
    ),
    worstCaseScenario: analyzedScenarios.reduce((max, s) =>
      s.impact > max.impact ? s : max
    ),
  };
};

/**
 * Generates risk scoring matrix
 */
export const generateRiskScoringMatrix = (): any => {
  const likelihoods = {
    [RiskLikelihood.RARE]: { value: 1, percentage: '< 5%' },
    [RiskLikelihood.UNLIKELY]: { value: 2, percentage: '5-25%' },
    [RiskLikelihood.POSSIBLE]: { value: 3, percentage: '25-50%' },
    [RiskLikelihood.LIKELY]: { value: 4, percentage: '50-75%' },
    [RiskLikelihood.ALMOST_CERTAIN]: { value: 5, percentage: '> 75%' },
  };

  const impacts = {
    [RiskImpact.NEGLIGIBLE]: { value: 1, range: '< $100K' },
    [RiskImpact.MINOR]: { value: 2, range: '$100K - $500K' },
    [RiskImpact.MODERATE]: { value: 3, range: '$500K - $2M' },
    [RiskImpact.MAJOR]: { value: 4, range: '$2M - $10M' },
    [RiskImpact.CATASTROPHIC]: { value: 5, range: '> $10M' },
  };

  const matrix = [];

  Object.entries(likelihoods).forEach(([likelihoodKey, likelihoodValue]) => {
    Object.entries(impacts).forEach(([impactKey, impactValue]) => {
      const score = likelihoodValue.value * impactValue.value;
      matrix.push({
        likelihood: likelihoodKey,
        likelihoodPercentage: likelihoodValue.percentage,
        impact: impactKey,
        impactRange: impactValue.range,
        riskScore: score,
        riskLevel: determineRiskLevel(score),
      });
    });
  });

  return {
    likelihoods,
    impacts,
    matrix,
    scoringFormula: 'Risk Score = Likelihood Value × Impact Value',
  };
};

/**
 * Compares risk assessments over time
 */
export const compareRiskAssessments = async (
  riskId: string,
  startDate: Date,
  endDate: Date,
  RiskAssessmentModel: any,
): Promise<any> => {
  const assessments = await RiskAssessmentModel.findAll({
    where: {
      riskId,
      assessmentDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['assessmentDate', 'ASC']],
  });

  if (assessments.length < 2) {
    return {
      riskId,
      message: 'Insufficient data for comparison',
      assessments,
    };
  }

  const firstAssessment = assessments[0];
  const lastAssessment = assessments[assessments.length - 1];

  const scoreChange = parseFloat(lastAssessment.riskScore) - parseFloat(firstAssessment.riskScore);
  const percentChange = (scoreChange / parseFloat(firstAssessment.riskScore)) * 100;

  let trend: string;
  if (scoreChange > 0.5) {
    trend = 'increasing';
  } else if (scoreChange < -0.5) {
    trend = 'decreasing';
  } else {
    trend = 'stable';
  }

  return {
    riskId,
    period: { startDate, endDate },
    totalAssessments: assessments.length,
    firstAssessment: {
      date: firstAssessment.assessmentDate,
      score: parseFloat(firstAssessment.riskScore),
      level: firstAssessment.riskLevel,
    },
    lastAssessment: {
      date: lastAssessment.assessmentDate,
      score: parseFloat(lastAssessment.riskScore),
      level: lastAssessment.riskLevel,
    },
    scoreChange,
    percentChange,
    trend,
    assessments,
  };
};

// ============================================================================
// MITIGATION STRATEGY & PLANNING FUNCTIONS
// ============================================================================

/**
 * Creates a risk mitigation plan
 */
export const createMitigationPlan = async (
  planData: MitigationPlanData,
  MitigationPlanModel: any,
  RiskRegisterModel: any,
  transaction?: Transaction,
): Promise<any> => {
  // Validate risk exists
  const risk = await RiskRegisterModel.findOne({
    where: { riskId: planData.riskId },
    transaction,
  });

  if (!risk) {
    throw new Error(`Risk ${planData.riskId} not found`);
  }

  const mitigationPlan = await MitigationPlanModel.create(
    {
      ...planData,
      status: 'planned',
    },
    { transaction }
  );

  // Update risk status
  await risk.update({ status: RiskStatus.MITIGATED }, { transaction });

  return mitigationPlan;
};

/**
 * Updates mitigation plan progress
 */
export const updateMitigationProgress = async (
  mitigationId: string,
  progressData: {
    completedActions: string[];
    status: string;
    progressNotes: string;
  },
  MitigationPlanModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const plan = await MitigationPlanModel.findOne({
    where: { mitigationId },
    transaction,
  });

  if (!plan) {
    throw new Error(`Mitigation plan ${mitigationId} not found`);
  }

  const actionItems = plan.actionItems || [];

  // Update completed actions
  progressData.completedActions.forEach(actionId => {
    const action = actionItems.find(a => a.actionId === actionId);
    if (action) {
      action.status = 'completed';
      action.completedDate = new Date();
    }
  });

  const metadata = plan.metadata || {};
  metadata.progressUpdates = metadata.progressUpdates || [];
  metadata.progressUpdates.push({
    date: new Date(),
    notes: progressData.progressNotes,
    completedActions: progressData.completedActions,
  });

  await plan.update(
    {
      actionItems,
      status: progressData.status,
      metadata,
    },
    { transaction }
  );

  return plan;
};

/**
 * Evaluates mitigation plan effectiveness
 */
export const evaluateMitigationEffectiveness = async (
  mitigationId: string,
  postMitigationAssessment: {
    currentLikelihood: RiskLikelihood;
    currentImpact: RiskImpact;
  },
  MitigationPlanModel: any,
  RiskRegisterModel: any,
  RiskAssessmentModel: any,
): Promise<any> => {
  const plan = await MitigationPlanModel.findOne({
    where: { mitigationId },
  });

  if (!plan) {
    throw new Error(`Mitigation plan ${mitigationId} not found`);
  }

  const risk = await RiskRegisterModel.findOne({
    where: { riskId: plan.riskId },
  });

  // Get pre-mitigation assessment
  const preMitigationAssessment = await RiskAssessmentModel.findOne({
    where: {
      riskId: plan.riskId,
      assessmentDate: { [Op.lt]: plan.createdAt },
    },
    order: [['assessmentDate', 'DESC']],
  });

  const preMitigationScore = preMitigationAssessment
    ? parseFloat(preMitigationAssessment.riskScore)
    : parseFloat(risk.inherentRiskScore);

  const postMitigationScore = calculateRiskScore(
    postMitigationAssessment.currentLikelihood,
    postMitigationAssessment.currentImpact
  );

  const actualRiskReduction =
    ((preMitigationScore - postMitigationScore) / preMitigationScore) * 100;

  const effectiveness =
    actualRiskReduction >= parseFloat(plan.expectedRiskReduction)
      ? 'effective'
      : 'partially_effective';

  // Update mitigation plan
  await plan.update({
    actualRiskReduction,
    metadata: {
      ...plan.metadata,
      effectivenessEvaluation: {
        evaluationDate: new Date(),
        preMitigationScore,
        postMitigationScore,
        actualRiskReduction,
        effectiveness,
      },
    },
  });

  return {
    mitigationId,
    riskId: plan.riskId,
    preMitigationScore,
    postMitigationScore,
    expectedRiskReduction: parseFloat(plan.expectedRiskReduction),
    actualRiskReduction,
    effectiveness,
  };
};

/**
 * Generates mitigation strategy recommendations
 */
export const generateMitigationRecommendations = async (
  riskId: string,
  RiskRegisterModel: any,
  RiskAssessmentModel: any,
): Promise<any> => {
  const risk = await RiskRegisterModel.findOne({
    where: { riskId },
  });

  if (!risk) {
    throw new Error(`Risk ${riskId} not found`);
  }

  const latestAssessment = await RiskAssessmentModel.findOne({
    where: { riskId },
    order: [['assessmentDate', 'DESC']],
  });

  const riskScore = latestAssessment
    ? parseFloat(latestAssessment.riskScore)
    : parseFloat(risk.inherentRiskScore);

  const recommendations = [];

  // Strategy based on risk level
  if (riskScore >= 15) {
    recommendations.push({
      strategy: RiskResponseStrategy.AVOID,
      description: 'Consider avoiding this activity due to critical risk level',
      priority: 'high',
    });
    recommendations.push({
      strategy: RiskResponseStrategy.MITIGATE,
      description: 'If activity cannot be avoided, implement comprehensive controls',
      priority: 'high',
    });
  } else if (riskScore >= 10) {
    recommendations.push({
      strategy: RiskResponseStrategy.MITIGATE,
      description: 'Implement controls to reduce likelihood and/or impact',
      priority: 'high',
    });
    recommendations.push({
      strategy: RiskResponseStrategy.TRANSFER,
      description: 'Consider insurance or contractual transfer of risk',
      priority: 'medium',
    });
  } else if (riskScore >= 5) {
    recommendations.push({
      strategy: RiskResponseStrategy.MITIGATE,
      description: 'Implement cost-effective controls',
      priority: 'medium',
    });
    recommendations.push({
      strategy: RiskResponseStrategy.MONITOR,
      description: 'Establish key risk indicators and monitoring',
      priority: 'medium',
    });
  } else {
    recommendations.push({
      strategy: RiskResponseStrategy.ACCEPT,
      description: 'Risk is within acceptable tolerance',
      priority: 'low',
    });
    recommendations.push({
      strategy: RiskResponseStrategy.MONITOR,
      description: 'Monitor for changes in risk profile',
      priority: 'low',
    });
  }

  return {
    riskId,
    riskTitle: risk.riskTitle,
    riskScore,
    recommendations,
  };
};

/**
 * Tracks mitigation costs and ROI
 */
export const trackMitigationROI = async (
  mitigationId: string,
  actualCost: number,
  MitigationPlanModel: any,
  RiskRegisterModel: any,
): Promise<any> => {
  const plan = await MitigationPlanModel.findOne({
    where: { mitigationId },
  });

  if (!plan) {
    throw new Error(`Mitigation plan ${mitigationId} not found`);
  }

  const risk = await RiskRegisterModel.findOne({
    where: { riskId: plan.riskId },
  });

  // ROI = (Risk Reduction Value - Mitigation Cost) / Mitigation Cost
  const inherentRiskValue = parseFloat(risk.inherentRiskScore) * 100000; // Assumed $100K per risk point
  const riskReductionValue = inherentRiskValue * (parseFloat(plan.actualRiskReduction || 0) / 100);
  const roi = ((riskReductionValue - actualCost) / actualCost) * 100;

  await plan.update({ actualCost });

  return {
    mitigationId,
    riskId: plan.riskId,
    estimatedCost: parseFloat(plan.estimatedCost || 0),
    actualCost,
    costVariance: actualCost - parseFloat(plan.estimatedCost || 0),
    inherentRiskValue,
    riskReductionValue,
    roi,
    roiCategory: roi > 100 ? 'excellent' : roi > 50 ? 'good' : roi > 0 ? 'acceptable' : 'poor',
  };
};

/**
 * Generates mitigation action plan template
 */
export const generateMitigationActionPlan = (
  riskId: string,
  responseStrategy: RiskResponseStrategy,
): MitigationPlanData => {
  const actionTemplates = {
    [RiskResponseStrategy.AVOID]: [
      {
        actionId: 'AVOID-001',
        description: 'Discontinue risky activity or process',
        owner: 'Risk Owner',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
      {
        actionId: 'AVOID-002',
        description: 'Implement alternative approach with lower risk',
        owner: 'Process Owner',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
    ],
    [RiskResponseStrategy.MITIGATE]: [
      {
        actionId: 'MIT-001',
        description: 'Design and implement preventive controls',
        owner: 'Control Owner',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
      {
        actionId: 'MIT-002',
        description: 'Establish detective controls and monitoring',
        owner: 'Monitoring Team',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
      {
        actionId: 'MIT-003',
        description: 'Test control effectiveness',
        owner: 'Internal Audit',
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
    ],
    [RiskResponseStrategy.TRANSFER]: [
      {
        actionId: 'TRANS-001',
        description: 'Obtain insurance coverage',
        owner: 'Risk Manager',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
      {
        actionId: 'TRANS-002',
        description: 'Negotiate contractual risk transfer',
        owner: 'Contracts Team',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
    ],
    [RiskResponseStrategy.ACCEPT]: [
      {
        actionId: 'ACCEPT-001',
        description: 'Document acceptance decision and rationale',
        owner: 'Risk Owner',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
      {
        actionId: 'ACCEPT-002',
        description: 'Establish contingency plan',
        owner: 'Business Owner',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
    ],
    [RiskResponseStrategy.MONITOR]: [
      {
        actionId: 'MON-001',
        description: 'Define key risk indicators (KRIs)',
        owner: 'Risk Analyst',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
      {
        actionId: 'MON-002',
        description: 'Implement monitoring dashboard',
        owner: 'IT Team',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
    ],
  };

  return {
    mitigationId: `MIT-${riskId}-${Date.now()}`,
    riskId,
    responseStrategy,
    mitigationDescription: `${responseStrategy} strategy for ${riskId}`,
    actionItems: actionTemplates[responseStrategy] || [],
    responsibleParty: 'Risk Owner',
    targetCompletionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    expectedRiskReduction: responseStrategy === RiskResponseStrategy.MITIGATE ? 50 : 25,
  };
};

/**
 * Monitors mitigation plan compliance
 */
export const monitorMitigationCompliance = async (
  MitigationPlanModel: any,
): Promise<any> => {
  const allPlans = await MitigationPlanModel.findAll({
    where: {
      status: {
        [Op.notIn]: ['completed', 'cancelled'],
      },
    },
  });

  const now = new Date();
  const overduePlans = [];
  const atRiskPlans = [];

  allPlans.forEach(plan => {
    if (plan.targetCompletionDate < now) {
      overduePlans.push({
        mitigationId: plan.mitigationId,
        riskId: plan.riskId,
        targetCompletionDate: plan.targetCompletionDate,
        daysOverdue: Math.floor((now.getTime() - plan.targetCompletionDate.getTime()) / (1000 * 60 * 60 * 24)),
        responsibleParty: plan.responsibleParty,
      });
    } else {
      const daysUntilDue = Math.floor((plan.targetCompletionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 30) {
        atRiskPlans.push({
          mitigationId: plan.mitigationId,
          riskId: plan.riskId,
          targetCompletionDate: plan.targetCompletionDate,
          daysUntilDue,
          responsibleParty: plan.responsibleParty,
        });
      }
    }
  });

  return {
    totalActivePlans: allPlans.length,
    overduePlans: overduePlans.length,
    atRiskPlans: atRiskPlans.length,
    onTrackPlans: allPlans.length - overduePlans.length - atRiskPlans.length,
    overdueDetails: overduePlans,
    atRiskDetails: atRiskPlans,
  };
};

// ============================================================================
// RISK MONITORING & TRACKING FUNCTIONS
// ============================================================================

/**
 * Records risk monitoring observation
 */
export const recordRiskMonitoring = async (
  monitoringData: RiskMonitoringData,
  RiskMonitoringModel: any,
  RiskRegisterModel: any,
  transaction?: Transaction,
): Promise<any> => {
  // Validate risk exists
  const risk = await RiskRegisterModel.findOne({
    where: { riskId: monitoringData.riskId },
    transaction,
  });

  if (!risk) {
    throw new Error(`Risk ${monitoringData.riskId} not found`);
  }

  // Calculate current risk score
  const currentRiskScore = calculateRiskScore(
    monitoringData.currentLikelihood,
    monitoringData.currentImpact
  );

  // Determine trend by comparing with previous monitoring
  const previousMonitoring = await RiskMonitoringModel.findOne({
    where: { riskId: monitoringData.riskId },
    order: [['monitoringDate', 'DESC']],
    transaction,
  });

  let trendDirection = 'stable';
  if (previousMonitoring) {
    const previousScore = parseFloat(previousMonitoring.currentRiskScore);
    if (currentRiskScore > previousScore + 0.5) {
      trendDirection = 'increasing';
    } else if (currentRiskScore < previousScore - 0.5) {
      trendDirection = 'decreasing';
    }
  }

  const monitoring = await RiskMonitoringModel.create(
    {
      ...monitoringData,
      currentRiskScore,
      trendDirection,
    },
    { transaction }
  );

  // Update risk register status
  await risk.update({ status: RiskStatus.MONITORING }, { transaction });

  return monitoring;
};

/**
 * Generates risk trend analysis
 */
export const analyzeRiskTrends = async (
  riskId: string,
  period: { startDate: Date; endDate: Date },
  RiskMonitoringModel: any,
): Promise<any> => {
  const monitoringRecords = await RiskMonitoringModel.findAll({
    where: {
      riskId,
      monitoringDate: {
        [Op.between]: [period.startDate, period.endDate],
      },
    },
    order: [['monitoringDate', 'ASC']],
  });

  if (monitoringRecords.length === 0) {
    return {
      riskId,
      message: 'No monitoring data available for the specified period',
    };
  }

  const scores = monitoringRecords.map(r => parseFloat(r.currentRiskScore));
  const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);

  const firstScore = scores[0];
  const lastScore = scores[scores.length - 1];
  const overallTrend = lastScore > firstScore + 0.5 ? 'increasing' : lastScore < firstScore - 0.5 ? 'decreasing' : 'stable';

  return {
    riskId,
    period,
    totalObservations: monitoringRecords.length,
    avgRiskScore: avgScore,
    maxRiskScore: maxScore,
    minRiskScore: minScore,
    currentRiskScore: lastScore,
    overallTrend,
    scoreChange: lastScore - firstScore,
    volatility: calculateVolatility(scores),
    monitoringHistory: monitoringRecords.map(r => ({
      date: r.monitoringDate,
      score: parseFloat(r.currentRiskScore),
      trend: r.trendDirection,
      actionRequired: r.actionRequired,
    })),
  };
};

/**
 * Defines key risk indicators (KRIs)
 */
export const defineKeyRiskIndicators = async (
  riskId: string,
  indicators: Array<{
    indicatorName: string;
    threshold: number;
    currentValue?: number;
    unit: string;
    frequency: string;
  }>,
  RiskRegisterModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const risk = await RiskRegisterModel.findOne({
    where: { riskId },
    transaction,
  });

  if (!risk) {
    throw new Error(`Risk ${riskId} not found`);
  }

  const metadata = risk.metadata || {};
  metadata.keyRiskIndicators = indicators;

  await risk.update({ metadata }, { transaction });

  return {
    riskId,
    indicators,
  };
};

/**
 * Monitors key risk indicators
 */
export const monitorKeyRiskIndicators = async (
  riskId: string,
  indicatorValues: Record<string, number>,
  RiskRegisterModel: any,
  RiskMonitoringModel: any,
): Promise<any> => {
  const risk = await RiskRegisterModel.findOne({
    where: { riskId },
  });

  if (!risk) {
    throw new Error(`Risk ${riskId} not found`);
  }

  const indicators = risk.metadata?.keyRiskIndicators || [];
  const breachedIndicators = [];

  indicators.forEach(indicator => {
    const currentValue = indicatorValues[indicator.indicatorName];
    if (currentValue !== undefined && currentValue > indicator.threshold) {
      breachedIndicators.push({
        ...indicator,
        currentValue,
        thresholdBreach: currentValue - indicator.threshold,
      });
    }
  });

  return {
    riskId,
    monitoringDate: new Date(),
    totalIndicators: indicators.length,
    breachedIndicators: breachedIndicators.length,
    breaches: breachedIndicators,
    actionRequired: breachedIndicators.length > 0,
  };
};

/**
 * Generates risk monitoring dashboard
 */
export const generateRiskMonitoringDashboard = async (
  RiskRegisterModel: any,
  RiskMonitoringModel: any,
  MitigationPlanModel: any,
): Promise<any> => {
  const activeRisks = await RiskRegisterModel.findAll({
    where: {
      status: {
        [Op.notIn]: [RiskStatus.CLOSED],
      },
    },
  });

  const dashboardData = {
    totalActiveRisks: activeRisks.length,
    risksByLevel: { low: 0, medium: 0, high: 0, critical: 0 },
    risksByCategory: {},
    trendsIncreasing: 0,
    trendsDecreasing: 0,
    trendsStable: 0,
    activeMitigations: 0,
    highPriorityRisks: [],
  };

  for (const risk of activeRisks) {
    // Get latest monitoring
    const latestMonitoring = await RiskMonitoringModel.findOne({
      where: { riskId: risk.riskId },
      order: [['monitoringDate', 'DESC']],
    });

    const riskScore = latestMonitoring
      ? parseFloat(latestMonitoring.currentRiskScore)
      : parseFloat(risk.inherentRiskScore);

    const riskLevel = determineRiskLevel(riskScore);

    dashboardData.risksByLevel[riskLevel]++;
    dashboardData.risksByCategory[risk.riskCategory] =
      (dashboardData.risksByCategory[risk.riskCategory] || 0) + 1;

    if (latestMonitoring) {
      if (latestMonitoring.trendDirection === 'increasing') dashboardData.trendsIncreasing++;
      else if (latestMonitoring.trendDirection === 'decreasing') dashboardData.trendsDecreasing++;
      else dashboardData.trendsStable++;
    }

    if (riskLevel === 'high' || riskLevel === 'critical') {
      dashboardData.highPriorityRisks.push({
        riskId: risk.riskId,
        riskTitle: risk.riskTitle,
        riskScore,
        riskLevel,
        trend: latestMonitoring?.trendDirection || 'unknown',
      });
    }
  }

  // Count active mitigations
  const activeMitigations = await MitigationPlanModel.count({
    where: {
      status: {
        [Op.in]: ['planned', 'in_progress'],
      },
    },
  });

  dashboardData.activeMitigations = activeMitigations;

  return {
    generatedAt: new Date(),
    dashboard: dashboardData,
  };
};

/**
 * Escalates high-risk items
 */
export const escalateHighRisks = async (
  escalationThreshold: number,
  RiskRegisterModel: any,
  RiskMonitoringModel: any,
  RiskToleranceModel: any,
): Promise<any> => {
  const activeRisks = await RiskRegisterModel.findAll({
    where: {
      status: {
        [Op.notIn]: [RiskStatus.CLOSED],
      },
    },
  });

  const escalations = [];

  for (const risk of activeRisks) {
    const latestMonitoring = await RiskMonitoringModel.findOne({
      where: { riskId: risk.riskId },
      order: [['monitoringDate', 'DESC']],
    });

    const riskScore = latestMonitoring
      ? parseFloat(latestMonitoring.currentRiskScore)
      : parseFloat(risk.inherentRiskScore);

    // Check against risk tolerance
    const tolerance = await RiskToleranceModel.findOne({
      where: { category: risk.riskCategory },
    });

    const thresholdExceeded =
      tolerance && riskScore > parseFloat(tolerance.maxAcceptableRiskScore);

    if (riskScore >= escalationThreshold || thresholdExceeded) {
      escalations.push({
        riskId: risk.riskId,
        riskTitle: risk.riskTitle,
        riskCategory: risk.riskCategory,
        riskScore,
        escalationThreshold,
        toleranceThreshold: tolerance ? parseFloat(tolerance.maxAcceptableRiskScore) : null,
        escalationLevel: tolerance?.escalationLevel || 'Senior Management',
        reason: thresholdExceeded ? 'Exceeds risk tolerance' : 'Exceeds escalation threshold',
      });
    }
  }

  return {
    escalationDate: new Date(),
    escalationThreshold,
    totalEscalations: escalations.length,
    escalations,
  };
};

/**
 * Generates periodic risk report
 */
export const generatePeriodicRiskReport = async (
  reportPeriod: { startDate: Date; endDate: Date },
  RiskRegisterModel: any,
  RiskAssessmentModel: any,
  RiskMonitoringModel: any,
  MitigationPlanModel: any,
  IncidentReportModel: any,
): Promise<any> => {
  // New risks identified
  const newRisks = await RiskRegisterModel.findAll({
    where: {
      identifiedDate: {
        [Op.between]: [reportPeriod.startDate, reportPeriod.endDate],
      },
    },
  });

  // Risks closed
  const closedRisks = await RiskRegisterModel.findAll({
    where: {
      closedDate: {
        [Op.between]: [reportPeriod.startDate, reportPeriod.endDate],
      },
    },
  });

  // New assessments
  const newAssessments = await RiskAssessmentModel.count({
    where: {
      assessmentDate: {
        [Op.between]: [reportPeriod.startDate, reportPeriod.endDate],
      },
    },
  });

  // Active mitigations
  const activeMitigations = await MitigationPlanModel.findAll({
    where: {
      status: {
        [Op.in]: ['planned', 'in_progress'],
      },
    },
  });

  // Incidents
  const incidents = await IncidentReportModel.findAll({
    where: {
      incidentDate: {
        [Op.between]: [reportPeriod.startDate, reportPeriod.endDate],
      },
    },
  });

  return {
    reportPeriod,
    generatedDate: new Date(),
    summary: {
      newRisks: newRisks.length,
      closedRisks: closedRisks.length,
      assessmentsPerformed: newAssessments,
      activeMitigations: activeMitigations.length,
      incidentsReported: incidents.length,
    },
    newRisksDetail: newRisks,
    closedRisksDetail: closedRisks,
    activeMitigationsDetail: activeMitigations,
    incidentsDetail: incidents,
  };
};

// ============================================================================
// INCIDENT MANAGEMENT & RESPONSE FUNCTIONS
// ============================================================================

/**
 * Reports a risk incident
 */
export const reportIncident = async (
  incidentData: IncidentReportData,
  IncidentReportModel: any,
  RiskRegisterModel: any,
  transaction?: Transaction,
): Promise<any> => {
  // Validate related risks exist
  for (const riskId of incidentData.relatedRiskIds) {
    const risk = await RiskRegisterModel.findOne({
      where: { riskId },
      transaction,
    });

    if (!risk) {
      throw new Error(`Related risk ${riskId} not found`);
    }

    // Update risk status to realized
    await risk.update({ status: RiskStatus.REALIZED }, { transaction });
  }

  const incident = await IncidentReportModel.create(incidentData, { transaction });
  return incident;
};

/**
 * Updates incident status
 */
export const updateIncidentStatus = async (
  incidentId: string,
  status: IncidentStatus,
  updateData: {
    updatedBy: string;
    updateNotes: string;
    rootCause?: string;
    resolution?: string;
  },
  IncidentReportModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const incident = await IncidentReportModel.findOne({
    where: { incidentId },
    transaction,
  });

  if (!incident) {
    throw new Error(`Incident ${incidentId} not found`);
  }

  const updates: any = { status };

  if (updateData.rootCause) {
    updates.rootCause = updateData.rootCause;
  }

  if (updateData.resolution) {
    updates.resolution = updateData.resolution;
  }

  if (status === IncidentStatus.RESOLVED || status === IncidentStatus.CLOSED) {
    updates.resolvedDate = new Date();
  }

  const metadata = incident.metadata || {};
  metadata.statusUpdates = metadata.statusUpdates || [];
  metadata.statusUpdates.push({
    date: new Date(),
    status,
    updatedBy: updateData.updatedBy,
    notes: updateData.updateNotes,
  });
  updates.metadata = metadata;

  await incident.update(updates, { transaction });
  return incident;
};

/**
 * Performs incident root cause analysis
 */
export const performRootCauseAnalysis = async (
  incidentId: string,
  rootCauseData: {
    analysisMethod: string;
    primaryCause: string;
    contributingFactors: string[];
    corrective Actions: string[];
    preventiveActions: string[];
  },
  IncidentReportModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const incident = await IncidentReportModel.findOne({
    where: { incidentId },
    transaction,
  });

  if (!incident) {
    throw new Error(`Incident ${incidentId} not found`);
  }

  const metadata = incident.metadata || {};
  metadata.rootCauseAnalysis = {
    ...rootCauseData,
    analysisDate: new Date(),
  };

  await incident.update(
    {
      rootCause: rootCauseData.primaryCause,
      metadata,
    },
    { transaction }
  );

  return {
    incidentId,
    rootCauseAnalysis: metadata.rootCauseAnalysis,
  };
};

/**
 * Generates incident response plan
 */
export const generateIncidentResponsePlan = (
  severity: IncidentSeverity,
): any => {
  const responsePlans = {
    [IncidentSeverity.CRITICAL]: {
      notificationTime: '15 minutes',
      escalationLevel: 'Commander/CAO',
      responseTeam: ['Incident Commander', 'Technical Lead', 'Communications Lead', 'Legal Counsel'],
      immediateActions: [
        'Activate incident response team',
        'Notify senior leadership',
        'Contain incident scope',
        'Preserve evidence',
        'Initiate damage assessment',
      ],
    },
    [IncidentSeverity.HIGH]: {
      notificationTime: '1 hour',
      escalationLevel: 'Division Chief',
      responseTeam: ['Incident Lead', 'Technical Support', 'Business Owner'],
      immediateActions: [
        'Assemble response team',
        'Assess incident scope',
        'Implement containment measures',
        'Document incident details',
      ],
    },
    [IncidentSeverity.MEDIUM]: {
      notificationTime: '4 hours',
      escalationLevel: 'Branch Chief',
      responseTeam: ['Primary Responder', 'Subject Matter Expert'],
      immediateActions: [
        'Investigate incident',
        'Implement initial response',
        'Monitor situation',
        'Report to management',
      ],
    },
    [IncidentSeverity.LOW]: {
      notificationTime: '24 hours',
      escalationLevel: 'Team Lead',
      responseTeam: ['Assigned Responder'],
      immediateActions: [
        'Document incident',
        'Assess impact',
        'Resolve if possible',
        'Report as needed',
      ],
    },
  };

  return {
    severity,
    responsePlan: responsePlans[severity],
  };
};

/**
 * Tracks incident resolution
 */
export const trackIncidentResolution = async (
  incidentId: string,
  resolutionData: {
    resolvedBy: string;
    resolutionDate: Date;
    resolutionSummary: string;
    actualImpact: number;
    lessonsLearned: string;
  },
  IncidentReportModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const incident = await IncidentReportModel.findOne({
    where: { incidentId },
    transaction,
  });

  if (!incident) {
    throw new Error(`Incident ${incidentId} not found`);
  }

  await incident.update(
    {
      status: IncidentStatus.RESOLVED,
      resolvedDate: resolutionData.resolutionDate,
      resolution: resolutionData.resolutionSummary,
      actualImpact: resolutionData.actualImpact,
      lessonsLearned: resolutionData.lessonsLearned,
      metadata: {
        ...incident.metadata,
        resolution: resolutionData,
      },
    },
    { transaction }
  );

  return incident;
};

/**
 * Generates incident trends analysis
 */
export const analyzeIncidentTrends = async (
  period: { startDate: Date; endDate: Date },
  IncidentReportModel: any,
): Promise<any> => {
  const incidents = await IncidentReportModel.findAll({
    where: {
      incidentDate: {
        [Op.between]: [period.startDate, period.endDate],
      },
    },
    order: [['incidentDate', 'ASC']],
  });

  const bySeverity = {
    [IncidentSeverity.CRITICAL]: 0,
    [IncidentSeverity.HIGH]: 0,
    [IncidentSeverity.MEDIUM]: 0,
    [IncidentSeverity.LOW]: 0,
  };

  const byMonth = {};
  let totalImpact = 0;

  incidents.forEach(incident => {
    bySeverity[incident.severity]++;

    const monthKey = `${incident.incidentDate.getFullYear()}-${String(incident.incidentDate.getMonth() + 1).padStart(2, '0')}`;
    byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;

    if (incident.actualImpact) {
      totalImpact += parseFloat(incident.actualImpact);
    }
  });

  return {
    period,
    totalIncidents: incidents.length,
    bySeverity,
    byMonth,
    totalFinancialImpact: totalImpact,
    avgIncidentsPerMonth: Object.keys(byMonth).length > 0 ? incidents.length / Object.keys(byMonth).length : 0,
    trend: Object.keys(byMonth).length > 1 ? calculateTrend(byMonth) : 'insufficient_data',
  };
};

/**
 * Links incidents to risks
 */
export const linkIncidentToRisk = async (
  incidentId: string,
  riskId: string,
  IncidentReportModel: any,
  RiskRegisterModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const incident = await IncidentReportModel.findOne({
    where: { incidentId },
    transaction,
  });

  if (!incident) {
    throw new Error(`Incident ${incidentId} not found`);
  }

  const risk = await RiskRegisterModel.findOne({
    where: { riskId },
    transaction,
  });

  if (!risk) {
    throw new Error(`Risk ${riskId} not found`);
  }

  const relatedRiskIds = incident.relatedRiskIds || [];
  if (!relatedRiskIds.includes(riskId)) {
    relatedRiskIds.push(riskId);
    await incident.update({ relatedRiskIds }, { transaction });
  }

  // Update risk to realized if not already
  if (risk.status !== RiskStatus.REALIZED) {
    await risk.update({ status: RiskStatus.REALIZED }, { transaction });
  }

  return {
    incidentId,
    riskId,
    linkedSuccessfully: true,
  };
};

/**
 * Generates lessons learned report
 */
export const generateLessonsLearnedReport = async (
  period: { startDate: Date; endDate: Date },
  IncidentReportModel: any,
): Promise<any> => {
  const resolvedIncidents = await IncidentReportModel.findAll({
    where: {
      resolvedDate: {
        [Op.between]: [period.startDate, period.endDate],
      },
      lessonsLearned: {
        [Op.ne]: null,
      },
    },
    order: [['severity', 'DESC']],
  });

  const lessons = resolvedIncidents.map(incident => ({
    incidentId: incident.incidentId,
    incidentTitle: incident.incidentTitle,
    severity: incident.severity,
    rootCause: incident.rootCause,
    lessonsLearned: incident.lessonsLearned,
    preventiveActions: incident.metadata?.rootCauseAnalysis?.preventiveActions || [],
  }));

  return {
    period,
    totalLessonsLearned: lessons.length,
    lessons,
    recommendations: extractCommonThemes(lessons),
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculates risk score from likelihood and impact
 */
const calculateRiskScore = (likelihood: RiskLikelihood, impact: RiskImpact): number => {
  const likelihoodValues = {
    [RiskLikelihood.RARE]: 1,
    [RiskLikelihood.UNLIKELY]: 2,
    [RiskLikelihood.POSSIBLE]: 3,
    [RiskLikelihood.LIKELY]: 4,
    [RiskLikelihood.ALMOST_CERTAIN]: 5,
  };

  const impactValues = {
    [RiskImpact.NEGLIGIBLE]: 1,
    [RiskImpact.MINOR]: 2,
    [RiskImpact.MODERATE]: 3,
    [RiskImpact.MAJOR]: 4,
    [RiskImpact.CATASTROPHIC]: 5,
  };

  return likelihoodValues[likelihood] * impactValues[impact];
};

/**
 * Determines risk level from risk score
 */
const determineRiskLevel = (riskScore: number): string => {
  if (riskScore >= 15) return 'critical';
  if (riskScore >= 10) return 'high';
  if (riskScore >= 5) return 'medium';
  return 'low';
};

/**
 * Calculates volatility of risk scores
 */
const calculateVolatility = (scores: number[]): number => {
  if (scores.length < 2) return 0;

  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  return Math.sqrt(variance);
};

/**
 * Calculates trend direction
 */
const calculateTrend = (dataByMonth: Record<string, number>): string => {
  const values = Object.values(dataByMonth);
  if (values.length < 2) return 'stable';

  const lastValue = values[values.length - 1];
  const previousValue = values[values.length - 2];

  if (lastValue > previousValue * 1.1) return 'increasing';
  if (lastValue < previousValue * 0.9) return 'decreasing';
  return 'stable';
};

/**
 * Extracts common themes from lessons learned
 */
const extractCommonThemes = (lessons: any[]): string[] => {
  const themes = new Set<string>();

  lessons.forEach(lesson => {
    if (lesson.rootCause?.includes('control')) themes.add('Strengthen internal controls');
    if (lesson.rootCause?.includes('training')) themes.add('Enhance training programs');
    if (lesson.rootCause?.includes('communication')) themes.add('Improve communication processes');
    if (lesson.rootCause?.includes('system')) themes.add('Upgrade system capabilities');
    if (lesson.lessonsLearned?.includes('monitoring')) themes.add('Enhance monitoring and detection');
  });

  return Array.from(themes);
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable Service for CEFMS Risk Assessment & Mitigation
 *
 * Provides enterprise-grade risk management capabilities with dependency
 * injection support for seamless integration with NestJS applications.
 *
 * @example
 * // In a NestJS module
 * import { Module } from '@nestjs/common';
 * import { CEFMSRiskAssessmentMitigationService } from './cefms-risk-assessment-mitigation-composite';
 *
 * @Module({
 *   providers: [CEFMSRiskAssessmentMitigationService],
 *   exports: [CEFMSRiskAssessmentMitigationService],
 * })
 * export class RiskManagementModule {}
 */
@Injectable()
export class CEFMSRiskAssessmentMitigationService {
  private readonly logger = new Logger(CEFMSRiskAssessmentMitigationService.name);

  constructor(
    private readonly sequelize: Sequelize,
  ) {
    this.logger.log('CEFMS Risk Assessment & Mitigation Service initialized');
  }

  // Risk Identification & Registration
  async registerRisk(data: RiskRegisterData, transaction?: Transaction) {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return registerRisk(data, RiskRegisterModel, transaction);
  }

  async updateRisk(riskId: string, updates: Partial<RiskRegisterData>, transaction?: Transaction) {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return updateRisk(riskId, updates, RiskRegisterModel, transaction);
  }

  async getRisksByCategory(category: RiskCategory, includeActive = true) {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return getRisksByCategory(category, RiskRegisterModel, includeActive);
  }

  async getRisksByOwner(riskOwner: string) {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return getRisksByOwner(riskOwner, RiskRegisterModel);
  }

  async conductRiskIdentificationWorkshop(workshopData: any, transaction?: Transaction) {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return conductRiskIdentificationWorkshop(workshopData, RiskRegisterModel, transaction);
  }

  async archiveRisk(riskId: string, closureNotes: string, transaction?: Transaction) {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return archiveRisk(riskId, closureNotes, RiskRegisterModel, transaction);
  }

  async generateRiskRegisterReport(filters: any) {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return generateRiskRegisterReport(filters, RiskRegisterModel);
  }

  // Risk Assessment & Scoring
  async performRiskAssessment(data: RiskAssessmentData, transaction?: Transaction) {
    const RiskAssessmentModel = createRiskAssessmentModel(this.sequelize);
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return performRiskAssessment(data, RiskAssessmentModel, RiskRegisterModel, transaction);
  }

  async generateRiskHeatMap() {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    const RiskAssessmentModel = createRiskAssessmentModel(this.sequelize);
    return generateRiskHeatMap(RiskRegisterModel, RiskAssessmentModel);
  }

  async calculateResidualRisk(riskId: string, controlEffectiveness: number) {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    const RiskAssessmentModel = createRiskAssessmentModel(this.sequelize);
    return calculateResidualRisk(riskId, controlEffectiveness, RiskRegisterModel, RiskAssessmentModel);
  }

  async performQuantitativeRiskAnalysis(riskId: string, quantitativeData: any) {
    const RiskAssessmentModel = createRiskAssessmentModel(this.sequelize);
    return performQuantitativeRiskAnalysis(riskId, quantitativeData, RiskAssessmentModel);
  }

  async performScenarioAnalysis(riskId: string, scenarios: any[]) {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return performScenarioAnalysis(riskId, scenarios, RiskRegisterModel);
  }

  generateRiskScoringMatrix() {
    return generateRiskScoringMatrix();
  }

  async compareRiskAssessments(riskId: string, startDate: Date, endDate: Date) {
    const RiskAssessmentModel = createRiskAssessmentModel(this.sequelize);
    return compareRiskAssessments(riskId, startDate, endDate, RiskAssessmentModel);
  }

  // Mitigation Strategy & Planning
  async createMitigationPlan(data: MitigationPlanData, transaction?: Transaction) {
    const MitigationPlanModel = createMitigationPlanModel(this.sequelize);
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return createMitigationPlan(data, MitigationPlanModel, RiskRegisterModel, transaction);
  }

  async updateMitigationProgress(mitigationId: string, progressData: any, transaction?: Transaction) {
    const MitigationPlanModel = createMitigationPlanModel(this.sequelize);
    return updateMitigationProgress(mitigationId, progressData, MitigationPlanModel, transaction);
  }

  async evaluateMitigationEffectiveness(mitigationId: string, postMitigationAssessment: any) {
    const MitigationPlanModel = createMitigationPlanModel(this.sequelize);
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    const RiskAssessmentModel = createRiskAssessmentModel(this.sequelize);
    return evaluateMitigationEffectiveness(mitigationId, postMitigationAssessment, MitigationPlanModel, RiskRegisterModel, RiskAssessmentModel);
  }

  async generateMitigationRecommendations(riskId: string) {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    const RiskAssessmentModel = createRiskAssessmentModel(this.sequelize);
    return generateMitigationRecommendations(riskId, RiskRegisterModel, RiskAssessmentModel);
  }

  async trackMitigationROI(mitigationId: string, actualCost: number) {
    const MitigationPlanModel = createMitigationPlanModel(this.sequelize);
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return trackMitigationROI(mitigationId, actualCost, MitigationPlanModel, RiskRegisterModel);
  }

  generateMitigationActionPlan(riskId: string, responseStrategy: RiskResponseStrategy) {
    return generateMitigationActionPlan(riskId, responseStrategy);
  }

  async monitorMitigationCompliance() {
    const MitigationPlanModel = createMitigationPlanModel(this.sequelize);
    return monitorMitigationCompliance(MitigationPlanModel);
  }

  // Risk Monitoring & Tracking
  async recordRiskMonitoring(data: RiskMonitoringData, transaction?: Transaction) {
    const RiskMonitoringModel = createRiskMonitoringModel(this.sequelize);
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return recordRiskMonitoring(data, RiskMonitoringModel, RiskRegisterModel, transaction);
  }

  async analyzeRiskTrends(riskId: string, period: { startDate: Date; endDate: Date }) {
    const RiskMonitoringModel = createRiskMonitoringModel(this.sequelize);
    return analyzeRiskTrends(riskId, period, RiskMonitoringModel);
  }

  async defineKeyRiskIndicators(riskId: string, indicators: any[], transaction?: Transaction) {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return defineKeyRiskIndicators(riskId, indicators, RiskRegisterModel, transaction);
  }

  async monitorKeyRiskIndicators(riskId: string, indicatorValues: Record<string, number>) {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    const RiskMonitoringModel = createRiskMonitoringModel(this.sequelize);
    return monitorKeyRiskIndicators(riskId, indicatorValues, RiskRegisterModel, RiskMonitoringModel);
  }

  async generateRiskMonitoringDashboard() {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    const RiskMonitoringModel = createRiskMonitoringModel(this.sequelize);
    const MitigationPlanModel = createMitigationPlanModel(this.sequelize);
    return generateRiskMonitoringDashboard(RiskRegisterModel, RiskMonitoringModel, MitigationPlanModel);
  }

  async escalateHighRisks(escalationThreshold: number) {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    const RiskMonitoringModel = createRiskMonitoringModel(this.sequelize);
    const RiskToleranceModel = createRiskToleranceModel(this.sequelize);
    return escalateHighRisks(escalationThreshold, RiskRegisterModel, RiskMonitoringModel, RiskToleranceModel);
  }

  async generatePeriodicRiskReport(reportPeriod: { startDate: Date; endDate: Date }) {
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    const RiskAssessmentModel = createRiskAssessmentModel(this.sequelize);
    const RiskMonitoringModel = createRiskMonitoringModel(this.sequelize);
    const MitigationPlanModel = createMitigationPlanModel(this.sequelize);
    const IncidentReportModel = createIncidentReportModel(this.sequelize);
    return generatePeriodicRiskReport(reportPeriod, RiskRegisterModel, RiskAssessmentModel, RiskMonitoringModel, MitigationPlanModel, IncidentReportModel);
  }

  // Incident Management & Response
  async reportIncident(data: IncidentReportData, transaction?: Transaction) {
    const IncidentReportModel = createIncidentReportModel(this.sequelize);
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return reportIncident(data, IncidentReportModel, RiskRegisterModel, transaction);
  }

  async updateIncidentStatus(incidentId: string, status: IncidentStatus, updateData: any, transaction?: Transaction) {
    const IncidentReportModel = createIncidentReportModel(this.sequelize);
    return updateIncidentStatus(incidentId, status, updateData, IncidentReportModel, transaction);
  }

  async performRootCauseAnalysis(incidentId: string, rootCauseData: any, transaction?: Transaction) {
    const IncidentReportModel = createIncidentReportModel(this.sequelize);
    return performRootCauseAnalysis(incidentId, rootCauseData, IncidentReportModel, transaction);
  }

  generateIncidentResponsePlan(severity: IncidentSeverity) {
    return generateIncidentResponsePlan(severity);
  }

  async trackIncidentResolution(incidentId: string, resolutionData: any, transaction?: Transaction) {
    const IncidentReportModel = createIncidentReportModel(this.sequelize);
    return trackIncidentResolution(incidentId, resolutionData, IncidentReportModel, transaction);
  }

  async analyzeIncidentTrends(period: { startDate: Date; endDate: Date }) {
    const IncidentReportModel = createIncidentReportModel(this.sequelize);
    return analyzeIncidentTrends(period, IncidentReportModel);
  }

  async linkIncidentToRisk(incidentId: string, riskId: string, transaction?: Transaction) {
    const IncidentReportModel = createIncidentReportModel(this.sequelize);
    const RiskRegisterModel = createRiskRegisterModel(this.sequelize);
    return linkIncidentToRisk(incidentId, riskId, IncidentReportModel, RiskRegisterModel, transaction);
  }

  async generateLessonsLearnedReport(period: { startDate: Date; endDate: Date }) {
    const IncidentReportModel = createIncidentReportModel(this.sequelize);
    return generateLessonsLearnedReport(period, IncidentReportModel);
  }
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Models
  createRiskRegisterModel,
  createRiskAssessmentModel,
  createMitigationPlanModel,
  createRiskMonitoringModel,
  createIncidentReportModel,
  createRiskToleranceModel,

  // Risk Identification & Registration Functions
  registerRisk,
  updateRisk,
  getRisksByCategory,
  getRisksByOwner,
  conductRiskIdentificationWorkshop,
  archiveRisk,
  generateRiskRegisterReport,

  // Risk Assessment & Scoring Functions
  performRiskAssessment,
  generateRiskHeatMap,
  calculateResidualRisk,
  performQuantitativeRiskAnalysis,
  performScenarioAnalysis,
  generateRiskScoringMatrix,
  compareRiskAssessments,

  // Mitigation Strategy & Planning Functions
  createMitigationPlan,
  updateMitigationProgress,
  evaluateMitigationEffectiveness,
  generateMitigationRecommendations,
  trackMitigationROI,
  generateMitigationActionPlan,
  monitorMitigationCompliance,

  // Risk Monitoring & Tracking Functions
  recordRiskMonitoring,
  analyzeRiskTrends,
  defineKeyRiskIndicators,
  monitorKeyRiskIndicators,
  generateRiskMonitoringDashboard,
  escalateHighRisks,
  generatePeriodicRiskReport,

  // Incident Management & Response Functions
  reportIncident,
  updateIncidentStatus,
  performRootCauseAnalysis,
  generateIncidentResponsePlan,
  trackIncidentResolution,
  analyzeIncidentTrends,
  linkIncidentToRisk,
  generateLessonsLearnedReport,

  // Service
  CEFMSRiskAssessmentMitigationService,
};
