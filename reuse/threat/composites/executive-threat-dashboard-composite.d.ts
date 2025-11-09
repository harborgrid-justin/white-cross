/**
 * LOC: EXEC-DASH-COMPOSITE-001
 * File: /reuse/threat/composites/executive-threat-dashboard-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../executive-threat-reporting-kit
 *   - ../security-dashboard-kit
 *   - ../security-metrics-kpi-kit
 *   - ../security-roi-analysis-kit
 *   - ../threat-visualization-dashboard-kit
 *
 * DOWNSTREAM (imported by):
 *   - Executive dashboard services
 *   - C-level reporting modules
 *   - Board presentation generators
 *   - Strategic security planning services
 *   - Executive decision support systems
 */
import { ExecutiveThreatSummary, RiskPostureReport, BoardSecurityReport, SecurityROIAnalysis } from '../executive-threat-reporting-kit';
import { SecurityDashboard, TimeRange, DashboardId, WidgetId } from '../security-dashboard-kit';
import { SecurityKPI } from '../security-metrics-kpi-kit';
/**
 * Executive dashboard configuration
 *
 * @property {string} dashboardId - Unique dashboard identifier
 * @property {string} executiveLevel - Target executive audience level
 * @property {TimeRange} timeRange - Data time range for dashboard
 * @property {RefreshStrategy} refreshStrategy - Dashboard refresh configuration
 * @property {string[]} kpiSelection - Selected KPIs to display
 */
export interface ExecutiveDashboardConfig {
    dashboardId: string;
    executiveLevel: 'ceo' | 'ciso' | 'cto' | 'board' | 'executive_team';
    timeRange: TimeRange;
    refreshStrategy: RefreshStrategy;
    kpiSelection: string[];
    customization?: DashboardCustomization;
    metadata?: Record<string, any>;
}
/**
 * Dashboard refresh strategy
 *
 * @property {'manual' | 'auto' | 'scheduled'} mode - Refresh mode
 * @property {number} [interval] - Auto-refresh interval in milliseconds
 * @property {string} [schedule] - Cron expression for scheduled refresh
 */
export interface RefreshStrategy {
    mode: 'manual' | 'auto' | 'scheduled';
    interval?: number;
    schedule?: string;
}
/**
 * Dashboard customization options
 *
 * @property {string} [theme] - Dashboard theme (light/dark/custom)
 * @property {ColorScheme} [colorScheme] - Custom color scheme
 * @property {LayoutPreference} [layout] - Layout preferences
 */
export interface DashboardCustomization {
    theme?: 'light' | 'dark' | 'custom';
    colorScheme?: ColorScheme;
    layout?: LayoutPreference;
    branding?: BrandingConfig;
}
/**
 * Color scheme configuration
 */
export interface ColorScheme {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
}
/**
 * Layout preference
 */
export interface LayoutPreference {
    gridColumns: number;
    widgetSpacing: number;
    responsiveBreakpoints: Record<string, number>;
}
/**
 * Branding configuration
 */
export interface BrandingConfig {
    logo?: string;
    companyName?: string;
    headerColor?: string;
    footerText?: string;
}
/**
 * Strategic security intelligence report
 *
 * @property {string} reportId - Unique report identifier
 * @property {Date} generatedAt - Report generation timestamp
 * @property {ExecutiveThreatSummary} threatSummary - Executive threat summary
 * @property {RiskPostureReport} riskPosture - Risk posture analysis
 * @property {SecurityROIAnalysis} roiAnalysis - ROI analysis
 * @property {string[]} strategicRecommendations - High-level strategic recommendations
 */
export interface StrategicSecurityReport {
    reportId: string;
    generatedAt: Date;
    periodCovered: TimeRange;
    threatSummary: ExecutiveThreatSummary;
    riskPosture: RiskPostureReport;
    roiAnalysis: SecurityROIAnalysis;
    kpiPerformance: SecurityKPI[];
    strategicRecommendations: string[];
    executiveActions: string[];
    nextSteps: string[];
}
/**
 * Real-time executive metrics
 */
export interface RealtimeExecutiveMetrics {
    timestamp: Date;
    overallRiskScore: number;
    activeThreats: number;
    criticalIncidents: number;
    complianceScore: number;
    securityROI: number;
    trendIndicators: TrendIndicators;
}
/**
 * Trend indicators
 */
export interface TrendIndicators {
    risk: 'increasing' | 'decreasing' | 'stable';
    threats: 'increasing' | 'decreasing' | 'stable';
    incidents: 'increasing' | 'decreasing' | 'stable';
    compliance: 'improving' | 'declining' | 'stable';
}
/**
 * Creates a comprehensive C-level executive security dashboard
 *
 * Composes dashboard creation with executive summary generation, KPI initialization,
 * and real-time metric tracking to provide a complete executive security view.
 *
 * @param {string} ownerId - Executive user ID who will own the dashboard
 * @param {ExecutiveDashboardConfig} config - Dashboard configuration options
 * @returns {Promise<{dashboard: SecurityDashboard, summary: ExecutiveThreatSummary, kpis: SecurityKPI[]}>} Created dashboard with initial data
 *
 * @throws {Error} If dashboard creation fails or user lacks permissions
 *
 * @example
 * ```typescript
 * const executiveDashboard = await createComprehensiveExecutiveDashboard('exec_user_123', {
 *   dashboardId: 'ceo-dashboard-001',
 *   executiveLevel: 'ceo',
 *   timeRange: { start: new Date('2025-01-01'), end: new Date('2025-11-09'), preset: 'last_30d' },
 *   refreshStrategy: { mode: 'auto', interval: 60000 },
 *   kpiSelection: ['risk_score', 'incident_count', 'compliance_rate', 'roi'],
 *   customization: {
 *     theme: 'dark',
 *     colorScheme: { primary: '#0066CC', secondary: '#00AA66', success: '#28A745', warning: '#FFC107', danger: '#DC3545', info: '#17A2B8' }
 *   }
 * });
 *
 * console.log(`Dashboard created: ${executiveDashboard.dashboard.id}`);
 * console.log(`Overall risk score: ${executiveDashboard.summary.overallRiskScore}`);
 * console.log(`Active KPIs: ${executiveDashboard.kpis.length}`);
 * ```
 *
 * @see {@link createExecutiveDashboard} for base dashboard creation
 * @see {@link generateExecutiveThreatSummary} for threat summary generation
 * @see {@link calculateSecurityKPIs} for KPI calculation
 */
export declare function createComprehensiveExecutiveDashboard(ownerId: string, config: ExecutiveDashboardConfig): Promise<{
    dashboard: SecurityDashboard;
    summary: ExecutiveThreatSummary;
    kpis: SecurityKPI[];
}>;
/**
 * Generates real-time executive metrics snapshot
 *
 * Aggregates real-time security data from multiple sources to provide current
 * executive-level metrics including risk scores, active threats, incidents, and trends.
 *
 * @param {DashboardId} dashboardId - Dashboard identifier
 * @param {TimeRange} [comparisonPeriod] - Optional period for trend comparison
 * @returns {Promise<RealtimeExecutiveMetrics>} Current executive metrics with trends
 *
 * @throws {Error} If dashboard not found or metrics unavailable
 *
 * @example
 * ```typescript
 * const metrics = await getRealtimeExecutiveMetrics('dash_exec_123', {
 *   start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
 *   end: new Date()
 * });
 *
 * console.log(`Current risk score: ${metrics.overallRiskScore}/100`);
 * console.log(`Active threats: ${metrics.activeThreats}`);
 * console.log(`Risk trend: ${metrics.trendIndicators.risk}`);
 * ```
 */
