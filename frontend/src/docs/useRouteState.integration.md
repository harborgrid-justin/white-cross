# Integration Guide: Route State Persistence Hooks

This guide shows how to integrate the route state persistence hooks into existing White Cross pages.

## Quick Start

### 1. Update Students Page with Hooks

Replace the existing state management in `frontend/src/pages/Students.tsx`:

```typescript
import {
  usePersistedFilters,
  usePageState,
  useSortState,
  useNavigationState,
} from '@/hooks/useRouteState';

export default function Students() {
  const { user } = useAuthContext();

  // Replace existing filter state with persisted filters
  const {
    filters,
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
    },
    debounceMs: 500,
    syncWithUrl: true,
  });

  // Replace existing pagination state
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
  } = usePageState({
    defaultPage: 1,
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50],
    resetOnFilterChange: true,
  });

  // Add sorting with persistence
  const {
    column: sortColumn,
    direction: sortDirection,
    toggleSort,
    getSortIndicator,
  } = useSortState<StudentColumn>({
    validColumns: ['lastName', 'firstName', 'grade', 'studentNumber'],
    defaultColumn: 'lastName',
    defaultDirection: 'asc',
    persistPreference: true,
    storageKey: 'student-sort-preference',
  });

  // Add navigation state tracking
  const { navigateWithState } = useNavigationState();

  // Update API query to use all state
  const { students, loading } = useStudents({
    ...filters,
    page,
    limit: pageSize,
    sortBy: sortColumn,
    sortDir: sortDirection,
  });

  // Update handlers
  const handleSearchChange = (value: string) => {
    updateFilter('search', value);
  };

  const handleGradeChange = (value: string) => {
    updateFilter('grade', value);
  };

  const handleViewDetails = (student: Student) => {
    navigateWithState(`/students/${student.id}`, {
      from: 'list',
      filters,
      page,
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <StudentFilters
        searchTerm={filters.search}
        gradeFilter={filters.grade}
        genderFilter={filters.gender}
        statusFilter={filters.status}
        onSearchChange={(value) => updateFilter('search', value)}
        onGradeFilterChange={(value) => updateFilter('grade', value)}
        onGenderFilterChange={(value) => updateFilter('gender', value)}
        onStatusFilterChange={(value) => updateFilter('status', value)}
        onClearFilters={clearFilters}
      />

      {/* Table with sortable headers */}
      <table className="table">
        <thead>
          <tr>
            <th
              onClick={() => toggleSort('lastName')}
              className="cursor-pointer hover:bg-gray-50"
            >
              Last Name {getSortIndicator('lastName')}
            </th>
            <th
              onClick={() => toggleSort('firstName')}
              className="cursor-pointer hover:bg-gray-50"
            >
              First Name {getSortIndicator('firstName')}
            </th>
            <th
              onClick={() => toggleSort('grade')}
              className="cursor-pointer hover:bg-gray-50"
            >
              Grade {getSortIndicator('grade')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} onClick={() => handleViewDetails(student)}>
              <td>{student.lastName}</td>
              <td>{student.firstName}</td>
              <td>{student.grade}</td>
              <td>
                <button>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <StudentPagination
        currentPage={page}
        perPage={pageSize}
        totalResults={students.length}
        onPageChange={setPage}
        onPerPageChange={setPageSize}
      />
    </div>
  );
}
```

### 2. Update Medications Page

```typescript
import { usePersistedFilters, usePageState, useSortState } from '@/hooks/useRouteState';

export default function Medications() {
  // Medication-specific filters
  const {
    filters,
    updateFilter,
    clearFilters,
  } = usePersistedFilters<MedicationFilters>({
    storageKey: 'medication-filters',
    defaultFilters: {
      search: '',
      type: '',
      status: 'active',
      expiringWithin: '',
    },
    syncWithUrl: true,
  });

  // Pagination
  const { page, pageSize, setPage, setPageSize } = usePageState({
    defaultPageSize: 20,
  });

  // Sorting
  const { column, direction, toggleSort, getSortIndicator } =
    useSortState<MedicationColumn>({
      validColumns: ['medicationName', 'studentName', 'expirationDate', 'dosage'],
      defaultColumn: 'expirationDate',
      defaultDirection: 'asc',
      persistPreference: true,
      storageKey: 'medication-sort',
    });

  // Use in query
  const { data, isLoading } = useMedications({
    ...filters,
    page,
    pageSize,
    sortBy: column,
    sortDir: direction,
  });

  return (
    // Render medications with filters and pagination
  );
}
```

