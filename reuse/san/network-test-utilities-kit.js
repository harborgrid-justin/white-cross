"use strict";
/**
 * LOC: NTWKUTIL001
 * File: /reuse/san/network-test-utilities-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable testing utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network module tests
 *   - Test utility functions
 *   - Mock service implementations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCoverageThresholds = exports.generateCoverageSummary = exports.analyzeNetworkTestCoverage = exports.toHaveNetworkIds = exports.toBeInRegion = exports.toBeActiveNetwork = exports.toBeValidCIDR = exports.toBeValidNetworkId = exports.assertErrorResponse = exports.assertApiResponse = exports.assertNetworkRelationshipsLoaded = exports.assertValidCIDR = exports.assertNetworkHasRequiredProperties = exports.runInTestTransaction = exports.seedTestDatabase = exports.clearTestDatabaseTables = exports.teardownTestDatabase = exports.setupTestDatabase = exports.createStubHttpServiceProvider = exports.createStubEventEmitterProvider = exports.createStubLoggerProvider = exports.createStubConfigProvider = exports.createStubRepositoryProvider = exports.createMockQueueService = exports.createMockCacheService = exports.createMockNotificationService = exports.createMockMetricsService = exports.createMockNetworkProvider = exports.generateIPAddresses = exports.generateNetworkPeeringData = exports.generateSecurityGroupData = exports.generateNetworkConnectionData = exports.generateCIDRBlocks = exports.generateNetworkMetrics = exports.generateRouteTableTestData = exports.generateSubnetTestData = exports.generateBatchNetworkData = exports.generateNetworkTestData = void 0;
const typeorm_1 = require("typeorm");
// ============================================================================
// TEST DATA GENERATORS (1-10)
// ============================================================================
/**
 * Generates random network test data.
 *
 * @param {Partial<NetworkTestData>} overrides - Property overrides
 * @returns {NetworkTestData} Generated network data
 *
 * @example
 * ```typescript
 * const network = generateNetworkTestData({ region: 'us-east-1' });
 * expect(network.cidr).toMatch(/\d+\.\d+\.\d+\.\d+\/\d+/);
 * ```
 */
