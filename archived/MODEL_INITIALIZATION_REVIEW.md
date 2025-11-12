# Sequelize Model Initialization Code Review
**Date**: 2025-10-30
**Reviewed**: All models in `backend/src/database/models/`
**Reference**: [Sequelize v6 API Documentation](https://sequelize.org/api/v6/identifiers)

## Executive Summary

Reviewed **95+ model files** for Sequelize configuration, TypeScript typing, and best practices compliance. Found **CRITICAL** and **IMPORTANT** issues that need immediate attention for consistency, maintainability, and proper database operation.

### Severity Levels
- **CRITICAL**: Breaks functionality, data integrity, or causes runtime errors
- **IMPORTANT**: Architecture/maintainability issues, inconsistencies
- **SUGGESTIONS**: Improvements following best practices

---

## CRITICAL ISSUES

### 1. Inconsistent `underscored` Configuration
**Severity**: CRITICAL
**Impact**: Database schema inconsistencies, query failures in production

**Problem**: Mixed usage of `underscored: false` setting across models
- **29 models** explicitly set `underscored: false`
- **65+ models** rely on default (which is `false` in sequelize-typescript but can vary)
- Database module sets global default: `underscored: false` (database.module.ts:191)

**Files with explicit `underscored: false`**:
- user.model.ts
- school.model.ts
- district.model.ts
- appointment.model.ts
- message.model.ts
- conversation.model.ts
- conversation-participant.model.ts
- audit-log.model.ts
- And 21 more...

**Files WITHOUT explicit setting** (relying on global default):
- student.model.ts
- health-record.model.ts
- allergy.model.ts
- medication.model.ts
- vaccination.model.ts
- clinic-visit.model.ts
- inventory-item.model.ts
- And 58+ more...

**Fix Required**:
```typescript
// Add to ALL models consistently
@Table({
  tableName: 'table_name',
  timestamps: true,
  underscored: false, // ← MUST be explicit in every model
  // ... other options
})
```

**Why This Matters**:
- `underscored: true` converts camelCase to snake_case (e.g., `firstName` → `first_name`)
- `underscored: false` keeps camelCase field names
- Inconsistency causes: column not found errors, foreign key mismatches, migration issues
- Global defaults can change between Sequelize versions

---

### 2. Missing or Inconsistent `paranoid` Configuration
**Severity**: CRITICAL
**Impact**: Data retention compliance violations, unexpected hard deletes

**Problem**: Inconsistent soft delete configuration across models containing PHI

**Models WITH `paranoid: true`** (3 found):
- message.model.ts (line 68)
- conversation.model.ts (line 71)
- vaccination.model.ts (line 131)

**Models WITHOUT `paranoid` setting but containing PHI** (should have soft deletes):
- student.model.ts (explicitly sets `paranoid: false` - line 51)
- health-record.model.ts (no paranoid setting)
- allergy.model.ts (no paranoid setting)
- clinic-visit.model.ts (no paranoid setting)
- incident-report.model.ts (unknown - needs verification)
- medical-history.model.ts (unknown - needs verification)

**Fix Required**:
```typescript
// For PHI models - HIPAA/FERPA compliance requires retention
@Table({
  tableName: 'table_name',
  timestamps: true,
  paranoid: true, // Enable soft deletes for compliance
  underscored: false,
})

// For non-PHI models - be explicit
@Table({
  tableName: 'table_name',
  timestamps: true,
  paranoid: false, // Hard deletes allowed for non-PHI
  underscored: false,
})
```

**Compliance Impact**:
- HIPAA requires minimum 6-7 years retention for health records
- FERPA requires 3-5 years retention for educational records
- Hard deletes violate audit trail requirements
- Potential legal/regulatory violations

---

### 3. Inconsistent `timestamps` Configuration
**Severity**: IMPORTANT
**Impact**: Audit trail gaps, debugging difficulties

**Problem**: While most models set `timestamps: true`, some use inconsistent patterns

**Special Cases Found**:
- audit-log.model.ts: Sets `updatedAt: false` (line 81) - **CORRECT** for immutable audit logs
- Most others: Use default `timestamps: true`

**Issue**: No explicit `timestamps` in some models, relying on decorator-level configuration

**Fix Required**:
```typescript
// Standard pattern for mutable data
@Table({
  tableName: 'table_name',
  timestamps: true, // ← Always explicit
  underscored: false,
})

// For immutable audit logs only
@Table({
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false, // Audit logs never update
  underscored: false,
})
```

---

## IMPORTANT ISSUES

### 4. Mixed Decorator vs. Table Options for Columns
**Severity**: IMPORTANT
**Impact**: Maintainability, readability inconsistencies

**Problem**: Inconsistent patterns for defining `createdAt` and `updatedAt`

**Pattern 1** (Preferred - using decorators):
```typescript
@Column({
  type: DataType.DATE,
  allowNull: false,
  defaultValue: DataType.NOW,
})
declare createdAt: Date;
```
Examples: school.model.ts, district.model.ts, health-record.model.ts

**Pattern 2** (Minimal - relying on sequelize-typescript):
```typescript
@Column(DataType.DATE)
declare createdAt: Date;
```
Examples: allergy.model.ts, inventory-item.model.ts, medication.model.ts

**Pattern 3** (No explicit column decorator):
```typescript
declare createdAt?: Date;
```
Examples: student.model.ts (lines 236-242), appointment.model.ts (lines 188-196)

**Recommendation**: Use **Pattern 1** consistently across ALL models for explicitness:
```typescript
@Column({
  type: DataType.DATE,
  allowNull: false,
  defaultValue: DataType.NOW,
  comment: 'Record creation timestamp',
})
declare createdAt: Date;

@Column({
  type: DataType.DATE,
  allowNull: false,
  defaultValue: DataType.NOW,
  comment: 'Record last update timestamp',
})
declare updatedAt: Date;
```

---

### 5. Inconsistent Primary Key Configuration
**Severity**: IMPORTANT
**Impact**: Type safety, autocompletion issues

**Problem**: Three different patterns for UUID primary keys

**Pattern 1** (Most common):
```typescript
@PrimaryKey
@Default(DataType.UUIDV4)
@Column(DataType.UUID)
declare id: string;
```
Examples: student.model.ts, health-record.model.ts, allergy.model.ts

**Pattern 2** (With allowNull):
```typescript
@PrimaryKey
@Default(DataType.UUIDV4)
@Column({
  type: DataType.UUID,
  allowNull: false
})
declare id: string;
```
Examples: user.model.ts (lines 54-60)

**Pattern 3** (Using arrow function):
```typescript
@PrimaryKey
@Default(() => uuidv4())
@Column(DataType.UUID)
declare id: string;
```
Examples: vaccination.model.ts, clinic-visit.model.ts, medication.model.ts

**Pattern 4** (Optional - incorrect for PK):
```typescript
@PrimaryKey
@Default(DataType.UUIDV4)
@Column(DataType.UUID)
declare id?: string; // ← id should NEVER be optional!
```
Examples: school.model.ts (line 79), district.model.ts (line 72), consent-form.model.ts (line 53)

**Issues**:
- Pattern 3 imports `uuid` unnecessarily when DataType.UUIDV4 exists
- Pattern 4 makes primary key optional, breaking type safety
- `allowNull: false` is redundant for `@PrimaryKey` (PKs are always NOT NULL)

**Recommended Pattern**:
```typescript
@PrimaryKey
@Default(DataType.UUIDV4)
@Column(DataType.UUID)
declare id: string; // NOT optional!
```

**Fix for cache-entry.model.ts** (uses integer autoincrement - correct pattern):
```typescript
@PrimaryKey
@AutoIncrement
@Column(DataType.INTEGER)
declare id: number;
```

---

### 6. Missing `allowNull` Specification on Nullable Columns
**Severity**: IMPORTANT
**Impact**: Database schema mismatch, validation errors

**Problem**: Inconsistent handling of nullable columns

**Good Examples** (explicit nullable):
```typescript
// school.model.ts
@AllowNull(true)
@Column({
  type: DataType.TEXT,
  allowNull: true, // ← Redundant but clear
  comment: 'Physical address of the school',
})
address?: string;
```

**Inconsistent Examples**:
```typescript
// allergy.model.ts - uses decorator
@AllowNull
@Column({
  type: DataType.TEXT
})
emergencyProtocol?: string;

// medication.model.ts - uses column option only
@Column(DataType.STRING)
genericName?: string;
```

**Recommendation**: Use **column option only**, remove redundant decorator:
```typescript
@Column({
  type: DataType.STRING(200),
  allowNull: true, // ← Explicit in column config
  comment: 'Optional field description',
})
optionalField?: string;

// For required fields (most common pattern)
@Column({
  type: DataType.STRING(200),
  allowNull: false, // ← Explicit even when required
})
requiredField: string; // No ? in TypeScript
```

---

### 7. Inconsistent Foreign Key Patterns
**Severity**: IMPORTANT
**Impact**: Circular dependency issues, type safety problems

**Problem**: Mixed approaches for defining foreign keys and associations

**Pattern 1** (Lazy loading with require - used in most models):
```typescript
@ForeignKey(() => require('./user.model').User)
@Column({
  type: DataType.UUID,
  allowNull: false,
})
userId: string;

@BelongsTo(() => require('./user.model').User, { foreignKey: 'userId', as: 'user' })
declare user?: any; // ← Type is 'any' - loses type safety
```
Examples: student.model.ts, appointment.model.ts, health-record.model.ts

**Pattern 2** (Direct import - causes circular deps):
```typescript
import { Conversation } from './conversation.model';

@ForeignKey(() => Conversation)
@Column({
  type: DataType.UUID,
  allowNull: false,
})
conversationId: string;

@BelongsTo(() => Conversation, { foreignKey: 'conversationId', as: 'conversation' })
declare conversation?: Conversation; // ← Proper typing
```
Example: conversation-participant.model.ts (line 13, 92, 170)

**Issues**:
- Pattern 1 avoids circular deps but loses TypeScript type safety
- Pattern 2 has proper types but may cause circular dependency errors
- No consistent approach across codebase

**Recommendation**:
1. Use Pattern 1 (require) for circular dependency prevention
2. Create proper type definitions separately
3. Use type-only imports where possible

```typescript
// At top of file
import type { User } from './user.model';

// In class
@ForeignKey(() => require('./user.model').User)
@Column({
  type: DataType.UUID,
  allowNull: false,
})
userId: string;

@BelongsTo(() => require('./user.model').User, { foreignKey: 'userId', as: 'user' })
declare user?: User; // ← Proper type from type-only import
```

---

### 8. Missing Index Strategy Documentation
**Severity**: IMPORTANT
**Impact**: Query performance, unclear optimization strategy

**Problem**: Indexes defined inconsistently with unclear rationale

**Examples of Good Practice**:
```typescript
// audit-log.model.ts (lines 83-111)
@Table({
  indexes: [
    // Single-column indexes for common filters
    { fields: ['userId'] },
    { fields: ['entityType'] },

    // Composite indexes for common query patterns
    { fields: ['entityType', 'entityId', 'createdAt'] },
    { fields: ['userId', 'createdAt'] },

    // GIN index for JSONB (PostgreSQL specific)
    { fields: ['tags'], using: 'gin' },
    { fields: ['metadata'], using: 'gin' },
  ]
})
```

**Examples of Unclear Indexing**:
```typescript
// student.model.ts (lines 52-78)
indexes: [
  { fields: ['studentNumber'], unique: true },
  { fields: ['nurseId'] },
  { fields: ['isActive'] },
  { fields: ['grade'] },
  { fields: ['lastName', 'firstName'] },
  {
    fields: ['medicalRecordNum'],
    unique: true,
    where: { medicalRecordNum: { [Op.ne]: null } } // ← Good: partial index
  },
]
```

**Issues**:
- Some models have extensive indexes (audit-log: 10+ indexes)
- Other models have minimal indexing (medication.model.ts: only name, ndc)
- No comments explaining WHY indexes were chosen
- Potential over-indexing on some tables

**Recommendation**: Document index rationale
```typescript
@Table({
  indexes: [
    {
      name: 'idx_student_number',
      fields: ['studentNumber'],
      unique: true,
      comment: 'Enforce unique student ID per school'
    },
    {
      name: 'idx_student_search',
      fields: ['lastName', 'firstName'],
      comment: 'Support student name search queries'
    },
    {
      name: 'idx_active_students',
      fields: ['isActive', 'schoolId'],
      comment: 'Support common active student listing by school'
    },
  ]
})
```

---

## SUGGESTIONS FOR IMPROVEMENT

### 9. Inconsistent ENUM Definition Patterns
**Severity**: SUGGESTION
**Impact**: Code maintainability

**Current Patterns**:

**Pattern 1** (Inline enum values):
```typescript
@Column({
  type: DataType.ENUM(...(Object.values(UserRole) as string[])),
  allowNull: false,
  defaultValue: UserRole.NURSE
})
declare role: UserRole;
```

**Pattern 2** (Hardcoded string literals):
```typescript
@Column({
  type: DataType.ENUM('I', 'II', 'III', 'IV', 'V'),
})
deaSchedule?: 'I' | 'II' | 'III' | 'IV' | 'V';
```
Example: medication.model.ts (line 91)

**Pattern 3** (Long inline enum - readability issue):
```typescript
@Column({
  type: DataType.ENUM(
    'CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING',
    'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING',
    'EXAMINATION', 'ALLERGY_DOCUMENTATION', 'CHRONIC_CONDITION_REVIEW',
    // ... 10+ more values
    'OTHER'
  ),
  allowNull: false,
})
recordType: string;
```
Example: health-record.model.ts (lines 72-105)

**Recommendation**:
- Use Pattern 1 for type safety
- Extract large enums to separate enum definitions
- Avoid Pattern 2 (loses type checking benefits)

```typescript
// Good: Separate enum definition
export enum HealthRecordType {
  CHECKUP = 'CHECKUP',
  VACCINATION = 'VACCINATION',
  ILLNESS = 'ILLNESS',
  // ... rest of values
  OTHER = 'OTHER'
}

// In model
@Column({
  type: DataType.ENUM(...(Object.values(HealthRecordType) as string[])),
  allowNull: false,
})
recordType: HealthRecordType; // Strong typing
```

---

### 10. Missing Default Values on Required Fields
**Severity**: SUGGESTION
**Impact**: Creation errors, unexpected nulls

**Examples of Good Defaults**:
```typescript
@Column({
  type: DataType.BOOLEAN,
  allowNull: false,
  defaultValue: false
})
isActive: boolean;

@Column({
  type: DataType.INTEGER,
  allowNull: false,
  defaultValue: 0
})
failedLoginAttempts: number;

@Column({
  type: DataType.ARRAY(DataType.STRING),
  allowNull: false,
  defaultValue: []
})
attachments: string[];
```

**Missing Defaults** (examples):
- appointment.model.ts: `duration` has default but validation might fail
- Many string fields lack default empty string where appropriate
- Boolean fields sometimes lack explicit `false` default

**Recommendation**: Add defaults for all non-nullable fields
```typescript
@Column({
  type: DataType.BOOLEAN,
  allowNull: false,
  defaultValue: true, // ← Always provide default for non-null booleans
})
isActive: boolean;

@Column({
  type: DataType.STRING(500),
  allowNull: false,
  defaultValue: '', // ← Consider for strings if empty is valid
})
description: string;
```

---

### 11. Lack of Field-Level Comments
**Severity**: SUGGESTION
**Impact**: Maintainability, onboarding difficulty

**Good Examples**:
```typescript
// cache-entry.model.ts
@Column({
  type: DataType.STRING(500),
  allowNull: false,
  unique: true,
  comment: 'Unique cache key identifier',
})
cacheKey!: string;

// audit-log.model.ts
@Column({
  type: DataType.UUID,
  allowNull: true,
  comment: 'ID of the entity affected (null for bulk operations)'
})
entityId: string | null;
```

**Missing Comments**: Most models lack column-level comments

**Recommendation**: Add comments for:
- Business logic constraints
- PHI indicators
- Null handling rationale
- Enum meanings
- Foreign key relationships

```typescript
@Column({
  type: DataType.STRING(50),
  allowNull: true,
  unique: true,
  comment: 'Medical record number - PHI - unique identifier for healthcare'
})
medicalRecordNum?: string;
```

---

### 12. Inconsistent Use of `declare` Keyword
**Severity**: SUGGESTION
**Impact**: TypeScript type inference

**Current Usage**:
- Some fields use `declare` keyword (user.model.ts)
- Others don't use `declare` (student.model.ts)
- Mixture within same model

**Recommendation**: Use `declare` for fields that Sequelize manages:
```typescript
// Sequelize-managed fields (auto-populated)
declare id: string;
declare createdAt: Date;
declare updatedAt: Date;

// Relationships (loaded via associations)
declare user?: User;
declare student?: Student;

// Regular fields (set by application)
studentNumber: string;
firstName: string;
isActive: boolean;
```

---

### 13. Missing Model-Level Validation
**Severity**: SUGGESTION
**Impact**: Data integrity

**Current State**:
- Field-level validations exist (e.g., email validation in user.model.ts)
- No model-level cross-field validations

**Example of Field Validation**:
```typescript
@Column({
  type: DataType.STRING,
  allowNull: false,
  unique: true,
  validate: { isEmail: true } // ← Good
})
declare email: string;
```

**Missing**: Cross-field validations
```typescript
@Column({
  type: DataType.INTEGER,
  allowNull: false,
  defaultValue: 30,
  validate: {
    min: 15,
    max: 120
  },
})
duration: number;
```

**Recommendation**: Add model-level validations
```typescript
@Table({
  tableName: 'appointments',
  timestamps: true,
  underscored: false,
  validate: {
    checkoutAfterCheckin() {
      if (this.checkOutTime && this.checkInTime) {
        if (this.checkOutTime < this.checkInTime) {
          throw new Error('Check-out time must be after check-in time');
        }
      }
    },
    futureFollowUpDate() {
      if (this.followUpRequired && this.followUpDate) {
        if (this.followUpDate < new Date()) {
          throw new Error('Follow-up date must be in the future');
        }
      }
    }
  }
})
```

---

## SPECIFIC FILE ISSUES

### user.model.ts
**Line 51**: `underscored: false` - GOOD (explicit)
**Line 54-60**: Primary key with `allowNull: false` - redundant but harmless
**Line 89**: ENUM pattern - GOOD (uses Object.values)
**Line 202-217**: BeforeCreate/BeforeUpdate hooks - EXCELLENT pattern
**Issue**: No paranoid setting - consider for user audit trail

### student.model.ts
**Line 51**: `paranoid: false` - **CONCERNING** for PHI data
**Lines 52-78**: Comprehensive indexing - GOOD
**Lines 190, 200, 210**: Lazy-loaded foreign keys with require() - GOOD for circular deps
**Lines 236-242**: Timestamps without explicit column config - INCONSISTENT
**Issue**: Should enable `paranoid: true` for HIPAA compliance

### school.model.ts
**Line 68**: `underscored: false` - GOOD (explicit)
**Line 79**: `declare id?: string;` - **BUG**: Primary key should NOT be optional
**Lines 82-84**: Redundant `@AllowNull(false)` decorator and column option
**Issue**: Overuse of AllowNull decorator (use column option only)

### district.model.ts
**Similar issues to school.model.ts**
**Line 72**: Optional primary key - **BUG**

### appointment.model.ts
**Lines 97-103**: Property aliasing (appointmentType) - CREATIVE but non-standard
**Line 125-134**: Validation with min/max - GOOD
**Issue**: No paranoid setting for healthcare data

### message.model.ts
**Line 68**: `paranoid: true` - EXCELLENT for messaging
**Lines 59-63**: MessageCreationAttributes with Optional<> - GOOD TypeScript pattern
**Line 240**: @DeletedAt decorator - GOOD (paired with paranoid)
**Issue**: None - well-implemented model

### conversation.model.ts
**Lines 68-73**: paranoid + underscored + timestamps - EXCELLENT configuration
**Line 13**: Direct import of ConversationParticipant - May cause circular dependency
**Issue**: Verify no circular dependency issues

### health-record.model.ts
**Line 42**: No paranoid setting - **CRITICAL** for PHI
**Lines 72-102**: Hardcoded inline ENUM with 20+ values - Consider extracting
**Line 60**: Uses arrow function for UUID default - unnecessary (use DataType.UUIDV4)

### allergy.model.ts
**Line 59**: No paranoid setting - **IMPORTANT** for medical data
**Line 74**: Arrow function for UUID - unnecessary
**Lines 91, 147, etc.**: Inconsistent use of @Default decorator and defaultValue

### vaccination.model.ts
**Line 131**: `paranoid: true` - EXCELLENT for immunization records
**Lines 85-526**: Very comprehensive model with good documentation - EXEMPLARY
**Line 149**: Arrow function for UUID - unnecessary but harmless

### audit-log.model.ts
**Line 81**: `updatedAt: false` - CORRECT for immutable audit logs
**Lines 83-111**: Extensive index strategy with comments - EXCELLENT
**Line 276**: @BeforeCreate hook preventing modifications - GOOD
**Issue**: None - exemplary audit logging model

### medication.model.ts
**Line 91**: Hardcoded ENUM values - Consider extracting
**Line 103-107**: Manual deletedAt field without paranoid - INCONSISTENT
**Issue**: Should use paranoid: true instead of manual deletedAt

### clinic-visit.model.ts
**Line 12**: External enum import (VisitDisposition) - GOOD pattern
**Lines 136-150**: Instance methods for business logic - EXCELLENT
**Issue**: No paranoid setting for clinical data

### inventory-item.model.ts
**Line 58**: Arrow function UUID generation - unnecessary
**Lines 120-127**: HasMany associations using require() - GOOD

### consent-form.model.ts
**Line 53**: Optional primary key - **BUG**
**Line 84**: `declare version: string` with defaultValue - may cause type issues

### cache-entry.model.ts
**Line 86**: Integer primary key with @AutoIncrement - CORRECT pattern
**Lines 54-81**: Named indexes with comments - EXCELLENT
**Lines 177-228**: Business logic methods - GOOD encapsulation
**Issue**: None - well-implemented cache model

---

## DATABASE MODULE ANALYSIS

### database.module.ts

**Lines 189-193**: Global define options - GOOD
```typescript
define: {
  timestamps: true,
  underscored: false, // ← Sets default but models should be explicit
  freezeTableName: true,
},
```

**Issue**: `freezeTableName: true` prevents pluralization but models should still specify tableName explicitly

**Lines 168-230**: Configuration factory - GOOD (handles both DATABASE_URL and individual params)

**Lines 231-350**: All models registered in SequelizeModule.forFeature - COMPREHENSIVE

**Recommendation**: Document that models MUST override underscored explicitly

---

## RECOMMENDED STANDARDIZATION

### Standard Model Template

```typescript
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
  ForeignKey,
  BelongsTo,
  HasMany,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';

// Type-only imports for relationships
import type { RelatedModel } from './related.model';

/**
 * Enum definitions
 */
export enum MyEnum {
  VALUE_ONE = 'VALUE_ONE',
  VALUE_TWO = 'VALUE_TWO',
}

/**
 * Attributes interface
 */
export interface MyModelAttributes {
  id: string;
  requiredField: string;
  optionalField?: string;
  enumField: MyEnum;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Only if paranoid: true
}

/**
 * Model documentation with business logic explanation
 */
@Table({
  tableName: 'my_models',
  timestamps: true,
  underscored: false, // ← ALWAYS explicit
  paranoid: true, // ← ALWAYS explicit (true for PHI, false otherwise)
  indexes: [
    {
      name: 'idx_my_model_field',
      fields: ['field'],
      comment: 'Reason for this index',
    },
  ],
})
export class MyModel extends Model<MyModelAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4) // NOT arrow function
  @Column(DataType.UUID)
  declare id: string; // NOT optional

  @Column({
    type: DataType.STRING(200),
    allowNull: false, // ← Explicit
    comment: 'Field description and business rules',
  })
  requiredField: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true, // ← Explicit even for nullable
    comment: 'Optional field description',
  })
  optionalField?: string;

  @Column({
    type: DataType.ENUM(...(Object.values(MyEnum) as string[])),
    allowNull: false,
    defaultValue: MyEnum.VALUE_ONE,
  })
  enumField: MyEnum;

  @Index
  @ForeignKey(() => require('./related.model').RelatedModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  relatedId: string;

  @BelongsTo(() => require('./related.model').RelatedModel, {
    foreignKey: 'relatedId',
    as: 'related',
  })
  declare related?: RelatedModel; // Type from type-only import

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Record creation timestamp',
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'Record last update timestamp',
  })
  declare updatedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Soft delete timestamp',
  })
  declare deletedAt?: Date;

  // Hooks
  @BeforeCreate
  static async beforeCreateHook(instance: MyModel) {
    // Pre-create logic
  }

  @BeforeUpdate
  static async beforeUpdateHook(instance: MyModel) {
    // Pre-update logic
  }

  // Instance methods
  isActive(): boolean {
    return !this.deletedAt;
  }
}
```

---

## PRIORITY FIX CHECKLIST

### Immediate (CRITICAL)
- [ ] Add explicit `underscored: false` to all 65+ models without it
- [ ] Add explicit `paranoid: true` to ALL PHI models (student, health-record, allergy, clinic-visit, etc.)
- [ ] Fix optional primary keys in school.model.ts, district.model.ts, consent-form.model.ts
- [ ] Review and fix medication.model.ts manual deletedAt (use paranoid instead)

### High Priority (IMPORTANT)
- [ ] Standardize createdAt/updatedAt column definitions across all models
- [ ] Remove redundant `allowNull: false` from @PrimaryKey columns
- [ ] Standardize foreign key typing (use type-only imports)
- [ ] Document index rationale for all models
- [ ] Fix UUID generation (use DataType.UUIDV4 instead of arrow functions)

### Medium Priority (SUGGESTIONS)
- [ ] Add field-level comments to all columns
- [ ] Extract large inline ENUMs to separate definitions
- [ ] Add model-level cross-field validations
- [ ] Standardize `declare` keyword usage
- [ ] Add default values to all non-nullable fields
- [ ] Create model template and add to CONTRIBUTING.md

---

## COMPLIANCE NOTES

### HIPAA Protected Health Information (PHI) Models
These models MUST have `paranoid: true`:
- student.model.ts (**currently false - CRITICAL**)
- health-record.model.ts (**missing - CRITICAL**)
- allergy.model.ts (**missing - CRITICAL**)
- clinic-visit.model.ts (**missing - IMPORTANT**)
- vaccination.model.ts (CORRECT - has paranoid: true)
- mental-health-record.model.ts (needs verification)
- vital-signs.model.ts (needs verification)
- medical-history.model.ts (needs verification)
- immunization.model.ts (needs verification)
- lab-results.model.ts (needs verification)
- prescription.model.ts (needs verification)

### Audit Requirements
- audit-log.model.ts: Correctly implements immutable audit trail
- All PHI access should be logged (implement in services layer)
- Soft deletes (paranoid) required for audit trail compliance

---

## TESTING RECOMMENDATIONS

1. **Migration Testing**: Verify `underscored: false` matches actual database schema
2. **Type Safety**: Ensure no `any` types leak through lazy-loaded associations
3. **Soft Delete**: Test paranoid behavior on all PHI models
4. **Index Performance**: Analyze query execution plans for over/under-indexing
5. **Validation**: Test model-level validations with invalid data

---

## CONCLUSION

The codebase shows good Sequelize usage overall but lacks consistency in critical configuration areas. The most pressing issues are:

1. **Inconsistent `underscored` configuration** across 95 models
2. **Missing `paranoid: true`** on PHI models (HIPAA compliance risk)
3. **Optional primary keys** in several models (type safety issue)
4. **Mixed patterns** for timestamps, foreign keys, and defaults

**Estimated Remediation Time**: 8-12 hours for critical fixes, 20-30 hours for complete standardization.

**Risk Level**: **HIGH** - HIPAA compliance violations possible with current PHI soft-delete configuration.
