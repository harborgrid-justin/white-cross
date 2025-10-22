# Redux Store Architecture

## Overview

This directory contains the Redux store configuration, slices, and typed hooks for the White Cross Healthcare Platform. The store follows enterprise-grade patterns with Redux Toolkit for type-safe state management.

## Directory Structure

```
stores/
├── README.md                 # This file - Store architecture documentation
├── reduxStore.ts            # Main store configuration
├── index.ts                 # Central exports for store, types, and hooks
├── slices/                  # Global/shared state slices
│   ├── authSlice.ts         # Authentication state
│   ├── usersSlice.ts        # User management
│   ├── districtsSlice.ts    # District management
│   ├── schoolsSlice.ts      # School management
│   ├── settingsSlice.ts     # System settings
│   ├── documentsSlice.ts    # Document management
│   ├── communicationSlice.ts # Communication features
│   ├── inventorySlice.ts    # Inventory management
│   └── reportsSlice.ts      # Reporting features
├── domains/                 # Domain-specific state organization
├── shared/                  # Shared utilities and cross-cutting concerns
└── hooks/                   # Custom hooks directory (see /hooks instead)

Note: Domain-specific slices are organized in /pages/[domain]/store/ for better colocation.
```

## Page-Level Store Organization

Each major feature/page has its own store directory:

```
pages/
├── dashboard/
│   └── store/
│       ├── dashboardSlice.ts   # Dashboard-specific state
│       └── index.ts            # Exports
├── students/
│   └── store/
│       ├── studentsSlice.ts
│       ├── healthRecordsSlice.ts
│       ├── emergencyContactsSlice.ts
│       └── index.ts
├── appointments/
│   └── store/
│       ├── appointmentsSlice.ts
│       └── index.ts
├── medications/
│   └── store/
│       ├── medicationsSlice.ts
│       └── index.ts
└── incidents/
    └── store/
        ├── incidentReportsSlice.ts
        └── index.ts
```

## Components Directory Organization

Components are organized by type and feature:

```
components/
├── ui/                      # Reusable UI components
│   ├── buttons/
│   ├── inputs/
│   ├── feedback/
│   ├── layout/
│   ├── navigation/
│   └── overlays/
├── features/                # Feature-specific components
│   ├── students/
│   ├── medications/
│   ├── appointments/
│   ├── health-records/
│   └── communication/
├── forms/                   # Form components
├── layout/                  # Layout components
├── shared/                  # Shared components
│   ├── errors/
│   ├── security/
│   └── data/
├── pages/                   # Page-specific components
└── providers/               # Context providers
```

## Usage Guide

### 1. Using Redux in Components

Always use the typed hooks from the store:

```typescript
import { useAppDispatch, useAppSelector } from '@/stores';
import { fetchStudents, selectActiveStudents } from '@/pages/students/store';

function StudentList() {
  const dispatch = useAppDispatch();
  const students = useAppSelector(selectActiveStudents);
  
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);
  
  return (
    <div>
      {students.map(student => (
        <div key={student.id}>{student.name}</div>
      ))}
    </div>
  );
}
```

### 2. Using Domain-Specific Actions

Import actions directly from domain slices:

```typescript
import { useAppDispatch } from '@/stores';
import { 
  createIncidentReport,
  updateIncidentReport,
  deleteIncidentReport 
} from '@/pages/incidents/store';

function IncidentForm() {
  const dispatch = useAppDispatch();
  
  const handleSubmit = async (data) => {
    await dispatch(createIncidentReport(data));
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 3. Using Selectors

Selectors are exported from slice files:

```typescript
import { useAppSelector } from '@/stores';
import { 
  selectActiveStudents,
  selectStudentsByGrade,
  selectStudentsWithMedications 
} from '@/pages/students/store';

function Dashboard() {
  const activeStudents = useAppSelector(selectActiveStudents);
  const ninthGraders = useAppSelector(state => 
    selectStudentsByGrade(state, '9')
  );
  
  return <div>Active: {activeStudents.length}</div>;
}
```

### 4. Creating New Slices

When creating a new slice, follow this pattern:

```typescript
// pages/[feature]/store/[feature]Slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/stores';

// Define state interface
interface FeatureState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: FeatureState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchItems = createAsyncThunk(
  'feature/fetchItems',
  async (params: FetchParams) => {
    const response = await api.fetchItems(params);
    return response.data;
  }
);

// Slice
const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch';
      });
  },
});

// Selectors
export const selectItems = (state: RootState) => state.feature.items;
export const selectLoading = (state: RootState) => state.feature.loading;
export const selectError = (state: RootState) => state.feature.error;

// Exports
export const { clearError } = featureSlice.actions;
export default featureSlice.reducer;
```

### 5. Registering Slices

Add the reducer to the store:

```typescript
// stores/reduxStore.ts
import featureReducer from '../pages/[feature]/store/[feature]Slice';

const rootReducer = combineReducers({
  // ... existing reducers
  feature: featureReducer,
});
```

## Typed Hooks

The following typed hooks are available from `@/stores`:

- `useAppDispatch()` - Typed dispatch hook
- `useAppSelector()` - Typed selector hook
- `useAuthActions()` - Pre-configured auth action hooks
- `useIncidentActions()` - Pre-configured incident action hooks

## Best Practices

1. **Colocation**: Keep slices close to the features that use them
2. **Typed Hooks**: Always use `useAppDispatch` and `useAppSelector`
3. **Selectors**: Create memoized selectors for derived state
4. **Async Thunks**: Use for API calls and async logic
5. **Error Handling**: Always handle loading and error states
6. **HIPAA Compliance**: Never persist PHI data in Redux state
7. **State Sync**: Configure proper sync settings for cross-tab communication

## State Synchronization

The store includes state synchronization middleware for:
- Cross-tab communication (BroadcastChannel)
- Persistent state (localStorage/sessionStorage)
- HIPAA-compliant data exclusion
- Automatic hydration on app load

See `stores/reduxStore.ts` for configuration details.

## Testing

Test your slices using the Redux Toolkit testing utilities:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import featureReducer, { fetchItems } from './featureSlice';

describe('Feature Slice', () => {
  it('should handle fetch pending', () => {
    const store = configureStore({ reducer: { feature: featureReducer } });
    store.dispatch(fetchItems.pending('', {}));
    expect(store.getState().feature.loading).toBe(true);
  });
});
```

## Migration Guide

If you have components using local state or Context API, migrate to Redux:

**Before:**
```typescript
const [students, setStudents] = useState([]);
useEffect(() => {
  fetchStudentsAPI().then(setStudents);
}, []);
```

**After:**
```typescript
const dispatch = useAppDispatch();
const students = useAppSelector(selectStudents);
useEffect(() => {
  dispatch(fetchStudents());
}, [dispatch]);
```

## Support

For questions or issues with the Redux store:
1. Review this documentation
2. Check existing slice implementations
3. Review Redux Toolkit documentation
4. Contact the frontend architecture team
