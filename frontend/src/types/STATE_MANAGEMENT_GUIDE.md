# State Management Type System Guide

## Overview

This guide provides comprehensive documentation for the state management type system implemented in `state.ts`. These types provide enterprise-grade type safety for Redux store slices, React Context, and form state management throughout the White Cross healthcare platform.

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Utility State Types](#utility-state-types)
3. [Redux Store State](#redux-store-state)
4. [React Context States](#react-context-states)
5. [Action Payload Types](#action-payload-types)
6. [State Guard Functions](#state-guard-functions)
7. [Best Practices](#best-practices)
8. [Examples](#examples)

## Core Concepts

### Type Safety Philosophy

The state management system follows these principles:

1. **Compile-time Safety**: All state shapes are known at compile time
2. **Immutability**: State types encourage immutable updates
3. **Composability**: Generic types allow reuse across different domains
4. **Predictability**: Consistent patterns across all state slices
5. **Documentation**: Self-documenting types with comprehensive JSDoc comments

## Utility State Types

### RequestStatus

```typescript
type RequestStatus = 'idle' | 'pending' | 'succeeded' | 'failed';
```

Tracks the lifecycle state of asynchronous operations. Use this for any async request.

**States:**
- `idle`: Initial state, never loaded
- `pending`: Request in progress
- `succeeded`: Request completed successfully
- `failed`: Request failed with error

### LoadingState<T>

```typescript
interface LoadingState<T = string> {
  status: RequestStatus;
  isLoading: boolean;
  error: T | null;
  lastFetch?: number;
  startedAt?: number;
  completedAt?: number;
}
```

Comprehensive loading state with timestamps for cache management.

**Use Cases:**
- Track API request lifecycle
- Implement cache invalidation
- Show loading indicators
- Display error messages
- Calculate request duration

**Example:**
```typescript
const loadingState = createInitialLoadingState<ErrorState>();

// During request
loadingState.status = 'pending';
loadingState.isLoading = true;
loadingState.startedAt = Date.now();

// On success
loadingState.status = 'succeeded';
loadingState.isLoading = false;
loadingState.lastFetch = Date.now();
loadingState.completedAt = Date.now();
```

### ErrorState

```typescript
interface ErrorState {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
  timestamp?: number;
  stack?: string;
  validationErrors?: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
}
```

Rich error information for debugging and user feedback.

**Use Cases:**
- Display user-friendly error messages
- Log errors with context
- Show field-specific validation errors
- Track error patterns

### EntityState<T>

```typescript
interface EntityState<T extends { id: string }> {
  ids: string[];
  entities: Record<string, T>;
}
```

Normalized entity storage pattern (inspired by Redux Toolkit's EntityAdapter).

**Benefits:**
- O(1) lookup by ID
- Easy updates without array iteration
- Efficient memory usage
- Prevents duplicate entities

**Example:**
```typescript
const incidents: EntityState<IncidentReport> = {
  ids: ['1', '2', '3'],
  entities: {
    '1': { id: '1', description: 'Fall on playground', ... },
    '2': { id: '2', description: 'Allergic reaction', ... },
    '3': { id: '3', description: 'Sports injury', ... },
  }
};

// Fast lookup
const incident = incidents.entities['2']; // O(1)

// Iterate in order
incidents.ids.forEach(id => {
  const incident = incidents.entities[id];
  console.log(incident.description);
});
```

### FilterState<T>

```typescript
interface FilterState<T extends Record<string, unknown>> {
  filters: Partial<T>;
  activeFilters: Array<keyof T>;
  isFiltered: boolean;
  presets?: Array<{
    id: string;
    name: string;
    filters: Partial<T>;
  }>;
}
```

Generic filter state with preset support.

**Example:**
```typescript
interface IncidentFilters {
  type?: IncidentType;
  severity?: IncidentSeverity;
  dateFrom?: string;
  dateTo?: string;
}

const filterState: FilterState<IncidentFilters> = {
  filters: { type: 'INJURY', severity: 'HIGH' },
  activeFilters: ['type', 'severity'],
  isFiltered: true,
  presets: [
    {
      id: 'critical',
      name: 'Critical Incidents',
      filters: { severity: 'CRITICAL' }
    }
  ]
};
```

### SelectionState<T>

```typescript
interface SelectionState<T extends { id: string }> {
  selectedIds: string[];
  selectedItems: T[];
  selectAll: boolean;
  count: number;
  excludedIds?: Set<string>;
}
```

Tracks selected items with "select all" support.

**Use Cases:**
- Bulk actions (delete, export, assign)
- Multi-select lists
- Batch operations

### PaginationState

```typescript
interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

Complete pagination metadata.

### FormState<T>

```typescript
interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  formError?: string;
}
```

Comprehensive form state for complex forms.

## Redux Store State

### RootState

The complete Redux store shape:

```typescript
interface RootState {
  auth: AuthState;
  incidentReports: IncidentReportsState;
  witnessStatements: WitnessStatementsState;
  followUpActions: FollowUpActionsState;
  ui: UIState;
  navigation: NavigationState;
  cache: CacheState;
}
```

### Slice States

Each slice has a well-defined structure:

- **IncidentReportsState**: Manages incident reports with pagination, filtering, and selection
- **WitnessStatementsState**: Tracks witness statements grouped by incident
- **FollowUpActionsState**: Manages follow-up actions with priority/status filters
- **UIState**: Global UI state (modals, toasts, loading overlays, sidebar)
- **NavigationState**: Navigation history and breadcrumbs
- **CacheState**: Client-side cache with TTL and tagging

## React Context States

### Context Pattern

All contexts follow this pattern:

```typescript
interface XxxContextState {
  // Data
  items: Xxx[];

  // Status
  isLoading: boolean;
  error: ErrorState | null;

  // Actions
  addItem: (item: Omit<Xxx, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<Xxx>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}
```

### Available Contexts

- **WitnessStatementContextState**: Witness statement operations
- **FollowUpActionContextState**: Follow-up action management
- **FilterContextState<T>**: Generic filter context
- **ModalContextState**: Modal stack management

## Action Payload Types

### Naming Convention

Action payloads follow the pattern `XxxActionPayloads`:

```typescript
interface IncidentReportActionPayloads {
  fetchIncidents: { page?: number; limit?: number; ... };
  fetchIncidentsSuccess: { incidents: IncidentReport[]; pagination: PaginationState };
  fetchIncidentsFailure: ErrorState;
  createIncident: Omit<IncidentReport, 'id' | 'createdAt' | 'updatedAt'>;
  // ... more actions
}
```

### Usage in Reducers

```typescript
reducers: {
  setFilters: (
    state,
    action: PayloadAction<IncidentReportActionPayloads['setFilters']>
  ) => {
    // Implementation
  }
}
```

## State Guard Functions

### isLoadingState(state)

Checks if state is currently loading:

```typescript
if (isLoadingState(state.loading)) {
  return <Spinner />;
}
```

### isErrorState(state)

Type guard that narrows error to non-null:

```typescript
if (isErrorState(state.loading)) {
  // TypeScript knows state.loading.error is not null here
  return <ErrorMessage error={state.loading.error} />;
}
```

### hasData(state)

Checks if data has been successfully loaded:

```typescript
if (hasData(state.loading)) {
  return <DataList data={data} />;
}
```

### isStale(state, maxAge)

Checks if cached data should be refetched:

```typescript
if (isStale(state.loading, 5 * 60 * 1000)) { // 5 minutes
  dispatch(fetchIncidents());
}
```

### isIdleState(state)

Checks if state has never been loaded:

```typescript
if (isIdleState(state.loading)) {
  dispatch(fetchIncidents());
}
```

## Best Practices

### 1. Use Helper Functions for Initial State

```typescript
// ✅ Good
const initialState: IncidentReportsState = {
  entities: createInitialEntityState<IncidentReport>(),
  loading: createInitialLoadingState<ErrorState>(),
  pagination: createInitialPaginationState(20),
  // ...
};

// ❌ Bad
const initialState: IncidentReportsState = {
  entities: { ids: [], entities: {} },
  loading: { status: 'idle', isLoading: false, error: null },
  // ... prone to errors
};
```

### 2. Always Type Async Thunks

```typescript
// ✅ Good
const fetchIncidents: AppAsyncThunk<
  { incidents: IncidentReport[] },
  { page: number }
> = createAsyncThunk<
  { incidents: IncidentReport[] },
  { page: number },
  AsyncThunkConfig
>('incidents/fetch', async (params, { rejectWithValue }) => {
  // Implementation
});

// ❌ Bad - no type safety
const fetchIncidents = createAsyncThunk(
  'incidents/fetch',
  async (params: any) => {
    // No type checking
  }
);
```

### 3. Use State Guards in Components

```typescript
// ✅ Good
function IncidentList() {
  const state = useAppSelector(state => state.incidentReports);

  if (isLoadingState(state.loading)) {
    return <LoadingSpinner />;
  }

  if (isErrorState(state.loading)) {
    return <ErrorDisplay error={state.loading.error} />;
  }

  if (!hasData(state.loading)) {
    return <EmptyState />;
  }

  return <List items={state.entities.ids} />;
}

// ❌ Bad - manual checks
function IncidentList() {
  const state = useAppSelector(state => state.incidentReports);

  if (state.loading.status === 'pending') { // Less maintainable
    return <LoadingSpinner />;
  }
  // ...
}
```

### 4. Normalize Entity Data

```typescript
// ✅ Good - normalized
interface State {
  entities: EntityState<IncidentReport>;
}

// ❌ Bad - array of entities
interface State {
  incidents: IncidentReport[]; // Hard to update, O(n) lookups
}
```

### 5. Use Partial for Optional Filters

```typescript
// ✅ Good
interface FilterState<T extends Record<string, unknown>> {
  filters: Partial<T>; // All filters are optional
}

// ❌ Bad
interface FilterState {
  filters: {
    type?: IncidentType;
    severity?: IncidentSeverity;
    // ... repeating ? everywhere
  };
}
```

## Examples

See `state.examples.ts` for comprehensive examples including:

1. Creating a Redux slice with state types
2. Using state guard functions in components
3. Implementing React Context with state types
4. Form state management with FormState
5. Creating typed selectors
6. Building custom hooks with state types

## Migration Guide

### From Untyped State

```typescript
// Before
const initialState = {
  data: [],
  loading: false,
  error: null
};

// After
const initialState: IncidentReportsState = {
  entities: createInitialEntityState<IncidentReport>(),
  loading: createInitialLoadingState<ErrorState>(),
  // ... other properties
};
```

### From Basic Types

```typescript
// Before
interface State {
  isLoading: boolean;
  error: string | null;
}

// After
interface State {
  loading: LoadingState<ErrorState>;
}
```

## Performance Considerations

### Entity Normalization

Normalized entities provide O(1) lookup complexity:

```typescript
// O(n) - Bad for large arrays
const incident = incidents.find(i => i.id === targetId);

// O(1) - Good with normalized entities
const incident = incidents.entities[targetId];
```

### State Slicing

Only subscribe to needed state:

```typescript
// ❌ Bad - re-renders on any incident state change
const state = useAppSelector(state => state.incidentReports);

// ✅ Good - only re-renders when loading changes
const loading = useAppSelector(state => state.incidentReports.loading);
```

## Troubleshooting

### Common Type Errors

**Error**: "Type instantiation is excessively deep"
- Solution: Simplify generic type constraints or use type aliases

**Error**: "Cannot be used as a value"
- Solution: Import functions separately from type imports

**Error**: "Property does not exist on type"
- Solution: Ensure state shape matches defined interface

## Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## Maintenance

When adding new state slices:

1. Define state interface extending from utility types
2. Create initial state using helper functions
3. Define action payload types
4. Implement properly typed async thunks
5. Create selector functions
6. Export from `types/index.ts`
7. Update this documentation

---

**Last Updated**: 2025-10-11
**Maintained By**: White Cross Development Team
**Related Files**:
- `frontend/src/types/state.ts` - Type definitions
- `frontend/src/types/state.examples.ts` - Usage examples
- `frontend/src/stores/reduxStore.ts` - Redux store configuration
