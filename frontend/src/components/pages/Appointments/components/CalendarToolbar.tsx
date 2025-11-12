'use client';

/**
 * CalendarToolbar Component
 *
 * Toolbar for the appointment calendar with navigation, view controls,
 * filters, and action buttons.
 */

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  RefreshCw,
  MoreHorizontal,
} from 'lucide-react';
import type { AppointmentStatus } from '../AppointmentCard';
import type { CalendarToolbarProps, CalendarView } from '../types/calendarTypes';
import { getCurrentMonthName } from '../utils/calendarUtils';

/**
 * CalendarToolbar Component
 *
 * Provides navigation, view switching, filtering, and action buttons
 * for the appointment calendar.
 */
const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  currentDate,
  currentView,
  selectedDate,
  filters,
  showFilterMenu,
  showFilters,
  editable,
  loading,
  onNavigate,
  onViewChange,
  onTodayClick,
  onFilterMenuToggle,
  onFilterChange,
  onRefresh,
  onCreateAppointment,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        {/* Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('prev')}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            aria-label="Previous period"
          >
            <ChevronLeft size={20} />
          </button>

          <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
            {getCurrentMonthName(currentDate)}
          </h2>

          <button
            onClick={() => onNavigate('next')}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            aria-label="Next period"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Today Button */}
        <button
          onClick={onTodayClick}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
                   rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
                   focus:ring-blue-500"
        >
          Today
        </button>
      </div>

      <div className="flex items-center space-x-3">
        {/* View Toggle */}
        <div className="flex rounded-md shadow-sm">
          {(['month', 'week', 'day'] as CalendarView[]).map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`
                px-4 py-2 text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500
                ${view === 'month' ? 'rounded-l-md' : view === 'day' ? 'rounded-r-md' : ''}
                ${
                  currentView === view
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        {/* Filter Button */}
        {showFilters && (
          <div className="relative">
            <button
              onClick={onFilterMenuToggle}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Filter appointments"
            >
              <Filter size={20} />
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search appointments..."
                        value={filters.search || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newFilters = { ...filters, search: e.target.value };
                          onFilterChange(newFilters);
                        }}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md
                                 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Status
                    </label>
                    <div className="space-y-2">
                      {['scheduled', 'confirmed', 'completed', 'cancelled'].map((status) => (
                        <label key={status} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              filters.status?.includes(status as AppointmentStatus) || false
                            }
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const currentStatus = filters.status || [];
                              const newStatus = e.target.checked
                                ? [...currentStatus, status as AppointmentStatus]
                                : currentStatus.filter((s) => s !== status);
                              const newFilters = { ...filters, status: newStatus };
                              onFilterChange(newFilters);
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">
                            {status.replace('-', ' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Refresh calendar"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>

        {/* Create Appointment Button */}
        {editable && (
          <button
            onClick={onCreateAppointment}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600
                     border border-transparent rounded-md hover:bg-blue-700 focus:outline-none
                     focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-2" />
            New Appointment
          </button>
        )}

        {/* Export/Import Menu */}
        <div className="relative">
          <button
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            aria-label="More options"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarToolbar;
