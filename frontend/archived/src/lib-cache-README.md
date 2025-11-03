# Caching Strategy Documentation

**Version**: 1.0.0
**Last Updated**: 2025-10-27
**Status**: ACTIVE

---

## Overview

This document defines the caching strategy for the White Cross Healthcare Platform Next.js application. The strategy balances performance optimization with HIPAA compliance requirements for Protected Health Information (PHI).

### Key Principles

1. **PHI First**: Short cache TTLs for PHI data (30-60s) to minimize stale data exposure
2. **Performance Second**: Longer TTLs for static data (300s) to reduce backend load
3. **Granular Invalidation**: Tag-based cache invalidation for precise control
4. **No PHI in Keys**: Cache keys use IDs only, never PHI values

---

## Cache Tiers

### Tier 1: Static Reference Data (`STATIC` - 300s / 5 min)

**Use Case**: Data that rarely changes during normal operations

**Examples**:
- School lists
- District information
- Medication formulary (drug catalog)
- Form templates
- System configuration

**Rationale**: These are essentially "read-only" reference tables that only change during administrative updates. Aggressive caching reduces database load significantly.

**Implementation**:
```typescript
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache/constants';

const schools = await fetch('/api/schools', {
  next: {
    revalidate: CACHE_TTL.STATIC, // 300s
    tags: [CACHE_TAGS.SCHOOLS]
  }
});
```

---

### Tier 2: Aggregated Statistics (`STATS` - 120s / 2 min)

**Use Case**: Aggregated, non-PHI dashboard data

**Examples**:
- Dashboard statistics (total students, active medications count)
- Analytics reports
- System health metrics
- Usage statistics

**Rationale**: Aggregated data doesn't contain individual PHI and updates moderately. 2-minute staleness is acceptable for dashboard views.

**Implementation**:
```typescript
const stats = await fetch('/api/dashboard/stats', {
  next: {
    revalidate: CACHE_TTL.STATS, // 120s
    tags: [CACHE_TAGS.STATS]
  }
});
```

---

### Tier 3: PHI - Frequently Accessed (`PHI_FREQUENT` - 30s)

**Use Case**: High-sensitivity PHI accessed very frequently

