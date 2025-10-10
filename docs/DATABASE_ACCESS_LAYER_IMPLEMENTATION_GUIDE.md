# Database Access Layer Implementation Guide

## Overview

This guide provides practical examples and step-by-step instructions for implementing the SOA-compliant database access layer for the White Cross health records module.

## Quick Reference

### Key Files and Directories

```
backend/src/database/
├── repositories/
│   ├── interfaces/          # Repository interface definitions
│   │   ├── IRepository.ts
│   │   ├── IHealthRecordRepository.ts
│   │   ├── IAllergyRepository.ts
│   │   ├── IChronicConditionRepository.ts
│   │   ├── IStudentRepository.ts
│   │   └── IAuditLogRepository.ts
│   ├── base/               # Base repository implementation
│   │   └── BaseRepository.ts
│   └── implementations/    # Concrete repository implementations
│       ├── HealthRecordRepository.ts
│       ├── AllergyRepository.ts
│       └── ...
├── uow/                    # Unit of Work pattern
│   ├── IUnitOfWork.ts
│   └── PrismaUnitOfWork.ts
├── audit/                  # Audit logging
│   └── IAuditLogger.ts
├── cache/                  # Caching layer
│   └── ICacheManager.ts
└── types/                  # Type definitions
    ├── ExecutionContext.ts
    └── QueryTypes.ts
```

## Implementation Examples

### 1. Creating a Repository Implementation

Here's a complete example of implementing the HealthRecordRepository:

