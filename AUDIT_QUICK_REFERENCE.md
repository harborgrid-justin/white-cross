# Audit Service Quick Reference

## Importing the Audit Service

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { AuditService } from './database/services/audit.service';
import { ExecutionContext } from './database/types';

@Injectable()
export class YourService {
  constructor(
    @Inject('IAuditLogger') private readonly auditService: AuditService,
  ) {}
}
```

---

## Common Operations

### 1. Log Entity Creation

```typescript
await this.auditService.logCreate(
  'EntityType',      // e.g., 'Student', 'HealthRecord'
  entity.id,
  {
    userId: user.id,
    userName: user.email,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    requestId: req.id,
    sessionId: req.session?.id
  },
  entityData          // The created entity data
);
```

### 2. Log Entity Update

```typescript
const changes = {
  fieldName: {
    before: oldValue,
    after: newValue
  },
  anotherField: {
    before: previousValue,
    after: currentValue
  }
};

await this.auditService.logUpdate(
  'EntityType',
  entity.id,
  context,
  changes
);
```

### 3. Log Entity Deletion

```typescript
await this.auditService.logDelete(
  'EntityType',
  entity.id,
  context,
  entityData          // The entity data before deletion
);
```

### 4. Log PHI Access (Automatic for PHI Entities)

```typescript
// This is automatically optimized - only logs PHI entities
await this.auditService.logRead(
  'HealthRecord',     // PHI entity type
  record.id,
  context
);
```

### 5. Log Authentication Events

```typescript
// Successful login
await this.auditService.logAuthEvent(
  'LOGIN',
  user.id,
  context,
  true
);

// Failed login
await this.auditService.logAuthEvent(
  'LOGIN',
  email,
  { ...context, userId: null },
  false,
  'Invalid credentials'
);

// Password change
await this.auditService.logAuthEvent(
  'PASSWORD_CHANGE',
  user.id,
  context,
  true
);
```

### 6. Log Authorization Events

```typescript
await this.auditService.logAuthzEvent(
  'ACCESS_HEALTH_RECORD',
  user.id,
  'HealthRecord',
  context,
  true,              // granted or denied
  'User has permission'
);
```

### 7. Log Bulk Operations

```typescript
await this.auditService.logBulkOperation(
  'BULK_DELETE',
  'Student',
  context,
  {
    count: deletedCount,
    criteria: deleteFilter,
    affectedIds: deletedIds
  }
);
```

### 8. Log Export Operations

```typescript
await this.auditService.logExport(
  'HealthRecord',
  context,
  {
    format: 'CSV',
    recordCount: records.length,
    dateRange: { start, end }
  }
);
```

---

## Querying Audit Logs

### Get Entity History

```typescript
const history = await this.auditService.getEntityAuditHistory(
  'Student',
  studentId,
  {
    page: 1,
    limit: 50,
    sortOrder: 'ASC'
  }
);
```

### Get User Activity

```typescript
const activity = await this.auditService.getUserAuditHistory(
  userId,
  {
    page: 1,
    limit: 100,
    sortOrder: 'DESC'
  }
);
```

### Get PHI Access Logs

```typescript
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const phiLogs = await this.auditService.getPHIAccessLogs(
  thirtyDaysAgo,
  new Date(),
  { limit: 1000 }
);
```

### Advanced Query with Filters

```typescript
const result = await this.auditService.queryAuditLogs(
  {
    userId: 'specific-user-id',
    entityType: 'HealthRecord',
    action: AuditAction.UPDATE,
    isPHI: true,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    severity: AuditSeverity.HIGH,
    success: false,
    tags: ['critical', 'phi'],
    searchTerm: 'patient name'
  },
  {
    page: 1,
    limit: 50,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  }
);

// Result contains:
// - logs: AuditLog[]
// - total: number
// - page: number
// - pages: number
```

---

## Compliance Reporting

### HIPAA Compliance Report

```typescript
const report = await this.auditService.getHIPAAReport(
  new Date('2024-01-01'),
  new Date('2024-12-31')
);

