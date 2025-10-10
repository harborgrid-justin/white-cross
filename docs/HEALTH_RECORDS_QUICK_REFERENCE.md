---
title: Health Records - Quick Reference Card
description: Quick reference for developers using the new health records architecture
date: 2025-10-10
---

# Health Records - Quick Reference Card

## 🚀 Quick Start

### Import What You Need

```typescript
// Hooks
import {
  useHealthRecords,
  useAllergies,
  useChronicConditions,
  useVaccinations,
  useCreateHealthRecord,
  useUpdateHealthRecord,
  useDeleteHealthRecord,
} from '@/hooks/useHealthRecords';

// Error Boundary
import { HealthRecordsErrorBoundaryWrapper } from '@/components/healthRecords/HealthRecordsErrorBoundary';

// Cleanup Utilities
import { SessionMonitor, clearAllPHI } from '@/utils/healthRecordsCleanup';

// Service (rarely needed directly)
import { healthRecordsApiService } from '@/services/modules/healthRecordsApi.enhanced';
```

---

## 📖 Common Use Cases

### 1. Fetch Health Records

```typescript
function HealthRecordsList({ studentId }: { studentId: string }) {
  const { data, isLoading, error, refetch } = useHealthRecords(studentId, {
    type: 'CHECKUP', // Optional filter
  });

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {data?.map(record => (
        <RecordCard key={record.id} record={record} />
      ))}
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

### 2. Create Health Record

```typescript
function CreateRecordForm({ studentId }: { studentId: string }) {
  const createMutation = useCreateHealthRecord();

  const handleSubmit = async (formData: CreateHealthRecordRequest) => {
    try {
      await createMutation.mutateAsync({
        studentId,
        ...formData,
      });
      // Success toast shown automatically
      // Cache invalidated automatically
    } catch (error) {
      // Error handled automatically
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### 3. Update Health Record

```typescript
function EditRecordForm({ recordId, initialData }) {
  const updateMutation = useUpdateHealthRecord();

  const handleUpdate = async (formData) => {
    await updateMutation.mutateAsync({
      id: recordId,
      data: formData,
    });
    // Optimistic update applied automatically
    // Rollback on error automatic
  };

  return <form onSubmit={handleUpdate}>{/* ... */}</form>;
}
```

### 4. Delete Health Record

```typescript
function DeleteRecordButton({ recordId }) {
  const deleteMutation = useDeleteHealthRecord();

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      await deleteMutation.mutateAsync(recordId);
      // Record removed from cache automatically
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleteMutation.isPending}
    >
      Delete
    </button>
  );
}
```

### 5. Fetch with Filters

```typescript
function FilteredRecords({ studentId }) {
  const [filters, setFilters] = useState<HealthRecordFilters>({
    type: 'CHECKUP',
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
  });

  const { data } = useHealthRecords(studentId, filters);

  return (
    <div>
      <FilterForm filters={filters} onChange={setFilters} />
      <RecordsList records={data} />
    </div>
  );
}
```

### 6. Search Health Records

```typescript
function SearchRecords({ studentId }) {
  const [query, setQuery] = useState('');

  const { data, isLoading } = useSearchHealthRecords(
    query,
    { studentId },
    {
      enabled: query.length >= 2, // Only search when 2+ chars
    }
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search records..."
      />
      {isLoading && <Loading />}
      {data?.map(record => <RecordCard key={record.id} record={record} />)}
    </div>
  );
}
```

### 7. Allergies Management

```typescript
function AllergiesTab({ studentId }) {
  const { data: allergies, isLoading } = useAllergies(studentId);
  const createMutation = useCreateAllergy();
  const deleteMutation = useDeleteAllergy();

  const handleAdd = async (allergyData: CreateAllergyRequest) => {
    await createMutation.mutateAsync({
      studentId,
      ...allergyData,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync({ id, studentId });
  };

  return (
    <div>
      {allergies?.map(allergy => (
        <AllergyCard
          key={allergy.id}
          allergy={allergy}
          onDelete={() => handleDelete(allergy.id)}
        />
      ))}
      <AddAllergyButton onAdd={handleAdd} />
    </div>
  );
}
```

### 8. Health Summary Dashboard

```typescript
function HealthSummaryDashboard({ studentId }) {
  const { data: summary, isLoading, error } = useHealthSummary(studentId);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;
  if (!summary) return null;

  return (
    <div>
      <StudentInfo student={summary.student} />

      <Section title="Allergies">
        {summary.allergies.map(allergy => (
          <AllergyBadge key={allergy.id} allergy={allergy} />
        ))}
      </Section>

      <Section title="Chronic Conditions">
        {summary.chronicConditions.map(condition => (
          <ConditionCard key={condition.id} condition={condition} />
        ))}
      </Section>

      <Section title="Alerts">
        {summary.alerts.map(alert => (
          <AlertBanner key={alert.id} alert={alert} />
        ))}
      </Section>

      <CompletionScore score={summary.completeness} />
    </div>
  );
}
```

---

## 🛡️ Error Boundary Setup

### Wrap Your Component

```typescript
import { HealthRecordsErrorBoundaryWrapper } from '@/components/healthRecords/HealthRecordsErrorBoundary';

function HealthRecordsPage({ studentId }) {
  return (
    <HealthRecordsErrorBoundaryWrapper studentId={studentId}>
      <HealthRecordsContent studentId={studentId} />
    </HealthRecordsErrorBoundaryWrapper>
  );
}
```

### Using HOC

```typescript
import { withHealthRecordsErrorBoundary } from '@/components/healthRecords/HealthRecordsErrorBoundary';

const HealthRecordsContent = ({ studentId }) => {
  // Your component
};

export default withHealthRecordsErrorBoundary(HealthRecordsContent);
```

### Custom Fallback

```typescript
<HealthRecordsErrorBoundaryWrapper
  studentId={studentId}
  fallback={<CustomErrorUI />}
  onError={(error, errorInfo) => {
    console.error('Health records error:', error);
  }}
>
  <HealthRecordsContent />
</HealthRecordsErrorBoundaryWrapper>
```

---

## 🔐 HIPAA Compliance

### Session Monitoring

```typescript
import { SessionMonitor, logCleanupEvent } from '@/utils/healthRecordsCleanup';

function HealthRecordsPage() {
  const [sessionMonitor] = useState(() =>
    new SessionMonitor({
      timeoutMs: 15 * 60 * 1000, // 15 minutes
      warningMs: 13 * 60 * 1000, // 13 minutes

      onWarning: (remainingTime) => {
        const minutes = Math.floor(remainingTime / 1000 / 60);
        toast.error(`Session expires in ${minutes} minutes`);
      },

      onTimeout: () => {
        handleLogout();
      },
    })
  );

  useEffect(() => {
    sessionMonitor.start();
    return () => sessionMonitor.stop();
  }, [sessionMonitor]);

  return <HealthRecordsContent />;
}
```

### Automatic Cleanup

```typescript
import { useHealthRecordsCleanup } from '@/hooks/useHealthRecords';

function HealthRecordsPage({ studentId }) {
  // Automatically cleans up PHI on unmount
  useHealthRecordsCleanup(studentId);

  return <HealthRecordsContent />;
}
```

### Manual Cleanup

```typescript
import { clearAllPHI } from '@/utils/healthRecordsCleanup';

const handleLogout = async () => {
  await clearAllPHI(queryClient, {
    clearCache: true,
    clearLocalStorage: true,
    clearSessionStorage: true,
    logAudit: true,
  });

  // Redirect to login
  window.location.href = '/login';
};
```

### Audit Logging

```typescript
import { logCleanupEvent } from '@/utils/healthRecordsCleanup';

// Log custom events
logCleanupEvent('CUSTOM_ACTION', {
  userId: user.id,
  studentId: student.id,
  details: { /* ... */ },
});

// View audit log (development only)
import { getAuditLog } from '@/utils/healthRecordsCleanup';
console.table(getAuditLog());
```

---

## ⚡ Performance Tips

### Configure Stale Time

```typescript
// Critical data - cache longer
const { data: allergies } = useAllergies(studentId, {
  staleTime: 10 * 60 * 1000, // 10 minutes
});

// Frequently updated - cache shorter
const { data: summary } = useHealthSummary(studentId, {
  staleTime: 2 * 60 * 1000, // 2 minutes
});

// Never cache
const { data: realtime } = useHealthRecords(studentId, filters, {
  staleTime: 0,
});
```

### Prefetch Data

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { healthRecordsKeys } from '@/hooks/useHealthRecords';

function StudentSelector() {
  const queryClient = useQueryClient();

  const handleStudentHover = (studentId: string) => {
    // Prefetch on hover
    queryClient.prefetchQuery({
      queryKey: healthRecordsKeys.summary(studentId),
      queryFn: () => healthRecordsApiService.getHealthSummary(studentId),
    });
  };

  return <select onMouseEnter={handleStudentHover}>{/* ... */}</select>;
}
```

### Lazy Loading

```typescript
const AllergiesTab = lazy(() => import('./tabs/AllergiesTab'));
const ChronicConditionsTab = lazy(() => import('./tabs/ChronicConditionsTab'));

function HealthRecords() {
  return (
    <Suspense fallback={<Loading />}>
      {activeTab === 'allergies' && <AllergiesTab />}
      {activeTab === 'chronic' && <ChronicConditionsTab />}
    </Suspense>
  );
}
```

---

## 🧪 Testing Examples

### Test Component with Hook

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHealthRecords } from '@/hooks/useHealthRecords';

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
    expect(result.current.data).toHaveLength(5);
  });
});
```

### Test Component with Mutation

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreateRecordForm from './CreateRecordForm';

describe('CreateRecordForm', () => {
  it('should create health record', async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateRecordForm studentId="student-1" />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Annual Checkup' },
    });

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(screen.getByText('Health record created successfully')).toBeInTheDocument();
    });
  });
});
```

### Mock Service

```typescript
import { healthRecordsApiService } from '@/services/modules/healthRecordsApi.enhanced';

