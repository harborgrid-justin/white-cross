# State Management Architecture Guide

**Version**: 3.0.0
**Last Updated**: 2025-10-24
**Owner**: State Management Architect

## Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Redux Store](#redux-store)
4. [React Query](#react-query)
5. [Memoized Selectors](#memoized-selectors)
6. [Optimistic Updates](#optimistic-updates)
7. [Type Safety](#type-safety)
8. [Best Practices](#best-practices)
9. [Performance Optimization](#performance-optimization)
10. [PHI Compliance](#phi-compliance)

---

## Overview

The White Cross Healthcare Platform uses a hybrid state management approach combining:

- **Redux Toolkit** for client state (UI state, cached transformations)
- **React Query (TanStack Query)** for server state (API data, caching)
- **Reselect** for memoized selectors (performance optimization)
- **Domain-driven architecture** for code organization

This architecture provides:
- **Type safety** with full TypeScript coverage
- **Performance** through memoization and intelligent caching
- **Developer experience** with predictable patterns and excellent tooling
- **HIPAA compliance** with PHI data protection

---

## Architecture Principles

### 1. Single Source of Truth
- Server state managed by React Query
- Client state managed by Redux
- No data duplication between the two

### 2. Domain-Driven Design
- State organized by business domains (core, healthcare, administration)
- Colocated domain logic (selectors, actions, hooks)
- Clear boundaries between domains

### 3. Type Safety
- 100% TypeScript coverage
- Discriminated union types for async states
- Generic utilities for reusable patterns

### 4. Performance First
- Memoized selectors prevent unnecessary recalculations
- Granular subscriptions minimize re-renders
- Optimistic updates provide instant feedback

### 5. PHI Protection
- PHI data excluded from persistence
- Audit logging for sensitive operations
- Memory-only storage for health data

---

## Redux Store

### Store Structure

```typescript
RootState {
  // Core domains
  auth: AuthState
  users: UsersState
  settings: SettingsState
  dashboard: DashboardState

  // Healthcare domains
  students: StudentsState
  healthRecords: HealthRecordsState
  medications: MedicationsState
  appointments: AppointmentsState
  emergencyContacts: EmergencyContactsState

  // Administration
  districts: DistrictsState
  schools: SchoolsState
  inventory: InventoryState
  reports: ReportsState

  // Communication
  communication: CommunicationState
  documents: DocumentsState

  // Compliance
  incidentReports: IncidentReportsState
  compliance: ComplianceState
  accessControl: AccessControlState

  // Enterprise features
  enterprise: EnterpriseState
  orchestration: OrchestrationState
}
```

### Using Redux State

#### Basic Selection

```typescript
import { useAppSelector } from '@/stores';

function MyComponent() {
  const user = useAppSelector(state => state.auth.user);
  const isLoading = useAppSelector(state => state.students.isLoading);

  return <div>{user?.firstName}</div>;
}
```

#### Using Typed Hooks

```typescript
import { useSlice, useIsLoading, useErrors } from '@/stores/hooks/typedHooks';

function MyComponent() {
  // Select entire slice
  const authState = useSlice('auth');

  // Check loading across multiple slices
  const isLoading = useIsLoading(['students', 'medications']);

  // Get errors from multiple slices
  const errors = useErrors(['students', 'medications']);

  return (
    <div>
      {isLoading && <Spinner />}
      {errors.students && <Error message={errors.students} />}
    </div>
  );
}
```

#### Dispatching Actions

```typescript
import { useAppDispatch } from '@/stores';
import { loginUser, fetchStudents } from '@/stores';

function LoginForm() {
  const dispatch = useAppDispatch();

  const handleSubmit = async (credentials) => {
    await dispatch(loginUser(credentials)).unwrap();
    dispatch(fetchStudents());
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## React Query

### Cache Configuration

Different domains have different caching strategies:

```typescript
// Critical healthcare data - short stale time
healthRecords: {
  staleTime: 1 * 60 * 1000,    // 1 minute
  gcTime: 5 * 60 * 1000,       // 5 minutes
  refetchOnWindowFocus: true
}

// Reference data - long stale time
districts: {
  staleTime: 30 * 60 * 1000,   // 30 minutes
  gcTime: 60 * 60 * 1000,      // 1 hour
  refetchOnWindowFocus: false
}
```

### Using Query Hooks

```typescript
import { useMedicationsList, useStudentMedications } from '@/hooks/domains/medications';

function MedicationList() {
  const { data, isLoading, error } = useMedicationsList({
    status: 'active',
    dueToday: true
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {data.medications.map(med => (
        <MedicationCard key={med.id} medication={med} />
      ))}
    </div>
  );
}
```

### Query Keys

Use the centralized query key factory:

```typescript
import { queryKeys } from '@/config/queryClientEnhanced';

// Consistent query keys
queryKeys.students.all          // ['students']
queryKeys.students.list()       // ['students', 'list']
queryKeys.students.detail(id)   // ['students', 'detail', id]
queryKeys.medications.byStudent(studentId)  // ['medications', 'student', studentId]
```

### Cache Invalidation

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryClientEnhanced';

function UpdateStudentButton({ studentId }) {
  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    await updateStudent(studentId, data);

    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(studentId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.healthRecords.byStudent(studentId) });
  };

  return <button onClick={handleUpdate}>Update</button>;
}
```

---

## Memoized Selectors

### Using Existing Selectors

```typescript
import { useAppSelector } from '@/stores';
import {
  selectActiveStudents,
  selectMedicationsDueToday,
  selectHealthRecordsRequiringFollowUp
} from '@/stores/selectors';

function Dashboard() {
  const activeStudents = useAppSelector(selectActiveStudents);
  const dueMedications = useAppSelector(selectMedicationsDueToday);
  const followUpRecords = useAppSelector(selectHealthRecordsRequiringFollowUp);

  return (
    <div>
      <Stat label="Active Students" value={activeStudents.length} />
      <Stat label="Medications Due" value={dueMedications.length} />
      <Stat label="Follow-ups" value={followUpRecords.length} />
    </div>
  );
}
```

### Parameterized Selectors

```typescript
import { selectStudentsByGrade, selectMedicationsByStudent } from '@/stores/selectors';

function GradeView({ grade }: { grade: number }) {
  // Pass parameters to selector
  const students = useAppSelector(state =>
    selectStudentsByGrade(state, grade)
  );

  return <StudentList students={students} />;
}
```

### Complex Filtered Selectors

```typescript
import { selectStudentsFiltered, selectMedicationsFiltered } from '@/stores/selectors';

function FilteredStudentList() {
  const [filters, setFilters] = useState({
    grade: 5,
    hasAllergies: true,
    schoolId: 'school-123',
    searchQuery: 'john'
  });

  const filteredStudents = useAppSelector(state =>
    selectStudentsFiltered(state, filters)
  );

  return <StudentList students={filteredStudents} />;
}
```

### Creating Custom Selectors

```typescript
import { createSelector } from '@reduxjs/toolkit';
import { selectAllStudents } from '@/stores/selectors';

// Simple derived selector
export const selectStudentsWithIEP = createSelector(
  [selectAllStudents],
  (students) => students.filter(s => s.hasIEP)
);

// Parameterized selector
export const selectStudentsByNurse = createSelector(
  [selectAllStudents, (_state, nurseId: string) => nurseId],
  (students, nurseId) => students.filter(s => s.assignedNurseId === nurseId)
);
```

---

## Optimistic Updates

### Medication Administration

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMedicationAdministrationOptimistic } from '@/hooks/utils/optimisticUpdates';

function AdministerMedicationButton({ medication, studentId }) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (data) => administerMedication(medication.id, data),

    // Optimistically update UI before server responds
    onMutate: async (data) => {
      return createMedicationAdministrationOptimistic(
        queryClient,
        medication.id,
        studentId,
        {
          administeredAt: new Date(),
          administeredBy: currentUser.id,
          ...data
        }
      );
    },

    // Rollback on error
    onError: (error, variables, context) => {
      if (context?.rollback) {
        context.rollback();
      }
      toast.error('Failed to administer medication');
    },

    // Refetch after success to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', medication.id] });
      queryClient.invalidateQueries({ queryKey: ['medications', 'student', studentId] });
    }
  });

  return <button onClick={() => mutate({ notes: 'Administered as scheduled' })}>
    Administer
  </button>;
}
```

### Creating New Records

```typescript
import { createHealthRecordOptimistic } from '@/hooks/utils/optimisticUpdates';

const { mutate } = useMutation({
  mutationFn: createHealthRecord,

  onMutate: async (newRecord) => {
    return createHealthRecordOptimistic(
      queryClient,
      studentId,
      {
        ...newRecord,
        id: `temp-${Date.now()}`, // Temporary ID
        createdAt: new Date().toISOString()
      }
    );
  },

  onError: (error, variables, context) => {
    context?.rollback();
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['health-records'] });
  }
});
```

---

## Type Safety

### Discriminated Union Types

```typescript
import { AsyncState, isSuccessState, isLoadingState } from '@/stores/utils/asyncState';

interface MyComponentState {
  data: AsyncState<Student[]>;
}

function MyComponent({ data }: MyComponentState) {
  // Type guard enables proper type inference
  if (isLoadingState(data)) {
    return <Spinner />;
  }

  if (isSuccessState(data)) {
    // data.data is typed as Student[]
    return <StudentList students={data.data} />;
  }

  // Handle other states...
}
```

### Typed Selectors

```typescript
import { RootState } from '@/stores';
import { createSelector } from '@reduxjs/toolkit';

// Full type inference
const selectUserName = (state: RootState): string | null => {
  return state.auth.user?.firstName || null;
};

// Generic selector with type parameter
const selectEntityById = <T extends { id: string }>(
  entities: Record<string, T>,
  id: string
): T | undefined => {
  return entities[id];
};
```

---

## Best Practices

### 1. Selector Memoization

**✅ DO**: Use memoized selectors for expensive computations

```typescript
const selectExpensiveComputation = createSelector(
  [selectAllStudents],
  (students) => {
    // Expensive calculation cached
    return students.map(s => ({
      ...s,
      fullName: `${s.firstName} ${s.lastName}`,
      age: calculateAge(s.dateOfBirth)
    }));
  }
);
```

**❌ DON'T**: Compute derived state in component

```typescript
// This recalculates on every render!
function MyComponent() {
  const students = useAppSelector(state => state.students.entities);
  const processed = Object.values(students).map(s => ({
    ...s,
    fullName: `${s.firstName} ${s.lastName}`
  }));
}
```

### 2. Granular Subscriptions

**✅ DO**: Select only what you need

```typescript
const userName = useAppSelector(state => state.auth.user?.firstName);
```

**❌ DON'T**: Select entire objects when you need one field

```typescript
const user = useAppSelector(state => state.auth.user);
return <div>{user?.firstName}</div>; // Re-renders on any user change
```

### 3. Query Key Consistency

**✅ DO**: Use query key factory

```typescript
import { queryKeys } from '@/config/queryClientEnhanced';

const { data } = useQuery({
  queryKey: queryKeys.students.detail(studentId),
  queryFn: () => fetchStudent(studentId)
});
```

**❌ DON'T**: Hardcode query keys

```typescript
const { data } = useQuery({
  queryKey: ['students', studentId], // Inconsistent, error-prone
  queryFn: () => fetchStudent(studentId)
});
```

### 4. Optimistic Updates for UX

**✅ DO**: Use optimistic updates for immediate feedback

```typescript
onMutate: async (data) => {
  return createOptimisticUpdate(queryClient, queryKey, updater);
}
```

**❌ DON'T**: Make users wait for every operation

```typescript
// User waits for server round-trip
const { mutate, isLoading } = useMutation({
  mutationFn: updateStudent
});

{isLoading && <Spinner />} // Bad UX
```

### 5. Error Handling

**✅ DO**: Handle errors gracefully with rollback

```typescript
onError: (error, variables, context) => {
  context?.rollback();
  toast.error('Operation failed. Changes reverted.');
}
```

**❌ DON'T**: Leave UI in inconsistent state

```typescript
onError: (error) => {
  console.error(error); // UI still shows optimistic update!
}
```

---

## Performance Optimization

### Selector Performance

```typescript
// ✅ Memoized selector - cached result
const selectFilteredStudents = createSelector(
  [selectAllStudents, selectFilters],
  (students, filters) => {
    // Only recalculates when students or filters change
    return students.filter(s => matchesFilters(s, filters));
  }
);

// ❌ Inline filtering - recalculates every render
const filtered = students.filter(s => matchesFilters(s, filters));
```

### Query Caching

```typescript
// ✅ Appropriate stale time reduces refetches
const { data } = useQuery({
  queryKey: ['districts'],
  queryFn: fetchDistricts,
  staleTime: 30 * 60 * 1000, // 30 minutes - districts rarely change
});

// ❌ Too aggressive refetching
const { data } = useQuery({
  queryKey: ['districts'],
  queryFn: fetchDistricts,
  staleTime: 0, // Refetches constantly!
  refetchOnWindowFocus: true,
  refetchInterval: 1000, // Every second!
});
```

### Prefetching

```typescript
import { prefetchStrategies } from '@/config/queryClientEnhanced';

// Prefetch related data before navigation
function StudentListItem({ student }) {
  const queryClient = useQueryClient();

  const handleClick = () => {
    // Prefetch student details before navigation
    prefetchStrategies.studentDetail(queryClient, student.id);
    navigate(`/students/${student.id}`);
  };

  return <div onClick={handleClick}>{student.name}</div>;
}
```

---

## PHI Compliance

### PHI Data Handling

```typescript
// ✅ Mark queries containing PHI
const { data } = useQuery({
  queryKey: ['health-records', studentId],
  queryFn: () => fetchHealthRecords(studentId),
  meta: {
    containsPHI: true, // Excluded from persistence
    auditLog: true     // Log access for compliance
  }
});

// ✅ Exclude PHI from Redux persistence
const stateSyncConfig: StateSyncConfig = {
  slices: [{
    sliceName: 'healthRecords',
    excludePaths: [
      'records', // Don't persist PHI
      'selectedRecord'
    ]
  }]
};
```

### Cache Clearing on Logout

```typescript
import { clearPHICache } from '@/config/queryClient';
import { clearPersistedState } from '@/stores';

function logout() {
  // Clear PHI from React Query cache
  clearPHICache();

  // Clear persisted Redux state
  clearPersistedState();

  // Dispatch logout action
  dispatch(logoutUser());
}
```

---

## Migration Guide

### From Old Patterns to New Patterns

#### Before: Inline Computation

```typescript
function MyComponent() {
  const students = useAppSelector(state => state.students.entities);
  const activeStudents = Object.values(students).filter(s => s.isActive);

  return <div>{activeStudents.length}</div>;
}
```

#### After: Memoized Selector

```typescript
import { selectActiveStudents } from '@/stores/selectors';

function MyComponent() {
  const activeStudents = useAppSelector(selectActiveStudents);

  return <div>{activeStudents.length}</div>;
}
```

---

## Troubleshooting

### Selector Not Updating

**Problem**: Selector returns stale data

**Solution**: Check memoization dependencies

```typescript
// ❌ Dependencies incomplete
const selectFiltered = createSelector(
  [selectStudents], // Missing filter dependency!
  (students) => students.filter(s => s.grade === grade)
);

// ✅ All dependencies included
const selectFiltered = createSelector(
  [selectStudents, (_state, grade: number) => grade],
  (students, grade) => students.filter(s => s.grade === grade)
);
```

### Excessive Re-renders

**Problem**: Component re-renders too often

**Solution**: Use shallow equality or memoized selectors

```typescript
// ❌ Creates new object every time
const data = useAppSelector(state => ({
  user: state.auth.user,
  settings: state.settings
}));

// ✅ Use shallow equality
import { useShallowSelector } from '@/stores/hooks/typedHooks';

const data = useShallowSelector(state => ({
  user: state.auth.user,
  settings: state.settings
}));
```

---

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Reselect Documentation](https://github.com/reduxjs/reselect)
- [HIPAA Compliance Guide](./HIPAA_COMPLIANCE.md)

---

**Maintained by**: State Management Architect
**Last Review**: 2025-10-24
**Next Review**: 2025-11-24
