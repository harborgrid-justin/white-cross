# Medication API Quick Reference

## Database Schema Field Names ✅

**ALWAYS USE THESE FIELD NAMES:**

```typescript
{
  medicationName: string,    // NOT "name"
  dosage: string,            // e.g., "200mg", "2 tablets"
  frequency: string,         // e.g., "twice daily", "BID"
  route: string,             // e.g., "oral", "Oral" (case-insensitive)
  prescribedBy: string,      // e.g., "Dr. Smith"
  startDate: Date,           // ISO 8601 format
  endDate?: Date,            // Optional
  instructions?: string,     // Optional
  sideEffects?: string,      // Optional
  isActive: boolean,         // Default: true
  studentId: string          // UUID
}
```

---

## Valid Routes (case-insensitive)

Accepted values: `"oral"`, `"Oral"`, `"ORAL"` → All normalize to `"Oral"`

- Oral
- Sublingual
- Topical
- Intravenous
- Intramuscular
- Subcutaneous
- Inhalation
- Ophthalmic
- Otic
- Nasal
- Rectal
- Transdermal
- Vaginal
- Buccal
- Intradermal

---

## Valid Frequency Patterns

### Daily Patterns:
- `"once daily"`, `"twice daily"`, `"1x daily"`, `"2x per day"`

### Medical Abbreviations:
- `"BID"` (twice daily)
- `"TID"` (three times daily)
- `"QID"` (four times daily)
- `"QD"` (once daily)
- `"QHS"` (at bedtime)
- `"PRN"` (as needed)

### Hourly Intervals:
- `"every 6 hours"`, `"every 8 hrs"`, `"q8h"`

### Other:
- `"as needed"`, `"before meals"`, `"at bedtime"`, `"with food"`

---

## Example Payloads

### ✅ CORRECT - Create Medication
```json
{
  "medicationName": "Ibuprofen",
  "dosage": "200mg",
  "frequency": "twice daily",
  "route": "oral",
  "prescribedBy": "Dr. Smith",
  "startDate": "2024-01-15T10:00:00Z",
  "studentId": "123e4567-e89b-12d3-a456-426614174000"
}
```

### ❌ WRONG - Using "name" instead of "medicationName"
```json
{
  "name": "Ibuprofen",  // ❌ WRONG - Use "medicationName"
  "dosage": "200mg",
  "frequency": "twice daily",
  "route": "oral",
  "prescribedBy": "Dr. Smith",
  "startDate": "2024-01-15T10:00:00Z",
  "studentId": "123e4567-e89b-12d3-a456-426614174000"
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/medications` | List all medications (paginated) |
| POST | `/api/v1/medications` | Create new medication |
| GET | `/api/v1/medications/{id}` | Get medication by ID |
| PUT | `/api/v1/medications/{id}` | Update medication |
| PUT | `/api/v1/medications/{id}/deactivate` | Deactivate medication |
| GET | `/api/v1/medications/student/{studentId}` | Get student medications |

---

## Common Errors Fixed

### Error 1: "WHERE parameter 'name' has invalid 'undefined' value"
**Cause**: Using `name` instead of `medicationName`
**Fix**: ✅ Use `medicationName` field

### Error 2: Route validation fails for lowercase "oral"
**Cause**: Case-sensitive validation
**Fix**: ✅ Now accepts any case, normalizes to "Oral"

### Error 3: Future dates rejected for startDate
**Cause**: `.max('now')` validation
**Fix**: ✅ Removed restriction, medications can start in future

---

## Testing Examples

### cURL - Create Medication
```bash
curl -X POST http://localhost:3000/api/v1/medications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "medicationName": "Amoxicillin",
    "dosage": "500mg",
    "frequency": "three times daily",
    "route": "oral",
    "prescribedBy": "Dr. Jane Smith",
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-01-25T00:00:00Z",
    "instructions": "Take with food",
    "studentId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

### cURL - Get Student Medications
```bash
curl -X GET "http://localhost:3000/api/v1/medications/student/123e4567-e89b-12d3-a456-426614174000?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### cURL - Update Medication
```bash
curl -X PUT http://localhost:3000/api/v1/medications/med-id-here \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "dosage": "750mg",
    "frequency": "twice daily"
  }'
```

### cURL - Deactivate Medication
```bash
curl -X PUT http://localhost:3000/api/v1/medications/med-id-here/deactivate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "reason": "Treatment completed successfully after 10-day course",
    "deactivationType": "COMPLETED"
  }'
```

---

## Summary

✅ **Always use `medicationName`** - NOT `name`
✅ **Route is case-insensitive** - "oral", "Oral", "ORAL" all work
✅ **Future dates allowed** for `startDate`
✅ **All CRUD operations working** - create, read, update, deactivate

---

Last Updated: 2025-10-23
