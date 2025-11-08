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

import {
  Sequelize,
  Transaction,
  Model,
  ModelStatic,
  Op,
  QueryTypes,
  FindOptions,
  WhereOptions,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface LUN {
  id: string;
  name: string;
  wwid: string; // World Wide Identifier
  size: number; // Size in GB
  storagePoolId: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  lunNumber: number;
  thinProvisioned: boolean;
  allocated: number; // Actually allocated space in GB
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
  hostLunId: number; // LUN ID as seen by the host
  wwn?: string; // World Wide Name for FC
  iqn?: string; // iSCSI Qualified Name
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
  pathCheckInterval: number; // seconds
  failbackEnabled: boolean;
  loadBalancing: boolean;
}

interface ZoneConfig {
  id: string;
  zoneName: string;
  fabricId: string;
  zoneType: 'single-initiator-single-target' | 'single-initiator-multiple-targets' | 'multiple-initiators-single-target';
  members: Array<{ wwn: string; alias: string; type: 'initiator' | 'target' }>;
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
  readThroughput: number; // MB/s
  writeThroughput: number; // MB/s
  avgLatency: number; // milliseconds
  queueDepth: number;
  utilizationPercent: number;
}

interface LUNProvisioningOptions {
  name: string;
  size: number; // GB
  storagePoolId: string;
  thinProvisioned?: boolean;
  compression?: boolean;
  deduplication?: boolean;
  tier?: 'performance' | 'capacity' | 'archive';
  autoExpand?: boolean;
  maxSize?: number; // GB (for thin provisioning)
  blockSize?: number; // KB
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
  healthCheckInterval: number; // seconds
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
  totalCapacity: number; // GB
  allocatedCapacity: number; // GB
  usedCapacity: number; // GB
  freeCapacity: number; // GB
  oversubscriptionRatio: number;
  thinProvisioningSavings: number; // GB
  compressionRatio: number;
  deduplicationRatio: number;
  tierBreakdown: Record<string, { capacity: number; used: number }>;
}

// ============================================================================
// LUN PROVISIONING AND LIFECYCLE
// ============================================================================

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
export const provisionLUN = async (
  LUNModel: ModelStatic<Model>,
  options: LUNProvisioningOptions,
  transaction?: Transaction,
): Promise<LUN> => {
  const {
    name,
    size,
    storagePoolId,
    thinProvisioned = true,
    compression = false,
    deduplication = false,
    tier = 'capacity',
    autoExpand = false,
    maxSize,
    blockSize = 4,
  } = options;

  // Generate WWID (World Wide Identifier)
  const wwid = generateWWID();

  // Find next available LUN number
  const lastLUN = await LUNModel.findOne({
    where: { storagePoolId },
    order: [['lunNumber', 'DESC']],
    transaction,
  });

  const lunNumber = lastLUN ? (lastLUN as any).lunNumber + 1 : 0;

  const lun = await LUNModel.create(
    {
      name,
      wwid,
      size,
      storagePoolId,
      lunNumber,
      status: 'online',
      thinProvisioned,
      allocated: thinProvisioned ? 0 : size,
      compression,
      deduplication,
      tier,
      metadata: {
        autoExpand,
        maxSize: maxSize || size * 2,
        blockSize,
      },
    } as any,
    { transaction },
  );

  return lun.toJSON() as LUN;
};

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
export const expandLUN = async (
  LUNModel: ModelStatic<Model>,
  lunId: string,
  newSize: number,
  transaction?: Transaction,
): Promise<LUN> => {
  const lun = await LUNModel.findByPk(lunId, { transaction });

  if (!lun) {
    throw new Error(`LUN ${lunId} not found`);
  }

  const currentSize = (lun as any).size;

  if (newSize <= currentSize) {
    throw new Error(`New size (${newSize}GB) must be greater than current size (${currentSize}GB)`);
  }

  const maxSize = (lun as any).metadata?.maxSize || currentSize * 2;

  if (newSize > maxSize) {
    throw new Error(`New size (${newSize}GB) exceeds maximum allowed size (${maxSize}GB)`);
  }

  await lun.update(
    {
      size: newSize,
      updatedAt: new Date(),
    },
    { transaction },
  );

  return lun.toJSON() as LUN;
};

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
export const deleteLUN = async (
  LUNModel: ModelStatic<Model>,
  LUNMappingModel: ModelStatic<Model>,
  lunId: string,
  force: boolean = false,
  transaction?: Transaction,
): Promise<{ deleted: boolean; reason?: string }> => {
  const lun = await LUNModel.findByPk(lunId, { transaction });

  if (!lun) {
    return { deleted: false, reason: 'LUN not found' };
  }

  // Check for existing mappings
  const mappingCount = await LUNMappingModel.count({
    where: { lunId },
    transaction,
  });

  if (mappingCount > 0 && !force) {
    return {
      deleted: false,
      reason: `LUN has ${mappingCount} active mapping(s). Use force=true to delete anyway.`,
    };
  }

  // Remove all mappings if force delete
  if (force && mappingCount > 0) {
    await LUNMappingModel.destroy({
      where: { lunId },
      transaction,
    });
  }

  await lun.destroy({ transaction });

  return { deleted: true };
};

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
export const cloneLUN = async (
  LUNModel: ModelStatic<Model>,
  sourceLunId: string,
  cloneName: string,
  thinClone: boolean = true,
  transaction?: Transaction,
): Promise<LUN> => {
  const sourceLUN = await LUNModel.findByPk(sourceLunId, { transaction });

  if (!sourceLUN) {
    throw new Error(`Source LUN ${sourceLunId} not found`);
  }

  const sourceData = sourceLUN.toJSON() as any;

  const clonedLUN = await LUNModel.create(
    {
      ...sourceData,
      id: undefined,
      name: cloneName,
      wwid: generateWWID(),
      allocated: thinClone ? 0 : sourceData.size,
      thinProvisioned: thinClone,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        ...sourceData.metadata,
        clonedFrom: sourceLunId,
        clonedAt: new Date(),
        thinClone,
      },
    },
    { transaction },
  );

  return clonedLUN.toJSON() as LUN;
};

