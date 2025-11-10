# SAN Testing Utilities Kit

Comprehensive testing utilities for Storage Area Network (SAN) operations in the White Cross healthcare platform.

## Overview

This testing utilities kit provides 40+ reusable functions for testing SAN operations including volumes, LUNs, snapshots, and replication jobs. It supports unit testing, integration testing, E2E testing, and performance testing with full Jest and Supertest integration.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Type Definitions](#type-definitions)
  - [Data Generators](#data-generators)
  - [Mock Helpers](#mock-helpers)
  - [Unit Test Utilities](#unit-test-utilities)
  - [Integration Test Utilities](#integration-test-utilities)
  - [E2E Test Utilities](#e2e-test-utilities)
  - [Performance Test Utilities](#performance-test-utilities)
  - [Assertion Helpers](#assertion-helpers)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [HIPAA Compliance](#hipaa-compliance)

## Features

- **Type-Safe Fixtures**: Comprehensive TypeScript type definitions for all SAN entities
- **Mock Data Generators**: Generate realistic test data for volumes, LUNs, snapshots, and replication jobs
- **Repository Mocks**: Pre-configured mock repositories for unit testing
- **Database Testing**: In-memory SQLite database setup for integration tests
- **E2E Testing**: Complete E2E test setup with authentication and resource cleanup
- **Performance Testing**: Utilities for measuring execution time, memory usage, and throughput
- **HIPAA Compliance**: Audit trail verification and encryption testing support
- **Jest Integration**: Full compatibility with Jest testing framework
- **Supertest Integration**: HTTP API testing with authentication

## Installation

The utilities are located in the `/reuse/san/` directory of the White Cross project.

```typescript
import {
  generateSANVolumeFixture,
  createMockSANVolumeRepository,
  setupUnitTest,
  createE2ETestApp,
  // ... other utilities
} from './reuse/san/san-testing-utilities-kit';
```

## Quick Start

### Unit Testing

```typescript
import { setupUnitTest, createMockSANVolumeRepository, generateSANVolumeFixture } from './san-testing-utilities-kit';

describe('VolumeService', () => {
  let service: VolumeService;
  let repository: Repository<Volume>;

  beforeEach(async () => {
    const mockRepo = createMockSANVolumeRepository([
      generateSANVolumeFixture({ id: 'vol-1', name: 'test-volume' }),
    ]);

    const result = await setupUnitTest(
      VolumeService,
      getRepositoryToken(Volume),
      mockRepo
    );

    service = result.service;
    repository = result.repository;
  });

  it('should find volume by id', async () => {
    const volume = await service.findById('vol-1');
    expect(volume.name).toBe('test-volume');
  });
});
```

### Integration Testing

```typescript
import { seedSANTestData, cleanSANTestData, createTestDatabaseModule } from './san-testing-utilities-kit';

describe('SAN Integration Tests', () => {
  let module: TestingModule;
  let volumeRepo: Repository<Volume>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        createTestDatabaseModule([Volume, LUN, Snapshot]),
        VolumeModule,
      ],
    }).compile();

    volumeRepo = module.get(getRepositoryToken(Volume));
  });

  beforeEach(async () => {
    await cleanSANTestData({ volumeRepo });
  });

  it('should seed test data', async () => {
    const data = await seedSANTestData({ volumeRepo });
    expect(data.volumes).toHaveLength(3);
  });
});
```

### E2E Testing

```typescript
import { createE2ETestApp, createE2ETestContext, cleanupE2ETestResources } from './san-testing-utilities-kit';
import * as request from 'supertest';

describe('SAN API E2E Tests', () => {
  let app: INestApplication;
  let context: E2ETestContext;

  beforeAll(async () => {
    app = await createE2ETestApp(AppModule);
    context = await createE2ETestContext(app, {
      email: 'test@whitecross.com',
      password: 'Test123!',
    });
  });

  afterAll(async () => {
    await cleanupE2ETestResources(context);
    await app.close();
  });

  it('should create a volume', async () => {
    const response = await request(app.getHttpServer())
      .post('/san/volumes')
      .set('Authorization', `Bearer ${context.authToken}`)
      .send({ name: 'test-volume', capacity: 1000 })
      .expect(201);

    context.createdResources.volumes.push(response.body.id);
  });
});
```

### Performance Testing

```typescript
import { runPerformanceTest, assertPerformanceThreshold } from './san-testing-utilities-kit';

describe('Performance Tests', () => {
  it('should meet performance thresholds', async () => {
    const result = await runPerformanceTest(
      'Volume Creation',
      async () => {
        await volumeService.create({ name: 'perf-test', capacity: 1000 });
      },
      100 // iterations
    );

    assertPerformanceThreshold(result, {
      maxExecutionTime: 50,
      minSuccessRate: 95,
    });
  });
});
```

## API Reference

### Type Definitions

#### SANVolumeFixture

```typescript
interface SANVolumeFixture {
  id?: string;
  name: string;
  capacity: number;
  capacityUnit: 'GB' | 'TB' | 'PB';
  type: 'block' | 'file' | 'object';
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  storagePoolId: string;
  tenantId: string;
  encryption: boolean;
  replicationEnabled: boolean;
  compressionEnabled: boolean;
  deduplicationEnabled: boolean;
  tags?: Record<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
}
```

#### SANLUNFixture

```typescript
interface SANLUNFixture {
  id?: string;
  lunNumber: number;
  volumeId: string;
  capacity: number;
  capacityUnit: 'GB' | 'TB';
  status: 'mapped' | 'unmapped' | 'reserved';
  wwn: string; // World Wide Name
  targetIQN?: string; // iSCSI Qualified Name
  multipath: boolean;
  readOnly: boolean;
  blockSize: number;
  ioProfile: 'random' | 'sequential' | 'mixed';
}
```

#### SANSnapshotFixture

```typescript
interface SANSnapshotFixture {
  id?: string;
  name: string;
  volumeId: string;
  size: number;
  sizeUnit: 'GB' | 'TB';
  type: 'manual' | 'scheduled' | 'replication';
  status: 'creating' | 'available' | 'deleting' | 'error';
  retentionDays: number;
  isConsistent: boolean;
  parentSnapshotId?: string;
  createdAt?: Date;
  expiresAt?: Date;
}
```

#### SANReplicationJobFixture

```typescript
interface SANReplicationJobFixture {
  id?: string;
  name: string;
  sourceVolumeId: string;
  targetVolumeId: string;
  replicationType: 'sync' | 'async' | 'semi-sync';
  schedule?: string;
  status: 'active' | 'paused' | 'failed' | 'completed';
  direction: 'one-way' | 'bi-directional';
  compressionEnabled: boolean;
  bandwidthLimit?: number;
  failoverReady: boolean;
  rpo: number; // Recovery Point Objective
  rto: number; // Recovery Time Objective
}
```

### Data Generators

#### generateSANVolumeFixture

Generates a random SAN volume fixture with realistic data.

```typescript
function generateSANVolumeFixture(
  overrides?: Partial<SANVolumeFixture>
): SANVolumeFixture
```

**Example:**

```typescript
const volume = generateSANVolumeFixture({
  name: 'custom-volume',
  capacity: 2000,
  encryption: true
});
```

#### generateSANLUNFixture

Generates a random SAN LUN fixture.

```typescript
function generateSANLUNFixture(
  overrides?: Partial<SANLUNFixture>
): SANLUNFixture
```

#### generateSANSnapshotFixture

Generates a random SAN snapshot fixture.

```typescript
function generateSANSnapshotFixture(
  overrides?: Partial<SANSnapshotFixture>
): SANSnapshotFixture
```

#### generateSANReplicationJobFixture

Generates a random replication job fixture.

```typescript
function generateSANReplicationJobFixture(
  overrides?: Partial<SANReplicationJobFixture>
): SANReplicationJobFixture
```

#### generateSANVolumeFixtures

Generates multiple volume fixtures.

```typescript
function generateSANVolumeFixtures(
  count: number,
  overrides?: Partial<SANVolumeFixture>
): SANVolumeFixture[]
```

#### generateSANHierarchy

Generates a complete SAN hierarchy with pool, volumes, LUNs, and snapshots.

```typescript
function generateSANHierarchy(): {
  pool: SANStoragePoolFixture;
  volumes: SANVolumeFixture[];
  luns: SANLUNFixture[];
  snapshots: SANSnapshotFixture[];
}
```

**Example:**

```typescript
const hierarchy = generateSANHierarchy();
// hierarchy.pool - 1 storage pool
// hierarchy.volumes - 3 volumes
// hierarchy.luns - 6 LUNs (2 per volume)
// hierarchy.snapshots - 15 snapshots (5 per volume)
```

### Mock Helpers

#### createMockSANVolumeRepository

Creates a mock TypeORM repository for SAN volumes.

```typescript
function createMockSANVolumeRepository(
  mockData?: SANVolumeFixture[]
): Partial<Repository<any>>
```

**Methods available:**
- `find()` - Returns all volumes
- `findOne(options)` - Finds volume by criteria
- `create(dto)` - Creates new volume entity
- `save(entity)` - Saves volume to mock storage
- `update(criteria, dto)` - Updates volume
- `delete(criteria)` - Deletes volume
- `count()` - Returns count of volumes
- `clear()` - Clears all volumes

#### createMockSANLUNRepository

Creates a mock repository for SAN LUNs.

```typescript
function createMockSANLUNRepository(
  mockData?: SANLUNFixture[]
): Partial<Repository<any>>
```

#### createMockSANReplicationService

Creates a mock replication service.

```typescript
function createMockSANReplicationService(): any
```

**Methods:**
- `createReplicationJob(dto)` - Creates replication job
- `getReplicationJob(id)` - Gets job by ID
- `startReplication(id)` - Starts replication
- `pauseReplication(id)` - Pauses replication
- `performFailover(id)` - Performs failover
- `getReplicationStatus(id)` - Gets replication status

### Unit Test Utilities

#### setupUnitTest

Sets up a unit test with a service and mock repository.

```typescript
async function setupUnitTest<T>(
  ServiceClass: new (...args: any[]) => T,
  repositoryToken: string,
  mockRepository: Partial<Repository<any>>
): Promise<{ service: T; repository: Repository<any> }>
```

**Example:**

```typescript
const { service, repository } = await setupUnitTest(
  VolumeService,
  'VOLUME_REPOSITORY',
  createMockSANVolumeRepository()
);
```

#### createServiceSpy

Creates a Jest spy on a service method.

```typescript
function createServiceSpy<T>(
  service: T,
  method: keyof T,
  returnValue?: any
): jest.SpyInstance
```

#### verifyMethodCall

Verifies a method was called with specific arguments.

```typescript
function verifyMethodCall(
  spy: jest.SpyInstance,
  expectedArgs: any[],
  callIndex?: number
): void
```

### Integration Test Utilities

#### createTestDatabaseModule

Creates an in-memory SQLite database for testing.

```typescript
function createTestDatabaseModule(entities: any[]): any
```

**Example:**

```typescript
const dbModule = createTestDatabaseModule([
  VolumeEntity,
  LUNEntity,
  SnapshotEntity
]);
```

#### seedSANTestData

Seeds the database with SAN test data.

```typescript
async function seedSANTestData(
  repositories: {
    volumeRepo?: Repository<any>;
    lunRepo?: Repository<any>;
    snapshotRepo?: Repository<any>;
    poolRepo?: Repository<any>;
  }
): Promise<{
  volumes: any[];
  luns: any[];
  snapshots: any[];
  pools: any[];
}>
```

#### cleanSANTestData

Cleans all SAN test data from the database.

```typescript
async function cleanSANTestData(
  repositories: {
    volumeRepo?: Repository<any>;
    lunRepo?: Repository<any>;
    snapshotRepo?: Repository<any>;
    poolRepo?: Repository<any>;
  }
): Promise<void>
```

#### waitForCondition

Waits for a condition to be met with timeout.

```typescript
async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout?: number,
  interval?: number
): Promise<void>
```

**Example:**

```typescript
await waitForCondition(
  async () => {
    const snapshot = await snapshotRepo.findOne(id);
    return snapshot?.status === 'available';
  },
  5000, // 5 second timeout
  100   // check every 100ms
);
```

### E2E Test Utilities

#### createE2ETestApp

Creates a NestJS application for E2E testing.

```typescript
async function createE2ETestApp(
  moduleClass: any
): Promise<INestApplication>
```

#### createE2ETestContext

Creates an E2E test context with authentication.

```typescript
async function createE2ETestContext(
  app: INestApplication,
  credentials?: { email: string; password: string }
): Promise<E2ETestContext>
```

#### cleanupE2ETestResources

Cleans up all resources created during E2E tests.

```typescript
async function cleanupE2ETestResources(
  context: E2ETestContext
): Promise<void>
```

#### executeAuthenticatedRequest

Executes an authenticated HTTP request.

```typescript
async function executeAuthenticatedRequest(
  app: INestApplication,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  authToken: string,
  body?: any
): Promise<request.Response>
```

### Performance Test Utilities

#### measureExecutionTime

Measures the execution time of an operation.

```typescript
async function measureExecutionTime<T>(
  operation: () => Promise<T>
): Promise<{ result: T; executionTime: number }>
```

**Example:**

```typescript
const { result, executionTime } = await measureExecutionTime(async () => {
  return await volumeService.create(volumeDto);
});

console.log(`Operation took ${executionTime}ms`);
```

#### measureMemoryUsage

Measures memory usage of an operation.

```typescript
async function measureMemoryUsage<T>(
  operation: () => Promise<T>
): Promise<{ result: T; memoryUsage: number }>
```

#### runPerformanceTest

Runs a performance test with multiple iterations.

```typescript
async function runPerformanceTest(
  operationName: string,
  operation: () => Promise<void>,
  iterations?: number
): Promise<PerformanceTestResult>
```

**Example:**

```typescript
const result = await runPerformanceTest(
  'Volume Query',
  async () => {
    await volumeRepo.find();
  },
  100
);

console.log(`Average execution time: ${result.executionTime}ms`);
console.log(`Success rate: ${result.successRate}%`);
```

#### runLoadTest

Runs a load test with concurrent operations.

```typescript
async function runLoadTest(
  operationName: string,
  operation: () => Promise<void>,
  concurrency?: number,
  duration?: number
): Promise<PerformanceTestResult>
```

**Example:**

```typescript
const result = await runLoadTest(
  'Concurrent Volume Creation',
  async () => {
    await volumeService.create(generateSANVolumeFixture());
  },
  10,    // 10 concurrent workers
  10000  // 10 seconds
);

console.log(`Throughput: ${result.throughput} ops/sec`);
```

#### assertPerformanceThreshold

Asserts that performance metrics meet specified thresholds.

```typescript
function assertPerformanceThreshold(
  result: PerformanceTestResult,
  thresholds: {
    maxExecutionTime?: number;
    maxMemoryUsage?: number;
    minThroughput?: number;
    minSuccessRate?: number;
  }
): void
```

### Assertion Helpers

#### assertSANVolumeProperties

Asserts SAN volume properties match expected values.

```typescript
function assertSANVolumeProperties(
  volume: any,
  expected: Partial<SANVolumeFixture>
): void
```

#### assertSANLUNProperties

Asserts SAN LUN properties.

```typescript
function assertSANLUNProperties(
  lun: any,
  expected: Partial<SANLUNFixture>
): void
```

#### assertSANSnapshotProperties

Asserts snapshot properties.

```typescript
function assertSANSnapshotProperties(
  snapshot: any,
  expected: Partial<SANSnapshotFixture>
): void
```

#### assertReplicationJobProperties

Asserts replication job properties.

```typescript
function assertReplicationJobProperties(
  job: any,
  expected: Partial<SANReplicationJobFixture>
): void
```

#### assertAPIResponse

Asserts HTTP API response format and properties.

```typescript
function assertAPIResponse(
  response: request.Response,
  expectedStatus: number,
  expectedProperties?: string[]
): void
```

**Example:**

```typescript
assertAPIResponse(response, 201, ['id', 'name', 'capacity']);
```

## Usage Examples

### Complete Unit Test Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VolumeService } from './volume.service';
import { Volume } from './entities/volume.entity';
import {
  createMockSANVolumeRepository,
  generateSANVolumeFixture,
  assertSANVolumeProperties,
} from './reuse/san/san-testing-utilities-kit';

describe('VolumeService', () => {
  let service: VolumeService;
  let repository: any;

  beforeEach(async () => {
    repository = createMockSANVolumeRepository([
      generateSANVolumeFixture({ id: 'vol-1', name: 'test-vol' }),
    ]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VolumeService,
        {
          provide: getRepositoryToken(Volume),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<VolumeService>(VolumeService);
  });

  it('should find all volumes', async () => {
    const volumes = await service.findAll();

    expect(volumes).toHaveLength(1);
    assertSANVolumeProperties(volumes[0], {
      id: 'vol-1',
      name: 'test-vol',
    });
  });

  it('should create a volume', async () => {
    const dto = { name: 'new-vol', capacity: 1000, capacityUnit: 'GB' };
    const volume = await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalled();
  });
});
```

### Complete E2E Test Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  createE2ETestApp,
  createE2ETestContext,
  cleanupE2ETestResources,
  generateSANVolumeFixture,
  assertAPIResponse,
  E2ETestContext,
} from './reuse/san/san-testing-utilities-kit';

describe('Volume API (e2e)', () => {
  let app: INestApplication;
  let context: E2ETestContext;

  beforeAll(async () => {
    app = await createE2ETestApp(AppModule);
    context = await createE2ETestContext(app, {
      email: 'admin@whitecross.com',
      password: 'Admin123!',
    });
  });

  afterAll(async () => {
    await cleanupE2ETestResources(context);
    await app.close();
  });

  describe('POST /san/volumes', () => {
    it('should create a volume', async () => {
      const dto = {
        name: 'e2e-volume',
        capacity: 1000,
        capacityUnit: 'GB',
        type: 'block',
        storagePoolId: 'pool-1',
      };

      const response = await request(app.getHttpServer())
        .post('/san/volumes')
        .set('Authorization', `Bearer ${context.authToken}`)
        .send(dto)
        .expect(201);

      assertAPIResponse(response, 201, ['id', 'name', 'capacity']);
      context.createdResources.volumes.push(response.body.id);
    });
  });
});
```

## Best Practices

### 1. Use Fixtures Instead of Hardcoded Data

**Bad:**
```typescript
const volume = {
  id: '123',
  name: 'test',
  capacity: 1000,
  // Missing many required fields
};
```

**Good:**
```typescript
const volume = generateSANVolumeFixture({
  name: 'test',
  capacity: 1000,
});
```

### 2. Clean Up Test Data

Always clean up test data in `afterEach` or `afterAll` hooks:

```typescript
afterEach(async () => {
  await cleanSANTestData({ volumeRepo, lunRepo, snapshotRepo });
});
```

### 3. Use Type-Safe Assertions

Use the provided assertion helpers instead of generic expect statements:

```typescript
// Use this
assertSANVolumeProperties(volume, { name: 'test', encryption: true });

// Instead of this
expect(volume.name).toBe('test');
expect(volume.encryption).toBe(true);
```

### 4. Track E2E Resources

Always track created resources for cleanup:

```typescript
const response = await request(app.getHttpServer())
  .post('/san/volumes')
  .send(dto);

context.createdResources.volumes.push(response.body.id);
```

### 5. Use Performance Thresholds

Define clear performance requirements:

```typescript
assertPerformanceThreshold(result, {
  maxExecutionTime: 100,  // 100ms max
  minSuccessRate: 99,     // 99% success rate
  minThroughput: 100,     // 100 ops/second
});
```

### 6. Test Complete Lifecycles

Test entire workflows, not just individual operations:

```typescript
it('should handle complete volume lifecycle', async () => {
  // 1. Create volume
  const volume = await service.create(dto);

  // 2. Create LUNs
  const luns = await service.createLUNs(volume.id, 3);

  // 3. Create snapshots
  const snapshot = await service.createSnapshot(volume.id);

  // 4. Perform cleanup
  await service.deleteVolume(volume.id);
});
```

## HIPAA Compliance

### Encryption Testing

```typescript
it('should enforce encryption for PHI volumes', () => {
  const volume = generateSANVolumeFixture({
    tags: { dataType: 'PHI' },
  });

  // Verify encryption is enabled
  expect(volume.encryption).toBe(true);
});
```

### Audit Trail Verification

```typescript
it('should maintain audit trail', () => {
  const volume = generateSANVolumeFixture();

  expect(volume.createdAt).toBeDefined();
  expect(volume.updatedAt).toBeDefined();
  expect(volume.createdAt).toBeInstanceOf(Date);
});
```

### No Real PHI in Tests

Always use generated test data, never real patient information:

```typescript
// Good - Generated test data
const volume = generateSANVolumeFixture({
  tags: { patientId: 'test-patient-001' }
});

// Bad - Real patient data
const volume = {
  tags: { patientId: 'john-doe-ssn-123-45-6789' } // Never do this!
};
```

## Testing Checklist

- [ ] All unit tests use mock repositories
- [ ] Integration tests clean up data in `afterEach`
- [ ] E2E tests track created resources
- [ ] Performance tests define clear thresholds
- [ ] Encryption is tested for sensitive data
- [ ] Audit trails are verified
- [ ] No real PHI in test data
- [ ] Error cases are tested
- [ ] Edge cases are covered
- [ ] Tests are isolated and independent

## Contributing

When adding new utilities:

1. Add TypeScript type definitions
2. Implement the utility function
3. Add to the exports in `SANTestingUtilities`
4. Create usage examples
5. Update this README
6. Add unit tests for the utility itself

## License

Proprietary - White Cross Healthcare Platform

## Support

For questions or issues with the testing utilities, contact the White Cross development team.
