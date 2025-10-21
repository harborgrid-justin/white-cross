# Incident Reports Redux Slice

Production-grade state management for the White Cross healthcare platform's incident reporting system.

## Overview

The `incidentReportsSlice` provides comprehensive state management for incident reports, witness statements, follow-up actions, and related data. It implements Redux Toolkit best practices with full TypeScript support, optimistic updates, and HIPAA-compliant audit logging.

## Features

- **Complete CRUD Operations**: Create, read, update, and delete incident reports
- **Witness Management**: Add and track witness statements
- **Follow-up Actions**: Manage action items with assignments and due dates
- **Advanced Filtering**: Filter by type, severity, status, date range, student, and more
- **Search Functionality**: Full-text search across incident data
- **Optimistic Updates**: Immediate UI feedback with server reconciliation
- **Normalized State**: Efficient state structure for large datasets
- **Multiple Loading States**: Granular loading indicators for different operations
- **Comprehensive Error Handling**: Detailed error states for each operation
- **Cache Management**: Smart caching with invalidation support
- **Statistics & Analytics**: Built-in selectors for reporting metrics

## Installation

The slice is already integrated into the Redux store at `frontend/src/stores/reduxStore.ts`.

```typescript
import incidentReportsSlice from './slices/incidentReportsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    incidentReports: incidentReportsSlice, // ✅ Already added
  },
});
```

## Quick Start

```typescript
import { useAppDispatch, useAppSelector } from '@/stores/hooks/reduxHooks';
import {
  fetchIncidentReports,
  selectIncidentReports,
  selectIsLoading,
} from '@/stores/slices/incidentReportsSlice';

function IncidentReportsList() {
  const dispatch = useAppDispatch();
  const reports = useAppSelector(selectIncidentReports);
  const isLoading = useAppSelector(selectIsLoading('list'));

  useEffect(() => {
    dispatch(fetchIncidentReports());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {reports.map(report => (
        <div key={report.id}>{report.description}</div>
      ))}
    </div>
  );
}
```

## State Structure

```typescript
interface IncidentReportsState {
  // Data
  reports: IncidentReport[];              // All loaded incident reports
  selectedReport: IncidentReport | null;  // Currently selected report
  witnessStatements: WitnessStatement[];  // Witnesses for selected report
  followUpActions: FollowUpAction[];      // Actions for selected report
  searchResults: IncidentReport[];        // Search results

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };

  // Filters
  filters: IncidentReportFilters;
  searchQuery: string;

  // UI State
  sortConfig: {
    column: 'occurredAt' | 'severity' | 'type' | 'status' | 'reportedAt';
    order: 'asc' | 'desc';
  };
  viewMode: 'list' | 'grid' | 'detail';

  // Loading States
  loading: {
    list: boolean;
    detail: boolean;
    witnesses: boolean;
    actions: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    searching: boolean;
  };

  // Error States
  errors: {
    list: string | null;
    detail: string | null;
    witnesses: string | null;
    actions: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
    search: string | null;
  };

  // Cache Management
  lastFetched: number | null;
  cacheInvalidated: boolean;
}
```

## Async Thunks (API Operations)

### Incident Report Operations

#### `fetchIncidentReports(filters?)`
Fetch incident reports with optional filtering and pagination.

```typescript
dispatch(fetchIncidentReports({
  page: 1,
  limit: 20,
  severity: IncidentSeverity.HIGH,
  dateFrom: '2024-01-01',
  dateTo: '2024-12-31',
  studentId: 'student-123',
}));
```

#### `fetchIncidentReportById(id)`
Fetch a single incident report with full associations.

```typescript
const result = await dispatch(fetchIncidentReportById('report-123'));
if (fetchIncidentReportById.fulfilled.match(result)) {
  console.log('Report loaded:', result.payload);
}
```

#### `createIncidentReport(data)`
Create a new incident report with optimistic updates.

```typescript
const newReport: CreateIncidentReportRequest = {
  studentId: 'student-123',
  reportedById: 'nurse-456',
  type: IncidentType.INJURY,
  severity: IncidentSeverity.MEDIUM,
  description: 'Student fell during recess',
  location: 'Playground',
  actionsTaken: 'Applied ice pack, observed for 30 minutes',
  occurredAt: new Date().toISOString(),
  witnesses: ['teacher-789'],
  parentNotified: true,
  followUpRequired: false,
};

dispatch(createIncidentReport(newReport));
```

#### `updateIncidentReport({ id, data })`
Update an existing incident report.

```typescript
dispatch(updateIncidentReport({
  id: 'report-123',
  data: {
    severity: IncidentSeverity.HIGH,
    followUpRequired: true,
    followUpNotes: 'Schedule follow-up appointment',
  },
}));
```

