# Service Architecture Quick Reference Guide

## Table of Contents
1. [Creating a New Service](#creating-a-new-service)
2. [Using Request Context](#using-request-context)
3. [Event-Driven Patterns](#event-driven-patterns)
4. [Interface-Based DI](#interface-based-di)
5. [Best Practices](#best-practices)

---

## Creating a New Service

### Standard Service Template

```typescript
import { Injectable, Optional } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RequestContextService } from '../shared/context/request-context.service';
import { BaseService } from '../shared/base/base.service';

@Injectable()
export class MyService extends BaseService {
  protected readonly logger = new Logger(MyService.name);

  constructor(
    @Optional() protected readonly requestContext: RequestContextService,
    @Optional() private readonly eventEmitter: EventEmitter2,
    // Your specific dependencies
  ) {
    super(
      requestContext ||
        ({
          requestId: 'system',
          userId: undefined,
          getLogContext: () => ({ requestId: 'system' }),
          getAuditContext: () => ({ requestId: 'system', timestamp: new Date() }),
        } as any),
    );
  }

  async doSomething(id: string, data: any): Promise<any> {
    try {
      // 1. Validate inputs
      this.validateUUID(id);
      this.validateRequired(data.name, 'Name');

      // 2. Business logic
      const result = await this.performOperation(id, data);

      // 3. Emit event
      if (this.eventEmitter) {
        this.eventEmitter.emit('my.operation.completed', {
          id: result.id,
          userId: this.requestContext?.userId,
          timestamp: new Date(),
        });
      }

      // 4. Log success
      this.logInfo('Operation completed', { id: result.id });

      return result;
    } catch (error) {
      this.handleError('Failed to perform operation', error);
    }
  }

  private async performOperation(id: string, data: any): Promise<any> {
    // Implementation
    return { id, ...data };
  }
}
```

---

## Using Request Context

### Basic Usage

```typescript
@Injectable()
export class PatientService extends BaseService {
  constructor(
    protected readonly requestContext: RequestContextService,
    private readonly patientRepository: PatientRepository,
    private readonly auditService: AuditService,
  ) {
    super(requestContext);
  }

  async getPatient(id: string): Promise<Patient> {
    // Get user info from context
    const userId = this.requestContext.userId;
    const userRole = this.requestContext.userRole;

    // Check permissions
    if (!this.requestContext.hasAnyRole(['nurse', 'doctor'])) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Fetch patient
    const patient = await this.patientRepository.findById(id);

    // Log PHI access
    await this.auditService.logAccess(
      'patient',
      id,
      'VIEW',
      this.requestContext.getAuditContext()
    );

    return patient;
  }
}
```

### Role-Based Access Control

```typescript
// Check single role
if (this.requestContext.hasRole('admin')) {
  // Admin-only logic
}

// Check any of multiple roles
if (this.requestContext.hasAnyRole(['nurse', 'doctor'])) {
  // Healthcare provider logic
}

// Check all roles required
if (this.requestContext.hasAllRoles(['nurse', 'certified'])) {
  // Certified nurse logic
}

// Require role or throw
this.requireRole('admin');
this.requireAnyRole(['nurse', 'doctor']);
```

### Audit Logging

```typescript
// Method 1: Using helper
const auditLog = this.createAuditLog(
  'CREATE_PRESCRIPTION',
  'prescription',
  prescription.id,
  { medicationId, dosage }
);
await this.auditService.log(auditLog);

// Method 2: Direct context
await this.auditService.logAccess(
  'patient',
  patientId,
  'VIEW_MEDICAL_RECORDS',
  this.requestContext.getAuditContext()
);

// Method 3: Modification tracking
await this.auditService.logModification(
  'patient',
  patientId,
  'UPDATE_ALLERGIES',
  { before: oldAllergies, after: newAllergies },
  this.requestContext.getAuditContext()
);
```

---

## Event-Driven Patterns

### Defining Events

```typescript
// events/medication.events.ts
export class MedicationCreatedEvent {
  constructor(
    public readonly medication: any,
    public readonly userId?: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class MedicationAdministeredEvent {
  constructor(
    public readonly medicationId: string,
    public readonly studentId: string,
    public readonly administeredBy: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
```

### Emitting Events

```typescript
@Injectable()
export class MedicationService extends BaseService {
  constructor(
    protected readonly requestContext: RequestContextService,
    @Optional() private readonly eventEmitter: EventEmitter2,
  ) {
    super(requestContext);
  }

  async createMedication(data: CreateMedicationDto): Promise<Medication> {
    const medication = await this.repository.save(data);

    // Emit event
    if (this.eventEmitter) {
      this.eventEmitter.emit(
        'medication.created',
        new MedicationCreatedEvent(
          medication,
          this.requestContext?.userId
        )
      );
    }

    return medication;
  }
}
```

### Listening to Events

```typescript
@Injectable()
export class NotificationService {
  @OnEvent('medication.created')
  async handleMedicationCreated(event: MedicationCreatedEvent) {
    // Send notification to nurse
    await this.sendNotification({
      to: event.medication.assignedNurseId,
      type: 'MEDICATION_CREATED',
      data: event.medication,
    });
  }

  @OnEvent('medication.administered')
  async handleMedicationAdministered(event: MedicationAdministeredEvent) {
    // Log administration
    // Update student record
    // Notify parents
  }
}
```

### Async Event Listeners

```typescript
@OnEvent('patient.created', { async: true })
async handlePatientCreatedAsync(event: PatientCreatedEvent) {
  // This runs asynchronously, won't block the main flow
  await this.generateWelcomePacket(event.patient);
  await this.scheduleInitialScreening(event.patient);
}
```

---

## Interface-Based DI

### Using Interface Tokens

```typescript
import { Inject } from '@nestjs/common';
import { LOGGER_SERVICE, CACHE_SERVICE } from '../shared/tokens';
import { ILoggerService, ICacheService } from '../shared/interfaces';

@Injectable()
export class MyService {
  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: ILoggerService,
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService,
  ) {}

  async getData(key: string): Promise<any> {
    // Check cache
    const cached = await this.cache.get<any>(key);
    if (cached) {
      this.logger.log('Cache hit', { key });
      return cached;
    }

    // Fetch from database
    const data = await this.fetchFromDatabase(key);

    // Store in cache
    await this.cache.set(key, data, { ttl: 300 });

    return data;
  }
}
```

### Providing Implementations

```typescript
// In module
@Module({
  providers: [
    {
      provide: CACHE_SERVICE,
      useFactory: (config: ConfigService) => {
        const cacheType = config.get('cache.type');

        if (cacheType === 'redis') {
          return new RedisCache(config.get('redis'));
        }

        return new MemoryCache(config.get('cache'));
      },
      inject: [ConfigService],
    },
    {
      provide: LOGGER_SERVICE,
      useClass: WinstonLogger,
    },
  ],
})
export class AppModule {}
```

### Mocking in Tests

```typescript
describe('MyService', () => {
  let service: MyService;
  let mockLogger: ILoggerService;
  let mockCache: ICacheService;

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    mockCache = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
    };

    const module = await Test.createTestingModule({
      providers: [
        MyService,
        { provide: LOGGER_SERVICE, useValue: mockLogger },
        { provide: CACHE_SERVICE, useValue: mockCache },
      ],
    }).compile();

    service = module.get<MyService>(MyService);
  });

  it('should use cache', async () => {
    mockCache.get = jest.fn().mockResolvedValue({ data: 'cached' });

    const result = await service.getData('key');

    expect(mockCache.get).toHaveBeenCalledWith('key');
    expect(mockLogger.log).toHaveBeenCalledWith('Cache hit', { key: 'key' });
  });
});
```

---

## Best Practices

### 1. Always Extend BaseService

```typescript
// ✅ Good
@Injectable()
export class MyService extends BaseService {
  constructor(protected readonly requestContext: RequestContextService) {
    super(requestContext);
  }
}

// ❌ Bad
@Injectable()
export class MyService {
  private logger = new Logger(MyService.name);
  // Duplicate validation, error handling, etc.
}
```

### 2. Use Helper Methods

```typescript
// ✅ Good
this.validateUUID(id);
this.validateRequired(name, 'Name');
this.validateNotFuture(date, 'Birth date');

// ❌ Bad
if (!isUUID(id)) {
  throw new BadRequestException('Invalid ID format');
}
if (!name) {
  throw new BadRequestException('Name is required');
}
```

### 3. Emit Events for Side Effects

```typescript
// ✅ Good - Decoupled
async createPatient(data: CreatePatientDto) {
  const patient = await this.repository.save(data);

  this.eventEmitter.emit('patient.created', { patient });

  return patient;
}

// Event listener handles notifications
@OnEvent('patient.created')
async sendWelcomeEmail(event) {
  await this.emailService.send(event.patient.email, 'welcome');
}

// ❌ Bad - Tightly coupled
async createPatient(data: CreatePatientDto) {
  const patient = await this.repository.save(data);

  // Direct coupling to email service
  await this.emailService.send(patient.email, 'welcome');

  return patient;
}
```

### 4. Use @Optional() for Event Emitter

```typescript
// ✅ Good - Works in tests without EventEmitter
constructor(
  @Optional() private readonly eventEmitter: EventEmitter2,
) {}

if (this.eventEmitter) {
  this.eventEmitter.emit('event.name', data);
}

// ❌ Bad - Requires EventEmitter in tests
constructor(
  private readonly eventEmitter: EventEmitter2,
) {}

this.eventEmitter.emit('event.name', data); // Crashes if null
```

### 5. Provide Request Context Mock for System Services

```typescript
// ✅ Good - Works with or without request
constructor(
  @Optional() protected readonly requestContext: RequestContextService,
) {
  super(
    requestContext || {
      requestId: 'system',
      userId: undefined,
      getLogContext: () => ({ requestId: 'system' }),
      getAuditContext: () => ({ requestId: 'system', timestamp: new Date() }),
    } as any,
  );
}

// ❌ Bad - Crashes in cron jobs, background tasks
constructor(
  protected readonly requestContext: RequestContextService,
) {
  super(requestContext); // RequestContext is undefined in system tasks
}
```

### 6. Use Interface Tokens for Core Services

```typescript
// ✅ Good - Testable, flexible
constructor(
  @Inject(CACHE_SERVICE) private cache: ICacheService,
  @Inject(LOGGER_SERVICE) private logger: ILoggerService,
) {}

// ❌ Bad - Hard to mock, tied to implementation
constructor(
  private cache: RedisCache,
  private logger: WinstonLogger,
) {}
```

### 7. Log with Context

```typescript
// ✅ Good - Includes request context
this.logInfo('Patient created', {
  patientId: patient.id,
  studentId: patient.studentId,
});

// ❌ Bad - No context for troubleshooting
this.logger.log('Patient created');
```

### 8. Handle Errors Consistently

```typescript
// ✅ Good - HIPAA-compliant error handling
try {
  const patient = await this.getPatient(id);
  return patient;
} catch (error) {
  this.handleError('Failed to get patient', error);
  // Logs full error internally, throws safe error to client
}

// ❌ Bad - Might expose PHI
try {
  const patient = await this.getPatient(id);
  return patient;
} catch (error) {
  throw new InternalServerErrorException(error.message);
  // Error message might contain PHI!
}
```

### 9. Name Events Clearly

```typescript
// ✅ Good - Clear, namespaced
'patient.created'
'medication.administered'
'appointment.scheduled'
'student.transferred'

// ❌ Bad - Ambiguous, no namespace
'created'
'update'
'done'
```

### 10. Document Event Contracts

```typescript
// ✅ Good
/**
 * Emitted when a new patient is created
 *
 * Listeners:
 * - NotificationService: Sends welcome email
 * - AnalyticsService: Tracks new patient metric
 * - AuditService: Logs patient creation
 */
export class PatientCreatedEvent {
  constructor(
    public readonly patient: Patient,
    public readonly userId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
```

---

## Common Patterns

### Caching Pattern

```typescript
async getById(id: string): Promise<Entity> {
  const cacheKey = `entity:${id}`;

  // Try cache
  const cached = await this.cache.get<Entity>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from database
  const entity = await this.repository.findById(id);

  // Cache result
  if (entity) {
    await this.cache.set(cacheKey, entity, { ttl: 300 });
  }

  return entity;
}
```

### Pagination Pattern

```typescript
async findAll(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Entity>> {
  const offset = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.repository.find({ skip: offset, take: limit }),
    this.repository.count(),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
```

### Transaction Pattern

```typescript
async transferPatient(patientId: string, toNurseId: string): Promise<void> {
  await this.sequelize.transaction(async (transaction) => {
    // All operations use the same transaction
    const patient = await this.patientRepository.findById(patientId, { transaction });

    await this.validateNurse(toNurseId, { transaction });

    patient.nurseId = toNurseId;
    await patient.save({ transaction });

    await this.createTransferLog(patientId, toNurseId, { transaction });

    // If any operation fails, entire transaction rolls back
  });

  // Emit event after successful transaction
  this.eventEmitter.emit('patient.transferred', { patientId, toNurseId });
}
```

---

## Troubleshooting

### Request Context is Undefined

**Problem:** `requestContext` is undefined in service
**Solution:** Add `@Optional()` and provide mock:

```typescript
constructor(
  @Optional() protected readonly requestContext: RequestContextService,
) {
  super(requestContext || mockRequestContext);
}
```

### Events Not Firing

**Problem:** Events emitted but listeners not triggered
**Solutions:**
1. Check `EventEmitterModule` is imported globally
2. Verify listener uses correct event name
3. Check listener is in a provider that's loaded

### Circular Dependency Detected

**Problem:** NestJS throws circular dependency error
**Solutions:**
1. Use event emitter instead of direct injection
2. Use facade pattern with lazy loading
3. Restructure services to remove cycle

### Can't Mock Service in Tests

**Problem:** Hard to mock service with concrete class
**Solution:** Use interface token:

```typescript
// Define interface
export interface IMyService {
  doSomething(id: string): Promise<any>;
}

// Use token
export const MY_SERVICE = Symbol('MY_SERVICE');

// In tests
{ provide: MY_SERVICE, useValue: mockService }
```

---

## Quick Command Reference

```bash
# Create new service
nest g service my-service

# Create new module
nest g module my-module

# Create new controller
nest g controller my-controller

# Run tests
npm test

# Run tests with coverage
npm run test:cov

# Run in development
npm run start:dev
```

---

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Event Emitter](https://docs.nestjs.com/techniques/events)
- [Custom Providers](https://docs.nestjs.com/fundamentals/custom-providers)
- [Request Lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
- [HIPAA Compliance Guide](../docs/HIPAA_COMPLIANCE.md)
