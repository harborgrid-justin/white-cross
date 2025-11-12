/**
 * AlertFilters Component
 *
 * Provides filtering controls for medication alerts including:
 * - Search by text
 * - Filter by alert type
 * - Filter by priority
 * - Filter by acknowledgment status
 * - Filter by time range
 */

import React from 'react';
import type { AlertFiltersProps } from './medicationAlerts.types';

/**
 * AlertFilters component displays filter controls for medication alerts
 *
 * @param props - Component props
 * @returns JSX element with filter controls
 */
export function AlertFilters({ filters, onFiltersChange }: AlertFiltersProps) {
  /**
   * Handle search input change
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchTerm: e.target.value });
  };

  /**
   * Handle type filter change
   */
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, type: e.target.value });
  };

  /**
   * Handle priority filter change
   */
  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, priority: e.target.value });
  };

  /**
   * Handle status filter change
   */
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, status: e.target.value });
  };

  /**
   * Handle time range filter change
   */
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, timeRange: e.target.value });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search-alerts" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            id="search-alerts"
            type="text"
            placeholder="Search alerts..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search medication alerts"
          />
        </div>

        {/* Type Filter */}
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type-filter"
            value={filters.type}
            onChange={handleTypeChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by alert type"
          >
            <option value="all">All Types</option>
            <option value="expiration">Expiration</option>
            <option value="low-stock">Low Stock</option>
            <option value="missed-dose">Missed Dose</option>
            <option value="interaction">Interaction</option>
            <option value="recall">Recall</option>
            <option value="allergy">Allergy</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority-filter"
            value={filters.priority}
            onChange={handlePriorityChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by alert priority"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={handleStatusChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by alert status"
          >
            <option value="all">All Status</option>
            <option value="unacknowledged">Unacknowledged</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="action-required">Action Required</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Time Range Filter */}
        <div>
          <label htmlFor="time-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Time Range
          </label>
          <select
            id="time-filter"
            value={filters.timeRange}
            onChange={handleTimeRangeChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by time range"
          >
            <option value="all">All Time</option>
            <option value="1-hour">Last Hour</option>
            <option value="24-hours">Last 24 Hours</option>
            <option value="7-days">Last 7 Days</option>
            <option value="30-days">Last 30 Days</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default AlertFilters;
