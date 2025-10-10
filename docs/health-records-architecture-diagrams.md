# Health Records Module - Architecture Diagrams

Visual representations of the type system and service architecture.

---

## Type System Hierarchy

```
┌───────────────────────────────────────────────────────────────────┐
│                        TYPE SYSTEM LAYERS                          │
└───────────────────────────────────────────────────────────────────┘

Layer 1: VALUE OBJECTS (Primitives with Validation)
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  StudentId          HealthRecordId      AllergyId          │
│  (branded string)   (branded string)    (branded string)   │
│                                                             │
│  Temperature        BloodPressure       HeartRate          │
│  (value + unit)     (systolic/diast)    (value + unit)     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ▼
Layer 2: DOMAIN MODELS (Business Logic)
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  HealthRecordDomain                                         │
│  ├─ id: HealthRecordId                                      │
│  ├─ studentId: StudentId                                    │
│  ├─ type: HealthRecordType                                  │
│  ├─ vital: VitalSigns (composite value object)             │
│  ├─ metadata: { createdAt, updatedAt, version }            │
│  └─ hipaaFlags: { isSensitive, requiresConsent }           │
│                                                             │
│  AllergyDomain                                              │
│  ├─ id: AllergyId                                           │
│  ├─ severity: AllergySeverity                               │
│  └─ verification: { isVerified, verifiedBy, date }         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ▼
Layer 3: DATA TRANSFER OBJECTS (API Boundary)
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  CreateHealthRecordRequestDto (Input)                       │
│  ├─ studentId: string                                       │
│  ├─ type: string                                            │
│  ├─ date: string (ISO 8601)                                 │
│  └─ vital?: VitalSignsDto                                   │
│                                                             │
│  HealthRecordResponseDto (Output)                           │
│  ├─ id: string                                              │
│  ├─ type: HealthRecordType                                  │
│  ├─ createdAt: string                                       │
│  └─ student?: StudentSummaryDto                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ▼
Layer 4: API RESPONSE WRAPPERS
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ApiResponse<T>                                             │
│  ├─ success: boolean                                        │
│  ├─ data?: T                                                │
│  ├─ error?: ApiError                                        │
│  └─ metadata: { timestamp, requestId, version }            │
│                                                             │
│  PaginatedResponse<T>                                       │
│  ├─ ...ApiResponse properties                               │
│  └─ pagination: { page, limit, total, pages }              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Service Architecture Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    REQUEST LIFECYCLE                             │
└──────────────────────────────────────────────────────────────────┘

1. HTTP REQUEST
   │
   ▼
┌──────────────────────────────────────────────────────────────┐
│  Route Handler (Hapi.js)                                     │
│  • Parse request                                             │
│  • Validate with Joi schema                                  │
│  • Extract auth credentials                                  │
└──────────────────────────────────────────────────────────────┘
   │
   │ (CreateHealthRecordRequestDto)
   ▼
┌──────────────────────────────────────────────────────────────┐
│  Controller Layer                                            │
│  • Type-safe request handling                                │
│  • Call service method                                       │
│  • Map result to HTTP response                               │
└──────────────────────────────────────────────────────────────┘
   │
   │ (DTO)
   ▼
┌──────────────────────────────────────────────────────────────┐
│  Service Layer (IHealthRecordService)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Business Logic Orchestration                           │ │
│  │ 1. Validate DTO                                        │ │
│  │ 2. Map DTO → Domain Model                             │ │
│  │ 3. Execute business rules                             │ │
│  │ 4. Call repository                                     │ │
│  │ 5. Log audit trail                                     │ │
│  │ 6. Map Domain → Response DTO                          │ │
│  │ 7. Return ServiceResult                               │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
   │
   │ (Domain Model)
   ▼
┌──────────────────────────────────────────────────────────────┐
│  Repository Layer (IHealthRecordRepository)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Data Access Abstraction                               │ │
│  │ 1. Map Domain → Prisma Model                          │ │
│  │ 2. Execute database query                             │ │
│  │ 3. Map Prisma Model → Domain                          │ │
│  │ 4. Return domain object                               │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
   │
   │ (Prisma Query)
   ▼
┌──────────────────────────────────────────────────────────────┐
│  Database (PostgreSQL)                                       │
│  • Persist data                                              │
│  • Return query results                                      │
└──────────────────────────────────────────────────────────────┘
   │
   │ (Results flow back up)
   ▼
┌──────────────────────────────────────────────────────────────┐
│  HTTP RESPONSE                                               │
│  {                                                           │
│    "success": true,                                          │
│    "data": { ...HealthRecordResponseDto },                   │
│    "metadata": { "timestamp", "requestId", "version" }       │
│  }                                                           │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Dependency Graph

```
┌──────────────────────────────────────────────────────────────────┐
│                 DEPENDENCY INJECTION FLOW                         │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  DI Container (TSyringe)                                    │
│  • Manages object lifecycle                                 │
│  • Resolves dependencies                                    │
│  • Enables testing with mocks                               │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌─────────────┐
│ Controller   │    │ HealthRecord     │    │ Audit       │
│              │    │ Service          │    │ Service     │
│              │    │                  │    │             │
└──────────────┘    └──────────────────┘    └─────────────┘
        │                     │                     │
        │            ┌────────┴────────┐            │
        │            │                 │            │
        ▼            ▼                 ▼            ▼
