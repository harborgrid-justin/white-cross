/**
 * LOC: WC-CEFMS-FSC-001
 * FILE: reuse/financial/cefms/composites/cefms-financial-statement-consolidation-composite.ts
 *
 * UPSTREAM DEPENDENCIES:
 * - reuse/government/accounting/general-ledger-kit.ts
 * - reuse/government/accounting/fund-accounting-kit.ts
 * - reuse/government/accounting/financial-reporting-kit.ts
 * - reuse/government/compliance/gasb-compliance-kit.ts
 * - reuse/government/financial/consolidation-kit.ts
 * - reuse/government/reporting/cafr-preparation-kit.ts
 *
 * DOWNSTREAM CONSUMERS:
 * - api/routes/cefms/financial-statement-consolidation-routes.ts
 * - api/controllers/cefms/financial-statement-consolidation-controller.ts
 * - services/cefms/financial-statement-consolidation-service.ts
 *
 * PURPOSE:
 * Comprehensive Financial Statement Consolidation composite for USACE CEFMS (Corps of
 * Engineers Financial Management System). Provides multi-fund consolidation, elimination
 * entries, CAFR (Comprehensive Annual Financial Report) preparation, and GASB compliance
 * validation for governmental, proprietary, and fiduciary funds.
 *
 * SYSTEM DESCRIPTION:
 * This module implements consolidated financial statement preparation and CAFR generation
 * for government entities following GASB (Governmental Accounting Standards Board) standards.
 * It handles multi-fund consolidation across governmental funds (general, special revenue,
 * debt service, capital projects, permanent), proprietary funds (enterprise, internal service),
 * and fiduciary funds (pension trust, investment trust, private-purpose trust, custodial).
 *
 * KEY CAPABILITIES:
 * - Multi-fund consolidation with elimination entries for inter-fund transactions
 * - Government-wide financial statements (Statement of Net Position, Statement of Activities)
 * - Fund-level financial statements (Balance Sheet, Income Statement, Cash Flow Statement)
 * - CAFR preparation with Introductory, Financial, and Statistical sections
 * - Management Discussion & Analysis (MD&A) generation
 * - Note disclosures for accounting policies, deposits, investments, capital assets, debt
 * - GASB 34, 54, 68, 87 compliance validation
 * - Statistical section data collection (financial trends, revenue capacity, debt capacity)
 * - Reconciliation between fund statements and government-wide statements
 *
 * FINANCIAL STATEMENT TYPES:
 * - Government-Wide Statements: Statement of Net Position, Statement of Activities
 * - Governmental Fund Statements: Balance Sheet, Statement of Revenues/Expenditures/Changes
 * - Proprietary Fund Statements: Statement of Net Position, Revenues/Expenses/Changes, Cash Flows
 * - Fiduciary Fund Statements: Statement of Fiduciary Net Position, Changes in Fiduciary Net Position
 *
 * RUNTIME: Node 18+
 * TYPESCRIPT: 5.x
 * FRAMEWORK: NestJS 10.x
 * ORM: Sequelize 6.x
 * DATABASE: PostgreSQL 15+
 *
 * AUTHOR: USACE CEFMS Development Team
 * CREATED: ${new Date().toISOString()}
 * VERSION: 1.0.0
 */

import { Injectable } from '@nestjs/common';
import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  BelongsToGetAssociationMixin,
} from 'sequelize';

// =============================================================================
// TYPESCRIPT INTERFACES
// =============================================================================

/**
 * Fund entity representing a fiscal and accounting entity with a self-balancing
 * set of accounts recording cash and other financial resources.
 */
