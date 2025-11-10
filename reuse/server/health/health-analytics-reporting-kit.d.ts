/**
 * LOC: HEALTHREP001
 * File: /reuse/server/health/health-analytics-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/cqrs
 *   - date-fns
 *   - decimal.js
 *   - lodash
 *   - xlsx
 *   - pdfkit
 *
 * DOWNSTREAM (imported by):
 *   - Analytics services
 *   - Reporting controllers
 *   - Dashboard APIs
 *   - BI integration services
 *   - Export processors
 */
/**
 * File: /reuse/server/health/health-analytics-reporting-kit.ts
 * Locator: WC-UTL-HEALTHREP-001
 * Purpose: Healthcare Analytics & Reporting Utilities Kit - Enterprise-grade analytics, dashboards, and reporting
 *
 * Upstream: Independent utility module for healthcare analytics operations
 * Downstream: ../backend/*, Analytics controllers, Reporting services, Dashboard APIs, BI Tools
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/cqrs, date-fns, decimal.js, xlsx, pdfkit
 * Exports: 48 utility functions for clinical analytics, dashboards, financial reporting, quality measures,
 * provider productivity, patient volume, revenue analytics, variance analysis, predictive analytics,
 * alerting, custom reports, data warehouse queries, and export/BI integration
 *
 * LLM Context: Production-grade healthcare analytics utilities for White Cross clinical platform.
 * Provides comprehensive clinical analytics engine with quality measures, operational dashboards
 * with KPI tracking, financial reporting with revenue/variance analysis, provider productivity metrics,
 * patient volume and utilization analytics, advanced variance and predictive analytics, custom report
 * builders, data warehouse query optimization, real-time alerting systems, and multi-format export
 * capabilities (Excel, PDF, CSV) with BI tool integration (Tableau, PowerBI) for HIPAA-compliant
 * enterprise healthcare reporting and business intelligence.
 */
/**
 * Clinical analytics query parameters
 */
export interface ClinicalAnalyticsQuery {
    startDate: Date;
    endDate: Date;
    departments?: string[];
    providers?: string[];
    patientSegments?: string[];
    measures?: string[];
    granularity?: 'hourly' | 'daily' | 'weekly' | 'monthly';
    includeComparison?: boolean;
}
/**
 * Clinical quality measure result
 */
export interface QualityMeasureResult {
    measureId: string;
    measureName: string;
    numerator: number;
    denominator: number;
    performanceRate: number;
    benchmark: number;
    variance: number;
    trend: 'improving' | 'declining' | 'stable';
    attribution: string[];
}
/**
 * Operational dashboard metrics
 */
export interface DashboardMetrics {
    timestamp: Date;
    kpis: Record<string, number>;
    alerts: AlertEvent[];
    departmentMetrics: DepartmentMetric[];
    trends: TrendData[];
}
/**
 * Financial reporting data
 */
export interface FinancialReportData {
    periodStart: Date;
    periodEnd: Date;
    totalRevenue: number;
    totalCosts: number;
    netIncome: number;
    departmentBreakdown: DepartmentFinancial[];
    lineItems: LineItemFinancial[];
    variance: VarianceAnalysis;
}
/**
 * Department financial metrics
 */
export interface DepartmentFinancial {
    departmentId: string;
    departmentName: string;
    revenue: number;
    costs: number;
    margin: number;
    caseCount: number;
    caseWeightedRVU: number;
}
/**
 * Line item financial data
 */
export interface LineItemFinancial {
    code: string;
    description: string;
    units: number;
    unitPrice: number;
    totalAmount: number;
    variance: number;
}
/**
 * Variance analysis result
 */
export interface VarianceAnalysis {
    totalVariance: number;
    variancePercent: number;
    favorableVariance: number;
    unfavorableVariance: number;
    byCategory: VarianceCategory[];
}
/**
 * Variance by category
 */
export interface VarianceCategory {
    category: string;
    budgeted: number;
    actual: number;
    variance: number;
    variancePercent: number;
}
/**
 * Provider productivity metrics
 */
