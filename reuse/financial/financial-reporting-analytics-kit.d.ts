/**
 * LOC: FINRPT1234567
 * File: /reuse/financial/financial-reporting-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ./budget-planning-allocation-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial reporting services
 *   - Analytics dashboards
 *   - Executive reporting controllers
 */
/**
 * File: /reuse/financial/financial-reporting-analytics-kit.ts
 * Locator: WC-FIN-REPT-001
 * Purpose: Comprehensive Financial Reporting & Analytics Utilities - USACE CEFMS-level reporting system
 *
 * Upstream: Error handling, validation, budget planning utilities
 * Downstream: ../backend/*, Financial reporting controllers, analytics services, dashboard generators
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for financial statements, reports, analytics, dashboards, KPIs, compliance
 *
 * LLM Context: Enterprise-grade financial reporting and analytics system competing with USACE CEFMS.
 * Provides balance sheets, income statements, cash flow analysis, fund accounting, trial balance, general ledger,
 * financial analytics, trend analysis, comparative reports, executive dashboards, KPI tracking, variance reports,
 * compliance reporting, audit trails, custom report builders, scheduled reports, data visualization.
 */
import { Sequelize } from 'sequelize';
interface FinancialStatement {
    statementType: 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'CASH_FLOW' | 'FUND_BALANCE' | 'BUDGET_STATUS';
    fiscalYear: number;
    period: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'ANNUAL' | 'MONTHLY';
    asOfDate: Date;
    organizationCode: string;
    currency: string;
    data: Record<string, any>;
}
interface BalanceSheetData {
    assets: {
        current: {
            [key: string]: number;
        };
        nonCurrent: {
            [key: string]: number;
        };
        total: number;
    };
    liabilities: {
        current: {
            [key: string]: number;
        };
        nonCurrent: {
            [key: string]: number;
        };
        total: number;
    };
    equity: {
        [key: string]: number;
        total: number;
    };
    balanceCheck: boolean;
}
interface IncomeStatementData {
    revenue: {
        operating: {
            [key: string]: number;
        };
        nonOperating: {
            [key: string]: number;
        };
        total: number;
    };
    expenses: {
        operating: {
            [key: string]: number;
        };
        nonOperating: {
            [key: string]: number;
        };
        total: number;
    };
    grossProfit: number;
    operatingIncome: number;
    netIncome: number;
}
interface CashFlowData {
    operatingActivities: {
        [key: string]: number;
    };
    investingActivities: {
        [key: string]: number;
    };
    financingActivities: {
        [key: string]: number;
    };
    netCashFlow: number;
    beginningCash: number;
    endingCash: number;
}
interface FinancialRatio {
    ratioName: string;
    ratioCategory: 'LIQUIDITY' | 'PROFITABILITY' | 'EFFICIENCY' | 'LEVERAGE' | 'COVERAGE';
    value: number;
    benchmark: number;
    performance: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    interpretation: string;
}
interface FinancialKPI {
    kpiName: string;
    kpiCode: string;
    value: number;
    target: number;
    unit: string;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    period: string;
    status: 'ON_TARGET' | 'AT_RISK' | 'OFF_TARGET';
}
interface ReportSchedule {
    scheduleId: string;
    reportType: string;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
    recipients: string[];
    format: 'PDF' | 'EXCEL' | 'CSV' | 'HTML';
    parameters: Record<string, any>;
    enabled: boolean;
    lastRun?: Date;
    nextRun?: Date;
}
interface AuditTrail {
    auditId: string;
    entityType: string;
    entityId: number;
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT';
    userId: string;
    userName: string;
    timestamp: Date;
    changes: Array<{
        field: string;
        oldValue: any;
        newValue: any;
    }>;
    ipAddress?: string;
    metadata?: Record<string, any>;
}
interface ComplianceReport {
    reportId: string;
    complianceType: 'GAAP' | 'GASB' | 'FASB' | 'OMB' | 'TREASURY' | 'INTERNAL';
    fiscalYear: number;
    status: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';
    findings: Array<{
        findingId: string;
        severity: 'HIGH' | 'MEDIUM' | 'LOW';
        description: string;
        recommendation: string;
    }>;
    certifiedBy?: string;
    certifiedAt?: Date;
}
interface AnalyticsQuery {
    queryId: string;
    queryName: string;
    dimensions: string[];
    metrics: string[];
    filters: Array<{
        field: string;
        operator: string;
        value: any;
    }>;
    groupBy: string[];
    orderBy: Array<{
        field: string;
        direction: 'ASC' | 'DESC';
    }>;
    limit?: number;
}
interface DashboardWidget {
    widgetId: string;
    widgetType: 'CHART' | 'TABLE' | 'METRIC' | 'GAUGE' | 'MAP';
    title: string;
    dataSource: string;
    configuration: Record<string, any>;
    refreshInterval?: number;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
interface TrendAnalysis {
    metric: string;
    periods: Array<{
        period: string;
        value: number;
    }>;
    trendDirection: 'UPWARD' | 'DOWNWARD' | 'STABLE' | 'VOLATILE';
    changePercent: number;
    seasonalityDetected: boolean;
    forecast?: Array<{
        period: string;
        predicted: number;
        confidence: number;
    }>;
}
/**
 * Sequelize model for Financial Reports with versioning and approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FinancialReport model
 *
 * @example
 * ```typescript
 * const FinancialReport = createFinancialReportModel(sequelize);
 * const report = await FinancialReport.create({
 *   reportType: 'BALANCE_SHEET',
 *   fiscalYear: 2025,
 *   period: 'Q1',
 *   organizationCode: 'USACE-NAD',
 *   status: 'DRAFT'
 * });
 * ```
 */
export declare const createFinancialReportModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        reportNumber: string;
        reportType: string;
        reportName: string;
        fiscalYear: number;
        period: string;
        asOfDate: Date;
        organizationCode: string;
        organizationName: string;
        currency: string;
        reportData: Record<string, any>;
        status: string;
        version: number;
        previousVersion: number | null;
        preparedBy: string;
        reviewedBy: string | null;
        approvedBy: string | null;
        reviewedAt: Date | null;
        approvedAt: Date | null;
        publishedAt: Date | null;
        notes: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Financial KPIs with targets and thresholds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FinancialKPI model
 *
 * @example
 * ```typescript
 * const FinancialKPI = createFinancialKPIModel(sequelize);
 * const kpi = await FinancialKPI.create({
 *   kpiCode: 'BUDGET_EXEC_RATE',
 *   kpiName: 'Budget Execution Rate',
 *   targetValue: 95,
 *   actualValue: 92,
 *   unit: 'PERCENTAGE'
 * });
 * ```
 */
export declare const createFinancialKPIModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        kpiCode: string;
        kpiName: string;
        kpiCategory: string;
        description: string;
        calculationFormula: string;
        fiscalYear: number;
        period: string;
        organizationCode: string;
        targetValue: number;
        actualValue: number;
        unit: string;
        status: string;
        trend: string;
        varianceAmount: number;
        variancePercent: number;
        thresholds: Record<string, any>;
        dataSource: string;
        calculatedAt: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Report Schedules with automated distribution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ReportSchedule model
 *
 * @example
 * ```typescript
 * const ReportSchedule = createReportScheduleModel(sequelize);
 * const schedule = await ReportSchedule.create({
 *   reportType: 'BUDGET_STATUS',
 *   frequency: 'MONTHLY',
 *   recipients: ['cfo@agency.gov', 'director@agency.gov'],
 *   enabled: true
 * });
 * ```
 */
export declare const createReportScheduleModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        scheduleId: string;
        scheduleName: string;
        reportType: string;
        reportParameters: Record<string, any>;
        frequency: string;
        dayOfWeek: number | null;
        dayOfMonth: number | null;
        timeOfDay: string;
        timezone: string;
        format: string;
        recipients: string[];
        ccRecipients: string[];
        subject: string | null;
        message: string | null;
        enabled: boolean;
        lastRun: Date | null;
        nextRun: Date | null;
        lastStatus: string | null;
        runCount: number;
        createdBy: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Generates balance sheet for specified period and organization.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} period - Reporting period
 * @param {string} organizationCode - Organization code
 * @param {Date} asOfDate - As-of date
 * @returns {Promise<BalanceSheetData>} Balance sheet data
 *
 * @example
 * ```typescript
 * const balanceSheet = await generateBalanceSheet(2025, 'Q1', 'USACE-NAD', new Date('2024-12-31'));
 * ```
 */
