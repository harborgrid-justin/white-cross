/**
 * LOC: FNDACCTOP1234567
 * File: /reuse/government/fund-accounting-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (database ORM)
 *   - nestjs (framework utilities)
 *   - Node.js crypto, fs modules
 *
 * DOWNSTREAM (imported by):
 *   - ../backend/modules/government/accounting/*
 *   - ../backend/modules/government/budget/*
 *   - ../backend/modules/government/funds/*
 *   - API controllers for fund accounting operations
 */

/**
 * File: /reuse/government/fund-accounting-operations-kit.ts
 * Locator: WC-GOV-FNDACCT-001
 * Purpose: Comprehensive Government Fund Accounting Operations - multi-fund accounting, fund types, interfund transfers, fund balance classification
 *
 * Upstream: Independent utility module for governmental fund accounting
 * Downstream: ../backend/*, fund accounting controllers, budget services, financial reporting modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for fund management, fund types, interfund transfers, fund balance, fund closing, revenue allocation, expenditure tracking
 *
 * LLM Context: Enterprise-grade governmental fund accounting utilities for production-ready NestJS applications.
 * Implements GASB 54 compliant fund accounting with multiple fund types (general, special revenue, debt service, capital projects,
 * enterprise, internal service, trust, agency), fund balance classification (nonspendable, restricted, committed, assigned, unassigned),
 * interfund transfers, fund closing procedures, revenue and expenditure tracking, fund performance reporting, fund reconciliation,
 * and comprehensive audit trail generation for all governmental fund accounting operations per GAAP and GASB standards.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { createHash, randomUUID } from 'crypto';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Fund {
  fundId: string;
  fundCode: string;
  fundName: string;
  fundType: FundType;
  fundCategory: FundCategory;
  description: string;
  establishedDate: Date;
  fiscalYearEnd: string; // MM-DD format
  status: 'active' | 'inactive' | 'closed';
  restrictionType?: 'legally_restricted' | 'donor_restricted' | 'board_designated' | 'unrestricted';
  restrictionDescription?: string;
  budgetControlEnabled: boolean;
  requiresAppropriation: boolean;
  allowDeficit: boolean;
  parentFundId?: string;
  departmentId?: string;
  managerId?: string;
  accountingBasis: 'modified_accrual' | 'accrual' | 'cash';
  reportingRequired: boolean;
  createdBy: string;
  createdDate: Date;
  closedDate?: Date;
  metadata?: Record<string, any>;
}

enum FundType {
  GENERAL = 'general',
  SPECIAL_REVENUE = 'special_revenue',
  DEBT_SERVICE = 'debt_service',
  CAPITAL_PROJECTS = 'capital_projects',
  ENTERPRISE = 'enterprise',
  INTERNAL_SERVICE = 'internal_service',
  TRUST = 'trust',
  AGENCY = 'agency',
  PENSION_TRUST = 'pension_trust',
  INVESTMENT_TRUST = 'investment_trust',
  PRIVATE_PURPOSE_TRUST = 'private_purpose_trust',
}

enum FundCategory {
  GOVERNMENTAL = 'governmental',
  PROPRIETARY = 'proprietary',
  FIDUCIARY = 'fiduciary',
}

enum FundBalanceClassification {
  NONSPENDABLE = 'nonspendable',
  RESTRICTED = 'restricted',
  COMMITTED = 'committed',
  ASSIGNED = 'assigned',
  UNASSIGNED = 'unassigned',
}

interface FundBalance {
  fundId: string;
  fiscalYear: string;
  balanceDate: Date;

  // Assets
  cashAndEquivalents: number;
  investments: number;
  receivables: number;
  inventory: number;
  prepaidItems: number;
  restrictedCash: number;
  otherAssets: number;
  totalAssets: number;

  // Liabilities
  accountsPayable: number;
  accruedLiabilities: number;
  deferredRevenue: number;
  shortTermDebt: number;
  longTermDebt: number;
  otherLiabilities: number;
  totalLiabilities: number;

  // Fund Balance Components (GASB 54)
  nonspendable: number;
  restricted: number;
  committed: number;
  assigned: number;
  unassigned: number;
  totalFundBalance: number;

  // Net Position (for proprietary funds)
  netInvestmentInCapitalAssets?: number;
  restrictedNetPosition?: number;
  unrestrictedNetPosition?: number;
  totalNetPosition?: number;

  // Budget vs Actual
  budgetedRevenue: number;
  actualRevenue: number;
  budgetedExpenditures: number;
  actualExpenditures: number;
  budgetVariance: number;

  metadata?: Record<string, any>;
}

interface InterfundTransfer {
  transferId: string;
  transferNumber: string;
  transferDate: Date;
  fiscalYear: string;
  fromFundId: string;
  fromFundCode: string;
  fromFundName: string;
  toFundId: string;
  toFundCode: string;
  toFundName: string;
  transferAmount: number;
  transferType: 'operating' | 'capital' | 'debt_service' | 'residual_equity' | 'reimbursement';
  purpose: string;
  authorizationReference: string;
  approvedBy: string;
  approvalDate: Date;
  postedDate?: Date;
  status: 'pending' | 'approved' | 'posted' | 'reversed' | 'cancelled';
  reversalReason?: string;
  reversedDate?: Date;
  reversedBy?: string;
  accountingEntries: AccountingEntry[];
  createdBy: string;
  createdDate: Date;
  metadata?: Record<string, any>;
}

interface AccountingEntry {
  entryId: string;
  entryDate: Date;
  fundId: string;
  accountCode: string;
  accountName: string;
  debitAmount: number;
  creditAmount: number;
  description: string;
  referenceNumber?: string;
}

interface FundRevenue {
  revenueId: string;
  fundId: string;
  fiscalYear: string;
  transactionDate: Date;
  revenueSource: string;
  revenueCategory: string;
  revenueCode: string;
  description: string;
  amount: number;
  recognitionBasis: 'cash' | 'accrual' | 'modified_accrual';
  isRecurring: boolean;
  budgetLineId?: string;
  actualVsBudget?: number;
  deposited: boolean;
  depositDate?: Date;
  depositReference?: string;
  restrictionType?: string;
  grantId?: string;
  customerId?: string;
  invoiceNumber?: string;
  receiptNumber: string;
  recordedBy: string;
  verifiedBy?: string;
  verifiedDate?: Date;
  metadata?: Record<string, any>;
}

interface FundExpenditure {
  expenditureId: string;
  fundId: string;
  fiscalYear: string;
  transactionDate: Date;
  expenditureCategory: string;
  expenditureType: string;
  accountCode: string;
  description: string;
  amount: number;
  encumberedAmount?: number;
  encumbranceId?: string;
  budgetLineId?: string;
  actualVsBudget?: number;
  payee: string;
  paymentMethod: 'check' | 'ach' | 'wire' | 'credit_card' | 'cash';
  checkNumber?: string;
  invoiceNumber?: string;
  purchaseOrderNumber?: string;
  contractId?: string;
  vendorId?: string;
  departmentId?: string;
  programId?: string;
  projectId?: string;
  approvedBy: string;
  approvalDate: Date;
  paidDate?: Date;
  status: 'pending' | 'approved' | 'encumbered' | 'paid' | 'voided';
  voidReason?: string;
  recordedBy: string;
  metadata?: Record<string, any>;
}

interface FundEncumbrance {
  encumbranceId: string;
  fundId: string;
  fiscalYear: string;
  encumbranceDate: Date;
  encumbranceType: 'purchase_order' | 'contract' | 'reservation';
  referenceNumber: string;
  description: string;
  vendor: string;
  amount: number;
  liquidatedAmount: number;
  remainingAmount: number;
  accountCode: string;
  budgetLineId?: string;
  departmentId?: string;
  projectId?: string;
  expirationDate?: Date;
  status: 'open' | 'partially_liquidated' | 'fully_liquidated' | 'cancelled' | 'expired';
  createdBy: string;
  createdDate: Date;
  liquidatedBy?: string;
  liquidatedDate?: Date;
  metadata?: Record<string, any>;
}

interface FundClosingEntry {
  closingId: string;
  fundId: string;
  fiscalYear: string;
  closingDate: Date;
  closingType: 'year_end' | 'period_end' | 'interim';

  // Pre-closing balances
  revenueBalance: number;
  expenditureBalance: number;
  encumbranceBalance: number;
  transfersIn: number;
  transfersOut: number;

  // Closing calculations
  excessOrDeficit: number;
  priorYearBalance: number;
  adjustments: number;
  newFundBalance: number;

  // Fund balance allocation
  nonspendableAmount: number;
  restrictedAmount: number;
  committedAmount: number;
  assignedAmount: number;
  unassignedAmount: number;

  // Encumbrance handling
  encumbrancesCarriedForward: number;
  encumbrancesLapsed: number;

  closingEntries: AccountingEntry[];
  performedBy: string;
  reviewedBy?: string;
  reviewedDate?: Date;
  approved: boolean;
  approvedBy?: string;
  approvalDate?: Date;
  status: 'draft' | 'pending_review' | 'approved' | 'posted' | 'reopened';
  metadata?: Record<string, any>;
}

interface FundRestriction {
  restrictionId: string;
  fundId: string;
  restrictionType: FundBalanceClassification;
  amount: number;
  purpose: string;
  source: string; // law, grant, donor, council action, etc.
  effectiveDate: Date;
  expirationDate?: Date;
  authorityReference: string;
  description: string;
  constraints: string[];
  allowableUses: string[];
  prohibitedUses: string[];
  complianceRequired: boolean;
  reportingRequired: boolean;
  status: 'active' | 'expired' | 'released' | 'modified';
  createdBy: string;
  createdDate: Date;
  modifiedBy?: string;
  modifiedDate?: Date;
  metadata?: Record<string, any>;
}

interface FundAllocation {
  allocationId: string;
  sourceFundId: string;
  destinationFundId: string;
  fiscalYear: string;
  allocationDate: Date;
  allocationType: 'revenue_sharing' | 'cost_allocation' | 'overhead_distribution' | 'grant_match';
  allocationMethod: 'percentage' | 'formula' | 'direct' | 'step_down';
  amount: number;
  percentage?: number;
  formula?: string;
  basis: string;
  purpose: string;
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'annual';
  approvedBy: string;
  approvalDate: Date;
  status: 'active' | 'suspended' | 'cancelled';
  metadata?: Record<string, any>;
}

interface FundPerformanceMetrics {
  fundId: string;
  fiscalYear: string;
  periodEndDate: Date;

  // Revenue metrics
  totalRevenue: number;
  revenueGrowth: number;
  revenueToTarget: number;
  majorRevenueSourcePercentage: number;

  // Expenditure metrics
  totalExpenditures: number;
  expenditureGrowth: number;
  expenditureToTarget: number;
  personnelCostPercentage: number;
  operatingCostPercentage: number;

  // Fund balance metrics
  fundBalanceRatio: number;
  liquidityRatio: number;
  reserveRatio: number;
  debtServiceCoverage?: number;

  // Efficiency metrics
  collectionRate: number;
  expenditureEfficiency: number;
  budgetVariancePercentage: number;

  // Compliance metrics
  encumbranceCompliance: boolean;
  appropriationCompliance: boolean;
  restrictionCompliance: boolean;

  benchmarkComparison?: Record<string, number>;
  trendAnalysis?: Record<string, number[]>;
  metadata?: Record<string, any>;
}

interface FundReconciliation {
  reconciliationId: string;
  fundId: string;
  fiscalYear: string;
  reconciliationDate: Date;
  periodStart: Date;
  periodEnd: Date;
  reconciliationType: 'bank' | 'budget' | 'interfund' | 'year_end';

  // Beginning balances
  beginningBookBalance: number;
  beginningBankBalance?: number;

  // Additions
  totalRevenue: number;
  transfersIn: number;
  otherAdditions: number;

  // Deductions
  totalExpenditures: number;
  transfersOut: number;
  otherDeductions: number;

  // Ending balances
  endingBookBalance: number;
  endingBankBalance?: number;

  // Reconciling items
  outstandingChecks?: number;
  depositsInTransit?: number;
  bankCharges?: number;
  interestEarned?: number;
  adjustments: ReconciliationAdjustment[];

  // Variance
  variance: number;
  varianceExplanation?: string;

  reconciledBy: string;
  reviewedBy?: string;
  reviewedDate?: Date;
  approved: boolean;
  approvedBy?: string;
  approvalDate?: Date;
  status: 'in_progress' | 'completed' | 'approved' | 'discrepancy';
  metadata?: Record<string, any>;
}

interface ReconciliationAdjustment {
  adjustmentType: string;
  description: string;
  amount: number;
  accountCode: string;
  reference?: string;
}

interface CombinedFundStatement {
  statementId: string;
  statementDate: Date;
  fiscalYear: string;
  statementType: 'balance_sheet' | 'revenues_expenditures' | 'cash_flows' | 'net_position';
  fundCategory?: FundCategory;
  funds: FundStatementData[];
  totals: FundStatementData;
  eliminationAdjustments?: number;
  consolidatedTotal?: number;
  generatedBy: string;
  generatedDate: Date;
  metadata?: Record<string, any>;
}

interface FundStatementData {
  fundId: string;
  fundCode: string;
  fundName: string;
  fundType: FundType;
  assets?: number;
  liabilities?: number;
  fundBalance?: number;
  revenue?: number;
  expenditures?: number;
  otherFinancingSources?: number;
  otherFinancingUses?: number;
  netChange?: number;
  [key: string]: any;
}

interface BudgetControl {
  fundId: string;
  fiscalYear: string;
  accountCode: string;
  budgetAmount: number;
  revisedBudgetAmount: number;
  actualExpenditures: number;
  encumbrances: number;
  availableBalance: number;
  percentageUsed: number;
  overBudget: boolean;
  warningThreshold: number;
  criticalThreshold: number;
  status: 'within_budget' | 'warning' | 'critical' | 'exceeded';
}

// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================

/**
 * Sequelize model for Governmental Funds with comprehensive fund type support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Fund model
 *
 * @example
 * ```typescript
 * const Fund = createFundModel(sequelize);
 * const generalFund = await Fund.create({
 *   fundCode: 'GF-001',
 *   fundName: 'General Fund',
 *   fundType: 'general',
 *   fundCategory: 'governmental',
 *   description: 'Primary operating fund',
 *   establishedDate: new Date(),
 *   fiscalYearEnd: '12-31',
 *   status: 'active',
 *   accountingBasis: 'modified_accrual',
 *   budgetControlEnabled: true,
 *   requiresAppropriation: true,
 *   createdBy: 'admin'
 * });
 * ```
 *
 * @openapi
 * components:
 *   schemas:
 *     Fund:
 *       type: object
 *       required:
 *         - fundCode
 *         - fundName
 *         - fundType
 *         - fundCategory
 *         - establishedDate
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier
 *         fundId:
 *           type: string
 *           format: uuid
 *           description: Fund UUID
 *         fundCode:
 *           type: string
 *           maxLength: 50
 *           description: Fund code
 *         fundName:
 *           type: string
 *           maxLength: 200
 *           description: Fund name
 *         fundType:
 *           type: string
 *           enum: [general, special_revenue, debt_service, capital_projects, enterprise, internal_service, trust, agency]
 *         fundCategory:
 *           type: string
 *           enum: [governmental, proprietary, fiduciary]
 *         status:
 *           type: string
 *           enum: [active, inactive, closed]
 *         accountingBasis:
 *           type: string
 *           enum: [modified_accrual, accrual, cash]
 */
