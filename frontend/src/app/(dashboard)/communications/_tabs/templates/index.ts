/**
 * WF-COMM-TEMPLATES-INDEX | Template Module Barrel Exports
 * Purpose: Central export point for all template-related components and utilities
 * Upstream: None | Dependencies: All template modules
 * Downstream: CommunicationTemplatesTab | Called by: Main tab component
 * Related: Template management system
 * Exports: All template components, hooks, types, and utilities
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Module organization
 * LLM Context: Barrel file for clean imports
 */

export * from './types';
export * from './hooks';
export * from './mockData';
export { TemplateCard } from './TemplateCard';
export { TemplateList } from './TemplateList';
export { TemplateEditor } from './TemplateEditor';
export { TemplatePreview } from './TemplatePreview';
export { TemplateFilters } from './TemplateFilters';
