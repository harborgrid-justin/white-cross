# White Cross Healthcare Platform - Database Migrations

## Quick Start

This directory contains all Sequelize migrations for the White Cross Healthcare Platform database schema.

## Critical Information

**CURRENT STATUS**: 6 migration files ready for execution
**DATABASE STATUS**: Schema does not exist - migrations must be run
**HIPAA COMPLIANCE**: All migrations include PHI protection and audit trails

## Migration Files Summary

| Order | Migration File | Status | Description |
|-------|---------------|--------|-------------|
| 1 | `20250103000000-create-base-schema.js` | ✅ Ready | Foundation tables (districts, schools, users, students, contacts) |
| 2 | `20250103000001-create-health-records-core.js` | ✅ Ready | Core health records (health_records, allergies, chronic_conditions, appointments) |
| 3 | `20250103000002-create-additional-critical-tables.js` | ✅ Ready | Medication management and incident reporting |
| 4 | `20251009013303-enhance-system-configuration.js` | ✅ Ready | System configuration management |
| 5 | `20251010000000-complete-health-records-schema.js` | ✅ Ready | Complete health records (vaccinations, screenings, vital signs, growth) |
| 6 | `20251011000000-performance-indexes.js` | ✅ Ready | 50+ performance indexes |

## Execute All Migrations

```bash
# Navigate to backend directory
cd /workspaces/white-cross/backend

# Run all migrations
npx sequelize-cli db:migrate

# Check migration status
npx sequelize-cli db:migrate:status
```

## Execute Individual Migrations

```bash
# Run specific migration
npx sequelize-cli db:migrate --name 20250103000000-create-base-schema.js

# Or run migrations up to specific point
npx sequelize-cli db:migrate --to 20250103000002-create-additional-critical-tables.js
```

## Rollback Migrations

```bash
# Rollback last migration
npx sequelize-cli db:migrate:undo

# Rollback all migrations (DANGEROUS - will delete all data)
npx sequelize-cli db:migrate:undo:all

# Rollback to specific migration
npx sequelize-cli db:migrate:undo:all --to 20250103000001-create-health-records-core.js
```

## What Gets Created

### Tables (20 core tables)
- `districts`, `schools`, `users`, `students`, `contacts`
- `health_records`, `allergies`, `chronic_conditions`, `appointments`
- `medications`, `student_medications`, `medication_logs`
- `incident_reports`, `emergency_contacts`
- `vaccinations`, `screenings`, `vital_signs`, `growth_measurements`
- `system_configurations`, `configuration_history`

### ENUMs (21 types)
- User management: `UserRole`, `Gender`
- Contacts: `ContactType`
- Health records: `HealthRecordType`, `AllergySeverity`, `AllergyType`
- Conditions: `ConditionSeverity`, `ConditionStatus`
- Appointments: `AppointmentStatus`
- Incidents: `IncidentType`, `IncidentSeverity`
- Vaccinations: `VaccineType`, `AdministrationSite`, `AdministrationRoute`, `VaccineComplianceStatus`
- Screenings: `ScreeningType`, `ScreeningOutcome`, `FollowUpStatus`
- Vital signs: `ConsciousnessLevel`
- Configuration: `ConfigValueType`, `ConfigScope`

### Indexes (50+ performance indexes)
- Full-text search indexes
- Composite indexes for common queries
- Partial indexes for filtered data
- Foreign key indexes

## Detailed Documentation

See [MIGRATION_EXECUTION_PLAN.md](./MIGRATION_EXECUTION_PLAN.md) for:
- Complete migration details
- Pre-migration checklist
- Post-migration verification
- Rollback procedures
- HIPAA compliance notes
- Performance considerations

## Database Connection

Ensure your database connection is configured in:
- `/workspaces/white-cross/backend/src/config/database.js` (or equivalent)
- Environment variables in `.env`

Required settings:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=white_cross
DB_USER=your_user
DB_PASSWORD=your_password
DB_DIALECT=postgres
```

## Prerequisites

- PostgreSQL 12.x or higher
- Node.js 18.x or higher
- Sequelize CLI installed: `npm install -g sequelize-cli`
- Database user with CREATE, ALTER, DROP permissions

## Troubleshooting

### Migration fails with "relation already exists"
```bash
# Check existing tables
psql -U your_user -d white_cross -c "\dt"

# If tables exist, either:
# 1. Drop existing tables manually
# 2. Use db:migrate:undo to rollback
```

### Migration fails with "type already exists"
```bash
# Check existing enums
psql -U your_user -d white_cross -c "\dT+"

# Drop conflicting enum manually:
# DROP TYPE IF EXISTS "UserRole" CASCADE;
```

### Migration hangs during index creation
```bash
# Check PostgreSQL locks
psql -U your_user -d white_cross -c "SELECT * FROM pg_locks WHERE NOT granted;"

# Consider increasing work_mem for large indexes
# SET work_mem = '256MB';
```

## HIPAA Compliance Features

All migrations include:
- ✅ Soft deletes (paranoid tables) for PHI data
- ✅ Audit fields (createdBy, updatedBy, timestamps)
- ✅ Proper foreign key constraints
- ✅ Comments marking PHI fields
- ✅ Data integrity constraints

## Next Steps After Migration

1. **Verify Tables**: Run verification queries in MIGRATION_EXECUTION_PLAN.md
2. **Seed Data**: Add initial data (districts, default admin user)
3. **Run Tests**: Execute test suite to verify schema
4. **Update Models**: Ensure Sequelize models sync with migrations
5. **Configure Backups**: Set up automated database backups
6. **Monitor Performance**: Check query performance with new indexes

## Support

For issues or questions:
1. Check [MIGRATION_EXECUTION_PLAN.md](./MIGRATION_EXECUTION_PLAN.md)
2. Review [Sequelize Migrations Documentation](https://sequelize.org/docs/v6/other-topics/migrations/)
3. Contact Database Administrator

---

**Last Updated**: 2025-01-03
**Migration Count**: 6 files
**Total Tables**: 20+ core tables
**Total Indexes**: 50+ performance indexes
