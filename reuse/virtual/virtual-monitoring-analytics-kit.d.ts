/**
 * LOC: VRT-MONITOR-001
 * File: /reuse/virtual/virtual-monitoring-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - @nestjs/schedule
 *   - prometheus-client
 *   - grafana-api-client
 *   - winston
 *   - elasticsearch
 *
 * DOWNSTREAM (imported by):
 *   - Virtual infrastructure monitoring modules
 *   - Performance analytics services
 *   - Alert management systems
 *   - SLA tracking modules
 *   - Capacity forecasting services
 */
interface MetricDefinition {
    name: string;
    type: 'counter' | 'gauge' | 'histogram' | 'summary';
    description: string;
    labels?: string[];
    unit?: string;
    namespace?: string;
}
interface MetricValue {
    name: string;
    value: number;
    labels?: Record<string, string>;
    timestamp: Date;
}
interface TimeSeriesMetric {
    metricName: string;
    dataPoints: MetricDataPoint[];
    aggregation?: 'avg' | 'sum' | 'min' | 'max' | 'p95' | 'p99';
    interval?: number;
}
interface MetricDataPoint {
    timestamp: Date;
    value: number;
    labels?: Record<string, string>;
}
interface AlertDefinition {
    id: string;
    name: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    condition: AlertCondition;
    notification: NotificationConfig;
    enabled: boolean;
    cooldownMinutes?: number;
    escalationPolicy?: EscalationPolicy;
}
interface AlertCondition {
    metric: string;
    operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
    threshold: number;
    duration?: number;
    aggregation?: 'avg' | 'sum' | 'min' | 'max';
}
interface NotificationConfig {
    channels: NotificationChannel[];
    template?: string;
    includeMetrics?: boolean;
    includeRunbook?: boolean;
}
interface NotificationChannel {
    type: 'email' | 'slack' | 'pagerduty' | 'webhook' | 'sms';
    target: string;
    priority?: 'high' | 'normal' | 'low';
}
interface EscalationPolicy {
    steps: EscalationStep[];
    autoResolve?: boolean;
    maxEscalations?: number;
}
interface EscalationStep {
    delayMinutes: number;
    channels: NotificationChannel[];
    condition?: 'unacknowledged' | 'unresolved';
}
interface Alert {
    id: string;
    definitionId: string;
    name: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    status: 'firing' | 'acknowledged' | 'resolved';
    triggeredAt: Date;
    acknowledgedAt?: Date;
    resolvedAt?: Date;
    acknowledgedBy?: string;
    message: string;
    metrics?: MetricValue[];
    annotations?: Record<string, string>;
}
interface DashboardDefinition {
    id: string;
    name: string;
    description?: string;
    tags?: string[];
    panels: DashboardPanel[];
    variables?: DashboardVariable[];
    refreshInterval?: number;
    timeRange?: TimeRange;
}
interface DashboardPanel {
    id: string;
    title: string;
    type: 'graph' | 'gauge' | 'stat' | 'table' | 'heatmap' | 'logs';
    gridPos: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    queries: MetricQuery[];
    options?: Record<string, any>;
    thresholds?: Threshold[];
}
interface MetricQuery {
    expr: string;
    legend?: string;
    format?: 'time_series' | 'table' | 'heatmap';
    refId?: string;
}
interface Threshold {
    value: number;
    color: string;
    mode?: 'absolute' | 'percentage';
}
interface DashboardVariable {
    name: string;
    type: 'query' | 'custom' | 'constant' | 'interval';
    query?: string;
    options?: string[];
    defaultValue?: string;
}
interface TimeRange {
    from: string;
    to: string;
}
interface LogEntry {
    timestamp: Date;
    level: 'error' | 'warn' | 'info' | 'debug' | 'trace';
    message: string;
    source: string;
    traceId?: string;
    spanId?: string;
    userId?: string;
    metadata?: Record<string, any>;
    stackTrace?: string;
}
interface LogQuery {
    index?: string;
    query: string;
    filters?: LogFilter[];
    timeRange: TimeRange;
    size?: number;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    }[];
}
interface LogFilter {
    field: string;
    operator: 'equals' | 'contains' | 'regex' | 'range';
    value: any;
}
interface LogAggregation {
    field: string;
    type: 'terms' | 'date_histogram' | 'stats' | 'cardinality';
    size?: number;
    interval?: string;
}
interface PerformanceAnalysis {
    resourceId: string;
    resourceType: 'vm' | 'host' | 'datastore' | 'cluster' | 'network';
    metrics: AnalysisMetric[];
    trends: Trend[];
    anomalies: Anomaly[];
    recommendations: Recommendation[];
    period: TimeRange;
}
interface AnalysisMetric {
    name: string;
    current: number;
    average: number;
    min: number;
    max: number;
    percentile95: number;
    percentile99: number;
    trend: 'increasing' | 'decreasing' | 'stable';
}
interface Trend {
    metric: string;
    direction: 'up' | 'down' | 'stable';
    slope: number;
    confidence: number;
    forecast?: number[];
}
interface Anomaly {
    timestamp: Date;
    metric: string;
    value: number;
    expectedValue: number;
    deviation: number;
    severity: 'critical' | 'warning' | 'info';
    confidence: number;
    context?: string;
}
interface Recommendation {
    type: 'optimization' | 'capacity' | 'performance' | 'cost' | 'security';
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
    potentialSavings?: number;
    actionItems: string[];
}
interface CapacityForecast {
    resourceType: 'cpu' | 'memory' | 'storage' | 'network';
    currentUsage: number;
    currentCapacity: number;
    utilizationPercent: number;
    forecastedUsage: ForecastPoint[];
    estimatedFullDate?: Date;
    daysUntilFull?: number;
    recommendations: string[];
    confidence: number;
}
interface ForecastPoint {
    timestamp: Date;
    predicted: number;
    lower: number;
    upper: number;
    confidence: number;
}
interface SLADefinition {
    id: string;
    name: string;
    description: string;
    targets: SLATarget[];
    measurementWindow: number;
    reportingPeriod: 'hourly' | 'daily' | 'weekly' | 'monthly';
    enabled: boolean;
}
interface SLATarget {
    metric: string;
    threshold: number;
    operator: '>=' | '<=' | '>' | '<';
    percentage: number;
    description?: string;
}
interface SLAReport {
    slaId: string;
    name: string;
    period: TimeRange;
    status: 'compliant' | 'warning' | 'breach';
    compliance: SLACompliance[];
    incidents: SLAIncident[];
    overallPercentage: number;
    errorBudget?: number;
}
interface SLACompliance {
    target: SLATarget;
    actualPercentage: number;
    complianceStatus: 'met' | 'warning' | 'breached';
    breachDuration?: number;
    measurements: number;
}
interface SLAIncident {
    timestamp: Date;
    duration: number;
    metric: string;
    targetValue: number;
    actualValue: number;
    impact: string;
}
interface MetricsPipeline {
    id: string;
    name: string;
    source: MetricsSource;
    processors: MetricsProcessor[];
    destination: MetricsDestination;
    enabled: boolean;
    batchSize?: number;
    flushInterval?: number;
}
interface MetricsSource {
    type: 'prometheus' | 'vmware' | 'custom' | 'webhook';
    config: Record<string, any>;
    filters?: string[];
}
interface MetricsProcessor {
    type: 'filter' | 'transform' | 'aggregate' | 'enrich';
    config: Record<string, any>;
}
interface MetricsDestination {
    type: 'prometheus' | 'elasticsearch' | 'influxdb' | 'grafana';
    config: Record<string, any>;
}
interface HealthCheck {
    component: string;
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: HealthCheckResult[];
    lastChecked: Date;
    uptime?: number;
}
interface HealthCheckResult {
    name: string;
    status: 'pass' | 'warn' | 'fail';
    message?: string;
    duration?: number;
    metadata?: Record<string, any>;
}
/**
 * Registers a custom metric with Prometheus
 * @param definition - Metric definition
 * @returns Metric registration result
 *
 * @example
 * ```typescript
 * const metric = await registerPrometheusMetric({
 *   name: 'vm_cpu_usage',
 *   type: 'gauge',
 *   description: 'VM CPU usage percentage',
 *   labels: ['vm_id', 'cluster'],
 *   unit: 'percent',
 *   namespace: 'whitecross'
 * });
 * ```
 */
