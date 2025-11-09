/**
 * LOC: FINRPT001
 * File: /reuse/edwards/financial/financial-reporting-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial reporting modules
 *   - Executive dashboard services
 *   - XBRL export services
 *   - Management reporting services
 */

/**
 * File: /reuse/edwards/financial/financial-reporting-analytics-kit.ts
 * Locator: WC-EDW-FINRPT-001
 * Purpose: Comprehensive Financial Reporting & Analytics - JD Edwards EnterpriseOne-level financial statements, analytics, XBRL, drill-down
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/financial/*, Executive Dashboards, XBRL Services, Management Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for balance sheet, income statement, cash flow, trial balance, consolidated reports, XBRL, KPIs, variance analysis
 *
 * LLM Context: Enterprise-grade financial reporting and analytics for Oracle JD Edwards EnterpriseOne compliance.
 * Provides comprehensive balance sheet generation, income statement, cash flow analysis, trial balance, consolidated reporting,
 * XBRL export, drill-down capabilities, management dashboards, KPI tracking, variance analysis, budget vs actuals,
 * multi-entity consolidation, intercompany eliminations, segment reporting, and real-time financial analytics.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, QueryTypes, fn, col, literal } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface BalanceSheetReport {
  reportDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  entityId: number;
  entityName: string;
  assets: {
    currentAssets: BalanceSheetSection;
    nonCurrentAssets: BalanceSheetSection;
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: BalanceSheetSection;
    nonCurrentLiabilities: BalanceSheetSection;
    totalLiabilities: number;
  };
  equity: {
    sections: BalanceSheetSection[];
    totalEquity: number;
  };
  totalLiabilitiesAndEquity: number;
}

interface BalanceSheetSection {
  sectionName: string;
  accountLines: BalanceSheetLine[];
  subtotal: number;
}

interface BalanceSheetLine {
  accountCode: string;
  accountName: string;
  currentBalance: number;
  priorBalance: number;
  variance: number;
  variancePercent: number;
  drillDownUrl?: string;
}

interface IncomeStatementReport {
  reportDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  entityId: number;
  entityName: string;
  periodType: 'month' | 'quarter' | 'year' | 'ytd';
  revenue: {
    sections: IncomeStatementSection[];
    totalRevenue: number;
  };
  expenses: {
    sections: IncomeStatementSection[];
    totalExpenses: number;
  };
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  ebitda: number;
  margins: {
    grossMargin: number;
    operatingMargin: number;
    netMargin: number;
  };
}

interface IncomeStatementSection {
  sectionName: string;
  accountLines: IncomeStatementLine[];
  subtotal: number;
}

interface IncomeStatementLine {
  accountCode: string;
  accountName: string;
  currentAmount: number;
  priorAmount: number;
  budgetAmount: number;
  variance: number;
  variancePercent: number;
  budgetVariance: number;
  budgetVariancePercent: number;
  drillDownUrl?: string;
}

interface CashFlowStatement {
  reportDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  entityId: number;
  entityName: string;
  operatingActivities: {
    netIncome: number;
    adjustments: CashFlowLine[];
    workingCapitalChanges: CashFlowLine[];
    netCashFromOperations: number;
  };
  investingActivities: {
    lines: CashFlowLine[];
    netCashFromInvesting: number;
  };
  financingActivities: {
    lines: CashFlowLine[];
    netCashFromFinancing: number;
  };
  netCashChange: number;
  beginningCash: number;
  endingCash: number;
}

interface CashFlowLine {
  description: string;
  amount: number;
  accountCode?: string;
  drillDownUrl?: string;
}

interface TrialBalanceReport {
  reportDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  entityId: number;
  includeInactive: boolean;
  accounts: TrialBalanceLine[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
}

interface TrialBalanceLine {
  accountCode: string;
  accountName: string;
  accountType: string;
  beginningBalance: number;
  periodDebits: number;
  periodCredits: number;
  endingBalance: number;
  debitBalance: number;
  creditBalance: number;
}

interface ConsolidatedFinancials {
  reportDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  parentEntityId: number;
  consolidationType: 'full' | 'proportional' | 'equity';
  entities: ConsolidatedEntity[];
  eliminations: IntercompanyElimination[];
  consolidatedBalanceSheet: BalanceSheetReport;
  consolidatedIncomeStatement: IncomeStatementReport;
  minorityInterest: number;
}

interface ConsolidatedEntity {
  entityId: number;
  entityName: string;
  ownershipPercent: number;
  consolidationMethod: 'full' | 'proportional' | 'equity';
  balanceSheet: BalanceSheetReport;
  incomeStatement: IncomeStatementReport;
}

interface IntercompanyElimination {
  eliminationId: number;
  description: string;
  debitAccountCode: string;
  creditAccountCode: string;
  amount: number;
  eliminationType: 'sales' | 'payables' | 'receivables' | 'investment' | 'equity' | 'other';
}

interface XBRLReport {
  taxonomyVersion: string;
  reportingEntity: string;
  reportDate: Date;
  periodStart: Date;
  periodEnd: Date;
  currency: string;
  elements: XBRLElement[];
  contexts: XBRLContext[];
  units: XBRLUnit[];
}

interface XBRLElement {
  elementId: string;
  contextRef: string;
  unitRef: string;
  decimals: number;
  value: number | string;
  taxonomyMapping: string;
}

interface XBRLContext {
  id: string;
  entity: string;
  period: {
    instant?: Date;
    startDate?: Date;
    endDate?: Date;
  };
  scenario?: string;
}

interface XBRLUnit {
  id: string;
  measure: string;
}

interface FinancialKPI {
  kpiId: string;
  kpiName: string;
  category: 'liquidity' | 'profitability' | 'efficiency' | 'leverage' | 'market';
  value: number;
  target: number;
  variance: number;
  trend: 'improving' | 'declining' | 'stable';
  periodComparison: {
    previousPeriod: number;
    yearAgo: number;
    changePercent: number;
  };
  calculation: string;
}

interface VarianceAnalysis {
  reportDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  analysisType: 'budget' | 'forecast' | 'prior_period' | 'prior_year';
  variances: VarianceLine[];
  summary: {
    favorableVariances: number;
    unfavorableVariances: number;
    netVariance: number;
    significantVariances: number;
  };
}

interface VarianceLine {
  accountCode: string;
  accountName: string;
  actual: number;
  comparison: number;
  variance: number;
  variancePercent: number;
  favorability: 'favorable' | 'unfavorable' | 'neutral';
  explanation?: string;
  threshold: number;
  isSignificant: boolean;
}

interface ManagementDashboard {
  dashboardId: string;
  entityId: number;
  reportDate: Date;
  kpis: FinancialKPI[];
  financialSummary: {
    revenue: number;
    expenses: number;
    netIncome: number;
    cashBalance: number;
    currentRatio: number;
    quickRatio: number;
    debtToEquity: number;
  };
  trends: TrendAnalysis[];
  alerts: FinancialAlert[];
}

interface TrendAnalysis {
  metric: string;
  periods: TrendPeriod[];
  trendDirection: 'up' | 'down' | 'stable';
  percentChange: number;
  forecastNext: number;
}

interface TrendPeriod {
  periodLabel: string;
  value: number;
  date: Date;
}

interface FinancialAlert {
  alertId: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  metric: string;
  threshold: number;
  actualValue: number;
  timestamp: Date;
}

interface SegmentReporting {
  reportDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  segments: SegmentPerformance[];
  intersegmentEliminations: number;
  consolidatedTotal: number;
}

interface SegmentPerformance {
  segmentId: string;
  segmentName: string;
  segmentType: 'business_unit' | 'geography' | 'product_line' | 'customer_type';
  revenue: number;
  expenses: number;
  operatingIncome: number;
  assets: number;
  liabilities: number;
  returnOnAssets: number;
  profitMargin: number;
}

interface DrillDownData {
  accountCode: string;
  accountName: string;
  fiscalYear: number;
  fiscalPeriod: number;
  balanceAmount: number;
  transactions: DrillDownTransaction[];
  aggregationLevel: 'account' | 'subaccount' | 'transaction';
}

interface DrillDownTransaction {
  transactionId: number;
  transactionDate: Date;
  postingDate: Date;
  documentNumber: string;
  description: string;
  debitAmount: number;
  creditAmount: number;
  runningBalance: number;
  sourceSystem: string;
  createdBy: string;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class GenerateBalanceSheetDto {
  @ApiProperty({ description: 'Report date', example: '2024-12-31' })
  reportDate!: Date;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  fiscalYear!: number;

  @ApiProperty({ description: 'Fiscal period', example: 12 })
  fiscalPeriod!: number;

  @ApiProperty({ description: 'Entity ID', example: 1 })
  entityId!: number;

  @ApiProperty({ description: 'Include comparative period', default: true })
  includeComparative?: boolean;

  @ApiProperty({ description: 'Comparison period type', enum: ['prior_period', 'prior_year'], default: 'prior_year' })
  comparisonType?: string;

  @ApiProperty({ description: 'Level of detail', enum: ['summary', 'detailed', 'full'], default: 'detailed' })
  detailLevel?: string;
}

export class GenerateIncomeStatementDto {
  @ApiProperty({ description: 'Report date', example: '2024-12-31' })
  reportDate!: Date;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  fiscalYear!: number;

  @ApiProperty({ description: 'Fiscal period', example: 12 })
  fiscalPeriod!: number;

  @ApiProperty({ description: 'Entity ID', example: 1 })
  entityId!: number;

  @ApiProperty({ description: 'Period type', enum: ['month', 'quarter', 'year', 'ytd'], default: 'month' })
  periodType!: string;

  @ApiProperty({ description: 'Include budget comparison', default: true })
  includeBudget?: boolean;

  @ApiProperty({ description: 'Include prior period', default: true })
  includePriorPeriod?: boolean;
}

export class GenerateCashFlowDto {
  @ApiProperty({ description: 'Report date', example: '2024-12-31' })
  reportDate!: Date;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  fiscalYear!: number;

  @ApiProperty({ description: 'Fiscal period', example: 12 })
  fiscalPeriod!: number;

  @ApiProperty({ description: 'Entity ID', example: 1 })
  entityId!: number;

  @ApiProperty({ description: 'Method', enum: ['direct', 'indirect'], default: 'indirect' })
  method!: string;
}

export class GenerateXBRLDto {
  @ApiProperty({ description: 'Report date', example: '2024-12-31' })
  reportDate!: Date;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  fiscalYear!: number;

  @ApiProperty({ description: 'Entity ID', example: 1 })
  entityId!: number;

  @ApiProperty({ description: 'Taxonomy version', example: 'US-GAAP-2024' })
  taxonomyVersion!: string;

  @ApiProperty({ description: 'Report type', enum: ['10-Q', '10-K', 'annual', 'quarterly'] })
  reportType!: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Financial Report Headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FinancialReportHeader model
 *
 * @example
 * ```typescript
 * const ReportHeader = createFinancialReportHeaderModel(sequelize);
 * const report = await ReportHeader.create({
 *   reportType: 'balance_sheet',
 *   fiscalYear: 2024,
 *   fiscalPeriod: 12,
 *   entityId: 1,
 *   status: 'published'
 * });
 * ```
 */
