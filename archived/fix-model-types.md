# Model Type Fixing Guide - Step-by-Step Instructions

This guide provides practical, copy-paste solutions for fixing TypeScript issues in Sequelize models.

## Quick Wins (Fix These First - 2 Hours)

### Fix 1: Test Factory Errors

**File:** `/workspaces/white-cross/backend/test/factories/user.factory.ts`

**Lines to Remove/Replace:** 85-97

```typescript
// REMOVE THESE LINES (85-97):
/**
 * Create a doctor user
 */
static createDoctor(overrides: CreateUserOptions = {}): any {
  return this.create({ ...overrides, role: UserRole.DOCTOR });
}

/**
 * Create a parent user
 */
static createParent(overrides: CreateUserOptions = {}): any {
  return this.create({ ...overrides, role: UserRole.PARENT });
}

// REPLACE WITH (if these roles are needed in future):
/**
 * Create a counselor user (medical professional)
 */
static createCounselor(overrides: CreateUserOptions = {}): any {
  return this.create({ ...overrides, role: UserRole.COUNSELOR });
}

/**
 * Create a viewer user (limited access, similar to parent)
 */
static createViewer(overrides: CreateUserOptions = {}): any {
  return this.create({ ...overrides, role: UserRole.VIEWER });
}
```

### Fix 2: Factory Exports

**File:** `/workspaces/white-cross/backend/test/factories/index.ts`

**Add these lines at the end:**

```typescript
// Existing content...

// Add these exports:
export { UserFactory } from './user.factory';
export { StudentFactory } from './student.factory';
```

### Fix 3: Verify Fixes

```bash
cd /workspaces/white-cross/backend
npx tsc --noEmit

# Should see fewer errors now
```

---

## Medium Effort Fixes (4-6 Hours Each)

### Fix Template: Add CreationAttributes Interface

**Pattern to use for ANY model missing CreationAttributes:**

```typescript
// Step 1: Identify auto-generated/optional fields in your model
// Look for:
// - @Default decorators
// - @PrimaryKey decorators
// - timestamp fields (createdAt, updatedAt)
// - deletedAt (if paranoid: true)
// - allowNull: true fields with defaults

// Step 2: Import Optional from Sequelize
import { Optional } from 'sequelize';

// Step 3: Add CreationAttributes interface AFTER the base Attributes interface
export interface {ModelName}CreationAttributes
  extends Optional<
    {ModelName}Attributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | /* other auto/optional fields */
  > {}

// Step 4: Update Model class declaration
// FROM:
export class {ModelName} extends Model<{ModelName}Attributes> {

// TO:
export class {ModelName} extends Model<{ModelName}Attributes, {ModelName}CreationAttributes> {
```

### Example: User Model

**File:** `/workspaces/white-cross/backend/src/database/models/user.model.ts`

**Add after line 54 (after UserAttributes interface):**

```typescript
/**
 * User creation attributes interface
 * Defines which fields are optional when creating a new user
 */
export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | 'id'
    | 'isActive'
    | 'lastLogin'
    | 'emailVerified'
    | 'emailVerificationToken'
    | 'emailVerificationExpires'
    | 'passwordResetToken'
    | 'passwordResetExpires'
    | 'passwordChangedAt'
    | 'twoFactorEnabled'
    | 'twoFactorSecret'
    | 'failedLoginAttempts'
    | 'lockoutUntil'
    | 'lastPasswordChange'
    | 'mustChangePassword'
    | 'mfaEnabled'
    | 'mfaSecret'
    | 'mfaBackupCodes'
    | 'mfaEnabledAt'
    | 'oauthProvider'
    | 'oauthProviderId'
    | 'profilePictureUrl'
    | 'isEmailVerified'
    | 'emailVerifiedAt'
    | 'deletedAt'
    | 'createdAt'
    | 'updatedAt'
  > {}
```

**Then update line 125:**

```typescript
// FROM:
export class User extends Model<UserAttributes> {

// TO:
export class User extends Model<UserAttributes, UserCreationAttributes> {
```

### Example: Student Model

