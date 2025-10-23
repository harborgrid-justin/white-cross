# Redux Integration Guide for White Cross Frontend

## Overview

This guide explains how to integrate Redux Toolkit into page components in the White Cross Healthcare Platform. The application uses a hybrid architecture with both page-level and global Redux slices.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [When to Use Redux](#when-to-use-redux)
4. [Step-by-Step Integration](#step-by-step-integration)
5. [Complete Examples](#complete-examples)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

## Architecture Overview

### Redux Store Structure

```
┌─────────────────────────────────────┐
│         Redux Store                 │
├─────────────────────────────────────┤
│  Global Slices (stores/slices/)     │
│  - auth                             │
│  - users                            │
│  - districts                        │
│  - schools                          │
│  - settings                         │
│  - documents                        │
│  - communication                    │
│  - inventory                        │
│  - reports                          │
├─────────────────────────────────────┤
│  Page-Specific Slices               │
│  (pages/[feature]/store/)           │
│  - dashboard                        │
│  - students                         │
│  - appointments                     │
│  - medications                      │
│  - incidents                        │
│  - healthRecords                    │
│  - emergencyContacts                │
└─────────────────────────────────────┘
```

### Component Hierarchy

```
App (Provider)
  └── BrowserRouter
      └── AuthProvider
          └── AppRoutes
              └── Page Components (Redux Connected)
                  └── Feature Components (Redux Connected)
                      └── UI Components (Props Only)
```

## Directory Structure

### Page-Specific Store

Each major feature has its own store directory:

```
pages/
└── [feature]/
    ├── store/
    │   ├── [feature]Slice.ts    # Redux slice
    │   └── index.ts             # Exports
    ├── components/              # Feature-specific components
    ├── [Feature].tsx            # Main page component
    ├── routes.tsx               # Feature routes
    └── index.ts                 # Feature exports
```

### Example: Students Feature

```
pages/students/
├── store/
│   ├── studentsSlice.ts
│   ├── healthRecordsSlice.ts
│   ├── emergencyContactsSlice.ts
│   └── index.ts
├── components/
│   ├── StudentCard.tsx
│   ├── StudentForm.tsx
│   └── StudentFilters.tsx
├── Students.tsx
├── StudentDetails.tsx
├── routes.tsx
└── index.ts
```

## When to Use Redux

### ✅ Use Redux For:

1. **Data that needs to be shared** across multiple components
2. **Server data** fetched from APIs
3. **Complex state** with multiple update patterns
4. **State that persists** across page navigations
5. **State that needs to sync** across browser tabs
6. **Undo/redo** or time-travel debugging needs

### ❌ Don't Use Redux For:

1. **UI-only state** (modal open/closed, form field focus, etc.)
2. **Transient data** (current mouse position, scroll position)
3. **Data that's never shared** outside a single component
4. **Simple component state** (toggle, counter within component)
5. **Form drafts** (use react-hook-form or local state)

## Step-by-Step Integration

### Step 1: Create the Slice

Create a slice file in your feature's store directory:

```typescript
// pages/students/store/studentsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/stores';
import { studentsApi } from '@/services';
import type { Student } from '@/types';

// State interface
interface StudentsState {
  students: Student[];
  selectedStudent: Student | null;
  loading: {
    list: boolean;
    detail: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
  };
  error: {
    list: string | null;
    detail: string | null;
    creating: string | null;
    updating: string | null;
    deleting: string | null;
  };
  filters: {
    search: string;
    grade: string | null;
    status: 'active' | 'inactive' | 'all';
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: StudentsState = {
  students: [],
  selectedStudent: null,
  loading: {
    list: false,
    detail: false,
    creating: false,
    updating: false,
    deleting: false,
  },
  error: {
    list: null,
    detail: null,
    creating: null,
    updating: null,
    deleting: null,
  },
  filters: {
    search: '',
    grade: null,
    status: 'active',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

// Async thunks
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await studentsApi.getStudents(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch students');
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  'students/fetchStudentById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await studentsApi.getStudentById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch student');
    }
  }
);

export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (data: Partial<Student>, { rejectWithValue }) => {
    try {
      const response = await studentsApi.createStudent(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create student');
    }
  }
);

// Slice
const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<StudentsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
      state.selectedStudent = action.payload;
    },
    clearErrors: (state) => {
      state.error = initialState.error;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch students list
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading.list = false;
        state.students = action.payload.students;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload as string;
      });

    // Fetch student by ID
    builder
      .addCase(fetchStudentById.pending, (state) => {
        state.loading.detail = true;
        state.error.detail = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading.detail = false;
        state.selectedStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading.detail = false;
        state.error.detail = action.payload as string;
      });

    // Create student
    builder
      .addCase(createStudent.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.students.unshift(action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload as string;
      });
  },
});

// Selectors
export const selectStudents = (state: RootState) => state.students.students;
export const selectSelectedStudent = (state: RootState) => state.students.selectedStudent;
export const selectLoading = (state: RootState) => state.students.loading;
export const selectError = (state: RootState) => state.students.error;
export const selectFilters = (state: RootState) => state.students.filters;
export const selectPagination = (state: RootState) => state.students.pagination;

// Memoized selectors
export const selectActiveStudents = (state: RootState) =>
  state.students.students.filter(s => s.isActive);

export const selectStudentsByGrade = (state: RootState, grade: string) =>
  state.students.students.filter(s => s.grade === grade);

// Actions
export const { setFilters, setSelectedStudent, clearErrors, resetState } = 
  studentsSlice.actions;

// Reducer
export const studentsReducer = studentsSlice.reducer;
export default studentsSlice.reducer;
```

### Step 2: Register the Slice in Store

Add the reducer to `stores/reduxStore.ts`:

```typescript
// Import the reducer
import { studentsReducer } from '../pages/students/store/studentsSlice';

// Add to rootReducer
const rootReducer = combineReducers({
  // ... existing reducers
  students: studentsReducer,
});
```

### Step 3: Export from Store Index

Add exports to `stores/index.ts`:

```typescript
// Export actions and selectors
export {
  fetchStudents,
  fetchStudentById,
  createStudent,
  setFilters,
  clearErrors,
  selectStudents,
  selectActiveStudents,
  selectStudentsByGrade,
} from '../pages/students/store/studentsSlice';
```

### Step 4: Connect the Component

Update your page component to use Redux:

```typescript
// pages/students/Students.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores';
import {
  fetchStudents,
  selectStudents,
  selectLoading,
  selectError,
  selectFilters,
  setFilters,
} from './store/studentsSlice';

const Students: React.FC = () => {
  // Redux hooks
  const dispatch = useAppDispatch();
  const students = useAppSelector(selectStudents);
  const { list: loading } = useAppSelector(selectLoading);
  const { list: error } = useAppSelector(selectError);
  const filters = useAppSelector(selectFilters);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchStudents({ page: 1, limit: 20 }));
  }, [dispatch]);

  // Handle search
  const handleSearch = (query: string) => {
    dispatch(setFilters({ search: query }));
  };

  // Render
  if (loading) {
    return <div>Loading students...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Students</h1>
      <input
        type="text"
        value={filters.search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search students..."
      />
      <div>
        {students.map((student) => (
          <div key={student.id}>
            {student.firstName} {student.lastName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Students;
```

## Complete Examples

### Example 1: Simple List Page

See `pages/dashboard/DashboardReduxExample.tsx` for a complete example of:
- Fetching multiple data sources
- Handling loading states
- Error handling
- Using selectors
- Dispatching actions

### Example 2: Form with Create/Update

```typescript
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores';
import { createStudent, selectLoading } from './store/studentsSlice';
import toast from 'react-hot-toast';

const StudentForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { creating } = useAppSelector(selectLoading);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    grade: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await dispatch(createStudent(formData));
    
    if (createStudent.fulfilled.match(result)) {
      toast.success('Student created successfully!');
      setFormData({ firstName: '', lastName: '', grade: '' });
    } else {
      toast.error('Failed to create student');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        placeholder="First Name"
      />
      <input
        type="text"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        placeholder="Last Name"
      />
      <select
        value={formData.grade}
        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
      >
        <option value="">Select Grade</option>
        <option value="9">9th Grade</option>
        <option value="10">10th Grade</option>
      </select>
      <button type="submit" disabled={creating}>
        {creating ? 'Creating...' : 'Create Student'}
      </button>
    </form>
  );
};
```

### Example 3: Detail Page with Related Data

```typescript
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/stores';
import {
  fetchStudentById,
  selectSelectedStudent,
  selectLoading,
} from './store/studentsSlice';

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const student = useAppSelector(selectSelectedStudent);
  const { detail: loading } = useAppSelector(selectLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchStudentById(id));
    }
  }, [id, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>Student not found</div>;

  return (
    <div>
      <h1>{student.firstName} {student.lastName}</h1>
      <p>Grade: {student.grade}</p>
      <p>Student #: {student.studentNumber}</p>
    </div>
  );
};
```

## Common Patterns

### 1. Optimistic Updates

```typescript
// In slice
optimisticUpdateStudent: (state, action: PayloadAction<{ id: string; data: Partial<Student> }>) => {
  const index = state.students.findIndex(s => s.id === action.payload.id);
  if (index !== -1) {
    state.students[index] = { ...state.students[index], ...action.payload.data };
  }
},

// In component
const handleUpdate = (id: string, data: Partial<Student>) => {
  // Optimistically update UI
  dispatch(optimisticUpdateStudent({ id, data }));
  
  // Then sync with server
  dispatch(updateStudent({ id, data }))
    .unwrap()
    .catch(() => {
      // Revert on error
      dispatch(fetchStudentById(id));
    });
};
```

### 2. Pagination

```typescript
const handlePageChange = (page: number) => {
  dispatch(fetchStudents({ page, limit: 20 }));
};

// In component
<Pagination
  currentPage={pagination.page}
  totalPages={Math.ceil(pagination.total / pagination.limit)}
  onPageChange={handlePageChange}
/>
```

### 3. Filtering and Sorting

```typescript
// Local filtering (client-side)
const filteredStudents = useAppSelector((state) => {
  const { students, filters } = state.students;
  return students.filter((s) => 
    s.firstName.toLowerCase().includes(filters.search.toLowerCase())
  );
});

// Server-side filtering
useEffect(() => {
  dispatch(fetchStudents({ 
    page: 1, 
    search: filters.search,
    grade: filters.grade 
  }));
}, [filters, dispatch]);
```

### 4. Error Handling

```typescript
// Show error toast
useEffect(() => {
  if (error.list) {
    toast.error(error.list);
    dispatch(clearErrors());
  }
}, [error.list, dispatch]);

// Retry mechanism
const handleRetry = () => {
  dispatch(fetchStudents());
};

if (error.list) {
  return (
    <div>
      <p>Error: {error.list}</p>
      <button onClick={handleRetry}>Retry</button>
    </div>
  );
}
```

## Troubleshooting

### Issue: "Cannot find module '@/stores'"

**Solution:** Check your `tsconfig.json` has the path alias:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Type errors with useAppSelector

**Solution:** Make sure you're using the typed hooks from `@/stores`:

```typescript
// ✅ Correct
import { useAppSelector } from '@/stores';

// ❌ Wrong
import { useSelector } from 'react-redux';
```

### Issue: Slice not registered

**Solution:** Check that your slice is:
1. Exported from the slice file
2. Imported in `stores/reduxStore.ts`
3. Added to `rootReducer` in `combineReducers()`

### Issue: State not persisting

**Solution:** Configure state sync in `stores/reduxStore.ts`:

```typescript
const stateSyncConfig: StateSyncConfig = {
  slices: [
    {
      sliceName: 'mySlice',
      storage: 'localStorage',
      strategy: SyncStrategy.DEBOUNCED,
      // ... other config
    },
  ],
};
```

### Issue: Infinite re-renders

**Solution:** Make sure useEffect dependencies are correct:

```typescript
// ✅ Correct - dispatch is stable
useEffect(() => {
  dispatch(fetchData());
}, [dispatch]);

// ❌ Wrong - filters is recreated on every render
useEffect(() => {
  dispatch(fetchData(filters));
}, [filters, dispatch]);
```

## Best Practices

1. **Typed Hooks**: Always use `useAppDispatch` and `useAppSelector`
2. **Selectors**: Create reusable selectors in slice files
3. **Loading States**: Track loading for each operation separately
4. **Error Handling**: Provide specific error messages
5. **Normalization**: Consider normalizing deeply nested data
6. **HIPAA Compliance**: Never persist PHI in Redux state
7. **Clean Code**: Keep slices focused and single-purpose
8. **Testing**: Write tests for reducers and async thunks

## Migration Checklist

When migrating an existing page to Redux:

- [ ] Create slice file in `pages/[feature]/store/`
- [ ] Define state interface
- [ ] Implement async thunks for API calls
- [ ] Create reducers for synchronous actions
- [ ] Add selectors
- [ ] Register reducer in `stores/reduxStore.ts`
- [ ] Export actions/selectors from `stores/index.ts`
- [ ] Update component to use `useAppDispatch` and `useAppSelector`
- [ ] Replace local state with Redux selectors
- [ ] Handle loading and error states
- [ ] Test the integration
- [ ] Remove old state management code

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Redux Hooks Documentation](https://react-redux.js.org/api/hooks)
- [Store README](./frontend/src/stores/README.md)
- [Components README](./frontend/src/components/README.md)
- [Slices README](./frontend/src/stores/slices/README.md)
- [Dashboard Redux Example](./frontend/src/pages/dashboard/DashboardReduxExample.tsx)

## Support

For questions or issues:
1. Review this guide and examples
2. Check existing slice implementations
3. Review Redux Toolkit documentation
4. Contact the frontend architecture team
