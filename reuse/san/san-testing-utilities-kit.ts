/**
 * SAN Testing Utilities Kit
 *
 * Comprehensive testing utilities for Storage Area Network (SAN) operations.
 * Provides 40+ reusable functions for unit, integration, and E2E testing.
 *
 * Features:
 * - Type-safe test fixtures and mocks
 * - Mock SAN volumes, LUNs, snapshots, replication jobs
 * - Test data generators with faker
 * - Performance test helpers
 * - Jest and Supertest integration
 * - Database test utilities
 * - HIPAA-compliant test data patterns
 *
 * @module san-testing-utilities-kit
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';

// ============================================================================
// Type Definitions for Test Fixtures
// ============================================================================

/**
 * SAN Volume test fixture type
 */
export interface SANVolumeFixture {
  id?: string;
  name: string;
  capacity: number;
  capacityUnit: 'GB' | 'TB' | 'PB';
  type: 'block' | 'file' | 'object';
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  storagePoolId: string;
  tenantId: string;
  lunIds?: string[];
  snapshotIds?: string[];
  replicationEnabled: boolean;
  encryption: boolean;
  compressionEnabled: boolean;
  deduplicationEnabled: boolean;
  qosPolicy?: string;
  tags?: Record<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * SAN LUN (Logical Unit Number) test fixture type
 */
export interface SANLUNFixture {
  id?: string;
  lunNumber: number;
  volumeId: string;
  capacity: number;
  capacityUnit: 'GB' | 'TB';
  status: 'mapped' | 'unmapped' | 'reserved';
  wwn: string; // World Wide Name
  targetIQN?: string; // iSCSI Qualified Name
  hostGroupId?: string;
  multipath: boolean;
  readOnly: boolean;
  blockSize: number;
  ioProfile: 'random' | 'sequential' | 'mixed';
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * SAN Snapshot test fixture type
 */
export interface SANSnapshotFixture {
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

/**
 * SAN Replication Job test fixture type
 */
export interface SANReplicationJobFixture {
  id?: string;
  name: string;
  sourceVolumeId: string;
  targetVolumeId: string;
  replicationType: 'sync' | 'async' | 'semi-sync';
  schedule?: string; // Cron expression
  status: 'active' | 'paused' | 'failed' | 'completed';
  direction: 'one-way' | 'bi-directional';
  compressionEnabled: boolean;
  bandwidthLimit?: number; // MB/s
  lastReplicationAt?: Date;
  nextReplicationAt?: Date;
  bytesReplicated?: number;
  failoverReady: boolean;
  rpo: number; // Recovery Point Objective in minutes
  rto: number; // Recovery Time Objective in minutes
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * SAN Storage Pool test fixture type
 */
export interface SANStoragePoolFixture {
  id?: string;
  name: string;
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
  capacityUnit: 'TB' | 'PB';
  raidLevel: 'RAID0' | 'RAID1' | 'RAID5' | 'RAID6' | 'RAID10';
  diskCount: number;
  diskType: 'SSD' | 'HDD' | 'NVMe' | 'Hybrid';
  status: 'healthy' | 'degraded' | 'failed';
  performanceTier: 'high' | 'medium' | 'low';
  tenantId: string;
  createdAt?: Date;
}

/**
 * SAN Performance Metrics test fixture type
 */
export interface SANPerformanceMetricsFixture {
  volumeId: string;
  timestamp: Date;
  iops: number; // I/O Operations Per Second
  readIOPS: number;
  writeIOPS: number;
  throughput: number; // MB/s
  readThroughput: number;
  writeThroughput: number;
  latency: number; // milliseconds
  readLatency: number;
  writeLatency: number;
  queueDepth: number;
  utilizationPercent: number;
}

/**
 * Test scenario configuration
 */
export interface TestScenario {
  name: string;
  description: string;
  setup: () => Promise<void>;
  teardown: () => Promise<void>;
  timeout?: number;
}

/**
 * Mock service configuration
 */
export interface MockServiceConfig {
  returnValue?: any;
  throwError?: Error;
  delay?: number;
  callCount?: number;
}

/**
 * E2E test context
 */
export interface E2ETestContext {
  app: INestApplication;
  authToken?: string;
  testUserId?: string;
  createdResources: {
    volumes: string[];
    luns: string[];
    snapshots: string[];
    replicationJobs: string[];
  };
}

/**
 * Performance test result
 */
export interface PerformanceTestResult {
  operationName: string;
  executionTime: number;
  memoryUsage: number;
  throughput?: number;
  successRate: number;
  errorCount: number;
  timestamp: Date;
}

// ============================================================================
// Test Data Generators
// ============================================================================

/**
 * 1. Generate a random SAN volume fixture
 */
export function generateSANVolumeFixture(
  overrides?: Partial<SANVolumeFixture>
): SANVolumeFixture {
  const id = overrides?.id || `vol-${generateRandomId()}`;
  const name = overrides?.name || `test-volume-${generateRandomString(8)}`;

  return {
    id,
    name,
    capacity: overrides?.capacity || getRandomNumber(100, 10000),
    capacityUnit: overrides?.capacityUnit || 'GB',
    type: overrides?.type || 'block',
    status: overrides?.status || 'online',
    storagePoolId: overrides?.storagePoolId || `pool-${generateRandomId()}`,
    tenantId: overrides?.tenantId || `tenant-${generateRandomId()}`,
    lunIds: overrides?.lunIds || [],
    snapshotIds: overrides?.snapshotIds || [],
    replicationEnabled: overrides?.replicationEnabled ?? false,
    encryption: overrides?.encryption ?? true,
    compressionEnabled: overrides?.compressionEnabled ?? false,
    deduplicationEnabled: overrides?.deduplicationEnabled ?? false,
    qosPolicy: overrides?.qosPolicy,
    tags: overrides?.tags || { environment: 'test', purpose: 'testing' },
    createdAt: overrides?.createdAt || new Date(),
    updatedAt: overrides?.updatedAt || new Date(),
    ...overrides,
  };
}

/**
 * 2. Generate a random SAN LUN fixture
 */
export function generateSANLUNFixture(
  overrides?: Partial<SANLUNFixture>
): SANLUNFixture {
  return {
    id: overrides?.id || `lun-${generateRandomId()}`,
    lunNumber: overrides?.lunNumber ?? getRandomNumber(0, 255),
    volumeId: overrides?.volumeId || `vol-${generateRandomId()}`,
    capacity: overrides?.capacity || getRandomNumber(50, 5000),
    capacityUnit: overrides?.capacityUnit || 'GB',
    status: overrides?.status || 'unmapped',
    wwn: overrides?.wwn || generateWWN(),
    targetIQN: overrides?.targetIQN || generateIQN(),
    hostGroupId: overrides?.hostGroupId,
    multipath: overrides?.multipath ?? true,
    readOnly: overrides?.readOnly ?? false,
    blockSize: overrides?.blockSize || 512,
    ioProfile: overrides?.ioProfile || 'mixed',
    createdAt: overrides?.createdAt || new Date(),
    updatedAt: overrides?.updatedAt || new Date(),
    ...overrides,
  };
}

/**
 * 3. Generate a random SAN snapshot fixture
 */
export function generateSANSnapshotFixture(
  overrides?: Partial<SANSnapshotFixture>
): SANSnapshotFixture {
  const createdAt = overrides?.createdAt || new Date();
  const retentionDays = overrides?.retentionDays || 7;
  const expiresAt = new Date(createdAt);
  expiresAt.setDate(expiresAt.getDate() + retentionDays);

  return {
    id: overrides?.id || `snap-${generateRandomId()}`,
    name: overrides?.name || `snapshot-${generateRandomString(8)}`,
    volumeId: overrides?.volumeId || `vol-${generateRandomId()}`,
    size: overrides?.size || getRandomNumber(50, 5000),
    sizeUnit: overrides?.sizeUnit || 'GB',
    type: overrides?.type || 'manual',
    status: overrides?.status || 'available',
    retentionDays,
    isConsistent: overrides?.isConsistent ?? true,
    parentSnapshotId: overrides?.parentSnapshotId,
    createdAt,
    expiresAt: overrides?.expiresAt || expiresAt,
    ...overrides,
  };
}

/**
 * 4. Generate a random SAN replication job fixture
 */
export function generateSANReplicationJobFixture(
  overrides?: Partial<SANReplicationJobFixture>
): SANReplicationJobFixture {
  return {
    id: overrides?.id || `repl-${generateRandomId()}`,
    name: overrides?.name || `replication-${generateRandomString(8)}`,
    sourceVolumeId: overrides?.sourceVolumeId || `vol-${generateRandomId()}`,
    targetVolumeId: overrides?.targetVolumeId || `vol-${generateRandomId()}`,
    replicationType: overrides?.replicationType || 'async',
    schedule: overrides?.schedule || '0 */6 * * *', // Every 6 hours
    status: overrides?.status || 'active',
    direction: overrides?.direction || 'one-way',
    compressionEnabled: overrides?.compressionEnabled ?? true,
    bandwidthLimit: overrides?.bandwidthLimit || 100,
    lastReplicationAt: overrides?.lastReplicationAt,
    nextReplicationAt: overrides?.nextReplicationAt,
    bytesReplicated: overrides?.bytesReplicated || 0,
    failoverReady: overrides?.failoverReady ?? false,
    rpo: overrides?.rpo || 60, // 1 hour
    rto: overrides?.rto || 30, // 30 minutes
    createdAt: overrides?.createdAt || new Date(),
    updatedAt: overrides?.updatedAt || new Date(),
    ...overrides,
  };
}

/**
 * 5. Generate a random SAN storage pool fixture
 */
export function generateSANStoragePoolFixture(
  overrides?: Partial<SANStoragePoolFixture>
): SANStoragePoolFixture {
  const totalCapacity = overrides?.totalCapacity || getRandomNumber(10, 100);
  const usedCapacity = overrides?.usedCapacity || getRandomNumber(1, totalCapacity);

  return {
    id: overrides?.id || `pool-${generateRandomId()}`,
    name: overrides?.name || `storage-pool-${generateRandomString(8)}`,
    totalCapacity,
    usedCapacity,
    availableCapacity: overrides?.availableCapacity || (totalCapacity - usedCapacity),
    capacityUnit: overrides?.capacityUnit || 'TB',
    raidLevel: overrides?.raidLevel || 'RAID5',
    diskCount: overrides?.diskCount || 8,
    diskType: overrides?.diskType || 'SSD',
    status: overrides?.status || 'healthy',
    performanceTier: overrides?.performanceTier || 'high',
    tenantId: overrides?.tenantId || `tenant-${generateRandomId()}`,
    createdAt: overrides?.createdAt || new Date(),
    ...overrides,
  };
}

/**
 * 6. Generate SAN performance metrics fixture
 */
export function generateSANPerformanceMetricsFixture(
  overrides?: Partial<SANPerformanceMetricsFixture>
): SANPerformanceMetricsFixture {
  const iops = overrides?.iops || getRandomNumber(1000, 100000);
  const readIOPS = overrides?.readIOPS || Math.floor(iops * 0.6);
  const writeIOPS = overrides?.writeIOPS || (iops - readIOPS);

  const throughput = overrides?.throughput || getRandomNumber(100, 5000);
  const readThroughput = overrides?.readThroughput || Math.floor(throughput * 0.6);
  const writeThroughput = overrides?.writeThroughput || (throughput - readThroughput);

  return {
    volumeId: overrides?.volumeId || `vol-${generateRandomId()}`,
    timestamp: overrides?.timestamp || new Date(),
    iops,
    readIOPS,
    writeIOPS,
    throughput,
    readThroughput,
    writeThroughput,
    latency: overrides?.latency || getRandomNumber(1, 50),
    readLatency: overrides?.readLatency || getRandomNumber(1, 40),
    writeLatency: overrides?.writeLatency || getRandomNumber(2, 60),
    queueDepth: overrides?.queueDepth || getRandomNumber(1, 32),
    utilizationPercent: overrides?.utilizationPercent || getRandomNumber(10, 95),
    ...overrides,
  };
}

/**
 * 7. Generate multiple SAN volume fixtures
 */
export function generateSANVolumeFixtures(
  count: number,
  overrides?: Partial<SANVolumeFixture>
): SANVolumeFixture[] {
  return Array.from({ length: count }, (_, index) =>
    generateSANVolumeFixture({
      ...overrides,
      name: `test-volume-${index + 1}`,
    })
  );
}

/**
 * 8. Generate multiple SAN LUN fixtures
 */
export function generateSANLUNFixtures(
  count: number,
  volumeId?: string,
  overrides?: Partial<SANLUNFixture>
): SANLUNFixture[] {
  return Array.from({ length: count }, (_, index) =>
    generateSANLUNFixture({
      ...overrides,
      lunNumber: index,
      volumeId: volumeId || `vol-${generateRandomId()}`,
    })
  );
}

/**
 * 9. Generate multiple SAN snapshot fixtures
 */
export function generateSANSnapshotFixtures(
  count: number,
  volumeId?: string,
  overrides?: Partial<SANSnapshotFixture>
): SANSnapshotFixture[] {
  return Array.from({ length: count }, (_, index) =>
    generateSANSnapshotFixture({
      ...overrides,
      name: `snapshot-${index + 1}`,
      volumeId: volumeId || `vol-${generateRandomId()}`,
    })
  );
}

/**
 * 10. Generate a complete SAN hierarchy (pool -> volume -> LUNs -> snapshots)
 */
export function generateSANHierarchy(): {
  pool: SANStoragePoolFixture;
  volumes: SANVolumeFixture[];
  luns: SANLUNFixture[];
  snapshots: SANSnapshotFixture[];
} {
  const pool = generateSANStoragePoolFixture();
  const volumes = generateSANVolumeFixtures(3, { storagePoolId: pool.id });

  const luns = volumes.flatMap((volume) =>
    generateSANLUNFixtures(2, volume.id)
  );

  const snapshots = volumes.flatMap((volume) =>
    generateSANSnapshotFixtures(5, volume.id)
  );

  return { pool, volumes, luns, snapshots };
}

// ============================================================================
// Mock Data Helpers
// ============================================================================

/**
 * 11. Create mock SAN volume repository
 */
export function createMockSANVolumeRepository(
  mockData: SANVolumeFixture[] = []
): Partial<Repository<any>> {
  const data = [...mockData];

  return {
    find: jest.fn().mockResolvedValue(data),
    findOne: jest.fn().mockImplementation(({ where }) => {
      const found = data.find((item) => item.id === where.id);
      return Promise.resolve(found || null);
    }),
    create: jest.fn().mockImplementation((dto) => ({ ...dto, id: generateRandomId() })),
    save: jest.fn().mockImplementation((entity) => {
      const saved = { ...entity, id: entity.id || generateRandomId() };
      data.push(saved);
      return Promise.resolve(saved);
    }),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    count: jest.fn().mockResolvedValue(data.length),
    clear: jest.fn().mockResolvedValue(undefined),
  };
}

/**
 * 12. Create mock SAN LUN repository
 */
export function createMockSANLUNRepository(
  mockData: SANLUNFixture[] = []
): Partial<Repository<any>> {
  const data = [...mockData];

  return {
    find: jest.fn().mockResolvedValue(data),
    findOne: jest.fn().mockImplementation(({ where }) => {
      const found = data.find((item) => item.id === where.id || item.lunNumber === where.lunNumber);
      return Promise.resolve(found || null);
    }),
    create: jest.fn().mockImplementation((dto) => ({ ...dto, id: generateRandomId() })),
    save: jest.fn().mockImplementation((entity) => {
      const saved = { ...entity, id: entity.id || generateRandomId() };
      data.push(saved);
      return Promise.resolve(saved);
    }),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    count: jest.fn().mockResolvedValue(data.length),
  };
}

/**
 * 13. Create mock SAN snapshot repository
 */
export function createMockSANSnapshotRepository(
  mockData: SANSnapshotFixture[] = []
): Partial<Repository<any>> {
  const data = [...mockData];

  return {
    find: jest.fn().mockResolvedValue(data),
    findOne: jest.fn().mockImplementation(({ where }) => {
      const found = data.find((item) => item.id === where.id);
      return Promise.resolve(found || null);
    }),
    create: jest.fn().mockImplementation((dto) => ({ ...dto, id: generateRandomId() })),
    save: jest.fn().mockImplementation((entity) => {
      const saved = { ...entity, id: entity.id || generateRandomId() };
      data.push(saved);
      return Promise.resolve(saved);
    }),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };
}

/**
 * 14. Create mock SAN replication service
 */
export function createMockSANReplicationService(): any {
  return {
    createReplicationJob: jest.fn().mockImplementation((dto) =>
      Promise.resolve(generateSANReplicationJobFixture(dto))
    ),
    getReplicationJob: jest.fn().mockImplementation((id) =>
      Promise.resolve(generateSANReplicationJobFixture({ id }))
    ),
    startReplication: jest.fn().mockResolvedValue({ status: 'active' }),
    pauseReplication: jest.fn().mockResolvedValue({ status: 'paused' }),
    performFailover: jest.fn().mockResolvedValue({ status: 'completed' }),
    getReplicationStatus: jest.fn().mockResolvedValue({
      status: 'active',
      bytesReplicated: 1024 * 1024 * 100,
      progress: 75,
    }),
  };
}

/**
 * 15. Create mock SAN storage service
 */
export function createMockSANStorageService(): any {
  return {
    createVolume: jest.fn().mockImplementation((dto) =>
      Promise.resolve(generateSANVolumeFixture(dto))
    ),
    getVolume: jest.fn().mockImplementation((id) =>
      Promise.resolve(generateSANVolumeFixture({ id }))
    ),
    updateVolume: jest.fn().mockImplementation((id, dto) =>
      Promise.resolve(generateSANVolumeFixture({ id, ...dto }))
    ),
    deleteVolume: jest.fn().mockResolvedValue(undefined),
    expandVolume: jest.fn().mockResolvedValue({ capacity: 2000 }),
    getVolumeMetrics: jest.fn().mockImplementation((id) =>
      Promise.resolve(generateSANPerformanceMetricsFixture({ volumeId: id }))
    ),
  };
}

// ============================================================================
// Unit Test Utilities
// ============================================================================

/**
 * 16. Create a NestJS testing module with SAN providers
 */
export async function createSANTestingModule(
  providers: any[],
  imports: any[] = []
): Promise<TestingModule> {
  return Test.createTestingModule({
    imports,
    providers,
  }).compile();
}

/**
 * 17. Setup unit test with mock repository
 */
export async function setupUnitTest<T>(
  ServiceClass: new (...args: any[]) => T,
  repositoryToken: string,
  mockRepository: Partial<Repository<any>>
): Promise<{ service: T; repository: Repository<any> }> {
  const module = await Test.createTestingModule({
    providers: [
      ServiceClass,
      {
        provide: repositoryToken,
        useValue: mockRepository,
      },
    ],
  }).compile();

  return {
    service: module.get<T>(ServiceClass),
    repository: module.get<Repository<any>>(repositoryToken),
  };
}

/**
 * 18. Create spy on service method
 */
export function createServiceSpy<T>(
  service: T,
  method: keyof T,
  returnValue?: any
): jest.SpyInstance {
  const spy = jest.spyOn(service as any, method as string);
  if (returnValue !== undefined) {
    spy.mockResolvedValue(returnValue);
  }
  return spy;
}

/**
 * 19. Verify method was called with specific arguments
 */
export function verifyMethodCall(
  spy: jest.SpyInstance,
  expectedArgs: any[],
  callIndex: number = 0
): void {
  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[callIndex]).toEqual(expectedArgs);
}

/**
 * 20. Reset all mocks in a test suite
 */
export function resetAllMocks(mocks: jest.Mock[]): void {
  mocks.forEach((mock) => mock.mockReset());
}

// ============================================================================
// Integration Test Utilities
// ============================================================================

/**
 * 21. Create in-memory SQLite database for testing
 */
export function createTestDatabaseModule(entities: any[]): any {
  return TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    entities,
    synchronize: true,
    logging: false,
    dropSchema: true,
  });
}

/**
 * 22. Seed database with SAN test data
 */
export async function seedSANTestData(
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
}> {
  const pools = repositories.poolRepo
    ? await repositories.poolRepo.save(generateSANStoragePoolFixture())
    : [];

  const volumes = repositories.volumeRepo
    ? await repositories.volumeRepo.save(
        generateSANVolumeFixtures(3, {
          storagePoolId: Array.isArray(pools) ? pools[0]?.id : pools?.id,
        })
      )
    : [];

  const luns = repositories.lunRepo
    ? await repositories.lunRepo.save(
        generateSANLUNFixtures(5, volumes[0]?.id)
      )
    : [];

  const snapshots = repositories.snapshotRepo
    ? await repositories.snapshotRepo.save(
        generateSANSnapshotFixtures(10, volumes[0]?.id)
      )
    : [];

  return { volumes, luns, snapshots, pools: Array.isArray(pools) ? pools : [pools] };
}

/**
 * 23. Clean all SAN test data from database
 */
export async function cleanSANTestData(
  repositories: {
    volumeRepo?: Repository<any>;
    lunRepo?: Repository<any>;
    snapshotRepo?: Repository<any>;
    poolRepo?: Repository<any>;
  }
): Promise<void> {
  if (repositories.snapshotRepo) await repositories.snapshotRepo.clear();
  if (repositories.lunRepo) await repositories.lunRepo.clear();
  if (repositories.volumeRepo) await repositories.volumeRepo.clear();
  if (repositories.poolRepo) await repositories.poolRepo.clear();
}

/**
 * 24. Create integration test context
 */
export async function createIntegrationTestContext(
  moduleMetadata: any
): Promise<TestingModule> {
  const module = await Test.createTestingModule(moduleMetadata).compile();
  return module;
}

/**
 * 25. Wait for async operation with timeout
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const result = await condition();
    if (result) return;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

// ============================================================================
// E2E Test Utilities
// ============================================================================

/**
 * 26. Create E2E test application
 */
export async function createE2ETestApp(
  moduleClass: any
): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [moduleClass],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.init();
  return app;
}