export interface ProviderProductivity {
    providerId: string;
    providerName: string;
    specialty: string;
    patientsSeenDaily: number;
    patientsSeenMonthly: number;
    averagePatientTime: number;
    rvu: number;
    rvu_per_hour: number;
    collections: number;
    adjustments: number;
    netRevenue: number;
    utilizationRate: number;
    qualityScore: number;
}
/**
 * Patient volume analytics
 */
export interface PatientVolumeAnalytics {
    period: string;
    totalPatients: number;
    newPatients: number;
    returningPatients: number;
    volumeByDepartment: VolumeMetric[];
    volumeByProvider: VolumeMetric[];
    volumeTrend: TrendPoint[];
    readmissionRate: number;
    noShowRate: number;
}
/**
 * Volume metric
 */
export interface VolumeMetric {
    category: string;
    volume: number;
    percentOfTotal: number;
    trend: number;
}
/**
 * Trend data point
 */
export interface TrendPoint {
    timestamp: Date;
    value: number;
    target?: number;
    actual?: number;
}
/**
 * Alert event
 */
export interface AlertEvent {
    alertId: string;
    alertType: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    message: string;
    triggeredAt: Date;
    metric: string;
    currentValue: number;
    threshold: number;
    status: 'active' | 'acknowledged' | 'resolved';
}
/**
 * Department metric
 */
export interface DepartmentMetric {
    departmentId: string;
    departmentName: string;
    census: number;
    admissions: number;
    discharges: number;
    occupancyRate: number;
    averageLengthOfStay: number;
    mortality: number;
    readmissionRate: number;
}
/**
 * Predictive analytics forecast
 */
export interface PredictiveAnalyticsForecast {
    metric: string;
    forecastType: 'volume' | 'revenue' | 'quality' | 'resource';
    periodStart: Date;
    periodEnd: Date;
    forecastPoints: ForecastPoint[];
    confidence: number;
    mape: number;
}
/**
 * Forecast point
 */
export interface ForecastPoint {
    timestamp: Date;
    predicted: number;
    lower_bound: number;
    upper_bound: number;
    actual?: number;
}
/**
 * Custom report definition
 */
export interface CustomReportDefinition {
    reportId: string;
    reportName: string;
    description: string;
    dataSource: string;
    metrics: string[];
    dimensions: string[];
    filters: ReportFilter[];
    sorting: SortOrder[];
    grouping?: string[];
    schedule?: ReportSchedule;
}
/**
 * Report filter
 */
export interface ReportFilter {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between';
    value: any;
}
/**
 * Sort order
 */
export interface SortOrder {
    field: string;
    direction: 'asc' | 'desc';
}
/**
 * Report schedule
 */
export interface ReportSchedule {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time?: string;
}
/**
 * Export result
 */
export interface ExportResult {
    exportId: string;
    format: 'excel' | 'pdf' | 'csv';
    filename: string;
    fileSize: number;
    downloadUrl: string;
    generatedAt: Date;
    expiresAt: Date;
}
/**
 * BI integration configuration
 */
export interface BIIntegrationConfig {
    platform: 'tableau' | 'powerbi' | 'looker' | 'sisense';
    endpoint: string;
    apiKey: string;
    datasetId: string;
    refreshInterval?: number;
}
/**
 * 1. Computes comprehensive clinical quality measures with benchmarking.
 *
 * @param {ClinicalAnalyticsQuery} query - Analytics query parameters
 * @param {any} clinicalData - Patient clinical dataset
 * @returns {QualityMeasureResult[]} Array of quality measure results
 *
 * @example
 * ```typescript
 * const measures = calculateQualityMeasures({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   departments: ['cardiology', 'orthopedics'],
 *   measures: ['mortality_30day', 'readmission_30day', 'hip_fracture_surgery_safety']
 * }, clinicalDataset);
 * ```
 */
