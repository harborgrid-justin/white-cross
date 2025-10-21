# API Integration Guide

**Version:** 2.0.0
**Last Updated:** October 21, 2025
**Audience:** Frontend Developers

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Creating New API Services](#creating-new-api-services)
3. [BaseApiService Deep Dive](#baseapiservice-deep-dive)
4. [QueryHooksFactory Integration](#queryhooksfactory-integration)
5. [Advanced Patterns](#advanced-patterns)
6. [Error Handling](#error-handling)
7. [Testing Strategies](#testing-strategies)
8. [Common Scenarios](#common-scenarios)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Using an Existing Service

```typescript
import { studentHooks } from '@/services';

function StudentList() {
  // Fetch paginated list
  const { data, isLoading, error } = studentHooks.useList({
    filters: { status: 'active', grade: 10 }
  });

  // Create mutation
  const createStudent = studentHooks.useCreate({
    onSuccess: () => console.log('Student created!'),
    onError: (error) => console.error(error.message)
  });

  // Update mutation with optimistic updates
  const updateStudent = studentHooks.useUpdate({
    optimistic: true
  });

  // Delete mutation
  const deleteStudent = studentHooks.useDelete();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <div>
      <StudentTable students={data.data} />
      <CreateStudentForm onSubmit={createStudent.mutate} />
    </div>
  );
}
```

---

## Creating New API Services

### Step-by-Step Guide

#### 1. Define Types

Create a types file for your domain entity:

```typescript
// services/modules/appointments/types.ts
import { BaseEntity } from '@/services/core';

/**
 * Appointment entity returned from API
 */
export interface Appointment extends BaseEntity {
  id: string;
  studentId: string;
  providerId: string;
  appointmentType: 'checkup' | 'vaccination' | 'consultation' | 'emergency';
  scheduledAt: string;
  duration: number; // minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  reminderSent: boolean;

  // Relations (optional, may be populated)
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };

  provider?: {
    id: string;
    name: string;
    specialty: string;
  };

  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for creating new appointments
 */
export interface CreateAppointmentDto {
  studentId: string;
  providerId: string;
  appointmentType: Appointment['appointmentType'];
  scheduledAt: string; // ISO 8601 format
  duration: number;
  notes?: string;
}

/**
 * DTO for updating appointments
 */
export interface UpdateAppointmentDto {
  providerId?: string;
  appointmentType?: Appointment['appointmentType'];
  scheduledAt?: string;
  duration?: number;
  status?: Appointment['status'];
  notes?: string;
}

/**
 * Filters for appointment queries
 */
export interface AppointmentFilters {
  studentId?: string;
  providerId?: string;
  appointmentType?: Appointment['appointmentType'];
  status?: Appointment['status'];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
```

#### 2. Create Zod Validation Schemas (Recommended)

```typescript
// services/modules/appointments/schemas.ts
import { z } from 'zod';

export const createAppointmentSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  providerId: z.string().uuid('Invalid provider ID'),
  appointmentType: z.enum(['checkup', 'vaccination', 'consultation', 'emergency']),
  scheduledAt: z.string().datetime('Invalid date format'),
  duration: z.number().min(15).max(240, 'Duration must be between 15 and 240 minutes'),
  notes: z.string().max(1000, 'Notes too long').optional()
});

export const updateAppointmentSchema = z.object({
  providerId: z.string().uuid().optional(),
  appointmentType: z.enum(['checkup', 'vaccination', 'consultation', 'emergency']).optional(),
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().min(15).max(240).optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'no-show']).optional(),
  notes: z.string().max(1000).optional()
});
```

#### 3. Create Service Class

```typescript
// services/modules/appointments/AppointmentService.ts
import { BaseApiService } from '@/services/core';
import { ApiClient } from '@/services/core';
import {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentFilters
} from './types';
import { createAppointmentSchema, updateAppointmentSchema } from './schemas';

export class AppointmentService extends BaseApiService<
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto
> {
  constructor(client: ApiClient) {
    super(client, '/api/v1/appointments', {
      createSchema: createAppointmentSchema,
      updateSchema: updateAppointmentSchema
    });
  }

  /**
   * Get appointments for a specific student
   */
  public async getStudentAppointments(
    studentId: string,
    filters?: Omit<AppointmentFilters, 'studentId'>
  ): Promise<Appointment[]> {
    const params = this.buildQueryParams({ ...filters, studentId });
    return this.get<Appointment[]>(`${this.baseEndpoint}/student/${studentId}${params}`);
  }

  /**
   * Get appointments for a specific provider
   */
  public async getProviderAppointments(
    providerId: string,
    filters?: Omit<AppointmentFilters, 'providerId'>
  ): Promise<Appointment[]> {
    const params = this.buildQueryParams({ ...filters, providerId });
    return this.get<Appointment[]>(`${this.baseEndpoint}/provider/${providerId}${params}`);
  }

  /**
   * Get today's appointments
   */
  public async getTodayAppointments(): Promise<Appointment[]> {
    return this.get<Appointment[]>(`${this.baseEndpoint}/today`);
  }

  /**
   * Get upcoming appointments (next 7 days)
   */
  public async getUpcomingAppointments(): Promise<Appointment[]> {
    return this.get<Appointment[]>(`${this.baseEndpoint}/upcoming`);
  }

  /**
   * Cancel an appointment
   */
  public async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    return this.post<Appointment>(`${this.baseEndpoint}/${id}/cancel`, { reason });
  }

  /**
   * Mark appointment as completed
   */
  public async completeAppointment(
    id: string,
    notes?: string
  ): Promise<Appointment> {
    return this.post<Appointment>(`${this.baseEndpoint}/${id}/complete`, { notes });
  }

  /**
   * Reschedule appointment
   */
  public async rescheduleAppointment(
    id: string,
    newDateTime: string
  ): Promise<Appointment> {
    return this.post<Appointment>(`${this.baseEndpoint}/${id}/reschedule`, {
      scheduledAt: newDateTime
    });
  }

  /**
   * Send appointment reminder
   */
  public async sendReminder(id: string): Promise<{ sent: boolean; message: string }> {
    return this.post<{ sent: boolean; message: string }>(
      `${this.baseEndpoint}/${id}/reminder`
    );
  }

  /**
   * Get appointment statistics
   */
  public async getStatistics(filters?: AppointmentFilters): Promise<{
    total: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    noShow: number;
    byType: Record<string, number>;
  }> {
    const params = this.buildQueryParams(filters);
    return this.get<any>(`${this.baseEndpoint}/statistics${params}`);
  }
}
```

#### 4. Create Query Hooks Factory

```typescript
// services/modules/appointments/hooks.ts
import { createQueryHooks } from '@/services/core';
import { apiClient } from '@/services/config/apiConfig';
import { AppointmentService } from './AppointmentService';
import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions
} from '@tanstack/react-query';
import type { Appointment, CreateAppointmentDto, UpdateAppointmentDto } from './types';

// Create service instance
const appointmentService = new AppointmentService(apiClient);

// Create standard CRUD hooks
export const appointmentHooks = createQueryHooks(appointmentService, {
  queryKey: ['appointments'],
  staleTime: 2 * 60 * 1000, // 2 minutes (appointments change frequently)
  gcTime: 5 * 60 * 1000,    // 5 minutes
  enableOptimisticUpdates: true,
  onError: (error) => {
    console.error('[Appointments] Error:', error.message);
  }
});

// Custom hooks for domain-specific operations

/**
 * Hook for fetching student appointments
 */
export function useStudentAppointments(
  studentId: string,
  options?: UseQueryOptions<Appointment[]>
) {
  return useQuery<Appointment[]>({
    queryKey: ['appointments', 'student', studentId],
    queryFn: () => appointmentService.getStudentAppointments(studentId),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000,
    ...options
  });
}

/**
 * Hook for fetching provider appointments
 */
export function useProviderAppointments(
  providerId: string,
  options?: UseQueryOptions<Appointment[]>
) {
  return useQuery<Appointment[]>({
    queryKey: ['appointments', 'provider', providerId],
    queryFn: () => appointmentService.getProviderAppointments(providerId),
    enabled: !!providerId,
    staleTime: 2 * 60 * 1000,
    ...options
  });
}

/**
 * Hook for today's appointments
 */
export function useTodayAppointments(
  options?: UseQueryOptions<Appointment[]>
) {
  return useQuery<Appointment[]>({
    queryKey: ['appointments', 'today'],
    queryFn: () => appointmentService.getTodayAppointments(),
    staleTime: 1 * 60 * 1000, // 1 minute (very dynamic)
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    ...options
  });
}

/**
 * Hook for upcoming appointments
 */
export function useUpcomingAppointments(
  options?: UseQueryOptions<Appointment[]>
) {
  return useQuery<Appointment[]>({
    queryKey: ['appointments', 'upcoming'],
    queryFn: () => appointmentService.getUpcomingAppointments(),
    staleTime: 5 * 60 * 1000,
    ...options
  });
}

/**
 * Hook for cancelling appointments
 */
export function useCancelAppointment(
  options?: UseMutationOptions<Appointment, Error, { id: string; reason?: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<Appointment, Error, { id: string; reason?: string }>({
    mutationFn: ({ id, reason }) => appointmentService.cancelAppointment(id, reason),
    onSuccess: (data) => {
      // Invalidate all appointment queries
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      options?.onSuccess?.(data, { id: data.id }, undefined);
    },
    ...options
  });
}

/**
 * Hook for completing appointments
 */
export function useCompleteAppointment(
  options?: UseMutationOptions<Appointment, Error, { id: string; notes?: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<Appointment, Error, { id: string; notes?: string }>({
    mutationFn: ({ id, notes }) => appointmentService.completeAppointment(id, notes),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      options?.onSuccess?.(data, { id: data.id }, undefined);
    },
    ...options
  });
}

/**
 * Hook for rescheduling appointments
 */
export function useRescheduleAppointment(
  options?: UseMutationOptions<Appointment, Error, { id: string; newDateTime: string }>
) {
  const queryClient = useQueryClient();

  return useMutation<Appointment, Error, { id: string; newDateTime: string }>({
    mutationFn: ({ id, newDateTime }) =>
      appointmentService.rescheduleAppointment(id, newDateTime),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      options?.onSuccess?.(data, { id: data.id, newDateTime: data.scheduledAt }, undefined);
    },
    ...options
  });
}

/**
 * Hook for appointment statistics
 */
export function useAppointmentStatistics(
  filters?: any,
  options?: UseQueryOptions<any>
) {
  return useQuery({
    queryKey: ['appointments', 'statistics', filters],
    queryFn: () => appointmentService.getStatistics(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options
  });
}

// Export service for direct access if needed
export { appointmentService };
```

#### 5. Export from Module Index

```typescript
// services/modules/appointments/index.ts
export { AppointmentService } from './AppointmentService';
export {
  appointmentService,
  appointmentHooks,
  useStudentAppointments,
  useProviderAppointments,
  useTodayAppointments,
  useUpcomingAppointments,
  useCancelAppointment,
  useCompleteAppointment,
  useRescheduleAppointment,
  useAppointmentStatistics
} from './hooks';

export type {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentFilters
} from './types';
```

#### 6. Export from Services Index

```typescript
// services/index.ts
export {
  appointmentService,
  appointmentHooks,
  useStudentAppointments,
  useProviderAppointments,
  useTodayAppointments,
  useUpcomingAppointments,
  useCancelAppointment,
  useCompleteAppointment,
  useRescheduleAppointment,
  useAppointmentStatistics
} from './modules/appointments';

export type {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentFilters
} from './modules/appointments';
```

---

## BaseApiService Deep Dive

### Method Reference

#### Read Operations

```typescript
/**
 * Get all entities with pagination and filtering
 */
public async getAll(filters?: FilterParams): Promise<PaginatedResponse<TEntity>>

// Example
const students = await studentService.getAll({
  page: 1,
  limit: 20,
  sort: 'lastName',
  order: 'asc',
  status: 'active'
});
// Returns: { data: [...], pagination: { page, limit, total, ... } }
```

```typescript
/**
 * Get single entity by ID
 */
public async getById(id: string): Promise<TEntity>

// Example
const student = await studentService.getById('uuid-123');
// Returns: { id: 'uuid-123', firstName: 'John', ... }
```

```typescript
/**
 * Search entities with query string
 */
public async search(query: string, filters?: FilterParams): Promise<PaginatedResponse<TEntity>>

// Example
const results = await studentService.search('john', {
  grade: 10,
  page: 1,
  limit: 10
});
```

#### Write Operations

```typescript
/**
 * Create new entity
 */
public async create(data: TCreateDto): Promise<TEntity>

// Example
const newStudent = await studentService.create({
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '2010-05-15',
  grade: 5
});
```

```typescript
/**
 * Update entity (full update)
 */
public async update(id: string, data: TUpdateDto): Promise<TEntity>

// Example
const updated = await studentService.update('uuid-123', {
  grade: 6,
  homeroom: 'Room 101'
});
```

```typescript
/**
 * Patch entity (partial update)
 */
public async patch(id: string, data: Partial<TUpdateDto>): Promise<TEntity>

// Example
const patched = await studentService.patch('uuid-123', {
  homeroom: 'Room 102'  // Only update homeroom
});
```

```typescript
/**
 * Delete entity
 */
public async delete(id: string): Promise<void>

// Example
await studentService.delete('uuid-123');
```

#### Bulk Operations

```typescript
/**
 * Bulk create entities
 */
public async bulkCreate(data: TCreateDto[]): Promise<TEntity[]>

// Example
const newStudents = await studentService.bulkCreate([
  { firstName: 'John', lastName: 'Doe', ... },
  { firstName: 'Jane', lastName: 'Smith', ... }
]);
```

```typescript
/**
 * Bulk update entities
 */
public async bulkUpdate(
  updates: Array<{ id: string; data: TUpdateDto }>
): Promise<TEntity[]>

// Example
const updated = await studentService.bulkUpdate([
  { id: 'uuid-1', data: { grade: 6 } },
  { id: 'uuid-2', data: { grade: 7 } }
]);
```

```typescript
/**
 * Bulk delete entities
 */
public async bulkDelete(ids: string[]): Promise<void>

// Example
await studentService.bulkDelete(['uuid-1', 'uuid-2', 'uuid-3']);
```

#### Export/Import Operations

```typescript
/**
 * Export entities to file
 */
public async export(
  format: 'csv' | 'json' | 'pdf' = 'json',
  filters?: FilterParams
): Promise<Blob>

// Example
const blob = await studentService.export('csv', {
  status: 'active',
  grade: 10
});
const url = URL.createObjectURL(blob);
// Trigger download...
```

```typescript
/**
 * Import entities from file
 */
public async import(file: File): Promise<{ imported: number; errors: unknown[] }>

// Example
const result = await studentService.import(file);
console.log(`Imported ${result.imported} students`);
if (result.errors.length > 0) {
  console.error('Import errors:', result.errors);
}
```

### Protected Utilities for Subclasses

```typescript
/**
 * Build query parameter string
 */
protected buildQueryParams(params?: FilterParams): string

// Example usage in subclass
public async getActiveStudents(): Promise<Student[]> {
  const params = this.buildQueryParams({ status: 'active' });
  return this.get<Student[]>(`${this.baseEndpoint}${params}`);
}
```

```typescript
/**
 * Execute custom GET request
 */
protected async get<T>(endpoint: string, params?: FilterParams): Promise<T>

// Example
protected async getCustomData(): Promise<CustomData> {
  return this.get<CustomData>('/api/custom-endpoint', { filter: 'value' });
}
```

```typescript
/**
 * Execute custom POST request
 */
protected async post<T>(endpoint: string, data?: unknown): Promise<T>

// Example
public async customAction(id: string, payload: any): Promise<Result> {
  return this.post<Result>(`${this.baseEndpoint}/${id}/action`, payload);
}
```

---

## QueryHooksFactory Integration

### Configuration Options

```typescript
interface QueryHooksConfig<TEntity extends BaseEntity> {
  // Required: Base query key for this resource
  queryKey: QueryKey;  // Example: ['students']

  // Optional: Cache configuration
  staleTime?: number;              // How long data is considered fresh (default: 5min)
  gcTime?: number;                 // Garbage collection time (default: 10min)
  refetchOnWindowFocus?: boolean;  // Refetch on window focus (default: false)
  refetchOnReconnect?: boolean;    // Refetch on reconnect (default: true)
  retry?: number | boolean;        // Retry failed requests (default: 1)

  // Optional: Error handling
  onError?: (error: ApiClientError) => void;

  // Optional: Optimistic updates
  enableOptimisticUpdates?: boolean;  // Default: true

  // Optional: Custom key serialization
  keySerializer?: (key: unknown) => string;
}
```

### Generated Hook Options

```typescript
// List hook options
interface ListQueryOptions<TEntity> {
  filters?: FilterParams;        // Query filters
  enabled?: boolean;             // Enable/disable query
  staleTime?: number;            // Override default stale time
  gcTime?: number;               // Override default gc time
  refetchInterval?: number;      // Auto-refetch interval
  onSuccess?: (data: PaginatedResponse<TEntity>) => void;
  onError?: (error: ApiClientError) => void;
}

// Detail hook options
interface DetailQueryOptions<TEntity> {
  id: string;                    // Entity ID (required)
  enabled?: boolean;             // Enable/disable query
  staleTime?: number;
  gcTime?: number;
  onSuccess?: (data: TEntity) => void;
  onError?: (error: ApiClientError) => void;
}

// Create mutation options
interface CreateMutationOptions<TCreate, TEntity> {
  invalidateList?: boolean;      // Invalidate list queries (default: true)
  optimistic?: boolean;          // Enable optimistic updates (default: false)
  onSuccess?: (data: TEntity, variables: TCreate) => void;
  onError?: (error: ApiClientError, variables: TCreate) => void;
  onMutate?: (variables: TCreate) => void;
  onSettled?: (data: TEntity | undefined, error: ApiClientError | null) => void;
}

// Update mutation options
interface UpdateMutationOptions<TUpdate, TEntity> {
  invalidateQueries?: boolean;   // Invalidate queries (default: true)
  optimistic?: boolean;          // Enable optimistic updates (default: true)
  onSuccess?: (data: TEntity, variables: { id: string; data: TUpdate }) => void;
  onError?: (error: ApiClientError, variables: { id: string; data: TUpdate }) => void;
}

// Delete mutation options
interface DeleteMutationOptions {
  invalidateQueries?: boolean;   // Invalidate queries (default: true)
  optimistic?: boolean;          // Enable optimistic updates (default: true)
  onSuccess?: (data: void, id: string) => void;
  onError?: (error: ApiClientError, id: string) => void;
}
```

### Usage Examples

```typescript
// Basic list query
const { data, isLoading } = appointmentHooks.useList();

// List query with filters
const { data } = appointmentHooks.useList({
  filters: {
    status: 'scheduled',
    startDate: '2025-01-01',
    page: 1,
    limit: 20
  }
});

// Detail query
const { data: appointment } = appointmentHooks.useDetail({
  id: appointmentId,
  enabled: !!appointmentId  // Only fetch if ID exists
});

// Search query
const { data: results } = appointmentHooks.useSearch({
  query: searchTerm,
  minQueryLength: 3,  // Only search if >= 3 characters
  filters: { status: 'scheduled' }
});

// Create mutation
const createAppointment = appointmentHooks.useCreate({
  onSuccess: (newAppointment) => {
    toast.success('Appointment created!');
    navigate(`/appointments/${newAppointment.id}`);
  },
  onError: (error) => {
    toast.error(error.message);
  }
});

// Update mutation with optimistic updates
const updateAppointment = appointmentHooks.useUpdate({
  optimistic: true,  // UI updates immediately
  onSuccess: () => toast.success('Appointment updated!'),
  onError: (error) => toast.error(`Update failed: ${error.message}`)
});

// Delete mutation
const deleteAppointment = appointmentHooks.useDelete({
  onSuccess: () => {
    toast.success('Appointment deleted');
    navigate('/appointments');
  }
});
```

---

## Advanced Patterns

### Custom Query Keys

```typescript
// Get query key for manual cache manipulation
const listKey = appointmentHooks.getListQueryKey({ status: 'scheduled' });
const detailKey = appointmentHooks.getDetailQueryKey('uuid-123');

// Manually invalidate specific queries
queryClient.invalidateQueries({ queryKey: listKey });

// Manually update cache
queryClient.setQueryData(detailKey, updatedAppointment);
```

### Prefetching Data

```typescript
import { useQueryClient } from '@tanstack/react-query';

function AppointmentCard({ appointmentId }: { appointmentId: string }) {
  const queryClient = useQueryClient();

  // Prefetch appointment details on hover
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: appointmentHooks.getDetailQueryKey(appointmentId),
      queryFn: () => appointmentService.getById(appointmentId)
    });
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      {/* Card content */}
    </div>
  );
}
```

### Dependent Queries

```typescript
function AppointmentDetails({ appointmentId }: { appointmentId: string }) {
  // First, fetch the appointment
  const { data: appointment } = appointmentHooks.useDetail({
    id: appointmentId
  });

  // Then, fetch the student (dependent on appointment)
  const { data: student } = studentHooks.useDetail({
    id: appointment?.studentId || '',
    enabled: !!appointment?.studentId  // Only run if we have studentId
  });

  return (
    <div>
      <h1>Appointment for {student?.firstName} {student?.lastName}</h1>
      {/* ... */}
    </div>
  );
}
```

### Infinite Queries

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

function useInfiniteAppointments(filters: AppointmentFilters) {
  return useInfiniteQuery({
    queryKey: ['appointments', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      appointmentService.getAll({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1
  });
}

function InfiniteAppointmentList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteAppointments({ status: 'scheduled' });

  return (
    <div>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.data.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </React.Fragment>
      ))}

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
}
```

### Polling / Auto-Refresh

```typescript
// Auto-refresh every 30 seconds
const { data } = useTodayAppointments({
  refetchInterval: 30 * 1000,  // 30 seconds
  refetchIntervalInBackground: false  // Don't refetch when tab is hidden
});
```

### Mutation with Side Effects

```typescript
const completeAppointment = useCompleteAppointment({
  onMutate: async ({ id }) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['appointments'] });

    // Snapshot previous value
    const previous = queryClient.getQueryData(['appointments', 'detail', id]);

    // Optimistically update
    queryClient.setQueryData(['appointments', 'detail', id], (old: any) => ({
      ...old,
      status: 'completed'
    }));

    return { previous };
  },
  onError: (error, variables, context) => {
    // Rollback on error
    if (context?.previous) {
      queryClient.setQueryData(
        ['appointments', 'detail', variables.id],
        context.previous
      );
    }
    toast.error(error.message);
  },
  onSuccess: (data, variables) => {
    // Invalidate and refetch related queries
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
    queryClient.invalidateQueries({ queryKey: ['students', 'detail', data.studentId] });

    toast.success('Appointment completed!');
  }
});
```

---

## Error Handling

### ApiClientError Structure

```typescript
interface ApiClientError extends Error {
  message: string;                  // Human-readable error message
  code?: string;                    // Error code (e.g., 'NETWORK_ERROR', 'VALIDATION_ERROR')
  status?: number;                  // HTTP status code (e.g., 400, 404, 500)
  details?: unknown;                // Additional error details
  traceId?: string;                 // Request trace ID for debugging
  isNetworkError: boolean;          // True if network error
  isServerError: boolean;           // True if 5xx error
  isValidationError: boolean;       // True if 400 validation error
}
```

### Error Handling Patterns

```typescript
// Pattern 1: Handle in mutation options
const mutation = appointmentHooks.useCreate({
  onError: (error: ApiClientError) => {
    if (error.isValidationError) {
      // Show field-specific errors
      const details = error.details as Record<string, string[]>;
      Object.entries(details).forEach(([field, errors]) => {
        setFieldError(field, errors[0]);
      });
    } else if (error.isNetworkError) {
      toast.error('Network error. Please check your connection.');
    } else if (error.status === 409) {
      toast.error('Appointment time slot already taken');
    } else {
      toast.error(`Error: ${error.message}`);
    }
  }
});

// Pattern 2: Global error handler in config
const appointmentHooks = createQueryHooks(appointmentService, {
  queryKey: ['appointments'],
  onError: (error: ApiClientError) => {
    // Log to error tracking service
    if (error.isServerError) {
      logErrorToSentry(error);
    }

    // Display user-friendly message
    if (error.status === 401) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
    }
  }
});

// Pattern 3: Component-level error boundary
import { ErrorBoundary } from 'react-error-boundary';

function AppointmentPage() {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <ErrorAlert
          title="Failed to load appointments"
          message={error.message}
          onRetry={() => window.location.reload()}
        />
      )}
    >
      <AppointmentList />
    </ErrorBoundary>
  );
}
```

---

## Testing Strategies

### Mocking Services

```typescript
// tests/mocks/appointmentService.mock.ts
import { vi } from 'vitest';
import { AppointmentService } from '@/services/modules/appointments';

