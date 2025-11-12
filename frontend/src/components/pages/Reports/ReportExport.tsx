/**
 * ReportExport Module
 *
 * This file provides backward compatibility by re-exporting the refactored
 * ReportExport component from its modular structure.
 *
 * The component has been refactored from a 1004-line monolithic file into
 * smaller, maintainable components (each <400 lines) located in the
 * ReportExport subdirectory.
 *
 * Original file: 1004 lines
 * Refactored structure: 12 components + 4 supporting files
 *
 * @see ./ReportExport/ for the modular implementation
 */

// Re-export the main component from the subdirectory index
export { default, ReportExport } from './ReportExport/ReportExport';

// Re-export sub-components for direct usage if needed
export { ExportConfigs } from './ReportExport/ExportConfigs';
export { ExportJobs } from './ReportExport/ExportJobs';
export { ExportTemplates } from './ReportExport/ExportTemplates';
export { CreateExportModal } from './ReportExport/CreateExportModal';

// Re-export all types for backward compatibility
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
} from './ReportExport/types';

// Re-export utilities if needed elsewhere
export {
  getFormatIcon,
  getStatusDisplay,
  getPriorityColor,
  formatFileSize
} from './ReportExport/utils';
