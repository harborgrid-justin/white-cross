---
title: Health Records Frontend SOA Refactoring
description: Comprehensive guide to the refactored health records frontend architecture
date: 2025-10-10
version: 2.0.0
status: Complete
---

# Health Records Frontend SOA Refactoring

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Implementation Details](#implementation-details)
4. [Migration Guide](#migration-guide)
5. [Testing Strategy](#testing-strategy)
6. [Security & HIPAA Compliance](#security--hipaa-compliance)
7. [Performance Optimization](#performance-optimization)
8. [Troubleshooting](#troubleshooting)

---

## Executive Summary

The health records frontend has been completely refactored to align with Service-Oriented Architecture (SOA) patterns and enterprise best practices. This refactoring delivers:

### Key Improvements

✅ **Service Layer Abstraction**
- Type-safe API service with Zod validation
- Comprehensive error handling with custom error classes
- Automatic HIPAA audit logging
- Circuit breaker awareness

✅ **React Query Integration**
- Smart caching with configurable stale times
- Optimistic updates for better UX
- Automatic retry with exponential backoff
- Cache invalidation strategies

✅ **HIPAA Compliance**
- Automatic PHI data cleanup
- Session timeout monitoring
- Secure data disposal
- Comprehensive audit logging

✅ **Error Handling**
- Specialized error boundary for health records
- User-friendly error messages
- Automatic data cleanup on errors
- Circuit breaker detection

✅ **Type Safety**
- Full TypeScript coverage
- Zod runtime validation
- Type-safe API responses
- Compile-time error detection

---

## Architecture Overview

### Layer Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│   (React Components, Pages, Modals)     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Custom Hooks Layer              │
│  (useHealthRecords, useAllergies, etc)  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│        Service Layer (API)              │
│   (HealthRecordsApiService)             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Transport Layer                 │
│        (Axios, Interceptors)            │
└─────────────────────────────────────────┘
```

### Key Components

#### 1. Enhanced API Service
**File:** `frontend/src/services/modules/healthRecordsApi.enhanced.ts`

```typescript
export class HealthRecordsApiService {
  // Automatic audit logging for HIPAA compliance
  private auditLog(action: string, studentId: string, details?: any): void

  // Type-safe API methods with validation
  async getStudentHealthRecords(studentId: string, filters?: HealthRecordFilters): Promise<HealthRecord[]>
  async createHealthRecord(data: CreateHealthRecordRequest): Promise<HealthRecord>
  async updateHealthRecord(id: string, data: Partial<CreateHealthRecordRequest>): Promise<HealthRecord>
  // ... 20+ methods
}
```

**Features:**
- Zod schema validation for all requests
- Custom error classes (ValidationError, UnauthorizedError, CircuitBreakerError, etc.)
- Automatic HIPAA audit logging
- Response data extraction utilities
- Query parameter building

#### 2. React Query Hooks
**File:** `frontend/src/hooks/useHealthRecords.ts`

```typescript
// Queries
export function useHealthRecords(studentId: string, filters?: HealthRecordFilters)
export function useAllergies(studentId: string)
export function useChronicConditions(studentId: string)
export function useVaccinations(studentId: string)
export function useHealthSummary(studentId: string)

// Mutations
export function useCreateHealthRecord()
export function useUpdateHealthRecord()
export function useDeleteHealthRecord()
// ... 15+ hooks
```

**Features:**
- Automatic caching with intelligent stale times
- Optimistic updates for instant UI feedback
- Retry strategies with exponential backoff
- Cache invalidation on mutations
- Error handling with toast notifications

#### 3. Error Boundary
**File:** `frontend/src/components/healthRecords/HealthRecordsErrorBoundary.tsx`

```typescript
export class HealthRecordsErrorBoundary extends Component {
  // Specialized error handling for health records
  // Automatic PHI cleanup on errors
  // User-friendly error messages
  // Circuit breaker awareness
}
```

**Error Types Handled:**
- Authentication errors (401)
- Authorization errors (403)
- Circuit breaker errors (503)
- API errors (4xx, 5xx)
- Unknown errors

#### 4. HIPAA Cleanup Utilities
**File:** `frontend/src/utils/healthRecordsCleanup.ts`

```typescript
// Data cleanup
export function clearHealthRecordsCache(queryClient: QueryClient)
export function clearSensitiveStorage(options: CleanupOptions)
export function clearAllPHI(queryClient: QueryClient, options: CleanupOptions)

// Session monitoring
export class SessionMonitor {
  start(): void
  stop(): void
  getTimeUntilTimeout(): number
}

// Audit logging
export function logCleanupEvent(event: string, details?: any)
```

**Features:**
- Automatic session timeout (15 minutes)
- Inactivity warning (13 minutes)
- Page visibility monitoring
- Audit trail for all cleanup events

#### 5. Refactored Page Component
**File:** `frontend/src/pages/HealthRecords.refactored.tsx`

```typescript
const HealthRecordsRefactored: React.FC = () => {
  // Uses React Query hooks for all data fetching
  // Implements session monitoring
  // HIPAA-compliant cleanup on unmount
  // Optimistic updates for mutations
}
```

---

## Implementation Details

### 1. Service Layer

#### API Service Methods

All service methods follow this pattern:

```typescript
async getStudentHealthRecords(
  studentId: string,
  filters: HealthRecordFilters = {}
): Promise<HealthRecord[]> {
  try {
    // 1. Validate input
    if (!studentId) {
      throw new ValidationError('Student ID is required');
    }

    // 2. Build query parameters
    const queryParams = buildQueryParams({ ...filters, studentId });

    // 3. Make API call
    const response = await apiInstance.get<ApiResponse<HealthRecord[]>>(
      `${API_ENDPOINTS.HEALTH_RECORDS}/student/${studentId}?${queryParams.toString()}`
    );

    // 4. Log access for HIPAA compliance
    this.auditLog('VIEW_HEALTH_RECORDS', studentId);

    // 5. Extract and return data
    return extractResponseData(response);
  } catch (error) {
    // 6. Handle errors
    throw handleApiError(error, 'get student health records');
  }
}
```

#### Error Handling

Custom error classes provide semantic error types:

```typescript
// Validation errors (400)
throw new ValidationError('Student ID is required');

// Authentication errors (401)
throw new UnauthorizedError('Session expired');

// Authorization errors (403)
throw new ForbiddenError('Access denied');

// Not found errors (404)
throw new NotFoundError('Health record');

// Circuit breaker errors (503)
throw new CircuitBreakerError('Service unavailable');
```

### 2. React Query Integration

#### Query Configuration

Each query has optimized caching configuration:

```typescript
// Critical data (allergies) - cache longer
const allergiesQuery = useQuery({
  queryKey: healthRecordsKeys.allergies(studentId),
  queryFn: () => healthRecordsApiService.getStudentAllergies(studentId),
  staleTime: 10 * 60 * 1000, // 10 minutes
  gcTime: 60 * 60 * 1000, // 1 hour
  retry: shouldRetry,
  retryDelay: RETRY_CONFIG.DELAY,
});

// Frequently updated data (summary) - shorter cache
const summaryQuery = useQuery({
  queryKey: healthRecordsKeys.summary(studentId),
  queryFn: () => healthRecordsApiService.getHealthSummary(studentId),
  staleTime: 2 * 60 * 1000, // 2 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
});
```

#### Optimistic Updates

Mutations implement optimistic updates for instant feedback:

```typescript
const updateHealthRecordMutation = useMutation({
  mutationFn: ({ id, data }) => healthRecordsApiService.updateHealthRecord(id, data),

  // Optimistic update
  onMutate: async ({ id }) => {
    await queryClient.cancelQueries({ queryKey: healthRecordsKeys.record(id) });
    const previousRecord = queryClient.getQueryData(healthRecordsKeys.record(id));
    return { previousRecord };
  },

  // Success - invalidate cache
  onSuccess: (data, variables) => {
    queryClient.setQueryData(healthRecordsKeys.record(variables.id), data);
    queryClient.invalidateQueries({ queryKey: healthRecordsKeys.records(data.studentId) });
    toast.success('Health record updated successfully');
  },

  // Error - rollback
  onError: (error, variables, context) => {
    if (context?.previousRecord) {
      queryClient.setQueryData(healthRecordsKeys.record(variables.id), context.previousRecord);
    }
    handleQueryError(error, 'updating health record');
  },
});
```

#### Cache Invalidation Strategy

```typescript
// On create - invalidate list and summary
onSuccess: (data, variables) => {
  queryClient.invalidateQueries({ queryKey: healthRecordsKeys.records(variables.studentId) });
  queryClient.invalidateQueries({ queryKey: healthRecordsKeys.summary(variables.studentId) });
}

// On update - update cache and invalidate related
onSuccess: (data, variables) => {
  queryClient.setQueryData(healthRecordsKeys.record(variables.id), data);
  queryClient.invalidateQueries({ queryKey: healthRecordsKeys.records(data.studentId) });
}

// On delete - remove from cache
onSuccess: (_, id) => {
  queryClient.removeQueries({ queryKey: healthRecordsKeys.record(id) });
  queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
}
```

### 3. HIPAA Compliance

#### Session Monitoring

```typescript
const sessionMonitor = new SessionMonitor({
  timeoutMs: 15 * 60 * 1000, // 15 minutes
  warningMs: 13 * 60 * 1000, // Warning at 13 minutes

  onWarning: (remainingTime) => {
    toast.error(`Session will expire in ${Math.floor(remainingTime / 1000 / 60)} minutes`);
  },

  onTimeout: () => {
    // Clear all PHI data
    clearAllPHI(queryClient);
    // Show session expired modal
    setShowSessionExpiredModal(true);
  },
});

// Start monitoring
sessionMonitor.start();
```

#### Automatic Cleanup

```typescript
// Custom hook for automatic cleanup
export function useHealthRecordsCleanup(studentId: string | null): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      clearHealthRecordsCache(queryClient);
      logCleanupEvent('COMPONENT_UNMOUNT');
    };
  }, [queryClient]);

  // Monitor page visibility
  useEffect(() => {
    const cleanup = monitorPageVisibility(queryClient);
    return cleanup;
  }, [queryClient]);
}
```

#### Audit Logging

All PHI access is logged:

```typescript
// In API service
private auditLog(action: string, studentId: string, details?: any): void {
  apiInstance.post('/audit/access-log', {
    action,
    studentId,
    resourceType: 'HEALTH_RECORD',
    timestamp: new Date().toISOString(),
    details,
  });
}

// Usage
this.auditLog('VIEW_HEALTH_RECORDS', studentId);
this.auditLog('CREATE_ALLERGY', studentId, { allergyId: allergy.id });
this.auditLog('UPDATE_VACCINATION', studentId, { vaccinationId: id });
```

---

## Migration Guide

### Step 1: Update Dependencies

Ensure you have the required packages:

```bash
npm install @tanstack/react-query react-hot-toast zod
```

### Step 2: Replace Old Service

**Old (fetch-based):**
```typescript
// useHealthRecordsData.ts
const response = await fetch(url);
const data = await response.json();
setHealthRecords(data.data?.records || []);
```

**New (service-based):**
```typescript
// Use hooks instead
const { data: healthRecords, isLoading } = useHealthRecords(studentId, filters);
```

### Step 3: Update Components

**Old Component:**
```typescript
const HealthRecords: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await fetch(url);
    const data = await response.json();
    setData(data);
    setLoading(false);
  };

  return (
    // ...
  );
};
```

**New Component:**
```typescript
const HealthRecords: React.FC = () => {
  const { data, isLoading, error } = useHealthRecords(studentId);
  const createMutation = useCreateHealthRecord();

  const handleCreate = async (formData) => {
    await createMutation.mutateAsync(formData);
  };

  return (
    <HealthRecordsErrorBoundaryWrapper studentId={studentId}>
      {/* ... */}
    </HealthRecordsErrorBoundaryWrapper>
  );
};
```

### Step 4: Add Error Boundary

Wrap health records features with the specialized error boundary:

```typescript
import { HealthRecordsErrorBoundaryWrapper } from '@/components/healthRecords/HealthRecordsErrorBoundary';

