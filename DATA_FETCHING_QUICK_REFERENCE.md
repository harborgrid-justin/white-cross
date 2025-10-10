# Data Fetching Quick Reference Guide

## TL;DR - Common Patterns

### Basic Query Hook

```typescript
// Pattern: Read data from API
const { data, isLoading, error } = useStudents({
  grade: '5',
  isActive: true
});

// Always handle all states
if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;
if (!data) return <EmptyState />;

return <StudentList students={data.students} />;
```

### Create Mutation Hook

```typescript
// Pattern: Create new record
const createStudent = useCreateStudent();

const handleSubmit = async (formData) => {
  try {
    await createStudent.mutateAsync(formData);
    toast.success('Student created');
    navigate('/students');
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Update Mutation Hook

```typescript
// Pattern: Update existing record
const updateStudent = useUpdateStudent();

const handleUpdate = async (id, changes) => {
  await updateStudent.mutateAsync({ id, data: changes });
};
```

### Delete Mutation Hook

```typescript
// Pattern: Delete record
const deleteStudent = useDeleteStudent();

const handleDelete = async (id) => {
  if (confirm('Are you sure?')) {
    await deleteStudent.mutateAsync(id);
  }
};
```

---

## Module Quick Links

| Module | List Hook | Detail Hook | Create Hook | Update Hook | Delete Hook |
|--------|-----------|-------------|-------------|-------------|-------------|
| **Students** | `useStudents()` | `useStudentDetail(id)` | `useCreateStudent()` | `useUpdateStudent()` | `useDeleteStudent()` |
| **Medications** | `useMedicationFormulary()` | `useMedicationDetail(id)` | `useCreateMedication()` | `useUpdateMedication()` | `useDeactivateMedication()` |
| **Appointments** | `useAppointments()` | `useAppointmentDetail(id)` | `useCreateAppointment()` | `useUpdateAppointment()` | `useCancelAppointment()` |
| **Health Records** | `useHealthRecords(studentId)` | `useHealthRecordDetail(id)` | `useCreateHealthRecord()` | `useUpdateHealthRecord()` | `useDeleteHealthRecord()` |
| **Emergency Contacts** | `useEmergencyContacts(studentId)` | `useEmergencyContactDetail(id)` | `useCreateEmergencyContact()` | `useUpdateEmergencyContact()` | `useDeleteEmergencyContact()` |
| **Incident Reports** | `useIncidentReports()` | `useIncidentReportDetail(id)` | `useCreateIncidentReport()` | `useUpdateIncidentReport()` | N/A |
| **Inventory** | `useInventory()` | `useInventoryItem(id)` | `useAddToInventory()` | `useUpdateInventoryQuantity()` | `useRemoveFromInventory()` |
| **Documents** | `useDocuments(studentId)` | `useDocumentDetail(id)` | `useUploadDocument()` | `useUpdateDocument()` | `useDeleteDocument()` |

---

## Cache Time Reference

| Data Type | staleTime | gcTime | Example |
|-----------|-----------|--------|---------|
| Static | 24 hours | 7 days | Drug formulary, medication categories |
| Semi-static | 10 minutes | 30 minutes | Student roster, emergency contacts |
| Dynamic | 2-5 minutes | 10 minutes | Appointment schedules, medication logs |
| Real-time | 0-30 seconds | 2 minutes | Medication reminders, nurse availability |
| Safety-critical | 0 (no cache) | 0 | Medication administration, Five Rights |

---

## Error Handling Patterns

### Basic Error Display

```typescript
const { data, error } = useStudents();

