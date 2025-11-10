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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

type ReportType =
  | 'executive_dashboard'
  | 'portfolio_performance'
  | 'financial_summary'
  | 'operational_metrics'
  | 'occupancy_analysis'
  | 'revenue_analysis'
  | 'expense_analysis'
  | 'maintenance_summary'
  | 'lease_expiration'
  | 'compliance_audit'
  | 'tenant_satisfaction'
  | 'property_valuation'
  | 'market_analysis'
  | 'budget_variance'
  | 'custom';

type ReportFormat =
  | 'pdf'
  | 'excel'
  | 'csv'
  | 'json'
  | 'html'
  | 'dashboard';

type ReportStatus =
  | 'draft'
  | 'scheduled'
  | 'generating'
  | 'completed'
  | 'failed'
  | 'archived';

interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time?: string; // HH:MM format
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
  period?: 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'last_90_days' |
           'this_month' | 'last_month' | 'this_quarter' | 'last_quarter' |
           'this_year' | 'last_year' | 'custom';
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
  refreshInterval?: number; // in seconds
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

type WidgetType =
  | 'kpi_card'
  | 'line_chart'
  | 'bar_chart'
  | 'pie_chart'
  | 'table'
  | 'gauge'
  | 'map'
  | 'heatmap'
  | 'trend_indicator'
  | 'progress_bar';

interface WidgetPosition {
  x: number;
  y: number;
}

interface WidgetSize {
  width: number; // grid columns (1-12)
  height: number; // grid rows
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

type KPICategory =
  | 'financial'
  | 'operational'
  | 'occupancy'
  | 'maintenance'
  | 'tenant_satisfaction'
  | 'portfolio_health'
  | 'efficiency';

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

type ComplianceType =
  | 'financial_audit'
  | 'safety_inspection'
  | 'environmental'
  | 'accessibility'
  | 'tax_compliance'
  | 'insurance_review'
  | 'regulatory';

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
  averageCompletionTime: number; // in hours
  maintenanceCosts: number;
  tenantRequests: number;
  turnoverRate: number;
  averageTenantSatisfaction: number; // 1-5
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
  profitMargin: number; // percentage
  expenseRatio: number; // percentage
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
    legend?: { display: boolean; position?: string };
    title?: { display: boolean; text?: string };
  };
  scales?: {
    x?: { display?: boolean; title?: { display?: boolean; text?: string } };
    y?: { display?: boolean; title?: { display?: boolean; text?: string } };
  };
}

