# Repository Layer - Quick Reference Guide

## Setup

### Initialize Repository Factory

```typescript
import { createRepositoryFactory } from '@/database/repositories';
import { AuditLogger } from '@/database/audit/AuditLogger'; // Your implementation
import { CacheManager } from '@/database/cache/CacheManager'; // Your implementation

// Create instances (typically in app.ts)
const auditLogger = new AuditLogger();
const cacheManager = new CacheManager();

// Create factory
const repositoryFactory = createRepositoryFactory(auditLogger, cacheManager);

// Export for use across the application
export { repositoryFactory };
```

### Use in Service Layer

```typescript
import { repositoryFactory } from '@/app';
import { IStudentRepository } from '@/database/repositories';

class StudentService {
  private studentRepo: IStudentRepository;

  constructor() {
    this.studentRepo = repositoryFactory.getStudentRepository();
  }

  async getStudentById(id: string) {
    return await this.studentRepo.findById(id);
  }
}
```

## Common Operations

### Create Entity

```typescript
import { createExecutionContext } from '@/database/types/ExecutionContext';

const context = createExecutionContext(
  req.user.id,
  req.user.role,
  { ip: req.ip, headers: req.headers }
);

const student = await studentRepo.create({
  studentNumber: 'STU-12345',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new Date('2010-05-15'),
  grade: '8',
  gender: 'MALE'
}, context);

// Automatically logs to audit trail:
// { action: 'CREATE', entityType: 'Student', entityId: 'xyz', userId: '...', ... }
```

### Find by ID

```typescript
const student = await studentRepo.findById('student-id-123');

if (!student) {
  throw new Error('Student not found');
}

console.log(student.firstName); // Type-safe access
```

### Find with Pagination

```typescript
const result = await studentRepo.findMany(
  {
    where: {
      grade: '10',
      isActive: true
    },
    orderBy: { lastName: 'asc' },
    pagination: {
      page: 1,
      limit: 20
    }
  },
  {
    include: {
      emergencyContacts: true
    }
  }
);

console.log(result.data); // Student[]
console.log(result.pagination);
// {
//   page: 1,
//   limit: 20,
//   total: 150,
//   pages: 8,
//   hasNext: true,
//   hasPrevious: false
// }
```

### Update Entity

```typescript
const updatedStudent = await studentRepo.update(
  'student-id-123',
  {
    grade: '9',
    nurseId: 'nurse-id-456'
  },
  context
);

// Automatically logs changes:
// {
//   action: 'UPDATE',
//   entityType: 'Student',
//   changes: {
//     grade: { before: '8', after: '9' },
//     nurseId: { before: null, after: 'nurse-id-456' }
//   }
// }
```

### Soft Delete

```typescript
await studentRepo.softDelete('student-id-123', context);
// Sets isActive = false (or deletedAt = now)
```

### Hard Delete

```typescript
await studentRepo.delete('student-id-123', context);
// Permanently removes from database
```

### Check Existence

```typescript
const exists = await studentRepo.exists({
  studentNumber: 'STU-12345'
});

if (exists) {
  throw new Error('Student number already in use');
}
```

### Count Records

```typescript
const activeCount = await studentRepo.count({
  isActive: true,
  grade: '10'
});

console.log(`${activeCount} active 10th graders`);
```

### Bulk Create

```typescript
const students = await studentRepo.bulkCreate([
  { studentNumber: 'STU-001', firstName: 'Alice', ... },
  { studentNumber: 'STU-002', firstName: 'Bob', ... },
  { studentNumber: 'STU-003', firstName: 'Charlie', ... }
], context);

console.log(`Created ${students.length} students`);
```

## Repository-Specific Methods

### StudentRepository

```typescript
const studentRepo = repositoryFactory.getStudentRepository();

// Find by student number
const student = await studentRepo.findByStudentNumber('STU-12345');

// Find by medical record number
const student = await studentRepo.findByMedicalRecordNumber('MRN-67890');

// Find by grade
const tenthGraders = await studentRepo.findByGrade('10');

// Search students
const results = await studentRepo.search('john'); // Searches name and numbers

// Find by nurse
const nurseStudents = await studentRepo.findByNurse('nurse-id-123');

// Bulk assign to nurse
await studentRepo.bulkAssignToNurse(
  ['student-1', 'student-2', 'student-3'],
  'nurse-id-456',
  context
);

// Get active count
const count = await studentRepo.getActiveCount();
```

### UserRepository

```typescript
const userRepo = repositoryFactory.getUserRepository();

// Find by email (for login)
const user = await userRepo.findByEmail('nurse@school.edu');
// Returns user WITH password hash for authentication

// Find by role
const nurses = await userRepo.findByRole('NURSE');
// Returns users WITHOUT passwords

// Find by school
const schoolUsers = await userRepo.findBySchool('school-id-123');

// Find by district
const districtUsers = await userRepo.findByDistrict('district-id-456');

// Update last login
await userRepo.updateLastLogin('user-id-789');

// Search users
const results = await userRepo.search('smith'); // Searches name and email

// Get nurses for assignment
const nurses = await userRepo.getNurses('school-id-123');
```

