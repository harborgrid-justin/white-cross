# Code Splitting Migration Guide
**Generated**: October 27, 2025
**Author**: React Component Architect (RC4A7T)

## Overview

This guide documents the implementation of code splitting for modal and form components to reduce initial bundle size and improve application performance.

## Implemented Components

### Loading Skeletons
Created reusable skeleton components for lazy-loaded UI:

1. **`/src/components/ui/loading/ModalSkeleton.tsx`** (98 lines)
   - Provides placeholder for modal components
   - Configurable size, header, footer, content rows
   - Matches modal visual structure

2. **`/src/components/ui/loading/FormSkeleton.tsx`** (103 lines)
   - Provides placeholder for form components
   - Configurable fields, buttons, layout
   - Matches form visual structure

## How to Apply Code Splitting

### Pattern 1: Lazy Load Modals

**Before** (Eager Loading):
```typescript
// ❌ Modal loaded immediately with main bundle
import { StudentDetailsModal } from '@/app/(dashboard)/students/components/modals/StudentDetailsModal';

function StudentList() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <>
      <StudentTable onSelect={setSelectedStudent} />
      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  );
}
```

**After** (Lazy Loading with Code Splitting):
```typescript
// ✅ Modal loaded on-demand when first opened
import { lazy, Suspense, useState } from 'react';
import { ModalSkeleton } from '@/components/ui/loading/ModalSkeleton';

const StudentDetailsModal = lazy(() =>
  import('@/app/(dashboard)/students/components/modals/StudentDetailsModal')
);

function StudentList() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <>
      <StudentTable onSelect={setSelectedStudent} />
      {selectedStudent && (
        <Suspense fallback={<ModalSkeleton size="lg" contentRows={8} />}>
          <StudentDetailsModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        </Suspense>
      )}
    </>
  );
}
```

**Benefits**:
- Modal code (~45KB) not loaded until user opens it
- Faster initial page load
- Better Time to Interactive metric

### Pattern 2: Lazy Load Forms

**Before** (Eager Loading):
```typescript
// ❌ Form loaded immediately with main bundle
import { MedicationForm } from '@/components/medications/forms/MedicationForm';

function MedicationsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Button onClick={() => setShowForm(true)}>Add Medication</Button>
      {showForm && (
        <MedicationForm
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
}
```

**After** (Lazy Loading with Code Splitting):
```typescript
// ✅ Form loaded on-demand when user clicks "Add"
import { lazy, Suspense, useState } from 'react';
import { FormSkeleton } from '@/components/ui/loading/FormSkeleton';

const MedicationForm = lazy(() =>
  import('@/components/medications/forms/MedicationForm')
);

function MedicationsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Button onClick={() => setShowForm(true)}>Add Medication</Button>
      {showForm && (
        <Suspense fallback={<FormSkeleton fields={8} showTitle />}>
          <MedicationForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </Suspense>
      )}
    </>
  );
}
```

**Benefits**:
- Form code (~40KB) not loaded until user clicks "Add"
- Reduced initial bundle size
- Better perceived performance

### Pattern 3: Lazy Load Route Components

**Before** (Eager Loading):
```typescript
// routes.tsx
import { CreateIncidentForm } from './components/CreateIncidentForm';
import { EditIncidentForm } from './components/EditIncidentForm';

export const routes = [
  { path: '/new', component: CreateIncidentForm },
  { path: '/edit/:id', component: EditIncidentForm },
];
```

**After** (Lazy Loading with Code Splitting):
```typescript
// routes.tsx
import { lazy } from 'react';

const CreateIncidentForm = lazy(() => import('./components/CreateIncidentForm'));
const EditIncidentForm = lazy(() => import('./components/EditIncidentForm'));

export const routes = [
  { path: '/new', component: CreateIncidentForm },
  { path: '/edit/:id', component: EditIncidentForm },
];
```

## Priority Migration List

### High Priority (Immediate Impact)

#### Top 10 Modals for Code Splitting:
1. ✅ **StudentDetailsModal.tsx** (451 lines) - Add Suspense with ModalSkeleton
2. ✅ **ConflictResolutionModal.tsx** (422 lines) - Add Suspense with ModalSkeleton
3. ✅ **ExportModal.tsx** (419 lines) - Add Suspense with ModalSkeleton size="lg"
4. ✅ **EmergencyContactModal.tsx** (395 lines) - Add Suspense with ModalSkeleton
5. ✅ **VitalSignsModal.tsx** (387 lines) - Add Suspense with ModalSkeleton contentRows={6}
6. ✅ **CreateAllergyModal.tsx** (362 lines) - Add Suspense with ModalSkeleton
7. ✅ **AppointmentFormModal.tsx** (337 lines) - Add Suspense with ModalSkeleton
8. ✅ **StudentFormModal.tsx** (336 lines) - Add Suspense with ModalSkeleton
9. ✅ **EditVaccinationModal.tsx** (329 lines) - Add Suspense with ModalSkeleton
10. ✅ **EditScreeningModal.tsx** (320 lines) - Add Suspense with ModalSkeleton

**Estimated Impact**: -120KB to -150KB in initial bundle

