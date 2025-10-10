# SOA-Compliant Database Access Layer Architecture for Health Records Module

## Executive Summary

This document presents a comprehensive Service-Oriented Architecture (SOA) compliant database access layer design for the White Cross health records module. The architecture addresses HIPAA compliance requirements, implements repository patterns for data abstraction, provides transaction management, and establishes clear service boundaries.

## Current State Analysis

### Existing Architecture Issues

1. **Direct Prisma Client Usage**: Services directly instantiate and use PrismaClient, creating tight coupling
2. **No Transaction Management Pattern**: Ad-hoc transaction handling without standardized approach
3. **Missing Audit Trail Integration**: Audit logging exists but not integrated into data access layer
4. **No Caching Strategy**: No abstraction for caching Protected Health Information (PHI)
5. **Inconsistent Error Handling**: Generic error messages without proper context
6. **No Query Optimization Layer**: Complex joins repeated across service methods

### Health Records Domain Models (from Prisma Schema)

**Core Entities:**
- `HealthRecord`: Primary health documentation (checkups, vaccinations, illnesses, etc.)
- `Allergy`: Student allergy records with severity tracking
- `ChronicCondition`: Long-term health conditions requiring ongoing management
- `Student`: Primary entity with health data relationships

**Supporting Entities:**
- `AuditLog`: Tracks all PHI access and modifications
- `User`: Healthcare providers accessing records
- `EmergencyContact`: Critical contact information

## SOA-Compliant Architecture Design

### 1. Repository Pattern Implementation

The repository pattern abstracts data access logic from business logic, providing a clean separation of concerns essential for SOA.

#### Repository Interface Hierarchy

```typescript
// Base Repository Interface
interface IRepository<T, CreateDTO, UpdateDTO> {
  findById(id: string, options?: QueryOptions): Promise<T | null>;
  findMany(criteria: QueryCriteria<T>, options?: QueryOptions): Promise<PaginatedResult<T>>;
  create(data: CreateDTO, context: ExecutionContext): Promise<T>;
  update(id: string, data: UpdateDTO, context: ExecutionContext): Promise<T>;
  delete(id: string, context: ExecutionContext): Promise<void>;
  exists(criteria: Partial<T>): Promise<boolean>;
}

// Health Record Specific Repository Interface
interface IHealthRecordRepository extends IRepository<HealthRecord, CreateHealthRecordDTO, UpdateHealthRecordDTO> {
  // Domain-specific queries
  findByStudentId(studentId: string, filters: HealthRecordFilters, options?: QueryOptions): Promise<PaginatedResult<HealthRecord>>;
  findByType(type: HealthRecordType, filters: DateRangeFilter, options?: QueryOptions): Promise<HealthRecord[]>;
  findVitalSignsHistory(studentId: string, limit: number): Promise<VitalSignsHistory[]>;
  searchRecords(query: SearchCriteria, options?: QueryOptions): Promise<PaginatedResult<HealthRecord>>;

  // Aggregate operations
  countByType(studentId: string): Promise<Record<HealthRecordType, number>>;
  getHealthSummary(studentId: string): Promise<HealthSummary>;
}

// Allergy Repository Interface
interface IAllergyRepository extends IRepository<Allergy, CreateAllergyDTO, UpdateAllergyDTO> {
  findByStudentId(studentId: string): Promise<Allergy[]>;
  findBySeverity(severity: AllergySeverity): Promise<Allergy[]>;
  checkDuplicateAllergen(studentId: string, allergen: string): Promise<boolean>;
}

// Chronic Condition Repository Interface
interface IChronicConditionRepository extends IRepository<ChronicCondition, CreateChronicConditionDTO, UpdateChronicConditionDTO> {
  findByStudentId(studentId: string, includeInactive?: boolean): Promise<ChronicCondition[]>;
  findDueForReview(daysThreshold: number): Promise<ChronicCondition[]>;
  findByStatus(status: ConditionStatus): Promise<ChronicCondition[]>;
}
```

#### Supporting Types and Interfaces

```typescript
// Execution Context - carries request-scoped information
interface ExecutionContext {
  userId: string;
  userRole: UserRole;
  ipAddress?: string;
  userAgent?: string;
  transactionId?: string;
  timestamp: Date;
}

// Query Options
interface QueryOptions {
  include?: Record<string, boolean | QueryOptions>;
  orderBy?: OrderByClause;
  skip?: number;
  take?: number;
  cursor?: string;
  cacheKey?: string;
  cacheTTL?: number;
}

// Query Criteria
interface QueryCriteria<T> {
  where: Partial<T> | ComplexWhereClause;
  orderBy?: OrderByClause;
  pagination?: PaginationParams;
}

// Paginated Result
interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  metadata?: Record<string, any>;
}

// Health Record Filters
interface HealthRecordFilters {
  type?: HealthRecordType;
  dateFrom?: Date;
  dateTo?: Date;
  provider?: string;
  hasVitals?: boolean;
  hasAttachments?: boolean;
}

// Date Range Filter
interface DateRangeFilter {
  startDate: Date;
  endDate: Date;
}

// Search Criteria
interface SearchCriteria {
  query: string;
  type?: HealthRecordType;
  studentIds?: string[];
  includeArchived?: boolean;
}

// Vital Signs History
interface VitalSignsHistory {
  date: Date;
  vitals: VitalSigns;
  recordType: HealthRecordType;
  provider?: string;
}

// Health Summary
interface HealthSummary {
  student: StudentBasicInfo;
  allergies: Allergy[];
  chronicConditions: ChronicCondition[];
  recentVitals: VitalSignsHistory[];
  recentVaccinations: HealthRecord[];
  recordCounts: Record<HealthRecordType, number>;
  lastCheckup?: Date;
  upcomingReviews: ChronicCondition[];
}
```

### 2. Data Access Abstraction Layer

The abstraction layer sits between repositories and the Prisma ORM, providing:
- Unit of Work pattern for transaction management
- Audit logging integration
- Query optimization
- Caching strategy

#### Unit of Work Pattern

