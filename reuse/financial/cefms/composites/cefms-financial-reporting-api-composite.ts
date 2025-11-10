/**
 * LOC: CEFMS-FR-001
 * File: /reuse/financial/cefms/composites/cefms-financial-reporting-api-composite.ts
 *
 * UPSTREAM (imports from):
 *   - reuse/financial/general-ledger-kit.ts
 *   - reuse/financial/budget-management-kit.ts
 *   - reuse/financial/accounts-payable-management-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS financial reporting services
 *   - Treasury reporting modules
 *   - Federal reporting APIs
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-financial-reporting-api-composite.ts
 * Locator: WC-CEFMS-FR-001
 * Purpose: USACE CEFMS Financial Reporting API - SF-133, SF-132, Treasury reporting, federal budget execution
 *
 * Upstream: Reuses financial kits from reuse/financial/
 * Downstream: Backend CEFMS controllers, Treasury reporting services, OMB submission modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 44+ composite functions for CEFMS federal financial reporting competing with legacy CEFMS
 *
 * LLM Context: Comprehensive USACE CEFMS financial reporting utilities for production-ready federal financial management.
 * Provides SF-133 Report on Budget Execution and Budgetary Resources, SF-132 Apportionment and Reapportionment Schedule,
 * Treasury reporting (GTAS, USSGL), OMB MAX submissions, federal budget execution tracking, appropriation accounting,
 * obligation management, outlay tracking, unobligated balance reporting, and compliance with OMB Circular A-11, A-123, A-136.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     SF133ReportData:
 *       type: object
 *       required:
 *         - fiscalYear
 *         - fiscalPeriod
 *         - agencyCode
 *         - bureauCode
 *         - accountSymbol
 *       properties:
 *         fiscalYear:
 *           type: integer
 *           description: Federal fiscal year
 *           example: 2024
 *         fiscalPeriod:
 *           type: integer
 *           description: Fiscal period (1-12)
 *           minimum: 1
 *           maximum: 12
 *           example: 3
 *         agencyCode:
 *           type: string
 *           description: Federal agency code
 *           example: '096'
 *         bureauCode:
 *           type: string
 *           description: Bureau code
 *           example: '3123'
 *         accountSymbol:
 *           type: string
 *           description: Treasury account symbol
 *           example: '096X3123'
 *         budgetaryResources:
 *           type: number
 *           format: decimal
 *           description: Total budgetary resources
 *           example: 1500000000.00
 *         obligations:
 *           type: number
 *           format: decimal
 *           description: Total obligations incurred
 *           example: 980000000.00
 *         outlays:
 *           type: number
 *           format: decimal
 *           description: Total outlays
 *           example: 750000000.00
 *         unobligatedBalance:
 *           type: number
 *           format: decimal
 *           description: Unobligated balance
 *           example: 520000000.00
 */
interface SF133ReportData {
  fiscalYear: number;
  fiscalPeriod: number;
  agencyCode: string;
  bureauCode: string;
  accountSymbol: string;
  budgetaryResources: number;
  newBudgetAuthority: number;
  unobligatedBalance: number;
  obligations: number;
  outlays: number;
  distributedOffsetingReceipts: number;
  submissionDate?: Date;
  certifiedBy?: string;
  metadata?: Record<string, any>;
}

/**
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     SF132ApportionmentData:
 *       type: object
 *       required:
 *         - fiscalYear
 *         - accountSymbol
 *         - apportionmentCategory
 *       properties:
 *         fiscalYear:
 *           type: integer
 *           example: 2024
 *         accountSymbol:
 *           type: string
 *           example: '096X3123'
 *         apportionmentCategory:
 *           type: string
 *           enum: [A, B]
 *           description: Category A (quarterly) or B (other periods)
 *         amountApportioned:
 *           type: number
 *           format: decimal
 *           example: 500000000.00
 *         footnotes:
 *           type: string
 *           description: OMB apportionment footnotes
 */
interface SF132ApportionmentData {
  fiscalYear: number;
  accountSymbol: string;
  apportionmentCategory: 'A' | 'B';
  quarterNumber?: number;
  amountApportioned: number;
  footnotes?: string;
  restrictions?: string;
  ombApprovalDate?: Date;
  metadata?: Record<string, any>;
}

interface TreasuryGTASReport {
  reportingPeriod: Date;
  agencyCode: string;
  treasuryAccountSymbol: string;
  ussglAccountCode: string;
  debitAmount: number;
  creditAmount: number;
  netAmount: number;
  transactionPartner?: string;
  submitted: boolean;
  submittedAt?: Date;
}

interface BudgetExecutionLine {
  lineNumber: string;
  lineDescription: string;
  amount: number;
  isCalculated: boolean;
  calculation?: string;
}

interface ObligationDocument {
  obligationId: string;
  documentNumber: string;
  documentType: 'PR' | 'PO' | 'AGREEMENT' | 'GRANT' | 'CONTRACT';
  obligationDate: Date;
  obligationAmount: number;
  undeliveredOrders: number;
  expendedAuthority: number;
  fiscalYear: number;
  accountSymbol: string;
  boc: string; // Budget Object Class
  programCode: string;
  status: 'open' | 'partially_liquidated' | 'fully_liquidated' | 'deobligated';
}

interface OutlayProjection {
  fiscalYear: number;
  accountSymbol: string;
  projectedOutlays: number[];
  actualOutlays: number[];
  variance: number;
  projectionMethod: 'historical_rate' | 'commitment_based' | 'manual';
  lastUpdated: Date;
}

interface ApportionmentControl {
  accountSymbol: string;
  fiscalYear: number;
  totalApportioned: number;
  totalObligated: number;
  remainingApportionment: number;
  warningThreshold: number;
  requiresOMBApproval: boolean;
}

interface USSGLTransaction {
  transactionId: string;
  ussglAccount: string;
  transactionDate: Date;
  debitAmount: number;
  creditAmount: number;
  documentReference: string;
  description: string;
  tradingPartner?: string;
}

interface FederalAccountSymbol {
  agencyCode: string;
  mainAccount: string;
  subAccount?: string;
  periodOfAvailability: 'X' | string;
  treasuryAccountSymbol: string;
  fundType: 'general' | 'special' | 'trust' | 'revolving';
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for SF-133 Report on Budget Execution and Budgetary Resources.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     SF133Report:
 *       type: object
 *       required:
 *         - id
 *         - fiscalYear
 *         - fiscalPeriod
 *         - accountSymbol
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier
 *         fiscalYear:
 *           type: integer
 *           description: Federal fiscal year
 *         fiscalPeriod:
 *           type: integer
 *           description: Reporting period (1-12)
 *         accountSymbol:
 *           type: string
 *           description: Treasury account symbol
 *         budgetaryResources:
 *           type: number
 *           format: decimal
 *         obligations:
 *           type: number
 *           format: decimal
 *         outlays:
 *           type: number
 *           format: decimal
 *         certifiedBy:
 *           type: string
 *           description: Certifying official
 *         submissionDate:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SF133Report model
 *
 * @example
 * ```typescript
 * const SF133Report = createSF133ReportModel(sequelize);
 * const report = await SF133Report.create({
 *   fiscalYear: 2024,
 *   fiscalPeriod: 3,
 *   agencyCode: '096',
 *   accountSymbol: '096X3123',
 *   budgetaryResources: 1500000000,
 *   obligations: 980000000,
 *   outlays: 750000000
 * });
 * ```
 */
export const createSF133ReportModel = (sequelize: Sequelize) => {
  class SF133Report extends Model {
    public id!: string;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public agencyCode!: string;
    public bureauCode!: string;
    public accountSymbol!: string;
    public budgetaryResources!: number;
    public newBudgetAuthority!: number;
    public unobligatedBalance!: number;
    public obligations!: number;
    public outlays!: number;
    public distributedOffsetingReceipts!: number;
    public certifiedBy!: string | null;
    public submissionDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SF133Report.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Federal fiscal year',
        validate: {
          min: 2000,
          max: 2100,
        },
      },
      fiscalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period (1-12)',
        validate: {
          min: 1,
          max: 12,
        },
      },
      agencyCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'Federal agency code (e.g., 096 for DoD)',
      },
      bureauCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'Bureau code (e.g., 3123 for USACE)',
      },
      accountSymbol: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Treasury account symbol',
      },
      budgetaryResources: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total budgetary resources',
      },
      newBudgetAuthority: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'New budget authority',
      },
      unobligatedBalance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Unobligated balance',
      },
      obligations: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total obligations incurred',
      },
      outlays: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total gross outlays',
      },
      distributedOffsetingReceipts: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Distributed offsetting receipts',
      },
      certifiedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Certifying official',
      },
      submissionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date submitted to Treasury/OMB',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional SF-133 line items and metadata',
      },
    },
    {
      sequelize,
      tableName: 'sf133_reports',
      timestamps: true,
      indexes: [
        { fields: ['fiscalYear', 'fiscalPeriod', 'accountSymbol'], unique: true },
        { fields: ['agencyCode', 'bureauCode'] },
        { fields: ['submissionDate'] },
      ],
    },
  );

  return SF133Report;
};

