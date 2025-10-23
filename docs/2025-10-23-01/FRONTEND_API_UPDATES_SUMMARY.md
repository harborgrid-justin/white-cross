# Frontend API Schema Updates - Complete Summary

**Date:** 2025-10-23
**Task:** Update all frontend API service files to match corrected backend schema
**Status:** Documentation Complete - Implementation Pending

## Executive Summary

Backend API validators have been updated to align with the database schema. The frontend must be updated to send correct field names in API requests. This document provides a complete list of all files that require updates and the specific changes needed.

---

## Critical Changes Required

### 1. Medications Module

**Field Mapping Changes:**
- `name` → `medicationName`
- `strength` → `dosage`
- Remove: `dosageForm` (field no longer exists in backend)
- Add: `frequency` (NEW required field)
- Add: `route` (NEW required field)

**Impact:** HIGH - All medication creation/update operations will fail without these changes

### 2. Appointments Module

**Field Mapping Changes:**
- `startTime` → `scheduledAt`
- Verify `type` uses correct `AppointmentType` enum values

**Impact:** MEDIUM - Appointment scheduling will fail without correct field name

### 3. Health Records Module

**Field Mapping Changes:**
- `type` → `recordType`
- `date` → `recordDate`
- `description` vs `diagnosis` (clarify usage)

**Impact:** MEDIUM - Health record creation will fail without correct field names

---

## Files Requiring Updates

### API Service Layer (6 files)

#### ✅ Priority 1: Core API Services

1. **`frontend/src/services/modules/medicationsApi.ts`**
   - Update `CreateMedicationRequest` interface (lines 50-58)
   - Update `createMedicationSchema` validation (lines 167-213)
   - Update all references from `name` to `medicationName`
   - Update all references from `strength` to `dosage`
   - Add `frequency` and `route` fields to validation
   - Add JSDoc comments explaining field mappings

2. **`frontend/src/services/modules/appointmentsApi.ts`**
   - Update `AppointmentCreateData` interface
   - Update `AppointmentUpdateData` interface
   - Change all `startTime` references to `scheduledAt`
   - Verify `AppointmentType` enum usage is correct
   - Update method signatures if needed

3. **`frontend/src/services/modules/healthRecordsApi.ts`**
   - Update `HealthRecordCreate` interface (lines 102-117)
   - Update `HealthRecordUpdate` interface (lines 119-133)
   - Update `healthRecordCreateSchema` validation (lines 685-704)
   - Change `type` to `recordType`
   - Change `date` to `recordDate`
   - Clarify `diagnosis` vs `description` usage
   - Update all method calls using old field names

### Type Definition Files (3 files)

#### ✅ Priority 2: TypeScript Type Definitions

4. **`frontend/src/types/medications.ts`**
   - Update `Medication` interface
   - Update `MedicationFormData` interface
   - Update `StudentMedicationFormData` interface
   - Ensure all medication-related types use new field names
   - Update exported types

5. **`frontend/src/types/appointments.ts`**
   - Update `Appointment` interface
   - Update `AppointmentCreateData` type
   - Update `AppointmentUpdateData` type
   - Ensure `scheduledAt` is used consistently
   - Verify enum definitions match backend

6. **`frontend/src/types/healthRecords.ts`**
   - Update `HealthRecord` interface
   - Update `HealthRecordCreate` type
   - Update `HealthRecordUpdate` type
   - Change `type` to `recordType`
   - Change `date` to `recordDate`

### API Type Definitions (1 file)

7. **`frontend/src/types/api.ts`** (if applicable)
   - Update any shared API types
   - Ensure consistency with service layer

---

## Detailed Change Log by File

### File 1: `frontend/src/services/modules/medicationsApi.ts`

**Lines to Update:**

```diff
- export interface CreateMedicationRequest {
-   name: string;
-   genericName?: string;
-   dosageForm: string;
-   strength: string;
-   manufacturer?: string;
-   ndc?: string;
-   isControlled?: boolean;
- }
+ /**
+  * Request payload for creating a new medication
+  * Updated to match backend schema field names
+  */
+ export interface CreateMedicationRequest {
+   medicationName: string;      // Backend field: medicationName (was 'name')
+   genericName?: string;
+   dosage: string;               // Backend field: dosage (was 'strength')
+   frequency: string;            // Backend field: frequency (NEW - required)
+   route: string;                // Backend field: route (NEW - required)
+   manufacturer?: string;
+   ndc?: string;
+   isControlled?: boolean;
+ }
```

