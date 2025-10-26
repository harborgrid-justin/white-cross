/**
 * StatusFilter Component
 *
 * Production-grade multi-select filter for incident status with:
 * - Checkbox-based multi-selection
 * - All incident status options
 * - Visual indication of selection count
 * - Clear all functionality
 *
 * @module pages/incidents/components/StatusFilter
 */

import React from 'react';
import { Select, SelectOption } from '@/components/ui/inputs/Select';
import { IncidentStatus } from '@/types/incidents';

interface StatusFilterProps {
  /** Currently selected incident statuses */
  selected: IncidentStatus[];
  /** Callback when selection changes */
  onChange: (statuses: IncidentStatus[]) => void;
  /** Optional CSS class name */
  className?: string;
  /** Whether filter is disabled */
  disabled?: boolean;
  /** Label for the filter */
  label?: string;
}

/**
 * StatusFilter component
 *
 * Multi-select dropdown for filtering incidents by status.
 * Supports all incident statuses: OPEN, INVESTIGATING, RESOLVED, CLOSED
 *
 * @example
 * ```tsx
 * <StatusFilter
 *   selected={selectedStatuses}
 *   onChange={(statuses) => dispatch(setFilters({ status: statuses }))}
 * />
 * ```
 */
export const StatusFilter: React.FC<StatusFilterProps> = ({
  selected,
  onChange,
  className = '',
  disabled = false,
  label = 'Incident Status',
}) => {
  // Define all incident status options with human-readable labels
  const statusOptions: SelectOption[] = [
    { value: IncidentStatus.OPEN, label: 'Open' },
    { value: IncidentStatus.INVESTIGATING, label: 'Investigating' },
    { value: IncidentStatus.RESOLVED, label: 'Resolved' },
    { value: IncidentStatus.CLOSED, label: 'Closed' },
  ];

  const handleChange = (value: string | number | (string | number)[]) => {
    if (Array.isArray(value)) {
      onChange(value as IncidentStatus[]);
    } else {
      onChange([value as IncidentStatus]);
    }
  };

  // Get status badge color based on status
  const getStatusColor = (status: IncidentStatus): string => {
    switch (status) {
      case IncidentStatus.OPEN:
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case IncidentStatus.INVESTIGATING:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case IncidentStatus.RESOLVED:
        return 'bg-green-100 text-green-700 border-green-300';
      case IncidentStatus.CLOSED:
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: IncidentStatus): string => {
    return statusOptions.find((opt) => opt.value === status)?.label || status;
  };

  return (
    <div className={className}>
      <Select
        label={label}
        options={statusOptions}
        value={selected}
        onChange={handleChange}
        placeholder="Select incident statuses..."
        multiple
        searchable
        clearable
        disabled={disabled}
        size="md"
        variant="default"
      />

      {/* Selection count indicator and badges */}
      {selected.length > 0 && (
        <div className="mt-2 space-y-1">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            {selected.length} status{selected.length !== 1 ? 'es' : ''} selected
          </span>

          {/* Status badges */}
          <div className="flex flex-wrap gap-1">
            {selected.map((status) => (
              <span
                key={status}
                className={`
                  inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border
                  ${getStatusColor(status)}
                `}
              >
                {getStatusLabel(status)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusFilter;