export interface FundAttributes {
  fundId: string;
  fundCode: string;
  fundName: string;
  fundType: 'governmental' | 'proprietary' | 'fiduciary';
  fundCategory: string;
  fiscalYear: number;
  status: 'active' | 'inactive' | 'closed';
  accountingBasis: 'modified_accrual' | 'full_accrual' | 'cash';
  measurementFocus: 'current_financial_resources' | 'economic_resources' | 'flow_of_resources';
  budgetIntegration: boolean;
  encumbranceAccounting: boolean;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FundCreationAttributes extends Optional<FundAttributes, 'fundId' | 'createdAt' | 'updatedAt'> {}

/**
 * Consolidation Entry representing elimination entries and adjustments required
 * for consolidated financial statement preparation.
 */
export interface ConsolidationEntryAttributes {
  entryId: string;
  fundId: string;
  fiscalYear: number;
  entryType: 'elimination' | 'reclassification' | 'adjustment' | 'accrual';
  entryCategory: string;
  transactionType: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  description: string;
  justification: string;
  reviewStatus: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ConsolidationEntryCreationAttributes extends Optional<ConsolidationEntryAttributes, 'entryId' | 'createdAt' | 'updatedAt'> {}

/**
 * Financial Statement representing a completed financial statement with
 * consolidated balances and classifications.
 */
export interface FinancialStatementAttributes {
  statementId: string;
  fiscalYear: number;
  statementType: 'net_position' | 'activities' | 'balance_sheet' | 'revenues_expenditures' | 'cash_flow';
  statementLevel: 'government_wide' | 'governmental_fund' | 'proprietary_fund' | 'fiduciary_fund';
  fundId?: string;
  statementDate: Date;
  statementData: Record<string, any>;
  totalAssets: number;
  totalLiabilities: number;
  totalNetPosition: number;
  status: 'draft' | 'preliminary' | 'final' | 'published';
  approvedBy?: string;
  approvedAt?: Date;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FinancialStatementCreationAttributes extends Optional<FinancialStatementAttributes, 'statementId' | 'createdAt' | 'updatedAt'> {}

/**
 * CAFR Section representing a section of the Comprehensive Annual Financial Report.
 */
export interface CAFRSectionAttributes {
  sectionId: string;
  fiscalYear: number;
  sectionType: 'introductory' | 'financial' | 'statistical';
  sectionName: string;
  sectionContent: string;
  sectionOrder: number;
  includedStatements: string[];
  includedSchedules: string[];
  pageCount: number;
  status: 'draft' | 'review' | 'final';
  lastReviewedBy?: string;
  lastReviewedAt?: Date;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CAFRSectionCreationAttributes extends Optional<CAFRSectionAttributes, 'sectionId' | 'createdAt' | 'updatedAt'> {}

/**
 * Management Discussion and Analysis (MD&A) content with financial highlights
 * and trend analysis.
 */
export interface MDAContentAttributes {
  mdaId: string;
  fiscalYear: number;
  executiveSummary: string;
  financialHighlights: Record<string, any>;
  trendAnalysis: Record<string, any>;
  significantEvents: string[];
  futureOutlook: string;
  capitalAssetActivity: string;
  debtActivity: string;
  economicFactors: string;
  status: 'draft' | 'review' | 'final';
  approvedBy?: string;
  approvedAt?: Date;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MDAContentCreationAttributes extends Optional<MDAContentAttributes, 'mdaId' | 'createdAt' | 'updatedAt'> {}

/**
 * Note Disclosure representing notes to financial statements covering
 * accounting policies, significant balances, and contingencies.
 */
export interface NoteDisclosureAttributes {
  noteId: string;
  fiscalYear: number;
  noteNumber: string;
  noteTitle: string;
  noteCategory: string;
  noteContent: string;
  referencedStatements: string[];
  referencedAccounts: string[];
  disclosureType: 'policy' | 'detail' | 'contingency' | 'subsequent_event';
  isRequired: boolean;
  status: 'draft' | 'review' | 'final';
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NoteDisclosureCreationAttributes extends Optional<NoteDisclosureAttributes, 'noteId' | 'createdAt' | 'updatedAt'> {}

/**
 * Statistical Data representing ten-year financial trend data and other
 * statistical information for CAFR statistical section.
 */
export interface StatisticalDataAttributes {
  dataId: string;
  fiscalYear: number;
  dataCategory: 'financial_trends' | 'revenue_capacity' | 'debt_capacity' | 'demographic_economic' | 'operating_information';
  dataType: string;
  dataName: string;
  dataValue: number;
  dataUnit: string;
  calculationMethod: string;
  sourceDocuments: string[];
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StatisticalDataCreationAttributes extends Optional<StatisticalDataAttributes, 'dataId' | 'createdAt' | 'updatedAt'> {}

/**
 * GASB Compliance Check representing validation of compliance with GASB
 * pronouncements and standards.
 */
export interface GASBComplianceCheckAttributes {
  complianceId: string;
  fiscalYear: number;
  gasbStandard: string;
  standardTitle: string;
  requirementDescription: string;
  complianceStatus: 'compliant' | 'non_compliant' | 'partially_compliant' | 'not_applicable';
  evidenceDocuments: string[];
  findings: string;
  correctiveActions: string[];
  verifiedBy?: string;
  verifiedAt?: Date;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GASBComplianceCheckCreationAttributes extends Optional<GASBComplianceCheckAttributes, 'complianceId' | 'createdAt' | 'updatedAt'> {}

// =============================================================================
// SEQUELIZE MODELS
// =============================================================================

export class Fund extends Model<FundAttributes, FundCreationAttributes> implements FundAttributes {
  public fundId!: string;
  public fundCode!: string;
  public fundName!: string;
  public fundType!: 'governmental' | 'proprietary' | 'fiduciary';
  public fundCategory!: string;
  public fiscalYear!: number;
  public status!: 'active' | 'inactive' | 'closed';
  public accountingBasis!: 'modified_accrual' | 'full_accrual' | 'cash';
  public measurementFocus!: 'current_financial_resources' | 'economic_resources' | 'flow_of_resources';
  public budgetIntegration!: boolean;
  public encumbranceAccounting!: boolean;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class ConsolidationEntry extends Model<ConsolidationEntryAttributes, ConsolidationEntryCreationAttributes> implements ConsolidationEntryAttributes {
  public entryId!: string;
  public fundId!: string;
  public fiscalYear!: number;
  public entryType!: 'elimination' | 'reclassification' | 'adjustment' | 'accrual';
  public entryCategory!: string;
  public transactionType!: string;
  public debitAccount!: string;
  public creditAccount!: string;
  public amount!: number;
  public description!: string;
  public justification!: string;
  public reviewStatus!: 'pending' | 'approved' | 'rejected';
  public reviewedBy?: string;
  public reviewedAt?: Date;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class FinancialStatement extends Model<FinancialStatementAttributes, FinancialStatementCreationAttributes> implements FinancialStatementAttributes {
  public statementId!: string;
  public fiscalYear!: number;
  public statementType!: 'net_position' | 'activities' | 'balance_sheet' | 'revenues_expenditures' | 'cash_flow';
  public statementLevel!: 'government_wide' | 'governmental_fund' | 'proprietary_fund' | 'fiduciary_fund';
  public fundId?: string;
  public statementDate!: Date;
  public statementData!: Record<string, any>;
  public totalAssets!: number;
  public totalLiabilities!: number;
  public totalNetPosition!: number;
  public status!: 'draft' | 'preliminary' | 'final' | 'published';
  public approvedBy?: string;
  public approvedAt?: Date;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class CAFRSection extends Model<CAFRSectionAttributes, CAFRSectionCreationAttributes> implements CAFRSectionAttributes {
  public sectionId!: string;
  public fiscalYear!: number;
  public sectionType!: 'introductory' | 'financial' | 'statistical';
  public sectionName!: string;
  public sectionContent!: string;
  public sectionOrder!: number;
  public includedStatements!: string[];
  public includedSchedules!: string[];
  public pageCount!: number;
  public status!: 'draft' | 'review' | 'final';
  public lastReviewedBy?: string;
  public lastReviewedAt?: Date;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class MDAContent extends Model<MDAContentAttributes, MDAContentCreationAttributes> implements MDAContentAttributes {
  public mdaId!: string;
  public fiscalYear!: number;
  public executiveSummary!: string;
  public financialHighlights!: Record<string, any>;
  public trendAnalysis!: Record<string, any>;
  public significantEvents!: string[];
  public futureOutlook!: string;
  public capitalAssetActivity!: string;
  public debtActivity!: string;
  public economicFactors!: string;
  public status!: 'draft' | 'review' | 'final';
  public approvedBy?: string;
  public approvedAt?: Date;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class NoteDisclosure extends Model<NoteDisclosureAttributes, NoteDisclosureCreationAttributes> implements NoteDisclosureAttributes {
  public noteId!: string;
  public fiscalYear!: number;
  public noteNumber!: string;
  public noteTitle!: string;
  public noteCategory!: string;
  public noteContent!: string;
  public referencedStatements!: string[];
  public referencedAccounts!: string[];
  public disclosureType!: 'policy' | 'detail' | 'contingency' | 'subsequent_event';
  public isRequired!: boolean;
  public status!: 'draft' | 'review' | 'final';
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class StatisticalData extends Model<StatisticalDataAttributes, StatisticalDataCreationAttributes> implements StatisticalDataAttributes {
  public dataId!: string;
  public fiscalYear!: number;
  public dataCategory!: 'financial_trends' | 'revenue_capacity' | 'debt_capacity' | 'demographic_economic' | 'operating_information';
  public dataType!: string;
  public dataName!: string;
  public dataValue!: number;
  public dataUnit!: string;
  public calculationMethod!: string;
  public sourceDocuments!: string[];
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class GASBComplianceCheck extends Model<GASBComplianceCheckAttributes, GASBComplianceCheckCreationAttributes> implements GASBComplianceCheckAttributes {
  public complianceId!: string;
  public fiscalYear!: number;
  public gasbStandard!: string;
  public standardTitle!: string;
  public requirementDescription!: string;
  public complianceStatus!: 'compliant' | 'non_compliant' | 'partially_compliant' | 'not_applicable';
  public evidenceDocuments!: string[];
  public findings!: string;
  public correctiveActions!: string[];
  public verifiedBy?: string;
  public verifiedAt?: Date;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// =============================================================================
// MODEL INITIALIZATION FUNCTION
// =============================================================================

export function initializeFinancialStatementConsolidationModels(sequelize: Sequelize): void {
  Fund.init(
    {
      fundId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'fund_id',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'fund_code',
      },
      fundName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'fund_name',
      },
      fundType: {
        type: DataTypes.ENUM('governmental', 'proprietary', 'fiduciary'),
        allowNull: false,
        field: 'fund_type',
      },
      fundCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'fund_category',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fiscal_year',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'closed'),
        allowNull: false,
        defaultValue: 'active',
        field: 'status',
      },
      accountingBasis: {
        type: DataTypes.ENUM('modified_accrual', 'full_accrual', 'cash'),
        allowNull: false,
        field: 'accounting_basis',
      },
      measurementFocus: {
        type: DataTypes.ENUM('current_financial_resources', 'economic_resources', 'flow_of_resources'),
        allowNull: false,
        field: 'measurement_focus',
      },
      budgetIntegration: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'budget_integration',
      },
      encumbranceAccounting: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'encumbrance_accounting',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_funds',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['fund_code'] },
        { fields: ['fund_type'] },
        { fields: ['fiscal_year'] },
        { fields: ['status'] },
      ],
    }
  );

  ConsolidationEntry.init(
    {
      entryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'entry_id',
      },
      fundId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'fund_id',
        references: {
          model: 'cefms_funds',
          key: 'fund_id',
        },
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fiscal_year',
      },
      entryType: {
        type: DataTypes.ENUM('elimination', 'reclassification', 'adjustment', 'accrual'),
        allowNull: false,
        field: 'entry_type',
      },
      entryCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'entry_category',
      },
      transactionType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'transaction_type',
      },
      debitAccount: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'debit_account',
      },
      creditAccount: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'credit_account',
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      justification: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      reviewStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
        field: 'review_status',
      },
      reviewedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'reviewed_by',
      },
      reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'reviewed_at',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_consolidation_entries',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['fund_id'] },
        { fields: ['fiscal_year'] },
        { fields: ['entry_type'] },
        { fields: ['review_status'] },
      ],
    }
  );

