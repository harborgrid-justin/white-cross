/**
 * LOC: FRPTCMP001
 * File: /reuse/edwards/financial/composites/financial-reporting-analytics-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../financial-reporting-analytics-kit
 *   - ../budget-management-control-kit
 *   - ../financial-close-automation-kit
 *   - ../dimension-management-kit
 *   - ../intercompany-accounting-kit
 *
 * DOWNSTREAM (imported by):
 *   - Financial reporting REST API controllers
 *   - Executive dashboard services
 *   - Management reporting services
 *   - KPI monitoring services
 *   - Consolidation services
 */
import { type BalanceSheetReport, type IncomeStatementReport, type CashFlowStatement, type TrialBalance, type ConsolidatedReport, type SegmentReport, type FinancialKPI, type FinancialRatio, type VarianceAnalysis, type FinancialDashboard, type ReportDrillDown, type XBRLExport, type ManagementReport, type ReportSchedule, type ComparativeReport, type TrendAnalysis } from '../financial-reporting-analytics-kit';
import { type BudgetVariance, type BudgetPerformance } from '../budget-management-control-kit';
import { type CloseChecklist, type CloseReport, type ClosingAdjustment } from '../financial-close-automation-kit';
import { type DimensionHierarchy, type DimensionAnalysis } from '../dimension-management-kit';
import { type IntercompanyTransaction, type IntercompanyElimination, type IntercompanyReport } from '../intercompany-accounting-kit';
import { type AuditEntry } from '../audit-trail-compliance-kit';
/**
 * Financial reporting API configuration
 */
export interface ReportingApiConfig {
    baseUrl: string;
    enableRealtimeReporting: boolean;
    enableConsolidation: boolean;
    enableXBRLExport: boolean;
    defaultReportingCurrency: string;
    fiscalYearEnd: Date;
}
/**
 * Comprehensive financial package
 */
export interface ComprehensiveFinancialPackage {
    balanceSheet: BalanceSheetReport;
    incomeStatement: IncomeStatementReport;
    cashFlow: CashFlowStatement;
    trialBalance: TrialBalance;
    kpis: FinancialKPI[];
    ratios: FinancialRatio[];
    variance: VarianceAnalysis;
    metadata: ReportMetadata;
}
/**
 * Report metadata
 */
export interface ReportMetadata {
    reportDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    entityId: number;
    entityName: string;
    generatedBy: string;
    generatedAt: Date;
    reportType: string;
    currency: string;
}
/**
 * Dashboard configuration
 */
export interface DashboardConfig {
    dashboardId: string;
    dashboardName: string;
    widgets: DashboardWidget[];
    refreshInterval: number;
    filters: DashboardFilter[];
    permissions: string[];
}
/**
 * Dashboard widget
 */
export interface DashboardWidget {
    widgetId: string;
    widgetType: 'kpi' | 'chart' | 'table' | 'gauge' | 'trend';
    title: string;
    dataSource: string;
    configuration: any;
    position: {
        row: number;
        col: number;
        width: number;
        height: number;
    };
}
/**
 * Dashboard filter
 */
export interface DashboardFilter {
    filterId: string;
    filterName: string;
    filterType: 'date' | 'entity' | 'dimension' | 'account';
    defaultValue: any;
    options: any[];
}
/**
 * Consolidation request
 */
export interface ConsolidationRequest {
    parentEntityId: number;
    childEntityIds: number[];
    consolidationType: 'full' | 'proportional' | 'equity';
    eliminateIntercompany: boolean;
    fiscalYear: number;
    fiscalPeriod: number;
    reportingCurrency: string;
}
/**
 * KPI alert configuration
 */
export interface KPIAlertConfig {
    kpiId: string;
    kpiName: string;
    threshold: number;
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
    severity: 'info' | 'warning' | 'critical';
    recipients: string[];
    enabled: boolean;
}
/**
 * KPI alert
 */
export interface KPIAlert {
    alertId: string;
    kpiId: string;
    kpiName: string;
    currentValue: number;
    threshold: number;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    timestamp: Date;
}
/**
 * Generates comprehensive financial package with all statements
 * Composes: generateBalanceSheet, generateIncomeStatement, generateCashFlowStatement, calculateFinancialKPI
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @param userId - User generating package
 * @returns Complete financial reporting package
 */