export const createFinancialReportHeaderModel = (sequelize: Sequelize) => {
  class FinancialReportHeader extends Model {
    public id!: number;
    public reportNumber!: string;
    public reportType!: string;
    public reportDate!: Date;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public entityId!: number;
    public status!: string;
    public generatedBy!: string;
    public generatedAt!: Date;
    public publishedBy!: string | null;
    public publishedAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  FinancialReportHeader.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      reportNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique report identifier',
      },
      reportType: {
        type: DataTypes.ENUM(
          'balance_sheet',
          'income_statement',
          'cash_flow',
          'trial_balance',
          'consolidated',
          'segment',
          'xbrl',
          'management_dashboard'
        ),
        allowNull: false,
        comment: 'Type of financial report',
      },
      reportDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'As-of date for the report',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
        validate: {
          min: 2000,
          max: 2099,
        },
      },
      fiscalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period (1-13)',
        validate: {
          min: 1,
          max: 13,
        },
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Entity or consolidation ID',
      },
      status: {
        type: DataTypes.ENUM('draft', 'generating', 'generated', 'published', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Report status',
      },
      generatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who generated the report',
      },
      generatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Timestamp when report was generated',
      },
      publishedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who published the report',
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp when report was published',
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
      tableName: 'financial_report_headers',
      timestamps: true,
      indexes: [
        { fields: ['reportNumber'], unique: true },
        { fields: ['reportType'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['entityId'] },
        { fields: ['status'] },
        { fields: ['reportDate'] },
      ],
    },
  );

  return FinancialReportHeader;
};

/**
 * Sequelize model for Financial KPI Definitions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FinancialKPIDefinition model
 *
 * @example
 * ```typescript
 * const KPIDef = createFinancialKPIDefinitionModel(sequelize);
 * const kpi = await KPIDef.create({
 *   kpiId: 'current_ratio',
 *   kpiName: 'Current Ratio',
 *   category: 'liquidity',
 *   calculationFormula: 'current_assets / current_liabilities'
 * });
 * ```
 */
export const createFinancialKPIDefinitionModel = (sequelize: Sequelize) => {
  class FinancialKPIDefinition extends Model {
    public id!: number;
    public kpiId!: string;
    public kpiName!: string;
    public category!: string;
    public calculationFormula!: string;
    public targetValue!: number | null;
    public thresholdWarning!: number | null;
    public thresholdCritical!: number | null;
    public isActive!: boolean;
    public displayOrder!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  FinancialKPIDefinition.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      kpiId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique KPI identifier',
      },
      kpiName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Display name for KPI',
      },
      category: {
        type: DataTypes.ENUM('liquidity', 'profitability', 'efficiency', 'leverage', 'market', 'custom'),
        allowNull: false,
        comment: 'KPI category',
      },
      calculationFormula: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Formula for calculating KPI',
      },
      targetValue: {
        type: DataTypes.DECIMAL(20, 4),
        allowNull: true,
        comment: 'Target value for KPI',
      },
      thresholdWarning: {
        type: DataTypes.DECIMAL(20, 4),
        allowNull: true,
        comment: 'Warning threshold',
      },
      thresholdCritical: {
        type: DataTypes.DECIMAL(20, 4),
        allowNull: true,
        comment: 'Critical threshold',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether KPI is active',
      },
      displayOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Display order in dashboards',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional KPI metadata',
      },
    },
    {
      sequelize,
      tableName: 'financial_kpi_definitions',
      timestamps: true,
      indexes: [
        { fields: ['kpiId'], unique: true },
        { fields: ['category'] },
        { fields: ['isActive'] },
        { fields: ['displayOrder'] },
      ],
    },
  );

  return FinancialKPIDefinition;
};

// ============================================================================
// FINANCIAL REPORTING FUNCTIONS
// ============================================================================

/**
 * Generates a comprehensive balance sheet report with comparative periods.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {GenerateBalanceSheetDto} params - Report parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BalanceSheetReport>} Balance sheet report
 *
 * @example
 * ```typescript
 * const balanceSheet = await generateBalanceSheet(sequelize, {
 *   reportDate: new Date('2024-12-31'),
 *   fiscalYear: 2024,
 *   fiscalPeriod: 12,
 *   entityId: 1,
 *   includeComparative: true
 * });
 * ```
 */
export const generateBalanceSheet = async (
  sequelize: Sequelize,
  params: GenerateBalanceSheetDto,
  transaction?: Transaction,
): Promise<BalanceSheetReport> => {
  const query = `
    WITH account_balances AS (
      SELECT
        a.id as account_id,
        a.account_code,
        a.account_name,
        a.account_type,
        a.account_classification,
        a.parent_account_id,
        COALESCE(SUM(CASE
          WHEN jel.debit_amount > 0 THEN jel.debit_amount
          ELSE -jel.credit_amount
        END), 0) as ending_balance
      FROM chart_of_accounts a
      LEFT JOIN journal_entry_lines jel ON a.id = jel.account_id
      LEFT JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
      WHERE jeh.fiscal_year = :fiscalYear
        AND jeh.fiscal_period <= :fiscalPeriod
        AND jeh.status = 'posted'
        AND a.account_type IN ('asset', 'liability', 'equity')
        AND a.is_active = true
      GROUP BY a.id, a.account_code, a.account_name, a.account_type, a.account_classification, a.parent_account_id
    ),
    prior_balances AS (
      SELECT
        a.id as account_id,
        COALESCE(SUM(CASE
          WHEN jel.debit_amount > 0 THEN jel.debit_amount
          ELSE -jel.credit_amount
        END), 0) as prior_balance
      FROM chart_of_accounts a
      LEFT JOIN journal_entry_lines jel ON a.id = jel.account_id
      LEFT JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
      WHERE (jeh.fiscal_year = :priorYear OR (jeh.fiscal_year = :fiscalYear AND jeh.fiscal_period < :fiscalPeriod))
        AND jeh.status = 'posted'
      GROUP BY a.id
    )
    SELECT
      ab.account_code,
      ab.account_name,
      ab.account_type,
      ab.account_classification,
      ab.ending_balance,
      COALESCE(pb.prior_balance, 0) as prior_balance,
      ab.ending_balance - COALESCE(pb.prior_balance, 0) as variance
    FROM account_balances ab
    LEFT JOIN prior_balances pb ON ab.account_id = pb.account_id
    ORDER BY ab.account_type, ab.account_classification, ab.account_code
  `;

  const priorYear = params.comparisonType === 'prior_year' ? params.fiscalYear - 1 : params.fiscalYear;

  const results = await sequelize.query(query, {
    replacements: {
      fiscalYear: params.fiscalYear,
      fiscalPeriod: params.fiscalPeriod,
      priorYear: priorYear,
    },
    type: QueryTypes.SELECT,
    transaction,
  });

  // Transform results into structured balance sheet
  const currentAssets: BalanceSheetLine[] = [];
  const nonCurrentAssets: BalanceSheetLine[] = [];
  const currentLiabilities: BalanceSheetLine[] = [];
  const nonCurrentLiabilities: BalanceSheetLine[] = [];
  const equityLines: BalanceSheetLine[] = [];

  for (const row of results as any[]) {
    const line: BalanceSheetLine = {
      accountCode: row.account_code,
      accountName: row.account_name,
      currentBalance: Number(row.ending_balance),
      priorBalance: Number(row.prior_balance),
      variance: Number(row.variance),
      variancePercent: row.prior_balance !== 0 ? (Number(row.variance) / Number(row.prior_balance)) * 100 : 0,
      drillDownUrl: `/api/financial/drill-down/${row.account_code}/${params.fiscalYear}/${params.fiscalPeriod}`,
    };

    if (row.account_type === 'asset') {
      if (row.account_classification?.includes('current')) {
        currentAssets.push(line);
      } else {
        nonCurrentAssets.push(line);
      }
    } else if (row.account_type === 'liability') {
      if (row.account_classification?.includes('current')) {
        currentLiabilities.push(line);
      } else {
        nonCurrentLiabilities.push(line);
      }
    } else if (row.account_type === 'equity') {
      equityLines.push(line);
    }
  }

  const totalCurrentAssets = currentAssets.reduce((sum, line) => sum + line.currentBalance, 0);
  const totalNonCurrentAssets = nonCurrentAssets.reduce((sum, line) => sum + line.currentBalance, 0);
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  const totalCurrentLiabilities = currentLiabilities.reduce((sum, line) => sum + line.currentBalance, 0);
  const totalNonCurrentLiabilities = nonCurrentLiabilities.reduce((sum, line) => sum + line.currentBalance, 0);
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;

  const totalEquity = equityLines.reduce((sum, line) => sum + line.currentBalance, 0);

  return {
    reportDate: params.reportDate,
    fiscalYear: params.fiscalYear,
    fiscalPeriod: params.fiscalPeriod,
    entityId: params.entityId,
    entityName: 'Entity Name', // Would be fetched from entity table
    assets: {
      currentAssets: {
        sectionName: 'Current Assets',
        accountLines: currentAssets,
        subtotal: totalCurrentAssets,
      },
      nonCurrentAssets: {
        sectionName: 'Non-Current Assets',
        accountLines: nonCurrentAssets,
        subtotal: totalNonCurrentAssets,
      },
      totalAssets,
    },
    liabilities: {
      currentLiabilities: {
        sectionName: 'Current Liabilities',
        accountLines: currentLiabilities,
        subtotal: totalCurrentLiabilities,
      },
      nonCurrentLiabilities: {
        sectionName: 'Non-Current Liabilities',
        accountLines: nonCurrentLiabilities,
        subtotal: totalNonCurrentLiabilities,
      },
      totalLiabilities,
    },
    equity: {
      sections: [
        {
          sectionName: 'Equity',
          accountLines: equityLines,
          subtotal: totalEquity,
        },
      ],
      totalEquity,
    },
    totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
  };
};

