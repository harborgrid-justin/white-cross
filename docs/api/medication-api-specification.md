# Medication Management REST API Specification v1.0

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [SOA-Compliant Architecture](#soa-compliant-architecture)
4. [API Resource Design](#api-resource-design)
5. [Endpoint Specifications](#endpoint-specifications)
6. [Security & Compliance](#security--compliance)
7. [Error Handling](#error-handling)
8. [Migration Strategy](#migration-strategy)
9. [OpenAPI 3.0 Specification](#openapi-30-specification)

---

## Executive Summary

This document specifies a Service-Oriented Architecture (SOA) compliant REST API for the White Cross healthcare platform's medication management module. The API handles life-critical medication administration workflows and must meet stringent HIPAA compliance, controlled substance tracking, and patient safety requirements.

**Critical Safety Statement:** This API manages controlled substances and medication administration where errors can be life-threatening. All endpoints implement comprehensive validation, audit trails, and the Five Rights of medication administration (Right patient, medication, dose, route, time).

---

## Current State Analysis

### Existing Implementation Issues

#### 1. **Resource Mixing** (Lines 270-718)
Current implementation mixes multiple resource concerns in a single route file:
- Medication formulary (system catalog)
- Prescriptions (student-specific assignments)
- Administration logs (actual medication given)
- Inventory management (stock tracking)
- Reminders (scheduling)
- Adverse reactions (safety events)

**Impact:** Violates Single Responsibility Principle, difficult to version independently, unclear resource boundaries.

#### 2. **Business Logic in Handlers** (Lines 48-49, 72, 130, 149-150)
Date parsing and business logic scattered in route handlers:
```typescript
// Line 48-49: Date transformation in handler
startDate: new Date(request.payload.startDate),
endDate: request.payload.endDate ? new Date(request.payload.endDate) : undefined

// Line 72, 130: Type coercion in handlers
timeGiven: new Date(request.payload.timeGiven)
expirationDate: new Date(request.payload.expirationDate)
```

**Impact:** Violates separation of concerns, inconsistent validation, difficult to test.

#### 3. **Inconsistent HTTP Method Usage**
- PUT used for deactivation (line 585) - should be PATCH or POST
- Missing idempotency considerations for critical operations
- No support for bulk operations

#### 4. **Missing Safety Validations**
- No contraindication checking against allergies
- No double-witness requirement for controlled substances
- Limited barcode scanning integration
- No duplicate administration prevention

#### 5. **Frontend-Backend Misalignment**
Frontend expects different endpoint structure:
- `medicationsApi.ts` calls `/medications/administer` (line 288)
- Backend implements `/medications/administration` (line 381)

---

## SOA-Compliant Architecture

### Design Principles

1. **Resource-Oriented Design**: Each resource has clear boundaries and responsibilities
2. **Stateless Operations**: No server-side session state for medication operations
3. **Idempotent Safety Operations**: Critical operations can be safely retried
4. **HATEOAS Links**: Responses include navigation links for workflow guidance
5. **API Versioning**: URI-based versioning (/api/v1/) for backward compatibility
6. **Microservice Ready**: Resources can be extracted to separate services

### Resource Hierarchy

```
/api/v1/
├── medications/                    # Medication Formulary Service
│   ├── {id}
│   ├── search
│   └── controlled-substances
├── prescriptions/                  # Prescription Management Service
│   ├── {id}
│   ├── students/{studentId}/prescriptions
│   └── {id}/contraindications
├── administrations/                # Administration Tracking Service
│   ├── {id}
│   ├── batch
│   ├── verify
│   └── students/{studentId}/administrations
├── inventory/                      # Inventory Management Service
│   ├── {id}
│   ├── medications/{medicationId}/stock
│   ├── alerts
│   ├── expiring
│   └── batches/{batchNumber}
├── adverse-reactions/              # Safety Event Reporting Service
│   ├── {id}
│   ├── prescriptions/{prescriptionId}/reactions
│   └── medications/{medicationId}/reactions
├── schedules/                      # Medication Scheduling Service
│   ├── daily
│   ├── students/{studentId}/schedule
│   └── nurses/{nurseId}/schedule
└── controlled-substances/          # DEA Compliance Service
    ├── {id}/audit-trail
    ├── witness-log
    └── reports/dea
```

---

## API Resource Design

### 1. Medication Formulary Resource

**Purpose**: System-wide medication catalog (NDC-registered medications available for prescription)

**Data Model Mapping**: `Medication` table (schema.prisma lines 94-111)

**Key Attributes**:
- Medication catalog information (NDC, name, strength, form)
- Controlled substance classification
- Manufacturer data

**Design Decisions**:
- Read-heavy resource (medications rarely change)
- Aggressive caching (ETags, Cache-Control headers)
- Full-text search capability
- Separate endpoint for controlled substances due to special access requirements

---

### 2. Prescription Resource

**Purpose**: Student-specific medication assignments (prescription orders)

**Data Model Mapping**: `StudentMedication` table (schema.prisma lines 113-134)

**Key Attributes**:
- Links student to medication from formulary
- Dosage, frequency, route, instructions
- Prescription validity period (startDate, endDate)
- Prescriber information

**Design Decisions**:
- Must validate against allergies before creation
- Supports nested routes under students (RESTful parent-child)
- Activation/deactivation as state transitions (not deletion)
- Contraindication checking endpoint before prescription creation

---

### 3. Administration Resource

**Purpose**: Individual medication administration events (actual doses given)

**Data Model Mapping**: `MedicationLog` table (schema.prisma lines 136-152)

**Key Attributes**:
- References prescription (not medication directly)
- Actual dosage given, time administered
- Nurse who administered
- Side effects, notes

**Design Decisions**:
- **Idempotent POST**: Use client-generated idempotency keys to prevent duplicate administrations
- Batch administration endpoint for multiple students
- Pre-administration verification endpoint (Five Rights check)
- Cannot be deleted (immutable audit trail), only annotated

---

### 4. Inventory Resource

**Purpose**: Physical medication stock tracking

**Data Model Mapping**: `MedicationInventory` table (schema.prisma lines 154-170)

**Key Attributes**:
- Batch numbers, expiration dates
- Current quantity, reorder levels
- Cost tracking for budget management

**Design Decisions**:
- Supports batch-level tracking (not just medication-level)
- Alert endpoints for low stock, expiring, expired
- Transaction log for all quantity changes (audit trail)
- Integration point for barcode scanning

---

### 5. Adverse Reaction Resource

**Purpose**: Safety event reporting for medication reactions

**Data Model Mapping**: `IncidentReport` with type='ALLERGIC_REACTION' (schema.prisma lines 539-572)

**Key Attributes**:
- Linked to specific prescription
- Severity classification (MILD, MODERATE, SEVERE, LIFE_THREATENING)
- Clinical description, actions taken
- Mandatory reporting for SEVERE and LIFE_THREATENING

**Design Decisions**:
- Separate resource (not nested) for cross-medication analysis
- Triggers automatic allergy record creation
- Integrates with external pharmacovigilance systems
- Requires witness for SEVERE/LIFE_THREATENING reports

---

### 6. Schedule Resource

**Purpose**: Medication administration scheduling and reminders

**Data Model Mapping**: Derived from `StudentMedication` + frequency parsing (medicationService.ts lines 557-639)

**Key Attributes**:
- Scheduled administration times
- Status (PENDING, COMPLETED, MISSED)
- Student and medication details

**Design Decisions**:
- Computed resource (not persisted separately)
- Supports nurse-specific schedules
- Daily and date-range views
- Real-time status based on administration logs

---

### 7. Controlled Substance Resource

**Purpose**: DEA-compliant tracking for Schedule II-V medications

**Key Attributes**:
- Witness requirements
- Double-count verification
- Disposal documentation
- DEA reporting formats

**Design Decisions**:
- Separate resource for compliance isolation
- Enhanced audit trail (all access logged)
- Special authentication (two-factor for high-schedule substances)
- Integration with state PDMP (Prescription Drug Monitoring Program)

---

## Endpoint Specifications

### Base URL
```
https://api.whitecross.health/api/v1
```

### Standard Response Format

All responses follow this structure:

```typescript
{
  "success": boolean,
  "data": T | T[] | PaginatedData<T>,
  "meta": {
    "timestamp": "2025-10-10T14:32:15.234Z",
    "requestId": "req_abc123xyz",
    "version": "1.0"
  },
  "links": {
    "self": "/api/v1/resource",
    "related": { ... }  // HATEOAS links
  },
  "error": {  // Only present on errors
    "code": "MED_ERROR_CODE",
    "message": "Human-readable message",
    "details": { ... },
    "traceId": "trace_xyz789"
  }
}
```

---

## 1. Medication Formulary Endpoints

### 1.1 List Medications

```http
GET /api/v1/medications
```

**Purpose**: Retrieve system medication formulary with filtering and search

**Query Parameters**:
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20, max: 100): Items per page
- `search` (string): Full-text search on name, genericName, manufacturer
- `isControlled` (boolean): Filter controlled substances
- `dosageForm` (enum): Filter by form (tablet, liquid, injection, etc.)
- `sort` (string, default: "name"): Sort field
- `order` (enum: asc|desc, default: "asc"): Sort direction

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "med_abc123",
        "name": "Ibuprofen",
        "genericName": "Ibuprofen",
        "strength": "200mg",
        "dosageForm": "tablet",
        "ndc": "12345-678-90",
        "manufacturer": "Generic Pharma Inc.",
        "isControlled": false,
        "createdAt": "2025-01-15T08:00:00Z",
        "updatedAt": "2025-01-15T08:00:00Z",
        "_count": {
          "activePrescriptions": 45
        },
        "inventory": {
          "totalQuantity": 500,
          "hasLowStock": false,
          "hasExpiringSoon": false
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrevious": false
    }
  },
  "links": {
    "self": "/api/v1/medications?page=1&limit=20",
    "next": "/api/v1/medications?page=2&limit=20",
    "first": "/api/v1/medications?page=1&limit=20",
    "last": "/api/v1/medications?page=8&limit=20"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: Missing or invalid authentication
- `429 Too Many Requests`: Rate limit exceeded

**Authentication**: Required (JWT)
**Permissions**: `medications:read`
**Rate Limit**: 100 requests/minute
**Audit**: PHI access logged

---

### 1.2 Get Medication Details

```http
GET /api/v1/medications/{id}
```

**Purpose**: Retrieve detailed information for a specific medication

**Path Parameters**:
- `id` (string, required): Medication ID

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "med_abc123",
    "name": "Methylphenidate ER",
    "genericName": "Methylphenidate Extended Release",
    "strength": "18mg",
    "dosageForm": "capsule",
    "ndc": "54092-422-60",
    "manufacturer": "Actavis Pharma",
    "isControlled": true,
    "deaSchedule": "II",
    "createdAt": "2025-01-15T08:00:00Z",
    "updatedAt": "2025-01-15T08:00:00Z",
    "inventory": [
      {
        "id": "inv_xyz789",
        "batchNumber": "LOT2025A001",
        "expirationDate": "2026-12-31",
        "quantity": 120,
        "reorderLevel": 30,
        "supplier": "Cardinal Health"
      }
    ],
    "_count": {
      "activePrescriptions": 12,
      "totalAdministrations": 2450,
      "adverseReactions": 0
    },
    "warnings": {
      "hasActiveRecalls": false,
      "requiresWitness": true,
      "requiresRefrigeration": false
    }
  },
  "links": {
    "self": "/api/v1/medications/med_abc123",
    "prescriptions": "/api/v1/prescriptions?medicationId=med_abc123",
    "inventory": "/api/v1/inventory/medications/med_abc123/stock",
    "adverseReactions": "/api/v1/adverse-reactions?medicationId=med_abc123"
  }
}
```

**Error Responses**:
- `404 Not Found`: Medication does not exist
- `401 Unauthorized`: Missing or invalid authentication

**Authentication**: Required (JWT)
**Permissions**: `medications:read`
**Audit**: PHI access logged

---

### 1.3 Create Medication

```http
POST /api/v1/medications
```

**Purpose**: Add new medication to system formulary

**Request Body**:
```json
{
  "name": "Albuterol Sulfate",
  "genericName": "Albuterol Sulfate",
  "strength": "90mcg/actuation",
  "dosageForm": "inhaler",
  "manufacturer": "GSK",
  "ndc": "00173-0682-20",
  "isControlled": false,
  "deaSchedule": null,
  "warnings": ["Shake well before use", "Rinse mouth after use"],
  "contraindications": ["Tachycardia", "Hypersensitivity to albuterol"]
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "med_new456",
    "name": "Albuterol Sulfate",
    "genericName": "Albuterol Sulfate",
    "strength": "90mcg/actuation",
    "dosageForm": "inhaler",
    "ndc": "00173-0682-20",
    "manufacturer": "GSK",
    "isControlled": false,
    "createdAt": "2025-10-10T14:32:15Z"
  },
  "links": {
    "self": "/api/v1/medications/med_new456",
    "update": "/api/v1/medications/med_new456",
    "addInventory": "/api/v1/inventory"
  }
}
```

**Validation Rules**:
- `name`: Required, 1-200 characters
- `strength`: Required, valid strength format (e.g., "500mg", "10ml")
- `dosageForm`: Required, must be valid enum value
- `ndc`: Optional, must be unique if provided (11-digit NDC format)
- `isControlled`: If true, `deaSchedule` is required

**Error Responses**:
- `400 Bad Request`: Validation errors
- `409 Conflict`: Medication with same name/strength/form exists or NDC conflict
- `403 Forbidden`: Insufficient permissions (requires NURSE or ADMIN role)

**Authentication**: Required (JWT)
**Permissions**: `medications:create` (NURSE, ADMIN only)
**Idempotency**: Not supported (use GET to check existence first)
**Audit**: Creation logged with user details

---

### 1.4 Update Medication

```http
PUT /api/v1/medications/{id}
```

**Purpose**: Update medication formulary entry

**Request Body**: Partial update supported
```json
{
  "manufacturer": "Updated Manufacturer Inc.",
  "warnings": ["Updated warning list"]
}
```

**Response**: `200 OK` (same structure as Create)

**Important**: Cannot change `name`, `strength`, or `dosageForm` (create new medication instead)

**Error Responses**:
- `400 Bad Request`: Attempting to change immutable fields
- `404 Not Found`: Medication not found
- `403 Forbidden`: Insufficient permissions

**Authentication**: Required (JWT)
**Permissions**: `medications:update` (ADMIN only)
**Audit**: All changes logged with before/after values

---

### 1.5 Search Medications

```http
GET /api/v1/medications/search
```

**Purpose**: Full-text search across medication formulary

**Query Parameters**:
- `q` (string, required): Search query
- `fields` (array[string]): Fields to search (name, genericName, manufacturer, ndc)
- `limit` (integer, max: 50): Results limit

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "med_abc123",
        "name": "Ibuprofen",
        "strength": "200mg",
        "dosageForm": "tablet",
        "relevanceScore": 0.95,
        "matchedFields": ["name", "genericName"]
      }
    ],
    "query": "ibuprofen",
    "totalResults": 3,
    "executionTimeMs": 45
  }
}
```

**Use Case**: Autocomplete for prescription creation, medication lookup

**Authentication**: Required (JWT)
**Permissions**: `medications:read`
**Rate Limit**: 200 requests/minute (higher limit for search)

---

## 2. Prescription Endpoints

### 2.1 Create Prescription

```http
POST /api/v1/prescriptions
```

**Purpose**: Assign medication to student (create prescription order)

**Request Body**:
```json
{
  "studentId": "stu_xyz789",
  "medicationId": "med_abc123",
  "dosage": "200mg",
  "frequency": "twice daily",
  "route": "oral",
  "startDate": "2025-10-10",
  "endDate": "2025-11-10",
  "prescribedBy": "Dr. Sarah Johnson",
  "prescriptionNumber": "RX123456789",
  "instructions": "Take with food. Do not exceed 3200mg per day.",
  "contraindications": {
    "checkAllergies": true,
    "checkInteractions": true
  }
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "prx_new123",
    "studentId": "stu_xyz789",
    "medicationId": "med_abc123",
    "dosage": "200mg",
    "frequency": "twice daily",
    "route": "oral",
    "startDate": "2025-10-10",
    "endDate": "2025-11-10",
    "prescribedBy": "Dr. Sarah Johnson",
    "prescriptionNumber": "RX123456789",
    "isActive": true,
    "createdAt": "2025-10-10T14:32:15Z",
    "student": {
      "id": "stu_xyz789",
      "firstName": "John",
      "lastName": "Doe",
      "grade": "5"
    },
    "medication": {
      "id": "med_abc123",
      "name": "Ibuprofen",
      "strength": "200mg",
      "dosageForm": "tablet"
    },
    "safetyChecks": {
      "allergyCheck": "PASS",
      "interactionCheck": "PASS",
      "contraindications": []
    }
  },
  "links": {
    "self": "/api/v1/prescriptions/prx_new123",
    "student": "/api/v1/students/stu_xyz789",
    "medication": "/api/v1/medications/med_abc123",
    "administer": "/api/v1/administrations",
    "schedule": "/api/v1/schedules/students/stu_xyz789/schedule"
  }
}
```

**Validation & Safety Checks**:
1. **Student Validation**: Student must exist and be active
2. **Medication Validation**: Medication must exist in formulary
3. **Allergy Check**: Automatic check against student's allergy records
4. **Interaction Check**: Check for interactions with other active prescriptions
5. **Duplicate Prevention**: Reject if active prescription exists for same medication
6. **Controlled Substance**: If controlled, verify prescriber DEA number

**Error Responses**:
- `400 Bad Request`: Validation failure
- `409 Conflict`: Active prescription already exists
- `422 Unprocessable Entity`: Safety check failure (allergies, interactions)

**Error Example - Allergy Conflict**:
```json
{
  "success": false,
  "error": {
    "code": "ALLERGY_CONTRAINDICATION",
    "message": "Cannot prescribe: student has documented allergy",
    "details": {
      "allergen": "Ibuprofen",
      "severity": "MODERATE",
      "reaction": "Hives, difficulty breathing",
      "documentedDate": "2024-03-15"
    },
    "override": {
      "allowed": false,
      "requiresPhysicianApproval": true
    }
  }
}
```

**Authentication**: Required (JWT)
**Permissions**: `prescriptions:create` (NURSE, ADMIN)
**Idempotency**: Supported via `Idempotency-Key` header
**Audit**: Prescription creation logged with full details

---

### 2.2 Get Student Prescriptions

```http
GET /api/v1/prescriptions/students/{studentId}/prescriptions
```

**Purpose**: List all prescriptions for a student

**Path Parameters**:
- `studentId` (string, required): Student ID

**Query Parameters**:
- `status` (enum: active|inactive|all, default: active)
- `includeExpired` (boolean, default: false)
- `sort` (string, default: "startDate")
- `order` (enum: asc|desc, default: "desc")

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "stu_xyz789",
      "firstName": "John",
      "lastName": "Doe",
      "allergies": [
        {
          "allergen": "Penicillin",
          "severity": "SEVERE"
        }
      ]
    },
    "prescriptions": [
      {
        "id": "prx_abc123",
        "medication": {
          "name": "Methylphenidate ER",
          "strength": "18mg",
          "isControlled": true
        },
        "dosage": "18mg",
        "frequency": "once daily",
        "route": "oral",
        "startDate": "2025-09-01",
        "endDate": null,
        "isActive": true,
        "lastAdministered": "2025-10-10T08:30:00Z",
        "adherenceRate": 0.95,
        "missedDoses": 3
      }
    ],
    "summary": {
      "totalActive": 2,
      "totalInactive": 5,
      "hasControlledSubstances": true,
      "nextScheduledDose": "2025-10-11T08:00:00Z"
    }
  }
}
```

**Authentication**: Required (JWT)
**Permissions**: `prescriptions:read` + student access verification
**Audit**: PHI access logged
**Cache**: Private, max-age=60 (1 minute)

---

### 2.3 Check Contraindications

```http
POST /api/v1/prescriptions/contraindications/check
```

**Purpose**: Pre-prescription safety validation

**Request Body**:
```json
{
  "studentId": "stu_xyz789",
  "medicationId": "med_abc123",
  "dosage": "200mg"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "safe": false,
    "checks": {
      "allergyCheck": {
        "status": "WARNING",
        "findings": [
          {
            "type": "ALLERGY",
            "severity": "MODERATE",
            "allergen": "Ibuprofen",
            "reaction": "Hives, rash",
            "override": "PHYSICIAN_REQUIRED"
          }
        ]
      },
      "interactionCheck": {
        "status": "PASS",
        "findings": []
      },
      "conditionCheck": {
        "status": "WARNING",
        "findings": [
          {
            "type": "CHRONIC_CONDITION",
            "condition": "Asthma",
            "concern": "NSAIDs may trigger bronchospasm",
            "severity": "MODERATE",
            "override": "MONITORING_REQUIRED"
          }
        ]
      },
      "dosageCheck": {
        "status": "PASS",
        "maximumDailyDose": "3200mg",
        "proposedDose": "400mg/day",
        "within safe limits": true
      }
    },
    "recommendation": "CONSULT_PHYSICIAN",
    "alternativeMedications": [
      {
        "id": "med_def456",
        "name": "Acetaminophen",
        "reason": "Lower allergy risk profile"
      }
    ]
  }
}
```

**Use Case**: Called before prescription creation to preview safety issues

**Authentication**: Required (JWT)
**Permissions**: `prescriptions:validate`
**Rate Limit**: 50 requests/minute

---

### 2.4 Deactivate Prescription

```http
PATCH /api/v1/prescriptions/{id}/deactivate
```

**Purpose**: Discontinue a prescription (soft delete, preserves history)

**Request Body**:
```json
{
  "reason": "COMPLETED",
  "notes": "Treatment course completed successfully",
  "effectiveDate": "2025-10-10"
}
```

**Reason Codes**:
- `COMPLETED`: Treatment course finished
- `ADVERSE_REACTION`: Safety concern
- `PHYSICIAN_ORDER`: Doctor discontinued
- `PARENT_REQUEST`: Parent/guardian requested
- `STUDENT_TRANSFER`: Student left school
- `OTHER`: Specify in notes

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "prx_abc123",
    "isActive": false,
    "deactivatedAt": "2025-10-10T14:32:15Z",
    "deactivatedBy": {
      "id": "usr_nurse01",
      "name": "Nurse Jane Smith"
    },
    "deactivationReason": "COMPLETED",
    "endDate": "2025-10-10"
  }
}
```

