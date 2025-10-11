/**
 * Usage Examples for Route-Level State Persistence Hooks
 *
 * Comprehensive examples demonstrating real-world usage patterns
 * for all route state persistence hooks in the White Cross platform.
 *
 * @module hooks/useRouteState.examples
 * @author White Cross Healthcare Platform
 */

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useRouteState,
  usePersistedFilters,
  useNavigationState,
  usePageState,
  useSortState,
} from './useRouteState';

// =====================
// EXAMPLE 1: Basic Search with URL Sync
// =====================

/**
 * Simple search component with URL parameter synchronization.
 * The search term persists in the URL and survives page reloads.
 */
export function SearchExample() {
  const [searchTerm, setSearchTerm, clearSearch] = useRouteState({
    paramName: 'search',
    defaultValue: '',
  });

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search students..."
        className="form-input"
      />
      {searchTerm && (
        <button onClick={clearSearch} className="btn-clear">
          Clear
        </button>
      )}
      <p className="text-sm text-gray-600">
        Current search: {searchTerm || 'None'}
      </p>
    </div>
  );
}

// =====================
// EXAMPLE 2: Multi-Select with Array State
// =====================

/**
 * Multi-select component with array state persisted in URL.
 * Selected IDs are serialized as comma-separated values.
 */
export function MultiSelectExample() {
  const [selectedIds, setSelectedIds] = useRouteState({
    paramName: 'selected',
    defaultValue: [] as string[],
    serialize: (ids) => ids.join(','),
    deserialize: (str) => str ? str.split(',').filter(Boolean) : [],
  });

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="multi-select">
      <div className="selection-info">
        Selected: {selectedIds.length} items
      </div>
      <div className="items">
        {['1', '2', '3', '4', '5'].map((id) => (
          <label key={id} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedIds.includes(id)}
              onChange={() => toggleSelection(id)}
            />
            Item {id}
          </label>
        ))}
      </div>
    </div>
  );
}

// =====================
// EXAMPLE 3: Complex Filters with Validation
// =====================

interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * Date range picker with validation.
 * Ensures end date is not before start date.
 */
export function DateRangeExample() {
  const [dateRange, setDateRange] = useRouteState<DateRange>({
    paramName: 'dateRange',
    defaultValue: { startDate: '', endDate: '' },
    validate: (val): val is DateRange => {
      if (!val || typeof val !== 'object') return false;
      if (!val.startDate || !val.endDate) return true; // Allow empty
      return new Date(val.endDate) >= new Date(val.startDate);
    },
    onValidationError: (error) => {
      console.error('Invalid date range:', error);
      alert('End date must be after start date');
    },
  });

  return (
    <div className="date-range-picker">
      <input
        type="date"
        value={dateRange.startDate}
        onChange={(e) =>
          setDateRange({ ...dateRange, startDate: e.target.value })
        }
        className="form-input"
      />
      <span className="mx-2">to</span>
      <input
        type="date"
        value={dateRange.endDate}
        onChange={(e) =>
          setDateRange({ ...dateRange, endDate: e.target.value })
        }
        className="form-input"
      />
    </div>
  );
}

// =====================
// EXAMPLE 4: Student List with Persisted Filters
// =====================

interface StudentFilters {
  search: string;
  grade: string;
  gender: string;
  status: string;
  hasAllergies: boolean;
}

/**
 * Complete student list page with persisted filters.
 * Filters are saved to localStorage and synced with URL.
 */
