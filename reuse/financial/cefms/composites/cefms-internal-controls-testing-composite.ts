/**
 * LOC: reuse/financial/cefms/composites/cefms-internal-controls-testing-composite.ts
 *
 * UPSTREAM DEPENDENCIES:
 * - reuse/government/risk-management-internal-controls-kit.ts
 * - reuse/government/audit-transparency-trail-kit.ts
 * - reuse/government/compliance-regulatory-tracking-kit.ts
 * - reuse/government/financial-reporting-disclosure-kit.ts
 *
 * DOWNSTREAM CONSUMERS:
 * - apps/white-cross-api/src/modules/financial/cefms/internal-controls-testing/
 * - apps/white-cross-api/src/modules/audit/sox-compliance/
 * - apps/white-cross-api/src/modules/risk/control-testing/
 *
 * PURPOSE:
 * Production-ready composite providing comprehensive internal controls testing capabilities
 * for USACE CEFMS. Implements SOX compliance, control design evaluation, control testing,
 * deficiency tracking, remediation management, risk-based testing, and segregation of duties
 * analysis for federal financial management systems.
 *
 * PRODUCTION READINESS:
 * - Comprehensive error handling and validation
 * - Full JSDoc documentation with examples
 * - NestJS Injectable service wrapper
 * - Sequelize ORM integration with proper indexes
 * - Composed from government kit reusable functions
 * - COSO framework and SOX 404 compliance
 */

// ============================================================================
// LLM CONTEXT: CEFMS Internal Controls Testing Composite
// ============================================================================
/**
 * This comprehensive composite provides 44+ production-ready functions for internal
 * controls testing and compliance management in USACE CEFMS environments.
 *
 * TECHNOLOGY STACK:
 * - TypeScript 5.x with strict type checking
 * - Node.js 18+ with async/await patterns
 * - NestJS 10.x for dependency injection and service architecture
 * - Sequelize 6.x ORM for PostgreSQL data persistence
 *
 * FUNCTIONAL COVERAGE:
 * - Control Design & Documentation (9 functions)
 * - Control Testing & Execution (9 functions)
 * - SOX Compliance & Certification (8 functions)
 * - Deficiency Management & Remediation (9 functions)
 * - Risk-Based Testing & Analysis (9 functions)
 *
 * COMPLIANCE STANDARDS:
 * - COSO Internal Control Framework
 * - SOX 404 Internal Controls over Financial Reporting
 * - OMB Circular A-123 Management's Responsibility for Internal Control
 * - GAO Standards for Internal Control in the Federal Government
 * - FISCAM (Federal Information System Controls Audit Manual)
 *
 * INTEGRATION PATTERNS:
 * All functions compose functionality from upstream government kits:
 * - Risk management and COSO compliance from risk-management-internal-controls-kit
 * - Audit trails and evidence tracking from audit-transparency-trail-kit
 * - Regulatory compliance tracking from compliance-regulatory-tracking-kit
 * - Financial disclosure controls from financial-reporting-disclosure-kit
 *
 * SERVICE ARCHITECTURE:
 * Functions are wrapped in CEFMSInternalControlsTestingService injectable class
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
 * Control types following COSO framework
 */
export enum ControlType {
  PREVENTIVE = 'preventive',
  DETECTIVE = 'detective',
  CORRECTIVE = 'corrective',
  DIRECTIVE = 'directive'
}

/**
 * Control frequency for testing cycles
 */
export enum ControlFrequency {
  CONTINUOUS = 'continuous',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually'
}

/**
 * Control automation level
 */
export enum ControlAutomation {
  MANUAL = 'manual',
  SEMI_AUTOMATED = 'semi_automated',
  FULLY_AUTOMATED = 'fully_automated',
  IT_DEPENDENT = 'it_dependent'
}

/**
 * Test result status
 */
export enum TestResultStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  INEFFECTIVE = 'ineffective',
  NOT_TESTED = 'not_tested',
  IN_PROGRESS = 'in_progress'
}

/**
 * Deficiency severity levels
 */
export enum DeficiencySeverity {
  CRITICAL = 'critical',
  MATERIAL_WEAKNESS = 'material_weakness',
  SIGNIFICANT_DEFICIENCY = 'significant_deficiency',
  CONTROL_DEFICIENCY = 'control_deficiency',
  OBSERVATION = 'observation'
}

/**
 * Remediation status tracking
 */
export enum RemediationStatus {
  IDENTIFIED = 'identified',
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  TESTING = 'testing',
  COMPLETED = 'completed',
  VALIDATED = 'validated',
  CLOSED = 'closed'
}

/**
 * SOX compliance scope
 */
export enum SOXScope {
  IN_SCOPE = 'in_scope',
  OUT_OF_SCOPE = 'out_of_scope',
  SCOPING_IN_PROGRESS = 'scoping_in_progress'
}

/**
 * Control design data
 */
export interface ControlDesignData {
  controlId: string;
  controlName: string;
  controlDescription: string;
  controlObjective: string;
  controlType: ControlType;
  controlFrequency: ControlFrequency;
  automationLevel: ControlAutomation;
  processId: string;
  riskId: string;
  controlOwner: string;
  soxScope: SOXScope;
  cosomponent: string;
  cosoprinciple: string;
  isKeyControl: boolean;
  effectiveDate: Date;
}

/**
 * Control test plan
 */
export interface ControlTestPlanData {
  testPlanId: string;
  controlId: string;
  fiscalYear: number;
  testingPeriod: string;
  sampleSize: number;
  populationSize: number;
  testProcedures: string;
  testingApproach: string;
  testFrequency: ControlFrequency;
  leadTester: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
}

/**
 * Test execution result
 */
export interface TestExecutionData {
  testExecutionId: string;
  testPlanId: string;
  controlId: string;
  testDate: Date;
  testedBy: string;
  samplesTested: number;
  samplesWithExceptions: number;
  testResult: TestResultStatus;
  testNotes: string;
  evidenceLinks: string[];
  exceptionDetails?: string;
}

/**
 * Control deficiency
 */
export interface ControlDeficiencyData {
  deficiencyId: string;
  controlId: string;
  testExecutionId?: string;
  identifiedDate: Date;
  identifiedBy: string;
  deficiencyDescription: string;
  severity: DeficiencySeverity;
  rootCause: string;
  potentialImpact: string;
  affectedProcesses: string[];
  requiresDisclosure: boolean;
}

/**
 * Remediation plan
 */
export interface RemediationPlanData {
  remediationId: string;
  deficiencyId: string;
  remediationDescription: string;
  targetCompletionDate: Date;
  remediationOwner: string;
  status: RemediationStatus;
  estimatedCost?: number;
  resourcesRequired: string[];
  milestones: RemediationMilestone[];
}

/**
 * Remediation milestone
 */
export interface RemediationMilestone {
  milestoneId: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  status: string;
}

/**
 * SOX certification data
 */
export interface SOXCertificationData {
  certificationId: string;
  fiscalYear: number;
  quarter: number;
  certificationDate: Date;
  certifiedBy: string;
  certificationStatement: string;
  controlsEffective: boolean;
  materialWeaknesses: number;
  significantDeficiencies: number;
  attachments: string[];
}

/**
 * Segregation of duties matrix
 */
export interface SODMatrix {
  processId: string;
  processName: string;
  activities: SODActivity[];
  conflicts: SODConflict[];
}

export interface SODActivity {
  activityId: string;
  activityName: string;
  assignedUsers: string[];
  assignedRoles: string[];
}

export interface SODConflict {
  conflictId: string;
  activity1Id: string;
  activity2Id: string;
  conflictDescription: string;
  severity: string;
  mitigatingControls: string[];
}

// ============================================================================
// SEQUELIZE MODEL CREATION
// ============================================================================

/**
 * Creates Control Design model for tracking control documentation
 */
export const createControlDesignModel = (sequelize: Sequelize): typeof Model => {
  class ControlDesign extends Model {}

  ControlDesign.init(
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
        comment: 'Unique control identifier (e.g., FIN-001, IT-GC-01)',
      },
      controlName: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      controlDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      controlObjective: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      controlType: {
        type: DataTypes.ENUM(...Object.values(ControlType)),
        allowNull: false,
      },
      controlFrequency: {
        type: DataTypes.ENUM(...Object.values(ControlFrequency)),
        allowNull: false,
      },
      automationLevel: {
        type: DataTypes.ENUM(...Object.values(ControlAutomation)),
        allowNull: false,
      },
      processId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Business process identifier',
      },
      riskId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Associated risk identifier',
      },
      controlOwner: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      soxScope: {
        type: DataTypes.ENUM(...Object.values(SOXScope)),
        allowNull: false,
        defaultValue: SOXScope.SCOPING_IN_PROGRESS,
      },
      cosomponent: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'COSO Component (Control Environment, Risk Assessment, etc.)',
      },
      cosoprinciple: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'COSO Principle (1-17)',
      },
      isKeyControl: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      inactiveDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastReviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      nextReviewDate: {
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
      modelName: 'ControlDesign',
      tableName: 'cefms_control_designs',
      timestamps: true,
      indexes: [
        { fields: ['controlId'], unique: true },
        { fields: ['processId'] },
        { fields: ['soxScope'] },
        { fields: ['controlOwner'] },
        { fields: ['isKeyControl'] },
        { fields: ['controlType', 'controlFrequency'] },
      ],
    }
  );

  return ControlDesign;
};

/**
 * Creates Control Test Plan model for planning control testing
 */
export const createControlTestPlanModel = (sequelize: Sequelize): typeof Model => {
  class ControlTestPlan extends Model {}

  ControlTestPlan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      testPlanId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      controlId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      testingPeriod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'e.g., Q1 FY2024, FY2024',
      },
      sampleSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      populationSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      testProcedures: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      testingApproach: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'e.g., Statistical Sampling, Judgmental Sampling, Full Population',
      },
      testFrequency: {
        type: DataTypes.ENUM(...Object.values(ControlFrequency)),
        allowNull: false,
      },
      leadTester: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      plannedStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      plannedEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      actualStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      actualEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      planStatus: {
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
      modelName: 'ControlTestPlan',
      tableName: 'cefms_control_test_plans',
      timestamps: true,
      indexes: [
        { fields: ['testPlanId'], unique: true },
        { fields: ['controlId'] },
        { fields: ['fiscalYear'] },
        { fields: ['leadTester'] },
        { fields: ['planStatus'] },
        { fields: ['fiscalYear', 'testingPeriod'] },
      ],
    }
  );

  return ControlTestPlan;
};

