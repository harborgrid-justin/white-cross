/**
 * LOC: HCMHRA1234567
 * File: /reuse/server/human-capital/hr-analytics-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../database-models-kit.ts
 *   - ./workforce-planning-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Analytics dashboards
 *   - Executive reporting controllers
 */
/**
 * File: /reuse/server/human-capital/hr-analytics-reporting-kit.ts
 * Locator: WC-HCM-HRA-001
 * Purpose: Comprehensive HR Analytics & Reporting Utilities - SAP SuccessFactors Workforce Analytics parity
 *
 * Upstream: Error handling, validation, database models, workforce planning
 * Downstream: ../backend/*, HR services, analytics dashboards, executive scorecards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 50+ utility functions for HR reports, analytics, dashboards, predictive models, metrics
 *
 * LLM Context: Enterprise-grade HR analytics and reporting system competing with SAP SuccessFactors.
 * Provides standard HR reports, custom report builder, real-time dashboards, predictive analytics,
 * turnover analysis, diversity metrics, compensation analytics, recruitment metrics, performance analytics,
 * learning ROI, productivity metrics, executive scorecards, and comprehensive data export capabilities.
 */
import { Sequelize } from 'sequelize';
export declare const ReportDefinitionSchema: any;
export declare const DashboardWidgetSchema: any;
export declare const PredictiveModelSchema: any;
interface HRReport {
    reportId: string;
    reportName: string;
    reportType: 'STANDARD' | 'CUSTOM' | 'SCHEDULED' | 'AD_HOC';
    category: string;
    description: string;
    generatedBy: string;
    generatedAt: Date;
    parameters: Record<string, any>;
    outputFormat: 'PDF' | 'EXCEL' | 'CSV' | 'HTML' | 'JSON';
    dataSource: string;
    filters: Array<{
        field: string;
        operator: string;
        value: any;
    }>;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    downloadUrl?: string;
}
interface CustomReportBuilder {
    reportId: string;
    reportName: string;
    dimensions: string[];
    metrics: string[];
    filters: Array<{
        field: string;
        operator: string;
        value: any;
    }>;
    groupBy: string[];
    sortBy: Array<{
        field: string;
        direction: 'ASC' | 'DESC';
    }>;
    aggregations: Record<string, 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT'>;
    visualizations: Array<{
        type: 'BAR' | 'LINE' | 'PIE' | 'SCATTER' | 'HEATMAP';
        config: Record<string, any>;
    }>;
}
interface Dashboard {
    dashboardId: string;
    dashboardName: string;
    category: 'EXECUTIVE' | 'OPERATIONAL' | 'ANALYTICAL' | 'COMPLIANCE';
    widgets: DashboardWidget[];
    layout: Array<{
        widgetId: string;
        position: {
            x: number;
            y: number;
            w: number;
            h: number;
        };
    }>;
    refreshInterval: number;
    permissions: string[];
    filters: Record<string, any>;
}
interface DashboardWidget {
    widgetId: string;
    widgetType: 'CHART' | 'TABLE' | 'METRIC' | 'GAUGE' | 'HEATMAP' | 'TREND';
    title: string;
    dataSource: string;
    query: Record<string, any>;
    visualization: {
        chartType?: 'BAR' | 'LINE' | 'PIE' | 'DONUT' | 'AREA' | 'SCATTER';
        config: Record<string, any>;
    };
    refreshInterval?: number;
    filters?: Record<string, any>;
}
interface PredictiveModel {
    modelId: string;
    modelName: string;
    modelType: 'REGRESSION' | 'CLASSIFICATION' | 'CLUSTERING' | 'TIME_SERIES';
    targetVariable: string;
    features: string[];
    trainingData: {
        records: number;
        startDate: Date;
        endDate: Date;
    };
    performance: {
        accuracy: number;
        precision: number;
        recall: number;
        f1Score: number;
    };
    hyperparameters: Record<string, any>;
    status: 'TRAINING' | 'TRAINED' | 'DEPLOYED' | 'DEPRECATED';
    lastTrainedAt: Date;
}
interface TurnoverAnalysis {
    period: string;
    department: string;
    totalHeadcount: number;
    separations: {
        voluntary: number;
        involuntary: number;
        retirement: number;
        total: number;
    };
    turnoverRate: number;
    retentionRate: number;
    averageTenure: number;
    topReasons: Array<{
        reason: string;
        count: number;
        percentage: number;
    }>;
    costOfTurnover: number;
    trend: 'IMPROVING' | 'STABLE' | 'WORSENING';
}
interface TurnoverPrediction {
    employeeId: string;
    employeeName: string;
    department: string;
    riskScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    predictionFactors: Array<{
        factor: string;
        impact: number;
        description: string;
    }>;
    recommendedActions: string[];
    confidenceLevel: number;
}
interface DiversityMetrics {
    period: string;
    organizationUnit: string;
    demographics: {
        gender: Record<string, number>;
        ethnicity: Record<string, number>;
        age: Record<string, number>;
        veteranStatus: Record<string, number>;
        disability: Record<string, number>;
    };
    representation: {
        leadership: Record<string, number>;
        technical: Record<string, number>;
        overall: Record<string, number>;
    };
    payEquity: {
        genderPayGap: number;
        ethnicityPayGap: number;
        adjustedPayGap: number;
    };
    inclusionScore: number;
    diversityIndex: number;
    trends: Record<string, number>;
}
interface CompensationAnalytics {
    period: string;
    department: string;
    statistics: {
        mean: number;
        median: number;
        min: number;
        max: number;
        standardDeviation: number;
        percentiles: Record<string, number>;
    };
    compaRatio: number;
    marketPosition: number;
    internalEquity: number;
    budgetUtilization: number;
    increaseAnalysis: {
        merit: number;
        promotion: number;
        adjustment: number;
        total: number;
    };
    compression: {
        detected: boolean;
        severity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
        affectedEmployees: number;
    };
}
interface RecruitmentMetrics {
    period: string;
    department: string;
    metrics: {
        requisitions: number;
        applicants: number;
        screened: number;
        interviewed: number;
        offers: number;
        hires: number;
    };
    conversionRates: {
        applicantToScreen: number;
        screenToInterview: number;
        interviewToOffer: number;
        offerToHire: number;
    };
    timeMetrics: {
        timeToFill: number;
        timeToHire: number;
        timeToOffer: number;
        timeToAccept: number;
    };
    costMetrics: {
        costPerHire: number;
        costPerApplicant: number;
        totalRecruitmentCost: number;
    };
    qualityMetrics: {
        offerAcceptanceRate: number;
        firstYearRetention: number;
        performanceRating: number;
    };
    sources: Array<{
        source: string;
        applicants: number;
        hires: number;
        cost: number;
        quality: number;
    }>;
}
interface PerformanceAnalytics {
    period: string;
    organizationUnit: string;
    ratingDistribution: Record<string, number>;
    averageRating: number;
    topPerformers: number;
    bottomPerformers: number;
    performanceByDemographic: Record<string, Record<string, number>>;
    performanceByTenure: Record<string, number>;
    goalCompletion: {
        completed: number;
        inProgress: number;
        notStarted: number;
        avgCompletionRate: number;
    };
    calibrationMetrics: {
        variance: number;
        consistency: number;
        raterReliability: number;
    };
}
interface LearningDevelopmentROI {
    period: string;
    programName: string;
    participants: number;
    completionRate: number;
    costs: {
        development: number;
        delivery: number;
        materials: number;
        lostProductivity: number;
        total: number;
    };
    benefits: {
        productivity: number;
        retention: number;
        quality: number;
        total: number;
    };
    roi: number;
    paybackPeriod: number;
    netBenefit: number;
    skillsGainedCount: number;
    certificationRate: number;
}
interface ProductivityMetrics {
    period: string;
    department: string;
    revenuePerEmployee: number;
    outputPerEmployee: number;
    utilizationRate: number;
    absenteeismRate: number;
    overtimeRate: number;
    efficiency: {
        current: number;
        target: number;
        variance: number;
    };
    benchmarks: {
        internal: number;
        industry: number;
        gap: number;
    };
    trends: Array<{
        period: string;
        value: number;
    }>;
}
interface ExecutiveScorecard {
    scorecardId: string;
    period: string;
    organizationUnit: string;
    strategicObjectives: Array<{
        objective: string;
        kpis: Array<{
            kpi: string;
            current: number;
            target: number;
            status: 'ON_TARGET' | 'AT_RISK' | 'OFF_TARGET';
            trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
        }>;
    }>;
    overallScore: number;
    performanceRating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    criticalAlerts: Array<{
        severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        message: string;
        impact: string;
        recommendedAction: string;
    }>;
}
interface DataExportRequest {
    exportId: string;
    dataSource: string;
    format: 'CSV' | 'EXCEL' | 'JSON' | 'XML' | 'PARQUET';
    filters: Record<string, any>;
    fields: string[];
    scheduledExport: boolean;
    schedule?: {
        frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
        time: string;
    };
    destination: {
        type: 'DOWNLOAD' | 'EMAIL' | 'SFTP' | 'S3' | 'API';
        config: Record<string, any>;
    };
}
/**
 * Sequelize model for HR Reports with versioning and scheduling.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} HRReport model
 *
 * @example
 * ```typescript
 * const HRReport = createHRReportModel(sequelize);
 * const report = await HRReport.create({
 *   reportName: 'Monthly Headcount Report',
 *   reportType: 'STANDARD',
 *   category: 'WORKFORCE',
 *   outputFormat: 'EXCEL'
 * });
 * ```
 */