┌──────────────┐  ┌──────────────┐  ┌─────────────────┐
│   Mapper     │  │ Repository   │  │ AuditLog        │
│              │  │ Interface    │  │ Repository      │
└──────────────┘  └──────────────┘  └─────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Prisma Impl  │
                  │              │
                  └──────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ PostgreSQL   │
                  └──────────────┘

Legend:
→ : Direct dependency
┌─┐: Component/Layer
```

---

## Type Transformation Pipeline

```
┌──────────────────────────────────────────────────────────────────┐
│            TYPE TRANSFORMATIONS ACROSS BOUNDARIES                 │
└──────────────────────────────────────────────────────────────────┘

CLIENT REQUEST (JSON)
{
  "studentId": "STU-123",
  "type": "CHECKUP",
  "date": "2025-01-15T10:00:00Z",
  "vital": {
    "temperature": 37.5,
    "heartRate": 72
  }
}
        │
        │ Parse & Validate (Joi/Zod)
        ▼
CreateHealthRecordRequestDto
{
  readonly studentId: string;
  readonly type: HealthRecordType;
  readonly date: string;
  readonly vital?: VitalSignsDto;
}
        │
        │ Mapper.toCreateDomain()
        ▼
Omit<HealthRecordDomain, 'id' | 'metadata'>
{
  readonly studentId: StudentId;         // Branded type
  readonly type: HealthRecordType;
  readonly date: Date;                   // Parsed date
  readonly vital?: VitalSigns;           // Value objects
  readonly hipaaFlags: HipaaFlags;       // Business logic
}
        │
        │ Repository.create()
        ▼
Prisma Create Input
{
  studentId: string;
  type: 'CHECKUP';
  date: Date;
  vital: JsonValue;                      // Serialized
}
        │
        │ Database Operation
        ▼
Prisma Model
{
  id: string;
  studentId: string;
  type: HealthRecordType;
  date: Date;
  vital: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}
        │
        │ Repository.toDomain()
        ▼
HealthRecordDomain
{
  readonly id: HealthRecordId;           // Branded
  readonly studentId: StudentId;         // Branded
  readonly type: HealthRecordType;
  readonly date: Date;
  readonly vital?: VitalSigns;           // Deserialized
  readonly metadata: DomainMetadata;
  readonly hipaaFlags: HipaaFlags;
}
        │
        │ Mapper.toResponseDto()
        ▼
HealthRecordResponseDto
{
  readonly id: string;
  readonly studentId: string;
  readonly type: HealthRecordType;
  readonly date: string;                 // ISO 8601
  readonly vital?: VitalSignsDto;
  readonly createdAt: string;
  readonly updatedAt: string;
}
        │
        │ Wrap in ApiResponse
        ▼
ApiResponse<HealthRecordResponseDto>
{
  readonly success: true;
  readonly data: HealthRecordResponseDto;
  readonly metadata: {
    readonly timestamp: string;
    readonly requestId: string;
    readonly version: string;
  };
}
        │
        │ Serialize to JSON
        ▼