const generateNetworkTestData = (overrides = {}) => {
    const random = Math.floor(Math.random() * 255);
    return {
        networkId: `net-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `test-network-${random}`,
        cidr: `10.${random}.0.0/16`,
        vlanId: 100 + random,
        region: 'us-west-2',
        status: 'active',
        metadata: {
            environment: 'test',
            created_by: 'test-suite',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
};
exports.generateNetworkTestData = generateNetworkTestData;
/**
 * Generates batch of network test data.
 *
 * @param {number} count - Number of networks to generate
 * @param {Partial<NetworkTestData>} template - Template for generation
 * @returns {NetworkTestData[]} Array of network data
 *
 * @example
 * ```typescript
 * const networks = generateBatchNetworkData(10, { region: 'eu-west-1' });
 * expect(networks).toHaveLength(10);
 * ```
 */
const generateBatchNetworkData = (count, template = {}) => {
    return Array.from({ length: count }, (_, i) => (0, exports.generateNetworkTestData)({
        ...template,
        name: `${template.name || 'test-network'}-${i}`,
    }));
};
exports.generateBatchNetworkData = generateBatchNetworkData;
/**
 * Generates subnet test data for a network.
 *
 * @param {string} networkId - Parent network ID
 * @param {number} count - Number of subnets
 * @returns {SubnetTestData[]} Subnet data array
 *
 * @example
 * ```typescript
 * const subnets = generateSubnetTestData('net-123', 3);
 * expect(subnets).toHaveLength(3);
 * ```
 */
const generateSubnetTestData = (networkId, count = 3) => {
    return Array.from({ length: count }, (_, i) => ({
        subnetId: `subnet-${Date.now()}-${i}`,
        networkId,
        cidr: `10.0.${i}.0/24`,
        availabilityZone: `az-${i % 3}`,
        public: i % 2 === 0,
        routeTableId: `rtb-${Date.now()}-${i}`,
    }));
};
exports.generateSubnetTestData = generateSubnetTestData;
/**
 * Generates route table test data.
 *
 * @param {string} networkId - Network ID
 * @param {number} routeCount - Number of routes
 * @returns {RouteTableTestData} Route table data
 *
 * @example
 * ```typescript
 * const routeTable = generateRouteTableTestData('net-123', 5);
 * expect(routeTable.routes).toHaveLength(5);
 * ```
 */
const generateRouteTableTestData = (networkId, routeCount = 3) => {
    const routes = Array.from({ length: routeCount }, (_, i) => ({
        destination: `0.0.0.0/0`,
        target: `igw-${i}`,
        targetType: 'gateway',
        priority: 100 + i * 10,
    }));
    return {
        routeTableId: `rtb-${Date.now()}`,
        networkId,
        routes,
        associations: [],
    };
};
exports.generateRouteTableTestData = generateRouteTableTestData;
/**
 * Generates network metrics test data.
 *
 * @param {Partial<NetworkMetrics>} overrides - Property overrides
 * @returns {NetworkMetrics} Network metrics
 *
 * @example
 * ```typescript
 * const metrics = generateNetworkMetrics({ bytesIn: 1000000 });
 * expect(metrics.bytesIn).toBe(1000000);
 * ```
 */
const generateNetworkMetrics = (overrides = {}) => {
    return {
        bytesIn: Math.floor(Math.random() * 1000000),
        bytesOut: Math.floor(Math.random() * 1000000),
        packetsIn: Math.floor(Math.random() * 10000),
        packetsOut: Math.floor(Math.random() * 10000),
        connections: Math.floor(Math.random() * 100),
        errors: Math.floor(Math.random() * 10),
        timestamp: new Date(),
        ...overrides,
    };
};
exports.generateNetworkMetrics = generateNetworkMetrics;
/**
 * Generates realistic CIDR blocks for testing.
 *
 * @param {string} baseOctet - Base octet (10, 172, 192)
 * @param {number} count - Number of CIDRs
 * @returns {string[]} CIDR blocks
 *
 * @example
 * ```typescript
 * const cidrs = generateCIDRBlocks('10', 5);
 * expect(cidrs[0]).toMatch(/^10\.\d+\.\d+\.\d+\/\d+$/);
 * ```
 */
const generateCIDRBlocks = (baseOctet = '10', count = 5) => {
    return Array.from({ length: count }, (_, i) => {
        const second = Math.floor(i / 255);
        const third = i % 255;
        return `${baseOctet}.${second}.${third}.0/24`;
    });
};
exports.generateCIDRBlocks = generateCIDRBlocks;
/**
 * Generates network connection test data.
 *
 * @param {string} sourceNetworkId - Source network
 * @param {string} targetNetworkId - Target network
 * @returns {any} Connection data
 *
 * @example
 * ```typescript
 * const connection = generateNetworkConnectionData('net-1', 'net-2');
 * expect(connection.status).toBe('pending');
 * ```
 */
const generateNetworkConnectionData = (sourceNetworkId, targetNetworkId) => {
    return {
        connectionId: `conn-${Date.now()}`,
        sourceNetworkId,
        targetNetworkId,
        status: 'pending',
        bandwidth: 1000,
        latency: Math.floor(Math.random() * 100),
        packetLoss: Math.random() * 0.01,
        createdAt: new Date(),
    };
};
exports.generateNetworkConnectionData = generateNetworkConnectionData;
/**
 * Generates security group test data.
 *
 * @param {string} networkId - Network ID
 * @param {number} ruleCount - Number of rules
 * @returns {any} Security group data
 *
 * @example
 * ```typescript
 * const sg = generateSecurityGroupData('net-123', 3);
 * expect(sg.rules).toHaveLength(3);
 * ```
 */
const generateSecurityGroupData = (networkId, ruleCount = 3) => {
    const rules = Array.from({ length: ruleCount }, (_, i) => ({
        ruleId: `rule-${i}`,
        direction: i % 2 === 0 ? 'ingress' : 'egress',
        protocol: i % 3 === 0 ? 'tcp' : i % 3 === 1 ? 'udp' : 'icmp',
        portRange: i % 3 === 0 ? '80' : i % 3 === 1 ? '443' : '*',
        source: '0.0.0.0/0',
        action: 'allow',
    }));
    return {
        groupId: `sg-${Date.now()}`,
        networkId,
        name: `test-security-group`,
        description: 'Test security group',
        rules,
    };
};
exports.generateSecurityGroupData = generateSecurityGroupData;
/**
 * Generates network peering test data.
 *
 * @param {string} requesterNetworkId - Requester network
 * @param {string} accepterNetworkId - Accepter network
 * @returns {any} Peering data
 *
 * @example
 * ```typescript
 * const peering = generateNetworkPeeringData('net-1', 'net-2');
 * expect(peering.status).toBe('pending-acceptance');
 * ```
 */
const generateNetworkPeeringData = (requesterNetworkId, accepterNetworkId) => {
    return {
        peeringId: `pcx-${Date.now()}`,
        requesterNetworkId,
        accepterNetworkId,
        status: 'pending-acceptance',
        requesterCidr: '10.0.0.0/16',
        accepterCidr: '10.1.0.0/16',
        createdAt: new Date(),
    };
};
exports.generateNetworkPeeringData = generateNetworkPeeringData;
/**
 * Generates random IP addresses for testing.
 *
 * @param {number} count - Number of IPs to generate
 * @param {boolean} private - Generate private IPs
 * @returns {string[]} IP addresses
 *
 * @example
 * ```typescript
 * const ips = generateIPAddresses(10, true);
 * expect(ips[0]).toMatch(/^10\.\d+\.\d+\.\d+$/);
 * ```
 */
const generateIPAddresses = (count = 10, private_ = true) => {
    return Array.from({ length: count }, () => {
        if (private_) {
            return `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        }
        else {
            return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        }
    });
};
exports.generateIPAddresses = generateIPAddresses;
// ============================================================================
// MOCK SERVICES (11-15)
// ============================================================================
/**
 * Creates a complete mock network provider service.
 *
 * @param {Partial<MockProviderConfig>} config - Provider configuration
 * @returns {any} Mock provider
 *
 * @example
 * ```typescript
 * const provider = createMockNetworkProvider({ region: 'us-east-1' });
 * const result = await provider.createNetwork(data);
 * ```
 */