  FinancialStatement.init(
    {
      statementId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'statement_id',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fiscal_year',
      },
      statementType: {
        type: DataTypes.ENUM('net_position', 'activities', 'balance_sheet', 'revenues_expenditures', 'cash_flow'),
        allowNull: false,
        field: 'statement_type',
      },
      statementLevel: {
        type: DataTypes.ENUM('government_wide', 'governmental_fund', 'proprietary_fund', 'fiduciary_fund'),
        allowNull: false,
        field: 'statement_level',
      },
      fundId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'fund_id',
        references: {
          model: 'cefms_funds',
          key: 'fund_id',
        },
      },
      statementDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'statement_date',
      },
      statementData: {
        type: DataTypes.JSONB,
        allowNull: false,
        field: 'statement_data',
      },
      totalAssets: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'total_assets',
      },
      totalLiabilities: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'total_liabilities',
      },
      totalNetPosition: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'total_net_position',
      },
      status: {
        type: DataTypes.ENUM('draft', 'preliminary', 'final', 'published'),
        allowNull: false,
        defaultValue: 'draft',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'approved_by',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'approved_at',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_financial_statements',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['fiscal_year'] },
        { fields: ['statement_type'] },
        { fields: ['statement_level'] },
        { fields: ['fund_id'] },
        { fields: ['status'] },
      ],
    }
  );

  CAFRSection.init(
    {
      sectionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'section_id',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fiscal_year',
      },
      sectionType: {
        type: DataTypes.ENUM('introductory', 'financial', 'statistical'),
        allowNull: false,
        field: 'section_type',
      },
      sectionName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'section_name',
      },
      sectionContent: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'section_content',
      },
      sectionOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'section_order',
      },
      includedStatements: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        field: 'included_statements',
      },
      includedSchedules: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        field: 'included_schedules',
      },
      pageCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'page_count',
      },
      status: {
        type: DataTypes.ENUM('draft', 'review', 'final'),
        allowNull: false,
        defaultValue: 'draft',
      },
      lastReviewedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'last_reviewed_by',
      },
      lastReviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_reviewed_at',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_cafr_sections',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['fiscal_year'] },
        { fields: ['section_type'] },
        { fields: ['section_order'] },
        { fields: ['status'] },
      ],
    }
  );

  MDAContent.init(
    {
      mdaId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'mda_id',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        field: 'fiscal_year',
      },
      executiveSummary: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'executive_summary',
      },
      financialHighlights: {
        type: DataTypes.JSONB,
        allowNull: false,
        field: 'financial_highlights',
      },
      trendAnalysis: {
        type: DataTypes.JSONB,
        allowNull: false,
        field: 'trend_analysis',
      },
      significantEvents: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        field: 'significant_events',
      },
      futureOutlook: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'future_outlook',
      },
      capitalAssetActivity: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'capital_asset_activity',
      },
      debtActivity: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'debt_activity',
      },
      economicFactors: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'economic_factors',
      },
      status: {
        type: DataTypes.ENUM('draft', 'review', 'final'),
        allowNull: false,
        defaultValue: 'draft',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'approved_by',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'approved_at',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_mda_content',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['fiscal_year'] },
        { fields: ['status'] },
      ],
    }
  );

  NoteDisclosure.init(
    {
      noteId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'note_id',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fiscal_year',
      },
      noteNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'note_number',
      },
      noteTitle: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'note_title',
      },
      noteCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'note_category',
      },
      noteContent: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'note_content',
      },
      referencedStatements: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        field: 'referenced_statements',
      },
      referencedAccounts: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        field: 'referenced_accounts',
      },
      disclosureType: {
        type: DataTypes.ENUM('policy', 'detail', 'contingency', 'subsequent_event'),
        allowNull: false,
        field: 'disclosure_type',
      },
      isRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_required',
      },
      status: {
        type: DataTypes.ENUM('draft', 'review', 'final'),
        allowNull: false,
        defaultValue: 'draft',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_note_disclosures',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['fiscal_year'] },
        { fields: ['note_number'] },
        { fields: ['note_category'] },
        { fields: ['disclosure_type'] },
        { fields: ['is_required'] },
        { fields: ['status'] },
      ],
    }
  );

  StatisticalData.init(
    {
      dataId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'data_id',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fiscal_year',
      },
      dataCategory: {
        type: DataTypes.ENUM('financial_trends', 'revenue_capacity', 'debt_capacity', 'demographic_economic', 'operating_information'),
        allowNull: false,
        field: 'data_category',
      },
      dataType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'data_type',
      },
      dataName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'data_name',
      },
      dataValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'data_value',
      },
      dataUnit: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'data_unit',
      },
      calculationMethod: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'calculation_method',
      },
      sourceDocuments: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        field: 'source_documents',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_statistical_data',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['fiscal_year'] },
        { fields: ['data_category'] },
        { fields: ['data_type'] },
      ],
    }
  );

  GASBComplianceCheck.init(
    {
      complianceId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'compliance_id',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fiscal_year',
      },
      gasbStandard: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'gasb_standard',
      },
      standardTitle: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'standard_title',
      },
      requirementDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'requirement_description',
      },
      complianceStatus: {
        type: DataTypes.ENUM('compliant', 'non_compliant', 'partially_compliant', 'not_applicable'),
        allowNull: false,
        field: 'compliance_status',
      },
      evidenceDocuments: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        field: 'evidence_documents',
      },
      findings: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      correctiveActions: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        field: 'corrective_actions',
      },
      verifiedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'verified_by',
      },
      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'verified_at',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_gasb_compliance_checks',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['fiscal_year'] },
        { fields: ['gasb_standard'] },
        { fields: ['compliance_status'] },
      ],
    }
  );
}

// =============================================================================
// COMPOSITE FUNCTIONS - FUND MANAGEMENT
// =============================================================================

/**
 * Creates a new fund entity with specified parameters.
 *
 * @param fundData - Fund creation attributes
 * @returns Created Fund record
 *
 * @example
 * const fund = await createFund({
 *   fundCode: 'GF-001',
 *   fundName: 'General Fund',
 *   fundType: 'governmental',
 *   fundCategory: 'General',
 *   fiscalYear: 2024,
 *   accountingBasis: 'modified_accrual',
 *   measurementFocus: 'current_financial_resources',
 *   budgetIntegration: true,
 *   encumbranceAccounting: true,
 *   status: 'active',
 *   metadata: {}
 * });
 */
export async function createFund(
  fundData: FundCreationAttributes
): Promise<Fund> {
  return await Fund.create(fundData);
}

/**
 * Retrieves a fund by its unique ID.
 *
 * @param fundId - Unique fund identifier
 * @returns Fund record or null if not found
 *
 * @example
 * const fund = await getFundById('550e8400-e29b-41d4-a716-446655440000');
 */
export async function getFundById(fundId: string): Promise<Fund | null> {
  return await Fund.findByPk(fundId);
}

/**
 * Retrieves all funds for a specific fiscal year.
 *
 * @param fiscalYear - Fiscal year to query
 * @returns Array of Fund records
 *
 * @example
 * const funds = await getFundsByFiscalYear(2024);
 */
export async function getFundsByFiscalYear(fiscalYear: number): Promise<Fund[]> {
  return await Fund.findAll({
    where: { fiscalYear },
    order: [['fundCode', 'ASC']],
  });
}

/**
 * Retrieves all funds of a specific type (governmental, proprietary, fiduciary).
 *
 * @param fundType - Type of fund
 * @returns Array of Fund records
 *
 * @example
 * const govFunds = await getFundsByType('governmental');
 */
export async function getFundsByType(
  fundType: 'governmental' | 'proprietary' | 'fiduciary'
): Promise<Fund[]> {
  return await Fund.findAll({
    where: { fundType },
    order: [['fundCode', 'ASC']],
  });
}

/**
 * Updates fund status (active, inactive, closed).
 *
 * @param fundId - Fund identifier
 * @param status - New status
 * @returns Updated Fund record
 *
 * @example
 * const fund = await updateFundStatus('550e8400-e29b-41d4-a716-446655440000', 'closed');
 */
export async function updateFundStatus(
  fundId: string,
  status: 'active' | 'inactive' | 'closed'
): Promise<Fund | null> {
  const fund = await Fund.findByPk(fundId);
  if (!fund) return null;
  fund.status = status;
  await fund.save();
  return fund;
}

// =============================================================================
// COMPOSITE FUNCTIONS - CONSOLIDATION ENTRIES
// =============================================================================

/**
 * Creates a consolidation entry for elimination or adjustment.
 *
 * @param entryData - Consolidation entry creation attributes
 * @returns Created ConsolidationEntry record
 *
 * @example
 * const entry = await createConsolidationEntry({
 *   fundId: '550e8400-e29b-41d4-a716-446655440000',
 *   fiscalYear: 2024,
 *   entryType: 'elimination',
 *   entryCategory: 'Inter-fund transfer',
 *   transactionType: 'Transfer elimination',
 *   debitAccount: '3310',
 *   creditAccount: '5310',
 *   amount: 50000.00,
 *   description: 'Eliminate inter-fund transfer between General Fund and Enterprise Fund',
 *   justification: 'GASB 34 consolidation requirement',
 *   reviewStatus: 'pending',
 *   metadata: {}
 * });
 */
