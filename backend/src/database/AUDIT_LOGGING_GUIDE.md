# Comprehensive Audit Logging Guide

## Overview

This guide documents the comprehensive audit log persistence service that has been implemented to replace console logging with HIPAA-compliant database persistence. The system provides transaction-aware, PHI-conscious audit logging across all data access operations.

## Architecture

### Components

1. **AuditService** (`/src/database/services/audit.service.ts`)
   - Core service implementing `IAuditLogger` interface
   - Provides comprehensive audit logging methods
   - Supports transaction-aware logging
   - Handles PHI data sanitization

2. **ModelAuditHelper** (`/src/database/services/model-audit-helper.service.ts`)
   - Singleton service for model hooks
   - Bridges Sequelize static hooks with NestJS dependency injection
   - Provides convenience methods for PHI logging

3. **AuditLog Model** (`/src/database/models/audit-log.model.ts`)
   - Immutable audit log records
   - Indexed for performance (entityType, entityId, userId, createdAt, isPHI, etc.)
   - Supports HIPAA, FERPA, and GDPR compliance tracking

4. **IAuditLogger Interface** (`/src/database/interfaces/audit/audit-logger.interface.ts`)
   - Contract for audit logging operations
   - All methods support optional transaction parameter

## Integration Points

### 1. Model Hooks

All PHI-containing models now use the audit service for tracking changes:

#### Student Model
- **PHI Fields**: firstName, lastName, dateOfBirth, medicalRecordNum, photo
- **Location**: `/src/database/models/student.model.ts`
- **Hook**: `@BeforeCreate` and `@BeforeUpdate`

#### User Model
- **PHI Fields**: email, firstName, lastName, phone
- **Location**: `/src/database/models/user.model.ts`
- **Hook**: `@BeforeCreate` and `@BeforeUpdate`

#### HealthRecord Model
- **PHI Fields**: All fields (entire record is PHI)
- **Location**: `/src/database/models/health-record.model.ts`
- **Hook**: `@BeforeCreate` and `@BeforeUpdate`

#### EmergencyContact Model
- **PHI Fields**: firstName, lastName, phoneNumber, email, address
- **Location**: `/src/database/models/emergency-contact.model.ts`
- **Hook**: `@BeforeCreate` and `@BeforeUpdate`

### 2. Repository Pattern

The `BaseRepository` class automatically logs all CRUD operations:

```typescript
// Example from BaseRepository
await this.auditLogger.logCreate(
  this.entityName,
  result.id as string,
  context,
  this.sanitizeForAudit(result.get()),
  transaction // Transaction passed for atomicity
);
```

**Location**: `/src/database/repositories/base/base.repository.ts`

### 3. Service Layer

Services should include audit logging in transactions:

```typescript
// Example pattern for service operations
async updateStudent(id: string, data: UpdateStudentDto, userId: string) {
  const transaction = await this.sequelize.transaction();

  try {
    const student = await this.studentRepository.update(id, data, {
      userId,
      userRole: 'NURSE',
      timestamp: new Date()
    }, transaction);

    // Audit logging happens automatically in repository
    // Additional audit logs can be added here if needed

    await transaction.commit();
    return student;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

## AuditService Methods

### Core CRUD Methods

#### logCreate
```typescript
async logCreate(
  entityType: string,
  entityId: string,
  context: ExecutionContext,
  data: Record<string, unknown>,
  transaction?: any
): Promise<void>
```

**Purpose**: Log entity creation events
**Example**:
```typescript
await auditService.logCreate(
  'Student',
  student.id,
  { userId: 'user-123', userRole: 'NURSE', timestamp: new Date() },
  { firstName: 'John', lastName: 'Doe' },
  transaction
);
```

#### logUpdate
```typescript
async logUpdate(
  entityType: string,
  entityId: string,
  context: ExecutionContext,
  changes: Record<string, { before: unknown; after: unknown }>,
  transaction?: any
): Promise<void>
```

**Purpose**: Log entity updates with before/after values
**Example**:
```typescript
await auditService.logUpdate(
  'Student',
  student.id,
  context,
  {
    firstName: { before: 'John', after: 'Jonathan' },
    gradeLevel: { before: '10', after: '11' }
  },
  transaction
);
```

#### logDelete
```typescript
async logDelete(
  entityType: string,
  entityId: string,
  context: ExecutionContext,
  data: Record<string, unknown>,
  transaction?: any
): Promise<void>
```

**Purpose**: Log entity deletions with final state
**Example**:
```typescript
await auditService.logDelete(
  'Student',
  student.id,
  context,
  student.toJSON(),
  transaction
);
```

#### logBulkOperation
```typescript
async logBulkOperation(
  operation: string,
  entityType: string,
  context: ExecutionContext,
  metadata: Record<string, unknown>,
  transaction?: any
): Promise<void>
```

**Purpose**: Log bulk operations affecting multiple records
**Example**:
```typescript
await auditService.logBulkOperation(
  'BULK_UPDATE',
  'Student',
  context,
  { count: 50, filter: { schoolId: 'school-123' } },
  transaction
);
```

### PHI-Specific Method

#### logPHIAccess
```typescript
async logPHIAccess(
  options: {
    entityType: string;
    entityId: string;
    action: 'CREATE' | 'UPDATE' | 'READ' | 'DELETE';
    changedFields?: string[];
    userId?: string;
    userName?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
  },
  transaction?: any
): Promise<void>
```

**Purpose**: Log PHI access from model hooks
**Example**:
```typescript
await auditService.logPHIAccess(
  {
    entityType: 'Student',
    entityId: student.id,
    action: 'UPDATE',
    changedFields: ['firstName', 'dateOfBirth'],
    userId: 'user-123'
  },
  transaction
);
```

### Query and Reporting Methods

#### queryAuditLogs
```typescript
async queryAuditLogs(
  filters: AuditLogFilters = {},
  options: AuditLogQueryOptions = {}
): Promise<{ logs: AuditLog[]; total: number; page: number; pages: number }>
```

**Purpose**: Query audit logs with filters and pagination
**Example**:
```typescript
const result = await auditService.queryAuditLogs(
  {
    entityType: 'Student',
    isPHI: true,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31')
  },
  {
    page: 1,
    limit: 50,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  }
);
```

#### getEntityAuditHistory
```typescript
async getEntityAuditHistory(
  entityType: string,
  entityId: string,
  options?: AuditLogQueryOptions
): Promise<AuditLog[]>
```

**Purpose**: Get complete audit trail for a specific entity
**Example**:
```typescript
const history = await auditService.getEntityAuditHistory(
  'Student',
  'student-123'
);
```

#### getPHIAccessLogs
```typescript
async getPHIAccessLogs(
  startDate: Date,
  endDate: Date,
  options?: AuditLogQueryOptions
): Promise<AuditLog[]>
```

**Purpose**: Get all PHI access logs for HIPAA compliance
**Example**:
```typescript
const phiLogs = await auditService.getPHIAccessLogs(
  new Date('2025-01-01'),
  new Date('2025-01-31')
);
```

#### generateComplianceReport
```typescript
async generateComplianceReport(
  complianceType: ComplianceType,
  startDate: Date,
  endDate: Date
): Promise<ComplianceReport>
```

**Purpose**: Generate HIPAA/FERPA compliance reports
**Example**:
```typescript
const report = await auditService.generateComplianceReport(
  ComplianceType.HIPAA,
  new Date('2025-01-01'),
  new Date('2025-12-31')
);
```

## Model Hook Integration

### Using logModelPHIFieldChanges

This is the recommended approach for most models:

```typescript
import { logModelPHIFieldChanges } from '../services/model-audit-helper.service';

@BeforeCreate
@BeforeUpdate
static async auditPHIAccess(instance: YourModel) {
  if (instance.changed()) {
    const changedFields = instance.changed() as string[];
    const phiFields = ['field1', 'field2', 'field3'];

    const transaction = (instance as any).sequelize?.transaction || undefined;

    await logModelPHIFieldChanges(
      'YourModel',
      instance.id,
      changedFields,
      phiFields,
      transaction
    );
  }
}
```

### Using logModelPHIAccess

For models where all fields are PHI (like HealthRecord):

```typescript
import { logModelPHIAccess } from '../services/model-audit-helper.service';