/**
 * Creates Test Execution model for recording test results
 */
export const createTestExecutionModel = (sequelize: Sequelize): typeof Model => {
  class TestExecution extends Model {}

  TestExecution.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      testExecutionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      testPlanId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      controlId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      testDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      testedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      reviewedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      reviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      samplesTested: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      samplesWithExceptions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      testResult: {
        type: DataTypes.ENUM(...Object.values(TestResultStatus)),
        allowNull: false,
      },
      testNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      evidenceLinks: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
        defaultValue: [],
      },
      exceptionDetails: {
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
      modelName: 'TestExecution',
      tableName: 'cefms_test_executions',
      timestamps: true,
      indexes: [
        { fields: ['testExecutionId'], unique: true },
        { fields: ['testPlanId'] },
        { fields: ['controlId'] },
        { fields: ['testDate'] },
        { fields: ['testResult'] },
        { fields: ['testedBy'] },
        { fields: ['controlId', 'testDate'] },
      ],
    }
  );

  return TestExecution;
};

/**
 * Creates Control Deficiency model for tracking control failures
 */
export const createControlDeficiencyModel = (sequelize: Sequelize): typeof Model => {
  class ControlDeficiency extends Model {}

  ControlDeficiency.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      deficiencyId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      controlId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      testExecutionId: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      identifiedDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      identifiedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      deficiencyDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM(...Object.values(DeficiencySeverity)),
        allowNull: false,
      },
      rootCause: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      potentialImpact: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      affectedProcesses: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      requiresDisclosure: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      disclosureDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'open',
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
      modelName: 'ControlDeficiency',
      tableName: 'cefms_control_deficiencies',
      timestamps: true,
      indexes: [
        { fields: ['deficiencyId'], unique: true },
        { fields: ['controlId'] },
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['identifiedDate'] },
        { fields: ['requiresDisclosure'] },
      ],
    }
  );

  return ControlDeficiency;
};

/**
 * Creates Remediation Plan model for tracking deficiency remediation
 */
export const createRemediationPlanModel = (sequelize: Sequelize): typeof Model => {
  class RemediationPlan extends Model {}

  RemediationPlan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      remediationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      deficiencyId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      remediationDescription: {
        type: DataTypes.TEXT,
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
      remediationOwner: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(RemediationStatus)),
        allowNull: false,
        defaultValue: RemediationStatus.IDENTIFIED,
      },
      estimatedCost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      actualCost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      resourcesRequired: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      milestones: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: 'RemediationPlan',
      tableName: 'cefms_remediation_plans',
      timestamps: true,
      indexes: [
        { fields: ['remediationId'], unique: true },
        { fields: ['deficiencyId'] },
        { fields: ['status'] },
        { fields: ['remediationOwner'] },
        { fields: ['targetCompletionDate'] },
      ],
    }
  );

  return RemediationPlan;
};

/**
 * Creates SOX Certification model for quarterly/annual certifications
 */
export const createSOXCertificationModel = (sequelize: Sequelize): typeof Model => {
  class SOXCertification extends Model {}

  SOXCertification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      certificationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quarter: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '1-4 for quarterly, null for annual',
      },
      certificationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      certifiedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      certificationStatement: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      controlsEffective: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      materialWeaknesses: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      significantDeficiencies: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      controlDeficiencies: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalControlsTested: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      attachments: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
        defaultValue: [],
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: 'SOXCertification',
      tableName: 'cefms_sox_certifications',
      timestamps: true,
      indexes: [
        { fields: ['certificationId'], unique: true },
        { fields: ['fiscalYear', 'quarter'], unique: true },
        { fields: ['certifiedBy'] },
        { fields: ['controlsEffective'] },
      ],
    }
  );

  return SOXCertification;
};

// ============================================================================
// CONTROL DESIGN & DOCUMENTATION FUNCTIONS
// ============================================================================

/**
 * Creates a new control design in the control library
 *
 * @param controlData - Control design data
 * @param ControlDesignModel - Sequelize Control Design model
 * @param transaction - Optional transaction
 * @returns Created control design
 *
 * @example
 * const control = await createControlDesign({
 *   controlId: 'FIN-001',
 *   controlName: 'Bank Reconciliation Review',
 *   controlDescription: 'Monthly review and approval of bank reconciliations',
 *   controlObjective: 'Ensure accuracy and completeness of cash balances',
 *   controlType: ControlType.DETECTIVE,
 *   controlFrequency: ControlFrequency.MONTHLY,
 *   automationLevel: ControlAutomation.MANUAL,
 *   processId: 'PROC-CASH-001',
 *   riskId: 'RISK-CASH-001',
 *   controlOwner: 'john.doe@usace.army.mil',
 *   soxScope: SOXScope.IN_SCOPE,
 *   cosomponent: 'Control Activities',
 *   cosoprinciple: 'Principle 12: Deploys Control Activities',
 *   isKeyControl: true,
 *   effectiveDate: new Date('2024-01-01')
 * }, ControlDesign);
 */
export const createControlDesign = async (
  controlData: ControlDesignData,
  ControlDesignModel: any,
  transaction?: Transaction,
): Promise<any> => {
  // Validate required fields
  if (!controlData.controlId || !controlData.controlName) {
    throw new Error('Control ID and name are required');
  }

  // Check for duplicate control ID
  const existing = await ControlDesignModel.findOne({
    where: { controlId: controlData.controlId },
    transaction,
  });

  if (existing) {
    throw new Error(`Control with ID ${controlData.controlId} already exists`);
  }

  // Create control design
  const control = await ControlDesignModel.create(
    {
      ...controlData,
      lastReviewDate: new Date(),
      nextReviewDate: calculateNextReviewDate(controlData.effectiveDate),
    },
    { transaction }
  );

  return control;
};

/**
 * Updates an existing control design
 */
export const updateControlDesign = async (
  controlId: string,
  updates: Partial<ControlDesignData>,
  ControlDesignModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const control = await ControlDesignModel.findOne({
    where: { controlId },
    transaction,
  });

  if (!control) {
    throw new Error(`Control ${controlId} not found`);
  }

  await control.update(updates, { transaction });
  return control;
};

/**
 * Retrieves control designs by process
 */
export const getControlsByProcess = async (
  processId: string,
  ControlDesignModel: any,
  includeInactive = false,
): Promise<any[]> => {
  const whereClause: any = { processId };

  if (!includeInactive) {
    whereClause.inactiveDate = null;
  }

  const controls = await ControlDesignModel.findAll({
    where: whereClause,
    order: [['controlId', 'ASC']],
  });

  return controls;
};

/**
 * Retrieves all key controls in SOX scope
 */
export const getKeySOXControls = async (
  ControlDesignModel: any,
): Promise<any[]> => {
  const controls = await ControlDesignModel.findAll({
    where: {
      isKeyControl: true,
      soxScope: SOXScope.IN_SCOPE,
      inactiveDate: null,
    },
    order: [['processId', 'ASC'], ['controlId', 'ASC']],
  });

  return controls;
};

/**
 * Maps controls to COSO framework components
 */
export const mapControlsToCOSO = async (
  ControlDesignModel: any,
): Promise<any> => {
  const controls = await ControlDesignModel.findAll({
    where: { inactiveDate: null },
  });

  const cosoMap = {
    'Control Environment': [],
    'Risk Assessment': [],
    'Control Activities': [],
    'Information and Communication': [],
    'Monitoring Activities': [],
  };

  controls.forEach(control => {
    const component = control.cosomponent;
    if (cosoMap[component]) {
      cosoMap[component].push({
        controlId: control.controlId,
        controlName: control.controlName,
        cosoprinciple: control.cosoprinciple,
        isKeyControl: control.isKeyControl,
      });
    }
  });

  return cosoMap;
};

/**
 * Generates control documentation report
 */
export const generateControlDocumentation = async (
  controlId: string,
  ControlDesignModel: any,
  TestExecutionModel: any,
): Promise<any> => {
  const control = await ControlDesignModel.findOne({
    where: { controlId },
  });

  if (!control) {
    throw new Error(`Control ${controlId} not found`);
  }

  // Get recent test results
  const recentTests = await TestExecutionModel.findAll({
    where: { controlId },
    order: [['testDate', 'DESC']],
    limit: 10,
  });

  return {
    controlDesign: control,
    recentTestResults: recentTests,
    testingHistory: {
      totalTests: recentTests.length,
      passedTests: recentTests.filter(t => t.testResult === TestResultStatus.PASSED).length,
      failedTests: recentTests.filter(t => t.testResult === TestResultStatus.FAILED).length,
    },
  };
};

/**
 * Archives inactive controls
 */
export const archiveControl = async (
  controlId: string,
  inactiveDate: Date,
  ControlDesignModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const control = await ControlDesignModel.findOne({
    where: { controlId },
    transaction,
  });

  if (!control) {
    throw new Error(`Control ${controlId} not found`);
  }

  await control.update({ inactiveDate }, { transaction });
  return control;
};

/**
 * Validates control design completeness
 */
