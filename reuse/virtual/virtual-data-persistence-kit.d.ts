/**
 * LOC: VDPK8901234
 * File: /reuse/virtual/virtual-data-persistence-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize (database ORM)
 *   - VMware vRealize Automation API
 *   - Repository pattern frameworks
 *   - Transaction management libraries
 *
 * DOWNSTREAM (imported by):
 *   - Virtual infrastructure data services
 *   - Repository implementations
 *   - Query optimization services
 *   - Connection pool managers
 */
/**
 * File: /reuse/virtual/virtual-data-persistence-kit.ts
 * Locator: WC-VIRT-DPK-002
 * Purpose: Virtual Data Persistence Kit - Comprehensive data persistence patterns for virtualized infrastructure
 *
 * Upstream: Sequelize ORM, VMware vRealize APIs, Repository patterns, CQRS frameworks
 * Downstream: ../backend/*, ../services/*, virtual data access layers
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, PostgreSQL 14+, Redis 7.x
 * Exports: 40 utility functions for repository patterns, query optimization, connection pooling,
 *          transaction management, caching strategies, bulk operations, virtual storage optimization
 *
 * LLM Context: Comprehensive virtual data persistence utilities for White Cross healthcare virtual infrastructure.
 * Provides repository pattern implementations for virtual databases, query optimization for VM storage,
 * connection pool management across virtual datacenters, distributed transaction coordination,
 * caching strategies for virtual environments, bulk operation optimization, change data capture,
 * eventual consistency patterns, and vRealize Automation data integration.
 * Essential for building high-performance, scalable data access layers on virtualized platforms.
 */
import { Sequelize, Model, FindOptions, CreateOptions, UpdateOptions, DestroyOptions, Transaction, WhereOptions } from 'sequelize';
interface VirtualRepositoryConfig {
    virtualDatacenterId: string;
    readReplicaEnabled: boolean;
    cachingStrategy: 'redis' | 'memcached' | 'local' | 'distributed';
    connectionPoolSize: number;
    queryTimeout: number;
}
interface VirtualQueryOptimization {
    useIndexHints: boolean;
    enableQueryCache: boolean;
    prefetchRelations: string[];
    virtualStorageAware: boolean;
    estimatedRowCount?: number;
}
interface VirtualTransactionConfig {
    isolationLevel: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';
    timeout: number;
    retryOnDeadlock: boolean;
    maxRetries: number;
    distributedTransaction: boolean;
    virtualNodeAffinity?: string;
}
interface VirtualBulkOperation {
    batchSize: number;
    parallelization: number;
    useTransaction: boolean;
    validateBeforeInsert: boolean;
    onConflict?: 'ignore' | 'update' | 'error';
    virtualStorageOptimization: boolean;
}
interface VirtualCacheConfig {
    cacheKey: string;
    ttl: number;
    strategy: 'write-through' | 'write-back' | 'write-around' | 'refresh-ahead';
    invalidateOn: Array<'create' | 'update' | 'delete'>;
    distributedCache: boolean;
    virtualNodeLocality: boolean;
}
interface VirtualConnectionPoolMetrics {
    totalConnections: number;
    activeConnections: number;
    idleConnections: number;
    waitingRequests: number;
    averageWaitTime: number;
    virtualNodeId: string;
    datacenterLoad: number;
}
interface VirtualQueryPlan {
    planId: string;
    estimatedCost: number;
    estimatedRows: number;
    actualCost?: number;
    actualRows?: number;
    indexUsage: string[];
    fullTableScans: number;
    virtualStorageReads: number;
}
interface VirtualEventSourcing {
    eventId: string;
    aggregateId: string;
    eventType: string;
    eventData: any;
    timestamp: Date;
    version: number;
    virtualNodeId: string;
}
interface VirtualCQRSConfig {
    commandSide: Sequelize;
    querySide: Sequelize;
    eventBus: 'kafka' | 'rabbitmq' | 'redis' | 'nats';
    eventStore: string;
    projectionSync: 'realtime' | 'eventual' | 'scheduled';
}
interface VirtualChangeDataCapture {
    tableName: string;
    captureInserts: boolean;
    captureUpdates: boolean;
    captureDeletes: boolean;
    destination: 'kafka' | 'kinesis' | 'pubsub' | 'eventhub';
    transformFunction?: (data: any) => any;
}
/**
 * 1. Creates base repository for virtual infrastructure entities.
 *
 * @template T
 * @param {typeof Model} model - Sequelize model class
 * @param {VirtualRepositoryConfig} config - Repository configuration
 * @returns {object} Repository instance with CRUD operations
 *
 * @example
 * ```typescript
 * const patientRepo = createVirtualRepository(PatientModel, {
 *   virtualDatacenterId: 'dc-01',
 *   readReplicaEnabled: true,
 *   cachingStrategy: 'redis',
 *   connectionPoolSize: 50,
 *   queryTimeout: 5000
 * });
 *
 * const patient = await patientRepo.findById('patient-123');
 * ```
 */