@BeforeCreate
@BeforeUpdate
static async auditPHIAccess(instance: YourModel) {
  if (instance.changed()) {
    const changedFields = instance.changed() as string[];
    const transaction = (instance as any).sequelize?.transaction || undefined;

    await logModelPHIAccess(
      'YourModel',
      instance.id,
      'UPDATE',
      changedFields,
      transaction
    );
  }
}
```

## Transaction Support

All audit logging methods support an optional transaction parameter to ensure atomicity:

### Example: Transactional Update with Audit
```typescript
async updateWithAudit(id: string, data: any, context: ExecutionContext) {
  const transaction = await this.sequelize.transaction();

  try {
    // 1. Fetch existing record
    const existing = await this.model.findByPk(id, { transaction });

    // 2. Update the record
    await this.model.update(data, {
      where: { id },
      transaction
    });

    // 3. Log the audit entry (within same transaction)
    await this.auditService.logUpdate(
      'EntityType',
      id,
      context,
      calculateChanges(existing, data),
      transaction // IMPORTANT: Pass transaction
    );

    // 4. Commit transaction (audit log is saved atomically)
    await transaction.commit();
  } catch (error) {
    // 5. Rollback includes audit log
    await transaction.rollback();
    throw error;
  }
}
```

## ExecutionContext

All audit methods require an `ExecutionContext` object:

```typescript
interface ExecutionContext {
  userId?: string | null;
  userRole: ExecutionUserRole;
  ipAddress?: string | null;
  userAgent?: string | null;
  transactionId?: string;
  correlationId?: string;
  timestamp: Date;
  userName?: string;
  requestId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}
```

### Creating ExecutionContext

```typescript
import { createExecutionContext } from '@/database/types';

// From HTTP request
const context = createExecutionContext(
  userId,
  userRole,
  request
);

// For system operations
import { createSystemExecutionContext } from '@/database/types';

const systemContext = createSystemExecutionContext(
  'scheduled-cleanup',
  { batchSize: 100 }
);
```

## Data Sanitization

The audit service automatically sanitizes sensitive data before storage:

### Sensitive Fields (Always Redacted)
- password
- ssn / socialSecurityNumber
- taxId
- creditCard
- bankAccount
- apiKey
- secret
- token

### PHI Detection

PHI entity types are automatically detected:
- HealthRecord
- Allergy
- ChronicCondition
- Student
- StudentMedication
- MedicationLog
- IncidentReport
- EmergencyContact
- Vaccination
- Screening
- VitalSigns
- GrowthMeasurement

## Compliance Features

### HIPAA Compliance
- All PHI access is logged
- 7-year retention policy
- Immutable audit records
- IP address and user agent tracking
- Failed access attempt logging

### FERPA Compliance
- Student data access tracking
- 5-year retention policy
- Academic record access logging

### Audit Log Retention

```typescript
// Execute retention policy (dry run)
const result = await auditService.executeRetentionPolicy(true);

// Execute retention policy (actual deletion)
const result = await auditService.executeRetentionPolicy(false);
```

## Querying and Reporting

### Filter Options

```typescript
interface AuditLogFilters {
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: AuditAction;
  isPHI?: boolean;
  complianceType?: ComplianceType;
  severity?: AuditSeverity;
  success?: boolean;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  searchTerm?: string;
}
```

### Pagination Options

```typescript
interface AuditLogQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
```

### Export Functionality

```typescript
// Export to CSV
const csv = await auditService.exportToCSV(
  { isPHI: true, startDate, endDate },
  true // Include full details
);