export declare const generateComprehensiveFinancialPackage: (entityId: number, fiscalYear: number, fiscalPeriod: number, userId: string) => Promise<ComprehensiveFinancialPackage>;
/**
 * Generates balance sheet with drill-down capabilities
 * Composes: generateBalanceSheet, createReportDrillDown, validateFinancialReport
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @param userId - User generating report
 * @returns Balance sheet with drill-down links
 */
export declare const generateBalanceSheetWithDrillDown: (entityId: number, fiscalYear: number, userId: string) => Promise<{
    balanceSheet: BalanceSheetReport;
    drillDown: ReportDrillDown;
    validation: boolean;
    audit: AuditEntry;
}>;
/**
 * Generates income statement with budget comparison
 * Composes: generateIncomeStatement, compareBudgetToActual, calculateBudgetVariance
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Income statement with budget variance
 */
export declare const generateIncomeStatementWithBudgetComparison: (entityId: number, fiscalYear: number, fiscalPeriod: number) => Promise<{
    incomeStatement: IncomeStatementReport;
    budgetComparison: any;
    variance: BudgetVariance;
}>;
/**
 * Generates cash flow statement with multiple methods
 * Composes: generateCashFlowStatement with direct and indirect methods
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @param method - Cash flow method
 * @returns Cash flow statement
 */
export declare const generateCashFlowStatementMultiMethod: (entityId: number, fiscalYear: number, method: "direct" | "indirect" | "both") => Promise<{
    directMethod?: CashFlowStatement;
    indirectMethod?: CashFlowStatement;
    reconciliation?: any;
}>;
/**
 * Generates trial balance with adjustments
 * Composes: generateTrialBalance, calculateClosingAdjustments, validateCloseChecklist
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @param includeAdjustments - Include closing adjustments
 * @returns Trial balance with optional adjustments
 */
export declare const generateTrialBalanceWithAdjustments: (entityId: number, fiscalYear: number, fiscalPeriod: number, includeAdjustments?: boolean) => Promise<{
    trialBalance: TrialBalance;
    adjustments?: ClosingAdjustment[];
    adjustedBalance?: TrialBalance;
}>;
/**
 * Generates consolidated financial statements with eliminations
 * Composes: generateConsolidatedReport, calculateIntercompanyEliminations, validateIntercompanyBalance
 *
 * @param request - Consolidation request
 * @param userId - User generating consolidation
 * @returns Consolidated financial statements
 */
export declare const generateConsolidatedFinancialsWithEliminations: (request: ConsolidationRequest, userId: string) => Promise<{
    consolidated: ConsolidatedReport;
    eliminations: IntercompanyElimination[];
    intercompanyReport: IntercompanyReport;
    audit: AuditEntry;
}>;
/**
 * Validates consolidation with detailed checks
 * Composes: validateIntercompanyBalance, calculateIntercompanyEliminations, getIntercompanyTransactions
 *
 * @param parentEntityId - Parent entity identifier
 * @param childEntityIds - Child entity identifiers
 * @returns Consolidation validation result
 */
export declare const validateConsolidationIntegrity: (parentEntityId: number, childEntityIds: number[]) => Promise<{
    valid: boolean;
    intercompanyBalanced: boolean;
    transactions: IntercompanyTransaction[];
    issues: string[];
}>;
/**
 * Generates multi-level consolidation
 * Composes: generateConsolidatedReport recursively for multiple levels
 *
 * @param topEntityId - Top-level entity
 * @param hierarchyLevels - Consolidation hierarchy
 * @param fiscalYear - Fiscal year
 * @returns Multi-level consolidated report
 */
export declare const generateMultiLevelConsolidation: (topEntityId: number, hierarchyLevels: number[][], fiscalYear: number) => Promise<{
    consolidated: ConsolidatedReport[];
    totalConsolidated: ConsolidatedReport;
}>;
/**
 * Generates segment report with dimensional analysis
 * Composes: generateSegmentReport, getDimensionHierarchy, analyzeDimensionPerformance
 *
 * @param entityId - Entity identifier
 * @param segmentDimension - Segment dimension
 * @param fiscalYear - Fiscal year
 * @returns Segment report with dimensional analysis
 */
export declare const generateSegmentReportWithDimensionalAnalysis: (entityId: number, segmentDimension: string, fiscalYear: number) => Promise<{
    segmentReport: SegmentReport;
    dimensionHierarchy: DimensionHierarchy;
    dimensionAnalysis: DimensionAnalysis;
}>;
/**
 * Generates multi-dimensional report
 * Composes: aggregateByDimension for multiple dimensions
 *
 * @param entityId - Entity identifier
 * @param dimensions - Dimensions to analyze
 * @param fiscalYear - Fiscal year
 * @returns Multi-dimensional analysis
 */
