/**
 * Component catalog types for organizing and discovering components
 *
 * This file defines types for the component catalog, which provides
 * organization, search, filtering, and discovery of available components.
 */

import {
  ComponentDefinition,
  ComponentGroup,
  ComponentTemplate,
  ComponentCategory,
} from './component.types';
import { PropertyPreset } from './property.types';

/**
 * Component catalog containing all available components
 */
export interface ComponentCatalog {
  version: string;
  components: ComponentDefinition[];
  groups: ComponentGroup[];
  templates: ComponentTemplate[];
  presets: PropertyPreset[];
  customComponents?: ComponentDefinition[];
}

/**
 * Catalog filter options
 */
export interface CatalogFilter {
  categories?: ComponentCategory[];
  tags?: string[];
  renderMode?: ('client' | 'server' | 'hybrid')[];
  search?: string;
  deprecated?: boolean;
  customOnly?: boolean;
}

/**
 * Catalog sort options
 */
export type CatalogSortBy = 'name' | 'category' | 'usage' | 'recent' | 'custom';

export interface CatalogSort {
  by: CatalogSortBy;
  direction: 'asc' | 'desc';
}

/**
 * Component usage statistics
 */
export interface ComponentUsageStats {
  componentId: string;
  usageCount: number;
  lastUsed?: Date;
  averagePropsConfigured?: number;
  popularCombinations?: Array<{
    componentIds: string[];
    count: number;
  }>;
}

/**
 * Component search result
 */
export interface ComponentSearchResult {
  component: ComponentDefinition;
  score: number;
  matchedFields: string[];
  highlight?: Record<string, string>;
}

/**
 * Catalog view configuration
 */
export interface CatalogViewConfig {
  layout: 'grid' | 'list';
  groupBy?: 'category' | 'none';
  showPreviews?: boolean;
  showDescriptions?: boolean;
  itemsPerPage?: number;
}

/**
 * Component library metadata
 */
export interface ComponentLibraryMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  homepage?: string;
  repository?: string;
  license?: string;
  keywords?: string[];
  peerDependencies?: Record<string, string>;
}

/**
 * Custom component registration
 */
export interface CustomComponentRegistration {
  definition: ComponentDefinition;
  source: 'local' | 'remote' | 'marketplace';
  sourceUrl?: string;
  verified?: boolean;
  author?: string;
  license?: string;
  dependencies?: string[];
}

/**
 * Component marketplace entry
 */
export interface MarketplaceComponent {
  id: string;
  definition: ComponentDefinition;
  author: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  stats: {
    downloads: number;
    rating: number;
    reviews: number;
  };
  pricing?: {
    type: 'free' | 'paid' | 'freemium';
    price?: number;
    currency?: string;
  };
  media?: {
    screenshots?: string[];
    video?: string;
    demo?: string;
  };
  changelog?: Array<{
    version: string;
    date: Date;
    changes: string[];
  }>;
  support?: {
    documentation?: string;
    issues?: string;
    forum?: string;
  };
}

/**
 * Component export format
 */
export interface ComponentExport {
  version: string;
  exportedAt: Date;
  components: ComponentDefinition[];
  templates?: ComponentTemplate[];
  presets?: PropertyPreset[];
  metadata?: ComponentLibraryMetadata;
}

/**
 * Component import result
 */
export interface ComponentImportResult {
  success: boolean;
  imported: string[]; // Component IDs
  skipped: string[]; // Already exists
  failed: Array<{
    componentId: string;
    error: string;
  }>;
  warnings?: string[];
}