if (error) {
  return (
    <Alert variant="error">
      <AlertTitle>Failed to load students</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
```

### Error with Retry

```typescript
const { data, error, refetch } = useStudents();

if (error) {
  return (
    <ErrorState
      message="Failed to load students"
      onRetry={() => refetch()}
    />
  );
}
```

### Mutation Error Handling

```typescript
const createStudent = useCreateStudent();

const handleSubmit = async (data) => {
  try {
    await createStudent.mutateAsync(data);
    toast.success('Student created');
  } catch (error) {
    if (error.code === 'DUPLICATE_STUDENT_NUMBER') {
      setError('studentNumber', {
        message: 'Student number already exists'
      });
    } else {
      toast.error('Failed to create student');
    }
  }
};
```

---

## Query Key Patterns

### Standard Pattern

```typescript
// [module, operation, ...identifiers, ...filters]
['students', 'list', { grade: '5', isActive: true }]
['students', 'detail', studentId]
['students', 'search', searchQuery]
```

### Query Key Factory

```typescript
export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters?: StudentFilters) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
  search: (query: string) => [...studentKeys.all, 'search', query] as const,
};

// Usage
queryKey: studentKeys.list({ grade: '5' })
queryKey: studentKeys.detail(studentId)
queryKey: studentKeys.search(query)
```

---

## Optimistic Updates

### Safe for Non-Critical Data

```typescript
const updateStudent = useUpdateStudent();

// ✅ Safe - just updating a photo
await updateStudent.mutateAsync(
  { id, data: { photo: newPhotoUrl } },
  {
    onMutate: async ({ id, data }) => {
      // Optimistically update cache
      queryClient.setQueryData(studentKeys.detail(id), old => ({
        ...old,
        ...data
      }));
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(studentKeys.detail(id), context.previousData);
    }
  }
);
```

### NEVER for Healthcare-Critical Data

```typescript
// ❌ DANGEROUS - Never optimistic updates for medication administration
const recordAdmin = useRecordMedicationAdministration();

// NO optimistic updates - always wait for server confirmation
await recordAdmin.mutateAsync(data);
```

---

## Prefetching Patterns

### Prefetch on Hover

```typescript
function StudentRow({ student }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: studentKeys.detail(student.id),
      queryFn: () => studentsApi.getById(student.id),
    });
  };

  return <tr onMouseEnter={handleMouseEnter}>...</tr>;
}
```

### Prefetch Related Data

```typescript
const { data: student } = useStudentDetail(id);

useEffect(() => {
  if (student) {
    // Prefetch health records when viewing student
    queryClient.prefetchQuery({
      queryKey: healthRecordKeys.list(student.id),
      queryFn: () => healthRecordsApi.getAll(student.id),
    });
  }
}, [student]);
```

---

## Pagination Patterns

### Basic Pagination

```typescript
const [page, setPage] = useState(1);
const { data, isLoading } = useStudents({ page, limit: 10 });

return (
  <>
    <StudentList students={data?.students} />
    <Pagination
      currentPage={page}
      totalPages={data?.pagination.pages}
      onPageChange={setPage}
    />
  </>
);
```

### Infinite Scroll

```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: studentKeys.lists(),
  queryFn: ({ pageParam = 1 }) => studentsApi.getAll({ page: pageParam }),
  getNextPageParam: (lastPage) => {
    return lastPage.pagination.page < lastPage.pagination.pages
      ? lastPage.pagination.page + 1
      : undefined;
  },
});

// Flatten pages
const students = data?.pages.flatMap(page => page.students) ?? [];

// Load more on scroll
const handleScroll = () => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
};
```

---

## Search/Filter Patterns

### Debounced Search

```typescript
const [searchQuery, setSearchQuery] = useState('');
const debouncedQuery = useDebounce(searchQuery, 300);

const { data: results } = useStudentSearch(debouncedQuery);

return (
  <Input
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search students..."
  />
);
```

### Multiple Filters

```typescript
const [filters, setFilters] = useState<StudentFilters>({
  grade: undefined,
  isActive: true,
});

const { data } = useStudents(filters);

return (
  <>
    <Select
      value={filters.grade}
      onChange={(grade) => setFilters(f => ({ ...f, grade }))}
    >
      <option value="">All Grades</option>
      <option value="5">Grade 5</option>
      <option value="6">Grade 6</option>
    </Select>

    <Checkbox
      checked={filters.isActive}
      onChange={(e) => setFilters(f => ({ ...f, isActive: e.target.checked }))}
    >
      Active Only
    </Checkbox>
  </>
);
```

---

## Form Integration Patterns

### React Hook Form + Mutation

```typescript
const { register, handleSubmit, formState: { errors } } = useForm<StudentFormData>();
const createStudent = useCreateStudent();

