# Migration Guide: Legacy to Modern Services Architecture

**Version:** 2.0.0
**Last Updated:** October 21, 2025
**Target Audience:** All Frontend Developers

---

## Table of Contents

1. [Overview](#overview)
2. [Migration Timeline](#migration-timeline)
3. [Breaking Changes](#breaking-changes)
4. [Step-by-Step Migration](#step-by-step-migration)
5. [Component Migration Examples](#component-migration-examples)
6. [Hook Migration Examples](#hook-migration-examples)
7. [Service Migration Examples](#service-migration-examples)
8. [Testing After Migration](#testing-after-migration)
9. [Rollback Strategy](#rollback-strategy)
10. [Support and Resources](#support-and-resources)

---

## Overview

This guide helps you migrate from the legacy API patterns to the new services architecture. The migration provides:

- **Type Safety**: Full TypeScript coverage with compile-time guarantees
- **Better Performance**: Intelligent caching and optimistic updates
- **Improved DX**: Consistent patterns and reduced boilerplate
- **HIPAA Compliance**: Built-in audit logging and security features

### What's Changing

| Aspect | Legacy | Modern |
|--------|--------|---------|
| **API Calls** | Direct axios | Service classes + hooks |
| **State Management** | Manual useState | TanStack Query |
| **Caching** | None | Automatic with configurable TTL |
| **Error Handling** | Manual try/catch | Structured ApiClientError |
| **Loading States** | Manual state | Built-in query states |
| **Optimistic Updates** | Manual | Built-in with automatic rollback |
| **Type Safety** | Partial | 100% TypeScript |

---

## Migration Timeline

### Phase 1: Preparation (Week 1)

- [ ] Read all documentation
- [ ] Set up development environment
- [ ] Run existing tests to establish baseline
- [ ] Identify all components using legacy APIs

### Phase 2: New Development (Week 2-3)

- [ ] All **new features** use modern architecture
- [ ] No new code using legacy patterns
- [ ] Team training on new patterns

### Phase 3: Gradual Migration (Week 4-8)

- [ ] Migrate low-risk components first
- [ ] Migrate one module at a time
- [ ] Test thoroughly after each migration
- [ ] Update tests to use new patterns

### Phase 4: Complete Migration (Week 9-10)

- [ ] Migrate remaining legacy code
- [ ] Remove legacy compatibility layer
- [ ] Update all documentation
- [ ] Final testing and QA

### Phase 5: Cleanup (Week 11-12)

- [ ] Remove deprecated code
- [ ] Archive legacy documentation
- [ ] Team retrospective
- [ ] Performance analysis

---

## Breaking Changes

### 1. API Response Format

**Before:**
```typescript
// Inconsistent response formats
{ student: {...}, success: true }           // Students API
{ data: {...}, message: "Success" }         // Health Records API
{ result: {...} }                           // Medications API
```

**After:**
```typescript
// Standardized format
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}
```

**Migration Action:**
- Update backend controllers to return `ApiResponse<T>`
- Frontend automatically handles new format via `extractData()`

### 2. Error Structure

**Before:**
```typescript
// Inconsistent error handling
catch (error) {
  console.error(error);  // Unknown structure
}
```

**After:**
```typescript
// Structured errors
catch (error: ApiClientError) {
  error.message      // Human-readable message
  error.status       // HTTP status code
  error.code         // Error code
  error.isNetworkError
  error.isValidationError
  error.isServerError
}
```

**Migration Action:**
- Replace generic error handling with structured error checks
- Use error type guards for conditional handling

### 3. Query Keys

**Before:**
```typescript
// Manual, inconsistent keys
useQuery(['students'], ...)
useQuery(['student-list'], ...)
useQuery(['allStudents'], ...)
```

**After:**
```typescript
// Standardized query keys via hooks factory
studentHooks.useList()     // ['students', 'list', filters]
studentHooks.useDetail()   // ['students', 'detail', id]
```

**Migration Action:**
- Replace manual `useQuery` calls with factory-generated hooks
- Use factory methods for query key generation

---

## Step-by-Step Migration

### Step 1: Update Imports

**Before:**
```typescript
import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
```

**After:**
```typescript
import { studentHooks } from '@/services';
import { toast } from 'react-hot-toast';
```

### Step 2: Replace Data Fetching

**Before:**
```typescript
function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/students')
      .then(res => setStudents(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;

  return <StudentTable students={students} />;
}
```

**After:**
```typescript
function StudentList() {
  const { data, isLoading, error } = studentHooks.useList();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;

  return <StudentTable students={data.data} />;
}
```

**Savings:** 15 lines → 7 lines (53% reduction)

### Step 3: Replace Mutations

**Before:**
```typescript
function CreateStudent() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/students', formData);
      queryClient.invalidateQueries(['students']);
      toast.success('Student created!');
      return response.data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return <StudentForm onSubmit={handleCreate} isLoading={loading} />;
}
```

**After:**
```typescript
function CreateStudent() {
  const createStudent = studentHooks.useCreate({
    onSuccess: () => toast.success('Student created!'),
    onError: (error) => toast.error(error.message)
  });

  return (
    <StudentForm
      onSubmit={createStudent.mutate}
      isLoading={createStudent.isPending}
    />
  );
}
```

**Savings:** 20 lines → 10 lines (50% reduction)

### Step 4: Replace Manual Caching

**Before:**
```typescript
const cachedData = useRef<Map<string, any>>(new Map());

const fetchStudent = async (id: string) => {
  if (cachedData.current.has(id)) {
    return cachedData.current.get(id);
  }

  const response = await axios.get(`/api/students/${id}`);
  cachedData.current.set(id, response.data);

  // Invalidate after 5 minutes
  setTimeout(() => {
    cachedData.current.delete(id);
  }, 5 * 60 * 1000);

  return response.data;
};
```

**After:**
```typescript
// Automatic caching with staleTime
const { data: student } = studentHooks.useDetail({
  id: studentId
});

// Cache configuration in hooks factory
const studentHooks = createQueryHooks(studentService, {
  queryKey: ['students'],
  staleTime: 5 * 60 * 1000  // 5 minutes
});
```

**Savings:** Manual cache management → Automatic

### Step 5: Replace Optimistic Updates

**Before:**
```typescript
const updateStudent = async (id, updates) => {
  // Snapshot previous value
  const previousData = queryClient.getQueryData(['students', id]);

  // Optimistically update cache
  queryClient.setQueryData(['students', id], (old) => ({
    ...old,
    ...updates
  }));

  try {
    const response = await axios.put(`/api/students/${id}`, updates);
    queryClient.setQueryData(['students', id], response.data);
    return response.data;
  } catch (error) {
    // Rollback on error
    queryClient.setQueryData(['students', id], previousData);
    throw error;
  }
};
```

**After:**
```typescript
const updateStudent = studentHooks.useUpdate({
  optimistic: true  // That's it! Automatic rollback on error
});

// Use it
updateStudent.mutate({ id, data: updates });
```

**Savings:** 20+ lines → 1 line (95% reduction)

---

## Component Migration Examples

### Example 1: Simple List Component

**Before:**
```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '@/components/shared';

export function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/students');
        setStudents(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {students.map(student => (
        <div key={student.id}>
          {student.firstName} {student.lastName}
        </div>
      ))}
    </div>
  );
}
```

**After:**
```typescript
import { studentHooks } from '@/services';
import { LoadingSpinner, ErrorAlert } from '@/components/shared';

export function StudentList() {
  const { data, isLoading, error } = studentHooks.useList();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;

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

### Example 2: Form with Create/Update

**Before:**
```typescript
import { useState } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

export function StudentForm({ studentId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      if (studentId) {
        // Update
        await axios.put(`/api/students/${studentId}`, formData);
      } else {
        // Create
        await axios.post('/api/students', formData);
      }

      queryClient.invalidateQueries(['students']);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

**After:**
```typescript
import { studentHooks } from '@/services';
import { toast } from 'react-hot-toast';

export function StudentForm({ studentId, onSuccess }) {
  const createStudent = studentHooks.useCreate({
    onSuccess: () => {
      toast.success('Student created!');
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message)
  });

  const updateStudent = studentHooks.useUpdate({
    onSuccess: () => {
      toast.success('Student updated!');
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message)
  });

  const handleSubmit = (formData) => {
    if (studentId) {
      updateStudent.mutate({ id: studentId, data: formData });
    } else {
      createStudent.mutate(formData);
    }
  };

  const isPending = createStudent.isPending || updateStudent.isPending;

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

### Example 3: Search Component

**Before:**
```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';

export function StudentSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchStudents = debounce(async (term) => {
    if (term.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/students/search?q=${term}`);
      setResults(response.data);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    searchStudents(searchTerm);
  }, [searchTerm]);

  return (
    <>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search students..."
      />
      {loading && <div>Searching...</div>}
      <ul>
        {results.map(student => (
          <li key={student.id}>{student.name}</li>
        ))}
      </ul>
    </>
  );
}
```

**After:**
```typescript
import { useState } from 'react';
import { studentHooks } from '@/services';
import { useDebounce } from '@/hooks/useDebounce';

export function StudentSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedTerm = useDebounce(searchTerm, 300);

  const { data, isLoading } = studentHooks.useSearch({
    query: debouncedTerm,
    minQueryLength: 2
  });

  return (
    <>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search students..."
      />
      {isLoading && <div>Searching...</div>}
      <ul>
        {data?.data.map(student => (
          <li key={student.id}>{student.name}</li>
        ))}
      </ul>
    </>
  );
}
```

---

## Hook Migration Examples

### Custom Hook: useStudents

**Before:**
```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useStudents(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(filters).toString();
        const response = await axios.get(`/api/students?${params}`);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    // Re-run effect
  };

  return { data, loading, error, refetch };
}
```

**After:**
```typescript
import { studentHooks } from '@/services';

export function useStudents(filters = {}) {
  // That's it! The hook factory provides everything
  return studentHooks.useList({ filters });
}

// Or just use studentHooks.useList() directly
```

### Custom Hook: useCreateStudent

**Before:**
```typescript
import { useState } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

export function useCreateStudent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const create = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/students', data);
      queryClient.invalidateQueries(['students']);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}
```

**After:**
```typescript
import { studentHooks } from '@/services';

// Just use the factory-generated hook
export const useCreateStudent = studentHooks.useCreate;

// Or add custom options
export function useCreateStudent(options = {}) {
  return studentHooks.useCreate({
    onSuccess: () => console.log('Student created!'),
    ...options
  });
}
```

---

## Service Migration Examples

### Legacy Service Class

**Before:**
```typescript
// services/StudentService.ts
import axios from 'axios';

export class StudentService {
  private baseUrl = '/api/students';

  async getAll(page = 1, limit = 10) {
    const response = await axios.get(`${this.baseUrl}?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getById(id: string) {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: any) {
    const response = await axios.post(this.baseUrl, data);
    return response.data;
  }

  async update(id: string, data: any) {
    const response = await axios.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: string) {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}

export const studentService = new StudentService();
```

**After:**
```typescript
// services/modules/studentsApi.ts
import { BaseApiService } from '@/services/core';
import { ApiClient } from '@/services/core';
import { Student, CreateStudentDto, UpdateStudentDto } from './types';
import { createStudentSchema, updateStudentSchema } from './schemas';

export class StudentService extends BaseApiService<
  Student,
  CreateStudentDto,
  UpdateStudentDto
> {
  constructor(client: ApiClient) {
    super(client, '/api/v1/students', {
      createSchema: createStudentSchema,
      updateSchema: updateStudentSchema
    });
  }

  // All CRUD operations inherited from BaseApiService
  // Add custom methods as needed

  async getAssignedStudents(nurseId: string): Promise<Student[]> {
    return this.get<Student[]>(`${this.baseEndpoint}/assigned/${nurseId}`);
  }
}

// Create hooks factory
import { createQueryHooks } from '@/services/core';
import { apiClient } from '@/services/config/apiConfig';

const studentService = new StudentService(apiClient);

export const studentHooks = createQueryHooks(studentService, {
  queryKey: ['students'],
  staleTime: 5 * 60 * 1000
});

export { studentService };
```

---

## Testing After Migration

### Update Component Tests

**Before:**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { StudentList } from './StudentList';

jest.mock('axios');

test('renders students', async () => {
  (axios.get as jest.Mock).mockResolvedValue({
    data: [{ id: '1', firstName: 'John', lastName: 'Doe' }]
  });

  render(<StudentList />);

  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

**After:**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StudentList } from './StudentList';
import { studentService } from '@/services';

// Mock the service
jest.mock('@/services', () => ({
  studentHooks: {
    useList: jest.fn()
  }
}));

test('renders students', async () => {
  const mockData = {
    data: [{ id: '1', firstName: 'John', lastName: 'Doe' }],
    pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
  };

  (studentHooks.useList as jest.Mock).mockReturnValue({
    data: mockData,
    isLoading: false,
    error: null
  });

  render(<StudentList />);

  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Update Integration Tests

**Before:**
```typescript
test('creates student', async () => {
  const mockStudent = { firstName: 'John', lastName: 'Doe' };

  (axios.post as jest.Mock).mockResolvedValue({
    data: { id: '1', ...mockStudent }
  });

  // Test creation logic
});
```

**After:**
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { studentHooks } from '@/services';

test('creates student', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result } = renderHook(() => studentHooks.useCreate(), { wrapper });

  result.current.mutate({
    firstName: 'John',
    lastName: 'Doe'
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toHaveProperty('id');
});
```

---

## Rollback Strategy

If migration causes issues:

### 1. Component-Level Rollback

```typescript
// Temporarily revert to legacy code
// Mark with TODO for later migration
// TODO: Migrate to modern services architecture
function StudentList() {
  // Legacy code here...
}
```

### 2. Module-Level Rollback

```bash
# Revert specific file
git checkout HEAD -- src/components/StudentList.tsx

# Revert entire module
git checkout HEAD -- src/pages/Students/
```

### 3. Branch-Level Rollback

```bash
# Create backup branch
git branch migration-backup

# Revert to pre-migration state
git reset --hard <commit-before-migration>
```

### 4. Feature Flag Rollback

```typescript
// Use feature flag for gradual rollout
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

function StudentList() {
  const useModernServices = useFeatureFlag('modern-services');

  if (useModernServices) {
    return <ModernStudentList />;
  }

  return <LegacyStudentList />;
}
```

---

## Support and Resources

### Documentation

- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Architecture Guide](./frontend/src/services/ARCHITECTURE.md)
- [API Integration Guide](./frontend/src/services/API_INTEGRATION_GUIDE.md)
- [Developer Guide](./frontend/src/services/DEVELOPER_GUIDE.md)
- [Testing Guide](./frontend/src/services/TESTING.md)

### Getting Help

1. **Check Documentation**: Start with the guides above
2. **Ask the Team**: Post in #frontend-help Slack channel
3. **Code Review**: Request review from architecture team
4. **Pair Programming**: Schedule pairing session for complex migrations

### Common Migration Issues

| Issue | Solution |
|-------|----------|
| Types not matching | Ensure DTOs are properly defined |
| Cache not invalidating | Check query key consistency |
| Optimistic updates failing | Verify rollback context |
| Tests failing | Update test setup with QueryClientProvider |
| Performance regression | Adjust staleTime and gcTime |

---

## Migration Checklist

Use this checklist for each component migration:

- [ ] Read component and understand current behavior
- [ ] Identify all API calls
- [ ] Identify all state management
- [ ] Replace axios calls with service hooks
- [ ] Replace manual state with query hooks
- [ ] Replace manual mutations with mutation hooks
- [ ] Update error handling
- [ ] Update loading states
- [ ] Update tests
- [ ] Test thoroughly in development
- [ ] Code review
- [ ] Deploy to staging
- [ ] QA testing
- [ ] Deploy to production
- [ ] Monitor for issues

---

## Summary

Migration to the modern services architecture is straightforward when following this guide. Key points:

1. **Migrate incrementally** - one component at a time
2. **Test thoroughly** after each migration
3. **Follow established patterns** from the guides
4. **Ask for help** when stuck
5. **Document any deviations** from the standard patterns

The investment in migration will pay dividends in:
- Reduced bugs
- Faster development
- Better performance
- Improved maintainability

---

*Last Updated: October 21, 2025*
*Version: 2.0.0*
