# Database Infrastructure Module

Comprehensive database infrastructure providing enterprise-grade data access patterns with HIPAA compliance, caching, audit logging, and transaction management.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Core Components](#core-components)
- [Getting Started](#getting-started)
- [Repository Pattern](#repository-pattern)
- [Unit of Work](#unit-of-work)
- [Cache Management](#cache-management)
- [Audit Logging](#audit-logging)
- [Migration Guide](#migration-guide)
- [Examples](#examples)

## Overview

This database module provides:

- **Repository Pattern**: Clean separation between data access and business logic with 70+ domain repositories
- **Unit of Work**: Transaction management for atomic multi-entity operations
- **Cache Layer**: In-memory and Redis caching with PHI-aware TTL configuration
- **Audit Logging**: HIPAA-compliant audit trail for all PHI access and modifications
- **Type Safety**: Full TypeScript support with strong typing throughout
- **Query Builder**: Flexible query interface with pagination, filtering, and sorting
- **Transaction Support**: ACID-compliant transactions with automatic rollback

## Architecture

```
database/
├── types/                          # Type definitions
│   ├── execution-context.interface.ts
│   ├── query.types.ts
│   ├── database.enums.ts
│   └── index.ts
├── interfaces/                     # Service interfaces
│   ├── cache/
│   │   └── cache-manager.interface.ts
│   └── audit/
│       └── audit-logger.interface.ts
├── services/                       # Service implementations
│   ├── cache.service.ts           # Injectable cache service
│   └── audit.service.ts           # Injectable audit service
├── repositories/                   # Repository pattern
│   ├── base/
│   │   └── base.repository.ts    # Abstract base repository
│   ├── interfaces/
│   │   ├── repository.interface.ts
│   │   └── student.repository.interface.ts
│   └── impl/
│       └── student.repository.ts  # Sample implementation
├── uow/                           # Unit of Work pattern
│   ├── unit-of-work.interface.ts
│   └── sequelize-unit-of-work.service.ts
├── database.module.ts             # Main module
└── index.ts                       # Barrel exports
```

## Core Components

### 1. Base Repository

All repositories extend `BaseRepository` which provides:

- CRUD operations (create, read, update, delete)
- Query operations (findById, findMany, exists)
- Bulk operations (bulkCreate)
- Automatic audit logging
- Cache management
- Transaction support
- Validation hooks
- Error handling

### 2. Cache Manager

Provides caching with:

- Configurable TTL per entity type
- Pattern-based invalidation
- PHI-aware caching policies
- Redis and in-memory support
- Cache statistics tracking

### 3. Audit Logger

HIPAA-compliant audit logging:

- All PHI access logged
- Before/after change tracking
- User, IP, and timestamp capture
- Bulk operation tracking
- Export and transaction logging
- Sensitive data sanitization

### 4. Unit of Work

Transaction management:

- ACID transaction support
- Automatic commit/rollback
- Nested transaction support
- Transaction isolation levels
- Audit trail for transactions

## Getting Started

### 1. Import the Module

The DatabaseModule is marked as `@Global()`, so it's automatically available throughout your application:

```typescript
// In app.module.ts
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    // ... other modules
  ],
})
export class AppModule {}
```

### 2. Inject Services

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { ICacheManager } from './database/interfaces/cache/cache-manager.interface';
import { IAuditLogger } from './database/interfaces/audit/audit-logger.interface';

@Injectable()
export class YourService {
  constructor(
    @Inject('ICacheManager') private cacheManager: ICacheManager,
    @Inject('IAuditLogger') private auditLogger: IAuditLogger
  ) {}
}
```

### 3. Use Repositories

```typescript
import { Injectable } from '@nestjs/common';
import { StudentRepository } from './database/repositories/impl/student.repository';
import { ExecutionContext } from './database/types';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async getStudent(id: string) {
    return await this.studentRepository.findById(id);
  }

  async createStudent(data: CreateStudentDTO, context: ExecutionContext) {
    return await this.studentRepository.create(data, context);
  }
}
```

## Repository Pattern

### Creating a Repository

#### Step 1: Define the Interface

```typescript
// repositories/interfaces/health-record.repository.interface.ts
import { IRepository } from './repository.interface';

export interface HealthRecordAttributes {
  id: string;
  studentId: string;
  recordType: string;
  diagnosis: string;
  // ... other fields
}

export interface CreateHealthRecordDTO {
  studentId: string;
  recordType: string;
  diagnosis: string;
}

export interface UpdateHealthRecordDTO {
  diagnosis?: string;
  // ... other updatable fields
}

export interface IHealthRecordRepository
  extends IRepository<HealthRecordAttributes, CreateHealthRecordDTO, UpdateHealthRecordDTO> {
  // Domain-specific methods
  findByStudent(studentId: string): Promise<HealthRecordAttributes[]>;
  findByRecordType(recordType: string): Promise<HealthRecordAttributes[]>;
}
```

#### Step 2: Implement the Repository

```typescript
// repositories/impl/health-record.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '../base/base.repository';
import { IHealthRecordRepository } from '../interfaces/health-record.repository.interface';
import { IAuditLogger, sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager } from '../../interfaces/cache/cache-manager.interface';

@Injectable()
export class HealthRecordRepository
  extends BaseRepository<any, HealthRecordAttributes, CreateHealthRecordDTO>
  implements IHealthRecordRepository
{
  constructor(
    @InjectModel('HealthRecord') model: any,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(model, auditLogger, cacheManager, 'HealthRecord');
  }

  async findByStudent(studentId: string): Promise<HealthRecordAttributes[]> {
    const records = await this.model.findAll({
      where: { studentId },
      order: [['createdAt', 'DESC']]
    });
    return records.map((r: any) => this.mapToEntity(r));
  }

  async findByRecordType(recordType: string): Promise<HealthRecordAttributes[]> {
    const records = await this.model.findAll({
      where: { recordType }
    });
    return records.map((r: any) => this.mapToEntity(r));
  }

  protected async invalidateCaches(entity: any): Promise<void> {
    const data = entity.get();
    await this.cacheManager.delete(
      this.cacheKeyBuilder.entity(this.entityName, data.id)
    );
    await this.cacheManager.deletePattern(
      `white-cross:healthrecord:student:${data.studentId}:*`
    );
  }

  protected sanitizeForAudit(data: any): any {
    return sanitizeSensitiveData(data);
  }
}
```

#### Step 3: Register in Module

```typescript
// database.module.ts
@Module({
  providers: [
    // ... existing providers
    HealthRecordRepository,
  ],
  exports: [
    // ... existing exports
    HealthRecordRepository,
  ]
})
export class DatabaseModule {}
```

## Unit of Work

Use Unit of Work for multi-entity transactions:

```typescript
import { Inject } from '@nestjs/common';
import { IUnitOfWork } from './database/uow/unit-of-work.interface';
import { ExecutionContext } from './database/types';

@Injectable()
export class StudentTransferService {
  constructor(
    @Inject('IUnitOfWork') private readonly unitOfWork: IUnitOfWork,
    private readonly studentRepository: StudentRepository,
    private readonly healthRecordRepository: HealthRecordRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async transferStudent(
    studentId: string,
    newSchoolId: string,
    context: ExecutionContext
  ) {
    return await this.unitOfWork.executeInTransaction(async (uow) => {
      // Update student
      const student = await this.studentRepository.update(
        studentId,
        { schoolId: newSchoolId },
        context
      );

      // Create transfer record
      await this.healthRecordRepository.create(
        {
          studentId,
          recordType: 'TRANSFER',
          notes: `Transferred to school ${newSchoolId}`
        },
        context
      );

      // Log the transfer
      await this.auditLogRepository.create(
        {
          action: 'TRANSFER',
          entityType: 'Student',
          entityId: studentId,
          metadata: { newSchoolId }
        },
        context
      );

      return student;
    }, context);
    // Transaction automatically committed if no errors
    // Automatically rolled back if any operation throws
  }
}
```

## Cache Management

### Using the Cache Service

```typescript
import { Inject } from '@nestjs/common';
import { ICacheManager } from './database/interfaces/cache/cache-manager.interface';
import { CacheTTL } from './database/types/database.enums';

@Injectable()
export class CacheExample {
  constructor(
    @Inject('ICacheManager') private readonly cacheManager: ICacheManager
  ) {}

  async cacheExample() {
    // Set value with TTL
    await this.cacheManager.set('my-key', { data: 'value' }, CacheTTL.MEDIUM);

    // Get value
    const cached = await this.cacheManager.get<{ data: string }>('my-key');

    // Delete specific key
    await this.cacheManager.delete('my-key');

    // Delete pattern
    await this.cacheManager.deletePattern('student:*');

    // Check existence
    const exists = await this.cacheManager.exists('my-key');

    // Get statistics
    const stats = await this.cacheManager.getStats();
  }
}
```

### Cache Configuration

Configure cache in your environment:

```typescript
// .env
CACHE_ENABLED=true
CACHE_DEFAULT_TTL=900
CACHE_ENCRYPT_PHI=false
CACHE_MAX_SIZE=1000
```

## Audit Logging

### Using the Audit Service

```typescript
import { Inject } from '@nestjs/common';
import { IAuditLogger } from './database/interfaces/audit/audit-logger.interface';
import { ExecutionContext } from './database/types';

@Injectable()
export class AuditExample {
  constructor(
    @Inject('IAuditLogger') private readonly auditLogger: IAuditLogger
  ) {}

  async auditExample(context: ExecutionContext) {
    // Log entity creation
    await this.auditLogger.logCreate(
      'Student',
      'student-123',
      context,
      { firstName: 'John', lastName: 'Doe' }
    );

    // Log entity update with changes
    await this.auditLogger.logUpdate(
      'Student',
      'student-123',
      context,
      {
        grade: { before: '5', after: '6' }
      }
    );

    // Log export operation
    await this.auditLogger.logExport(
      'HealthRecord',
      context,
      { format: 'PDF', count: 10 }
    );
  }
}
```

## Migration Guide

### Migrating Repositories from Backend

1. **Copy repository interface** from `backend/src/database/repositories/interfaces/`
2. **Copy repository implementation** from `backend/src/database/repositories/impl/`
3. **Update imports** to use `nestjs-backend/src/database/` paths
4. **Add @Injectable() decorator** to the repository class
5. **Add @InjectModel() decorator** for the Sequelize model
6. **Register in DatabaseModule** providers and exports
7. **Update any business logic** to use the new repository

### Example Migration Steps

```bash
# 1. Copy interface
cp backend/src/database/repositories/interfaces/IAllergyRepository.ts \\
   nestjs-backend/src/database/repositories/interfaces/allergy.repository.interface.ts

# 2. Copy implementation
cp backend/src/database/repositories/impl/AllergyRepository.ts \\
   nestjs-backend/src/database/repositories/impl/allergy.repository.ts

# 3. Update imports (manual)
# 4. Add @Injectable() and @InjectModel()
# 5. Register in database.module.ts
```

## Examples

### Example 1: Simple CRUD

```typescript
@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async getStudent(id: string) {
    return await this.studentRepository.findById(id);
  }

  async createStudent(data: CreateStudentDTO, context: ExecutionContext) {
    return await this.studentRepository.create(data, context);
  }

  async updateStudent(
    id: string,
    data: UpdateStudentDTO,
    context: ExecutionContext
  ) {
    return await this.studentRepository.update(id, data, context);
  }

  async deleteStudent(id: string, context: ExecutionContext) {
    await this.studentRepository.delete(id, context);
  }
}
```

### Example 2: Paginated Query

```typescript
async getStudentsByGrade(grade: string, page: number = 1, limit: number = 20) {
  return await this.studentRepository.findMany({
    where: { grade, isActive: true },
    orderBy: [{ lastName: 'ASC' }, { firstName: 'ASC' }],
    pagination: { page, limit }
  });
}
```

### Example 3: Complex Transaction

```typescript
async enrollStudent(
  studentData: CreateStudentDTO,
  healthData: CreateHealthRecordDTO,
  context: ExecutionContext
) {
  return await this.unitOfWork.executeInTransaction(async (uow) => {
    // Create student
    const student = await this.studentRepository.create(studentData, context);

    // Create health record
    await this.healthRecordRepository.create(
      { ...healthData, studentId: student.id },
      context
    );

    // Create initial audit entry
    await this.auditLogger.logCreate('Enrollment', student.id, context, {
      action: 'STUDENT_ENROLLED'
    });

    return student;
  }, context);
}
```

## Remaining Work

### Repositories to Migrate (65+ remaining)

Follow the pattern demonstrated with StudentRepository to migrate:

- HealthRecordRepository
- AllergyRepository
- MedicationRepository
- AppointmentRepository
- ChronicConditionRepository
- VaccinationRepository
- ScreeningRepository
- VitalSignsRepository
- IncidentReportRepository
- DocumentRepository
- And 55+ more...

Each repository follows the same pattern:
1. Extend BaseRepository
2. Implement domain-specific interface
3. Add @Injectable() decorator
4. Inject model, audit, and cache services
5. Implement invalidateCaches and sanitizeForAudit
6. Register in DatabaseModule

## Configuration

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=whitecross

# Cache
CACHE_ENABLED=true
CACHE_DEFAULT_TTL=900
CACHE_ENCRYPT_PHI=false
CACHE_MAX_SIZE=1000

# Audit
AUDIT_ENABLED=true
AUDIT_PHI_ACCESS=true
```

## Best Practices

1. **Always use ExecutionContext** for write operations to maintain audit trail
2. **Implement cache invalidation** properly to avoid stale data
3. **Use Unit of Work** for multi-entity transactions
4. **Sanitize sensitive data** before audit logging
5. **Validate input** in repository validateCreate/validateUpdate hooks
6. **Use pagination** for large result sets
7. **Implement proper error handling** with RepositoryError
8. **Test thoroughly** with unit and integration tests

## Performance Considerations

- Enable caching for frequently accessed entities
- Use appropriate cache TTLs (shorter for PHI)
- Implement database indexes for query performance
- Use bulk operations when possible
- Monitor query performance with logging
- Use read replicas for read-heavy workloads

## Security & Compliance

- All PHI access is automatically logged
- Sensitive fields are redacted in audit logs
- HIPAA-compliant audit trail maintained
- Encrypted connections to database
- Role-based access control at service layer
- Regular security audits recommended

## Support

For issues or questions:
1. Check this documentation
2. Review example implementations
3. Consult NestJS and Sequelize documentation
4. Contact the development team