export declare const generateBalanceSheet: (fiscalYear: number, period: string, organizationCode: string, asOfDate: Date) => Promise<BalanceSheetData>;
/**
 * Calculates trial balance for all accounts.
 *
 * @param {Date} asOfDate - As-of date
 * @param {string} [organizationCode] - Optional organization filter
 * @returns {Promise<Array<{ accountCode: string; accountName: string; debit: number; credit: number }>>} Trial balance
 *
 * @example
 * ```typescript
 * const trialBalance = await calculateTrialBalance(new Date('2024-12-31'), 'USACE-NAD');
 * ```
 */
export declare const calculateTrialBalance: (asOfDate: Date, organizationCode?: string) => Promise<Array<{
    accountCode: string;
    accountName: string;
    debit: number;
    credit: number;
}>>;
/**
 * Validates balance sheet for accounting equation compliance.
 *
 * @param {BalanceSheetData} balanceSheet - Balance sheet to validate
 * @returns {{ valid: boolean; errors: string[]; warnings: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateBalanceSheet(balanceSheet);
 * if (!validation.valid) {
 *   console.error('Balance sheet errors:', validation.errors);
 * }
 * ```
 */
export declare const validateBalanceSheet: (balanceSheet: BalanceSheetData) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Generates comparative balance sheet for multiple periods.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string[]} periods - Periods to compare
 * @param {string} organizationCode - Organization code
 * @returns {Promise<Array<{ period: string; data: BalanceSheetData }>>} Comparative balance sheets
 *
 * @example
 * ```typescript
 * const comparative = await generateComparativeBalanceSheet(2025, ['Q1', 'Q2', 'Q3'], 'USACE-NAD');
 * ```
 */
