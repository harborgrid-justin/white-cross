# Data Fetching Quick Reference

**Quick guide for implementing proper data fetching patterns**

---

## ⚡ Quick Start

### Pattern 1: Client Component with TanStack Query (Most Common)

```typescript
'use client';

import { useServerQuery } from '@/lib/react-query/useServerAction';
import { getStudents } from '@/app/students/actions';

export function StudentsContent() {
  const { data, isLoading, error } = useServerQuery({
    queryKey: ['students', 'list'],
    action: () => getStudents(),
    staleTime: 5 * 60 * 1000, // 5 min
  });

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} />;

  return <div>{/* Render data */}</div>;
}
```

### Pattern 2: With Filters

```typescript
const { data, isLoading } = useServerQuery({
  queryKey: ['students', 'list', { grade, status }],
  action: () => getStudents({ grade, status }),
});
```

### Pattern 3: With Mutations

```typescript
const mutation = useServerMutation({
  action: createStudent,
  invalidateQueries: [['students', 'list']],
  onSuccess: () => toast.success('Student created'),
});

// In your form
mutation.mutate(formData);
```

---

## 📋 Migration Checklist

Migrating from mock data to real data fetching:

- [ ] Remove mock data constants
- [ ] Remove `setTimeout` in `useEffect`
- [ ] Import server action from `/app/domain/actions.ts`
- [ ] Replace `useState` + `useEffect` with `useServerQuery`
- [ ] Update type imports to use server action types
- [ ] Test loading states
- [ ] Test error states
- [ ] Verify data displays correctly

---

## 🔧 Common Patterns

### PHI Data

```typescript
useServerQuery({
  queryKey: ['healthRecords', studentId],
  action: () => getHealthRecords(studentId),
  meta: { containsPHI: true }, // REQUIRED for PHI
  staleTime: 2 * 60 * 1000, // Shorter cache for PHI
});
```

### Real-time Data

```typescript
useServerQuery({
  queryKey: ['notifications'],
  action: () => getNotifications(),
  staleTime: 30 * 1000, // 30 seconds
  refetchInterval: 30 * 1000, // Poll every 30s
});
```

### Paginated Data

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['students', 'paginated'],
  queryFn: ({ pageParam = 0 }) => getStudents({ page: pageParam }),
  getNextPageParam: (lastPage) => lastPage.nextPage,
});
```

---

## ❌ Anti-Patterns (Don't Do This)

### DON'T: Mock data with setTimeout

```typescript
// ❌ BAD
useEffect(() => {
  setTimeout(() => {
    setData(mockData);
    setLoading(false);
  }, 800);
}, []);
```

### DON'T: Fetch without cleanup

```typescript
// ❌ BAD
useEffect(() => {
  fetchData().then(setData); // No cleanup, no error handling
}, []);
```

### DON'T: Mix server and client patterns

```typescript
// ❌ BAD
export default async function Page() {
  const serverData = await getServerData();
  return <ClientComponent />; // Client fetches again!
}
```

---

## 🎯 Query Key Structure

Use hierarchical keys:

```typescript
// ✅ GOOD - Hierarchical
['students', 'list', { grade: '9th' }]
['students', 'detail', studentId]
['budgets', 'summary', { fiscalYear: 2025 }]

// ❌ BAD - Flat
['students-list']
['student-detail']
```

---

## 🔄 Cache Invalidation

### Invalidate on mutation:

```typescript
useServerMutation({
  action: updateStudent,
  invalidateQueries: [
    ['students', 'list'],
    ['students', 'detail', studentId],
  ],
});
```

### Manual invalidation:

```typescript
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ['students'] });
```

---

## 📊 Query Options Presets

```typescript
import { QUERY_DEFAULTS } from '@/lib/react-query/useServerAction';

// PHI data
useServerQuery({
  ...QUERY_DEFAULTS.PHI,
  queryKey: ['healthRecords'],
  action: getHealthRecords,
});

// Static data
useServerQuery({
  ...QUERY_DEFAULTS.STATIC,
  queryKey: ['grades'],
  action: getGrades,
});
```

---

## 🧪 Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@tests/utils';

test('fetches students', async () => {
  const { result } = renderHook(
    () => useServerQuery({
      queryKey: ['students'],
      action: getStudents,
    }),
    { wrapper: createWrapper() }
  );

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toBeDefined();
});
```

---

## 📚 Full Documentation

- **Patterns Guide**: `DATAFETCHING_PATTERNS.md`
- **Full Report**: `DATAFETCHING_REPORT.md`
- **Project Docs**: `CLAUDE.md`

---

## 🆘 Common Issues

### Issue: "Cannot read properties of undefined"

**Solution**: Check loading state before rendering:
```typescript
if (isLoading) return <LoadingSkeleton />;
if (!data) return <EmptyState />;
return <Component data={data} />;
```

### Issue: Data not refetching

**Solution**: Check staleTime and refetch options:
```typescript
useServerQuery({
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
});
```

### Issue: Cache not invalidating

**Solution**: Use proper query keys:
```typescript
// Invalidate all students queries
queryClient.invalidateQueries({ queryKey: ['students'] });

// Invalidate specific student
queryClient.invalidateQueries({ queryKey: ['students', 'detail', id] });
```

---

## 🎓 Examples

### Complete Component Example

```typescript
'use client';

import { useServerQuery, useServerMutation } from '@/lib/react-query/useServerAction';
import { getBudgetSummary, updateBudget } from '@/app/budget/actions';
import { LoadingSkeleton } from '@/components/common/LoadingStates';
import { ErrorState } from '@/components/common/ErrorStates';
import { useToast } from '@/hooks/ui/useToast';

export function BudgetPage() {
  const { toast } = useToast();

  // Query
  const { data, isLoading, error, refetch } = useServerQuery({
    queryKey: ['budget', 'summary', 2025],
    action: () => getBudgetSummary({ fiscalYear: 2025 }),
    staleTime: 5 * 60 * 1000,
  });

  // Mutation
  const updateMutation = useServerMutation({
    action: updateBudget,
    invalidateQueries: [['budget', 'summary']],
    onSuccess: () => {
      toast.success('Budget updated');
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed: ${error.message}`);
    },
  });

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} retry={refetch} />;
  }

  // Empty state
  if (!data) {
    return <EmptyState message="No budget data available" />;
  }

  // Success state
  return (
    <div>
      <h1>Budget Summary</h1>
      <p>Total: ${data.totalBudget}</p>
      <button
        onClick={() => updateMutation.mutate({ amount: 1000 })}
        disabled={updateMutation.isLoading}
      >
        {updateMutation.isLoading ? 'Updating...' : 'Update Budget'}
      </button>
    </div>
  );
}
```

---

**Need help?** Check the full documentation in `DATAFETCHING_PATTERNS.md`
