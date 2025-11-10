/**
 * LOC: PERFKPI1234567
 * File: /reuse/government/performance-metrics-kpi-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend government services
 *   - Performance management controllers
 *   - Analytics and reporting engines
 */
/**
 * File: /reuse/government/performance-metrics-kpi-kit.ts
 * Locator: WC-GOV-PERF-001
 * Purpose: Comprehensive Performance Metrics & KPI Management - Enterprise-grade government performance measurement
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Performance controllers, analytics services, reporting engines, dashboard services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50+ utility functions for KPI tracking, performance measurement, balanced scorecard, service level tracking
 *
 * LLM Context: Enterprise-grade performance measurement and KPI management system for government operations.
 * Provides KPI definition and tracking, performance measurement frameworks, balanced scorecard implementation,
 * service level agreements, efficiency and effectiveness metrics, outcome measurement, performance dashboards,
 * benchmark comparison, trend analysis, performance reporting, goal tracking, alerts and notifications,
 * data-driven decision support, continuous improvement tracking, organizational performance management.
 */
import { Sequelize } from 'sequelize';
interface KPIDefinition {
    kpiId: number;
    kpiCode: string;
    kpiName: string;
    description: string;
    category: 'EFFICIENCY' | 'EFFECTIVENESS' | 'QUALITY' | 'TIMELINESS' | 'COST' | 'OUTCOME' | 'OUTPUT';
    measurementType: 'RATIO' | 'PERCENTAGE' | 'COUNT' | 'DURATION' | 'CURRENCY' | 'SCORE';
    formula: string;
    unit: string;
    targetValue: number;
    thresholdGreen: number;
    thresholdYellow: number;
    thresholdRed: number;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
    dataSource: string;
    owner: string;
    department: string;
    active: boolean;
}
interface KPIMeasurement {
    measurementId: number;
    kpiId: number;
    measurementDate: Date;
    periodStart: Date;
    periodEnd: Date;
    actualValue: number;
    targetValue: number;
    variance: number;
    variancePercent: number;
    status: 'EXCEEDS' | 'MEETS' | 'BELOW' | 'CRITICAL';
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    dataQuality: number;
    notes?: string;
    measuredBy: string;
}
interface PerformanceGoal {
    goalId: number;
    goalName: string;
    description: string;
    kpiIds: number[];
    department: string;
    fiscalYear: number;
    targetDate: Date;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'AT_RISK' | 'ACHIEVED' | 'NOT_ACHIEVED';
    completionPercent: number;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    owner: string;
}
interface BalancedScorecard {
    scorecardId: number;
    scorecardName: string;
    organization: string;
    fiscalYear: number;
    perspectives: ScorecardPerspective[];
    overallScore: number;
    status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
}
interface ScorecardPerspective {
    perspectiveName: 'FINANCIAL' | 'CUSTOMER' | 'INTERNAL_PROCESS' | 'LEARNING_GROWTH' | 'COMMUNITY';
    weight: number;
    objectives: StrategicObjective[];
    score: number;
}
interface StrategicObjective {
    objectiveId: number;
    objectiveName: string;
    description: string;
    kpiIds: number[];
    targetValue: number;
    actualValue: number;
    status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK' | 'ACHIEVED';
    initiatives: string[];
}
interface ServiceLevelAgreement {
    slaId: number;
    serviceName: string;
    serviceProvider: string;
    serviceCustomer: string;
    metrics: SLAMetric[];
    effectiveDate: Date;
    expirationDate?: Date;
    status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
    complianceRate: number;
}
interface SLAMetric {
    metricName: string;
    description: string;
    targetValue: number;
    unit: string;
    measurementFrequency: string;
    penaltyThreshold?: number;
    currentValue?: number;
    compliant: boolean;
}
interface PerformanceDashboard {
    dashboardId: number;
    dashboardName: string;
    department: string;
    widgets: DashboardWidget[];
    refreshFrequency: string;
    lastRefreshed: Date;
    audience: string[];
}
interface DashboardWidget {
    widgetId: string;
    widgetType: 'KPI_CARD' | 'TREND_CHART' | 'GAUGE' | 'TABLE' | 'SCORECARD' | 'ALERT_LIST';
    title: string;
    kpiIds?: number[];
    configuration: Record<string, any>;
    position: {
        row: number;
        col: number;
        width: number;
        height: number;
    };
}
interface PerformanceBenchmark {
    benchmarkId: number;
    kpiId: number;
    benchmarkType: 'INTERNAL' | 'PEER_GROUP' | 'INDUSTRY' | 'BEST_IN_CLASS';
    benchmarkValue: number;
    benchmarkSource: string;
    comparisonPeriod: string;
    variance: number;
    percentile?: number;
}
interface PerformanceAlert {
    alertId: number;
    alertType: 'THRESHOLD_BREACH' | 'TREND_NEGATIVE' | 'GOAL_AT_RISK' | 'SLA_VIOLATION' | 'DATA_QUALITY';
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    kpiId?: number;
    goalId?: number;
    slaId?: number;
    message: string;
    triggeredAt: Date;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
    resolved: boolean;
    resolvedAt?: Date;
}
interface TrendAnalysis {
    kpiId: number;
    analysisWindow: string;
    trendDirection: 'UPWARD' | 'DOWNWARD' | 'STABLE' | 'VOLATILE';
    slope: number;
    correlation: number;
    forecast: ForecastPoint[];
    seasonalPattern?: string;
    anomalies: AnomalyPoint[];
}
interface ForecastPoint {
    date: Date;
    predictedValue: number;
    confidenceInterval: {
        lower: number;
        upper: number;
    };
}
interface AnomalyPoint {
    date: Date;
    value: number;
    expectedValue: number;
    severity: 'MINOR' | 'MODERATE' | 'MAJOR';
    explanation?: string;
}
interface PerformanceReport {
    reportId: number;
    reportType: 'EXECUTIVE_SUMMARY' | 'DETAILED_ANALYSIS' | 'TREND_REPORT' | 'BENCHMARK_COMPARISON' | 'GOAL_STATUS';
    fiscalPeriod: string;
    generatedDate: Date;
    generatedBy: string;
    format: 'PDF' | 'EXCEL' | 'HTML' | 'JSON';
    sections: ReportSection[];
}
interface ReportSection {
    sectionTitle: string;
    sectionType: string;
    content: any;
    charts?: ChartDefinition[];
    tables?: TableDefinition[];
}
interface ChartDefinition {
    chartType: 'LINE' | 'BAR' | 'PIE' | 'SCATTER' | 'GAUGE' | 'RADAR';
    title: string;
    data: any[];
    configuration: Record<string, any>;
}
interface TableDefinition {
    columns: ColumnDefinition[];
    rows: any[];
    formatting?: Record<string, any>;
}
interface ColumnDefinition {
    field: string;
    header: string;
    dataType: string;
    format?: string;
}
/**
 * Sequelize model for KPI Definitions with formulas and thresholds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} KPIDefinition model
 *
 * @example
 * ```typescript
 * const KPIDefinition = createKPIDefinitionModel(sequelize);
 * const kpi = await KPIDefinition.create({
 *   kpiCode: 'RESP-TIME-001',
 *   kpiName: 'Average Response Time',
 *   category: 'TIMELINESS',
 *   measurementType: 'DURATION',
 *   targetValue: 24
 * });
 * ```
 */
