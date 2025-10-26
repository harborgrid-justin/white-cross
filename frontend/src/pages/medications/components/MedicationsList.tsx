/**
 * MedicationsList Component
 *
 * Comprehensive medication list view displaying all medications with advanced filtering,
 * text search, pagination, and real-time Redux state synchronization. Supports both
 * school-wide and student-specific medication views with flexible display options.
 *
 * @component
 *
 * @param {MedicationsListProps} props - Component properties
 * @param {string} [props.studentId] - Optional student ID to filter medications for specific student
 * @param {boolean} [props.showActiveOnly=false] - Show only active medications when true
 * @param {string} [props.className] - Additional CSS classes for styling
 *
 * @returns {React.FC<MedicationsListProps>} Medications list component
 *
 * @example
 * ```tsx
 * import { MedicationsList } from './components/MedicationsList';
 *
 * // School-wide medications list
 * function AllMedications() {
 *   return <MedicationsList />;
 * }
 *
 * // Student-specific medications
 * function StudentMedications({ studentId }: { studentId: string }) {
 *   return (
 *     <MedicationsList
 *       studentId={studentId}
 *       showActiveOnly={true}
 *     />
 *   );
 * }
 * ```
 *
 * @remarks
 * **Features**:
 * - Real-time search with debouncing across medication name, student, prescriber
 * - Advanced filtering by status, route, frequency via MedicationFilters component
 * - Pagination with configurable page size (10, 20, 50, 100 items)
 * - Grid display of medication cards with responsive layout
 * - Loading and error states with retry functionality
 * - Empty states with contextual messaging based on filters
 *
 * **Medication Safety**:
 * - Active-only filter prevents viewing discontinued medications
 * - Student-specific view ensures medications displayed for correct patient
 * - Status indicators on each medication card
 * - Quick access to administration workflows
 *
 * **State Management**:
 * - Redux: Fetches medications via fetchMedications thunk
 * - Redux: Manages filters via setMedicationFilters action
 * - Redux: Manages pagination via setMedicationsPagination action
 * - Local state: Search term for immediate UI feedback before Redux dispatch
 * - Auto-refresh: Re-fetches when filters, pagination, studentId, or showActiveOnly change
 *
 * **Data Flow**:
 * 1. Component mounts → useEffect fetches medications with initial params
 * 2. User changes filter → dispatch setMedicationFilters → useEffect refetches
 * 3. User changes page → dispatch setMedicationsPagination → useEffect refetches
 * 4. User searches → local state + dispatch filter → useEffect refetches
 *
 * **Performance**:
 * - Debounced search to minimize API calls
 * - Pagination to limit rendered items
 * - Memoized medication cards (via React.memo on MedicationCard)
 * - Conditional rendering based on loading/error states
 *
 * **User Experience**:
 * - Loading spinner during data fetch
 * - Error state with retry button
 * - Empty state with helpful messaging
 * - Total count badge showing result count
 * - Contextual header (All Medications vs Student Medications)
 *
 * **Accessibility**:
 * - Semantic HTML structure with headings
 * - Search input with placeholder text
 * - Keyboard navigation support
 * - Screen reader friendly error and empty states
 *
 * @see {@link MedicationCard} for individual medication display
 * @see {@link MedicationFilters} for filtering interface
 * @see {@link MedicationsPagination} for pagination controls
 * @see {@link fetchMedications} for Redux thunk
 * @see {@link medicationsSlice} for Redux state management
 *
 * @since 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../stores/reduxStore';
import { fetchMedications, setMedicationFilters, setMedicationsPagination } from '../store/medicationsSlice';
import { MedicationCard } from './MedicationCard';
import { MedicationFilters } from './MedicationFilters';
import { MedicationsPagination } from './MedicationsPagination';

/**
 * Props for MedicationsList component
 *
 * @interface MedicationsListProps
 *
 * @property {string} [studentId] - Student ID to filter medications (undefined = all students)
 * @property {boolean} [showActiveOnly] - When true, only active medications displayed
 * @property {string} [className] - Additional CSS classes for container element
 *
 * @remarks
 * When studentId provided, component displays medications for that student only.
 * showActiveOnly filters applied server-side via API query parameters.
 */
interface MedicationsListProps {
  studentId?: string;
  showActiveOnly?: boolean;
  className?: string;
}

export const MedicationsList: React.FC<MedicationsListProps> = ({
  studentId,
  showActiveOnly = false,
  className = ''
}) => {
  const dispatch = useDispatch();
  const {
    medications,
    loading,
    error,
    filters,
    pagination
  } = useSelector((state: RootState) => state.medications);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch medications on component mount
    dispatch(fetchMedications({ 
      studentId, 
      activeOnly: showActiveOnly,
      ...filters,
      ...pagination 
    }));
  }, [dispatch, studentId, showActiveOnly, filters, pagination]);

  const handleFilterChange = (newFilters: any) => {
    dispatch(setMedicationFilters(newFilters));
  };

  const handlePageChange = (page: number, limit: number) => {
    dispatch(setMedicationsPagination({ page, limit }));
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    dispatch(setMedicationFilters({ ...filters, searchTerm: term }));
  };

  if (loading) {
    return (
      <div className={`medications-list ${className}`}>
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading medications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`medications-list ${className}`}>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Medications</h3>
          <p>{error}</p>
          <button 
            onClick={() => dispatch(fetchMedications({ studentId, activeOnly: showActiveOnly }))}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`medications-list ${className}`}>
      {/* Header */}
      <div className="medications-list-header">
        <div className="title-section">
          <h2>
            {studentId ? 'Student Medications' : 'All Medications'}
            {showActiveOnly && ' (Active Only)'}
          </h2>
          <div className="count-badge">
            {pagination.total} medication{pagination.total !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search medications by name, student, or prescriber..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="search-input"
            />
            <div className="search-icon">🔍</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <MedicationFilters
        filters={filters}
        onFiltersChange={handleFilterChange}
        studentId={studentId}
      />

      {/* Medications Grid */}
      <div className="medications-grid">
        {medications.length > 0 ? (
          medications.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              showStudent={!studentId}
              onStatusChange={() => dispatch(fetchMedications({ studentId, activeOnly: showActiveOnly }))}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">💊</div>
            <h3>No Medications Found</h3>
            <p>
              {searchTerm || Object.keys(filters).length > 0
                ? 'Try adjusting your search or filters'
                : studentId
                ? 'This student has no medications on record'
                : 'No medications have been added yet'
              }
            </p>
            {!studentId && (
              <button className="add-medication-button">
                Add First Medication
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <MedicationsPagination
          currentPage={pagination.page}
          pageSize={pagination.limit}
          totalCount={pagination.total}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default MedicationsList;