**File:** `/workspaces/white-cross/backend/src/database/models/student.model.ts`

**Add after line 49 (after StudentAttributes interface):**

```typescript
/**
 * Student creation attributes interface
 */
export interface StudentCreationAttributes
  extends Optional<
    StudentAttributes,
    | 'id'
    | 'photo'
    | 'medicalRecordNum'
    | 'isActive'
    | 'enrollmentDate'
    | 'nurseId'
    | 'schoolId'
    | 'districtId'
    | 'createdBy'
    | 'updatedBy'
    | 'createdAt'
    | 'updatedAt'
  > {}
```

**Update line 140:**

```typescript
// FROM:
export class Student extends Model<StudentAttributes> implements StudentAttributes {

// TO:
export class Student extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes {
```

---

## High Effort Fixes (8-12 Hours)

### Fix Template: Add Type-Safe Associations

**For EVERY model file, follow this pattern:**

#### Step 1: Add Type-Only Imports at Top

```typescript
// AFTER regular imports, BEFORE interfaces/enums
// Add type-only imports for all models referenced in associations

import type { User } from './user.model';
import type { School } from './school.model';
import type { District } from './district.model';
import type { Appointment } from './appointment.model';
import type { HealthRecord } from './health-record.model';
// ... add all other models used in @BelongsTo, @HasMany, etc.
```

#### Step 2: Update Association Declarations

```typescript
// FROM:
@BelongsTo(() => require('./user.model').User, { foreignKey: 'nurseId', as: 'nurse' })
declare nurse?: any;

// TO:
@BelongsTo(() => require('./user.model').User, { foreignKey: 'nurseId', as: 'nurse' })
declare nurse?: User;

// FROM:
@HasMany(() => require('./appointment.model').Appointment, { foreignKey: 'studentId', as: 'appointments' })
declare appointments?: any[];

// TO:
@HasMany(() => require('./appointment.model').Appointment, { foreignKey: 'studentId', as: 'appointments' })
declare appointments?: Appointment[];
```

#### Step 3: Update Attributes Interface (If Needed)

```typescript
// If your attributes interface includes association fields, update them too
export interface StudentAttributes {
  // ... scalar fields

  // Update association fields from 'any' to proper type
  nurse?: User;           // FROM: nurse?: any;
  school?: School;        // FROM: school?: any;
  appointments?: Appointment[];  // FROM: appointments?: any[];
}
```

### Complete Example: Student Model Associations

**File:** `/workspaces/white-cross/backend/src/database/models/student.model.ts`

**Add at top (after existing imports, around line 18):**

```typescript
import type { User } from './user.model';
import type { School } from './school.model';
import type { District } from './district.model';
import type { HealthRecord } from './health-record.model';
import type { AcademicTranscript } from './academic-transcript.model';
import type { MentalHealthRecord } from './mental-health-record.model';
import type { Appointment } from './appointment.model';
import type { Prescription } from './prescription.model';
import type { ClinicVisit } from './clinic-visit.model';
import type { Allergy } from './allergy.model';
import type { ChronicCondition } from './chronic-condition.model';
import type { Vaccination } from './vaccination.model';
import type { VitalSigns } from './vital-signs.model';
import type { ClinicalNote } from './clinical-note.model';
import type { IncidentReport } from './incident-report.model';
```

**Update association declarations (lines 382-427):**

