# Performance Optimization Integration Guide

## Overview

This guide demonstrates how to integrate the new performance monitoring and optimization features into White Cross services.

## Components Created

1. **QueryMonitorService** - Monitors query performance, detects slow queries and N+1 patterns
2. **PerformanceMetricsService** - Tracks HTTP requests, cache operations, and system metrics
3. **DatabasePoolMonitorService** - Monitors connection pool health (already exists)

## Integration Steps

### Step 1: Import Services in Module

```typescript
// student/student.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from '../database/models/student.model';
import { DatabasePoolMonitorService } from '../config/database-pool-monitor.service';
import { QueryCacheService } from '../database/services/query-cache.service';

@Module({
  imports: [SequelizeModule.forFeature([Student, User, HealthRecord])],
  controllers: [StudentController],
  providers: [
    StudentService,
    DatabasePoolMonitorService,
    QueryCacheService,
  ],
  exports: [StudentService],
})
export class StudentModule {}
```

### Step 2: Inject Services in Constructor

```typescript
// student/student.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { DatabasePoolMonitorService } from '../config/database-pool-monitor.service';
import { QueryCacheService } from '../database/services/query-cache.service';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly poolMonitor: DatabasePoolMonitorService,  // ADD THIS
    private readonly queryCacheService: QueryCacheService,     // Already exists
  ) {}
}
```

### Step 3: Add Pool Monitoring to Expensive Operations

```typescript
/**
 * Bulk update students with pool monitoring
 */
async bulkUpdate(bulkUpdateDto: StudentBulkUpdateDto): Promise<{ updated: number }> {
  try {
    // CHECK POOL HEALTH BEFORE EXPENSIVE OPERATION
    const poolStatus = await this.poolMonitor.getCurrentMetrics();

    if (poolStatus && poolStatus.waitingRequests > 5) {
      this.logger.warn('Connection pool under pressure, queuing operation', {
        waiting: poolStatus.waitingRequests,
        utilization: `${poolStatus.utilizationPercent.toFixed(1)}%`,
      });

      // Optional: Implement backpressure or queue the operation
      // For now, we'll proceed but log the warning
    }

    const { studentIds, nurseId, grade, isActive } = bulkUpdateDto;

    return await this.sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      },
      async (transaction) => {
        // Validate nurse if being updated
        if (nurseId) {
          const nurse = await this.userModel.findOne({
            where: {
              id: nurseId,
              role: UserRole.NURSE,
              isActive: true,
            },
            transaction,
          });

          if (!nurse) {
            throw new NotFoundException(
              'Assigned nurse not found. Please select a valid, active nurse.',
            );
          }
        }

        // Build update object
        const updateData: Partial<Student> = {};
        if (nurseId !== undefined) updateData.nurseId = nurseId;
        if (grade !== undefined) updateData.grade = grade;
        if (isActive !== undefined) updateData.isActive = isActive;

        // Perform bulk update within transaction
        const [affectedCount] = await this.studentModel.update(updateData, {
          where: { id: { [Op.in]: studentIds } },
          transaction,
        });

        this.logger.log(`Bulk update: ${affectedCount} students updated`);
        return { updated: affectedCount };
      },
    );
  } catch (error) {
    this.handleError('Failed to bulk update students', error);
  }
}
```

### Step 4: Enhance Query Caching with Longer TTLs

```typescript
/**
 * Find student by ID with enhanced caching
 */
async findOne(id: string): Promise<Student> {
  this.validateUUID(id);

  const students = await this.queryCacheService.findWithCache(
    this.studentModel,
    {
      where: { id },
      include: [
        {
          model: User,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
        },
      ],
    },
    {
      ttl: 600, // 10 minutes - student data doesn't change frequently
      keyPrefix: 'student_detail',
      invalidateOn: ['update', 'destroy'],
    },
  );

  if (!students || students.length === 0) {
    throw new NotFoundException(`Student with ID ${id} not found`);
  }

  return students[0];
}

/**
 * Find students by grade with caching
 */
async findByGrade(grade: string): Promise<Student[]> {
  const students = await this.queryCacheService.findWithCache(
    this.studentModel,
    {
      where: { grade, isActive: true },
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
      include: [
        {
          model: User,
          as: 'nurse',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    },
    {
      ttl: 300, // 5 minutes - grade lists may change more frequently
      keyPrefix: 'student_grade',
      invalidateOn: ['create', 'update', 'destroy'],
    },
  );

  return students;
}
```

### Step 5: Add Cache Invalidation Hooks to Models