const onSubmit = async (data: StudentFormData) => {
  try {
    await createStudent.mutateAsync(data);
    toast.success('Student created');
    reset();
  } catch (error) {
    toast.error(error.message);
  }
};

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <Input {...register('firstName', { required: true })} />
    {errors.firstName && <span>First name is required</span>}

    <Button type="submit" disabled={createStudent.isPending}>
      {createStudent.isPending ? 'Creating...' : 'Create Student'}
    </Button>
  </form>
);
```

---

## Dependent Queries

### Sequential Loading

```typescript
// Load student first, then load their health records
const { data: student } = useStudentDetail(studentId);

const { data: healthRecords } = useHealthRecords(student?.id, {
  enabled: !!student, // Only fetch when student is loaded
});
```

### Parallel Loading

```typescript
// Load multiple resources in parallel
const student = useStudentDetail(studentId);
const healthRecords = useHealthRecords(studentId);
const appointments = useAppointments({ studentId });

if (student.isLoading || healthRecords.isLoading || appointments.isLoading) {
  return <Spinner />;
}

// All data loaded, render component
```

---

## Invalidation Patterns

### Single Query Invalidation

```typescript
const queryClient = useQueryClient();

// Invalidate specific student detail
queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
```

### Related Queries Invalidation

```typescript
// After creating student, invalidate lists
queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
```

### Hierarchical Invalidation

```typescript
// After updating student, invalidate:
// - Student detail
// - Student lists
// - Related health records
// - Related appointments

queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
queryClient.invalidateQueries({ queryKey: healthRecordKeys.list(id) });
queryClient.invalidateQueries({ queryKey: appointmentKeys.byStudent(id) });
```

---

## Background Updates

### Auto-Refetch Interval

```typescript
// Refresh data every 5 minutes
const { data } = useAppointments({
  refetchInterval: 5 * 60 * 1000, // 5 minutes
});
```

### Refetch on Window Focus

```typescript
// Refresh when user returns to tab
const { data } = useStudents({
  refetchOnWindowFocus: true,
});
```

### Manual Refetch

```typescript
const { data, refetch } = useStudents();

const handleRefresh = () => {
  refetch();
};

return <Button onClick={handleRefresh}>Refresh</Button>;
```

---

## Loading States

### Global Loading

```typescript
const { isLoading } = useStudents();

if (isLoading) {
  return <PageSpinner />;
}
```

### Skeleton Loading

```typescript
const { data, isLoading } = useStudents();

if (isLoading) {
  return <StudentListSkeleton />;
}

return <StudentList students={data.students} />;
```

### Mutation Loading

```typescript
const createStudent = useCreateStudent();

return (
  <Button
    onClick={handleCreate}
    disabled={createStudent.isPending}
  >
    {createStudent.isPending ? (
      <>
        <Spinner className="mr-2" />
        Creating...
      </>
    ) : (
      'Create Student'
    )}
  </Button>
);
```

---

## Real-Time Updates

### Polling

```typescript
// Poll for new medication reminders every minute
const { data } = useMedicationReminders({
  refetchInterval: 60 * 1000, // 1 minute
  staleTime: 0, // Always consider stale
});
```

### WebSocket Integration

```typescript
const { data } = useAppointments();

