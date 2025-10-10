---
title: Health Records Migration Guide
description: Step-by-step guide for migrating to the new SOA architecture
date: 2025-10-10
version: 1.0.0
---

# Health Records Migration Guide

## Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9
- TypeScript >= 5
- React >= 18

### Installation

```bash
# Install new dependencies
npm install @tanstack/react-query@latest react-hot-toast@latest zod@latest

# Install dev dependencies for testing
npm install -D @testing-library/react-hooks @tanstack/react-query-devtools
```

### Configuration

1. **Update tsconfig.json** (if needed)

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. **Setup React Query Provider** (if not already done)

```typescript
// src/main.tsx or src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
```

---

## Migration Checklist

### Phase 1: Service Layer (Week 1)

#### ☐ 1.1 Create Enhanced API Service

```bash
# Copy the enhanced service
cp frontend/src/services/modules/healthRecordsApi.enhanced.ts frontend/src/services/modules/healthRecordsApi.ts

# Or create new file and migrate gradually
```

**Files to create:**
- ✅ `frontend/src/services/modules/healthRecordsApi.enhanced.ts`

**Tasks:**
- [ ] Review existing API endpoints
- [ ] Map old endpoints to new service methods
- [ ] Update API_ENDPOINTS configuration if needed
- [ ] Test all service methods

#### ☐ 1.2 Update Type Definitions

**Review and update:**
- [ ] `frontend/src/types/healthRecords.ts` - Ensure types match new service
- [ ] Add missing types from enhanced service
- [ ] Remove deprecated types

#### ☐ 1.3 Configure Validation Schemas

**Already included in enhanced service, verify:**
- [ ] Zod schemas for all request types
- [ ] Error handling for validation failures
- [ ] Type inference from schemas

---

### Phase 2: React Query Hooks (Week 2)

#### ☐ 2.1 Create Custom Hooks

```bash
# Copy the hooks file
cp frontend/src/hooks/useHealthRecords.ts frontend/src/hooks/useHealthRecordsNew.ts
```

**Files to create:**
- ✅ `frontend/src/hooks/useHealthRecords.ts`

**Tasks:**
- [ ] Review existing data fetching patterns
- [ ] Create hooks for all health records operations
- [ ] Configure caching strategies
- [ ] Test all hooks in isolation

#### ☐ 2.2 Setup Query Keys

**Verify query keys structure:**
```typescript
export const healthRecordsKeys = {
  all: ['healthRecords'],
  records: (studentId?: string, filters?: HealthRecordFilters) => [...],
  allergies: (studentId: string) => [...],
  // etc.
}
```

**Tasks:**
- [ ] Define all query keys
- [ ] Document query key patterns
- [ ] Test cache invalidation

#### ☐ 2.3 Configure Retry and Error Handling

**Review:**
- [ ] Retry configuration (attempts, delays)
- [ ] Error handling strategy
- [ ] Toast notifications
- [ ] Circuit breaker awareness

---

### Phase 3: Error Handling (Week 3)

#### ☐ 3.1 Create Error Boundary

```bash
# Copy error boundary
mkdir -p frontend/src/components/healthRecords
cp frontend/src/components/healthRecords/HealthRecordsErrorBoundary.tsx frontend/src/components/healthRecords/
```

**Files to create:**
- ✅ `frontend/src/components/healthRecords/HealthRecordsErrorBoundary.tsx`

**Tasks:**
- [ ] Review error types
- [ ] Customize error messages
- [ ] Test error scenarios (401, 403, 500, 503)
- [ ] Verify PHI cleanup on errors

#### ☐ 3.2 Implement Custom Error Classes

**Verify error classes:**
- [ ] `ValidationError` (400)
- [ ] `UnauthorizedError` (401)
- [ ] `ForbiddenError` (403)
- [ ] `NotFoundError` (404)
- [ ] `CircuitBreakerError` (503)

**Tasks:**
- [ ] Test each error type
- [ ] Verify error messages
- [ ] Check error boundary handling

---

### Phase 4: HIPAA Compliance (Week 4)

#### ☐ 4.1 Implement Cleanup Utilities

