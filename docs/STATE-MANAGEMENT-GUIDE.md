# State Management Guide - White Cross Next.js

## Quick Reference

### When to Use Redux vs React Query

| Use Case | Technology | Reason |
|----------|-----------|--------|
| API data fetching | **React Query** | Built-in caching, refetching, optimistic updates |
| Student records (PHI) | **React Query** | No persistence, automatic cache management |
| Health records (PHI) | **React Query** | HIPAA-compliant caching |
| Medications (PHI) | **React Query** | Short-lived cache, memory only |
| UI state (filters) | **Redux** | Persist to localStorage |
| View modes | **Redux** | Persist across sessions |
| Form state (pre-submit) | **React Hook Form** or **Redux** | Component-local or global |
| Auth tokens | **Redux** | sessionStorage only |
| User preferences | **Redux** | localStorage persistence |

---

## Quick Start

### 1. Redux Setup

```typescript
'use client';

import { useAppSelector, useAppDispatch } from '@/stores/hooks';
import { loginUser } from '@/stores/slices/authSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### 2. React Query Setup

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryClient';

function StudentList() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.students.list(),
    queryFn: () => fetch('/api/students').then(r => r.json()),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {data?.map(student => (
        <li key={student.id}>{student.name}</li>
      ))}
    </ul>
  );
}
```

### 3. Using Domain Hooks

```typescript
'use client';

import { useStudents } from '@/hooks/domains/students';
import { useMedicationsData } from '@/hooks/domains/medications';

function StudentDashboard({ studentId }) {
  const { student, updateStudent } = useStudents(studentId);
  const { medications } = useMedicationsData(studentId);

  return (
    <div>
      <h1>{student?.name}</h1>
      <div>Medications: {medications?.length}</div>
    </div>
  );
}
```

---

## Available Hooks

### Redux Hooks

```typescript
import { useAppDispatch, useAppSelector } from '@/stores/hooks';

// Dispatch actions
const dispatch = useAppDispatch();

// Select state
const user = useAppSelector(state => state.auth.user);
const students = useAppSelector(state => state.students.list);
```

### React Query Hooks

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query data
const { data, isLoading, error } = useQuery({...});

// Mutate data
const mutation = useMutation({...});

// Access query client
const queryClient = useQueryClient();
```

### Domain Hooks (20 Domains)

| Domain | Import Path | Purpose |
|--------|-------------|---------|
| Students | `@/hooks/domains/students` | Student management |
| Medications | `@/hooks/domains/medications` | Medication administration |
| Appointments | `@/hooks/domains/appointments` | Scheduling |
| Health Records | `@/hooks/domains/health` | Medical history |
| Incidents | `@/hooks/domains/incidents` | Incident reporting |
| Emergency | `@/hooks/domains/emergency` | Emergency contacts |
| Inventory | `@/hooks/domains/inventory` | Supply management |
| Budgets | `@/hooks/domains/budgets` | Budget tracking |
| Communication | `@/hooks/domains/communication` | Messaging |
| Compliance | `@/hooks/domains/compliance` | HIPAA compliance |
| Dashboard | `@/hooks/domains/dashboard` | Statistics |
| Documents | `@/hooks/domains/documents` | File management |
| Reports | `@/hooks/domains/reports` | Analytics |
| Purchase Orders | `@/hooks/domains/purchase-orders` | PO management |
| Vendors | `@/hooks/domains/vendors` | Vendor management |
| Administration | `@/hooks/domains/administration` | Admin operations |
| Access Control | `@/hooks/domains/access-control` | RBAC |

### Utility Hooks

```typescript
import {
  useApiError,
  useCacheManager,
  useAuditLog,
  useHealthcareCompliance,
  usePrefetch,
} from '@/hooks/shared';

// Error handling
const { handleError, formatError } = useApiError();

// Cache management
const { invalidateCache, clearCache } = useCacheManager();

// Audit logging
const { logAccess, logAction } = useAuditLog();

// HIPAA compliance
const { checkCompliance, sanitizePHI } = useHealthcareCompliance();

// Prefetching
const { prefetchStudents, prefetchMedications } = usePrefetch();
```

---

## Common Patterns

### 1. Fetching and Displaying Data

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryClient';
import { studentsApi } from '@/services/api/students';

function StudentList() {
  const { data: students, isLoading, error } = useQuery({
    queryKey: queryKeys.students.list(),
    queryFn: studentsApi.getAll,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {students?.map(student => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}
```

### 2. Creating/Updating Data

```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryClient';
import { studentsApi } from '@/services/api/students';
import toast from 'react-hot-toast';

function CreateStudent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: studentsApi.create,
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
      toast.success('Student created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create student: ${error.message}`);
    },
  });

  const handleSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Student'}
      </button>
    </form>
  );
}
```

### 3. Optimistic Updates

```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryClient';

