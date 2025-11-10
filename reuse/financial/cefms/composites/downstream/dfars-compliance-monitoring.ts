/**
 * CEFMS DFARS Compliance Monitoring Service
 *
 * This service provides comprehensive monitoring and compliance tracking for the Defense Federal
 * Acquisition Regulation Supplement (DFARS), cost accounting standards (CAS), and contract audits
 * for the Corps of Engineers Financial Management System (CEFMS).
 *
 * Key Features:
 * - DFARS clause compliance tracking
 * - Cost Accounting Standards (CAS) compliance
 * - Contract audit support and documentation
 * - Buy American Act compliance
 * - Trade Agreements Act compliance
 * - Cybersecurity requirements (DFARS 252.204-7012)
 * - Counterfeit parts prevention
 * - Supply chain traceability
 * - Subcontractor flow-down requirements
 *
 * @module CEFMSDFARSComplianceMonitoringService
 */

import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { Sequelize, DataTypes, Model, Transaction, Op, QueryTypes } from 'sequelize';

/**
 * DFARS clause enumeration
 */
export enum DFARSClause {
  CLAUSE_252_204_7012 = '252.204-7012', // Safeguarding Covered Defense Information
  CLAUSE_252_225_7001 = '252.225-7001', // Buy American and Balance of Payments Program
  CLAUSE_252_225_7021 = '252.225-7021', // Trade Agreements
  CLAUSE_252_246_7007 = '252.246-7007', // Contractor Counterfeit Electronic Part Detection
  CLAUSE_252_246_7008 = '252.246-7008', // Sources of Electronic Parts
  CLAUSE_252_203_7000 = '252.203-7000', // Requirements Relating to Compensation of Former DoD Officials
  CLAUSE_252_203_7002 = '252.203-7002', // Requirement to Inform Employees of Whistleblower Rights
  CLAUSE_252_204_7008 = '252.204-7008', // Compliance with Safeguarding Covered Defense Information Controls
  CLAUSE_252_204_7009 = '252.204-7009', // Limitations on the Use or Disclosure of Third-Party Contractor Reported Cyber Incident Information
  CLAUSE_252_204_7015 = '252.204-7015', // Notice of Authorized Disclosure of Information for Litigation Support
  CLAUSE_252_223_7008 = '252.223-7008', // Prohibition of Hexavalent Chromium
  CLAUSE_252_225_7048 = '252.225-7048', // Export-Controlled Items
  CLAUSE_252_227_7013 = '252.227-7013', // Rights in Technical Data--Noncommercial Items
  CLAUSE_252_227_7014 = '252.227-7014', // Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation
  CLAUSE_252_227_7015 = '252.227-7015', // Technical Data--Commercial Items
  CLAUSE_252_227_7037 = '252.227-7037', // Validation of Restrictive Markings on Technical Data
}

/**
 * Compliance status enumeration
 */
export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  CONDITIONALLY_COMPLIANT = 'CONDITIONALLY_COMPLIANT',
  WAIVED = 'WAIVED',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}

/**
 * Audit status enumeration
 */
export enum AuditStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FINDINGS_ISSUED = 'FINDINGS_ISSUED',
  CORRECTIVE_ACTION_REQUIRED = 'CORRECTIVE_ACTION_REQUIRED',
  CLOSED = 'CLOSED'
}

/**
 * CAS coverage enumeration
 */
export enum CASCoverage {
  FULL_CAS = 'FULL_CAS',
  MODIFIED_CAS = 'MODIFIED_CAS',
  EXEMPT = 'EXEMPT'
}

/**
 * Country of origin classification
 */
export enum CountryClassification {
  DOMESTIC = 'DOMESTIC',
  QUALIFYING_COUNTRY = 'QUALIFYING_COUNTRY',
  TRADE_AGREEMENT_COUNTRY = 'TRADE_AGREEMENT_COUNTRY',
  NON_QUALIFYING = 'NON_QUALIFYING'
}

/**
 * DFARS compliance tracking data interface
 */
export interface DFARSComplianceData {
  contractId: string;
  clauseNumber: DFARSClause;
  clauseTitle: string;
  applicabilityReason: string;
  complianceStatus: ComplianceStatus;
  verificationMethod: string;
  verificationDate?: Date;
  verifiedBy?: string;
  nextReviewDate: Date;
  documentationLocation: string;
  notes?: string;
}

/**
 * Cost Accounting Standards data interface
 */
