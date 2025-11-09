/**
 * LOC: VRT_RSC_QRY_001
 * File: /reuse/virtual/virtual-resource-queries-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM core)
 *   - @nestjs/common
 *   - Virtual infrastructure models
 *
 * DOWNSTREAM (imported by):
 *   - Virtual resource service modules
 *   - VMware integration services
 *   - Resource management controllers
 *   - Capacity planning services
 */
/**
 * File: /reuse/virtual/virtual-resource-queries-kit.ts
 * Locator: WC-VIRT-RQK-001
 * Purpose: Virtual Resource Queries Kit - Advanced Sequelize queries for virtual infrastructure management
 *
 * Upstream: Sequelize 6.x, NestJS, VMware vRealize APIs
 * Downstream: ../backend/services/virtual/*, ../controllers/virtual/*, resource management modules
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, PostgreSQL 14+
 * Exports: 44 query functions for virtual resource management, filtering, pagination, aggregation, optimization
 *
 * LLM Context: Enterprise-grade Sequelize query utilities for VMware vRealize-style virtual infrastructure.
 * Provides optimized queries for VM lifecycle management, resource allocation, cluster operations, datastore management,
 * network configuration, snapshot handling, migration tracking, capacity planning, performance monitoring, and compliance.
 * Includes advanced query optimization, N+1 prevention, eager loading strategies, raw SQL for complex operations,
 * cursor-based pagination, subqueries, window functions, and aggregate operations.
 * Essential for high-performance virtual infrastructure operations at healthcare enterprise scale.
 */
import { Sequelize, Transaction, FindOptions, WhereOptions } from 'sequelize';
/**
 * Virtual machine query filter options
 */
export interface VmQueryFilters {
    status?: string[];
    powerState?: string[];
    hostId?: string;
    clusterId?: string;
    datastoreId?: string;
    minCpu?: number;
    maxCpu?: number;
    minMemory?: number;
    maxMemory?: number;
    tags?: string[];
    createdAfter?: Date;
    createdBefore?: Date;
    searchTerm?: string;
}
/**
 * Resource allocation query options
 */
export interface ResourceAllocationOptions {
    resourceType: 'cpu' | 'memory' | 'storage' | 'network';
    groupBy: 'host' | 'cluster' | 'datastore' | 'vm';
    includeReservations?: boolean;
    includeOvercommit?: boolean;
    timeRange?: {
        start: Date;
        end: Date;
    };
}
/**
 * Pagination options with cursor support
 */
export interface CursorPaginationOptions {
    limit?: number;
    cursor?: string;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
}
/**
 * Aggregation query options
 */
export interface AggregationOptions {
    groupBy: string[];
    metrics: Array<{
        field: string;
        operation: 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT';
        alias: string;
    }>;
    having?: WhereOptions;
}
/**
 * Complex filter criteria
 */
export interface ComplexFilterCriteria {
    conditions: Array<{
        field: string;
        operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'notIn' | 'like' | 'between';
        value: any;
    }>;
    logicalOperator?: 'AND' | 'OR';
}
/**
 * Query optimization hints
 */
export interface QueryOptimizationHints {
    useIndex?: string[];
    subQuery?: boolean;
    raw?: boolean;
    nest?: boolean;
    benchmark?: boolean;
}
/**
 * @function findVirtualMachineById
 * @description Finds a virtual machine by ID with optimized eager loading
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} vmId - Virtual machine ID
 * @param {boolean} [includeRelations=true] - Include related resources
 * @returns {Promise<any>} Virtual machine instance
 *
 * @example
 * ```typescript
 * const vm = await findVirtualMachineById(sequelize, 'vm-123', true);
 * console.log(vm.host.name, vm.datastore.capacity);
 * ```
 */
export declare const findVirtualMachineById: (sequelize: Sequelize, vmId: string, includeRelations?: boolean) => Promise<any>;
/**
 * @function findVirtualMachinesByFilters
 * @description Complex filtered VM search with optimized query construction
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {VmQueryFilters} filters - Filter criteria
 * @param {CursorPaginationOptions} [pagination] - Pagination options
 * @returns {Promise<{rows: any[], cursor: string | null}>} Filtered VMs with cursor
 *
 * @optimization Uses indexes on status, powerState, hostId, clusterId for fast filtering
 *
 * @example
 * ```typescript
 * const result = await findVirtualMachinesByFilters(sequelize, {
 *   status: ['active'],
 *   powerState: ['running'],
 *   minCpu: 2,
 *   tags: ['production', 'healthcare']
 * }, { limit: 50 });
 * ```
 */