export declare const generateComparativeBalanceSheet: (fiscalYear: number, periods: string[], organizationCode: string) => Promise<Array<{
    period: string;
    data: BalanceSheetData;
}>>;
/**
 * Exports balance sheet to specified format.
 *
 * @param {BalanceSheetData} balanceSheet - Balance sheet data
 * @param {string} format - Export format ('PDF' | 'EXCEL' | 'CSV')
 * @param {object} [options] - Export options
 * @returns {Promise<Buffer>} Exported balance sheet
 *
 * @example
 * ```typescript
 * const pdfBuffer = await exportBalanceSheet(balanceSheet, 'PDF', { includeNotes: true });
 * ```
 */
export declare const exportBalanceSheet: (balanceSheet: BalanceSheetData, format: string, options?: any) => Promise<Buffer>;
/**
 * Generates income statement (profit & loss) for specified period.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} period - Reporting period
 * @param {string} organizationCode - Organization code
 * @returns {Promise<IncomeStatementData>} Income statement data
 *
 * @example
 * ```typescript
 * const incomeStatement = await generateIncomeStatement(2025, 'Q1', 'USACE-NAD');
 * ```
 */
export declare const generateIncomeStatement: (fiscalYear: number, period: string, organizationCode: string) => Promise<IncomeStatementData>;
/**
 * Calculates revenue by category and source.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} period - Reporting period
 * @param {string} [organizationCode] - Optional organization filter
 * @returns {Promise<Array<{ category: string; source: string; amount: number }>>} Revenue breakdown
 *
 * @example
 * ```typescript
 * const revenueBreakdown = await calculateRevenueByCategory(2025, 'Q1');
 * ```
 */
export declare const calculateRevenueByCategory: (fiscalYear: number, period: string, organizationCode?: string) => Promise<Array<{
    category: string;
    source: string;
    amount: number;
}>>;
/**
 * Calculates expense by category and function.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} period - Reporting period
 * @param {string} [organizationCode] - Optional organization filter
 * @returns {Promise<Array<{ category: string; function: string; amount: number }>>} Expense breakdown
 *
 * @example
 * ```typescript
 * const expenseBreakdown = await calculateExpenseByCategory(2025, 'Q1');
 * ```
 */
export declare const calculateExpenseByCategory: (fiscalYear: number, period: string, organizationCode?: string) => Promise<Array<{
    category: string;
    function: string;
    amount: number;
}>>;
/**
 * Calculates key profitability metrics.
 *
 * @param {IncomeStatementData} incomeStatement - Income statement data
 * @returns {Promise<{ grossMargin: number; operatingMargin: number; netMargin: number; roe: number }>} Profitability metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateProfitabilityMetrics(incomeStatement);
 * console.log(`Net margin: ${metrics.netMargin}%`);
 * ```
 */
export declare const calculateProfitabilityMetrics: (incomeStatement: IncomeStatementData) => Promise<{
    grossMargin: number;
    operatingMargin: number;
    netMargin: number;
    roe: number;
}>;
/**
 * Generates multi-period income statement comparison.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string[]} periods - Periods to compare
 * @param {string} organizationCode - Organization code
 * @returns {Promise<Array<{ period: string; data: IncomeStatementData }>>} Comparative income statements
 *
 * @example
 * ```typescript
 * const comparison = await generateComparativeIncomeStatement(2025, ['Q1', 'Q2'], 'USACE-NAD');
 * ```
 */
export declare const generateComparativeIncomeStatement: (fiscalYear: number, periods: string[], organizationCode: string) => Promise<Array<{
    period: string;
    data: IncomeStatementData;
}>>;
/**
 * Generates cash flow statement for specified period.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} period - Reporting period
 * @param {string} organizationCode - Organization code
 * @returns {Promise<CashFlowData>} Cash flow statement
 *
 * @example
 * ```typescript
 * const cashFlow = await generateCashFlowStatement(2025, 'Q1', 'USACE-NAD');
 * ```
 */
export declare const generateCashFlowStatement: (fiscalYear: number, period: string, organizationCode: string) => Promise<CashFlowData>;
/**
 * Analyzes cash flow trends and patterns.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} lookbackPeriods - Number of periods to analyze
 * @param {string} organizationCode - Organization code
 * @returns {Promise<{ trend: string; averageCashFlow: number; volatility: number }>} Cash flow analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeCashFlowTrends(2025, 4, 'USACE-NAD');
 * ```
 */
export declare const analyzeCashFlowTrends: (fiscalYear: number, lookbackPeriods: number, organizationCode: string) => Promise<{
    trend: string;
    averageCashFlow: number;
    volatility: number;
}>;
/**
 * Forecasts future cash flow based on historical patterns.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} forecastPeriods - Number of periods to forecast
 * @param {string} organizationCode - Organization code
 * @returns {Promise<Array<{ period: string; projectedCashFlow: number; confidence: number }>>} Cash flow forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCashFlow(2025, 3, 'USACE-NAD');
 * ```
 */
