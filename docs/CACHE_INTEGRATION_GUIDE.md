# Cache Infrastructure Integration Guide

Quick start guide for integrating the enterprise caching system into your feature development.

## 1. App Initialization

Add to your app's initialization (usually `main.tsx` or `App.tsx`):

```typescript
import { initializeCacheInfrastructure, clearAllCaches } from '@/services/cache';
import { queryClient } from './config/queryClient'; // Your React Query client

// Initialize on app start
async function initializeApp() {
  try {
    await initializeCacheInfrastructure(queryClient);
    console.log('Cache infrastructure ready');
  } catch (error) {
    console.error('Cache initialization failed:', error);
    // App continues to work, just without advanced caching
  }
}

// Call on app mount
initializeApp();

// Clear caches on logout
function handleLogout() {
  await clearAllCaches();
  // ... rest of logout logic
}
```

## 2. Using Query Keys in Queries

Replace manual query keys with QueryKeyFactory:

### Before:
```typescript
const { data } = useQuery({
  queryKey: ['students', 'detail', studentId],
  queryFn: () => fetchStudent(studentId)
});
```

### After:
```typescript
import { queryKeys } from '@/services/cache';

const { data } = useQuery({
  queryKey: queryKeys.students.detail(studentId),
  queryFn: () => fetchStudent(studentId)
});
```

## 3. Using Granular Invalidation in Mutations

Replace manual invalidation with InvalidationStrategy:

### Before:
```typescript
const updateStudent = useMutation({
  mutationFn: updateStudentApi,
  onSuccess: () => {
    // Over-aggressive invalidation
    queryClient.invalidateQueries({ queryKey: ['students'] });
    queryClient.invalidateQueries({ queryKey: ['students', 'stats'] });
  }
});
```

### After:
```typescript
import {
  getInvalidationStrategy,
  createStudentUpdateOperation
} from '@/services/cache';

const updateStudent = useMutation({
  mutationFn: updateStudentApi,
  onSuccess: async (result, { id, data }, context) => {
    const invalidationStrategy = getInvalidationStrategy(queryClient);

    // Determine operation type
    let operationType = 'update';
    if (data.grade) operationType = 'update-grade';
    else if (data.schoolId) operationType = 'update-school';
    else if (data.isActive !== undefined) operationType = 'update-status';

    // Granular invalidation
    await invalidationStrategy.invalidate(
      createStudentUpdateOperation(
        operationType,
        id,
        context?.previousValues,
        data
      )
    );
  }
});
```

## 4. Adding Optimistic Updates

For instant UI feedback on mutations:

```typescript
import {
  getOptimisticUpdateManager,
  QueryKeyFactory
} from '@/services/cache';
import { queryKeys } from '@/services/cache';

const updateStudent = useMutation({
  mutationFn: updateStudentApi,

  // Before mutation: Create optimistic update
  onMutate: async ({ id, data }) => {
    const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);
    const queryKey = QueryKeyFactory.toString(queryKeys.students.detail(id));

    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: queryKeys.students.detail(id) });

    // Get previous data for rollback
    const previousStudent = queryClient.getQueryData(queryKeys.students.detail(id));

    if (previousStudent) {
      // Create optimistic update
      const optimisticStudent = {
        ...previousStudent,
        ...data,
        version: (previousStudent.version || 0) + 1
      };

      const updateId = optimisticUpdateManager.createUpdate({
        queryKey,
        previousData: previousStudent,
        optimisticData: optimisticStudent,
        version: previousStudent.version || 0,
        mutationId: `update-${id}-${Date.now()}`
      });

      return { previousStudent, updateId };
    }

    return { previousStudent: undefined, updateId: undefined };
  },

  // On success: Commit optimistic update
  onSuccess: async (result, { id, data }, context) => {
    const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);

    if (context?.updateId) {
      await optimisticUpdateManager.commitUpdate(context.updateId, result);
    } else {
      queryClient.setQueryData(queryKeys.students.detail(id), result);
    }

    // ... invalidation logic
  },

  // On error: Rollback optimistic update
  onError: (error, { id, data }, context) => {
    const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);

    if (context?.updateId) {
      optimisticUpdateManager.rollbackUpdate(context.updateId);
    }
  }
});
```

## 5. Adding Prefetch on Hover