/**
 * 27. Get authentication token for E2E tests
 */
export async function getE2EAuthToken(
  app: INestApplication,
  credentials: { email: string; password: string }
): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send(credentials)
    .expect(200);

  return response.body.accessToken || response.body.token;
}

/**
 * 28. Create E2E test context with auth
 */
export async function createE2ETestContext(
  app: INestApplication,
  credentials?: { email: string; password: string }
): Promise<E2ETestContext> {
  let authToken: string | undefined;

  if (credentials) {
    authToken = await getE2EAuthToken(app, credentials);
  }

  return {
    app,
    authToken,
    createdResources: {
      volumes: [],
      luns: [],
      snapshots: [],
      replicationJobs: [],
    },
  };
}

/**
 * 29. Cleanup E2E test resources
 */
export async function cleanupE2ETestResources(
  context: E2ETestContext
): Promise<void> {
  const { app, authToken, createdResources } = context;
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

  // Delete in reverse order of dependencies
  for (const snapshotId of createdResources.snapshots) {
    await request(app.getHttpServer())
      .delete(`/san/snapshots/${snapshotId}`)
      .set(headers)
      .catch(() => {}); // Ignore errors during cleanup
  }

  for (const lunId of createdResources.luns) {
    await request(app.getHttpServer())
      .delete(`/san/luns/${lunId}`)
      .set(headers)
      .catch(() => {});
  }

  for (const volumeId of createdResources.volumes) {
    await request(app.getHttpServer())
      .delete(`/san/volumes/${volumeId}`)
      .set(headers)
      .catch(() => {});
  }

  for (const jobId of createdResources.replicationJobs) {
    await request(app.getHttpServer())
      .delete(`/san/replication/${jobId}`)
      .set(headers)
      .catch(() => {});
  }
}