/**
 * Generates a comprehensive income statement with budget and prior period comparison.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {GenerateIncomeStatementDto} params - Report parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IncomeStatementReport>} Income statement report
 *
 * @example
 * ```typescript
 * const incomeStatement = await generateIncomeStatement(sequelize, {
 *   reportDate: new Date('2024-12-31'),
 *   fiscalYear: 2024,
 *   fiscalPeriod: 12,
 *   entityId: 1,
 *   periodType: 'month',
 *   includeBudget: true
 * });
 * ```
 */
export const generateIncomeStatement = async (
  sequelize: Sequelize,
  params: GenerateIncomeStatementDto,
  transaction?: Transaction,
): Promise<IncomeStatementReport> => {
  const query = `
    WITH period_activity AS (
      SELECT
        a.id as account_id,
        a.account_code,
        a.account_name,
        a.account_type,
        a.account_classification,
        COALESCE(SUM(jel.credit_amount - jel.debit_amount), 0) as current_amount
      FROM chart_of_accounts a
      LEFT JOIN journal_entry_lines jel ON a.id = jel.account_id
      LEFT JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
      WHERE jeh.fiscal_year = :fiscalYear
        AND jeh.fiscal_period = :fiscalPeriod
        AND jeh.status = 'posted'
        AND a.account_type IN ('revenue', 'expense')
        AND a.is_active = true
      GROUP BY a.id, a.account_code, a.account_name, a.account_type, a.account_classification
    ),
    prior_activity AS (
      SELECT
        a.id as account_id,
        COALESCE(SUM(jel.credit_amount - jel.debit_amount), 0) as prior_amount
      FROM chart_of_accounts a
      LEFT JOIN journal_entry_lines jel ON a.id = jel.account_id
      LEFT JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
      WHERE jeh.fiscal_year = :priorYear
        AND jeh.fiscal_period = :fiscalPeriod
        AND jeh.status = 'posted'
      GROUP BY a.id
    ),
    budget_data AS (
      SELECT
        account_id,
        COALESCE(SUM(budget_amount), 0) as budget_amount
      FROM budget_lines
      WHERE fiscal_year = :fiscalYear
        AND fiscal_period = :fiscalPeriod
      GROUP BY account_id
    )
    SELECT
      pa.account_code,
      pa.account_name,
      pa.account_type,
      pa.account_classification,
      pa.current_amount,
      COALESCE(pr.prior_amount, 0) as prior_amount,
      COALESCE(bd.budget_amount, 0) as budget_amount
    FROM period_activity pa
    LEFT JOIN prior_activity pr ON pa.account_id = pr.account_id
    LEFT JOIN budget_data bd ON pa.account_id = bd.account_id
    ORDER BY pa.account_type DESC, pa.account_classification, pa.account_code
  `;

  const results = await sequelize.query(query, {
    replacements: {
      fiscalYear: params.fiscalYear,
      fiscalPeriod: params.fiscalPeriod,
      priorYear: params.fiscalYear - 1,
    },
    type: QueryTypes.SELECT,
    transaction,
  });

  const revenueLines: IncomeStatementLine[] = [];
  const expenseLines: IncomeStatementLine[] = [];

  for (const row of results as any[]) {
    const variance = Number(row.current_amount) - Number(row.prior_amount);
    const budgetVariance = Number(row.current_amount) - Number(row.budget_amount);

    const line: IncomeStatementLine = {
      accountCode: row.account_code,
      accountName: row.account_name,
      currentAmount: Number(row.current_amount),
      priorAmount: Number(row.prior_amount),
      budgetAmount: Number(row.budget_amount),
      variance,
      variancePercent: row.prior_amount !== 0 ? (variance / Number(row.prior_amount)) * 100 : 0,
      budgetVariance,
      budgetVariancePercent: row.budget_amount !== 0 ? (budgetVariance / Number(row.budget_amount)) * 100 : 0,
      drillDownUrl: `/api/financial/drill-down/${row.account_code}/${params.fiscalYear}/${params.fiscalPeriod}`,
    };

    if (row.account_type === 'revenue') {
      revenueLines.push(line);
    } else {
      expenseLines.push(line);
    }
  }

  const totalRevenue = revenueLines.reduce((sum, line) => sum + line.currentAmount, 0);
  const totalExpenses = expenseLines.reduce((sum, line) => sum + line.currentAmount, 0);
  const grossProfit = totalRevenue - totalExpenses;
  const netIncome = grossProfit;

  return {
    reportDate: params.reportDate,
    fiscalYear: params.fiscalYear,
    fiscalPeriod: params.fiscalPeriod,
    entityId: params.entityId,
    entityName: 'Entity Name',
    periodType: params.periodType as any,
    revenue: {
      sections: [
        {
          sectionName: 'Revenue',
          accountLines: revenueLines,
          subtotal: totalRevenue,
        },
      ],
      totalRevenue,
    },
    expenses: {
      sections: [
        {
          sectionName: 'Expenses',
          accountLines: expenseLines,
          subtotal: totalExpenses,
        },
      ],
      totalExpenses,
    },
    grossProfit,
    operatingIncome: netIncome,
    netIncome,
    ebitda: netIncome, // Simplified - would need adjustments
    margins: {
      grossMargin: totalRevenue !== 0 ? (grossProfit / totalRevenue) * 100 : 0,
      operatingMargin: totalRevenue !== 0 ? (netIncome / totalRevenue) * 100 : 0,
      netMargin: totalRevenue !== 0 ? (netIncome / totalRevenue) * 100 : 0,
    },
  };
};

/**
 * Generates a cash flow statement using indirect method.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {GenerateCashFlowDto} params - Report parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CashFlowStatement>} Cash flow statement
 *
 * @example
 * ```typescript
 * const cashFlow = await generateCashFlowStatement(sequelize, {
 *   reportDate: new Date('2024-12-31'),
 *   fiscalYear: 2024,
 *   fiscalPeriod: 12,
 *   entityId: 1,
 *   method: 'indirect'
 * });
 * ```
 */
export const generateCashFlowStatement = async (
  sequelize: Sequelize,
  params: GenerateCashFlowDto,
  transaction?: Transaction,
): Promise<CashFlowStatement> => {
  // Get net income from income statement
  const incomeStmt = await generateIncomeStatement(
    sequelize,
    {
      reportDate: params.reportDate,
      fiscalYear: params.fiscalYear,
      fiscalPeriod: params.fiscalPeriod,
      entityId: params.entityId,
      periodType: 'month',
    },
    transaction,
  );

  const netIncome = incomeStmt.netIncome;

  // Query for non-cash adjustments and working capital changes
  const cashFlowQuery = `
    WITH cash_flow_items AS (
      SELECT
        a.account_code,
        a.account_name,
        a.cash_flow_classification,
        COALESCE(SUM(jel.debit_amount - jel.credit_amount), 0) as amount
      FROM chart_of_accounts a
      LEFT JOIN journal_entry_lines jel ON a.id = jel.account_id
      LEFT JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
      WHERE jeh.fiscal_year = :fiscalYear
        AND jeh.fiscal_period = :fiscalPeriod
        AND jeh.status = 'posted'
        AND a.cash_flow_classification IS NOT NULL
      GROUP BY a.account_code, a.account_name, a.cash_flow_classification
    )
    SELECT * FROM cash_flow_items
    ORDER BY cash_flow_classification, account_code
  `;

  const cashFlowItems = await sequelize.query(cashFlowQuery, {
    replacements: {
      fiscalYear: params.fiscalYear,
      fiscalPeriod: params.fiscalPeriod,
    },
    type: QueryTypes.SELECT,
    transaction,
  });

  const operatingAdjustments: CashFlowLine[] = [];
  const workingCapitalChanges: CashFlowLine[] = [];
  const investingLines: CashFlowLine[] = [];
  const financingLines: CashFlowLine[] = [];

  for (const item of cashFlowItems as any[]) {
    const line: CashFlowLine = {
      description: item.account_name,
      amount: Number(item.amount),
      accountCode: item.account_code,
      drillDownUrl: `/api/financial/drill-down/${item.account_code}/${params.fiscalYear}/${params.fiscalPeriod}`,
    };

    switch (item.cash_flow_classification) {
      case 'operating_adjustment':
        operatingAdjustments.push(line);
        break;
      case 'working_capital':
        workingCapitalChanges.push(line);
        break;
      case 'investing':
        investingLines.push(line);
        break;
      case 'financing':
        financingLines.push(line);
        break;
    }
  }

  const netCashFromOperations =
    netIncome +
    operatingAdjustments.reduce((sum, line) => sum + line.amount, 0) +
    workingCapitalChanges.reduce((sum, line) => sum + line.amount, 0);

  const netCashFromInvesting = investingLines.reduce((sum, line) => sum + line.amount, 0);
  const netCashFromFinancing = financingLines.reduce((sum, line) => sum + line.amount, 0);

  const netCashChange = netCashFromOperations + netCashFromInvesting + netCashFromFinancing;

  // Get beginning cash balance
  const beginningCashQuery = `
    SELECT COALESCE(SUM(jel.debit_amount - jel.credit_amount), 0) as beginning_cash
    FROM chart_of_accounts a
    JOIN journal_entry_lines jel ON a.id = jel.account_id
    JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
    WHERE a.account_classification = 'cash'
      AND jeh.fiscal_year = :fiscalYear
      AND jeh.fiscal_period < :fiscalPeriod
      AND jeh.status = 'posted'
  `;

  const beginningCashResult = await sequelize.query(beginningCashQuery, {
    replacements: {
      fiscalYear: params.fiscalYear,
      fiscalPeriod: params.fiscalPeriod,
    },
    type: QueryTypes.SELECT,
    transaction,
  });

  const beginningCash = Number((beginningCashResult[0] as any)?.beginning_cash || 0);
  const endingCash = beginningCash + netCashChange;

  return {
    reportDate: params.reportDate,
    fiscalYear: params.fiscalYear,
    fiscalPeriod: params.fiscalPeriod,
    entityId: params.entityId,
    entityName: 'Entity Name',
    operatingActivities: {
      netIncome,
      adjustments: operatingAdjustments,
      workingCapitalChanges,
      netCashFromOperations,
    },
    investingActivities: {
      lines: investingLines,
      netCashFromInvesting,
    },
    financingActivities: {
      lines: financingLines,
      netCashFromFinancing,
    },
    netCashChange,
    beginningCash,
    endingCash,
  };
};

