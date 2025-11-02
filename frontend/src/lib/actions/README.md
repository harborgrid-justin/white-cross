# Server Actions Organization

This directory contains all Next.js server actions following best practices for the App Router.

## Directory Structure

```
src/lib/actions/
├── index.ts                        # Barrel export for all actions
├── students.actions.ts             # Student management actions
├── health-records.actions.ts       # Health records actions
├── medications.actions.ts          # Medication administration actions
├── immunizations.actions.ts        # Immunization tracking actions
├── appointments.actions.ts         # Appointment scheduling actions
├── incidents.actions.ts            # Incident reporting actions
├── inventory.actions.ts            # Medical inventory actions
├── communications.actions.ts       # Messaging & communications actions
├── messages.actions.ts             # Direct messaging actions
├── broadcasts.actions.ts           # Broadcast messaging actions
├── notifications.actions.ts        # Notification actions
├── analytics.actions.ts            # Analytics & metrics actions
├── reports.actions.ts              # Report generation actions
├── dashboard.actions.ts            # Dashboard data actions
├── admin.actions.ts                # Admin panel actions
├── settings.actions.ts             # Settings management actions
├── alerts.actions.ts               # Alert management actions
├── auth.actions.ts                 # Authentication actions
├── login.actions.ts                # Login-specific actions
├── profile.actions.ts              # User profile actions
├── import.actions.ts               # Data import actions
├── export.actions.ts               # Data export actions
├── documents.actions.ts            # Document management actions
├── forms.actions.ts                # Dynamic forms actions
├── billing.actions.ts              # Billing & invoicing actions
├── budget.actions.ts               # Budget management actions
├── transactions.actions.ts         # Financial transactions actions
├── purchase-orders.actions.ts      # Purchase order actions
├── vendors.actions.ts              # Vendor management actions
├── compliance.actions.ts           # HIPAA compliance actions
└── reminders.actions.ts            # Reminder actions
```

## Best Practices

### 1. File Structure

Each action file should:
- Start with `'use server';` directive at the top
- Group related server actions by domain
- Export actions as named exports
- Include comprehensive JSDoc comments

**Example:**
```typescript
/**
 * @fileoverview Student Management Server Actions
 * @module lib/actions/students.actions
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import type { Student, CreateStudentData } from '@/types/student.types';

/**
 * Get all students with optional filters
 */
export async function getStudents(filters?: StudentFilters): Promise<Student[]> {
  // Implementation
}

/**
 * Create a new student record
 */
export async function createStudent(data: CreateStudentData): Promise<ActionResult<Student>> {
  try {
    // Validation
    // API call
    // Cache invalidation
    revalidateTag('students');
    revalidatePath('/dashboard/students');

    return { success: true, data: student };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### 2. 'use server' Directive

- **Required:** Always include `'use server';` at the top of the file
- **Do NOT** include `'use server';` within individual function bodies
- The file-level directive applies to all exports

**✅ Correct:**
```typescript
'use server';

export async function getStudents() {
  // Implementation
}

export async function createStudent(data: CreateStudentData) {
  // Implementation
}
```

**❌ Incorrect:**
```typescript
'use server';

export async function getStudents() {
  'use server'; // ❌ Redundant!
  // Implementation
}
```

### 3. Error Handling

All mutations (create, update, delete) should:
- Use try-catch blocks
- Return standardized `ActionResult<T>` type
- Include HIPAA audit logging for PHI operations
- Provide clear error messages

**Standard ActionResult type:**
```typescript
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### 4. Cache Invalidation

After mutations, invalidate relevant caches:

```typescript
import { revalidateTag, revalidatePath } from 'next/cache';

export async function updateStudent(id: string, data: UpdateStudentData) {
  try {
    // Update logic

    // Invalidate caches
    revalidateTag('students');
    revalidateTag(`student-${id}`);
    revalidatePath('/dashboard/students');
    revalidatePath(`/dashboard/students/${id}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### 5. Form Actions

For form submissions, accept FormData parameter:

```typescript
export async function createStudentFromForm(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult<Student>> {
  const studentData: CreateStudentData = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    // ... more fields
  };

  return createStudent(studentData);
}
```

### 6. HIPAA Compliance

For actions involving PHI (Protected Health Information):

```typescript
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

export async function createHealthRecord(data: CreateHealthRecordData) {
  try {
    // Create record

    // HIPAA audit logging - MANDATORY for PHI
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'HealthRecord',
      resourceId: record.id,
      details: 'Created health record',
      success: true
    });

    return { success: true, data: record };
  } catch (error) {
    // Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'HealthRecord',
      details: `Failed: ${error.message}`,
      success: false,
      errorMessage: error.message
    });

    return { success: false, error: error.message };
  }
}
```

## Importing Server Actions

### Option 1: Direct Import (Recommended)
```typescript
import { getStudents, createStudent, updateStudent } from '@/lib/actions/students.actions';
```