jest.mock('@/services/modules/healthRecordsApi.enhanced');

const mockService = healthRecordsApiService as jest.Mocked<typeof healthRecordsApiService>;

beforeEach(() => {
  mockService.getStudentHealthRecords.mockResolvedValue([
    { id: '1', type: 'CHECKUP', /* ... */ },
  ]);
});

test('should display records', async () => {
  render(<HealthRecordsList studentId="student-1" />);

  await waitFor(() => {
    expect(screen.getByText('Annual Checkup')).toBeInTheDocument();
  });
});
```

---

## 🐛 Common Issues & Solutions

### Issue: Query Not Fetching

```typescript
// ❌ Problem: enabled is false
const { data } = useHealthRecords(studentId, filters, {
  enabled: false, // Query won't run!
});

// ✅ Solution: Check enabled condition
const { data } = useHealthRecords(studentId, filters, {
  enabled: !!studentId, // Ensure it's truthy
});
```

### Issue: Stale Data

```typescript
// ❌ Problem: Cache is stale
const { data } = useHealthRecords(studentId);
// Showing old data

// ✅ Solution: Invalidate or refetch
import { useQueryClient } from '@tanstack/react-query';
import { healthRecordsKeys } from '@/hooks/useHealthRecords';

const queryClient = useQueryClient();