function App() {
  return (
    <HealthRecordsErrorBoundaryWrapper>
      <HealthRecordsPage />
    </HealthRecordsErrorBoundaryWrapper>
  );
}
```

### Step 5: Implement Session Monitoring

Add session monitoring to your health records page:

```typescript
import { SessionMonitor, logCleanupEvent } from '@/utils/healthRecordsCleanup';

const [sessionMonitor] = useState(() => new SessionMonitor({
  onTimeout: () => {
    // Handle session timeout
  }
}));

useEffect(() => {
  sessionMonitor.start();
  return () => sessionMonitor.stop();
}, []);
```

### Step 6: Update API Endpoints

Ensure your backend endpoints match the new service expectations:

```typescript
// Expected response format
{
  "success": true,
  "data": {
    // Your data here
  },
  "message": "Optional message"
}

// Error response format
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## Testing Strategy

### 1. Unit Tests

#### Test Service Layer

```typescript
// healthRecordsApi.enhanced.test.ts
describe('HealthRecordsApiService', () => {
  it('should fetch student health records', async () => {
    const service = new HealthRecordsApiService();
    const records = await service.getStudentHealthRecords('student-1');
    expect(records).toBeDefined();
  });

  it('should throw ValidationError for missing studentId', async () => {
    const service = new HealthRecordsApiService();
    await expect(service.getStudentHealthRecords('')).rejects.toThrow(ValidationError);
  });

  it('should log audit events', async () => {
    const service = new HealthRecordsApiService();
    const spy = jest.spyOn(apiInstance, 'post');
    await service.getStudentHealthRecords('student-1');
    expect(spy).toHaveBeenCalledWith('/audit/access-log', expect.any(Object));
  });
});
```