### 3. Update Health Records Page

```typescript
import { usePersistedFilters, usePageState } from '@/hooks/useRouteState';

export default function HealthRecords() {
  // Health record filters
  const { filters, updateFilter, clearFilters } =
    usePersistedFilters<HealthRecordFilters>({
      storageKey: 'health-records-filters',
      defaultFilters: {
        search: '',
        recordType: '',
        dateFrom: '',
        dateTo: '',
      },
      syncWithUrl: true,
      validate: (filters) => {
        // Ensure date range is valid
        if (filters.dateFrom && filters.dateTo) {
          return new Date(filters.dateTo) >= new Date(filters.dateFrom);
        }
        return true;
      },
    });

  const { page, pageSize, setPage, setPageSize } = usePageState();

  return (
    // Render health records
  );
}
```

### 4. Update Incident Reports Page

```typescript
import { usePersistedFilters, usePageState, useSortState } from '@/hooks/useRouteState';

export default function IncidentReports() {
  const { filters, updateFilter, clearFilters } =
    usePersistedFilters<IncidentFilters>({
      storageKey: 'incident-filters',
      defaultFilters: {
        search: '',
        severity: '',
        status: 'pending',
        dateFrom: '',
        dateTo: '',
      },
      syncWithUrl: true,
    });

  const { page, pageSize, setPage, setPageSize } = usePageState({
    defaultPageSize: 15,
  });

  const { column, direction, toggleSort } = useSortState<IncidentColumn>({
    validColumns: ['incidentDate', 'severity', 'status', 'studentName'],
    defaultColumn: 'incidentDate',
    defaultDirection: 'desc', // Most recent first
    persistPreference: true,
    storageKey: 'incident-sort',
  });

  return (
    // Render incidents
  );
}
```

### 5. Add Navigation State to Detail Pages

```typescript
import { useNavigationState } from '@/hooks/useRouteState';

export function StudentDetailsPage() {
  const { studentId } = useParams();
  const {
    previousPath,
    previousState,
    navigateBack,
  } = useNavigationState();

  const handleBackToList = () => {
    // Returns to previous page with state restored
    navigateBack('/students');
  };

  // Can access previous filters and pagination
  const previousFilters = previousState?.filters;
  const previousPage = previousState?.page;

  return (
    <div>
      <button onClick={handleBackToList}>
        ← Back to {previousPath ? 'Previous Page' : 'Students'}
      </button>

      {/* Student details content */}
    </div>
  );
}
```

## Migration Checklist

For each list page:

- [ ] Replace `useState` for filters with `usePersistedFilters`
- [ ] Replace `useState` for pagination with `usePageState`
- [ ] Add `useSortState` for sortable columns
- [ ] Add `useNavigationState` for detail navigation
- [ ] Update URL structure in routes (no breaking changes)
- [ ] Update E2E tests to account for URL params
- [ ] Test localStorage persistence
- [ ] Test browser back/forward navigation
- [ ] Test page reload with state
- [ ] Test sharing URLs with filters

## Type Definitions

Add these types to your page files:

```typescript
// Students page
interface StudentFilters {
  search: string;
  grade: string;
  gender: string;
  status: string;
}

type StudentColumn = 'lastName' | 'firstName' | 'grade' | 'studentNumber';

// Medications page
interface MedicationFilters {
  search: string;
  type: string;
  status: string;
  expiringWithin: string;
}

type MedicationColumn = 'medicationName' | 'studentName' | 'expirationDate' | 'dosage';

// Health Records page
interface HealthRecordFilters {
  search: string;
  recordType: string;
  dateFrom: string;
  dateTo: string;
}

// Incidents page
interface IncidentFilters {
  search: string;
  severity: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

type IncidentColumn = 'incidentDate' | 'severity' | 'status' | 'studentName';
```