export declare function getRealtimeExecutiveMetrics(dashboardId: DashboardId, comparisonPeriod?: TimeRange): Promise<RealtimeExecutiveMetrics>;
/**
 * Updates executive dashboard with latest intelligence
 *
 * Refreshes dashboard widgets, KPIs, and metrics with the latest threat intelligence
 * and security data. Supports both full and partial updates.
 *
 * @param {DashboardId} dashboardId - Dashboard to update
 * @param {Object} options - Update options
 * @param {boolean} [options.fullRefresh=false] - Whether to perform full refresh
 * @param {string[]} [options.widgetIds] - Specific widgets to update
 * @returns {Promise<{updatedWidgets: number, refreshedAt: Date}>} Update results
 *
 * @example
 * ```typescript
 * const result = await updateExecutiveDashboardData('dash_exec_123', {
 *   fullRefresh: true
 * });
 *
 * console.log(`Updated ${result.updatedWidgets} widgets at ${result.refreshedAt}`);
 * ```
 */
export declare function updateExecutiveDashboardData(dashboardId: DashboardId, options?: {
    fullRefresh?: boolean;
    widgetIds?: WidgetId[];
}): Promise<{
    updatedWidgets: number;
    refreshedAt: Date;
}>;
/**
 * Generates strategic security intelligence report for executives
 *
 * Composes comprehensive strategic report combining threat intelligence, risk analysis,
 * ROI metrics, and actionable recommendations for C-level decision making.
 *
 * @param {TimeRange} period - Reporting period
 * @param {string} executiveLevel - Target executive level
 * @returns {Promise<StrategicSecurityReport>} Comprehensive strategic report
 *
 * @throws {Error} If report generation fails
 *
 * @example
 * ```typescript
 * const report = await generateStrategicSecurityReport(
 *   { start: new Date('2025-Q3'), end: new Date('2025-Q4'), preset: 'last_90d' },
 *   'ciso'
 * );
 *
 * console.log(`Strategic recommendations: ${report.strategicRecommendations.length}`);
 * console.log(`Executive actions required: ${report.executiveActions.length}`);
 * report.strategicRecommendations.forEach(rec => console.log(`- ${rec}`));
 * ```
 */
export declare function generateStrategicSecurityReport(period: TimeRange, executiveLevel: 'ceo' | 'ciso' | 'cto' | 'board' | 'executive_team'): Promise<StrategicSecurityReport>;
/**
 * Creates customized board presentation from dashboard data
 *
 * Transforms executive dashboard data into board-ready presentation format with
 * visualizations, executive summaries, and key decision points.
 *
 * @param {DashboardId} dashboardId - Source dashboard
 * @param {TimeRange} period - Reporting period
 * @param {Object} options - Presentation options
 * @returns {Promise<{slides: any[], exportUrl: string}>} Board presentation
 *
 * @example
 * ```typescript
 * const presentation = await createBoardPresentationFromDashboard('dash_exec_123', {
 *   start: new Date('2025-Q3'),
 *   end: new Date('2025-Q4')
 * }, {
 *   includeFinancials: true,
 *   visualizationStyle: 'executive'
 * });
 *
 * console.log(`Presentation ready with ${presentation.slides.length} slides`);
 * ```
 */
export declare function createBoardPresentationFromDashboard(dashboardId: DashboardId, period: TimeRange, options?: {
    includeFinancials?: boolean;
    visualizationStyle?: 'executive' | 'technical' | 'board';
}): Promise<{
    slides: any[];
    exportUrl: string;
}>;
/**
 * Generates executive KPI performance comparison report
 *
 * Compares current KPI performance against targets, historical data, and industry
 * benchmarks to provide comprehensive performance analysis for executives.
 *
 * @param {string[]} kpiIds - KPIs to compare
 * @param {TimeRange} currentPeriod - Current measurement period
 * @param {TimeRange} comparisonPeriod - Historical comparison period
 * @returns {Promise<Array<{kpi: string, current: number, target: number, benchmark: number, performance: string}>>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareExecutiveKPIPerformance(
 *   ['risk_score', 'incident_response_time', 'compliance_rate'],
 *   { start: new Date('2025-10-01'), end: new Date('2025-11-01') },
 *   { start: new Date('2025-09-01'), end: new Date('2025-10-01') }
 * );
 *
 * comparison.forEach(kpi => {
 *   console.log(`${kpi.kpi}: ${kpi.performance} (${kpi.current} vs target ${kpi.target})`);
 * });
 * ```
 */
export declare function compareExecutiveKPIPerformance(kpiIds: string[], currentPeriod: TimeRange, comparisonPeriod: TimeRange): Promise<Array<{
    kpi: string;
    current: number;
    target: number;
    benchmark: number;
    performance: 'exceeding' | 'on_target' | 'below_target';
    trend: 'improving' | 'stable' | 'declining';
}>>;
/**
 * Exports executive dashboard to multiple formats
 *
 * Exports dashboard data, visualizations, and reports to PDF, Excel, PowerPoint,
 * or JSON formats suitable for executive distribution and archival.
 *
 * @param {DashboardId} dashboardId - Dashboard to export
 * @param {Object} options - Export options
 * @returns {Promise<{format: string, data: any, url: string}>} Export result
 *
 * @example
 * ```typescript
 * const export = await exportExecutiveDashboardToMultipleFormats('dash_exec_123', {
 *   formats: ['pdf', 'xlsx'],
 *   includeData: true,
 *   includeVisualizations: true
 * });
 *
 * console.log(`Exported to: ${export.url}`);
 * ```
 */
export declare function exportExecutiveDashboardToMultipleFormats(dashboardId: DashboardId, options?: {
    formats?: ('pdf' | 'xlsx' | 'pptx' | 'json')[];
    includeData?: boolean;
    includeVisualizations?: boolean;
    timeRange?: TimeRange;
}): Promise<Array<{
    format: string;
    data: any;
    url: string;
}>>;
/**
 * Schedules automated executive dashboard distribution
 *
 * Configures automated dashboard report generation and distribution to executives
 * on a defined schedule (daily, weekly, monthly, quarterly).
 *
 * @param {DashboardId} dashboardId - Dashboard to distribute
 * @param {Object} schedule - Distribution schedule configuration
 * @returns {Promise<{scheduleId: string, nextRun: Date}>} Schedule confirmation
 *
 * @example
 * ```typescript
 * const schedule = await scheduleExecutiveDashboardDistribution('dash_exec_123', {
 *   frequency: 'weekly',
 *   dayOfWeek: 'Monday',
 *   time: '08:00',
 *   recipients: ['ceo@company.com', 'ciso@company.com'],
 *   formats: ['pdf', 'xlsx']
 * });
 *
 * console.log(`Scheduled ID: ${schedule.scheduleId}`);
 * console.log(`Next delivery: ${schedule.nextRun}`);
 * ```
 */