export const mockAppointmentService = {
  getAll: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getStudentAppointments: vi.fn(),
  getTodayAppointments: vi.fn()
} as unknown as AppointmentService;

// In tests
import { mockAppointmentService } from './mocks/appointmentService.mock';

test('should fetch appointments', async () => {
  mockAppointmentService.getAll.mockResolvedValue({
    data: [{ id: '1', ... }],
    pagination: { page: 1, limit: 10, total: 1, ... }
  });

  const result = await mockAppointmentService.getAll();
  expect(result.data).toHaveLength(1);
});
```

### Testing Components with Queries

```typescript
// tests/components/AppointmentList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppointmentList } from './AppointmentList';

test('should display appointments', async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  render(
    <QueryClientProvider client={queryClient}>
      <AppointmentList />
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Appointment 1')).toBeInTheDocument();
  });
});
```

### Testing Mutations

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { appointmentHooks } from '@/services';

test('should create appointment', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result } = renderHook(() => appointmentHooks.useCreate(), { wrapper });

  result.current.mutate({
    studentId: 'student-1',
    providerId: 'provider-1',
    appointmentType: 'checkup',
    scheduledAt: '2025-01-15T10:00:00Z',
    duration: 30
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toHaveProperty('id');
});
```

---

## Common Scenarios

