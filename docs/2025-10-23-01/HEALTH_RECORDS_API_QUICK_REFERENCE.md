# Health Records API - Quick Reference Guide

## Field Name Changes (IMPORTANT)

### ❌ OLD FIELD NAMES (DO NOT USE)
```json
{
  "type": "CHECKUP",           // ❌ INCORRECT
  "date": "2024-10-15",         // ❌ INCORRECT
  "description": "..."          // ✅ Still correct
}
```

### ✅ NEW FIELD NAMES (USE THESE)
```json
{
  "recordType": "CHECKUP",      // ✅ CORRECT
  "recordDate": "2024-10-15",   // ✅ CORRECT
  "title": "Wellness Visit",    // ✅ NEW REQUIRED FIELD
  "description": "..."          // ✅ CORRECT
}
```

---

## Health Record Types (recordType ENUM)

```typescript
'CHECKUP'                    // General health checkup
'VACCINATION'                // Immunization record
'ILLNESS'                    // Illness/sickness record
'INJURY'                     // Injury/accident record
'SCREENING'                  // Health screening
'PHYSICAL_EXAM'              // Physical examination
'MENTAL_HEALTH'              // Mental health visit
'DENTAL'                     // Dental visit
'VISION'                     // Vision screening/exam
'HEARING'                    // Hearing screening/exam
'EXAMINATION'                // General examination
'ALLERGY_DOCUMENTATION'      // Allergy documentation
'CHRONIC_CONDITION_REVIEW'   // Chronic condition review
'GROWTH_ASSESSMENT'          // Growth/development assessment
'VITAL_SIGNS_CHECK'          // Vital signs check
'EMERGENCY_VISIT'            // Emergency visit
'FOLLOW_UP'                  // Follow-up visit
'CONSULTATION'               // Medical consultation
'DIAGNOSTIC_TEST'            // Diagnostic test
'PROCEDURE'                  // Medical procedure
'HOSPITALIZATION'            // Hospital admission
'SURGERY'                    // Surgical procedure
'COUNSELING'                 // Counseling session
```

---

## Required vs Optional Fields

### Required Fields (Always Include)
```json
{
  "studentId": "uuid",           // Student UUID
  "recordType": "enum",          // Record type from list above
  "title": "string",             // Brief title (3-255 chars)
  "description": "string",       // Detailed description (5-5000 chars)
  "recordDate": "ISO date"       // When event occurred (cannot be future)
}
```

### Optional Fields (Include When Available)
```json
{
  "provider": "string",          // Healthcare provider name (max 255 chars)
  "providerNpi": "string",       // 10-digit NPI number
  "facility": "string",          // Facility name (max 255 chars)
  "facilityNpi": "string",       // 10-digit facility NPI
  "diagnosis": "string",         // Diagnosis description (max 5000 chars)
  "diagnosisCode": "string",     // ICD-10 code (e.g., "Z00.00")
  "treatment": "string",         // Treatment description (max 5000 chars)
  "followUpRequired": boolean,   // Default: false
  "followUpDate": "ISO date",    // Must be future date
  "followUpCompleted": boolean,  // Default: false
  "attachments": ["string"],     // File paths/URLs
  "metadata": {},                // JSONB object
  "isConfidential": boolean,     // Default: false
  "notes": "string"              // Additional notes (max 5000 chars)
}
```

---

## API Endpoints

### Create Health Record
```http
POST /api/v1/health-records
Content-Type: application/json

{
  "studentId": "123e4567-e89b-12d3-a456-426614174000",
  "recordType": "CHECKUP",
  "title": "Annual Physical",
  "description": "Routine annual physical examination",
  "recordDate": "2024-10-15T10:30:00Z",
  "provider": "Dr. Smith",
  "diagnosis": "Healthy",
  "diagnosisCode": "Z00.00"
}
```

### Update Health Record
```http
PUT /api/v1/health-records/{id}
Content-Type: application/json

{
  "diagnosis": "Updated diagnosis",
  "followUpRequired": true,
  "followUpDate": "2024-11-15T10:30:00Z"
}
```

