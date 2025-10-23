# Student API Quick Reference

## Base URL
```
POST /api/v1/students
```

## Required Headers
```
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

## Required Fields

| Field | Type | Constraints | Example |
|-------|------|-------------|---------|
| `firstName` | string | 1-100 chars, letters/spaces/hyphens/apostrophes | "Emma" |
| `lastName` | string | 1-100 chars, letters/spaces/hyphens/apostrophes | "Wilson" |
| `dateOfBirth` | string | ISO 8601 date, must be in past, age 3-100 | "2015-03-15" |
| `grade` | string | 1-10 chars | "3" or "K" |
| `studentNumber` | string | 4-20 chars, unique, alphanumeric with hyphens | "STU-2024-001" |
| `gender` | enum | MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY | "FEMALE" |

## Optional Fields

| Field | Type | Constraints | Example |
|-------|------|-------------|---------|
| `photo` | string | Valid URL, max 500 chars | "https://example.com/photo.jpg" |
| `medicalRecordNum` | string | 5-20 chars, unique, alphanumeric with hyphens | "MRN-2024-001" |
| `enrollmentDate` | string | ISO 8601 date, cannot be in future | "2024-09-01" |
| `nurseId` | string | Valid UUID | "550e8400-e29b-41d4-a716-446655440000" |

## Gender Enum Values (IMPORTANT!)

**Must be UPPERCASE**:
- `MALE`
- `FEMALE`
- `OTHER`
- `PREFER_NOT_TO_SAY`

**❌ Invalid (will fail validation)**:
- ~~Male~~, ~~Female~~, ~~Other~~
- ~~male~~, ~~female~~, ~~other~~
- ~~Prefer not to say~~

## Example Requests

### Minimal Valid Request
```json
POST /api/v1/students
Content-Type: application/json
Authorization: Bearer {token}

{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2015-05-20",
  "grade": "3",
  "studentNumber": "STU-2024-001",
  "gender": "MALE"
}
```

### Complete Request with All Fields
```json
POST /api/v1/students
Content-Type: application/json
Authorization: Bearer {token}

{
  "firstName": "Emma",
  "lastName": "Wilson",
  "dateOfBirth": "2016-03-15",
  "grade": "2",
  "studentNumber": "STU-2024-002",
  "gender": "FEMALE",
  "photo": "https://example.com/photos/emma-wilson.jpg",
  "medicalRecordNum": "MRN-2024-002",
  "enrollmentDate": "2024-09-01",
  "nurseId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 201 | Created | Student created successfully |
| 400 | Bad Request | Validation error - check error message for details |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Requires ADMIN or NURSE role |
| 409 | Conflict | Duplicate `studentNumber` or `medicalRecordNum` |
| 500 | Server Error | Database or server error |

## Success Response Example
```json
{
  "status": "success",
  "data": {
    "student": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "studentNumber": "STU-2024-001",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "2015-05-20",
      "grade": "3",
      "gender": "MALE",
      "isActive": true,
      "enrollmentDate": "2024-10-23T12:00:00.000Z",
      "createdAt": "2024-10-23T12:00:00.000Z",
      "updatedAt": "2024-10-23T12:00:00.000Z"
    }
  }
}
```

## Error Response Examples

### Validation Error (400)
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "\"grade\" is required"
}
```

### Gender Validation Error (400)
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "\"gender\" must be one of [MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY]"
}
```

### Duplicate Student Number (409)
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Student number already exists. Please use a unique student number."
}
```

### Duplicate Medical Record Number (409)
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Medical record number already exists. Each student must have a unique medical record number."
}
```

## Common Validation Errors

### Missing Required Field
```
❌ Error: "grade" is required
✓ Fix: Include "grade": "3" in your request
```

### Invalid Gender Value
```
❌ Error: "gender" must be one of [MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY]
✓ Fix: Use uppercase: "gender": "MALE" (not "Male" or "male")
```

### Date of Birth in Future
```
❌ Error: "dateOfBirth" must be less than or equal to "now"
✓ Fix: Use a past date: "dateOfBirth": "2015-03-15"
```

### Invalid Student Number Format
```
❌ Error: "studentNumber" length must be at least 4 characters long
✓ Fix: Use 4-20 characters: "studentNumber": "STU-2024-001"
```

### Invalid Nurse ID
```
❌ Error: "nurseId" must be a valid GUID
✓ Fix: Use valid UUID: "nurseId": "550e8400-e29b-41d4-a716-446655440000"
```

## cURL Example
```bash
curl -X POST http://localhost:5000/api/v1/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "Test",
    "lastName": "Student",
    "dateOfBirth": "2015-01-01",
    "grade": "4",
    "studentNumber": "TEST-001",
    "gender": "MALE"
  }'
```

## PowerShell Example
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_JWT_TOKEN"
}

$body = @{
    firstName = "Test"
    lastName = "Student"
    dateOfBirth = "2015-01-01"
    grade = "4"
    studentNumber = "TEST-001"
    gender = "MALE"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/students" `
    -Method Post `
    -Headers $headers `
    -Body $body
```

## JavaScript/Fetch Example
```javascript
fetch('http://localhost:5000/api/v1/students', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    firstName: 'Test',
    lastName: 'Student',
    dateOfBirth: '2015-01-01',
    grade: '4',
    studentNumber: 'TEST-001',
    gender: 'MALE'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## Testing Checklist

- [ ] Valid minimal request succeeds
- [ ] Valid complete request succeeds
- [ ] Missing `firstName` returns 400
- [ ] Missing `lastName` returns 400
- [ ] Missing `dateOfBirth` returns 400
- [ ] Missing `grade` returns 400
- [ ] Missing `studentNumber` returns 400
- [ ] Missing `gender` returns 400
- [ ] Invalid gender (lowercase) returns 400
- [ ] Future `dateOfBirth` returns 400
- [ ] Duplicate `studentNumber` returns 409
- [ ] Duplicate `medicalRecordNum` returns 409
- [ ] Invalid `nurseId` UUID returns 400

## Related Endpoints

- `GET /api/v1/students` - List all students
- `GET /api/v1/students/{id}` - Get student by ID
- `PUT /api/v1/students/{id}` - Update student
- `POST /api/v1/students/{id}/deactivate` - Deactivate student
- `POST /api/v1/students/{id}/transfer` - Transfer to different nurse

## Notes

- All student data is PHI (Protected Health Information) and HIPAA-compliant
- All operations are audited for compliance
- Emergency contacts are managed separately via `/api/v1/emergency-contacts`
- Health records are managed separately via `/api/v1/health-records`
- Student numbers must be unique across the system
- Medical record numbers must be unique if provided