export declare const generateMultiDimensionalReport: (entityId: number, dimensions: string[], fiscalYear: number) => Promise<{
    dimensionReports: Record<string, any>;
    crossDimensionalAnalysis: any;
}>;
/**
 * Generates comprehensive financial dashboard
 * Composes: generateFinancialDashboard, calculateFinancialKPI, calculateFinancialRatios
 *
 * @param config - Dashboard configuration
 * @param entityId - Entity identifier
 * @returns Financial dashboard with KPIs
 */
export declare const generateComprehensiveFinancialDashboard: (config: DashboardConfig, entityId: number) => Promise<{
    dashboard: FinancialDashboard;
    kpis: FinancialKPI[];
    ratios: FinancialRatio[];
    alerts: KPIAlert[];
}>;
/**
 * Calculates and monitors KPIs with alerts
 * Composes: calculateFinancialKPI with alert generation
 *
 * @param entityId - Entity identifier
 * @param kpiIds - KPI identifiers
 * @param alertConfigs - Alert configurations
 * @returns KPIs with alerts
 */
export declare const calculateKPIsWithAlerts: (entityId: number, kpiIds: string[], alertConfigs: KPIAlertConfig[]) => Promise<{
    kpis: FinancialKPI[];
    alerts: KPIAlert[];
}>;
/**
 * Calculates financial ratios with trend analysis
 * Composes: calculateFinancialRatios, calculateTrendAnalysis
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @param periods - Number of periods for trend
 * @returns Financial ratios with trends
 */
export declare const calculateFinancialRatiosWithTrends: (entityId: number, fiscalYear: number, periods?: number) => Promise<{
    ratios: FinancialRatio[];
    trends: TrendAnalysis[];
}>;
/**
 * Analyzes comprehensive variance with drill-down
 * Composes: analyzeVariance, calculateBudgetVariance, createReportDrillDown
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Variance analysis with drill-down
 */
export declare const analyzeComprehensiveVariance: (entityId: number, fiscalYear: number, fiscalPeriod: number) => Promise<{
    variance: VarianceAnalysis;
    budgetVariance: BudgetVariance;
    drillDown: ReportDrillDown;
}>;
/**
 * Analyzes budget performance with recommendations
 * Composes: analyzeBudgetPerformance, calculateBudgetVariance, generateBudgetReport
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @returns Budget performance analysis
 */
export declare const analyzeBudgetPerformanceWithRecommendations: (entityId: number, fiscalYear: number) => Promise<{
    performance: BudgetPerformance;
    variance: BudgetVariance;
    report: any;
    recommendations: string[];
}>;
/**
 * Generates comparative financial analysis
 * Composes: generateComparativeReport, calculateTrendAnalysis
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @param comparisonYears - Years to compare
 * @returns Comparative analysis
 */
export declare const generateComparativeFinancialAnalysis: (entityId: number, fiscalYear: number, comparisonYears: number[]) => Promise<{
    comparative: ComparativeReport;
    trends: TrendAnalysis[];
    insights: string[];
}>;
/**
 * Generates executive management report package
 * Composes: generateManagementReport, calculateFinancialKPI, generateFootnotes
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @param reportType - Report type
 * @returns Executive report package
 */
export declare const generateExecutiveReportPackage: (entityId: number, fiscalYear: number, reportType: "monthly" | "quarterly" | "annual") => Promise<{
    managementReport: ManagementReport;
    kpis: FinancialKPI[];
    footnotes: any[];
    executiveSummary: string;
}>;
/**
 * Creates custom financial report
 * Composes: createCustomReport, validateFinancialReport, publishFinancialReport
 *
 * @param reportConfig - Report configuration
 * @param userId - User creating report
 * @returns Custom report
 */
export declare const createAndPublishCustomReport: (reportConfig: any, userId: string) => Promise<{
    report: any;
    validation: boolean;
    published: boolean;
    audit: AuditEntry;
}>;
/**
 * Schedules automated report generation
 * Composes: scheduleReportGeneration with recurring schedule
 *
 * @param reportType - Report type
 * @param entityId - Entity identifier
 * @param schedule - Schedule configuration
 * @param userId - User scheduling report
 * @returns Schedule confirmation
 */