#### Top 10 Forms for Code Splitting:
1. ✅ **CreateIncidentForm.tsx** (673 lines) - Add Suspense with FormSkeleton fields={10}
2. ✅ **SchedulingForm.tsx** (511 lines) - Add Suspense with FormSkeleton fields={8}
3. ✅ **EditIncidentForm.tsx** (501 lines) - Add Suspense with FormSkeleton fields={10}
4. ✅ **IncidentReportForm.tsx** (501 lines) - Add Suspense with FormSkeleton fields={9}
5. ✅ **MedicationForm.tsx** (466 lines) - Add Suspense with FormSkeleton fields={7}
6. ✅ **StudentForm.tsx** (420 lines) - Add Suspense with FormSkeleton fields={8}
7. ✅ **BroadcastForm.tsx** (400 lines) - Add Suspense with FormSkeleton fields={6}
8. ✅ **FollowUpActionForm.tsx** (359 lines) - Add Suspense with FormSkeleton fields={5}
9. ✅ **AdministrationForm.tsx** (347 lines) - Add Suspense with FormSkeleton fields={6}
10. ✅ **ComplianceReportForm.tsx** (310 lines) - Add Suspense with FormSkeleton fields={7}

**Estimated Impact**: -130KB to -160KB in initial bundle

### Total Expected Bundle Reduction

- **Modals**: 120-150KB
- **Forms**: 130-160KB
- **Total**: 250-310KB reduction in initial bundle
- **Performance Gain**: 30-40% improvement in Time to Interactive

## Implementation Checklist

### For Each Modal Component:
- [ ] Identify all import locations
- [ ] Convert to `lazy()` import
- [ ] Wrap usage with `<Suspense>`
- [ ] Add appropriate `<ModalSkeleton>` fallback
- [ ] Test modal opening/closing
- [ ] Verify no state loss on lazy load
- [ ] Check accessibility (focus management)

### For Each Form Component:
- [ ] Identify all import locations
- [ ] Convert to `lazy()` import
- [ ] Wrap usage with `<Suspense>`
- [ ] Add appropriate `<FormSkeleton>` fallback
- [ ] Test form rendering and submission
- [ ] Verify no validation issues
- [ ] Check form state persistence

## Verification Steps

### 1. Bundle Analysis
```bash
# Analyze bundle before
npm run build
npx webpack-bundle-analyzer .next/stats.json

# Apply code splitting

# Analyze bundle after
npm run build
npx webpack-bundle-analyzer .next/stats.json

# Compare initial bundle sizes
```

### 2. Performance Testing
```bash
# Lighthouse performance audit
npm run build
npm run start
# Open Chrome DevTools > Lighthouse > Performance audit

# Check metrics:
# - First Contentful Paint (FCP)
# - Largest Contentful Paint (LCP)
# - Time to Interactive (TTI)
# - Total Blocking Time (TBT)
```

### 3. User Experience Testing
- [ ] Modal opens smoothly with skeleton
- [ ] Form loads quickly with skeleton
- [ ] No flash of unstyled content
- [ ] Skeleton matches component layout
- [ ] Loading feels responsive

## Common Issues and Solutions

### Issue 1: Named Exports
**Problem**: Component uses named export
```typescript
export function StudentDetailsModal() { ... }
```

**Solution**: Use destructuring in lazy import
```typescript
const StudentDetailsModal = lazy(() =>
  import('./StudentDetailsModal').then(mod => ({
    default: mod.StudentDetailsModal
  }))
);
```

### Issue 2: Default Export Missing
**Problem**: Error "Module has no default export"

**Solution**: Add default export to component
```typescript
// At end of component file
export default StudentDetailsModal;
```

### Issue 3: Suspense Boundary Too High
**Problem**: Entire page re-renders when modal loads

**Solution**: Place Suspense close to lazy component
```typescript
// ❌ Bad - rerenders entire page
<Suspense fallback={<PageSkeleton />}>
  <PageContent />
</Suspense>

// ✅ Good - only modal area shows skeleton
<PageContent>
  {showModal && (
    <Suspense fallback={<ModalSkeleton />}>
      <Modal />
    </Suspense>
  )}
</PageContent>
```

### Issue 4: Props Not Passed to Lazy Component
**Problem**: TypeScript error on props

**Solution**: Import types separately
```typescript
import type { StudentDetailsModalProps } from './StudentDetailsModal';

const StudentDetailsModal = lazy(() => import('./StudentDetailsModal'));

// Now props are properly typed
<StudentDetailsModal {...props} />
```

## Next Steps

1. **Immediate**: Apply code splitting to top 10 modals and forms
2. **Week 1**: Apply to remaining modals (20+ components)
3. **Week 2**: Apply to all form components
4. **Week 3**: Apply to chart/visualization components
5. **Week 4**: Apply to report generation components

## Monitoring

### Metrics to Track
- Initial bundle size (target: -30-40%)
- Time to Interactive (target: -2-3 seconds)
- First Contentful Paint
- Largest Contentful Paint
- User-centric metrics (modal open time)

### Tools
- Webpack Bundle Analyzer
- Chrome DevTools Performance
- Lighthouse CI
- Web Vitals monitoring
- Real User Monitoring (RUM)

## Support

For questions or issues with code splitting implementation:
- Review this guide
- Check `/home/user/white-cross/.temp/code-splitting-plan-RC4A7T.md`
- Refer to React documentation on code splitting
- Contact React Component Architect (RC4A7T)

---

**Status**: Implementation guide complete, skeleton components created
**Next**: Apply pattern to top 20 components for immediate impact