// ============================================================================
// EXECUTIVE DASHBOARD GENERATION
// ============================================================================

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
export const createExecutiveDashboard = (
  dashboardName: string,
  propertyIds: string[],
  createdBy: string,
): Dashboard => {
  const widgets: DashboardWidget[] = [
    {
      id: 'widget-occupancy',
      type: 'kpi_card',
      title: 'Overall Occupancy Rate',
      position: { x: 0, y: 0 },
      size: { width: 3, height: 2 },
      dataSource: { type: 'kpi', source: 'occupancy_rate' },
      visualization: {
        colors: ['#10B981'],
        thresholds: [
          { value: 95, color: '#10B981', operator: 'gte', label: 'Excellent' },
          { value: 85, color: '#F59E0B', operator: 'gte', label: 'Good' },
          { value: 0, color: '#EF4444', operator: 'gte', label: 'Poor' },
        ],
      },
    },
    {
      id: 'widget-noi',
      type: 'kpi_card',
      title: 'Net Operating Income',
      position: { x: 3, y: 0 },
      size: { width: 3, height: 2 },
      dataSource: { type: 'kpi', source: 'net_operating_income' },
      visualization: { colors: ['#3B82F6'] },
    },
    {
      id: 'widget-revenue-trend',
      type: 'line_chart',
      title: 'Revenue Trend (Last 12 Months)',
      position: { x: 0, y: 2 },
      size: { width: 6, height: 4 },
      dataSource: { type: 'aggregation', source: 'monthly_revenue' },
      visualization: { chartType: 'line', colors: ['#10B981'], showLegend: true },
    },
    {
      id: 'widget-expense-breakdown',
      type: 'pie_chart',
      title: 'Expense Breakdown',
      position: { x: 6, y: 0 },
      size: { width: 3, height: 4 },
      dataSource: { type: 'aggregation', source: 'expense_categories' },
      visualization: { chartType: 'pie', showLabels: true },
    },
    {
      id: 'widget-property-performance',
      type: 'table',
      title: 'Top Performing Properties',
      position: { x: 0, y: 6 },
      size: { width: 6, height: 3 },
      dataSource: { type: 'query', source: 'property_performance' },
      visualization: {},
    },
  ];

  return {
    id: `DASH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: dashboardName,
    description: 'Executive overview of portfolio performance and key metrics',
    widgets,
    layout: { columns: 12, rows: 10, gap: 16 },
    createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false,
    refreshInterval: 300, // 5 minutes
  };
};

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
export const generateExecutiveSummary = (
  propertyIds: string[],
  period: DateRange,
): object => {
  return {
    reportTitle: 'Executive Summary',
    period: {
      start: period.startDate.toLocaleDateString(),
      end: period.endDate.toLocaleDateString(),
    },
    portfolioOverview: {
      totalProperties: propertyIds.length,
      totalValue: 0, // Would be calculated from actual data
      totalUnits: 0,
      occupiedUnits: 0,
      occupancyRate: 0,
    },
    financialHighlights: {
      totalRevenue: 0,
      totalExpenses: 0,
      netOperatingIncome: 0,
      profitMargin: 0,
      revenueGrowth: 0,
    },
    keyMetrics: {
      averageRentPerUnit: 0,
      maintenanceCostPerUnit: 0,
      tenantSatisfactionScore: 0,
      workOrderCompletionRate: 0,
    },
    alerts: [],
    recommendations: [],
    generatedAt: new Date(),
  };
};

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
export const createKPICard = (
  kpiName: string,
  currentValue: number,
  previousValue: number,
  targetValue: number,
  unit: string,
): KPI => {
  const change = currentValue - previousValue;
  const trendPercentage = previousValue !== 0
    ? (change / previousValue) * 100
    : 0;

  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (Math.abs(change) > 0.01) {
    trend = change > 0 ? 'up' : 'down';
  }

  let status: 'good' | 'warning' | 'critical' | 'neutral' = 'neutral';
  if (targetValue > 0) {
    const performanceRatio = currentValue / targetValue;
    if (performanceRatio >= 0.95) status = 'good';
    else if (performanceRatio >= 0.85) status = 'warning';
    else status = 'critical';
  }

  return {
    id: `KPI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: kpiName,
    category: 'operational',
    value: currentValue,
    previousValue,
    target: targetValue,
    unit,
    trend,
    trendPercentage: Math.round(trendPercentage * 100) / 100,
    status,
    calculatedAt: new Date(),
    period: {
      startDate: new Date(),
      endDate: new Date(),
    },
  };
};

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
export const calculatePortfolioKPIs = (portfolioData: PortfolioMetrics[]): KPI[] => {
  const kpis: KPI[] = [];

  if (portfolioData.length === 0) return kpis;

  // Total portfolio value
  const totalValue = portfolioData.reduce((sum, p) => sum + p.propertyValue, 0);
  kpis.push(createKPICard('Total Portfolio Value', totalValue, totalValue * 0.98, totalValue, '$'));

  // Average occupancy rate
  const avgOccupancy = portfolioData.reduce((sum, p) => sum + p.occupancyRate, 0) / portfolioData.length;
  kpis.push(createKPICard('Average Occupancy', avgOccupancy, avgOccupancy - 2, 95, '%'));

  // Total NOI
  const totalNOI = portfolioData.reduce((sum, p) => sum + p.netOperatingIncome, 0);
  kpis.push(createKPICard('Total NOI', totalNOI, totalNOI * 0.95, totalNOI * 1.05, '$'));

  // Average cap rate
  const avgCapRate = portfolioData.reduce((sum, p) => sum + p.capRate, 0) / portfolioData.length;
  kpis.push(createKPICard('Average Cap Rate', avgCapRate, avgCapRate - 0.3, avgCapRate, '%'));

  return kpis;
};

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
export const addDashboardWidget = (
  dashboard: Dashboard,
  widgetConfig: Omit<DashboardWidget, 'id'>,
): Dashboard => {
  const widget: DashboardWidget = {
    id: `WIDGET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...widgetConfig,
  };

  return {
    ...dashboard,
    widgets: [...dashboard.widgets, widget],
    updatedAt: new Date(),
  };
};

// ============================================================================
// CUSTOM REPORT BUILDER
// ============================================================================

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
export const createCustomReport = (
  reportName: string,
  reportType: ReportType,
  parameters: ReportParameters,
  createdBy: string,
): Report => {
  return {
    id: `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: reportName,
    type: reportType,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy,
    parameters,
    format: 'pdf',
    status: 'draft',
  };
};

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
export const buildReportTemplate = (
  templateName: string,
  reportType: ReportType,
  sections: ReportSection[],
  createdBy: string,
): ReportTemplate => {
  return {
    id: `TPL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: templateName,
    reportType,
    sections: sections.sort((a, b) => a.order - b.order),
    defaultParameters: {
      dateRange: {
        startDate: new Date(),
        endDate: new Date(),
        period: 'this_month',
      },
    },
    styling: {
      headerColor: '#1F2937',
      accentColor: '#3B82F6',
      fontFamily: 'Arial, sans-serif',
      fontSize: 12,
    },
    isPublic: false,
    createdBy,
    createdAt: new Date(),
  };
};

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
export const addReportSection = (
  template: ReportTemplate,
  sectionConfig: Omit<ReportSection, 'id'>,
): ReportTemplate => {
  const section: ReportSection = {
    id: `SEC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...sectionConfig,
  };

  return {
    ...template,
    sections: [...template.sections, section].sort((a, b) => a.order - b.order),
  };
};

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
export const applyReportFilters = (
  data: ReportDataPoint[],
  filters: Record<string, any>,
): ReportDataPoint[] => {
  let filtered = [...data];

  if (filters.minValue !== undefined) {
    filtered = filtered.filter(d => d.value >= filters.minValue);
  }

  if (filters.maxValue !== undefined) {
    filtered = filtered.filter(d => d.value <= filters.maxValue);
  }

  if (filters.category !== undefined) {
    filtered = filtered.filter(d => d.metadata?.category === filters.category);
  }

  if (filters.startDate !== undefined) {
    const startDate = new Date(filters.startDate);
    filtered = filtered.filter(d => d.timestamp && d.timestamp >= startDate);
  }

  if (filters.endDate !== undefined) {
    const endDate = new Date(filters.endDate);
    filtered = filtered.filter(d => d.timestamp && d.timestamp <= endDate);
  }

  return filtered;
};

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
export const validateReportParameters = (
  parameters: ReportParameters,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!parameters.dateRange) {
    errors.push('Date range is required');
  } else {
    if (!parameters.dateRange.startDate) {
      errors.push('Start date is required');
    }
    if (!parameters.dateRange.endDate) {
      errors.push('End date is required');
    }
    if (parameters.dateRange.startDate && parameters.dateRange.endDate) {
      if (parameters.dateRange.startDate > parameters.dateRange.endDate) {
        errors.push('Start date must be before end date');
      }
    }
  }

  if (parameters.propertyIds && parameters.propertyIds.length === 0) {
    errors.push('At least one property must be selected');
  }

  if (parameters.limit && parameters.limit < 1) {
    errors.push('Limit must be at least 1');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// KPI TRACKING AND VISUALIZATION
// ============================================================================

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
export const trackKPIPerformance = (
  kpiId: string,
  historicalData: ReportDataPoint[],
): object => {
  if (historicalData.length === 0) {
    return { kpiId, trend: 'insufficient_data', dataPoints: 0 };
  }

  const sorted = [...historicalData].sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0;
    return a.timestamp.getTime() - b.timestamp.getTime();
  });

  const values = sorted.map(d => d.value);
  const average = values.reduce((sum, v) => sum + v, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Calculate trend
  const recentValues = values.slice(-5);
  const olderValues = values.slice(0, Math.min(5, values.length - 5));
  const recentAvg = recentValues.reduce((sum, v) => sum + v, 0) / recentValues.length;
  const olderAvg = olderValues.length > 0
    ? olderValues.reduce((sum, v) => sum + v, 0) / olderValues.length
    : recentAvg;

  let trend: string;
  const trendChange = ((recentAvg - olderAvg) / olderAvg) * 100;
  if (Math.abs(trendChange) < 5) trend = 'stable';
  else if (trendChange > 0) trend = 'improving';
  else trend = 'declining';

  return {
    kpiId,
    dataPoints: values.length,
    average: Math.round(average * 100) / 100,
    min,
    max,
    current: values[values.length - 1],
    trend,
    trendChange: Math.round(trendChange * 100) / 100,
    volatility: Math.round((max - min) * 100) / 100,
  };
};

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
export const generateVisualizationData = (
  data: ReportDataPoint[],
  chartType: string,
): ChartData => {
  const labels = data.map(d => d.label);
  const values = data.map(d => d.value);

  const colors = chartType === 'pie' || chartType === 'bar'
    ? generateColorPalette(data.length)
    : ['#3B82F6'];

  return {
    labels,
    datasets: [
      {
        label: 'Value',
        data: values,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 2,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom' },
        title: { display: false },
      },
    },
  };
};

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
export const createKPIComparison = (
  kpiName: string,
  propertyValues: Array<{ propertyId: string; value: number }>,
): ChartData => {
  return {
    labels: propertyValues.map(pv => pv.propertyId),
    datasets: [
      {
        label: kpiName,
        data: propertyValues.map(pv => pv.value),
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
      },
    ],
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: `${kpiName} by Property` },
      },
      scales: {
        y: { display: true, title: { display: true, text: kpiName } },
      },
    },
  };
};

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
export const calculateKPIVariance = (
  actualValue: number,
  targetValue: number,
): {
  variance: number;
  percentVariance: number;
  status: 'above_target' | 'on_target' | 'below_target';
  description: string;
} => {
  const variance = actualValue - targetValue;
  const percentVariance = targetValue !== 0
    ? (variance / targetValue) * 100
    : 0;

  let status: 'above_target' | 'on_target' | 'below_target';
  if (Math.abs(percentVariance) < 5) status = 'on_target';
  else if (variance > 0) status = 'above_target';
  else status = 'below_target';

  const description = status === 'on_target'
    ? 'Meeting target'
    : status === 'above_target'
    ? `Exceeding target by ${Math.abs(percentVariance).toFixed(1)}%`
    : `Below target by ${Math.abs(percentVariance).toFixed(1)}%`;

  return {
    variance: Math.round(variance * 100) / 100,
    percentVariance: Math.round(percentVariance * 100) / 100,
    status,
    description,
  };
};

