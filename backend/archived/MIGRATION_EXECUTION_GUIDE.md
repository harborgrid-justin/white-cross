# Database Migration Execution Guide

## Overview

This guide provides step-by-step instructions for fixing and executing the remaining 3 failed migrations in the White Cross healthcare platform backend.

## Current Status

### ✅ Successfully Executed (3 migrations):
1. `20250103000000-create-base-schema.js`
2. `20250103000001-create-health-records-core.js`
3. `20250103000002-create-additional-critical-tables.js`

### ❌ Failed/Pending (3 migrations):
4. `20251009013303-enhance-system-configuration.js` - **FAILED** (missing prerequisite table)
5. `20251010000000-complete-health-records-schema.js` - **BLOCKED** (data type issues)
6. `20251011000000-performance-indexes.js` - **BLOCKED** (waiting for #4, #5)

---

## Root Cause Analysis

### Issue #1: Missing `system_configurations` Table
**Migration:** `20251009013303-enhance-system-configuration.js`

**Problem:**
- Attempts to ALTER a table that doesn't exist
- No previous migration creates the base `system_configurations` table
- Creates `configuration_history` with foreign key to non-existent table

**Solution:** ✅ Created new migration `20250103000003-create-system-configuration.js`

### Issue #2: Data Type Mismatches
**Migration:** `20251010000000-complete-health-records-schema.js`

**Problem:**
- Uses STRING/TEXT for ID columns instead of UUID
- Foreign key data types don't match referenced tables
- Would cause referential integrity failures

**Solution:** ✅ Created fixed version `20251010000000-complete-health-records-schema-FIXED.js`

### Issue #3: Performance Indexes Migration
**Migration:** `20251011000000-performance-indexes.js`

**Status:** ✅ No issues - Already has proper conditional table checks

---

## Fix Implementation Steps

### Step 1: Backup Current Database (CRITICAL)

```bash
# Create backup of current database
pg_dump -h $DB_HOST -U $DB_USERNAME -d $DB_NAME -F c -b -v -f "backup_$(date +%Y%m%d_%H%M%S).dump"

# Or if using Docker:
docker exec -it white-cross-postgres pg_dump -U $DB_USERNAME -d $DB_NAME -F c -b -v -f "/backups/backup_$(date +%Y%m%d_%H%M%S).dump"
```

### Step 2: Verify New Migration Files Exist

```bash
ls -la /workspaces/white-cross/backend/src/database/migrations/

# You should see:
# - 20250103000003-create-system-configuration.js (NEW)
# - 20251010000000-complete-health-records-schema-FIXED.js (NEW)
```

### Step 3: Replace Original Migration with Fixed Version

```bash
cd /workspaces/white-cross/backend/src/database/migrations/

# Backup original file
mv 20251010000000-complete-health-records-schema.js 20251010000000-complete-health-records-schema.js.ORIGINAL

# Use fixed version
mv 20251010000000-complete-health-records-schema-FIXED.js 20251010000000-complete-health-records-schema.js
```

### Step 4: Verify Migration Order

```bash
npx sequelize-cli db:migrate:status

# Expected output:
# up   20250103000000-create-base-schema.js
# up   20250103000001-create-health-records-core.js
# up   20250103000002-create-additional-critical-tables.js
# down 20250103000003-create-system-configuration.js       ← NEW
# down 20251009013303-enhance-system-configuration.js
# down 20251010000000-complete-health-records-schema.js
# down 20251011000000-performance-indexes.js
```

### Step 5: Execute Migrations

```bash
# Run all pending migrations
npx sequelize-cli db:migrate

# Expected sequence:
# 1. 20250103000003-create-system-configuration.js       ✓
# 2. 20251009013303-enhance-system-configuration.js      ✓
# 3. 20251010000000-complete-health-records-schema.js    ✓
# 4. 20251011000000-performance-indexes.js               ✓
```

### Step 6: Verify Migration Success

```bash
# Check migration status
npx sequelize-cli db:migrate:status

# All should show 'up':
# up   20250103000000-create-base-schema.js
# up   20250103000001-create-health-records-core.js
# up   20250103000002-create-additional-critical-tables.js
# up   20250103000003-create-system-configuration.js
# up   20251009013303-enhance-system-configuration.js
# up   20251010000000-complete-health-records-schema.js
# up   20251011000000-performance-indexes.js
```

### Step 7: Verify Database Schema

Create a verification script:

```bash
# Create verification script
cat > verify-schema.js << 'EOF'
const Sequelize = require('sequelize');
const config = require('./src/database/config/database.config.js');

const sequelize = new Sequelize(config.development);

async function verifySchema() {
  try {
    console.log('Verifying database schema...\n');

    // Check critical tables exist
    const [tables] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    const tableNames = tables.map(t => t.table_name);
    console.log(`✓ Found ${tableNames.length} tables\n`);

    const requiredTables = [
      'districts', 'schools', 'users', 'students', 'contacts',
      'health_records', 'allergies', 'chronic_conditions', 'appointments',
      'medications', 'student_medications', 'medication_logs',
      'incident_reports', 'emergency_contacts',
      'system_configurations', 'configuration_history',
      'vaccinations', 'screenings', 'growth_measurements', 'vital_signs'
    ];

    console.log('Checking required tables:');
    let allPresent = true;
    for (const table of requiredTables) {
      const exists = tableNames.includes(table);
      console.log(`  ${exists ? '✓' : '✗'} ${table}`);
      if (!exists) allPresent = false;
    }

    // Check enum types exist
    console.log('\nChecking ENUM types:');
    const [enums] = await sequelize.query(`
      SELECT typname
      FROM pg_type
      WHERE typtype = 'e'
      ORDER BY typname
    `);

    const requiredEnums = [
      'UserRole', 'Gender', 'ContactType',
      'HealthRecordType', 'AllergySeverity', 'AppointmentStatus',
      'IncidentSeverity', 'IncidentType',
      'ConfigCategory', 'ConfigValueType', 'ConfigScope',
      'AllergyType', 'ConditionSeverity', 'ConditionStatus',
      'VaccineType', 'AdministrationSite', 'AdministrationRoute',
      'VaccineComplianceStatus', 'ScreeningType', 'ScreeningOutcome',
      'FollowUpStatus', 'ConsciousnessLevel'
    ];

    const enumNames = enums.map(e => e.typname);
    for (const enumType of requiredEnums) {
      const exists = enumNames.includes(enumType);
      console.log(`  ${exists ? '✓' : '✗'} ${enumType}`);
      if (!exists) allPresent = false;
    }

    // Check critical indexes exist
    console.log('\nChecking sample indexes:');
    const [indexes] = await sequelize.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      LIMIT 10
    `);

    console.log(`  Found ${indexes.length}+ indexes`);

    console.log('\n' + (allPresent ? '✓ Schema verification PASSED' : '✗ Schema verification FAILED'));

    await sequelize.close();
    process.exit(allPresent ? 0 : 1);
  } catch (error) {
    console.error('✗ Verification error:', error.message);
    process.exit(1);
  }
}