export declare function scheduleExecutiveDashboardDistribution(dashboardId: DashboardId, schedule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: string;
    dayOfMonth?: number;
    time: string;
    recipients: string[];
    formats: ('pdf' | 'xlsx' | 'pptx')[];
}): Promise<{
    scheduleId: string;
    nextRun: Date;
}>;
/**
 * Enables real-time executive dashboard monitoring
 *
 * Sets up WebSocket-based real-time monitoring for executive dashboards with
 * configurable alert thresholds and notification preferences.
 *
 * @param {DashboardId} dashboardId - Dashboard to monitor
 * @param {Object} config - Monitoring configuration
 * @returns {() => void} Unsubscribe function
 *
 * @example
 * ```typescript
 * const unsubscribe = enableRealtimeDashboardMonitoring('dash_exec_123', {
 *   alertThresholds: {
 *     riskScore: { critical: 80, high: 60 },
 *     incidents: { critical: 10, high: 5 }
 *   },
 *   onAlert: (alert) => {
 *     console.log(`ALERT: ${alert.severity} - ${alert.message}`);
 *     sendExecutiveNotification(alert);
 *   }
 * });
 *
 * // Later: unsubscribe() to stop monitoring
 * ```
 */
export declare function enableRealtimeDashboardMonitoring(dashboardId: DashboardId, config?: {
    alertThresholds?: {
        riskScore?: {
            critical: number;
            high: number;
        };
        incidents?: {
            critical: number;
            high: number;
        };
        compliance?: {
            critical: number;
            high: number;
        };
    };
    onAlert?: (alert: {
        severity: string;
        message: string;
        timestamp: Date;
    }) => void;
    onUpdate?: (metrics: RealtimeExecutiveMetrics) => void;
}): () => void;
/**
 * Calculates comprehensive executive KPI scorecard
 *
 * Generates complete executive KPI scorecard including security, compliance,
 * operational, and financial KPIs with trend analysis and performance indicators.
 *
 * @param {TimeRange} period - Measurement period
 * @param {Object} options - Calculation options
 * @returns {Promise<{scorecard: SecurityKPI[], summary: any}>} KPI scorecard with summary
 *
 * @throws {Error} If KPI calculation fails
 *
 * @example
 * ```typescript
 * const scorecard = await calculateExecutiveKPIScorecard(
 *   { start: new Date('2025-10-01'), end: new Date('2025-11-01') },
 *   {
 *     includeFinancialKPIs: true,
 *     includeBenchmarks: true,
 *     categories: ['security', 'compliance', 'operational']
 *   }
 * );
 *
 * console.log(`Total KPIs: ${scorecard.scorecard.length}`);
 * console.log(`On target: ${scorecard.summary.onTarget}`);
 * console.log(`At risk: ${scorecard.summary.atRisk}`);
 * ```
 *
 * @see {@link calculateSecurityKPIs} for underlying KPI calculation
 */
export declare function calculateExecutiveKPIScorecard(period: TimeRange, options?: {
    includeFinancialKPIs?: boolean;
    includeBenchmarks?: boolean;
    categories?: string[];
}): Promise<{
    scorecard: SecurityKPI[];
    summary: {
        total: number;
        onTarget: number;
        atRisk: number;
        offTarget: number;
        avgPerformance: number;
    };
}>;
/**
 * Tracks executive KPI trends over time
 *
 * Analyzes KPI performance trends across multiple time periods to identify
 * patterns, improvements, and areas requiring executive attention.
 *
 * @param {string[]} kpiIds - KPIs to track
 * @param {Array<TimeRange>} periods - Time periods to analyze
 * @returns {Promise<Map<string, Array<{period: string, value: number, trend: string}>>>} Trend data by KPI
 *
 * @example
 * ```typescript
 * const trends = await trackExecutiveKPITrends(
 *   ['risk_score', 'compliance_rate', 'incident_response_time'],
 *   [
 *     { start: new Date('2025-08-01'), end: new Date('2025-09-01'), preset: 'custom' },
 *     { start: new Date('2025-09-01'), end: new Date('2025-10-01'), preset: 'custom' },
 *     { start: new Date('2025-10-01'), end: new Date('2025-11-01'), preset: 'custom' }
 *   ]
 * );
 *
 * trends.forEach((trendData, kpiId) => {
 *   console.log(`\n${kpiId} trend:`);
 *   trendData.forEach(point => {
 *     console.log(`  ${point.period}: ${point.value} (${point.trend})`);
 *   });
 * });
 * ```
 */
export declare function trackExecutiveKPITrends(kpiIds: string[], periods: Array<TimeRange>): Promise<Map<string, Array<{
    period: string;
    value: number;
    trend: 'improving' | 'stable' | 'declining';
}>>>;
/**
 * Generates KPI performance alerts for executives
 *
 * Monitors KPIs against thresholds and generates executive-level alerts when
 * KPIs deviate from targets or show concerning trends.
 *
 * @param {string[]} kpiIds - KPIs to monitor
 * @param {TimeRange} period - Monitoring period
 * @param {Object} thresholds - Alert thresholds
 * @returns {Promise<Array<{kpi: string, severity: string, message: string, recommendation: string}>>} Generated alerts
 *
 * @example
 * ```typescript
 * const alerts = await generateKPIPerformanceAlerts(
 *   ['risk_score', 'compliance_rate', 'incident_count'],
 *   { start: new Date(), end: new Date(), preset: 'last_24h' },
 *   {
 *     riskScore: { critical: 80, warning: 60 },
 *     complianceRate: { critical: 70, warning: 85 },
 *     incidentCount: { critical: 10, warning: 5 }
 *   }
 * );
 *
 * alerts.forEach(alert => {
 *   console.log(`[${alert.severity}] ${alert.kpi}: ${alert.message}`);
 *   console.log(`  Recommendation: ${alert.recommendation}`);
 * });
 * ```
 */
export declare function generateKPIPerformanceAlerts(kpiIds: string[], period: TimeRange, thresholds: Record<string, {
    critical: number;
    warning: number;
}>): Promise<Array<{
    kpi: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    recommendation: string;
    currentValue: number;
    threshold: number;
}>>;
/**
 * Calculates executive KPI achievement rate
 *
 * Determines overall KPI achievement percentage and identifies high-performing
 * and underperforming areas for executive review.
 *
 * @param {TimeRange} period - Measurement period
 * @returns {Promise<{achievementRate: number, byCategory: Record<string, number>, topPerformers: string[], needsAttention: string[]}>} Achievement analysis
 *
 * @example
 * ```typescript
 * const achievement = await calculateExecutiveKPIAchievementRate({
 *   start: new Date('2025-10-01'),
 *   end: new Date('2025-11-01')
 * });
 *
 * console.log(`Overall achievement: ${achievement.achievementRate}%`);
 * console.log(`Top performers: ${achievement.topPerformers.join(', ')}`);
 * console.log(`Needs attention: ${achievement.needsAttention.join(', ')}`);
 * ```
 */
