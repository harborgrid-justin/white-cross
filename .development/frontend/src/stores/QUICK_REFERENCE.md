# State Management Quick Reference

**Last Updated**: 2025-10-24

## Quick Import Guide

### Selectors
```typescript
import {
  // Students
  selectActiveStudents,
  selectStudentsByGrade,
  selectStudentsFiltered,

  // Medications
  selectActiveMedications,
  selectMedicationsDueToday,
  selectMedicationsFiltered,

  // Health Records
  selectHealthRecordsByStudent,
  selectHealthRecordStatistics,
  selectHealthRecordsFiltered
} from '@/stores/selectors';
```

### Hooks
```typescript
import {
  useAppDispatch,
  useAppSelector,
  useSlice,
  useIsLoading,
  useEntityById
} from '@/stores/hooks/typedHooks';
```

### Query Configuration
```typescript
import {
  queryKeys,
  CACHE_CONFIGS,
  invalidationPatterns
} from '@/config/queryClientEnhanced';
```

### Optimistic Updates
```typescript
import {
  createOptimisticUpdate,
  createMedicationAdministrationOptimistic,
  createHealthRecordOptimistic
} from '@/hooks/utils/optimisticUpdates';
```

## Common Patterns

### Using Memoized Selectors
```typescript
const activeStudents = useAppSelector(selectActiveStudents);
const dueMedications = useAppSelector(selectMedicationsDueToday);
```

### Parameterized Selectors
```typescript
const fifthGraders = useAppSelector(state =>
  selectStudentsByGrade(state, 5)
);
```

### Complex Filtering
```typescript
const filtered = useAppSelector(state =>
  selectStudentsFiltered(state, {
    grade: 5,
    hasAllergies: true,
    searchQuery: 'john'
  })
);
```

### Optimistic Updates
```typescript
const { mutate } = useMutation({
  mutationFn: administerMedication,
  onMutate: async (data) => {
    return createMedicationAdministrationOptimistic(
      queryClient,
      medicationId,
      studentId,
      data
    );
  },
  onError: (err, variables, context) => {
    context?.rollback();
  }
});
```

## Cache Configurations

| Domain | Stale Time | Use Case |
|--------|------------|----------|
| healthRecords | 1 min | Critical freshness |
| medications | 2 min | Safety critical |
| students | 5 min | Moderate freshness |
| districts | 30 min | Rarely changes |
| settings | 60 min | Static config |

## Performance Tips

1. **Always use memoized selectors** - Never compute in components
2. **Select minimal data** - Don't select entire objects when you need one field
3. **Use shallow equality** - For object selections with multiple fields
4. **Implement optimistic updates** - For immediate user feedback
5. **Set appropriate stale times** - Based on data criticality

## Full Documentation

See `/frontend/src/stores/STATE_MANAGEMENT_GUIDE.md` for comprehensive documentation.