verifySchema();
EOF

# Run verification
node verify-schema.js
```

---

## Rollback Procedure (If Needed)

If migrations fail or you need to rollback:

```bash
# Rollback last migration
npx sequelize-cli db:migrate:undo

# Rollback specific number of migrations
npx sequelize-cli db:migrate:undo:all --to 20250103000002-create-additional-critical-tables.js

# Rollback all migrations (DESTRUCTIVE)
npx sequelize-cli db:migrate:undo:all

# Restore from backup
pg_restore -h $DB_HOST -U $DB_USERNAME -d $DB_NAME -v backup_TIMESTAMP.dump
```

---

## Migration File Details

### New File 1: `20250103000003-create-system-configuration.js`

**Purpose:** Creates base system_configurations table and ConfigCategory enum

**Creates:**
- ConfigCategory ENUM (GENERAL, SECURITY, NOTIFICATION)
- system_configurations table with 12 columns
- 4 indexes for performance
- 12 default configuration records

**Key Features:**
- UUID primary keys
- JSONB validation rules
- Foreign key to users table for audit tracking
- Seeded with sensible defaults for healthcare platform

### New File 2: `20251010000000-complete-health-records-schema-FIXED.js`

**Purpose:** Fixed version with correct UUID data types

**Changes from Original:**
- ✓ All ID columns use UUID instead of STRING
- ✓ All foreign key columns use UUID instead of TEXT
- ✓ Removed unnecessary column rename logic
- ✓ Proper data type consistency throughout

**Creates:**
- 4 new tables (vaccinations, screenings, growth_measurements, vital_signs)
- 11 new ENUM types
- 25+ indexes for performance
- Foreign key constraints to health_records

---

## Validation Checklist

After migrations complete, verify:

- [ ] All 7 migrations show "up" status
- [ ] system_configurations table exists with 12 seeded records
- [ ] configuration_history table exists (empty initially)
- [ ] vaccinations table exists with UUID columns
- [ ] screenings table exists with UUID columns
- [ ] growth_measurements table exists with UUID columns
- [ ] vital_signs table exists with UUID columns
- [ ] All ENUM types created (24 total)
- [ ] Foreign key constraints working (test with a query)
- [ ] Indexes created (100+ total across all tables)
- [ ] No PostgreSQL errors in logs
- [ ] Application can connect and query database

---

## Performance Testing

After migration, test performance:

```sql
-- Test student lookup with health records
EXPLAIN ANALYZE
SELECT s.*, h.recordType, h.recordDate
FROM students s
LEFT JOIN health_records h ON h."studentId" = s.id
WHERE s."schoolId" = 'some-uuid'
  AND s."isActive" = true
