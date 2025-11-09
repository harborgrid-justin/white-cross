/**
 * LOC: PROP-RPT-001
 * File: /reuse/property/property-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Business intelligence modules
 *   - Analytics and reporting systems
 */
/**
 * File: /reuse/property/property-reporting-kit.ts
 * Locator: WC-PROP-RPT-001
 * Purpose: Property Reporting & Business Intelligence Kit - Comprehensive reporting and analytics
 *
 * Upstream: Independent utility module for property reporting operations
 * Downstream: ../backend/*, ../frontend/*, Property management services
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 40 utility functions for reporting, dashboards, KPIs, analytics, and business intelligence
 *
 * LLM Context: Enterprise-grade property reporting and business intelligence utilities for
 * property management systems. Provides executive dashboards, custom report builders, KPI tracking,
 * scheduled automation, portfolio analytics, operational insights, financial reporting, and
 * compliance documentation. Essential for data-driven decision making, stakeholder communication,
 * and regulatory compliance in property management.
 */
interface Report {
    id: string;
    name: string;
    type: ReportType;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    schedule?: ReportSchedule;
    parameters: ReportParameters;
    format: ReportFormat;
    status: ReportStatus;
    lastGeneratedAt?: Date;
    outputPath?: string;
    recipients?: string[];
    tags?: string[];
}
type ReportType = 'executive_dashboard' | 'portfolio_performance' | 'financial_summary' | 'operational_metrics' | 'occupancy_analysis' | 'revenue_analysis' | 'expense_analysis' | 'maintenance_summary' | 'lease_expiration' | 'compliance_audit' | 'tenant_satisfaction' | 'property_valuation' | 'market_analysis' | 'budget_variance' | 'custom';
type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'html' | 'dashboard';
type ReportStatus = 'draft' | 'scheduled' | 'generating' | 'completed' | 'failed' | 'archived';
interface ReportSchedule {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time?: string;
    timezone?: string;
    enabled: boolean;
    nextRunAt?: Date;
    lastRunAt?: Date;
}
interface ReportParameters {
    dateRange: DateRange;
    propertyIds?: string[];
    portfolioIds?: string[];
    groupBy?: 'property' | 'portfolio' | 'region' | 'type';
    metrics?: string[];
    filters?: Record<string, any>;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
}
interface DateRange {
    startDate: Date;
    endDate: Date;
    period?: 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'last_90_days' | 'this_month' | 'last_month' | 'this_quarter' | 'last_quarter' | 'this_year' | 'last_year' | 'custom';
}
interface Dashboard {
    id: string;
    name: string;
    description?: string;
    widgets: DashboardWidget[];
    layout: DashboardLayout;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    isPublic: boolean;
    refreshInterval?: number;
}
interface DashboardWidget {
    id: string;
    type: WidgetType;
    title: string;
    position: WidgetPosition;
    size: WidgetSize;
    dataSource: DataSourceConfig;
    visualization: VisualizationConfig;
    filters?: Record<string, any>;
}
type WidgetType = 'kpi_card' | 'line_chart' | 'bar_chart' | 'pie_chart' | 'table' | 'gauge' | 'map' | 'heatmap' | 'trend_indicator' | 'progress_bar';
interface WidgetPosition {
    x: number;
    y: number;
}
interface WidgetSize {
    width: number;
    height: number;
}
interface DashboardLayout {
    columns: number;
    rows: number;
    gap: number;
}
interface DataSourceConfig {
    type: 'kpi' | 'metric' | 'query' | 'aggregation';
    source: string;
    refreshInterval?: number;
    cacheEnabled?: boolean;
}
interface VisualizationConfig {
    chartType?: string;
    colors?: string[];
    showLegend?: boolean;
    showLabels?: boolean;
    thresholds?: Threshold[];
}
interface Threshold {
    value: number;
    color: string;
    label?: string;
    operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
}
interface KPI {
    id: string;
    name: string;
    description?: string;
    category: KPICategory;
    value: number;
    previousValue?: number;
    target?: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    trendPercentage?: number;
    status: 'good' | 'warning' | 'critical' | 'neutral';
    calculatedAt: Date;
    period: DateRange;
}
type KPICategory = 'financial' | 'operational' | 'occupancy' | 'maintenance' | 'tenant_satisfaction' | 'portfolio_health' | 'efficiency';
interface ReportTemplate {
    id: string;
    name: string;
    description?: string;
    reportType: ReportType;
    sections: ReportSection[];
    defaultParameters: Partial<ReportParameters>;
    styling: ReportStyling;
    isPublic: boolean;
    createdBy: string;
    createdAt: Date;
}
interface ReportSection {
    id: string;
    title: string;
    type: 'text' | 'table' | 'chart' | 'kpi_grid' | 'summary' | 'custom';
    content?: string;
    dataQuery?: string;
    visualization?: VisualizationConfig;
    order: number;
}
interface ReportStyling {
    headerColor?: string;
    accentColor?: string;
    fontFamily?: string;
    fontSize?: number;
    logo?: string;
    footer?: string;
}
interface ExportOptions {
    format: ReportFormat;
    fileName: string;
    includeCharts: boolean;
    includeRawData: boolean;
    compression?: boolean;
    password?: string;
    watermark?: string;
}
interface ComplianceReport {
    reportId: string;
    complianceType: ComplianceType;
    period: DateRange;
    status: 'compliant' | 'non_compliant' | 'needs_review';
    findings: ComplianceFinding[];
    recommendations: string[];
    generatedAt: Date;
    certifiedBy?: string;
}
type ComplianceType = 'financial_audit' | 'safety_inspection' | 'environmental' | 'accessibility' | 'tax_compliance' | 'insurance_review' | 'regulatory';
interface ComplianceFinding {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    propertyId?: string;
    regulation: string;
    remediation?: string;
    dueDate?: Date;
    resolvedAt?: Date;
}
interface PortfolioMetrics {
    portfolioId: string;
    portfolioName: string;
    totalProperties: number;
    totalUnits: number;
    totalSquareFeet: number;
    occupancyRate: number;
    averageRent: number;
    totalRevenue: number;
    totalExpenses: number;
    netOperatingIncome: number;
    capRate: number;
    cashOnCashReturn: number;
    propertyValue: number;
    equity: number;
    debt: number;
    debtServiceCoverageRatio: number;
    period: DateRange;
}
interface OperationalMetrics {
    propertyId: string;
    propertyName: string;
    period: DateRange;
    workOrdersCompleted: number;
    workOrdersInProgress: number;
    averageCompletionTime: number;
    maintenanceCosts: number;
    tenantRequests: number;
    turnoverRate: number;
    averageTenantSatisfaction: number;
    inspectionsCompleted: number;
    violationsFound: number;
    violationsResolved: number;
}
interface FinancialMetrics {
    propertyId: string;
    propertyName: string;
    period: DateRange;
    grossRevenue: number;
    rentalIncome: number;
    otherIncome: number;
    totalExpenses: number;
    operatingExpenses: number;
    capitalExpenses: number;
    netOperatingIncome: number;
    netIncome: number;
    cashFlow: number;
    profitMargin: number;
    expenseRatio: number;
    revenuePerUnit: number;
    expensePerUnit: number;
}
interface ReportDataPoint {
    label: string;
    value: number;
    timestamp?: Date;
    metadata?: Record<string, any>;
}
interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
    options?: ChartOptions;
}
interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
}
interface ChartOptions {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    plugins?: {
        legend?: {
            display: boolean;
            position?: string;
        };
        title?: {
            display: boolean;
            text?: string;
        };
    };
    scales?: {
        x?: {
            display?: boolean;
            title?: {
                display?: boolean;
                text?: string;
            };
        };
        y?: {
            display?: boolean;
            title?: {
                display?: boolean;
                text?: string;
            };
        };
    };
}
/**
 * Creates an executive dashboard with key performance indicators.
 *
 * @param {string} dashboardName - Dashboard name
 * @param {string[]} propertyIds - Properties to include
 * @param {string} createdBy - User creating dashboard
 * @returns {Dashboard} Executive dashboard configuration
 *
 * @example
 * ```typescript
 * const dashboard = createExecutiveDashboard(
 *   'Q4 2025 Portfolio Overview',
 *   ['PROP-001', 'PROP-002'],
 *   'exec-123'
 * );
 * ```
 */