export declare const createKPIDefinitionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        kpiCode: string;
        kpiName: string;
        description: string;
        category: string;
        measurementType: string;
        formula: string;
        unit: string;
        targetValue: number;
        thresholdGreen: number;
        thresholdYellow: number;
        thresholdRed: number;
        frequency: string;
        dataSource: string;
        dataCollectionMethod: string;
        calculationLogic: string;
        owner: string;
        department: string;
        perspective: string;
        strategic: boolean;
        active: boolean;
        effectiveDate: Date;
        expirationDate: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for KPI Measurements with variance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} KPIMeasurement model
 *
 * @example
 * ```typescript
 * const KPIMeasurement = createKPIMeasurementModel(sequelize);
 * const measurement = await KPIMeasurement.create({
 *   kpiId: 1,
 *   measurementDate: new Date(),
 *   actualValue: 18,
 *   targetValue: 24,
 *   status: 'EXCEEDS'
 * });
 * ```
 */
export declare const createKPIMeasurementModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        kpiId: number;
        measurementNumber: string;
        measurementDate: Date;
        periodStart: Date;
        periodEnd: Date;
        actualValue: number;
        targetValue: number;
        variance: number;
        variancePercent: number;
        status: string;
        trend: string | null;
        dataQuality: number;
        dataSource: string;
        calculationDetails: Record<string, any>;
        notes: string | null;
        measuredBy: string;
        verifiedBy: string | null;
        verifiedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Performance Goals with progress tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PerformanceGoal model
 *
 * @example
 * ```typescript
 * const PerformanceGoal = createPerformanceGoalModel(sequelize);
 * const goal = await PerformanceGoal.create({
 *   goalName: 'Reduce Response Time by 20%',
 *   department: 'Public Works',
 *   fiscalYear: 2025,
 *   priority: 'HIGH'
 * });
 * ```
 */
export declare const createPerformanceGoalModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        goalNumber: string;
        goalName: string;
        description: string;
        relatedKpiIds: number[];
        department: string;
        fiscalYear: number;
        startDate: Date;
        targetDate: Date;
        actualCompletionDate: Date | null;
        status: string;
        completionPercent: number;
        priority: string;
        owner: string;
        milestones: Record<string, any>[];
        successCriteria: string[];
        risks: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Creates new KPI definition with validation and formula setup.
 *
 * @param {Partial<KPIDefinition>} kpiData - KPI definition data
 * @param {string} createdBy - User creating KPI
 * @returns {Promise<KPIDefinition>} Created KPI definition
 *
 * @example
 * ```typescript
 * const kpi = await createKPIDefinition({
 *   kpiCode: 'RESP-TIME-001',
 *   kpiName: 'Average Response Time',
 *   category: 'TIMELINESS',
 *   measurementType: 'DURATION',
 *   targetValue: 24,
 *   unit: 'hours'
 * }, 'admin');
 * ```
 */
export declare const createKPIDefinition: (kpiData: Partial<KPIDefinition>, createdBy: string) => Promise<KPIDefinition>;
/**
 * Validates KPI definition for completeness and logical consistency.
 *
 * @param {KPIDefinition} kpi - KPI to validate
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateKPIDefinition(kpi);
 * if (!validation.valid) {
 *   console.error(validation.errors);
 * }
 * ```
 */
export declare const validateKPIDefinition: (kpi: KPIDefinition) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Calculates KPI value based on formula and input data.
 *
 * @param {KPIDefinition} kpi - KPI definition
 * @param {Record<string, number>} inputData - Input data for calculation
 * @returns {Promise<{ calculatedValue: number; components: Record<string, number> }>} Calculation result
 *
 * @example
 * ```typescript
 * const result = await calculateKPIValue(kpi, {
 *   totalRequests: 1000,
 *   completedRequests: 950,
 *   totalHours: 24000
 * });
 * ```
 */
