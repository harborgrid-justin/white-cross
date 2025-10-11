# Service Migration Execution Guide
**Quick Reference for Migrating Each Service File**

---

## Step-by-Step Migration Process

### For Each Service File:

#### Step 1: Update Imports
```typescript
// REMOVE these lines:
import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

// ADD these lines:
import { Op } from 'sequelize';
import sequelize from '../database/models';
import {
  // Import only the models you need from this list:
  User,
  Student,
  EmergencyContact,
  Medication,
  StudentMedication,
  MedicationLog,
  MedicationInventory,
  HealthRecord,
  Allergy,
  ChronicCondition,
  Vaccination,
  Screening,
  GrowthMeasurement,
  VitalSigns,
  Appointment,
  AppointmentReminder,
  NurseAvailability,
  AppointmentWaitlist,
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  InventoryItem,
  InventoryTransaction,
  MaintenanceLog,
  Message,
  MessageDelivery,
  MessageTemplate,
  AuditLog,
  ComplianceReport,
  ConsentForm,
  PolicyDocument,
  Document,
  DocumentAuditTrail,
  DocumentSignature
} from '../database/models';
```

#### Step 2: Convert findUnique/findMany/findFirst

**Pattern 1: Simple findUnique by ID**
```typescript
// BEFORE
const user = await prisma.user.findUnique({
  where: { id: userId }
});

// AFTER
const user = await User.findByPk(userId);
```

**Pattern 2: findUnique by unique field**
```typescript
// BEFORE
const user = await prisma.user.findUnique({
  where: { email: email }
});

// AFTER
const user = await User.findOne({
  where: { email: email }
});
```

**Pattern 3: findFirst with complex where**
```typescript
// BEFORE
const med = await prisma.medication.findFirst({
  where: {
    name: data.name,
    strength: data.strength,
    dosageForm: data.dosageForm
  }
});

// AFTER
const med = await Medication.findOne({
  where: {
    name: data.name,
    strength: data.strength,
    dosageForm: data.dosageForm
  }
});
```

**Pattern 4: findMany with pagination**
```typescript
// BEFORE
const students = await prisma.student.findMany({
  where: whereClause,
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { lastName: 'asc' }
});

// AFTER
const students = await Student.findAll({
  where: whereClause,
  offset: (page - 1) * limit,
  limit: limit,
  order: [['lastName', 'ASC']]
});
```

#### Step 3: Convert Operators

```typescript
// BEFORE
where: {
  OR: [
    { firstName: { contains: search, mode: 'insensitive' } },
    { lastName: { contains: search, mode: 'insensitive' } }
  ]
}

// AFTER
where: {
  [Op.or]: [
    { firstName: { [Op.iLike]: `%${search}%` } },
    { lastName: { [Op.iLike]: `%${search}%` } }
  ]
}
```

```typescript
// BEFORE
where: {
  startDate: { lte: endDate },
  endDate: { gte: startDate }
}

// AFTER
where: {
  startDate: { [Op.lte]: endDate },
  endDate: { [Op.gte]: startDate }
}
```

```typescript
// BEFORE
where: {
  role: { in: ['NURSE', 'ADMIN'] }
}

// AFTER
where: {
  role: { [Op.in]: ['NURSE', 'ADMIN'] }
}
```

#### Step 4: Convert Includes (Relations)

```typescript
// BEFORE
include: {
  student: {
    select: {
      id: true,
      firstName: true,
      lastName: true
    }
  }
}

// AFTER
include: [{
  model: Student,
  as: 'student',  // Must match association alias
  attributes: ['id', 'firstName', 'lastName']
}]
```

**Multiple Includes:**
```typescript
// BEFORE
include: {
  student: {
    select: { id: true, firstName: true }
  },
  nurse: {
    select: { id: true, firstName: true }
  }
}

// AFTER
include: [
  {
    model: Student,
    as: 'student',
    attributes: ['id', 'firstName']
  },
  {
    model: User,
    as: 'nurse',
    attributes: ['id', 'firstName']
  }
]
```

#### Step 5: Convert Select (Attributes)

```typescript
// BEFORE
select: {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true
}

// AFTER
attributes: ['id', 'email', 'firstName', 'lastName', 'role']
```

#### Step 6: Convert _count