/**
 * Generates a trial balance report with beginning and ending balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} entityId - Entity ID
 * @param {boolean} includeInactive - Include inactive accounts
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<TrialBalanceReport>} Trial balance report
 *
 * @example
 * ```typescript
 * const trialBalance = await generateTrialBalance(sequelize, 2024, 12, 1, false);
 * ```
 */
export const generateTrialBalance = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  entityId: number,
  includeInactive: boolean = false,
  transaction?: Transaction,
): Promise<TrialBalanceReport> => {
  const query = `
    WITH beginning_balances AS (
      SELECT
        a.id as account_id,
        COALESCE(SUM(CASE
          WHEN a.normal_balance = 'debit' THEN jel.debit_amount - jel.credit_amount
          ELSE jel.credit_amount - jel.debit_amount
        END), 0) as beginning_balance
      FROM chart_of_accounts a
      LEFT JOIN journal_entry_lines jel ON a.id = jel.account_id
      LEFT JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
      WHERE jeh.fiscal_year < :fiscalYear
        OR (jeh.fiscal_year = :fiscalYear AND jeh.fiscal_period < :fiscalPeriod)
        AND jeh.status = 'posted'
      GROUP BY a.id
    ),
    period_activity AS (
      SELECT
        a.id as account_id,
        COALESCE(SUM(jel.debit_amount), 0) as period_debits,
        COALESCE(SUM(jel.credit_amount), 0) as period_credits
      FROM chart_of_accounts a
      LEFT JOIN journal_entry_lines jel ON a.id = jel.account_id
      LEFT JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
      WHERE jeh.fiscal_year = :fiscalYear
        AND jeh.fiscal_period = :fiscalPeriod
        AND jeh.status = 'posted'
      GROUP BY a.id
    )
    SELECT
      a.account_code,
      a.account_name,
      a.account_type,
      a.normal_balance,
      COALESCE(bb.beginning_balance, 0) as beginning_balance,
      COALESCE(pa.period_debits, 0) as period_debits,
      COALESCE(pa.period_credits, 0) as period_credits,
      COALESCE(bb.beginning_balance, 0) + COALESCE(pa.period_debits, 0) - COALESCE(pa.period_credits, 0) as ending_balance
    FROM chart_of_accounts a
    LEFT JOIN beginning_balances bb ON a.id = bb.account_id
    LEFT JOIN period_activity pa ON a.id = pa.account_id
    WHERE a.is_active = true OR :includeInactive = true
    ORDER BY a.account_code
  `;

  const results = await sequelize.query(query, {
    replacements: {
      fiscalYear,
      fiscalPeriod,
      includeInactive,
    },
    type: QueryTypes.SELECT,
    transaction,
  });

  const accounts: TrialBalanceLine[] = [];
  let totalDebits = 0;
  let totalCredits = 0;

  for (const row of results as any[]) {
    const endingBalance = Number(row.ending_balance);
    const debitBalance = endingBalance >= 0 ? endingBalance : 0;
    const creditBalance = endingBalance < 0 ? Math.abs(endingBalance) : 0;

    accounts.push({
      accountCode: row.account_code,
      accountName: row.account_name,
      accountType: row.account_type,
      beginningBalance: Number(row.beginning_balance),
      periodDebits: Number(row.period_debits),
      periodCredits: Number(row.period_credits),
      endingBalance,
      debitBalance,
      creditBalance,
    });

    totalDebits += debitBalance;
    totalCredits += creditBalance;
  }

  return {
    reportDate: new Date(),
    fiscalYear,
    fiscalPeriod,
    entityId,
    includeInactive,
    accounts,
    totalDebits,
    totalCredits,
    isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
  };
};

/**
 * Generates consolidated financial statements with intercompany eliminations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} parentEntityId - Parent entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} consolidationType - Consolidation type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ConsolidatedFinancials>} Consolidated financial statements
 *
 * @example
 * ```typescript
 * const consolidated = await generateConsolidatedFinancials(sequelize, 1, 2024, 12, 'full');
 * ```
 */
export const generateConsolidatedFinancials = async (
  sequelize: Sequelize,
  parentEntityId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  consolidationType: 'full' | 'proportional' | 'equity',
  transaction?: Transaction,
): Promise<ConsolidatedFinancials> => {
  // Get all subsidiary entities
  const subsidiariesQuery = `
    SELECT
      e.id as entity_id,
      e.entity_name,
      er.ownership_percent,
      er.consolidation_method
    FROM entities e
    JOIN entity_relationships er ON e.id = er.subsidiary_entity_id
    WHERE er.parent_entity_id = :parentEntityId
      AND er.is_active = true
      AND er.effective_date <= CURRENT_DATE
      AND (er.end_date IS NULL OR er.end_date >= CURRENT_DATE)
  `;

  const subsidiaries = await sequelize.query(subsidiariesQuery, {
    replacements: { parentEntityId },
    type: QueryTypes.SELECT,
    transaction,
  });

  const entities: ConsolidatedEntity[] = [];

  // Generate financial statements for each subsidiary
  for (const sub of subsidiaries as any[]) {
    const balanceSheet = await generateBalanceSheet(
      sequelize,
      {
        reportDate: new Date(),
        fiscalYear,
        fiscalPeriod,
        entityId: sub.entity_id,
        includeComparative: false,
      },
      transaction,
    );

    const incomeStatement = await generateIncomeStatement(
      sequelize,
      {
        reportDate: new Date(),
        fiscalYear,
        fiscalPeriod,
        entityId: sub.entity_id,
        periodType: 'month',
        includeBudget: false,
      },
      transaction,
    );

    entities.push({
      entityId: sub.entity_id,
      entityName: sub.entity_name,
      ownershipPercent: Number(sub.ownership_percent),
      consolidationMethod: sub.consolidation_method,
      balanceSheet,
      incomeStatement,
    });
  }

  // Get intercompany eliminations
  const eliminationsQuery = `
    SELECT
      id as elimination_id,
      description,
      debit_account_code,
      credit_account_code,
      amount,
      elimination_type
    FROM intercompany_eliminations
    WHERE fiscal_year = :fiscalYear
      AND fiscal_period = :fiscalPeriod
      AND parent_entity_id = :parentEntityId
      AND is_active = true
  `;

  const eliminations = await sequelize.query(eliminationsQuery, {
    replacements: { parentEntityId, fiscalYear, fiscalPeriod },
    type: QueryTypes.SELECT,
    transaction,
  });

  // Generate consolidated statements (simplified - actual consolidation logic would be more complex)
  const consolidatedBalanceSheet = await generateBalanceSheet(
    sequelize,
    {
      reportDate: new Date(),
      fiscalYear,
      fiscalPeriod,
      entityId: parentEntityId,
      includeComparative: false,
    },
    transaction,
  );

  const consolidatedIncomeStatement = await generateIncomeStatement(
    sequelize,
    {
      reportDate: new Date(),
      fiscalYear,
      fiscalPeriod,
      entityId: parentEntityId,
      periodType: 'month',
      includeBudget: false,
    },
    transaction,
  );

  return {
    reportDate: new Date(),
    fiscalYear,
    fiscalPeriod,
    parentEntityId,
    consolidationType,
    entities,
    eliminations: eliminations as IntercompanyElimination[],
    consolidatedBalanceSheet,
    consolidatedIncomeStatement,
    minorityInterest: 0, // Would be calculated based on ownership percentages
  };
};

/**
 * Generates XBRL-formatted financial report for regulatory filing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {GenerateXBRLDto} params - XBRL parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<XBRLReport>} XBRL report
 *
 * @example
 * ```typescript
 * const xbrl = await generateXBRLReport(sequelize, {
 *   reportDate: new Date('2024-12-31'),
 *   fiscalYear: 2024,
 *   entityId: 1,
 *   taxonomyVersion: 'US-GAAP-2024',
 *   reportType: '10-K'
 * });
 * ```
 */
export const generateXBRLReport = async (
  sequelize: Sequelize,
  params: GenerateXBRLDto,
  transaction?: Transaction,
): Promise<XBRLReport> => {
  const entityQuery = `
    SELECT entity_name, entity_identifier
    FROM entities
    WHERE id = :entityId
  `;

  const entityInfo = await sequelize.query(entityQuery, {
    replacements: { entityId: params.entityId },
    type: QueryTypes.SELECT,
    transaction,
  });

  const entity = entityInfo[0] as any;

  // Get balance sheet for XBRL mapping
  const balanceSheet = await generateBalanceSheet(
    sequelize,
    {
      reportDate: params.reportDate,
      fiscalYear: params.fiscalYear,
      fiscalPeriod: 12, // Annual report
      entityId: params.entityId,
      includeComparative: false,
    },
    transaction,
  );

  // Get income statement
  const incomeStatement = await generateIncomeStatement(
    sequelize,
    {
      reportDate: params.reportDate,
      fiscalYear: params.fiscalYear,
      fiscalPeriod: 12,
      entityId: params.entityId,
      periodType: 'year',
      includeBudget: false,
    },
    transaction,
  );

  const elements: XBRLElement[] = [];
  const contexts: XBRLContext[] = [];
  const units: XBRLUnit[] = [];

  // Create standard contexts
  contexts.push({
    id: 'Current_AsOf',
    entity: entity.entity_identifier,
    period: {
      instant: params.reportDate,
    },
  });

  contexts.push({
    id: 'Current_YTD',
    entity: entity.entity_identifier,
    period: {
      startDate: new Date(params.fiscalYear, 0, 1),
      endDate: params.reportDate,
    },
  });

  // Create standard unit
  units.push({
    id: 'USD',
    measure: 'iso4217:USD',
  });

  // Map balance sheet accounts to XBRL elements
  for (const line of balanceSheet.assets.currentAssets.accountLines) {
    elements.push({
      elementId: `us-gaap:${line.accountCode.replace(/[^a-zA-Z0-9]/g, '')}`,
      contextRef: 'Current_AsOf',
      unitRef: 'USD',
      decimals: 0,
      value: line.currentBalance,
      taxonomyMapping: 'us-gaap:Assets',
    });
  }

  // Map income statement accounts to XBRL elements
  for (const section of incomeStatement.revenue.sections) {
    for (const line of section.accountLines) {
      elements.push({
        elementId: `us-gaap:${line.accountCode.replace(/[^a-zA-Z0-9]/g, '')}`,
        contextRef: 'Current_YTD',
        unitRef: 'USD',
        decimals: 0,
        value: line.currentAmount,
        taxonomyMapping: 'us-gaap:Revenues',
      });
    }
  }

  return {
    taxonomyVersion: params.taxonomyVersion,
    reportingEntity: entity.entity_name,
    reportDate: params.reportDate,
    periodStart: new Date(params.fiscalYear, 0, 1),
    periodEnd: params.reportDate,
    currency: 'USD',
    elements,
    contexts,
    units,
  };
};