export declare function calculateExecutiveKPIAchievementRate(period: TimeRange): Promise<{
    achievementRate: number;
    byCategory: Record<string, number>;
    topPerformers: string[];
    needsAttention: string[];
}>;
/**
 * Generates executive KPI benchmark comparison
 *
 * Compares organization's KPI performance against industry benchmarks, peer
 * organizations, and best-in-class standards.
 *
 * @param {string[]} kpiIds - KPIs to benchmark
 * @param {TimeRange} period - Measurement period
 * @param {Object} options - Benchmarking options
 * @returns {Promise<Array<{kpi: string, ourValue: number, industryAvg: number, peerAvg: number, bestInClass: number, percentile: number}>>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const benchmarks = await generateExecutiveKPIBenchmarkComparison(
 *   ['incident_response_time', 'detection_rate', 'compliance_score'],
 *   { start: new Date('2025-01-01'), end: new Date('2025-11-01') },
 *   {
 *     industry: 'healthcare',
 *     includeRegionalData: true
 *   }
 * );
 *
 * benchmarks.forEach(b => {
 *   console.log(`\n${b.kpi}:`);
 *   console.log(`  Our value: ${b.ourValue}`);
 *   console.log(`  Industry avg: ${b.industryAvg}`);
 *   console.log(`  Percentile: ${b.percentile}th`);
 * });
 * ```
 */
export declare function generateExecutiveKPIBenchmarkComparison(kpiIds: string[], period: TimeRange, options?: {
    industry?: string;
    includeRegionalData?: boolean;
}): Promise<Array<{
    kpi: string;
    ourValue: number;
    industryAvg: number;
    peerAvg: number;
    bestInClass: number;
    percentile: number;
    rating: 'excellent' | 'above_average' | 'average' | 'below_average';
}>>;
/**
 * Creates executive KPI improvement roadmap
 *
 * Analyzes underperforming KPIs and generates actionable roadmap with timelines,
 * resource requirements, and expected improvements.
 *
 * @param {TimeRange} period - Analysis period
 * @param {number} targetImprovement - Target improvement percentage
 * @returns {Promise<{roadmap: Array<any>, estimatedTimeline: string, resourceRequirements: string[]}>} Improvement roadmap
 *
 * @example
 * ```typescript
 * const roadmap = await createExecutiveKPIImprovementRoadmap(
 *   { start: new Date(), end: new Date() },
 *   20 // 20% improvement target
 * );
 *
 * console.log(`Timeline: ${roadmap.estimatedTimeline}`);
 * console.log(`\nImprovement initiatives:`);
 * roadmap.roadmap.forEach(initiative => {
 *   console.log(`- ${initiative.kpi}: ${initiative.action} (Impact: ${initiative.expectedImprovement}%)`);
 * });
 * ```
 */
export declare function createExecutiveKPIImprovementRoadmap(period: TimeRange, targetImprovement?: number): Promise<{
    roadmap: Array<{
        kpi: string;
        currentValue: number;
        targetValue: number;
        gap: number;
        action: string;
        timeline: string;
        resources: string[];
        expectedImprovement: number;
    }>;
    estimatedTimeline: string;
    resourceRequirements: string[];
}>;
/**
 * Generates executive KPI visualization data
 *
 * Prepares KPI data in formats optimized for executive dashboard visualizations
 * including gauges, charts, and heatmaps.
 *
 * @param {string[]} kpiIds - KPIs to visualize
 * @param {TimeRange} period - Data period
 * @param {string} visualizationType - Type of visualization
 * @returns {Promise<{labels: string[], datasets: any[], config: any}>} Visualization data
 *
 * @example
 * ```typescript
 * const vizData = await generateExecutiveKPIVisualizationData(
 *   ['risk_score', 'compliance_rate', 'incident_count'],
 *   { start: new Date(), end: new Date() },
 *   'gauge'
 * );
 *
 * // Use with charting library
 * renderChart('executive-kpis', vizData);
 * ```
 */
export declare function generateExecutiveKPIVisualizationData(kpiIds: string[], period: TimeRange, visualizationType?: 'gauge' | 'bar' | 'line' | 'heatmap'): Promise<{
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor?: string[];
        borderColor?: string[];
    }>;
    config: {
        type: string;
        options: Record<string, any>;
    };
}>;
/**
 * Exports executive KPI report to multiple formats
 *
 * Generates comprehensive KPI reports in PDF, Excel, PowerPoint formats
 * with charts, trends, and executive summaries.
 *
 * @param {TimeRange} period - Reporting period
 * @param {Object} options - Export options
 * @returns {Promise<Array<{format: string, url: string}>>} Export results
 *
 * @example
 * ```typescript
 * const exports = await exportExecutiveKPIReport(
 *   { start: new Date('2025-Q3'), end: new Date('2025-Q4') },
 *   {
 *     formats: ['pdf', 'xlsx', 'pptx'],
 *     includeCharts: true,
 *     includeTrends: true,
 *     recipients: ['ceo@company.com']
 *   }
 * );
 *
 * exports.forEach(exp => {
 *   console.log(`${exp.format}: ${exp.url}`);
 * });
 * ```
 */
export declare function exportExecutiveKPIReport(period: TimeRange, options?: {
    formats?: ('pdf' | 'xlsx' | 'pptx')[];
    includeCharts?: boolean;
    includeTrends?: boolean;
    recipients?: string[];
}): Promise<Array<{
    format: string;
    url: string;
    filename: string;
}>>;
/**
 * Synchronizes executive KPIs across dashboards
 *
 * Ensures consistent KPI values and configurations across multiple executive
 * dashboards and reporting systems.
 *
 * @param {DashboardId[]} dashboardIds - Dashboards to synchronize
 * @param {TimeRange} period - Data period
 * @returns {Promise<{synchronized: number, updated: Date}>} Synchronization result
 *
 * @example
 * ```typescript
 * const result = await synchronizeExecutiveKPIsAcrossDashboards(
 *   ['dash_ceo_001', 'dash_ciso_001', 'dash_board_001'],
 *   { start: new Date(), end: new Date() }
 * );
 *
 * console.log(`Synchronized ${result.synchronized} dashboards at ${result.updated}`);
 * ```
 */
export declare function synchronizeExecutiveKPIsAcrossDashboards(dashboardIds: DashboardId[], period: TimeRange): Promise<{
    synchronized: number;
    updated: Date;
    dashboards: Array<{
        id: string;
        status: 'success' | 'failed';
    }>;
}>;
/**
 * Generates strategic threat landscape visualization
 *
 * Creates comprehensive visual representation of threat landscape including
 * geographic distribution, attack vectors, and threat actor activity.
 *
 * @param {TimeRange} period - Analysis period
 * @param {Object} options - Visualization options
 * @returns {Promise<{map: any, timeline: any, vectors: any, actors: any}>} Threat landscape visualizations
 *
 * @throws {Error} If visualization generation fails
 *
 * @example
 * ```typescript
 * const landscape = await generateStrategicThreatLandscapeVisualization(
 *   { start: new Date('2025-10-01'), end: new Date('2025-11-01') },
 *   {
 *     includeGeographicMap: true,
 *     includeTimeline: true,
 *     includeActorAnalysis: true
 *   }
 * );
 *
 * renderThreatMap(landscape.map);
 * renderTimeline(landscape.timeline);
 * renderVectorChart(landscape.vectors);
 * ```
 *
 * @see {@link renderThreatMap} for geographic visualization
 * @see {@link generateThreatTimeline} for timeline generation
 */