const createMockNetworkProvider = (config = {}) => {
    return {
        name: config.name || 'MockProvider',
        region: config.region || 'us-west-2',
        credentials: config.credentials || {},
        capabilities: config.capabilities || ['create', 'delete', 'update', 'list'],
        createNetwork: jest.fn().mockImplementation(async (data) => ({
            ...data,
            networkId: `net-${Date.now()}`,
            status: 'active',
        })),
        deleteNetwork: jest.fn().mockImplementation(async (networkId) => ({
            networkId,
            deleted: true,
        })),
        updateNetwork: jest.fn().mockImplementation(async (networkId, updates) => ({
            networkId,
            ...updates,
            updated: true,
        })),
        getNetwork: jest.fn().mockImplementation(async (networkId) => ({
            networkId,
            name: 'Mock Network',
            status: 'active',
        })),
        listNetworks: jest.fn().mockResolvedValue([]),
        createSubnet: jest.fn().mockResolvedValue({ subnetId: 'subnet-123' }),
        deleteSubnet: jest.fn().mockResolvedValue(true),
        createSecurityGroup: jest.fn().mockResolvedValue({ groupId: 'sg-123' }),
        deleteSecurityGroup: jest.fn().mockResolvedValue(true),
        attachSecurityGroup: jest.fn().mockResolvedValue(true),
        detachSecurityGroup: jest.fn().mockResolvedValue(true),
    };
};
exports.createMockNetworkProvider = createMockNetworkProvider;
/**
 * Creates a mock metrics collection service.
 *
 * @returns {any} Mock metrics service
 *
 * @example
 * ```typescript
 * const metricsService = createMockMetricsService();
 * await metricsService.recordMetric('network.created', 1);
 * ```
 */
const createMockMetricsService = () => {
    const metrics = new Map();
    return {
        recordMetric: jest.fn((name, value) => {
            if (!metrics.has(name)) {
                metrics.set(name, []);
            }
            metrics.get(name).push(value);
        }),
        getMetric: jest.fn((name) => metrics.get(name) || []),
        getAverageMetric: jest.fn((name) => {
            const values = metrics.get(name) || [];
            return values.reduce((a, b) => a + b, 0) / values.length || 0;
        }),
        clearMetrics: jest.fn(() => {
            metrics.clear();
        }),
        getAllMetrics: jest.fn(() => Object.fromEntries(metrics)),
    };
};
exports.createMockMetricsService = createMockMetricsService;
/**
 * Creates a mock notification service for network events.
 *
 * @returns {any} Mock notification service
 *
 * @example
 * ```typescript
 * const notificationService = createMockNotificationService();
 * await notificationService.sendNotification('network.created', data);
 * ```
 */
const createMockNotificationService = () => {
    const notifications = [];
    return {
        sendNotification: jest.fn((event, data) => {
            notifications.push({ event, data, timestamp: new Date() });
            return Promise.resolve(true);
        }),
        getNotifications: jest.fn(() => notifications),
        clearNotifications: jest.fn(() => {
            notifications.length = 0;
        }),
        getNotificationsByEvent: jest.fn((event) => notifications.filter(n => n.event === event)),
    };
};
exports.createMockNotificationService = createMockNotificationService;
/**
 * Creates a mock caching service for network data.
 *
 * @returns {any} Mock cache service
 *
 * @example
 * ```typescript
 * const cacheService = createMockCacheService();
 * await cacheService.set('network:123', networkData, 3600);
 * ```
 */
const createMockCacheService = () => {
    const cache = new Map();
    return {
        get: jest.fn(async (key) => {
            const entry = cache.get(key);
            if (!entry)
                return null;
            if (Date.now() > entry.expires) {
                cache.delete(key);
                return null;
            }
            return entry.value;
        }),
        set: jest.fn(async (key, value, ttl = 3600) => {
            cache.set(key, {
                value,
                expires: Date.now() + ttl * 1000,
            });
            return true;
        }),
        delete: jest.fn(async (key) => {
            return cache.delete(key);
        }),
        clear: jest.fn(async () => {
            cache.clear();
            return true;
        }),
        has: jest.fn(async (key) => cache.has(key)),
    };
};
exports.createMockCacheService = createMockCacheService;
/**
 * Creates a mock queue service for async network operations.
 *
 * @returns {any} Mock queue service
 *
 * @example
 * ```typescript
 * const queueService = createMockQueueService();
 * await queueService.enqueue('create-network', { networkId: 'net-123' });
 * ```
 */
const createMockQueueService = () => {
    const queues = new Map();
    return {
        enqueue: jest.fn(async (queueName, job) => {
            if (!queues.has(queueName)) {
                queues.set(queueName, []);
            }
            queues.get(queueName).push(job);
            return { jobId: `job-${Date.now()}` };
        }),
        dequeue: jest.fn(async (queueName) => {
            const queue = queues.get(queueName) || [];
            return queue.shift();
        }),
        getQueueLength: jest.fn((queueName) => {
            return queues.get(queueName)?.length || 0;
        }),
        clearQueue: jest.fn((queueName) => {
            queues.set(queueName, []);
        }),
        getAllQueues: jest.fn(() => Object.fromEntries(queues)),
    };
};
exports.createMockQueueService = createMockQueueService;
// ============================================================================
// STUB PROVIDERS (16-20)
// ============================================================================
/**
 * Creates a stub repository provider for testing.
 *
 * @param {string} token - Injection token
 * @param {Partial<Repository<any>>} methods - Repository methods
 * @returns {any} Provider configuration
 *
 * @example
 * ```typescript
 * const provider = createStubRepositoryProvider('NETWORK_REPOSITORY', {
 *   findOne: jest.fn().mockResolvedValue(mockNetwork)
 * });
 * ```
 */
const createStubRepositoryProvider = (token, methods = {}) => {
    return {
        provide: token,
        useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(null),
            save: jest.fn().mockImplementation(entity => entity),
            create: jest.fn().mockImplementation(data => data),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            count: jest.fn().mockResolvedValue(0),
            ...methods,
        },
    };
};
exports.createStubRepositoryProvider = createStubRepositoryProvider;
/**
 * Creates a stub configuration service provider.
 *
 * @param {Record<string, any>} config - Configuration values
 * @returns {any} Provider configuration
 *
 * @example
 * ```typescript
 * const provider = createStubConfigProvider({
 *   NETWORK_REGION: 'us-west-2',
 *   MAX_NETWORKS: 100
 * });
 * ```
 */
const createStubConfigProvider = (config = {}) => {
    return {
        provide: 'ConfigService',
        useValue: {
            get: jest.fn((key) => config[key]),
            getOrThrow: jest.fn((key) => {
                if (!(key in config)) {
                    throw new Error(`Config key ${key} not found`);
                }
                return config[key];
            }),
            set: jest.fn((key, value) => {
                config[key] = value;
            }),
        },
    };
};
exports.createStubConfigProvider = createStubConfigProvider;
/**
 * Creates a stub logger provider for testing.
 *
 * @returns {any} Provider configuration
 *
 * @example
 * ```typescript
 * const provider = createStubLoggerProvider();
 * ```
 */
const createStubLoggerProvider = () => {
    return {
        provide: 'Logger',
        useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
        },
    };
};
exports.createStubLoggerProvider = createStubLoggerProvider;
/**
 * Creates a stub event emitter provider.
 *
 * @returns {any} Provider configuration
 *
 * @example
 * ```typescript
 * const provider = createStubEventEmitterProvider();
 * ```
 */
const createStubEventEmitterProvider = () => {
    const listeners = new Map();
    return {
        provide: 'EventEmitter',
        useValue: {
            on: jest.fn((event, handler) => {
                if (!listeners.has(event)) {
                    listeners.set(event, []);
                }
                listeners.get(event).push(handler);
            }),
            emit: jest.fn((event, ...args) => {
                const handlers = listeners.get(event) || [];
                handlers.forEach(handler => handler(...args));
            }),
            removeListener: jest.fn(),
            removeAllListeners: jest.fn(() => listeners.clear()),
        },
    };
};
exports.createStubEventEmitterProvider = createStubEventEmitterProvider;
/**
 * Creates a stub HTTP service provider for external API calls.
 *
 * @param {Record<string, any>} responses - Mock responses by URL
 * @returns {any} Provider configuration
 *
 * @example
 * ```typescript
 * const provider = createStubHttpServiceProvider({
 *   'https://api.example.com/networks': { data: [] }
 * });
 * ```
 */
