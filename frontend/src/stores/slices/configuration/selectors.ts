/**
 * Configuration Store - Selectors
 * 
 * Selector functions for accessing and deriving configuration state
 * 
 * @module stores/slices/configuration/selectors
 */

import { createSelector } from '@reduxjs/toolkit';
import type { ConfigurationState } from './types';
import type { SystemConfiguration } from '../../../services/configurationApi';

/**
 * Root state type for selectors
 */
type RootState = { configuration: ConfigurationState };

// ============================================================================
// Basic Selectors
// ============================================================================

/**
 * Select all configurations
 */
export const selectConfigurations = (state: RootState) => state.configuration.configurations;

/**
 * Select public configurations
 */
export const selectPublicConfigurations = (state: RootState) => state.configuration.publicConfigurations;

/**
 * Select current configuration (detail view)
 */
export const selectCurrentConfiguration = (state: RootState) => state.configuration.currentConfiguration;

/**
 * Select configuration history
 */
export const selectHistory = (state: RootState) => state.configuration.history;

/**
 * Select recent configuration changes
 */
export const selectRecentChanges = (state: RootState) => state.configuration.recentChanges;

/**
 * Select available configuration categories
 */
export const selectCategories = (state: RootState) => state.configuration.categories;

/**
 * Select currently selected configurations (for bulk operations)
 */
export const selectSelectedConfigurations = (state: RootState) => state.configuration.selectedConfigurations;

/**
 * Select active filters
 */
export const selectFilters = (state: RootState) => state.configuration.filters;

/**
 * Select pagination metadata
 */
export const selectPagination = (state: RootState) => state.configuration.pagination;

/**
 * Select history pagination metadata
 */
export const selectHistoryPagination = (state: RootState) => state.configuration.historyPagination;

/**
 * Select loading states
 */
export const selectLoading = (state: RootState) => state.configuration.loading;

/**
 * Select error states
 */
export const selectErrors = (state: RootState) => state.configuration.error;

// ============================================================================
// Derived Selectors
// ============================================================================

/**
 * Select filtered configurations based on active filters.
 * 
 * Applies category, scope, visibility, editability, tag, and search filters
 * to the full list of configurations.
 */
export const selectFilteredConfigurations = createSelector(
  [selectConfigurations, selectFilters],
  (configurations, filters) => {
    return configurations.filter(config => {
      if (filters.category && config.category !== filters.category) return false;
      if (filters.subCategory && config.subCategory !== filters.subCategory) return false;
      if (filters.scope && config.scope !== filters.scope) return false;
      if (filters.scopeId && config.scopeId !== filters.scopeId) return false;
      if (filters.isPublic !== null && config.isPublic !== filters.isPublic) return false;
      if (filters.isEditable !== null && config.isEditable !== filters.isEditable) return false;
      if (filters.tags.length > 0 && !filters.tags.some(tag => config.tags.includes(tag))) return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return config.key.toLowerCase().includes(term) ||
               config.description?.toLowerCase().includes(term) ||
               config.category.toLowerCase().includes(term);
      }
      return true;
    });
  }
);

/**
 * Select configurations grouped by category.
 * 
 * Returns a map of category names to arrays of configurations in that category.
 * Useful for category-based navigation and organization.
 */
export const selectConfigurationsByCategory = createSelector(
  [selectConfigurations],
  (configurations) => {
    const grouped: Record<string, SystemConfiguration[]> = {};
    configurations.forEach(config => {
      if (!grouped[config.category]) {
        grouped[config.category] = [];
      }
      grouped[config.category].push(config);
    });
    return grouped;
  }
);

/**
 * Select only editable configurations.
 * 
 * Filters configurations to show only those that can be modified by the user.
 */
export const selectEditableConfigurations = createSelector(
  [selectConfigurations],
  (configurations) => configurations.filter(c => c.isEditable)
);

/**
 * Select configurations that require system restart.
 * 
 * Returns configurations that, when modified, require a system restart
 * to take effect. Important for warning users about restart requirements.
 */
export const selectConfigurationsRequiringRestart = createSelector(
  [selectConfigurations],
  (configurations) => configurations.filter(c => c.requiresRestart)
);

/**
 * Select configuration metrics and statistics.
 * 
 * Provides aggregate metrics about configurations including total count,
 * editable count, public count, restart-required count, and category count.
 * 
 * @example
 * ```typescript
 * const metrics = useSelector(selectConfigurationMetrics);
 * // {
 * //   total: 145,
 * //   editable: 89,
 * //   public: 23,
 * //   requiresRestart: 12,
 * //   categories: 8
 * // }
 * ```
 */
export const selectConfigurationMetrics = createSelector(
  [selectConfigurations],
  (configurations) => {
    const total = configurations.length;
    const editable = configurations.filter(c => c.isEditable).length;
    const publicCount = configurations.filter(c => c.isPublic).length;
    const requiresRestart = configurations.filter(c => c.requiresRestart).length;
    const categories = new Set(configurations.map(c => c.category)).size;

    return {
      total,
      editable,
      public: publicCount,
      requiresRestart,
      categories,
    };
  }
);