```typescript
// Update each association from 'any' to proper type:

@BelongsTo(() => require('./user.model').User, { foreignKey: 'nurseId', as: 'nurse' })
declare nurse?: User; // Changed from: declare nurse?: any;

@BelongsTo(() => require('./school.model').School, { foreignKey: 'schoolId', as: 'school' })
declare school?: School; // Changed from: declare school?: any;

@BelongsTo(() => require('./district.model').District, { foreignKey: 'districtId', as: 'district' })
declare district?: District; // Changed from: declare district?: any;

@HasMany(() => require('./health-record.model').HealthRecord, { foreignKey: 'studentId', as: 'healthRecords' })
declare healthRecords?: HealthRecord[]; // Changed from: declare healthRecords?: any[];

@HasMany(() => require('./academic-transcript.model').AcademicTranscript, { foreignKey: 'studentId', as: 'academicTranscripts' })
declare academicTranscripts?: AcademicTranscript[]; // Changed from: declare academicTranscripts?: any[];

@HasMany(() => require('./mental-health-record.model').MentalHealthRecord, { foreignKey: 'studentId', as: 'mentalHealthRecords' })
declare mentalHealthRecords?: MentalHealthRecord[]; // Changed from: declare mentalHealthRecords?: any[];

@HasMany(() => require('./appointment.model').Appointment, { foreignKey: 'studentId', as: 'appointments' })
declare appointments?: Appointment[]; // Changed from: declare appointments?: any[];

@HasMany(() => require('./prescription.model').Prescription, { foreignKey: 'studentId', as: 'prescriptions' })
declare prescriptions?: Prescription[]; // Changed from: declare prescriptions?: any[];

@HasMany(() => require('./clinic-visit.model').ClinicVisit, { foreignKey: 'studentId', as: 'clinicVisits' })
declare clinicVisits?: ClinicVisit[]; // Changed from: declare clinicVisits?: any[];

@HasMany(() => require('./allergy.model').Allergy, { foreignKey: 'studentId', as: 'allergies' })
declare allergies?: Allergy[]; // Changed from: declare allergies?: any[];

@HasMany(() => require('./chronic-condition.model').ChronicCondition, { foreignKey: 'studentId', as: 'chronicConditions' })
declare chronicConditions?: ChronicCondition[]; // Changed from: declare chronicConditions?: any[];

@HasMany(() => require('./vaccination.model').Vaccination, { foreignKey: 'studentId', as: 'vaccinations' })
declare vaccinations?: Vaccination[]; // Changed from: declare vaccinations?: any[];

@HasMany(() => require('./vital-signs.model').VitalSigns, { foreignKey: 'studentId', as: 'vitalSigns' })
declare vitalSigns?: VitalSigns[]; // Changed from: declare vitalSigns?: any[];

@HasMany(() => require('./clinical-note.model').ClinicalNote, { foreignKey: 'studentId', as: 'clinicalNotes' })
declare clinicalNotes?: ClinicalNote[]; // Changed from: declare clinicalNotes?: any[];

@HasMany(() => require('./incident-report.model').IncidentReport, { foreignKey: 'studentId', as: 'incidentReports' })
declare incidentReports?: IncidentReport[]; // Changed from: declare incidentReports?: any[];
```

---

## Automation Scripts

### Script 1: Find All Models Needing Type Imports

```bash
#!/bin/bash
# scripts/find-models-with-any-associations.sh

echo "Models with 'any' type in associations:"
echo "========================================="

for file in src/database/models/*.model.ts; do
  count=$(grep -c "declare.*: any" "$file" 2>/dev/null || echo 0)
  if [ "$count" -gt 0 ]; then
    echo "$file: $count occurrences"
  fi
done

echo ""
echo "Total models with issues:"
grep -r "declare.*: any" src/database/models/*.model.ts | wc -l
```

### Script 2: Find Models Missing CreationAttributes

```bash
#!/bin/bash
# scripts/find-models-missing-creation-attrs.sh

echo "Models missing CreationAttributes interface:"
echo "============================================="

for file in src/database/models/*.model.ts; do
  if ! grep -q "CreationAttributes" "$file"; then
    echo "$file"
  fi
done

echo ""
echo "Total count:"
grep -L "CreationAttributes" src/database/models/*.model.ts | wc -l
```

### Script 3: Generate Type Import Statements