```typescript
interface IUnitOfWork {
  healthRecords: IHealthRecordRepository;
  allergies: IAllergyRepository;
  chronicConditions: IChronicConditionRepository;
  students: IStudentRepository;
  auditLogs: IAuditLogRepository;

  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  isInTransaction(): boolean;

  // Execute operation within transaction
  executeInTransaction<T>(
    operation: (uow: IUnitOfWork) => Promise<T>,
    context: ExecutionContext
  ): Promise<T>;
}

class PrismaUnitOfWork implements IUnitOfWork {
  private transaction: Prisma.TransactionClient | null = null;
  private prismaClient: PrismaClient;
  private auditLogger: IAuditLogger;
  private cacheManager: ICacheManager;

  // Lazy-loaded repositories
  private _healthRecords?: IHealthRecordRepository;
  private _allergies?: IAllergyRepository;
  private _chronicConditions?: IChronicConditionRepository;
  private _students?: IStudentRepository;
  private _auditLogs?: IAuditLogRepository;

  constructor(
    prismaClient: PrismaClient,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager
  ) {
    this.prismaClient = prismaClient;
    this.auditLogger = auditLogger;
    this.cacheManager = cacheManager;
  }

  get healthRecords(): IHealthRecordRepository {
    if (!this._healthRecords) {
      this._healthRecords = new HealthRecordRepository(
        this.getClient(),
        this.auditLogger,
        this.cacheManager
      );
    }
    return this._healthRecords;
  }

  get allergies(): IAllergyRepository {
    if (!this._allergies) {
      this._allergies = new AllergyRepository(
        this.getClient(),
        this.auditLogger,
        this.cacheManager
      );
    }
    return this._allergies;
  }

  get chronicConditions(): IChronicConditionRepository {
    if (!this._chronicConditions) {
      this._chronicConditions = new ChronicConditionRepository(
        this.getClient(),
        this.auditLogger,
        this.cacheManager
      );
    }
    return this._chronicConditions;
  }

  get students(): IStudentRepository {
    if (!this._students) {
      this._students = new StudentRepository(
        this.getClient(),
        this.auditLogger,
        this.cacheManager
      );
    }
    return this._students;
  }

  get auditLogs(): IAuditLogRepository {
    if (!this._auditLogs) {
      this._auditLogs = new AuditLogRepository(
        this.getClient()
      );
    }
    return this._auditLogs;
  }

  private getClient(): Prisma.TransactionClient | PrismaClient {
    return this.transaction || this.prismaClient;
  }

  async begin(): Promise<void> {
    if (this.transaction) {
      throw new Error('Transaction already in progress');
    }
    // Transaction started in executeInTransaction
  }

  async commit(): Promise<void> {
    if (!this.transaction) {
      throw new Error('No transaction in progress');
    }
    // Commit handled by Prisma interactive transaction
    this.transaction = null;
    this.clearRepositoryCache();
  }

  async rollback(): Promise<void> {
    if (!this.transaction) {
      throw new Error('No transaction in progress');
    }
    // Rollback handled by throwing error in transaction
    this.transaction = null;
    this.clearRepositoryCache();
  }

  isInTransaction(): boolean {
    return this.transaction !== null;
  }

  async executeInTransaction<T>(
    operation: (uow: IUnitOfWork) => Promise<T>,
    context: ExecutionContext
  ): Promise<T> {
    return await this.prismaClient.$transaction(async (tx) => {
      // Set transaction client
      this.transaction = tx;

      // Clear repository cache to force recreation with transaction client
      this.clearRepositoryCache();

      try {
        const result = await operation(this);

        // Log transaction completion
        await this.auditLogger.logTransaction(
          'TRANSACTION_COMMIT',
          context,
          { transactionId: context.transactionId }
        );

        return result;
      } catch (error) {
        // Log transaction failure
        await this.auditLogger.logTransaction(
          'TRANSACTION_ROLLBACK',
          context,
          {
            transactionId: context.transactionId,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        );
        throw error;
      } finally {
        this.transaction = null;
        this.clearRepositoryCache();
      }
    }, {
      maxWait: 5000,
      timeout: 30000,
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted
    });
  }

  private clearRepositoryCache(): void {
    this._healthRecords = undefined;
    this._allergies = undefined;
    this._chronicConditions = undefined;
    this._students = undefined;
    this._auditLogs = undefined;
  }
}
```

#### Base Repository Implementation

```typescript
abstract class BaseRepository<T, CreateDTO, UpdateDTO> implements IRepository<T, CreateDTO, UpdateDTO> {
  protected prisma: Prisma.TransactionClient | PrismaClient;
  protected auditLogger: IAuditLogger;
  protected cacheManager: ICacheManager;
  protected entityName: string;

  constructor(
    prisma: Prisma.TransactionClient | PrismaClient,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager,
    entityName: string
  ) {
    this.prisma = prisma;
    this.auditLogger = auditLogger;
    this.cacheManager = cacheManager;
    this.entityName = entityName;
  }

  protected abstract getDelegate(): any;

  protected abstract mapToEntity(data: any): T;

  protected abstract buildInclude(options?: QueryOptions): any;

  async findById(id: string, options?: QueryOptions): Promise<T | null> {
    // Check cache first
    if (options?.cacheKey) {
      const cached = await this.cacheManager.get<T>(options.cacheKey);
      if (cached) {
        return cached;
      }
    }

    const result = await this.getDelegate().findUnique({
      where: { id },
      include: this.buildInclude(options)
    });

    if (result && options?.cacheKey) {
      await this.cacheManager.set(
        options.cacheKey,
        result,
        options.cacheTTL || 300
      );
    }

    return result ? this.mapToEntity(result) : null;
  }

  async findMany(criteria: QueryCriteria<T>, options?: QueryOptions): Promise<PaginatedResult<T>> {
    const skip = criteria.pagination?.skip || 0;
    const take = criteria.pagination?.limit || 20;

    const [data, total] = await Promise.all([
      this.getDelegate().findMany({
        where: criteria.where,
        orderBy: criteria.orderBy,
        skip,
        take,
        include: this.buildInclude(options)
      }),
      this.getDelegate().count({
        where: criteria.where
      })
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

  async create(data: CreateDTO, context: ExecutionContext): Promise<T> {
    const result = await this.getDelegate().create({
      data,
      include: this.buildInclude()
    });

    // Audit log
    await this.auditLogger.logCreate(
      this.entityName,
      result.id,
      context,
      this.sanitizeForAudit(data)
    );

    // Invalidate related caches
    await this.invalidateCaches(result);

    return this.mapToEntity(result);
  }

  async update(id: string, data: UpdateDTO, context: ExecutionContext): Promise<T> {
    // Get existing record for audit trail
    const existing = await this.getDelegate().findUnique({
      where: { id }
    });

    if (!existing) {
      throw new RepositoryError(`${this.entityName} not found`, 'NOT_FOUND');
    }

    const result = await this.getDelegate().update({
      where: { id },
      data,
      include: this.buildInclude()
    });

    // Audit log with changes
    await this.auditLogger.logUpdate(
      this.entityName,
      id,
      context,
      this.calculateChanges(existing, result)
    );

    // Invalidate related caches
    await this.invalidateCaches(result);

    return this.mapToEntity(result);
  }

  async delete(id: string, context: ExecutionContext): Promise<void> {
    const existing = await this.getDelegate().findUnique({
      where: { id }
    });

    if (!existing) {
      throw new RepositoryError(`${this.entityName} not found`, 'NOT_FOUND');
    }

    await this.getDelegate().delete({
      where: { id }
    });

    // Audit log
    await this.auditLogger.logDelete(
      this.entityName,
      id,
      context,
      this.sanitizeForAudit(existing)
    );

    // Invalidate related caches
    await this.invalidateCaches(existing);
  }

  async exists(criteria: Partial<T>): Promise<boolean> {
    const count = await this.getDelegate().count({
      where: criteria,
      take: 1
    });
    return count > 0;
  }

  protected abstract invalidateCaches(entity: any): Promise<void>;

  protected abstract sanitizeForAudit(data: any): any;

  protected calculateChanges(before: any, after: any): Record<string, { before: any; after: any }> {
    const changes: Record<string, { before: any; after: any }> = {};

    for (const key in after) {
      if (before[key] !== after[key] && key !== 'updatedAt') {
        changes[key] = {
          before: before[key],
          after: after[key]
        };
      }
    }

    return changes;
  }
}
```