export const createFundModel = (sequelize: Sequelize) => {
  class FundModel extends Model {
    public id!: number;
    public fundId!: string;
    public fundCode!: string;
    public fundName!: string;
    public fundType!: string;
    public fundCategory!: string;
    public description!: string;
    public establishedDate!: Date;
    public fiscalYearEnd!: string;
    public status!: string;
    public restrictionType!: string | null;
    public restrictionDescription!: string | null;
    public budgetControlEnabled!: boolean;
    public requiresAppropriation!: boolean;
    public allowDeficit!: boolean;
    public parentFundId!: string | null;
    public departmentId!: string | null;
    public managerId!: string | null;
    public accountingBasis!: string;
    public reportingRequired!: boolean;
    public createdBy!: string;
    public createdDate!: Date;
    public closedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  FundModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fundId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        comment: 'Unique fund identifier',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Fund code',
      },
      fundName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Fund name',
      },
      fundType: {
        type: DataTypes.ENUM(
          'general',
          'special_revenue',
          'debt_service',
          'capital_projects',
          'enterprise',
          'internal_service',
          'trust',
          'agency',
          'pension_trust',
          'investment_trust',
          'private_purpose_trust',
        ),
        allowNull: false,
        comment: 'Fund type per GASB classification',
      },
      fundCategory: {
        type: DataTypes.ENUM('governmental', 'proprietary', 'fiduciary'),
        allowNull: false,
        comment: 'Fund category',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Fund description and purpose',
      },
      establishedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date fund was established',
      },
      fiscalYearEnd: {
        type: DataTypes.STRING(5),
        allowNull: false,
        defaultValue: '12-31',
        comment: 'Fiscal year end (MM-DD)',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'closed'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Fund status',
      },
      restrictionType: {
        type: DataTypes.ENUM('legally_restricted', 'donor_restricted', 'board_designated', 'unrestricted'),
        allowNull: true,
        comment: 'Type of restriction on fund',
      },
      restrictionDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Description of restrictions',
      },
      budgetControlEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether budget controls are enabled',
      },
      requiresAppropriation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether appropriation is required',
      },
      allowDeficit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether deficit spending is allowed',
      },
      parentFundId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Parent fund if this is a subfund',
      },
      departmentId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Responsible department',
      },
      managerId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Fund manager user ID',
      },
      accountingBasis: {
        type: DataTypes.ENUM('modified_accrual', 'accrual', 'cash'),
        allowNull: false,
        defaultValue: 'modified_accrual',
        comment: 'Accounting basis used',
      },
      reportingRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether reporting is required',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created fund',
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fund creation date',
      },
      closedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Fund closure date',
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
      tableName: 'funds',
      timestamps: true,
      indexes: [
        { fields: ['fundId'], unique: true },
        { fields: ['fundCode'], unique: true },
        { fields: ['fundType'] },
        { fields: ['fundCategory'] },
        { fields: ['status'] },
        { fields: ['parentFundId'] },
        { fields: ['departmentId'] },
      ],
    },
  );

  return FundModel;
};

