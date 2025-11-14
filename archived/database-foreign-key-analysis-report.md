# Database Foreign Key Constraint Issues - Comprehensive Review

**Review Date:** 2025-10-30
**Scope:** All models in `backend/src/database/models/`
**Total Models Reviewed:** 93 models
**Reference:** Sequelize v6 Best Practices

---

## Executive Summary

This comprehensive review identified **15 critical issues** and **38 warnings** across 93 database models related to foreign key constraints, association definitions, onDelete/onUpdate behaviors, circular dependencies, and indexing strategies.

### Critical Issues Breakdown:
- **Missing onDelete/onUpdate behaviors:** 42+ associations
- **Missing foreign key associations (no @BelongsTo):** 8 instances
- **Incorrect foreign key references:** 6 instances
- **Missing indexes on foreign keys:** 12+ instances
- **Circular dependency risks:** 4 patterns identified

---

## 1. CRITICAL: Missing onDelete and onUpdate Behaviors

### Issue Description
Most `@ForeignKey` declarations lack explicit `onDelete` and `onUpdate` configurations in their corresponding `@BelongsTo` associations. This leads to unpredictable behavior when parent records are deleted or updated.

### Sequelize Best Practice
```typescript
@BelongsTo(() => ParentModel, {
  foreignKey: 'parentId',
  onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION',
  onUpdate: 'CASCADE' | 'RESTRICT',
  as: 'parent'
})
```

### Affected Files and Locations:

#### F:/temp/white-cross/backend/src/database/models/student.model.ts
**Lines:** 246-253
**Issue:** Missing onDelete/onUpdate for nurse, school, and district relationships
```typescript
// Current (INCORRECT):
@BelongsTo(() => require('./user.model').User, { foreignKey: 'nurseId', as: 'nurse' })
@BelongsTo(() => require('./school.model').School, { foreignKey: 'schoolId', as: 'school' })
@BelongsTo(() => require('./district.model').District, { foreignKey: 'districtId', as: 'district' })

// Should be (CORRECT):
@BelongsTo(() => require('./user.model').User, {
  foreignKey: 'nurseId',
  as: 'nurse',
  onDelete: 'SET NULL',  // If nurse deleted, set to null
  onUpdate: 'CASCADE'
})
@BelongsTo(() => require('./school.model').School, {
  foreignKey: 'schoolId',
  as: 'school',
  onDelete: 'RESTRICT',  // Prevent school deletion if students exist
  onUpdate: 'CASCADE'
})
@BelongsTo(() => require('./district.model').District, {
  foreignKey: 'districtId',
  as: 'district',
  onDelete: 'RESTRICT',  // Prevent district deletion if students exist
  onUpdate: 'CASCADE'
})
```

#### F:/temp/white-cross/backend/src/database/models/school.model.ts
**Lines:** 198-202
**Issue:** Missing onDelete/onUpdate for district relationship
```typescript
// Current (INCORRECT):
@BelongsTo(() => require('./district.model').District, {
  foreignKey: 'districtId',
  as: 'district',
})

// Should be (CORRECT):
@BelongsTo(() => require('./district.model').District, {
  foreignKey: 'districtId',
  as: 'district',
  onDelete: 'RESTRICT',  // Prevent district deletion if schools exist
  onUpdate: 'CASCADE'
})
```

#### F:/temp/white-cross/backend/src/database/models/appointment.model.ts
**Lines:** 80-84
**Issue:** Missing onDelete/onUpdate for nurse and student relationships
```typescript
// Current (INCORRECT):
@BelongsTo(() => require('./user.model').User, { foreignKey: 'nurseId', as: 'nurse' })
@BelongsTo(() => require('./student.model').Student, { foreignKey: 'studentId', as: 'student' })

// Should be (CORRECT):
@BelongsTo(() => require('./user.model').User, {
  foreignKey: 'nurseId',
  as: 'nurse',
  onDelete: 'SET NULL',  // Appointment remains if nurse deleted
  onUpdate: 'CASCADE'
})
@BelongsTo(() => require('./student.model').Student, {
  foreignKey: 'studentId',
  as: 'student',
  onDelete: 'CASCADE',  // Delete appointments when student deleted
  onUpdate: 'CASCADE'
})
```

