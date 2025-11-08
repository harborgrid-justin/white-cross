# SAN Testing Utilities - Quick Reference Card

## Import Statement

```typescript
import {
  // Your needed utilities
} from './reuse/san/san-testing-utilities-kit';
```

## Common Patterns

### 🎯 Unit Test Setup

```typescript
const { service, repository } = await setupUnitTest(
  ServiceClass,
  'REPOSITORY_TOKEN',
  createMockSANVolumeRepository()
);
```

### 🔗 Integration Test Setup

```typescript
beforeAll(async () => {
  module = await Test.createTestingModule({
    imports: [createTestDatabaseModule([Entity1, Entity2])],
  }).compile();
});

beforeEach(async () => {
  await cleanSANTestData({ volumeRepo, lunRepo });
});
```

### 🌐 E2E Test Setup

```typescript
beforeAll(async () => {
  app = await createE2ETestApp(AppModule);
  context = await createE2ETestContext(app, credentials);
});

afterAll(async () => {
  await cleanupE2ETestResources(context);
  await app.close();
});
```

### ⚡ Performance Test

```typescript
const result = await runPerformanceTest('Operation Name', operation, 100);
assertPerformanceThreshold(result, { maxExecutionTime: 50, minSuccessRate: 95 });
```

## Function Quick Finder

### Need to generate test data?

| What | Function | Example |
|------|----------|---------|
| Single volume | `generateSANVolumeFixture()` | `generateSANVolumeFixture({ name: 'test' })` |
| Multiple volumes | `generateSANVolumeFixtures(count)` | `generateSANVolumeFixtures(10)` |
| Single LUN | `generateSANLUNFixture()` | `generateSANLUNFixture({ lunNumber: 0 })` |
| Multiple LUNs | `generateSANLUNFixtures(count, volumeId)` | `generateSANLUNFixtures(5, 'vol-1')` |
| Single snapshot | `generateSANSnapshotFixture()` | `generateSANSnapshotFixture({ volumeId: 'vol-1' })` |
| Multiple snapshots | `generateSANSnapshotFixtures(count, volumeId)` | `generateSANSnapshotFixtures(10, 'vol-1')` |
| Replication job | `generateSANReplicationJobFixture()` | `generateSANReplicationJobFixture({ replicationType: 'async' })` |
| Full hierarchy | `generateSANHierarchy()` | `const { pool, volumes, luns, snapshots } = generateSANHierarchy()` |

### Need mock repositories?

| What | Function |
|------|----------|
| Volume repository | `createMockSANVolumeRepository(initialData?)` |
| LUN repository | `createMockSANLUNRepository(initialData?)` |
| Snapshot repository | `createMockSANSnapshotRepository(initialData?)` |

### Need mock services?

| What | Function |
|------|----------|
| Replication service | `createMockSANReplicationService()` |
| Storage service | `createMockSANStorageService()` |

### Need to set up tests?

| Test Type | Function |
|-----------|----------|
| Unit test | `setupUnitTest(ServiceClass, token, mockRepo)` |
| Integration test module | `createTestDatabaseModule(entities)` |
| E2E test app | `createE2ETestApp(AppModule)` |
| E2E test context | `createE2ETestContext(app, credentials)` |

### Need to manage test data?

| What | Function |
|------|----------|
| Seed database | `seedSANTestData({ volumeRepo, lunRepo, ... })` |
| Clean database | `cleanSANTestData({ volumeRepo, lunRepo, ... })` |
| Cleanup E2E resources | `cleanupE2ETestResources(context)` |

### Need to test performance?

| What | Function |
|------|----------|
| Measure time | `measureExecutionTime(operation)` |
| Measure memory | `measureMemoryUsage(operation)` |
| Run perf test | `runPerformanceTest(name, operation, iterations)` |
| Run load test | `runLoadTest(name, operation, concurrency, duration)` |
| Assert threshold | `assertPerformanceThreshold(result, thresholds)` |

### Need to make assertions?

| What | Function |
|------|----------|
| Volume properties | `assertSANVolumeProperties(volume, expected)` |
| LUN properties | `assertSANLUNProperties(lun, expected)` |
| Snapshot properties | `assertSANSnapshotProperties(snapshot, expected)` |
| Replication job | `assertReplicationJobProperties(job, expected)` |
| API response | `assertAPIResponse(response, status, properties)` |

### Need test utilities?

| What | Function |
|------|----------|
| Create spy | `createServiceSpy(service, method, returnValue)` |
| Verify call | `verifyMethodCall(spy, expectedArgs, callIndex)` |
| Reset mocks | `resetAllMocks(mocks)` |
| Wait for condition | `waitForCondition(condition, timeout, interval)` |
| Execute auth request | `executeAuthenticatedRequest(app, method, path, token, body)` |

## Code Snippets

### Complete Unit Test

```typescript
describe('VolumeService', () => {
  let service: VolumeService;
  let repository: Repository<Volume>;

  beforeEach(async () => {
    const mockRepo = createMockSANVolumeRepository();
    const result = await setupUnitTest(VolumeService, getRepositoryToken(Volume), mockRepo);
    service = result.service;
    repository = result.repository;
  });

  it('should create volume', async () => {
    const dto = generateSANVolumeFixture({ name: 'test' });
    const volume = await service.create(dto);
    assertSANVolumeProperties(volume, { name: 'test' });
  });
});
```

