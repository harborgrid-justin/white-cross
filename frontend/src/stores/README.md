# Redux Store Documentation

## Overview

This directory contains the Redux store configuration for the White Cross healthcare platform. The store is properly configured with enterprise-grade features including state persistence, cross-tab synchronization, and HIPAA-compliant data handling.

## Architecture

```
stores/
├── index.ts                    # Central export module
├── reduxStore.ts              # Store configuration with middleware
├── hooks/
│   └── reduxHooks.ts          # Typed hooks and action creators
└── slices/
    ├── authSlice.ts           # Authentication state management
    └── incidentReportsSlice.ts # Incident reports state management
```

## Usage

### Basic Imports

```typescript
// Import hooks
import { useAppDispatch, useAppSelector } from '@/stores';

// Import action creators
import { useAuthActions, useIncidentActions } from '@/stores';

// Import types
import type { RootState, AppDispatch } from '@/stores';

// Import selectors
import { selectIncidentReports, selectCurrentIncident } from '@/stores';
```

### Using in Components

#### Auth Example

```typescript
import { useAuthActions, useCurrentUser, useIsAuthenticated } from '@/stores';

function LoginComponent() {
  const { login, logout } = useAuthActions();
  const currentUser = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = async () => {
    await login({ email: 'user@example.com', password: 'password123' });
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {currentUser?.firstName}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

#### Incident Reports Example

```typescript
import {
  useIncidentActions,
  useIncidentReports,
  useIncidentListLoading,
  useIncidentCreating,
} from '@/stores';
import type { CreateIncidentReportRequest } from '@/types/incidents';

function IncidentReportsComponent() {
  const { fetchReports, createReport, setFilters } = useIncidentActions();
  const reports = useIncidentReports();
  const isLoading = useIncidentListLoading();
  const isCreating = useIncidentCreating();

  useEffect(() => {
    // Fetch reports on mount
    fetchReports({ page: 1, limit: 20 });
  }, []);

  const handleCreateReport = async (data: CreateIncidentReportRequest) => {
    await createReport(data);
  };

  const handleFilterChange = () => {
    setFilters({ severity: 'HIGH', status: 'OPEN' });
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {reports.map((report) => (
            <li key={report.id}>{report.description}</li>
          ))}
        </ul>
      )}
      <button onClick={handleFilterChange}>Filter High Severity</button>
    </div>
  );
}
```

### Using Selectors

```typescript
import { useAppSelector } from '@/stores';
import {
  selectIncidentReports,
  selectCriticalIncidents,
  selectReportStatistics,
} from '@/stores';