```bash
# Copy cleanup utilities
cp frontend/src/utils/healthRecordsCleanup.ts frontend/src/utils/
```

**Files to create:**
- ✅ `frontend/src/utils/healthRecordsCleanup.ts`

**Tasks:**
- [ ] Configure session timeout (15 minutes)
- [ ] Setup inactivity warning (13 minutes)
- [ ] Implement automatic cleanup
- [ ] Test page visibility monitoring
- [ ] Test beforeunload cleanup

#### ☐ 4.2 Setup Audit Logging

**Verify audit logging:**
- [ ] All PHI access logged
- [ ] User ID captured
- [ ] Student ID captured
- [ ] Action/event captured
- [ ] Timestamp included
- [ ] Details object for context

**Tasks:**
- [ ] Test audit log creation
- [ ] Verify backend integration
- [ ] Review audit log retention
- [ ] Test audit log retrieval

#### ☐ 4.3 Configure Session Monitoring

**Setup SessionMonitor:**
```typescript
const sessionMonitor = new SessionMonitor({
  timeoutMs: 15 * 60 * 1000,
  warningMs: 13 * 60 * 1000,
  onWarning: (remainingTime) => {
    // Show warning
  },
  onTimeout: () => {
    // Cleanup and logout
  },
});
```

**Tasks:**
- [ ] Start session monitor
- [ ] Test timeout behavior
- [ ] Test warning behavior
- [ ] Test activity detection
- [ ] Verify cleanup on timeout

---

### Phase 5: Component Migration (Week 5)

#### ☐ 5.1 Refactor HealthRecords Page

```bash
# Create refactored version first
cp frontend/src/pages/HealthRecords.refactored.tsx frontend/src/pages/HealthRecordsNew.tsx

# Test thoroughly, then replace
mv frontend/src/pages/HealthRecords.tsx frontend/src/pages/HealthRecords.old.tsx
mv frontend/src/pages/HealthRecordsNew.tsx frontend/src/pages/HealthRecords.tsx
```

**Files to update:**
- ✅ `frontend/src/pages/HealthRecords.tsx`

**Migration steps:**
1. [ ] Replace `useHealthRecordsData` with React Query hooks
2. [ ] Add `HealthRecordsErrorBoundaryWrapper`
3. [ ] Add session monitoring
4. [ ] Add automatic cleanup
5. [ ] Replace mutations with React Query mutations
6. [ ] Test all user flows

#### ☐ 5.2 Update Child Components

**For each tab component:**
- [ ] Update props to use new data types
- [ ] Replace local state with server state
- [ ] Use mutations for data changes
- [ ] Test loading states
- [ ] Test error states

**Components to update:**
- [ ] `OverviewTab.tsx`
- [ ] `RecordsTab.tsx`
- [ ] `AllergiesTab.tsx`
- [ ] `ChronicConditionsTab.tsx`
- [ ] `VaccinationsTab.tsx`
- [ ] `GrowthChartsTab.tsx`
- [ ] `ScreeningsTab.tsx`
- [ ] `AnalyticsTab.tsx`

#### ☐ 5.3 Update Modals

**For each modal:**
- [ ] Use mutations instead of callbacks
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Show success messages

**Modals to update:**
- [ ] `HealthRecordModal.tsx`
- [ ] `AllergyModal.tsx` (if exists)
- [ ] `ChronicConditionModal.tsx` (if exists)
- [ ] `VaccinationModal.tsx` (if exists)

---

### Phase 6: Testing (Week 6)

#### ☐ 6.1 Unit Tests

**Service Layer:**
```bash
# Create test files
touch frontend/src/services/modules/healthRecordsApi.enhanced.test.ts
touch frontend/src/hooks/useHealthRecords.test.ts
```

**Test coverage:**
- [ ] All service methods
- [ ] All custom hooks
- [ ] Error handling
- [ ] Validation schemas
- [ ] Audit logging

#### ☐ 6.2 Integration Tests

**Test scenarios:**
- [ ] Full CRUD operations
- [ ] Error boundary behavior
- [ ] Session timeout
- [ ] Cache invalidation
- [ ] Optimistic updates