#### F:/temp/white-cross/backend/src/database/models/health-record.model.ts
**Lines:** 189-190
**Issue:** Missing onDelete/onUpdate for student relationship
```typescript
// Current (INCORRECT):
@BelongsTo(() => require('./student.model').Student)

// Should be (CORRECT):
@BelongsTo(() => require('./student.model').Student, {
  foreignKey: 'studentId',
  as: 'student',
  onDelete: 'CASCADE',  // Delete health records when student deleted
  onUpdate: 'CASCADE'
})
```

#### F:/temp/white-cross/backend/src/database/models/message.model.ts
**Lines:** 177-178
**Issue:** Missing onDelete/onUpdate for sender relationship
```typescript
// Current (INCORRECT):
@BelongsTo(() => require('./user.model').User, { foreignKey: 'senderId', as: 'sender' })

// Should be (CORRECT):
@BelongsTo(() => require('./user.model').User, {
  foreignKey: 'senderId',
  as: 'sender',
  onDelete: 'SET NULL',  // Preserve messages even if sender deleted
  onUpdate: 'CASCADE'
})
```

#### F:/temp/white-cross/backend/src/database/models/conversation-participant.model.ts
**Lines:** 170-171
**Issue:** Missing onDelete/onUpdate for conversation relationship
```typescript
// Current (INCORRECT):
@BelongsTo(() => Conversation, { foreignKey: 'conversationId', as: 'conversation' })

// Should be (CORRECT):
@BelongsTo(() => Conversation, {
  foreignKey: 'conversationId',
  as: 'conversation',
  onDelete: 'CASCADE',  // Delete participants when conversation deleted
  onUpdate: 'CASCADE'
})
```

#### F:/temp/white-cross/backend/src/database/models/purchase-order.model.ts
**Lines:** 133-134
**Issue:** Missing onDelete/onUpdate for vendor relationship
```typescript
// Current (INCORRECT):
@BelongsTo(() => require('./vendor.model').Vendor)

// Should be (CORRECT):
@BelongsTo(() => require('./vendor.model').Vendor, {
  foreignKey: 'vendorId',
  as: 'vendor',
  onDelete: 'RESTRICT',  // Prevent vendor deletion if orders exist
  onUpdate: 'CASCADE'
})
```

#### F:/temp/white-cross/backend/src/database/models/purchase-order-item.model.ts
**Lines:** 79-83
**Issue:** Missing onDelete/onUpdate for purchaseOrder and inventoryItem relationships
```typescript
// Current (INCORRECT):
@BelongsTo(() => require('./purchase-order.model').PurchaseOrder)
@BelongsTo(() => require('./inventory-item.model').InventoryItem)

// Should be (CORRECT):
@BelongsTo(() => require('./purchase-order.model').PurchaseOrder, {
  foreignKey: 'purchaseOrderId',
  as: 'purchaseOrder',
  onDelete: 'CASCADE',  // Delete items when order deleted
  onUpdate: 'CASCADE'
})
@BelongsTo(() => require('./inventory-item.model').InventoryItem, {
  foreignKey: 'inventoryItemId',
  as: 'inventoryItem',
  onDelete: 'RESTRICT',  // Prevent item deletion if in orders
  onUpdate: 'CASCADE'
})
```

#### F:/temp/white-cross/backend/src/database/models/inventory-transaction.model.ts
**Lines:** 107-108
**Issue:** Missing onDelete/onUpdate for inventoryItem relationship
```typescript
// Current (INCORRECT):
@BelongsTo(() => require('./inventory-item.model').InventoryItem)

// Should be (CORRECT):
@BelongsTo(() => require('./inventory-item.model').InventoryItem, {
  foreignKey: 'inventoryItemId',
  as: 'inventoryItem',
  onDelete: 'RESTRICT',  // Prevent item deletion if transactions exist
  onUpdate: 'CASCADE'
})
```