**Important**: Deactivation does not delete historical administration records

**Error Responses**:
- `404 Not Found`: Prescription not found
- `400 Bad Request`: Prescription already inactive

**Authentication**: Required (JWT)
**Permissions**: `prescriptions:update`
**Audit**: Deactivation logged with reason

---

## 3. Administration Endpoints

### 3.1 Log Medication Administration

```http
POST /api/v1/administrations
```

**Purpose**: Record that a medication was administered to a student

**Request Headers**:
- `Idempotency-Key` (string, required): Client-generated unique key to prevent duplicates

**Request Body**:
```json
{
  "prescriptionId": "prx_abc123",
  "dosageGiven": "18mg",
  "timeGiven": "2025-10-10T08:30:00Z",
  "notes": "Student took medication without issue",
  "sideEffects": null,
  "verification": {
    "method": "BARCODE_SCAN",
    "studentBarcode": "STU_XYZ789_SCAN",
    "medicationBarcode": "MED_ABC123_BATCH_2025A",
    "fiveRightsChecked": true
  },
  "witness": {
    "required": false,
    "witnessId": null
  }
}
```

**Five Rights Verification**:
The API enforces the Five Rights of medication administration:
1. **Right Patient**: Verified via `studentBarcode` or manual confirmation
2. **Right Medication**: Verified via `medicationBarcode` matching prescription
3. **Right Dose**: `dosageGiven` must match prescription `dosage`
4. **Right Route**: Inherited from prescription
5. **Right Time**: `timeGiven` must be within acceptable window

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "adm_new789",
    "prescriptionId": "prx_abc123",
    "dosageGiven": "18mg",
    "timeGiven": "2025-10-10T08:30:00Z",
    "administeredBy": {
      "id": "usr_nurse01",
      "name": "Nurse Jane Smith"
    },
    "student": {
      "id": "stu_xyz789",
      "name": "John Doe",
      "grade": "5"
    },
    "medication": {
      "name": "Methylphenidate ER",
      "strength": "18mg",
      "isControlled": true
    },
    "verification": {
      "method": "BARCODE_SCAN",
      "fiveRightsChecked": true,
      "verifiedAt": "2025-10-10T08:30:00Z"
    },
    "createdAt": "2025-10-10T08:30:15Z"
  },
  "links": {
    "self": "/api/v1/administrations/adm_new789",
    "prescription": "/api/v1/prescriptions/prx_abc123",
    "student": "/api/v1/students/stu_xyz789",
    "reportAdverseReaction": "/api/v1/adverse-reactions"
  }
}
```

**Validation Rules**:
1. **Prescription Active**: Prescription must be active and current
2. **Dosage Match**: `dosageGiven` must match prescription dosage (±10% tolerance)
3. **Time Window**: `timeGiven` must be within scheduled time ± 2 hours
4. **Duplicate Prevention**: Idempotency-Key prevents duplicate logging
5. **Controlled Substance**: If controlled, additional witness may be required

**Error Responses**:
- `400 Bad Request`: Validation failure
- `409 Conflict`: Duplicate administration (idempotency key already used)
- `422 Unprocessable Entity`: Five Rights validation failure

**Error Example - Dosage Mismatch**:
```json
{
  "success": false,
  "error": {
    "code": "DOSAGE_MISMATCH",
    "message": "Dosage given does not match prescription",
    "details": {
      "prescribedDosage": "18mg",
      "givenDosage": "36mg",
      "variance": "100%",
      "allowedVariance": "10%"
    },
    "safetyAction": "ADMINISTRATION_BLOCKED",
    "recommendation": "Verify dosage with physician or update prescription"
  }
}
```

**Authentication**: Required (JWT)
**Permissions**: `administrations:create` (NURSE only)
**Idempotency**: Required via header
**Audit**: All administrations logged permanently (immutable)
**Rate Limit**: 30 requests/minute (prevents rapid-fire duplicate attempts)

---

### 3.2 Verify Before Administration

```http
POST /api/v1/administrations/verify
```

**Purpose**: Pre-administration safety check (Five Rights verification)

**Request Body**:
```json
{
  "prescriptionId": "prx_abc123",
  "studentBarcode": "STU_XYZ789",
  "medicationBarcode": "MED_ABC123_BATCH_2025A",
  "proposedDosage": "18mg",
  "proposedTime": "2025-10-10T08:30:00Z"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "verified": true,
    "fiveRights": {
      "rightPatient": {
        "status": "VERIFIED",
        "studentName": "John Doe",
        "studentId": "stu_xyz789",
        "barcodeMatched": true
      },
      "rightMedication": {
        "status": "VERIFIED",
        "medicationName": "Methylphenidate ER",
        "medicationId": "med_abc123",
        "barcodeMatched": true,
        "batchNumber": "LOT2025A001"
      },
      "rightDose": {
        "status": "VERIFIED",
        "prescribedDose": "18mg",
        "proposedDose": "18mg",
        "match": true
      },
      "rightRoute": {
        "status": "VERIFIED",
        "prescribedRoute": "oral"
      },
      "rightTime": {
        "status": "VERIFIED",
        "scheduledTime": "2025-10-10T08:00:00Z",
        "proposedTime": "2025-10-10T08:30:00Z",
        "withinWindow": true,
        "windowMinutes": 120
      }
    },
    "warnings": [
      {
        "type": "CONTROLLED_SUBSTANCE",
        "message": "This is a Schedule II medication. Witness may be required.",
        "severity": "INFO"
      }
    ],
    "alerts": [],
    "recentAdministration": {
      "exists": true,
      "lastAdministered": "2025-10-09T08:15:00Z",
      "hoursAgo": 24.25,
      "safeToAdminister": true
    },
    "proceedWithAdministration": true
  }
}
```

**Use Case**: Called immediately before administration to catch errors

**Authentication**: Required (JWT)
**Permissions**: `administrations:verify`
**Rate Limit**: 100 requests/minute

---

### 3.3 Batch Administration

```http
POST /api/v1/administrations/batch
```

**Purpose**: Log multiple medication administrations at once (e.g., morning medication round)

**Request Body**:
```json
{
  "administrations": [
    {
      "prescriptionId": "prx_abc123",
      "dosageGiven": "18mg",
      "timeGiven": "2025-10-10T08:30:00Z",
      "idempotencyKey": "batch_001_prx_abc123"
    },
    {
      "prescriptionId": "prx_def456",
      "dosageGiven": "200mg",
      "timeGiven": "2025-10-10T08:32:00Z",
      "idempotencyKey": "batch_001_prx_def456"
    }
  ]
}
```

**Response**: `207 Multi-Status`
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "prescriptionId": "prx_abc123",
        "status": "SUCCESS",
        "administrationId": "adm_new789",
        "statusCode": 201
      },
      {
        "prescriptionId": "prx_def456",
        "status": "ERROR",
        "error": {
          "code": "PRESCRIPTION_INACTIVE",
          "message": "Prescription is no longer active"
        },
        "statusCode": 400
      }
    ],
    "summary": {
      "total": 2,
      "successful": 1,
      "failed": 1
    }
  }
}
```

