/**
 * LOC: METRICS-ANALYTICS-COMPOSITE-001
 * File: /reuse/threat/composites/threat-metrics-analytics-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../security-metrics-kpi-kit
 *   - ../security-roi-analysis-kit
 *   - ../security-dashboard-kit
 *   - ../executive-threat-reporting-kit
 *   - ../threat-visualization-dashboard-kit
 *
 * DOWNSTREAM (imported by):
 *   - Metrics analysis services
 *   - KPI calculation modules
 *   - ROI tracking services
 *   - Business intelligence platforms
 *   - Financial reporting systems
 */
import { SecurityKPI, MetricDashboardData, VulnerabilityMetrics } from '../security-metrics-kpi-kit';
import { TimeRange, MetricAggregation } from '../security-dashboard-kit';
import { SecurityROIAnalysis } from '../executive-threat-reporting-kit';
/**
 * Comprehensive metrics analysis configuration
 *
 * @property {TimeRange} period - Analysis time period
 * @property {string[]} categories - Metric categories to analyze
 * @property {MetricAggregation} aggregation - Aggregation method
 * @property {boolean} includeHistorical - Include historical comparison
 */
export interface MetricsAnalysisConfig {
    period: TimeRange;
    categories: string[];
    aggregation?: MetricAggregation;
    includeHistorical?: boolean;
    includeBenchmarks?: boolean;
    includeForecasts?: boolean;
}
/**
 * KPI analysis result
 *
 * @property {SecurityKPI[]} kpis - Calculated KPIs
 * @property {KPIPerformanceSummary} summary - Performance summary
 * @property {KPITrend[]} trends - Trend analysis
 */
export interface KPIAnalysisResult {
    kpis: SecurityKPI[];
    summary: KPIPerformanceSummary;
    trends: KPITrend[];
    recommendations: string[];
}
/**
 * KPI performance summary
 */
export interface KPIPerformanceSummary {
    totalKPIs: number;
    onTarget: number;
    atRisk: number;
    offTarget: number;
    avgPerformance: number;
    overallStatus: 'excellent' | 'good' | 'needs_improvement' | 'critical';
}
/**
 * KPI trend data
 */
export interface KPITrend {
    kpiId: string;
    kpiName: string;
    values: Array<{
        date: Date;
        value: number;
    }>;
    trend: 'improving' | 'stable' | 'declining';
    changeRate: number;
    forecast?: Array<{
        date: Date;
        value: number;
        confidence: number;
    }>;
}
/**
 * ROI analysis result
 */
export interface ROIAnalysisResult {
    analysis: SecurityROIAnalysis;
    comparison: {
        industryAverage: number;
        ourPerformance: number;
        percentile: number;
    };
    projections: Array<{
        year: number;
        expectedROI: number;
        confidence: number;
    }>;
    recommendations: string[];
}
/**
 * Threat exposure assessment
 */
export interface ThreatExposureAssessment {
    overallScore: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    exposureFactors: Array<{
        factor: string;
        weight: number;
        score: number;
        impact: string;
    }>;
    recommendations: string[];
    trend: 'increasing' | 'stable' | 'decreasing';
}
/**
 * Incident response metrics analysis
 */
export interface IncidentResponseMetricsAnalysis {
    mttd: {
        current: number;
        target: number;
        trend: 'improving' | 'stable' | 'declining';
        benchmark: number;
    };
    mttr: {
        current: number;
        target: number;
        trend: 'improving' | 'stable' | 'declining';
        benchmark: number;
    };
    volume: {
        total: number;
        byType: Record<string, number>;
        bySeverity: Record<string, number>;
    };
    efficiency: {
        resolutionRate: number;
        escalationRate: number;
        reopenRate: number;
    };
}
/**
 * Compliance metrics report
 */
export interface ComplianceMetricsReport {
    overallScore: number;
    frameworks: Array<{
        framework: string;
        score: number;
        status: 'compliant' | 'partial' | 'non_compliant';
        trend: 'improving' | 'stable' | 'declining';
    }>;
    controlsCovered: number;
    controlsEffective: number;
    gapCount: number;
    remediationTimeline: string;
}
/**
 * Vulnerability metrics snapshot
 */
