# Migration Guide: React Query to Redux

This guide helps you migrate existing components from React Query to Redux with best practices.

## Quick Comparison

| Feature | React Query | Redux |
|---------|-------------|-------|
| **Data Fetching** | `useQuery` | `useAppSelector` + `useEffect` |
| **Mutations** | `useMutation` | `dispatch(asyncThunk)` |
| **Loading State** | `isLoading` | `state.loading.*.isLoading` |
| **Error State** | `error` | `state.loading.*.error` |
| **Cache Invalidation** | `invalidateQueries` | `dispatch(fetchAction())` |
| **Optimistic Updates** | `onMutate` | `optimisticUpdate` action |

## Migration Patterns

### Pattern 1: Simple Data Fetching

#### Before (React Query):
```typescript
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/services/api';

function StudentsList() {
  const { data: students, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll(),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error.message} />;

  return (
    <div>
      {students?.map(student => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}
```

#### After (Redux):
```typescript
import { useStudents, useStudentsActions, useAppSelector } from '@/stores';
import { useEffect } from 'react';

function StudentsList() {
  const students = useStudents();
  const { fetchAll } = useStudentsActions();
  const isLoading = useAppSelector(state => state.students.loading.list.isLoading);
  const error = useAppSelector(state => state.students.loading.list.error);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {students.map(student => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}
```

### Pattern 2: Mutations

#### Before (React Query):
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '@/services/api';
import toast from 'react-hot-toast';

function CreateStudentForm() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: studentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student created');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: CreateStudentData) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={e => { e.preventDefault(); handleSubmit(formData); }}>
      {/* form fields */}
      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create Student'}
      </button>
    </form>
  );
}
```

#### After (Redux):
```typescript
import { useStudentsActions, useAppSelector } from '@/stores';
import toast from 'react-hot-toast';

function CreateStudentForm() {
  const { create } = useStudentsActions();
  const isCreating = useAppSelector(state => state.students.loading.create.isLoading);

  const handleSubmit = async (data: CreateStudentData) => {
    try {
      await create(data).unwrap();
      toast.success('Student created');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create student');
    }
  };

  return (
    <form onSubmit={e => { e.preventDefault(); handleSubmit(formData); }}>
      {/* form fields */}
      <button type="submit" disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create Student'}
      </button>
    </form>
  );
}
```

### Pattern 3: Detailed Entity

#### Before (React Query):
```typescript
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/services/api';

