'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

/**
 * Props for the HistorySearch component
 */
export interface HistorySearchProps {
  /** Current search value */
  value: string;
  /** Callback when search value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
}

/**
 * HistorySearch component for searching communication history
 *
 * Features:
 * - Real-time search input with debouncing
 * - Clear visual feedback with search icon
 * - Accessible with proper ARIA labels
 * - Debounced updates to prevent excessive filtering
 *
 * @component
 * @example
 * ```tsx
 * <HistorySearch
 *   value={searchValue}
 *   onChange={handleSearchChange}
 *   placeholder="Search communications..."
 *   debounceMs={300}
 * />
 * ```
 */
export const HistorySearch: React.FC<HistorySearchProps> = ({
  value,
  onChange,
  placeholder = 'Search communications...',
  className = '',
  debounceMs = 300
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, value]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-label="Search communications"
      />
    </div>
  );
};

export default HistorySearch;