### Option 2: Barrel Export
```typescript
import { getStudents, createStudent } from '@/lib/actions';
```

### Option 3: Namespace Import
```typescript
import * as studentActions from '@/lib/actions/students.actions';

const students = await studentActions.getStudents();
```

## Using Server Actions

### In Server Components
```typescript
import { getStudents } from '@/lib/actions/students.actions';

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div>
      {students.map(student => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}
```

### In Client Components with Forms
```typescript
'use client';

import { useActionState } from 'react';
import { createStudent } from '@/lib/actions/students.actions';

export function StudentForm() {
  const [state, formAction, isPending] = useActionState(createStudent, { errors: {} });

  return (
    <form action={formAction}>
      {/* Form fields */}
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Student'}
      </button>
    </form>
  );
}
```

### In Client Components with Mutations
```typescript
'use client';

import { createStudent } from '@/lib/actions/students.actions';

export function CreateStudentButton() {
  const handleCreate = async () => {
    const result = await createStudent(studentData);

    if (result.success) {
      toast.success('Student created successfully');
    } else {
      toast.error(result.error);
    }
  };

  return <button onClick={handleCreate}>Create Student</button>;
}
```

## Migration Guide

### Old Pattern (Before Reorganization)
```typescript
// ❌ Old - scattered in app routes
import { getStudents } from '@/app/students/actions';
import { createStudent } from '@/actions/students.actions';
```

### New Pattern (After Reorganization)
```typescript
// ✅ New - centralized in lib/actions
import { getStudents, createStudent } from '@/lib/actions/students.actions';
```

## Testing Server Actions

```typescript
import { createStudent } from '@/lib/actions/students.actions';

describe('createStudent', () => {
  it('should create a student successfully', async () => {
    const result = await createStudent({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2010-01-01',
      grade: '5'
    });

    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('id');
  });

  it('should return error for invalid data', async () => {
    const result = await createStudent({} as any);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

## Common Patterns

### 1. Cached Data Fetching
```typescript
import { cache } from 'react';

export const getStudent = cache(async (id: string): Promise<Student | null> => {
  try {
    const response = await serverGet<Student>(
      API_ENDPOINTS.STUDENTS.BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: 300, // 5 minutes
          tags: [`student-${id}`, 'students', 'PHI']
        }
      }
    );
    return response;
  } catch (error) {
    console.error('Failed to get student:', error);
    return null;
  }
});
```

### 2. Optimistic Updates
```typescript
export async function toggleStudentActive(studentId: string, isActive: boolean) {
  // Client can optimistically update UI before this resolves
  try {
    await serverPut(`/students/${studentId}`, { isActive });
    revalidateTag(`student-${studentId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### 3. Bulk Operations
```typescript
export async function bulkUpdateStudents(
  studentIds: string[],
  updates: Partial<Student>
): Promise<ActionResult<Student[]>> {
  try {
    const response = await serverPost('/students/bulk-update', {
      studentIds,
      updates
    });

    // Invalidate all affected students
    studentIds.forEach(id => revalidateTag(`student-${id}`));
    revalidateTag('students');

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Related Documentation

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [STATE_MANAGEMENT.md](/frontend/STATE_MANAGEMENT.md)
- [CLAUDE.md](/frontend/CLAUDE.md)
- [API Client Documentation](/frontend/src/lib/api/README.md)

## Troubleshooting

### "Server actions must be async functions"
Ensure all exported functions are `async`:
```typescript
// ✅ Correct
export async function getStudents() { }

// ❌ Incorrect
export function getStudents() { }
```

### "Cannot access Server Action outside of async function"
Server actions can only be called in:
- Server Components
- Client Components (as async functions)
- Other server actions
- Route handlers

### "Failed to find Server Action"
Check that:
1. File has `'use server';` directive
2. Function is exported
3. Import path is correct: `@/lib/actions/[domain].actions`

### Cache Not Invalidating
Ensure you're using the correct revalidation:
```typescript
// For tagged cache
revalidateTag('students');

// For path-based cache
revalidatePath('/dashboard/students');
```

## Performance Considerations

1. **Batch Cache Invalidations**: Group related invalidations together
2. **Use Granular Tags**: Tag specific resources (e.g., `student-123`) alongside general tags
3. **Avoid Over-Fetching**: Use filters and pagination for large datasets
4. **Cache Strategically**: Balance freshness with performance (5-15 minute TTL for most healthcare data)

## Security

1. **Always validate input** on the server (never trust client data)
2. **Use Zod schemas** for input validation
3. **Implement RBAC** (Role-Based Access Control) checks
4. **Audit all PHI access** per HIPAA requirements
5. **Sanitize error messages** (don't leak sensitive info)

---

**Last Updated:** 2025-11-02
**Maintained By:** Development Team
**Related:** Next.js 16 App Router Migration