export declare const createExecutiveDashboard: (dashboardName: string, propertyIds: string[], createdBy: string) => Dashboard;
/**
 * Generates executive summary report with high-level insights.
 *
 * @param {string[]} propertyIds - Properties to include
 * @param {DateRange} period - Reporting period
 * @returns {object} Executive summary data
 *
 * @example
 * ```typescript
 * const summary = generateExecutiveSummary(
 *   ['PROP-001', 'PROP-002'],
 *   { startDate: new Date('2025-11-01'), endDate: new Date('2025-11-30') }
 * );
 * ```
 */
export declare const generateExecutiveSummary: (propertyIds: string[], period: DateRange) => object;
/**
 * Creates KPI cards for dashboard display.
 *
 * @param {string} kpiName - KPI name
 * @param {number} currentValue - Current value
 * @param {number} previousValue - Previous period value
 * @param {number} targetValue - Target value
 * @param {string} unit - Unit of measurement
 * @returns {KPI} KPI card data
 *
 * @example
 * ```typescript
 * const kpi = createKPICard(
 *   'Occupancy Rate',
 *   95.5,
 *   92.3,
 *   95.0,
 *   '%'
 * );
 * ```
 */
export declare const createKPICard: (kpiName: string, currentValue: number, previousValue: number, targetValue: number, unit: string) => KPI;
/**
 * Calculates portfolio-wide KPI metrics.
 *
 * @param {PortfolioMetrics[]} portfolioData - Portfolio metrics
 * @returns {KPI[]} Array of calculated KPIs
 *
 * @example
 * ```typescript
 * const kpis = calculatePortfolioKPIs(portfolioMetrics);
 * // Returns array of KPI objects for dashboard display
 * ```
 */
