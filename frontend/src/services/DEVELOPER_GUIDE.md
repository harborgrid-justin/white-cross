# Developer Guide: Services Layer

**Version:** 2.0.0
**Last Updated:** October 21, 2025
**Audience:** All Frontend Developers

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Daily Development Workflow](#daily-development-workflow)
3. [Common Patterns](#common-patterns)
4. [Code Examples](#code-examples)
5. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
6. [Debugging Tips](#debugging-tips)
7. [Performance Optimization](#performance-optimization)
8. [Where to Find What](#where-to-find-what)
9. [FAQ](#faq)

---

## Quick Start

### Your First Component with Services

```typescript
// 1. Import the hooks you need
import { studentHooks } from '@/services';
import { LoadingSpinner, ErrorAlert } from '@/components/shared';

// 2. Create your component
export function StudentList() {
  // 3. Use the query hook
  const { data, isLoading, error } = studentHooks.useList({
    filters: { status: 'active' }
  });

  // 4. Handle loading and error states
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;

  // 5. Render your data
  return (
    <div>
      {data.data.map(student => (
        <div key={student.id}>
          {student.firstName} {student.lastName}
        </div>
      ))}
    </div>
  );
}
```

### Your First Mutation

```typescript
import { studentHooks } from '@/services';
import { toast } from 'react-hot-toast';

export function CreateStudentForm() {
  const createStudent = studentHooks.useCreate({
    onSuccess: () => {
      toast.success('Student created successfully!');
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = (formData) => {
    createStudent.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button
        type="submit"
        disabled={createStudent.isPending}
      >
        {createStudent.isPending ? 'Creating...' : 'Create Student'}
      </button>
    </form>
  );
}
```

---

## Daily Development Workflow

### Morning Routine

```bash
# 1. Pull latest changes
git pull origin master

# 2. Install any new dependencies
npm install

# 3. Start development server
npm run dev
```

### Creating a New Feature

**Step 1: Identify the service you need**

```typescript
// Check if service exists
import {
  studentHooks,      // Student management
  healthRecordsHooks, // Health records
  medicationsHooks,   // Medications
  appointmentHooks    // Appointments
  // ... see services/index.ts for full list
} from '@/services';
```

**Step 2: Check existing hooks**

```typescript
// Example: Student service hooks
studentHooks.useList()      // Get paginated list
studentHooks.useDetail()    // Get single student
studentHooks.useSearch()    // Search students
studentHooks.useCreate()    // Create student
studentHooks.useUpdate()    // Update student
studentHooks.useDelete()    // Delete student
```

**Step 3: Implement your feature**

```typescript
function MyFeature() {
  // Use the appropriate hook
  const { data, isLoading, error } = studentHooks.useList({
    filters: myFilters
  });

  // Add mutations if needed
  const updateStudent = studentHooks.useUpdate({
    optimistic: true,
    onSuccess: () => console.log('Updated!')
  });

  // Build your UI
  return <YourComponent />;
}
```

**Step 4: Test locally**

```bash
# Run the app
npm run dev

# In another terminal, run tests
npm run test

# Or run specific test
npm run test StudentList.test.tsx
```

**Step 5: Commit your changes**

```bash
git add .
git commit -m "feat: add student list filtering"
git push origin feature/student-list-filtering
```

---

## Common Patterns

### Pattern 1: List with Filters

```typescript
function FilterableStudentList() {
  const [filters, setFilters] = useState({
    status: 'active',
    grade: undefined,
    page: 1,
    limit: 20
  });

  const { data, isLoading } = studentHooks.useList({
    filters
  });

  return (
    <>
      <FilterPanel
        filters={filters}
        onChange={setFilters}
      />
      <StudentTable
        students={data?.data}
        isLoading={isLoading}
      />
    </>
  );
}
```

### Pattern 2: Master-Detail View

```typescript
function StudentMasterDetail() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Master list
  const { data: students } = studentHooks.useList();

  // Detail (only fetches when selectedId exists)
  const { data: student, isLoading: detailLoading } = studentHooks.useDetail({
    id: selectedId || '',
    enabled: !!selectedId
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
        <StudentList
          students={students?.data}
          onSelect={setSelectedId}
          selectedId={selectedId}
        />
      </div>
      <div className="col-span-2">
        {detailLoading && <LoadingSpinner />}
        {student && <StudentDetail student={student} />}
      </div>
    </div>
  );
}
```

### Pattern 3: Search with Debouncing

```typescript
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

function SearchableStudentList() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, isLoading, isFetching } = studentHooks.useSearch({
    query: debouncedSearch,
    minQueryLength: 2
  });

  return (
    <>
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        isSearching={isFetching}
      />
      <SearchResults
        results={data?.data}
        isLoading={isLoading}
      />
    </>
  );
}
```

### Pattern 4: Create-Update Form

```typescript
function StudentForm({ studentId }: { studentId?: string }) {
  const isEditing = !!studentId;

  // Fetch existing data if editing
  const { data: existingStudent } = studentHooks.useDetail({
    id: studentId || '',
    enabled: isEditing
  });

  // Prepare mutations
  const createMutation = studentHooks.useCreate();
  const updateMutation = studentHooks.useUpdate();

  const handleSubmit = (formData) => {
    if (isEditing) {
      updateMutation.mutate({
        id: studentId,
        data: formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        defaultValue={existingStudent?.firstName}
      />
      {/* other fields */}
      <button type="submit">
        {isEditing ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
```

### Pattern 5: Optimistic Updates

```typescript
function QuickEditStudent({ studentId }: { studentId: string }) {
  const updateStudent = studentHooks.useUpdate({
    optimistic: true,  // UI updates immediately
    onError: (error) => {
      // Automatic rollback on error
      toast.error(`Update failed: ${error.message}`);
    }
  });

  const handleQuickEdit = (field: string, value: any) => {
    updateStudent.mutate({
      id: studentId,
      data: { [field]: value }
    });
  };

  return (
    <div>
      <EditableField
        label="Grade"
        onSave={(value) => handleQuickEdit('grade', value)}
      />
    </div>
  );
}
```

### Pattern 6: Dependent Queries

```typescript
function StudentHealthDashboard({ studentId }: { studentId: string }) {
  // First query: student info
  const { data: student } = studentHooks.useDetail({
    id: studentId
  });

  // Second query: health records (depends on first)
  const { data: healthRecords } = healthRecordsHooks.useList({
    filters: { studentId },
    enabled: !!student  // Only run after student loads
  });

  // Third query: medications (depends on first)
  const { data: medications } = medicationsHooks.useList({
    filters: { studentId },
    enabled: !!student
  });

  return (
    <Dashboard
      student={student}
      healthRecords={healthRecords?.data}
      medications={medications?.data}
    />
  );
}
```

### Pattern 7: Pagination

```typescript
function PaginatedStudentList() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isFetching } = studentHooks.useList({
    filters: { page, limit }
  });

  const { data: students, pagination } = data || { data: [], pagination: null };

  return (
    <>
      <StudentTable
        students={students}
        isLoading={isLoading}
      />
      <Pagination
        currentPage={page}
        totalPages={pagination?.totalPages}
        hasNext={pagination?.hasNext}
        hasPrev={pagination?.hasPrev}
        onPageChange={setPage}
        isLoading={isFetching}
      />
    </>
  );
}
```

### Pattern 8: Bulk Operations

```typescript
function BulkDeleteStudents() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const bulkDelete = studentHooks.useBulkDelete({
    onSuccess: () => {
      toast.success(`Deleted ${selectedIds.length} students`);
      setSelectedIds([]);
    },
    onError: (error) => {
      toast.error(`Bulk delete failed: ${error.message}`);
    }
  });

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} students?`)) {
      bulkDelete.mutate(selectedIds);
    }
  };

  return (
    <>
      <StudentTable
        onSelectionChange={setSelectedIds}
        selectedIds={selectedIds}
      />
      <button
        onClick={handleBulkDelete}
        disabled={selectedIds.length === 0 || bulkDelete.isPending}
      >
        Delete Selected ({selectedIds.length})
      </button>
    </>
  );
}
```

---

## Code Examples

### Example 1: Complete CRUD Component

```typescript
import { useState } from 'react';
import { studentHooks } from '@/services';
import { toast } from 'react-hot-toast';

export function StudentManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Queries
  const { data, isLoading, error } = studentHooks.useList();

  // Mutations
  const createStudent = studentHooks.useCreate({
    onSuccess: () => {
      toast.success('Student created!');
      setIsCreating(false);
    }
  });

  const updateStudent = studentHooks.useUpdate({
    optimistic: true,
    onSuccess: () => {
      toast.success('Student updated!');
      setEditingId(null);
    }
  });

  const deleteStudent = studentHooks.useDelete({
    onSuccess: () => {
      toast.success('Student deleted!');
    }
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="btn btn-primary"
        >
          Add Student
        </button>
      </div>

      <div className="grid gap-4">
        {data.data.map(student => (
          <StudentCard
            key={student.id}
            student={student}
            isEditing={editingId === student.id}
            onEdit={() => setEditingId(student.id)}
            onSave={(updates) => {
              updateStudent.mutate({
                id: student.id,
                data: updates
              });
            }}
            onDelete={() => {
              if (window.confirm('Delete this student?')) {
                deleteStudent.mutate(student.id);
              }
            }}
            onCancel={() => setEditingId(null)}
          />
        ))}
      </div>

      {isCreating && (
        <StudentModal
          onSave={(data) => createStudent.mutate(data)}
          onClose={() => setIsCreating(false)}
          isLoading={createStudent.isPending}
        />
      )}
    </div>
  );
}
```

### Example 2: Real-time Dashboard

```typescript
import { useTodayAppointments } from '@/services';

export function NurseDashboard() {
  // Auto-refresh every 60 seconds
  const { data: appointments, isLoading } = useTodayAppointments({
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: false
  });

  const stats = useMemo(() => {
    if (!appointments) return null;

    return {
      total: appointments.length,
      completed: appointments.filter(a => a.status === 'completed').length,
      pending: appointments.filter(a => a.status === 'scheduled').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length
    };
  }, [appointments]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Completed" value={stats.completed} color="green" />
        <StatCard label="Pending" value={stats.pending} color="yellow" />
        <StatCard label="Cancelled" value={stats.cancelled} color="red" />
      </div>

      <AppointmentTimeline appointments={appointments} />
    </div>
  );
}
```

### Example 3: Form with Validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { studentHooks } from '@/services';

const studentSchema = z.object({
  firstName: z.string().min(1, 'Required').max(50),
  lastName: z.string().min(1, 'Required').max(50),
  dateOfBirth: z.string().refine(
    (date) => new Date(date) < new Date(),
    'Must be in the past'
  ),
  grade: z.number().min(1).max(12),
  email: z.string().email().optional()
});

type StudentFormData = z.infer<typeof studentSchema>;

export function StudentForm({ onSuccess }: { onSuccess?: () => void }) {
  const createStudent = studentHooks.useCreate({
    onSuccess: () => {
      toast.success('Student created!');
      onSuccess?.();
    },
    onError: (error) => {
      if (error.isValidationError && error.details) {
        // Set server validation errors
        Object.entries(error.details).forEach(([field, errors]) => {
          setError(field as any, {
            message: (errors as string[])[0]
          });
        });
      }
    }
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema)
  });

  const onSubmit = (data: StudentFormData) => {
    createStudent.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>First Name</label>
        <input {...register('firstName')} />
        {errors.firstName && (
          <span className="text-red-500">{errors.firstName.message}</span>
        )}
      </div>

      <div>
        <label>Last Name</label>
        <input {...register('lastName')} />
        {errors.lastName && (
          <span className="text-red-500">{errors.lastName.message}</span>
        )}
      </div>

      <div>
        <label>Date of Birth</label>
        <input type="date" {...register('dateOfBirth')} />
        {errors.dateOfBirth && (
          <span className="text-red-500">{errors.dateOfBirth.message}</span>
        )}
      </div>

      <div>
        <label>Grade</label>
        <input
          type="number"
          {...register('grade', { valueAsNumber: true })}
        />
        {errors.grade && (
          <span className="text-red-500">{errors.grade.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || createStudent.isPending}
        className="btn btn-primary"
      >
        {createStudent.isPending ? 'Creating...' : 'Create Student'}
      </button>
    </form>
  );
}
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Direct Axios Usage

```typescript
// ❌ DON'T DO THIS
function BadStudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('/api/students').then(res => {
      setStudents(res.data);
    });
  }, []);

  return <div>{students.map(...)}</div>;
}

