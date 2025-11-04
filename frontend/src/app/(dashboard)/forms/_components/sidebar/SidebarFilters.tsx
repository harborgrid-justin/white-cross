'use client';

/**
 * Filter Panel component for Forms Sidebar
 * Provides status and type filtering with visual feedback
 */

import React from 'react';
import { Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { FormStatus, FormType, FormFilter } from './sidebar.types';

interface SidebarFiltersProps {
  currentFilter?: FormFilter;
  onFilterChange?: (filter: FormFilter) => void;
}

const STATUS_CONFIGS: Record<
  FormStatus,
  { label: string; count: number; badgeClass: string }
> = {
  published: { label: 'Published', count: 15, badgeClass: 'bg-green-100 text-green-800' },
  draft: { label: 'Draft', count: 3, badgeClass: 'bg-gray-100 text-gray-800' },
  paused: { label: 'Paused', count: 1, badgeClass: 'bg-yellow-100 text-yellow-800' },
  archived: { label: 'Archived', count: 12, badgeClass: 'bg-red-100 text-red-800' },
};

const TYPE_CONFIGS: Record<
  FormType,
  { label: string; count: number; badgeClass: string }
> = {
  health_screening: {
    label: 'Health Screening',
    count: 5,
    badgeClass: 'bg-green-100 text-green-800',
  },
  enrollment: {
    label: 'Enrollment',
    count: 3,
    badgeClass: 'bg-blue-100 text-blue-800',
  },
  incident_report: {
    label: 'Incident Report',
    count: 2,
    badgeClass: 'bg-red-100 text-red-800',
  },
  medical_consent: {
    label: 'Medical Consent',
    count: 4,
    badgeClass: 'bg-purple-100 text-purple-800',
  },
  permission_slip: { label: 'Permission Slip', count: 0, badgeClass: 'bg-blue-100 text-blue-800' },
  emergency_contact: { label: 'Emergency Contact', count: 0, badgeClass: 'bg-red-100 text-red-800' },
  allergy_form: { label: 'Allergy Form', count: 0, badgeClass: 'bg-green-100 text-green-800' },
  medication_authorization: { label: 'Medication Authorization', count: 0, badgeClass: 'bg-purple-100 text-purple-800' },
  assessment: { label: 'Assessment', count: 0, badgeClass: 'bg-purple-100 text-purple-800' },
  survey: { label: 'Survey', count: 0, badgeClass: 'bg-blue-100 text-blue-800' },
  other: { label: 'Other', count: 0, badgeClass: 'bg-gray-100 text-gray-800' },
};

const VISIBLE_TYPES: FormType[] = [
  'health_screening',
  'enrollment',
  'incident_report',
  'medical_consent',
];

export function SidebarFilters({
  currentFilter,
  onFilterChange,
}: SidebarFiltersProps) {
  const handleStatusFilter = (status: FormStatus) => {
    onFilterChange?.({
      ...currentFilter,
      status: currentFilter?.status === status ? undefined : status,
    });
  };

  const handleTypeFilter = (type: FormType) => {
    onFilterChange?.({
      ...currentFilter,
      type: currentFilter?.type === type ? undefined : type,
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-900">Filters</span>
      </div>

      {/* Status Filters */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
          Status
        </p>
        <div className="space-y-1" role="group" aria-label="Status filters">
          {(Object.keys(STATUS_CONFIGS) as FormStatus[]).map((status) => {
            const config = STATUS_CONFIGS[status];
            const isActive = currentFilter?.status === status;

            return (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`flex items-center justify-between w-full px-2 py-1 text-sm rounded hover:bg-gray-50 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600'
                }`}
                aria-pressed={isActive}
              >
                <span className="capitalize">{config.label}</span>
                <Badge className={`${config.badgeClass} text-xs`}>
                  {config.count}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      {/* Type Filters */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
          Form Type
        </p>
        <div className="space-y-1" role="group" aria-label="Form type filters">
          {VISIBLE_TYPES.map((type) => {
            const config = TYPE_CONFIGS[type];
            const isActive = currentFilter?.type === type;

            return (
              <button
                key={type}
                onClick={() => handleTypeFilter(type)}
                className={`flex items-center justify-between w-full px-2 py-1 text-sm rounded hover:bg-gray-50 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600'
                }`}
                aria-pressed={isActive}
              >
                <span>{config.label}</span>
                <Badge className={`${config.badgeClass} text-xs`}>
                  {config.count}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
