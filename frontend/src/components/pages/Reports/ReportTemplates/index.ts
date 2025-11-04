/**
 * Report Templates Module
 *
 * Barrel export file for all ReportTemplates components, types, and utilities.
 */

// Main components
export { default as TemplateLibrary } from './TemplateLibrary';
export { default as TemplateCategories } from './TemplateCategories';
export { default as TemplateEditor } from './TemplateEditor';
export { default as TemplatePreview } from './TemplatePreview';
export { default as TemplateMetadata } from './TemplateMetadata';

// Types
export type {
  TemplateCategory,
  TemplateComplexity,
  DataSource,
  ViewMode,
  ChartConfig,
  ReportTemplate,
  TemplateFolder,
  CategoryInfo,
  ComplexityConfig,
  TemplateFilters
} from './types';

// Component props
export type { TemplateLibraryProps } from './TemplateLibrary';
export type { TemplateCategoriesProps } from './TemplateCategories';
export type { TemplateEditorProps } from './TemplateEditor';
export type { TemplatePreviewProps } from './TemplatePreview';
export type { TemplateMetadataProps } from './TemplateMetadata';

// Utilities
export {
  getCategoryInfo,
  getComplexityConfig,
  renderComplexityBadge,
  formatDate,
  renderStarRating
} from './utils';

// Hooks
export {
  useTemplateFilters,
  useTemplateEditor,
  useTemplateActions
} from './hooks';