export declare const createHRReportModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        reportId: string;
        reportName: string;
        reportType: string;
        category: string;
        description: string;
        generatedBy: string;
        generatedAt: Date;
        parameters: Record<string, any>;
        outputFormat: string;
        dataSource: string;
        filters: Array<{
            field: string;
            operator: string;
            value: any;
        }>;
        status: string;
        downloadUrl: string | null;
        expiresAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Dashboard Widgets with real-time data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DashboardWidget model
 *
 * @example
 * ```typescript
 * const Widget = createDashboardWidgetModel(sequelize);
 * const widget = await Widget.create({
 *   widgetType: 'CHART',
 *   title: 'Headcount Trend',
 *   dataSource: 'headcount_metrics'
 * });
 * ```
 */
export declare const createDashboardWidgetModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        widgetId: string;
        dashboardId: string;
        widgetType: string;
        title: string;
        dataSource: string;
        query: Record<string, any>;
        visualization: Record<string, any>;
        refreshInterval: number | null;
        filters: Record<string, any>;
        position: Record<string, any>;
        permissions: string[];
        cacheEnabled: boolean;
        cacheTTL: number;
        enabled: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Predictive Models with performance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PredictiveModel model
 *
 * @example
 * ```typescript
 * const Model = createPredictiveModelModel(sequelize);
 * const model = await Model.create({
 *   modelName: 'Turnover Prediction',
 *   modelType: 'CLASSIFICATION',
 *   targetVariable: 'will_leave'
 * });
 * ```
 */
export declare const createPredictiveModelModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        modelId: string;
        modelName: string;
        modelType: string;
        targetVariable: string;
        features: string[];
        trainingDataInfo: Record<string, any>;
        performanceMetrics: Record<string, any>;
        hyperparameters: Record<string, any>;
        status: string;
        version: number;
        lastTrainedAt: Date;
        trainedBy: string;
        deployedAt: Date | null;
        deprecatedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Generates standard headcount report by department and location.
 *
 * @param {Date} asOfDate - As-of date
 * @param {Record<string, any>} [filters] - Optional filters
 * @returns {Promise<HRReport>} Headcount report
 *
 * @example
 * ```typescript
 * const report = await generateHeadcountReport(new Date(), {
 *   department: 'Engineering',
 *   employmentType: 'FULL_TIME'
 * });
 * ```
 */
export declare const generateHeadcountReport: (asOfDate: Date, filters?: Record<string, any>) => Promise<HRReport>;
/**
 * Generates turnover and retention report.
 *
 * @param {string} period - Reporting period
 * @param {Record<string, any>} [filters] - Optional filters
 * @returns {Promise<HRReport>} Turnover report
 *
 * @example
 * ```typescript
 * const report = await generateTurnoverReport('2025-Q1', { department: 'Sales' });
 * ```
 */