### Scenario 1: CRUD Operations

```typescript
function ManageStudents() {
  const { data, isLoading } = studentHooks.useList();
  const createStudent = studentHooks.useCreate();
  const updateStudent = studentHooks.useUpdate();
  const deleteStudent = studentHooks.useDelete();

  return (
    <>
      <button onClick={() => createStudent.mutate({ firstName: 'John', ... })}>
        Create
      </button>
      <button onClick={() => updateStudent.mutate({ id: '123', data: { ... } })}>
        Update
      </button>
      <button onClick={() => deleteStudent.mutate('123')}>
        Delete
      </button>
    </>
  );
}
```

### Scenario 2: Search with Debouncing

```typescript
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

function StudentSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  const { data, isLoading } = studentHooks.useSearch({
    query: debouncedSearch,
    minQueryLength: 2
  });

  return (
    <>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search students..."
      />
      {isLoading && <Spinner />}
      {data?.data.map(student => <StudentCard key={student.id} {...student} />)}
    </>
  );
}
```

### Scenario 3: Master-Detail View

```typescript
function StudentMasterDetail() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: students } = studentHooks.useList();
  const { data: selectedStudent } = studentHooks.useDetail({
    id: selectedId || '',
    enabled: !!selectedId
  });

  return (
    <div className="flex">
      <div className="w-1/3">
        {students?.data.map(student => (
          <div key={student.id} onClick={() => setSelectedId(student.id)}>
            {student.firstName} {student.lastName}
          </div>
        ))}
      </div>
      <div className="w-2/3">
        {selectedStudent && <StudentDetailView student={selectedStudent} />}
      </div>
    </div>
  );
}
```