// ============================================================================
// LUN MASKING AND MAPPING
// ============================================================================

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
export const maskLUNToHosts = async (
  LUNMappingModel: ModelStatic<Model>,
  options: LUNMaskingOptions,
  transaction?: Transaction,
): Promise<LUNMapping[]> => {
  const { lunId, hostIds, accessMode = 'read-write', priority = 0, validatePaths = true } = options;

  const mappings: LUNMapping[] = [];

  for (const hostId of hostIds) {
    // Check if mapping already exists
    const existing = await LUNMappingModel.findOne({
      where: { lunId, hostId },
      transaction,
    });

    if (existing) {
      // Update existing mapping
      await existing.update(
        {
          accessMode,
          priority,
          updatedAt: new Date(),
        },
        { transaction },
      );
      mappings.push(existing.toJSON() as LUNMapping);
    } else {
      // Find next available host LUN ID
      const lastMapping = await LUNMappingModel.findOne({
        where: { hostId },
        order: [['hostLunId', 'DESC']],
        transaction,
      });

      const hostLunId = lastMapping ? (lastMapping as any).hostLunId + 1 : 0;

      const mapping = await LUNMappingModel.create(
        {
          lunId,
          hostId,
          hostLunId,
          accessMode,
          priority,
        } as any,
        { transaction },
      );

      mappings.push(mapping.toJSON() as LUNMapping);
    }
  }

  return mappings;
};

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
export const unmaskLUNFromHosts = async (
  LUNMappingModel: ModelStatic<Model>,
  lunId: string,
  hostIds: string[],
  transaction?: Transaction,
): Promise<number> => {
  const deletedCount = await LUNMappingModel.destroy({
    where: {
      lunId,
      hostId: { [Op.in]: hostIds },
    },
    transaction,
  });

  return deletedCount;
};

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
export const getLUNMappings = async (
  LUNMappingModel: ModelStatic<Model>,
  lunId: string,
  transaction?: Transaction,
): Promise<LUNMapping[]> => {
  const mappings = await LUNMappingModel.findAll({
    where: { lunId },
    order: [['priority', 'DESC'], ['hostLunId', 'ASC']],
    transaction,
  });

  return mappings.map((m) => m.toJSON() as LUNMapping);
};

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
export const updateLUNAccessMode = async (
  LUNMappingModel: ModelStatic<Model>,
  lunId: string,
  hostId: string,
  accessMode: 'read-write' | 'read-only' | 'no-access',
  transaction?: Transaction,
): Promise<LUNMapping | null> => {
  const mapping = await LUNMappingModel.findOne({
    where: { lunId, hostId },
    transaction,
  });

  if (!mapping) {
    return null;
  }

  await mapping.update({ accessMode, updatedAt: new Date() }, { transaction });

  return mapping.toJSON() as LUNMapping;
};

