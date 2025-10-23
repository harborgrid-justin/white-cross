# API Schema Validation - Quick Reference

**Generated**: 2025-10-23
**Status**: ⚠️ CRITICAL ISSUES FOUND
**Total Issues**: 33 mismatches identified
**Estimated Fix Time**: 10-14 hours

---

## CRITICAL - Fix Immediately (7 Issues)

### 1. Health Records Validator - Major Field Mismatch
**File**: `backend/src/routes/v1/healthcare/validators/healthRecords.validators.ts`
**Lines**: 22-29, 60-107, 114-150

**Problem**: Validator has 14 fields NOT in database:
```
❌ Remove: title, recordType, recordDate, providerNpi, facility, facilityNpi,
           diagnosis, diagnosisCode, treatment, followUpRequired, followUpDate,
           followUpCompleted, metadata, isConfidential

✅ Use instead:
   - type (not recordType)
   - date (not recordDate)
   - vital (JSONB for vital signs)
```

**Also**: Query validator has 14 invalid enum values. Use ONLY:
`CHECKUP, VACCINATION, ILLNESS, INJURY, SCREENING, PHYSICAL_EXAM, MENTAL_HEALTH, DENTAL, VISION, HEARING`

---

### 2. Appointments - Invalid Status
**File**: `backend/src/routes/v1/operations/validators/appointments.validators.ts`
**Line**: 23

**Fix**:
```typescript
// ❌ WRONG:
.valid('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED')

// ✅ CORRECT:
.valid('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW')
```

---

### 3. Incidents - Wrong Severity Values
**File**: `backend/src/routes/v1/incidents/validators/incidents.validators.ts`
**Lines**: 25-31

**Fix**:
```typescript
// ❌ WRONG:
const incidentSeverities = ['MINOR', 'MODERATE', 'SERIOUS', 'CRITICAL', 'LIFE_THREATENING'];

// ✅ CORRECT:
const incidentSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
```

---

### 4. Emergency Contacts - Extra Fields
**File**: `backend/src/routes/v1/operations/validators/emergencyContacts.validators.ts`
**Lines**: 82-100

**Remove these fields**:
- preferredContactMethod
- notificationChannels
- canPickupStudent
- notes

---

### 5. Users - Invalid Roles
**File**: `backend/src/routes/v1/core/validators/users.validators.ts`
**Lines**: 19-26

**Fix**:
```typescript
// ❌ WRONG:
const userRoles = ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER'];

// ✅ CORRECT:
const userRoles = ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'];
```

---

## Database Enum Quick Reference

Copy-paste these exact values for validators:

```typescript
// USER ROLES
'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN'

// GENDER
'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'

// CONTACT PRIORITY
'PRIMARY' | 'SECONDARY' | 'EMERGENCY_ONLY'

// HEALTH RECORD TYPE
'CHECKUP' | 'VACCINATION' | 'ILLNESS' | 'INJURY' | 'SCREENING' |
'PHYSICAL_EXAM' | 'MENTAL_HEALTH' | 'DENTAL' | 'VISION' | 'HEARING'

// ALLERGY SEVERITY
'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'

// APPOINTMENT TYPE
'ROUTINE_CHECKUP' | 'MEDICATION_ADMINISTRATION' | 'INJURY_ASSESSMENT' |
'ILLNESS_EVALUATION' | 'FOLLOW_UP' | 'SCREENING' | 'EMERGENCY'

// APPOINTMENT STATUS
'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'

// WAITLIST STATUS
'WAITING' | 'NOTIFIED' | 'SCHEDULED' | 'EXPIRED' | 'CANCELLED'

// INCIDENT TYPE
'INJURY' | 'ILLNESS' | 'BEHAVIORAL' | 'MEDICATION_ERROR' |
'ALLERGIC_REACTION' | 'EMERGENCY' | 'OTHER'

// INCIDENT SEVERITY
'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

// WITNESS TYPE
'STUDENT' | 'STAFF' | 'PARENT' | 'OTHER'

// ACTION PRIORITY
'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

// ACTION STATUS
'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

// COMPLIANCE STATUS
'PENDING' | 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW'

// MESSAGE TYPE
'EMAIL' | 'SMS' | 'PUSH_NOTIFICATION' | 'VOICE'

// MESSAGE PRIORITY
'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

// DELIVERY STATUS
'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED'
```

---

## Critical Database Table Structures

