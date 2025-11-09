"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeLoadTestResults = exports.simulateNetworkTraffic = exports.executeNetworkLoadTest = exports.profileNetworkCPUUsage = exports.testNetworkMemoryUsage = exports.benchmarkNetworkQuery = exports.measureNetworkPerformance = exports.restoreNetworkFromSnapshot = exports.compareNetworkSnapshots = exports.captureNetworkSnapshot = exports.createNetworkTestFixture = exports.createMockNetworkConnections = exports.createMockSecurityGroups = exports.createMockSubnets = exports.createMockNetworks = exports.teardownE2ETestEnvironment = exports.testNetworkConnectionE2E = exports.testNetworkLifecycleE2E = exports.performAuthenticatedE2ERequest = exports.initializeE2ETestEnvironment = exports.testConcurrentNetworkOperations = exports.verifyNetworkStateTransition = exports.testNetworkCrudOperations = exports.assertNetworkRelations = exports.mockNetworkDependencies = exports.createTestTransaction = exports.cleanupTestData = exports.seedNetworkData = exports.createIntegrationTestApp = exports.setupInMemoryDatabase = exports.waitForNetworkState = exports.createMockNetworkEventEmitter = exports.mockNetworkConnectivity = exports.assertNetworkStructure = exports.createTestNetworkData = exports.validateNetworkConfig = exports.spyOnNetworkService = exports.createMockNetworkService = exports.createMockNetworkRepository = exports.createNetworkTestingModule = void 0;
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
const testing_1 = require("@nestjs/testing");
const request = __importStar(require("supertest"));
// ============================================================================
// UNIT TEST HELPERS (1-10)
// ============================================================================
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
const createNetworkTestingModule = async (serviceClass, providers = []) => {
    const moduleBuilder = testing_1.Test.createTestingModule({
        providers: [serviceClass, ...providers],
    });
    return await moduleBuilder.compile();
};
exports.createNetworkTestingModule = createNetworkTestingModule;
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
const createMockNetworkRepository = (overrides = {}) => {
    return {
        find: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(data => data),
        save: jest.fn().mockImplementation(data => data),
        update: jest.fn().mockResolvedValue({ affected: 1 }),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
        count: jest.fn().mockResolvedValue(0),
        ...overrides,
    };
};
exports.createMockNetworkRepository = createMockNetworkRepository;
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
const createMockNetworkService = (overrides = {}) => {
    return {
        createNetwork: jest.fn(),
        getNetwork: jest.fn(),
        updateNetwork: jest.fn(),
        deleteNetwork: jest.fn(),
        listNetworks: jest.fn().mockResolvedValue([]),
        connectNetworks: jest.fn(),
        disconnectNetworks: jest.fn(),
        getNetworkStatus: jest.fn(),
        ...overrides,
    };
};
exports.createMockNetworkService = createMockNetworkService;
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
const spyOnNetworkService = (service, methods) => {
    const spies = {};
    methods.forEach(method => {
        spies[method] = jest.spyOn(service, method);
    });
    return spies;
};
exports.spyOnNetworkService = spyOnNetworkService;
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
const validateNetworkConfig = (config) => {
    const errors = [];
    if (!config.networkId)
        errors.push('networkId is required');
    if (!config.name)
        errors.push('name is required');
    if (!config.cidr)
        errors.push('cidr is required');
    // Validate CIDR format
    if (config.cidr && !/^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/.test(config.cidr)) {
        errors.push('Invalid CIDR format');
    }
    // Validate VLAN ID range
    if (config.vlanId !== undefined && (config.vlanId < 1 || config.vlanId > 4094)) {
        errors.push('VLAN ID must be between 1 and 4094');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateNetworkConfig = validateNetworkConfig;
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
const createTestNetworkData = (overrides = {}) => {
    return {
        networkId: `net-${Date.now()}`,
        name: 'Test Network',
        cidr: '10.0.0.0/16',
        vlanId: 100,
        subnets: [],
        securityGroups: [],
        ...overrides,
    };
};
exports.createTestNetworkData = createTestNetworkData;
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
const assertNetworkStructure = (network, expected) => {
    expect(network).toBeDefined();
    expect(network).toHaveProperty('networkId');
    expect(network).toHaveProperty('name');
    expect(network).toHaveProperty('cidr');
    Object.entries(expected).forEach(([key, value]) => {
        expect(network[key]).toEqual(value);
    });
};
exports.assertNetworkStructure = assertNetworkStructure;
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
const mockNetworkConnectivity = (isConnected, latency = 0) => {
    return jest.fn().mockImplementation(async (networkId) => {
        if (latency > 0) {
            await new Promise(resolve => setTimeout(resolve, latency));
        }
        return {
            networkId,
            connected: isConnected,
            latency,
            timestamp: new Date().toISOString(),
        };
    });
};
exports.mockNetworkConnectivity = mockNetworkConnectivity;
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
const createMockNetworkEventEmitter = () => {
    const listeners = new Map();
    return {
        on: jest.fn((event, handler) => {
            if (!listeners.has(event)) {
                listeners.set(event, []);
            }
            listeners.get(event).push(handler);
        }),
        emit: jest.fn((event, data) => {
            const handlers = listeners.get(event) || [];
            handlers.forEach(handler => handler(data));
        }),
        removeListener: jest.fn((event, handler) => {
            const handlers = listeners.get(event) || [];
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }),
        removeAllListeners: jest.fn(() => {
            listeners.clear();
        }),
    };
};
exports.createMockNetworkEventEmitter = createMockNetworkEventEmitter;
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
const waitForNetworkState = async (checkFn, timeout = 5000, interval = 100) => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const state = await checkFn();
        if (state) {
            return state;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    throw new Error('Timeout waiting for network state');
};
exports.waitForNetworkState = waitForNetworkState;
// ============================================================================
// INTEGRATION TEST UTILITIES (11-20)
// ============================================================================
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
const setupInMemoryDatabase = async (entities) => {
    const { DataSource } = require('typeorm');
    const dataSource = new DataSource({
        type: 'sqlite',
        database: ':memory:',
        entities,
        synchronize: true,
        logging: false,
    });
    await dataSource.initialize();
    return dataSource;
};
exports.setupInMemoryDatabase = setupInMemoryDatabase;
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
const createIntegrationTestApp = async (appModule, imports = []) => {
    const moduleFixture = await testing_1.Test.createTestingModule({
        imports: [appModule, ...imports],
    }).compile();
    const app = moduleFixture.createNestApplication();
    await app.init();
    return app;
};
exports.createIntegrationTestApp = createIntegrationTestApp;
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
const seedNetworkData = async (repository, count = 5) => {
    const networks = [];
    for (let i = 0; i < count; i++) {
        const network = await repository.save({
            networkId: `net-test-${i}`,
            name: `Test Network ${i}`,
            cidr: `10.${i}.0.0/16`,
            vlanId: 100 + i,
            status: 'active',
            createdAt: new Date(),
        });
        networks.push(network);
    }
    return networks;
};
exports.seedNetworkData = seedNetworkData;
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
const cleanupTestData = async (repositories) => {
    for (const repo of repositories) {
        await repo.clear();
    }
};
exports.cleanupTestData = cleanupTestData;
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
const createTestTransaction = async (dataSource) => {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    return queryRunner;
};
exports.createTestTransaction = createTestTransaction;
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
const mockNetworkDependencies = (overrides = {}) => {
    return {
        cloudProvider: {
            createNetwork: jest.fn().mockResolvedValue({ networkId: 'net-123' }),
            deleteNetwork: jest.fn().mockResolvedValue(true),
            updateNetwork: jest.fn().mockResolvedValue(true),
        },
        metricService: {
            recordMetric: jest.fn(),
            getMetrics: jest.fn().mockResolvedValue([]),
        },
        eventBus: {
            publish: jest.fn(),
            subscribe: jest.fn(),
        },
        ...overrides,
    };
};
exports.mockNetworkDependencies = mockNetworkDependencies;
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
const assertNetworkRelations = (network, relations) => {
    relations.forEach(relation => {
        expect(network).toHaveProperty(relation);
        expect(network[relation]).toBeDefined();
    });
};
exports.assertNetworkRelations = assertNetworkRelations;
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
const testNetworkCrudOperations = async (service, testData) => {
    // Create
    const created = await service.createNetwork(testData);
    expect(created.networkId).toBeDefined();
    // Read
    const retrieved = await service.getNetwork(created.networkId);
    expect(retrieved.networkId).toBe(created.networkId);
    // Update
    const updated = await service.updateNetwork(created.networkId, { name: 'Updated Network' });
    expect(updated.name).toBe('Updated Network');
    // Delete
    await service.deleteNetwork(created.networkId);
    await expect(service.getNetwork(created.networkId)).rejects.toThrow();
};
exports.testNetworkCrudOperations = testNetworkCrudOperations;
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
const verifyNetworkStateTransition = async (service, networkId, expectedStates) => {
    for (const state of expectedStates) {
        const network = await service.getNetwork(networkId);
        expect(network.status).toBe(state);
    }
};
exports.verifyNetworkStateTransition = verifyNetworkStateTransition;
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
const testConcurrentNetworkOperations = async (service, concurrency) => {
    const operations = Array.from({ length: concurrency }, (_, i) => service.createNetwork({
        networkId: `net-concurrent-${i}`,
        name: `Concurrent Network ${i}`,
        cidr: `10.${i}.0.0/16`,
    }));
    return await Promise.all(operations);
};
exports.testConcurrentNetworkOperations = testConcurrentNetworkOperations;
// ============================================================================
// E2E TEST FRAMEWORKS (21-25)
// ============================================================================
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
const initializeE2ETestEnvironment = async (appModule) => {
    const testModule = await testing_1.Test.createTestingModule({
        imports: [appModule],
    }).compile();
    const app = testModule.createNestApplication();
    await app.init();
    return {
        app,
        testModule,
        testData: {},
    };
};
exports.initializeE2ETestEnvironment = initializeE2ETestEnvironment;
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
const performAuthenticatedE2ERequest = async (context, method, path, data) => {
    const req = request(context.app.getHttpServer())[method.toLowerCase()](path);
    if (context.authToken) {
        req.set('Authorization', `Bearer ${context.authToken}`);
    }
    if (data) {
        req.send(data);
    }
    return await req;
};
exports.performAuthenticatedE2ERequest = performAuthenticatedE2ERequest;
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
const testNetworkLifecycleE2E = async (context, networkData) => {
    // Create network
    const createResponse = await (0, exports.performAuthenticatedE2ERequest)(context, 'POST', '/networks', networkData);
    expect(createResponse.status).toBe(201);
    const networkId = createResponse.body.networkId;
    // Get network
    const getResponse = await (0, exports.performAuthenticatedE2ERequest)(context, 'GET', `/networks/${networkId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.networkId).toBe(networkId);
    // Update network
    const updateResponse = await (0, exports.performAuthenticatedE2ERequest)(context, 'PATCH', `/networks/${networkId}`, { name: 'Updated Network' });
    expect(updateResponse.status).toBe(200);
    // Delete network
    const deleteResponse = await (0, exports.performAuthenticatedE2ERequest)(context, 'DELETE', `/networks/${networkId}`);
    expect(deleteResponse.status).toBe(204);
};
exports.testNetworkLifecycleE2E = testNetworkLifecycleE2E;
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
const testNetworkConnectionE2E = async (context, sourceNetworkId, targetNetworkId) => {
    const response = await (0, exports.performAuthenticatedE2ERequest)(context, 'POST', '/network-connections', {
        sourceNetworkId,
        targetNetworkId,
        bandwidth: 1000,
    });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('pending');
};
exports.testNetworkConnectionE2E = testNetworkConnectionE2E;
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
const teardownE2ETestEnvironment = async (context) => {
    if (context.app) {
        await context.app.close();
    }
};
exports.teardownE2ETestEnvironment = teardownE2ETestEnvironment;
// ============================================================================
// MOCK FACTORIES (26-30)
// ============================================================================
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
const createMockNetworks = (count, overrides = {}) => {
    return Array.from({ length: count }, (_, i) => ({
        networkId: `net-mock-${i}`,
        name: `Mock Network ${i}`,
        cidr: `10.${i}.0.0/16`,
        vlanId: 100 + i,
        subnets: [],
        securityGroups: [],
        ...overrides,
    }));
};
exports.createMockNetworks = createMockNetworks;
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
const createMockSubnets = (count, networkCidr) => {
    return Array.from({ length: count }, (_, i) => ({
        subnetId: `subnet-mock-${i}`,
        cidr: `10.0.${i}.0/24`,
        availabilityZone: `az-${i % 3}`,
        public: i % 2 === 0,
        tags: { Name: `Mock Subnet ${i}` },
    }));
};
exports.createMockSubnets = createMockSubnets;
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
const createMockSecurityGroups = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        groupId: `sg-mock-${i}`,
        name: `Mock Security Group ${i}`,
        description: `Mock security group for testing ${i}`,
        rules: [
            {
                ruleId: `rule-${i}-0`,
                direction: 'ingress',
                protocol: 'tcp',
                portRange: '80',
                source: '0.0.0.0/0',
                action: 'allow',
            },
        ],
    }));
};
exports.createMockSecurityGroups = createMockSecurityGroups;
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
const createMockNetworkConnections = (networkIds) => {
    const connections = [];
    for (let i = 0; i < networkIds.length - 1; i++) {
        connections.push({
            connectionId: `conn-${i}`,
            sourceNetworkId: networkIds[i],
            targetNetworkId: networkIds[i + 1],
            status: 'active',
            bandwidth: 1000,
        });
    }
    return connections;
};
exports.createMockNetworkConnections = createMockNetworkConnections;
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
const createNetworkTestFixture = (networkCount = 3) => {
    const networks = (0, exports.createMockNetworks)(networkCount);
    const allSubnets = [];
    const allSecurityGroups = [];
    networks.forEach((network, i) => {
        const subnets = (0, exports.createMockSubnets)(2, network.cidr);
        const securityGroups = (0, exports.createMockSecurityGroups)(1);
        network.subnets = subnets;
        network.securityGroups = securityGroups;
        allSubnets.push(...subnets);
        allSecurityGroups.push(...securityGroups);
    });
    const connections = (0, exports.createMockNetworkConnections)(networks.map(n => n.networkId));
    return {
        networks,
        subnets: allSubnets,
        securityGroups: allSecurityGroups,
        connections,
    };
};
exports.createNetworkTestFixture = createNetworkTestFixture;
// ============================================================================
// SNAPSHOT TESTING (31-33)
// ============================================================================
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
const captureNetworkSnapshot = async (networkId, service) => {
    const network = await service.getNetwork(networkId);
    const connections = await service.getNetworkConnections(networkId);
    const routes = await service.getNetworkRoutes(networkId);
    const securityRules = await service.getNetworkSecurityRules(networkId);
    return {
        timestamp: new Date().toISOString(),
        networkId,
        state: network,
        connections,
        routes,
        securityRules,
    };
};
exports.captureNetworkSnapshot = captureNetworkSnapshot;
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
const compareNetworkSnapshots = (snapshot1, snapshot2) => {
    const differences = [];
    if (JSON.stringify(snapshot1.state) !== JSON.stringify(snapshot2.state)) {
        differences.push('Network state changed');
    }
    if (snapshot1.connections.length !== snapshot2.connections.length) {
        differences.push('Connection count changed');
    }
    if (snapshot1.routes.length !== snapshot2.routes.length) {
        differences.push('Route count changed');
    }
    if (snapshot1.securityRules.length !== snapshot2.securityRules.length) {
        differences.push('Security rules count changed');
    }
    return {
        changed: differences.length > 0,
        differences,
    };
};
exports.compareNetworkSnapshots = compareNetworkSnapshots;
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
const restoreNetworkFromSnapshot = async (snapshot, service) => {
    await service.updateNetwork(snapshot.networkId, snapshot.state);
    // Restore connections
    for (const connection of snapshot.connections) {
        await service.createConnection(connection);
    }
    // Restore routes
    for (const route of snapshot.routes) {
        await service.createRoute(route);
    }
    // Restore security rules
    for (const rule of snapshot.securityRules) {
        await service.createSecurityRule(rule);
    }
};
exports.restoreNetworkFromSnapshot = restoreNetworkFromSnapshot;
// ============================================================================
// PERFORMANCE TESTING (34-37)
// ============================================================================
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
const measureNetworkPerformance = async (testName, operation, iterations = 100) => {
    const latencies = [];
    let errors = 0;
    let success = 0;
    const startTime = Date.now();
    for (let i = 0; i < iterations; i++) {
        const iterationStart = Date.now();
        try {
            await operation();
            success++;
            latencies.push(Date.now() - iterationStart);
        }
        catch (error) {
            errors++;
        }
    }
    const duration = Date.now() - startTime;
    const sortedLatencies = latencies.sort((a, b) => a - b);
    return {
        testName,
        duration,
        throughput: (success / duration) * 1000, // ops per second
        latency: {
            min: sortedLatencies[0] || 0,
            max: sortedLatencies[sortedLatencies.length - 1] || 0,
            avg: latencies.reduce((a, b) => a + b, 0) / latencies.length || 0,
            p95: sortedLatencies[Math.floor(latencies.length * 0.95)] || 0,
            p99: sortedLatencies[Math.floor(latencies.length * 0.99)] || 0,
        },
        errors,
        success,
    };
};
exports.measureNetworkPerformance = measureNetworkPerformance;
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
const benchmarkNetworkQuery = async (service, queryType, iterations = 100) => {
    const operation = async () => {
        switch (queryType) {
            case 'listNetworks':
                return await service.listNetworks();
            case 'getNetwork':
                return await service.getNetwork('net-test-0');
            case 'searchNetworks':
                return await service.searchNetworks({ cidr: '10.0.0.0/16' });
            default:
                throw new Error(`Unknown query type: ${queryType}`);
        }
    };
    return await (0, exports.measureNetworkPerformance)(`Query: ${queryType}`, operation, iterations);
};
exports.benchmarkNetworkQuery = benchmarkNetworkQuery;
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
const testNetworkMemoryUsage = async (operation, dataSize) => {
    const initialMemory = process.memoryUsage().heapUsed;
    try {
        await operation();
        const finalMemory = process.memoryUsage().heapUsed;
        const memoryUsed = finalMemory - initialMemory;
        return {
            success: true,
            memoryUsed: Math.round(memoryUsed / 1024 / 1024), // MB
        };
    }
    catch (error) {
        return {
            success: false,
            memoryUsed: 0,
        };
    }
};
exports.testNetworkMemoryUsage = testNetworkMemoryUsage;
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
const profileNetworkCPUUsage = async (operation) => {
    const startCPU = process.cpuUsage();
    await operation();
    const endCPU = process.cpuUsage(startCPU);
    return {
        cpuTime: (endCPU.user + endCPU.system) / 1000, // ms
        userTime: endCPU.user / 1000, // ms
        systemTime: endCPU.system / 1000, // ms
    };
};
exports.profileNetworkCPUUsage = profileNetworkCPUUsage;
// ============================================================================
// LOAD TESTING (38-40)
// ============================================================================
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
const executeNetworkLoadTest = async (config, requestFn) => {
    const results = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        throughput: 0,
        errors: [],
    };
    const responseTimes = [];
    const startTime = Date.now();
    const endTime = startTime + config.duration;
    const executeRequest = async () => {
        const requestStart = Date.now();
        try {
            await requestFn();
            results.successfulRequests++;
            responseTimes.push(Date.now() - requestStart);
        }
        catch (error) {
            results.failedRequests++;
            results.errors.push({
                timestamp: Date.now(),
                error: error.message,
            });
        }
        results.totalRequests++;
    };
    // Execute concurrent requests
    while (Date.now() < endTime) {
        const batch = Array.from({ length: config.concurrency }, () => executeRequest());
        await Promise.all(batch);
        if (config.requestsPerSecond) {
            const delay = 1000 / config.requestsPerSecond;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    results.averageResponseTime =
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0;
    results.throughput = (results.successfulRequests / config.duration) * 1000; // req/sec
    return results;
};
exports.executeNetworkLoadTest = executeNetworkLoadTest;
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
const simulateNetworkTraffic = async (pattern, duration, requestFn) => {
    const getConcurrency = (elapsed) => {
        const progress = elapsed / duration;
        switch (pattern) {
            case 'constant':
                return 10;
            case 'spike':
                return progress < 0.5 ? 10 : 50;
            case 'wave':
                return Math.floor(10 + 20 * Math.sin(progress * Math.PI * 4));
            case 'random':
                return Math.floor(10 + Math.random() * 40);
            default:
                return 10;
        }
    };
    const results = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        throughput: 0,
        errors: [],
    };
    const responseTimes = [];
    const startTime = Date.now();
    while (Date.now() - startTime < duration) {
        const elapsed = Date.now() - startTime;
        const concurrency = getConcurrency(elapsed);
        const requests = Array.from({ length: concurrency }, async () => {
            const requestStart = Date.now();
            try {
                await requestFn();
                results.successfulRequests++;
                responseTimes.push(Date.now() - requestStart);
            }
            catch (error) {
                results.failedRequests++;
                results.errors.push({ timestamp: Date.now(), error: error.message });
            }
            results.totalRequests++;
        });
        await Promise.all(requests);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    results.averageResponseTime =
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0;
    results.throughput = (results.successfulRequests / duration) * 1000;
    return results;
};
exports.simulateNetworkTraffic = simulateNetworkTraffic;
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
const analyzeLoadTestResults = (result) => {
    const recommendations = [];
    const successRate = result.successfulRequests / result.totalRequests;
    if (successRate < 0.95) {
        recommendations.push(`Low success rate (${(successRate * 100).toFixed(2)}%). Consider improving error handling.`);
    }
    if (result.averageResponseTime > 1000) {
        recommendations.push(`High average response time (${result.averageResponseTime.toFixed(2)}ms). Consider optimization.`);
    }
    if (result.throughput < 10) {
        recommendations.push(`Low throughput (${result.throughput.toFixed(2)} req/s). Consider scaling or optimization.`);
    }
    if (result.errors.length > 0) {
        const errorTypes = new Set(result.errors.map(e => e.error));
        recommendations.push(`${result.errors.length} errors occurred. Common errors: ${Array.from(errorTypes).join(', ')}`);
    }
    return {
        passed: successRate >= 0.95 && result.averageResponseTime <= 1000,
        recommendations,
    };
};
exports.analyzeLoadTestResults = analyzeLoadTestResults;
exports.default = {
    // Unit Test Helpers
    createNetworkTestingModule: exports.createNetworkTestingModule,
    createMockNetworkRepository: exports.createMockNetworkRepository,
    createMockNetworkService: exports.createMockNetworkService,
    spyOnNetworkService: exports.spyOnNetworkService,
    validateNetworkConfig: exports.validateNetworkConfig,
    createTestNetworkData: exports.createTestNetworkData,
    assertNetworkStructure: exports.assertNetworkStructure,
    mockNetworkConnectivity: exports.mockNetworkConnectivity,
    createMockNetworkEventEmitter: exports.createMockNetworkEventEmitter,
    waitForNetworkState: exports.waitForNetworkState,
    // Integration Test Utilities
    setupInMemoryDatabase: exports.setupInMemoryDatabase,
    createIntegrationTestApp: exports.createIntegrationTestApp,
    seedNetworkData: exports.seedNetworkData,
    cleanupTestData: exports.cleanupTestData,
    createTestTransaction: exports.createTestTransaction,
    mockNetworkDependencies: exports.mockNetworkDependencies,
    assertNetworkRelations: exports.assertNetworkRelations,
    testNetworkCrudOperations: exports.testNetworkCrudOperations,
    verifyNetworkStateTransition: exports.verifyNetworkStateTransition,
    testConcurrentNetworkOperations: exports.testConcurrentNetworkOperations,
    // E2E Test Frameworks
    initializeE2ETestEnvironment: exports.initializeE2ETestEnvironment,
    performAuthenticatedE2ERequest: exports.performAuthenticatedE2ERequest,
    testNetworkLifecycleE2E: exports.testNetworkLifecycleE2E,
    testNetworkConnectionE2E: exports.testNetworkConnectionE2E,
    teardownE2ETestEnvironment: exports.teardownE2ETestEnvironment,
    // Mock Factories
    createMockNetworks: exports.createMockNetworks,
    createMockSubnets: exports.createMockSubnets,
    createMockSecurityGroups: exports.createMockSecurityGroups,
    createMockNetworkConnections: exports.createMockNetworkConnections,
    createNetworkTestFixture: exports.createNetworkTestFixture,
    // Snapshot Testing
    captureNetworkSnapshot: exports.captureNetworkSnapshot,
    compareNetworkSnapshots: exports.compareNetworkSnapshots,
    restoreNetworkFromSnapshot: exports.restoreNetworkFromSnapshot,
    // Performance Testing
    measureNetworkPerformance: exports.measureNetworkPerformance,
    benchmarkNetworkQuery: exports.benchmarkNetworkQuery,
    testNetworkMemoryUsage: exports.testNetworkMemoryUsage,
    profileNetworkCPUUsage: exports.profileNetworkCPUUsage,
    // Load Testing
    executeNetworkLoadTest: exports.executeNetworkLoadTest,
    simulateNetworkTraffic: exports.simulateNetworkTraffic,
    analyzeLoadTestResults: exports.analyzeLoadTestResults,
};
//# sourceMappingURL=network-testing-kit.js.map