export declare const calculatePortfolioKPIs: (portfolioData: PortfolioMetrics[]) => KPI[];
/**
 * Adds a widget to an existing dashboard.
 *
 * @param {Dashboard} dashboard - Dashboard to modify
 * @param {Omit<DashboardWidget, 'id'>} widgetConfig - Widget configuration
 * @returns {Dashboard} Updated dashboard
 *
 * @example
 * ```typescript
 * const updated = addDashboardWidget(dashboard, {
 *   type: 'bar_chart',
 *   title: 'Monthly Revenue',
 *   position: { x: 0, y: 4 },
 *   size: { width: 6, height: 3 },
 *   dataSource: { type: 'aggregation', source: 'revenue' },
 *   visualization: { chartType: 'bar' }
 * });
 * ```
 */
export declare const addDashboardWidget: (dashboard: Dashboard, widgetConfig: Omit<DashboardWidget, "id">) => Dashboard;
/**
 * Creates a custom report configuration.
 *
 * @param {string} reportName - Report name
 * @param {ReportType} reportType - Type of report
 * @param {ReportParameters} parameters - Report parameters
 * @param {string} createdBy - User creating report
 * @returns {Report} Report configuration
 *
 * @example
 * ```typescript
 * const report = createCustomReport(
 *   'Monthly Financial Analysis',
 *   'financial_summary',
 *   {
 *     dateRange: { startDate: new Date('2025-11-01'), endDate: new Date('2025-11-30') },
 *     propertyIds: ['PROP-001'],
 *     metrics: ['revenue', 'expenses', 'noi']
 *   },
 *   'user-123'
 * );
 * ```
 */
export declare const createCustomReport: (reportName: string, reportType: ReportType, parameters: ReportParameters, createdBy: string) => Report;
/**
 * Builds a report template with customizable sections.
 *
 * @param {string} templateName - Template name
 * @param {ReportType} reportType - Report type
 * @param {ReportSection[]} sections - Report sections
 * @param {string} createdBy - User creating template
 * @returns {ReportTemplate} Report template
 *
 * @example
 * ```typescript
 * const template = buildReportTemplate(
 *   'Standard Financial Report',
 *   'financial_summary',
 *   [
 *     { id: 's1', title: 'Revenue Summary', type: 'table', order: 1 },
 *     { id: 's2', title: 'Expense Breakdown', type: 'chart', order: 2 }
 *   ],
 *   'admin-456'
 * );
 * ```
 */