```typescript
// BEFORE
include: {
  _count: {
    select: {
      appointments: true,
      incidentReports: true
    }
  }
}

// AFTER - Option 1: Separate counts after query
const user = await User.findByPk(id);
const appointmentCount = await Appointment.count({ where: { userId: id } });
const incidentCount = await IncidentReport.count({ where: { reportedById: id } });

// AFTER - Option 2: Include and count in code
const user = await User.findByPk(id, {
  include: [
    { model: Appointment, as: 'appointments', attributes: ['id'] },
    { model: IncidentReport, as: 'incidentReports', attributes: ['id'] }
  ]
});
const result = {
  ...user.toJSON(),
  _count: {
    appointments: user.appointments?.length || 0,
    incidentReports: user.incidentReports?.length || 0
  }
};
```

#### Step 7: Convert Create Operations

```typescript
// BEFORE
const student = await prisma.student.create({
  data: studentData,
  include: {
    nurse: true
  }
});

// AFTER
const student = await Student.create(studentData, {
  include: [
    { model: User, as: 'nurse' }
  ]
});
```

#### Step 8: Convert Update Operations

```typescript
// BEFORE
const student = await prisma.student.update({
  where: { id },
  data: updateData
});

// AFTER
const student = await Student.findByPk(id);
if (!student) {
  throw new Error('Student not found');
}
await student.update(updateData);
```

#### Step 9: Convert Delete Operations

```typescript
// BEFORE - Single delete
await prisma.student.delete({
  where: { id }
});

// AFTER - Single delete
const student = await Student.findByPk(id);
if (!student) {
  throw new Error('Student not found');
}
await student.destroy();
```

```typescript
// BEFORE - Bulk delete
await prisma.healthRecord.deleteMany({
  where: { id: { in: recordIds } }
});

// AFTER - Bulk delete
await HealthRecord.destroy({
  where: { id: { [Op.in]: recordIds } }
});
```

#### Step 10: Convert Transactions

```typescript
// BEFORE
await prisma.$transaction(async (tx) => {
  const student = await tx.student.create({ data: studentData });
  await tx.emergencyContact.create({ data: { ...contactData, studentId: student.id } });
});

// AFTER
await sequelize.transaction(async (t) => {
  const student = await Student.create(studentData, { transaction: t });
  await EmergencyContact.create({ ...contactData, studentId: student.id }, { transaction: t });
});
```

#### Step 11: Convert Count Operations

```typescript
// BEFORE
const total = await prisma.student.count({ where: whereClause });

// AFTER
const total = await Student.count({ where: whereClause });
```

#### Step 12: Convert findAndCountAll

```typescript
// BEFORE
const [students, total] = await Promise.all([
  prisma.student.findMany({ where, skip, take }),
  prisma.student.count({ where })
]);

// AFTER
const { rows: students, count: total } = await Student.findAndCountAll({
  where,
  offset,
  limit
});
```

#### Step 13: Convert GroupBy

```typescript
// BEFORE
const byRole = await prisma.user.groupBy({
  by: ['role'],
  _count: { role: true }
});
// Returns: [{ role: 'NURSE', _count: { role: 5 } }, ...]

// AFTER
const byRole = await User.findAll({
  attributes: [
    'role',
    [sequelize.fn('COUNT', sequelize.col('role')), 'count']
  ],
  group: ['role'],
  raw: true
});
// Returns: [{ role: 'NURSE', count: 5 }, ...]
```

#### Step 14: Convert Distinct

```typescript
// BEFORE
const forms = await prisma.medication.findMany({
  select: { dosageForm: true },
  distinct: ['dosageForm']
});

// AFTER
const forms = await Medication.findAll({
  attributes: [[sequelize.fn('DISTINCT', sequelize.col('dosageForm')), 'dosageForm']],
  raw: true
});
```

#### Step 15: JSON Field Operations

```typescript
// BEFORE - Check if JSON field has a key
where: {
  vital: {
    path: ['height'],
    not: Prisma.JsonNull
  }
}

// AFTER
where: {
  'vital.height': { [Op.ne]: null }
}
// OR
where: sequelize.where(
  sequelize.json('vital.height'),
  Op.ne,
  null
)
```

#### Step 16: Nested Where Clauses

```typescript
// BEFORE
where: {
  studentMedication: {
    studentId: studentId
  }
}

// AFTER
where: {
  '$studentMedication.studentId$': studentId
}
// OR use include with required: true
include: [{
  model: StudentMedication,
  as: 'studentMedication',
  where: { studentId },
  required: true
}]
```

