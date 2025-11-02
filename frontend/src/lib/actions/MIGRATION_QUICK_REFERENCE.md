# Server Actions Migration Quick Reference

> **Last Updated:** 2025-11-02
> **Status:** ✅ Complete

## What Changed?

All server actions have been reorganized from scattered locations into a centralized `/src/lib/actions/` directory.

## Quick Start

### Old Import Pattern ❌
```typescript
import { getStudents } from '@/app/students/actions';
import { createAppointment } from '@/actions/appointments.actions';
import { getInventory } from '@/app/inventory/actions';
```

### New Import Pattern ✅
```typescript
import { getStudents } from '@/lib/actions/students.actions';
import { createAppointment } from '@/lib/actions/appointments.actions';
import { getInventory } from '@/lib/actions/inventory.actions';
```

### Or Use Barrel Export ✅
```typescript
import { getStudents, createAppointment, getInventory } from '@/lib/actions';
```

## Action File Mapping

| Domain | File Location |
|--------|---------------|
| Students | `/src/lib/actions/students.actions.ts` |
| Health Records | `/src/lib/actions/health-records.actions.ts` |
| Medications | `/src/lib/actions/medications.actions.ts` |
| Immunizations | `/src/lib/actions/immunizations.actions.ts` |
| Appointments | `/src/lib/actions/appointments.actions.ts` |
| Incidents | `/src/lib/actions/incidents.actions.ts` |
| Inventory | `/src/lib/actions/inventory.actions.ts` |
| Communications | `/src/lib/actions/communications.actions.ts` |
| Messages | `/src/lib/actions/messages.actions.ts` |
| Broadcasts | `/src/lib/actions/broadcasts.actions.ts` |
| Notifications | `/src/lib/actions/notifications.actions.ts` |
| Analytics | `/src/lib/actions/analytics.actions.ts` |
| Reports | `/src/lib/actions/reports.actions.ts` |
| Dashboard | `/src/lib/actions/dashboard.actions.ts` |
| Admin | `/src/lib/actions/admin.actions.ts` |
| Settings | `/src/lib/actions/settings.actions.ts` |
| Alerts | `/src/lib/actions/alerts.actions.ts` |
| Auth | `/src/lib/actions/auth.actions.ts` |
| Login | `/src/lib/actions/login.actions.ts` |
| Profile | `/src/lib/actions/profile.actions.ts` |
| Import | `/src/lib/actions/import.actions.ts` |
| Export | `/src/lib/actions/export.actions.ts` |
| Documents | `/src/lib/actions/documents.actions.ts` |
| Forms | `/src/lib/actions/forms.actions.ts` |
| Billing | `/src/lib/actions/billing.actions.ts` |
| Budget | `/src/lib/actions/budget.actions.ts` |
| Transactions | `/src/lib/actions/transactions.actions.ts` |
| Purchase Orders | `/src/lib/actions/purchase-orders.actions.ts` |
| Vendors | `/src/lib/actions/vendors.actions.ts` |
| Compliance | `/src/lib/actions/compliance.actions.ts` |
| Reminders | `/src/lib/actions/reminders.actions.ts` |

## Key Improvements

### ✅ Proper 'use server' Directive
- File-level directive only
- No redundant function-level directives

### ✅ Standardized Error Handling
```typescript
export async function createStudent(data: CreateStudentData): Promise<ActionResult<Student>> {
  try {
    // Implementation
    return { success: true, data: student };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### ✅ Consistent Return Type
```typescript
interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### ✅ HIPAA Audit Logging
```typescript
await auditLog({
  action: AUDIT_ACTIONS.CREATE_STUDENT,
  resource: 'Student',
  resourceId: student.id,
  details: 'Created student record',
  success: true
});
```

### ✅ Cache Invalidation
```typescript
revalidateTag('students');
revalidateTag(`student-${id}`);
revalidatePath('/dashboard/students');
```

## No Action Required

All imports have been automatically updated. Your existing code will continue to work without any changes.

## Need Help?

- **Comprehensive Guide:** See [README.md](./README.md)
- **Full Report:** See [/frontend/docs/SERVER_ACTIONS_REORGANIZATION_REPORT.md](/frontend/docs/SERVER_ACTIONS_REORGANIZATION_REPORT.md)
- **Next.js Docs:** [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

## Quick Checklist for New Server Actions

When creating a new server action:

- [ ] Place in `/src/lib/actions/[domain].actions.ts`
- [ ] Add `'use server';` at top of file (file-level only)
- [ ] Use `ActionResult<T>` return type for mutations
- [ ] Implement try-catch error handling
- [ ] Add HIPAA audit logging for PHI operations
- [ ] Invalidate caches with `revalidateTag()` and `revalidatePath()`
- [ ] Export from `/src/lib/actions/index.ts`
- [ ] Add JSDoc comments
- [ ] Write tests

---

**Questions?** Check the [comprehensive README.md](./README.md) for detailed examples and best practices.