export interface CASComplianceData {
  contractId: string;
  vendorId: string;
  casDisclosureStatement: string;
  casRevisionNumber: string;
  casDisclosureDate: Date;
  casCoverage: CASCoverage;
  applicableStandards: string[];
  complianceStatus: ComplianceStatus;
  lastReviewDate?: Date;
  nextReviewDate: Date;
}

/**
 * Contract audit data interface
 */
export interface ContractAuditData {
  contractId: string;
  auditType: 'PRE_AWARD' | 'POST_AWARD' | 'CLOSEOUT' | 'INCURRED_COST' | 'SPECIAL';
  auditScope: string;
  auditingOrganization: string;
  scheduledStartDate: Date;
  scheduledEndDate: Date;
  leadAuditor: string;
  auditTeam: string[];
  focusAreas: string[];
}

/**
 * Buy American compliance data interface
 */
export interface BuyAmericanComplianceData {
  contractId: string;
  lineItemId: string;
  itemDescription: string;
  countryOfOrigin: string;
  countryClassification: CountryClassification;
  domesticContentPercentage: number;
  complianceStatus: ComplianceStatus;
  exceptionApplied?: string;
  documentationProvided: boolean;
}

/**
 * Cybersecurity compliance data interface
 */
export interface CybersecurityComplianceData {
  contractId: string;
  vendorId: string;
  nistSP800171Compliance: boolean;
  nistSP800171AssessmentDate?: Date;
  cmmc_Level: number;
  cmmcAssessmentDate?: Date;
  cmmcCertificateNumber?: string;
  coveredDefenseInformationHandled: boolean;
  cyberIncidentReportingProcedures: boolean;
  lastSecurityReview: Date;
  nextSecurityReview: Date;
}

/**
 * DFARS compliance tracking model
 */
export const createDFARSComplianceModel = (sequelize: Sequelize) => {
  class DFARSCompliance extends Model {
    public id!: string;
    public contractId!: string;
    public contractNumber!: string;
    public clauseNumber!: DFARSClause;
    public clauseTitle!: string;
    public applicabilityReason!: string;
    public complianceStatus!: ComplianceStatus;
    public verificationMethod!: string;
    public verificationDate!: Date;
    public verifiedBy!: string;
    public nextReviewDate!: Date;
    public documentationLocation!: string;
    public flowDownRequired!: boolean;
    public subcontractorsNotified!: boolean;
    public evidenceDocuments!: string[];
    public notes!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DFARSCompliance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the compliance record'
      },
      contractId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the contract'
      },
      contractNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Contract number for reference'
      },
      clauseNumber: {
        type: DataTypes.ENUM(...Object.values(DFARSClause)),
        allowNull: false,
        comment: 'DFARS clause number'
      },
      clauseTitle: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Full title of the DFARS clause'
      },
      applicabilityReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Reason why this clause applies to the contract'
      },
      complianceStatus: {
        type: DataTypes.ENUM(...Object.values(ComplianceStatus)),
        allowNull: false,
        defaultValue: ComplianceStatus.PENDING_REVIEW,
        comment: 'Current compliance status'
      },
      verificationMethod: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Method used to verify compliance'
      },
      verificationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date compliance was verified'
      },
      verifiedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Person who verified compliance'
      },
      nextReviewDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date for next compliance review'
      },
      documentationLocation: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Location of compliance documentation'
      },
      flowDownRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether clause must flow down to subcontractors'
      },
      subcontractorsNotified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether subcontractors have been notified'
      },
      evidenceDocuments: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'List of evidence document IDs'
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes about compliance'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional compliance metadata'
      }
    },
    {
      sequelize,
      tableName: 'dfars_compliance',
      timestamps: true,
      indexes: [
        { fields: ['contractId'] },
        { fields: ['contractNumber'] },
        { fields: ['clauseNumber'] },
        { fields: ['complianceStatus'] },
        { fields: ['nextReviewDate'] },
        { fields: ['contractId', 'clauseNumber'], unique: true }
      ]
    }
  );

  return DFARSCompliance;
};

/**
 * Cost Accounting Standards compliance model
 */