export declare const calculateKPIValue: (kpi: KPIDefinition, inputData: Record<string, number>) => Promise<{
    calculatedValue: number;
    components: Record<string, number>;
}>;
/**
 * Updates KPI definition with version history tracking.
 *
 * @param {number} kpiId - KPI ID
 * @param {Partial<KPIDefinition>} updates - Updated fields
 * @param {string} updatedBy - User making update
 * @returns {Promise<KPIDefinition>} Updated KPI definition
 *
 * @example
 * ```typescript
 * const updated = await updateKPIDefinition(1, { targetValue: 20 }, 'manager');
 * ```
 */
export declare const updateKPIDefinition: (kpiId: number, updates: Partial<KPIDefinition>, updatedBy: string) => Promise<KPIDefinition>;
/**
 * Retrieves active KPIs by category or department.
 *
 * @param {object} filters - Filter criteria
 * @returns {Promise<KPIDefinition[]>} Filtered KPIs
 *
 * @example
 * ```typescript
 * const kpis = await getActiveKPIs({ category: 'EFFICIENCY', department: 'Public Works' });
 * ```
 */
export declare const getActiveKPIs: (filters: any) => Promise<KPIDefinition[]>;
/**
 * Records KPI measurement with automatic variance calculation.
 *
 * @param {number} kpiId - KPI ID
 * @param {number} actualValue - Measured value
 * @param {Date} measurementDate - Measurement date
 * @param {string} measuredBy - User recording measurement
 * @returns {Promise<KPIMeasurement>} Recorded measurement
 *
 * @example
 * ```typescript
 * const measurement = await recordKPIMeasurement(1, 18.5, new Date(), 'john.doe');
 * ```
 */
export declare const recordKPIMeasurement: (kpiId: number, actualValue: number, measurementDate: Date, measuredBy: string) => Promise<KPIMeasurement>;
/**
 * Retrieves KPI measurement history for trend analysis.
 *
 * @param {number} kpiId - KPI ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<KPIMeasurement[]>} Measurement history
 *
 * @example
 * ```typescript
 * const history = await getKPIMeasurementHistory(1, startDate, endDate);
 * ```
 */
export declare const getKPIMeasurementHistory: (kpiId: number, startDate: Date, endDate: Date) => Promise<KPIMeasurement[]>;
/**
 * Calculates KPI variance from target and benchmarks.
 *
 * @param {number} kpiId - KPI ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<{ variance: number; variancePercent: number; status: string }>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await calculateKPIVariance(1, startDate, endDate);
 * ```
 */
export declare const calculateKPIVariance: (kpiId: number, periodStart: Date, periodEnd: Date) => Promise<{
    variance: number;
    variancePercent: number;
    status: string;
}>;
/**
 * Determines KPI status based on threshold comparison.
 *
 * @param {KPIDefinition} kpi - KPI definition
 * @param {number} actualValue - Actual measured value
 * @returns {Promise<{ status: string; color: string; message: string }>} Status determination
 *
 * @example
 * ```typescript
 * const status = await determineKPIStatus(kpi, 18.5);
 * ```
 */
export declare const determineKPIStatus: (kpi: KPIDefinition, actualValue: number) => Promise<{
    status: string;
    color: string;
    message: string;
}>;
/**
 * Bulk records multiple KPI measurements simultaneously.
 *
 * @param {Array<{ kpiId: number; actualValue: number; measurementDate: Date }>} measurements - Measurements to record
 * @param {string} measuredBy - User recording measurements
 * @returns {Promise<{ successful: KPIMeasurement[]; failed: any[] }>} Bulk recording results
 *
 * @example
 * ```typescript
 * const results = await bulkRecordMeasurements([
 *   { kpiId: 1, actualValue: 18.5, measurementDate: new Date() },
 *   { kpiId: 2, actualValue: 95.2, measurementDate: new Date() }
 * ], 'admin');
 * ```
 */
export declare const bulkRecordMeasurements: (measurements: Array<{
    kpiId: number;
    actualValue: number;
    measurementDate: Date;
}>, measuredBy: string) => Promise<{
    successful: KPIMeasurement[];
    failed: any[];
}>;
/**
 * Creates balanced scorecard framework for organization.
 *
 * @param {string} organization - Organization name
 * @param {number} fiscalYear - Fiscal year
 * @param {string} createdBy - User creating scorecard
 * @returns {Promise<BalancedScorecard>} Created scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await createBalancedScorecard('Public Works', 2025, 'director');
 * ```
 */
export declare const createBalancedScorecard: (organization: string, fiscalYear: number, createdBy: string) => Promise<BalancedScorecard>;
/**
 * Adds strategic objective to balanced scorecard perspective.
 *
 * @param {number} scorecardId - Scorecard ID
 * @param {string} perspective - Perspective name
 * @param {Partial<StrategicObjective>} objective - Objective details
 * @returns {Promise<StrategicObjective>} Added objective
 *
 * @example
 * ```typescript
 * const objective = await addScorecardObjective(1, 'CUSTOMER', {
 *   objectiveName: 'Improve Customer Satisfaction',
 *   targetValue: 90,
 *   kpiIds: [1, 2, 3]
 * });
 * ```
 */
export declare const addScorecardObjective: (scorecardId: number, perspective: string, objective: Partial<StrategicObjective>) => Promise<StrategicObjective>;
/**
 * Calculates balanced scorecard overall score from perspectives.
 *
 * @param {number} scorecardId - Scorecard ID
 * @returns {Promise<{ overallScore: number; perspectiveScores: Record<string, number> }>} Scorecard calculation
 *
 * @example
 * ```typescript
 * const scores = await calculateScorecardScore(1);
 * ```
 */
