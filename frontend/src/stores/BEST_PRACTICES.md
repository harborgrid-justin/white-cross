# Redux Best Practices for White Cross Platform

This guide outlines best practices for using Redux throughout the White Cross frontend application.

## Table of Contents

1. [General Principles](#general-principles)
2. [Component Patterns](#component-patterns)
3. [Performance Optimization](#performance-optimization)
4. [Error Handling](#error-handling)
5. [Testing Strategies](#testing-strategies)
6. [HIPAA Compliance](#hipaa-compliance)
7. [Migration from React Query](#migration-from-react-query)

## General Principles

### 1. Always Use Typed Hooks

```typescript
// ✅ GOOD - Type-safe
import { useAppSelector, useAppDispatch } from '@/stores';

function MyComponent() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.students);
}

// ❌ BAD - No type safety
import { useSelector, useDispatch } from 'react-redux';
```

### 2. Centralized Imports

```typescript
// ✅ GOOD - Import from central index
import {
  useStudents,
  useStudentsActions,
  useActiveStudents
} from '@/stores';

// ❌ BAD - Deep imports
import { useStudents } from '@/stores/hooks/allDomainHooks';
```

### 3. Separation of Concerns

```typescript
// ✅ GOOD - Separate data fetching from presentation
function StudentsList() {
  const students = useActiveStudents();
  const { fetchAll } = useStudentsActions();

  useEffect(() => {
    fetchAll({ active: true });
  }, [fetchAll]);

  return <StudentsTable students={students} />;
}

// ❌ BAD - Mixed concerns
function StudentsList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  return <table>{/* render */}</table>;
}
```

## Component Patterns

### Container/Presenter Pattern

**Container (Smart Component):**
```typescript
// containers/StudentListContainer.tsx
import { useActiveStudents, useStudentsActions } from '@/stores';

export default function StudentListContainer() {
  const students = useActiveStudents();
  const { fetchAll, delete: deleteStudent } = useStudentsActions();
  const loading = useAppSelector(state => state.students.loading.list.isLoading);
  const error = useAppSelector(state => state.students.loading.list.error);

  useEffect(() => {
    fetchAll({ active: true });
  }, [fetchAll]);

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent(id).unwrap();
      toast.success('Student deleted');
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <StudentListPresenter
      students={students}
      onDelete={handleDelete}
    />
  );
}
```

**Presenter (Dumb Component):**
```typescript
// components/StudentListPresenter.tsx
interface Props {
  students: Student[];
  onDelete: (id: string) => void;
}

export function StudentListPresenter({ students, onDelete }: Props) {
  return (
    <div className="student-list">
      {students.map(student => (
        <StudentCard
          key={student.id}
          student={student}
          onDelete={() => onDelete(student.id)}
        />
      ))}
    </div>
  );
}
```

### Custom Hook Pattern

```typescript
// hooks/useStudentManagement.ts
import { useStudents, useStudentsActions } from '@/stores';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function useStudentManagement() {
  const students = useStudents();
  const { fetchAll, create, update, delete: del } = useStudentsActions();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loading = useAppSelector(state => state.students.loading);

  const selectedStudent = useAppSelector(state =>
    state.students.entities[selectedId || '']
  );

  const handleCreate = async (data: CreateStudentData) => {
    try {
      const result = await create(data).unwrap();
      toast.success('Student created');
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create student');
      throw error;
    }
  };

  const handleUpdate = async (id: string, data: UpdateStudentData) => {
    try {
      await update({ id, data }).unwrap();
      toast.success('Student updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update');
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this student?')) return;

    try {
      await del(id).unwrap();
      toast.success('Student deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
      throw error;
    }
  };

  return {
    students,
    selectedStudent,
    loading,
    setSelectedId,
    fetchAll,
    create: handleCreate,
    update: handleUpdate,
    delete: handleDelete,
  };
}

// Usage in component:
function StudentsPage() {
  const {
    students,
    loading,
    fetchAll,
    create,
    update,
    delete: deleteStudent
  } = useStudentManagement();

  // Component logic...
}
```

### HOC Pattern for Common Behaviors

```typescript
// hoc/withReduxData.tsx
import React, { useEffect } from 'react';
import { useAppSelector } from '@/stores';

interface WithDataProps<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

export function withReduxData<T, P extends WithDataProps<T>>(
  WrappedComponent: React.ComponentType<P>,
  selector: (state: RootState) => T[],
  fetchAction: () => void,
  loadingSelector: (state: RootState) => boolean,
  errorSelector: (state: RootState) => string | null
) {
  return function WithDataComponent(props: Omit<P, keyof WithDataProps<T>>) {
    const data = useAppSelector(selector);
    const loading = useAppSelector(loadingSelector);
    const error = useAppSelector(errorSelector);

    useEffect(() => {
      fetchAction();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} />;

    return <WrappedComponent {...(props as P)} data={data} loading={loading} error={error} />;
  };
}

// Usage:
const StudentsWithData = withReduxData(
  StudentsList,
  state => state.students.ids.map(id => state.students.entities[id]).filter(Boolean),
  () => store.dispatch(fetchStudents()),
  state => state.students.loading.list.isLoading,
  state => state.students.loading.list.error
);
```

## Performance Optimization

### 1. Memoized Selectors

```typescript
// selectors/studentSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/stores';

// ✅ GOOD - Memoized, only recomputes when dependencies change
export const selectActiveStudentsWithMedications = createSelector(
  [
    (state: RootState) => state.students.entities,
    (state: RootState) => state.medications.entities,
  ],
  (students, medications) => {
    return Object.values(students)
      .filter(student => student?.isActive)
      .filter(student =>
        Object.values(medications).some(med => med?.studentId === student?.id)
      );
  }
);

// Usage:
const students = useAppSelector(selectActiveStudentsWithMedications);
```

### 2. Debounced Selectors for Search

```typescript
import { useDebouncedSelector } from '@/stores';

function StudentSearch() {
  const searchQuery = useDebouncedSelector(
    state => state.students.filters.search,
    500 // 500ms debounce
  );

  // searchQuery updates only after user stops typing for 500ms
}
```

### 3. Selective Re-renders

```typescript
// ✅ GOOD - Only re-renders when specific data changes
function StudentCount() {
  const count = useAppSelector(state => state.students.ids.length);
  return <div>Total: {count}</div>;
}

// ❌ BAD - Re-renders whenever ANY student state changes
function StudentCount() {
  const students = useAppSelector(state => state.students);
  return <div>Total: {students.ids.length}</div>;
}
```

### 4. Batch Updates

```typescript
import { batch } from 'react-redux';

function handleBulkUpdate(updates: Update[]) {
  batch(() => {
    updates.forEach(update => {
      dispatch(updateStudent({ id: update.id, data: update.data }));
    });
  });
}
```

## Error Handling

### 1. Async Thunk Error Handling

```typescript
function CreateStudentForm() {
  const { create } = useStudentsActions();
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateStudentData) => {
    setFormError(null);

    try {
      const result = await create(data).unwrap();
      toast.success('Student created successfully');
      navigate(`/students/${result.id}`);
    } catch (error: any) {
      // Handle specific error types
      if (error.status === 409) {
        setFormError('A student with this ID already exists');
      } else if (error.status === 422) {
        setFormError('Invalid student data. Please check all fields.');
      } else {
        setFormError(error.message || 'Failed to create student');
      }

      // Log to error tracking service
      console.error('Create student error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formError && (
        <div className="error-banner">{formError}</div>
      )}
      {/* form fields */}
    </form>
  );
}
```

### 2. Global Error Boundary

```typescript
// components/ReduxErrorBoundary.tsx
import React from 'react';
import { useAppSelector } from '@/stores';

export function ReduxErrorBoundary({ children }: { children: React.ReactNode }) {
  const errors = useAppSelector(state => ({
    students: state.students.loading.list.error,
    medications: state.medications.loading.list.error,
    appointments: state.appointments.loading.list.error,
  }));

  const hasError = Object.values(errors).some(error => error !== null);

  if (hasError) {
    return (
      <div className="global-error">
        <h2>Something went wrong</h2>
        <p>Please refresh the page or contact support if the problem persists.</p>
        {Object.entries(errors).map(([key, error]) => (
          error && <div key={key}>{key}: {error}</div>
        ))}
      </div>
    );
  }

  return <>{children}</>;
}
```

### 3. Retry Logic

```typescript
function useStudentsWithRetry() {
  const { fetchAll } = useStudentsActions();
  const error = useAppSelector(state => state.students.loading.list.error);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchAll();
  };

  return {
    error,
    retryCount,
    retry: handleRetry,
    canRetry: retryCount < 3,
  };
}
```

## Testing Strategies

### 1. Unit Testing Components

```typescript
// StudentsList.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { studentsReducer } from '@/stores';
import StudentsList from './StudentsList';

describe('StudentsList', () => {
  function renderWithRedux(initialState = {}) {
    const store = configureStore({
      reducer: {
        students: studentsReducer,
      },
      preloadedState: initialState,
    });

    return render(
      <Provider store={store}>
        <StudentsList />
      </Provider>
    );
  }

  it('displays students from Redux store', () => {
    renderWithRedux({
      students: {
        entities: {
          '1': { id: '1', firstName: 'John', lastName: 'Doe' },
          '2': { id: '2', firstName: 'Jane', lastName: 'Smith' },
        },
        ids: ['1', '2'],
        loading: { list: { isLoading: false, error: null } },
      },
    });

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithRedux({
      students: {
        entities: {},
        ids: [],
        loading: { list: { isLoading: true, error: null } },
      },
    });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

### 2. Testing Custom Hooks

```typescript
// useStudentManagement.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/stores';
import { useStudentManagement } from './useStudentManagement';

describe('useStudentManagement', () => {
  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('creates a student', async () => {
    const { result } = renderHook(() => useStudentManagement(), { wrapper });

    const newStudent = {
      firstName: 'Test',
      lastName: 'Student',
      dateOfBirth: '2010-01-01',
      grade: '5',
    };

    await waitFor(async () => {
      await result.current.create(newStudent);
    });

    expect(result.current.students).toContainEqual(
      expect.objectContaining({ firstName: 'Test' })
    );
  });
});
```

## HIPAA Compliance

### 1. Never Persist Sensitive Data

```typescript
// reduxStore.ts - State sync configuration
const stateSyncConfig: StateSyncConfig = {
  slices: [
    {
      sliceName: 'students',
      storage: 'sessionStorage', // Use session storage for sensitive data
      excludePaths: [
        'ssn',           // Never persist SSN
        'medicalRecords', // Never persist full medical records
        'healthData',    // Never persist health data
      ],
    },
  ],
};
```

### 2. Audit Trail for Data Access

```typescript
function StudentHealthRecords({ studentId }: { studentId: string }) {
  const records = useHealthRecordsByStudent(studentId);
  const { createAuditEntry } = useEnterpriseActions();

  useEffect(() => {
    // Log access for HIPAA compliance
    createAuditEntry({
      action: 'VIEW_HEALTH_RECORDS',
      entityType: 'health_records',
      entityId: studentId,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      metadata: {
        component: 'StudentHealthRecords',
        recordCount: records.length,
      },
    });
  }, [studentId, records.length, createAuditEntry]);

  return <HealthRecordsList records={records} />;
}
```

### 3. Data Encryption

```typescript
// utils/encryption.ts
export function encryptSensitiveData(data: any): string {
  // Implement encryption before storing in Redux
  // This is a placeholder - use proper encryption library
  return btoa(JSON.stringify(data));
}

export function decryptSensitiveData(encrypted: string): any {
  // Decrypt data when reading from Redux
  return JSON.parse(atob(encrypted));
}

// Use in selectors:
export const selectDecryptedHealthRecords = createSelector(
  [(state: RootState) => state.healthRecords.entities],
  (entities) => {
    return Object.values(entities).map(record =>
      record ? { ...record, data: decryptSensitiveData(record.data) } : null
    ).filter(Boolean);
  }
);
```

## Migration from React Query

### Before (React Query):
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '@/services/api';

function StudentsList() {
  const queryClient = useQueryClient();

  const { data: students, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: studentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {students?.map(student => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}
```

### After (Redux):
```typescript
import { useStudents, useStudentsActions } from '@/stores';

function StudentsList() {
  const students = useStudents();
  const { fetchAll, create } = useStudentsActions();

  const isLoading = useAppSelector(state => state.students.loading.list.isLoading);
  const error = useAppSelector(state => state.students.loading.list.error);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreate = async (data: CreateStudentData) => {
    try {
      await create(data).unwrap();
      // Redux automatically updates the store
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {students.map(student => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}
```

## Common Pitfalls to Avoid

### ❌ DON'T: Mutate State Directly

```typescript
// ❌ BAD
function MyComponent() {
  const students = useStudents();
  students.push(newStudent); // Mutates state!
}

// ✅ GOOD
function MyComponent() {
  const { create } = useStudentsActions();
  create(newStudent); // Uses immutable update
}
```

### ❌ DON'T: Store Derived Data in State

```typescript
// ❌ BAD
const [activeStudents, setActiveStudents] = useState([]);
useEffect(() => {
  setActiveStudents(students.filter(s => s.isActive));
}, [students]);

// ✅ GOOD - Use selector
const activeStudents = useActiveStudents();
```

### ❌ DON'T: Fetch in Multiple Components

```typescript
// ❌ BAD - Each component fetches
function ComponentA() {
  const { fetchAll } = useStudentsActions();
  useEffect(() => { fetchAll(); }, []);
}
function ComponentB() {
  const { fetchAll } = useStudentsActions();
  useEffect(() => { fetchAll(); }, []); // Duplicate fetch!
}

// ✅ GOOD - Fetch once at page/layout level
function StudentsPage() {
  const { fetchAll } = useStudentsActions();
  useEffect(() => { fetchAll(); }, []);

  return (
    <>
      <ComponentA />
      <ComponentB />
    </>
  );
}
```

## Summary

✅ **DO:**
- Use typed hooks (`useAppSelector`, `useAppDispatch`)
- Import from central `@/stores` index
- Use memoized selectors for derived data
- Handle errors explicitly with try/catch
- Follow HIPAA compliance guidelines
- Test components with mock Redux store
- Use domain-specific hooks for convenience

❌ **DON'T:**
- Mutate state directly
- Store derived data in component state
- Fetch data in multiple places
- Persist sensitive PHI data
- Skip error handling
- Use deep imports

---

For more examples, see:
- `stores/USAGE_EXAMPLES.md` - Practical code examples
- `stores/QUICK_REFERENCE.md` - Quick reference card
- `stores/INTEGRATION_COMPLETE.md` - Integration guide
