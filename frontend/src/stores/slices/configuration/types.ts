/**
 * Configuration Store - Type Definitions
 * 
 * Type definitions for system configuration Redux state management
 * 
 * @module stores/slices/configuration/types
 */

import type {
  SystemConfiguration,
  ConfigurationHistory,
} from '../../../services/configurationApi';

/**
 * Loading states for different configuration operations.
 *
 * Provides granular loading flags for each async operation type,
 * enabling precise UI loading state management.
 */
export interface LoadingStates {
  configurations: boolean;
  publicConfigurations: boolean;
  currentConfiguration: boolean;
  history: boolean;
  recentChanges: boolean;
  update: boolean;
  bulkUpdate: boolean;
  create: boolean;
  delete: boolean;
  reset: boolean;
  export: boolean;
  import: boolean;
}

/**
 * Error states for different configuration operations.
 *
 * Stores operation-specific error messages for granular error handling
 * and user-friendly error display.
 */
export interface ErrorStates {
  configurations: string | null;
  publicConfigurations: string | null;
  currentConfiguration: string | null;
  history: string | null;
  recentChanges: string | null;
  update: string | null;
  bulkUpdate: string | null;
  create: string | null;
  delete: string | null;
  reset: string | null;
  export: string | null;
  import: string | null;
}

/**
 * Filter configuration for configurations list.
 */
export interface ConfigurationFilters {
  category: string | null;
  subCategory: string | null;
  scope: string | null;
  scopeId: string | null;
  tags: string[];
  isPublic: boolean | null;
  isEditable: boolean | null;
  searchTerm: string;
}

/**
 * Pagination metadata for configurations.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Main state interface for configuration Redux slice.
 *
 * Comprehensive state structure managing all aspects of system configuration
 * including settings, preferences, policies, and workflows.
 */
export interface ConfigurationState {
  configurations: SystemConfiguration[];
  publicConfigurations: SystemConfiguration[];
  currentConfiguration: SystemConfiguration | null;
  history: ConfigurationHistory[];
  recentChanges: ConfigurationHistory[];
  categories: string[];
  selectedConfigurations: string[];
  filters: ConfigurationFilters;
  pagination: PaginationMeta;
  historyPagination: PaginationMeta;
  loading: LoadingStates;
  error: ErrorStates;
}

/**
 * Initial state for configuration slice.
 *
 * Provides sensible defaults for all state properties.
 */
export const initialState: ConfigurationState = {
  configurations: [],
  publicConfigurations: [],
  currentConfiguration: null,
  history: [],
  recentChanges: [],
  categories: [],
  selectedConfigurations: [],
  filters: {
    category: null,
    subCategory: null,
    scope: null,
    scopeId: null,
    tags: [],
    isPublic: null,
    isEditable: null,
    searchTerm: '',
  },
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  },
  historyPagination: {
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  },
  loading: {
    configurations: false,
    publicConfigurations: false,
    currentConfiguration: false,
    history: false,
    recentChanges: false,
    update: false,
    bulkUpdate: false,
    create: false,
    delete: false,
    reset: false,
    export: false,
    import: false,
  },
  error: {
    configurations: null,
    publicConfigurations: null,
    currentConfiguration: null,
    history: null,
    recentChanges: null,
    update: null,
    bulkUpdate: null,
    create: null,
    delete: null,
    reset: null,
    export: null,
    import: null,
  },
};