export interface VulnerabilityMetricsSnapshot {
    snapshot: VulnerabilityMetrics;
    trends: {
        newVulnsRate: number;
        remediationRate: number;
        ageingTrend: 'improving' | 'stable' | 'worsening';
    };
    priorities: Array<{
        severity: string;
        count: number;
        avgAge: number;
        priority: number;
    }>;
    recommendations: string[];
}
/**
 * Calculates comprehensive security metrics across all categories
 *
 * Aggregates and calculates security metrics from multiple sources including
 * threats, vulnerabilities, incidents, and compliance to provide holistic
 * security measurement.
 *
 * @param {MetricsAnalysisConfig} config - Metrics analysis configuration
 * @returns {Promise<{metrics: Record<string, number>, aggregations: any, summary: any}>} Calculated metrics
 *
 * @throws {Error} If metric calculation fails or data unavailable
 *
 * @example
 * ```typescript
 * const metrics = await calculateComprehensiveSecurityMetrics({
 *   period: { start: new Date('2025-10-01'), end: new Date('2025-11-01'), preset: 'last_30d' },
 *   categories: ['threat', 'vulnerability', 'incident', 'compliance'],
 *   aggregation: MetricAggregation.AVG,
 *   includeHistorical: true,
 *   includeBenchmarks: true
 * });
 *
 * console.log(`Overall security score: ${metrics.summary.overallScore}`);
 * console.log(`Threat metrics: ${metrics.metrics.threats}`);
 * console.log(`Vulnerability count: ${metrics.metrics.vulnerabilities}`);
 * ```
 *
 * @see {@link aggregateMetricsByCategory} for category aggregation
 * @see {@link calculateCompositeSecurityScore} for composite scoring
 */
export declare function calculateComprehensiveSecurityMetrics(config: MetricsAnalysisConfig): Promise<{
    metrics: Record<string, number>;
    aggregations: Record<string, any>;
    summary: {
        overallScore: number;
        categoryScores: Record<string, number>;
        trending: 'improving' | 'stable' | 'declining';
    };
}>;
/**
 * Tracks security metric trends over time
 *
 * Analyzes metric trends across multiple time periods to identify patterns,
 * anomalies, and forecast future values using statistical methods.
 *
 * @param {string} metricKey - Metric to track
 * @param {Array<TimeRange>} periods - Time periods for trend analysis
 * @param {Object} options - Tracking options
 * @returns {Promise<{trend: KPITrend, anomalies: any[], forecast: any[]}>} Trend analysis results
 *
 * @example
 * ```typescript
 * const trendAnalysis = await trackSecurityMetricTrends(
 *   'threats.detected.count',
 *   [
 *     { start: new Date('2025-08-01'), end: new Date('2025-09-01'), preset: 'custom' },
 *     { start: new Date('2025-09-01'), end: new Date('2025-10-01'), preset: 'custom' },
 *     { start: new Date('2025-10-01'), end: new Date('2025-11-01'), preset: 'custom' }
 *   ],
 *   {
 *     detectAnomalies: true,
 *     generateForecast: true,
 *     forecastDays: 30
 *   }
 * );
 *
 * console.log(`Trend: ${trendAnalysis.trend.trend}`);
 * console.log(`Anomalies detected: ${trendAnalysis.anomalies.length}`);
 * trendAnalysis.forecast.forEach(f => {
 *   console.log(`${f.date}: ${f.value} (confidence: ${f.confidence}%)`);
 * });
 * ```
 */
export declare function trackSecurityMetricTrends(metricKey: string, periods: Array<TimeRange>, options?: {
    detectAnomalies?: boolean;
    generateForecast?: boolean;
    forecastDays?: number;
}): Promise<{
    trend: KPITrend;
    anomalies: Array<{
        timestamp: Date;
        value: number;
        expectedValue: number;
        deviation: number;
        severity: string;
    }>;
    forecast: Array<{
        date: Date;
        value: number;
        confidence: number;
    }>;
}>;
/**
 * Generates real-time security metrics dashboard
 *
 * Creates live security metrics dashboard with real-time updates, aggregations,
 * and visual representations suitable for operations center monitoring.
 *
 * @param {TimeRange} period - Dashboard time range
 * @param {string[]} metricKeys - Metrics to display
 * @returns {Promise<MetricDashboardData>} Dashboard data with charts and alerts
 *
 * @example
 * ```typescript
 * const dashboard = await generateRealtimeSecurityMetricsDashboard(
 *   { start: new Date(Date.now() - 24*60*60*1000), end: new Date(), preset: 'last_24h' },
 *   ['threats.active', 'incidents.critical', 'vulnerabilities.high']
 * );
 *
 * console.log(`Dashboard generated at: ${dashboard.generatedAt}`);
 * console.log(`Total incidents: ${dashboard.summary.totalIncidents}`);
 * console.log(`Active charts: ${dashboard.charts.length}`);
 * dashboard.alerts.forEach(alert => {
 *   console.log(`[${alert.severity}] ${alert.message}`);
 * });
 * ```
 */
