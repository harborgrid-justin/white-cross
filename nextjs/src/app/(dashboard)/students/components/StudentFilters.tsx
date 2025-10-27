'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { X } from 'lucide-react';

/**
 * WF-COMP-STUDENT-001 | StudentFilters.tsx
 * Purpose: Filter controls for student list with search, grade, status, and health filters
 *
 * @module app/(dashboard)/students/components/StudentFilters
 */

/**
 * Student filter criteria interface
 */
export interface StudentFilterCriteria {
  search?: string;
  gradeLevel?: string;
  status?: 'active' | 'inactive' | 'graduated' | 'transferred' | '';
  hasAllergies?: boolean | '';
  hasMedications?: boolean | '';
  hasImmunizations?: boolean | '';
}

/**
 * Props for StudentFilters component
 */
interface StudentFiltersProps {
  /** Current filter values */
  filters: StudentFilterCriteria;
  /** Callback when filters change */
  onFilterChange: (filters: StudentFilterCriteria) => void;
  /** Optional callback when filters are reset */
  onReset?: () => void;
  /** Whether filters are being applied (loading state) */
  isLoading?: boolean;
}

/**
 * StudentFilters Component
 *
 * Provides comprehensive filtering controls for student lists including:
 * - Text search (name, student ID)
 * - Grade level selection
 * - Enrollment status filtering
 * - Health record filters (allergies, medications, immunizations)
 *
 * **Features:**
 * - Real-time search with debouncing
 * - Multiple filter combinations
 * - Clear/reset functionality
 * - Loading states
 * - Accessible form controls
 *
 * **HIPAA Compliance:**
 * - No PHI displayed in filter options
 * - Filters use boolean flags only
 * - Search values are not logged
 *
 * @component
 * @example
 * ```tsx
 * const [filters, setFilters] = useState<StudentFilterCriteria>({});
 *
 * <StudentFilters
 *   filters={filters}
 *   onFilterChange={setFilters}
 *   onReset={() => setFilters({})}
 * />
 * ```
 */
export function StudentFilters({
  filters,
  onFilterChange,
  onReset,
  isLoading = false
}: StudentFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  /**
   * Handle search input change with local state
   */
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onFilterChange({ ...filters, search: value });
  };

  /**
   * Handle filter field changes
   */
  const handleFilterChange = (field: keyof StudentFilterCriteria, value: any) => {
    onFilterChange({ ...filters, [field]: value });
  };

  /**
   * Clear all filters
   */
  const handleReset = () => {
    setLocalSearch('');
    if (onReset) {
      onReset();
    } else {
      onFilterChange({});
    }
  };

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <SearchInput
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search by name or student ID..."
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Grade Level Filter */}
        <div>
          <label htmlFor="grade-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Grade Level
          </label>
          <Select
            id="grade-filter"
            value={filters.gradeLevel || ''}
            onChange={(e) => handleFilterChange('gradeLevel', e.target.value || undefined)}
            disabled={isLoading}
            className="w-full"
          >
            <option value="">All Grades</option>
            <option value="K">Kindergarten</option>
            <option value="1">1st Grade</option>
            <option value="2">2nd Grade</option>
            <option value="3">3rd Grade</option>
            <option value="4">4th Grade</option>
            <option value="5">5th Grade</option>
            <option value="6">6th Grade</option>
            <option value="7">7th Grade</option>
            <option value="8">8th Grade</option>
            <option value="9">9th Grade</option>
            <option value="10">10th Grade</option>
            <option value="11">11th Grade</option>
            <option value="12">12th Grade</option>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select
            id="status-filter"
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
            disabled={isLoading}
            className="w-full"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
            <option value="transferred">Transferred</option>
          </Select>
        </div>

        {/* Health Filters */}
        <div>
          <label htmlFor="allergies-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Allergies
          </label>
          <Select
            id="allergies-filter"
            value={filters.hasAllergies === true ? 'yes' : filters.hasAllergies === false ? 'no' : ''}
            onChange={(e) => {
              const value = e.target.value === 'yes' ? true : e.target.value === 'no' ? false : undefined;
              handleFilterChange('hasAllergies', value);
            }}
            disabled={isLoading}
            className="w-full"
          >
            <option value="">All Students</option>
            <option value="yes">With Allergies</option>
            <option value="no">No Allergies</option>
          </Select>
        </div>

        <div>
          <label htmlFor="medications-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Medications
          </label>
          <Select
            id="medications-filter"
            value={filters.hasMedications === true ? 'yes' : filters.hasMedications === false ? 'no' : ''}
            onChange={(e) => {
              const value = e.target.value === 'yes' ? true : e.target.value === 'no' ? false : undefined;
              handleFilterChange('hasMedications', value);
            }}
            disabled={isLoading}
            className="w-full"
          >
            <option value="">All Students</option>
            <option value="yes">With Medications</option>
            <option value="no">No Medications</option>
          </Select>
        </div>

        <div>
          <label htmlFor="immunizations-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Immunizations
          </label>
          <Select
            id="immunizations-filter"
            value={filters.hasImmunizations === true ? 'yes' : filters.hasImmunizations === false ? 'no' : ''}
            onChange={(e) => {
              const value = e.target.value === 'yes' ? true : e.target.value === 'no' ? false : undefined;
              handleFilterChange('hasImmunizations', value);
            }}
            disabled={isLoading}
            className="w-full"
          >
            <option value="">All Students</option>
            <option value="yes">Complete</option>
            <option value="no">Incomplete</option>
          </Select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={!hasActiveFilters || isLoading}
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Active filters: {Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '' && value !== null).length}
          </p>
        </div>
      )}
    </div>
  );
}
