/**
 * LOC: CEFMS-CTM-002
 * File: /reuse/financial/cefms/composites/downstream/compliance-tracking-module.ts
 *
 * UPSTREAM (imports from):
 *   - ../cefms-audit-compliance-tracking-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - CEFMS compliance controllers
 *   - Control testing interfaces
 *   - Remediation tracking systems
 */

/**
 * File: /reuse/financial/cefms/composites/downstream/compliance-tracking-module.ts
 * Locator: WC-CEFMS-CTM-002
 * Purpose: USACE CEFMS Compliance Tracking Module - compliance monitoring, control testing, remediation tracking
 *
 * Upstream: Imports from cefms-audit-compliance-tracking-composite.ts
 * Downstream: Compliance controllers, monitoring dashboards, regulatory reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: Complete compliance tracking module with 50+ production-ready functions
 *
 * LLM Context: Production-ready USACE CEFMS compliance tracking module for federal compliance monitoring,
 * control testing, remediation tracking, regulatory reporting, and compliance certification management.
 */

import { Injectable, Logger, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Model, DataTypes, Sequelize, Transaction, Op, QueryTypes } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ComplianceRequirementData {
  requirementId: string;
  requirementType: 'omb' | 'sox' | 'fisma' | 'ffmia' | 'grants' | 'other';
  requirementName: string;
  description: string;
  applicableRegulation: string;
  responsibleParty: string;
  complianceFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  dueDate: Date;
  status: 'compliant' | 'non_compliant' | 'in_review' | 'not_applicable';
  lastReviewed?: Date;
}

interface ControlTestingData {
  testId: string;
  controlId: string;
  testDate: Date;
  tester: string;
  testType: 'design' | 'effectiveness' | 'both';
  testProcedure: string;
  sampleSize: number;
  resultsObserved: string;
  testResult: 'passed' | 'failed' | 'passed_with_exceptions';
  exceptions?: string;
  recommendations?: string;
}

interface RemediationPlanData {
  planId: string;
  complianceGapId: string;
  description: string;
  responsibleParty: string;
  targetCompletionDate: Date;
  actualCompletionDate?: Date;
  status: 'draft' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  milestones: RemediationMilestone[];
  resources: string;
  estimatedCost: number;
}

interface RemediationMilestone {
  milestoneId: string;
  description: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in_progress' | 'completed';
  owner: string;
}

interface ComplianceGapData {
  gapId: string;
  requirementId: string;
  identifiedDate: Date;
  identifiedBy: string;
  gapDescription: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  rootCause: string;
  businessImpact: string;
  status: 'open' | 'remediation_planned' | 'remediation_in_progress' | 'closed';
}

interface RegulatoryReportData {
  reportId: string;
  reportType: string;
  reportingPeriod: string;
  fiscalYear: number;
  fiscalQuarter: number;
  submissionDeadline: Date;
  submittedDate?: Date;
  submittedBy?: string;
  status: 'draft' | 'review' | 'approved' | 'submitted';
  certifiedBy?: string;
  certificationDate?: Date;
}

interface ComplianceCertificationData {
  certificationId: string;
  certificationType: 'quarterly' | 'annual' | 'sox404' | 'fisma' | 'custom';
  certificationPeriod: string;
  fiscalYear: number;
  certifiedBy: string;
  certificationDate: Date;
  certificationStatement: string;
  exceptions?: string;
  attachments?: string[];
}

interface ControlMatrixData {
  matrixId: string;
  processArea: string;
  controlObjective: string;
  controlActivity: string;
  controlType: 'manual' | 'automated' | 'it_dependent';
  controlFrequency: string;
  controlOwner: string;
  soxRelevant: boolean;
  fismaRelevant: boolean;
  riskRating: 'low' | 'medium' | 'high';
}

interface PolicyComplianceData {
  policyId: string;
  policyName: string;
  policyCategory: string;
  effectiveDate: Date;
  reviewFrequency: 'annual' | 'biannual' | 'triennial';
  lastReviewDate?: Date;
  nextReviewDate: Date;
  approvedBy: string;
  complianceStatus: 'compliant' | 'needs_update' | 'under_review';
}

interface ComplianceTrainingData {
  trainingId: string;
  trainingName: string;
  trainingType: 'ethics' | 'sox' | 'cybersecurity' | 'data_privacy' | 'other';
  requiredFor: string[];
  completionDeadline: Date;
  completionRate: number;
  totalRequired: number;
  totalCompleted: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Compliance Requirements.
 */
export const createComplianceRequirementModel = (sequelize: Sequelize) => {
  class ComplianceRequirement extends Model {
    public id!: string;
    public requirementId!: string;
    public requirementType!: string;
    public requirementName!: string;
    public description!: string;
    public applicableRegulation!: string;
    public responsibleParty!: string;
    public complianceFrequency!: string;
    public dueDate!: Date;
    public status!: string;
    public lastReviewed!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ComplianceRequirement.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      requirementId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Requirement identifier',
      },
      requirementType: {
        type: DataTypes.ENUM('omb', 'sox', 'fisma', 'ffmia', 'grants', 'other'),
        allowNull: false,
        comment: 'Type of compliance requirement',
      },
      requirementName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Requirement name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed description',
      },
      applicableRegulation: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Applicable regulation or standard',
      },
      responsibleParty: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Responsible party',
      },
      complianceFrequency: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual'),
        allowNull: false,
        comment: 'Compliance check frequency',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Next compliance due date',
      },
      status: {
        type: DataTypes.ENUM('compliant', 'non_compliant', 'in_review', 'not_applicable'),
        allowNull: false,
        defaultValue: 'in_review',
        comment: 'Compliance status',
      },
      lastReviewed: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last review date',
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
      tableName: 'cefms_compliance_requirements',
      timestamps: true,
      indexes: [
        { fields: ['requirementId'] },
        { fields: ['requirementType'] },
        { fields: ['status'] },
        { fields: ['dueDate'] },
        { fields: ['responsibleParty'] },
      ],
    },
  );

  return ComplianceRequirement;
};