export declare const findVirtualMachinesByFilters: (sequelize: Sequelize, filters: VmQueryFilters, pagination?: CursorPaginationOptions) => Promise<{
    rows: any[];
    cursor: string | null;
}>;
/**
 * @function findHostsWithCapacity
 * @description Finds hosts with available capacity for VM placement
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} requiredCpu - Required CPU cores
 * @param {number} requiredMemory - Required memory in GB
 * @param {string} [clusterId] - Optional cluster filter
 * @returns {Promise<any[]>} Hosts with sufficient capacity
 *
 * @optimization Uses aggregation and HAVING clause for efficient filtering
 *
 * @example
 * ```typescript
 * const hosts = await findHostsWithCapacity(sequelize, 4, 16, 'cluster-prod');
 * // Returns hosts with at least 4 CPU cores and 16GB memory available
 * ```
 */
export declare const findHostsWithCapacity: (sequelize: Sequelize, requiredCpu: number, requiredMemory: number, clusterId?: string) => Promise<any[]>;
/**
 * @function findDatastoresWithSpace
 * @description Finds datastores with available storage space
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} requiredSpaceGb - Required space in GB
 * @param {string[]} [types] - Datastore types (e.g., ['SSD', 'NVMe'])
 * @returns {Promise<any[]>} Datastores with sufficient space
 *
 * @example
 * ```typescript
 * const datastores = await findDatastoresWithSpace(sequelize, 500, ['SSD']);
 * ```
 */
export declare const findDatastoresWithSpace: (sequelize: Sequelize, requiredSpaceGb: number, types?: string[]) => Promise<any[]>;
/**
 * @function executeComplexFilter
 * @description Executes complex multi-condition filtering with dynamic operators
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model to query
 * @param {ComplexFilterCriteria} criteria - Filter criteria
 * @returns {Promise<any[]>} Filtered results
 *
 * @example
 * ```typescript
 * const vms = await executeComplexFilter(sequelize, 'VirtualMachine', {
 *   conditions: [
 *     { field: 'cpuCores', operator: 'gte', value: 4 },
 *     { field: 'memoryGb', operator: 'gte', value: 16 },
 *     { field: 'status', operator: 'in', value: ['active', 'running'] }
 *   ],
 *   logicalOperator: 'AND'
 * });
 * ```
 */
export declare const executeComplexFilter: (sequelize: Sequelize, modelName: string, criteria: ComplexFilterCriteria) => Promise<any[]>;
/**
 * @function searchVirtualResourcesFullText
 * @description Full-text search across virtual resources
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} searchTerm - Search term
 * @param {string[]} [resourceTypes] - Resource types to search
 * @returns {Promise<any[]>} Search results with relevance ranking
 *
 * @optimization Uses PostgreSQL full-text search with tsvector
 *
 * @example
 * ```typescript
 * const results = await searchVirtualResourcesFullText(
 *   sequelize,
 *   'production database',
 *   ['VirtualMachine', 'Host']
 * );
 * ```
 */
export declare const searchVirtualResourcesFullText: (sequelize: Sequelize, searchTerm: string, resourceTypes?: string[]) => Promise<any[]>;
/**
 * @function findVmsByTagHierarchy
 * @description Finds VMs by hierarchical tag structure
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} tagQuery - JSONB tag query
 * @returns {Promise<any[]>} VMs matching tag criteria
 *
 * @example
 * ```typescript
 * const vms = await findVmsByTagHierarchy(sequelize, {
 *   environment: 'production',
 *   tier: 'web',
 *   compliance: ['HIPAA', 'SOC2']
 * });
 * ```
 */
export declare const findVmsByTagHierarchy: (sequelize: Sequelize, tagQuery: object) => Promise<any[]>;
/**
 * @function aggregateResourcesByGroup
 * @description Generic aggregation query with grouping
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model to aggregate
 * @param {AggregationOptions} options - Aggregation configuration
 * @returns {Promise<any[]>} Aggregated results
 *
 * @example
 * ```typescript
 * const stats = await aggregateResourcesByGroup(sequelize, 'VirtualMachine', {
 *   groupBy: ['clusterId', 'powerState'],
 *   metrics: [
 *     { field: 'cpuCores', operation: 'SUM', alias: 'totalCpu' },
 *     { field: 'memoryGb', operation: 'SUM', alias: 'totalMemory' },
 *     { field: 'id', operation: 'COUNT', alias: 'vmCount' }
 *   ]
 * });
 * ```
 */