// ============================================================================
// MULTIPATHING OPERATIONS
// ============================================================================

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
export const configureMultipathing = async (
  MultipathConfigModel: ModelStatic<Model>,
  config: MultipathConfig,
  transaction?: Transaction,
): Promise<MultipathConfig> => {
  const existing = await MultipathConfigModel.findOne({
    where: {
      lunId: config.lunId,
      hostId: config.hostId,
    },
    transaction,
  });

  if (existing) {
    await existing.update(config as any, { transaction });
    return existing.toJSON() as MultipathConfig;
  }

  const created = await MultipathConfigModel.create(config as any, { transaction });
  return created.toJSON() as MultipathConfig;
};

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
export const registerLUNPaths = async (
  LUNPathModel: ModelStatic<Model>,
  lunId: string,
  hostId: string,
  discoveredPaths: Array<Partial<LUNPath>>,
  transaction?: Transaction,
): Promise<LUNPath[]> => {
  const paths: LUNPath[] = [];

  for (const pathData of discoveredPaths) {
    const existing = await LUNPathModel.findOne({
      where: {
        lunId,
        hostId,
        controllerId: pathData.controllerId,
        portId: pathData.portId,
      },
      transaction,
    });

    if (existing) {
      await existing.update(
        {
          pathState: pathData.pathState || 'active-optimized',
          lastVerified: new Date(),
          updatedAt: new Date(),
        },
        { transaction },
      );
      paths.push(existing.toJSON() as LUNPath);
    } else {
      const path = await LUNPathModel.create(
        {
          lunId,
          hostId,
          controllerId: pathData.controllerId,
          portId: pathData.portId,
          pathState: pathData.pathState || 'active-optimized',
          pathPriority: pathData.pathPriority || 1,
          ioCount: 0,
          errorCount: 0,
          lastVerified: new Date(),
        } as any,
        { transaction },
      );
      paths.push(path.toJSON() as LUNPath);
    }
  }

  return paths;
};

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
export const monitorPathHealth = async (
  LUNPathModel: ModelStatic<Model>,
  lunId: string,
  hostId: string,
  transaction?: Transaction,
): Promise<{ healthy: number; degraded: number; failed: number }> => {
  const paths = await LUNPathModel.findAll({
    where: { lunId, hostId },
    transaction,
  });

  const summary = {
    healthy: 0,
    degraded: 0,
    failed: 0,
  };

  for (const path of paths) {
    const pathData = path.toJSON() as any;

    if (pathData.pathState === 'active-optimized') {
      summary.healthy++;
    } else if (
      pathData.pathState === 'active-unoptimized' ||
      pathData.pathState === 'standby'
    ) {
      summary.degraded++;
    } else if (pathData.pathState === 'failed' || pathData.pathState === 'unavailable') {
      summary.failed++;
    }
  }

  return summary;
};

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
export const performPathFailover = async (
  LUNPathModel: ModelStatic<Model>,
  lunId: string,
  hostId: string,
  failedPathId: string,
  options: PathFailoverOptions,
  transaction?: Transaction,
): Promise<{ success: boolean; newActivePath?: LUNPath }> => {
  // Mark failed path as failed
  const failedPath = await LUNPathModel.findByPk(failedPathId, { transaction });

  if (failedPath) {
    await failedPath.update(
      {
        pathState: 'failed',
        updatedAt: new Date(),
      },
      { transaction },
    );
  }

  // Find best standby path
  const standbyPath = await LUNPathModel.findOne({
    where: {
      lunId,
      hostId,
      pathState: { [Op.in]: ['standby', 'active-unoptimized'] },
    },
    order: [
      ['pathPriority', 'DESC'],
      ['errorCount', 'ASC'],
    ],
    transaction,
  });

  if (!standbyPath) {
    return { success: false };
  }

  // Activate standby path
  await standbyPath.update(
    {
      pathState: 'active-optimized',
      lastVerified: new Date(),
      updatedAt: new Date(),
    },
    { transaction },
  );

  return {
    success: true,
    newActivePath: standbyPath.toJSON() as LUNPath,
  };
};

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
export const balanceIOAcrossPaths = async (
  LUNPathModel: ModelStatic<Model>,
  lunId: string,
  hostId: string,
  policy: 'round-robin' | 'least-queue-depth' | 'service-time',
  transaction?: Transaction,
): Promise<LUNPath[]> => {
  const activePaths = await LUNPathModel.findAll({
    where: {
      lunId,
      hostId,
      pathState: { [Op.in]: ['active-optimized', 'active-unoptimized'] },
    },
    transaction,
  });

  const paths: LUNPath[] = [];

  for (let i = 0; i < activePaths.length; i++) {
    const path = activePaths[i];
    let priority = 1;

    switch (policy) {
      case 'round-robin':
        priority = activePaths.length - i;
        break;
      case 'least-queue-depth':
        // Prioritize paths with lower I/O count
        priority = 100 - ((path as any).ioCount % 100);
        break;
      case 'service-time':
        // Prioritize paths with fewer errors
        priority = 100 - ((path as any).errorCount % 100);
        break;
    }

    await path.update({ pathPriority: priority }, { transaction });
    paths.push(path.toJSON() as LUNPath);
  }

  return paths;
};

