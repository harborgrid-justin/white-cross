/**
 * LOC: NTWKTST001
 * File: /reuse/san/network-testing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable testing utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network module tests
 *   - Integration test suites
 *   - E2E test scenarios
 */
/**
 * File: /reuse/san/network-testing-kit.ts
 * Locator: WC-UTL-NTWK-TEST-001
 * Purpose: Comprehensive Network Testing Utilities - unit tests, integration tests, E2E tests, mocks, fixtures, snapshots, performance, load testing
 *
 * Upstream: Independent utility module for NestJS network testing implementation
 * Downstream: ../backend/*, test suites, network module tests, E2E tests
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Jest 29.x, @nestjs/testing
 * Exports: 40+ utility functions for network testing, mocking, fixtures, performance testing
 *
 * LLM Context: Comprehensive network testing utilities for implementing production-ready test suites.
 * Provides unit test helpers, integration test utilities, E2E frameworks, mock factories, test fixtures,
 * snapshot testing, performance testing, and load testing for software-defined virtual networks.
 */
import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
interface NetworkTestConfig {
    networkId: string;
    name: string;
    cidr: string;
    vlanId?: number;
    subnets?: SubnetConfig[];
    securityGroups?: SecurityGroupConfig[];
}
interface SubnetConfig {
    subnetId: string;
    cidr: string;
    availabilityZone?: string;
    public?: boolean;
    tags?: Record<string, string>;
}
interface SecurityGroupConfig {
    groupId: string;
    name: string;
    description: string;
    rules: SecurityRule[];
}
interface SecurityRule {
    ruleId: string;
    direction: 'ingress' | 'egress';
    protocol: string;
    portRange: string;
    source: string;
    action: 'allow' | 'deny';
}
interface NetworkTestFixture {
    networks: NetworkTestConfig[];
    subnets: SubnetConfig[];
    securityGroups: SecurityGroupConfig[];
    connections: NetworkConnectionFixture[];
}
interface NetworkConnectionFixture {
    connectionId: string;
    sourceNetworkId: string;
    targetNetworkId: string;
    status: 'active' | 'pending' | 'failed';
    bandwidth: number;
}
interface PerformanceTestResult {
    testName: string;
    duration: number;
    throughput: number;
    latency: {
        min: number;
        max: number;
        avg: number;
        p95: number;
        p99: number;
    };
    errors: number;
    success: number;
}
interface LoadTestConfig {
    concurrency: number;
    duration: number;
    rampUpTime?: number;
    requestsPerSecond?: number;
    scenario: string;
}
interface LoadTestResult {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    throughput: number;
    errors: Array<{
        timestamp: number;
        error: string;
    }>;
}
interface NetworkSnapshot {
    timestamp: string;
    networkId: string;
    state: any;
    connections: any[];
    routes: any[];
    securityRules: any[];
}
interface E2ETestContext {
    app: INestApplication;
    testModule: TestingModule;
    authToken?: string;
    testData: Record<string, any>;
}
/**
 * Creates a mock NestJS testing module for network services.
 *
 * @param {any} serviceClass - Service class to test
 * @param {any[]} providers - Additional providers
 * @returns {Promise<TestingModule>} Testing module
 *
 * @example
 * ```typescript
 * const module = await createNetworkTestingModule(NetworkService, [
 *   { provide: 'NETWORK_REPOSITORY', useValue: mockRepository }
 * ]);
 * const service = module.get<NetworkService>(NetworkService);
 * ```
 */
export declare const createNetworkTestingModule: (serviceClass: any, providers?: any[]) => Promise<TestingModule>;
/**
 * Creates a mock network repository for testing.
 *
 * @param {Partial<any>} overrides - Method overrides
 * @returns {any} Mock repository
 *
 * @example
 * ```typescript
 * const mockRepo = createMockNetworkRepository({
 *   findOne: jest.fn().mockResolvedValue(mockNetwork)
 * });
 * ```
 */
export declare const createMockNetworkRepository: (overrides?: Partial<any>) => any;
/**
 * Creates a mock network service for controller testing.
 *
 * @param {Partial<any>} overrides - Method overrides
 * @returns {any} Mock service
 *
 * @example
 * ```typescript
 * const mockService = createMockNetworkService({
 *   createNetwork: jest.fn().mockResolvedValue(mockNetwork)
 * });
 * ```
 */
