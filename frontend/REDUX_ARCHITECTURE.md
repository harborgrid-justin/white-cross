# Redux Architecture - Visual Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     WHITE CROSS FRONTEND                          │
│                   React 19 + Redux Toolkit 2.9                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         main.tsx                                 │
│                    Application Entry                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          App.tsx                                 │
│              ┌─────────────────────────────┐                    │
│              │   Redux Provider (store)    │                    │
│              │   ↓                         │                    │
│              │   QueryClientProvider       │                    │
│              │   ↓                         │                    │
│              │   AuthProvider              │                    │
│              │   ↓                         │                    │
│              │   BrowserRouter             │                    │
│              │   ↓                         │                    │
│              │   AppRoutes                 │                    │
│              └─────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Redux Store (store)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Root Reducer (combineReducers)               │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │          GLOBAL SLICES (stores/slices/)         │    │  │
│  │  │                                                  │    │  │
│  │  │  • auth          - Authentication               │    │  │
│  │  │  • users         - User management              │    │  │
│  │  │  • districts     - District management          │    │  │
│  │  │  • schools       - School management            │    │  │
│  │  │  • settings      - System settings              │    │  │
│  │  │  • documents     - Document management          │    │  │
│  │  │  • communication - Messaging                    │    │  │
│  │  │  • inventory     - Inventory management         │    │  │
│  │  │  • reports       - Reporting                    │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │       PAGE-SPECIFIC SLICES (pages/*/store/)     │    │  │
│  │  │                                                  │    │  │
│  │  │  • dashboard          - Dashboard data          │    │  │
│  │  │  • students           - Student records         │    │  │
│  │  │  • healthRecords      - Health records          │    │  │
│  │  │  • emergencyContacts  - Emergency contacts      │    │  │
│  │  │  • appointments       - Appointments            │    │  │
│  │  │  • medications        - Medications             │    │  │
│  │  │  • incidentReports    - Incident reports        │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │       ENTERPRISE FEATURES (stores/shared/)      │    │  │
│  │  │                                                  │    │  │
│  │  │  • enterprise      - Bulk operations            │    │  │
│  │  │  • orchestration   - Cross-domain workflows     │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Middleware Stack                       │  │
│  │                                                           │  │
│  │  1. Redux Toolkit Default Middleware                     │  │
│  │     • Thunk middleware (async actions)                   │  │
│  │     • Immutability check (dev only)                      │  │
│  │     • Serializability check                              │  │
│  │                                                           │  │
│  │  2. State Sync Middleware (Custom)                       │  │
│  │     • Cross-tab synchronization (BroadcastChannel)       │  │
│  │     • localStorage/sessionStorage persistence            │  │
│  │     • HIPAA-compliant data exclusion                     │  │
│  │     • Debounced updates                                  │  │
│  │     • Conflict resolution                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Page Components                           │
│                                                                  │
│  Use Typed Hooks:                                               │
│  • useAppDispatch() - Dispatch actions                          │
│  • useAppSelector() - Select state                              │
│                                                                  │
│  Example: Dashboard.tsx                                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  const dispatch = useAppDispatch();                    │    │
│  │  const stats = useAppSelector(state => state.dashboard);│   │
│  │                                                         │    │
│  │  useEffect(() => {                                      │    │
│  │    dispatch(fetchDashboardStats());                     │    │
│  │  }, [dispatch]);                                        │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Action Dispatch Flow

```
Component
   │
   │ dispatch(action)
   ▼
Redux Store
   │
   │ through middleware
   ▼
Reducer
   │
   │ updates state
   ▼
New State
   │
   │ triggers re-render
   ▼
Component (re-renders with new state)
```

### 2. Async Action Flow (Thunks)

```
Component
   │
   │ dispatch(asyncThunk())
   ▼
Redux Thunk Middleware
   │
   │ dispatch(pending)
   ▼
API Call
   │
   ├─── Success ───┐
   │               │ dispatch(fulfilled)
   │               ▼
   │            Reducer
   │               │
   │               ▼
   │          New State (with data)
   │
   └─── Error ────┐
                  │ dispatch(rejected)
                  ▼
               Reducer
                  │
                  ▼
             New State (with error)
```

### 3. State Sync Flow (Cross-Tab)

```
Tab A: User Action
   │
   │ dispatch(action)
   ▼
Redux Store (Tab A)
   │
   │ middleware intercepts
   ▼
State Sync Middleware
   │
   │ serialize & filter sensitive data
   ▼
BroadcastChannel
   │
   │ broadcast to other tabs
   ▼
Tab B: BroadcastChannel Listener
   │
   │ receive message
   ▼
State Sync Middleware (Tab B)
   │
   │ deserialize & validate
   ▼
Redux Store (Tab B)
   │
   │ update state
   ▼
Components (Tab B) re-render
```

## Directory Structure

```
frontend/src/
│
├── main.tsx                        # App entry point
├── App.tsx                         # Root component with providers
│
├── stores/                         # Redux store
│   ├── reduxStore.ts              # Store configuration
│   ├── index.ts                   # Central exports
│   ├── README.md                  # Store documentation
│   │
│   ├── slices/                    # Global slices
│   │   ├── authSlice.ts
│   │   ├── usersSlice.ts
│   │   ├── districtsSlice.ts
│   │   ├── schoolsSlice.ts
│   │   ├── settingsSlice.ts
│   │   ├── documentsSlice.ts
│   │   ├── communicationSlice.ts
│   │   ├── inventorySlice.ts
│   │   ├── reportsSlice.ts
│   │   └── README.md
│   │
│   ├── domains/                   # Domain organization
│   └── shared/                    # Shared utilities
│       ├── enterprise/
│       └── orchestration/
│
├── pages/                         # Feature pages
│   ├── dashboard/
│   │   ├── store/                # Page-specific Redux
│   │   │   ├── dashboardSlice.ts
│   │   │   └── index.ts
│   │   ├── components/           # Page components
│   │   ├── Dashboard.tsx         # Main page
│   │   ├── DashboardReduxExample.tsx  # Example implementation
│   │   └── routes.tsx
│   │
│   ├── students/
│   │   ├── store/
│   │   │   ├── studentsSlice.ts
│   │   │   ├── healthRecordsSlice.ts
│   │   │   ├── emergencyContactsSlice.ts
│   │   │   └── index.ts
│   │   ├── components/
│   │   ├── Students.tsx
│   │   └── routes.tsx
│   │
│   └── [other features]/
│
├── components/                    # Reusable components
│   ├── README.md                 # Component guide
│   ├── ui/                       # Presentational components
│   ├── features/                 # Feature components
│   ├── forms/                    # Form components
│   ├── layout/                   # Layout components
│   └── shared/                   # Shared components
│
├── hooks/                         # Custom hooks
│   ├── index.ts
│   └── shared/
│       ├── reduxHooks.ts         # Typed Redux hooks
│       └── [other hooks]
│
├── middleware/                    # Redux middleware
│   └── redux/
│       └── stateSyncMiddleware.ts
│
├── services/                      # API services
├── types/                         # TypeScript types
└── utils/                         # Utilities
```

## Slice Structure

Each Redux slice follows this structure:

```typescript
// Feature Slice Template
┌─────────────────────────────────────────┐
│        TYPES & INTERFACES               │
│  • State interface                      │
│  • Action payload types                 │
│  • API response types                   │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│        INITIAL STATE                    │
│  • Default values                       │
│  • Empty arrays/objects                 │
│  • Loading: false                       │
│  • Error: null                          │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│        ASYNC THUNKS                     │
│  • API call functions                   │
│  • Error handling                       │
│  • Type-safe parameters                 │
│                                         │
│  createAsyncThunk(                      │
│    'feature/action',                    │
│    async (params, { rejectWithValue }) │
│  )                                      │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│        SLICE (createSlice)              │
│  • name                                 │
│  • initialState                         │
│  • reducers (sync actions)              │
│  • extraReducers (async handlers)       │
│                                         │
│  Reducers:                              │
│  • setFilters                           │
│  • setSelected                          │
│  • clearErrors                          │
│  • resetState                           │
│                                         │
│  Extra Reducers:                        │
│  • pending → loading = true             │
│  • fulfilled → data + loading = false   │
│  • rejected → error + loading = false   │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│        SELECTORS                        │
│  • selectItems                          │
│  • selectSelected                       │
│  • selectLoading                        │
│  • selectError                          │
│  • selectFilters                        │
│  • selectPagination                     │
│                                         │
│  Memoized Selectors:                    │
│  • selectActiveItems                    │
│  • selectItemsByType                    │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│        EXPORTS                          │
│  • Actions (from slice.actions)        │
│  • Async thunks                         │
│  • Selectors                            │
│  • Reducer (default export)             │
└─────────────────────────────────────────┘
```

## Component Connection Pattern

```typescript
┌─────────────────────────────────────────┐
│         COMPONENT                       │
│                                         │
│  1. Import Hooks                        │
│     import {                            │
│       useAppDispatch,                   │
│       useAppSelector                    │
│     } from '@/stores';                  │
│                                         │
│  2. Import Actions & Selectors          │
│     import {                            │
│       fetchData,                        │
│       selectData,                       │
│       selectLoading                     │
│     } from './store';                   │
│                                         │
│  3. Use Hooks in Component              │
│     const dispatch = useAppDispatch();  │
│     const data = useAppSelector(        │
│       selectData                        │
│     );                                  │
│     const loading = useAppSelector(     │
│       selectLoading                     │
│     );                                  │
│                                         │
│  4. Dispatch Actions                    │
│     useEffect(() => {                   │
│       dispatch(fetchData());            │
│     }, [dispatch]);                     │
│                                         │
│  5. Render Based on State               │
│     if (loading) return <Spinner />;    │
│     if (error) return <Error />;        │
│     return <DataDisplay data={data} />; │
└─────────────────────────────────────────┘
```

## State Shape

```typescript
{
  // Authentication
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null
  },

  // Dashboard
  dashboard: {
    stats: DashboardStats | null,
    recentActivities: Activity[],
    upcomingAppointments: Appointment[],
    chartData: ChartData | null,
    healthAlerts: Alert[],
    loading: { /* granular loading states */ },
    error: { /* granular error states */ }
  },

  // Students
  students: {
    students: Student[],
    selectedStudent: Student | null,
    loading: { list, detail, creating, updating, deleting },
    error: { list, detail, creating, updating, deleting },
    filters: { search, grade, status },
    pagination: { page, limit, total }
  },

  // Health Records
  healthRecords: {
    records: HealthRecord[],
    selectedRecord: HealthRecord | null,
    loading: { /* ... */ },
    error: { /* ... */ }
  },

  // ... other slices
}
```

## Best Practices Summary

### ✅ DO

- Use typed hooks (`useAppDispatch`, `useAppSelector`)
- Create granular loading and error states
- Use async thunks for API calls
- Create reusable selectors
- Keep slices focused and single-purpose
- Document complex logic
- Handle errors gracefully
- Provide retry mechanisms

### ❌ DON'T

- Use plain Redux hooks (`useDispatch`, `useSelector`)
- Store derived data (compute in selectors instead)
- Store PHI in persisted state
- Create deeply nested state
- Mutate state outside reducers
- Skip error handling
- Ignore loading states
- Over-fetch data

## Performance Considerations

### Memoization

```typescript
// Use memoized selectors for computed values
export const selectActiveStudents = createSelector(
  [selectStudents],
  (students) => students.filter(s => s.isActive)
);
```

### Pagination

```typescript
// Implement pagination to limit data fetched
dispatch(fetchStudents({ page: 1, limit: 20 }));
```

### Debouncing

```typescript
// State sync uses debouncing to prevent excessive writes
strategy: SyncStrategy.DEBOUNCED,
debounceDelay: 500
```

## Security & Compliance

### HIPAA Compliance

```typescript
// Exclude sensitive data from persistence
excludePaths: [
  'token',
  'password',
  'user.ssn',
  'healthRecords', // Don't persist PHI
  'medications'    // Don't persist PHI
]
```

### Data Encryption

State sync middleware supports compression and encryption for sensitive data.

## Testing Strategy

```typescript
// Test reducers
describe('Feature Reducer', () => {
  it('should handle action', () => {
    const state = reducer(undefined, action);
    expect(state).toEqual(expectedState);
  });
});

// Test async thunks
it('should handle fetch success', async () => {
  const store = mockStore();
  await store.dispatch(fetchData());
  const actions = store.getActions();
  expect(actions[0].type).toBe('feature/fetch/fulfilled');
});

// Test components
it('should display data from store', () => {
  const { getByText } = render(
    <Provider store={store}>
      <Component />
    </Provider>
  );
  expect(getByText('Expected Text')).toBeInTheDocument();
});
```

## Resources

- **Redux Toolkit**: https://redux-toolkit.js.org/
- **React Redux**: https://react-redux.js.org/
- **Integration Guide**: [REDUX_INTEGRATION_GUIDE.md](./REDUX_INTEGRATION_GUIDE.md)
- **Status Tracking**: [REDUX_STATUS.md](./REDUX_STATUS.md)
- **Store README**: [src/stores/README.md](./src/stores/README.md)
- **Components README**: [src/components/README.md](./src/components/README.md)
- **Example Implementation**: [src/pages/dashboard/DashboardReduxExample.tsx](./src/pages/dashboard/DashboardReduxExample.tsx)
