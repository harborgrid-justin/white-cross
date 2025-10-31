# Data Fetching and Caching - Architecture Notes

**Agent ID**: typescript-architect
**Task ID**: C4D9F2
**Last Updated**: 2025-10-31

## References to Other Agent Work
- Dynamic Rendering: `.temp/completion-summary-DY3R8N.md`
- Related architecture work by agents: E2E9C7, M7B2K9, MG5X2Y, AP9E2X, N4W8Q2, R3M8D1

## High-Level Design Decisions

### 1. Migration from Axios to Next.js Native Fetch

**Problem**: The existing codebase used axios for API calls, which:
- Cannot integrate with Next.js automatic request deduplication
- Cannot leverage Next.js cache system
- Lacks support for cache tags and revalidation
- Adds unnecessary bundle size

**Solution**: Created `/lib/api/nextjs-client.ts` - A comprehensive Next.js fetch-based API client that:
- Uses native `fetch()` with Next.js extensions
- Supports cache configuration (`cache`, `revalidate`, `tags`)
- Provides type-safe HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Maintains all features from axios client (auth, retry, error handling)
- Integrates with Next.js caching system
- Supports Next.js 15+ `cacheLife` API

### 2. Type System Architecture

**Type Safety Enhancements**:
```typescript
// NextFetchOptions extends RequestInit with Next.js specifics
interface NextFetchOptions extends RequestInit {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  cacheLife?: string | CacheLifeConfig;
  requiresAuth?: boolean;
  retry?: { attempts: number; delay: number };
}

// Custom error class for better error handling
class NextApiClientError extends Error {
  readonly status?: number;
  readonly isNetworkError: boolean;
  readonly isServerError: boolean;
  readonly isValidationError: boolean;
}
```

**Type Safety Guarantees**:
- All HTTP methods are generic: `serverGet<T>()`, `serverPost<T>()`
- Response types are strictly typed
- Cache options are type-checked
- Error classification is automatic

### 3. Cache Strategy Design

**Cache Tag Taxonomy**:
```typescript
// Resource-level tags
CACHE_TAGS.STUDENTS    // All student data
CACHE_TAGS.MEDICATIONS // All medication data
CACHE_TAGS.PHI         // All PHI data (HIPAA)

// Instance-level tags
`student-${id}`        // Specific student
`medication-${id}`     // Specific medication

// Compound tagging for granular invalidation
[CACHE_TAGS.STUDENTS, `student-${id}`, CACHE_TAGS.PHI]
```

**Cache Behavior by Operation Type**:
- **Mutations (POST/PUT/PATCH/DELETE)**: `cache: 'no-store'` with tags for invalidation
- **Reads (GET)**: `cache: 'force-cache'` with appropriate TTL
- **PHI Data**: Shorter TTL (30-60s) for compliance
- **Static Data**: Longer TTL (300s) for performance

### 4. Integration Patterns

**Server Actions Migration Pattern**:
```typescript
// BEFORE (axios)
const response = await apiClient.post<Student>(endpoint, data);
revalidateTag('students');

// AFTER (Next.js fetch)
const response = await serverPost<{ data: Student }>(
  endpoint,
  data,
  {
    cache: 'no-store',
    next: { tags: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI] }
  }
);
revalidateTag(CACHE_TAGS.STUDENTS);
```

**Key Changes**:
1. Import `serverPost` instead of `apiClient`
2. Add cache configuration to all calls
3. Use standardized `CACHE_TAGS` constants
4. Wrap response in `{ data: T }` for consistency
5. Handle `NextApiClientError` for better error messages

### 5. SOLID Principles Application

**Single Responsibility**:
- `/lib/api/nextjs-client.ts`: Data fetching only
- Server Actions: Business logic and revalidation
- Cache constants: Configuration centralized

**Open/Closed Principle**:
- `NextFetchOptions` is extensible without modifying existing code
- New cache strategies can be added without changing core client

**Liskov Substitution**:
- `NextApiClientError` extends `Error` properly
- All HTTP methods follow consistent signature patterns

**Interface Segregation**:
- `NextFetchOptions` doesn't force unused options
- Separate interfaces for cache config, retry config, etc.

**Dependency Inversion**:
- Server Actions depend on abstractions (`serverPost`) not concrete implementations
- Authentication is injected via cookies, not hardcoded

## Type System Strategies

### Generic Constraints
```typescript
// Generic HTTP methods with type inference
export async function serverGet<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
  options: NextFetchOptions = {}
): Promise<T>
```

**Type Inference Benefits**:
- Compile-time type checking for responses
- IDE autocomplete for response properties
- Catches type mismatches before runtime

### Type Guards and Error Classification
```typescript
// Automatic error classification in constructor
export class NextApiClientError extends Error {
  readonly isNetworkError: boolean;
  readonly isServerError: boolean;
  readonly isValidationError: boolean;

  constructor(error: ApiErrorResponse) {
    this.isNetworkError = error.code === 'NETWORK_ERROR';
    this.isServerError = (error.status ?? 0) >= 500;
    this.isValidationError = error.status === 400;
  }
}
```