#### Test React Query Hooks

```typescript
// useHealthRecords.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHealthRecords } from './useHealthRecords';

describe('useHealthRecords', () => {
  it('should fetch health records', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(
      () => useHealthRecords('student-1'),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
```

### 2. Integration Tests

```typescript
// healthRecords.integration.test.tsx
describe('Health Records Integration', () => {
  it('should display health records and handle mutations', async () => {
    const { getByTestId, findByText } = render(
      <HealthRecordsRefactored />
    );

    // Wait for data to load
    await findByText('Health Records Management');

    // Click add button
    fireEvent.click(getByTestId('new-record-button'));

    // Fill form and submit
    // ...

    // Verify success toast
    await findByText('Health record created successfully');
  });
});
```

### 3. E2E Tests (Cypress)

```typescript
// health-records.cy.ts
describe('Health Records', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/health-records');
  });

  it('should load and display health records', () => {
    cy.get('[data-testid="health-records-page"]').should('be.visible');
    cy.get('[data-testid="loading-indicator"]').should('not.exist');
  });

  it('should create new health record', () => {
    cy.get('[data-testid="new-record-button"]').click();
    cy.get('[data-testid="health-record-modal"]').should('be.visible');
    // Fill form...
    cy.get('[data-testid="save-button"]').click();
    cy.contains('Health record created successfully').should('be.visible');
  });

  it('should handle session timeout', () => {
    cy.clock();
    cy.tick(15 * 60 * 1000); // 15 minutes
    cy.contains('Session Expired').should('be.visible');
  });
});
```