export declare const generateTurnoverReport: (period: string, filters?: Record<string, any>) => Promise<HRReport>;
/**
 * Generates diversity and inclusion metrics report.
 *
 * @param {string} period - Reporting period
 * @param {string} organizationUnit - Organization unit
 * @returns {Promise<HRReport>} Diversity report
 *
 * @example
 * ```typescript
 * const report = await generateDiversityReport('2025-Q1', 'Corporate');
 * ```
 */
export declare const generateDiversityReport: (period: string, organizationUnit: string) => Promise<HRReport>;
/**
 * Generates compensation analysis report.
 *
 * @param {string} period - Reporting period
 * @param {Record<string, any>} [filters] - Optional filters
 * @returns {Promise<HRReport>} Compensation report
 *
 * @example
 * ```typescript
 * const report = await generateCompensationReport('2025', { jobLevel: 'SENIOR' });
 * ```
 */
export declare const generateCompensationReport: (period: string, filters?: Record<string, any>) => Promise<HRReport>;
/**
 * Generates performance review summary report.
 *
 * @param {string} reviewCycle - Review cycle identifier
 * @param {string} [department] - Optional department filter
 * @returns {Promise<HRReport>} Performance report
 *
 * @example
 * ```typescript
 * const report = await generatePerformanceReport('2025-ANNUAL', 'Engineering');
 * ```
 */
export declare const generatePerformanceReport: (reviewCycle: string, department?: string) => Promise<HRReport>;
/**
 * Creates custom report with user-defined dimensions and metrics.
 *
 * @param {Partial<CustomReportBuilder>} reportConfig - Report configuration
 * @param {string} userId - User creating report
 * @returns {Promise<CustomReportBuilder>} Created custom report
 *
 * @example
 * ```typescript
 * const report = await createCustomReport({
 *   reportName: 'Engineering Headcount by Skill',
 *   dimensions: ['department', 'skill_category'],
 *   metrics: ['headcount', 'avg_tenure']
 * }, 'user123');
 * ```
 */
export declare const createCustomReport: (reportConfig: Partial<CustomReportBuilder>, userId: string) => Promise<CustomReportBuilder>;
/**
 * Adds dimensions to custom report.
 *
 * @param {string} reportId - Report identifier
 * @param {string[]} dimensions - Dimensions to add
 * @returns {Promise<CustomReportBuilder>} Updated report
 *
 * @example
 * ```typescript
 * const updated = await addReportDimensions('CUSTOM-123', ['location', 'job_level']);
 * ```
 */
export declare const addReportDimensions: (reportId: string, dimensions: string[]) => Promise<CustomReportBuilder>;
/**
 * Adds metrics to custom report.
 *
 * @param {string} reportId - Report identifier
 * @param {string[]} metrics - Metrics to add
 * @param {Record<string, 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT'>} [aggregations] - Aggregation functions
 * @returns {Promise<CustomReportBuilder>} Updated report
 *
 * @example
 * ```typescript
 * const updated = await addReportMetrics('CUSTOM-123', ['salary', 'bonus'], {
 *   salary: 'AVG',
 *   bonus: 'SUM'
 * });
 * ```
 */
export declare const addReportMetrics: (reportId: string, metrics: string[], aggregations?: Record<string, "SUM" | "AVG" | "MIN" | "MAX" | "COUNT">) => Promise<CustomReportBuilder>;
/**
 * Applies filters to custom report.
 *
 * @param {string} reportId - Report identifier
 * @param {Array<{ field: string; operator: string; value: any }>} filters - Filters to apply
 * @returns {Promise<CustomReportBuilder>} Updated report
 *
 * @example
 * ```typescript
 * const updated = await applyReportFilters('CUSTOM-123', [
 *   { field: 'department', operator: '=', value: 'Engineering' },
 *   { field: 'hire_date', operator: '>=', value: '2023-01-01' }
 * ]);
 * ```
 */
export declare const applyReportFilters: (reportId: string, filters: Array<{
    field: string;
    operator: string;
    value: any;
}>) => Promise<CustomReportBuilder>;
/**
 * Saves custom report as reusable template.
 *
 * @param {CustomReportBuilder} report - Report to save
 * @param {string} userId - User saving template
 * @returns {Promise<{ templateId: string; savedAt: Date }>} Saved template info
 *
 * @example
 * ```typescript
 * const template = await saveCustomReportTemplate(report, 'user123');
 * ```
 */
export declare const saveCustomReportTemplate: (report: CustomReportBuilder, userId: string) => Promise<{
    templateId: string;
    savedAt: Date;
}>;
/**
 * Creates interactive dashboard with multiple widgets.
 *
 * @param {Partial<Dashboard>} dashboardConfig - Dashboard configuration
 * @param {string} userId - User creating dashboard
 * @returns {Promise<Dashboard>} Created dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await createDashboard({
 *   dashboardName: 'Executive HR Dashboard',
 *   category: 'EXECUTIVE',
 *   widgets: []
 * }, 'exec123');
 * ```
 */
export declare const createDashboard: (dashboardConfig: Partial<Dashboard>, userId: string) => Promise<Dashboard>;
/**
 * Adds widget to dashboard.
 *
 * @param {string} dashboardId - Dashboard identifier
 * @param {Partial<DashboardWidget>} widgetConfig - Widget configuration
 * @returns {Promise<DashboardWidget>} Created widget
 *
 * @example
 * ```typescript
 * const widget = await addDashboardWidget('DASH-123', {
 *   widgetType: 'CHART',
 *   title: 'Headcount Trend',
 *   dataSource: 'employee_counts'
 * });
 * ```
 */
export declare const addDashboardWidget: (dashboardId: string, widgetConfig: Partial<DashboardWidget>) => Promise<DashboardWidget>;
/**
 * Generates real-time metrics for dashboard widget.
 *
 * @param {string} widgetId - Widget identifier
 * @returns {Promise<{ data: any[]; lastUpdated: Date; nextRefresh: Date }>} Real-time data
 *
 * @example
 * ```typescript
 * const data = await generateRealtimeMetrics('WDG-123');
 * ```
 */
