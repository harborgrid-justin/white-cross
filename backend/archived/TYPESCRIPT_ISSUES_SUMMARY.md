# TypeScript Issues - Quick Reference Summary

**Last Updated:** 2025-11-05

## Critical Issues to Fix Immediately

### 1. Test Compilation Failures
**Files:** `test/factories/user.factory.ts`
**Lines:** 89, 96
**Error:** UserRole.DOCTOR and UserRole.PARENT don't exist
**Fix:** Remove these methods or map to existing roles (NURSE, COUNSELOR)

```typescript
// Remove these:
static createDoctor(overrides: CreateUserOptions = {}): any {
  return this.create({ ...overrides, role: UserRole.DOCTOR }); // DOCTOR doesn't exist
}

static createParent(overrides: CreateUserOptions = {}): any {
  return this.create({ ...overrides, role: UserRole.PARENT }); // PARENT doesn't exist
}
```

### 2. Missing Factory Exports
**File:** `test/factories/index.ts`
**Lines:** 14-15
**Error:** UserFactory and StudentFactory not defined
**Fix:** Add exports

```typescript
export { UserFactory } from './user.factory';
export { StudentFactory } from './student.factory';
```

---

## High-Impact Type Safety Issues

### Issue #1: All Associations Use `any` Type (90+ files)

**Current Pattern:**
```typescript
@HasMany(() => require('./appointment.model').Appointment, { foreignKey: 'nurseId', as: 'appointments' })
declare appointments?: any[]; // ❌ No type safety
```

**Fixed Pattern:**
```typescript
import type { Appointment } from './appointment.model';

@HasMany(() => Appointment, { foreignKey: 'nurseId', as: 'appointments' })
declare appointments?: Appointment[]; // ✅ Type safe
```

**Impact:** Zero autocomplete, no type checking, runtime errors

---

### Issue #2: Missing Creation Attributes (30+ files)

**Current Pattern:**
```typescript
export class User extends Model<UserAttributes> { // ❌ Missing second parameter
```

**Fixed Pattern:**
```typescript
export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> { // ✅ Complete
```

**Impact:** Type errors when using `.create()`, incorrect required field detection

---

### Issue #3: Inconsistent `declare` Keyword Usage (40+ files)

**Current Pattern (Mixed):**
```typescript
export class Student extends Model<StudentAttributes> {
  declare id: string;           // ✅ Has declare
  studentNumber: string;        // ❌ Missing declare
  firstName: string;            // ❌ Missing declare
  declare createdAt?: Date;     // ✅ Has declare
}
```

**Fixed Pattern (Consistent):**
```typescript
export class Student extends Model<StudentAttributes> {
  declare id: string;
  declare studentNumber: string;
  declare firstName: string;
  declare createdAt?: Date;
}
```

---

## Files Requiring Immediate Attention

### Critical Priority (Breaks Compilation)
1. `/workspaces/white-cross/backend/test/factories/user.factory.ts` (lines 89, 96)
2. `/workspaces/white-cross/backend/test/factories/index.ts` (lines 14-15)

### High Priority (Major Type Safety Issues)
1. `/workspaces/white-cross/backend/src/database/models/user.model.ts`
   - Add UserCreationAttributes interface
   - Fix association types (lines 387-411)
   - Add missing fields to UserAttributes interface (lines 295-370)

2. `/workspaces/white-cross/backend/src/database/models/student.model.ts`
   - Add StudentCreationAttributes interface
   - Fix association types (lines 382-427)
   - Make all properties use `declare` (lines 140-340)

3. `/workspaces/white-cross/backend/src/database/models/appointment.model.ts`
   - Add AppointmentCreationAttributes interface
   - Fix association types (lines 194-305)

4. `/workspaces/white-cross/backend/src/database/models/incident-report.model.ts`
   - Fix association types (lines 365-375)
   - Update attribute interface with proper types

5. `/workspaces/white-cross/backend/src/database/models/allergy.model.ts`
   - Add AllergyCreationAttributes interface
   - Make all properties use `declare` consistently

---

## Quick Fix Commands

### 1. Check TypeScript Errors
```bash
cd /workspaces/white-cross/backend
npx tsc --noEmit
```

### 2. Find All `any` Type Usage in Models
```bash
grep -r "declare.*: any" src/database/models/*.model.ts | wc -l
# Currently: 200+ occurrences
```

### 3. Find Models Missing Creation Attributes
```bash
grep -L "CreationAttributes" src/database/models/*.model.ts | wc -l
# Currently: 30+ files
```

---

## Recommended Fix Order