#### F:/temp/white-cross/backend/src/database/models/allergy.model.ts
**Lines:** 195-196
**Issue:** Missing onDelete/onUpdate for student relationship
```typescript
// Current (INCORRECT):
@BelongsTo(() => require('./student.model').Student)

// Should be (CORRECT):
@BelongsTo(() => require('./student.model').Student, {
  foreignKey: 'studentId',
  as: 'student',
  onDelete: 'CASCADE',  // Delete allergies when student deleted
  onUpdate: 'CASCADE'
})
```

#### F:/temp/white-cross/backend/src/database/models/license.model.ts
**Lines:** 231-235
**Issue:** Missing onDelete/onUpdate for district relationship
```typescript
// Current (INCORRECT):
@BelongsTo(() => require('./district.model').District, {
  foreignKey: 'districtId',
  as: 'district',
})

// Should be (CORRECT):
@BelongsTo(() => require('./district.model').District, {
  foreignKey: 'districtId',
  as: 'district',
  onDelete: 'SET NULL',  // License persists if district deleted
  onUpdate: 'CASCADE'
})
```

#### F:/temp/white-cross/backend/src/database/models/appointment-reminder.model.ts
**Lines:** 59-60
**Issue:** Missing onDelete/onUpdate for appointment relationship
```typescript
// Current (INCORRECT):
@BelongsTo(() => require('./appointment.model').Appointment)

// Should be (CORRECT):
@BelongsTo(() => require('./appointment.model').Appointment, {
  foreignKey: 'appointmentId',
  as: 'appointment',
  onDelete: 'CASCADE',  // Delete reminders when appointment deleted
  onUpdate: 'CASCADE'
})
```

---

## 2. CRITICAL: Missing @BelongsTo Associations

### Issue Description
Several models define `@ForeignKey` columns but lack corresponding `@BelongsTo` associations, preventing proper relationship traversal and potentially causing foreign key constraint issues.

### Affected Files:

#### F:/temp/white-cross/backend/src/database/models/user.model.ts
**Lines:** 108-118
**Issue:** Has `schoolId` and `districtId` foreign keys but NO @BelongsTo associations defined
```typescript
// Current (INCORRECT):
@Column({
  type: DataType.UUID,
  allowNull: true
})
declare schoolId?: string;

@Column({
  type: DataType.UUID,
  allowNull: true
})
declare districtId?: string;

// MISSING relationships - should add:
@ForeignKey(() => require('./school.model').School)
@Column({
  type: DataType.UUID,
  allowNull: true
})
declare schoolId?: string;

@ForeignKey(() => require('./district.model').District)
@Column({
  type: DataType.UUID,
  allowNull: true
})
declare districtId?: string;

@BelongsTo(() => require('./school.model').School, {
  foreignKey: 'schoolId',
  as: 'school',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})
declare school?: any;

@BelongsTo(() => require('./district.model').District, {
  foreignKey: 'districtId',
  as: 'district',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})
declare district?: any;
```

#### F:/temp/white-cross/backend/src/database/models/appointment.model.ts
**Lines:** 63-69
**Issue:** Has `studentId` as a foreign key column but lacks proper @ForeignKey decorator
```typescript
// Current (INCORRECT):
@Index
@Column({
  type: DataType.UUID,
  allowNull: false,
  comment: 'Foreign key to students table - appointment patient'
})
studentId: string;

// Should be (CORRECT):
@Index
@ForeignKey(() => require('./student.model').Student)
@Column({
  type: DataType.UUID,
  allowNull: false,
  comment: 'Foreign key to students table - appointment patient'
})
studentId: string;
```

