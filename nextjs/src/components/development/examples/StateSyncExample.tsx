'use client';

/**
 * WF-COMP-015 | StateSyncExample.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react-redux, @/stores/slices/incidentReportsSlice, @/stores/reduxStore
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, functions | Key Features: useState, useEffect, component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * State Synchronization Example Component
 *
 * Demonstrates the usage of state synchronization middleware
 * with practical examples for incident reports filtering and preferences
 *
 * This is an example component showing best practices for using
 * the state sync middleware in the White Cross healthcare platform.
 *
 * @module StateSyncExample
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/stores/reduxStore';
import {
  setFilters,
  setSortOrder,
  setViewMode,
  type SortConfig,
  type ViewMode,
} from '@/stores/slices/incidentReportsSlice';
import { getStorageStats, clearPersistedState } from '@/stores/reduxStore';

/**
 * Example 1: User Preferences Component
 * Demonstrates persisting UI preferences like view mode and sort order
 */
export function UserPreferencesExample() {
  const dispatch = useDispatch();
  const { viewMode, sortConfig } = useSelector(
    (state: RootState) => state.incidentReports
  );

  // These changes are automatically persisted to localStorage
  // and synced across tabs via BroadcastChannel

  const handleViewModeChange = (mode: 'list' | 'grid' | 'detail') => {
    dispatch(setViewMode(mode));
    // ✅ Automatically synced to localStorage (debounced 1000ms)
    // ✅ Broadcasted to other tabs
    // ✅ Restored on page reload
  };

  const handleSortChange = (column: SortConfig['column'], order: SortConfig['order']) => {
    dispatch(setSortOrder({ column, order }));
    // ✅ Automatically synced to localStorage
    // ✅ Available across sessions
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">User Preferences (Persisted)</h3>

      {/* View Mode Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">View Mode</label>
        <div className="flex gap-2">
          {(['list', 'grid', 'detail'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => handleViewModeChange(mode)}
              className={`px-4 py-2 rounded ${
                viewMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          ✅ This preference is saved and restored on reload
        </p>
      </div>

      {/* Sort Order Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Sort By</label>
        <select
          value={sortConfig.column}
          onChange={(e) =>
            handleSortChange(e.target.value as any, sortConfig.order)
          }
          className="px-4 py-2 border rounded mr-2"
        >
          <option value="occurredAt">Date Occurred</option>
          <option value="severity">Severity</option>
          <option value="status">Status</option>
          <option value="reportedAt">Reported Date</option>
        </select>
        <select
          value={sortConfig.order}
          onChange={(e) =>
            handleSortChange(sortConfig.column, e.target.value as any)
          }
          className="px-4 py-2 border rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          ✅ Sort preferences persist across browser sessions
        </p>
      </div>
    </div>
  );
}

/**
 * Example 2: Filter Persistence Component
 * Demonstrates persisting filter state with HIPAA-compliant exclusions
 */
export function FilterPersistenceExample() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.incidentReports);

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value }));
    // ✅ Only UI preferences are persisted
    // ❌ Actual incident data is NOT persisted (HIPAA compliance)
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Filters (Persisted, HIPAA Safe)</h3>

      <div className="space-y-3">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Severity</label>
          <select
            value={filters.severity || ''}
            onChange={(e) => handleFilterChange('severity', e.target.value || undefined)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">All Severities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        {/* Page Size */}
        <div>
          <label className="block text-sm font-medium mb-1">Items per Page</label>
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded">
        <p className="text-sm text-green-800">
          ✅ <strong>HIPAA Compliant:</strong> Only filter preferences are saved,
          not actual incident data or PHI.
        </p>
      </div>
    </div>
  );
}

/**
 * Example 3: Storage Monitoring Component
 * Demonstrates monitoring storage usage and cleanup
 */