export declare function generateStrategicThreatLandscapeVisualization(period: TimeRange, options?: {
    includeGeographicMap?: boolean;
    includeTimeline?: boolean;
    includeActorAnalysis?: boolean;
}): Promise<{
    map?: any;
    timeline?: any;
    vectors?: any;
    actors?: any;
}>;
/**
 * Creates executive risk heatmap visualization
 *
 * Generates interactive risk heatmap showing risk distribution across systems,
 * assets, and business functions for executive review.
 *
 * @param {TimeRange} period - Analysis period
 * @param {Object} dimensions - Heatmap dimensions
 * @returns {Promise<{data: number[][], labels: {x: string[], y: string[]}, metadata: any}>} Heatmap data
 *
 * @example
 * ```typescript
 * const heatmap = await createExecutiveRiskHeatmap(
 *   { start: new Date(), end: new Date() },
 *   {
 *     xAxis: 'businessUnit',
 *     yAxis: 'riskCategory'
 *   }
 * );
 *
 * renderHeatmap('risk-heatmap-container', heatmap);
 * ```
 */
export declare function createExecutiveRiskHeatmap(period: TimeRange, dimensions?: {
    xAxis: 'businessUnit' | 'system' | 'assetType';
    yAxis: 'riskCategory' | 'threatType' | 'severity';
}): Promise<{
    data: number[][];
    labels: {
        x: string[];
        y: string[];
    };
    metadata: {
        maxRisk: number;
        avgRisk: number;
        criticalCells: number;
    };
}>;
/**
 * Generates executive compliance status visualization
 *
 * Creates visual representation of compliance status across frameworks with
 * trends, gaps, and remediation timelines.
 *
 * @param {Array<'hipaa' | 'pci_dss' | 'sox' | 'gdpr' | 'nist' | 'iso27001'>} frameworks - Compliance frameworks
 * @param {TimeRange} period - Analysis period
 * @returns {Promise<{scorecards: any[], trends: any[], gaps: any[]}>} Compliance visualizations
 *
 * @example
 * ```typescript
 * const compliance = await generateExecutiveComplianceVisualization(
 *   ['hipaa', 'nist', 'iso27001'],
 *   { start: new Date('2025-01-01'), end: new Date('2025-11-01') }
 * );
 *
 * renderComplianceDashboard(compliance);
 * ```
 */
export declare function generateExecutiveComplianceVisualization(frameworks: Array<'hipaa' | 'pci_dss' | 'sox' | 'gdpr' | 'nist' | 'iso27001'>, period: TimeRange): Promise<{
    scorecards: Array<{
        framework: string;
        score: number;
        status: string;
        color: string;
    }>;
    trends: Array<{
        framework: string;
        history: Array<{
            date: Date;
            score: number;
        }>;
    }>;
    gaps: Array<{
        framework: string;
        gapCount: number;
        criticalGaps: number;
    }>;
}>;
/**
 * Creates executive ROI dashboard visualization
 *
 * Generates comprehensive ROI visualization showing security investments,
 * returns, cost avoidance, and financial impact.
 *
 * @param {TimeRange} period - Analysis period
 * @param {Object} options - Visualization options
 * @returns {Promise<{investments: any, returns: any, costAvoidance: any, projections: any}>} ROI visualizations
 *
 * @example
 * ```typescript
 * const roiDashboard = await createExecutiveROIDashboardVisualization(
 *   { start: new Date('2025-01-01'), end: new Date('2025-11-01') },
 *   {
 *     includeProjections: true,
 *     projectionYears: 3
 *   }
 * );
 *
 * renderROIDashboard(roiDashboard);
 * ```
 */
export declare function createExecutiveROIDashboardVisualization(period: TimeRange, options?: {
    includeProjections?: boolean;
    projectionYears?: number;
}): Promise<{
    investments: any;
    returns: any;
    costAvoidance: any;
    projections?: any;
}>;
/**
 * Generates executive security posture assessment visualization
 *
 * Creates visual security posture assessment showing maturity levels,
 * domain scores, and improvement recommendations.
 *
 * @param {TimeRange} period - Assessment period
 * @returns {Promise<{maturityRadar: any, domainScores: any, trends: any, recommendations: string[]}>} Posture visualizations
 *
 * @example
 * ```typescript
 * const posture = await generateExecutiveSecurityPostureVisualization({
 *   start: new Date('2025-01-01'),
 *   end: new Date('2025-11-01')
 * });
 *
 * renderMaturityRadar(posture.maturityRadar);
 * renderDomainScores(posture.domainScores);
 * ```
 */
export declare function generateExecutiveSecurityPostureVisualization(period: TimeRange): Promise<{
    maturityRadar: {
        labels: string[];
        data: number[];
        target: number[];
    };
    domainScores: Array<{
        domain: string;
        score: number;
        maturity: string;
        color: string;
    }>;
    trends: Array<{
        domain: string;
        trend: 'improving' | 'stable' | 'declining';
    }>;
    recommendations: string[];
}>;
/**
 * Creates executive incident metrics dashboard
 *
 * Generates incident response metrics visualization including MTTD, MTTR,
 * incident volume, and resolution trends.
 *
 * @param {TimeRange} period - Metrics period
 * @param {Object} options - Dashboard options
 * @returns {Promise<{mttd: number, mttr: number, volume: any, trends: any}>} Incident metrics dashboard
 *
 * @example
 * ```typescript
 * const incidentMetrics = await createExecutiveIncidentMetricsDashboard(
 *   { start: new Date('2025-10-01'), end: new Date('2025-11-01') },
 *   {
 *     includeComparison: true,
 *     comparisonPeriod: { start: new Date('2025-09-01'), end: new Date('2025-10-01') }
 *   }
 * );
 *
 * console.log(`MTTD: ${incidentMetrics.mttd} minutes`);
 * console.log(`MTTR: ${incidentMetrics.mttr} minutes`);
 * ```
 */
export declare function createExecutiveIncidentMetricsDashboard(period: TimeRange, options?: {
    includeComparison?: boolean;
    comparisonPeriod?: TimeRange;
}): Promise<{
    mttd: number;
    mttr: number;
    volume: {
        total: number;
        critical: number;
        byType: Record<string, number>;
    };
    trends: {
        mttd: 'improving' | 'stable' | 'declining';
        mttr: 'improving' | 'stable' | 'declining';
        volume: 'increasing' | 'stable' | 'decreasing';
    };
    comparison?: {
        mttdChange: number;
        mttrChange: number;
        volumeChange: number;
    };
}>;
/**
 * Generates executive threat intelligence summary visualization
 *
 * Creates visual threat intelligence summary with threat actors, campaigns,
 * TTPs, and strategic recommendations.
 *
 * @param {TimeRange} period - Intelligence period
 * @param {Object} options - Summary options
 * @returns {Promise<{actors: any[], campaigns: any[], ttps: any[], recommendations: string[]}>} Threat intelligence summary
 *
 * @example
 * ```typescript
 * const threatIntel = await generateExecutiveThreatIntelligenceSummary(
 *   { start: new Date('2025-10-01'), end: new Date('2025-11-01') },
 *   {
 *     focusOnHealthcareSector: true,
 *     includeAttributionAnalysis: true
 *   }
 * );
 *
 * renderThreatActors(threatIntel.actors);
 * renderCampaigns(threatIntel.campaigns);
 * ```
 */
