# Quick Start Guide - Integration Layer

This guide will get you up and running with the new integration layer in 5 minutes.

## Step 1: Environment Setup

Copy the example environment file:

```bash
cd frontend
cp .env.example .env
```

The defaults are fine for development. For production, update:
- `VITE_API_BASE_URL` to your production API
- `VITE_APP_ENVIRONMENT=production`
- Enable error reporting and analytics

## Step 2: Start Development Server

```bash
npm run dev
```

Watch the console for bootstrap messages:
```
[Bootstrap] Starting application initialization...
[Bootstrap] Initializing security layer...
[Bootstrap] Security layer initialized
[Bootstrap] Initializing audit service...
[Bootstrap] Audit service initialized
[Bootstrap] Initialization complete in 123.45ms
```

## Step 3: Test the Integration

### Login Flow

1. Go to http://localhost:5173/login
2. Login with credentials
3. Check browser console for audit logs:
   ```
   [AuditService] Event queued: LOGIN
   [AuditService] Batch sent successfully
   ```
4. Check sessionStorage for token:
   ```javascript
   // In browser console
   sessionStorage.getItem('secure_auth_token')
   ```

### PHI Data Access

1. Navigate to a student health record
2. Check console for audit log:
   ```
   [AuditService] Event queued: VIEW HEALTH_RECORD
   ```
3. Check query cache:
   ```javascript
   // In browser console
   import { getCacheStats } from './config/queryClient';
   console.log(getCacheStats());
   ```

### Logout

1. Click logout button
2. Verify tokens cleared:
   ```javascript
   sessionStorage.getItem('secure_auth_token') // should be null
   ```
3. Verify PHI cache cleared (no student data in cache)

## Step 4: Using in Your Code

### Query with PHI Meta

```typescript
import { useQuery } from '@tanstack/react-query';
import { STUDENT_QUERY_META } from '@/config/queryClient';

function StudentProfile({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['students', id],
    queryFn: () => fetchStudent(id),
    meta: STUDENT_QUERY_META, // Marks as PHI, adds audit logging
  });

  if (isLoading) return <LoadingSpinner />;
  return <div>{data.firstName} {data.lastName}</div>;
}
```

### Mutation with Audit Logging

```typescript
import { useMutation } from '@tanstack/react-query';

function UpdateStudentForm({ student }: { student: Student }) {
  const mutation = useMutation({
    mutationFn: updateStudent,
    meta: {
      affectsPHI: true,
      auditAction: 'UPDATE',
      resourceType: 'STUDENT',
      successMessage: 'Student updated successfully',
      invalidateKeys: [['students'], ['students', student.id]],
    },
  });

  // Automatic: audit logging, cache invalidation, success toast
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutation.mutate(formData);
    }}>
      {/* form fields */}
    </form>
  );
}
```

### Manual Audit Logging

```typescript
import { auditService } from '@/services/audit/AuditService';

async function viewHealthRecord(studentId: string, recordId: string) {
  // Log PHI access
  await auditService.logPHIAccess(
    'VIEW',
    studentId,
    'HEALTH_RECORD',
    recordId
  );

  // Fetch data
  const record = await fetchHealthRecord(recordId);
  return record;
}
```

### Cache Invalidation

```typescript
import { invalidateByTags } from '@/config/queryClient';

// Invalidate all student queries
await invalidateByTags(['students']);

// Invalidate specific student
await invalidateByTags([`student:${studentId}`]);
```

### Error Handling

```typescript
import { useErrorHandler } from '@/components/errors';

function MyComponent() {
  const throwError = useErrorHandler();

  const handleAction = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      // Error will be caught by GlobalErrorBoundary
      // Automatic: audit logging, PHI sanitization, user-friendly UI
      throwError(error);
    }
  };
}
```

## Step 5: Check Metrics

### In Browser Console

```javascript
// Bootstrap status
import { getBootstrapResult } from './bootstrap';
console.log(getBootstrapResult());

// Cache statistics
import { getCacheStats } from './config/queryClient';
console.log(getCacheStats());
// Expected: { totalQueries: 10, cachedQueries: 8, hitRate: 0.8, ... }

// Health monitoring
import { getGlobalHealthMonitor } from './services/resilience/HealthMonitor';
console.log(getGlobalHealthMonitor().getHealthReport());
// Expected: { totalEndpoints: 5, degradedCount: 0, overallHealthScore: 95 }

// Audit service
import { auditService } from './services/audit/AuditService';
console.log(auditService.getStatus());
// Expected: { isHealthy: true, queuedEvents: 2, failedEvents: 0 }
```