export const createCASComplianceModel = (sequelize: Sequelize) => {
  class CASCompliance extends Model {
    public id!: string;
    public contractId!: string;
    public vendorId!: string;
    public vendorName!: string;
    public casDisclosureStatement!: string;
    public casRevisionNumber!: string;
    public casDisclosureDate!: Date;
    public casCoverage!: CASCoverage;
    public applicableStandards!: string[];
    public complianceStatus!: ComplianceStatus;
    public lastReviewDate!: Date;
    public nextReviewDate!: Date;
    public reviewedBy!: string;
    public nonComplianceIssues!: string[];
    public correctiveActionPlan!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CASCompliance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the CAS compliance record'
      },
      contractId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the contract'
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the vendor'
      },
      vendorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Vendor name for reference'
      },
      casDisclosureStatement: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'CAS Disclosure Statement number'
      },
      casRevisionNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Revision number of CAS disclosure'
      },
      casDisclosureDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of CAS disclosure statement'
      },
      casCoverage: {
        type: DataTypes.ENUM(...Object.values(CASCoverage)),
        allowNull: false,
        comment: 'Level of CAS coverage'
      },
      applicableStandards: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        comment: 'List of applicable CAS standards'
      },
      complianceStatus: {
        type: DataTypes.ENUM(...Object.values(ComplianceStatus)),
        allowNull: false,
        defaultValue: ComplianceStatus.PENDING_REVIEW,
        comment: 'Current compliance status'
      },
      lastReviewDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date of last compliance review'
      },
      nextReviewDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date for next compliance review'
      },
      reviewedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Person who performed last review'
      },
      nonComplianceIssues: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'List of non-compliance issues identified'
      },
      correctiveActionPlan: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Corrective action plan for non-compliance'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional CAS compliance metadata'
      }
    },
    {
      sequelize,
      tableName: 'cas_compliance',
      timestamps: true,
      indexes: [
        { fields: ['contractId'] },
        { fields: ['vendorId'] },
        { fields: ['casCoverage'] },
        { fields: ['complianceStatus'] },
        { fields: ['nextReviewDate'] }
      ]
    }
  );

  return CASCompliance;
};

/**
 * Contract audit model
 */
export const createContractAuditModel = (sequelize: Sequelize) => {
  class ContractAudit extends Model {
    public id!: string;
    public auditNumber!: string;
    public contractId!: string;
    public contractNumber!: string;
    public auditType!: 'PRE_AWARD' | 'POST_AWARD' | 'CLOSEOUT' | 'INCURRED_COST' | 'SPECIAL';
    public auditScope!: string;
    public auditingOrganization!: string;
    public scheduledStartDate!: Date;
    public scheduledEndDate!: Date;
    public actualStartDate!: Date;
    public actualEndDate!: Date;
    public leadAuditor!: string;
    public auditTeam!: string[];
    public focusAreas!: string[];
    public status!: AuditStatus;
    public findingsCount!: number;
    public significantFindingsCount!: number;
    public auditReport!: string;
    public managementResponse!: string;
    public correctiveActions!: string[];
    public followUpRequired!: boolean;
    public followUpDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ContractAudit.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the audit'
      },
      auditNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique audit number'
      },
      contractId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the contract'
      },
      contractNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Contract number for reference'
      },
      auditType: {
        type: DataTypes.ENUM('PRE_AWARD', 'POST_AWARD', 'CLOSEOUT', 'INCURRED_COST', 'SPECIAL'),
        allowNull: false,
        comment: 'Type of audit being performed'
      },
      auditScope: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Scope of the audit'
      },
      auditingOrganization: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Organization performing the audit (e.g., DCAA)'
      },
      scheduledStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Scheduled audit start date'
      },
      scheduledEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Scheduled audit end date'
      },
      actualStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual audit start date'
      },
      actualEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual audit end date'
      },
      leadAuditor: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Name of lead auditor'
      },
      auditTeam: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Audit team members'
      },
      focusAreas: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        comment: 'Areas of focus for the audit'
      },
      status: {
        type: DataTypes.ENUM(...Object.values(AuditStatus)),
        allowNull: false,
        defaultValue: AuditStatus.SCHEDULED,
        comment: 'Current audit status'
      },
      findingsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total number of findings'
      },
      significantFindingsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of significant findings'
      },
      auditReport: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Audit report summary'
      },
      managementResponse: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Management response to audit'
      },
      correctiveActions: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Required corrective actions'
      },
      followUpRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether follow-up audit is required'
      },
      followUpDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date for follow-up audit'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional audit metadata'
      }
    },
    {
      sequelize,
      tableName: 'contract_audits',
      timestamps: true,
      indexes: [
        { fields: ['auditNumber'], unique: true },
        { fields: ['contractId'] },
        { fields: ['auditType'] },
        { fields: ['status'] },
        { fields: ['scheduledStartDate'] },
        { fields: ['followUpRequired'] }
      ]
    }
  );

  return ContractAudit;
};

/**
 * Buy American compliance model
 */
