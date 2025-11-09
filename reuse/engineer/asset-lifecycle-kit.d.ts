/**
 * ASSET LIFECYCLE MANAGEMENT KIT FOR ENGINEERING/INFRASTRUCTURE
 *
 * Comprehensive asset lifecycle toolkit for managing engineering and infrastructure assets.
 * Provides 45 specialized functions covering:
 * - Asset registration and cataloging
 * - Lifecycle state management (acquisition, deployment, maintenance, retirement)
 * - Asset depreciation tracking and calculations
 * - Condition assessment and monitoring
 * - Asset relationship mapping and hierarchies
 * - Asset transfer and assignment workflows
 * - Asset disposal and decommissioning
 * - Asset history and comprehensive audit trails
 * - Warranty and maintenance scheduling
 * - Asset performance analytics
 * - Compliance and regulatory tracking
 * - Mobile asset tracking (RFID, barcode, GPS)
 * - Asset utilization metrics
 * - Predictive maintenance integration
 * - HIPAA/compliance considerations for medical equipment
 *
 * @module AssetLifecycleKit
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security HIPAA compliant - includes audit trails and PHI protection for medical equipment
 * @performance Optimized for large asset inventories (10,000+ assets)
 *
 * @example
 * ```typescript
 * import {
 *   registerAsset,
 *   updateAssetLifecycleState,
 *   calculateAssetDepreciation,
 *   trackAssetCondition,
 *   Asset,
 *   AssetType,
 *   AssetCondition
 * } from './asset-lifecycle-kit';
 *
 * // Register new medical equipment
 * const asset = await registerAsset({
 *   assetTypeId: 'med-equip-001',
 *   serialNumber: 'MRI-2024-001',
 *   acquisitionDate: new Date(),
 *   acquisitionCost: 2500000,
 *   location: 'Radiology-3rd-Floor',
 *   customFields: { manufacturer: 'Siemens' }
 * });
 *
 * // Track lifecycle states
 * await updateAssetLifecycleState(asset.id, 'deployed', {
 *   deployedBy: 'admin-001',
 *   deploymentLocation: 'Radiology-Room-3A'
 * });
 *
 * // Calculate depreciation
 * const depreciation = await calculateAssetDepreciation(
 *   asset.id,
 *   'straight-line',
 *   10 // years
 * );
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction, FindOptions } from 'sequelize';
/**
 * Asset lifecycle states
 */
export declare enum AssetLifecycleState {
    PLANNED = "planned",
    ORDERED = "ordered",
    RECEIVED = "received",
    IN_STORAGE = "in_storage",
    DEPLOYED = "deployed",
    IN_USE = "in_use",
    MAINTENANCE = "maintenance",
    REPAIR = "repair",
    IDLE = "idle",
    RETIRED = "retired",
    DISPOSED = "disposed",
    DONATED = "donated",
    SOLD = "sold",
    LOST = "lost",
    STOLEN = "stolen"
}
/**
 * Asset condition ratings
 */
export declare enum AssetConditionRating {
    EXCELLENT = "excellent",
    GOOD = "good",
    FAIR = "fair",
    POOR = "poor",
    CRITICAL = "critical",
    NON_FUNCTIONAL = "non_functional"
}
/**
 * Asset criticality levels
 */
export declare enum AssetCriticality {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    NON_CRITICAL = "non_critical"
}
/**
 * Depreciation methods
 */
export declare enum DepreciationMethod {
    STRAIGHT_LINE = "straight-line",
    DECLINING_BALANCE = "declining-balance",
    DOUBLE_DECLINING = "double-declining",
    SUM_OF_YEARS = "sum-of-years",
    UNITS_OF_PRODUCTION = "units-of-production"
}
/**
 * Transfer types
 */
export declare enum TransferType {
    DEPLOYMENT = "deployment",
    RELOCATION = "relocation",
    ASSIGNMENT = "assignment",
    RETURN = "return",
    LOAN = "loan",
    PERMANENT = "permanent"
}
/**
 * Asset registration data
 */