export declare const aggregateResourcesByGroup: (sequelize: Sequelize, modelName: string, options: AggregationOptions) => Promise<any[]>;
/**
 * @function getClusterResourceUtilization
 * @description Gets comprehensive cluster resource utilization
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} clusterId - Cluster ID
 * @returns {Promise<any>} Cluster utilization metrics
 *
 * @example
 * ```typescript
 * const utilization = await getClusterResourceUtilization(sequelize, 'cluster-1');
 * // Returns: { totalCpu, usedCpu, totalMemory, usedMemory, vmCount, hostCount, ... }
 * ```
 */
export declare const getClusterResourceUtilization: (sequelize: Sequelize, clusterId: string) => Promise<any>;
/**
 * @function getDatastoreUtilizationTrend
 * @description Gets datastore utilization trend over time
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} datastoreId - Datastore ID
 * @param {number} [days=30] - Number of days to analyze
 * @returns {Promise<any[]>} Daily utilization data
 *
 * @example
 * ```typescript
 * const trend = await getDatastoreUtilizationTrend(sequelize, 'ds-1', 30);
 * ```
 */
export declare const getDatastoreUtilizationTrend: (sequelize: Sequelize, datastoreId: string, days?: number) => Promise<any[]>;
/**
 * @function sortVmsByMultipleCriteria
 * @description Sorts VMs by multiple criteria with NULL handling
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Array<{field: string, direction: 'ASC' | 'DESC', nulls?: 'FIRST' | 'LAST'}>} sortCriteria - Sort configuration
 * @param {WhereOptions} [filters] - Optional filters
 * @returns {Promise<any[]>} Sorted VMs
 *
 * @example
 * ```typescript
 * const vms = await sortVmsByMultipleCriteria(sequelize, [
 *   { field: 'cpuCores', direction: 'DESC', nulls: 'LAST' },
 *   { field: 'memoryGb', direction: 'DESC' },
 *   { field: 'name', direction: 'ASC' }
 * ]);
 * ```
 */
export declare const sortVmsByMultipleCriteria: (sequelize: Sequelize, sortCriteria: Array<{
    field: string;
    direction: "ASC" | "DESC";
    nulls?: "FIRST" | "LAST";
}>, filters?: WhereOptions) => Promise<any[]>;
/**
 * @function rankHostsByPerformance
 * @description Ranks hosts by performance metrics using window functions
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [clusterId] - Optional cluster filter
 * @returns {Promise<any[]>} Ranked hosts
 *
 * @optimization Uses window functions for efficient ranking
 *
 * @example
 * ```typescript
 * const rankedHosts = await rankHostsByPerformance(sequelize, 'cluster-1');
 * ```
 */
export declare const rankHostsByPerformance: (sequelize: Sequelize, clusterId?: string) => Promise<any[]>;
/**
 * @function paginateWithOffsetLimit
 * @description Traditional offset/limit pagination with total count
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model to paginate
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @param {FindOptions} [options] - Additional query options
 * @returns {Promise<{rows: any[], count: number, pages: number}>} Paginated results
 *
 * @example
 * ```typescript
 * const result = await paginateWithOffsetLimit(sequelize, 'VirtualMachine', 1, 20, {
 *   where: { status: 'active' },
 *   order: [['createdAt', 'DESC']]
 * });
 * ```
 */
export declare const paginateWithOffsetLimit: (sequelize: Sequelize, modelName: string, page: number, pageSize: number, options?: FindOptions) => Promise<{
    rows: any[];
    count: number;
    pages: number;
}>;
/**
 * @function paginateWithCursor
 * @description Cursor-based pagination for better performance on large datasets
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model to paginate
 * @param {CursorPaginationOptions} options - Cursor pagination options
 * @param {WhereOptions} [filters] - Optional filters
 * @returns {Promise<{rows: any[], nextCursor: string | null, hasMore: boolean}>} Cursor results
 *
 * @optimization More efficient than offset/limit for large datasets
 *
 * @example
 * ```typescript
 * const result = await paginateWithCursor(sequelize, 'VirtualMachine', {
 *   limit: 50,
 *   cursor: 'eyJpZCI6IjEyMyJ9',
 *   orderBy: 'createdAt',
 *   orderDirection: 'DESC'
 * });
 * ```
 */