```bash
#!/bin/bash
# scripts/generate-type-imports.sh
# Usage: ./scripts/generate-type-imports.sh src/database/models/student.model.ts

if [ -z "$1" ]; then
  echo "Usage: $0 <model-file>"
  exit 1
fi

echo "Analyzing $1 for association imports needed..."
echo ""
echo "Add these type-only imports:"
echo "============================"

# Extract model names from @BelongsTo and @HasMany decorators
grep -E "@(BelongsTo|HasMany|HasOne|BelongsToMany)" "$1" | \
  grep -oP "require\('\./[^']+'\)\.\K\w+" | \
  sort -u | \
  while read model; do
    modelFile=$(echo "$model" | sed 's/\([A-Z]\)/-\L\1/g' | sed 's/^-//' | tr '[:upper:]' '[:lower:]')
    echo "import type { $model } from './${modelFile}.model';"
  done
```

---

## Testing Your Fixes

### Step 1: TypeScript Compilation

```bash
cd /workspaces/white-cross/backend
npx tsc --noEmit
```

**Expected Result:** Fewer errors after each fix

### Step 2: Run Tests

```bash
npm test
```

**Expected Result:** Tests pass without type errors

### Step 3: IDE Check

Open any service file that uses models and check:
1. Autocomplete works for associations
2. No red underlines on type usage
3. Hover over variables shows correct types

---

## Validation Checklist

After fixing a model, verify:

- [ ] Model class extends `Model<Attributes, CreationAttributes>`
- [ ] CreationAttributes interface exists and uses `Optional<>`
- [ ] All type-only imports added for associations
- [ ] All `declare` keywords use proper types (no `any`)
- [ ] All properties consistently use `declare` keyword
- [ ] Nullable fields properly typed with `| null`
- [ ] `npx tsc --noEmit` shows no errors for this file
- [ ] Tests using this model compile and pass

---

## Priority Order for Fixing Models

### Tier 1: Most Critical (Fix First)
1. `user.model.ts` - Core authentication
2. `student.model.ts` - Core entity
3. `appointment.model.ts` - Heavily used
4. `school.model.ts` - Base entity
5. `district.model.ts` - Base entity

### Tier 2: High Usage
6. `health-record.model.ts`
7. `clinical-note.model.ts`
8. `incident-report.model.ts`
9. `allergy.model.ts`
10. `prescription.model.ts`

### Tier 3: Medium Usage
11. `alert.model.ts`
12. `message.model.ts`
13. `vital-signs.model.ts`
14. `vaccination.model.ts`
15. `chronic-condition.model.ts`

### Tier 4: Lower Priority
Remaining 75+ models can be fixed in any order

---

## Common Pitfalls to Avoid

### Pitfall 1: Circular Dependency Errors

**Problem:**
```typescript
// DON'T import the actual model (causes circular dependency)
import { User } from './user.model'; // ❌
```

**Solution:**
```typescript
// DO use type-only import
import type { User } from './user.model'; // ✅
```

### Pitfall 2: Forgetting `| null` for Nullable Fields

**Problem:**
```typescript
@Column({ allowNull: true })
declare lastLogin?: Date; // ❌ Missing | null
```

**Solution:**
```typescript
@Column({ allowNull: true })
declare lastLogin?: Date | null; // ✅
```

### Pitfall 3: Including Association Fields in Optional<>

**Problem:**
```typescript
export interface StudentCreationAttributes
  extends Optional<
    StudentAttributes,
    'id' | 'appointments' // ❌ Don't include associations
  > {}
```

**Solution:**
```typescript
export interface StudentCreationAttributes
  extends Optional<
    StudentAttributes,
    'id' | 'createdAt' | 'updatedAt' // ✅ Only scalar fields
  > {}
```

---

## Getting Help

If you encounter issues:

1. **Check the full report:** `TYPESCRIPT_SEQUELIZE_AUDIT_REPORT.md`
2. **Check quick reference:** `TYPESCRIPT_ISSUES_SUMMARY.md`
3. **Run diagnostics:**
   ```bash
   npx tsc --noEmit --listFiles | grep "error"
   ```
4. **Look for similar models:** Find a model that already has the correct pattern

**Models with correct patterns (use as reference):**
- `message.model.ts` - Has CreationAttributes ✅
- `district.model.ts` - Has CreationAttributes ✅
- `school.model.ts` - Has CreationAttributes ✅

---

**Good luck fixing the types! Start with the Quick Wins section and work your way down.**
