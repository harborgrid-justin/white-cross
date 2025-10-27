'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { X } from 'lucide-react';

/**
 * @fileoverview Student list filtering component with healthcare-specific filters.
 *
 * Provides comprehensive filtering controls for student management including
 * text search, grade level selection, enrollment status, and health record filters.
 * Implements HIPAA-compliant filtering without exposing PHI in filter options.
 *
 * **Core Features:**
 * - Real-time text search across name and student ID
 * - Grade level selection (K-12)
 * - Enrollment status filtering (active, inactive, graduated, transferred)
 * - Health record filters (allergies, medications, immunizations)
 * - Clear/reset all filters functionality
 * - Active filter count display
 * - Loading state support
 *
 * **Healthcare Compliance:**
 * - **HIPAA**: No PHI displayed in filter options (boolean flags only)
 * - **FERPA**: Search queries not logged or stored without consent
 * - Health filters use presence indicators, not medical details
 * - Secure filter parameter transmission
 *
 * **Search Capabilities:**
 * - Student first name, last name, full name
 * - Student ID number
 * - Case-insensitive matching
 * - Partial match support
 * - Real-time results (no debouncing by default - add if needed)
 *
 * **Filter Combination:**
 * - Multiple filters applied with AND logic
 * - Empty filter value treated as "show all"
 * - Independent filter controls
 * - Persistent filter state across navigation (when managed by parent)
 *
 * **Accessibility:**
 * - Form labels properly associated with inputs
 * - Keyboard navigation support
 * - Clear visual focus indicators
 * - Screen reader friendly
 *
 * @module app/(dashboard)/students/_components/StudentFilters
 * @category Components
 * @subcategory Students
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { StudentFilters } from '@/app/(dashboard)/students/_components/StudentFilters';
 *
 * function StudentListPage() {
 *   const [filters, setFilters] = useState<StudentFilterCriteria>({});
 *   const { data: students } = useStudents(filters);
 *
 *   return (
 *     <>
 *       <StudentFilters
 *         filters={filters}
 *         onFilterChange={setFilters}
 *         onReset={() => setFilters({})}
 *       />
 *       <StudentTable students={students} />
 *     </>
 *   );
 * }
 * ```
 */

/**
 * Student filter criteria interface.
 *
 * Defines all available filter parameters for student searches.
 * All fields are optional - empty/undefined values mean no filter applied.
 *
 * @interface StudentFilterCriteria
 *
 * @property {string} [search] - Text search across name and student ID. Case-insensitive partial match
 * @property {string} [gradeLevel] - Grade level filter (K, 1-12). Empty string or undefined = all grades
 * @property {('active'|'inactive'|'graduated'|'transferred'|'')} [status] - Enrollment status filter. Empty string = all statuses
 * @property {boolean|''} [hasAllergies] - Filter for allergy presence. true = with allergies, false = no allergies, '' or undefined = all
 * @property {boolean|''} [hasMedications] - Filter for medication presence. true = with medications, false = no medications, '' or undefined = all
 * @property {boolean|''} [hasImmunizations] - Filter for immunization status. true = complete, false = incomplete, '' or undefined = all
 *
 * @hipaa Health filters use boolean flags only, no PHI details
 * @ferpa Search queries should not be logged without proper consent
 *
 * @example
 * ```tsx
 * // Find all 10th grade active students with allergies
 * const criteria: StudentFilterCriteria = {
 *   gradeLevel: '10',
 *   status: 'active',
 *   hasAllergies: true
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Search for specific student by name or ID
 * const criteria: StudentFilterCriteria = {
 *   search: 'john smith'
 * };
 * ```
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
 * Props for StudentFilters component.
 *
 * @interface StudentFiltersProps
 *
 * @property {StudentFilterCriteria} filters - Current filter values to display in controls
 * @property {(filters: StudentFilterCriteria) => void} onFilterChange - Callback when any filter changes. Receives complete updated filter object
 * @property {() => void} [onReset] - Optional callback when "Clear Filters" is clicked. If not provided, filters will be reset to empty object
 * @property {boolean} [isLoading=false] - Disables all filter controls during data loading
 *
 * @example
 * ```tsx
 * <StudentFilters
 *   filters={currentFilters}
 *   onFilterChange={(newFilters) => {
 *     setFilters(newFilters);
 *     refetchStudents(newFilters);
 *   }}
 *   onReset={() => {
 *     setFilters({});
 *     refetchStudents({});
 *   }}
 *   isLoading={isRefetching}
 * />
 * ```
 */