export declare function generateExecutiveThreatIntelligenceSummary(period: TimeRange, options?: {
    focusOnHealthcareSector?: boolean;
    includeAttributionAnalysis?: boolean;
}): Promise<{
    actors: Array<{
        name: string;
        activityLevel: 'high' | 'medium' | 'low';
        targeting: string[];
        campaigns: number;
    }>;
    campaigns: Array<{
        name: string;
        status: 'active' | 'dormant';
        targets: number;
        severity: string;
    }>;
    ttps: Array<{
        technique: string;
        prevalence: number;
        mitigation: string;
    }>;
    recommendations: string[];
}>;
/**
 * Creates executive budget allocation visualization
 *
 * Generates security budget allocation visualization showing spending by category,
 * ROI, and optimization recommendations.
 *
 * @param {TimeRange} period - Budget period
 * @param {number} totalBudget - Total security budget
 * @returns {Promise<{allocation: any, recommendations: any, optimization: any}>} Budget visualization
 *
 * @example
 * ```typescript
 * const budget = await createExecutiveBudgetAllocationVisualization(
 *   { start: new Date('2025-01-01'), end: new Date('2025-12-31') },
 *   5000000
 * );
 *
 * renderBudgetAllocation(budget.allocation);
 * renderOptimizationRecommendations(budget.optimization);
 * ```
 */
export declare function createExecutiveBudgetAllocationVisualization(period: TimeRange, totalBudget: number): Promise<{
    allocation: {
        categories: string[];
        amounts: number[];
        percentages: number[];
    };
    recommendations: Array<{
        category: string;
        currentSpend: number;
        recommendedSpend: number;
        expectedROI: number;
    }>;
    optimization: {
        potentialSavings: number;
        reallocationSuggestions: string[];
    };
}>;
/**
 * Generates executive decision support analytics
 *
 * Creates decision support analytics combining multiple data sources to provide
 * actionable insights for executive security decisions.
 *
 * @param {TimeRange} period - Analysis period
 * @param {string} decisionContext - Context for decision making
 * @returns {Promise<{insights: string[], options: any[], recommendations: any[]}>} Decision support analytics
 *
 * @example
 * ```typescript
 * const analytics = await generateExecutiveDecisionSupportAnalytics(
 *   { start: new Date(), end: new Date() },
 *   'security_investment'
 * );
 *
 * analytics.insights.forEach(insight => console.log(`- ${insight}`));
 * analytics.options.forEach(opt => {
 *   console.log(`\nOption: ${opt.name}`);
 *   console.log(`  Cost: $${opt.cost}`);
 *   console.log(`  ROI: ${opt.expectedROI}%`);
 * });
 * ```
 */
export declare function generateExecutiveDecisionSupportAnalytics(period: TimeRange, decisionContext: 'security_investment' | 'risk_mitigation' | 'compliance' | 'incident_response'): Promise<{
    insights: string[];
    options: Array<{
        name: string;
        cost: number;
        expectedROI: number;
        riskReduction: number;
        implementation: string;
    }>;
    recommendations: Array<{
        priority: 'critical' | 'high' | 'medium';
        action: string;
        rationale: string;
        impact: string;
    }>;
}>;
/**
 * Creates board-ready security presentation
 *
 * Generates comprehensive board presentation with executive summaries, risk analysis,
 * compliance status, and strategic recommendations in board-appropriate format.
 *
 * @param {TimeRange} period - Reporting period
 * @param {string} fiscalQuarter - Fiscal quarter identifier
 * @param {Object} options - Presentation options
 * @returns {Promise<{slides: any[], appendices: any[], exportUrl: string}>} Board presentation
 *
 * @throws {Error} If presentation generation fails
 *
 * @example
 * ```typescript
 * const presentation = await createBoardReadySecurityPresentation(
 *   { start: new Date('2025-Q3'), end: new Date('2025-Q4') },
 *   'Q4 2025',
 *   {
 *     includeFinancials: true,
 *     includeComplianceDetails: true,
 *     format: 'powerpoint'
 *   }
 * );
 *
 * console.log(`Presentation ready with ${presentation.slides.length} slides`);
 * console.log(`Download: ${presentation.exportUrl}`);
 * ```
 *
 * @see {@link generateBoardSecurityReport} for underlying report generation
 * @see {@link createExecutivePresentation} for slide creation
 */
export declare function createBoardReadySecurityPresentation(period: TimeRange, fiscalQuarter: string, options?: {
    includeFinancials?: boolean;
    includeComplianceDetails?: boolean;
    format?: 'powerpoint' | 'pdf' | 'keynote';
}): Promise<{
    slides: any[];
    appendices: any[];
    exportUrl: string;
    metadata: {
        generatedAt: Date;
        period: TimeRange;
        slideCount: number;
    };
}>;
/**
 * Generates C-level security briefing document
 *
 * Creates concise, executive-level security briefing suitable for CEO, CISO,
 * and other C-level executives with actionable insights and recommendations.
 *
 * @param {DashboardId} dashboardId - Source dashboard for briefing
 * @param {TimeRange} period - Briefing period
 * @param {string} executiveRole - Target executive role
 * @returns {Promise<{briefing: any, deliveryFormat: string}>} Security briefing
 *
 * @example
 * ```typescript
 * const briefing = await generateCLevelSecurityBriefing(
 *   'dash_exec_123',
 *   { start: new Date('2025-11-01'), end: new Date('2025-11-09') },
 *   'ceo'
 * );
 *
 * console.log(briefing.briefing.summary);
 * briefing.briefing.keyFindings.forEach(finding => console.log(`- ${finding}`));
 * ```
 */
export declare function generateCLevelSecurityBriefing(dashboardId: DashboardId, period: TimeRange, executiveRole: 'ceo' | 'ciso' | 'cto' | 'cfo'): Promise<{
    briefing: {
        summary: string;
        keyFindings: string[];
        recommendations: string[];
        metrics: Record<string, any>;
        executiveActions: string[];
    };
    deliveryFormat: string;
    generatedAt: Date;
}>;
/**
 * Creates quarterly executive security review
 *
 * Generates comprehensive quarterly security review for executive leadership
 * with year-over-year comparisons, trend analysis, and strategic planning.
 *
 * @param {string} quarter - Quarter identifier (Q1, Q2, Q3, Q4)
 * @param {number} year - Year
 * @param {Object} options - Review options
 * @returns {Promise<{review: any, presentation: any[], recommendations: any[]}>} Quarterly review
 *
 * @example
 * ```typescript
 * const review = await createQuarterlyExecutiveSecurityReview('Q4', 2025, {
 *   includeYoYComparison: true,
 *   includeStrategicPlanning: true
 * });
 *
 * console.log(`\nQuarterly Summary:`);
 * console.log(review.review.executiveSummary);
 * console.log(`\nKey Recommendations:`);
 * review.recommendations.forEach(rec => console.log(`- ${rec.recommendation}`));
 * ```
 */
