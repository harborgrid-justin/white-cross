# TS2304 "Cannot Find Name" Errors - Quick Reference Guide

## Executive Summary
- **Total Errors**: 222
- **Resolved**: 52 (23%)
- **Remaining**: 170 (77%)
- **Completion Time**: 2-3 hours estimated

## Quick Fixes (Resolve 122 of 170 errors - 72%)

### Fix 1: Auth Context Usage (93 errors - 55%)
**Problem**: Files use `user`, `loading`, `logout`, `login` without importing/destructuring

**Solution**: Replace auth context initialization pattern

**Files Affected** (10 files):
- `components/layout/AppLayout.tsx`
- `guards/navigationGuards.tsx`
- `pages/health/HealthRecords.tsx`
- `pages/auth/Login.tsx`
- `components/development/navigation/examples.tsx`
- `pages/dashboard/Dashboard.tsx`
- `pages/health/Appointments.tsx`
- `pages/appointments/Appointments.tsx`
- `pages/appointments/AppointmentDetail.tsx`
- `hooks/domains/incidents/FollowUpActionContext.tsx`

**Find and Replace Pattern**:
```typescript
// OLD (INCORRECT):
const auth = useAuth()

// NEW (CORRECT):
const { user, isLoading: loading, logout, login } = useAuth()
```

**PowerShell Script**: `.temp/fix-auth-context-usage.ps1` (ready to run)

**Manual Steps**:
1. Open each file
2. Find `const auth = useAuth()`
3. Replace with `const { user, isLoading: loading, logout, login } = useAuth()`
4. Save file

---

### Fix 2: apiServiceRegistry Imports (29 errors - 17%)
**Problem**: Files use `apiServiceRegistry` without importing it

**Files Affected** (~15 files in `hooks/domains/`):
- `hooks/domains/dashboard/queries/useStatisticsQueries.ts`
- `hooks/domains/medications/mutations/useMedicationAdministrationService.ts`
- And ~13 more hook files

**Solution**: Add import statement

**Add to top of each file**:
```typescript
import { apiServiceRegistry } from '@/services'
```

**Find Files Command**:
```bash
cd frontend && npx tsc --noEmit 2>&1 | grep "TS2304.*apiServiceRegistry" | awk -F: '{print $1}' | sort | uniq
```

**PowerShell Script** (create if needed):
```powershell
# Find all files using apiServiceRegistry without import
$files = Get-ChildItem -Path "src/hooks" -Recurse -Filter "*.ts" | Where-Object {
    $content = Get-Content $_.FullName -Raw
    ($content -match "apiServiceRegistry") -and ($content -notmatch "import.*apiServiceRegistry")
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newImport = "import { apiServiceRegistry } from '@/services'`r`n"

    # Add after existing imports
    if ($content -match "(?s)(import.*?['\`"];?\r?\n)+") {
        $content = $content -replace "(?s)(import.*?['\`"];?\r?\n)+", "$&$newImport"
    }

    Set-Content -Path $file.FullName -Value $content -NoNewline
}
```

---

## Type Definitions (Resolve 10 errors - 6%)

### Type 1: HealthTrendData (3 errors)
**Create in**: `frontend/src/types/dashboard.ts`

```typescript
export interface HealthTrendData {
  date: string;
  value: number;
  metric: string;
  label?: string;
  trend?: 'up' | 'down' | 'stable';
  percentage?: number;
}
```

**Then add to exports**:
```typescript
// In frontend/src/types/index.ts
export type { HealthTrendData } from './dashboard'
```

---

### Type 2: ErrorResponse (3 errors)
**Create in**: `frontend/src/types/api.ts`

```typescript
export interface ErrorResponse {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
  errors?: Record<string, string[]>;
  timestamp?: string;
  traceId?: string;
}
```

**Then add to exports**:
```typescript
// In frontend/src/types/api/index.ts
export type { ErrorResponse } from './responses'
```

---

### Type 3: ReportFilters (1 error)
**Create in**: `frontend/src/types/reports.ts`

```typescript
export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  reportType?: string;
  category?: string;
  includeInactive?: boolean;
  format?: 'pdf' | 'excel' | 'csv';
}
```

---

