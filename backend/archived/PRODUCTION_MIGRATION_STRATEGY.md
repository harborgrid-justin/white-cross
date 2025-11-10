# Production Migration Strategy

**White Cross School Health Management System**
**Version:** 1.0
**Last Updated:** 2025-11-03
**Classification:** CRITICAL - PRODUCTION OPERATIONS

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Migration Requirements](#pre-migration-requirements)
3. [Migration Execution Strategy](#migration-execution-strategy)
4. [Zero-Downtime Deployment Patterns](#zero-downtime-deployment-patterns)
5. [Rollback Procedures](#rollback-procedures)
6. [Monitoring & Verification](#monitoring--verification)
7. [Emergency Procedures](#emergency-procedures)
8. [HIPAA Compliance](#hipaa-compliance)

---

## Overview

This document defines the production migration strategy for White Cross healthcare platform. All production database migrations MUST follow these procedures to ensure:

- **Zero data loss**
- **Minimal downtime** (target: < 30 seconds)
- **HIPAA compliance** (audit trail, data integrity)
- **Safe rollback capability**
- **Performance preservation**

### Migration Risk Levels

| Level | Description | Approval Required | Maintenance Window |
|-------|-------------|-------------------|-------------------|
| **LOW** | Index creation, adding nullable columns | Database Admin | During business hours |
| **MEDIUM** | Adding non-nullable columns, modifying enums | Tech Lead + DBA | Off-peak hours |
| **HIGH** | Data migrations, removing columns | CTO + DBA | Scheduled maintenance |
| **CRITICAL** | Schema restructuring, foreign key changes | Executive approval | Planned downtime |

---

## Pre-Migration Requirements

### 1. Backup Verification (MANDATORY)

**All production migrations require verified backups:**

```bash
# 1. Create full database backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -b -v \
  -f "backup_before_migration_$(date +%Y%m%d_%H%M%S).dump"

# 2. Verify backup integrity
pg_restore -l backup_before_migration_*.dump | head -20

# 3. Test restore to staging
pg_restore -h $STAGING_HOST -U $STAGING_USER -d $STAGING_DB \
  backup_before_migration_*.dump

# 4. Store backup in secure location
aws s3 cp backup_before_migration_*.dump \
  s3://white-cross-backups/pre-migration/$(date +%Y/%m/%d)/
```

**Backup Retention:**
- Pre-migration backups: 90 days minimum
- Point-in-time recovery: 30 days
- HIPAA requirement: 7 years for PHI-related schema changes

### 2. Testing Requirements

**ALL migrations must pass testing in this order:**

1. **Local Development**
   ```bash
   # Run migration on local database
   NODE_ENV=development npm run migrate

   # Run rollback test
   NODE_ENV=development npm run migrate:undo

   # Re-apply
   NODE_ENV=development npm run migrate
   ```

2. **Automated Testing**
   ```bash
   # Run migration test suite
   npm test -- migration-rollback.test.js

   # Verify all tests pass
   # - Structure tests (up/down methods exist)
   # - Application tests (migrations run without errors)
   # - Rollback tests (migrations reverse cleanly)
   # - Idempotency tests (can run multiple times)
   ```

3. **Staging Environment**
   ```bash
   # Deploy to staging with production data copy
   NODE_ENV=staging npm run migrate

   # Verify application functionality
   # Perform smoke tests
   # Monitor performance metrics
   ```

4. **Performance Testing**
   ```bash
   # Measure migration execution time
   time NODE_ENV=staging npm run migrate

   # If migration takes > 1 minute, split into phases
   # If migration locks tables, plan maintenance window
   ```

### 3. Documentation Requirements

Before production migration, document:

- [ ] Migration purpose and scope
- [ ] Tables/columns affected
- [ ] Expected execution time
- [ ] Rollback procedure
- [ ] Post-migration verification steps
- [ ] Risk assessment and mitigation
- [ ] Communication plan

**Template:** Use `MIGRATION_CHECKLIST_TEMPLATE.md` (see appendix)

### 4. Communication & Approval

**Timeline:**
- **T-7 days:** Submit migration plan for review
- **T-5 days:** Security and compliance approval
- **T-3 days:** Stakeholder notification
- **T-1 day:** Final go/no-go decision
- **T-0:** Execute migration

**Stakeholders to Notify:**
- Engineering team
- Product team
- Customer support
- Compliance officer (for PHI-related changes)
- Infrastructure team

---

## Migration Execution Strategy

### Standard Migration Procedure

```bash
#!/bin/bash
# production-migrate.sh

set -e  # Exit on any error

# Configuration
DB_HOST="${DB_HOST:-production-db.example.com}"
DB_NAME="${DB_NAME:-white_cross_production}"
BACKUP_DIR="/var/backups/postgres/migrations"
LOG_FILE="/var/log/migrations/migration_$(date +%Y%m%d_%H%M%S).log"

echo "========================================" | tee -a $LOG_FILE
echo "Production Migration Started" | tee -a $LOG_FILE
echo "Timestamp: $(date)" | tee -a $LOG_FILE
echo "========================================" | tee -a $LOG_FILE

# Step 1: Pre-migration health check
echo "[1/8] Running pre-migration health check..." | tee -a $LOG_FILE
psql -h $DB_HOST -d $DB_NAME -c "SELECT version();" >> $LOG_FILE
psql -h $DB_HOST -d $DB_NAME -c "SELECT pg_database_size('$DB_NAME');" >> $LOG_FILE

# Step 2: Create backup
echo "[2/8] Creating database backup..." | tee -a $LOG_FILE
BACKUP_FILE="$BACKUP_DIR/backup_before_migration_$(date +%Y%m%d_%H%M%S).dump"
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -b -v -f $BACKUP_FILE >> $LOG_FILE 2>&1

# Step 3: Verify backup
echo "[3/8] Verifying backup integrity..." | tee -a $LOG_FILE
pg_restore -l $BACKUP_FILE | head -20 >> $LOG_FILE

# Step 4: Check migration status
echo "[4/8] Checking migration status..." | tee -a $LOG_FILE
npx sequelize-cli db:migrate:status | tee -a $LOG_FILE

# Step 5: Execute migration
echo "[5/8] Executing migration..." | tee -a $LOG_FILE
START_TIME=$(date +%s)
NODE_ENV=production npm run migrate 2>&1 | tee -a $LOG_FILE
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
echo "Migration completed in ${DURATION} seconds" | tee -a $LOG_FILE

# Step 6: Verify migration success
echo "[6/8] Verifying migration success..." | tee -a $LOG_FILE
npx sequelize-cli db:migrate:status | tee -a $LOG_FILE

# Step 7: Run post-migration verification queries
echo "[7/8] Running verification queries..." | tee -a $LOG_FILE
source ./verify-migration.sh | tee -a $LOG_FILE

# Step 8: Health check
echo "[8/8] Post-migration health check..." | tee -a $LOG_FILE
psql -h $DB_HOST -d $DB_NAME -c "
  SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
  LIMIT 10;
" >> $LOG_FILE

echo "========================================" | tee -a $LOG_FILE
echo "Migration Completed Successfully" | tee -a $LOG_FILE
echo "========================================" | tee -a $LOG_FILE

# Send notification
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d "{\"text\":\"✅ Production migration completed in ${DURATION}s\"}"
```

### Post-Migration Verification Script

```bash
#!/bin/bash
# verify-migration.sh

# Verify table existence
echo "Verifying table structure..."
psql -h $DB_HOST -d $DB_NAME -c "
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name;
"

# Verify foreign keys
echo "Verifying foreign key constraints..."
psql -h $DB_HOST -d $DB_NAME -c "
  SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
  FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
  WHERE tc.constraint_type = 'FOREIGN KEY'
  ORDER BY tc.table_name, tc.constraint_name;
"

# Verify indexes
echo "Verifying indexes..."
psql -h $DB_HOST -d $DB_NAME -c "
  SELECT
    tablename,
    indexname,
    indexdef
  FROM pg_indexes
  WHERE schemaname = 'public'
  ORDER BY tablename, indexname;
"

# Check for missing indexes on foreign keys
echo "Checking for missing indexes on foreign keys..."
psql -h $DB_HOST -d $DB_NAME -c "
  SELECT
    tc.table_name,
    kcu.column_name
  FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND NOT EXISTS (
      SELECT 1
      FROM pg_indexes
      WHERE tablename = tc.table_name
        AND indexdef LIKE '%' || kcu.column_name || '%'
    )
  ORDER BY tc.table_name, kcu.column_name;
"

# Verify row counts (sanity check)
echo "Verifying row counts..."
psql -h $DB_HOST -d $DB_NAME -c "
  SELECT
    schemaname,
    tablename,
    n_live_tup as row_count
  FROM pg_stat_user_tables
  WHERE schemaname = 'public'
  ORDER BY n_live_tup DESC;
"
```

---

## Zero-Downtime Deployment Patterns

### Pattern 1: Additive Changes (Safest)

**Use for:** Adding nullable columns, adding indexes, adding tables

**Procedure:**
```javascript
// Phase 1: Add nullable column (backward compatible)
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'newFeatureFlag', {
      type: Sequelize.BOOLEAN,
      allowNull: true,  // NULL initially
      defaultValue: null
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'newFeatureFlag');
  }
};

// Deploy application code that works with both NULL and non-NULL values

// Phase 2: Populate data
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      UPDATE "users"
      SET "newFeatureFlag" = false
      WHERE "newFeatureFlag" IS NULL
    `);
  }
};

// Phase 3: Make non-nullable (after verification)
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'newFeatureFlag', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  }
};
```

**Downtime:** 0 seconds

### Pattern 2: Column Rename/Type Change

**Use for:** Renaming columns, changing column types

**Procedure:**
```javascript
// Phase 1: Add new column
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'statusNew', {
      type: Sequelize.ENUM('pending', 'processing', 'completed', 'cancelled'),
      allowNull: true
    });

    // Copy data
    await queryInterface.sequelize.query(`
      UPDATE "orders"
      SET "statusNew" =
        CASE
          WHEN "statusOld" = 'new' THEN 'pending'
          WHEN "statusOld" = 'in_progress' THEN 'processing'
          WHEN "statusOld" = 'done' THEN 'completed'
          ELSE 'cancelled'
        END
    `);
  }
};

