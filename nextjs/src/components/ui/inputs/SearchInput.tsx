'use client';

/**
 * WF-COMP-087 | SearchInput.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: lucide-react, react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: useState, useEffect, functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  delay?: number
  className?: string
  testId?: string
  onClear?: () => void
  disabled?: boolean
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  delay = 300,
  className = '',
  testId,
  onClear,
  disabled = false
}) => {
  const [localValue, setLocalValue] = useState(value)

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, delay)

    return () => clearTimeout(timer)
  }, [localValue, onChange, delay])

  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleClear = () => {
    setLocalValue('')
    if (onClear) {
      onClear()
    }
  }

  return (
    <div className={`relative ${className}`} role="search">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        data-testid={testId}
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
        className={`
          block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md
          leading-5 bg-white placeholder-gray-500
          focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${localValue ? 'pr-10' : 'pr-3'}
        `}
      />
      {localValue && !disabled && (
        <button
          data-testid={`${testId}-clear`}
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          type="button"
          aria-label="Clear search"
        >
          <span className="text-lg" aria-hidden="true">×</span>
        </button>
      )}
    </div>
  )
}
