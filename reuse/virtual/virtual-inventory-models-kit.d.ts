/**
 * LOC: I1N2V3E4N5
 * File: /reuse/virtual/virtual-inventory-models-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/validator (v13.x)
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Virtual inventory services
 *   - VMware vRealize integration
 *   - Template management
 */
/**
 * File: /reuse/virtual/virtual-inventory-models-kit.ts
 * Locator: WC-UTL-VIRT-INV-001
 * Purpose: Virtual Inventory Models Kit - Resource pools, folders, templates, snapshots for VMware vRealize
 *
 * Upstream: sequelize v6.x, @types/validator, crypto
 * Downstream: Virtual inventory management, template provisioning, snapshot management
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 40 model utilities for resource pools, folders, templates, snapshots with soft deletes and temporal tracking
 *
 * LLM Context: Production-grade Sequelize v6.x virtual inventory model kit for White Cross healthcare platform.
 * Provides comprehensive models for VMware vRealize inventory management including resource pools, organizational folders,
 * VM templates, and snapshots. HIPAA-compliant with soft deletes, temporal tracking, audit trails, and encrypted data.
 */
import { ModelStatic, Sequelize, ModelOptions, FindOptions, WhereOptions } from 'sequelize';
/**
 * Resource pool share level
 */
export type ShareLevel = 'low' | 'normal' | 'high' | 'custom';
/**
 * Snapshot state
 */
export type SnapshotState = 'creating' | 'ready' | 'reverting' | 'deleting' | 'error';
/**
 * Template provisioning type
 */
export type ProvisioningType = 'thin' | 'thick' | 'eagerZeroedThick';
/**
 * Folder type
 */
export type FolderType = 'vm' | 'host' | 'datastore' | 'network' | 'root';
/**
 * Inventory item type
 */
export type InventoryItemType = 'vm' | 'host' | 'cluster' | 'datastore' | 'network' | 'resourcePool' | 'folder' | 'datacenter';
/**
 * Resource allocation shares
 */
export interface ResourceShares {
    level: ShareLevel;
    shares: number;
}
/**
 * Resource allocation spec
 */
export interface ResourceAllocationSpec {
    cpuAllocation: {
        shares: ResourceShares;
        reservation: number;
        limit: number;
        expandableReservation: boolean;
    };
    memoryAllocation: {
        shares: ResourceShares;
        reservation: number;
        limit: number;
        expandableReservation: boolean;
    };
}
/**
 * Snapshot tree node
 */
export interface SnapshotTreeNode {
    id: string;
    name: string;
    description: string;
    createTime: Date;
    state: SnapshotState;
    quiesced: boolean;
    children: SnapshotTreeNode[];
}
/**
 * Template customization spec
 */
export interface CustomizationSpec {
    name: string;
    type: 'windows' | 'linux';
    hostname?: string;
    domain?: string;
    timezone?: string;
    adminPassword?: string;
    networkSettings?: object;
}
/**
 * Inventory change tracking
 */
export interface InventoryChange {
    timestamp: Date;
    operation: 'CREATE' | 'UPDATE' | 'DELETE' | 'MOVE';
    userId: string;
    fromValue?: any;
    toValue?: any;
    reason?: string;
}
/**
 * Creates a comprehensive Resource Pool model.
 * Tracks resource allocation pools with CPU/memory shares.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Resource Pool model
 *
 * @example
 * ```typescript
 * const ResourcePool = createResourcePoolModel(sequelize, 'ResourcePool', {
 *   paranoid: true
 * });
 *
 * const pool = await ResourcePool.create({
 *   name: 'Production-Pool',
 *   moRef: 'resgroup-123',
 *   cpuReservationMhz: 10000,
 *   cpuLimitMhz: 50000,
 *   memoryReservationMB: 16384,
 *   memoryLimitMB: 65536,
 *   clusterId: 'cluster-uuid'
 * });
 * ```
 */
export declare function createResourcePoolModel(sequelize: Sequelize, modelName: string, options?: Partial<ModelOptions<any>>): ModelStatic<any>;
/**
 * Creates a Resource Pool History model for temporal tracking.
 * Maintains complete change history for compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ModelStatic<any>} sourceModel - Source resource pool model
 * @returns {ModelStatic<any>} Resource Pool History model
 *
 * @example
 * ```typescript
 * const PoolHistory = createResourcePoolHistoryModel(sequelize, ResourcePool);
 *
 * const history = await PoolHistory.findAll({
 *   where: { originalId: poolId },
 *   order: [['validFrom', 'DESC']]
 * });
 * ```
 */