### 3. Transaction Management Patterns

#### Pattern 1: Simple Transaction

```typescript
// Single operation requiring consistency
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

#### Pattern 2: Complex Multi-Step Transaction

```typescript
// Complex operation with validation and dependencies
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
      throw new RepositoryError('Student not found', 'NOT_FOUND');
    }

    // Transfer records
    const transferred: string[] = [];
    const failed: string[] = [];

    for (const recordId of recordIds) {
      try {
        await uow.healthRecords.update(
          recordId,
          { studentId: targetStudentId },
          context
        );
        transferred.push(recordId);
      } catch (error) {
        failed.push(recordId);
      }
    }

    // Log transfer operation
    await uow.auditLogs.create({
      action: 'TRANSFER_HEALTH_RECORDS',
      entityType: 'HealthRecord',
      userId: context.userId,
      changes: {
        sourceStudentId,
        targetStudentId,
        recordCount: transferred.length,
        failedCount: failed.length
      },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    }, context);

    return {
      transferred,
      failed,
      sourceStudent: sourceStudent.id,
      targetStudent: targetStudent.id
    };
  }, context);
}
```

#### Pattern 3: Compensating Transaction

```typescript
// Operation with compensation logic for partial failures
async function bulkImportHealthRecords(
  studentId: string,
  records: CreateHealthRecordDTO[],
  context: ExecutionContext
): Promise<ImportResult> {
  const uow = createUnitOfWork();
  const imported: HealthRecord[] = [];
  const errors: ImportError[] = [];

  try {
    return await uow.executeInTransaction(async (uow) => {
      for (let i = 0; i < records.length; i++) {
        try {
          const record = await uow.healthRecords.create(records[i], context);
          imported.push(record);
        } catch (error) {
          errors.push({
            index: i,
            record: records[i],
            error: error instanceof Error ? error.message : 'Unknown error'
          });

          // If critical record fails, rollback entire import
          if (records[i].type === 'VACCINATION' || records[i].type === 'PHYSICAL_EXAM') {
            throw error;
          }
        }
      }

      return {
        success: true,
        imported: imported.length,
        failed: errors.length,
        records: imported,
        errors
      };
    }, context);
  } catch (error) {
    // Transaction rolled back, return partial results
    return {
      success: false,
      imported: 0,
      failed: records.length,
      records: [],
      errors: [{
        index: -1,
        record: null,
        error: error instanceof Error ? error.message : 'Transaction failed'
      }]
    };
  }
}
```

### 4. Caching Strategy Integration

#### Cache Manager Interface

```typescript
interface ICacheManager {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl: number): Promise<void>;
  delete(key: string): Promise<void>;
  deletePattern(pattern: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

// HIPAA-Compliant Cache Configuration
interface CacheConfig {
  enabled: boolean;
  ttl: number;
  encryptPHI: boolean;
  auditAccess: boolean;
  allowedEntityTypes: string[];
}

class RedisCacheManager implements ICacheManager {
  private redis: RedisClient;
  private config: CacheConfig;
  private auditLogger: IAuditLogger;

  constructor(redis: RedisClient, config: CacheConfig, auditLogger: IAuditLogger) {
    this.redis = redis;
    this.config = config;
    this.auditLogger = auditLogger;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.config.enabled) {
      return null;
    }

    const cached = await this.redis.get(key);

    if (cached && this.config.auditAccess) {
      await this.auditLogger.logCacheAccess('READ', key);
    }

    if (!cached) {
      return null;
    }

    const data = JSON.parse(cached);

    // Decrypt PHI if encrypted
    if (this.config.encryptPHI && data.encrypted) {
      return this.decrypt(data.value) as T;
    }

    return data as T;
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    let dataToCache = value;

    // Encrypt PHI before caching
    if (this.config.encryptPHI && this.containsPHI(value)) {
      dataToCache = {
        encrypted: true,
        value: this.encrypt(value)
      } as any;
    }

    await this.redis.setex(
      key,
      ttl || this.config.ttl,
      JSON.stringify(dataToCache)
    );

    if (this.config.auditAccess) {
      await this.auditLogger.logCacheAccess('WRITE', key);
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);

    if (this.config.auditAccess) {
      await this.auditLogger.logCacheAccess('DELETE', key);
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);

    if (keys.length > 0) {
      await this.redis.del(...keys);
    }

    if (this.config.auditAccess) {
      await this.auditLogger.logCacheAccess('DELETE_PATTERN', pattern, { count: keys.length });
    }
  }

  async exists(key: string): Promise<boolean> {
    const exists = await this.redis.exists(key);
    return exists === 1;
  }

  private containsPHI(value: any): boolean {
    // Check if value contains PHI fields
    const phiFields = [
      'firstName', 'lastName', 'dateOfBirth', 'medicalRecordNum',
      'vital', 'diagnosis', 'prescription', 'notes'
    ];

    const valueStr = JSON.stringify(value).toLowerCase();
    return phiFields.some(field => valueStr.includes(field.toLowerCase()));
  }

  private encrypt(data: any): string {
    // Implement AES-256 encryption
    // Use environment-specific encryption key
    // Implementation details omitted for brevity
    return 'encrypted_data';
  }

  private decrypt(data: string): any {
    // Implement AES-256 decryption
    // Implementation details omitted for brevity
    return JSON.parse('decrypted_data');
  }
}
```

#### Caching Strategy by Entity

```typescript
// Cache key generation strategies
class CacheKeyBuilder {
  private static PREFIX = 'white-cross';

