/**
 * Appointment Filters Component
 * Provides filtering and search functionality for appointments
 */

'use client';

import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AppointmentStatus, AppointmentType } from '@/types/domain/appointments';

interface AppointmentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: AppointmentStatus | 'all';
  onStatusChange: (status: AppointmentStatus | 'all') => void;
  typeFilter: AppointmentType | 'all';
  onTypeChange: (type: AppointmentType | 'all') => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFilterCount: number;
  onClearFilters: () => void;
}

export const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  showFilters,
  onToggleFilters,
  activeFilterCount,
  onClearFilters
}) => {
  const statusOptions: Array<{ value: AppointmentStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All Statuses' },
    { value: AppointmentStatus.SCHEDULED, label: 'Scheduled' },
    { value: AppointmentStatus.IN_PROGRESS, label: 'In Progress' },
    { value: AppointmentStatus.COMPLETED, label: 'Completed' },
    { value: AppointmentStatus.CANCELLED, label: 'Cancelled' },
    { value: AppointmentStatus.NO_SHOW, label: 'No Show' },
  ];

  const typeOptions: Array<{ value: AppointmentType | 'all'; label: string }> = [
    { value: 'all', label: 'All Types' },
    { value: AppointmentType.ROUTINE_CHECKUP, label: 'Routine Checkup' },
    { value: AppointmentType.MEDICATION_ADMINISTRATION, label: 'Medication' },
    { value: AppointmentType.INJURY_ASSESSMENT, label: 'Injury Assessment' },
    { value: AppointmentType.ILLNESS_EVALUATION, label: 'Illness Evaluation' },
    { value: AppointmentType.SCREENING, label: 'Screening' },
    { value: AppointmentType.FOLLOW_UP, label: 'Follow-up' },
    { value: AppointmentType.EMERGENCY, label: 'Emergency' },
  ];

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              onSearchChange(e.target.value)
            }
            className="w-full"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <Badge 
              variant="default" 
              className="ml-2 rounded-full h-5 w-5 p-0 flex items-center justify-center"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
          >
            <X className="h-4 w-4 mr-2" aria-hidden="true" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value as AppointmentStatus | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => onTypeChange(e.target.value as AppointmentType | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
