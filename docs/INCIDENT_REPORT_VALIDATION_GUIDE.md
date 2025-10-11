# Incident Report Validation - Developer Guide

## Quick Reference

This guide provides practical examples for implementing incident report validation in the White Cross platform.

---

## Backend Usage

### Service Layer Validation

The service layer automatically validates all incident report operations:

```typescript
import { IncidentReportService } from '@/services/incidentReportService';

// Create incident - automatic validation
try {
  const incident = await IncidentReportService.createIncidentReport({
    studentId: 'uuid-here',
    reportedById: 'uuid-here',
    type: 'INJURY',
    severity: 'HIGH',
    description: 'Student fell on playground and scraped knee. Minor bleeding observed.',
    location: 'Main Playground',
    actionsTaken: 'Cleaned wound with antiseptic, applied bandage, ice pack provided.',
    occurredAt: new Date(),
    followUpRequired: true, // Auto-set for INJURY type if not provided
  });

  // Parent notification automatically triggered for HIGH/CRITICAL
  console.log('Incident created:', incident.id);
} catch (error) {
  // Will throw validation errors if data doesn't meet requirements
  console.error('Validation failed:', error.message);
}
```

### Using Joi Validators Directly

If you need to validate data before processing:

```typescript
import {
  createIncidentReportSchema,
  validateIncidentData
} from '@/validators/incidentReportValidator';

const data = {
  studentId: 'uuid-here',
  type: 'MEDICATION_ERROR',
  // ... other fields
};

const { value, error } = validateIncidentData(
  createIncidentReportSchema,
  data
);

if (error) {
  console.error('Validation errors:', error.details);
  return res.status(400).json({ errors: error.details });
}

// Use validated data
const incident = await IncidentReportService.createIncidentReport(value);
```

---

## Frontend Usage

### React Hook Form with Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIncidentReportSchema } from '@/validation/incidentReportValidation';
import type { CreateIncidentReportFormData } from '@/validation/incidentReportValidation';

function IncidentReportForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateIncidentReportFormData>({
    resolver: zodResolver(createIncidentReportSchema),
  });

  const incidentType = watch('type');
  const severity = watch('severity');

  const onSubmit = async (data: CreateIncidentReportFormData) => {
    try {
      await incidentReportsApi.create(data);
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Student Selection */}
      <select {...register('studentId')}>
        {/* Options */}
      </select>
      {errors.studentId && <span>{errors.studentId.message}</span>}

      {/* Incident Type */}
      <select {...register('type')}>
        <option value="INJURY">Injury</option>
        <option value="MEDICATION_ERROR">Medication Error</option>
        {/* Other types */}
      </select>
      {errors.type && <span>{errors.type.message}</span>}

      {/* Severity */}
      <select {...register('severity')}>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="CRITICAL">Critical</option>
      </select>
      {errors.severity && <span>{errors.severity.message}</span>}

      {/* Description with character counter */}
      <textarea
        {...register('description')}
        placeholder="Provide detailed description (minimum 20 characters)"
        minLength={20}
      />
      {errors.description && <span>{errors.description.message}</span>}

      {/* Location */}
      <input
        type="text"
        {...register('location')}
        placeholder="Where did the incident occur?"
        minLength={3}
      />
      {errors.location && <span>{errors.location.message}</span>}

      {/* Actions Taken */}
      <textarea
        {...register('actionsTaken')}
        placeholder="What actions were taken? (minimum 10 characters)"
        minLength={10}
      />
      {errors.actionsTaken && <span>{errors.actionsTaken.message}</span>}

      {/* Date/Time */}
      <input
        type="datetime-local"
        {...register('occurredAt')}
        max={new Date().toISOString().slice(0, 16)}
      />
      {errors.occurredAt && <span>{errors.occurredAt.message}</span>}

      {/* Auto-checked for INJURY */}
      <label>
        <input
          type="checkbox"
          {...register('followUpRequired')}
          disabled={incidentType === 'INJURY'}
          checked={incidentType === 'INJURY'}
        />
        Follow-up Required
      </label>

      {/* Warning for HIGH/CRITICAL */}
      {(severity === 'HIGH' || severity === 'CRITICAL') && (
        <div className="alert alert-warning">
          High and critical incidents require parent notification
        </div>
      )}

      <button type="submit">Create Incident Report</button>
    </form>
  );
}
```

### Using Validation Helpers

```typescript
import {
  validateIncidentDescription,
  shouldRequireParentNotification,
  shouldRequireFollowUp,
  validateDueDateForPriority,
} from '@/validation/incidentReportValidation';