export declare const generateRealtimeMetrics: (widgetId: string) => Promise<{
    data: any[];
    lastUpdated: Date;
    nextRefresh: Date;
}>;
/**
 * Configures widget visualization settings.
 *
 * @param {string} widgetId - Widget identifier
 * @param {'BAR' | 'LINE' | 'PIE' | 'DONUT' | 'AREA' | 'SCATTER'} chartType - Chart type
 * @param {Record<string, any>} config - Visualization config
 * @returns {Promise<DashboardWidget>} Updated widget
 *
 * @example
 * ```typescript
 * const widget = await configureWidgetVisualization('WDG-123', 'LINE', {
 *   xAxis: 'period',
 *   yAxis: 'headcount',
 *   colors: ['#0066CC']
 * });
 * ```
 */
export declare const configureWidgetVisualization: (widgetId: string, chartType: "BAR" | "LINE" | "PIE" | "DONUT" | "AREA" | "SCATTER", config: Record<string, any>) => Promise<DashboardWidget>;
/**
 * Exports dashboard data for offline analysis.
 *
 * @param {string} dashboardId - Dashboard identifier
 * @param {'CSV' | 'EXCEL' | 'JSON'} format - Export format
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const data = await exportDashboardData('DASH-123', 'EXCEL');
 * ```
 */
export declare const exportDashboardData: (dashboardId: string, format: "CSV" | "EXCEL" | "JSON") => Promise<Buffer>;
/**
 * Creates and trains turnover prediction model.
 *
 * @param {string[]} features - Feature variables
 * @param {Record<string, any>} trainingConfig - Training configuration
 * @returns {Promise<PredictiveModel>} Trained model
 *
 * @example
 * ```typescript
 * const model = await trainTurnoverPredictionModel([
 *   'tenure', 'performance_rating', 'compensation_ratio', 'engagement_score'
 * ], { algorithm: 'RANDOM_FOREST', testSize: 0.2 });
 * ```
 */
export declare const trainTurnoverPredictionModel: (features: string[], trainingConfig: Record<string, any>) => Promise<PredictiveModel>;
/**
 * Predicts employee turnover risk using trained model.
 *
 * @param {string} modelId - Model identifier
 * @param {string[]} employeeIds - Employee identifiers
 * @returns {Promise<TurnoverPrediction[]>} Turnover predictions
 *
 * @example
 * ```typescript
 * const predictions = await predictEmployeeTurnover('MODEL-123', ['EMP-001', 'EMP-002']);
 * ```
 */
export declare const predictEmployeeTurnover: (modelId: string, employeeIds: string[]) => Promise<TurnoverPrediction[]>;
/**
 * Trains performance prediction model.
 *
 * @param {string[]} features - Feature variables
 * @param {Record<string, any>} trainingConfig - Training configuration
 * @returns {Promise<PredictiveModel>} Trained model
 *
 * @example
 * ```typescript
 * const model = await trainPerformancePredictionModel([
 *   'education_level', 'prior_experience', 'skills_match', 'training_hours'
 * ], { algorithm: 'GRADIENT_BOOSTING' });
 * ```
 */
export declare const trainPerformancePredictionModel: (features: string[], trainingConfig: Record<string, any>) => Promise<PredictiveModel>;
/**
 * Evaluates model performance and generates metrics.
 *
 * @param {string} modelId - Model identifier
 * @param {any[]} testData - Test dataset
 * @returns {Promise<{ accuracy: number; precision: number; recall: number; f1Score: number; confusionMatrix: number[][] }>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await evaluateModelPerformance('MODEL-123', testData);
 * ```
 */
export declare const evaluateModelPerformance: (modelId: string, testData: any[]) => Promise<{
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix: number[][];
}>;
/**
 * Retrains model with updated data.
 *
 * @param {string} modelId - Model identifier
 * @param {Date} startDate - Training data start date
 * @param {Date} endDate - Training data end date
 * @returns {Promise<PredictiveModel>} Retrained model
 *
 * @example
 * ```typescript
 * const model = await retrainModel('MODEL-123', new Date('2021-01-01'), new Date('2025-01-01'));
 * ```
 */
export declare const retrainModel: (modelId: string, startDate: Date, endDate: Date) => Promise<PredictiveModel>;
/**
 * Analyzes turnover patterns and trends.
 *
 * @param {string} department - Department identifier
 * @param {string} period - Reporting period
 * @returns {Promise<TurnoverAnalysis>} Turnover analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeTurnoverPatterns('Engineering', '2025-Q1');
 * ```
 */
export declare const analyzeTurnoverPatterns: (department: string, period: string) => Promise<TurnoverAnalysis>;
/**
 * Calculates turnover cost impact.
 *
 * @param {number} numberOfSeparations - Number of separations
 * @param {number} averageSalary - Average salary
 * @param {Record<string, any>} [costFactors] - Cost factors
 * @returns {Promise<{ recruitmentCost: number; trainingCost: number; productivityLoss: number; totalCost: number }>} Cost breakdown
 *
 * @example
 * ```typescript
 * const cost = await calculateTurnoverCost(15, 85000, { recruitmentMultiplier: 0.3 });
 * ```
 */
export declare const calculateTurnoverCost: (numberOfSeparations: number, averageSalary: number, costFactors?: Record<string, any>) => Promise<{
    recruitmentCost: number;
    trainingCost: number;
    productivityLoss: number;
    totalCost: number;
}>;
/**
 * Identifies flight risk employees.
 *
 * @param {string} department - Department identifier
 * @param {number} [riskThreshold=70] - Risk score threshold
 * @returns {Promise<TurnoverPrediction[]>} At-risk employees
 *
 * @example
 * ```typescript
 * const atRisk = await identifyFlightRisk('Engineering', 75);
 * ```
 */
export declare const identifyFlightRisk: (department: string, riskThreshold?: number) => Promise<TurnoverPrediction[]>;
/**
 * Benchmarks turnover rates against industry.
 *
 * @param {string} department - Department identifier
 * @param {string} industryCode - Industry classification
 * @returns {Promise<{ internal: number; industry: number; variance: number; ranking: string }>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkTurnoverRates('IT', 'NAICS-541512');
 * ```
 */
