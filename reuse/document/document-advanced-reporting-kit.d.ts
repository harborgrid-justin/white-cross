/**
 * LOC: DOC-REPORT-001
 * File: /reuse/document/document-advanced-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - exceljs
 *   - pdfkit
 *   - node-fetch
 *   - uuid
 *
 * DOWNSTREAM (imported by):
 *   - Analytics dashboard controllers
 *   - Compliance reporting services
 *   - BI integration modules
 *   - Scheduled report executors
 */
/**
 * File: /reuse/document/document-advanced-reporting-kit.ts
 * Locator: WC-UTL-DOCREPORT-001
 * Purpose: Advanced Document Reporting & Analytics Kit - Enterprise analytics dashboards, compliance reports, BI tool integration, scheduled reporting
 *
 * Upstream: @nestjs/common, sequelize, exceljs, pdfkit, node-fetch, uuid
 * Downstream: Analytics controllers, compliance services, BI modules, report schedulers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, ExcelJS 4.x, PDFKit 0.13.x
 * Exports: 40 utility functions for report generation, KPI dashboards, compliance, BI integration, scheduling, custom analytics
 *
 * LLM Context: Production-grade document reporting and analytics utilities for White Cross healthcare platform.
 * Provides comprehensive reporting infrastructure including KPI dashboards, compliance reports (HIPAA, FDA, CMS),
 * BI tool integration (Tableau, PowerBI, Looker), scheduled report execution, custom analytics engines,
 * data aggregation, real-time metrics, historical trending, cohort analysis, and export capabilities.
 * Essential for healthcare analytics, regulatory compliance, business intelligence, and operational insights.
 */
import { Sequelize, Transaction, WhereOptions } from 'sequelize';
/**
 * Report format types
 */
export type ReportFormat = 'PDF' | 'EXCEL' | 'CSV' | 'JSON' | 'HTML' | 'TABLEAU' | 'POWERBI';
/**
 * Report frequency for scheduled reports
 */
export type ReportFrequency = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'REAL_TIME';
/**
 * Report status
 */
export type ReportStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
/**
 * Aggregation type for metrics
 */
export type AggregationType = 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX' | 'MEDIAN' | 'PERCENTILE' | 'STDDEV';
/**
 * Chart type for visualizations
 */
export type ChartType = 'LINE' | 'BAR' | 'PIE' | 'SCATTER' | 'AREA' | 'HEATMAP' | 'FUNNEL' | 'GAUGE';
/**
 * BI platform types
 */
export type BIPlatform = 'TABLEAU' | 'POWERBI' | 'LOOKER' | 'QLIK' | 'METABASE' | 'SISENSE';
/**
 * Report parameter definition
 */
export interface ReportParameter {
    name: string;
    type: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'ARRAY' | 'OBJECT';
    required: boolean;
    defaultValue?: any;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        options?: any[];
    };
    description?: string;
}
/**
 * Report configuration
 */
export interface ReportConfig {
    reportId: string;
    name: string;
    description?: string;
    category?: string;
    format: ReportFormat;
    parameters?: ReportParameter[];
    query?: string;
    dataSource?: string;
    template?: string;
    outputOptions?: {
        includeCharts?: boolean;
        includeRawData?: boolean;
        pageOrientation?: 'portrait' | 'landscape';
        fontSize?: number;
        compress?: boolean;
    };
}
/**
 * KPI (Key Performance Indicator) definition
 */
export interface KPIDefinition {
    id: string;
    name: string;
    description?: string;
    metric: string;
    aggregation: AggregationType;
    targetValue?: number;
    thresholds?: {
        critical?: number;
        warning?: number;
        good?: number;
    };
    unit?: string;
    format?: string;
    calculation?: string;
}
/**
 * Dashboard configuration
 */
export interface DashboardConfig {
    dashboardId: string;
    name: string;
    description?: string;
    layout: {
        rows: number;
        columns: number;
        widgets: DashboardWidget[];
    };
    filters?: ReportParameter[];
    refreshInterval?: number;
    permissions?: string[];
}
/**
 * Dashboard widget
 */
export interface DashboardWidget {
    id: string;
    type: 'KPI' | 'CHART' | 'TABLE' | 'TEXT' | 'METRIC';
    position: {
        row: number;
        column: number;
        width: number;
        height: number;
    };
    config: {
        kpiId?: string;
        chartType?: ChartType;
        dataSource?: string;
        query?: string;
        title?: string;
        refreshInterval?: number;
    };
}
/**
 * Compliance report configuration
 */
export interface ComplianceReportConfig {
    reportType: 'HIPAA' | 'FDA' | 'CMS' | 'SOC2' | 'GDPR' | 'CUSTOM';
    auditPeriod: {
        startDate: Date;
        endDate: Date;
    };
    scope?: string[];
    includeMetrics?: string[];
    certificationLevel?: string;
    auditorInfo?: {
        name: string;
        organization: string;
        contactInfo?: string;
    };
}
/**
 * BI integration configuration
 */
export interface BIIntegrationConfig {
    platform: BIPlatform;
    connectionId: string;
    credentials?: {
        apiKey?: string;
        token?: string;
        username?: string;
        password?: string;
        endpoint?: string;
    };
    workspaceId?: string;
    projectId?: string;
    datasetId?: string;
    refreshMode?: 'FULL' | 'INCREMENTAL' | 'APPEND';
}
/**
 * Report execution result
 */