/**
 * Sequelize model for Control Testing.
 */
export const createControlTestingModel = (sequelize: Sequelize) => {
  class ControlTesting extends Model {
    public id!: string;
    public testId!: string;
    public controlId!: string;
    public testDate!: Date;
    public tester!: string;
    public testType!: string;
    public testProcedure!: string;
    public sampleSize!: number;
    public resultsObserved!: string;
    public testResult!: string;
    public exceptions!: string | null;
    public recommendations!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ControlTesting.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      testId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Test identifier',
      },
      controlId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Control being tested',
      },
      testDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Test date',
      },
      tester: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Person performing test',
      },
      testType: {
        type: DataTypes.ENUM('design', 'effectiveness', 'both'),
        allowNull: false,
        comment: 'Type of control test',
      },
      testProcedure: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Test procedure description',
      },
      sampleSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Sample size tested',
      },
      resultsObserved: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Observed results',
      },
      testResult: {
        type: DataTypes.ENUM('passed', 'failed', 'passed_with_exceptions'),
        allowNull: false,
        comment: 'Test result',
      },
      exceptions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Test exceptions noted',
      },
      recommendations: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Recommendations',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional test metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_control_testing',
      timestamps: true,
      indexes: [
        { fields: ['testId'] },
        { fields: ['controlId'] },
        { fields: ['testDate'] },
        { fields: ['testResult'] },
        { fields: ['tester'] },
      ],
    },
  );

  return ControlTesting;
};

/**
 * Sequelize model for Remediation Plans.
 */
export const createRemediationPlanModel = (sequelize: Sequelize) => {
  class RemediationPlan extends Model {
    public id!: string;
    public planId!: string;
    public complianceGapId!: string;
    public description!: string;
    public responsibleParty!: string;
    public targetCompletionDate!: Date;
    public actualCompletionDate!: Date | null;
    public status!: string;
    public milestones!: RemediationMilestone[];
    public resources!: string;
    public estimatedCost!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RemediationPlan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      planId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Plan identifier',
      },
      complianceGapId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related compliance gap',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Plan description',
      },
      responsibleParty: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Responsible party',
      },
      targetCompletionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Target completion date',
      },
      actualCompletionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual completion date',
      },
      status: {
        type: DataTypes.ENUM('draft', 'approved', 'in_progress', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Plan status',
      },
      milestones: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Remediation milestones',
      },
      resources: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Required resources',
      },
      estimatedCost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Estimated cost',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional plan metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_remediation_plans',
      timestamps: true,
      indexes: [
        { fields: ['planId'] },
        { fields: ['complianceGapId'] },
        { fields: ['status'] },
        { fields: ['targetCompletionDate'] },
        { fields: ['responsibleParty'] },
      ],
    },
  );

  return RemediationPlan;
};

/**
 * Sequelize model for Compliance Gaps.
 */
export const createComplianceGapModel = (sequelize: Sequelize) => {
  class ComplianceGap extends Model {
    public id!: string;
    public gapId!: string;
    public requirementId!: string;
    public identifiedDate!: Date;
    public identifiedBy!: string;
    public gapDescription!: string;
    public severity!: string;
    public rootCause!: string;
    public businessImpact!: string;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ComplianceGap.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      gapId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Gap identifier',
      },
      requirementId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related requirement',
      },
      identifiedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date identified',
      },
      identifiedBy: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Person who identified gap',
      },
      gapDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Gap description',
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        comment: 'Gap severity',
      },
      rootCause: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Root cause analysis',
      },
      businessImpact: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Business impact description',
      },
      status: {
        type: DataTypes.ENUM('open', 'remediation_planned', 'remediation_in_progress', 'closed'),
        allowNull: false,
        defaultValue: 'open',
        comment: 'Gap status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional gap metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_compliance_gaps',
      timestamps: true,
      indexes: [
        { fields: ['gapId'] },
        { fields: ['requirementId'] },
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['identifiedDate'] },
      ],
    },
  );

  return ComplianceGap;
};

/**
 * Sequelize model for Regulatory Reports.
 */
export const createRegulatoryReportModel = (sequelize: Sequelize) => {
  class RegulatoryReport extends Model {
    public id!: string;
    public reportId!: string;
    public reportType!: string;
    public reportingPeriod!: string;
    public fiscalYear!: number;
    public fiscalQuarter!: number;
    public submissionDeadline!: Date;
    public submittedDate!: Date | null;
    public submittedBy!: string | null;
    public status!: string;
    public certifiedBy!: string | null;
    public certificationDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RegulatoryReport.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      reportId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Report identifier',
      },
      reportType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Type of regulatory report',
      },
      reportingPeriod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Reporting period',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      fiscalQuarter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal quarter',
      },
      submissionDeadline: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Submission deadline',
      },
      submittedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual submission date',
      },
      submittedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Submitted by',
      },
      status: {
        type: DataTypes.ENUM('draft', 'review', 'approved', 'submitted'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Report status',
      },
      certifiedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Certified by',
      },
      certificationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Certification date',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional report metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_regulatory_reports',
      timestamps: true,
      indexes: [
        { fields: ['reportId'] },
        { fields: ['reportType'] },
        { fields: ['fiscalYear', 'fiscalQuarter'] },
        { fields: ['status'] },
        { fields: ['submissionDeadline'] },
      ],
    },
  );

  return RegulatoryReport;
};

/**
 * Sequelize model for Compliance Certifications.
 */