export declare const paginateWithCursor: (sequelize: Sequelize, modelName: string, options: CursorPaginationOptions, filters?: WhereOptions) => Promise<{
    rows: any[];
    nextCursor: string | null;
    hasMore: boolean;
}>;
/**
 * @function paginateWithKeyset
 * @description Keyset pagination for deterministic ordering
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model to paginate
 * @param {string} keyField - Key field for pagination
 * @param {any} lastKey - Last key from previous page
 * @param {number} limit - Page size
 * @returns {Promise<any[]>} Paginated results
 *
 * @example
 * ```typescript
 * const page1 = await paginateWithKeyset(sequelize, 'VirtualMachine', 'id', null, 20);
 * const page2 = await paginateWithKeyset(sequelize, 'VirtualMachine', 'id', page1[page1.length - 1].id, 20);
 * ```
 */
export declare const paginateWithKeyset: (sequelize: Sequelize, modelName: string, keyField: string, lastKey: any, limit: number) => Promise<any[]>;
/**
 * @function findVmsWithEagerLoading
 * @description Finds VMs with optimized eager loading to prevent N+1 queries
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {WhereOptions} [filters] - Optional filters
 * @returns {Promise<any[]>} VMs with all relations loaded
 *
 * @optimization Prevents N+1 by using separate queries for has-many relations
 *
 * @example
 * ```typescript
 * const vms = await findVmsWithEagerLoading(sequelize, { clusterId: 'cluster-1' });
 * // All relations loaded in 4 queries instead of N+1
 * ```
 */
export declare const findVmsWithEagerLoading: (sequelize: Sequelize, filters?: WhereOptions) => Promise<any[]>;
/**
 * @function batchLoadVirtualMachines
 * @description Batch loads VMs with DataLoader pattern
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} vmIds - Array of VM IDs to load
 * @returns {Promise<Map<string, any>>} Map of VM ID to VM instance
 *
 * @optimization Single query to load multiple VMs
 *
 * @example
 * ```typescript
 * const vmMap = await batchLoadVirtualMachines(sequelize, ['vm-1', 'vm-2', 'vm-3']);
 * const vm1 = vmMap.get('vm-1');
 * ```
 */
export declare const batchLoadVirtualMachines: (sequelize: Sequelize, vmIds: string[]) => Promise<Map<string, any>>;
/**
 * @function findWithQueryOptimization
 * @description Executes query with optimization hints
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model to query
 * @param {FindOptions} baseOptions - Base query options
 * @param {QueryOptimizationHints} hints - Optimization hints
 * @returns {Promise<any[]>} Query results
 *
 * @example
 * ```typescript
 * const results = await findWithQueryOptimization(sequelize, 'VirtualMachine', {
 *   where: { status: 'active' }
 * }, {
 *   useIndex: ['idx_status'],
 *   subQuery: false,
 *   raw: true
 * });
 * ```
 */
export declare const findWithQueryOptimization: (sequelize: Sequelize, modelName: string, baseOptions: FindOptions, hints: QueryOptimizationHints) => Promise<any[]>;
/**
 * @function getVmCountByStatus
 * @description Gets VM counts grouped by status (optimized)
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [clusterId] - Optional cluster filter
 * @returns {Promise<any[]>} Status counts
 *
 * @optimization Uses simple aggregation without joins
 *
 * @example
 * ```typescript
 * const counts = await getVmCountByStatus(sequelize);
 * // [{ status: 'running', count: 150 }, { status: 'stopped', count: 50 }]
 * ```
 */
export declare const getVmCountByStatus: (sequelize: Sequelize, clusterId?: string) => Promise<any[]>;
/**
 * @function findAndLockVm
 * @description Finds and locks a VM for update within transaction
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} vmId - VM ID
 * @param {Transaction} transaction - Active transaction
 * @returns {Promise<any>} Locked VM instance
 *
 * @example
 * ```typescript
 * const result = await sequelize.transaction(async (t) => {
 *   const vm = await findAndLockVm(sequelize, 'vm-123', t);
 *   vm.status = 'migrating';
 *   await vm.save({ transaction: t });
 *   return vm;
 * });
 * ```
 */
