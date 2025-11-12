# Data Fetching Patterns Guide

## Overview

This guide documents the proper data fetching patterns for the White Cross healthcare application, following Next.js 14+ best practices with TanStack Query and server actions.

## Architecture

The application uses a **three-tier data fetching architecture**:

1. **Server Actions** (`/app/*/actions.ts`) - Server-side data fetching with caching
2. **TanStack Query Hooks** - Client-side data management and caching
3. **React Components** - UI that consumes data

## Pattern 1: Server Component with Server Actions (Preferred)

**When to use**: For pages that can be fully rendered on the server with initial data.

```typescript
// app/(dashboard)/budget/page.tsx (Server Component)
import { getBudgetSummary, getBudgetCategories } from './actions';

export default async function BudgetPage() {
  // Fetch data directly in Server Component
  const [summary, categories] = await Promise.all([
    getBudgetSummary(),
    getBudgetCategories(),
  ]);

  // Pass data as props to Client Component
  return (
    <BudgetContent
      initialSummary={summary}
      initialCategories={categories}
    />
  );
}
```

```typescript
// app/(dashboard)/budget/_components/BudgetContent.tsx (Client Component)
'use client';

export function BudgetContent({ initialSummary, initialCategories }) {
  // Use initial data immediately, then optionally refetch with TanStack Query
  const { data: summary = initialSummary } = useQuery({
    queryKey: ['budgetSummary'],
    queryFn: () => getBudgetSummary(),
    initialData: initialSummary,
  });

  return <div>{/* Render UI */}</div>;
}
```

**Benefits**:
- ✅ Fast initial page load (server-rendered)
- ✅ SEO-friendly
- ✅ Reduced client-side JavaScript
- ✅ Automatic caching via Next.js

## Pattern 2: Client Component with TanStack Query

**When to use**: For interactive components that need real-time data updates, filtering, or pagination.

```typescript
// app/(dashboard)/analytics/_components/AnalyticsContent.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getAnalyticsMetrics } from '@/app/analytics/actions';

export function AnalyticsContent({ searchParams }: Props) {
  // Fetch data client-side with TanStack Query
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['analyticsMetrics', searchParams],
    queryFn: async () => {
      const result = await getAnalyticsMetrics(searchParams);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} />;

  return <div>{/* Render UI with metrics */}</div>;
}
```

**Benefits**:
- ✅ Real-time updates with background refetching
- ✅ Automatic caching and deduplication
- ✅ Built-in loading and error states
- ✅ Optimistic updates support

## Pattern 3: Server Component with Prefetching (Advanced)

**When to use**: For optimal performance with streaming and Suspense boundaries.

```typescript
// app/(dashboard)/reports/page.tsx
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getReports } from './actions';

export default async function ReportsPage() {
  const queryClient = new QueryClient();

  // Prefetch data on server
  await queryClient.prefetchQuery({
    queryKey: ['reports'],
    queryFn: () => getReports(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReportsContent />
    </HydrationBoundary>
  );
}
```

```typescript
// _components/ReportsContent.tsx
'use client';

export function ReportsContent() {
  // Data is already prefetched and hydrated
  const { data } = useQuery({
    queryKey: ['reports'],
    queryFn: () => getReports(),
  });

  return <div>{/* Instant render with prefetched data */}</div>;
}
```

**Benefits**:
- ✅ Zero loading state on initial render
- ✅ Streaming SSR support
- ✅ Automatic revalidation
- ✅ Works with Suspense boundaries

## Server Actions Best Practices

### 1. Use `'use server'` Directive

```typescript
// app/students/actions.ts
'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';

export const getStudents = cache(async (filters) => {
  // Fetch from backend
  const response = await serverGet('/api/students', filters);
  return response.data;
});
```

### 2. Implement Proper Caching

```typescript
export const getStudent = cache(async (id: string) => {
  const response = await serverGet(
    `/api/students/${id}`,
    undefined,
    {
      cache: 'force-cache',
      next: {
        revalidate: 300, // 5 minutes
        tags: [`student-${id}`, 'students-list'],
      },
    }
  );
  return response.data;
});
```

### 3. Invalidate Cache on Mutations

```typescript
export async function updateStudent(id: string, data: StudentData) {
  // Update student
  const response = await serverPut(`/api/students/${id}`, data);

  // Invalidate related caches
  revalidateTag(`student-${id}`);
  revalidateTag('students-list');
  revalidatePath('/students');

  return response;
}
```

## TanStack Query Configuration

### Query Keys Structure

Use hierarchical query keys for better cache management:

```typescript
// Good - Hierarchical
['budgets', 'list', { fiscalYear: 2025, status: 'active' }]
['budgets', 'detail', budgetId]
['budgets', 'summary', { fiscalYear: 2025 }]

// Bad - Flat
['budgets-list']
['budget-detail']
```

### Query Options

```typescript
useQuery({
  queryKey: ['students', filters],
  queryFn: () => getStudents(filters),

  // Caching
  staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
  gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes

  // Refetching
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchOnMount: true,

  // Retry logic
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

  // Metadata (HIPAA compliance)
  meta: {
    containsPHI: true, // Mark PHI data for audit logging
    errorMessage: 'Failed to load students',
  },
});
```