export declare const benchmarkTurnoverRates: (department: string, industryCode: string) => Promise<{
    internal: number;
    industry: number;
    variance: number;
    ranking: string;
}>;
/**
 * Generates comprehensive diversity metrics.
 *
 * @param {string} period - Reporting period
 * @param {string} organizationUnit - Organization unit
 * @returns {Promise<DiversityMetrics>} Diversity metrics
 *
 * @example
 * ```typescript
 * const metrics = await generateDiversityMetrics('2025-Q1', 'Engineering');
 * ```
 */
export declare const generateDiversityMetrics: (period: string, organizationUnit: string) => Promise<DiversityMetrics>;
/**
 * Analyzes pay equity across demographic groups.
 *
 * @param {string} period - Reporting period
 * @param {string[]} dimensions - Demographic dimensions
 * @returns {Promise<Array<{ dimension: string; gap: number; adjustedGap: number; significance: string }>>} Pay equity analysis
 *
 * @example
 * ```typescript
 * const equity = await analyzePayEquity('2025', ['gender', 'ethnicity']);
 * ```
 */
export declare const analyzePayEquity: (period: string, dimensions: string[]) => Promise<Array<{
    dimension: string;
    gap: number;
    adjustedGap: number;
    significance: string;
}>>;
/**
 * Tracks diversity hiring and promotion trends.
 *
 * @param {string} period - Reporting period
 * @param {number} numberOfPeriods - Number of periods to track
 * @returns {Promise<Array<{ period: string; hires: Record<string, number>; promotions: Record<string, number> }>>} Diversity trends
 *
 * @example
 * ```typescript
 * const trends = await trackDiversityTrends('2025-Q1', 4);
 * ```
 */
export declare const trackDiversityTrends: (period: string, numberOfPeriods: number) => Promise<Array<{
    period: string;
    hires: Record<string, number>;
    promotions: Record<string, number>;
}>>;
/**
 * Calculates inclusion index based on survey data.
 *
 * @param {string} period - Reporting period
 * @param {Record<string, number>} surveyResponses - Survey response scores
 * @returns {Promise<{ inclusionIndex: number; benchmarkComparison: number; strengths: string[]; improvements: string[] }>} Inclusion analysis
 *
 * @example
 * ```typescript
 * const inclusion = await calculateInclusionIndex('2025-Q1', {
 *   belonging: 7.8,
 *   fairness: 8.2,
 *   voice: 7.5
 * });
 * ```
 */
export declare const calculateInclusionIndex: (period: string, surveyResponses: Record<string, number>) => Promise<{
    inclusionIndex: number;
    benchmarkComparison: number;
    strengths: string[];
    improvements: string[];
}>;
/**
 * Analyzes compensation distribution and statistics.
 *
 * @param {string} period - Reporting period
 * @param {string} department - Department identifier
 * @returns {Promise<CompensationAnalytics>} Compensation analytics
 *
 * @example
 * ```typescript
 * const analytics = await analyzeCompensationDistribution('2025', 'Engineering');
 * ```
 */
export declare const analyzeCompensationDistribution: (period: string, department: string) => Promise<CompensationAnalytics>;
/**
 * Calculates compa-ratio by job level and department.
 *
 * @param {string} period - Reporting period
 * @param {Record<string, any>} [filters] - Optional filters
 * @returns {Promise<Array<{ jobLevel: string; department: string; compaRatio: number; marketPosition: string }>>} Compa-ratio analysis
 *
 * @example
 * ```typescript
 * const compaRatios = await calculateCompaRatio('2025', { department: 'Engineering' });
 * ```
 */
export declare const calculateCompaRatio: (period: string, filters?: Record<string, any>) => Promise<Array<{
    jobLevel: string;
    department: string;
    compaRatio: number;
    marketPosition: string;
}>>;
/**
 * Identifies compensation compression and inversion.
 *
 * @param {string} department - Department identifier
 * @returns {Promise<{ compression: any[]; inversion: any[] }>} Compression analysis
 *
 * @example
 * ```typescript
 * const issues = await identifyCompressionIssues('Engineering');
 * ```
 */
export declare const identifyCompressionIssues: (department: string) => Promise<{
    compression: any[];
    inversion: any[];
}>;
/**
 * Generates compensation budget recommendations.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} department - Department identifier
 * @param {Record<string, any>} constraints - Budget constraints
 * @returns {Promise<{ totalBudget: number; meritPool: number; promotionPool: number; adjustmentPool: number; recommendations: string[] }>} Budget recommendations
 *
 * @example
 * ```typescript
 * const budget = await generateCompensationBudget(2025, 'Engineering', {
 *   maxIncrease: 5,
 *   targetCompaRatio: 1.0
 * });
 * ```
 */
export declare const generateCompensationBudget: (fiscalYear: number, department: string, constraints: Record<string, any>) => Promise<{
    totalBudget: number;
    meritPool: number;
    promotionPool: number;
    adjustmentPool: number;
    recommendations: string[];
}>;
/**
 * Analyzes recruitment funnel metrics.
 *
 * @param {string} period - Reporting period
 * @param {string} [department] - Optional department filter
 * @returns {Promise<RecruitmentMetrics>} Recruitment metrics
 *
 * @example
 * ```typescript
 * const metrics = await analyzeRecruitmentFunnel('2025-Q1', 'Engineering');
 * ```
 */
export declare const analyzeRecruitmentFunnel: (period: string, department?: string) => Promise<RecruitmentMetrics>;
/**
 * Calculates quality of hire metrics.
 *
 * @param {string} cohort - Hire cohort identifier
 * @param {number} evaluationPeriod - Evaluation period (months)
 * @returns {Promise<{ performanceRating: number; retention: number; productivity: number; qualityScore: number }>} Quality metrics
 *
 * @example
 * ```typescript
 * const quality = await calculateQualityOfHire('2024-Q1', 12);
 * ```
 */
export declare const calculateQualityOfHire: (cohort: string, evaluationPeriod: number) => Promise<{
    performanceRating: number;
    retention: number;
    productivity: number;
    qualityScore: number;
}>;
/**
 * Analyzes recruitment source effectiveness.
 *
 * @param {string} period - Reporting period
 * @returns {Promise<Array<{ source: string; applicants: number; hires: number; costPerHire: number; quality: number; roi: number }>>} Source analysis
 *
 * @example
 * ```typescript
 * const sources = await analyzeRecruitmentSources('2025-Q1');
 * ```
 */
