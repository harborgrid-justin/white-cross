# Audit Logging Quick Reference

## TL;DR

✅ All PHI-containing models now use database audit logging instead of console.log
✅ All audit methods support optional transaction parameter for atomicity
✅ Model hooks automatically log PHI changes
✅ Use `@/database/services/model-audit-helper.service` in new model hooks

## Quick Examples

### 1. Model Hook (Most Common)

```typescript
import { logModelPHIFieldChanges } from '@/database/services/model-audit-helper.service';

@BeforeCreate
@BeforeUpdate
static async auditPHIAccess(instance: YourModel) {
  if (instance.changed()) {
    const changedFields = instance.changed() as string[];
    const phiFields = ['firstName', 'lastName', 'email']; // Your PHI fields

    const transaction = (instance as any).sequelize?.transaction || undefined;

    await logModelPHIFieldChanges(
      'YourModel',  // Entity type
      instance.id,
      changedFields,
      phiFields,
      transaction   // Critical: pass transaction
    );
  }
}
```

### 2. Service Transaction Pattern

```typescript
import { AuditService } from '@/database/services/audit.service';
import { createExecutionContext } from '@/database/types';

async updateStudent(id: string, data: UpdateDto, user: User) {
  const transaction = await this.sequelize.transaction();

  try {
    // 1. Perform database operation
    const result = await this.studentRepository.update(id, data, transaction);

    // 2. Log audit (within same transaction)
    await this.auditService.logUpdate(
      'Student',
      id,
      createExecutionContext(user.id, user.role),
      this.calculateChanges(existing, data),
      transaction  // Pass transaction
    );

    // 3. Commit (both data and audit log committed atomically)
    await transaction.commit();
    return result;

  } catch (error) {
    // 4. Rollback (both data and audit log rolled back)
    await transaction.rollback();
    throw error;
  }
}
```

### 3. Query Audit Logs

```typescript
// Get audit history for an entity
const history = await auditService.getEntityAuditHistory('Student', studentId);

// Query with filters
const result = await auditService.queryAuditLogs(
  {
    entityType: 'Student',
    isPHI: true,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31')
  },
  { page: 1, limit: 50 }
);

// Get PHI access logs (HIPAA compliance)
const phiLogs = await auditService.getPHIAccessLogs(
  new Date('2025-01-01'),
  new Date('2025-01-31')
);

// Generate compliance report
const report = await auditService.generateComplianceReport(
  ComplianceType.HIPAA,
  new Date('2025-01-01'),
  new Date('2025-12-31')
);
```

## Core Methods

### AuditService Methods

| Method | Purpose | Transaction Support |
|--------|---------|---------------------|
| `logCreate(entityType, entityId, context, data, transaction?)` | Log entity creation | ✅ Yes |
| `logUpdate(entityType, entityId, context, changes, transaction?)` | Log entity updates | ✅ Yes |
| `logDelete(entityType, entityId, context, data, transaction?)` | Log entity deletion | ✅ Yes |
| `logBulkOperation(action, entityType, context, metadata, transaction?)` | Log bulk ops | ✅ Yes |
| `logPHIAccess(options, transaction?)` | Log PHI access from hooks | ✅ Yes |
| `queryAuditLogs(filters, options)` | Query audit logs | N/A |
| `getEntityAuditHistory(entityType, entityId)` | Get entity history | N/A |
| `getPHIAccessLogs(startDate, endDate)` | Get PHI access | N/A |
| `generateComplianceReport(type, start, end)` | Generate reports | N/A |

### Helper Functions

| Function | Use Case |
|----------|----------|
| `logModelPHIFieldChanges(type, id, changed, phi, txn?)` | Models with specific PHI fields |
| `logModelPHIAccess(type, id, action, changed?, txn?)` | Models where all fields are PHI |

## ExecutionContext

All audit methods require an ExecutionContext:

```typescript
import { createExecutionContext, createSystemExecutionContext } from '@/database/types';

// From user request
const context = createExecutionContext(
  userId,
  userRole,
  request  // Express request object
);

// For system operations
const systemContext = createSystemExecutionContext(
  'scheduled-cleanup',
  { batchSize: 100 }
);
```

## Transaction Best Practices

### ✅ DO

```typescript
// DO: Pass transaction to audit methods
const transaction = await sequelize.transaction();
await auditService.logCreate('Student', id, context, data, transaction);
await transaction.commit();

// DO: Use try/catch/rollback pattern
try {
  await operation(transaction);
  await auditService.log(..., transaction);
  await transaction.commit();
} catch (error) {
  await transaction.rollback();
  throw error;
}

// DO: Extract transaction in model hooks
const transaction = (instance as any).sequelize?.transaction || undefined;
```

### ❌ DON'T