export const createBuyAmericanComplianceModel = (sequelize: Sequelize) => {
  class BuyAmericanCompliance extends Model {
    public id!: string;
    public contractId!: string;
    public lineItemId!: string;
    public itemDescription!: string;
    public countryOfOrigin!: string;
    public countryClassification!: CountryClassification;
    public domesticContentPercentage!: number;
    public complianceStatus!: ComplianceStatus;
    public exceptionApplied!: string;
    public exceptionJustification!: string;
    public documentationProvided!: boolean;
    public certificationDate!: Date;
    public certifiedBy!: string;
    public verifiedBy!: string;
    public verificationDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  BuyAmericanCompliance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the compliance record'
      },
      contractId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the contract'
      },
      lineItemId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the line item'
      },
      itemDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Description of the item'
      },
      countryOfOrigin: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Country where item was manufactured'
      },
      countryClassification: {
        type: DataTypes.ENUM(...Object.values(CountryClassification)),
        allowNull: false,
        comment: 'Classification of country of origin'
      },
      domesticContentPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Percentage of domestic content'
      },
      complianceStatus: {
        type: DataTypes.ENUM(...Object.values(ComplianceStatus)),
        allowNull: false,
        defaultValue: ComplianceStatus.PENDING_REVIEW,
        comment: 'Current compliance status'
      },
      exceptionApplied: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Exception applied if any'
      },
      exceptionJustification: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Justification for exception'
      },
      documentationProvided: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether required documentation was provided'
      },
      certificationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date vendor certified compliance'
      },
      certifiedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Vendor representative who certified'
      },
      verifiedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Government representative who verified'
      },
      verificationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date verification was completed'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional compliance metadata'
      }
    },
    {
      sequelize,
      tableName: 'buy_american_compliance',
      timestamps: true,
      indexes: [
        { fields: ['contractId'] },
        { fields: ['lineItemId'] },
        { fields: ['complianceStatus'] },
        { fields: ['countryClassification'] }
      ]
    }
  );

  return BuyAmericanCompliance;
};

/**
 * Cybersecurity compliance model
 */
export const createCybersecurityComplianceModel = (sequelize: Sequelize) => {
  class CybersecurityCompliance extends Model {
    public id!: string;
    public contractId!: string;
    public vendorId!: string;
    public vendorName!: string;
    public nistSP800171Compliance!: boolean;
    public nistSP800171AssessmentDate!: Date;
    public nistSP800171Score!: number;
    public cmmc_Level!: number;
    public cmmcAssessmentDate!: Date;
    public cmmcCertificateNumber!: string;
    public cmmcCertificationExpiry!: Date;
    public coveredDefenseInformationHandled!: boolean;
    public cyberIncidentReportingProcedures!: boolean;
    public lastSecurityReview!: Date;
    public nextSecurityReview!: Date;
    public complianceStatus!: ComplianceStatus;
    public nonComplianceItems!: string[];
    public remediationPlan!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CybersecurityCompliance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the cybersecurity compliance record'
      },
      contractId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the contract'
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the vendor'
      },
      vendorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Vendor name for reference'
      },
      nistSP800171Compliance: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether vendor is NIST SP 800-171 compliant'
      },
      nistSP800171AssessmentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date of last NIST SP 800-171 assessment'
      },
      nistSP800171Score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'NIST SP 800-171 assessment score'
      },
      cmmc_Level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'CMMC certification level (0-3)'
      },
      cmmcAssessmentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date of CMMC assessment'
      },
      cmmcCertificateNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'CMMC certificate number'
      },
      cmmcCertificationExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'CMMC certification expiry date'
      },
      coveredDefenseInformationHandled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether vendor handles covered defense information'
      },
      cyberIncidentReportingProcedures: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether cyber incident reporting procedures are in place'
      },
      lastSecurityReview: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date of last security review'
      },
      nextSecurityReview: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date for next security review'
      },
      complianceStatus: {
        type: DataTypes.ENUM(...Object.values(ComplianceStatus)),
        allowNull: false,
        defaultValue: ComplianceStatus.PENDING_REVIEW,
        comment: 'Current compliance status'
      },
      nonComplianceItems: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'List of non-compliance items'
      },
      remediationPlan: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Plan for remediating non-compliance'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional cybersecurity compliance metadata'
      }
    },
    {
      sequelize,
      tableName: 'cybersecurity_compliance',
      timestamps: true,
      indexes: [
        { fields: ['contractId'] },
        { fields: ['vendorId'] },
        { fields: ['complianceStatus'] },
        { fields: ['cmmc_Level'] },
        { fields: ['nextSecurityReview'] }
      ]
    }
  );

  return CybersecurityCompliance;
};

