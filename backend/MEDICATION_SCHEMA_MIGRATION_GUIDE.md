# Medication Schema Migration Guide

## Overview

This codebase contains **TWO DIFFERENT** medication database schemas. This document explains the differences, which schema you're using, and how to migrate between them.

---

## Current Status

**The validators and routes have been updated to use the LEGACY schema by default.**

This means the API now validates against the single-table medications schema with fields: `medicationName`, `dosage`, `frequency`, `route`, `prescribedBy`, etc.

---

## Schema Comparison

### Legacy Schema (Currently Active)

**Migration File:** `backend/src/migrations/20251011221125-create-complete-healthcare-schema.js`

**Database Structure:** Single table

**Table: `medications`**
```sql
CREATE TABLE medications (
  id VARCHAR PRIMARY KEY,
  medicationName VARCHAR NOT NULL,          -- Medication name
  dosage VARCHAR NOT NULL,                  -- Dosage (e.g., "500mg", "2 tablets")
  frequency VARCHAR NOT NULL,               -- Frequency (e.g., "twice daily", "BID")
  route VARCHAR NOT NULL,                   -- Route (e.g., "Oral", "Topical")
  prescribedBy VARCHAR NOT NULL,            -- Prescribing physician
  startDate TIMESTAMP NOT NULL,             -- Start date
  endDate TIMESTAMP,                        -- End date (nullable)
  instructions TEXT,                        -- Administration instructions
  sideEffects TEXT,                         -- Known/observed side effects
  isActive BOOLEAN NOT NULL DEFAULT true,   -- Active status
  studentId VARCHAR NOT NULL,               -- Foreign key to students
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL,
  FOREIGN KEY (studentId) REFERENCES students(id)
);
```

**Characteristics:**
- Simple, single-table design
- Each medication record is tied to a specific student
- Combines medication details with prescription details
- No separate formulary or inventory management
- No medication administration logging
- No adverse reactions tracking

**Use Case:** Simple medication tracking for students

---

### New Schema (Available but Not Active)

**Migration File:** `backend/src/database/migrations/00004-create-medications-extended.ts`

**Database Structure:** Multiple tables (separation of concerns)

**Table 1: `medications` (Medication Formulary)**
```sql
CREATE TABLE medications (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,                    -- Medication name
  genericName VARCHAR,                      -- Generic name
  dosageForm VARCHAR NOT NULL,              -- Form (Tablet, Capsule, Liquid, etc.)
  strength VARCHAR NOT NULL,                -- Strength (e.g., "500mg")
  manufacturer VARCHAR,                     -- Manufacturer
  ndc VARCHAR UNIQUE,                       -- National Drug Code
  isControlled BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL
);
```

**Table 2: `student_medications` (Prescriptions)**
```sql
CREATE TABLE student_medications (
  id VARCHAR PRIMARY KEY,
  studentId VARCHAR NOT NULL,               -- Foreign key to students
  medicationId VARCHAR NOT NULL,            -- Foreign key to medications
  dosage VARCHAR NOT NULL,                  -- Prescribed dosage
  frequency VARCHAR NOT NULL,               -- Administration frequency
  route VARCHAR NOT NULL,                   -- Route of administration
  instructions TEXT,                        -- Special instructions
  startDate TIMESTAMP NOT NULL,             -- Prescription start
  endDate TIMESTAMP,                        -- Prescription end
  isActive BOOLEAN NOT NULL DEFAULT true,
  prescribedBy VARCHAR NOT NULL,            -- Prescribing physician
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL,
  FOREIGN KEY (studentId) REFERENCES students(id),
  FOREIGN KEY (medicationId) REFERENCES medications(id)
);
```