export declare const calculateScorecardScore: (scorecardId: number) => Promise<{
    overallScore: number;
    perspectiveScores: Record<string, number>;
}>;
/**
 * Generates balanced scorecard strategy map visualization.
 *
 * @param {number} scorecardId - Scorecard ID
 * @returns {Promise<object>} Strategy map data
 *
 * @example
 * ```typescript
 * const strategyMap = await generateScorecardStrategyMap(1);
 * ```
 */
export declare const generateScorecardStrategyMap: (scorecardId: number) => Promise<any>;
/**
 * Tracks balanced scorecard objective progress.
 *
 * @param {number} objectiveId - Objective ID
 * @returns {Promise<{ currentProgress: number; status: string; milestones: any[] }>} Progress tracking
 *
 * @example
 * ```typescript
 * const progress = await trackScorecardObjectiveProgress(1);
 * ```
 */
export declare const trackScorecardObjectiveProgress: (objectiveId: number) => Promise<{
    currentProgress: number;
    status: string;
    milestones: any[];
}>;
/**
 * Creates service level agreement with metrics and targets.
 *
 * @param {Partial<ServiceLevelAgreement>} slaData - SLA details
 * @returns {Promise<ServiceLevelAgreement>} Created SLA
 *
 * @example
 * ```typescript
 * const sla = await createServiceLevelAgreement({
 *   serviceName: 'Help Desk Support',
 *   serviceProvider: 'IT Department',
 *   serviceCustomer: 'All Employees',
 *   metrics: [
 *     { metricName: 'Response Time', targetValue: 4, unit: 'hours' }
 *   ]
 * });
 * ```
 */
export declare const createServiceLevelAgreement: (slaData: Partial<ServiceLevelAgreement>) => Promise<ServiceLevelAgreement>;
/**
 * Monitors SLA compliance and calculates compliance rate.
 *
 * @param {number} slaId - SLA ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<{ complianceRate: number; violations: any[]; metricsCompliance: Record<string, boolean> }>} Compliance monitoring
 *
 * @example
 * ```typescript
 * const compliance = await monitorSLACompliance(1, startDate, endDate);
 * ```
 */
export declare const monitorSLACompliance: (slaId: number, periodStart: Date, periodEnd: Date) => Promise<{
    complianceRate: number;
    violations: any[];
    metricsCompliance: Record<string, boolean>;
}>;
/**
 * Tracks SLA metric performance against targets.
 *
 * @param {number} slaId - SLA ID
 * @param {string} metricName - Metric name
 * @returns {Promise<{ currentValue: number; targetValue: number; compliant: boolean }>} Metric tracking
 *
 * @example
 * ```typescript
 * const metric = await trackSLAMetricPerformance(1, 'Response Time');
 * ```
 */
export declare const trackSLAMetricPerformance: (slaId: number, metricName: string) => Promise<{
    currentValue: number;
    targetValue: number;
    compliant: boolean;
}>;
/**
 * Generates SLA violation report with root cause analysis.
 *
 * @param {number} slaId - SLA ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<object>} Violation report
 *
 * @example
 * ```typescript
 * const report = await generateSLAViolationReport(1, startDate, endDate);
 * ```
 */
export declare const generateSLAViolationReport: (slaId: number, periodStart: Date, periodEnd: Date) => Promise<any>;
/**
 * Calculates SLA penalty costs for non-compliance.
 *
 * @param {ServiceLevelAgreement} sla - SLA details
 * @param {number} complianceRate - Actual compliance rate
 * @returns {Promise<{ penaltyAmount: number; applicablePenalties: any[] }>} Penalty calculation
 *
 * @example
 * ```typescript
 * const penalties = await calculateSLAPenalties(sla, 92.5);
 * ```
 */
export declare const calculateSLAPenalties: (sla: ServiceLevelAgreement, complianceRate: number) => Promise<{
    penaltyAmount: number;
    applicablePenalties: any[];
}>;
/**
 * Creates performance goal with success criteria and milestones.
 *
 * @param {Partial<PerformanceGoal>} goalData - Goal details
 * @param {string} createdBy - User creating goal
 * @returns {Promise<PerformanceGoal>} Created goal
 *
 * @example
 * ```typescript
 * const goal = await createPerformanceGoal({
 *   goalName: 'Reduce Response Time by 20%',
 *   department: 'Public Works',
 *   fiscalYear: 2025,
 *   priority: 'HIGH'
 * }, 'director');
 * ```
 */
export declare const createPerformanceGoal: (goalData: Partial<PerformanceGoal>, createdBy: string) => Promise<PerformanceGoal>;
/**
 * Tracks goal progress and updates completion percentage.
 *
 * @param {number} goalId - Goal ID
 * @returns {Promise<{ completionPercent: number; status: string; nextMilestone: any }>} Progress tracking
 *
 * @example
 * ```typescript
 * const progress = await trackGoalProgress(1);
 * ```
 */
export declare const trackGoalProgress: (goalId: number) => Promise<{
    completionPercent: number;
    status: string;
    nextMilestone: any;
}>;
/**
 * Identifies goals at risk of not being achieved.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} [department] - Optional department filter
 * @returns {Promise<PerformanceGoal[]>} At-risk goals
 *
 * @example
 * ```typescript
 * const atRisk = await identifyAtRiskGoals(2025, 'Public Works');
 * ```
 */