export declare function calculateQualityMeasures(query: ClinicalAnalyticsQuery, clinicalData: any): QualityMeasureResult[];
/**
 * 2. Generates trend analysis for clinical metrics with decomposition.
 *
 * @param {string} metric - Metric identifier
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @param {string} granularity - Time granularity
 * @returns {TrendPoint[]} Trend data points with components
 */
export declare function analyzeClinicalTrends(metric: string, startDate: Date, endDate: Date, granularity?: 'daily' | 'weekly' | 'monthly'): TrendPoint[];
/**
 * 3. Identifies clinical risk cohorts using machine learning clustering.
 *
 * @param {any} patientData - Patient dataset for analysis
 * @param {string[]} riskFactors - Risk factors to consider
 * @returns {Map<string, string[]>} Map of risk cohort to patient IDs
 */
export declare function identifyClinicalRiskCohorts(patientData: any, riskFactors?: string[]): Map<string, string[]>;
/**
 * 4. Computes readmission risk scores for patient populations.
 *
 * @param {any} patientData - Patient demographic and clinical data
 * @param {string[]} excludePatients - Patient IDs to exclude
 * @returns {Map<string, number>} Patient ID to readmission risk score (0-100)
 */
export declare function calculateReadmissionRiskScores(patientData: any, excludePatients?: string[]): Map<string, number>;
/**
 * 5. Analyzes adverse events and patient safety indicators.
 *
 * @param {any} eventData - Adverse event records
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @returns {object} Adverse event analysis with trends and attribution
 */
export declare function analyzeAdverseEvents(eventData: any, periodStart: Date, periodEnd: Date): any;
/**
 * 6. Generates clinical outcome dashboards with multi-dimensional analysis.
 *
 * @param {string[]} outcomeMetrics - Outcome metrics to analyze
 * @param {string[]} dimensions - Dimensions for stratification
 * @param {any} outcomeData - Clinical outcome dataset
 * @returns {object} Multi-dimensional outcome analysis
 */
export declare function generateOutcomeDashboard(outcomeMetrics: string[], dimensions: string[], outcomeData: any): any;
/**
 * 7. Generates real-time operational dashboard with current KPIs.
 *
 * @param {string[]} departments - Department filters
 * @param {string[]} metrics - KPI metrics to include
 * @returns {DashboardMetrics} Current operational metrics
 */
export declare function generateOperationalDashboard(departments?: string[], metrics?: string[]): DashboardMetrics;
/**
 * 8. Computes real-time census and occupancy metrics.
 *
 * @param {string[]} units - Unit/department identifiers
 * @returns {Map<string, object>} Unit occupancy data
 */
export declare function calculateCensusAndOccupancy(units?: string[]): Map<string, object>;
/**
 * 9. Analyzes bed management and utilization efficiency.
 *
 * @param {Date} analysisDate - Date for analysis (default: today)
 * @returns {object} Bed utilization analysis with recommendations
 */
export declare function analyzeBedUtilization(analysisDate?: Date): any;
/**
 * 10. Generates staffing utilization and productivity dashboard.
 *
 * @param {string} department - Department identifier
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @returns {object} Staff productivity metrics
 */
export declare function generateStaffingDashboard(department: string, startDate: Date, endDate: Date): any;
/**
 * 11. Monitors real-time alerts and notifications system.
 *
 * @param {string[]} alertTypes - Types of alerts to monitor
 * @param {string} severity - Minimum severity level
 * @returns {AlertEvent[]} Active alerts sorted by severity
 */
export declare function monitorRealtimeAlerts(alertTypes?: string[], severity?: 'critical' | 'high' | 'medium' | 'low'): AlertEvent[];
/**
 * 12. Generates compliance and regulatory dashboard.
 *
 * @param {string[]} regulatoryFrameworks - Frameworks (e.g., 'CMS', 'JCAHO')
 * @returns {object} Compliance status and metrics
 */
export declare function generateComplianceDashboard(regulatoryFrameworks?: string[]): any;
/**
 * 13. Generates comprehensive financial report with variance analysis.
 *
 * @param {Date} periodStart - Reporting period start
 * @param {Date} periodEnd - Reporting period end
 * @param {string[]} departments - Department filters
 * @returns {FinancialReportData} Complete financial report
 */