export declare function generateRealtimeSecurityMetricsDashboard(period: TimeRange, metricKeys: string[]): Promise<MetricDashboardData>;
/**
 * Calculates security metric percentiles for benchmarking
 *
 * Computes statistical percentiles (50th, 75th, 90th, 95th, 99th) for security
 * metrics to enable performance benchmarking and outlier detection.
 *
 * @param {string[]} metricKeys - Metrics to analyze
 * @param {TimeRange} period - Analysis period
 * @returns {Promise<Map<string, Record<number, number>>>} Percentile values by metric
 *
 * @example
 * ```typescript
 * const percentiles = await calculateSecurityMetricPercentiles(
 *   ['incident_response_time', 'threat_detection_time', 'vulnerability_age'],
 *   { start: new Date('2025-01-01'), end: new Date('2025-11-01') }
 * );
 *
 * percentiles.forEach((values, metric) => {
 *   console.log(`\n${metric}:`);
 *   console.log(`  50th percentile (median): ${values[50]}`);
 *   console.log(`  95th percentile: ${values[95]}`);
 *   console.log(`  99th percentile: ${values[99]}`);
 * });
 * ```
 */
export declare function calculateSecurityMetricPercentiles(metricKeys: string[], period: TimeRange): Promise<Map<string, Record<number, number>>>;
/**
 * Compares security metrics across multiple dimensions
 *
 * Performs multi-dimensional comparison of security metrics across time periods,
 * business units, systems, or other dimensions for comprehensive analysis.
 *
 * @param {string} metricKey - Metric to compare
 * @param {Object} dimensions - Comparison dimensions
 * @returns {Promise<{comparisons: any[], insights: string[], recommendations: string[]}>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareSecurityMetricsAcrossDimensions(
 *   'vulnerability_count',
 *   {
 *     timePeriods: [
 *       { name: 'Q3 2025', start: new Date('2025-07-01'), end: new Date('2025-09-30') },
 *       { name: 'Q4 2025', start: new Date('2025-10-01'), end: new Date('2025-12-31') }
 *     ],
 *     businessUnits: ['IT', 'Operations', 'Clinical'],
 *     systems: ['EHR', 'Billing', 'Lab']
 *   }
 * );
 *
 * comparison.comparisons.forEach(comp => {
 *   console.log(`${comp.dimension}: ${comp.current} vs ${comp.previous} (${comp.change}%)`);
 * });
 * ```
 */
export declare function compareSecurityMetricsAcrossDimensions(metricKey: string, dimensions: {
    timePeriods?: Array<{
        name: string;
        start: Date;
        end: Date;
    }>;
    businessUnits?: string[];
    systems?: string[];
}): Promise<{
    comparisons: Array<{
        dimension: string;
        dimensionValue: string;
        current: number;
        previous?: number;
        change?: number;
        trend: 'improving' | 'stable' | 'declining';
    }>;
    insights: string[];
    recommendations: string[];
}>;
/**
 * Detects and analyzes metric anomalies
 *
 * Uses statistical methods and machine learning to detect anomalous metric
 * values, patterns, and deviations from expected behavior.
 *
 * @param {string[]} metricKeys - Metrics to analyze for anomalies
 * @param {TimeRange} period - Analysis period
 * @param {number} sensitivity - Anomaly detection sensitivity (1-10)
 * @returns {Promise<Map<string, any[]>>} Detected anomalies by metric
 *
 * @example
 * ```typescript
 * const anomalies = await detectAndAnalyzeMetricAnomalies(
 *   ['threat_count', 'incident_rate', 'vulnerability_discovery'],
 *   { start: new Date('2025-10-01'), end: new Date('2025-11-01') },
 *   7 // High sensitivity
 * );
 *
 * anomalies.forEach((anomalyList, metric) => {
 *   console.log(`\n${metric}: ${anomalyList.length} anomalies detected`);
 *   anomalyList.forEach(anomaly => {
 *     console.log(`  ${anomaly.timestamp}: ${anomaly.value} (expected: ${anomaly.expectedValue}, severity: ${anomaly.severity})`);
 *   });
 * });
 * ```
 */
