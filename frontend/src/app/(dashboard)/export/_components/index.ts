/**
 * Export Components Index
 *
 * Central export point for all export-related components and utilities.
 * This makes imports cleaner and more maintainable.
 */

// Main component
export { default as ExportContent } from './ExportContent.refactored';

// Sub-components
export { default as ExportFormatSelector } from './ExportFormatSelector';
export { default as ExportFieldMapping } from './ExportFieldMapping';
export { default as ExportJobList } from './ExportJobList';
export { default as ExportTemplateGrid } from './ExportTemplateGrid';
export { default as ExportHistory } from './ExportHistory';

// Custom hook and utilities
export {
  useExportOperations,
  generateMockExportJobs,
  generateMockExportTemplates,
  generateMockAuditEntries
} from './useExportOperations';

// Type exports
export type { ExportConfig } from './ExportFormatSelector';
export type { ExportField, ExportPreviewData } from './ExportFieldMapping';
export type { ExportJob } from './ExportJobList';
export type { ExportTemplate } from './ExportTemplateGrid';
export type { AuditEntry } from './ExportHistory';