### students
```sql
id, studentNumber (UNIQUE), firstName, lastName, dateOfBirth, grade,
gender (ENUM), photo, medicalRecordNum (UNIQUE), isActive (DEFAULT true),
enrollmentDate, nurseId (FK), createdAt, updatedAt
```

### health_records
```sql
id, type (ENUM), date, description, vital (JSONB), provider, notes,
attachments (TEXT[]), studentId (FK), createdAt, updatedAt
```

### emergency_contacts
```sql
id, firstName, lastName, relationship, phoneNumber, email, address,
priority (ENUM), isActive (DEFAULT true), studentId (FK), createdAt, updatedAt
```

### appointments
```sql
id, type (ENUM), scheduledAt, duration (DEFAULT 30), status (ENUM, DEFAULT 'SCHEDULED'),
reason, notes, studentId (FK), nurseId (FK), createdAt, updatedAt
```

### medications
```sql
id, name, genericName, dosageForm, strength, manufacturer, ndc (UNIQUE),
isControlled (DEFAULT false), createdAt, updatedAt
```

### medication_logs
```sql
id, dosageGiven, timeGiven, administeredBy, notes, sideEffects,
studentMedicationId (FK), nurseId (FK), createdAt
```

### incident_reports
```sql
id, type (ENUM), severity (ENUM), description, location, witnesses (TEXT[]),
actionsTaken, parentNotified (DEFAULT false), parentNotificationMethod,
parentNotifiedAt, parentNotifiedBy, followUpRequired (DEFAULT false),
followUpNotes, attachments (TEXT[]), evidencePhotos (TEXT[]),
evidenceVideos (TEXT[]), occurredAt, insuranceClaimNumber,
insuranceClaimStatus (ENUM), legalComplianceStatus (ENUM, DEFAULT 'PENDING'),
studentId (FK), reportedById (FK), createdAt, updatedAt
```

### allergies
```sql
id, allergen, severity (ENUM), reaction, treatment, verified (DEFAULT false),
verifiedBy, verifiedAt, studentId (FK), createdAt, updatedAt
```

### chronic_conditions
```sql
id, condition, diagnosedDate, status (DEFAULT 'ACTIVE'), severity, notes,
carePlan, medications (TEXT[]), restrictions (TEXT[]), triggers (TEXT[]),
diagnosedBy, lastReviewDate, nextReviewDate, studentId (FK), createdAt, updatedAt
```

---

## Testing Checklist

After fixing validators, test:

- [ ] Create health record with correct field names (type, date, not recordType, recordDate)
- [ ] Create appointment with SCHEDULED status (not RESCHEDULED)
- [ ] Create incident with severity: LOW, MEDIUM, HIGH, or CRITICAL
- [ ] Create emergency contact without extra fields
- [ ] Create user with valid role only (no COUNSELOR/VIEWER)
- [ ] Query health records with valid enum types only
- [ ] Verify all array fields (witnesses, attachments, medications, restrictions, triggers)
- [ ] Test all enum values are accepted by database
- [ ] Verify foreign key constraints work
- [ ] Test validation error messages are clear

---

## Priority Fix Order

**Week 1 (This Sprint)**:
1. Fix health records validator (Issues #1, #2)
2. Fix appointments status enum (Issue #3)
3. Fix incidents severity enum (Issue #4)
4. Fix emergency contacts extra fields (Issue #5)
5. Fix users roles enum (Issue #6)

**Week 2 (Next Sprint)**:
6. Verify medication validators
7. Verify chronic conditions arrays
8. Verify allergies severity
9. Verify messages attachments
10. Verify waitlist status values

---

## Full Report Location

**Comprehensive Report**: `.temp/schema-validation-report-SC8V5M.md` (600+ lines)
**Task Tracking**: `.temp/task-status-SC8V5M.json`
**Progress Report**: `.temp/progress-SC8V5M.md`

---

## Impact Summary

- **7 Critical** issues will cause runtime failures
- **15 High Priority** issues will cause data integrity problems
- **8 Medium Priority** issues will cause inconsistencies
- **3 Low Priority** issues are documentation/style

**Risk Level**: HIGH - Production deployments will fail without these fixes
**Estimated Fix Time**: 10-14 hours total
**Data Loss Risk**: MODERATE - Extra fields will be silently dropped
**HIPAA Risk**: LOW - No security violations, only schema mismatches

---

*For detailed analysis and specific line numbers, see `.temp/schema-validation-report-SC8V5M.md`*
