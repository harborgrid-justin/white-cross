# Optimistic UI Updates - Integration Guide

This document provides comprehensive guidance on implementing optimistic UI updates across the White Cross healthcare platform using the new hooks and utilities.

## Table of Contents

1. [Overview](#overview)
2. [Available Hooks](#available-hooks)
3. [Integration Examples](#integration-examples)
4. [Visual Indicators](#visual-indicators)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)

---

## Overview

Optimistic UI updates provide instant feedback to users by updating the UI immediately before server confirmation. The system automatically handles:

- Instant UI updates
- Automatic rollback on errors
- Conflict resolution
- Visual feedback
- Error recovery

### Architecture

```
User Action → Optimistic Update → API Call → Confirm/Rollback
     ↓              ↓                  ↓             ↓
   UI Locks    UI Updates      Server Response   Final State
```

---

## Available Hooks

### 1. Student Management

**File**: `frontend/src/hooks/useOptimisticStudents.ts`

```typescript
import { useOptimisticStudents } from '@/hooks/useOptimisticStudents';

const {
  createStudent,
  updateStudent,
  deactivateStudent,
  reactivateStudent,
  transferStudent,
  deleteStudent,
  isCreating,
  isUpdating,
  createError,
  createSuccess,
} = useOptimisticStudents();
```

**Available Operations:**
- `createStudent.mutate(data)` - Create student with optimistic update
- `updateStudent.mutate({ id, data })` - Update student details
- `deactivateStudent.mutate(id)` - Soft delete student
- `reactivateStudent.mutate(id)` - Restore deactivated student
- `transferStudent.mutate({ id, data })` - Transfer to different nurse
- `deleteStudent.mutate(id)` - Permanent delete (HIPAA compliance)

### 2. Medication Management

**File**: `frontend/src/hooks/useOptimisticMedications.ts`

```typescript
import { useOptimisticMedications } from '@/hooks/useOptimisticMedications';

const {
  createMedication,
  updateMedication,
  deleteMedication,
  createPrescription,
  deactivatePrescription,
  logAdministration,
  addInventory,
  updateInventory,
  reportAdverseReaction,
  isCreatingMedication,
  medicationCreateError,
} = useOptimisticMedications();
```

**Available Operations:**
- `createMedication.mutate(data)` - Create medication in formulary
- `updateMedication.mutate({ id, data })` - Update medication details
- `deleteMedication.mutate(id)` - Remove medication
- `createPrescription.mutate(data)` - Assign medication to student
- `deactivatePrescription.mutate({ id, reason })` - Stop prescription
- `logAdministration.mutate(data)` - Log Five Rights administration
- `addInventory.mutate(data)` - Add to inventory
- `updateInventory.mutate({ id, data })` - Update inventory quantity
- `reportAdverseReaction.mutate(data)` - Report adverse reaction

### 3. Incident Management

**File**: `frontend/src/hooks/useOptimisticIncidents.ts`

```typescript
import {
  useOptimisticIncidents,
  useOptimisticWitnessStatements,
  useOptimisticFollowUpActions,
} from '@/hooks/useOptimisticIncidents';

// Incident Reports
const {
  createIncident,
  updateIncident,
  deleteIncident,
  isCreating,
  createError,
} = useOptimisticIncidents();

// Witness Statements
const {
  createWitness,
  updateWitness,
  verifyWitness,
} = useOptimisticWitnessStatements();

// Follow-up Actions
const {
  createAction,
  updateAction,
  completeAction,
} = useOptimisticFollowUpActions();
```

---

## Integration Examples

### Example 1: Student Creation Form

```typescript
// StudentCreateForm.tsx
import React from 'react';
import { useOptimisticStudents } from '@/hooks/useOptimisticStudents';
import { showSuccessToast, showErrorToast } from '@/components/shared/UpdateToast';

export const StudentCreateForm: React.FC = () => {
  const {
    createStudent,
    isCreating,
    createError,
    createSuccess,
  } = useOptimisticStudents();

  const handleSubmit = async (formData) => {
    try {
      await createStudent.mutateAsync({
        studentNumber: formData.studentNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        grade: formData.grade,
        gender: formData.gender,
        nurseId: currentUser.id,
        enrollmentDate: new Date().toISOString(),
      });

      showSuccessToast('Student created successfully!');
      // Form will close automatically, student already visible in list
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}

      <button
        type="submit"
        disabled={isCreating}
        className="btn-primary"
      >
        {isCreating ? (
          <>
            <Spinner className="w-4 h-4 mr-2" />
            Creating Student...
          </>
        ) : (
          'Create Student'
        )}
      </button>

      {createError && (
        <div className="text-red-600 text-sm mt-2">
          {createError.message}
        </div>
      )}
    </form>
  );
};
```

### Example 2: Medication Administration with Five Rights

```typescript
// MedicationAdministrationForm.tsx
import React from 'react';
import { useOptimisticMedications } from '@/hooks/useOptimisticMedications';
import { showPromiseToast } from '@/components/shared/UpdateToast';

export const MedicationAdministrationForm: React.FC<{
  prescription: StudentMedication;
}> = ({ prescription }) => {
  const { logAdministration, isLoggingAdministration } = useOptimisticMedications();

  const handleAdminister = async () => {
    // Verify Five Rights before submission
    const fiveRightsConfirmed = await verifyFiveRights(prescription);

    if (!fiveRightsConfirmed) {
      return;
    }

    const administrationPromise = logAdministration.mutateAsync({
      studentMedicationId: prescription.id,
      dosageGiven: prescription.dosage,
      timeGiven: new Date().toISOString(),
      nurseId: currentUser.id,
      notes: formData.notes,
      patientVerified: true,
      allergyChecked: true,
    });

    await showPromiseToast(administrationPromise, {
      loading: 'Recording administration...',
      success: 'Medication administered and logged successfully',
      error: 'Failed to log administration',
    });
  };

  return (
    <div className="medication-admin-form">
      {/* Five Rights Checklist */}
      <FiveRightsChecklist prescription={prescription} />

      <button
        onClick={handleAdminister}
        disabled={isLoggingAdministration || !allRightsVerified}
        className="btn-primary"
      >
        {isLoggingAdministration ? (
          <>
            <Spinner /> Logging...
          </>
        ) : (
          'Administer & Log'
        )}
      </button>
    </div>
  );
};
```

### Example 3: Incident Report with Witness Statements

```typescript
// IncidentReportPage.tsx
import React from 'react';
import {
  useOptimisticIncidents,
  useOptimisticWitnessStatements,
} from '@/hooks/useOptimisticIncidents';

export const IncidentReportPage: React.FC = () => {
  const { createIncident, isCreating } = useOptimisticIncidents();
  const { createWitness } = useOptimisticWitnessStatements();

  const handleCreateIncidentWithWitness = async (data) => {
    try {
      // Create incident (optimistic)
      const incident = await createIncident.mutateAsync({
        studentId: data.studentId,
        reportedById: currentUser.id,
        type: data.type,
        severity: data.severity,
        description: data.description,
        location: data.location,
        occurredAt: data.occurredAt,
        actionsTaken: data.actionsTaken,
        parentNotified: data.parentNotified,
        followUpRequired: data.followUpRequired,
      });

      // If witness provided, add statement (also optimistic)
      if (data.witnessName) {
        await createWitness.mutateAsync({
          incidentReportId: incident.report.id,
          witnessName: data.witnessName,
          witnessType: data.witnessType,
          witnessContact: data.witnessContact,
          statement: data.witnessStatement,
        });
      }

      showSuccessToast('Incident reported successfully');
    } catch (error) {
      showErrorToast('Failed to create incident report');
    }
  };

  return (
    <div>
      {/* Incident form */}
      <button
        onClick={handleCreateIncidentWithWitness}
        disabled={isCreating}
      >
        {isCreating ? 'Submitting...' : 'Submit Report'}
      </button>
    </div>
  );
};
```

### Example 4: Student List with Inline Actions

```typescript
// StudentListPage.tsx
import React from 'react';
import { useOptimisticStudents } from '@/hooks/useOptimisticStudents';
import { OptimisticUpdateIndicator } from '@/components/shared/OptimisticUpdateIndicator';

export const StudentListPage: React.FC = () => {
  const {
    updateStudent,
    deactivateStudent,
    transferStudent,
    isUpdating,
    isDeactivating,
  } = useOptimisticStudents();

  const handleQuickEdit = (studentId: string, field: string, value: any) => {
    updateStudent.mutate({
      id: studentId,
      data: { [field]: value }
    });
  };

  const handleDeactivate = async (studentId: string) => {
    if (confirm('Are you sure you want to deactivate this student?')) {
      try {
        await deactivateStudent.mutateAsync(studentId);
        showSuccessToast('Student deactivated');
      } catch (error) {
        showErrorToast('Failed to deactivate student');
      }
    }
  };

  return (
    <div>
      <OptimisticUpdateIndicator
        position="top-right"
        showDetails={true}
        showCount={true}
      />

      <StudentTable
        students={students}
        onQuickEdit={handleQuickEdit}
        onDeactivate={handleDeactivate}
        isUpdating={isUpdating}
      />
    </div>
  );
};
```

---

## Visual Indicators

### 1. Global Update Indicator

Shows all pending updates in the application:

```typescript
import { OptimisticUpdateIndicator } from '@/components/shared/OptimisticUpdateIndicator';

// In App.tsx or Layout component
<OptimisticUpdateIndicator
  position="top-right"
  showDetails={true}
  showCount={true}
/>
```

### 2. Toast Notifications

Automatic success/error notifications:

```typescript
import { UpdateToast } from '@/components/shared/UpdateToast';

// In App.tsx
<UpdateToast
  position="top-right"
  showConfirmed={true}
  showFailed={true}
  duration={3000}
  messages={{
    create: 'Created successfully!',
    update: 'Updated successfully!',
    delete: 'Deleted successfully!',
  }}
/>
```

### 3. Manual Rollback Button

Allow users to manually undo changes:

```typescript
import { RollbackButton, useRollback } from '@/components/shared/RollbackButton';

// In component with update context
const { rollback, isRollingBack } = useRollback();

<RollbackButton
  updateId={updateId}
  variant="danger"
  confirmBeforeRollback={true}
  onRollback={() => console.log('Rolled back')}
/>
```

### 4. Loading States

Show inline loading indicators:

```typescript
<button disabled={isCreating}>
  {isCreating ? (
    <>
      <Spinner className="w-4 h-4 mr-2 animate-spin" />
      <span className="opacity-75">Creating...</span>
    </>
  ) : (
    'Create Student'
  )}
</button>

{/* Row-level loading */}
<tr className={isUpdating ? 'opacity-50 pointer-events-none' : ''}>
  {/* Row content */}
</tr>
```

---

## Error Handling

### 1. Automatic Rollback

Errors automatically trigger rollback and restore previous state:

```typescript
const { createStudent, createError } = useOptimisticStudents();

// Optimistic update applied immediately
createStudent.mutate(data);

// On error:
// 1. UI automatically reverts to previous state
// 2. Error toast shown
// 3. createError populated
// 4. Can retry or show error message
```

### 2. Manual Error Handling

Handle specific error scenarios:

```typescript
const { createStudent } = useOptimisticStudents();

try {
  await createStudent.mutateAsync(data);
  // Success handling
} catch (error) {
  if (error.statusCode === 409) {
    showErrorToast('Student with this number already exists');
  } else if (error.statusCode === 403) {
    showErrorToast('You do not have permission to create students');
  } else {
    showErrorToast('Failed to create student. Please try again.');
  }
}
```

### 3. Retry Logic

Built-in retry support:

```typescript
const { createStudent } = useOptimisticStudents();

// Automatic retry on network errors (3 attempts)
createStudent.mutate(data, {
  onError: (error, variables, context) => {
    // Retry count available in context
    if (context?.retryCount < 3) {
      // Will automatically retry
    } else {
      // Max retries reached
      showErrorToast('Failed after 3 attempts. Please try again later.');
    }
  },
});
```

---

## Best Practices

### 1. Always Use Loading States

```typescript
// Good
<button disabled={isCreating}>
  {isCreating ? 'Creating...' : 'Create'}
</button>

// Bad - no loading feedback
<button onClick={handleCreate}>Create</button>
```

### 2. Provide Error Feedback

```typescript
// Good
{createError && (
  <AlertBanner type="error">
    {createError.message}
  </AlertBanner>
)}

// Bad - silent failures
createStudent.mutate(data);
```

### 3. Use Promise-Based Toasts for Long Operations

```typescript
// Good - shows loading, success, and error states
await showPromiseToast(
  createStudent.mutateAsync(data),
  {
    loading: 'Creating student...',
    success: 'Student created successfully!',
    error: 'Failed to create student',
  }
);

// Okay - manual toast management
createStudent.mutate(data);
```

### 4. Disable Forms During Mutations

```typescript
// Good
<form>
  <fieldset disabled={isCreating}>
    {/* Form fields */}
  </fieldset>
</form>

// Better - show visual feedback
<form className={isCreating ? 'opacity-50 pointer-events-none' : ''}>
  {/* Form fields */}
</form>
```

### 5. Confirm Destructive Actions

```typescript
// Good
const handleDelete = async (id) => {
  if (await confirm('Are you sure you want to delete this student?')) {
    await deleteStudent.mutateAsync(id);
  }
};

// Better - use modal confirmation
const handleDelete = async (id) => {
  const confirmed = await showConfirmModal({
    title: 'Delete Student',
    message: 'This action cannot be undone. All data will be permanently deleted.',
    confirmText: 'Delete',
    confirmVariant: 'danger',
  });

  if (confirmed) {
    await deleteStudent.mutateAsync(id);
  }
};
```

### 6. Handle HIPAA Compliance

```typescript
// For sensitive data operations, add extra confirmation
const handleDeleteStudentData = async (studentId) => {
  const confirmed = await showConfirmModal({
    title: 'Permanently Delete Student Data',
    message: 'This will permanently delete all health records and cannot be undone. This action will be logged for HIPAA compliance.',
    confirmText: 'I Understand, Delete Data',
    requireTypedConfirmation: 'DELETE',
    auditLog: true,
  });

  if (confirmed) {
    await deleteStudent.mutateAsync(studentId);
  }
};
```

### 7. Use Composite Hooks for Related Operations

```typescript
// Good - single import for all student operations
const {
  createStudent,
  updateStudent,
  deleteStudent,
  transferStudent,
} = useOptimisticStudents();

// Bad - importing individual hooks
const create = useOptimisticStudentCreate();
const update = useOptimisticStudentUpdate();
const remove = useOptimisticStudentDelete();
```

### 8. Monitor Optimistic Update Stats

```typescript
import { optimisticUpdateManager } from '@/utils/optimisticUpdates';

// Get statistics
const stats = optimisticUpdateManager.getStats();

console.log({
  total: stats.total,
  pending: stats.pending,
  successRate: stats.successRate,
  avgConfirmationTime: stats.averageConfirmationTime,
});

// Monitor in dev tools
useEffect(() => {
  const unsubscribe = optimisticUpdateManager.subscribe((update) => {
    console.log('[Optimistic Update]', update);
  });
  return unsubscribe;
}, []);
```

---

## Migration Guide

### Converting Existing Forms

**Before** (traditional approach):
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleCreate = async (data) => {
  setLoading(true);
  setError(null);
  try {
    await studentsApi.create(data);
    queryClient.invalidateQueries(['students']);
    showSuccessToast('Created!');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**After** (with optimistic updates):
```typescript
const { createStudent, isCreating, createError } = useOptimisticStudents();

const handleCreate = async (data) => {
  try {
    await createStudent.mutateAsync(data);
    showSuccessToast('Created!');
  } catch (err) {
    // Error handled automatically, UI already rolled back
  }
};
```

---

## Troubleshooting

### Update Not Appearing

Check query keys match:
```typescript
// Hook uses this key
queryKey: ['students', 'list']

// Query must use same key
useQuery({ queryKey: ['students', 'list'] })
```

### Rollback Not Working

Ensure previous data is available:
```typescript
// Load data before mutation
const { data: student } = useQuery({
  queryKey: ['students', 'detail', id],
  queryFn: () => studentsApi.getById(id),
});

// Now update will have previous data for rollback
updateStudent.mutate({ id, data: changes });
```

### Performance Issues

Clean old updates periodically:
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    optimisticUpdateManager.clearOldUpdates(5 * 60 * 1000); // 5 minutes
  }, 60 * 1000);

  return () => clearInterval(interval);
}, []);
```

---

## Summary

Optimistic UI updates are now fully integrated across the platform with:

- **3 comprehensive hook modules** for Students, Medications, and Incidents
- **Automatic rollback** on errors
- **Visual feedback components** already implemented
- **Type-safe** operations with TypeScript
- **HIPAA-compliant** audit logging
- **Production-ready** error handling

Start using these hooks in your components today for a better user experience!