// Report contains:
// - period: { start, end }
// - complianceType: 'HIPAA'
// - totalAccess: number
// - uniqueUsers: number
// - phiAccess: number
// - failedAccess: number
// - criticalEvents: number
// - topAccessedEntities: Array
// - userActivity: Array
```

### FERPA Compliance Report

```typescript
const report = await this.auditService.getFERPAReport(
  startDate,
  endDate
);
```

### Custom Compliance Report

```typescript
const report = await this.auditService.generateComplianceReport(
  ComplianceType.GDPR,
  startDate,
  endDate
);
```

---

## Statistics & Analytics

### Get Audit Statistics

```typescript
const stats = await this.auditService.getAuditStatistics(
  startDate,
  endDate
);

// Stats contains:
// - totalLogs: number
// - phiAccessCount: number
// - failedOperations: number
// - byAction: Record<string, number>
// - byEntityType: Record<string, number>
// - byUser: Record<string, number>
// - bySeverity: Record<string, number>
// - byComplianceType: Record<string, number>
```

---

## Export Functionality

### Export to CSV

```typescript
const csv = await this.auditService.exportToCSV(
  {
    isPHI: true,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31')
  },
  true // include full details
);

// Return CSV as download
res.header('Content-Type', 'text/csv');
res.header('Content-Disposition', 'attachment; filename=audit-logs.csv');
res.send(csv);
```

### Export to JSON

```typescript
const json = await this.auditService.exportToJSON(
  { userId: specificUserId },
  false // summary only
);

// Return JSON as download
res.header('Content-Type', 'application/json');
res.header('Content-Disposition', 'attachment; filename=audit-logs.json');
res.send(json);
```

---

## Retention Policy

### Execute Retention Policy

```typescript
// Dry run to preview
const dryRun = await this.auditService.executeRetentionPolicy(true);
console.log(`Would delete: ${dryRun.deleted} logs`);
console.log(`Would retain: ${dryRun.retained} logs`);
console.log('Details:', dryRun.details);
// Details: { HIPAA_expired: 50, FERPA_expired: 30, GENERAL_expired: 100 }

// Actually execute
const result = await this.auditService.executeRetentionPolicy(false);
console.log(`Deleted: ${result.deleted} logs`);
```

---

## Context Object

The `ExecutionContext` object is used in most audit methods:

```typescript
interface ExecutionContext {
  userId?: string;          // ID of user performing action
  userName?: string;        // Name/email of user (for reporting)
  ipAddress?: string;       // Client IP address
  userAgent?: string;       // Client user agent string
  requestId?: string;       // Request correlation ID
  sessionId?: string;       // Session ID
}
```

### Creating Context from Express Request

```typescript
const context: ExecutionContext = {
  userId: req.user?.id,
  userName: req.user?.email,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  requestId: req.id,
  sessionId: req.session?.id
};
```

### Creating Context for System Operations

```typescript
const context: ExecutionContext = {
  userId: null,
  userName: 'SYSTEM',
  ipAddress: null,
  userAgent: null,
  requestId: null,
  sessionId: null
};
```

---

## PHI Entity Types

These entities automatically log all access for HIPAA compliance:

- `HealthRecord`
- `Allergy`
- `ChronicCondition`
- `Student`
- `StudentMedication`
- `MedicationLog`
- `IncidentReport`
- `EmergencyContact`
- `Vaccination`
- `Screening`
- `VitalSigns`
- `GrowthMeasurement`

---

## Audit Actions

Available audit action types:

```typescript
enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  BULK_DELETE = 'BULK_DELETE',
  BULK_UPDATE = 'BULK_UPDATE',
  TRANSACTION_COMMIT = 'TRANSACTION_COMMIT',
  TRANSACTION_ROLLBACK = 'TRANSACTION_ROLLBACK',
  CACHE_READ = 'CACHE_READ',
  CACHE_WRITE = 'CACHE_WRITE',
  CACHE_DELETE = 'CACHE_DELETE'
}
```

---

## Severity Levels

Available severity levels:

```typescript
enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}
```

---

## Compliance Types

Available compliance types:

```typescript
enum ComplianceType {
  HIPAA = 'HIPAA',
  FERPA = 'FERPA',
  GDPR = 'GDPR',
  GENERAL = 'GENERAL'
}
```

---

## Best Practices

### 1. Always Provide Context
```typescript
// Good
await this.auditService.logCreate('Student', student.id, context, data);