HTTP RESPONSE (JSON)
{
  "success": true,
  "data": {
    "id": "HR-456",
    "studentId": "STU-123",
    "type": "CHECKUP",
    "date": "2025-01-15T10:00:00.000Z",
    "vital": { "temperature": 37.5, "heartRate": 72 },
    "createdAt": "2025-01-15T10:05:23.123Z",
    "updatedAt": "2025-01-15T10:05:23.123Z"
  },
  "metadata": {
    "timestamp": "2025-01-15T10:05:23.123Z",
    "requestId": "req-789",
    "version": "1.0"
  }
}
```

---

## Error Handling Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                     ERROR HANDLING HIERARCHY                      │
└──────────────────────────────────────────────────────────────────┘

Error Source → Error Type → Service Result → HTTP Response

┌─────────────────────────────────────────────────────────────┐
│  Validation Error (Joi/Zod)                                 │
│  • Invalid date format                                      │
│  • Missing required field                                   │
│  • Type mismatch                                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ValidationError
                    (extends DomainError)
                    • code: 'VALIDATION_ERROR'
                    • statusCode: 400
                    • validationErrors: [...]
                              │
                              ▼
                    ServiceResult<T>
                    {
                      success: false,
                      error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid input',
                        details: { errors: [...] }
                      }
                    }
                              │
                              ▼
                    HTTP Response
                    Status: 400 Bad Request
                    {
                      "success": false,
                      "error": {
                        "code": "VALIDATION_ERROR",
                        "message": "Invalid input data",
                        "details": {
                          "errors": [
                            {
                              "field": "date",
                              "message": "Invalid date format"
                            }
                          ]
                        }
                      }
                    }

┌─────────────────────────────────────────────────────────────┐
│  Not Found Error (Repository)                               │
│  • Record doesn't exist                                     │
│  • Student not found                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ResourceNotFoundError
                    (extends DomainError)
                    • code: 'RESOURCE_NOT_FOUND'
                    • statusCode: 404
                    • details: { resourceType, id }
                              │
                              ▼
                    ServiceResult<T>
                    {
                      success: false,
                      error: {
                        code: 'RESOURCE_NOT_FOUND',
                        message: 'Student not found',
                        details: { resourceType, id }
                      }
                    }
                              │
                              ▼
                    HTTP Response
                    Status: 404 Not Found
                    {
                      "success": false,
                      "error": {
                        "code": "RESOURCE_NOT_FOUND",
                        "message": "Student with ID STU-123 not found"
                      }
                    }

┌─────────────────────────────────────────────────────────────┐
│  HIPAA Violation (Business Logic)                           │
│  • Unauthorized access                                      │
│  • Missing consent                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    HipaaViolationError
                    (extends DomainError)
                    • code: 'HIPAA_VIOLATION'
                    • statusCode: 403
                    • Triggers security alert
                              │
                              ▼
                    ServiceResult<T>
                    {
                      success: false,
                      error: {
                        code: 'HIPAA_VIOLATION',
                        message: 'Unauthorized access'
                      }
                    }
                              │
                              ▼
                    HTTP Response
                    Status: 403 Forbidden
                    {
                      "success": false,
                      "error": {
                        "code": "HIPAA_VIOLATION",
                        "message": "Insufficient permissions to access this resource"
                      }
                    }
```

---

## Testing Strategy Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    TESTING PYRAMID                                │
└──────────────────────────────────────────────────────────────────┘

                      ▲
                     ╱ ╲              E2E Tests
                    ╱   ╲             • Cypress
                   ╱  E2E ╲            • Full user flows
                  ╱─────────╲          • Slow, expensive
                 ╱           ╲
                ╱             ╲
               ╱───────────────╲       Integration Tests
              ╱                 ╲      • Service + Repository + DB
             ╱   Integration     ╲     • API contract validation
            ╱─────────────────────╲    • Medium speed
           ╱                       ╲
          ╱                         ╲
         ╱───────────────────────────╲  Unit Tests
        ╱                             ╲ • Service (mocked deps)
       ╱            Unit               ╲• Repository (mocked Prisma)
      ╱─────────────────────────────────╲• Mappers
     ╱                                   ╲• Value objects
    ╱                                     ╲• Fast, isolated
   ╱───────────────────────────────────────╲
  ╱                                         ╲
 ╱─────────────────────────────────────────────╲
 ───────────────────────────────────────────────  Type Tests
                                                 • tsd type checking
                                                 • Contract validation
                                                 • Compile-time only