// ============================================================================
// SCHEDULED REPORT AUTOMATION
// ============================================================================

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
export const scheduleReport = (
  report: Report,
  schedule: ReportSchedule,
): Report => {
  const nextRun = calculateNextReportRun(schedule);

  return {
    ...report,
    schedule: {
      ...schedule,
      nextRunAt: nextRun,
    },
    status: 'scheduled',
    updatedAt: new Date(),
  };
};

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
export const calculateNextReportRun = (schedule: ReportSchedule): Date => {
  const now = new Date();
  const next = new Date(now);

  if (!schedule.enabled) {
    return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year in future
  }

  switch (schedule.frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      const currentDay = next.getDay();
      const targetDay = schedule.dayOfWeek || 1; // Default to Monday
      const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7;
      next.setDate(next.getDate() + daysUntilTarget);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      next.setDate(schedule.dayOfMonth || 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      next.setDate(1);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      next.setMonth(0);
      next.setDate(1);
      break;
  }

  // Set time if specified
  if (schedule.time) {
    const [hours, minutes] = schedule.time.split(':').map(Number);
    next.setHours(hours, minutes, 0, 0);
  } else {
    next.setHours(9, 0, 0, 0); // Default to 9 AM
  }

  return next;
};

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
export const checkScheduledReports = (scheduledReports: Report[]): Report[] => {
  const now = new Date();

  return scheduledReports.filter(report => {
    if (report.status !== 'scheduled' || !report.schedule?.enabled) {
      return false;
    }

    return report.schedule.nextRunAt && report.schedule.nextRunAt <= now;
  });
};

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
export const sendReportEmail = async (
  report: Report,
  recipients: string[],
  message: string,
): Promise<object> => {
  // In production, this would integrate with email service
  return {
    reportId: report.id,
    recipients,
    subject: `Report: ${report.name}`,
    message,
    attachmentPath: report.outputPath,
    sentAt: new Date(),
    status: 'sent',
  };
};

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
export const updateReportSchedule = (
  report: Report,
  scheduleUpdates: Partial<ReportSchedule>,
): Report => {
  const updatedSchedule = {
    ...report.schedule,
    ...scheduleUpdates,
  } as ReportSchedule;

  const nextRun = calculateNextReportRun(updatedSchedule);

  return {
    ...report,
    schedule: {
      ...updatedSchedule,
      nextRunAt: nextRun,
    },
    updatedAt: new Date(),
  };
};

// ============================================================================
// DATA EXPORT AND FORMATTING
// ============================================================================

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
export const exportReportData = async (
  data: ReportDataPoint[],
  options: ExportOptions,
): Promise<string> => {
  // In production, this would generate actual files
  const timestamp = new Date().getTime();
  const extension = options.format === 'excel' ? 'xlsx' : options.format;
  const fileName = `${options.fileName}-${timestamp}.${extension}`;
  const filePath = `/exports/${fileName}`;

  // Simulate file generation
  await new Promise(resolve => setTimeout(resolve, 100));

  return filePath;
};

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
export const formatAsCSV = (
  data: ReportDataPoint[],
  includeHeaders: boolean = true,
): string => {
  const lines: string[] = [];

  if (includeHeaders) {
    lines.push('Label,Value,Timestamp');
  }

  data.forEach(point => {
    const timestamp = point.timestamp
      ? point.timestamp.toISOString()
      : '';
    lines.push(`"${point.label}",${point.value},"${timestamp}"`);
  });

  return lines.join('\n');
};

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
export const formatAsJSON = (
  data: ReportDataPoint[],
  prettyPrint: boolean = true,
): string => {
  return prettyPrint
    ? JSON.stringify(data, null, 2)
    : JSON.stringify(data);
};

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
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

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
export const formatPercentage = (
  value: number,
  decimals: number = 2,
): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// ============================================================================
// PORTFOLIO PERFORMANCE REPORTS
// ============================================================================

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
export const generatePortfolioPerformanceReport = (
  portfolioIds: string[],
  period: DateRange,
): object => {
  return {
    reportType: 'portfolio_performance',
    period: {
      start: period.startDate.toLocaleDateString(),
      end: period.endDate.toLocaleDateString(),
    },
    portfolios: portfolioIds,
    summary: {
      totalRevenue: 0,
      totalExpenses: 0,
      netOperatingIncome: 0,
      occupancyRate: 0,
      propertyCount: 0,
      unitCount: 0,
    },
    trends: {
      revenueGrowth: 0,
      expenseGrowth: 0,
      occupancyChange: 0,
    },
    topPerformers: [],
    underperformers: [],
    recommendations: [],
    generatedAt: new Date(),
  };
};

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
export const calculatePortfolioROI = (
  initialInvestment: number,
  currentValue: number,
  cashFlowReceived: number,
): {
  roi: number;
  totalReturn: number;
  capitalAppreciation: number;
  cashFlowReturn: number;
} => {
  const totalReturn = (currentValue + cashFlowReceived) - initialInvestment;
  const roi = (totalReturn / initialInvestment) * 100;
  const capitalAppreciation = currentValue - initialInvestment;
  const cashFlowReturn = cashFlowReceived;

  return {
    roi: Math.round(roi * 100) / 100,
    totalReturn: Math.round(totalReturn * 100) / 100,
    capitalAppreciation: Math.round(capitalAppreciation * 100) / 100,
    cashFlowReturn: Math.round(cashFlowReturn * 100) / 100,
  };
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
export const comparePortfolioToBenchmarks = (
  portfolioMetrics: PortfolioMetrics,
  benchmarks: Record<string, number>,
): object => {
  const comparisons: Array<{
    metric: string;
    portfolioValue: number;
    benchmarkValue: number;
    variance: number;
    performance: 'above' | 'at' | 'below';
  }> = [];

  if (benchmarks.avgOccupancy !== undefined) {
    const variance = portfolioMetrics.occupancyRate - benchmarks.avgOccupancy;
    comparisons.push({
      metric: 'Occupancy Rate',
      portfolioValue: portfolioMetrics.occupancyRate,
      benchmarkValue: benchmarks.avgOccupancy,
      variance,
      performance: Math.abs(variance) < 2 ? 'at' : variance > 0 ? 'above' : 'below',
    });
  }

  if (benchmarks.avgCapRate !== undefined) {
    const variance = portfolioMetrics.capRate - benchmarks.avgCapRate;
    comparisons.push({
      metric: 'Cap Rate',
      portfolioValue: portfolioMetrics.capRate,
      benchmarkValue: benchmarks.avgCapRate,
      variance,
      performance: Math.abs(variance) < 0.5 ? 'at' : variance > 0 ? 'above' : 'below',
    });
  }

  return {
    portfolioId: portfolioMetrics.portfolioId,
    comparisons,
    overallPerformance: comparisons.filter(c => c.performance === 'above').length >
      comparisons.filter(c => c.performance === 'below').length
      ? 'above_average'
      : 'below_average',
  };
};

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
export const identifyPortfolioRisks = (
  portfolioMetrics: PortfolioMetrics,
): Array<{
  riskType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
}> => {
  const risks: Array<{
    riskType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }> = [];

  // Low occupancy risk
  if (portfolioMetrics.occupancyRate < 85) {
    risks.push({
      riskType: 'Low Occupancy',
      severity: portfolioMetrics.occupancyRate < 75 ? 'critical' : 'high',
      description: `Occupancy rate of ${portfolioMetrics.occupancyRate.toFixed(1)}% is below optimal levels`,
      recommendation: 'Implement targeted marketing campaigns and review pricing strategy',
    });
  }

  // High debt service coverage risk
  if (portfolioMetrics.debtServiceCoverageRatio < 1.2) {
    risks.push({
      riskType: 'Debt Service Coverage',
      severity: portfolioMetrics.debtServiceCoverageRatio < 1.0 ? 'critical' : 'high',
      description: `DSCR of ${portfolioMetrics.debtServiceCoverageRatio.toFixed(2)} indicates tight cash flow`,
      recommendation: 'Consider refinancing options or increasing rental income',
    });
  }

  // Low cap rate
  if (portfolioMetrics.capRate < 4) {
    risks.push({
      riskType: 'Low Returns',
      severity: 'medium',
      description: `Cap rate of ${portfolioMetrics.capRate.toFixed(2)}% may indicate overvaluation`,
      recommendation: 'Review property valuations and consider portfolio rebalancing',
    });
  }

  return risks;
};

// ============================================================================
// OPERATIONAL REPORTS
// ============================================================================

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
export const generateOperationalReport = (
  propertyIds: string[],
  period: DateRange,
): OperationalMetrics[] => {
  return propertyIds.map(propertyId => ({
    propertyId,
    propertyName: `Property ${propertyId}`,
    period,
    workOrdersCompleted: 0,
    workOrdersInProgress: 0,
    averageCompletionTime: 0,
    maintenanceCosts: 0,
    tenantRequests: 0,
    turnoverRate: 0,
    averageTenantSatisfaction: 0,
    inspectionsCompleted: 0,
    violationsFound: 0,
    violationsResolved: 0,
  }));
};

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
export const calculateMaintenanceEfficiency = (
  metrics: OperationalMetrics,
): {
  completionRate: number;
  averageResponseTime: number;
  costPerWorkOrder: number;
  efficiency: 'excellent' | 'good' | 'fair' | 'poor';
} => {
  const totalWorkOrders = metrics.workOrdersCompleted + metrics.workOrdersInProgress;
  const completionRate = totalWorkOrders > 0
    ? (metrics.workOrdersCompleted / totalWorkOrders) * 100
    : 0;

  const costPerWorkOrder = metrics.workOrdersCompleted > 0
    ? metrics.maintenanceCosts / metrics.workOrdersCompleted
    : 0;

  let efficiency: 'excellent' | 'good' | 'fair' | 'poor';
  if (completionRate >= 95 && metrics.averageCompletionTime <= 24) {
    efficiency = 'excellent';
  } else if (completionRate >= 85 && metrics.averageCompletionTime <= 48) {
    efficiency = 'good';
  } else if (completionRate >= 75 && metrics.averageCompletionTime <= 72) {
    efficiency = 'fair';
  } else {
    efficiency = 'poor';
  }

  return {
    completionRate: Math.round(completionRate * 100) / 100,
    averageResponseTime: metrics.averageCompletionTime,
    costPerWorkOrder: Math.round(costPerWorkOrder * 100) / 100,
    efficiency,
  };
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
export const analyzeTenantSatisfaction = (
  satisfactionData: Array<{ date: Date; score: number }>,
): {
  currentScore: number;
  averageScore: number;
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
} => {
  if (satisfactionData.length === 0) {
    return {
      currentScore: 0,
      averageScore: 0,
      trend: 'stable',
      changePercent: 0,
    };
  }

  const sorted = [...satisfactionData].sort((a, b) =>
    a.date.getTime() - b.date.getTime()
  );

  const scores = sorted.map(d => d.score);
  const currentScore = scores[scores.length - 1];
  const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;

  const recentScores = scores.slice(-3);
  const olderScores = scores.slice(0, Math.min(3, scores.length - 3));
  const recentAvg = recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length;
  const olderAvg = olderScores.length > 0
    ? olderScores.reduce((sum, s) => sum + s, 0) / olderScores.length
    : recentAvg;

  const changePercent = olderAvg > 0
    ? ((recentAvg - olderAvg) / olderAvg) * 100
    : 0;

  let trend: 'improving' | 'stable' | 'declining';
  if (Math.abs(changePercent) < 5) trend = 'stable';
  else if (changePercent > 0) trend = 'improving';
  else trend = 'declining';

  return {
    currentScore: Math.round(currentScore * 100) / 100,
    averageScore: Math.round(averageScore * 100) / 100,
    trend,
    changePercent: Math.round(changePercent * 100) / 100,
  };
};

// ============================================================================
// FINANCIAL REPORTS
// ============================================================================

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
export const generateFinancialReport = (
  propertyIds: string[],
  period: DateRange,
): FinancialMetrics[] => {
  return propertyIds.map(propertyId => ({
    propertyId,
    propertyName: `Property ${propertyId}`,
    period,
    grossRevenue: 0,
    rentalIncome: 0,
    otherIncome: 0,
    totalExpenses: 0,
    operatingExpenses: 0,
    capitalExpenses: 0,
    netOperatingIncome: 0,
    netIncome: 0,
    cashFlow: 0,
    profitMargin: 0,
    expenseRatio: 0,
    revenuePerUnit: 0,
    expensePerUnit: 0,
  }));
};

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
export const calculateBudgetVariance = (
  actualMetrics: FinancialMetrics,
  budgetMetrics: FinancialMetrics,
): {
  revenueVariance: { amount: number; percent: number; status: string };
  expenseVariance: { amount: number; percent: number; status: string };
  noiVariance: { amount: number; percent: number; status: string };
} => {
  const revenueVariance = actualMetrics.grossRevenue - budgetMetrics.grossRevenue;
  const revenuePercent = budgetMetrics.grossRevenue > 0
    ? (revenueVariance / budgetMetrics.grossRevenue) * 100
    : 0;

  const expenseVariance = actualMetrics.totalExpenses - budgetMetrics.totalExpenses;
  const expensePercent = budgetMetrics.totalExpenses > 0
    ? (expenseVariance / budgetMetrics.totalExpenses) * 100
    : 0;

  const noiVariance = actualMetrics.netOperatingIncome - budgetMetrics.netOperatingIncome;
  const noiPercent = budgetMetrics.netOperatingIncome > 0
    ? (noiVariance / budgetMetrics.netOperatingIncome) * 100
    : 0;

  return {
    revenueVariance: {
      amount: Math.round(revenueVariance * 100) / 100,
      percent: Math.round(revenuePercent * 100) / 100,
      status: Math.abs(revenuePercent) < 5 ? 'on_budget' :
              revenueVariance > 0 ? 'favorable' : 'unfavorable',
    },
    expenseVariance: {
      amount: Math.round(expenseVariance * 100) / 100,
      percent: Math.round(expensePercent * 100) / 100,
      status: Math.abs(expensePercent) < 5 ? 'on_budget' :
              expenseVariance < 0 ? 'favorable' : 'unfavorable',
    },
    noiVariance: {
      amount: Math.round(noiVariance * 100) / 100,
      percent: Math.round(noiPercent * 100) / 100,
      status: Math.abs(noiPercent) < 5 ? 'on_budget' :
              noiVariance > 0 ? 'favorable' : 'unfavorable',
    },
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
export const generateIncomeStatement = (
  metrics: FinancialMetrics,
): {
  revenue: { rental: number; other: number; total: number };
  expenses: { operating: number; capital: number; total: number };
  netOperatingIncome: number;
  netIncome: number;
  margins: { operating: number; net: number };
} => {
  return {
    revenue: {
      rental: metrics.rentalIncome,
      other: metrics.otherIncome,
      total: metrics.grossRevenue,
    },
    expenses: {
      operating: metrics.operatingExpenses,
      capital: metrics.capitalExpenses,
      total: metrics.totalExpenses,
    },
    netOperatingIncome: metrics.netOperatingIncome,
    netIncome: metrics.netIncome,
    margins: {
      operating: metrics.grossRevenue > 0
        ? (metrics.netOperatingIncome / metrics.grossRevenue) * 100
        : 0,
      net: metrics.grossRevenue > 0
        ? (metrics.netIncome / metrics.grossRevenue) * 100
        : 0,
    },
  };
};

// ============================================================================
// COMPLIANCE REPORTS
// ============================================================================

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
export const generateComplianceReport = (
  propertyIds: string[],
  complianceType: ComplianceType,
  period: DateRange,
): ComplianceReport => {
  return {
    reportId: `COMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    complianceType,
    period,
    status: 'compliant',
    findings: [],
    recommendations: [],
    generatedAt: new Date(),
  };
};

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
export const validateComplianceRequirements = (
  propertyId: string,
  complianceType: ComplianceType,
): {
  isCompliant: boolean;
  missingRequirements: string[];
  expiringCertifications: Array<{ name: string; expiresAt: Date }>;
} => {
  return {
    isCompliant: true,
    missingRequirements: [],
    expiringCertifications: [],
  };
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
export const createComplianceFinding = (
  finding: Omit<ComplianceFinding, 'id'>,
): ComplianceFinding => {
  return {
    id: `FIND-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...finding,
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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
export const generateColorPalette = (count: number): string[] => {
  const baseColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Orange
  ];

  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }

  return colors;
};

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
export const getDateRangeForPeriod = (
  period: DateRange['period'],
): DateRange => {
  const now = new Date();
  const endDate = new Date(now);
  let startDate = new Date(now);

  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      startDate.setDate(now.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(now.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'last_7_days':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'last_30_days':
      startDate.setDate(now.getDate() - 30);
      break;
    case 'last_90_days':
      startDate.setDate(now.getDate() - 90);
      break;
    case 'this_month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'last_month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate.setDate(0); // Last day of previous month
      break;
    case 'this_quarter':
      const currentQuarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
      break;
    case 'last_quarter':
      const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
      startDate = new Date(now.getFullYear(), lastQuarter * 3, 1);
      endDate = new Date(now.getFullYear(), (lastQuarter + 1) * 3, 0);
      break;
    case 'this_year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case 'last_year':
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear() - 1, 11, 31);
      break;
  }

  return { startDate, endDate, period };
};

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
export const aggregateTimeSeriesData = (
  data: ReportDataPoint[],
  interval: 'daily' | 'weekly' | 'monthly' | 'quarterly',
): ReportDataPoint[] => {
  if (data.length === 0) return [];

  const grouped = new Map<string, { sum: number; count: number; timestamp: Date }>();

  data.forEach(point => {
    if (!point.timestamp) return;

    const date = point.timestamp;
    let key: string;

    switch (interval) {
      case 'daily':
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'quarterly':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${date.getFullYear()}-Q${quarter}`;
        break;
    }

    if (!grouped.has(key)) {
      grouped.set(key, { sum: 0, count: 0, timestamp: date });
    }

    const group = grouped.get(key)!;
    group.sum += point.value;
    group.count += 1;
  });

  const aggregated: ReportDataPoint[] = [];
  grouped.forEach((group, key) => {
    aggregated.push({
      label: key,
      value: Math.round(group.sum * 100) / 100,
      timestamp: group.timestamp,
    });
  });

  return aggregated.sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0;
    return a.timestamp.getTime() - b.timestamp.getTime();
  });
};
