/**
 * ReportBuilder Module - Comprehensive Report Building Components
 * 
 * This module provides a modular report builder system with focused components
 * for creating and editing reports. Each component handles a specific aspect
 * of the report building process.
 */

// Main orchestrator component
export { default as BuilderCanvas, type BuilderCanvasProps } from './BuilderCanvas';

// Step components for each stage of report building
export { default as DataSourceSelector, type DataSourceSelectorProps } from './DataSourceSelector';
export { default as FieldSelector, type FieldSelectorProps } from './FieldSelector';
export { default as FilterBuilder, type FilterBuilderProps } from './FilterBuilder';
export { default as ChartConfigurator, type ChartConfiguratorProps } from './ChartConfigurator';
export { default as QueryPreview, type QueryPreviewProps } from './QueryPreview';

// Type definitions
export type {
  DataSource,
  StepId,
  ReportField,
  FilterOperator,
  FilterCondition,
  SortConfig,
  ChartConfig,
  ScheduleConfig,
  ReportConfig,
  DataSourceInfo,
  ReportBuilderProps
} from './types';

// Utility functions
export {
  getDataSourceInfo,
  getOperatorText,
  validateConfig,
  generateFilterId
} from './utils';

// Custom hooks
export type { UseReportBuilderReturn } from './hooks';
export { useReportBuilder } from './hooks';

// Re-export main component as default
export { default } from '../ReportBuilder';