  static healthRecord(id: string): string {
    return `${this.PREFIX}:health-record:${id}`;
  }

  static studentHealthRecords(studentId: string, filters: HealthRecordFilters): string {
    const filterHash = this.hashFilters(filters);
    return `${this.PREFIX}:student:${studentId}:health-records:${filterHash}`;
  }

  static studentAllergies(studentId: string): string {
    return `${this.PREFIX}:student:${studentId}:allergies`;
  }

  static studentChronicConditions(studentId: string): string {
    return `${this.PREFIX}:student:${studentId}:chronic-conditions`;
  }

  static healthSummary(studentId: string): string {
    return `${this.PREFIX}:student:${studentId}:health-summary`;
  }

  static vitalSignsHistory(studentId: string, limit: number): string {
    return `${this.PREFIX}:student:${studentId}:vitals:${limit}`;
  }

  private static hashFilters(filters: any): string {
    // Create consistent hash of filter object
    const normalized = JSON.stringify(filters, Object.keys(filters).sort());
    // Use simple hash or crypto.createHash for production
    return Buffer.from(normalized).toString('base64').substring(0, 16);
  }
}

// TTL Configuration by Entity Type
enum CacheTTL {
  HEALTH_RECORD = 300,        // 5 minutes
  ALLERGY = 1800,             // 30 minutes
  CHRONIC_CONDITION = 900,    // 15 minutes
  HEALTH_SUMMARY = 600,       // 10 minutes
  VITAL_SIGNS = 300,          // 5 minutes
  STUDENT_PROFILE = 1800,     // 30 minutes
}

// Cache Invalidation Patterns
class CacheInvalidationStrategy {
  constructor(private cacheManager: ICacheManager) {}

  async invalidateHealthRecord(healthRecord: HealthRecord): Promise<void> {
    await Promise.all([
      // Individual record cache
      this.cacheManager.delete(CacheKeyBuilder.healthRecord(healthRecord.id)),

      // Student's health records list (all filter combinations)
      this.cacheManager.deletePattern(
        `${CacheKeyBuilder.PREFIX}:student:${healthRecord.studentId}:health-records:*`
      ),

      // Student health summary
      this.cacheManager.delete(
        CacheKeyBuilder.healthSummary(healthRecord.studentId)
      ),

      // Vital signs if record contains vitals
      healthRecord.vital && this.cacheManager.deletePattern(
        `${CacheKeyBuilder.PREFIX}:student:${healthRecord.studentId}:vitals:*`
      )
    ]);
  }

  async invalidateAllergy(allergy: Allergy): Promise<void> {
    await Promise.all([
      this.cacheManager.delete(
        CacheKeyBuilder.studentAllergies(allergy.studentId)
      ),
      this.cacheManager.delete(
        CacheKeyBuilder.healthSummary(allergy.studentId)
      )
    ]);
  }

  async invalidateChronicCondition(condition: ChronicCondition): Promise<void> {
    await Promise.all([
      this.cacheManager.delete(
        CacheKeyBuilder.studentChronicConditions(condition.studentId)
      ),
      this.cacheManager.delete(
        CacheKeyBuilder.healthSummary(condition.studentId)
      )
    ]);
  }

  async invalidateStudentHealthData(studentId: string): Promise<void> {
    // Nuclear option - invalidate all cached health data for student
    await this.cacheManager.deletePattern(
      `${CacheKeyBuilder.PREFIX}:student:${studentId}:*`
    );
  }
}
```

### 5. Query Optimization Strategies

#### Optimized Query Patterns

```typescript
class QueryOptimizer {
  // Pattern 1: Select Only Required Fields
  static healthRecordListProjection = {
    id: true,
    type: true,
    date: true,
    description: true,
    provider: true,
    createdAt: true,
    student: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentNumber: true
      }
    }
    // Exclude: vital (JSON), notes (large text), attachments (array)
  };

  // Pattern 2: Paginated Queries with Count Optimization
  static async paginatedHealthRecords(
    prisma: PrismaClient,
    studentId: string,
    page: number,
    limit: number,
    filters: HealthRecordFilters
  ): Promise<PaginatedResult<HealthRecord>> {
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(studentId, filters);

    // Use Promise.all for parallel execution
    const [data, total] = await Promise.all([
      prisma.healthRecord.findMany({
        where,
        select: this.healthRecordListProjection,
        skip,
        take: limit,
        orderBy: { date: 'desc' }
      }),
      // Optimize count query - don't include relations
      prisma.healthRecord.count({ where })
    ]);

    return {
      data: data as HealthRecord[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Pattern 3: Batch Loading with DataLoader Pattern
  static createHealthRecordLoader(prisma: PrismaClient): DataLoader<string, HealthRecord> {
    return new DataLoader(async (ids: readonly string[]) => {
      const records = await prisma.healthRecord.findMany({
        where: { id: { in: [...ids] } },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true
            }
          }
        }
      });

      // Maintain order of requested IDs
      const recordMap = new Map(records.map(r => [r.id, r]));
      return ids.map(id => recordMap.get(id) || null);
    }, {
      cache: true,
      maxBatchSize: 100
    });
  }

  // Pattern 4: Aggregate Queries with Grouping
  static async getHealthRecordStatistics(
    prisma: PrismaClient,
    studentId: string,
    dateRange: DateRangeFilter
  ): Promise<HealthRecordStatistics> {
    const [countByType, totalRecords, latestRecord] = await Promise.all([
      // Grouped aggregation
      prisma.healthRecord.groupBy({
        by: ['type'],
        where: {
          studentId,
          date: {
            gte: dateRange.startDate,
            lte: dateRange.endDate
          }
        },
        _count: { type: true }
      }),

      // Total count
      prisma.healthRecord.count({
        where: {
          studentId,
          date: {
            gte: dateRange.startDate,
            lte: dateRange.endDate
          }
        }
      }),

      // Latest record
      prisma.healthRecord.findFirst({
        where: { studentId },
        orderBy: { date: 'desc' },
        select: {
          id: true,
          type: true,
          date: true
        }
      })
    ]);

    return {
      countByType: countByType.reduce((acc, curr) => {
        acc[curr.type] = curr._count.type;
        return acc;
      }, {} as Record<HealthRecordType, number>),
      totalRecords,
      latestRecord
    };
  }

  // Pattern 5: Complex Search with Full-Text
  static async searchHealthRecords(
    prisma: PrismaClient,
    query: string,
    filters: SearchCriteria,
    pagination: PaginationParams
  ): Promise<PaginatedResult<HealthRecord>> {
    // Build complex OR conditions for search
    const searchConditions = {
      OR: [
        { description: { contains: query, mode: Prisma.QueryMode.insensitive } },
        { notes: { contains: query, mode: Prisma.QueryMode.insensitive } },
        { provider: { contains: query, mode: Prisma.QueryMode.insensitive } },
        {
          student: {
            OR: [
              { firstName: { contains: query, mode: Prisma.QueryMode.insensitive } },
              { lastName: { contains: query, mode: Prisma.QueryMode.insensitive } },
              { studentNumber: { contains: query, mode: Prisma.QueryMode.insensitive } }
            ]
          }
        }
      ]
    };

    // Add filters
    const where: Prisma.HealthRecordWhereInput = {
      ...searchConditions,
      ...(filters.type && { type: filters.type }),
      ...(filters.studentIds && { studentId: { in: filters.studentIds } }),
      ...(!filters.includeArchived && { student: { isActive: true } })
    };

    const [data, total] = await Promise.all([
      prisma.healthRecord.findMany({
        where,
        select: this.healthRecordListProjection,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { date: 'desc' }
      }),
      prisma.healthRecord.count({ where })
    ]);

    return {
      data: data as HealthRecord[],
      pagination: {
        page: Math.floor(pagination.skip / pagination.limit) + 1,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      }
    };
  }

  private static buildWhereClause(
    studentId: string,
    filters: HealthRecordFilters
  ): Prisma.HealthRecordWhereInput {
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
      where.provider = { contains: filters.provider, mode: Prisma.QueryMode.insensitive };
    }

    if (filters.hasVitals) {
      where.vital = { not: Prisma.JsonNull };
    }

    if (filters.hasAttachments) {
      where.attachments = { isEmpty: false };
    }

    return where;
  }
}
```

#### Database Indexing Strategy

```prisma
// Recommended indexes for health records module

