# Frontend API Schema Field Mapping Updates

**Date:** 2025-10-23
**Task:** Update frontend API service files to match corrected backend schema

## Overview

Backend API validators have been updated to match database schema. Frontend needs to send correct field names to prevent validation errors.

## Field Mapping Changes Required

### 1. Medications API (`medicationsApi.ts`)

#### Field Name Changes:
- `name` → `medicationName` (medication name field)
- `strength` → `dosage` (dosage/strength field)
- Remove `dosageForm` (no longer in backend schema)
- Add `frequency` (required field for medication frequency)
- Add `route` (required field for administration route)

#### Updated Interfaces:

```typescript
/**
 * Request payload for creating a new medication
 * Updated to match backend schema field names
 */
export interface CreateMedicationRequest {
  medicationName: string;      // Backend field: medicationName (was 'name')
  genericName?: string;
  dosage: string;               // Backend field: dosage (was 'strength')
  frequency: string;            // Backend field: frequency (NEW - required)
  route: string;                // Backend field: route (NEW - required)
  manufacturer?: string;
  ndc?: string;
  isControlled?: boolean;
}
```

#### Updated Validation Schema:

```typescript
const createMedicationSchema = z.object({
  medicationName: z.string()
    .min(2, 'Medication name must be at least 2 characters')
    .max(200, 'Medication name cannot exceed 200 characters')
    .trim(),

  genericName: z.string()
    .min(2, 'Generic name must be at least 2 characters')
    .max(200, 'Generic name cannot exceed 200 characters')
    .trim()
    .optional(),

  dosage: z.string()
    .regex(dosageRegex, 'Dosage must be in valid format (e.g., "500mg", "2 tablets", "10ml")')
    .trim(),

  frequency: z.string()
    .min(1, 'Frequency is required')
    .trim()
    .refine(
      frequencyValidator,
      'Frequency must be valid (e.g., "twice daily", "every 6 hours", "as needed", "BID")'
    ),

  route: z.enum(administrationRoutes, {
    errorMap: () => ({ message: 'Route is required (administration route)' })
  }),

  manufacturer: z.string()
    .max(200, 'Manufacturer name cannot exceed 200 characters')
    .trim()
    .optional(),

  ndc: z.string()
    .regex(ndcRegex, 'NDC must be in format: XXXXX-XXXX-XX or XXXXX-XXX-XX')
    .trim()
    .optional()
    .or(z.literal('')),

  isControlled: z.boolean().optional().default(false),

  deaSchedule: z.enum(deaSchedules)
    .optional()
    .nullable()
});
```

### 2. Appointments API (`appointmentsApi.ts`)

#### Field Name Changes:
- `startTime` → `scheduledAt` (appointment date/time field)
- `type` → Use correct `AppointmentType` enum values

#### Enum Values Update:

```typescript
export enum AppointmentType {
  ROUTINE_CHECKUP = 'ROUTINE_CHECKUP',
  MEDICATION_ADMINISTRATION = 'MEDICATION_ADMINISTRATION',
  INJURY_ASSESSMENT = 'INJURY_ASSESSMENT',
  ILLNESS_EVALUATION = 'ILLNESS_EVALUATION',
  FOLLOW_UP = 'FOLLOW_UP',
  SCREENING = 'SCREENING',
  EMERGENCY = 'EMERGENCY',
}
```

#### Updated Interfaces:

```typescript
/**
 * Create appointment data payload
 * Updated to match backend schema field names
 */
export interface AppointmentCreateData {
  studentId: string;
  nurseId: string;
  type: AppointmentType;        // Use enum values
  scheduledAt: string;          // Backend field: scheduledAt (was 'startTime')
  duration: number;             // Duration in minutes
  reason: string;
  notes?: string;
  privateNotes?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
}

export interface AppointmentUpdateData {
  type?: AppointmentType;
  scheduledAt?: string;         // Backend field: scheduledAt
  duration?: number;
  status?: AppointmentStatus;
  reason?: string;
  notes?: string;
  privateNotes?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
}
```

### 3. Health Records API (`healthRecordsApi.ts`)

#### Field Name Changes:
- `type` → `recordType` (health record type field)
- `date` → `recordDate` (record date field)
- `description` → `diagnosis` (for medical diagnosis field)

#### Updated Interfaces:

```typescript
/**
 * Create health record payload
 * Updated to match backend schema field names
 */
export interface HealthRecordCreate {
  studentId: string;
  recordType: HealthRecordType;  // Backend field: recordType (was 'type')
  recordDate: string;             // Backend field: recordDate (was 'date')
  description: string;
  diagnosis?: string;             // Backend field: diagnosis
  treatment?: string;
  provider?: string;
  providerNPI?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  isConfidential?: boolean;
  followUpRequired?: boolean;
  followUpDate?: string;
}

export interface HealthRecordUpdate {
  recordType?: HealthRecordType; // Backend field: recordType
  recordDate?: string;            // Backend field: recordDate
  description?: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  providerNPI?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  isConfidential?: boolean;
  followUpRequired?: boolean;
  followUpDate?: string;
}
```