export function StorageMonitoringExample() {
  const [stats, setStats] = useState(getStorageStats());

  useEffect(() => {
    // Update stats every 5 seconds
    const interval = setInterval(() => {
      setStats(getStorageStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleClearStorage = () => {
    if (
      confirm(
        'Are you sure you want to clear all persisted state? This will reset your preferences.'
      )
    ) {
      clearPersistedState();
      setStats(getStorageStats());
      alert('Storage cleared successfully!');
    }
  };

  const formatSize = (bytes: number): string => {
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Storage Monitoring</h3>

      {/* LocalStorage Stats */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">LocalStorage (Preferences)</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Used:</span>
            <span className="font-mono">{formatSize(stats.localStorage.used)}</span>
          </div>
          <div className="flex justify-between">
            <span>Available:</span>
            <span className="font-mono">
              {formatSize(stats.localStorage.available)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Usage:</span>
            <span className="font-mono">
              {stats.localStorage.percentage.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              stats.localStorage.percentage > 80
                ? 'bg-red-600'
                : stats.localStorage.percentage > 50
                ? 'bg-yellow-600'
                : 'bg-green-600'
            }`}
            style={{ width: `${Math.min(stats.localStorage.percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* SessionStorage Stats */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">SessionStorage (Auth)</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Used:</span>
            <span className="font-mono">{formatSize(stats.sessionStorage.used)}</span>
          </div>
          <div className="flex justify-between">
            <span>Available:</span>
            <span className="font-mono">
              {formatSize(stats.sessionStorage.available)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Usage:</span>
            <span className="font-mono">
              {stats.sessionStorage.percentage.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              stats.sessionStorage.percentage > 80
                ? 'bg-red-600'
                : stats.sessionStorage.percentage > 50
                ? 'bg-yellow-600'
                : 'bg-green-600'
            }`}
            style={{ width: `${Math.min(stats.sessionStorage.percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Warning */}
      {(stats.localStorage.percentage > 80 || stats.sessionStorage.percentage > 80) && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Warning:</strong> Storage usage is high. Consider clearing
            old data.
          </p>
        </div>
      )}

      {/* Clear Button */}
      <button
        onClick={handleClearStorage}
        className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Clear All Persisted State
      </button>

      <p className="text-xs text-gray-500 mt-2">
        ℹ️ This will reset all preferences and clear cached data
      </p>
    </div>
  );
}

/**
 * Example 4: Cross-Tab Sync Demonstration
 * Shows how changes sync across multiple browser tabs
 */
export function CrossTabSyncExample() {
  const [tabId] = useState(() => Math.random().toString(36).substr(2, 9));
  const viewMode = useSelector((state: RootState) => state.incidentReports.viewMode);
  const filters = useSelector((state: RootState) => state.incidentReports.filters);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Cross-Tab Sync Demo</h3>

      <div className="space-y-3">
        <div className="p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            <strong>Tab ID:</strong> <code>{tabId}</code>
          </p>
        </div>

        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium mb-1">Current State:</p>
          <pre className="text-xs bg-white p-2 rounded overflow-auto">
            {JSON.stringify(
              {
                viewMode,
                filters: {
                  status: filters.status,
                  severity: filters.severity,
                  limit: filters.limit,
                },
              },
              null,
              2
            )}
          </pre>
        </div>

        <div className="p-3 bg-green-50 rounded">
          <p className="text-sm text-green-800">
            <strong>Try this:</strong>
          </p>
          <ol className="text-sm text-green-800 list-decimal ml-4 mt-2 space-y-1">
            <li>Open this page in another tab</li>
            <li>Change the view mode or filters in one tab</li>
            <li>Watch the other tab update automatically</li>
            <li>Changes sync via BroadcastChannel API</li>
          </ol>
        </div>

        <div className="p-3 bg-yellow-50 rounded">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Note:</strong> Auth state is NOT synced across tabs for
            security reasons.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Master Example Component
 * Combines all examples into a single demo page
 */
export default function StateSyncExamplePage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">State Synchronization Examples</h1>
        <p className="text-gray-600">
          Demonstrations of the state sync middleware with cross-tab synchronization,
          persistent preferences, and HIPAA-compliant data handling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserPreferencesExample />
        <FilterPersistenceExample />
        <StorageMonitoringExample />
        <CrossTabSyncExample />
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Key Features:</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>✅ Automatic persistence to localStorage/sessionStorage</li>
          <li>✅ Cross-tab synchronization via BroadcastChannel</li>
          <li>✅ Debounced writes to reduce storage operations</li>
          <li>✅ HIPAA-compliant data exclusion (no PHI persisted)</li>
          <li>✅ State versioning and migration support</li>
          <li>✅ Storage quota monitoring and management</li>
          <li>✅ Conflict resolution strategies</li>
          <li>✅ Custom serializers for complex types</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Documentation:</h3>
        <p className="text-sm text-gray-700 mb-2">
          For detailed usage instructions, see:
        </p>
        <code className="text-xs bg-white px-2 py-1 rounded block">
          F:\temp\white-cross\frontend\src\middleware\STATE_SYNC_USAGE.md
        </code>
      </div>
    </div>
  );
}