export declare function createQuarterlyExecutiveSecurityReview(quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4', year: number, options?: {
    includeYoYComparison?: boolean;
    includeStrategicPlanning?: boolean;
}): Promise<{
    review: {
        executiveSummary: string;
        quarterlyPerformance: any;
        achievements: string[];
        challenges: string[];
        metrics: any;
    };
    presentation: any[];
    recommendations: Array<{
        priority: string;
        recommendation: string;
        timeline: string;
        impact: string;
    }>;
}>;
/**
 * Generates annual executive security report
 *
 * Creates comprehensive annual security report for board and executive leadership
 * with full year analysis, strategic achievements, and next year planning.
 *
 * @param {number} year - Report year
 * @param {Object} options - Report options
 * @returns {Promise<{report: any, executiveSummary: any, strategicPlan: any}>} Annual report
 *
 * @example
 * ```typescript
 * const annualReport = await generateAnnualExecutiveSecurityReport(2025, {
 *   includeStrategicPlan: true,
 *   includeFinancialAnalysis: true
 * });
 *
 * console.log(annualReport.executiveSummary);
 * console.log(`\nStrategic priorities for next year:`);
 * annualReport.strategicPlan.priorities.forEach(p => console.log(`- ${p}`));
 * ```
 */
export declare function generateAnnualExecutiveSecurityReport(year: number, options?: {
    includeStrategicPlan?: boolean;
    includeFinancialAnalysis?: boolean;
}): Promise<{
    report: BoardSecurityReport;
    executiveSummary: {
        yearInReview: string;
        majorAchievements: string[];
        keyMetrics: Record<string, number>;
        strategicDirection: string;
    };
    strategicPlan?: {
        priorities: string[];
        investments: any[];
        timeline: string;
    };
}>;
/**
 * Creates executive risk communication package
 *
 * Generates comprehensive risk communication package for executives including
 * risk summaries, mitigation strategies, and decision support materials.
 *
 * @param {TimeRange} period - Analysis period
 * @param {string[]} targetAudience - Target executive audience
 * @returns {Promise<{summary: any, detailedAnalysis: any, recommendations: any, communicationPlan: any}>} Risk communication package
 *
 * @example
 * ```typescript
 * const riskComm = await createExecutiveRiskCommunicationPackage(
 *   { start: new Date(), end: new Date() },
 *   ['ceo', 'board', 'audit_committee']
 * );
 *
 * console.log(`Risk level: ${riskComm.summary.overallRiskLevel}`);
 * console.log(`Top risks: ${riskComm.summary.topRisks.length}`);
 * ```
 */
export declare function createExecutiveRiskCommunicationPackage(period: TimeRange, targetAudience: string[]): Promise<{
    summary: {
        overallRiskLevel: string;
        topRisks: any[];
        riskTrend: string;
    };
    detailedAnalysis: RiskPostureReport;
    recommendations: Array<{
        risk: string;
        mitigation: string;
        timeline: string;
        cost: number;
    }>;
    communicationPlan: {
        targetAudience: string[];
        keyMessages: string[];
        deliveryMethod: string;
        timing: string;
    };
}>;
/**
 * Generates executive compliance attestation report
 *
 * Creates formal compliance attestation report for executive sign-off with
 * detailed compliance status, control testing, and audit evidence.
 *
 * @param {Array<'hipaa' | 'pci_dss' | 'sox' | 'gdpr' | 'nist' | 'iso27001'>} frameworks - Compliance frameworks
 * @param {TimeRange} period - Attestation period
 * @returns {Promise<{attestation: any, controlTesting: any, auditEvidence: any[], signatureRequired: boolean}>} Attestation report
 *
 * @example
 * ```typescript
 * const attestation = await generateExecutiveComplianceAttestation(
 *   ['hipaa', 'nist'],
 *   { start: new Date('2025-01-01'), end: new Date('2025-11-01') }
 * );
 *
 * console.log(`Overall compliance: ${attestation.attestation.overallStatus}`);
 * console.log(`Signature required: ${attestation.signatureRequired}`);
 * ```
 */
export declare function generateExecutiveComplianceAttestation(frameworks: Array<'hipaa' | 'pci_dss' | 'sox' | 'gdpr' | 'nist' | 'iso27001'>, period: TimeRange): Promise<{
    attestation: {
        frameworks: string[];
        overallStatus: string;
        complianceScore: number;
        attestationDate: Date;
        attestedBy?: string;
    };
    controlTesting: Array<{
        framework: string;
        controlsTested: number;
        controlsPassed: number;
        effectiveness: number;
    }>;
    auditEvidence: Array<{
        framework: string;
        evidenceType: string;
        location: string;
    }>;
    signatureRequired: boolean;
}>;
/**
 * Creates executive security scorecard
 *
 * Generates comprehensive executive security scorecard with multiple dimensions
 * of security performance in a single, easy-to-digest format.
 *
 * @param {TimeRange} period - Scorecard period
 * @param {Object} options - Scorecard options
 * @returns {Promise<{scorecard: any, visualizations: any[], narrative: string}>} Executive scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await createExecutiveSecurityScorecard(
 *   { start: new Date('2025-10-01'), end: new Date('2025-11-01') },
 *   {
 *     includeVisualizations: true,
 *     includeNarrative: true
 *   }
 * );
 *
 * console.log(`Overall score: ${scorecard.scorecard.overallScore}/100`);
 * console.log(scorecard.narrative);
 * ```
 */
export declare function createExecutiveSecurityScorecard(period: TimeRange, options?: {
    includeVisualizations?: boolean;
    includeNarrative?: boolean;
}): Promise<{
    scorecard: {
        overallScore: number;
        dimensions: Array<{
            name: string;
            score: number;
            weight: number;
            status: string;
        }>;
        rating: 'excellent' | 'good' | 'fair' | 'poor';
    };
    visualizations?: any[];
    narrative?: string;
}>;
/**
 * Generates executive investment justification report
 *
 * Creates detailed investment justification report for security proposals including
 * business case, ROI analysis, risk reduction, and implementation plan.
 *
 * @param {Object} investmentProposal - Investment proposal details
 * @param {TimeRange} analysisperiod - Analysis period
 * @returns {Promise<{businessCase: any, roiAnalysis: any, riskReduction: any, implementationPlan: any}>} Investment justification
 *
 * @example
 * ```typescript
 * const justification = await generateExecutiveInvestmentJustification(
 *   {
 *     name: 'Advanced EDR Solution',
 *     cost: 250000,
 *     category: 'technology',
 *     benefits: ['Improved detection', 'Faster response', 'Better visibility']
 *   },
 *   { start: new Date(), end: new Date() }
 * );
 *
 * console.log(justification.businessCase.executiveSummary);
 * console.log(`Expected ROI: ${justification.roiAnalysis.roi}%`);
 * ```
 */