// Bad - missing context
await this.auditService.logCreate('Student', student.id, {}, data);
```

### 2. Log Failed Operations
```typescript
try {
  await this.performOperation();
  await this.auditService.logCreate('Entity', id, context, data);
} catch (error) {
  await this.auditService.logFailure(
    AuditAction.CREATE,
    'Entity',
    null,
    context,
    error.message
  );
  throw error;
}
```

### 3. Log Before Deletion
```typescript
// Get the entity data before deleting
const entity = await this.repository.findById(id);

// Delete the entity
await this.repository.delete(id);

// Log with the entity data
await this.auditService.logDelete('Entity', id, context, entity);
```

### 4. Use Bulk Operations for Multiple Changes
```typescript
// Instead of logging each deletion
for (const id of ids) {
  await this.repository.delete(id);
  await this.auditService.logDelete(...);  // Don't do this
}

// Log as a bulk operation
await this.repository.bulkDelete(ids);
await this.auditService.logBulkOperation(
  'BULK_DELETE',
  'Entity',
  context,
  { count: ids.length, ids }
);
```

### 5. Always Log PHI Exports
```typescript
const records = await this.getHealthRecords(filters);

// Log the export before sending
await this.auditService.logExport(
  'HealthRecord',
  context,
  {
    format: 'CSV',
    recordCount: records.length,
    filters: filters
  }
);

return records;
```

---

## Common Patterns

### Pattern 1: CRUD Service with Audit

```typescript
@Injectable()
export class StudentService {
  constructor(
    @Inject('IAuditLogger') private readonly auditService: AuditService,
    private readonly studentRepository: StudentRepository,
  ) {}

  async create(data: CreateStudentDto, context: ExecutionContext) {
    const student = await this.studentRepository.create(data);

    await this.auditService.logCreate(
      'Student',
      student.id,
      context,
      data
    );

    return student;
  }

  async update(id: string, data: UpdateStudentDto, context: ExecutionContext) {
    const existing = await this.studentRepository.findById(id);

    const changes = {};
    for (const [key, value] of Object.entries(data)) {
      if (existing[key] !== value) {
        changes[key] = { before: existing[key], after: value };
      }
    }

    const student = await this.studentRepository.update(id, data);

    await this.auditService.logUpdate(
      'Student',
      id,
      context,
      changes
    );

    return student;
  }

  async delete(id: string, context: ExecutionContext) {
    const student = await this.studentRepository.findById(id);

    await this.studentRepository.delete(id);

    await this.auditService.logDelete(
      'Student',
      id,
      context,
      student
    );

    return { success: true };
  }
}
```

### Pattern 2: Controller with Context

```typescript
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(
    @Body() data: CreateStudentDto,
    @Req() req: Request
  ) {
    const context = this.buildContext(req);
    return this.studentService.create(data, context);
  }

  private buildContext(req: Request): ExecutionContext {
    return {
      userId: req.user?.id,
      userName: req.user?.email,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.id,
      sessionId: req.session?.id
    };
  }
}
```

---

## Troubleshooting

### Audit Logs Not Appearing

1. **Check Model Registration**
   - Verify AuditLog is registered in DatabaseModule

2. **Check Database**
   - Ensure audit_logs table exists
   - Run migration if needed

3. **Check Errors**
   - Audit errors are logged but don't throw
   - Check application logs for audit service errors

### Performance Issues

1. **Check Indexes**
   - Verify indexes were created
   - Run `EXPLAIN ANALYZE` on slow queries

2. **Reduce PHI Logging**
   - PHI reads are logged by default
   - Consider adjusting isPHI criteria if too many logs

3. **Enable Partitioning**
   - For >1M audit logs, enable table partitioning

---

## Need More Help?

- Full Documentation: `/home/user/white-cross/.temp/completed/audit-points-documentation-DB9A7E.md`
- Implementation Summary: `/home/user/white-cross/AUDIT_IMPLEMENTATION_SUMMARY.md`
- Source Code: `/home/user/white-cross/nestjs-backend/src/database/services/audit.service.ts`

---

**Last Updated**: 2025-10-28
