/**
 * TypeFilter Component
 *
 * Production-grade multi-select filter for incident types with:
 * - Checkbox-based multi-selection
 * - Visual indication of selection count
 * - Clear all functionality
 * - All incident type options
 *
 * @module pages/incidents/components/TypeFilter
 */

import React from 'react';
import { Select, SelectOption } from '@/components/ui/inputs/Select';
import { IncidentType, getIncidentTypeLabel } from '@/types/incidents';

interface TypeFilterProps {
  /** Currently selected incident types */
  selected: IncidentType[];
  /** Callback when selection changes */
  onChange: (types: IncidentType[]) => void;
  /** Optional CSS class name */
  className?: string;
  /** Whether filter is disabled */
  disabled?: boolean;
  /** Label for the filter */
  label?: string;
}

/**
 * TypeFilter component
 *
 * Multi-select dropdown for filtering incidents by type.
 * Supports all incident types: INJURY, ILLNESS, BEHAVIORAL, MEDICATION_ERROR,
 * ALLERGIC_REACTION, EMERGENCY, OTHER
 *
 * @example
 * ```tsx
 * <TypeFilter
 *   selected={selectedTypes}
 *   onChange={(types) => dispatch(setFilters({ type: types }))}
 * />
 * ```
 */
export const TypeFilter: React.FC<TypeFilterProps> = ({
  selected,
  onChange,
  className = '',
  disabled = false,
  label = 'Incident Type',
}) => {
  // Define all incident type options
  const typeOptions: SelectOption[] = Object.values(IncidentType).map((type) => ({
    value: type,
    label: getIncidentTypeLabel(type),
  }));

  const handleChange = (value: string | number | (string | number)[]) => {
    if (Array.isArray(value)) {
      onChange(value as IncidentType[]);
    } else {
      onChange([value as IncidentType]);
    }
  };

  return (
    <div className={className}>
      <Select
        label={label}
        options={typeOptions}
        value={selected}
        onChange={handleChange}
        placeholder="Select incident types..."
        multiple
        searchable
        clearable
        disabled={disabled}
        size="md"
        variant="default"
      />

      {/* Selection count indicator */}
      {selected.length > 0 && (
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            {selected.length} type{selected.length !== 1 ? 's' : ''} selected
          </span>
        </div>
      )}
    </div>
  );
};

export default TypeFilter;
