# White Cross Examples - Quick Start Guide

> **Production-ready examples that you can copy-paste and use immediately**

## What's Inside

This repository contains **complete, working examples** demonstrating all patterns and best practices for the White Cross healthcare platform.

## The Examples

### 1. 📚 Student Management Complete
**File:** `src/pages/students/Students.COMPLETE.tsx` (1,047 lines)

**Copy-paste ready example showing:**
- Full CRUD with TanStack Query
- Optimistic updates with conflict resolution
- Smart prefetching (hover + scroll)
- Audit logging for PHI
- Search, filters, pagination
- Bulk operations
- Error boundaries

**Use this when:** Building any list/table interface with CRUD operations

---

### 2. 🏥 Health Records Complete
**File:** `src/pages/health/HealthRecords.COMPLETE.tsx` (845 lines)

**Copy-paste ready example showing:**
- Modular health APIs (allergies, vaccinations, vitals)
- PHI access logging (automatic)
- Circuit breaker integration
- Granular cache invalidation
- Export with critical audit
- Tab-based navigation
- Multiple data sources

**Use this when:** Managing healthcare data with strict compliance requirements

---

### 3. 💊 Medication Administration Complete
**File:** `src/pages/medications/MedicationAdmin.COMPLETE.tsx` (712 lines)

**Copy-paste ready example showing:**
- **CRITICAL operation handling**
- Immediate audit flush (no batching)
- Request deduplication (prevent double-dosing)
- Circuit breaker (5-second timeout)
- Five Rights validation
- High-priority bulkhead
- Adverse reaction reporting

**Use this when:** Implementing life-critical operations

---

### 4. 📖 Complete Documentation
**File:** `EXAMPLES.md` (Comprehensive guide)

**Includes:**
- Pattern demonstrations
- Migration guides (Before/After)
- Testing examples
- Best practices
- Learning path for new developers
- Full API reference

---

## Quick Copy-Paste Instructions

### 1. Copy the Example File

```bash
# Example: Copy student management
cp src/pages/students/Students.COMPLETE.tsx src/pages/students/Students.tsx
```

### 2. Update Imports

Update import paths to match your project structure:

```typescript
// Change this:
import { LoadingSpinner } from '@/components/LoadingSpinner';

// To match your structure:
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
```

### 3. Customize Styling

The examples use Tailwind CSS. If using a different system, update className attributes:

```typescript
// Tailwind example in the file:
<div className="px-6 py-3 bg-blue-600 text-white rounded-lg">

// Update to your system:
<Button variant="primary" size="large">
```

### 4. Add Missing Components

Some components are placeholders. Implement or import them:

```typescript
// Placeholders to implement:
<CreateStudentModal />
<EditStudentModal />
<DeleteConfirmModal />
```

### 5. Test Thoroughly

```bash
# Run unit tests
npm run test:frontend

# Run e2e tests
cd frontend && npm run test:e2e
```

---

## Key Patterns Demonstrated

### ✅ Optimistic Updates

```typescript
const { optimisticData, rollback } = useOptimisticUpdate({
  queryKey: ['students', 'list'],
  mutationFn: studentsApi.create,
  onConflict: async (serverData, optimisticData) => {
    return await resolveConflict(serverData, optimisticData);
  },
});
```

### ✅ Audit Logging

```typescript
// Automatic PHI access logging
await auditService.logPHIAccess(
  AuditAction.VIEW_STUDENT,
  studentId,
  AuditResourceType.STUDENT,
  studentId
);

// Manual operation logging
await auditService.log({
  action: AuditAction.UPDATE_STUDENT,
  resourceType: AuditResourceType.STUDENT,
  resourceId: id,
  status: AuditStatus.SUCCESS,
  isPHI: true,
  afterState: data,
});
```

### ✅ Circuit Breaker

```typescript
const circuitBreaker = getCircuitBreaker('medication');

const data = await circuitBreaker.execute(
  async () => await medicationApi.get(id),
  { timeout: 5000 }
);
```

### ✅ Smart Prefetching

```typescript
// Prefetch on hover
const handleHover = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: ['students', 'detail', id],
    queryFn: () => studentsApi.getById(id),
  });
};

// Prefetch next page on scroll
useEffect(() => {
  const handleScroll = () => {
    if (scrollPosition >= pageHeight * 0.8) {
      queryClient.prefetchQuery({
        queryKey: ['students', 'list', { page: nextPage }],
        queryFn: () => studentsApi.getAll({ page: nextPage }),
      });
    }
  };
  window.addEventListener('scroll', handleScroll);
}, []);
```

### ✅ Granular Cache Invalidation