function UpdateStudent({ studentId }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateStudentApi,
    onMutate: async (newData) => {
      // Cancel refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.students.detail(studentId)
      });

      // Snapshot previous value
      const previous = queryClient.getQueryData(
        queryKeys.students.detail(studentId)
      );

      // Optimistically update
      queryClient.setQueryData(
        queryKeys.students.detail(studentId),
        (old) => ({ ...old, ...newData })
      );

      return { previous };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.students.detail(studentId),
        context.previous
      );
      toast.error('Update failed, changes reverted');
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({
        queryKey: queryKeys.students.detail(studentId)
      });
    },
  });

  return mutation;
}
```

### 4. Dependent Queries

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryClient';

function StudentMedications({ studentId }) {
  // Fetch student first
  const { data: student } = useQuery({
    queryKey: queryKeys.students.detail(studentId),
    queryFn: () => studentsApi.getById(studentId),
  });

  // Fetch medications only if student exists
  const { data: medications } = useQuery({
    queryKey: queryKeys.medications.byStudent(studentId),
    queryFn: () => medicationsApi.getByStudent(studentId),
    enabled: !!student, // Only run if student exists
  });

  return (
    <div>
      <h1>{student?.name}</h1>
      <h2>Medications</h2>
      <ul>
        {medications?.map(med => (
          <li key={med.id}>{med.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 5. Infinite Queries (Pagination)

```typescript
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryClient';

function InfiniteStudentList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.students.lists(),
    queryFn: ({ pageParam = 1 }) =>
      studentsApi.getAll({ page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.data.map(student => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
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

### 6. Prefetching Data

```typescript
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryClient';

function StudentListItem({ student }) {
  const queryClient = useQueryClient();

  // Prefetch student details on hover
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.students.detail(student.id),
      queryFn: () => studentsApi.getById(student.id),
    });
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <Link href={`/students/${student.id}`}>
        {student.name}
      </Link>
    </div>
  );
}
```

---

## Query Key Conventions

Use the provided query key factories for consistency:

```typescript
import { queryKeys } from '@/config/queryClient';

// Students
queryKeys.students.all           // ['students']
queryKeys.students.lists()       // ['students', 'list']
queryKeys.students.list(filters) // ['students', 'list', filters]
queryKeys.students.detail(id)    // ['students', 'detail', id]

// Medications
queryKeys.medications.all
queryKeys.medications.list(filters)
queryKeys.medications.byStudent(studentId)
queryKeys.medications.detail(id)

// Health Records
queryKeys.healthRecords.all
queryKeys.healthRecords.byStudent(studentId)
queryKeys.healthRecords.detail(id)

// And so on for all domains...
```

---

## Cache Invalidation Strategies

### After Mutations

```typescript
// Invalidate specific query
queryClient.invalidateQueries({
  queryKey: queryKeys.students.detail(studentId)
});

// Invalidate all student queries
queryClient.invalidateQueries({
  queryKey: queryKeys.students.all
});

// Invalidate multiple domains
await Promise.all([
  queryClient.invalidateQueries({ queryKey: queryKeys.students.all }),
  queryClient.invalidateQueries({ queryKey: queryKeys.healthRecords.all }),
]);
```

### On Logout (HIPAA Compliance)

```typescript
import { clearPHICache, clearAllCache } from '@/config/queryClient';
import { clearPersistedState } from '@/stores/store';

function logout() {
  // Clear React Query cache
  clearPHICache(); // or clearAllCache();

  // Clear Redux persisted state
  clearPersistedState();

  // Redirect to login
  router.push('/login');
}
```

---

## Error Handling

### Global Error Handling

Configured in `queryClient.ts`:
- Automatic toast notifications on error
- Audit logging for PHI-related errors
- Retry logic with exponential backoff

### Component-Level Error Handling

```typescript
function MyComponent() {
  const { data, error, isError } = useQuery({...});

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  return <div>{/* Success UI */}</div>;
}
```

### Custom Error Messages

```typescript
const { data, error } = useQuery({
  queryKey: ['students'],
  queryFn: fetchStudents,
  meta: {
    errorMessage: 'Failed to load students. Please refresh the page.',
  },
});
```

---

## HIPAA Compliance Checklist

### ✅ Data Persistence
- [x] PHI never persisted to localStorage
- [x] Auth tokens in sessionStorage only
- [x] UI preferences only in localStorage

### ✅ Cache Management
- [x] PHI cache: 3-5 minutes (memory only)
- [x] Automatic cache clearing on logout
- [x] No PHI in query keys

### ✅ Audit Logging
- [x] All PHI access logged (development)
- [x] All PHI mutations logged
- [x] Audit trail maintained

### ✅ Security
- [x] No tokens in Redux persistence
- [x] Sensitive actions logged
- [x] Data sanitization on logout

---

## Performance Tips

1. **Use Query Keys Wisely** - Granular keys for targeted invalidation
2. **Prefetch on Navigation** - Improve perceived performance
3. **Optimize Re-renders** - Use selectors, memoization
4. **Lazy Load Domains** - Code-split domain hooks
5. **Cache Appropriately** - Longer cache for static data, shorter for PHI
6. **Batch Updates** - Group multiple state updates

---

## Debugging

### Redux DevTools

Available in development at http://localhost:3000:
- View all dispatched actions
- Inspect state changes
- Time-travel debugging

### React Query DevTools

Available in development at bottom-right of screen:
- View all queries
- Inspect cache
- See refetch status
- Manually trigger refetches

### Logging

```typescript
// Redux state
console.log(store.getState());

// React Query cache
import { getCacheStats } from '@/config/queryClient';
console.log(getCacheStats());

// Storage stats
import { getStorageStats } from '@/stores/store';
console.log(getStorageStats());
```

---

## Support

- See `REDUX-MIGRATION-COMPLETE.md` for full migration details
- See `CLAUDE.md` for project guidelines
- See `README.md` for setup instructions

---

## Quick Links

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Next.js 15 Docs](https://nextjs.org/docs)