### Complete Integration Test

```typescript
describe('VolumeModule Integration', () => {
  let module: TestingModule;
  let volumeRepo: Repository<Volume>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [createTestDatabaseModule([Volume])],
    }).compile();
    volumeRepo = module.get(getRepositoryToken(Volume));
  });

  afterAll(async () => await module.close());
  beforeEach(async () => await cleanSANTestData({ volumeRepo }));

  it('should save and retrieve', async () => {
    const data = await seedSANTestData({ volumeRepo });
    expect(data.volumes).toBeDefined();
  });
});
```

### Complete E2E Test

```typescript
describe('Volume API E2E', () => {
  let app: INestApplication;
  let context: E2ETestContext;

  beforeAll(async () => {
    app = await createE2ETestApp(AppModule);
    context = await createE2ETestContext(app, { email: 'test@test.com', password: 'pass' });
  });

  afterAll(async () => {
    await cleanupE2ETestResources(context);
    await app.close();
  });

  it('should create volume via API', async () => {
    const res = await request(app.getHttpServer())
      .post('/san/volumes')
      .set('Authorization', `Bearer ${context.authToken}`)
      .send({ name: 'test', capacity: 1000 })
      .expect(201);

    assertAPIResponse(res, 201, ['id', 'name']);
    context.createdResources.volumes.push(res.body.id);
  });
});
```

### Complete Performance Test

```typescript
describe('Performance', () => {
  it('should meet performance requirements', async () => {
    const result = await runPerformanceTest(
      'Volume Query',
      async () => { await volumeRepo.find(); },
      100
    );

    assertPerformanceThreshold(result, {
      maxExecutionTime: 50,
      minSuccessRate: 99,
      minThroughput: 100,
    });
  });

  it('should handle load', async () => {
    const result = await runLoadTest(
      'Concurrent Creates',
      async () => { await service.create(generateSANVolumeFixture()); },
      10,    // concurrency
      5000   // duration in ms
    );

    expect(result.throughput).toBeGreaterThan(50);
  });
});
```

## Type Reference

### Main Types

```typescript
SANVolumeFixture
SANLUNFixture
SANSnapshotFixture
SANReplicationJobFixture
SANStoragePoolFixture
SANPerformanceMetricsFixture
E2ETestContext
PerformanceTestResult
TestScenario
MockServiceConfig
```

## Performance Thresholds Reference

```typescript
assertPerformanceThreshold(result, {
  maxExecutionTime: 100,    // milliseconds
  maxMemoryUsage: 50,       // MB
  minThroughput: 100,       // operations per second
  minSuccessRate: 95,       // percentage (0-100)
});
```

## Common Overrides

### Volume with specific properties

```typescript
generateSANVolumeFixture({
  name: 'my-volume',
  capacity: 5000,
  capacityUnit: 'TB',
  encryption: true,
  status: 'online',
  tags: { env: 'prod' }
})
```

### LUN with specific properties

```typescript
generateSANLUNFixture({
  lunNumber: 5,
  volumeId: 'vol-123',
  multipath: true,
  readOnly: false
})
```

### Snapshot with specific properties

```typescript
generateSANSnapshotFixture({
  volumeId: 'vol-123',
  type: 'manual',
  status: 'available',
  retentionDays: 30
})
```

## Testing Patterns

### Pattern: Test with Spy

```typescript
const spy = createServiceSpy(service, 'findById', mockVolume);
const result = await service.findById('vol-1');
verifyMethodCall(spy, ['vol-1']);
spy.mockRestore();
```

### Pattern: Wait for Async Operation

```typescript
await waitForCondition(
  async () => {
    const snapshot = await repo.findOne(id);
    return snapshot?.status === 'available';
  },
  5000  // timeout
);
```

### Pattern: Test Complete Hierarchy

```typescript
const { pool, volumes, luns, snapshots } = generateSANHierarchy();
// Use pool, volumes, luns, snapshots in your test
```

### Pattern: Authenticated E2E Request

```typescript
const response = await executeAuthenticatedRequest(
  app,
  'post',
  '/san/volumes',
  context.authToken!,
  { name: 'test', capacity: 1000 }
);
```

## HIPAA Testing Checklist

- [ ] Encryption enabled: `expect(volume.encryption).toBe(true)`
- [ ] Audit trail: `expect(volume.createdAt).toBeDefined()`
- [ ] No real PHI: Use `generateSANVolumeFixture()` only
- [ ] Secure disposal: `await cleanupE2ETestResources(context)`

## Tips

1. **Always clean up**: Use cleanup functions in `afterEach` or `afterAll`
2. **Use fixtures**: Never hardcode test data
3. **Track E2E resources**: Push IDs to `context.createdResources`
4. **Set thresholds**: Define clear performance requirements
5. **Test edge cases**: Not just happy paths
6. **Isolate tests**: Each test should be independent
7. **Use type assertions**: Leverage `assertSANVolumeProperties()` etc.

## Files Location

- Main utilities: `/reuse/san/san-testing-utilities-kit.ts`
- Examples: `/reuse/san/san-testing-utilities-examples.spec.ts`
- Full docs: `/reuse/san/SAN-TESTING-UTILITIES-README.md`

## Getting Help

See the full README for detailed documentation and more examples.