/**
 * 30. Execute E2E API request with authentication
 */
export async function executeAuthenticatedRequest(
  app: INestApplication,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  authToken: string,
  body?: any
): Promise<request.Response> {
  const req = request(app.getHttpServer())[method](path)
    .set('Authorization', `Bearer ${authToken}`);

  if (body) {
    req.send(body);
  }

  return req;
}

// ============================================================================
// Performance Test Utilities
// ============================================================================

/**
 * 31. Measure execution time of an operation
 */
export async function measureExecutionTime<T>(
  operation: () => Promise<T>
): Promise<{ result: T; executionTime: number }> {
  const startTime = process.hrtime.bigint();
  const result = await operation();
  const endTime = process.hrtime.bigint();
  const executionTime = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds

  return { result, executionTime };
}

/**
 * 32. Measure memory usage of an operation
 */
export async function measureMemoryUsage<T>(
  operation: () => Promise<T>
): Promise<{ result: T; memoryUsage: number }> {
  const startMemory = process.memoryUsage().heapUsed;
  const result = await operation();
  const endMemory = process.memoryUsage().heapUsed;
  const memoryUsage = (endMemory - startMemory) / 1024 / 1024; // Convert to MB

  return { result, memoryUsage };
}

/**
 * 33. Run performance test with multiple iterations
 */