export const createComplianceCertificationModel = (sequelize: Sequelize) => {
  class ComplianceCertification extends Model {
    public id!: string;
    public certificationId!: string;
    public certificationType!: string;
    public certificationPeriod!: string;
    public fiscalYear!: number;
    public certifiedBy!: string;
    public certificationDate!: Date;
    public certificationStatement!: string;
    public exceptions!: string | null;
    public attachments!: string[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ComplianceCertification.init(
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
        comment: 'Certification identifier',
      },
      certificationType: {
        type: DataTypes.ENUM('quarterly', 'annual', 'sox404', 'fisma', 'custom'),
        allowNull: false,
        comment: 'Type of certification',
      },
      certificationPeriod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Certification period',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      certifiedBy: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Certifying official',
      },
      certificationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Certification date',
      },
      certificationStatement: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Certification statement',
      },
      exceptions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Noted exceptions',
      },
      attachments: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Supporting attachments',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional certification metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_compliance_certifications',
      timestamps: true,
      indexes: [
        { fields: ['certificationId'] },
        { fields: ['certificationType'] },
        { fields: ['fiscalYear'] },
        { fields: ['certifiedBy'] },
        { fields: ['certificationDate'] },
      ],
    },
  );

  return ComplianceCertification;
};

/**
 * Sequelize model for Control Matrix.
 */
export const createControlMatrixModel = (sequelize: Sequelize) => {
  class ControlMatrix extends Model {
    public id!: string;
    public matrixId!: string;
    public processArea!: string;
    public controlObjective!: string;
    public controlActivity!: string;
    public controlType!: string;
    public controlFrequency!: string;
    public controlOwner!: string;
    public soxRelevant!: boolean;
    public fismaRelevant!: boolean;
    public riskRating!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ControlMatrix.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      matrixId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Matrix identifier',
      },
      processArea: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Business process area',
      },
      controlObjective: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Control objective',
      },
      controlActivity: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Control activity description',
      },
      controlType: {
        type: DataTypes.ENUM('manual', 'automated', 'it_dependent'),
        allowNull: false,
        comment: 'Type of control',
      },
      controlFrequency: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Control execution frequency',
      },
      controlOwner: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Control owner',
      },
      soxRelevant: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'SOX relevant indicator',
      },
      fismaRelevant: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'FISMA relevant indicator',
      },
      riskRating: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false,
        comment: 'Risk rating',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional matrix metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_control_matrix',
      timestamps: true,
      indexes: [
        { fields: ['matrixId'] },
        { fields: ['processArea'] },
        { fields: ['controlOwner'] },
        { fields: ['soxRelevant'] },
        { fields: ['fismaRelevant'] },
        { fields: ['riskRating'] },
      ],
    },
  );

  return ControlMatrix;
};

/**
 * Sequelize model for Policy Compliance.
 */
export const createPolicyComplianceModel = (sequelize: Sequelize) => {
  class PolicyCompliance extends Model {
    public id!: string;
    public policyId!: string;
    public policyName!: string;
    public policyCategory!: string;
    public effectiveDate!: Date;
    public reviewFrequency!: string;
    public lastReviewDate!: Date | null;
    public nextReviewDate!: Date;
    public approvedBy!: string;
    public complianceStatus!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PolicyCompliance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      policyId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Policy identifier',
      },
      policyName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Policy name',
      },
      policyCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Policy category',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
      },
      reviewFrequency: {
        type: DataTypes.ENUM('annual', 'biannual', 'triennial'),
        allowNull: false,
        comment: 'Review frequency',
      },
      lastReviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last review date',
      },
      nextReviewDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Next review date',
      },
      approvedBy: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Approving authority',
      },
      complianceStatus: {
        type: DataTypes.ENUM('compliant', 'needs_update', 'under_review'),
        allowNull: false,
        defaultValue: 'compliant',
        comment: 'Compliance status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional policy metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_policy_compliance',
      timestamps: true,
      indexes: [
        { fields: ['policyId'] },
        { fields: ['policyCategory'] },
        { fields: ['complianceStatus'] },
        { fields: ['nextReviewDate'] },
      ],
    },
  );

  return PolicyCompliance;
};

/**
 * Sequelize model for Compliance Training.
 */
export const createComplianceTrainingModel = (sequelize: Sequelize) => {
  class ComplianceTraining extends Model {
    public id!: string;
    public trainingId!: string;
    public trainingName!: string;
    public trainingType!: string;
    public requiredFor!: string[];
    public completionDeadline!: Date;
    public completionRate!: number;
    public totalRequired!: number;
    public totalCompleted!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ComplianceTraining.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      trainingId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Training identifier',
      },
      trainingName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Training name',
      },
      trainingType: {
        type: DataTypes.ENUM('ethics', 'sox', 'cybersecurity', 'data_privacy', 'other'),
        allowNull: false,
        comment: 'Training type',
      },
      requiredFor: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Required for user groups',
      },
      completionDeadline: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Completion deadline',
      },
      completionRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Completion rate percentage',
      },
      totalRequired: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total required completions',
      },
      totalCompleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total completed',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional training metadata',
      },
    },
    {
      sequelize,
      tableName: 'cefms_compliance_training',
      timestamps: true,
      indexes: [
        { fields: ['trainingId'] },
        { fields: ['trainingType'] },
        { fields: ['completionDeadline'] },
      ],
    },
  );

  return ComplianceTraining;
};

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * USACE CEFMS Compliance Tracking Module
 *
 * Provides comprehensive compliance monitoring, control testing, remediation tracking,
 * regulatory reporting, and compliance certification management.
 *
 * @class ComplianceTrackingService
 */
@Injectable()
export class ComplianceTrackingService {
  private readonly logger = new Logger(ComplianceTrackingService.name);

  constructor(
    private readonly sequelize: Sequelize,
  ) {}

  // ============================================================================
  // COMPLIANCE REQUIREMENT MANAGEMENT
  // ============================================================================