export declare const scheduleAutomatedReportGeneration: (reportType: string, entityId: number, schedule: any, userId: string) => Promise<{
    schedule: ReportSchedule;
    nextRun: Date;
    audit: AuditEntry;
}>;
/**
 * Exports financial statements to XBRL format
 * Composes: exportToXBRL, validateFinancialReport, generateFootnotes
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @param reportType - Report type
 * @returns XBRL export
 */
export declare const exportFinancialStatementsToXBRL: (entityId: number, fiscalYear: number, reportType: "balance_sheet" | "income_statement" | "cash_flow" | "all") => Promise<{
    xbrl: XBRLExport;
    validation: boolean;
    fileSize: number;
}>;
/**
 * Exports financial package to multiple formats
 * Composes: Multiple export functions
 *
 * @param packageData - Financial package data
 * @param formats - Export formats
 * @returns Multi-format exports
 */
export declare const exportFinancialPackageMultiFormat: (packageData: ComprehensiveFinancialPackage, formats: ("pdf" | "excel" | "xbrl" | "json")[]) => Promise<{
    exports: Record<string, any>;
    totalSize: number;
}>;
/**
 * Generates financial reports for period close
 * Composes: generateFinancialPackage, executeCloseProcedure, validateCloseChecklist
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @param userId - User closing period
 * @returns Close reports
 */
export declare const generatePeriodCloseReports: (entityId: number, fiscalYear: number, fiscalPeriod: number, userId: string) => Promise<{
    financialPackage: ComprehensiveFinancialPackage;
    closeReport: CloseReport;
    checklist: CloseChecklist;
    audit: AuditEntry;
}>;
/**
 * Validates financial reports before close
 * Composes: validateFinancialReport, validateCloseChecklist, validateIntercompanyBalance
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Validation results
 */
export declare const validateFinancialReportsBeforeClose: (entityId: number, fiscalYear: number, fiscalPeriod: number) => Promise<{
    financialValid: boolean;
    checklistComplete: boolean;
    intercompanyBalanced: boolean;
    issues: string[];
    canClose: boolean;
}>;
/**
 * Analyzes financial trends with forecasting
 * Composes: calculateTrendAnalysis, generateComparativeReport
 *
 * @param entityId - Entity identifier
 * @param metricName - Metric to analyze
 * @param periods - Historical periods
 * @param forecastPeriods - Periods to forecast
 * @returns Trend analysis with forecast
 */
export declare const analyzeFinancialTrendsWithForecast: (entityId: number, metricName: string, periods: number, forecastPeriods?: number) => Promise<{
    trend: TrendAnalysis;
    forecast: any[];
    confidence: number;
}>;
/**
 * Generates what-if scenario analysis
 * Composes: Multiple scenario calculations
 *
 * @param entityId - Entity identifier
 * @param baseScenario - Base scenario data
 * @param scenarios - Alternative scenarios
 * @returns Scenario analysis
 */
export declare const generateWhatIfScenarioAnalysis: (entityId: number, baseScenario: any, scenarios: any[]) => Promise<{
    baseResults: any;
    scenarioResults: any[];
    comparison: any;
}>;
export { generateComprehensiveFinancialPackage, generateBalanceSheetWithDrillDown, generateIncomeStatementWithBudgetComparison, generateCashFlowStatementMultiMethod, generateTrialBalanceWithAdjustments, generateConsolidatedFinancialsWithEliminations, validateConsolidationIntegrity, generateMultiLevelConsolidation, generateSegmentReportWithDimensionalAnalysis, generateMultiDimensionalReport, generateComprehensiveFinancialDashboard, calculateKPIsWithAlerts, calculateFinancialRatiosWithTrends, analyzeComprehensiveVariance, analyzeBudgetPerformanceWithRecommendations, generateComparativeFinancialAnalysis, generateExecutiveReportPackage, createAndPublishCustomReport, scheduleAutomatedReportGeneration, exportFinancialStatementsToXBRL, exportFinancialPackageMultiFormat, generatePeriodCloseReports, validateFinancialReportsBeforeClose, analyzeFinancialTrendsWithForecast, generateWhatIfScenarioAnalysis, type ReportingApiConfig, type ComprehensiveFinancialPackage, type ReportMetadata, type DashboardConfig, type DashboardWidget, type DashboardFilter, type ConsolidationRequest, type KPIAlertConfig, type KPIAlert, };
//# sourceMappingURL=financial-reporting-analytics-composite.d.ts.map