export interface ReportExecutionResult {
    executionId: string;
    reportId: string;
    status: ReportStatus;
    startedAt: Date;
    completedAt?: Date;
    duration?: number;
    recordCount?: number;
    outputUrl?: string;
    outputSize?: number;
    error?: string;
    metadata?: Record<string, any>;
}
/**
 * Analytics query result
 */
export interface AnalyticsQueryResult {
    data: any[];
    aggregations?: Record<string, any>;
    totalCount: number;
    executionTime: number;
    metadata?: {
        columns?: string[];
        dataTypes?: Record<string, string>;
        query?: string;
    };
}
/**
 * Time series data point
 */
export interface TimeSeriesDataPoint {
    timestamp: Date;
    value: number;
    metric: string;
    dimensions?: Record<string, any>;
}
/**
 * Cohort analysis configuration
 */
export interface CohortAnalysisConfig {
    cohortType: 'ACQUISITION' | 'RETENTION' | 'BEHAVIOR' | 'CUSTOM';
    cohortPeriod: 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
    metric: string;
    segmentBy?: string;
    startDate: Date;
    endDate: Date;
}
/**
 * Export configuration
 */
export interface ExportConfig {
    format: ReportFormat;
    compression?: boolean;
    encryption?: boolean;
    includeMetadata?: boolean;
    chunkSize?: number;
    destination?: {
        type: 'S3' | 'FTP' | 'EMAIL' | 'LOCAL';
        path?: string;
        credentials?: Record<string, any>;
    };
}
/**
 * Report definition model attributes
 */
