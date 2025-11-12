/**
 * Advanced search filters panel component
 */

'use client';

import { Search, RefreshCw, Save, Star, Paperclip } from 'lucide-react';
import { SearchFilters, priorityOptions } from './types';

interface AdvancedFiltersProps {
  filters: SearchFilters;
  selectedTags: string[];
  availableTags: string[];
  availableCategories: string[];
  availableFolders: string[];
  isSearching: boolean;
  onFilterChange: (filterName: keyof SearchFilters, value: string | boolean) => void;
  onToggleTag: (tag: string) => void;
  onSearch: () => void;
  onShowSaveDialog: () => void;
  hasFiltersToSave: boolean;
}

export function AdvancedFilters({
  filters,
  selectedTags,
  availableTags,
  availableCategories,
  availableFolders,
  isSearching,
  onFilterChange,
  onToggleTag,
  onSearch,
  onShowSaveDialog,
  hasFiltersToSave,
}: AdvancedFiltersProps) {
  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <input
            type="text"
            placeholder="Sender email or name"
            value={filters.sender}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange('sender', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Recipient */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input
            type="text"
            placeholder="Recipient email or name"
            value={filters.recipient}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange('recipient', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            placeholder="Subject contains..."
            value={filters.subject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange('subject', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange('dateFrom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter messages from this date"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange('dateTo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter messages to this date"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={filters.priority}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Select priority filter"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Select category filter"
          >
            <option value="">All Categories</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Folder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Folder</label>
          <select
            value={filters.folder}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange('folder', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Select folder filter"
          >
            <option value="">All Folders</option>
            {availableFolders.map(folder => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      {availableTags.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => onToggleTag(tag)}
                className={`
                  px-3 py-1 text-xs rounded-full border transition-colors
                  ${selectedTags.includes(tag)
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Boolean Filters */}
      <div className="mt-4 flex flex-wrap gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.isStarred}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange('isStarred', e.target.checked)}
            className="mr-2 text-blue-600 focus:ring-blue-500"
          />
          <Star className="h-4 w-4 mr-1 text-yellow-500" />
          <span className="text-sm text-gray-700">Starred only</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.isUnread}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange('isUnread', e.target.checked)}
            className="mr-2 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Unread only</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.hasAttachments}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange('hasAttachments', e.target.checked)}
            className="mr-2 text-blue-600 focus:ring-blue-500"
          />
          <Paperclip className="h-4 w-4 mr-1 text-gray-500" />
          <span className="text-sm text-gray-700">Has attachments</span>
        </label>
      </div>

      {/* Search Actions */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={onSearch}
          disabled={isSearching}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSearching ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 inline animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2 inline" />
              Search
            </>
          )}
        </button>

        {hasFiltersToSave && (
          <button
            onClick={onShowSaveDialog}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Save className="h-4 w-4 mr-2 inline" />
            Save Search
          </button>
        )}
      </div>
    </div>
  );
}
