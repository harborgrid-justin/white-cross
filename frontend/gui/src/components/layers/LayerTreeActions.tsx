/**
 * LayerTreeActions Component
 *
 * Toolbar with search, filter, and bulk action controls for the layer tree.
 */

import React, { useCallback } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface FilterState {
  showHidden: boolean;
  showLocked: boolean;
  componentTypes: string[];
}

interface LayerTreeActionsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterState: FilterState;
  onFilterChange: (filter: FilterState) => void;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  hasExpandedNodes: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const LayerTreeActions: React.FC<LayerTreeActionsProps> = ({
  searchQuery,
  onSearchChange,
  filterState,
  onFilterChange,
  onCollapseAll,
  onExpandAll,
  hasExpandedNodes,
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  const handleClearSearch = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  const handleToggleShowHidden = useCallback(() => {
    onFilterChange({
      ...filterState,
      showHidden: !filterState.showHidden,
    });
  }, [filterState, onFilterChange]);

  const handleToggleShowLocked = useCallback(() => {
    onFilterChange({
      ...filterState,
      showLocked: !filterState.showLocked,
    });
  }, [filterState, onFilterChange]);

  const handleToggleExpandCollapse = useCallback(() => {
    if (hasExpandedNodes) {
      onCollapseAll();
    } else {
      onExpandAll();
    }
  }, [hasExpandedNodes, onCollapseAll, onExpandAll]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="flex flex-col gap-2 p-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Top row: Search and actions */}
      <div className="flex items-center gap-2">
        {/* Search input */}
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search layers..."
            className="w-full pl-8 pr-8 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              aria-label="Clear search"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>

        {/* Expand/Collapse all button */}
        <button
          onClick={handleToggleExpandCollapse}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          title={hasExpandedNodes ? 'Collapse all' : 'Expand all'}
          aria-label={hasExpandedNodes ? 'Collapse all' : 'Expand all'}
        >
          {hasExpandedNodes ? (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {/* Filter toggle button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`p-1.5 rounded-md transition-colors ${
            isFilterOpen
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
          title="Filter options"
          aria-label="Filter options"
          aria-expanded={isFilterOpen}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Filter panel (collapsible) */}
      {isFilterOpen && (
        <div className="flex flex-col gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Show
          </div>

          {/* Show hidden checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterState.showHidden}
              onChange={handleToggleShowHidden}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Hidden components
            </span>
          </label>

          {/* Show locked checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterState.showLocked}
              onChange={handleToggleShowLocked}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Locked components
            </span>
          </label>
        </div>
      )}
    </div>
  );
};
