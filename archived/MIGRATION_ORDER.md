# Sequelize Migration Order Documentation

**White Cross School Health Management System**
**Generated:** 2025-11-03
**Purpose:** Document the correct order and dependencies for all database migrations

---

## Migration Execution Order

Migrations MUST be executed in chronological order based on their timestamp prefix. This ensures proper dependency resolution and referential integrity.

### Core Schema Migrations (Phase 1)

#### 1. `20250103000000-create-base-schema.js`
**Dependencies:** None (foundational)
**Purpose:** Creates the foundational database schema
**Tables Created:**
- `districts` - School district management
- `schools` - Individual schools within districts
- `users` - System users (nurses, admins, staff)
- `students` - Student demographic information
- `contacts` - Contact management (guardians, providers, emergency contacts)

**ENUMs Created:**
- `UserRole` - User role types (ADMIN, NURSE, SCHOOL_ADMIN, etc.)
- `Gender` - Gender options (MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY)
- `ContactType` - Contact relationship types

**Indexes Created:** 20+ indexes for optimal query performance

**⚠️ Critical:** This migration MUST run first. All subsequent migrations depend on the tables and types created here.

---

#### 2. `20250103000001-create-health-records-core.js`
**Dependencies:** `20250103000000-create-base-schema.js` (requires `students`, `users` tables)
**Purpose:** Creates essential health records infrastructure
**Tables Created:**
- `health_records` - Main health records table
- `allergies` - Student allergy tracking
- `chronic_conditions` - Chronic condition management
- `appointments` - Healthcare appointments

**ENUMs Created:**
- `HealthRecordType` - Health record types (CHECKUP, VACCINATION, ILLNESS, etc.)
- `AllergySeverity` - Allergy severity levels
- `AppointmentStatus` - Appointment statuses

**Foreign Keys:**
- `health_records.studentId` → `students.id`
- `allergies.studentId` → `students.id`
- `chronic_conditions.studentId` → `students.id`
- `appointments.studentId` → `students.id`
- `appointments.nurseId` → `users.id`

**Rollback Safe:** Yes, drops tables in reverse dependency order

---

#### 3. `20250103000002-create-additional-critical-tables.js`
**Dependencies:** `20250103000000` (requires `students`, `users` tables)
**Purpose:** Creates supporting tables for medication management and incident reporting
**Tables Created:**
- `medications` - Medication inventory
- `student_medications` - Student medication assignments
- `medication_logs` - Medication administration tracking
- `incident_reports` - Health incident reporting
- `emergency_contacts` - Emergency contact information

**ENUMs Created:**
- `IncidentSeverity` - Incident severity levels (LOW, MEDIUM, HIGH, CRITICAL)
- `IncidentType` - Incident types (INJURY, ILLNESS, ALLERGIC_REACTION, etc.)

**Foreign Keys:**
- `student_medications.studentId` → `students.id`
- `student_medications.medicationId` → `medications.id`
- `medication_logs.studentMedicationId` → `student_medications.id`
- `medication_logs.nurseId` → `users.id`
- `incident_reports.studentId` → `students.id`
- `incident_reports.reportedById` → `users.id`
- `emergency_contacts.studentId` → `students.id`

**Rollback Safe:** Yes, uses transactions and drops in reverse order

---

#### 4. `20250103000003-create-system-configuration.js`
**Dependencies:** `20250103000000` (requires `users` table for foreign key)
**Purpose:** Creates system configuration infrastructure
**Tables Created:**
- `system_configurations` - System-wide settings storage

**ENUMs Created:**
- `ConfigCategory` - Configuration categories (GENERAL, SECURITY, NOTIFICATION)

**Data Seeding:** Seeds 12 default configuration values including security and notification settings

**Foreign Keys:**
- `system_configurations.lastModifiedBy` → `users.id`

**Rollback Safe:** Yes, drops table and enum

---

