# Critical Migrations - Quick Start Guide

**Quick reference for executing the four critical database migrations**

---

## TL;DR - Execute Migrations

```bash
cd /workspaces/white-cross/backend

# Create backup first!
npm run db:backup  # or use your backup command

# Run all migrations
npm run migration:run

# Verify success
npm run migration:status
```

---

## Pre-Flight Checklist

- [ ] Database backup created
- [ ] Backup verified and restorable
- [ ] No orphaned medication_logs records
- [ ] PostgreSQL 9.6+ installed
- [ ] Sufficient disk space (20-30% of DB size)
- [ ] Maintenance window scheduled (if production)

---

## Verify Orphaned Records

```bash
psql -h localhost -U postgres -d white_cross_db -c "
SELECT COUNT(*) as orphaned_records
FROM medication_logs ml
LEFT JOIN medications m ON ml.\"medicationId\" = m.id
WHERE m.id IS NULL AND ml.\"medicationId\" IS NOT NULL;
"
```

**Result should be:** `0 orphaned_records`

If not zero, fix data before running migrations (see CRITICAL_MIGRATIONS_EXECUTION_GUIDE.md)

---

## Execute Migrations

### Option 1: Run All at Once (Recommended for Dev/Staging)

```bash
npm run migration:run
```

### Option 2: Run One by One (Recommended for Production)

```bash
# Migration 1: Foreign Key Constraint (< 5s)
npx sequelize-cli db:migrate --to 20251106000000-add-medication-log-foreign-key.js

# Migration 2: Healthcare Indexes (10-30s)
npx sequelize-cli db:migrate --to 20251106000001-add-missing-critical-indexes.js

# Migration 3: Security Indexes (< 5s)
npx sequelize-cli db:migrate --to 20251106000002-add-user-security-indexes.js

# Migration 4: Full-Text Search (30-60s)
npx sequelize-cli db:migrate --to 20251106000003-add-fulltext-search-indexes.js
```

---

## Verify Success

### Check Migration Status

```bash
npx sequelize-cli db:migrate:status
```

**Expected output:**
```
up 20251106000000-add-medication-log-foreign-key.js
up 20251106000001-add-missing-critical-indexes.js
up 20251106000002-add-user-security-indexes.js
up 20251106000003-add-fulltext-search-indexes.js
```

### Verify Indexes Created

```bash
psql -h localhost -U postgres -d white_cross_db -c "
SELECT COUNT(*) as total_indexes
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
);
"
```

**Expected result:** `34 total_indexes` (or more if you had existing indexes)

### Verify Foreign Key

```bash
psql -h localhost -U postgres -d white_cross_db -c "
SELECT constraint_name, table_name
FROM information_schema.table_constraints
WHERE constraint_name = 'fk_medication_logs_medication_id';
"
```

**Expected output:** 1 row showing the constraint

---

## Rollback (If Needed)

### Rollback All Migrations

```bash
npx sequelize-cli db:migrate:undo:all --to 20251105999999
```

### Rollback Single Migration

```bash
# Rollback last migration
npx sequelize-cli db:migrate:undo

# Rollback specific migration
npx sequelize-cli db:migrate:undo --name 20251106000003-add-fulltext-search-indexes.js
```

---

## Emergency Restore

```bash
# If rollback fails, restore from backup
pg_restore -h localhost -U postgres -d white_cross_db -c -v backup_file.backup
```

---

## Common Issues

### Issue: Orphaned Records Error

**Solution:** Clean up orphaned records before running migrations
```sql
-- Delete orphaned medication logs
DELETE FROM medication_logs
WHERE "medicationId" NOT IN (SELECT id FROM medications);
```

### Issue: Disk Space Error

**Solution:** Free up space or extend disk
```bash
# Check available space
df -h

# Vacuum database
psql -h localhost -U postgres -d white_cross_db -c "VACUUM FULL;"
```

### Issue: pg_trgm Extension Missing

**Solution:** Install PostgreSQL contrib
```bash
sudo apt-get install postgresql-contrib
psql -h localhost -U postgres -d white_cross_db -c "CREATE EXTENSION pg_trgm;"
```

---

## Performance Testing

### Test Full-Text Search

```bash
psql -h localhost -U postgres -d white_cross_db -c "
EXPLAIN ANALYZE
SELECT id, name FROM medications
WHERE to_tsvector('english', name) @@ to_tsquery('english', 'aspirin')
AND \"isActive\" = true;
"
```

Should show: `Index Scan using idx_medications_fulltext_search`

### Test Security Index

```bash
psql -h localhost -U postgres -d white_cross_db -c "
EXPLAIN ANALYZE
SELECT id, email FROM users
WHERE \"lockoutUntil\" > NOW()
AND \"isActive\" = true;
"
```

Should show: `Index Scan using idx_users_active_lockouts`

---

## Migration Summary

| Migration | Duration | Impact |
|-----------|----------|--------|
| 1. Foreign Key | < 5s | Data integrity |
| 2. Healthcare Indexes | 10-30s | Query performance |
| 3. Security Indexes | < 5s | Security monitoring |
| 4. Full-Text Search | 30-60s | Search capabilities |
| **Total** | **~50-100s** | **34 indexes + 1 FK** |

---

## Files Reference

- **This File:** `QUICK_START.md`
- **Detailed Guide:** `CRITICAL_MIGRATIONS_EXECUTION_GUIDE.md`
- **Summary:** `MIGRATION_SUMMARY.md`

---

## Support

For detailed information, troubleshooting, and HIPAA compliance notes, see:
- `CRITICAL_MIGRATIONS_EXECUTION_GUIDE.md`

**Created:** 2025-11-05
**Status:** Ready for Execution