function StudentDetail({ studentId }: { studentId: string }) {
  const { data: student, isLoading, error } = useQuery({
    queryKey: ['students', studentId],
    queryFn: () => studentsApi.getById(studentId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error.message} />;
  if (!student) return <div>Student not found</div>;

  return (
    <div>
      <h1>{student.firstName} {student.lastName}</h1>
      <p>Grade: {student.grade}</p>
    </div>
  );
}
```

#### After (Redux):
```typescript
import { useStudentById, useStudentsActions, useAppSelector } from '@/stores';
import { useEffect } from 'react';

function StudentDetail({ studentId }: { studentId: string }) {
  const student = useStudentById(studentId);
  const { fetchById } = useStudentsActions();
  const isLoading = useAppSelector(state => state.students.loading.detail.isLoading);
  const error = useAppSelector(state => state.students.loading.detail.error);

  useEffect(() => {
    fetchById(studentId);
  }, [studentId, fetchById]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!student) return <div>Student not found</div>;

  return (
    <div>
      <h1>{student.firstName} {student.lastName}</h1>
      <p>Grade: {student.grade}</p>
    </div>
  );
}
```

### Pattern 4: With Filters

#### Before (React Query):
```typescript
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/services/api';
import { useState } from 'react';

function FilteredStudentsList() {
  const [filters, setFilters] = useState({ grade: '', active: true });

  const { data: students, isLoading } = useQuery({
    queryKey: ['students', filters],
    queryFn: () => studentsApi.getAll(filters),
  });

  return (
    <div>
      <select
        value={filters.grade}
        onChange={e => setFilters({ ...filters, grade: e.target.value })}
      >
        <option value="">All Grades</option>
        <option value="5">Grade 5</option>
        <option value="6">Grade 6</option>
      </select>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {students?.map(student => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}
```

#### After (Redux):
```typescript
import { useStudentsByGrade, useStudentsActions, useAppSelector } from '@/stores';
import { useState, useEffect } from 'react';

function FilteredStudentsList() {
  const [grade, setGrade] = useState('');
  const { fetchAll } = useStudentsActions();

  // Use specialized selector for filtered data
  const students = grade
    ? useStudentsByGrade(grade)
    : useAppSelector(state => Object.values(state.students.entities));

  const isLoading = useAppSelector(state => state.students.loading.list.isLoading);

  useEffect(() => {
    fetchAll({ grade, active: true });
  }, [grade, fetchAll]);

  return (
    <div>
      <select
        value={grade}
        onChange={e => setGrade(e.target.value)}
      >
        <option value="">All Grades</option>
        <option value="5">Grade 5</option>
        <option value="6">Grade 6</option>
      </select>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {students.map(student => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Pattern 5: Optimistic Updates

#### Before (React Query):
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '@/services/api';

function StudentQuickEdit({ student }: { student: Student }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Student>) =>
      studentsApi.update(student.id, data),

    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['students'] });

      // Snapshot previous value
      const previousStudents = queryClient.getQueryData(['students']);

      // Optimistically update
      queryClient.setQueryData(['students'], (old: Student[]) =>
        old.map(s => s.id === student.id ? { ...s, ...newData } : s)
      );

      return { previousStudents };
    },

    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(['students'], context?.previousStudents);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const handleToggleActive = () => {
    updateMutation.mutate({ isActive: !student.isActive });
  };

  return (
    <button onClick={handleToggleActive}>
      {student.isActive ? 'Deactivate' : 'Activate'}
    </button>
  );
}
```

#### After (Redux):
```typescript
import { useStudentsActions } from '@/stores';

function StudentQuickEdit({ student }: { student: Student }) {
  const { optimisticUpdate, update } = useStudentsActions();

  const handleToggleActive = async () => {
    const newStatus = !student.isActive;

    // Optimistic update (immediate UI feedback)
    optimisticUpdate(student.id, { isActive: newStatus });

    try {
      // Actual API call
      await update({ id: student.id, data: { isActive: newStatus } }).unwrap();
    } catch (error) {
      // Redux automatically reverts on error
      toast.error('Failed to update student');
    }
  };

  return (
    <button onClick={handleToggleActive}>
      {student.isActive ? 'Deactivate' : 'Activate'}
    </button>
  );
}
```

### Pattern 6: Dependent Queries

#### Before (React Query):
```typescript
import { useQuery } from '@tanstack/react-query';

function StudentWithRelations({ studentId }: { studentId: string }) {
  // First, fetch student
  const { data: student } = useQuery({
    queryKey: ['students', studentId],
    queryFn: () => studentsApi.getById(studentId),
  });

  // Then fetch related data (dependent on student)
  const { data: medications } = useQuery({
    queryKey: ['medications', student?.id],
    queryFn: () => medicationsApi.getByStudent(student!.id),
    enabled: !!student,
  });

  const { data: appointments } = useQuery({
    queryKey: ['appointments', student?.id],
    queryFn: () => appointmentsApi.getByStudent(student!.id),
    enabled: !!student,
  });

  return (
    <div>
      <h1>{student?.firstName}</h1>
      <MedicationsList medications={medications} />
      <AppointmentsList appointments={appointments} />
    </div>
  );
}
```

#### After (Redux):
```typescript
import {
  useStudentById,
  useMedicationsByStudent,
  useAppointmentsByStudent,
  useStudentsActions,
  useMedicationsActions,
  useAppointmentsActions
} from '@/stores';
import { useEffect } from 'react';

function StudentWithRelations({ studentId }: { studentId: string }) {
  const student = useStudentById(studentId);
  const medications = useMedicationsByStudent(studentId);
  const appointments = useAppointmentsByStudent(studentId);

  const { fetchById: fetchStudent } = useStudentsActions();
  const { fetchAll: fetchMedications } = useMedicationsActions();
  const { fetchAll: fetchAppointments } = useAppointmentsActions();

  useEffect(() => {
    // Fetch all related data in parallel
    Promise.all([
      fetchStudent(studentId),
      fetchMedications({ studentId }),
      fetchAppointments({ studentId }),
    ]);
  }, [studentId]);

  return (
    <div>
      <h1>{student?.firstName}</h1>
      <MedicationsList medications={medications} />
      <AppointmentsList appointments={appointments} />
    </div>
  );
}
```

## Step-by-Step Migration Process

### Step 1: Identify Components Using React Query

```bash
# Find all components using React Query
grep -r "useQuery\|useMutation" frontend/src/
```

### Step 2: Prioritize Migration

Migrate in this order:
1. **High-traffic pages** (Dashboard, Students, Medications)
2. **Create/Edit forms** (Better optimistic updates with Redux)
3. **List pages** (Better filtering/sorting with Redux)
4. **Detail pages** (Better caching with Redux)

### Step 3: Update One Component at a Time

For each component:

1. **Import Redux hooks** instead of React Query:
   ```typescript
   // Before
   import { useQuery, useMutation } from '@tanstack/react-query';

   // After
   import { useStudents, useStudentsActions, useAppSelector } from '@/stores';
   ```

2. **Replace data fetching**:
   ```typescript
   // Before
   const { data, isLoading, error } = useQuery({ ... });

   // After
   const data = useStudents();
   const { fetchAll } = useStudentsActions();
   const isLoading = useAppSelector(state => state.students.loading.list.isLoading);
   const error = useAppSelector(state => state.students.loading.list.error);

   useEffect(() => {
     fetchAll();
   }, [fetchAll]);
   ```

3. **Replace mutations**:
   ```typescript
   // Before
   const mutation = useMutation({ ... });
   mutation.mutate(data);

   // After
   const { create } = useStudentsActions();
   await create(data).unwrap();
   ```

4. **Test thoroughly**:
   - Verify data loads correctly
   - Test loading states
   - Test error handling
   - Test mutations
   - Verify UI updates properly

### Step 4: Remove React Query Dependencies (Optional)

Once all components are migrated:

```bash
npm uninstall @tanstack/react-query @tanstack/react-query-devtools
```

## Hybrid Approach

You can use both Redux and React Query simultaneously:

```typescript
// Use Redux for core app state
import { useStudents } from '@/stores';

// Use React Query for server-side operations
import { useQuery } from '@tanstack/react-query';

function Dashboard() {
  // Core data from Redux
  const students = useStudents();

  // Analytics from React Query (server-computed)
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => analyticsApi.getDashboard(),
  });

  return (
    <div>
      <StudentsOverview students={students} />
      <AnalyticsCharts data={analytics} />
    </div>
  );
}
```

## Benefits of Migration

✅ **Centralized State**
- Single source of truth
- Easier debugging with Redux DevTools
- Better state persistence

✅ **Better Performance**
- Normalized state structure
- Memoized selectors
- Fewer unnecessary fetches

✅ **Optimistic Updates**
- Built-in optimistic update support
- Automatic rollback on errors
- Better UX

✅ **Offline Support**
- State persistence
- Cross-tab synchronization
- Better resilience

✅ **Type Safety**
- Full TypeScript support
- Better autocomplete
- Fewer runtime errors

## Common Issues & Solutions

### Issue: Component Re-renders Too Much

**Problem:** Component re-renders on every state change

**Solution:** Use more specific selectors

```typescript
// ❌ BAD - Re-renders on any students state change
const studentsState = useAppSelector(state => state.students);

// ✅ GOOD - Only re-renders when count changes
const studentCount = useAppSelector(state => state.students.ids.length);
```

### Issue: Stale Data

**Problem:** Component shows old data

**Solution:** Dispatch fetch action in useEffect

```typescript
useEffect(() => {
  fetchAll({ active: true });
}, [fetchAll]);
```

### Issue: Missing Loading State

**Problem:** No loading indicator during fetch

**Solution:** Use specific loading selectors

```typescript
const isLoading = useAppSelector(state => state.students.loading.list.isLoading);

if (isLoading) return <LoadingSpinner />;
```

## Summary

✅ **Key Changes:**
- Replace `useQuery` → Redux hooks + `useEffect`
- Replace `useMutation` → Redux actions + `unwrap()`
- Replace `queryClient.invalidateQueries` → Automatic Redux updates
- Replace optimistic updates → `optimisticUpdate` actions

✅ **Benefits:**
- Better state management
- Improved performance
- Better offline support
- Easier testing

For more details, see:
- `BEST_PRACTICES.md` - Redux best practices
- `USAGE_EXAMPLES.md` - Code examples
- `QUICK_REFERENCE.md` - Quick reference