### Enhancement Migrations (Phase 2)

#### 5. `20251009013303-enhance-system-configuration.js`
**Dependencies:** `20250103000003` (enhances `system_configurations` table)
**Purpose:** Expands system configuration capabilities
**Changes:**
- Adds new ENUMs: `ConfigValueType`, `ConfigScope`
- Extends `ConfigCategory` enum with healthcare-specific values
- Adds 12 new columns to `system_configurations` table
- Creates `configuration_history` table for audit trail

**Tables Created:**
- `configuration_history` - Configuration change audit log

**Foreign Keys:**
- `configuration_history.configurationId` → `system_configurations.id`

**⚠️ Note:** Cannot remove ENUM values in PostgreSQL during rollback (documented in down() method)

**Rollback Safe:** Partial (enum values persist, all other changes rollback)

---

#### 6. `20251010000000-complete-health-records-schema.js` or `-FIXED.js`
**Dependencies:** `20250103000001` (enhances health records tables)
**Purpose:** Implements comprehensive health records system
**Changes:**
- Creates 9 new ENUMs for health data types
- Enhances existing `health_records`, `allergies`, `chronic_conditions` tables
- Creates 4 new health tracking tables

**Tables Created:**
- `vaccinations` - Comprehensive vaccination records
- `screenings` - Health screening records (vision, hearing, etc.)
- `growth_measurements` - Growth tracking (height, weight, BMI)
- `vital_signs` - Vital signs measurements

**ENUMs Created:**
- `AllergyType`, `ConditionSeverity`, `ConditionStatus`
- `VaccineType`, `AdministrationSite`, `AdministrationRoute`, `VaccineComplianceStatus`
- `ScreeningType`, `ScreeningOutcome`, `FollowUpStatus`
- `ConsciousnessLevel`

**Foreign Keys:**
- All new tables reference `students.id` and optionally `health_records.id`
- `vital_signs.appointmentId` → `appointments.id`

**⚠️ Use FIXED Version:** Prefer `20251010000000-complete-health-records-schema-FIXED.js` for proper UUID handling

**Rollback Safe:** Yes, removes columns and drops tables in reverse order

---

#### 7. `20251011000000-performance-indexes.js`
**Dependencies:** ALL previous migrations (adds indexes to existing tables)
**Purpose:** Addresses N+1 query problems and adds comprehensive indexing
**Changes:**
- Adds 40+ performance indexes across all major tables
- Creates composite indexes for common query patterns
- Adds full-text search indexes
- Includes partial indexes for filtered queries

**Tables Enhanced:**
- students, users, medications, student_medications, medication_logs
- health_records, appointments, incident_reports, emergency_contacts
- allergies, chronic_conditions, vaccinations, screenings
- growth_measurements, vital_signs
- Plus conditional indexes for documents, audit_logs, messages, inventory, compliance, sessions

**⚠️ Critical:** This migration checks for table/column existence before creating indexes, making it safe to run on partial schemas

**Rollback Safe:** Yes, drops all created indexes

---

#### 8. `20251103204744-add-status-and-safety-type-to-incidents.js`
**Dependencies:** `20250103000002` (enhances `incident_reports` table)
**Purpose:** Adds status tracking and SAFETY type support to incident reports
**Changes:**
- Adds `status` column with enum validation
- Adds indexes for status filtering
- Supports SAFETY incident type (varchar column)

**Indexes Created:**
- `incident_reports_status_idx`
- `incident_reports_type_status_idx`

**Rollback Safe:** Yes, removes column and indexes

---

## Migration Dependency Graph

```
20250103000000 (base-schema)
    ├── 20250103000001 (health-records-core)
    │   └── 20251010000000 (complete-health-records-schema)
    ├── 20250103000002 (additional-critical-tables)
    │   └── 20251103204744 (add-status-to-incidents)
    └── 20250103000003 (system-configuration)
        └── 20251009013303 (enhance-system-configuration)

20251011000000 (performance-indexes) - depends on ALL tables
```