export declare const buildReportTemplate: (templateName: string, reportType: ReportType, sections: ReportSection[], createdBy: string) => ReportTemplate;
/**
 * Adds a section to a report template.
 *
 * @param {ReportTemplate} template - Report template
 * @param {Omit<ReportSection, 'id'>} sectionConfig - Section configuration
 * @returns {ReportTemplate} Updated template
 *
 * @example
 * ```typescript
 * const updated = addReportSection(template, {
 *   title: 'KPI Summary',
 *   type: 'kpi_grid',
 *   order: 1
 * });
 * ```
 */
export declare const addReportSection: (template: ReportTemplate, sectionConfig: Omit<ReportSection, "id">) => ReportTemplate;
/**
 * Applies filters to report data.
 *
 * @param {ReportDataPoint[]} data - Report data
 * @param {Record<string, any>} filters - Filters to apply
 * @returns {ReportDataPoint[]} Filtered data
 *
 * @example
 * ```typescript
 * const filtered = applyReportFilters(reportData, {
 *   minValue: 1000,
 *   category: 'revenue'
 * });
 * ```
 */
export declare const applyReportFilters: (data: ReportDataPoint[], filters: Record<string, any>) => ReportDataPoint[];
/**
 * Validates report parameters before generation.
 *
 * @param {ReportParameters} parameters - Report parameters
 * @returns {{ isValid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateReportParameters(reportParams);
 * if (!validation.isValid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateReportParameters: (parameters: ReportParameters) => {
    isValid: boolean;
    errors: string[];
};
/**
 * Tracks KPI performance over time.
 *
 * @param {string} kpiId - KPI identifier
 * @param {ReportDataPoint[]} historicalData - Historical data points
 * @returns {object} KPI performance trends
 *
 * @example
 * ```typescript
 * const trends = trackKPIPerformance('occupancy-rate', historicalOccupancy);
 * // Returns trend analysis and projections
 * ```
 */
export declare const trackKPIPerformance: (kpiId: string, historicalData: ReportDataPoint[]) => object;
/**
 * Generates visualization data for charts.
 *
 * @param {ReportDataPoint[]} data - Data points
 * @param {string} chartType - Chart type
 * @returns {ChartData} Chart-ready data
 *
 * @example
 * ```typescript
 * const chartData = generateVisualizationData(monthlyRevenue, 'line');
 * ```
 */
export declare const generateVisualizationData: (data: ReportDataPoint[], chartType: string) => ChartData;
/**
 * Creates a KPI comparison across multiple properties.
 *
 * @param {string} kpiName - KPI to compare
 * @param {Array<{propertyId: string, value: number}>} propertyValues - Property values
 * @returns {ChartData} Comparison chart data
 *
 * @example
 * ```typescript
 * const comparison = createKPIComparison('occupancy', [
 *   { propertyId: 'PROP-001', value: 95 },
 *   { propertyId: 'PROP-002', value: 88 }
 * ]);
 * ```
 */
export declare const createKPIComparison: (kpiName: string, propertyValues: Array<{
    propertyId: string;
    value: number;
}>) => ChartData;
/**
 * Calculates KPI variance from target.
 *
 * @param {number} actualValue - Actual value
 * @param {number} targetValue - Target value
 * @returns {object} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateKPIVariance(92, 95);
 * // Returns: { variance: -3, percentVariance: -3.16, status: 'below_target' }
 * ```
 */
export declare const calculateKPIVariance: (actualValue: number, targetValue: number) => {
    variance: number;
    percentVariance: number;
    status: "above_target" | "on_target" | "below_target";
    description: string;
};
/**
 * Schedules a report for automatic generation.
 *
 * @param {Report} report - Report to schedule
 * @param {ReportSchedule} schedule - Schedule configuration
 * @returns {Report} Scheduled report
 *
 * @example
 * ```typescript
 * const scheduled = scheduleReport(report, {
 *   frequency: 'monthly',
 *   dayOfMonth: 1,
 *   time: '09:00',
 *   timezone: 'America/New_York',
 *   enabled: true
 * });
 * ```
 */
export declare const scheduleReport: (report: Report, schedule: ReportSchedule) => Report;
/**
 * Calculates next report execution time.
 *
 * @param {ReportSchedule} schedule - Schedule configuration
 * @returns {Date} Next run date
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextReportRun(scheduleConfig);
 * // Returns: Date for next scheduled execution
 * ```
 */