const createStubHttpServiceProvider = (responses = {}) => {
    return {
        provide: 'HttpService',
        useValue: {
            get: jest.fn((url) => Promise.resolve({
                data: responses[url] || {},
                status: 200,
                statusText: 'OK',
            })),
            post: jest.fn((url, data) => Promise.resolve({
                data: { ...data, id: Date.now() },
                status: 201,
                statusText: 'Created',
            })),
            put: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
        },
    };
};
exports.createStubHttpServiceProvider = createStubHttpServiceProvider;
// ============================================================================
// DATABASE SETUP & CLEANUP (21-25)
// ============================================================================
/**
 * Sets up test database with schema synchronization.
 *
 * @param {TestDatabaseConfig} config - Database configuration
 * @returns {Promise<DataSource>} Data source instance
 *
 * @example
 * ```typescript
 * const dataSource = await setupTestDatabase({
 *   type: 'sqlite',
 *   database: ':memory:',
 *   entities: [Network, Subnet],
 *   synchronize: true,
 *   dropSchema: true
 * });
 * ```
 */
const setupTestDatabase = async (config) => {
    const dataSource = new typeorm_1.DataSource({
        type: config.type,
        database: config.database,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        entities: config.entities,
        synchronize: config.synchronize,
        dropSchema: config.dropSchema,
        logging: false,
    });
    await dataSource.initialize();
    return dataSource;
};
exports.setupTestDatabase = setupTestDatabase;
/**
 * Tears down test database and closes connections.
 *
 * @param {DataSource} dataSource - Data source to close
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await teardownTestDatabase(dataSource);
 * ```
 */
const teardownTestDatabase = async (dataSource) => {
    if (dataSource.isInitialized) {
        await dataSource.destroy();
    }
};
exports.teardownTestDatabase = teardownTestDatabase;
/**
 * Clears all data from test database tables.
 *
 * @param {DataSource} dataSource - Data source
 * @param {string[]} tableNames - Tables to clear
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await clearTestDatabaseTables(dataSource, ['networks', 'subnets', 'security_groups']);
 * ```
 */
const clearTestDatabaseTables = async (dataSource, tableNames) => {
    const queryRunner = dataSource.createQueryRunner();
    try {
        await queryRunner.startTransaction();
        for (const tableName of tableNames) {
            await queryRunner.query(`DELETE FROM ${tableName}`);
        }
        await queryRunner.commitTransaction();
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    }
    finally {
        await queryRunner.release();
    }
};
exports.clearTestDatabaseTables = clearTestDatabaseTables;
/**
 * Seeds test database with initial data.
 *
 * @param {DataSource} dataSource - Data source
 * @param {Record<string, any[]>} seedData - Seed data by entity
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await seedTestDatabase(dataSource, {
 *   Network: [networkData1, networkData2],
 *   Subnet: [subnetData1, subnetData2]
 * });
 * ```
 */
const seedTestDatabase = async (dataSource, seedData) => {
    for (const [entityName, data] of Object.entries(seedData)) {
        const repository = dataSource.getRepository(entityName);
        await repository.save(data);
    }
};
exports.seedTestDatabase = seedTestDatabase;
/**
 * Creates a database transaction for isolated testing.
 *
 * @param {DataSource} dataSource - Data source
 * @param {Function} testFn - Test function to run in transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await runInTestTransaction(dataSource, async (queryRunner) => {
 *   await queryRunner.manager.save(Network, networkData);
 *   // Test operations...
 * });
 * ```
 */
const runInTestTransaction = async (dataSource, testFn) => {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        await testFn(queryRunner);
        await queryRunner.rollbackTransaction();
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    }
    finally {
        await queryRunner.release();
    }
};
exports.runInTestTransaction = runInTestTransaction;
// ============================================================================
// ASSERTION HELPERS (26-30)
// ============================================================================
/**
 * Asserts that network has all required properties.
 *
 * @param {any} network - Network object to validate
 *
 * @example
 * ```typescript
 * assertNetworkHasRequiredProperties(network);
 * ```
 */