export function StudentListExample() {
  const {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    isRestored,
  } = usePersistedFilters<StudentFilters>({
    storageKey: 'student-list-filters',
    defaultFilters: {
      search: '',
      grade: '',
      gender: '',
      status: 'active',
      hasAllergies: false,
    },
    debounceMs: 500,
    syncWithUrl: true,
    validate: (filters) => {
      // Ensure status is valid
      return ['active', 'inactive', ''].includes(filters.status);
    },
  });

  // Use filters in API query
  const { data, isLoading } = useQuery({
    queryKey: ['students', filters],
    queryFn: () => fetchStudents(filters),
    enabled: isRestored, // Wait for filters to restore
  });

  return (
    <div className="student-list">
      <div className="filters-panel">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          placeholder="Search students..."
          className="form-input"
        />

        <select
          value={filters.grade}
          onChange={(e) => updateFilter('grade', e.target.value)}
          className="form-select"
        >
          <option value="">All Grades</option>
          <option value="K">Kindergarten</option>
          <option value="1">1st Grade</option>
          <option value="2">2nd Grade</option>
          {/* ... more grades ... */}
        </select>

        <select
          value={filters.gender}
          onChange={(e) => updateFilter('gender', e.target.value)}
          className="form-select"
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="form-select"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="">All</option>
        </select>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.hasAllergies}
            onChange={(e) => updateFilter('hasAllergies', e.target.checked)}
          />
          Has Allergies
        </label>

        <button onClick={clearFilters} className="btn-secondary">
          Clear Filters
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="student-table">
          {/* Render student data */}
          <p>Found {data?.total || 0} students</p>
        </div>
      )}
    </div>
  );
}

// =====================
// EXAMPLE 5: Navigation with State Preservation
// =====================

/**
 * Master-detail navigation with state preservation.
 * Clicking back restores scroll position and filters.
 */
export function StudentDetailsExample() {
  const {
    previousPath,
    previousState,
    navigateBack,
    navigateWithState,
    currentScroll,
  } = useNavigationState();

  const handleViewStudent = (studentId: string) => {
    navigateWithState(`/students/${studentId}`, {
      from: 'list',
      timestamp: Date.now(),
    });
  };

  const handleBackToList = () => {
    // Returns to list with scroll position restored
    navigateBack('/students');
  };

  return (
    <div className="student-details">
      <div className="header">
        <button onClick={handleBackToList} className="btn-back">
          ← Back to List
        </button>
        {previousState && (
          <span className="text-sm text-gray-600">
            From: {previousState.from}
          </span>
        )}
      </div>

      <div className="content">
        {/* Student details content */}
        <p className="text-xs text-gray-500">
          Current scroll: {currentScroll.y}px
        </p>
      </div>

      <div className="actions">
        <button
          onClick={() => handleViewStudent('next-student-id')}
          className="btn-primary"
        >
          View Next Student
        </button>
      </div>
    </div>
  );
}

// =====================
// EXAMPLE 6: Pagination with URL Sync
// =====================

/**
 * Complete pagination example with URL synchronization.
 * Page state is remembered per route and synced with URL.
 */
export function PaginatedListExample() {
  const {
    page,
    pageSize,
    pageSizeOptions,
    setPage,
    setPageSize,
    resetPage,
  } = usePageState({
    defaultPage: 1,
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    resetOnFilterChange: true,
  });

  // Use pagination in API query
  const { data, isLoading } = useQuery({
    queryKey: ['students', page, pageSize],
    queryFn: () => fetchStudents({ page, pageSize }),
  });

  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  return (
    <div className="paginated-list">
      <div className="pagination-controls">
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="form-select"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>

        <button
          onClick={() => setPage(1)}
          disabled={page === 1}
          className="btn-page"
        >
          First
        </button>

        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="btn-page"
        >
          Previous
        </button>

        <span className="page-info">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
          className="btn-page"
        >
          Next
        </button>

        <button
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
          className="btn-page"
        >
          Last
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="results">
          <p>
            Showing {(page - 1) * pageSize + 1} to{' '}
            {Math.min(page * pageSize, data?.total || 0)} of {data?.total || 0}
          </p>
          {/* Render paginated data */}
        </div>
      )}
    </div>
  );
}

// =====================
// EXAMPLE 7: Sortable Table with Persistence
// =====================

type StudentColumn = 'lastName' | 'firstName' | 'grade' | 'dateOfBirth';

/**
 * Sortable table with column sorting and preference persistence.
 * Sort state is saved per route and synced with URL.
 */
