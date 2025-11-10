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
import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as request from 'supertest';
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
    wwn: string;
    targetIQN?: string;
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
    schedule?: string;
    status: 'active' | 'paused' | 'failed' | 'completed';
    direction: 'one-way' | 'bi-directional';
    compressionEnabled: boolean;
    bandwidthLimit?: number;
    lastReplicationAt?: Date;
    nextReplicationAt?: Date;
    bytesReplicated?: number;
    failoverReady: boolean;
    rpo: number;
    rto: number;
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
    iops: number;
    readIOPS: number;
    writeIOPS: number;
    throughput: number;
    readThroughput: number;
    writeThroughput: number;
    latency: number;
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
/**
 * 1. Generate a random SAN volume fixture
 */
export declare function generateSANVolumeFixture(overrides?: Partial<SANVolumeFixture>): SANVolumeFixture;
/**
 * 2. Generate a random SAN LUN fixture
 */
export declare function generateSANLUNFixture(overrides?: Partial<SANLUNFixture>): SANLUNFixture;
/**
 * 3. Generate a random SAN snapshot fixture
 */
export declare function generateSANSnapshotFixture(overrides?: Partial<SANSnapshotFixture>): SANSnapshotFixture;
/**
 * 4. Generate a random SAN replication job fixture
 */
export declare function generateSANReplicationJobFixture(overrides?: Partial<SANReplicationJobFixture>): SANReplicationJobFixture;
/**
 * 5. Generate a random SAN storage pool fixture
 */
export declare function generateSANStoragePoolFixture(overrides?: Partial<SANStoragePoolFixture>): SANStoragePoolFixture;
/**
 * 6. Generate SAN performance metrics fixture
 */
export declare function generateSANPerformanceMetricsFixture(overrides?: Partial<SANPerformanceMetricsFixture>): SANPerformanceMetricsFixture;
/**
 * 7. Generate multiple SAN volume fixtures
 */
export declare function generateSANVolumeFixtures(count: number, overrides?: Partial<SANVolumeFixture>): SANVolumeFixture[];
/**
 * 8. Generate multiple SAN LUN fixtures
 */
export declare function generateSANLUNFixtures(count: number, volumeId?: string, overrides?: Partial<SANLUNFixture>): SANLUNFixture[];
/**
 * 9. Generate multiple SAN snapshot fixtures
 */
export declare function generateSANSnapshotFixtures(count: number, volumeId?: string, overrides?: Partial<SANSnapshotFixture>): SANSnapshotFixture[];
/**
 * 10. Generate a complete SAN hierarchy (pool -> volume -> LUNs -> snapshots)
 */
export declare function generateSANHierarchy(): {
    pool: SANStoragePoolFixture;
    volumes: SANVolumeFixture[];
    luns: SANLUNFixture[];
    snapshots: SANSnapshotFixture[];
};
/**
 * 11. Create mock SAN volume repository
 */
export declare function createMockSANVolumeRepository(mockData?: SANVolumeFixture[]): Partial<Repository<any>>;
/**
 * 12. Create mock SAN LUN repository
 */
export declare function createMockSANLUNRepository(mockData?: SANLUNFixture[]): Partial<Repository<any>>;
/**
 * 13. Create mock SAN snapshot repository
 */
export declare function createMockSANSnapshotRepository(mockData?: SANSnapshotFixture[]): Partial<Repository<any>>;
/**
 * 14. Create mock SAN replication service
 */
export declare function createMockSANReplicationService(): any;
/**
 * 15. Create mock SAN storage service
 */
export declare function createMockSANStorageService(): any;
/**
 * 16. Create a NestJS testing module with SAN providers
 */
export declare function createSANTestingModule(providers: any[], imports?: any[]): Promise<TestingModule>;
/**
 * 17. Setup unit test with mock repository
 */
export declare function setupUnitTest<T>(ServiceClass: new (...args: any[]) => T, repositoryToken: string, mockRepository: Partial<Repository<any>>): Promise<{
    service: T;
    repository: Repository<any>;
}>;
/**
 * 18. Create spy on service method
 */
export declare function createServiceSpy<T>(service: T, method: keyof T, returnValue?: any): jest.SpyInstance;
/**
 * 19. Verify method was called with specific arguments
 */
export declare function verifyMethodCall(spy: jest.SpyInstance, expectedArgs: any[], callIndex?: number): void;
/**
 * 20. Reset all mocks in a test suite
 */
export declare function resetAllMocks(mocks: jest.Mock[]): void;
/**
 * 21. Create in-memory SQLite database for testing
 */
export declare function createTestDatabaseModule(entities: any[]): any;
/**
 * 22. Seed database with SAN test data
 */
export declare function seedSANTestData(repositories: {
    volumeRepo?: Repository<any>;
    lunRepo?: Repository<any>;
    snapshotRepo?: Repository<any>;
    poolRepo?: Repository<any>;
}): Promise<{
    volumes: any[];
    luns: any[];
    snapshots: any[];
    pools: any[];
}>;
/**
 * 23. Clean all SAN test data from database
 */
export declare function cleanSANTestData(repositories: {
    volumeRepo?: Repository<any>;
    lunRepo?: Repository<any>;
    snapshotRepo?: Repository<any>;
    poolRepo?: Repository<any>;
}): Promise<void>;
/**
 * 24. Create integration test context
 */
export declare function createIntegrationTestContext(moduleMetadata: any): Promise<TestingModule>;
/**
 * 25. Wait for async operation with timeout
 */
export declare function waitForCondition(condition: () => boolean | Promise<boolean>, timeout?: number, interval?: number): Promise<void>;
/**
 * 26. Create E2E test application
 */