ORDER BY s."lastName", s."firstName"
LIMIT 50;

-- Should use index: students_school_idx or students_health_overview

-- Test medication log queries
EXPLAIN ANALYZE
SELECT sm.*, m.name, ml."timeGiven"
FROM student_medications sm
JOIN medications m ON m.id = sm."medicationId"
LEFT JOIN medication_logs ml ON ml."studentMedicationId" = sm.id
WHERE sm."studentId" = 'some-uuid'
  AND sm."isActive" = true
ORDER BY ml."timeGiven" DESC;

-- Should use indexes: student_medications_student_idx, medication_logs_student_med_time_idx
```

---

## Troubleshooting

### Issue: Migration fails with "relation already exists"

**Solution:**
```bash
# Check what's in the database
npx sequelize-cli db:migrate:status

# If table exists but migration shows 'down', manually mark as up:
INSERT INTO "SequelizeMeta" (name) VALUES ('migration-filename.js');
```

### Issue: Foreign key constraint violation

**Solution:**
```sql
-- Check for orphaned records
SELECT COUNT(*) FROM table_name
WHERE foreign_key_column IS NOT NULL
  AND foreign_key_column NOT IN (SELECT id FROM referenced_table);

-- Fix: Either update foreign keys or delete orphaned records
```

### Issue: Enum value already exists

**Solution:**
```sql
-- Check current enum values
SELECT enumlabel FROM pg_enum
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'EnumName');