export declare function registerPrometheusMetric(definition: MetricDefinition): Promise<{
    success: boolean;
    metricName: string;
}>;
/**
 * Records a metric value to Prometheus
 * @param metric - Metric value to record
 * @returns Recording result
 *
 * @example
 * ```typescript
 * await recordMetricValue({
 *   name: 'whitecross_vm_cpu_usage',
 *   value: 78.5,
 *   labels: { vm_id: 'vm-123', cluster: 'prod' },
 *   timestamp: new Date()
 * });
 * ```
 */
export declare function recordMetricValue(metric: MetricValue): Promise<{
    success: boolean;
}>;
/**
 * Collects time series metrics from Prometheus
 * @param query - Prometheus query expression
 * @param timeRange - Time range for query
 * @returns Time series data
 *
 * @example
 * ```typescript
 * const metrics = await collectTimeSeriesMetrics(
 *   'rate(vm_cpu_usage[5m])',
 *   { from: 'now-1h', to: 'now' }
 * );
 * ```
 */
export declare function collectTimeSeriesMetrics(query: string, timeRange: TimeRange): Promise<TimeSeriesMetric[]>;
/**
 * Aggregates metrics across multiple dimensions
 * @param metricName - Name of metric to aggregate
 * @param aggregation - Aggregation function
 * @param groupBy - Labels to group by
 * @param timeRange - Time range
 * @returns Aggregated metrics
 *
 * @example
 * ```typescript
 * const aggregated = await aggregateMetrics(
 *   'vm_cpu_usage',
 *   'avg',
 *   ['cluster', 'datacenter'],
 *   { from: 'now-24h', to: 'now' }
 * );
 * ```
 */
export declare function aggregateMetrics(metricName: string, aggregation: 'avg' | 'sum' | 'min' | 'max' | 'p95' | 'p99', groupBy: string[], timeRange: TimeRange): Promise<Record<string, number>>;
/**
 * Exports metrics to external monitoring system
 * @param metrics - Metrics to export
 * @param destination - Destination configuration
 * @returns Export result
 *
 * @example
 * ```typescript
 * await exportMetrics(
 *   metricsArray,
 *   { type: 'influxdb', config: { url: 'http://influx:8086', database: 'monitoring' } }
 * );
 * ```
 */