// Export to JSON
const json = await auditService.exportToJSON(
  { entityType: 'Student', userId: 'user-123' },
  false // Basic details only
);
```

## Performance Considerations

### Indexes
The AuditLog model has comprehensive indexes for optimal query performance:
- Single-column indexes: userId, entityType, entityId, action, createdAt, isPHI, etc.
- Composite indexes: (entityType, entityId, createdAt), (userId, createdAt), etc.
- GIN indexes: tags array, metadata JSONB, changes JSONB

### Caching
- Only PHI entity access is logged (for performance)
- Audit log creation failures don't break operations
- Asynchronous logging where appropriate

### Transaction Overhead
- Audit logs within transactions add minimal overhead
- Failed transactions automatically rollback audit logs
- No orphaned audit entries

## Testing

### Unit Testing Audit Logging

```typescript
describe('AuditService', () => {
  it('should log student creation with transaction', async () => {
    const transaction = await sequelize.transaction();

    try {
      await auditService.logCreate(
        'Student',
        'student-123',
        context,
        { firstName: 'John' },
        transaction
      );

      await transaction.commit();

      const logs = await auditService.getEntityAuditHistory('Student', 'student-123');
      expect(logs).toHaveLength(1);
      expect(logs[0].action).toBe(AuditAction.CREATE);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  });
});
```

## Migration from Console Logging

Models that previously used console.log have been updated:

### Before (Console Logging)
```typescript
@BeforeUpdate
static async auditPHIAccess(instance: Student) {
  if (instance.changed()) {
    console.log(`[AUDIT] PHI modified for student ${instance.id}`);
    // TODO: Integrate with AuditLog service
  }
}
```

### After (Database Persistence)
```typescript
@BeforeUpdate
static async auditPHIAccess(instance: Student) {
  if (instance.changed()) {
    const changedFields = instance.changed() as string[];
    const phiFields = ['firstName', 'lastName', 'dateOfBirth'];

    const { logModelPHIFieldChanges } = await import('../services/model-audit-helper.service');
    const transaction = (instance as any).sequelize?.transaction || undefined;

    await logModelPHIFieldChanges(
      'Student',
      instance.id,
      changedFields,
      phiFields,
      transaction
    );
  }
}
```

## Best Practices

1. **Always pass transactions**: When performing database operations within a transaction, always pass the transaction to audit methods
2. **Use ExecutionContext**: Always create proper ExecutionContext objects with user and request information
3. **PHI awareness**: Mark all PHI entities and fields correctly
4. **Error handling**: Audit failures shouldn't break business operations
5. **Query optimization**: Use indexes and filters when querying audit logs
6. **Retention policy**: Run retention policy cleanup regularly
7. **Compliance reporting**: Generate compliance reports monthly/quarterly
8. **Security**: Restrict access to audit logs to authorized personnel only

## Security Considerations

1. **Immutability**: Audit logs cannot be modified after creation
2. **Sanitization**: Sensitive fields are automatically redacted
3. **Access Control**: Implement proper authorization for audit log access
4. **Encryption**: Audit logs are stored in encrypted database
5. **Retention**: Compliance-based retention policies are enforced
6. **Monitoring**: Failed audit log creation should trigger alerts

## Troubleshooting

### Issue: Audit logs not being created
**Solution**: Ensure ModelAuditHelper is initialized by checking DatabaseModule providers

### Issue: Transaction rollback doesn't rollback audit logs
**Solution**: Verify transaction is being passed to audit methods

### Issue: Performance degradation
**Solution**:
- Check if indexes are created
- Verify only PHI access is being logged for read operations
- Consider batching bulk operations

### Issue: Circular dependency errors
**Solution**: Use dynamic imports in model hooks as shown in examples

## Summary

The comprehensive audit logging system provides:
- ✅ HIPAA and FERPA compliant logging
- ✅ Transaction-aware persistence
- ✅ PHI-specific tracking
- ✅ Automatic data sanitization
- ✅ Comprehensive querying and reporting
- ✅ Performance-optimized indexes
- ✅ Retention policy management
- ✅ Export functionality (CSV, JSON)
- ✅ Integration with all PHI models
- ✅ BaseRepository automatic logging

All console logging has been replaced with persistent database audit trails that support atomic transactions and comply with healthcare data regulations.