export declare function generateFinancialReport(periodStart: Date, periodEnd: Date, departments?: string[]): FinancialReportData;
/**
 * 14. Analyzes revenue cycle metrics and performance.
 *
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @returns {object} Revenue cycle KPIs
 */
export declare function analyzeRevenueCycleMetrics(periodStart: Date, periodEnd: Date): any;
/**
 * 15. Calculates provider reimbursement and compensation.
 *
 * @param {string} providerId - Provider identifier
 * @param {Date} periodStart - Compensation period start
 * @param {Date} periodEnd - Compensation period end
 * @returns {object} Detailed reimbursement calculation
 */
export declare function calculateProviderReimbursement(providerId: string, periodStart: Date, periodEnd: Date): any;
/**
 * 16. Generates budget vs. actual analysis with variance explanation.
 *
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @param {string[]} departments - Department filters
 * @returns {object} Budget variance analysis
 */
export declare function analyzeBudgetVariance(periodStart: Date, periodEnd: Date, departments?: string[]): any;
/**
 * 17. Computes cost allocation and departmental profitability.
 *
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @returns {Map<string, object>} Department profitability metrics
 */
export declare function calculateDepartmentProfitability(periodStart: Date, periodEnd: Date): Map<string, object>;
/**
 * 18. Generates expense trend analysis with forecasting.
 *
 * @param {string} expenseCategory - Category to analyze
 * @param {number} monthsHistorical - Months of historical data
 * @returns {object} Expense trends with forecast
 */
export declare function analyzeExpenseTrends(expenseCategory: string, monthsHistorical?: number): any;
/**
 * 19. Generates quality measure scorecard with benchmarking.
 *
 * @param {string[]} measures - Quality measure IDs
 * @param {Date} periodStart - Measurement period start
 * @param {Date} periodEnd - Measurement period end
 * @returns {object} Quality scorecard with national benchmarks
 */
export declare function generateQualityMeasureScorecard(measures: string[], periodStart: Date, periodEnd: Date): any;
/**
 * 20. Analyzes patient safety culture and reporting trends.
 *
 * @param {Date} periodStart - Analysis start date
 * @param {Date} periodEnd - Analysis end date
 * @returns {object} Patient safety analysis
 */
export declare function analyzeSafetyReporting(periodStart: Date, periodEnd: Date): any;
/**
 * 21. Computes patient satisfaction and HCAHPS scores.
 *
 * @param {Date} periodStart - Survey period start
 * @param {Date} periodEnd - Survey period end
 * @param {string[]} departments - Department filters
 * @returns {object} Patient satisfaction metrics
 */
export declare function calculatePatientSatisfaction(periodStart: Date, periodEnd: Date, departments?: string[]): any;
/**
 * 22. Measures infection control and prevention effectiveness.
 *
 * @param {Date} periodStart - Measurement period start
 * @param {Date} periodEnd - Measurement period end
 * @returns {object} Infection prevention metrics
 */
export declare function measureInfectionPrevention(periodStart: Date, periodEnd: Date): any;
/**
 * 23. Generates readmission analysis with risk factor attribution.
 *
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @param {string[]} conditions - Condition codes to analyze
 * @returns {object} Readmission analysis with insights
 */
export declare function analyzeReadmissions(periodStart: Date, periodEnd: Date, conditions?: string[]): any;
/**
 * 24. Computes mortality and morbidity outcomes with risk adjustment.
 *
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @returns {object} Mortality/morbidity analysis with risk adjustment
 */
export declare function analyzeOutcomesAndMortality(periodStart: Date, periodEnd: Date): any;
/**
 * 25. Generates provider productivity report with efficiency metrics.
 *
 * @param {string} providerId - Provider identifier
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @returns {ProviderProductivity} Comprehensive productivity metrics
 */
