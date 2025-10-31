# Data Fetching and Caching Implementation Plan

**Agent ID**: typescript-architect
**Task ID**: C4D9F2
**Started**: 2025-10-31
**Mission**: Update frontend to use Next.js caching and revalidation best practices

## References to Other Agent Work
- Dynamic Rendering: `.temp/completion-summary-DY3R8N.md` (145 routes standardized)
- Architecture notes: Various agents (E2E9C7, M7B2K9, MG5X2Y, AP9E2X, N4W8Q2, R3M8D1)

## Current State Analysis

### Strengths
- ✅ Cache constants defined (`/lib/cache/constants.ts`) with CACHE_TTL and CACHE_TAGS
- ✅ Server Actions use `revalidateTag` and `revalidatePath` correctly
- ✅ `/lib/server/fetch.ts` has good Next.js fetch support
- ✅ HIPAA-compliant audit logging in place

### Issues Identified
- ❌ **Axios Usage**: `/services/core/ApiClient.ts` uses axios instead of Next.js fetch
  - Cannot leverage automatic request deduplication
  - Cannot integrate with Next.js cache system
  - No cache tag support
- ❌ **Server Actions**: Use axios-based `apiClient` instead of Next.js fetch
- ❌ **No cacheLife**: Next.js 15+ `cacheLife` API not utilized
- ❌ **Mixed fetch utilities**: Multiple fetch implementations exist

## Implementation Phases

### Phase 1: Create Next.js Fetch-Based API Client (Priority: CRITICAL)
**Objective**: Replace axios with Next.js native fetch while preserving all features

**Tasks**:
1. Create `/lib/api/nextjs-client.ts` - New fetch-based API client
2. Support all features from existing ApiClient:
   - Type-safe HTTP methods (GET, POST, PUT, PATCH, DELETE)
   - Authentication token injection
   - Error handling and retry logic
   - Request/response interceptors
   - CSRF protection
3. Add Next.js-specific features:
   - Cache configuration (cache, revalidate, tags)
   - cacheLife support
   - Automatic request deduplication
4. Maintain backward compatibility during migration

### Phase 2: Update Server Actions (Priority: HIGH)
**Objective**: Migrate all Server Actions from axios to Next.js fetch

**Files to Update** (~10 action files):
- `/actions/students.actions.ts` ✅ Has revalidate, needs fetch migration
- `/actions/medications.actions.ts` ✅ Has revalidate, needs fetch migration
- `/actions/incidents.actions.ts`
- `/actions/appointments.actions.ts`
- `/actions/health-records.actions.ts`
- `/actions/documents.actions.ts`
- `/actions/forms.actions.ts`
- `/actions/inventory.actions.ts`
- `/actions/compliance.actions.ts`
- `/actions/settings.actions.ts`

**Pattern**:
```typescript
// BEFORE (axios)
const response = await apiClient.post<T>(endpoint, data);

// AFTER (Next.js fetch)
const response = await serverPost<T>(endpoint, data, {
  cache: 'no-store', // Server Actions typically no-store
  next: { tags: [CACHE_TAGS.RESOURCE] }
});
```

### Phase 3: Add Cache Configuration to Server Components (Priority: HIGH)
**Objective**: Add proper caching to data fetching in Server Components

**Approach**:
1. Audit all Server Components that fetch data
2. Add cache configuration based on data type:
   - PHI data: 30-60s TTL with cache tags
   - Static data: 300s TTL
   - Real-time: 10s TTL or no-store
3. Use cache tags for granular invalidation

### Phase 4: Implement cacheLife API (Priority: MEDIUM)
**Objective**: Use Next.js 15+ cacheLife for advanced cache control

**Tasks**:
1. Create cache profiles using cacheLife
2. Apply to appropriate routes and fetches
3. Document cache strategy

### Phase 5: Update API Routes (Priority: MEDIUM)
**Objective**: Ensure API routes use Next.js fetch with caching

**Files**:
- `/app/api/students/route.ts`
- `/app/api/medications/route.ts`
- Other API routes

### Phase 6: Documentation and Testing (Priority: LOW)
**Objective**: Document caching strategies and verify implementation

**Tasks**:
1. Create caching strategy documentation
2. Update CLAUDE.md with caching patterns
3. Verify cache invalidation works correctly
4. Performance testing

## Timeline
- Phase 1: 2-3 hours (complex migration)
- Phase 2: 2-3 hours (10 action files)
- Phase 3: 1-2 hours (audit and update)
- Phase 4: 1 hour (cacheLife implementation)
- Phase 5: 1 hour (API routes)
- Phase 6: 1 hour (docs and testing)
- **Total**: 8-11 hours

## Success Criteria
- All Server Actions use Next.js fetch with proper cache configuration
- Cache tags applied to all PHI data
- revalidatePath/revalidateTag used consistently
- No axios usage in Server Components or Server Actions
- cacheLife implemented for key routes
- Performance improvements measurable
- Type safety maintained throughout

## Risk Mitigation
- Incremental migration: Keep old apiClient until all migrations complete
- Type safety: Use TypeScript to catch breaking changes
- Testing: Verify each phase before moving to next
- Rollback plan: Keep git commits atomic for easy reversion