const assertNetworkHasRequiredProperties = (network) => {
    expect(network).toBeDefined();
    expect(network).toHaveProperty('networkId');
    expect(network).toHaveProperty('name');
    expect(network).toHaveProperty('cidr');
    expect(network.networkId).toBeTruthy();
    expect(network.name).toBeTruthy();
    expect(network.cidr).toMatch(/^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/);
};
exports.assertNetworkHasRequiredProperties = assertNetworkHasRequiredProperties;
/**
 * Asserts that network CIDR is valid.
 *
 * @param {string} cidr - CIDR to validate
 *
 * @example
 * ```typescript
 * assertValidCIDR('10.0.0.0/16');
 * ```
 */
const assertValidCIDR = (cidr) => {
    expect(cidr).toMatch(/^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/);
    const [ip, mask] = cidr.split('/');
    const octets = ip.split('.').map(Number);
    octets.forEach(octet => {
        expect(octet).toBeGreaterThanOrEqual(0);
        expect(octet).toBeLessThanOrEqual(255);
    });
    const maskNum = parseInt(mask, 10);
    expect(maskNum).toBeGreaterThanOrEqual(0);
    expect(maskNum).toBeLessThanOrEqual(32);
};
exports.assertValidCIDR = assertValidCIDR;
/**
 * Asserts that network relationships are properly loaded.
 *
 * @param {any} network - Network with relationships
 * @param {string[]} expectedRelations - Expected relation names
 *
 * @example
 * ```typescript
 * assertNetworkRelationshipsLoaded(network, ['subnets', 'securityGroups']);
 * ```
 */
const assertNetworkRelationshipsLoaded = (network, expectedRelations) => {
    expectedRelations.forEach(relation => {
        expect(network).toHaveProperty(relation);
        expect(network[relation]).toBeDefined();
        expect(Array.isArray(network[relation]) || typeof network[relation] === 'object').toBe(true);
    });
};
exports.assertNetworkRelationshipsLoaded = assertNetworkRelationshipsLoaded;
/**
 * Asserts that API response has correct structure.
 *
 * @param {any} response - API response
 * @param {number} expectedStatus - Expected status code
 *
 * @example
 * ```typescript
 * assertApiResponse(response, 200);
 * ```
 */
const assertApiResponse = (response, expectedStatus) => {
    expect(response).toBeDefined();
    expect(response.status).toBe(expectedStatus);
    if (expectedStatus >= 200 && expectedStatus < 300) {
        expect(response.body).toBeDefined();
    }
};
exports.assertApiResponse = assertApiResponse;
/**
 * Asserts that error response has correct structure.
 *
 * @param {any} error - Error object
 * @param {number} expectedStatus - Expected status code
 * @param {string} expectedCode - Expected error code
 *
 * @example
 * ```typescript
 * assertErrorResponse(error, 404, 'NETWORK_NOT_FOUND');
 * ```
 */
const assertErrorResponse = (error, expectedStatus, expectedCode) => {
    expect(error).toBeDefined();
    expect(error.response?.status || error.status).toBe(expectedStatus);
    const errorBody = error.response?.body || error;
    expect(errorBody.error?.code || errorBody.code).toBe(expectedCode);
    expect(errorBody.error?.message || errorBody.message).toBeDefined();
};
exports.assertErrorResponse = assertErrorResponse;
// ============================================================================
// CUSTOM MATCHERS (31-35)
// ============================================================================
/**
 * Custom Jest matcher to check if value is a valid network ID.
 *
 * @param {string} received - Value to test
 * @returns {CustomMatcherResult} Matcher result
 *
 * @example
 * ```typescript
 * expect.extend({ toBeValidNetworkId });
 * expect('net-123456').toBeValidNetworkId();
 * ```
 */
const toBeValidNetworkId = (received) => {
    const pass = /^net-[a-zA-Z0-9-]+$/.test(received);
    return {
        pass,
        message: () => pass
            ? `expected ${received} not to be a valid network ID`
            : `expected ${received} to be a valid network ID (format: net-xxx)`,
    };
};
exports.toBeValidNetworkId = toBeValidNetworkId;
/**
 * Custom Jest matcher to check if value is a valid CIDR block.
 *
 * @param {string} received - Value to test
 * @returns {CustomMatcherResult} Matcher result
 *
 * @example
 * ```typescript
 * expect.extend({ toBeValidCIDR });
 * expect('10.0.0.0/16').toBeValidCIDR();
 * ```
 */
const toBeValidCIDR = (received) => {
    const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    const pass = cidrRegex.test(received);
    return {
        pass,
        message: () => pass
            ? `expected ${received} not to be a valid CIDR block`
            : `expected ${received} to be a valid CIDR block (format: x.x.x.x/x)`,
    };
};
exports.toBeValidCIDR = toBeValidCIDR;
/**
 * Custom Jest matcher to check if network has active status.
 *
 * @param {any} received - Network object
 * @returns {CustomMatcherResult} Matcher result
 *
 * @example
 * ```typescript
 * expect.extend({ toBeActiveNetwork });
 * expect(network).toBeActiveNetwork();
 * ```
 */