model HealthRecord {
  // ... existing fields ...

  @@index([studentId, date(sort: Desc)])           // Most common query pattern
  @@index([studentId, type, date(sort: Desc)])     // Filtered by type
  @@index([type, date])                             // Statistics by type
  @@index([date])                                   // Date range queries
  @@index([provider])                               // Provider lookup
  @@index([createdAt])                              // Recent records
  @@map("health_records")
}

model Allergy {
  // ... existing fields ...

  @@index([studentId, severity(sort: Desc)])       // Ordered by severity
  @@index([allergen])                               // Allergy lookups
  @@index([verified, studentId])                    // Verified allergies
  @@map("allergies")
}

model ChronicCondition {
  // ... existing fields ...

  @@index([studentId, status])                      // Active conditions
  @@index([nextReviewDate])                         // Due for review
  @@index([condition])                              // Condition lookup
  @@index([diagnosedDate])                          // Recent diagnoses
  @@map("chronic_conditions")
}

model AuditLog {
  // ... existing fields ...

  @@index([entityType, entityId, createdAt(sort: Desc)])  // Entity audit trail
  @@index([userId, createdAt(sort: Desc)])                 // User activity
  @@index([action, createdAt])                             // Action analysis
  @@index([createdAt(sort: Desc)])                         // Recent activity
  @@map("audit_logs")
}
```

### 6. HIPAA Audit Logging Integration

#### Audit Logger Interface and Implementation

```typescript
interface IAuditLogger {
  logCreate(entityType: string, entityId: string, context: ExecutionContext, data: any): Promise<void>;
  logRead(entityType: string, entityId: string, context: ExecutionContext): Promise<void>;
  logUpdate(entityType: string, entityId: string, context: ExecutionContext, changes: any): Promise<void>;
  logDelete(entityType: string, entityId: string, context: ExecutionContext, data: any): Promise<void>;
  logBulkOperation(operation: string, entityType: string, context: ExecutionContext, metadata: any): Promise<void>;
  logExport(entityType: string, context: ExecutionContext, metadata: any): Promise<void>;
  logTransaction(operation: string, context: ExecutionContext, metadata: any): Promise<void>;
  logCacheAccess(operation: string, cacheKey: string, metadata?: any): Promise<void>;
}

class HIPAACompliantAuditLogger implements IAuditLogger {
  private prisma: PrismaClient;
  private asyncQueue: AsyncQueue<AuditLogEntry>;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.asyncQueue = new AsyncQueue(this.processBatch.bind(this), {
      batchSize: 50,
      flushInterval: 5000 // 5 seconds
    });
  }

  async logCreate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: any
  ): Promise<void> {
    await this.queueAuditLog({
      action: 'CREATE',
      entityType,
      entityId,
      userId: context.userId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      changes: { created: this.sanitizePHI(data) },
      createdAt: context.timestamp
    });
  }

  async logRead(
    entityType: string,
    entityId: string,
    context: ExecutionContext
  ): Promise<void> {
    // Only log PHI reads for compliance
    if (this.isPHIEntity(entityType)) {
      await this.queueAuditLog({
        action: 'READ',
        entityType,
        entityId,
        userId: context.userId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        changes: null,
        createdAt: context.timestamp
      });
    }
  }

  async logUpdate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    changes: Record<string, { before: any; after: any }>
  ): Promise<void> {
    await this.queueAuditLog({
      action: 'UPDATE',
      entityType,
      entityId,
      userId: context.userId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      changes: this.sanitizePHI(changes),
      createdAt: context.timestamp
    });
  }

  async logDelete(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: any
  ): Promise<void> {
    await this.queueAuditLog({
      action: 'DELETE',
      entityType,
      entityId,
      userId: context.userId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      changes: { deleted: this.sanitizePHI(data) },
      createdAt: context.timestamp
    });
  }

  async logBulkOperation(
    operation: string,
    entityType: string,
    context: ExecutionContext,
    metadata: any
  ): Promise<void> {
    await this.queueAuditLog({
      action: operation,
      entityType,
      entityId: null,
      userId: context.userId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      changes: metadata,
      createdAt: context.timestamp
    });
  }

  async logExport(
    entityType: string,
    context: ExecutionContext,
    metadata: any
  ): Promise<void> {
    await this.queueAuditLog({
      action: 'EXPORT',
      entityType,
      entityId: null,
      userId: context.userId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      changes: metadata,
      createdAt: context.timestamp
    });
  }

  async logTransaction(
    operation: string,
    context: ExecutionContext,
    metadata: any
  ): Promise<void> {
    await this.queueAuditLog({
      action: operation,
      entityType: 'TRANSACTION',
      entityId: context.transactionId || null,
      userId: context.userId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      changes: metadata,
      createdAt: context.timestamp
    });
  }

  async logCacheAccess(
    operation: string,
    cacheKey: string,
    metadata?: any
  ): Promise<void> {
    // Only log cache access for PHI
    if (this.containsPHICacheKey(cacheKey)) {
      await this.queueAuditLog({
        action: `CACHE_${operation}`,
        entityType: 'CACHE',
        entityId: cacheKey,
        userId: null,
        ipAddress: null,
        userAgent: null,
        changes: metadata || null,
        createdAt: new Date()
      });
    }
  }

  private async queueAuditLog(entry: AuditLogEntry): Promise<void> {
    await this.asyncQueue.add(entry);
  }

  private async processBatch(entries: AuditLogEntry[]): Promise<void> {
    try {
      await this.prisma.auditLog.createMany({
        data: entries.map(entry => ({
          action: entry.action as any,
          entityType: entry.entityType,
          entityId: entry.entityId,
          userId: entry.userId,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          changes: entry.changes,
          createdAt: entry.createdAt
        }))
      });
    } catch (error) {
      console.error('Failed to persist audit logs:', error);
      // In production: write to backup audit file or alert monitoring
    }
  }

  private isPHIEntity(entityType: string): boolean {
    const phiEntities = [
      'HealthRecord',
      'Allergy',
      'ChronicCondition',
      'Student',
      'StudentMedication',
      'MedicationLog'
    ];
    return phiEntities.includes(entityType);
  }

  private containsPHICacheKey(cacheKey: string): boolean {
    const phiKeywords = ['health', 'allergy', 'condition', 'medication', 'student'];
    return phiKeywords.some(keyword => cacheKey.toLowerCase().includes(keyword));
  }

  private sanitizePHI(data: any): any {
    // Remove sensitive fields that shouldn't be logged
    const sensitiveFields = ['password', 'ssn', 'taxId'];

    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized: any = Array.isArray(data) ? [] : {};

    for (const key in data) {
      if (sensitiveFields.includes(key)) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        sanitized[key] = this.sanitizePHI(data[key]);
      } else {
        sanitized[key] = data[key];
      }
    }

    return sanitized;
  }
}