export declare const forecastCashFlow: (fiscalYear: number, forecastPeriods: number, organizationCode: string) => Promise<Array<{
    period: string;
    projectedCashFlow: number;
    confidence: number;
}>>;
/**
 * Calculates cash conversion cycle metrics.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} period - Reporting period
 * @param {string} organizationCode - Organization code
 * @returns {Promise<{ daysSalesOutstanding: number; daysPayableOutstanding: number; cashConversionCycle: number }>} Cash conversion metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateCashConversionCycle(2025, 'Q1', 'USACE-NAD');
 * ```
 */
export declare const calculateCashConversionCycle: (fiscalYear: number, period: string, organizationCode: string) => Promise<{
    daysSalesOutstanding: number;
    daysPayableOutstanding: number;
    cashConversionCycle: number;
}>;
/**
 * Identifies cash flow anomalies and risks.
 *
 * @param {CashFlowData} cashFlow - Cash flow data
 * @param {object} [thresholds] - Anomaly detection thresholds
 * @returns {Promise<Array<{ type: string; severity: string; description: string }>>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await identifyCashFlowAnomalies(cashFlow);
 * ```
 */
export declare const identifyCashFlowAnomalies: (cashFlow: CashFlowData, thresholds?: any) => Promise<Array<{
    type: string;
    severity: string;
    description: string;
}>>;
/**
 * Calculates comprehensive financial ratios.
 *
 * @param {BalanceSheetData} balanceSheet - Balance sheet data
 * @param {IncomeStatementData} incomeStatement - Income statement data
 * @returns {Promise<FinancialRatio[]>} Calculated financial ratios
 *
 * @example
 * ```typescript
 * const ratios = await calculateFinancialRatios(balanceSheet, incomeStatement);
 * ```
 */
export declare const calculateFinancialRatios: (balanceSheet: BalanceSheetData, incomeStatement: IncomeStatementData) => Promise<FinancialRatio[]>;
/**
 * Calculates liquidity ratios (current, quick, cash).
 *
 * @param {BalanceSheetData} balanceSheet - Balance sheet data
 * @returns {Promise<{ currentRatio: number; quickRatio: number; cashRatio: number }>} Liquidity ratios
 *
 * @example
 * ```typescript
 * const liquidity = await calculateLiquidityRatios(balanceSheet);
 * ```
 */
export declare const calculateLiquidityRatios: (balanceSheet: BalanceSheetData) => Promise<{
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
}>;
/**
 * Calculates leverage ratios (debt-to-equity, debt-to-assets).
 *
 * @param {BalanceSheetData} balanceSheet - Balance sheet data
 * @returns {Promise<{ debtToEquity: number; debtToAssets: number; equityMultiplier: number }>} Leverage ratios
 *
 * @example
 * ```typescript
 * const leverage = await calculateLeverageRatios(balanceSheet);
 * ```
 */
export declare const calculateLeverageRatios: (balanceSheet: BalanceSheetData) => Promise<{
    debtToEquity: number;
    debtToAssets: number;
    equityMultiplier: number;
}>;
/**
 * Calculates efficiency ratios (asset turnover, receivables turnover).
 *
 * @param {BalanceSheetData} balanceSheet - Balance sheet data
 * @param {IncomeStatementData} incomeStatement - Income statement data
 * @returns {Promise<{ assetTurnover: number; receivablesTurnover: number; inventoryTurnover: number }>} Efficiency ratios
 *
 * @example
 * ```typescript
 * const efficiency = await calculateEfficiencyRatios(balanceSheet, incomeStatement);
 * ```
 */
export declare const calculateEfficiencyRatios: (balanceSheet: BalanceSheetData, incomeStatement: IncomeStatementData) => Promise<{
    assetTurnover: number;
    receivablesTurnover: number;
    inventoryTurnover: number;
}>;
/**
 * Benchmarks ratios against industry standards.
 *
 * @param {FinancialRatio[]} ratios - Calculated ratios
 * @param {string} industryCode - Industry classification code
 * @returns {Promise<Array<{ ratio: string; value: number; benchmark: number; variance: number }>>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const comparison = await benchmarkRatios(ratios, 'NAICS-237310');
 * ```
 */
export declare const benchmarkRatios: (ratios: FinancialRatio[], industryCode: string) => Promise<Array<{
    ratio: string;
    value: number;
    benchmark: number;
    variance: number;
}>>;
/**
 * Calculates financial KPIs for organization.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} period - Reporting period
 * @param {string} organizationCode - Organization code
 * @returns {Promise<FinancialKPI[]>} Calculated KPIs
 *
 * @example
 * ```typescript
 * const kpis = await calculateFinancialKPIs(2025, 'Q1', 'USACE-NAD');
 * ```
 */
export declare const calculateFinancialKPIs: (fiscalYear: number, period: string, organizationCode: string) => Promise<FinancialKPI[]>;
/**
 * Tracks KPI performance over time.
 *
 * @param {string} kpiCode - KPI code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} numberOfPeriods - Number of periods to track
 * @returns {Promise<Array<{ period: string; value: number; target: number }>>} KPI history
 *
 * @example
 * ```typescript
 * const history = await trackKPIPerformance('BUDGET_EXEC_RATE', 2025, 4);
 * ```
 */