// ✅ DO THIS INSTEAD
function GoodStudentList() {
  const { data } = studentHooks.useList();
  return <div>{data?.data.map(...)}</div>;
}
```

### Anti-Pattern 2: Manual Cache Management

```typescript
// ❌ DON'T DO THIS
function BadUpdate() {
  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    await updateStudent();
    queryClient.invalidateQueries(['students']);
    queryClient.invalidateQueries(['students', id]);
    queryClient.refetchQueries(['students']);
  };
}

// ✅ DO THIS INSTEAD
function GoodUpdate() {
  const updateStudent = studentHooks.useUpdate({
    // Cache management is automatic
  });

  const handleUpdate = () => {
    updateStudent.mutate({ id, data });
  };
}
```

### Anti-Pattern 3: Ignoring Loading States

```typescript
// ❌ DON'T DO THIS
function BadComponent() {
  const { data } = studentHooks.useList();
  return <div>{data.data.map(...)}</div>;  // CRASH if data is undefined
}

// ✅ DO THIS INSTEAD
function GoodComponent() {
  const { data, isLoading, error } = studentHooks.useList();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;
  if (!data) return null;

  return <div>{data.data.map(...)}</div>;
}
```

### Anti-Pattern 4: Not Handling Errors

```typescript
// ❌ DON'T DO THIS
function BadMutation() {
  const mutation = studentHooks.useCreate();

  const handleCreate = () => {
    mutation.mutate(data);  // No error handling
  };
}