## Testing Integration

Update Cypress tests to work with URL parameters:

```typescript
describe('Student List with Persistence', () => {
  it('should persist filters in URL', () => {
    cy.visit('/students');

    // Apply filter
    cy.get('[data-testid="grade-filter"]').select('5');

    // Check URL updated
    cy.url().should('include', 'grade=5');

    // Reload page
    cy.reload();

    // Filter should be restored
    cy.get('[data-testid="grade-filter"]').should('have.value', '5');
  });

  it('should persist sort preference', () => {
    cy.visit('/students');

    // Click sort header
    cy.contains('th', 'Grade').click();

    // Check URL
    cy.url().should('include', 'sortBy=grade');

    // Reload
    cy.reload();

    // Sort should persist
    cy.url().should('include', 'sortBy=grade');
  });

  it('should navigate back with state', () => {
    cy.visit('/students?grade=5&page=2');

    // Click student
    cy.get('[data-testid="student-row"]').first().click();

    // Go back
    cy.get('[data-testid="back-button"]').click();

    // Should restore filters and page
    cy.url().should('include', 'grade=5');
    cy.url().should('include', 'page=2');
  });
});
```

## Gradual Migration Strategy

1. **Phase 1: Students Page (Week 1)**
   - Migrate to new hooks
   - Test thoroughly
   - Monitor for issues

2. **Phase 2: Medications Page (Week 2)**
   - Apply learnings from Phase 1
   - Add medication-specific features

3. **Phase 3: Health Records & Incidents (Week 3)**
   - Migrate remaining list pages
   - Standardize patterns

4. **Phase 4: Detail Pages (Week 4)**
   - Add navigation state
   - Implement back with state

5. **Phase 5: Optimization (Week 5)**
   - Performance tuning
   - Add any missing features
   - Documentation updates

## Common Patterns

### Pattern 1: Combined Filter and Page State

```typescript
const { filters, updateFilter } = usePersistedFilters({ ... });
const { page, setPage } = usePageState({ resetOnFilterChange: true });

// Page automatically resets when filters change
```

### Pattern 2: Shareable URLs

```typescript
// All state is in URL - users can share links
const { filters } = usePersistedFilters({ syncWithUrl: true });
const { page } = usePageState();
const { column, direction } = useSortState();

// Current URL: /students?grade=5&page=2&sortBy=lastName&sortDir=asc
```

### Pattern 3: Quick Filters

```typescript
const { updateFilter } = usePersistedFilters({ ... });

// Quick filter buttons
<button onClick={() => updateFilter('status', 'active')}>
  Active Only
</button>
<button onClick={() => updateFilter('hasAllergies', true)}>
  Has Allergies
</button>
```

### Pattern 4: Bulk Operations

```typescript
const { setFilters } = usePersistedFilters({ ... });

// Apply multiple filters at once
const applyPreset = () => {
  setFilters({
    grade: '5',
    status: 'active',
    hasAllergies: true,
  });
};
```

## Troubleshooting

### Issue: State Not Restoring

Check if `isRestored` is being used in query:

```typescript
const { filters, isRestored } = usePersistedFilters({ ... });

const { data } = useQuery({
  queryKey: ['students', filters],
  queryFn: () => fetchStudents(filters),
  enabled: isRestored, // Add this!
});
```

### Issue: Too Many Renders

Increase debounce delay:

```typescript
const { filters } = usePersistedFilters({
  debounceMs: 500, // Increase from 300
});
```

### Issue: URL Too Long

Don't sync complex objects with URL:

```typescript
const { filters } = usePersistedFilters({
  syncWithUrl: false, // Only use localStorage
});
```

## Next Steps

1. Start with Students page as proof of concept
2. Gather feedback from team
3. Create PR with detailed migration notes
4. Update documentation
5. Train team on new patterns
6. Roll out to remaining pages

## Support

For questions or issues during migration:

1. Check examples in `useRouteState.examples.tsx`
2. Review README in `useRouteState.README.md`
3. Check existing tests for patterns
4. Reach out to frontend architecture team