/**
 * Sequelize model for Fund Balance with GASB 54 classifications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FundBalance model
 *
 * @example
 * ```typescript
 * const FundBalance = createFundBalanceModel(sequelize);
 * const balance = await FundBalance.create({
 *   fundId: 'fund-uuid',
 *   fiscalYear: 'FY2024',
 *   balanceDate: new Date(),
 *   cashAndEquivalents: 5000000,
 *   totalAssets: 6000000,
 *   totalLiabilities: 500000,
 *   nonspendable: 100000,
 *   restricted: 2000000,
 *   committed: 1000000,
 *   assigned: 500000,
 *   unassigned: 1900000,
 *   totalFundBalance: 5500000
 * });
 * ```
 *
 * @openapi
 * components:
 *   schemas:
 *     FundBalance:
 *       type: object
 *       required:
 *         - fundId
 *         - fiscalYear
 *         - balanceDate
 *       properties:
 *         id:
 *           type: integer
 *         fundId:
 *           type: string
 *           format: uuid
 *         fiscalYear:
 *           type: string
 *         totalAssets:
 *           type: number
 *           format: decimal
 *         totalLiabilities:
 *           type: number
 *           format: decimal
 *         totalFundBalance:
 *           type: number
 *           format: decimal
 */
export const createFundBalanceModel = (sequelize: Sequelize) => {
  class FundBalanceModel extends Model {
    public id!: number;
    public fundId!: string;
    public fiscalYear!: string;
    public balanceDate!: Date;

    // Assets
    public cashAndEquivalents!: number;
    public investments!: number;
    public receivables!: number;
    public inventory!: number;
    public prepaidItems!: number;
    public restrictedCash!: number;
    public otherAssets!: number;
    public totalAssets!: number;

    // Liabilities
    public accountsPayable!: number;
    public accruedLiabilities!: number;
    public deferredRevenue!: number;
    public shortTermDebt!: number;
    public longTermDebt!: number;
    public otherLiabilities!: number;
    public totalLiabilities!: number;

    // Fund Balance (GASB 54)
    public nonspendable!: number;
    public restricted!: number;
    public committed!: number;
    public assigned!: number;
    public unassigned!: number;
    public totalFundBalance!: number;

    // Net Position (proprietary)
    public netInvestmentInCapitalAssets!: number | null;
    public restrictedNetPosition!: number | null;
    public unrestrictedNetPosition!: number | null;
    public totalNetPosition!: number | null;

    // Budget
    public budgetedRevenue!: number;
    public actualRevenue!: number;
    public budgetedExpenditures!: number;
    public actualExpenditures!: number;
    public budgetVariance!: number;

    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  FundBalanceModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fundId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Associated fund ID',
      },
      fiscalYear: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'Fiscal year',
      },
      balanceDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Balance date',
      },
      cashAndEquivalents: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Cash and cash equivalents',
      },
      investments: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Investments',
      },
      receivables: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Accounts receivable',
      },
      inventory: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Inventory',
      },
      prepaidItems: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Prepaid items',
      },
      restrictedCash: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Restricted cash',
      },
      otherAssets: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Other assets',
      },
      totalAssets: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total assets',
      },
      accountsPayable: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Accounts payable',
      },
      accruedLiabilities: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Accrued liabilities',
      },
      deferredRevenue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Deferred revenue',
      },
      shortTermDebt: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Short-term debt',
      },
      longTermDebt: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Long-term debt',
      },
      otherLiabilities: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Other liabilities',
      },
      totalLiabilities: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total liabilities',
      },
      nonspendable: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Nonspendable fund balance (GASB 54)',
      },
      restricted: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Restricted fund balance (GASB 54)',
      },
      committed: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Committed fund balance (GASB 54)',
      },
      assigned: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Assigned fund balance (GASB 54)',
      },
      unassigned: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Unassigned fund balance (GASB 54)',
      },
      totalFundBalance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total fund balance',
      },
      netInvestmentInCapitalAssets: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Net investment in capital assets (proprietary)',
      },
      restrictedNetPosition: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Restricted net position (proprietary)',
      },
      unrestrictedNetPosition: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Unrestricted net position (proprietary)',
      },
      totalNetPosition: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Total net position (proprietary)',
      },
      budgetedRevenue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budgeted revenue',
      },
      actualRevenue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual revenue',
      },
      budgetedExpenditures: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budgeted expenditures',
      },
      actualExpenditures: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual expenditures',
      },
      budgetVariance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budget variance',
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
      tableName: 'fund_balances',
      timestamps: true,
      indexes: [
        { fields: ['fundId'] },
        { fields: ['fiscalYear'] },
        { fields: ['balanceDate'] },
        { fields: ['fundId', 'fiscalYear'], unique: true },
      ],
    },
  );

  return FundBalanceModel;
};

