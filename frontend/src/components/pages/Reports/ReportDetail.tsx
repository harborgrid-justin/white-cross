/**
 * @fileoverview Report Detail Component (Re-export)
 *
 * This file re-exports the ReportDetail component from its new modular structure.
 * The component has been refactored into smaller, maintainable modules in the
 * ReportDetail directory.
 */

export { default } from './ReportDetail';
export type {
  ReportDetailProps,
  ExecutionStatus,
  ReportParameter,
  ExecutionResult,
  TabType,
  CategoryInfo,
  StatusInfo,
  ExecutionStatusInfo
} from './ReportDetail/types';