export declare const createVirtualRepository: <T extends Model>(model: typeof Model, config: VirtualRepositoryConfig) => {
    findById(id: string | number, options?: FindOptions): Promise<T | null>;
    findAll(options?: FindOptions): Promise<T[]>;
    findOne(options: FindOptions): Promise<T | null>;
    create(data: any, options?: CreateOptions): Promise<T>;
    update(id: string | number, data: any, options?: UpdateOptions): Promise<[number, T[]]>;
    delete(id: string | number, options?: DestroyOptions): Promise<number>;
    count(options?: FindOptions): Promise<number>;
    exists(id: string | number): Promise<boolean>;
};
/**
 * 2. Implements generic repository with virtual storage optimization.
 *
 * @template T
 * @param {typeof Model} model - Sequelize model class
 * @returns {object} Optimized repository interface
 *
 * @example
 * ```typescript
 * const orderRepo = createOptimizedVirtualRepository(OrderModel);
 * const orders = await orderRepo.findWithPagination({ page: 1, limit: 50 });
 * ```
 */
export declare const createOptimizedVirtualRepository: <T extends Model>(model: typeof Model) => {
    findWithPagination(options: {
        page: number;
        limit: number;
        where?: WhereOptions;
        order?: any[];
    }): Promise<{
        rows: T[];
        total: number;
        pages: number;
    }>;
    findWithRelations(id: string | number, relations: string[]): Promise<T | null>;
    bulkCreate(data: any[], options?: {
        transaction?: Transaction;
    }): Promise<T[]>;
    upsert(data: any, options?: {
        transaction?: Transaction;
    }): Promise<[T, boolean]>;
};
/**
 * 3. Creates read-only repository for virtual read replicas.
 *
 * @template T
 * @param {typeof Model} model - Sequelize model class
 * @param {Sequelize} readReplica - Read replica connection
 * @returns {object} Read-only repository
 *
 * @example
 * ```typescript
 * const reportRepo = createVirtualReadOnlyRepository(ReportModel, readReplicaDb);
 * const reports = await reportRepo.findAll({ where: { status: 'completed' } });
 * ```
 */
export declare const createVirtualReadOnlyRepository: <T extends Model>(model: typeof Model, readReplica: Sequelize) => {
    findAll(options?: FindOptions): Promise<T[]>;
    findById(id: string | number, options?: FindOptions): Promise<T | null>;
    count(options?: FindOptions): Promise<number>;
    executeRawQuery<R = any>(query: string, replacements?: any): Promise<R[]>;
};
/**
 * 4. Implements unit of work pattern for virtual transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {object} Unit of work manager
 *
 * @example
 * ```typescript
 * const uow = createVirtualUnitOfWork(sequelize);
 * await uow.execute(async (transaction) => {
 *   await Patient.create({ name: 'John' }, { transaction });
 *   await Visit.create({ patientId: 'john-id' }, { transaction });
 * });
 * ```
 */
export declare const createVirtualUnitOfWork: (sequelize: Sequelize) => {
    execute<T>(work: (transaction: Transaction) => Promise<T>, options?: VirtualTransactionConfig): Promise<T>;
    executeWithRetry<T>(work: (transaction: Transaction) => Promise<T>, config: VirtualTransactionConfig): Promise<T>;
};
/**
 * 5. Optimizes query for virtual storage performance.
 *
 * @template T
 * @param {typeof Model} model - Sequelize model
 * @param {FindOptions} baseOptions - Base query options
 * @param {VirtualQueryOptimization} optimization - Optimization config
 * @returns {Promise<T[]>} Optimized query results
 *
 * @example
 * ```typescript
 * const patients = await executeOptimizedVirtualQuery(PatientModel, {
 *   where: { status: 'active' }
 * }, {
 *   useIndexHints: true,
 *   enableQueryCache: true,
 *   prefetchRelations: ['visits', 'medications'],
 *   virtualStorageAware: true
 * });
 * ```
 */
export declare const executeOptimizedVirtualQuery: <T>(model: typeof Model, baseOptions: FindOptions, optimization: VirtualQueryOptimization) => Promise<T[]>;
/**
 * 6. Analyzes query execution plan for virtual infrastructure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - SQL query to analyze
 * @returns {Promise<VirtualQueryPlan>} Query execution plan
 *
 * @example
 * ```typescript
 * const plan = await analyzeVirtualQueryPlan(sequelize,
 *   'SELECT * FROM patients WHERE tenant_id = $1'
 * );
 * console.log(`Estimated cost: ${plan.estimatedCost}, Index usage: ${plan.indexUsage.join(', ')}`);
 * ```
 */