export declare function generateProviderProductivityReport(providerId: string, periodStart: Date, periodEnd: Date): ProviderProductivity;
/**
 * 26. Analyzes patient volume trends by provider and specialty.
 *
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @returns {PatientVolumeAnalytics} Volume analysis with trends
 */
export declare function analyzePatientVolume(periodStart: Date, periodEnd: Date): PatientVolumeAnalytics;
/**
 * 27. Computes patient population health metrics and stratification.
 *
 * @param {any} populationData - Patient population dataset
 * @param {string[]} stratificationDimensions - Dimensions for stratification
 * @returns {object} Population health metrics
 */
export declare function analyzePopulationHealth(populationData: any, stratificationDimensions?: string[]): any;
/**
 * 28. Generates patient engagement and care utilization dashboard.
 *
 * @param {string} patientId - Patient identifier
 * @returns {object} Patient engagement metrics
 */
export declare function generatePatientEngagementDashboard(patientId: string): any;
/**
 * 29. Calculates risk stratification and cost prediction models.
 *
 * @param {any} populationData - Patient population data
 * @returns {Map<string, object>} Patient ID to risk prediction
 */
export declare function predictPatientRiskAndCost(populationData: any): Map<string, object>;
/**
 * 30. Generates provider comparison and benchmarking report.
 *
 * @param {string[]} providerIds - Provider identifiers to compare
 * @param {Date} periodStart - Comparison period start
 * @param {Date} periodEnd - Comparison period end
 * @returns {object} Provider benchmarking analysis
 */
export declare function generateProviderComparison(providerIds: string[], periodStart: Date, periodEnd: Date): any;
/**
 * 31. Performs comprehensive variance analysis across financial dimensions.
 *
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @returns {VarianceAnalysis} Variance analysis with decomposition
 */
export declare function performVarianceAnalysis(periodStart: Date, periodEnd: Date): VarianceAnalysis;
/**
 * 32. Generates predictive analytics forecasts for key metrics.
 *
 * @param {string} metricName - Metric to forecast
 * @param {string} forecastType - Type of forecast
 * @param {number} forecastPeriods - Number of periods to forecast
 * @returns {PredictiveAnalyticsForecast} Forecast with confidence intervals
 */
export declare function generatePredictiveAnalyticsForecast(metricName: string, forecastType?: 'volume' | 'revenue' | 'quality' | 'resource', forecastPeriods?: number): PredictiveAnalyticsForecast;
/**
 * 33. Analyzes correlation between clinical outcomes and operational metrics.
 *
 * @param {string[]} clinicalMetrics - Clinical metrics to analyze
 * @param {string[]} operationalMetrics - Operational metrics to analyze
 * @returns {object} Correlation analysis with insights
 */
export declare function analyzeOutcomeOperationalCorrelation(clinicalMetrics: string[], operationalMetrics?: string[]): any;
/**
 * 34. Identifies anomalies in operational and financial metrics.
 *
 * @param {string[]} metrics - Metrics to analyze
 * @returns {Map<string, object[]>} Metric to anomalies detected
 */
export declare function detectAnomaliesInMetrics(metrics: string[]): Map<string, object[]>;
/**
 * 35. Performs root cause analysis for significant variances.
 *
 * @param {string} metricName - Metric with variance
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @returns {object} Root cause analysis with recommended actions
 */
export declare function performRootCauseAnalysis(metricName: string, periodStart: Date, periodEnd: Date): any;
/**
 * 36. Generates scenario analysis for strategic planning.
 *
 * @param {string} scenario - Scenario identifier
 * @param {Record<string, number>} assumptions - Scenario assumptions
 * @returns {object} Scenario modeling results
 */
export declare function performScenarioAnalysis(scenario: string, assumptions: Record<string, number>): any;
/**
 * 37. Creates custom reports with flexible dimension selection.
 *
 * @param {CustomReportDefinition} reportDef - Report definition
 * @returns {object} Generated report data
 */
export declare function buildCustomReport(reportDef: CustomReportDefinition): object;
/**
 * 38. Generates recurring report schedules with delivery configuration.
 *
 * @param {CustomReportDefinition} reportDef - Report definition with schedule
 * @returns {object} Scheduled report configuration
 */
