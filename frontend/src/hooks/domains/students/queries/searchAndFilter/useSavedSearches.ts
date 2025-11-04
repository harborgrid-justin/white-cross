/**
 * Saved Searches Hook
 *
 * Manage saved search configurations with localStorage persistence.
 * Provides functionality to save, load, update, and delete search configurations.
 *
 * @module hooks/students/searchAndFilter/useSavedSearches
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useCallback, useState, useEffect } from 'react';
import type {
  SavedSearch,
  AdvancedFilters,
  SortOption
} from './searchFilterTypes';

const STORAGE_KEY = 'student-saved-searches';

/**
 * Hook for managing saved searches
 *
 * @returns Saved search management functions
 *
 * @example
 * ```tsx
 * const {
 *   savedSearches,
 *   saveSearch,
 *   loadSearch,
 *   deleteSearch,
 *   currentSearch
 * } = useSavedSearches();
 *
 * // Save current search
 * const handleSave = () => {
 *   saveSearch('My Filter', filters, sortBy, false);
 * };
 *
 * // Load a saved search
 * const handleLoad = (search: SavedSearch) => {
 *   loadSearch(search);
 * };
 * ```
 */
export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [currentSearch, setCurrentSearch] = useState<SavedSearch | null>(null);

  // Load saved searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSavedSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    }
  }, []);

  // Save to localStorage whenever saved searches change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSearches));
    } catch (error) {
      console.error('Failed to save searches:', error);
    }
  }, [savedSearches]);

  /**
   * Save a new search configuration
   */
  const saveSearch = useCallback((
    name: string,
    filters: AdvancedFilters,
    sortBy?: SortOption,
    isDefault = false
  ) => {
    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name,
      filters,
      sortBy,
      createdAt: new Date().toISOString(),
      isDefault,
    };

    setSavedSearches(prev => {
      // Remove default flag from other searches if this one is default
      const updated = isDefault
        ? prev.map(search => ({ ...search, isDefault: false }))
        : prev;

      return [...updated, newSearch];
    });

    return newSearch;
  }, []);

  /**
   * Delete a saved search
   */
  const deleteSearch = useCallback((searchId: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== searchId));

    if (currentSearch?.id === searchId) {
      setCurrentSearch(null);
    }
  }, [currentSearch]);

  /**
   * Load a saved search and mark it as currently active
   */
  const loadSearch = useCallback((search: SavedSearch) => {
    setCurrentSearch({
      ...search,
      lastUsed: new Date().toISOString(),
    });

    // Update last used timestamp
    setSavedSearches(prev =>
      prev.map(s => s.id === search.id ? { ...s, lastUsed: new Date().toISOString() } : s)
    );

    return search;
  }, []);

  /**
   * Update an existing saved search
   */
  const updateSearch = useCallback((searchId: string, updates: Partial<SavedSearch>) => {
    setSavedSearches(prev =>
      prev.map(search => search.id === searchId ? { ...search, ...updates } : search)
    );
  }, []);

  /**
   * Get the default search if one is set
   */
  const getDefaultSearch = useCallback(() => {
    return savedSearches.find(search => search.isDefault);
  }, [savedSearches]);

  return {
    savedSearches,
    currentSearch,
    saveSearch,
    deleteSearch,
    loadSearch,
    updateSearch,
    setCurrentSearch,
    getDefaultSearch,
  };
};
