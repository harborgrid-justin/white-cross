/**
 * AlertList Component
 *
 * Displays a list of medication alerts with:
 * - List header with count and controls
 * - Bulk selection controls (select all, clear)
 * - Sort controls (sort by, sort order)
 * - Empty state when no alerts
 * - Individual alert items
 */

import React from 'react';
import type { AlertListProps } from './medicationAlerts.types';
import { AlertItem } from './AlertItem';

/**
 * AlertList component displays a list of medication alerts
 *
 * @param props - Component props
 * @returns JSX element representing the alerts list
 */
export function AlertList({
  alerts,
  selectedAlerts,
  sortBy,
  sortOrder,
  onSelectAll,
  onClearSelection,
  onSortByChange,
  onSortOrderChange,
  onToggleSelection,
  onAcknowledge,
  onDismiss,
  onTakeAction
}: AlertListProps) {
  /**
   * Handle sort by change
   */
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortByChange(e.target.value as typeof sortBy);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* List Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Alerts ({alerts.length})
          </h3>
          <div className="flex items-center space-x-4">
            {/* Selection Controls */}
            {alerts.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Select All
                </button>
                {selectedAlerts.length > 0 && (
                  <button
                    onClick={onClearSelection}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear ({selectedAlerts.length})
                  </button>
                )}
              </div>
            )}

            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-by" className="text-sm text-gray-500">Sort by:</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={handleSortByChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Sort alerts by"
              >
                <option value="priority">Priority</option>
                <option value="created">Created</option>
                <option value="type">Type</option>
                <option value="medication">Medication</option>
              </select>
              <button
                onClick={onSortOrderChange}
                className="p-1 text-gray-400 hover:text-gray-600"
                aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                <svg
                  className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {alerts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-10a2 2 0 00-2-2H5a2 2 0 00-2 2v10h3" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No medication alerts match your current filters.
          </p>
        </div>
      ) : (
        /* Alert Items */
        <div className="divide-y divide-gray-200">
          {alerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              isSelected={selectedAlerts.includes(alert.id)}
              onToggleSelection={onToggleSelection}
              onAcknowledge={onAcknowledge}
              onDismiss={onDismiss}
              onTakeAction={onTakeAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AlertList;