### List Student Records
```http
GET /api/v1/health-records/student/{studentId}?recordType=CHECKUP&dateFrom=2024-01-01&dateTo=2024-12-31&page=1&limit=20
```

### Get Single Record
```http
GET /api/v1/health-records/{id}
```

### Delete Record
```http
DELETE /api/v1/health-records/{id}
```

---

## Validation Rules

### NPI Numbers
- Must be exactly 10 digits
- Pattern: `/^\d{10}$/`
- Example: `"1234567890"`

### ICD-10 Codes
- Must start with a letter followed by 2 digits
- Pattern: `/^[A-Z]\d{2}/`
- Examples: `"Z00.00"`, `"A01.1"`, `"J45.909"`

### Dates
- **recordDate**: Must be ISO 8601 format, cannot be in the future
- **followUpDate**: Must be ISO 8601 format, must be in the future
- Format: `"2024-10-15T14:30:00Z"`

### String Lengths
| Field | Min | Max |
|-------|-----|-----|
| title | 3 | 255 |
| description | 5 | 5000 |
| provider | - | 255 |
| diagnosis | - | 5000 |
| treatment | - | 5000 |
| notes | - | 5000 |

---

## Example Requests

### Minimal Valid Request
```json
{
  "studentId": "123e4567-e89b-12d3-a456-426614174000",
  "recordType": "CHECKUP",
  "title": "Wellness Visit",
  "description": "Student wellness checkup - all normal",
  "recordDate": "2024-10-15T14:30:00Z"
}
```

### Complete Request with All Fields
```json
{
  "studentId": "123e4567-e89b-12d3-a456-426614174000",
  "recordType": "PHYSICAL_EXAM",
  "title": "Sports Physical",
  "description": "Pre-season physical for basketball team. All systems normal.",
  "recordDate": "2024-10-15T14:30:00Z",
  "provider": "Dr. Sarah Johnson",
  "providerNpi": "9876543210",
  "facility": "School Health Center",
  "facilityNpi": "1234567890",
  "diagnosis": "Healthy - cleared for athletics",
  "diagnosisCode": "Z02.5",
  "treatment": "None required",
  "followUpRequired": false,
  "attachments": ["s3://documents/sports-physical.pdf"],
  "metadata": {
    "sport": "basketball",
    "season": "2024-2025"
  },
  "isConfidential": false,
  "notes": "Excellent physical condition"
}
```

### Update Request (Partial)
```json
{
  "diagnosis": "Follow-up required for elevated blood pressure",
  "followUpRequired": true,
  "followUpDate": "2024-11-15T10:00:00Z",
  "notes": "Schedule follow-up in 30 days"
}
```

---

## Common Validation Errors

### ❌ Missing Required Field
```json
// Error: "title" is required
{
  "studentId": "...",
  "recordType": "CHECKUP",
  "description": "...",
  "recordDate": "2024-10-15"
  // Missing "title"
}
```

### ❌ Invalid Record Type
```json
// Error: "recordType" must be one of [valid types]
{
  "recordType": "INVALID_TYPE"  // Not in enum
}
```

### ❌ Future Date for recordDate
```json
// Error: "recordDate" must be less than or equal to "now"
{
  "recordDate": "2025-12-15"  // Future date not allowed
}
```

### ❌ Past Date for followUpDate
```json
// Error: "followUpDate" must be greater than or equal to "now"
{
  "followUpDate": "2024-01-15"  // Past date not allowed
}
```

### ❌ Invalid NPI Format
```json
// Error: "providerNpi" must be exactly 10 digits
{
  "providerNpi": "12345"  // Must be 10 digits
}
```

### ❌ Invalid ICD-10 Code
```json
// Error: "diagnosisCode" with value "123" fails pattern validation
{
  "diagnosisCode": "123"  // Must start with letter
}
```

### ❌ String Too Short/Long
```json
// Error: "title" length must be at least 3 characters long
{
  "title": "AB"  // Minimum 3 chars
}

// Error: "description" length must be less than or equal to 5000 characters
{
  "description": "..." // Maximum 5000 chars
}
```