/**
 * Compliance finding model
 */
export const createComplianceFindingModel = (sequelize: Sequelize) => {
  class ComplianceFinding extends Model {
    public id!: string;
    public findingNumber!: string;
    public contractId!: string;
    public auditId!: string;
    public complianceArea!: string;
    public findingType!: 'SIGNIFICANT' | 'MODERATE' | 'MINOR' | 'OBSERVATION';
    public findingDescription!: string;
    public impactAssessment!: string;
    public recommendedAction!: string;
    public responsibleParty!: string;
    public targetResolutionDate!: Date;
    public actualResolutionDate!: Date;
    public status!: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    public resolutionNotes!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ComplianceFinding.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the finding'
      },
      findingNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique finding number'
      },
      contractId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the contract'
      },
      auditId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Reference to the audit (if applicable)'
      },
      complianceArea: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Area of compliance (e.g., DFARS, CAS, Cybersecurity)'
      },
      findingType: {
        type: DataTypes.ENUM('SIGNIFICANT', 'MODERATE', 'MINOR', 'OBSERVATION'),
        allowNull: false,
        comment: 'Severity of the finding'
      },
      findingDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed description of the finding'
      },
      impactAssessment: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Assessment of finding impact'
      },
      recommendedAction: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Recommended corrective action'
      },
      responsibleParty: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Party responsible for resolution'
      },
      targetResolutionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Target date for resolution'
      },
      actualResolutionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual date finding was resolved'
      },
      status: {
        type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'),
        allowNull: false,
        defaultValue: 'OPEN',
        comment: 'Current status of the finding'
      },
      resolutionNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Notes about how finding was resolved'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional finding metadata'
      }
    },
    {
      sequelize,
      tableName: 'compliance_findings',
      timestamps: true,
      indexes: [
        { fields: ['findingNumber'], unique: true },
        { fields: ['contractId'] },
        { fields: ['auditId'] },
        { fields: ['complianceArea'] },
        { fields: ['findingType'] },
        { fields: ['status'] },
        { fields: ['targetResolutionDate'] }
      ]
    }
  );

  return ComplianceFinding;
};

/**
 * Main CEFMS DFARS Compliance Monitoring Service
 *
 * Provides comprehensive DFARS compliance monitoring, CAS compliance tracking,
 * contract audit support, and regulatory compliance management.
 */
@Injectable()
export class CEFMSDFARSComplianceMonitoringService {
  private readonly logger = new Logger(CEFMSDFARSComplianceMonitoringService.name);

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Creates a DFARS compliance tracking record
   *
   * @param complianceData - DFARS compliance data
   * @param userId - User ID
   * @returns Created compliance record
   */
  async createDFARSCompliance(
    complianceData: DFARSComplianceData,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating DFARS compliance record for contract: ${complianceData.contractId}`);

      const contractNumber = await this.getContractNumber(complianceData.contractId);

      const DFARSCompliance = createDFARSComplianceModel(this.sequelize);
      const compliance = await DFARSCompliance.create(
        {
          ...complianceData,
          contractNumber,
          flowDownRequired: this.isFlowDownRequired(complianceData.clauseNumber),
          subcontractorsNotified: false,
          evidenceDocuments: [],
          metadata: { createdBy: userId }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`DFARS compliance record created: ${compliance.id}`);

      return compliance;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create DFARS compliance: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Gets contract number by ID
   *
   * @param contractId - Contract ID
   * @returns Contract number
   */
  private async getContractNumber(contractId: string): Promise<string> {
    const result = await this.sequelize.query(
      `SELECT contract_number FROM contracts WHERE id = :contractId`,
      {
        replacements: { contractId },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`Contract not found: ${contractId}`);
    }

    return result[0]['contract_number'];
  }

  /**
   * Determines if a DFARS clause requires flow-down to subcontractors
   *
   * @param clauseNumber - DFARS clause number
   * @returns True if flow-down is required
   */
  private isFlowDownRequired(clauseNumber: DFARSClause): boolean {
    const flowDownClauses = [
      DFARSClause.CLAUSE_252_204_7012,
      DFARSClause.CLAUSE_252_246_7007,
      DFARSClause.CLAUSE_252_246_7008,
      DFARSClause.CLAUSE_252_223_7008,
      DFARSClause.CLAUSE_252_225_7048
    ];

    return flowDownClauses.includes(clauseNumber);
  }

  /**
   * Verifies DFARS compliance for a contract
   *
   * @param complianceId - Compliance record ID
   * @param userId - User ID
   * @returns Updated compliance record
   */
  async verifyDFARSCompliance(complianceId: string, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Verifying DFARS compliance: ${complianceId}`);