**Validation Schema Updates:**

```diff
  const createMedicationSchema = z.object({
-   name: z.string()
+   medicationName: z.string()
      .min(2, 'Medication name must be at least 2 characters')
      .max(200, 'Medication name cannot exceed 200 characters')
      .trim(),

    genericName: z.string()
      .min(2, 'Generic name must be at least 2 characters')
      .max(200, 'Generic name cannot exceed 200 characters')
      .trim()
      .optional(),

-   dosageForm: z.enum(dosageForms, {
-     errorMap: () => ({ message: 'Please select a valid dosage form' })
-   }),

-   strength: z.string()
+   dosage: z.string()
      .regex(dosageRegex, 'Dosage must be in valid format (e.g., "500mg", "2 tablets", "10ml")')
      .trim(),
+
+   frequency: z.string()
+     .min(1, 'Frequency is required')
+     .trim()
+     .refine(
+       frequencyValidator,
+       'Frequency must be valid (e.g., "twice daily", "every 6 hours", "as needed", "BID")'
+     ),
+
+   route: z.enum(administrationRoutes, {
+     errorMap: () => ({ message: 'Route is required (administration route)' })
+   }),
```

---

### File 2: `frontend/src/services/modules/appointmentsApi.ts`

**Interface Updates:**

```diff
  export interface AppointmentCreateData {
    studentId: string;
    nurseId: string;
    type: AppointmentType;
-   startTime: string;
+   scheduledAt: string;          // Backend field: scheduledAt (was 'startTime')
    duration: number;
    reason: string;
    notes?: string;
    privateNotes?: string;
    followUpRequired?: boolean;
    followUpDate?: string;
  }

  export interface AppointmentUpdateData {
    type?: AppointmentType;
-   startTime?: string;
+   scheduledAt?: string;         // Backend field: scheduledAt
    duration?: number;
    status?: AppointmentStatus;
    reason?: string;
    notes?: string;
    privateNotes?: string;
    followUpRequired?: boolean;
    followUpDate?: string;
  }
```

---

### File 3: `frontend/src/services/modules/healthRecordsApi.ts`

**Interface Updates:**