export declare function exportMetrics(metrics: MetricValue[], destination: MetricsDestination): Promise<{
    success: boolean;
    exported: number;
}>;
/**
 * Creates an alert definition
 * @param alert - Alert definition
 * @returns Created alert
 *
 * @example
 * ```typescript
 * const alert = await createAlertDefinition({
 *   id: 'high-cpu-alert',
 *   name: 'High CPU Usage',
 *   description: 'Alert when CPU exceeds 90%',
 *   severity: 'critical',
 *   condition: {
 *     metric: 'vm_cpu_usage',
 *     operator: '>',
 *     threshold: 90,
 *     duration: 300
 *   },
 *   notification: {
 *     channels: [{ type: 'email', target: 'ops@whitecross.com' }]
 *   },
 *   enabled: true
 * });
 * ```
 */
export declare function createAlertDefinition(alert: AlertDefinition): Promise<AlertDefinition>;
/**
 * Evaluates alert conditions against current metrics
 * @param alertId - Alert definition ID
 * @param metrics - Current metrics
 * @returns Evaluation result with triggered alerts
 *
 * @example
 * ```typescript
 * const result = await evaluateAlertCondition('high-cpu-alert', currentMetrics);
 * if (result.triggered) {
 *   console.log('Alert triggered!', result.alert);
 * }
 * ```
 */
export declare function evaluateAlertCondition(alertId: string, metrics: MetricValue[]): Promise<{
    triggered: boolean;
    alert?: Alert;
}>;
/**
 * Sends alert notifications through configured channels
 * @param alert - Alert to notify
 * @param channels - Notification channels
 * @returns Notification results
 *
 * @example
 * ```typescript
 * await sendAlertNotification(alert, [
 *   { type: 'slack', target: '#ops-alerts', priority: 'high' },
 *   { type: 'pagerduty', target: 'service-123' }
 * ]);
 * ```
 */
export declare function sendAlertNotification(alert: Alert, channels: NotificationChannel[]): Promise<{
    success: boolean;
    sent: number;
    failed: number;
}>;
/**
 * Acknowledges an active alert
 * @param alertId - Alert ID
 * @param userId - User acknowledging the alert
 * @param notes - Optional acknowledgment notes
 * @returns Updated alert
 *
 * @example
 * ```typescript
 * const alert = await acknowledgeAlert('alert-123', 'user-456', 'Investigating the issue');
 * ```
 */
export declare function acknowledgeAlert(alertId: string, userId: string, notes?: string): Promise<Alert>;
/**
 * Processes alert escalation based on policy
 * @param alert - Alert to escalate
 * @param policy - Escalation policy
 * @returns Escalation result
 *
 * @example
 * ```typescript
 * await escalateAlert(alert, {
 *   steps: [
 *     { delayMinutes: 15, channels: [{ type: 'email', target: 'oncall@whitecross.com' }] },
 *     { delayMinutes: 30, channels: [{ type: 'pagerduty', target: 'managers' }] }
 *   ],
 *   maxEscalations: 3
 * });
 * ```
 */
export declare function escalateAlert(alert: Alert, policy: EscalationPolicy): Promise<{
    escalated: boolean;
    step: number;
}>;
/**
 * Auto-resolves alerts based on metric recovery
 * @param alertId - Alert ID
 * @param currentMetrics - Current metric values
 * @returns Resolution result
 *
 * @example
 * ```typescript
 * const resolved = await autoResolveAlert('alert-123', currentMetrics);
 * if (resolved.resolved) {
 *   console.log('Alert auto-resolved');
 * }
 * ```
 */
export declare function autoResolveAlert(alertId: string, currentMetrics: MetricValue[]): Promise<{
    resolved: boolean;
    alert?: Alert;
}>;
/**
 * Creates a Grafana dashboard
 * @param dashboard - Dashboard definition
 * @returns Created dashboard with ID
 *
 * @example
 * ```typescript
 * const dashboard = await createGrafanaDashboard({
 *   id: 'vm-performance',
 *   name: 'VM Performance Overview',
 *   tags: ['virtualization', 'performance'],
 *   panels: [
 *     {
 *       id: 'cpu-usage',
 *       title: 'CPU Usage',
 *       type: 'graph',
 *       gridPos: { x: 0, y: 0, w: 12, h: 8 },
 *       queries: [{ expr: 'avg(vm_cpu_usage) by (cluster)' }]
 *     }
 *   ],
 *   refreshInterval: 30
 * });
 * ```
 */
export declare function createGrafanaDashboard(dashboard: DashboardDefinition): Promise<{
    id: string;
    url: string;
}>;
/**
 * Updates dashboard panel configuration
 * @param dashboardId - Dashboard ID
 * @param panelId - Panel ID
 * @param updates - Panel updates
 * @returns Updated panel
 *
 * @example
 * ```typescript
 * await updateDashboardPanel('vm-performance', 'cpu-usage', {
 *   thresholds: [
 *     { value: 80, color: 'yellow' },
 *     { value: 90, color: 'red' }
 *   ]
 * });
 * ```
 */
export declare function updateDashboardPanel(dashboardId: string, panelId: string, updates: Partial<DashboardPanel>): Promise<DashboardPanel>;
/**
 * Generates dashboard from template
 * @param templateId - Template identifier
 * @param variables - Template variables
 * @returns Generated dashboard
 *
 * @example
 * ```typescript
 * const dashboard = await generateDashboardFromTemplate('vm-standard', {
 *   cluster: 'production',
 *   environment: 'prod',
 *   refresh: '30s'
 * });
 * ```
 */