export declare const trackKPIPerformance: (kpiCode: string, fiscalYear: number, numberOfPeriods: number) => Promise<Array<{
    period: string;
    value: number;
    target: number;
}>>;
/**
 * Identifies KPIs that are off-target or at risk.
 *
 * @param {FinancialKPI[]} kpis - KPIs to analyze
 * @param {number} [thresholdPercent=10] - Threshold for at-risk determination
 * @returns {Promise<FinancialKPI[]>} At-risk KPIs
 *
 * @example
 * ```typescript
 * const atRiskKPIs = await identifyAtRiskKPIs(kpis, 15);
 * ```
 */
export declare const identifyAtRiskKPIs: (kpis: FinancialKPI[], thresholdPercent?: number) => Promise<FinancialKPI[]>;
/**
 * Generates KPI dashboard summary.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} period - Reporting period
 * @param {string} organizationCode - Organization code
 * @returns {Promise<object>} KPI dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateKPIDashboard(2025, 'Q1', 'USACE-NAD');
 * ```
 */
export declare const generateKPIDashboard: (fiscalYear: number, period: string, organizationCode: string) => Promise<any>;
/**
 * Exports KPI data to external format.
 *
 * @param {FinancialKPI[]} kpis - KPIs to export
 * @param {string} format - Export format
 * @returns {Promise<Buffer>} Exported KPI data
 *
 * @example
 * ```typescript
 * const excelBuffer = await exportKPIData(kpis, 'EXCEL');
 * ```
 */
export declare const exportKPIData: (kpis: FinancialKPI[], format: string) => Promise<Buffer>;
/**
 * Analyzes financial trends across multiple periods.
 *
 * @param {string} metric - Metric to analyze
 * @param {number} fiscalYear - Fiscal year
 * @param {number} numberOfPeriods - Number of periods to analyze
 * @param {string} organizationCode - Organization code
 * @returns {Promise<TrendAnalysis>} Trend analysis
 *
 * @example
 * ```typescript
 * const trend = await analyzeFinancialTrend('revenue', 2025, 8, 'USACE-NAD');
 * ```
 */
export declare const analyzeFinancialTrend: (metric: string, fiscalYear: number, numberOfPeriods: number, organizationCode: string) => Promise<TrendAnalysis>;
/**
 * Detects seasonal patterns in financial data.
 *
 * @param {string} metric - Metric to analyze
 * @param {number} numberOfYears - Years of historical data
 * @returns {Promise<{ seasonalityDetected: boolean; pattern: string; strength: number }>} Seasonality analysis
 *
 * @example
 * ```typescript
 * const seasonality = await detectSeasonalPatterns('revenue', 3);
 * ```
 */
export declare const detectSeasonalPatterns: (metric: string, numberOfYears: number) => Promise<{
    seasonalityDetected: boolean;
    pattern: string;
    strength: number;
}>;
/**
 * Forecasts financial metrics based on historical trends.
 *
 * @param {string} metric - Metric to forecast
 * @param {number} forecastPeriods - Number of periods to forecast
 * @param {object} [options] - Forecasting options
 * @returns {Promise<Array<{ period: string; forecast: number; confidence: number }>>} Forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastFinancialMetric('revenue', 6, { method: 'LINEAR_REGRESSION' });
 * ```
 */
export declare const forecastFinancialMetric: (metric: string, forecastPeriods: number, options?: any) => Promise<Array<{
    period: string;
    forecast: number;
    confidence: number;
}>>;
/**
 * Compares year-over-year financial performance.
 *
 * @param {number} currentYear - Current fiscal year
 * @param {number} priorYear - Prior fiscal year
 * @param {string} organizationCode - Organization code
 * @returns {Promise<object>} Year-over-year comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareYearOverYear(2025, 2024, 'USACE-NAD');
 * ```
 */
export declare const compareYearOverYear: (currentYear: number, priorYear: number, organizationCode: string) => Promise<any>;
/**
 * Identifies growth opportunities from trend analysis.
 *
 * @param {TrendAnalysis[]} trends - Trend analyses
 * @returns {Promise<Array<{ opportunity: string; metric: string; potential: number }>>} Identified opportunities
 *
 * @example
 * ```typescript
 * const opportunities = await identifyGrowthOpportunities(trends);
 * ```
 */
export declare const identifyGrowthOpportunities: (trends: TrendAnalysis[]) => Promise<Array<{
    opportunity: string;
    metric: string;
    potential: number;
}>>;
/**
 * Generates compliance report for regulatory requirements.
 *
 * @param {string} complianceType - Type of compliance report
 * @param {number} fiscalYear - Fiscal year
 * @param {string} organizationCode - Organization code
 * @returns {Promise<ComplianceReport>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport('GAAP', 2025, 'USACE-NAD');
 * ```
 */