export declare const createMockNetworkService: (overrides?: Partial<any>) => any;
/**
 * Creates a spy on network service methods.
 *
 * @param {any} service - Service instance
 * @param {string[]} methods - Methods to spy on
 * @returns {Record<string, jest.SpyInstance>} Spy instances
 *
 * @example
 * ```typescript
 * const spies = spyOnNetworkService(networkService, ['createNetwork', 'deleteNetwork']);
 * await networkService.createNetwork(data);
 * expect(spies.createNetwork).toHaveBeenCalledWith(data);
 * ```
 */
export declare const spyOnNetworkService: (service: any, methods: string[]) => Record<string, jest.SpyInstance>;
/**
 * Validates network configuration object structure.
 *
 * @param {any} config - Network configuration
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateNetworkConfig({ networkId: 'net-123', cidr: '10.0.0.0/16' });
 * expect(result.valid).toBe(true);
 * ```
 */
export declare const validateNetworkConfig: (config: any) => {
    valid: boolean;
    errors: string[];
};
/**
 * Creates test data for network entity testing.
 *
 * @param {Partial<NetworkTestConfig>} overrides - Property overrides
 * @returns {NetworkTestConfig} Test network configuration
 *
 * @example
 * ```typescript
 * const network = createTestNetworkData({ name: 'Test Network' });
 * ```
 */
export declare const createTestNetworkData: (overrides?: Partial<NetworkTestConfig>) => NetworkTestConfig;
/**
 * Asserts that a network object matches expected structure.
 *
 * @param {any} network - Network object to test
 * @param {Partial<NetworkTestConfig>} expected - Expected properties
 *
 * @example
 * ```typescript
 * assertNetworkStructure(result, { networkId: 'net-123', cidr: '10.0.0.0/16' });
 * ```
 */
export declare const assertNetworkStructure: (network: any, expected: Partial<NetworkTestConfig>) => void;
/**
 * Mocks network connectivity checks for testing.
 *
 * @param {boolean} isConnected - Connectivity status
 * @param {number} latency - Simulated latency
 * @returns {jest.Mock} Mock function
 *
 * @example
 * ```typescript
 * const checkConnectivity = mockNetworkConnectivity(true, 50);
 * const result = await checkConnectivity('net-123');
 * expect(result.connected).toBe(true);
 * ```
 */
export declare const mockNetworkConnectivity: (isConnected: boolean, latency?: number) => jest.Mock;
/**
 * Creates a mock event emitter for network events.
 *
 * @returns {any} Mock event emitter
 *
 * @example
 * ```typescript
 * const emitter = createMockNetworkEventEmitter();
 * emitter.on('network.created', handler);
 * emitter.emit('network.created', { networkId: 'net-123' });
 * ```
 */
export declare const createMockNetworkEventEmitter: () => any;
/**
 * Waits for network state to reach expected status.
 *
 * @param {Function} checkFn - Function to check state
 * @param {number} timeout - Timeout in milliseconds
 * @param {number} interval - Check interval
 * @returns {Promise<any>} Final state
 *
 * @example
 * ```typescript
 * const state = await waitForNetworkState(
 *   async () => service.getNetworkStatus('net-123'),
 *   5000,
 *   100
 * );
 * ```
 */
export declare const waitForNetworkState: (checkFn: () => Promise<any>, timeout?: number, interval?: number) => Promise<any>;
/**
 * Sets up an in-memory database for integration testing.
 *
 * @param {any[]} entities - TypeORM entities
 * @returns {Promise<any>} Data source
 *
 * @example
 * ```typescript
 * const dataSource = await setupInMemoryDatabase([Network, Subnet]);
 * ```
 */
export declare const setupInMemoryDatabase: (entities: any[]) => Promise<any>;
/**
 * Creates a full NestJS application context for integration tests.
 *
 * @param {any} appModule - Application module
 * @param {any[]} imports - Additional modules
 * @returns {Promise<INestApplication>} Application instance
 *
 * @example
 * ```typescript
 * const app = await createIntegrationTestApp(NetworkModule, [TypeOrmModule]);
 * ```
 */