**Usage**:
```typescript
catch (error) {
  if (error instanceof NextApiClientError) {
    if (error.isNetworkError) { /* handle network */ }
    else if (error.isValidationError) { /* handle validation */ }
  }
}
```

## Performance Considerations

### Algorithmic Complexity
- **Request deduplication**: O(1) lookup via Next.js internal cache
- **Retry logic**: Exponential backoff prevents thundering herd
- **Tag-based invalidation**: O(1) cache tag lookup

### Memory Management
- Cache entries automatically managed by Next.js
- No manual cache cleanup required
- Request deduplication prevents redundant network calls

### Optimization Opportunities
1. **Aggressive caching for static data**: 300s TTL for reference data
2. **Conservative caching for PHI**: 30-60s TTL for compliance
3. **Tag-based invalidation**: Only invalidate affected caches
4. **Automatic request deduplication**: Parallel requests to same endpoint deduplicated

## Security Requirements

### HIPAA Compliance
```typescript
// All PHI data must have:
1. Cache tags for granular invalidation
2. Shorter TTL (30-60s maximum)
3. Audit logging on access
4. Secure error messages (no PHI in errors)

// Example:
const response = await serverGet<Student[]>('/api/students', {}, {
  cache: 'force-cache',
  next: {
    revalidate: CACHE_TTL.PHI_STANDARD, // 60s
    tags: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
  }
});
```

### Authentication
- Token automatically injected from cookies (server-side only)
- CSRF token added for mutations
- Automatic redirect to login on 401
- Automatic redirect to access-denied on 403

### Security Headers
All requests include:
```typescript
'X-Content-Type-Options': 'nosniff'
'X-Frame-Options': 'DENY'
'X-XSS-Protection': '1; mode=block'
'X-Request-ID': /* unique ID for tracing */
```

## Migration Patterns

### Server Actions (Completed)
**File**: `/actions/students.actions.ts`

**Changes**:
1. Replaced `apiClient` import with `serverGet`, `serverPost`, etc.
2. Added `CACHE_TAGS` import
3. Updated all API calls with cache configuration
4. Changed error handling to use `NextApiClientError`
5. Ensured all mutations use `no-store` cache
6. All revalidation calls use standardized cache tags

### Remaining Files to Migrate
Following the same pattern:
- `/actions/medications.actions.ts` - 20+ functions
- `/actions/incidents.actions.ts`
- `/actions/appointments.actions.ts`
- `/actions/health-records.actions.ts`
- `/actions/documents.actions.ts`
- `/actions/forms.actions.ts`
- `/actions/inventory.actions.ts`
- `/actions/compliance.actions.ts`
- `/actions/settings.actions.ts`

### Server Components
**Pattern for data fetching**:
```typescript
// In page.tsx (Server Component)
import { serverGet } from '@/lib/api/nextjs-client';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

export default async function StudentsPage() {
  const students = await serverGet<{ data: Student[] }>(
    '/api/students',
    {},
    {
      cache: 'force-cache',
      next: {
        revalidate: CACHE_TTL.PHI_STANDARD,
        tags: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
      }
    }
  );

  return <StudentList students={students.data} />;
}
```

## Backward Compatibility Strategy

**Gradual Migration**:
1. Keep old `apiClient` for client-side usage
2. New `nextjs-client` for server-side only
3. Migrate Server Actions first (highest impact)
4. Then migrate Server Components
5. Finally migrate API routes
6. Deprecated axios usage only after full migration

**No Breaking Changes**:
- All existing imports remain valid
- API signatures remain compatible
- Error handling patterns preserved
- Type safety enhanced, not changed

## Benefits Achieved

### Performance
- ✅ Automatic request deduplication
- ✅ Reduced bundle size (no axios on server)
- ✅ Intelligent caching with granular invalidation
- ✅ Fewer redundant API calls

### Developer Experience
- ✅ Type-safe API calls with generics
- ✅ Consistent error handling
- ✅ Better IDE autocomplete
- ✅ Simplified cache management

### Compliance
- ✅ HIPAA-compliant cache TTLs
- ✅ Audit logging preserved
- ✅ PHI data properly tagged
- ✅ Security headers enforced

### Architecture
- ✅ SOLID principles applied throughout
- ✅ Type safety guarantees
- ✅ Testable, modular design
- ✅ Clear separation of concerns

## Next Steps

1. **Complete Server Actions Migration**: Apply pattern to remaining 9 action files
2. **Audit Server Components**: Add data fetching with caching where needed
3. **Implement cacheLife**: Use Next.js 15+ advanced caching for specific routes
4. **Performance Testing**: Measure cache hit rates and response times
5. **Documentation**: Create developer guide for caching patterns
6. **Deprecate Axios**: Remove axios dependency after full migration complete
