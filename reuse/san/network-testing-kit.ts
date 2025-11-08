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

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

interface NetworkMockConfig {
  autoConnect?: boolean;
  latency?: number;
  packetLoss?: number;
  bandwidth?: number;
  simulateFailures?: boolean;
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
  errors: Array<{ timestamp: number; error: string }>;
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
export const createNetworkTestingModule = async (
  serviceClass: any,
  providers: any[] = [],
): Promise<TestingModule> => {
  const moduleBuilder = Test.createTestingModule({
    providers: [serviceClass, ...providers],
  });

  return await moduleBuilder.compile();
};

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
export const createMockNetworkRepository = (overrides: Partial<any> = {}): any => {
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
export const createMockNetworkService = (overrides: Partial<any> = {}): any => {
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
export const spyOnNetworkService = (
  service: any,
  methods: string[],
): Record<string, jest.SpyInstance> => {
  const spies: Record<string, jest.SpyInstance> = {};
  methods.forEach(method => {
    spies[method] = jest.spyOn(service, method);
  });
  return spies;
};

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
export const validateNetworkConfig = (config: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config.networkId) errors.push('networkId is required');
  if (!config.name) errors.push('name is required');
  if (!config.cidr) errors.push('cidr is required');

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
export const createTestNetworkData = (
  overrides: Partial<NetworkTestConfig> = {},
): NetworkTestConfig => {
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
export const assertNetworkStructure = (
  network: any,
  expected: Partial<NetworkTestConfig>,
): void => {
  expect(network).toBeDefined();
  expect(network).toHaveProperty('networkId');
  expect(network).toHaveProperty('name');
  expect(network).toHaveProperty('cidr');

  Object.entries(expected).forEach(([key, value]) => {
    expect(network[key]).toEqual(value);
  });
};

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
export const mockNetworkConnectivity = (
  isConnected: boolean,
  latency: number = 0,
): jest.Mock => {
  return jest.fn().mockImplementation(async (networkId: string) => {
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
export const createMockNetworkEventEmitter = (): any => {
  const listeners = new Map<string, Function[]>();

  return {
    on: jest.fn((event: string, handler: Function) => {
      if (!listeners.has(event)) {
        listeners.set(event, []);
      }
      listeners.get(event)!.push(handler);
    }),
    emit: jest.fn((event: string, data: any) => {
      const handlers = listeners.get(event) || [];
      handlers.forEach(handler => handler(data));
    }),
    removeListener: jest.fn((event: string, handler: Function) => {
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
export const waitForNetworkState = async (
  checkFn: () => Promise<any>,
  timeout: number = 5000,
  interval: number = 100,
): Promise<any> => {
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
export const setupInMemoryDatabase = async (entities: any[]): Promise<any> => {
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
export const createIntegrationTestApp = async (
  appModule: any,
  imports: any[] = [],
): Promise<INestApplication> => {
  const moduleFixture = await Test.createTestingModule({
    imports: [appModule, ...imports],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
};

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
export const seedNetworkData = async (repository: any, count: number = 5): Promise<any[]> => {
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
export const cleanupTestData = async (repositories: any[]): Promise<void> => {
  for (const repo of repositories) {
    await repo.clear();
  }
};

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
export const createTestTransaction = async (dataSource: any): Promise<any> => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  return queryRunner;
};

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
export const mockNetworkDependencies = (overrides: Partial<any> = {}): any => {
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
export const assertNetworkRelations = (network: any, relations: string[]): void => {
  relations.forEach(relation => {
    expect(network).toHaveProperty(relation);
    expect(network[relation]).toBeDefined();
  });
};

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
export const testNetworkCrudOperations = async (
  service: any,
  testData: NetworkTestConfig,
): Promise<void> => {
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
export const verifyNetworkStateTransition = async (
  service: any,
  networkId: string,
  expectedStates: string[],
): Promise<void> => {
  for (const state of expectedStates) {
    const network = await service.getNetwork(networkId);
    expect(network.status).toBe(state);
  }
};

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
export const testConcurrentNetworkOperations = async (
  service: any,
  concurrency: number,
): Promise<any[]> => {
  const operations = Array.from({ length: concurrency }, (_, i) =>
    service.createNetwork({
      networkId: `net-concurrent-${i}`,
      name: `Concurrent Network ${i}`,
      cidr: `10.${i}.0.0/16`,
    }),
  );

  return await Promise.all(operations);
};

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
export const initializeE2ETestEnvironment = async (appModule: any): Promise<E2ETestContext> => {
  const testModule = await Test.createTestingModule({
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
export const performAuthenticatedE2ERequest = async (
  context: E2ETestContext,
  method: string,
  path: string,
  data?: any,
): Promise<any> => {
  const req = request(context.app.getHttpServer())[method.toLowerCase()](path);

  if (context.authToken) {
    req.set('Authorization', `Bearer ${context.authToken}`);
  }

  if (data) {
    req.send(data);
  }

  return await req;
};

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
export const testNetworkLifecycleE2E = async (
  context: E2ETestContext,
  networkData: NetworkTestConfig,
): Promise<void> => {
  // Create network
  const createResponse = await performAuthenticatedE2ERequest(
    context,
    'POST',
    '/networks',
    networkData,
  );
  expect(createResponse.status).toBe(201);
  const networkId = createResponse.body.networkId;

  // Get network
  const getResponse = await performAuthenticatedE2ERequest(context, 'GET', `/networks/${networkId}`);
  expect(getResponse.status).toBe(200);
  expect(getResponse.body.networkId).toBe(networkId);

  // Update network
  const updateResponse = await performAuthenticatedE2ERequest(
    context,
    'PATCH',
    `/networks/${networkId}`,
    { name: 'Updated Network' },
  );
  expect(updateResponse.status).toBe(200);

  // Delete network
  const deleteResponse = await performAuthenticatedE2ERequest(
    context,
    'DELETE',
    `/networks/${networkId}`,
  );
  expect(deleteResponse.status).toBe(204);
};

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
export const testNetworkConnectionE2E = async (
  context: E2ETestContext,
  sourceNetworkId: string,
  targetNetworkId: string,
): Promise<void> => {
  const response = await performAuthenticatedE2ERequest(context, 'POST', '/network-connections', {
    sourceNetworkId,
    targetNetworkId,
    bandwidth: 1000,
  });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe('pending');
};

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
export const teardownE2ETestEnvironment = async (context: E2ETestContext): Promise<void> => {
  if (context.app) {
    await context.app.close();
  }
};

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
export const createMockNetworks = (
  count: number,
  overrides: Partial<NetworkTestConfig> = {},
): NetworkTestConfig[] => {
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
export const createMockSubnets = (count: number, networkCidr: string): SubnetConfig[] => {
  return Array.from({ length: count }, (_, i) => ({
    subnetId: `subnet-mock-${i}`,
    cidr: `10.0.${i}.0/24`,
    availabilityZone: `az-${i % 3}`,
    public: i % 2 === 0,
    tags: { Name: `Mock Subnet ${i}` },
  }));
};

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
export const createMockSecurityGroups = (count: number): SecurityGroupConfig[] => {
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
export const createMockNetworkConnections = (networkIds: string[]): NetworkConnectionFixture[] => {
  const connections: NetworkConnectionFixture[] = [];

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
export const createNetworkTestFixture = (networkCount: number = 3): NetworkTestFixture => {
  const networks = createMockNetworks(networkCount);
  const allSubnets: SubnetConfig[] = [];
  const allSecurityGroups: SecurityGroupConfig[] = [];

  networks.forEach((network, i) => {
    const subnets = createMockSubnets(2, network.cidr);
    const securityGroups = createMockSecurityGroups(1);

    network.subnets = subnets;
    network.securityGroups = securityGroups;

    allSubnets.push(...subnets);
    allSecurityGroups.push(...securityGroups);
  });

  const connections = createMockNetworkConnections(networks.map(n => n.networkId));

  return {
    networks,
    subnets: allSubnets,
    securityGroups: allSecurityGroups,
    connections,
  };
};

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
export const captureNetworkSnapshot = async (
  networkId: string,
  service: any,
): Promise<NetworkSnapshot> => {
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
export const compareNetworkSnapshots = (
  snapshot1: NetworkSnapshot,
  snapshot2: NetworkSnapshot,
): { changed: boolean; differences: string[] } => {
  const differences: string[] = [];

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
export const restoreNetworkFromSnapshot = async (
  snapshot: NetworkSnapshot,
  service: any,
): Promise<void> => {
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
export const measureNetworkPerformance = async (
  testName: string,
  operation: () => Promise<any>,
  iterations: number = 100,
): Promise<PerformanceTestResult> => {
  const latencies: number[] = [];
  let errors = 0;
  let success = 0;

  const startTime = Date.now();

  for (let i = 0; i < iterations; i++) {
    const iterationStart = Date.now();
    try {
      await operation();
      success++;
      latencies.push(Date.now() - iterationStart);
    } catch (error) {
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
export const benchmarkNetworkQuery = async (
  service: any,
  queryType: string,
  iterations: number = 100,
): Promise<PerformanceTestResult> => {
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

  return await measureNetworkPerformance(`Query: ${queryType}`, operation, iterations);
};

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
export const testNetworkMemoryUsage = async (
  operation: () => Promise<any>,
  dataSize: number,
): Promise<{ success: boolean; memoryUsed: number }> => {
  const initialMemory = process.memoryUsage().heapUsed;

  try {
    await operation();
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryUsed = finalMemory - initialMemory;

    return {
      success: true,
      memoryUsed: Math.round(memoryUsed / 1024 / 1024), // MB
    };
  } catch (error) {
    return {
      success: false,
      memoryUsed: 0,
    };
  }
};

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
export const profileNetworkCPUUsage = async (
  operation: () => Promise<any>,
): Promise<{ cpuTime: number; userTime: number; systemTime: number }> => {
  const startCPU = process.cpuUsage();

  await operation();

  const endCPU = process.cpuUsage(startCPU);

  return {
    cpuTime: (endCPU.user + endCPU.system) / 1000, // ms
    userTime: endCPU.user / 1000, // ms
    systemTime: endCPU.system / 1000, // ms
  };
};

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
export const executeNetworkLoadTest = async (
  config: LoadTestConfig,
  requestFn: () => Promise<any>,
): Promise<LoadTestResult> => {
  const results: LoadTestResult = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    throughput: 0,
    errors: [],
  };

  const responseTimes: number[] = [];
  const startTime = Date.now();
  const endTime = startTime + config.duration;

  const executeRequest = async () => {
    const requestStart = Date.now();
    try {
      await requestFn();
      results.successfulRequests++;
      responseTimes.push(Date.now() - requestStart);
    } catch (error: any) {
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
export const simulateNetworkTraffic = async (
  pattern: 'constant' | 'spike' | 'wave' | 'random',
  duration: number,
  requestFn: () => Promise<any>,
): Promise<LoadTestResult> => {
  const getConcurrency = (elapsed: number): number => {
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

  const results: LoadTestResult = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    throughput: 0,
    errors: [],
  };

  const responseTimes: number[] = [];
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
      } catch (error: any) {
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
export const analyzeLoadTestResults = (
  result: LoadTestResult,
): { passed: boolean; recommendations: string[] } => {
  const recommendations: string[] = [];
  const successRate = result.successfulRequests / result.totalRequests;

  if (successRate < 0.95) {
    recommendations.push(
      `Low success rate (${(successRate * 100).toFixed(2)}%). Consider improving error handling.`,
    );
  }

  if (result.averageResponseTime > 1000) {
    recommendations.push(
      `High average response time (${result.averageResponseTime.toFixed(2)}ms). Consider optimization.`,
    );
  }

  if (result.throughput < 10) {
    recommendations.push(
      `Low throughput (${result.throughput.toFixed(2)} req/s). Consider scaling or optimization.`,
    );
  }

  if (result.errors.length > 0) {
    const errorTypes = new Set(result.errors.map(e => e.error));
    recommendations.push(
      `${result.errors.length} errors occurred. Common errors: ${Array.from(errorTypes).join(', ')}`,
    );
  }

  return {
    passed: successRate >= 0.95 && result.averageResponseTime <= 1000,
    recommendations,
  };
};

export default {
  // Unit Test Helpers
  createNetworkTestingModule,
  createMockNetworkRepository,
  createMockNetworkService,
  spyOnNetworkService,
  validateNetworkConfig,
  createTestNetworkData,
  assertNetworkStructure,
  mockNetworkConnectivity,
  createMockNetworkEventEmitter,
  waitForNetworkState,

  // Integration Test Utilities
  setupInMemoryDatabase,
  createIntegrationTestApp,
  seedNetworkData,
  cleanupTestData,
  createTestTransaction,
  mockNetworkDependencies,
  assertNetworkRelations,
  testNetworkCrudOperations,
  verifyNetworkStateTransition,
  testConcurrentNetworkOperations,

  // E2E Test Frameworks
  initializeE2ETestEnvironment,
  performAuthenticatedE2ERequest,
  testNetworkLifecycleE2E,
  testNetworkConnectionE2E,
  teardownE2ETestEnvironment,

  // Mock Factories
  createMockNetworks,
  createMockSubnets,
  createMockSecurityGroups,
  createMockNetworkConnections,
  createNetworkTestFixture,

  // Snapshot Testing
  captureNetworkSnapshot,
  compareNetworkSnapshots,
  restoreNetworkFromSnapshot,

  // Performance Testing
  measureNetworkPerformance,
  benchmarkNetworkQuery,
  testNetworkMemoryUsage,
  profileNetworkCPUUsage,

  // Load Testing
  executeNetworkLoadTest,
  simulateNetworkTraffic,
  analyzeLoadTestResults,
};