export declare const identifyAtRiskGoals: (fiscalYear: number, department?: string) => Promise<PerformanceGoal[]>;
/**
 * Generates goal achievement report with variance analysis.
 *
 * @param {number} goalId - Goal ID
 * @returns {Promise<object>} Achievement report
 *
 * @example
 * ```typescript
 * const report = await generateGoalAchievementReport(1);
 * ```
 */
export declare const generateGoalAchievementReport: (goalId: number) => Promise<any>;
/**
 * Links KPIs to performance goals for tracking.
 *
 * @param {number} goalId - Goal ID
 * @param {number[]} kpiIds - KPI IDs to link
 * @returns {Promise<{ goalId: number; linkedKPIs: number[] }>} Link result
 *
 * @example
 * ```typescript
 * const linked = await linkKPIsToGoal(1, [1, 2, 3]);
 * ```
 */
export declare const linkKPIsToGoal: (goalId: number, kpiIds: number[]) => Promise<{
    goalId: number;
    linkedKPIs: number[];
}>;
/**
 * Creates performance dashboard with widgets and layout.
 *
 * @param {string} dashboardName - Dashboard name
 * @param {string} department - Department
 * @param {string} createdBy - User creating dashboard
 * @returns {Promise<PerformanceDashboard>} Created dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await createPerformanceDashboard('Executive Dashboard', 'Administration', 'admin');
 * ```
 */
export declare const createPerformanceDashboard: (dashboardName: string, department: string, createdBy: string) => Promise<PerformanceDashboard>;
/**
 * Adds widget to performance dashboard.
 *
 * @param {number} dashboardId - Dashboard ID
 * @param {DashboardWidget} widget - Widget configuration
 * @returns {Promise<DashboardWidget>} Added widget
 *
 * @example
 * ```typescript
 * const widget = await addDashboardWidget(1, {
 *   widgetType: 'KPI_CARD',
 *   title: 'Response Time',
 *   kpiIds: [1],
 *   position: { row: 1, col: 1, width: 2, height: 1 }
 * });
 * ```
 */
export declare const addDashboardWidget: (dashboardId: number, widget: Partial<DashboardWidget>) => Promise<DashboardWidget>;
/**
 * Retrieves real-time dashboard data for display.
 *
 * @param {number} dashboardId - Dashboard ID
 * @returns {Promise<{ widgets: any[]; lastUpdated: Date }>} Dashboard data
 *
 * @example
 * ```typescript
 * const data = await getDashboardData(1);
 * ```
 */
export declare const getDashboardData: (dashboardId: number) => Promise<{
    widgets: any[];
    lastUpdated: Date;
}>;
/**
 * Generates dashboard snapshot for reporting.
 *
 * @param {number} dashboardId - Dashboard ID
 * @param {string} format - Output format
 * @returns {Promise<Buffer>} Dashboard snapshot
 *
 * @example
 * ```typescript
 * const snapshot = await generateDashboardSnapshot(1, 'PDF');
 * ```
 */
export declare const generateDashboardSnapshot: (dashboardId: number, format: string) => Promise<Buffer>;
/**
 * Configures dashboard refresh schedule.
 *
 * @param {number} dashboardId - Dashboard ID
 * @param {string} frequency - Refresh frequency
 * @returns {Promise<{ dashboardId: number; refreshFrequency: string }>} Configuration result
 *
 * @example
 * ```typescript
 * const config = await configureDashboardRefresh(1, 'HOURLY');
 * ```
 */
export declare const configureDashboardRefresh: (dashboardId: number, frequency: string) => Promise<{
    dashboardId: number;
    refreshFrequency: string;
}>;
/**
 * Creates performance benchmark for KPI comparison.
 *
 * @param {number} kpiId - KPI ID
 * @param {Partial<PerformanceBenchmark>} benchmarkData - Benchmark details
 * @returns {Promise<PerformanceBenchmark>} Created benchmark
 *
 * @example
 * ```typescript
 * const benchmark = await createPerformanceBenchmark(1, {
 *   benchmarkType: 'PEER_GROUP',
 *   benchmarkValue: 20,
 *   benchmarkSource: 'National Government Performance Survey 2024'
 * });
 * ```
 */
export declare const createPerformanceBenchmark: (kpiId: number, benchmarkData: Partial<PerformanceBenchmark>) => Promise<PerformanceBenchmark>;
/**
 * Compares KPI performance against benchmarks.
 *
 * @param {number} kpiId - KPI ID
 * @param {number} actualValue - Actual value
 * @returns {Promise<{ benchmarks: PerformanceBenchmark[]; bestPerformance: string }>} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareAgainstBenchmarks(1, 18.5);
 * ```
 */
export declare const compareAgainstBenchmarks: (kpiId: number, actualValue: number) => Promise<{
    benchmarks: PerformanceBenchmark[];
    bestPerformance: string;
}>;
/**
 * Calculates percentile ranking for KPI performance.
 *
 * @param {number} kpiId - KPI ID
 * @param {number} actualValue - Actual value
 * @param {number[]} comparisonValues - Comparison dataset
 * @returns {Promise<{ percentile: number; ranking: string }>} Percentile calculation
 *
 * @example
 * ```typescript
 * const percentile = await calculatePerformancePercentile(1, 18.5, [15, 18, 20, 22, 25, 28]);
 * ```
 */
export declare const calculatePerformancePercentile: (kpiId: number, actualValue: number, comparisonValues: number[]) => Promise<{
    percentile: number;
    ranking: string;
}>;
/**
 * Generates benchmark comparison report.
 *
 * @param {number} kpiId - KPI ID
 * @param {string} comparisonPeriod - Comparison period
 * @returns {Promise<object>} Benchmark report
 *
 * @example
 * ```typescript
 * const report = await generateBenchmarkReport(1, '2024');
 * ```
 */