export declare const calculateNextReportRun: (schedule: ReportSchedule) => Date;
/**
 * Checks for reports due to run.
 *
 * @param {Report[]} scheduledReports - Scheduled reports
 * @returns {Report[]} Reports ready to execute
 *
 * @example
 * ```typescript
 * const dueReports = checkScheduledReports(allScheduledReports);
 * // Process each report that's due
 * ```
 */
export declare const checkScheduledReports: (scheduledReports: Report[]) => Report[];
/**
 * Sends report to recipients via email.
 *
 * @param {Report} report - Report to send
 * @param {string[]} recipients - Email recipients
 * @param {string} message - Email message
 * @returns {Promise<object>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendReportEmail(
 *   report,
 *   ['exec@example.com', 'manager@example.com'],
 *   'Please find attached the monthly financial report.'
 * );
 * ```
 */
export declare const sendReportEmail: (report: Report, recipients: string[], message: string) => Promise<object>;
/**
 * Updates report schedule configuration.
 *
 * @param {Report} report - Report to update
 * @param {Partial<ReportSchedule>} scheduleUpdates - Schedule updates
 * @returns {Report} Updated report
 *
 * @example
 * ```typescript
 * const updated = updateReportSchedule(report, {
 *   frequency: 'weekly',
 *   dayOfWeek: 5,
 *   enabled: true
 * });
 * ```
 */
export declare const updateReportSchedule: (report: Report, scheduleUpdates: Partial<ReportSchedule>) => Report;
/**
 * Exports report data to specified format.
 *
 * @param {ReportDataPoint[]} data - Data to export
 * @param {ExportOptions} options - Export options
 * @returns {Promise<string>} Export file path
 *
 * @example
 * ```typescript
 * const filePath = await exportReportData(reportData, {
 *   format: 'excel',
 *   fileName: 'financial-report-nov-2025',
 *   includeCharts: true,
 *   includeRawData: true
 * });
 * ```
 */
export declare const exportReportData: (data: ReportDataPoint[], options: ExportOptions) => Promise<string>;
/**
 * Formats report data as CSV string.
 *
 * @param {ReportDataPoint[]} data - Data to format
 * @param {boolean} includeHeaders - Include CSV headers
 * @returns {string} CSV formatted string
 *
 * @example
 * ```typescript
 * const csv = formatAsCSV(reportData, true);
 * // Returns: "Label,Value,Timestamp\nQ1 Revenue,150000,2025-03-31\n..."
 * ```
 */
export declare const formatAsCSV: (data: ReportDataPoint[], includeHeaders?: boolean) => string;
/**
 * Formats report data as JSON.
 *
 * @param {ReportDataPoint[]} data - Data to format
 * @param {boolean} prettyPrint - Format with indentation
 * @returns {string} JSON formatted string
 *
 * @example
 * ```typescript
 * const json = formatAsJSON(reportData, true);
 * ```
 */
export declare const formatAsJSON: (data: ReportDataPoint[], prettyPrint?: boolean) => string;
/**
 * Formats currency values for reports.
 *
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 *
 * @example
 * ```typescript
 * const formatted = formatCurrency(1500.50, 'USD');
 * // Returns: "$1,500.50"
 * ```
 */
export declare const formatCurrency: (amount: number, currency?: string) => string;
/**
 * Formats percentage values for reports.
 *
 * @param {number} value - Value to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage string
 *
 * @example
 * ```typescript
 * const formatted = formatPercentage(0.9547, 2);
 * // Returns: "95.47%"
 * ```
 */
export declare const formatPercentage: (value: number, decimals?: number) => string;
/**
 * Generates comprehensive portfolio performance report.
 *
 * @param {string[]} portfolioIds - Portfolio IDs
 * @param {DateRange} period - Reporting period
 * @returns {object} Portfolio performance data
 *
 * @example
 * ```typescript
 * const performance = generatePortfolioPerformanceReport(
 *   ['PORT-001'],
 *   { startDate: new Date('2025-11-01'), endDate: new Date('2025-11-30') }
 * );
 * ```
 */
export declare const generatePortfolioPerformanceReport: (portfolioIds: string[], period: DateRange) => object;
/**
 * Calculates portfolio return on investment.
 *
 * @param {number} initialInvestment - Initial investment amount
 * @param {number} currentValue - Current portfolio value
 * @param {number} cashFlowReceived - Total cash flow received
 * @returns {object} ROI analysis
 *
 * @example
 * ```typescript
 * const roi = calculatePortfolioROI(1000000, 1250000, 75000);
 * // Returns: { roi: 32.5, annualizedROI: ... }
 * ```
 */
