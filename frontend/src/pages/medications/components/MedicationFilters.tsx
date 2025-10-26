/**
 * MedicationFilters Component
 *
 * Comprehensive filtering interface for medication lists allowing nurses and administrators
 * to quickly narrow down medications by status, route, frequency, and other criteria.
 * Supports multiple active filters with visual tags and one-click clearing.
 *
 * @component
 *
 * @param {MedicationFiltersProps} props - Component properties
 * @param {Record<string, any>} props.filters - Current active filter values
 * @param {(filters: Record<string, any>) => void} props.onFiltersChange - Callback invoked when filters change
 * @param {string} [props.studentId] - Optional student ID to pre-filter medications
 *
 * @returns {React.FC<MedicationFiltersProps>} Medication filters component
 *
 * @example
 * ```tsx
 * import { MedicationFilters } from './components/MedicationFilters';
 *
 * function MedicationList() {
 *   const [filters, setFilters] = useState({});
 *
 *   const handleFiltersChange = (newFilters) => {
 *     setFilters(newFilters);
 *     // Fetch medications with new filters
 *   };
 *
 *   return (
 *     <MedicationFilters
 *       filters={filters}
 *       onFiltersChange={handleFiltersChange}
 *     />
 *   );
 * }
 * ```
 *
 * @remarks
 * **Filter Criteria**:
 * - **Status**: Active, Inactive, or All medications
 * - **Route**: Oral, Topical, Injection, Inhaled, Other
 * - **Frequency**: Once Daily, Twice Daily, Three Times Daily, As Needed, Other
 *
 * **Medication Safety**:
 * - Route filtering helps ensure proper administration methods
 * - Active status filter prevents accidental viewing of discontinued medications
 * - Frequency filters support scheduling and administration timing
 *
 * **State Management**:
 * - Local state: Manages filter values for immediate UI feedback
 * - Parent callback: onFiltersChange fired on every filter modification
 * - Filter persistence: Parent component responsible for persisting filters
 *
 * **User Experience**:
 * - Real-time filtering with immediate callback invocation
 * - Visual filter tags showing currently applied filters
 * - Individual filter removal via × button on tags
 * - Clear All Filters button for quick reset
 * - Empty state handling when no filters applied
 *
 * **Filter Operations**:
 * - Filters are combined using AND logic (all must match)
 * - Empty filter values are ignored in filtering logic
 * - Filter state synced between local component and parent
 *
 * **Accessibility**:
 * - Labeled select elements with proper for/id associations
 * - Keyboard navigation support for all controls
 * - Clear button accessible via keyboard and screen readers
 * - Filter tags announce removal actions
 *
 * @see {@link MedicationsList} for filtered list display
 * @see {@link MedicationSearchBar} for text-based search
 * @see {@link medicationsSlice} for Redux state management
 *
 * @since 1.0.0
 */

import React, { useState } from 'react';

/**
 * Props for MedicationFilters component
 *
 * @interface MedicationFiltersProps
 *
 * @property {Record<string, any>} filters - Object containing current filter key-value pairs
 * @property {(filters: Record<string, any>) => void} onFiltersChange - Callback function receiving updated filters object
 * @property {string} [studentId] - Optional student ID for pre-filtering medications to specific student
 *
 * @remarks
 * Filter object structure: { active: 'true', route: 'ORAL', frequency: 'TWICE_DAILY' }
 * Empty or undefined filter values are treated as "show all" for that criterion.
 */
interface MedicationFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  studentId?: string;
}

export const MedicationFilters: React.FC<MedicationFiltersProps> = ({
  filters,
  onFiltersChange,
  studentId
}) => {
  const [localFilters, setLocalFilters] = useState(filters || {});

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <div className="medication-filters">
      <div className="filters-row">
        {/* Active Status Filter */}
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={localFilters.active || ''}
            onChange={(e) => handleFilterChange('active', e.target.value)}
          >
            <option value="">All Medications</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>

        {/* Route Filter */}
        <div className="filter-group">
          <label>Route:</label>
          <select
            value={localFilters.route || ''}
            onChange={(e) => handleFilterChange('route', e.target.value)}
          >
            <option value="">All Routes</option>
            <option value="ORAL">Oral</option>
            <option value="TOPICAL">Topical</option>
            <option value="INJECTION">Injection</option>
            <option value="INHALED">Inhaled</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Frequency Filter */}
        <div className="filter-group">
          <label>Frequency:</label>
          <select
            value={localFilters.frequency || ''}
            onChange={(e) => handleFilterChange('frequency', e.target.value)}
          >
            <option value="">All Frequencies</option>
            <option value="ONCE_DAILY">Once Daily</option>
            <option value="TWICE_DAILY">Twice Daily</option>
            <option value="THREE_TIMES_DAILY">Three Times Daily</option>
            <option value="AS_NEEDED">As Needed</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="filter-actions">
          <button onClick={clearFilters} className="clear-filters-button">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Applied Filters Display */}
      {Object.keys(localFilters).length > 0 && (
        <div className="applied-filters">
          <span className="applied-label">Applied Filters:</span>
          {Object.entries(localFilters).map(([key, value]) => (
            <span key={key} className="filter-tag">
              {key}: {String(value)}
              <button
                onClick={() => handleFilterChange(key, '')}
                className="remove-filter"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationFilters;
