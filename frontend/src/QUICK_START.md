# Quick Start Guide

## Table of Contents

- [New Developer Onboarding](#new-developer-onboarding)
- [Project Setup](#project-setup)
- [Understanding the Architecture](#understanding-the-architecture)
- [How to Add a New Page with State Management](#how-to-add-a-new-page-with-state-management)
- [How to Add a New Route with Guards](#how-to-add-a-new-route-with-guards)
- [How to Implement Optimistic Updates](#how-to-implement-optimistic-updates)
- [Common Patterns and Examples](#common-patterns-and-examples)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)
- [Next Steps](#next-steps)

---

## New Developer Onboarding

Welcome to the White Cross platform! This guide will help you get up to speed quickly with our state management and routing architecture.

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 15+ running
- Basic knowledge of React, TypeScript, and Redux
- Familiarity with healthcare/HIPAA concepts (helpful but not required)

### 5-Minute Overview

1. **State Management**: We use a hybrid approach with Redux, Context API, and TanStack Query
2. **Navigation**: React Router v6 with custom navigation guards for permissions
3. **Data Fetching**: TanStack Query for server state, optimistic updates built-in
4. **Type Safety**: Full TypeScript coverage across the entire application

---

## Project Setup

### 1. Clone and Install

```bash
# Clone repository
git clone https://github.com/your-org/white-cross.git
cd white-cross

# Install all dependencies (monorepo)
npm run setup

# Or install frontend only
cd frontend
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp frontend/.env.example frontend/.env.local

# Configure your environment variables
# Edit frontend/.env.local with your settings
```

### 3. Start Development Server

```bash
# From project root (starts both frontend and backend)
npm run dev

# Or start frontend only
cd frontend
npm run dev

# Frontend will be available at http://localhost:5173
```

### 4. Verify Setup

Visit `http://localhost:5173` and you should see the login page. If you see errors, check:
- Backend is running on `http://localhost:3001`
- Database is running and migrations are applied
- Environment variables are configured correctly

---

## Understanding the Architecture

### State Management Layers

```
┌─────────────────────────────────────────────┐
│         Application Components              │
└─────────────────┬───────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌────────┐   ┌─────────┐   ┌─────────┐
│ Redux  │   │ Context │   │TanStack │
│ Store  │   │   API   │   │  Query  │
└───┬────┘   └────┬────┘   └────┬────┘
    │             │             │
    └─────────────┼─────────────┘
                  │
                  ▼
         ┌────────────────┐
         │  API Services  │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │  Backend API   │
         └────────────────┘
```

### When to Use Each Approach

**Use Redux when:**
- State needs to be accessed globally
- Complex state logic with many actions
- Need Redux DevTools for debugging

**Use Context when:**
- Feature-specific state
- Limited to a component subtree
- Works well with TanStack Query

**Use TanStack Query when:**
- Fetching data from APIs
- Need caching and automatic refetching
- Optimistic updates required

**Use Local State when:**
- Component-only state
- Form inputs, UI toggles
- Temporary values

---

## How to Add a New Page with State Management

### Step 1: Create the Page Component

```typescript
// frontend/src/pages/MyNewPage.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks/reduxHooks';
import { fetchMyData, selectMyData } from '@/stores/slices/myDataSlice';

function MyNewPage() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectMyData);
  const loading = useAppSelector(state => state.myData.loading);

  React.useEffect(() => {
    dispatch(fetchMyData());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My New Page</h1>
      {/* Your content here */}
    </div>
  );
}

export default MyNewPage;
```

### Step 2: Create Redux Slice (if needed)

```typescript
// frontend/src/stores/slices/myDataSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { myDataApi } from '@/services';

interface MyDataState {
  items: MyDataItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MyDataState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMyData = createAsyncThunk(
  'myData/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await myDataApi.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const myDataSlice = createSlice({
  name: 'myData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyData.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectMyData = (state: RootState) => state.myData.items;

export default myDataSlice.reducer;
```

### Step 3: Register Slice in Store

```typescript
// frontend/src/stores/reduxStore.ts
import myDataSlice from './slices/myDataSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    incidentReports: incidentReportsSlice,
    myData: myDataSlice, // Add your new slice
  },
  // ... rest of configuration
});
```

### Step 4: Add Route

```typescript
// frontend/src/routes/index.tsx
import MyNewPage from '@/pages/MyNewPage';

// In your route configuration
<Route path="/my-new-page" element={<MyNewPage />} />
```

---

## How to Add a New Route with Guards

### Example 1: Basic Auth Guard

```typescript
// frontend/src/pages/ProtectedPage.tsx
import { withAuthGuard } from '@/guards/navigationGuards';

function ProtectedPage() {
  return <div>Protected Content</div>;
}

// Wrap with auth guard
export default withAuthGuard(ProtectedPage);
```

### Example 2: Role-Based Access

```typescript
// frontend/src/pages/AdminPage.tsx
import { composeGuards, withAuthGuard, withRoleGuard } from '@/guards/navigationGuards';

function AdminPage() {
  return <div>Admin Only Content</div>;
}

// Combine multiple guards
export default composeGuards([
  withAuthGuard,
  withRoleGuard(['ADMIN', 'DISTRICT_ADMIN'])
])(AdminPage);
```

### Example 3: Permission-Based Access

```typescript
// frontend/src/pages/StudentEditPage.tsx
import {
  composeGuards,
  withAuthGuard,
  withPermissionGuard
} from '@/guards/navigationGuards';

function StudentEditPage() {
  return <div>Edit Student</div>;
}

export default composeGuards([
  withAuthGuard,
  withPermissionGuard([
    { resource: 'students', action: 'update' }
  ])
])(StudentEditPage);
```

### Example 4: Data Loading Guard

```typescript
// frontend/src/pages/StudentDetailPage.tsx
import { useParams } from 'react-router-dom';
import {
  composeGuards,
  withAuthGuard,
  withDataGuard
} from '@/guards/navigationGuards';
import { studentsApi } from '@/services';

interface Props {
  guardData: { student: Student };
}

function StudentDetailPage({ guardData }: Props) {
  const { student } = guardData;

  return (
    <div>
      <h1>{student.firstName} {student.lastName}</h1>
      {/* Rest of content */}
    </div>
  );
}

export default composeGuards([
  withAuthGuard,
  withDataGuard(async (context) => {
    const studentId = context.params?.studentId;
    if (!studentId) throw new Error('Student ID required');

    const student = await studentsApi.getById(studentId);
    return { student };
  })
])(StudentDetailPage);
```

### Adding Route to Router

```typescript
// frontend/src/routes/index.tsx
import { Routes, Route } from 'react-router-dom';
import ProtectedPage from '@/pages/ProtectedPage';
import AdminPage from '@/pages/AdminPage';
import StudentEditPage from '@/pages/StudentEditPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Guards are applied in component export */}
      <Route path="/protected" element={<ProtectedPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/students/:studentId/edit" element={<StudentEditPage />} />
    </Routes>
  );
}
```

---

## How to Implement Optimistic Updates

### Example 1: Using Context API with TanStack Query

```typescript
// In your context provider
const updateMutation = useMutation({
  mutationFn: (data: UpdateRequest) => api.update(id, data),

  // 1. Optimistically update UI
  onMutate: async (newData) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries({ queryKey: ['myData'] });

    // Snapshot previous value
    const previousData = queryClient.getQueryData(['myData']);

    // Optimistically update cache
    queryClient.setQueryData(['myData'], (old: any) => ({
      ...old,
      ...newData,
    }));

    // Return context with previous data
    return { previousData };
  },

  // 2. On success: Invalidate and refetch
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['myData'] });
    toast.success('Updated successfully');
  },

  // 3. On error: Rollback to previous data
  onError: (err, variables, context) => {
    if (context?.previousData) {
      queryClient.setQueryData(['myData'], context.previousData);
    }
    toast.error('Update failed');
  },
});
```

### Example 2: Using Redux

```typescript
// In your component
function MyComponent() {
  const dispatch = useAppDispatch();

  const handleUpdate = async (id: string, data: UpdateData) => {
    // 1. Optimistically update UI
    dispatch(optimisticUpdateItem({ id, data }));

    try {
      // 2. Send API request
      const result = await dispatch(updateItem({ id, data })).unwrap();

      // 3. Success: Keep optimistic update
      toast.success('Updated successfully');
    } catch (error) {
      // 4. Error: Revert optimistic update
      dispatch(revertOptimisticUpdate(id));
      toast.error('Update failed');
    }
  };

  return (
    <button onClick={() => handleUpdate(itemId, newData)}>
      Update
    </button>
  );
}

// In your slice
reducers: {
  optimisticUpdateItem: (state, action: PayloadAction<{id: string, data: Partial<Item>}>) => {
    const { id, data } = action.payload;
    const index = state.items.findIndex(item => item.id === id);
    if (index !== -1) {
      state.items[index] = { ...state.items[index], ...data };
    }
  },
  revertOptimisticUpdate: (state, action: PayloadAction<string>) => {
    // Fetch from cache or refetch
    // Implementation depends on your caching strategy
  },
}
```

---

## Common Patterns and Examples

### Pattern 1: Fetching Data on Mount

```typescript
function MyComponent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  return <div>Content</div>;
}
```

### Pattern 2: Filtering and Sorting

```typescript
function DataList() {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({ status: 'ACTIVE' });

  useEffect(() => {
    dispatch(fetchData(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <FilterBar onFilterChange={handleFilterChange} />
      <DataTable />
    </div>
  );
}
```

### Pattern 3: Form with Context

```typescript
function MyForm() {
  const { createItem, isCreating } = useMyContext();
  const [formData, setFormData] = useState(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createItem(formData);
      setFormData(initialFormData); // Reset form
      toast.success('Created successfully');
    } catch (error) {
      toast.error('Failed to create');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <button type="submit" disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### Pattern 4: Conditional Rendering Based on Permissions

```typescript
import { checkPermission } from '@/guards/navigationGuards';
import { useAuthContext } from '@/contexts/AuthContext';

function MyComponent() {
  const { user } = useAuthContext();

  const canEdit = checkPermission(user, {
    resource: 'students',
    action: 'update'
  });

  const canDelete = checkPermission(user, {
    resource: 'students',
    action: 'delete'
  });

  return (
    <div>
      {canEdit && <button>Edit</button>}
      {canDelete && <button>Delete</button>}
    </div>
  );
}
```

### Pattern 5: Dependent Queries

```typescript
function StudentHealthRecords({ studentId }: Props) {
  // First query: Get student
  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => studentsApi.getById(studentId),
  });

  // Second query: Get health records (depends on student)
  const { data: healthRecords, isLoading: recordsLoading } = useQuery({
    queryKey: ['health-records', student?.id],
    queryFn: () => healthRecordsApi.getByStudentId(student!.id),
    enabled: !!student, // Only run when student is loaded
  });

  if (studentLoading) return <LoadingSpinner />;
  if (recordsLoading) return <div>Loading records...</div>;

  return <div>{/* Render health records */}</div>;
}
```

### Pattern 6: Infinite Scroll with TanStack Query

```typescript
function InfiniteList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: ({ pageParam = 1 }) => api.getItems({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  return (
    <div>
      {data?.pages.map((page) => (
        page.items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

---

## Troubleshooting Common Issues

### Issue 1: "Cannot read property of undefined"

**Problem:** Accessing nested properties before data is loaded.

```typescript
// ❌ Bad
function MyComponent() {
  const data = useAppSelector(selectData);
  return <div>{data.items[0].name}</div>; // Error if data not loaded
}

// ✅ Good
function MyComponent() {
  const data = useAppSelector(selectData);

  if (!data || !data.items || data.items.length === 0) {
    return <div>No data</div>;
  }

  return <div>{data.items[0].name}</div>;
}
```

### Issue 2: Infinite Re-renders

**Problem:** Dispatching actions or calling hooks in render.

```typescript
// ❌ Bad
function MyComponent() {
  const dispatch = useAppDispatch();
  dispatch(fetchData()); // Causes infinite re-renders
  return <div>Content</div>;
}

// ✅ Good
function MyComponent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  return <div>Content</div>;
}
```

### Issue 3: Stale Closure in useEffect

**Problem:** useEffect not seeing latest values.

```typescript
// ❌ Bad
function MyComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1); // Always uses initial count value
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Empty deps array

  return <div>{count}</div>;
}

// ✅ Good
function MyComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1); // Uses latest count
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div>{count}</div>;
}
```

### Issue 4: Context Provider Not Found

**Problem:** Using context hook outside of provider.

```typescript
// ❌ Bad
function App() {
  return (
    <MyComponent /> // Error: used outside provider
  );
}

// ✅ Good
function App() {
  return (
    <MyContextProvider>
      <MyComponent />
    </MyContextProvider>
  );
}
```

### Issue 5: TanStack Query Not Refetching

**Problem:** Query not refetching when it should.

```typescript
// ❌ Bad
const { data } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: Infinity, // Never refetches
});

// ✅ Good
const { data, refetch } = useQuery({
  queryKey: ['data', filters], // Include dependencies in key
  queryFn: () => fetchData(filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Manually refetch when needed
useEffect(() => {
  refetch();
}, [someCondition, refetch]);
```

### Issue 6: Redux State Not Updating

**Problem:** Mutating state directly instead of immutably.

```typescript
// ❌ Bad (without Redux Toolkit)
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE':
      state.items.push(action.payload); // Direct mutation
      return state;
  }
}

// ✅ Good (with Redux Toolkit - Immer allows mutations)
const slice = createSlice({
  name: 'mySlice',
  initialState,
  reducers: {
    updateItems: (state, action) => {
      state.items.push(action.payload); // Immer handles immutability
    },
  },
});
```

### Issue 7: Memory Leaks

**Problem:** Not cleaning up subscriptions, timers, or event listeners.

```typescript
// ❌ Bad
function MyComponent() {
  useEffect(() => {
    const subscription = observable.subscribe(handleData);
    // Missing cleanup
  }, []);
}

// ✅ Good
function MyComponent() {
  useEffect(() => {
    const subscription = observable.subscribe(handleData);
    return () => subscription.unsubscribe(); // Cleanup
  }, []);
}
```

---

## Next Steps

### 1. Explore Documentation

- [Integration Complete Guide](./INTEGRATION_COMPLETE.md) - Detailed overview of all features
- [State Management Architecture](./STATE_MANAGEMENT_ARCHITECTURE.md) - Deep dive into architecture
- [Testing Guide](./TESTING_GUIDE.md) - Comprehensive testing strategies

### 2. Review Example Code

- Check out the example files in:
  - `frontend/src/stores/slices/*.example.ts`
  - `frontend/src/contexts/*.example.tsx`
  - `frontend/src/guards/*.examples.tsx`

### 3. Study Existing Features

- **Incident Reports**: Full Redux implementation
- **Witness Statements**: Context API with TanStack Query
- **Follow-Up Actions**: Context with advanced features
- **Navigation Guards**: Permission-based routing

### 4. Build Something

The best way to learn is by doing! Try:
1. Adding a new page with state management
2. Creating a form with validation
3. Implementing a new Redux slice
4. Adding a new Context provider
5. Writing tests for your features

### 5. Get Help

- Read the inline documentation in the code
- Check existing tests for examples
- Review the TypeScript types for API contracts
- Ask questions in team channels

### 6. Contribute

- Follow the coding standards
- Write tests for new features
- Update documentation for new patterns
- Submit pull requests with clear descriptions

---

## Useful Commands

```bash
# Development
npm run dev                 # Start frontend dev server
npm run dev:backend         # Start backend dev server
npm run build              # Build for production
npm run preview            # Preview production build

# Testing
npm test                   # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
npm run test:e2e           # Run Cypress E2E tests

# Database
cd backend
npx sequelize-cli db:migrate        # Run migrations
npx sequelize-cli db:seed:all       # Run seeders
npx sequelize-cli db:migrate:undo   # Undo last migration

# Linting
npm run lint               # Lint code
npm run lint:fix           # Auto-fix linting issues
npm run type-check         # TypeScript type checking

# Code Quality
npm run format             # Format code with Prettier
npm run analyze            # Analyze bundle size
```

---

## Quick Reference Cards

### Redux Pattern
```typescript
// 1. Define slice
const slice = createSlice({ /* ... */ });

// 2. Add to store
export const store = configureStore({
  reducer: { myFeature: slice.reducer }
});

// 3. Use in component
const data = useAppSelector(selectData);
dispatch(fetchData());
```

### Context Pattern
```typescript
// 1. Create context
const MyContext = createContext<MyContextValue | undefined>(undefined);

// 2. Create provider
export function MyProvider({ children }) {
  return <MyContext.Provider value={...}>{children}</MyContext.Provider>;
}

// 3. Create hook
export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) throw new Error('Must be used within MyProvider');
  return context;
}

// 4. Use in component
const { data, actions } = useMyContext();
```

### TanStack Query Pattern
```typescript
// 1. Define query
const { data, isLoading, error } = useQuery({
  queryKey: ['myData'],
  queryFn: fetchMyData,
});

// 2. Define mutation
const mutation = useMutation({
  mutationFn: updateData,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myData'] }),
});

// 3. Use mutation
mutation.mutate(newData);
```

### Navigation Guard Pattern
```typescript
// 1. Import guards
import { composeGuards, withAuthGuard, withRoleGuard } from '@/guards';

// 2. Apply to component
export default composeGuards([
  withAuthGuard,
  withRoleGuard(['NURSE', 'ADMIN'])
])(MyPage);
```

---

**Welcome to the team! Happy coding!**

---

**Related Documentation:**
- [Integration Complete Guide](./INTEGRATION_COMPLETE.md)
- [State Management Architecture](./STATE_MANAGEMENT_ARCHITECTURE.md)
- [Testing Guide](./TESTING_GUIDE.md)

**Last Updated:** October 11, 2025
**Version:** 1.0.0
