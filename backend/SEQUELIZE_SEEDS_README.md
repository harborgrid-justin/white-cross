# Sequelize Seeds Documentation

## Overview

This document provides comprehensive guidance for using the Sequelize seeders in the White Cross healthcare platform. All seeders have been converted from Prisma to Sequelize as part of the ORM migration.

## Table of Contents

- [Seeder Files](#seeder-files)
- [Execution Order](#execution-order)
- [Running Seeds](#running-seeds)
- [Test Database Setup](#test-database-setup)
- [HIPAA Compliance](#hipaa-compliance)
- [Troubleshooting](#troubleshooting)

---

## Seeder Files

All seeder files are located in: `backend/src/database/seeders/`

### Complete List

| File | Description | Records Created | Dependencies |
|------|-------------|----------------|--------------|
| `01-districts-and-schools.ts` | Creates districts and schools | 1 district, 5 schools | None |
| `02-permissions-and-roles.ts` | RBAC foundation | 22 permissions, 4 roles | None |
| `03-users-and-assignments.ts` | Users with role assignments | 17 users | Districts, Schools, Roles |
| `04-medications-and-inventory.ts` | Medication catalog | 12 medications + inventory | None |
| `05-students.ts` | Student records | 500 students | Users (nurses) |
| `06-emergency-contacts.ts` | Parent/guardian contacts | 1000 contacts (2/student) | Students |
| `07-health-data.ts` | Medical records | ~1000 health records, ~100 allergies, ~50 conditions | Students, Users |
| `08-appointments-and-incidents.ts` | Operational data | ~75 appointments, ~25 incidents | Students, Users |
| `09-nurse-availability-and-system-config.ts` | System configuration | ~35 availability slots, 29 configs | Users (nurses) |

---

## Execution Order

**CRITICAL:** Seeders must be run in the exact order listed above due to foreign key dependencies.

### Dependency Graph

```
01-districts-and-schools
    ├── 03-users-and-assignments
    │   ├── 05-students
    │   │   ├── 06-emergency-contacts
    │   │   ├── 07-health-data
    │   │   └── 08-appointments-and-incidents
    │   └── 09-nurse-availability-and-system-config
    └── 02-permissions-and-roles
        └── 03-users-and-assignments

04-medications-and-inventory (independent)
```

---

## Running Seeds

### Development Environment

#### Run All Seeders (Recommended)
```bash
# From backend directory
npm run seed

# Or using the script directly
ts-node src/database/seeders/seed.ts
```

#### Run Individual Seeders
```bash
# Using sequelize-cli
npx sequelize-cli db:seed --seed 01-districts-and-schools

# Or run specific seeders programmatically
ts-node -e "require('./src/database/seeders/01-districts-and-schools').up(sequelize.getQueryInterface())"
```

#### Undo Seeders
```bash
# Undo all seeders (reverse order)
npm run seed:undo:all

# Or using the script
ts-node src/database/seeders/seed.ts down

# Undo last seeder only
npx sequelize-cli db:seed:undo
```

### Test Environment

#### Setup Test Database
```bash
# Set environment
export NODE_ENV=test

# Run migrations
npm run db:migrate

# Run seeders
npm run seed
```

#### In Test Files
```typescript
import { seedTestDatabase, clearDatabase } from '../__tests__/helpers/testDatabase';

beforeAll(async () => {
  await seedTestDatabase(); // Runs all seeders
});

afterEach(async () => {
  await clearDatabase(); // Clears data between tests
});
```

### Production Environment

**WARNING:** Seeding is disabled in production by default for safety.

To enable (use with extreme caution):
```bash
export ALLOW_SEED_IN_PRODUCTION=true
npm run seed
```

---

## Test Database Setup

### Test Helpers Location

`backend/src/__tests__/helpers/testDatabase.ts`

### Available Functions

#### Database Management

```typescript
// Clear all data (preserves tables)
await clearDatabase();

// Drop and recreate all tables (destructive)
await resetDatabase();

// Run all seeders
await seedTestDatabase();

// Run specific seeders
await seedSpecific(['01-districts-and-schools', '02-permissions-and-roles']);
```

#### Data Factories

```typescript
// Create test user
const user = await createTestUser({
  email: 'test@example.com',
  role: 'NURSE',
  firstName: 'Test',
  lastName: 'User'
});

// Create test student
const student = await createTestStudent({
  firstName: 'John',
  lastName: 'Doe',
  grade: '6th Grade'
});
```

#### Assertions

```typescript
// Count records
const userCount = await countRecords('Users');
expect(userCount).toBe(5);

// Assert record count (throws on mismatch)
await assertRecordCount('Students', 500);

// Get record by ID
const user = await getRecordById('Users', 1);
expect(user.email).toBe('admin@whitecross.health');
```

#### Safety Checks

```typescript
// Ensures test database is being used
ensureTestDatabase(); // Throws if not test DB
```

### Jest Configuration

The `jest.config.js` is already configured to:
- Use `src/__tests__/setup.ts` for global setup
- Run tests with 30-second timeout
- Support TypeScript with ts-jest
- Use Sequelize instead of Prisma

### Example Test

```typescript
describe('User Tests', () => {
  beforeAll(() => {
    ensureTestDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it('should create user', async () => {
    const user = await createTestUser();
    expect(user.id).toBeDefined();
  });
});
```

---

## HIPAA Compliance

### Data Classification

All seed data is **DE-IDENTIFIED and SYNTHETIC**. No real PHI is used.

#### Compliant Data
- ✅ Randomly generated names from common name lists
- ✅ Synthetic phone numbers: `(XXX) XXX-XXXX`
- ✅ Fake email addresses: `name@domain.com`
- ✅ Generic medical conditions (no specific patient info)
- ✅ Sequential test IDs: `STU00001`, `MR00001`

#### Non-Compliant Data (DO NOT ADD)
- ❌ Real patient names
- ❌ Actual SSNs or medical record numbers
- ❌ Real addresses or contact information
- ❌ Specific diagnoses tied to real individuals
- ❌ Any data copied from production systems

### Audit Trail

All seeders log their operations:
```
✓ Seeded 1 district and 5 schools
✓ Seeded 22 permissions and 4 roles with mappings
✓ Seeded 17 users with role assignments
```

---

## Login Credentials

### Production Accounts

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Super Admin | admin@whitecross.health | admin123 | Full system access |
| District Admin | district.admin@unifiedschools.edu | admin123 | District-level admin |
| School Admin | school.admin@centralhigh.edu | admin123 | School-level admin |
| Head Nurse | nurse@whitecross.health | admin123 | Primary nurse account |
| Counselor | counselor@centralhigh.edu | admin123 | School counselor |
| Viewer | viewer@centralhigh.edu | admin123 | Read-only access |

### Test Accounts (for Cypress E2E)

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Admin | admin@school.edu | AdminPassword123! | Test admin user |
| Nurse | nurse@school.edu | testNursePassword | Test nurse user |
| Counselor | counselor@school.edu | CounselorPassword123! | Test counselor |
| Read Only | readonly@school.edu | ReadOnlyPassword123! | Test viewer |

**Security Note:** These passwords are for development/testing only. Production systems must use strong, unique passwords.

---

## Data Statistics

### Total Records Created

| Entity | Count | Notes |
|--------|-------|-------|
| Districts | 1 | Unified School District |
| Schools | 5 | 2 High, 2 Elementary, 1 Middle |
| Users | 17 | 4 Admin, 7 Nurses, 3 Counselors, 3 Viewers |
| Roles | 4 | Administrator, Nurse, Counselor, Read Only |
| Permissions | 22 | CRUD across 6 resources |
| Students | 500 | Ages 5-18, K-12 |
| Emergency Contacts | 1000 | 2 per student (primary + secondary) |
| Medications | 12 | Including 3 controlled substances |
| Health Records | ~1000 | 1-3 per student |
| Allergies | ~100 | 20% of students |
| Chronic Conditions | ~50 | 10% of students |
| Appointments | ~75 | 15% of students |
| Incidents | ~25 | 5% of students |
| Nurse Availability | ~35 | Mon-Fri for 7 nurses |
| System Configs | 29 | All categories |

**Total Records:** ~2,770 records

---

## Seeder Execution Time

Approximate execution times:

| Seeder | Time | Bottleneck |
|--------|------|------------|
| 01-districts-and-schools | <1s | Minimal records |
| 02-permissions-and-roles | <1s | Minimal records |
| 03-users-and-assignments | 1-2s | Password hashing (bcrypt) |
| 04-medications-and-inventory | <1s | Minimal records |
| 05-students | 5-10s | 500 records in batches |
| 06-emergency-contacts | 3-5s | 1000 records in batches |
| 07-health-data | 5-8s | Multiple tables, ~1150 records |
| 08-appointments-and-incidents | 1-2s | ~100 records |
| 09-nurse-availability-and-system-config | 1-2s | ~64 records |

**Total Time:** ~20-30 seconds

---

## Troubleshooting

### Common Issues

#### 1. Foreign Key Constraint Errors
```
ERROR: insert or update on table violates foreign key constraint
```

**Solution:** Seeders ran out of order. Drop database and run in correct sequence:
```bash
npm run db:migrate:undo:all
npm run db:migrate
npm run seed
```

#### 2. Duplicate Key Errors
```
ERROR: duplicate key value violates unique constraint
```

**Solution:** Database already seeded. Clear and re-run:
```bash
ts-node src/database/seeders/seed.ts down
ts-node src/database/seeders/seed.ts up
```

#### 3. No Nurses Found Error
```
Error: No nurses found. Please run user seeder first.
```

**Solution:** User seeder (03) must run before student seeder (05).

#### 4. Test Database Not Configured
```
DANGER: Not using test database!
```

**Solution:** Set environment variable:
```bash
export NODE_ENV=test
```

And ensure `.env.test` has test database configuration:
```
DATABASE_URL=postgresql://user:pass@localhost:5432/whitecross_test
```

#### 5. Slow Seeding Performance

**Solution:**
- Ensure database has proper indexes (migrations should handle this)
- Use batch inserts (already implemented)
- Check database connection latency

---

## Best Practices

### Development

1. **Always seed in dev** before starting development
2. **Use test helpers** in unit/integration tests
3. **Clear test DB** between test runs for isolation
4. **Never modify seeder order** without updating dependencies

### Testing

1. **Use test database only** - verify with `ensureTestDatabase()`
2. **Clean up after tests** - use `afterEach(clearDatabase)`
3. **Use data factories** - `createTestUser()`, `createTestStudent()`
4. **Test in isolation** - don't rely on seeded data in tests

### Production

1. **NEVER run seeds in production** without explicit approval
2. **Backup before seeding** if you must seed production
3. **Use anonymized data** - no real PHI
4. **Review audit logs** after seeding

---

## Migration from Prisma

### Changes Made

| Aspect | Prisma | Sequelize |
|--------|--------|-----------|
| Seeder Location | `prisma/seed.ts` | `src/database/seeders/*.ts` |
| Execution | `npm run seed` (Prisma) | `npm run seed` (Sequelize) |
| API | `prisma.model.upsert()` | `queryInterface.bulkInsert()` |
| Transactions | Implicit | Manual if needed |
| Type Safety | Prisma Client | Sequelize Models |

### Compatibility

Both seeding systems create the same data:
- ✅ Same number of records
- ✅ Same relationships
- ✅ Same test credentials
- ✅ HIPAA compliant in both

---

## Scripts Reference

### NPM Scripts

```json
{
  "seed": "ts-node src/database/seeders/seed.ts",
  "seed:dev": "npm run seed",
  "seed:test": "NODE_ENV=test npm run seed",
  "seed:undo": "ts-node src/database/seeders/seed.ts down",
  "seed:undo:all": "npm run seed:undo",
  "db:seed": "sequelize-cli db:seed:all",
  "db:seed:undo": "sequelize-cli db:seed:undo"
}
```

### CLI Commands

```bash
# Sequelize CLI (alternative method)
npx sequelize-cli db:seed:all                    # Run all
npx sequelize-cli db:seed --seed 01-districts    # Run one
npx sequelize-cli db:seed:undo                   # Undo last
npx sequelize-cli db:seed:undo:all               # Undo all
```

---

## Support

For issues or questions:

1. Check this documentation
2. Review the [Troubleshooting](#troubleshooting) section
3. Examine seeder code in `src/database/seeders/`
4. Check test helpers in `src/__tests__/helpers/testDatabase.ts`

---

## License

This seeding system is part of the White Cross healthcare platform and follows the same license terms.

---

**Last Updated:** 2025-10-11
**Migration Agent:** Agent 6 of 7
**Version:** 1.0.0