      const DFARSCompliance = createDFARSComplianceModel(this.sequelize);
      const compliance = await DFARSCompliance.findByPk(complianceId, { transaction });

      if (!compliance) {
        throw new NotFoundException(`Compliance record not found: ${complianceId}`);
      }

      await compliance.update(
        {
          complianceStatus: ComplianceStatus.COMPLIANT,
          verificationDate: new Date(),
          verifiedBy: await this.getUserName(userId)
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`DFARS compliance verified: ${complianceId}`);

      return compliance;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to verify DFARS compliance: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Gets user name by ID
   *
   * @param userId - User ID
   * @returns User full name
   */
  private async getUserName(userId: string): Promise<string> {
    const result = await this.sequelize.query(
      `SELECT full_name FROM users WHERE id = :userId`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      return 'Unknown User';
    }

    return result[0]['full_name'];
  }

  /**
   * Creates a CAS compliance record
   *
   * @param casData - CAS compliance data
   * @param userId - User ID
   * @returns Created CAS compliance record
   */
  async createCASCompliance(casData: CASComplianceData, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating CAS compliance record for contract: ${casData.contractId}`);

      const vendorName = await this.getVendorName(casData.vendorId);

      const CASCompliance = createCASComplianceModel(this.sequelize);
      const compliance = await CASCompliance.create(
        {
          ...casData,
          vendorName,
          nonComplianceIssues: [],
          metadata: { createdBy: userId }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`CAS compliance record created: ${compliance.id}`);

      return compliance;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create CAS compliance: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Gets vendor name by ID
   *
   * @param vendorId - Vendor ID
   * @returns Vendor name
   */
  private async getVendorName(vendorId: string): Promise<string> {
    const result = await this.sequelize.query(
      `SELECT vendor_name FROM vendors WHERE id = :vendorId`,
      {
        replacements: { vendorId },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`Vendor not found: ${vendorId}`);
    }

    return result[0]['vendor_name'];
  }

  /**
   * Schedules a contract audit
   *
   * @param auditData - Contract audit data
   * @param userId - User ID
   * @returns Created audit record
   */
  async scheduleContractAudit(auditData: ContractAuditData, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Scheduling contract audit for contract: ${auditData.contractId}`);

      const auditNumber = await this.generateAuditNumber(auditData.auditType);
      const contractNumber = await this.getContractNumber(auditData.contractId);

      const ContractAudit = createContractAuditModel(this.sequelize);
      const audit = await ContractAudit.create(
        {
          auditNumber,
          contractId: auditData.contractId,
          contractNumber,
          auditType: auditData.auditType,
          auditScope: auditData.auditScope,
          auditingOrganization: auditData.auditingOrganization,
          scheduledStartDate: auditData.scheduledStartDate,
          scheduledEndDate: auditData.scheduledEndDate,
          leadAuditor: auditData.leadAuditor,
          auditTeam: auditData.auditTeam,
          focusAreas: auditData.focusAreas,
          status: AuditStatus.SCHEDULED,
          findingsCount: 0,
          significantFindingsCount: 0,
          correctiveActions: [],
          followUpRequired: false,
          metadata: { scheduledBy: userId }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Contract audit scheduled: ${auditNumber}`);

      return audit;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to schedule audit: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates a unique audit number
   *
   * @param auditType - Audit type
   * @returns Generated audit number
   */
  private async generateAuditNumber(auditType: string): Promise<string> {
    const fiscalYear = new Date().getFullYear();
    const typePrefix = auditType.substring(0, 3).toUpperCase();

    const result = await this.sequelize.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(audit_number FROM '[0-9]+$') AS INTEGER)), 0) + 1 as next_number
       FROM contract_audits
       WHERE audit_number LIKE :pattern`,
      {
        replacements: { pattern: `AUD-${typePrefix}-${fiscalYear}-%` },
        type: QueryTypes.SELECT
      }
    );

    const nextNumber = result[0]['next_number'];
    return `AUD-${typePrefix}-${fiscalYear}-${String(nextNumber).padStart(4, '0')}`;
  }

  /**
   * Starts a scheduled audit
   *
   * @param auditId - Audit ID
   * @param userId - User ID
   * @returns Updated audit record
   */
  async startAudit(auditId: string, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Starting audit: ${auditId}`);

      const ContractAudit = createContractAuditModel(this.sequelize);
      const audit = await ContractAudit.findByPk(auditId, { transaction });

      if (!audit) {
        throw new NotFoundException(`Audit not found: ${auditId}`);
      }

      if (audit.status !== AuditStatus.SCHEDULED) {
        throw new BadRequestException(`Audit must be SCHEDULED to start. Current status: ${audit.status}`);
      }

      await audit.update(
        {
          status: AuditStatus.IN_PROGRESS,
          actualStartDate: new Date(),
          metadata: { ...audit.metadata, startedBy: userId }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Audit started: ${audit.auditNumber}`);

      return audit;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to start audit: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Records a compliance finding
   *
   * @param findingData - Compliance finding data
   * @param userId - User ID
   * @returns Created finding record
   */
  async recordComplianceFinding(findingData: any, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Recording compliance finding for contract: ${findingData.contractId}`);

      const findingNumber = await this.generateFindingNumber();

      const ComplianceFinding = createComplianceFindingModel(this.sequelize);
      const finding = await ComplianceFinding.create(
        {
          findingNumber,
          contractId: findingData.contractId,
          auditId: findingData.auditId || null,
          complianceArea: findingData.complianceArea,
          findingType: findingData.findingType,
          findingDescription: findingData.findingDescription,
          impactAssessment: findingData.impactAssessment,
          recommendedAction: findingData.recommendedAction,
          responsibleParty: findingData.responsibleParty,
          targetResolutionDate: findingData.targetResolutionDate,
          status: 'OPEN',
          metadata: { recordedBy: userId }
        },
        { transaction }
      );

      // Update audit findings count if applicable
      if (findingData.auditId) {
        await this.updateAuditFindingsCount(findingData.auditId, findingData.findingType, transaction);
      }

      await transaction.commit();
      this.logger.log(`Compliance finding recorded: ${findingNumber}`);

      return finding;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to record finding: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates a unique finding number
   *
   * @returns Generated finding number
   */
  private async generateFindingNumber(): Promise<string> {
    const fiscalYear = new Date().getFullYear();

    const result = await this.sequelize.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(finding_number FROM '[0-9]+$') AS INTEGER)), 0) + 1 as next_number
       FROM compliance_findings
       WHERE finding_number LIKE :pattern`,
      {
        replacements: { pattern: `FIND-${fiscalYear}-%` },
        type: QueryTypes.SELECT
      }
    );

    const nextNumber = result[0]['next_number'];
    return `FIND-${fiscalYear}-${String(nextNumber).padStart(5, '0')}`;
  }

