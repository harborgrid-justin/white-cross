# Query Cache Quick Start Guide

## For Developers: Adding Cache to Your Service

### Step 1: Inject QueryCacheService

```typescript
import { QueryCacheService } from '../database/services/query-cache.service';

@Injectable()
export class YourService {
  constructor(
    @InjectModel(YourModel)
    private readonly yourModel: typeof YourModel,
    private readonly queryCacheService: QueryCacheService, // Add this
  ) {}
}
```

### Step 2: Replace findAll/findOne with Cached Version

#### Before (No Cache):
```typescript
async findById(id: string): Promise<YourModel> {
  const record = await this.yourModel.findByPk(id);
  return record;
}
```

#### After (With Cache):
```typescript
async findById(id: string): Promise<YourModel> {
  const records = await this.queryCacheService.findWithCache(
    this.yourModel,
    { where: { id } },
    {
      ttl: 600,                          // 10 minutes
      keyPrefix: 'your_model_detail',    // Unique cache key prefix
      invalidateOn: ['update', 'destroy'], // When to clear cache
    }
  );

  return records.length > 0 ? records[0] : null;
}
```

### Step 3: Choose Appropriate TTL

| Data Stability | TTL | Example |
|----------------|-----|---------|
| Highly Stable | 30-60 min | Schools, Districts, Medication Catalog |
| Moderately Changing | 5-10 min | Users, Students, Nurses |
| Frequently Changing | 1-3 min | Real-time status, Active sessions |

### Step 4: Choose Invalidation Strategy

| Query Type | Invalidation | Example |
|------------|--------------|---------|
| List Queries | `['create', 'update', 'destroy']` | getUsersByRole, findByGrade |
| Detail Queries | `['update', 'destroy']` | getUserById, findOne |
| Read-Only Catalogs | `['create', 'update', 'destroy']` | getMedicationCatalog |

## Common Patterns

### Pattern 1: Cache Single Record Lookup
```typescript
async findOne(id: string): Promise<Student> {
  const students = await this.queryCacheService.findWithCache(
    this.studentModel,
    { where: { id } },
    {
      ttl: 600,                    // 10 minutes
      keyPrefix: 'student_detail',
      invalidateOn: ['update', 'destroy'],
    }
  );

  if (!students || students.length === 0) {
    throw new NotFoundException(`Student with ID ${id} not found`);
  }

  return students[0];
}
```

### Pattern 2: Cache List with Filters
```typescript
async findByGrade(grade: string): Promise<Student[]> {
  return await this.queryCacheService.findWithCache(
    this.studentModel,
    {
      where: { grade, isActive: true },
      order: [['lastName', 'ASC']],
    },
    {
      ttl: 300,                   // 5 minutes
      keyPrefix: 'student_grade',
      invalidateOn: ['create', 'update', 'destroy'],
    }
  );
}
```

### Pattern 3: Cache Reference Data
```typescript
async getMedicationCatalog(): Promise<Medication[]> {
  return await this.queryCacheService.findWithCache(
    this.medicationModel,
    {
      where: { isActive: true },
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'genericName', 'type'],
    },
    {
      ttl: 3600,                      // 1 hour
      keyPrefix: 'medication_catalog',
      invalidateOn: ['create', 'update', 'destroy'],
    }
  );
}
```

## What NOT to Cache

❌ **Don't cache:**
- Paginated results (page > 1)
- Search results with complex filters
- Real-time data requiring immediate updates
- One-time reports or exports
- Data that changes more frequently than the TTL

## Monitoring Your Cache

### Check Cache Statistics
```typescript
const stats = this.queryCacheService.getStats();
console.log('Hit Rate:', stats.hitRate);
console.log('Cache Size:', stats.localCacheSize);
```

### Get Health Report
```typescript
const report = await this.cacheMonitoringService.getCacheHealthReport();
console.log('Performance Grade:', report.performanceGrade);
console.log('Recommendations:', report.recommendedActions);
```

## Manual Cache Invalidation

### Invalidate Specific Pattern
```typescript
// Invalidate all student-related caches
await this.queryCacheService.invalidatePattern('student');

// Invalidate specific prefix
await this.queryCacheService.invalidatePattern('student_grade');
```

### Clear All Cache (Emergency)
```typescript
await this.queryCacheService.clearAll();
```

## Testing Cache Behavior

```typescript
describe('YourService with Cache', () => {
  it('should cache query results', async () => {
    // First call - should hit database
    const result1 = await service.findOne(id);

    // Second call - should hit cache
    const result2 = await service.findOne(id);

    // Verify cache hit rate increased
    const stats = queryCacheService.getStats();
    expect(stats.hitRate).toBeGreaterThan(0);
  });

  it('should invalidate cache on update', async () => {
    // Cache the record
    await service.findOne(id);

    // Update the record (should invalidate cache)
    await service.update(id, { name: 'New Name' });

    // Next query should miss cache
    const result = await service.findOne(id);
    expect(result.name).toBe('New Name');
  });
});
```

## Performance Expectations

### Cached vs Uncached Response Times
- **Uncached Query**: 50-200ms (database query)
- **Cached Query**: 1-10ms (memory lookup)
- **Performance Gain**: 50-70% faster

### Cache Hit Rates
- **Good**: 60-80%
- **Acceptable**: 40-60%
- **Needs Optimization**: <40%

## HIPAA Compliance Checklist

When caching PHI:
- ✅ Use QueryCacheService (compliant by design)
- ✅ Never log PHI in cache keys
- ✅ Set appropriate TTL (max 1 hour for PHI)
- ✅ Document what PHI is cached
- ✅ Ensure automatic expiration works
- ✅ Test cache invalidation thoroughly

## Common Issues and Solutions

### Issue: Low Cache Hit Rate
**Solution**: Increase TTL or check if queries have unique parameters

### Issue: Stale Data Shown
**Solution**: Verify invalidation hooks are set up correctly

### Issue: Cache Size Growing Too Large
**Solution**: Reduce TTL values or implement more aggressive eviction

### Issue: Memory Usage High
**Solution**: Review cached data size, consider Redis for large datasets

## Quick Reference

| Operation | TTL | Invalidation |
|-----------|-----|--------------|
| Get by ID | 5-10 min | update, destroy |
| List by Category | 5-15 min | create, update, destroy |
| Reference Catalog | 30-60 min | create, update, destroy |
| Real-time Status | Don't cache | N/A |

## Need Help?

- 📖 Full docs: `docs/CACHE_INVALIDATION_PATTERNS.md`
- 📊 Performance summary: `docs/CACHE_PERFORMANCE_SUMMARY.md`
- 🔍 Service code: `src/database/services/query-cache.service.ts`
- 📈 Monitoring: `src/database/services/cache-monitoring.service.ts`

## Examples from Production

See these services for real-world examples:
- `src/student/student.service.ts` - Student caching
- `src/user/user.service.ts` - User caching
- `src/medication/medication.repository.ts` - Medication caching
- `src/administration/services/school.service.ts` - School caching
