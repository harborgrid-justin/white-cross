# Critical Database Migrations Execution Guide

**Generated:** 2025-11-05
**Migration Batch:** Critical Performance & Security Enhancements
**HIPAA Compliance:** All migrations maintain audit trail and PHI security requirements

---

## Overview

This guide covers the execution of four critical database migrations that enhance performance, security, and data integrity for the White Cross healthcare platform.

### Migration Files

1. **20251106000000-add-medication-log-foreign-key.js**
   - Adds foreign key constraint for medication administration records

2. **20251106000001-add-missing-critical-indexes.js**
   - Adds performance indexes for Allergy, ChronicCondition, StudentMedication models

3. **20251106000002-add-user-security-indexes.js**
   - Adds security monitoring indexes for user authentication and authorization

4. **20251106000003-add-fulltext-search-indexes.js**
   - Adds full-text search capabilities for inventory, students, and medications

---

## Pre-Migration Checklist

### 1. Database Backup

```bash
# Create full database backup
pg_dump -h localhost -U postgres -d white_cross_db -F c -b -v -f "backup_pre_critical_migrations_$(date +%Y%m%d_%H%M%S).backup"

# Verify backup integrity
pg_restore --list backup_pre_critical_migrations_*.backup | head -n 20
```

### 2. Environment Verification

```bash
# Check database connection
psql -h localhost -U postgres -d white_cross_db -c "SELECT version();"

# Verify PostgreSQL version (must be 9.6+ for full-text search)
psql -h localhost -U postgres -d white_cross_db -c "SHOW server_version;"

# Check available disk space (GIN indexes require significant space)
df -h

# Verify table sizes before migration
psql -h localhost -U postgres -d white_cross_db -c "
  SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
  FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename IN ('medication_logs', 'allergies', 'chronic_conditions',
                    'student_medications', 'users', 'inventory_items',
                    'students', 'medications')
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

### 3. Data Integrity Validation

```bash
# Check for orphaned medication log records (Migration 1 prerequisite)
psql -h localhost -U postgres -d white_cross_db -c "
  SELECT COUNT(*) as orphaned_records
  FROM medication_logs ml
  LEFT JOIN medications m ON ml.\"medicationId\" = m.id
  WHERE m.id IS NULL AND ml.\"medicationId\" IS NOT NULL;
"

# If orphaned records exist, fix them before running Migration 1
# Option A: Delete orphaned records (if data is invalid)
# Option B: Create placeholder medication records (if data should be preserved)
```

### 4. Downtime Window Planning

**Estimated Execution Time by Table Size:**

| Table Size | Migration 1 | Migration 2 | Migration 3 | Migration 4 | Total |
|-----------|-------------|-------------|-------------|-------------|-------|
| < 10k records | 2s | 5s | 3s | 10s | ~20s |
| 10k-100k | 5s | 10s | 5s | 30s | ~50s |
| 100k-500k | 10s | 30s | 10s | 60s | ~110s |
| 500k-1M | 15s | 60s | 15s | 120s | ~210s |

**Recommended Downtime Windows:**
- **Development:** No downtime required
- **Staging:** 5-10 minute maintenance window
- **Production:** 15-30 minute maintenance window (nights/weekends)

---

## Migration Execution Order

### Order of Execution

```
1. 20251106000000-add-medication-log-foreign-key.js
   └─ Reason: Data integrity must be established before performance optimizations

2. 20251106000001-add-missing-critical-indexes.js
   └─ Reason: Healthcare model indexes needed before search indexes

3. 20251106000002-add-user-security-indexes.js
   └─ Reason: Security monitoring must be in place before search features

4. 20251106000003-add-fulltext-search-indexes.js
   └─ Reason: Largest indexes, run last to minimize overall downtime
```

### Execution Commands

#### Development/Staging Environment

```bash
# Navigate to backend directory
cd /workspaces/white-cross/backend

# Run all migrations in sequence
npm run migration:run

# Or run migrations individually with detailed logging
npx sequelize-cli db:migrate --migrations-path src/database/migrations --to 20251106000000-add-medication-log-foreign-key.js
npx sequelize-cli db:migrate --migrations-path src/database/migrations --to 20251106000001-add-missing-critical-indexes.js
npx sequelize-cli db:migrate --migrations-path src/database/migrations --to 20251106000002-add-user-security-indexes.js
npx sequelize-cli db:migrate --migrations-path src/database/migrations --to 20251106000003-add-fulltext-search-indexes.js
```

#### Production Environment (Zero-Downtime Strategy)

For production environments, consider running migrations with `CONCURRENTLY` option enabled:

**Step 1: Modify migrations for concurrent index creation**

Edit each migration file and change:
```javascript
concurrently: false  // Change to true
```

**Step 2: Run migrations without downtime**

```bash
# Set production environment
export NODE_ENV=production

# Run migrations with concurrent index creation
npm run migration:run