  /**
   * Updates audit findings count
   *
   * @param auditId - Audit ID
   * @param findingType - Finding type
   * @param transaction - Database transaction
   */
  private async updateAuditFindingsCount(
    auditId: string,
    findingType: string,
    transaction: Transaction
  ): Promise<void> {
    const ContractAudit = createContractAuditModel(this.sequelize);
    const audit = await ContractAudit.findByPk(auditId, { transaction });

    if (!audit) {
      return;
    }

    const updates: any = {
      findingsCount: audit.findingsCount + 1
    };

    if (findingType === 'SIGNIFICANT') {
      updates.significantFindingsCount = audit.significantFindingsCount + 1;
    }

    await audit.update(updates, { transaction });
  }

  /**
   * Creates a Buy American compliance record
   *
   * @param buyAmericanData - Buy American compliance data
   * @param userId - User ID
   * @returns Created compliance record
   */
  async createBuyAmericanCompliance(
    buyAmericanData: BuyAmericanComplianceData,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating Buy American compliance record for contract: ${buyAmericanData.contractId}`);

      const BuyAmericanCompliance = createBuyAmericanComplianceModel(this.sequelize);
      const compliance = await BuyAmericanCompliance.create(
        {
          ...buyAmericanData,
          metadata: { createdBy: userId }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Buy American compliance record created: ${compliance.id}`);

      return compliance;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create Buy American compliance: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Creates a cybersecurity compliance record
   *
   * @param cyberData - Cybersecurity compliance data
   * @param userId - User ID
   * @returns Created compliance record
   */
  async createCybersecurityCompliance(
    cyberData: CybersecurityComplianceData,
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating cybersecurity compliance record for contract: ${cyberData.contractId}`);

      const vendorName = await this.getVendorName(cyberData.vendorId);

      const CybersecurityCompliance = createCybersecurityComplianceModel(this.sequelize);
      const compliance = await CybersecurityCompliance.create(
        {
          ...cyberData,
          vendorName,
          complianceStatus: ComplianceStatus.PENDING_REVIEW,
          nonComplianceItems: [],
          metadata: { createdBy: userId }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Cybersecurity compliance record created: ${compliance.id}`);