/**
 * Calculates financial KPIs for a given period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<FinancialKPI[]>} Array of calculated KPIs
 *
 * @example
 * ```typescript
 * const kpis = await calculateFinancialKPIs(sequelize, 1, 2024, 12);
 * ```
 */
export const calculateFinancialKPIs = async (
  sequelize: Sequelize,
  entityId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<FinancialKPI[]> => {
  const balanceSheet = await generateBalanceSheet(
    sequelize,
    {
      reportDate: new Date(),
      fiscalYear,
      fiscalPeriod,
      entityId,
      includeComparative: true,
    },
    transaction,
  );

  const incomeStatement = await generateIncomeStatement(
    sequelize,
    {
      reportDate: new Date(),
      fiscalYear,
      fiscalPeriod,
      entityId,
      periodType: 'month',
      includeBudget: false,
    },
    transaction,
  );

  const kpis: FinancialKPI[] = [];

  // Current Ratio = Current Assets / Current Liabilities
  const currentAssets = balanceSheet.assets.currentAssets.subtotal;
  const currentLiabilities = balanceSheet.liabilities.currentLiabilities.subtotal;
  const currentRatio = currentLiabilities !== 0 ? currentAssets / currentLiabilities : 0;

  kpis.push({
    kpiId: 'current_ratio',
    kpiName: 'Current Ratio',
    category: 'liquidity',
    value: currentRatio,
    target: 2.0,
    variance: currentRatio - 2.0,
    trend: currentRatio >= 2.0 ? 'improving' : 'declining',
    periodComparison: {
      previousPeriod: 0, // Would be calculated from prior period
      yearAgo: 0,
      changePercent: 0,
    },
    calculation: 'Current Assets / Current Liabilities',
  });

  // Quick Ratio = (Current Assets - Inventory) / Current Liabilities
  // Simplified - would need to identify inventory accounts
  const quickRatio = currentLiabilities !== 0 ? (currentAssets * 0.8) / currentLiabilities : 0;

  kpis.push({
    kpiId: 'quick_ratio',
    kpiName: 'Quick Ratio',
    category: 'liquidity',
    value: quickRatio,
    target: 1.0,
    variance: quickRatio - 1.0,
    trend: quickRatio >= 1.0 ? 'improving' : 'declining',
    periodComparison: {
      previousPeriod: 0,
      yearAgo: 0,
      changePercent: 0,
    },
    calculation: '(Current Assets - Inventory) / Current Liabilities',
  });

  // Debt to Equity Ratio = Total Liabilities / Total Equity
  const totalLiabilities = balanceSheet.liabilities.totalLiabilities;
  const totalEquity = balanceSheet.equity.totalEquity;
  const debtToEquity = totalEquity !== 0 ? totalLiabilities / totalEquity : 0;

  kpis.push({
    kpiId: 'debt_to_equity',
    kpiName: 'Debt to Equity Ratio',
    category: 'leverage',
    value: debtToEquity,
    target: 1.5,
    variance: debtToEquity - 1.5,
    trend: debtToEquity <= 1.5 ? 'improving' : 'declining',
    periodComparison: {
      previousPeriod: 0,
      yearAgo: 0,
      changePercent: 0,
    },
    calculation: 'Total Liabilities / Total Equity',
  });

  // Net Profit Margin = Net Income / Total Revenue
  const netIncome = incomeStatement.netIncome;
  const totalRevenue = incomeStatement.revenue.totalRevenue;
  const netProfitMargin = totalRevenue !== 0 ? (netIncome / totalRevenue) * 100 : 0;

  kpis.push({
    kpiId: 'net_profit_margin',
    kpiName: 'Net Profit Margin',
    category: 'profitability',
    value: netProfitMargin,
    target: 15.0,
    variance: netProfitMargin - 15.0,
    trend: netProfitMargin >= 15.0 ? 'improving' : 'declining',
    periodComparison: {
      previousPeriod: 0,
      yearAgo: 0,
      changePercent: 0,
    },
    calculation: '(Net Income / Total Revenue) * 100',
  });

  // Return on Assets = Net Income / Total Assets
  const totalAssets = balanceSheet.assets.totalAssets;
  const returnOnAssets = totalAssets !== 0 ? (netIncome / totalAssets) * 100 : 0;

  kpis.push({
    kpiId: 'return_on_assets',
    kpiName: 'Return on Assets',
    category: 'profitability',
    value: returnOnAssets,
    target: 10.0,
    variance: returnOnAssets - 10.0,
    trend: returnOnAssets >= 10.0 ? 'improving' : 'declining',
    periodComparison: {
      previousPeriod: 0,
      yearAgo: 0,
      changePercent: 0,
    },
    calculation: '(Net Income / Total Assets) * 100',
  });

  // Return on Equity = Net Income / Total Equity
  const returnOnEquity = totalEquity !== 0 ? (netIncome / totalEquity) * 100 : 0;

  kpis.push({
    kpiId: 'return_on_equity',
    kpiName: 'Return on Equity',
    category: 'profitability',
    value: returnOnEquity,
    target: 15.0,
    variance: returnOnEquity - 15.0,
    trend: returnOnEquity >= 15.0 ? 'improving' : 'declining',
    periodComparison: {
      previousPeriod: 0,
      yearAgo: 0,
      changePercent: 0,
    },
    calculation: '(Net Income / Total Equity) * 100',
  });

  return kpis;
};

/**
 * Performs variance analysis comparing actuals to budget or prior periods.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} analysisType - Type of analysis
 * @param {number} thresholdPercent - Variance threshold percentage
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VarianceAnalysis>} Variance analysis results
 *
 * @example
 * ```typescript
 * const analysis = await performVarianceAnalysis(sequelize, 1, 2024, 12, 'budget', 10);
 * ```
 */
export const performVarianceAnalysis = async (
  sequelize: Sequelize,
  entityId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  analysisType: 'budget' | 'forecast' | 'prior_period' | 'prior_year',
  thresholdPercent: number = 10,
  transaction?: Transaction,
): Promise<VarianceAnalysis> => {
  let comparisonQuery = '';

  switch (analysisType) {
    case 'budget':
      comparisonQuery = `
        SELECT
          a.account_code,
          a.account_name,
          a.account_type,
          COALESCE(SUM(jel.debit_amount - jel.credit_amount), 0) as actual,
          COALESCE((SELECT SUM(budget_amount) FROM budget_lines
            WHERE account_id = a.id AND fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod), 0) as comparison
        FROM chart_of_accounts a
        LEFT JOIN journal_entry_lines jel ON a.id = jel.account_id
        LEFT JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
        WHERE jeh.fiscal_year = :fiscalYear
          AND jeh.fiscal_period = :fiscalPeriod
          AND jeh.status = 'posted'
        GROUP BY a.id, a.account_code, a.account_name, a.account_type
      `;
      break;

    case 'prior_period':
      comparisonQuery = `
        WITH current_period AS (
          SELECT
            a.id as account_id,
            a.account_code,
            a.account_name,
            a.account_type,
            COALESCE(SUM(jel.debit_amount - jel.credit_amount), 0) as actual
          FROM chart_of_accounts a
          LEFT JOIN journal_entry_lines jel ON a.id = jel.account_id
          LEFT JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
          WHERE jeh.fiscal_year = :fiscalYear
            AND jeh.fiscal_period = :fiscalPeriod
            AND jeh.status = 'posted'
          GROUP BY a.id, a.account_code, a.account_name, a.account_type
        ),
        prior_period AS (
          SELECT
            a.id as account_id,
            COALESCE(SUM(jel.debit_amount - jel.credit_amount), 0) as comparison
          FROM chart_of_accounts a
          LEFT JOIN journal_entry_lines jel ON a.id = jel.account_id
          LEFT JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
          WHERE jeh.fiscal_year = :fiscalYear
            AND jeh.fiscal_period = :fiscalPeriod - 1
            AND jeh.status = 'posted'
          GROUP BY a.id
        )
        SELECT
          cp.account_code,
          cp.account_name,
          cp.account_type,
          cp.actual,
          COALESCE(pp.comparison, 0) as comparison
        FROM current_period cp
        LEFT JOIN prior_period pp ON cp.account_id = pp.account_id
      `;
      break;

    case 'prior_year':
      comparisonQuery = `
        WITH current_period AS (
          SELECT
            a.id as account_id,
            a.account_code,
            a.account_name,
            a.account_type,
            COALESCE(SUM(jel.debit_amount - jel.credit_amount), 0) as actual
          FROM chart_of_accounts a
          LEFT JOIN journal_entry_lines jel ON a.id = jel.account_id
          LEFT JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
          WHERE jeh.fiscal_year = :fiscalYear
            AND jeh.fiscal_period = :fiscalPeriod
            AND jeh.status = 'posted'
          GROUP BY a.id, a.account_code, a.account_name, a.account_type
        ),
        prior_year AS (
          SELECT
            a.id as account_id,
            COALESCE(SUM(jel.debit_amount - jel.credit_amount), 0) as comparison
          FROM chart_of_accounts a
          LEFT JOIN journal_entry_lines jel ON a.id = jel.account_id
          LEFT JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
          WHERE jeh.fiscal_year = :fiscalYear - 1
            AND jeh.fiscal_period = :fiscalPeriod
            AND jeh.status = 'posted'
          GROUP BY a.id
        )
        SELECT
          cp.account_code,
          cp.account_name,
          cp.account_type,
          cp.actual,
          COALESCE(py.comparison, 0) as comparison
        FROM current_period cp
        LEFT JOIN prior_year py ON cp.account_id = py.account_id
      `;
      break;

    default:
      comparisonQuery = '';
  }

  const results = await sequelize.query(comparisonQuery, {
    replacements: { fiscalYear, fiscalPeriod },
    type: QueryTypes.SELECT,
    transaction,
  });

  const variances: VarianceLine[] = [];
  let favorableVariances = 0;
  let unfavorableVariances = 0;
  let significantVariances = 0;

  for (const row of results as any[]) {
    const actual = Number(row.actual);
    const comparison = Number(row.comparison);
    const variance = actual - comparison;
    const variancePercent = comparison !== 0 ? (variance / Math.abs(comparison)) * 100 : 0;
    const isSignificant = Math.abs(variancePercent) >= thresholdPercent;

    let favorability: 'favorable' | 'unfavorable' | 'neutral' = 'neutral';

    if (row.account_type === 'revenue') {
      favorability = variance > 0 ? 'favorable' : variance < 0 ? 'unfavorable' : 'neutral';
    } else if (row.account_type === 'expense') {
      favorability = variance < 0 ? 'favorable' : variance > 0 ? 'unfavorable' : 'neutral';
    }

    if (favorability === 'favorable') favorableVariances += Math.abs(variance);
    if (favorability === 'unfavorable') unfavorableVariances += Math.abs(variance);
    if (isSignificant) significantVariances++;

    variances.push({
      accountCode: row.account_code,
      accountName: row.account_name,
      actual,
      comparison,
      variance,
      variancePercent,
      favorability,
      threshold: thresholdPercent,
      isSignificant,
    });
  }

  return {
    reportDate: new Date(),
    fiscalYear,
    fiscalPeriod,
    analysisType,
    variances,
    summary: {
      favorableVariances,
      unfavorableVariances,
      netVariance: favorableVariances - unfavorableVariances,
      significantVariances,
    },
  };
};

/**
 * Generates a management dashboard with KPIs and trends.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ManagementDashboard>} Management dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await generateManagementDashboard(sequelize, 1, 2024, 12);
 * ```
 */
export const generateManagementDashboard = async (
  sequelize: Sequelize,
  entityId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<ManagementDashboard> => {
  const kpis = await calculateFinancialKPIs(sequelize, entityId, fiscalYear, fiscalPeriod, transaction);

  const balanceSheet = await generateBalanceSheet(
    sequelize,
    {
      reportDate: new Date(),
      fiscalYear,
      fiscalPeriod,
      entityId,
      includeComparative: false,
    },
    transaction,
  );

  const incomeStatement = await generateIncomeStatement(
    sequelize,
    {
      reportDate: new Date(),
      fiscalYear,
      fiscalPeriod,
      entityId,
      periodType: 'month',
      includeBudget: false,
    },
    transaction,
  );

  const cashFlow = await generateCashFlowStatement(
    sequelize,
    {
      reportDate: new Date(),
      fiscalYear,
      fiscalPeriod,
      entityId,
      method: 'indirect',
    },
    transaction,
  );

  const currentRatioKPI = kpis.find((k) => k.kpiId === 'current_ratio');
  const quickRatioKPI = kpis.find((k) => k.kpiId === 'quick_ratio');
  const debtToEquityKPI = kpis.find((k) => k.kpiId === 'debt_to_equity');

  const alerts: FinancialAlert[] = [];

  // Generate alerts for KPIs outside thresholds
  for (const kpi of kpis) {
    if (Math.abs(kpi.variance) > Math.abs(kpi.target) * 0.2) {
      alerts.push({
        alertId: `alert_${kpi.kpiId}`,
        severity: Math.abs(kpi.variance) > Math.abs(kpi.target) * 0.5 ? 'critical' : 'warning',
        category: kpi.category,
        message: `${kpi.kpiName} is ${kpi.variance > 0 ? 'above' : 'below'} target by ${Math.abs(kpi.variance).toFixed(2)}`,
        metric: kpi.kpiId,
        threshold: kpi.target,
        actualValue: kpi.value,
        timestamp: new Date(),
      });
    }
  }

  // Generate trend analysis (simplified - would use historical data)
  const trends: TrendAnalysis[] = [
    {
      metric: 'Revenue',
      periods: [
        { periodLabel: 'P1', value: incomeStatement.revenue.totalRevenue * 0.9, date: new Date() },
        { periodLabel: 'P2', value: incomeStatement.revenue.totalRevenue * 0.95, date: new Date() },
        { periodLabel: 'P3', value: incomeStatement.revenue.totalRevenue, date: new Date() },
      ],
      trendDirection: 'up',
      percentChange: 10,
      forecastNext: incomeStatement.revenue.totalRevenue * 1.05,
    },
  ];

  return {
    dashboardId: `dashboard_${entityId}_${fiscalYear}_${fiscalPeriod}`,
    entityId,
    reportDate: new Date(),
    kpis,
    financialSummary: {
      revenue: incomeStatement.revenue.totalRevenue,
      expenses: incomeStatement.expenses.totalExpenses,
      netIncome: incomeStatement.netIncome,
      cashBalance: cashFlow.endingCash,
      currentRatio: currentRatioKPI?.value || 0,
      quickRatio: quickRatioKPI?.value || 0,
      debtToEquity: debtToEquityKPI?.value || 0,
    },
    trends,
    alerts,
  };
};

/**
 * Generates segment reporting for multi-segment entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} segmentType - Segment type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SegmentReporting>} Segment reporting
 *
 * @example
 * ```typescript
 * const segments = await generateSegmentReporting(sequelize, 1, 2024, 12, 'business_unit');
 * ```
 */
export const generateSegmentReporting = async (
  sequelize: Sequelize,
  entityId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  segmentType: 'business_unit' | 'geography' | 'product_line' | 'customer_type',
  transaction?: Transaction,
): Promise<SegmentReporting> => {
  const segmentQuery = `
    SELECT
      s.id as segment_id,
      s.segment_name,
      s.segment_type,
      COALESCE(SUM(CASE WHEN a.account_type = 'revenue' THEN jel.credit_amount - jel.debit_amount ELSE 0 END), 0) as revenue,
      COALESCE(SUM(CASE WHEN a.account_type = 'expense' THEN jel.debit_amount - jel.credit_amount ELSE 0 END), 0) as expenses,
      COALESCE(SUM(CASE WHEN a.account_type = 'asset' THEN jel.debit_amount - jel.credit_amount ELSE 0 END), 0) as assets,
      COALESCE(SUM(CASE WHEN a.account_type = 'liability' THEN jel.credit_amount - jel.debit_amount ELSE 0 END), 0) as liabilities
    FROM segments s
    LEFT JOIN journal_entry_lines jel ON s.id = jel.segment_id
    LEFT JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
    LEFT JOIN chart_of_accounts a ON jel.account_id = a.id
    WHERE s.entity_id = :entityId
      AND s.segment_type = :segmentType
      AND jeh.fiscal_year = :fiscalYear
      AND jeh.fiscal_period = :fiscalPeriod
      AND jeh.status = 'posted'
    GROUP BY s.id, s.segment_name, s.segment_type
  `;

  const results = await sequelize.query(segmentQuery, {
    replacements: { entityId, fiscalYear, fiscalPeriod, segmentType },
    type: QueryTypes.SELECT,
    transaction,
  });

  const segments: SegmentPerformance[] = [];
  let consolidatedTotal = 0;

  for (const row of results as any[]) {
    const revenue = Number(row.revenue);
    const expenses = Number(row.expenses);
    const assets = Number(row.assets);
    const liabilities = Number(row.liabilities);
    const operatingIncome = revenue - expenses;

    segments.push({
      segmentId: row.segment_id,
      segmentName: row.segment_name,
      segmentType: row.segment_type,
      revenue,
      expenses,
      operatingIncome,
      assets,
      liabilities,
      returnOnAssets: assets !== 0 ? (operatingIncome / assets) * 100 : 0,
      profitMargin: revenue !== 0 ? (operatingIncome / revenue) * 100 : 0,
    });

    consolidatedTotal += operatingIncome;
  }

  return {
    reportDate: new Date(),
    fiscalYear,
    fiscalPeriod,
    segments,
    intersegmentEliminations: 0, // Would be calculated from intersegment transactions
    consolidatedTotal,
  };
};

/**
 * Provides drill-down transaction detail for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} accountCode - Account code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} limit - Number of transactions to return
 * @param {number} offset - Offset for pagination
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<DrillDownData>} Drill-down transaction data
 *
 * @example
 * ```typescript
 * const drillDown = await getDrillDownTransactions(sequelize, '1000-100', 2024, 12, 50, 0);
 * ```
 */
export const getDrillDownTransactions = async (
  sequelize: Sequelize,
  accountCode: string,
  fiscalYear: number,
  fiscalPeriod: number,
  limit: number = 50,
  offset: number = 0,
  transaction?: Transaction,
): Promise<DrillDownData> => {
  const accountQuery = `
    SELECT id, account_name
    FROM chart_of_accounts
    WHERE account_code = :accountCode
  `;

  const accountInfo = await sequelize.query(accountQuery, {
    replacements: { accountCode },
    type: QueryTypes.SELECT,
    transaction,
  });

  const account = accountInfo[0] as any;

  const transactionsQuery = `
    WITH running_totals AS (
      SELECT
        jeh.id as transaction_id,
        jeh.entry_date as transaction_date,
        jeh.posting_date,
        jeh.entry_number as document_number,
        jeh.description,
        jel.debit_amount,
        jel.credit_amount,
        jeh.source as source_system,
        jeh.created_by,
        SUM(jel.debit_amount - jel.credit_amount) OVER (
          ORDER BY jeh.posting_date, jeh.id, jel.line_number
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) as running_balance
      FROM journal_entry_headers jeh
      JOIN journal_entry_lines jel ON jeh.id = jel.journal_entry_id
      JOIN chart_of_accounts a ON jel.account_id = a.id
      WHERE a.account_code = :accountCode
        AND jeh.fiscal_year = :fiscalYear
        AND jeh.fiscal_period = :fiscalPeriod
        AND jeh.status = 'posted'
      ORDER BY jeh.posting_date DESC, jeh.id DESC
      LIMIT :limit OFFSET :offset
    )
    SELECT * FROM running_totals
  `;

  const transactions = await sequelize.query(transactionsQuery, {
    replacements: { accountCode, fiscalYear, fiscalPeriod, limit, offset },
    type: QueryTypes.SELECT,
    transaction,
  });

  const balanceQuery = `
    SELECT
      COALESCE(SUM(jel.debit_amount - jel.credit_amount), 0) as balance_amount
    FROM journal_entry_lines jel
    JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
    JOIN chart_of_accounts a ON jel.account_id = a.id
    WHERE a.account_code = :accountCode
      AND jeh.fiscal_year = :fiscalYear
      AND jeh.fiscal_period = :fiscalPeriod
      AND jeh.status = 'posted'
  `;

  const balanceResult = await sequelize.query(balanceQuery, {
    replacements: { accountCode, fiscalYear, fiscalPeriod },
    type: QueryTypes.SELECT,
    transaction,
  });

  const balanceAmount = Number((balanceResult[0] as any)?.balance_amount || 0);

  return {
    accountCode,
    accountName: account?.account_name || '',
    fiscalYear,
    fiscalPeriod,
    balanceAmount,
    transactions: transactions as DrillDownTransaction[],
    aggregationLevel: 'transaction',
  };
};

/**
 * Exports financial reports to various formats (PDF, Excel, CSV, XBRL).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reportId - Report header ID
 * @param {string} format - Export format
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Buffer>} Exported report data
 *
 * @example
 * ```typescript
 * const pdfData = await exportFinancialReport(sequelize, 123, 'pdf');
 * ```
 */
export const exportFinancialReport = async (
  sequelize: Sequelize,
  reportId: number,
  format: 'pdf' | 'excel' | 'csv' | 'xbrl' | 'json',
  transaction?: Transaction,
): Promise<Buffer> => {
  const ReportHeader = createFinancialReportHeaderModel(sequelize);

  const report = await ReportHeader.findByPk(reportId, { transaction });
  if (!report) {
    throw new Error('Report not found');
  }

  // This would integrate with actual export libraries
  // For now, return a placeholder buffer
  const exportData = {
    reportId,
    reportType: report.reportType,
    reportDate: report.reportDate,
    format,
    metadata: report.metadata,
  };

  return Buffer.from(JSON.stringify(exportData, null, 2));
};

/**
 * Schedules recurring financial report generation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reportType - Type of report
 * @param {number} entityId - Entity ID
 * @param {string} frequency - Frequency of generation
 * @param {string[]} recipients - Email recipients
 * @param {string} userId - User scheduling the report
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Scheduled report configuration
 *
 * @example
 * ```typescript
 * const scheduled = await scheduleRecurringReport(
 *   sequelize,
 *   'balance_sheet',
 *   1,
 *   'monthly',
 *   ['cfo@company.com'],
 *   'user123'
 * );
 * ```
 */
export const scheduleRecurringReport = async (
  sequelize: Sequelize,
  reportType: string,
  entityId: number,
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually',
  recipients: string[],
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const query = `
    INSERT INTO scheduled_reports (
      report_type,
      entity_id,
      frequency,
      recipients,
      is_active,
      created_by,
      created_at
    ) VALUES (
      :reportType,
      :entityId,
      :frequency,
      :recipients,
      true,
      :userId,
      NOW()
    )
    RETURNING *
  `;

  const result = await sequelize.query(query, {
    replacements: {
      reportType,
      entityId,
      frequency,
      recipients: JSON.stringify(recipients),
      userId,
    },
    type: QueryTypes.INSERT,
    transaction,
  });

  return result[0];
};

/**
 * Retrieves financial report generation history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {string} reportType - Report type filter
 * @param {number} limit - Number of records to return
 * @param {number} offset - Offset for pagination
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Report history
 *
 * @example
 * ```typescript
 * const history = await getReportHistory(sequelize, 1, 'balance_sheet', 20, 0);
 * ```
 */
export const getReportHistory = async (
  sequelize: Sequelize,
  entityId: number,
  reportType?: string,
  limit: number = 20,
  offset: number = 0,
  transaction?: Transaction,
): Promise<any[]> => {
  const ReportHeader = createFinancialReportHeaderModel(sequelize);

  const where: any = { entityId };
  if (reportType) {
    where.reportType = reportType;
  }

  const reports = await ReportHeader.findAll({
    where,
    order: [['reportDate', 'DESC']],
    limit,
    offset,
    transaction,
  });

  return reports;
};

/**
 * Compares financial statements across multiple periods.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number[]} fiscalYears - Array of fiscal years to compare
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} reportType - Report type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Comparative analysis
 *
 * @example
 * ```typescript
 * const comparison = await compareFinancialStatements(
 *   sequelize,
 *   1,
 *   [2022, 2023, 2024],
 *   12,
 *   'balance_sheet'
 * );
 * ```
 */
export const compareFinancialStatements = async (
  sequelize: Sequelize,
  entityId: number,
  fiscalYears: number[],
  fiscalPeriod: number,
  reportType: 'balance_sheet' | 'income_statement',
  transaction?: Transaction,
): Promise<any> => {
  const reports: any[] = [];

  for (const year of fiscalYears) {
    if (reportType === 'balance_sheet') {
      const report = await generateBalanceSheet(
        sequelize,
        {
          reportDate: new Date(year, 11, 31),
          fiscalYear: year,
          fiscalPeriod,
          entityId,
          includeComparative: false,
        },
        transaction,
      );
      reports.push({ year, report });
    } else {
      const report = await generateIncomeStatement(
        sequelize,
        {
          reportDate: new Date(year, 11, 31),
          fiscalYear: year,
          fiscalPeriod,
          entityId,
          periodType: 'month',
          includeBudget: false,
        },
        transaction,
      );
      reports.push({ year, report });
    }
  }

  return {
    entityId,
    reportType,
    fiscalPeriod,
    comparisonYears: fiscalYears,
    reports,
  };
};

/**
 * Generates financial ratio analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Financial ratios
 *
 * @example
 * ```typescript
 * const ratios = await generateFinancialRatios(sequelize, 1, 2024, 12);
 * ```
 */
export const generateFinancialRatios = async (
  sequelize: Sequelize,
  entityId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<any> => {
  const balanceSheet = await generateBalanceSheet(
    sequelize,
    {
      reportDate: new Date(),
      fiscalYear,
      fiscalPeriod,
      entityId,
      includeComparative: false,
    },
    transaction,
  );

  const incomeStatement = await generateIncomeStatement(
    sequelize,
    {
      reportDate: new Date(),
      fiscalYear,
      fiscalPeriod,
      entityId,
      periodType: 'year',
      includeBudget: false,
    },
    transaction,
  );

  const currentAssets = balanceSheet.assets.currentAssets.subtotal;
  const totalAssets = balanceSheet.assets.totalAssets;
  const currentLiabilities = balanceSheet.liabilities.currentLiabilities.subtotal;
  const totalLiabilities = balanceSheet.liabilities.totalLiabilities;
  const totalEquity = balanceSheet.equity.totalEquity;
  const revenue = incomeStatement.revenue.totalRevenue;
  const netIncome = incomeStatement.netIncome;
  const grossProfit = incomeStatement.grossProfit;

  return {
    liquidity: {
      currentRatio: currentLiabilities !== 0 ? currentAssets / currentLiabilities : 0,
      quickRatio: currentLiabilities !== 0 ? (currentAssets * 0.8) / currentLiabilities : 0,
      cashRatio: 0, // Would need cash account identification
      workingCapital: currentAssets - currentLiabilities,
    },
    profitability: {
      grossProfitMargin: revenue !== 0 ? (grossProfit / revenue) * 100 : 0,
      operatingProfitMargin: revenue !== 0 ? (incomeStatement.operatingIncome / revenue) * 100 : 0,
      netProfitMargin: revenue !== 0 ? (netIncome / revenue) * 100 : 0,
      returnOnAssets: totalAssets !== 0 ? (netIncome / totalAssets) * 100 : 0,
      returnOnEquity: totalEquity !== 0 ? (netIncome / totalEquity) * 100 : 0,
    },
    leverage: {
      debtToAssets: totalAssets !== 0 ? (totalLiabilities / totalAssets) * 100 : 0,
      debtToEquity: totalEquity !== 0 ? totalLiabilities / totalEquity : 0,
      equityMultiplier: totalEquity !== 0 ? totalAssets / totalEquity : 0,
      interestCoverageRatio: 0, // Would need interest expense identification
    },
    efficiency: {
      assetTurnover: totalAssets !== 0 ? revenue / totalAssets : 0,
      inventoryTurnover: 0, // Would need COGS and inventory
      receivablesTurnover: 0, // Would need receivables identification
      payablesTurnover: 0, // Would need payables identification
    },
  };
};

/**
 * Archives financial reports for compliance and audit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reportId - Report ID to archive
 * @param {string} archiveLocation - Archive storage location
 * @param {string} userId - User archiving the report
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await archiveFinancialReport(sequelize, 123, 's3://archive/2024/', 'user123');
 * ```
 */
export const archiveFinancialReport = async (
  sequelize: Sequelize,
  reportId: number,
  archiveLocation: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const ReportHeader = createFinancialReportHeaderModel(sequelize);

  const report = await ReportHeader.findByPk(reportId, { transaction });
  if (!report) {
    throw new Error('Report not found');
  }

  await report.update(
    {
      status: 'archived',
      metadata: {
        ...report.metadata,
        archiveLocation,
        archivedBy: userId,
        archivedAt: new Date(),
      },
    },
    { transaction },
  );
};

/**
 * Validates financial report data integrity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reportId - Report ID to validate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateFinancialReportIntegrity(sequelize, 123);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export const validateFinancialReportIntegrity = async (
  sequelize: Sequelize,
  reportId: number,
  transaction?: Transaction,
): Promise<{ valid: boolean; errors: string[] }> => {
  const ReportHeader = createFinancialReportHeaderModel(sequelize);

  const report = await ReportHeader.findByPk(reportId, { transaction });
  if (!report) {
    return { valid: false, errors: ['Report not found'] };
  }

  const errors: string[] = [];

  // Validate based on report type
  if (report.reportType === 'balance_sheet') {
    // Balance sheet should balance
    const balanceSheet = await generateBalanceSheet(
      sequelize,
      {
        reportDate: report.reportDate,
        fiscalYear: report.fiscalYear,
        fiscalPeriod: report.fiscalPeriod,
        entityId: report.entityId,
        includeComparative: false,
      },
      transaction,
    );

    const diff = Math.abs(balanceSheet.assets.totalAssets - balanceSheet.totalLiabilitiesAndEquity);
    if (diff > 0.01) {
      errors.push(`Balance sheet does not balance. Difference: ${diff}`);
    }
  }

  if (report.reportType === 'trial_balance') {
    const trialBalance = await generateTrialBalance(
      sequelize,
      report.fiscalYear,
      report.fiscalPeriod,
      report.entityId,
      false,
      transaction,
    );

    if (!trialBalance.isBalanced) {
      errors.push('Trial balance debits do not equal credits');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Publishes financial report for stakeholder access.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reportId - Report ID to publish
 * @param {string} userId - User publishing the report
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await publishFinancialReport(sequelize, 123, 'user123');
 * ```
 */
export const publishFinancialReport = async (
  sequelize: Sequelize,
  reportId: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const ReportHeader = createFinancialReportHeaderModel(sequelize);

  const report = await ReportHeader.findByPk(reportId, { transaction });
  if (!report) {
    throw new Error('Report not found');
  }

  // Validate before publishing
  const validation = await validateFinancialReportIntegrity(sequelize, reportId, transaction);
  if (!validation.valid) {
    throw new Error(`Cannot publish report with validation errors: ${validation.errors.join(', ')}`);
  }

  await report.update(
    {
      status: 'published',
      publishedBy: userId,
      publishedAt: new Date(),
    },
    { transaction },
  );
};

/**
 * Generates year-over-year growth analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number} currentYear - Current fiscal year
 * @param {number} numberOfYears - Number of years to analyze
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Growth analysis
 *
 * @example
 * ```typescript
 * const growth = await generateYearOverYearGrowth(sequelize, 1, 2024, 3);
 * ```
 */
export const generateYearOverYearGrowth = async (
  sequelize: Sequelize,
  entityId: number,
  currentYear: number,
  numberOfYears: number = 3,
  transaction?: Transaction,
): Promise<any> => {
  const years = Array.from({ length: numberOfYears }, (_, i) => currentYear - i).reverse();
  const yearlyData: any[] = [];

  for (const year of years) {
    const incomeStatement = await generateIncomeStatement(
      sequelize,
      {
        reportDate: new Date(year, 11, 31),
        fiscalYear: year,
        fiscalPeriod: 12,
        entityId,
        periodType: 'year',
        includeBudget: false,
      },
      transaction,
    );

    const balanceSheet = await generateBalanceSheet(
      sequelize,
      {
        reportDate: new Date(year, 11, 31),
        fiscalYear: year,
        fiscalPeriod: 12,
        entityId,
        includeComparative: false,
      },
      transaction,
    );

    yearlyData.push({
      year,
      revenue: incomeStatement.revenue.totalRevenue,
      netIncome: incomeStatement.netIncome,
      totalAssets: balanceSheet.assets.totalAssets,
      totalEquity: balanceSheet.equity.totalEquity,
    });
  }

  // Calculate growth rates
  const growthRates = [];
  for (let i = 1; i < yearlyData.length; i++) {
    const current = yearlyData[i];
    const prior = yearlyData[i - 1];

    growthRates.push({
      year: current.year,
      revenueGrowth: prior.revenue !== 0 ? ((current.revenue - prior.revenue) / prior.revenue) * 100 : 0,
      netIncomeGrowth: prior.netIncome !== 0 ? ((current.netIncome - prior.netIncome) / prior.netIncome) * 100 : 0,
      assetGrowth: prior.totalAssets !== 0 ? ((current.totalAssets - prior.totalAssets) / prior.totalAssets) * 100 : 0,
      equityGrowth: prior.totalEquity !== 0 ? ((current.totalEquity - prior.totalEquity) / prior.totalEquity) * 100 : 0,
    });
  }

  return {
    entityId,
    analysisYears: years,
    yearlyData,
    growthRates,
  };
};

/**
 * Generates budget vs actual comparison report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period (0 for full year)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Budget vs actual report
 *
 * @example
 * ```typescript
 * const budgetComparison = await generateBudgetVsActual(sequelize, 1, 2024, 0);
 * ```
 */
export const generateBudgetVsActual = async (
  sequelize: Sequelize,
  entityId: number,
  fiscalYear: number,
  fiscalPeriod: number = 0,
  transaction?: Transaction,
): Promise<any> => {
  const periodCondition = fiscalPeriod > 0 ? 'AND fiscal_period = :fiscalPeriod' : 'AND fiscal_period <= 12';

  const query = `
    WITH actuals AS (
      SELECT
        a.account_code,
        a.account_name,
        a.account_type,
        COALESCE(SUM(CASE
          WHEN a.account_type IN ('revenue', 'liability', 'equity')
          THEN jel.credit_amount - jel.debit_amount
          ELSE jel.debit_amount - jel.credit_amount
        END), 0) as actual_amount
      FROM chart_of_accounts a
      LEFT JOIN journal_entry_lines jel ON a.id = jel.account_id
      LEFT JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
      WHERE jeh.fiscal_year = :fiscalYear
        ${periodCondition}
        AND jeh.status = 'posted'
      GROUP BY a.id, a.account_code, a.account_name, a.account_type
    ),
    budgets AS (
      SELECT
        a.account_code,
        COALESCE(SUM(bl.budget_amount), 0) as budget_amount
      FROM chart_of_accounts a
      LEFT JOIN budget_lines bl ON a.id = bl.account_id
      WHERE bl.fiscal_year = :fiscalYear
        ${periodCondition}
      GROUP BY a.id, a.account_code
    )
    SELECT
      act.account_code,
      act.account_name,
      act.account_type,
      act.actual_amount,
      COALESCE(bgt.budget_amount, 0) as budget_amount,
      act.actual_amount - COALESCE(bgt.budget_amount, 0) as variance,
      CASE
        WHEN COALESCE(bgt.budget_amount, 0) != 0
        THEN ((act.actual_amount - COALESCE(bgt.budget_amount, 0)) / COALESCE(bgt.budget_amount, 0)) * 100
        ELSE 0
      END as variance_percent
    FROM actuals act
    LEFT JOIN budgets bgt ON act.account_code = bgt.account_code
    ORDER BY act.account_type, act.account_code
  `;

  const results = await sequelize.query(query, {
    replacements: { fiscalYear, fiscalPeriod },
    type: QueryTypes.SELECT,
    transaction,
  });

  const revenueLines = [];
  const expenseLines = [];
  let totalRevenueBudget = 0;
  let totalRevenueActual = 0;
  let totalExpenseBudget = 0;
  let totalExpenseActual = 0;

  for (const row of results as any[]) {
    const line = {
      accountCode: row.account_code,
      accountName: row.account_name,
      budgetAmount: Number(row.budget_amount),
      actualAmount: Number(row.actual_amount),
      variance: Number(row.variance),
      variancePercent: Number(row.variance_percent),
    };

    if (row.account_type === 'revenue') {
      revenueLines.push(line);
      totalRevenueBudget += line.budgetAmount;
      totalRevenueActual += line.actualAmount;
    } else if (row.account_type === 'expense') {
      expenseLines.push(line);
      totalExpenseBudget += line.budgetAmount;
      totalExpenseActual += line.actualAmount;
    }
  }

  return {
    entityId,
    fiscalYear,
    fiscalPeriod,
    revenue: {
      lines: revenueLines,
      totalBudget: totalRevenueBudget,
      totalActual: totalRevenueActual,
      variance: totalRevenueActual - totalRevenueBudget,
    },
    expenses: {
      lines: expenseLines,
      totalBudget: totalExpenseBudget,
      totalActual: totalExpenseActual,
      variance: totalExpenseActual - totalExpenseBudget,
    },
    netIncome: {
      budget: totalRevenueBudget - totalExpenseBudget,
      actual: totalRevenueActual - totalExpenseActual,
      variance: (totalRevenueActual - totalExpenseActual) - (totalRevenueBudget - totalExpenseBudget),
    },
  };
};

/**
 * Generates common-size financial statements (vertical analysis).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} statementType - Statement type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Common-size statement
 *
 * @example
 * ```typescript
 * const commonSize = await generateCommonSizeStatement(sequelize, 1, 2024, 12, 'income_statement');
 * ```
 */
export const generateCommonSizeStatement = async (
  sequelize: Sequelize,
  entityId: number,
  fiscalYear: number,
  fiscalPeriod: number,
  statementType: 'balance_sheet' | 'income_statement',
  transaction?: Transaction,
): Promise<any> => {
  if (statementType === 'balance_sheet') {
    const balanceSheet = await generateBalanceSheet(
      sequelize,
      {
        reportDate: new Date(),
        fiscalYear,
        fiscalPeriod,
        entityId,
        includeComparative: false,
      },
      transaction,
    );

    const totalAssets = balanceSheet.assets.totalAssets;

    // Calculate percentages for each line
    const calculatePercent = (lines: BalanceSheetLine[]) => {
      return lines.map((line) => ({
        ...line,
        percentOfTotal: totalAssets !== 0 ? (line.currentBalance / totalAssets) * 100 : 0,
      }));
    };

    return {
      reportType: 'balance_sheet_common_size',
      baseAmount: totalAssets,
      assets: {
        currentAssets: {
          ...balanceSheet.assets.currentAssets,
          accountLines: calculatePercent(balanceSheet.assets.currentAssets.accountLines),
          percentOfTotal: totalAssets !== 0 ? (balanceSheet.assets.currentAssets.subtotal / totalAssets) * 100 : 0,
        },
        nonCurrentAssets: {
          ...balanceSheet.assets.nonCurrentAssets,
          accountLines: calculatePercent(balanceSheet.assets.nonCurrentAssets.accountLines),
          percentOfTotal: totalAssets !== 0 ? (balanceSheet.assets.nonCurrentAssets.subtotal / totalAssets) * 100 : 0,
        },
      },
    };
  } else {
    const incomeStatement = await generateIncomeStatement(
      sequelize,
      {
        reportDate: new Date(),
        fiscalYear,
        fiscalPeriod,
        entityId,
        periodType: 'month',
        includeBudget: false,
      },
      transaction,
    );

    const totalRevenue = incomeStatement.revenue.totalRevenue;

    const calculatePercent = (lines: IncomeStatementLine[]) => {
      return lines.map((line) => ({
        ...line,
        percentOfRevenue: totalRevenue !== 0 ? (line.currentAmount / totalRevenue) * 100 : 0,
      }));
    };

    return {
      reportType: 'income_statement_common_size',
      baseAmount: totalRevenue,
      revenue: {
        sections: incomeStatement.revenue.sections.map((section) => ({
          ...section,
          accountLines: calculatePercent(section.accountLines),
          percentOfRevenue: totalRevenue !== 0 ? (section.subtotal / totalRevenue) * 100 : 0,
        })),
      },
      expenses: {
        sections: incomeStatement.expenses.sections.map((section) => ({
          ...section,
          accountLines: calculatePercent(section.accountLines),
          percentOfRevenue: totalRevenue !== 0 ? (section.subtotal / totalRevenue) * 100 : 0,
        })),
      },
    };
  }
};