export declare function generateDashboardFromTemplate(templateId: string, variables: Record<string, string>): Promise<DashboardDefinition>;
/**
 * Exports dashboard configuration
 * @param dashboardId - Dashboard ID
 * @param format - Export format
 * @returns Dashboard configuration
 *
 * @example
 * ```typescript
 * const config = await exportDashboard('vm-performance', 'json');
 * fs.writeFileSync('dashboard-backup.json', JSON.stringify(config, null, 2));
 * ```
 */
export declare function exportDashboard(dashboardId: string, format: 'json' | 'yaml'): Promise<string>;
/**
 * Creates dashboard snapshot for sharing
 * @param dashboardId - Dashboard ID
 * @param expiryDays - Days until snapshot expires
 * @returns Snapshot URL
 *
 * @example
 * ```typescript
 * const snapshotUrl = await createDashboardSnapshot('vm-performance', 7);
 * console.log('Share this URL:', snapshotUrl);
 * ```
 */
export declare function createDashboardSnapshot(dashboardId: string, expiryDays?: number): Promise<string>;
/**
 * Indexes log entry to Elasticsearch
 * @param log - Log entry to index
 * @param index - Target index name
 * @returns Indexing result
 *
 * @example
 * ```typescript
 * await indexLogEntry({
 *   timestamp: new Date(),
 *   level: 'error',
 *   message: 'Database connection failed',
 *   source: 'api-server',
 *   traceId: 'trace-123',
 *   metadata: { database: 'postgres', host: 'db-01' }
 * }, 'logs-2025.01');
 * ```
 */
export declare function indexLogEntry(log: LogEntry, index: string): Promise<{
    indexed: boolean;
    id: string;
}>;
/**
 * Queries logs from Elasticsearch
 * @param query - Log query parameters
 * @returns Matching log entries
 *
 * @example
 * ```typescript
 * const logs = await queryLogs({
 *   query: 'level:error AND source:api-server',
 *   filters: [{ field: 'traceId', operator: 'equals', value: 'trace-123' }],
 *   timeRange: { from: 'now-1h', to: 'now' },
 *   size: 100,
 *   sort: [{ field: 'timestamp', order: 'desc' }]
 * });
 * ```
 */
export declare function queryLogs(query: LogQuery): Promise<{
    logs: LogEntry[];
    total: number;
}>;
/**
 * Aggregates logs for analytics
 * @param query - Base query
 * @param aggregations - Aggregation specifications
 * @returns Aggregation results
 *
 * @example
 * ```typescript
 * const results = await aggregateLogs(
 *   { query: '*', timeRange: { from: 'now-24h', to: 'now' } },
 *   [
 *     { field: 'level', type: 'terms', size: 10 },
 *     { field: 'timestamp', type: 'date_histogram', interval: '1h' }
 *   ]
 * );
 * ```
 */
export declare function aggregateLogs(query: LogQuery, aggregations: LogAggregation[]): Promise<Record<string, any>>;
/**
 * Streams logs in real-time
 * @param filters - Log filters
 * @param callback - Callback for each log entry
 * @returns Stream control handle
 *
 * @example
 * ```typescript
 * const stream = await streamLogs(
 *   [{ field: 'level', operator: 'equals', value: 'error' }],
 *   (log) => console.log('New error:', log.message)
 * );
 *
 * // Later: stream.stop();
 * ```
 */
export declare function streamLogs(filters: LogFilter[], callback: (log: LogEntry) => void): Promise<{
    stop: () => void;
}>;
/**
 * Analyzes log patterns for anomalies
 * @param timeRange - Time range to analyze
 * @param threshold - Anomaly detection threshold
 * @returns Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await analyzeLogPatterns(
 *   { from: 'now-24h', to: 'now' },
 *   0.8
 * );
 *
 * for (const anomaly of anomalies) {
 *   console.log(`Anomaly detected: ${anomaly.pattern}`);
 * }
 * ```
 */
export declare function analyzeLogPatterns(timeRange: TimeRange, threshold: number): Promise<Array<{
    pattern: string;
    count: number;
    deviation: number;
}>>;
/**
 * Analyzes resource performance trends
 * @param resourceId - Resource identifier
 * @param resourceType - Type of resource
 * @param period - Analysis period
 * @returns Performance analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzePerformance('vm-123', 'vm', {
 *   from: 'now-7d',
 *   to: 'now'
 * });
 *
 * console.log('CPU trend:', analysis.metrics.find(m => m.name === 'cpu').trend);
 * console.log('Recommendations:', analysis.recommendations);
 * ```
 */
export declare function analyzePerformance(resourceId: string, resourceType: 'vm' | 'host' | 'datastore' | 'cluster' | 'network', period: TimeRange): Promise<PerformanceAnalysis>;
/**
 * Detects performance anomalies using ML
 * @param metricName - Metric to analyze
 * @param dataPoints - Historical data points
 * @param sensitivity - Detection sensitivity (0-1)
 * @returns Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectAnomalies('cpu_usage', historicalData, 0.85);
 *
 * for (const anomaly of anomalies) {
 *   if (anomaly.severity === 'critical') {
 *     console.log('Critical anomaly:', anomaly);
 *   }
 * }
 * ```
 */
export declare function detectAnomalies(metricName: string, dataPoints: MetricDataPoint[], sensitivity: number): Promise<Anomaly[]>;
/**
 * Generates performance optimization recommendations
 * @param analysis - Performance analysis data
 * @returns Optimization recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await generateOptimizationRecommendations(performanceAnalysis);
 *
 * recommendations.forEach(rec => {
 *   console.log(`[${rec.priority}] ${rec.title}`);
 *   console.log(`Impact: ${rec.impact}`);
 *   console.log(`Actions: ${rec.actionItems.join(', ')}`);
 * });
 * ```
 */