export async function createConsolidationEntry(
  entryData: ConsolidationEntryCreationAttributes
): Promise<ConsolidationEntry> {
  return await ConsolidationEntry.create(entryData);
}

/**
 * Retrieves consolidation entries for a specific fund and fiscal year.
 *
 * @param fundId - Fund identifier
 * @param fiscalYear - Fiscal year
 * @returns Array of ConsolidationEntry records
 *
 * @example
 * const entries = await getConsolidationEntriesByFund('550e8400-e29b-41d4-a716-446655440000', 2024);
 */
export async function getConsolidationEntriesByFund(
  fundId: string,
  fiscalYear: number
): Promise<ConsolidationEntry[]> {
  return await ConsolidationEntry.findAll({
    where: { fundId, fiscalYear },
    order: [['createdAt', 'ASC']],
  });
}

/**
 * Retrieves consolidation entries by type (elimination, reclassification, adjustment, accrual).
 *
 * @param entryType - Entry type
 * @param fiscalYear - Fiscal year
 * @returns Array of ConsolidationEntry records
 *
 * @example
 * const eliminations = await getConsolidationEntriesByType('elimination', 2024);
 */
export async function getConsolidationEntriesByType(
  entryType: 'elimination' | 'reclassification' | 'adjustment' | 'accrual',
  fiscalYear: number
): Promise<ConsolidationEntry[]> {
  return await ConsolidationEntry.findAll({
    where: { entryType, fiscalYear },
    order: [['amount', 'DESC']],
  });
}

/**
 * Approves a consolidation entry for inclusion in financial statements.
 *
 * @param entryId - Entry identifier
 * @param reviewerId - User approving the entry
 * @returns Updated ConsolidationEntry record
 *
 * @example
 * const entry = await approveConsolidationEntry('660e8400-e29b-41d4-a716-446655440000', 'john.doe');
 */
export async function approveConsolidationEntry(
  entryId: string,
  reviewerId: string
): Promise<ConsolidationEntry | null> {
  const entry = await ConsolidationEntry.findByPk(entryId);
  if (!entry) return null;
  entry.reviewStatus = 'approved';
  entry.reviewedBy = reviewerId;
  entry.reviewedAt = new Date();
  await entry.save();
  return entry;
}

/**
 * Retrieves pending consolidation entries awaiting review.
 *
 * @param fiscalYear - Fiscal year
 * @returns Array of pending ConsolidationEntry records
 *
 * @example
 * const pendingEntries = await getPendingConsolidationEntries(2024);
 */
export async function getPendingConsolidationEntries(
  fiscalYear: number
): Promise<ConsolidationEntry[]> {
  return await ConsolidationEntry.findAll({
    where: { fiscalYear, reviewStatus: 'pending' },
    order: [['amount', 'DESC']],
  });
}

/**
 * Calculates total consolidation adjustments by entry type.
 *
 * @param fiscalYear - Fiscal year
 * @param entryType - Entry type
 * @returns Total adjustment amount
 *
 * @example
 * const totalEliminations = await calculateTotalConsolidationAdjustments(2024, 'elimination');
 */
export async function calculateTotalConsolidationAdjustments(
  fiscalYear: number,
  entryType: 'elimination' | 'reclassification' | 'adjustment' | 'accrual'
): Promise<number> {
  const entries = await ConsolidationEntry.findAll({
    where: { fiscalYear, entryType, reviewStatus: 'approved' },
  });
  return entries.reduce((total, entry) => total + Number(entry.amount), 0);
}

// =============================================================================
// COMPOSITE FUNCTIONS - FINANCIAL STATEMENT GENERATION
// =============================================================================

/**
 * Creates a financial statement with specified type and level.
 *
 * @param statementData - Financial statement creation attributes
 * @returns Created FinancialStatement record
 *
 * @example
 * const statement = await createFinancialStatement({
 *   fiscalYear: 2024,
 *   statementType: 'net_position',
 *   statementLevel: 'government_wide',
 *   statementDate: new Date('2024-06-30'),
 *   statementData: { assets: {}, liabilities: {}, netPosition: {} },
 *   totalAssets: 5000000.00,
 *   totalLiabilities: 2000000.00,
 *   totalNetPosition: 3000000.00,
 *   status: 'draft',
 *   metadata: {}
 * });
 */
export async function createFinancialStatement(
  statementData: FinancialStatementCreationAttributes
): Promise<FinancialStatement> {
  return await FinancialStatement.create(statementData);
}

/**
 * Retrieves a financial statement by unique ID.
 *
 * @param statementId - Statement identifier
 * @returns FinancialStatement record or null
 *
 * @example
 * const statement = await getFinancialStatementById('770e8400-e29b-41d4-a716-446655440000');
 */
export async function getFinancialStatementById(
  statementId: string
): Promise<FinancialStatement | null> {
  return await FinancialStatement.findByPk(statementId);
}

/**
 * Retrieves all financial statements for a specific fiscal year.
 *
 * @param fiscalYear - Fiscal year
 * @returns Array of FinancialStatement records
 *
 * @example
 * const statements = await getFinancialStatementsByFiscalYear(2024);
 */
export async function getFinancialStatementsByFiscalYear(
  fiscalYear: number
): Promise<FinancialStatement[]> {
  return await FinancialStatement.findAll({
    where: { fiscalYear },
    order: [['statementType', 'ASC']],
  });
}

/**
 * Retrieves government-wide financial statements.
 *
 * @param fiscalYear - Fiscal year
 * @returns Array of government-wide FinancialStatement records
 *
 * @example
 * const govWideStatements = await getGovernmentWideStatements(2024);
 */
export async function getGovernmentWideStatements(
  fiscalYear: number
): Promise<FinancialStatement[]> {
  return await FinancialStatement.findAll({
    where: { fiscalYear, statementLevel: 'government_wide' },
    order: [['statementType', 'ASC']],
  });
}

/**
 * Retrieves fund-level financial statements for a specific fund.
 *
 * @param fundId - Fund identifier
 * @param fiscalYear - Fiscal year
 * @returns Array of fund-level FinancialStatement records
 *
 * @example
 * const fundStatements = await getFundLevelStatements('550e8400-e29b-41d4-a716-446655440000', 2024);
 */
export async function getFundLevelStatements(
  fundId: string,
  fiscalYear: number
): Promise<FinancialStatement[]> {
  return await FinancialStatement.findAll({
    where: { fundId, fiscalYear },
    order: [['statementType', 'ASC']],
  });
}

/**
 * Updates financial statement status (draft, preliminary, final, published).
 *
 * @param statementId - Statement identifier
 * @param status - New status
 * @param approverId - User approving the statement (optional)
 * @returns Updated FinancialStatement record
 *
 * @example
 * const statement = await updateFinancialStatementStatus('770e8400-e29b-41d4-a716-446655440000', 'final', 'cfo@usace.gov');
 */
export async function updateFinancialStatementStatus(
  statementId: string,
  status: 'draft' | 'preliminary' | 'final' | 'published',
  approverId?: string
): Promise<FinancialStatement | null> {
  const statement = await FinancialStatement.findByPk(statementId);
  if (!statement) return null;
  statement.status = status;
  if (approverId && (status === 'final' || status === 'published')) {
    statement.approvedBy = approverId;
    statement.approvedAt = new Date();
  }
  await statement.save();
  return statement;
}

/**
 * Generates Statement of Net Position (government-wide).
 *
 * @param fiscalYear - Fiscal year
 * @param statementDate - Statement date
 * @returns Created FinancialStatement record
 *
 * @example
 * const netPositionStatement = await generateStatementOfNetPosition(2024, new Date('2024-06-30'));
 */
export async function generateStatementOfNetPosition(
  fiscalYear: number,
  statementDate: Date
): Promise<FinancialStatement> {
  const statementData = {
    assets: {
      current: 1500000,
      capitalAssets: 3500000,
      total: 5000000,
    },
    liabilities: {
      current: 500000,
      longTerm: 1500000,
      total: 2000000,
    },
    netPosition: {
      investedInCapitalAssets: 2000000,
      restricted: 500000,
      unrestricted: 500000,
      total: 3000000,
    },
  };

  return await createFinancialStatement({
    fiscalYear,
    statementType: 'net_position',
    statementLevel: 'government_wide',
    statementDate,
    statementData,
    totalAssets: 5000000,
    totalLiabilities: 2000000,
    totalNetPosition: 3000000,
    status: 'draft',
    metadata: { generatedAt: new Date().toISOString() },
  });
}