// Async Queue for Batch Processing
class AsyncQueue<T> {
  private queue: T[] = [];
  private processing: boolean = false;
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private processor: (items: T[]) => Promise<void>,
    private options: { batchSize: number; flushInterval: number }
  ) {}

  async add(item: T): Promise<void> {
    this.queue.push(item);

    if (this.queue.length >= this.options.batchSize) {
      await this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.options.flushInterval);
    }
  }

  private async flush(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const batch = this.queue.splice(0, this.options.batchSize);

    try {
      await this.processor(batch);
    } catch (error) {
      console.error('Batch processing failed:', error);
      // Re-queue failed items or write to backup
    } finally {
      this.processing = false;

      if (this.queue.length > 0) {
        await this.flush();
      }
    }
  }
}

interface AuditLogEntry {
  action: string;
  entityType: string;
  entityId: string | null;
  userId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  changes: any;
  createdAt: Date;
}
```

### 7. Service Boundary Definitions

#### Service Isolation Principles

```typescript
// Health Records Domain Service
class HealthRecordsDomainService {
  constructor(
    private unitOfWorkFactory: UnitOfWorkFactory,
    private eventBus: IEventBus
  ) {}

  // Public service boundary - exposed to other services
  async getStudentHealthSummary(
    studentId: string,
    context: ExecutionContext
  ): Promise<HealthSummary> {
    const uow = this.unitOfWorkFactory.create();

    try {
      const summary = await uow.healthRecords.getHealthSummary(studentId);

      // Emit domain event
      await this.eventBus.publish(new HealthSummaryAccessedEvent({
        studentId,
        accessedBy: context.userId,
        timestamp: context.timestamp
      }));

      return summary;
    } finally {
      // UoW cleanup if needed
    }
  }

  async createHealthRecord(
    data: CreateHealthRecordDTO,
    context: ExecutionContext
  ): Promise<HealthRecord> {
    const uow = this.unitOfWorkFactory.create();

    return await uow.executeInTransaction(async (uow) => {
      // Business validation
      await this.validateHealthRecordCreation(data, uow);

      // Create record
      const record = await uow.healthRecords.create(data, context);

      // Emit domain event for other services
      await this.eventBus.publish(new HealthRecordCreatedEvent({
        healthRecordId: record.id,
        studentId: record.studentId,
        type: record.type,
        createdBy: context.userId,
        timestamp: context.timestamp
      }));

      return record;
    }, context);
  }

  private async validateHealthRecordCreation(
    data: CreateHealthRecordDTO,
    uow: IUnitOfWork
  ): Promise<void> {
    // Verify student exists
    const studentExists = await uow.students.exists({ id: data.studentId });
    if (!studentExists) {
      throw new DomainError('Student not found', 'STUDENT_NOT_FOUND');
    }

    // Business rule: certain record types require provider
    if (['PHYSICAL_EXAM', 'VACCINATION'].includes(data.type) && !data.provider) {
      throw new DomainError(
        'Provider is required for this record type',
        'PROVIDER_REQUIRED'
      );
    }
  }
}

// Student Management Domain Service (separate service)
class StudentManagementDomainService {
  constructor(
    private unitOfWorkFactory: UnitOfWorkFactory,
    private eventBus: IEventBus,
    private healthRecordsService: HealthRecordsDomainService // Service dependency
  ) {
    // Subscribe to health record events
    this.eventBus.subscribe(HealthRecordCreatedEvent, this.onHealthRecordCreated.bind(this));
  }

  async getStudentProfile(
    studentId: string,
    context: ExecutionContext
  ): Promise<StudentProfile> {
    const uow = this.unitOfWorkFactory.create();

    // Get student data from own domain
    const student = await uow.students.findById(studentId);

    if (!student) {
      throw new DomainError('Student not found', 'STUDENT_NOT_FOUND');
    }

    // Call health records service for health summary (cross-service call)
    const healthSummary = await this.healthRecordsService.getStudentHealthSummary(
      studentId,
      context
    );

    return {
      ...student,
      healthSummary
    };
  }