export async function runPerformanceTest(
  operationName: string,
  operation: () => Promise<void>,
  iterations: number = 100
): Promise<PerformanceTestResult> {
  const executionTimes: number[] = [];
  let errorCount = 0;

  const startMemory = process.memoryUsage().heapUsed;

  for (let i = 0; i < iterations; i++) {
    try {
      const { executionTime } = await measureExecutionTime(operation);
      executionTimes.push(executionTime);
    } catch (error) {
      errorCount++;
    }
  }

  const endMemory = process.memoryUsage().heapUsed;
  const memoryUsage = (endMemory - startMemory) / 1024 / 1024;

  const avgExecutionTime =
    executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length;

  return {
    operationName,
    executionTime: avgExecutionTime,
    memoryUsage,
    throughput: iterations / (avgExecutionTime / 1000),
    successRate: ((iterations - errorCount) / iterations) * 100,
    errorCount,
    timestamp: new Date(),
  };
}

/**
 * 34. Run load test with concurrent operations
 */
export async function runLoadTest(
  operationName: string,
  operation: () => Promise<void>,
  concurrency: number = 10,
  duration: number = 10000 // milliseconds
): Promise<PerformanceTestResult> {
  const startTime = Date.now();
  const startMemory = process.memoryUsage().heapUsed;
  let successCount = 0;
  let errorCount = 0;

  const workers = Array.from({ length: concurrency }, async () => {
    while (Date.now() - startTime < duration) {
      try {
        await operation();
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }
  });

  await Promise.all(workers);

  const totalTime = Date.now() - startTime;
  const endMemory = process.memoryUsage().heapUsed;
  const memoryUsage = (endMemory - startMemory) / 1024 / 1024;

  const totalOperations = successCount + errorCount;

  return {
    operationName,
    executionTime: totalTime / totalOperations,
    memoryUsage,
    throughput: (totalOperations / totalTime) * 1000, // ops per second
    successRate: (successCount / totalOperations) * 100,
    errorCount,
    timestamp: new Date(),
  };
}

/**
 * 35. Assert performance meets threshold
 */
export function assertPerformanceThreshold(
  result: PerformanceTestResult,
  thresholds: {
    maxExecutionTime?: number;
    maxMemoryUsage?: number;
    minThroughput?: number;
    minSuccessRate?: number;
  }
): void {
  if (thresholds.maxExecutionTime !== undefined) {
    expect(result.executionTime).toBeLessThanOrEqual(thresholds.maxExecutionTime);
  }

  if (thresholds.maxMemoryUsage !== undefined) {
    expect(result.memoryUsage).toBeLessThanOrEqual(thresholds.maxMemoryUsage);
  }

  if (thresholds.minThroughput !== undefined && result.throughput !== undefined) {
    expect(result.throughput).toBeGreaterThanOrEqual(thresholds.minThroughput);
  }

  if (thresholds.minSuccessRate !== undefined) {
    expect(result.successRate).toBeGreaterThanOrEqual(thresholds.minSuccessRate);
  }
}

// ============================================================================
// Assertion Helpers
// ============================================================================

/**
 * 36. Assert SAN volume properties
 */
export function assertSANVolumeProperties(
  volume: any,
  expected: Partial<SANVolumeFixture>
): void {
  expect(volume).toBeDefined();
  if (expected.id) expect(volume.id).toBe(expected.id);
  if (expected.name) expect(volume.name).toBe(expected.name);
  if (expected.capacity) expect(volume.capacity).toBe(expected.capacity);
  if (expected.capacityUnit) expect(volume.capacityUnit).toBe(expected.capacityUnit);
  if (expected.type) expect(volume.type).toBe(expected.type);
  if (expected.status) expect(volume.status).toBe(expected.status);
  if (expected.encryption !== undefined) expect(volume.encryption).toBe(expected.encryption);
}

/**
 * 37. Assert SAN LUN properties
 */
export function assertSANLUNProperties(
  lun: any,
  expected: Partial<SANLUNFixture>
): void {
  expect(lun).toBeDefined();
  if (expected.id) expect(lun.id).toBe(expected.id);
  if (expected.lunNumber !== undefined) expect(lun.lunNumber).toBe(expected.lunNumber);
  if (expected.volumeId) expect(lun.volumeId).toBe(expected.volumeId);
  if (expected.capacity) expect(lun.capacity).toBe(expected.capacity);
  if (expected.status) expect(lun.status).toBe(expected.status);
  if (expected.wwn) expect(lun.wwn).toBe(expected.wwn);
}

/**
 * 38. Assert SAN snapshot properties
 */
export function assertSANSnapshotProperties(
  snapshot: any,
  expected: Partial<SANSnapshotFixture>
): void {
  expect(snapshot).toBeDefined();
  if (expected.id) expect(snapshot.id).toBe(expected.id);
  if (expected.name) expect(snapshot.name).toBe(expected.name);
  if (expected.volumeId) expect(snapshot.volumeId).toBe(expected.volumeId);
  if (expected.type) expect(snapshot.type).toBe(expected.type);
  if (expected.status) expect(snapshot.status).toBe(expected.status);
  if (expected.isConsistent !== undefined) {
    expect(snapshot.isConsistent).toBe(expected.isConsistent);
  }
}

/**
 * 39. Assert replication job properties
 */
export function assertReplicationJobProperties(
  job: any,
  expected: Partial<SANReplicationJobFixture>
): void {
  expect(job).toBeDefined();
  if (expected.id) expect(job.id).toBe(expected.id);
  if (expected.name) expect(job.name).toBe(expected.name);
  if (expected.sourceVolumeId) expect(job.sourceVolumeId).toBe(expected.sourceVolumeId);
  if (expected.targetVolumeId) expect(job.targetVolumeId).toBe(expected.targetVolumeId);
  if (expected.replicationType) expect(job.replicationType).toBe(expected.replicationType);
  if (expected.status) expect(job.status).toBe(expected.status);
  if (expected.failoverReady !== undefined) {
    expect(job.failoverReady).toBe(expected.failoverReady);
  }
}

/**
 * 40. Assert API response format
 */
export function assertAPIResponse(
  response: request.Response,
  expectedStatus: number,
  expectedProperties?: string[]
): void {
  expect(response.status).toBe(expectedStatus);

  if (expectedProperties) {
    expectedProperties.forEach((prop) => {
      expect(response.body).toHaveProperty(prop);
    });
  }
}

// ============================================================================
// Helper Functions (Internal)
// ============================================================================

/**
 * Generate a random ID
 */
function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

/**
 * Generate a random string
 */
function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random number between min and max
 */
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a World Wide Name (WWN)
 */
function generateWWN(): string {
  const segments = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  );
  return segments.join(':');
}

