# Student Domain Hooks Documentation

## Overview

Enterprise-grade TanStack Query hooks for student management in the White Cross Healthcare Platform. This module provides a complete set of hooks following healthcare-specific patterns with proper cache management, error handling, and data integrity guarantees.

## Table of Contents

- [Installation](#installation)
- [Query Key Factory](#query-key-factory)
- [Query Hooks](#query-hooks)
- [Mutation Hooks](#mutation-hooks)
- [Utility Hooks](#utility-hooks)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)

## Installation

```typescript
import {
  useStudents,
  useStudentDetail,
  useStudentSearch,
  useAssignedStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  studentKeys
} from '@/hooks/useStudents';
```

## Query Key Factory

The `studentKeys` factory provides consistent, type-safe cache keys for all student queries.

```typescript
export const studentKeys = {
  all: ['students'],                          // Base key
  lists: () => [...studentKeys.all, 'list'],  // All list queries
  list: (filters) => [...studentKeys.lists(), filters],
  details: () => [...studentKeys.all, 'detail'],
  detail: (id) => [...studentKeys.details(), id],
  searches: () => [...studentKeys.all, 'search'],
  search: (query) => [...studentKeys.searches(), query],
  assigned: () => [...studentKeys.all, 'assigned'],
  stats: () => [...studentKeys.all, 'stats']
};
```

### Usage Example

```typescript
// Manually invalidate specific queries
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
queryClient.invalidateQueries({ queryKey: studentKeys.detail('student-123') });
```

## Query Hooks

### useStudents(filters?)

Fetch paginated student list with optional filters.

**Cache Configuration:**
- Stale Time: 10 minutes
- Cache Time: 30 minutes

**Parameters:**
```typescript
interface StudentFilters {
  search?: string;
  grade?: string;
  isActive?: boolean;
  schoolId?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
```

**Returns:**
```typescript
interface UseStudentsReturn {
  data: PaginatedResponse<Student> | undefined;
  students: Student[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | undefined;
  isLoading: boolean;
  error: Error | null;
  isFetching: boolean;
  isInitialLoading: boolean;
  refetch: () => void;
}
```

**Example:**
```typescript
function StudentListPage() {
  const [page, setPage] = useState(1);
  const [grade, setGrade] = useState<string>();

  const { students, pagination, isLoading, error } = useStudents({
    grade,
    isActive: true,
    page,
    limit: 20,
    sort: 'lastName',
    order: 'asc'
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <>
      <StudentTable students={students} />
      <Pagination
        current={pagination?.page}
        total={pagination?.totalPages}
        onChange={setPage}
      />
    </>
  );
}
```

### useStudentDetail(studentId, options?)

Fetch detailed information for a single student.

**Cache Configuration:**
- Stale Time: 15 minutes
- Cache Time: 30 minutes

**Parameters:**
```typescript
studentId: string | undefined
options?: {
  enabled?: boolean;
}
```

**Returns:**
```typescript
interface UseStudentDetailReturn {
  student: Student | undefined;
  isLoading: boolean;
  error: Error | null;
  isFetching: boolean;
  refetch: () => void;
}
```

**Example:**
```typescript
function StudentProfilePage({ studentId }: { studentId: string }) {
  const { student, isLoading, error, refetch } = useStudentDetail(studentId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;
  if (!student) return <NotFound />;

  return (
    <>
      <StudentHeader student={student} onRefresh={refetch} />
      <StudentDetails student={student} />
    </>
  );
}
```

**Conditional Fetching:**
```typescript
function ConditionalStudentProfile({ studentId, shouldFetch }: Props) {
  const { student, isLoading } = useStudentDetail(studentId, {
    enabled: shouldFetch // Only fetch when explicitly enabled
  });

  // Hook won't make API call until shouldFetch is true
}
```

### useStudentSearch(query, options?)

Search students by query string.

**Cache Configuration:**
- Stale Time: 5 minutes
- Cache Time: 30 minutes

**Parameters:**
```typescript
query: string
options?: {
  enabled?: boolean;
}
```

**Returns:**
```typescript
interface UseStudentSearchReturn {
  students: Student[];
  isLoading: boolean;
  error: Error | null;
  isFetching: boolean;
}
```

**Example:**
```typescript
function StudentSearchInput() {
  const [searchQuery, setSearchQuery] = useState('');
  const { students, isLoading } = useStudentSearch(searchQuery);

  return (
    <>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search students..."
      />
      {isLoading && <LoadingSpinner />}
      {students.length > 0 && (
        <SearchResults students={students} />
      )}
    </>
  );
}
```

**With Debouncing:**
```typescript
function DebouncedStudentSearch() {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const { students, isLoading } = useStudentSearch(debouncedQuery);

  return (
    <SearchInput
      value={inputValue}
      onChange={setInputValue}
    />
  );
}
```

### useAssignedStudents()

Fetch students assigned to the current user (nurse).

**Cache Configuration:**
- Stale Time: 10 minutes
- Cache Time: 30 minutes

**Returns:**
```typescript
{
  students: Student[];
  isLoading: boolean;
  error: Error | null;
  isFetching: boolean;
  refetch: () => void;
}
```

**Example:**
```typescript
function MyStudentsPage() {
  const { students, isLoading, refetch } = useAssignedStudents();

  return (
    <div>
      <PageHeader
        title="My Students"
        action={<RefreshButton onClick={refetch} />}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <StudentGrid students={students} />
      )}
    </div>
  );
}
```

### useStudentStats()

Fetch student statistics (placeholder - backend not yet implemented).

**Cache Configuration:**
- Stale Time: 5 minutes
- Cache Time: 30 minutes
- Currently disabled

**Returns:**
```typescript
interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  byGrade: Record<string, number>;
  bySchool?: Record<string, number>;
  recentEnrollments: number;
}
```

**Example:**
```typescript
function StudentStatsDashboard() {
  const { stats, isLoading } = useStudentStats();

  // Note: Currently disabled until backend endpoint is implemented
  // Will return undefined and not make API calls

  return stats ? (
    <StatsGrid>
      <StatCard label="Total Students" value={stats.totalStudents} />
      <StatCard label="Active Students" value={stats.activeStudents} />
      <GradeDistributionChart data={stats.byGrade} />
    </StatsGrid>
  ) : (
    <ComingSoonBanner />
  );
}
```

## Mutation Hooks

### useCreateStudent()

Create a new student record.

**Important:** No optimistic updates for healthcare data integrity.

**Returns:**
```typescript
UseMutationResult<Student, Error, CreateStudentRequest>
```

**Example:**
```typescript
function CreateStudentForm() {
  const navigate = useNavigate();
  const createStudent = useCreateStudent();

  const handleSubmit = async (data: CreateStudentRequest) => {
    try {
      const newStudent = await createStudent.mutateAsync(data);
      toast.success('Student created successfully');
      navigate(`/students/${newStudent.id}`);
    } catch (error) {
      toast.error('Failed to create student');
      console.error(error);
    }
  };

  return (
    <StudentForm
      onSubmit={handleSubmit}
      isSubmitting={createStudent.isPending}
    />
  );
}
```

**With React Hook Form:**
```typescript
function CreateStudentFormWithRHF() {
  const navigate = useNavigate();
  const createStudent = useCreateStudent();
  const { handleSubmit, control } = useForm<CreateStudentRequest>();

  const onSubmit = handleSubmit(async (data) => {
    const newStudent = await createStudent.mutateAsync(data);
    navigate(`/students/${newStudent.id}`);
  });

  return (
    <form onSubmit={onSubmit}>
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => <Input {...field} />}
      />
      {/* ... other fields ... */}
      <Button
        type="submit"
        loading={createStudent.isPending}
        disabled={createStudent.isPending}
      >
        Create Student
      </Button>
    </form>
  );
}
```

### useUpdateStudent()

Update an existing student record.

**Important:** No optimistic updates for healthcare data integrity.

**Returns:**
```typescript
UseMutationResult<Student, Error, { id: string; data: UpdateStudentRequest }>
```

**Example:**
```typescript
function EditStudentForm({ student }: { student: Student }) {
  const updateStudent = useUpdateStudent();

  const handleUpdate = async (data: UpdateStudentRequest) => {
    try {
      await updateStudent.mutateAsync({
        id: student.id,
        data
      });
      toast.success('Student updated successfully');
    } catch (error) {
      toast.error('Failed to update student');
    }
  };

  return (
    <StudentForm
      initialValues={student}
      onSubmit={handleUpdate}
      isSubmitting={updateStudent.isPending}
    />
  );
}
```

**Partial Update Example:**
```typescript
function QuickStatusToggle({ student }: { student: Student }) {
  const updateStudent = useUpdateStudent();

  const toggleActiveStatus = async () => {
    await updateStudent.mutateAsync({
      id: student.id,
      data: { isActive: !student.isActive }
    });
  };

  return (
    <Switch
      checked={student.isActive}
      onChange={toggleActiveStatus}
      disabled={updateStudent.isPending}
    />
  );
}
```

### useDeleteStudent()

Delete a student record.

**Warning:** This is a critical operation. Consider implementing soft delete (isActive flag) instead.

**Returns:**
```typescript
UseMutationResult<{ id: string }, Error, string>
```

**Example:**
```typescript
function DeleteStudentButton({ studentId }: { studentId: string }) {
  const navigate = useNavigate();
  const deleteStudent = useDeleteStudent();

  const handleDelete = async () => {
    const confirmed = await showConfirmDialog({
      title: 'Delete Student',
      message: 'Are you sure? This action cannot be undone.',
      variant: 'danger'
    });

    if (!confirmed) return;

    try {
      await deleteStudent.mutateAsync(studentId);
      toast.success('Student deleted successfully');
      navigate('/students');
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  return (
    <Button
      variant="danger"
      onClick={handleDelete}
      loading={deleteStudent.isPending}
    >
      Delete Student
    </Button>
  );
}
```

### useBulkImportStudents()

Import multiple students at once.

**Returns:**
```typescript
UseMutationResult<
  { success: number; failed: number; errors: string[] },
  Error,
  CreateStudentRequest[]
>
```

**Example:**
```typescript
function BulkImportStudents() {
  const bulkImport = useBulkImportStudents();
  const [csvData, setCsvData] = useState<CreateStudentRequest[]>([]);

  const handleImport = async () => {
    try {
      const result = await bulkImport.mutateAsync(csvData);
      toast.success(
        `Successfully imported ${result.success} students. ${result.failed} failed.`
      );

      if (result.errors.length > 0) {
        console.error('Import errors:', result.errors);
      }
    } catch (error) {
      toast.error('Bulk import failed');
    }
  };

  return (
    <div>
      <CsvUploader onChange={setCsvData} />
      <Button
        onClick={handleImport}
        disabled={csvData.length === 0 || bulkImport.isPending}
      >
        Import {csvData.length} Students
      </Button>
    </div>
  );
}
```

### useExportStudents()

Export student data to CSV/Excel.

**Returns:**
```typescript
UseMutationResult<Blob, Error, StudentFilters | undefined>
```

**Example:**
```typescript
function ExportStudentsButton({ filters }: { filters?: StudentFilters }) {
  const exportStudents = useExportStudents();

  const handleExport = async () => {
    try {
      const blob = await exportStudents.mutateAsync(filters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `students-${new Date().toISOString()}.csv`;
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);

      toast.success('Export completed successfully');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <Button
      onClick={handleExport}
      loading={exportStudents.isPending}
      icon={<DownloadIcon />}
    >
      Export Students
    </Button>
  );
}
```

## Utility Hooks

### useStudentCacheInvalidation()

Programmatic cache invalidation utilities.

**Returns:**
```typescript
{
  invalidateAll: () => void;
  invalidateStudent: (studentId: string) => void;
  invalidateLists: () => void;
  invalidateSearches: () => void;
  invalidateStats: () => void;
}
```

**Example:**
```typescript
function RefreshAllButton() {
  const { invalidateAll } = useStudentCacheInvalidation();

  const handleRefresh = () => {
    invalidateAll();
    toast.info('Data refreshed');
  };

  return <Button onClick={handleRefresh}>Refresh All</Button>;
}
```

**Targeted Invalidation:**
```typescript
function StudentProfileActions({ studentId }: { studentId: string }) {
  const { invalidateStudent } = useStudentCacheInvalidation();

  const handleManualRefresh = () => {
    invalidateStudent(studentId);
    toast.info('Student data refreshed');
  };

  return <RefreshButton onClick={handleManualRefresh} />;
}
```

### useStudentPrefetch()

Performance optimization through prefetching.

**Returns:**
```typescript
{
  prefetchStudent: (studentId: string) => Promise<void>;
  prefetchStudents: (filters?: StudentFilters) => Promise<void>;
}
```

**Example:**
```typescript
function StudentListRow({ student }: { student: Student }) {
  const navigate = useNavigate();
  const { prefetchStudent } = useStudentPrefetch();

  const handleRowClick = () => {
    navigate(`/students/${student.id}`);
  };

  const handleRowHover = () => {
    // Prefetch student details on hover for instant navigation
    prefetchStudent(student.id);
  };

  return (
    <TableRow
      onClick={handleRowClick}
      onMouseEnter={handleRowHover}
    >
      <TableCell>{student.firstName} {student.lastName}</TableCell>
      <TableCell>{student.grade}</TableCell>
    </TableRow>
  );
}
```

**Prefetch Next Page:**
```typescript
function StudentListPagination({ currentPage, filters }: Props) {
  const { prefetchStudents } = useStudentPrefetch();

  useEffect(() => {
    // Prefetch next page for instant pagination
    prefetchStudents({
      ...filters,
      page: currentPage + 1
    });
  }, [currentPage, filters, prefetchStudents]);

  return <Pagination current={currentPage} />;
}
```

## Best Practices

### 1. Healthcare Data Integrity

**Never use optimistic updates** for healthcare data:

```typescript
// ❌ BAD: Optimistic updates can cause data inconsistency
const updateStudent = useMutation({
  onMutate: async (newData) => {
    // Don't do this for healthcare data!
    queryClient.setQueryData(['students', id], newData);
  }
});

// ✅ GOOD: Wait for server confirmation
const updateStudent = useUpdateStudent();
await updateStudent.mutateAsync({ id, data });
// Cache invalidated automatically after success
```

### 2. Error Handling

Always handle errors appropriately in healthcare context:

```typescript
const createStudent = useCreateStudent();

try {
  await createStudent.mutateAsync(data);
  toast.success('Student created successfully');
} catch (error) {
  // Log for audit trail
  console.error('Failed to create student:', error);

  // User-friendly message
  toast.error('Failed to create student. Please try again.');

  // Healthcare-specific: may need to notify admins for critical errors
  if (isServerError(error)) {
    notifyAdmins('Student creation failed', error);
  }
}
```

### 3. Loading States

Provide proper loading feedback:

```typescript
function StudentProfile({ studentId }: Props) {
  const { student, isLoading, isFetching } = useStudentDetail(studentId);

  if (isLoading) {
    return <FullPageSpinner message="Loading student profile..." />;
  }

  return (
    <div>
      {isFetching && <TopBarLoader />}
      <StudentDetails student={student} />
    </div>
  );
}
```

### 4. Pagination Best Practices

Keep previous data while loading new page:

```typescript
// This is already implemented in useStudents hook
// via placeholderData: (previousData) => previousData

function StudentList() {
  const [page, setPage] = useState(1);
  const { students, isLoading, isFetching } = useStudents({ page });

  // isLoading: true only on initial load
  // isFetching: true on initial load AND when changing pages

  return (
    <div>
      {/* Show skeleton only on initial load */}
      {isLoading && <SkeletonTable />}

      {/* Show table with loading indicator when changing pages */}
      {!isLoading && (
        <>
          <StudentTable
            students={students}
            loading={isFetching} // Shows subtle loading indicator
          />
          <Pagination current={page} onChange={setPage} />
        </>
      )}
    </div>
  );
}
```

### 5. Cache Invalidation Strategy

Understand when to invalidate:

```typescript
// After mutations, cache is automatically invalidated
const updateStudent = useUpdateStudent();

// This will:
// 1. Update the student
// 2. Invalidate student detail cache
// 3. Invalidate all list queries
// 4. Trigger automatic refetch for mounted queries
await updateStudent.mutateAsync({ id, data });

// Manual invalidation only needed for:
// - External data changes (websocket updates)
// - Manual refresh buttons
// - Complex cross-module dependencies
```

### 6. Type Safety

Always use TypeScript types:

```typescript
// ✅ GOOD: Fully typed
const { students } = useStudents();
students.forEach((student: Student) => {
  console.log(student.firstName); // Type-safe
});

// ❌ BAD: Losing type safety
const { students } = useStudents();
students.forEach((student: any) => { // Don't use any!
  console.log(student.firstName);
});
```

## Migration Guide

### From Legacy useStudents Hook

**Old API:**
```typescript
// Old - limited functionality
const { students, isLoading, error } = useStudents(filters);
```

**New API:**
```typescript
// New - enhanced functionality
const {
  students,          // Same
  isLoading,         // Same
  error,             // Same
  pagination,        // NEW: Access to pagination metadata
  isFetching,        // NEW: Background refresh indicator
  isInitialLoading,  // NEW: Distinguish initial vs refetch
  refetch,           // NEW: Manual refetch
  data               // NEW: Access to raw response
} = useStudents(filters);
```

**Migration Steps:**

1. Update imports if needed:
```typescript
// Old
import { useStudents } from '@/hooks/useStudents';

// New (same, no change needed)
import { useStudents } from '@/hooks/useStudents';
```

2. Access pagination metadata:
```typescript
// Old - had to track separately
const [totalPages, setTotalPages] = useState(0);

// New - automatically provided
const { pagination } = useStudents({ page: 1 });
console.log(pagination?.totalPages);
```

3. Use new loading states:
```typescript
// Old - single loading state
if (isLoading) return <Spinner />;

// New - differentiate initial load vs background refresh
if (isInitialLoading) return <FullPageSpinner />;
if (isFetching) return <TopBarLoader />; // Background refresh
```

### Breaking Changes

**None** - The hook is fully backward compatible. All existing code will continue to work.

### New Features You Should Adopt

1. **Mutation Hooks** - Replace manual API calls
2. **Prefetching** - Improve perceived performance
3. **Cache Invalidation** - Better cache management
4. **Query Key Factory** - Consistent cache keys

## Performance Considerations

### Cache Times

```typescript
CACHE_CONFIG = {
  LIST_STALE_TIME: 10 * 60 * 1000,     // 10 minutes
  DETAIL_STALE_TIME: 15 * 60 * 1000,   // 15 minutes
  SEARCH_STALE_TIME: 5 * 60 * 1000,    // 5 minutes
  STATS_STALE_TIME: 5 * 60 * 1000,     // 5 minutes
  DEFAULT_CACHE_TIME: 30 * 60 * 1000,  // 30 minutes
}
```

These values balance:
- Data freshness (healthcare requirement)
- Network request reduction
- Memory usage

### Network Optimization

1. **Prefetching** - Load data before needed
2. **Placeholder Data** - Keep previous data during refetch
3. **Automatic Deduplication** - TanStack Query deduplicates identical requests
4. **Stale-While-Revalidate** - Show cached data while refetching

## Security Considerations

### PHI (Protected Health Information)

Student data is PHI under HIPAA:

1. **Audit Logging** - All mutations are logged
2. **No Optimistic Updates** - Ensure data consistency
3. **Error Handling** - Don't expose sensitive info in errors
4. **Cache Management** - Clear cache on logout

```typescript
// Example: Clear cache on logout
const { invalidateAll } = useStudentCacheInvalidation();

function handleLogout() {
  invalidateAll();
  queryClient.clear(); // Clear all cache
  // ... logout logic
}
```

## Troubleshooting

### Common Issues

**1. Data not updating after mutation**

Check if query is mounted:
```typescript
const { data } = useStudents(); // Must be mounted to auto-refetch
```

**2. Stale data showing**

Manually refetch:
```typescript
const { refetch } = useStudents();
refetch(); // Force fresh data
```

**3. Memory leaks**

Ensure cleanup in useEffect:
```typescript
useEffect(() => {
  const { prefetchStudent } = useStudentPrefetch();
  prefetchStudent(id);

  // No cleanup needed - TanStack Query handles it
}, [id]);
```

## Support

For issues or questions:
1. Check this documentation
2. Review TanStack Query docs: https://tanstack.com/query/latest
3. Contact the healthcare platform team
4. Review audit logs for data-related issues

## License

Internal use only - White Cross Healthcare Platform