// ✅ DO THIS INSTEAD
function GoodMutation() {
  const mutation = studentHooks.useCreate({
    onSuccess: () => toast.success('Created!'),
    onError: (error) => toast.error(error.message)
  });

  const handleCreate = () => {
    mutation.mutate(data);
  };
}
```

### Anti-Pattern 5: Fetching in useEffect

```typescript
// ❌ DON'T DO THIS
function BadComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    studentService.getAll().then(setData);
  }, []);
}

// ✅ DO THIS INSTEAD
function GoodComponent() {
  const { data } = studentHooks.useList();
}
```

---

## Debugging Tips

### Tip 1: Enable Query DevTools

```typescript
// In App.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

### Tip 2: Check Network Tab

```
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Look for your API requests
5. Check request/response details
```

### Tip 3: Log Query State

```typescript
const query = studentHooks.useList();

useEffect(() => {
  console.log('Query State:', {
    status: query.status,
    fetchStatus: query.fetchStatus,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    data: query.data,
    error: query.error
  });
}, [query]);
```

### Tip 4: Check Cache

```typescript
import { useQueryClient } from '@tanstack/react-query';

function DebugCache() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const cache = queryClient.getQueryCache().getAll();
    console.log('Current Cache:', cache);
  }, []);
}
```

### Tip 5: Test API Directly