/**
 * Generate an iSCSI Qualified Name (IQN)
 */
function generateIQN(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const domain = 'whitecross.healthcare';
  const identifier = generateRandomString(8);

  return `iqn.${year}-${month}.${domain}:${identifier}`;
}

// ============================================================================
// Export All Utilities
// ============================================================================

export const SANTestingUtilities = {
  // Data Generators
  generateSANVolumeFixture,
  generateSANLUNFixture,
  generateSANSnapshotFixture,
  generateSANReplicationJobFixture,
  generateSANStoragePoolFixture,
  generateSANPerformanceMetricsFixture,
  generateSANVolumeFixtures,
  generateSANLUNFixtures,
  generateSANSnapshotFixtures,
  generateSANHierarchy,

  // Mock Helpers
  createMockSANVolumeRepository,
  createMockSANLUNRepository,
  createMockSANSnapshotRepository,
  createMockSANReplicationService,
  createMockSANStorageService,

  // Unit Test Utilities
  createSANTestingModule,
  setupUnitTest,
  createServiceSpy,
  verifyMethodCall,
  resetAllMocks,

  // Integration Test Utilities
  createTestDatabaseModule,
  seedSANTestData,
  cleanSANTestData,
  createIntegrationTestContext,
  waitForCondition,

  // E2E Test Utilities
  createE2ETestApp,
  getE2EAuthToken,
  createE2ETestContext,
  cleanupE2ETestResources,
  executeAuthenticatedRequest,

  // Performance Test Utilities
  measureExecutionTime,
  measureMemoryUsage,
  runPerformanceTest,
  runLoadTest,
  assertPerformanceThreshold,

  // Assertion Helpers
  assertSANVolumeProperties,
  assertSANLUNProperties,
  assertSANSnapshotProperties,
  assertReplicationJobProperties,
  assertAPIResponse,
};

export default SANTestingUtilities;