// Check if description meets type-specific requirements
const descriptionError = validateIncidentDescription('MEDICATION_ERROR', description);
if (descriptionError) {
  setError('description', { message: descriptionError });
}

// Determine if parent notification should be required
if (shouldRequireParentNotification(severity)) {
  setShowParentNotificationWarning(true);
}

// Auto-set follow-up for injuries
if (shouldRequireFollowUp(type)) {
  setValue('followUpRequired', true);
}

// Validate due date for priority level
const dueDateWarning = validateDueDateForPriority(priority, dueDate);
if (dueDateWarning) {
  showToast('warning', dueDateWarning);
}
```

---

## Validation Rules Summary

### Incident Report Creation

| Field | Required | Min Length | Max Length | Additional Rules |
|-------|----------|------------|------------|------------------|
| studentId | Yes | - | - | Must be valid UUID |
| reportedById | Yes | - | - | Must be valid UUID |
| type | Yes | - | - | Must be valid IncidentType enum |
| severity | Yes | - | - | Must be valid IncidentSeverity enum |
| description | Yes | 20 chars | 5000 chars | 50 chars for MEDICATION_ERROR |
| location | Yes | 3 chars | 200 chars | - |
| actionsTaken | Yes | 10 chars | 2000 chars | - |
| occurredAt | Yes | - | - | Cannot be in future |
| followUpRequired | No | - | - | Auto-set true for INJURY |

### Witness Statement

| Field | Required | Min Length | Max Length | Additional Rules |
|-------|----------|------------|------------|------------------|
| witnessName | Yes | 2 chars | 100 chars | - |
| witnessType | Yes | - | - | Must be valid WitnessType enum |
| statement | Yes | 20 chars | 3000 chars | - |
| witnessContact | No | - | - | - |

### Follow-Up Action

| Field | Required | Min Length | Max Length | Additional Rules |
|-------|----------|------------|------------|------------------|
| action | Yes | 5 chars | 500 chars | - |
| dueDate | Yes | - | - | Must be in future |
| priority | Yes | - | - | Must be valid ActionPriority enum |
| assignedTo | No | - | - | Must be valid UUID if provided |
| notes | No (Required on COMPLETE) | - | 2000 chars | Required when status=COMPLETED |

---

## Business Rules

### Automatic Actions

1. **INJURY Incidents**: `followUpRequired` automatically set to `true`
2. **HIGH/CRITICAL Severity**: Automatic parent/emergency contact notification
3. **Status Changes**: Timestamps auto-populated (completedAt, verifiedAt, etc.)

### Validation Errors

Common validation errors and how to fix them:

```typescript
// ❌ Description too short
{
  description: "Student hurt"
}
// ✅ Fix
{
  description: "Student fell on playground and scraped knee with minor bleeding"
}

// ❌ Location missing
{
  location: ""
}
// ✅ Fix
{
  location: "Main Playground"
}

// ❌ Actions taken not documented
{
  actionsTaken: "Helped"
}
// ✅ Fix
{
  actionsTaken: "Cleaned wound with antiseptic and applied bandage"
}

// ❌ Future incident time
{
  occurredAt: "2025-12-31T10:00:00Z"
}
// ✅ Fix
{
  occurredAt: "2025-10-11T10:00:00Z" // Current or past time
}

// ❌ Medication error without detail
{
  type: "MEDICATION_ERROR",
  description: "Wrong medication given to student"
}
// ✅ Fix
{
  type: "MEDICATION_ERROR",
  description: "Student received 250mg acetaminophen instead of prescribed 125mg dose. Parent notified immediately. Student monitored for adverse effects."
}

// ❌ Completed action without notes
{
  status: "COMPLETED",
  notes: ""
}
// ✅ Fix
{
  status: "COMPLETED",
  notes: "Contacted parent via phone. Parent confirmed receipt of incident report and no further concerns."
}
```

---

## Testing Validation

### Backend Tests

```typescript
import { validateIncidentData, createIncidentReportSchema } from '@/validators/incidentReportValidator';