**Table 3: `medication_logs` (Administration Tracking)**
```sql
CREATE TABLE medication_logs (
  id VARCHAR PRIMARY KEY,
  studentMedicationId VARCHAR NOT NULL,     -- Foreign key to student_medications
  nurseId VARCHAR NOT NULL,                 -- Foreign key to users
  dosageGiven VARCHAR NOT NULL,             -- Actual dosage given
  timeGiven TIMESTAMP NOT NULL,             -- When administered
  administeredBy VARCHAR NOT NULL,          -- Who administered
  notes TEXT,                               -- Administration notes
  sideEffects TEXT,                         -- Observed side effects
  createdAt TIMESTAMP NOT NULL,
  FOREIGN KEY (studentMedicationId) REFERENCES student_medications(id),
  FOREIGN KEY (nurseId) REFERENCES users(id)
);
```

**Table 4: `medication_inventory` (Inventory Management)**
```sql
CREATE TABLE medication_inventory (
  id VARCHAR PRIMARY KEY,
  medicationId VARCHAR NOT NULL,            -- Foreign key to medications
  batchNumber VARCHAR NOT NULL,             -- Batch/lot number
  expirationDate TIMESTAMP NOT NULL,        -- Expiration date
  quantity INTEGER NOT NULL,                -- Current quantity
  reorderLevel INTEGER NOT NULL DEFAULT 10, -- Reorder threshold
  costPerUnit DECIMAL(10, 2),              -- Cost per unit
  supplier VARCHAR,                         -- Supplier name
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL,
  FOREIGN KEY (medicationId) REFERENCES medications(id)
);
```

**Characteristics:**
- Complex, multi-table design
- Separation of medication formulary from prescriptions
- Administration logging for compliance
- Inventory management with batch tracking
- Supports controlled substance tracking (DEA schedules)
- Five Rights of Medication Administration compliance
- Adverse reaction tracking (separate table, not shown)

**Use Case:** Enterprise healthcare facility with strict compliance requirements

---

## Files Updated for Legacy Schema

### 1. **New File:** `backend/src/validators/medicationValidators.legacy.ts`
   - **Purpose:** Joi validation schemas that match the legacy database schema
   - **Exports:**
     - `createMedicationLegacySchema` - Validates medication creation with legacy fields
     - `updateMedicationLegacySchema` - Validates medication updates
     - `deactivateMedicationLegacySchema` - Validates medication deactivation
     - `listMedicationsQueryLegacySchema` - Query params for listing medications
     - `medicationIdParamLegacySchema` - ID parameter validation
     - `studentIdParamLegacySchema` - Student ID parameter validation

### 2. **Updated:** `backend/src/validators/medicationValidators.ts`
   - **Changes:** Added header documentation explaining the two schemas
   - **Note:** This file still validates against the NEW schema (kept for future migration)

### 3. **Updated:** `backend/src/routes/v1/healthcare/validators/medications.validators.ts`
   - **Changes:**
     - Now imports from `medicationValidators.legacy.ts` instead of `medicationValidators.ts`
     - Added deprecation notices for NEW schema validators
     - Documented which validators are unavailable in legacy schema

### 4. **Updated:** `backend/src/routes/v1/healthcare/routes/medications.routes.ts`
   - **Changes:**
     - Updated route definitions to use legacy validators
     - Disabled routes that require NEW schema tables:
       - `/api/v1/medications/assign` (requires student_medications)
       - `/api/v1/medications/administration` (requires medication_logs)
       - `/api/v1/medications/inventory` (requires medication_inventory)
       - `/api/v1/medications/schedule` (requires student_medications)
       - `/api/v1/medications/reminders` (requires student_medications)
       - `/api/v1/medications/adverse-reaction` (requires adverse_reactions)
     - Created new legacy-compatible routes:
       - `GET /api/v1/medications` - List all medications (with pagination, search, filters)
       - `POST /api/v1/medications` - Create medication
       - `GET /api/v1/medications/{id}` - Get medication by ID
       - `PUT /api/v1/medications/{id}` - Update medication
       - `PUT /api/v1/medications/{id}/deactivate` - Deactivate medication
       - `GET /api/v1/medications/student/{studentId}` - Get student's medications