# Monitor index creation progress
psql -h localhost -U postgres -d white_cross_db -c "
  SELECT
    now()::time,
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
  FROM pg_stat_user_indexes
  WHERE schemaname = 'public'
  ORDER BY pg_relation_size(indexrelid) DESC
  LIMIT 20;
"
```

---

## Post-Migration Verification

### 1. Migration Status Check

```bash
# Verify all migrations completed successfully
psql -h localhost -U postgres -d white_cross_db -c "
  SELECT name, executed_at
  FROM \"SequelizeMeta\"
  WHERE name LIKE '20251106%'
  ORDER BY name;
"

# Expected output: 4 rows with recent timestamps
```

### 2. Foreign Key Constraint Verification

```bash
# Verify medication_logs foreign key constraint
psql -h localhost -U postgres -d white_cross_db -c "
  SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.update_rule,
    rc.delete_rule
  FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
  JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
  WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'medication_logs'
  AND tc.constraint_name = 'fk_medication_logs_medication_id';
"

# Expected: 1 row with CASCADE update rule and RESTRICT delete rule
```

### 3. Index Verification

```bash
# Verify all critical indexes were created
psql -h localhost -U postgres -d white_cross_db -c "
  SELECT
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
    idx_scan as times_used,
    idx_tup_read as tuples_read
  FROM pg_stat_user_indexes
  WHERE schemaname = 'public'
  AND (
    indexname LIKE 'idx_allergies_%' OR
    indexname LIKE 'idx_chronic_conditions_%' OR
    indexname LIKE 'idx_student_medications_%' OR
    indexname LIKE 'idx_users_%' OR
    indexname LIKE 'idx_inventory_items_%' OR
    indexname LIKE 'idx_students_%' OR
    indexname LIKE 'idx_medications_%'
  )
  ORDER BY tablename, indexname;
"

# Expected: 34 indexes total
# - Allergies: 4 indexes
# - ChronicConditions: 4 indexes
# - StudentMedications: 4 indexes
# - Users: 11 indexes
# - InventoryItems: 3 indexes
# - Students: 3 indexes
# - Medications: 3 indexes
# - Additional: 2 indexes (allergen, condition search)
```

### 4. Full-Text Search Extension Verification

```bash
# Verify PostgreSQL extensions are enabled
psql -h localhost -U postgres -d white_cross_db -c "
  SELECT
    extname AS extension_name,
    extversion AS version
  FROM pg_extension
  WHERE extname IN ('pg_trgm', 'unaccent');
"