```typescript
// In browser console
import { studentService } from '@/services';

// Test service methods directly
studentService.getAll().then(console.log);
studentService.getById('123').then(console.log);
```

---

## Performance Optimization

### 1. Adjust Stale Time

```typescript
// For frequently changing data
const hooks = createQueryHooks(service, {
  queryKey: ['live-data'],
  staleTime: 1 * 60 * 1000  // 1 minute
});

// For rarely changing data
const hooks = createQueryHooks(service, {
  queryKey: ['static-data'],
  staleTime: 60 * 60 * 1000  // 1 hour
});
```

### 2. Use Pagination

```typescript
// ✅ Good: Paginated requests
const { data } = studentHooks.useList({
  filters: { page: 1, limit: 20 }
});

// ❌ Bad: Fetch all at once
const { data } = studentHooks.useList({
  filters: { limit: 10000 }
});
```

### 3. Prefetch Data

```typescript
import { useQueryClient } from '@tanstack/react-query';

function StudentCard({ studentId }) {
  const queryClient = useQueryClient();

  const prefetchDetails = () => {
    queryClient.prefetchQuery({
      queryKey: studentHooks.getDetailQueryKey(studentId),
      queryFn: () => studentService.getById(studentId)
    });
  };

  return (
    <div onMouseEnter={prefetchDetails}>
      {/* Card content */}
    </div>
  );
}
```

### 4. Debounce Search

```typescript
import { useDebounce } from '@/hooks/useDebounce';

function SearchComponent() {
  const [term, setTerm] = useState('');
  const debouncedTerm = useDebounce(term, 300);

  const { data } = studentHooks.useSearch({
    query: debouncedTerm
  });
}
```