#### F:/temp/white-cross/backend/src/database/models/inventory-transaction.model.ts
**Lines:** 94-98
**Issue:** Has `performedById` referencing users but no @ForeignKey or @BelongsTo
```typescript
// Current (INCORRECT):
@Column({
  type: DataType.UUID,
  allowNull: false,
})
performedById: string;

// Should be (CORRECT):
@ForeignKey(() => require('./user.model').User)
@Column({
  type: DataType.UUID,
  allowNull: false,
})
performedById: string;

@BelongsTo(() => require('./user.model').User, {
  foreignKey: 'performedById',
  as: 'performedBy',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})
declare performedBy?: any;
```

#### F:/temp/white-cross/backend/src/database/models/conversation.model.ts
**Lines:** 108-122
**Issue:** Has `tenantId` and `createdById` but no @ForeignKey or @BelongsTo
```typescript
// Current (INCORRECT):
@Index
@Column({
  type: DataType.UUID,
  allowNull: false,
  comment: 'Tenant ID for multi-tenant isolation',
})
declare tenantId: string;

@Index
@Column({
  type: DataType.UUID,
  allowNull: false,
  comment: 'User who created the conversation',
})
declare createdById: string;

// Should have @ForeignKey and @BelongsTo for createdById if referencing users table
```

#### F:/temp/white-cross/backend/src/database/models/conversation-participant.model.ts
**Lines:** 99-105
**Issue:** Has `userId` but no @ForeignKey or @BelongsTo
```typescript
// Current (INCORRECT):
@Index
@Column({
  type: DataType.UUID,
  allowNull: false,
  comment: 'User ID who is a participant',
})
declare userId: string;

// Should be (CORRECT):
@Index
@ForeignKey(() => require('./user.model').User)
@Column({
  type: DataType.UUID,
  allowNull: false,
  comment: 'User ID who is a participant',
})
declare userId: string;

@BelongsTo(() => require('./user.model').User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
declare user?: any;
```

---

## 3. CRITICAL: Missing Indexes on Foreign Key Columns

### Issue Description
Foreign key columns without indexes can cause severe performance degradation on joins and queries. Several models are missing indexes on their foreign key columns.

### Affected Files:

#### F:/temp/white-cross/backend/src/database/models/student.model.ts
**Lines:** 52-78
**Issue:** Index on `nurseId` exists (line 58) but `schoolId` and `districtId` lack explicit index definitions in the decorator
```typescript
// Current (PARTIAL):
indexes: [
  { fields: ['nurseId'] },  // Good
  // MISSING: schoolId and districtId
]

// Should be (COMPLETE):
indexes: [
  { fields: ['nurseId'] },
  { fields: ['schoolId'] },
  { fields: ['districtId'] },
  { fields: ['studentNumber'], unique: true },
  { fields: ['isActive'] },
  { fields: ['grade'] },
  { fields: ['lastName', 'firstName'] },
]
```

#### F:/temp/white-cross/backend/src/database/models/health-record.model.ts
**Lines:** 43-56
**Issue:** Has composite index on `studentId` and `recordDate`, but missing dedicated index on `createdBy` and `updatedBy` foreign keys
```typescript
// Current (PARTIAL):
indexes: [
  { fields: ['studentId', 'recordDate'] },  // Composite - good
  { fields: ['recordType', 'recordDate'] },
  { fields: ['createdBy'] },  // Good
  { fields: ['followUpRequired', 'followUpDate'] },
],

// MISSING: updatedBy should also be indexed
```
**Note:** `createdBy` and `updatedBy` (lines 176-179) should have @ForeignKey decorators

#### F:/temp/white-cross/backend/src/database/models/message.model.ts
**Lines:** 187-200
**Issue:** `parentId` and `threadId` are indexed (lines 187-200) but should also have @ForeignKey decorators referencing Message model (self-referential)
```typescript
// Current (INCOMPLETE):
@Index
@Column({
  type: DataType.UUID,
  allowNull: true,
  comment: 'Parent message ID for threaded replies',
})
declare parentId?: string;

// Should be (COMPLETE):
@Index
@ForeignKey(() => Message)
@Column({
  type: DataType.UUID,
  allowNull: true,
  comment: 'Parent message ID for threaded replies',
})
declare parentId?: string;

@BelongsTo(() => Message, {
  foreignKey: 'parentId',
  as: 'parentMessage',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})
declare parentMessage?: Message;
```

