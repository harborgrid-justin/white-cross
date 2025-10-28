# White Cross API - Quick Reference Guide

**For Developers & API Consumers**

---

## Base URL

```
Production: https://api.whitecross.health/api/v1
Development: http://localhost:3000/api/v1
```

---

## Authentication

### Get Access Token

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "nurse@school.edu",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "nurse@school.edu",
      "role": "NURSE"
    }
  }
}
```

### Use Token in Requests

```bash
GET /api/v1/students
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Quick Endpoint Reference

### Authentication & Users

```bash
# Register user
POST /api/v1/auth/register
Body: { email, password, firstName, lastName, role }

# Login
POST /api/v1/auth/login
Body: { email, password }

# Get current user
GET /api/v1/auth/me

# List users
GET /api/v1/users?page=1&limit=20&role=NURSE

# Get user by ID
GET /api/v1/users/{id}

# Create user (ADMIN)
POST /api/v1/users
Body: { email, password, firstName, lastName, role }
```

---

### Students

```bash
# List students
GET /api/v1/students?page=1&limit=20&search=John

# Get student by ID
GET /api/v1/students/{id}

# Create student
POST /api/v1/students
Body: {
  firstName, lastName, dateOfBirth, gender,
  schoolId, gradeLevel, studentId
}

# Get student health summary
GET /api/v1/students/{id}/health-summary

# Assign nurse to student
POST /api/v1/students/{id}/assign-nurse
Body: { nurseId }
```

---

### Medications

```bash
# List medications
GET /api/v1/medications?page=1&limit=20&search=aspirin

# Create medication
POST /api/v1/medications
Body: {
  name, genericName, ndcCode, form, strength,
  deaSchedule, requiresWitness
}

# Assign medication to student
POST /api/v1/medications/assign
Body: {
  studentId, medicationId, dosage, frequency,
  route, prescribedBy, prescriptionNumber
}

# Log medication administration
POST /api/v1/medications/administration
Body: {
  studentMedicationId, administeredBy,
  dosageGiven, administeredAt, witnessId, notes
}

# Get student medication logs
GET /api/v1/medications/logs/{studentId}?startDate=2025-01-01

# Get medication schedule
GET /api/v1/medications/schedule?date=2025-10-23

# Get medication inventory
GET /api/v1/medications/inventory

# Report adverse reaction
POST /api/v1/medications/adverse-reaction
Body: {
  studentMedicationId, severity, symptoms,
  actionTaken, reportedBy
}
```

---

### Health Records

```bash
# Get student health records
GET /api/v1/health-records/student/{studentId}

# Get student allergies
GET /api/v1/health-records/student/{studentId}/allergies

# Add allergy
POST /api/v1/health-records/allergies
Body: {
  studentId, allergen, allergyType, severity,
  reaction, diagnosedDate
}

# Get student chronic conditions
GET /api/v1/health-records/student/{studentId}/conditions

# Add chronic condition
POST /api/v1/health-records/conditions
Body: {
  studentId, condition, diagnosedDate,
  icdCode, severity, managementPlan
}

# Get student vaccinations
GET /api/v1/health-records/student/{studentId}/vaccinations

# Add vaccination
POST /api/v1/health-records/vaccinations
Body: {
  studentId, vaccineName, vaccineCode, doseNumber,
  administeredDate, lotNumber, administeredBy
}

# Record vital signs
POST /api/v1/health-records/vitals
Body: {
  studentId, temperature, bloodPressure,
  heartRate, respiratoryRate, weight, height,
  recordedBy
}

# Get student health summary
GET /api/v1/health-records/student/{studentId}/summary

# Get immunization status
GET /api/v1/health-records/student/{studentId}/immunization-status
```

---

### Appointments

```bash
# List appointments
GET /api/v1/appointments?page=1&limit=20&status=scheduled

# Get today's appointments
GET /api/v1/appointments/today

# Get upcoming appointments
GET /api/v1/appointments/upcoming

# Create appointment
POST /api/v1/appointments
Body: {
  studentId, nurseId, appointmentType,
  scheduledDate, scheduledTime, reason
}

# Confirm appointment
POST /api/v1/appointments/{id}/confirm

# Cancel appointment
POST /api/v1/appointments/{id}/cancel
Body: { reason }

# Complete appointment
POST /api/v1/appointments/{id}/complete
Body: { notes, outcome }

# Get student appointments
GET /api/v1/appointments/student/{studentId}
```

---

### Emergency Contacts

```bash
# Get student emergency contacts
GET /api/v1/emergency-contacts/student/{studentId}

# Create emergency contact
POST /api/v1/emergency-contacts
Body: {
  studentId, firstName, lastName, relationship,
  phone, email, isPrimary, canPickup
}

# Set primary contact
POST /api/v1/emergency-contacts/{id}/set-primary

# Verify contact
POST /api/v1/emergency-contacts/{id}/verify
```

---

### Incidents