### Week 1: Fix Breaking Issues
- [ ] Fix test factory UserRole errors
- [ ] Export missing factories
- [ ] Verify all tests compile

### Week 2-3: Add Type Safety
- [ ] Add type-only imports to all models
- [ ] Update all association declarations
- [ ] Add CreationAttributes interfaces to top 10 most-used models

### Week 4: Standardization
- [ ] Make all properties use `declare` consistently
- [ ] Update attribute interfaces with missing fields
- [ ] Fix nullable type annotations (add `| null` where needed)

---

## Code Templates

### Template 1: Complete Model with All Best Practices
```typescript
import { Table, Column, Model, DataType, PrimaryKey, Default, BelongsTo, HasMany } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import type { RelatedModel } from './related.model';

// 1. Define complete attributes interface
export interface ExampleAttributes {
  id?: string;
  name: string;
  isActive?: boolean;
  relatedId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  // Virtual/association fields
  related?: RelatedModel;
  children?: ChildModel[];
}

// 2. Define creation attributes
export interface ExampleCreationAttributes
  extends Optional<ExampleAttributes, 'id' | 'isActive' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'related' | 'children'> {}

// 3. Define model
@Table({ tableName: 'examples', timestamps: true, paranoid: true })
export class Example extends Model<ExampleAttributes, ExampleCreationAttributes>
  implements ExampleAttributes {

  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;

  @ForeignKey(() => RelatedModel)
  @Column({ type: DataType.UUID })
  declare relatedId?: string;

  @Column(DataType.DATE)
  declare createdAt: Date;

  @Column(DataType.DATE)
  declare updatedAt: Date;

  @Column(DataType.DATE)
  declare deletedAt?: Date;

  // Associations with proper types
  @BelongsTo(() => RelatedModel, { foreignKey: 'relatedId', as: 'related' })
  declare related?: RelatedModel;

  @HasMany(() => ChildModel, { foreignKey: 'exampleId', as: 'children' })
  declare children?: ChildModel[];
}
```

### Template 2: Type-Safe Association Import Pattern
```typescript
// At top of file - type-only imports (doesn't cause circular dependency)
import type { User } from './user.model';
import type { School } from './school.model';
import type { HealthRecord } from './health-record.model';

// In class - use proper types instead of 'any'
@BelongsTo(() => require('./user.model').User, { foreignKey: 'nurseId', as: 'nurse' })
declare nurse?: User; // Type safe!

@BelongsTo(() => require('./school.model').School, { foreignKey: 'schoolId', as: 'school' })
declare school?: School; // Type safe!

@HasMany(() => require('./health-record.model').HealthRecord, { foreignKey: 'studentId', as: 'healthRecords' })
declare healthRecords?: HealthRecord[]; // Type safe!
```

---

## Statistics

### Current State
- **Total Models:** 95+
- **Models with `any` associations:** 90+ (95%)
- **Models missing CreationAttributes:** 30+ (32%)
- **TypeScript compilation errors:** 45+
- **Test failures due to types:** 15+

### Target State (After Fixes)
- **Models with `any` associations:** 0 (0%)
- **Models missing CreationAttributes:** 0 (0%)
- **TypeScript compilation errors:** 0
- **Test failures due to types:** 0
- **Type safety coverage:** 100%

---

## Resources

- **Full Audit Report:** `TYPESCRIPT_SEQUELIZE_AUDIT_REPORT.md` (comprehensive 14-section analysis)
- **Sequelize TypeScript Docs:** https://github.com/sequelize/sequelize-typescript
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/

---

## Quick Reference: Common Patterns

### Pattern: Optional vs Required Fields
```typescript
// If field has defaultValue or is auto-generated -> Optional in interface
@Column({ type: DataType.BOOLEAN, defaultValue: true })
declare isActive?: boolean; // Optional in interface

// If field is allowNull: false and no default -> Required in interface
@Column({ type: DataType.STRING, allowNull: false })
declare name: string; // Required in interface
```

### Pattern: Nullable Fields
```typescript
// If allowNull: true -> add | null
@Column({ type: DataType.DATE, allowNull: true })
declare lastLogin?: Date | null; // Can be undefined OR null

// If allowNull: false -> no | null needed
@Column({ type: DataType.DATE, allowNull: false })
declare createdAt: Date; // Never null
```

### Pattern: Timestamps
```typescript
// In paranoid models (soft delete)
declare createdAt?: Date;
declare updatedAt?: Date;
declare deletedAt?: Date; // Only for paranoid: true

// Always optional in base interface, excluded from creation interface
```

---

**For detailed analysis and recommendations, see `TYPESCRIPT_SEQUELIZE_AUDIT_REPORT.md`**