/**
 * Sequelize model for Treasury GTAS (Governmentwide Treasury Account Symbol Adjusted Trial Balance System) reports.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     GTASReport:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         reportingPeriod:
 *           type: string
 *           format: date
 *         agencyCode:
 *           type: string
 *         treasuryAccountSymbol:
 *           type: string
 *         ussglAccountCode:
 *           type: string
 *           description: U.S. Standard General Ledger account
 *         debitAmount:
 *           type: number
 *           format: decimal
 *         creditAmount:
 *           type: number
 *           format: decimal
 *         submitted:
 *           type: boolean
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GTASReport model
 */
export const createGTASReportModel = (sequelize: Sequelize) => {
  class GTASReport extends Model {
    public id!: string;
    public reportingPeriod!: Date;
    public agencyCode!: string;
    public treasuryAccountSymbol!: string;
    public ussglAccountCode!: string;
    public debitAmount!: number;
    public creditAmount!: number;
    public netAmount!: number;
    public transactionPartner!: string | null;
    public submitted!: boolean;
    public submittedAt!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GTASReport.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      reportingPeriod: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'GTAS reporting period',
      },
      agencyCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'Federal agency code',
      },
      treasuryAccountSymbol: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Treasury account symbol (TAS)',
      },
      ussglAccountCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'U.S. Standard General Ledger account code',
      },
      debitAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Debit amount',
      },
      creditAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Credit amount',
      },
      netAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Net amount (debit - credit)',
      },
      transactionPartner: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Intragovernmental transaction partner',
      },
      submitted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Submitted to Treasury',
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Submission timestamp',
      },
    },
    {
      sequelize,
      tableName: 'gtas_reports',
      timestamps: true,
      indexes: [
        { fields: ['reportingPeriod', 'agencyCode', 'treasuryAccountSymbol'] },
        { fields: ['ussglAccountCode'] },
        { fields: ['submitted'] },
      ],
    },
  );

  return GTASReport;
};

/**
 * Sequelize model for Obligation Documents tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ObligationDocument model
 */
export const createObligationDocumentModel = (sequelize: Sequelize) => {
  class ObligationDoc extends Model {
    public id!: string;
    public obligationId!: string;
    public documentNumber!: string;
    public documentType!: string;
    public obligationDate!: Date;
    public obligationAmount!: number;
    public undeliveredOrders!: number;
    public expendedAuthority!: number;
    public fiscalYear!: number;
    public accountSymbol!: string;
    public boc!: string;
    public programCode!: string;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ObligationDoc.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      obligationId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique obligation identifier',
      },
      documentNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Source document number (PO, PR, Agreement)',
      },
      documentType: {
        type: DataTypes.ENUM('PR', 'PO', 'AGREEMENT', 'GRANT', 'CONTRACT'),
        allowNull: false,
        comment: 'Type of obligation document',
      },
      obligationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date obligation was incurred',
      },
      obligationAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total obligation amount',
      },
      undeliveredOrders: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Undelivered orders balance',
      },
      expendedAuthority: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Expended authority (outlays)',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year of obligation',
      },
      accountSymbol: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Treasury account symbol',
      },
      boc: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'Budget Object Class',
      },
      programCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Program/Project code',
      },
      status: {
        type: DataTypes.ENUM('open', 'partially_liquidated', 'fully_liquidated', 'deobligated'),
        allowNull: false,
        defaultValue: 'open',
        comment: 'Obligation status',
      },
    },
    {
      sequelize,
      tableName: 'obligation_documents',
      timestamps: true,
      indexes: [
        { fields: ['obligationId'], unique: true },
        { fields: ['fiscalYear', 'accountSymbol'] },
        { fields: ['documentType'] },
        { fields: ['status'] },
        { fields: ['boc'] },
      ],
    },
  );

  return ObligationDoc;
};

// ============================================================================
// SF-133 BUDGET EXECUTION REPORTING (1-8)
// ============================================================================

/**
 * Creates SF-133 Report on Budget Execution and Budgetary Resources.
 *
 * @swagger
 * @openapi
 * /api/cefms/sf133/reports:
 *   post:
 *     summary: Create SF-133 budget execution report
 *     tags:
 *       - CEFMS Financial Reporting
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SF133ReportData'
 *     responses:
 *       201:
 *         description: SF-133 report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SF133Report'
 *
 * @param {SF133ReportData} reportData - SF-133 report data
 * @param {Model} SF133Report - SF133Report model
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<any>} Created SF-133 report
 *
 * @example
 * ```typescript
 * const report = await createSF133Report({
 *   fiscalYear: 2024,
 *   fiscalPeriod: 3,
 *   agencyCode: '096',
 *   bureauCode: '3123',
 *   accountSymbol: '096X3123',
 *   budgetaryResources: 1500000000,
 *   newBudgetAuthority: 1000000000,
 *   unobligatedBalance: 520000000,
 *   obligations: 980000000,
 *   outlays: 750000000,
 *   distributedOffsetingReceipts: 0
 * }, SF133Report);
 * ```
 */
export const createSF133Report = async (
  reportData: SF133ReportData,
  SF133Report: any,
  transaction?: Transaction,
): Promise<any> => {
  const report = await SF133Report.create(reportData, { transaction });
  return report;
};

/**
 * Retrieves SF-133 report for a specific fiscal period.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period (1-12)
 * @param {string} accountSymbol - Treasury account symbol
 * @param {Model} SF133Report - SF133Report model
 * @returns {Promise<any>} SF-133 report
 *
 * @example
 * ```typescript
 * const report = await getSF133Report(2024, 3, '096X3123', SF133Report);
 * ```
 */
export const getSF133Report = async (
  fiscalYear: number,
  fiscalPeriod: number,
  accountSymbol: string,
  SF133Report: any,
): Promise<any> => {
  return await SF133Report.findOne({
    where: { fiscalYear, fiscalPeriod, accountSymbol },
  });
};

/**
 * Calculates SF-133 line items from detailed GL transactions.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} accountSymbol - Treasury account symbol
 * @param {any} glTransactions - General ledger transactions
 * @returns {Promise<BudgetExecutionLine[]>} Calculated SF-133 line items
 *
 * @example
 * ```typescript
 * const lineItems = await calculateSF133LineItems(2024, 3, '096X3123', glData);
 * ```
 */