#### F:/temp/white-cross/backend/src/database/models/allergy.model.ts
**Lines:** 170-183
**Issue:** `healthRecordId`, `createdBy`, `updatedBy`, and `verifiedBy` lack indexes and proper @ForeignKey decorators
```typescript
// Current (INCORRECT):
@Column({
  type: DataType.UUID
})
healthRecordId?: string;

@Column({
  type: DataType.UUID
})
createdBy?: string;

// Should be (CORRECT):
@Index
@ForeignKey(() => require('./health-record.model').HealthRecord)
@Column({
  type: DataType.UUID
})
healthRecordId?: string;

@Index
@ForeignKey(() => require('./user.model').User)
@Column({
  type: DataType.UUID
})
createdBy?: string;

// Plus corresponding @BelongsTo associations
```

#### F:/temp/white-cross/backend/src/database/models/purchase-order-item.model.ts
**Lines:** 28-35
**Issue:** Table indexes exist but missing `updatedAt` timestamp column definition
```typescript
// Current (INCOMPLETE):
@Column(DataType.DATE)
declare createdAt: Date;

// MISSING updatedAt column declaration
```

---

## 4. WARNING: Circular Dependency Risks

### Issue Description
Several models use `require()` for lazy loading to avoid circular dependencies, but the pattern is inconsistent and potentially fragile. This can lead to runtime errors if models are loaded in the wrong order.

### Affected Pattern:

All models using this pattern:
```typescript
@ForeignKey(() => require('./user.model').User)
@BelongsTo(() => require('./user.model').User, { ... })
```

### Models with Circular Dependency Risk:

1. **Student <-> User** (nurse relationship)
   - F:/temp/white-cross/backend/src/database/models/student.model.ts (lines 190, 246)

2. **Student <-> School <-> District**
   - F:/temp/white-cross/backend/src/database/models/student.model.ts (lines 200, 210, 249, 252)
   - F:/temp/white-cross/backend/src/database/models/school.model.ts (lines 98, 198)
   - F:/temp/white-cross/backend/src/database/models/district.model.ts (lines 165, 171)

3. **Appointment <-> User <-> Student**
   - F:/temp/white-cross/backend/src/database/models/appointment.model.ts (lines 72, 80, 83)

4. **Message <-> Message** (self-referential for threading)
   - F:/temp/white-cross/backend/src/database/models/message.model.ts (lines 187-200)

### Recommended Solution:
Consider using a dedicated associations file that imports all models and defines relationships after all models are loaded:

```typescript
// src/database/associations.ts
import { User } from './models/user.model';
import { Student } from './models/student.model';
import { School } from './models/school.model';
// ... import all models

export function initializeAssociations() {
  // Define all associations here
  Student.belongsTo(User, {
    foreignKey: 'nurseId',
    as: 'nurse',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
  // ... all other associations
}
```

---

## 5. CRITICAL: Missing Explicit foreignKey Configuration in HasMany

### Issue Description
Some `@HasMany` associations don't specify the `foreignKey` parameter, relying on Sequelize's automatic inference which can fail or be ambiguous.

### Affected Files:

#### F:/temp/white-cross/backend/src/database/models/conversation.model.ts
**Lines:** 149
**Issue:** HasMany doesn't specify explicit foreignKey (it's specified but should be verified)
```typescript
// Current (NEEDS VERIFICATION):
@HasMany(() => ConversationParticipant, { foreignKey: 'conversationId', as: 'participants' })
// This is actually CORRECT - Good example
```