---

## Troubleshooting

### Issue: Stale data displayed

**Solution**: Adjust `staleTime` or manually invalidate queries

```typescript
// Option 1: Reduce stale time
const hooks = createQueryHooks(service, {
  queryKey: ['data'],
  staleTime: 1 * 60 * 1000  // 1 minute instead of 5
});

// Option 2: Manual invalidation
const mutation = hooks.useCreate({
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['data'] });
  }
});
```

### Issue: Too many API requests

**Solution**: Increase `staleTime`, disable window focus refetching

```typescript
const hooks = createQueryHooks(service, {
  queryKey: ['data'],
  staleTime: 10 * 60 * 1000,        // 10 minutes
  refetchOnWindowFocus: false       // Don't refetch on focus
});
```

### Issue: Optimistic update not rolling back

**Solution**: Ensure proper error handling

```typescript
const mutation = hooks.useUpdate({
  optimistic: true,
  onError: (error, variables, context) => {
    // Verify context contains rollback data
    if (context?.previousData && context?.detailQueryKey) {
      queryClient.setQueryData(context.detailQueryKey, context.previousData);
    }
  }
});
```

### Issue: Type errors with DTOs

**Solution**: Ensure proper type definitions

```typescript
// ✅ Good
interface CreateStudentDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

class StudentService extends BaseApiService<Student, CreateStudentDto> {
  // TypeScript will enforce CreateStudentDto shape
}

// ❌ Bad: Using Partial<Student>
class StudentService extends BaseApiService<Student, Partial<Student>> {
  // Allows any fields, loses type safety
}
```

---

## Summary

This guide covers all aspects of integrating new API services into the White Cross platform. Key takeaways:

1. **Follow the established patterns** for consistency
2. **Use TypeScript** for compile-time safety
3. **Validate with Zod** for runtime safety
4. **Leverage TanStack Query** for optimal caching and UX
5. **Test thoroughly** with mocks and integration tests

For more information:
- [Architecture Guide](./ARCHITECTURE.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Testing Guide](./TESTING.md)

---

*Last Updated: October 21, 2025*
*Version: 2.0.0*