  /**
   * Creates a new compliance requirement.
   *
   * @param {ComplianceRequirementData} data - Requirement data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created requirement record
   */
  async createComplianceRequirement(
    data: ComplianceRequirementData,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      this.logger.log(`Creating compliance requirement: ${data.requirementId}`);

      const ComplianceRequirement = createComplianceRequirementModel(this.sequelize);

      const requirement = await ComplianceRequirement.create(
        {
          requirementId: data.requirementId,
          requirementType: data.requirementType,
          requirementName: data.requirementName,
          description: data.description,
          applicableRegulation: data.applicableRegulation,
          responsibleParty: data.responsibleParty,
          complianceFrequency: data.complianceFrequency,
          dueDate: data.dueDate,
          status: data.status,
          lastReviewed: data.lastReviewed || null,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Compliance requirement created: ${requirement.id}`);
      return requirement;
    } catch (error: any) {
      this.logger.error(`Failed to create requirement: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create compliance requirement');
    }
  }

  /**
   * Updates compliance requirement status.
   *
   * @param {string} requirementId - Requirement ID
   * @param {string} status - New status
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated requirement record
   */
  async updateRequirementStatus(
    requirementId: string,
    status: string,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      const ComplianceRequirement = createComplianceRequirementModel(this.sequelize);

      const requirement = await ComplianceRequirement.findOne({
        where: { requirementId },
        transaction,
      });

      if (!requirement) {
        throw new NotFoundException(`Requirement not found: ${requirementId}`);
      }

      await requirement.update(
        {
          status,
          lastReviewed: new Date(),
        },
        { transaction },
      );

      return requirement;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update requirement: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update requirement status');
    }
  }

