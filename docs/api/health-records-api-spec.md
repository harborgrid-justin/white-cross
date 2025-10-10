# Health Records REST API Specification v1.0

## Executive Summary

This document specifies a SOA-compliant REST API architecture for the White Cross Healthcare Platform Health Records module. The API is designed to meet HIPAA compliance requirements, support multi-tenant school district operations, and provide enterprise-grade security, scalability, and maintainability.

**API Base URL:** `https://api.whitecross.health/v1`
**API Version:** 1.0
**Protocol:** HTTPS (TLS 1.2+)
**Authentication:** JWT Bearer Token
**Content Type:** `application/json`
**Date Format:** ISO 8601 (UTC)

---

## Table of Contents

1. [API Design Principles](#api-design-principles)
2. [Authentication & Authorization](#authentication--authorization)
3. [Resource Endpoints](#resource-endpoints)
4. [Request/Response Standards](#requestresponse-standards)
5. [Error Handling](#error-handling)
6. [Pagination & Filtering](#pagination--filtering)
7. [Versioning Strategy](#versioning-strategy)
8. [Rate Limiting](#rate-limiting)
9. [HIPAA Compliance & Security](#hipaa-compliance--security)
10. [API Health & Monitoring](#api-health--monitoring)
11. [Migration Plan](#migration-plan)

---

## 1. API Design Principles

### 1.1 RESTful Resource Orientation

The API follows REST architectural constraints:

- **Resources as nouns:** Use plural nouns for collections (`/health-records`, `/allergies`)
- **HTTP methods for operations:** GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove)
- **Stateless interactions:** Each request contains all information needed
- **HATEOAS principles:** Include relevant links in responses for discoverability
- **Idempotent operations:** GET, PUT, DELETE, and PATCH operations are idempotent

### 1.2 Resource Hierarchy

```
/api/v1
  /students/{studentId}
    /health-records
    /allergies
    /chronic-conditions
    /vaccinations
    /vitals
    /growth-measurements
  /health-records
  /health-records/{recordId}
  /allergies/{allergyId}
  /chronic-conditions/{conditionId}
```

### 1.3 SOA Compliance

- **Service Autonomy:** Health Records service operates independently
- **Service Abstraction:** Implementation details hidden from consumers
- **Service Reusability:** Designed for use across multiple client types
- **Service Composability:** Can be combined with other services
- **Service Discoverability:** Self-documenting via OpenAPI/Swagger

---

## 2. Authentication & Authorization

### 2.1 Authentication Method

**JWT Bearer Token Authentication**

```http
Authorization: Bearer <JWT_TOKEN>
```

### 2.2 Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "clx1234567890",
    "email": "nurse@school.edu",
    "role": "NURSE",
    "schoolId": "clx0987654321",
    "districtId": "clx1122334455",
    "iat": 1704067200,
    "exp": 1704153600,
    "iss": "whitecross-api",
    "aud": "whitecross-client"
  }
}
```

### 2.3 Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **NURSE** | Read/Write health records for assigned students |
| **SCHOOL_ADMIN** | Read all records within school, limited write access |
| **DISTRICT_ADMIN** | Read all records within district, audit access |
| **ADMIN** | Full access to all operations |
| **VIEWER** | Read-only access to assigned students |
| **COUNSELOR** | Read mental health records, limited write access |

### 2.4 Authorization Headers

```http
Authorization: Bearer <JWT_TOKEN>
X-Request-ID: <UUID>                    # For request tracing
X-Client-Version: 1.2.3                 # Client application version
X-School-Context: <SCHOOL_ID>           # Optional: Override default school context
X-User-Agent: WhiteCross-iOS/1.2.3      # Client identification
```

### 2.5 PHI Access Logging

All PHI access MUST be logged with:
- User ID and role
- Timestamp (ISO 8601)
- Resource accessed (type and ID)
- Operation performed
- IP address
- Success/failure status
- School/District context

---

## 3. Resource Endpoints

### 3.1 Health Records

#### 3.1.1 List Health Records for Student

```http
GET /api/v1/students/{studentId}/health-records
```

**Authorization:** NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, ADMIN, VIEWER

**Query Parameters:**
```
page          integer  Page number (default: 1)
limit         integer  Records per page (default: 20, max: 100)
type          string   Filter by record type (CHECKUP, VACCINATION, etc.)
dateFrom      string   ISO 8601 date (YYYY-MM-DD)
dateTo        string   ISO 8601 date (YYYY-MM-DD)
provider      string   Filter by provider name (partial match)
sortBy        string   Field to sort by (date, type, provider)
sortOrder     string   asc or desc (default: desc)
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "clx1234567890",
        "type": "CHECKUP",
        "date": "2024-01-15T10:30:00Z",
        "description": "Annual physical examination",
        "provider": "Dr. Sarah Johnson",
        "vital": {
          "temperature": 98.6,
          "bloodPressureSystolic": 110,
          "bloodPressureDiastolic": 70,
          "heartRate": 72,
          "height": 150.5,
          "weight": 45.2,
          "bmi": 20.0
        },
        "notes": "Student is healthy and active",
        "attachments": [
          "https://storage.whitecross.health/records/clx123/file1.pdf"
        ],
        "createdAt": "2024-01-15T10:45:00Z",
        "updatedAt": "2024-01-15T10:45:00Z",
        "student": {
          "id": "clx0987654321",
          "firstName": "John",
          "lastName": "Doe",
          "studentNumber": "S12345"
        },
        "_links": {
          "self": {
            "href": "/api/v1/health-records/clx1234567890"
          },
          "student": {
            "href": "/api/v1/students/clx0987654321"
          }
        }
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "_links": {
      "self": {
        "href": "/api/v1/students/clx0987654321/health-records?page=1&limit=20"
      },
      "next": {
        "href": "/api/v1/students/clx0987654321/health-records?page=2&limit=20"
      },
      "last": {
        "href": "/api/v1/students/clx0987654321/health-records?page=3&limit=20"
      }
    }
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions to access student records
- `404 Not Found` - Student not found
- `422 Unprocessable Entity` - Invalid query parameters
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

#### 3.1.2 Get Single Health Record

```http
GET /api/v1/health-records/{recordId}
```

**Authorization:** NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, ADMIN, VIEWER

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "type": "VACCINATION",
    "date": "2024-01-15T10:30:00Z",
    "description": "COVID-19 vaccine - 2nd dose",
    "provider": "School Nurse Johnson",
    "vital": null,
    "notes": "No adverse reactions reported",
    "attachments": [],
    "metadata": {
      "vaccineType": "Pfizer-BioNTech",
      "lotNumber": "FK1234",
      "manufacturer": "Pfizer",
      "administrationSite": "Left deltoid",
      "nextDueDate": "2024-07-15"
    },
    "createdAt": "2024-01-15T10:45:00Z",
    "updatedAt": "2024-01-15T10:45:00Z",
    "createdBy": {
      "id": "clx9999999999",
      "name": "Nurse Sarah Johnson",
      "role": "NURSE"
    },
    "student": {
      "id": "clx0987654321",
      "firstName": "John",
      "lastName": "Doe",
      "studentNumber": "S12345",
      "dateOfBirth": "2010-05-15",
      "grade": "8"
    },
    "_links": {
      "self": {
        "href": "/api/v1/health-records/clx1234567890"
      },
      "student": {
        "href": "/api/v1/students/clx0987654321"
      },
      "student-health-records": {
        "href": "/api/v1/students/clx0987654321/health-records"
      }
    }
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

#### 3.1.3 Create Health Record

```http
POST /api/v1/health-records
```

**Authorization:** NURSE, ADMIN

**Request Body:**
```json
{
  "studentId": "clx0987654321",
  "type": "CHECKUP",
  "date": "2024-01-15T10:30:00Z",
  "description": "Annual physical examination",
  "provider": "Dr. Sarah Johnson",
  "vital": {
    "temperature": 98.6,
    "bloodPressureSystolic": 110,
    "bloodPressureDiastolic": 70,
    "heartRate": 72,
    "respiratoryRate": 16,
    "oxygenSaturation": 98,
    "height": 150.5,
    "weight": 45.2
  },
  "notes": "Student is healthy and active",
  "attachments": []
}
```

**Validation Rules:**
- `studentId`: Required, valid UUID, student must exist
- `type`: Required, enum value (CHECKUP, VACCINATION, ILLNESS, INJURY, etc.)
- `date`: Required, ISO 8601 datetime, cannot be future date
- `description`: Required, 10-500 characters
- `provider`: Optional, 2-100 characters
- `vital`: Optional, object with numeric values
- `notes`: Optional, max 2000 characters
- `attachments`: Optional, array of valid URLs

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "type": "CHECKUP",
    "date": "2024-01-15T10:30:00Z",
    "description": "Annual physical examination",
    "provider": "Dr. Sarah Johnson",
    "vital": {
      "temperature": 98.6,
      "bloodPressureSystolic": 110,
      "bloodPressureDiastolic": 70,
      "heartRate": 72,
      "respiratoryRate": 16,
      "oxygenSaturation": 98,
      "height": 150.5,
      "weight": 45.2,
      "bmi": 20.0
    },
    "notes": "Student is healthy and active",
    "attachments": [],
    "createdAt": "2024-01-15T10:45:00Z",
    "updatedAt": "2024-01-15T10:45:00Z",
    "student": {
      "id": "clx0987654321",
      "firstName": "John",
      "lastName": "Doe",
      "studentNumber": "S12345"
    },
    "_links": {
      "self": {
        "href": "/api/v1/health-records/clx1234567890"
      }
    }
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Student not found
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

#### 3.1.4 Update Health Record (Full Replace)

```http
PUT /api/v1/health-records/{recordId}
```

**Authorization:** NURSE, ADMIN (must be creator or have override permission)

**Request Body:** Same as POST, all fields required

**Success Response (200 OK):** Same structure as GET single record

#### 3.1.5 Partial Update Health Record

```http
PATCH /api/v1/health-records/{recordId}
```

**Authorization:** NURSE, ADMIN (must be creator or have override permission)

**Request Body:**
```json
{
  "notes": "Updated notes after follow-up consultation",
  "vital": {
    "bloodPressureSystolic": 115,
    "bloodPressureDiastolic": 72
  }
}
```

**Success Response (200 OK):** Updated record

#### 3.1.6 Delete Health Record

```http
DELETE /api/v1/health-records/{recordId}
```

**Authorization:** ADMIN only

**Success Response (204 No Content):** Empty body

**Note:** Soft delete is recommended for audit trail compliance. Implement with `deletedAt` timestamp.

#### 3.1.7 Bulk Delete Health Records

```http
POST /api/v1/health-records/bulk-delete
```

**Authorization:** ADMIN only

**Request Body:**
```json
{
  "recordIds": [
    "clx1234567890",
    "clx2345678901",
    "clx3456789012"
  ],
  "reason": "Data retention policy - records older than 7 years",
  "confirmedBy": "clx9999999999"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "deleted": 3,
    "failed": 0,
    "errors": []
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

### 3.2 Allergies

#### 3.2.1 List Student Allergies

```http
GET /api/v1/students/{studentId}/allergies
```

**Authorization:** NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, ADMIN, VIEWER

**Query Parameters:**
```
severity      string   Filter by severity (MILD, MODERATE, SEVERE, LIFE_THREATENING)
verified      boolean  Filter by verification status
sortBy        string   Field to sort by (severity, allergen, createdAt)
sortOrder     string   asc or desc (default: desc by severity)
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "allergies": [
      {
        "id": "clx1111111111",
        "allergen": "Peanuts",
        "severity": "LIFE_THREATENING",
        "reaction": "Anaphylaxis",
        "treatment": "EpiPen administered immediately",
        "verified": true,
        "verifiedBy": "Dr. Sarah Johnson",
        "verifiedAt": "2024-01-10T09:00:00Z",
        "createdAt": "2024-01-05T14:00:00Z",
        "updatedAt": "2024-01-10T09:00:00Z",
        "student": {
          "id": "clx0987654321",
          "firstName": "John",
          "lastName": "Doe",
          "studentNumber": "S12345"
        },
        "_links": {
          "self": {
            "href": "/api/v1/allergies/clx1111111111"
          }
        }
      }
    ]
  },
  "meta": {
    "count": 1
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

#### 3.2.2 Get Single Allergy

```http
GET /api/v1/allergies/{allergyId}
```

**Authorization:** NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, ADMIN, VIEWER

**Success Response (200 OK):** Single allergy object

#### 3.2.3 Create Allergy

```http
POST /api/v1/allergies
```

**Authorization:** NURSE, ADMIN

**Request Body:**
```json
{
  "studentId": "clx0987654321",
  "allergen": "Peanuts",
  "severity": "LIFE_THREATENING",
  "reaction": "Anaphylaxis, hives, difficulty breathing",
  "treatment": "EpiPen administered immediately, call 911",
  "verified": false
}
```

**Validation Rules:**
- `studentId`: Required, valid UUID
- `allergen`: Required, 2-100 characters, check for duplicates
- `severity`: Required, enum (MILD, MODERATE, SEVERE, LIFE_THREATENING)
- `reaction`: Optional, max 500 characters
- `treatment`: Optional, max 500 characters
- `verified`: Optional, boolean (default: false)

**Success Response (201 Created):** Created allergy object

**Business Logic:**
- Check for duplicate allergen for same student
- Auto-generate alerts for SEVERE and LIFE_THREATENING allergies
- If `verified` is true, set `verifiedBy` to current user and `verifiedAt` to current timestamp

#### 3.2.4 Update Allergy

```http
PATCH /api/v1/allergies/{allergyId}
```

**Authorization:** NURSE, ADMIN

**Request Body:**
```json
{
  "severity": "SEVERE",
  "treatment": "Updated treatment protocol",
  "verified": true
}
```

**Success Response (200 OK):** Updated allergy object

#### 3.2.5 Verify Allergy

```http
POST /api/v1/allergies/{allergyId}/verify
```

**Authorization:** NURSE, ADMIN

**Request Body:**
```json
{
  "verifiedBy": "Dr. Sarah Johnson",
  "verificationNotes": "Confirmed via patient medical records"
}
```

**Success Response (200 OK):** Updated allergy with verification details

#### 3.2.6 Delete Allergy

```http
DELETE /api/v1/allergies/{allergyId}
```

**Authorization:** ADMIN only

**Success Response (204 No Content)**

### 3.3 Chronic Conditions

#### 3.3.1 List Student Chronic Conditions

```http
GET /api/v1/students/{studentId}/chronic-conditions
```

**Authorization:** NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, ADMIN, VIEWER

**Query Parameters:**
```
status        string   Filter by status (ACTIVE, MANAGED, RESOLVED)
severity      string   Filter by severity (MILD, MODERATE, SEVERE)
sortBy        string   Field to sort by (status, condition, diagnosedDate)
sortOrder     string   asc or desc
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "conditions": [
      {
        "id": "clx2222222222",
        "condition": "Type 1 Diabetes",
        "diagnosedDate": "2020-03-15",
        "status": "ACTIVE",
        "severity": "SEVERE",
        "notes": "Requires insulin pump management",
        "carePlan": "https://storage.whitecross.health/care-plans/clx222/diabetes-plan.pdf",
        "medications": ["Insulin", "Glucagon"],
        "restrictions": ["Monitor blood sugar before physical activity"],
        "triggers": ["Stress", "Illness", "Missed meals"],
        "diagnosedBy": "Dr. Emily Chen - Pediatric Endocrinology",
        "lastReviewDate": "2023-12-01",
        "nextReviewDate": "2024-06-01",
        "createdAt": "2020-03-20T10:00:00Z",
        "updatedAt": "2023-12-01T14:30:00Z",
        "student": {
          "id": "clx0987654321",
          "firstName": "John",
          "lastName": "Doe",
          "studentNumber": "S12345"
        },
        "_links": {
          "self": {
            "href": "/api/v1/chronic-conditions/clx2222222222"
          }
        }
      }
    ]
  },
  "meta": {
    "count": 1
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

#### 3.3.2 Create Chronic Condition

```http
POST /api/v1/chronic-conditions
```

**Authorization:** NURSE, ADMIN

**Request Body:**
```json
{
  "studentId": "clx0987654321",
  "condition": "Type 1 Diabetes",
  "diagnosedDate": "2020-03-15",
  "status": "ACTIVE",
  "severity": "SEVERE",
  "notes": "Requires insulin pump management",
  "carePlan": "Monitor blood sugar 4x daily, insulin as prescribed",
  "medications": ["Insulin", "Glucagon"],
  "restrictions": ["Monitor blood sugar before physical activity"],
  "triggers": ["Stress", "Illness", "Missed meals"],
  "diagnosedBy": "Dr. Emily Chen",
  "nextReviewDate": "2024-06-01"
}
```

**Validation Rules:**
- `studentId`: Required, valid UUID
- `condition`: Required, 2-200 characters
- `diagnosedDate`: Required, ISO 8601 date, cannot be future
- `status`: Required, enum (ACTIVE, MANAGED, RESOLVED)
- `severity`: Optional, enum (MILD, MODERATE, SEVERE)
- `medications`: Optional, array of strings
- `restrictions`: Optional, array of strings
- `triggers`: Optional, array of strings

**Success Response (201 Created):** Created condition object

#### 3.3.3 Update Chronic Condition

```http
PATCH /api/v1/chronic-conditions/{conditionId}
```

**Authorization:** NURSE, ADMIN

**Success Response (200 OK):** Updated condition object

#### 3.3.4 Delete Chronic Condition

```http
DELETE /api/v1/chronic-conditions/{conditionId}
```

**Authorization:** ADMIN only

**Success Response (204 No Content)**

### 3.4 Vaccinations

#### 3.4.1 List Student Vaccinations

```http
GET /api/v1/students/{studentId}/vaccinations
```

**Authorization:** NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, ADMIN, VIEWER

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "vaccinations": [
      {
        "id": "clx3333333333",
        "type": "VACCINATION",
        "date": "2024-01-15T10:30:00Z",
        "description": "COVID-19 vaccine - 2nd dose",
        "provider": "School Nurse Johnson",
        "metadata": {
          "vaccineName": "COVID-19",
          "vaccineType": "Pfizer-BioNTech",
          "manufacturer": "Pfizer",
          "lotNumber": "FK1234",
          "dose": "2",
          "administrationSite": "Left deltoid",
          "nextDueDate": "2024-07-15",
          "compliant": true
        },
        "notes": "No adverse reactions",
        "createdAt": "2024-01-15T10:45:00Z",
        "_links": {
          "self": {
            "href": "/api/v1/health-records/clx3333333333"
          }
        }
      }
    ]
  },
  "meta": {
    "compliance": {
      "overall": 95,
      "required": 12,
      "completed": 11,
      "overdue": 1
    }
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

### 3.5 Vital Signs

#### 3.5.1 Get Recent Vitals

```http
GET /api/v1/students/{studentId}/vitals
```

**Authorization:** NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, ADMIN, VIEWER

**Query Parameters:**
```
limit         integer  Number of records (default: 10, max: 50)
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "vitals": [
      {
        "id": "clx4444444444",
        "date": "2024-01-15T10:30:00Z",
        "type": "CHECKUP",
        "vital": {
          "temperature": 98.6,
          "bloodPressureSystolic": 110,
          "bloodPressureDiastolic": 70,
          "heartRate": 72,
          "respiratoryRate": 16,
          "oxygenSaturation": 98,
          "height": 150.5,
          "weight": 45.2,
          "bmi": 20.0
        },
        "provider": "Dr. Sarah Johnson"
      }
    ]
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

#### 3.5.2 Record Vitals

```http
POST /api/v1/students/{studentId}/vitals
```

**Authorization:** NURSE, ADMIN

**Request Body:**
```json
{
  "date": "2024-01-20T09:15:00Z",
  "vital": {
    "temperature": 98.6,
    "bloodPressureSystolic": 110,
    "bloodPressureDiastolic": 70,
    "heartRate": 72,
    "respiratoryRate": 16,
    "oxygenSaturation": 98
  },
  "notes": "Routine morning check"
}
```

**Success Response (201 Created):** Created health record with vitals

### 3.6 Growth Measurements

#### 3.6.1 Get Growth Chart Data

```http
GET /api/v1/students/{studentId}/growth-measurements
```

**Authorization:** NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, ADMIN, VIEWER

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "measurements": [
      {
        "date": "2024-01-15",
        "height": 150.5,
        "weight": 45.2,
        "bmi": 20.0,
        "recordType": "PHYSICAL_EXAM",
        "percentiles": {
          "height": 65,
          "weight": 60,
          "bmi": 58
        }
      }
    ],
    "growthVelocity": {
      "height": "5.2 cm/year",
      "weight": "3.1 kg/year"
    }
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

#### 3.6.2 Add Growth Measurement

```http
POST /api/v1/students/{studentId}/growth-measurements
```

**Authorization:** NURSE, ADMIN

**Request Body:**
```json
{
  "date": "2024-01-20",
  "height": 151.0,
  "weight": 45.5,
  "headCircumference": 52.0,
  "notes": "Annual measurement"
}
```

**Success Response (201 Created):** Created measurement with calculated BMI and percentiles

### 3.7 Health Summary

#### 3.7.1 Get Student Health Summary

```http
GET /api/v1/students/{studentId}/health-summary
```

**Authorization:** NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, ADMIN, VIEWER

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "clx0987654321",
      "firstName": "John",
      "lastName": "Doe",
      "studentNumber": "S12345",
      "dateOfBirth": "2010-05-15",
      "age": 13,
      "grade": "8"
    },
    "allergies": [
      {
        "id": "clx1111111111",
        "allergen": "Peanuts",
        "severity": "LIFE_THREATENING",
        "verified": true
      }
    ],
    "chronicConditions": [
      {
        "id": "clx2222222222",
        "condition": "Type 1 Diabetes",
        "status": "ACTIVE",
        "severity": "SEVERE"
      }
    ],
    "recentVitals": {
      "date": "2024-01-15",
      "temperature": 98.6,
      "bloodPressure": "110/70",
      "heartRate": 72,
      "height": 150.5,
      "weight": 45.2,
      "bmi": 20.0
    },
    "vaccinations": {
      "compliance": 95,
      "required": 12,
      "completed": 11,
      "overdue": 1,
      "recent": [
        {
          "vaccineName": "COVID-19",
          "date": "2024-01-15",
          "nextDue": "2024-07-15"
        }
      ]
    },
    "recordCounts": {
      "CHECKUP": 5,
      "VACCINATION": 11,
      "ILLNESS": 3,
      "INJURY": 1
    },
    "lastPhysical": "2023-08-15",
    "alerts": [
      {
        "type": "SEVERE_ALLERGY",
        "message": "Life-threatening peanut allergy - EpiPen required",
        "severity": "high"
      },
      {
        "type": "CHRONIC_CONDITION",
        "message": "Active Type 1 Diabetes - monitor blood sugar",
        "severity": "high"
      }
    ]
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

### 3.8 Search & Reporting

#### 3.8.1 Search Health Records

```http
GET /api/v1/health-records/search
```

**Authorization:** NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, ADMIN

**Query Parameters:**
```
q             string   Search query (min 3 chars)
type          string   Filter by record type
dateFrom      string   ISO 8601 date
dateTo        string   ISO 8601 date
schoolId      string   Filter by school (ADMIN/DISTRICT_ADMIN only)
page          integer  Page number
limit         integer  Records per page
```

**Success Response (200 OK):** Paginated list of matching records

#### 3.8.2 Export Health History

```http
GET /api/v1/students/{studentId}/health-records/export
```

**Authorization:** NURSE, SCHOOL_ADMIN, ADMIN

**Query Parameters:**
```
format        string   Export format (json, pdf, csv)
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "exportId": "exp_abc123xyz",
    "downloadUrl": "https://storage.whitecross.health/exports/exp_abc123xyz.pdf",
    "expiresAt": "2024-01-21T14:30:00Z",
    "format": "pdf"
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

#### 3.8.3 Import Health Records

```http
POST /api/v1/students/{studentId}/health-records/import
```

**Authorization:** ADMIN only

**Request Body (multipart/form-data):**
```
file          file     JSON or CSV file
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "imported": 15,
    "skipped": 2,
    "failed": 1,
    "errors": [
      {
        "line": 18,
        "field": "date",
        "message": "Invalid date format"
      }
    ]
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

---

## 4. Request/Response Standards

### 4.1 Standard Response Envelope

All API responses follow this structure:

```json
{
  "success": true | false,
  "data": { ... } | null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  } | null,
  "meta": {
    "pagination": { ... },
    "_links": { ... }
  } | null,
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

### 4.2 Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": { ... },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

### 4.3 Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "fields": [
        {
          "field": "studentId",
          "message": "Student ID is required",
          "code": "REQUIRED_FIELD"
        },
        {
          "field": "date",
          "message": "Date cannot be in the future",
          "code": "INVALID_DATE"
        }
      ]
    }
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

### 4.4 HATEOAS Links

Include navigation links in responses:

```json
{
  "_links": {
    "self": {
      "href": "/api/v1/health-records/clx123"
    },
    "student": {
      "href": "/api/v1/students/clx456"
    },
    "allergies": {
      "href": "/api/v1/students/clx456/allergies"
    },
    "chronic-conditions": {
      "href": "/api/v1/students/clx456/chronic-conditions"
    }
  }
}
```

---

## 5. Error Handling

### 5.1 HTTP Status Codes

| Status Code | Meaning | Use Case |
|-------------|---------|----------|
| **200 OK** | Success | Successful GET, PUT, PATCH |
| **201 Created** | Resource created | Successful POST |
| **204 No Content** | Success, no body | Successful DELETE |
| **400 Bad Request** | Invalid request | Malformed JSON, invalid data types |
| **401 Unauthorized** | Authentication failed | Missing/invalid token |
| **403 Forbidden** | Permission denied | Insufficient role permissions |
| **404 Not Found** | Resource not found | Invalid student/record ID |
| **409 Conflict** | Resource conflict | Duplicate allergy, concurrent update |
| **422 Unprocessable Entity** | Validation error | Business logic validation failure |
| **429 Too Many Requests** | Rate limit exceeded | Too many requests from client |
| **500 Internal Server Error** | Server error | Unhandled exception |
| **503 Service Unavailable** | Service unavailable | Maintenance mode, database down |

### 5.2 Error Codes

```typescript
enum ErrorCode {
  // Authentication & Authorization
  AUTH_TOKEN_MISSING = 'AUTH_TOKEN_MISSING',
  AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_VALUE = 'INVALID_VALUE',
  INVALID_DATE = 'INVALID_DATE',
  FUTURE_DATE_NOT_ALLOWED = 'FUTURE_DATE_NOT_ALLOWED',

  // Business Logic
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  STUDENT_NOT_FOUND = 'STUDENT_NOT_FOUND',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE',
  DUPLICATE_ALLERGY = 'DUPLICATE_ALLERGY',
  INVALID_OPERATION = 'INVALID_OPERATION',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Server Errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}
```

### 5.3 Validation Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "fields": [
        {
          "field": "studentId",
          "message": "Student ID is required",
          "code": "REQUIRED_FIELD",
          "value": null
        },
        {
          "field": "type",
          "message": "Invalid record type. Must be one of: CHECKUP, VACCINATION, ILLNESS, INJURY, SCREENING, PHYSICAL_EXAM, MENTAL_HEALTH, DENTAL, VISION, HEARING",
          "code": "INVALID_VALUE",
          "value": "INVALID_TYPE",
          "allowedValues": ["CHECKUP", "VACCINATION", "ILLNESS", "INJURY", "SCREENING", "PHYSICAL_EXAM", "MENTAL_HEALTH", "DENTAL", "VISION", "HEARING"]
        }
      ]
    }
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

### 5.4 Business Logic Error Response

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_ALLERGY",
    "message": "This student already has an allergy record for 'Peanuts'",
    "details": {
      "studentId": "clx0987654321",
      "allergen": "Peanuts",
      "existingAllergyId": "clx1111111111",
      "suggestion": "Update the existing allergy record instead"
    }
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

### 5.5 HIPAA Audit Logging on Errors

All failed access attempts to PHI must be logged:

```json
{
  "timestamp": "2024-01-20T14:30:00Z",
  "userId": "clx9999999999",
  "userRole": "VIEWER",
  "action": "READ",
  "resource": "health-records",
  "resourceId": "clx1234567890",
  "studentId": "clx0987654321",
  "success": false,
  "errorCode": "INSUFFICIENT_PERMISSIONS",
  "ipAddress": "192.168.1.100",
  "userAgent": "WhiteCross-iOS/1.2.3"
}
```

---

## 6. Pagination & Filtering

### 6.1 Pagination Parameters

```
page          integer  Page number (default: 1, min: 1)
limit         integer  Items per page (default: 20, min: 1, max: 100)
```

### 6.2 Pagination Response

```json
{
  "meta": {
    "pagination": {
      "page": 2,
      "limit": 20,
      "total": 125,
      "totalPages": 7,
      "hasNextPage": true,
      "hasPreviousPage": true
    },
    "_links": {
      "self": {
        "href": "/api/v1/students/clx123/health-records?page=2&limit=20"
      },
      "first": {
        "href": "/api/v1/students/clx123/health-records?page=1&limit=20"
      },
      "previous": {
        "href": "/api/v1/students/clx123/health-records?page=1&limit=20"
      },
      "next": {
        "href": "/api/v1/students/clx123/health-records?page=3&limit=20"
      },
      "last": {
        "href": "/api/v1/students/clx123/health-records?page=7&limit=20"
      }
    }
  }
}
```

### 6.3 Sorting

```
sortBy        string   Field to sort by (date, type, severity, etc.)
sortOrder     string   asc or desc (default: desc)
```

Example: `/api/v1/students/clx123/health-records?sortBy=date&sortOrder=desc`

### 6.4 Filtering

Standard filter parameters:
- **Date range:** `dateFrom`, `dateTo`
- **Type/Category:** `type`, `status`, `severity`
- **Text search:** `q` or `search`
- **Boolean:** `verified`, `active`

Example: `/api/v1/students/clx123/health-records?type=VACCINATION&dateFrom=2023-01-01&dateTo=2023-12-31`

### 6.5 Field Selection (Sparse Fieldsets)

```
fields        string   Comma-separated list of fields to include
```

Example: `/api/v1/health-records/clx123?fields=id,type,date,description`

Response includes only requested fields:
```json
{
  "success": true,
  "data": {
    "id": "clx123",
    "type": "CHECKUP",
    "date": "2024-01-15T10:30:00Z",
    "description": "Annual physical examination"
  }
}
```

### 6.6 Cursor-Based Pagination (Alternative)

For real-time data streams or large datasets:

```
cursor        string   Opaque cursor token
limit         integer  Items per page
```

Response:
```json
{
  "meta": {
    "pagination": {
      "nextCursor": "eyJpZCI6ImNseDEyMyIsImRhdGUiOiIyMDI0LTAxLTE1In0=",
      "hasMore": true
    }
  }
}
```

---

## 7. Versioning Strategy

### 7.1 URL-Based Versioning (Recommended)

```
/api/v1/health-records
/api/v2/health-records
```

**Rationale:**
- Clear and explicit
- Easy to route and cache
- Simple for clients to understand
- Supports multiple versions simultaneously

### 7.2 Version Lifecycle

| Stage | Support | Duration |
|-------|---------|----------|
| **Current** | Full support, new features | Ongoing |
| **Maintenance** | Bug fixes, security updates | 12 months |
| **Deprecated** | Security updates only | 6 months |
| **Sunset** | No support, decommissioned | - |

### 7.3 Version Deprecation Process

1. **Announcement:** 18 months before sunset
2. **Deprecation Warning:** Return `Sunset` header 12 months before sunset
3. **Maintenance Mode:** New version released, old version enters maintenance
4. **Deprecation:** No new features, critical fixes only
5. **Sunset:** Version decommissioned

### 7.4 Deprecation Headers

```http
Sunset: Sat, 01 Jan 2025 00:00:00 GMT
Link: </api/v2/health-records>; rel="successor-version"
Deprecation: true
```

### 7.5 Breaking vs Non-Breaking Changes

**Non-Breaking Changes (Patch):**
- Adding new optional fields
- Adding new endpoints
- Adding new enum values (with default handling)
- Bug fixes
- Performance improvements

**Breaking Changes (Major Version):**
- Removing endpoints
- Removing fields
- Changing field types
- Changing response structure
- Removing enum values
- Changing authentication method

### 7.6 Alternative: Header-Based Versioning

```http
API-Version: 1
Accept: application/vnd.whitecross.v1+json
```

**Not recommended** for this implementation due to caching complexity and client simplicity requirements.

---

## 8. Rate Limiting

### 8.1 Rate Limit Strategy

**Sliding Window Algorithm** with per-user and per-IP limits

| Client Type | Requests per Minute | Requests per Hour | Requests per Day |
|-------------|---------------------|-------------------|------------------|
| **Authenticated User** | 100 | 3,000 | 50,000 |
| **Authenticated Admin** | 200 | 10,000 | 100,000 |
| **Anonymous (public endpoints)** | 20 | 100 | 1,000 |
| **System Integration** | 500 | 20,000 | 200,000 |

### 8.2 Rate Limit Headers

Every API response includes rate limit information:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1704067800
X-RateLimit-Policy: 100 per minute, 3000 per hour
```

### 8.3 Rate Limit Exceeded Response

**Status Code:** `429 Too Many Requests`

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "details": {
      "limit": 100,
      "window": "1 minute",
      "retryAfter": 45
    }
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_abc123xyz"
}
```

```http
Retry-After: 45
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1704067845
```

### 8.4 Rate Limit Exemptions

- Health monitoring endpoints
- Emergency operations (flagged with `X-Emergency: true` header)
- Scheduled batch jobs (with pre-approved token)

### 8.5 Burst Allowance

Allow short bursts above the limit:
- **Token Bucket:** 120 tokens with 100/minute refill rate
- Allows temporary spikes while preventing sustained abuse

---

## 9. HIPAA Compliance & Security

### 9.1 HIPAA Security Requirements

#### 9.1.1 Administrative Safeguards

- **Access Control:** Role-based access control (RBAC) enforced at API level
- **Audit Controls:** All PHI access logged with complete audit trail
- **Security Training:** API documentation includes security guidelines
- **Contingency Planning:** Backup and disaster recovery procedures

#### 9.1.2 Physical Safeguards

- **Data Center Security:** All data stored in HIPAA-compliant infrastructure
- **Workstation Security:** API access from secure workstations only
- **Device Controls:** Mobile device management for API access

#### 9.1.3 Technical Safeguards

- **Encryption in Transit:** TLS 1.2+ required for all API connections
- **Encryption at Rest:** All PHI encrypted using AES-256
- **Access Control:** Multi-factor authentication for sensitive operations
- **Audit Logging:** Comprehensive logging of all PHI access
- **Integrity Controls:** Digital signatures for critical records

### 9.2 Data Encryption

#### 9.2.1 Transport Security

```
Minimum TLS Version: 1.2
Supported Cipher Suites:
  - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
  - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
  - TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
```

#### 9.2.2 At-Rest Encryption

- Database encryption: AES-256-GCM
- File storage encryption: AES-256-CBC
- Key management: AWS KMS or Azure Key Vault

### 9.3 Audit Logging

#### 9.3.1 Required Audit Fields

```typescript
interface AuditLog {
  timestamp: string;          // ISO 8601 timestamp
  userId: string;             // User ID performing action
  userRole: string;           // User role (NURSE, ADMIN, etc.)
  action: string;             // CREATE, READ, UPDATE, DELETE
  resource: string;           // health-records, allergies, etc.
  resourceId: string;         // Resource ID accessed
  studentId: string;          // Student ID for PHI access
  success: boolean;           // Operation success/failure
  errorCode?: string;         // Error code if failed
  ipAddress: string;          // Client IP address
  userAgent: string;          // Client user agent
  schoolId: string;           // School context
  districtId: string;         // District context
  requestId: string;          // Request tracking ID
  changes?: object;           // Before/after values for updates
  metadata?: object;          // Additional context
}
```

#### 9.3.2 Audit Log Retention

- **Minimum Retention:** 6 years (HIPAA requirement)
- **Log Storage:** Immutable, append-only storage
- **Access Control:** Admin and compliance officers only
- **Regular Review:** Automated anomaly detection

### 9.4 Data Minimization

API responses only include necessary PHI:

```typescript
// Internal database model
interface HealthRecordFull {
  id: string;
  studentId: string;
  socialSecurityNumber: string;  // Highly sensitive
  insuranceId: string;           // Sensitive
  // ... other fields
}

// API response (minimized)
interface HealthRecordResponse {
  id: string;
  studentId: string;
  // SSN and insurance ID excluded unless specifically requested
  // ... other fields
}
```

### 9.5 PHI Access Restrictions

#### 9.5.1 Minimum Necessary Standard

- Users can only access PHI necessary for their job function
- School nurses can only access students in their school
- District admins can access district-wide data for reporting only

#### 9.5.2 Break-the-Glass Access

Emergency access with enhanced logging:

```http
POST /api/v1/students/{studentId}/health-records
X-Emergency-Access: true
X-Emergency-Reason: "Student emergency - anaphylaxis"
```

Response includes:
```json
{
  "warning": "Emergency access granted. This action has been logged and will be reviewed.",
  "auditId": "audit_emergency_123",
  "data": { ... }
}
```

### 9.6 Data Retention & Deletion

#### 9.6.1 Retention Policies

- **Health Records:** 7 years after last entry (configurable per state)
- **Audit Logs:** 6 years minimum
- **Deleted Records:** Soft delete with 30-day recovery window

#### 9.6.2 Right to Erasure

```http
DELETE /api/v1/students/{studentId}/health-records/purge
```

**Authorization:** ADMIN only, requires legal approval

### 9.7 Security Headers

All API responses include security headers:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 9.8 Input Validation & Sanitization

- All input validated against schema
- SQL injection prevention via parameterized queries
- XSS prevention via output encoding
- CSRF protection for state-changing operations
- Maximum request size: 10MB

### 9.9 Vulnerability Management

- **Dependency Scanning:** Weekly automated scans
- **Penetration Testing:** Annual third-party testing
- **Security Updates:** Applied within 48 hours for critical vulnerabilities
- **Bug Bounty Program:** Public vulnerability disclosure program

---

## 10. API Health & Monitoring

### 10.1 Health Check Endpoints

#### 10.1.1 Basic Health Check

```http
GET /api/health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-20T14:30:00Z"
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "unhealthy",
  "version": "1.0.0",
  "timestamp": "2024-01-20T14:30:00Z",
  "details": {
    "database": "degraded",
    "cache": "healthy"
  }
}
```

#### 10.1.2 Detailed Health Check

```http
GET /api/health/detailed
```

**Authorization:** ADMIN only

**Response (200 OK):**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-20T14:30:00Z",
  "uptime": 86400,
  "components": {
    "api": {
      "status": "healthy",
      "responseTime": 45
    },
    "database": {
      "status": "healthy",
      "responseTime": 12,
      "connections": {
        "active": 15,
        "idle": 5,
        "max": 100
      }
    },
    "cache": {
      "status": "healthy",
      "hitRate": 92.5,
      "memoryUsage": 45.2
    },
    "storage": {
      "status": "healthy",
      "diskUsage": 62.3
    }
  },
  "metrics": {
    "requestsPerMinute": 450,
    "averageResponseTime": 87,
    "errorRate": 0.2
  }
}
```

### 10.2 Readiness & Liveness Probes

#### 10.2.1 Liveness Probe

```http
GET /api/health/live
```

Returns 200 if application is running (for Kubernetes)

#### 10.2.2 Readiness Probe

```http
GET /api/health/ready
```

Returns 200 if application is ready to accept traffic

### 10.3 API Metrics Endpoints

#### 10.3.1 Performance Metrics

```http
GET /api/metrics/performance
```

**Authorization:** ADMIN only

**Response (200 OK):**
```json
{
  "timestamp": "2024-01-20T14:30:00Z",
  "period": "last_24_hours",
  "metrics": {
    "totalRequests": 125000,
    "successfulRequests": 123500,
    "failedRequests": 1500,
    "averageResponseTime": 87,
    "p50ResponseTime": 65,
    "p95ResponseTime": 150,
    "p99ResponseTime": 320,
    "requestsByEndpoint": {
      "/api/v1/health-records": 45000,
      "/api/v1/allergies": 12000,
      "/api/v1/chronic-conditions": 8000
    },
    "errorsByCode": {
      "400": 200,
      "401": 100,
      "404": 800,
      "500": 400
    }
  }
}
```

### 10.4 OpenAPI/Swagger Documentation

```http
GET /api/docs
```

**Response:** Interactive Swagger UI

```http
GET /api/openapi.json
```

**Response:** OpenAPI 3.0 specification JSON

### 10.5 Monitoring & Alerting

#### 10.5.1 Key Performance Indicators (KPIs)

- **Availability:** Target 99.9% uptime
- **Latency:** p95 < 200ms, p99 < 500ms
- **Error Rate:** < 0.5%
- **Data Integrity:** 100% consistency

#### 10.5.2 Alert Conditions

- API response time > 1000ms (p95)
- Error rate > 1%
- Database connection pool exhausted
- Disk usage > 85%
- Unauthorized access attempts > 10/minute
- Failed login attempts > 5/minute from single IP

#### 10.5.3 Logging Levels

```
ERROR:   Errors requiring immediate attention
WARN:    Potential issues, degraded performance
INFO:    Important business events (PHI access)
DEBUG:   Detailed diagnostic information
TRACE:   Very detailed diagnostic information
```

### 10.6 Request Tracing

Every request receives a unique `requestId`:

```http
X-Request-ID: req_abc123xyz
```

This ID is:
- Included in all logs
- Returned in API responses
- Used for distributed tracing
- Available for support troubleshooting

---

## 11. Migration Plan

### 11.1 Current State Analysis

**Current Implementation (As-Is):**
- Hapi.js framework with JWT authentication
- Mixed route patterns (`/api/health-records/student/{studentId}` vs `/api/students/{studentId}/health-records`)
- Inconsistent response formats
- No versioning
- Limited pagination support
- Basic error handling
- Missing HATEOAS links
- No rate limiting
- Incomplete audit logging

### 11.2 Migration Strategy

#### Phase 1: Foundation (Weeks 1-2)

**Goals:**
- Implement API versioning (`/api/v1`)
- Standardize response envelope
- Improve error handling
- Add request ID tracking

**Tasks:**
1. Create new `/api/v1` route prefix
2. Implement standard response wrapper middleware
3. Create comprehensive error code enum
4. Add request ID middleware
5. Update all existing routes to new format
6. Deploy side-by-side with legacy routes

**Breaking Changes:** None (both versions operational)

#### Phase 2: Resource Restructuring (Weeks 3-4)

**Goals:**
- Implement proper resource hierarchy
- Add HATEOAS links
- Improve pagination
- Add filtering and sorting

**Tasks:**
1. Create new student-centric routes (`/api/v1/students/{studentId}/health-records`)
2. Implement HATEOAS link generation
3. Add cursor-based pagination option
4. Implement advanced filtering
5. Add field selection (sparse fieldsets)
6. Update frontend to use new endpoints

**Breaking Changes:** URL structure changes (handled by v1 prefix)

#### Phase 3: Security Enhancements (Weeks 5-6)

**Goals:**
- Implement comprehensive audit logging
- Add rate limiting
- Enhance RBAC
- Implement data encryption

**Tasks:**
1. Create audit log service
2. Implement rate limiting middleware
3. Add granular permission checks
4. Implement field-level encryption for sensitive data
5. Add security headers middleware
6. Implement break-the-glass access

**Breaking Changes:** None (security enhancements)

#### Phase 4: HIPAA Compliance (Weeks 7-8)

**Goals:**
- Complete HIPAA compliance requirements
- Data minimization
- Access restrictions
- Retention policies

**Tasks:**
1. Implement minimum necessary access controls
2. Add data retention policies
3. Create PHI access logging
4. Implement soft delete with recovery
5. Add export/purge functionality
6. Complete HIPAA compliance documentation

**Breaking Changes:** None (compliance enhancements)

#### Phase 5: Performance & Monitoring (Weeks 9-10)

**Goals:**
- Implement health check endpoints
- Add performance monitoring
- Create comprehensive documentation
- Load testing and optimization

**Tasks:**
1. Create health check endpoints
2. Implement Prometheus metrics
3. Add distributed tracing (OpenTelemetry)
4. Generate OpenAPI specification
5. Create Swagger UI documentation
6. Perform load testing
7. Optimize database queries
8. Implement caching strategy

**Breaking Changes:** None (monitoring enhancements)

#### Phase 6: Legacy Deprecation (Weeks 11-12)

**Goals:**
- Deprecate old API routes
- Complete frontend migration
- Remove legacy code

**Tasks:**
1. Add deprecation warnings to old routes
2. Update all clients to v1 API
3. Monitor usage of deprecated endpoints
4. Remove legacy routes after migration complete
5. Clean up unused code
6. Update documentation

**Breaking Changes:** Legacy routes removed (after migration period)

### 11.3 Rollback Plan

Each phase includes rollback capability:

1. **Feature Flags:** Enable/disable new features without deployment
2. **Blue-Green Deployment:** Run old and new versions simultaneously
3. **Database Migrations:** Reversible migrations with down scripts
4. **Client Compatibility:** Support both old and new APIs during transition

### 11.4 Testing Strategy

#### 11.4.1 Unit Tests
- Controller validation
- Service logic
- Error handling
- Authentication/authorization

#### 11.4.2 Integration Tests
- End-to-end API workflows
- Database interactions
- External service integrations

#### 11.4.3 Security Tests
- Authentication bypass attempts
- Authorization escalation
- SQL injection
- XSS attacks
- Rate limiting

#### 11.4.4 Performance Tests
- Load testing (1000 concurrent users)
- Stress testing (system limits)
- Endurance testing (24-hour sustained load)

#### 11.4.5 HIPAA Compliance Tests
- Audit log verification
- Access control validation
- Encryption verification
- Data retention compliance

### 11.5 Documentation Updates

1. **API Documentation:**
   - Complete OpenAPI specification
   - Interactive Swagger UI
   - Code examples for all endpoints
   - Authentication guide

2. **Developer Guide:**
   - Getting started tutorial
   - Authentication setup
   - Error handling guide
   - Best practices

3. **Operations Guide:**
   - Deployment procedures
   - Monitoring setup
   - Troubleshooting guide
   - Disaster recovery

4. **Compliance Documentation:**
   - HIPAA compliance evidence
   - Security controls documentation
   - Audit procedures
   - Data handling policies

### 11.6 Success Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| API Response Time (p95) | 250ms | 150ms | Phase 5 |
| Error Rate | 2% | <0.5% | Phase 5 |
| HIPAA Audit Coverage | 60% | 100% | Phase 4 |
| API Documentation Coverage | 40% | 100% | Phase 5 |
| Test Coverage | 65% | 85% | Phase 6 |
| Uptime | 99.5% | 99.9% | Phase 5 |

---

## 12. Example Request Flows

### 12.1 Create Health Record with Audit Trail

**Request:**
```http
POST /api/v1/health-records HTTP/1.1
Host: api.whitecross.health
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
X-Request-ID: req_abc123xyz
X-Client-Version: 1.2.3

{
  "studentId": "clx0987654321",
  "type": "CHECKUP",
  "date": "2024-01-20T09:30:00Z",
  "description": "Annual physical examination",
  "provider": "Dr. Sarah Johnson",
  "vital": {
    "temperature": 98.6,
    "bloodPressureSystolic": 110,
    "bloodPressureDiastolic": 70,
    "heartRate": 72,
    "height": 151.0,
    "weight": 45.5
  },
  "notes": "Student is healthy and active"
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json
X-Request-ID: req_abc123xyz
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95

{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "type": "CHECKUP",
    "date": "2024-01-20T09:30:00Z",
    "description": "Annual physical examination",
    "provider": "Dr. Sarah Johnson",
    "vital": {
      "temperature": 98.6,
      "bloodPressureSystolic": 110,
      "bloodPressureDiastolic": 70,
      "heartRate": 72,
      "height": 151.0,
      "weight": 45.5,
      "bmi": 19.9
    },
    "notes": "Student is healthy and active",
    "createdAt": "2024-01-20T09:35:00Z",
    "updatedAt": "2024-01-20T09:35:00Z",
    "student": {
      "id": "clx0987654321",
      "firstName": "John",
      "lastName": "Doe",
      "studentNumber": "S12345"
    },
    "_links": {
      "self": {
        "href": "/api/v1/health-records/clx1234567890"
      },
      "student": {
        "href": "/api/v1/students/clx0987654321"
      }
    }
  },
  "timestamp": "2024-01-20T09:35:00Z",
  "requestId": "req_abc123xyz"
}
```

**Audit Log Entry (Automatic):**
```json
{
  "timestamp": "2024-01-20T09:35:00Z",
  "userId": "clx9999999999",
  "userRole": "NURSE",
  "action": "CREATE",
  "resource": "health-records",
  "resourceId": "clx1234567890",
  "studentId": "clx0987654321",
  "success": true,
  "ipAddress": "192.168.1.100",
  "userAgent": "WhiteCross-Web/1.2.3",
  "schoolId": "clx1122334455",
  "districtId": "clx2233445566",
  "requestId": "req_abc123xyz",
  "changes": {
    "action": "created",
    "data": { ... }
  }
}
```

### 12.2 Search with Pagination

**Request:**
```http
GET /api/v1/health-records/search?q=diabetes&type=CHECKUP&page=2&limit=20 HTTP/1.1
Host: api.whitecross.health
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
X-Request-ID: req_def456uvw
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87

{
  "success": true,
  "data": {
    "records": [ ... ]
  },
  "meta": {
    "pagination": {
      "page": 2,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": true
    },
    "_links": {
      "self": {
        "href": "/api/v1/health-records/search?q=diabetes&type=CHECKUP&page=2&limit=20"
      },
      "first": {
        "href": "/api/v1/health-records/search?q=diabetes&type=CHECKUP&page=1&limit=20"
      },
      "previous": {
        "href": "/api/v1/health-records/search?q=diabetes&type=CHECKUP&page=1&limit=20"
      },
      "next": {
        "href": "/api/v1/health-records/search?q=diabetes&type=CHECKUP&page=3&limit=20"
      },
      "last": {
        "href": "/api/v1/health-records/search?q=diabetes&type=CHECKUP&page=3&limit=20"
      }
    }
  },
  "timestamp": "2024-01-20T14:30:00Z",
  "requestId": "req_def456uvw"
}
```

---

## 13. OpenAPI Specification Example

```yaml
openapi: 3.0.3
info:
  title: White Cross Health Records API
  version: 1.0.0
  description: |
    Enterprise-grade HIPAA-compliant API for managing student health records
    in K-12 school environments.
  contact:
    name: White Cross API Support
    email: api-support@whitecross.health
  license:
    name: Proprietary

servers:
  - url: https://api.whitecross.health/v1
    description: Production server
  - url: https://api-staging.whitecross.health/v1
    description: Staging server
  - url: http://localhost:3001/api/v1
    description: Development server

security:
  - bearerAuth: []

paths:
  /health-records:
    post:
      summary: Create health record
      operationId: createHealthRecord
      tags:
        - Health Records
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateHealthRecordRequest'
      responses:
        '201':
          description: Health record created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HealthRecordResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '422':
          $ref: '#/components/responses/ValidationError'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    HealthRecord:
      type: object
      required:
        - id
        - studentId
        - type
        - date
        - description
      properties:
        id:
          type: string
          format: cuid
          example: clx1234567890
        studentId:
          type: string
          format: cuid
        type:
          $ref: '#/components/schemas/HealthRecordType'
        date:
          type: string
          format: date-time
        description:
          type: string
          minLength: 10
          maxLength: 500
        provider:
          type: string
          nullable: true
        vital:
          $ref: '#/components/schemas/VitalSigns'
        notes:
          type: string
          nullable: true
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    HealthRecordType:
      type: string
      enum:
        - CHECKUP
        - VACCINATION
        - ILLNESS
        - INJURY
        - SCREENING
        - PHYSICAL_EXAM
        - MENTAL_HEALTH
        - DENTAL
        - VISION
        - HEARING

    VitalSigns:
      type: object
      properties:
        temperature:
          type: number
          format: float
        bloodPressureSystolic:
          type: integer
        bloodPressureDiastolic:
          type: integer
        heartRate:
          type: integer
        respiratoryRate:
          type: integer
        oxygenSaturation:
          type: integer
        height:
          type: number
          format: float
        weight:
          type: number
          format: float
        bmi:
          type: number
          format: float

  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
```

---

## Appendix A: HTTP Status Code Quick Reference

| Status | Name | Use Case |
|--------|------|----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Malformed request |
| 401 | Unauthorized | Authentication failed |
| 403 | Forbidden | Permission denied |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service down |

## Appendix B: Common Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | integer | Page number | 1 |
| limit | integer | Items per page | 20 |
| sortBy | string | Field to sort by | - |
| sortOrder | string | asc or desc | desc |
| fields | string | Comma-separated fields | all |
| dateFrom | string | Start date (ISO 8601) | - |
| dateTo | string | End date (ISO 8601) | - |
| q | string | Search query | - |

## Appendix C: Security Best Practices

1. **Always use HTTPS** - Never transmit PHI over HTTP
2. **Validate all inputs** - Never trust client data
3. **Use parameterized queries** - Prevent SQL injection
4. **Implement rate limiting** - Prevent abuse
5. **Log all PHI access** - HIPAA requirement
6. **Encrypt sensitive data** - At rest and in transit
7. **Use strong authentication** - JWT with short expiration
8. **Implement RBAC** - Principle of least privilege
9. **Sanitize outputs** - Prevent XSS
10. **Keep dependencies updated** - Regular security patches

---

**Document Version:** 1.0
**Last Updated:** 2024-01-20
**Author:** Enterprise API Architecture Team
**Classification:** Internal Use Only

---

This specification provides a comprehensive, SOA-compliant, HIPAA-ready REST API architecture for the White Cross Health Records module. Implementation should follow the migration plan with careful attention to security, compliance, and data protection requirements.