export declare const createIntegrationTestApp: (appModule: any, imports?: any[]) => Promise<INestApplication>;
/**
 * Seeds test network data into database.
 *
 * @param {any} repository - Repository instance
 * @param {number} count - Number of records to seed
 * @returns {Promise<any[]>} Seeded records
 *
 * @example
 * ```typescript
 * const networks = await seedNetworkData(networkRepository, 10);
 * ```
 */
export declare const seedNetworkData: (repository: any, count?: number) => Promise<any[]>;
/**
 * Cleans up test data from database.
 *
 * @param {any[]} repositories - Repositories to clean
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cleanupTestData([networkRepo, subnetRepo, securityGroupRepo]);
 * ```
 */
export declare const cleanupTestData: (repositories: any[]) => Promise<void>;
/**
 * Creates test transaction for database isolation.
 *
 * @param {any} dataSource - TypeORM data source
 * @returns {Promise<any>} Query runner
 *
 * @example
 * ```typescript
 * const queryRunner = await createTestTransaction(dataSource);
 * await queryRunner.startTransaction();
 * // ... test operations
 * await queryRunner.rollbackTransaction();
 * ```
 */
export declare const createTestTransaction: (dataSource: any) => Promise<any>;
/**
 * Simulates network service dependencies for integration tests.
 *
 * @param {Partial<any>} overrides - Service overrides
 * @returns {any} Mock dependencies
 *
 * @example
 * ```typescript
 * const deps = mockNetworkDependencies({
 *   cloudProvider: mockCloudProvider
 * });
 * ```
 */
export declare const mockNetworkDependencies: (overrides?: Partial<any>) => any;
/**
 * Asserts network relationships are properly loaded.
 *
 * @param {any} network - Network entity
 * @param {string[]} relations - Expected relations
 *
 * @example
 * ```typescript
 * assertNetworkRelations(network, ['subnets', 'securityGroups', 'connections']);
 * ```
 */
export declare const assertNetworkRelations: (network: any, relations: string[]) => void;
/**
 * Tests network CRUD operations in sequence.
 *
 * @param {any} service - Network service
 * @param {NetworkTestConfig} testData - Test data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await testNetworkCrudOperations(networkService, testNetworkData);
 * ```
 */
export declare const testNetworkCrudOperations: (service: any, testData: NetworkTestConfig) => Promise<void>;
/**
 * Verifies network state transitions.
 *
 * @param {any} service - Network service
 * @param {string} networkId - Network ID
 * @param {string[]} expectedStates - Expected state sequence
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await verifyNetworkStateTransition(service, 'net-123', ['pending', 'active', 'deleted']);
 * ```
 */
export declare const verifyNetworkStateTransition: (service: any, networkId: string, expectedStates: string[]) => Promise<void>;
/**
 * Tests concurrent network operations.
 *
 * @param {any} service - Network service
 * @param {number} concurrency - Number of concurrent operations
 * @returns {Promise<any[]>} Results
 *
 * @example
 * ```typescript
 * const results = await testConcurrentNetworkOperations(service, 10);
 * expect(results).toHaveLength(10);
 * ```
 */
export declare const testConcurrentNetworkOperations: (service: any, concurrency: number) => Promise<any[]>;
/**
 * Initializes E2E test environment with full application context.
 *
 * @param {any} appModule - Application module
 * @returns {Promise<E2ETestContext>} Test context
 *
 * @example
 * ```typescript
 * const context = await initializeE2ETestEnvironment(AppModule);
 * const { app } = context;
 * ```
 */
export declare const initializeE2ETestEnvironment: (appModule: any) => Promise<E2ETestContext>;
/**
 * Performs authenticated E2E request.
 *
 * @param {E2ETestContext} context - Test context
 * @param {string} method - HTTP method
 * @param {string} path - Request path
 * @param {any} data - Request data
 * @returns {Promise<any>} Response
 *
 * @example
 * ```typescript
 * const response = await performAuthenticatedE2ERequest(context, 'POST', '/networks', networkData);
 * expect(response.status).toBe(201);
 * ```
 */
export declare const performAuthenticatedE2ERequest: (context: E2ETestContext, method: string, path: string, data?: any) => Promise<any>;
/**
 * Tests complete network lifecycle in E2E scenario.
 *
 * @param {E2ETestContext} context - Test context
 * @param {NetworkTestConfig} networkData - Network data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await testNetworkLifecycleE2E(context, testNetworkData);
 * ```
 */