export declare function createResourcePoolHistoryModel(sequelize: Sequelize, sourceModel: ModelStatic<any>): ModelStatic<any>;
/**
 * Adds resource pool scopes for common queries.
 *
 * @param {ModelStatic<any>} model - Resource Pool model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addResourcePoolScopes(ResourcePool);
 * const rootPools = await ResourcePool.scope('root').findAll();
 * ```
 */
export declare function addResourcePoolScopes(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Creates a comprehensive Folder model for organizational hierarchy.
 * Tracks vSphere folders with hierarchical structure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Folder model
 *
 * @example
 * ```typescript
 * const Folder = createFolderModel(sequelize, 'Folder', {
 *   paranoid: true
 * });
 *
 * const folder = await Folder.create({
 *   name: 'Production VMs',
 *   moRef: 'group-v123',
 *   type: 'vm',
 *   parentId: 'root-folder-id'
 * });
 * ```
 */
export declare function createFolderModel(sequelize: Sequelize, modelName: string, options?: Partial<ModelOptions<any>>): ModelStatic<any>;
/**
 * Adds folder scopes for common queries.
 *
 * @param {ModelStatic<any>} model - Folder model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addFolderScopes(Folder);
 * const vmFolders = await Folder.scope('vmFolders').findAll();
 * ```
 */
export declare function addFolderScopes(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Creates a comprehensive VM Template model.
 * Tracks VM templates for rapid provisioning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Template model
 *
 * @example
 * ```typescript
 * const Template = createTemplateModel(sequelize, 'Template', {
 *   paranoid: true
 * });
 *
 * const template = await Template.create({
 *   name: 'Windows-Server-2022-Template',
 *   moRef: 'vm-template-123',
 *   guestOS: 'windows2022srv_64Guest',
 *   numCPU: 4,
 *   memoryMB: 16384,
 *   provisioningType: 'thin'
 * });
 * ```
 */
export declare function createTemplateModel(sequelize: Sequelize, modelName: string, options?: Partial<ModelOptions<any>>): ModelStatic<any>;
/**
 * Adds template scopes for common queries.
 *
 * @param {ModelStatic<any>} model - Template model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addTemplateScopes(Template);
 * const publishedTemplates = await Template.scope('published').findAll();
 * ```
 */
export declare function addTemplateScopes(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Creates a comprehensive Snapshot model.
 * Tracks VM snapshots with hierarchical tree structure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Snapshot model
 *
 * @example
 * ```typescript
 * const Snapshot = createSnapshotModel(sequelize, 'Snapshot', {
 *   paranoid: true
 * });
 *
 * const snapshot = await Snapshot.create({
 *   name: 'Before-Upgrade',
 *   moRef: 'snapshot-123',
 *   vmId: 'vm-uuid',
 *   description: 'Snapshot before OS upgrade',
 *   state: 'ready',
 *   quiesced: true
 * });
 * ```
 */
export declare function createSnapshotModel(sequelize: Sequelize, modelName: string, options?: Partial<ModelOptions<any>>): ModelStatic<any>;
/**
 * Adds snapshot scopes for common queries.
 *
 * @param {ModelStatic<any>} model - Snapshot model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addSnapshotScopes(Snapshot);
 * const currentSnapshots = await Snapshot.scope('current').findAll();
 * ```
 */
export declare function addSnapshotScopes(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Creates a comprehensive Inventory Item model.
 * Generic inventory tracking for all vCenter objects.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the model
 * @param {Partial<ModelOptions<any>>} options - Additional model options
 * @returns {ModelStatic<any>} Inventory Item model
 *
 * @example
 * ```typescript
 * const InventoryItem = createInventoryItemModel(sequelize, 'InventoryItem');
 *
 * const item = await InventoryItem.create({
 *   moRef: 'vm-123',
 *   type: 'vm',
 *   name: 'web-server-01',
 *   parentId: 'folder-uuid',
 *   discoveredAt: new Date()
 * });
 * ```
 */
export declare function createInventoryItemModel(sequelize: Sequelize, modelName: string, options?: Partial<ModelOptions<any>>): ModelStatic<any>;
/**
 * Adds inventory item scopes.
 *
 * @param {ModelStatic<any>} model - Inventory Item model
 * @returns {ModelStatic<any>} Model with scopes
 *
 * @example
 * ```typescript
 * addInventoryItemScopes(InventoryItem);
 * const orphanedItems = await InventoryItem.scope('orphaned').findAll();
 * ```
 */
export declare function addInventoryItemScopes(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Adds soft delete functionality to inventory models.
 * Configures paranoid mode with deletedAt tracking.
 *
 * @param {ModelStatic<any>} model - Model to add soft delete
 * @returns {ModelStatic<any>} Model with soft delete
 *
 * @example
 * ```typescript
 * addSoftDelete(Template);
 *
 * await template.destroy();  // Soft delete
 * await template.destroy({ force: true });  // Hard delete
 * ```
 */
export declare function addSoftDelete(model: ModelStatic<any>): ModelStatic<any>;
/**
 * Restores a soft-deleted inventory item.
 * Sets deletedAt to null.
 *
 * @param {any} instance - Instance to restore
 * @returns {Promise<any>} Restored instance
 *
 * @example
 * ```typescript
 * const template = await Template.findByPk(id, { paranoid: false });
 * await restoreSoftDeleted(template);
 * ```
 */
export declare function restoreSoftDeleted(instance: any): Promise<any>;
/**
 * Finds all soft-deleted items.
 * Queries with paranoid: false.
 *
 * @param {ModelStatic<any>} model - Model to query
 * @param {FindOptions} options - Additional options
 * @returns {Promise<any[]>} Soft-deleted items
 *
 * @example
 * ```typescript
 * const deleted = await findSoftDeleted(Template);
 * ```
 */
export declare function findSoftDeleted(model: ModelStatic<any>, options?: FindOptions): Promise<any[]>;
/**
 * Bulk restores multiple soft-deleted items.
 *
 * @param {ModelStatic<any>} model - Model to restore
 * @param {WhereOptions} where - Conditions
 * @returns {Promise<number>} Number of restored items
 *
 * @example
 * ```typescript
 * const count = await bulkRestore(Template, {
 *   deleted_at: { [Op.gte]: new Date('2024-01-01') }
 * });
 * ```
 */
export declare function bulkRestore(model: ModelStatic<any>, where: WhereOptions): Promise<number>;
/**
 * Adds temporal tracking hooks to a model.
 * Automatically creates history records on changes.
 *
 * @param {ModelStatic<any>} model - Source model
 * @param {ModelStatic<any>} historyModel - History model
 * @returns {ModelStatic<any>} Model with temporal tracking
 *
 * @example
 * ```typescript
 * addTemporalTracking(ResourcePool, ResourcePoolHistory);
 *
 * // All changes now tracked automatically
 * await pool.update({ cpuLimitMhz: 60000 });
 * ```
 */
export declare function addTemporalTracking(model: ModelStatic<any>, historyModel: ModelStatic<any>): ModelStatic<any>;
/**
 * Retrieves temporal history for an item.
 * Gets all historical versions.
 *
 * @param {ModelStatic<any>} historyModel - History model
 * @param {string} itemId - Item ID
 * @param {FindOptions} options - Additional options
 * @returns {Promise<any[]>} Historical records
 *
 * @example
 * ```typescript
 * const history = await getTemporalHistory(ResourcePoolHistory, poolId, {
 *   order: [['validFrom', 'DESC']],
 *   limit: 10
 * });
 * ```
 */
export declare function getTemporalHistory(historyModel: ModelStatic<any>, itemId: string, options?: FindOptions): Promise<any[]>;
/**
 * Gets item state at a specific point in time.
 * Temporal query for historical state.
 *
 * @param {ModelStatic<any>} historyModel - History model
 * @param {string} itemId - Item ID
 * @param {Date} timestamp - Point in time
 * @returns {Promise<any | null>} Historical state
 *
 * @example
 * ```typescript
 * const state = await getTemporalState(
 *   ResourcePoolHistory,
 *   poolId,
 *   new Date('2024-01-01')
 * );
 * ```
 */
export declare function getTemporalState(historyModel: ModelStatic<any>, itemId: string, timestamp: Date): Promise<any | null>;
/**
 * Defines associations for inventory models.
 *
 * @param {object} models - All inventory models
 * @returns {void}
 *
 * @example
 * ```typescript
 * defineInventoryAssociations({
 *   ResourcePool,
 *   Folder,
 *   Template,
 *   Snapshot
 * });
 * ```
 */
export declare function defineInventoryAssociations(models: {
    ResourcePool: ModelStatic<any>;
    Folder: ModelStatic<any>;
    Template?: ModelStatic<any>;
    Snapshot?: ModelStatic<any>;
}): void;
/**
 * Builds snapshot tree for a VM.
 * Constructs hierarchical snapshot structure.
 *
 * @param {ModelStatic<any>} model - Snapshot model
 * @param {string} vmId - VM ID
 * @returns {Promise<SnapshotTreeNode[]>} Snapshot tree
 *
 * @example
 * ```typescript
 * const tree = await buildSnapshotTree(Snapshot, vmId);
 * console.log(JSON.stringify(tree, null, 2));
 * ```
 */
export declare function buildSnapshotTree(model: ModelStatic<any>, vmId: string): Promise<SnapshotTreeNode[]>;
/**
 * Finds templates by criteria with deployment stats.
 *
 * @param {ModelStatic<any>} model - Template model
 * @param {object} criteria - Search criteria
 * @returns {Promise<any[]>} Matching templates
 *
 * @example
 * ```typescript
 * const templates = await findTemplates(Template, {
 *   guestOSType: 'linux',
 *   isPublished: true,
 *   minDeployments: 5
 * });
 * ```
 */
export declare function findTemplates(model: ModelStatic<any>, criteria: {
    guestOSType?: string;
    isPublished?: boolean;
    isApproved?: boolean;
    minDeployments?: number;
    maxDeployments?: number;
}): Promise<any[]>;
/**
 * Finds expired snapshots for cleanup.
 *
 * @param {ModelStatic<any>} model - Snapshot model
 * @param {Date} beforeDate - Cutoff date
 * @returns {Promise<any[]>} Expired snapshots
 *
 * @example
 * ```typescript
 * const expired = await findExpiredSnapshots(Snapshot, new Date());
 * for (const snap of expired) {
 *   await snap.destroy();
 * }
 * ```
 */
export declare function findExpiredSnapshots(model: ModelStatic<any>, beforeDate?: Date): Promise<any[]>;
/**
 * Calculates resource pool utilization.
 *
 * @param {ModelStatic<any>} poolModel - Resource Pool model
 * @param {string} poolId - Pool ID
 * @returns {Promise<object>} Utilization statistics
 *
 * @example
 * ```typescript
 * const stats = await calculatePoolUtilization(ResourcePool, poolId);
 * console.log(stats.cpuUtilization, stats.memoryUtilization);
 * ```
 */
export declare function calculatePoolUtilization(poolModel: ModelStatic<any>, poolId: string): Promise<{
    cpuReservationMhz: number;
    cpuLimitMhz: number;
    memoryReservationMB: number;
    memoryLimitMB: number;
    vmCount: number;
    childPoolCount: number;
}>;
/**
 * Exports inventory to JSON format.
 *
 * @param {object} models - All inventory models
 * @returns {Promise<object>} Inventory snapshot
 *
 * @example
 * ```typescript
 * const inventory = await exportInventory({
 *   ResourcePool,
 *   Folder,
 *   Template,
 *   Snapshot
 * });
 * ```
 */
export declare function exportInventory(models: {
    ResourcePool: ModelStatic<any>;
    Folder: ModelStatic<any>;
    Template: ModelStatic<any>;
    Snapshot: ModelStatic<any>;
}): Promise<{
    timestamp: Date;
    resourcePools: any[];
    folders: any[];
    templates: any[];
    snapshots: any[];
    summary: object;
}>;
/**
 * Validates folder hierarchy integrity.
 *
 * @param {ModelStatic<any>} model - Folder model
 * @returns {Promise<object>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateFolderHierarchy(Folder);
 * if (!validation.isValid) {
 *   console.error(validation.errors);
 * }
 * ```
 */
export declare function validateFolderHierarchy(model: ModelStatic<any>): Promise<{
    isValid: boolean;
    errors: string[];
}>;
/**
 * Cleans up orphaned inventory items.
 *
 * @param {ModelStatic<any>} model - Inventory Item model
 * @param {number} daysOld - Days since last seen
 * @returns {Promise<number>} Number of items deleted
 *
 * @example
 * ```typescript
 * const deleted = await cleanupOrphanedItems(InventoryItem, 30);
 * console.log(`Deleted ${deleted} orphaned items`);
 * ```
 */
export declare function cleanupOrphanedItems(model: ModelStatic<any>, daysOld?: number): Promise<number>;
//# sourceMappingURL=virtual-inventory-models-kit.d.ts.map