### In React Query Devtools

Press `Ctrl + Shift + I` (or `Cmd + Shift + I` on Mac) and click the React Query Devtools icon.

Check:
- Query keys and their data
- Stale/fresh status
- PHI queries (should have `containsPHI: true` in meta)

## Common Patterns

### 1. Protected Route with Audit

```typescript
import { useAuthContext } from '@/contexts/AuthContext.enhanced';
import { auditService } from '@/services/audit/AuditService';

function ProtectedPage() {
  const { user, isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated) {
      auditService.log({
        action: 'PAGE_VIEW',
        resourceType: 'APPLICATION',
        status: 'SUCCESS',
        context: { page: 'ProtectedPage' },
      });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div>Protected content</div>;
}
```

### 2. Data Loading with Cache

```typescript
import { getCacheManager } from '@/services/cache/CacheManager';

async function loadStudentData(id: string) {
  const cache = getCacheManager();
  const cacheKey = `student:${id}`;

  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('Cache hit!');
    return cached;
  }

  // Fetch from API
  const data = await fetchStudent(id);

  // Store in cache
  cache.set(cacheKey, data, {
    tags: ['students', `student:${id}`],
    ttl: 5 * 60 * 1000, // 5 minutes
    containsPHI: true,
  });

  return data;
}
```

### 3. Optimistic Updates

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudent,
    onMutate: async (updatedStudent) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['students', updatedStudent.id] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['students', updatedStudent.id]);

      // Optimistically update
      queryClient.setQueryData(['students', updatedStudent.id], updatedStudent);

      return { previous };
    },
    onError: (err, updatedStudent, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['students', updatedStudent.id], context.previous);
      }
    },
    onSettled: (data, error, updatedStudent) => {
      // Refetch after success or error
      queryClient.invalidateQueries({ queryKey: ['students', updatedStudent.id] });
    },
    meta: {
      affectsPHI: true,
      auditAction: 'UPDATE',
      resourceType: 'STUDENT',
      successMessage: 'Student updated',
    },
  });
}
```

## Troubleshooting

### Bootstrap fails

**Symptom**: App shows "Initialization Failed" screen

**Fix**:
1. Check browser console for specific error
2. Verify environment variables are set
3. Clear sessionStorage and localStorage
4. Refresh page

### Tokens expire immediately

**Symptom**: User logged out right after login

**Fix**:
1. Check `VITE_AUTH_SESSION_TIMEOUT` in .env
2. Verify backend token expiration matches
3. Check for clock skew between client and server

### Cache not working

**Symptom**: Every request hits the API

**Fix**:
1. Check cache stats: `getCacheStats()`
2. Verify query keys are consistent
3. Check if staleTime is too low
4. Enable React Query Devtools to inspect cache

### Audit logs not sent

**Symptom**: No audit logs in backend

**Fix**:
1. Check `VITE_ENABLE_AUDIT_LOGGING=true`
2. Check audit status: `auditService.getStatus()`
3. Flush manually: `await auditService.flush()`
4. Check localStorage for failed events

## Next Steps

1. **Read the Full Guide**: See `INTEGRATION_GUIDE.md` for detailed documentation
2. **Migrate Existing Code**: Update queries and mutations to use new patterns
3. **Add Tests**: Write tests for your components using the new integration
4. **Monitor Metrics**: Set up dashboards for cache hit rate, audit logs, etc.
5. **Production Deployment**: Follow deployment checklist in `INTEGRATION_IMPLEMENTATION_SUMMARY.md`

## Support

- **Documentation**: `INTEGRATION_GUIDE.md`
- **Implementation Details**: `INTEGRATION_IMPLEMENTATION_SUMMARY.md`
- **API Docs**: `../backend/README.md`
- **Issues**: GitHub Issues

---

**Last Updated**: 2025-10-21
**Version**: 1.0.0