### 5. Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const StudentDetail = lazy(() => import('./StudentDetail'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <StudentDetail />
    </Suspense>
  );
}
```

---

## Where to Find What

### Service Files

```
frontend/src/services/
├── index.ts                    # Main exports
├── ARCHITECTURE.md             # Architecture documentation
├── API_INTEGRATION_GUIDE.md    # Integration guide
├── DEVELOPER_GUIDE.md          # This file
├── core/
│   ├── ApiClient.ts           # HTTP client
│   ├── BaseApiService.ts      # Base CRUD service
│   └── QueryHooksFactory.ts   # Hook generator
├── modules/
│   ├── studentsApi.ts         # Student service
│   ├── healthRecordsApi.ts    # Health records service
│   ├── medicationsApi.ts      # Medications service
│   └── [other services]
└── config/
    └── apiConfig.ts           # API configuration
```

### Finding a Hook

```typescript
// 1. Check services/index.ts for exports
import {
  studentHooks,
  healthRecordsHooks,
  medicationsHooks
  // ...
} from '@/services';

// 2. Or import from specific module
import { studentHooks } from '@/services/modules/studentsApi';
```

### Finding Types

```typescript
// Import types from services
import type {
  Student,
  CreateStudentDto,
  UpdateStudentDto
} from '@/services';

// Or from specific module
import type { Student } from '@/services/modules/studentsApi';
```

### Finding Constants

```typescript
// API configuration
import { API_CONFIG, API_ENDPOINTS } from '@/services/config/apiConfig';

// HTTP status codes
import { HTTP_STATUS } from '@/constants/api';
```

---

## FAQ

### Q: How do I create a new service?

**A:** Follow the [API Integration Guide](./API_INTEGRATION_GUIDE.md#creating-new-api-services)

### Q: How do I handle authentication?

**A:** Authentication is handled automatically by `ApiClient`. Just use the hooks normally.

### Q: How do I show loading spinners?

**A:** Use the `isLoading` or `isFetching` properties from the query:

```typescript
const { data, isLoading, isFetching } = studentHooks.useList();

if (isLoading) return <LoadingSpinner />;

return (
  <>
    {isFetching && <RefreshIndicator />}
    <YourComponent />
  </>
);
```

### Q: How do I invalidate cache manually?

**A:** Use the query client:

```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Invalidate all student queries
queryClient.invalidateQueries({ queryKey: ['students'] });

// Invalidate specific query
queryClient.invalidateQueries({
  queryKey: studentHooks.getDetailQueryKey('123')
});
```

### Q: How do I test components that use hooks?

**A:** See the [Testing Guide](./TESTING.md) for comprehensive examples.

### Q: What if I need to call multiple services?

**A:** Just use multiple hooks:

```typescript
function MyComponent() {
  const { data: students } = studentHooks.useList();
  const { data: healthRecords } = healthRecordsHooks.useList();
  const { data: medications } = medicationsHooks.useList();

  // Use all the data together
}
```

### Q: How do I handle pagination?

**A:** Use the `filters` option:

```typescript
const [page, setPage] = useState(1);

const { data } = studentHooks.useList({
  filters: { page, limit: 20 }
});

// data.pagination contains: { page, limit, total, totalPages, hasNext, hasPrev }
```

### Q: How do I enable/disable a query?

**A:** Use the `enabled` option:

```typescript
const { data } = studentHooks.useDetail({
  id: studentId,
  enabled: !!studentId  // Only fetch if studentId exists
});
```

### Q: How do I add custom headers?

**A:** Use the `ApiClient` interceptors in `config/apiConfig.ts`.

### Q: How do I export data?

**A:** Use the `export` method:

```typescript
const handleExport = async () => {
  const blob = await studentService.export('csv', {
    status: 'active'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'students.csv';
  a.click();
};
```

### Q: How do I handle form validation errors from the API?

**A:**

```typescript
const mutation = studentHooks.useCreate({
  onError: (error) => {
    if (error.isValidationError && error.details) {
      Object.entries(error.details).forEach(([field, errors]) => {
        form.setError(field, { message: (errors as string[])[0] });
      });
    }
  }
});
```

---

## Summary

This guide provides practical, day-to-day guidance for working with the services layer. Remember:

1. **Always use hooks** instead of direct API calls
2. **Handle loading and error states**
3. **Follow established patterns**
4. **Test your code**
5. **Ask for help** when stuck

For more advanced topics:
- [Architecture Guide](./ARCHITECTURE.md)
- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [Testing Guide](./TESTING.md)
- [Migration Guide](../../MIGRATION_GUIDE.md)

---

*Last Updated: October 21, 2025*
*Version: 2.0.0*
