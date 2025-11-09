"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findVmsWithHighChangeRate = exports.getVlanUtilization = exports.findZombieVms = exports.getHostFailoverCapacity = exports.findVmsInMultipleDatastores = exports.getVmDependencyGraph = exports.findVmsByBackupStatus = exports.getClusterDrsRecommendations = exports.findVmsWithComplianceIssues = exports.getVmLifecycleEvents = exports.findVmsNeedingRightSizing = exports.getVmCostAllocation = exports.findOrphanedVirtualDisks = exports.getHostMaintenanceModeImpact = exports.findVmsWithAntiAffinityRules = exports.getVmPerformanceMetrics = exports.findVmsByResourcePool = exports.findSnapshotsWithChain = exports.getNetworkTopology = exports.getStorageMigrationPlan = exports.getVmMigrationCandidates = exports.getResourceHierarchyWithCte = exports.findVmsWithSubquery = exports.bulkUpdateVmStatus = exports.findAndLockVm = exports.getVmCountByStatus = exports.findWithQueryOptimization = exports.batchLoadVirtualMachines = exports.findVmsWithEagerLoading = exports.paginateWithKeyset = exports.paginateWithCursor = exports.paginateWithOffsetLimit = exports.rankHostsByPerformance = exports.sortVmsByMultipleCriteria = exports.getDatastoreUtilizationTrend = exports.getClusterResourceUtilization = exports.aggregateResourcesByGroup = exports.findVmsByTagHierarchy = exports.searchVirtualResourcesFullText = exports.executeComplexFilter = exports.findDatastoresWithSpace = exports.findHostsWithCapacity = exports.findVirtualMachinesByFilters = exports.findVirtualMachineById = void 0;
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
const sequelize_1 = require("sequelize");
// ============================================================================
// BASIC RESOURCE QUERIES
// ============================================================================
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
const findVirtualMachineById = async (sequelize, vmId, includeRelations = true) => {
    const VirtualMachine = sequelize.models.VirtualMachine;
    const options = {
        where: { id: vmId },
        attributes: {
            include: [
                [(0, sequelize_1.literal)('(SELECT COUNT(*) FROM snapshots WHERE snapshots.vm_id = VirtualMachine.id)'), 'snapshotCount'],
                [(0, sequelize_1.literal)('CASE WHEN power_state = \'running\' THEN uptime_seconds ELSE 0 END'), 'currentUptime'],
            ],
        },
    };
    if (includeRelations) {
        options.include = [
            {
                model: sequelize.models.Host,
                as: 'host',
                attributes: ['id', 'name', 'status', 'cpuCores', 'memoryGb'],
                include: [
                    {
                        model: sequelize.models.Cluster,
                        as: 'cluster',
                        attributes: ['id', 'name', 'haEnabled', 'drsEnabled'],
                    },
                ],
            },
            {
                model: sequelize.models.Datastore,
                as: 'datastore',
                attributes: ['id', 'name', 'capacityGb', 'freeSpaceGb', 'type'],
            },
            {
                model: sequelize.models.NetworkAdapter,
                as: 'networkAdapters',
                attributes: ['id', 'macAddress', 'networkName', 'connected'],
                separate: true, // Prevent N+1 with separate query
            },
            {
                model: sequelize.models.VirtualDisk,
                as: 'disks',
                attributes: ['id', 'capacityGb', 'provisionedGb', 'type', 'path'],
                separate: true,
            },
        ];
    }
    return await VirtualMachine.findOne(options);
};
exports.findVirtualMachineById = findVirtualMachineById;
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
const findVirtualMachinesByFilters = async (sequelize, filters, pagination) => {
    const VirtualMachine = sequelize.models.VirtualMachine;
    const whereClause = {};
    // Build WHERE clause from filters
    if (filters.status?.length) {
        whereClause.status = { [sequelize_1.Op.in]: filters.status };
    }
    if (filters.powerState?.length) {
        whereClause.powerState = { [sequelize_1.Op.in]: filters.powerState };
    }
    if (filters.hostId) {
        whereClause.hostId = filters.hostId;
    }
    if (filters.clusterId) {
        whereClause['$host.cluster.id$'] = filters.clusterId;
    }
    if (filters.datastoreId) {
        whereClause.datastoreId = filters.datastoreId;
    }
    if (filters.minCpu || filters.maxCpu) {
        whereClause.cpuCores = {};
        if (filters.minCpu)
            whereClause.cpuCores[sequelize_1.Op.gte] = filters.minCpu;
        if (filters.maxCpu)
            whereClause.cpuCores[sequelize_1.Op.lte] = filters.maxCpu;
    }
    if (filters.minMemory || filters.maxMemory) {
        whereClause.memoryGb = {};
        if (filters.minMemory)
            whereClause.memoryGb[sequelize_1.Op.gte] = filters.minMemory;
        if (filters.maxMemory)
            whereClause.memoryGb[sequelize_1.Op.lte] = filters.maxMemory;
    }
    if (filters.tags?.length) {
        whereClause.tags = {
            [sequelize_1.Op.contains]: filters.tags, // JSONB contains for PostgreSQL
        };
    }
    if (filters.createdAfter || filters.createdBefore) {
        whereClause.createdAt = {};
        if (filters.createdAfter)
            whereClause.createdAt[sequelize_1.Op.gte] = filters.createdAfter;
        if (filters.createdBefore)
            whereClause.createdAt[sequelize_1.Op.lte] = filters.createdBefore;
    }
    if (filters.searchTerm) {
        whereClause[sequelize_1.Op.or] = [
            { name: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
            { hostname: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
            { guestOs: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
        ];
    }
    // Cursor-based pagination
    if (pagination?.cursor) {
        const cursorData = JSON.parse(Buffer.from(pagination.cursor, 'base64').toString());
        whereClause.id = { [sequelize_1.Op.gt]: cursorData.id };
    }
    const limit = pagination?.limit || 50;
    const orderBy = pagination?.orderBy || 'createdAt';
    const orderDirection = pagination?.orderDirection || 'DESC';
    const results = await VirtualMachine.findAll({
        where: whereClause,
        include: [
            {
                model: sequelize.models.Host,
                as: 'host',
                attributes: ['id', 'name'],
                include: [
                    {
                        model: sequelize.models.Cluster,
                        as: 'cluster',
                        attributes: ['id', 'name'],
                    },
                ],
            },
            {
                model: sequelize.models.Datastore,
                as: 'datastore',
                attributes: ['id', 'name', 'freeSpaceGb'],
            },
        ],
        order: [[orderBy, orderDirection]],
        limit: limit + 1, // Get one extra to check if there are more
        subQuery: false, // Optimize joined queries
    });
    const hasMore = results.length > limit;
    const rows = hasMore ? results.slice(0, -1) : results;
    const nextCursor = hasMore
        ? Buffer.from(JSON.stringify({ id: rows[rows.length - 1].id })).toString('base64')
        : null;
    return { rows, cursor: nextCursor };
};
exports.findVirtualMachinesByFilters = findVirtualMachinesByFilters;
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
const findHostsWithCapacity = async (sequelize, requiredCpu, requiredMemory, clusterId) => {
    const Host = sequelize.models.Host;
    const whereClause = {
        status: 'active',
        maintenanceMode: false,
    };
    if (clusterId) {
        whereClause.clusterId = clusterId;
    }
    return await Host.findAll({
        where: whereClause,
        attributes: [
            'id',
            'name',
            'cpuCores',
            'cpuMhz',
            'memoryGb',
            'status',
            [
                (0, sequelize_1.literal)(`(
          SELECT COALESCE(SUM(cpu_cores), 0)
          FROM virtual_machines
          WHERE virtual_machines.host_id = Host.id
          AND virtual_machines.power_state = 'running'
        )`),
                'usedCpu',
            ],
            [
                (0, sequelize_1.literal)(`(
          SELECT COALESCE(SUM(memory_gb), 0)
          FROM virtual_machines
          WHERE virtual_machines.host_id = Host.id
          AND virtual_machines.power_state = 'running'
        )`),
                'usedMemory',
            ],
            [(0, sequelize_1.literal)('Host.cpu_cores - COALESCE((SELECT SUM(cpu_cores) FROM virtual_machines WHERE virtual_machines.host_id = Host.id AND power_state = \'running\'), 0)'), 'availableCpu'],
            [(0, sequelize_1.literal)('Host.memory_gb - COALESCE((SELECT SUM(memory_gb) FROM virtual_machines WHERE virtual_machines.host_id = Host.id AND power_state = \'running\'), 0)'), 'availableMemory'],
        ],
        having: {
            [sequelize_1.Op.and]: [
                (0, sequelize_1.literal)(`Host.cpu_cores - COALESCE((SELECT SUM(cpu_cores) FROM virtual_machines WHERE virtual_machines.host_id = Host.id AND power_state = 'running'), 0) >= ${requiredCpu}`),
                (0, sequelize_1.literal)(`Host.memory_gb - COALESCE((SELECT SUM(memory_gb) FROM virtual_machines WHERE virtual_machines.host_id = Host.id AND power_state = 'running'), 0) >= ${requiredMemory}`),
            ],
        },
        include: [
            {
                model: sequelize.models.Cluster,
                as: 'cluster',
                attributes: ['id', 'name', 'haEnabled', 'drsEnabled'],
            },
        ],
        order: [
            [(0, sequelize_1.literal)('availableCpu'), 'DESC'],
            [(0, sequelize_1.literal)('availableMemory'), 'DESC'],
        ],
    });
};
exports.findHostsWithCapacity = findHostsWithCapacity;
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
const findDatastoresWithSpace = async (sequelize, requiredSpaceGb, types) => {
    const Datastore = sequelize.models.Datastore;
    const whereClause = {
        status: 'active',
        freeSpaceGb: { [sequelize_1.Op.gte]: requiredSpaceGb },
    };
    if (types?.length) {
        whereClause.type = { [sequelize_1.Op.in]: types };
    }
    return await Datastore.findAll({
        where: whereClause,
        attributes: [
            'id',
            'name',
            'type',
            'capacityGb',
            'freeSpaceGb',
            [(0, sequelize_1.literal)('(free_space_gb / capacity_gb * 100)'), 'freeSpacePercent'],
            [
                (0, sequelize_1.literal)(`(
          SELECT COUNT(*)
          FROM virtual_machines
          WHERE virtual_machines.datastore_id = Datastore.id
        )`),
                'vmCount',
            ],
        ],
        order: [
            [(0, sequelize_1.literal)('freeSpacePercent'), 'DESC'],
            ['freeSpaceGb', 'DESC'],
        ],
    });
};
exports.findDatastoresWithSpace = findDatastoresWithSpace;
// ============================================================================
// COMPLEX FILTERING & SEARCH QUERIES
// ============================================================================
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
const executeComplexFilter = async (sequelize, modelName, criteria) => {
    const Model = sequelize.models[modelName];
    const whereClause = {};
    const operatorMap = {
        eq: sequelize_1.Op.eq,
        ne: sequelize_1.Op.ne,
        gt: sequelize_1.Op.gt,
        gte: sequelize_1.Op.gte,
        lt: sequelize_1.Op.lt,
        lte: sequelize_1.Op.lte,
        in: sequelize_1.Op.in,
        notIn: sequelize_1.Op.notIn,
        like: sequelize_1.Op.iLike,
        between: sequelize_1.Op.between,
    };
    const conditions = criteria.conditions.map((condition) => ({
        [condition.field]: {
            [operatorMap[condition.operator]]: condition.value,
        },
    }));
    if (criteria.logicalOperator === 'OR') {
        whereClause[sequelize_1.Op.or] = conditions;
    }
    else {
        whereClause[sequelize_1.Op.and] = conditions;
    }
    return await Model.findAll({ where: whereClause });
};
exports.executeComplexFilter = executeComplexFilter;
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
const searchVirtualResourcesFullText = async (sequelize, searchTerm, resourceTypes) => {
    const types = resourceTypes || ['VirtualMachine', 'Host', 'Datastore', 'Cluster'];
    const results = [];
    for (const type of types) {
        const Model = sequelize.models[type];
        if (!Model)
            continue;
        const searchResults = await Model.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    (0, sequelize_1.literal)(`to_tsvector('english', name) @@ plainto_tsquery('english', '${searchTerm}')`),
                    (0, sequelize_1.literal)(`to_tsvector('english', COALESCE(description, '')) @@ plainto_tsquery('english', '${searchTerm}')`),
                ],
            },
            attributes: {
                include: [
                    [(0, sequelize_1.literal)(`ts_rank(to_tsvector('english', name || ' ' || COALESCE(description, '')), plainto_tsquery('english', '${searchTerm}'))`), 'relevance'],
                    [(0, sequelize_1.literal)(`'${type}'`), 'resourceType'],
                ],
            },
            limit: 100,
        });
        results.push(...searchResults);
    }
    // Sort by relevance across all resource types
    return results.sort((a, b) => b.relevance - a.relevance);
};
exports.searchVirtualResourcesFullText = searchVirtualResourcesFullText;
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
const findVmsByTagHierarchy = async (sequelize, tagQuery) => {
    const VirtualMachine = sequelize.models.VirtualMachine;
    return await VirtualMachine.findAll({
        where: {
            tags: {
                [sequelize_1.Op.contains]: tagQuery, // PostgreSQL JSONB contains
            },
        },
        attributes: {
            include: [[(0, sequelize_1.literal)('tags::text'), 'tagsJson']],
        },
    });
};
exports.findVmsByTagHierarchy = findVmsByTagHierarchy;
// ============================================================================
// AGGREGATION & REPORTING QUERIES
// ============================================================================
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
const aggregateResourcesByGroup = async (sequelize, modelName, options) => {
    const Model = sequelize.models[modelName];
    const attributes = [...options.groupBy];
    options.metrics.forEach((metric) => {
        const operation = metric.operation.toLowerCase();
        attributes.push([(0, sequelize_1.fn)(operation, (0, sequelize_1.col)(metric.field)), metric.alias]);
    });
    const queryOptions = {
        attributes,
        group: options.groupBy,
        raw: true,
    };
    if (options.having) {
        queryOptions.having = options.having;
    }
    return await Model.findAll(queryOptions);
};
exports.aggregateResourcesByGroup = aggregateResourcesByGroup;
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
const getClusterResourceUtilization = async (sequelize, clusterId) => {
    const [results] = await sequelize.query(`
    SELECT
      c.id,
      c.name,
      COUNT(DISTINCT h.id) as host_count,
      SUM(h.cpu_cores) as total_cpu,
      SUM(h.memory_gb) as total_memory,
      COUNT(DISTINCT vm.id) as vm_count,
      SUM(CASE WHEN vm.power_state = 'running' THEN vm.cpu_cores ELSE 0 END) as used_cpu,
      SUM(CASE WHEN vm.power_state = 'running' THEN vm.memory_gb ELSE 0 END) as used_memory,
      ROUND((SUM(CASE WHEN vm.power_state = 'running' THEN vm.cpu_cores ELSE 0 END)::numeric / NULLIF(SUM(h.cpu_cores), 0) * 100), 2) as cpu_utilization_percent,
      ROUND((SUM(CASE WHEN vm.power_state = 'running' THEN vm.memory_gb ELSE 0 END)::numeric / NULLIF(SUM(h.memory_gb), 0) * 100), 2) as memory_utilization_percent
    FROM clusters c
    LEFT JOIN hosts h ON h.cluster_id = c.id AND h.status = 'active'
    LEFT JOIN virtual_machines vm ON vm.host_id = h.id
    WHERE c.id = :clusterId
    GROUP BY c.id, c.name
    `, {
        replacements: { clusterId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getClusterResourceUtilization = getClusterResourceUtilization;
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
const getDatastoreUtilizationTrend = async (sequelize, datastoreId, days = 30) => {
    return await sequelize.query(`
    SELECT
      DATE(recorded_at) as date,
      AVG(used_space_gb) as avg_used_space,
      MAX(used_space_gb) as max_used_space,
      MIN(free_space_gb) as min_free_space,
      AVG(capacity_gb) as capacity
    FROM datastore_metrics
    WHERE datastore_id = :datastoreId
      AND recorded_at >= NOW() - INTERVAL '${days} days'
    GROUP BY DATE(recorded_at)
    ORDER BY date DESC
    `, {
        replacements: { datastoreId },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.getDatastoreUtilizationTrend = getDatastoreUtilizationTrend;
// ============================================================================
// SORTING & ORDERING QUERIES
// ============================================================================
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
const sortVmsByMultipleCriteria = async (sequelize, sortCriteria, filters) => {
    const VirtualMachine = sequelize.models.VirtualMachine;
    const order = sortCriteria.map((criterion) => {
        if (criterion.nulls) {
            return (0, sequelize_1.literal)(`${criterion.field} ${criterion.direction} NULLS ${criterion.nulls}`);
        }
        return [criterion.field, criterion.direction];
    });
    return await VirtualMachine.findAll({
        where: filters || {},
        order,
    });
};
exports.sortVmsByMultipleCriteria = sortVmsByMultipleCriteria;
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
const rankHostsByPerformance = async (sequelize, clusterId) => {
    let whereClause = '';
    if (clusterId) {
        whereClause = `WHERE h.cluster_id = '${clusterId}'`;
    }
    return await sequelize.query(`
    SELECT
      h.id,
      h.name,
      h.cpu_cores,
      h.memory_gb,
      COALESCE(vm_stats.vm_count, 0) as vm_count,
      COALESCE(vm_stats.total_cpu_allocated, 0) as total_cpu_allocated,
      COALESCE(vm_stats.total_memory_allocated, 0) as total_memory_allocated,
      ROUND((COALESCE(vm_stats.total_cpu_allocated, 0)::numeric / h.cpu_cores * 100), 2) as cpu_allocation_percent,
      ROUND((COALESCE(vm_stats.total_memory_allocated, 0)::numeric / h.memory_gb * 100), 2) as memory_allocation_percent,
      ROW_NUMBER() OVER (ORDER BY COALESCE(vm_stats.total_cpu_allocated, 0)::numeric / h.cpu_cores) as cpu_utilization_rank,
      ROW_NUMBER() OVER (ORDER BY COALESCE(vm_stats.total_memory_allocated, 0)::numeric / h.memory_gb) as memory_utilization_rank,
      PERCENT_RANK() OVER (ORDER BY h.cpu_cores * h.cpu_mhz) as performance_percentile
    FROM hosts h
    LEFT JOIN (
      SELECT
        host_id,
        COUNT(*) as vm_count,
        SUM(cpu_cores) as total_cpu_allocated,
        SUM(memory_gb) as total_memory_allocated
      FROM virtual_machines
      WHERE power_state = 'running'
      GROUP BY host_id
    ) vm_stats ON h.id = vm_stats.host_id
    ${whereClause}
    ORDER BY performance_percentile DESC, cpu_allocation_percent ASC
    `, { type: sequelize_1.QueryTypes.SELECT });
};
exports.rankHostsByPerformance = rankHostsByPerformance;
// ============================================================================
// PAGINATION QUERIES
// ============================================================================
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
const paginateWithOffsetLimit = async (sequelize, modelName, page, pageSize, options) => {
    const Model = sequelize.models[modelName];
    const { count, rows } = await Model.findAndCountAll({
        ...options,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        distinct: true, // Accurate count with joins
    });
    return {
        rows,
        count,
        pages: Math.ceil(count / pageSize),
    };
};
exports.paginateWithOffsetLimit = paginateWithOffsetLimit;
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
const paginateWithCursor = async (sequelize, modelName, options, filters) => {
    const Model = sequelize.models[modelName];
    const limit = options.limit || 50;
    const orderBy = options.orderBy || 'id';
    const orderDirection = options.orderDirection || 'DESC';
    const whereClause = { ...filters };
    if (options.cursor) {
        const cursorData = JSON.parse(Buffer.from(options.cursor, 'base64').toString());
        const operator = orderDirection === 'DESC' ? sequelize_1.Op.lt : sequelize_1.Op.gt;
        whereClause[orderBy] = { [operator]: cursorData[orderBy] };
    }
    const rows = await Model.findAll({
        where: whereClause,
        order: [[orderBy, orderDirection]],
        limit: limit + 1,
    });
    const hasMore = rows.length > limit;
    const results = hasMore ? rows.slice(0, -1) : rows;
    const nextCursor = hasMore
        ? Buffer.from(JSON.stringify({ [orderBy]: results[results.length - 1][orderBy] })).toString('base64')
        : null;
    return { rows: results, nextCursor, hasMore };
};
exports.paginateWithCursor = paginateWithCursor;
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
const paginateWithKeyset = async (sequelize, modelName, keyField, lastKey, limit) => {
    const Model = sequelize.models[modelName];
    const whereClause = {};
    if (lastKey !== null && lastKey !== undefined) {
        whereClause[keyField] = { [sequelize_1.Op.gt]: lastKey };
    }
    return await Model.findAll({
        where: whereClause,
        order: [[keyField, 'ASC']],
        limit,
    });
};
exports.paginateWithKeyset = paginateWithKeyset;
// ============================================================================
// N+1 QUERY PREVENTION
// ============================================================================
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
const findVmsWithEagerLoading = async (sequelize, filters) => {
    const VirtualMachine = sequelize.models.VirtualMachine;
    return await VirtualMachine.findAll({
        where: filters || {},
        include: [
            {
                model: sequelize.models.Host,
                as: 'host',
                include: [
                    {
                        model: sequelize.models.Cluster,
                        as: 'cluster',
                    },
                ],
            },
            {
                model: sequelize.models.Datastore,
                as: 'datastore',
            },
            {
                // Separate query for has-many to prevent cartesian product
                model: sequelize.models.VirtualDisk,
                as: 'disks',
                separate: true,
            },
            {
                model: sequelize.models.NetworkAdapter,
                as: 'networkAdapters',
                separate: true,
            },
            {
                model: sequelize.models.Snapshot,
                as: 'snapshots',
                separate: true,
                limit: 10,
                order: [['createdAt', 'DESC']],
            },
        ],
    });
};
exports.findVmsWithEagerLoading = findVmsWithEagerLoading;
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
const batchLoadVirtualMachines = async (sequelize, vmIds) => {
    const VirtualMachine = sequelize.models.VirtualMachine;
    const vms = await VirtualMachine.findAll({
        where: {
            id: { [sequelize_1.Op.in]: vmIds },
        },
        include: [
            {
                model: sequelize.models.Host,
                as: 'host',
            },
            {
                model: sequelize.models.Datastore,
                as: 'datastore',
            },
        ],
    });
    const vmMap = new Map();
    vms.forEach((vm) => vmMap.set(vm.id, vm));
    return vmMap;
};
exports.batchLoadVirtualMachines = batchLoadVirtualMachines;
// ============================================================================
// PERFORMANCE OPTIMIZATION QUERIES
// ============================================================================
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
const findWithQueryOptimization = async (sequelize, modelName, baseOptions, hints) => {
    const Model = sequelize.models[modelName];
    const options = {
        ...baseOptions,
        subQuery: hints.subQuery ?? false,
        raw: hints.raw ?? false,
        nest: hints.nest ?? !hints.raw,
        benchmark: hints.benchmark ?? false,
    };
    return await Model.findAll(options);
};
exports.findWithQueryOptimization = findWithQueryOptimization;
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
const getVmCountByStatus = async (sequelize, clusterId) => {
    const VirtualMachine = sequelize.models.VirtualMachine;
    const whereClause = {};
    if (clusterId) {
        whereClause['$host.clusterId$'] = clusterId;
    }
    return await VirtualMachine.findAll({
        attributes: ['status', [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']],
        where: whereClause,
        include: clusterId
            ? [
                {
                    model: sequelize.models.Host,
                    as: 'host',
                    attributes: [],
                },
            ]
            : [],
        group: ['status'],
        raw: true,
    });
};
exports.getVmCountByStatus = getVmCountByStatus;
// ============================================================================
// TRANSACTION-BASED QUERIES
// ============================================================================
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
const findAndLockVm = async (sequelize, vmId, transaction) => {
    const VirtualMachine = sequelize.models.VirtualMachine;
    return await VirtualMachine.findOne({
        where: { id: vmId },
        lock: transaction.LOCK.UPDATE,
        transaction,
    });
};
exports.findAndLockVm = findAndLockVm;
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
const bulkUpdateVmStatus = async (sequelize, vmIds, newStatus, transaction) => {
    const VirtualMachine = sequelize.models.VirtualMachine;
    const [affectedCount] = await VirtualMachine.update({ status: newStatus, updatedAt: new Date() }, {
        where: {
            id: { [sequelize_1.Op.in]: vmIds },
        },
        transaction,
    });
    return affectedCount;
};
exports.bulkUpdateVmStatus = bulkUpdateVmStatus;
// ============================================================================
// SUBQUERY & CTE QUERIES
// ============================================================================
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
const findVmsWithSubquery = async (sequelize, clusterId) => {
    const VirtualMachine = sequelize.models.VirtualMachine;
    return await VirtualMachine.findAll({
        where: {
            hostId: {
                [sequelize_1.Op.in]: (0, sequelize_1.literal)(`(
          SELECT h.id
          FROM hosts h
          WHERE h.cluster_id = '${clusterId}'
          AND (
            SELECT COALESCE(SUM(cpu_cores), 0)
            FROM virtual_machines
            WHERE host_id = h.id AND power_state = 'running'
          ) / h.cpu_cores > 0.8
        )`),
            },
        },
    });
};
exports.findVmsWithSubquery = findVmsWithSubquery;
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
const getResourceHierarchyWithCte = async (sequelize) => {
    return await sequelize.query(`
    WITH RECURSIVE resource_tree AS (
      -- Base case: Clusters
      SELECT
        id,
        name,
        'cluster' as resource_type,
        NULL::uuid as parent_id,
        0 as level,
        name as path
      FROM clusters

      UNION ALL

      -- Recursive case: Hosts
      SELECT
        h.id,
        h.name,
        'host' as resource_type,
        h.cluster_id as parent_id,
        1 as level,
        rt.path || ' > ' || h.name
      FROM hosts h
      INNER JOIN resource_tree rt ON rt.id = h.cluster_id

      UNION ALL

      -- Recursive case: VMs
      SELECT
        vm.id,
        vm.name,
        'vm' as resource_type,
        vm.host_id as parent_id,
        2 as level,
        rt.path || ' > ' || vm.name
      FROM virtual_machines vm
      INNER JOIN resource_tree rt ON rt.id = vm.host_id
    )
    SELECT * FROM resource_tree
    ORDER BY path
    `, { type: sequelize_1.QueryTypes.SELECT });
};
exports.getResourceHierarchyWithCte = getResourceHierarchyWithCte;
// ============================================================================
// RAW SQL COMPLEX QUERIES
// ============================================================================
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
const getVmMigrationCandidates = async (sequelize, sourceHostId) => {
    return await sequelize.query(`
    WITH source_host AS (
      SELECT id, cluster_id, cpu_cores, memory_gb
      FROM hosts
      WHERE id = :sourceHostId
    ),
    target_hosts AS (
      SELECT
        h.id,
        h.name,
        h.cpu_cores,
        h.memory_gb,
        h.cpu_cores - COALESCE(SUM(vm.cpu_cores), 0) as available_cpu,
        h.memory_gb - COALESCE(SUM(vm.memory_gb), 0) as available_memory
      FROM hosts h
      CROSS JOIN source_host sh
      LEFT JOIN virtual_machines vm ON vm.host_id = h.id AND vm.power_state = 'running'
      WHERE h.cluster_id = sh.cluster_id
        AND h.id != :sourceHostId
        AND h.status = 'active'
        AND h.maintenance_mode = false
      GROUP BY h.id, h.name, h.cpu_cores, h.memory_gb
      HAVING h.cpu_cores - COALESCE(SUM(vm.cpu_cores), 0) > 0
        AND h.memory_gb - COALESCE(SUM(vm.memory_gb), 0) > 0
    )
    SELECT
      vm.id as vm_id,
      vm.name as vm_name,
      vm.cpu_cores,
      vm.memory_gb,
      th.id as target_host_id,
      th.name as target_host_name,
      th.available_cpu,
      th.available_memory,
      ROUND((vm.cpu_cores::numeric / th.available_cpu * 100), 2) as cpu_fit_percent,
      ROUND((vm.memory_gb::numeric / th.available_memory * 100), 2) as memory_fit_percent
    FROM virtual_machines vm
    CROSS JOIN target_hosts th
    WHERE vm.host_id = :sourceHostId
      AND vm.power_state = 'running'
      AND vm.cpu_cores <= th.available_cpu
      AND vm.memory_gb <= th.available_memory
    ORDER BY vm.cpu_cores DESC, vm.memory_gb DESC
    `, {
        replacements: { sourceHostId },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.getVmMigrationCandidates = getVmMigrationCandidates;
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
const getStorageMigrationPlan = async (sequelize, sourceDatastoreId, targetFreeSpacePercent) => {
    return await sequelize.query(`
    WITH vm_storage AS (
      SELECT
        vm.id as vm_id,
        vm.name as vm_name,
        vm.datastore_id,
        SUM(vd.capacity_gb) as total_storage_gb
      FROM virtual_machines vm
      INNER JOIN virtual_disks vd ON vd.vm_id = vm.id
      WHERE vm.datastore_id = :sourceDatastoreId
      GROUP BY vm.id, vm.name, vm.datastore_id
    ),
    target_datastores AS (
      SELECT
        ds.id,
        ds.name,
        ds.capacity_gb,
        ds.free_space_gb,
        (ds.free_space_gb / ds.capacity_gb * 100) as free_percent
      FROM datastores ds
      WHERE ds.id != :sourceDatastoreId
        AND ds.status = 'active'
        AND (ds.free_space_gb / ds.capacity_gb * 100) >= :targetFreeSpacePercent
    )
    SELECT
      vs.vm_id,
      vs.vm_name,
      vs.total_storage_gb,
      td.id as target_datastore_id,
      td.name as target_datastore_name,
      td.free_space_gb,
      td.free_percent,
      ROUND((vs.total_storage_gb::numeric / td.free_space_gb * 100), 2) as storage_impact_percent
    FROM vm_storage vs
    CROSS JOIN target_datastores td
    WHERE vs.total_storage_gb <= td.free_space_gb
    ORDER BY vs.total_storage_gb DESC, td.free_percent DESC
    `, {
        replacements: { sourceDatastoreId, targetFreeSpacePercent },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.getStorageMigrationPlan = getStorageMigrationPlan;
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
const getNetworkTopology = async (sequelize, clusterId) => {
    let whereClause = '';
    if (clusterId) {
        whereClause = `WHERE c.id = '${clusterId}'`;
    }
    return await sequelize.query(`
    SELECT
      n.id as network_id,
      n.name as network_name,
      n.vlan_id,
      COUNT(DISTINCT na.id) as adapter_count,
      COUNT(DISTINCT vm.id) as vm_count,
      json_agg(DISTINCT jsonb_build_object(
        'vmId', vm.id,
        'vmName', vm.name,
        'macAddress', na.mac_address,
        'connected', na.connected
      )) as connected_vms
    FROM networks n
    LEFT JOIN network_adapters na ON na.network_id = n.id
    LEFT JOIN virtual_machines vm ON vm.id = na.vm_id
    LEFT JOIN hosts h ON h.id = vm.host_id
    LEFT JOIN clusters c ON c.id = h.cluster_id
    ${whereClause}
    GROUP BY n.id, n.name, n.vlan_id
    ORDER BY n.name
    `, { type: sequelize_1.QueryTypes.SELECT });
};
exports.getNetworkTopology = getNetworkTopology;
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
const findSnapshotsWithChain = async (sequelize, vmId) => {
    return await sequelize.query(`
    WITH RECURSIVE snapshot_chain AS (
      SELECT
        s.id,
        s.name,
        s.description,
        s.parent_snapshot_id,
        s.created_at,
        s.size_gb,
        0 as depth,
        s.name as path
      FROM snapshots s
      WHERE s.vm_id = :vmId AND s.parent_snapshot_id IS NULL

      UNION ALL

      SELECT
        s.id,
        s.name,
        s.description,
        s.parent_snapshot_id,
        s.created_at,
        s.size_gb,
        sc.depth + 1,
        sc.path || ' -> ' || s.name
      FROM snapshots s
      INNER JOIN snapshot_chain sc ON s.parent_snapshot_id = sc.id
      WHERE s.vm_id = :vmId
    )
    SELECT * FROM snapshot_chain
    ORDER BY depth, created_at
    `, {
        replacements: { vmId },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.findSnapshotsWithChain = findSnapshotsWithChain;
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
const findVmsByResourcePool = async (sequelize, clusterId) => {
    return await sequelize.query(`
    SELECT
      rp.id as pool_id,
      rp.name as pool_name,
      rp.cpu_limit,
      rp.memory_limit,
      COUNT(vm.id) as vm_count,
      SUM(CASE WHEN vm.power_state = 'running' THEN vm.cpu_cores ELSE 0 END) as active_cpu,
      SUM(CASE WHEN vm.power_state = 'running' THEN vm.memory_gb ELSE 0 END) as active_memory,
      json_agg(jsonb_build_object(
        'id', vm.id,
        'name', vm.name,
        'powerState', vm.power_state,
        'cpuCores', vm.cpu_cores,
        'memoryGb', vm.memory_gb
      )) as vms
    FROM resource_pools rp
    LEFT JOIN virtual_machines vm ON vm.resource_pool_id = rp.id
    WHERE rp.cluster_id = :clusterId
    GROUP BY rp.id, rp.name, rp.cpu_limit, rp.memory_limit
    ORDER BY rp.name
    `, {
        replacements: { clusterId },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.findVmsByResourcePool = findVmsByResourcePool;
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
const getVmPerformanceMetrics = async (sequelize, startTime, endTime) => {
    return await sequelize.query(`
    SELECT
      vm.id,
      vm.name,
      AVG(m.cpu_usage_percent) as avg_cpu,
      MAX(m.cpu_usage_percent) as peak_cpu,
      AVG(m.memory_usage_percent) as avg_memory,
      MAX(m.memory_usage_percent) as peak_memory,
      AVG(m.disk_read_mbps + m.disk_write_mbps) as avg_disk_io,
      AVG(m.network_rx_mbps + m.network_tx_mbps) as avg_network_io,
      PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY m.cpu_usage_percent) as cpu_p95,
      PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY m.memory_usage_percent) as memory_p95
    FROM virtual_machines vm
    INNER JOIN vm_performance_metrics m ON m.vm_id = vm.id
    WHERE m.recorded_at BETWEEN :startTime AND :endTime
    GROUP BY vm.id, vm.name
    ORDER BY avg_cpu DESC
    `, {
        replacements: { startTime, endTime },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.getVmPerformanceMetrics = getVmPerformanceMetrics;
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
const findVmsWithAntiAffinityRules = async (sequelize, clusterId) => {
    return await sequelize.query(`
    SELECT
      ar.id as rule_id,
      ar.name as rule_name,
      h.id as host_id,
      h.name as host_name,
      COUNT(vm.id) as vm_count,
      json_agg(jsonb_build_object('id', vm.id, 'name', vm.name)) as vms
    FROM affinity_rules ar
    INNER JOIN vm_affinity_memberships vam ON vam.rule_id = ar.id
    INNER JOIN virtual_machines vm ON vm.id = vam.vm_id
    INNER JOIN hosts h ON h.id = vm.host_id
    WHERE ar.cluster_id = :clusterId
      AND ar.type = 'anti-affinity'
      AND ar.enabled = true
    GROUP BY ar.id, ar.name, h.id, h.name
    HAVING COUNT(vm.id) > 1
    `, {
        replacements: { clusterId },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.findVmsWithAntiAffinityRules = findVmsWithAntiAffinityRules;
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
const getHostMaintenanceModeImpact = async (sequelize, hostId) => {
    const [result] = await sequelize.query(`
    SELECT
      h.id,
      h.name,
      h.cluster_id,
      COUNT(vm.id) as total_vms,
      SUM(CASE WHEN vm.power_state = 'running' THEN 1 ELSE 0 END) as running_vms,
      SUM(CASE WHEN vm.power_state = 'running' THEN vm.cpu_cores ELSE 0 END) as total_cpu_to_migrate,
      SUM(CASE WHEN vm.power_state = 'running' THEN vm.memory_gb ELSE 0 END) as total_memory_to_migrate,
      (
        SELECT COUNT(*)
        FROM hosts target_h
        WHERE target_h.cluster_id = h.cluster_id
          AND target_h.id != h.id
          AND target_h.status = 'active'
          AND target_h.maintenance_mode = false
      ) as available_target_hosts
    FROM hosts h
    LEFT JOIN virtual_machines vm ON vm.host_id = h.id
    WHERE h.id = :hostId
    GROUP BY h.id, h.name, h.cluster_id
    `, {
        replacements: { hostId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return result;
};
exports.getHostMaintenanceModeImpact = getHostMaintenanceModeImpact;
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
const findOrphanedVirtualDisks = async (sequelize, datastoreId) => {
    const VirtualDisk = sequelize.models.VirtualDisk;
    const whereClause = {
        vmId: null,
    };
    if (datastoreId) {
        whereClause.datastoreId = datastoreId;
    }
    return await VirtualDisk.findAll({
        where: whereClause,
        attributes: ['id', 'path', 'capacityGb', 'datastoreId', 'createdAt'],
        include: [
            {
                model: sequelize.models.Datastore,
                as: 'datastore',
                attributes: ['id', 'name'],
            },
        ],
        order: [['createdAt', 'DESC']],
    });
};
exports.findOrphanedVirtualDisks = findOrphanedVirtualDisks;
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
const getVmCostAllocation = async (sequelize, startDate, endDate) => {
    return await sequelize.query(`
    SELECT
      vm.tags->>'department' as department,
      vm.tags->>'team' as team,
      COUNT(vm.id) as vm_count,
      SUM(vm.cpu_cores) as total_cpu,
      SUM(vm.memory_gb) as total_memory_gb,
      SUM(vd.capacity_gb) as total_storage_gb,
      SUM(vm.cpu_cores * :cpuCostPerCore + vm.memory_gb * :memoryCostPerGb + vd.capacity_gb * :storageCostPerGb) as estimated_monthly_cost
    FROM virtual_machines vm
    LEFT JOIN virtual_disks vd ON vd.vm_id = vm.id
    WHERE vm.created_at BETWEEN :startDate AND :endDate
      AND vm.tags ? 'department'
    GROUP BY vm.tags->>'department', vm.tags->>'team'
    ORDER BY estimated_monthly_cost DESC
    `, {
        replacements: {
            startDate,
            endDate,
            cpuCostPerCore: 50, // Example cost
            memoryCostPerGb: 10,
            storageCostPerGb: 0.5,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.getVmCostAllocation = getVmCostAllocation;
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
const findVmsNeedingRightSizing = async (sequelize, days = 30) => {
    return await sequelize.query(`
    SELECT
      vm.id,
      vm.name,
      vm.cpu_cores as allocated_cpu,
      vm.memory_gb as allocated_memory,
      ROUND(AVG(m.cpu_usage_percent), 2) as avg_cpu_usage,
      ROUND(AVG(m.memory_usage_percent), 2) as avg_memory_usage,
      ROUND(MAX(m.cpu_usage_percent), 2) as peak_cpu_usage,
      ROUND(MAX(m.memory_usage_percent), 2) as peak_memory_usage,
      CASE
        WHEN AVG(m.cpu_usage_percent) < 20 AND MAX(m.cpu_usage_percent) < 40 THEN 'cpu_overprovisioned'
        WHEN AVG(m.cpu_usage_percent) > 80 OR MAX(m.cpu_usage_percent) > 95 THEN 'cpu_underprovisioned'
        ELSE 'cpu_optimal'
      END as cpu_recommendation,
      CASE
        WHEN AVG(m.memory_usage_percent) < 20 AND MAX(m.memory_usage_percent) < 40 THEN 'memory_overprovisioned'
        WHEN AVG(m.memory_usage_percent) > 80 OR MAX(m.memory_usage_percent) > 95 THEN 'memory_underprovisioned'
        ELSE 'memory_optimal'
      END as memory_recommendation
    FROM virtual_machines vm
    INNER JOIN vm_performance_metrics m ON m.vm_id = vm.id
    WHERE m.recorded_at >= NOW() - INTERVAL '${days} days'
      AND vm.power_state = 'running'
    GROUP BY vm.id, vm.name, vm.cpu_cores, vm.memory_gb
    HAVING AVG(m.cpu_usage_percent) < 20 OR AVG(m.cpu_usage_percent) > 80
        OR AVG(m.memory_usage_percent) < 20 OR AVG(m.memory_usage_percent) > 80
    ORDER BY avg_cpu_usage DESC
    `, { type: sequelize_1.QueryTypes.SELECT });
};
exports.findVmsNeedingRightSizing = findVmsNeedingRightSizing;
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
const getVmLifecycleEvents = async (sequelize, vmId, limit = 100) => {
    const Event = sequelize.models.VirtualMachineEvent;
    return await Event.findAll({
        where: { vmId },
        attributes: [
            'id',
            'eventType',
            'description',
            'metadata',
            'userId',
            'createdAt',
            [
                (0, sequelize_1.literal)(`LAG(event_type) OVER (PARTITION BY vm_id ORDER BY created_at)`),
                'previousEvent',
            ],
            [
                (0, sequelize_1.literal)(`LEAD(event_type) OVER (PARTITION BY vm_id ORDER BY created_at)`),
                'nextEvent',
            ],
        ],
        order: [['createdAt', 'DESC']],
        limit,
    });
};
exports.getVmLifecycleEvents = getVmLifecycleEvents;
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
const findVmsWithComplianceIssues = async (sequelize, policyTypes) => {
    let policyFilter = '';
    if (policyTypes?.length) {
        policyFilter = `AND p.policy_type IN (${policyTypes.map((t) => `'${t}'`).join(',')})`;
    }
    return await sequelize.query(`
    SELECT
      vm.id,
      vm.name,
      p.policy_type,
      p.policy_name,
      p.severity,
      pv.violation_details,
      pv.detected_at
    FROM virtual_machines vm
    INNER JOIN policy_violations pv ON pv.resource_id = vm.id
    INNER JOIN policies p ON p.id = pv.policy_id
    WHERE pv.resource_type = 'VirtualMachine'
      AND pv.resolved_at IS NULL
      ${policyFilter}
    ORDER BY p.severity DESC, pv.detected_at DESC
    `, { type: sequelize_1.QueryTypes.SELECT });
};
exports.findVmsWithComplianceIssues = findVmsWithComplianceIssues;
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
const getClusterDrsRecommendations = async (sequelize, clusterId) => {
    return await sequelize.query(`
    WITH host_loads AS (
      SELECT
        h.id as host_id,
        h.name as host_name,
        h.cpu_cores,
        h.memory_gb,
        COALESCE(SUM(CASE WHEN vm.power_state = 'running' THEN vm.cpu_cores ELSE 0 END), 0) as used_cpu,
        COALESCE(SUM(CASE WHEN vm.power_state = 'running' THEN vm.memory_gb ELSE 0 END), 0) as used_memory,
        ROUND((COALESCE(SUM(CASE WHEN vm.power_state = 'running' THEN vm.cpu_cores ELSE 0 END), 0)::numeric / h.cpu_cores * 100), 2) as cpu_load_percent,
        ROUND((COALESCE(SUM(CASE WHEN vm.power_state = 'running' THEN vm.memory_gb ELSE 0 END), 0)::numeric / h.memory_gb * 100), 2) as memory_load_percent
      FROM hosts h
      LEFT JOIN virtual_machines vm ON vm.host_id = h.id
      WHERE h.cluster_id = :clusterId
        AND h.status = 'active'
        AND h.maintenance_mode = false
      GROUP BY h.id, h.name, h.cpu_cores, h.memory_gb
    ),
    cluster_avg AS (
      SELECT
        AVG(cpu_load_percent) as avg_cpu_load,
        AVG(memory_load_percent) as avg_memory_load
      FROM host_loads
    )
    SELECT
      hl.host_id,
      hl.host_name,
      hl.cpu_load_percent,
      hl.memory_load_percent,
      ca.avg_cpu_load,
      ca.avg_memory_load,
      hl.cpu_load_percent - ca.avg_cpu_load as cpu_variance,
      hl.memory_load_percent - ca.avg_memory_load as memory_variance,
      CASE
        WHEN hl.cpu_load_percent > ca.avg_cpu_load + 20 OR hl.memory_load_percent > ca.avg_memory_load + 20
          THEN 'migrate_vms_off'
        WHEN hl.cpu_load_percent < ca.avg_cpu_load - 20 OR hl.memory_load_percent < ca.avg_memory_load - 20
          THEN 'migrate_vms_to'
        ELSE 'balanced'
      END as recommendation
    FROM host_loads hl
    CROSS JOIN cluster_avg ca
    ORDER BY ABS(hl.cpu_load_percent - ca.avg_cpu_load) DESC
    `, {
        replacements: { clusterId },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.getClusterDrsRecommendations = getClusterDrsRecommendations;
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
const findVmsByBackupStatus = async (sequelize, maxAgeHours = 24) => {
    return await sequelize.query(`
    SELECT
      vm.id,
      vm.name,
      vm.tags->>'criticality' as criticality,
      MAX(b.completed_at) as last_backup_at,
      EXTRACT(EPOCH FROM (NOW() - MAX(b.completed_at))) / 3600 as hours_since_backup,
      COUNT(b.id) as total_backups,
      CASE
        WHEN MAX(b.completed_at) IS NULL THEN 'never_backed_up'
        WHEN EXTRACT(EPOCH FROM (NOW() - MAX(b.completed_at))) / 3600 > :maxAgeHours THEN 'backup_overdue'
        ELSE 'backup_current'
      END as backup_status
    FROM virtual_machines vm
    LEFT JOIN vm_backups b ON b.vm_id = vm.id AND b.status = 'success'
    WHERE vm.power_state = 'running'
    GROUP BY vm.id, vm.name, vm.tags
    ORDER BY hours_since_backup DESC NULLS FIRST
    `, {
        replacements: { maxAgeHours },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.findVmsByBackupStatus = findVmsByBackupStatus;
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
const getVmDependencyGraph = async (sequelize, vmId) => {
    return await sequelize.query(`
    WITH RECURSIVE vm_dependencies AS (
      SELECT
        vm.id,
        vm.name,
        vd.depends_on_vm_id,
        vd.dependency_type,
        0 as depth,
        ARRAY[vm.id] as path
      FROM virtual_machines vm
      LEFT JOIN vm_dependencies vd ON vd.vm_id = vm.id
      WHERE vm.id = :vmId

      UNION ALL

      SELECT
        vm.id,
        vm.name,
        vd.depends_on_vm_id,
        vd.dependency_type,
        vdep.depth + 1,
        vdep.path || vm.id
      FROM virtual_machines vm
      INNER JOIN vm_dependencies vd ON vd.vm_id = vm.id
      INNER JOIN vm_dependencies vdep ON vdep.depends_on_vm_id = vm.id
      WHERE vm.id != ALL(vdep.path)
        AND vdep.depth < 5
    )
    SELECT * FROM vm_dependencies
    ORDER BY depth, name
    `, {
        replacements: { vmId },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.getVmDependencyGraph = getVmDependencyGraph;
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
const findVmsInMultipleDatastores = async (sequelize) => {
    return await sequelize.query(`
    SELECT
      vm.id,
      vm.name,
      COUNT(DISTINCT vd.datastore_id) as datastore_count,
      json_agg(DISTINCT jsonb_build_object(
        'datastoreId', ds.id,
        'datastoreName', ds.name,
        'diskCount', (SELECT COUNT(*) FROM virtual_disks WHERE vm_id = vm.id AND datastore_id = ds.id)
      )) as datastores
    FROM virtual_machines vm
    INNER JOIN virtual_disks vd ON vd.vm_id = vm.id
    INNER JOIN datastores ds ON ds.id = vd.datastore_id
    GROUP BY vm.id, vm.name
    HAVING COUNT(DISTINCT vd.datastore_id) > 1
    ORDER BY datastore_count DESC
    `, { type: sequelize_1.QueryTypes.SELECT });
};
exports.findVmsInMultipleDatastores = findVmsInMultipleDatastores;
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
const getHostFailoverCapacity = async (sequelize, clusterId, failoverHosts = 1) => {
    const [result] = await sequelize.query(`
    WITH cluster_resources AS (
      SELECT
        c.id,
        c.name,
        COUNT(h.id) as total_hosts,
        SUM(h.cpu_cores) as total_cpu,
        SUM(h.memory_gb) as total_memory,
        SUM(h.cpu_cores) / COUNT(h.id) as avg_host_cpu,
        SUM(h.memory_gb) / COUNT(h.id) as avg_host_memory
      FROM clusters c
      INNER JOIN hosts h ON h.cluster_id = c.id
      WHERE c.id = :clusterId
        AND h.status = 'active'
      GROUP BY c.id, c.name
    ),
    vm_resources AS (
      SELECT
        SUM(vm.cpu_cores) as total_vm_cpu,
        SUM(vm.memory_gb) as total_vm_memory
      FROM virtual_machines vm
      INNER JOIN hosts h ON h.id = vm.host_id
      WHERE h.cluster_id = :clusterId
        AND vm.power_state = 'running'
    )
    SELECT
      cr.id,
      cr.name,
      cr.total_hosts,
      cr.total_cpu,
      cr.total_memory,
      vr.total_vm_cpu,
      vr.total_vm_memory,
      cr.total_cpu - (:failoverHosts * cr.avg_host_cpu) as failover_cpu_capacity,
      cr.total_memory - (:failoverHosts * cr.avg_host_memory) as failover_memory_capacity,
      ROUND((vr.total_vm_cpu::numeric / (cr.total_cpu - (:failoverHosts * cr.avg_host_cpu)) * 100), 2) as cpu_usage_with_failover,
      ROUND((vr.total_vm_memory::numeric / (cr.total_memory - (:failoverHosts * cr.avg_host_memory)) * 100), 2) as memory_usage_with_failover,
      CASE
        WHEN vr.total_vm_cpu <= (cr.total_cpu - (:failoverHosts * cr.avg_host_cpu))
         AND vr.total_vm_memory <= (cr.total_memory - (:failoverHosts * cr.avg_host_memory))
          THEN 'sufficient'
        ELSE 'insufficient'
      END as failover_status
    FROM cluster_resources cr
    CROSS JOIN vm_resources vr
    `, {
        replacements: { clusterId, failoverHosts },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return result;
};
exports.getHostFailoverCapacity = getHostFailoverCapacity;
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
const findZombieVms = async (sequelize, inactiveDays = 90) => {
    return await sequelize.query(`
    SELECT
      vm.id,
      vm.name,
      vm.power_state,
      vm.cpu_cores,
      vm.memory_gb,
      SUM(vd.capacity_gb) as total_storage_gb,
      vm.last_powered_on_at,
      vm.last_powered_off_at,
      EXTRACT(EPOCH FROM (NOW() - vm.last_powered_off_at)) / 86400 as days_powered_off,
      (
        SELECT MAX(created_at)
        FROM vm_events
        WHERE vm_id = vm.id
      ) as last_activity_at,
      vm.tags->>'owner' as owner,
      vm.tags->>'project' as project
    FROM virtual_machines vm
    LEFT JOIN virtual_disks vd ON vd.vm_id = vm.id
    WHERE vm.power_state IN ('stopped', 'suspended')
      AND vm.last_powered_off_at < NOW() - INTERVAL '${inactiveDays} days'
      AND NOT EXISTS (
        SELECT 1 FROM vm_events
        WHERE vm_id = vm.id
        AND created_at > NOW() - INTERVAL '${inactiveDays} days'
      )
    GROUP BY vm.id, vm.name, vm.power_state, vm.cpu_cores, vm.memory_gb,
             vm.last_powered_on_at, vm.last_powered_off_at, vm.tags
    ORDER BY days_powered_off DESC
    `, { type: sequelize_1.QueryTypes.SELECT });
};
exports.findZombieVms = findZombieVms;
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
const getVlanUtilization = async (sequelize) => {
    return await sequelize.query(`
    SELECT
      n.vlan_id,
      COUNT(DISTINCT n.id) as network_count,
      COUNT(DISTINCT na.id) as adapter_count,
      COUNT(DISTINCT vm.id) as vm_count,
      json_agg(DISTINCT n.name) as network_names,
      SUM(CASE WHEN vm.power_state = 'running' THEN 1 ELSE 0 END) as active_vms
    FROM networks n
    LEFT JOIN network_adapters na ON na.network_id = n.id
    LEFT JOIN virtual_machines vm ON vm.id = na.vm_id
    WHERE n.vlan_id IS NOT NULL
    GROUP BY n.vlan_id
    ORDER BY n.vlan_id
    `, { type: sequelize_1.QueryTypes.SELECT });
};
exports.getVlanUtilization = getVlanUtilization;
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
const findVmsWithHighChangeRate = async (sequelize, days = 7) => {
    return await sequelize.query(`
    SELECT
      vm.id,
      vm.name,
      SUM(vd.capacity_gb) as total_disk_gb,
      AVG(dcr.change_rate_mbps) as avg_change_rate_mbps,
      MAX(dcr.change_rate_mbps) as peak_change_rate_mbps,
      SUM(dcr.changed_blocks_gb) as total_changed_gb,
      ROUND((SUM(dcr.changed_blocks_gb)::numeric / SUM(vd.capacity_gb) * 100), 2) as change_percent
    FROM virtual_machines vm
    INNER JOIN virtual_disks vd ON vd.vm_id = vm.id
    INNER JOIN disk_change_rate dcr ON dcr.disk_id = vd.id
    WHERE dcr.recorded_at >= NOW() - INTERVAL '${days} days'
    GROUP BY vm.id, vm.name
    HAVING AVG(dcr.change_rate_mbps) > 10 OR SUM(dcr.changed_blocks_gb)::numeric / SUM(vd.capacity_gb) > 0.2
    ORDER BY avg_change_rate_mbps DESC
    `, { type: sequelize_1.QueryTypes.SELECT });
};
exports.findVmsWithHighChangeRate = findVmsWithHighChangeRate;
// ============================================================================
// EXPORT DEFAULT
// ============================================================================
exports.default = {
    // Basic queries
    findVirtualMachineById: exports.findVirtualMachineById,
    findVirtualMachinesByFilters: exports.findVirtualMachinesByFilters,
    findHostsWithCapacity: exports.findHostsWithCapacity,
    findDatastoresWithSpace: exports.findDatastoresWithSpace,
    // Complex filtering
    executeComplexFilter: exports.executeComplexFilter,
    searchVirtualResourcesFullText: exports.searchVirtualResourcesFullText,
    findVmsByTagHierarchy: exports.findVmsByTagHierarchy,
    // Aggregation
    aggregateResourcesByGroup: exports.aggregateResourcesByGroup,
    getClusterResourceUtilization: exports.getClusterResourceUtilization,
    getDatastoreUtilizationTrend: exports.getDatastoreUtilizationTrend,
    // Sorting
    sortVmsByMultipleCriteria: exports.sortVmsByMultipleCriteria,
    rankHostsByPerformance: exports.rankHostsByPerformance,
    // Pagination
    paginateWithOffsetLimit: exports.paginateWithOffsetLimit,
    paginateWithCursor: exports.paginateWithCursor,
    paginateWithKeyset: exports.paginateWithKeyset,
    // N+1 prevention
    findVmsWithEagerLoading: exports.findVmsWithEagerLoading,
    batchLoadVirtualMachines: exports.batchLoadVirtualMachines,
    // Performance optimization
    findWithQueryOptimization: exports.findWithQueryOptimization,
    getVmCountByStatus: exports.getVmCountByStatus,
    // Transactions
    findAndLockVm: exports.findAndLockVm,
    bulkUpdateVmStatus: exports.bulkUpdateVmStatus,
    // Subqueries & CTEs
    findVmsWithSubquery: exports.findVmsWithSubquery,
    getResourceHierarchyWithCte: exports.getResourceHierarchyWithCte,
    // Raw SQL complex queries
    getVmMigrationCandidates: exports.getVmMigrationCandidates,
    getStorageMigrationPlan: exports.getStorageMigrationPlan,
    // Network & topology
    getNetworkTopology: exports.getNetworkTopology,
    getVlanUtilization: exports.getVlanUtilization,
    // Snapshots & lifecycle
    findSnapshotsWithChain: exports.findSnapshotsWithChain,
    getVmLifecycleEvents: exports.getVmLifecycleEvents,
    // Resource pools & allocation
    findVmsByResourcePool: exports.findVmsByResourcePool,
    getVmCostAllocation: exports.getVmCostAllocation,
    // Performance & metrics
    getVmPerformanceMetrics: exports.getVmPerformanceMetrics,
    findVmsNeedingRightSizing: exports.findVmsNeedingRightSizing,
    findVmsWithHighChangeRate: exports.findVmsWithHighChangeRate,
    // Compliance & policies
    findVmsWithAntiAffinityRules: exports.findVmsWithAntiAffinityRules,
    findVmsWithComplianceIssues: exports.findVmsWithComplianceIssues,
    findVmsByBackupStatus: exports.findVmsByBackupStatus,
    // Maintenance & operations
    getHostMaintenanceModeImpact: exports.getHostMaintenanceModeImpact,
    getClusterDrsRecommendations: exports.getClusterDrsRecommendations,
    getHostFailoverCapacity: exports.getHostFailoverCapacity,
    // Cleanup & optimization
    findOrphanedVirtualDisks: exports.findOrphanedVirtualDisks,
    findZombieVms: exports.findZombieVms,
    findVmsInMultipleDatastores: exports.findVmsInMultipleDatastores,
    // Dependencies
    getVmDependencyGraph: exports.getVmDependencyGraph,
};
//# sourceMappingURL=virtual-resource-queries-kit.js.map