```typescript
// backend/src/database/repositories/implementations/HealthRecordRepository.ts

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import {
  IHealthRecordRepository,
  HealthRecord,
  CreateHealthRecordDTO,
  UpdateHealthRecordDTO,
  HealthRecordFilters,
  HealthRecordType,
  VitalSignsHistory,
  HealthSummary,
  SearchCriteria
} from '../interfaces/IHealthRecordRepository';
import { PrismaClient, Prisma } from '@prisma/client';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager, CacheKeyBuilder, getCacheTTL } from '../../cache/ICacheManager';
import { QueryOptions, PaginatedResult } from '../../types/QueryTypes';
import { ExecutionContext } from '../../types/ExecutionContext';

export class HealthRecordRepository
  extends BaseRepository<HealthRecord, CreateHealthRecordDTO, UpdateHealthRecordDTO>
  implements IHealthRecordRepository
{
  private cacheKeyBuilder: CacheKeyBuilder;

  constructor(
    prisma: Prisma.TransactionClient | PrismaClient,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    super(prisma, auditLogger, cacheManager, 'HealthRecord');
    this.cacheKeyBuilder = new CacheKeyBuilder();
  }

  protected getDelegate() {
    return this.prisma.healthRecord;
  }

  protected buildInclude(options?: QueryOptions): any {
    return options?.include || {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentNumber: true
        }
      }
    };
  }

  protected async validateCreate(data: CreateHealthRecordDTO): Promise<void> {
    // Verify student exists
    const studentExists = await this.prisma.student.count({
      where: { id: data.studentId }
    });

    if (studentExists === 0) {
      throw new RepositoryError('Student not found', 'STUDENT_NOT_FOUND', 404);
    }

    // Business rule: certain record types require provider
    if (['PHYSICAL_EXAM', 'VACCINATION'].includes(data.type) && !data.provider) {
      throw new RepositoryError(
        'Provider is required for this record type',
        'PROVIDER_REQUIRED',
        400
      );
    }

    // Calculate BMI if height and weight are provided
    if (data.vital && data.vital.height && data.vital.weight) {
      const heightInMeters = data.vital.height / 100;
      const bmi = data.vital.weight / (heightInMeters * heightInMeters);
      data.vital.bmi = Math.round(bmi * 10) / 10;
    }
  }

  protected async invalidateCaches(entity: any): Promise<void> {
    await Promise.all([
      // Individual record cache
      this.cacheManager.delete(this.cacheKeyBuilder.entity('HealthRecord', entity.id)),

      // Student's health records list
      this.cacheManager.deletePattern(
        `white-cross:student:${entity.studentId}:health-records:*`
      ),

      // Student health summary
      this.cacheManager.delete(
        this.cacheKeyBuilder.summary('Student', entity.studentId, 'health')
      ),

      // Vital signs if record contains vitals
      entity.vital &&
        this.cacheManager.deletePattern(
          `white-cross:student:${entity.studentId}:vitals:*`
        )
    ]);
  }

  protected sanitizeForAudit(data: any): any {
    // Remove large fields from audit logs
    const { attachments, ...sanitized } = data;
    return {
      ...sanitized,
      attachments: attachments ? `[${attachments.length} files]` : undefined
    };
  }

  // Domain-specific methods

  async findByStudentId(
    studentId: string,
    filters: HealthRecordFilters,
    options?: QueryOptions
  ): Promise<PaginatedResult<HealthRecord>> {
    const skip = options?.skip || 0;
    const take = options?.take || 20;

    const where: Prisma.HealthRecordWhereInput = { studentId };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) where.date.gte = filters.dateFrom;
      if (filters.dateTo) where.date.lte = filters.dateTo;
    }

    if (filters.provider) {
      where.provider = { contains: filters.provider, mode: 'insensitive' };
    }

    if (filters.hasVitals) {
      where.vital = { not: Prisma.JsonNull };
    }

    if (filters.hasAttachments) {
      where.attachments = { isEmpty: false };
    }

    const [data, total] = await Promise.all([
      this.getDelegate().findMany({
        where,
        skip,
        take,
        include: this.buildInclude(options),
        orderBy: { date: 'desc' }
      }),
      this.getDelegate().count({ where })
    ]);

    const page = Math.floor(skip / take) + 1;

    return {
      data: data.map((item: any) => this.mapToEntity(item)),
      pagination: {
        page,
        limit: take,
        total,
        pages: Math.ceil(total / take)
      }
    };
  }

  async findByType(
    type: HealthRecordType,
    filters: any,
    options?: QueryOptions
  ): Promise<HealthRecord[]> {
    const records = await this.getDelegate().findMany({
      where: {
        type,
        date: {
          gte: filters.startDate,
          lte: filters.endDate
        }
      },
      include: this.buildInclude(options),
      orderBy: { date: 'desc' }
    });

    return records.map((r: any) => this.mapToEntity(r));
  }

  async findVitalSignsHistory(
    studentId: string,
    limit: number
  ): Promise<VitalSignsHistory[]> {
    const cacheKey = `white-cross:student:${studentId}:vitals:${limit}`;
    const cached = await this.cacheManager.get<VitalSignsHistory[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const records = await this.getDelegate().findMany({
      where: {
        studentId,
        vital: { not: Prisma.JsonNull }
      },
      select: {
        date: true,
        vital: true,
        type: true,
        provider: true
      },
      orderBy: { date: 'desc' },
      take: limit
    });

    const history = records.map((r: any) => ({
      date: r.date,
      vitals: r.vital,
      recordType: r.type,
      provider: r.provider
    }));

    await this.cacheManager.set(cacheKey, history, getCacheTTL('HealthRecord'));

    return history;
  }

  async searchRecords(
    query: SearchCriteria,
    options?: QueryOptions
  ): Promise<PaginatedResult<HealthRecord>> {
    const where: Prisma.HealthRecordWhereInput = {
      OR: [
        { description: { contains: query.query, mode: 'insensitive' } },
        { notes: { contains: query.query, mode: 'insensitive' } },
        { provider: { contains: query.query, mode: 'insensitive' } },
        {
          student: {
            OR: [
              { firstName: { contains: query.query, mode: 'insensitive' } },
              { lastName: { contains: query.query, mode: 'insensitive' } },
              { studentNumber: { contains: query.query, mode: 'insensitive' } }
            ]
          }
        }
      ]
    };

    if (query.type) {
      where.type = query.type;
    }

    if (query.studentIds) {
      where.studentId = { in: query.studentIds };
    }

    if (!query.includeArchived) {
      where.student = { isActive: true };
    }

    const skip = options?.skip || 0;
    const take = options?.take || 20;

    const [data, total] = await Promise.all([
      this.getDelegate().findMany({
        where,
        skip,
        take,
        include: this.buildInclude(options),
        orderBy: { date: 'desc' }
      }),
      this.getDelegate().count({ where })
    ]);

    return {
      data: data.map((item: any) => this.mapToEntity(item)),
      pagination: {
        page: Math.floor(skip / take) + 1,
        limit: take,
        total,
        pages: Math.ceil(total / take)
      }
    };
  }

  async countByType(studentId: string): Promise<Record<HealthRecordType, number>> {
    const grouped = await this.getDelegate().groupBy({
      by: ['type'],
      where: { studentId },
      _count: { type: true }
    });

    return grouped.reduce(
      (acc: Record<string, number>, curr: any) => {
        acc[curr.type] = curr._count.type;
        return acc;
      },
      {} as Record<HealthRecordType, number>
    );
  }

  async getHealthSummary(studentId: string): Promise<HealthSummary> {
    const cacheKey = this.cacheKeyBuilder.summary('Student', studentId, 'health');
    const cached = await this.cacheManager.get<HealthSummary>(cacheKey);

    if (cached) {
      return cached;
    }

    const [student, allergies, conditions, recentVitals, vaccinations, recordCounts] =
      await Promise.all([
        this.prisma.student.findUnique({
          where: { id: studentId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentNumber: true,
            dateOfBirth: true,
            gender: true
          }
        }),
        this.prisma.allergy.findMany({
          where: { studentId },
          orderBy: [{ severity: 'desc' }, { allergen: 'asc' }]
        }),
        this.prisma.chronicCondition.findMany({
          where: { studentId },
          orderBy: [{ status: 'asc' }, { condition: 'asc' }]
        }),
        this.findVitalSignsHistory(studentId, 5),
        this.getVaccinationRecords(studentId),
        this.countByType(studentId)
      ]);

    if (!student) {
      throw new RepositoryError('Student not found', 'STUDENT_NOT_FOUND', 404);
    }

    const summary: HealthSummary = {
      student: student as any,
      allergies,
      chronicConditions: conditions,
      recentVitals,
      recentVaccinations: vaccinations.slice(0, 5),
      recordCounts,
      lastCheckup: undefined,
      upcomingReviews: conditions.filter(
        (c) => c.nextReviewDate && c.nextReviewDate > new Date()
      )
    };

    await this.cacheManager.set(cacheKey, summary, getCacheTTL('HealthRecord'));

    return summary;
  }

  async getVaccinationRecords(studentId: string): Promise<HealthRecord[]> {
    const records = await this.getDelegate().findMany({
      where: {
        studentId,
        type: 'VACCINATION'
      },
      include: this.buildInclude(),
      orderBy: { date: 'desc' }
    });

    return records.map((r: any) => this.mapToEntity(r));
  }

  async bulkDelete(
    recordIds: string[],
    context: ExecutionContext
  ): Promise<{ deleted: number; notFound: number }> {
    if (!recordIds || recordIds.length === 0) {
      throw new RepositoryError('No record IDs provided', 'INVALID_INPUT', 400);
    }

    // Get records for audit logging
    const recordsToDelete = await this.getDelegate().findMany({
      where: { id: { in: recordIds } },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    // Delete the records
    const result = await this.getDelegate().deleteMany({
      where: { id: { in: recordIds } }
    });

    const deletedCount = result.count;
    const notFoundCount = recordIds.length - deletedCount;

    // Audit log
    await this.auditLogger.logBulkOperation('BULK_DELETE', this.entityName, context, {
      recordIds,
      deleted: deletedCount,
      notFound: notFoundCount,
      studentIds: [...new Set(recordsToDelete.map((r: any) => r.studentId))]
    });

    // Invalidate caches for all affected students
    for (const record of recordsToDelete) {
      await this.invalidateCaches(record);
    }

    return { deleted: deletedCount, notFound: notFoundCount };
  }
}
```