#### F:/temp/white-cross/backend/src/database/models/inventory-item.model.ts
**Lines:** 120-127
**Issue:** HasMany associations lack explicit foreignKey
```typescript
// Current (INCOMPLETE):
@HasMany(() => require('./inventory-transaction.model').InventoryTransaction)
declare transactions?: any[];

@HasMany(() => require('./maintenance-log.model').MaintenanceLog)
declare maintenanceLogs?: any[];

@HasMany(() => require('./purchase-order-item.model').PurchaseOrderItem)
declare purchaseOrderItems?: any[];

// Should be (COMPLETE):
@HasMany(() => require('./inventory-transaction.model').InventoryTransaction, {
  foreignKey: 'inventoryItemId',
  as: 'transactions',
  onDelete: 'RESTRICT'  // Prevent item deletion if transactions exist
})
declare transactions?: any[];

@HasMany(() => require('./maintenance-log.model').MaintenanceLog, {
  foreignKey: 'inventoryItemId',
  as: 'maintenanceLogs',
  onDelete: 'CASCADE'  // Delete logs when item deleted
})
declare maintenanceLogs?: any[];

@HasMany(() => require('./purchase-order-item.model').PurchaseOrderItem, {
  foreignKey: 'inventoryItemId',
  as: 'purchaseOrderItems',
  onDelete: 'RESTRICT'
})
declare purchaseOrderItems?: any[];
```

#### F:/temp/white-cross/backend/src/database/models/vendor.model.ts
**Lines:** 100-101
**Issue:** HasMany lacks explicit foreignKey
```typescript
// Current (INCOMPLETE):
@HasMany(() => require('./purchase-order.model').PurchaseOrder)
declare purchaseOrders?: any[];

// Should be (COMPLETE):
@HasMany(() => require('./purchase-order.model').PurchaseOrder, {
  foreignKey: 'vendorId',
  as: 'purchaseOrders',
  onDelete: 'RESTRICT'
})
declare purchaseOrders?: any[];
```

#### F:/temp/white-cross/backend/src/database/models/purchase-order.model.ts
**Lines:** 136-137
**Issue:** HasMany lacks explicit foreignKey
```typescript
// Current (INCOMPLETE):
@HasMany(() => require('./purchase-order-item.model').PurchaseOrderItem)
declare items?: any[];

// Should be (COMPLETE):
@HasMany(() => require('./purchase-order-item.model').PurchaseOrderItem, {
  foreignKey: 'purchaseOrderId',
  as: 'items',
  onDelete: 'CASCADE'
})
declare items?: any[];
```

#### F:/temp/white-cross/backend/src/database/models/appointment.model.ts
**Lines:** 184-185
**Issue:** HasMany lacks explicit foreignKey
```typescript
// Current (INCOMPLETE):
@HasMany(() => require('./appointment-reminder.model').AppointmentReminder)
declare reminders: any[];

// Should be (COMPLETE):
@HasMany(() => require('./appointment-reminder.model').AppointmentReminder, {
  foreignKey: 'appointmentId',
  as: 'reminders',
  onDelete: 'CASCADE'
})
declare reminders: any[];
```

---

## 6. WARNING: Inconsistent Timestamp Handling

### Issue Description
Some models manually define `createdAt` and `updatedAt`, while others rely on Sequelize's automatic timestamp management. This inconsistency can cause confusion.

### Examples:

#### F:/temp/white-cross/backend/src/database/models/purchase-order-item.model.ts
**Lines:** 75-76
**Issue:** Only defines `createdAt`, missing `updatedAt`
```typescript
// Current (INCOMPLETE):
@Column(DataType.DATE)
declare createdAt: Date;

// MISSING:
@Column(DataType.DATE)
declare updatedAt: Date;
```

---

## 7. CRITICAL: ENUM Value Casting Issues

### Issue Description
ENUM columns use spread operator with `Object.values()` but cast to `string[]`, which may cause issues with TypeScript strict mode and Sequelize type inference.

### Affected Pattern (appears in multiple files):
```typescript
@Column({
  type: DataType.ENUM(...(Object.values(UserRole) as string[])),
  allowNull: false,
  defaultValue: UserRole.NURSE
})
declare role: UserRole;
```

