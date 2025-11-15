/**
 * SearchBar Component
 *
 * Component search input with real-time filtering.
 * Features:
 * - Fuzzy search input
 * - Clear button
 * - Keyboard shortcuts
 * - Accessibility support
 */

'use client';

import React, { useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SearchBarProps {
  /**
   * Current search query
   */
  value: string;

  /**
   * Callback when search query changes
   */
  onChange: (value: string) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Optional custom className
   */
  className?: string;

  /**
   * Auto-focus on mount
   */
  autoFocus?: boolean;
}

/**
 * SearchBar - Component search input
 *
 * Provides a search input for filtering components in the palette.
 * Includes a clear button and supports keyboard shortcuts.
 *
 * @example
 * ```tsx
 * <SearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   placeholder="Search components..."
 * />
 * ```
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search components...',
  className,
  autoFocus = false,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange('');
    // Focus input after clearing
    inputRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Escape key clears the search
      if (event.key === 'Escape') {
        if (value) {
          event.preventDefault();
          handleClear();
        }
      }
    },
    [value, handleClear]
  );

  return (
    <div className={cn('relative', className)}>
      {/* Search icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search
          className="w-4 h-4 text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      {/* Search input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          // Base styles
          'w-full h-10 pl-10 pr-10 rounded-md border',
          'bg-background text-foreground placeholder:text-muted-foreground',
          'border-input',

          // Typography
          'text-sm font-normal',

          // Focus styles
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'focus:border-transparent',

          // Transitions
          'transition-all duration-150'
        )}
        aria-label="Search components"
        aria-controls="component-list"
        aria-autocomplete="list"
        role="searchbox"
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2',
            'p-1.5 rounded-md',
            'text-muted-foreground hover:text-foreground',
            'hover:bg-accent',
            'focus:outline-none focus:ring-2 focus:ring-ring',
            'transition-colors duration-150'
          )}
          aria-label="Clear search"
          tabIndex={0}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/**
 * Memoized version to prevent unnecessary re-renders
 */
export const MemoizedSearchBar = React.memo(SearchBar);