export declare const analyzeVirtualQueryPlan: (sequelize: Sequelize, query: string) => Promise<VirtualQueryPlan>;
/**
 * 7. Creates query builder for virtual infrastructure.
 *
 * @template T
 * @param {typeof Model} model - Sequelize model
 * @returns {object} Query builder instance
 *
 * @example
 * ```typescript
 * const builder = createVirtualQueryBuilder(PatientModel);
 * const results = await builder
 *   .where('tenantId', '=', 'tenant-123')
 *   .where('status', '=', 'active')
 *   .orderBy('createdAt', 'DESC')
 *   .limit(50)
 *   .execute();
 * ```
 */
export declare const createVirtualQueryBuilder: <T extends Model>(model: typeof Model) => {
    where(field: string, operator: string, value: any): /*elided*/ any;
    whereIn(field: string, values: any[]): /*elided*/ any;
    whereBetween(field: string, start: any, end: any): /*elided*/ any;
    orderBy(field: string, direction?: "ASC" | "DESC"): /*elided*/ any;
    limit(value: number): /*elided*/ any;
    offset(value: number): /*elided*/ any;
    include(relation: string): /*elided*/ any;
    execute(): Promise<T[]>;
    count(): Promise<number>;
    first(): Promise<T | null>;
};
/**
 * 8. Implements query result caching for virtual databases.
 *
 * @template T
 * @param {typeof Model} model - Sequelize model
 * @param {FindOptions} options - Query options
 * @param {VirtualCacheConfig} cacheConfig - Cache configuration
 * @returns {Promise<T[]>} Cached or fresh query results
 *
 * @example
 * ```typescript
 * const cachedResults = await executeVirtualCachedQuery(
 *   PatientModel,
 *   { where: { status: 'active' } },
 *   {
 *     cacheKey: 'active-patients',
 *     ttl: 300,
 *     strategy: 'write-through',
 *     invalidateOn: ['create', 'update', 'delete'],
 *     distributedCache: true,
 *     virtualNodeLocality: true
 *   }
 * );
 * ```
 */
export declare const executeVirtualCachedQuery: <T>(model: typeof Model, options: FindOptions, cacheConfig: VirtualCacheConfig) => Promise<T[]>;
/**
 * 9. Batches multiple queries for virtual storage efficiency.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Array<() => Promise<any>>} queries - Array of query functions
 * @returns {Promise<any[]>} Batched query results
 *
 * @example
 * ```typescript
 * const results = await batchVirtualQueries(sequelize, [
 *   () => PatientModel.findAll({ where: { status: 'active' } }),
 *   () => VisitModel.count({ where: { date: today } }),
 *   () => MedicationModel.findAll({ where: { urgent: true } })
 * ]);
 * ```
 */
export declare const batchVirtualQueries: (sequelize: Sequelize, queries: Array<() => Promise<any>>) => Promise<any[]>;
/**
 * 10. Monitors virtual database connection pool health.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} virtualNodeId - Virtual node identifier
 * @returns {VirtualConnectionPoolMetrics} Connection pool metrics
 *
 * @example
 * ```typescript
 * const metrics = getVirtualConnectionPoolMetrics(sequelize, 'node-01');
 * console.log(`Active: ${metrics.activeConnections}, Idle: ${metrics.idleConnections}`);
 * ```
 */
export declare const getVirtualConnectionPoolMetrics: (sequelize: Sequelize, virtualNodeId: string) => VirtualConnectionPoolMetrics;
/**
 * 11. Optimizes connection pool size for virtual workload.
 *
 * @param {number} expectedConcurrentRequests - Expected concurrent requests
 * @param {number} averageQueryTime - Average query execution time (ms)
 * @param {number} virtualNodeCount - Number of virtual nodes
 * @returns {number} Recommended pool size
 *
 * @example
 * ```typescript
 * const poolSize = calculateVirtualPoolSize(200, 50, 4);
 * console.log(`Recommended pool size: ${poolSize}`);
 * ```
 */
export declare const calculateVirtualPoolSize: (expectedConcurrentRequests: number, averageQueryTime: number, virtualNodeCount: number) => number;
/**
 * 12. Creates adaptive connection pool for virtual infrastructure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} config - Adaptive pool configuration
 * @returns {object} Adaptive pool manager
 *
 * @example
 * ```typescript
 * const adaptivePool = createVirtualAdaptivePool(sequelize, {
 *   minConnections: 5,
 *   maxConnections: 50,
 *   scalingFactor: 1.5,
 *   scaleUpThreshold: 0.8,
 *   scaleDownThreshold: 0.3
 * });
 *
 * adaptivePool.start();
 * ```
 */
