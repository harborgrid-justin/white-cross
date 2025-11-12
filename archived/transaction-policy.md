# Database Transaction Isolation Policy

## Overview
This document defines the transaction isolation levels, retry policies, and best practices for database operations in the White Cross Health Management System.

## Transaction Isolation Levels

### Default Isolation Level: READ COMMITTED

**Rationale**:
- Prevents dirty reads (reading uncommitted changes from other transactions)
- Allows non-repeatable reads (acceptable for most health record operations)
- Better concurrency than SERIALIZABLE
- Sufficient for most healthcare data operations

**Configuration** (PostgreSQL):
```sql
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

### When to Use REPEATABLE READ

Use for operations that:
1. **Financial calculations**: Budget transactions, billing operations
2. **Medication dosage calculations**: Where consistency across reads is critical
3. **Multi-step validation**: Where data must remain consistent throughout transaction

**Example**:
```typescript
await sequelize.transaction(
  { isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ },
  async (t) => {
    // Multi-step operations requiring consistent reads
  }
);
```

### When to Use SERIALIZABLE

**Rarely Used** - Only for critical operations:
1. **System configuration changes**: Affecting multiple tables and services
2. **Medication order validation**: Preventing concurrent conflicts
3. **Audit trail finalization**: Ensuring no concurrent modifications

**Warning**: SERIALIZABLE increases likelihood of serialization failures requiring retry logic.

## Deadlock and Retry Policy

### Automatic Retry Logic

All critical database operations MUST use the transaction utility service with automatic retry:

```typescript
import { withTransactionRetry } from '@/database/services/transaction-utility.service';

await withTransactionRetry(async (transaction) => {
  // Your transactional operations
}, {
  maxRetries: 3,
  isolationLevel: 'READ_COMMITTED'
});
```

### Retry Strategy

1. **Max Retries**: 3 attempts
2. **Backoff**: Exponential with jitter
   - 1st retry: 100-200ms
   - 2nd retry: 300-500ms
   - 3rd retry: 800-1200ms
3. **Retryable Errors**:
   - Deadlock detected (PostgreSQL: 40P01)
   - Serialization failure (PostgreSQL: 40001)
   - Lock timeout (PostgreSQL: 55P03)
4. **Non-Retryable Errors**:
   - Constraint violations
   - Data validation errors
   - Permission errors

### Deadlock Prevention Strategies

1. **Consistent Lock Order**: Always acquire locks in same order (e.g., Student → Medication → MedicationLog)
2. **Short Transactions**: Keep transactions as brief as possible
3. **Batch Operations**: Use batch updates instead of row-by-row updates
4. **Avoid User Input**: Don't wait for user input within transactions
5. **Index Foreign Keys**: Ensure all foreign keys have supporting indexes

## Transaction Scope Guidelines

### Operations Requiring Transactions

1. **Multi-Table Updates**:
   ```typescript
   // Student record + health record + audit log
   await withTransactionRetry(async (t) => {
     await Student.update(data, { where: { id }, transaction: t });
     await HealthRecord.create(healthData, { transaction: t });
     await AuditLog.create(auditData, { transaction: t });
   });
   ```

2. **Medication Administration**:
   ```typescript
   // Inventory update + medication log + student record
   await withTransactionRetry(async (t) => {
     await InventoryItem.decrement('quantity', { where: { id }, transaction: t });
     await MedicationLog.create(logData, { transaction: t });
     await Student.update({ lastMedicationAt: new Date() }, { where: { id }, transaction: t });
   });
   ```

3. **Financial Operations**:
   ```typescript
   // Budget transaction + category update + audit
   await withTransactionRetry(
     async (t) => {
       await BudgetTransaction.create(txData, { transaction: t });
       await BudgetCategory.increment('spent', { by: amount, where: { id }, transaction: t });
       await AuditLog.create(auditData, { transaction: t });
     },
     { isolationLevel: 'REPEATABLE_READ' }
   );
   ```

### Operations NOT Requiring Transactions

1. **Single-Row Reads**: Simple SELECT queries
2. **Single-Row Inserts**: Creating single records (unless dependent on other data)
3. **Idempotent Operations**: Operations that can safely be retried
4. **Audit Log Writes**: Can use separate transaction or skip transaction

## Transaction Best Practices

### DO:
✅ Keep transactions as short as possible
✅ Use indexes on all WHERE clause columns
✅ Batch operations when possible (bulkCreate, bulkUpdate)
✅ Use FOR UPDATE locks explicitly when needed
✅ Handle serialization failures with retry logic
✅ Use savepoints for nested operations
✅ Release resources (connections) promptly
✅ Log transaction start/end for debugging

### DON'T:
❌ Perform HTTP requests within transactions
❌ Wait for user input within transactions
❌ Perform file I/O within transactions
❌ Use transactions for read-only operations
❌ Nest transactions without savepoints
❌ Hold transactions open during long calculations
❌ Ignore serialization failure errors

## Savepoint Usage

For complex operations with multiple rollback points:

```typescript
await sequelize.transaction(async (t) => {
  // Step 1: Update student
  await Student.update(data, { where: { id }, transaction: t });

  // Savepoint before risky operation
  await t.createSavepoint('before_medication_log');

  try {
    // Step 2: Create medication log (might fail)
    await MedicationLog.create(logData, { transaction: t });
  } catch (error) {
    // Rollback to savepoint only
    await t.rollbackToSavepoint('before_medication_log');
    // Continue with alternative flow
  }

  // Step 3: Final operations
  await AuditLog.create(auditData, { transaction: t });
});
```

## Monitoring and Alerting

### Metrics to Monitor

1. **Transaction Duration**: Alert if >500ms
2. **Deadlock Frequency**: Alert if >5 per hour
3. **Serialization Failures**: Alert if >10 per hour
4. **Lock Wait Time**: Alert if >100ms average
5. **Transaction Retry Rate**: Alert if >5% of transactions

### Query for Monitoring (PostgreSQL)

```sql
-- Long-running transactions
SELECT
  pid,
  now() - xact_start AS duration,
  state,
  query
