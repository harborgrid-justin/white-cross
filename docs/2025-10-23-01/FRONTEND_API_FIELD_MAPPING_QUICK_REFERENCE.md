# Frontend API Field Mapping Quick Reference

## Quick Field Name Changes

### Medications API
| Old Field Name | New Field Name | Type | Required |
|---------------|----------------|------|----------|
| `name` | `medicationName` | string | ✅ Yes |
| `strength` | `dosage` | string | ✅ Yes |
| `dosageForm` | ❌ REMOVED | - | - |
| - | `frequency` | string | ✅ Yes (NEW) |
| - | `route` | string | ✅ Yes (NEW) |

### Appointments API
| Old Field Name | New Field Name | Type | Required |
|---------------|----------------|------|----------|
| `startTime` | `scheduledAt` | string (ISO 8601) | ✅ Yes |
| `appointmentType` | `type` | AppointmentType enum | ✅ Yes |

### Health Records API
| Old Field Name | New Field Name | Type | Required |
|---------------|----------------|------|----------|
| `type` | `recordType` | HealthRecordType enum | ✅ Yes |
| `date` | `recordDate` | string (ISO 8601) | ✅ Yes |
| `description` | `diagnosis` | string | ⬜ No (for diagnosis) |

## Example API Calls

### Creating a Medication (BEFORE - ❌ WRONG)
```typescript
const medicationData = {
  name: "Ibuprofen",              // ❌ Wrong field name
  strength: "200mg",              // ❌ Wrong field name
  dosageForm: "Tablet",           // ❌ Field removed
  manufacturer: "Generic Pharma"
};
```

### Creating a Medication (AFTER - ✅ CORRECT)
```typescript
const medicationData = {
  medicationName: "Ibuprofen",    // ✅ Correct
  dosage: "200mg",                 // ✅ Correct
  frequency: "twice daily",        // ✅ Required new field
  route: "Oral",                   // ✅ Required new field
  manufacturer: "Generic Pharma"
};
```

### Creating an Appointment (BEFORE - ❌ WRONG)
```typescript
const appointmentData = {
  studentId: "uuid-123",
  nurseId: "uuid-456",
  startTime: "2025-10-24T10:00:00Z",  // ❌ Wrong field name
  type: "checkup",                     // ❌ Wrong enum value
  duration: 30
};
```

### Creating an Appointment (AFTER - ✅ CORRECT)
```typescript
const appointmentData = {
  studentId: "uuid-123",
  nurseId: "uuid-456",
  scheduledAt: "2025-10-24T10:00:00Z",  // ✅ Correct field name
  type: AppointmentType.ROUTINE_CHECKUP, // ✅ Correct enum
  duration: 30,
  reason: "Annual checkup"
};
```

### Creating a Health Record (BEFORE - ❌ WRONG)
```typescript
const healthRecordData = {
  studentId: "uuid-123",
  type: "ILLNESS",                // ❌ Wrong field name
  date: "2025-10-23",             // ❌ Wrong field name
  description: "Flu symptoms"
};
```

### Creating a Health Record (AFTER - ✅ CORRECT)
```typescript
const healthRecordData = {
  studentId: "uuid-123",
  recordType: "ILLNESS",          // ✅ Correct field name
  recordDate: "2025-10-23",       // ✅ Correct field name
  description: "Patient presented with flu symptoms",
  diagnosis: "Influenza Type A"   // ✅ Optional diagnosis field
};
```

## Enum Values

### AppointmentType Enum (Correct Values)
```typescript
ROUTINE_CHECKUP
MEDICATION_ADMINISTRATION
INJURY_ASSESSMENT
ILLNESS_EVALUATION
FOLLOW_UP
SCREENING
EMERGENCY
```

### HealthRecordType Enum (Correct Values)
```typescript
GENERAL_VISIT
INJURY
ILLNESS
MEDICATION
VACCINATION
SCREENING
PHYSICAL_EXAM
EMERGENCY
MENTAL_HEALTH
DENTAL
VISION
HEARING
OTHER
```

### Administration Routes (for medications)
```typescript
Oral
Sublingual
Topical
Intravenous
Intramuscular
Subcutaneous
Inhalation
Ophthalmic
Otic
Nasal
Rectal
Transdermal
```

## Files to Update

### API Service Files (Priority 1)
1. ✅ `frontend/src/services/modules/medicationsApi.ts`
2. ✅ `frontend/src/services/modules/appointmentsApi.ts`
3. ✅ `frontend/src/services/modules/healthRecordsApi.ts`

### Type Definition Files (Priority 2)
4. ✅ `frontend/src/types/medications.ts`
5. ✅ `frontend/src/types/appointments.ts`
6. ✅ `frontend/src/types/healthRecords.ts`

## Validation Rules

### Medications
- `medicationName`: 2-200 characters, required
- `dosage`: Must match pattern (e.g., "500mg", "10ml", "2 tablets")
- `frequency`: Must be valid (e.g., "twice daily", "BID", "q6h")
- `route`: Must be from administration routes enum

### Appointments
- `scheduledAt`: Must be ISO 8601 datetime, future date
- `duration`: 15-120 minutes, in 15-minute increments
- `type`: Must be valid AppointmentType enum value

### Health Records
- `recordType`: Must be valid HealthRecordType enum value
- `recordDate`: Must be ISO 8601 date string
- `description`: Required, min 1 character
- `diagnosis`: Optional string field

## Common Errors to Avoid

### ❌ Using Old Field Names
```typescript
// This will fail validation
await medicationsApi.create({ name: "Aspirin", strength: "100mg" });
```

### ✅ Using New Field Names
```typescript
// This will succeed
await medicationsApi.create({
  medicationName: "Aspirin",
  dosage: "100mg",
  frequency: "once daily",
  route: "Oral"
});
```

### ❌ Wrong Enum Values
```typescript
// This will fail
const appointment = { type: "checkup" };  // Not a valid enum value
```

### ✅ Correct Enum Values
```typescript
// This will succeed
const appointment = { type: AppointmentType.ROUTINE_CHECKUP };
```

## Migration Checklist

- [ ] Update all medication creation calls to use `medicationName`
- [ ] Update all medication forms to include `frequency` and `route` fields
- [ ] Update all appointment scheduling to use `scheduledAt`
- [ ] Update all health record creation to use `recordType` and `recordDate`
- [ ] Update type definitions in shared types files
- [ ] Test all API calls with new field names
- [ ] Update component prop types if needed
- [ ] Update Redux state shapes if needed

## Support

See `FRONTEND_API_SCHEMA_UPDATES.md` for detailed implementation guide and complete type definitions.