export declare const findAndLockVm: (sequelize: Sequelize, vmId: string, transaction: Transaction) => Promise<any>;
/**
 * @function bulkUpdateVmStatus
 * @description Bulk updates VM status with transaction
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} vmIds - Array of VM IDs
 * @param {string} newStatus - New status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of updated rows
 *
 * @example
 * ```typescript
 * const updated = await bulkUpdateVmStatus(sequelize, ['vm-1', 'vm-2'], 'maintenance');
 * ```
 */
export declare const bulkUpdateVmStatus: (sequelize: Sequelize, vmIds: string[], newStatus: string, transaction?: Transaction) => Promise<number>;
/**
 * @function findVmsWithSubquery
 * @description Finds VMs using subquery for complex filtering
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} clusterId - Cluster ID
 * @returns {Promise<any[]>} VMs in high-utilization hosts
 *
 * @example
 * ```typescript
 * const vms = await findVmsWithSubquery(sequelize, 'cluster-1');
 * // Returns VMs on hosts with >80% CPU utilization
 * ```
 */
export declare const findVmsWithSubquery: (sequelize: Sequelize, clusterId: string) => Promise<any[]>;
/**
 * @function getResourceHierarchyWithCte
 * @description Gets resource hierarchy using CTE (Common Table Expression)
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Hierarchical resource tree
 *
 * @example
 * ```typescript
 * const hierarchy = await getResourceHierarchyWithCte(sequelize);
 * // Returns: Cluster -> Hosts -> VMs hierarchy
 * ```
 */
export declare const getResourceHierarchyWithCte: (sequelize: Sequelize) => Promise<any[]>;
/**
 * @function getVmMigrationCandidates
 * @description Finds VMs that are good candidates for migration using raw SQL
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceHostId - Source host ID
 * @returns {Promise<any[]>} Migration candidates with target hosts
 *
 * @optimization Complex multi-join query optimized with raw SQL
 *
 * @example
 * ```typescript
 * const candidates = await getVmMigrationCandidates(sequelize, 'host-1');
 * ```
 */
export declare const getVmMigrationCandidates: (sequelize: Sequelize, sourceHostId: string) => Promise<any[]>;
/**
 * @function getStorageMigrationPlan
 * @description Generates storage migration plan for VMs
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceDatastoreId - Source datastore ID
 * @param {number} targetFreeSpacePercent - Minimum target free space %
 * @returns {Promise<any[]>} Migration plan
 *
 * @example
 * ```typescript
 * const plan = await getStorageMigrationPlan(sequelize, 'ds-1', 20);
 * ```
 */
export declare const getStorageMigrationPlan: (sequelize: Sequelize, sourceDatastoreId: string, targetFreeSpacePercent: number) => Promise<any[]>;
/**
 * @function getNetworkTopology
 * @description Gets complete network topology with VMs and adapters
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [clusterId] - Optional cluster filter
 * @returns {Promise<any[]>} Network topology data
 *
 * @example
 * ```typescript
 * const topology = await getNetworkTopology(sequelize, 'cluster-1');
 * ```
 */
export declare const getNetworkTopology: (sequelize: Sequelize, clusterId?: string) => Promise<any[]>;
/**
 * @function findSnapshotsWithChain
 * @description Finds VM snapshots with parent-child relationships
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} vmId - Virtual machine ID
 * @returns {Promise<any[]>} Snapshot chain
 *
 * @example
 * ```typescript
 * const chain = await findSnapshotsWithChain(sequelize, 'vm-123');
 * ```
 */
export declare const findSnapshotsWithChain: (sequelize: Sequelize, vmId: string) => Promise<any[]>;
/**
 * @function findVmsByResourcePool
 * @description Finds VMs grouped by resource pool
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} clusterId - Cluster ID
 * @returns {Promise<any[]>} VMs by resource pool
 *
 * @example
 * ```typescript
 * const pools = await findVmsByResourcePool(sequelize, 'cluster-1');
 * ```
 */