### HealthRecordRepository

```typescript
const healthRecordRepo = repositoryFactory.getHealthRecordRepository();

// Find by student with filters
const records = await healthRecordRepo.findByStudentId(
  'student-id-123',
  {
    type: 'CHECKUP',
    dateFrom: new Date('2024-01-01'),
    dateTo: new Date('2024-12-31'),
    provider: 'Dr. Smith'
  }
);

// Find by type
const vaccinations = await healthRecordRepo.findByType(
  'VACCINATION',
  {
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31')
  }
);

// Get vital signs history
const vitals = await healthRecordRepo.findVitalSignsHistory(
  'student-id-123',
  10 // last 10 records
);

console.log(vitals);
// [
//   {
//     date: Date,
//     vitals: { temperature: 98.6, heartRate: 72, ... },
//     recordType: 'CHECKUP',
//     provider: 'Nurse Johnson'
//   },
//   ...
// ]

// Search health records
const results = await healthRecordRepo.searchRecords({
  query: 'annual checkup',
  type: 'CHECKUP',
  studentIds: ['student-1', 'student-2']
});

// Count by type
const counts = await healthRecordRepo.countByType('student-id-123');
console.log(counts);
// {
//   CHECKUP: 5,
//   VACCINATION: 12,
//   ILLNESS: 3,
//   INJURY: 1,
//   ...
// }

// Get comprehensive health summary
const summary = await healthRecordRepo.getHealthSummary('student-id-123');
console.log(summary);
// {
//   student: { id, firstName, lastName, ... },
//   allergies: [...],
//   chronicConditions: [...],
//   recentVitals: [...],
//   recentVaccinations: [...],
//   recordCounts: { CHECKUP: 5, ... },
//   lastCheckup: Date,
//   upcomingReviews: [...]
// }

// Get vaccination records
const vaccinations = await healthRecordRepo.getVaccinationRecords('student-id-123');

// Bulk delete
const result = await healthRecordRepo.bulkDelete(
  ['record-1', 'record-2', 'record-3'],
  context
);
console.log(`Deleted ${result.deleted}, not found ${result.notFound}`);
```

### AllergyRepository

```typescript
const allergyRepo = repositoryFactory.getAllergyRepository();

// Find by student
const allergies = await allergyRepo.findByStudentId('student-id-123');

// Find by severity
const severe = await allergyRepo.findBySeverity('SEVERE');
const lifeThreadening = await allergyRepo.findBySeverity('LIFE_THREATENING');

// Check duplicate
const isDuplicate = await allergyRepo.checkDuplicateAllergen(
  'student-id-123',
  'Peanuts'
);
```

### MedicationRepository

```typescript
const medicationRepo = repositoryFactory.getMedicationRepository();

// Find by name (searches brand and generic)
const medications = await medicationRepo.findByName('ibuprofen');

// Find controlled substances
const controlled = await medicationRepo.findControlledSubstances();

// Find by NDC
const medication = await medicationRepo.findByNDC('12345-678-90');
```

### AuditLogRepository

```typescript
const auditLogRepo = repositoryFactory.getAuditLogRepository();

// Find by entity (all changes to a specific record)
const logs = await auditLogRepo.findByEntity('Student', 'student-id-123');

// Find by user (user activity)
const userLogs = await auditLogRepo.findByUser('user-id-456', 100);

// Find by action
const creates = await auditLogRepo.findByAction('CREATE', 100);
const updates = await auditLogRepo.findByAction('UPDATE', 100);
const deletes = await auditLogRepo.findByAction('DELETE', 100);

// Find by date range
const logs = await auditLogRepo.findByDateRange(
  new Date('2024-01-01'),
  new Date('2024-12-31'),
  {
    entityType: 'HealthRecord',
    userId: 'user-id-789',
    action: 'READ'
  }
);

// Batch insert (for performance)
await auditLogRepo.createMany([
  { userId: 'user-1', action: 'READ', ... },
  { userId: 'user-2', action: 'READ', ... },
  ...
]);
```

### AppointmentRepository

```typescript
const appointmentRepo = repositoryFactory.getAppointmentRepository();

// Find by student
const appointments = await appointmentRepo.findByStudent('student-id-123');

// Find by nurse
const nurseAppts = await appointmentRepo.findByNurse(
  'nurse-id-456',
  new Date('2024-10-01'),
  new Date('2024-10-31')
);

// Find upcoming appointments
const upcoming = await appointmentRepo.findUpcoming('nurse-id-456', 7); // next 7 days
const allUpcoming = await appointmentRepo.findUpcoming(); // all nurses
```

### DistrictRepository

```typescript
const districtRepo = repositoryFactory.getDistrictRepository();

// Find by code
const district = await districtRepo.findByCode('DIST-001');

// Find active districts
const active = await districtRepo.findActive();

// Search districts
const results = await districtRepo.search('unified');
```

### SchoolRepository

```typescript
const schoolRepo = repositoryFactory.getSchoolRepository();

// Find by district
const schools = await schoolRepo.findByDistrict('district-id-123');

// Find by code
const school = await schoolRepo.findByCode('SCH-001');

// Search schools
const results = await schoolRepo.search('high', 'district-id-123');
```