export declare const analyzeRecruitmentSources: (period: string) => Promise<Array<{
    source: string;
    applicants: number;
    hires: number;
    costPerHire: number;
    quality: number;
    roi: number;
}>>;
/**
 * Optimizes recruitment channel mix.
 *
 * @param {Record<string, any>} targetMetrics - Target metrics
 * @param {number} budget - Available budget
 * @returns {Promise<{ allocation: Record<string, number>; projectedHires: number; projectedQuality: number }>} Optimized mix
 *
 * @example
 * ```typescript
 * const optimized = await optimizeRecruitmentChannels({
 *   targetHires: 50,
 *   minQuality: 4.0
 * }, 250000);
 * ```
 */
export declare const optimizeRecruitmentChannels: (targetMetrics: Record<string, any>, budget: number) => Promise<{
    allocation: Record<string, number>;
    projectedHires: number;
    projectedQuality: number;
}>;
/**
 * Analyzes performance rating distribution.
 *
 * @param {string} reviewCycle - Review cycle identifier
 * @param {string} [organizationUnit] - Optional organization filter
 * @returns {Promise<PerformanceAnalytics>} Performance analytics
 *
 * @example
 * ```typescript
 * const analytics = await analyzePerformanceDistribution('2025-ANNUAL', 'Engineering');
 * ```
 */
export declare const analyzePerformanceDistribution: (reviewCycle: string, organizationUnit?: string) => Promise<PerformanceAnalytics>;
/**
 * Identifies performance outliers and anomalies.
 *
 * @param {string} reviewCycle - Review cycle identifier
 * @returns {Promise<{ highPerformers: any[]; lowPerformers: any[]; inconsistentRatings: any[] }>} Performance outliers
 *
 * @example
 * ```typescript
 * const outliers = await identifyPerformanceOutliers('2025-ANNUAL');
 * ```
 */
export declare const identifyPerformanceOutliers: (reviewCycle: string) => Promise<{
    highPerformers: any[];
    lowPerformers: any[];
    inconsistentRatings: any[];
}>;
/**
 * Analyzes goal completion rates and patterns.
 *
 * @param {string} reviewCycle - Review cycle identifier
 * @param {string} [department] - Optional department filter
 * @returns {Promise<{ completionRate: number; onTime: number; delayed: number; abandoned: number; byCategory: Record<string, number> }>} Goal analysis
 *
 * @example
 * ```typescript
 * const goals = await analyzeGoalCompletion('2025-ANNUAL', 'Sales');
 * ```
 */
export declare const analyzeGoalCompletion: (reviewCycle: string, department?: string) => Promise<{
    completionRate: number;
    onTime: number;
    delayed: number;
    abandoned: number;
    byCategory: Record<string, number>;
}>;
/**
 * Calculates learning program ROI.
 *
 * @param {string} programName - Program name
 * @param {string} period - Reporting period
 * @returns {Promise<LearningDevelopmentROI>} Learning ROI analysis
 *
 * @example
 * ```typescript
 * const roi = await calculateLearningROI('Leadership Development Program', '2025');
 * ```
 */
export declare const calculateLearningROI: (programName: string, period: string) => Promise<LearningDevelopmentROI>;
/**
 * Analyzes training effectiveness and impact.
 *
 * @param {string} programId - Program identifier
 * @param {number} evaluationPeriod - Evaluation period (months)
 * @returns {Promise<{ skillImprovement: number; performanceImpact: number; retentionImpact: number; effectiveness: number }>} Training effectiveness
 *
 * @example
 * ```typescript
 * const effectiveness = await analyzeTrainingEffectiveness('PROG-123', 6);
 * ```
 */
export declare const analyzeTrainingEffectiveness: (programId: string, evaluationPeriod: number) => Promise<{
    skillImprovement: number;
    performanceImpact: number;
    retentionImpact: number;
    effectiveness: number;
}>;
/**
 * Tracks learning completion and engagement.
 *
 * @param {string} period - Reporting period
 * @param {Record<string, any>} [filters] - Optional filters
 * @returns {Promise<{ enrolled: number; inProgress: number; completed: number; completionRate: number; avgEngagement: number }>} Learning metrics
 *
 * @example
 * ```typescript
 * const metrics = await trackLearningCompletion('2025-Q1', { department: 'Engineering' });
 * ```
 */
export declare const trackLearningCompletion: (period: string, filters?: Record<string, any>) => Promise<{
    enrolled: number;
    inProgress: number;
    completed: number;
    completionRate: number;
    avgEngagement: number;
}>;
/**
 * Analyzes workforce productivity metrics.
 *
 * @param {string} period - Reporting period
 * @param {string} department - Department identifier
 * @returns {Promise<ProductivityMetrics>} Productivity metrics
 *
 * @example
 * ```typescript
 * const productivity = await analyzeWorkforceProductivity('2025-Q1', 'Engineering');
 * ```
 */
export declare const analyzeWorkforceProductivity: (period: string, department: string) => Promise<ProductivityMetrics>;
/**
 * Calculates revenue per employee metrics.
 *
 * @param {string} period - Reporting period
 * @param {Record<string, any>} [filters] - Optional filters
 * @returns {Promise<Array<{ department: string; revenuePerEmployee: number; trend: number; benchmark: number }>>} Revenue per employee
 *
 * @example
 * ```typescript
 * const metrics = await calculateRevenuePerEmployee('2025', { division: 'Technology' });
 * ```
 */
export declare const calculateRevenuePerEmployee: (period: string, filters?: Record<string, any>) => Promise<Array<{
    department: string;
    revenuePerEmployee: number;
    trend: number;
    benchmark: number;
}>>;
/**
 * Analyzes absenteeism and attendance patterns.
 *
 * @param {string} period - Reporting period
 * @param {string} [department] - Optional department filter
 * @returns {Promise<{ absenteeismRate: number; avgDaysAbsent: number; topReasons: Array<{ reason: string; percentage: number }> }>} Absenteeism analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeAbsenteeismPatterns('2025-Q1', 'Manufacturing');
 * ```
 */