export declare const generateBenchmarkReport: (kpiId: number, comparisonPeriod: string) => Promise<any>;
/**
 * Identifies best practices from benchmark leaders.
 *
 * @param {number} kpiId - KPI ID
 * @returns {Promise<{ practices: string[]; organizations: string[] }>} Best practices
 *
 * @example
 * ```typescript
 * const practices = await identifyBenchmarkBestPractices(1);
 * ```
 */
export declare const identifyBenchmarkBestPractices: (kpiId: number) => Promise<{
    practices: string[];
    organizations: string[];
}>;
/**
 * Analyzes KPI trends over time with forecasting.
 *
 * @param {number} kpiId - KPI ID
 * @param {number} lookbackMonths - Months of historical data
 * @returns {Promise<TrendAnalysis>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeKPITrends(1, 12);
 * ```
 */
export declare const analyzeKPITrends: (kpiId: number, lookbackMonths: number) => Promise<TrendAnalysis>;
/**
 * Detects performance anomalies using statistical methods.
 *
 * @param {number} kpiId - KPI ID
 * @param {number} sensitivityLevel - Anomaly detection sensitivity
 * @returns {Promise<AnomalyPoint[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectPerformanceAnomalies(1, 2);
 * ```
 */
export declare const detectPerformanceAnomalies: (kpiId: number, sensitivityLevel: number) => Promise<AnomalyPoint[]>;
/**
 * Forecasts future KPI performance based on historical trends.
 *
 * @param {number} kpiId - KPI ID
 * @param {number} forecastMonths - Months to forecast
 * @returns {Promise<ForecastPoint[]>} Performance forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastKPIPerformance(1, 6);
 * ```
 */
export declare const forecastKPIPerformance: (kpiId: number, forecastMonths: number) => Promise<ForecastPoint[]>;
/**
 * Identifies seasonal patterns in KPI performance.
 *
 * @param {number} kpiId - KPI ID
 * @param {number} yearsOfData - Years of data to analyze
 * @returns {Promise<{ hasSeasonality: boolean; pattern: string; peakPeriods: string[] }>} Seasonality analysis
 *
 * @example
 * ```typescript
 * const seasonality = await identifySeasonalPatterns(1, 3);
 * ```
 */
export declare const identifySeasonalPatterns: (kpiId: number, yearsOfData: number) => Promise<{
    hasSeasonality: boolean;
    pattern: string;
    peakPeriods: string[];
}>;
/**
 * Calculates moving averages for trend smoothing.
 *
 * @param {number} kpiId - KPI ID
 * @param {number} windowSize - Moving average window size
 * @returns {Promise<Array<{ date: Date; value: number; movingAverage: number }>>} Moving averages
 *
 * @example
 * ```typescript
 * const movingAvg = await calculateMovingAverage(1, 3);
 * ```
 */
export declare const calculateMovingAverage: (kpiId: number, windowSize: number) => Promise<Array<{
    date: Date;
    value: number;
    movingAverage: number;
}>>;
/**
 * Creates performance alert for threshold breaches.
 *
 * @param {Partial<PerformanceAlert>} alertData - Alert details
 * @returns {Promise<PerformanceAlert>} Created alert
 *
 * @example
 * ```typescript
 * const alert = await createPerformanceAlert({
 *   alertType: 'THRESHOLD_BREACH',
 *   severity: 'WARNING',
 *   kpiId: 1,
 *   message: 'Response time exceeded yellow threshold'
 * });
 * ```
 */
export declare const createPerformanceAlert: (alertData: Partial<PerformanceAlert>) => Promise<PerformanceAlert>;
/**
 * Monitors KPIs for threshold breaches and triggers alerts.
 *
 * @param {number} kpiId - KPI ID
 * @param {number} actualValue - Actual value
 * @returns {Promise<PerformanceAlert | null>} Alert if triggered
 *
 * @example
 * ```typescript
 * const alert = await monitorKPIThresholds(1, 28);
 * ```
 */
export declare const monitorKPIThresholds: (kpiId: number, actualValue: number) => Promise<PerformanceAlert | null>;
/**
 * Retrieves active performance alerts for review.
 *
 * @param {string} [severity] - Optional severity filter
 * @returns {Promise<PerformanceAlert[]>} Active alerts
 *
 * @example
 * ```typescript
 * const alerts = await getActiveAlerts('CRITICAL');
 * ```
 */
export declare const getActiveAlerts: (severity?: string) => Promise<PerformanceAlert[]>;
/**
 * Acknowledges and resolves performance alert.
 *
 * @param {number} alertId - Alert ID
 * @param {string} acknowledgedBy - User acknowledging alert
 * @param {string} [resolutionNotes] - Resolution notes
 * @returns {Promise<PerformanceAlert>} Updated alert
 *
 * @example
 * ```typescript
 * const resolved = await acknowledgeAlert(1, 'manager', 'Issue addressed through staff reallocation');
 * ```
 */
export declare const acknowledgeAlert: (alertId: number, acknowledgedBy: string, resolutionNotes?: string) => Promise<PerformanceAlert>;
/**
 * Configures alert notification rules and recipients.
 *
 * @param {number} kpiId - KPI ID
 * @param {object} notificationRules - Notification configuration
 * @returns {Promise<{ kpiId: number; rules: object }>} Configuration result
 *
 * @example
 * ```typescript
 * const config = await configureAlertNotifications(1, {
 *   recipients: ['manager@example.com'],
 *   channels: ['EMAIL', 'SMS'],
 *   frequency: 'IMMEDIATE'
 * });
 * ```
 */