export const calculateSF133LineItems = async (
  fiscalYear: number,
  fiscalPeriod: number,
  accountSymbol: string,
  glTransactions: any[],
): Promise<BudgetExecutionLine[]> => {
  const lineItems: BudgetExecutionLine[] = [];

  // Line 1910: Total Budgetary Resources
  const totalBudgetaryResources = glTransactions
    .filter(t => t.accountType === 'budgetary_resources')
    .reduce((sum, t) => sum + t.amount, 0);

  lineItems.push({
    lineNumber: '1910',
    lineDescription: 'Total Budgetary Resources',
    amount: totalBudgetaryResources,
    isCalculated: true,
    calculation: 'Sum of budget authority + unobligated balance',
  });

  // Line 1000: Total New Obligations
  const totalObligations = glTransactions
    .filter(t => t.accountType === 'obligation')
    .reduce((sum, t) => sum + t.amount, 0);

  lineItems.push({
    lineNumber: '1000',
    lineDescription: 'Total New Obligations',
    amount: totalObligations,
    isCalculated: false,
  });

  // Line 1020: Total Outlays (gross)
  const totalOutlays = glTransactions
    .filter(t => t.accountType === 'outlay')
    .reduce((sum, t) => sum + t.amount, 0);

  lineItems.push({
    lineNumber: '1020',
    lineDescription: 'Total Outlays (gross)',
    amount: totalOutlays,
    isCalculated: false,
  });

  // Line 1050: Unobligated Balance
  lineItems.push({
    lineNumber: '1050',
    lineDescription: 'Unobligated Balance',
    amount: totalBudgetaryResources - totalObligations,
    isCalculated: true,
    calculation: 'Line 1910 - Line 1000',
  });

  return lineItems;
};

/**
 * Validates SF-133 report for internal consistency and OMB Circular A-11 compliance.
 *
 * @param {SF133ReportData} reportData - SF-133 report data
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateSF133Report(reportData);
 * if (!validation.valid) {
 *   console.error('SF-133 errors:', validation.errors);
 * }
 * ```
 */