### 2. Using the Repository Pattern in Services

Replace direct Prisma usage with repository pattern:

```typescript
// Before: Direct Prisma usage
class HealthRecordServiceOld {
  static async getStudentHealthRecords(studentId: string, page: number, limit: number) {
    const prisma = new PrismaClient();
    const records = await prisma.healthRecord.findMany({
      where: { studentId },
      skip: (page - 1) * limit,
      take: limit
    });
    return records;
  }
}

// After: Repository pattern with Unit of Work
class HealthRecordServiceNew {
  constructor(private uowFactory: IUnitOfWorkFactory) {}

  async getStudentHealthRecords(
    studentId: string,
    page: number,
    limit: number,
    filters: HealthRecordFilters,
    context: ExecutionContext
  ): Promise<PaginatedResult<HealthRecord>> {
    const uow = this.uowFactory.create();

    return await uow.healthRecords.findByStudentId(studentId, filters, {
      skip: (page - 1) * limit,
      take: limit
    });
  }
}
```

### 3. Transaction Usage Examples

#### Simple Transaction

```typescript
async function createHealthRecordWithAllergy(
  healthRecordData: CreateHealthRecordDTO,
  allergyData: CreateAllergyDTO,
  context: ExecutionContext
): Promise<{ healthRecord: HealthRecord; allergy: Allergy }> {
  const uow = createUnitOfWork();

  return await uow.executeInTransaction(async (uow) => {
    // Both operations succeed or both fail
    const healthRecord = await uow.healthRecords.create(healthRecordData, context);
    const allergy = await uow.allergies.create(allergyData, context);

    return { healthRecord, allergy };
  }, context);
}
```