#### ☐ 6.3 E2E Tests (Cypress)

**Test flows:**
- [ ] View health records
- [ ] Create health record
- [ ] Update health record
- [ ] Delete health record
- [ ] Session timeout
- [ ] Error scenarios
- [ ] Circuit breaker handling

**Example:**
```typescript
describe('Health Records E2E', () => {
  it('should handle full CRUD lifecycle', () => {
    cy.login();
    cy.visit('/health-records');

    // Create
    cy.get('[data-testid="new-record-button"]').click();
    cy.get('[data-testid="health-record-modal"]').should('be.visible');
    // Fill form...
    cy.get('[data-testid="save-button"]').click();
    cy.contains('Health record created successfully').should('be.visible');

    // Update
    // Delete
  });
});
```

#### ☐ 6.4 Performance Tests

**Measure:**
- [ ] Initial load time
- [ ] Cache hit rate
- [ ] Network requests (should be minimized)
- [ ] Memory usage
- [ ] Cleanup effectiveness

---

### Phase 7: Documentation & Training (Week 7)

#### ☐ 7.1 Update Documentation

**Documentation to create/update:**
- [x] Architecture documentation
- [x] Migration guide
- [ ] API documentation
- [ ] Component documentation
- [ ] Testing guide

#### ☐ 7.2 Create Examples

**Example files to create:**
- [ ] `examples/basic-usage.tsx`
- [ ] `examples/with-optimistic-updates.tsx`
- [ ] `examples/with-error-handling.tsx`
- [ ] `examples/with-session-monitoring.tsx`

#### ☐ 7.3 Team Training

**Training topics:**
- [ ] New architecture overview
- [ ] React Query basics
- [ ] HIPAA compliance features
- [ ] Error handling patterns
- [ ] Testing strategies
- [ ] Common pitfalls

---

### Phase 8: Deployment (Week 8)

#### ☐ 8.1 Pre-Deployment

**Checks:**
- [ ] All tests passing
- [ ] Code review completed
- [ ] Documentation complete
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] HIPAA compliance verified

#### ☐ 8.2 Deployment Strategy

**Recommended approach:**
1. [ ] Deploy to staging environment
2. [ ] Run full test suite
3. [ ] Perform manual QA
4. [ ] Monitor error logs
5. [ ] Check audit logs
6. [ ] Verify session timeout
7. [ ] Test circuit breaker
8. [ ] Deploy to production (off-peak hours)

#### ☐ 8.3 Post-Deployment

**Monitoring:**
- [ ] Check error rates
- [ ] Monitor API response times
- [ ] Review audit logs
- [ ] Check user feedback
- [ ] Monitor memory usage
- [ ] Track cache performance

#### ☐ 8.4 Rollback Plan

**If issues occur:**
1. [ ] Identify issue
2. [ ] Check if critical
3. [ ] If critical, rollback to previous version
4. [ ] Document issue
5. [ ] Fix in development
6. [ ] Redeploy when fixed

---

## Common Migration Patterns

### Pattern 1: Replace useEffect with React Query

