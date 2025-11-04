# Student Mutations Refactoring Diagram

## Before: Single Large File

```
mutations.ts (942 lines)
├── Imports & Types (50 lines)
├── Shared Utilities (30 lines)
├── useCreateStudent (100 lines)
├── useUpdateStudent (140 lines)
├── useDeactivateStudent (70 lines)
├── useReactivateStudent (70 lines)
├── useTransferStudent (75 lines)
├── useBulkUpdateStudents (105 lines)
├── usePermanentDeleteStudent (90 lines)
└── useStudentMutations (212 lines)
```

**Problems:**
- 🔴 Single file with 942 lines
- 🔴 Hard to navigate
- 🔴 Difficult to maintain
- 🔴 Slow IDE performance
- 🔴 Complex code reviews

## After: Modular Structure

```
mutations/
│
├── Core Type Definitions
│   └── types.ts (52 lines)
│       ├── ApiError
│       ├── StudentMutationResult
│       ├── BulkMutationResult
│       └── PermanentDeleteResult
│
├── Shared Utilities
│   └── utils.ts (55 lines)
│       └── invalidateStudentCache()
│
├── CRUD Operations
│   └── useStudentCRUDMutations.ts (263 lines)
│       ├── useCreateStudent()
│       └── useUpdateStudent()
│
├── Status Management
│   └── useStudentStatusMutations.ts (165 lines)
│       ├── useDeactivateStudent()
│       └── useReactivateStudent()
│
├── Transfer Operations
│   └── useStudentTransferMutations.ts (98 lines)
│       └── useTransferStudent()
│
├── Bulk Operations
│   └── useStudentBulkMutations.ts (128 lines)
│       └── useBulkUpdateStudents()
│
├── Delete Operations
│   └── useStudentDeleteMutations.ts (111 lines)
│       └── usePermanentDeleteStudent()
│
├── Composite Hook
│   └── useStudentMutationsComposite.ts (138 lines)
│       └── useStudentMutationsComposite()
│           ├── All individual hooks
│           ├── Loading states
│           ├── Error states
│           └── Reset functions
│
└── Public API
    └── index.ts (56 lines)
        ├── Re-exports all hooks
        ├── Re-exports types
        └── Default export
```

**Benefits:**
- ✅ All files under 300 lines (max: 263)
- ✅ Clear separation of concerns
- ✅ Easy to navigate and maintain
- ✅ Fast IDE performance
- ✅ Simplified code reviews
- ✅ Better tree-shaking potential

## Import Flow

### Old Import Pattern
```typescript
import { useCreateStudent } from './mutations/mutations';
                                         ↑
                                    942 lines!
```

### New Import Pattern
```typescript
import { useCreateStudent } from './mutations';
                                       ↓
                                   index.ts (56 lines)
                                       ↓
                          useStudentCRUDMutations.ts (263 lines)
                                       ↓
                              useCreateStudent() ✅
```

## Dependency Graph

```
index.ts
  │
  ├──→ types.ts
  ├──→ utils.ts
  ├──→ useStudentCRUDMutations.ts
  │      ├──→ types.ts
  │      ├──→ utils.ts
  │      ├──→ queryKeys.ts
  │      └──→ cacheConfig.ts
  │
  ├──→ useStudentStatusMutations.ts
  │      ├──→ types.ts
  │      ├──→ utils.ts
  │      ├──→ queryKeys.ts
  │      └──→ cacheConfig.ts
  │
  ├──→ useStudentTransferMutations.ts
  │      ├──→ types.ts
  │      ├──→ utils.ts
  │      ├──→ queryKeys.ts
  │      └──→ cacheConfig.ts
  │
  ├──→ useStudentBulkMutations.ts
  │      ├──→ types.ts
  │      ├──→ utils.ts
  │      └──→ cacheConfig.ts
  │
  ├──→ useStudentDeleteMutations.ts
  │      ├──→ types.ts
  │      ├──→ utils.ts
  │      ├──→ queryKeys.ts
  │      └──→ cacheConfig.ts
  │
  └──→ useStudentMutationsComposite.ts
         ├──→ useStudentCRUDMutations.ts
         ├──→ useStudentStatusMutations.ts
         ├──→ useStudentTransferMutations.ts
         ├──→ useStudentBulkMutations.ts
         └──→ useStudentDeleteMutations.ts
```

## File Size Comparison

```
Original:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 942 lines
mutations.ts

New Structure:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 263 lines (largest)
useStudentCRUDMutations.ts

━━━━━━━━━━━━━━━━━━━━━━ 165 lines
useStudentStatusMutations.ts

━━━━━━━━━━━━━ 138 lines
useStudentMutationsComposite.ts

━━━━━━━━━━━━ 128 lines
useStudentBulkMutations.ts

━━━━━━━━━━ 111 lines
useStudentDeleteMutations.ts

━━━━━━━ 98 lines
useStudentTransferMutations.ts

━━ 56 lines
index.ts

━━ 55 lines
utils.ts

━ 52 lines
types.ts
```

## Usage Examples

### Pattern 1: Individual Imports (Recommended for Tree-Shaking)
```typescript
import { useCreateStudent } from '@/hooks/domains/students/mutations/useStudentCRUDMutations';
import { useDeactivateStudent } from '@/hooks/domains/students/mutations/useStudentStatusMutations';

function StudentForm() {
  const createStudent = useCreateStudent({
    onSuccess: (result) => {
      toast.success('Student created!');
    }
  });

  return <form>...</form>;
}
```

### Pattern 2: Index Imports (Recommended for Convenience)
```typescript
import {
  useCreateStudent,
  useUpdateStudent,
  useDeactivateStudent
} from '@/hooks/domains/students/mutations';

function StudentManagement() {
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deactivateStudent = useDeactivateStudent();

  return <div>...</div>;
}
```

### Pattern 3: Composite Hook (Recommended for Full Suite)
```typescript
import { useStudentMutationsComposite } from '@/hooks/domains/students/mutations';

function StudentDashboard() {
  const {
    createStudent,
    updateStudent,
    deactivateStudent,
    isCreating,
    isUpdating,
    createError,
    resetAll
  } = useStudentMutationsComposite();

  return <div>...</div>;
}
```

## Migration Path

### Phase 1: No Changes Required ✅
All existing code continues to work:
```typescript
// This still works!
import { useCreateStudent } from '@/hooks/domains/students/mutations/mutations';
```

### Phase 2: Update to Index Imports (Optional)
```typescript
// New recommended pattern
import { useCreateStudent } from '@/hooks/domains/students/mutations';
```

### Phase 3: Adopt Specific Imports (Optional)
```typescript
// Most specific - best for tree-shaking
import { useCreateStudent } from '@/hooks/domains/students/mutations/useStudentCRUDMutations';
```

## Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Largest File | 942 lines | 263 lines | 72% reduction |
| Total Files | 1 | 9 | Better organization |
| Average File Size | 942 lines | 118 lines | 87% reduction |
| Files Over 300 Lines | 1 | 0 | 100% compliance |
| Type Safety | ✅ | ✅ | Maintained |
| Backward Compatibility | N/A | ✅ | Preserved |

## Conclusion

This refactoring transforms a monolithic 942-line file into a well-organized, modular structure where:
- Each file has a single, clear responsibility
- All files are under 300 lines
- Backward compatibility is maintained
- Developer experience is significantly improved
- Code is easier to understand, test, and maintain