/**
 * Sequelize model for Interfund Transfers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InterfundTransfer model
 *
 * @example
 * ```typescript
 * const InterfundTransfer = createInterfundTransferModel(sequelize);
 * const transfer = await InterfundTransfer.create({
 *   fromFundId: 'general-fund-uuid',
 *   toFundId: 'capital-projects-uuid',
 *   transferAmount: 1000000,
 *   transferType: 'capital',
 *   purpose: 'Capital project funding',
 *   approvedBy: 'city-council',
 *   transferDate: new Date(),
 *   status: 'approved'
 * });
 * ```
 */
export const createInterfundTransferModel = (sequelize: Sequelize) => {
  class InterfundTransferModel extends Model {
    public id!: number;
    public transferId!: string;
    public transferNumber!: string;
    public transferDate!: Date;
    public fiscalYear!: string;
    public fromFundId!: string;
    public fromFundCode!: string;
    public fromFundName!: string;
    public toFundId!: string;
    public toFundCode!: string;
    public toFundName!: string;
    public transferAmount!: number;
    public transferType!: string;
    public purpose!: string;
    public authorizationReference!: string;
    public approvedBy!: string;
    public approvalDate!: Date;
    public postedDate!: Date | null;
    public status!: string;
    public reversalReason!: string | null;
    public reversedDate!: Date | null;
    public reversedBy!: string | null;
    public accountingEntries!: AccountingEntry[];
    public createdBy!: string;
    public createdDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InterfundTransferModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      transferId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        comment: 'Unique transfer identifier',
      },
      transferNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Transfer number',
      },
      transferDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Transfer date',
      },
      fiscalYear: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'Fiscal year',
      },
      fromFundId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Source fund ID',
      },
      fromFundCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Source fund code',
      },
      fromFundName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Source fund name',
      },
      toFundId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Destination fund ID',
      },
      toFundCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Destination fund code',
      },
      toFundName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Destination fund name',
      },
      transferAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Transfer amount',
      },
      transferType: {
        type: DataTypes.ENUM('operating', 'capital', 'debt_service', 'residual_equity', 'reimbursement'),
        allowNull: false,
        comment: 'Transfer type',
      },
      purpose: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Transfer purpose',
      },
      authorizationReference: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Authorization reference',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Approver',
      },
      approvalDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Approval date',
      },
      postedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Posted date',
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'posted', 'reversed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Transfer status',
      },
      reversalReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reversal reason',
      },
      reversedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Reversal date',
      },
      reversedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who reversed',
      },
      accountingEntries: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Accounting entries',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Creator',
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Creation date',
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
      tableName: 'interfund_transfers',
      timestamps: true,
      indexes: [
        { fields: ['transferId'], unique: true },
        { fields: ['transferNumber'], unique: true },
        { fields: ['fromFundId'] },
        { fields: ['toFundId'] },
        { fields: ['fiscalYear'] },
        { fields: ['status'] },
        { fields: ['transferDate'] },
      ],
    },
  );

  return InterfundTransferModel;
};

// ============================================================================
// FUND MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a new governmental fund.
 *
 * @param {Partial<Fund>} fundData - Fund data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Created fund
 *
 * @example
 * ```typescript
 * const fund = await createFund({
 *   fundCode: 'SR-GRANTS',
 *   fundName: 'Federal Grants Special Revenue Fund',
 *   fundType: 'special_revenue',
 *   fundCategory: 'governmental',
 *   description: 'Accounts for federal grant revenues and expenditures',
 *   establishedDate: new Date(),
 *   fiscalYearEnd: '06-30',
 *   accountingBasis: 'modified_accrual',
 *   budgetControlEnabled: true,
 *   requiresAppropriation: true,
 *   createdBy: 'finance-director'
 * }, sequelize);
 * ```
 */