// Option 1: Invalidate
queryClient.invalidateQueries({
  queryKey: healthRecordsKeys.records(studentId),
});

// Option 2: Refetch
const { refetch } = useHealthRecords(studentId);
refetch();

// Option 3: Reduce staleTime
const { data } = useHealthRecords(studentId, filters, {
  staleTime: 0, // Always fresh
});
```

### Issue: Session Not Timing Out

```typescript
// ❌ Problem: Monitor not started
const sessionMonitor = new SessionMonitor({ /* ... */ });
// Forgot to start!

// ✅ Solution: Start monitor
useEffect(() => {
  sessionMonitor.start();
  return () => sessionMonitor.stop();
}, [sessionMonitor]);
```

### Issue: Error Not Caught

```typescript
// ❌ Problem: Async error in useEffect
useEffect(() => {
  throw new Error('Not caught by error boundary!');
}, []);

// ✅ Solution: Use hook error handling
const { error } = useHealthRecords(studentId);

if (error) {
  // Handle error
}
```

---

## 📚 API Reference

### Query Hooks

| Hook | Description | Parameters |
|------|-------------|------------|
| `useHealthRecords()` | Fetch health records | `studentId, filters?, options?` |
| `useHealthRecord()` | Fetch single record | `id, options?` |
| `useAllergies()` | Fetch allergies | `studentId, options?` |
| `useChronicConditions()` | Fetch chronic conditions | `studentId, options?` |
| `useVaccinations()` | Fetch vaccinations | `studentId, options?` |
| `useGrowthMeasurements()` | Fetch growth data | `studentId, options?` |
| `useScreenings()` | Fetch screenings | `studentId, options?` |
| `useRecentVitals()` | Fetch recent vitals | `studentId, limit?, options?` |
| `useHealthSummary()` | Fetch health summary | `studentId, options?` |
| `useSearchHealthRecords()` | Search records | `query, filters?, options?` |

### Mutation Hooks

| Hook | Description | Parameters |
|------|-------------|------------|
| `useCreateHealthRecord()` | Create record | `options?` |
| `useUpdateHealthRecord()` | Update record | `options?` |
| `useDeleteHealthRecord()` | Delete record | `options?` |
| `useCreateAllergy()` | Create allergy | `options?` |
| `useUpdateAllergy()` | Update allergy | `options?` |
| `useDeleteAllergy()` | Delete allergy | `options?` |
| `useVerifyAllergy()` | Verify allergy | `options?` |
| `useCreateChronicCondition()` | Create condition | `options?` |
| `useUpdateChronicCondition()` | Update condition | `options?` |
| `useDeleteChronicCondition()` | Delete condition | `options?` |
| `useCreateVaccination()` | Create vaccination | `options?` |
| `useUpdateVaccination()` | Update vaccination | `options?` |
| `useDeleteVaccination()` | Delete vaccination | `options?` |
| `useRecordVitals()` | Record vitals | `options?` |
| `useExportHealthHistory()` | Export health data | `options?` |
| `useImportHealthRecords()` | Import health data | `options?` |

### Utility Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `clearHealthRecordsCache()` | Clear React Query cache | `queryClient` |
| `clearSensitiveStorage()` | Clear browser storage | `options?` |
| `clearAllPHI()` | Clear all PHI data | `queryClient, options?` |
| `logCleanupEvent()` | Log audit event | `event, details?` |
| `getAuditLog()` | Get audit log | - |
| `SessionMonitor` | Monitor session | `options` |

---

## 🔗 Related Documentation

- [Architecture Guide](./HEALTH_RECORDS_SOA_REFACTORING.md)
- [Migration Guide](./HEALTH_RECORDS_MIGRATION_GUIDE.md)
- [Executive Summary](./HEALTH_RECORDS_REFACTORING_SUMMARY.md)

---

**Last Updated:** 2025-10-10
**Version:** 1.0.0