**Important**: Batch operations are atomic per-item (not transaction-atomic). Each administration succeeds or fails independently.

**Authentication**: Required (JWT)
**Permissions**: `administrations:create`
**Rate Limit**: 10 requests/minute (lower limit for batch)

---

### 3.4 Get Student Administration History

```http
GET /api/v1/administrations/students/{studentId}/administrations
```

**Purpose**: Retrieve medication administration history for a student

**Path Parameters**:
- `studentId` (string, required)

**Query Parameters**:
- `startDate` (ISO 8601 date): Filter by date range
- `endDate` (ISO 8601 date): Filter by date range
- `prescriptionId` (string): Filter by specific prescription
- `page` (integer, default: 1)
- `limit` (integer, default: 20, max: 100)

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "stu_xyz789",
      "name": "John Doe"
    },
    "administrations": [
      {
        "id": "adm_abc123",
        "medication": {
          "name": "Methylphenidate ER",
          "strength": "18mg"
        },
        "dosageGiven": "18mg",
        "timeGiven": "2025-10-10T08:30:00Z",
        "administeredBy": "Nurse Jane Smith",
        "notes": null,
        "sideEffects": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 145,
      "totalPages": 8
    },
    "summary": {
      "totalAdministrations": 145,
      "adherenceRate": 0.95,
      "missedDoses": 8,
      "dateRange": {
        "start": "2025-09-01",
        "end": "2025-10-10"
      }
    }
  }
}
```

**Authentication**: Required (JWT)
**Permissions**: `administrations:read` + student access
**Audit**: PHI access logged
**Cache**: Private, max-age=300 (5 minutes)

---

## 4. Inventory Endpoints

### 4.1 Add Medication to Inventory

```http
POST /api/v1/inventory
```

**Purpose**: Record new medication stock received

**Request Body**:
```json
{
  "medicationId": "med_abc123",
  "batchNumber": "LOT2025A001",
  "expirationDate": "2026-12-31",
  "quantity": 500,
  "reorderLevel": 50,
  "costPerUnit": 0.25,
  "supplier": "Cardinal Health",
  "receivedDate": "2025-10-10",
  "purchaseOrderNumber": "PO-2025-1234"
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "inv_new123",
    "medicationId": "med_abc123",
    "medication": {
      "name": "Ibuprofen",
      "strength": "200mg"
    },
    "batchNumber": "LOT2025A001",
    "expirationDate": "2026-12-31",
    "quantity": 500,
    "reorderLevel": 50,
    "costPerUnit": 0.25,
    "totalValue": 125.00,
    "supplier": "Cardinal Health",
    "createdAt": "2025-10-10T14:32:15Z"
  },
  "links": {
    "self": "/api/v1/inventory/inv_new123",
    "medication": "/api/v1/medications/med_abc123",
    "adjustQuantity": "/api/v1/inventory/inv_new123/adjust"
  }
}
```

**Authentication**: Required (JWT)
**Permissions**: `inventory:create` (NURSE, ADMIN)
**Audit**: Inventory addition logged

---

### 4.2 Get Inventory Alerts

```http
GET /api/v1/inventory/alerts
```

**Purpose**: Retrieve low stock, expiring, and expired medication alerts

**Query Parameters**:
- `alertType` (enum: low_stock|expiring|expired|all, default: all)
- `daysUntilExpiry` (integer, default: 30): Days threshold for "expiring soon"

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalAlerts": 12,
      "lowStock": 5,
      "expiringSoon": 4,
      "expired": 3,
      "criticalCount": 3
    },
    "alerts": {
      "expired": [
        {
          "id": "inv_exp001",
          "medication": {
            "name": "Acetaminophen",
            "strength": "500mg"
          },
          "batchNumber": "LOT2024B015",
          "expirationDate": "2025-09-30",
          "quantity": 50,
          "daysExpired": 10,
          "action": "DISPOSE",
          "priority": "CRITICAL"
        }
      ],
      "expiringSoon": [
        {
          "id": "inv_exp002",
          "medication": {
            "name": "Albuterol Sulfate",
            "strength": "90mcg"
          },
          "batchNumber": "LOT2025C042",
          "expirationDate": "2025-11-15",
          "quantity": 12,
          "daysUntilExpiry": 36,
          "action": "USE_FIRST",
          "priority": "HIGH"
        }
      ],
      "lowStock": [
        {
          "id": "inv_low001",
          "medication": {
            "name": "Methylphenidate ER",
            "strength": "18mg",
            "isControlled": true
          },
          "currentQuantity": 15,
          "reorderLevel": 30,
          "averageDailyUsage": 2.5,
          "daysRemaining": 6,
          "action": "REORDER",
          "priority": "CRITICAL",
          "suggestedOrderQuantity": 120
        }
      ]
    }
  }
}
```

