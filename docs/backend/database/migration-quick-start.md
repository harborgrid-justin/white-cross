# Quick Start: Migration Execution Guide

## Prerequisites

1. Database connection configured in `backend/src/database/config/sequelize.ts`
2. PostgreSQL 15 running
3. Database created: `white_cross_db`

## Step-by-Step Execution

### 1. Check Current Status
```bash
cd backend
npx sequelize-cli db:migrate:status
```

### 2. Run All New Migrations
```bash
npx sequelize-cli db:migrate
```

Expected output:
```
== 20250111000000-add-medication-enhanced-fields: migrating =======
== 20250111000000-add-medication-enhanced-fields: migrated (0.123s)

== 20251011170700-add-user-security-enhancements: migrating =======
== 20251011170700-add-user-security-enhancements: migrated (0.234s)

== 20251011170701-add-student-validation-constraints: migrating =======
== 20251011170701-add-student-validation-constraints: migrated (0.145s)

== 20251011170702-add-emergency-contact-validation: migrating =======
== 20251011170702-add-emergency-contact-validation: migrated (0.167s)

== 20251011170703-add-emergency-contact-enhanced-fields: migrating =======
== 20251011170703-add-emergency-contact-enhanced-fields: migrated (0.089s)

== 20251011170704-add-document-validation-constraints: migrating =======
== 20251011170704-add-document-validation-constraints: migrated (0.198s)

== 20251011170705-add-document-phi-tracking: migrating =======
== 20251011170705-add-document-phi-tracking: migrated (0.176s)
```

### 3. Verify Migrations
```bash
npx sequelize-cli db:migrate:status
```

All migrations should show "up" status.

### 4. Test Application
```bash
npm run dev:backend
```

Check for any model synchronization errors in the console.

## Quick Commands Reference

| Task | Command |
|------|---------|
| Run all pending migrations | `npx sequelize-cli db:migrate` |
| Check migration status | `npx sequelize-cli db:migrate:status` |
| Undo last migration | `npx sequelize-cli db:migrate:undo` |
| Undo all migrations | `npx sequelize-cli db:migrate:undo:all` |
| Run to specific migration | `npx sequelize-cli db:migrate --to FILENAME` |
| Create new migration | `npx sequelize-cli migration:generate --name description` |

## Troubleshooting Quick Fixes

### Error: "Column already exists"
```bash
# Rollback and re-run
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate
```

### Error: "Constraint violation"
```sql
-- Check problematic data
SELECT * FROM users WHERE "dateOfBirth" >= CURRENT_DATE;

-- Fix data, then re-run migration
```

### Error: "Cannot connect to database"
```bash
# Verify PostgreSQL is running
sudo service postgresql status

# Check connection string
cat backend/src/database/config/sequelize.ts
```

## Migration Order (New Migrations Only)

1. `20250111000000-add-medication-enhanced-fields.js` ✅
2. `20251011170700-add-user-security-enhancements.js`
3. `20251011170701-add-student-validation-constraints.js`
4. `20251011170702-add-emergency-contact-validation.js`
5. `20251011170703-add-emergency-contact-enhanced-fields.js`
6. `20251011170704-add-document-validation-constraints.js`
7. `20251011170705-add-document-phi-tracking.js`

## Emergency Rollback

If something goes wrong:
```bash
# Rollback all new migrations
npx sequelize-cli db:migrate:undo:all --to 00010-create-documents.ts

# Verify database state
psql -U your_user -d white_cross_db -c "\dt"

# Re-apply migrations one by one
npx sequelize-cli db:migrate --to 20251011170700-add-user-security-enhancements.js
# ... and so on
```

## Validation After Migration

### Check Tables
```sql
-- Users table
\d+ users

-- Students table
\d+ students

-- Emergency contacts table
\d+ emergency_contacts

-- Documents table
\d+ documents

-- Medications table
\d+ medications

-- Medication logs table
\d+ medication_logs
```

### Check Constraints
```sql
-- List all CHECK constraints
SELECT
  tc.table_name,
  tc.constraint_name,
  cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.constraint_type = 'CHECK'
ORDER BY tc.table_name, tc.constraint_name;
```

### Check Indexes
```sql
-- List all indexes
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

## Success Criteria

✅ All migrations show "up" status
✅ No errors in migration logs
✅ Application starts without errors
✅ All CHECK constraints active
✅ All indexes created
✅ Models sync with database

## Support

See `MIGRATION_SUMMARY.md` for detailed information about each migration.