export declare const findVmsByResourcePool: (sequelize: Sequelize, clusterId: string) => Promise<any[]>;
/**
 * @function getVmPerformanceMetrics
 * @description Gets performance metrics for VMs with window functions
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @returns {Promise<any[]>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await getVmPerformanceMetrics(sequelize, new Date('2025-01-01'), new Date());
 * ```
 */
export declare const getVmPerformanceMetrics: (sequelize: Sequelize, startTime: Date, endTime: Date) => Promise<any[]>;
/**
 * @function findVmsWithAntiAffinityRules
 * @description Finds VMs with anti-affinity rule violations
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} clusterId - Cluster ID
 * @returns {Promise<any[]>} VMs violating anti-affinity rules
 *
 * @example
 * ```typescript
 * const violations = await findVmsWithAntiAffinityRules(sequelize, 'cluster-1');
 * ```
 */
export declare const findVmsWithAntiAffinityRules: (sequelize: Sequelize, clusterId: string) => Promise<any[]>;
/**
 * @function getHostMaintenanceModeImpact
 * @description Analyzes impact of putting host in maintenance mode
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} hostId - Host ID
 * @returns {Promise<any>} Impact analysis
 *
 * @example
 * ```typescript
 * const impact = await getHostMaintenanceModeImpact(sequelize, 'host-1');
 * ```
 */
export declare const getHostMaintenanceModeImpact: (sequelize: Sequelize, hostId: string) => Promise<any>;
/**
 * @function findOrphanedVirtualDisks
 * @description Finds virtual disks not attached to any VM
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [datastoreId] - Optional datastore filter
 * @returns {Promise<any[]>} Orphaned disks
 *
 * @example
 * ```typescript
 * const orphaned = await findOrphanedVirtualDisks(sequelize);
 * ```
 */
export declare const findOrphanedVirtualDisks: (sequelize: Sequelize, datastoreId?: string) => Promise<any[]>;
/**
 * @function getVmCostAllocation
 * @description Calculates VM cost allocation by department/team
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} Cost allocation
 *
 * @example
 * ```typescript
 * const costs = await getVmCostAllocation(sequelize, new Date('2025-01-01'), new Date());
 * ```
 */
export declare const getVmCostAllocation: (sequelize: Sequelize, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * @function findVmsNeedingRightSizing
 * @description Finds VMs that are over/under-provisioned
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=30] - Days of metrics to analyze
 * @returns {Promise<any[]>} Right-sizing recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await findVmsNeedingRightSizing(sequelize, 30);
 * ```
 */
export declare const findVmsNeedingRightSizing: (sequelize: Sequelize, days?: number) => Promise<any[]>;
/**
 * @function getVmLifecycleEvents
 * @description Gets VM lifecycle events (created, powered on/off, migrated, etc.)
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} vmId - Virtual machine ID
 * @param {number} [limit=100] - Event limit
 * @returns {Promise<any[]>} Lifecycle events
 *
 * @example
 * ```typescript
 * const events = await getVmLifecycleEvents(sequelize, 'vm-123', 50);
 * ```
 */
export declare const getVmLifecycleEvents: (sequelize: Sequelize, vmId: string, limit?: number) => Promise<any[]>;
/**
 * @function findVmsWithComplianceIssues
 * @description Finds VMs with compliance or policy violations
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} [policyTypes] - Policy types to check
 * @returns {Promise<any[]>} VMs with violations
 *
 * @example
 * ```typescript
 * const violations = await findVmsWithComplianceIssues(sequelize, ['backup', 'encryption']);
 * ```
 */
export declare const findVmsWithComplianceIssues: (sequelize: Sequelize, policyTypes?: string[]) => Promise<any[]>;
/**
 * @function getClusterDrsRecommendations
 * @description Gets DRS (Distributed Resource Scheduler) recommendations
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} clusterId - Cluster ID
 * @returns {Promise<any[]>} DRS recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await getClusterDrsRecommendations(sequelize, 'cluster-1');
 * ```
 */
export declare const getClusterDrsRecommendations: (sequelize: Sequelize, clusterId: string) => Promise<any[]>;
/**
 * @function findVmsByBackupStatus
 * @description Finds VMs by backup status and age
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [maxAgeHours=24] - Maximum backup age in hours
 * @returns {Promise<any[]>} VMs grouped by backup status
 *
 * @example
 * ```typescript
 * const backupStatus = await findVmsByBackupStatus(sequelize, 24);
 * ```
 */
