/**
 * Reports Module Components
 * 
 * This barrel export file provides centralized access to all report-related components
 * for easy importing and better maintainability.
 */

export { default as ReportCard } from './ReportCard';
export { default as ReportHeader } from './ReportHeader';
export { default as ReportList } from './ReportList';
export { default as ReportDetail } from './ReportDetail';
export { default as ReportBuilder } from './ReportBuilder';
export { default as ReportScheduler } from './ReportScheduler';
export { default as ReportTemplates } from './ReportTemplates';
export { default as ReportAnalytics } from './ReportAnalytics';
export { default as ReportExport } from './ReportExport';
export { default as ReportPermissions } from './ReportPermissions';

// Re-export types from ReportCard for external use
export type {
  Report,
  ReportStatus,
  ReportCategory,
  ReportFrequency
} from './ReportCard';