export declare const testNetworkLifecycleE2E: (context: E2ETestContext, networkData: NetworkTestConfig) => Promise<void>;
/**
 * Tests network connection establishment E2E.
 *
 * @param {E2ETestContext} context - Test context
 * @param {string} sourceNetworkId - Source network
 * @param {string} targetNetworkId - Target network
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await testNetworkConnectionE2E(context, 'net-1', 'net-2');
 * ```
 */
export declare const testNetworkConnectionE2E: (context: E2ETestContext, sourceNetworkId: string, targetNetworkId: string) => Promise<void>;
/**
 * Tears down E2E test environment and cleans up resources.
 *
 * @param {E2ETestContext} context - Test context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await teardownE2ETestEnvironment(context);
 * ```
 */
export declare const teardownE2ETestEnvironment: (context: E2ETestContext) => Promise<void>;
/**
 * Factory for creating mock network entities.
 *
 * @param {number} count - Number of mocks to create
 * @param {Partial<NetworkTestConfig>} overrides - Property overrides
 * @returns {NetworkTestConfig[]} Mock networks
 *
 * @example
 * ```typescript
 * const networks = createMockNetworks(5, { vlanId: 200 });
 * ```
 */
export declare const createMockNetworks: (count: number, overrides?: Partial<NetworkTestConfig>) => NetworkTestConfig[];
/**
 * Factory for creating mock subnet configurations.
 *
 * @param {number} count - Number of subnets
 * @param {string} networkCidr - Parent network CIDR
 * @returns {SubnetConfig[]} Mock subnets
 *
 * @example
 * ```typescript
 * const subnets = createMockSubnets(3, '10.0.0.0/16');
 * ```
 */
export declare const createMockSubnets: (count: number, networkCidr: string) => SubnetConfig[];
/**
 * Factory for creating mock security groups.
 *
 * @param {number} count - Number of security groups
 * @returns {SecurityGroupConfig[]} Mock security groups
 *
 * @example
 * ```typescript
 * const securityGroups = createMockSecurityGroups(2);
 * ```
 */
export declare const createMockSecurityGroups: (count: number) => SecurityGroupConfig[];
/**
 * Factory for creating mock network connections.
 *
 * @param {string[]} networkIds - Network IDs
 * @returns {NetworkConnectionFixture[]} Mock connections
 *
 * @example
 * ```typescript
 * const connections = createMockNetworkConnections(['net-1', 'net-2', 'net-3']);
 * ```
 */
export declare const createMockNetworkConnections: (networkIds: string[]) => NetworkConnectionFixture[];
/**
 * Factory for creating complete network test fixtures.
 *
 * @param {number} networkCount - Number of networks
 * @returns {NetworkTestFixture} Complete fixture
 *
 * @example
 * ```typescript
 * const fixture = createNetworkTestFixture(5);
 * ```
 */
export declare const createNetworkTestFixture: (networkCount?: number) => NetworkTestFixture;
/**
 * Captures network state snapshot for testing.
 *
 * @param {string} networkId - Network ID
 * @param {any} service - Network service
 * @returns {Promise<NetworkSnapshot>} Network snapshot
 *
 * @example
 * ```typescript
 * const snapshot = await captureNetworkSnapshot('net-123', networkService);
 * expect(snapshot).toMatchSnapshot();
 * ```
 */
export declare const captureNetworkSnapshot: (networkId: string, service: any) => Promise<NetworkSnapshot>;
/**
 * Compares network snapshots for changes.
 *
 * @param {NetworkSnapshot} snapshot1 - First snapshot
 * @param {NetworkSnapshot} snapshot2 - Second snapshot
 * @returns {{ changed: boolean; differences: string[] }} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareNetworkSnapshots(beforeSnapshot, afterSnapshot);
 * expect(comparison.changed).toBe(false);
 * ```
 */
export declare const compareNetworkSnapshots: (snapshot1: NetworkSnapshot, snapshot2: NetworkSnapshot) => {
    changed: boolean;
    differences: string[];
};
/**
 * Restores network state from snapshot.
 *
 * @param {NetworkSnapshot} snapshot - Snapshot to restore
 * @param {any} service - Network service
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await restoreNetworkFromSnapshot(snapshot, networkService);
 * ```
 */
export declare const restoreNetworkFromSnapshot: (snapshot: NetworkSnapshot, service: any) => Promise<void>;
/**
 * Measures network operation performance.
 *
 * @param {string} testName - Test name
 * @param {Function} operation - Operation to test
 * @param {number} iterations - Number of iterations
 * @returns {Promise<PerformanceTestResult>} Performance results
 *
 * @example
 * ```typescript
 * const result = await measureNetworkPerformance(
 *   'Create Network',
 *   async () => service.createNetwork(data),
 *   100
 * );
 * ```
 */
export declare const measureNetworkPerformance: (testName: string, operation: () => Promise<any>, iterations?: number) => Promise<PerformanceTestResult>;
/**
 * Benchmarks network query performance.
 *
 * @param {any} service - Network service
 * @param {string} queryType - Type of query
 * @param {number} iterations - Number of iterations
 * @returns {Promise<PerformanceTestResult>} Benchmark results
 *
 * @example
 * ```typescript
 * const result = await benchmarkNetworkQuery(service, 'listNetworks', 1000);
 * ```
 */
export declare const benchmarkNetworkQuery: (service: any, queryType: string, iterations?: number) => Promise<PerformanceTestResult>;
/**
 * Tests network operation under memory pressure.
 *
 * @param {Function} operation - Operation to test
 * @param {number} dataSize - Size of data to process
 * @returns {Promise<{ success: boolean; memoryUsed: number }>} Test result
 *
 * @example
 * ```typescript
 * const result = await testNetworkMemoryUsage(
 *   async () => service.bulkCreateNetworks(largeDataset),
 *   10000
 * );
 * ```
 */
export declare const testNetworkMemoryUsage: (operation: () => Promise<any>, dataSize: number) => Promise<{
    success: boolean;
    memoryUsed: number;
}>;
/**
 * Profiles network operation CPU usage.
 *
 * @param {Function} operation - Operation to profile
 * @returns {Promise<{ cpuTime: number; userTime: number; systemTime: number }>} CPU profile
 *
 * @example
 * ```typescript
 * const profile = await profileNetworkCPUUsage(
 *   async () => service.complexNetworkCalculation()
 * );
 * ```
 */
export declare const profileNetworkCPUUsage: (operation: () => Promise<any>) => Promise<{
    cpuTime: number;
    userTime: number;
    systemTime: number;
}>;
/**
 * Executes load test on network endpoints.
 *
 * @param {LoadTestConfig} config - Load test configuration
 * @param {Function} requestFn - Request function
 * @returns {Promise<LoadTestResult>} Load test results
 *
 * @example
 * ```typescript
 * const result = await executeNetworkLoadTest(
 *   { concurrency: 100, duration: 30000, scenario: 'create-network' },
 *   async () => service.createNetwork(data)
 * );
 * ```
 */
export declare const executeNetworkLoadTest: (config: LoadTestConfig, requestFn: () => Promise<any>) => Promise<LoadTestResult>;
/**
 * Simulates network traffic patterns for load testing.
 *
 * @param {string} pattern - Traffic pattern type
 * @param {number} duration - Duration in milliseconds
 * @param {Function} requestFn - Request function
 * @returns {Promise<LoadTestResult>} Load test results
 *
 * @example
 * ```typescript
 * const result = await simulateNetworkTraffic('spike', 60000, async () => {
 *   return service.handleNetworkRequest();
 * });
 * ```
 */
export declare const simulateNetworkTraffic: (pattern: "constant" | "spike" | "wave" | "random", duration: number, requestFn: () => Promise<any>) => Promise<LoadTestResult>;
/**
 * Analyzes load test results and provides recommendations.
 *
 * @param {LoadTestResult} result - Load test result
 * @returns {{ passed: boolean; recommendations: string[] }} Analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeLoadTestResults(loadTestResult);
 * console.log(analysis.recommendations);
 * ```
 */
export declare const analyzeLoadTestResults: (result: LoadTestResult) => {
    passed: boolean;
    recommendations: string[];
};
declare const _default: {
    createNetworkTestingModule: (serviceClass: any, providers?: any[]) => Promise<TestingModule>;
    createMockNetworkRepository: (overrides?: Partial<any>) => any;
    createMockNetworkService: (overrides?: Partial<any>) => any;
    spyOnNetworkService: (service: any, methods: string[]) => Record<string, jest.SpyInstance>;
    validateNetworkConfig: (config: any) => {
        valid: boolean;
        errors: string[];
    };
    createTestNetworkData: (overrides?: Partial<NetworkTestConfig>) => NetworkTestConfig;
    assertNetworkStructure: (network: any, expected: Partial<NetworkTestConfig>) => void;
    mockNetworkConnectivity: (isConnected: boolean, latency?: number) => jest.Mock;
    createMockNetworkEventEmitter: () => any;
    waitForNetworkState: (checkFn: () => Promise<any>, timeout?: number, interval?: number) => Promise<any>;
    setupInMemoryDatabase: (entities: any[]) => Promise<any>;
    createIntegrationTestApp: (appModule: any, imports?: any[]) => Promise<INestApplication>;
    seedNetworkData: (repository: any, count?: number) => Promise<any[]>;
    cleanupTestData: (repositories: any[]) => Promise<void>;
    createTestTransaction: (dataSource: any) => Promise<any>;
    mockNetworkDependencies: (overrides?: Partial<any>) => any;
    assertNetworkRelations: (network: any, relations: string[]) => void;
    testNetworkCrudOperations: (service: any, testData: NetworkTestConfig) => Promise<void>;
    verifyNetworkStateTransition: (service: any, networkId: string, expectedStates: string[]) => Promise<void>;
    testConcurrentNetworkOperations: (service: any, concurrency: number) => Promise<any[]>;
    initializeE2ETestEnvironment: (appModule: any) => Promise<E2ETestContext>;
    performAuthenticatedE2ERequest: (context: E2ETestContext, method: string, path: string, data?: any) => Promise<any>;
    testNetworkLifecycleE2E: (context: E2ETestContext, networkData: NetworkTestConfig) => Promise<void>;
    testNetworkConnectionE2E: (context: E2ETestContext, sourceNetworkId: string, targetNetworkId: string) => Promise<void>;
    teardownE2ETestEnvironment: (context: E2ETestContext) => Promise<void>;
    createMockNetworks: (count: number, overrides?: Partial<NetworkTestConfig>) => NetworkTestConfig[];
    createMockSubnets: (count: number, networkCidr: string) => SubnetConfig[];
    createMockSecurityGroups: (count: number) => SecurityGroupConfig[];
    createMockNetworkConnections: (networkIds: string[]) => NetworkConnectionFixture[];
    createNetworkTestFixture: (networkCount?: number) => NetworkTestFixture;
    captureNetworkSnapshot: (networkId: string, service: any) => Promise<NetworkSnapshot>;
    compareNetworkSnapshots: (snapshot1: NetworkSnapshot, snapshot2: NetworkSnapshot) => {
        changed: boolean;
        differences: string[];
    };
    restoreNetworkFromSnapshot: (snapshot: NetworkSnapshot, service: any) => Promise<void>;
    measureNetworkPerformance: (testName: string, operation: () => Promise<any>, iterations?: number) => Promise<PerformanceTestResult>;
    benchmarkNetworkQuery: (service: any, queryType: string, iterations?: number) => Promise<PerformanceTestResult>;
    testNetworkMemoryUsage: (operation: () => Promise<any>, dataSize: number) => Promise<{
        success: boolean;
        memoryUsed: number;
    }>;
    profileNetworkCPUUsage: (operation: () => Promise<any>) => Promise<{
        cpuTime: number;
        userTime: number;
        systemTime: number;
    }>;
    executeNetworkLoadTest: (config: LoadTestConfig, requestFn: () => Promise<any>) => Promise<LoadTestResult>;
    simulateNetworkTraffic: (pattern: "constant" | "spike" | "wave" | "random", duration: number, requestFn: () => Promise<any>) => Promise<LoadTestResult>;
    analyzeLoadTestResults: (result: LoadTestResult) => {
        passed: boolean;
        recommendations: string[];
    };
};
export default _default;
//# sourceMappingURL=network-testing-kit.d.ts.map