useEffect(() => {
  const socket = io();

  socket.on('appointment:created', (newAppointment) => {
    // Update cache with new appointment
    queryClient.setQueryData(
      appointmentKeys.detail(newAppointment.id),
      newAppointment
    );

    // Invalidate lists
    queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
  });

  return () => socket.disconnect();
}, []);
```

---

## Audit Logging

### Automatic PHI Access Logging

```typescript
export function useHealthRecords(studentId: string) {
  return useQuery({
    queryKey: healthRecordKeys.list(studentId),
    queryFn: async () => {
      const records = await healthRecordsApi.getAll(studentId);

      // Audit log PHI access
      await auditApi.logAccess({
        resource: 'health_records',
        resourceId: studentId,
        action: 'view',
        timestamp: new Date().toISOString(),
      });

      return records;
    },
  });
}
```

---

## RBAC Integration

### Permission-Based Queries

```typescript
export function useSecureHealthRecords(studentId: string) {
  const { data: permissions } = useUserPermissions();
  const hasPermission = permissions?.includes('health_records:read');

  return useQuery({
    queryKey: healthRecordKeys.list(studentId),
    queryFn: () => healthRecordsApi.getAll(studentId),
    enabled: hasPermission && !!studentId,
    onError: () => {
      if (!hasPermission) {
        toast.error('You do not have permission to view health records');
      }
    },
  });
}
```

---

## Testing Patterns

### Mock Hook Return Value

```typescript
import { vi } from 'vitest';
import * as hooks from '../hooks/useStudents';

vi.spyOn(hooks, 'useStudents').mockReturnValue({
  data: {
    students: [
      { id: '1', firstName: 'John', lastName: 'Doe' }
    ],
    pagination: { page: 1, limit: 10, total: 1, pages: 1 }
  },
  isLoading: false,
  error: null,
});
```

### Test with React Query Provider

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test('should fetch students', async () => {
  const { result } = renderHook(() => useStudents(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.data?.students).toBeDefined();
});
```

---

## Common Mistakes to Avoid

### ❌ Direct API Calls in Components

```typescript
// BAD
const [students, setStudents] = useState([]);
useEffect(() => {
  studentsApi.getAll().then(setStudents);
}, []);
```

```typescript
// GOOD
const { data: students } = useStudents();
```

### ❌ Missing Error Handling

```typescript
// BAD
const { data } = useStudents();
return <StudentList students={data.students} />; // Can crash!
```

```typescript
// GOOD
const { data, error, isLoading } = useStudents();
if (isLoading) return <Spinner />;
if (error) return <Error error={error} />;
return <StudentList students={data.students} />;
```

### ❌ Optimistic Updates for Critical Data

```typescript
// BAD - DANGEROUS!
const recordAdmin = useMedicationAdministration({
  optimistic: true, // Can cause medication errors!
});
```

```typescript
// GOOD
const recordAdmin = useMedicationAdministration({
  // No optimistic updates - wait for server confirmation
});
```

### ❌ Not Using Query Keys Properly

```typescript
// BAD - Hard to invalidate
queryKey: ['students']
queryKey: ['students', id] // Inconsistent structure
```

```typescript
// GOOD - Use query key factory
queryKey: studentKeys.list(filters)
queryKey: studentKeys.direct(id)
```

---

## Performance Tips

1. **Use `select` to transform data**: Reduce re-renders by selecting only needed data
2. **Enable `keepPreviousData`**: Smooth pagination experience
3. **Prefetch predictable navigation**: Improve perceived performance
4. **Use proper cache times**: Avoid unnecessary API calls
5. **Implement proper pagination**: Don't load all data at once
6. **Use React.memo**: Prevent unnecessary component re-renders
7. **Debounce search inputs**: Reduce API calls during typing
8. **Use optimistic updates carefully**: Only for non-critical data

---

## Useful Commands

```bash
# View TanStack Query DevTools
# Automatically available in development mode
# Press ESC to open/close

# Clear all cache programmatically
queryClient.clear();

# Invalidate all queries
queryClient.invalidateQueries();

# Remove specific query
queryClient.removeQueries({ queryKey: studentKeys.detail(id) });

# Get query data
const student = queryClient.getQueryData(studentKeys.detail(id));

# Set query data
queryClient.setQueryData(studentKeys.detail(id), newStudent);
```

---

## Resources

- [Full Strategy Document](./DATA_FETCHING_STRATEGY.md)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [Existing Medication Module](./frontend/src/services/modules/medication/) - Reference implementation

---

**Quick Reference Version**: 1.0
**Last Updated**: 2025-10-10
