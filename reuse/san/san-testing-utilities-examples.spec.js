"use strict";
/**
 * SAN Testing Utilities - Usage Examples
 *
 * Demonstrates how to use the SAN testing utilities for:
 * - Unit testing
 * - Integration testing
 * - E2E testing
 * - Performance testing
 *
 * @module san-testing-utilities-examples
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
const testing_1 = require("@nestjs/testing");
const request = __importStar(require("supertest"));
const san_testing_utilities_kit_1 = require("./san-testing-utilities-kit");
// ============================================================================
// UNIT TESTING EXAMPLES
// ============================================================================
describe('SAN Volume Service - Unit Tests', () => {
    let volumeService;
    let volumeRepository;
    beforeEach(async () => {
        // Example: Setup unit test with mock repository
        const mockRepo = (0, san_testing_utilities_kit_1.createMockSANVolumeRepository)([
            (0, san_testing_utilities_kit_1.generateSANVolumeFixture)({ id: 'vol-1', name: 'test-volume' }),
            (0, san_testing_utilities_kit_1.generateSANVolumeFixture)({ id: 'vol-2', name: 'test-volume-2' }),
        ]);
        // Mock service class (replace with actual service)
        class SANVolumeService {
            constructor(repository) {
                this.repository = repository;
            }
            async findAll() {
                return this.repository.find();
            }
            async findById(id) {
                return this.repository.findOne({ where: { id } });
            }
            async create(dto) {
                const volume = this.repository.create(dto);
                return this.repository.save(volume);
            }
        }
        const result = await (0, san_testing_utilities_kit_1.setupUnitTest)(SANVolumeService, 'VOLUME_REPOSITORY', mockRepo);
        volumeService = result.service;
        volumeRepository = result.repository;
    });
    it('should return all volumes', async () => {
        const volumes = await volumeService.findAll();
        expect(volumes).toHaveLength(2);
        expect(volumeRepository.find).toHaveBeenCalledTimes(1);
    });
    it('should return a specific volume by id', async () => {
        const volume = await volumeService.findById('vol-1');
        expect(volume).toBeDefined();
        (0, san_testing_utilities_kit_1.assertSANVolumeProperties)(volume, {
            id: 'vol-1',
            name: 'test-volume',
        });
    });
    it('should create a new volume', async () => {
        const createDto = (0, san_testing_utilities_kit_1.generateSANVolumeFixture)({ name: 'new-volume' });
        const volume = await volumeService.create(createDto);
        expect(volume).toBeDefined();
        expect(volumeRepository.create).toHaveBeenCalledWith(createDto);
        expect(volumeRepository.save).toHaveBeenCalled();
    });
    it('should use service spy for testing', async () => {
        const mockVolume = (0, san_testing_utilities_kit_1.generateSANVolumeFixture)();
        const spy = (0, san_testing_utilities_kit_1.createServiceSpy)(volumeService, 'findById', mockVolume);
        const result = await volumeService.findById('vol-1');
        expect(result).toEqual(mockVolume);
        (0, san_testing_utilities_kit_1.verifyMethodCall)(spy, ['vol-1']);
        spy.mockRestore();
    });
});
describe('SAN LUN Service - Unit Tests', () => {
    let lunService;
    let lunRepository;
    beforeEach(() => {
        // Example: Create mock LUN repository
        lunRepository = (0, san_testing_utilities_kit_1.createMockSANLUNRepository)([
            (0, san_testing_utilities_kit_1.generateSANLUNFixture)({ id: 'lun-1', lunNumber: 0 }),
            (0, san_testing_utilities_kit_1.generateSANLUNFixture)({ id: 'lun-2', lunNumber: 1 }),
        ]);
        // Mock service
        lunService = {
            repository: lunRepository,
            async findByLunNumber(lunNumber) {
                return this.repository.findOne({ where: { lunNumber } });
            },
        };
    });
    it('should find LUN by LUN number', async () => {
        const lun = await lunService.findByLunNumber(0);
        expect(lun).toBeDefined();
        (0, san_testing_utilities_kit_1.assertSANLUNProperties)(lun, {
            id: 'lun-1',
            lunNumber: 0,
        });
    });
});
describe('SAN Replication Service - Unit Tests', () => {
    let replicationService;
    beforeEach(() => {
        // Example: Use mock replication service
        replicationService = (0, san_testing_utilities_kit_1.createMockSANReplicationService)();
    });
    it('should create a replication job', async () => {
        const dto = {
            name: 'test-replication',
            sourceVolumeId: 'vol-1',
            targetVolumeId: 'vol-2',
            replicationType: 'async',
        };
        const job = await replicationService.createReplicationJob(dto);
        expect(job).toBeDefined();
        (0, san_testing_utilities_kit_1.assertReplicationJobProperties)(job, {
            name: 'test-replication',
            sourceVolumeId: 'vol-1',
            targetVolumeId: 'vol-2',
            replicationType: 'async',
        });
    });
    it('should start replication', async () => {
        const result = await replicationService.startReplication('job-1');
        expect(result.status).toBe('active');
        expect(replicationService.startReplication).toHaveBeenCalledWith('job-1');
    });
    it('should perform failover', async () => {
        const result = await replicationService.performFailover('job-1');
        expect(result.status).toBe('completed');
    });
});
// ============================================================================
// INTEGRATION TESTING EXAMPLES
// ============================================================================
describe('SAN Module - Integration Tests', () => {
    let module;
    let volumeRepository;
    let lunRepository;
    let snapshotRepository;
    beforeAll(async () => {
        // Example: Create integration test with in-memory database
        module = await testing_1.Test.createTestingModule({
            imports: [
            // createTestDatabaseModule([VolumeEntity, LUNEntity, SnapshotEntity]),
            ],
            providers: [
            // Add your service providers here
            ],
        }).compile();
        // Mock repositories for this example
        volumeRepository = (0, san_testing_utilities_kit_1.createMockSANVolumeRepository)();
        lunRepository = (0, san_testing_utilities_kit_1.createMockSANLUNRepository)();
        snapshotRepository = createMockSANSnapshotRepository();
    });
    afterAll(async () => {
        await module?.close();
    });
    beforeEach(async () => {
        // Example: Clean database before each test
        await (0, san_testing_utilities_kit_1.cleanSANTestData)({
            volumeRepo: volumeRepository,
            lunRepo: lunRepository,
            snapshotRepo: snapshotRepository,
        });
    });
    it('should seed test data successfully', async () => {
        // Example: Seed database with test data
        const seededData = await (0, san_testing_utilities_kit_1.seedSANTestData)({
            volumeRepo: volumeRepository,
            lunRepo: lunRepository,
            snapshotRepo: snapshotRepository,
        });
        expect(seededData.volumes).toBeDefined();
        expect(seededData.luns).toBeDefined();
        expect(seededData.snapshots).toBeDefined();
    });
    it('should create and retrieve volume with LUNs', async () => {
        const volume = (0, san_testing_utilities_kit_1.generateSANVolumeFixture)({ name: 'integration-volume' });
        const savedVolume = await volumeRepository.save(volume);
        const luns = (0, san_testing_utilities_kit_1.generateSANLUNFixture)({ volumeId: savedVolume.id });
        await lunRepository.save(luns);
        const retrieved = await volumeRepository.findOne({ where: { id: savedVolume.id } });
        expect(retrieved).toBeDefined();
        expect(retrieved.id).toBe(savedVolume.id);
    });
    it('should wait for snapshot to become available', async () => {
        const snapshot = (0, san_testing_utilities_kit_1.generateSANSnapshotFixture)({ status: 'creating' });
        await snapshotRepository.save(snapshot);
        // Simulate snapshot becoming available
        setTimeout(() => {
            snapshot.status = 'available';
        }, 100);
        await (0, san_testing_utilities_kit_1.waitForCondition)(async () => {
            const current = await snapshotRepository.findOne({ where: { id: snapshot.id } });
            return current?.status === 'available';
        }, 1000, 50);
        const finalSnapshot = await snapshotRepository.findOne({ where: { id: snapshot.id } });
        (0, san_testing_utilities_kit_1.assertSANSnapshotProperties)(finalSnapshot, { status: 'available' });
    });
    it('should test complete SAN hierarchy', async () => {
        const hierarchy = (0, san_testing_utilities_kit_1.generateSANHierarchy)();
        // Save pool
        const savedPool = await volumeRepository.save(hierarchy.pool);
        // Save volumes
        const savedVolumes = await Promise.all(hierarchy.volumes.map((v) => volumeRepository.save(v)));
        // Save LUNs
        const savedLUNs = await Promise.all(hierarchy.luns.map((l) => lunRepository.save(l)));
        // Save snapshots
        const savedSnapshots = await Promise.all(hierarchy.snapshots.map((s) => snapshotRepository.save(s)));
        expect(savedVolumes).toHaveLength(3);
        expect(savedLUNs.length).toBeGreaterThan(0);
        expect(savedSnapshots.length).toBeGreaterThan(0);
    });
});
// ============================================================================
// E2E TESTING EXAMPLES
// ============================================================================
describe('SAN API - E2E Tests', () => {
    let app;
    let context;
    beforeAll(async () => {
        // Example: Create E2E test application
        // Uncomment and replace with actual AppModule
        // app = await createE2ETestApp(AppModule);
        // Mock app for demonstration
        const mockApp = {
            getHttpServer: () => ({}),
            init: jest.fn(),
            close: jest.fn(),
        };
        app = mockApp;
        // Create test context with authentication
        context = await (0, san_testing_utilities_kit_1.createE2ETestContext)(app, {
            email: 'test@whitecross.com',
            password: 'Test123!',
        });
    });
    afterAll(async () => {
        await (0, san_testing_utilities_kit_1.cleanupE2ETestResources)(context);
        await app?.close();
    });
    describe('POST /san/volumes', () => {
        it('should create a new volume', async () => {
            const createDto = {
                name: 'e2e-test-volume',
                capacity: 1000,
                capacityUnit: 'GB',
                type: 'block',
                storagePoolId: 'pool-1',
            };
            const response = await request(app.getHttpServer())
                .post('/san/volumes')
                .set('Authorization', `Bearer ${context.authToken}`)
                .send(createDto)
                .expect(201);
            (0, san_testing_utilities_kit_1.assertAPIResponse)(response, 201, ['id', 'name', 'capacity']);
            (0, san_testing_utilities_kit_1.assertSANVolumeProperties)(response.body, {
                name: 'e2e-test-volume',
                capacity: 1000,
            });
            // Track for cleanup
            context.createdResources.volumes.push(response.body.id);
        });
        it('should validate required fields', async () => {
            const response = await request(app.getHttpServer())
                .post('/san/volumes')
                .set('Authorization', `Bearer ${context.authToken}`)
                .send({})
                .expect(400);
            expect(response.body.message).toBeDefined();
        });
    });
    describe('GET /san/volumes/:id', () => {
        it('should retrieve a volume by id', async () => {
            // Create volume first
            const volume = (0, san_testing_utilities_kit_1.generateSANVolumeFixture)();
            const response = await (0, san_testing_utilities_kit_1.executeAuthenticatedRequest)(app, 'get', `/san/volumes/${volume.id}`, context.authToken);
            (0, san_testing_utilities_kit_1.assertAPIResponse)(response, 200, ['id', 'name']);
        });
        it('should return 404 for non-existent volume', async () => {
            const response = await request(app.getHttpServer())
                .get('/san/volumes/non-existent-id')
                .set('Authorization', `Bearer ${context.authToken}`)
                .expect(404);
            expect(response.body.message).toContain('not found');
        });
    });
    describe('POST /san/snapshots', () => {
        it('should create a snapshot of a volume', async () => {
            const createDto = {
                name: 'e2e-test-snapshot',
                volumeId: 'vol-1',
                retentionDays: 7,
            };
            const response = await request(app.getHttpServer())
                .post('/san/snapshots')
                .set('Authorization', `Bearer ${context.authToken}`)
                .send(createDto)
                .expect(201);
            (0, san_testing_utilities_kit_1.assertSANSnapshotProperties)(response.body, {
                name: 'e2e-test-snapshot',
                volumeId: 'vol-1',
                retentionDays: 7,
            });
            context.createdResources.snapshots.push(response.body.id);
        });
    });
    describe('POST /san/replication', () => {
        it('should create a replication job', async () => {
            const createDto = {
                name: 'e2e-test-replication',
                sourceVolumeId: 'vol-1',
                targetVolumeId: 'vol-2',
                replicationType: 'async',
            };
            const response = await request(app.getHttpServer())
                .post('/san/replication')
                .set('Authorization', `Bearer ${context.authToken}`)
                .send(createDto)
                .expect(201);
            (0, san_testing_utilities_kit_1.assertReplicationJobProperties)(response.body, {
                name: 'e2e-test-replication',
                replicationType: 'async',
            });
            context.createdResources.replicationJobs.push(response.body.id);
        });
    });
});
// ============================================================================
// PERFORMANCE TESTING EXAMPLES
// ============================================================================
describe('SAN Performance Tests', () => {
    describe('Volume Operations Performance', () => {
        it('should measure volume creation time', async () => {
            const operation = async () => {
                const volume = (0, san_testing_utilities_kit_1.generateSANVolumeFixture)();
                // Simulate database save
                await new Promise((resolve) => setTimeout(resolve, 10));
                return volume;
            };
            const { result, executionTime } = await (0, san_testing_utilities_kit_1.measureExecutionTime)(operation);
            expect(result).toBeDefined();
            expect(executionTime).toBeLessThan(100); // Should complete within 100ms
        });
        it('should measure memory usage during bulk operations', async () => {
            const operation = async () => {
                const volumes = (0, san_testing_utilities_kit_1.generateSANVolumeFixtures)(1000);
                return volumes;
            };
            const { result, memoryUsage } = await (0, san_testing_utilities_kit_1.measureMemoryUsage)(operation);
            expect(result).toHaveLength(1000);
            expect(memoryUsage).toBeLessThan(50); // Should use less than 50MB
        });
        it('should run performance test for volume queries', async () => {
            const mockRepository = (0, san_testing_utilities_kit_1.createMockSANVolumeRepository)((0, san_testing_utilities_kit_1.generateSANVolumeFixtures)(100));
            const operation = async () => {
                await mockRepository.find();
            };
            const result = await (0, san_testing_utilities_kit_1.runPerformanceTest)('Volume Query', operation, 100);
            (0, san_testing_utilities_kit_1.assertPerformanceThreshold)(result, {
                maxExecutionTime: 50,
                minSuccessRate: 95,
            });
            expect(result.operationName).toBe('Volume Query');
            expect(result.successRate).toBeGreaterThanOrEqual(95);
        });
    });
    describe('Snapshot Operations Performance', () => {
        it('should run load test for concurrent snapshot creation', async () => {
            const mockRepository = createMockSANSnapshotRepository();
            const operation = async () => {
                const snapshot = (0, san_testing_utilities_kit_1.generateSANSnapshotFixture)();
                await mockRepository.save(snapshot);
            };
            const result = await (0, san_testing_utilities_kit_1.runLoadTest)('Concurrent Snapshot Creation', operation, 10, // 10 concurrent workers
            5000 // 5 second duration
            );
            (0, san_testing_utilities_kit_1.assertPerformanceThreshold)(result, {
                minThroughput: 50, // At least 50 ops/second
                minSuccessRate: 95,
            });
            expect(result.throughput).toBeDefined();
            expect(result.throughput).toBeGreaterThan(0);
        });
    });
    describe('Replication Performance', () => {
        it('should measure replication job execution time', async () => {
            const replicationService = (0, san_testing_utilities_kit_1.createMockSANReplicationService)();
            const operation = async () => {
                await replicationService.startReplication('job-1');
            };
            const performanceResult = await (0, san_testing_utilities_kit_1.runPerformanceTest)('Replication Job Start', operation, 50);
            expect(performanceResult.executionTime).toBeLessThan(100);
            expect(performanceResult.errorCount).toBe(0);
        });
    });
    describe('Complex Query Performance', () => {
        it('should test performance of hierarchical data retrieval', async () => {
            const operation = async () => {
                const hierarchy = (0, san_testing_utilities_kit_1.generateSANHierarchy)();
                // Simulate complex query
                const volumes = hierarchy.volumes;
                const luns = hierarchy.luns.filter((l) => volumes.some((v) => v.id === l.volumeId));
                const snapshots = hierarchy.snapshots.filter((s) => volumes.some((v) => v.id === s.volumeId));
                return { volumes, luns, snapshots };
            };
            const { result, executionTime } = await (0, san_testing_utilities_kit_1.measureExecutionTime)(operation);
            expect(result.volumes).toBeDefined();
            expect(executionTime).toBeLessThan(50);
        });
    });
});
// ============================================================================
// ADVANCED TESTING SCENARIOS
// ============================================================================
describe('Advanced SAN Testing Scenarios', () => {
    describe('Volume Lifecycle Testing', () => {
        it('should test complete volume lifecycle', async () => {
            const mockVolumeRepo = (0, san_testing_utilities_kit_1.createMockSANVolumeRepository)();
            const mockLUNRepo = (0, san_testing_utilities_kit_1.createMockSANLUNRepository)();
            const mockSnapshotRepo = createMockSANSnapshotRepository();
            // 1. Create volume
            const volume = (0, san_testing_utilities_kit_1.generateSANVolumeFixture)({ status: 'online' });
            const savedVolume = await mockVolumeRepo.save(volume);
            (0, san_testing_utilities_kit_1.assertSANVolumeProperties)(savedVolume, { status: 'online' });
            // 2. Create LUNs
            const luns = generateSANLUNFixtures(3, savedVolume.id);
            const savedLUNs = await Promise.all(luns.map((lun) => mockLUNRepo.save(lun)));
            expect(savedLUNs).toHaveLength(3);
            // 3. Create snapshots
            const snapshots = generateSANSnapshotFixtures(5, savedVolume.id);
            const savedSnapshots = await Promise.all(snapshots.map((snap) => mockSnapshotRepo.save(snap)));
            expect(savedSnapshots).toHaveLength(5);
            // 4. Verify relationships
            savedLUNs.forEach((lun) => {
                expect(lun.volumeId).toBe(savedVolume.id);
            });
            savedSnapshots.forEach((snap) => {
                expect(snap.volumeId).toBe(savedVolume.id);
            });
        });
    });
    describe('Replication Failover Testing', () => {
        it('should test replication failover scenario', async () => {
            const replicationService = (0, san_testing_utilities_kit_1.createMockSANReplicationService)();
            // 1. Create replication job
            const job = await replicationService.createReplicationJob({
                name: 'failover-test',
                sourceVolumeId: 'vol-1',
                targetVolumeId: 'vol-2',
                replicationType: 'sync',
            });
            expect(job.status).toBe('active');
            // 2. Start replication
            await replicationService.startReplication(job.id);
            // 3. Perform failover
            const failoverResult = await replicationService.performFailover(job.id);
            expect(failoverResult.status).toBe('completed');
        });
    });
    describe('High Availability Testing', () => {
        it('should test volume multipath configuration', async () => {
            const luns = generateSANLUNFixtures(4, 'vol-1', { multipath: true });
            luns.forEach((lun) => {
                (0, san_testing_utilities_kit_1.assertSANLUNProperties)(lun, { multipath: true });
            });
            // Verify each LUN has unique WWN
            const wwns = new Set(luns.map((l) => l.wwn));
            expect(wwns.size).toBe(luns.length);
        });
    });
    describe('Capacity Management Testing', () => {
        it('should test storage pool capacity calculations', async () => {
            const pool = generateSANStoragePoolFixture({
                totalCapacity: 100,
                usedCapacity: 60,
                capacityUnit: 'TB',
            });
            expect(pool.availableCapacity).toBe(40);
            expect(pool.totalCapacity).toBeGreaterThan(pool.usedCapacity);
            // Calculate utilization percentage
            const utilizationPercent = (pool.usedCapacity / pool.totalCapacity) * 100;
            expect(utilizationPercent).toBe(60);
        });
    });
    describe('HIPAA Compliance Testing', () => {
        it('should ensure encryption is enabled for sensitive volumes', async () => {
            const sensitiveVolume = (0, san_testing_utilities_kit_1.generateSANVolumeFixture)({
                encryption: true,
                tags: { compliance: 'HIPAA', sensitivity: 'high' },
            });
            (0, san_testing_utilities_kit_1.assertSANVolumeProperties)(sensitiveVolume, { encryption: true });
            expect(sensitiveVolume.tags?.compliance).toBe('HIPAA');
        });
        it('should test audit trail for volume operations', async () => {
            const volume = (0, san_testing_utilities_kit_1.generateSANVolumeFixture)();
            expect(volume.createdAt).toBeDefined();
            expect(volume.updatedAt).toBeDefined();
            expect(volume.createdAt).toBeInstanceOf(Date);
        });
    });
});
//# sourceMappingURL=san-testing-utilities-examples.spec.js.map