export declare const generateComplianceReport: (complianceType: string, fiscalYear: number, organizationCode: string) => Promise<ComplianceReport>;
/**
 * Validates financial data against GAAP/GASB standards.
 *
 * @param {FinancialStatement} statement - Financial statement to validate
 * @param {string} standardType - Accounting standard ('GAAP' | 'GASB')
 * @returns {Promise<{ compliant: boolean; violations: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateAgainstStandards(statement, 'GAAP');
 * ```
 */
export declare const validateAgainstStandards: (statement: FinancialStatement, standardType: string) => Promise<{
    compliant: boolean;
    violations: string[];
    warnings: string[];
}>;
/**
 * Generates audit trail report for transactions.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {object} [filters] - Optional filters
 * @returns {Promise<AuditTrail[]>} Audit trail records
 *
 * @example
 * ```typescript
 * const auditTrail = await generateAuditTrailReport(new Date('2025-01-01'), new Date('2025-03-31'));
 * ```
 */
export declare const generateAuditTrailReport: (startDate: Date, endDate: Date, filters?: any) => Promise<AuditTrail[]>;
/**
 * Certifies financial report for compliance.
 *
 * @param {string} reportNumber - Report number
 * @param {string} certifierId - User certifying
 * @param {string} certificationStatement - Certification statement
 * @returns {Promise<object>} Certification record
 *
 * @example
 * ```typescript
 * const certification = await certifyFinancialReport('RPT-12345', 'cfo.johnson', 'I certify...');
 * ```
 */
export declare const certifyFinancialReport: (reportNumber: string, certifierId: string, certificationStatement: string) => Promise<any>;
/**
 * Exports compliance report in regulatory format.
 *
 * @param {ComplianceReport} report - Compliance report
 * @param {string} format - Export format
 * @returns {Promise<Buffer>} Exported compliance report
 *
 * @example
 * ```typescript
 * const pdfBuffer = await exportComplianceReport(report, 'PDF');
 * ```
 */
export declare const exportComplianceReport: (report: ComplianceReport, format: string) => Promise<Buffer>;
/**
 * Builds custom financial report based on user-defined parameters.
 *
 * @param {AnalyticsQuery} query - Custom report query
 * @returns {Promise<object>} Custom report data
 *
 * @example
 * ```typescript
 * const customReport = await buildCustomReport({
 *   queryName: 'Project Cost Analysis',
 *   dimensions: ['projectCode', 'costCenter'],
 *   metrics: ['totalCost', 'variance'],
 *   filters: [{ field: 'fiscalYear', operator: '=', value: 2025 }]
 * });
 * ```
 */
export declare const buildCustomReport: (query: AnalyticsQuery) => Promise<any>;
/**
 * Saves custom report template for reuse.
 *
 * @param {AnalyticsQuery} query - Report query template
 * @param {string} userId - User saving template
 * @returns {Promise<object>} Saved template
 *
 * @example
 * ```typescript
 * const template = await saveReportTemplate(query, 'user.id');
 * ```
 */
export declare const saveReportTemplate: (query: AnalyticsQuery, userId: string) => Promise<any>;
/**
 * Executes saved report template.
 *
 * @param {string} templateId - Template ID
 * @param {object} [parameterOverrides] - Parameter overrides
 * @returns {Promise<object>} Report execution result
 *
 * @example
 * ```typescript
 * const result = await executeReportTemplate('TMPL-12345', { fiscalYear: 2025 });
 * ```
 */
export declare const executeReportTemplate: (templateId: string, parameterOverrides?: any) => Promise<any>;
/**
 * Schedules automated report generation and distribution.
 *
 * @param {ReportSchedule} schedule - Report schedule configuration
 * @returns {Promise<object>} Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await scheduleAutomatedReport({
 *   reportType: 'BUDGET_STATUS',
 *   frequency: 'MONTHLY',
 *   recipients: ['cfo@agency.gov']
 * });
 * ```
 */
export declare const scheduleAutomatedReport: (schedule: Partial<ReportSchedule>) => Promise<any>;
/**
 * Manages report distribution lists.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string[]} recipients - Recipients to add
 * @param {'ADD' | 'REMOVE'} action - Action to perform
 * @returns {Promise<object>} Updated distribution list
 *
 * @example
 * ```typescript
 * const updated = await manageReportDistribution('SCH-12345', ['new@agency.gov'], 'ADD');
 * ```
 */
export declare const manageReportDistribution: (scheduleId: string, recipients: string[], action: "ADD" | "REMOVE") => Promise<any>;
/**
 * Generates executive financial dashboard.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} period - Reporting period
 * @param {string} organizationCode - Organization code
 * @returns {Promise<object>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateExecutiveDashboard(2025, 'Q1', 'USACE-NAD');
 * ```
 */
export declare const generateExecutiveDashboard: (fiscalYear: number, period: string, organizationCode: string) => Promise<any>;
/**
 * Creates customizable dashboard widgets.
 *
 * @param {DashboardWidget} widget - Widget configuration
 * @returns {Promise<object>} Created widget
 *
 * @example
 * ```typescript
 * const widget = await createDashboardWidget({
 *   widgetType: 'CHART',
 *   title: 'Budget Execution Trend',
 *   dataSource: 'budget_metrics'
 * });
 * ```
 */