/**
 * Generates Statement of Activities (government-wide).
 *
 * @param fiscalYear - Fiscal year
 * @param statementDate - Statement date
 * @returns Created FinancialStatement record
 *
 * @example
 * const activitiesStatement = await generateStatementOfActivities(2024, new Date('2024-06-30'));
 */
export async function generateStatementOfActivities(
  fiscalYear: number,
  statementDate: Date
): Promise<FinancialStatement> {
  const statementData = {
    expenses: {
      generalGovernment: 500000,
      publicSafety: 300000,
      publicWorks: 400000,
      cultureRecreation: 200000,
      total: 1400000,
    },
    programRevenues: {
      chargesForServices: 300000,
      operatingGrants: 200000,
      capitalGrants: 100000,
      total: 600000,
    },
    netExpense: -800000,
    generalRevenues: {
      taxes: 700000,
      intergovernmentalRevenues: 300000,
      investmentEarnings: 50000,
      miscellaneous: 50000,
      total: 1100000,
    },
    changeInNetPosition: 300000,
    netPositionBeginning: 2700000,
    netPositionEnding: 3000000,
  };

  return await createFinancialStatement({
    fiscalYear,
    statementType: 'activities',
    statementLevel: 'government_wide',
    statementDate,
    statementData,
    totalAssets: 0,
    totalLiabilities: 0,
    totalNetPosition: 3000000,
    status: 'draft',
    metadata: { generatedAt: new Date().toISOString() },
  });
}

// =============================================================================
// COMPOSITE FUNCTIONS - CAFR PREPARATION
// =============================================================================

/**
 * Creates a CAFR section with specified type and content.
 *
 * @param sectionData - CAFR section creation attributes
 * @returns Created CAFRSection record
 *
 * @example
 * const section = await createCAFRSection({
 *   fiscalYear: 2024,
 *   sectionType: 'introductory',
 *   sectionName: 'Letter of Transmittal',
 *   sectionContent: 'To the citizens of...',
 *   sectionOrder: 1,
 *   includedStatements: [],
 *   includedSchedules: [],
 *   pageCount: 5,
 *   status: 'draft',
 *   metadata: {}
 * });
 */
export async function createCAFRSection(
  sectionData: CAFRSectionCreationAttributes
): Promise<CAFRSection> {
  return await CAFRSection.create(sectionData);
}

/**
 * Retrieves all CAFR sections for a specific fiscal year.
 *
 * @param fiscalYear - Fiscal year
 * @returns Array of CAFRSection records ordered by section order
 *
 * @example
 * const sections = await getCAFRSectionsByFiscalYear(2024);
 */
export async function getCAFRSectionsByFiscalYear(
  fiscalYear: number
): Promise<CAFRSection[]> {
  return await CAFRSection.findAll({
    where: { fiscalYear },
    order: [['sectionOrder', 'ASC']],
  });
}

/**
 * Retrieves CAFR sections by type (introductory, financial, statistical).
 *
 * @param fiscalYear - Fiscal year
 * @param sectionType - Section type
 * @returns Array of CAFRSection records
 *
 * @example
 * const financialSections = await getCAFRSectionsByType(2024, 'financial');
 */
export async function getCAFRSectionsByType(
  fiscalYear: number,
  sectionType: 'introductory' | 'financial' | 'statistical'
): Promise<CAFRSection[]> {
  return await CAFRSection.findAll({
    where: { fiscalYear, sectionType },
    order: [['sectionOrder', 'ASC']],
  });
}

/**
 * Updates CAFR section content and status.
 *
 * @param sectionId - Section identifier
 * @param sectionContent - Updated content
 * @param status - New status
 * @returns Updated CAFRSection record
 *
 * @example
 * const section = await updateCAFRSection('880e8400-e29b-41d4-a716-446655440000', 'Updated content...', 'review');
 */
export async function updateCAFRSection(
  sectionId: string,
  sectionContent: string,
  status: 'draft' | 'review' | 'final'
): Promise<CAFRSection | null> {
  const section = await CAFRSection.findByPk(sectionId);
  if (!section) return null;
  section.sectionContent = sectionContent;
  section.status = status;
  await section.save();
  return section;
}

/**
 * Generates complete CAFR package with all required sections.
 *
 * @param fiscalYear - Fiscal year
 * @returns Array of created CAFRSection records
 *
 * @example
 * const cafrSections = await generateCompleteCAFR(2024);
 */
export async function generateCompleteCAFR(
  fiscalYear: number
): Promise<CAFRSection[]> {
  const sections = [
    {
      fiscalYear,
      sectionType: 'introductory' as const,
      sectionName: 'Letter of Transmittal',
      sectionContent: 'CAFR Letter of Transmittal for FY ' + fiscalYear,
      sectionOrder: 1,
      includedStatements: [],
      includedSchedules: [],
      pageCount: 5,
      status: 'draft' as const,
      metadata: {},
    },
    {
      fiscalYear,
      sectionType: 'introductory' as const,
      sectionName: 'Organizational Chart',
      sectionContent: 'USACE Organizational Structure',
      sectionOrder: 2,
      includedStatements: [],
      includedSchedules: [],
      pageCount: 1,
      status: 'draft' as const,
      metadata: {},
    },
    {
      fiscalYear,
      sectionType: 'financial' as const,
      sectionName: 'Independent Auditor Report',
      sectionContent: 'Independent Auditor Report on Financial Statements',
      sectionOrder: 3,
      includedStatements: [],
      includedSchedules: [],
      pageCount: 3,
      status: 'draft' as const,
      metadata: {},
    },
    {
      fiscalYear,
      sectionType: 'financial' as const,
      sectionName: 'Management Discussion and Analysis',
      sectionContent: 'MD&A Section',
      sectionOrder: 4,
      includedStatements: [],
      includedSchedules: [],
      pageCount: 10,
      status: 'draft' as const,
      metadata: {},
    },
    {
      fiscalYear,
      sectionType: 'financial' as const,
      sectionName: 'Basic Financial Statements',
      sectionContent: 'Government-wide and Fund Financial Statements',
      sectionOrder: 5,
      includedStatements: ['net_position', 'activities', 'balance_sheet', 'revenues_expenditures'],
      includedSchedules: [],
      pageCount: 20,
      status: 'draft' as const,
      metadata: {},
    },
    {
      fiscalYear,
      sectionType: 'financial' as const,
      sectionName: 'Notes to Financial Statements',
      sectionContent: 'Notes to Financial Statements',
      sectionOrder: 6,
      includedStatements: [],
      includedSchedules: [],
      pageCount: 30,
      status: 'draft' as const,
      metadata: {},
    },
    {
      fiscalYear,
      sectionType: 'statistical' as const,
      sectionName: 'Financial Trends',
      sectionContent: 'Ten-year Financial Trend Data',
      sectionOrder: 7,
      includedStatements: [],
      includedSchedules: ['financial_trends'],
      pageCount: 5,
      status: 'draft' as const,
      metadata: {},
    },
  ];

  const createdSections = [];
  for (const sectionData of sections) {
    const section = await createCAFRSection(sectionData);
    createdSections.push(section);
  }

  return createdSections;
}

/**
 * Marks all CAFR sections as final for publication.
 *
 * @param fiscalYear - Fiscal year
 * @param reviewerId - User finalizing the CAFR
 * @returns Array of updated CAFRSection records
 *
 * @example
 * const finalizedSections = await finalizeCAFRSections(2024, 'cfo@usace.gov');
 */
export async function finalizeCAFRSections(
  fiscalYear: number,
  reviewerId: string
): Promise<CAFRSection[]> {
  const sections = await CAFRSection.findAll({
    where: { fiscalYear },
  });

  for (const section of sections) {
    section.status = 'final';
    section.lastReviewedBy = reviewerId;
    section.lastReviewedAt = new Date();
    await section.save();
  }

  return sections;
}

/**
 * Calculates total page count for CAFR.
 *
 * @param fiscalYear - Fiscal year
 * @returns Total page count across all sections
 *
 * @example
 * const totalPages = await calculateCAFRPageCount(2024);
 */
export async function calculateCAFRPageCount(fiscalYear: number): Promise<number> {
  const sections = await CAFRSection.findAll({
    where: { fiscalYear },
  });
  return sections.reduce((total, section) => total + section.pageCount, 0);
}

