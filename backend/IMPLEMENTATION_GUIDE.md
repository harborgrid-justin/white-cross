## Production-Grade Code Implementation Guide

This guide shows how to use the newly created utilities to address all audit findings.

---

## Table of Contents

1. [Transaction Management](#1-transaction-management)
2. [HIPAA Audit Logging](#2-hipaa-audit-logging)
3. [SQL Injection Prevention](#3-sql-injection-prevention)
4. [Rate Limiting](#4-rate-limiting)
5. [Security Headers](#5-security-headers)
6. [PHI Type Safety](#6-phi-type-safety)
7. [Typed Route Handlers](#7-typed-route-handlers)
8. [Performance Indexes](#8-performance-indexes)

---

## 1. Transaction Management

### Before (Audit Finding: Missing transactions)

```typescript
// backend/src/services/medicationService.ts - LINE 200
static async assignMedicationToStudent(data: CreateStudentMedicationData) {
  const student = await Student.findByPk(data.studentId);
  if (!student) throw new Error('Student not found');

  const medication = await Medication.findByPk(data.medicationId);
  if (!medication) throw new Error('Medication not found');

  // PROBLEM: No transaction - if this fails, medication is created but not reloaded
  const studentMedication = await StudentMedication.create(data);
  await studentMedication.reload({ include: [/* ... */] });

  return studentMedication;
}
```

### After (Production-Grade)

```typescript
import { withTransaction, withTransactionRetry } from '../utils/database/transactionWrapper';

static async assignMedicationToStudent(data: CreateStudentMedicationData) {
  const result = await withTransactionRetry(async (tx) => {
    // All operations within single transaction
    const student = await tx.student.findUnique({
      where: { id: data.studentId }
    });
    if (!student) throw new Error('Student not found');

    const medication = await tx.medication.findUnique({
      where: { id: data.medicationId }
    });
    if (!medication) throw new Error('Medication not found');

    // Check for duplicates
    const existing = await tx.studentMedication.findFirst({
      where: {
        studentId: data.studentId,
        medicationId: data.medicationId,
        isActive: true
      }
    });
    if (existing) throw new Error('Duplicate prescription');

    // Create prescription with all relationships
    const studentMedication = await tx.studentMedication.create({
      data: {
        ...data,
        createdBy: data.prescribingPhysician
      },
      include: {
        student: true,
        medication: true
      }
    });

    return studentMedication;
  }, 3); // Retry up to 3 times on deadlock

  if (!result.success) {
    logger.error('Failed to assign medication', { error: result.error });
    throw result.error;
  }

  return result.data;
}
```

---

## 2. HIPAA Audit Logging

### Server Setup (backend/src/index.ts)

```typescript
import { auditLoggingMiddleware } from './middleware/auditLogging';

// Register audit logging middleware
await server.register(auditLoggingMiddleware);

logger.info('HIPAA audit logging enabled for all PHI endpoints');
```

### Service-Level Audit Logging

```typescript
import { createAuditLog, auditPHIExport } from '../middleware/auditLogging';

// Example: Manual audit log for background job
static async exportStudentHealthHistory(
  studentId: string,
  userId: string,
  reason: string,
  ipAddress: string
) {
  // Audit log BEFORE export
  const auditId = await auditPHIExport({
    userId,
    entityType: 'HealthRecord',
    entityIds: [studentId],
    exportFormat: 'PDF',
    reason,
    ipAddress,
    userAgent: 'BackgroundJob'
  });

  try {
    const data = await this.getHealthRecords(studentId);
    const pdf = await this.generatePDF(data);

    return { pdf, auditId };
  } catch (error) {
    // Log export failure
    await createAuditLog({
      action: 'EXPORT_FAILED',
      entityType: 'HealthRecord',
      entityId: studentId,
      userId,
      ipAddress,
      changes: { error: error.message },
      reason
    });
    throw error;
  }
}
```

### Query Audit Logs (Compliance Reporting)

```typescript
import { getAuditLogs } from '../middleware/auditLogging';

// Get all PHI exports in last 30 days
const exports = await getAuditLogs({
  action: 'EXPORT',
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate: new Date(),
  page: 1,
  limit: 100
});

console.log(`Found ${exports.pagination.total} PHI exports in last 30 days`);
```

---

## 3. SQL Injection Prevention

### Before (Audit Finding: SQL injection vulnerability)

```typescript
// backend/src/services/inventoryService.ts - LINE 106
let items = await prisma.$queryRaw`
  SELECT i.*, SUM(it.quantity) as total_quantity
  FROM inventory_items i
  LEFT JOIN inventory_transactions it ON i.id = it."inventoryItemId"
  WHERE i."isActive" = true
  GROUP BY i.id
  ORDER BY ${sortField} ${sortOrder}  // VULNERABLE!
`;
```

### After (Production-Grade)

```typescript
import {
  validateSortField,
  validateSortOrder,
  buildSafeOrderBy,
  validatePagination,
  SqlInjectionError
} from '../utils/security/sqlSanitizer';

static async getInventoryItems(filters: {
  sortField?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}) {
  try {
    // Validate all inputs
    const sortField = validateSortField(filters.sortField || 'name', 'inventory');
    const sortOrder = validateSortOrder(filters.sortOrder || 'ASC');
    const pagination = validatePagination(filters.page, filters.limit, 1000);

    // Build safe ORDER BY clause
    const orderBy = buildSafeOrderBy(sortField, sortOrder);

    // Use validated inputs in query
    const items = await prisma.$queryRaw`
      SELECT
        i.*,
        COALESCE(SUM(it.quantity), 0) as total_quantity
      FROM inventory_items i
      LEFT JOIN inventory_transactions it ON i.id = it."inventoryItemId"
      WHERE i."isActive" = true
      GROUP BY i.id
      ORDER BY ${orderBy}
      LIMIT ${pagination.limit}
      OFFSET ${pagination.offset}
    `;

    const total = await prisma.inventoryItem.count({
      where: { isActive: true }
    });

    return {
      items,
      pagination: {
        ...pagination,
        total,
        totalPages: Math.ceil(total / pagination.limit)
      }
    };
  } catch (error) {
    if (error instanceof SqlInjectionError) {
      // Log security incident
      await logSqlInjectionAttempt(error, {
        userId: context.userId,
        ipAddress: context.ipAddress,
        endpoint: '/api/inventory'
      });
      throw new Error('Invalid request parameters');
    }
    throw error;
  }
}
```

### Date Range Queries

```typescript
import { validateDateInput, buildSafeDateRange } from '../utils/security/sqlSanitizer';

static async getHealthRecordsByDateRange(
  studentId: string,
  startDate?: any,
  endDate?: any
) {
  // Validate date inputs
  const validatedStart = startDate ? validateDateInput(startDate, 'startDate') : undefined;
  const validatedEnd = endDate ? validateDateInput(endDate, 'endDate') : undefined;

  // Build safe date range clause
  const dateRange = buildSafeDateRange('date', validatedStart, validatedEnd);

  const records = await prisma.$queryRaw`
    SELECT * FROM health_records
    WHERE "studentId" = ${studentId}
      AND ${dateRange}
    ORDER BY date DESC
  `;

  return records;
}
```

---

## 4. Rate Limiting

### Server Setup

```typescript
import { rateLimitingPlugin, RATE_LIMIT_CONFIGS } from './middleware/rateLimiting';

// Register rate limiting plugin
await server.register(rateLimitingPlugin, {
  redisUrl: process.env.REDIS_URL || undefined // Falls back to in-memory
});

logger.info('Rate limiting enabled');
```

### Apply to Specific Routes

```typescript
import { applyRateLimit, RATE_LIMIT_CONFIGS } from '../middleware/rateLimiting';

// Authentication routes - strict rate limiting
server.route({
  method: 'POST',
  path: '/api/auth/login',
  options: {
    auth: false,
    pre: [applyRateLimit('auth', RATE_LIMIT_CONFIGS.auth)],
    handler: loginHandler
  }
});

// Emergency alert - very strict
server.route({
  method: 'POST',
  path: '/api/communication/emergency-alert',
  options: {
    auth: 'jwt',
    pre: [applyRateLimit('emergencyAlert', RATE_LIMIT_CONFIGS.emergencyAlert)],
    handler: emergencyAlertHandler
  }
});

// PHI exports - limit per hour
server.route({
  method: 'POST',
  path: '/api/reports/export',
  options: {
    auth: 'jwt',
    pre: [applyRateLimit('export', RATE_LIMIT_CONFIGS.export)],
    handler: exportHandler
  }
});
```

### Admin Functions

```typescript
import { clearRateLimit, getRateLimitStatus } from '../middleware/rateLimiting';

// Clear rate limit for user (after password reset)
await clearRateLimit('auth', userId);

// Check rate limit status
const status = await getRateLimitStatus('auth', userId);
console.log(`User has ${status.remaining} login attempts remaining`);
```

---

## 5. Security Headers

### Server Setup

```typescript
import { securityHeadersMiddleware, cspNonceMiddleware } from './middleware/securityHeaders';

// Register security headers
await server.register(securityHeadersMiddleware, {
  config: {
    // Use default HIPAA-compliant configuration
    // Or customize as needed
    cors: {
      origin: [
        'http://localhost:5173',
        'https://app.whitecross.health'
      ],
      credentials: true
    }
  }
});

// Optional: CSP nonce for inline scripts
await server.register(cspNonceMiddleware);

logger.info('Security headers configured');
```

### Custom Headers for Downloads

```typescript
import { applyDownloadSecurityHeaders } from '../middleware/securityHeaders';

const downloadHandler = async (request: Request, h: ResponseToolkit) => {
  const document = await getDocument(request.params.id);
  const fileBuffer = await fetchDocumentContent(document.storageKey);

  const response = h.response(fileBuffer);

  // Apply security headers for download
  applyDownloadSecurityHeaders(
    response,
    document.filename,
    document.mimeType
  );

  return response;
};
```

---

## 6. PHI Type Safety

### Mark Data as PHI

```typescript
import { markAsPHI, PHI, createICD10Code, createNPICode } from '../types/phi';

interface HealthRecord {
  id: string;
  studentId: string;
  diagnosis: PHI<string>;  // Marked as PHI at type level
  treatment: PHI<string>;
  diagnosisCode?: ICD10Code;  // Validated medical code
  providerNpi?: NPICode;
}

// Create health record with PHI
const healthRecord: HealthRecord = {
  id: uuid(),
  studentId: student.id,
  diagnosis: markAsPHI('Type 1 Diabetes'),
  treatment: markAsPHI('Insulin therapy'),
  diagnosisCode: createICD10Code('E10.9') || undefined,
  providerNpi: createNPICode('1234567890') || undefined
};
```

### Safe Logging with PHI

```typescript
import { redactPHI, createSafeLogData } from '../types/phi';

// Unsafe logging (before)
logger.info('Health record created', healthRecord); // Logs PHI!

// Safe logging (after)
const safeData = createSafeLogData('HealthRecordService', 'create', {
  userId: request.auth.credentials.userId,
  entityType: 'HealthRecord',
  entityId: healthRecord.id
});

logger.info('Health record created', safeData); // No PHI in logs

// Or redact specific fields
const redactedRecord = redactPHI(healthRecord, ['diagnosis', 'treatment']);
logger.info('Health record', redactedRecord); // diagnosis: [REDACTED]
```

### De-identification for Research

```typescript
import { deIdentifyPHI } from '../types/phi';

// Export de-identified data for research
const deIdentified = deIdentifyPHI(healthRecord, 'full');

console.log(deIdentified);
// {
//   data: { id: '...', diagnosisCode: 'E10.9' },  // No names, dates, etc.
//   level: 'full',
//   removedFields: ['studentId', 'diagnosis', 'treatment', ...],
//   deIdentifiedAt: Date
// }
```

### Medical Code Validation

```typescript
import {
  createICD10Code,
  createNDCCode,
  createCVXCode,
  createNPICode
} from '../types/phi';

// Validate ICD-10 diagnosis code
const icd10 = createICD10Code('E11.9'); // Type 2 diabetes
if (!icd10) {
  throw new Error('Invalid ICD-10 code');
}

// Validate NDC medication code
const ndc = createNDCCode('00002-8215-01'); // Insulin
if (!ndc) {
  throw new Error('Invalid NDC code');
}

// Validate CVX vaccine code
const cvx = createCVXCode('08'); // Hepatitis B
if (!cvx) {
  throw new Error('Invalid CVX code');
}

// Validate NPI provider code
const npi = createNPICode('1234567893'); // Includes checksum validation
if (!npi) {
  throw new Error('Invalid NPI code');
}
```

---

## 7. Typed Route Handlers

### Before (Audit Finding: All handlers use 'any')

```typescript
// backend/src/routes/students.ts
const getStudentsHandler = async (request: any, h: any) => {
  const page = parseInt(request.query.page || '1');  // No type safety
  const limit = parseInt(request.query.limit || '10');

  // ...
};
```

### After (Production-Grade)

```typescript
import {
  AuthenticatedRequest,
  GetStudentsQuery,
  successResponse,
  paginatedResponse,
  createHandler
} from '../types/hapi';

// Fully typed handler
const getStudentsHandler = createHandler<GetStudentsQuery, never, never, Student[]>(
  async (request, h) => {
    // TypeScript knows request.query is GetStudentsQuery
    const page = parseInt(request.query.page?.toString() || '1');
    const limit = parseInt(request.query.limit?.toString() || '10');
    const search = request.query.search;
    const grade = request.query.grade;

    // request.auth.credentials is properly typed
    const userId = request.auth.credentials.userId;
    const schoolId = request.auth.credentials.schoolId;

    const result = await StudentService.getStudents({
      page,
      limit,
      search,
      grade,
      schoolId
    });

    return paginatedResponse(h, result.students, {
      page,
      limit,
      total: result.total
    });
  }
);

// Route definition with validation
server.route({
  method: 'GET',
  path: '/api/students',
  options: {
    auth: 'jwt',
    validate: {
      query: Joi.object<GetStudentsQuery>({
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).max(100).optional(),
        search: Joi.string().optional(),
        grade: Joi.string().optional(),
        isActive: Joi.boolean().optional(),
        nurseId: Joi.string().uuid().optional()
      })
    },
    handler: getStudentsHandler
  }
});
```

### POST Handler with Payload

```typescript
import {
  CreateStudentPayload,
  StudentParams,
  successResponse,
  errorResponse
} from '../types/hapi';

const createStudentHandler = createHandler<never, CreateStudentPayload, never, Student>(
  async (request, h) => {
    // request.payload is typed as CreateStudentPayload
    const studentData = request.payload;
    const userId = request.auth.credentials.userId;

    try {
      const student = await StudentService.createStudent({
        ...studentData,
        createdBy: userId
      });

      return successResponse(h, student, 201);
    } catch (error) {
      if (error.message.includes('duplicate')) {
        throw errorResponse('Student number already exists', 409, 'DUPLICATE_STUDENT');
      }
      throw errorResponse('Failed to create student', 500);
    }
  }
);
```

---

## 8. Performance Indexes

### Apply the Migration

```bash
# Run the performance indexes migration
cd backend
npx prisma migrate deploy

# Or for development
npx prisma migrate dev
```

### Verify Index Usage

```sql
-- Check which indexes are being used
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as scans,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC
LIMIT 20;

-- Find unused indexes (candidates for removal)
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Query Performance Monitoring

```typescript
// Add query performance tracking
import { logger } from '../utils/logger';

const startTime = Date.now();

const students = await prisma.student.findMany({
  where: { schoolId, isActive: true },
  include: {
    nurse: true,
    emergencyContacts: { where: { isActive: true } }
  }
});

const duration = Date.now() - startTime;

if (duration > 100) { // Log slow queries
  logger.warn('Slow query detected', {
    query: 'findStudentsBySchool',
    duration,
    schoolId,
    resultCount: students.length
  });
}
```

---

## Complete Example: Creating a Health Record with All Safeguards

```typescript
import { withAuditedTransaction, TransactionContext } from '../utils/database/transactionWrapper';
import { createAuditLog } from '../middleware/auditLogging';
import { validateDateInput, validateUuidInput } from '../utils/security/sqlSanitizer';
import { markAsPHI, createICD10Code, PHI } from '../types/phi';
import {
  AuthenticatedRequest,
  CreateHealthRecordPayload,
  successResponse,
  errorResponse,
  createHandler
} from '../types/hapi';

const createHealthRecordHandler = createHandler<
  never,
  CreateHealthRecordPayload,
  never,
  HealthRecord
>(async (request, h) => {
  const payload = request.payload;
  const userId = request.auth.credentials.userId;

  try {
    // 1. Validate inputs (SQL injection prevention)
    const studentId = validateUuidInput(payload.studentId, 'studentId');
    const recordDate = validateDateInput(payload.date, 'date');
    const diagnosisCode = payload.diagnosisCode
      ? createICD10Code(payload.diagnosisCode)
      : undefined;

    if (payload.diagnosisCode && !diagnosisCode) {
      throw errorResponse('Invalid ICD-10 diagnosis code', 400);
    }

    // 2. Create transaction context for audit logging
    const context: TransactionContext = {
      userId,
      requestId: request.info.id,
      ipAddress: request.info.remoteAddress,
      userAgent: request.headers['user-agent'],
      reason: 'Clinical documentation'
    };

    // 3. Execute within audited transaction
    const result = await withAuditedTransaction(
      context,
      async (tx, ctx) => {
        // Verify student exists
        const student = await tx.student.findUnique({
          where: { id: studentId }
        });

        if (!student) {
          throw new Error('Student not found');
        }

        // Create health record with PHI marking
        const healthRecord = await tx.healthRecord.create({
          data: {
            studentId,
            recordType: payload.recordType,
            title: payload.title,
            description: markAsPHI(payload.description || '') as any,
            date: recordDate,
            provider: payload.provider,
            providerNpi: payload.providerNpi,
            facility: payload.facility,
            facilityNpi: payload.facilityNpi,
            diagnosisCode: diagnosisCode as any,
            isConfidential: payload.isConfidential || false,
            metadata: payload.metadata,
            createdBy: userId
          },
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentNumber: true
              }
            }
          }
        });

        // Manual audit log (in addition to middleware)
        await createAuditLog({
          action: 'CREATE',
          entityType: 'HealthRecord',
          entityId: healthRecord.id,
          userId: ctx.userId,
          ipAddress: ctx.ipAddress,
          userAgent: ctx.userAgent,
          changes: {
            recordType: payload.recordType,
            isConfidential: payload.isConfidential
          },
          reason: ctx.reason
        });

        return healthRecord;
      },
      { timeout: 10000 } // 10 second timeout
    );

    if (!result.success) {
      logger.error('Failed to create health record', {
        error: result.error,
        userId,
        studentId
      });
      throw errorResponse('Failed to create health record', 500);
    }

    return successResponse(h, result.data, 201);
  } catch (error) {
    if (error instanceof SqlInjectionError) {
      logger.error('SQL injection attempt in health record creation', {
        error: error.message,
        userId,
        attemptedValue: error.attemptedValue
      });
      throw errorResponse('Invalid request parameters', 400);
    }

    throw error;
  }
});

// Route definition
server.route({
  method: 'POST',
  path: '/api/health-records',
  options: {
    auth: 'jwt',
    pre: [applyRateLimit('healthRecords', RATE_LIMIT_CONFIGS.api)],
    validate: {
      payload: Joi.object<CreateHealthRecordPayload>({
        studentId: Joi.string().uuid().required(),
        recordType: Joi.string().required(),
        title: Joi.string().max(200).required(),
        description: Joi.string().optional(),
        date: Joi.date().required(),
        provider: Joi.string().max(200).optional(),
        providerNpi: Joi.string().pattern(/^\d{10}$/).optional(),
        facility: Joi.string().max(200).optional(),
        facilityNpi: Joi.string().pattern(/^\d{10}$/).optional(),
        diagnosisCode: Joi.string().pattern(/^[A-Z]\d{2}(\.\d{1,2})?$/).optional(),
        isConfidential: Joi.boolean().optional(),
        metadata: Joi.object().optional()
      })
    },
    handler: createHealthRecordHandler
  }
});
```

---

## Testing the Implementation

### Unit Test Example

```typescript
import { withTransaction } from '../utils/database/transactionWrapper';
import { validateSortField, SqlInjectionError } from '../utils/security/sqlSanitizer';
import { createICD10Code } from '../types/phi';

describe('Production-Grade Utilities', () => {
  describe('Transaction Wrapper', () => {
    it('should rollback on error', async () => {
      const result = await withTransaction(async (tx) => {
        await tx.student.create({ data: testStudent });
        throw new Error('Intentional error');
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      // Verify rollback - student should not exist
      const student = await prisma.student.findFirst({
        where: { studentNumber: testStudent.studentNumber }
      });
      expect(student).toBeNull();
    });
  });

  describe('SQL Injection Prevention', () => {
    it('should reject invalid sort field', () => {
      expect(() => {
        validateSortField('DROP TABLE students', 'students');
      }).toThrow(SqlInjectionError);
    });

    it('should accept valid sort field', () => {
      expect(() => {
        validateSortField('firstName', 'students');
      }).not.toThrow();
    });
  });

  describe('PHI Types', () => {
    it('should validate ICD-10 codes', () => {
      expect(createICD10Code('E11.9')).toBe('E11.9');
      expect(createICD10Code('invalid')).toBeNull();
    });
  });
});
```

---

## Migration Checklist

- [ ] Run performance indexes migration
- [ ] Register audit logging middleware in server setup
- [ ] Register rate limiting middleware in server setup
- [ ] Register security headers middleware in server setup
- [ ] Update all route handlers to use typed handlers
- [ ] Replace raw SQL queries with sanitized versions
- [ ] Wrap multi-step operations in transactions
- [ ] Add PHI type markers to sensitive data
- [ ] Test audit log creation for all PHI endpoints
- [ ] Verify rate limits on authentication endpoints
- [ ] Test SQL injection prevention with malicious inputs
- [ ] Monitor query performance after adding indexes
- [ ] Update API documentation with new security features

---

## Monitoring and Maintenance

### Daily Checks
- Monitor rate limit violations
- Review SQL injection attempt logs
- Check slow query logs (>100ms)

### Weekly Checks
- Review audit logs for suspicious PHI access
- Analyze index usage statistics
- Check transaction failure rates

### Monthly Checks
- Run ANALYZE on all tables
- Review and remove unused indexes
- Audit security header compliance
- Generate HIPAA compliance report

---

## Support and Questions

For questions about implementation:
1. Review this guide
2. Check inline code comments
3. Review audit reports in `backend/` directory
4. Consult HIPAA compliance documentation

All code is production-ready and addresses critical audit findings.