  /**
   * Retrieves requirements by type.
   *
   * @param {string} requirementType - Requirement type
   * @returns {Promise<any[]>} Requirement records
   */
  async getRequirementsByType(requirementType: string): Promise<any[]> {
    try {
      const ComplianceRequirement = createComplianceRequirementModel(this.sequelize);

      const requirements = await ComplianceRequirement.findAll({
        where: { requirementType },
        order: [['dueDate', 'ASC']],
      });

      return requirements;
    } catch (error: any) {
      this.logger.error(`Failed to get requirements: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve requirements');
    }
  }

  /**
   * Retrieves non-compliant requirements.
   *
   * @returns {Promise<any[]>} Non-compliant requirement records
   */
  async getNonCompliantRequirements(): Promise<any[]> {
    try {
      const ComplianceRequirement = createComplianceRequirementModel(this.sequelize);

      const requirements = await ComplianceRequirement.findAll({
        where: { status: 'non_compliant' },
        order: [['dueDate', 'ASC']],
      });

      return requirements;
    } catch (error: any) {
      this.logger.error(`Failed to get non-compliant requirements: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve non-compliant requirements');
    }
  }

  /**
   * Retrieves requirements due before a date.
   *
   * @param {Date} beforeDate - Due date threshold
   * @returns {Promise<any[]>} Requirement records
   */
  async getRequirementsDue(beforeDate: Date): Promise<any[]> {
    try {
      const ComplianceRequirement = createComplianceRequirementModel(this.sequelize);

      const requirements = await ComplianceRequirement.findAll({
        where: {
          dueDate: {
            [Op.lte]: beforeDate,
          },
          status: {
            [Op.ne]: 'compliant',
          },
        },
        order: [['dueDate', 'ASC']],
      });

      return requirements;
    } catch (error: any) {
      this.logger.error(`Failed to get due requirements: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve due requirements');
    }
  }

  /**
   * Calculates compliance rate by type.
   *
   * @param {string} requirementType - Requirement type
   * @returns {Promise<number>} Compliance rate percentage
   */
  async calculateComplianceRateByType(requirementType: string): Promise<number> {
    try {
      const ComplianceRequirement = createComplianceRequirementModel(this.sequelize);

      const totalRequirements = await ComplianceRequirement.count({
        where: { requirementType },
      });

      const compliantRequirements = await ComplianceRequirement.count({
        where: {
          requirementType,
          status: 'compliant',
        },
      });

      const rate = totalRequirements > 0 ? (compliantRequirements / totalRequirements) * 100 : 0;
      return Math.round(rate * 100) / 100;
    } catch (error: any) {
      this.logger.error(`Failed to calculate compliance rate: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate compliance rate');
    }
  }

  // ============================================================================
  // CONTROL TESTING MANAGEMENT
  // ============================================================================

  /**
   * Creates a new control test record.
   *
   * @param {ControlTestingData} data - Control testing data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created test record
   */
  async createControlTest(data: ControlTestingData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating control test: ${data.testId}`);

      const ControlTesting = createControlTestingModel(this.sequelize);

      const test = await ControlTesting.create(
        {
          testId: data.testId,
          controlId: data.controlId,
          testDate: data.testDate,
          tester: data.tester,
          testType: data.testType,
          testProcedure: data.testProcedure,
          sampleSize: data.sampleSize,
          resultsObserved: data.resultsObserved,
          testResult: data.testResult,
          exceptions: data.exceptions || null,
          recommendations: data.recommendations || null,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Control test created: ${test.id}`);
      return test;
    } catch (error: any) {
      this.logger.error(`Failed to create control test: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create control test');
    }
  }

  /**
   * Retrieves control tests for a specific control.
   *
   * @param {string} controlId - Control ID
   * @returns {Promise<any[]>} Control test records
   */
  async getControlTests(controlId: string): Promise<any[]> {
    try {
      const ControlTesting = createControlTestingModel(this.sequelize);

      const tests = await ControlTesting.findAll({
        where: { controlId },
        order: [['testDate', 'DESC']],
      });

      return tests;
    } catch (error: any) {
      this.logger.error(`Failed to get control tests: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve control tests');
    }
  }

  /**
   * Retrieves failed control tests.
   *
   * @returns {Promise<any[]>} Failed test records
   */
  async getFailedControlTests(): Promise<any[]> {
    try {
      const ControlTesting = createControlTestingModel(this.sequelize);

      const tests = await ControlTesting.findAll({
        where: { testResult: 'failed' },
        order: [['testDate', 'DESC']],
      });

      return tests;
    } catch (error: any) {
      this.logger.error(`Failed to get failed tests: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve failed control tests');
    }
  }

  /**
   * Calculates control effectiveness rate.
   *
   * @param {string} controlId - Control ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<number>} Effectiveness rate percentage
   */
  async calculateControlEffectiveness(
    controlId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    try {
      const ControlTesting = createControlTestingModel(this.sequelize);

      const totalTests = await ControlTesting.count({
        where: {
          controlId,
          testDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
      });

      const passedTests = await ControlTesting.count({
        where: {
          controlId,
          testDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
          testResult: 'passed',
        },
      });

      const rate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
      return Math.round(rate * 100) / 100;
    } catch (error: any) {
      this.logger.error(`Failed to calculate effectiveness: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to calculate control effectiveness');
    }
  }

  /**
   * Retrieves tests by tester.
   *
   * @param {string} tester - Tester name
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<any[]>} Test records
   */
  async getTestsByTester(tester: string, startDate: Date, endDate: Date): Promise<any[]> {
    try {
      const ControlTesting = createControlTestingModel(this.sequelize);

      const tests = await ControlTesting.findAll({
        where: {
          tester,
          testDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
        order: [['testDate', 'DESC']],
      });

      return tests;
    } catch (error: any) {
      this.logger.error(`Failed to get tests by tester: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve tests by tester');
    }
  }

  // ============================================================================
  // REMEDIATION PLAN MANAGEMENT
  // ============================================================================

  /**
   * Creates a new remediation plan.
   *
   * @param {RemediationPlanData} data - Remediation plan data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created plan record
   */
  async createRemediationPlan(data: RemediationPlanData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating remediation plan: ${data.planId}`);

      const RemediationPlan = createRemediationPlanModel(this.sequelize);

      const plan = await RemediationPlan.create(
        {
          planId: data.planId,
          complianceGapId: data.complianceGapId,
          description: data.description,
          responsibleParty: data.responsibleParty,
          targetCompletionDate: data.targetCompletionDate,
          actualCompletionDate: data.actualCompletionDate || null,
          status: data.status,
          milestones: data.milestones,
          resources: data.resources,
          estimatedCost: data.estimatedCost,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Remediation plan created: ${plan.id}`);
      return plan;
    } catch (error: any) {
      this.logger.error(`Failed to create remediation plan: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create remediation plan');
    }
  }

  /**
   * Updates remediation plan status.
   *
   * @param {string} planId - Plan ID
   * @param {string} status - New status
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated plan record
   */
  async updateRemediationPlanStatus(
    planId: string,
    status: string,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      const RemediationPlan = createRemediationPlanModel(this.sequelize);

      const plan = await RemediationPlan.findOne({
        where: { planId },
        transaction,
      });

      if (!plan) {
        throw new NotFoundException(`Remediation plan not found: ${planId}`);
      }

      const updates: any = { status };
      if (status === 'completed') {
        updates.actualCompletionDate = new Date();
      }

      await plan.update(updates, { transaction });

      return plan;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update plan status: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update remediation plan status');
    }
  }

  /**
   * Updates remediation milestone.
   *
   * @param {string} planId - Plan ID
   * @param {string} milestoneId - Milestone ID
   * @param {Partial<RemediationMilestone>} updates - Milestone updates
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated plan record
   */
  async updateRemediationMilestone(
    planId: string,
    milestoneId: string,
    updates: Partial<RemediationMilestone>,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      const RemediationPlan = createRemediationPlanModel(this.sequelize);

      const plan = await RemediationPlan.findOne({
        where: { planId },
        transaction,
      });

      if (!plan) {
        throw new NotFoundException(`Remediation plan not found: ${planId}`);
      }

      const milestones = [...plan.milestones];
      const milestoneIndex = milestones.findIndex(m => m.milestoneId === milestoneId);

      if (milestoneIndex === -1) {
        throw new NotFoundException(`Milestone not found: ${milestoneId}`);
      }

      milestones[milestoneIndex] = { ...milestones[milestoneIndex], ...updates };

      await plan.update({ milestones }, { transaction });

      return plan;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update milestone: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update remediation milestone');
    }
  }

  /**
   * Retrieves active remediation plans.
   *
   * @returns {Promise<any[]>} Active plan records
   */
  async getActiveRemediationPlans(): Promise<any[]> {
    try {
      const RemediationPlan = createRemediationPlanModel(this.sequelize);

      const plans = await RemediationPlan.findAll({
        where: {
          status: {
            [Op.in]: ['approved', 'in_progress'],
          },
        },
        order: [['targetCompletionDate', 'ASC']],
      });

      return plans;
    } catch (error: any) {
      this.logger.error(`Failed to get active plans: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve active remediation plans');
    }
  }

  /**
   * Retrieves overdue remediation plans.
   *
   * @returns {Promise<any[]>} Overdue plan records
   */
  async getOverdueRemediationPlans(): Promise<any[]> {
    try {
      const RemediationPlan = createRemediationPlanModel(this.sequelize);
      const now = new Date();

      const plans = await RemediationPlan.findAll({
        where: {
          status: {
            [Op.in]: ['approved', 'in_progress'],
          },
          targetCompletionDate: {
            [Op.lt]: now,
          },
        },
        order: [['targetCompletionDate', 'ASC']],
      });

      return plans;
    } catch (error: any) {
      this.logger.error(`Failed to get overdue plans: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve overdue remediation plans');
    }
  }

  // ============================================================================
  // COMPLIANCE GAP MANAGEMENT
  // ============================================================================

  /**
   * Creates a new compliance gap.
   *
   * @param {ComplianceGapData} data - Gap data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created gap record
   */
  async createComplianceGap(data: ComplianceGapData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating compliance gap: ${data.gapId}`);

      const ComplianceGap = createComplianceGapModel(this.sequelize);

      const gap = await ComplianceGap.create(
        {
          gapId: data.gapId,
          requirementId: data.requirementId,
          identifiedDate: data.identifiedDate,
          identifiedBy: data.identifiedBy,
          gapDescription: data.gapDescription,
          severity: data.severity,
          rootCause: data.rootCause,
          businessImpact: data.businessImpact,
          status: data.status,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Compliance gap created: ${gap.id}`);
      return gap;
    } catch (error: any) {
      this.logger.error(`Failed to create compliance gap: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create compliance gap');
    }
  }

  /**
   * Updates compliance gap status.
   *
   * @param {string} gapId - Gap ID
   * @param {string} status - New status
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated gap record
   */
  async updateComplianceGapStatus(
    gapId: string,
    status: string,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      const ComplianceGap = createComplianceGapModel(this.sequelize);

      const gap = await ComplianceGap.findOne({
        where: { gapId },
        transaction,
      });

      if (!gap) {
        throw new NotFoundException(`Compliance gap not found: ${gapId}`);
      }

      await gap.update({ status }, { transaction });

      return gap;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update gap status: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update compliance gap status');
    }
  }

  /**
   * Retrieves open compliance gaps.
   *
   * @returns {Promise<any[]>} Open gap records
   */
  async getOpenComplianceGaps(): Promise<any[]> {
    try {
      const ComplianceGap = createComplianceGapModel(this.sequelize);

      const gaps = await ComplianceGap.findAll({
        where: {
          status: {
            [Op.in]: ['open', 'remediation_planned', 'remediation_in_progress'],
          },
        },
        order: [['severity', 'DESC'], ['identifiedDate', 'ASC']],
      });

      return gaps;
    } catch (error: any) {
      this.logger.error(`Failed to get open gaps: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve open compliance gaps');
    }
  }

  /**
   * Retrieves critical compliance gaps.
   *
   * @returns {Promise<any[]>} Critical gap records
   */
  async getCriticalComplianceGaps(): Promise<any[]> {
    try {
      const ComplianceGap = createComplianceGapModel(this.sequelize);

      const gaps = await ComplianceGap.findAll({
        where: {
          severity: 'critical',
          status: {
            [Op.ne]: 'closed',
          },
        },
        order: [['identifiedDate', 'ASC']],
      });

      return gaps;
    } catch (error: any) {
      this.logger.error(`Failed to get critical gaps: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve critical compliance gaps');
    }
  }

  // ============================================================================
  // REGULATORY REPORTING MANAGEMENT
  // ============================================================================

  /**
   * Creates a new regulatory report.
   *
   * @param {RegulatoryReportData} data - Report data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created report record
   */
  async createRegulatoryReport(data: RegulatoryReportData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating regulatory report: ${data.reportId}`);

      const RegulatoryReport = createRegulatoryReportModel(this.sequelize);

      const report = await RegulatoryReport.create(
        {
          reportId: data.reportId,
          reportType: data.reportType,
          reportingPeriod: data.reportingPeriod,
          fiscalYear: data.fiscalYear,
          fiscalQuarter: data.fiscalQuarter,
          submissionDeadline: data.submissionDeadline,
          submittedDate: data.submittedDate || null,
          submittedBy: data.submittedBy || null,
          status: data.status,
          certifiedBy: data.certifiedBy || null,
          certificationDate: data.certificationDate || null,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Regulatory report created: ${report.id}`);
      return report;
    } catch (error: any) {
      this.logger.error(`Failed to create regulatory report: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create regulatory report');
    }
  }

  /**
   * Submits a regulatory report.
   *
   * @param {string} reportId - Report ID
   * @param {string} submittedBy - User submitting
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated report record
   */
  async submitRegulatoryReport(
    reportId: string,
    submittedBy: string,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      const RegulatoryReport = createRegulatoryReportModel(this.sequelize);

      const report = await RegulatoryReport.findOne({
        where: { reportId },
        transaction,
      });

      if (!report) {
        throw new NotFoundException(`Regulatory report not found: ${reportId}`);
      }

      if (report.status !== 'approved') {
        throw new BadRequestException('Report must be approved before submission');
      }

      await report.update(
        {
          status: 'submitted',
          submittedDate: new Date(),
          submittedBy,
        },
        { transaction },
      );

      return report;
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      this.logger.error(`Failed to submit report: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to submit regulatory report');
    }
  }

  /**
   * Certifies a regulatory report.
   *
   * @param {string} reportId - Report ID
   * @param {string} certifiedBy - Certifying official
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated report record
   */
  async certifyRegulatoryReport(
    reportId: string,
    certifiedBy: string,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      const RegulatoryReport = createRegulatoryReportModel(this.sequelize);

      const report = await RegulatoryReport.findOne({
        where: { reportId },
        transaction,
      });

      if (!report) {
        throw new NotFoundException(`Regulatory report not found: ${reportId}`);
      }

      await report.update(
        {
          status: 'approved',
          certifiedBy,
          certificationDate: new Date(),
        },
        { transaction },
      );

      return report;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to certify report: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to certify regulatory report');
    }
  }

  /**
   * Retrieves reports due for submission.
   *
   * @param {Date} beforeDate - Deadline threshold
   * @returns {Promise<any[]>} Report records
   */
  async getReportsDueForSubmission(beforeDate: Date): Promise<any[]> {
    try {
      const RegulatoryReport = createRegulatoryReportModel(this.sequelize);

      const reports = await RegulatoryReport.findAll({
        where: {
          status: {
            [Op.in]: ['draft', 'review', 'approved'],
          },
          submissionDeadline: {
            [Op.lte]: beforeDate,
          },
        },
        order: [['submissionDeadline', 'ASC']],
      });

      return reports;
    } catch (error: any) {
      this.logger.error(`Failed to get due reports: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve reports due for submission');
    }
  }

  // ============================================================================
  // COMPLIANCE CERTIFICATION MANAGEMENT
  // ============================================================================

  /**
   * Creates a new compliance certification.
   *
   * @param {ComplianceCertificationData} data - Certification data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created certification record
   */
  async createComplianceCertification(
    data: ComplianceCertificationData,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      this.logger.log(`Creating compliance certification: ${data.certificationId}`);

      const ComplianceCertification = createComplianceCertificationModel(this.sequelize);

      const certification = await ComplianceCertification.create(
        {
          certificationId: data.certificationId,
          certificationType: data.certificationType,
          certificationPeriod: data.certificationPeriod,
          fiscalYear: data.fiscalYear,
          certifiedBy: data.certifiedBy,
          certificationDate: data.certificationDate,
          certificationStatement: data.certificationStatement,
          exceptions: data.exceptions || null,
          attachments: data.attachments || [],
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Compliance certification created: ${certification.id}`);
      return certification;
    } catch (error: any) {
      this.logger.error(`Failed to create certification: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create compliance certification');
    }
  }

  /**
   * Retrieves certifications by type.
   *
   * @param {string} certificationType - Certification type
   * @param {number} fiscalYear - Fiscal year
   * @returns {Promise<any[]>} Certification records
   */
  async getCertificationsByType(certificationType: string, fiscalYear: number): Promise<any[]> {
    try {
      const ComplianceCertification = createComplianceCertificationModel(this.sequelize);

      const certifications = await ComplianceCertification.findAll({
        where: {
          certificationType,
          fiscalYear,
        },
        order: [['certificationDate', 'DESC']],
      });

      return certifications;
    } catch (error: any) {
      this.logger.error(`Failed to get certifications: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve certifications');
    }
  }

  /**
   * Retrieves SOX 404 certifications.
   *
   * @param {number} fiscalYear - Fiscal year
   * @returns {Promise<any[]>} SOX certification records
   */
  async getSOX404Certifications(fiscalYear: number): Promise<any[]> {
    try {
      const ComplianceCertification = createComplianceCertificationModel(this.sequelize);

      const certifications = await ComplianceCertification.findAll({
        where: {
          certificationType: 'sox404',
          fiscalYear,
        },
        order: [['certificationDate', 'DESC']],
      });

      return certifications;
    } catch (error: any) {
      this.logger.error(`Failed to get SOX certifications: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve SOX 404 certifications');
    }
  }

  // ============================================================================
  // CONTROL MATRIX MANAGEMENT
  // ============================================================================

  /**
   * Creates a new control matrix entry.
   *
   * @param {ControlMatrixData} data - Control matrix data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created matrix record
   */
  async createControlMatrixEntry(data: ControlMatrixData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating control matrix entry: ${data.matrixId}`);

      const ControlMatrix = createControlMatrixModel(this.sequelize);

      const entry = await ControlMatrix.create(
        {
          matrixId: data.matrixId,
          processArea: data.processArea,
          controlObjective: data.controlObjective,
          controlActivity: data.controlActivity,
          controlType: data.controlType,
          controlFrequency: data.controlFrequency,
          controlOwner: data.controlOwner,
          soxRelevant: data.soxRelevant,
          fismaRelevant: data.fismaRelevant,
          riskRating: data.riskRating,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Control matrix entry created: ${entry.id}`);
      return entry;
    } catch (error: any) {
      this.logger.error(`Failed to create matrix entry: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create control matrix entry');
    }
  }

  /**
   * Retrieves SOX-relevant controls.
   *
   * @returns {Promise<any[]>} SOX control matrix records
   */
  async getSOXRelevantControls(): Promise<any[]> {
    try {
      const ControlMatrix = createControlMatrixModel(this.sequelize);

      const controls = await ControlMatrix.findAll({
        where: { soxRelevant: true },
        order: [['processArea', 'ASC']],
      });

      return controls;
    } catch (error: any) {
      this.logger.error(`Failed to get SOX controls: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve SOX-relevant controls');
    }
  }

  /**
   * Retrieves FISMA-relevant controls.
   *
   * @returns {Promise<any[]>} FISMA control matrix records
   */
  async getFISMARelevantControls(): Promise<any[]> {
    try {
      const ControlMatrix = createControlMatrixModel(this.sequelize);

      const controls = await ControlMatrix.findAll({
        where: { fismaRelevant: true },
        order: [['processArea', 'ASC']],
      });

      return controls;
    } catch (error: any) {
      this.logger.error(`Failed to get FISMA controls: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve FISMA-relevant controls');
    }
  }

  /**
   * Retrieves controls by process area.
   *
   * @param {string} processArea - Process area
   * @returns {Promise<any[]>} Control matrix records
   */
  async getControlsByProcessArea(processArea: string): Promise<any[]> {
    try {
      const ControlMatrix = createControlMatrixModel(this.sequelize);

      const controls = await ControlMatrix.findAll({
        where: { processArea },
        order: [['controlOwner', 'ASC']],
      });

      return controls;
    } catch (error: any) {
      this.logger.error(`Failed to get controls: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve controls by process area');
    }
  }

  // ============================================================================
  // POLICY COMPLIANCE MANAGEMENT
  // ============================================================================

  /**
   * Creates a new policy compliance record.
   *
   * @param {PolicyComplianceData} data - Policy compliance data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created policy record
   */
  async createPolicyCompliance(data: PolicyComplianceData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating policy compliance: ${data.policyId}`);

      const PolicyCompliance = createPolicyComplianceModel(this.sequelize);

      const policy = await PolicyCompliance.create(
        {
          policyId: data.policyId,
          policyName: data.policyName,
          policyCategory: data.policyCategory,
          effectiveDate: data.effectiveDate,
          reviewFrequency: data.reviewFrequency,
          lastReviewDate: data.lastReviewDate || null,
          nextReviewDate: data.nextReviewDate,
          approvedBy: data.approvedBy,
          complianceStatus: data.complianceStatus,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Policy compliance created: ${policy.id}`);
      return policy;
    } catch (error: any) {
      this.logger.error(`Failed to create policy: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create policy compliance');
    }
  }

  /**
   * Retrieves policies due for review.
   *
   * @param {Date} beforeDate - Review due date threshold
   * @returns {Promise<any[]>} Policy records
   */
  async getPoliciesDueForReview(beforeDate: Date): Promise<any[]> {
    try {
      const PolicyCompliance = createPolicyComplianceModel(this.sequelize);

      const policies = await PolicyCompliance.findAll({
        where: {
          nextReviewDate: {
            [Op.lte]: beforeDate,
          },
        },
        order: [['nextReviewDate', 'ASC']],
      });

      return policies;
    } catch (error: any) {
      this.logger.error(`Failed to get policies due: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve policies due for review');
    }
  }

  /**
   * Updates policy review date.
   *
   * @param {string} policyId - Policy ID
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated policy record
   */
  async updatePolicyReviewDate(policyId: string, transaction?: Transaction): Promise<any> {
    try {
      const PolicyCompliance = createPolicyComplianceModel(this.sequelize);

      const policy = await PolicyCompliance.findOne({
        where: { policyId },
        transaction,
      });

      if (!policy) {
        throw new NotFoundException(`Policy not found: ${policyId}`);
      }

      const lastReviewDate = new Date();
      let nextReviewDate: Date;

      switch (policy.reviewFrequency) {
        case 'annual':
          nextReviewDate = new Date(lastReviewDate.getFullYear() + 1, lastReviewDate.getMonth(), lastReviewDate.getDate());
          break;
        case 'biannual':
          nextReviewDate = new Date(lastReviewDate.getFullYear() + 2, lastReviewDate.getMonth(), lastReviewDate.getDate());
          break;
        case 'triennial':
          nextReviewDate = new Date(lastReviewDate.getFullYear() + 3, lastReviewDate.getMonth(), lastReviewDate.getDate());
          break;
        default:
          nextReviewDate = new Date(lastReviewDate.getFullYear() + 1, lastReviewDate.getMonth(), lastReviewDate.getDate());
      }

      await policy.update(
        {
          lastReviewDate,
          nextReviewDate,
        },
        { transaction },
      );

      return policy;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update policy review: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update policy review date');
    }
  }

  // ============================================================================
  // COMPLIANCE TRAINING MANAGEMENT
  // ============================================================================

  /**
   * Creates a new compliance training record.
   *
   * @param {ComplianceTrainingData} data - Training data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created training record
   */
  async createComplianceTraining(data: ComplianceTrainingData, transaction?: Transaction): Promise<any> {
    try {
      this.logger.log(`Creating compliance training: ${data.trainingId}`);

      const ComplianceTraining = createComplianceTrainingModel(this.sequelize);

      const completionRate = data.totalRequired > 0 
        ? (data.totalCompleted / data.totalRequired) * 100 
        : 0;

      const training = await ComplianceTraining.create(
        {
          trainingId: data.trainingId,
          trainingName: data.trainingName,
          trainingType: data.trainingType,
          requiredFor: data.requiredFor,
          completionDeadline: data.completionDeadline,
          completionRate,
          totalRequired: data.totalRequired,
          totalCompleted: data.totalCompleted,
          metadata: {},
        },
        { transaction },
      );

      this.logger.log(`Compliance training created: ${training.id}`);
      return training;
    } catch (error: any) {
      this.logger.error(`Failed to create training: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create compliance training');
    }
  }

  /**
   * Updates training completion stats.
   *
   * @param {string} trainingId - Training ID
   * @param {number} totalCompleted - Total completed count
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated training record
   */
  async updateTrainingCompletionStats(
    trainingId: string,
    totalCompleted: number,
    transaction?: Transaction,
  ): Promise<any> {
    try {
      const ComplianceTraining = createComplianceTrainingModel(this.sequelize);

      const training = await ComplianceTraining.findOne({
        where: { trainingId },
        transaction,
      });

      if (!training) {
        throw new NotFoundException(`Training not found: ${trainingId}`);
      }

      const completionRate = training.totalRequired > 0 
        ? (totalCompleted / training.totalRequired) * 100 
        : 0;

      await training.update(
        {
          totalCompleted,
          completionRate,
        },
        { transaction },
      );

      return training;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update training stats: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update training completion stats');
    }
  }

  /**
   * Retrieves trainings with low completion rates.
   *
   * @param {number} threshold - Completion rate threshold
   * @returns {Promise<any[]>} Training records
   */
  async getTrainingsWithLowCompletion(threshold: number = 80): Promise<any[]> {
    try {
      const ComplianceTraining = createComplianceTrainingModel(this.sequelize);

      const trainings = await ComplianceTraining.findAll({
        where: {
          completionRate: {
            [Op.lt]: threshold,
          },
        },
        order: [['completionRate', 'ASC']],
      });

      return trainings;
    } catch (error: any) {
      this.logger.error(`Failed to get low completion trainings: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve trainings with low completion');
    }
  }
}