export declare function generateOptimizationRecommendations(analysis: PerformanceAnalysis): Promise<Recommendation[]>;
/**
 * Correlates metrics across resources
 * @param resourceIds - Resources to correlate
 * @param metricNames - Metrics to correlate
 * @param timeRange - Time range
 * @returns Correlation analysis
 *
 * @example
 * ```typescript
 * const correlation = await correlateMetrics(
 *   ['vm-001', 'vm-002', 'vm-003'],
 *   ['cpu_usage', 'memory_usage', 'disk_io'],
 *   { from: 'now-24h', to: 'now' }
 * );
 *
 * console.log('Correlation between CPU and Memory:', correlation.coefficients['cpu_memory']);
 * ```
 */
export declare function correlateMetrics(resourceIds: string[], metricNames: string[], timeRange: TimeRange): Promise<{
    coefficients: Record<string, number>;
    insights: string[];
}>;
/**
 * Performs baseline analysis for metrics
 * @param metricName - Metric to baseline
 * @param duration - Baseline duration
 * @returns Baseline statistics
 *
 * @example
 * ```typescript
 * const baseline = await performBaselineAnalysis('cpu_usage', 30);
 *
 * console.log(`Normal range: ${baseline.mean} ± ${baseline.stdDev}`);
 * console.log(`Typical peak: ${baseline.percentile95}`);
 * ```
 */
export declare function performBaselineAnalysis(metricName: string, duration: number): Promise<{
    mean: number;
    median: number;
    stdDev: number;
    percentile95: number;
    percentile99: number;
    min: number;
    max: number;
}>;
/**
 * Forecasts capacity requirements
 * @param resourceType - Type of resource
 * @param historicalData - Historical usage data
 * @param forecastDays - Days to forecast
 * @returns Capacity forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCapacity('cpu', historicalData, 90);
 *
 * if (forecast.daysUntilFull && forecast.daysUntilFull < 30) {
 *   console.log('WARNING: Capacity will be exhausted in', forecast.daysUntilFull, 'days');
 *   console.log('Recommendations:', forecast.recommendations);
 * }
 * ```
 */
export declare function forecastCapacity(resourceType: 'cpu' | 'memory' | 'storage' | 'network', historicalData: MetricDataPoint[], forecastDays: number): Promise<CapacityForecast>;
/**
 * Analyzes capacity trends
 * @param resourceType - Type of resource
 * @param timeRange - Time range to analyze
 * @returns Trend analysis
 *
 * @example
 * ```typescript
 * const trend = await analyzeCapacityTrends('storage', { from: 'now-90d', to: 'now' });
 *
 * console.log('Growth rate:', trend.growthRate, '% per day');
 * console.log('Seasonal patterns:', trend.seasonalPatterns);
 * ```
 */
export declare function analyzeCapacityTrends(resourceType: 'cpu' | 'memory' | 'storage' | 'network', timeRange: TimeRange): Promise<{
    growthRate: number;
    trend: 'linear' | 'exponential' | 'logarithmic';
    seasonalPatterns: boolean;
    cycleLength?: number;
    confidence: number;
}>;
/**
 * Generates capacity planning report
 * @param timeRange - Analysis period
 * @param includeForecasts - Include future forecasts
 * @returns Capacity report
 *
 * @example
 * ```typescript
 * const report = await generateCapacityReport(
 *   { from: 'now-90d', to: 'now' },
 *   true
 * );
 *
 * report.resources.forEach(resource => {
 *   console.log(`${resource.type}: ${resource.utilizationPercent}% used`);
 * });
 * ```
 */
export declare function generateCapacityReport(timeRange: TimeRange, includeForecasts: boolean): Promise<{
    resources: Array<{
        type: string;
        currentUsage: number;
        capacity: number;
        utilizationPercent: number;
        forecast?: CapacityForecast;
    }>;
    summary: string;
    recommendations: string[];
}>;
/**
 * Calculates resource rightsizing recommendations
 * @param resourceId - Resource to analyze
 * @param utilizationData - Historical utilization
 * @returns Rightsizing recommendations
 *
 * @example
 * ```typescript
 * const sizing = await calculateRightsizing('vm-123', utilizationHistory);
 *
 * if (sizing.action === 'downsize') {
 *   console.log('Can reduce resources by', sizing.potentialSavings, '%');
 *   console.log('Recommended config:', sizing.recommendedConfig);
 * }
 * ```
 */
export declare function calculateRightsizing(resourceId: string, utilizationData: MetricDataPoint[]): Promise<{
    action: 'downsize' | 'upsize' | 'maintain';
    currentConfig: Record<string, number>;
    recommendedConfig: Record<string, number>;
    potentialSavings: number;
    confidence: number;
    reasoning: string;
}>;
/**
 * Creates SLA definition
 * @param sla - SLA definition
 * @returns Created SLA
 *
 * @example
 * ```typescript
 * const sla = await createSLADefinition({
 *   id: 'api-availability',
 *   name: 'API Availability SLA',
 *   description: '99.9% uptime target',
 *   targets: [
 *     {
 *       metric: 'uptime_percent',
 *       threshold: 99.9,
 *       operator: '>=',
 *       percentage: 99.9,
 *       description: 'Service must be available 99.9% of time'
 *     }
 *   ],
 *   measurementWindow: 2592000,
 *   reportingPeriod: 'monthly',
 *   enabled: true
 * });
 * ```
 */
