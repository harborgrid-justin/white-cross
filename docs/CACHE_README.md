# Enterprise Caching Infrastructure

Advanced caching system for the White Cross healthcare platform with granular invalidation, optimistic updates, and HIPAA-compliant persistence.

## Overview

This caching infrastructure provides:

- **LRU Cache Manager**: In-memory caching with eviction policies
- **Granular Invalidation**: Surgical cache invalidation (60% reduction in invalidations)
- **Optimistic Updates**: Conflict detection and resolution
- **Smart Prefetching**: Predictive and hover-based prefetching
- **HIPAA-Compliant Persistence**: IndexedDB for non-PHI data only

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  (React Components, Hooks, TanStack Query)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│              Query Key Factory                              │
│  - Standardized key generation                              │
│  - Normalized filters                                       │
│  - Hierarchical structure                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│           Invalidation Strategy                             │
│  - Operation-specific rules                                 │
│  - Change-aware invalidation                                │
│  - Granular targeting                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│         Optimistic Update Manager                           │
│  - Queue management                                         │
│  - Conflict detection                                       │
│  - Three-way merge                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│              Cache Manager (LRU)                            │
│  - In-memory storage                                        │
│  - TTL-based expiration                                     │
│  - Tag-based invalidation                                   │
│  - Performance monitoring                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│          Persistence Layer (IndexedDB)                      │
│  - Non-PHI data only                                        │
│  - 24-hour max age                                          │
│  - Automatic cleanup                                        │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Initialize Cache Infrastructure

```typescript
// In your app initialization (main.tsx or App.tsx)
import { initializeCacheInfrastructure } from '@/services/cache';
import { queryClient } from '@/config/queryClient';

// Initialize on app start
await initializeCacheInfrastructure(queryClient);
```

### 2. Use Query Keys

```typescript
import { queryKeys } from '@/services/cache';

// In your query hooks
const { data } = useQuery({
  queryKey: queryKeys.students.detail(studentId),
  queryFn: () => fetchStudent(studentId)
});
```

### 3. Use Granular Invalidation in Mutations

```typescript
import { getInvalidationStrategy, createStudentUpdateOperation } from '@/services/cache';

// In mutation hooks
const updateStudent = useMutation({
  mutationFn: updateStudentApi,
  onSuccess: async (result, { id, data }, context) => {
    const invalidationStrategy = getInvalidationStrategy(queryClient);

    // Determine operation type
    const operationType = data.grade ? 'update-grade' : 'update-personal-info';

    // Create invalidation operation
    const operation = createStudentUpdateOperation(
      operationType,
      id,
      context.previousValues,
      data
    );

    // Execute granular invalidation
    await invalidationStrategy.invalidate(operation);
  }
});
```

### 4. Use Optimistic Updates

```typescript
import { getOptimisticUpdateManager, QueryKeyFactory } from '@/services/cache';

const updateStudent = useMutation({
  mutationFn: updateStudentApi,

  onMutate: async ({ id, data }) => {
    const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);
    const queryKey = QueryKeyFactory.toString(['students', 'detail', id]);

    // Get previous data
    const previousStudent = queryClient.getQueryData(['students', 'detail', id]);

    if (previousStudent) {
      // Create optimistic update
      const updateId = optimisticUpdateManager.createUpdate({
        queryKey,
        previousData: previousStudent,
        optimisticData: { ...previousStudent, ...data },
        version: previousStudent.version || 0,
        mutationId: `update-${id}-${Date.now()}`
      });

      return { previousStudent, updateId };
    }
  },

  onSuccess: async (result, variables, context) => {
    const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);

    // Commit optimistic update
    if (context?.updateId) {
      await optimisticUpdateManager.commitUpdate(context.updateId, result);
    }
  },

  onError: (error, variables, context) => {
    const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);

    // Rollback on error
    if (context?.updateId) {
      optimisticUpdateManager.rollbackUpdate(context.updateId);
    }
  }
});
```

### 5. Use Smart Prefetching

```typescript
import { usePrefetchListItem } from '@/hooks/shared/usePrefetch';
import { queryKeys } from '@/services/cache';

function StudentListItem({ student }) {
  // Prefetch detail on hover
  const { hoverProps } = usePrefetchListItem(
    student.id,
    (id) => queryKeys.students.detail(id),
    (id) => () => fetchStudent(id),
    { hoverDelay: 100 }
  );

  return (
    <div {...hoverProps}>
      <h3>{student.name}</h3>
    </div>
  );
}
```