// ============================================================================
// ZONING MANAGEMENT
// ============================================================================

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
export const createZone = async (
  ZoneConfigModel: ModelStatic<Model>,
  zoneConfig: Omit<ZoneConfig, 'id' | 'createdAt' | 'updatedAt'>,
  transaction?: Transaction,
): Promise<ZoneConfig> => {
  const zone = await ZoneConfigModel.create(zoneConfig as any, { transaction });
  return zone.toJSON() as ZoneConfig;
};

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
export const validateZoneConfig = async (
  ZoneConfigModel: ModelStatic<Model>,
  zoneName: string,
  transaction?: Transaction,
): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> => {
  const zone = await ZoneConfigModel.findOne({
    where: { zoneName },
    transaction,
  });

  const errors: string[] = [];
  const warnings: string[] = [];

  if (!zone) {
    errors.push(`Zone ${zoneName} not found`);
    return { valid: false, errors, warnings };
  }

  const zoneData = zone.toJSON() as any;

  // Validate members
  if (!zoneData.members || zoneData.members.length === 0) {
    errors.push('Zone has no members');
  }

  const initiators = zoneData.members.filter((m: any) => m.type === 'initiator');
  const targets = zoneData.members.filter((m: any) => m.type === 'target');

  if (initiators.length === 0) {
    errors.push('Zone has no initiators');
  }

  if (targets.length === 0) {
    errors.push('Zone has no targets');
  }

  // Validate zone type
  if (zoneData.zoneType === 'single-initiator-single-target') {
    if (initiators.length > 1) {
      errors.push('Single-initiator zone has multiple initiators');
    }
    if (targets.length > 1) {
      errors.push('Single-target zone has multiple targets');
    }
  }

  // Check for WWN format
  for (const member of zoneData.members) {
    if (!/^([0-9a-fA-F]{2}:){7}[0-9a-fA-F]{2}$/.test(member.wwn)) {
      errors.push(`Invalid WWN format: ${member.wwn}`);
    }
  }

  // Warnings for best practices
  if (initiators.length > 4) {
    warnings.push('Zone has many initiators (>4), consider splitting');
  }

  if (targets.length > 8) {
    warnings.push('Zone has many targets (>8), may impact performance');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

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
export const activateZone = async (
  ZoneConfigModel: ModelStatic<Model>,
  zoneId: string,
  transaction?: Transaction,
): Promise<ZoneConfig> => {
  const zone = await ZoneConfigModel.findByPk(zoneId, { transaction });

  if (!zone) {
    throw new Error(`Zone ${zoneId} not found`);
  }

  await zone.update({ active: true, updatedAt: new Date() }, { transaction });

  return zone.toJSON() as ZoneConfig;
};

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
export const deactivateZone = async (
  ZoneConfigModel: ModelStatic<Model>,
  zoneId: string,
  transaction?: Transaction,
): Promise<ZoneConfig> => {
  const zone = await ZoneConfigModel.findByPk(zoneId, { transaction });

  if (!zone) {
    throw new Error(`Zone ${zoneId} not found`);
  }

  await zone.update({ active: false, updatedAt: new Date() }, { transaction });

  return zone.toJSON() as ZoneConfig;
};

// ============================================================================
// LUN DISCOVERY AND QUERIES
// ============================================================================

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
export const discoverLUNs = async (
  LUNModel: ModelStatic<Model>,
  options: LUNDiscoveryOptions = {},
  transaction?: Transaction,
): Promise<LUN[]> => {
  const {
    storagePoolIds,
    minSize,
    maxSize,
    tier,
    status,
    includeMetrics = false,
    includeSnapshots = false,
    includeMappings = false,
  } = options;

  const where: WhereOptions = {};

  if (storagePoolIds && storagePoolIds.length > 0) {
    where.storagePoolId = { [Op.in]: storagePoolIds };
  }

  if (minSize !== undefined) {
    where.size = { ...((where.size as any) || {}), [Op.gte]: minSize };
  }

  if (maxSize !== undefined) {
    where.size = { ...((where.size as any) || {}), [Op.lte]: maxSize };
  }

  if (tier && tier.length > 0) {
    where.tier = { [Op.in]: tier };
  }

  if (status && status.length > 0) {
    where.status = { [Op.in]: status };
  }

  const findOptions: FindOptions = {
    where,
    order: [
      ['tier', 'ASC'],
      ['size', 'DESC'],
    ],
    transaction,
  };

  const luns = await LUNModel.findAll(findOptions);

  return luns.map((lun) => lun.toJSON() as LUN);
};

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
export const findLUNsByIdentifier = async (
  LUNMappingModel: ModelStatic<Model>,
  identifier: string,
  transaction?: Transaction,
): Promise<LUNMapping[]> => {
  const normalizedId = identifier.replace(/[:-]/g, '').toLowerCase();

  const mappings = await LUNMappingModel.findAll({
    where: {
      [Op.or]: [
        { wwn: { [Op.like]: `%${normalizedId}%` } },
        { iqn: { [Op.like]: `%${normalizedId}%` } },
      ],
    },
    transaction,
  });

  return mappings.map((m) => m.toJSON() as LUNMapping);
};

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
export const queryLUNsAdvanced = async (
  LUNModel: ModelStatic<Model>,
  sequelize: Sequelize,
  filters: any,
  transaction?: Transaction,
): Promise<LUN[]> => {
  const where: WhereOptions = {};

  if (filters.allocatedPercent) {
    const allocatedExpr = sequelize.literal(
      '(allocated * 100.0 / NULLIF(size, 0))',
    );

    if (filters.allocatedPercent.min !== undefined) {
      where[Op.and] = [
        ...(((where[Op.and] as any) || []) as any[]),
        sequelize.where(allocatedExpr, Op.gte, filters.allocatedPercent.min),
      ];
    }

    if (filters.allocatedPercent.max !== undefined) {
      where[Op.and] = [
        ...(((where[Op.and] as any) || []) as any[]),
        sequelize.where(allocatedExpr, Op.lte, filters.allocatedPercent.max),
      ];
    }
  }

  if (filters.tier) {
    where.tier = Array.isArray(filters.tier)
      ? { [Op.in]: filters.tier }
      : filters.tier;
  }

  if (filters.compressionEnabled !== undefined) {
    where.compression = filters.compressionEnabled;
  }

  if (filters.ageInDays) {
    const ageDate = new Date();
    ageDate.setDate(ageDate.getDate() - (filters.ageInDays.max || 0));

    if (filters.ageInDays.max !== undefined) {
      where.createdAt = { [Op.gte]: ageDate };
    }
  }

  const luns = await LUNModel.findAll({
    where,
    order: [['createdAt', 'DESC']],
    transaction,
  });

  return luns.map((lun) => lun.toJSON() as LUN);
};

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
export const findOrphanedLUNs = async (
  LUNModel: ModelStatic<Model>,
  LUNMappingModel: ModelStatic<Model>,
  sequelize: Sequelize,
  daysUnmapped: number = 30,
  transaction?: Transaction,
): Promise<LUN[]> => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysUnmapped);

  const orphanedLUNs = await sequelize.query(
    `
    SELECT l.*
    FROM luns l
    LEFT JOIN lun_mappings lm ON l.id = lm.lun_id
    WHERE lm.id IS NULL
      AND l.updated_at < :cutoffDate
      AND l.status != 'offline'
    ORDER BY l.size DESC
  `,
    {
      replacements: { cutoffDate },
      type: QueryTypes.SELECT,
      transaction,
    },
  );

  return orphanedLUNs as LUN[];
};

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

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
export const recordLUNPerformanceMetrics = async (
  LUNPerformanceModel: ModelStatic<Model>,
  metrics: LUNPerformanceMetrics,
  transaction?: Transaction,
): Promise<LUNPerformanceMetrics> => {
  const record = await LUNPerformanceModel.create(metrics as any, {
    transaction,
  });

  return record.toJSON() as LUNPerformanceMetrics;
};

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
export const getAggregatedPerformanceMetrics = async (
  LUNPerformanceModel: ModelStatic<Model>,
  sequelize: Sequelize,
  lunId: string,
  startTime: Date,
  endTime: Date,
  transaction?: Transaction,
): Promise<{
  avgReadIOPS: number;
  avgWriteIOPS: number;
  avgLatency: number;
  maxLatency: number;
  avgUtilization: number;
  peakThroughput: number;
}> => {
  const results = await sequelize.query(
    `
    SELECT
      AVG(read_iops) as avg_read_iops,
      AVG(write_iops) as avg_write_iops,
      AVG(avg_latency) as avg_latency,
      MAX(avg_latency) as max_latency,
      AVG(utilization_percent) as avg_utilization,
      MAX(read_throughput + write_throughput) as peak_throughput
    FROM lun_performance_metrics
    WHERE lun_id = :lunId
      AND timestamp BETWEEN :startTime AND :endTime
  `,
    {
      replacements: { lunId, startTime, endTime },
      type: QueryTypes.SELECT,
      transaction,
    },
  );

  const metrics = results[0] as any;

  return {
    avgReadIOPS: parseFloat(metrics.avg_read_iops) || 0,
    avgWriteIOPS: parseFloat(metrics.avg_write_iops) || 0,
    avgLatency: parseFloat(metrics.avg_latency) || 0,
    maxLatency: parseFloat(metrics.max_latency) || 0,
    avgUtilization: parseFloat(metrics.avg_utilization) || 0,
    peakThroughput: parseFloat(metrics.peak_throughput) || 0,
  };
};

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
export const identifyHotLUNs = async (
  LUNPerformanceModel: ModelStatic<Model>,
  sequelize: Sequelize,
  topN: number = 10,
  transaction?: Transaction,
): Promise<Array<{ lunId: string; avgIOPS: number; avgLatency: number }>> => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const results = await sequelize.query(
    `
    SELECT
      lun_id,
      AVG(read_iops + write_iops) as avg_iops,
      AVG(avg_latency) as avg_latency
    FROM lun_performance_metrics
    WHERE timestamp >= :oneHourAgo
    GROUP BY lun_id
    ORDER BY avg_iops DESC
    LIMIT :topN
  `,
    {
      replacements: { oneHourAgo, topN },
      type: QueryTypes.SELECT,
      transaction,
    },
  );

  return results.map((r: any) => ({
    lunId: r.lun_id,
    avgIOPS: parseFloat(r.avg_iops),
    avgLatency: parseFloat(r.avg_latency),
  }));
};