export declare function createSLADefinition(sla: SLADefinition): Promise<SLADefinition>;
/**
 * Evaluates SLA compliance
 * @param slaId - SLA definition ID
 * @param period - Evaluation period
 * @returns SLA compliance report
 *
 * @example
 * ```typescript
 * const report = await evaluateSLACompliance(
 *   'api-availability',
 *   { from: 'now-30d', to: 'now' }
 * );
 *
 * if (report.status === 'breach') {
 *   console.log('SLA BREACH:', report.name);
 *   console.log('Incidents:', report.incidents);
 * }
 * ```
 */
export declare function evaluateSLACompliance(slaId: string, period: TimeRange): Promise<SLAReport>;
/**
 * Tracks SLA error budget
 * @param slaId - SLA definition ID
 * @param period - Tracking period
 * @returns Error budget status
 *
 * @example
 * ```typescript
 * const budget = await trackErrorBudget('api-availability', { from: 'now-30d', to: 'now' });
 *
 * console.log(`Error budget remaining: ${budget.remainingPercent}%`);
 * console.log(`Budget consumed: ${budget.consumedMinutes} minutes`);
 *
 * if (budget.remainingPercent < 10) {
 *   console.log('WARNING: Error budget critically low!');
 * }
 * ```
 */
export declare function trackErrorBudget(slaId: string, period: TimeRange): Promise<{
    totalBudgetMinutes: number;
    consumedMinutes: number;
    remainingMinutes: number;
    remainingPercent: number;
    projectedBurnRate: number;
    status: 'healthy' | 'warning' | 'critical';
}>;
/**
 * Generates SLA compliance report
 * @param slaIds - SLA definition IDs
 * @param period - Reporting period
 * @param format - Report format
 * @returns Formatted report
 *
 * @example
 * ```typescript
 * const report = await generateSLAReport(
 *   ['api-availability', 'database-performance'],
 *   { from: 'now-30d', to: 'now' },
 *   'pdf'
 * );
 *
 * fs.writeFileSync('sla-report.pdf', report);
 * ```
 */
export declare function generateSLAReport(slaIds: string[], period: TimeRange, format: 'json' | 'pdf' | 'html'): Promise<string>;
/**
 * Notifies stakeholders of SLA breaches
 * @param report - SLA report with breaches
 * @param recipients - Notification recipients
 * @returns Notification result
 *
 * @example
 * ```typescript
 * if (slaReport.status === 'breach') {
 *   await notifySLABreach(slaReport, [
 *     { type: 'email', target: 'management@whitecross.com' },
 *     { type: 'slack', target: '#sla-alerts' }
 *   ]);
 * }
 * ```
 */
export declare function notifySLABreach(report: SLAReport, recipients: NotificationChannel[]): Promise<{
    notified: boolean;
    recipients: number;
}>;
/**
 * Creates custom metrics pipeline
 * @param pipeline - Pipeline configuration
 * @returns Created pipeline
 *
 * @example
 * ```typescript
 * const pipeline = await createMetricsPipeline({
 *   id: 'custom-vm-metrics',
 *   name: 'Custom VM Metrics Pipeline',
 *   source: {
 *     type: 'vmware',
 *     config: { vcenter: 'vcenter.whitecross.com' }
 *   },
 *   processors: [
 *     { type: 'filter', config: { include: ['cpu', 'memory'] } },
 *     { type: 'aggregate', config: { interval: 60 } }
 *   ],
 *   destination: {
 *     type: 'prometheus',
 *     config: { pushgateway: 'prometheus:9091' }
 *   },
 *   enabled: true
 * });
 * ```
 */
export declare function createMetricsPipeline(pipeline: MetricsPipeline): Promise<MetricsPipeline>;
/**
 * Executes metrics pipeline
 * @param pipelineId - Pipeline ID
 * @returns Execution result
 *
 * @example
 * ```typescript
 * const result = await executeMetricsPipeline('custom-vm-metrics');
 *
 * console.log(`Processed ${result.metricsProcessed} metrics`);
 * console.log(`Duration: ${result.durationMs}ms`);
 * ```
 */
export declare function executeMetricsPipeline(pipelineId: string): Promise<{
    success: boolean;
    metricsProcessed: number;
    metricsFiltered: number;
    durationMs: number;
    errors?: string[];
}>;
/**
 * Performs comprehensive health check
 * @param components - Components to check
 * @returns Health check results
 *
 * @example
 * ```typescript
 * const health = await performHealthCheck([
 *   'prometheus',
 *   'grafana',
 *   'elasticsearch',
 *   'alertmanager'
 * ]);
 *
 * health.forEach(component => {
 *   console.log(`${component.component}: ${component.status}`);
 *   component.checks.forEach(check => {
 *     console.log(`  - ${check.name}: ${check.status}`);
 *   });
 * });
 * ```
 */
export declare function performHealthCheck(components: string[]): Promise<HealthCheck[]>;
/**
 * Creates custom metric aggregation rule
 * @param rule - Aggregation rule configuration
 * @returns Created rule
 *
 * @example
 * ```typescript
 * const rule = await createMetricAggregationRule({
 *   name: 'cluster-average-cpu',
 *   sourceMetric: 'vm_cpu_usage',
 *   aggregation: 'avg',
 *   groupBy: ['cluster'],
 *   interval: 60
 * });
 * ```
 */