For list items that link to detail pages:

```typescript
import { usePrefetchListItem } from '@/hooks/shared/usePrefetch';
import { queryKeys } from '@/services/cache';

function StudentListItem({ student }) {
  const { hoverProps } = usePrefetchListItem(
    student.id,
    (id) => queryKeys.students.detail(id),
    (id) => () => studentsApi.getById(id),
    {
      hoverDelay: 100, // Wait 100ms before prefetching
      onlyWhenIdle: true // Only prefetch when network is idle
    }
  );

  return (
    <Link to={`/students/${student.id}`} {...hoverProps}>
      <h3>{student.name}</h3>
      <p>{student.grade}</p>
    </Link>
  );
}
```

## 6. Prefetching Next Page

For paginated lists:

```typescript
import { usePrefetchNextPage } from '@/hooks/shared/usePrefetch';
import { queryKeys } from '@/services/cache';

function StudentList({ page }) {
  const { data, hasNextPage } = useQuery({
    queryKey: queryKeys.students.list({ page }),
    queryFn: () => fetchStudents(page)
  });

  // Automatically prefetch next page when network is idle
  usePrefetchNextPage(
    page,
    hasNextPage,
    (pageNum) => queryKeys.students.list({ page: pageNum }),
    (pageNum) => () => fetchStudents(pageNum)
  );

  return (
    // ... render list
  );
}
```

## 7. Creating Custom Query Keys

For new entities not yet in the factory:

```typescript
import { QueryKeyFactory } from '@/services/cache';

// Create custom query keys
export const customEntityKeys = {
  all: () => QueryKeyFactory.create({
    entity: 'custom-entity',
    operation: 'all'
  }),

  lists: () => QueryKeyFactory.create({
    entity: 'custom-entity',
    operation: 'list'
  }),

  list: (filters?: Record<string, unknown>) =>
    QueryKeyFactory.create({
      entity: 'custom-entity',
      operation: 'list',
      filters
    }),

  detail: (id: string | number) =>
    QueryKeyFactory.create({
      entity: 'custom-entity',
      operation: 'detail',
      id
    })
};
```

## 8. Registering Custom Invalidation Rules

For new entities:

```typescript
import { getInvalidationStrategy } from '@/services/cache';
import type { InvalidationRule } from '@/services/cache';

const customRule: InvalidationRule = {
  operationPattern: /^create$/i,
  entityType: 'custom-entity',
  getInvalidationTargets: (operation) => [
    {
      queryKey: /^\["custom-entity","list"/,
      refetch: true
    },
    {
      queryKey: /^\["custom-entity","stats"\]/,
      refetch: true
    }
  ]
};

// Register during app initialization
const invalidationStrategy = getInvalidationStrategy(queryClient);
invalidationStrategy.registerRule('custom-entity', customRule);
```

## 9. Monitoring Cache Performance

In development:

```typescript
import { getCacheInfrastructureStats } from '@/services/cache';

// In a debug panel or dev tools
async function showCacheStats() {
  const stats = await getCacheInfrastructureStats();

  console.table({
    'In-Memory Hit Rate': `${(stats.inMemory.hitRate * 100).toFixed(1)}%`,
    'In-Memory Size': stats.inMemory.size,
    'Memory Usage': `${(stats.inMemory.memoryUsage / 1024 / 1024).toFixed(2)}MB`,
    'Persisted Entries': stats.persisted.totalEntries,
    'Persisted Size': `${(stats.persisted.totalSize / 1024).toFixed(2)}KB`,
    'Pending Updates': stats.optimisticUpdates.pendingCount,
    'Queued Mutations': stats.optimisticUpdates.queuedMutationsCount
  });
}
```

## 10. Common Patterns

### Pattern: List + Detail with Prefetch

```typescript
// List component
function EntityList() {
  const { data } = useQuery({
    queryKey: queryKeys.entities.list(),
    queryFn: fetchEntities
  });

  return data?.map(entity => (
    <EntityListItem key={entity.id} entity={entity} />
  ));
}

// List item with prefetch
function EntityListItem({ entity }) {
  const { hoverProps } = usePrefetchListItem(
    entity.id,
    (id) => queryKeys.entities.detail(id),
    (id) => () => fetchEntity(id)
  );

  return (
    <Link to={`/entities/${entity.id}`} {...hoverProps}>
      {entity.name}
    </Link>
  );
}

// Detail component (data already prefetched!)
function EntityDetail({ id }) {
  const { data } = useQuery({
    queryKey: queryKeys.entities.detail(id),
    queryFn: () => fetchEntity(id)
  });

  return <div>{data?.name}</div>;
}
```

