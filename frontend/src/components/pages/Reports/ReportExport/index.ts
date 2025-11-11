/**
 * ReportExport Module Index
 * 
 * Provides backward compatibility by re-exporting the main ReportExport component
 * and its related types and utilities.
 */

// Main component
export { default as ReportExport } from './ReportExport';
export { default } from './ReportExport';

// Component exports for direct usage
export { ExportConfigs } from './ExportConfigs';
export { ExportJobs } from './ExportJobs';
export { ExportTemplates } from './ExportTemplates';
export { CreateExportModal } from './CreateExportModal';

// Type exports
export type {
  ExportConfig,
  ExportJob,
  ExportTemplate,
  ReportReference,
  ExportFormat,
  ExportDestination,
  ExportStatus,
  ExportPriority,
  ExportSettings,
  ExportSchedule,
  ExportFilters
} from './types';

// Utility exports
export {
  getFormatIcon,
  getStatusDisplay,
  getPriorityColor,
  formatFileSize
} from './utils';