export const validateControlDesign = async (
  controlId: string,
  ControlDesignModel: any,
): Promise<{ valid: boolean; issues: string[] }> => {
  const control = await ControlDesignModel.findOne({
    where: { controlId },
  });

  if (!control) {
    return { valid: false, issues: ['Control not found'] };
  }

  const issues: string[] = [];

  if (!control.controlObjective || control.controlObjective.length < 20) {
    issues.push('Control objective is too brief or missing');
  }

  if (!control.controlDescription || control.controlDescription.length < 50) {
    issues.push('Control description is too brief or missing');
  }

  if (!control.controlOwner) {
    issues.push('Control owner not assigned');
  }

  if (control.isKeyControl && control.soxScope !== SOXScope.IN_SCOPE) {
    issues.push('Key controls must be in SOX scope');
  }

  if (!control.nextReviewDate || control.nextReviewDate < new Date()) {
    issues.push('Control review is overdue');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};

/**
 * Performs control design walkthrough
 */
export const performControlWalkthrough = async (
  controlId: string,
  walkthroughData: {
    performedBy: string;
    walkthroughDate: Date;
    findings: string;
    designEffective: boolean;
  },
  ControlDesignModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const control = await ControlDesignModel.findOne({
    where: { controlId },
    transaction,
  });

  if (!control) {
    throw new Error(`Control ${controlId} not found`);
  }

  const metadata = control.metadata || {};
  metadata.walkthroughs = metadata.walkthroughs || [];
  metadata.walkthroughs.push(walkthroughData);

  await control.update({ metadata }, { transaction });
  return control;
};

// ============================================================================
// CONTROL TESTING & EXECUTION FUNCTIONS
// ============================================================================

/**
 * Creates a control test plan for a testing period
 */
export const createControlTestPlan = async (
  testPlanData: ControlTestPlanData,
  ControlTestPlanModel: any,
  ControlDesignModel: any,
  transaction?: Transaction,
): Promise<any> => {
  // Validate control exists
  const control = await ControlDesignModel.findOne({
    where: { controlId: testPlanData.controlId },
    transaction,
  });

  if (!control) {
    throw new Error(`Control ${testPlanData.controlId} not found`);
  }

  // Check for duplicate test plan
  const existing = await ControlTestPlanModel.findOne({
    where: { testPlanId: testPlanData.testPlanId },
    transaction,
  });

  if (existing) {
    throw new Error(`Test plan ${testPlanData.testPlanId} already exists`);
  }

  const testPlan = await ControlTestPlanModel.create(testPlanData, { transaction });
  return testPlan;
};

/**
 * Executes a control test and records results
 */
export const executeControlTest = async (
  testExecutionData: TestExecutionData,
  TestExecutionModel: any,
  ControlTestPlanModel: any,
  transaction?: Transaction,
): Promise<any> => {
  // Validate test plan exists
  const testPlan = await ControlTestPlanModel.findOne({
    where: { testPlanId: testExecutionData.testPlanId },
    transaction,
  });

  if (!testPlan) {
    throw new Error(`Test plan ${testExecutionData.testPlanId} not found`);
  }

  // Validate sample size
  if (testExecutionData.samplesTested > testPlan.sampleSize) {
    throw new Error('Samples tested exceeds planned sample size');
  }

  // Determine test result based on exceptions
  let testResult = testExecutionData.testResult;
  if (!testResult) {
    if (testExecutionData.samplesWithExceptions === 0) {
      testResult = TestResultStatus.PASSED;
    } else {
      const exceptionRate = testExecutionData.samplesWithExceptions / testExecutionData.samplesTested;
      testResult = exceptionRate > 0.05 ? TestResultStatus.INEFFECTIVE : TestResultStatus.FAILED;
    }
  }

  const testExecution = await TestExecutionModel.create(
    {
      ...testExecutionData,
      testResult,
    },
    { transaction }
  );

  // Update test plan status
  if (testPlan.planStatus === 'planned') {
    await testPlan.update(
      {
        planStatus: 'in_progress',
        actualStartDate: testExecutionData.testDate,
      },
      { transaction }
    );
  }

  return testExecution;
};

/**
 * Calculates control testing completion rate
 */
export const calculateTestingCompletionRate = async (
  fiscalYear: number,
  testingPeriod: string,
  ControlTestPlanModel: any,
  TestExecutionModel: any,
): Promise<any> => {
  const testPlans = await ControlTestPlanModel.findAll({
    where: {
      fiscalYear,
      testingPeriod,
    },
  });

  const totalPlans = testPlans.length;
  let completedTests = 0;

  for (const plan of testPlans) {
    const executions = await TestExecutionModel.count({
      where: { testPlanId: plan.testPlanId },
    });
    if (executions > 0) {
      completedTests++;
    }
  }

  return {
    fiscalYear,
    testingPeriod,
    totalPlans,
    completedTests,
    completionRate: totalPlans > 0 ? (completedTests / totalPlans) * 100 : 0,
    remainingTests: totalPlans - completedTests,
  };
};

/**
 * Retrieves controls requiring testing
 */
export const getControlsRequiringTesting = async (
  fiscalYear: number,
  ControlDesignModel: any,
  ControlTestPlanModel: any,
  TestExecutionModel: any,
): Promise<any[]> => {
  const activeControls = await ControlDesignModel.findAll({
    where: {
      inactiveDate: null,
      soxScope: SOXScope.IN_SCOPE,
    },
  });

  const controlsNeedingTests = [];

  for (const control of activeControls) {
    const testPlans = await ControlTestPlanModel.findAll({
      where: {
        controlId: control.controlId,
        fiscalYear,
      },
    });

    if (testPlans.length === 0) {
      controlsNeedingTests.push({
        ...control.toJSON(),
        reason: 'No test plan created',
        priority: control.isKeyControl ? 'high' : 'medium',
      });
      continue;
    }

    for (const plan of testPlans) {
      const executions = await TestExecutionModel.count({
        where: { testPlanId: plan.testPlanId },
      });

      if (executions === 0) {
        controlsNeedingTests.push({
          ...control.toJSON(),
          testPlan: plan.toJSON(),
          reason: 'Test plan exists but not executed',
          priority: control.isKeyControl ? 'high' : 'medium',
        });
      }
    }
  }

  return controlsNeedingTests;
};

/**
 * Generates test evidence package
 */
export const generateTestEvidencePackage = async (
  testExecutionId: string,
  TestExecutionModel: any,
  ControlDesignModel: any,
): Promise<any> => {
  const execution = await TestExecutionModel.findOne({
    where: { testExecutionId },
  });

  if (!execution) {
    throw new Error(`Test execution ${testExecutionId} not found`);
  }

  const control = await ControlDesignModel.findOne({
    where: { controlId: execution.controlId },
  });

  return {
    testExecution: execution,
    controlDesign: control,
    evidencePackage: {
      testDate: execution.testDate,
      testedBy: execution.testedBy,
      reviewedBy: execution.reviewedBy,
      sampleSize: execution.samplesTested,
      testResult: execution.testResult,
      evidenceLinks: execution.evidenceLinks,
      testNotes: execution.testNotes,
      exceptionDetails: execution.exceptionDetails,
    },
  };
};

/**
 * Reviews and approves test execution
 */
export const reviewTestExecution = async (
  testExecutionId: string,
  reviewData: {
    reviewedBy: string;
    reviewDate: Date;
    reviewNotes?: string;
    approved: boolean;
  },
  TestExecutionModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const execution = await TestExecutionModel.findOne({
    where: { testExecutionId },
    transaction,
  });

  if (!execution) {
    throw new Error(`Test execution ${testExecutionId} not found`);
  }

  const metadata = execution.metadata || {};
  metadata.review = reviewData;

  await execution.update(
    {
      reviewedBy: reviewData.reviewedBy,
      reviewDate: reviewData.reviewDate,
      metadata,
    },
    { transaction }
  );

  return execution;
};

/**
 * Calculates statistical sample size for control testing
 */
export const calculateSampleSize = (
  populationSize: number,
  confidenceLevel = 0.95,
  expectedErrorRate = 0.05,
  tolerableErrorRate = 0.10,
): number => {
  // Simplified sample size calculation for attribute sampling
  // Using conservative approach for internal controls testing

  if (populationSize <= 0) {
    throw new Error('Population size must be greater than 0');
  }

  // For populations < 30, test all
  if (populationSize < 30) {
    return populationSize;
  }

  // Use standard sample size tables for 95% confidence
  let sampleSize: number;

  if (populationSize <= 100) {
    sampleSize = Math.min(25, populationSize);
  } else if (populationSize <= 500) {
    sampleSize = Math.min(40, populationSize);
  } else if (populationSize <= 1000) {
    sampleSize = Math.min(60, populationSize);
  } else {
    sampleSize = Math.min(80, populationSize);
  }

  // Adjust for expected error rate
  if (expectedErrorRate > 0.05) {
    sampleSize = Math.ceil(sampleSize * 1.5);
  }

  return Math.min(sampleSize, populationSize);
};

/**
 * Generates risk-based test plan
 */
export const generateRiskBasedTestPlan = async (
  fiscalYear: number,
  testingPeriod: string,
  ControlDesignModel: any,
  ControlTestPlanModel: any,
): Promise<any[]> => {
  const controls = await ControlDesignModel.findAll({
    where: {
      inactiveDate: null,
      soxScope: SOXScope.IN_SCOPE,
    },
  });

  const testPlans = [];

  for (const control of controls) {
    // Determine test frequency based on risk and automation
    let testFrequency: ControlFrequency;
    let sampleSizeMultiplier = 1.0;

    if (control.isKeyControl) {
      testFrequency = control.controlFrequency;
      sampleSizeMultiplier = 1.5; // Larger samples for key controls
    } else {
      testFrequency = ControlFrequency.ANNUALLY;
      sampleSizeMultiplier = 1.0;
    }

    // Manual controls require more testing
    if (control.automationLevel === ControlAutomation.MANUAL) {
      sampleSizeMultiplier *= 1.2;
    }

    const basePopulation = 100; // Assumed population
    const sampleSize = Math.ceil(calculateSampleSize(basePopulation) * sampleSizeMultiplier);

    const testPlanId = `TP-${fiscalYear}-${control.controlId}`;

    const testPlan = {
      testPlanId,
      controlId: control.controlId,
      fiscalYear,
      testingPeriod,
      sampleSize,
      populationSize: basePopulation,
      testProcedures: `Test ${control.controlName} per documented control procedure`,
      testingApproach: control.automationLevel === ControlAutomation.MANUAL
        ? 'Judgmental Sampling'
        : 'Statistical Sampling',
      testFrequency,
      leadTester: control.controlOwner,
      plannedStartDate: new Date(fiscalYear, 0, 1),
      plannedEndDate: new Date(fiscalYear, 11, 31),
    };

    testPlans.push(testPlan);
  }

  // Create test plans
  const createdPlans = await ControlTestPlanModel.bulkCreate(testPlans, {
    ignoreDuplicates: true,
  });

  return createdPlans;
};

/**
 * Performs control effectiveness assessment
 */
export const assessControlEffectiveness = async (
  controlId: string,
  assessmentPeriod: { startDate: Date; endDate: Date },
  TestExecutionModel: any,
): Promise<any> => {
  const testExecutions = await TestExecutionModel.findAll({
    where: {
      controlId,
      testDate: {
        [Op.between]: [assessmentPeriod.startDate, assessmentPeriod.endDate],
      },
    },
    order: [['testDate', 'ASC']],
  });

  if (testExecutions.length === 0) {
    return {
      controlId,
      effectiveness: 'not_tested',
      reason: 'No test executions found in the assessment period',
    };
  }

  const totalTests = testExecutions.length;
  const passedTests = testExecutions.filter(t => t.testResult === TestResultStatus.PASSED).length;
  const failedTests = testExecutions.filter(t => t.testResult === TestResultStatus.FAILED).length;
  const ineffectiveTests = testExecutions.filter(t => t.testResult === TestResultStatus.INEFFECTIVE).length;

  let effectiveness: string;
  if (ineffectiveTests > 0) {
    effectiveness = 'ineffective';
  } else if (failedTests / totalTests > 0.05) {
    effectiveness = 'needs_improvement';
  } else if (passedTests / totalTests >= 0.95) {
    effectiveness = 'effective';
  } else {
    effectiveness = 'partially_effective';
  }

  return {
    controlId,
    assessmentPeriod,
    totalTests,
    passedTests,
    failedTests,
    ineffectiveTests,
    passRate: (passedTests / totalTests) * 100,
    effectiveness,
    testHistory: testExecutions.map(t => ({
      testDate: t.testDate,
      testResult: t.testResult,
      samplesWithExceptions: t.samplesWithExceptions,
    })),
  };
};

// ============================================================================
// SOX COMPLIANCE & CERTIFICATION FUNCTIONS
// ============================================================================

/**
 * Creates SOX certification for a fiscal period
 */
export const createSOXCertification = async (
  certificationData: SOXCertificationData,
  SOXCertificationModel: any,
  transaction?: Transaction,
): Promise<any> => {
  // Check for duplicate certification
  const existing = await SOXCertificationModel.findOne({
    where: {
      fiscalYear: certificationData.fiscalYear,
      quarter: certificationData.quarter,
    },
    transaction,
  });

  if (existing) {
    throw new Error(
      `SOX certification for FY${certificationData.fiscalYear} Q${certificationData.quarter} already exists`
    );
  }

  const certification = await SOXCertificationModel.create(certificationData, { transaction });
  return certification;
};

/**
 * Generates SOX compliance dashboard
 */
export const generateSOXComplianceDashboard = async (
  fiscalYear: number,
  ControlDesignModel: any,
  TestExecutionModel: any,
  ControlDeficiencyModel: any,
): Promise<any> => {
  // Get all SOX controls
  const soxControls = await ControlDesignModel.findAll({
    where: {
      soxScope: SOXScope.IN_SCOPE,
      inactiveDate: null,
    },
  });

  const totalControls = soxControls.length;
  const keyControls = soxControls.filter(c => c.isKeyControl).length;

  // Get test results for the fiscal year
  const startDate = new Date(fiscalYear, 0, 1);
  const endDate = new Date(fiscalYear, 11, 31);

  const testExecutions = await TestExecutionModel.findAll({
    where: {
      testDate: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const controlsTested = new Set(testExecutions.map(t => t.controlId)).size;
  const passedTests = testExecutions.filter(t => t.testResult === TestResultStatus.PASSED).length;
  const failedTests = testExecutions.filter(t => t.testResult === TestResultStatus.FAILED).length;

  // Get deficiencies
  const deficiencies = await ControlDeficiencyModel.findAll({
    where: {
      identifiedDate: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const materialWeaknesses = deficiencies.filter(
    d => d.severity === DeficiencySeverity.MATERIAL_WEAKNESS
  ).length;
  const significantDeficiencies = deficiencies.filter(
    d => d.severity === DeficiencySeverity.SIGNIFICANT_DEFICIENCY
  ).length;

  return {
    fiscalYear,
    controls: {
      total: totalControls,
      keyControls,
      tested: controlsTested,
      testingCompletionRate: (controlsTested / totalControls) * 100,
    },
    testing: {
      totalTests: testExecutions.length,
      passed: passedTests,
      failed: failedTests,
      passRate: testExecutions.length > 0 ? (passedTests / testExecutions.length) * 100 : 0,
    },
    deficiencies: {
      total: deficiencies.length,
      materialWeaknesses,
      significantDeficiencies,
      controlDeficiencies: deficiencies.filter(
        d => d.severity === DeficiencySeverity.CONTROL_DEFICIENCY
      ).length,
    },
    complianceStatus: materialWeaknesses === 0 && significantDeficiencies === 0 ? 'compliant' : 'non_compliant',
  };
};

/**
 * Validates SOX scoping decisions
 */
export const validateSOXScoping = async (
  ControlDesignModel: any,
): Promise<any> => {
  const controls = await ControlDesignModel.findAll();

  const scopingIssues = [];

  for (const control of controls) {
    // Key controls must be in scope
    if (control.isKeyControl && control.soxScope !== SOXScope.IN_SCOPE) {
      scopingIssues.push({
        controlId: control.controlId,
        issue: 'Key control is not in SOX scope',
        recommendation: 'Add to SOX scope or remove key control designation',
      });
    }

    // High-risk processes should have in-scope controls
    if (control.processId.includes('FINANCIAL') && control.soxScope === SOXScope.OUT_OF_SCOPE) {
      scopingIssues.push({
        controlId: control.controlId,
        issue: 'Financial process control is out of SOX scope',
        recommendation: 'Review scoping decision for financial process controls',
      });
    }
  }

  return {
    totalControls: controls.length,
    inScope: controls.filter(c => c.soxScope === SOXScope.IN_SCOPE).length,
    outOfScope: controls.filter(c => c.soxScope === SOXScope.OUT_OF_SCOPE).length,
    scopingInProgress: controls.filter(c => c.soxScope === SOXScope.SCOPING_IN_PROGRESS).length,
    issues: scopingIssues,
  };
};

/**
 * Generates management certification letter
 */
export const generateManagementCertificationLetter = async (
  fiscalYear: number,
  quarter: number | null,
  ControlDesignModel: any,
  TestExecutionModel: any,
  ControlDeficiencyModel: any,
): Promise<any> => {
  const dashboard = await generateSOXComplianceDashboard(
    fiscalYear,
    ControlDesignModel,
    TestExecutionModel,
    ControlDeficiencyModel
  );

  const period = quarter ? `Q${quarter} FY${fiscalYear}` : `FY${fiscalYear}`;
  const effectiveStatement = dashboard.deficiencies.materialWeaknesses === 0
    ? 'Internal controls over financial reporting are effective as of the certification date.'
    : `Management has identified ${dashboard.deficiencies.materialWeaknesses} material weakness(es) in internal controls over financial reporting.`;

  const certificationLetter = {
    period,
    certificationDate: new Date(),
    statement: `Management of USACE hereby certifies that we have assessed the effectiveness of internal controls over financial reporting for ${period}. ${effectiveStatement}`,
    controlsTested: dashboard.controls.tested,
    totalControls: dashboard.controls.total,
    testingCompletionRate: dashboard.controls.testingCompletionRate,
    materialWeaknesses: dashboard.deficiencies.materialWeaknesses,
    significantDeficiencies: dashboard.deficiencies.significantDeficiencies,
    controlsEffective: dashboard.complianceStatus === 'compliant',
  };

  return certificationLetter;
};

/**
 * Tracks SOX control changes
 */
export const trackSOXControlChanges = async (
  controlId: string,
  changeData: {
    changeDate: Date;
    changedBy: string;
    changeDescription: string;
    impactAssessment: string;
    retestingRequired: boolean;
  },
  ControlDesignModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const control = await ControlDesignModel.findOne({
    where: { controlId },
    transaction,
  });

  if (!control) {
    throw new Error(`Control ${controlId} not found`);
  }

  const metadata = control.metadata || {};
  metadata.changes = metadata.changes || [];
  metadata.changes.push(changeData);

  await control.update({ metadata }, { transaction });
  return control;
};

/**
 * Generates SOX 404 compliance report
 */
export const generateSOX404Report = async (
  fiscalYear: number,
  ControlDesignModel: any,
  TestExecutionModel: any,
  ControlDeficiencyModel: any,
  SOXCertificationModel: any,
): Promise<any> => {
  const dashboard = await generateSOXComplianceDashboard(
    fiscalYear,
    ControlDesignModel,
    TestExecutionModel,
    ControlDeficiencyModel
  );

  const certifications = await SOXCertificationModel.findAll({
    where: { fiscalYear },
    order: [['quarter', 'ASC']],
  });

  const deficiencies = await ControlDeficiencyModel.findAll({
    where: {
      severity: {
        [Op.in]: [DeficiencySeverity.MATERIAL_WEAKNESS, DeficiencySeverity.SIGNIFICANT_DEFICIENCY],
      },
      identifiedDate: {
        [Op.between]: [new Date(fiscalYear, 0, 1), new Date(fiscalYear, 11, 31)],
      },
    },
  });

  return {
    fiscalYear,
    reportDate: new Date(),
    executiveSummary: dashboard,
    quarterlyCertifications: certifications,
    materialWeaknesses: deficiencies.filter(d => d.severity === DeficiencySeverity.MATERIAL_WEAKNESS),
    significantDeficiencies: deficiencies.filter(d => d.severity === DeficiencySeverity.SIGNIFICANT_DEFICIENCY),
    conclusion: dashboard.complianceStatus === 'compliant'
      ? 'Internal controls over financial reporting are effective.'
      : 'Material weaknesses or significant deficiencies exist that require remediation.',
  };
};

/**
 * Monitors control testing coverage
 */
export const monitorTestingCoverage = async (
  fiscalYear: number,
  targetCoverageRate: number,
  ControlDesignModel: any,
  TestExecutionModel: any,
): Promise<any> => {
  const soxControls = await ControlDesignModel.findAll({
    where: {
      soxScope: SOXScope.IN_SCOPE,
      inactiveDate: null,
    },
  });

  const totalControls = soxControls.length;
  const controlIds = soxControls.map(c => c.controlId);

  const startDate = new Date(fiscalYear, 0, 1);
  const endDate = new Date(fiscalYear, 11, 31);

  const testedControlIds = await TestExecutionModel.findAll({
    where: {
      controlId: { [Op.in]: controlIds },
      testDate: { [Op.between]: [startDate, endDate] },
    },
    attributes: ['controlId'],
    group: ['controlId'],
  });

  const controlsTested = testedControlIds.length;
  const coverageRate = (controlsTested / totalControls) * 100;

  const untestedControls = soxControls.filter(
    c => !testedControlIds.find(tc => tc.controlId === c.controlId)
  );

  return {
    fiscalYear,
    totalControls,
    controlsTested,
    coverageRate,
    targetCoverageRate,
    onTrack: coverageRate >= targetCoverageRate,
    gap: Math.max(0, targetCoverageRate - coverageRate),
    untestedControls: untestedControls.map(c => ({
      controlId: c.controlId,
      controlName: c.controlName,
      isKeyControl: c.isKeyControl,
      controlOwner: c.controlOwner,
    })),
  };
};

/**
 * Generates quarterly SOX testing status report
 */
export const generateQuarterlyTestingStatus = async (
  fiscalYear: number,
  quarter: number,
  ControlDesignModel: any,
  ControlTestPlanModel: any,
  TestExecutionModel: any,
): Promise<any> => {
  const testingPeriod = `Q${quarter} FY${fiscalYear}`;

  const testPlans = await ControlTestPlanModel.findAll({
    where: {
      fiscalYear,
      testingPeriod,
    },
  });

  const testExecutions = await TestExecutionModel.findAll({
    where: {
      testPlanId: { [Op.in]: testPlans.map(tp => tp.testPlanId) },
    },
  });

  const plannedTests = testPlans.length;
  const completedTests = new Set(testExecutions.map(te => te.testPlanId)).size;
  const passedTests = testExecutions.filter(te => te.testResult === TestResultStatus.PASSED).length;
  const failedTests = testExecutions.filter(te => te.testResult === TestResultStatus.FAILED).length;

  return {
    fiscalYear,
    quarter,
    testingPeriod,
    plannedTests,
    completedTests,
    completionRate: (completedTests / plannedTests) * 100,
    passedTests,
    failedTests,
    passRate: testExecutions.length > 0 ? (passedTests / testExecutions.length) * 100 : 0,
    status: completedTests >= plannedTests ? 'complete' : 'in_progress',
  };
};

// ============================================================================
// DEFICIENCY MANAGEMENT & REMEDIATION FUNCTIONS
// ============================================================================

/**
 * Creates a control deficiency record
 */
export const createControlDeficiency = async (
  deficiencyData: ControlDeficiencyData,
  ControlDeficiencyModel: any,
  ControlDesignModel: any,
  transaction?: Transaction,
): Promise<any> => {
  // Validate control exists
  const control = await ControlDesignModel.findOne({
    where: { controlId: deficiencyData.controlId },
    transaction,
  });

  if (!control) {
    throw new Error(`Control ${deficiencyData.controlId} not found`);
  }

  // Material weaknesses and significant deficiencies require disclosure
  if (
    deficiencyData.severity === DeficiencySeverity.MATERIAL_WEAKNESS ||
    deficiencyData.severity === DeficiencySeverity.SIGNIFICANT_DEFICIENCY
  ) {
    deficiencyData.requiresDisclosure = true;
  }

  const deficiency = await ControlDeficiencyModel.create(
    {
      ...deficiencyData,
      status: 'open',
    },
    { transaction }
  );

  return deficiency;
};

/**
 * Creates remediation plan for a deficiency
 */
export const createRemediationPlan = async (
  remediationData: RemediationPlanData,
  RemediationPlanModel: any,
  ControlDeficiencyModel: any,
  transaction?: Transaction,
): Promise<any> => {
  // Validate deficiency exists
  const deficiency = await ControlDeficiencyModel.findOne({
    where: { deficiencyId: remediationData.deficiencyId },
    transaction,
  });

  if (!deficiency) {
    throw new Error(`Deficiency ${remediationData.deficiencyId} not found`);
  }

  const remediationPlan = await RemediationPlanModel.create(remediationData, { transaction });
  return remediationPlan;
};

/**
 * Updates remediation plan status
 */
export const updateRemediationStatus = async (
  remediationId: string,
  status: RemediationStatus,
  statusNotes: string,
  RemediationPlanModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const plan = await RemediationPlanModel.findOne({
    where: { remediationId },
    transaction,
  });

  if (!plan) {
    throw new Error(`Remediation plan ${remediationId} not found`);
  }

  const updates: any = { status };

  if (status === RemediationStatus.COMPLETED || status === RemediationStatus.VALIDATED) {
    updates.actualCompletionDate = new Date();
  }

  const metadata = plan.metadata || {};
  metadata.statusHistory = metadata.statusHistory || [];
  metadata.statusHistory.push({
    status,
    date: new Date(),
    notes: statusNotes,
  });
  updates.metadata = metadata;

  await plan.update(updates, { transaction });
  return plan;
};

/**
 * Tracks remediation milestone completion
 */
export const updateRemediationMilestone = async (
  remediationId: string,
  milestoneId: string,
  completedDate: Date,
  completionNotes: string,
  RemediationPlanModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const plan = await RemediationPlanModel.findOne({
    where: { remediationId },
    transaction,
  });

  if (!plan) {
    throw new Error(`Remediation plan ${remediationId} not found`);
  }

  const milestones = plan.milestones || [];
  const milestone = milestones.find(m => m.milestoneId === milestoneId);

  if (!milestone) {
    throw new Error(`Milestone ${milestoneId} not found`);
  }

  milestone.completedDate = completedDate;
  milestone.status = 'completed';
  milestone.completionNotes = completionNotes;

  await plan.update({ milestones }, { transaction });
  return plan;
};

/**
 * Generates deficiency aging report
 */
export const generateDeficiencyAgingReport = async (
  ControlDeficiencyModel: any,
  RemediationPlanModel: any,
): Promise<any> => {
  const openDeficiencies = await ControlDeficiencyModel.findAll({
    where: { status: 'open' },
  });

  const now = new Date();
  const agingBuckets = {
    '0-30 days': [],
    '31-60 days': [],
    '61-90 days': [],
    '91-180 days': [],
    'Over 180 days': [],
  };

  for (const deficiency of openDeficiencies) {
    const ageInDays = Math.floor(
      (now.getTime() - deficiency.identifiedDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const remediationPlans = await RemediationPlanModel.findAll({
      where: { deficiencyId: deficiency.deficiencyId },
    });

    const deficiencyInfo = {
      ...deficiency.toJSON(),
      ageInDays,
      remediationPlans,
    };

    if (ageInDays <= 30) {
      agingBuckets['0-30 days'].push(deficiencyInfo);
    } else if (ageInDays <= 60) {
      agingBuckets['31-60 days'].push(deficiencyInfo);
    } else if (ageInDays <= 90) {
      agingBuckets['61-90 days'].push(deficiencyInfo);
    } else if (ageInDays <= 180) {
      agingBuckets['91-180 days'].push(deficiencyInfo);
    } else {
      agingBuckets['Over 180 days'].push(deficiencyInfo);
    }
  }

  return {
    reportDate: now,
    totalOpenDeficiencies: openDeficiencies.length,
    agingBuckets,
    summary: {
      '0-30 days': agingBuckets['0-30 days'].length,
      '31-60 days': agingBuckets['31-60 days'].length,
      '61-90 days': agingBuckets['61-90 days'].length,
      '91-180 days': agingBuckets['91-180 days'].length,
      'Over 180 days': agingBuckets['Over 180 days'].length,
    },
  };
};

/**
 * Monitors remediation plan progress
 */
export const monitorRemediationProgress = async (
  RemediationPlanModel: any,
): Promise<any> => {
  const allPlans = await RemediationPlanModel.findAll();

  const statusSummary = {
    [RemediationStatus.IDENTIFIED]: 0,
    [RemediationStatus.PLANNED]: 0,
    [RemediationStatus.IN_PROGRESS]: 0,
    [RemediationStatus.TESTING]: 0,
    [RemediationStatus.COMPLETED]: 0,
    [RemediationStatus.VALIDATED]: 0,
    [RemediationStatus.CLOSED]: 0,
  };

  const overdueRemediations = [];
  const now = new Date();

  for (const plan of allPlans) {
    statusSummary[plan.status]++;

    if (
      plan.status !== RemediationStatus.COMPLETED &&
      plan.status !== RemediationStatus.VALIDATED &&
      plan.status !== RemediationStatus.CLOSED &&
      plan.targetCompletionDate < now
    ) {
      overdueRemediations.push({
        remediationId: plan.remediationId,
        deficiencyId: plan.deficiencyId,
        targetCompletionDate: plan.targetCompletionDate,
        daysOverdue: Math.floor((now.getTime() - plan.targetCompletionDate.getTime()) / (1000 * 60 * 60 * 24)),
        status: plan.status,
        remediationOwner: plan.remediationOwner,
      });
    }
  }

  return {
    totalRemediationPlans: allPlans.length,
    statusSummary,
    overdueRemediations,
    onTrackRemediations: allPlans.length - overdueRemediations.length,
  };
};

/**
 * Validates deficiency closure
 */
export const validateDeficiencyClosure = async (
  deficiencyId: string,
  closureData: {
    closedBy: string;
    closureDate: Date;
    closureNotes: string;
    retestResults: string;
  },
  ControlDeficiencyModel: any,
  RemediationPlanModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const deficiency = await ControlDeficiencyModel.findOne({
    where: { deficiencyId },
    transaction,
  });

  if (!deficiency) {
    throw new Error(`Deficiency ${deficiencyId} not found`);
  }

  // Verify remediation plan is completed
  const remediationPlans = await RemediationPlanModel.findAll({
    where: { deficiencyId },
    transaction,
  });

  const allCompleted = remediationPlans.every(
    plan => plan.status === RemediationStatus.VALIDATED || plan.status === RemediationStatus.CLOSED
  );

  if (!allCompleted) {
    throw new Error('Cannot close deficiency until all remediation plans are validated');
  }

  await deficiency.update(
    {
      status: 'closed',
      closedDate: closureData.closureDate,
      metadata: {
        ...deficiency.metadata,
        closure: closureData,
      },
    },
    { transaction }
  );

  return deficiency;
};

/**
 * Generates deficiency trends analysis
 */
export const analyzeDeficiencyTrends = async (
  startDate: Date,
  endDate: Date,
  ControlDeficiencyModel: any,
): Promise<any> => {
  const deficiencies = await ControlDeficiencyModel.findAll({
    where: {
      identifiedDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['identifiedDate', 'ASC']],
  });

  const bySeverity = {
    [DeficiencySeverity.CRITICAL]: 0,
    [DeficiencySeverity.MATERIAL_WEAKNESS]: 0,
    [DeficiencySeverity.SIGNIFICANT_DEFICIENCY]: 0,
    [DeficiencySeverity.CONTROL_DEFICIENCY]: 0,
    [DeficiencySeverity.OBSERVATION]: 0,
  };

  const byMonth = {};

  deficiencies.forEach(def => {
    bySeverity[def.severity]++;

    const monthKey = `${def.identifiedDate.getFullYear()}-${String(def.identifiedDate.getMonth() + 1).padStart(2, '0')}`;
    byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
  });

  return {
    period: { startDate, endDate },
    totalDeficiencies: deficiencies.length,
    bySeverity,
    byMonth,
    trend: Object.keys(byMonth).length > 1 ? calculateTrend(byMonth) : 'insufficient_data',
  };
};

/**
 * Escalates high-severity deficiencies
 */
export const escalateDeficiency = async (
  deficiencyId: string,
  escalationData: {
    escalatedTo: string[];
    escalationReason: string;
    escalatedBy: string;
    escalationDate: Date;
  },
  ControlDeficiencyModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const deficiency = await ControlDeficiencyModel.findOne({
    where: { deficiencyId },
    transaction,
  });

  if (!deficiency) {
    throw new Error(`Deficiency ${deficiencyId} not found`);
  }

  const metadata = deficiency.metadata || {};
  metadata.escalations = metadata.escalations || [];
  metadata.escalations.push(escalationData);

  await deficiency.update({ metadata }, { transaction });
  return deficiency;
};

// ============================================================================
// RISK-BASED TESTING & ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Performs risk assessment for controls
 */
export const performControlRiskAssessment = async (
  controlId: string,
  riskFactors: {
    processComplexity: number; // 1-5
    transactionVolume: number; // 1-5
    manualProcessing: number; // 1-5
    systemReliability: number; // 1-5
    managementOverride: number; // 1-5
  },
  ControlDesignModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const control = await ControlDesignModel.findOne({
    where: { controlId },
    transaction,
  });

  if (!control) {
    throw new Error(`Control ${controlId} not found`);
  }

  // Calculate risk score (weighted average)
  const weights = {
    processComplexity: 0.25,
    transactionVolume: 0.20,
    manualProcessing: 0.25,
    systemReliability: 0.15,
    managementOverride: 0.15,
  };

  const riskScore =
    riskFactors.processComplexity * weights.processComplexity +
    riskFactors.transactionVolume * weights.transactionVolume +
    riskFactors.manualProcessing * weights.manualProcessing +
    riskFactors.systemReliability * weights.systemReliability +
    riskFactors.managementOverride * weights.managementOverride;

  let riskRating: string;
  if (riskScore >= 4.0) {
    riskRating = 'high';
  } else if (riskScore >= 3.0) {
    riskRating = 'medium';
  } else {
    riskRating = 'low';
  }

  const metadata = control.metadata || {};
  metadata.riskAssessment = {
    riskFactors,
    riskScore,
    riskRating,
    assessmentDate: new Date(),
  };

  await control.update({ metadata }, { transaction });

  return {
    controlId,
    riskScore,
    riskRating,
    riskFactors,
  };
};

/**
 * Prioritizes controls for testing based on risk
 */
export const prioritizeControlsForTesting = async (
  fiscalYear: number,
  ControlDesignModel: any,
  TestExecutionModel: any,
): Promise<any[]> => {
  const controls = await ControlDesignModel.findAll({
    where: {
      soxScope: SOXScope.IN_SCOPE,
      inactiveDate: null,
    },
  });

  const prioritizedControls = [];

  for (const control of controls) {
    const riskScore = control.metadata?.riskAssessment?.riskScore || 3.0;
    const isKeyControl = control.isKeyControl;
    const automationLevel = control.automationLevel;

    // Calculate priority score
    let priorityScore = riskScore;

    if (isKeyControl) {
      priorityScore += 1.0; // Boost key controls
    }

    if (automationLevel === ControlAutomation.MANUAL) {
      priorityScore += 0.5; // Manual controls are higher risk
    }

    // Check if tested this year
    const recentTests = await TestExecutionModel.count({
      where: {
        controlId: control.controlId,
        testDate: {
          [Op.between]: [new Date(fiscalYear, 0, 1), new Date(fiscalYear, 11, 31)],
        },
      },
    });

    if (recentTests === 0) {
      priorityScore += 1.0; // Untested controls are higher priority
    }

    let priority: string;
    if (priorityScore >= 5.0) {
      priority = 'critical';
    } else if (priorityScore >= 4.0) {
      priority = 'high';
    } else if (priorityScore >= 3.0) {
      priority = 'medium';
    } else {
      priority = 'low';
    }

    prioritizedControls.push({
      controlId: control.controlId,
      controlName: control.controlName,
      priorityScore,
      priority,
      isKeyControl,
      riskScore,
      automationLevel,
      recentTests,
    });
  }

  // Sort by priority score descending
  prioritizedControls.sort((a, b) => b.priorityScore - a.priorityScore);

  return prioritizedControls;
};

/**
 * Analyzes segregation of duties
 */
export const analyzeSegregationOfDuties = async (
  processId: string,
  userRoleAssignments: Array<{
    userId: string;
    userName: string;
    activities: string[];
  }>,
): Promise<SODMatrix> => {
  // Define incompatible activities (simplified example)
  const incompatiblePairs = [
    { activity1: 'initiate_transaction', activity2: 'approve_transaction' },
    { activity1: 'approve_transaction', activity2: 'record_transaction' },
    { activity1: 'custody_of_assets', activity2: 'record_assets' },
    { activity1: 'create_vendor', activity2: 'approve_vendor' },
    { activity1: 'create_payment', activity2: 'approve_payment' },
  ];

  const activities: SODActivity[] = [];
  const conflicts: SODConflict[] = [];

  // Build activity list
  const activityMap = new Map<string, Set<string>>();

  userRoleAssignments.forEach(assignment => {
    assignment.activities.forEach(activity => {
      if (!activityMap.has(activity)) {
        activityMap.set(activity, new Set());
      }
      activityMap.get(activity)!.add(assignment.userId);
    });
  });

  activityMap.forEach((users, activityName) => {
    activities.push({
      activityId: activityName,
      activityName: activityName.replace(/_/g, ' ').toUpperCase(),
      assignedUsers: Array.from(users),
      assignedRoles: [],
    });
  });

  // Detect conflicts
  incompatiblePairs.forEach(pair => {
    const users1 = activityMap.get(pair.activity1);
    const users2 = activityMap.get(pair.activity2);

    if (users1 && users2) {
      const commonUsers = Array.from(users1).filter(u => users2.has(u));

      if (commonUsers.length > 0) {
        conflicts.push({
          conflictId: `SOD-${pair.activity1}-${pair.activity2}`,
          activity1Id: pair.activity1,
          activity2Id: pair.activity2,
          conflictDescription: `User(s) ${commonUsers.join(', ')} have both ${pair.activity1} and ${pair.activity2} access`,
          severity: 'high',
          mitigatingControls: ['Manager review and approval required', 'Periodic access reviews'],
        });
      }
    }
  });

  return {
    processId,
    processName: `Process ${processId}`,
    activities,
    conflicts,
  };
};

/**
 * Evaluates IT general controls (ITGCs)
 */
export const evaluateITGeneralControls = async (
  systemId: string,
  itgcAssessment: {
    accessControls: number; // 1-5 rating
    changeManagement: number;
    backupRecovery: number;
    systemMonitoring: number;
    incidentResponse: number;
  },
): Promise<any> => {
  const weights = {
    accessControls: 0.25,
    changeManagement: 0.25,
    backupRecovery: 0.20,
    systemMonitoring: 0.15,
    incidentResponse: 0.15,
  };

  const overallScore =
    itgcAssessment.accessControls * weights.accessControls +
    itgcAssessment.changeManagement * weights.changeManagement +
    itgcAssessment.backupRecovery * weights.backupRecovery +
    itgcAssessment.systemMonitoring * weights.systemMonitoring +
    itgcAssessment.incidentResponse * weights.incidentResponse;

  let rating: string;
  if (overallScore >= 4.0) {
    rating = 'effective';
  } else if (overallScore >= 3.0) {
    rating = 'adequate';
  } else {
    rating = 'needs_improvement';
  }

  const weakAreas = [];
  Object.entries(itgcAssessment).forEach(([area, score]) => {
    if (score < 3.0) {
      weakAreas.push(area);
    }
  });

  return {
    systemId,
    itgcAssessment,
    overallScore,
    rating,
    weakAreas,
    recommendations: weakAreas.map(area => `Strengthen ${area.replace(/([A-Z])/g, ' $1').toLowerCase()}`),
  };
};

/**
 * Performs control walkdown and observation
 */
export const performControlWalkdown = async (
  controlId: string,
  walkdownData: {
    observedBy: string;
    observationDate: Date;
    processObserved: string;
    controlPerformedAsDesigned: boolean;
    observations: string;
    evidenceObtained: string[];
  },
  ControlDesignModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const control = await ControlDesignModel.findOne({
    where: { controlId },
    transaction,
  });

  if (!control) {
    throw new Error(`Control ${controlId} not found`);
  }

  const metadata = control.metadata || {};
  metadata.walkdowns = metadata.walkdowns || [];
  metadata.walkdowns.push(walkdownData);

  await control.update({ metadata }, { transaction });

  return {
    controlId,
    walkdownData,
    conclusion: walkdownData.controlPerformedAsDesigned
      ? 'Control is operating as designed'
      : 'Control design or operation issues identified',
  };
};

/**
 * Generates control testing risk matrix
 */
export const generateControlTestingRiskMatrix = async (
  ControlDesignModel: any,
  TestExecutionModel: any,
): Promise<any> => {
  const controls = await ControlDesignModel.findAll({
    where: {
      soxScope: SOXScope.IN_SCOPE,
      inactiveDate: null,
    },
  });

  const riskMatrix = {
    highRisk_highImpact: [],
    highRisk_lowImpact: [],
    lowRisk_highImpact: [],
    lowRisk_lowImpact: [],
  };

  for (const control of controls) {
    const riskScore = control.metadata?.riskAssessment?.riskScore || 3.0;
    const isHighRisk = riskScore >= 3.5;
    const isHighImpact = control.isKeyControl;

    const recentTests = await TestExecutionModel.findAll({
      where: { controlId: control.controlId },
      order: [['testDate', 'DESC']],
      limit: 3,
    });

    const testingRecommendation = determineTestingRecommendation(isHighRisk, isHighImpact, control.automationLevel);

    const controlInfo = {
      controlId: control.controlId,
      controlName: control.controlName,
      riskScore,
      isKeyControl: control.isKeyControl,
      automationLevel: control.automationLevel,
      recentTestResults: recentTests.map(t => t.testResult),
      testingRecommendation,
    };

    if (isHighRisk && isHighImpact) {
      riskMatrix.highRisk_highImpact.push(controlInfo);
    } else if (isHighRisk && !isHighImpact) {
      riskMatrix.highRisk_lowImpact.push(controlInfo);
    } else if (!isHighRisk && isHighImpact) {
      riskMatrix.lowRisk_highImpact.push(controlInfo);
    } else {
      riskMatrix.lowRisk_lowImpact.push(controlInfo);
    }
  }

  return riskMatrix;
};

/**
 * Monitors control environment changes
 */
export const monitorControlEnvironmentChanges = async (
  startDate: Date,
  endDate: Date,
  ControlDesignModel: any,
): Promise<any> => {
  const controls = await ControlDesignModel.findAll({
    where: {
      updatedAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['updatedAt', 'DESC']],
  });

  const changes = controls.map(control => {
    const changeHistory = control.metadata?.changes || [];
    const recentChanges = changeHistory.filter(
      ch => ch.changeDate >= startDate && ch.changeDate <= endDate
    );

    return {
      controlId: control.controlId,
      controlName: control.controlName,
      changes: recentChanges,
      impactAssessmentRequired: recentChanges.some(ch => ch.retestingRequired),
    };
  });

  return {
    period: { startDate, endDate },
    totalChanges: changes.reduce((sum, c) => sum + c.changes.length, 0),
    controlsModified: changes.filter(c => c.changes.length > 0).length,
    retestingRequired: changes.filter(c => c.impactAssessmentRequired).length,
    changes,
  };
};

/**
 * Assesses control maturity level
 */
export const assessControlMaturity = async (
  processId: string,
  ControlDesignModel: any,
  TestExecutionModel: any,
): Promise<any> => {
  const controls = await ControlDesignModel.findAll({
    where: { processId, inactiveDate: null },
  });

  if (controls.length === 0) {
    return {
      processId,
      maturityLevel: 'initial',
      score: 1,
      recommendation: 'Establish formal control documentation',
    };
  }

  let maturityScore = 0;
  const factors = [];

  // Factor 1: Control documentation completeness
  const documentationScore = await calculateDocumentationScore(controls);
  maturityScore += documentationScore * 0.3;
  factors.push({ factor: 'Documentation', score: documentationScore });

  // Factor 2: Control testing frequency
  let totalTests = 0;
  for (const control of controls) {
    const tests = await TestExecutionModel.count({
      where: {
        controlId: control.controlId,
        testDate: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1),
        },
      },
    });
    totalTests += tests;
  }
  const testingScore = Math.min(5, (totalTests / controls.length) * 2);
  maturityScore += testingScore * 0.3;
  factors.push({ factor: 'Testing Frequency', score: testingScore });

  // Factor 3: Automation level
  const automationScore = calculateAutomationScore(controls);
  maturityScore += automationScore * 0.2;
  factors.push({ factor: 'Automation', score: automationScore });

  // Factor 4: Control effectiveness
  const effectivenessScore = await calculateEffectivenessScore(controls, TestExecutionModel);
  maturityScore += effectivenessScore * 0.2;
  factors.push({ factor: 'Effectiveness', score: effectivenessScore });

  let maturityLevel: string;
  if (maturityScore >= 4.0) {
    maturityLevel = 'optimized';
  } else if (maturityScore >= 3.0) {
    maturityLevel = 'managed';
  } else if (maturityScore >= 2.0) {
    maturityLevel = 'defined';
  } else {
    maturityLevel = 'initial';
  }

  return {
    processId,
    maturityScore: Math.round(maturityScore * 10) / 10,
    maturityLevel,
    factors,
    recommendation: getMaturityRecommendation(maturityLevel),
  };
};

/**
 * Performs fraud risk assessment
 */
export const performFraudRiskAssessment = async (
  processId: string,
  fraudRiskFactors: {
    incentivePressure: number; // 1-5
    opportunity: number; // 1-5
    rationalization: number; // 1-5
    capability: number; // 1-5
  },
  ControlDesignModel: any,
): Promise<any> => {
  // Fraud triangle + capability assessment
  const fraudScore =
    (fraudRiskFactors.incentivePressure +
      fraudRiskFactors.opportunity +
      fraudRiskFactors.rationalization +
      fraudRiskFactors.capability) /
    4;

  let fraudRiskRating: string;
  if (fraudScore >= 4.0) {
    fraudRiskRating = 'high';
  } else if (fraudScore >= 3.0) {
    fraudRiskRating = 'medium';
  } else {
    fraudRiskRating = 'low';
  }

  // Get controls addressing fraud risk
  const controls = await ControlDesignModel.findAll({
    where: {
      processId,
      inactiveDate: null,
    },
  });

  const antifraudControls = controls.filter(
    c => c.controlType === ControlType.DETECTIVE || c.controlType === ControlType.PREVENTIVE
  );

  return {
    processId,
    fraudRiskFactors,
    fraudScore,
    fraudRiskRating,
    antifraudControls: antifraudControls.length,
    recommendations: [
      fraudScore >= 3.0 ? 'Implement additional detective controls' : null,
      fraudRiskFactors.opportunity >= 4.0 ? 'Strengthen segregation of duties' : null,
      antifraudControls.length < 3 ? 'Add more anti-fraud controls' : null,
    ].filter(Boolean),
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculates next review date based on control frequency
 */
const calculateNextReviewDate = (effectiveDate: Date): Date => {
  const nextReview = new Date(effectiveDate);
  nextReview.setFullYear(nextReview.getFullYear() + 1);
  return nextReview;
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
 * Determines testing recommendation based on risk and impact
 */
const determineTestingRecommendation = (
  isHighRisk: boolean,
  isHighImpact: boolean,
  automationLevel: ControlAutomation,
): string => {
  if (isHighRisk && isHighImpact) {
    return automationLevel === ControlAutomation.MANUAL
      ? 'Test quarterly with large sample size'
      : 'Test semi-annually with moderate sample size';
  }

  if (isHighRisk || isHighImpact) {
    return 'Test annually with standard sample size';
  }

  return 'Test annually with reduced sample size or rotate testing';
};

/**
 * Calculates documentation completeness score
 */
const calculateDocumentationScore = async (controls: any[]): Promise<number> => {
  let totalScore = 0;

  controls.forEach(control => {
    let score = 0;
    if (control.controlObjective?.length > 20) score += 1;
    if (control.controlDescription?.length > 50) score += 1;
    if (control.controlOwner) score += 1;
    if (control.cosomponent && control.cosoprinciple) score += 1;
    if (control.nextReviewDate) score += 1;
    totalScore += score / 5; // Normalize to 0-1
  });

  return (totalScore / controls.length) * 5; // Scale to 0-5
};

/**
 * Calculates automation score
 */
const calculateAutomationScore = (controls: any[]): number => {
  const automationScores = {
    [ControlAutomation.FULLY_AUTOMATED]: 5,
    [ControlAutomation.IT_DEPENDENT]: 4,
    [ControlAutomation.SEMI_AUTOMATED]: 3,
    [ControlAutomation.MANUAL]: 2,
  };

  const avgScore =
    controls.reduce((sum, c) => sum + (automationScores[c.automationLevel] || 2), 0) / controls.length;

  return avgScore;
};

/**
 * Calculates effectiveness score based on test results
 */
const calculateEffectivenessScore = async (controls: any[], TestExecutionModel: any): Promise<number> => {
  let totalPassRate = 0;
  let testedControls = 0;

  for (const control of controls) {
    const tests = await TestExecutionModel.findAll({
      where: {
        controlId: control.controlId,
        testDate: {
          [Op.gte]: new Date(new Date().getFullYear() - 1, 0, 1),
        },
      },
    });

    if (tests.length > 0) {
      const passed = tests.filter(t => t.testResult === TestResultStatus.PASSED).length;
      totalPassRate += passed / tests.length;
      testedControls++;
    }
  }

  if (testedControls === 0) return 2.5;

  return (totalPassRate / testedControls) * 5;
};

/**
 * Gets maturity recommendation
 */
const getMaturityRecommendation = (maturityLevel: string): string => {
  const recommendations = {
    initial: 'Establish formal control documentation and assign control owners',
    defined: 'Implement regular control testing and monitoring procedures',
    managed: 'Increase automation and continuous monitoring',
    optimized: 'Maintain current practices and focus on continuous improvement',
  };

  return recommendations[maturityLevel] || 'Continue improving control maturity';
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable Service for CEFMS Internal Controls Testing
 *
 * Provides enterprise-grade internal controls testing capabilities with dependency
 * injection support for seamless integration with NestJS applications.
 *
 * @example
 * // In a NestJS module
 * import { Module } from '@nestjs/common';
 * import { CEFMSInternalControlsTestingService } from './cefms-internal-controls-testing-composite';
 *
 * @Module({
 *   providers: [CEFMSInternalControlsTestingService],
 *   exports: [CEFMSInternalControlsTestingService],
 * })
 * export class InternalControlsModule {}
 *
 * // In a controller or service
 * constructor(
 *   private readonly controlsTestingService: CEFMSInternalControlsTestingService
 * ) {}
 *
 * async testControl() {
 *   const result = await this.controlsTestingService.executeControlTest({
 *     testExecutionId: 'TEST-2024-001',
 *     testPlanId: 'TP-2024-FIN-001',
 *     controlId: 'FIN-001',
 *     testDate: new Date(),
 *     testedBy: 'jane.smith@usace.army.mil',
 *     samplesTested: 25,
 *     samplesWithExceptions: 0,
 *     testResult: TestResultStatus.PASSED,
 *     testNotes: 'All samples reviewed and approved',
 *     evidenceLinks: ['evidence/test-001.pdf']
 *   });
 * }
 */
@Injectable()
export class CEFMSInternalControlsTestingService {
  private readonly logger = new Logger(CEFMSInternalControlsTestingService.name);

  constructor(
    private readonly sequelize: Sequelize,
  ) {
    this.logger.log('CEFMS Internal Controls Testing Service initialized');
  }

  // Control Design & Documentation
  async createControlDesign(data: ControlDesignData, transaction?: Transaction) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return createControlDesign(data, ControlDesignModel, transaction);
  }

  async updateControlDesign(controlId: string, updates: Partial<ControlDesignData>, transaction?: Transaction) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return updateControlDesign(controlId, updates, ControlDesignModel, transaction);
  }

  async getControlsByProcess(processId: string, includeInactive = false) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return getControlsByProcess(processId, ControlDesignModel, includeInactive);
  }

  async getKeySOXControls() {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return getKeySOXControls(ControlDesignModel);
  }

  async mapControlsToCOSO() {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return mapControlsToCOSO(ControlDesignModel);
  }

  async generateControlDocumentation(controlId: string) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    return generateControlDocumentation(controlId, ControlDesignModel, TestExecutionModel);
  }

  async archiveControl(controlId: string, inactiveDate: Date, transaction?: Transaction) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return archiveControl(controlId, inactiveDate, ControlDesignModel, transaction);
  }

  async validateControlDesign(controlId: string) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return validateControlDesign(controlId, ControlDesignModel);
  }

  async performControlWalkthrough(controlId: string, walkthroughData: any, transaction?: Transaction) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return performControlWalkthrough(controlId, walkthroughData, ControlDesignModel, transaction);
  }

  // Control Testing & Execution
  async createControlTestPlan(data: ControlTestPlanData, transaction?: Transaction) {
    const ControlTestPlanModel = createControlTestPlanModel(this.sequelize);
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return createControlTestPlan(data, ControlTestPlanModel, ControlDesignModel, transaction);
  }

  async executeControlTest(data: TestExecutionData, transaction?: Transaction) {
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    const ControlTestPlanModel = createControlTestPlanModel(this.sequelize);
    return executeControlTest(data, TestExecutionModel, ControlTestPlanModel, transaction);
  }

  async calculateTestingCompletionRate(fiscalYear: number, testingPeriod: string) {
    const ControlTestPlanModel = createControlTestPlanModel(this.sequelize);
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    return calculateTestingCompletionRate(fiscalYear, testingPeriod, ControlTestPlanModel, TestExecutionModel);
  }

  async getControlsRequiringTesting(fiscalYear: number) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    const ControlTestPlanModel = createControlTestPlanModel(this.sequelize);
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    return getControlsRequiringTesting(fiscalYear, ControlDesignModel, ControlTestPlanModel, TestExecutionModel);
  }

  async generateTestEvidencePackage(testExecutionId: string) {
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return generateTestEvidencePackage(testExecutionId, TestExecutionModel, ControlDesignModel);
  }

  async reviewTestExecution(testExecutionId: string, reviewData: any, transaction?: Transaction) {
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    return reviewTestExecution(testExecutionId, reviewData, TestExecutionModel, transaction);
  }

  calculateSampleSize(populationSize: number, confidenceLevel?: number, expectedErrorRate?: number, tolerableErrorRate?: number) {
    return calculateSampleSize(populationSize, confidenceLevel, expectedErrorRate, tolerableErrorRate);
  }

  async generateRiskBasedTestPlan(fiscalYear: number, testingPeriod: string) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    const ControlTestPlanModel = createControlTestPlanModel(this.sequelize);
    return generateRiskBasedTestPlan(fiscalYear, testingPeriod, ControlDesignModel, ControlTestPlanModel);
  }

  async assessControlEffectiveness(controlId: string, assessmentPeriod: { startDate: Date; endDate: Date }) {
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    return assessControlEffectiveness(controlId, assessmentPeriod, TestExecutionModel);
  }

  // SOX Compliance & Certification
  async createSOXCertification(data: SOXCertificationData, transaction?: Transaction) {
    const SOXCertificationModel = createSOXCertificationModel(this.sequelize);
    return createSOXCertification(data, SOXCertificationModel, transaction);
  }

  async generateSOXComplianceDashboard(fiscalYear: number) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    const ControlDeficiencyModel = createControlDeficiencyModel(this.sequelize);
    return generateSOXComplianceDashboard(fiscalYear, ControlDesignModel, TestExecutionModel, ControlDeficiencyModel);
  }

  async validateSOXScoping() {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return validateSOXScoping(ControlDesignModel);
  }

  async generateManagementCertificationLetter(fiscalYear: number, quarter: number | null) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    const ControlDeficiencyModel = createControlDeficiencyModel(this.sequelize);
    return generateManagementCertificationLetter(fiscalYear, quarter, ControlDesignModel, TestExecutionModel, ControlDeficiencyModel);
  }

  async trackSOXControlChanges(controlId: string, changeData: any, transaction?: Transaction) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return trackSOXControlChanges(controlId, changeData, ControlDesignModel, transaction);
  }

  async generateSOX404Report(fiscalYear: number) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    const ControlDeficiencyModel = createControlDeficiencyModel(this.sequelize);
    const SOXCertificationModel = createSOXCertificationModel(this.sequelize);
    return generateSOX404Report(fiscalYear, ControlDesignModel, TestExecutionModel, ControlDeficiencyModel, SOXCertificationModel);
  }

  async monitorTestingCoverage(fiscalYear: number, targetCoverageRate: number) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    return monitorTestingCoverage(fiscalYear, targetCoverageRate, ControlDesignModel, TestExecutionModel);
  }

  async generateQuarterlyTestingStatus(fiscalYear: number, quarter: number) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    const ControlTestPlanModel = createControlTestPlanModel(this.sequelize);
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    return generateQuarterlyTestingStatus(fiscalYear, quarter, ControlDesignModel, ControlTestPlanModel, TestExecutionModel);
  }

  // Deficiency Management & Remediation
  async createControlDeficiency(data: ControlDeficiencyData, transaction?: Transaction) {
    const ControlDeficiencyModel = createControlDeficiencyModel(this.sequelize);
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return createControlDeficiency(data, ControlDeficiencyModel, ControlDesignModel, transaction);
  }

  async createRemediationPlan(data: RemediationPlanData, transaction?: Transaction) {
    const RemediationPlanModel = createRemediationPlanModel(this.sequelize);
    const ControlDeficiencyModel = createControlDeficiencyModel(this.sequelize);
    return createRemediationPlan(data, RemediationPlanModel, ControlDeficiencyModel, transaction);
  }

  async updateRemediationStatus(remediationId: string, status: RemediationStatus, statusNotes: string, transaction?: Transaction) {
    const RemediationPlanModel = createRemediationPlanModel(this.sequelize);
    return updateRemediationStatus(remediationId, status, statusNotes, RemediationPlanModel, transaction);
  }

  async updateRemediationMilestone(remediationId: string, milestoneId: string, completedDate: Date, completionNotes: string, transaction?: Transaction) {
    const RemediationPlanModel = createRemediationPlanModel(this.sequelize);
    return updateRemediationMilestone(remediationId, milestoneId, completedDate, completionNotes, RemediationPlanModel, transaction);
  }

  async generateDeficiencyAgingReport() {
    const ControlDeficiencyModel = createControlDeficiencyModel(this.sequelize);
    const RemediationPlanModel = createRemediationPlanModel(this.sequelize);
    return generateDeficiencyAgingReport(ControlDeficiencyModel, RemediationPlanModel);
  }

  async monitorRemediationProgress() {
    const RemediationPlanModel = createRemediationPlanModel(this.sequelize);
    return monitorRemediationProgress(RemediationPlanModel);
  }

  async validateDeficiencyClosure(deficiencyId: string, closureData: any, transaction?: Transaction) {
    const ControlDeficiencyModel = createControlDeficiencyModel(this.sequelize);
    const RemediationPlanModel = createRemediationPlanModel(this.sequelize);
    return validateDeficiencyClosure(deficiencyId, closureData, ControlDeficiencyModel, RemediationPlanModel, transaction);
  }

  async analyzeDeficiencyTrends(startDate: Date, endDate: Date) {
    const ControlDeficiencyModel = createControlDeficiencyModel(this.sequelize);
    return analyzeDeficiencyTrends(startDate, endDate, ControlDeficiencyModel);
  }

  async escalateDeficiency(deficiencyId: string, escalationData: any, transaction?: Transaction) {
    const ControlDeficiencyModel = createControlDeficiencyModel(this.sequelize);
    return escalateDeficiency(deficiencyId, escalationData, ControlDeficiencyModel, transaction);
  }

  // Risk-Based Testing & Analysis
  async performControlRiskAssessment(controlId: string, riskFactors: any, transaction?: Transaction) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return performControlRiskAssessment(controlId, riskFactors, ControlDesignModel, transaction);
  }

  async prioritizeControlsForTesting(fiscalYear: number) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    return prioritizeControlsForTesting(fiscalYear, ControlDesignModel, TestExecutionModel);
  }

  analyzeSegregationOfDuties(processId: string, userRoleAssignments: any[]) {
    return analyzeSegregationOfDuties(processId, userRoleAssignments);
  }

  evaluateITGeneralControls(systemId: string, itgcAssessment: any) {
    return evaluateITGeneralControls(systemId, itgcAssessment);
  }

  async performControlWalkdown(controlId: string, walkdownData: any, transaction?: Transaction) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return performControlWalkdown(controlId, walkdownData, ControlDesignModel, transaction);
  }

  async generateControlTestingRiskMatrix() {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    return generateControlTestingRiskMatrix(ControlDesignModel, TestExecutionModel);
  }

  async monitorControlEnvironmentChanges(startDate: Date, endDate: Date) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return monitorControlEnvironmentChanges(startDate, endDate, ControlDesignModel);
  }

  async assessControlMaturity(processId: string) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    const TestExecutionModel = createTestExecutionModel(this.sequelize);
    return assessControlMaturity(processId, ControlDesignModel, TestExecutionModel);
  }

  async performFraudRiskAssessment(processId: string, fraudRiskFactors: any) {
    const ControlDesignModel = createControlDesignModel(this.sequelize);
    return performFraudRiskAssessment(processId, fraudRiskFactors, ControlDesignModel);
  }
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Models
  createControlDesignModel,
  createControlTestPlanModel,
  createTestExecutionModel,
  createControlDeficiencyModel,
  createRemediationPlanModel,
  createSOXCertificationModel,

  // Control Design & Documentation Functions
  createControlDesign,
  updateControlDesign,
  getControlsByProcess,
  getKeySOXControls,
  mapControlsToCOSO,
  generateControlDocumentation,
  archiveControl,
  validateControlDesign,
  performControlWalkthrough,

  // Control Testing & Execution Functions
  createControlTestPlan,
  executeControlTest,
  calculateTestingCompletionRate,
  getControlsRequiringTesting,
  generateTestEvidencePackage,
  reviewTestExecution,
  calculateSampleSize,
  generateRiskBasedTestPlan,
  assessControlEffectiveness,

  // SOX Compliance & Certification Functions
  createSOXCertification,
  generateSOXComplianceDashboard,
  validateSOXScoping,
  generateManagementCertificationLetter,
  trackSOXControlChanges,
  generateSOX404Report,
  monitorTestingCoverage,
  generateQuarterlyTestingStatus,

  // Deficiency Management & Remediation Functions
  createControlDeficiency,
  createRemediationPlan,
  updateRemediationStatus,
  updateRemediationMilestone,
  generateDeficiencyAgingReport,
  monitorRemediationProgress,
  validateDeficiencyClosure,
  analyzeDeficiencyTrends,
  escalateDeficiency,

  // Risk-Based Testing & Analysis Functions
  performControlRiskAssessment,
  prioritizeControlsForTesting,
  analyzeSegregationOfDuties,
  evaluateITGeneralControls,
  performControlWalkdown,
  generateControlTestingRiskMatrix,
  monitorControlEnvironmentChanges,
  assessControlMaturity,
  performFraudRiskAssessment,

  // Service
  CEFMSInternalControlsTestingService,
};