// Deploy application code that writes to BOTH columns

// Phase 2: Make new column non-nullable
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('orders', 'statusNew', {
      type: Sequelize.ENUM('pending', 'processing', 'completed', 'cancelled'),
      allowNull: false
    });
  }
};

// Deploy application code that reads from new column, writes to both

// Phase 3: Remove old column
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('orders', 'statusOld');
  }
};

// Deploy application code that only uses new column
```

**Downtime:** 0 seconds (requires 3 deployments)

### Pattern 3: Large Data Migration

**Use for:** Migrating millions of rows, complex transformations

**Procedure:**
```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const BATCH_SIZE = 1000;
    let offset = 0;
    let hasMore = true;

    console.log('Starting batched data migration...');

    while (hasMore) {
      const transaction = await queryInterface.sequelize.transaction();

      try {
        const [records] = await queryInterface.sequelize.query(`
          SELECT id, "oldField"
          FROM "LargeTable"
          WHERE "newField" IS NULL
          LIMIT ${BATCH_SIZE}
        `, { transaction });

        if (records.length === 0) {
          hasMore = false;
          await transaction.commit();
          break;
        }

        // Transform and update
        for (const record of records) {
          await queryInterface.sequelize.query(`
            UPDATE "LargeTable"
            SET "newField" = :newValue
            WHERE id = :id
          `, {
            replacements: {
              id: record.id,
              newValue: transformData(record.oldField)
            },
            transaction
          });
        }

        await transaction.commit();
        offset += BATCH_SIZE;

        console.log(`Processed ${offset} records...`);

        // Small delay to prevent overwhelming database
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }

    console.log('Data migration completed.');
  }
};
```

**Downtime:** 0 seconds (runs in background)

**Monitoring:** Track progress with:
```sql
SELECT
  COUNT(*) FILTER (WHERE "newField" IS NULL) as remaining,
  COUNT(*) FILTER (WHERE "newField" IS NOT NULL) as completed,
  COUNT(*) as total,
  ROUND(100.0 * COUNT(*) FILTER (WHERE "newField" IS NOT NULL) / COUNT(*), 2) as percent_complete