export declare const createDashboardWidget: (widget: Partial<DashboardWidget>) => Promise<any>;
/**
 * Generates real-time financial metrics for dashboard.
 *
 * @param {string[]} metricCodes - Metric codes to retrieve
 * @param {string} organizationCode - Organization code
 * @returns {Promise<Array<{ code: string; value: number; timestamp: Date }>>} Real-time metrics
 *
 * @example
 * ```typescript
 * const metrics = await generateRealTimeMetrics(['CASH_BALANCE', 'DAILY_REVENUE'], 'USACE-NAD');
 * ```
 */
export declare const generateRealTimeMetrics: (metricCodes: string[], organizationCode: string) => Promise<Array<{
    code: string;
    value: number;
    timestamp: Date;
}>>;
/**
 * Exports dashboard data for external visualization tools.
 *
 * @param {object} dashboardData - Dashboard data
 * @param {string} format - Export format
 * @returns {Promise<Buffer>} Exported dashboard data
 *
 * @example
 * ```typescript
 * const jsonBuffer = await exportDashboardData(dashboard, 'JSON');
 * ```
 */
export declare const exportDashboardData: (dashboardData: any, format: string) => Promise<Buffer>;
/**
 * Archives historical financial reports for long-term storage.
 *
 * @param {number} fiscalYear - Fiscal year to archive
 * @param {string} [organizationCode] - Optional organization filter
 * @returns {Promise<{ archived: number; totalSize: number }>} Archive result
 *
 * @example
 * ```typescript
 * const result = await archiveHistoricalReports(2020);
 * console.log(`Archived ${result.archived} reports`);
 * ```
 */