#### Complex Transaction with Validation

```typescript
async function transferStudentHealthRecords(
  sourceStudentId: string,
  targetStudentId: string,
  recordIds: string[],
  context: ExecutionContext
): Promise<TransferResult> {
  const uow = createUnitOfWork();

  return await uow.executeInTransaction(async (uow) => {
    // Verify both students exist
    const [sourceStudent, targetStudent] = await Promise.all([
      uow.students.findById(sourceStudentId),
      uow.students.findById(targetStudentId)
    ]);

    if (!sourceStudent || !targetStudent) {
      throw new RepositoryError('Student not found', 'NOT_FOUND', 404);
    }

    // Transfer records one by one
    const transferred: string[] = [];
    const failed: string[] = [];

    for (const recordId of recordIds) {
      try {
        await uow.healthRecords.update(
          recordId,
          { studentId: targetStudentId } as any,
          context
        );
        transferred.push(recordId);
      } catch (error) {
        failed.push(recordId);
      }
    }

    return {
      transferred,
      failed,
      sourceStudent: sourceStudent.id,
      targetStudent: targetStudent.id
    };
  }, context);
}
```

### 4. Execution Context Usage

```typescript
// In Express middleware or route handler
import { createExecutionContext } from '../database/types/ExecutionContext';

app.post('/api/health-records', auth, async (req: AuthRequest, res: Response) => {
  // Create execution context from request
  const context = createExecutionContext(
    req.user.userId,
    req.user.role,
    {
      ip: req.ip,
      headers: req.headers
    }
  );

  try {
    const healthRecord = await healthRecordService.createHealthRecord(
      req.body,
      context
    );

    res.json({ success: true, data: { healthRecord } });
  } catch (error) {
    // Error handling
  }
});
```

### 5. Cache Strategy Implementation

```typescript
// Example: Implementing cache for health records
async findByStudentIdWithCache(
  studentId: string,
  filters: HealthRecordFilters
): Promise<PaginatedResult<HealthRecord>> {
  // Generate cache key based on query parameters
  const cacheKey = this.cacheKeyBuilder.list('HealthRecord', {
    studentId,
    ...filters
  });

  // Try cache first
  const cached = await this.cacheManager.get<PaginatedResult<HealthRecord>>(cacheKey);
  if (cached) {
    return cached;
  }

  // Query database if cache miss
  const result = await this.findByStudentId(studentId, filters);

  // Cache the result
  await this.cacheManager.set(cacheKey, result, getCacheTTL('HealthRecord'));

  return result;
}
```

## Migration Checklist

### Phase 1: Setup (Week 1-2)
- [ ] Create directory structure
- [ ] Implement base interfaces and types
- [ ] Set up Unit of Work infrastructure
- [ ] Configure audit logger
- [ ] Set up Redis cache (if using)
- [ ] Create base repository implementation

### Phase 2: Repository Implementation (Week 3-4)
- [ ] Implement HealthRecordRepository
- [ ] Implement AllergyRepository
- [ ] Implement ChronicConditionRepository
- [ ] Write unit tests for each repository
- [ ] Integration test transaction behavior