### Pattern: Mutation with Full Stack

```typescript
const updateEntity = useMutation({
  mutationFn: updateEntityApi,

  // Optimistic update
  onMutate: async ({ id, data }) => {
    const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);
    const queryKey = QueryKeyFactory.toString(queryKeys.entities.detail(id));

    await queryClient.cancelQueries({ queryKey: queryKeys.entities.detail(id) });

    const previousEntity = queryClient.getQueryData(queryKeys.entities.detail(id));

    if (previousEntity) {
      const optimisticEntity = { ...previousEntity, ...data };
      const updateId = optimisticUpdateManager.createUpdate({
        queryKey,
        previousData: previousEntity,
        optimisticData: optimisticEntity,
        version: previousEntity.version || 0,
        mutationId: `update-${id}-${Date.now()}`
      });

      return { previousEntity, updateId };
    }
  },

  // Success: Commit + invalidate
  onSuccess: async (result, { id, data }, context) => {
    const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);
    const invalidationStrategy = getInvalidationStrategy(queryClient);

    // Commit optimistic update
    if (context?.updateId) {
      await optimisticUpdateManager.commitUpdate(context.updateId, result);
    }

    // Granular invalidation
    await invalidationStrategy.invalidate({
      operationType: 'update',
      entity: 'entities',
      entityId: id,
      changedFields: Object.keys(data),
      previousValues: context?.previousEntity,
      newValues: result
    });
  },

  // Error: Rollback
  onError: (error, { id }, context) => {
    const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);

    if (context?.updateId) {
      optimisticUpdateManager.rollbackUpdate(context.updateId);
    }
  }
});
```

## Troubleshooting

### Cache Not Working

1. Check if initialized:
```typescript
import { getCacheManager } from '@/services/cache';
const manager = getCacheManager();
console.log('Cache stats:', manager.getStats());
```

2. Verify query keys are from factory:
```typescript
// ❌ Don't do this
queryKey: ['students', studentId]

// ✅ Do this
queryKey: queryKeys.students.detail(studentId)
```

### Invalidation Not Working

1. Check operation type matches pattern:
```typescript
// Operation types must match patterns in InvalidationStrategy
// Valid: 'update-grade', 'update-school', 'create', 'delete'
// Invalid: 'updateGrade', 'update_grade'
```

2. Enable debug logging:
```typescript
console.log('[Invalidation]', {
  operationType: 'update-grade',
  entity: 'students',
  entityId: studentId
});
```

### Optimistic Updates Not Showing

1. Ensure version field exists in data:
```typescript
interface Student {
  id: string;
  name: string;
  version?: number; // Required for conflict detection
}
```

2. Check if previous data exists:
```typescript
const previousData = queryClient.getQueryData(queryKey);
if (!previousData) {
  console.warn('No cached data for optimistic update');
}
```

## Best Practices Checklist

- [ ] Initialize cache infrastructure on app start
- [ ] Use QueryKeyFactory for all query keys
- [ ] Implement granular invalidation for mutations
- [ ] Add optimistic updates for better UX
- [ ] Prefetch on user intent (hover, navigation)
- [ ] Monitor cache hit rates in development
- [ ] Never persist PHI data
- [ ] Set appropriate TTLs for data types
- [ ] Clear caches on logout
- [ ] Test optimistic update rollbacks

## Next Steps

1. ✅ Integrate into student mutations (completed)
2. [ ] Integrate into health record mutations
3. [ ] Integrate into medication mutations
4. [ ] Add prefetching to all list views
5. [ ] Monitor and tune cache performance
6. [ ] Extend to all entity types

---

For more details, see:
- [README.md](./README.md) - Full documentation
- [types.ts](./types.ts) - Type definitions
- [ENTERPRISE_CACHING_IMPLEMENTATION.md](../../../ENTERPRISE_CACHING_IMPLEMENTATION.md) - Implementation summary