**Use Case**: Dashboard alerts, automated reorder notifications

**Authentication**: Required (JWT)
**Permissions**: `inventory:read`
**Cache**: Private, max-age=600 (10 minutes)

---

### 4.3 Adjust Inventory Quantity

```http
PATCH /api/v1/inventory/{id}/adjust
```

**Purpose**: Adjust inventory quantity (corrections, disposal, transfers)

**Request Body**:
```json
{
  "adjustment": -10,
  "reason": "DISPOSED",
  "notes": "Expired medication disposed per protocol",
  "witnessId": "usr_nurse02"
}
```

**Reason Codes**:
- `DISPOSED`: Expired or damaged medication disposed
- `ADMINISTERED`: Quantity reduced due to administration
- `CORRECTION`: Inventory count correction
- `TRANSFER`: Transferred to another location
- `DAMAGED`: Damaged or unusable
- `THEFT`: Stolen medication (triggers security incident)

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "inv_abc123",
    "previousQuantity": 50,
    "adjustment": -10,
    "newQuantity": 40,
    "reason": "DISPOSED",
    "adjustedBy": {
      "id": "usr_nurse01",
      "name": "Nurse Jane Smith"
    },
    "witnessedBy": {
      "id": "usr_nurse02",
      "name": "Nurse Bob Wilson"
    },
    "adjustedAt": "2025-10-10T14:32:15Z"
  }
}
```

**Important**: All adjustments create audit trail entries. Controlled substance adjustments require witness.

**Authentication**: Required (JWT)
**Permissions**: `inventory:update`
**Audit**: All adjustments logged permanently

---

### 4.4 Get Medication Stock

```http
GET /api/v1/inventory/medications/{medicationId}/stock
```

**Purpose**: Get all inventory batches for a specific medication

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "medication": {
      "id": "med_abc123",
      "name": "Ibuprofen",
      "strength": "200mg"
    },
    "batches": [
      {
        "id": "inv_batch001",
        "batchNumber": "LOT2025A001",
        "expirationDate": "2026-12-31",
        "quantity": 450,
        "status": "AVAILABLE"
      },
      {
        "id": "inv_batch002",
        "batchNumber": "LOT2024B015",
        "expirationDate": "2025-09-30",
        "quantity": 50,
        "status": "EXPIRED"
      }
    ],
    "summary": {
      "totalQuantity": 500,
      "availableQuantity": 450,
      "expiredQuantity": 50,
      "numberOfBatches": 2,
      "oldestExpirationDate": "2025-09-30",
      "newestExpirationDate": "2026-12-31",
      "totalValue": 125.00
    }
  }
}
```