export declare function detectAndAnalyzeMetricAnomalies(metricKeys: string[], period: TimeRange, sensitivity?: number): Promise<Map<string, Array<{
    timestamp: Date;
    value: number;
    expectedValue: number;
    deviation: number;
    severity: 'low' | 'medium' | 'high';
    context?: string;
}>>>;
/**
 * Generates metrics correlation analysis
 *
 * Analyzes correlations between different security metrics to identify
 * relationships, dependencies, and leading indicators.
 *
 * @param {string[]} metricKeys - Metrics to correlate
 * @param {TimeRange} period - Analysis period
 * @returns {Promise<{correlations: any[], strongCorrelations: any[], insights: string[]}>} Correlation analysis
 *
 * @example
 * ```typescript
 * const correlation = await generateMetricsCorrelationAnalysis(
 *   ['threat_count', 'incident_count', 'vulnerability_count', 'patch_rate'],
 *   { start: new Date('2025-01-01'), end: new Date('2025-11-01') }
 * );
 *
 * console.log('Strong correlations:');
 * correlation.strongCorrelations.forEach(corr => {
 *   console.log(`  ${corr.metric1} <-> ${corr.metric2}: ${corr.coefficient} (${corr.strength})`);
 * });
 * ```
 */
export declare function generateMetricsCorrelationAnalysis(metricKeys: string[], period: TimeRange): Promise<{
    correlations: Array<{
        metric1: string;
        metric2: string;
        coefficient: number;
        strength: 'strong' | 'moderate' | 'weak';
        direction: 'positive' | 'negative';
    }>;
    strongCorrelations: any[];
    insights: string[];
}>;
/**
 * Exports comprehensive metrics report
 *
 * Generates and exports comprehensive security metrics report in multiple
 * formats (PDF, Excel, JSON) with visualizations and analysis.
 *
 * @param {TimeRange} period - Reporting period
 * @param {Object} options - Export options
 * @returns {Promise<Array<{format: string, url: string, data: any}>>} Export results
 *
 * @example
 * ```typescript
 * const exports = await exportComprehensiveMetricsReport(
 *   { start: new Date('2025-10-01'), end: new Date('2025-11-01') },
 *   {
 *     formats: ['pdf', 'xlsx', 'json'],
 *     includeCharts: true,
 *     includeRawData: true,
 *     recipients: ['security-team@company.com']
 *   }
 * );
 *
 * exports.forEach(exp => {
 *   console.log(`${exp.format}: ${exp.url}`);
 * });
 * ```
 */
export declare function exportComprehensiveMetricsReport(period: TimeRange, options?: {
    formats?: ('pdf' | 'xlsx' | 'json' | 'csv')[];
    includeCharts?: boolean;
    includeRawData?: boolean;
    recipients?: string[];
}): Promise<Array<{
    format: string;
    url: string;
    filename: string;
    data?: any;
}>>;
/**
 * Calculates metric baselines for anomaly detection
 *
 * Establishes statistical baselines for security metrics based on historical
 * data to enable accurate anomaly detection and threshold setting.
 *
 * @param {string[]} metricKeys - Metrics to baseline
 * @param {TimeRange} baselinePeriod - Historical period for baseline
 * @returns {Promise<Map<string, {mean: number, median: number, stddev: number, thresholds: any}>>} Baseline data
 *
 * @example
 * ```typescript
 * const baselines = await calculateMetricBaselinesForAnomalyDetection(
 *   ['threat_count', 'incident_rate'],
 *   { start: new Date('2025-01-01'), end: new Date('2025-10-01') }
 * );
 *
 * baselines.forEach((baseline, metric) => {
 *   console.log(`\n${metric}:`);
 *   console.log(`  Mean: ${baseline.mean}`);
 *   console.log(`  Std Dev: ${baseline.stddev}`);
 *   console.log(`  Upper threshold: ${baseline.thresholds.upper}`);
 * });
 * ```
 */