function AnalyticsComponent() {
  // Use built-in selectors
  const criticalIncidents = useAppSelector(selectCriticalIncidents);
  const stats = useAppSelector(selectReportStatistics);

  // Use custom selector
  const openReports = useAppSelector((state) =>
    state.incidentReports.reports.filter((r) => r.status === 'OPEN')
  );

  return (
    <div>
      <h2>Critical Incidents: {criticalIncidents.length}</h2>
      <h2>Open Reports: {openReports.length}</h2>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
```

### Direct Dispatch (Advanced)

```typescript
import { useAppDispatch } from '@/stores';
import {
  fetchIncidentReports,
  setFilters,
  invalidateIncidentCache,
} from '@/stores';

function AdvancedComponent() {
  const dispatch = useAppDispatch();

  const handleRefresh = () => {
    // Invalidate cache
    dispatch(invalidateIncidentCache());

    // Fetch fresh data
    dispatch(fetchIncidentReports({ page: 1, limit: 20 }));
  };

  const handleFilterUpdate = () => {
    dispatch(setFilters({ severity: 'CRITICAL' }));
  };

  return (
    <div>
      <button onClick={handleRefresh}>Refresh Data</button>
      <button onClick={handleFilterUpdate}>Show Critical Only</button>
    </div>
  );
}
```

## Available Hooks

### Base Hooks

- `useAppDispatch()` - Typed dispatch hook
- `useAppSelector(selector)` - Typed selector hook

### Auth Hooks

- `useCurrentUser()` - Get current authenticated user
- `useIsAuthenticated()` - Check if user is authenticated
- `useAuthLoading()` - Get auth loading state
- `useAuthError()` - Get auth error state
- `useAuthActions()` - Get all auth action creators

### Incident Reports Hooks

#### Data Hooks
- `useIncidentReports()` - Get all incident reports
- `useCurrentIncident()` - Get selected incident report
- `useWitnessStatements()` - Get witness statements
- `useFollowUpActions()` - Get follow-up actions
- `useIncidentSearchResults()` - Get search results

#### UI State Hooks
- `useIncidentFilters()` - Get current filters
- `useIncidentSearchQuery()` - Get search query
- `useIncidentSortConfig()` - Get sort configuration
- `useIncidentViewMode()` - Get view mode
- `useIncidentPagination()` - Get pagination metadata

#### Loading State Hooks
- `useIncidentListLoading()` - Check if list is loading
- `useIncidentDetailLoading()` - Check if detail is loading
- `useIncidentCreating()` - Check if creating
- `useIncidentUpdating()` - Check if updating
- `useIncidentDeleting()` - Check if deleting

#### Action Hook
- `useIncidentActions()` - Get all incident action creators

## Store Configuration

### State Persistence

The store uses the `stateSyncMiddleware` for intelligent state persistence:

- **Auth State**: Persisted to `sessionStorage` (security-focused, session-only)
- **Incident Reports UI**: Persisted to `localStorage` (preferences across sessions)
- **PHI Data**: Automatically excluded from persistence (HIPAA compliance)

### Cross-Tab Synchronization

Incident report UI preferences (filters, sort order, view mode) are synchronized across browser tabs using BroadcastChannel API.

### Security Features

- JWT tokens excluded from persistence
- Protected Health Information (PHI) never persisted
- Automatic state clearing on logout
- HIPAA-compliant data handling

## TypeScript Support

All hooks, actions, and selectors are fully typed:

```typescript
// Types are automatically inferred
const reports = useIncidentReports(); // Type: IncidentReport[]
const user = useCurrentUser(); // Type: User | null
const isLoading = useIncidentListLoading(); // Type: boolean

// Action creators return properly typed promises
const { createReport } = useIncidentActions();
await createReport(data); // Type-checked against CreateIncidentReportRequest
```

## Best Practices

1. **Use Hooks Over Direct Dispatch**: Prefer `useIncidentActions()` over direct dispatch
2. **Leverage Selectors**: Use provided selectors for common data queries
3. **Handle Loading States**: Always check loading states before rendering data
4. **Error Handling**: Monitor error states and provide user feedback
5. **Cache Management**: Use `invalidateCache()` when data needs to be refreshed
6. **Type Safety**: Always use typed hooks (`useAppDispatch`, `useAppSelector`)

## Middleware Stack

1. Redux Toolkit default middleware (thunk, immutable check, serialization check)
2. State Sync Middleware (persistence and cross-tab sync)
3. Redux DevTools (development only)

## Debugging

### Redux DevTools

The store is configured with Redux DevTools in development mode. Access it via the browser extension to:

- Inspect state changes
- Time-travel debugging
- Action replay
- State diff viewing

### Debug Logging

State sync operations are logged in development mode. Enable debug logging:

```typescript
// In browser console
localStorage.debug = 'whitecross:*';
```

### Storage Monitoring

Check storage usage and statistics:

```typescript
import { getStorageStats } from '@/stores';

const stats = getStorageStats();
console.log('Storage usage:', stats);
```

## Testing

When testing components that use Redux:

```typescript
import { Provider } from 'react-redux';
import { store } from '@/stores';
import { render } from '@testing-library/react';

function renderWithRedux(component: React.ReactElement) {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
}

// Use in tests
test('component renders with Redux', () => {
  renderWithRedux(<MyComponent />);
  // ... assertions
});
```

## Migration Guide

If you're migrating from Context API or other state management:

1. Replace context hooks with Redux hooks
2. Move async operations to async thunks
3. Replace local state with Redux state where appropriate
4. Use selectors for derived state
5. Implement optimistic updates for better UX

## Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React-Redux Hooks Documentation](https://react-redux.js.org/api/hooks)
- [Project CLAUDE.md](../../../CLAUDE.md) for project-specific guidelines
