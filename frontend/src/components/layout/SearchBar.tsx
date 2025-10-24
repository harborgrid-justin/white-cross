/**
 * WF-COMP-NAV-009 | SearchBar.tsx - Global Search Modal Component
 * Purpose: Global search overlay with debounced search and keyboard shortcuts
 * Dependencies: react, react-router-dom, lucide-react
 * Features: Debounced search, keyboard shortcuts (Cmd/Ctrl+K), recent searches
 * Last Updated: 2025-10-24
 * Agent: NAV7L5 - React Component Architect
 */

import React, { memo, useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { useNavigation } from '../../contexts/NavigationContext'

// ============================================================================
// SEARCH RESULT TYPES
// ============================================================================

interface SearchResult {
  id: string
  title: string
  subtitle?: string
  type: 'student' | 'medication' | 'appointment' | 'document' | 'health-record'
  path: string
  icon: string
}

// ============================================================================
// MAIN SEARCH BAR COMPONENT
// ============================================================================

interface SearchBarProps {
  className?: string
}

export const SearchBar = memo(({ className = '' }: SearchBarProps) => {
  const navigate = useNavigate()
  const { searchOpen, setSearchOpen } = useNavigation()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const stored = localStorage.getItem('recentSearches')
    return stored ? JSON.parse(stored) : []
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchOpen])

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(!searchOpen)
      }

      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen, setSearchOpen])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchOpen, setSearchOpen])

  // Debounced search
  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const timeoutId = setTimeout(() => {
      // Mock search - in real app, this would be an API call
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: `Student: ${query}`,
          subtitle: 'Grade 10, Room 204',
          type: 'student',
          path: '/students/1',
          icon: 'Users'
        },
        {
          id: '2',
          title: `Medication: ${query}`,
          subtitle: 'Active prescription',
          type: 'medication',
          path: '/medications/2',
          icon: 'Pill'
        }
      ]
      setResults(mockResults)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery) return

    // Add to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }, [recentSearches])

  const handleResultClick = useCallback((result: SearchResult) => {
    handleSearch(query)
    navigate(result.path)
    setSearchOpen(false)
    setQuery('')
  }, [query, navigate, setSearchOpen, handleSearch])

  const handleRecentSearchClick = useCallback((search: string) => {
    setQuery(search)
    handleSearch(search)
  }, [handleSearch])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }, [])

  if (!searchOpen) return null

  return (
    <div className="
      fixed inset-0 z-50 overflow-y-auto
      bg-gray-900 bg-opacity-50 dark:bg-opacity-75
      backdrop-blur-sm
      transition-opacity duration-200
    ">
      <div className="min-h-screen px-4 py-16 text-center">
        <div
          ref={modalRef}
          className="
            inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle
            transition-all transform
            bg-white dark:bg-gray-800 rounded-lg shadow-xl
          "
        >
          {/* Search Input */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students, records, medications..."
              className="
                flex-1 px-4 py-4 text-sm
                bg-transparent border-none outline-none
                text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400
              "
              aria-label="Search"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto p-2">
            {query && results.length > 0 ? (
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Results
                </div>
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="
                      w-full flex items-center justify-between px-3 py-2 rounded-md
                      text-left hover:bg-gray-100 dark:hover:bg-gray-700
                      transition-colors duration-150
                    "
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 ml-2" />
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No results found for "{query}"
              </div>
            ) : (
              <div>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Recent Searches
                      </div>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                      >
                        Clear
                      </button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(search)}
                        className="
                          w-full flex items-center px-3 py-2 rounded-md
                          text-left hover:bg-gray-100 dark:hover:bg-gray-700
                          transition-colors duration-150
                        "
                      >
                        <Clock className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Popular
                  </div>
                  <button
                    onClick={() => setQuery('students')}
                    className="
                      w-full flex items-center px-3 py-2 rounded-md
                      text-left hover:bg-gray-100 dark:hover:bg-gray-700
                      transition-colors duration-150
                    "
                  >
                    <TrendingUp className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">All Students</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="
            border-t border-gray-200 dark:border-gray-700
            px-4 py-2 flex items-center justify-between
            text-xs text-gray-500 dark:text-gray-400
          ">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">↵</kbd>
                to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">ESC</kbd>
                to close
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar
