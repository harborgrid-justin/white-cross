# White Cross Healthcare Platform - Migration Execution Plan

## Overview

This document outlines the complete migration strategy for the White Cross Healthcare Platform database schema. The platform uses **Sequelize** with PostgreSQL and requires HIPAA-compliant data management with comprehensive audit trails.

## Critical Status

**CURRENT STATE**: ZERO active migrations for 93 Sequelize models
**RISK LEVEL**: CRITICAL - Database schema does not exist
**ACTION REQUIRED**: Execute all migrations in sequence order

## Migration Files Created

### Phase 1: Foundation Schema (NEW - PRIORITY 1)

#### 1. `20250103000000-create-base-schema.js`
**Status**: ✅ Created
**Purpose**: Create foundational tables for core platform entities
**Tables Created**:
- `districts` - School district management
- `schools` - Individual schools within districts
- `users` - System users (nurses, admins, staff)
- `students` - Student demographic information (PHI)
- `contacts` - Contact management (guardians, providers)

**Enums Created**:
- `UserRole` - User permission levels
- `Gender` - Student gender enumeration
- `ContactType` - Contact classification

**Key Features**:
- UUID primary keys for all tables
- Soft deletes (paranoid) for students and contacts
- Foreign key constraints with CASCADE/SET NULL
- Basic indexes on frequently queried fields
- HIPAA compliance comments on PHI fields

**Dependencies**: None (foundational)

---

#### 2. `20250103000001-create-health-records-core.js`
**Status**: ✅ Created
**Purpose**: Create essential health records infrastructure
**Tables Created**:
- `health_records` - Main health records table
- `allergies` - Student allergy tracking
- `chronic_conditions` - Chronic condition management
- `appointments` - Healthcare appointments

**Enums Created**:
- `HealthRecordType` - Comprehensive record type enumeration (30 values)
- `AllergySeverity` - Allergy severity levels
- `AppointmentStatus` - Appointment lifecycle states

**Key Features**:
- Soft deletes on all health tables
- Comprehensive record type coverage
- Follow-up tracking in health records
- Audit fields (createdBy, updatedBy)

**Dependencies**: Requires `20250103000000-create-base-schema.js`

---

#### 3. `20250103000002-create-additional-critical-tables.js`
**Status**: ✅ Created
**Purpose**: Create medication and incident management infrastructure
**Tables Created**:
- `medications` - Medication inventory
- `student_medications` - Student medication assignments
- `medication_logs` - Medication administration tracking
- `incident_reports` - Health incident reporting
- `emergency_contacts` - Emergency contact information

**Enums Created**:
- `IncidentSeverity` - Incident severity levels
- `IncidentType` - Incident classification

**Key Features**:
- Controlled substance tracking
- Medication administration audit trail
- Parent consent tracking
- Emergency contact authorization levels
- Incident witness tracking

**Dependencies**: Requires `20250103000000-create-base-schema.js` and `20250103000001-create-health-records-core.js`

---

### Phase 2: System Configuration (ACTIVATED - PRIORITY 1)

#### 4. `20251009013303-enhance-system-configuration.js`
**Status**: ✅ Activated (was .bak)
**Purpose**: Create advanced system configuration management
**Tables Created**:
- `system_configurations` - System-wide configuration
- `configuration_history` - Configuration change audit trail

**Enums Created**:
- `ConfigValueType` - Configuration value data types
- `ConfigScope` - Configuration scope levels (SYSTEM, DISTRICT, SCHOOL, USER)
- `ConfigCategory` - Extends existing enum with healthcare-specific categories

**Key Features**:
- Hierarchical configuration scopes
- Configuration value validation (min/max, valid values)
- Full audit trail with IP address and user agent
- Tag-based organization
- Change reason tracking

**Dependencies**: Requires base schema for relational integrity

---

### Phase 3: Complete Health Records Schema (ACTIVATED - PRIORITY 1)