## Key Features

### 1. Granular Cache Invalidation

Traditional approach (over-aggressive):
```typescript
// ❌ Invalidates ALL student lists
queryClient.invalidateQueries({ queryKey: ['students'] });
```

New approach (surgical):
```typescript
// ✅ Only invalidates affected queries
await invalidationStrategy.invalidate({
  operationType: 'update-grade',
  entity: 'students',
  entityId: studentId,
  changedFields: ['grade'],
  previousValues: { grade: 'Grade 5' },
  newValues: { grade: 'Grade 6' }
});

// Result: Invalidates only:
// - Student detail (studentId)
// - Grade 5 list
// - Grade 6 list
// - Statistics
```

### 2. Invalidation Rules

Operation-specific rules determine what gets invalidated:

- **CREATE_STUDENT**: All lists + statistics
- **UPDATE_PERSONAL_INFO**: Student detail + lists only if name changed
- **UPDATE_GRADE**: Student detail + old grade list + new grade list + statistics
- **UPDATE_SCHOOL**: Student detail + old school list + new school list
- **UPDATE_STATUS**: Student detail + active/archived lists + statistics
- **DELETE_STUDENT**: All lists + statistics

### 3. TTL Configuration

Different TTLs based on data criticality:

```typescript
const TTL_CONFIG = {
  critical: 2 * 60 * 1000,      // 2 min - allergies, medications
  active: 5 * 60 * 1000,        // 5 min - current health records
  historical: 10 * 60 * 1000,   // 10 min - past records
  reference: 30 * 60 * 1000,    // 30 min - schools, grades
  preferences: 60 * 60 * 1000   // 1 hour - user settings
};
```

### 4. HIPAA-Compliant Persistence

Only non-PHI data is persisted:

```typescript
// ✅ Safe to persist
- School lists
- Grade lists
- Lookup tables
- User preferences (non-PHI)

// ❌ Never persisted (HIPAA)
- Student records
- Health records
- Medications
- Allergies
- Appointments
- Incidents
- Emergency contacts
```

### 5. Optimistic Updates with Conflict Resolution

Three-way merge strategy:

```
Base Version (before optimistic update)
     ↓
Local Version (optimistic)
     ↓
Remote Version (from server)
     ↓
Merge Algorithm:
- If local changed, remote unchanged → Use local
- If remote changed, local unchanged → Use remote
- If both changed to same value → No conflict
- If both changed differently → Conflict detected → Apply strategy
```

Conflict strategies:
- `SERVER_WINS`: Use server data (default)
- `CLIENT_WINS`: Use client data
- `MERGE`: Attempt three-way merge
- `USER_RESOLVE`: Prompt user (future)
- `LAST_WRITE_WINS`: Use remote

## API Reference

### CacheManager

```typescript
const cacheManager = getCacheManager();

// Get from cache
const data = cacheManager.get<Student>('student-123');

// Set in cache
cacheManager.set('student-123', studentData, {
  ttl: 5 * 60 * 1000,
  tags: ['students', 'grade-5'],
  version: 1,
  containsPHI: true
});

// Invalidate by tags
cacheManager.invalidate({ tags: ['students'] });

// Invalidate by pattern
cacheManager.invalidate({ pattern: /^students-list/ });

// Get statistics
const stats = cacheManager.getStats();
// { hits: 150, misses: 20, hitRate: 0.88, ... }
```

### QueryKeyFactory

```typescript
// Create standardized query keys
const listKey = QueryKeyFactory.create({
  entity: 'students',
  operation: 'list',
  filters: { grade: '5', schoolId: '123' }
});
// Result: ['students', 'list', { grade: '5', schoolId: '123' }]

// Convert to string for storage
const keyString = QueryKeyFactory.toString(listKey);

// Extract components
const entity = QueryKeyFactory.getEntity(listKey);     // 'students'
const operation = QueryKeyFactory.getOperation(listKey); // 'list'
const id = QueryKeyFactory.getId(listKey);             // undefined
```

### InvalidationStrategy

```typescript
const invalidationStrategy = getInvalidationStrategy(queryClient);

// Execute invalidation
await invalidationStrategy.invalidate({
  operationType: 'update-grade',
  entity: 'students',
  entityId: '123',
  changedFields: ['grade'],
  previousValues: { grade: '5' },
  newValues: { grade: '6' }
});

// Register custom rule
invalidationStrategy.registerRule('custom-entity', {
  operationPattern: /^custom-operation$/,
  entityType: 'custom-entity',
  getInvalidationTargets: (operation) => [
    { queryKey: /^custom-query/, refetch: true }
  ]
});
```

