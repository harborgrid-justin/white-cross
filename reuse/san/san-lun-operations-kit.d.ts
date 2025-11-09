/**
 * LOC: SANLUN001
 * File: /reuse/san/san-lun-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize (database ORM)
 *   - SAN storage management systems
 *   - Multipathing drivers (MPIO, DM-Multipath)
 *   - Fibre Channel/iSCSI protocols
 *
 * DOWNSTREAM (imported by):
 *   - Storage provisioning services
 *   - Volume management systems
 *   - Backup and disaster recovery services
 *   - Performance monitoring dashboards
 */
/**
 * File: /reuse/san/san-lun-operations-kit.ts
 * Locator: WC-SAN-LUN-001
 * Purpose: SAN LUN Operations Kit - Advanced LUN provisioning, masking, mapping, and multipathing
 *
 * Upstream: Sequelize ORM, SAN storage controllers, Fibre Channel switches, iSCSI targets
 * Downstream: ../backend/*, ../services/storage/*, provisioning APIs, monitoring systems
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x
 * Exports: 40 utility functions for LUN lifecycle management, masking, mapping, multipathing, zoning, discovery, optimization
 *
 * LLM Context: Comprehensive SAN LUN management utilities for White Cross healthcare infrastructure.
 * Provides LUN provisioning, host masking, WWN/IQN mapping, multipath configuration, zone management,
 * path failover, capacity monitoring, snapshot operations, and performance optimization. Essential for
 * high-availability storage operations, disaster recovery, and maintaining data integrity in healthcare
 * environments requiring 24/7 uptime and sub-millisecond latency.
 */
