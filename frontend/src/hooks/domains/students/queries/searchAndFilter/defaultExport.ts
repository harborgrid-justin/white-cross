/**
 * Default export for backward compatibility
 *
 * Maintains compatibility with code that imports the module as a default object:
 * import searchAndFilter from './searchAndFilter';
 *
 * @module hooks/students/searchAndFilter/defaultExport
 */

import { useStudentSearch } from './useStudentSearch';
import { useAdvancedFilters } from './useStudentFilter';
import { useStudentSorting } from './useStudentSort';
import { useSavedSearches } from './useSavedSearches';
import { useStudentSearchAndFilter } from './useStudentSearchAndFilter';

export default {
  useStudentSearch,
  useAdvancedFilters,
  useStudentSorting,
  useSavedSearches,
  useStudentSearchAndFilter,
};