FROM "LargeTable";
```

---

## Rollback Procedures

### Immediate Rollback Decision Criteria

Rollback IMMEDIATELY if:
- Migration fails with error
- Post-migration verification fails
- Application errors spike > 5% within 5 minutes
- Database performance degrades > 50%
- Data integrity issues detected
- HIPAA compliance violation

### Rollback Execution

```bash
#!/bin/bash
# rollback-migration.sh

set -e

echo "=========================================="
echo "ROLLBACK INITIATED"
echo "Timestamp: $(date)"
echo "=========================================="

# Step 1: Stop application traffic (if needed)
echo "[1/6] Diverting traffic..."
# Update load balancer, set maintenance mode, etc.

# Step 2: Verify current migration status
echo "[2/6] Checking migration status..."
npx sequelize-cli db:migrate:status

# Step 3: Create pre-rollback backup
echo "[3/6] Creating pre-rollback backup..."
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -b -v \
  -f "backup_before_rollback_$(date +%Y%m%d_%H%M%S).dump"

# Step 4: Execute rollback
echo "[4/6] Executing rollback..."
NODE_ENV=production npm run migrate:undo

# Step 5: Verify rollback
echo "[5/6] Verifying rollback..."
npx sequelize-cli db:migrate:status
source ./verify-migration.sh

