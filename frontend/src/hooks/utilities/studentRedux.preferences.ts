/**
 * View Preferences Redux Hook
 *
 * Hook for managing view preferences with Redux and local persistence.
 * Handles view modes, sorting, and filter preferences with localStorage sync.
 *
 * @module hooks/students/redux/preferences
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { mockSelectors, mockActions } from './studentRedux.mocks';

/**
 * Hook for managing view preferences with Redux and local persistence
 *
 * @returns View preference state and controls
 *
 * @example
 * ```tsx
 * const {
 *   viewMode,
 *   sortPreference,
 *   setViewMode,
 *   updateSort
 * } = useViewPreferences();
 * ```
 */
export const useViewPreferences = () => {
  const viewMode = useSelector(mockSelectors.selectViewMode);
  const appliedFilters = useSelector(mockSelectors.selectAppliedFilters);
  const dispatch = useDispatch();

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('student-view-preferences');
      if (saved) {
        const preferences = JSON.parse(saved);
        if (preferences.viewMode) {
          dispatch(mockActions.setViewMode(preferences.viewMode));
        }
        if (preferences.sortPreference) {
          dispatch(mockActions.setSortPreference(
            preferences.sortPreference.field,
            preferences.sortPreference.direction
          ));
        }
      }
    } catch (error) {
      console.error('Failed to load view preferences:', error);
    }
  }, [dispatch]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      const preferences = {
        viewMode,
        appliedFilters,
        timestamp: Date.now(),
      };
      localStorage.setItem('student-view-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save view preferences:', error);
    }
  }, [viewMode, appliedFilters]);

  const actions = useMemo(() => ({
    setViewMode: (mode: 'list' | 'grid' | 'table') => {
      dispatch(mockActions.setViewMode(mode));
    },

    updateSort: (field: string, direction: 'asc' | 'desc') => {
      dispatch(mockActions.setSortPreference(field, direction));
    },

    toggleSortDirection: (field: string) => {
      // This would get current sort preference and toggle direction
      dispatch(mockActions.setSortPreference(field, 'asc')); // Simplified
    },

    resetToDefaults: () => {
      dispatch(mockActions.setViewMode('list'));
      dispatch(mockActions.setSortPreference('lastName', 'asc'));
      dispatch(mockActions.clearFilters());
    },
  }), [dispatch]);

  return {
    viewMode,
    appliedFilters,
    ...actions,
  };
};