export declare const findVmsByBackupStatus: (sequelize: Sequelize, maxAgeHours?: number) => Promise<any[]>;
/**
 * @function getVmDependencyGraph
 * @description Gets VM dependency graph based on network connections and services
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} vmId - Virtual machine ID
 * @returns {Promise<any>} Dependency graph
 *
 * @example
 * ```typescript
 * const graph = await getVmDependencyGraph(sequelize, 'vm-123');
 * ```
 */
export declare const getVmDependencyGraph: (sequelize: Sequelize, vmId: string) => Promise<any>;
/**
 * @function findVmsInMultipleDatastores
 * @description Finds VMs with disks spanning multiple datastores
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} VMs with multi-datastore disks
 *
 * @example
 * ```typescript
 * const multiDs = await findVmsInMultipleDatastores(sequelize);
 * ```
 */
export declare const findVmsInMultipleDatastores: (sequelize: Sequelize) => Promise<any[]>;
/**
 * @function getHostFailoverCapacity
 * @description Calculates cluster failover capacity (N+1, N+2)
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} clusterId - Cluster ID
 * @param {number} [failoverHosts=1] - Number of hosts that can fail
 * @returns {Promise<any>} Failover capacity analysis
 *
 * @example
 * ```typescript
 * const capacity = await getHostFailoverCapacity(sequelize, 'cluster-1', 1);
 * ```
 */
export declare const getHostFailoverCapacity: (sequelize: Sequelize, clusterId: string, failoverHosts?: number) => Promise<any>;
/**
 * @function findZombieVms
 * @description Finds zombie VMs (powered off for extended period, no recent activity)
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [inactiveDays=90] - Days of inactivity threshold
 * @returns {Promise<any[]>} Zombie VMs
 *
 * @example
 * ```typescript
 * const zombies = await findZombieVms(sequelize, 90);
 * ```
 */
export declare const findZombieVms: (sequelize: Sequelize, inactiveDays?: number) => Promise<any[]>;
/**
 * @function getVlanUtilization
 * @description Gets VLAN utilization across virtual networks
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} VLAN utilization
 *
 * @example
 * ```typescript
 * const vlans = await getVlanUtilization(sequelize);
 * ```
 */
export declare const getVlanUtilization: (sequelize: Sequelize) => Promise<any[]>;
/**
 * @function findVmsWithHighChangeRate
 * @description Finds VMs with high disk change rate (for backup optimization)
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=7] - Days to analyze
 * @returns {Promise<any[]>} VMs with change rate metrics
 *
 * @example
 * ```typescript
 * const highChange = await findVmsWithHighChangeRate(sequelize, 7);
 * ```
 */