// =============================================================================
// COMPOSITE FUNCTIONS - MD&A AND NOTES
// =============================================================================

/**
 * Creates Management Discussion and Analysis (MD&A) content.
 *
 * @param mdaData - MD&A content creation attributes
 * @returns Created MDAContent record
 *
 * @example
 * const mda = await createMDAContent({
 *   fiscalYear: 2024,
 *   executiveSummary: 'The fiscal year 2024 represents...',
 *   financialHighlights: { assets: 5000000, liabilities: 2000000 },
 *   trendAnalysis: { revenueGrowth: 5.2, expenseGrowth: 3.8 },
 *   significantEvents: ['New capital project approved'],
 *   futureOutlook: 'We expect continued growth...',
 *   capitalAssetActivity: 'Added $500,000 in equipment',
 *   debtActivity: 'Retired $200,000 in bonds',
 *   economicFactors: 'Stable economic conditions',
 *   status: 'draft',
 *   metadata: {}
 * });
 */
export async function createMDAContent(
  mdaData: MDAContentCreationAttributes
): Promise<MDAContent> {
  return await MDAContent.create(mdaData);
}

/**
 * Retrieves MD&A content for a specific fiscal year.
 *
 * @param fiscalYear - Fiscal year
 * @returns MDAContent record or null
 *
 * @example
 * const mda = await getMDAContentByFiscalYear(2024);
 */
export async function getMDAContentByFiscalYear(
  fiscalYear: number
): Promise<MDAContent | null> {
  return await MDAContent.findOne({
    where: { fiscalYear },
  });
}

/**
 * Updates MD&A content and status.
 *
 * @param mdaId - MD&A identifier
 * @param updates - Partial updates to MD&A content
 * @returns Updated MDAContent record
 *
 * @example
 * const mda = await updateMDAContent('990e8400-e29b-41d4-a716-446655440000', {
 *   executiveSummary: 'Updated summary...',
 *   status: 'review'
 * });
 */
export async function updateMDAContent(
  mdaId: string,
  updates: Partial<MDAContentAttributes>
): Promise<MDAContent | null> {
  const mda = await MDAContent.findByPk(mdaId);
  if (!mda) return null;
  await mda.update(updates);
  return mda;
}

/**
 * Approves MD&A content for final publication.
 *
 * @param mdaId - MD&A identifier
 * @param approverId - User approving the MD&A
 * @returns Updated MDAContent record
 *
 * @example
 * const mda = await approveMDAContent('990e8400-e29b-41d4-a716-446655440000', 'cfo@usace.gov');
 */
export async function approveMDAContent(
  mdaId: string,
  approverId: string
): Promise<MDAContent | null> {
  const mda = await MDAContent.findByPk(mdaId);
  if (!mda) return null;
  mda.status = 'final';
  mda.approvedBy = approverId;
  mda.approvedAt = new Date();
  await mda.save();
  return mda;
}

/**
 * Creates a note disclosure for financial statements.
 *
 * @param noteData - Note disclosure creation attributes
 * @returns Created NoteDisclosure record
 *
 * @example
 * const note = await createNoteDisclosure({
 *   fiscalYear: 2024,
 *   noteNumber: 'Note 1',
 *   noteTitle: 'Summary of Significant Accounting Policies',
 *   noteCategory: 'Accounting Policies',
 *   noteContent: 'The financial statements are prepared using...',
 *   referencedStatements: ['net_position', 'activities'],
 *   referencedAccounts: ['1000', '2000'],
 *   disclosureType: 'policy',
 *   isRequired: true,
 *   status: 'draft',
 *   metadata: {}
 * });
 */
export async function createNoteDisclosure(
  noteData: NoteDisclosureCreationAttributes
): Promise<NoteDisclosure> {
  return await NoteDisclosure.create(noteData);
}

/**
 * Retrieves all note disclosures for a specific fiscal year.
 *
 * @param fiscalYear - Fiscal year
 * @returns Array of NoteDisclosure records ordered by note number
 *
 * @example
 * const notes = await getNoteDisclosuresByFiscalYear(2024);
 */
export async function getNoteDisclosuresByFiscalYear(
  fiscalYear: number
): Promise<NoteDisclosure[]> {
  return await NoteDisclosure.findAll({
    where: { fiscalYear },
    order: [['noteNumber', 'ASC']],
  });
}

/**
 * Updates note disclosure content and status.
 *
 * @param noteId - Note identifier
 * @param noteContent - Updated content
 * @param status - New status
 * @returns Updated NoteDisclosure record
 *
 * @example
 * const note = await updateNoteDisclosure('AA0e8400-e29b-41d4-a716-446655440000', 'Updated content...', 'final');
 */
export async function updateNoteDisclosure(
  noteId: string,
  noteContent: string,
  status: 'draft' | 'review' | 'final'
): Promise<NoteDisclosure | null> {
  const note = await NoteDisclosure.findByPk(noteId);
  if (!note) return null;
  note.noteContent = noteContent;
  note.status = status;
  await note.save();
  return note;
}

// =============================================================================
// COMPOSITE FUNCTIONS - STATISTICAL SECTION
// =============================================================================

/**
 * Creates statistical data entry for CAFR statistical section.
 *
 * @param dataEntry - Statistical data creation attributes
 * @returns Created StatisticalData record
 *
 * @example
 * const data = await createStatisticalData({
 *   fiscalYear: 2024,
 *   dataCategory: 'financial_trends',
 *   dataType: 'Net Position',
 *   dataName: 'Total Net Position',
 *   dataValue: 3000000,
 *   dataUnit: 'USD',
 *   calculationMethod: 'Total Assets - Total Liabilities',
 *   sourceDocuments: ['Statement of Net Position FY2024'],
 *   metadata: {}
 * });
 */
export async function createStatisticalData(
  dataEntry: StatisticalDataCreationAttributes
): Promise<StatisticalData> {
  return await StatisticalData.create(dataEntry);
}

/**
 * Retrieves statistical data for a specific category and fiscal year.
 *
 * @param fiscalYear - Fiscal year
 * @param dataCategory - Data category
 * @returns Array of StatisticalData records
 *
 * @example
 * const trendData = await getStatisticalDataByCategory(2024, 'financial_trends');
 */
export async function getStatisticalDataByCategory(
  fiscalYear: number,
  dataCategory: 'financial_trends' | 'revenue_capacity' | 'debt_capacity' | 'demographic_economic' | 'operating_information'
): Promise<StatisticalData[]> {
  return await StatisticalData.findAll({
    where: { fiscalYear, dataCategory },
    order: [['dataType', 'ASC'], ['dataName', 'ASC']],
  });
}

/**
 * Retrieves ten-year statistical trend data.
 *
 * @param startYear - Starting fiscal year
 * @param dataType - Data type to retrieve
 * @returns Array of StatisticalData records covering ten years
 *
 * @example
 * const tenYearData = await getTenYearStatisticalTrend(2015, 'Net Position');
 */
export async function getTenYearStatisticalTrend(
  startYear: number,
  dataType: string
): Promise<StatisticalData[]> {
  const endYear = startYear + 9;
  return await StatisticalData.findAll({
    where: {
      fiscalYear: {
        $gte: startYear,
        $lte: endYear,
      } as any,
      dataType,
    },
    order: [['fiscalYear', 'ASC']],
  });
}

/**
 * Bulk creates statistical data for multiple years.
 *
 * @param dataEntries - Array of statistical data creation attributes
 * @returns Array of created StatisticalData records
 *
 * @example
 * const dataEntries = [
 *   { fiscalYear: 2023, dataCategory: 'financial_trends', dataType: 'Revenue', dataName: 'Total Revenue', dataValue: 1000000, dataUnit: 'USD', calculationMethod: 'Sum of all revenues', sourceDocuments: [], metadata: {} },
 *   { fiscalYear: 2024, dataCategory: 'financial_trends', dataType: 'Revenue', dataName: 'Total Revenue', dataValue: 1100000, dataUnit: 'USD', calculationMethod: 'Sum of all revenues', sourceDocuments: [], metadata: {} }
 * ];
 * const data = await bulkCreateStatisticalData(dataEntries);
 */
export async function bulkCreateStatisticalData(
  dataEntries: StatisticalDataCreationAttributes[]
): Promise<StatisticalData[]> {
  return await StatisticalData.bulkCreate(dataEntries);
}

