# Sequelize Migration Quick Reference Guide

## Overview

This guide provides quick commands and reference information for managing Sequelize migrations in the White Cross healthcare platform.

## File Locations

- **Migrations Directory:** `backend/src/migrations/`
- **Sequelize Config:** `backend/.sequelizerc`
- **Database Config:** `backend/src/config/database.js`
- **Prisma Schema:** `backend/prisma/schema.prisma`

## Migration Files

### Current Migrations (in order)

1. `20241002000000-init-database-schema.js` - Initial schema
2. `20251003162519-add-viewer-counselor-roles.js` - Role additions
3. `20251009011130-add-administration-features.js` - Admin features
4. `20251009013303-enhance-system-configuration.js` - Config system
5. `20251010000000-complete-health-records-schema.js` - Health records
6. `20251011000000-performance-indexes.js` - Performance optimization

## Common Commands

### Run All Pending Migrations

```bash
cd backend
npx sequelize-cli db:migrate
```

### Check Migration Status

```bash
npx sequelize-cli db:migrate:status
```

Output will show:
- `up` - Migration has been applied
- `down` - Migration is pending

### Rollback Last Migration

```bash
npx sequelize-cli db:migrate:undo
```

### Rollback Specific Migration

```bash
npx sequelize-cli db:migrate:undo --name 20251011000000-performance-indexes.js
```

### Rollback All Migrations (DANGEROUS - Use with caution)

```bash
npx sequelize-cli db:migrate:undo:all
```

### Run Specific Migration

```bash
npx sequelize-cli db:migrate --to 20251010000000-complete-health-records-schema.js
```

## Creating New Migrations

### Generate Migration File

```bash
npx sequelize-cli migration:generate --name descriptive-migration-name
```

### Migration Template

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Your migration code here

      await transaction.commit();
      console.log('✓ Migration completed successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Your rollback code here

      await transaction.commit();
      console.log('✓ Rollback completed successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Rollback failed:', error);
      throw error;
    }
  }
};
```

## Database Operations

### Backup Database

```bash
# PostgreSQL backup
pg_dump -U postgres -d white_cross -F c -f backup_$(date +%Y%m%d_%H%M%S).dump

# SQL format backup
pg_dump -U postgres -d white_cross > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
# From custom format
pg_restore -U postgres -d white_cross -c backup.dump

# From SQL file
psql -U postgres -d white_cross < backup.sql
```

### Connect to Database

```bash
psql -U postgres -d white_cross
```

## Testing Migrations

### Development Workflow

```bash
# 1. Backup database
pg_dump white_cross > backup_before_test.sql

# 2. Run migration
npx sequelize-cli db:migrate

# 3. Test application
npm run dev

# 4. If issues occur, rollback
npx sequelize-cli db:migrate:undo

# 5. Restore backup if needed
psql white_cross < backup_before_test.sql
```

### Verification Queries

```sql
-- List all tables
\dt

-- Describe a table
\d table_name

-- List all enums
\dT

-- Show enum values
SELECT enum_range(NULL:::"EnumName");

-- List all indexes
SELECT * FROM pg_indexes WHERE schemaname = 'public';

-- Check foreign keys
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

## Migration Best Practices

### DO ✅

- Always use transactions
- Always implement both `up` and `down` methods
- Test migrations in development first
- Backup database before running migrations
- Use descriptive migration names
- Add comments to complex migrations
- Use `IF NOT EXISTS` / `IF EXISTS` for idempotency
- Check for existing data before altering columns
- Use proper error handling

### DON'T ❌

- Don't run migrations directly in production without testing
- Don't skip backing up the database
- Don't modify existing migration files after they've been run
- Don't use destructive operations without safeguards
- Don't forget to update Sequelize models after schema changes
- Don't ignore migration errors
- Don't rollback in production without a plan

## Common Migration Patterns

### Adding a Column

```javascript
await queryInterface.addColumn('table_name', 'column_name', {
  type: Sequelize.STRING,
  allowNull: true,
  defaultValue: 'default_value'
}, { transaction });
```

### Removing a Column

```javascript
await queryInterface.removeColumn('table_name', 'column_name', { transaction });
```

### Creating a Table

```javascript
await queryInterface.createTable('table_name', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, { transaction });
```

### Creating an Index

```javascript
await queryInterface.addIndex('table_name', ['column1', 'column2'], {
  name: 'index_name',
  unique: false,
  transaction
});
```