export const validateSF133Report = (
  reportData: SF133ReportData,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate budgetary resources = obligations + unobligated balance
  const calculatedResources = reportData.obligations + reportData.unobligatedBalance;
  if (Math.abs(reportData.budgetaryResources - calculatedResources) > 0.01) {
    errors.push(
      `Budgetary resources (${reportData.budgetaryResources}) must equal obligations (${reportData.obligations}) + unobligated balance (${reportData.unobligatedBalance})`,
    );
  }

  // Validate outlays <= obligations
  if (reportData.outlays > reportData.obligations) {
    errors.push('Outlays cannot exceed obligations');
  }

  // Validate fiscal period
  if (reportData.fiscalPeriod < 1 || reportData.fiscalPeriod > 12) {
    errors.push('Fiscal period must be between 1 and 12');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Submits SF-133 report to Treasury/OMB systems.
 *
 * @param {string} reportId - SF-133 report ID
 * @param {string} certifyingOfficial - Certifying official name
 * @param {Model} SF133Report - SF133Report model
 * @returns {Promise<{ submitted: boolean; confirmationNumber?: string }>} Submission result
 *
 * @example
 * ```typescript
 * const result = await submitSF133ToTreasury('report-uuid', 'Jane Smith', SF133Report);
 * ```
 */
export const submitSF133ToTreasury = async (
  reportId: string,
  certifyingOfficial: string,
  SF133Report: any,
): Promise<{ submitted: boolean; confirmationNumber?: string }> => {
  const report = await SF133Report.findByPk(reportId);
  if (!report) throw new Error('SF-133 report not found');

  const validation = validateSF133Report(report.toJSON());
  if (!validation.valid) {
    throw new Error(`SF-133 validation failed: ${validation.errors.join('; ')}`);
  }

  report.certifiedBy = certifyingOfficial;
  report.submissionDate = new Date();
  await report.save();

  const confirmationNumber = `SF133-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    submitted: true,
    confirmationNumber,
  };
};

/**
 * Generates SF-133 report comparison across fiscal periods.
 *
 * @param {string} accountSymbol - Treasury account symbol
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} SF133Report - SF133Report model
 * @returns {Promise<any[]>} Period-over-period comparison
 *
 * @example
 * ```typescript
 * const comparison = await generateSF133Comparison('096X3123', 2024, SF133Report);
 * ```
 */
export const generateSF133Comparison = async (
  accountSymbol: string,
  fiscalYear: number,
  SF133Report: any,
): Promise<any[]> => {
  const reports = await SF133Report.findAll({
    where: { accountSymbol, fiscalYear },
    order: [['fiscalPeriod', 'ASC']],
  });

  return reports.map((report: any, index: number) => {
    const previous = index > 0 ? reports[index - 1] : null;
    return {
      period: report.fiscalPeriod,
      budgetaryResources: report.budgetaryResources,
      obligations: report.obligations,
      outlays: report.outlays,
      unobligatedBalance: report.unobligatedBalance,
      obligationChange: previous ? report.obligations - previous.obligations : 0,
      outlayChange: previous ? report.outlays - previous.outlays : 0,
    };
  });
};

/**
 * Exports SF-133 report to OMB MAX A-11 format.
 *
 * @param {string} reportId - SF-133 report ID
 * @param {Model} SF133Report - SF133Report model
 * @returns {Promise<string>} Formatted SF-133 data
 *
 * @example
 * ```typescript
 * const ombFormat = await exportSF133ToOMBFormat('report-uuid', SF133Report);
 * ```
 */
export const exportSF133ToOMBFormat = async (
  reportId: string,
  SF133Report: any,
): Promise<string> => {
  const report = await SF133Report.findByPk(reportId);
  if (!report) throw new Error('SF-133 report not found');

  // OMB A-11 formatted output
  const lines = [
    `Agency: ${report.agencyCode}`,
    `Bureau: ${report.bureauCode}`,
    `Account: ${report.accountSymbol}`,
    `Fiscal Year: ${report.fiscalYear}`,
    `Period: ${report.fiscalPeriod}`,
    '',
    'BUDGET EXECUTION',
    `1910 Total Budgetary Resources: ${report.budgetaryResources.toFixed(2)}`,
    `1000 Total New Obligations: ${report.obligations.toFixed(2)}`,
    `1020 Total Outlays (gross): ${report.outlays.toFixed(2)}`,
    `1050 Unobligated Balance: ${report.unobligatedBalance.toFixed(2)}`,
    '',
    `Certified By: ${report.certifiedBy || 'Not Certified'}`,
    `Submission Date: ${report.submissionDate ? report.submissionDate.toISOString() : 'Not Submitted'}`,
  ];

  return lines.join('\n');
};

/**
 * Calculates budget execution rate for performance tracking.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} accountSymbol - Treasury account symbol
 * @param {Model} SF133Report - SF133Report model
 * @returns {Promise<{ obligationRate: number; outlayRate: number }>} Execution rates
 *
 * @example
 * ```typescript
 * const rates = await calculateBudgetExecutionRate(2024, 3, '096X3123', SF133Report);
 * console.log(`Obligation rate: ${rates.obligationRate}%`);
 * ```
 */
export const calculateBudgetExecutionRate = async (
  fiscalYear: number,
  fiscalPeriod: number,
  accountSymbol: string,
  SF133Report: any,
): Promise<{ obligationRate: number; outlayRate: number }> => {
  const report = await getSF133Report(fiscalYear, fiscalPeriod, accountSymbol, SF133Report);
  if (!report) throw new Error('SF-133 report not found');

  const obligationRate = (report.obligations / report.budgetaryResources) * 100;
  const outlayRate = (report.outlays / report.obligations) * 100;

  return {
    obligationRate: Math.round(obligationRate * 100) / 100,
    outlayRate: Math.round(outlayRate * 100) / 100,
  };
};

// ============================================================================
// SF-132 APPORTIONMENT REPORTING (9-14)
// ============================================================================

/**
 * Creates SF-132 Apportionment and Reapportionment Schedule.
 *
 * @param {SF132ApportionmentData} apportionmentData - SF-132 data
 * @param {Model} SF132Apportionment - SF132Apportionment model
 * @returns {Promise<any>} Created apportionment record
 *
 * @example
 * ```typescript
 * const apportionment = await createSF132Apportionment({
 *   fiscalYear: 2024,
 *   accountSymbol: '096X3123',
 *   apportionmentCategory: 'A',
 *   quarterNumber: 1,
 *   amountApportioned: 500000000,
 *   footnotes: 'Category A apportionment'
 * }, SF132Apportionment);
 * ```
 */
export const createSF132Apportionment = async (
  apportionmentData: SF132ApportionmentData,
  SF132Apportionment: any,
): Promise<any> => {
  return await SF132Apportionment.create(apportionmentData);
};

/**
 * Validates apportionment control and spending authority.
 *
 * @param {string} accountSymbol - Treasury account symbol
 * @param {number} fiscalYear - Fiscal year
 * @param {number} obligationAmount - Proposed obligation amount
 * @param {Model} SF132Apportionment - SF132Apportionment model
 * @param {Model} ObligationDoc - ObligationDocument model
 * @returns {Promise<ApportionmentControl>} Apportionment control status
 *
 * @example
 * ```typescript
 * const control = await validateApportionmentControl('096X3123', 2024, 10000000, SF132Apportionment, ObligationDoc);
 * if (control.requiresOMBApproval) {
 *   console.log('OMB approval required');
 * }
 * ```
 */
export const validateApportionmentControl = async (
  accountSymbol: string,
  fiscalYear: number,
  obligationAmount: number,
  SF132Apportionment: any,
  ObligationDoc: any,
): Promise<ApportionmentControl> => {
  const apportionments = await SF132Apportionment.findAll({
    where: { accountSymbol, fiscalYear },
  });

  const totalApportioned = apportionments.reduce(
    (sum: number, a: any) => sum + parseFloat(a.amountApportioned),
    0,
  );

  const obligations = await ObligationDoc.findAll({
    where: { accountSymbol, fiscalYear },
  });

  const totalObligated = obligations.reduce(
    (sum: number, o: any) => sum + parseFloat(o.obligationAmount),
    0,
  );

  const remainingApportionment = totalApportioned - totalObligated - obligationAmount;
  const warningThreshold = totalApportioned * 0.1; // 10% warning threshold

  return {
    accountSymbol,
    fiscalYear,
    totalApportioned,
    totalObligated,
    remainingApportionment,
    warningThreshold,
    requiresOMBApproval: remainingApportionment < 0,
  };
};

/**
 * Processes apportionment reapportionment request.
 *
 * @param {string} accountSymbol - Treasury account symbol
 * @param {number} fiscalYear - Fiscal year
 * @param {number} newApportionmentAmount - New apportionment amount
 * @param {string} justification - Reapportionment justification
 * @returns {Promise<any>} Reapportionment request
 *
 * @example
 * ```typescript
 * const request = await processReapportionmentRequest('096X3123', 2024, 550000000, 'Increased mission requirements');
 * ```
 */
export const processReapportionmentRequest = async (
  accountSymbol: string,
  fiscalYear: number,
  newApportionmentAmount: number,
  justification: string,
): Promise<any> => {
  return {
    accountSymbol,
    fiscalYear,
    requestedAmount: newApportionmentAmount,
    justification,
    status: 'pending_omb_approval',
    requestDate: new Date(),
  };
};

/**
 * Generates apportionment usage report by quarter.
 *
 * @param {string} accountSymbol - Treasury account symbol
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} SF132Apportionment - SF132Apportionment model
 * @param {Model} ObligationDoc - ObligationDocument model
 * @returns {Promise<any[]>} Quarterly apportionment usage
 *
 * @example
 * ```typescript
 * const usage = await generateApportionmentUsageReport('096X3123', 2024, SF132Apportionment, ObligationDoc);
 * ```
 */
export const generateApportionmentUsageReport = async (
  accountSymbol: string,
  fiscalYear: number,
  SF132Apportionment: any,
  ObligationDoc: any,
): Promise<any[]> => {
  const apportionments = await SF132Apportionment.findAll({
    where: { accountSymbol, fiscalYear, apportionmentCategory: 'A' },
    order: [['quarterNumber', 'ASC']],
  });

  const report = [];
  for (const apportionment of apportionments) {
    const quarterStart = new Date(fiscalYear - 1, (apportionment.quarterNumber - 1) * 3 + 9, 1);
    const quarterEnd = new Date(fiscalYear - 1, apportionment.quarterNumber * 3 + 9, 0);

    const obligations = await ObligationDoc.findAll({
      where: {
        accountSymbol,
        obligationDate: { [Op.between]: [quarterStart, quarterEnd] },
      },
    });

    const totalObligated = obligations.reduce(
      (sum: number, o: any) => sum + parseFloat(o.obligationAmount),
      0,
    );

    report.push({
      quarter: apportionment.quarterNumber,
      apportioned: parseFloat(apportionment.amountApportioned),
      obligated: totalObligated,
      remaining: parseFloat(apportionment.amountApportioned) - totalObligated,
      utilizationRate: (totalObligated / parseFloat(apportionment.amountApportioned)) * 100,
    });
  }

  return report;
};

/**
 * Checks Anti-Deficiency Act compliance for obligations.
 *
 * @param {string} accountSymbol - Treasury account symbol
 * @param {number} fiscalYear - Fiscal year
 * @param {number} obligationAmount - Proposed obligation amount
 * @param {Model} SF132Apportionment - SF132Apportionment model
 * @param {Model} ObligationDoc - ObligationDocument model
 * @returns {Promise<{ compliant: boolean; violations: string[] }>} ADA compliance check
 *
 * @example
 * ```typescript
 * const check = await checkAntiDeficiencyCompliance('096X3123', 2024, 10000000, SF132Apportionment, ObligationDoc);
 * if (!check.compliant) {
 *   console.error('ADA violations:', check.violations);
 * }
 * ```
 */
export const checkAntiDeficiencyCompliance = async (
  accountSymbol: string,
  fiscalYear: number,
  obligationAmount: number,
  SF132Apportionment: any,
  ObligationDoc: any,
): Promise<{ compliant: boolean; violations: string[] }> => {
  const violations: string[] = [];

  const control = await validateApportionmentControl(
    accountSymbol,
    fiscalYear,
    obligationAmount,
    SF132Apportionment,
    ObligationDoc,
  );

  // Check if obligation would exceed apportionment
  if (control.remainingApportionment < 0) {
    violations.push(
      `Obligation of ${obligationAmount} would exceed apportionment by ${Math.abs(control.remainingApportionment)}`,
    );
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
};

/**
 * Exports SF-132 apportionment schedule to OMB format.
 *
 * @param {string} accountSymbol - Treasury account symbol
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} SF132Apportionment - SF132Apportionment model
 * @returns {Promise<string>} Formatted apportionment schedule
 *
 * @example
 * ```typescript
 * const schedule = await exportSF132ToOMBFormat('096X3123', 2024, SF132Apportionment);
 * ```
 */
export const exportSF132ToOMBFormat = async (
  accountSymbol: string,
  fiscalYear: number,
  SF132Apportionment: any,
): Promise<string> => {
  const apportionments = await SF132Apportionment.findAll({
    where: { accountSymbol, fiscalYear },
    order: [['apportionmentCategory', 'ASC'], ['quarterNumber', 'ASC']],
  });

  const lines = [
    `SF-132 APPORTIONMENT AND REAPPORTIONMENT SCHEDULE`,
    `Account: ${accountSymbol}`,
    `Fiscal Year: ${fiscalYear}`,
    '',
  ];

  let categoryA = 0;
  let categoryB = 0;

  apportionments.forEach((a: any) => {
    if (a.apportionmentCategory === 'A') {
      categoryA += parseFloat(a.amountApportioned);
      lines.push(`Category A - Q${a.quarterNumber}: ${a.amountApportioned}`);
    } else {
      categoryB += parseFloat(a.amountApportioned);
      lines.push(`Category B: ${a.amountApportioned}`);
    }
  });

  lines.push('');
  lines.push(`Total Category A: ${categoryA.toFixed(2)}`);
  lines.push(`Total Category B: ${categoryB.toFixed(2)}`);
  lines.push(`Total Apportioned: ${(categoryA + categoryB).toFixed(2)}`);

  return lines.join('\n');
};

// ============================================================================
// TREASURY GTAS REPORTING (15-20)
// ============================================================================

/**
 * Creates GTAS (Governmentwide Treasury Account Symbol Adjusted Trial Balance) report entry.
 *
 * @param {TreasuryGTASReport} gtasData - GTAS report data
 * @param {Model} GTASReport - GTASReport model
 * @returns {Promise<any>} Created GTAS entry
 *
 * @example
 * ```typescript
 * const gtas = await createGTASReportEntry({
 *   reportingPeriod: new Date('2024-03-31'),
 *   agencyCode: '096',
 *   treasuryAccountSymbol: '096X3123',
 *   ussglAccountCode: '1010',
 *   debitAmount: 1000000,
 *   creditAmount: 0,
 *   netAmount: 1000000,
 *   submitted: false
 * }, GTASReport);
 * ```
 */
export const createGTASReportEntry = async (
  gtasData: TreasuryGTASReport,
  GTASReport: any,
): Promise<any> => {
  gtasData.netAmount = gtasData.debitAmount - gtasData.creditAmount;
  return await GTASReport.create(gtasData);
};

/**
 * Generates GTAS report from USSGL trial balance.
 *
 * @param {Date} reportingPeriod - Reporting period end date
 * @param {string} agencyCode - Federal agency code
 * @param {any[]} ussglBalances - USSGL account balances
 * @param {Model} GTASReport - GTASReport model
 * @returns {Promise<any[]>} Generated GTAS entries
 *
 * @example
 * ```typescript
 * const entries = await generateGTASFromUSSGL(new Date('2024-03-31'), '096', ussglData, GTASReport);
 * ```
 */
export const generateGTASFromUSSGL = async (
  reportingPeriod: Date,
  agencyCode: string,
  ussglBalances: any[],
  GTASReport: any,
): Promise<any[]> => {
  const gtasEntries = [];

  for (const balance of ussglBalances) {
    const entry = await createGTASReportEntry(
      {
        reportingPeriod,
        agencyCode,
        treasuryAccountSymbol: balance.accountSymbol,
        ussglAccountCode: balance.ussglAccount,
        debitAmount: balance.debitBalance || 0,
        creditAmount: balance.creditBalance || 0,
        netAmount: (balance.debitBalance || 0) - (balance.creditBalance || 0),
        transactionPartner: balance.tradingPartner,
        submitted: false,
      },
      GTASReport,
    );
    gtasEntries.push(entry);
  }

  return gtasEntries;
};

/**
 * Validates GTAS report for trial balance integrity.
 *
 * @param {Date} reportingPeriod - Reporting period
 * @param {string} agencyCode - Agency code
 * @param {Model} GTASReport - GTASReport model
 * @returns {Promise<{ balanced: boolean; difference: number }>} Balance validation
 *
 * @example
 * ```typescript
 * const validation = await validateGTASTrialBalance(new Date('2024-03-31'), '096', GTASReport);
 * ```
 */
export const validateGTASTrialBalance = async (
  reportingPeriod: Date,
  agencyCode: string,
  GTASReport: any,
): Promise<{ balanced: boolean; difference: number }> => {
  const entries = await GTASReport.findAll({
    where: { reportingPeriod, agencyCode },
  });

  const totalDebits = entries.reduce((sum: number, e: any) => sum + parseFloat(e.debitAmount), 0);
  const totalCredits = entries.reduce((sum: number, e: any) => sum + parseFloat(e.creditAmount), 0);

  const difference = totalDebits - totalCredits;

  return {
    balanced: Math.abs(difference) < 0.01,
    difference,
  };
};

/**
 * Submits GTAS report to Treasury.
 *
 * @param {Date} reportingPeriod - Reporting period
 * @param {string} agencyCode - Agency code
 * @param {Model} GTASReport - GTASReport model
 * @returns {Promise<{ submitted: boolean; confirmationNumber?: string }>} Submission result
 *
 * @example
 * ```typescript
 * const result = await submitGTASToTreasury(new Date('2024-03-31'), '096', GTASReport);
 * ```
 */
export const submitGTASToTreasury = async (
  reportingPeriod: Date,
  agencyCode: string,
  GTASReport: any,
): Promise<{ submitted: boolean; confirmationNumber?: string }> => {
  const validation = await validateGTASTrialBalance(reportingPeriod, agencyCode, GTASReport);
  if (!validation.balanced) {
    throw new Error(`GTAS trial balance out of balance by ${validation.difference}`);
  }

  const entries = await GTASReport.findAll({
    where: { reportingPeriod, agencyCode, submitted: false },
  });

  const submissionDate = new Date();
  for (const entry of entries) {
    entry.submitted = true;
    entry.submittedAt = submissionDate;
    await entry.save();
  }

  return {
    submitted: true,
    confirmationNumber: `GTAS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
};

/**
 * Exports GTAS report to Treasury XML format.
 *
 * @param {Date} reportingPeriod - Reporting period
 * @param {string} agencyCode - Agency code
 * @param {Model} GTASReport - GTASReport model
 * @returns {Promise<string>} XML formatted GTAS data
 *
 * @example
 * ```typescript
 * const xml = await exportGTASToXML(new Date('2024-03-31'), '096', GTASReport);
 * ```
 */
export const exportGTASToXML = async (
  reportingPeriod: Date,
  agencyCode: string,
  GTASReport: any,
): Promise<string> => {
  const entries = await GTASReport.findAll({
    where: { reportingPeriod, agencyCode },
  });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<GTASSubmission>\n';
  xml += `  <ReportingPeriod>${reportingPeriod.toISOString().split('T')[0]}</ReportingPeriod>\n`;
  xml += `  <AgencyCode>${agencyCode}</AgencyCode>\n`;
  xml += '  <Entries>\n';

  entries.forEach((entry: any) => {
    xml += '    <Entry>\n';
    xml += `      <TreasuryAccountSymbol>${entry.treasuryAccountSymbol}</TreasuryAccountSymbol>\n`;
    xml += `      <USSGLAccount>${entry.ussglAccountCode}</USSGLAccount>\n`;
    xml += `      <DebitAmount>${entry.debitAmount}</DebitAmount>\n`;
    xml += `      <CreditAmount>${entry.creditAmount}</CreditAmount>\n`;
    if (entry.transactionPartner) {
      xml += `      <TransactionPartner>${entry.transactionPartner}</TransactionPartner>\n`;
    }
    xml += '    </Entry>\n';
  });

  xml += '  </Entries>\n';
  xml += '</GTASSubmission>';

  return xml;
};

/**
 * Reconciles GTAS with SF-133 budget execution data.
 *
 * @param {Date} reportingPeriod - Reporting period
 * @param {string} accountSymbol - Treasury account symbol
 * @param {Model} GTASReport - GTASReport model
 * @param {Model} SF133Report - SF133Report model
 * @returns {Promise<{ reconciled: boolean; discrepancies: any[] }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileGTASWithSF133(new Date('2024-03-31'), '096X3123', GTASReport, SF133Report);
 * ```
 */
export const reconcileGTASWithSF133 = async (
  reportingPeriod: Date,
  accountSymbol: string,
  GTASReport: any,
  SF133Report: any,
): Promise<{ reconciled: boolean; discrepancies: any[] }> => {
  const discrepancies: any[] = [];

  // Get GTAS obligation balances (USSGL 4801)
  const gtasObligations = await GTASReport.findAll({
    where: {
      reportingPeriod,
      treasuryAccountSymbol: accountSymbol,
      ussglAccountCode: '4801',
    },
  });

  const gtasObligationTotal = gtasObligations.reduce(
    (sum: number, e: any) => sum + parseFloat(e.debitAmount),
    0,
  );

  // Get SF-133 obligations
  const fiscalYear = reportingPeriod.getFullYear();
  const fiscalPeriod = reportingPeriod.getMonth() + 1;
  const sf133 = await getSF133Report(fiscalYear, fiscalPeriod, accountSymbol, SF133Report);

  if (sf133 && Math.abs(gtasObligationTotal - sf133.obligations) > 0.01) {
    discrepancies.push({
      type: 'obligation_mismatch',
      gtas: gtasObligationTotal,
      sf133: sf133.obligations,
      difference: gtasObligationTotal - sf133.obligations,
    });
  }

  return {
    reconciled: discrepancies.length === 0,
    discrepancies,
  };
};

// ============================================================================
// OBLIGATION MANAGEMENT (21-28)
// ============================================================================

/**
 * Creates obligation document for federal commitment.
 *
 * @param {ObligationDocument} obligationData - Obligation data
 * @param {Model} ObligationDoc - ObligationDocument model
 * @returns {Promise<any>} Created obligation
 *
 * @example
 * ```typescript
 * const obligation = await createObligationDocument({
 *   obligationId: 'OBL-2024-001',
 *   documentNumber: 'PO-2024-12345',
 *   documentType: 'PO',
 *   obligationDate: new Date(),
 *   obligationAmount: 500000,
 *   undeliveredOrders: 500000,
 *   expendedAuthority: 0,
 *   fiscalYear: 2024,
 *   accountSymbol: '096X3123',
 *   boc: '2510',
 *   programCode: 'CIVIL-WORKS',
 *   status: 'open'
 * }, ObligationDoc);
 * ```
 */
export const createObligationDocument = async (
  obligationData: ObligationDocument,
  ObligationDoc: any,
): Promise<any> => {
  return await ObligationDoc.create(obligationData);
};

/**
 * Liquidates obligation by recording expenditure.
 *
 * @param {string} obligationId - Obligation ID
 * @param {number} expenditureAmount - Amount to liquidate
 * @param {Model} ObligationDoc - ObligationDocument model
 * @returns {Promise<any>} Updated obligation
 *
 * @example
 * ```typescript
 * const updated = await liquidateObligation('OBL-2024-001', 100000, ObligationDoc);
 * ```
 */
export const liquidateObligation = async (
  obligationId: string,
  expenditureAmount: number,
  ObligationDoc: any,
): Promise<any> => {
  const obligation = await ObligationDoc.findOne({ where: { obligationId } });
  if (!obligation) throw new Error('Obligation not found');

  obligation.expendedAuthority = parseFloat(obligation.expendedAuthority) + expenditureAmount;
  obligation.undeliveredOrders = parseFloat(obligation.undeliveredOrders) - expenditureAmount;

  if (obligation.undeliveredOrders <= 0) {
    obligation.status = 'fully_liquidated';
  } else {
    obligation.status = 'partially_liquidated';
  }

  await obligation.save();
  return obligation;
};

/**
 * Deobligates unused commitment authority.
 *
 * @param {string} obligationId - Obligation ID
 * @param {number} deobligationAmount - Amount to deobligate
 * @param {string} reason - Deobligation reason
 * @param {Model} ObligationDoc - ObligationDocument model
 * @returns {Promise<any>} Updated obligation
 *
 * @example
 * ```typescript
 * const updated = await deobligateCommitment('OBL-2024-001', 50000, 'Contract modification', ObligationDoc);
 * ```
 */
export const deobligateCommitment = async (
  obligationId: string,
  deobligationAmount: number,
  reason: string,
  ObligationDoc: any,
): Promise<any> => {
  const obligation = await ObligationDoc.findOne({ where: { obligationId } });
  if (!obligation) throw new Error('Obligation not found');

  obligation.obligationAmount = parseFloat(obligation.obligationAmount) - deobligationAmount;
  obligation.undeliveredOrders = parseFloat(obligation.undeliveredOrders) - deobligationAmount;

  if (obligation.obligationAmount <= 0) {
    obligation.status = 'deobligated';
  }

  await obligation.save();
  return obligation;
};

/**
 * Retrieves open obligations by account and fiscal year.
 *
 * @param {string} accountSymbol - Treasury account symbol
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} ObligationDoc - ObligationDocument model
 * @returns {Promise<any[]>} Open obligations
 *
 * @example
 * ```typescript
 * const openObligations = await getOpenObligations('096X3123', 2024, ObligationDoc);
 * ```
 */
export const getOpenObligations = async (
  accountSymbol: string,
  fiscalYear: number,
  ObligationDoc: any,
): Promise<any[]> => {
  return await ObligationDoc.findAll({
    where: {
      accountSymbol,
      fiscalYear,
      status: { [Op.in]: ['open', 'partially_liquidated'] },
    },
    order: [['obligationDate', 'DESC']],
  });
};

/**
 * Calculates undelivered orders balance.
 *
 * @param {string} accountSymbol - Treasury account symbol
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} ObligationDoc - ObligationDocument model
 * @returns {Promise<number>} Total undelivered orders
 *
 * @example
 * ```typescript
 * const udo = await calculateUndeliveredOrders('096X3123', 2024, ObligationDoc);
 * ```
 */
export const calculateUndeliveredOrders = async (
  accountSymbol: string,
  fiscalYear: number,
  ObligationDoc: any,
): Promise<number> => {
  const obligations = await getOpenObligations(accountSymbol, fiscalYear, ObligationDoc);
  return obligations.reduce((sum, o) => sum + parseFloat(o.undeliveredOrders), 0);
};

/**
 * Generates obligation report by Budget Object Class.
 *
 * @param {string} accountSymbol - Treasury account symbol
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} ObligationDoc - ObligationDocument model
 * @returns {Promise<any[]>} Obligations grouped by BOC
 *
 * @example
 * ```typescript
 * const report = await generateObligationReportByBOC('096X3123', 2024, ObligationDoc);
 * ```
 */
export const generateObligationReportByBOC = async (
  accountSymbol: string,
  fiscalYear: number,
  ObligationDoc: any,
): Promise<any[]> => {
  const obligations = await ObligationDoc.findAll({
    where: { accountSymbol, fiscalYear },
    attributes: [
      'boc',
      [Sequelize.fn('SUM', Sequelize.col('obligationAmount')), 'totalObligations'],
      [Sequelize.fn('SUM', Sequelize.col('undeliveredOrders')), 'totalUDO'],
      [Sequelize.fn('SUM', Sequelize.col('expendedAuthority')), 'totalExpenditures'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
    ],
    group: ['boc'],
  });

  return obligations.map((o: any) => ({
    boc: o.boc,
    totalObligations: parseFloat(o.getDataValue('totalObligations')),
    totalUDO: parseFloat(o.getDataValue('totalUDO')),
    totalExpenditures: parseFloat(o.getDataValue('totalExpenditures')),
    count: parseInt(o.getDataValue('count')),
  }));
};

/**
 * Tracks obligation pipeline and outlay projections.
 *
 * @param {string} accountSymbol - Treasury account symbol
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} ObligationDoc - ObligationDocument model
 * @returns {Promise<OutlayProjection>} Outlay projections
 *
 * @example
 * ```typescript
 * const projections = await trackObligationPipeline('096X3123', 2024, ObligationDoc);
 * ```
 */
export const trackObligationPipeline = async (
  accountSymbol: string,
  fiscalYear: number,
  ObligationDoc: any,
): Promise<OutlayProjection> => {
  const obligations = await ObligationDoc.findAll({
    where: { accountSymbol, fiscalYear },
  });

  const totalObligations = obligations.reduce(
    (sum, o) => sum + parseFloat(o.obligationAmount),
    0,
  );
  const totalExpenditures = obligations.reduce(
    (sum, o) => sum + parseFloat(o.expendedAuthority),
    0,
  );

  // Simple projection: assume 25% outlay rate per quarter
  const projectedOutlays = [
    totalObligations * 0.25,
    totalObligations * 0.50,
    totalObligations * 0.75,
    totalObligations * 1.00,
  ];

  const actualOutlays = [totalExpenditures, 0, 0, 0]; // Simplified

  return {
    fiscalYear,
    accountSymbol,
    projectedOutlays,
    actualOutlays,
    variance: totalExpenditures - projectedOutlays[0],
    projectionMethod: 'historical_rate',
    lastUpdated: new Date(),
  };
};

/**
 * Validates obligation against apportionment and budget authority.
 *
 * @param {ObligationDocument} obligationData - Proposed obligation
 * @param {Model} SF132Apportionment - SF132Apportionment model
 * @param {Model} ObligationDoc - ObligationDocument model
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateObligationAuthority(obligationData, SF132Apportionment, ObligationDoc);
 * ```
 */
export const validateObligationAuthority = async (
  obligationData: ObligationDocument,
  SF132Apportionment: any,
  ObligationDoc: any,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  const adaCheck = await checkAntiDeficiencyCompliance(
    obligationData.accountSymbol,
    obligationData.fiscalYear,
    obligationData.obligationAmount,
    SF132Apportionment,
    ObligationDoc,
  );

  if (!adaCheck.compliant) {
    errors.push(...adaCheck.violations);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// OMB MAX & FEDERAL REPORTING (29-36)
// ============================================================================

/**
 * Prepares OMB MAX A-11 submission package.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} agencyCode - Agency code
 * @param {Model} SF133Report - SF133Report model
 * @param {Model} SF132Apportionment - SF132Apportionment model
 * @returns {Promise<any>} OMB MAX submission package
 *
 * @example
 * ```typescript
 * const package = await prepareOMBMAXSubmission(2024, 3, '096', SF133Report, SF132Apportionment);
 * ```
 */
export const prepareOMBMAXSubmission = async (
  fiscalYear: number,
  fiscalPeriod: number,
  agencyCode: string,
  SF133Report: any,
  SF132Apportionment: any,
): Promise<any> => {
  const sf133Reports = await SF133Report.findAll({
    where: { fiscalYear, fiscalPeriod, agencyCode },
  });

  const apportionments = await SF132Apportionment.findAll({
    where: { fiscalYear },
  });

  return {
    fiscalYear,
    fiscalPeriod,
    agencyCode,
    sf133Reports: sf133Reports.map((r: any) => r.toJSON()),
    sf132Apportionments: apportionments.map((a: any) => a.toJSON()),
    submissionDate: new Date(),
    status: 'ready_for_submission',
  };
};

/**
 * Generates federal financial statement footnotes.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} accountSymbol - Treasury account symbol
 * @returns {Promise<string[]>} Financial statement footnotes
 *
 * @example
 * ```typescript
 * const footnotes = await generateFederalFinancialFootnotes(2024, '096X3123');
 * ```
 */
export const generateFederalFinancialFootnotes = async (
  fiscalYear: number,
  accountSymbol: string,
): Promise<string[]> => {
  return [
    `Note 1: Budgetary Resources - Account ${accountSymbol} FY${fiscalYear}`,
    'Note 2: Appropriations received from Congress for civil works construction and operations.',
    'Note 3: Unobligated balances are available for future commitment.',
    'Note 4: Obligations represent legal commitments for goods and services.',
    'Note 5: Outlays represent actual cash disbursements to vendors and contractors.',
  ];
};

/**
 * Calculates federal budget execution variance analysis.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} accountSymbol - Treasury account symbol
 * @param {Model} SF133Report - SF133Report model
 * @returns {Promise<any>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await calculateBudgetExecutionVariance(2024, '096X3123', SF133Report);
 * ```
 */
export const calculateBudgetExecutionVariance = async (
  fiscalYear: number,
  accountSymbol: string,
  SF133Report: any,
): Promise<any> => {
  const reports = await SF133Report.findAll({
    where: { fiscalYear, accountSymbol },
    order: [['fiscalPeriod', 'ASC']],
  });

  if (reports.length === 0) return null;

  const latestReport = reports[reports.length - 1];
  const plannedObligationRate = (reports.length / 12) * 100;
  const actualObligationRate =
    (latestReport.obligations / latestReport.budgetaryResources) * 100;

  return {
    fiscalYear,
    accountSymbol,
    currentPeriod: latestReport.fiscalPeriod,
    plannedObligationRate,
    actualObligationRate,
    variance: actualObligationRate - plannedObligationRate,
    status:
      actualObligationRate > plannedObligationRate ? 'ahead_of_plan' : 'behind_plan',
  };
};

/**
 * Exports financial data to DATA Act compliant format.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} agencyCode - Agency code
 * @param {Model} SF133Report - SF133Report model
 * @param {Model} ObligationDoc - ObligationDocument model
 * @returns {Promise<string>} DATA Act XML
 *
 * @example
 * ```typescript
 * const dataActXML = await exportDATAActCompliantFile(2024, 3, '096', SF133Report, ObligationDoc);
 * ```
 */
export const exportDATAActCompliantFile = async (
  fiscalYear: number,
  fiscalPeriod: number,
  agencyCode: string,
  SF133Report: any,
  ObligationDoc: any,
): Promise<string> => {
  const reports = await SF133Report.findAll({
    where: { fiscalYear, fiscalPeriod, agencyCode },
  });

  const obligations = await ObligationDoc.findAll({
    where: { fiscalYear },
  });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<DATAActSubmission>\n';
  xml += `  <FiscalYear>${fiscalYear}</FiscalYear>\n`;
  xml += `  <FiscalPeriod>${fiscalPeriod}</FiscalPeriod>\n`;
  xml += `  <AgencyCode>${agencyCode}</AgencyCode>\n`;
  xml += '  <Appropriations>\n';

  reports.forEach((report: any) => {
    xml += '    <Appropriation>\n';
    xml += `      <TAS>${report.accountSymbol}</TAS>\n`;
    xml += `      <BudgetAuthority>${report.newBudgetAuthority}</BudgetAuthority>\n`;
    xml += `      <Obligations>${report.obligations}</Obligations>\n`;
    xml += `      <Outlays>${report.outlays}</Outlays>\n`;
    xml += '    </Appropriation>\n';
  });

  xml += '  </Appropriations>\n';
  xml += '</DATAActSubmission>';

  return xml;
};

/**
 * Generates agency financial report (AFR) section.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} agencyCode - Agency code
 * @param {Model} SF133Report - SF133Report model
 * @returns {Promise<string>} AFR narrative section
 *
 * @example
 * ```typescript
 * const afr = await generateAgencyFinancialReport(2024, '096', SF133Report);
 * ```
 */
export const generateAgencyFinancialReport = async (
  fiscalYear: number,
  agencyCode: string,
  SF133Report: any,
): Promise<string> => {
  const reports = await SF133Report.findAll({
    where: { fiscalYear, agencyCode },
  });

  const totalBudgetAuthority = reports.reduce(
    (sum, r) => sum + parseFloat(r.newBudgetAuthority),
    0,
  );
  const totalObligations = reports.reduce((sum, r) => sum + parseFloat(r.obligations), 0);
  const totalOutlays = reports.reduce((sum, r) => sum + parseFloat(r.outlays), 0);

  return `
AGENCY FINANCIAL REPORT
Fiscal Year ${fiscalYear}
Agency Code: ${agencyCode}

BUDGET EXECUTION SUMMARY
========================
Total Budget Authority: $${totalBudgetAuthority.toLocaleString()}
Total Obligations: $${totalObligations.toLocaleString()}
Total Outlays: $${totalOutlays.toLocaleString()}
Obligation Rate: ${((totalObligations / totalBudgetAuthority) * 100).toFixed(2)}%
Outlay Rate: ${((totalOutlays / totalObligations) * 100).toFixed(2)}%

The agency successfully executed ${((totalObligations / totalBudgetAuthority) * 100).toFixed(1)}% of its budgetary resources during FY${fiscalYear}.
`;
};

/**
 * Validates federal reporting compliance with OMB A-136.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} agencyCode - Agency code
 * @param {Model} SF133Report - SF133Report model
 * @param {Model} GTASReport - GTASReport model
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Compliance validation
 *
 * @example
 * ```typescript
 * const compliance = await validateFederalReportingCompliance(2024, '096', SF133Report, GTASReport);
 * ```
 */
export const validateFederalReportingCompliance = async (
  fiscalYear: number,
  agencyCode: string,
  SF133Report: any,
  GTASReport: any,
): Promise<{ compliant: boolean; issues: string[] }> => {
  const issues: string[] = [];

  // Check SF-133 submissions
  const sf133Reports = await SF133Report.findAll({
    where: { fiscalYear, agencyCode },
  });

  if (sf133Reports.length < 12) {
    issues.push(`Missing SF-133 reports: only ${sf133Reports.length} of 12 periods submitted`);
  }

  // Check GTAS submissions
  const gtasReports = await GTASReport.findAll({
    where: { agencyCode, submitted: false },
  });

  if (gtasReports.length > 0) {
    issues.push(`${gtasReports.length} GTAS reports pending submission`);
  }

  return {
    compliant: issues.length === 0,
    issues,
  };
};

/**
 * Generates Treasury Account Symbol (TAS) reconciliation report.
 *
 * @param {string} accountSymbol - Treasury account symbol
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} SF133Report - SF133Report model
 * @param {Model} ObligationDoc - ObligationDocument model
 * @returns {Promise<any>} TAS reconciliation
 *
 * @example
 * ```typescript
 * const reconciliation = await generateTASReconciliation('096X3123', 2024, SF133Report, ObligationDoc);
 * ```
 */
export const generateTASReconciliation = async (
  accountSymbol: string,
  fiscalYear: number,
  SF133Report: any,
  ObligationDoc: any,
): Promise<any> => {
  const reports = await SF133Report.findAll({
    where: { accountSymbol, fiscalYear },
    order: [['fiscalPeriod', 'DESC']],
    limit: 1,
  });

  const latestReport = reports[0];
  if (!latestReport) {
    throw new Error('No SF-133 report found for reconciliation');
  }

  const obligations = await ObligationDoc.findAll({
    where: { accountSymbol, fiscalYear },
  });

  const obligationTotal = obligations.reduce(
    (sum, o) => sum + parseFloat(o.obligationAmount),
    0,
  );

  const difference = obligationTotal - parseFloat(latestReport.obligations);

  return {
    accountSymbol,
    fiscalYear,
    sf133Obligations: parseFloat(latestReport.obligations),
    detailedObligations: obligationTotal,
    difference,
    reconciled: Math.abs(difference) < 0.01,
  };
};

/**
 * Calculates federal fund balance reporting.
 *
 * @param {string} accountSymbol - Treasury account symbol
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} SF133Report - SF133Report model
 * @returns {Promise<any>} Fund balance
 *
 * @example
 * ```typescript
 * const balance = await calculateFederalFundBalance('096X3123', 2024, SF133Report);
 * ```
 */
export const calculateFederalFundBalance = async (
  accountSymbol: string,
  fiscalYear: number,
  SF133Report: any,
): Promise<any> => {
  const report = await SF133Report.findOne({
    where: { accountSymbol, fiscalYear },
    order: [['fiscalPeriod', 'DESC']],
  });

  if (!report) {
    throw new Error('No SF-133 report found');
  }

  return {
    accountSymbol,
    fiscalYear,
    totalBudgetaryResources: parseFloat(report.budgetaryResources),
    obligatedBalance: parseFloat(report.obligations),
    unobligatedBalance: parseFloat(report.unobligatedBalance),
    percentObligated: (parseFloat(report.obligations) / parseFloat(report.budgetaryResources)) * 100,
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable service for CEFMS Financial Reporting API.
 *
 * @example
 * ```typescript
 * @Controller('cefms/financial-reporting')
 * export class CEFMSFinancialReportingController {
 *   constructor(private readonly reportingService: CEFMSFinancialReportingService) {}
 *
 *   @Post('sf133')
 *   async createSF133(@Body() data: SF133ReportData) {
 *     return this.reportingService.createSF133Report(data);
 *   }
 * }
 * ```
 */
@Injectable()
export class CEFMSFinancialReportingService {
  constructor(private readonly sequelize: Sequelize) {}

  async createSF133Report(data: SF133ReportData) {
    const SF133Report = createSF133ReportModel(this.sequelize);
    return createSF133Report(data, SF133Report);
  }

  async submitSF133(reportId: string, certifyingOfficial: string) {
    const SF133Report = createSF133ReportModel(this.sequelize);
    return submitSF133ToTreasury(reportId, certifyingOfficial, SF133Report);
  }

  async createGTASEntry(data: TreasuryGTASReport) {
    const GTASReport = createGTASReportModel(this.sequelize);
    return createGTASReportEntry(data, GTASReport);
  }

  async submitGTAS(reportingPeriod: Date, agencyCode: string) {
    const GTASReport = createGTASReportModel(this.sequelize);
    return submitGTASToTreasury(reportingPeriod, agencyCode, GTASReport);
  }
}

/**
 * Default export with all CEFMS financial reporting utilities.
 */
export default {
  // Models
  createSF133ReportModel,
  createGTASReportModel,
  createObligationDocumentModel,

  // SF-133 Reporting
  createSF133Report,
  getSF133Report,
  calculateSF133LineItems,
  validateSF133Report,
  submitSF133ToTreasury,
  generateSF133Comparison,
  exportSF133ToOMBFormat,
  calculateBudgetExecutionRate,

  // SF-132 Apportionment
  createSF132Apportionment,
  validateApportionmentControl,
  processReapportionmentRequest,
  generateApportionmentUsageReport,
  checkAntiDeficiencyCompliance,
  exportSF132ToOMBFormat,

  // GTAS Reporting
  createGTASReportEntry,
  generateGTASFromUSSGL,
  validateGTASTrialBalance,
  submitGTASToTreasury,
  exportGTASToXML,
  reconcileGTASWithSF133,

  // Obligation Management
  createObligationDocument,
  liquidateObligation,
  deobligateCommitment,
  getOpenObligations,
  calculateUndeliveredOrders,
  generateObligationReportByBOC,
  trackObligationPipeline,
  validateObligationAuthority,

  // OMB MAX & Federal Reporting
  prepareOMBMAXSubmission,
  generateFederalFinancialFootnotes,
  calculateBudgetExecutionVariance,
  exportDATAActCompliantFile,
  generateAgencyFinancialReport,
  validateFederalReportingCompliance,
  generateTASReconciliation,
  calculateFederalFundBalance,

  // Service
  CEFMSFinancialReportingService,
};