// ============================================================================
// CAPACITY MANAGEMENT
// ============================================================================

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
export const generateCapacityReport = async (
  LUNModel: ModelStatic<Model>,
  sequelize: Sequelize,
  storagePoolIds?: string[],
  transaction?: Transaction,
): Promise<CapacityReport> => {
  const whereClause = storagePoolIds
    ? `WHERE storage_pool_id IN (:storagePoolIds)`
    : '';

  const results = await sequelize.query(
    `
    SELECT
      SUM(size) as total_capacity,
      SUM(allocated) as allocated_capacity,
      SUM(CASE WHEN thin_provisioned = true THEN size ELSE 0 END) as thin_provisioned_capacity,
      SUM(CASE WHEN compression = true THEN allocated * 0.5 ELSE allocated END) as compressed_used,
      tier,
      SUM(size) as tier_capacity,
      SUM(allocated) as tier_used
    FROM luns
    ${whereClause}
    GROUP BY tier
  `,
    {
      replacements: { storagePoolIds },
      type: QueryTypes.SELECT,
      transaction,
    },
  );

  let totalCapacity = 0;
  let allocatedCapacity = 0;
  let thinProvisionedCapacity = 0;
  let compressedUsed = 0;
  const tierBreakdown: Record<string, { capacity: number; used: number }> = {};

  for (const row of results as any[]) {
    totalCapacity += parseFloat(row.total_capacity) || 0;
    allocatedCapacity += parseFloat(row.allocated_capacity) || 0;
    thinProvisionedCapacity += parseFloat(row.thin_provisioned_capacity) || 0;
    compressedUsed += parseFloat(row.compressed_used) || 0;

    tierBreakdown[row.tier] = {
      capacity: parseFloat(row.tier_capacity) || 0,
      used: parseFloat(row.tier_used) || 0,
    };
  }

  const usedCapacity = allocatedCapacity;
  const freeCapacity = totalCapacity - usedCapacity;
  const oversubscriptionRatio = totalCapacity > 0 ? allocatedCapacity / totalCapacity : 1;
  const thinProvisioningSavings = thinProvisionedCapacity - allocatedCapacity;
  const compressionRatio = allocatedCapacity > 0 ? allocatedCapacity / compressedUsed : 1;

  return {
    totalCapacity,
    allocatedCapacity,
    usedCapacity,
    freeCapacity,
    oversubscriptionRatio,
    thinProvisioningSavings: Math.max(0, thinProvisioningSavings),
    compressionRatio,
    deduplicationRatio: 1.2, // Placeholder - would need actual dedup data
    tierBreakdown,
  };
};

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
export const predictCapacityExhaustion = async (
  LUNModel: ModelStatic<Model>,
  sequelize: Sequelize,
  storagePoolId: string,
  maxCapacity: number,
  transaction?: Transaction,
): Promise<{
  exhaustionDate: Date | null;
  daysRemaining: number;
  growthRateGB: number;
}> => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const results = await sequelize.query(
    `
    SELECT
      DATE(created_at) as date,
      SUM(allocated) as daily_allocated
    FROM luns
    WHERE storage_pool_id = :storagePoolId
      AND created_at >= :thirtyDaysAgo
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `,
    {
      replacements: { storagePoolId, thirtyDaysAgo },
      type: QueryTypes.SELECT,
      transaction,
    },
  );

  if (results.length < 7) {
    return {
      exhaustionDate: null,
      daysRemaining: -1,
      growthRateGB: 0,
    };
  }

  // Calculate daily growth rate
  const allocations = (results as any[]).map((r) => parseFloat(r.daily_allocated));
  const totalGrowth = allocations.reduce((sum, val) => sum + val, 0);
  const avgDailyGrowth = totalGrowth / allocations.length;

  // Get current allocated
  const currentAllocated = await LUNModel.sum('allocated', {
    where: { storagePoolId },
    transaction,
  });

  const remainingCapacity = maxCapacity - (currentAllocated || 0);

  if (avgDailyGrowth <= 0) {
    return {
      exhaustionDate: null,
      daysRemaining: -1,
      growthRateGB: avgDailyGrowth,
    };
  }

  const daysRemaining = Math.floor(remainingCapacity / avgDailyGrowth);
  const exhaustionDate = new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000);

  return {
    exhaustionDate,
    daysRemaining,
    growthRateGB: avgDailyGrowth,
  };
};

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
export const reclaimUnusedCapacity = async (
  LUNModel: ModelStatic<Model>,
  storagePoolId: string,
  thresholdPercent: number = 50,
  transaction?: Transaction,
): Promise<{ reclaimedGB: number; lunsProcessed: number }> => {
  const luns = await LUNModel.findAll({
    where: {
      storagePoolId,
      thinProvisioned: true,
    },
    transaction,
  });

  let reclaimedGB = 0;
  let lunsProcessed = 0;

  for (const lun of luns) {
    const lunData = lun.toJSON() as any;
    const utilizationPercent = (lunData.allocated / lunData.size) * 100;

    if (utilizationPercent < thresholdPercent) {
      // Simulate reclamation (in real implementation, this would trigger storage controller API)
      const reclaimAmount = lunData.allocated * 0.1; // Reclaim 10% as example
      const newAllocated = Math.max(0, lunData.allocated - reclaimAmount);

      await lun.update({ allocated: newAllocated }, { transaction });

      reclaimedGB += reclaimAmount;
      lunsProcessed++;
    }
  }

  return {
    reclaimedGB: Math.round(reclaimedGB * 100) / 100,
    lunsProcessed,
  };
};