### Creating an Enum

```javascript
await queryInterface.sequelize.query(`
  CREATE TYPE "EnumName" AS ENUM ('VALUE1', 'VALUE2', 'VALUE3');
`, { transaction });
```

### Adding Enum Value

```javascript
await queryInterface.sequelize.query(`
  ALTER TYPE "EnumName" ADD VALUE IF NOT EXISTS 'NEW_VALUE';
`, { transaction });
```

### Adding Foreign Key

```javascript
await queryInterface.addColumn('table_name', 'foreignKey', {
  type: Sequelize.STRING,
  allowNull: true,
  references: {
    model: 'referenced_table',
    key: 'id'
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
}, { transaction });
```

### Conditional Migration (checking for existing data)

```javascript
const [results] = await queryInterface.sequelize.query(`
  SELECT column_name
  FROM information_schema.columns
  WHERE table_name = 'my_table' AND column_name = 'my_column';
`, { transaction });

if (results.length === 0) {
  // Column doesn't exist, safe to add
  await queryInterface.addColumn('my_table', 'my_column', {
    type: Sequelize.STRING,
    allowNull: true
  }, { transaction });
}
```

## Troubleshooting

### Migration Won't Run

**Problem:** Migration shows as pending but won't execute

**Solution:**
```bash
# Check database connection
npx sequelize-cli db:migrate:status

# Check for syntax errors
node -c src/migrations/your-migration-file.js

# Check database logs
tail -f /var/log/postgresql/postgresql-*.log
```

### Migration Failed Partway

**Problem:** Migration failed and database is in inconsistent state

**Solution:**
```bash
# 1. Check SequelizeMeta table
SELECT * FROM "SequelizeMeta";

# 2. Manually remove failed migration entry if needed
DELETE FROM "SequelizeMeta" WHERE name = 'failed-migration-name.js';

# 3. Restore from backup
psql white_cross < backup.sql

# 4. Fix migration code and retry
npx sequelize-cli db:migrate
```

### Enum Value Cannot Be Removed

**Problem:** Need to remove an enum value in PostgreSQL

**Solution:** Enum values cannot be removed directly in PostgreSQL. You must:

```sql
-- 1. Create new enum with desired values
CREATE TYPE "NewEnumName" AS ENUM ('VALUE1', 'VALUE2');

-- 2. Update all references to use new enum
ALTER TABLE table_name ALTER COLUMN column_name TYPE "NewEnumName"
  USING column_name::text::"NewEnumName";

-- 3. Drop old enum
DROP TYPE "OldEnumName";

-- 4. Rename new enum to old name
ALTER TYPE "NewEnumName" RENAME TO "OldEnumName";
```

### Foreign Key Constraint Violation

**Problem:** Cannot drop table due to foreign key dependencies

**Solution:**
```sql
-- Find all foreign keys referencing the table
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
  AND ccu.table_name = 'your_table';

-- Drop constraints first, then drop table
ALTER TABLE dependent_table DROP CONSTRAINT constraint_name;
DROP TABLE your_table;
```

## Performance Monitoring

### Check Index Usage

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

### Check Table Sizes

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;
```

### Check Index Sizes

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

## Environment-Specific Notes

### Development

- Feel free to experiment
- Can rollback and re-run migrations
- Backup before major changes

### Staging

- Must match production environment
- Test all migrations here first
- Verify application functionality
- Performance test with realistic data

### Production

- **ALWAYS backup before migrations**
- Plan maintenance windows
- Have rollback plan ready
- Monitor during and after migration
- Use transaction-wrapped migrations
- Never skip testing in staging

## Emergency Rollback Procedure

```bash
# 1. Immediately backup current state
pg_dump white_cross > emergency_backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Restore from last known good backup
psql white_cross < last_good_backup.sql

# 3. Verify application functionality
curl http://localhost:3001/api/health

# 4. Check database integrity
psql white_cross -c "SELECT COUNT(*) FROM users;"

# 5. Document what happened
echo "Rollback performed at $(date)" >> rollback_log.txt
```

## Support Resources

- **Sequelize Documentation:** https://sequelize.org/docs/v6/other-topics/migrations/
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Project README:** `../README.md`
- **Migration Summary:** `../MIGRATION_SUMMARY.md`

---

**Last Updated:** 2025-10-11
**Database:** PostgreSQL 15+
**ORM:** Sequelize 6.x