---

## Migration Checklist

### Frontend/Client Updates Required

- [ ] Update all API calls to use `recordType` instead of `type`
- [ ] Update all API calls to use `recordDate` instead of `date`
- [ ] Add `title` field to all health record forms (required)
- [ ] Add optional fields to forms:
  - [ ] `providerNpi`
  - [ ] `facility`
  - [ ] `facilityNpi`
  - [ ] `diagnosis`
  - [ ] `diagnosisCode`
  - [ ] `treatment`
  - [ ] `followUpRequired`
  - [ ] `followUpDate`
  - [ ] `followUpCompleted`
  - [ ] `metadata`
  - [ ] `isConfidential`
- [ ] Update record type dropdowns to include all 23 types
- [ ] Add NPI field validation (10 digits)
- [ ] Add ICD-10 code field validation
- [ ] Update date pickers (recordDate cannot be future, followUpDate must be future)
- [ ] Test all CRUD operations
- [ ] Update any TypeScript interfaces/types

---

## Quick Copy-Paste Examples

### TypeScript Interface
```typescript
interface HealthRecordCreateRequest {
  studentId: string;
  recordType: HealthRecordType;
  title: string;
  description: string;
  recordDate: string; // ISO 8601 date
  provider?: string;
  providerNpi?: string;
  facility?: string;
  facilityNpi?: string;
  diagnosis?: string;
  diagnosisCode?: string;
  treatment?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  followUpCompleted?: boolean;
  attachments?: string[];
  metadata?: Record<string, any>;
  isConfidential?: boolean;
  notes?: string;
}

enum HealthRecordType {
  CHECKUP = 'CHECKUP',
  VACCINATION = 'VACCINATION',
  ILLNESS = 'ILLNESS',
  INJURY = 'INJURY',
  SCREENING = 'SCREENING',
  PHYSICAL_EXAM = 'PHYSICAL_EXAM',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  DENTAL = 'DENTAL',
  VISION = 'VISION',
  HEARING = 'HEARING',
  EXAMINATION = 'EXAMINATION',
  ALLERGY_DOCUMENTATION = 'ALLERGY_DOCUMENTATION',
  CHRONIC_CONDITION_REVIEW = 'CHRONIC_CONDITION_REVIEW',
  GROWTH_ASSESSMENT = 'GROWTH_ASSESSMENT',
  VITAL_SIGNS_CHECK = 'VITAL_SIGNS_CHECK',
  EMERGENCY_VISIT = 'EMERGENCY_VISIT',
  FOLLOW_UP = 'FOLLOW_UP',
  CONSULTATION = 'CONSULTATION',
  DIAGNOSTIC_TEST = 'DIAGNOSTIC_TEST',
  PROCEDURE = 'PROCEDURE',
  HOSPITALIZATION = 'HOSPITALIZATION',
  SURGERY = 'SURGERY',
  COUNSELING = 'COUNSELING'
}
```

### Axios Request Example
```typescript
const createHealthRecord = async (data: HealthRecordCreateRequest) => {
  const response = await axios.post('/api/v1/health-records', {
    studentId: data.studentId,
    recordType: data.recordType,
    title: data.title,
    description: data.description,
    recordDate: new Date().toISOString(),
    provider: data.provider,
    diagnosis: data.diagnosis,
    diagnosisCode: data.diagnosisCode
  });
  return response.data;
};
```

### Fetch Request Example
```typescript
const createHealthRecord = async (data: HealthRecordCreateRequest) => {
  const response = await fetch('/api/v1/health-records', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      studentId: data.studentId,
      recordType: data.recordType,
      title: data.title,
      description: data.description,
      recordDate: new Date().toISOString()
    })
  });
  return response.json();
};
```

---

## Support

For questions or issues:
1. Check this quick reference guide
2. See full documentation: `HEALTH_RECORDS_VALIDATOR_FIX_SUMMARY.md`
3. Contact backend team for API-related issues
4. Contact frontend team for UI/form-related issues