**Authentication**: Required (JWT)
**Permissions**: `inventory:read`

---

## 5. Adverse Reaction Endpoints

### 5.1 Report Adverse Reaction

```http
POST /api/v1/adverse-reactions
```

**Purpose**: Document adverse medication reaction or side effect

**Request Body**:
```json
{
  "prescriptionId": "prx_abc123",
  "administrationId": "adm_xyz789",
  "severity": "MODERATE",
  "reaction": "Hives and itching on arms and torso",
  "symptoms": ["Hives", "Itching", "Mild swelling"],
  "onsetTime": "2025-10-10T09:15:00Z",
  "actionTaken": "Administered antihistamine (Benadryl 25mg). Parent contacted. Student monitored for 2 hours.",
  "parentNotified": true,
  "parentNotificationTime": "2025-10-10T09:20:00Z",
  "physicianNotified": true,
  "physicianName": "Dr. Sarah Johnson",
  "studentResponse": "Symptoms resolved after 90 minutes",
  "followUpRequired": true,
  "requiresWitness": true,
  "witnessId": "usr_nurse02"
}
```

**Severity Levels**:
- `MILD`: Minor discomfort, no intervention needed
- `MODERATE`: Requires intervention, parent notification
- `SEVERE`: Significant symptoms, physician notification required
- `LIFE_THREATENING`: Emergency response, 911 called

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "adr_new456",
    "prescriptionId": "prx_abc123",
    "student": {
      "id": "stu_xyz789",
      "name": "John Doe"
    },
    "medication": {
      "id": "med_abc123",
      "name": "Ibuprofen",
      "strength": "200mg"
    },
    "severity": "MODERATE",
    "reaction": "Hives and itching on arms and torso",
    "reportedBy": {
      "id": "usr_nurse01",
      "name": "Nurse Jane Smith"
    },
    "reportedAt": "2025-10-10T09:15:00Z",
    "incidentReportId": "inc_report_789",
    "allergyRecordCreated": true,
    "prescriptionDeactivated": false,
    "actions": {
      "parentNotified": true,
      "physicianNotified": true,
      "emergencyServicesContacted": false,
      "allergyAdded": true
    }
  },
  "links": {
    "self": "/api/v1/adverse-reactions/adr_new456",
    "incidentReport": "/api/v1/incident-reports/inc_report_789",
    "prescription": "/api/v1/prescriptions/prx_abc123",
    "allergyRecord": "/api/v1/students/stu_xyz789/allergies/alg_new123"
  }
}
```

**Automated Actions**:
1. **MODERATE or higher**: Creates incident report automatically
2. **SEVERE or LIFE_THREATENING**: Notifies school administration
3. **All severities**: Creates or updates student allergy record
4. **LIFE_THREATENING**: Deactivates prescription automatically

**Error Responses**:
- `400 Bad Request`: Validation failure
- `422 Unprocessable Entity`: Missing required witness for SEVERE/LIFE_THREATENING

**Authentication**: Required (JWT)
**Permissions**: `adverse-reactions:create` (NURSE, ADMIN)
**Audit**: All adverse reactions logged permanently

---

### 5.2 Get Adverse Reactions

```http
GET /api/v1/adverse-reactions
```

**Purpose**: Retrieve adverse reaction reports with filtering

**Query Parameters**:
- `medicationId` (string): Filter by medication
- `studentId` (string): Filter by student
- `severity` (enum): Filter by severity level
- `startDate` (ISO 8601): Date range filter
- `endDate` (ISO 8601): Date range filter
- `page` (integer, default: 1)
- `limit` (integer, default: 20)

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "reactions": [
      {
        "id": "adr_abc123",
        "student": {
          "id": "stu_xyz789",
          "name": "John Doe"
        },
        "medication": {
          "name": "Ibuprofen",
          "strength": "200mg"
        },
        "severity": "MODERATE",
        "reaction": "Hives and itching",
        "reportedBy": "Nurse Jane Smith",
        "reportedAt": "2025-10-10T09:15:00Z",
        "resolved": true,
        "resolutionTime": "2025-10-10T11:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 8,
      "totalPages": 1
    },
    "summary": {
      "total": 8,
      "byMedication": {
        "Ibuprofen": 3,
        "Amoxicillin": 2,
        "Other": 3
      },
      "bySeverity": {
        "MILD": 4,
        "MODERATE": 3,
        "SEVERE": 1,
        "LIFE_THREATENING": 0
      }
    }
  }
}
```

**Authentication**: Required (JWT)
**Permissions**: `adverse-reactions:read`
**Audit**: PHI access logged

---

### 5.3 Get Medication Adverse Reaction History

```http
GET /api/v1/adverse-reactions/medications/{medicationId}/reactions
```

**Purpose**: Get adverse reaction history for a medication (safety analysis)

**Response**: Includes statistical analysis for medication safety monitoring

**Authentication**: Required (JWT)
**Permissions**: `adverse-reactions:read`

---

## 6. Schedule Endpoints

### 6.1 Get Daily Medication Schedule

```http
GET /api/v1/schedules/daily
```

**Purpose**: Get today's medication administration schedule

**Query Parameters**:
- `date` (ISO 8601 date, default: today)
- `nurseId` (string): Filter by nurse
- `status` (enum: pending|completed|missed|all, default: all)

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "date": "2025-10-10",
    "schedules": [
      {
        "time": "08:00",
        "medications": [
          {
            "id": "sch_abc123",
            "student": {
              "id": "stu_xyz789",
              "name": "John Doe",
              "grade": "5",
              "photo": "url_to_photo"
            },
            "medication": {
              "name": "Methylphenidate ER",
              "strength": "18mg",
              "isControlled": true
            },
            "prescriptionId": "prx_abc123",
            "dosage": "18mg",
            "route": "oral",
            "status": "COMPLETED",
            "administeredAt": "2025-10-10T08:05:00Z",
            "administeredBy": "Nurse Jane Smith"
          }
        ]
      },
      {
        "time": "12:00",
        "medications": [
          {
            "id": "sch_def456",
            "student": {
              "id": "stu_abc456",
              "name": "Jane Smith",
              "grade": "7"
            },
            "medication": {
              "name": "Albuterol Sulfate",
              "strength": "90mcg"
            },
            "prescriptionId": "prx_def456",
            "dosage": "2 puffs",
            "route": "inhaled",
            "status": "PENDING",
            "scheduledTime": "2025-10-10T12:00:00Z"
          }
        ]
      }
    ],
    "summary": {
      "totalScheduled": 15,
      "completed": 8,
      "pending": 5,
      "missed": 2,
      "completionRate": 0.53,
      "controlledSubstances": 3
    }
  }
}
```

**Use Case**: Nurse daily workflow, administration tracking

**Authentication**: Required (JWT)
**Permissions**: `schedules:read`
**Cache**: Private, max-age=60 (1 minute, real-time updates)

---

### 6.2 Get Student Schedule

```http
GET /api/v1/schedules/students/{studentId}/schedule
```

**Purpose**: Get medication schedule for a specific student

**Query Parameters**:
- `startDate` (ISO 8601 date): Date range start
- `endDate` (ISO 8601 date): Date range end
- `includeCompleted` (boolean, default: false)

**Response**: Includes student's full medication schedule with adherence metrics

**Authentication**: Required (JWT)
**Permissions**: `schedules:read` + student access

---

## 7. Controlled Substance Endpoints

### 7.1 Get Controlled Substance Audit Trail

```http
GET /api/v1/controlled-substances/{prescriptionId}/audit-trail
```

**Purpose**: DEA-compliant audit trail for controlled substances

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "prescription": {
      "id": "prx_abc123",
      "medication": {
        "name": "Methylphenidate ER",
        "deaSchedule": "II"
      },
      "student": "John Doe",
      "prescriptionNumber": "RX123456789"
    },
    "auditTrail": [
      {
        "id": "audit_001",
        "action": "PRESCRIPTION_CREATED",
        "performedBy": "Nurse Jane Smith",
        "timestamp": "2025-09-01T08:00:00Z",
        "details": {
          "dosage": "18mg",
          "quantity": 30,
          "prescriber": "Dr. Sarah Johnson",
          "deaNumber": "BJ1234563"
        }
      },
      {
        "id": "audit_002",
        "action": "MEDICATION_ADMINISTERED",
        "performedBy": "Nurse Jane Smith",
        "timestamp": "2025-09-02T08:15:00Z",
        "witness": "Nurse Bob Wilson",
        "details": {
          "dosageGiven": "18mg",
          "remainingQuantity": 29
        }
      }
    ],
    "summary": {
      "totalActions": 42,
      "quantityPrescribed": 30,
      "quantityAdministered": 28,
      "quantityRemaining": 2,
      "discrepancies": 0
    }
  }
}
```