export declare function createE2ETestApp(moduleClass: any): Promise<INestApplication>;
/**
 * 27. Get authentication token for E2E tests
 */
export declare function getE2EAuthToken(app: INestApplication, credentials: {
    email: string;
    password: string;
}): Promise<string>;
/**
 * 28. Create E2E test context with auth
 */
export declare function createE2ETestContext(app: INestApplication, credentials?: {
    email: string;
    password: string;
}): Promise<E2ETestContext>;
/**
 * 29. Cleanup E2E test resources
 */
export declare function cleanupE2ETestResources(context: E2ETestContext): Promise<void>;
/**
 * 30. Execute E2E API request with authentication
 */
export declare function executeAuthenticatedRequest(app: INestApplication, method: 'get' | 'post' | 'put' | 'patch' | 'delete', path: string, authToken: string, body?: any): Promise<request.Response>;
/**
 * 31. Measure execution time of an operation
 */
export declare function measureExecutionTime<T>(operation: () => Promise<T>): Promise<{
    result: T;
    executionTime: number;
}>;
/**
 * 32. Measure memory usage of an operation
 */
export declare function measureMemoryUsage<T>(operation: () => Promise<T>): Promise<{
    result: T;
    memoryUsage: number;
}>;
/**
 * 33. Run performance test with multiple iterations
 */
export declare function runPerformanceTest(operationName: string, operation: () => Promise<void>, iterations?: number): Promise<PerformanceTestResult>;
/**
 * 34. Run load test with concurrent operations
 */
export declare function runLoadTest(operationName: string, operation: () => Promise<void>, concurrency?: number, duration?: number): Promise<PerformanceTestResult>;
/**
 * 35. Assert performance meets threshold
 */
export declare function assertPerformanceThreshold(result: PerformanceTestResult, thresholds: {
    maxExecutionTime?: number;
    maxMemoryUsage?: number;
    minThroughput?: number;
    minSuccessRate?: number;
}): void;
/**
 * 36. Assert SAN volume properties
 */
export declare function assertSANVolumeProperties(volume: any, expected: Partial<SANVolumeFixture>): void;
/**
 * 37. Assert SAN LUN properties
 */
export declare function assertSANLUNProperties(lun: any, expected: Partial<SANLUNFixture>): void;
/**
 * 38. Assert SAN snapshot properties
 */
export declare function assertSANSnapshotProperties(snapshot: any, expected: Partial<SANSnapshotFixture>): void;
/**
 * 39. Assert replication job properties
 */
export declare function assertReplicationJobProperties(job: any, expected: Partial<SANReplicationJobFixture>): void;
/**
 * 40. Assert API response format
 */
export declare function assertAPIResponse(response: request.Response, expectedStatus: number, expectedProperties?: string[]): void;
export declare const SANTestingUtilities: {
    generateSANVolumeFixture: typeof generateSANVolumeFixture;
    generateSANLUNFixture: typeof generateSANLUNFixture;
    generateSANSnapshotFixture: typeof generateSANSnapshotFixture;
    generateSANReplicationJobFixture: typeof generateSANReplicationJobFixture;
    generateSANStoragePoolFixture: typeof generateSANStoragePoolFixture;
    generateSANPerformanceMetricsFixture: typeof generateSANPerformanceMetricsFixture;
    generateSANVolumeFixtures: typeof generateSANVolumeFixtures;
    generateSANLUNFixtures: typeof generateSANLUNFixtures;
    generateSANSnapshotFixtures: typeof generateSANSnapshotFixtures;
    generateSANHierarchy: typeof generateSANHierarchy;
    createMockSANVolumeRepository: typeof createMockSANVolumeRepository;
    createMockSANLUNRepository: typeof createMockSANLUNRepository;
    createMockSANSnapshotRepository: typeof createMockSANSnapshotRepository;
    createMockSANReplicationService: typeof createMockSANReplicationService;
    createMockSANStorageService: typeof createMockSANStorageService;
    createSANTestingModule: typeof createSANTestingModule;
    setupUnitTest: typeof setupUnitTest;
    createServiceSpy: typeof createServiceSpy;
    verifyMethodCall: typeof verifyMethodCall;
    resetAllMocks: typeof resetAllMocks;
    createTestDatabaseModule: typeof createTestDatabaseModule;
    seedSANTestData: typeof seedSANTestData;
    cleanSANTestData: typeof cleanSANTestData;
    createIntegrationTestContext: typeof createIntegrationTestContext;
    waitForCondition: typeof waitForCondition;
    createE2ETestApp: typeof createE2ETestApp;
    getE2EAuthToken: typeof getE2EAuthToken;
    createE2ETestContext: typeof createE2ETestContext;
    cleanupE2ETestResources: typeof cleanupE2ETestResources;
    executeAuthenticatedRequest: typeof executeAuthenticatedRequest;
    measureExecutionTime: typeof measureExecutionTime;
    measureMemoryUsage: typeof measureMemoryUsage;
    runPerformanceTest: typeof runPerformanceTest;
    runLoadTest: typeof runLoadTest;
    assertPerformanceThreshold: typeof assertPerformanceThreshold;
    assertSANVolumeProperties: typeof assertSANVolumeProperties;
    assertSANLUNProperties: typeof assertSANLUNProperties;
    assertSANSnapshotProperties: typeof assertSANSnapshotProperties;
    assertReplicationJobProperties: typeof assertReplicationJobProperties;
    assertAPIResponse: typeof assertAPIResponse;
};
export default SANTestingUtilities;
//# sourceMappingURL=san-testing-utilities-kit.d.ts.map