export declare const configureAlertNotifications: (kpiId: number, notificationRules: any) => Promise<{
    kpiId: number;
    rules: any;
}>;
/**
 * Generates comprehensive performance report.
 *
 * @param {string} reportType - Report type
 * @param {string} fiscalPeriod - Fiscal period
 * @param {object} [options] - Report options
 * @returns {Promise<PerformanceReport>} Generated report
 *
 * @example
 * ```typescript
 * const report = await generatePerformanceReport('EXECUTIVE_SUMMARY', 'FY2025-Q1', {
 *   includeCharts: true,
 *   includeBenchmarks: true
 * });
 * ```
 */
export declare const generatePerformanceReport: (reportType: string, fiscalPeriod: string, options?: any) => Promise<PerformanceReport>;
/**
 * Creates KPI performance summary for reporting.
 *
 * @param {number[]} kpiIds - KPI IDs to summarize
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<object>} Performance summary
 *
 * @example
 * ```typescript
 * const summary = await createKPIPerformanceSummary([1, 2, 3], startDate, endDate);
 * ```
 */
export declare const createKPIPerformanceSummary: (kpiIds: number[], periodStart: Date, periodEnd: Date) => Promise<any>;
/**
 * Exports performance data to various formats.
 *
 * @param {object} data - Data to export
 * @param {string} format - Export format
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const excel = await exportPerformanceData(data, 'EXCEL');
 * ```
 */
export declare const exportPerformanceData: (data: any, format: string) => Promise<Buffer>;
/**
 * Schedules automated performance report generation.
 *
 * @param {string} reportType - Report type
 * @param {string} frequency - Generation frequency
 * @param {string[]} recipients - Report recipients
 * @returns {Promise<{ scheduleId: number; nextRun: Date }>} Schedule configuration
 *
 * @example
 * ```typescript
 * const schedule = await schedulePerformanceReport('EXECUTIVE_SUMMARY', 'MONTHLY', ['ceo@example.com']);
 * ```
 */
export declare const schedulePerformanceReport: (reportType: string, frequency: string, recipients: string[]) => Promise<{
    scheduleId: number;
    nextRun: Date;
}>;
/**
 * Generates performance insights and recommendations.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} [department] - Optional department filter
 * @returns {Promise<{ insights: string[]; recommendations: string[]; priorities: string[] }>} Insights and recommendations
 *
 * @example
 * ```typescript
 * const insights = await generatePerformanceInsights(2025, 'Public Works');
 * ```
 */