```bash
# List incidents
GET /api/v1/incidents?page=1&limit=20&severity=high

# Create incident report
POST /api/v1/incidents
Body: {
  studentId, incidentType, severity, location,
  description, reportedBy, incidentDate
}

# Add evidence to incident
POST /api/v1/incidents/{id}/evidence
Content-Type: multipart/form-data
Body: file upload

# Add witness statement
POST /api/v1/incidents/{id}/witnesses
Body: { witnessName, statement }

# Add follow-up action
POST /api/v1/incidents/{id}/follow-ups
Body: { action, assignedTo, dueDate }

# Get student incidents
GET /api/v1/incidents/student/{studentId}
```

---

### Documents

```bash
# List documents
GET /api/v1/documents?page=1&limit=20&category=medical

# Upload document
POST /api/v1/documents
Content-Type: multipart/form-data
Body: {
  file, studentId, category, documentType,
  description, expirationDate
}

# Get student documents
GET /api/v1/documents/student/{studentId}

# Download document
GET /api/v1/documents/{id}/download

# Sign document
POST /api/v1/documents/{id}/sign
Body: { signatureData, signerRole }

# Search documents
GET /api/v1/documents/search?query=consent+form
```

---

### Communications

```bash
# Send message
POST /api/v1/communications/messages
Body: {
  recipientId, subject, body, priority
}

# Get inbox
GET /api/v1/communications/messages/inbox?page=1

# Get sent messages
GET /api/v1/communications/messages/sent?page=1

# Reply to message
POST /api/v1/communications/messages/{id}/reply
Body: { body }

# Create broadcast
POST /api/v1/communications/broadcasts
Body: {
  recipientGroup, subject, body,
  sendDateTime, priority
}

# Schedule message
POST /api/v1/communications/scheduled
Body: {
  recipientIds, subject, body, sendDateTime
}
```

---

### Analytics & Dashboards

```bash
# Get nurse dashboard
GET /api/v1/analytics/dashboard/nurse

# Get admin dashboard
GET /api/v1/analytics/dashboard/admin

# Get health metrics
GET /api/v1/analytics/health-metrics?schoolId={id}

# Get medication usage stats
GET /api/v1/analytics/medications/usage?startDate=2025-01-01

# Get appointment trends
GET /api/v1/analytics/appointments/trends?period=month

# Get incident trends
GET /api/v1/analytics/incidents/trends?groupBy=type
```

---

### Compliance & Audit

```bash
# Get audit logs (ADMIN)
GET /api/v1/audit/logs?page=1&limit=50&userId={id}

# Get PHI access logs (ADMIN)
GET /api/v1/audit/phi-access?studentId={id}

# Get compliance statistics (ADMIN)
GET /api/v1/compliance/statistics

# List policies
GET /api/v1/compliance/policies

# Acknowledge policy
POST /api/v1/compliance/policies/{policyId}/acknowledge

# Get student consents
GET /api/v1/compliance/consents/student/{studentId}
```

---

## Common Query Parameters

### Pagination
```bash
?page=1              # Page number (default: 1)
?limit=20            # Items per page (default: 20, max: 100)
?orderBy=lastName    # Field to sort by
?orderDirection=ASC  # Sort direction (ASC or DESC)
```

### Filtering
```bash
?search=John         # Full-text search
?status=active       # Filter by status
?active=true         # Filter by active/inactive
?startDate=2025-01-01   # Start date filter
?endDate=2025-12-31     # End date filter
```

### Domain-Specific
```bash
?studentId={uuid}    # Filter by student
?nurseId={uuid}      # Filter by nurse
?schoolId={uuid}     # Filter by school
?gradeLevel=9        # Filter by grade level
?type=allergy        # Filter by type
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "errors": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## HTTP Status Codes

| Code | Meaning | When to Expect |
|------|---------|----------------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation error, malformed request |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions for action |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource, business rule violation |
| 500 | Server Error | Unexpected server error |

---

## User Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| ADMIN | System administrator | Full access to all endpoints |
| DISTRICT_ADMIN | District-level admin | Manage schools, users, system config |
| SCHOOL_ADMIN | School-level admin | Manage school data, users |
| NURSE | School nurse | Manage students, medications, health records |
| COUNSELOR | School counselor | View students, create incidents |
| VIEWER | Read-only user | View-only access to assigned data |

---

## Common Request Examples

### Create Student with Health Record
```bash
# 1. Create student
POST /api/v1/students
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2010-05-15",
  "gender": "Male",
  "schoolId": "school-uuid",
  "gradeLevel": "9",
  "studentId": "ST12345"
}

# Response: { success: true, data: { id: "student-uuid", ... } }

# 2. Add allergy
POST /api/v1/health-records/allergies
{
  "studentId": "student-uuid",
  "allergen": "Peanuts",
  "allergyType": "Food",
  "severity": "Severe",
  "reaction": "Anaphylaxis",
  "diagnosedDate": "2015-03-20"
}