## Loading States

### Option 1: Component-Level Loading

```typescript
function Component() {
  const { data, isLoading } = useQuery(...);

  if (isLoading) return <LoadingSkeleton />;
  if (!data) return <EmptyState />;

  return <Content data={data} />;
}
```

### Option 2: Suspense Boundaries

```typescript
// page.tsx (Server Component)
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Content />
    </Suspense>
  );
}
```

## Error Handling

### Option 1: Component-Level Error Handling

```typescript
function Component() {
  const { data, error, isError } = useQuery(...);

  if (isError) {
    return (
      <ErrorState
        title="Failed to load data"
        message={error.message}
        retry={() => refetch()}
      />
    );
  }

  return <Content data={data} />;
}
```

### Option 2: Error Boundaries

```typescript
// error.tsx (Next.js error boundary)
'use client';

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

## Anti-Patterns to Avoid

### ❌ DON'T: Use setTimeout to Simulate API Calls

```typescript
// BAD
useEffect(() => {
  const timer = setTimeout(() => {
    setData(mockData);
    setLoading(false);
  }, 800);
  return () => clearTimeout(timer);
}, []);
```

### ❌ DON'T: Fetch in useEffect Without Proper Cleanup

```typescript
// BAD
useEffect(() => {
  fetchData().then(setData);
}, []); // No cleanup, no loading state, no error handling
```

### ❌ DON'T: Mix Server and Client Data Fetching

```typescript
// BAD - Mixing patterns
export default async function Page() {
  const data = await serverFetch(); // Server
  return <ClientComponent />; // Client fetches again
}
```

### ❌ DON'T: Use Client API in Server Components

```typescript
// BAD
export default async function Page() {
  const data = await clientGet('/api/data'); // Wrong client!
  // Should use serverGet
}
```

## Migration Guide

### Migrating from Mock Data to Real Data Fetching

**Before:**
```typescript
'use client';

export function Component() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // ...
}
```

**After:**
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { getData } from '@/app/domain/actions';

export function Component() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: () => getData(),
    staleTime: 5 * 60 * 1000,
  });

  // ...
}
```

## Performance Optimization

### 1. Enable Query Deduplication

TanStack Query automatically deduplicates identical queries:

```typescript
// Both components make the same query, but only one request is made
function ComponentA() {
  const { data } = useQuery({ queryKey: ['students'], queryFn: getStudents });
}

function ComponentB() {
  const { data } = useQuery({ queryKey: ['students'], queryFn: getStudents });
}
```

### 2. Use Pagination for Large Lists

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['students', 'paginated'],
  queryFn: ({ pageParam = 0 }) => getStudents({ page: pageParam }),
  getNextPageParam: (lastPage) => lastPage.nextPage,
});
```

### 3. Prefetch Related Data

```typescript
const queryClient = useQueryClient();

// Prefetch on hover
function StudentCard({ studentId }) {
  return (
    <div
      onMouseEnter={() => {
        queryClient.prefetchQuery({
          queryKey: ['student', studentId],
          queryFn: () => getStudent(studentId),
        });
      }}
    >
      {/* Card content */}
    </div>
  );
}
```

## HIPAA Compliance

### PHI Data Marking

All queries containing PHI must be marked in metadata:

```typescript
useQuery({
  queryKey: ['healthRecords', studentId],
  queryFn: () => getHealthRecords(studentId),
  meta: {
    containsPHI: true, // REQUIRED for PHI data
    auditLog: true, // Enable audit logging
  },
});
```

### Cache Exclusion for PHI

PHI data should not be persisted to localStorage:

```typescript
// queryClient.ts configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // PHI data excluded from persistence
      meta: { containsPHI: false },
    },
  },
});
```

## Testing Data Fetching

### Unit Tests

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

test('fetches students', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const { result } = renderHook(() => useStudents(), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toHaveLength(10);
});
```

## Summary

**Recommended Patterns by Use Case:**

| Use Case | Pattern | Why |
|----------|---------|-----|
| Static page data | Server Component + Server Actions | Best performance, SEO |
| Interactive lists | Client + TanStack Query | Real-time updates, filtering |
| Dashboard metrics | Client + TanStack Query + Polling | Live data, auto-refresh |
| Forms | Client + Mutations | Optimistic updates, validation |
| Reports | Server Component + Prefetch | Fast initial load, background sync |

**Key Principles:**

1. ✅ Use server actions for all backend communication
2. ✅ Wrap server actions in TanStack Query for client components
3. ✅ Prefer Server Components when possible
4. ✅ Use proper loading and error states
5. ✅ Mark PHI data in query metadata
6. ✅ Implement proper cache invalidation
7. ✅ Use hierarchical query keys
8. ✅ Never use mock data with setTimeout

---

For more information, see:
- [Next.js Data Fetching Docs](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [CLAUDE.md](./CLAUDE.md) - Project architecture guide