const toBeActiveNetwork = (received) => {
    const pass = received?.status === 'active';
    return {
        pass,
        message: () => pass
            ? `expected network not to be active`
            : `expected network to be active, but status was ${received?.status}`,
    };
};
exports.toBeActiveNetwork = toBeActiveNetwork;
/**
 * Custom Jest matcher to check if network belongs to region.
 *
 * @param {any} received - Network object
 * @param {string} region - Expected region
 * @returns {CustomMatcherResult} Matcher result
 *
 * @example
 * ```typescript
 * expect.extend({ toBeInRegion });
 * expect(network).toBeInRegion('us-west-2');
 * ```
 */
const toBeInRegion = (received, region) => {
    const pass = received?.region === region;
    return {
        pass,
        message: () => pass
            ? `expected network not to be in region ${region}`
            : `expected network to be in region ${region}, but was in ${received?.region}`,
    };
};
exports.toBeInRegion = toBeInRegion;
/**
 * Custom Jest matcher to check if arrays have matching network IDs.
 *
 * @param {any[]} received - Received array
 * @param {string[]} expected - Expected network IDs
 * @returns {CustomMatcherResult} Matcher result
 *
 * @example
 * ```typescript
 * expect.extend({ toHaveNetworkIds });
 * expect(networks).toHaveNetworkIds(['net-1', 'net-2']);
 * ```
 */
const toHaveNetworkIds = (received, expected) => {
    const receivedIds = received.map(n => n.networkId).sort();
    const expectedIds = [...expected].sort();
    const pass = JSON.stringify(receivedIds) === JSON.stringify(expectedIds);
    return {
        pass,
        message: () => pass
            ? `expected networks not to have IDs ${expectedIds.join(', ')}`
            : `expected networks to have IDs ${expectedIds.join(', ')}, but got ${receivedIds.join(', ')}`,
    };
};
exports.toHaveNetworkIds = toHaveNetworkIds;
// ============================================================================
// COVERAGE HELPERS (36-38)
// ============================================================================
/**
 * Analyzes test coverage for network module.
 *
 * @param {any} coverageData - Jest coverage data
 * @returns {TestCoverageReport} Coverage report
 *
 * @example
 * ```typescript
 * const report = analyzeNetworkTestCoverage(global.__coverage__);
 * console.log(`Coverage: ${report.coveragePercentage}%`);
 * ```
 */
const analyzeNetworkTestCoverage = (coverageData) => {
    let totalFunctions = 0;
    let coveredFunctions = 0;
    let totalLines = 0;
    let coveredLines = 0;
    let totalBranches = 0;
    let coveredBranches = 0;
    const uncoveredFiles = [];
    if (!coverageData) {
        return {
            totalFunctions: 0,
            coveredFunctions: 0,
            totalLines: 0,
            coveredLines: 0,
            totalBranches: 0,
            coveredBranches: 0,
            coveragePercentage: 0,
            uncoveredFiles: [],
        };
    }
    Object.entries(coverageData).forEach(([file, data]) => {
        if (file.includes('network')) {
            totalFunctions += Object.keys(data.f || {}).length;
            coveredFunctions += Object.values(data.f || {}).filter((v) => v > 0).length;
            totalLines += Object.keys(data.s || {}).length;
            coveredLines += Object.values(data.s || {}).filter((v) => v > 0).length;
            totalBranches += Object.keys(data.b || {}).length;
            coveredBranches += Object.values(data.b || {})
                .flat()
                .filter((v) => v > 0).length;
            const fileCoverage = totalLines > 0 ? (Object.values(data.s || {}).filter((v) => v > 0).length / Object.keys(data.s || {}).length) * 100 : 0;
            if (fileCoverage < 80) {
                uncoveredFiles.push(file);
            }
        }
    });
    const coveragePercentage = totalLines > 0 ? (coveredLines / totalLines) * 100 : 0;
    return {
        totalFunctions,
        coveredFunctions,
        totalLines,
        coveredLines,
        totalBranches,
        coveredBranches,
        coveragePercentage: Math.round(coveragePercentage * 100) / 100,
        uncoveredFiles,
    };
};
exports.analyzeNetworkTestCoverage = analyzeNetworkTestCoverage;
/**
 * Generates coverage report summary.
 *
 * @param {TestCoverageReport} report - Coverage report
 * @returns {string} Formatted summary
 *
 * @example
 * ```typescript
 * const summary = generateCoverageSummary(report);
 * console.log(summary);
 * ```
 */