**Before:**
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const response = await fetch('/api/health-records');
    const json = await response.json();
    setData(json.data);
    setLoading(false);
  };

  fetchData();
}, []);
```

**After:**
```typescript
const { data = [], isLoading } = useHealthRecords(studentId);
```

### Pattern 2: Replace Manual Mutations with React Query

**Before:**
```typescript
const handleCreate = async (formData) => {
  try {
    setLoading(true);
    const response = await fetch('/api/health-records', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error('Failed');

    // Manually refetch
    await fetchData();

    toast.success('Created successfully');
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};
```

**After:**
```typescript
const createMutation = useCreateHealthRecord();

const handleCreate = async (formData) => {
  await createMutation.mutateAsync(formData);
  // Automatic: cache invalidation, success toast, error handling
};
```

### Pattern 3: Add Error Boundary

**Before:**
```typescript
function HealthRecords() {
  return <HealthRecordsContent />;
}
```

**After:**
```typescript
function HealthRecords() {
  return (
    <HealthRecordsErrorBoundaryWrapper studentId={studentId}>
      <HealthRecordsContent />
    </HealthRecordsErrorBoundaryWrapper>
  );
}
```

### Pattern 4: Add Session Monitoring

**Before:**
```typescript
function HealthRecords() {
  return <HealthRecordsContent />;
}
```

**After:**
```typescript
function HealthRecords() {
  const [sessionMonitor] = useState(() => new SessionMonitor({
    onTimeout: () => handleLogout(),
  }));

  useEffect(() => {
    sessionMonitor.start();
    return () => sessionMonitor.stop();
  }, []);

  return <HealthRecordsContent />;
}
```

---

## Troubleshooting Migration Issues

### Issue 1: Type Errors

**Problem:** TypeScript errors after migration

**Solution:**
```typescript
// Ensure types are imported
import type { HealthRecord, CreateHealthRecordRequest } from '@/services/modules/healthRecordsApi.enhanced';

// Use proper type assertions
const record = data as HealthRecord;

// Or use type guards
function isHealthRecord(data: unknown): data is HealthRecord {
  return typeof data === 'object' && data !== null && 'id' in data;
}
```

### Issue 2: Query Not Refetching

**Problem:** Data not updating after mutation

**Solution:**
```typescript
// Ensure proper cache invalidation
const createMutation = useCreateHealthRecord({
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
  },
});

// Or use manual refetch
const { refetch } = useHealthRecords(studentId);
await refetch();
```

### Issue 3: Session Not Timing Out

**Problem:** Session monitor not working

**Solution:**
```typescript
// Ensure monitor is properly initialized
const [sessionMonitor] = useState(() => new SessionMonitor({
  timeoutMs: 15 * 60 * 1000,
  onTimeout: () => {
    console.log('Session timeout');
    // Handle timeout
  },
}));

// Ensure it's started
useEffect(() => {
  sessionMonitor.start();
  console.log('Session monitor started');

  return () => {
    sessionMonitor.stop();
    console.log('Session monitor stopped');
  };
}, [sessionMonitor]);
```

### Issue 4: Old API Still Being Called

**Problem:** Requests going to old endpoints

**Solution:**
```typescript
// Check API_ENDPOINTS configuration
console.log(API_ENDPOINTS.HEALTH_RECORDS);

// Ensure new service is being used
import { healthRecordsApiService } from '@/services/modules/healthRecordsApi.enhanced';

// Not the old service
// import { healthRecordsApi } from '@/services/modules/healthRecordsApi';
```

---

## Validation Checklist

### Before Go-Live

**Functionality:**
- [ ] All CRUD operations work
- [ ] Search and filtering work
- [ ] Pagination works
- [ ] Sorting works
- [ ] Export/Import work

**Performance:**
- [ ] Initial load < 2 seconds
- [ ] Mutations < 1 second
- [ ] Cache hit rate > 80%
- [ ] Memory usage stable
- [ ] No memory leaks

**Security:**
- [ ] Session timeout works
- [ ] PHI cleanup works
- [ ] Audit logging works
- [ ] Error messages don't expose PHI
- [ ] HTTPS enforced

**User Experience:**
- [ ] Loading states shown
- [ ] Error states handled
- [ ] Success feedback given
- [ ] Optimistic updates work
- [ ] No UI flickering

**Code Quality:**
- [ ] TypeScript strict mode
- [ ] No console.errors in production
- [ ] No TODOs in code
- [ ] All tests passing
- [ ] Code coverage > 80%

---

## Support & Resources

### Documentation
- [Main Documentation](./HEALTH_RECORDS_SOA_REFACTORING.md)
- [API Reference](./API_REFERENCE.md)
- [Testing Guide](./TESTING_GUIDE.md)

### Tools
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Zod Documentation](https://zod.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Getting Help
- Review documentation first
- Check troubleshooting section
- Review common patterns
- Consult with team lead
- Open GitHub issue (for bugs)

---

**Last Updated:** 2025-10-10
**Version:** 1.0.0
**Status:** Complete