export declare const createVirtualAdaptivePool: (sequelize: Sequelize, config: {
    minConnections: number;
    maxConnections: number;
    scalingFactor: number;
    scaleUpThreshold: number;
    scaleDownThreshold: number;
}) => {
    start(): void;
    stop(): void;
    getCurrentSize(): number;
};
/**
 * 13. Executes distributed transaction across virtual nodes.
 *
 * @param {Sequelize[]} sequelizeInstances - Multiple database connections
 * @param {(transactions: Transaction[]) => Promise<void>} work - Transaction work
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeVirtualDistributedTransaction([db1, db2], async ([t1, t2]) => {
 *   await Patient.create({ name: 'John' }, { transaction: t1 });
 *   await Audit.create({ action: 'patient_created' }, { transaction: t2 });
 * });
 * ```
 */
export declare const executeVirtualDistributedTransaction: (sequelizeInstances: Sequelize[], work: (transactions: Transaction[]) => Promise<void>) => Promise<void>;
/**
 * 14. Implements saga pattern for virtual microservices.
 *
 * @param {Array<{ execute: () => Promise<void>; compensate: () => Promise<void> }>} steps - Saga steps
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeVirtualSagaPattern([
 *   {
 *     execute: async () => await createOrder(),
 *     compensate: async () => await cancelOrder()
 *   },
 *   {
 *     execute: async () => await reserveInventory(),
 *     compensate: async () => await releaseInventory()
 *   }
 * ]);
 * ```
 */
export declare const executeVirtualSagaPattern: (steps: Array<{
    execute: () => Promise<void>;
    compensate: () => Promise<void>;
}>) => Promise<void>;
/**
 * 15. Implements optimistic locking for virtual concurrent access.
 *
 * @template T
 * @param {typeof Model} model - Sequelize model
 * @param {string | number} id - Record ID
 * @param {(record: T) => any} updateFn - Update function
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<T>}
 *
 * @example
 * ```typescript
 * const updated = await executeVirtualOptimisticLock(
 *   PatientModel,
 *   'patient-123',
 *   (patient) => ({ ...patient, visitCount: patient.visitCount + 1 }),
 *   3
 * );
 * ```
 */
export declare const executeVirtualOptimisticLock: <T extends Model>(model: typeof Model, id: string | number, updateFn: (record: any) => any, maxRetries?: number) => Promise<T>;
/**
 * 16. Creates savepoint-based nested transactions for virtual databases.
 *
 * @param {Transaction} parentTransaction - Parent transaction
 * @param {(transaction: Transaction) => Promise<void>} work - Nested work
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sequelize.transaction(async (t) => {
 *   await Patient.create({ name: 'John' }, { transaction: t });
 *
 *   await executeVirtualNestedTransaction(t, async (nested) => {
 *     await Visit.create({ patientId: 'john' }, { transaction: nested });
 *   });
 * });
 * ```
 */
export declare const executeVirtualNestedTransaction: (parentTransaction: Transaction, work: (transaction: Transaction) => Promise<void>) => Promise<void>;
/**
 * 17. Executes optimized bulk insert for virtual infrastructure.
 *
 * @template T
 * @param {typeof Model} model - Sequelize model
 * @param {any[]} records - Records to insert
 * @param {VirtualBulkOperation} config - Bulk operation configuration
 * @returns {Promise<T[]>} Inserted records
 *
 * @example
 * ```typescript
 * const inserted = await executeVirtualBulkInsert(
 *   PatientModel,
 *   patientsData,
 *   {
 *     batchSize: 1000,
 *     parallelization: 4,
 *     useTransaction: true,
 *     validateBeforeInsert: true,
 *     onConflict: 'ignore',
 *     virtualStorageOptimization: true
 *   }
 * );
 * ```
 */
export declare const executeVirtualBulkInsert: <T>(model: typeof Model, records: any[], config: VirtualBulkOperation) => Promise<T[]>;
/**
 * 18. Optimizes bulk update for virtual storage.
 *
 * @param {typeof Model} model - Sequelize model
 * @param {Array<{ id: string | number; updates: any }>} records - Records to update
 * @param {VirtualBulkOperation} config - Bulk operation configuration
 * @returns {Promise<number>} Number of updated records
 *
 * @example
 * ```typescript
 * const updated = await executeVirtualBulkUpdate(
 *   PatientModel,
 *   [
 *     { id: '1', updates: { status: 'active' } },
 *     { id: '2', updates: { status: 'inactive' } }
 *   ],
 *   bulkConfig
 * );
 * ```
 */
export declare const executeVirtualBulkUpdate: (model: typeof Model, records: Array<{
    id: string | number;
    updates: any;
}>, config: VirtualBulkOperation) => Promise<number>;
/**
 * 19. Implements streaming bulk operations for large datasets.
 *
 * @template T
 * @param {typeof Model} model - Sequelize model
 * @param {AsyncIterable<any>} dataStream - Data stream
 * @param {(batch: T[]) => Promise<void>} processBatch - Batch processor
 * @param {number} batchSize - Batch size
 * @returns {Promise<number>} Total processed records
 *
 * @example
 * ```typescript
 * const processed = await streamVirtualBulkOperation(
 *   PatientModel,
 *   async function* () {
 *     for (const record of largeDataset) yield record;
 *   }(),
 *   async (batch) => await PatientModel.bulkCreate(batch),
 *   500
 * );
 * ```
 */