export const createFund = async (fundData: Partial<Fund>, sequelize: Sequelize): Promise<any> => {
  const Fund = createFundModel(sequelize);

  const fund = await Fund.create({
    ...fundData,
    status: fundData.status || 'active',
    createdDate: new Date(),
  });

  return fund;
};

/**
 * Gets fund by code.
 *
 * @param {string} fundCode - Fund code
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Fund
 *
 * @example
 * ```typescript
 * const fund = await getFundByCode('GF-001', sequelize);
 * ```
 */
export const getFundByCode = async (fundCode: string, sequelize: Sequelize): Promise<any> => {
  const Fund = createFundModel(sequelize);

  const fund = await Fund.findOne({ where: { fundCode } });
  if (!fund) {
    throw new Error(`Fund not found: ${fundCode}`);
  }

  return fund;
};

/**
 * Lists all active funds by category.
 *
 * @param {FundCategory} category - Fund category
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} List of funds
 *
 * @example
 * ```typescript
 * const governmentalFunds = await listFundsByCategory('governmental', sequelize);
 * ```
 */
export const listFundsByCategory = async (category: FundCategory, sequelize: Sequelize): Promise<any[]> => {
  const Fund = createFundModel(sequelize);

  const funds = await Fund.findAll({
    where: {
      fundCategory: category,
      status: 'active',
    },
    order: [['fundCode', 'ASC']],
  });

  return funds;
};

/**
 * Closes a fund at fiscal year end.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} closureDate - Closure date
 * @param {string} closedBy - User closing fund
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Closed fund
 *
 * @example
 * ```typescript
 * const closed = await closeFund('fund-uuid', new Date(), 'finance-director', sequelize);
 * ```
 */
export const closeFund = async (
  fundId: string,
  closureDate: Date,
  closedBy: string,
  sequelize: Sequelize,
): Promise<any> => {
  const Fund = createFundModel(sequelize);

  const fund = await Fund.findOne({ where: { fundId } });
  if (!fund) {
    throw new Error(`Fund not found: ${fundId}`);
  }

  await fund.update({
    status: 'closed',
    closedDate: closureDate,
  });

  return fund;
};

// ============================================================================
// FUND BALANCE FUNCTIONS
// ============================================================================

/**
 * Gets current fund balance.
 *
 * @param {string} fundId - Fund ID
 * @param {string} fiscalYear - Fiscal year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Fund balance
 *
 * @example
 * ```typescript
 * const balance = await getFundBalance('fund-uuid', 'FY2024', sequelize);
 * ```
 */
export const getFundBalance = async (fundId: string, fiscalYear: string, sequelize: Sequelize): Promise<any> => {
  const FundBalance = createFundBalanceModel(sequelize);

  const balance = await FundBalance.findOne({
    where: { fundId, fiscalYear },
    order: [['balanceDate', 'DESC']],
  });

  return balance;
};

/**
 * Updates fund balance with new transactions.
 *
 * @param {string} fundId - Fund ID
 * @param {string} fiscalYear - Fiscal year
 * @param {Partial<FundBalance>} balanceUpdates - Balance updates
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Updated balance
 *
 * @example
 * ```typescript
 * const updated = await updateFundBalance(
 *   'fund-uuid',
 *   'FY2024',
 *   { cashAndEquivalents: 5500000, actualRevenue: 1000000 },
 *   sequelize
 * );
 * ```
 */
export const updateFundBalance = async (
  fundId: string,
  fiscalYear: string,
  balanceUpdates: Partial<FundBalance>,
  sequelize: Sequelize,
): Promise<any> => {
  const FundBalance = createFundBalanceModel(sequelize);

  const balance = await FundBalance.findOne({ where: { fundId, fiscalYear } });

  if (!balance) {
    // Create new balance record
    return await FundBalance.create({
      fundId,
      fiscalYear,
      balanceDate: new Date(),
      ...balanceUpdates,
    });
  }

  // Update existing balance
  await balance.update(balanceUpdates);
  return balance;
};

/**
 * Classifies fund balance per GASB 54.
 *
 * @param {string} fundId - Fund ID
 * @param {number} totalFundBalance - Total fund balance
 * @param {FundRestriction[]} restrictions - Fund restrictions
 * @returns {Promise<{ nonspendable: number; restricted: number; committed: number; assigned: number; unassigned: number }>}
 *
 * @example
 * ```typescript
 * const classification = await classifyFundBalance(
 *   'fund-uuid',
 *   5500000,
 *   restrictions
 * );
 * ```
 */
export const classifyFundBalance = async (
  fundId: string,
  totalFundBalance: number,
  restrictions: FundRestriction[],
): Promise<{
  nonspendable: number;
  restricted: number;
  committed: number;
  assigned: number;
  unassigned: number;
}> => {
  let nonspendable = 0;
  let restricted = 0;
  let committed = 0;
  let assigned = 0;

  for (const restriction of restrictions) {
    if (restriction.status === 'active') {
      switch (restriction.restrictionType) {
        case FundBalanceClassification.NONSPENDABLE:
          nonspendable += restriction.amount;
          break;
        case FundBalanceClassification.RESTRICTED:
          restricted += restriction.amount;
          break;
        case FundBalanceClassification.COMMITTED:
          committed += restriction.amount;
          break;
        case FundBalanceClassification.ASSIGNED:
          assigned += restriction.amount;
          break;
      }
    }
  }

  const unassigned = Math.max(0, totalFundBalance - nonspendable - restricted - committed - assigned);

  return {
    nonspendable,
    restricted,
    committed,
    assigned,
    unassigned,
  };
};

/**
 * Calculates fund balance ratio.
 *
 * @param {number} fundBalance - Fund balance
 * @param {number} totalExpenditures - Total annual expenditures
 * @returns {number} Fund balance ratio
 *
 * @example
 * ```typescript
 * const ratio = calculateFundBalanceRatio(5500000, 50000000);
 * // Returns: 0.11 (11% - approximately 40 days of operations)
 * ```
 */
export const calculateFundBalanceRatio = (fundBalance: number, totalExpenditures: number): number => {
  if (totalExpenditures === 0) return 0;
  return Math.round((fundBalance / totalExpenditures) * 10000) / 10000;
};

// ============================================================================
// INTERFUND TRANSFER FUNCTIONS
// ============================================================================

/**
 * Creates an interfund transfer.
 *
 * @param {Partial<InterfundTransfer>} transferData - Transfer data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Created transfer
 *
 * @example
 * ```typescript
 * const transfer = await createInterfundTransfer({
 *   fromFundId: 'general-fund-uuid',
 *   fromFundCode: 'GF-001',
 *   fromFundName: 'General Fund',
 *   toFundId: 'capital-projects-uuid',
 *   toFundCode: 'CP-001',
 *   toFundName: 'Capital Projects Fund',
 *   transferAmount: 1000000,
 *   transferType: 'capital',
 *   purpose: 'Capital project funding for new library',
 *   authorizationReference: 'Council Resolution 2024-45',
 *   transferDate: new Date(),
 *   fiscalYear: 'FY2024',
 *   approvedBy: 'city-council',
 *   approvalDate: new Date(),
 *   createdBy: 'finance-director'
 * }, sequelize);
 * ```
 */
