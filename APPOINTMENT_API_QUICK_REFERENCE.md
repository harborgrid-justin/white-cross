# Appointment API - Quick Reference Guide

## ⚠️ BREAKING CHANGES - Field Names Updated

The appointment API has been updated to match the database schema. **All clients must update their code.**

---

## Field Name Changes

| ❌ Old Field Name | ✅ New Field Name | Status |
|-------------------|-------------------|--------|
| `type` | `appointmentType` | **REQUIRED UPDATE** |
| `scheduledAt` | `scheduledDate` | **REQUIRED UPDATE** |
| `reason` (required) | `reason` (optional) | **VALIDATION CHANGE** |

---

## Create Appointment

### Endpoint
```
POST /api/v1/appointments
```

### Request Body (NEW FORMAT)
```json
{
  "appointmentType": "ROUTINE_CHECKUP",
  "scheduledDate": "2024-01-20T14:00:00Z",
  "duration": 30,
  "reason": "Annual checkup",
  "notes": "Student has history of asthma",
  "studentId": "550e8400-e29b-41d4-a716-446655440000",
  "nurseId": "660e8400-e29b-41d4-a716-446655440001"
}
```

### Required Fields
- ✅ `appointmentType` - One of 7 enum values (see below)
- ✅ `scheduledDate` - ISO 8601 format, must be future date
- ✅ `studentId` - Valid student UUID
- ✅ `nurseId` - Valid nurse UUID

### Optional Fields
- `duration` - 15-120 minutes (default: 30)
- `reason` - Max 500 characters
- `notes` - Max 1000 characters
- `priority` - LOW | MEDIUM | HIGH | URGENT
- `isFollowUp` - boolean
- `parentAppointmentId` - UUID of parent appointment

### Valid Appointment Types (Enum)
```typescript
"ROUTINE_CHECKUP"
"MEDICATION_ADMINISTRATION"
"INJURY_ASSESSMENT"
"ILLNESS_EVALUATION"
"FOLLOW_UP"
"SCREENING"
"EMERGENCY"
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "appointment": {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "appointmentType": "ROUTINE_CHECKUP",
      "scheduledDate": "2024-01-20T14:00:00Z",
      "duration": 30,
      "status": "SCHEDULED",
      "reason": "Annual checkup",
      "notes": "Student has history of asthma",
      "studentId": "550e8400-e29b-41d4-a716-446655440000",
      "nurseId": "660e8400-e29b-41d4-a716-446655440001",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

## Update Appointment

### Endpoint
```
PUT /api/v1/appointments/{id}
```

### Request Body (NEW FORMAT)
```json
{
  "appointmentType": "FOLLOW_UP",
  "scheduledDate": "2024-01-25T10:00:00Z",
  "duration": 45,
  "reason": "Follow-up for routine checkup",
  "notes": "Updated notes"
}
```

### All Fields Optional
- `appointmentType` - Change appointment type
- `scheduledDate` - Reschedule appointment
- `duration` - Update duration
- `reason` - Update reason
- `notes` - Update notes
- `priority` - Update priority
- `status` - Can only be set to SCHEDULED or RESCHEDULED

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "appointment": { /* updated appointment data */ }
  }
}
```

---

## List Appointments (with Filters)

### Endpoint
```
GET /api/v1/appointments
```

### Query Parameters (NEW FORMAT)
```
GET /api/v1/appointments?appointmentType=ROUTINE_CHECKUP&status=SCHEDULED&page=1&limit=20
```

### Available Filters
- `appointmentType` - Filter by appointment type (use enum values)
- `status` - Filter by status (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW, RESCHEDULED)
- `nurseId` - Filter by nurse UUID
- `studentId` - Filter by student UUID
- `dateFrom` - Start date filter (ISO 8601)
- `dateTo` - End date filter (ISO 8601)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Example Queries
```bash
# All routine checkups
GET /api/v1/appointments?appointmentType=ROUTINE_CHECKUP

# All scheduled appointments for a nurse
GET /api/v1/appointments?nurseId=660e8400-e29b-41d4-a716-446655440001&status=SCHEDULED

# All appointments in date range
GET /api/v1/appointments?dateFrom=2024-01-01&dateTo=2024-01-31

# Emergency appointments only
GET /api/v1/appointments?appointmentType=EMERGENCY
```

---

## Recurring Appointments

### Endpoint
```
POST /api/v1/appointments/recurring
```