TEST TYPES BY LAYER:

┌──────────────────────────────────────────────────┐
│ Presentation Layer (Controllers/Routes)          │
│ • E2E: Full API request → response               │
│ • Integration: Route → Service (real DB)         │
└──────────────────────────────────────────────────┘
                       │
┌──────────────────────────────────────────────────┐
│ Application Layer (Services)                     │
│ • Unit: Service with mocked repository           │
│ • Integration: Service + real repository + DB    │
└──────────────────────────────────────────────────┘
                       │
┌──────────────────────────────────────────────────┐
│ Domain Layer (Models, Value Objects)             │
│ • Unit: Pure business logic                      │
│ • Type: Compile-time validation                  │
└──────────────────────────────────────────────────┘
                       │
┌──────────────────────────────────────────────────┐
│ Infrastructure Layer (Repositories)              │
│ • Unit: Repository with mocked Prisma            │
│ • Integration: Repository + real database        │
└──────────────────────────────────────────────────┘
```

---

## Module Organization

```
┌──────────────────────────────────────────────────────────────────┐
│          FILE SYSTEM ORGANIZATION                                 │
└──────────────────────────────────────────────────────────────────┘

backend/src/modules/health-records/
│
├── contracts/                    ← TYPE DEFINITIONS & INTERFACES
│   ├── types/
│   │   ├── index.ts              ← Core types, DTOs, domain models
│   │   ├── value-objects.ts      ← Branded types, value objects
│   │   ├── errors.ts             ← Custom exceptions
│   │   └── validators.ts         ← Type guards
│   │
│   ├── services/
│   │   ├── IHealthRecordService.ts  ← Service contract
│   │   └── IAuditService.ts         ← Audit contract
│   │
│   └── repositories/
│       └── IHealthRecordRepository.ts ← Repository contract
│
├── domain/                       ← BUSINESS LOGIC
│   ├── models/
│   │   ├── HealthRecord.ts       ← Domain model with methods
│   │   ├── Allergy.ts
│   │   └── ChronicCondition.ts
│   │
│   ├── services/
│   │   └── HealthRecordDomainService.ts ← Complex business rules
│   │
│   └── validators/
│       └── HealthRecordValidator.ts ← Business rule validation
│
├── application/                  ← USE CASES & ORCHESTRATION
│   ├── services/
│   │   ├── HealthRecordService.ts    ← Service implementation
│   │   └── HealthRecordMapper.ts     ← DTO ↔ Domain mapping
│   │
│   └── use-cases/
│       ├── CreateHealthRecord.ts     ← Use case handler
│       ├── UpdateHealthRecord.ts
│       └── DeleteHealthRecord.ts
│
├── infrastructure/               ← EXTERNAL INTEGRATIONS
│   ├── repositories/
│   │   └── PrismaHealthRecordRepository.ts ← Data access impl
│   │
│   └── mappers/
│       └── PrismaHealthRecordMapper.ts ← Prisma ↔ Domain
│
└── presentation/                 ← HTTP/API LAYER
    ├── routes/
    │   └── healthRecords.routes.ts   ← Route definitions
    │
    ├── controllers/
    │   └── HealthRecordController.ts ← Request handlers
    │
    └── validators/
        └── RequestValidators.ts      ← Joi/Zod schemas

────────────────────────────────────────────────────────────────

frontend/src/modules/health-records/
│
├── types/
│   ├── index.ts                  ← Re-export backend types
│   └── ui-types.ts               ← UI-specific types
│
├── services/
│   ├── healthRecordsApi.ts       ← Type-safe API client
│   └── apiContract.ts            ← Client interface
│
├── hooks/
│   ├── useHealthRecords.ts       ← React Query hooks
│   └── useHealthRecordMutations.ts
│
├── components/
│   ├── HealthRecordList/
│   ├── HealthRecordForm/
│   └── HealthRecordDetail/
│
└── utils/
    ├── mappers.ts                ← DTO ↔ UI mappers
    └── validators.ts             ← Client-side validation
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│             CREATE HEALTH RECORD FLOW                             │
└──────────────────────────────────────────────────────────────────┘