```typescript
// Instead of invalidating everything:
// queryClient.invalidateQueries(['students']); // ❌ Too broad

// Use surgical invalidation:
const invalidationStrategy = getInvalidationStrategy(queryClient);
await invalidationStrategy.invalidate({
  type: 'update',
  resourceType: 'student',
  resourceId: studentId,
  changedFields: ['grade', 'nurseId'], // Only affected queries
});
```

---

## Common Customizations

### Change API Endpoints

```typescript
// In the example files, find:
const { data } = useQuery({
  queryKey: ['students', 'list'],
  queryFn: () => studentsApi.getAll(filters),
});

// Update to your API:
queryFn: () => myCustomApi.fetchStudents(filters),
```

### Add Custom Filters

```typescript
// In Students.COMPLETE.tsx, add to filters state:
const [filters, setFilters] = useState({
  isActive: true,
  page: 1,
  limit: 20,
  // Add your custom filters:
  schoolId: currentSchool,
  districtId: currentDistrict,
});
```

### Customize Audit Logging

```typescript
// In any mutation, customize audit metadata:
await auditService.log({
  action: AuditAction.CREATE_STUDENT,
  resourceType: AuditResourceType.STUDENT,
  resourceId: result.id,
  status: AuditStatus.SUCCESS,
  isPHI: true,
  metadata: {
    // Add your custom metadata:
    createdByRole: currentUser.role,
    ipAddress: getClientIp(),
    userAgent: navigator.userAgent,
  },
});
```

---

## Troubleshooting

### "Module not found" errors

**Solution:** Update import paths to match your project structure

```typescript
// Example error:
Cannot find module '@/services/audit'

// Fix:
import { auditService } from '../../services/audit';
```

### TypeScript errors on types

**Solution:** Ensure you have all type definitions

```typescript
// Example error:
Cannot find type 'Student'

// Fix: Add import
import type { Student } from '@/types/student.types';
```

### "Hook called outside of component" errors

**Solution:** Ensure all hooks are called inside React components

```typescript
// ❌ Wrong
const mutation = useMutation(...); // Outside component

// ✅ Correct
export const MyComponent = () => {
  const mutation = useMutation(...); // Inside component
};
```

### Audit service not flushing

**Solution:** For critical operations, use immediate flush

```typescript
// After critical operations:
await auditService.log({ ... });
await (auditService as any).flushImmediately?.();
```

---

## Best Practices Checklist

Before using an example in production, verify:

- [ ] All imports updated to match your structure
- [ ] API endpoints configured correctly
- [ ] Audit logging enabled for PHI access
- [ ] Error boundaries implemented
- [ ] Loading states handled
- [ ] Accessibility tested (keyboard navigation, screen readers)
- [ ] Type safety verified (no `any` types)
- [ ] Tests written and passing
- [ ] Performance optimized (React DevTools Profiler)
- [ ] Security reviewed (no PHI in logs/console)

---

## Migration Path

### From Old Code → New Examples

1. **Identify your use case:**
   - CRUD operations → Student Management
   - Healthcare data → Health Records
   - Critical operations → Medication Administration

2. **Copy the example file**

3. **Replace old patterns:**
   - `useState` + `useEffect` → TanStack Query hooks
   - Manual cache → Automatic invalidation
   - No audit → Comprehensive audit logging
   - Direct API calls → Circuit breaker pattern

4. **Test incrementally:**
   - Start with read operations
   - Add mutations one at a time
   - Verify audit logs
   - Test error scenarios

---

## Support

**Need help?**

1. Read the full `EXAMPLES.md` documentation
2. Check inline comments in example files
3. Review the pattern demonstrations
4. Consult the team

**Found a bug or improvement?**

1. Create an issue with the example name
2. Include code snippet
3. Describe expected vs actual behavior

---

## File Locations

```
frontend/
├── EXAMPLES.md                          # Full documentation (this file's big brother)
├── EXAMPLES_QUICK_START.md              # This file
└── src/
    ├── pages/
    │   ├── students/
    │   │   └── Students.COMPLETE.tsx     # ✅ Student Management
    │   ├── health/
    │   │   └── HealthRecords.COMPLETE.tsx # ✅ Health Records
    │   └── medications/
    │       └── MedicationAdmin.COMPLETE.tsx # ✅ Medication Admin
    └── __tests__/
        └── examples/                      # Test examples (see EXAMPLES.md)
```

---

## Next Steps

1. **Read the full documentation:** `EXAMPLES.md`
2. **Choose your example** based on your use case
3. **Copy and customize** the example
4. **Test thoroughly** before production
5. **Share your learnings** with the team

---

## License

These examples are part of the White Cross Healthcare Platform.
Proprietary and confidential. For authorized use only.

---

**Happy coding! 🚀**

Need more examples? Check `EXAMPLES.md` for:
- Authentication Flow example
- Dashboard example
- Form Validation example
- Testing examples
- Performance optimization examples
- Integration workflow examples
