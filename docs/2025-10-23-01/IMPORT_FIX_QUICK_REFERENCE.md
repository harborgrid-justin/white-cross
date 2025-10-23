# Import Fix Quick Reference

## What Was Fixed

### ✅ API Imports (120 files)
**Before:**
```typescript
import { appointmentsApi } from '@/services/api';
const result = await appointmentsApi.getAll();
```

**After:**
```typescript
import { apiServiceRegistry } from '@/services';
const result = await apiServiceRegistry.appointmentsApi.getAll();
```

### ✅ Context Imports (30+ files)
**Before:**
```typescript
import { useAuthContext } from '@/contexts/AuthContext';
const { user } = useAuthContext();
```

**After:**
```typescript
import { useAuth } from '@/contexts/AuthContext';
const { user } = useAuth();
```

### ✅ Relative Paths (60+ files)
**Before:**
```typescript
import { something } from '../../../services/someApi';
import { Type } from '../../types/someType';
```

**After:**
```typescript
import { something } from '@/services/modules/someApi';
import { Type } from '@/types/someType';
```

## Remaining Issues Breakdown

### 1. Missing Redux Slices (Cannot Find Module)
- `@/stores/slices/healthRecordsSlice`
- `@/stores/slices/medicationsSlice`
- `@/stores/slices/appointmentsSlice`
- `@/stores/slices/emergencyContactsSlice`

**Fix**: Create these slices or remove references

### 2. Missing Slice Exports
**incidentReportsSlice** needs these exports:
- fetchIncidentReports
- createIncidentReport
- updateIncidentReport
- deleteIncidentReport
- searchIncidentReports

**studentsSlice** needs:
- selectStudentSort
- StudentUIState type

**Fix**: Add missing selectors/actions to slices

### 3. Missing Type Exports
Need to export from `@/types`:
- Medication
- InventoryItem
- AdverseReaction

**Fix**: Add type exports to type index files

### 4. Missing Hook Exports
`useOptimisticStudents` needs:
- useOptimisticStudentCreate
- useOptimisticStudentUpdate
- useOptimisticStudentDeactivate
- useOptimisticStudentReactivate
- useOptimisticStudentTransfer

**Fix**: Export individual operations from composite hook

## Scripts Created

1. `fix-hook-imports.ps1` - Fixes API, service, and path imports
2. `fix-component-imports.ps1` - Fixes component API usage
3. `fix-remaining-imports.ps1` - Fixes contexts and types

## Success Metrics

- **Initial Errors**: 351
- **Fixed**: 120+ errors (34% reduction)
- **Remaining**: 231 errors
- **Files Modified**: 108+ files
- **Patterns Standardized**: 6 major categories

## How to Use Going Forward

### Import APIs
```typescript
import { apiServiceRegistry } from '@/services';

// Use like this:
apiServiceRegistry.studentsApi.getAll();
apiServiceRegistry.appointmentsApi.create();
apiServiceRegistry.healthRecordsApi.getRecords();
```

### Import Types
```typescript
import type { Student, CreateStudentRequest } from '@/types';
```

### Import Hooks
```typescript
import { useStudents } from '@/hooks/domains/students';
```

### Import Store Slices
```typescript
import { selectAllStudents } from '@/stores/slices/studentsSlice';
```