#### 5. `20251010000000-complete-health-records-schema.js`
**Status**: ✅ Activated (was .bak)
**Purpose**: Comprehensive health records expansion
**Tables Created**:
- `vaccinations` - Comprehensive vaccination tracking
- `screenings` - Health screenings (vision, hearing, scoliosis, etc.)
- `growth_measurements` - Growth tracking with percentiles
- `vital_signs` - Vital signs measurements

**Enums Created**:
- `AllergyType` - Detailed allergy categorization
- `ConditionSeverity` - Condition severity levels
- `ConditionStatus` - Condition management status
- `VaccineType` - Comprehensive vaccine types (20+ vaccines)
- `AdministrationSite` - Vaccine administration sites
- `AdministrationRoute` - Administration methods
- `VaccineComplianceStatus` - Vaccination compliance tracking
- `ScreeningType` - Comprehensive screening types
- `ScreeningOutcome` - Screening results
- `FollowUpStatus` - Follow-up tracking
- `ConsciousnessLevel` - Patient consciousness assessment

**Key Features**:
- CDC-compliant vaccination tracking
- VFC (Vaccines for Children) eligibility
- VIS (Vaccine Information Statement) tracking
- Growth percentile calculations
- BMI tracking and percentiles
- Comprehensive vital signs monitoring
- Screening referral workflow
- Follow-up management

**Table Enhancements**:
- Extends `health_records` with 15+ new fields
- Extends `allergies` with EpiPen management
- Extends `chronic_conditions` with care plan tracking

**Dependencies**: Requires `20250103000001-create-health-records-core.js`

---

### Phase 4: Performance Optimization (ACTIVATED - PRIORITY 1)

#### 6. `20251011000000-performance-indexes.js`
**Status**: ✅ Activated (was .bak)
**Purpose**: Comprehensive performance index creation
**Indexes Created**: 50+ performance indexes across all tables

**Index Categories**:
1. **Student-related** (7 indexes)
   - Full-text search on student names
   - Composite indexes on school/grade/nurse
   - Partial indexes on active students

2. **User-related** (4 indexes)
   - Full-text search on user names/email
   - Role and active status indexes

3. **Medication-related** (8 indexes)
   - Stock level monitoring
   - Expiration date tracking
   - Active medication schedules

4. **Health records** (5 indexes)
   - Student/date composite indexes
   - Confidential record filtering
   - Provider NPI lookups

5. **Appointments** (3 indexes)
   - Nurse scheduling optimization
   - Upcoming appointment queries

6. **Incident reports** (4 indexes)
   - Critical incident filtering
   - Type/severity composite indexes

7. **Emergency contacts** (2 indexes)
   - Primary contact priority
   - Active contact filtering

8. **Audit logs** (4 indexes)
   - User activity tracking
   - Entity change tracking
   - Export audit trail

9. **Vaccinations** (3 indexes)
   - Compliance status tracking
   - Due date monitoring

10. **Additional tables** (10+ indexes)
    - Messages, inventory, compliance, sessions

**Key Features**:
- Partial indexes for active/filtered data
- Full-text search indexes using PostgreSQL GIN
- Composite indexes for common query patterns
- Conditional indexes for specific scenarios
- ANALYZE statements after index creation

**Dependencies**: Requires all previous migrations

---

## Execution Order

```bash
# Execute migrations in this exact order:

1. npx sequelize-cli db:migrate --name 20250103000000-create-base-schema.js
2. npx sequelize-cli db:migrate --name 20250103000001-create-health-records-core.js
3. npx sequelize-cli db:migrate --name 20250103000002-create-additional-critical-tables.js
4. npx sequelize-cli db:migrate --name 20251009013303-enhance-system-configuration.js
5. npx sequelize-cli db:migrate --name 20251010000000-complete-health-records-schema.js
6. npx sequelize-cli db:migrate --name 20251011000000-performance-indexes.js

# Or run all migrations:
npx sequelize-cli db:migrate
```