**Authentication**: Required (JWT)
**Permissions**: `controlled-substances:read` (elevated permission)
**Audit**: All access logged

---

### 7.2 Log Controlled Substance Witness

```http
POST /api/v1/controlled-substances/witness-log
```

**Purpose**: Record witness verification for controlled substance administration

**Request Body**:
```json
{
  "administrationId": "adm_abc123",
  "witnessId": "usr_nurse02",
  "verificationMethod": "DOUBLE_COUNT",
  "preAdministrationCount": 30,
  "postAdministrationCount": 29,
  "discrepancy": false,
  "notes": "Count verified, no discrepancies"
}
```

**Response**: `201 Created`

**Use Case**: Required for Schedule II medications

**Authentication**: Required (JWT)
**Permissions**: `controlled-substances:witness`

---

### 7.3 Generate DEA Report

```http
GET /api/v1/controlled-substances/reports/dea
```

**Purpose**: Generate DEA compliance report

**Query Parameters**:
- `startDate` (ISO 8601 date, required)
- `endDate` (ISO 8601 date, required)
- `deaSchedule` (enum: II|III|IV|V)
- `format` (enum: json|pdf|csv, default: json)

**Response**: DEA-compliant report format

**Authentication**: Required (JWT)
**Permissions**: `controlled-substances:report` (ADMIN only)

---

## Security & Compliance

### Authentication

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

**Token Claims**:
```json
{
  "userId": "usr_nurse01",
  "email": "jane.smith@school.edu",
  "role": "NURSE",
  "permissions": ["medications:read", "prescriptions:create", ...],
  "exp": 1728576735
}
```

### Authorization Levels

| Permission | Description | Roles |
|------------|-------------|-------|
| `medications:read` | View medication formulary | ALL |
| `medications:create` | Add medications to formulary | NURSE, ADMIN |
| `prescriptions:create` | Create prescriptions | NURSE, ADMIN |
| `prescriptions:read` | View prescriptions | NURSE, ADMIN, VIEWER |
| `administrations:create` | Log medication administration | NURSE |
| `administrations:read` | View administration logs | NURSE, ADMIN, VIEWER |
| `inventory:create` | Add inventory | NURSE, ADMIN |
| `inventory:update` | Adjust inventory | NURSE, ADMIN |
| `adverse-reactions:create` | Report reactions | NURSE, ADMIN |
| `controlled-substances:read` | Access controlled substance data | NURSE, ADMIN |
| `controlled-substances:witness` | Act as witness | NURSE |

### HIPAA Compliance

**PHI Protection**:
1. All endpoints accessing student data are PHI-protected
2. Access logged to `AuditLog` table
3. Minimum necessary standard enforced
4. Encrypted in transit (TLS 1.3)
5. Encrypted at rest (AES-256)

**Audit Logging**:
```typescript
{
  "userId": "usr_nurse01",
  "action": "READ",
  "entityType": "Prescription",
  "entityId": "prx_abc123",
  "timestamp": "2025-10-10T14:32:15Z",
  "ipAddress": "192.168.1.100",
  "userAgent": "White Cross App v1.0"
}
```

### Rate Limiting

| Endpoint Type | Rate Limit | Window |
|---------------|------------|--------|
| Read operations | 100 req/min | Per user |
| Write operations | 30 req/min | Per user |
| Administration logging | 30 req/min | Per user |
| Batch operations | 10 req/min | Per user |
| Search | 200 req/min | Per user |

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1728576800
```

### Idempotency

Critical operations support idempotency via `Idempotency-Key` header:
- Administration logging
- Prescription creation
- Adverse reaction reporting

**Idempotency Key Format**: Client-generated UUID or unique string
**Storage**: 24-hour retention of idempotency keys

### CORS Configuration

```
Access-Control-Allow-Origin: https://app.whitecross.health
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type, Idempotency-Key
Access-Control-Max-Age: 86400
```

---

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Specific field with error",
      "value": "Invalid value"
    },
    "traceId": "trace_abc123xyz",
    "timestamp": "2025-10-10T14:32:15Z",
    "help": "https://docs.whitecross.health/errors/ERROR_CODE"
  },
  "meta": {
    "requestId": "req_abc123xyz"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 207 | Multi-Status | Batch operations with mixed results |
| 400 | Bad Request | Validation error, malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate resource, idempotency violation |
| 422 | Unprocessable Entity | Valid syntax but semantic error (safety check failure) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Maintenance mode, database down |

### Medication-Specific Error Codes

```typescript
// Prescription Errors
ALLERGY_CONTRAINDICATION       // Student has documented allergy
DRUG_INTERACTION               // Interaction with existing prescription
DUPLICATE_PRESCRIPTION         // Active prescription already exists
INVALID_DOSAGE                 // Dosage outside safe range
PRESCRIPTION_INACTIVE          // Prescription no longer active
PRESCRIPTION_EXPIRED           // Prescription past end date

// Administration Errors
DOSAGE_MISMATCH                // Given dosage doesn't match prescription
OUTSIDE_TIME_WINDOW            // Administration time outside acceptable window
DUPLICATE_ADMINISTRATION       // Idempotency key already used
FIVE_RIGHTS_FAILURE            // One of Five Rights checks failed
BARCODE_MISMATCH               // Scanned barcode doesn't match expected
WITNESS_REQUIRED               // Controlled substance requires witness
STUDENT_NOT_PRESENT            // Student not available for administration

// Inventory Errors
INSUFFICIENT_STOCK             // Not enough medication in inventory
BATCH_EXPIRED                  // Medication batch has expired
INVALID_BATCH_NUMBER           // Batch number not found