export declare const calculatePortfolioROI: (initialInvestment: number, currentValue: number, cashFlowReceived: number) => {
    roi: number;
    totalReturn: number;
    capitalAppreciation: number;
    cashFlowReturn: number;
};
/**
 * Compares portfolio performance against benchmarks.
 *
 * @param {PortfolioMetrics} portfolioMetrics - Portfolio metrics
 * @param {object} benchmarks - Industry benchmarks
 * @returns {object} Benchmark comparison
 *
 * @example
 * ```typescript
 * const comparison = comparePortfolioToBenchmarks(metrics, {
 *   avgOccupancy: 93,
 *   avgCapRate: 6.5,
 *   avgNOI: 500000
 * });
 * ```
 */
export declare const comparePortfolioToBenchmarks: (portfolioMetrics: PortfolioMetrics, benchmarks: Record<string, number>) => object;
/**
 * Identifies portfolio risk factors.
 *
 * @param {PortfolioMetrics} portfolioMetrics - Portfolio metrics
 * @returns {object[]} Identified risks
 *
 * @example
 * ```typescript
 * const risks = identifyPortfolioRisks(portfolioMetrics);
 * // Returns array of risk factors with severity levels
 * ```
 */
export declare const identifyPortfolioRisks: (portfolioMetrics: PortfolioMetrics) => Array<{
    riskType: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    recommendation: string;
}>;
/**
 * Generates operational metrics report.
 *
 * @param {string[]} propertyIds - Property IDs
 * @param {DateRange} period - Reporting period
 * @returns {OperationalMetrics[]} Operational metrics
 *
 * @example
 * ```typescript
 * const metrics = generateOperationalReport(
 *   ['PROP-001', 'PROP-002'],
 *   { startDate: new Date('2025-11-01'), endDate: new Date('2025-11-30') }
 * );
 * ```
 */
export declare const generateOperationalReport: (propertyIds: string[], period: DateRange) => OperationalMetrics[];
/**
 * Calculates maintenance efficiency metrics.
 *
 * @param {OperationalMetrics} metrics - Operational metrics
 * @returns {object} Efficiency analysis
 *
 * @example
 * ```typescript
 * const efficiency = calculateMaintenanceEfficiency(operationalMetrics);
 * ```
 */
export declare const calculateMaintenanceEfficiency: (metrics: OperationalMetrics) => {
    completionRate: number;
    averageResponseTime: number;
    costPerWorkOrder: number;
    efficiency: "excellent" | "good" | "fair" | "poor";
};
/**
 * Analyzes tenant satisfaction trends.
 *
 * @param {Array<{date: Date, score: number}>} satisfactionData - Historical satisfaction scores
 * @returns {object} Satisfaction trend analysis
 *
 * @example
 * ```typescript
 * const trends = analyzeTenantSatisfaction(historicalScores);
 * ```
 */
export declare const analyzeTenantSatisfaction: (satisfactionData: Array<{
    date: Date;
    score: number;
}>) => {
    currentScore: number;
    averageScore: number;
    trend: "improving" | "stable" | "declining";
    changePercent: number;
};
/**
 * Generates comprehensive financial report.
 *
 * @param {string[]} propertyIds - Property IDs
 * @param {DateRange} period - Reporting period
 * @returns {FinancialMetrics[]} Financial metrics
 *
 * @example
 * ```typescript
 * const financials = generateFinancialReport(
 *   ['PROP-001'],
 *   { startDate: new Date('2025-11-01'), endDate: new Date('2025-11-30') }
 * );
 * ```
 */
export declare const generateFinancialReport: (propertyIds: string[], period: DateRange) => FinancialMetrics[];
/**
 * Calculates budget variance analysis.
 *
 * @param {FinancialMetrics} actualMetrics - Actual financial metrics
 * @param {FinancialMetrics} budgetMetrics - Budgeted financial metrics
 * @returns {object} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateBudgetVariance(actualFinancials, budgetedFinancials);
 * ```
 */
