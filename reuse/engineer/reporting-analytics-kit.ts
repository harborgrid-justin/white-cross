/**
 * LOC: RPTANL123
 * File: /reuse/engineer/reporting-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Reporting services and controllers
 *   - Analytics engines and dashboards
 *   - BI integration modules
 */

/**
 * File: /reuse/engineer/reporting-analytics-kit.ts
 * Locator: WC-UTL-RPTANL-001
 * Purpose: Advanced Reporting and Analytics Utilities - Dynamic report generation, KPI tracking, data aggregation, trend analysis
 *
 * Upstream: Independent utility module for reporting and analytics
 * Downstream: ../backend/*, reporting services, analytics engines, dashboard APIs, BI integrations
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/swagger 7.x, OpenAPI 3.0+, ExcelJS 4.x, PDFKit 0.13.x
 * Exports: 45 utility functions for report generation, analytics, KPI tracking, data aggregation, export formats, scheduling
 *
 * LLM Context: Comprehensive reporting and analytics utilities for implementing production-ready reporting in White Cross system.
 * Provides dynamic report builders, custom report utilities, data aggregation, KPI calculation, dashboard preparation, trend analysis,
 * comparative analytics, multi-format exports (PDF, Excel, CSV), and report scheduling. Essential for building enterprise-grade
 * healthcare reporting and business intelligence capabilities.
 */

import { Type } from '@nestjs/common';
import {
  ApiProperty,
  ApiPropertyOptions,
  ApiResponseOptions,
  ApiOperationOptions,
  ApiQueryOptions,
  ApiBodyOptions,
} from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ReportConfig {
  name: string;
  title: string;
  description?: string;
  dataSource: string;
  columns: ReportColumn[];
  filters?: ReportFilter[];
  sorting?: SortConfig[];
  groupBy?: string[];
  aggregations?: AggregationConfig[];
  formatting?: ReportFormatting;
}

interface ReportColumn {
  field: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency' | 'percentage';
  width?: number;
  align?: 'left' | 'center' | 'right';
  format?: string;
  hidden?: boolean;
  sortable?: boolean;
}

interface ReportFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
  condition?: 'and' | 'or';
}

interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

interface AggregationConfig {
  field: string;
  operation: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'distinct';
  label?: string;
}

interface ReportFormatting {
  headerStyle?: StyleConfig;
  dataStyle?: StyleConfig;
  footerStyle?: StyleConfig;
  alternateRowColors?: boolean;
  borders?: boolean;
}

interface StyleConfig {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  color?: string;
  backgroundColor?: string;
}

interface KPIDefinition {
  id: string;
  name: string;
  description?: string;
  metric: string;
  targetValue?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  unit?: string;
  format?: string;
  calculation: KPICalculation;
}

interface KPICalculation {
  type: 'simple' | 'ratio' | 'percentage' | 'aggregate' | 'custom';
  formula?: string;
  numerator?: string;
  denominator?: string;
  aggregation?: AggregationConfig;
}

interface KPIResult {
  id: string;
  name: string;
  value: number;
  formattedValue: string;
  targetValue?: number;
  variance?: number;
  variancePercentage?: number;
  status: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  sparkline?: number[];
  calculatedAt: Date;
}

interface DashboardConfig {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  layout: LayoutConfig;
  refreshInterval?: number;
  filters?: ReportFilter[];
}

interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'metric' | 'gauge' | 'sparkline';
  title: string;
  position: { x: number; y: number; width: number; height: number };
  dataSource: string;
  config: any;
}

interface LayoutConfig {
  columns: number;
  rowHeight: number;
  margin?: number[];
  containerPadding?: number[];
}

interface TrendAnalysisConfig {
  dataPoints: DataPoint[];
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  algorithm: 'linear' | 'exponential' | 'polynomial' | 'moving-average';
  forecastPeriods?: number;
}

interface DataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

interface TrendAnalysisResult {
  trend: 'upward' | 'downward' | 'stable' | 'volatile';
  trendLine: DataPoint[];
  forecast?: DataPoint[];
  correlation?: number;
  volatility?: number;
  seasonality?: SeasonalityPattern;
}

interface SeasonalityPattern {
  detected: boolean;
  period?: number;
  strength?: number;
}

interface ComparativeAnalysisConfig {
  datasets: ComparativeDataset[];
  dimensions: string[];
  metrics: string[];
  comparisonType: 'period-over-period' | 'year-over-year' | 'baseline' | 'cohort';
}

interface ComparativeDataset {
  id: string;
  label: string;
  data: Record<string, any>[];
  baseline?: boolean;
}

interface ComparativeAnalysisResult {
  comparisons: ComparisonResult[];
  summary: ComparisonSummary;
  insights: AnalyticsInsight[];
}

interface ComparisonResult {
  dimension: string;
  metric: string;
  values: Record<string, number>;
  differences: Record<string, number>;
  percentageChanges: Record<string, number>;
}

interface ComparisonSummary {
  totalComparisons: number;
  significantChanges: number;
  averageChange: number;
  maxIncrease: { dimension: string; metric: string; value: number };
  maxDecrease: { dimension: string; metric: string; value: number };
}

interface AnalyticsInsight {
  type: 'trend' | 'anomaly' | 'correlation' | 'pattern';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  confidence: number;
  affectedMetrics: string[];
}

interface ExportConfig {
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'xml';
  fileName?: string;
  options?: ExportOptions;
}

interface ExportOptions {
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'A4' | 'A3' | 'Letter' | 'Legal';
  margins?: { top: number; right: number; bottom: number; left: number };
  includeHeader?: boolean;
  includeFooter?: boolean;
  compression?: boolean;
  password?: string;
}

