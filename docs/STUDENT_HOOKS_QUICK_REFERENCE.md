# Student Hooks Quick Reference

## Import

```typescript
import {
  // Query Hooks
  useStudents,
  useStudentDetail,
  useStudentSearch,
  useAssignedStudents,
  useStudentStats,

  // Mutation Hooks
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  useBulkImportStudents,
  useExportStudents,

  // Utility Hooks
  useStudentCacheInvalidation,
  useStudentPrefetch,

  // Query Key Factory
  studentKeys
} from '@/hooks/useStudents';
```

## Common Patterns

### Basic List with Pagination

```typescript
const { students, pagination, isLoading } = useStudents({
  page: 1,
  limit: 20,
  isActive: true
});
```

### Student Detail

```typescript
const { student, isLoading } = useStudentDetail(studentId);
```

### Search

```typescript
const { students, isLoading } = useStudentSearch(searchQuery);
```

### Create Student

```typescript
const createStudent = useCreateStudent();

await createStudent.mutateAsync({
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '2010-01-01',
  grade: '5',
  schoolId: 'school-123'
});
```

### Update Student

```typescript
const updateStudent = useUpdateStudent();

await updateStudent.mutateAsync({
  id: 'student-123',
  data: { grade: '6' }
});
```

### Delete Student

```typescript
const deleteStudent = useDeleteStudent();

await deleteStudent.mutateAsync('student-123');
```

### Manual Refresh

```typescript
const { invalidateAll } = useStudentCacheInvalidation();
invalidateAll();
```

### Prefetch on Hover

```typescript
const { prefetchStudent } = useStudentPrefetch();

onMouseEnter={() => prefetchStudent(studentId)}
```

## Cache Times

| Query Type | Stale Time | Cache Time |
|------------|------------|------------|
| List | 10 min | 30 min |
| Detail | 15 min | 30 min |
| Search | 5 min | 30 min |
| Stats | 5 min | 30 min |

## Query Keys

```typescript
studentKeys.all              // ['students']
studentKeys.lists()          // ['students', 'list']
studentKeys.list(filters)    // ['students', 'list', { filters }]
studentKeys.detail(id)       // ['students', 'detail', id]
studentKeys.search(query)    // ['students', 'search', query]
studentKeys.assigned()       // ['students', 'assigned']
studentKeys.stats()          // ['students', 'stats']
```

## Error Handling Pattern

```typescript
try {
  await mutation.mutateAsync(data);
  toast.success('Success');
} catch (error) {
  console.error('Operation failed:', error);
  toast.error('Failed to complete operation');
}
```

## Loading States

```typescript
const {
  isLoading,        // true only on initial load
  isFetching,       // true on initial load + background refetch
  isInitialLoading  // isLoading && isFetching
} = useStudents();

// Show spinner only on initial load
if (isInitialLoading) return <Spinner />;

// Show subtle indicator during background refresh
if (isFetching) return <TopBarLoader />;
```

## Healthcare Best Practices

1. **No Optimistic Updates** - Wait for server confirmation
2. **Error Logging** - Always log errors for audit trail
3. **Cache Invalidation** - Automatic after mutations
4. **Type Safety** - Use TypeScript types throughout
5. **Loading Feedback** - Always show loading states

## Performance Tips

1. **Prefetch** on hover for instant navigation
2. **Keep previous data** during pagination (automatic)
3. **Debounce** search inputs (300ms recommended)
4. **Conditional fetching** with `enabled` option
5. **Manual refetch** only when necessary

## Common Filters

```typescript
{
  search: string;       // Full-text search
  grade: string;        // Filter by grade
  isActive: boolean;    // Active/inactive filter
  schoolId: string;     // Filter by school
  page: number;         // Pagination
  limit: number;        // Page size
  sort: string;         // Sort field
  order: 'asc' | 'desc' // Sort direction
}
```

## TypeScript Types

```typescript
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  schoolId: string;
  emergencyContactId?: string;
  medicalRecordNumber?: string;
  isActive: boolean;
  enrollmentDate: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  schoolId: string;
  emergencyContactId?: string;
  medicalRecordNumber?: string;
}

interface UpdateStudentRequest extends Partial<CreateStudentRequest> {
  isActive?: boolean;
}
```