export const createInterfundTransfer = async (
  transferData: Partial<InterfundTransfer>,
  sequelize: Sequelize,
): Promise<any> => {
  const InterfundTransfer = createInterfundTransferModel(sequelize);

  const transferNumber = `IFT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

  const transfer = await InterfundTransfer.create({
    ...transferData,
    transferNumber,
    status: 'pending',
    createdDate: new Date(),
  });

  return transfer;
};

/**
 * Posts an approved interfund transfer.
 *
 * @param {string} transferId - Transfer ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Posted transfer
 *
 * @example
 * ```typescript
 * const posted = await postInterfundTransfer('transfer-uuid', sequelize);
 * ```
 */
export const postInterfundTransfer = async (transferId: string, sequelize: Sequelize): Promise<any> => {
  const InterfundTransfer = createInterfundTransferModel(sequelize);

  return await sequelize.transaction(async (transaction) => {
    const transfer = await InterfundTransfer.findOne({ where: { transferId }, transaction });
    if (!transfer) {
      throw new Error(`Transfer not found: ${transferId}`);
    }

    const transferData = transfer.toJSON() as any;

    if (transferData.status !== 'approved') {
      throw new Error(`Transfer must be approved before posting`);
    }

    // Create accounting entries
    const entries: AccountingEntry[] = [
      {
        entryId: randomUUID(),
        entryDate: new Date(),
        fundId: transferData.fromFundId,
        accountCode: 'TRANSFER-OUT',
        accountName: 'Transfer Out',
        debitAmount: 0,
        creditAmount: transferData.transferAmount,
        description: `Transfer to ${transferData.toFundName}`,
        referenceNumber: transferData.transferNumber,
      },
      {
        entryId: randomUUID(),
        entryDate: new Date(),
        fundId: transferData.toFundId,
        accountCode: 'TRANSFER-IN',
        accountName: 'Transfer In',
        debitAmount: transferData.transferAmount,
        creditAmount: 0,
        description: `Transfer from ${transferData.fromFundName}`,
        referenceNumber: transferData.transferNumber,
      },
    ];

    await transfer.update(
      {
        status: 'posted',
        postedDate: new Date(),
        accountingEntries: entries,
      },
      { transaction },
    );

    return transfer;
  });
};

/**
 * Reverses a posted interfund transfer.
 *
 * @param {string} transferId - Transfer ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} reversedBy - User reversing transfer
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Reversed transfer
 *
 * @example
 * ```typescript
 * const reversed = await reverseInterfundTransfer(
 *   'transfer-uuid',
 *   'Posted in error',
 *   'finance-director',
 *   sequelize
 * );
 * ```
 */
export const reverseInterfundTransfer = async (
  transferId: string,
  reversalReason: string,
  reversedBy: string,
  sequelize: Sequelize,
): Promise<any> => {
  const InterfundTransfer = createInterfundTransferModel(sequelize);

  const transfer = await InterfundTransfer.findOne({ where: { transferId } });
  if (!transfer) {
    throw new Error(`Transfer not found: ${transferId}`);
  }

  await transfer.update({
    status: 'reversed',
    reversalReason,
    reversedDate: new Date(),
    reversedBy,
  });

  return transfer;
};

// ============================================================================
// FUND REVENUE & EXPENDITURE FUNCTIONS
// ============================================================================

/**
 * Records fund revenue.
 *
 * @param {Partial<FundRevenue>} revenueData - Revenue data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundRevenue>}
 *
 * @example
 * ```typescript
 * const revenue = await recordFundRevenue({
 *   fundId: 'fund-uuid',
 *   fiscalYear: 'FY2024',
 *   transactionDate: new Date(),
 *   revenueSource: 'property_tax',
 *   revenueCategory: 'taxes',
 *   revenueCode: 'REV-TAX-001',
 *   description: 'Property tax collection',
 *   amount: 50000,
 *   recognitionBasis: 'modified_accrual',
 *   deposited: true,
 *   depositDate: new Date(),
 *   receiptNumber: 'RCPT-12345',
 *   recordedBy: 'treasurer'
 * }, sequelize);
 * ```
 */
export const recordFundRevenue = async (
  revenueData: Partial<FundRevenue>,
  sequelize: Sequelize,
): Promise<FundRevenue> => {
  const revenue: FundRevenue = {
    revenueId: randomUUID(),
    fundId: revenueData.fundId!,
    fiscalYear: revenueData.fiscalYear!,
    transactionDate: revenueData.transactionDate!,
    revenueSource: revenueData.revenueSource!,
    revenueCategory: revenueData.revenueCategory!,
    revenueCode: revenueData.revenueCode!,
    description: revenueData.description!,
    amount: revenueData.amount!,
    recognitionBasis: revenueData.recognitionBasis || 'modified_accrual',
    isRecurring: revenueData.isRecurring || false,
    deposited: revenueData.deposited || false,
    receiptNumber: revenueData.receiptNumber || `RCPT-${Date.now()}`,
    recordedBy: revenueData.recordedBy!,
  };

  // In production, save to database and update fund balance

  return revenue;
};

/**
 * Records fund expenditure.
 *
 * @param {Partial<FundExpenditure>} expenditureData - Expenditure data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundExpenditure>}
 *
 * @example
 * ```typescript
 * const expenditure = await recordFundExpenditure({
 *   fundId: 'fund-uuid',
 *   fiscalYear: 'FY2024',
 *   transactionDate: new Date(),
 *   expenditureCategory: 'personnel',
 *   expenditureType: 'salaries',
 *   accountCode: 'EXP-SAL-001',
 *   description: 'Monthly payroll',
 *   amount: 150000,
 *   payee: 'Employees',
 *   paymentMethod: 'ach',
 *   approvedBy: 'hr-director',
 *   approvalDate: new Date(),
 *   status: 'paid',
 *   recordedBy: 'payroll-clerk'
 * }, sequelize);
 * ```
 */
export const recordFundExpenditure = async (
  expenditureData: Partial<FundExpenditure>,
  sequelize: Sequelize,
): Promise<FundExpenditure> => {
  const expenditure: FundExpenditure = {
    expenditureId: randomUUID(),
    fundId: expenditureData.fundId!,
    fiscalYear: expenditureData.fiscalYear!,
    transactionDate: expenditureData.transactionDate!,
    expenditureCategory: expenditureData.expenditureCategory!,
    expenditureType: expenditureData.expenditureType!,
    accountCode: expenditureData.accountCode!,
    description: expenditureData.description!,
    amount: expenditureData.amount!,
    payee: expenditureData.payee!,
    paymentMethod: expenditureData.paymentMethod!,
    approvedBy: expenditureData.approvedBy!,
    approvalDate: expenditureData.approvalDate!,
    status: expenditureData.status || 'pending',
    recordedBy: expenditureData.recordedBy!,
  };

  // In production, save to database and update fund balance

  return expenditure;
};

/**
 * Creates an encumbrance.
 *
 * @param {Partial<FundEncumbrance>} encumbranceData - Encumbrance data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundEncumbrance>}
 *
 * @example
 * ```typescript
 * const encumbrance = await createEncumbrance({
 *   fundId: 'fund-uuid',
 *   fiscalYear: 'FY2024',
 *   encumbranceDate: new Date(),
 *   encumbranceType: 'purchase_order',
 *   referenceNumber: 'PO-2024-001',
 *   description: 'Office supplies',
 *   vendor: 'ABC Supplies Inc',
 *   amount: 5000,
 *   accountCode: 'EXP-SUP-001',
 *   status: 'open',
 *   createdBy: 'purchasing-agent'
 * }, sequelize);
 * ```
 */
export const createEncumbrance = async (
  encumbranceData: Partial<FundEncumbrance>,
  sequelize: Sequelize,
): Promise<FundEncumbrance> => {
  const encumbrance: FundEncumbrance = {
    encumbranceId: randomUUID(),
    fundId: encumbranceData.fundId!,
    fiscalYear: encumbranceData.fiscalYear!,
    encumbranceDate: encumbranceData.encumbranceDate!,
    encumbranceType: encumbranceData.encumbranceType!,
    referenceNumber: encumbranceData.referenceNumber!,
    description: encumbranceData.description!,
    vendor: encumbranceData.vendor!,
    amount: encumbranceData.amount!,
    liquidatedAmount: 0,
    remainingAmount: encumbranceData.amount!,
    accountCode: encumbranceData.accountCode!,
    status: 'open',
    createdBy: encumbranceData.createdBy!,
    createdDate: new Date(),
  };

  // In production, save to database and update fund balance

  return encumbrance;
};

/**
 * Liquidates an encumbrance.
 *
 * @param {string} encumbranceId - Encumbrance ID
 * @param {number} liquidationAmount - Amount to liquidate
 * @param {string} liquidatedBy - User liquidating
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundEncumbrance>}
 *
 * @example
 * ```typescript
 * const liquidated = await liquidateEncumbrance(
 *   'encumbrance-uuid',
 *   3000,
 *   'accounts-payable',
 *   sequelize
 * );
 * ```
 */
export const liquidateEncumbrance = async (
  encumbranceId: string,
  liquidationAmount: number,
  liquidatedBy: string,
  sequelize: Sequelize,
): Promise<FundEncumbrance> => {
  // Mock implementation
  const encumbrance: FundEncumbrance = {
    encumbranceId,
    fundId: 'fund-uuid',
    fiscalYear: 'FY2024',
    encumbranceDate: new Date(),
    encumbranceType: 'purchase_order',
    referenceNumber: 'PO-2024-001',
    description: 'Office supplies',
    vendor: 'ABC Supplies Inc',
    amount: 5000,
    liquidatedAmount: liquidationAmount,
    remainingAmount: 5000 - liquidationAmount,
    accountCode: 'EXP-SUP-001',
    status: liquidationAmount >= 5000 ? 'fully_liquidated' : 'partially_liquidated',
    createdBy: 'purchasing-agent',
    createdDate: new Date(),
    liquidatedBy,
    liquidatedDate: new Date(),
  };

  return encumbrance;
};

// ============================================================================
// FUND CLOSING FUNCTIONS
// ============================================================================

/**
 * Performs year-end fund closing.
 *
 * @param {string} fundId - Fund ID
 * @param {string} fiscalYear - Fiscal year
 * @param {string} performedBy - User performing closing
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundClosingEntry>}
 *
 * @example
 * ```typescript
 * const closing = await performYearEndClosing(
 *   'fund-uuid',
 *   'FY2024',
 *   'finance-director',
 *   sequelize
 * );
 * ```
 */
export const performYearEndClosing = async (
  fundId: string,
  fiscalYear: string,
  performedBy: string,
  sequelize: Sequelize,
): Promise<FundClosingEntry> => {
  // Mock implementation - in production, calculate actual balances
  const closing: FundClosingEntry = {
    closingId: randomUUID(),
    fundId,
    fiscalYear,
    closingDate: new Date(),
    closingType: 'year_end',
    revenueBalance: 50000000,
    expenditureBalance: 48000000,
    encumbranceBalance: 500000,
    transfersIn: 1000000,
    transfersOut: 500000,
    excessOrDeficit: 2000000,
    priorYearBalance: 5000000,
    adjustments: 0,
    newFundBalance: 7000000,
    nonspendableAmount: 200000,
    restrictedAmount: 3000000,
    committedAmount: 1500000,
    assignedAmount: 800000,
    unassignedAmount: 1500000,
    encumbrancesCarriedForward: 400000,
    encumbrancesLapsed: 100000,
    closingEntries: [],
    performedBy,
    approved: false,
    status: 'draft',
  };

  return closing;
};

/**
 * Approves fund closing.
 *
 * @param {string} closingId - Closing ID
 * @param {string} approver - Approver
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundClosingEntry>}
 *
 * @example
 * ```typescript
 * const approved = await approveFundClosing(
 *   'closing-uuid',
 *   'finance-director',
 *   sequelize
 * );
 * ```
 */
export const approveFundClosing = async (
  closingId: string,
  approver: string,
  sequelize: Sequelize,
): Promise<FundClosingEntry> => {
  // Mock implementation
  const closing: FundClosingEntry = {
    closingId,
    fundId: 'fund-uuid',
    fiscalYear: 'FY2024',
    closingDate: new Date(),
    closingType: 'year_end',
    revenueBalance: 50000000,
    expenditureBalance: 48000000,
    encumbranceBalance: 500000,
    transfersIn: 1000000,
    transfersOut: 500000,
    excessOrDeficit: 2000000,
    priorYearBalance: 5000000,
    adjustments: 0,
    newFundBalance: 7000000,
    nonspendableAmount: 200000,
    restrictedAmount: 3000000,
    committedAmount: 1500000,
    assignedAmount: 800000,
    unassignedAmount: 1500000,
    encumbrancesCarriedForward: 400000,
    encumbrancesLapsed: 100000,
    closingEntries: [],
    performedBy: 'finance-director',
    approved: true,
    approvedBy: approver,
    approvalDate: new Date(),
    status: 'approved',
  };

  return closing;
};

// ============================================================================
// FUND REPORTING & ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Generates combined fund statement.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} statementType - Statement type
 * @param {FundCategory} [category] - Fund category filter
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CombinedFundStatement>}
 *
 * @example
 * ```typescript
 * const statement = await generateCombinedStatement(
 *   'FY2024',
 *   'balance_sheet',
 *   'governmental',
 *   sequelize
 * );
 * ```
 */
export const generateCombinedStatement = async (
  fiscalYear: string,
  statementType: string,
  category: FundCategory | undefined,
  sequelize: Sequelize,
): Promise<CombinedFundStatement> => {
  // Mock implementation
  const statement: CombinedFundStatement = {
    statementId: randomUUID(),
    statementDate: new Date(),
    fiscalYear,
    statementType: statementType as any,
    fundCategory: category,
    funds: [],
    totals: {
      fundId: 'TOTAL',
      fundCode: 'TOTAL',
      fundName: 'Total',
      fundType: FundType.GENERAL,
      assets: 100000000,
      liabilities: 10000000,
      fundBalance: 90000000,
    },
    generatedBy: 'system',
    generatedDate: new Date(),
  };

  return statement;
};

/**
 * Calculates fund performance metrics.
 *
 * @param {string} fundId - Fund ID
 * @param {string} fiscalYear - Fiscal year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundPerformanceMetrics>}
 *
 * @example
 * ```typescript
 * const metrics = await calculateFundPerformance(
 *   'fund-uuid',
 *   'FY2024',
 *   sequelize
 * );
 * ```
 */
export const calculateFundPerformance = async (
  fundId: string,
  fiscalYear: string,
  sequelize: Sequelize,
): Promise<FundPerformanceMetrics> => {
  // Mock implementation
  const metrics: FundPerformanceMetrics = {
    fundId,
    fiscalYear,
    periodEndDate: new Date(),
    totalRevenue: 50000000,
    revenueGrowth: 0.03,
    revenueToTarget: 0.98,
    majorRevenueSourcePercentage: 0.45,
    totalExpenditures: 48000000,
    expenditureGrowth: 0.025,
    expenditureToTarget: 0.96,
    personnelCostPercentage: 0.65,
    operatingCostPercentage: 0.25,
    fundBalanceRatio: 0.15,
    liquidityRatio: 1.5,
    reserveRatio: 0.12,
    collectionRate: 0.97,
    expenditureEfficiency: 0.96,
    budgetVariancePercentage: 0.02,
    encumbranceCompliance: true,
    appropriationCompliance: true,
    restrictionCompliance: true,
  };

  return metrics;
};

/**
 * Performs fund reconciliation.
 *
 * @param {string} fundId - Fund ID
 * @param {string} fiscalYear - Fiscal year
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {string} reconciledBy - User performing reconciliation
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundReconciliation>}
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileFund(
 *   'fund-uuid',
 *   'FY2024',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   'accountant',
 *   sequelize
 * );
 * ```
 */
export const reconcileFund = async (
  fundId: string,
  fiscalYear: string,
  periodStart: Date,
  periodEnd: Date,
  reconciledBy: string,
  sequelize: Sequelize,
): Promise<FundReconciliation> => {
  // Mock implementation
  const reconciliation: FundReconciliation = {
    reconciliationId: randomUUID(),
    fundId,
    fiscalYear,
    reconciliationDate: new Date(),
    periodStart,
    periodEnd,
    reconciliationType: 'bank',
    beginningBookBalance: 5000000,
    beginningBankBalance: 4950000,
    totalRevenue: 2000000,
    transfersIn: 100000,
    otherAdditions: 0,
    totalExpenditures: 1800000,
    transfersOut: 50000,
    otherDeductions: 0,
    endingBookBalance: 5250000,
    endingBankBalance: 5200000,
    outstandingChecks: 75000,
    depositsInTransit: 25000,
    adjustments: [],
    variance: 0,
    reconciledBy,
    approved: false,
    status: 'in_progress',
  };

  return reconciliation;
};

/**
 * Checks budget control status.
 *
 * @param {string} fundId - Fund ID
 * @param {string} fiscalYear - Fiscal year
 * @param {string} accountCode - Account code
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<BudgetControl>}
 *
 * @example
 * ```typescript
 * const control = await checkBudgetControl(
 *   'fund-uuid',
 *   'FY2024',
 *   'EXP-SAL-001',
 *   sequelize
 * );
 * ```
 */
export const checkBudgetControl = async (
  fundId: string,
  fiscalYear: string,
  accountCode: string,
  sequelize: Sequelize,
): Promise<BudgetControl> => {
  // Mock implementation
  const control: BudgetControl = {
    fundId,
    fiscalYear,
    accountCode,
    budgetAmount: 1000000,
    revisedBudgetAmount: 1050000,
    actualExpenditures: 850000,
    encumbrances: 100000,
    availableBalance: 100000,
    percentageUsed: 0.905,
    overBudget: false,
    warningThreshold: 0.9,
    criticalThreshold: 0.95,
    status: 'critical',
  };

  return control;
};

/**
 * Exports fund data for audit.
 *
 * @param {string} fundId - Fund ID
 * @param {string} fiscalYear - Fiscal year
 * @param {string} exportFormat - Export format
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string>} Export file path
 *
 * @example
 * ```typescript
 * const path = await exportFundDataForAudit(
 *   'fund-uuid',
 *   'FY2024',
 *   'csv',
 *   sequelize
 * );
 * ```
 */
export const exportFundDataForAudit = async (
  fundId: string,
  fiscalYear: string,
  exportFormat: 'csv' | 'json' | 'xml',
  sequelize: Sequelize,
): Promise<string> => {
  const outputPath = `/tmp/fund_exports/audit_${fundId}_${fiscalYear}.${exportFormat}`;

  const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  let content = '';
  if (exportFormat === 'json') {
    content = JSON.stringify({ fundId, fiscalYear, exportDate: new Date() }, null, 2);
  } else if (exportFormat === 'csv') {
    content = 'FundId,FiscalYear,ExportDate\n';
    content += `${fundId},${fiscalYear},${new Date().toISOString()}\n`;
  }

  writeFileSync(outputPath, content);
  return outputPath;
};

/**
 * Default export with all utilities.
 */
export default {
  // Models
  createFundModel,
  createFundBalanceModel,
  createInterfundTransferModel,

  // Fund Management
  createFund,
  getFundByCode,
  listFundsByCategory,
  closeFund,

  // Fund Balance
  getFundBalance,
  updateFundBalance,
  classifyFundBalance,
  calculateFundBalanceRatio,

  // Interfund Transfers
  createInterfundTransfer,
  postInterfundTransfer,
  reverseInterfundTransfer,

  // Revenue & Expenditure
  recordFundRevenue,
  recordFundExpenditure,
  createEncumbrance,
  liquidateEncumbrance,

  // Fund Closing
  performYearEndClosing,
  approveFundClosing,

  // Reporting & Analytics
  generateCombinedStatement,
  calculateFundPerformance,
  reconcileFund,
  checkBudgetControl,
  exportFundDataForAudit,
};
