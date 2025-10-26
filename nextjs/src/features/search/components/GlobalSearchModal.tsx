/**
 * GlobalSearchModal Component
 *
 * Full-screen search modal with keyboard shortcuts (Cmd+K)
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';
import { useSearch } from '../hooks/useSearch';
import { useSearchShortcuts } from '../hooks/useSearchShortcuts';
import { SearchEntityType, SearchResult } from '../types';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick?: (result: SearchResult) => void;
  defaultEntityType?: SearchEntityType;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  onResultClick,
  defaultEntityType = SearchEntityType.ALL,
}: GlobalSearchModalProps) {
  const {
    query,
    setQuery,
    entityType,
    setEntityType,
    results,
    isLoading,
    total,
    executionTimeMs,
    page,
    totalPages,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
  } = useSearch('', {
    enabled: isOpen,
    debounceMs: 300,
  });

  // Set default entity type on mount
  useEffect(() => {
    if (isOpen && defaultEntityType) {
      setEntityType(defaultEntityType);
    }
  }, [isOpen, defaultEntityType, setEntityType]);

  // Keyboard shortcuts
  useSearchShortcuts({
    onCloseSearch: onClose,
    onNextResult: () => {
      // Could implement result navigation here
    },
    onPreviousResult: () => {
      // Could implement result navigation here
    },
    enabled: isOpen,
  });

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle result click
  const handleResultClick = useCallback(
    (result: SearchResult) => {
      onResultClick?.(result);
      onClose();
    },
    [onResultClick, onClose]
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 pt-16 pb-4">
          <div className="mx-auto max-w-4xl">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Search
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search Bar */}
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  entityType={entityType}
                  autoFocus
                  placeholder="Search students, medications, documents..."
                  size="lg"
                />

                {/* Entity Type Filter */}
                <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                  {Object.values(SearchEntityType).map((type) => (
                    <button
                      key={type}
                      onClick={() => setEntityType(type)}
                      className={clsx(
                        'px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors',
                        entityType === type
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {type === SearchEntityType.ALL
                        ? 'All'
                        : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {query.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>Start typing to search...</p>
                    <p className="text-sm mt-2">
                      Use <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Cmd+K</kbd> to open search
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Results Header */}
                    {!isLoading && results.length > 0 && (
                      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                        <span>
                          {total} {total === 1 ? 'result' : 'results'} found
                        </span>
                        <span>
                          {executionTimeMs.toFixed(0)}ms
                        </span>
                      </div>
                    )}

                    {/* Results List */}
                    <SearchResults
                      results={results}
                      query={query}
                      isLoading={isLoading}
                      onResultClick={handleResultClick}
                    />

                    {/* Pagination */}
                    {!isLoading && totalPages > 1 && (
                      <div className="mt-6 flex items-center justify-between">
                        <button
                          onClick={previousPage}
                          disabled={!hasPreviousPage}
                          className={clsx(
                            'px-4 py-2 text-sm font-medium rounded-lg',
                            hasPreviousPage
                              ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          )}
                        >
                          Previous
                        </button>

                        <span className="text-sm text-gray-600">
                          Page {page} of {totalPages}
                        </span>

                        <button
                          onClick={nextPage}
                          disabled={!hasNextPage}
                          className={clsx(
                            'px-4 py-2 text-sm font-medium rounded-lg',
                            hasNextPage
                              ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          )}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Hook to control global search modal
 */
export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  // Keyboard shortcut to open
  useSearchShortcuts({
    onOpenSearch: open,
    enabled: true,
  });

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