## Pre-Migration Checklist

- [ ] **Backup existing database** (if any data exists)
- [ ] **Verify database connection** in `.env` or config file
- [ ] **Check PostgreSQL version** (recommended: 12.x or higher)
- [ ] **Ensure sufficient disk space** for indexes
- [ ] **Review database user permissions** (CREATE, ALTER, DROP required)
- [ ] **Check for conflicting tables** (migrations will fail if tables exist)
- [ ] **Set up monitoring** for migration execution time
- [ ] **Schedule maintenance window** for production deployment

## Post-Migration Verification

### 1. Verify Table Creation

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected core tables:
-- allergies, appointments, chronic_conditions, configuration_history,
-- contacts, districts, emergency_contacts, growth_measurements,
-- health_records, incident_reports, medication_logs, medications,
-- schools, screenings, students, student_medications, system_configurations,
-- users, vaccinations, vital_signs
```

### 2. Verify Foreign Keys

```sql
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
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;
```

### 3. Verify Indexes

```sql
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Expected: 50+ indexes
```

### 4. Verify ENUMs

```sql
SELECT
  t.typname AS enum_name,
  STRING_AGG(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
GROUP BY t.typname
ORDER BY t.typname;

-- Expected ENUMs:
-- AllergyType, AllergySeverity, AdministrationRoute, AdministrationSite,
-- AppointmentStatus, ConditionSeverity, ConditionStatus, ConfigScope,
-- ConfigValueType, ConsciousnessLevel, ContactType, FollowUpStatus,
-- Gender, HealthRecordType, IncidentSeverity, IncidentType,
-- ScreeningOutcome, ScreeningType, UserRole, VaccineComplianceStatus, VaccineType
```

### 5. Test Basic Operations

```sql
-- Insert test district
INSERT INTO districts (name, code, is_active)
VALUES ('Test District', 'TEST001', true)
RETURNING id;

-- Insert test school
INSERT INTO schools (name, code, district_id, is_active)
VALUES ('Test School', 'SCH001', '<district-id>', true)
RETURNING id;

-- Insert test user
INSERT INTO users (email, password, first_name, last_name, role)
VALUES ('test@example.com', '$2b$10$...', 'Test', 'Nurse', 'NURSE')
RETURNING id;

-- Verify cascade deletes work
DELETE FROM districts WHERE code = 'TEST001';
-- Should cascade delete schools
```

## Rollback Plan

### Individual Migration Rollback

```bash
# Rollback last migration
npx sequelize-cli db:migrate:undo

# Rollback to specific migration
npx sequelize-cli db:migrate:undo:all --to 20250103000001-create-health-records-core.js

# Rollback all migrations (DANGEROUS)
npx sequelize-cli db:migrate:undo:all
```

### Manual Rollback (if Sequelize fails)

```sql
-- Drop all tables in reverse order
DROP TABLE IF EXISTS vital_signs CASCADE;
DROP TABLE IF EXISTS growth_measurements CASCADE;
DROP TABLE IF EXISTS screenings CASCADE;
DROP TABLE IF EXISTS vaccinations CASCADE;
DROP TABLE IF EXISTS configuration_history CASCADE;
DROP TABLE IF EXISTS system_configurations CASCADE;
DROP TABLE IF EXISTS emergency_contacts CASCADE;
DROP TABLE IF EXISTS incident_reports CASCADE;
DROP TABLE IF EXISTS medication_logs CASCADE;
DROP TABLE IF EXISTS student_medications CASCADE;
DROP TABLE IF EXISTS medications CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS chronic_conditions CASCADE;
DROP TABLE IF EXISTS allergies CASCADE;
DROP TABLE IF EXISTS health_records CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS districts CASCADE;

-- Drop all ENUMs
DROP TYPE IF EXISTS "ConsciousnessLevel" CASCADE;
DROP TYPE IF EXISTS "FollowUpStatus" CASCADE;
DROP TYPE IF EXISTS "ScreeningOutcome" CASCADE;
DROP TYPE IF EXISTS "ScreeningType" CASCADE;
DROP TYPE IF EXISTS "VaccineComplianceStatus" CASCADE;
DROP TYPE IF EXISTS "AdministrationRoute" CASCADE;
DROP TYPE IF EXISTS "AdministrationSite" CASCADE;
DROP TYPE IF EXISTS "VaccineType" CASCADE;
DROP TYPE IF EXISTS "ConditionStatus" CASCADE;
DROP TYPE IF EXISTS "ConditionSeverity" CASCADE;
DROP TYPE IF EXISTS "AllergyType" CASCADE;
DROP TYPE IF EXISTS "ConfigScope" CASCADE;
DROP TYPE IF EXISTS "ConfigValueType" CASCADE;
DROP TYPE IF EXISTS "IncidentType" CASCADE;
DROP TYPE IF EXISTS "IncidentSeverity" CASCADE;
DROP TYPE IF EXISTS "AppointmentStatus" CASCADE;
DROP TYPE IF EXISTS "AllergySeverity" CASCADE;
DROP TYPE IF EXISTS "HealthRecordType" CASCADE;
DROP TYPE IF EXISTS "ContactType" CASCADE;
DROP TYPE IF EXISTS "Gender" CASCADE;
DROP TYPE IF EXISTS "UserRole" CASCADE;

-- Clear Sequelize meta table
DELETE FROM "SequelizeMeta";
```

## HIPAA Compliance Notes

All migrations include:
- ✅ Soft deletes (paranoid) on tables with PHI
- ✅ Audit fields (createdBy, updatedBy)
- ✅ Timestamped records (createdAt, updatedAt)
- ✅ Comments marking PHI fields
- ✅ Proper foreign key constraints
- ✅ Data integrity constraints

## Performance Considerations

**Expected Migration Time** (on standard PostgreSQL instance):
- Phase 1 (Base Schema): ~5-10 seconds
- Phase 2 (System Config): ~2-3 seconds
- Phase 3 (Complete Health Records): ~10-15 seconds
- Phase 4 (Performance Indexes): ~20-30 seconds
- **Total**: ~40-60 seconds

**Production Deployment**:
- Schedule during maintenance window
- Monitor database CPU/memory during index creation
- Consider disabling health checks during migration
- Plan for connection pool restart after completion

## Additional Migrations Needed

The following areas may require additional migrations based on the 93 models:

1. **Academic Records** - transcripts, grades, attendance
2. **Mental Health** - mental health records, counseling notes
3. **Prescriptions** - prescription management
4. **Documents** - file attachment management
5. **Audit Logs** - comprehensive audit logging
6. **Notifications** - notification system
7. **Reporting** - analytics and reporting tables
8. **Inventory** - supply inventory management
9. **Licenses** - licensing and compliance
10. **Sessions** - user session management

These can be added as subsequent migrations as needed.

## Migration Validation Commands

```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Validate Sequelize models sync with database
npm run db:validate  # (if script exists)

# Run tests after migration
npm test

# Check for N+1 query issues
npm run test:performance  # (if script exists)
```

## Emergency Contact

**Database Administrator**: [Your DBA Contact]
**DevOps Lead**: [Your DevOps Contact]
**Escalation**: [Escalation Contact]

## References

- [Sequelize Migrations Documentation](https://sequelize.org/docs/v6/other-topics/migrations/)
- [PostgreSQL CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html)
- [HIPAA Compliance Guidelines](https://www.hhs.gov/hipaa/index.html)
- [White Cross Model Definitions](/workspaces/white-cross/backend/src/database/models/)

---

**Document Version**: 1.0
**Last Updated**: 2025-01-03
**Author**: Sequelize Migrations Architect
**Status**: Ready for Execution