export declare const streamVirtualBulkOperation: <T>(model: typeof Model, dataStream: AsyncIterable<any>, processBatch: (batch: T[]) => Promise<void>, batchSize: number) => Promise<number>;
/**
 * 20. Implements write-through cache for virtual databases.
 *
 * @template T
 * @param {typeof Model} model - Sequelize model
 * @param {any} data - Data to create
 * @param {VirtualCacheConfig} cacheConfig - Cache configuration
 * @returns {Promise<T>}
 *
 * @example
 * ```typescript
 * const patient = await createWithVirtualWriteThroughCache(
 *   PatientModel,
 *   { name: 'John Doe', status: 'active' },
 *   cacheConfig
 * );
 * ```
 */
export declare const createWithVirtualWriteThroughCache: <T>(model: typeof Model, data: any, cacheConfig: VirtualCacheConfig) => Promise<T>;
/**
 * 21. Implements cache-aside pattern for virtual infrastructure.
 *
 * @template T
 * @param {typeof Model} model - Sequelize model
 * @param {string | number} id - Record ID
 * @param {VirtualCacheConfig} cacheConfig - Cache configuration
 * @returns {Promise<T | null>}
 *
 * @example
 * ```typescript
 * const patient = await findWithVirtualCacheAside(
 *   PatientModel,
 *   'patient-123',
 *   cacheConfig
 * );
 * ```
 */
export declare const findWithVirtualCacheAside: <T>(model: typeof Model, id: string | number, cacheConfig: VirtualCacheConfig) => Promise<T | null>;
/**
 * 22. Invalidates virtual cache on data changes.
 *
 * @param {string[]} cacheKeys - Cache keys to invalidate
 * @param {string} pattern - Cache key pattern
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await invalidateVirtualCache(['patient:123', 'patient:456'], 'patient:*');
 * ```
 */
export declare const invalidateVirtualCache: (cacheKeys: string[], pattern?: string) => Promise<void>;
/**
 * 23. Configures change data capture for virtual tables.
 *
 * @param {VirtualChangeDataCapture} config - CDC configuration
 * @returns {string} SQL for CDC setup
 *
 * @example
 * ```typescript
 * const sql = configureVirtualCDC({
 *   tableName: 'patients',
 *   captureInserts: true,
 *   captureUpdates: true,
 *   captureDeletes: true,
 *   destination: 'kafka',
 *   transformFunction: (data) => ({ ...data, captured_at: new Date() })
 * });
 * ```
 */
export declare const configureVirtualCDC: (config: VirtualChangeDataCapture) => string;
/**
 * 24. Implements event sourcing for virtual infrastructure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {VirtualEventSourcing} event - Event to store
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await storeVirtualEvent(sequelize, {
 *   eventId: 'evt-001',
 *   aggregateId: 'patient-123',
 *   eventType: 'PatientCreated',
 *   eventData: { name: 'John Doe', dob: '1990-01-01' },
 *   timestamp: new Date(),
 *   version: 1,
 *   virtualNodeId: 'node-01'
 * });
 * ```
 */
export declare const storeVirtualEvent: (sequelize: Sequelize, event: VirtualEventSourcing) => Promise<void>;
/**
 * 25. Replays events from virtual event store.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} aggregateId - Aggregate ID
 * @returns {Promise<VirtualEventSourcing[]>} Event history
 *
 * @example
 * ```typescript
 * const events = await replayVirtualEvents(sequelize, 'patient-123');
 * events.forEach(event => console.log(`${event.eventType}: ${event.version}`));
 * ```
 */
export declare const replayVirtualEvents: (sequelize: Sequelize, aggregateId: string) => Promise<VirtualEventSourcing[]>;
/**
 * 26. Implements CQRS command handler for virtual infrastructure.
 *
 * @template T
 * @param {VirtualCQRSConfig} config - CQRS configuration
 * @param {string} commandType - Command type
 * @param {any} commandData - Command data
 * @returns {Promise<T>}
 *
 * @example
 * ```typescript
 * const result = await executeVirtualCommand(cqrsConfig, 'CreatePatient', {
 *   name: 'John Doe',
 *   dob: '1990-01-01'
 * });
 * ```
 */
export declare const executeVirtualCommand: <T>(config: VirtualCQRSConfig, commandType: string, commandData: any) => Promise<T>;
/**
 * 27. Implements CQRS query handler for virtual read models.
 *
 * @template T
 * @param {VirtualCQRSConfig} config - CQRS configuration
 * @param {string} queryType - Query type
 * @param {any} queryParams - Query parameters
 * @returns {Promise<T>}
 *
 * @example
 * ```typescript
 * const patients = await executeVirtualQuery(cqrsConfig, 'GetActivePatients', {
 *   status: 'active',
 *   limit: 50
 * });
 * ```
 */
