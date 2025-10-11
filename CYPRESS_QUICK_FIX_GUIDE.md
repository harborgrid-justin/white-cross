# Cypress Test Suite - Quick Fix Guide

## CRITICAL ISSUE IDENTIFIED

**All 2,478 Cypress tests are failing** due to a single module export error.

---

## THE PROBLEM

```
SyntaxError: The requested module '/src/services/modules/healthRecordsApi.ts'
does not provide an export named 'CircuitBreakerError'
```

---

## THE FIX (5 Minutes)

### Step 1: Fix Missing Export

**File**: `frontend/src/services/modules/healthRecordsApi.ts`

**Add this line at the end of the file (after line 2122)**:

```typescript
// Export service instance with alternative name for hooks
export const healthRecordsApiService = healthRecordsApi;
```

### Step 2: Verify Exports

**Check that these exports exist in the same file**:

```typescript
// Should already exist (line 2122)
export const healthRecordsApi = new HealthRecordsApi();

// Should already exist (lines 2097-2102)
export class CircuitBreakerError extends HealthRecordsApiError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(message, 503, 'CIRCUIT_BREAKER_OPEN');
    this.name = 'CircuitBreakerError';
  }
}
```

### Step 3: Clear Cache & Rebuild

```bash
cd frontend
rm -rf node_modules/.vite
rm -rf dist
npm run build
```

### Step 4: Restart Dev Server

Stop the current dev server (Ctrl+C) and restart:

```bash
npm run dev
```

### Step 5: Re-run Tests

```bash
npm run test:e2e
```

---

## EXPECTED OUTCOME

After this fix:
- ✅ Application should load without module errors
- ✅ Tests should begin executing (not all blocked)
- ⚠️ New failures will appear (missing elements, test IDs, etc.)
- ⚠️ This reveals the ACTUAL test issues that need fixing

---

## IF ISSUE PERSISTS

### Alternative Fix: Update Import Statement

**File**: `frontend/src/hooks/useHealthRecords.ts` (line 22)

**Change FROM**:
```typescript
import {
  healthRecordsApiService,  // ❌ This doesn't exist
  // ... other imports
} from '../services/modules/healthRecordsApi';
```

**Change TO**:
```typescript
import {
  healthRecordsApi as healthRecordsApiService,  // ✅ Use alias
  // ... other imports
} from '../services/modules/healthRecordsApi';
```

---

## CHECK FOR CIRCULAR DEPENDENCIES

```bash
cd frontend
npx madge --circular src/
```

If circular dependencies are found, refactor to break the cycle.

---

## NEXT STEPS AFTER FIX

1. ✅ Verify application loads at http://localhost:5173
2. ✅ Check browser console for errors
3. ✅ Re-run Cypress tests
4. ✅ Create new failure report for actual test issues
5. ✅ Begin systematic test repair

---

## NEED HELP?

See full analysis in: `CYPRESS_TEST_FAILURE_REPORT.md`
