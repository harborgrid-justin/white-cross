# Services Architecture Guide

**Version:** 2.0.0
**Last Updated:** October 21, 2025
**Maintainer:** Frontend Architecture Team

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Layer Diagram](#layer-diagram)
4. [Core Components](#core-components)
5. [Data Flow](#data-flow)
6. [Service Lifecycle](#service-lifecycle)
7. [Extension Guidelines](#extension-guidelines)
8. [Best Practices](#best-practices)
9. [Anti-Patterns](#anti-patterns)

---

## Overview

The White Cross services architecture implements a **layered, type-safe, modular system** for frontend-backend communication. The architecture prioritizes:

- **Type Safety**: 100% TypeScript with compile-time guarantees
- **HIPAA Compliance**: Built-in audit logging and security controls
- **Developer Experience**: Consistent patterns and minimal boilerplate
- **Performance**: Intelligent caching and optimistic updates
- **Maintainability**: Clear separation of concerns and testability

### Key Design Decisions

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **TanStack Query** | Industry-standard for server state management | Learning curve for new developers |
| **Generic Base Classes** | Code reuse and consistency | Some flexibility sacrificed |
| **Zod Validation** | Runtime type safety for API boundaries | Additional dependency |
| **Optimistic Updates** | Better UX with instant feedback | Complexity in error handling |
| **Modular Services** | Clear ownership and maintainability | More files to navigate |

---

## Architecture Principles

### 1. Single Responsibility Principle

Each layer has a specific, well-defined purpose:

```typescript
// ✅ Good: Each layer handles its responsibility
Component → useList()           // UI logic only
  ↓
QueryHooks → service.getAll()   // Query orchestration
  ↓
Service → client.get()          // Business logic
  ↓
ApiClient → axios.get()         // HTTP communication
```

### 2. Dependency Inversion

Higher-level modules depend on abstractions, not concrete implementations:

```typescript
// ✅ Good: Services depend on BaseApiService abstraction
export class StudentService extends BaseApiService<Student, CreateStudentDto> {
  // Inherits all CRUD operations
  // Adds student-specific logic
}

// ❌ Bad: Direct axios usage in components
function StudentList() {
  useEffect(() => {
    axios.get('/api/students').then(setStudents);
  }, []);
}
```

### 3. Open/Closed Principle

Open for extension, closed for modification:

```typescript
// ✅ Good: Extend BaseApiService for custom behavior
export class HealthRecordsService extends BaseApiService<HealthRecord> {
  // Override search with HIPAA audit logging
  public async search(query: string): Promise<PaginatedResponse<HealthRecord>> {
    this.logAuditEvent('PHI_ACCESS', query);
    return super.search(query);
  }
}
```

### 4. Interface Segregation

Clients shouldn't depend on interfaces they don't use:

```typescript
// ✅ Good: Specific operation interfaces
interface ReadOnlyOperations<T> {
  getAll(filters?: FilterParams): Promise<PaginatedResponse<T>>;
  getById(id: string): Promise<T>;
}

interface WriteOperations<T, TCreate, TUpdate> {
  create(data: TCreate): Promise<T>;
  update(id: string, data: TUpdate): Promise<T>;
  delete(id: string): Promise<void>;
}

// Compose as needed
interface CrudOperations<T, TCreate, TUpdate>
  extends ReadOnlyOperations<T>, WriteOperations<T, TCreate, TUpdate> {}
```

---

## Layer Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                            │
│                                                                       │
│  React Components (Pages, Forms, Modals, Tables)                    │
│  - Render UI based on query state                                   │
│  - Handle user interactions                                          │
│  - Display loading/error states                                     │
│                                                                       │
└────────────────────────────┬──────────────────────────────────────────┘
                             │
                             │ Hook Calls (useList, useCreate, etc.)
                             │
                             ▼
┌───────────────────────────────────────────────────────────────────────┐
│                      QUERY ORCHESTRATION LAYER                        │
│                                                                       │
│  QueryHooksFactory (TanStack Query Integration)                      │
│  - Generate type-safe query hooks                                   │
│  - Manage cache keys and invalidation                               │
│  - Handle optimistic updates                                        │
│  - Coordinate mutations and side effects                            │
│                                                                       │
│  Cache Management:                                                   │
│  ┌─────────────┬──────────────┬────────────────┬─────────────┐     │
│  │ ['students']│ ['health-*'] │ ['medications']│ ['reports'] │     │
│  └─────────────┴──────────────┴────────────────┴─────────────┘     │
│                                                                       │
└────────────────────────────┬──────────────────────────────────────────┘
                             │
                             │ Service Method Calls
                             │
                             ▼
┌───────────────────────────────────────────────────────────────────────┐
│                        BUSINESS LOGIC LAYER                           │
│                                                                       │
│  BaseApiService (Abstract CRUD Operations)                           │
│  - Implement domain-specific business rules                         │
│  - Validate input with Zod schemas                                  │
│  - Transform data between DTOs and entities                         │
│  - Coordinate complex operations                                    │
│                                                                       │
│  Concrete Services:                                                  │
│  ┌────────────┬────────────────┬──────────────┬─────────────────┐   │
│  │ Students   │ HealthRecords  │ Medications  │ Appointments    │   │
│  │ Service    │ Service        │ Service      │ Service         │   │
│  └────────────┴────────────────┴──────────────┴─────────────────┘   │
│                                                                       │
└────────────────────────────┬──────────────────────────────────────────┘
                             │
                             │ HTTP Method Calls
                             │
                             ▼
┌───────────────────────────────────────────────────────────────────────┐
│                      HTTP COMMUNICATION LAYER                         │
│                                                                       │
│  ApiClient (Axios Wrapper)                                           │
│  - Configure HTTP client (base URL, timeout, headers)               │
│  - Implement request/response interceptors                          │
│  - Handle authentication (JWT tokens)                               │
│  - Implement retry logic with exponential backoff                   │
│  - Normalize error responses                                        │
│                                                                       │
│  Interceptors:                                                       │
│  ┌──────────────────┬──────────────────┬─────────────────────┐      │
│  │ Auth Token       │ Request Tracing  │ Error Normalization │      │
│  │ Injection        │ (X-Request-ID)   │ & Retry Logic       │      │
│  └──────────────────┴──────────────────┴─────────────────────┘      │
│                                                                       │
└────────────────────────────┬──────────────────────────────────────────┘
                             │
                             │ HTTP Requests (GET, POST, PUT, DELETE)
                             │
                             ▼
┌───────────────────────────────────────────────────────────────────────┐
│                          BACKEND REST API                             │
│                                                                       │
│  Express.js Controllers + Services + Sequelize ORM                   │
│  - Process HTTP requests                                            │
│  - Execute business logic                                           │
│  - Interact with PostgreSQL database                                │
│  - Return standardized ApiResponse<T> format                        │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. ApiClient (`core/ApiClient.ts`)

**Purpose**: Centralized HTTP communication with enterprise-grade error handling.

**Responsibilities**:
- HTTP method wrappers (GET, POST, PUT, PATCH, DELETE)
- Request/response interceptors
- Authentication token management
- Automatic token refresh
- Retry logic with exponential backoff
- Error normalization

**Key Features**:

```typescript
export class ApiClient {
  // HTTP Methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>

  // Interceptor Management
  public addRequestInterceptor(interceptor: RequestInterceptor): number
  public addResponseInterceptor(interceptor: ResponseInterceptor): number
  public removeRequestInterceptor(id: number): void
  public removeResponseInterceptor(id: number): void

  // Configuration
  public setLogging(enabled: boolean): void
  public setRetry(enabled: boolean): void
  public getAxiosInstance(): AxiosInstance
}
```

**Configuration Options**:

```typescript
interface ApiClientConfig {
  baseURL?: string;               // Default: API_CONFIG.BASE_URL
  timeout?: number;               // Default: API_CONFIG.TIMEOUT
  withCredentials?: boolean;      // Default: true
  enableLogging?: boolean;        // Default: true (dev only)
  enableRetry?: boolean;          // Default: true
  maxRetries?: number;            // Default: 3
  retryDelay?: number;            // Default: 1000ms
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
}
```

**Error Handling**:

```typescript
export class ApiClientError extends Error {
  public readonly code?: string;           // Error code (e.g., 'NETWORK_ERROR')
  public readonly status?: number;         // HTTP status code
  public readonly details?: unknown;       // Additional error details
  public readonly traceId?: string;        // Request trace ID
  public readonly isNetworkError: boolean; // Network error flag
  public readonly isServerError: boolean;  // Server error (5xx) flag
  public readonly isValidationError: boolean; // Validation error (400) flag
}
```

---

### 2. BaseApiService (`core/BaseApiService.ts`)

**Purpose**: Abstract base class providing type-safe CRUD operations for all domain services.

**Responsibilities**:
- CRUD operations (Create, Read, Update, Delete)
- Search and filtering
- Bulk operations
- Input validation with Zod schemas
- Data extraction and transformation
- Query parameter building

**Type Parameters**:

```typescript
class BaseApiService<
  TEntity extends BaseEntity,         // Entity type (e.g., Student)
  TCreateDto = Partial<TEntity>,      // Create DTO type
  TUpdateDto = Partial<TCreateDto>    // Update DTO type
>
```

**Core Operations**:

```typescript
// Read Operations
public async getAll(filters?: FilterParams): Promise<PaginatedResponse<TEntity>>
public async getById(id: string): Promise<TEntity>
public async search(query: string, filters?: FilterParams): Promise<PaginatedResponse<TEntity>>

// Write Operations
public async create(data: TCreateDto): Promise<TEntity>
public async update(id: string, data: TUpdateDto): Promise<TEntity>
public async patch(id: string, data: Partial<TUpdateDto>): Promise<TEntity>
public async delete(id: string): Promise<void>

// Bulk Operations
public async bulkCreate(data: TCreateDto[]): Promise<TEntity[]>
public async bulkUpdate(updates: Array<{ id: string; data: TUpdateDto }>): Promise<TEntity[]>
public async bulkDelete(ids: string[]): Promise<void>

// Export/Import
public async export(format: 'csv' | 'json' | 'pdf', filters?: FilterParams): Promise<Blob>
public async import(file: File): Promise<{ imported: number; errors: unknown[] }>
```

**Protected Utilities**:

```typescript
// Data extraction
protected extractData<T>(response: ApiResponse<T>): T

// Query building
protected buildQueryParams(params?: FilterParams): string
protected buildEndpoint(path: string): string

// Validation
protected validateId(id: string): void
protected validateCreateData(data: TCreateDto): void
protected validateUpdateData(data: TUpdateDto): void

// Custom requests
protected async get<T>(endpoint: string, params?: FilterParams): Promise<T>
protected async post<T>(endpoint: string, data?: unknown): Promise<T>
protected async put<T>(endpoint: string, data?: unknown): Promise<T>
protected async patchRequest<T>(endpoint: string, data?: unknown): Promise<T>
protected async deleteRequest<T>(endpoint: string): Promise<T>
```

**Usage Example**:

```typescript
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

  // Add custom operations
  public async getAssignedStudents(nurseId: string): Promise<Student[]> {
    return this.get<Student[]>(`${this.baseEndpoint}/assigned/${nurseId}`);
  }

  public async transferStudent(studentId: string, newSchoolId: string): Promise<Student> {
    return this.post<Student>(
      `${this.baseEndpoint}/${studentId}/transfer`,
      { newSchoolId }
    );
  }
}
```

---

### 3. QueryHooksFactory (`core/QueryHooksFactory.ts`)

**Purpose**: Generate type-safe TanStack Query hooks for React components.

**Responsibilities**:
- Create query hooks (useList, useDetail, useSearch)
- Create mutation hooks (useCreate, useUpdate, useDelete)
- Manage query keys and cache invalidation
- Implement optimistic updates
- Handle loading and error states

**Configuration**:

```typescript
interface QueryHooksConfig<TEntity extends BaseEntity> {
  queryKey: QueryKey;                      // Base query key (e.g., ['students'])
  staleTime?: number;                      // Default: 5 minutes
  gcTime?: number;                         // Default: 10 minutes
  refetchOnWindowFocus?: boolean;          // Default: false
  refetchOnReconnect?: boolean;            // Default: true
  retry?: number | boolean;                // Default: 1
  onError?: (error: ApiClientError) => void; // Custom error handler
  enableOptimisticUpdates?: boolean;       // Default: true
  keySerializer?: (key: unknown) => string; // Custom key serialization
}
```

**Generated Hooks**:

```typescript
// Query Hooks
const factory = createQueryHooks(studentService, config);

factory.useList(options?: ListQueryOptions<Student>)
  → UseQueryResult<PaginatedResponse<Student>, ApiClientError>

factory.useDetail(options: DetailQueryOptions<Student>)
  → UseQueryResult<Student, ApiClientError>

factory.useSearch(options: SearchQueryOptions<Student>)
  → UseQueryResult<PaginatedResponse<Student>, ApiClientError>

// Mutation Hooks
factory.useCreate(options?: CreateMutationOptions<CreateStudentDto, Student>)
  → UseMutationResult<Student, ApiClientError, CreateStudentDto>

factory.useUpdate(options?: UpdateMutationOptions<UpdateStudentDto, Student>)
  → UseMutationResult<Student, ApiClientError, { id: string; data: UpdateStudentDto }>

factory.useDelete(options?: DeleteMutationOptions)
  → UseMutationResult<void, ApiClientError, string>

factory.useBulkCreate(options?: BulkMutationOptions<CreateStudentDto[], Student[]>)
  → UseMutationResult<Student[], ApiClientError, CreateStudentDto[]>

factory.useBulkDelete(options?: BulkMutationOptions<string[], void>)
  → UseMutationResult<void, ApiClientError, string[]>
```

**Cache Key Structure**:

```typescript
// Base key
['students']

// List queries
['students', 'list']                           // All students
['students', 'list', { status: 'active' }]     // Filtered students

// Detail queries
['students', 'detail', '123']                  // Specific student

// Search queries
['students', 'search', { query: 'John', filters: {...} }]
```

---

## Data Flow

### Read Operation Flow

```
1. Component renders
   ↓
2. useList() hook invoked
   ↓
3. TanStack Query checks cache
   ├─ Cache hit (fresh) → Return cached data
   └─ Cache miss/stale  → Continue to step 4
   ↓
4. service.getAll() called
   ↓
5. BaseApiService.buildQueryParams()
   ↓
6. client.get('/api/students?page=1&limit=10')
   ↓
7. Request interceptor adds auth token
   ↓
8. HTTP request sent to backend
   ↓
9. Backend processes request
   ↓
10. Response interceptor validates response
    ↓
11. BaseApiService.extractData()
    ↓
12. TanStack Query caches result
    ↓
13. Component re-renders with data
```

### Write Operation Flow (with Optimistic Updates)

```
1. User triggers mutation (e.g., update student)
   ↓
2. useUpdate() mutation invoked
   ↓
3. onMutate: Optimistic update
   ├─ Cancel ongoing queries
   ├─ Snapshot current data
   └─ Update cache with optimistic data
   ↓
4. Component re-renders with optimistic data (instant feedback)
   ↓
5. service.update() called
   ↓
6. BaseApiService.validateUpdateData()
   ↓
7. client.put('/api/students/123', data)
   ↓
8. HTTP request sent to backend
   ↓
9. Backend validates and updates database
   ↓
10a. SUCCESS:
     ├─ onSuccess callback
     ├─ Invalidate related queries
     ├─ Update cache with server response
     └─ Component re-renders with confirmed data
   ↓
10b. ERROR:
     ├─ onError callback
     ├─ Rollback optimistic update (restore snapshot)
     ├─ Display error message
     └─ Component re-renders with rolled-back data
```

---

## Service Lifecycle

### Initialization

```typescript
// 1. Create ApiClient singleton
const apiClient = new ApiClient({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  enableLogging: import.meta.env.DEV
});

// 2. Create domain service
const studentService = new StudentService(apiClient);

// 3. Create query hooks factory
const studentHooks = createQueryHooks(studentService, {
  queryKey: ['students'],
  staleTime: 5 * 60 * 1000
});

// 4. Export for use in components
export { studentService, studentHooks };
```

### Component Usage

```typescript
function StudentList() {
  // Query hook manages entire lifecycle
  const {
    data,        // PaginatedResponse<Student> | undefined
    isLoading,   // boolean
    isError,     // boolean
    error,       // ApiClientError | null
    refetch      // () => Promise<...>
  } = studentHooks.useList({
    filters: { status: 'active', grade: 10 }
  });

  // Mutation hook for updates
  const updateStudent = studentHooks.useUpdate({
    optimistic: true,
    onSuccess: () => toast.success('Student updated'),
    onError: (error) => toast.error(error.message)
  });

  // Render based on state
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage error={error} />;

  return <StudentTable students={data.data} />;
}
```

### Cleanup

TanStack Query automatically handles cleanup:
- Unused queries removed after `gcTime`
- Component unmount cancels pending requests
- Cache invalidation removes stale data

---

## Extension Guidelines

### Adding a New Service

**Step 1: Define types**

```typescript
// types.ts
export interface MyEntity extends BaseEntity {
  id: string;
  name: string;
  // ... other fields
}

export interface CreateMyEntityDto {
  name: string;
  // ... required fields
}

export type UpdateMyEntityDto = Partial<CreateMyEntityDto>;
```

**Step 2: Create Zod schemas (optional but recommended)**

```typescript
// schemas.ts
import { z } from 'zod';

export const createMyEntitySchema = z.object({
  name: z.string().min(1).max(100),
  // ... validation rules
});

export const updateMyEntitySchema = createMyEntitySchema.partial();
```

**Step 3: Create service class**

```typescript
// MyEntityService.ts
import { BaseApiService } from '@/services/core';
import { ApiClient } from '@/services/core';
import { MyEntity, CreateMyEntityDto, UpdateMyEntityDto } from './types';
import { createMyEntitySchema, updateMyEntitySchema } from './schemas';

export class MyEntityService extends BaseApiService<
  MyEntity,
  CreateMyEntityDto,
  UpdateMyEntityDto
> {
  constructor(client: ApiClient) {
    super(client, '/api/v1/my-entities', {
      createSchema: createMyEntitySchema,
      updateSchema: updateMyEntitySchema
    });
  }

  // Add custom operations
  public async customOperation(id: string, param: string): Promise<MyEntity> {
    return this.post<MyEntity>(
      `${this.baseEndpoint}/${id}/custom`,
      { param }
    );
  }
}
```

**Step 4: Create hooks factory**

```typescript
// hooks.ts
import { createQueryHooks } from '@/services/core';
import { apiClient } from '@/services/config/apiConfig';
import { MyEntityService } from './MyEntityService';

const myEntityService = new MyEntityService(apiClient);

export const myEntityHooks = createQueryHooks(myEntityService, {
  queryKey: ['my-entities'],
  staleTime: 5 * 60 * 1000,
  enableOptimisticUpdates: true
});

export { myEntityService };
```

**Step 5: Export from services index**

```typescript
// services/index.ts
export { myEntityService, myEntityHooks } from './modules/myEntityApi';
export type { MyEntity, CreateMyEntityDto, UpdateMyEntityDto } from './modules/myEntityApi';
```

---

## Best Practices

### 1. Type Safety

```typescript
// ✅ Good: Full type safety
interface Student extends BaseEntity {
  firstName: string;
  lastName: string;
}

const student: Student = await studentService.getById('123');

// ❌ Bad: Any types
const student: any = await fetch('/api/students/123');
```

### 2. Error Handling

```typescript
// ✅ Good: Structured error handling
const mutation = studentHooks.useCreate({
  onError: (error: ApiClientError) => {
    if (error.isValidationError) {
      toast.error(`Validation failed: ${error.message}`);
    } else if (error.isNetworkError) {
      toast.error('Network error. Please try again.');
    } else {
      toast.error('An unexpected error occurred.');
    }
  }
});

// ❌ Bad: Generic error handling
.catch((error) => {
  console.error(error);
  alert('Error!');
});
```

### 3. Query Keys

```typescript
// ✅ Good: Use factory methods
const queryKey = studentHooks.getListQueryKey({ status: 'active' });
queryClient.invalidateQueries({ queryKey });

// ❌ Bad: Manual query keys (error-prone)
queryClient.invalidateQueries({ queryKey: ['students', 'list', { status: 'active' }] });
```

### 4. Optimistic Updates

```typescript
// ✅ Good: Use built-in optimistic updates
const updateMutation = studentHooks.useUpdate({
  optimistic: true  // Automatic rollback on error
});

// ❌ Bad: Manual optimistic update management
const mutation = useMutation({
  mutationFn: updateStudent,
  onMutate: async (newData) => {
    // Complex manual implementation...
  }
});
```

### 5. Loading States

```typescript
// ✅ Good: Leverage query states
const { data, isLoading, isFetching, isError, error } = studentHooks.useList();

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorAlert error={error} />;

return (
  <>
    {isFetching && <RefreshIndicator />}
    <StudentTable data={data.data} />
  </>
);

// ❌ Bad: Manual loading state
const [loading, setLoading] = useState(false);
useEffect(() => {
  setLoading(true);
  fetchStudents().finally(() => setLoading(false));
}, []);
```

---

## Anti-Patterns

### 1. Direct Axios Usage in Components

```typescript
// ❌ BAD
function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('/api/students').then(res => setStudents(res.data));
  }, []);
}

// ✅ GOOD
function StudentList() {
  const { data: students } = studentHooks.useList();
}
```

### 2. Bypassing Service Layer

```typescript
// ❌ BAD
const { data } = useQuery(['students'], () =>
  axios.get('/api/students').then(res => res.data)
);

// ✅ GOOD
const { data } = studentHooks.useList();
```

### 3. Inconsistent Query Keys

```typescript
// ❌ BAD
useQuery(['students'], ...);
useQuery(['student-list'], ...);
useQuery(['allStudents'], ...);

// ✅ GOOD
studentHooks.useList();  // Consistent key: ['students', 'list']
```

### 4. Manual Cache Invalidation

```typescript
// ❌ BAD
queryClient.invalidateQueries(['students']);
queryClient.invalidateQueries(['students', id]);

// ✅ GOOD
studentHooks.useUpdate({
  invalidateQueries: true  // Automatic
});
```

### 5. Ignoring Error Types

```typescript
// ❌ BAD
.catch(() => alert('Error'));

// ✅ GOOD
onError: (error: ApiClientError) => {
  if (error.isNetworkError) handleNetworkError();
  else if (error.isValidationError) handleValidationError(error);
  else handleUnknownError(error);
}
```

---

## Diagram: Component Integration

```
┌─────────────────────────────────────────────────────────────┐
│                     StudentListPage.tsx                     │
│                                                             │
│  function StudentListPage() {                              │
│    const { data, isLoading } = studentHooks.useList({     │
│      filters: { status: 'active' }                        │
│    });                                                     │
│                                                             │
│    const createStudent = studentHooks.useCreate({         │
│      onSuccess: () => toast.success('Created!')           │
│    });                                                     │
│                                                             │
│    return (                                                │
│      <StudentTable                                         │
│        students={data?.data}                              │
│        onCreate={createStudent.mutate}                    │
│      />                                                    │
│    );                                                      │
│  }                                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Uses hooks from
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    studentHooks Instance                    │
│                                                             │
│  Created via: createQueryHooks(studentService, {           │
│    queryKey: ['students'],                                 │
│    staleTime: 5 * 60 * 1000                               │
│  });                                                       │
│                                                             │
│  Provides:                                                 │
│  - useList()     → Fetches paginated students             │
│  - useDetail()   → Fetches single student                 │
│  - useCreate()   → Creates new student                    │
│  - useUpdate()   → Updates existing student               │
│  - useDelete()   → Deletes student                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Calls methods from
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   studentService Instance                   │
│                                                             │
│  class StudentService extends BaseApiService {             │
│    constructor(client: ApiClient) {                        │
│      super(client, '/api/v1/students');                   │
│    }                                                       │
│                                                             │
│    // Inherits all CRUD operations                        │
│    // Plus custom operations:                             │
│    async getAssignedStudents(nurseId) { ... }             │
│  }                                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Uses for HTTP
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    apiClient Singleton                      │
│                                                             │
│  const apiClient = new ApiClient({                         │
│    baseURL: 'http://localhost:3001/api',                  │
│    timeout: 30000                                          │
│  });                                                       │
│                                                             │
│  Responsibilities:                                         │
│  - Add auth tokens                                        │
│  - Handle token refresh                                   │
│  - Retry failed requests                                  │
│  - Normalize errors                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary

The services architecture provides a robust, type-safe, and maintainable foundation for all frontend-backend communication. By following the established patterns and guidelines, developers can:

- Build features faster with less boilerplate
- Ensure HIPAA compliance through built-in security features
- Maintain consistency across the entire application
- Scale the application with confidence

For implementation details, see:
- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Testing Guide](./TESTING.md)

---

*Last Updated: October 21, 2025*
*Version: 2.0.0*
