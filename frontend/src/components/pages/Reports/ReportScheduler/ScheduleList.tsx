'use client';

import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Clock, Plus } from 'lucide-react';
import type { ReportSchedule, ScheduleStatus } from '../types';
import ScheduleCard from '../components/ScheduleCard';
import { filterSchedules } from './utils';

/**
 * Props for the ScheduleList component
 */
interface ScheduleListProps {
  /** List of report schedules */
  schedules: ReportSchedule[];
  /** Loading state */
  loading?: boolean;
  /** Callback when schedule action is triggered */
  onScheduleAction: (action: string, schedule: ReportSchedule) => void;
  /** Callback to open create modal */
  onCreateClick: () => void;
}

/**
 * ScheduleList Component
 *
 * Displays a filterable list of report schedules with search and status filtering.
 * Handles the display of schedule cards and manages expanded/collapsed state.
 *
 * @param props - ScheduleList component props
 * @returns JSX element representing the schedule list with filters
 */
export const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  loading = false,
  onScheduleAction,
  onCreateClick
}) => {
  // Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<ScheduleStatus | 'all'>('all');

  // Expanded schedules state
  const [expandedSchedules, setExpandedSchedules] = useState<Record<string, boolean>>({});

  // Apply filters
  const filteredSchedules = filterSchedules(schedules, searchTerm, statusFilter);

  /**
   * Toggles the expanded state of a schedule
   */
  const handleToggleExpanded = (scheduleId: string) => {
    setExpandedSchedules(prev => ({
      ...prev,
      [scheduleId]: !prev[scheduleId]
    }));
  };

  /**
   * Handles search input change
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Handles status filter change
   */
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as ScheduleStatus | 'all');
  };

  return (
    <>
      {/* Filters Bar */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md
                         leading-5 bg-white placeholder-gray-500 focus:outline-none
                         focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500
                         focus:border-blue-500 sm:text-sm"
                placeholder="Search schedules..."
                aria-label="Search schedules"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="stopped">Stopped</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schedules List */}
      <div className="p-6">
        {loading ? (
          // Loading State
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredSchedules.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first report schedule'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={onCreateClick}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700
                         bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Schedule
              </button>
            )}
          </div>
        ) : (
          // Schedule Cards
          <div className="space-y-4">
            {filteredSchedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                isExpanded={expandedSchedules[schedule.id] || false}
                onToggleExpanded={() => handleToggleExpanded(schedule.id)}
                onAction={onScheduleAction}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ScheduleList;
