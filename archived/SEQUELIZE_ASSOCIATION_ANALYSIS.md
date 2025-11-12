# Sequelize Association Pattern Analysis Report

**Date:** 2025-10-30
**Analyzed Models:** 95+ model files in `backend/src/database/models/`
**Reference:** [Sequelize v6 Associations Documentation](https://sequelize.org/api/v6/identifiers)

---

## Executive Summary

This analysis identifies **critical association pattern issues** across the White Cross backend models that could lead to:
- Runtime errors due to missing inverse associations
- Circular dependency issues preventing proper model initialization
- Inconsistent foreign key naming and aliasing
- Missing cascade behaviors and constraints
- Type safety violations

**Severity Levels:**
- 🔴 **CRITICAL**: Will cause runtime errors or data integrity issues
- 🟡 **WARNING**: Potential issues, inconsistencies, or bad practices
- 🔵 **INFO**: Recommendations for improvement

---

## 1. CRITICAL ISSUES

### 1.1 Missing Inverse Associations (🔴 CRITICAL)

**Problem:** Many models define one-sided associations without the corresponding inverse, violating Sequelize best practices and potentially causing issues with eager loading, cascades, and referential integrity.

#### User Model (`user.model.ts`)
**Issues:**
- ❌ Has `schoolId` and `districtId` foreign keys but **NO** `@BelongsTo` associations
- ❌ Missing all inverse `@HasMany` associations for related models
- ❌ `nurseId`, `reportedById`, `createdBy`, etc. in other models reference User but User has no corresponding associations

**Impact:** Cannot eager load user's school/district, cannot query users by school, cascade deletes won't work

**Recommendation:**
```typescript
// Add to User model:
@BelongsTo(() => School, { foreignKey: 'schoolId', as: 'school' })
declare school?: School;

@BelongsTo(() => District, { foreignKey: 'districtId', as: 'district' })
declare district?: District;

@HasMany(() => Student, { foreignKey: 'nurseId', as: 'assignedStudents' })
declare assignedStudents?: Student[];

@HasMany(() => Appointment, { foreignKey: 'nurseId', as: 'appointments' })
declare appointments?: Appointment[];

@HasMany(() => Alert, { foreignKey: 'userId', as: 'alerts' })
declare alerts?: Alert[];

@HasMany(() => Alert, { foreignKey: 'createdBy', as: 'createdAlerts' })
declare createdAlerts?: Alert[];

@HasMany(() => Alert, { foreignKey: 'acknowledgedBy', as: 'acknowledgedAlerts' })
declare acknowledgedAlerts?: Alert[];

@HasMany(() => Alert, { foreignKey: 'resolvedBy', as: 'resolvedAlerts' })
declare resolvedAlerts?: Alert[];

@HasMany(() => Message, { foreignKey: 'senderId', as: 'sentMessages' })
declare sentMessages?: Message[];

@HasMany(() => Conversation, { foreignKey: 'createdById', as: 'createdConversations' })
declare createdConversations?: Conversation[];
```

#### School Model (`school.model.ts`)
**Issues:**
- ✅ Has `@BelongsTo(() => District)` correctly
- ❌ Missing `@HasMany(() => Student)` inverse for students
- ❌ Missing `@HasMany(() => User)` inverse for school staff
- ❌ Missing `@HasMany(() => Alert)` inverse for school alerts

**Recommendation:**
```typescript
// Add to School model:
@HasMany(() => Student, { foreignKey: 'schoolId', as: 'students' })
declare students?: Student[];

@HasMany(() => User, { foreignKey: 'schoolId', as: 'staff' })
declare staff?: User[];

@HasMany(() => Alert, { foreignKey: 'schoolId', as: 'alerts' })
declare alerts?: Alert[];
```

#### District Model (`district.model.ts`)
**Issues:**
- ✅ Has `@HasMany(() => School)` correctly
- ✅ Has `@HasMany(() => License)` correctly
- ❌ Missing `@HasMany(() => Student)` inverse for district students
- ❌ Missing `@HasMany(() => User)` inverse for district staff

**Recommendation:**
```typescript
// Add to District model:
@HasMany(() => Student, { foreignKey: 'districtId', as: 'students' })
declare students?: Student[];

@HasMany(() => User, { foreignKey: 'districtId', as: 'staff' })
declare staff?: User[];
```

#### Student Model (`student.model.ts`)
**Issues:**
- ✅ Has `@BelongsTo` for nurse, school, district
- ✅ Has `@HasMany` for healthRecords, academicTranscripts, mentalHealthRecords
- ❌ Missing `@HasMany(() => Appointment)` - appointments reference studentId
- ❌ Missing `@HasMany(() => Allergy)` - commented out but needed
- ❌ Missing `@HasMany(() => Vaccination)` - commented out but needed
- ❌ Missing `@HasMany(() => Prescription)` - prescriptions reference studentId
- ❌ Missing `@HasMany(() => IncidentReport)` - incident reports reference studentId
- ❌ Missing `@HasMany(() => Alert)` - alerts reference studentId

**Recommendation:**
```typescript
// Add to Student model:
@HasMany(() => Appointment, { foreignKey: 'studentId', as: 'appointments' })
declare appointments?: Appointment[];

@HasMany(() => Allergy, { foreignKey: 'studentId', as: 'allergies' })
declare allergies?: Allergy[];

@HasMany(() => Vaccination, { foreignKey: 'studentId', as: 'vaccinations' })
declare vaccinations?: Vaccination[];

@HasMany(() => Prescription, { foreignKey: 'studentId', as: 'prescriptions' })
declare prescriptions?: Prescription[];

@HasMany(() => IncidentReport, { foreignKey: 'studentId', as: 'incidentReports' })
declare incidentReports?: IncidentReport[];

@HasMany(() => Alert, { foreignKey: 'studentId', as: 'alerts' })
declare alerts?: Alert[];
```

#### Appointment Model (`appointment.model.ts`)
**Issues:**
- ⚠️ Has `@ForeignKey` and `@BelongsTo` for nurse and student but uses `@Index` before `@Column` which is incorrect order
- ⚠️ `studentId` has `@ForeignKey` missing from decorator chain
- ✅ Has `@HasMany(() => AppointmentReminder)` correctly

**Recommendation:**
```typescript
// Fix foreign key decorators:
@ForeignKey(() => require('./student.model').Student)
@Index
@Column({
  type: DataType.UUID,
  allowNull: false,
  comment: 'Foreign key to students table - appointment patient'
})
studentId: string;
```

#### Conversation Model (`conversation.model.ts`)
**Issues:**
- ✅ Has `@HasMany(() => ConversationParticipant)` correctly
- ❌ Missing `@HasMany(() => Message)` - messages reference conversationId
- ❌ `createdById` is not a `@ForeignKey` and has no association

**Recommendation:**
```typescript
// Add to Conversation model:
@ForeignKey(() => require('./user.model').User)
@Column({
  type: DataType.UUID,
  allowNull: false,
  comment: 'User who created the conversation',
})
declare createdById: string;

@BelongsTo(() => require('./user.model').User, { foreignKey: 'createdById', as: 'creator' })
declare creator?: any;

@HasMany(() => require('./message.model').Message, { foreignKey: 'conversationId', as: 'messages' })
declare messages?: any[];
```

#### Message Model (`message.model.ts`)
**Issues:**
- ✅ Has `@BelongsTo(() => User)` for sender correctly
- ❌ Missing `@BelongsTo(() => Conversation)` - messages have conversationId
- ❌ Missing `@HasMany(() => MessageDelivery)` - deliveries reference messageId
- ❌ `templateId`, `parentId`, `threadId` have no associations defined

**Recommendation:**
```typescript
// Add to Message model:
@ForeignKey(() => require('./conversation.model').Conversation)
@Index
@Column({
  type: DataType.UUID,
  allowNull: true,
  comment: 'Conversation this message belongs to (for chat messages)',
})
declare conversationId?: string;

@BelongsTo(() => require('./conversation.model').Conversation, { foreignKey: 'conversationId', as: 'conversation' })
declare conversation?: any;

@HasMany(() => require('./message-delivery.model').MessageDelivery, { foreignKey: 'messageId', as: 'deliveries' })
declare deliveries?: any[];

@BelongsTo(() => require('./message-template.model').MessageTemplate, { foreignKey: 'templateId', as: 'template' })
declare template?: any;

@BelongsTo(() => Message, { foreignKey: 'parentId', as: 'parent' })
declare parent?: Message;

@HasMany(() => Message, { foreignKey: 'parentId', as: 'replies' })
declare replies?: Message[];
```

#### Prescription Model (`prescription.model.ts`)
**Issues:**
- ✅ Has `@BelongsTo` for visitId and treatmentPlanId
- ❌ Missing `@BelongsTo(() => Student)` - has studentId but no association
- ❌ `prescribedBy` is not a `@ForeignKey` and should reference User

**Recommendation:**
```typescript
// Add to Prescription model:
@ForeignKey(() => require('./student.model').Student)
@Column({
  type: DataType.UUID,
  allowNull: false
})
@Index
studentId: string;

@BelongsTo(() => require('./student.model').Student, { foreignKey: 'studentId', as: 'student' })
declare student?: any;

@ForeignKey(() => require('./user.model').User)
@Column({
  type: DataType.UUID,
  allowNull: false
})
prescribedBy: string;

@BelongsTo(() => require('./user.model').User, { foreignKey: 'prescribedBy', as: 'prescriber' })
declare prescriber?: any;
```

#### InventoryItem Model (`inventory-item.model.ts`)
**Issues:**
- ✅ Has `@HasMany` for transactions, maintenanceLogs, purchaseOrderItems
- ❌ `supplier` field is a string, should be `supplierId` foreign key

**Recommendation:**
```typescript
// Change supplier to foreign key:
@ForeignKey(() => require('./supplier.model').Supplier)
@Column(DataType.UUID)
supplierId?: string;

@BelongsTo(() => require('./supplier.model').Supplier, { foreignKey: 'supplierId', as: 'supplier' })
declare supplier?: any;
```

### 1.2 Incorrect ForeignKey Usage (🔴 CRITICAL)

#### Issue: Foreign Keys Without Associations
Many models define `@ForeignKey` decorators but don't define the corresponding `@BelongsTo` association.

**Example - ConversationParticipant:**
```typescript
// ❌ INCORRECT - has ForeignKey but missing User association
@Index
@Column({
  type: DataType.UUID,
  allowNull: false,
  comment: 'User ID who is a participant',
})
declare userId: string;
```

**Fix:**
```typescript
// ✅ CORRECT
@ForeignKey(() => require('./user.model').User)
@Index
@Column({
  type: DataType.UUID,
  allowNull: false,
  comment: 'User ID who is a participant',
})
declare userId: string;

@BelongsTo(() => require('./user.model').User, { foreignKey: 'userId', as: 'user' })
declare user?: any;
```

---

## 2. WARNING ISSUES

### 2.1 Inconsistent Alias Naming (🟡 WARNING)

**Problem:** Alias naming conventions are inconsistent across models, making code harder to understand and maintain.

**Examples:**
- ✅ Good: `{ as: 'student' }`, `{ as: 'nurse' }`, `{ as: 'school' }`
- ⚠️ Inconsistent: Alert model has `creator`, `acknowledger`, `resolver` but should consider standardizing to `createdByUser`, `acknowledgedByUser`, `resolvedByUser`

**Recommendation:** Establish and enforce naming conventions:
- `belongsTo`: Use singular noun matching the relationship (`student`, `school`, `district`)
- `hasMany`: Use plural noun (`students`, `appointments`, `alerts`)
- Multiple associations to same model: Use descriptive names (`createdByUser`, `assignedNurse`, `sentMessages`)

### 2.2 Missing Cascade Behaviors (🟡 WARNING)

**Problem:** No cascade delete or update behaviors are defined, which could lead to orphaned records or referential integrity issues.

**Impact:**
- Deleting a student doesn't cascade to health records, appointments, etc.
- Deleting a district doesn't cascade to schools or students
- Foreign key constraints may prevent deletion

**Recommendation:**
```typescript
// Example with cascade:
@BelongsTo(() => Student, {
  foreignKey: 'studentId',
  as: 'student',
  onDelete: 'CASCADE', // Delete health records when student is deleted
  onUpdate: 'CASCADE'  // Update references when student ID changes
})
declare student?: Student;

@HasMany(() => HealthRecord, {
  foreignKey: 'studentId',
  as: 'healthRecords',
  onDelete: 'CASCADE'
})
declare healthRecords?: HealthRecord[];
```

**Suggested Cascade Strategy:**
- Student deletion → CASCADE to health records, appointments, prescriptions
- School deletion → SET NULL for students (don't delete students)
- District deletion → RESTRICT (don't allow if schools exist)
- User deletion → SET NULL for created records (preserve audit trail)

### 2.3 Missing Association Hooks (🟡 WARNING)

**Problem:** No association-specific hooks or scopes defined.

**Use Cases:**
- Auto-increment/decrement counters
- Maintain denormalized data
- Audit logging
- Complex validation

**Recommendation:**
```typescript
@HasMany(() => Student, {
  foreignKey: 'schoolId',
  as: 'students',
  hooks: true,
  onDelete: 'SET NULL'
})
declare students?: Student[];

// Add hook in model
static associate(models: any) {
  // After student is added to school, increment enrollment count
  Student.addHook('afterCreate', async (student, options) => {
    if (student.schoolId) {
      await models.School.increment('totalEnrollment', {
        where: { id: student.schoolId }
      });
    }
  });
}
```

### 2.4 Type Safety Issues (🟡 WARNING)

**Problem:** Many associations use `any` type instead of proper model types.

**Examples:**
```typescript
// ❌ INCORRECT
declare student?: any;
declare nurse?: any;

// ✅ CORRECT
declare student?: Student;
declare nurse?: User;
```

**Impact:** Loss of TypeScript type safety benefits, no IntelliSense support, potential runtime errors.

**Recommendation:** Import model types and use proper typing:
```typescript
import { Student } from './student.model';
import { User } from './user.model';

@BelongsTo(() => Student, { foreignKey: 'studentId', as: 'student' })
declare student?: Student;

@BelongsTo(() => User, { foreignKey: 'nurseId', as: 'nurse' })
declare nurse?: User;
```

**Note:** If circular dependencies prevent direct imports, use conditional types:
```typescript
declare student?: typeof import('./student.model').Student;
```

---

## 3. INFO/RECOMMENDATIONS

### 3.1 Association Scopes (🔵 INFO)

**Recommendation:** Add scopes to filter associations by default.

```typescript
@HasMany(() => Student, {
  foreignKey: 'schoolId',
  as: 'students',
  scope: {
    isActive: true  // Only load active students by default
  }
})
declare students?: Student[];

@HasMany(() => Student, {
  foreignKey: 'schoolId',
  as: 'allStudents'  // Load all students including inactive
})
declare allStudents?: Student[];
```

### 3.2 Through Tables for Many-to-Many (🔵 INFO)

**Observation:** No `@BelongsToMany` associations detected. If there are implicit many-to-many relationships, they should be explicit.

**Example Use Cases:**
- Students ↔ Clinical Protocols (which protocols apply to which students)
- Users ↔ Schools (multi-school assignments)
- Medications ↔ Drug Interactions

**Recommendation:** If many-to-many exists, use junction tables:
```typescript
// Student model
@BelongsToMany(() => ClinicalProtocol, {
  through: 'student_protocols',
  foreignKey: 'studentId',
  otherKey: 'protocolId',
  as: 'protocols'
})
declare protocols?: ClinicalProtocol[];
```

### 3.3 Lazy Loading Pattern (🔵 INFO)

**Current Pattern:** Models use `require()` to avoid circular dependencies:
```typescript
@ForeignKey(() => require('./user.model').User)
```

**Alternative:** Consider using Sequelize's `init()` pattern with late binding:
```typescript
// models/index.ts
export function initializeAssociations(sequelize: Sequelize) {
  User.belongsTo(School, { foreignKey: 'schoolId', as: 'school' });
  School.hasMany(User, { foreignKey: 'schoolId', as: 'staff' });
  // ... all associations
}
```

This allows proper imports and type safety while deferring association setup until all models are loaded.

---

## 4. BIDIRECTIONAL ASSOCIATION VERIFICATION

### ✅ Correctly Implemented Bidirectional Associations

1. **District ↔ School**
   - District: `@HasMany(() => School, { foreignKey: 'districtId', as: 'schools' })`
   - School: `@BelongsTo(() => District, { foreignKey: 'districtId', as: 'district' })`

2. **District ↔ License**
   - District: `@HasMany(() => License, { foreignKey: 'districtId', as: 'licenses' })`
   - License: `@BelongsTo(() => District, { foreignKey: 'districtId', as: 'district' })`

3. **Conversation ↔ ConversationParticipant**
   - Conversation: `@HasMany(() => ConversationParticipant, { foreignKey: 'conversationId', as: 'participants' })`
   - ConversationParticipant: `@BelongsTo(() => Conversation, { foreignKey: 'conversationId', as: 'conversation' })`

4. **Appointment ↔ AppointmentReminder**
   - Appointment: `@HasMany(() => AppointmentReminder)`
   - (Assuming AppointmentReminder has corresponding `@BelongsTo`)

5. **IncidentReport ↔ FollowUpAction**
   - IncidentReport: `@HasMany(() => FollowUpAction)`
   - (Assuming FollowUpAction has corresponding `@BelongsTo`)

6. **InventoryItem ↔ PurchaseOrderItem**
   - InventoryItem: `@HasMany(() => PurchaseOrderItem)`
   - (Assuming PurchaseOrderItem has corresponding `@BelongsTo`)

7. **PurchaseOrder ↔ PurchaseOrderItem**
   - PurchaseOrder: `@HasMany(() => PurchaseOrderItem)`
   - (Assuming PurchaseOrderItem has corresponding `@BelongsTo`)

8. **PurchaseOrder ↔ Vendor**
   - PurchaseOrder: `@BelongsTo(() => Vendor)`
   - (Vendor should have `@HasMany(() => PurchaseOrder)` - needs verification)

### ❌ Missing or Incomplete Bidirectional Associations

**Complete list documented in Section 1.1 above.**

---

## 5. FOREIGNKEY NAMING CONVENTION REVIEW

### Consistent Pattern (✅ Good)
Most foreign keys follow the convention: `{modelName}Id` (camelCase)
- `studentId`, `nurseId`, `schoolId`, `districtId`, `userId`

### Inconsistencies (⚠️ Needs Review)
1. **User References**
   - Sometimes `userId`, sometimes role-specific (`nurseId`, `counselorId`)
   - Sometimes action-specific (`createdBy`, `updatedBy`, `acknowledgedBy`)
   - **Recommendation:** Standardize to descriptive names when multiple refs exist

2. **Temporal References**
   - `createdBy`, `updatedBy` - good
   - Should also include `deletedBy` where paranoid is enabled

3. **String-based IDs**
   - `InventoryItem.supplier` is a string, not a foreign key
   - Should be refactored to `supplierId` with proper association

---

## 6. ASSOCIATION HOOKS & SCOPES

### Currently Missing
No models define:
- Association-level hooks
- Association scopes for filtering
- Custom getters/setters for associations
- Association validation

### Recommended Implementations

#### Example 1: Auto-update enrollment count
```typescript
// School model
@HasMany(() => Student, {
  foreignKey: 'schoolId',
  as: 'students',
  hooks: true
})
declare students?: Student[];

// Add in School class
static associate(models: any) {
  Student.addHook('afterCreate', async (student, options) => {
    if (student.schoolId) {
      await School.increment('totalEnrollment', {
        where: { id: student.schoolId }
      });
    }
  });

  Student.addHook('afterDestroy', async (student, options) => {
    if (student.schoolId) {
      await School.decrement('totalEnrollment', {
        where: { id: student.schoolId }
      });
    }
  });
}
```

#### Example 2: Audit trail for sensitive records
```typescript
// MentalHealthRecord - already has accessLog tracking
// Enhance with association hook
static associate(models: any) {
  MentalHealthRecord.addHook('afterFind', (records, options) => {
    // Log access for each record retrieved
    const recordList = Array.isArray(records) ? records : [records];
    recordList.forEach(record => {
      if (record && options.userId) {
        record.logAccess(options.userId, 'READ');
        record.save();
      }
    });
  });
}
```

#### Example 3: Association scopes
```typescript
// Student model - filter by active status
@HasMany(() => HealthRecord, {
  foreignKey: 'studentId',
  as: 'healthRecords',
  scope: {
    // Default: don't include confidential records
    isConfidential: false
  }
})
declare healthRecords?: HealthRecord[];

@HasMany(() => HealthRecord, {
  foreignKey: 'studentId',
  as: 'allHealthRecords'
  // No scope - returns all records
})
declare allHealthRecords?: HealthRecord[];
```

---

## 7. PRIORITY ACTION ITEMS

### Immediate (Sprint 1) - Critical Fixes

1. **User Model Associations** (2-3 hours)
   - Add `@BelongsTo` for school and district
   - Add all `@HasMany` inverse associations
   - File: `user.model.ts`

2. **Student Model Associations** (2 hours)
   - Add missing `@HasMany` for appointments, allergies, vaccinations, prescriptions
   - File: `student.model.ts`

3. **Message/Conversation Associations** (2 hours)
   - Add `@BelongsTo` for Conversation in Message
   - Add `@ForeignKey` for createdById in Conversation
   - Add `@HasMany` for messages in Conversation
   - Files: `message.model.ts`, `conversation.model.ts`

4. **Prescription Associations** (1 hour)
   - Add `@BelongsTo` for Student
   - Add `@ForeignKey` and `@BelongsTo` for prescribedBy → User
   - File: `prescription.model.ts`

### Short-term (Sprint 2) - Important Fixes

5. **School/District Inverse Associations** (1 hour)
   - Add `@HasMany` for students, staff, alerts
   - Files: `school.model.ts`, `district.model.ts`

6. **Alert Model Cleanup** (1 hour)
   - Verify all User associations work bidirectionally
   - File: `alert.model.ts`

7. **InventoryItem Refactor** (1 hour)
   - Change supplier from string to foreign key
   - File: `inventory-item.model.ts`

### Medium-term (Sprint 3) - Improvements

8. **Type Safety Refactor** (4-6 hours)
   - Remove `any` types from associations
   - Use proper model imports or conditional types
   - All model files

9. **Cascade Behaviors** (2-3 hours)
   - Define cascade strategies for each association
   - Implement onDelete/onUpdate behaviors
   - All model files

10. **Association Scopes** (2-3 hours)
    - Add default scopes for common filters
    - Create named association variants
    - High-use models first

### Long-term (Sprint 4+) - Enhancements

11. **Association Hooks** (4-6 hours)
    - Implement counter updates
    - Add audit logging
    - Add validation hooks

12. **Many-to-Many Relationships** (2-4 hours)
    - Identify implicit many-to-many patterns
    - Create junction tables
    - Implement `@BelongsToMany`

---

## 8. TESTING RECOMMENDATIONS

### Unit Tests
Create tests for each association:
```typescript
describe('Student Associations', () => {
  it('should belong to a School', async () => {
    const student = await Student.findOne({ include: ['school'] });
    expect(student.school).toBeDefined();
  });

  it('should have many health records', async () => {
    const student = await Student.findOne({ include: ['healthRecords'] });
    expect(student.healthRecords).toBeInstanceOf(Array);
  });

  it('should cascade delete health records', async () => {
    const student = await Student.create({...});
    await HealthRecord.create({ studentId: student.id, ... });
    await student.destroy();
    const records = await HealthRecord.findAll({ where: { studentId: student.id } });
    expect(records).toHaveLength(0);
  });
});
```

### Integration Tests
Test complex queries with multiple associations:
```typescript
describe('Complex Queries', () => {
  it('should eager load nested associations', async () => {
    const district = await District.findOne({
      include: [
        {
          model: School,
          as: 'schools',
          include: [
            {
              model: Student,
              as: 'students',
              include: ['healthRecords', 'appointments']
            }
          ]
        }
      ]
    });

    expect(district.schools[0].students[0].healthRecords).toBeDefined();
  });
});
```

---

## 9. MIGRATION STRATEGY

### Phase 1: Add Missing Inverse Associations (No Breaking Changes)
1. Add `@BelongsTo` and `@HasMany` decorators to models
2. No database schema changes required
3. Deploy and test

### Phase 2: Type Safety Improvements (Non-breaking)
1. Replace `any` types with proper model types
2. No runtime changes
3. Deploy

### Phase 3: Add Cascade Behaviors (Potentially Breaking)
1. Review current foreign key constraints in database
2. Add onDelete/onUpdate to associations
3. Run migration to update constraints
4. **Risk:** May prevent deletions that previously worked
5. **Mitigation:** Test thoroughly in staging first

### Phase 4: Association Hooks (Feature Addition)
1. Add hooks for counter updates, audit logging
2. Deploy incrementally
3. Monitor performance impact

---

## 10. DOCUMENTATION REQUIREMENTS

### Model Documentation Template
Each model should document its associations:

```typescript
/**
 * Student Model
 *
 * Associations:
 * - belongsTo: User (as 'nurse'), School, District
 * - hasMany: HealthRecord, Appointment, Allergy, Vaccination, Prescription
 *
 * Cascade Behaviors:
 * - Deleting student cascades to: HealthRecord, Appointment, Prescription
 * - Deleting student sets NULL on: Allergy (preserve for research)
 *
 * Foreign Keys:
 * - nurseId → users.id
 * - schoolId → schools.id
 * - districtId → districts.id
 */
@Table({...})
export class Student extends Model<StudentAttributes> {
  // ...
}
```

---

## 11. SEQUELIZE BEST PRACTICES COMPLIANCE

### ✅ Following Best Practices
- Using lazy loading with `require()` to avoid circular dependencies
- Using TypeScript decorators properly
- Defining explicit foreign keys
- Using indexes on foreign key columns
- Proper use of JSONB for flexible data

### ❌ Violating Best Practices
- Missing bidirectional associations (major violation)
- Inconsistent alias naming
- No cascade behaviors defined
- Using `any` types (loses TypeScript benefits)
- No association hooks or scopes

### Sequelize Documentation References
- [Associations](https://sequelize.org/docs/v6/core-concepts/assocs/)
- [Association Scopes](https://sequelize.org/docs/v6/other-topics/scopes/)
- [Hooks](https://sequelize.org/docs/v6/other-topics/hooks/)
- [TypeScript](https://sequelize.org/docs/v6/other-topics/typescript/)

---

## 12. CONCLUSION

The White Cross backend has a **solid foundation** for its data models, but **critical association patterns are missing** that could lead to:
- Runtime errors when eager loading
- Data integrity issues
- Cascade deletion problems
- Poor query performance
- Loss of type safety

**Estimated Effort to Fix Critical Issues:** 8-12 hours
**Estimated Effort for All Improvements:** 20-30 hours

**Recommended Approach:**
1. Start with User, Student, and Message/Conversation models (highest usage)
2. Add missing inverse associations incrementally
3. Deploy and test each phase before proceeding
4. Add cascade behaviors carefully with thorough testing
5. Improve type safety throughout
6. Add hooks and scopes as enhancements

**Risk Level:**
- Phase 1 (associations): Low risk, high value
- Phase 2 (types): No risk, high value
- Phase 3 (cascades): Medium risk, high value - test carefully
- Phase 4 (hooks): Low risk, medium value

---

## APPENDIX A: Complete Association Matrix

| Model | belongsTo | hasMany | belongsToMany | Missing Associations |
|-------|-----------|---------|---------------|---------------------|
| User | ❌ School, District | ❌ Student, Appointment, Alert, Message | ❌ | Most critical |
| Student | ✅ User, School, District | ⚠️ Partial (missing 6+) | ❌ | High priority |
| School | ✅ District | ❌ Student, User, Alert | ❌ | Medium priority |
| District | ❌ | ⚠️ School, License (missing Student, User) | ❌ | Medium priority |
| Appointment | ✅ User, Student | ✅ AppointmentReminder | ❌ | Low priority |
| Message | ⚠️ User (missing Conversation) | ❌ MessageDelivery | ❌ | High priority |
| Conversation | ❌ User | ⚠️ Participant (missing Message) | ❌ | High priority |
| Prescription | ⚠️ Partial (missing Student) | ❌ | ❌ | High priority |
| HealthRecord | ✅ Student | ❌ | ❌ | Low priority |
| Allergy | ✅ Student | ❌ | ❌ | Low priority |
| Vaccination | ✅ Student, HealthRecord | ❌ | ❌ | Low priority |
| Alert | ⚠️ Partial (complex) | ❌ | ❌ | Medium priority |
| IncidentReport | ✅ Student | ✅ FollowUpAction, WitnessStatement | ❌ | Low priority |

---

**Generated:** 2025-10-30
**Analyst:** TypeScript Systems Architect (Claude)
**Review Status:** Pending team review