---

## Running Migrations

### Development Environment
```bash
# Run all pending migrations
npm run migrate

# Run specific migration
npx sequelize-cli db:migrate --to 20250103000000-create-base-schema.js

# Check migration status
npx sequelize-cli db:migrate:status
```

### Production Environment
**See:** [PRODUCTION_MIGRATION_STRATEGY.md](./PRODUCTION_MIGRATION_STRATEGY.md)

---

## Rollback Procedures

### Rollback Last Migration
```bash
npm run migrate:undo
```

### Rollback Specific Migration
```bash
npx sequelize-cli db:migrate:undo:all --to 20251010000000-complete-health-records-schema.js
```

### Rollback All Migrations (⚠️ DESTRUCTIVE)
```bash
npm run migrate:undo:all
```

### Rollback Order (Reverse of Apply)
1. `20251103204744-add-status-and-safety-type-to-incidents.js`
2. `20251011000000-performance-indexes.js`
3. `20251010000000-complete-health-records-schema.js`
4. `20251009013303-enhance-system-configuration.js`
5. `20250103000003-create-system-configuration.js`
6. `20250103000002-create-additional-critical-tables.js`
7. `20250103000001-create-health-records-core.js`
8. `20250103000000-create-base-schema.js`

**⚠️ Warning:** Rollback will DROP tables and DELETE all data. Always backup before rolling back in production.

---

## Migration Safety Features

### Idempotency
All migrations are designed to be idempotent:
- ENUMs use `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN null; END $$;`
- Table creation checks use `CREATE TABLE IF NOT EXISTS`
- Index creation uses `CREATE INDEX IF NOT EXISTS`
- Column additions use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`

### Transactions
All migrations use transactions for atomic operations:
```javascript
const transaction = await queryInterface.sequelize.transaction();
try {
  // Migration operations
  await transaction.commit();
} catch (error) {
  await transaction.rollback();
  throw error;
}
```

### Foreign Key Protection
Migrations respect foreign key constraints during:
- Table dropping (reverse dependency order)
- Constraint removal before table drops
- Cascade settings (CASCADE, SET NULL)

---

## Testing Migrations

### Automated Testing
```bash
# Run migration rollback test suite
npm test -- migration-rollback.test.js
```

### Manual Testing Checklist
- [ ] Migration applies successfully (`npm run migrate`)
- [ ] Migration creates expected tables/columns
- [ ] Migration creates all indexes
- [ ] Foreign keys are properly defined
- [ ] Migration can be rolled back (`npm run migrate:undo`)
- [ ] Rollback removes all created objects
- [ ] Migration can be re-applied after rollback
- [ ] Migration is idempotent (can run twice without errors)

---

## Common Issues & Solutions

### Issue: Duplicate ENUM values
**Solution:** Use `ALTER TYPE ... ADD VALUE IF NOT EXISTS` (PostgreSQL 9.6+)

### Issue: Foreign key constraint violation during rollback
**Solution:** Drop tables in reverse dependency order in down() method

### Issue: Migration timeout
**Solution:** Increase transaction timeout or split large data migrations

### Issue: ENUM values can't be removed
**Solution:** Document in down() method, create new ENUM if needed

---

## HIPAA Compliance Notes

All migrations maintain HIPAA compliance:
- Soft deletes (`deletedAt`) for PHI-containing tables
- Audit trail fields (`createdBy`, `updatedBy`, `createdAt`, `updatedAt`)
- Access control scopes via foreign keys
- Configuration history for audit requirements

---

## Contact & Support

For migration issues or questions:
- Review this document and PRODUCTION_MIGRATION_STRATEGY.md
- Check migration test results
- Consult database team before production migrations

---

**Last Updated:** 2025-11-03
**Version:** 1.0
**Maintained By:** Database Team