export declare function calculateMetricBaselinesForAnomalyDetection(metricKeys: string[], baselinePeriod: TimeRange): Promise<Map<string, {
    mean: number;
    median: number;
    stddev: number;
    min: number;
    max: number;
    thresholds: {
        lower: number;
        upper: number;
        critical: number;
    };
}>>;
/**
 * Calculates and analyzes comprehensive security KPIs
 *
 * Computes full set of security KPIs including vulnerability, compliance, incident,
 * detection, and response metrics with performance analysis and target comparison.
 *
 * @param {TimeRange} period - KPI measurement period
 * @param {Object} options - Calculation options
 * @returns {Promise<KPIAnalysisResult>} Comprehensive KPI analysis
 *
 * @throws {Error} If KPI calculation fails
 *
 * @example
 * ```typescript
 * const kpiAnalysis = await calculateAndAnalyzeSecurityKPIs(
 *   { start: new Date('2025-10-01'), end: new Date('2025-11-01') },
 *   {
 *     includeTargets: true,
 *     includeBenchmarks: true,
 *     includeTrends: true
 *   }
 * );
 *
 * console.log(`Total KPIs: ${kpiAnalysis.summary.totalKPIs}`);
 * console.log(`On target: ${kpiAnalysis.summary.onTarget}`);
 * console.log(`Overall status: ${kpiAnalysis.summary.overallStatus}`);
 * kpiAnalysis.recommendations.forEach(rec => console.log(`- ${rec}`));
 * ```
 *
 * @see {@link calculateSecurityKPIs} for underlying KPI calculation
 */
export declare function calculateAndAnalyzeSecurityKPIs(period: TimeRange, options?: {
    includeTargets?: boolean;
    includeBenchmarks?: boolean;
    includeTrends?: boolean;
}): Promise<KPIAnalysisResult>;
/**
 * Tracks KPI performance against targets
 *
 * Monitors KPI performance against defined targets with alerts for deviations,
 * trend analysis, and forecasting to predict future performance.
 *
 * @param {string[]} kpiIds - KPIs to track
 * @param {TimeRange} period - Tracking period
 * @param {Object} targets - KPI targets
 * @returns {Promise<Map<string, {current: number, target: number, gap: number, status: string}>>} Performance tracking
 *
 * @example
 * ```typescript
 * const performance = await trackKPIPerformanceAgainstTargets(
 *   ['mttd', 'mttr', 'compliance_rate', 'patch_compliance'],
 *   { start: new Date(), end: new Date() },
 *   {
 *     mttd: { target: 300, warning: 450, critical: 600 },
 *     mttr: { target: 240, warning: 360, critical: 480 },
 *     compliance_rate: { target: 95, warning: 90, critical: 85 }
 *   }
 * );
 *
 * performance.forEach((perf, kpiId) => {
 *   console.log(`${kpiId}: ${perf.current} (target: ${perf.target}, gap: ${perf.gap}, status: ${perf.status})`);
 * });
 * ```
 */
export declare function trackKPIPerformanceAgainstTargets(kpiIds: string[], period: TimeRange, targets: Record<string, {
    target: number;
    warning: number;
    critical: number;
}>): Promise<Map<string, {
    current: number;
    target: number;
    gap: number;
    gapPercentage: number;
    status: 'on_target' | 'at_risk' | 'off_target';
    trend: 'improving' | 'stable' | 'declining';
}>>;
/**
 * Generates KPI performance scorecard
 *
 * Creates comprehensive KPI scorecard with RAG (Red/Amber/Green) status,
 * performance indicators, and executive summary.
 *
 * @param {TimeRange} period - Scorecard period
 * @param {Object} options - Scorecard options
 * @returns {Promise<{scorecard: any, ragStatus: any, executiveSummary: string}>} KPI scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateKPIPerformanceScorecard(
 *   { start: new Date('2025-10-01'), end: new Date('2025-11-01') },
 *   {
 *     includeVisualizations: true,
 *     groupByCategory: true
 *   }
 * );
 *
 * console.log(scorecard.executiveSummary);
 * console.log(`\nRAG Status:`);
 * console.log(`  Green: ${scorecard.ragStatus.green}`);
 * console.log(`  Amber: ${scorecard.ragStatus.amber}`);
 * console.log(`  Red: ${scorecard.ragStatus.red}`);
 * ```
 */
