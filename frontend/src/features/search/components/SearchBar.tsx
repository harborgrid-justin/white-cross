/**
 * SearchBar Component
 *
 * Global search bar with autocomplete and keyboard shortcuts
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { SearchEntityType, SearchSuggestion } from '../types';
import { useAutocomplete } from '../hooks/useAutocomplete';
import { useSearchShortcuts, useFocusTrap } from '../hooks/useSearchShortcuts';
import { clsx } from 'clsx';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  entityType?: SearchEntityType;
  placeholder?: string;
  autoFocus?: boolean;
  showSuggestions?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  onSuggestionClick,
  entityType,
  placeholder = 'Search students, medications, documents...',
  autoFocus = false,
  showSuggestions = true,
  className,
  size = 'md',
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useFocusTrap(isFocused);

  // Autocomplete
  const {
    suggestions,
    isLoading,
    addToHistory,
  } = useAutocomplete(value, {
    entityType,
    enabled: showSuggestions && isFocused,
  });

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [containerRef]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else if (value) {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSearch = () => {
    if (value.trim()) {
      // Add to history
      addToHistory({
        id: `search-${Date.now()}`,
        query: value,
        entityType: entityType || SearchEntityType.ALL,
        timestamp: new Date(),
        resultCount: 0,
      });

      onSearch?.(value);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    onSuggestionClick?.(suggestion);

    // Add to history
    addToHistory({
      id: `search-${Date.now()}`,
      query: suggestion.text,
      entityType: suggestion.entityType || SearchEntityType.ALL,
      timestamp: new Date(),
      resultCount: 0,
    });

    setIsFocused(false);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const sizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-11 text-base',
    lg: 'h-13 text-lg',
  };

  const showSuggestionsList = isFocused && showSuggestions && (suggestions.length > 0 || isLoading);

  return (
    <div
      ref={containerRef}
      className={clsx('relative w-full', className)}
    >
      {/* Input Container */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={clsx(
            'w-full pl-10 pr-20 py-2 rounded-lg border bg-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'placeholder:text-gray-400',
            'transition-all duration-200',
            sizeClasses[size],
            isFocused && 'ring-2 ring-blue-500 border-transparent'
          )}
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestionsList}
          aria-activedescendant={selectedIndex >= 0 ? `search-option-${selectedIndex}` : undefined}
          role="combobox"
        />

        {/* Loading & Clear Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          )}
          {value && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestionsList && (
        <div
          id="search-suggestions"
          className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
          role="listbox"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <Loader2 className="w-6 h-6 mx-auto animate-spin" />
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li key={`${suggestion.text}-${index}`}>
                  <button
                    id={`search-option-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={clsx(
                      'w-full px-4 py-2 text-left flex items-center gap-3',
                      'hover:bg-gray-50 transition-colors',
                      selectedIndex === index && 'bg-blue-50'
                    )}
                    role="option"
                    aria-selected={selectedIndex === index}
                  >
                    {/* Icon based on suggestion type */}
                    <div className="flex-shrink-0">
                      {suggestion.metadata?.type === 'recent' ? (
                        <Clock className="w-4 h-4 text-gray-400" />
                      ) : suggestion.metadata?.type === 'popular' ? (
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Search className="w-4 h-4 text-gray-400" />
                      )}
                    </div>

                    {/* Suggestion Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {suggestion.text}
                      </p>
                      {suggestion.entityType && suggestion.entityType !== SearchEntityType.ALL && (
                        <p className="text-xs text-gray-500 capitalize">
                          {suggestion.entityType.replace('_', ' ')}
                        </p>
                      )}
                    </div>

                    {/* Metadata */}
                    {suggestion.metadata?.count && (
                      <span className="text-xs text-gray-400">
                        {suggestion.metadata.count} searches
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
}

/**
 * Compact search bar variant
 */
export function CompactSearchBar(props: Omit<SearchBarProps, 'size'>) {
  return <SearchBar {...props} size="sm" showSuggestions={false} />;
}

/**
 * Search bar with entity type selector
 */
export interface SearchBarWithEntityProps extends Omit<SearchBarProps, 'entityType'> {
  entityType: SearchEntityType;
  onEntityTypeChange: (type: SearchEntityType) => void;
  availableTypes?: SearchEntityType[];
}

export function SearchBarWithEntity({
  entityType,
  onEntityTypeChange,
  availableTypes = [
    SearchEntityType.ALL,
    SearchEntityType.STUDENT,
    SearchEntityType.MEDICATION,
    SearchEntityType.DOCUMENT,
    SearchEntityType.APPOINTMENT,
  ],
  ...props
}: SearchBarWithEntityProps) {
  return (
    <div className="flex gap-2">
      <select
        value={entityType}
        onChange={(e) => onEntityTypeChange(e.target.value as SearchEntityType)}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Filter search by type"
      >
        {availableTypes.map((type) => (
          <option key={type} value={type}>
            {type === SearchEntityType.ALL ? 'All' : type.replace('_', ' ')}
          </option>
        ))}
      </select>
      <div className="flex-1">
        <SearchBar {...props} entityType={entityType} />
      </div>
    </div>
  );
}