export declare const executeVirtualQuery: <T>(config: VirtualCQRSConfig, queryType: string, queryParams: any) => Promise<T>;
/**
 * 28. Synchronizes CQRS projections for virtual infrastructure.
 *
 * @param {VirtualCQRSConfig} config - CQRS configuration
 * @param {VirtualEventSourcing[]} events - Events to project
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await synchronizeVirtualProjections(cqrsConfig, recentEvents);
 * ```
 */
export declare const synchronizeVirtualProjections: (config: VirtualCQRSConfig, events: VirtualEventSourcing[]) => Promise<void>;
/**
 * 29. Implements eventual consistency pattern for virtual distributed systems.
 *
 * @param {Sequelize[]} nodes - Database nodes
 * @param {any} data - Data to replicate
 * @param {number} consistencyWindow - Time window for consistency (ms)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await ensureVirtualEventualConsistency(
 *   [db1, db2, db3],
 *   { id: '123', name: 'Updated' },
 *   5000
 * );
 * ```
 */
export declare const ensureVirtualEventualConsistency: (nodes: Sequelize[], data: any, consistencyWindow: number) => Promise<void>;
/**
 * 30. Implements read-your-writes consistency for virtual infrastructure.
 *
 * @template T
 * @param {Sequelize} primary - Primary database
 * @param {Sequelize} replica - Read replica
 * @param {string | number} recordId - Record ID
 * @param {number} maxWait - Maximum wait time (ms)
 * @returns {Promise<T | null>}
 *
 * @example
 * ```typescript
 * const patient = await readYourWritesVirtual(primaryDb, replicaDb, 'patient-123', 3000);
 * ```
 */
export declare const readYourWritesVirtual: <T>(primary: Sequelize, replica: Sequelize, recordId: string | number, maxWait: number) => Promise<T | null>;
/**
 * 31. Implements materialized path pattern for virtual hierarchical data.
 *
 * @param {typeof Model} model - Sequelize model
 * @param {string} parentId - Parent node ID
 * @returns {Promise<any[]>} Child nodes
 *
 * @example
 * ```typescript
 * const children = await findVirtualHierarchyChildren(CategoryModel, 'cat-root');
 * ```
 */
export declare const findVirtualHierarchyChildren: (model: typeof Model, parentId: string) => Promise<any[]>;
/**
 * 32. Implements adjacency list pattern for virtual graph data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} nodeId - Starting node ID
 * @param {number} depth - Traversal depth
 * @returns {Promise<any[]>} Connected nodes
 *
 * @example
 * ```typescript
 * const network = await traverseVirtualGraph(sequelize, 'node-1', 3);
 * ```
 */
export declare const traverseVirtualGraph: (sequelize: Sequelize, nodeId: string, depth: number) => Promise<any[]>;
/**
 * 33. Implements temporal queries for virtual time-series data.
 *
 * @param {typeof Model} model - Sequelize model
 * @param {Date} asOfDate - Point in time
 * @returns {Promise<any[]>} Historical records
 *
 * @example
 * ```typescript
 * const historical = await queryVirtualTemporal(
 *   PatientModel,
 *   new Date('2023-01-01')
 * );
 * ```
 */
export declare const queryVirtualTemporal: (model: typeof Model, asOfDate: Date) => Promise<any[]>;
/**
 * 34. Implements soft delete with virtual archival.
 *
 * @template T
 * @param {typeof Model} model - Sequelize model
 * @param {string | number} id - Record ID
 * @param {string} userId - User performing deletion
 * @returns {Promise<T>}
 *
 * @example
 * ```typescript
 * await softDeleteVirtual(PatientModel, 'patient-123', 'user-admin');
 * ```
 */
export declare const softDeleteVirtual: <T>(model: typeof Model, id: string | number, userId: string) => Promise<T>;
/**
 * 35. Implements multi-version concurrency control (MVCC) for virtual databases.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string | number} recordId - Record ID
 * @returns {Promise<any[]>} All versions
 *
 * @example
 * ```typescript
 * const versions = await queryVirtualMVCC(sequelize, 'patients', 'patient-123');
 * ```
 */
export declare const queryVirtualMVCC: (sequelize: Sequelize, tableName: string, recordId: string | number) => Promise<any[]>;
/**
 * 36. Profiles virtual query performance.
 *
 * @template T
 * @param {() => Promise<T>} queryFn - Query function to profile
 * @returns {Promise<{ result: T; duration: number; memory: number }>}
 *
 * @example
 * ```typescript
 * const { result, duration, memory } = await profileVirtualQuery(
 *   () => PatientModel.findAll({ where: { status: 'active' } })
 * );
 * console.log(`Query took ${duration}ms and used ${memory}MB`);
 * ```
 */