## Error Handling

```typescript
import { RepositoryError } from '@/database/repositories';

try {
  const student = await studentRepo.findById(id);
} catch (error) {
  if (error instanceof RepositoryError) {
    console.error(`Repository Error [${error.code}]:`, error.message);
    console.error('Status Code:', error.statusCode);
    console.error('Details:', error.details);

    // Handle specific errors
    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (error.code === 'DUPLICATE_STUDENT_NUMBER') {
      return res.status(409).json({ message: 'Student number already exists' });
    }

    // Generic error
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code
    });
  }

  // Unknown error
  throw error;
}
```

## Transaction Usage

```typescript
// Transactions are handled automatically in CRUD operations
// For complex multi-entity operations:

const result = await studentRepo.executeInTransaction(async (transaction) => {
  // Create student
  const student = await Student.create(
    { studentNumber: 'STU-001', ... },
    { transaction }
  );

  // Create emergency contacts
  await EmergencyContact.bulkCreate([
    { studentId: student.id, name: 'Parent 1', ... },
    { studentId: student.id, name: 'Parent 2', ... }
  ], { transaction });

  // Create health records
  await HealthRecord.create(
    { studentId: student.id, type: 'INITIAL_CHECKUP', ... },
    { transaction }
  );

  return student;
}, context);

// All operations committed together, or all rolled back on error
```

## Testing with Mocks

```typescript
import { IStudentRepository } from '@/database/repositories';

describe('StudentService', () => {
  let mockStudentRepo: jest.Mocked<IStudentRepository>;
  let service: StudentService;

  beforeEach(() => {
    mockStudentRepo = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      exists: jest.fn(),
      // ... other methods
    } as any;

    service = new StudentService(mockStudentRepo);
  });

  it('should create student', async () => {
    const studentData = {
      studentNumber: 'STU-001',
      firstName: 'John',
      lastName: 'Doe',
      ...
    };

    mockStudentRepo.create.mockResolvedValue({
      id: '123',
      ...studentData
    } as any);

    const result = await service.createStudent(studentData);

    expect(result).toBeDefined();
    expect(result.id).toBe('123');
    expect(mockStudentRepo.create).toHaveBeenCalledWith(
      studentData,
      expect.any(Object) // execution context
    );
  });
});
```

## Common Patterns

### Pattern: Service Layer with Repository

```typescript
class StudentService {
  constructor(
    private studentRepo: IStudentRepository,
    private healthRecordRepo: IHealthRecordRepository,
    private allergyRepo: IAllergyRepository
  ) {}

  async getStudentHealthProfile(studentId: string) {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const [allergies, healthRecords, vitals] = await Promise.all([
      this.allergyRepo.findByStudentId(studentId),
      this.healthRecordRepo.findByStudentId(studentId, {
        dateFrom: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
      }),
      this.healthRecordRepo.findVitalSignsHistory(studentId, 5)
    ]);

    return {
      student,
      allergies,
      healthRecords,
      recentVitals: vitals
    };
  }
}
```

### Pattern: Controller with Repository Factory

```typescript
class StudentController {
  private studentRepo: IStudentRepository;

  constructor() {
    this.studentRepo = repositoryFactory.getStudentRepository();
  }

  async getStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const student = await this.studentRepo.findById(id);

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.json(student);
    } catch (error) {
      if (error instanceof RepositoryError) {
        return res.status(error.statusCode).json({
          message: error.message,
          code: error.code
        });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async createStudent(req: Request, res: Response) {
    try {
      const context = createExecutionContext(
        req.user.id,
        req.user.role,
        { ip: req.ip, headers: req.headers }
      );

      const student = await this.studentRepo.create(req.body, context);
      res.status(201).json(student);
    } catch (error) {
      if (error instanceof RepositoryError) {
        return res.status(error.statusCode).json({
          message: error.message,
          code: error.code
        });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
```

## Key Files Reference

| File | Location | Purpose |
|------|----------|---------|
| BaseRepository | `backend/src/database/repositories/base/BaseRepository.ts` | Generic base repository |
| StudentRepository | `backend/src/database/repositories/impl/StudentRepository.ts` | Student data access |
| UserRepository | `backend/src/database/repositories/impl/UserRepository.ts` | User/auth data access |
| HealthRecordRepository | `backend/src/database/repositories/impl/HealthRecordRepository.ts` | Health records access |
| RepositoryFactory | `backend/src/database/repositories/RepositoryFactory.ts` | DI factory |
| Index | `backend/src/database/repositories/index.ts` | Central exports |
| Documentation | `backend/src/database/repositories/README.md` | Full documentation |

## Need Help?

1. Check the README.md in the repositories directory
2. Review the interface definitions in `interfaces/`
3. Look at the implementation examples in `impl/`
4. Review the BaseRepository for common patterns
5. Check the REPOSITORY_IMPLEMENTATION_SUMMARY.md for architecture overview

---

**Quick Start:** Initialize factory → Get repository → Create context → Call methods