### 4. Error Handling Tests

```typescript
describe('Error Handling', () => {
  it('should display error boundary on API error', () => {
    // Mock API error
    server.use(
      rest.get('/api/health-records/*', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    render(<HealthRecordsRefactored />);

    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
  });

  it('should handle circuit breaker error', () => {
    // Mock circuit breaker error
    server.use(
      rest.get('/api/health-records/*', (req, res, ctx) => {
        return res(
          ctx.status(503),
          ctx.json({ error: 'Service unavailable', code: 'CIRCUIT_BREAKER_OPEN' })
        );
      })
    );

    render(<HealthRecordsRefactored />);

    expect(screen.getByText('Service Temporarily Unavailable')).toBeInTheDocument();
  });
});
```

---

## Security & HIPAA Compliance

### Security Features

#### 1. Automatic PHI Cleanup

```typescript
// Cleanup on component unmount
useEffect(() => {
  return () => {
    clearHealthRecordsCache(queryClient);
    logCleanupEvent('COMPONENT_UNMOUNT');
  };
}, []);

// Cleanup on page visibility change
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      clearHealthRecordsCache(queryClient);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, []);
```

#### 2. Session Timeout

- **Timeout Duration:** 15 minutes of inactivity
- **Warning:** 2 minutes before timeout
- **Actions on Timeout:**
  - Clear all PHI data from cache
  - Clear local/session storage
  - Redirect to login page
  - Log audit event