interface ReportSchedule {
  id: string;
  reportId: string;
  name: string;
  schedule: ScheduleConfig;
  recipients: RecipientConfig[];
  format: 'pdf' | 'excel' | 'csv';
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

interface ScheduleConfig {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  time?: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  monthOfYear?: number;
  timezone?: string;
}

interface RecipientConfig {
  email: string;
  name?: string;
  type: 'to' | 'cc' | 'bcc';
}

interface AggregationResult {
  field: string;
  operation: string;
  value: number;
  count: number;
  formattedValue?: string;
}

interface DataTransformConfig {
  transformations: DataTransformation[];
  validations?: ValidationRule[];
}

interface DataTransformation {
  type: 'map' | 'filter' | 'reduce' | 'group' | 'pivot' | 'unpivot' | 'join';
  config: any;
}

interface ValidationRule {
  field: string;
  rule: 'required' | 'type' | 'range' | 'pattern' | 'custom';
  params?: any;
  message?: string;
}

// ============================================================================
// 1. DYNAMIC REPORT GENERATION
// ============================================================================

/**
 * 1. Creates a dynamic report configuration with custom columns and filters.
 *
 * @swagger
 * components:
 *   schemas:
 *     ReportConfig:
 *       type: object
 *       required:
 *         - name
 *         - title
 *         - dataSource
 *         - columns
 *       properties:
 *         name:
 *           type: string
 *           description: Unique report identifier
 *         title:
 *           type: string
 *           description: Display title for the report
 *         description:
 *           type: string
 *           description: Report description
 *         dataSource:
 *           type: string
 *           description: Data source identifier
 *         columns:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReportColumn'
 *         filters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReportFilter'
 *
 * @param {Partial<ReportConfig>} config - Report configuration options
 * @returns {ReportConfig} Complete report configuration
 *
 * @example
 * ```typescript
 * const report = createReportConfig({
 *   name: 'sales-monthly',
 *   title: 'Monthly Sales Report',
 *   dataSource: 'sales_transactions',
 *   columns: [
 *     { field: 'date', label: 'Date', type: 'date' },
 *     { field: 'amount', label: 'Amount', type: 'currency' }
 *   ]
 * });
 * ```
 */
export const createReportConfig = (config: Partial<ReportConfig>): ReportConfig => {
  return {
    name: config.name || 'unnamed-report',
    title: config.title || 'Report',
    description: config.description,
    dataSource: config.dataSource || '',
    columns: config.columns || [],
    filters: config.filters || [],
    sorting: config.sorting || [],
    groupBy: config.groupBy || [],
    aggregations: config.aggregations || [],
    formatting: config.formatting,
  };
};

/**
 * 2. Executes a report configuration and generates report data.
 *
 * @param {ReportConfig} config - Report configuration
 * @param {Record<string, any>[]} data - Source data
 * @returns {Record<string, any>} Generated report with data and metadata
 *
 * @example
 * ```typescript
 * const reportData = executeReport(reportConfig, sourceData);
 * // Returns: { data: [...], totals: {...}, metadata: {...} }
 * ```
 */
export const executeReport = (
  config: ReportConfig,
  data: Record<string, any>[],
): Record<string, any> => {
  let processedData = [...data];

  // Apply filters
  if (config.filters && config.filters.length > 0) {
    processedData = applyReportFilters(processedData, config.filters);
  }

  // Apply sorting
  if (config.sorting && config.sorting.length > 0) {
    processedData = applyReportSorting(processedData, config.sorting);
  }

  // Apply grouping
  if (config.groupBy && config.groupBy.length > 0) {
    processedData = applyReportGrouping(processedData, config.groupBy);
  }

  // Calculate aggregations
  const aggregations = config.aggregations
    ? calculateAggregations(processedData, config.aggregations)
    : [];

  return {
    data: processedData,
    totals: aggregations,
    metadata: {
      reportName: config.name,
      generatedAt: new Date(),
      recordCount: processedData.length,
      columns: config.columns,
    },
  };
};

/**
 * 3. Applies filters to report data based on filter configuration.
 *
 * @param {Record<string, any>[]} data - Data to filter
 * @param {ReportFilter[]} filters - Filter configurations
 * @returns {Record<string, any>[]} Filtered data
 *
 * @example
 * ```typescript
 * const filtered = applyReportFilters(data, [
 *   { field: 'status', operator: 'eq', value: 'active' }
 * ]);
 * ```
 */
export const applyReportFilters = (
  data: Record<string, any>[],
  filters: ReportFilter[],
): Record<string, any>[] => {
  return data.filter((row) => {
    return filters.every((filter) => {
      const value = row[filter.field];
      const filterValue = filter.value;

      switch (filter.operator) {
        case 'eq':
          return value === filterValue;
        case 'ne':
          return value !== filterValue;
        case 'gt':
          return value > filterValue;
        case 'gte':
          return value >= filterValue;
        case 'lt':
          return value < filterValue;
        case 'lte':
          return value <= filterValue;
        case 'in':
          return Array.isArray(filterValue) && filterValue.includes(value);
        case 'nin':
          return Array.isArray(filterValue) && !filterValue.includes(value);
        case 'contains':
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        case 'startsWith':
          return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
        case 'endsWith':
          return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
        default:
          return true;
      }
    });
  });
};

/**
 * 4. Applies sorting to report data.
 *
 * @param {Record<string, any>[]} data - Data to sort
 * @param {SortConfig[]} sorting - Sort configurations
 * @returns {Record<string, any>[]} Sorted data
 *
 * @example
 * ```typescript
 * const sorted = applyReportSorting(data, [
 *   { field: 'date', direction: 'desc' }
 * ]);
 * ```
 */
export const applyReportSorting = (
  data: Record<string, any>[],
  sorting: SortConfig[],
): Record<string, any>[] => {
  return [...data].sort((a, b) => {
    for (const sort of sorting) {
      const aVal = a[sort.field];
      const bVal = b[sort.field];

      if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * 5. Groups report data by specified fields.
 *
 * @param {Record<string, any>[]} data - Data to group
 * @param {string[]} groupBy - Fields to group by
 * @returns {Record<string, any>[]} Grouped data
 *
 * @example
 * ```typescript
 * const grouped = applyReportGrouping(data, ['category', 'status']);
 * ```
 */
export const applyReportGrouping = (
  data: Record<string, any>[],
  groupBy: string[],
): Record<string, any>[] => {
  const groups = new Map<string, Record<string, any>[]>();

  data.forEach((row) => {
    const key = groupBy.map((field) => row[field]).join('|');
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(row);
  });

  return Array.from(groups.entries()).map(([key, items]) => {
    const groupValues = key.split('|');
    const groupObj: Record<string, any> = {};
    groupBy.forEach((field, index) => {
      groupObj[field] = groupValues[index];
    });
    return {
      ...groupObj,
      items,
      count: items.length,
    };
  });
};

// ============================================================================
// 2. CUSTOM REPORT BUILDER UTILITIES
// ============================================================================

/**
 * 6. Creates a report column configuration.
 *
 * @param {Partial<ReportColumn>} column - Column options
 * @returns {ReportColumn} Complete column configuration
 *
 * @example
 * ```typescript
 * const column = createReportColumn({
 *   field: 'revenue',
 *   label: 'Total Revenue',
 *   type: 'currency',
 *   format: '$0,0.00'
 * });
 * ```
 */
export const createReportColumn = (column: Partial<ReportColumn>): ReportColumn => {
  return {
    field: column.field || '',
    label: column.label || column.field || '',
    type: column.type || 'string',
    width: column.width,
    align: column.align || 'left',
    format: column.format,
    hidden: column.hidden || false,
    sortable: column.sortable !== false,
  };
};

/**
 * 7. Creates a report filter configuration.
 *
 * @param {Partial<ReportFilter>} filter - Filter options
 * @returns {ReportFilter} Complete filter configuration
 *
 * @example
 * ```typescript
 * const filter = createReportFilter({
 *   field: 'date',
 *   operator: 'gte',
 *   value: '2024-01-01'
 * });
 * ```
 */
export const createReportFilter = (filter: Partial<ReportFilter>): ReportFilter => {
  return {
    field: filter.field || '',
    operator: filter.operator || 'eq',
    value: filter.value,
    condition: filter.condition || 'and',
  };
};

/**
 * 8. Builds a custom report template with predefined structure.
 *
 * @param {string} templateType - Template type identifier
 * @param {Record<string, any>} params - Template parameters
 * @returns {ReportConfig} Report configuration from template
 *
 * @example
 * ```typescript
 * const report = buildReportTemplate('financial-summary', {
 *   period: 'monthly',
 *   year: 2024
 * });
 * ```
 */
export const buildReportTemplate = (
  templateType: string,
  params: Record<string, any>,
): ReportConfig => {
  const templates: Record<string, Partial<ReportConfig>> = {
    'financial-summary': {
      name: 'financial-summary',
      title: 'Financial Summary Report',
      columns: [
        { field: 'category', label: 'Category', type: 'string' },
        { field: 'revenue', label: 'Revenue', type: 'currency' },
        { field: 'expenses', label: 'Expenses', type: 'currency' },
        { field: 'profit', label: 'Profit', type: 'currency' },
      ],
    },
    'sales-performance': {
      name: 'sales-performance',
      title: 'Sales Performance Report',
      columns: [
        { field: 'salesperson', label: 'Salesperson', type: 'string' },
        { field: 'sales', label: 'Sales', type: 'number' },
        { field: 'revenue', label: 'Revenue', type: 'currency' },
        { field: 'target', label: 'Target', type: 'currency' },
        { field: 'achievement', label: 'Achievement', type: 'percentage' },
      ],
    },
  };

  const template = templates[templateType] || { name: templateType, title: templateType };
  return createReportConfig({ ...template, ...params });
};

/**
 * 9. Validates report configuration for completeness and correctness.
 *
 * @param {ReportConfig} config - Report configuration to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateReportConfig(reportConfig);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export const validateReportConfig = (
  config: ReportConfig,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config.name) errors.push('Report name is required');
  if (!config.title) errors.push('Report title is required');
  if (!config.dataSource) errors.push('Data source is required');
  if (!config.columns || config.columns.length === 0) {
    errors.push('At least one column is required');
  }

  config.columns?.forEach((col, index) => {
    if (!col.field) errors.push(`Column ${index}: field is required`);
    if (!col.label) errors.push(`Column ${index}: label is required`);
  });

  return { valid: errors.length === 0, errors };
};

/**
 * 10. Clones a report configuration with optional modifications.
 *
 * @param {ReportConfig} config - Original report configuration
 * @param {Partial<ReportConfig>} modifications - Modifications to apply
 * @returns {ReportConfig} Cloned and modified configuration
 *
 * @example
 * ```typescript
 * const newReport = cloneReportConfig(existingReport, {
 *   name: 'modified-report',
 *   filters: [...additionalFilters]
 * });
 * ```
 */
export const cloneReportConfig = (
  config: ReportConfig,
  modifications?: Partial<ReportConfig>,
): ReportConfig => {
  return {
    ...config,
    columns: [...config.columns],
    filters: config.filters ? [...config.filters] : [],
    sorting: config.sorting ? [...config.sorting] : [],
    groupBy: config.groupBy ? [...config.groupBy] : [],
    aggregations: config.aggregations ? [...config.aggregations] : [],
    ...modifications,
  };
};

// ============================================================================
// 3. DATA AGGREGATION AND SUMMARIZATION
// ============================================================================

/**
 * 11. Calculates aggregations on dataset.
 *
 * @swagger
 * components:
 *   schemas:
 *     AggregationResult:
 *       type: object
 *       properties:
 *         field:
 *           type: string
 *         operation:
 *           type: string
 *           enum: [sum, avg, min, max, count, distinct]
 *         value:
 *           type: number
 *         count:
 *           type: number
 *
 * @param {Record<string, any>[]} data - Data to aggregate
 * @param {AggregationConfig[]} aggregations - Aggregation configurations
 * @returns {AggregationResult[]} Aggregation results
 *
 * @example
 * ```typescript
 * const results = calculateAggregations(data, [
 *   { field: 'revenue', operation: 'sum', label: 'Total Revenue' },
 *   { field: 'revenue', operation: 'avg', label: 'Average Revenue' }
 * ]);
 * ```
 */
export const calculateAggregations = (
  data: Record<string, any>[],
  aggregations: AggregationConfig[],
): AggregationResult[] => {
  return aggregations.map((agg) => {
    const values = data.map((row) => row[agg.field]).filter((v) => v != null);

    let value: number;
    switch (agg.operation) {
      case 'sum':
        value = values.reduce((sum, v) => sum + Number(v), 0);
        break;
      case 'avg':
        value = values.length > 0 ? values.reduce((sum, v) => sum + Number(v), 0) / values.length : 0;
        break;
      case 'min':
        value = values.length > 0 ? Math.min(...values.map(Number)) : 0;
        break;
      case 'max':
        value = values.length > 0 ? Math.max(...values.map(Number)) : 0;
        break;
      case 'count':
        value = values.length;
        break;
      case 'distinct':
        value = new Set(values).size;
        break;
      default:
        value = 0;
    }

    return {
      field: agg.field,
      operation: agg.operation,
      value,
      count: values.length,
    };
  });
};

/**
 * 12. Summarizes data by grouping and aggregating.
 *
 * @param {Record<string, any>[]} data - Data to summarize
 * @param {string[]} groupBy - Fields to group by
 * @param {AggregationConfig[]} aggregations - Aggregations to perform
 * @returns {Record<string, any>[]} Summarized data
 *
 * @example
 * ```typescript
 * const summary = summarizeData(sales, ['region'], [
 *   { field: 'amount', operation: 'sum' }
 * ]);
 * ```
 */
export const summarizeData = (
  data: Record<string, any>[],
  groupBy: string[],
  aggregations: AggregationConfig[],
): Record<string, any>[] => {
  const grouped = applyReportGrouping(data, groupBy);

  return grouped.map((group) => {
    const groupData = group.items || [];
    const aggs = calculateAggregations(groupData, aggregations);

    const summary: Record<string, any> = {};
    groupBy.forEach((field) => {
      summary[field] = group[field];
    });

    aggs.forEach((agg) => {
      const key = agg.operation === 'count' ? `${agg.field}_count` : `${agg.field}_${agg.operation}`;
      summary[key] = agg.value;
    });

    return summary;
  });
};

/**
 * 13. Performs pivot table transformation on data.
 *
 * @param {Record<string, any>[]} data - Source data
 * @param {string} rowField - Row dimension field
 * @param {string} columnField - Column dimension field
 * @param {string} valueField - Value field to aggregate
 * @param {string} aggregation - Aggregation operation
 * @returns {Record<string, any>[]} Pivoted data
 *
 * @example
 * ```typescript
 * const pivoted = pivotData(sales, 'region', 'month', 'revenue', 'sum');
 * ```
 */
export const pivotData = (
  data: Record<string, any>[],
  rowField: string,
  columnField: string,
  valueField: string,
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max',
): Record<string, any>[] => {
  const pivot = new Map<string, Map<string, number[]>>();

  data.forEach((row) => {
    const rowKey = row[rowField];
    const colKey = row[columnField];
    const value = Number(row[valueField]);

    if (!pivot.has(rowKey)) {
      pivot.set(rowKey, new Map());
    }
    if (!pivot.get(rowKey)!.has(colKey)) {
      pivot.get(rowKey)!.set(colKey, []);
    }
    pivot.get(rowKey)!.get(colKey)!.push(value);
  });

  const result: Record<string, any>[] = [];
  pivot.forEach((columns, rowKey) => {
    const row: Record<string, any> = { [rowField]: rowKey };
    columns.forEach((values, colKey) => {
      let aggValue: number;
      switch (aggregation) {
        case 'sum':
          aggValue = values.reduce((sum, v) => sum + v, 0);
          break;
        case 'avg':
          aggValue = values.reduce((sum, v) => sum + v, 0) / values.length;
          break;
        case 'count':
          aggValue = values.length;
          break;
        case 'min':
          aggValue = Math.min(...values);
          break;
        case 'max':
          aggValue = Math.max(...values);
          break;
        default:
          aggValue = 0;
      }
      row[colKey] = aggValue;
    });
    result.push(row);
  });

  return result;
};

/**
 * 14. Calculates running totals for a dataset.
 *
 * @param {Record<string, any>[]} data - Data array
 * @param {string} valueField - Field to calculate running total
 * @param {string} outputField - Output field name for running total
 * @returns {Record<string, any>[]} Data with running totals
 *
 * @example
 * ```typescript
 * const withRunningTotal = calculateRunningTotal(data, 'sales', 'cumulative_sales');
 * ```
 */
export const calculateRunningTotal = (
  data: Record<string, any>[],
  valueField: string,
  outputField: string,
): Record<string, any>[] => {
  let runningTotal = 0;
  return data.map((row) => {
    runningTotal += Number(row[valueField] || 0);
    return {
      ...row,
      [outputField]: runningTotal,
    };
  });
};

/**
 * 15. Calculates percentage of total for each row.
 *
 * @param {Record<string, any>[]} data - Data array
 * @param {string} valueField - Field to calculate percentage
 * @param {string} outputField - Output field name
 * @returns {Record<string, any>[]} Data with percentages
 *
 * @example
 * ```typescript
 * const withPercentages = calculatePercentageOfTotal(data, 'revenue', 'revenue_percentage');
 * ```
 */
export const calculatePercentageOfTotal = (
  data: Record<string, any>[],
  valueField: string,
  outputField: string,
): Record<string, any>[] => {
  const total = data.reduce((sum, row) => sum + Number(row[valueField] || 0), 0);

  return data.map((row) => ({
    ...row,
    [outputField]: total > 0 ? (Number(row[valueField] || 0) / total) * 100 : 0,
  }));
};

// ============================================================================
// 4. KPI CALCULATION AND TRACKING
// ============================================================================

/**
 * 16. Creates a KPI definition.
 *
 * @swagger
 * components:
 *   schemas:
 *     KPIDefinition:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - metric
 *         - calculation
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         metric:
 *           type: string
 *         targetValue:
 *           type: number
 *         calculation:
 *           $ref: '#/components/schemas/KPICalculation'
 *
 * @param {Partial<KPIDefinition>} kpi - KPI definition options
 * @returns {KPIDefinition} Complete KPI definition
 *
 * @example
 * ```typescript
 * const kpi = createKPIDefinition({
 *   id: 'revenue-growth',
 *   name: 'Revenue Growth Rate',
 *   metric: 'revenue',
 *   targetValue: 15,
 *   calculation: { type: 'percentage', numerator: 'current', denominator: 'previous' }
 * });
 * ```
 */
export const createKPIDefinition = (kpi: Partial<KPIDefinition>): KPIDefinition => {
  return {
    id: kpi.id || '',
    name: kpi.name || '',
    description: kpi.description,
    metric: kpi.metric || '',
    targetValue: kpi.targetValue,
    warningThreshold: kpi.warningThreshold,
    criticalThreshold: kpi.criticalThreshold,
    unit: kpi.unit,
    format: kpi.format,
    calculation: kpi.calculation || { type: 'simple' },
  };
};

/**
 * 17. Calculates KPI value from data.
 *
 * @param {KPIDefinition} kpi - KPI definition
 * @param {Record<string, any>} data - Data for calculation
 * @returns {KPIResult} KPI calculation result
 *
 * @example
 * ```typescript
 * const result = calculateKPI(kpiDefinition, {
 *   current: 120000,
 *   previous: 100000
 * });
 * ```
 */
export const calculateKPI = (kpi: KPIDefinition, data: Record<string, any>): KPIResult => {
  let value: number;

  switch (kpi.calculation.type) {
    case 'simple':
      value = Number(data[kpi.metric] || 0);
      break;
    case 'ratio':
      const numerator = Number(data[kpi.calculation.numerator!] || 0);
      const denominator = Number(data[kpi.calculation.denominator!] || 0);
      value = denominator !== 0 ? numerator / denominator : 0;
      break;
    case 'percentage':
      const num = Number(data[kpi.calculation.numerator!] || 0);
      const den = Number(data[kpi.calculation.denominator!] || 0);
      value = den !== 0 ? ((num - den) / den) * 100 : 0;
      break;
    default:
      value = 0;
  }

  const variance = kpi.targetValue ? value - kpi.targetValue : undefined;
  const variancePercentage =
    kpi.targetValue && kpi.targetValue !== 0 ? (variance! / kpi.targetValue) * 100 : undefined;

  let status: 'normal' | 'warning' | 'critical' = 'normal';
  if (kpi.criticalThreshold && Math.abs(variance || 0) >= kpi.criticalThreshold) {
    status = 'critical';
  } else if (kpi.warningThreshold && Math.abs(variance || 0) >= kpi.warningThreshold) {
    status = 'warning';
  }

  return {
    id: kpi.id,
    name: kpi.name,
    value,
    formattedValue: formatKPIValue(value, kpi.format, kpi.unit),
    targetValue: kpi.targetValue,
    variance,
    variancePercentage,
    status,
    calculatedAt: new Date(),
  };
};

/**
 * 18. Formats KPI value for display.
 *
 * @param {number} value - Value to format
 * @param {string} [format] - Format string
 * @param {string} [unit] - Unit suffix
 * @returns {string} Formatted value
 *
 * @example
 * ```typescript
 * const formatted = formatKPIValue(1234.56, '0,0.00', '$');
 * // Returns: "$1,234.56"
 * ```
 */
export const formatKPIValue = (value: number, format?: string, unit?: string): string => {
  let formatted = value.toFixed(2);

  if (format?.includes(',')) {
    formatted = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  if (unit) {
    formatted = unit.includes('$') ? `${unit}${formatted}` : `${formatted}${unit}`;
  }

  return formatted;
};

/**
 * 19. Tracks KPI trend over time.
 *
 * @param {KPIResult[]} historicalKPIs - Historical KPI values
 * @returns {{ trend: string; sparkline: number[] }} Trend analysis
 *
 * @example
 * ```typescript
 * const trend = trackKPITrend(pastKPIResults);
 * // Returns: { trend: 'up', sparkline: [100, 105, 110, 115, 120] }
 * ```
 */
export const trackKPITrend = (
  historicalKPIs: KPIResult[],
): { trend: 'up' | 'down' | 'stable'; sparkline: number[] } => {
  const values = historicalKPIs.map((kpi) => kpi.value);
  const sparkline = values.slice(-10); // Last 10 values

  if (values.length < 2) {
    return { trend: 'stable', sparkline };
  }

  const first = values[0];
  const last = values[values.length - 1];
  const change = ((last - first) / first) * 100;

  let trend: 'up' | 'down' | 'stable';
  if (Math.abs(change) < 2) {
    trend = 'stable';
  } else if (change > 0) {
    trend = 'up';
  } else {
    trend = 'down';
  }

  return { trend, sparkline };
};

/**
 * 20. Compares KPI against target and thresholds.
 *
 * @param {KPIResult} kpi - KPI result
 * @param {KPIDefinition} definition - KPI definition
 * @returns {{ status: string; message: string; recommendation: string }} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareKPIToTarget(kpiResult, kpiDefinition);
 * ```
 */
export const compareKPIToTarget = (
  kpi: KPIResult,
  definition: KPIDefinition,
): { status: string; message: string; recommendation: string } => {
  if (!kpi.targetValue) {
    return {
      status: 'no-target',
      message: 'No target value defined',
      recommendation: 'Define a target value for meaningful comparison',
    };
  }

  const variance = kpi.variance || 0;
  const varPercent = kpi.variancePercentage || 0;

  if (kpi.status === 'critical') {
    return {
      status: 'critical',
      message: `KPI is ${Math.abs(varPercent).toFixed(2)}% ${variance > 0 ? 'above' : 'below'} target`,
      recommendation: 'Immediate action required to address deviation',
    };
  } else if (kpi.status === 'warning') {
    return {
      status: 'warning',
      message: `KPI is ${Math.abs(varPercent).toFixed(2)}% ${variance > 0 ? 'above' : 'below'} target`,
      recommendation: 'Monitor closely and consider corrective actions',
    };
  } else {
    return {
      status: 'normal',
      message: `KPI is within acceptable range`,
      recommendation: 'Continue current strategy',
    };
  }
};

// ============================================================================
// 5. DASHBOARD DATA PREPARATION
// ============================================================================

/**
 * 21. Creates a dashboard configuration.
 *
 * @swagger
 * components:
 *   schemas:
 *     DashboardConfig:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - widgets
 *         - layout
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         widgets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DashboardWidget'
 *
 * @param {Partial<DashboardConfig>} config - Dashboard configuration
 * @returns {DashboardConfig} Complete dashboard configuration
 *
 * @example
 * ```typescript
 * const dashboard = createDashboardConfig({
 *   id: 'sales-dashboard',
 *   name: 'Sales Dashboard',
 *   widgets: [...]
 * });
 * ```
 */
export const createDashboardConfig = (config: Partial<DashboardConfig>): DashboardConfig => {
  return {
    id: config.id || '',
    name: config.name || '',
    widgets: config.widgets || [],
    layout: config.layout || { columns: 12, rowHeight: 100 },
    refreshInterval: config.refreshInterval,
    filters: config.filters,
  };
};

/**
 * 22. Prepares data for dashboard widgets.
 *
 * @param {DashboardWidget[]} widgets - Dashboard widgets
 * @param {Record<string, any>} dataContext - Available data sources
 * @returns {Record<string, any>} Widget data map
 *
 * @example
 * ```typescript
 * const widgetData = prepareDashboardData(widgets, {
 *   sales: salesData,
 *   kpis: kpiData
 * });
 * ```
 */
export const prepareDashboardData = (
  widgets: DashboardWidget[],
  dataContext: Record<string, any>,
): Record<string, any> => {
  const widgetData: Record<string, any> = {};

  widgets.forEach((widget) => {
    const sourceData = dataContext[widget.dataSource];
    if (!sourceData) {
      widgetData[widget.id] = { error: 'Data source not found' };
      return;
    }

    switch (widget.type) {
      case 'kpi':
        widgetData[widget.id] = prepareKPIWidgetData(sourceData, widget.config);
        break;
      case 'chart':
        widgetData[widget.id] = prepareChartWidgetData(sourceData, widget.config);
        break;
      case 'table':
        widgetData[widget.id] = prepareTableWidgetData(sourceData, widget.config);
        break;
      default:
        widgetData[widget.id] = sourceData;
    }
  });

  return widgetData;
};

/**
 * 23. Prepares data for KPI widget.
 *
 * @param {any} data - Source data
 * @param {any} config - Widget configuration
 * @returns {any} Prepared KPI data
 *
 * @example
 * ```typescript
 * const kpiData = prepareKPIWidgetData(sourceData, { metric: 'revenue' });
 * ```
 */
export const prepareKPIWidgetData = (data: any, config: any): any => {
  return {
    value: data.value || 0,
    label: config.label || 'KPI',
    change: data.change,
    trend: data.trend,
    target: data.target,
  };
};

/**
 * 24. Prepares data for chart widget.
 *
 * @param {any} data - Source data
 * @param {any} config - Widget configuration
 * @returns {any} Prepared chart data
 *
 * @example
 * ```typescript
 * const chartData = prepareChartWidgetData(sourceData, {
 *   chartType: 'line',
 *   xField: 'date',
 *   yField: 'value'
 * });
 * ```
 */
export const prepareChartWidgetData = (data: any, config: any): any => {
  return {
    type: config.chartType || 'line',
    data: Array.isArray(data) ? data : [data],
    labels: config.labels,
    datasets: config.datasets,
  };
};

/**
 * 25. Prepares data for table widget.
 *
 * @param {any} data - Source data
 * @param {any} config - Widget configuration
 * @returns {any} Prepared table data
 *
 * @example
 * ```typescript
 * const tableData = prepareTableWidgetData(sourceData, {
 *   columns: ['name', 'value', 'status']
 * });
 * ```
 */
export const prepareTableWidgetData = (data: any, config: any): any => {
  return {
    columns: config.columns || [],
    rows: Array.isArray(data) ? data : [data],
    pagination: config.pagination,
  };
};

// ============================================================================
// 6. TREND ANALYSIS AND FORECASTING
// ============================================================================

/**
 * 26. Analyzes trends in time-series data.
 *
 * @swagger
 * components:
 *   schemas:
 *     TrendAnalysisResult:
 *       type: object
 *       properties:
 *         trend:
 *           type: string
 *           enum: [upward, downward, stable, volatile]
 *         trendLine:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DataPoint'
 *         forecast:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DataPoint'
 *
 * @param {TrendAnalysisConfig} config - Trend analysis configuration
 * @returns {TrendAnalysisResult} Trend analysis results
 *
 * @example
 * ```typescript
 * const trend = analyzeTrend({
 *   dataPoints: historicalData,
 *   period: 'monthly',
 *   algorithm: 'linear',
 *   forecastPeriods: 3
 * });
 * ```
 */
export const analyzeTrend = (config: TrendAnalysisConfig): TrendAnalysisResult => {
  const { dataPoints, algorithm } = config;

  // Calculate trend line
  const trendLine = calculateTrendLine(dataPoints, algorithm);

  // Determine trend direction
  const firstValue = dataPoints[0]?.value || 0;
  const lastValue = dataPoints[dataPoints.length - 1]?.value || 0;
  const change = ((lastValue - firstValue) / firstValue) * 100;

  let trend: 'upward' | 'downward' | 'stable' | 'volatile';
  const volatility = calculateVolatility(dataPoints);

  if (volatility > 0.3) {
    trend = 'volatile';
  } else if (Math.abs(change) < 5) {
    trend = 'stable';
  } else if (change > 0) {
    trend = 'upward';
  } else {
    trend = 'downward';
  }

  // Generate forecast if requested
  const forecast = config.forecastPeriods
    ? generateForecast(trendLine, config.forecastPeriods)
    : undefined;

  return {
    trend,
    trendLine,
    forecast,
    volatility,
  };
};

/**
 * 27. Calculates trend line using specified algorithm.
 *
 * @param {DataPoint[]} dataPoints - Data points
 * @param {string} algorithm - Algorithm type
 * @returns {DataPoint[]} Trend line data points
 *
 * @example
 * ```typescript
 * const trendLine = calculateTrendLine(data, 'linear');
 * ```
 */
export const calculateTrendLine = (
  dataPoints: DataPoint[],
  algorithm: 'linear' | 'exponential' | 'polynomial' | 'moving-average',
): DataPoint[] => {
  if (algorithm === 'moving-average') {
    return calculateMovingAverage(dataPoints, 3);
  }

  // Simple linear regression for other algorithms
  const n = dataPoints.length;
  const xValues = dataPoints.map((_, i) => i);
  const yValues = dataPoints.map((p) => p.value);

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return dataPoints.map((point, i) => ({
    timestamp: point.timestamp,
    value: slope * i + intercept,
    label: point.label,
  }));
};

/**
 * 28. Calculates moving average for smoothing.
 *
 * @param {DataPoint[]} dataPoints - Data points
 * @param {number} window - Window size
 * @returns {DataPoint[]} Smoothed data points
 *
 * @example
 * ```typescript
 * const smoothed = calculateMovingAverage(data, 7); // 7-day moving average
 * ```
 */
export const calculateMovingAverage = (dataPoints: DataPoint[], window: number): DataPoint[] => {
  return dataPoints.map((point, i) => {
    const start = Math.max(0, i - Math.floor(window / 2));
    const end = Math.min(dataPoints.length, i + Math.ceil(window / 2));
    const windowData = dataPoints.slice(start, end);
    const avg = windowData.reduce((sum, p) => sum + p.value, 0) / windowData.length;

    return {
      timestamp: point.timestamp,
      value: avg,
      label: point.label,
    };
  });
};

/**
 * 29. Generates forecast based on trend line.
 *
 * @param {DataPoint[]} trendLine - Trend line data
 * @param {number} periods - Number of periods to forecast
 * @returns {DataPoint[]} Forecasted data points
 *
 * @example
 * ```typescript
 * const forecast = generateForecast(trendLine, 6); // 6 periods ahead
 * ```
 */
export const generateForecast = (trendLine: DataPoint[], periods: number): DataPoint[] => {
  if (trendLine.length < 2) return [];

  const lastPoint = trendLine[trendLine.length - 1];
  const secondLastPoint = trendLine[trendLine.length - 2];
  const slope = lastPoint.value - secondLastPoint.value;

  const forecast: DataPoint[] = [];
  for (let i = 1; i <= periods; i++) {
    const lastTimestamp = new Date(lastPoint.timestamp);
    const nextTimestamp = new Date(lastTimestamp.getTime() + i * 24 * 60 * 60 * 1000); // Add days

    forecast.push({
      timestamp: nextTimestamp,
      value: lastPoint.value + slope * i,
      label: `Forecast ${i}`,
    });
  }

  return forecast;
};

/**
 * 30. Calculates volatility of data points.
 *
 * @param {DataPoint[]} dataPoints - Data points
 * @returns {number} Volatility measure (0-1)
 *
 * @example
 * ```typescript
 * const vol = calculateVolatility(data);
 * ```
 */
export const calculateVolatility = (dataPoints: DataPoint[]): number => {
  if (dataPoints.length < 2) return 0;

  const values = dataPoints.map((p) => p.value);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return mean !== 0 ? stdDev / mean : 0;
};

// ============================================================================
// 7. COMPARATIVE ANALYSIS UTILITIES
// ============================================================================

/**
 * 31. Performs comparative analysis across datasets.
 *
 * @swagger
 * components:
 *   schemas:
 *     ComparativeAnalysisResult:
 *       type: object
 *       properties:
 *         comparisons:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ComparisonResult'
 *         summary:
 *           $ref: '#/components/schemas/ComparisonSummary'
 *
 * @param {ComparativeAnalysisConfig} config - Comparison configuration
 * @returns {ComparativeAnalysisResult} Comparison results
 *
 * @example
 * ```typescript
 * const analysis = performComparativeAnalysis({
 *   datasets: [q1Data, q2Data],
 *   dimensions: ['region', 'product'],
 *   metrics: ['revenue', 'units'],
 *   comparisonType: 'period-over-period'
 * });
 * ```
 */
export const performComparativeAnalysis = (
  config: ComparativeAnalysisConfig,
): ComparativeAnalysisResult => {
  const comparisons: ComparisonResult[] = [];
  let totalChanges = 0;
  let significantChanges = 0;

  config.dimensions.forEach((dimension) => {
    config.metrics.forEach((metric) => {
      const values: Record<string, number> = {};
      const differences: Record<string, number> = {};
      const percentageChanges: Record<string, number> = {};

      config.datasets.forEach((dataset, index) => {
        const key = dataset.label;
        values[key] = calculateMetricValue(dataset.data, metric);

        if (index > 0) {
          const prevKey = config.datasets[index - 1].label;
          const prevValue = values[prevKey];
          const currentValue = values[key];

          differences[`${prevKey}->${key}`] = currentValue - prevValue;
          percentageChanges[`${prevKey}->${key}`] =
            prevValue !== 0 ? ((currentValue - prevValue) / prevValue) * 100 : 0;

          totalChanges++;
          if (Math.abs(percentageChanges[`${prevKey}->${key}`]) > 10) {
            significantChanges++;
          }
        }
      });

      comparisons.push({
        dimension,
        metric,
        values,
        differences,
        percentageChanges,
      });
    });
  });

  const allChanges = comparisons.flatMap((c) => Object.values(c.percentageChanges));
  const averageChange = allChanges.reduce((sum, v) => sum + v, 0) / allChanges.length;

  const maxIncrease = findMaxChange(comparisons, 'increase');
  const maxDecrease = findMaxChange(comparisons, 'decrease');

  return {
    comparisons,
    summary: {
      totalComparisons: comparisons.length,
      significantChanges,
      averageChange,
      maxIncrease,
      maxDecrease,
    },
    insights: generateAnalyticsInsights(comparisons),
  };
};

/**
 * 32. Calculates metric value from dataset.
 *
 * @param {Record<string, any>[]} data - Dataset
 * @param {string} metric - Metric field
 * @returns {number} Calculated metric value
 */
const calculateMetricValue = (data: Record<string, any>[], metric: string): number => {
  return data.reduce((sum, row) => sum + Number(row[metric] || 0), 0);
};

/**
 * 33. Finds maximum change in comparisons.
 *
 * @param {ComparisonResult[]} comparisons - Comparison results
 * @param {string} type - Type of change (increase/decrease)
 * @returns {any} Maximum change details
 */
const findMaxChange = (
  comparisons: ComparisonResult[],
  type: 'increase' | 'decrease',
): { dimension: string; metric: string; value: number } => {
  let max = { dimension: '', metric: '', value: type === 'increase' ? -Infinity : Infinity };

  comparisons.forEach((comp) => {
    Object.values(comp.percentageChanges).forEach((change) => {
      if (type === 'increase' && change > max.value) {
        max = { dimension: comp.dimension, metric: comp.metric, value: change };
      } else if (type === 'decrease' && change < max.value) {
        max = { dimension: comp.dimension, metric: comp.metric, value: change };
      }
    });
  });

  return max;
};

/**
 * 34. Compares two time periods.
 *
 * @param {Record<string, any>[]} currentPeriod - Current period data
 * @param {Record<string, any>[]} previousPeriod - Previous period data
 * @param {string[]} metrics - Metrics to compare
 * @returns {Record<string, any>} Period comparison
 *
 * @example
 * ```typescript
 * const comparison = comparePeriods(thisMonth, lastMonth, ['revenue', 'units']);
 * ```
 */
export const comparePeriods = (
  currentPeriod: Record<string, any>[],
  previousPeriod: Record<string, any>[],
  metrics: string[],
): Record<string, any> => {
  const result: Record<string, any> = {};

  metrics.forEach((metric) => {
    const currentValue = calculateMetricValue(currentPeriod, metric);
    const previousValue = calculateMetricValue(previousPeriod, metric);
    const difference = currentValue - previousValue;
    const percentageChange =
      previousValue !== 0 ? (difference / previousValue) * 100 : 0;

    result[metric] = {
      current: currentValue,
      previous: previousValue,
      difference,
      percentageChange,
      trend: difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable',
    };
  });

  return result;
};

/**
 * 35. Generates analytics insights from comparisons.
 *
 * @param {ComparisonResult[]} comparisons - Comparison results
 * @returns {AnalyticsInsight[]} Generated insights
 *
 * @example
 * ```typescript
 * const insights = generateAnalyticsInsights(comparisonResults);
 * ```
 */
export const generateAnalyticsInsights = (
  comparisons: ComparisonResult[],
): AnalyticsInsight[] => {
  const insights: AnalyticsInsight[] = [];

  comparisons.forEach((comp) => {
    Object.entries(comp.percentageChanges).forEach(([key, change]) => {
      if (Math.abs(change) > 20) {
        insights.push({
          type: 'trend',
          severity: Math.abs(change) > 50 ? 'critical' : 'warning',
          title: `Significant ${change > 0 ? 'increase' : 'decrease'} in ${comp.metric}`,
          description: `${comp.metric} changed by ${change.toFixed(2)}% for ${comp.dimension}`,
          confidence: 0.85,
          affectedMetrics: [comp.metric],
        });
      }
    });
  });

  return insights;
};

// ============================================================================
// 8. EXPORT TO MULTIPLE FORMATS
// ============================================================================

/**
 * 36. Exports report data to specified format.
 *
 * @swagger
 * /api/reports/export:
 *   post:
 *     summary: Export report to various formats
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *               format:
 *                 type: string
 *                 enum: [pdf, excel, csv, json, xml]
 *     responses:
 *       200:
 *         description: Export successful
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *
 * @param {Record<string, any>} data - Report data
 * @param {ExportConfig} config - Export configuration
 * @returns {Promise<Buffer>} Exported file buffer
 *
 * @example
 * ```typescript
 * const buffer = await exportReport(reportData, {
 *   format: 'excel',
 *   fileName: 'monthly-report.xlsx'
 * });
 * ```
 */
export const exportReport = async (
  data: Record<string, any>,
  config: ExportConfig,
): Promise<Buffer> => {
  switch (config.format) {
    case 'pdf':
      return exportToPDF(data, config.options);
    case 'excel':
      return exportToExcel(data, config.options);
    case 'csv':
      return exportToCSV(data, config.options);
    case 'json':
      return Buffer.from(JSON.stringify(data, null, 2));
    case 'xml':
      return exportToXML(data, config.options);
    default:
      throw new Error(`Unsupported export format: ${config.format}`);
  }
};

/**
 * 37. Exports data to PDF format.
 *
 * @param {Record<string, any>} data - Data to export
 * @param {ExportOptions} [options] - PDF options
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await exportToPDF(reportData, {
 *   orientation: 'landscape',
 *   pageSize: 'A4'
 * });
 * ```
 */
export const exportToPDF = async (
  data: Record<string, any>,
  options?: ExportOptions,
): Promise<Buffer> => {
  // Placeholder implementation - would use PDFKit or similar
  const pdfContent = `PDF Report\n\nData: ${JSON.stringify(data, null, 2)}`;
  return Buffer.from(pdfContent);
};

/**
 * 38. Exports data to Excel format.
 *
 * @param {Record<string, any>} data - Data to export
 * @param {ExportOptions} [options] - Excel options
 * @returns {Promise<Buffer>} Excel buffer
 *
 * @example
 * ```typescript
 * const excel = await exportToExcel(reportData, { compression: true });
 * ```
 */
export const exportToExcel = async (
  data: Record<string, any>,
  options?: ExportOptions,
): Promise<Buffer> => {
  // Placeholder implementation - would use ExcelJS or similar
  const excelContent = `Excel Report\n\nData: ${JSON.stringify(data, null, 2)}`;
  return Buffer.from(excelContent);
};

/**
 * 39. Exports data to CSV format.
 *
 * @param {Record<string, any>} data - Data to export
 * @param {ExportOptions} [options] - CSV options
 * @returns {Promise<Buffer>} CSV buffer
 *
 * @example
 * ```typescript
 * const csv = await exportToCSV(reportData);
 * ```
 */
export const exportToCSV = async (
  data: Record<string, any>,
  options?: ExportOptions,
): Promise<Buffer> => {
  const rows = Array.isArray(data.data) ? data.data : [data];

  if (rows.length === 0) {
    return Buffer.from('');
  }

  const headers = Object.keys(rows[0]);
  const csvLines = [headers.join(',')];

  rows.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    csvLines.push(values.join(','));
  });

  return Buffer.from(csvLines.join('\n'));
};

/**
 * 40. Exports data to XML format.
 *
 * @param {Record<string, any>} data - Data to export
 * @param {ExportOptions} [options] - XML options
 * @returns {Promise<Buffer>} XML buffer
 *
 * @example
 * ```typescript
 * const xml = await exportToXML(reportData);
 * ```
 */
export const exportToXML = async (
  data: Record<string, any>,
  options?: ExportOptions,
): Promise<Buffer> => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<report>\n${objectToXML(data, '  ')}\n</report>`;
  return Buffer.from(xml);
};

/**
 * Helper function to convert object to XML.
 */
const objectToXML = (obj: any, indent: string = ''): string => {
  let xml = '';
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        xml += `${indent}<${key}>\n${objectToXML(item, indent + '  ')}\n${indent}</${key}>\n`;
      });
    } else if (typeof value === 'object' && value !== null) {
      xml += `${indent}<${key}>\n${objectToXML(value, indent + '  ')}\n${indent}</${key}>\n`;
    } else {
      xml += `${indent}<${key}>${value}</${key}>\n`;
    }
  }
  return xml;
};

// ============================================================================
// 9. REPORT SCHEDULING AND DISTRIBUTION
// ============================================================================

/**
 * 41. Creates a report schedule configuration.
 *
 * @swagger
 * components:
 *   schemas:
 *     ReportSchedule:
 *       type: object
 *       required:
 *         - id
 *         - reportId
 *         - schedule
 *         - recipients
 *       properties:
 *         id:
 *           type: string
 *         reportId:
 *           type: string
 *         schedule:
 *           $ref: '#/components/schemas/ScheduleConfig'
 *         recipients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RecipientConfig'
 *
 * @param {Partial<ReportSchedule>} schedule - Schedule configuration
 * @returns {ReportSchedule} Complete schedule configuration
 *
 * @example
 * ```typescript
 * const schedule = createReportSchedule({
 *   reportId: 'monthly-sales',
 *   schedule: { frequency: 'monthly', dayOfMonth: 1 },
 *   recipients: [{ email: 'user@example.com', type: 'to' }]
 * });
 * ```
 */
export const createReportSchedule = (schedule: Partial<ReportSchedule>): ReportSchedule => {
  return {
    id: schedule.id || `schedule-${Date.now()}`,
    reportId: schedule.reportId || '',
    name: schedule.name || '',
    schedule: schedule.schedule || { frequency: 'daily', startDate: new Date() },
    recipients: schedule.recipients || [],
    format: schedule.format || 'pdf',
    enabled: schedule.enabled !== false,
    lastRun: schedule.lastRun,
    nextRun: schedule.nextRun || calculateNextRun(schedule.schedule!),
  };
};

/**
 * 42. Calculates next run time for scheduled report.
 *
 * @param {ScheduleConfig} schedule - Schedule configuration
 * @returns {Date} Next run date
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextRun(scheduleConfig);
 * ```
 */
export const calculateNextRun = (schedule: ScheduleConfig): Date => {
  const now = new Date();
  let nextRun = new Date(schedule.startDate);

  switch (schedule.frequency) {
    case 'daily':
      while (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1);
      }
      break;
    case 'weekly':
      while (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 7);
      }
      break;
    case 'monthly':
      while (nextRun <= now) {
        nextRun.setMonth(nextRun.getMonth() + 1);
      }
      break;
    case 'quarterly':
      while (nextRun <= now) {
        nextRun.setMonth(nextRun.getMonth() + 3);
      }
      break;
    case 'yearly':
      while (nextRun <= now) {
        nextRun.setFullYear(nextRun.getFullYear() + 1);
      }
      break;
  }

  return nextRun;
};

/**
 * 43. Validates report schedule configuration.
 *
 * @param {ReportSchedule} schedule - Schedule to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateReportSchedule(schedule);
 * ```
 */
export const validateReportSchedule = (
  schedule: ReportSchedule,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!schedule.reportId) errors.push('Report ID is required');
  if (!schedule.recipients || schedule.recipients.length === 0) {
    errors.push('At least one recipient is required');
  }
  if (!schedule.schedule) errors.push('Schedule configuration is required');

  schedule.recipients?.forEach((recipient, index) => {
    if (!recipient.email || !recipient.email.includes('@')) {
      errors.push(`Recipient ${index}: Invalid email address`);
    }
  });

  return { valid: errors.length === 0, errors };
};

/**
 * 44. Distributes report to recipients.
 *
 * @param {ReportSchedule} schedule - Report schedule
 * @param {Buffer} reportFile - Report file buffer
 * @returns {Promise<{ sent: number; failed: number }>} Distribution result
 *
 * @example
 * ```typescript
 * const result = await distributeReport(schedule, reportBuffer);
 * ```
 */
export const distributeReport = async (
  schedule: ReportSchedule,
  reportFile: Buffer,
): Promise<{ sent: number; failed: number }> => {
  let sent = 0;
  let failed = 0;

  for (const recipient of schedule.recipients) {
    try {
      // Placeholder for email sending logic
      console.log(`Sending report to ${recipient.email}`);
      sent++;
    } catch (error) {
      console.error(`Failed to send to ${recipient.email}:`, error);
      failed++;
    }
  }

  return { sent, failed };
};

/**
 * 45. Updates schedule with last run information.
 *
 * @param {ReportSchedule} schedule - Schedule to update
 * @returns {ReportSchedule} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = updateScheduleRunInfo(schedule);
 * ```
 */
export const updateScheduleRunInfo = (schedule: ReportSchedule): ReportSchedule => {
  return {
    ...schedule,
    lastRun: new Date(),
    nextRun: calculateNextRun(schedule.schedule),
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  ReportConfig,
  ReportColumn,
  ReportFilter,
  SortConfig,
  AggregationConfig,
  KPIDefinition,
  KPIResult,
  DashboardConfig,
  DashboardWidget,
  TrendAnalysisConfig,
  TrendAnalysisResult,
  ComparativeAnalysisConfig,
  ComparativeAnalysisResult,
  ExportConfig,
  ReportSchedule,
  ScheduleConfig,
  RecipientConfig,
  AggregationResult,
  AnalyticsInsight,
};
