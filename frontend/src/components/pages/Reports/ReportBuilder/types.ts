import type { Report, ReportCategory, ReportFrequency } from '../ReportCard';

/**
 * Data source types available for report building
 */
export type DataSource =
  | 'students'
  | 'medications'
  | 'appointments'
  | 'communications'
  | 'health-records'
  | 'billing'
  | 'compliance';

/**
 * Step identifiers for the report builder wizard
 */
export type StepId = 'basic' | 'data' | 'filters' | 'visualization' | 'schedule';

/**
 * Field types for report building
 */
export interface ReportField {
  id: string;
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array';
  source: DataSource;
  category: string;
  description?: string;
  required?: boolean;
  isGroupable?: boolean;
  isSortable?: boolean;
  isFilterable?: boolean;
}

/**
 * Filter condition operators
 */
export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'between'
  | 'in'
  | 'not_in'
  | 'is_null'
  | 'not_null';

/**
 * Filter configuration
 */
export interface FilterCondition {
  id: string;
  fieldId: string;
  operator: FilterOperator;
  value: unknown;
  secondValue?: unknown; // For 'between' operator
}

/**
 * Sort configuration
 */
export interface SortConfig {
  fieldId: string;
  direction: 'asc' | 'desc';
}

/**
 * Chart configuration
 */
export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  aggregate?: 'count' | 'sum' | 'avg' | 'min' | 'max';
}

/**
 * Schedule configuration for automated reports
 */
export interface ScheduleConfig {
  time: string;
  timezone: string;
  recipients: string[];
}

/**
 * Complete report configuration
 */
export interface ReportConfig {
  id?: string;
  title: string;
  description: string;
  category: ReportCategory;
  frequency: ReportFrequency;
  dataSources: DataSource[];
  selectedFields: string[];
  filters: FilterCondition[];
  sorting: SortConfig[];
  groupBy: string[];
  includeChart: boolean;
  chartConfig?: ChartConfig;
  tags: string[];
  isScheduled: boolean;
  scheduleConfig?: ScheduleConfig;
}

/**
 * Data source display information
 */
export interface DataSourceInfo {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

/**
 * Props for the main ReportBuilder component
 */
export interface ReportBuilderProps {
  /** Existing report to edit (if any) */
  report?: Report;
  /** Available data sources */
  dataSources?: DataSource[];
  /** Available fields by data source */
  availableFields?: Record<DataSource, ReportField[]>;
  /** Loading state */
  loading?: boolean;
  /** Preview data */
  previewData?: unknown[];
  /** Preview loading state */
  previewLoading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Save report handler */
  onSaveReport?: (config: ReportConfig) => void;
  /** Preview report handler */
  onPreviewReport?: (config: ReportConfig) => void;
  /** Run report handler */
  onRunReport?: (config: ReportConfig) => void;
  /** Cancel handler */
  onCancel?: () => void;
  /** Import template handler */
  onImportTemplate?: () => void;
  /** Export template handler */
  onExportTemplate?: (config: ReportConfig) => void;
}