```typescript
// database/models/student.model.ts
import {
  Table,
  Column,
  Model,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
} from 'sequelize-typescript';

@Table({
  tableName: 'Students',
  timestamps: true,
})
export class Student extends Model {
  // ... existing model definition ...

  /**
   * Cache invalidation hooks
   */
  @AfterCreate
  @AfterUpdate
  @AfterDestroy
  static async invalidateCache(instance: Student) {
    // Inject QueryCacheService via global app context or use direct import
    const { QueryCacheService } = await import('../services/query-cache.service');
    const cacheService = new QueryCacheService();

    // Invalidate student detail cache
    await cacheService.invalidatePattern(`student_detail:Student`);

    // Invalidate grade list cache if grade changed
    if (instance.changed('grade') || instance.isNewRecord) {
      await cacheService.invalidatePattern(`student_grade:Student`);
    }
  }
}
```

### Step 6: Add Performance Tracking to Controllers

```typescript
// student/student.controller.ts
import { Controller, Get, Post, Body, Param, UseInterceptors } from '@nestjs/common';
import { PerformanceInterceptor } from '../common/interceptors/performance.interceptor';

@Controller('students')
@UseInterceptors(PerformanceInterceptor) // Add performance tracking
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async findAll(@Query() filterDto: StudentFilterDto) {
    return this.studentService.findAll(filterDto);
  }

  @Post('bulk-update')
  async bulkUpdate(@Body() bulkUpdateDto: StudentBulkUpdateDto) {
    return this.studentService.bulkUpdate(bulkUpdateDto);
  }
}
```

## Performance Interceptor

Create a reusable performance interceptor:

```typescript
// common/interceptors/performance.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PerformanceMetricsService } from '../../infrastructure/monitoring/performance-metrics.service';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  constructor(private readonly metricsService: PerformanceMetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;

          this.metricsService.recordRequest(url, method, duration, statusCode);

          if (duration > 1000) {
            this.logger.warn(`Slow request: ${method} ${url} - ${duration}ms`);
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          this.metricsService.recordRequest(url, method, duration, statusCode);

          this.logger.error(`Request failed: ${method} ${url} - ${duration}ms`, error.stack);
        },
      }),
    );
  }
}
```

## Services to Update

### 1. StudentService
- ✅ Already has QueryCacheService
- Add: DatabasePoolMonitorService
- Add: Pool health checks in bulk operations
- Enhance: Cache TTLs and invalidation hooks

### 2. AppointmentService
Location: `/workspaces/white-cross/backend/src/appointment/appointment.service.ts`
- Add: DatabasePoolMonitorService
- Add: Pool health checks in bulk cancellation
- Add: Caching for appointment calendar queries

### 3. HealthRecordService
Location: `/workspaces/white-cross/backend/src/health-record/`
- Add: DatabasePoolMonitorService
- Add: Caching for health record summaries (TTL: 5 minutes)
- Add: Timeline query optimization

### 4. MedicationService
Location: `/workspaces/white-cross/backend/src/health-record/medication/`
- Add: DatabasePoolMonitorService
- Add: Caching for medication catalog (TTL: 30 minutes)
- Add: Batch administration logging optimization

### 5. EmergencyContactService
Location: `/workspaces/white-cross/backend/src/emergency-contact/`
- Add: DatabasePoolMonitorService
- Add: Caching for frequently accessed emergency contacts

## Bulk Operations to Optimize

### 1. Bulk Grade Transition

```typescript
/**
 * Bulk grade transition (e.g., end of school year)
 */
async bulkGradeTransition(dto: BulkGradeTransitionDto): Promise<{ updated: number }> {
  try {
    // Check pool health
    const poolStatus = await this.poolMonitor.getCurrentMetrics();
    if (poolStatus && poolStatus.utilizationPercent > 80) {
      this.logger.warn('High pool utilization, consider queueing this operation');
    }

    return await this.sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      },
      async (transaction) => {
        // Fetch students in current grade
        const students = await this.studentModel.findAll({
          where: {
            grade: dto.fromGrade,
            isActive: true,
          },
          transaction,
        });

        // Validate promotion eligibility (if rules provided)
        const eligibleIds = students
          .filter((student) => {
            // Add promotion logic here
            return true; // For now, all eligible
          })
          .map((s) => s.id);

        // Bulk update grades
        const [affectedCount] = await this.studentModel.update(
          { grade: dto.toGrade },
          {
            where: { id: { [Op.in]: eligibleIds } },
            transaction,
          },
        );

        this.logger.log(
          `Grade transition: ${affectedCount} students moved from ${dto.fromGrade} to ${dto.toGrade}`,
        );

        return { updated: affectedCount };
      },
    );
  } catch (error) {
    this.handleError('Failed to transition student grades', error);
  }
}
```

### 2. Bulk Nurse Assignment