export declare function generateKPIPerformanceScorecard(period: TimeRange, options?: {
    includeVisualizations?: boolean;
    groupByCategory?: boolean;
}): Promise<{
    scorecard: Array<{
        kpi: string;
        category: string;
        current: number;
        target: number;
        performance: number;
        rag: 'red' | 'amber' | 'green';
    }>;
    ragStatus: {
        green: number;
        amber: number;
        red: number;
    };
    executiveSummary: string;
    visualizations?: any[];
}>;
/**
 * Analyzes KPI trends and patterns
 *
 * Performs advanced trend analysis on KPIs to identify patterns, cycles,
 * seasonality, and predict future performance.
 *
 * @param {string[]} kpiIds - KPIs to analyze
 * @param {Array<TimeRange>} periods - Historical periods
 * @returns {Promise<{trends: KPITrend[], patterns: any[], predictions: any[]}>} Trend analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeKPITrendsAndPatterns(
 *   ['vulnerability_remediation_rate', 'incident_response_time'],
 *   [
 *     { start: new Date('2025-01-01'), end: new Date('2025-03-31') },
 *     { start: new Date('2025-04-01'), end: new Date('2025-06-30') },
 *     { start: new Date('2025-07-01'), end: new Date('2025-09-30') },
 *     { start: new Date('2025-10-01'), end: new Date('2025-12-31') }
 *   ]
 * );
 *
 * analysis.trends.forEach(trend => {
 *   console.log(`${trend.kpiName}: ${trend.trend} (change: ${trend.changeRate}%)`);
 * });
 * ```
 */
export declare function analyzeKPITrendsAndPatterns(kpiIds: string[], periods: Array<TimeRange>): Promise<{
    trends: KPITrend[];
    patterns: Array<{
        kpi: string;
        pattern: 'increasing' | 'decreasing' | 'cyclical' | 'seasonal' | 'stable';
        confidence: number;
        description: string;
    }>;
    predictions: Array<{
        kpi: string;
        nextPeriod: Date;
        predictedValue: number;
        confidence: number;
    }>;
}>;
/**
 * Compares KPI performance across organizational units
 *
 * Performs comparative analysis of KPI performance across different business
 * units, departments, or teams to identify best performers and areas needing support.
 *
 * @param {string[]} kpiIds - KPIs to compare
 * @param {string[]} units - Organizational units
 * @param {TimeRange} period - Comparison period
 * @returns {Promise<{comparisons: any[], rankings: any[], insights: string[]}>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareKPIPerformanceAcrossUnits(
 *   ['patch_compliance', 'incident_response_time', 'training_completion'],
 *   ['IT', 'Operations', 'Clinical', 'Finance'],
 *   { start: new Date('2025-10-01'), end: new Date('2025-11-01') }
 * );
 *
 * console.log('Rankings:');
 * comparison.rankings.forEach((rank, index) => {
 *   console.log(`${index + 1}. ${rank.unit}: ${rank.overallScore}`);
 * });
 * ```
 */
export declare function compareKPIPerformanceAcrossUnits(kpiIds: string[], units: string[], period: TimeRange): Promise<{
    comparisons: Array<{
        kpi: string;
        unitPerformance: Record<string, number>;
        bestPerformer: string;
        worstPerformer: string;
    }>;
    rankings: Array<{
        unit: string;
        overallScore: number;
        rank: number;
    }>;
    insights: string[];
}>;
/**
 * Generates KPI improvement recommendations
 *
 * Analyzes underperforming KPIs and generates specific, actionable recommendations
 * with priority, timeline, and expected impact.
 *
 * @param {TimeRange} period - Analysis period
 * @param {number} targetImprovement - Target improvement percentage
 * @returns {Promise<{recommendations: any[], prioritization: any[], roadmap: any}>} Improvement recommendations
 *
 * @example
 * ```typescript
 * const improvements = await generateKPIImprovementRecommendations(
 *   { start: new Date(), end: new Date() },
 *   25 // 25% improvement target
 * );
 *
 * console.log('Top Priority Improvements:');
 * improvements.recommendations.filter(r => r.priority === 'high').forEach(rec => {
 *   console.log(`- ${rec.kpi}: ${rec.recommendation}`);
 *   console.log(`  Expected impact: ${rec.expectedImprovement}%`);
 *   console.log(`  Timeline: ${rec.timeline}`);
 * });
 * ```
 */