export declare const archiveHistoricalReports: (fiscalYear: number, organizationCode?: string) => Promise<{
    archived: number;
    totalSize: number;
}>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createFinancialReportModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            reportNumber: string;
            reportType: string;
            reportName: string;
            fiscalYear: number;
            period: string;
            asOfDate: Date;
            organizationCode: string;
            organizationName: string;
            currency: string;
            reportData: Record<string, any>;
            status: string;
            version: number;
            previousVersion: number | null;
            preparedBy: string;
            reviewedBy: string | null;
            approvedBy: string | null;
            reviewedAt: Date | null;
            approvedAt: Date | null;
            publishedAt: Date | null;
            notes: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createFinancialKPIModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            kpiCode: string;
            kpiName: string;
            kpiCategory: string;
            description: string;
            calculationFormula: string;
            fiscalYear: number;
            period: string;
            organizationCode: string;
            targetValue: number;
            actualValue: number;
            unit: string;
            status: string;
            trend: string;
            varianceAmount: number;
            variancePercent: number;
            thresholds: Record<string, any>;
            dataSource: string;
            calculatedAt: Date;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createReportScheduleModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            scheduleId: string;
            scheduleName: string;
            reportType: string;
            reportParameters: Record<string, any>;
            frequency: string;
            dayOfWeek: number | null;
            dayOfMonth: number | null;
            timeOfDay: string;
            timezone: string;
            format: string;
            recipients: string[];
            ccRecipients: string[];
            subject: string | null;
            message: string | null;
            enabled: boolean;
            lastRun: Date | null;
            nextRun: Date | null;
            lastStatus: string | null;
            runCount: number;
            createdBy: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    generateBalanceSheet: (fiscalYear: number, period: string, organizationCode: string, asOfDate: Date) => Promise<BalanceSheetData>;
    calculateTrialBalance: (asOfDate: Date, organizationCode?: string) => Promise<Array<{
        accountCode: string;
        accountName: string;
        debit: number;
        credit: number;
    }>>;
    validateBalanceSheet: (balanceSheet: BalanceSheetData) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    generateComparativeBalanceSheet: (fiscalYear: number, periods: string[], organizationCode: string) => Promise<Array<{
        period: string;
        data: BalanceSheetData;
    }>>;
    exportBalanceSheet: (balanceSheet: BalanceSheetData, format: string, options?: any) => Promise<Buffer>;
    generateIncomeStatement: (fiscalYear: number, period: string, organizationCode: string) => Promise<IncomeStatementData>;
    calculateRevenueByCategory: (fiscalYear: number, period: string, organizationCode?: string) => Promise<Array<{
        category: string;
        source: string;
        amount: number;
    }>>;
    calculateExpenseByCategory: (fiscalYear: number, period: string, organizationCode?: string) => Promise<Array<{
        category: string;
        function: string;
        amount: number;
    }>>;
    calculateProfitabilityMetrics: (incomeStatement: IncomeStatementData) => Promise<{
        grossMargin: number;
        operatingMargin: number;
        netMargin: number;
        roe: number;
    }>;
    generateComparativeIncomeStatement: (fiscalYear: number, periods: string[], organizationCode: string) => Promise<Array<{
        period: string;
        data: IncomeStatementData;
    }>>;
    generateCashFlowStatement: (fiscalYear: number, period: string, organizationCode: string) => Promise<CashFlowData>;
    analyzeCashFlowTrends: (fiscalYear: number, lookbackPeriods: number, organizationCode: string) => Promise<{
        trend: string;
        averageCashFlow: number;
        volatility: number;
    }>;
    forecastCashFlow: (fiscalYear: number, forecastPeriods: number, organizationCode: string) => Promise<Array<{
        period: string;
        projectedCashFlow: number;
        confidence: number;
    }>>;
    calculateCashConversionCycle: (fiscalYear: number, period: string, organizationCode: string) => Promise<{
        daysSalesOutstanding: number;
        daysPayableOutstanding: number;
        cashConversionCycle: number;
    }>;
    identifyCashFlowAnomalies: (cashFlow: CashFlowData, thresholds?: any) => Promise<Array<{
        type: string;
        severity: string;
        description: string;
    }>>;
    calculateFinancialRatios: (balanceSheet: BalanceSheetData, incomeStatement: IncomeStatementData) => Promise<FinancialRatio[]>;
    calculateLiquidityRatios: (balanceSheet: BalanceSheetData) => Promise<{
        currentRatio: number;
        quickRatio: number;
        cashRatio: number;
    }>;
    calculateLeverageRatios: (balanceSheet: BalanceSheetData) => Promise<{
        debtToEquity: number;
        debtToAssets: number;
        equityMultiplier: number;
    }>;
    calculateEfficiencyRatios: (balanceSheet: BalanceSheetData, incomeStatement: IncomeStatementData) => Promise<{
        assetTurnover: number;
        receivablesTurnover: number;
        inventoryTurnover: number;
    }>;
    benchmarkRatios: (ratios: FinancialRatio[], industryCode: string) => Promise<Array<{
        ratio: string;
        value: number;
        benchmark: number;
        variance: number;
    }>>;
    calculateFinancialKPIs: (fiscalYear: number, period: string, organizationCode: string) => Promise<FinancialKPI[]>;
    trackKPIPerformance: (kpiCode: string, fiscalYear: number, numberOfPeriods: number) => Promise<Array<{
        period: string;
        value: number;
        target: number;
    }>>;
    identifyAtRiskKPIs: (kpis: FinancialKPI[], thresholdPercent?: number) => Promise<FinancialKPI[]>;
    generateKPIDashboard: (fiscalYear: number, period: string, organizationCode: string) => Promise<any>;
    exportKPIData: (kpis: FinancialKPI[], format: string) => Promise<Buffer>;
    analyzeFinancialTrend: (metric: string, fiscalYear: number, numberOfPeriods: number, organizationCode: string) => Promise<TrendAnalysis>;
    detectSeasonalPatterns: (metric: string, numberOfYears: number) => Promise<{
        seasonalityDetected: boolean;
        pattern: string;
        strength: number;
    }>;
    forecastFinancialMetric: (metric: string, forecastPeriods: number, options?: any) => Promise<Array<{
        period: string;
        forecast: number;
        confidence: number;
    }>>;
    compareYearOverYear: (currentYear: number, priorYear: number, organizationCode: string) => Promise<any>;
    identifyGrowthOpportunities: (trends: TrendAnalysis[]) => Promise<Array<{
        opportunity: string;
        metric: string;
        potential: number;
    }>>;
    generateComplianceReport: (complianceType: string, fiscalYear: number, organizationCode: string) => Promise<ComplianceReport>;
    validateAgainstStandards: (statement: FinancialStatement, standardType: string) => Promise<{
        compliant: boolean;
        violations: string[];
        warnings: string[];
    }>;
    generateAuditTrailReport: (startDate: Date, endDate: Date, filters?: any) => Promise<AuditTrail[]>;
    certifyFinancialReport: (reportNumber: string, certifierId: string, certificationStatement: string) => Promise<any>;
    exportComplianceReport: (report: ComplianceReport, format: string) => Promise<Buffer>;
    buildCustomReport: (query: AnalyticsQuery) => Promise<any>;
    saveReportTemplate: (query: AnalyticsQuery, userId: string) => Promise<any>;
    executeReportTemplate: (templateId: string, parameterOverrides?: any) => Promise<any>;
    scheduleAutomatedReport: (schedule: Partial<ReportSchedule>) => Promise<any>;
    manageReportDistribution: (scheduleId: string, recipients: string[], action: "ADD" | "REMOVE") => Promise<any>;
    generateExecutiveDashboard: (fiscalYear: number, period: string, organizationCode: string) => Promise<any>;
    createDashboardWidget: (widget: Partial<DashboardWidget>) => Promise<any>;
    generateRealTimeMetrics: (metricCodes: string[], organizationCode: string) => Promise<Array<{
        code: string;
        value: number;
        timestamp: Date;
    }>>;
    exportDashboardData: (dashboardData: any, format: string) => Promise<Buffer>;
    archiveHistoricalReports: (fiscalYear: number, organizationCode?: string) => Promise<{
        archived: number;
        totalSize: number;
    }>;
};
export default _default;
//# sourceMappingURL=financial-reporting-analytics-kit.d.ts.map