```diff
  export interface HealthRecordCreate {
    studentId: string;
-   type: HealthRecordType;
+   recordType: HealthRecordType;  // Backend field: recordType (was 'type')
-   date: string;
+   recordDate: string;             // Backend field: recordDate (was 'date')
    description: string;
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

  export interface HealthRecordUpdate {
-   type?: HealthRecordType;
+   recordType?: HealthRecordType;
-   date?: string;
+   recordDate?: string;
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

**Validation Schema Updates:**

```diff
  const healthRecordCreateSchema = z.object({
    studentId: z.string().min(1, 'Student ID is required'),
-   type: z.enum([
+   recordType: z.enum([
      'GENERAL_VISIT', 'INJURY', 'ILLNESS', 'MEDICATION', 'VACCINATION',
      'SCREENING', 'PHYSICAL_EXAM', 'EMERGENCY', 'MENTAL_HEALTH',
      'DENTAL', 'VISION', 'HEARING', 'OTHER'
    ]),
-   date: z.string().min(1, 'Date is required'),
+   recordDate: z.string().min(1, 'Record date is required'),
    description: z.string().min(1, 'Description is required'),
    diagnosis: z.string().optional(),
    // ... rest of fields
  });
```

---

### File 4: `frontend/src/types/medications.ts`

**Type Definition Updates:**

```diff
  export interface Medication {
    id: string;
-   name: string;
+   medicationName: string;        // Updated from 'name'
    genericName?: string;
-   dosageForm: string;
-   strength: string;
+   dosage: string;                 // Updated from 'strength'
+   frequency: string;              // NEW field
+   route: string;                  // NEW field
    manufacturer?: string;
    ndc?: string;
    isControlled: boolean;
    deaSchedule?: string;
    createdAt: string;
    updatedAt: string;
  }
```

---

### File 5: `frontend/src/types/appointments.ts`

**Type Definition Updates:**

```diff
  export interface Appointment extends BaseEntity {
    studentId: string;
    nurseId: string;
    type: AppointmentType;
-   startTime: string;
+   scheduledAt: string;            // Updated from 'startTime'
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

---

### File 6: `frontend/src/types/healthRecords.ts`

**Type Definition Updates:**

```diff
  export interface HealthRecord {
    id: string;
    studentId: string;
-   type: HealthRecordType;
+   recordType: HealthRecordType;   // Updated from 'type'
-   date: string;
+   recordDate: string;              // Updated from 'date'
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

---

## Implementation Order

### Phase 1: Type Definitions (Foundation)
1. Update `types/medications.ts`
2. Update `types/appointments.ts`
3. Update `types/healthRecords.ts`

**Rationale:** Type definitions are imported by API services, so they must be updated first to prevent TypeScript errors.

### Phase 2: API Services (Core Logic)
4. Update `services/modules/medicationsApi.ts`
5. Update `services/modules/appointmentsApi.ts`
6. Update `services/modules/healthRecordsApi.ts`

**Rationale:** API services depend on type definitions and are consumed by components.

### Phase 3: Verification (Testing)
7. Run TypeScript compiler to check for errors
8. Test API calls with new field names
9. Verify backend accepts new payloads

---

## Testing Strategy

### Unit Testing
```typescript
describe('MedicationsApi', () => {
  it('should send correct field names to backend', async () => {
    const mockData = {
      medicationName: 'Ibuprofen',  // ✅ Correct field
      dosage: '200mg',               // ✅ Correct field
      frequency: 'twice daily',      // ✅ New required field
      route: 'Oral'                  // ✅ New required field
    };

    const result = await medicationsApi.create(mockData);
    expect(result).toBeDefined();
  });
});
```

### Integration Testing
1. Test medication creation with new field names
2. Test appointment scheduling with `scheduledAt`
3. Test health record creation with `recordType` and `recordDate`
4. Verify validation errors are user-friendly

---

## Migration Guide for Component Developers

### Before Making API Calls

**Old Way (❌ WRONG):**
```typescript
const medicationData = {
  name: "Aspirin",
  strength: "100mg",
  dosageForm: "Tablet"
};
await medicationsApi.create(medicationData);
```

**New Way (✅ CORRECT):**
```typescript
const medicationData = {
  medicationName: "Aspirin",
  dosage: "100mg",
  frequency: "once daily",
  route: "Oral"
};
await medicationsApi.create(medicationData);
```

---

## Rollback Plan

If issues arise after deployment:

1. **Immediate Rollback:**
   - Revert commits for these 6 files
   - Redeploy frontend

2. **Partial Rollback:**
   - Keep type definitions updated
   - Revert only API service files
   - Add field name transformers as temporary fix

3. **Backend Compatibility:**
   - Confirm backend accepts both old and new field names
   - If not, coordinate with backend team for backward compatibility

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Breaking existing components | HIGH | MEDIUM | Comprehensive testing before deployment |
| Validation errors | HIGH | HIGH | Update validation schemas simultaneously |
| Type errors | MEDIUM | MEDIUM | Run TypeScript compiler before commit |
| API failures | HIGH | LOW | Test against backend API before deployment |

---

## Success Criteria

- [  ] All 6 files updated with correct field names
- [ ] TypeScript compiles without errors
- [ ] All validation schemas accept new field names
- [ ] API calls succeed with backend
- [ ] No breaking changes to components (or documented)
- [ ] JSDoc comments added for clarity

---

## Documentation Created

1. ✅ **FRONTEND_API_SCHEMA_UPDATES.md** (370 lines)
   - Comprehensive implementation guide
   - Complete type definitions
   - Validation schemas

2. ✅ **FRONTEND_API_FIELD_MAPPING_QUICK_REFERENCE.md**
   - Quick lookup table
   - Before/after examples
   - Common errors to avoid

3. ✅ **FRONTEND_API_UPDATES_SUMMARY.md** (This document)
   - Complete file list
   - Detailed change log
   - Implementation plan

---

## Next Steps

1. **Review Documentation:** Ensure all stakeholders understand the changes
2. **Implement Changes:** Follow the implementation order (Phase 1 → Phase 2 → Phase 3)
3. **Test Thoroughly:** Unit tests, integration tests, manual testing
4. **Deploy:** Coordinate with backend team for synchronized deployment
5. **Monitor:** Watch for errors in production logs

---

## Support & Questions

For questions about these updates:
- Review the detailed implementation guide in `FRONTEND_API_SCHEMA_UPDATES.md`
- Check the quick reference in `FRONTEND_API_FIELD_MAPPING_QUICK_REFERENCE.md`
- Consult backend schema documentation

---

**Last Updated:** 2025-10-23
**Status:** Documentation Complete - Ready for Implementation