/**
 * Calculates year-over-year percentage change for statistical data.
 *
 * @param currentYear - Current fiscal year
 * @param priorYear - Prior fiscal year
 * @param dataType - Data type to compare
 * @returns Percentage change
 *
 * @example
 * const percentageChange = await calculateYearOverYearChange(2024, 2023, 'Total Revenue');
 */
export async function calculateYearOverYearChange(
  currentYear: number,
  priorYear: number,
  dataType: string
): Promise<number | null> {
  const currentData = await StatisticalData.findOne({
    where: { fiscalYear: currentYear, dataType },
  });
  const priorData = await StatisticalData.findOne({
    where: { fiscalYear: priorYear, dataType },
  });

  if (!currentData || !priorData || Number(priorData.dataValue) === 0) {
    return null;
  }

  const change = ((Number(currentData.dataValue) - Number(priorData.dataValue)) / Number(priorData.dataValue)) * 100;
  return Math.round(change * 100) / 100;
}

// =============================================================================
// COMPOSITE FUNCTIONS - GASB COMPLIANCE
// =============================================================================

/**
 * Creates a GASB compliance check for a specific standard.
 *
 * @param complianceData - GASB compliance check creation attributes
 * @returns Created GASBComplianceCheck record
 *
 * @example
 * const check = await createGASBComplianceCheck({
 *   fiscalYear: 2024,
 *   gasbStandard: 'GASB 34',
 *   standardTitle: 'Basic Financial Statements for State and Local Governments',
 *   requirementDescription: 'Government-wide financial statements required',
 *   complianceStatus: 'compliant',
 *   evidenceDocuments: ['Statement of Net Position', 'Statement of Activities'],
 *   findings: 'All required statements prepared and presented',
 *   correctiveActions: [],
 *   metadata: {}
 * });
 */
export async function createGASBComplianceCheck(
  complianceData: GASBComplianceCheckCreationAttributes
): Promise<GASBComplianceCheck> {
  return await GASBComplianceCheck.create(complianceData);
}

/**
 * Retrieves all GASB compliance checks for a specific fiscal year.
 *
 * @param fiscalYear - Fiscal year
 * @returns Array of GASBComplianceCheck records
 *
 * @example
 * const checks = await getGASBComplianceChecksByFiscalYear(2024);
 */
export async function getGASBComplianceChecksByFiscalYear(
  fiscalYear: number
): Promise<GASBComplianceCheck[]> {
  return await GASBComplianceCheck.findAll({
    where: { fiscalYear },
    order: [['gasbStandard', 'ASC']],
  });
}

/**
 * Retrieves non-compliant GASB checks requiring corrective action.
 *
 * @param fiscalYear - Fiscal year
 * @returns Array of non-compliant GASBComplianceCheck records
 *
 * @example
 * const nonCompliant = await getNonCompliantGASBChecks(2024);
 */
export async function getNonCompliantGASBChecks(
  fiscalYear: number
): Promise<GASBComplianceCheck[]> {
  return await GASBComplianceCheck.findAll({
    where: {
      fiscalYear,
      complianceStatus: {
        $in: ['non_compliant', 'partially_compliant'],
      } as any,
    },
    order: [['gasbStandard', 'ASC']],
  });
}

/**
 * Verifies GASB compliance check and marks as verified.
 *
 * @param complianceId - Compliance check identifier
 * @param verifierId - User verifying the compliance
 * @returns Updated GASBComplianceCheck record
 *
 * @example
 * const check = await verifyGASBCompliance('BB0e8400-e29b-41d4-a716-446655440000', 'auditor@usace.gov');
 */
export async function verifyGASBCompliance(
  complianceId: string,
  verifierId: string
): Promise<GASBComplianceCheck | null> {
  const check = await GASBComplianceCheck.findByPk(complianceId);
  if (!check) return null;
  check.verifiedBy = verifierId;
  check.verifiedAt = new Date();
  await check.save();
  return check;
}

/**
 * Updates GASB compliance status with corrective actions.
 *
 * @param complianceId - Compliance check identifier
 * @param complianceStatus - New compliance status
 * @param correctiveActions - Array of corrective actions
 * @returns Updated GASBComplianceCheck record
 *
 * @example
 * const check = await updateGASBComplianceStatus('BB0e8400-e29b-41d4-a716-446655440000', 'partially_compliant', ['Prepare additional note disclosure']);
 */
export async function updateGASBComplianceStatus(
  complianceId: string,
  complianceStatus: 'compliant' | 'non_compliant' | 'partially_compliant' | 'not_applicable',
  correctiveActions: string[]
): Promise<GASBComplianceCheck | null> {
  const check = await GASBComplianceCheck.findByPk(complianceId);
  if (!check) return null;
  check.complianceStatus = complianceStatus;
  check.correctiveActions = correctiveActions;
  await check.save();
  return check;
}

/**
 * Generates GASB compliance report for fiscal year.
 *
 * @param fiscalYear - Fiscal year
 * @returns Compliance report summary
 *
 * @example
 * const report = await generateGASBComplianceReport(2024);
 */
export async function generateGASBComplianceReport(
  fiscalYear: number
): Promise<{
  totalChecks: number;
  compliant: number;
  nonCompliant: number;
  partiallyCompliant: number;
  notApplicable: number;
  complianceRate: number;
}> {
  const checks = await GASBComplianceCheck.findAll({
    where: { fiscalYear },
  });

  const totalChecks = checks.length;
  const compliant = checks.filter(c => c.complianceStatus === 'compliant').length;
  const nonCompliant = checks.filter(c => c.complianceStatus === 'non_compliant').length;
  const partiallyCompliant = checks.filter(c => c.complianceStatus === 'partially_compliant').length;
  const notApplicable = checks.filter(c => c.complianceStatus === 'not_applicable').length;

  const applicableChecks = totalChecks - notApplicable;
  const complianceRate = applicableChecks > 0 ? (compliant / applicableChecks) * 100 : 0;

  return {
    totalChecks,
    compliant,
    nonCompliant,
    partiallyCompliant,
    notApplicable,
    complianceRate: Math.round(complianceRate * 100) / 100,
  };
}

// =============================================================================
// NESTJS SERVICE WRAPPER
// =============================================================================

/**
 * NestJS Injectable service for Financial Statement Consolidation operations.
 * Provides comprehensive CAFR preparation and GASB compliance management.
 */
@Injectable()
export class CEFMSFinancialStatementConsolidationService {
  // Fund Management
  async createFund(fundData: FundCreationAttributes): Promise<Fund> {
    return await createFund(fundData);
  }

  async getFundById(fundId: string): Promise<Fund | null> {
    return await getFundById(fundId);
  }

  async getFundsByFiscalYear(fiscalYear: number): Promise<Fund[]> {
    return await getFundsByFiscalYear(fiscalYear);
  }

  async getFundsByType(fundType: 'governmental' | 'proprietary' | 'fiduciary'): Promise<Fund[]> {
    return await getFundsByType(fundType);
  }

  async updateFundStatus(fundId: string, status: 'active' | 'inactive' | 'closed'): Promise<Fund | null> {
    return await updateFundStatus(fundId, status);
  }

  // Consolidation Entries
  async createConsolidationEntry(entryData: ConsolidationEntryCreationAttributes): Promise<ConsolidationEntry> {
    return await createConsolidationEntry(entryData);
  }

  async getConsolidationEntriesByFund(fundId: string, fiscalYear: number): Promise<ConsolidationEntry[]> {
    return await getConsolidationEntriesByFund(fundId, fiscalYear);
  }

  async getConsolidationEntriesByType(entryType: 'elimination' | 'reclassification' | 'adjustment' | 'accrual', fiscalYear: number): Promise<ConsolidationEntry[]> {
    return await getConsolidationEntriesByType(entryType, fiscalYear);
  }

  async approveConsolidationEntry(entryId: string, reviewerId: string): Promise<ConsolidationEntry | null> {
    return await approveConsolidationEntry(entryId, reviewerId);
  }

  async getPendingConsolidationEntries(fiscalYear: number): Promise<ConsolidationEntry[]> {
    return await getPendingConsolidationEntries(fiscalYear);
  }

  async calculateTotalConsolidationAdjustments(fiscalYear: number, entryType: 'elimination' | 'reclassification' | 'adjustment' | 'accrual'): Promise<number> {
    return await calculateTotalConsolidationAdjustments(fiscalYear, entryType);
  }