export declare const profileVirtualQuery: <T>(queryFn: () => Promise<T>) => Promise<{
    result: T;
    duration: number;
    memory: number;
}>;
/**
 * 37. Monitors virtual database slow queries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} threshold - Slow query threshold (ms)
 * @param {(query: string, duration: number) => void} callback - Callback for slow queries
 * @returns {() => void} Function to stop monitoring
 *
 * @example
 * ```typescript
 * const stop = monitorVirtualSlowQueries(sequelize, 1000, (query, duration) => {
 *   console.warn(`Slow query: ${duration}ms - ${query}`);
 * });
 * ```
 */
export declare const monitorVirtualSlowQueries: (sequelize: Sequelize, threshold: number, callback: (query: string, duration: number) => void) => (() => void);
/**
 * 38. Collects virtual database statistics for optimization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ tableStats: any[]; indexStats: any[] }>}
 *
 * @example
 * ```typescript
 * const stats = await collectVirtualDatabaseStats(sequelize);
 * console.log(`Tables: ${stats.tableStats.length}, Indexes: ${stats.indexStats.length}`);
 * ```
 */
export declare const collectVirtualDatabaseStats: (sequelize: Sequelize) => Promise<{
    tableStats: any[];
    indexStats: any[];
}>;
/**
 * 39. Implements virtual database health check.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ healthy: boolean; checks: any[] }>}
 *
 * @example
 * ```typescript
 * const health = await performVirtualHealthCheck(sequelize);
 * if (!health.healthy) {
 *   console.error('Database unhealthy:', health.checks);
 * }
 * ```
 */
export declare const performVirtualHealthCheck: (sequelize: Sequelize) => Promise<{
    healthy: boolean;
    checks: any[];
}>;
/**
 * 40. Generates virtual database performance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Performance report
 *
 * @example
 * ```typescript
 * const report = await generateVirtualPerformanceReport(sequelize);
 * console.log(JSON.stringify(report, null, 2));
 * ```
 */
