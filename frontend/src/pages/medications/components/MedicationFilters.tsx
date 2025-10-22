/**
 * MedicationFilters Component
 * Purpose: Filter controls for medications list
 * Features: Active status, student, medication type, prescriber filters
 */

import React, { useState } from 'react';

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