#### Updated Validation Schema:

```typescript
const healthRecordCreateSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  recordType: z.enum([
    'GENERAL_VISIT', 'INJURY', 'ILLNESS', 'MEDICATION', 'VACCINATION',
    'SCREENING', 'PHYSICAL_EXAM', 'EMERGENCY', 'MENTAL_HEALTH',
    'DENTAL', 'VISION', 'HEARING', 'OTHER'
  ]),
  recordDate: z.string().min(1, 'Record date is required'),
  description: z.string().min(1, 'Description is required'),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  provider: z.string().optional(),
  providerNPI: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  isConfidential: z.boolean().optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().optional(),
});
```

### 4. Students API (`studentsApi.ts`)

#### Status: ✅ VERIFIED
No changes needed - student fields already match backend schema correctly.

## Type Definition Updates Required

### Medications Types (`types/medications.ts`)

Update type definitions to match new field names:

```typescript
export interface Medication {
  id: string;
  medicationName: string;        // Updated from 'name'
  genericName?: string;
  dosage: string;                 // Updated from 'strength'
  frequency: string;              // NEW field
  route: string;                  // NEW field
  manufacturer?: string;
  ndc?: string;
  isControlled: boolean;
  deaSchedule?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Appointments Types (`types/appointments.ts`)

Update type definitions for consistency:

```typescript
export interface Appointment extends BaseEntity {
  studentId: string;
  nurseId: string;
  type: AppointmentType;
  scheduledAt: string;            // Updated from 'startTime'
  duration: number;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  privateNotes?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  student?: Student;
  nurse?: User;
  reminders?: AppointmentReminder[];
}
```

### Health Records Types (`types/healthRecords.ts`)

Update type definitions:

```typescript
export interface HealthRecord {
  id: string;
  studentId: string;
  recordType: HealthRecordType;   // Updated from 'type'
  recordDate: string;              // Updated from 'date'
  description: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  providerNPI?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  isConfidential: boolean;
  followUpRequired: boolean;
  followUpDate?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

## Implementation Steps

1. ✅ **medicationsApi.ts**
   - Update `CreateMedicationRequest` interface
   - Update `createMedicationSchema` validation
   - Add JSDoc comments explaining field mappings

2. ⬜ **appointmentsApi.ts**
   - Update `AppointmentCreateData` interface
   - Update `AppointmentUpdateData` interface
   - Ensure `scheduledAt` is used consistently

3. ⬜ **healthRecordsApi.ts**
   - Update `HealthRecordCreate` interface
   - Update `HealthRecordUpdate` interface
   - Update `healthRecordCreateSchema` validation

4. ⬜ **types/medications.ts**
   - Update `Medication` interface
   - Update related medication types

5. ⬜ **types/appointments.ts**
   - Update `Appointment` interface
   - Verify enum definitions

6. ⬜ **types/healthRecords.ts**
   - Update `HealthRecord` interface
   - Update related health record types

## Testing Checklist

After implementation, verify:

- [ ] Medication creation sends correct field names to backend
- [ ] Appointment scheduling uses `scheduledAt` field
- [ ] Health record creation uses `recordType` and `recordDate`
- [ ] All TypeScript types compile without errors
- [ ] API validation schemas match backend expectations
- [ ] No breaking changes to existing component code

## Migration Notes

### Breaking Changes:
1. Components using old field names will need updates
2. Form validation may need adjustment
3. State management may reference old field names

### Backward Compatibility:
- Consider adding deprecated field name warnings
- Add migration guide for component developers
- Update API documentation

## Files Modified

1. `frontend/src/services/modules/medicationsApi.ts` - Field mappings and validation
2. `frontend/src/services/modules/appointmentsApi.ts` - Field mappings
3. `frontend/src/services/modules/healthRecordsApi.ts` - Field mappings and validation
4. `frontend/src/types/medications.ts` - Type definitions
5. `frontend/src/types/appointments.ts` - Type definitions
6. `frontend/src/types/healthRecords.ts` - Type definitions

## Summary

This update ensures the frontend API layer sends data in the format expected by the updated backend validators. The changes prevent validation errors caused by field name mismatches between frontend requests and backend schema.

**Key Changes:**
- Medications: `name` → `medicationName`, `strength` → `dosage`, add `frequency` and `route`
- Appointments: `startTime` → `scheduledAt`
- Health Records: `type` → `recordType`, `date` → `recordDate`

All changes maintain type safety and add comprehensive JSDoc comments for clarity.