### Request Body (NEW FORMAT)
```json
{
  "baseData": {
    "appointmentType": "MEDICATION_ADMINISTRATION",
    "scheduledDate": "2024-01-20T09:00:00Z",
    "duration": 15,
    "reason": "Daily medication administration",
    "studentId": "550e8400-e29b-41d4-a716-446655440000",
    "nurseId": "660e8400-e29b-41d4-a716-446655440001"
  },
  "recurrencePattern": {
    "frequency": "DAILY",
    "interval": 1,
    "occurrences": 30
  }
}
```

### Recurrence Frequencies
- `DAILY` - Every N days
- `WEEKLY` - Every N weeks (optionally specify daysOfWeek)
- `MONTHLY` - Every N months

---

## Waitlist Management

### Add to Waitlist

#### Endpoint
```
POST /api/v1/appointments/waitlist
```

#### Request Body (NEW FORMAT)
```json
{
  "appointmentType": "SCREENING",
  "studentId": "550e8400-e29b-41d4-a716-446655440000",
  "nurseId": "660e8400-e29b-41d4-a716-446655440001",
  "priority": "HIGH",
  "preferredDates": [
    "2024-01-20T09:00:00Z",
    "2024-01-21T09:00:00Z"
  ],
  "notes": "Student needs vision screening"
}
```

---

## Migration Guide for Developers

### 1. Frontend Code Updates

#### Before (❌ OLD CODE)
```javascript
const appointmentData = {
  type: 'ROUTINE_CHECKUP',
  scheduledAt: new Date().toISOString(),
  reason: 'Annual checkup', // was required
  studentId: studentId,
  nurseId: nurseId
};
```

#### After (✅ NEW CODE)
```javascript
const appointmentData = {
  appointmentType: 'ROUTINE_CHECKUP',
  scheduledDate: new Date().toISOString(),
  reason: 'Annual checkup', // now optional
  studentId: studentId,
  nurseId: nurseId
};
```

### 2. Filter/Query Updates

#### Before (❌ OLD CODE)
```javascript
const params = new URLSearchParams({
  type: 'ROUTINE_CHECKUP',
  status: 'SCHEDULED'
});
```

#### After (✅ NEW CODE)
```javascript
const params = new URLSearchParams({
  appointmentType: 'ROUTINE_CHECKUP',
  status: 'SCHEDULED'
});
```

### 3. Form Validation Updates

#### Before (❌ OLD CODE)
```javascript
const schema = yup.object({
  type: yup.string().required('Appointment type is required'),
  scheduledAt: yup.date().required('Schedule date is required'),
  reason: yup.string().required('Reason is required')
});
```

#### After (✅ NEW CODE)
```javascript
const schema = yup.object({
  appointmentType: yup.string().required('Appointment type is required'),
  scheduledDate: yup.date().required('Schedule date is required'),
  reason: yup.string().optional() // NOW OPTIONAL!
});
```

---

## Common Errors

### Error: "Appointment type is required"
**Cause:** Using old field name `type` instead of `appointmentType`
**Fix:** Update payload to use `appointmentType`

### Error: "Scheduled date is required"
**Cause:** Using old field name `scheduledAt` instead of `scheduledDate`
**Fix:** Update payload to use `scheduledDate`

### Error: "Appointment type must be one of: ROUTINE_CHECKUP, ..."
**Cause:** Invalid enum value for `appointmentType`
**Fix:** Use one of the 7 valid enum values (see above)

---

## Testing Checklist

- [ ] Update all API calls to use `appointmentType` instead of `type`
- [ ] Update all API calls to use `scheduledDate` instead of `scheduledAt`
- [ ] Remove required validation from `reason` field in forms
- [ ] Update query parameter builders to use `appointmentType`
- [ ] Test creating appointments with all 7 appointment types
- [ ] Test creating appointments without `reason` field
- [ ] Test filtering appointments by `appointmentType`
- [ ] Test recurring appointments with new field names
- [ ] Test waitlist operations with new field names
- [ ] Update TypeScript interfaces to match new field names
- [ ] Update API client libraries/SDKs
- [ ] Update integration tests

---

## Files Modified (Backend)

1. ✅ `backend/src/routes/v1/operations/validators/appointments.validators.ts`
2. ✅ `backend/src/routes/v1/operations/controllers/appointments.controller.ts`
3. ✅ `backend/src/types/appointment.ts`

---

## Support

If you encounter issues after this update:
1. Verify you're using the new field names (`appointmentType`, `scheduledDate`)
2. Check that enum values are correct (UPPERCASE with underscores)
3. Ensure `reason` is treated as optional, not required
4. Review this guide for correct payload structure

**Report Generated:** 2025-10-23
**API Version:** v1
**Breaking Changes:** Yes
**Required Action:** Update all clients