export function SortableTableExample() {
  const {
    column,
    direction,
    toggleSort,
    clearSort,
    getSortIndicator,
    getSortClass,
  } = useSortState<StudentColumn>({
    validColumns: ['lastName', 'firstName', 'grade', 'dateOfBirth'],
    defaultColumn: 'lastName',
    defaultDirection: 'asc',
    persistPreference: true,
    storageKey: 'student-table-sort',
  });

  // Use sort state in API query
  const { data, isLoading } = useQuery({
    queryKey: ['students', column, direction],
    queryFn: () => fetchStudents({ sortBy: column, sortDir: direction }),
  });

  // Or sort client-side
  const sortedData = useMemo(() => {
    if (!data?.students) return [];

    const sorted = [...data.students];

    if (!column) return sorted;

    sorted.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return sorted;
  }, [data, column, direction]);

  return (
    <div className="sortable-table">
      <div className="table-controls">
        <button onClick={clearSort} className="btn-secondary">
          Clear Sort
        </button>
        <span className="sort-info">
          Sorted by: {column || 'None'} {direction}
        </span>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th
              onClick={() => toggleSort('lastName')}
              className={`sortable ${getSortClass('lastName')}`}
            >
              Last Name {getSortIndicator('lastName')}
            </th>
            <th
              onClick={() => toggleSort('firstName')}
              className={`sortable ${getSortClass('firstName')}`}
            >
              First Name {getSortIndicator('firstName')}
            </th>
            <th
              onClick={() => toggleSort('grade')}
              className={`sortable ${getSortClass('grade')}`}
            >
              Grade {getSortIndicator('grade')}
            </th>
            <th
              onClick={() => toggleSort('dateOfBirth')}
              className={`sortable ${getSortClass('dateOfBirth')}`}
            >
              Date of Birth {getSortIndicator('dateOfBirth')}
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4}>Loading...</td>
            </tr>
          ) : (
            sortedData.map((student) => (
              <tr key={student.id}>
                <td>{student.lastName}</td>
                <td>{student.firstName}</td>
                <td>{student.grade}</td>
                <td>{student.dateOfBirth}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// =====================
// EXAMPLE 8: Complete Integration
// =====================

/**
 * Complete example integrating all hooks together.
 * This represents a full-featured list page with all state management.
 */
export function CompleteStudentPageExample() {
  // Filters with persistence
  const { filters, updateFilter, clearFilters } = usePersistedFilters<StudentFilters>({
    storageKey: 'students-filters',
    defaultFilters: {
      search: '',
      grade: '',
      gender: '',
      status: 'active',
      hasAllergies: false,
    },
    syncWithUrl: true,
    debounceMs: 300,
  });

  // Pagination
  const { page, pageSize, setPage, setPageSize } = usePageState({
    defaultPageSize: 20,
    resetOnFilterChange: true,
  });

  // Sorting
  const { column, direction, toggleSort } = useSortState<StudentColumn>({
    validColumns: ['lastName', 'firstName', 'grade', 'dateOfBirth'],
    defaultColumn: 'lastName',
    persistPreference: true,
  });

  // Navigation
  const { navigateWithState } = useNavigationState();

  // Combined query
  const { data, isLoading } = useQuery({
    queryKey: ['students', filters, page, pageSize, column, direction],
    queryFn: () =>
      fetchStudents({
        ...filters,
        page,
        pageSize,
        sortBy: column,
        sortDir: direction,
      }),
  });

  const handleViewStudent = (studentId: string) => {
    navigateWithState(`/students/${studentId}`, {
      filters,
      page,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="complete-student-page">
      <header className="page-header">
        <h1>Student Management</h1>
        <button className="btn-primary">Add Student</button>
      </header>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          placeholder="Search..."
        />
        <select
          value={filters.grade}
          onChange={(e) => updateFilter('grade', e.target.value)}
        >
          <option value="">All Grades</option>
          {/* ... grade options ... */}
        </select>
        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => toggleSort('lastName')}>Last Name</th>
            <th onClick={() => toggleSort('firstName')}>First Name</th>
            <th onClick={() => toggleSort('grade')}>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4}>Loading...</td>
            </tr>
          ) : (
            data?.students.map((student: any) => (
              <tr key={student.id}>
                <td>{student.lastName}</td>
                <td>{student.firstName}</td>
                <td>{student.grade}</td>
                <td>
                  <button onClick={() => handleViewStudent(student.id)}>
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}

// =====================
// MOCK API FUNCTIONS
// =====================

/**
 * Mock API function for examples
 */
async function fetchStudents(params: any): Promise<any> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        students: [],
        total: 0,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
      });
    }, 1000);
  });
}
