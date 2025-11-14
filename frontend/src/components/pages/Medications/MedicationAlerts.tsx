'use client';

import React, { useState, useMemo } from 'react';
import type {
  MedicationAlertsProps,
  AlertFilters,
  AlertSortBy,
  SortOrder
} from './medicationAlerts.types';
import {
  filterAlerts,
  sortAlerts,
  calculateAlertStats
} from './medicationAlerts.utils';
import { AlertStatistics } from './AlertStatistics';
import { AlertFilters as AlertFiltersComponent } from './AlertFilters';
import { AlertList } from './AlertList';
import { AlertSettingsModal } from './AlertSettingsModal';

/**
 * MedicationAlerts component for managing medication alerts and notifications
 *
 * Features:
 * - Real-time alert notifications and management
 * - Multiple alert types (expiration, low stock, missed doses, etc.)
 * - Priority-based alert categorization
 * - Bulk acknowledgment and action capabilities
 * - Alert filtering and search functionality
 * - Action tracking and history
 * - Customizable alert settings
 * - Integration with medication and student data
 *
 * @param props - The component props
 * @returns JSX element representing the medication alerts interface
 */
export function MedicationAlerts({
  alerts = [],
  loading = false,
  error,
  onAcknowledgeAlert,
  onDismissAlert,
  onTakeAction,
  onBulkAcknowledge,
  onUpdateSettings
}: MedicationAlertsProps) {
  // State management
  const [filters, setFilters] = useState<AlertFilters>({
    type: 'all',
    priority: 'all',
    status: 'all',
    timeRange: 'all',
    searchTerm: ''
  });
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [sortBy, setSortBy] = useState<AlertSortBy>('priority');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  /**
   * Filter and sort alerts
   */
  const filteredAndSortedAlerts = useMemo(() => {
    const filtered = filterAlerts(alerts, filters);
    return sortAlerts(filtered, sortBy, sortOrder);
  }, [alerts, filters, sortBy, sortOrder]);

  /**
   * Calculate alert statistics
   */
  const alertStats = useMemo(() => {
    return calculateAlertStats(alerts);
  }, [alerts]);

  /**
   * Toggle alert selection
   */
  const toggleAlertSelection = (alertId: string) => {
    setSelectedAlerts(prev =>
      prev.includes(alertId)
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  /**
   * Select all visible alerts
   */
  const selectAllAlerts = () => {
    setSelectedAlerts(filteredAndSortedAlerts.map(alert => alert.id));
  };

  /**
   * Clear alert selection
   */
  const clearSelection = () => {
    setSelectedAlerts([]);
  };

  /**
   * Toggle sort order
   */
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  /**
   * Handle bulk acknowledge
   */
  const handleBulkAcknowledge = () => {
    onBulkAcknowledge?.(selectedAlerts);
    clearSelection();
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Alerts</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medication Alerts</h2>
          <p className="mt-1 text-sm text-gray-500">Monitor and manage medication alerts and notifications</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {selectedAlerts.length > 0 && (
            <button
              onClick={handleBulkAcknowledge}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Acknowledge Selected ({selectedAlerts.length})
            </button>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Settings
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <AlertStatistics stats={alertStats} />

      {/* Filters */}
      <AlertFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Alerts List */}
      <AlertList
        alerts={filteredAndSortedAlerts}
        selectedAlerts={selectedAlerts}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSelectAll={selectAllAlerts}
        onClearSelection={clearSelection}
        onSortByChange={setSortBy}
        onSortOrderChange={toggleSortOrder}
        onToggleSelection={toggleAlertSelection}
        onAcknowledge={onAcknowledgeAlert}
        onDismiss={onDismissAlert}
        onTakeAction={onTakeAction}
      />

      {/* Settings Modal */}
      <AlertSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={onUpdateSettings}
      />
    </div>
  );
}

export default MedicationAlerts;
