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
import { Sequelize, Transaction } from 'sequelize';
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
export declare class GenerateBalanceSheetDto {
    reportDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    entityId: number;
    includeComparative?: boolean;
    comparisonType?: string;
    detailLevel?: string;
}
export declare class GenerateIncomeStatementDto {
    reportDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    entityId: number;
    periodType: string;
    includeBudget?: boolean;
    includePriorPeriod?: boolean;
}
export declare class GenerateCashFlowDto {
    reportDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    entityId: number;
    method: string;
}
export declare class GenerateXBRLDto {
    reportDate: Date;
    fiscalYear: number;
    entityId: number;
    taxonomyVersion: string;
    reportType: string;
}
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
export declare const createFinancialReportHeaderModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        reportNumber: string;
        reportType: string;
        reportDate: Date;
        fiscalYear: number;
        fiscalPeriod: number;
        entityId: number;
        status: string;
        generatedBy: string;
        generatedAt: Date;
        publishedBy: string | null;
        publishedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
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
export declare const createFinancialKPIDefinitionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        kpiId: string;
        kpiName: string;
        category: string;
        calculationFormula: string;
        targetValue: number | null;
        thresholdWarning: number | null;
        thresholdCritical: number | null;
        isActive: boolean;
        displayOrder: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const generateBalanceSheet: (sequelize: Sequelize, params: GenerateBalanceSheetDto, transaction?: Transaction) => Promise<BalanceSheetReport>;
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
export declare const generateIncomeStatement: (sequelize: Sequelize, params: GenerateIncomeStatementDto, transaction?: Transaction) => Promise<IncomeStatementReport>;
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
export declare const generateCashFlowStatement: (sequelize: Sequelize, params: GenerateCashFlowDto, transaction?: Transaction) => Promise<CashFlowStatement>;
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
export declare const generateTrialBalance: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, entityId: number, includeInactive?: boolean, transaction?: Transaction) => Promise<TrialBalanceReport>;
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
export declare const generateConsolidatedFinancials: (sequelize: Sequelize, parentEntityId: number, fiscalYear: number, fiscalPeriod: number, consolidationType: "full" | "proportional" | "equity", transaction?: Transaction) => Promise<ConsolidatedFinancials>;
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
export declare const generateXBRLReport: (sequelize: Sequelize, params: GenerateXBRLDto, transaction?: Transaction) => Promise<XBRLReport>;
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
export declare const calculateFinancialKPIs: (sequelize: Sequelize, entityId: number, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<FinancialKPI[]>;
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
export declare const performVarianceAnalysis: (sequelize: Sequelize, entityId: number, fiscalYear: number, fiscalPeriod: number, analysisType: "budget" | "forecast" | "prior_period" | "prior_year", thresholdPercent?: number, transaction?: Transaction) => Promise<VarianceAnalysis>;
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
export declare const generateManagementDashboard: (sequelize: Sequelize, entityId: number, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<ManagementDashboard>;
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
export declare const generateSegmentReporting: (sequelize: Sequelize, entityId: number, fiscalYear: number, fiscalPeriod: number, segmentType: "business_unit" | "geography" | "product_line" | "customer_type", transaction?: Transaction) => Promise<SegmentReporting>;
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
export declare const getDrillDownTransactions: (sequelize: Sequelize, accountCode: string, fiscalYear: number, fiscalPeriod: number, limit?: number, offset?: number, transaction?: Transaction) => Promise<DrillDownData>;
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
export declare const exportFinancialReport: (sequelize: Sequelize, reportId: number, format: "pdf" | "excel" | "csv" | "xbrl" | "json", transaction?: Transaction) => Promise<Buffer>;
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
export declare const scheduleRecurringReport: (sequelize: Sequelize, reportType: string, entityId: number, frequency: "daily" | "weekly" | "monthly" | "quarterly" | "annually", recipients: string[], userId: string, transaction?: Transaction) => Promise<any>;
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
export declare const getReportHistory: (sequelize: Sequelize, entityId: number, reportType?: string, limit?: number, offset?: number, transaction?: Transaction) => Promise<any[]>;
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
export declare const compareFinancialStatements: (sequelize: Sequelize, entityId: number, fiscalYears: number[], fiscalPeriod: number, reportType: "balance_sheet" | "income_statement", transaction?: Transaction) => Promise<any>;
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
export declare const generateFinancialRatios: (sequelize: Sequelize, entityId: number, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<any>;
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
export declare const archiveFinancialReport: (sequelize: Sequelize, reportId: number, archiveLocation: string, userId: string, transaction?: Transaction) => Promise<void>;
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
export declare const validateFinancialReportIntegrity: (sequelize: Sequelize, reportId: number, transaction?: Transaction) => Promise<{
    valid: boolean;
    errors: string[];
}>;
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
export declare const publishFinancialReport: (sequelize: Sequelize, reportId: number, userId: string, transaction?: Transaction) => Promise<void>;
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
export declare const generateYearOverYearGrowth: (sequelize: Sequelize, entityId: number, currentYear: number, numberOfYears?: number, transaction?: Transaction) => Promise<any>;
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
export declare const generateBudgetVsActual: (sequelize: Sequelize, entityId: number, fiscalYear: number, fiscalPeriod?: number, transaction?: Transaction) => Promise<any>;
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
export declare const generateCommonSizeStatement: (sequelize: Sequelize, entityId: number, fiscalYear: number, fiscalPeriod: number, statementType: "balance_sheet" | "income_statement", transaction?: Transaction) => Promise<any>;
export {};
//# sourceMappingURL=financial-reporting-analytics-kit.d.ts.map