#### `deleteIncidentReport(id)`
Delete an incident report (use with caution for HIPAA compliance).

```typescript
dispatch(deleteIncidentReport('report-123'));
```

### Search Operations

#### `searchIncidentReports(params)`
Search across incident descriptions, locations, and student names.

```typescript
dispatch(searchIncidentReports({
  query: 'allergic reaction',
  page: 1,
  limit: 20,
}));
```

### Witness Statement Operations

#### `fetchWitnessStatements(incidentReportId)`
Load witness statements for an incident.

```typescript
dispatch(fetchWitnessStatements('report-123'));
```

#### `createWitnessStatement(data)`
Add a new witness statement.

```typescript
dispatch(createWitnessStatement({
  incidentReportId: 'report-123',
  witnessName: 'John Doe',
  witnessType: WitnessType.STAFF,
  witnessContact: 'john.doe@school.edu',
  statement: 'I witnessed the student fall from the swing...',
}));
```

### Follow-up Action Operations

#### `fetchFollowUpActions(incidentReportId)`
Load follow-up actions for an incident.

```typescript
dispatch(fetchFollowUpActions('report-123'));
```

#### `createFollowUpAction(data)`
Create a new follow-up action.

```typescript
dispatch(createFollowUpAction({
  incidentReportId: 'report-123',
  action: 'Schedule follow-up appointment with parents',
  dueDate: '2024-12-31',
  priority: ActionPriority.HIGH,
  assignedTo: 'nurse-456',
}));
```

## Synchronous Actions (Reducers)

### `setFilters(filters)`
Update filter criteria (triggers cache invalidation).

```typescript
dispatch(setFilters({
  severity: IncidentSeverity.CRITICAL,
  status: IncidentStatus.OPEN,
  dateFrom: '2024-01-01',
}));
```

### `setSearchQuery(query)`
Set the search query string.

```typescript
dispatch(setSearchQuery('concussion'));
```

### `setSelectedIncidentReport(report)`
Set the currently active incident report.

```typescript
dispatch(setSelectedIncidentReport(report));
```

### `clearSelectedIncident()`
Clear the selected incident and related data.

```typescript
dispatch(clearSelectedIncident());
```

### `setSortOrder(config)`
Update sort configuration.

```typescript
dispatch(setSortOrder({
  column: 'occurredAt',
  order: 'desc',
}));
```

### `setViewMode(mode)`
Switch between view modes.

```typescript
dispatch(setViewMode('grid')); // 'list' | 'grid' | 'detail'
```

### `clearErrors()`
Clear all error messages.

```typescript
dispatch(clearErrors());
```

### `clearError(key)`
Clear a specific error message.

```typescript
dispatch(clearError('create'));
```

### `resetState()`
Reset to initial state (useful on logout).

```typescript
dispatch(resetState());
```

### `invalidateCache()`
Force cache invalidation for next fetch.

```typescript
dispatch(invalidateCache());
```

### `optimisticUpdateReport({ id, data })`
Optimistically update a report before server confirmation.

```typescript
dispatch(optimisticUpdateReport({
  id: 'report-123',
  data: { status: IncidentStatus.RESOLVED },
}));
```

## Selectors

### Basic Selectors

```typescript
// Get all incident reports
const reports = useAppSelector(selectIncidentReports);

// Get currently selected incident
const incident = useAppSelector(selectCurrentIncident);

// Get witness statements
const witnesses = useAppSelector(selectWitnessStatements);

// Get follow-up actions
const actions = useAppSelector(selectFollowUpActions);

// Get search results
const results = useAppSelector(selectSearchResults);

// Get pagination metadata
const pagination = useAppSelector(selectPagination);

// Get current filters
const filters = useAppSelector(selectFilters);

// Get search query
const query = useAppSelector(selectSearchQuery);

// Get sort configuration
const sortConfig = useAppSelector(selectSortConfig);

// Get view mode
const viewMode = useAppSelector(selectViewMode);
```

### Loading State Selectors

```typescript
// Get all loading states
const loading = useAppSelector(selectLoadingStates);

// Get specific loading state
const isListLoading = useAppSelector(selectIsLoading('list'));
const isCreating = useAppSelector(selectIsLoading('creating'));
const isUpdating = useAppSelector(selectIsLoading('updating'));
```

### Error State Selectors

```typescript
// Get all errors
const errors = useAppSelector(selectErrorStates);

// Get specific error
const listError = useAppSelector(selectError('list'));
const createError = useAppSelector(selectError('create'));
```

### Computed Selectors