export declare const analyzeAbsenteeismPatterns: (period: string, department?: string) => Promise<{
    absenteeismRate: number;
    avgDaysAbsent: number;
    topReasons: Array<{
        reason: string;
        percentage: number;
    }>;
}>;
/**
 * Generates executive HR scorecard.
 *
 * @param {string} period - Reporting period
 * @param {string} organizationUnit - Organization unit
 * @returns {Promise<ExecutiveScorecard>} Executive scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateExecutiveScorecard('2025-Q1', 'Corporate');
 * ```
 */
export declare const generateExecutiveScorecard: (period: string, organizationUnit: string) => Promise<ExecutiveScorecard>;
/**
 * Tracks strategic HR KPIs.
 *
 * @param {string} organizationUnit - Organization unit
 * @param {number} numberOfPeriods - Number of periods to track
 * @returns {Promise<Array<{ period: string; kpis: Record<string, number> }>>} KPI history
 *
 * @example
 * ```typescript
 * const history = await trackStrategicHRKPIs('Corporate', 6);
 * ```
 */
export declare const trackStrategicHRKPIs: (organizationUnit: string, numberOfPeriods: number) => Promise<Array<{
    period: string;
    kpis: Record<string, number>;
}>>;
/**
 * Exports HR data to specified format and destination.
 *
 * @param {Partial<DataExportRequest>} exportRequest - Export request
 * @returns {Promise<{ exportId: string; status: string; downloadUrl?: string }>} Export result
 *
 * @example
 * ```typescript
 * const export = await exportHRData({
 *   dataSource: 'employees',
 *   format: 'EXCEL',
 *   fields: ['employeeId', 'name', 'department', 'salary']
 * });
 * ```
 */
export declare const exportHRData: (exportRequest: Partial<DataExportRequest>) => Promise<{
    exportId: string;
    status: string;
    downloadUrl?: string;
}>;
/**
 * Schedules automated data export.
 *
 * @param {Partial<DataExportRequest>} exportConfig - Export configuration
 * @returns {Promise<{ scheduleId: string; nextRun: Date; enabled: boolean }>} Export schedule
 *
 * @example
 * ```typescript
 * const schedule = await scheduleDataExport({
 *   dataSource: 'headcount',
 *   format: 'CSV',
 *   schedule: { frequency: 'MONTHLY', time: '08:00' }
 * });
 * ```
 */
export declare const scheduleDataExport: (exportConfig: Partial<DataExportRequest>) => Promise<{
    scheduleId: string;
    nextRun: Date;
    enabled: boolean;
}>;
/**
 * Integrates with external HR systems (HRIS, ATS, LMS).
 *
 * @param {string} systemType - External system type
 * @param {'IMPORT' | 'EXPORT' | 'SYNC'} operation - Integration operation
 * @param {Record<string, any>} config - Integration config
 * @returns {Promise<{ integrationId: string; status: string; recordsProcessed: number }>} Integration result
 *
 * @example
 * ```typescript
 * const result = await integrateExternalSystem('ATS', 'IMPORT', {
 *   endpoint: 'https://ats.example.com/api',
 *   dataType: 'applicants'
 * });
 * ```
 */
