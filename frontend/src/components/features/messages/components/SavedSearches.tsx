/**
 * Saved searches panel component
 */

'use client';

import { X } from 'lucide-react';
import { SavedSearch } from './types';
import { formatDate } from './utils/searchHelpers';

interface SavedSearchesProps {
  savedSearches: SavedSearch[];
  onLoad: (savedSearch: SavedSearch) => void;
  onDelete: (searchId: string) => void;
  onClose: () => void;
}

export function SavedSearches({
  savedSearches,
  onLoad,
  onDelete,
  onClose,
}: SavedSearchesProps) {
  return (
    <div className="p-4 border-b border-gray-200 bg-blue-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Saved Searches</h3>
        <button
          onClick={onClose}
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
                  onClick={() => onLoad(savedSearch)}
                  className="text-left"
                >
                  <div className="text-sm font-medium text-gray-900">{savedSearch.name}</div>
                  <div className="text-xs text-gray-500">
                    Last used: {formatDate(savedSearch.lastUsed)}
                  </div>
                </button>
              </div>
              <button
                onClick={() => onDelete(savedSearch.id)}
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
  );
}

interface SaveSearchDialogProps {
  saveSearchName: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function SaveSearchDialog({
  saveSearchName,
  onNameChange,
  onSave,
  onClose,
}: SaveSearchDialogProps) {
  return (
    <div className="p-4 border-b border-gray-200 bg-green-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Save Search</h3>
        <button
          onClick={onClose}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && onSave()}
          autoFocus
        />
        <button
          onClick={onSave}
          disabled={!saveSearchName.trim()}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}