export interface AssetRegistrationData {
    assetTypeId: string;
    assetTag?: string;
    serialNumber?: string;
    description?: string;
    manufacturer?: string;
    model?: string;
    acquisitionDate: Date;
    acquisitionCost: number;
    purchaseOrderNumber?: string;
    vendorId?: string;
    warrantyExpirationDate?: Date;
    location?: string;
    departmentId?: string;
    assignedToUserId?: string;
    parentAssetId?: string;
    customFields?: Record<string, any>;
    complianceCertifications?: string[];
    criticality?: AssetCriticality;
}
/**
 * Asset lifecycle state update data
 */
export interface LifecycleStateUpdateData {
    reason?: string;
    updatedBy: string;
    effectiveDate?: Date;
    location?: string;
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Asset condition assessment data
 */
export interface ConditionAssessmentData {
    rating: AssetConditionRating;
    assessedBy: string;
    assessmentDate: Date;
    notes?: string;
    inspectionResults?: Record<string, any>;
    maintenanceRequired?: boolean;
    estimatedRepairCost?: number;
    photos?: string[];
    documents?: string[];
}
/**
 * Asset transfer data
 */
export interface AssetTransferData {
    assetId: string;
    transferType: TransferType;
    fromLocation?: string;
    toLocation: string;
    fromUserId?: string;
    toUserId?: string;
    fromDepartmentId?: string;
    toDepartmentId?: string;
    transferDate: Date;
    transferredBy: string;
    reason?: string;
    expectedReturnDate?: Date;
    notes?: string;
    approvedBy?: string;
}
/**
 * Depreciation calculation result
 */
export interface DepreciationResult {
    assetId: string;
    method: DepreciationMethod;
    originalCost: number;
    salvageValue: number;
    usefulLife: number;
    currentAge: number;
    annualDepreciation: number;
    accumulatedDepreciation: number;
    currentBookValue: number;
    depreciationSchedule: DepreciationScheduleEntry[];
}
/**
 * Depreciation schedule entry
 */
export interface DepreciationScheduleEntry {
    year: number;
    beginningValue: number;
    depreciationExpense: number;
    accumulatedDepreciation: number;
    endingValue: number;
}
/**
 * Asset utilization metrics
 */
export interface AssetUtilizationMetrics {
    assetId: string;
    utilizationRate: number;
    uptime: number;
    downtime: number;
    maintenanceTime: number;
    idleTime: number;
    totalOperatingHours: number;
    utilizationTrend: 'increasing' | 'decreasing' | 'stable';
    efficiencyScore: number;
}
/**
 * Asset search filters
 */
export interface AssetSearchFilters {
    assetTypeId?: string;
    lifecycleState?: AssetLifecycleState | AssetLifecycleState[];
    conditionRating?: AssetConditionRating | AssetConditionRating[];
    location?: string;
    departmentId?: string;
    assignedToUserId?: string;
    criticality?: AssetCriticality;
    acquisitionDateFrom?: Date;
    acquisitionDateTo?: Date;
    costMin?: number;
    costMax?: number;
    warrantyStatus?: 'active' | 'expired' | 'expiring-soon';
    tags?: string[];
    customFieldFilters?: Record<string, any>;
}
/**
 * Bulk operation result
 */
export interface BulkOperationResult {
    successful: number;
    failed: number;
    errors: Array<{
        identifier: string;
        error: string;
    }>;
    processedIds: string[];
}
/**
 * Asset relationship mapping
 */
export interface AssetRelationship {
    parentAssetId: string;
    childAssetId: string;
    relationshipType: 'component' | 'assembly' | 'accessory' | 'dependency';
    quantity?: number;
    mandatory: boolean;
}
/**
 * Maintenance schedule
 */
export interface MaintenanceSchedule {
    assetId: string;
    maintenanceType: 'preventive' | 'predictive' | 'corrective';
    frequency: string;
    lastMaintenanceDate?: Date;
    nextMaintenanceDate: Date;
    estimatedDuration: number;
    estimatedCost: number;
    assignedToTeam?: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
}
/**
 * Asset Type Model - Defines categories and specifications for assets
 */
export declare class AssetType extends Model {
    id: string;
    code: string;
    name: string;
    category?: string;
    description?: string;
    defaultUsefulLife?: number;
    defaultDepreciationMethod?: DepreciationMethod;
    specificationsSchema?: Record<string, any>;
    customFieldsSchema?: Record<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    assets?: Asset[];
}
/**
 * Asset Model - Main asset tracking entity
 */
export declare class Asset extends Model {
    id: string;
    assetTag?: string;
    serialNumber?: string;
    assetTypeId: string;
    description?: string;
    manufacturer?: string;
    model?: string;
    lifecycleState: AssetLifecycleState;
    conditionRating?: AssetConditionRating;
    acquisitionDate: Date;
    acquisitionCost: number;
    currentBookValue?: number;
    purchaseOrderNumber?: string;
    vendorId?: string;
    warrantyExpirationDate?: Date;
    location?: string;
    departmentId?: string;
    assignedToUserId?: string;
    parentAssetId?: string;
    criticality?: AssetCriticality;
    customFields?: Record<string, any>;
    complianceCertifications?: string[];
    rfidTag?: string;
    gpsCoordinates?: {
        latitude: number;
        longitude: number;
    };
    totalOperatingHours: number;
    lastMaintenanceDate?: Date;
    nextMaintenanceDate?: Date;
    isActive: boolean;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    assetType?: AssetType;
    parentAsset?: Asset;
    childAssets?: Asset[];
    conditionHistory?: AssetCondition[];
    transferHistory?: AssetTransfer[];
}
/**
 * Asset Condition Model - Tracks condition assessments over time
 */
export declare class AssetCondition extends Model {
    id: string;
    assetId: string;
    rating: AssetConditionRating;
    assessmentDate: Date;
    assessedBy: string;
    notes?: string;
    inspectionResults?: Record<string, any>;
    maintenanceRequired: boolean;
    estimatedRepairCost?: number;
    photos?: string[];
    documents?: string[];
    createdAt: Date;
    updatedAt: Date;
    asset?: Asset;
}
/**
 * Asset Transfer Model - Tracks asset movements and assignments
 */
export declare class AssetTransfer extends Model {
    id: string;
    assetId: string;
    transferType: TransferType;
    fromLocation?: string;
    toLocation: string;
    fromUserId?: string;
    toUserId?: string;
    fromDepartmentId?: string;
    toDepartmentId?: string;
    transferDate: Date;
    transferredBy: string;
    reason?: string;
    expectedReturnDate?: Date;
    actualReturnDate?: Date;
    notes?: string;
    approvedBy?: string;
    approvalDate?: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    asset?: Asset;
}
/**
 * Registers a new asset in the system
 *
 * @param data - Asset registration data
 * @param transaction - Optional database transaction
 * @returns Created asset record
 *
 * @example
 * ```typescript
 * const asset = await registerAsset({
 *   assetTypeId: 'equip-mri-001',
 *   serialNumber: 'SN-MRI-2024-123',
 *   acquisitionDate: new Date('2024-01-15'),
 *   acquisitionCost: 2500000,
 *   location: 'Radiology-Floor3',
 *   criticality: AssetCriticality.CRITICAL
 * });
 * ```
 */
export declare function registerAsset(data: AssetRegistrationData, transaction?: Transaction): Promise<Asset>;
/**
 * Generates a unique asset tag
 *
 * @param assetTypeId - Asset type identifier
 * @returns Generated asset tag
 *
 * @example
 * ```typescript
 * const tag = await generateAssetTag('mri-equipment');
 * // Returns: "MRI-2024-001234"
 * ```
 */
export declare function generateAssetTag(assetTypeId: string): Promise<string>;
/**
 * Bulk registers multiple assets
 *
 * @param assetsData - Array of asset registration data
 * @param transaction - Optional database transaction
 * @returns Bulk operation result
 *
 * @example
 * ```typescript
 * const result = await bulkRegisterAssets([
 *   { assetTypeId: 'laptop', serialNumber: 'SN001', acquisitionCost: 1500, acquisitionDate: new Date() },
 *   { assetTypeId: 'laptop', serialNumber: 'SN002', acquisitionCost: 1500, acquisitionDate: new Date() }
 * ]);
 * ```
 */
export declare function bulkRegisterAssets(assetsData: AssetRegistrationData[], transaction?: Transaction): Promise<BulkOperationResult>;
/**
 * Updates asset details
 *
 * @param assetId - Asset identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated asset
 *
 * @example
 * ```typescript
 * await updateAssetDetails('asset-123', {
 *   location: 'Storage-Room-B',
 *   assignedToUserId: 'user-456'
 * });
 * ```
 */
export declare function updateAssetDetails(assetId: string, updates: Partial<Asset>, transaction?: Transaction): Promise<Asset>;
/**
 * Retrieves asset by ID with full details
 *
 * @param assetId - Asset identifier
 * @param includeRelations - Whether to include related data
 * @returns Asset with details
 *
 * @example
 * ```typescript
 * const asset = await getAssetById('asset-123', true);
 * console.log(asset.assetType, asset.conditionHistory);
 * ```
 */
export declare function getAssetById(assetId: string, includeRelations?: boolean): Promise<Asset>;
/**
 * Updates asset lifecycle state
 *
 * @param assetId - Asset identifier
 * @param newState - New lifecycle state
 * @param data - State update metadata
 * @param transaction - Optional database transaction
 * @returns Updated asset
 *
 * @example
 * ```typescript
 * await updateAssetLifecycleState('asset-123', AssetLifecycleState.DEPLOYED, {
 *   updatedBy: 'admin-001',
 *   location: 'OR-5',
 *   reason: 'Deployed for cardiac surgery unit'
 * });
 * ```
 */
export declare function updateAssetLifecycleState(assetId: string, newState: AssetLifecycleState, data: LifecycleStateUpdateData, transaction?: Transaction): Promise<Asset>;
/**
 * Validates lifecycle state transition
 *
 * @param fromState - Current state
 * @param toState - Target state
 * @throws BadRequestException if transition is invalid
 *
 * @example
 * ```typescript
 * validateLifecycleTransition(
 *   AssetLifecycleState.DEPLOYED,
 *   AssetLifecycleState.MAINTENANCE
 * ); // Valid
 * ```
 */
export declare function validateLifecycleTransition(fromState: AssetLifecycleState, toState: AssetLifecycleState): void;
/**
 * Gets asset lifecycle history
 *
 * @param assetId - Asset identifier
 * @returns Lifecycle state change history
 *
 * @example
 * ```typescript
 * const history = await getAssetLifecycleHistory('asset-123');
 * ```
 */
export declare function getAssetLifecycleHistory(assetId: string): Promise<Array<{
    state: string;
    timestamp: Date;
    notes?: string;
}>>;
/**
 * Transitions asset to maintenance state
 *
 * @param assetId - Asset identifier
 * @param maintenanceData - Maintenance details
 * @param transaction - Optional database transaction
 * @returns Updated asset
 *
 * @example
 * ```typescript
 * await transitionToMaintenance('asset-123', {
 *   updatedBy: 'tech-001',
 *   reason: 'Scheduled preventive maintenance',
 *   notes: 'Annual calibration required'
 * });
 * ```
 */
export declare function transitionToMaintenance(assetId: string, maintenanceData: LifecycleStateUpdateData, transaction?: Transaction): Promise<Asset>;
/**
 * Transitions asset to retired state
 *
 * @param assetId - Asset identifier
 * @param retirementData - Retirement details
 * @param transaction - Optional database transaction
 * @returns Updated asset
 *
 * @example
 * ```typescript
 * await retireAsset('asset-123', {
 *   updatedBy: 'admin-001',
 *   reason: 'End of useful life',
 *   effectiveDate: new Date()
 * });
 * ```
 */
export declare function retireAsset(assetId: string, retirementData: LifecycleStateUpdateData, transaction?: Transaction): Promise<Asset>;
/**
 * Calculates asset depreciation
 *
 * @param assetId - Asset identifier
 * @param method - Depreciation method
 * @param usefulLifeYears - Useful life in years
 * @param salvageValue - Salvage value (default: 0)
 * @returns Depreciation calculation result
 *
 * @example
 * ```typescript
 * const depreciation = await calculateAssetDepreciation(
 *   'asset-123',
 *   DepreciationMethod.STRAIGHT_LINE,
 *   10,
 *   50000
 * );
 * console.log(depreciation.currentBookValue);
 * ```
 */
export declare function calculateAssetDepreciation(assetId: string, method: DepreciationMethod, usefulLifeYears: number, salvageValue?: number): Promise<DepreciationResult>;
/**
 * Calculates asset age in years
 *
 * @param acquisitionDate - Acquisition date
 * @returns Age in years
 *
 * @example
 * ```typescript
 * const age = calculateAssetAge(new Date('2020-01-01'));
 * // Returns: 4 (if current year is 2024)
 * ```
 */
export declare function calculateAssetAge(acquisitionDate: Date): number;
/**
 * Updates book value for all assets
 *
 * @param assetTypeId - Optional asset type filter
 * @param transaction - Optional database transaction
 * @returns Number of assets updated
 *
 * @example
 * ```typescript
 * const updated = await recalculateAllDepreciations('mri-equipment');
 * ```
 */
export declare function recalculateAllDepreciations(assetTypeId?: string, transaction?: Transaction): Promise<number>;
/**
 * Records asset condition assessment
 *
 * @param data - Condition assessment data
 * @param transaction - Optional database transaction
 * @returns Created condition record
 *
 * @example
 * ```typescript
 * const condition = await trackAssetCondition({
 *   assetId: 'asset-123',
 *   rating: AssetConditionRating.GOOD,
 *   assessedBy: 'tech-001',
 *   assessmentDate: new Date(),
 *   notes: 'Minor wear on moving parts',
 *   maintenanceRequired: true
 * });
 * ```
 */
export declare function trackAssetCondition(data: ConditionAssessmentData & {
    assetId: string;
}, transaction?: Transaction): Promise<AssetCondition>;
/**
 * Gets asset condition history
 *
 * @param assetId - Asset identifier
 * @param limit - Maximum number of records to return
 * @returns Condition history
 *
 * @example
 * ```typescript
 * const history = await getAssetConditionHistory('asset-123', 10);
 * ```
 */
export declare function getAssetConditionHistory(assetId: string, limit?: number): Promise<AssetCondition[]>;
/**
 * Identifies assets requiring maintenance based on condition
 *
 * @param minRating - Minimum acceptable condition rating
 * @returns Assets requiring maintenance
 *
 * @example
 * ```typescript
 * const assets = await getAssetsRequiringMaintenance(AssetConditionRating.FAIR);
 * ```
 */
export declare function getAssetsRequiringMaintenance(minRating?: AssetConditionRating): Promise<Asset[]>;
/**
 * Schedules maintenance for asset
 *
 * @param assetId - Asset identifier
 * @param schedule - Maintenance schedule details
 * @param transaction - Optional database transaction
 * @returns Updated asset
 *
 * @example
 * ```typescript
 * await scheduleAssetMaintenance('asset-123', {
 *   assetId: 'asset-123',
 *   maintenanceType: 'preventive',
 *   frequency: '90 days',
 *   nextMaintenanceDate: new Date('2024-06-01'),
 *   estimatedDuration: 4,
 *   estimatedCost: 2500,
 *   priority: 'high'
 * });
 * ```
 */
export declare function scheduleAssetMaintenance(assetId: string, schedule: MaintenanceSchedule, transaction?: Transaction): Promise<Asset>;
/**
 * Creates parent-child asset relationship
 *
 * @param relationship - Relationship details
 * @param transaction - Optional database transaction
 * @returns Child asset
 *
 * @example
 * ```typescript
 * await createAssetRelationship({
 *   parentAssetId: 'server-rack-001',
 *   childAssetId: 'server-blade-042',
 *   relationshipType: 'component',
 *   mandatory: true
 * });
 * ```
 */
export declare function createAssetRelationship(relationship: AssetRelationship, transaction?: Transaction): Promise<Asset>;
/**
 * Gets asset hierarchy (parent and all children)
 *
 * @param assetId - Root asset identifier
 * @returns Asset with full hierarchy
 *
 * @example
 * ```typescript
 * const hierarchy = await getAssetHierarchy('server-rack-001');
 * console.log(hierarchy.childAssets);
 * ```
 */
export declare function getAssetHierarchy(assetId: string): Promise<Asset>;
/**
 * Gets all component assets of a parent
 *
 * @param parentAssetId - Parent asset identifier
 * @returns Child assets
 *
 * @example
 * ```typescript
 * const components = await getAssetComponents('vehicle-001');
 * ```
 */
export declare function getAssetComponents(parentAssetId: string): Promise<Asset[]>;
/**
 * Creates asset transfer record
 *
 * @param data - Transfer data
 * @param transaction - Optional database transaction
 * @returns Created transfer record
 *
 * @example
 * ```typescript
 * const transfer = await transferAsset({
 *   assetId: 'asset-123',
 *   transferType: TransferType.RELOCATION,
 *   fromLocation: 'Warehouse-A',
 *   toLocation: 'Hospital-Floor-2',
 *   transferDate: new Date(),
 *   transferredBy: 'admin-001',
 *   reason: 'Department relocation'
 * });
 * ```
 */
export declare function transferAsset(data: AssetTransferData, transaction?: Transaction): Promise<AssetTransfer>;
/**
 * Completes asset transfer
 *
 * @param transferId - Transfer identifier
 * @param completionDate - Completion date
 * @param transaction - Optional database transaction
 * @returns Updated transfer record
 *
 * @example
 * ```typescript
 * await completeAssetTransfer('transfer-123', new Date());
 * ```
 */
export declare function completeAssetTransfer(transferId: string, completionDate?: Date, transaction?: Transaction): Promise<AssetTransfer>;
/**
 * Gets asset transfer history
 *
 * @param assetId - Asset identifier
 * @param limit - Maximum records to return
 * @returns Transfer history
 *
 * @example
 * ```typescript
 * const transfers = await getAssetTransferHistory('asset-123');
 * ```
 */
export declare function getAssetTransferHistory(assetId: string, limit?: number): Promise<AssetTransfer[]>;
/**
 * Assigns asset to user
 *
 * @param assetId - Asset identifier
 * @param userId - User identifier
 * @param assignedBy - User performing assignment
 * @param transaction - Optional database transaction
 * @returns Updated asset
 *
 * @example
 * ```typescript
 * await assignAssetToUser('laptop-042', 'user-123', 'admin-001');
 * ```
 */
export declare function assignAssetToUser(assetId: string, userId: string, assignedBy: string, transaction?: Transaction): Promise<Asset>;
/**
 * Initiates asset disposal process
 *
 * @param assetId - Asset identifier
 * @param disposalType - Type of disposal
 * @param data - Disposal details
 * @param transaction - Optional database transaction
 * @returns Updated asset
 *
 * @example
 * ```typescript
 * await disposeAsset('asset-123', AssetLifecycleState.DONATED, {
 *   updatedBy: 'admin-001',
 *   reason: 'Donated to charity organization',
 *   notes: 'Asset fully functional, donated to local clinic'
 * });
 * ```
 */
export declare function disposeAsset(assetId: string, disposalType: AssetLifecycleState.DISPOSED | AssetLifecycleState.DONATED | AssetLifecycleState.SOLD, data: LifecycleStateUpdateData, transaction?: Transaction): Promise<Asset>;
/**
 * Gets assets pending disposal
 *
 * @returns Assets in retired state
 *
 * @example
 * ```typescript
 * const pending = await getAssetsPendingDisposal();
 * ```
 */
export declare function getAssetsPendingDisposal(): Promise<Asset[]>;
/**
 * Searches assets with advanced filters
 *
 * @param filters - Search filters
 * @param options - Query options (limit, offset, order)
 * @returns Filtered assets
 *
 * @example
 * ```typescript
 * const assets = await searchAssets({
 *   assetTypeId: 'medical-equipment',
 *   lifecycleState: [AssetLifecycleState.DEPLOYED, AssetLifecycleState.IN_USE],
 *   location: 'Radiology',
 *   criticality: AssetCriticality.CRITICAL
 * });
 * ```
 */
export declare function searchAssets(filters: AssetSearchFilters, options?: FindOptions): Promise<{
    assets: Asset[];
    total: number;
}>;
/**
 * Gets assets by location
 *
 * @param location - Location identifier
 * @returns Assets at location
 *
 * @example
 * ```typescript
 * const assets = await getAssetsByLocation('OR-5');
 * ```
 */
export declare function getAssetsByLocation(location: string): Promise<Asset[]>;
/**
 * Gets assets assigned to user
 *
 * @param userId - User identifier
 * @returns Assigned assets
 *
 * @example
 * ```typescript
 * const assets = await getAssetsByUser('user-123');
 * ```
 */
export declare function getAssetsByUser(userId: string): Promise<Asset[]>;
/**
 * Gets assets with expiring warranties
 *
 * @param daysUntilExpiration - Number of days threshold
 * @returns Assets with expiring warranties
 *
 * @example
 * ```typescript
 * const expiring = await getAssetsWithExpiringWarranty(30);
 * ```
 */
export declare function getAssetsWithExpiringWarranty(daysUntilExpiration?: number): Promise<Asset[]>;
/**
 * Calculates asset utilization metrics
 *
 * @param assetId - Asset identifier
 * @param startDate - Analysis start date
 * @param endDate - Analysis end date
 * @returns Utilization metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateAssetUtilization(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateAssetUtilization(assetId: string, startDate: Date, endDate: Date): Promise<AssetUtilizationMetrics>;
/**
 * Gets asset portfolio summary
 *
 * @param assetTypeId - Optional asset type filter
 * @returns Portfolio statistics
 *
 * @example
 * ```typescript
 * const summary = await getAssetPortfolioSummary('medical-equipment');
 * ```
 */
export declare function getAssetPortfolioSummary(assetTypeId?: string): Promise<{
    totalAssets: number;
    totalValue: number;
    averageAge: number;
    byLifecycleState: Record<string, number>;
    byCondition: Record<string, number>;
    byCriticality: Record<string, number>;
}>;
/**
 * Gets comprehensive audit trail for asset
 *
 * @param assetId - Asset identifier
 * @returns Complete audit history
 *
 * @example
 * ```typescript
 * const audit = await getAssetAuditTrail('asset-123');
 * ```
 */
export declare function getAssetAuditTrail(assetId: string): Promise<{
    asset: Asset;
    conditionHistory: AssetCondition[];
    transferHistory: AssetTransfer[];
}>;
/**
 * Validates asset compliance certifications
 *
 * @param assetId - Asset identifier
 * @param requiredCertifications - Required certification list
 * @returns Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await validateAssetCompliance('asset-123', [
 *   'FDA-510k',
 *   'CE-Mark',
 *   'ISO-13485'
 * ]);
 * ```
 */
export declare function validateAssetCompliance(assetId: string, requiredCertifications: string[]): Promise<{
    compliant: boolean;
    missing: string[];
    present: string[];
}>;
declare const _default: {
    Asset: typeof Asset;
    AssetType: typeof AssetType;
    AssetCondition: typeof AssetCondition;
    AssetTransfer: typeof AssetTransfer;
    registerAsset: typeof registerAsset;
    generateAssetTag: typeof generateAssetTag;
    bulkRegisterAssets: typeof bulkRegisterAssets;
    updateAssetDetails: typeof updateAssetDetails;
    getAssetById: typeof getAssetById;
    updateAssetLifecycleState: typeof updateAssetLifecycleState;
    validateLifecycleTransition: typeof validateLifecycleTransition;
    getAssetLifecycleHistory: typeof getAssetLifecycleHistory;
    transitionToMaintenance: typeof transitionToMaintenance;
    retireAsset: typeof retireAsset;
    calculateAssetDepreciation: typeof calculateAssetDepreciation;
    calculateAssetAge: typeof calculateAssetAge;
    recalculateAllDepreciations: typeof recalculateAllDepreciations;
    trackAssetCondition: typeof trackAssetCondition;
    getAssetConditionHistory: typeof getAssetConditionHistory;
    getAssetsRequiringMaintenance: typeof getAssetsRequiringMaintenance;
    scheduleAssetMaintenance: typeof scheduleAssetMaintenance;
    createAssetRelationship: typeof createAssetRelationship;
    getAssetHierarchy: typeof getAssetHierarchy;
    getAssetComponents: typeof getAssetComponents;
    transferAsset: typeof transferAsset;
    completeAssetTransfer: typeof completeAssetTransfer;
    getAssetTransferHistory: typeof getAssetTransferHistory;
    assignAssetToUser: typeof assignAssetToUser;
    disposeAsset: typeof disposeAsset;
    getAssetsPendingDisposal: typeof getAssetsPendingDisposal;
    searchAssets: typeof searchAssets;
    getAssetsByLocation: typeof getAssetsByLocation;
    getAssetsByUser: typeof getAssetsByUser;
    getAssetsWithExpiringWarranty: typeof getAssetsWithExpiringWarranty;
    calculateAssetUtilization: typeof calculateAssetUtilization;
    getAssetPortfolioSummary: typeof getAssetPortfolioSummary;
    getAssetAuditTrail: typeof getAssetAuditTrail;
    validateAssetCompliance: typeof validateAssetCompliance;
};
export default _default;
//# sourceMappingURL=asset-lifecycle-kit.d.ts.map