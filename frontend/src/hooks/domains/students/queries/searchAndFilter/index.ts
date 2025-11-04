/**
 * Student Search and Filter Module
 *
 * Central export point for all search, filter, and sorting functionality.
 * Provides backward compatibility with the original single-file structure.
 *
 * @module hooks/students/searchAndFilter
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

// Export all types
export type {
  ApiError,
  SearchSuggestion,
  AdvancedFilters,
  SortOption,
  SavedSearch,
  SearchOptions,
  FilterOptions,
  SearchAndFilterOptions,
} from './searchFilterTypes';

// Export constants
export { SORT_OPTIONS } from './searchFilterTypes';

// Export individual hooks
export { useStudentSearch } from './useStudentSearch';
export { useAdvancedFilters } from './useStudentFilter';
export { useStudentSorting } from './useStudentSort';
export { useSavedSearches } from './useSavedSearches';
export { useStudentSearchAndFilter } from './useStudentSearchAndFilter';

// Default export for backward compatibility
export { default } from './defaultExport';