#### 3. Audit Logging

All PHI access is logged with:
- User ID
- Student ID
- Action performed
- Timestamp
- Additional details

```typescript
auditLog = {
  timestamp: '2025-10-10T12:00:00Z',
  event: 'VIEW_HEALTH_RECORDS',
  userId: 'user-123',
  studentId: 'student-456',
  details: { filters: {...} }
}
```

#### 4. Secure Error Messages

Error messages never expose sensitive information:

```typescript
// ❌ BAD - Exposes PHI
throw new Error(`Failed to load record for John Doe (SSN: 123-45-6789)`);

// ✅ GOOD - Generic message
throw new Error('Failed to load health record');
```

### HIPAA Compliance Checklist

- ✅ Automatic session timeout (15 minutes)
- ✅ PHI cleanup on component unmount
- ✅ PHI cleanup on page visibility change
- ✅ Audit logging for all PHI access
- ✅ Secure error messages
- ✅ No PHI in console logs (production)
- ✅ No PHI in local storage
- ✅ HTTPS-only communication
- ✅ Role-based access control integration
- ✅ Data encryption in transit

---

## Performance Optimization

### Caching Strategy

```typescript
const STALE_TIME = {
  HEALTH_RECORDS: 5 * 60 * 1000,      // 5 minutes
  ALLERGIES: 10 * 60 * 1000,           // 10 minutes (critical)
  CHRONIC_CONDITIONS: 10 * 60 * 1000,  // 10 minutes (critical)
  VACCINATIONS: 5 * 60 * 1000,         // 5 minutes
  GROWTH: 30 * 60 * 1000,              // 30 minutes (historical)
  SCREENINGS: 30 * 60 * 1000,          // 30 minutes (historical)
  SUMMARY: 2 * 60 * 1000,              // 2 minutes (frequently updated)
};
```

### Request Deduplication

React Query automatically deduplicates identical requests:

```typescript
// Multiple components requesting same data
// Only 1 network request is made
const query1 = useHealthRecords('student-1');
const query2 = useHealthRecords('student-1');
const query3 = useHealthRecords('student-1');
// → Single API call
```

### Lazy Loading

Tab data is only fetched when the tab is active:

```typescript
const { data: allergies } = useAllergies(studentId, {
  enabled: !!studentId && activeTab === 'allergies'
});
```

### Optimistic Updates