```typescript
// Get filtered and sorted reports
const sortedReports = useAppSelector(selectFilteredAndSortedReports);

// Filter by type
const injuries = useAppSelector(selectIncidentsByType(IncidentType.INJURY));

// Filter by severity
const critical = useAppSelector(selectIncidentsBySeverity(IncidentSeverity.CRITICAL));

// Filter by status
const open = useAppSelector(selectIncidentsByStatus(IncidentStatus.OPEN));

// Get incidents requiring follow-up
const needsFollowUp = useAppSelector(selectIncidentsRequiringFollowUp);

// Get incidents with unnotified parents
const unnotified = useAppSelector(selectIncidentsWithUnnotifiedParents);

// Get critical incidents (HIGH or CRITICAL severity)
const criticalIncidents = useAppSelector(selectCriticalIncidents);

// Get statistics
const stats = useAppSelector(selectReportStatistics);
// Returns: { total, byType, bySeverity, byStatus, parentNotificationRate, followUpRate }
```

## Common Patterns

### Pattern 1: List View with Pagination

```typescript
function IncidentReportsList() {
  const dispatch = useAppDispatch();
  const reports = useAppSelector(selectFilteredAndSortedReports);
  const pagination = useAppSelector(selectPagination);
  const isLoading = useAppSelector(selectIsLoading('list'));

  useEffect(() => {
    dispatch(fetchIncidentReports({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ page }));
  };

  return (
    <div>
      {isLoading ? <Spinner /> : (
        <>
          {reports.map(report => <ReportCard key={report.id} report={report} />)}
          <Pagination
            page={pagination.page}
            total={pagination.pages}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
```

### Pattern 2: Detail View with Related Data

```typescript
function IncidentDetailPage({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const incident = useAppSelector(selectCurrentIncident);
  const witnesses = useAppSelector(selectWitnessStatements);
  const actions = useAppSelector(selectFollowUpActions);

  useEffect(() => {
    dispatch(fetchIncidentReportById(id));
    dispatch(fetchWitnessStatements(id));
    dispatch(fetchFollowUpActions(id));

    return () => {
      dispatch(clearSelectedIncident());
    };
  }, [dispatch, id]);

  if (!incident) return <NotFound />;

  return (
    <div>
      <IncidentHeader incident={incident} />
      <WitnessSection statements={witnesses} />
      <ActionsSection actions={actions} />
    </div>
  );
}
```

### Pattern 3: Create Form with Error Handling

```typescript
function CreateIncidentForm() {
  const dispatch = useAppDispatch();
  const isCreating = useAppSelector(selectIsLoading('creating'));
  const error = useAppSelector(selectError('create'));

  const handleSubmit = async (formData: CreateIncidentReportRequest) => {
    try {
      const result = await dispatch(createIncidentReport(formData)).unwrap();
      toast.success('Incident report created successfully');
      navigate(`/incidents/${result.id}`);
    } catch (err) {
      // Error already handled by Redux
      console.error('Failed to create report:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <ErrorAlert message={error} onDismiss={() => dispatch(clearError('create'))} />}
      <Button type="submit" disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create Report'}
      </Button>
    </form>
  );
}
```

### Pattern 4: Dashboard with Statistics

```typescript
function IncidentDashboard() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectReportStatistics);
  const criticalIncidents = useAppSelector(selectCriticalIncidents);
  const needsFollowUp = useAppSelector(selectIncidentsRequiringFollowUp);

  useEffect(() => {
    dispatch(fetchIncidentReports({ limit: 100 }));
  }, [dispatch]);

  return (
    <div>
      <StatCard title="Total Incidents" value={stats.total} />
      <StatCard title="Critical" value={criticalIncidents.length} color="red" />
      <StatCard title="Needs Follow-up" value={needsFollowUp.length} color="yellow" />
      <StatCard title="Parent Notification Rate" value={`${stats.parentNotificationRate.toFixed(1)}%`} />

      <TypeBreakdownChart data={stats.byType} />
      <SeverityBreakdownChart data={stats.bySeverity} />
    </div>
  );
}
```

### Pattern 5: Optimistic Updates

```typescript
function QuickStatusUpdate({ incidentId }: { incidentId: string }) {
  const dispatch = useAppDispatch();

  const handleStatusChange = async (newStatus: IncidentStatus) => {
    // Update UI immediately
    dispatch(optimisticUpdateReport({
      id: incidentId,
      data: { status: newStatus },
    }));

    // Send to server
    try {
      await dispatch(updateIncidentReport({
        id: incidentId,
        data: { status: newStatus },
      })).unwrap();
    } catch (err) {
      // Redux will revert to server state on error
      toast.error('Failed to update status');
    }
  };

  return (
    <StatusDropdown onChange={handleStatusChange} />
  );
}
```

## Best Practices

### 1. Always Use Selectors

```typescript
// ✅ Good
const reports = useAppSelector(selectIncidentReports);

// ❌ Bad
const reports = useAppSelector(state => state.incidentReports.reports);
```

### 2. Use Typed Hooks