  private async onHealthRecordCreated(event: HealthRecordCreatedEvent): Promise<void> {
    // React to health record creation
    // Example: Update student profile last activity
    const uow = this.unitOfWorkFactory.create();

    await uow.students.update(
      event.data.studentId,
      { lastHealthRecordUpdate: event.data.timestamp },
      {
        userId: 'system',
        userRole: 'SYSTEM',
        timestamp: event.data.timestamp
      } as ExecutionContext
    );
  }
}
```

#### Data Consistency Across Services

```typescript
// Event-Driven Data Consistency
interface IDomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  data: any;
  metadata: {
    userId: string;
    timestamp: Date;
    correlationId?: string;
  };
}

class HealthRecordCreatedEvent implements IDomainEvent {
  eventId: string;
  eventType = 'HealthRecordCreated';
  aggregateType = 'HealthRecord';

  constructor(
    public aggregateId: string,
    public data: {
      healthRecordId: string;
      studentId: string;
      type: HealthRecordType;
      createdBy: string;
      timestamp: Date;
    },
    public metadata: {
      userId: string;
      timestamp: Date;
      correlationId?: string;
    }
  ) {
    this.eventId = generateEventId();
  }
}

// Event Bus Interface
interface IEventBus {
  publish<T extends IDomainEvent>(event: T): Promise<void>;
  subscribe<T extends IDomainEvent>(
    eventType: new (...args: any[]) => T,
    handler: (event: T) => Promise<void>
  ): void;
}

// Saga Pattern for Complex Cross-Service Operations
class TransferStudentHealthRecordsSaga {
  constructor(
    private healthRecordsService: HealthRecordsDomainService,
    private studentService: StudentManagementDomainService,
    private eventBus: IEventBus
  ) {}

  async execute(
    sourceStudentId: string,
    targetStudentId: string,
    recordIds: string[],
    context: ExecutionContext
  ): Promise<SagaResult> {
    const sagaId = generateSagaId();
    const compensations: CompensatingAction[] = [];

    try {
      // Step 1: Verify both students exist
      const [sourceStudent, targetStudent] = await Promise.all([
        this.studentService.getStudent(sourceStudentId, context),
        this.studentService.getStudent(targetStudentId, context)
      ]);

      // Step 2: Transfer health records
      const transferResult = await this.healthRecordsService.transferRecords(
        recordIds,
        targetStudentId,
        context
      );

      compensations.push(() =>
        this.healthRecordsService.transferRecords(
          transferResult.transferred,
          sourceStudentId,
          context
        )
      );

      // Step 3: Update student profiles
      await Promise.all([
        this.studentService.updateStudentTransferCount(
          sourceStudentId,
          -transferResult.transferred.length,
          context
        ),
        this.studentService.updateStudentTransferCount(
          targetStudentId,
          transferResult.transferred.length,
          context
        )
      ]);

      // Emit saga completion event
      await this.eventBus.publish(new SagaCompletedEvent({
        sagaId,
        sagaType: 'TransferStudentHealthRecords',
        result: transferResult
      }));

      return {
        success: true,
        sagaId,
        result: transferResult
      };
    } catch (error) {
      // Execute compensating transactions
      await this.compensate(compensations, sagaId, context);

      throw error;
    }
  }

  private async compensate(
    compensations: CompensatingAction[],
    sagaId: string,
    context: ExecutionContext
  ): Promise<void> {
    for (const compensate of compensations.reverse()) {
      try {
        await compensate();
      } catch (error) {
        console.error(`Compensation failed for saga ${sagaId}:`, error);
        // Log compensation failure - manual intervention may be needed
      }
    }

    await this.eventBus.publish(new SagaFailedEvent({
      sagaId,
      sagaType: 'TransferStudentHealthRecords',
      error: 'Saga failed and compensating transactions executed'
    }));
  }
}

type CompensatingAction = () => Promise<void>;

interface SagaResult {
  success: boolean;
  sagaId: string;
  result: any;
}
```

## 8. Migration Strategy

### Phase 1: Infrastructure Setup (Week 1-2)

```typescript
// Step 1: Create repository interfaces and base implementations
// Step 2: Implement Unit of Work pattern
// Step 3: Set up audit logging infrastructure
// Step 4: Configure caching layer (Redis)

// Migration helper to run both old and new implementations in parallel
class MigrationProxy<T> {
  constructor(
    private oldImplementation: any,
    private newImplementation: any,
    private comparisonLogger: IComparisonLogger
  ) {}

  async executeWithComparison(
    methodName: string,
    ...args: any[]
  ): Promise<T> {
    const [oldResult, newResult] = await Promise.allSettled([
      this.oldImplementation[methodName](...args),
      this.newImplementation[methodName](...args)
    ]);

    // Log differences
    await this.comparisonLogger.logComparison({
      method: methodName,
      oldResult: oldResult.status === 'fulfilled' ? oldResult.value : oldResult.reason,
      newResult: newResult.status === 'fulfilled' ? newResult.value : newResult.reason,
      timestamp: new Date()
    });

    // Return new result, fall back to old if new fails
    if (newResult.status === 'fulfilled') {
      return newResult.value;
    } else if (oldResult.status === 'fulfilled') {
      console.warn(`New implementation failed, falling back to old: ${newResult.reason}`);
      return oldResult.value;
    } else {
      throw newResult.reason;
    }
  }
}
```

### Phase 2: Repository Implementation (Week 3-4)

```typescript
// Migrate one repository at a time
// 1. HealthRecordRepository
// 2. AllergyRepository
// 3. ChronicConditionRepository

// Example migration for one service method
class HealthRecordService {
  private useNewRepository: boolean;
  private oldPrisma: PrismaClient;
  private uowFactory: UnitOfWorkFactory;

  constructor(config: ServiceConfig) {
    this.useNewRepository = config.enableRepositoryPattern;
    this.oldPrisma = new PrismaClient();
    this.uowFactory = new UnitOfWorkFactory();
  }

  async getStudentHealthRecords(
    studentId: string,
    page: number,
    limit: number,
    filters: HealthRecordFilters
  ): Promise<PaginatedResult<HealthRecord>> {
    if (this.useNewRepository) {
      // New repository pattern implementation
      const uow = this.uowFactory.create();
      return await uow.healthRecords.findByStudentId(
        studentId,
        filters,
        {
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { date: 'desc' }
        }
      );
    } else {
      // Keep existing Prisma implementation
      const skip = (page - 1) * limit;
      const whereClause: Prisma.HealthRecordWhereInput = { studentId };

      // ... existing implementation ...

      const [records, total] = await Promise.all([
        this.oldPrisma.healthRecord.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { date: 'desc' }
        }),
        this.oldPrisma.healthRecord.count({ where: whereClause })
      ]);

      return {
        data: records,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      };
    }
  }
}
```

### Phase 3: Service Layer Refactoring (Week 5-6)

```typescript
// Refactor services to use Unit of Work pattern
// Remove direct Prisma client instantiation
// Implement transaction patterns

