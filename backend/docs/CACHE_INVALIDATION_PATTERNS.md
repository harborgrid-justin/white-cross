# Cache Invalidation Patterns

## Overview

This document describes the cache invalidation strategies implemented across White Cross services to ensure data consistency while maximizing performance through QueryCacheService.

## Automatic Cache Invalidation

QueryCacheService automatically invalidates cache entries when specific model operations occur. This is configured per query using the `invalidateOn` parameter.

### Standard Invalidation Operations

- **create**: Invalidate when new records are created
- **update**: Invalidate when records are modified
- **destroy**: Invalidate when records are deleted

## Service-Specific Cache Patterns

### 1. StudentService

#### Cache Configuration
- **findOne (student detail)**: TTL 10 minutes
  - Invalidates on: `update`, `destroy`
  - Key pattern: `student_detail:Student:{hash}`
  - Rationale: Student details change infrequently, long TTL is safe

- **findByGrade (grade lists)**: TTL 5 minutes
  - Invalidates on: `create`, `update`, `destroy`
  - Key pattern: `student_grade:Student:{hash}`
  - Rationale: Grade lists can change when students are added/moved/removed

#### Invalidation Cascades
When a student is updated, the following cache patterns are invalidated:
- Individual student detail: `student_detail:Student:*`
- Grade-based queries: `student_grade:Student:*`

### 2. UserService

#### Cache Configuration
- **getUserById (user lookup)**: TTL 5 minutes
  - Invalidates on: `update`, `destroy`
  - Key pattern: `user_id:User:{hash}`
  - Rationale: User data changes moderately (profile updates, role changes)

- **getUsersByRole (role-based lists)**: TTL 10 minutes
  - Invalidates on: `create`, `update`, `destroy`
  - Key pattern: `user_role:User:{hash}`
  - Rationale: Role assignments are stable, beneficial for nurse assignment lookups

#### Invalidation Cascades
When a user is updated, the following cache patterns are invalidated:
- Individual user lookup: `user_id:User:*`
- Role-based queries: `user_role:User:*`

### 3. MedicationRepository

#### Cache Configuration
- **findById (medication lookup)**: TTL 30 minutes
  - Invalidates on: `update`, `destroy`
  - Key pattern: `medication_id:StudentMedication:{hash}`
  - Rationale: Medication records are relatively stable once prescribed

- **getMedicationCatalog (active medications)**: TTL 1 hour
  - Invalidates on: `create`, `update`, `destroy`
  - Key pattern: `medication_catalog:Medication:{hash}`
  - Rationale: Medication catalog changes infrequently, ideal for long caching

#### Invalidation Cascades
When medication records are updated:
- Individual medication: `medication_id:StudentMedication:*`
- Full catalog: `medication_catalog:Medication:*`

### 4. SchoolService

#### Cache Configuration
- **getSchoolById (school lookup)**: TTL 30 minutes
  - Invalidates on: `update`, `destroy`
  - Key pattern: `school_id:School:{hash}`
  - Rationale: School data is highly stable (rarely changes)

- **getSchools by district**: TTL 15 minutes
  - Invalidates on: `create`, `update`, `destroy`
  - Key pattern: `school_district:School:{hash}`
  - Rationale: School lists may change when new schools are added/removed

#### Invalidation Cascades
When schools are updated:
- Individual school: `school_id:School:*`
- District-based queries: `school_district:School:*`

## Cross-Service Invalidation

Some operations require invalidating caches across multiple services:

### Student Transfer Example
```typescript
// When transferring a student to a different grade or nurse:
await student.update({ grade: newGrade, nurseId: newNurseId });

// Automatically invalidates:
// - student_detail:Student:* (student's own cache)
// - student_grade:Student:* (both old and new grade caches)
// - nurse:{oldNurseId}:students (if implemented)
// - nurse:{newNurseId}:students (if implemented)
```

### User Role Change Example
```typescript
// When changing a user's role:
await user.update({ role: newRole });

// Automatically invalidates:
// - user_id:User:* (user's own cache)
// - user_role:User:* (all role-based caches)
```

## Manual Invalidation

For complex scenarios, use manual cache invalidation:

```typescript
// Invalidate specific pattern
await this.queryCacheService.invalidatePattern('student_grade');

// Clear all cache
await this.queryCacheService.clearAll();
```

## Cache Key Generation

Cache keys are generated using:
1. **Prefix**: Identifies the query type
2. **Model Name**: Identifies the database table
3. **Hash**: MD5 hash of sanitized query options

Example: `student_detail:Student:a1b2c3d4e5f6g7h8`

### PHI Protection
Query options are sanitized before hashing to prevent PHI from appearing in cache keys:
- Actual values are replaced with "VALUE"
- Only query structure is preserved
- Compliant with HIPAA regulations

## Performance Monitoring

Monitor cache performance using CacheMonitoringService:

```typescript
// Get health report
const report = await cacheMonitoringService.getCacheHealthReport();

// Check service-specific stats
const studentStats = cacheMonitoringService.getServiceStats('StudentService');
```

### Performance Targets
- **Hit Rate**: 60-80% (target), 40-60% (acceptable), <40% (needs optimization)
- **Cache Size**: <900 entries (optimal), >900 (needs eviction policy)
- **Response Time**: <10ms (cached), <100ms (uncached)

## Best Practices

### 1. TTL Selection
- **Stable data** (schools, medication catalog): 30-60 minutes
- **Moderately changing** (users, students): 5-10 minutes
- **Frequently changing** (real-time data): 1-3 minutes
- **Never cache**: Search results, paginated data (page > 1)

### 2. Invalidation Strategy
- Use `create, update, destroy` for list queries
- Use `update, destroy` for individual record queries
- Consider cascade effects on related data

### 3. Cache Coverage
- Cache frequently accessed queries (>10 requests/minute)
- Don't cache one-time queries or exports
- Don't cache complex joins or reports

### 4. Testing Cache Behavior
```typescript
// Before: Query should hit database
const student1 = await studentService.findOne(id);

// After: Query should hit cache
const student2 = await studentService.findOne(id);

// Verify cache hit rate increased
const stats = queryCacheService.getStats();
console.log('Hit rate:', stats.hitRate);
```

## HIPAA Compliance

### Cache Security
- ✅ No PHI in cache keys (hashed query structure only)
- ✅ In-memory cache cleared on application restart
- ✅ Cache entries expire automatically (TTL-based)
- ✅ Manual cache clear available for security incidents
- ✅ Audit logging for cache operations

### PHI Handling
- Cache stores **complete records** (including PHI)
- Cache is **in-memory only** (not persisted to disk)
- Cache is **single-tenant** (no cross-tenant data)
- Cache **expires automatically** (max 1 hour TTL)

## Expected Performance Improvements

Based on implementation across StudentService, UserService, MedicationRepository, and SchoolService:

### Overall Metrics
- **40-60% reduction** in database queries for cached lookups
- **50-70% reduction** in response time for cached requests
- **70-90% reduction** in database load for frequently accessed data

### Service-Specific Improvements
- **StudentService**: 50-60% cache hit rate on student lookups
- **UserService**: 60-70% cache hit rate on role-based queries
- **MedicationRepository**: 70-80% cache hit rate on catalog queries
- **SchoolService**: 60-75% cache hit rate on school lookups

### Healthcare-Specific Benefits
- Faster medication administration workflows
- Reduced latency for nurse dashboards
- Improved student record access times
- Better performance during peak clinic hours

## Monitoring Dashboard

Access cache metrics at:
- **Endpoint**: `GET /api/monitoring/cache`
- **Metrics**: Hit rate, cache size, service breakdown
- **Health Report**: Performance grade and recommendations

## Future Enhancements

### Redis Integration (Phase 2)
- Distributed caching across multiple instances
- Shared cache for load-balanced deployments
- Persistent cache across restarts
- Pub/sub for cache invalidation

### Cache Warming (Phase 2)
- Pre-load frequently accessed data on startup
- Periodic background refresh of critical data
- Predictive cache population

### Advanced Invalidation (Phase 2)
- Tag-based invalidation (e.g., invalidate all student-related caches)
- Dependency tracking (e.g., invalidate student when school changes)
- Conditional invalidation (e.g., invalidate only if value changed significantly)