```typescript
// ✅ Good
import { useAppDispatch, useAppSelector } from '@/stores/hooks/reduxHooks';

// ❌ Bad
import { useDispatch, useSelector } from 'react-redux';
```

### 3. Handle Async Thunks Properly

```typescript
// ✅ Good - Use .unwrap() for error handling
try {
  const result = await dispatch(createIncidentReport(data)).unwrap();
  navigate(`/incidents/${result.id}`);
} catch (error) {
  // Handle error
}

// ✅ Good - Use matcher functions
const result = await dispatch(createIncidentReport(data));
if (createIncidentReport.fulfilled.match(result)) {
  // Success
} else {
  // Error
}
```

### 4. Clean Up on Unmount

```typescript
useEffect(() => {
  dispatch(fetchIncidentReportById(id));

  return () => {
    dispatch(clearSelectedIncident());
  };
}, [dispatch, id]);
```

### 5. Leverage Optimistic Updates

```typescript
// Update UI immediately, then sync with server
dispatch(optimisticUpdateReport({ id, data }));
dispatch(updateIncidentReport({ id, data }));
```

### 6. Use Specialized Selectors

```typescript
// ✅ Good - Use specialized selector
const criticalIncidents = useAppSelector(selectCriticalIncidents);

// ❌ Bad - Filter in component
const reports = useAppSelector(selectIncidentReports);
const criticalIncidents = reports.filter(r =>
  r.severity === 'HIGH' || r.severity === 'CRITICAL'
);
```

### 7. Handle Loading States

```typescript
const isLoading = useAppSelector(selectIsLoading('list'));
const isCreating = useAppSelector(selectIsLoading('creating'));

if (isLoading) return <Spinner />;
```

### 8. Display Errors Gracefully

```typescript
const error = useAppSelector(selectError('list'));

if (error) {
  return (
    <ErrorAlert
      message={error}
      onDismiss={() => dispatch(clearError('list'))}
    />
  );
}
```

### 9. HIPAA Compliance

- **Never log PHI in production** - The debug logger is automatically disabled in production
- **Implement access controls** - Check user permissions before displaying sensitive data
- **Audit all access** - Log all PHI access in backend audit logs
- **Use secure communication** - All API calls use HTTPS with JWT authentication

### 10. Performance Optimization

```typescript
// Use memoized selectors for expensive computations
const sortedReports = useAppSelector(selectFilteredAndSortedReports);

// Invalidate cache only when necessary
dispatch(invalidateCache());

// Use pagination for large datasets
dispatch(fetchIncidentReports({ page: 1, limit: 20 }));
```

## Type Safety

All operations are fully typed with TypeScript:

```typescript
import type {
  IncidentReport,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  WitnessStatement,
  FollowUpAction,
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
} from '@/types/incidents';

// TypeScript will enforce correct types
const report: IncidentReport = { /* ... */ };
const request: CreateIncidentReportRequest = { /* ... */ };
```

## Testing

Example test for the slice:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import incidentReportsReducer, {
  fetchIncidentReports,
  selectIncidentReports,
} from './incidentReportsSlice';

describe('incidentReportsSlice', () => {
  it('should handle fetchIncidentReports.fulfilled', () => {
    const store = configureStore({
      reducer: { incidentReports: incidentReportsReducer },
    });

    const mockReports = [
      { id: '1', type: 'INJURY', severity: 'MEDIUM' },
      { id: '2', type: 'ILLNESS', severity: 'LOW' },
    ];

    store.dispatch(
      fetchIncidentReports.fulfilled(
        { reports: mockReports, pagination: { page: 1, limit: 20, total: 2, pages: 1 } },
        '',
        undefined
      )
    );

    const reports = selectIncidentReports(store.getState());
    expect(reports).toHaveLength(2);
  });
});
```

## Troubleshooting

### Issue: Reports not loading

```typescript
// Check loading state
const isLoading = useAppSelector(selectIsLoading('list'));
console.log('Is loading:', isLoading);

// Check for errors
const error = useAppSelector(selectError('list'));
console.log('Error:', error);

// Invalidate cache and retry
dispatch(invalidateCache());
dispatch(fetchIncidentReports());
```

### Issue: Stale data

```typescript
// Force refresh
dispatch(invalidateCache());
dispatch(fetchIncidentReports());
```

### Issue: State not updating

```typescript
// Ensure you're using the correct selector
const reports = useAppSelector(selectIncidentReports);

// Check Redux DevTools for action dispatches
```

## Support

For issues or questions:
1. Check the [examples file](./incidentReportsSlice.example.ts)
2. Review Redux DevTools for state changes
3. Check debug logs (enabled in development)
4. Consult the [CLAUDE.md](../../../CLAUDE.md) for project guidelines

## License

Part of the White Cross healthcare platform. All rights reserved.
