/**
 * Search results display component
 */

'use client';

import { Search, RefreshCw, Star, Paperclip, AlertCircle } from 'lucide-react';
import { SearchResult } from './types';
import { formatDate, getPriorityColor } from './utils/searchHelpers';

interface SearchResultsProps {
  results: SearchResult[];
  isSearching: boolean;
  hasQuery: boolean;
  searchError: string | null;
  onResultClick: (messageId: string) => void;
}

export function SearchResults({
  results,
  isSearching,
  hasQuery,
  searchError,
  onResultClick,
}: SearchResultsProps) {
  // Show error if present
  if (searchError) {
    return (
      <div className="p-4 border-b border-gray-200 bg-red-50">
        <div className="flex items-center text-red-700">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">{searchError}</span>
        </div>
      </div>
    );
  }

  // Show results if available
  if (results.length > 0) {
    return (
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
            <SearchResultItem
              key={result.id}
              result={result}
              onClick={() => onResultClick(result.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Show "no results" message if search was performed
  if (!isSearching && hasQuery && results.length === 0 && !searchError) {
    return (
      <div className="p-8 text-center">
        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-sm font-medium text-gray-900 mb-2">No messages found</h3>
        <p className="text-sm text-gray-500">
          Try adjusting your search terms or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  // Don't show anything if no search has been performed
  return null;
}

interface SearchResultItemProps {
  result: SearchResult;
  onClick: () => void;
}

function SearchResultItem({ result, onClick }: SearchResultItemProps) {
  return (
    <div
      onClick={onClick}
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
  );
}