FRONTEND                    BACKEND                    DATABASE
────────────────────────────────────────────────────────────────────

[User Form]
    │
    │ Fill form
    │ Click "Save"
    ▼
[React Component]
    │
    │ useCreateHealthRecord()
    │ mutation.mutate(formData)
    ▼
[API Client]
    │
    │ POST /api/health-records
    │ Body: CreateHealthRecordRequestDto
    │
    ├──────────────────────→  [Route Handler]
                                    │
                                    │ Validate with Joi
                                    │ Extract auth user
                                    ▼
                              [Controller]
                                    │
                                    │ Call service.create()
                                    ▼
                              [Service Layer]
                                    │
                                    ├─ Validate business rules
                                    │
                                    ├─ Map DTO → Domain
                                    │  (createStudentId, parse date, etc.)
                                    │
                                    ├─ Call repository.create()
                                    │
                                    ├──────────→  [Repository]
                                                       │
                                                       │ Map Domain → Prisma
                                                       │
                                                       ├────────→  [Database]
                                                       │              │
                                                       │              │ INSERT
                                                       │              │
                                                       │ ←────────  [Success]
                                                       │
                                                       │ Map Prisma → Domain
                                                       │
                                    │ ←────────  Return HealthRecordDomain
                                    │
                                    ├─ Log audit event
                                    │
                                    ├─ Map Domain → Response DTO
                                    │
                                    ▼
                              Return ServiceResult<HealthRecordDomain>
                                    │
    │ ←──────────────────────  Return ApiResponse<HealthRecordResponseDto>
    │
    ▼
[API Client]
    │
    │ Parse response
    │ Invalidate queries
    ▼
[React Component]
    │
    │ Update UI
    │ Show success message
    ▼
[User sees confirmation]
```

---

## Type Safety Benefits

```
┌──────────────────────────────────────────────────────────────────┐
│                  COMPILE-TIME VS RUNTIME                          │
└──────────────────────────────────────────────────────────────────┘

WITHOUT TYPE SAFETY                    WITH TYPE SAFETY
─────────────────────────────────────────────────────────────────

function getRecord(id) {               function getRecord(
  return fetch(`/api/records/${id}`)     recordId: HealthRecordId
}                                       ): Promise<ServiceResult<
                                          HealthRecordDomain
// Can pass anything                   >> {
getRecord(123)          ✓ Compiles       return repo.findById(recordId);
getRecord("abc")        ✓ Compiles     }
getRecord(null)         ✓ Compiles
getRecord(undefined)    ✓ Compiles     // Type checking enforced
                                       const id = createHealthRecordId("HR-123");
// Runtime errors! 💥                  getRecord(id);          ✓ Type-safe!

                                       getRecord("HR-123");    ❌ Compile error
                                       getRecord(123);         ❌ Compile error
                                       getRecord(studentId);   ❌ Wrong ID type

─────────────────────────────────────────────────────────────────

const response = await fetch(...)     const result = await service
const data = response.json()            .getRecord(id);

// What's in data? 🤷                 if (result.success) {
if (data.succes) {  // Typo! 💥         // TypeScript knows:
  console.log(data.recrd.id) // 💥     // result.data exists
}                                       // result.data.type is
                                       // HealthRecordType
                                         console.log(result.data.id);
                                       } else {
                                         // TypeScript knows:
                                         // result.error exists
                                         console.error(
                                           result.error.message
                                         );
                                       }

─────────────────────────────────────────────────────────────────

// Mixed ID types                      // Branded types prevent mixing
getHealthRecord(                       getHealthRecord(
  studentId: "STU-123",                  studentId: StudentId,
  recordId: "STU-456"  // Wrong! 💥      recordId: HealthRecordId
)                                      )
// Compiles fine, fails at runtime!
                                       // This won't compile:
                                       getHealthRecord(
                                         recordId,  // ❌ Wrong order
                                         studentId  // ❌ Caught at
                                       )            //    compile time!
```

---

**These diagrams should be used alongside the main documentation to visualize the architecture and understand how types flow through the system.**