export declare const calculateBudgetVariance: (actualMetrics: FinancialMetrics, budgetMetrics: FinancialMetrics) => {
    revenueVariance: {
        amount: number;
        percent: number;
        status: string;
    };
    expenseVariance: {
        amount: number;
        percent: number;
        status: string;
    };
    noiVariance: {
        amount: number;
        percent: number;
        status: string;
    };
};
/**
 * Generates income statement for property.
 *
 * @param {FinancialMetrics} metrics - Financial metrics
 * @returns {object} Income statement
 *
 * @example
 * ```typescript
 * const statement = generateIncomeStatement(financialMetrics);
 * ```
 */
export declare const generateIncomeStatement: (metrics: FinancialMetrics) => {
    revenue: {
        rental: number;
        other: number;
        total: number;
    };
    expenses: {
        operating: number;
        capital: number;
        total: number;
    };
    netOperatingIncome: number;
    netIncome: number;
    margins: {
        operating: number;
        net: number;
    };
};
/**
 * Generates compliance audit report.
 *
 * @param {string[]} propertyIds - Property IDs
 * @param {ComplianceType} complianceType - Type of compliance
 * @param {DateRange} period - Audit period
 * @returns {ComplianceReport} Compliance report
 *
 * @example
 * ```typescript
 * const audit = generateComplianceReport(
 *   ['PROP-001'],
 *   'safety_inspection',
 *   { startDate: new Date('2025-11-01'), endDate: new Date('2025-11-30') }
 * );
 * ```
 */
export declare const generateComplianceReport: (propertyIds: string[], complianceType: ComplianceType, period: DateRange) => ComplianceReport;
/**
 * Validates compliance requirements.
 *
 * @param {string} propertyId - Property ID
 * @param {ComplianceType} complianceType - Compliance type
 * @returns {object} Compliance validation result
 *
 * @example
 * ```typescript
 * const validation = validateComplianceRequirements('PROP-001', 'financial_audit');
 * ```
 */
export declare const validateComplianceRequirements: (propertyId: string, complianceType: ComplianceType) => {
    isCompliant: boolean;
    missingRequirements: string[];
    expiringCertifications: Array<{
        name: string;
        expiresAt: Date;
    }>;
};
/**
 * Creates compliance finding record.
 *
 * @param {Omit<ComplianceFinding, 'id'>} finding - Finding details
 * @returns {ComplianceFinding} Compliance finding
 *
 * @example
 * ```typescript
 * const finding = createComplianceFinding({
 *   severity: 'high',
 *   description: 'Missing fire safety documentation',
 *   propertyId: 'PROP-001',
 *   regulation: 'NFPA 101',
 *   remediation: 'Obtain and file required documentation'
 * });
 * ```
 */
export declare const createComplianceFinding: (finding: Omit<ComplianceFinding, "id">) => ComplianceFinding;
/**
 * Generates a color palette for charts.
 *
 * @param {number} count - Number of colors needed
 * @returns {string[]} Array of color hex codes
 *
 * @example
 * ```typescript
 * const colors = generateColorPalette(5);
 * // Returns: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
 * ```
 */
export declare const generateColorPalette: (count: number) => string[];
/**
 * Calculates date range for common periods.
 *
 * @param {string} period - Period identifier
 * @returns {DateRange} Date range
 *
 * @example
 * ```typescript
 * const range = getDateRangeForPeriod('last_30_days');
 * // Returns: { startDate: ..., endDate: ..., period: 'last_30_days' }
 * ```
 */
export declare const getDateRangeForPeriod: (period: DateRange["period"]) => DateRange;
/**
 * Aggregates time-series data for trend analysis.
 *
 * @param {ReportDataPoint[]} data - Time-series data points
 * @param {'daily' | 'weekly' | 'monthly' | 'quarterly'} interval - Aggregation interval
 * @returns {ReportDataPoint[]} Aggregated data
 *
 * @example
 * ```typescript
 * const aggregated = aggregateTimeSeriesData(dailyRevenue, 'monthly');
 * // Returns monthly totals from daily data
 * ```
 */
export declare const aggregateTimeSeriesData: (data: ReportDataPoint[], interval: "daily" | "weekly" | "monthly" | "quarterly") => ReportDataPoint[];
export {};
//# sourceMappingURL=property-reporting-kit.d.ts.map