-- If needed, recreate enum (requires dropping dependent columns first)
```

---

## Post-Migration Tasks

### 1. Update Application Models

Ensure Sequelize models match new schema:

```javascript
// Example: System Configuration model
const SystemConfiguration = sequelize.define('SystemConfiguration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  key: {
    type: DataTypes.STRING(200),
    unique: true,
    allowNull: false
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('GENERAL', 'SECURITY', 'NOTIFICATION'),
    allowNull: false
  },
  valueType: {
    type: DataTypes.ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON', /* etc */),
    allowNull: false
  },
  // ... other fields from enhancement migration
}, {
  tableName: 'system_configurations',
  underscored: true
});
```

### 2. Create Model Associations

Add proper associations in your models:

```javascript
// In associations file
models.Vaccination.belongsTo(models.Student, { foreignKey: 'studentId' });
models.Vaccination.belongsTo(models.HealthRecord, { foreignKey: 'healthRecordId' });
models.VitalSign.belongsTo(models.Appointment, { foreignKey: 'appointmentId' });
// etc.
```

### 3. Implement Configuration Management API

Create endpoints to manage system configurations:

```javascript
// GET /api/configurations
// POST /api/configurations
// PUT /api/configurations/:id
// GET /api/configurations/:key/history
```

### 4. Add Audit Logging

Implement triggers or application-level logging for configuration changes:

```sql
-- Example: Trigger to log configuration changes
CREATE OR REPLACE FUNCTION log_configuration_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO configuration_history (
    id, "configKey", "oldValue", "newValue",
    "changedBy", "configurationId", "createdAt"
  ) VALUES (
    gen_random_uuid(),
    NEW.key,
    OLD.value,
    NEW.value,
    NEW."lastModifiedBy",
    NEW.id,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER configuration_change_trigger
AFTER UPDATE ON system_configurations
FOR EACH ROW
WHEN (OLD.value IS DISTINCT FROM NEW.value)
EXECUTE FUNCTION log_configuration_change();
```

---

## HIPAA Compliance Checklist

After migrations, ensure HIPAA compliance:

- [x] All PHI tables have soft delete (deletedAt column)
- [x] Audit fields (createdBy, updatedBy) present
- [x] Configuration history table tracks changes
- [ ] Implement row-level security policies
- [ ] Encrypt PHI fields at rest
- [ ] Enable database audit logging
- [ ] Implement access controls (RBAC)
- [ ] Set up automated backups
- [ ] Document data retention policies
- [ ] Implement breach notification procedures

---

## Success Criteria

Migration is considered successful when:

1. ✅ All 7 migrations execute without errors
2. ✅ Database schema verification script passes
3. ✅ All required tables exist with correct structure
4. ✅ All ENUM types created successfully
5. ✅ Foreign key constraints enforced properly
6. ✅ Indexes created and query performance improved
7. ✅ Application can connect and perform CRUD operations
8. ✅ No data loss from original 3 successful migrations
9. ✅ Seeded configuration data present and accessible
10. ✅ Rollback procedure tested and documented

---

## Support and Resources

### Documentation
- [Sequelize Migrations](https://sequelize.org/docs/v6/other-topics/migrations/)
- [PostgreSQL UUID Type](https://www.postgresql.org/docs/current/datatype-uuid.html)
- [PostgreSQL ENUM Types](https://www.postgresql.org/docs/current/datatype-enum.html)

### Contact
- Technical Lead: [contact info]
- Database Administrator: [contact info]
- HIPAA Compliance Officer: [contact info]

---

## Appendix: Migration Execution Log Template

Copy this template and fill it out during migration execution:

```
Migration Execution Log
=======================

Date: YYYY-MM-DD
Time: HH:MM UTC
Executed By: [Name]
Environment: [development/staging/production]

Pre-Migration:
- Database backup created: [ ] Yes [ ] No
  - Backup file: __________________
- Current schema verified: [ ] Yes [ ] No
- Application stopped: [ ] Yes [ ] No [ ] N/A

Migration Execution:
1. 20250103000003-create-system-configuration.js
   - Status: [ ] Success [ ] Failed
   - Duration: _______
   - Notes: ___________________________

2. 20251009013303-enhance-system-configuration.js
   - Status: [ ] Success [ ] Failed
   - Duration: _______
   - Notes: ___________________________

3. 20251010000000-complete-health-records-schema.js
   - Status: [ ] Success [ ] Failed
   - Duration: _______
   - Notes: ___________________________

4. 20251011000000-performance-indexes.js
   - Status: [ ] Success [ ] Failed
   - Duration: _______
   - Notes: ___________________________

Post-Migration:
- Schema verification passed: [ ] Yes [ ] No
- Application restarted: [ ] Yes [ ] No [ ] N/A
- Smoke tests passed: [ ] Yes [ ] No
- Performance tests run: [ ] Yes [ ] No
- Rollback plan prepared: [ ] Yes [ ] No

Issues Encountered:
_________________________________
_________________________________

Resolution Actions:
_________________________________
_________________________________

Final Status: [ ] Complete Success [ ] Partial Success [ ] Failed

Sign-off:
Executor: ________________  Date: ________
Reviewer: ________________  Date: ________
```

---

**End of Migration Execution Guide**

For questions or issues during migration execution, please refer to the troubleshooting section or contact the development team.