export declare const generateVirtualPerformanceReport: (sequelize: Sequelize) => Promise<object>;
declare const _default: {
    createVirtualRepository: <T extends Model>(model: typeof Model, config: VirtualRepositoryConfig) => {
        findById(id: string | number, options?: FindOptions): Promise<T | null>;
        findAll(options?: FindOptions): Promise<T[]>;
        findOne(options: FindOptions): Promise<T | null>;
        create(data: any, options?: CreateOptions): Promise<T>;
        update(id: string | number, data: any, options?: UpdateOptions): Promise<[number, T[]]>;
        delete(id: string | number, options?: DestroyOptions): Promise<number>;
        count(options?: FindOptions): Promise<number>;
        exists(id: string | number): Promise<boolean>;
    };
    createOptimizedVirtualRepository: <T extends Model>(model: typeof Model) => {
        findWithPagination(options: {
            page: number;
            limit: number;
            where?: WhereOptions;
            order?: any[];
        }): Promise<{
            rows: T[];
            total: number;
            pages: number;
        }>;
        findWithRelations(id: string | number, relations: string[]): Promise<T | null>;
        bulkCreate(data: any[], options?: {
            transaction?: Transaction;
        }): Promise<T[]>;
        upsert(data: any, options?: {
            transaction?: Transaction;
        }): Promise<[T, boolean]>;
    };
    createVirtualReadOnlyRepository: <T extends Model>(model: typeof Model, readReplica: Sequelize) => {
        findAll(options?: FindOptions): Promise<T[]>;
        findById(id: string | number, options?: FindOptions): Promise<T | null>;
        count(options?: FindOptions): Promise<number>;
        executeRawQuery<R = any>(query: string, replacements?: any): Promise<R[]>;
    };
    createVirtualUnitOfWork: (sequelize: Sequelize) => {
        execute<T>(work: (transaction: Transaction) => Promise<T>, options?: VirtualTransactionConfig): Promise<T>;
        executeWithRetry<T>(work: (transaction: Transaction) => Promise<T>, config: VirtualTransactionConfig): Promise<T>;
    };
    executeOptimizedVirtualQuery: <T>(model: typeof Model, baseOptions: FindOptions, optimization: VirtualQueryOptimization) => Promise<T[]>;
    analyzeVirtualQueryPlan: (sequelize: Sequelize, query: string) => Promise<VirtualQueryPlan>;
    createVirtualQueryBuilder: <T extends Model>(model: typeof Model) => {
        where(field: string, operator: string, value: any): /*elided*/ any;
        whereIn(field: string, values: any[]): /*elided*/ any;
        whereBetween(field: string, start: any, end: any): /*elided*/ any;
        orderBy(field: string, direction?: "ASC" | "DESC"): /*elided*/ any;
        limit(value: number): /*elided*/ any;
        offset(value: number): /*elided*/ any;
        include(relation: string): /*elided*/ any;
        execute(): Promise<T[]>;
        count(): Promise<number>;
        first(): Promise<T | null>;
    };
    executeVirtualCachedQuery: <T>(model: typeof Model, options: FindOptions, cacheConfig: VirtualCacheConfig) => Promise<T[]>;
    batchVirtualQueries: (sequelize: Sequelize, queries: Array<() => Promise<any>>) => Promise<any[]>;
    getVirtualConnectionPoolMetrics: (sequelize: Sequelize, virtualNodeId: string) => VirtualConnectionPoolMetrics;
    calculateVirtualPoolSize: (expectedConcurrentRequests: number, averageQueryTime: number, virtualNodeCount: number) => number;
    createVirtualAdaptivePool: (sequelize: Sequelize, config: {
        minConnections: number;
        maxConnections: number;
        scalingFactor: number;
        scaleUpThreshold: number;
        scaleDownThreshold: number;
    }) => {
        start(): void;
        stop(): void;
        getCurrentSize(): number;
    };
    executeVirtualDistributedTransaction: (sequelizeInstances: Sequelize[], work: (transactions: Transaction[]) => Promise<void>) => Promise<void>;
    executeVirtualSagaPattern: (steps: Array<{
        execute: () => Promise<void>;
        compensate: () => Promise<void>;
    }>) => Promise<void>;
    executeVirtualOptimisticLock: <T extends Model>(model: typeof Model, id: string | number, updateFn: (record: any) => any, maxRetries?: number) => Promise<T>;
    executeVirtualNestedTransaction: (parentTransaction: Transaction, work: (transaction: Transaction) => Promise<void>) => Promise<void>;
    executeVirtualBulkInsert: <T>(model: typeof Model, records: any[], config: VirtualBulkOperation) => Promise<T[]>;
    executeVirtualBulkUpdate: (model: typeof Model, records: Array<{
        id: string | number;
        updates: any;
    }>, config: VirtualBulkOperation) => Promise<number>;
    streamVirtualBulkOperation: <T>(model: typeof Model, dataStream: AsyncIterable<any>, processBatch: (batch: T[]) => Promise<void>, batchSize: number) => Promise<number>;
    createWithVirtualWriteThroughCache: <T>(model: typeof Model, data: any, cacheConfig: VirtualCacheConfig) => Promise<T>;
    findWithVirtualCacheAside: <T>(model: typeof Model, id: string | number, cacheConfig: VirtualCacheConfig) => Promise<T | null>;
    invalidateVirtualCache: (cacheKeys: string[], pattern?: string) => Promise<void>;
    configureVirtualCDC: (config: VirtualChangeDataCapture) => string;
    storeVirtualEvent: (sequelize: Sequelize, event: VirtualEventSourcing) => Promise<void>;
    replayVirtualEvents: (sequelize: Sequelize, aggregateId: string) => Promise<VirtualEventSourcing[]>;
    executeVirtualCommand: <T>(config: VirtualCQRSConfig, commandType: string, commandData: any) => Promise<T>;
    executeVirtualQuery: <T>(config: VirtualCQRSConfig, queryType: string, queryParams: any) => Promise<T>;
    synchronizeVirtualProjections: (config: VirtualCQRSConfig, events: VirtualEventSourcing[]) => Promise<void>;
    ensureVirtualEventualConsistency: (nodes: Sequelize[], data: any, consistencyWindow: number) => Promise<void>;
    readYourWritesVirtual: <T>(primary: Sequelize, replica: Sequelize, recordId: string | number, maxWait: number) => Promise<T | null>;
    findVirtualHierarchyChildren: (model: typeof Model, parentId: string) => Promise<any[]>;
    traverseVirtualGraph: (sequelize: Sequelize, nodeId: string, depth: number) => Promise<any[]>;
    queryVirtualTemporal: (model: typeof Model, asOfDate: Date) => Promise<any[]>;
    softDeleteVirtual: <T>(model: typeof Model, id: string | number, userId: string) => Promise<T>;
    queryVirtualMVCC: (sequelize: Sequelize, tableName: string, recordId: string | number) => Promise<any[]>;
    profileVirtualQuery: <T>(queryFn: () => Promise<T>) => Promise<{
        result: T;
        duration: number;
        memory: number;
    }>;
    monitorVirtualSlowQueries: (sequelize: Sequelize, threshold: number, callback: (query: string, duration: number) => void) => (() => void);
    collectVirtualDatabaseStats: (sequelize: Sequelize) => Promise<{
        tableStats: any[];
        indexStats: any[];
    }>;
    performVirtualHealthCheck: (sequelize: Sequelize) => Promise<{
        healthy: boolean;
        checks: any[];
    }>;
    generateVirtualPerformanceReport: (sequelize: Sequelize) => Promise<object>;
};
export default _default;
//# sourceMappingURL=virtual-data-persistence-kit.d.ts.map