**Examples**:
- Active medications (today's scheduled administrations)
- Today's appointments
- Recent health alerts
- Current incident reports

**Rationale**: These change frequently and require near real-time accuracy. 30-second cache provides performance benefit without compromising data freshness.

**Implementation**:
```typescript
const todaysMedications = await fetch('/api/medications/active', {
  next: {
    revalidate: CACHE_TTL.PHI_FREQUENT, // 30s
    tags: [CACHE_TAGS.MEDICATIONS, CACHE_TAGS.PHI]
  }
});
```

**HIPAA Compliance**: Ensure audit logging for all PHI access, even from cache.

---

### Tier 4: PHI - Standard Access (`PHI_STANDARD` - 60s / 1 min)

**Use Case**: Standard PHI list views and searches

**Examples**:
- Student lists (with search/pagination)
- Health records lists
- Medication lists
- Appointment lists
- Incident lists

**Rationale**: List views don't require absolute real-time accuracy. 1-minute cache provides good performance while maintaining reasonable freshness.

**Implementation**:
```typescript
const students = await fetch('/api/students?page=1', {
  next: {
    revalidate: CACHE_TTL.PHI_STANDARD, // 60s
    tags: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
  }
});
```

**HIPAA Compliance**:
- Tag all PHI caches with `CACHE_TAGS.PHI`
- Log cache access for audit trail
- Invalidate on user logout

---

### Tier 5: User Session Data (`SESSION` - 300s / 5 min)

**Use Case**: User-specific non-PHI data

**Examples**:
- Current user profile
- User preferences
- Role permissions
- UI settings

**Rationale**: User data rarely changes during a session. Aggressive caching improves UX without risk.

**Implementation**:
```typescript
const currentUser = await fetch('/api/auth/me', {
  next: {
    revalidate: CACHE_TTL.SESSION, // 300s
    tags: [CACHE_TAGS.USERS]
  }
});
```

---

### Tier 6: Real-time Data (`REALTIME` - 10s)

**Use Case**: Data requiring near-instantaneous updates

**Examples**:
- Unread notification count
- Active alert count
- Live chat messages
- Emergency broadcasts

**Rationale**: Minimal caching to maintain real-time feel while avoiding redundant requests.

**Implementation**:
```typescript
const notifications = await fetch('/api/notifications/unread', {
  next: {
    revalidate: CACHE_TTL.REALTIME, // 10s
    tags: [CACHE_TAGS.NOTIFICATIONS]
  }
});
```

---

### Tier 7: No Cache (`NO_CACHE` - 0s)

**Use Case**: Critical operations requiring absolute freshness

**Examples**:
- Authentication checks
- Critical security operations
- Medication administration confirmation
- Emergency contact verification

**Rationale**: Some operations cannot tolerate any staleness risk.

**Implementation**:
```typescript
const authCheck = await fetch('/api/auth/verify', {
  next: {
    revalidate: CACHE_TTL.NO_CACHE, // 0s - always fresh
    tags: []
  }
});
```

---

## Cache Tags

### Tag Organization

Tags enable **granular cache invalidation** without clearing the entire cache.

**Tag Hierarchy**:
```
[Resource Type] + [PHI Flag] + [Specific Instance]

Examples:
- 'students' + 'phi-data' + 'student-123'
- 'medications' + 'phi-data' + 'medication-456'
- 'users' (no PHI flag)
```

### Tag Usage

#### Tagging Data (Server Components)

```typescript
// Tag a students list fetch
const students = await fetch('/api/students', {
  next: {
    revalidate: CACHE_TTL.PHI_STANDARD,
    tags: [
      CACHE_TAGS.STUDENTS,   // Resource type
      CACHE_TAGS.PHI         // PHI flag
    ]
  }
});

// Tag a specific student fetch
const student = await fetch(`/api/students/${id}`, {
  next: {
    revalidate: CACHE_TTL.PHI_STANDARD,
    tags: [
      CACHE_TAGS.STUDENTS,
      CACHE_TAGS.PHI,
      buildResourceTag('student', id) // 'student-123'
    ]
  }
});
```

#### Invalidating Cache (Server Actions)

```typescript
import { revalidateTag, revalidatePath } from 'next/cache';
import { CACHE_TAGS, buildResourceTag } from '@/lib/cache/constants';

// Invalidate all student data
revalidateTag(CACHE_TAGS.STUDENTS);

// Invalidate specific student
revalidateTag(buildResourceTag('student', '123'));

// Invalidate all PHI data
revalidateTag(CACHE_TAGS.PHI);

// Invalidate path (broader)
revalidatePath('/students');
```

---

## HIPAA Compliance Requirements

### 1. No PHI in Cache Keys

**WRONG**:
```typescript
// ❌ NEVER include PHI in cache keys
const key = `student-${student.firstName}-${student.lastName}`;
const tags = [`ssn-${student.ssn}`];
```

**CORRECT**:
```typescript
// ✅ Use IDs only
const key = `student-${student.id}`;
const tags = [buildResourceTag('student', student.id)];
```

### 2. Cache Invalidation on Logout

All PHI caches MUST be invalidated when user logs out:

```typescript
// On logout
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache/constants';

async function handleLogout() {
  // Invalidate all PHI caches
  revalidateTag(CACHE_TAGS.PHI);

  // Invalidate user session
  revalidateTag(CACHE_TAGS.USERS);

  // Clear client-side caches
  queryClient.clear();

  // Redirect to login
  redirect('/login');
}
```

### 3. Audit Logging for PHI Cache Access

Even cached PHI access must be logged for HIPAA compliance:

```typescript
// In Server Component or Action
const student = await fetch(`/api/students/${id}`, {
  next: {
    revalidate: CACHE_TTL.PHI_STANDARD,
    tags: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
  }
});

// Log PHI access (even if from cache)
await auditService.logPHIAccess(
  AuditAction.VIEW_STUDENT,
  id,
  AuditResourceType.STUDENT
);
```

### 4. Short TTLs for PHI

PHI data MUST have shorter TTLs than non-PHI data:
- **Maximum PHI TTL**: 60 seconds
- **Recommended PHI TTL**: 30-60 seconds
- **Non-PHI can be longer**: Up to 300 seconds

---

## Cache Invalidation Strategies

### Strategy 1: Tag-Based Invalidation (Recommended)

**Use Case**: Invalidate specific resource types

```typescript
// After creating a student
revalidateTag(CACHE_TAGS.STUDENTS);

// After updating specific student
revalidateTag(buildResourceTag('student', studentId));
revalidateTag(CACHE_TAGS.STUDENTS); // Also invalidate list
```

### Strategy 2: Path-Based Invalidation

**Use Case**: Invalidate all caches for a URL path

```typescript
// Invalidate all student pages
revalidatePath('/students');

// Invalidate specific student page
revalidatePath(`/students/${studentId}`);

// Invalidate with layout
revalidatePath('/students', 'layout');
```

### Strategy 3: Full Invalidation (Emergency)

**Use Case**: Nuclear option for critical security issues

```typescript
// Invalidate ALL caches (use sparingly)
revalidatePath('/', 'layout');
```

---

## Performance Monitoring

### Metrics to Track

1. **Cache Hit Rate**
   - Target: >70% for frequently accessed data
   - Method: Monitor via Next.js telemetry or custom middleware

2. **Cache Miss Latency**
   - Target: <500ms P95 for API calls
   - Method: Track fetch times in monitoring

3. **Stale Data Incidents**
   - Target: 0 for PHI data
   - Method: User reports, audit logs

4. **Cache Size**
   - Monitor: Ensure caches don't grow unbounded
   - Action: Adjust TTLs if memory issues

### Example Monitoring

```typescript
// Custom middleware to track cache performance
export async function trackCachePerformance<T>(
  fetchFn: () => Promise<T>,
  resourceType: string
): Promise<T> {
  const startTime = performance.now();
  const result = await fetchFn();
  const duration = performance.now() - startTime;

  // Log to monitoring service
  analytics.track('cache_access', {
    resourceType,
    duration,
    isCacheHit: duration < 50, // Assume <50ms = cache hit
  });

  return result;
}
```

---

## Common Patterns

### Pattern 1: Composite Data Fetching

```typescript
// Fetch multiple resources in parallel
export async function prefetchStudentPage(studentId: string) {
  await Promise.all([
    prefetchStudent(studentId),          // PHI_STANDARD (60s)
    prefetchMedications(studentId),      // PHI_FREQUENT (30s)
    prefetchAppointments(studentId),     // PHI_FREQUENT (30s)
    prefetchCurrentUser(),               // SESSION (300s)
  ]);
}
```

### Pattern 2: Conditional Caching

```typescript
// Cache only for non-sensitive queries
function getCacheConfig(isSensitive: boolean) {
  if (isSensitive) {
    return { revalidate: CACHE_TTL.NO_CACHE, tags: [] };
  }
  return { revalidate: CACHE_TTL.PHI_STANDARD, tags: [CACHE_TAGS.PHI] };
}
```

### Pattern 3: Cache Warming

```typescript
// Pre-warm critical caches on app load
export async function warmCriticalCaches() {
  await Promise.all([
    prefetchDashboardStats(),
    prefetchCurrentUser(),
    prefetchTodaysAppointments(),
  ]);
}
```

---

## Troubleshooting

### Issue: Stale Data Displayed

**Symptoms**: Users see outdated information

**Diagnosis**:
1. Check TTL configuration - is it too long?
2. Verify cache invalidation is called after mutations
3. Check if tags are correctly applied

**Solution**:
```typescript
// Ensure cache invalidation after mutations
export async function updateStudent(id: string, data: UpdateStudentData) {
  const result = await apiClient.put(`/students/${id}`, data);

  // Invalidate caches
  revalidateTag(CACHE_TAGS.STUDENTS);
  revalidateTag(buildResourceTag('student', id));
  revalidatePath(`/students/${id}`);

  return result;
}
```

### Issue: Cache Not Working

**Symptoms**: Every request hits the backend

**Diagnosis**:
1. Check if `revalidate` is set to 0 or false
2. Verify fetch is using `next` option
3. Check if request is in middleware or API route (not cached)

**Solution**:
```typescript
// Ensure proper cache configuration
const data = await fetch(url, {
  next: {
    revalidate: CACHE_TTL.PHI_STANDARD, // ✅ Set TTL
    tags: [CACHE_TAGS.STUDENTS]          // ✅ Set tags
  }
});
```

### Issue: Memory Issues

**Symptoms**: Server memory usage growing

**Diagnosis**:
1. Check for unbounded caches
2. Verify TTLs are set
3. Check cache size in monitoring

**Solution**:
- Reduce TTLs for large datasets
- Implement pagination
- Monitor and adjust

---

## Best Practices

### DO ✅

1. **Always tag PHI caches** with `CACHE_TAGS.PHI`
2. **Use short TTLs for PHI** (30-60s maximum)
3. **Invalidate after mutations** to prevent stale data
4. **Use IDs in cache keys**, never PHI values
5. **Monitor cache hit rates** and adjust TTLs
6. **Document cache decisions** in code comments
7. **Test cache invalidation** in integration tests

### DON'T ❌

1. **Don't cache indefinitely** - always set TTL
2. **Don't include PHI in cache keys** - HIPAA violation
3. **Don't skip invalidation** - causes stale data
4. **Don't over-cache PHI** - compliance risk
5. **Don't ignore monitoring** - performance issues
6. **Don't cache errors** - bad UX
7. **Don't cache authentication** - security risk

---

## References

- [Next.js Data Cache Documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html)
- [Database Integration Audit Report](/nextjs/DATABASE_INTEGRATION_AUDIT_REPORT.md)
- [Cache Constants Source Code](/nextjs/src/lib/cache/constants.ts)

---

**Document Status**: APPROVED
**Last Review**: 2025-10-27
**Next Review**: 2025-11-27