export interface ReportDefinitionAttributes {
    id: string;
    name: string;
    description?: string;
    category?: string;
    reportType: string;
    format: string;
    query?: string;
    parameters?: Record<string, any>;
    template?: string;
    dataSource?: string;
    outputOptions?: Record<string, any>;
    isActive: boolean;
    version: number;
    createdBy: string;
    updatedBy?: string;
    tags?: string[];
    permissions?: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Report execution model attributes
 */
export interface ReportExecutionAttributes {
    id: string;
    reportId: string;
    status: string;
    startedAt: Date;
    completedAt?: Date;
    duration?: number;
    executedBy: string;
    parameters?: Record<string, any>;
    recordCount?: number;
    outputUrl?: string;
    outputSize?: number;
    outputFormat?: string;
    error?: string;
    errorStack?: string;
    metadata?: Record<string, any>;
    retryCount?: number;
    parentExecutionId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Report schedule model attributes
 */
export interface ReportScheduleAttributes {
    id: string;
    reportId: string;
    name: string;
    description?: string;
    frequency: string;
    cronExpression?: string;
    startDate?: Date;
    endDate?: Date;
    timezone?: string;
    parameters?: Record<string, any>;
    recipients?: string[];
    deliveryMethod?: string;
    isActive: boolean;
    lastExecutionId?: string;
    lastExecutedAt?: Date;
    nextExecutionAt?: Date;
    executionCount?: number;
    failureCount?: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates ReportDefinition model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ReportDefinitionAttributes>>} ReportDefinition model
 *
 * @example
 * ```typescript
 * const ReportDefModel = createReportDefinitionModel(sequelize);
 * const report = await ReportDefModel.create({
 *   name: 'Patient Census Report',
 *   reportType: 'ANALYTICAL',
 *   format: 'PDF',
 *   query: 'SELECT * FROM patients WHERE status = :status',
 *   parameters: { status: { type: 'STRING', required: true } },
 *   createdBy: 'user-uuid'
 * });
 * ```
 */
export declare const createReportDefinitionModel: (sequelize: Sequelize) => any;
/**
 * Creates ReportExecution model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ReportExecutionAttributes>>} ReportExecution model
 *
 * @example
 * ```typescript
 * const ReportExecModel = createReportExecutionModel(sequelize);
 * const execution = await ReportExecModel.create({
 *   reportId: 'report-uuid',
 *   status: 'RUNNING',
 *   startedAt: new Date(),
 *   executedBy: 'user-uuid',
 *   parameters: { startDate: '2024-01-01', endDate: '2024-12-31' }
 * });
 * ```
 */
export declare const createReportExecutionModel: (sequelize: Sequelize) => any;
/**
 * Creates ReportSchedule model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ReportScheduleAttributes>>} ReportSchedule model
 *
 * @example
 * ```typescript
 * const ScheduleModel = createReportScheduleModel(sequelize);
 * const schedule = await ScheduleModel.create({
 *   reportId: 'report-uuid',
 *   name: 'Daily Patient Census',
 *   frequency: 'DAILY',
 *   cronExpression: '0 8 * * *',
 *   recipients: ['admin@hospital.com'],
 *   createdBy: 'user-uuid'
 * });
 * ```
 */
export declare const createReportScheduleModel: (sequelize: Sequelize) => any;
/**
 * 1. Generates comprehensive report from definition.
 *
 * @param {string} reportId - Report definition ID
 * @param {Record<string, any>} [parameters] - Report parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ReportExecutionResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await generateReport('report-uuid', {
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31',
 *   departmentId: 'dept-123'
 * });
 * console.log('Report URL:', result.outputUrl);
 * ```
 */
export declare const generateReport: (reportId: string, parameters?: Record<string, any>, transaction?: Transaction) => Promise<ReportExecutionResult>;
/**
 * 2. Executes report query with complex aggregations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - SQL query or query builder config
 * @param {Record<string, any>} [parameters] - Query parameters
 * @returns {Promise<AnalyticsQueryResult>} Query result
 *
 * @example
 * ```typescript
 * const result = await executeReportQuery(sequelize, `
 *   SELECT
 *     department_id,
 *     COUNT(*) as patient_count,
 *     AVG(length_of_stay) as avg_los,
 *     SUM(total_charges) as total_revenue
 *   FROM admissions
 *   WHERE admission_date >= :startDate AND admission_date <= :endDate
 *   GROUP BY department_id
 *   ORDER BY total_revenue DESC
 * `, { startDate: '2024-01-01', endDate: '2024-12-31' });
 * ```
 */
export declare const executeReportQuery: (sequelize: Sequelize, query: string, parameters?: Record<string, any>) => Promise<AnalyticsQueryResult>;
/**
 * 3. Exports report to PDF format.
 *
 * @param {any[]} data - Report data
 * @param {ReportConfig} config - Report configuration
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdfBuffer = await exportReportToPDF(reportData, {
 *   reportId: 'report-uuid',
 *   name: 'Monthly Financial Report',
 *   format: 'PDF',
 *   outputOptions: { pageOrientation: 'landscape' }
 * });
 * ```
 */
export declare const exportReportToPDF: (data: any[], config: ReportConfig) => Promise<Buffer>;
/**
 * 4. Exports report to Excel format with formatting.
 *
 * @param {any[]} data - Report data
 * @param {ReportConfig} config - Report configuration
 * @returns {Promise<Buffer>} Excel buffer
 *
 * @example
 * ```typescript
 * const excelBuffer = await exportReportToExcel(reportData, {
 *   reportId: 'report-uuid',
 *   name: 'Patient Census Report',
 *   format: 'EXCEL',
 *   outputOptions: { includeCharts: true }
 * });
 * ```
 */
export declare const exportReportToExcel: (data: any[], config: ReportConfig) => Promise<Buffer>;
/**
 * 5. Exports report to CSV format.
 *
 * @param {any[]} data - Report data
 * @param {string[]} [columns] - Column names
 * @returns {Promise<string>} CSV string
 *
 * @example
 * ```typescript
 * const csv = await exportReportToCSV(reportData, ['id', 'name', 'date', 'value']);
 * ```
 */
export declare const exportReportToCSV: (data: any[], columns?: string[]) => Promise<string>;
/**
 * 6. Generates report with time-based aggregations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Model} model - Sequelize model
 * @param {object} options - Aggregation options
 * @returns {Promise<TimeSeriesDataPoint[]>} Time series data
 *
 * @example
 * ```typescript
 * const timeSeries = await generateTimeSeriesReport(sequelize, AdmissionModel, {
 *   dateField: 'admissionDate',
 *   metricField: 'totalCharges',
 *   aggregation: 'SUM',
 *   interval: 'DAY',
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31'
 * });
 * ```
 */
export declare const generateTimeSeriesReport: (sequelize: Sequelize, model: any, options: {
    dateField: string;
    metricField: string;
    aggregation: AggregationType;
    interval: "HOUR" | "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";
    startDate: string;
    endDate: string;
    filters?: WhereOptions;
}) => Promise<TimeSeriesDataPoint[]>;
/**
 * 7. Generates pivot table report.
 *
 * @param {any[]} data - Source data
 * @param {object} config - Pivot configuration
 * @returns {Promise<any[]>} Pivoted data
 *
 * @example
 * ```typescript
 * const pivotTable = await generatePivotTableReport(salesData, {
 *   rowFields: ['department', 'category'],
 *   columnFields: ['month'],
 *   valueField: 'revenue',
 *   aggregation: 'SUM'
 * });
 * ```
 */
export declare const generatePivotTableReport: (data: any[], config: {
    rowFields: string[];
    columnFields: string[];
    valueField: string;
    aggregation: AggregationType;
}) => Promise<any[]>;
/**
 * 8. Merges multiple reports into single output.
 *
 * @param {string[]} reportIds - Array of report definition IDs
 * @param {Record<string, any>} parameters - Shared parameters
 * @param {ReportFormat} outputFormat - Output format
 * @returns {Promise<Buffer>} Combined report
 *
 * @example
 * ```typescript
 * const combined = await mergeReports(
 *   ['report1-uuid', 'report2-uuid', 'report3-uuid'],
 *   { year: 2024, quarter: 'Q4' },
 *   'PDF'
 * );
 * ```
 */
export declare const mergeReports: (reportIds: string[], parameters: Record<string, any>, outputFormat: ReportFormat) => Promise<Buffer>;
/**
 * 9. Calculates KPI metric value.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {KPIDefinition} kpiDef - KPI definition
 * @param {Date} [asOfDate] - Calculate as of specific date
 * @returns {Promise<{ value: number; status: string; trend?: number }>} KPI result
 *
 * @example
 * ```typescript
 * const kpi = await calculateKPI(sequelize, {
 *   id: 'kpi-patient-satisfaction',
 *   name: 'Patient Satisfaction Score',
 *   metric: 'satisfaction_score',
 *   aggregation: 'AVG',
 *   targetValue: 4.5,
 *   thresholds: { critical: 3.5, warning: 4.0, good: 4.5 }
 * });
 * console.log('Satisfaction:', kpi.value, 'Status:', kpi.status);
 * ```
 */
export declare const calculateKPI: (sequelize: Sequelize, kpiDef: KPIDefinition, asOfDate?: Date) => Promise<{
    value: number;
    status: string;
    trend?: number;
}>;
/**
 * 10. Builds real-time dashboard data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DashboardConfig} dashboard - Dashboard configuration
 * @returns {Promise<Record<string, any>>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboardData = await buildDashboard(sequelize, {
 *   dashboardId: 'exec-dashboard',
 *   name: 'Executive Dashboard',
 *   layout: {
 *     rows: 3,
 *     columns: 4,
 *     widgets: [
 *       { id: 'w1', type: 'KPI', position: { row: 0, column: 0, width: 1, height: 1 },
 *         config: { kpiId: 'patient-count' } }
 *     ]
 *   }
 * });
 * ```
 */
export declare const buildDashboard: (sequelize: Sequelize, dashboard: DashboardConfig) => Promise<Record<string, any>>;
/**
 * 11. Generates KPI trend analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} kpiId - KPI identifier
 * @param {object} options - Trend options
 * @returns {Promise<TimeSeriesDataPoint[]>} KPI trend data
 *
 * @example
 * ```typescript
 * const trend = await generateKPITrend(sequelize, 'patient-satisfaction', {
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31',
 *   interval: 'MONTH'
 * });
 * ```
 */
export declare const generateKPITrend: (sequelize: Sequelize, kpiId: string, options: {
    startDate: string;
    endDate: string;
    interval: "DAY" | "WEEK" | "MONTH" | "QUARTER";
}) => Promise<TimeSeriesDataPoint[]>;
/**
 * 12. Compares KPIs across dimensions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} kpiIds - Array of KPI identifiers
 * @param {string} dimensionField - Dimension to compare by
 * @returns {Promise<any[]>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareKPIsByDimension(
 *   sequelize,
 *   ['readmission-rate', 'avg-length-of-stay'],
 *   'department_id'
 * );
 * ```
 */
export declare const compareKPIsByDimension: (sequelize: Sequelize, kpiIds: string[], dimensionField: string) => Promise<any[]>;
/**
 * 13. Generates executive summary dashboard.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} reportDate - Report date
 * @returns {Promise<Record<string, any>>} Executive summary
 *
 * @example
 * ```typescript
 * const summary = await generateExecutiveSummary(sequelize, new Date());
 * console.log('Total Patients:', summary.totalPatients);
 * console.log('Revenue:', summary.totalRevenue);
 * ```
 */
export declare const generateExecutiveSummary: (sequelize: Sequelize, reportDate: Date) => Promise<Record<string, any>>;
/**
 * 14. Builds operational metrics dashboard.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} departmentId - Department identifier
 * @returns {Promise<Record<string, any>>} Operational metrics
 *
 * @example
 * ```typescript
 * const metrics = await buildOperationalMetrics(sequelize, 'dept-emergency');
 * console.log('Bed Occupancy:', metrics.bedOccupancyRate);
 * console.log('Staff Utilization:', metrics.staffUtilization);
 * ```
 */
export declare const buildOperationalMetrics: (sequelize: Sequelize, departmentId: string) => Promise<Record<string, any>>;
/**
 * 15. Generates department performance scorecard.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} departmentId - Department identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Record<string, any>>} Performance scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generatePerformanceScorecard(
 *   sequelize,
 *   'dept-cardiology',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare const generatePerformanceScorecard: (sequelize: Sequelize, departmentId: string, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * 16. Generates HIPAA compliance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceReportConfig} config - Compliance configuration
 * @returns {Promise<Record<string, any>>} HIPAA compliance report
 *
 * @example
 * ```typescript
 * const hipaaReport = await generateHIPAAComplianceReport(sequelize, {
 *   reportType: 'HIPAA',
 *   auditPeriod: {
 *     startDate: new Date('2024-01-01'),
 *     endDate: new Date('2024-12-31')
 *   },
 *   scope: ['access-logs', 'phi-disclosures', 'security-incidents']
 * });
 * ```
 */
export declare const generateHIPAAComplianceReport: (sequelize: Sequelize, config: ComplianceReportConfig) => Promise<Record<string, any>>;
/**
 * 17. Generates FDA regulatory compliance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceReportConfig} config - Compliance configuration
 * @returns {Promise<Record<string, any>>} FDA compliance report
 *
 * @example
 * ```typescript
 * const fdaReport = await generateFDAComplianceReport(sequelize, {
 *   reportType: 'FDA',
 *   auditPeriod: {
 *     startDate: new Date('2024-01-01'),
 *     endDate: new Date('2024-12-31')
 *   }
 * });
 * ```
 */
export declare const generateFDAComplianceReport: (sequelize: Sequelize, config: ComplianceReportConfig) => Promise<Record<string, any>>;
/**
 * 18. Generates CMS quality measures report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceReportConfig} config - Compliance configuration
 * @returns {Promise<Record<string, any>>} CMS quality report
 *
 * @example
 * ```typescript
 * const cmsReport = await generateCMSQualityReport(sequelize, {
 *   reportType: 'CMS',
 *   auditPeriod: {
 *     startDate: new Date('2024-01-01'),
 *     endDate: new Date('2024-12-31')
 *   }
 * });
 * ```
 */
export declare const generateCMSQualityReport: (sequelize: Sequelize, config: ComplianceReportConfig) => Promise<Record<string, any>>;
/**
 * 19. Generates audit trail report for compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Audit filters
 * @returns {Promise<any[]>} Audit trail entries
 *
 * @example
 * ```typescript
 * const auditTrail = await generateAuditTrailReport(sequelize, {
 *   userId: 'user-123',
 *   resourceType: 'PATIENT_RECORD',
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31'
 * });
 * ```
 */
export declare const generateAuditTrailReport: (sequelize: Sequelize, filters: {
    userId?: string;
    resourceType?: string;
    actionType?: string;
    startDate: string;
    endDate: string;
}) => Promise<any[]>;
/**
 * 20. Validates data quality for compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table to validate
 * @param {object} rules - Validation rules
 * @returns {Promise<Record<string, any>>} Data quality report
 *
 * @example
 * ```typescript
 * const qualityReport = await validateDataQuality(sequelize, 'patients', {
 *   requiredFields: ['first_name', 'last_name', 'date_of_birth'],
 *   dateRanges: { date_of_birth: { min: '1900-01-01', max: new Date() } }
 * });
 * ```
 */
export declare const validateDataQuality: (sequelize: Sequelize, tableName: string, rules: {
    requiredFields?: string[];
    dateRanges?: Record<string, {
        min?: string;
        max?: string;
    }>;
    valueRanges?: Record<string, {
        min?: number;
        max?: number;
    }>;
}) => Promise<Record<string, any>>;
/**
 * 21. Generates SOC2 compliance evidence report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceReportConfig} config - Compliance configuration
 * @returns {Promise<Record<string, any>>} SOC2 evidence report
 *
 * @example
 * ```typescript
 * const soc2Report = await generateSOC2ComplianceReport(sequelize, {
 *   reportType: 'SOC2',
 *   auditPeriod: {
 *     startDate: new Date('2024-01-01'),
 *     endDate: new Date('2024-12-31')
 *   }
 * });
 * ```
 */
export declare const generateSOC2ComplianceReport: (sequelize: Sequelize, config: ComplianceReportConfig) => Promise<Record<string, any>>;
/**
 * 22. Generates retention compliance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Report options
 * @returns {Promise<Record<string, any>>} Retention compliance report
 *
 * @example
 * ```typescript
 * const retentionReport = await generateRetentionComplianceReport(sequelize, {
 *   documentTypes: ['MEDICAL_RECORD', 'LAB_RESULT', 'IMAGING'],
 *   checkDate: new Date()
 * });
 * ```
 */
export declare const generateRetentionComplianceReport: (sequelize: Sequelize, options: {
    documentTypes?: string[];
    checkDate: Date;
}) => Promise<Record<string, any>>;
/**
 * 23. Exports data to Tableau format.
 *
 * @param {any[]} data - Data to export
 * @param {object} config - Tableau configuration
 * @returns {Promise<string>} Tableau TDS/TDE content
 *
 * @example
 * ```typescript
 * const tableauData = await exportToTableau(reportData, {
 *   dataSourceName: 'Patient Analytics',
 *   connection: { server: 'tableau.hospital.com' }
 * });
 * ```
 */
export declare const exportToTableau: (data: any[], config: {
    dataSourceName: string;
    connection?: Record<string, any>;
}) => Promise<string>;
/**
 * 24. Exports data to PowerBI format.
 *
 * @param {any[]} data - Data to export
 * @param {object} config - PowerBI configuration
 * @returns {Promise<Buffer>} PowerBI PBIX content
 *
 * @example
 * ```typescript
 * const powerbiData = await exportToPowerBI(reportData, {
 *   datasetName: 'Healthcare Analytics',
 *   workspaceId: 'workspace-uuid'
 * });
 * ```
 */
export declare const exportToPowerBI: (data: any[], config: {
    datasetName: string;
    workspaceId?: string;
}) => Promise<Buffer>;
/**
 * 25. Publishes report to BI platform.
 *
 * @param {BIIntegrationConfig} config - BI integration config
 * @param {any[]} data - Data to publish
 * @param {object} metadata - Dataset metadata
 * @returns {Promise<{ success: boolean; datasetId?: string; url?: string }>} Publish result
 *
 * @example
 * ```typescript
 * const result = await publishToBIPlatform({
 *   platform: 'TABLEAU',
 *   connectionId: 'conn-123',
 *   credentials: { apiKey: 'key', endpoint: 'https://tableau.hospital.com' }
 * }, reportData, { name: 'Monthly Report' });
 * ```
 */
export declare const publishToBIPlatform: (config: BIIntegrationConfig, data: any[], metadata: {
    name: string;
    description?: string;
    tags?: string[];
}) => Promise<{
    success: boolean;
    datasetId?: string;
    url?: string;
}>;
/**
 * 26. Creates BI data connection.
 *
 * @param {BIPlatform} platform - BI platform type
 * @param {object} credentials - Connection credentials
 * @returns {Promise<string>} Connection ID
 *
 * @example
 * ```typescript
 * const connectionId = await createBIConnection('POWERBI', {
 *   clientId: 'client-123',
 *   clientSecret: 'secret',
 *   tenantId: 'tenant-123'
 * });
 * ```
 */
export declare const createBIConnection: (platform: BIPlatform, credentials: Record<string, any>) => Promise<string>;
/**
 * 27. Refreshes BI dataset with new data.
 *
 * @param {BIIntegrationConfig} config - BI integration config
 * @param {string} datasetId - Dataset identifier
 * @param {any[]} [newData] - New data for incremental refresh
 * @returns {Promise<{ success: boolean; refreshedAt: Date }>} Refresh result
 *
 * @example
 * ```typescript
 * const result = await refreshBIDataset({
 *   platform: 'TABLEAU',
 *   connectionId: 'conn-123',
 *   refreshMode: 'INCREMENTAL'
 * }, 'dataset-456', newRecords);
 * ```
 */
export declare const refreshBIDataset: (config: BIIntegrationConfig, datasetId: string, newData?: any[]) => Promise<{
    success: boolean;
    refreshedAt: Date;
}>;
/**
 * 28. Retrieves BI report usage analytics.
 *
 * @param {BIIntegrationConfig} config - BI integration config
 * @param {string} reportId - Report identifier
 * @param {object} options - Analytics options
 * @returns {Promise<Record<string, any>>} Usage analytics
 *
 * @example
 * ```typescript
 * const analytics = await getBIReportUsageAnalytics({
 *   platform: 'POWERBI',
 *   connectionId: 'conn-123'
 * }, 'report-456', {
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31'
 * });
 * ```
 */
export declare const getBIReportUsageAnalytics: (config: BIIntegrationConfig, reportId: string, options: {
    startDate: string;
    endDate: string;
}) => Promise<Record<string, any>>;
/**
 * 29. Creates embedded BI report token.
 *
 * @param {BIIntegrationConfig} config - BI integration config
 * @param {string} reportId - Report identifier
 * @param {object} options - Embed options
 * @returns {Promise<{ embedToken: string; embedUrl: string; expiresAt: Date }>} Embed token
 *
 * @example
 * ```typescript
 * const embedToken = await createEmbeddedBIToken({
 *   platform: 'POWERBI',
 *   connectionId: 'conn-123'
 * }, 'report-456', {
 *   userId: 'user-789',
 *   permissions: ['VIEW'],
 *   expiresIn: 3600
 * });
 * ```
 */
export declare const createEmbeddedBIToken: (config: BIIntegrationConfig, reportId: string, options: {
    userId: string;
    permissions: string[];
    expiresIn?: number;
}) => Promise<{
    embedToken: string;
    embedUrl: string;
    expiresAt: Date;
}>;
/**
 * 30. Creates report schedule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Omit<ReportScheduleAttributes, 'id' | 'createdAt' | 'updatedAt'>} scheduleData - Schedule data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ReportScheduleAttributes>} Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await createReportSchedule(sequelize, {
 *   reportId: 'report-uuid',
 *   name: 'Daily Patient Census',
 *   frequency: 'DAILY',
 *   cronExpression: '0 8 * * *',
 *   recipients: ['admin@hospital.com'],
 *   createdBy: 'user-uuid'
 * });
 * ```
 */
export declare const createReportSchedule: (sequelize: Sequelize, scheduleData: Omit<ReportScheduleAttributes, "id" | "createdAt" | "updatedAt">, transaction?: Transaction) => Promise<ReportScheduleAttributes>;
/**
 * 31. Executes scheduled report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} scheduleId - Schedule identifier
 * @returns {Promise<ReportExecutionResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeScheduledReport(sequelize, 'schedule-uuid');
 * console.log('Execution status:', result.status);
 * ```
 */
export declare const executeScheduledReport: (sequelize: Sequelize, scheduleId: string) => Promise<ReportExecutionResult>;
/**
 * 32. Calculates next execution time for schedule.
 *
 * @param {ReportScheduleAttributes} schedule - Report schedule
 * @returns {Date | null} Next execution time
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextExecutionTime(schedule);
 * console.log('Next execution:', nextRun);
 * ```
 */
export declare const calculateNextExecutionTime: (schedule: ReportScheduleAttributes) => Date | null;
/**
 * 33. Retrieves pending scheduled reports.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ReportScheduleAttributes[]>} Pending schedules
 *
 * @example
 * ```typescript
 * const pendingReports = await getPendingScheduledReports(sequelize);
 * for (const schedule of pendingReports) {
 *   await executeScheduledReport(sequelize, schedule.id);
 * }
 * ```
 */
export declare const getPendingScheduledReports: (sequelize: Sequelize) => Promise<ReportScheduleAttributes[]>;
/**
 * 34. Delivers report to recipients.
 *
 * @param {ReportExecutionResult} execution - Report execution result
 * @param {object} deliveryConfig - Delivery configuration
 * @returns {Promise<{ success: boolean; delivered: string[]; failed: string[] }>} Delivery result
 *
 * @example
 * ```typescript
 * const delivery = await deliverReport(executionResult, {
 *   recipients: ['admin@hospital.com', 'cfo@hospital.com'],
 *   method: 'EMAIL',
 *   subject: 'Monthly Financial Report',
 *   message: 'Please find attached the monthly financial report.'
 * });
 * ```
 */
export declare const deliverReport: (execution: ReportExecutionResult, deliveryConfig: {
    recipients: string[];
    method: "EMAIL" | "S3" | "FTP" | "WEBHOOK";
    subject?: string;
    message?: string;
    attachmentName?: string;
}) => Promise<{
    success: boolean;
    delivered: string[];
    failed: string[];
}>;
/**
 * 35. Manages report schedule lifecycle.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} scheduleId - Schedule identifier
 * @param {object} action - Lifecycle action
 * @returns {Promise<ReportScheduleAttributes>} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = await manageScheduleLifecycle(sequelize, 'schedule-uuid', {
 *   action: 'PAUSE'
 * });
 * ```
 */
export declare const manageScheduleLifecycle: (sequelize: Sequelize, scheduleId: string, action: {
    action: "PAUSE" | "RESUME" | "CANCEL" | "MODIFY";
    updates?: Partial<ReportScheduleAttributes>;
}) => Promise<ReportScheduleAttributes>;
/**
 * 36. Performs cohort analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CohortAnalysisConfig} config - Cohort analysis configuration
 * @returns {Promise<any[]>} Cohort analysis results
 *
 * @example
 * ```typescript
 * const cohortAnalysis = await performCohortAnalysis(sequelize, {
 *   cohortType: 'RETENTION',
 *   cohortPeriod: 'MONTH',
 *   metric: 'active_users',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export declare const performCohortAnalysis: (sequelize: Sequelize, config: CohortAnalysisConfig) => Promise<any[]>;
/**
 * 37. Generates funnel analysis report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} funnelConfig - Funnel configuration
 * @returns {Promise<any[]>} Funnel analysis results
 *
 * @example
 * ```typescript
 * const funnelAnalysis = await generateFunnelAnalysis(sequelize, {
 *   steps: [
 *     { name: 'Registration', eventType: 'USER_REGISTERED' },
 *     { name: 'Profile Completed', eventType: 'PROFILE_COMPLETED' },
 *     { name: 'First Appointment', eventType: 'APPOINTMENT_BOOKED' },
 *     { name: 'Appointment Completed', eventType: 'APPOINTMENT_COMPLETED' }
 *   ],
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31'
 * });
 * ```
 */
export declare const generateFunnelAnalysis: (sequelize: Sequelize, funnelConfig: {
    steps: Array<{
        name: string;
        eventType: string;
    }>;
    startDate: string;
    endDate: string;
}) => Promise<any[]>;
/**
 * 38. Calculates statistical aggregations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Model} model - Sequelize model
 * @param {object} options - Aggregation options
 * @returns {Promise<Record<string, number>>} Statistical results
 *
 * @example
 * ```typescript
 * const stats = await calculateStatisticalAggregations(sequelize, AdmissionModel, {
 *   field: 'length_of_stay',
 *   aggregations: ['AVG', 'MEDIAN', 'STDDEV', 'PERCENTILE'],
 *   percentiles: [25, 50, 75, 90, 95],
 *   filters: { department_id: 'dept-123' }
 * });
 * ```
 */
export declare const calculateStatisticalAggregations: (sequelize: Sequelize, model: any, options: {
    field: string;
    aggregations: AggregationType[];
    percentiles?: number[];
    filters?: WhereOptions;
}) => Promise<Record<string, number>>;
/**
 * 39. Generates predictive analytics report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} config - Prediction configuration
 * @returns {Promise<any[]>} Prediction results
 *
 * @example
 * ```typescript
 * const predictions = await generatePredictiveAnalytics(sequelize, {
 *   model: 'readmission_risk',
 *   features: ['age', 'comorbidities', 'length_of_stay'],
 *   targetVariable: 'readmitted_30_days',
 *   historicalPeriod: { startDate: '2023-01-01', endDate: '2024-12-31' }
 * });
 * ```
 */
export declare const generatePredictiveAnalytics: (sequelize: Sequelize, config: {
    model: string;
    features: string[];
    targetVariable: string;
    historicalPeriod: {
        startDate: string;
        endDate: string;
    };
}) => Promise<any[]>;
/**
 * 40. Exports analytics to multiple formats simultaneously.
 *
 * @param {any[]} data - Analytics data
 * @param {ExportConfig[]} configs - Array of export configurations
 * @returns {Promise<Array<{ format: ReportFormat; output: Buffer | string }>>} Export results
 *
 * @example
 * ```typescript
 * const exports = await exportAnalytics(analyticsData, [
 *   { format: 'PDF', compression: true },
 *   { format: 'EXCEL', includeMetadata: true },
 *   { format: 'CSV' },
 *   { format: 'JSON', compression: true }
 * ]);
 * ```
 */
export declare const exportAnalytics: (data: any[], configs: ExportConfig[]) => Promise<Array<{
    format: ReportFormat;
    output: Buffer | string;
}>>;
declare const _default: {
    createReportDefinitionModel: (sequelize: Sequelize) => any;
    createReportExecutionModel: (sequelize: Sequelize) => any;
    createReportScheduleModel: (sequelize: Sequelize) => any;
    generateReport: (reportId: string, parameters?: Record<string, any>, transaction?: Transaction) => Promise<ReportExecutionResult>;
    executeReportQuery: (sequelize: Sequelize, query: string, parameters?: Record<string, any>) => Promise<AnalyticsQueryResult>;
    exportReportToPDF: (data: any[], config: ReportConfig) => Promise<Buffer>;
    exportReportToExcel: (data: any[], config: ReportConfig) => Promise<Buffer>;
    exportReportToCSV: (data: any[], columns?: string[]) => Promise<string>;
    generateTimeSeriesReport: (sequelize: Sequelize, model: any, options: {
        dateField: string;
        metricField: string;
        aggregation: AggregationType;
        interval: "HOUR" | "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";
        startDate: string;
        endDate: string;
        filters?: WhereOptions;
    }) => Promise<TimeSeriesDataPoint[]>;
    generatePivotTableReport: (data: any[], config: {
        rowFields: string[];
        columnFields: string[];
        valueField: string;
        aggregation: AggregationType;
    }) => Promise<any[]>;
    mergeReports: (reportIds: string[], parameters: Record<string, any>, outputFormat: ReportFormat) => Promise<Buffer>;
    calculateKPI: (sequelize: Sequelize, kpiDef: KPIDefinition, asOfDate?: Date) => Promise<{
        value: number;
        status: string;
        trend?: number;
    }>;
    buildDashboard: (sequelize: Sequelize, dashboard: DashboardConfig) => Promise<Record<string, any>>;
    generateKPITrend: (sequelize: Sequelize, kpiId: string, options: {
        startDate: string;
        endDate: string;
        interval: "DAY" | "WEEK" | "MONTH" | "QUARTER";
    }) => Promise<TimeSeriesDataPoint[]>;
    compareKPIsByDimension: (sequelize: Sequelize, kpiIds: string[], dimensionField: string) => Promise<any[]>;
    generateExecutiveSummary: (sequelize: Sequelize, reportDate: Date) => Promise<Record<string, any>>;
    buildOperationalMetrics: (sequelize: Sequelize, departmentId: string) => Promise<Record<string, any>>;
    generatePerformanceScorecard: (sequelize: Sequelize, departmentId: string, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    generateHIPAAComplianceReport: (sequelize: Sequelize, config: ComplianceReportConfig) => Promise<Record<string, any>>;
    generateFDAComplianceReport: (sequelize: Sequelize, config: ComplianceReportConfig) => Promise<Record<string, any>>;
    generateCMSQualityReport: (sequelize: Sequelize, config: ComplianceReportConfig) => Promise<Record<string, any>>;
    generateAuditTrailReport: (sequelize: Sequelize, filters: {
        userId?: string;
        resourceType?: string;
        actionType?: string;
        startDate: string;
        endDate: string;
    }) => Promise<any[]>;
    validateDataQuality: (sequelize: Sequelize, tableName: string, rules: {
        requiredFields?: string[];
        dateRanges?: Record<string, {
            min?: string;
            max?: string;
        }>;
        valueRanges?: Record<string, {
            min?: number;
            max?: number;
        }>;
    }) => Promise<Record<string, any>>;
    generateSOC2ComplianceReport: (sequelize: Sequelize, config: ComplianceReportConfig) => Promise<Record<string, any>>;
    generateRetentionComplianceReport: (sequelize: Sequelize, options: {
        documentTypes?: string[];
        checkDate: Date;
    }) => Promise<Record<string, any>>;
    exportToTableau: (data: any[], config: {
        dataSourceName: string;
        connection?: Record<string, any>;
    }) => Promise<string>;
    exportToPowerBI: (data: any[], config: {
        datasetName: string;
        workspaceId?: string;
    }) => Promise<Buffer>;
    publishToBIPlatform: (config: BIIntegrationConfig, data: any[], metadata: {
        name: string;
        description?: string;
        tags?: string[];
    }) => Promise<{
        success: boolean;
        datasetId?: string;
        url?: string;
    }>;
    createBIConnection: (platform: BIPlatform, credentials: Record<string, any>) => Promise<string>;
    refreshBIDataset: (config: BIIntegrationConfig, datasetId: string, newData?: any[]) => Promise<{
        success: boolean;
        refreshedAt: Date;
    }>;
    getBIReportUsageAnalytics: (config: BIIntegrationConfig, reportId: string, options: {
        startDate: string;
        endDate: string;
    }) => Promise<Record<string, any>>;
    createEmbeddedBIToken: (config: BIIntegrationConfig, reportId: string, options: {
        userId: string;
        permissions: string[];
        expiresIn?: number;
    }) => Promise<{
        embedToken: string;
        embedUrl: string;
        expiresAt: Date;
    }>;
    createReportSchedule: (sequelize: Sequelize, scheduleData: Omit<ReportScheduleAttributes, "id" | "createdAt" | "updatedAt">, transaction?: Transaction) => Promise<ReportScheduleAttributes>;
    executeScheduledReport: (sequelize: Sequelize, scheduleId: string) => Promise<ReportExecutionResult>;
    calculateNextExecutionTime: (schedule: ReportScheduleAttributes) => Date | null;
    getPendingScheduledReports: (sequelize: Sequelize) => Promise<ReportScheduleAttributes[]>;
    deliverReport: (execution: ReportExecutionResult, deliveryConfig: {
        recipients: string[];
        method: "EMAIL" | "S3" | "FTP" | "WEBHOOK";
        subject?: string;
        message?: string;
        attachmentName?: string;
    }) => Promise<{
        success: boolean;
        delivered: string[];
        failed: string[];
    }>;
    manageScheduleLifecycle: (sequelize: Sequelize, scheduleId: string, action: {
        action: "PAUSE" | "RESUME" | "CANCEL" | "MODIFY";
        updates?: Partial<ReportScheduleAttributes>;
    }) => Promise<ReportScheduleAttributes>;
    performCohortAnalysis: (sequelize: Sequelize, config: CohortAnalysisConfig) => Promise<any[]>;
    generateFunnelAnalysis: (sequelize: Sequelize, funnelConfig: {
        steps: Array<{
            name: string;
            eventType: string;
        }>;
        startDate: string;
        endDate: string;
    }) => Promise<any[]>;
    calculateStatisticalAggregations: (sequelize: Sequelize, model: any, options: {
        field: string;
        aggregations: AggregationType[];
        percentiles?: number[];
        filters?: WhereOptions;
    }) => Promise<Record<string, number>>;
    generatePredictiveAnalytics: (sequelize: Sequelize, config: {
        model: string;
        features: string[];
        targetVariable: string;
        historicalPeriod: {
            startDate: string;
            endDate: string;
        };
    }) => Promise<any[]>;
    exportAnalytics: (data: any[], configs: ExportConfig[]) => Promise<Array<{
        format: ReportFormat;
        output: Buffer | string;
    }>>;
};
export default _default;
//# sourceMappingURL=document-advanced-reporting-kit.d.ts.map