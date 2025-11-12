/**
 * Custom hook for message search state and logic management
 */

import { useState, useEffect } from 'react';
import { SearchFilters, SearchResult, SavedSearch, defaultFilters } from '../types';

export interface UseMessageSearchProps {
  onSearch: (filters: SearchFilters) => Promise<SearchResult[]>;
  onSaveSearch: (name: string, filters: SearchFilters) => void;
  initialQuery?: string;
}

export interface UseMessageSearchReturn {
  // State
  filters: SearchFilters;
  showAdvanced: boolean;
  isSearching: boolean;
  results: SearchResult[];
  showSavedSearches: boolean;
  showSaveDialog: boolean;
  saveSearchName: string;
  searchError: string | null;
  selectedTags: string[];

  // Setters
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  setShowAdvanced: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSavedSearches: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSaveDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setSaveSearchName: React.Dispatch<React.SetStateAction<string>>;
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;

  // Actions
  handleSearch: () => Promise<void>;
  clearFilters: () => void;
  handleSaveSearch: () => void;
  handleLoadSavedSearch: (savedSearch: SavedSearch) => void;
  toggleTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  hasAdvancedFilters: () => boolean;
}

export function useMessageSearch({
  onSearch,
  onSaveSearch,
  initialQuery = '',
}: UseMessageSearchProps): UseMessageSearchReturn {
  const [filters, setFilters] = useState<SearchFilters>({
    ...defaultFilters,
    query: initialQuery,
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  /**
   * Checks if any advanced filters are active
   */
  const hasAdvancedFilters = (): boolean => {
    return (
      !!filters.sender ||
      !!filters.recipient ||
      !!filters.subject ||
      !!filters.dateFrom ||
      !!filters.dateTo ||
      filters.hasAttachments ||
      filters.isStarred ||
      filters.isUnread ||
      filters.priority !== 'any' ||
      !!filters.category ||
      filters.tags.length > 0 ||
      !!filters.folder
    );
  };

  /**
   * Performs a search with the current filters
   */
  const handleSearch = async (): Promise<void> => {
    if (!filters.query.trim() && !hasAdvancedFilters()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const searchResults = await onSearch(filters);
      setResults(searchResults);
    } catch (error) {
      setSearchError('Failed to search messages. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Clears all filters and results
   */
  const clearFilters = (): void => {
    setFilters(defaultFilters);
    setResults([]);
    setSelectedTags([]);
    setSearchError(null);
  };

  /**
   * Saves the current search with a name
   */
  const handleSaveSearch = (): void => {
    if (saveSearchName.trim()) {
      onSaveSearch(saveSearchName.trim(), filters);
      setSaveSearchName('');
      setShowSaveDialog(false);
    }
  };

  /**
   * Loads a saved search and executes it
   */
  const handleLoadSavedSearch = (savedSearch: SavedSearch): void => {
    setFilters(savedSearch.filters);
    setSelectedTags(savedSearch.filters.tags);
    setShowSavedSearches(false);
    // Trigger search with loaded filters
    setTimeout(() => handleSearch(), 100);
  };

  /**
   * Toggles a tag in the selected tags list
   */
  const toggleTag = (tag: string): void => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);
    setFilters(prev => ({ ...prev, tags: newTags }));
  };

  /**
   * Removes a tag from the selected tags list
   */
  const removeTag = (tag: string): void => {
    const newTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    setFilters(prev => ({ ...prev, tags: newTags }));
  };

  // Auto-search when query changes (debounced)
  useEffect(() => {
    if (!filters.query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.query]);

  return {
    // State
    filters,
    showAdvanced,
    isSearching,
    results,
    showSavedSearches,
    showSaveDialog,
    saveSearchName,
    searchError,
    selectedTags,

    // Setters
    setFilters,
    setShowAdvanced,
    setShowSavedSearches,
    setShowSaveDialog,
    setSaveSearchName,
    setSelectedTags,

    // Actions
    handleSearch,
    clearFilters,
    handleSaveSearch,
    handleLoadSavedSearch,
    toggleTag,
    removeTag,
    hasAdvancedFilters,
  };
}
