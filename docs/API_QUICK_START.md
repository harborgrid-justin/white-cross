# API Quick Start Guide

## 🚀 5-Minute Quick Start

### Step 1: Import Core Services

```typescript
import { BaseApiService, createQueryHooks, apiClient } from '@/services/core';
import { z } from 'zod';
```

### Step 2: Define Your Types

```typescript
interface MyEntity {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

interface CreateMyEntityDto {
  name: string;
  isActive?: boolean;
}
```

### Step 3: Add Validation (Optional but Recommended)

```typescript
const createSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  isActive: z.boolean().optional(),
});
```

### Step 4: Create Service

```typescript
class MyEntityService extends BaseApiService<MyEntity, CreateMyEntityDto> {
  constructor() {
    super(apiClient, '/api/my-entities', { createSchema });
  }
}

export const myEntityService = new MyEntityService();
```

### Step 5: Create Query Hooks

```typescript
export const myEntityHooks = createQueryHooks(myEntityService, {
  queryKey: ['myEntities'],
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Step 6: Use in Components

```typescript
function MyEntityList() {
  // Get list with auto loading/error states
  const { data, isLoading, error } = myEntityHooks.useList({
    filters: { page: 1, limit: 20 }
  });

  // Create mutation
  const create = myEntityHooks.useCreate({
    onSuccess: () => alert('Created!'),
  });

  // Update mutation
  const update = myEntityHooks.useUpdate();

  // Delete mutation
  const del = myEntityHooks.useDelete();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map(item => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => update.mutate({
            id: item.id,
            data: { name: 'New Name' }
          })}>
            Update
          </button>
          <button onClick={() => del.mutate(item.id)}>
            Delete
          </button>
        </div>
      ))}

      <button onClick={() => create.mutate({ name: 'New Item' })}>
        Create New
      </button>
    </div>
  );
}
```

## 🎯 Common Patterns

### Pattern: List with Pagination

```typescript
const { data } = myEntityHooks.useList({
  filters: {
    page: currentPage,
    limit: 20,
    sort: 'name',
    order: 'asc',
  }
});
```

### Pattern: Get Single Item

```typescript
const { data: item } = myEntityHooks.useDetail({ id: itemId });
```

### Pattern: Search with Debounce

```typescript
const [query, setQuery] = useState('');
const [debouncedQuery, setDebouncedQuery] = useState('');

useEffect(() => {
  const timer = setTimeout(() => setDebouncedQuery(query), 300);
  return () => clearTimeout(timer);
}, [query]);

const { data } = myEntityHooks.useSearch(debouncedQuery);
```

### Pattern: Conditional Fetching

```typescript
const { data } = myEntityHooks.useDetail({
  id: itemId,
  enabled: !!itemId, // Only fetch if itemId exists
});
```

### Pattern: Refetch on Interval

```typescript
const { data } = myEntityHooks.useList({
  refetchInterval: 30000, // Refetch every 30 seconds
});
```

### Pattern: Custom Success Handler

```typescript
const create = myEntityHooks.useCreate({
  onSuccess: (data) => {
    toast.success('Created successfully!');
    navigate(`/items/${data.id}`);
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

## 🔧 Custom Methods

### Adding Custom Endpoints

```typescript
class MyEntityService extends BaseApiService<MyEntity> {
  constructor() {
    super(apiClient, '/api/my-entities');
  }

  // Add custom method
  async getByCategory(category: string): Promise<MyEntity[]> {
    return this.get<MyEntity[]>(`${this.baseEndpoint}/category/${category}`);
  }

  async archive(id: string): Promise<void> {
    await this.post(`${this.baseEndpoint}/${id}/archive`);
  }
}
```

### Using Custom Methods

```typescript
// Direct service call
const items = await myEntityService.getByCategory('health');

// Or create custom hook
function useEntityByCategory(category: string) {
  return useQuery({
    queryKey: ['myEntities', 'category', category],
    queryFn: () => myEntityService.getByCategory(category),
    enabled: !!category,
  });
}
```

## 📊 Monitoring

### Check Performance Stats

```typescript
import { apiMonitoring } from '@/services/core';

// Get stats
const stats = apiMonitoring.getPerformanceStats();
console.log('Avg response time:', stats.averageResponseTime);
console.log('Error rate:', stats.errorRate);

// Get slow requests
const slowRequests = apiMonitoring.getSlowRequests(10);
```

### Export Metrics

```typescript
// Export as JSON
const metrics = apiMonitoring.exportMetrics();
console.log(metrics);

// Download as file
const blob = new Blob([metrics], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'api-metrics.json';
a.click();
```

## ⚡ Performance Tips

### 1. Set Appropriate Stale Times

```typescript
// Frequently changing data
queryKey: ['appointments'],
staleTime: 1 * 60 * 1000,  // 1 minute

// Rarely changing data
queryKey: ['students'],
staleTime: 10 * 60 * 1000, // 10 minutes

// Static data
queryKey: ['settings'],
staleTime: Infinity,        // Never stale
```

### 2. Use Optimistic Updates

```typescript
const update = myEntityHooks.useUpdate({
  onMutate: async ({ id, data }) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['myEntities', 'detail', id] });

    // Snapshot previous value
    const previous = queryClient.getQueryData(['myEntities', 'detail', id]);

    // Optimistically update
    queryClient.setQueryData(['myEntities', 'detail', id], (old: any) => ({
      ...old,
      ...data,
    }));

    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(
      ['myEntities', 'detail', variables.id],
      context?.previous
    );
  },
});
```

### 3. Prefetch Data

```typescript
const queryClient = useQueryClient();

// Prefetch on hover
const handleMouseEnter = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: ['myEntities', 'detail', id],
    queryFn: () => myEntityService.getById(id),
  });
};
```

## 🐛 Common Issues

### Issue: Queries not updating after mutation
**Solution**: Ensure `invalidateQueries: true` in mutation options (it's default)

### Issue: "Token expired" errors
**Solution**: Token refresh is automatic. Check refresh token is valid.

### Issue: TypeScript errors with hooks
**Solution**: Ensure types are properly defined in service creation

### Issue: Infinite refetch loop
**Solution**: Check `enabled` condition and `refetchInterval` settings

## 📚 More Resources

- Full Documentation: `docs/FRONTEND_API_IMPROVEMENTS.md`
- Complete Example: `frontend/src/services/examples/ExampleStudentsService.ts`
- TanStack Query Docs: https://tanstack.com/query/latest
- Zod Docs: https://zod.dev

## 🎯 Cheat Sheet

```typescript
// LIST
const { data, isLoading } = hooks.useList({ filters: {...} });

// DETAIL
const { data } = hooks.useDetail({ id: '123' });

// SEARCH
const { data } = hooks.useSearch('query', { filters: {...} });

// CREATE
const create = hooks.useCreate({ onSuccess: () => {} });
create.mutate(data);

// UPDATE
const update = hooks.useUpdate();
update.mutate({ id: '123', data: {...} });

// DELETE
const del = hooks.useDelete();
del.mutate('123');

// BULK CREATE
const bulkCreate = hooks.useBulkCreate();
bulkCreate.mutate([data1, data2]);

// BULK DELETE
const bulkDelete = hooks.useBulkDelete();
bulkDelete.mutate(['id1', 'id2']);
```

---

**Happy Coding! 🚀**
