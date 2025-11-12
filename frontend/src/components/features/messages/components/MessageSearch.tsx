/**
 * Main message search component - orchestrates search functionality
 */

'use client';

import { MessageSearchProps, SearchFilters } from './types';
import { useMessageSearch } from './hooks/useMessageSearch';
import { SearchBar } from './SearchBar';
import { AdvancedFilters } from './AdvancedFilters';
import { SavedSearches, SaveSearchDialog } from './SavedSearches';
import { SearchResults } from './SearchResults';

export function MessageSearch({
  onSearch,
  onSaveSearch,
  onLoadSearch,
  onDeleteSearch,
  onResultClick,
  savedSearches,
  availableTags,
  availableCategories,
  availableFolders,
  initialQuery = '',
  className = '',
}: MessageSearchProps) {
  const {
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

    // Actions
    handleSearch,
    clearFilters,
    handleSaveSearch,
    handleLoadSavedSearch,
    toggleTag,
    removeTag,
    hasAdvancedFilters,
  } = useMessageSearch({
    onSearch,
    onSaveSearch,
    initialQuery,
  });

  /**
   * Handles changes to individual filter fields
   */
  const handleFilterChange = (filterName: keyof SearchFilters, value: string | boolean): void => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  /**
   * Handles removal of specific filters from the UI
   */
  const handleRemoveFilter = (filterName: keyof SearchFilters): void => {
    if (filterName === 'isStarred' || filterName === 'isUnread' || filterName === 'hasAttachments') {
      setFilters(prev => ({ ...prev, [filterName]: false }));
    } else if (filterName === 'tags') {
      setFilters(prev => ({ ...prev, tags: [] }));
    } else {
      setFilters(prev => ({ ...prev, [filterName]: '' }));
    }
  };

  /**
   * Handles loading a saved search
   */
  const handleLoadSaved = (savedSearch: Parameters<typeof onLoadSearch>[0]): void => {
    handleLoadSavedSearch(savedSearch);
    onLoadSearch(savedSearch);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Main Search Bar */}
      <SearchBar
        filters={filters}
        showAdvanced={showAdvanced}
        selectedTags={selectedTags}
        onQueryChange={(query) => setFilters(prev => ({ ...prev, query }))}
        onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
        onToggleSavedSearches={() => setShowSavedSearches(!showSavedSearches)}
        onClearFilters={clearFilters}
        onRemoveFilter={handleRemoveFilter}
        onRemoveTag={removeTag}
        hasAdvancedFilters={hasAdvancedFilters()}
      />

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <AdvancedFilters
          filters={filters}
          selectedTags={selectedTags}
          availableTags={availableTags}
          availableCategories={availableCategories}
          availableFolders={availableFolders}
          isSearching={isSearching}
          onFilterChange={handleFilterChange}
          onToggleTag={toggleTag}
          onSearch={handleSearch}
          onShowSaveDialog={() => setShowSaveDialog(true)}
          hasFiltersToSave={!!(filters.query || hasAdvancedFilters())}
        />
      )}

      {/* Saved Searches Panel */}
      {showSavedSearches && (
        <SavedSearches
          savedSearches={savedSearches}
          onLoad={handleLoadSaved}
          onDelete={onDeleteSearch}
          onClose={() => setShowSavedSearches(false)}
        />
      )}

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <SaveSearchDialog
          saveSearchName={saveSearchName}
          onNameChange={setSaveSearchName}
          onSave={handleSaveSearch}
          onClose={() => setShowSaveDialog(false)}
        />
      )}

      {/* Search Results */}
      <SearchResults
        results={results}
        isSearching={isSearching}
        hasQuery={!!filters.query}
        searchError={searchError}
        onResultClick={onResultClick}
      />
    </div>
  );
}
