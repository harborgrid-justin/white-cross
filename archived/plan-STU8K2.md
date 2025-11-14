# Student Utils Breakdown Plan (STU8K2)

## Agent Information
**Agent ID:** typescript-architect
**Task:** Break down studentUtils.ts (727 LOC) into smaller modules
**Date:** 2025-11-04
**Related Work:** BDM701 (budget mutations breakdown)

## Objectives
1. Split 727-line file into modules with max 300 LOC each
2. Maintain backward compatibility via index.ts
3. Preserve all existing functionality
4. Ensure proper type safety
5. Follow patterns established in BDM701

## Analysis
The file contains React hooks for:
- Cache management and invalidation (useCacheManager)
- PHI data handling (usePHIHandler)
- Cache warming strategies (useCacheWarming)
- Optimistic updates with rollback (useOptimisticUpdates)

## Proposed Module Structure

### 1. studentUtilityTypes.ts (~100 LOC)
**Purpose:** All type definitions and interfaces
**Exports:**
- `InvalidationPattern` type
- `PrefetchOptions` interface
- `CacheWarmingStrategy` interface
- `PHIHandlingOptions` interface
- `ApiError` interface

### 2. studentCacheUtils.ts (~250 LOC)
**Purpose:** Core cache management (useCacheManager hook)
**Functions:**
- `useCacheManager()` - Main cache management hook
  - invalidatePattern
  - clearStudentCache
  - removeStudentFromCache
  - updateStudentInCache
  - addStudentToCache
  - getCacheStats

### 3. studentPrefetchUtils.ts (~150 LOC)
**Purpose:** Prefetching and cache warming
**Functions:**
- Prefetch logic extracted from useCacheManager
- `useCacheWarming()` - Automatic cache warming hook
- Warming strategies implementation

### 4. studentPHIUtils.ts (~130 LOC)
**Purpose:** Protected Health Information handling
**Functions:**
- `usePHIHandler()` - PHI sanitization and logging
  - sanitizeData
  - logDataAccess
  - checkPHIPermission

### 5. studentOptimisticUtils.ts (~100 LOC)
**Purpose:** Optimistic updates with rollback
**Functions:**
- `useOptimisticUpdates()` - Optimistic update management
  - performOptimisticUpdate
  - rollbackUpdate
  - clearRollbacks

### 6. index.ts (~50 LOC)
**Purpose:** Backward compatibility re-exports
**Pattern:** Re-export all hooks from all modules

## Timeline
- Phase 1 (10 min): Create type definitions file
- Phase 2 (15 min): Create studentCacheUtils.ts
- Phase 3 (10 min): Create studentPrefetchUtils.ts
- Phase 4 (10 min): Create studentPHIUtils.ts
- Phase 5 (10 min): Create studentOptimisticUtils.ts
- Phase 6 (5 min): Create index.ts
- Phase 7 (5 min): Validation and cleanup

**Total Estimated Time:** 65 minutes

## Success Criteria
- All files under 300 LOC ✓
- Zero breaking changes ✓
- Full type safety maintained ✓
- All functionality preserved ✓
- Proper module boundaries ✓
- Complete documentation ✓
