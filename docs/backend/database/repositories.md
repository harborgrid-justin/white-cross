# Repository Layer Documentation

## Overview

The repository layer provides enterprise-grade data access abstraction for the White Cross Healthcare Platform. It implements the Repository Pattern to separate business logic from data access logic, enabling easier testing, ORM migration, and maintenance.

## Architecture

```
repositories/
├── base/
│   └── BaseRepository.ts          # Abstract base repository for Sequelize
├── interfaces/
│   ├── IRepository.ts             # Generic repository interface
│   ├── IStudentRepository.ts      # Student-specific repository interface
│   ├── IHealthRecordRepository.ts # Health record repository interface
│   ├── IAllergyRepository.ts      # Allergy repository interface
│   ├── IAuditLogRepository.ts     # Audit log repository interface
│   └── ...                        # Other entity interfaces
├── impl/
│   ├── StudentRepository.ts       # Student repository implementation
│   ├── UserRepository.ts          # User repository implementation
│   ├── HealthRecordRepository.ts  # Health record repository implementation
│   ├── AllergyRepository.ts       # Allergy repository implementation
│   ├── MedicationRepository.ts    # Medication repository implementation
│   ├── AuditLogRepository.ts      # Audit log repository implementation
│   ├── AppointmentRepository.ts   # Appointment repository implementation
│   ├── DistrictRepository.ts      # District repository implementation
│   ├── SchoolRepository.ts        # School repository implementation
│   └── ...                        # Other repository implementations
├── RepositoryFactory.ts           # Dependency injection factory
├── index.ts                       # Central export point
└── README.md                      # This file
```

## Key Features

### 1. **Enterprise Patterns**
- **Repository Pattern**: Abstraction over ORM
- **Factory Pattern**: Centralized dependency injection
- **Singleton Pattern**: Shared audit logger and cache manager

### 2. **HIPAA Compliance**
- Automatic PHI access logging via audit logger
- Sensitive data sanitization for audit trails
- Field-level redaction of passwords, SSN, etc.

### 3. **Performance Optimization**
- Redis caching with configurable TTL
- Entity-specific cache strategies
- Automatic cache invalidation on mutations

### 4. **Transaction Support**
- Automatic transaction wrapping for mutations
- Transaction rollback on errors
- Nested transaction support

### 5. **Type Safety**
- Full TypeScript type coverage
- Generic base repository with type inference
- Compile-time type checking

### 6. **Error Handling**
- Custom RepositoryError with error codes
- Detailed error context for debugging
- Graceful error recovery

## Usage Examples

### Basic CRUD Operations

```typescript
import { createRepositoryFactory } from '@/database/repositories';
import { createExecutionContext } from '@/database/types/ExecutionContext';

// Initialize factory
const factory = createRepositoryFactory(auditLogger, cacheManager);
const studentRepo = factory.getStudentRepository();

// Create execution context
const context = createExecutionContext(
  userId,
  userRole,
  { ip: req.ip, headers: req.headers }
);

// Create student
const student = await studentRepo.create({
  studentNumber: 'STU-12345',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new Date('2010-05-15'),
  grade: '8',
  gender: 'MALE'
}, context);

// Find by ID
const foundStudent = await studentRepo.findById(student.id);

// Find by student number
const byNumber = await studentRepo.findByStudentNumber('STU-12345');

// Search students
const searchResults = await studentRepo.search('john');

// Update student
const updated = await studentRepo.update(student.id, {
  grade: '9'
}, context);

// Soft delete (set isActive = false)
await studentRepo.softDelete(student.id, context);
```

### Advanced Queries

```typescript
// Paginated query with filters
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
      nurse: true,
      emergencyContacts: true
    }
  }
);

console.log(result.data); // Student array
console.log(result.pagination); // { page: 1, limit: 20, total: 150, pages: 8 }
```

### Healthcare-Specific Queries

```typescript
const healthRecordRepo = factory.getHealthRecordRepository();

// Get health summary for student
const summary = await healthRecordRepo.getHealthSummary(studentId);
console.log(summary.allergies);
console.log(summary.chronicConditions);
console.log(summary.recentVitals);
console.log(summary.recordCounts);

// Find vaccination records
const vaccinations = await healthRecordRepo.getVaccinationRecords(studentId);

// Find vital signs history
const vitals = await healthRecordRepo.findVitalSignsHistory(studentId, 10);

// Search health records
const searchResults = await healthRecordRepo.searchRecords({
  query: 'annual checkup',
  type: 'CHECKUP',
  studentIds: [studentId]
});
```

### Bulk Operations

```typescript
// Bulk create students
const students = await studentRepo.bulkCreate([
  { studentNumber: 'STU-001', firstName: 'Alice', ... },
  { studentNumber: 'STU-002', firstName: 'Bob', ... },
  { studentNumber: 'STU-003', firstName: 'Charlie', ... }
], context);

// Bulk assign to nurse
await studentRepo.bulkAssignToNurse(
  ['student-id-1', 'student-id-2', 'student-id-3'],
  'nurse-id',
  context
);
```

### Transaction Management