import { Sequelize, Transaction, Model, ModelStatic } from 'sequelize';
interface LUN {
    id: string;
    name: string;
    wwid: string;
    size: number;
    storagePoolId: string;
    status: 'online' | 'offline' | 'degraded' | 'maintenance';
    lunNumber: number;
    thinProvisioned: boolean;
    allocated: number;
    compression: boolean;
    deduplication: boolean;
    tier: 'performance' | 'capacity' | 'archive';
    createdAt: Date;
    updatedAt: Date;
}
interface LUNMapping {
    id: string;
    lunId: string;
    hostId: string;
    hostLunId: number;
    wwn?: string;
    iqn?: string;
    accessMode: 'read-write' | 'read-only' | 'no-access';
    priority: number;
    createdAt: Date;
    updatedAt: Date;
}
interface LUNPath {
    id: string;
    lunId: string;
    hostId: string;
    controllerId: string;
    portId: string;
    pathState: 'active-optimized' | 'active-unoptimized' | 'standby' | 'unavailable' | 'failed';
    pathPriority: number;
    ioCount: number;
    errorCount: number;
    lastVerified: Date;
    createdAt: Date;
    updatedAt: Date;
}
interface MultipathConfig {
    lunId: string;
    hostId: string;
    pathSelectionPolicy: 'round-robin' | 'least-queue-depth' | 'service-time' | 'failover-only';
    pathGroupingPolicy: 'multibus' | 'group_by_prio' | 'group_by_node_name';
    minActivePaths: number;
    maxActivePaths: number;
    pathCheckInterval: number;
    failbackEnabled: boolean;
    loadBalancing: boolean;
}
interface ZoneConfig {
    id: string;
    zoneName: string;
    fabricId: string;
    zoneType: 'single-initiator-single-target' | 'single-initiator-multiple-targets' | 'multiple-initiators-single-target';
    members: Array<{
        wwn: string;
        alias: string;
        type: 'initiator' | 'target';
    }>;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
interface LUNSnapshot {
    id: string;
    lunId: string;
    snapshotName: string;
    size: number;
    createdAt: Date;
    description?: string;
    retentionDays: number;
    status: 'active' | 'expired' | 'deleted';
}
interface LUNPerformanceMetrics {
    lunId: string;
    timestamp: Date;
    readIOPS: number;
    writeIOPS: number;
    readThroughput: number;
    writeThroughput: number;
    avgLatency: number;
    queueDepth: number;
    utilizationPercent: number;
}
interface LUNProvisioningOptions {
    name: string;
    size: number;
    storagePoolId: string;
    thinProvisioned?: boolean;
    compression?: boolean;
    deduplication?: boolean;
    tier?: 'performance' | 'capacity' | 'archive';
    autoExpand?: boolean;
    maxSize?: number;
    blockSize?: number;
}
interface LUNMaskingOptions {
    lunId: string;
    hostIds: string[];
    accessMode?: 'read-write' | 'read-only';
    priority?: number;
    validatePaths?: boolean;
    autoZone?: boolean;
}
interface PathFailoverOptions {
    failoverTimeoutSeconds: number;
    maxRetries: number;
    healthCheckInterval: number;
    automaticFailback: boolean;
    notifyOnFailover: boolean;
}
interface LUNDiscoveryOptions {
    storagePoolIds?: string[];
    minSize?: number;
    maxSize?: number;
    tier?: string[];
    status?: string[];
    includeMetrics?: boolean;
    includeSnapshots?: boolean;
    includeMappings?: boolean;
}
interface CapacityReport {
    totalCapacity: number;
    allocatedCapacity: number;
    usedCapacity: number;
    freeCapacity: number;
    oversubscriptionRatio: number;
    thinProvisioningSavings: number;
    compressionRatio: number;
    deduplicationRatio: number;
    tierBreakdown: Record<string, {
        capacity: number;
        used: number;
    }>;
}
/**
 * Creates a new LUN with specified provisioning options.
 *
 * @param {ModelStatic<Model>} LUNModel - LUN Sequelize model
 * @param {LUNProvisioningOptions} options - Provisioning options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<LUN>} Created LUN
 *
 * @example
 * ```typescript
 * const lun = await provisionLUN(LUN, {
 *   name: 'patient-db-lun-01',
 *   size: 500,
 *   storagePoolId: 'pool-ssd-01',
 *   thinProvisioned: true,
 *   compression: true,
 *   tier: 'performance'
 * });
 * ```
 */
export declare const provisionLUN: (LUNModel: ModelStatic<Model>, options: LUNProvisioningOptions, transaction?: Transaction) => Promise<LUN>;
/**
 * Expands LUN capacity with validation and safety checks.
 *
 * @param {ModelStatic<Model>} LUNModel - LUN Sequelize model
 * @param {string} lunId - LUN ID
 * @param {number} newSize - New size in GB
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<LUN>} Updated LUN
 *
 * @example
 * ```typescript
 * const expandedLUN = await expandLUN(LUN, 'lun-123', 1000);
 * console.log(`LUN expanded from ${oldSize}GB to ${expandedLUN.size}GB`);
 * ```
 */
export declare const expandLUN: (LUNModel: ModelStatic<Model>, lunId: string, newSize: number, transaction?: Transaction) => Promise<LUN>;
/**
 * Deletes LUN with safety checks to prevent data loss.
 *
 * @param {ModelStatic<Model>} LUNModel - LUN Sequelize model
 * @param {ModelStatic<Model>} LUNMappingModel - LUN Mapping model
 * @param {string} lunId - LUN ID
 * @param {boolean} [force] - Force deletion even if mapped (default: false)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ deleted: boolean; reason?: string }>} Deletion result
 *
 * @example
 * ```typescript
 * const result = await deleteLUN(LUN, LUNMapping, 'lun-123', false);
 * if (!result.deleted) {
 *   console.error(`Failed to delete: ${result.reason}`);
 * }
 * ```
 */
export declare const deleteLUN: (LUNModel: ModelStatic<Model>, LUNMappingModel: ModelStatic<Model>, lunId: string, force?: boolean, transaction?: Transaction) => Promise<{
    deleted: boolean;
    reason?: string;
}>;
/**
 * Clones LUN with all attributes and optional snapshot.
 *
 * @param {ModelStatic<Model>} LUNModel - LUN Sequelize model
 * @param {string} sourceLunId - Source LUN ID
 * @param {string} cloneName - Name for the cloned LUN
 * @param {boolean} [thinClone] - Use thin cloning (default: true)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<LUN>} Cloned LUN
 *
 * @example
 * ```typescript
 * const clone = await cloneLUN(LUN, 'prod-lun-01', 'test-lun-01', true);
 * ```
 */
export declare const cloneLUN: (LUNModel: ModelStatic<Model>, sourceLunId: string, cloneName: string, thinClone?: boolean, transaction?: Transaction) => Promise<LUN>;
/**
 * Masks LUN to specified hosts with access control.
 *
 * @param {ModelStatic<Model>} LUNMappingModel - LUN Mapping model
 * @param {LUNMaskingOptions} options - Masking options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<LUNMapping[]>} Created mappings
 *
 * @example
 * ```typescript
 * const mappings = await maskLUNToHosts(LUNMapping, {
 *   lunId: 'lun-123',
 *   hostIds: ['host-01', 'host-02'],
 *   accessMode: 'read-write',
 *   priority: 1
 * });
 * ```
 */
export declare const maskLUNToHosts: (LUNMappingModel: ModelStatic<Model>, options: LUNMaskingOptions, transaction?: Transaction) => Promise<LUNMapping[]>;
/**
 * Unmasks LUN from specified hosts.
 *
 * @param {ModelStatic<Model>} LUNMappingModel - LUN Mapping model
 * @param {string} lunId - LUN ID
 * @param {string[]} hostIds - Host IDs to unmask from
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of unmapped hosts
 *
 * @example
 * ```typescript
 * const unmappedCount = await unmaskLUNFromHosts(
 *   LUNMapping,
 *   'lun-123',
 *   ['host-01', 'host-02']
 * );
 * ```
 */
export declare const unmaskLUNFromHosts: (LUNMappingModel: ModelStatic<Model>, lunId: string, hostIds: string[], transaction?: Transaction) => Promise<number>;
/**
 * Gets all LUN mappings with detailed host and path information.
 *
 * @param {ModelStatic<Model>} LUNMappingModel - LUN Mapping model
 * @param {string} lunId - LUN ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<LUNMapping[]>} LUN mappings
 *
 * @example
 * ```typescript
 * const mappings = await getLUNMappings(LUNMapping, 'lun-123');
 * console.log(`LUN is mapped to ${mappings.length} host(s)`);
 * ```
 */
export declare const getLUNMappings: (LUNMappingModel: ModelStatic<Model>, lunId: string, transaction?: Transaction) => Promise<LUNMapping[]>;
/**
 * Updates LUN mapping access mode.
 *
 * @param {ModelStatic<Model>} LUNMappingModel - LUN Mapping model
 * @param {string} lunId - LUN ID
 * @param {string} hostId - Host ID
 * @param {'read-write' | 'read-only' | 'no-access'} accessMode - New access mode
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<LUNMapping | null>} Updated mapping
 *
 * @example
 * ```typescript
 * await updateLUNAccessMode(LUNMapping, 'lun-123', 'host-01', 'read-only');
 * ```
 */
export declare const updateLUNAccessMode: (LUNMappingModel: ModelStatic<Model>, lunId: string, hostId: string, accessMode: "read-write" | "read-only" | "no-access", transaction?: Transaction) => Promise<LUNMapping | null>;
/**
 * Configures multipathing for LUN-host combination.
 *
 * @param {ModelStatic<Model>} MultipathConfigModel - Multipath config model
 * @param {MultipathConfig} config - Multipath configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<MultipathConfig>} Created/updated multipath config
 *
 * @example
 * ```typescript
 * const mpConfig = await configureMultipathing(MultipathConfig, {
 *   lunId: 'lun-123',
 *   hostId: 'host-01',
 *   pathSelectionPolicy: 'round-robin',
 *   pathGroupingPolicy: 'multibus',
 *   minActivePaths: 2,
 *   maxActivePaths: 4,
 *   pathCheckInterval: 5,
 *   failbackEnabled: true,
 *   loadBalancing: true
 * });
 * ```
 */
export declare const configureMultipathing: (MultipathConfigModel: ModelStatic<Model>, config: MultipathConfig, transaction?: Transaction) => Promise<MultipathConfig>;
/**
 * Discovers and registers all paths for a LUN-host combination.
 *
 * @param {ModelStatic<Model>} LUNPathModel - LUN Path model
 * @param {string} lunId - LUN ID
 * @param {string} hostId - Host ID
 * @param {Array<Partial<LUNPath>>} discoveredPaths - Discovered paths
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<LUNPath[]>} Registered paths
 *
 * @example
 * ```typescript
 * const paths = await registerLUNPaths(LUNPath, 'lun-123', 'host-01', [
 *   { controllerId: 'ctrl-a', portId: 'port-1', pathState: 'active-optimized' },
 *   { controllerId: 'ctrl-b', portId: 'port-2', pathState: 'active-optimized' }
 * ]);
 * ```
 */
export declare const registerLUNPaths: (LUNPathModel: ModelStatic<Model>, lunId: string, hostId: string, discoveredPaths: Array<Partial<LUNPath>>, transaction?: Transaction) => Promise<LUNPath[]>;
/**
 * Monitors path health and updates path states.
 *
 * @param {ModelStatic<Model>} LUNPathModel - LUN Path model
 * @param {string} lunId - LUN ID
 * @param {string} hostId - Host ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ healthy: number; degraded: number; failed: number }>} Path health summary
 *
 * @example
 * ```typescript
 * const health = await monitorPathHealth(LUNPath, 'lun-123', 'host-01');
 * console.log(`Healthy: ${health.healthy}, Degraded: ${health.degraded}, Failed: ${health.failed}`);
 * ```
 */
export declare const monitorPathHealth: (LUNPathModel: ModelStatic<Model>, lunId: string, hostId: string, transaction?: Transaction) => Promise<{
    healthy: number;
    degraded: number;
    failed: number;
}>;
/**
 * Performs path failover to standby paths.
 *
 * @param {ModelStatic<Model>} LUNPathModel - LUN Path model
 * @param {string} lunId - LUN ID
 * @param {string} hostId - Host ID
 * @param {string} failedPathId - Failed path ID
 * @param {PathFailoverOptions} options - Failover options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ success: boolean; newActivePath?: LUNPath }>} Failover result
 *
 * @example
 * ```typescript
 * const result = await performPathFailover(LUNPath, 'lun-123', 'host-01', 'path-xyz', {
 *   failoverTimeoutSeconds: 30,
 *   maxRetries: 3,
 *   healthCheckInterval: 5,
 *   automaticFailback: true,
 *   notifyOnFailover: true
 * });
 * ```
 */
export declare const performPathFailover: (LUNPathModel: ModelStatic<Model>, lunId: string, hostId: string, failedPathId: string, options: PathFailoverOptions, transaction?: Transaction) => Promise<{
    success: boolean;
    newActivePath?: LUNPath;
}>;
/**
 * Balances I/O load across active paths.
 *
 * @param {ModelStatic<Model>} LUNPathModel - LUN Path model
 * @param {string} lunId - LUN ID
 * @param {string} hostId - Host ID
 * @param {'round-robin' | 'least-queue-depth' | 'service-time'} policy - Load balancing policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<LUNPath[]>} Balanced paths with updated priorities
 *
 * @example
 * ```typescript
 * const balancedPaths = await balanceIOAcrossPaths(
 *   LUNPath,
 *   'lun-123',
 *   'host-01',
 *   'round-robin'
 * );
 * ```
 */
export declare const balanceIOAcrossPaths: (LUNPathModel: ModelStatic<Model>, lunId: string, hostId: string, policy: "round-robin" | "least-queue-depth" | "service-time", transaction?: Transaction) => Promise<LUNPath[]>;
/**
 * Creates zone configuration for SAN fabric.
 *
 * @param {ModelStatic<Model>} ZoneConfigModel - Zone config model
 * @param {Omit<ZoneConfig, 'id' | 'createdAt' | 'updatedAt'>} zoneConfig - Zone configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ZoneConfig>} Created zone config
 *
 * @example
 * ```typescript
 * const zone = await createZone(ZoneConfig, {
 *   zoneName: 'zone_host01_storage01',
 *   fabricId: 'fabric-a',
 *   zoneType: 'single-initiator-single-target',
 *   members: [
 *     { wwn: '10:00:00:00:c9:a1:b2:c3', alias: 'host01-hba0', type: 'initiator' },
 *     { wwn: '50:00:00:00:d8:e4:f5:a6', alias: 'storage01-port0', type: 'target' }
 *   ],
 *   active: true
 * });
 * ```
 */
export declare const createZone: (ZoneConfigModel: ModelStatic<Model>, zoneConfig: Omit<ZoneConfig, "id" | "createdAt" | "updatedAt">, transaction?: Transaction) => Promise<ZoneConfig>;
/**
 * Validates zone configuration for conflicts and best practices.
 *
 * @param {ModelStatic<Model>} ZoneConfigModel - Zone config model
 * @param {string} zoneName - Zone name to validate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateZoneConfig(ZoneConfig, 'zone_host01_storage01');
 * if (!validation.valid) {
 *   console.error('Zone validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateZoneConfig: (ZoneConfigModel: ModelStatic<Model>, zoneName: string, transaction?: Transaction) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Activates zone configuration on fabric.
 *
 * @param {ModelStatic<Model>} ZoneConfigModel - Zone config model
 * @param {string} zoneId - Zone ID to activate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ZoneConfig>} Activated zone config
 *
 * @example
 * ```typescript
 * const activeZone = await activateZone(ZoneConfig, 'zone-123');
 * ```
 */
export declare const activateZone: (ZoneConfigModel: ModelStatic<Model>, zoneId: string, transaction?: Transaction) => Promise<ZoneConfig>;
/**
 * Deactivates zone configuration.
 *
 * @param {ModelStatic<Model>} ZoneConfigModel - Zone config model
 * @param {string} zoneId - Zone ID to deactivate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ZoneConfig>} Deactivated zone config
 *
 * @example
 * ```typescript
 * const inactiveZone = await deactivateZone(ZoneConfig, 'zone-123');
 * ```
 */
export declare const deactivateZone: (ZoneConfigModel: ModelStatic<Model>, zoneId: string, transaction?: Transaction) => Promise<ZoneConfig>;
/**
 * Discovers LUNs with advanced filtering and optimization.
 *
 * @param {ModelStatic<Model>} LUNModel - LUN model
 * @param {LUNDiscoveryOptions} [options] - Discovery options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<LUN[]>} Discovered LUNs
 *
 * @example
 * ```typescript
 * const luns = await discoverLUNs(LUN, {
 *   storagePoolIds: ['pool-01', 'pool-02'],
 *   minSize: 100,
 *   maxSize: 1000,
 *   tier: ['performance', 'capacity'],
 *   status: ['online'],
 *   includeMetrics: true
 * });
 * ```
 */
export declare const discoverLUNs: (LUNModel: ModelStatic<Model>, options?: LUNDiscoveryOptions, transaction?: Transaction) => Promise<LUN[]>;
/**
 * Finds LUNs by WWN/IQN with fuzzy matching.
 *
 * @param {ModelStatic<Model>} LUNMappingModel - LUN Mapping model
 * @param {string} identifier - WWN or IQN
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<LUNMapping[]>} Matching LUN mappings
 *
 * @example
 * ```typescript
 * const mappings = await findLUNsByIdentifier(
 *   LUNMapping,
 *   '10:00:00:00:c9:a1:b2:c3'
 * );
 * ```
 */
export declare const findLUNsByIdentifier: (LUNMappingModel: ModelStatic<Model>, identifier: string, transaction?: Transaction) => Promise<LUNMapping[]>;
/**
 * Queries LUNs with complex filtering using Sequelize operators.
 *
 * @param {ModelStatic<Model>} LUNModel - LUN model
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Complex filter criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<LUN[]>} Filtered LUNs
 *
 * @example
 * ```typescript
 * const luns = await queryLUNsAdvanced(LUN, sequelize, {
 *   allocatedPercent: { min: 80 }, // >80% allocated
 *   tier: ['performance'],
 *   compressionEnabled: true,
 *   ageInDays: { max: 30 } // Created within last 30 days
 * });
 * ```
 */
export declare const queryLUNsAdvanced: (LUNModel: ModelStatic<Model>, sequelize: Sequelize, filters: any, transaction?: Transaction) => Promise<LUN[]>;
/**
 * Finds orphaned LUNs (no active mappings).
 *
 * @param {ModelStatic<Model>} LUNModel - LUN model
 * @param {ModelStatic<Model>} LUNMappingModel - LUN Mapping model
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [daysUnmapped] - Days without mapping (default: 30)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<LUN[]>} Orphaned LUNs
 *
 * @example
 * ```typescript
 * const orphaned = await findOrphanedLUNs(LUN, LUNMapping, sequelize, 90);
 * console.log(`Found ${orphaned.length} orphaned LUNs`);
 * ```
 */
export declare const findOrphanedLUNs: (LUNModel: ModelStatic<Model>, LUNMappingModel: ModelStatic<Model>, sequelize: Sequelize, daysUnmapped?: number, transaction?: Transaction) => Promise<LUN[]>;
/**
 * Records LUN performance metrics.
 *
 * @param {ModelStatic<Model>} LUNPerformanceModel - LUN Performance model
 * @param {LUNPerformanceMetrics} metrics - Performance metrics
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<LUNPerformanceMetrics>} Recorded metrics
 *
 * @example
 * ```typescript
 * await recordLUNPerformanceMetrics(LUNPerformance, {
 *   lunId: 'lun-123',
 *   timestamp: new Date(),
 *   readIOPS: 15000,
 *   writeIOPS: 8000,
 *   readThroughput: 500,
 *   writeThroughput: 300,
 *   avgLatency: 2.5,
 *   queueDepth: 32,
 *   utilizationPercent: 75
 * });
 * ```
 */
export declare const recordLUNPerformanceMetrics: (LUNPerformanceModel: ModelStatic<Model>, metrics: LUNPerformanceMetrics, transaction?: Transaction) => Promise<LUNPerformanceMetrics>;
/**
 * Gets aggregated performance metrics for time range.
 *
 * @param {ModelStatic<Model>} LUNPerformanceModel - LUN Performance model
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} lunId - LUN ID
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<object>} Aggregated metrics
 *
 * @example
 * ```typescript
 * const metrics = await getAggregatedPerformanceMetrics(
 *   LUNPerformance,
 *   sequelize,
 *   'lun-123',
 *   startOfDay,
 *   endOfDay
 * );
 * console.log(`Avg IOPS: ${metrics.avgIOPS}, Peak latency: ${metrics.maxLatency}ms`);
 * ```
 */
export declare const getAggregatedPerformanceMetrics: (LUNPerformanceModel: ModelStatic<Model>, sequelize: Sequelize, lunId: string, startTime: Date, endTime: Date, transaction?: Transaction) => Promise<{
    avgReadIOPS: number;
    avgWriteIOPS: number;
    avgLatency: number;
    maxLatency: number;
    avgUtilization: number;
    peakThroughput: number;
}>;
/**
 * Identifies performance bottlenecks and hot LUNs.
 *
 * @param {ModelStatic<Model>} LUNPerformanceModel - LUN Performance model
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [topN] - Number of top LUNs to return (default: 10)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Array<{ lunId: string; avgIOPS: number; avgLatency: number }>>} Hot LUNs
 *
 * @example
 * ```typescript
 * const hotLUNs = await identifyHotLUNs(LUNPerformance, sequelize, 5);
 * hotLUNs.forEach(lun => {
 *   console.log(`LUN ${lun.lunId}: ${lun.avgIOPS} IOPS, ${lun.avgLatency}ms latency`);
 * });
 * ```
 */
export declare const identifyHotLUNs: (LUNPerformanceModel: ModelStatic<Model>, sequelize: Sequelize, topN?: number, transaction?: Transaction) => Promise<Array<{
    lunId: string;
    avgIOPS: number;
    avgLatency: number;
}>>;
/**
 * Generates comprehensive capacity report for storage pools.
 *
 * @param {ModelStatic<Model>} LUNModel - LUN model
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} [storagePoolIds] - Storage pool IDs (all if not specified)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CapacityReport>} Capacity report
 *
 * @example
 * ```typescript
 * const report = await generateCapacityReport(LUN, sequelize, ['pool-01']);
 * console.log(`Total: ${report.totalCapacity}GB, Free: ${report.freeCapacity}GB`);
 * console.log(`Oversubscription ratio: ${report.oversubscriptionRatio}x`);
 * ```
 */
export declare const generateCapacityReport: (LUNModel: ModelStatic<Model>, sequelize: Sequelize, storagePoolIds?: string[], transaction?: Transaction) => Promise<CapacityReport>;
/**
 * Predicts capacity exhaustion date based on growth trends.
 *
 * @param {ModelStatic<Model>} LUNModel - LUN model
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} storagePoolId - Storage pool ID
 * @param {number} maxCapacity - Maximum pool capacity in GB
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ exhaustionDate: Date | null; daysRemaining: number; growthRateGB: number }>} Prediction
 *
 * @example
 * ```typescript
 * const prediction = await predictCapacityExhaustion(
 *   LUN,
 *   sequelize,
 *   'pool-01',
 *   10000
 * );
 * if (prediction.exhaustionDate) {
 *   console.log(`Capacity exhaustion predicted in ${prediction.daysRemaining} days`);
 * }
 * ```
 */
export declare const predictCapacityExhaustion: (LUNModel: ModelStatic<Model>, sequelize: Sequelize, storagePoolId: string, maxCapacity: number, transaction?: Transaction) => Promise<{
    exhaustionDate: Date | null;
    daysRemaining: number;
    growthRateGB: number;
}>;
/**
 * Reclaims unused capacity from thin-provisioned LUNs.
 *
 * @param {ModelStatic<Model>} LUNModel - LUN model
 * @param {string} storagePoolId - Storage pool ID
 * @param {number} [thresholdPercent] - Utilization threshold (default: 50)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ reclaimedGB: number; lunsProcessed: number }>} Reclamation result
 *
 * @example
 * ```typescript
 * const result = await reclaimUnusedCapacity(LUN, 'pool-01', 30);
 * console.log(`Reclaimed ${result.reclaimedGB}GB from ${result.lunsProcessed} LUNs`);
 * ```
 */
export declare const reclaimUnusedCapacity: (LUNModel: ModelStatic<Model>, storagePoolId: string, thresholdPercent?: number, transaction?: Transaction) => Promise<{
    reclaimedGB: number;
    lunsProcessed: number;
}>;
/**
 * Creates snapshot of LUN.
 *
 * @param {ModelStatic<Model>} LUNSnapshotModel - LUN Snapshot model
 * @param {ModelStatic<Model>} LUNModel - LUN model
 * @param {string} lunId - LUN ID
 * @param {string} snapshotName - Snapshot name
 * @param {number} [retentionDays] - Retention days (default: 30)
 * @param {string} [description] - Snapshot description
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<LUNSnapshot>} Created snapshot
 *
 * @example
 * ```typescript
 * const snapshot = await createLUNSnapshot(
 *   LUNSnapshot,
 *   LUN,
 *   'lun-123',
 *   'daily-backup-2024-01-15',
 *   7,
 *   'Daily backup before maintenance'
 * );
 * ```
 */
export declare const createLUNSnapshot: (LUNSnapshotModel: ModelStatic<Model>, LUNModel: ModelStatic<Model>, lunId: string, snapshotName: string, retentionDays?: number, description?: string, transaction?: Transaction) => Promise<LUNSnapshot>;
/**
 * Restores LUN from snapshot.
 *
 * @param {ModelStatic<Model>} LUNModel - LUN model
 * @param {ModelStatic<Model>} LUNSnapshotModel - LUN Snapshot model
 * @param {string} snapshotId - Snapshot ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ success: boolean; lunId: string }>} Restore result
 *
 * @example
 * ```typescript
 * const result = await restoreLUNFromSnapshot(LUN, LUNSnapshot, 'snap-123');
 * console.log(`Restored LUN: ${result.lunId}`);
 * ```
 */
export declare const restoreLUNFromSnapshot: (LUNModel: ModelStatic<Model>, LUNSnapshotModel: ModelStatic<Model>, snapshotId: string, transaction?: Transaction) => Promise<{
    success: boolean;
    lunId: string;
}>;
/**
 * Purges expired snapshots.
 *
 * @param {ModelStatic<Model>} LUNSnapshotModel - LUN Snapshot model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ purgedCount: number; reclaimedGB: number }>} Purge result
 *
 * @example
 * ```typescript
 * const result = await purgeExpiredSnapshots(LUNSnapshot);
 * console.log(`Purged ${result.purgedCount} snapshots, reclaimed ${result.reclaimedGB}GB`);
 * ```
 */
export declare const purgeExpiredSnapshots: (LUNSnapshotModel: ModelStatic<Model>, transaction?: Transaction) => Promise<{
    purgedCount: number;
    reclaimedGB: number;
}>;
/**
 * Generates unique World Wide Identifier (WWID) for LUN.
 *
 * @returns {string} WWID in NAA format
 *
 * @example
 * ```typescript
 * const wwid = generateWWID();
 * // Returns: "naa.600508b1001c1234567890abcdef0123"
 * ```
 */
export declare const generateWWID: () => string;
/**
 * Validates WWN (World Wide Name) format.
 *
 * @param {string} wwn - WWN to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const valid = validateWWN('10:00:00:00:c9:a1:b2:c3');
 * ```
 */
export declare const validateWWN: (wwn: string) => boolean;
/**
 * Validates IQN (iSCSI Qualified Name) format.
 *
 * @param {string} iqn - IQN to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const valid = validateIQN('iqn.1991-05.com.example:storage.disk1.sys1.xyz');
 * ```
 */
export declare const validateIQN: (iqn: string) => boolean;
declare const _default: {
    provisionLUN: (LUNModel: ModelStatic<Model>, options: LUNProvisioningOptions, transaction?: Transaction) => Promise<LUN>;
    expandLUN: (LUNModel: ModelStatic<Model>, lunId: string, newSize: number, transaction?: Transaction) => Promise<LUN>;
    deleteLUN: (LUNModel: ModelStatic<Model>, LUNMappingModel: ModelStatic<Model>, lunId: string, force?: boolean, transaction?: Transaction) => Promise<{
        deleted: boolean;
        reason?: string;
    }>;
    cloneLUN: (LUNModel: ModelStatic<Model>, sourceLunId: string, cloneName: string, thinClone?: boolean, transaction?: Transaction) => Promise<LUN>;
    maskLUNToHosts: (LUNMappingModel: ModelStatic<Model>, options: LUNMaskingOptions, transaction?: Transaction) => Promise<LUNMapping[]>;
    unmaskLUNFromHosts: (LUNMappingModel: ModelStatic<Model>, lunId: string, hostIds: string[], transaction?: Transaction) => Promise<number>;
    getLUNMappings: (LUNMappingModel: ModelStatic<Model>, lunId: string, transaction?: Transaction) => Promise<LUNMapping[]>;
    updateLUNAccessMode: (LUNMappingModel: ModelStatic<Model>, lunId: string, hostId: string, accessMode: "read-write" | "read-only" | "no-access", transaction?: Transaction) => Promise<LUNMapping | null>;
    configureMultipathing: (MultipathConfigModel: ModelStatic<Model>, config: MultipathConfig, transaction?: Transaction) => Promise<MultipathConfig>;
    registerLUNPaths: (LUNPathModel: ModelStatic<Model>, lunId: string, hostId: string, discoveredPaths: Array<Partial<LUNPath>>, transaction?: Transaction) => Promise<LUNPath[]>;
    monitorPathHealth: (LUNPathModel: ModelStatic<Model>, lunId: string, hostId: string, transaction?: Transaction) => Promise<{
        healthy: number;
        degraded: number;
        failed: number;
    }>;
    performPathFailover: (LUNPathModel: ModelStatic<Model>, lunId: string, hostId: string, failedPathId: string, options: PathFailoverOptions, transaction?: Transaction) => Promise<{
        success: boolean;
        newActivePath?: LUNPath;
    }>;
    balanceIOAcrossPaths: (LUNPathModel: ModelStatic<Model>, lunId: string, hostId: string, policy: "round-robin" | "least-queue-depth" | "service-time", transaction?: Transaction) => Promise<LUNPath[]>;
    createZone: (ZoneConfigModel: ModelStatic<Model>, zoneConfig: Omit<ZoneConfig, "id" | "createdAt" | "updatedAt">, transaction?: Transaction) => Promise<ZoneConfig>;
    validateZoneConfig: (ZoneConfigModel: ModelStatic<Model>, zoneName: string, transaction?: Transaction) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    activateZone: (ZoneConfigModel: ModelStatic<Model>, zoneId: string, transaction?: Transaction) => Promise<ZoneConfig>;
    deactivateZone: (ZoneConfigModel: ModelStatic<Model>, zoneId: string, transaction?: Transaction) => Promise<ZoneConfig>;
    discoverLUNs: (LUNModel: ModelStatic<Model>, options?: LUNDiscoveryOptions, transaction?: Transaction) => Promise<LUN[]>;
    findLUNsByIdentifier: (LUNMappingModel: ModelStatic<Model>, identifier: string, transaction?: Transaction) => Promise<LUNMapping[]>;
    queryLUNsAdvanced: (LUNModel: ModelStatic<Model>, sequelize: Sequelize, filters: any, transaction?: Transaction) => Promise<LUN[]>;
    findOrphanedLUNs: (LUNModel: ModelStatic<Model>, LUNMappingModel: ModelStatic<Model>, sequelize: Sequelize, daysUnmapped?: number, transaction?: Transaction) => Promise<LUN[]>;
    recordLUNPerformanceMetrics: (LUNPerformanceModel: ModelStatic<Model>, metrics: LUNPerformanceMetrics, transaction?: Transaction) => Promise<LUNPerformanceMetrics>;
    getAggregatedPerformanceMetrics: (LUNPerformanceModel: ModelStatic<Model>, sequelize: Sequelize, lunId: string, startTime: Date, endTime: Date, transaction?: Transaction) => Promise<{
        avgReadIOPS: number;
        avgWriteIOPS: number;
        avgLatency: number;
        maxLatency: number;
        avgUtilization: number;
        peakThroughput: number;
    }>;
    identifyHotLUNs: (LUNPerformanceModel: ModelStatic<Model>, sequelize: Sequelize, topN?: number, transaction?: Transaction) => Promise<Array<{
        lunId: string;
        avgIOPS: number;
        avgLatency: number;
    }>>;
    generateCapacityReport: (LUNModel: ModelStatic<Model>, sequelize: Sequelize, storagePoolIds?: string[], transaction?: Transaction) => Promise<CapacityReport>;
    predictCapacityExhaustion: (LUNModel: ModelStatic<Model>, sequelize: Sequelize, storagePoolId: string, maxCapacity: number, transaction?: Transaction) => Promise<{
        exhaustionDate: Date | null;
        daysRemaining: number;
        growthRateGB: number;
    }>;
    reclaimUnusedCapacity: (LUNModel: ModelStatic<Model>, storagePoolId: string, thresholdPercent?: number, transaction?: Transaction) => Promise<{
        reclaimedGB: number;
        lunsProcessed: number;
    }>;
    createLUNSnapshot: (LUNSnapshotModel: ModelStatic<Model>, LUNModel: ModelStatic<Model>, lunId: string, snapshotName: string, retentionDays?: number, description?: string, transaction?: Transaction) => Promise<LUNSnapshot>;
    restoreLUNFromSnapshot: (LUNModel: ModelStatic<Model>, LUNSnapshotModel: ModelStatic<Model>, snapshotId: string, transaction?: Transaction) => Promise<{
        success: boolean;
        lunId: string;
    }>;
    purgeExpiredSnapshots: (LUNSnapshotModel: ModelStatic<Model>, transaction?: Transaction) => Promise<{
        purgedCount: number;
        reclaimedGB: number;
    }>;
    generateWWID: () => string;
    validateWWN: (wwn: string) => boolean;
    validateIQN: (iqn: string) => boolean;
};
export default _default;
//# sourceMappingURL=san-lun-operations-kit.d.ts.map