```typescript
/**
 * Bulk nurse assignment (e.g., reassign students when nurse leaves)
 */
async bulkAssignNurse(dto: BulkNurseAssignmentDto): Promise<{ updated: number }> {
  try {
    // Check pool health
    const poolStatus = await this.poolMonitor.getCurrentMetrics();
    if (poolStatus && poolStatus.waitingRequests > 3) {
      throw new BadRequestException('System under load, please try again shortly');
    }

    return await this.sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      },
      async (transaction) => {
        // Validate new nurse
        const newNurse = await this.userModel.findOne({
          where: {
            id: dto.newNurseId,
            role: UserRole.NURSE,
            isActive: true,
          },
          transaction,
        });

        if (!newNurse) {
          throw new NotFoundException('New nurse not found or inactive');
        }

        // Get current workload
        const currentLoad = await this.studentModel.count({
          where: { nurseId: dto.newNurseId, isActive: true },
          transaction,
        });

        const maxLoad = 200; // Configurable
        if (currentLoad + dto.studentIds.length > maxLoad) {
          throw new BadRequestException(
            `Nurse workload limit exceeded. Current: ${currentLoad}, Attempting: ${dto.studentIds.length}, Max: ${maxLoad}`,
          );
        }

        // Perform bulk update
        const [affectedCount] = await this.studentModel.update(
          { nurseId: dto.newNurseId },
          {
            where: { id: { [Op.in]: dto.studentIds } },
            transaction,
          },
        );

        this.logger.log(
          `Bulk nurse assignment: ${affectedCount} students assigned to ${newNurse.fullName}`,
        );

        return { updated: affectedCount };
      },
    );
  } catch (error) {
    this.handleError('Failed to bulk assign nurse', error);
  }
}
```

### 3. Bulk Student Transfer

```typescript
/**
 * Bulk student transfer between schools
 */
async bulkTransfer(dto: BulkTransferDto): Promise<{ transferred: number }> {
  try {
    // Check pool health before expensive operation
    const poolStatus = await this.poolMonitor.getCurrentMetrics();
    if (poolStatus && poolStatus.availableConnections < 2) {
      this.logger.warn('Low pool availability, implementing backpressure');
      // Could implement queuing here
    }

    return await this.sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      },
      async (transaction) => {
        // Validate students exist and are active
        const students = await this.studentModel.findAll({
          where: {
            id: { [Op.in]: dto.studentIds },
            isActive: true,
          },
          transaction,
        });

        if (students.length !== dto.studentIds.length) {
          throw new BadRequestException(
            'Some students not found or inactive',
          );
        }

        // Perform bulk update
        const [affectedCount] = await this.studentModel.update(
          {
            schoolId: dto.newSchoolId,
            // Clear nurse assignment on transfer
            nurseId: null,
            // Add transfer metadata
            previousSchoolId: this.sequelize.col('schoolId'),
            transferredAt: new Date(),
          },
          {
            where: { id: { [Op.in]: dto.studentIds } },
            transaction,
          },
        );

        this.logger.log(
          `Bulk transfer: ${affectedCount} students transferred to school ${dto.newSchoolId}`,
        );

        return { transferred: affectedCount };
      },
    );
  } catch (error) {
    this.handleError('Failed to bulk transfer students', error);
  }
}
```

## Monitoring Endpoints

Access performance metrics via:

- `GET /monitoring/performance` - Overall performance summary
- `GET /monitoring/queries` - Query performance and slow queries
- `GET /monitoring/pool` - Connection pool status
- `GET /monitoring/cache` - Cache hit rate and statistics
- `GET /monitoring/health` - Overall system health

## Performance Targets

- **P50 query time**: < 100ms
- **P95 query time**: < 500ms
- **P99 query time**: < 1000ms
- **Cache hit rate**: > 80% for student details
- **Connection pool utilization**: < 80% under load
- **Zero N+1 queries** in hot paths

## Testing Performance

```typescript
// test/performance/student.performance.spec.ts
import { Test } from '@nestjs/testing';
import { StudentService } from '../src/student/student.service';
import { QueryMonitorService } from '../src/infrastructure/monitoring/query-monitor.service';

describe('Student Service Performance', () => {
  let service: StudentService;
  let queryMonitor: QueryMonitorService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      // ... setup
    }).compile();

    service = module.get<StudentService>(StudentService);
    queryMonitor = module.get<QueryMonitorService>(QueryMonitorService);
  });

  it('should meet P95 performance target for findAll', async () => {
    const iterations = 100;
    const durations: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      await service.findAll({ page: 1, limit: 20 });
      durations.push(Date.now() - start);
    }

    durations.sort((a, b) => a - b);
    const p95Index = Math.ceil(iterations * 0.95) - 1;
    const p95Duration = durations[p95Index];

    expect(p95Duration).toBeLessThan(500); // P95 target: 500ms
  });

  it('should not generate N+1 queries', async () => {
    queryMonitor.resetMetrics();

    await service.findAll({ page: 1, limit: 50 });

    const report = queryMonitor.getPerformanceReport();
    expect(report.n1Detections.length).toBe(0);
  });
});
```

## Next Steps

1. Update StudentService with pool monitoring
2. Update AppointmentService with pool monitoring
3. Update HealthRecordService with enhanced caching
4. Update MedicationService with catalog caching
5. Update EmergencyContactService with contact caching
6. Add model cache invalidation hooks
7. Create performance test suite
8. Measure before/after metrics
9. Generate performance report