---

## How to Determine Which Schema You Have

### Method 1: Check Your Database
```sql
-- Run this query in your database
SELECT column_name FROM information_schema.columns
WHERE table_name = 'medications'
ORDER BY ordinal_position;
```

**If you see `medicationName`** → You have the **LEGACY schema** ✓ (Current configuration matches)

**If you see `name`, `dosageForm`, `strength`** → You have the **NEW schema** ⚠️ (Need to switch validators)

### Method 2: Check Migration History
```sql
-- Check which migrations have been run
SELECT * FROM SequelizeMeta ORDER BY name;
```

**If you see:** `20251011221125-create-complete-healthcare-schema.js` → **LEGACY schema**

**If you see:** `00004-create-medications-extended.ts` → **NEW schema**

---

## Migration Path: Legacy → New Schema

If you want to migrate from the legacy schema to the new schema:

### Step 1: Backup Your Data
```bash
# Backup your database before migration
pg_dump your_database > backup_before_migration.sql
```

### Step 2: Create Data Migration Script

Create a new migration file: `backend/src/migrations/XXXXX-migrate-legacy-to-new-schema.ts`

```typescript
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    // Step 1: Create new tables (from 00004-create-medications-extended.ts)
    // ... (copy table creation from 00004 migration)

    // Step 2: Migrate data from legacy medications to new schema
    await queryInterface.sequelize.query(`
      -- Create unique medications in new medications table
      INSERT INTO medications (id, name, dosageForm, strength, manufacturer, isControlled, createdAt, updatedAt)
      SELECT
        gen_random_uuid() as id,
        medicationName as name,
        'Tablet' as dosageForm,  -- Default, adjust as needed
        dosage as strength,
        '' as manufacturer,
        false as isControlled,
        createdAt,
        updatedAt
      FROM medications
      GROUP BY medicationName, dosage
      ON CONFLICT DO NOTHING;

      -- Create student_medications records from legacy data
      INSERT INTO student_medications (id, studentId, medicationId, dosage, frequency, route, instructions, startDate, endDate, isActive, prescribedBy, createdAt, updatedAt)
      SELECT
        old.id,
        old.studentId,
        new_med.id as medicationId,
        old.dosage,
        old.frequency,
        old.route,
        old.instructions,
        old.startDate,
        old.endDate,
        old.isActive,
        old.prescribedBy,
        old.createdAt,
        old.updatedAt
      FROM medications old
      LEFT JOIN medications new_med ON new_med.name = old.medicationName AND new_med.strength = old.dosage;
    `, { transaction });

    // Step 3: Rename old table
    await queryInterface.renameTable('medications', 'medications_legacy_backup', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // Rollback migration
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.dropTable('student_medications', { transaction });
    await queryInterface.dropTable('medication_logs', { transaction });
    await queryInterface.dropTable('medication_inventory', { transaction });
    await queryInterface.dropTable('medications', { transaction });
    await queryInterface.renameTable('medications_legacy_backup', 'medications', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

### Step 3: Update Code to Use New Schema

**File: `backend/src/routes/v1/healthcare/validators/medications.validators.ts`**

Change imports from:
```typescript
export {
  createMedicationSchema,
  updateMedicationSchema,
  deactivateMedicationSchema,
  listMedicationsQuerySchema,
  medicationIdParamSchema,
  studentIdParamSchema,
} from '../../../../validators/medicationValidators.legacy';
```

To:
```typescript
export {
  createMedicationSchema,
  updateMedicationSchema,
  assignMedicationToStudentSchema,
  updateStudentMedicationSchema,
  logMedicationAdministrationSchema,
  addToInventorySchema,
  updateInventoryQuantitySchema,
  reportAdverseReactionSchema,
  deactivateStudentMedicationSchema
} from '../../../../validators/medicationValidators';
```

**File: `backend/src/routes/v1/healthcare/routes/medications.routes.ts`**

Uncomment the disabled routes and update the exports array to include all 16 routes.

### Step 4: Run Migration
```bash
npm run migrate
```

### Step 5: Test Thoroughly
```bash
# Test all medication endpoints
npm run test:integration -- medications
```

---

## API Documentation Changes

### Legacy Schema API Endpoints (Currently Active)

#### GET /api/v1/medications
List all medications with pagination, search, and filters
- Query params: `page`, `limit`, `search`, `studentId`, `isActive`

#### POST /api/v1/medications
Create a new medication record
- Body: `{ medicationName, dosage, frequency, route, prescribedBy, startDate, endDate?, instructions?, sideEffects?, isActive?, studentId }`

#### GET /api/v1/medications/{id}
Get a specific medication by ID

#### PUT /api/v1/medications/{id}
Update a medication record
- Body: At least one of the medication fields

#### PUT /api/v1/medications/{id}/deactivate
Deactivate a medication
- Body: `{ reason, deactivationType }`

#### GET /api/v1/medications/student/{studentId}
Get all medications for a specific student
- Query params: `page`, `limit`, `search`, `isActive`

---

### New Schema API Endpoints (Disabled Until Migration)

The following endpoints will become available after migrating to the new schema:

- `POST /api/v1/medications/assign` - Assign medication to student
- `POST /api/v1/medications/administration` - Log medication administration
- `GET /api/v1/medications/logs/{studentId}` - Get administration logs
- `GET /api/v1/medications/inventory` - Get inventory with alerts
- `POST /api/v1/medications/inventory` - Add to inventory
- `PUT /api/v1/medications/inventory/{id}` - Update inventory quantity
- `GET /api/v1/medications/schedule` - Get administration schedule
- `GET /api/v1/medications/reminders` - Get medication reminders
- `POST /api/v1/medications/adverse-reaction` - Report adverse reaction
- `GET /api/v1/medications/adverse-reactions` - Get adverse reactions
- `GET /api/v1/medications/stats` - Get medication statistics
- `GET /api/v1/medications/alerts` - Get medication alerts
- `GET /api/v1/medications/form-options` - Get form dropdown options

---

## Troubleshooting

### Issue: Validation errors on medication creation

**Symptom:** API returns 400 with "medicationName is required" or "name is required"

**Solution:** Check which schema your database uses and ensure the validators match:
- Database has `medicationName` → Use legacy validators (current configuration)
- Database has `name` → Switch to new schema validators

### Issue: Routes returning 404

**Symptom:** `/api/v1/medications/assign` returns 404

**Solution:** This route requires the new schema. Either:
1. Migrate to new schema (see migration guide above)
2. Use the legacy equivalent: Create medication directly with `studentId`

### Issue: Controller methods don't exist

**Symptom:** `MedicationsController.deactivate is not a function`

**Solution:** The controller may need to be updated to include legacy-compatible methods. Check `backend/src/routes/v1/healthcare/controllers/medications.controller.ts`

---

## Recommendations

### For Small Clinics / Schools
**Recommendation:** Stay with **legacy schema**
- Simpler to maintain
- Fewer database tables
- Basic medication tracking is sufficient
- Less complex queries

### For Large Healthcare Facilities
**Recommendation:** Migrate to **new schema**
- Better compliance tracking (Five Rights)
- Separate formulary management
- Inventory control with batch tracking
- Administration logging for audits
- Controlled substance tracking (DEA compliance)
- Adverse reaction monitoring

---

## Support

For questions or issues:
1. Check this documentation first
2. Review the migration files to understand your current schema
3. Test in a development environment before making changes
4. Create a backup before any migration

---

**Document Version:** 1.0
**Last Updated:** 2025-10-23
**Author:** Claude Code (TypeScript Architect)