```typescript
// DON'T: Forget to pass transaction
const transaction = await sequelize.transaction();
await auditService.logCreate('Student', id, context, data);  // Missing transaction!
await transaction.commit();  // Audit log not in transaction!

// DON'T: Commit without audit logging
await this.model.update(data, { where: { id }, transaction });
await transaction.commit();  // Forgot to log!

// DON'T: Log outside transaction
await transaction.commit();
await auditService.log(..., transaction);  // Transaction already committed!
```

## Compliance Features

### PHI Entities (Automatically Flagged)

- HealthRecord, Allergy, ChronicCondition
- Student, StudentMedication, MedicationLog
- IncidentReport, EmergencyContact
- Vaccination, Screening, VitalSigns, GrowthMeasurement

### Sensitive Fields (Automatically Redacted)

- password, ssn, socialSecurityNumber
- taxId, creditCard, bankAccount
- apiKey, secret, token

### Retention Policies

- HIPAA: 7 years
- FERPA: 5 years
- GENERAL: 3 years

## Common Patterns

### Pattern 1: Model Hook with Specific PHI Fields

```typescript
@BeforeCreate
@BeforeUpdate
static async auditPHIAccess(instance: Student) {
  if (instance.changed()) {
    const changedFields = instance.changed() as string[];
    const phiFields = ['firstName', 'lastName', 'dateOfBirth'];

    const { logModelPHIFieldChanges } = await import('@/database/services/model-audit-helper.service');
    const transaction = (instance as any).sequelize?.transaction || undefined;

    await logModelPHIFieldChanges('Student', instance.id, changedFields, phiFields, transaction);
  }
}
```

### Pattern 2: Model Hook Where All Fields Are PHI

```typescript
@BeforeCreate
@BeforeUpdate
static async auditPHIAccess(instance: HealthRecord) {
  if (instance.changed()) {
    const changedFields = instance.changed() as string[];

    const { logModelPHIAccess } = await import('@/database/services/model-audit-helper.service');
    const transaction = (instance as any).sequelize?.transaction || undefined;

    await logModelPHIAccess('HealthRecord', instance.id, 'UPDATE', changedFields, transaction);
  }
}
```

### Pattern 3: Repository with Audit Logging

```typescript
async update(id: string, data: Partial<T>, context: ExecutionContext, transaction?: any) {
  const existing = await this.model.findByPk(id, { transaction });

  await this.model.update(data, { where: { id }, transaction });

  const updated = await this.model.findByPk(id, { transaction });

  // Log audit within transaction
  await this.auditService.logUpdate(
    this.entityName,
    id,
    context,
    this.calculateChanges(existing, updated),
    transaction  // Critical: pass transaction
  );

  return updated;
}
```

### Pattern 4: Bulk Operation with Audit

```typescript
async bulkUpdate(criteria: any, data: any, context: ExecutionContext) {
  const transaction = await this.sequelize.transaction();

  try {
    const [affectedCount] = await this.model.update(data, {
      where: criteria,
      transaction
    });

    await this.auditService.logBulkOperation(
      'BULK_UPDATE',
      'Student',
      context,
      { affectedCount, criteria },
      transaction
    );

    await transaction.commit();
    return affectedCount;

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

## Troubleshooting

### Issue: Audit logs not being created

```typescript
// Check: Is ModelAuditHelper initialized?
// Solution: Ensure DatabaseModule includes ModelAuditHelper in providers

// Check: Are you passing the transaction?
await auditService.logCreate(..., transaction);  // ✅ Correct
await auditService.logCreate(...);  // ❌ Missing transaction
```

### Issue: Transaction rollback doesn't rollback audit logs

```typescript
// Problem: Audit logged outside transaction
await transaction.commit();
await auditService.log(..., transaction);  // ❌ Too late!

// Solution: Log before commit
await auditService.log(..., transaction);  // ✅ Correct
await transaction.commit();
```

### Issue: Circular dependency error

```typescript
// Problem: Direct import in model
import { logModelPHIAccess } from '@/database/services/model-audit-helper.service';

// Solution: Dynamic import
const { logModelPHIAccess } = await import('@/database/services/model-audit-helper.service');
```

## Performance Tips

1. **Only PHI READ operations** are logged (for performance)
2. **Audit failures don't break operations** (logged and swallowed)
3. **Use proper indexes** when querying audit logs
4. **Run retention policies** regularly to manage size
5. **Batch bulk operations** when possible

## See Also

- [Comprehensive Guide](/src/database/AUDIT_LOGGING_GUIDE.md) - Complete documentation
- [Implementation Summary](/AUDIT_IMPLEMENTATION_SUMMARY.md) - Technical details
- [AuditService Source](/src/database/services/audit.service.ts) - Service implementation
- [ModelAuditHelper Source](/src/database/services/model-audit-helper.service.ts) - Helper functions

---

**Quick Help**: For questions or issues, refer to the comprehensive guide or check the implementation summary.