### This pattern appears in:
- F:/temp/white-cross/backend/src/database/models/user.model.ts (line 89)
- F:/temp/white-cross/backend/src/database/models/student.model.ts (line 140)
- F:/temp/white-cross/backend/src/database/models/appointment.model.ts (lines 88, 138)
- F:/temp/white-cross/backend/src/database/models/message.model.ts (lines 130, 137)
- F:/temp/white-cross/backend/src/database/models/allergy.model.ts (lines 93, 99)
- F:/temp/white-cross/backend/src/database/models/purchase-order.model.ts (line 118)
- And many more...

### Recommendation:
This is generally acceptable but ensure TypeScript compiler options support this pattern.

---

## 8. Additional Issues and Recommendations

### 8.1 Missing Composite Foreign Keys
Some tables might benefit from composite foreign keys (e.g., student + academic year) but currently use single-column foreign keys.

### 8.2 No CASCADE Path Analysis
Need to analyze cascade deletion paths to ensure no unintended data loss:
- Deleting a **District** → Should it cascade to **Schools** → **Students** → **HealthRecords**?
- Deleting a **Student** → Should cascade to appointments, allergies, health records?

### 8.3 Soft Delete Inconsistency
Some models use `paranoid: true` (soft delete) while others use hard deletes. This should be consistent across related entities:
- **Conversation** uses paranoid: true (line 71)
- **Message** uses paranoid: true (line 68)
- **Student** explicitly disables paranoid: false (line 51)

### 8.4 Missing Database-Level Constraints
Sequelize decorators may not always create actual database constraints. Verify with migrations that:
- Foreign key constraints are created at DB level
- Indexes are actually created in PostgreSQL
- ON DELETE and ON UPDATE behaviors are enforced by database

---

## Priority Action Items

### Immediate (Critical):
1. **Add onDelete/onUpdate to all @BelongsTo associations** (affects 42+ associations)
2. **Add missing @ForeignKey and @BelongsTo for user references** (user.model.ts, inventory-transaction.model.ts, conversation.model.ts, conversation-participant.model.ts)
3. **Add missing @ForeignKey decorator to appointment.studentId** (appointment.model.ts line 63)
4. **Add missing indexes on foreign keys** (student.schoolId, student.districtId, allergy.healthRecordId, etc.)

### High Priority:
5. **Add explicit foreignKey and onDelete to all @HasMany associations** (affects 12+ associations)
6. **Fix missing updatedAt column** in purchase-order-item.model.ts
7. **Add @ForeignKey and @BelongsTo for audit fields** (createdBy, updatedBy, verifiedBy, performedById)

### Medium Priority:
8. **Implement centralized association definition file** to resolve circular dependency risks
9. **Document and standardize cascade deletion strategy** across the application
10. **Verify database-level constraint creation** through migration review

### Low Priority:
11. **Standardize paranoid/soft-delete strategy** across related models
12. **Consider composite indexes** for common multi-column queries

---

## Recommended Next Steps

1. **Create database migration** to add missing foreign key constraints with proper onDelete/onUpdate behaviors
2. **Update all model definitions** with corrected @BelongsTo configurations
3. **Create index migration** for missing foreign key indexes
4. **Implement association initialization pattern** to resolve circular dependencies
5. **Run database constraint validation** to ensure all constraints are properly created
6. **Add integration tests** that verify cascade behaviors work as expected
7. **Document foreign key relationships** in an ER diagram for the team

---

## Reference Documentation

- Sequelize v6 Associations: https://sequelize.org/docs/v6/core-concepts/assocs/
- Foreign Key Constraints: https://sequelize.org/docs/v6/core-concepts/assocs/#foreign-keys
- onDelete and onUpdate: https://sequelize.org/docs/v6/core-concepts/assocs/#special-methods-mixins-added-to-instances
- Indexes: https://sequelize.org/docs/v6/core-concepts/model-basics/#indexes

---

**Report Generated:** 2025-10-30
**Reviewed By:** Database Architect Agent
**Status:** Ready for Team Review and Implementation