export declare const findVmsWithHighChangeRate: (sequelize: Sequelize, days?: number) => Promise<any[]>;
declare const _default: {
    findVirtualMachineById: (sequelize: Sequelize, vmId: string, includeRelations?: boolean) => Promise<any>;
    findVirtualMachinesByFilters: (sequelize: Sequelize, filters: VmQueryFilters, pagination?: CursorPaginationOptions) => Promise<{
        rows: any[];
        cursor: string | null;
    }>;
    findHostsWithCapacity: (sequelize: Sequelize, requiredCpu: number, requiredMemory: number, clusterId?: string) => Promise<any[]>;
    findDatastoresWithSpace: (sequelize: Sequelize, requiredSpaceGb: number, types?: string[]) => Promise<any[]>;
    executeComplexFilter: (sequelize: Sequelize, modelName: string, criteria: ComplexFilterCriteria) => Promise<any[]>;
    searchVirtualResourcesFullText: (sequelize: Sequelize, searchTerm: string, resourceTypes?: string[]) => Promise<any[]>;
    findVmsByTagHierarchy: (sequelize: Sequelize, tagQuery: object) => Promise<any[]>;
    aggregateResourcesByGroup: (sequelize: Sequelize, modelName: string, options: AggregationOptions) => Promise<any[]>;
    getClusterResourceUtilization: (sequelize: Sequelize, clusterId: string) => Promise<any>;
    getDatastoreUtilizationTrend: (sequelize: Sequelize, datastoreId: string, days?: number) => Promise<any[]>;
    sortVmsByMultipleCriteria: (sequelize: Sequelize, sortCriteria: Array<{
        field: string;
        direction: "ASC" | "DESC";
        nulls?: "FIRST" | "LAST";
    }>, filters?: WhereOptions) => Promise<any[]>;
    rankHostsByPerformance: (sequelize: Sequelize, clusterId?: string) => Promise<any[]>;
    paginateWithOffsetLimit: (sequelize: Sequelize, modelName: string, page: number, pageSize: number, options?: FindOptions) => Promise<{
        rows: any[];
        count: number;
        pages: number;
    }>;
    paginateWithCursor: (sequelize: Sequelize, modelName: string, options: CursorPaginationOptions, filters?: WhereOptions) => Promise<{
        rows: any[];
        nextCursor: string | null;
        hasMore: boolean;
    }>;
    paginateWithKeyset: (sequelize: Sequelize, modelName: string, keyField: string, lastKey: any, limit: number) => Promise<any[]>;
    findVmsWithEagerLoading: (sequelize: Sequelize, filters?: WhereOptions) => Promise<any[]>;
    batchLoadVirtualMachines: (sequelize: Sequelize, vmIds: string[]) => Promise<Map<string, any>>;
    findWithQueryOptimization: (sequelize: Sequelize, modelName: string, baseOptions: FindOptions, hints: QueryOptimizationHints) => Promise<any[]>;
    getVmCountByStatus: (sequelize: Sequelize, clusterId?: string) => Promise<any[]>;
    findAndLockVm: (sequelize: Sequelize, vmId: string, transaction: Transaction) => Promise<any>;
    bulkUpdateVmStatus: (sequelize: Sequelize, vmIds: string[], newStatus: string, transaction?: Transaction) => Promise<number>;
    findVmsWithSubquery: (sequelize: Sequelize, clusterId: string) => Promise<any[]>;
    getResourceHierarchyWithCte: (sequelize: Sequelize) => Promise<any[]>;
    getVmMigrationCandidates: (sequelize: Sequelize, sourceHostId: string) => Promise<any[]>;
    getStorageMigrationPlan: (sequelize: Sequelize, sourceDatastoreId: string, targetFreeSpacePercent: number) => Promise<any[]>;
    getNetworkTopology: (sequelize: Sequelize, clusterId?: string) => Promise<any[]>;
    getVlanUtilization: (sequelize: Sequelize) => Promise<any[]>;
    findSnapshotsWithChain: (sequelize: Sequelize, vmId: string) => Promise<any[]>;
    getVmLifecycleEvents: (sequelize: Sequelize, vmId: string, limit?: number) => Promise<any[]>;
    findVmsByResourcePool: (sequelize: Sequelize, clusterId: string) => Promise<any[]>;
    getVmCostAllocation: (sequelize: Sequelize, startDate: Date, endDate: Date) => Promise<any[]>;
    getVmPerformanceMetrics: (sequelize: Sequelize, startTime: Date, endTime: Date) => Promise<any[]>;
    findVmsNeedingRightSizing: (sequelize: Sequelize, days?: number) => Promise<any[]>;
    findVmsWithHighChangeRate: (sequelize: Sequelize, days?: number) => Promise<any[]>;
    findVmsWithAntiAffinityRules: (sequelize: Sequelize, clusterId: string) => Promise<any[]>;
    findVmsWithComplianceIssues: (sequelize: Sequelize, policyTypes?: string[]) => Promise<any[]>;
    findVmsByBackupStatus: (sequelize: Sequelize, maxAgeHours?: number) => Promise<any[]>;
    getHostMaintenanceModeImpact: (sequelize: Sequelize, hostId: string) => Promise<any>;
    getClusterDrsRecommendations: (sequelize: Sequelize, clusterId: string) => Promise<any[]>;
    getHostFailoverCapacity: (sequelize: Sequelize, clusterId: string, failoverHosts?: number) => Promise<any>;
    findOrphanedVirtualDisks: (sequelize: Sequelize, datastoreId?: string) => Promise<any[]>;
    findZombieVms: (sequelize: Sequelize, inactiveDays?: number) => Promise<any[]>;
    findVmsInMultipleDatastores: (sequelize: Sequelize) => Promise<any[]>;
    getVmDependencyGraph: (sequelize: Sequelize, vmId: string) => Promise<any>;
};
export default _default;
//# sourceMappingURL=virtual-resource-queries-kit.d.ts.map