// ============================================================================
// SNAPSHOT OPERATIONS
// ============================================================================

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
export const createLUNSnapshot = async (
  LUNSnapshotModel: ModelStatic<Model>,
  LUNModel: ModelStatic<Model>,
  lunId: string,
  snapshotName: string,
  retentionDays: number = 30,
  description?: string,
  transaction?: Transaction,
): Promise<LUNSnapshot> => {
  const lun = await LUNModel.findByPk(lunId, { transaction });

  if (!lun) {
    throw new Error(`LUN ${lunId} not found`);
  }

  const lunData = lun.toJSON() as any;

  const snapshot = await LUNSnapshotModel.create(
    {
      lunId,
      snapshotName,
      size: lunData.allocated, // Snapshot size is actual allocated space
      description,
      retentionDays,
      status: 'active',
    } as any,
    { transaction },
  );

  return snapshot.toJSON() as LUNSnapshot;
};

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
export const restoreLUNFromSnapshot = async (
  LUNModel: ModelStatic<Model>,
  LUNSnapshotModel: ModelStatic<Model>,
  snapshotId: string,
  transaction?: Transaction,
): Promise<{ success: boolean; lunId: string }> => {
  const snapshot = await LUNSnapshotModel.findByPk(snapshotId, { transaction });

  if (!snapshot) {
    throw new Error(`Snapshot ${snapshotId} not found`);
  }

  const snapshotData = snapshot.toJSON() as any;

  if (snapshotData.status !== 'active') {
    throw new Error(`Snapshot ${snapshotId} is not active (status: ${snapshotData.status})`);
  }

  const lun = await LUNModel.findByPk(snapshotData.lunId, { transaction });

  if (!lun) {
    throw new Error(`LUN ${snapshotData.lunId} not found`);
  }

  // In real implementation, this would trigger storage controller restore API
  await lun.update(
    {
      updatedAt: new Date(),
      metadata: {
        ...(lun as any).metadata,
        lastRestored: new Date(),
        restoredFromSnapshot: snapshotId,
      },
    },
    { transaction },
  );

  return {
    success: true,
    lunId: snapshotData.lunId,
  };
};

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
export const purgeExpiredSnapshots = async (
  LUNSnapshotModel: ModelStatic<Model>,
  transaction?: Transaction,
): Promise<{ purgedCount: number; reclaimedGB: number }> => {
  const now = new Date();

  const expiredSnapshots = await LUNSnapshotModel.findAll({
    where: {
      status: 'active',
      createdAt: {
        [Op.lt]: sequelize.literal(
          `DATE_SUB(NOW(), INTERVAL retention_days DAY)`,
        ),
      },
    },
    transaction,
  });

  let reclaimedGB = 0;

  for (const snapshot of expiredSnapshots) {
    const snapshotData = snapshot.toJSON() as any;
    reclaimedGB += snapshotData.size;

    await snapshot.update({ status: 'expired' }, { transaction });
  }

  return {
    purgedCount: expiredSnapshots.length,
    reclaimedGB: Math.round(reclaimedGB * 100) / 100,
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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
export const generateWWID = (): string => {
  const timestamp = Date.now().toString(16);
  const random = Math.random().toString(16).substring(2, 18);
  return `naa.600508b1001c${timestamp}${random}`.substring(0, 40);
};

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
export const validateWWN = (wwn: string): boolean => {
  return /^([0-9a-fA-F]{2}:){7}[0-9a-fA-F]{2}$/.test(wwn);
};

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
export const validateIQN = (iqn: string): boolean => {
  return /^iqn\.\d{4}-\d{2}\.[a-z0-9.-]+:[a-z0-9._-]+$/i.test(iqn);
};

export default {
  // Provisioning and lifecycle
  provisionLUN,
  expandLUN,
  deleteLUN,
  cloneLUN,

  // Masking and mapping
  maskLUNToHosts,
  unmaskLUNFromHosts,
  getLUNMappings,
  updateLUNAccessMode,

  // Multipathing
  configureMultipathing,
  registerLUNPaths,
  monitorPathHealth,
  performPathFailover,
  balanceIOAcrossPaths,

  // Zoning
  createZone,
  validateZoneConfig,
  activateZone,
  deactivateZone,

  // Discovery and queries
  discoverLUNs,
  findLUNsByIdentifier,
  queryLUNsAdvanced,
  findOrphanedLUNs,

  // Performance monitoring
  recordLUNPerformanceMetrics,
  getAggregatedPerformanceMetrics,
  identifyHotLUNs,

  // Capacity management
  generateCapacityReport,
  predictCapacityExhaustion,
  reclaimUnusedCapacity,

  // Snapshot operations
  createLUNSnapshot,
  restoreLUNFromSnapshot,
  purgeExpiredSnapshots,

  // Utilities
  generateWWID,
  validateWWN,
  validateIQN,
};