```typescript
// Transactions are handled automatically in CRUD operations
// For custom complex operations, use executeInTransaction:

const result = await studentRepo.executeInTransaction(async (transaction) => {
  // Create student
  const student = await Student.create({ ... }, { transaction });

  // Create emergency contacts
  await EmergencyContact.bulkCreate([...], { transaction });

  // Create health records
  await HealthRecord.create({ ... }, { transaction });

  return student;
}, context);
```

### Audit Logging

All repository operations automatically log to the audit trail:

```typescript
// Create operation
await studentRepo.create(data, context);
// Logs: { action: 'CREATE', entityType: 'Student', entityId: 'xyz', ... }

// Update operation
await studentRepo.update(id, data, context);
// Logs: { action: 'UPDATE', entityType: 'Student', changes: { grade: { before: '8', after: '9' } } }

// Delete operation
await studentRepo.delete(id, context);
// Logs: { action: 'DELETE', entityType: 'Student', entityId: 'xyz', ... }

// Bulk operations
await studentRepo.bulkCreate([...], context);
// Logs: { action: 'BULK_CREATE', entityType: 'Student', metadata: { count: 10 } }
```

### Caching

```typescript
// Caching is automatic based on entity type
// Override shouldCache() in repository to customize

// Manual cache invalidation
await studentRepo.invalidateCaches(student);

// Cache with custom TTL
const student = await studentRepo.findById(id, {
  cacheTTL: 3600 // 1 hour
});
```

## Testing

### Mock Repository Factory

```typescript
import { RepositoryFactory } from '@/database/repositories';

// Create mock implementations
const mockStudentRepo = {
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

// Use in tests
describe('StudentService', () => {
  it('should create student', async () => {
    mockStudentRepo.create.mockResolvedValue({ id: '123', ... });

    const service = new StudentService(mockStudentRepo);
    const result = await service.createStudent(...);

    expect(result).toBeDefined();
    expect(mockStudentRepo.create).toHaveBeenCalled();
  });
});
```

## Best Practices

### 1. **Always Use Execution Context**
```typescript
// Good
await studentRepo.create(data, context);

// Bad - missing audit trail
await studentRepo.create(data, null as any);
```

### 2. **Handle Repository Errors**
```typescript
try {
  const student = await studentRepo.findById(id);
} catch (error) {
  if (error instanceof RepositoryError) {
    console.error(`Error [${error.code}]:`, error.message);
    console.error('Details:', error.details);
  }
  throw error;
}
```

### 3. **Use Interfaces, Not Implementations**
```typescript
// Good
class StudentService {
  constructor(private studentRepo: IStudentRepository) {}
}

// Bad - tight coupling
class StudentService {
  constructor(private studentRepo: StudentRepository) {}
}
```

### 4. **Leverage Type Safety**
```typescript
// TypeScript will catch errors at compile time
const student = await studentRepo.findById(id);
console.log(student.firstName); // ✓ Type-safe
console.log(student.invalidField); // ✗ Compile error
```

### 5. **Sanitize PHI Data**
```typescript
// Override sanitizeForAudit for sensitive entities
protected sanitizeForAudit(data: any): any {
  const { ssn, password, ...safe } = data;
  return sanitizeSensitiveData(safe);
}
```

## Performance Considerations

### Caching Strategy
- **Student, User, District, School**: Long TTL (30 min)
- **HealthRecord, Appointment**: Short TTL (5 min) or no cache
- **AuditLog**: Never cached
- **Medication**: Long TTL (1 hour) - relatively static

### Query Optimization
- Use `select` to limit returned fields
- Use `include` sparingly - only fetch needed relations
- Leverage database indexes (defined in models)
- Use pagination for large result sets

### Transaction Guidelines
- Keep transactions short-lived
- Avoid long-running operations in transactions
- Handle transaction timeouts gracefully

## Error Codes

Common repository error codes:

- `FIND_ERROR`: Error finding entity
- `FIND_MANY_ERROR`: Error finding multiple entities
- `CREATE_ERROR`: Error creating entity
- `UPDATE_ERROR`: Error updating entity
- `DELETE_ERROR`: Error deleting entity
- `NOT_FOUND`: Entity not found (404)
- `DUPLICATE_*`: Unique constraint violation (409)
- `VALIDATION_ERROR`: Data validation failed (400)
- `UNAUTHORIZED`: Access denied (403)

## Migration Guide

### From Direct Sequelize Usage

**Before:**
```typescript
const student = await Student.findByPk(id);
await student.update({ grade: '9' });
```

**After:**
```typescript
const studentRepo = factory.getStudentRepository();
const student = await studentRepo.findById(id);
await studentRepo.update(id, { grade: '9' }, context);
```

**Benefits:**
- Automatic audit logging
- Cache management
- Transaction handling
- Type safety
- Error handling

## Future Enhancements

- [ ] Add ChronicConditionRepository
- [ ] Add StudentMedicationRepository
- [ ] Add EmergencyContactRepository
- [ ] Add IncidentReportRepository
- [ ] Add InventoryItemRepository
- [ ] Add DocumentRepository
- [ ] Implement read replicas for scaling
- [ ] Add query result caching
- [ ] Implement soft delete support across all entities
- [ ] Add batch operation support
- [ ] Implement optimistic locking
- [ ] Add GraphQL DataLoader integration

## Support

For questions or issues with the repository layer, contact the platform architecture team or open an issue in the project repository.