### Phase 3: Service Migration (Week 5-6)
- [ ] Create UnitOfWorkFactory
- [ ] Update HealthRecordService to use repositories
- [ ] Add execution context to all service methods
- [ ] Update route handlers to create execution context
- [ ] Test service layer with new repositories

### Phase 4: Testing & Validation (Week 7-8)
- [ ] Run full test suite
- [ ] Performance testing and benchmarking
- [ ] HIPAA compliance audit trail verification
- [ ] Load testing with caching
- [ ] Security testing

### Phase 5: Deployment (Week 9-10)
- [ ] Feature flag implementation
- [ ] Gradual rollout (10% → 50% → 100%)
- [ ] Monitoring and alerting setup
- [ ] Performance metrics collection
- [ ] Documentation updates

## Performance Optimization Tips

### 1. Use Selective Fields
```typescript
const records = await uow.healthRecords.findMany(
  { where: { studentId } },
  {
    select: {
      id: true,
      type: true,
      date: true,
      description: true
      // Exclude large fields like vitals, notes, attachments
    }
  }
);
```

### 2. Batch Operations
```typescript
// Instead of multiple individual queries
for (const id of studentIds) {
  const student = await uow.students.findById(id);
}

// Use batch loading with DataLoader or single query
const students = await uow.students.findMany({
  where: { id: { in: studentIds } }
});
```

### 3. Index Strategy
Ensure proper indexes are created:
```prisma
model HealthRecord {
  @@index([studentId, date(sort: Desc)])
  @@index([studentId, type, date(sort: Desc)])
  @@index([type, date])
}
```

### 4. Cache Warm-Up
```typescript
// Warm cache for frequently accessed data
async warmCache(studentIds: string[]): Promise<void> {
  for (const studentId of studentIds) {
    await uow.healthRecords.getHealthSummary(studentId);
  }
}
```

## Testing Examples

### Repository Unit Test
```typescript
describe('HealthRecordRepository', () => {
  let repository: IHealthRecordRepository;
  let mockPrisma: any;
  let mockAuditLogger: IAuditLogger;
  let mockCacheManager: ICacheManager;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    mockAuditLogger = createMockAuditLogger();
    mockCacheManager = createMockCacheManager();

    repository = new HealthRecordRepository(
      mockPrisma,
      mockAuditLogger,
      mockCacheManager
    );
  });

  it('should create health record with audit logging', async () => {
    const data: CreateHealthRecordDTO = {
      studentId: 'student-1',
      type: 'CHECKUP',
      date: new Date(),
      description: 'Annual physical'
    };

    const context = createSystemExecutionContext('test');

    const result = await repository.create(data, context);

    expect(result.id).toBeDefined();
    expect(mockAuditLogger.logCreate).toHaveBeenCalledWith(
      'HealthRecord',
      result.id,
      context,
      expect.any(Object)
    );
  });
});
```

## Troubleshooting

### Common Issues

**Issue**: Transaction timeout
```typescript
// Solution: Increase timeout in transaction options
const uow = uowFactory.create({
  timeout: 60000, // 60 seconds
  maxWait: 10000  // 10 seconds
});
```

**Issue**: Cache invalidation not working
```typescript
// Solution: Ensure cache patterns match
// Use consistent key generation
const key = cacheKeyBuilder.entity('HealthRecord', id);
```

**Issue**: Audit logs not persisting
```typescript
// Solution: Ensure async queue is flushed
// Add flush on application shutdown
process.on('SIGTERM', async () => {
  await auditLogger.flush();
});
```

## Best Practices

1. **Always use ExecutionContext**: Pass context to all repository operations for audit trail
2. **Validate Early**: Perform validation in repository before database operations
3. **Cache Strategically**: Cache read-heavy, rarely-changing data
4. **Use Transactions**: Group related operations in transactions for consistency
5. **Monitor Performance**: Track repository operation metrics
6. **Test Thoroughly**: Write unit and integration tests for all repository methods
7. **Document Decisions**: Document why certain caching or query strategies are used

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Unit of Work Pattern](https://martinfowler.com/eaaCatalog/unitOfWork.html)
- [HIPAA Compliance Guidelines](https://www.hhs.gov/hipaa/index.html)

---

**Last Updated**: 2025-10-10
**Version**: 1.0