      return compliance;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create cybersecurity compliance: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates compliance dashboard report
   *
   * @param contractId - Contract ID (optional, for contract-specific report)
   * @returns Compliance dashboard data
   */
  async generateComplianceDashboard(contractId?: string): Promise<any> {
    try {
      this.logger.log(`Generating compliance dashboard${contractId ? ` for contract: ${contractId}` : ''}`);

      const whereClause = contractId ? 'WHERE contract_id = :contractId' : '';
      const replacements = contractId ? { contractId } : {};

      // DFARS compliance summary
      const dfarsCompliance = await this.sequelize.query(
        `
        SELECT
          compliance_status,
          COUNT(*) as count
        FROM dfars_compliance
        ${whereClause}
        GROUP BY compliance_status
        `,
        {
          replacements,
          type: QueryTypes.SELECT
        }
      );

      // CAS compliance summary
      const casCompliance = await this.sequelize.query(
        `
        SELECT
          compliance_status,
          COUNT(*) as count
        FROM cas_compliance
        ${whereClause}
        GROUP BY compliance_status
        `,
        {
          replacements,
          type: QueryTypes.SELECT
        }
      );

      // Audit summary
      const auditSummary = await this.sequelize.query(
        `
        SELECT
          audit_type,
          status,
          COUNT(*) as count
        FROM contract_audits
        ${whereClause}
        GROUP BY audit_type, status
        `,
        {
          replacements,
          type: QueryTypes.SELECT
        }
      );

      // Open findings summary
      const findingsSummary = await this.sequelize.query(
        `
        SELECT
          finding_type,
          status,
          COUNT(*) as count
        FROM compliance_findings
        ${whereClause}
        GROUP BY finding_type, status
        `,
        {
          replacements,
          type: QueryTypes.SELECT
        }
      );

      return {
        dfarsCompliance,
        casCompliance,
        auditSummary,
        findingsSummary,
        generatedAt: new Date()
      };
    } catch (error) {
      this.logger.error(`Failed to generate compliance dashboard: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates upcoming compliance reviews report
   *
   * @param daysAhead - Number of days to look ahead
   * @returns Upcoming reviews
   */
  async getUpcomingComplianceReviews(daysAhead: number = 30): Promise<any> {
    try {
      this.logger.log(`Getting compliance reviews for next ${daysAhead} days`);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const dfarsReviews = await this.sequelize.query(
        `
        SELECT
          id,
          contract_number,
          clause_number,
          next_review_date,
          compliance_status
        FROM dfars_compliance
        WHERE next_review_date <= :futureDate
          AND next_review_date >= CURRENT_DATE
        ORDER BY next_review_date ASC
        `,
        {
          replacements: { futureDate },
          type: QueryTypes.SELECT
        }
      );

      const casReviews = await this.sequelize.query(
        `
        SELECT
          id,
          vendor_name,
          next_review_date,
          compliance_status
        FROM cas_compliance
        WHERE next_review_date <= :futureDate
          AND next_review_date >= CURRENT_DATE
        ORDER BY next_review_date ASC
        `,
        {
          replacements: { futureDate },
          type: QueryTypes.SELECT
        }
      );

      const cyberReviews = await this.sequelize.query(
        `
        SELECT
          id,
          vendor_name,
          next_security_review,
          compliance_status,
          cmmc_level
        FROM cybersecurity_compliance
        WHERE next_security_review <= :futureDate
          AND next_security_review >= CURRENT_DATE
        ORDER BY next_security_review ASC
        `,
        {
          replacements: { futureDate },
          type: QueryTypes.SELECT
        }
      );

      return {
        dfarsReviews,
        casReviews,
        cyberReviews,
        totalUpcoming: dfarsReviews.length + casReviews.length + cyberReviews.length
      };
    } catch (error) {
      this.logger.error(`Failed to get upcoming reviews: ${error.message}`, error.stack);
      throw error;
    }
  }
}

/**
 * Export all models and services
 */
export default {
  CEFMSDFARSComplianceMonitoringService,
  createDFARSComplianceModel,
  createCASComplianceModel,
  createContractAuditModel,
  createBuyAmericanComplianceModel,
  createCybersecurityComplianceModel,
  createComplianceFindingModel,
  DFARSClause,
  ComplianceStatus,
  AuditStatus,
  CASCoverage,
  CountryClassification
};