export declare function generateExecutiveInvestmentJustification(investmentProposal: {
    name: string;
    cost: number;
    category: string;
    benefits: string[];
}, analysisPeriod: TimeRange): Promise<{
    businessCase: {
        executiveSummary: string;
        problemStatement: string;
        proposedSolution: string;
        expectedBenefits: string[];
    };
    roiAnalysis: {
        totalInvestment: number;
        expectedReturns: number;
        roi: number;
        paybackPeriod: number;
    };
    riskReduction: {
        currentRisk: number;
        projectedRisk: number;
        reductionPercentage: number;
        financialImpact: number;
    };
    implementationPlan: {
        phases: any[];
        timeline: string;
        resources: string[];
    };
}>;
/**
 * Creates executive security governance report
 *
 * Generates comprehensive security governance report covering policies, procedures,
 * oversight, and governance effectiveness for executive review.
 *
 * @param {TimeRange} period - Reporting period
 * @param {Object} options - Report options
 * @returns {Promise<{governance: any, policies: any[], oversight: any, effectiveness: any}>} Governance report
 *
 * @example
 * ```typescript
 * const governance = await createExecutiveSecurityGovernanceReport(
 *   { start: new Date('2025-01-01'), end: new Date('2025-11-01') },
 *   {
 *     includePolicyReview: true,
 *     includeOversightMetrics: true
 *   }
 * );
 *
 * console.log(`Governance effectiveness: ${governance.effectiveness.score}/100`);
 * console.log(`Policies reviewed: ${governance.policies.length}`);
 * ```
 */
export declare function createExecutiveSecurityGovernanceReport(period: TimeRange, options?: {
    includePolicyReview?: boolean;
    includeOversightMetrics?: boolean;
}): Promise<{
    governance: {
        framework: string;
        maturityLevel: string;
        score: number;
    };
    policies: Array<{
        policy: string;
        status: 'current' | 'review_required' | 'outdated';
        lastReview: Date;
        nextReview: Date;
    }>;
    oversight: {
        boardMeetings: number;
        securityReviews: number;
        auditFindings: number;
        remediationRate: number;
    };
    effectiveness: {
        score: number;
        strengths: string[];
        improvements: string[];
    };
}>;
/**
 * @swagger
 * /api/executive/dashboard/comprehensive:
 *   post:
 *     summary: Create comprehensive C-level executive security dashboard
 *     tags: [Executive Dashboard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ownerId
 *               - config
 *             properties:
 *               ownerId:
 *                 type: string
 *                 description: Executive user ID
 *               config:
 *                 $ref: '#/components/schemas/ExecutiveDashboardConfig'
 *     responses:
 *       200:
 *         description: Dashboard created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dashboard:
 *                   $ref: '#/components/schemas/SecurityDashboard'
 *                 summary:
 *                   $ref: '#/components/schemas/ExecutiveThreatSummary'
 *                 kpis:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SecurityKPI'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/executive/metrics/realtime/{dashboardId}:
 *   get:
 *     summary: Get real-time executive metrics
 *     tags: [Executive Metrics]
 *     parameters:
 *       - in: path
 *         name: dashboardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Real-time metrics retrieved
 */
/**
 * @swagger
 * /api/executive/reports/strategic:
 *   post:
 *     summary: Generate strategic security intelligence report
 *     tags: [Executive Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               period:
 *                 $ref: '#/components/schemas/TimeRange'
 *               executiveLevel:
 *                 type: string
 *                 enum: [ceo, ciso, cto, board, executive_team]
 *     responses:
 *       200:
 *         description: Strategic report generated
 */
declare const _default: {
    createComprehensiveExecutiveDashboard: typeof createComprehensiveExecutiveDashboard;
    getRealtimeExecutiveMetrics: typeof getRealtimeExecutiveMetrics;
    updateExecutiveDashboardData: typeof updateExecutiveDashboardData;
    generateStrategicSecurityReport: typeof generateStrategicSecurityReport;
    createBoardPresentationFromDashboard: typeof createBoardPresentationFromDashboard;
    compareExecutiveKPIPerformance: typeof compareExecutiveKPIPerformance;
    exportExecutiveDashboardToMultipleFormats: typeof exportExecutiveDashboardToMultipleFormats;
    scheduleExecutiveDashboardDistribution: typeof scheduleExecutiveDashboardDistribution;
    enableRealtimeDashboardMonitoring: typeof enableRealtimeDashboardMonitoring;
    calculateExecutiveKPIScorecard: typeof calculateExecutiveKPIScorecard;
    trackExecutiveKPITrends: typeof trackExecutiveKPITrends;
    generateKPIPerformanceAlerts: typeof generateKPIPerformanceAlerts;
    calculateExecutiveKPIAchievementRate: typeof calculateExecutiveKPIAchievementRate;
    generateExecutiveKPIBenchmarkComparison: typeof generateExecutiveKPIBenchmarkComparison;
    createExecutiveKPIImprovementRoadmap: typeof createExecutiveKPIImprovementRoadmap;
    generateExecutiveKPIVisualizationData: typeof generateExecutiveKPIVisualizationData;
    exportExecutiveKPIReport: typeof exportExecutiveKPIReport;
    synchronizeExecutiveKPIsAcrossDashboards: typeof synchronizeExecutiveKPIsAcrossDashboards;
    generateStrategicThreatLandscapeVisualization: typeof generateStrategicThreatLandscapeVisualization;
    createExecutiveRiskHeatmap: typeof createExecutiveRiskHeatmap;
    generateExecutiveComplianceVisualization: typeof generateExecutiveComplianceVisualization;
    createExecutiveROIDashboardVisualization: typeof createExecutiveROIDashboardVisualization;
    generateExecutiveSecurityPostureVisualization: typeof generateExecutiveSecurityPostureVisualization;
    createExecutiveIncidentMetricsDashboard: typeof createExecutiveIncidentMetricsDashboard;
    generateExecutiveThreatIntelligenceSummary: typeof generateExecutiveThreatIntelligenceSummary;
    createExecutiveBudgetAllocationVisualization: typeof createExecutiveBudgetAllocationVisualization;
    generateExecutiveDecisionSupportAnalytics: typeof generateExecutiveDecisionSupportAnalytics;
    createBoardReadySecurityPresentation: typeof createBoardReadySecurityPresentation;
    generateCLevelSecurityBriefing: typeof generateCLevelSecurityBriefing;
    createQuarterlyExecutiveSecurityReview: typeof createQuarterlyExecutiveSecurityReview;
    generateAnnualExecutiveSecurityReport: typeof generateAnnualExecutiveSecurityReport;
    createExecutiveRiskCommunicationPackage: typeof createExecutiveRiskCommunicationPackage;
    generateExecutiveComplianceAttestation: typeof generateExecutiveComplianceAttestation;
    createExecutiveSecurityScorecard: typeof createExecutiveSecurityScorecard;
    generateExecutiveInvestmentJustification: typeof generateExecutiveInvestmentJustification;
    createExecutiveSecurityGovernanceReport: typeof createExecutiveSecurityGovernanceReport;
};
export default _default;
//# sourceMappingURL=executive-threat-dashboard-composite.d.ts.map