// Safety Errors
ADVERSE_REACTION_REPORTED      // Previous adverse reaction on file
HIGH_RISK_MEDICATION           // Special protocols required
CONTROLLED_SUBSTANCE_VIOLATION // DEA compliance issue
```

### Error Example - Allergy Contraindication

```json
{
  "success": false,
  "error": {
    "code": "ALLERGY_CONTRAINDICATION",
    "message": "Cannot prescribe medication due to documented allergy",
    "details": {
      "studentId": "stu_xyz789",
      "studentName": "John Doe",
      "medicationId": "med_abc123",
      "medicationName": "Ibuprofen",
      "allergen": "Ibuprofen",
      "allergySeverity": "MODERATE",
      "allergyReaction": "Hives, difficulty breathing",
      "allergyDocumentedDate": "2024-03-15",
      "allergyVerifiedBy": "Dr. Sarah Johnson"
    },
    "safetyAction": "PRESCRIPTION_BLOCKED",
    "override": {
      "allowed": false,
      "reason": "Cannot override documented moderate or severe allergies",
      "recommendedAction": "Consult physician for alternative medication"
    },
    "alternatives": [
      {
        "medicationId": "med_def456",
        "name": "Acetaminophen",
        "strength": "500mg",
        "reason": "Lower allergy risk, similar indication"
      }
    ]
  }
}
```

---

## Migration Strategy

### Phase 1: Parallel Operation (Weeks 1-4)

**Objective**: Deploy new API alongside existing implementation

1. **Deploy new endpoints** with `/api/v1/` prefix
2. **Maintain existing endpoints** at `/api/` (no version)
3. **Dual writes**: Write to both old and new data structures
4. **Frontend gradual migration**: Update one component at a time

**Success Criteria**:
- New API handling 25% of traffic
- Zero data inconsistencies
- Response time < 200ms (p95)

### Phase 2: Frontend Migration (Weeks 5-8)

**Objective**: Migrate frontend to use new API exclusively

**Migration Order**:
1. Medication formulary (read-only, lowest risk)
2. Inventory management (lower risk)
3. Schedules and reminders (moderate risk)
4. Prescriptions (higher risk)
5. Administrations (highest risk - requires thorough testing)

**Frontend Changes Required**:

**Current**: `frontend/src/services/modules/medicationsApi.ts`
```typescript
// OLD - Line 288
async logAdministration(logData: LogAdministrationRequest) {
  const response = await apiInstance.post<ApiResponse<MedicationAdministration>>(
    `${API_ENDPOINTS.MEDICATIONS.BASE}/administer`,
    logData
  );
}
```

**New**:
```typescript
async logAdministration(logData: LogAdministrationRequest) {
  const idempotencyKey = `admin_${logData.studentMedicationId}_${logData.scheduledTime}`;

  const response = await apiInstance.post<ApiResponse<MedicationAdministration>>(
    '/api/v1/administrations',
    {
      prescriptionId: logData.studentMedicationId, // Rename field
      dosageGiven: logData.dosage,
      timeGiven: logData.scheduledTime,
      notes: logData.notes,
      verification: {
        method: 'MANUAL',
        fiveRightsChecked: true
      }
    },
    {
      headers: {
        'Idempotency-Key': idempotencyKey
      }
    }
  );
}
```

**Success Criteria**:
- All frontend components using v1 API
- Zero regression in functionality
- Improved error messages from new error codes

### Phase 3: Data Migration (Weeks 9-10)

**Objective**: Migrate historical data to new structure

**Database Changes**:
- No schema changes required (new endpoints use existing tables)
- Add indexes for new query patterns
- Populate computed fields (e.g., adherence metrics)

**Prisma Migration**:
```sql
-- Add indexes for new query patterns
CREATE INDEX idx_medication_logs_prescription ON medication_logs(student_medication_id, time_given);
CREATE INDEX idx_student_medications_active ON student_medications(is_active, start_date, end_date);
CREATE INDEX idx_inventory_expiration ON medication_inventory(expiration_date, quantity);
```

### Phase 4: Deprecate Old API (Weeks 11-12)

**Objective**: Remove old endpoints

1. **Week 11**: Add deprecation warnings to old endpoints
   ```json
   {
     "deprecated": true,
     "deprecationDate": "2025-12-01",
     "migrationGuide": "https://docs.whitecross.health/migration/v1",
     "newEndpoint": "/api/v1/administrations"
   }
   ```

2. **Week 12**: Remove old endpoints from codebase

**Rollback Plan**:
- Keep old code in separate branch for 30 days
- Feature flags to re-enable old endpoints if needed
- Database rollback scripts prepared

---

## OpenAPI 3.0 Specification

### Complete OpenAPI Schema

```yaml
openapi: 3.0.3
info:
  title: White Cross Medication Management API
  description: |
    Enterprise-grade REST API for school nurse medication management.

    **CRITICAL SAFETY NOTICE**: This API handles controlled substances and
    medication administration where errors can be life-threatening. All operations
    are subject to strict validation and audit requirements.

    ## Key Features
    - HIPAA-compliant medication tracking
    - DEA-compliant controlled substance management
    - Five Rights medication administration validation
    - Comprehensive audit trails
    - Adverse reaction reporting
    - Real-time inventory management

  version: 1.0.0
  contact:
    name: White Cross API Support
    email: api-support@whitecross.health
    url: https://docs.whitecross.health
  license:
    name: Proprietary
    url: https://whitecross.health/license

servers:
  - url: https://api.whitecross.health/api/v1
    description: Production server
  - url: https://api-staging.whitecross.health/api/v1
    description: Staging server
  - url: http://localhost:3001/api/v1
    description: Local development server

security:
  - bearerAuth: []

tags:
  - name: Medications
    description: Medication formulary management
  - name: Prescriptions
    description: Student prescription management
  - name: Administrations
    description: Medication administration tracking
  - name: Inventory
    description: Medication inventory management
  - name: Adverse Reactions
    description: Safety event reporting
  - name: Schedules
    description: Medication scheduling
  - name: Controlled Substances
    description: DEA-compliant controlled substance tracking