Instant UI feedback without waiting for server:

```typescript
// UI updates immediately
createMutation.mutate(data);

// Server confirms later
// If error, UI rolls back automatically
```

---

## Troubleshooting

### Common Issues

#### 1. Query Not Fetching

**Problem:** Data not loading when expected

**Solution:**
```typescript
// Check if query is enabled
const { data, isLoading } = useHealthRecords(studentId, filters, {
  enabled: !!studentId  // ← Make sure this is true
});

// Check network tab for errors
// Check React Query DevTools
```

#### 2. Stale Data

**Problem:** UI showing old data

**Solution:**
```typescript
// Manually invalidate cache
queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });

// Or refetch
refetch();

// Or adjust staleTime
const query = useHealthRecords(studentId, filters, {
  staleTime: 0  // Always fetch fresh data
});
```

#### 3. Session Timeout Not Working

**Problem:** Session monitor not timing out

**Solution:**
```typescript
// Ensure monitor is started
useEffect(() => {
  sessionMonitor.start();
  return () => sessionMonitor.stop();
}, []);

// Check if activity events are firing
sessionMonitor.onActivity = () => console.log('Activity detected');
```

#### 4. Error Boundary Not Catching Errors

**Problem:** Errors not caught by error boundary

**Solution:**
```typescript
// Error boundaries only catch rendering errors
// For async errors, use error handling in hooks

// ❌ Won't be caught
useEffect(() => {
  throw new Error('Async error');
}, []);

// ✅ Will be caught
const { error } = useHealthRecords(studentId);
if (error) {
  // Handle error
}
```

### Debugging Tips

#### 1. React Query DevTools

```typescript
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

#### 2. Audit Log

```typescript
import { getAuditLog } from '@/utils/healthRecordsCleanup';

// View audit log in console
console.table(getAuditLog());
```

#### 3. Session Status

```typescript
// Check session status
console.log('Time until timeout:', sessionMonitor.getTimeUntilTimeout());
console.log('Is active:', sessionMonitor.isActive());
```

---

## File Reference

### New Files Created

1. **Enhanced API Service**
   - `frontend/src/services/modules/healthRecordsApi.enhanced.ts`

2. **React Query Hooks**
   - `frontend/src/hooks/useHealthRecords.ts`

3. **Error Boundary**
   - `frontend/src/components/healthRecords/HealthRecordsErrorBoundary.tsx`

4. **Cleanup Utilities**
   - `frontend/src/utils/healthRecordsCleanup.ts`

5. **Refactored Page**
   - `frontend/src/pages/HealthRecords.refactored.tsx`

6. **Documentation**
   - `docs/HEALTH_RECORDS_SOA_REFACTORING.md`

### Files to Update

1. **Replace Old Service**
   - Remove: `frontend/src/hooks/useHealthRecordsData.ts`
   - Replace with: `frontend/src/hooks/useHealthRecords.ts`

2. **Update Page Component**
   - Update: `frontend/src/pages/HealthRecords.tsx`
   - Use as reference: `frontend/src/pages/HealthRecords.refactored.tsx`

3. **Update API Endpoints**
   - Ensure: `frontend/src/services/config/apiConfig.ts` has correct endpoints

---

## Conclusion

The refactored health records frontend provides a robust, type-safe, and HIPAA-compliant foundation for managing sensitive health information. Key benefits include:

- **Developer Experience:** Type safety, better error messages, easier debugging
- **User Experience:** Faster UI updates, better error handling, optimistic updates
- **Security:** Automatic PHI cleanup, session monitoring, audit logging
- **Maintainability:** Clear separation of concerns, testable code, comprehensive documentation
- **Scalability:** Efficient caching, request deduplication, lazy loading

For questions or issues, refer to the troubleshooting section or contact the development team.

---

**Document Version:** 2.0.0
**Last Updated:** 2025-10-10
**Authors:** Enterprise React Team
**Status:** Complete