# Step 6: Restore application traffic
echo "[6/6] Restoring traffic..."
# Restore load balancer, exit maintenance mode

echo "=========================================="
echo "ROLLBACK COMPLETED"
echo "=========================================="
```

### Catastrophic Failure Recovery

If rollback fails or data corruption occurs:

```bash
# 1. Immediately stop all application traffic
# 2. Restore from pre-migration backup
pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME \
  -c --if-exists \
  backup_before_migration_TIMESTAMP.dump

# 3. Verify restore
psql -h $DB_HOST -d $DB_NAME -c "SELECT COUNT(*) FROM students;"

# 4. Run integrity checks
psql -h $DB_HOST -d $DB_NAME -c "
  SELECT
    table_name,
    pg_size_pretty(pg_total_relation_size(table_name::regclass)) as size
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name;
"

# 5. Notify incident response team
# 6. Conduct post-mortem analysis
```

---

## Monitoring & Verification

### Real-time Monitoring During Migration

**Monitor these metrics:**

1. **Database Performance**
   ```sql
   -- Active connections
   SELECT COUNT(*) FROM pg_stat_activity WHERE datname = 'white_cross_production';

   -- Long-running queries
   SELECT pid, now() - pg_stat_activity.query_start AS duration, query
   FROM pg_stat_activity
   WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';

   -- Table locks
   SELECT * FROM pg_locks WHERE NOT granted;
   ```

2. **Application Health**
   - Error rate in monitoring dashboard
   - Response time percentiles (p50, p95, p99)
   - Request throughput

3. **Data Integrity**
   ```sql
   -- Row counts before/after
   SELECT COUNT(*) FROM critical_table;

   -- Foreign key violations
   SELECT * FROM your_table WHERE fk_column NOT IN (SELECT id FROM referenced_table);

   -- NULL values in non-nullable columns
   SELECT column_name
   FROM information_schema.columns
   WHERE table_name = 'your_table'
   AND is_nullable = 'NO'
   AND column_default IS NULL;
   ```

### Post-Migration Validation Queries

```sql
-- 1. Verify all foreign keys are valid
DO $$
DECLARE
  r RECORD;
  violations INTEGER;
BEGIN
  FOR r IN
    SELECT tc.table_name, kcu.column_name, ccu.table_name AS foreign_table, ccu.column_name AS foreign_column
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
  LOOP
    EXECUTE format('
      SELECT COUNT(*) FROM %I
      WHERE %I IS NOT NULL
      AND %I NOT IN (SELECT %I FROM %I)
    ', r.table_name, r.column_name, r.column_name, r.foreign_column, r.foreign_table)
    INTO violations;

    IF violations > 0 THEN
      RAISE NOTICE 'FK violation in %.% -> %.%: % orphaned rows',
        r.table_name, r.column_name, r.foreign_table, r.foreign_column, violations;
    END IF;
  END LOOP;
END $$;

-- 2. Verify indexes exist on all foreign keys
SELECT
  tc.table_name,
  kcu.column_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_indexes
      WHERE tablename = tc.table_name
      AND indexdef LIKE '%' || kcu.column_name || '%'
    ) THEN 'YES'
    ELSE 'MISSING'
  END as has_index
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name, kcu.column_name;

-- 3. Verify no data loss
SELECT
  'students' as table_name,
  COUNT(*) as row_count,
  MIN("createdAt") as oldest_record,
  MAX("createdAt") as newest_record