export declare const generatePerformanceInsights: (fiscalYear: number, department?: string) => Promise<{
    insights: string[];
    recommendations: string[];
    priorities: string[];
}>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createKPIDefinitionModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            kpiCode: string;
            kpiName: string;
            description: string;
            category: string;
            measurementType: string;
            formula: string;
            unit: string;
            targetValue: number;
            thresholdGreen: number;
            thresholdYellow: number;
            thresholdRed: number;
            frequency: string;
            dataSource: string;
            dataCollectionMethod: string;
            calculationLogic: string;
            owner: string;
            department: string;
            perspective: string;
            strategic: boolean;
            active: boolean;
            effectiveDate: Date;
            expirationDate: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
            readonly updatedBy: string;
        };
    };
    createKPIMeasurementModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            kpiId: number;
            measurementNumber: string;
            measurementDate: Date;
            periodStart: Date;
            periodEnd: Date;
            actualValue: number;
            targetValue: number;
            variance: number;
            variancePercent: number;
            status: string;
            trend: string | null;
            dataQuality: number;
            dataSource: string;
            calculationDetails: Record<string, any>;
            notes: string | null;
            measuredBy: string;
            verifiedBy: string | null;
            verifiedAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
        };
    };
    createPerformanceGoalModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            goalNumber: string;
            goalName: string;
            description: string;
            relatedKpiIds: number[];
            department: string;
            fiscalYear: number;
            startDate: Date;
            targetDate: Date;
            actualCompletionDate: Date | null;
            status: string;
            completionPercent: number;
            priority: string;
            owner: string;
            milestones: Record<string, any>[];
            successCriteria: string[];
            risks: string[];
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
            readonly updatedBy: string;
        };
    };
    createKPIDefinition: (kpiData: Partial<KPIDefinition>, createdBy: string) => Promise<KPIDefinition>;
    validateKPIDefinition: (kpi: KPIDefinition) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    calculateKPIValue: (kpi: KPIDefinition, inputData: Record<string, number>) => Promise<{
        calculatedValue: number;
        components: Record<string, number>;
    }>;
    updateKPIDefinition: (kpiId: number, updates: Partial<KPIDefinition>, updatedBy: string) => Promise<KPIDefinition>;
    getActiveKPIs: (filters: any) => Promise<KPIDefinition[]>;
    recordKPIMeasurement: (kpiId: number, actualValue: number, measurementDate: Date, measuredBy: string) => Promise<KPIMeasurement>;
    getKPIMeasurementHistory: (kpiId: number, startDate: Date, endDate: Date) => Promise<KPIMeasurement[]>;
    calculateKPIVariance: (kpiId: number, periodStart: Date, periodEnd: Date) => Promise<{
        variance: number;
        variancePercent: number;
        status: string;
    }>;
    determineKPIStatus: (kpi: KPIDefinition, actualValue: number) => Promise<{
        status: string;
        color: string;
        message: string;
    }>;
    bulkRecordMeasurements: (measurements: Array<{
        kpiId: number;
        actualValue: number;
        measurementDate: Date;
    }>, measuredBy: string) => Promise<{
        successful: KPIMeasurement[];
        failed: any[];
    }>;
    createBalancedScorecard: (organization: string, fiscalYear: number, createdBy: string) => Promise<BalancedScorecard>;
    addScorecardObjective: (scorecardId: number, perspective: string, objective: Partial<StrategicObjective>) => Promise<StrategicObjective>;
    calculateScorecardScore: (scorecardId: number) => Promise<{
        overallScore: number;
        perspectiveScores: Record<string, number>;
    }>;
    generateScorecardStrategyMap: (scorecardId: number) => Promise<any>;
    trackScorecardObjectiveProgress: (objectiveId: number) => Promise<{
        currentProgress: number;
        status: string;
        milestones: any[];
    }>;
    createServiceLevelAgreement: (slaData: Partial<ServiceLevelAgreement>) => Promise<ServiceLevelAgreement>;
    monitorSLACompliance: (slaId: number, periodStart: Date, periodEnd: Date) => Promise<{
        complianceRate: number;
        violations: any[];
        metricsCompliance: Record<string, boolean>;
    }>;
    trackSLAMetricPerformance: (slaId: number, metricName: string) => Promise<{
        currentValue: number;
        targetValue: number;
        compliant: boolean;
    }>;
    generateSLAViolationReport: (slaId: number, periodStart: Date, periodEnd: Date) => Promise<any>;
    calculateSLAPenalties: (sla: ServiceLevelAgreement, complianceRate: number) => Promise<{
        penaltyAmount: number;
        applicablePenalties: any[];
    }>;
    createPerformanceGoal: (goalData: Partial<PerformanceGoal>, createdBy: string) => Promise<PerformanceGoal>;
    trackGoalProgress: (goalId: number) => Promise<{
        completionPercent: number;
        status: string;
        nextMilestone: any;
    }>;
    identifyAtRiskGoals: (fiscalYear: number, department?: string) => Promise<PerformanceGoal[]>;
    generateGoalAchievementReport: (goalId: number) => Promise<any>;
    linkKPIsToGoal: (goalId: number, kpiIds: number[]) => Promise<{
        goalId: number;
        linkedKPIs: number[];
    }>;
    createPerformanceDashboard: (dashboardName: string, department: string, createdBy: string) => Promise<PerformanceDashboard>;
    addDashboardWidget: (dashboardId: number, widget: Partial<DashboardWidget>) => Promise<DashboardWidget>;
    getDashboardData: (dashboardId: number) => Promise<{
        widgets: any[];
        lastUpdated: Date;
    }>;
    generateDashboardSnapshot: (dashboardId: number, format: string) => Promise<Buffer>;
    configureDashboardRefresh: (dashboardId: number, frequency: string) => Promise<{
        dashboardId: number;
        refreshFrequency: string;
    }>;
    createPerformanceBenchmark: (kpiId: number, benchmarkData: Partial<PerformanceBenchmark>) => Promise<PerformanceBenchmark>;
    compareAgainstBenchmarks: (kpiId: number, actualValue: number) => Promise<{
        benchmarks: PerformanceBenchmark[];
        bestPerformance: string;
    }>;
    calculatePerformancePercentile: (kpiId: number, actualValue: number, comparisonValues: number[]) => Promise<{
        percentile: number;
        ranking: string;
    }>;
    generateBenchmarkReport: (kpiId: number, comparisonPeriod: string) => Promise<any>;
    identifyBenchmarkBestPractices: (kpiId: number) => Promise<{
        practices: string[];
        organizations: string[];
    }>;
    analyzeKPITrends: (kpiId: number, lookbackMonths: number) => Promise<TrendAnalysis>;
    detectPerformanceAnomalies: (kpiId: number, sensitivityLevel: number) => Promise<AnomalyPoint[]>;
    forecastKPIPerformance: (kpiId: number, forecastMonths: number) => Promise<ForecastPoint[]>;
    identifySeasonalPatterns: (kpiId: number, yearsOfData: number) => Promise<{
        hasSeasonality: boolean;
        pattern: string;
        peakPeriods: string[];
    }>;
    calculateMovingAverage: (kpiId: number, windowSize: number) => Promise<Array<{
        date: Date;
        value: number;
        movingAverage: number;
    }>>;
    createPerformanceAlert: (alertData: Partial<PerformanceAlert>) => Promise<PerformanceAlert>;
    monitorKPIThresholds: (kpiId: number, actualValue: number) => Promise<PerformanceAlert | null>;
    getActiveAlerts: (severity?: string) => Promise<PerformanceAlert[]>;
    acknowledgeAlert: (alertId: number, acknowledgedBy: string, resolutionNotes?: string) => Promise<PerformanceAlert>;
    configureAlertNotifications: (kpiId: number, notificationRules: any) => Promise<{
        kpiId: number;
        rules: any;
    }>;
    generatePerformanceReport: (reportType: string, fiscalPeriod: string, options?: any) => Promise<PerformanceReport>;
    createKPIPerformanceSummary: (kpiIds: number[], periodStart: Date, periodEnd: Date) => Promise<any>;
    exportPerformanceData: (data: any, format: string) => Promise<Buffer>;
    schedulePerformanceReport: (reportType: string, frequency: string, recipients: string[]) => Promise<{
        scheduleId: number;
        nextRun: Date;
    }>;
    generatePerformanceInsights: (fiscalYear: number, department?: string) => Promise<{
        insights: string[];
        recommendations: string[];
        priorities: string[];
    }>;
};
export default _default;
//# sourceMappingURL=performance-metrics-kpi-kit.d.ts.map