// Before:
class HealthRecordService {
  static async createHealthRecord(data: CreateHealthRecordData) {
    const prisma = new PrismaClient();
    return await prisma.healthRecord.create({ data });
  }
}

// After:
class HealthRecordService {
  constructor(private uowFactory: UnitOfWorkFactory) {}

  async createHealthRecord(
    data: CreateHealthRecordDTO,
    context: ExecutionContext
  ): Promise<HealthRecord> {
    const uow = this.uowFactory.create();
    return await uow.executeInTransaction(async (uow) => {
      return await uow.healthRecords.create(data, context);
    }, context);
  }
}
```

### Phase 4: Testing and Validation (Week 7-8)

```typescript
// Integration tests for repository pattern
describe('HealthRecordRepository', () => {
  let uow: IUnitOfWork;
  let context: ExecutionContext;

  beforeEach(() => {
    uow = createTestUnitOfWork();
    context = createTestContext();
  });

  it('should create health record with audit logging', async () => {
    const data: CreateHealthRecordDTO = {
      studentId: 'test-student-id',
      type: 'CHECKUP',
      date: new Date(),
      description: 'Annual physical examination'
    };

    const record = await uow.healthRecords.create(data, context);

    expect(record.id).toBeDefined();
    expect(record.type).toBe('CHECKUP');

    // Verify audit log created
    const auditLogs = await uow.auditLogs.findByEntity('HealthRecord', record.id);
    expect(auditLogs).toHaveLength(1);
    expect(auditLogs[0].action).toBe('CREATE');
  });

  it('should handle transaction rollback on error', async () => {
    const data: CreateHealthRecordDTO = {
      studentId: 'invalid-student-id',
      type: 'CHECKUP',
      date: new Date(),
      description: 'Test record'
    };

    await expect(
      uow.executeInTransaction(async (uow) => {
        return await uow.healthRecords.create(data, context);
      }, context)
    ).rejects.toThrow();

    // Verify no record created
    const records = await uow.healthRecords.findMany({
      where: { description: 'Test record' }
    }, {});
    expect(records.data).toHaveLength(0);
  });
});
```

### Phase 5: Deployment and Monitoring (Week 9-10)

```typescript
// Feature flags for gradual rollout
enum FeatureFlag {
  REPOSITORY_PATTERN = 'repository_pattern',
  TRANSACTION_MANAGEMENT = 'transaction_management',
  AUDIT_LOGGING = 'audit_logging',
  CACHING_LAYER = 'caching_layer'
}

class FeatureFlagService {
  async isEnabled(flag: FeatureFlag, userId?: string): Promise<boolean> {
    // Check configuration, user segment, or A/B test group
    return await this.checkFeatureFlag(flag, userId);
  }

  private async checkFeatureFlag(flag: FeatureFlag, userId?: string): Promise<boolean> {
    // Implementation: Redis, LaunchDarkly, or database lookup
    return true; // Default to enabled
  }
}

// Service initialization with feature flags
class HealthRecordServiceFactory {
  static async create(featureFlags: FeatureFlagService): Promise<HealthRecordService> {
    const useRepositoryPattern = await featureFlags.isEnabled(
      FeatureFlag.REPOSITORY_PATTERN
    );

    if (useRepositoryPattern) {
      const uowFactory = new UnitOfWorkFactory();
      return new HealthRecordServiceV2(uowFactory);
    } else {
      return new HealthRecordServiceV1();
    }
  }
}
```

## 9. Performance Monitoring

```typescript
// Repository Performance Metrics
class RepositoryMetrics {
  private metrics: Map<string, OperationMetric[]> = new Map();

  async recordOperation(
    repository: string,
    operation: string,
    duration: number,
    success: boolean,
    metadata?: any
  ): Promise<void> {
    const key = `${repository}.${operation}`;
    const metric: OperationMetric = {
      timestamp: new Date(),
      duration,
      success,
      metadata
    };

    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }

    this.metrics.get(key)!.push(metric);

    // Alert on slow operations
    if (duration > 1000) {
      await this.alertSlowOperation(repository, operation, duration, metadata);
    }
  }

  getStatistics(repository: string, operation: string): OperationStatistics {
    const key = `${repository}.${operation}`;
    const operations = this.metrics.get(key) || [];

    if (operations.length === 0) {
      return {
        count: 0,
        avgDuration: 0,
        p95Duration: 0,
        p99Duration: 0,
        successRate: 0
      };
    }

    const durations = operations.map(op => op.duration).sort((a, b) => a - b);
    const successCount = operations.filter(op => op.success).length;

    return {
      count: operations.length,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      p95Duration: durations[Math.floor(durations.length * 0.95)],
      p99Duration: durations[Math.floor(durations.length * 0.99)],
      successRate: successCount / operations.length
    };
  }

  private async alertSlowOperation(
    repository: string,
    operation: string,
    duration: number,
    metadata?: any
  ): Promise<void> {
    console.warn(`Slow operation detected: ${repository}.${operation} took ${duration}ms`, metadata);
    // Send to monitoring service (DataDog, New Relic, etc.)
  }
}

interface OperationMetric {
  timestamp: Date;
  duration: number;
  success: boolean;
  metadata?: any;
}

interface OperationStatistics {
  count: number;
  avgDuration: number;
  p95Duration: number;
  p99Duration: number;
  successRate: number;
}
```

## Conclusion

This SOA-compliant database access layer architecture provides:

1. **Clear Separation of Concerns**: Repository pattern isolates data access from business logic
2. **HIPAA Compliance**: Comprehensive audit logging for all PHI access and modifications
3. **Transaction Management**: Unit of Work pattern ensures data consistency
4. **Performance Optimization**: Caching strategies, query optimization, and batch processing
5. **Service Isolation**: Well-defined service boundaries with event-driven communication
6. **Maintainability**: Consistent patterns across all health records domain operations
7. **Testability**: Mockable interfaces and dependency injection support
8. **Scalability**: Async processing, caching, and optimized queries support growth

The migration strategy allows for gradual adoption with minimal risk, using feature flags and parallel execution for validation.

## Next Steps

1. Review and approve architecture design
2. Set up infrastructure (Redis, monitoring)
3. Begin Phase 1 implementation
4. Create comprehensive test suite
5. Document repository usage patterns for team
6. Train development team on new patterns
7. Execute migration plan with monitoring

---

**Document Version**: 1.0
**Last Updated**: 2025-10-10
**Author**: Database Architecture Team
**Review Status**: Pending Approval