FROM students
UNION ALL
SELECT 'health_records', COUNT(*), MIN("createdAt"), MAX("createdAt") FROM health_records
UNION ALL
SELECT 'medications', COUNT(*), MIN("createdAt"), MAX("createdAt") FROM medications;
```

---

## Emergency Procedures

### Emergency Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| Database Admin | [Name] | [Phone] | [Email] |
| Tech Lead | [Name] | [Phone] | [Email] |
| CTO | [Name] | [Phone] | [Email] |
| HIPAA Officer | [Name] | [Phone] | [Email] |

### Incident Response Playbook

**Severity Levels:**

| Level | Description | Response Time | Actions |
|-------|-------------|---------------|---------|
| **P0 - Critical** | Data loss, corruption, or HIPAA breach | Immediate | Stop migration, rollback, restore from backup |
| **P1 - High** | Migration failure, application errors > 10% | < 15 min | Rollback migration, investigate |
| **P2 - Medium** | Performance degradation > 50% | < 30 min | Monitor, prepare rollback |
| **P3 - Low** | Minor issues, < 5% error rate | < 2 hours | Document, fix in next release |

**P0 Critical Incident Response:**

1. **Immediate Actions (0-5 minutes)**
   - Stop migration execution
   - Enable maintenance mode
   - Alert incident response team
   - Begin rollback procedure

2. **Containment (5-15 minutes)**
   - Complete rollback or restore from backup
   - Verify data integrity
   - Document incident timeline

3. **Recovery (15-30 minutes)**
   - Restore application functionality
   - Verify system health
   - Communicate status to stakeholders

4. **Post-Incident (1-24 hours)**
   - Conduct post-mortem
   - Document root cause
   - Create prevention plan
   - Update procedures

---

## HIPAA Compliance

### Audit Trail Requirements

**All production migrations must log:**

1. **Who:** User executing migration
2. **What:** Migration file name and changes
3. **When:** Exact timestamp
4. **Where:** Database and environment
5. **Why:** Business justification
6. **Result:** Success/failure status

**Audit Log Format:**
```json
{
  "timestamp": "2025-11-03T10:30:00Z",
  "executor": "database-admin@whitecross.health",
  "migration": "20251103000000-add-patient-consent-tracking.js",
  "environment": "production",
  "database": "white_cross_production",
  "tables_affected": ["patients", "consents"],
  "phi_impact": true,
  "justification": "JIRA-1234: Add patient consent tracking for HIPAA compliance",
  "backup_location": "s3://white-cross-backups/2025/11/03/pre-migration-103000.dump",
  "duration_seconds": 45,
  "status": "success",
  "verification_status": "passed",
  "rollback_tested": true
}
```

### PHI-Impacting Migrations

**Additional requirements for migrations affecting PHI:**

1. **Data Privacy Impact Assessment (DPIA)**
   - Document before migration
   - Security review required
   - Privacy officer sign-off

2. **Encryption Verification**
   - Verify encryption at rest
   - Verify encryption in transit
   - Test access controls

3. **Access Logging**
   - Enable query logging during migration
   - Monitor access patterns
   - Review logs post-migration

4. **Data Retention Compliance**
   - Verify backup retention policies
   - Document data transformations
   - Maintain audit trail for 7 years

---

## Appendix

### Migration Checklist Template

```markdown
# Migration Checklist: [MIGRATION_NAME]

**Date:** YYYY-MM-DD
**Executor:** [Name]
**Reviewers:** [Names]

## Pre-Migration

- [ ] Migration tested in development
- [ ] Migration tested in staging
- [ ] Automated tests passing
- [ ] Performance impact assessed
- [ ] Backup created and verified
- [ ] Rollback procedure documented
- [ ] Stakeholders notified
- [ ] Approval obtained
- [ ] Emergency contacts confirmed

## Migration Details

**Tables Affected:**
- [ ] [table1]
- [ ] [table2]

**Estimated Duration:** X minutes

**Expected Downtime:** X seconds

**PHI Impact:** Yes/No

## Execution

- [ ] Database backup completed
- [ ] Backup verified
- [ ] Migration executed
- [ ] Verification queries passed
- [ ] Performance metrics normal
- [ ] Application health normal
- [ ] No errors in logs

## Post-Migration

- [ ] Data integrity verified
- [ ] Foreign keys valid
- [ ] Indexes created
- [ ] Row counts match expected
- [ ] Application smoke tests passed
- [ ] Stakeholders notified
- [ ] Audit log updated
- [ ] Documentation updated

## Rollback (if needed)

- [ ] Rollback reason documented
- [ ] Rollback executed
- [ ] Rollback verified
- [ ] Incident report created
- [ ] Post-mortem scheduled

**Notes:**
[Add any relevant notes]
```

---

**Document Version:** 1.0
**Maintained By:** Database Team
**Next Review:** 2025-12-01
**Classification:** INTERNAL - PRODUCTION OPERATIONS