const generateCoverageSummary = (report) => {
    const lines = [
        'Network Test Coverage Report',
        '============================',
        '',
        `Total Coverage: ${report.coveragePercentage}%`,
        '',
        'Details:',
        `  Functions: ${report.coveredFunctions}/${report.totalFunctions} (${Math.round((report.coveredFunctions / report.totalFunctions) * 100)}%)`,
        `  Lines: ${report.coveredLines}/${report.totalLines} (${Math.round((report.coveredLines / report.totalLines) * 100)}%)`,
        `  Branches: ${report.coveredBranches}/${report.totalBranches} (${Math.round((report.coveredBranches / report.totalBranches) * 100)}%)`,
        '',
    ];
    if (report.uncoveredFiles.length > 0) {
        lines.push('Files with < 80% coverage:');
        report.uncoveredFiles.forEach(file => {
            lines.push(`  - ${file}`);
        });
    }
    else {
        lines.push('All files have >= 80% coverage!');
    }
    return lines.join('\n');
};
exports.generateCoverageSummary = generateCoverageSummary;
/**
 * Validates that coverage meets minimum thresholds.
 *
 * @param {TestCoverageReport} report - Coverage report
 * @param {number} minPercentage - Minimum coverage percentage
 * @returns {{ passed: boolean; message: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCoverageThresholds(report, 80);
 * if (!result.passed) {
 *   console.error(result.message);
 * }
 * ```
 */
const validateCoverageThresholds = (report, minPercentage = 80) => {
    if (report.coveragePercentage >= minPercentage) {
        return {
            passed: true,
            message: `Coverage ${report.coveragePercentage}% meets threshold of ${minPercentage}%`,
        };
    }
    return {
        passed: false,
        message: `Coverage ${report.coveragePercentage}% is below threshold of ${minPercentage}%. Missing: ${(minPercentage - report.coveragePercentage).toFixed(2)}%`,
    };
};
exports.validateCoverageThresholds = validateCoverageThresholds;
exports.default = {
    // Test Data Generators
    generateNetworkTestData: exports.generateNetworkTestData,
    generateBatchNetworkData: exports.generateBatchNetworkData,
    generateSubnetTestData: exports.generateSubnetTestData,
    generateRouteTableTestData: exports.generateRouteTableTestData,
    generateNetworkMetrics: exports.generateNetworkMetrics,
    generateCIDRBlocks: exports.generateCIDRBlocks,
    generateNetworkConnectionData: exports.generateNetworkConnectionData,
    generateSecurityGroupData: exports.generateSecurityGroupData,
    generateNetworkPeeringData: exports.generateNetworkPeeringData,
    generateIPAddresses: exports.generateIPAddresses,
    // Mock Services
    createMockNetworkProvider: exports.createMockNetworkProvider,
    createMockMetricsService: exports.createMockMetricsService,
    createMockNotificationService: exports.createMockNotificationService,
    createMockCacheService: exports.createMockCacheService,
    createMockQueueService: exports.createMockQueueService,
    // Stub Providers
    createStubRepositoryProvider: exports.createStubRepositoryProvider,
    createStubConfigProvider: exports.createStubConfigProvider,
    createStubLoggerProvider: exports.createStubLoggerProvider,
    createStubEventEmitterProvider: exports.createStubEventEmitterProvider,
    createStubHttpServiceProvider: exports.createStubHttpServiceProvider,
    // Database Setup & Cleanup
    setupTestDatabase: exports.setupTestDatabase,
    teardownTestDatabase: exports.teardownTestDatabase,
    clearTestDatabaseTables: exports.clearTestDatabaseTables,
    seedTestDatabase: exports.seedTestDatabase,
    runInTestTransaction: exports.runInTestTransaction,
    // Assertion Helpers
    assertNetworkHasRequiredProperties: exports.assertNetworkHasRequiredProperties,
    assertValidCIDR: exports.assertValidCIDR,
    assertNetworkRelationshipsLoaded: exports.assertNetworkRelationshipsLoaded,
    assertApiResponse: exports.assertApiResponse,
    assertErrorResponse: exports.assertErrorResponse,
    // Custom Matchers
    toBeValidNetworkId: exports.toBeValidNetworkId,
    toBeValidCIDR: exports.toBeValidCIDR,
    toBeActiveNetwork: exports.toBeActiveNetwork,
    toBeInRegion: exports.toBeInRegion,
    toHaveNetworkIds: exports.toHaveNetworkIds,
    // Coverage Helpers
    analyzeNetworkTestCoverage: exports.analyzeNetworkTestCoverage,
    generateCoverageSummary: exports.generateCoverageSummary,
    validateCoverageThresholds: exports.validateCoverageThresholds,
};
//# sourceMappingURL=network-test-utilities-kit.js.map