interface StudentFiltersProps {
  filters: StudentFilterCriteria;
  onFilterChange: (filters: StudentFilterCriteria) => void;
  onReset?: () => void;
  isLoading?: boolean;
}

/**
 * StudentFilters Component
 *
 * Comprehensive filtering interface for student management with healthcare-specific
 * filters. Provides multiple filter types that can be combined for precise student
 * searches while maintaining HIPAA and FERPA compliance.
 *
 * **Filter Types:**
 * 1. **Text Search**: Searches across student name and ID
 * 2. **Grade Level**: Dropdown for K-12 grade selection
 * 3. **Enrollment Status**: Active, inactive, graduated, transferred
 * 4. **Health Filters**:
 *    - Allergies: Students with/without allergy records
 *    - Medications: Students with/without active medications
 *    - Immunizations: Students with complete/incomplete immunizations
 *
 * **User Experience:**
 * - Responsive grid layout (1 column mobile, 4 columns desktop)
 * - Real-time filter application
 * - Active filter count indicator
 * - Disabled state during loading
 * - One-click clear all filters
 * - Persistent filter state (managed by parent)
 *
 * **Healthcare Compliance:**
 * - **HIPAA**: Health filters show presence only, never PHI details
 * - **FERPA**: Search queries not logged to prevent unauthorized access
 * - No medical information in dropdown options
 * - Secure filter transmission to backend
 *
 * **Implementation Notes:**
 * - Search uses local state for immediate UI feedback
 * - Filter changes trigger immediate parent callback
 * - Reset button disabled when no filters active
 * - All dropdowns default to "All" option
 * - Boolean filters map to yes/no/all dropdown values
 *
 * **Performance Considerations:**
 * - Add debouncing for search if backend search is slow (not included by default)
 * - Consider memoizing filter change handlers for large component trees
 * - Reduce re-renders by using controlled filter state
 *
 * @component
 * @param {StudentFiltersProps} props - Component props
 * @returns {JSX.Element} Rendered filter controls
 *
 * @example
 * ```tsx
 * // Basic usage with state management
 * import { StudentFilters } from '@/app/(dashboard)/students/_components/StudentFilters';
 *
 * function StudentManagement() {
 *   const [filters, setFilters] = useState<StudentFilterCriteria>({});
 *   const { data: students, isLoading } = useStudents(filters);
 *
 *   return (
 *     <div>
 *       <StudentFilters
 *         filters={filters}
 *         onFilterChange={setFilters}
 *         isLoading={isLoading}
 *       />
 *       <StudentTable students={students} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With URL persistence (Next.js)
 * function StudentListPage() {
 *   const router = useRouter();
 *   const searchParams = useSearchParams();
 *
 *   const filters = useMemo(() => ({
 *     search: searchParams.get('search') || undefined,
 *     gradeLevel: searchParams.get('grade') || undefined,
 *     status: searchParams.get('status') as StudentFilterCriteria['status'] || undefined
 *   }), [searchParams]);
 *
 *   const handleFilterChange = (newFilters: StudentFilterCriteria) => {
 *     const params = new URLSearchParams();
 *     Object.entries(newFilters).forEach(([key, value]) => {
 *       if (value !== undefined && value !== '') {
 *         params.set(key, String(value));
 *       }
 *     });
 *     router.push(`/students?${params.toString()}`);
 *   };
 *
 *   return <StudentFilters filters={filters} onFilterChange={handleFilterChange} />;
 * }
 * ```
 *
 * @see {@link StudentTable} for displaying filtered results
 * @see {@link StudentFilterCriteria} for filter structure
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