export declare function generateKPIImprovementRecommendations(period: TimeRange, targetImprovement?: number): Promise<{
    recommendations: Array<{
        kpi: string;
        currentValue: number;
        targetValue: number;
        gap: number;
        priority: 'critical' | 'high' | 'medium' | 'low';
        recommendation: string;
        expectedImprovement: number;
        timeline: string;
        resources: string[];
    }>;
    prioritization: Array<{
        kpi: string;
        priority: number;
        impact: number;
    }>;
    roadmap: {
        phases: any[];
        duration: string;
    };
}>;
/**
 * Calculates KPI achievement rates
 *
 * Calculates achievement rates for KPIs across categories and time periods
 * with trend analysis and forecasting.
 *
 * @param {Array<TimeRange>} periods - Time periods to analyze
 * @returns {Promise<{rates: any[], trends: any[], forecast: any}>} Achievement rates
 *
 * @example
 * ```typescript
 * const achievement = await calculateKPIAchievementRates([
 *   { start: new Date('2025-01-01'), end: new Date('2025-03-31') },
 *   { start: new Date('2025-04-01'), end: new Date('2025-06-30') },
 *   { start: new Date('2025-07-01'), end: new Date('2025-09-30') },
 *   { start: new Date('2025-10-01'), end: new Date('2025-12-31') }
 * ]);
 *
 * achievement.rates.forEach(rate => {
 *   console.log(`${rate.period}: ${rate.achievementRate}%`);
 * });
 * ```
 */
export declare function calculateKPIAchievementRates(periods: Array<TimeRange>): Promise<{
    rates: Array<{
        period: string;
        achievementRate: number;
        totalKPIs: number;
        achieved: number;
    }>;
    trends: {
        overall: 'improving' | 'stable' | 'declining';
        byCategory: Record<string, 'improving' | 'stable' | 'declining'>;
    };
    forecast: {
        nextPeriod: Date;
        predictedRate: number;
        confidence: number;
    };
}>;
/**
 * Exports KPI performance report with visualizations
 *
 * Generates comprehensive KPI performance report with charts, trends, and
 * analysis in multiple formats suitable for stakeholder distribution.
 *
 * @param {TimeRange} period - Reporting period
 * @param {Object} options - Export options
 * @returns {Promise<{exports: any[], summary: string}>} Export results
 *
 * @example
 * ```typescript
 * const report = await exportKPIPerformanceReport(
 *   { start: new Date('2025-Q3'), end: new Date('2025-Q4') },
 *   {
 *     formats: ['pdf', 'xlsx'],
 *     includeCharts: true,
 *     includeRawData: true,
 *     recipients: ['management@company.com']
 *   }
 * );
 *
 * console.log(report.summary);
 * report.exports.forEach(exp => {
 *   console.log(`Generated: ${exp.filename}`);
 * });
 * ```
 */
export declare function exportKPIPerformanceReport(period: TimeRange, options?: {
    formats?: ('pdf' | 'xlsx' | 'pptx')[];
    includeCharts?: boolean;
    includeRawData?: boolean;
    recipients?: string[];
}): Promise<{
    exports: Array<{
        format: string;
        filename: string;
        url: string;
    }>;
    summary: string;
}>;
/**
 * Synchronizes KPI targets across systems
 *
 * Ensures KPI targets are synchronized across multiple systems, dashboards,
 * and reporting platforms to maintain consistency.
 *
 * @param {Array<{kpiId: string, target: number}>} targets - KPI targets to sync
 * @param {string[]} systems - Systems to synchronize
 * @returns {Promise<{synchronized: number, failed: number, results: any[]}>} Sync results
 *
 * @example
 * ```typescript
 * const sync = await synchronizeKPITargetsAcrossSystems(
 *   [
 *     { kpiId: 'mttd', target: 300 },
 *     { kpiId: 'mttr', target: 240 },
 *     { kpiId: 'compliance_rate', target: 95 }
 *   ],
 *   ['dashboard', 'reporting', 'analytics', 'monitoring']
 * );
 *
 * console.log(`Synchronized: ${sync.synchronized} targets`);
 * console.log(`Failed: ${sync.failed} targets`);
 * ```
 */