  // Financial Statement Generation
  async createFinancialStatement(statementData: FinancialStatementCreationAttributes): Promise<FinancialStatement> {
    return await createFinancialStatement(statementData);
  }

  async getFinancialStatementById(statementId: string): Promise<FinancialStatement | null> {
    return await getFinancialStatementById(statementId);
  }

  async getFinancialStatementsByFiscalYear(fiscalYear: number): Promise<FinancialStatement[]> {
    return await getFinancialStatementsByFiscalYear(fiscalYear);
  }

  async getGovernmentWideStatements(fiscalYear: number): Promise<FinancialStatement[]> {
    return await getGovernmentWideStatements(fiscalYear);
  }

  async getFundLevelStatements(fundId: string, fiscalYear: number): Promise<FinancialStatement[]> {
    return await getFundLevelStatements(fundId, fiscalYear);
  }

  async updateFinancialStatementStatus(statementId: string, status: 'draft' | 'preliminary' | 'final' | 'published', approverId?: string): Promise<FinancialStatement | null> {
    return await updateFinancialStatementStatus(statementId, status, approverId);
  }

  async generateStatementOfNetPosition(fiscalYear: number, statementDate: Date): Promise<FinancialStatement> {
    return await generateStatementOfNetPosition(fiscalYear, statementDate);
  }

  async generateStatementOfActivities(fiscalYear: number, statementDate: Date): Promise<FinancialStatement> {
    return await generateStatementOfActivities(fiscalYear, statementDate);
  }

  // CAFR Preparation
  async createCAFRSection(sectionData: CAFRSectionCreationAttributes): Promise<CAFRSection> {
    return await createCAFRSection(sectionData);
  }

  async getCAFRSectionsByFiscalYear(fiscalYear: number): Promise<CAFRSection[]> {
    return await getCAFRSectionsByFiscalYear(fiscalYear);
  }

  async getCAFRSectionsByType(fiscalYear: number, sectionType: 'introductory' | 'financial' | 'statistical'): Promise<CAFRSection[]> {
    return await getCAFRSectionsByType(fiscalYear, sectionType);
  }

  async updateCAFRSection(sectionId: string, sectionContent: string, status: 'draft' | 'review' | 'final'): Promise<CAFRSection | null> {
    return await updateCAFRSection(sectionId, sectionContent, status);
  }

  async generateCompleteCAFR(fiscalYear: number): Promise<CAFRSection[]> {
    return await generateCompleteCAFR(fiscalYear);
  }

  async finalizeCAFRSections(fiscalYear: number, reviewerId: string): Promise<CAFRSection[]> {
    return await finalizeCAFRSections(fiscalYear, reviewerId);
  }

  async calculateCAFRPageCount(fiscalYear: number): Promise<number> {
    return await calculateCAFRPageCount(fiscalYear);
  }

  // MD&A and Notes
  async createMDAContent(mdaData: MDAContentCreationAttributes): Promise<MDAContent> {
    return await createMDAContent(mdaData);
  }

  async getMDAContentByFiscalYear(fiscalYear: number): Promise<MDAContent | null> {
    return await getMDAContentByFiscalYear(fiscalYear);
  }

  async updateMDAContent(mdaId: string, updates: Partial<MDAContentAttributes>): Promise<MDAContent | null> {
    return await updateMDAContent(mdaId, updates);
  }

  async approveMDAContent(mdaId: string, approverId: string): Promise<MDAContent | null> {
    return await approveMDAContent(mdaId, approverId);
  }

  async createNoteDisclosure(noteData: NoteDisclosureCreationAttributes): Promise<NoteDisclosure> {
    return await createNoteDisclosure(noteData);
  }

  async getNoteDisclosuresByFiscalYear(fiscalYear: number): Promise<NoteDisclosure[]> {
    return await getNoteDisclosuresByFiscalYear(fiscalYear);
  }

  async updateNoteDisclosure(noteId: string, noteContent: string, status: 'draft' | 'review' | 'final'): Promise<NoteDisclosure | null> {
    return await updateNoteDisclosure(noteId, noteContent, status);
  }

  // Statistical Section
  async createStatisticalData(dataEntry: StatisticalDataCreationAttributes): Promise<StatisticalData> {
    return await createStatisticalData(dataEntry);
  }

  async getStatisticalDataByCategory(fiscalYear: number, dataCategory: 'financial_trends' | 'revenue_capacity' | 'debt_capacity' | 'demographic_economic' | 'operating_information'): Promise<StatisticalData[]> {
    return await getStatisticalDataByCategory(fiscalYear, dataCategory);
  }

  async getTenYearStatisticalTrend(startYear: number, dataType: string): Promise<StatisticalData[]> {
    return await getTenYearStatisticalTrend(startYear, dataType);
  }

  async bulkCreateStatisticalData(dataEntries: StatisticalDataCreationAttributes[]): Promise<StatisticalData[]> {
    return await bulkCreateStatisticalData(dataEntries);
  }

  async calculateYearOverYearChange(currentYear: number, priorYear: number, dataType: string): Promise<number | null> {
    return await calculateYearOverYearChange(currentYear, priorYear, dataType);
  }

  // GASB Compliance
  async createGASBComplianceCheck(complianceData: GASBComplianceCheckCreationAttributes): Promise<GASBComplianceCheck> {
    return await createGASBComplianceCheck(complianceData);
  }

  async getGASBComplianceChecksByFiscalYear(fiscalYear: number): Promise<GASBComplianceCheck[]> {
    return await getGASBComplianceChecksByFiscalYear(fiscalYear);
  }

  async getNonCompliantGASBChecks(fiscalYear: number): Promise<GASBComplianceCheck[]> {
    return await getNonCompliantGASBChecks(fiscalYear);
  }

  async verifyGASBCompliance(complianceId: string, verifierId: string): Promise<GASBComplianceCheck | null> {
    return await verifyGASBCompliance(complianceId, verifierId);
  }

  async updateGASBComplianceStatus(complianceId: string, complianceStatus: 'compliant' | 'non_compliant' | 'partially_compliant' | 'not_applicable', correctiveActions: string[]): Promise<GASBComplianceCheck | null> {
    return await updateGASBComplianceStatus(complianceId, complianceStatus, correctiveActions);
  }

  async generateGASBComplianceReport(fiscalYear: number): Promise<{ totalChecks: number; compliant: number; nonCompliant: number; partiallyCompliant: number; notApplicable: number; complianceRate: number }> {
    return await generateGASBComplianceReport(fiscalYear);
  }
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  // Models
  Fund,
  ConsolidationEntry,
  FinancialStatement,
  CAFRSection,
  MDAContent,
  NoteDisclosure,
  StatisticalData,
  GASBComplianceCheck,

  // Initialization
  initializeFinancialStatementConsolidationModels,

  // Fund Management Functions
  createFund,
  getFundById,
  getFundsByFiscalYear,
  getFundsByType,
  updateFundStatus,

  // Consolidation Entry Functions
  createConsolidationEntry,
  getConsolidationEntriesByFund,
  getConsolidationEntriesByType,
  approveConsolidationEntry,
  getPendingConsolidationEntries,
  calculateTotalConsolidationAdjustments,

  // Financial Statement Functions
  createFinancialStatement,
  getFinancialStatementById,
  getFinancialStatementsByFiscalYear,
  getGovernmentWideStatements,
  getFundLevelStatements,
  updateFinancialStatementStatus,
  generateStatementOfNetPosition,
  generateStatementOfActivities,

  // CAFR Preparation Functions
  createCAFRSection,
  getCAFRSectionsByFiscalYear,
  getCAFRSectionsByType,
  updateCAFRSection,
  generateCompleteCAFR,
  finalizeCAFRSections,
  calculateCAFRPageCount,

  // MD&A and Notes Functions
  createMDAContent,
  getMDAContentByFiscalYear,
  updateMDAContent,
  approveMDAContent,
  createNoteDisclosure,
  getNoteDisclosuresByFiscalYear,
  updateNoteDisclosure,

  // Statistical Section Functions
  createStatisticalData,
  getStatisticalDataByCategory,
  getTenYearStatisticalTrend,
  bulkCreateStatisticalData,
  calculateYearOverYearChange,

  // GASB Compliance Functions
  createGASBComplianceCheck,
  getGASBComplianceChecksByFiscalYear,
  getNonCompliantGASBChecks,
  verifyGASBCompliance,
  updateGASBComplianceStatus,
  generateGASBComplianceReport,

  // Service
  CEFMSFinancialStatementConsolidationService,
};