export declare function createMetricAggregationRule(rule: {
    name: string;
    sourceMetric: string;
    aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count';
    groupBy: string[];
    interval: number;
}): Promise<{
    id: string;
    rule: any;
}>;
/**
 * Configures metric retention policies
 * @param policies - Retention policies by metric type
 * @returns Configuration result
 *
 * @example
 * ```typescript
 * await configureMetricRetention({
 *   raw: 7,
 *   hourly: 30,
 *   daily: 365,
 *   monthly: 1825
 * });
 * ```
 */
export declare function configureMetricRetention(policies: Record<string, number>): Promise<{
    success: boolean;
    policies: Record<string, number>;
}>;
/**
 * Archives historical metrics to cold storage
 * @param metricNames - Metrics to archive
 * @param beforeDate - Archive metrics before this date
 * @param destination - Archive destination
 * @returns Archive result
 *
 * @example
 * ```typescript
 * const result = await archiveHistoricalMetrics(
 *   ['vm_cpu_usage', 'vm_memory_usage'],
 *   new Date('2024-01-01'),
 *   { type: 's3', bucket: 'metrics-archive' }
 * );
 * ```
 */
export declare function archiveHistoricalMetrics(metricNames: string[], beforeDate: Date, destination: {
    type: string;
    bucket?: string;
    path?: string;
}): Promise<{
    archived: number;
    size: number;
}>;
/**
 * Creates composite alert from multiple conditions
 * @param config - Composite alert configuration
 * @returns Created alert
 *
 * @example
 * ```typescript
 * const alert = await createCompositeAlert({
 *   name: 'Infrastructure Health',
 *   operator: 'AND',
 *   conditions: [
 *     { metric: 'cpu_usage', operator: '>', threshold: 80 },
 *     { metric: 'memory_usage', operator: '>', threshold: 85 },
 *     { metric: 'disk_usage', operator: '>', threshold: 90 }
 *   ],
 *   severity: 'critical'
 * });
 * ```
 */
export declare function createCompositeAlert(config: {
    name: string;
    operator: 'AND' | 'OR';
    conditions: AlertCondition[];
    severity: 'critical' | 'high' | 'medium' | 'low';
}): Promise<AlertDefinition>;
/**
 * Simulates load testing scenarios for monitoring
 * @param scenario - Load test scenario
 * @param duration - Test duration in seconds
 * @returns Test results
 *
 * @example
 * ```typescript
 * const results = await simulateLoadTest({
 *   type: 'cpu_spike',
 *   intensity: 'high',
 *   targetResources: ['vm-001', 'vm-002']
 * }, 300);
 * ```
 */
export declare function simulateLoadTest(scenario: {
    type: 'cpu_spike' | 'memory_leak' | 'disk_io' | 'network_saturation';
    intensity: 'low' | 'medium' | 'high';
    targetResources: string[];
}, duration: number): Promise<{
    metricsGenerated: number;
    alertsTriggered: number;
    peakValues: Record<string, number>;
}>;
/**
 * Validates monitoring configuration
 * @param config - Configuration to validate
 * @returns Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateMonitoringConfig({
 *   metrics: metricDefinitions,
 *   alerts: alertDefinitions,
 *   dashboards: dashboardDefinitions
 * });
 *
 * if (!validation.valid) {
 *   console.error('Configuration errors:', validation.errors);
 * }
 * ```
 */
export declare function validateMonitoringConfig(config: {
    metrics?: MetricDefinition[];
    alerts?: AlertDefinition[];
    dashboards?: DashboardDefinition[];
}): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Exports monitoring data for compliance reporting
 * @param dataTypes - Types of data to export
 * @param timeRange - Time range
 * @param format - Export format
 * @returns Exported data
 *
 * @example
 * ```typescript
 * const export = await exportMonitoringData(
 *   ['metrics', 'alerts', 'logs', 'sla-reports'],
 *   { from: 'now-90d', to: 'now' },
 *   'csv'
 * );
 * ```
 */
export declare function exportMonitoringData(dataTypes: string[], timeRange: TimeRange, format: 'json' | 'csv' | 'parquet'): Promise<{
    files: string[];
    totalSize: number;
}>;
/**
 * Calculates monitoring infrastructure costs
 * @param period - Calculation period
 * @returns Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = await calculateMonitoringCosts({ from: 'now-30d', to: 'now' });
 *
 * console.log(`Total cost: $${costs.total}`);
 * console.log(`Breakdown:`, costs.breakdown);
 * ```
 */
