# State Management Architecture

## Table of Contents

- [Overview](#overview)
- [Architecture Principles](#architecture-principles)
- [Complete Architecture Diagram](#complete-architecture-diagram)
- [Data Flow Patterns](#data-flow-patterns)
- [Decision Tree](#decision-tree)
- [State Management Approaches](#state-management-approaches)
- [Best Practices](#best-practices)
- [Performance Considerations](#performance-considerations)
- [HIPAA Compliance Guidelines](#hipaa-compliance-guidelines)
- [Advanced Patterns](#advanced-patterns)

---

## Overview

The White Cross platform employs a **hybrid state management architecture** that combines Redux, Context API, TanStack Query, and local component state to provide optimal performance, maintainability, and developer experience.

### Key Technologies

- **Redux Toolkit**: Global application state, complex state logic
- **Context API**: Feature-specific state, cross-component communication
- **TanStack Query**: Server state, data fetching, caching
- **React Hooks**: Local component state, ephemeral UI state

---

## Architecture Principles

### 1. Separation of Concerns
- **Global State (Redux)**: Application-wide data, complex business logic
- **Feature State (Context)**: Feature-specific data, localized sharing
- **Server State (TanStack Query)**: API data, caching, synchronization
- **Local State (Hooks)**: Component-specific UI state

### 2. Single Source of Truth
Each piece of state should have ONE authoritative source:
- User authentication → Redux `auth` slice
- Incident reports list → Redux `incidentReports` slice
- Witness statements for incident → Context API
- Form input values → Local component state

### 3. Unidirectional Data Flow
```
User Action → Dispatch/Update → State Change → UI Re-render
```

### 4. Optimistic Updates
Provide immediate UI feedback, then reconcile with server:
```
1. Update UI optimistically
2. Send API request
3. On success: Keep optimistic update
4. On error: Rollback to previous state
```

### 5. Type Safety
All state operations are fully typed with TypeScript for compile-time safety.

---

## Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRESENTATION LAYER                             │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │    Pages    │  │ Components  │  │   Modals    │  │    Forms    │       │
│  │             │  │             │  │             │  │             │       │
│  │  - List     │  │  - Cards    │  │  - Create   │  │  - Input    │       │
│  │  - Detail   │  │  - Tables   │  │  - Edit     │  │  - Select   │       │
│  │  - Create   │  │  - Charts   │  │  - Confirm  │  │  - Textarea │       │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │
│         │                │                │                │              │
│         └────────────────┴────────────────┴────────────────┘              │
│                                   │                                        │
└───────────────────────────────────┼────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           STATE MANAGEMENT LAYER                            │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         REDUX STORE (Global)                         │  │
│  │                                                                      │  │
│  │  ┌────────────────┐  ┌──────────────────────────────────────────┐  │  │
│  │  │   Auth Slice   │  │    Incident Reports Slice                │  │  │
│  │  │                │  │                                          │  │  │
│  │  │  - user        │  │  State:                                  │  │  │
│  │  │  - token       │  │    - reports[]                           │  │  │
│  │  │  - loading     │  │    - selectedReport                      │  │  │
│  │  │  - error       │  │    - witnessStatements[]                 │  │  │
│  │  │                │  │    - followUpActions[]                   │  │  │
│  │  │  Actions:      │  │    - pagination                          │  │  │
│  │  │  - login()     │  │    - filters                             │  │  │
│  │  │  - logout()    │  │    - loading states                      │  │  │
│  │  │  - refresh()   │  │    - error states                        │  │  │
│  │  └────────────────┘  │                                          │  │  │
│  │                      │  Async Thunks:                           │  │  │
│  │                      │    - fetchIncidentReports()              │  │  │
│  │                      │    - createIncidentReport()              │  │  │
│  │                      │    - updateIncidentReport()              │  │  │
│  │                      │    - deleteIncidentReport()              │  │  │
│  │                      │    - searchIncidentReports()             │  │  │
│  │                      │    - fetchWitnessStatements()            │  │  │
│  │                      │    - createWitnessStatement()            │  │  │
│  │                      │    - fetchFollowUpActions()              │  │  │
│  │                      │    - createFollowUpAction()              │  │  │
│  │                      │                                          │  │  │
│  │                      │  Selectors:                              │  │  │
│  │                      │    - selectIncidentReports               │  │  │
│  │                      │    - selectCurrentIncident               │  │  │
│  │                      │    - selectFilteredAndSortedReports      │  │  │
│  │                      │    - selectReportStatistics              │  │  │
│  │                      └──────────────────────────────────────────┘  │  │
│  │                                                                      │  │
│  │  Middleware:                                                         │  │
│  │    - State Sync (Cross-tab, Persistence)                            │  │
│  │    - DevTools                                                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     CONTEXT API (Feature State)                      │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────┐  ┌──────────────────────────────┐ │  │
│  │  │  WitnessStatementContext     │  │  FollowUpActionContext       │ │  │
│  │  │                              │  │                              │ │  │
│  │  │  State:                      │  │  State:                      │ │  │
│  │  │    - statements[]            │  │    - actions[]               │ │  │
│  │  │    - selectedStatement       │  │    - selectedAction          │ │  │
│  │  │    - currentIncidentId       │  │    - overdueActions[]        │ │  │
│  │  │    - formState               │  │    - filters                 │ │  │
│  │  │    - operationLoading        │  │    - sortConfig              │ │  │
│  │  │                              │  │    - stats                   │ │  │
│  │  │  Operations:                 │  │                              │ │  │
│  │  │    - loadWitnessStatements() │  │  Operations:                 │ │  │
│  │  │    - createWitnessStatement()│  │    - loadFollowUpActions()   │ │  │
│  │  │    - updateWitnessStatement()│  │    - createFollowUpAction()  │ │  │
│  │  │    - deleteWitnessStatement()│  │    - updateFollowUpAction()  │ │  │
│  │  │    - verifyStatement()       │  │    - deleteFollowUpAction()  │ │  │
│  │  │    - unverifyStatement()     │  │    - completeAction()        │ │  │
│  │  │                              │  │    - assignAction()          │ │  │
│  │  │  TanStack Query:             │  │    - unassignAction()        │ │  │
│  │  │    - Automatic caching       │  │                              │ │  │
│  │  │    - Background refetching   │  │  TanStack Query:             │ │  │
│  │  │    - Optimistic updates      │  │    - Automatic caching       │ │  │
│  │  └──────────────────────────────┘  │    - Background refetching   │ │  │
│  │                                     │    - Optimistic updates      │ │  │
│  │  ┌──────────────────────────────┐  └──────────────────────────────┘ │  │
│  │  │    AuthContext               │                                   │  │
│  │  │                              │                                   │  │
│  │  │  State:                      │                                   │  │
│  │  │    - user                    │                                   │  │
│  │  │    - loading                 │                                   │  │
│  │  │    - error                   │                                   │  │
│  │  │    - isAuthenticated         │                                   │  │
│  │  │                              │                                   │  │
│  │  │  Operations:                 │                                   │  │
│  │  │    - login()                 │                                   │  │
│  │  │    - logout()                │                                   │  │
│  │  │    - refreshToken()          │                                   │  │
│  │  │    - updateProfile()         │                                   │  │
│  │  └──────────────────────────────┘                                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                   TANSTACK QUERY (Server State)                      │  │
│  │                                                                      │  │
│  │  Features:                                                           │  │
│  │    - Query Caching (5 min stale time, 10 min gc time)              │  │
│  │    - Background Refetching                                          │  │
│  │    - Query Invalidation                                             │  │
│  │    - Optimistic Updates                                             │  │
│  │    - Retry Logic (3 attempts with exponential backoff)              │  │
│  │    - Parallel Queries                                               │  │
│  │    - Dependent Queries                                              │  │
│  │    - Infinite Queries                                               │  │
│  │    - Mutations with Rollback                                        │  │
│  │                                                                      │  │
│  │  Query Keys:                                                         │  │
│  │    - ['witness-statements', incidentId]                             │  │
│  │    - ['followUpActions', incidentId]                                │  │
│  │    - ['incidentReport', reportId]                                   │  │
│  │    - ['students', studentId]                                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SERVICE LAYER                                  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                           API Services                               │  │
│  │                                                                      │  │
│  │  - incidentReportsApi                                               │  │
│  │  - studentsApi                                                      │  │
│  │  - medicationsApi                                                   │  │
│  │  - healthRecordsApi                                                 │  │
│  │  - appointmentsApi                                                  │  │
│  │  - documentsApi                                                     │  │
│  │  - communicationApi                                                 │  │
│  │                                                                      │  │
│  │  Features:                                                           │  │
│  │    - Axios interceptors (auth, error handling)                      │  │
│  │    - Request/response transformation                                │  │
│  │    - Error normalization                                            │  │
│  │    - Retry logic                                                    │  │
│  │    - Rate limiting                                                  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND REST API                                  │
│                                                                             │
│  Endpoints:                                                                 │
│    - POST   /api/incident-reports                                          │
│    - GET    /api/incident-reports                                          │
│    - GET    /api/incident-reports/:id                                      │
│    - PUT    /api/incident-reports/:id                                      │
│    - DELETE /api/incident-reports/:id                                      │
│    - POST   /api/incident-reports/:id/witness-statements                   │
│    - POST   /api/incident-reports/:id/follow-up-actions                    │
│    - ...                                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Patterns

### Pattern 1: Redux Async Thunk Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                  Redux Async Thunk Data Flow                     │
└──────────────────────────────────────────────────────────────────┘

User Action
    │
    ▼
┌──────────────────┐
│ Dispatch Thunk   │  dispatch(fetchIncidentReports())
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Pending State    │  loading.list = true
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ API Call         │  incidentReportsApi.getAll()
└────────┬─────────┘
         │
         ├─────────────┬──────────────┐
         ▼             ▼              ▼
    ┌─────────┐   ┌─────────┐   ┌──────────┐
    │ Success │   │ Error   │   │ Timeout  │
    └────┬────┘   └────┬────┘   └─────┬────┘
         │             │               │
         ▼             ▼               ▼
┌──────────────┐  ┌──────────┐  ┌──────────┐
│ Update State │  │ Set Error│  │ Set Error│
│ - reports[]  │  │ - Show   │  │ - Retry  │
│ - pagination │  │   toast  │  │   prompt │
└──────┬───────┘  └─────┬────┘  └─────┬────┘
       │                │              │
       └────────────────┴──────────────┘
                        │
                        ▼
               ┌─────────────────┐
               │ Component       │
               │ Re-render       │
               └─────────────────┘
```

### Pattern 2: Context + TanStack Query Flow

```
┌──────────────────────────────────────────────────────────────────┐
│          Context + TanStack Query Data Flow                      │
└──────────────────────────────────────────────────────────────────┘

Component Mount / ID Change
    │
    ▼
┌──────────────────────┐
│ loadWitnessStatements│  loadWitnessStatements(incidentId)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Check Query Cache    │  queryClient.getQueryData(['witness-statements', id])
└──────────┬───────────┘
           │
           ├─────────────────┬──────────────────┐
           ▼                 ▼                  ▼
      ┌─────────┐      ┌──────────┐      ┌──────────┐
      │ Cached  │      │ Stale    │      │ Not      │
      │ & Fresh │      │ Cached   │      │ Cached   │
      └────┬────┘      └─────┬────┘      └────┬─────┘
           │                 │                 │
           │                 ▼                 ▼
           │           ┌──────────────────────────┐
           │           │ Background Refetch       │
           │           │ incidentReportsApi.get() │
           │           └───────────┬──────────────┘
           │                       │
           └───────────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Update Context  │
              │ - statements[]  │
              │ - isLoading     │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Notify Listeners│
              │ (Components)    │
              └─────────────────┘
```

### Pattern 3: Optimistic Update Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                  Optimistic Update Flow                          │
└──────────────────────────────────────────────────────────────────┘

User Action (e.g., "Mark as Verified")
    │
    ▼
┌──────────────────────────────────┐
│ 1. onMutate                      │
│    - Cancel outgoing queries     │
│    - Save snapshot               │
│    - Update UI optimistically    │
└──────────────┬───────────────────┘
               │
               │  [UI shows verified immediately]
               │
               ▼
┌──────────────────────────────────┐
│ 2. API Call                      │
│    incidentReportsApi.verify()   │
└──────────────┬───────────────────┘
               │
               ├─────────────────────┬────────────────────┐
               ▼                     ▼                    ▼
         ┌──────────┐          ┌──────────┐        ┌──────────┐
         │ Success  │          │ Error    │        │ Timeout  │
         └─────┬────┘          └─────┬────┘        └─────┬────┘
               │                     │                    │
               ▼                     ▼                    ▼
    ┌──────────────────┐   ┌──────────────────┐  ┌──────────────┐
    │ 3a. onSuccess    │   │ 3b. onError      │  │ 3c. onError  │
    │ - Invalidate     │   │ - Rollback UI    │  │ - Rollback UI│
    │   queries        │   │ - Show error     │  │ - Show toast │
    │ - Keep optimistic│   │ - Restore        │  │ - Restore    │
    │   update         │   │   snapshot       │  │   snapshot   │
    └──────────────────┘   └──────────────────┘  └──────────────┘
```

---

## Decision Tree

Use this decision tree to choose the right state management approach:

```
                    Need to manage state?
                            │
                     ┌──────┴──────┐
                     │             │
                    Yes            No
                     │             │
                     │             └──> Use props/callbacks
                     │
          ┌──────────┴──────────┐
          │                     │
     Is it server data?    Is it local UI state?
          │                     │
          │                     └──> useState / useReducer
          │
    ┌─────┴─────┐
    Yes         No
    │           │
    │           └──> Continue below...
    │
    ▼
Does it need caching/refetching?
    │
    ├─────────────┬────────────┐
    Yes           No           Depends
    │             │            │
    ▼             ▼            ▼
TanStack      Context API    Consider both
Query         + useQuery

For non-server data:
    │
    ▼
Is it needed across entire app?
    │
    ├─────────────┬────────────┐
    Yes           No           Some routes
    │             │            │
    │             │            └──> Context API
    │             │
    │             └──> Local State or Context
    │
    ▼
Is it complex with many actions?
    │
    ├─────────────┬────────────┐
    Yes           No
    │             │
    ▼             ▼
  Redux       Context API

Additional considerations:

Redux if:
  ✓ Complex state logic (many actions, computed values)
  ✓ Needs debugging with Redux DevTools
  ✓ State needs to persist across sessions
  ✓ Multiple features depend on same state
  ✓ Middleware needed (logging, analytics)

Context API if:
  ✓ Feature-specific state
  ✓ Limited to component subtree
  ✓ Simple CRUD operations
  ✓ Works well with TanStack Query

TanStack Query if:
  ✓ Server data (API responses)
  ✓ Needs caching
  ✓ Automatic refetching required
  ✓ Optimistic updates needed
  ✓ Background synchronization

Local State (useState) if:
  ✓ Component-only state
  ✓ Form inputs
  ✓ UI toggles (modals, dropdowns)
  ✓ Temporary values
  ✓ Animation states
```

---

## State Management Approaches

### 1. Redux (Global Application State)

**When to use:**
- Application-wide state (user authentication, theme)
- Complex state with many interconnected pieces
- State that needs to persist across page navigations
- Need time-travel debugging
- Multiple components in different parts of the tree need the same state

**Example use cases:**
- User authentication and profile
- Incident reports list and filters
- Application settings and preferences
- Shopping cart in e-commerce

**Implementation:**

```typescript
// Define slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchReports = createAsyncThunk(
  'reports/fetch',
  async (filters: Filters) => {
    const response = await api.getReports(filters);
    return response.data;
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

// Use in components
import { useAppDispatch, useAppSelector } from '@/stores/hooks';

function ReportsList() {
  const dispatch = useAppDispatch();
  const reports = useAppSelector(state => state.reports.items);
  const loading = useAppSelector(state => state.reports.loading);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  return <div>{/* render */}</div>;
}
```

**Pros:**
- Centralized state management
- Time-travel debugging
- Middleware support
- Excellent DevTools
- Predictable state updates

**Cons:**
- More boilerplate
- Learning curve
- Overkill for simple state

---

### 2. Context API (Feature State)

**When to use:**
- Feature-specific state (witness statements for an incident)
- State shared across a component subtree
- Props drilling becomes problematic
- State doesn't need global access

**Example use cases:**
- Theme provider
- Form state for multi-step forms
- Feature-specific data (witness statements, follow-up actions)
- Modal/dialog state

**Implementation:**

```typescript
// Create context
interface WitnessStatementContextValue {
  statements: WitnessStatement[];
  createStatement: (data: CreateRequest) => Promise<void>;
  // ... other methods
}

const WitnessStatementContext = createContext<WitnessStatementContextValue | undefined>(undefined);

// Provider component
export function WitnessStatementProvider({ children }: Props) {
  const [statements, setStatements] = useState<WitnessStatement[]>([]);

  const createStatement = async (data: CreateRequest) => {
    const result = await api.create(data);
    setStatements(prev => [...prev, result]);
  };

  return (
    <WitnessStatementContext.Provider value={{ statements, createStatement }}>
      {children}
    </WitnessStatementContext.Provider>
  );
}

// Hook
export function useWitnessStatements() {
  const context = useContext(WitnessStatementContext);
  if (!context) {
    throw new Error('Must be used within WitnessStatementProvider');
  }
  return context;
}

// Usage
<WitnessStatementProvider>
  <IncidentDetails />
</WitnessStatementProvider>
```

**Pros:**
- Built into React
- No extra dependencies
- Simple to implement
- Good for feature-specific state

**Cons:**
- Can cause unnecessary re-renders if not optimized
- No built-in async handling
- No DevTools
- Context hell if overused

---

### 3. TanStack Query (Server State)

**When to use:**
- Fetching data from APIs
- Need caching and automatic refetching
- Optimistic updates required
- Background data synchronization
- Infinite scroll / pagination

**Example use cases:**
- Fetching user profiles
- Loading lists from APIs
- Real-time data synchronization
- Infinite scroll lists

**Implementation:**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch data
function useIncidentReports(filters: Filters) {
  return useQuery({
    queryKey: ['incident-reports', filters],
    queryFn: () => api.getReports(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

// Mutation with optimistic updates
function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRequest) => api.create(data),
    onMutate: async (newReport) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['incident-reports'] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['incident-reports']);

      // Optimistically update
      queryClient.setQueryData(['incident-reports'], (old: any) => ({
        ...old,
        reports: [...old.reports, { ...newReport, id: 'temp' }]
      }));

      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['incident-reports'], context.previous);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['incident-reports'] });
    },
  });
}

// Usage
function ReportsList() {
  const { data, isLoading, error } = useIncidentReports({ status: 'OPEN' });
  const createMutation = useCreateReport();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Error error={error} />;

  return (
    <div>
      {data.reports.map(report => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}
```

**Pros:**
- Automatic caching
- Background refetching
- Built-in loading/error states
- Optimistic updates
- Request deduplication
- Excellent DevTools

**Cons:**
- Another dependency
- Learning curve
- Not for non-server state

---

### 4. Local State (Component State)

**When to use:**
- Component-specific UI state
- Form inputs
- Toggles (modals, dropdowns, accordions)
- Temporary values
- Animation states

**Example use cases:**
- Form input values
- Modal open/close state
- Dropdown expanded state
- Input validation errors

**Implementation:**

```typescript
// Simple state
function SearchInput() {
  const [query, setQuery] = useState('');

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

// Complex state with useReducer
type State = {
  count: number;
  step: number;
};

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep'; step: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.step };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
```

**Pros:**
- Simple and straightforward
- Built into React
- No extra dependencies
- Fast and performant
- Easy to test

**Cons:**
- Limited to single component
- Props drilling for shared state
- No persistence
- No DevTools

---

## Best Practices

### 1. Redux Best Practices

#### Use Redux Toolkit
```typescript
// ✅ Good: Use Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload; // Immer allows mutations
    },
  },
});

// ❌ Bad: Traditional Redux
const SET_FILTER = 'SET_FILTER';
function setFilter(filter) {
  return { type: SET_FILTER, payload: filter };
}
function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILTER:
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}
```

#### Normalize State Structure
```typescript
// ✅ Good: Normalized
interface State {
  reports: {
    byId: Record<string, IncidentReport>;
    allIds: string[];
  };
  selectedId: string | null;
}

// ❌ Bad: Nested
interface State {
  reports: IncidentReport[];
  selectedReport: IncidentReport | null;
}
```

#### Use Selectors with Memoization
```typescript
// ✅ Good: Memoized selector
import { createSelector } from '@reduxjs/toolkit';

export const selectFilteredReports = createSelector(
  [(state) => state.reports.items, (state) => state.reports.filters],
  (reports, filters) => {
    return reports.filter(report => {
      // Filtering logic
      return true;
    });
  }
);

// ❌ Bad: Inline filtering
function ReportsList() {
  const reports = useAppSelector(state => state.reports.items);
  const filters = useAppSelector(state => state.reports.filters);
  const filtered = reports.filter(/* filtering */); // Recalculates on every render
  // ...
}
```

#### Async Logic in Thunks
```typescript
// ✅ Good: Use createAsyncThunk
export const fetchReports = createAsyncThunk(
  'reports/fetch',
  async (filters: Filters, { rejectWithValue }) => {
    try {
      const response = await api.getReports(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ❌ Bad: Async logic in component
function ReportsList() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    api.getReports().then(data => {
      dispatch(setReports(data)); // Anti-pattern
    });
  }, []);
}
```

---

### 2. Context API Best Practices

#### Split Contexts by Feature
```typescript
// ✅ Good: Separate contexts
<AuthProvider>
  <WitnessStatementProvider>
    <FollowUpActionProvider>
      <App />
    </FollowUpActionProvider>
  </WitnessStatementProvider>
</AuthProvider>

// ❌ Bad: One giant context
<AppProvider> {/* Everything in one context */}
  <App />
</AppProvider>
```

#### Optimize with useMemo
```typescript
// ✅ Good: Memoize context value
function MyProvider({ children }) {
  const [state, setState] = useState(initialState);

  const value = useMemo(() => ({
    state,
    setState,
    // ... other values
  }), [state]); // Only recreate when state changes

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

// ❌ Bad: Creates new object on every render
function MyProvider({ children }) {
  const [state, setState] = useState(initialState);

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}
```

#### Provide Type-Safe Hooks
```typescript
// ✅ Good: Type-safe hook with error checking
export function useWitnessStatements() {
  const context = useContext(WitnessStatementContext);
  if (context === undefined) {
    throw new Error('useWitnessStatements must be used within WitnessStatementProvider');
  }
  return context;
}

// ❌ Bad: No type safety or error checking
export function useWitnessStatements() {
  return useContext(WitnessStatementContext);
}
```

---

### 3. TanStack Query Best Practices

#### Use Structured Query Keys
```typescript
// ✅ Good: Structured, predictable keys
const queryKeys = {
  incidentReports: (filters?: Filters) => ['incident-reports', filters] as const,
  incidentReport: (id: string) => ['incident-report', id] as const,
  witnessStatements: (incidentId: string) => ['witness-statements', incidentId] as const,
};

// ❌ Bad: Inconsistent keys
const key1 = 'reports';
const key2 = ['report', id];
const key3 = { type: 'witness', id };
```

#### Configure Stale Time Appropriately
```typescript
// ✅ Good: Configure based on data volatility
useQuery({
  queryKey: ['user-profile', userId],
  queryFn: fetchUserProfile,
  staleTime: 5 * 60 * 1000, // 5 minutes - profile data changes infrequently
});

useQuery({
  queryKey: ['live-notifications'],
  queryFn: fetchNotifications,
  staleTime: 30 * 1000, // 30 seconds - notifications change frequently
  refetchInterval: 30 * 1000, // Poll every 30 seconds
});

// ❌ Bad: Default stale time for everything
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  // No staleTime configured, uses default (0)
});
```

#### Handle Errors Gracefully
```typescript
// ✅ Good: Proper error handling
function useIncidentReports() {
  return useQuery({
    queryKey: ['incident-reports'],
    queryFn: async () => {
      try {
        const response = await api.getReports();
        return response.data;
      } catch (error: any) {
        if (error.status === 401) {
          // Handle auth error
          logout();
        }
        throw new Error(error.message || 'Failed to fetch reports');
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error.status === 401 || error.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// ❌ Bad: No error handling
function useIncidentReports() {
  return useQuery({
    queryKey: ['incident-reports'],
    queryFn: () => api.getReports(), // Errors bubble up unhandled
  });
}
```

---

## Performance Considerations

### 1. Avoid Unnecessary Re-renders

#### React.memo for Components
```typescript
// ✅ Good: Memoize expensive components
const ReportCard = React.memo(function ReportCard({ report }: Props) {
  return <div>{/* render */}</div>;
});

// ❌ Bad: Re-renders on every parent update
function ReportCard({ report }: Props) {
  return <div>{/* render */}</div>;
}
```

#### useCallback for Functions
```typescript
// ✅ Good: Memoize callbacks
function ReportsList() {
  const handleDelete = useCallback((id: string) => {
    dispatch(deleteReport(id));
  }, [dispatch]);

  return reports.map(report => (
    <ReportCard key={report.id} report={report} onDelete={handleDelete} />
  ));
}

// ❌ Bad: Creates new function on every render
function ReportsList() {
  return reports.map(report => (
    <ReportCard
      key={report.id}
      report={report}
      onDelete={(id) => dispatch(deleteReport(id))} // New function every render
    />
  ));
}
```

### 2. Code Splitting

```typescript
// ✅ Good: Lazy load routes
const IncidentReports = lazy(() => import('./pages/IncidentReports'));
const StudentManagement = lazy(() => import('./pages/StudentManagement'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/incidents" element={<IncidentReports />} />
        <Route path="/students" element={<StudentManagement />} />
      </Routes>
    </Suspense>
  );
}
```

### 3. Virtualization for Long Lists

```typescript
import { FixedSizeList } from 'react-window';

function ReportsList({ reports }: Props) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ReportCard report={reports[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={reports.length}
      itemSize={120}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

### 4. Debounce Expensive Operations

```typescript
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(searchReports(value));
      }, 300),
    [dispatch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return <input value={query} onChange={handleChange} />;
}
```

---

## HIPAA Compliance Guidelines

### 1. Data Persistence Rules

**DO NOT persist Protected Health Information (PHI):**
```typescript
// ✅ Good: Exclude PHI from persistence
const stateSyncConfig: StateSyncConfig = {
  slices: [
    {
      sliceName: 'incidentReports',
      excludePaths: [
        'reports',            // Contains PHI
        'selectedReport',     // Contains PHI
        'witnessStatements',  // Contains PHI
        'followUpActions',    // Contains PHI
      ],
    },
  ],
};

// ❌ Bad: Persisting PHI
const stateSyncConfig = {
  slices: [
    {
      sliceName: 'incidentReports',
      // No excludePaths - will persist everything including PHI
    },
  ],
};
```

### 2. Session Management

```typescript
// ✅ Good: Auth in sessionStorage only
{
  sliceName: 'auth',
  storage: 'sessionStorage', // Cleared when browser closes
  enableCrossTab: false,      // Don't sync sensitive auth data
  maxAge: 24 * 60 * 60 * 1000, // 24 hour max
}

// ❌ Bad: Auth in localStorage
{
  sliceName: 'auth',
  storage: 'localStorage', // Persists indefinitely
  enableCrossTab: true,    // Security risk
}
```

### 3. Audit Logging

```typescript
// ✅ Good: Log PHI access
import { useEffect } from 'react';

function useAuditLog(action: string, resourceId: string) {
  useEffect(() => {
    auditLog.log({
      userId: user.id,
      action,
      resourceType: 'incident_report',
      resourceId,
      timestamp: new Date().toISOString(),
      ipAddress: getClientIP(),
    });
  }, [action, resourceId, user.id]);
}

function IncidentDetails({ reportId }: Props) {
  useAuditLog('VIEW_INCIDENT_REPORT', reportId);
  // ... component logic
}
```

### 4. Data Encryption

```typescript
// ✅ Good: Encrypt sensitive data in transit
const api = axios.create({
  baseURL: 'https://api.example.com', // HTTPS only
  headers: {
    'Content-Type': 'application/json',
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: true, // Verify SSL certificates
  }),
});

// Encrypt sensitive data before storing
const encryptedData = await encryptData(sensitiveData, encryptionKey);
localStorage.setItem('encrypted_data', encryptedData);
```

### 5. Access Control

```typescript
// ✅ Good: Permission checks on PHI access
import { checkPermission } from '@/guards/navigationGuards';

function IncidentDetails({ reportId }: Props) {
  const { user } = useAuth();

  if (!checkPermission(user, { resource: 'incident_reports', action: 'read' })) {
    return <AccessDenied />;
  }

  // Load and display PHI
  const { data } = useIncidentReport(reportId);
  return <div>{/* render */}</div>;
}
```

---

## Advanced Patterns

### 1. Normalized State with Entity Adapters

```typescript
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const reportsAdapter = createEntityAdapter<IncidentReport>({
  selectId: (report) => report.id,
  sortComparer: (a, b) => b.occurredAt.localeCompare(a.occurredAt),
});

const reportsSlice = createSlice({
  name: 'reports',
  initialState: reportsAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {
    reportAdded: reportsAdapter.addOne,
    reportUpdated: reportsAdapter.updateOne,
    reportRemoved: reportsAdapter.removeOne,
    reportsReceived: reportsAdapter.setAll,
  },
});

// Entity adapter provides selectors
export const {
  selectAll: selectAllReports,
  selectById: selectReportById,
  selectIds: selectReportIds,
} = reportsAdapter.getSelectors((state: RootState) => state.reports);
```

### 2. Middleware for Cross-Cutting Concerns

```typescript
import { Middleware } from '@reduxjs/toolkit';

const analyticsMiddleware: Middleware = (store) => (next) => (action) => {
  // Log actions to analytics
  if (action.type.startsWith('incidentReports/')) {
    analytics.track('redux_action', {
      action: action.type,
      timestamp: new Date().toISOString(),
    });
  }

  return next(action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(analyticsMiddleware),
});
```

### 3. Reusable Hooks Pattern

```typescript
// Generic data fetching hook
function useResource<T>(
  resourceName: string,
  id: string,
  fetcher: (id: string) => Promise<T>
) {
  return useQuery({
    queryKey: [resourceName, id],
    queryFn: () => fetcher(id),
  });
}

// Usage
function StudentDetails({ studentId }: Props) {
  const { data: student, isLoading } = useResource(
    'student',
    studentId,
    studentsApi.getById
  );

  return <div>{/* render */}</div>;
}
```

### 4. State Machines for Complex Flows

```typescript
import { createMachine, interpret } from 'xstate';

const incidentReportMachine = createMachine({
  id: 'incidentReport',
  initial: 'idle',
  states: {
    idle: {
      on: { CREATE: 'creating' },
    },
    creating: {
      on: {
        SUCCESS: 'created',
        ERROR: 'error',
      },
    },
    created: {
      on: {
        EDIT: 'editing',
        DELETE: 'deleting',
      },
    },
    editing: {
      on: {
        SAVE: 'saving',
        CANCEL: 'created',
      },
    },
    saving: {
      on: {
        SUCCESS: 'created',
        ERROR: 'error',
      },
    },
    deleting: {
      on: {
        SUCCESS: 'idle',
        ERROR: 'error',
      },
    },
    error: {
      on: {
        RETRY: 'creating',
        DISMISS: 'idle',
      },
    },
  },
});
```

---

## Summary

The White Cross platform uses a **hybrid state management approach** that leverages the strengths of multiple state management solutions:

1. **Redux**: Global application state, complex business logic
2. **Context API**: Feature-specific state, component subtree sharing
3. **TanStack Query**: Server state, data fetching, caching
4. **Local State**: Component-specific UI state

By following the decision tree and best practices outlined in this document, you can make informed decisions about which state management approach to use for each scenario, ensuring optimal performance, maintainability, and HIPAA compliance.

---

**Related Documentation:**
- [Integration Complete Guide](./INTEGRATION_COMPLETE.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Quick Start Guide](./QUICK_START.md)

**Last Updated:** October 11, 2025
**Version:** 1.0.0