export declare function scheduleReportDelivery(reportDef: CustomReportDefinition): object;
/**
 * 39. Implements multi-dimensional aggregation and roll-up functionality.
 *
 * @param {any} data - Data to aggregate
 * @param {string[]} dimensions - Dimensions for aggregation
 * @param {string[]} metrics - Metrics to aggregate
 * @returns {object} Multi-dimensional cube data
 */
export declare function buildMultiDimensionalCube(data: any, dimensions: string[], metrics: string[]): object;
/**
 * 40. Generates cohort analysis for longitudinal studies.
 *
 * @param {any} populationData - Population dataset
 * @param {string} cohortDimension - Cohort definition dimension
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {object} Cohort analysis with retention/progression
 */
export declare function performCohortAnalysis(populationData: any, cohortDimension: string, startDate: Date, endDate: Date): object;
/**
 * 41. Implements comparative analysis between time periods.
 *
 * @param {string[]} metrics - Metrics to compare
 * @param {Date} period1Start - First period start
 * @param {Date} period1End - First period end
 * @param {Date} period2Start - Second period start
 * @param {Date} period2End - Second period end
 * @returns {object} Period-over-period comparison
 */
export declare function generatePeriodComparison(metrics: string[], period1Start: Date, period1End: Date, period2Start: Date, period2End: Date): object;
/**
 * 42. Creates drill-down capabilities for interactive reporting.
 *
 * @param {string} startLevel - Starting aggregation level
 * @param {string} endLevel - End drill-down level
 * @param {any} filterCriteria - Filter criteria for drill-down
 * @returns {object} Hierarchical drill-down data
 */
export declare function enableDrillDownAnalysis(startLevel: string, endLevel: string, filterCriteria: any): object;
/**
 * 43. Exports report data to Excel format with formatting.
 *
 * @param {any} reportData - Data to export
 * @param {string} filename - Output filename
 * @param {any} formatOptions - Excel formatting options
 * @returns {ExportResult} Export result with download URL
 */
export declare function exportReportToExcel(reportData: any, filename: string, formatOptions?: any): ExportResult;
/**
 * 44. Exports report data to PDF with advanced formatting and charts.
 *
 * @param {any} reportData - Data to export
 * @param {string} filename - Output filename
 * @param {any} chartConfigs - Chart configurations
 * @returns {ExportResult} Export result with download URL
 */
export declare function exportReportToPDF(reportData: any, filename: string, chartConfigs?: any): ExportResult;
/**
 * 45. Exports report data to CSV format for data integration.
 *
 * @param {any} reportData - Data to export
 * @param {string} filename - Output filename
 * @returns {ExportResult} Export result with download URL
 */
export declare function exportReportToCSV(reportData: any, filename: string): ExportResult;
/**
 * 46. Integrates with Tableau for BI visualization and embedding.
 *
 * @param {BIIntegrationConfig} config - Tableau integration configuration
 * @param {string} datasetId - Dataset identifier
 * @returns {object} Tableau embedding configuration
 */
export declare function integrateWithTableau(config: BIIntegrationConfig, datasetId: string): object;
/**
 * 47. Integrates with Power BI for advanced analytics and reporting.
 *
 * @param {BIIntegrationConfig} config - Power BI integration configuration
 * @param {any} reportData - Report data to sync
 * @returns {object} Power BI integration result
 */
export declare function integrateWithPowerBI(config: BIIntegrationConfig, reportData: any): object;
/**
 * 48. Manages data warehouse synchronization and ETL operations.
 *
 * @param {string[]} sourceDatasets - Source datasets to sync
 * @param {Date} lastSync - Last synchronization timestamp
 * @returns {object} Data warehouse sync status and metrics
 */
export declare function synchronizeDataWarehouse(sourceDatasets: string[], lastSync: Date): object;
//# sourceMappingURL=health-analytics-reporting-kit.d.ts.map