FROM pg_stat_activity
WHERE state != 'idle'
  AND xact_start IS NOT NULL
  AND now() - xact_start > interval '500 milliseconds'
ORDER BY duration DESC;

-- Deadlock count (requires pg_stat_statements extension)
SELECT COUNT(*)
FROM pg_stat_database
WHERE deadlocks > 0;
```

## Error Handling Examples

### TypeScript/Sequelize Example

```typescript
import { Transaction } from 'sequelize';
import { DatabaseError } from 'sequelize';

try {
  await withTransactionRetry(async (t) => {
    // Your operations
  });
} catch (error) {
  if (error instanceof DatabaseError) {
    switch (error.original?.code) {
      case '40P01': // Deadlock detected
        logger.error('Deadlock detected after retries', { error });
        throw new ConflictException('Operation failed due to concurrent access');

      case '40001': // Serialization failure
        logger.error('Serialization failure after retries', { error });
        throw new ConflictException('Operation failed due to data conflict');

      case '23505': // Unique constraint violation
        throw new ConflictException('Duplicate record exists');

      default:
        throw error;
    }
  }
  throw error;
}
```

## Compliance Considerations

### HIPAA Transaction Integrity

1. **Audit Trail**: All PHI modifications MUST create audit log entries in same transaction
2. **Data Consistency**: Patient records must be consistent across related tables
3. **Access Control**: Transaction isolation prevents unauthorized concurrent access
4. **Data Integrity**: Transactions ensure no partial updates to health records

### Example: HIPAA-Compliant Update

```typescript
await withTransactionRetry(async (t) => {
  // 1. Update the PHI
  const student = await Student.update(
    { medicalHistory: newData },
    { where: { id: studentId }, transaction: t, returning: true }
  );

  // 2. Create audit log (same transaction - REQUIRED)
  await AuditLog.create(
    {
      userId: currentUser.id,
      action: 'UPDATE',
      resourceType: 'Student',
      resourceId: studentId,
      changes: { medicalHistory: 'REDACTED' }, // Don't log PHI in audit
      ipAddress: request.ip,
      timestamp: new Date()
    },
    { transaction: t }
  );

  // 3. Update access timestamp
  await PHIAccess.create(
    {
      userId: currentUser.id,
      studentId: studentId,
      accessType: 'MODIFY',
      timestamp: new Date()
    },
    { transaction: t }
  );
});
```

## References

- [PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Sequelize Transactions](https://sequelize.org/docs/v6/other-topics/transactions/)
- HIPAA Security Rule: 164.312(c)(1) - Integrity Controls
- HIPAA Security Rule: 164.312(c)(2) - Mechanism to Authenticate

## Change History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-07 | 1.0 | Initial transaction policy | Database Architect |