### Type 4: PersistenceManager (1 error)
**Create in**: `frontend/src/services/cache/PersistenceManager.ts` (if doesn't exist)

```typescript
export interface PersistenceManager {
  save<T>(key: string, data: T): Promise<void>;
  load<T>(key: string): Promise<T | null>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

export class LocalStoragePersistenceManager implements PersistenceManager {
  async save<T>(key: string, data: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async load<T>(key: string): Promise<T | null> {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }

  async keys(): Promise<string[]> {
    return Object.keys(localStorage);
  }
}
```

---

## Manager Exports (Resolve 6 errors - 4%)

### Export 1: getCacheManager (3 errors)
**Add to**: `frontend/src/services/cache/index.ts`

```typescript
import { CacheManager } from './CacheManager'

let cacheManagerInstance: CacheManager | null = null

export function getCacheManager(): CacheManager {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new CacheManager()
  }
  return cacheManagerInstance
}

export { CacheManager }
```

---

### Export 2: getPersistenceManager (3 errors)
**Add to**: `frontend/src/services/cache/index.ts`

```typescript
import { LocalStoragePersistenceManager, PersistenceManager } from './PersistenceManager'

let persistenceManagerInstance: PersistenceManager | null = null

export function getPersistenceManager(): PersistenceManager {
  if (!persistenceManagerInstance) {
    persistenceManagerInstance = new LocalStoragePersistenceManager()
  }
  return persistenceManagerInstance
}

export type { PersistenceManager }
export { LocalStoragePersistenceManager }
```

---

## Query Key Factories (Resolve 1 error)

### Factory: healthRecordsKeys (1 error)
**Create file**: `frontend/src/hooks/domains/health-records/queryKeys.ts`

```typescript
export const healthRecordsKeys = {
  all: ['healthRecords'] as const,
  lists: () => [...healthRecordsKeys.all, 'list'] as const,
  list: (filters: any) => [...healthRecordsKeys.lists(), { filters }] as const,
  details: () => [...healthRecordsKeys.all, 'detail'] as const,
  detail: (id: string) => [...healthRecordsKeys.details(), id] as const,
  allergies: (studentId: string) => [...healthRecordsKeys.all, 'allergies', studentId] as const,
  conditions: (studentId: string) => [...healthRecordsKeys.all, 'conditions', studentId] as const,
  vaccinations: (studentId: string) => [...healthRecordsKeys.all, 'vaccinations', studentId] as const,
}
```

**Then export**:
```typescript
// In frontend/src/hooks/domains/health-records/index.ts
export { healthRecordsKeys } from './queryKeys'
```

---

## Configuration Constants (Resolve 4 errors - 2%)

### Config 1: TTL_CONFIG (1 error)
**Create file**: `frontend/src/config/cache.ts`

```typescript
export const TTL_CONFIG = {
  short: 5 * 60 * 1000,      // 5 minutes
  medium: 30 * 60 * 1000,    // 30 minutes
  long: 60 * 60 * 1000,      // 1 hour
  veryLong: 24 * 60 * 60 * 1000,  // 24 hours
  permanent: Infinity
} as const
```

---

### Config 2: STUDENT_CACHE_CONFIG (1 error)
**Add to**: `frontend/src/config/cache.ts`

```typescript
export const STUDENT_CACHE_CONFIG = {
  ttl: TTL_CONFIG.medium,
  maxSize: 100,
  staleTime: 5 * 60 * 1000,
  gcInterval: 10 * 60 * 1000  // Garbage collection every 10 minutes
} as const
```

---

### Config 3: REFETCH_STRATEGIES (1 error)
**Create file**: `frontend/src/config/query.ts`

```typescript
export const REFETCH_STRATEGIES = {
  onWindowFocus: true,
  onReconnect: true,
  onMount: true,
  staleTime: 5 * 60 * 1000,
  cacheTime: 30 * 60 * 1000,
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000)
} as const
```

**Export from main config**:
```typescript
// In frontend/src/config/index.ts
export * from './cache'
export * from './query'
```

---

## Hook Exports (Resolve 3 errors - 2%)

### Hook 1: useStudentDetails (1 error)
**Check if exists**: `frontend/src/hooks/domains/students/useStudentDetails.ts`

If doesn't exist, create:
```typescript
import { useQuery } from '@tanstack/react-query'
import { studentsApi } from '@/services'

export function useStudentDetails(studentId: string | undefined) {
  return useQuery({
    queryKey: ['students', 'detail', studentId],
    queryFn: () => studentId ? studentsApi.getById(studentId) : null,
    enabled: !!studentId
  })
}
```

**Then export**:
```typescript
// In frontend/src/hooks/domains/students/index.ts
export { useStudentDetails } from './useStudentDetails'
```

---

### Hook 2: useCacheManager (1 error)
**Create**: `frontend/src/hooks/utilities/useCacheManager.ts`

```typescript
import { useMemo } from 'react'
import { getCacheManager } from '@/services/cache'

export function useCacheManager() {
  return useMemo(() => getCacheManager(), [])
}
```

**Then export**:
```typescript
// In frontend/src/hooks/utilities/index.ts
export { useCacheManager } from './useCacheManager'
```

---

### Hook 3: useHealthcareCompliance (1 error)
**Create**: `frontend/src/hooks/domains/compliance/useHealthcareCompliance.ts`

```typescript
import { useQuery } from '@tanstack/react-query'
import { complianceApi } from '@/services'

export function useHealthcareCompliance() {
  return useQuery({
    queryKey: ['compliance', 'healthcare'],
    queryFn: () => complianceApi.getHealthcareCompliance(),
    staleTime: 30 * 60 * 1000 // 30 minutes
  })
}
```

**Then export**:
```typescript
// In frontend/src/hooks/domains/compliance/index.ts
export { useHealthcareCompliance } from './useHealthcareCompliance'
```

---

## Miscellaneous Fixes (Resolve 4 errors)

### Fix 1: studentsApi imports (2 errors)
**Files**: Check TS output for files using `studentsApi` without import

**Add**:
```typescript
import { studentsApi } from '@/services'
```

---

### Fix 2: incidentapiServiceRegistry typo (1 error)
**Find**: Search for `incidentapiServiceRegistry` in codebase
**Replace with**: `apiServiceRegistry.incident` or `incidentReportsApi`

---

## Validation Steps

### 1. Run TypeScript Compilation
```bash
cd frontend && npx tsc --noEmit
```

### 2. Check for TS2304 Errors
```bash
cd frontend && npx tsc --noEmit 2>&1 | grep "TS2304" | wc -l
```

Should return: **0**

### 3. Verify No New Errors Introduced
```bash
cd frontend && npx tsc --noEmit 2>&1 | grep "error TS" | wc -l
```

Compare with baseline error count

---

## Implementation Checklist

- [ ] Fix auth context usage (93 errors) - Run `.temp/fix-auth-context-usage.ps1`
- [ ] Add apiServiceRegistry imports (29 errors) - Create and run script
- [ ] Create HealthTrendData type (3 errors)
- [ ] Create ErrorResponse type (3 errors)
- [ ] Create ReportFilters type (1 error)
- [ ] Create PersistenceManager type (1 error)
- [ ] Export getCacheManager function (3 errors)
- [ ] Export getPersistenceManager function (3 errors)
- [ ] Create healthRecordsKeys factory (1 error)
- [ ] Create TTL_CONFIG constant (1 error)
- [ ] Create STUDENT_CACHE_CONFIG constant (1 error)
- [ ] Create REFETCH_STRATEGIES constant (1 error)
- [ ] Export useStudentDetails hook (1 error)
- [ ] Export useCacheManager hook (1 error)
- [ ] Export useHealthcareCompliance hook (1 error)
- [ ] Fix studentsApi imports (2 errors)
- [ ] Fix incidentapiServiceRegistry typo (1 error)
- [ ] Run final validation - verify 0 TS2304 errors

---

## Scripts Available

### 1. fix-createApiError-imports.ps1
**Status**: ✅ Completed (resolved 44 errors)
**Location**: `.temp/fix-createApiError-imports.ps1`

### 2. fix-auth-context-usage.ps1
**Status**: ⏳ Ready to run (will resolve 93 errors)
**Location**: `.temp/fix-auth-context-usage.ps1`
**Command**:
```powershell
powershell -ExecutionPolicy Bypass -File .temp/fix-auth-context-usage.ps1
```

---

## Priority Order

1. **High Priority** (resolves 122 errors - 72%):
   - Auth context usage fixes
   - apiServiceRegistry imports

2. **Medium Priority** (resolves 38 errors - 22%):
   - Type definitions
   - Manager exports
   - Query key factories
   - Configuration constants
   - Hook exports

3. **Low Priority** (resolves 10 errors - 6%):
   - Miscellaneous fixes

---

## Expected Outcome

After completing all fixes:
- **TS2304 errors**: 0
- **Total errors fixed**: 222
- **Files modified**: ~50 files
- **Files created**: ~10 files
- **Time investment**: 2-3 hours