# 3. Add emergency contact
POST /api/v1/emergency-contacts
{
  "studentId": "student-uuid",
  "firstName": "Jane",
  "lastName": "Doe",
  "relationship": "Mother",
  "phone": "555-123-4567",
  "email": "jane.doe@example.com",
  "isPrimary": true,
  "canPickup": true
}
```

### Assign and Administer Medication
```bash
# 1. Create medication (if not exists)
POST /api/v1/medications
{
  "name": "EpiPen",
  "genericName": "Epinephrine Auto-Injector",
  "ndcCode": "49502-500-01",
  "form": "Injection",
  "strength": "0.3mg",
  "deaSchedule": null,
  "requiresWitness": false
}

# Response: { success: true, data: { id: "medication-uuid", ... } }

# 2. Assign to student
POST /api/v1/medications/assign
{
  "studentId": "student-uuid",
  "medicationId": "medication-uuid",
  "dosage": "0.3mg",
  "frequency": "As needed for anaphylaxis",
  "route": "Intramuscular",
  "prescribedBy": "Dr. Smith",
  "prescriptionNumber": "RX12345"
}

# Response: { success: true, data: { id: "student-medication-uuid", ... } }

# 3. Log administration
POST /api/v1/medications/administration
{
  "studentMedicationId": "student-medication-uuid",
  "administeredBy": "nurse-user-uuid",
  "dosageGiven": "0.3mg",
  "administeredAt": "2025-10-23T10:30:00Z",
  "notes": "Administered during allergic reaction to peanuts in cafeteria"
}
```

### Create and Manage Appointment
```bash
# 1. Create appointment
POST /api/v1/appointments
{
  "studentId": "student-uuid",
  "nurseId": "nurse-user-uuid",
  "appointmentType": "Health Screening",
  "scheduledDate": "2025-10-25",
  "scheduledTime": "14:00",
  "reason": "Annual vision screening"
}

# Response: { success: true, data: { id: "appointment-uuid", ... } }

# 2. Confirm appointment
POST /api/v1/appointments/{appointment-uuid}/confirm

# 3. Complete appointment
POST /api/v1/appointments/{appointment-uuid}/complete
{
  "notes": "Vision screening completed. Results normal.",
  "outcome": "Normal"
}
```

---

## Error Handling

### Common Errors

**401 Unauthorized - Missing Token**
```json
{
  "success": false,
  "error": {
    "message": "Missing authentication token",
    "code": "UNAUTHORIZED"
  }
}
```

**401 Unauthorized - Expired Token**
```json
{
  "success": false,
  "error": {
    "message": "Token has expired",
    "code": "TOKEN_EXPIRED"
  }
}
```

**403 Forbidden - Insufficient Permissions**
```json
{
  "success": false,
  "error": {
    "message": "Insufficient permissions to perform this action",
    "code": "FORBIDDEN"
  }
}
```

**400 Bad Request - Validation Error**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "errors": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": {
    "message": "Student not found",
    "code": "NOT_FOUND"
  }
}
```

---

## Rate Limiting

**Not currently implemented.** Recommended for production:
- 100 requests/minute per user (general endpoints)
- 1000 requests/minute per user (high-traffic endpoints)
- 10 requests/minute (authentication endpoints)

---

## Development Tips

### Using Swagger UI
1. Start backend: `npm run dev`
2. Navigate to: `http://localhost:3000/documentation`
3. Click "Authorize" button
4. Enter JWT token from `/auth/login`
5. Test endpoints directly in browser

### Testing with cURL
```bash
# Login and save token
TOKEN=$(curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nurse@school.edu","password":"password123"}' \
  | jq -r '.data.token')

# Use token in requests
curl -X GET http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN"
```

### Testing with Postman
1. Create environment variable `base_url`: `http://localhost:3000/api/v1`
2. Create environment variable `token`: (empty initially)
3. Login request → Save token to environment
4. Use `{{base_url}}` and `{{token}}` in requests

---

## Best Practices

### API Client Implementation
1. **Store JWT securely** (httpOnly cookie or secure storage)
2. **Implement token refresh** before expiration
3. **Handle 401 errors** by redirecting to login
4. **Retry failed requests** with exponential backoff
5. **Validate responses** against expected schema
6. **Log API errors** for debugging

### Error Handling
```javascript
try {
  const response = await fetch(`${baseUrl}/students`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  const data = await response.json();
  return data.data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

### Pagination Handling
```javascript
async function getAllStudents() {
  let allStudents = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await api.get(`/students?page=${page}&limit=100`);
    allStudents = [...allStudents, ...response.data];

    hasMore = page < response.pagination.totalPages;
    page++;
  }

  return allStudents;
}
```

---

## Support Resources

- **Full API Inventory:** `backend/docs/API_ROUTES_INVENTORY.md`
- **API Summary:** `backend/docs/API_INVENTORY_SUMMARY.md`
- **Swagger UI:** `/documentation` endpoint
- **Source Code:** `backend/src/routes/v1/`

---

**Last Updated:** 2025-10-23
**Total Endpoints:** 342
**API Version:** v1