# Expected: 2 rows (pg_trgm and unaccent)
```

### 5. Performance Verification

```bash
# Test full-text search performance on medications
psql -h localhost -U postgres -d white_cross_db -c "
  EXPLAIN ANALYZE
  SELECT id, name, \"genericName\"
  FROM medications
  WHERE to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(\"genericName\", ''))
        @@ to_tsquery('english', 'aspirin')
  AND \"isActive\" = true
  AND \"deletedAt\" IS NULL;
"

# Expected: Should use idx_medications_fulltext_search (GIN index scan)
```

### 6. Security Index Performance Test

```bash
# Test user lockout query performance
psql -h localhost -U postgres -d white_cross_db -c "
  EXPLAIN ANALYZE
  SELECT id, email, \"lockoutUntil\", \"failedLoginAttempts\"
  FROM users
  WHERE \"lockoutUntil\" > NOW()
  AND \"isActive\" = true
  AND \"deletedAt\" IS NULL;
"

# Expected: Should use idx_users_active_lockouts (index scan)
```

---

## Rollback Procedures

### Complete Rollback (All Migrations)

```bash
# Rollback all four migrations in reverse order
npx sequelize-cli db:migrate:undo --name 20251106000003-add-fulltext-search-indexes.js
npx sequelize-cli db:migrate:undo --name 20251106000002-add-user-security-indexes.js
npx sequelize-cli db:migrate:undo --name 20251106000001-add-missing-critical-indexes.js
npx sequelize-cli db:migrate:undo --name 20251106000000-add-medication-log-foreign-key.js
```

### Partial Rollback (Single Migration)

```bash
# Rollback specific migration
npx sequelize-cli db:migrate:undo --name <migration-name>.js

# Example: Rollback full-text search indexes only
npx sequelize-cli db:migrate:undo --name 20251106000003-add-fulltext-search-indexes.js
```

### Emergency Rollback (Database Restore)

```bash
# If rollback fails, restore from backup
pg_restore -h localhost -U postgres -d white_cross_db -c -v backup_pre_critical_migrations_*.backup

# Verify restoration
psql -h localhost -U postgres -d white_cross_db -c "
  SELECT name, executed_at
  FROM \"SequelizeMeta\"
  ORDER BY executed_at DESC
  LIMIT 10;
"
```

---

## Troubleshooting

### Issue 1: Orphaned Records Prevent Foreign Key Creation

**Error:**
```
Data integrity violation: N medication_logs records reference non-existent medications
```

**Solution:**
```sql
-- Option A: Delete orphaned records
DELETE FROM medication_logs
WHERE "medicationId" IN (
  SELECT ml."medicationId"
  FROM medication_logs ml
  LEFT JOIN medications m ON ml."medicationId" = m.id
  WHERE m.id IS NULL AND ml."medicationId" IS NOT NULL
);

-- Option B: Create placeholder medications
INSERT INTO medications (id, name, "genericName", "dosageForm", strength, "isControlled", "requiresWitness", "isActive")
SELECT DISTINCT
  ml."medicationId",
  'Unknown Medication',
  'Unknown Generic',
  'Unknown Form',
  'Unknown Strength',
  false,
  false,
  false
FROM medication_logs ml
LEFT JOIN medications m ON ml."medicationId" = m.id
WHERE m.id IS NULL AND ml."medicationId" IS NOT NULL;
```

### Issue 2: Insufficient Disk Space for GIN Indexes

**Error:**
```
ERROR: could not extend file "base/16384/16385": No space left on device
```

**Solution:**
```bash
# Check available disk space
df -h

# Free up space by vacuuming
psql -h localhost -U postgres -d white_cross_db -c "VACUUM FULL;"

# Or temporarily disable CONCURRENTLY option to use less space
# Edit migration file: concurrently: false
```

### Issue 3: Concurrent Index Creation Timeout

**Error:**
```
ERROR: deadlock detected while waiting for lock
```

**Solution:**
```bash
# Increase statement timeout
psql -h localhost -U postgres -d white_cross_db -c "SET statement_timeout = '600000';"

# Or run migrations during low-traffic periods
# Or disable CONCURRENTLY option: concurrently: false
```

### Issue 4: pg_trgm Extension Not Available

**Error:**
```
ERROR: extension "pg_trgm" does not exist
```

**Solution:**
```bash
# Install PostgreSQL contrib package
sudo apt-get install postgresql-contrib

# Enable extension as superuser
psql -h localhost -U postgres -d white_cross_db -c "CREATE EXTENSION pg_trgm;"
```

---

## Performance Monitoring

### Index Usage Statistics

```bash
# Monitor index usage over time
psql -h localhost -U postgres -d white_cross_db -c "
  SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as times_used,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
    CASE
      WHEN idx_scan = 0 THEN 'UNUSED'
      WHEN idx_scan < 100 THEN 'LOW USAGE'
      WHEN idx_scan < 1000 THEN 'MODERATE USAGE'
      ELSE 'HIGH USAGE'
    END as usage_level
  FROM pg_stat_user_indexes
  WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
  ORDER BY idx_scan DESC
  LIMIT 50;
"
```

### Query Performance Analysis

```bash
# Enable query statistics
psql -h localhost -U postgres -d white_cross_db -c "
  CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
"

# Analyze slow queries
psql -h localhost -U postgres -d white_cross_db -c "
  SELECT
    query,
    calls,
    total_time,
    mean_time,
    max_time
  FROM pg_stat_statements
  WHERE query LIKE '%medication_logs%'
     OR query LIKE '%allergies%'
     OR query LIKE '%users%'
  ORDER BY mean_time DESC
  LIMIT 20;
"
```

---

## HIPAA Compliance Notes

### PHI Data Access Auditing

All migrations maintain HIPAA compliance by:

1. **Audit Logging**: All migrations log actions to console with timestamps
2. **Data Integrity**: Foreign key constraints prevent orphaned PHI data
3. **Access Control**: Indexes improve query performance without exposing PHI
4. **Full-Text Search**: Student name indexes are marked as PHI and require audit trails

### Required Audit Log Entries

After migration completion, ensure the following are logged:

- Migration execution timestamp
- User/service account that ran migrations
- Number of records affected
- PHI fields impacted (student names, etc.)
- Index creation completion status

### Post-Migration Security Review

```bash
# Review recent database access logs
# Check application logs for PHI access patterns
# Verify no unauthorized access during migration window
# Update security documentation with new indexes
```

---

## Success Criteria

- [ ] All 4 migrations executed successfully
- [ ] Foreign key constraint added: `fk_medication_logs_medication_id`
- [ ] 34 total indexes created (12 healthcare + 11 security + 11 full-text)
- [ ] No orphaned records in medication_logs
- [ ] PostgreSQL extensions enabled: pg_trgm, unaccent
- [ ] Index usage statistics show indexes being utilized
- [ ] Query performance improved for common healthcare workflows
- [ ] Security monitoring queries execute in < 100ms
- [ ] Full-text search queries return results in < 200ms
- [ ] Database backup created and verified
- [ ] HIPAA audit log entries recorded
- [ ] No application errors after migration
- [ ] Rollback procedures tested and documented

---

## Contact Information

**Migration Architect:** Sequelize Migrations Architect
**Date Created:** 2025-11-05
**Platform:** White Cross Healthcare System
**Database:** PostgreSQL 12+
**Framework:** Sequelize v6

For migration support, consult the Sequelize v6 documentation:
- https://sequelize.org/api/v6/
- https://sequelize.org/docs/v6/other-topics/migrations/

---

**End of Migration Execution Guide**