export declare function synchronizeKPITargetsAcrossSystems(targets: Array<{
    kpiId: string;
    target: number;
    thresholds?: any;
}>, systems: string[]): Promise<{
    synchronized: number;
    failed: number;
    results: Array<{
        kpiId: string;
        system: string;
        status: 'success' | 'failed';
        error?: string;
    }>;
}>;
/**
 * Calculates comprehensive security ROI analysis
 * @see Full implementation with JSDoc...
 */
export declare function calculateComprehensiveSecurityROI(period: TimeRange, options?: any): Promise<ROIAnalysisResult>;
/**
 * Assesses comprehensive threat exposure
 * @see Full implementation with JSDoc...
 */
export declare function assessComprehensiveThreatExposure(organizationId: string, period: TimeRange): Promise<ThreatExposureAssessment>;
/**
 * Analyzes comprehensive incident response metrics
 * @see Full implementation with JSDoc...
 */
export declare function analyzeComprehensiveIncidentResponseMetrics(period: TimeRange): Promise<IncidentResponseMetricsAnalysis>;
/**
 * Generates comprehensive compliance metrics report
 * @see Full implementation with JSDoc...
 */
export declare function generateComprehensiveComplianceMetrics(frameworks: string[], period: TimeRange): Promise<ComplianceMetricsReport>;
/**
 * @swagger
 * /api/metrics/comprehensive:
 *   post:
 *     summary: Calculate comprehensive security metrics
 *     tags: [Security Metrics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MetricsAnalysisConfig'
 *     responses:
 *       200:
 *         description: Metrics calculated successfully
 */
declare const _default: {
    calculateComprehensiveSecurityMetrics: typeof calculateComprehensiveSecurityMetrics;
    trackSecurityMetricTrends: typeof trackSecurityMetricTrends;
    generateRealtimeSecurityMetricsDashboard: typeof generateRealtimeSecurityMetricsDashboard;
    calculateSecurityMetricPercentiles: typeof calculateSecurityMetricPercentiles;
    compareSecurityMetricsAcrossDimensions: typeof compareSecurityMetricsAcrossDimensions;
    detectAndAnalyzeMetricAnomalies: typeof detectAndAnalyzeMetricAnomalies;
    generateMetricsCorrelationAnalysis: typeof generateMetricsCorrelationAnalysis;
    exportComprehensiveMetricsReport: typeof exportComprehensiveMetricsReport;
    calculateMetricBaselinesForAnomalyDetection: typeof calculateMetricBaselinesForAnomalyDetection;
    calculateAndAnalyzeSecurityKPIs: typeof calculateAndAnalyzeSecurityKPIs;
    trackKPIPerformanceAgainstTargets: typeof trackKPIPerformanceAgainstTargets;
    generateKPIPerformanceScorecard: typeof generateKPIPerformanceScorecard;
    analyzeKPITrendsAndPatterns: typeof analyzeKPITrendsAndPatterns;
    compareKPIPerformanceAcrossUnits: typeof compareKPIPerformanceAcrossUnits;
    generateKPIImprovementRecommendations: typeof generateKPIImprovementRecommendations;
    calculateKPIAchievementRates: typeof calculateKPIAchievementRates;
    exportKPIPerformanceReport: typeof exportKPIPerformanceReport;
    synchronizeKPITargetsAcrossSystems: typeof synchronizeKPITargetsAcrossSystems;
    calculateComprehensiveSecurityROI: typeof calculateComprehensiveSecurityROI;
    assessComprehensiveThreatExposure: typeof assessComprehensiveThreatExposure;
    analyzeComprehensiveIncidentResponseMetrics: typeof analyzeComprehensiveIncidentResponseMetrics;
    generateComprehensiveComplianceMetrics: typeof generateComprehensiveComplianceMetrics;
};
export default _default;
//# sourceMappingURL=threat-metrics-analytics-composite.d.ts.map