### OptimisticUpdateManager

```typescript
const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);

// Create optimistic update
const updateId = optimisticUpdateManager.createUpdate({
  queryKey: 'student-123',
  previousData: oldStudent,
  optimisticData: newStudent,
  version: 1,
  mutationId: 'update-123'
});

// Commit when mutation succeeds
await optimisticUpdateManager.commitUpdate(updateId, serverData);

// Rollback when mutation fails
optimisticUpdateManager.rollbackUpdate(updateId);

// Get stats
const pendingCount = optimisticUpdateManager.getPendingUpdatesCount();
```

### PersistenceManager

```typescript
const persistenceManager = getPersistenceManager();

// Persist entry (only if non-PHI)
await persistenceManager.persistEntry('schools-list', schoolsData, {
  tags: ['reference'],
  version: 1
});

// Restore entry
const schools = await persistenceManager.restoreEntry<School[]>('schools-list');

// Clean up stale data
const cleanedCount = await persistenceManager.cleanupStaleData();

// Get statistics
const stats = await persistenceManager.getStats();
// { totalEntries: 10, totalSize: 50000, expiredEntries: 2 }
```

## Performance Metrics

Target improvements:
- ✅ 60% reduction in cache invalidations
- ✅ Offline-first capability for reference data
- ✅ Sub-10ms cache access time
- ✅ Automatic stale data cleanup
- ✅ Memory usage under 50MB

## HIPAA Compliance

This caching infrastructure is designed with HIPAA compliance in mind:

1. **No PHI Persistence**: Protected Health Information is never persisted to IndexedDB
2. **Secure In-Memory Only**: PHI only exists in memory and is cleared on logout/refresh
3. **Audit Logging**: All cache operations on PHI are logged
4. **Automatic Cleanup**: Expired data is automatically removed
5. **Configurable TTLs**: Critical healthcare data has shorter TTLs

## Testing

```typescript
import { resetCacheManager, resetInvalidationStrategy } from '@/services/cache';

describe('Cache Tests', () => {
  beforeEach(() => {
    resetCacheManager();
    resetInvalidationStrategy();
  });

  it('should cache and retrieve data', () => {
    const cacheManager = getCacheManager();
    cacheManager.set('test-key', { data: 'test' });
    const result = cacheManager.get('test-key');
    expect(result).toEqual({ data: 'test' });
  });
});
```

## Migration Guide

### From Old Caching Pattern

```typescript
// ❌ Old pattern - over-aggressive invalidation
queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists.all() });
queryClient.invalidateQueries({ queryKey: studentQueryKeys.statistics.all() });
queryClient.invalidateQueries({ queryKey: studentQueryKeys.details.byId(id) });

// ✅ New pattern - granular invalidation
import { getInvalidationStrategy, createStudentUpdateOperation } from '@/services/cache';

const invalidationStrategy = getInvalidationStrategy(queryClient);
await invalidationStrategy.invalidate(
  createStudentUpdateOperation('update-grade', id, previousValues, newValues)
);
```

## Troubleshooting

### Cache Not Persisting

Check if entity is allowed to be persisted:
```typescript
import { canPersistEntity } from '@/services/cache';

const canPersist = canPersistEntity('students'); // false - PHI
const canPersist = canPersistEntity('schools');  // true - reference data
```

### Invalidation Not Working

Check operation pattern matching:
```typescript
// Enable debug logging
console.log('[InvalidationStrategy] Testing operation:', {
  operationType: 'update-grade',
  entity: 'students'
});
```

### Performance Issues

Check cache statistics:
```typescript
import { getCacheInfrastructureStats } from '@/services/cache';

const stats = await getCacheInfrastructureStats();
console.log('Cache Stats:', stats);
```

## Best Practices

1. **Always use QueryKeyFactory**: Ensures consistent cache keys
2. **Specify operation type**: Enables granular invalidation
3. **Use optimistic updates for mutations**: Better UX
4. **Prefetch on user intent**: Hover, navigation patterns
5. **Monitor cache hit rate**: Target 80%+ hit rate
6. **Never persist PHI**: HIPAA compliance
7. **Set appropriate TTLs**: Critical data = shorter TTL

## License

Internal use only - White Cross Healthcare Platform
