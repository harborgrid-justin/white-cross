# Prisma to Sequelize Migration Guide

## Executive Summary

This document provides a comprehensive guide for completing the migration from Prisma ORM to Sequelize ORM in the White Cross healthcare platform. The migration was performed to leverage Sequelize's mature ecosystem, better TypeScript support for complex queries, and improved performance characteristics for enterprise workloads.

**Migration Date**: October 11, 2025
**Agent**: Agent 7 of 7
**Status**: Documentation Phase Complete - Implementation Required

---

## Table of Contents

1. [Migration Overview](#migration-overview)
2. [Pre-Migration Checklist](#pre-migration-checklist)
3. [File Structure Changes](#file-structure-changes)
4. [Dependency Changes](#dependency-changes)
5. [Environment Configuration](#environment-configuration)
6. [Database Schema Migration](#database-schema-migration)
7. [Code Migration Patterns](#code-migration-patterns)
8. [Remaining Work](#remaining-work)
9. [Testing Strategy](#testing-strategy)
10. [Rollback Procedures](#rollback-procedures)
11. [Known Issues and Considerations](#known-issues-and-considerations)

---

## Migration Overview

### Why Migrate?

- **Enterprise Maturity**: Sequelize is battle-tested in large-scale healthcare applications
- **Query Flexibility**: More control over complex joins and raw SQL when needed
- **Migration Management**: Better version control for schema changes
- **TypeScript Integration**: Improved type inference and model definitions
- **Performance**: Better connection pooling and query optimization options

### Migration Scope

The migration affects the following areas:
- Backend database layer (ORM)
- All service files that interact with the database
- Database migrations and seeding scripts
- Environment configuration
- Developer documentation

---

## Pre-Migration Checklist

Before starting the migration, ensure:

- [ ] **Full Database Backup**: Create a complete backup of the production database
- [ ] **Code Backup**: The Prisma directory has been backed up to `.migration-backup/`
- [ ] **Team Notification**: All developers are aware of the upcoming changes
- [ ] **Feature Freeze**: No new database-dependent features during migration
- [ ] **CI/CD Pipeline**: Update deployment scripts to use Sequelize commands
- [ ] **Documentation Review**: Ensure all team members review this guide

---

## File Structure Changes

### Old Structure (Prisma)

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   ├── seed.ts
│   ├── seed.enhanced.ts
│   └── seed.comprehensive.ts
└── src/
    ├── config/
    │   └── database.ts (PrismaClient instantiation)
    └── services/ (Prisma queries)
```

### New Structure (Sequelize)

```
backend/
├── src/
│   ├── models/              # NEW: Sequelize model definitions
│   │   ├── index.ts        # Model initialization and associations
│   │   ├── User.ts
│   │   ├── Student.ts
│   │   ├── Medication.ts
│   │   └── ... (all other models)
│   ├── config/
│   │   └── database.ts     # UPDATED: Sequelize connection
│   ├── database/
│   │   ├── seeders/        # NEW: Sequelize seeders
│   │   │   └── seed.ts
│   │   └── repositories/   # UPDATED: Use Sequelize models
│   └── services/           # UPDATED: Use Sequelize syntax
├── migrations/             # NEW: Sequelize migrations
│   └── YYYYMMDDHHMMSS-*.js
└── .sequelizerc            # NEW: Sequelize CLI configuration
```

### Files to Create

1. **`.sequelizerc`** - Sequelize CLI configuration
2. **`src/models/index.ts`** - Model initialization and exports
3. **Individual model files** in `src/models/` for each entity
4. **Migration files** in `migrations/` directory
5. **Seeder files** in `src/database/seeders/`

### Files to Remove (After Migration)

**DO NOT remove until migration is verified complete:**
- `backend/prisma/` directory (backed up in `.migration-backup/`)
- `backend/node_modules/.prisma/`
- `backend/node_modules/@prisma/`

---

## Dependency Changes

### Package.json Changes

#### Removed Dependencies
```json
"@prisma/client": "^6.17.0"  // REMOVED from dependencies
"prisma": "^6.17.0"          // REMOVED from devDependencies
```

#### Added/Confirmed Dependencies
```json
"sequelize": "^6.37.7",
"sequelize-cli": "^6.6.3",
"pg": "^8.16.3",
"pg-hstore": "^2.3.4"
```

#### Updated Scripts

**Root package.json:**
```json
"seed": "cd backend && npm run seed",
"db:migrate": "cd backend && npx sequelize-cli db:migrate",
"db:migrate:undo": "cd backend && npx sequelize-cli db:migrate:undo",
"db:seed:all": "cd backend && npx sequelize-cli db:seed:all"
```

**Backend package.json:**
```json
"db:migrate": "sequelize-cli db:migrate",
"db:migrate:undo": "sequelize-cli db:migrate:undo",
"db:migrate:undo:all": "sequelize-cli db:migrate:undo:all",
"db:seed": "sequelize-cli db:seed:all",
"db:seed:undo": "sequelize-cli db:seed:undo",
"seed": "ts-node src/database/seeders/seed.ts",
"migration:generate": "sequelize-cli migration:generate --name",
"model:generate": "sequelize-cli model:generate --name"
```

**Removed prisma section:**
```json
// REMOVED
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

### Installing Updated Dependencies

```bash
cd backend
npm install
npm install --save-dev @types/node
```

---

## Environment Configuration

### Updated .env.example

The `.env.example` file has been updated with Sequelize-specific variables:

```env
# Database Configuration (Sequelize)
DATABASE_URL=postgresql://username:password@localhost:5432/whitecross
DB_HOST=localhost
DB_PORT=5432
DB_NAME=whitecross
DB_USERNAME=username
DB_PASSWORD=password
DB_DIALECT=postgres
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_CONNECTION_TIMEOUT=60000
DB_IDLE_TIMEOUT=10000
DB_LOGGING=false
```

### Developer Action Required

Each developer must update their local `.env` file with the new variables:

```bash
cp backend/.env.example backend/.env
# Then edit backend/.env with your local database credentials
```

---

## Database Schema Migration

### Creating the .sequelizerc Configuration

Create `backend/.sequelizerc`:

```javascript
const path = require('path');

module.exports = {
  'config': path.resolve('src', 'config', 'database.js'),
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('src', 'database', 'seeders'),
  'migrations-path': path.resolve('migrations')
};
```

### Sequelize Configuration File

Update `backend/src/config/database.ts` to export Sequelize configuration:

```typescript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'whitecross',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres' as const,
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      max: parseInt(process.env.DB_POOL_MAX || '10'),
      acquire: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000'),
      idle: parseInt(process.env.DB_IDLE_TIMEOUT || '10000')
    }
  },
  test: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME + '_test' || 'whitecross_test',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres' as const,
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres' as const,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '5'),
      max: parseInt(process.env.DB_POOL_MAX || '20'),
      acquire: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000'),
      idle: parseInt(process.env.DB_IDLE_TIMEOUT || '10000')
    }
  }
};

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env as keyof typeof config];

export const sequelize = new Sequelize(dbConfig);

export default config;
```

### Migration Strategy

Since the database schema already exists (from Prisma migrations), you have two options:

#### Option 1: Generate Migrations from Existing Schema (Recommended)

1. Use a tool like `sequelize-auto` to reverse-engineer the existing database
2. Review and adjust the generated models
3. Create an initial migration that matches the current schema

```bash
npm install -g sequelize-auto
sequelize-auto -h localhost -d whitecross -u username -x password -p 5432 --dialect postgres -o ./src/models
```

#### Option 2: Manual Migration Creation

1. Manually create Sequelize models based on Prisma schema
2. Create migrations that match the existing database structure
3. Mark migrations as executed without running them

```bash
# Generate migration
npx sequelize-cli migration:generate --name initial-schema

# Edit the migration file to match existing schema
# Then mark as executed without running:
npx sequelize-cli db:migrate --to YYYYMMDDHHMMSS-initial-schema.js
```

---

## Code Migration Patterns

### Pattern 1: Importing the ORM Client

**Before (Prisma):**
```typescript
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
```

**After (Sequelize):**
```typescript
import { sequelize } from '../config/database';
import { User, Student, Medication } from '../models';
```

### Pattern 2: Creating Records

**Before (Prisma):**
```typescript
const user = await prisma.user.create({
  data: {
    email: 'test@example.com',
    name: 'Test User',
    role: 'NURSE'
  }
});
```

**After (Sequelize):**
```typescript
const user = await User.create({
  email: 'test@example.com',
  name: 'Test User',
  role: 'NURSE'
});
```

### Pattern 3: Finding Records

**Before (Prisma):**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId }
});

const users = await prisma.user.findMany({
  where: { role: 'NURSE' },
  include: { school: true }
});
```

**After (Sequelize):**
```typescript
const user = await User.findByPk(userId);

const users = await User.findAll({
  where: { role: 'NURSE' },
  include: [{ model: School, as: 'school' }]
});
```

### Pattern 4: Updating Records

**Before (Prisma):**
```typescript
const user = await prisma.user.update({
  where: { id: userId },
  data: { name: 'Updated Name' }
});
```

**After (Sequelize):**
```typescript
const user = await User.findByPk(userId);
if (user) {
  await user.update({ name: 'Updated Name' });
  // OR
  await User.update(
    { name: 'Updated Name' },
    { where: { id: userId } }
  );
}
```

### Pattern 5: Deleting Records

**Before (Prisma):**
```typescript
await prisma.user.delete({
  where: { id: userId }
});
```

**After (Sequelize):**
```typescript
await User.destroy({
  where: { id: userId }
});
```

### Pattern 6: Transactions

**Before (Prisma):**
```typescript
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  const audit = await tx.auditLog.create({ data: auditData });
  return { user, audit };
});
```

**After (Sequelize):**
```typescript
await sequelize.transaction(async (t) => {
  const user = await User.create(userData, { transaction: t });
  const audit = await AuditLog.create(auditData, { transaction: t });
  return { user, audit };
});
```

### Pattern 7: Enums and Types

**Before (Prisma):**
```typescript
import { Role, MedicationType } from '@prisma/client';

const role: Role = 'NURSE';
```

**After (Sequelize):**
```typescript
// Define enums in your model files or types/index.ts
export enum Role {
  ADMIN = 'ADMIN',
  NURSE = 'NURSE',
  PARENT = 'PARENT'
}

const role: Role = Role.NURSE;
```

### Pattern 8: Aggregations

**Before (Prisma):**
```typescript
const count = await prisma.student.count({
  where: { schoolId: schoolId }
});

const aggregation = await prisma.medication.aggregate({
  _sum: { quantity: true },
  _avg: { dosage: true }
});
```

**After (Sequelize):**
```typescript
const count = await Student.count({
  where: { schoolId: schoolId }
});

const aggregation = await Medication.findAll({
  attributes: [
    [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
    [sequelize.fn('AVG', sequelize.col('dosage')), 'avgDosage']
  ]
});
```

---

## Remaining Work

### Critical Tasks

The following files still contain Prisma imports and MUST be migrated:

#### 1. Configuration & Database Layer (HIGH PRIORITY)

- [ ] `backend/src/config/database.ts` - Replace PrismaClient with Sequelize
- [ ] `backend/src/database/repositories/base/BaseRepository.ts` - Update to use Sequelize
- [ ] `backend/src/database/uow/PrismaUnitOfWork.ts` - Rename and refactor to SequelizeUnitOfWork

#### 2. Jobs & Scheduled Tasks (HIGH PRIORITY)

- [ ] `backend/src/jobs/inventoryMaintenanceJob.ts` - Update Prisma queries
- [ ] `backend/src/jobs/medicationReminderJob.ts` - Update Prisma queries

#### 3. Service Layer (HIGH PRIORITY - 20+ files)

**Core Services:**
- [ ] `backend/src/services/accessControlService.ts`
- [ ] `backend/src/services/administrationService.ts`
- [ ] `backend/src/services/auditService.ts`
- [ ] `backend/src/services/budgetService.ts`
- [ ] `backend/src/services/communicationService.ts`
- [ ] `backend/src/services/complianceService.ts`
- [ ] `backend/src/services/configurationService.ts`
- [ ] `backend/src/services/dashboardService.ts`
- [ ] `backend/src/services/documentService.ts`
- [ ] `backend/src/services/integrationService.ts`
- [ ] `backend/src/services/inventoryService.ts`
- [ ] `backend/src/services/purchaseOrderService.ts`
- [ ] `backend/src/services/reportService.ts`
- [ ] `backend/src/services/resilientMedicationService.ts`
- [ ] `backend/src/services/studentService.ts`
- [ ] `backend/src/services/vendorService.ts`

**Appointment Services:**
- [ ] `backend/src/services/appointment/AppointmentAvailabilityService.ts`
- [ ] `backend/src/services/appointment/AppointmentReminderService.ts`
- [ ] `backend/src/services/appointment/AppointmentService.ts`
- [ ] `backend/src/services/appointmentService.ts`

**Authentication:**
- [ ] `backend/src/services/passport.ts`

#### 4. Routes (MEDIUM PRIORITY)

- [ ] `backend/src/routes/auth.ts` - Update type imports
- [ ] `backend/src/routes/configuration.ts` - Update enum imports

#### 5. Middleware (MEDIUM PRIORITY)

- [ ] `backend/src/middleware/rbac.ts` - Update to use Sequelize models

#### 6. Utilities (LOW PRIORITY)

- [ ] `backend/src/utils/healthRecords/businessLogic.ts` - Update Prisma usage

#### 7. Seed Scripts (LOW PRIORITY)

- [ ] Migrate `backend/prisma/seed.ts` to `backend/src/database/seeders/`
- [ ] Migrate `backend/prisma/seed.enhanced.ts`
- [ ] Migrate `backend/prisma/seed.comprehensive.ts`
- [ ] Delete old seed files after verification

#### 8. Model Creation (HIGH PRIORITY)

Create Sequelize models in `backend/src/models/` for all entities:

**User Management:**
- [ ] User.ts
- [ ] Role.ts
- [ ] Permission.ts
- [ ] Session.ts

**Student Management:**
- [ ] Student.ts
- [ ] EmergencyContact.ts
- [ ] Guardian.ts
- [ ] StudentAllergy.ts
- [ ] StudentMedicalHistory.ts

**Medication Management:**
- [ ] Medication.ts
- [ ] MedicationAdministration.ts
- [ ] MedicationSchedule.ts
- [ ] Prescription.ts

**Health Records:**
- [ ] HealthRecord.ts
- [ ] Vaccination.ts
- [ ] MedicalExamination.ts
- [ ] GrowthRecord.ts
- [ ] Screening.ts

**Appointments:**
- [ ] Appointment.ts
- [ ] AppointmentType.ts
- [ ] AppointmentReminder.ts
- [ ] NurseAvailability.ts

**Incidents:**
- [ ] Incident.ts
- [ ] IncidentReport.ts
- [ ] IncidentWitness.ts
- [ ] IncidentFollowUp.ts

**Communications:**
- [ ] Message.ts
- [ ] MessageTemplate.ts
- [ ] Notification.ts
- [ ] BroadcastMessage.ts

**Inventory:**
- [ ] InventoryItem.ts
- [ ] InventoryTransaction.ts
- [ ] PurchaseOrder.ts
- [ ] Vendor.ts
- [ ] SupplyCategory.ts

**Compliance:**
- [ ] AuditLog.ts
- [ ] ComplianceDocument.ts
- [ ] ConsentForm.ts
- [ ] PolicyVersion.ts

**Documents:**
- [ ] Document.ts
- [ ] DocumentVersion.ts
- [ ] DocumentCategory.ts
- [ ] DocumentTag.ts

**Administration:**
- [ ] School.ts
- [ ] District.ts
- [ ] SystemConfiguration.ts
- [ ] PerformanceMetric.ts
- [ ] BackupLog.ts

**Access Control:**
- [ ] SecurityIncident.ts
- [ ] IpRestriction.ts
- [ ] MfaToken.ts
- [ ] AccessLog.ts

**Integration:**
- [ ] IntegrationConfig.ts
- [ ] IntegrationLog.ts
- [ ] WebhookEndpoint.ts
- [ ] ApiKey.ts

**Reporting:**
- [ ] Report.ts
- [ ] ReportSchedule.ts
- [ ] DashboardWidget.ts

#### 9. Model Associations (HIGH PRIORITY)

Create `backend/src/models/index.ts` to:
- [ ] Initialize Sequelize connection
- [ ] Import all models
- [ ] Define all model associations (hasMany, belongsTo, etc.)
- [ ] Export all models and sequelize instance

---

## Testing Strategy

### Pre-Migration Tests

1. **Create baseline test suite** with Prisma (if not exists)
2. **Document all query patterns** currently in use
3. **Performance benchmarks** for critical queries

### Migration Testing

1. **Unit Tests**: Update all service-level unit tests
2. **Integration Tests**: Test database operations
3. **E2E Tests**: Ensure user workflows still function
4. **Performance Tests**: Compare query performance

### Test Commands

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- services/studentService.test.ts
```

### Verification Checklist

After migrating each service:
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing of critical workflows
- [ ] No Prisma imports remain in the file
- [ ] TypeScript compilation succeeds
- [ ] Code follows Sequelize best practices

---

## Rollback Procedures

### Emergency Rollback

If critical issues are discovered:

1. **Restore from backup**:
   ```bash
   # Restore Prisma directory
   cp -r .migration-backup/prisma-backup-YYYYMMDD-HHMMSS backend/prisma

   # Restore package.json files
   git checkout HEAD -- package.json backend/package.json

   # Reinstall dependencies
   npm run setup
   ```

2. **Restore database** (if schema changes were made):
   ```bash
   psql -U username -d whitecross < backup_YYYYMMDD.sql
   ```

3. **Restart services**:
   ```bash
   npm run dev
   ```

### Partial Rollback

To rollback specific migrations:

```bash
# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo specific migration
npx sequelize-cli db:migrate:undo --to YYYYMMDDHHMMSS-migration-name.js

# Undo all migrations (DANGEROUS)
npx sequelize-cli db:migrate:undo:all
```

---

## Known Issues and Considerations

### 1. Type Safety

**Issue**: Sequelize TypeScript support is not as comprehensive as Prisma's generated types.

**Solution**:
- Use `sequelize-typescript` package for decorator-based models
- Create comprehensive TypeScript interfaces for model attributes
- Leverage strict typing in service layer

### 2. Enum Handling

**Issue**: Prisma generates TypeScript enums; Sequelize requires manual enum definition.

**Solution**:
- Extract all enums from Prisma schema
- Create a central `types/enums.ts` file
- Use PostgreSQL ENUM types in migrations

### 3. Relation Loading

**Issue**: Prisma's `include` syntax differs from Sequelize's.

**Solution**:
- Map all Prisma `include` statements to Sequelize `include` with associations
- Use eager loading judiciously to avoid N+1 queries
- Leverage `separate: true` for complex associations

### 4. Query Performance

**Issue**: Different query optimization strategies between ORMs.

**Solution**:
- Profile queries using Sequelize's built-in logging
- Use indexes appropriately in migrations
- Consider raw queries for complex operations

### 5. Validation

**Issue**: Prisma schema validation vs. Sequelize model validation.

**Solution**:
- Implement validation in Sequelize models using `validate` option
- Keep Joi/Zod validation at the API layer
- Ensure database-level constraints in migrations

### 6. Testing Complexity

**Issue**: Mocking Sequelize is different from mocking Prisma.

**Solution**:
- Use `sequelize-mock` for unit tests
- Use test database for integration tests
- Create factory functions for test data

### 7. Migration History

**Issue**: Existing Prisma migration history vs. new Sequelize migrations.

**Solution**:
- Keep Prisma migration history for reference
- Create initial Sequelize migration that matches current schema
- Use migration timestamps to avoid conflicts

### 8. CLI Differences

**Issue**: Different command syntax between Prisma and Sequelize CLIs.

**Solution**:
- Update all documentation and scripts
- Create npm script aliases for common operations
- Train team on new CLI commands

---

## Post-Migration Cleanup

Once migration is verified complete (ALL tests pass, production deployed successfully):

1. **Remove Prisma artifacts**:
   ```bash
   rm -rf backend/prisma
   rm -rf backend/node_modules/.prisma
   rm -rf backend/node_modules/@prisma
   ```

2. **Update CI/CD pipelines**:
   - Remove Prisma generate steps
   - Add Sequelize migration steps
   - Update deployment scripts

3. **Archive migration backup**:
   ```bash
   tar -czf prisma-backup-archive.tar.gz .migration-backup/
   mv prisma-backup-archive.tar.gz ~/archives/
   rm -rf .migration-backup/
   ```

4. **Update team documentation**:
   - Onboarding guides
   - API documentation
   - Development workflows

---

## Support and Resources

### Sequelize Documentation

- **Official Docs**: https://sequelize.org/docs/v6/
- **TypeScript Guide**: https://sequelize.org/docs/v6/other-topics/typescript/
- **Migrations**: https://sequelize.org/docs/v6/other-topics/migrations/
- **Associations**: https://sequelize.org/docs/v6/core-concepts/assocs/

### Internal Resources

- **CLAUDE.md**: Updated with Sequelize patterns
- **README.md**: Updated with new commands
- **This Guide**: Keep as reference during migration

### Getting Help

- **Team Lead**: Review complex migration patterns
- **Database Admin**: Schema and performance questions
- **DevOps**: Deployment and CI/CD updates

---

## Conclusion

This migration is a significant undertaking but will provide long-term benefits for the White Cross platform. The documentation phase is complete, and the implementation phase can now begin.

**Next Steps:**
1. Review this guide with the team
2. Assign migration tasks to developers
3. Start with configuration and model creation
4. Migrate services in phases
5. Test thoroughly at each phase
6. Deploy to staging for validation
7. Production deployment with rollback plan ready

**Estimated Timeline:**
- Model creation: 2-3 days
- Service migration: 5-7 days
- Testing and validation: 3-4 days
- Production deployment: 1 day
- **Total**: 11-15 days

Good luck with the migration! This guide will be updated as new patterns and issues are discovered.

---

**Document Version**: 1.0
**Last Updated**: October 11, 2025
**Author**: Agent 7 - Documentation & Verification Specialist