paths:
  /medications:
    get:
      tags:
        - Medications
      summary: List medications
      description: Retrieve medication formulary with filtering and pagination
      operationId: getMedications
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        - name: search
          in: query
          schema:
            type: string
          description: Full-text search on name, genericName, manufacturer
        - name: isControlled
          in: query
          schema:
            type: boolean
        - name: dosageForm
          in: query
          schema:
            type: string
            enum: [tablet, capsule, liquid, injection, inhaler, topical, drops]
      responses:
        '200':
          description: Medications retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MedicationListResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/TooManyRequests'
      security:
        - bearerAuth: []

    post:
      tags:
        - Medications
      summary: Create medication
      description: Add new medication to system formulary
      operationId: createMedication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateMedicationRequest'
      responses:
        '201':
          description: Medication created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MedicationResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          $ref: '#/components/responses/Conflict'
      security:
        - bearerAuth: []

  /medications/{id}:
    get:
      tags:
        - Medications
      summary: Get medication details
      operationId: getMedicationById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Medication details retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MedicationDetailResponse'
        '404':
          $ref: '#/components/responses/NotFound'

  /prescriptions:
    post:
      tags:
        - Prescriptions
      summary: Create prescription
      description: Assign medication to student with safety validations
      operationId: createPrescription
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePrescriptionRequest'
      responses:
        '201':
          description: Prescription created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PrescriptionResponse'
        '409':
          description: Duplicate prescription or conflict
        '422':
          description: Safety check failure (allergy, interaction)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AllergyContraindication'

  /administrations:
    post:
      tags:
        - Administrations
      summary: Log medication administration
      description: |
        Record medication administration with Five Rights validation.

        **IMPORTANT**: This endpoint requires an idempotency key to prevent
        duplicate administrations. Use a client-generated UUID.
      operationId: logAdministration
      parameters:
        - name: Idempotency-Key
          in: header
          required: true
          schema:
            type: string
          description: Client-generated unique key to prevent duplicates
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LogAdministrationRequest'
      responses:
        '201':
          description: Administration logged successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AdministrationResponse'
        '409':
          description: Duplicate administration (idempotency key reused)
        '422':
          description: Five Rights validation failure
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DosageMismatchError'

  /administrations/verify:
    post:
      tags:
        - Administrations
      summary: Verify before administration
      description: Pre-administration Five Rights safety check
      operationId: verifyAdministration
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/VerifyAdministrationRequest'
      responses:
        '200':
          description: Verification results
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/VerificationResponse'

  /inventory:
    post:
      tags:
        - Inventory
      summary: Add medication to inventory
      operationId: addInventory
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AddInventoryRequest'
      responses:
        '201':
          description: Inventory added successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/InventoryResponse'

  /inventory/alerts:
    get:
      tags:
        - Inventory
      summary: Get inventory alerts
      description: Retrieve low stock, expiring, and expired alerts
      operationId: getInventoryAlerts
      parameters:
        - name: alertType
          in: query
          schema:
            type: string
            enum: [low_stock, expiring, expired, all]
            default: all
      responses:
        '200':
          description: Alerts retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/InventoryAlertsResponse'

  /adverse-reactions:
    post:
      tags:
        - Adverse Reactions
      summary: Report adverse reaction
      description: Document medication adverse reaction or side effect
      operationId: reportAdverseReaction
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReportAdverseReactionRequest'
      responses:
        '201':
          description: Adverse reaction reported
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AdverseReactionResponse'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token obtained from authentication endpoint

  schemas:
    # Medication Schemas
    Medication:
      type: object
      properties:
        id:
          type: string
          example: "med_abc123"
        name:
          type: string
          example: "Ibuprofen"
        genericName:
          type: string
          example: "Ibuprofen"
        strength:
          type: string
          example: "200mg"
        dosageForm:
          type: string
          enum: [tablet, capsule, liquid, injection, inhaler, topical, drops]
        ndc:
          type: string
          example: "12345-678-90"
        manufacturer:
          type: string
          example: "Generic Pharma Inc."
        isControlled:
          type: boolean
        deaSchedule:
          type: string
          enum: [II, III, IV, V]
          nullable: true
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    CreateMedicationRequest:
      type: object
      required:
        - name
        - strength
        - dosageForm
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 200
        genericName:
          type: string
        strength:
          type: string
          pattern: '^[0-9]+(mg|mcg|g|ml|units?).*$'
        dosageForm:
          type: string
          enum: [tablet, capsule, liquid, injection, inhaler, topical, drops]
        manufacturer:
          type: string
        ndc:
          type: string
          pattern: '^\d{5}-\d{3,4}-\d{1,2}$'
        isControlled:
          type: boolean
        deaSchedule:
          type: string
          enum: [II, III, IV, V]

    MedicationListResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            items:
              type: array
              items:
                $ref: '#/components/schemas/Medication'
            pagination:
              $ref: '#/components/schemas/Pagination'
        links:
          $ref: '#/components/schemas/HAL_Links'

    # Prescription Schemas
    CreatePrescriptionRequest:
      type: object
      required:
        - studentId
        - medicationId
        - dosage
        - frequency
        - route
        - startDate
        - prescribedBy
      properties:
        studentId:
          type: string
        medicationId:
          type: string
        dosage:
          type: string
        frequency:
          type: string
          example: "twice daily"
        route:
          type: string
          enum: [oral, topical, inhaled, injection, rectal, nasal]
        startDate:
          type: string
          format: date
        endDate:
          type: string
          format: date
          nullable: true
        prescribedBy:
          type: string
        prescriptionNumber:
          type: string
        instructions:
          type: string

    PrescriptionResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            id:
              type: string
            studentId:
              type: string
            medicationId:
              type: string
            dosage:
              type: string
            frequency:
              type: string
            route:
              type: string
            isActive:
              type: boolean
            safetyChecks:
              type: object
              properties:
                allergyCheck:
                  type: string
                  enum: [PASS, WARNING, FAIL]
                interactionCheck:
                  type: string
                  enum: [PASS, WARNING, FAIL]

    # Administration Schemas
    LogAdministrationRequest:
      type: object
      required:
        - prescriptionId
        - dosageGiven
        - timeGiven
      properties:
        prescriptionId:
          type: string
        dosageGiven:
          type: string
        timeGiven:
          type: string
          format: date-time
        notes:
          type: string
        verification:
          type: object
          properties:
            method:
              type: string
              enum: [BARCODE_SCAN, MANUAL, RFID]
            fiveRightsChecked:
              type: boolean

    AdministrationResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            id:
              type: string
            prescriptionId:
              type: string
            dosageGiven:
              type: string
            timeGiven:
              type: string
              format: date-time
            administeredBy:
              type: object
              properties:
                id:
                  type: string
                name:
                  type: string

    VerifyAdministrationRequest:
      type: object
      required:
        - prescriptionId
        - proposedDosage
        - proposedTime
      properties:
        prescriptionId:
          type: string
        studentBarcode:
          type: string
        medicationBarcode:
          type: string
        proposedDosage:
          type: string
        proposedTime:
          type: string
          format: date-time

    VerificationResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            verified:
              type: boolean
            fiveRights:
              type: object
              properties:
                rightPatient:
                  $ref: '#/components/schemas/RightCheck'
                rightMedication:
                  $ref: '#/components/schemas/RightCheck'
                rightDose:
                  $ref: '#/components/schemas/RightCheck'
                rightRoute:
                  $ref: '#/components/schemas/RightCheck'
                rightTime:
                  $ref: '#/components/schemas/RightCheck'

    RightCheck:
      type: object
      properties:
        status:
          type: string
          enum: [VERIFIED, WARNING, FAILED]
        details:
          type: object

    # Inventory Schemas
    AddInventoryRequest:
      type: object
      required:
        - medicationId
        - batchNumber
        - expirationDate
        - quantity
      properties:
        medicationId:
          type: string
        batchNumber:
          type: string
        expirationDate:
          type: string
          format: date
        quantity:
          type: integer
          minimum: 1
        reorderLevel:
          type: integer
          minimum: 0
        costPerUnit:
          type: number
          format: decimal
        supplier:
          type: string

    InventoryResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            id:
              type: string
            medicationId:
              type: string
            batchNumber:
              type: string
            quantity:
              type: integer

    InventoryAlertsResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            summary:
              type: object
              properties:
                totalAlerts:
                  type: integer
                lowStock:
                  type: integer
                expiringSoon:
                  type: integer
                expired:
                  type: integer
            alerts:
              type: object

    # Adverse Reaction Schemas
    ReportAdverseReactionRequest:
      type: object
      required:
        - prescriptionId
        - severity
        - reaction
        - actionTaken
      properties:
        prescriptionId:
          type: string
        administrationId:
          type: string
        severity:
          type: string
          enum: [MILD, MODERATE, SEVERE, LIFE_THREATENING]
        reaction:
          type: string
        symptoms:
          type: array
          items:
            type: string
        actionTaken:
          type: string
        parentNotified:
          type: boolean
        physicianNotified:
          type: boolean

    AdverseReactionResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            id:
              type: string
            severity:
              type: string
            incidentReportId:
              type: string

    # Error Schemas
    Error:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: object
            traceId:
              type: string

    AllergyContraindication:
      allOf:
        - $ref: '#/components/schemas/Error'
        - type: object
          properties:
            error:
              type: object
              properties:
                code:
                  type: string
                  example: "ALLERGY_CONTRAINDICATION"
                details:
                  type: object
                  properties:
                    allergen:
                      type: string
                    severity:
                      type: string
                    reaction:
                      type: string

    DosageMismatchError:
      allOf:
        - $ref: '#/components/schemas/Error'
        - type: object
          properties:
            error:
              type: object
              properties:
                code:
                  type: string
                  example: "DOSAGE_MISMATCH"
                details:
                  type: object
                  properties:
                    prescribedDosage:
                      type: string
                    givenDosage:
                      type: string
                    variance:
                      type: string

    # Common Schemas
    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        totalPages:
          type: integer
        hasNext:
          type: boolean
        hasPrevious:
          type: boolean

    HAL_Links:
      type: object
      properties:
        self:
          type: string
          format: uri
        next:
          type: string
          format: uri
        prev:
          type: string
          format: uri
        first:
          type: string
          format: uri
        last:
          type: string
          format: uri

  responses:
    BadRequest:
      description: Bad request - validation error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    Unauthorized:
      description: Unauthorized - missing or invalid authentication
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    Forbidden:
      description: Forbidden - insufficient permissions
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    Conflict:
      description: Conflict - duplicate resource or state conflict
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    TooManyRequests:
      description: Rate limit exceeded
      headers:
        X-RateLimit-Limit:
          schema:
            type: integer
        X-RateLimit-Remaining:
          schema:
            type: integer
        X-RateLimit-Reset:
          schema:
            type: integer
            format: timestamp
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```

---

## Appendix A: Request/Response Examples

### Example: Complete Prescription Workflow

**Step 1: Check Contraindications**
```http
POST /api/v1/prescriptions/contraindications/check
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{
  "studentId": "stu_xyz789",
  "medicationId": "med_abc123",
  "dosage": "200mg"
}
```

**Step 2: Create Prescription (if safe)**
```http
POST /api/v1/prescriptions
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{
  "studentId": "stu_xyz789",
  "medicationId": "med_abc123",
  "dosage": "200mg",
  "frequency": "twice daily",
  "route": "oral",
  "startDate": "2025-10-10",
  "prescribedBy": "Dr. Sarah Johnson"
}
```

**Step 3: Verify Before Administration**
```http
POST /api/v1/administrations/verify
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{
  "prescriptionId": "prx_new123",
  "studentBarcode": "STU_XYZ789",
  "medicationBarcode": "MED_ABC123_BATCH_2025A",
  "proposedDosage": "200mg",
  "proposedTime": "2025-10-10T08:30:00Z"
}
```

**Step 4: Log Administration**
```http
POST /api/v1/administrations
Content-Type: application/json
Authorization: Bearer eyJhbGc...
Idempotency-Key: admin_prx_new123_20251010_083000

{
  "prescriptionId": "prx_new123",
  "dosageGiven": "200mg",
  "timeGiven": "2025-10-10T08:30:00Z",
  "verification": {
    "method": "BARCODE_SCAN",
    "fiveRightsChecked": true
  }
}
```

---

## Appendix B: Integration Examples

### Frontend Integration (React + TanStack Query)

```typescript
// hooks/useAdministration.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationsApi } from '@/services/api';
import { v4 as uuidv4 } from 'uuid';

export function useLogAdministration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LogAdministrationData) => {
      // Generate idempotency key
      const idempotencyKey = uuidv4();

      return medicationsApi.logAdministration({
        ...data,
        idempotencyKey
      });
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries(['schedules', 'daily']);
      queryClient.invalidateQueries(['prescriptions', variables.prescriptionId]);
      queryClient.invalidateQueries(['students', variables.studentId, 'administrations']);

      // Show success notification
      toast.success('Medication administered successfully');
    },
    onError: (error: ApiError) => {
      if (error.code === 'DOSAGE_MISMATCH') {
        toast.error(`Dosage error: ${error.message}`);
      } else if (error.code === 'DUPLICATE_ADMINISTRATION') {
        toast.warning('This administration was already logged');
      } else {
        toast.error('Failed to log administration');
      }
    }
  });
}
```

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-10 | API Architecture Team | Initial specification |

---

**End of Medication Management REST API Specification v1.0**
