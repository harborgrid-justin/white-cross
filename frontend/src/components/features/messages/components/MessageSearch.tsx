'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  Star,
  Paperclip,
  X,
  Save,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
  Settings
} from 'lucide-react';

interface SearchFilters {
  query: string;
  sender: string;
  recipient: string;
  subject: string;
  dateFrom: string;
  dateTo: string;
  hasAttachments: boolean;
  isStarred: boolean;
  isUnread: boolean;
  priority: 'any' | 'low' | 'normal' | 'high' | 'urgent';
  category: string;
  tags: string[];
  folder: string;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  lastUsed: string;
}

interface SearchResult {
  id: string;
  subject: string;
  sender: string;
  recipient: string;
  date: string;
  preview: string;
  isStarred: boolean;
  isUnread: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  hasAttachments: boolean;
  category: string;
  tags: string[];
  relevanceScore: number;
}

interface MessageSearchProps {
  onSearch: (filters: SearchFilters) => Promise<SearchResult[]>;
  onSaveSearch: (name: string, filters: SearchFilters) => void;
  onLoadSearch: (savedSearch: SavedSearch) => void;
  onDeleteSearch: (searchId: string) => void;
  onResultClick: (messageId: string) => void;
  savedSearches: SavedSearch[];
  availableTags: string[];
  availableCategories: string[];
  availableFolders: string[];
  initialQuery?: string;
  className?: string;
}

const defaultFilters: SearchFilters = {
  query: '',
  sender: '',
  recipient: '',
  subject: '',
  dateFrom: '',
  dateTo: '',
  hasAttachments: false,
  isStarred: false,
  isUnread: false,
  priority: 'any',
  category: '',
  tags: [],
  folder: ''
};

const priorityOptions = [
  { value: 'any', label: 'Any Priority' },
  { value: 'low', label: 'Low Priority' },
  { value: 'normal', label: 'Normal Priority' },
  { value: 'high', label: 'High Priority' },
  { value: 'urgent', label: 'Urgent Priority' },
];

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
  }, [filters.query]);

  const handleSearch = async () => {
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

  const hasAdvancedFilters = () => {
    return (
      filters.sender ||
      filters.recipient ||
      filters.subject ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.hasAttachments ||
      filters.isStarred ||
      filters.isUnread ||
      filters.priority !== 'any' ||
      filters.category ||
      filters.tags.length > 0 ||
      filters.folder
    );
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setResults([]);
    setSelectedTags([]);
    setSearchError(null);
  };

  const handleSaveSearch = () => {
    if (saveSearchName.trim()) {
      onSaveSearch(saveSearchName.trim(), filters);
      setSaveSearchName('');
      setShowSaveDialog(false);
    }
  };

  const handleLoadSavedSearch = (savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters);
    setSelectedTags(savedSearch.filters.tags);
    setShowSavedSearches(false);
    // Trigger search with loaded filters
    setTimeout(() => handleSearch(), 100);
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    setFilters(prev => ({ ...prev, tags: newTags }));
  };

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    setFilters(prev => ({ ...prev, tags: newTags }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Main Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={filters.query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Search messages"
            />
            {filters.query && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, query: '' }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
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
            onClick={() => setShowSavedSearches(!showSavedSearches)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors"
            aria-label="Show saved searches"
          >
            <Clock className="h-4 w-4 mr-1 inline" />
            Saved
          </button>

          {(filters.query || hasAdvancedFilters()) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Clear all filters"
            >
              <X className="h-4 w-4 mr-1 inline" />
              Clear
            </button>
          )}
        </div>

        {/* Active Filter Tags */}
        {(hasAdvancedFilters() || selectedTags.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.sender && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                <User className="h-3 w-3 mr-1" />
                From: {filters.sender}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, sender: '' }))}
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
                  onClick={() => setFilters(prev => ({ ...prev, isStarred: false }))}
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
                  onClick={() => setFilters(prev => ({ ...prev, hasAttachments: false }))}
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
                  onClick={() => removeTag(tag)}
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

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="text"
                placeholder="Sender email or name"
                value={filters.sender}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, sender: e.target.value }))}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, recipient: e.target.value }))}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter messages to this date"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={filters.priority}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ ...prev, priority: e.target.value as SearchFilters['priority'] }))}
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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ ...prev, category: e.target.value }))}
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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({ ...prev, folder: e.target.value }))}
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
                    onClick={() => toggleTag(tag)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, isStarred: e.target.checked }))}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              <span className="text-sm text-gray-700">Starred only</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.isUnread}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, isUnread: e.target.checked }))}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Unread only</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasAttachments}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, hasAttachments: e.target.checked }))}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <Paperclip className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm text-gray-700">Has attachments</span>
            </label>
          </div>

          {/* Search Actions */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handleSearch}
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

            {(filters.query || hasAdvancedFilters()) && (
              <button
                onClick={() => setShowSaveDialog(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Save className="h-4 w-4 mr-2 inline" />
                Save Search
              </button>
            )}
          </div>
        </div>
      )}

      {/* Saved Searches */}
      {showSavedSearches && (
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Saved Searches</h3>
            <button
              onClick={() => setShowSavedSearches(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close saved searches"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {savedSearches.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No saved searches yet</p>
          ) : (
            <div className="space-y-2">
              {savedSearches.map(savedSearch => (
                <div key={savedSearch.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div className="flex-1">
                    <button
                      onClick={() => handleLoadSavedSearch(savedSearch)}
                      className="text-left"
                    >
                      <div className="text-sm font-medium text-gray-900">{savedSearch.name}</div>
                      <div className="text-xs text-gray-500">
                        Last used: {formatDate(savedSearch.lastUsed)}
                      </div>
                    </button>
                  </div>
                  <button
                    onClick={() => onDeleteSearch(savedSearch.id)}
                    className="text-red-400 hover:text-red-600 ml-2"
                    aria-label={`Delete saved search: ${savedSearch.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="p-4 border-b border-gray-200 bg-green-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Save Search</h3>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close save search dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Enter search name..."
              value={saveSearchName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSaveSearchName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSaveSearch()}
              autoFocus
            />
            <button
              onClick={handleSaveSearch}
              disabled={!saveSearchName.trim()}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Search Error */}
      {searchError && (
        <div className="p-4 border-b border-gray-200 bg-red-50">
          <div className="flex items-center text-red-700">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">{searchError}</span>
          </div>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="max-h-96 overflow-y-auto">
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {results.length} message{results.length === 1 ? '' : 's'} found
              </span>
              {isSearching && (
                <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {results.map(result => (
              <div
                key={result.id}
                onClick={() => onResultClick(result.id)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {result.isUnread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                      {result.isStarred && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                      {result.hasAttachments && (
                        <Paperclip className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-xs font-medium ${getPriorityColor(result.priority)}`}>
                        {result.priority.toUpperCase()}
                      </span>
                    </div>

                    <div className="font-medium text-gray-900 truncate">
                      {result.subject}
                    </div>
                    
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">{result.sender}</span>
                      {result.recipient && (
                        <span> → {result.recipient}</span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {result.preview}
                    </div>

                    {result.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-500">
                      {formatDate(result.date)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {Math.round(result.relevanceScore * 100)}% match
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isSearching && filters.query && results.length === 0 && !searchError && (
        <div className="p-8 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-gray-900 mb-2">No messages found</h3>
          <p className="text-sm text-gray-500">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}