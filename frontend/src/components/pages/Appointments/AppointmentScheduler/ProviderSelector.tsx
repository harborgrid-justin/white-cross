'use client';

import React from 'react';
import { Search, X, Stethoscope } from 'lucide-react';
import type { Provider } from './types';

/**
 * Props for the ProviderSelector component
 */
interface ProviderSelectorProps {
  /** Available providers */
  providers: Provider[];
  /** Currently selected provider ID */
  selectedProviderId: string;
  /** Search query string */
  searchQuery: string;
  /** Search results */
  searchResults: Provider[];
  /** Whether to show search results dropdown */
  showResults: boolean;
  /** Handler for provider selection */
  onProviderSelect: (providerId: string, providerName: string) => void;
  /** Handler for search input changes */
  onSearchChange: (query: string) => void;
  /** Handler for search focus */
  onSearchFocus: () => void;
  /** Handler for clearing search */
  onClearSearch: () => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * ProviderSelector Component
 *
 * Provides a search interface for selecting healthcare providers with
 * autocomplete functionality and selected provider display.
 *
 * @param props - ProviderSelector component props
 * @returns JSX element representing the provider selector
 */
const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  providers,
  selectedProviderId,
  searchQuery,
  searchResults,
  showResults,
  onProviderSelect,
  onSearchChange,
  onSearchFocus,
  onClearSearch,
  className = ''
}) => {
  const selectedProvider = providers.find(p => p.id === selectedProviderId);
  const displayResults = searchResults.length > 0 ? searchResults : providers.slice(0, 10);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4" id="provider-selection-label">
        Provider
      </h3>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" aria-hidden="true" />
          <label htmlFor="provider-search-input" className="sr-only">
            Search for a provider
          </label>
          <input
            type="text"
            id="provider-search-input"
            placeholder="Search providers..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            onFocus={onSearchFocus}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md
                     focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-labelledby="provider-selection-label"
            aria-autocomplete="list"
            aria-controls="provider-search-results"
            aria-expanded={showResults && displayResults.length > 0}
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              aria-label="Clear provider search"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Provider Search Results */}
        {showResults && displayResults.length > 0 && (
          <div
            id="provider-search-results"
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
            role="listbox"
            aria-label="Provider search results"
          >
            {displayResults.map((provider) => (
              <button
                key={provider.id}
                onClick={() => onProviderSelect(provider.id, provider.name)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50
                         focus:outline-none border-b border-gray-100 last:border-b-0"
                role="option"
                aria-selected={selectedProviderId === provider.id}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    {provider.avatar ? (
                      <img
                        src={provider.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <Stethoscope size={16} className="text-green-600" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {provider.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {provider.title} • {provider.department}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Provider Display */}
      {selectedProvider && (
        <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              {selectedProvider.avatar ? (
                <img
                  src={selectedProvider.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <Stethoscope size={20} className="text-green-600" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {selectedProvider.name}
              </div>
              <div className="text-xs text-gray-600">
                {selectedProvider.title}
              </div>
              <div className="text-xs text-gray-600">
                {selectedProvider.department}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderSelector;