---

## Common Gotchas

### 1. Association Names Must Match
```typescript
// In model definition:
Student.belongsTo(User, { as: 'nurse', foreignKey: 'nurseId' });

// In query, MUST use same 'as' name:
include: [{ model: User, as: 'nurse' }]  // ✅ Correct
include: [{ model: User, as: 'user' }]   // ❌ Wrong - will crash
```

### 2. Order Syntax
```typescript
// Simple order
order: [['lastName', 'ASC']]  // ✅ Correct
order: [['lastName', 'asc']]  // ✅ Also works (case-insensitive)
orderBy: { lastName: 'asc' }  // ❌ Wrong - Prisma syntax

// Nested order (through association)
order: [[{ model: Student, as: 'student' }, 'lastName', 'ASC']]  // ✅ Correct
orderBy: { student: { lastName: 'asc' } }  // ❌ Wrong - Prisma syntax
```

### 3. Attributes Exclusion
```typescript
// Include all except password
attributes: { exclude: ['password'] }  // ✅ Correct

// Include only specific fields
attributes: ['id', 'email', 'firstName']  // ✅ Correct
```

### 4. Soft Deletes
If your model has `paranoid: true` (soft deletes enabled):
```typescript
// Soft delete (sets deletedAt timestamp)
await record.destroy();

// Hard delete (permanent)
await record.destroy({ force: true });

// Include deleted records in query
await Model.findAll({ paranoid: false });
```

### 5. Raw Queries
```typescript
// BEFORE
const result = await prisma.$queryRaw`
  SELECT * FROM students WHERE grade = ${grade}
`;

// AFTER
const [results, metadata] = await sequelize.query(
  'SELECT * FROM students WHERE grade = :grade',
  {
    replacements: { grade },
    type: sequelize.QueryTypes.SELECT
  }
);
```

---

## Validation Checklist

After migrating each service, verify:

- [ ] No Prisma imports remain
- [ ] All `prisma.model.method()` calls converted
- [ ] All `skip/take` converted to `offset/limit`
- [ ] All `contains` converted to `[Op.iLike]`
- [ ] All `orderBy` converted to `order`
- [ ] All `select` converted to `attributes`
- [ ] All `include` properly structured with `as` names
- [ ] All operators use `[Op.operator]` syntax
- [ ] Transactions use `sequelize.transaction()`
- [ ] Error handling preserved
- [ ] Logging statements preserved
- [ ] TypeScript compiles without errors
- [ ] No business logic changed

---

## Testing Commands

```bash
# TypeScript compilation
npx tsc --noEmit

# Find remaining Prisma references
grep -r "from '@prisma/client'" backend/src/services/
grep -r "prisma\." backend/src/services/ | grep -v node_modules

# Run linter
npm run lint

# Run tests (after migration complete)
npm test
```

---

## Quick Reference Card

| Task | Prisma | Sequelize |
|------|--------|-----------|
| Find by ID | `prisma.user.findUnique({ where: { id } })` | `User.findByPk(id)` |
| Find one | `prisma.user.findFirst({ where })` | `User.findOne({ where })` |
| Find many | `prisma.user.findMany({ where })` | `User.findAll({ where })` |
| Create | `prisma.user.create({ data })` | `User.create(data)` |
| Update | `prisma.user.update({ where, data })` | `user.update(data)` |
| Delete | `prisma.user.delete({ where })` | `user.destroy()` |
| Count | `prisma.user.count({ where })` | `User.count({ where })` |
| Transaction | `prisma.$transaction(fn)` | `sequelize.transaction(fn)` |
| Pagination | `skip: n, take: m` | `offset: n, limit: m` |
| Order | `orderBy: { field: 'asc' }` | `order: [['field', 'ASC']]` |
| Include | `include: { model: {...} }` | `include: [{ model: Model, as: 'alias' }]` |
| Select | `select: { id: true }` | `attributes: ['id']` |
| Like search | `{ contains: 'x', mode: 'insensitive' }` | `{ [Op.iLike]: '%x%' }` |
| Greater than | `{ gt: 5 }` | `{ [Op.gt]: 5 }` |
| In array | `{ in: [1,2] }` | `{ [Op.in]: [1,2] }` |
| OR condition | `{ OR: [...] }` | `{ [Op.or]: [...] }` |

---

**Use this guide as you migrate each service file!**