export declare function calculateMonitoringCosts(period: TimeRange): Promise<{
    total: number;
    breakdown: Record<string, number>;
    projectedMonthly: number;
    recommendations: string[];
}>;
export {};
/**
 * NestJS service class example for monitoring integration
 *
 * @example
 * ```typescript
 * import { Injectable, OnModuleInit } from '@nestjs/common';
 * import { Cron, CronExpression } from '@nestjs/schedule';
 * import * as MonitoringKit from './reuse/virtual/virtual-monitoring-analytics-kit';
 *
 * @Injectable()
 * export class MonitoringService implements OnModuleInit {
 *   async onModuleInit() {
 *     // Register custom metrics
 *     await MonitoringKit.registerPrometheusMetric({
 *       name: 'vm_provisioning_duration',
 *       type: 'histogram',
 *       description: 'VM provisioning duration in seconds',
 *       labels: ['cluster', 'template']
 *     });
 *
 *     // Create alert definitions
 *     await MonitoringKit.createAlertDefinition({
 *       id: 'critical-cpu',
 *       name: 'Critical CPU Usage',
 *       severity: 'critical',
 *       condition: {
 *         metric: 'vm_cpu_usage',
 *         operator: '>',
 *         threshold: 95,
 *         duration: 600
 *       },
 *       notification: {
 *         channels: [
 *           { type: 'pagerduty', target: 'oncall-team' },
 *           { type: 'slack', target: '#critical-alerts' }
 *         ]
 *       },
 *       enabled: true,
 *       escalationPolicy: {
 *         steps: [
 *           { delayMinutes: 15, channels: [{ type: 'email', target: 'managers@whitecross.com' }] }
 *         ]
 *       }
 *     });
 *
 *     // Create monitoring dashboard
 *     await MonitoringKit.createGrafanaDashboard({
 *       id: 'infrastructure-overview',
 *       name: 'Infrastructure Overview',
 *       tags: ['infrastructure', 'virtualization'],
 *       panels: [
 *         {
 *           id: 'cluster-cpu',
 *           title: 'Cluster CPU Usage',
 *           type: 'graph',
 *           gridPos: { x: 0, y: 0, w: 12, h: 8 },
 *           queries: [{ expr: 'avg(vm_cpu_usage) by (cluster)', legend: '{{cluster}}' }],
 *           thresholds: [
 *             { value: 80, color: 'yellow' },
 *             { value: 90, color: 'red' }
 *           ]
 *         }
 *       ],
 *       refreshInterval: 30
 *     });
 *   }
 *
 *   @Cron(CronExpression.EVERY_MINUTE)
 *   async collectMetrics() {
 *     // Collect and record metrics
 *     const metrics = await this.getInfrastructureMetrics();
 *
 *     for (const metric of metrics) {
 *       await MonitoringKit.recordMetricValue(metric);
 *     }
 *   }
 *
 *   @Cron(CronExpression.EVERY_5_MINUTES)
 *   async evaluateAlerts() {
 *     const alerts = await this.getAlertDefinitions();
 *     const currentMetrics = await this.getCurrentMetrics();
 *
 *     for (const alert of alerts) {
 *       const result = await MonitoringKit.evaluateAlertCondition(alert.id, currentMetrics);
 *
 *       if (result.triggered) {
 *         await MonitoringKit.sendAlertNotification(result.alert, alert.notification.channels);
 *       } else {
 *         await MonitoringKit.autoResolveAlert(alert.id, currentMetrics);
 *       }
 *     }
 *   }
 *
 *   @Cron(CronExpression.EVERY_HOUR)
 *   async analyzePerformance() {
 *     const vms = await this.getVirtualMachines();
 *
 *     for (const vm of vms) {
 *       const analysis = await MonitoringKit.analyzePerformance(
 *         vm.id,
 *         'vm',
 *         { from: 'now-24h', to: 'now' }
 *       );
 *
 *       if (analysis.anomalies.length > 0) {
 *         await this.notifyAnomalies(vm.id, analysis.anomalies);
 *       }
 *
 *       if (analysis.recommendations.length > 0) {
 *         await this.storeRecommendations(vm.id, analysis.recommendations);
 *       }
 *     }
 *   }
 *
 *   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
 *   async generateReports() {
 *     // Generate capacity forecast
 *     const forecast = await MonitoringKit.forecastCapacity(
 *       'cpu',
 *       await this.getHistoricalCPUData(),
 *       90
 *     );
 *
 *     if (forecast.daysUntilFull && forecast.daysUntilFull < 30) {
 *       await this.notifyCapacityAlert(forecast);
 *     }
 *
 *     // Evaluate SLA compliance
 *     const slaIds = ['api-availability', 'vm-performance'];
 *     for (const slaId of slaIds) {
 *       const report = await MonitoringKit.evaluateSLACompliance(
 *         slaId,
 *         { from: 'now-30d', to: 'now' }
 *       );
 *
 *       if (report.status === 'breach') {
 *         await MonitoringKit.notifySLABreach(report, [
 *           { type: 'email', target: 'management@whitecross.com' }
 *         ]);
 *       }
 *     }
 *   }
 *
 *   async getInfrastructureMetrics(): Promise<any[]> {
 *     // Implementation
 *     return [];
 *   }
 *
 *   async getAlertDefinitions(): Promise<any[]> {
 *     // Implementation
 *     return [];
 *   }
 *
 *   async getCurrentMetrics(): Promise<any[]> {
 *     // Implementation
 *     return [];
 *   }
 *
 *   async getVirtualMachines(): Promise<any[]> {
 *     // Implementation
 *     return [];
 *   }
 *
 *   async notifyAnomalies(vmId: string, anomalies: any[]): Promise<void> {
 *     // Implementation
 *   }
 *
 *   async storeRecommendations(vmId: string, recommendations: any[]): Promise<void> {
 *     // Implementation
 *   }
 *
 *   async getHistoricalCPUData(): Promise<any[]> {
 *     // Implementation
 *     return [];
 *   }
 *
 *   async notifyCapacityAlert(forecast: any): Promise<void> {
 *     // Implementation
 *   }
 * }
 * ```
 */
//# sourceMappingURL=virtual-monitoring-analytics-kit.d.ts.map