export declare const integrateExternalSystem: (systemType: string, operation: "IMPORT" | "EXPORT" | "SYNC", config: Record<string, any>) => Promise<{
    integrationId: string;
    status: string;
    recordsProcessed: number;
}>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createHRReportModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            reportId: string;
            reportName: string;
            reportType: string;
            category: string;
            description: string;
            generatedBy: string;
            generatedAt: Date;
            parameters: Record<string, any>;
            outputFormat: string;
            dataSource: string;
            filters: Array<{
                field: string;
                operator: string;
                value: any;
            }>;
            status: string;
            downloadUrl: string | null;
            expiresAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createDashboardWidgetModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            widgetId: string;
            dashboardId: string;
            widgetType: string;
            title: string;
            dataSource: string;
            query: Record<string, any>;
            visualization: Record<string, any>;
            refreshInterval: number | null;
            filters: Record<string, any>;
            position: Record<string, any>;
            permissions: string[];
            cacheEnabled: boolean;
            cacheTTL: number;
            enabled: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createPredictiveModelModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            modelId: string;
            modelName: string;
            modelType: string;
            targetVariable: string;
            features: string[];
            trainingDataInfo: Record<string, any>;
            performanceMetrics: Record<string, any>;
            hyperparameters: Record<string, any>;
            status: string;
            version: number;
            lastTrainedAt: Date;
            trainedBy: string;
            deployedAt: Date | null;
            deprecatedAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    generateHeadcountReport: (asOfDate: Date, filters?: Record<string, any>) => Promise<HRReport>;
    generateTurnoverReport: (period: string, filters?: Record<string, any>) => Promise<HRReport>;
    generateDiversityReport: (period: string, organizationUnit: string) => Promise<HRReport>;
    generateCompensationReport: (period: string, filters?: Record<string, any>) => Promise<HRReport>;
    generatePerformanceReport: (reviewCycle: string, department?: string) => Promise<HRReport>;
    createCustomReport: (reportConfig: Partial<CustomReportBuilder>, userId: string) => Promise<CustomReportBuilder>;
    addReportDimensions: (reportId: string, dimensions: string[]) => Promise<CustomReportBuilder>;
    addReportMetrics: (reportId: string, metrics: string[], aggregations?: Record<string, "SUM" | "AVG" | "MIN" | "MAX" | "COUNT">) => Promise<CustomReportBuilder>;
    applyReportFilters: (reportId: string, filters: Array<{
        field: string;
        operator: string;
        value: any;
    }>) => Promise<CustomReportBuilder>;
    saveCustomReportTemplate: (report: CustomReportBuilder, userId: string) => Promise<{
        templateId: string;
        savedAt: Date;
    }>;
    createDashboard: (dashboardConfig: Partial<Dashboard>, userId: string) => Promise<Dashboard>;
    addDashboardWidget: (dashboardId: string, widgetConfig: Partial<DashboardWidget>) => Promise<DashboardWidget>;
    generateRealtimeMetrics: (widgetId: string) => Promise<{
        data: any[];
        lastUpdated: Date;
        nextRefresh: Date;
    }>;
    configureWidgetVisualization: (widgetId: string, chartType: "BAR" | "LINE" | "PIE" | "DONUT" | "AREA" | "SCATTER", config: Record<string, any>) => Promise<DashboardWidget>;
    exportDashboardData: (dashboardId: string, format: "CSV" | "EXCEL" | "JSON") => Promise<Buffer>;
    trainTurnoverPredictionModel: (features: string[], trainingConfig: Record<string, any>) => Promise<PredictiveModel>;
    predictEmployeeTurnover: (modelId: string, employeeIds: string[]) => Promise<TurnoverPrediction[]>;
    trainPerformancePredictionModel: (features: string[], trainingConfig: Record<string, any>) => Promise<PredictiveModel>;
    evaluateModelPerformance: (modelId: string, testData: any[]) => Promise<{
        accuracy: number;
        precision: number;
        recall: number;
        f1Score: number;
        confusionMatrix: number[][];
    }>;
    retrainModel: (modelId: string, startDate: Date, endDate: Date) => Promise<PredictiveModel>;
    analyzeTurnoverPatterns: (department: string, period: string) => Promise<TurnoverAnalysis>;
    calculateTurnoverCost: (numberOfSeparations: number, averageSalary: number, costFactors?: Record<string, any>) => Promise<{
        recruitmentCost: number;
        trainingCost: number;
        productivityLoss: number;
        totalCost: number;
    }>;
    identifyFlightRisk: (department: string, riskThreshold?: number) => Promise<TurnoverPrediction[]>;
    benchmarkTurnoverRates: (department: string, industryCode: string) => Promise<{
        internal: number;
        industry: number;
        variance: number;
        ranking: string;
    }>;
    generateDiversityMetrics: (period: string, organizationUnit: string) => Promise<DiversityMetrics>;
    analyzePayEquity: (period: string, dimensions: string[]) => Promise<Array<{
        dimension: string;
        gap: number;
        adjustedGap: number;
        significance: string;
    }>>;
    trackDiversityTrends: (period: string, numberOfPeriods: number) => Promise<Array<{
        period: string;
        hires: Record<string, number>;
        promotions: Record<string, number>;
    }>>;
    calculateInclusionIndex: (period: string, surveyResponses: Record<string, number>) => Promise<{
        inclusionIndex: number;
        benchmarkComparison: number;
        strengths: string[];
        improvements: string[];
    }>;
    analyzeCompensationDistribution: (period: string, department: string) => Promise<CompensationAnalytics>;
    calculateCompaRatio: (period: string, filters?: Record<string, any>) => Promise<Array<{
        jobLevel: string;
        department: string;
        compaRatio: number;
        marketPosition: string;
    }>>;
    identifyCompressionIssues: (department: string) => Promise<{
        compression: any[];
        inversion: any[];
    }>;
    generateCompensationBudget: (fiscalYear: number, department: string, constraints: Record<string, any>) => Promise<{
        totalBudget: number;
        meritPool: number;
        promotionPool: number;
        adjustmentPool: number;
        recommendations: string[];
    }>;
    analyzeRecruitmentFunnel: (period: string, department?: string) => Promise<RecruitmentMetrics>;
    calculateQualityOfHire: (cohort: string, evaluationPeriod: number) => Promise<{
        performanceRating: number;
        retention: number;
        productivity: number;
        qualityScore: number;
    }>;
    analyzeRecruitmentSources: (period: string) => Promise<Array<{
        source: string;
        applicants: number;
        hires: number;
        costPerHire: number;
        quality: number;
        roi: number;
    }>>;
    optimizeRecruitmentChannels: (targetMetrics: Record<string, any>, budget: number) => Promise<{
        allocation: Record<string, number>;
        projectedHires: number;
        projectedQuality: number;
    }>;
    analyzePerformanceDistribution: (reviewCycle: string, organizationUnit?: string) => Promise<PerformanceAnalytics>;
    identifyPerformanceOutliers: (reviewCycle: string) => Promise<{
        highPerformers: any[];
        lowPerformers: any[];
        inconsistentRatings: any[];
    }>;
    analyzeGoalCompletion: (reviewCycle: string, department?: string) => Promise<{
        completionRate: number;
        onTime: number;
        delayed: number;
        abandoned: number;
        byCategory: Record<string, number>;
    }>;
    calculateLearningROI: (programName: string, period: string) => Promise<LearningDevelopmentROI>;
    analyzeTrainingEffectiveness: (programId: string, evaluationPeriod: number) => Promise<{
        skillImprovement: number;
        performanceImpact: number;
        retentionImpact: number;
        effectiveness: number;
    }>;
    trackLearningCompletion: (period: string, filters?: Record<string, any>) => Promise<{
        enrolled: number;
        inProgress: number;
        completed: number;
        completionRate: number;
        avgEngagement: number;
    }>;
    analyzeWorkforceProductivity: (period: string, department: string) => Promise<ProductivityMetrics>;
    calculateRevenuePerEmployee: (period: string, filters?: Record<string, any>) => Promise<Array<{
        department: string;
        revenuePerEmployee: number;
        trend: number;
        benchmark: number;
    }>>;
    analyzeAbsenteeismPatterns: (period: string, department?: string) => Promise<{
        absenteeismRate: number;
        avgDaysAbsent: number;
        topReasons: Array<{
            reason: string;
            percentage: number;
        }>;
    }>;
    generateExecutiveScorecard: (period: string, organizationUnit: string) => Promise<ExecutiveScorecard>;
    trackStrategicHRKPIs: (organizationUnit: string, numberOfPeriods: number) => Promise<Array<{
        period: string;
        kpis: Record<string, number>;
    }>>;
    exportHRData: (exportRequest: Partial<DataExportRequest>) => Promise<{
        exportId: string;
        status: string;
        downloadUrl?: string;
    }>;
    scheduleDataExport: (exportConfig: Partial<DataExportRequest>) => Promise<{
        scheduleId: string;
        nextRun: Date;
        enabled: boolean;
    }>;
    integrateExternalSystem: (systemType: string, operation: "IMPORT" | "EXPORT" | "SYNC", config: Record<string, any>) => Promise<{
        integrationId: string;
        status: string;
        recordsProcessed: number;
    }>;
};
export default _default;
//# sourceMappingURL=hr-analytics-reporting-kit.d.ts.map