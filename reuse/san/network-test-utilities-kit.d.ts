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
import { Repository, DataSource } from 'typeorm';
interface NetworkTestData {
    networkId: string;
    name: string;
    cidr: string;
    vlanId: number;
    region: string;
    status: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
interface SubnetTestData {
    subnetId: string;
    networkId: string;
    cidr: string;
    availabilityZone: string;
    public: boolean;
    routeTableId: string;
}
interface RouteTableTestData {
    routeTableId: string;
    networkId: string;
    routes: RouteEntry[];
    associations: string[];
}
interface RouteEntry {
    destination: string;
    target: string;
    targetType: 'gateway' | 'instance' | 'peering' | 'nat';
    priority: number;
}
interface NetworkMetrics {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
    connections: number;
    errors: number;
    timestamp: Date;
}
interface TestDatabaseConfig {
    type: 'sqlite' | 'postgres' | 'mysql';
    database: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    entities: any[];
    synchronize: boolean;
    dropSchema: boolean;
}
interface MockProviderConfig {
    name: string;
    region: string;
    credentials: Record<string, string>;
    capabilities: string[];
}
interface TestCoverageReport {
    totalFunctions: number;
    coveredFunctions: number;
    totalLines: number;
    coveredLines: number;
    totalBranches: number;
    coveredBranches: number;
    coveragePercentage: number;
    uncoveredFiles: string[];
}
interface CustomMatcherResult {
    pass: boolean;
    message: () => string;
}
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
export declare const generateNetworkTestData: (overrides?: Partial<NetworkTestData>) => NetworkTestData;
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
export declare const generateBatchNetworkData: (count: number, template?: Partial<NetworkTestData>) => NetworkTestData[];
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
export declare const generateSubnetTestData: (networkId: string, count?: number) => SubnetTestData[];
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
export declare const generateRouteTableTestData: (networkId: string, routeCount?: number) => RouteTableTestData;
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
export declare const generateNetworkMetrics: (overrides?: Partial<NetworkMetrics>) => NetworkMetrics;
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
export declare const generateCIDRBlocks: (baseOctet?: string, count?: number) => string[];
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
export declare const generateNetworkConnectionData: (sourceNetworkId: string, targetNetworkId: string) => any;
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
export declare const generateSecurityGroupData: (networkId: string, ruleCount?: number) => any;
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
export declare const generateNetworkPeeringData: (requesterNetworkId: string, accepterNetworkId: string) => any;
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
export declare const generateIPAddresses: (count?: number, private_?: boolean) => string[];
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
export declare const createMockNetworkProvider: (config?: Partial<MockProviderConfig>) => any;
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
export declare const createMockMetricsService: () => any;
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
export declare const createMockNotificationService: () => any;
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
export declare const createMockCacheService: () => any;
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
export declare const createMockQueueService: () => any;
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
export declare const createStubRepositoryProvider: (token: string, methods?: Partial<Repository<any>>) => any;
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
export declare const createStubConfigProvider: (config?: Record<string, any>) => any;
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
export declare const createStubLoggerProvider: () => any;
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
export declare const createStubEventEmitterProvider: () => any;
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
export declare const createStubHttpServiceProvider: (responses?: Record<string, any>) => any;
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
export declare const setupTestDatabase: (config: TestDatabaseConfig) => Promise<DataSource>;
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
export declare const teardownTestDatabase: (dataSource: DataSource) => Promise<void>;
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
export declare const clearTestDatabaseTables: (dataSource: DataSource, tableNames: string[]) => Promise<void>;
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
export declare const seedTestDatabase: (dataSource: DataSource, seedData: Record<string, any[]>) => Promise<void>;
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
export declare const runInTestTransaction: (dataSource: DataSource, testFn: (queryRunner: any) => Promise<void>) => Promise<void>;
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
export declare const assertNetworkHasRequiredProperties: (network: any) => void;
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
export declare const assertValidCIDR: (cidr: string) => void;
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
export declare const assertNetworkRelationshipsLoaded: (network: any, expectedRelations: string[]) => void;
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
export declare const assertApiResponse: (response: any, expectedStatus: number) => void;
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
export declare const assertErrorResponse: (error: any, expectedStatus: number, expectedCode: string) => void;
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
export declare const toBeValidNetworkId: (received: string) => CustomMatcherResult;
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
export declare const toBeValidCIDR: (received: string) => CustomMatcherResult;
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
export declare const toBeActiveNetwork: (received: any) => CustomMatcherResult;
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
export declare const toBeInRegion: (received: any, region: string) => CustomMatcherResult;
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
export declare const toHaveNetworkIds: (received: any[], expected: string[]) => CustomMatcherResult;
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
export declare const analyzeNetworkTestCoverage: (coverageData: any) => TestCoverageReport;
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
export declare const generateCoverageSummary: (report: TestCoverageReport) => string;
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
export declare const validateCoverageThresholds: (report: TestCoverageReport, minPercentage?: number) => {
    passed: boolean;
    message: string;
};
declare const _default: {
    generateNetworkTestData: (overrides?: Partial<NetworkTestData>) => NetworkTestData;
    generateBatchNetworkData: (count: number, template?: Partial<NetworkTestData>) => NetworkTestData[];
    generateSubnetTestData: (networkId: string, count?: number) => SubnetTestData[];
    generateRouteTableTestData: (networkId: string, routeCount?: number) => RouteTableTestData;
    generateNetworkMetrics: (overrides?: Partial<NetworkMetrics>) => NetworkMetrics;
    generateCIDRBlocks: (baseOctet?: string, count?: number) => string[];
    generateNetworkConnectionData: (sourceNetworkId: string, targetNetworkId: string) => any;
    generateSecurityGroupData: (networkId: string, ruleCount?: number) => any;
    generateNetworkPeeringData: (requesterNetworkId: string, accepterNetworkId: string) => any;
    generateIPAddresses: (count?: number, private_?: boolean) => string[];
    createMockNetworkProvider: (config?: Partial<MockProviderConfig>) => any;
    createMockMetricsService: () => any;
    createMockNotificationService: () => any;
    createMockCacheService: () => any;
    createMockQueueService: () => any;
    createStubRepositoryProvider: (token: string, methods?: Partial<Repository<any>>) => any;
    createStubConfigProvider: (config?: Record<string, any>) => any;
    createStubLoggerProvider: () => any;
    createStubEventEmitterProvider: () => any;
    createStubHttpServiceProvider: (responses?: Record<string, any>) => any;
    setupTestDatabase: (config: TestDatabaseConfig) => Promise<DataSource>;
    teardownTestDatabase: (dataSource: DataSource) => Promise<void>;
    clearTestDatabaseTables: (dataSource: DataSource, tableNames: string[]) => Promise<void>;
    seedTestDatabase: (dataSource: DataSource, seedData: Record<string, any[]>) => Promise<void>;
    runInTestTransaction: (dataSource: DataSource, testFn: (queryRunner: any) => Promise<void>) => Promise<void>;
    assertNetworkHasRequiredProperties: (network: any) => void;
    assertValidCIDR: (cidr: string) => void;
    assertNetworkRelationshipsLoaded: (network: any, expectedRelations: string[]) => void;
    assertApiResponse: (response: any, expectedStatus: number) => void;
    assertErrorResponse: (error: any, expectedStatus: number, expectedCode: string) => void;
    toBeValidNetworkId: (received: string) => CustomMatcherResult;
    toBeValidCIDR: (received: string) => CustomMatcherResult;
    toBeActiveNetwork: (received: any) => CustomMatcherResult;
    toBeInRegion: (received: any, region: string) => CustomMatcherResult;
    toHaveNetworkIds: (received: any[], expected: string[]) => CustomMatcherResult;
    analyzeNetworkTestCoverage: (coverageData: any) => TestCoverageReport;
    generateCoverageSummary: (report: TestCoverageReport) => string;
    validateCoverageThresholds: (report: TestCoverageReport, minPercentage?: number) => {
        passed: boolean;
        message: string;
    };
};
export default _default;
//# sourceMappingURL=network-test-utilities-kit.d.ts.map