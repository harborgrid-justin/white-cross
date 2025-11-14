/**
 * Main search bar component with filter controls and active filter tags
 */

'use client';

import {
  Search,
  Filter,
  Clock,
  X,
  User,
  Star,
  Paperclip,
  Tag,
} from 'lucide-react';
import { SearchFilters } from './types';

interface SearchBarProps {
  filters: SearchFilters;
  showAdvanced: boolean;
  selectedTags: string[];
  onQueryChange: (query: string) => void;
  onToggleAdvanced: () => void;
  onToggleSavedSearches: () => void;
  onClearFilters: () => void;
  onRemoveFilter: (filterName: keyof SearchFilters) => void;
  onRemoveTag: (tag: string) => void;
  hasAdvancedFilters: boolean;
}

export function SearchBar({
  filters,
  showAdvanced,
  selectedTags,
  onQueryChange,
  onToggleAdvanced,
  onToggleSavedSearches,
  onClearFilters,
  onRemoveFilter,
  onRemoveTag,
  hasAdvancedFilters,
}: SearchBarProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={filters.query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onQueryChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search messages"
          />
          {filters.query && (
            <button
              onClick={() => onQueryChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          onClick={onToggleAdvanced}
          className={`
            px-3 py-2 text-sm font-medium rounded-lg transition-colors
            ${showAdvanced
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }
          `}
          aria-label="Toggle advanced filters"
        >
          <Filter className="h-4 w-4 mr-1 inline" />
          Filters
        </button>

        <button
          onClick={onToggleSavedSearches}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors"
          aria-label="Show saved searches"
        >
          <Clock className="h-4 w-4 mr-1 inline" />
          Saved
        </button>

        {(filters.query || hasAdvancedFilters) && (
          <button
            onClick={onClearFilters}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Clear all filters"
          >
            <X className="h-4 w-4 mr-1 inline" />
            Clear
          </button>
        )}
      </div>

      {/* Active Filter Tags */}
      {(hasAdvancedFilters || selectedTags.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.sender && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              <User className="h-3 w-3 mr-1" />
              From: {filters.sender}
              <button
                onClick={() => onRemoveFilter('sender')}
                className="ml-1 text-blue-600 hover:text-blue-800"
                aria-label="Remove sender filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.isStarred && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
              <Star className="h-3 w-3 mr-1" />
              Starred
              <button
                onClick={() => onRemoveFilter('isStarred')}
                className="ml-1 text-yellow-600 hover:text-yellow-800"
                aria-label="Remove starred filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.hasAttachments && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
              <Paperclip className="h-3 w-3 mr-1" />
              Has attachments
              <button
                onClick={() => onRemoveFilter('hasAttachments')}
                className="ml-1 text-green-600 hover:text-green-800"
                aria-label="Remove attachments filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedTags.map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
              <button
                onClick={() => onRemoveTag(tag)}
                className="ml-1 text-purple-600 hover:text-purple-800"
                aria-label={`Remove ${tag} tag filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