describe('Incident Report Validation', () => {
  it('should reject description under 20 characters', () => {
    const data = {
      description: 'Too short',
      // ... other required fields
    };

    const { error } = validateIncidentData(createIncidentReportSchema, data);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('20 characters');
  });

  it('should require follow-up for INJURY incidents', () => {
    const data = {
      type: 'INJURY',
      followUpRequired: false,
      // ... other required fields
    };

    const { error } = validateIncidentData(createIncidentReportSchema, data);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toContain('follow-up');
  });
});
```

### Frontend Tests

```typescript
import { createIncidentReportSchema } from '@/validation/incidentReportValidation';

describe('Incident Report Frontend Validation', () => {
  it('should validate description length', () => {
    const result = createIncidentReportSchema.safeParse({
      description: 'Too short',
      // ... other required fields
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('20 characters');
    }
  });

  it('should reject future incident times', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const result = createIncidentReportSchema.safeParse({
      occurredAt: futureDate.toISOString(),
      // ... other required fields
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('future');
    }
  });
});
```

---

## Common Patterns

### Creating an Incident with Witness Statements

```typescript
// Step 1: Create incident
const incident = await IncidentReportService.createIncidentReport({
  studentId: student.id,
  reportedById: currentUser.id,
  type: 'INJURY',
  severity: 'MEDIUM',
  description: 'Student collision during recess resulted in minor head bump. No loss of consciousness.',
  location: 'Basketball Court',
  actionsTaken: 'Applied ice pack, monitored for 15 minutes, no signs of concussion observed.',
  occurredAt: new Date(),
  followUpRequired: true,
});

// Step 2: Add witness statements
await IncidentReportService.addWitnessStatement(incident.id, {
  witnessName: 'John Teacher',
  witnessType: 'STAFF',
  witnessContact: 'john.teacher@school.edu',
  statement: 'I observed the two students collide while playing basketball. Student A appeared to accidentally bump into Student B. Both students were running at the time.',
});

// Step 3: Add follow-up action
await IncidentReportService.addFollowUpAction(incident.id, {
  action: 'Call parent to inform of incident and arrange pick-up if symptoms develop',
  dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  priority: 'HIGH',
  assignedTo: currentUser.id,
});
```

### Updating Follow-Up Action Status

```typescript
// Complete a follow-up action
await IncidentReportService.updateFollowUpAction(
  actionId,
  'COMPLETED',
  currentUser.id,
  'Called parent at 3:00 PM. Parent acknowledged and will monitor student at home.'
);
```

---

## Error Handling

### Graceful Error Display

```typescript
try {
  await incidentReportsApi.create(formData);
  showToast('success', 'Incident report created successfully');
  navigate('/incidents');
} catch (error) {
  if (error.response?.status === 400) {
    // Validation error
    const validationErrors = error.response.data.errors;
    validationErrors.forEach((err) => {
      setError(err.field, { message: err.message });
    });
  } else {
    // Other errors
    showToast('error', 'Failed to create incident report. Please try again.');
  }
}
```

---

## Best Practices

### 1. Always Validate on Both Sides
- Frontend: Immediate user feedback
- Backend: Security and data integrity

### 2. Use Type-Safe Schemas
- TypeScript + Zod on frontend
- TypeScript + Joi on backend

### 3. Provide Clear Error Messages
- Tell users what's wrong
- Tell users how to fix it
- Provide context for why the rule exists

### 4. Auto-Populate When Possible
- Follow-up required for injuries
- Timestamps for status changes
- Default values for optional fields

### 5. Test Edge Cases
- Minimum/maximum lengths
- Date boundaries (past/future)
- Status transitions
- Required field combinations

---

## Support

For questions or issues with validation:
1. Check this guide
2. Review validation schema files
3. Check the comprehensive summary: `INCIDENT_REPORT_VALIDATION_SUMMARY.md`
4. Contact the development team

---

## Changelog

### 2025-10-11
- Initial validation implementation
- Comprehensive Joi schemas (backend)
- Comprehensive Zod schemas (frontend)
- Model-level validation hooks
- Service-layer business logic enforcement
