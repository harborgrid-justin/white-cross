/**
 * Type definitions for Report Templates
 *
 * This file contains all TypeScript types and interfaces used across
 * the ReportTemplates component system.
 */

/**
 * Template category types
 */
export type TemplateCategory =
  | 'clinical'
  | 'financial'
  | 'operational'
  | 'compliance'
  | 'patient-satisfaction'
  | 'custom';

/**
 * Template complexity levels
 */
export type TemplateComplexity = 'simple' | 'intermediate' | 'advanced';

/**
 * Template data source types
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
 * View mode for template display
 */
export type ViewMode = 'grid' | 'list';

/**
 * Chart configuration for templates
 */
export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'table';
  title: string;
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  aggregate?: 'count' | 'sum' | 'avg' | 'min' | 'max';
}

/**
 * Report template interface
 */
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  complexity: TemplateComplexity;
  dataSources: DataSource[];
  fields: string[];
  filters: Record<string, unknown>[];
  charts: ChartConfig[];
  tags: string[];
  isPublic: boolean;
  isFavorite: boolean;
  isBuiltIn: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  rating: number;
  version: string;
  thumbnail?: string;
  previewData?: unknown[];
}

/**
 * Template folder interface
 */
export interface TemplateFolder {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  templateCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Category information for display
 */
export interface CategoryInfo {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Complexity badge configuration
 */
export interface ComplexityConfig {
  bg: string;
  text: string;
  label: string;
}

/**
 * Template filter state
 */
export interface TemplateFilters {
  searchTerm: string;
  categoryFilter: TemplateCategory | 'all';
  complexityFilter: TemplateComplexity | 'all';
  showFavoritesOnly: boolean;
}
