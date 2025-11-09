/**
 * LOC: PROP_ASSET_TRACK_001
 * File: /reuse/property/property-asset-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - uuid
 *   - qrcode
 *   - node-cache
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Asset tracking controllers
 *   - Maintenance services
 *   - Inventory management systems
 *   - Depreciation calculators
 *   - Compliance reporting services
 */
import { z } from 'zod';
/**
 * Asset status enumeration
 */
export declare enum AssetStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    IN_USE = "in_use",
    AVAILABLE = "available",
    MAINTENANCE = "maintenance",
    REPAIR = "repair",
    RETIRED = "retired",
    DISPOSED = "disposed",
    LOST = "lost",
    STOLEN = "stolen",
    DAMAGED = "damaged",
    RESERVED = "reserved"
}
/**
 * Asset condition enumeration
 */
export declare enum AssetCondition {
    EXCELLENT = "excellent",
    GOOD = "good",
    FAIR = "fair",
    POOR = "poor",
    CRITICAL = "critical",
    NON_FUNCTIONAL = "non_functional"
}
/**
 * Asset category types
 */
export declare enum AssetCategory {
    MEDICAL_EQUIPMENT = "medical_equipment",
    FURNITURE = "furniture",
    COMPUTER_HARDWARE = "computer_hardware",
    VEHICLE = "vehicle",
    BUILDING = "building",
    LAND = "land",
    OFFICE_EQUIPMENT = "office_equipment",
    TOOLS = "tools",
    FIXTURES = "fixtures",
    SOFTWARE_LICENSE = "software_license",
    OTHER = "other"
}
/**
 * Depreciation method enumeration
 */
export declare enum DepreciationMethod {
    STRAIGHT_LINE = "straight_line",
    DECLINING_BALANCE = "declining_balance",
    DOUBLE_DECLINING_BALANCE = "double_declining_balance",
    SUM_OF_YEARS_DIGITS = "sum_of_years_digits",
    UNITS_OF_PRODUCTION = "units_of_production",
    NONE = "none"
}
/**
 * Maintenance type enumeration
 */
export declare enum MaintenanceType {
    PREVENTIVE = "preventive",
    CORRECTIVE = "corrective",
    PREDICTIVE = "predictive",
    EMERGENCY = "emergency",
    ROUTINE = "routine",
    INSPECTION = "inspection",
    CALIBRATION = "calibration",
    UPGRADE = "upgrade"
}
/**
 * Maintenance status enumeration
 */
export declare enum MaintenanceStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    OVERDUE = "overdue",
    PENDING_PARTS = "pending_parts"
}
/**
 * Disposal method enumeration
 */
export declare enum DisposalMethod {
    SALE = "sale",
    DONATION = "donation",
    RECYCLING = "recycling",
    TRASH = "trash",
    TRADE_IN = "trade_in",
    AUCTION = "auction",
    RETURN_TO_VENDOR = "return_to_vendor",
    DESTRUCTION = "destruction"
}
/**
 * Transfer status enumeration
 */
export declare enum TransferStatus {
    PENDING = "pending",
    IN_TRANSIT = "in_transit",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    REJECTED = "rejected"
}
/**
 * Identifier type for barcode/RFID
 */
export declare enum IdentifierType {
    BARCODE = "barcode",
    QR_CODE = "qr_code",
    RFID = "rfid",
    NFC = "nfc",
    ASSET_TAG = "asset_tag",
    SERIAL_NUMBER = "serial_number"
}
/**
 * Asset interface
 */
export interface Asset {
    id: string;
    assetTag: string;
    name: string;
    description?: string;
    category: AssetCategory;
    status: AssetStatus;
    condition: AssetCondition;
    serialNumber?: string;
    modelNumber?: string;
    manufacturer?: string;
    barcode?: string;
    rfidTag?: string;
    qrCode?: string;
    locationId: string;
    departmentId?: string;
    assignedToUserId?: string;
    purchasePrice: number;
    currentValue: number;
    salvageValue?: number;
    depreciationMethod: DepreciationMethod;
    usefulLifeYears?: number;
    purchaseDate: Date;
    warrantyExpiryDate?: Date;
    lastMaintenanceDate?: Date;
    nextMaintenanceDate?: Date;
    retirementDate?: Date;
    vendorId?: string;
    invoiceNumber?: string;
    insurancePolicyNumber?: string;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Asset location interface
 */
export interface AssetLocation {
    id: string;
    name: string;
    code: string;
    type: 'building' | 'floor' | 'room' | 'warehouse' | 'storage' | 'external';
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    parentLocationId?: string;
    responsibleUserId?: string;
    capacity?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Maintenance record interface
 */
export interface MaintenanceRecord {
    id: string;
    assetId: string;
    type: MaintenanceType;
    status: MaintenanceStatus;
    scheduledDate: Date;
    completedDate?: Date;
    performedByUserId?: string;
    vendorId?: string;
    description: string;
    workOrderNumber?: string;
    cost?: number;
    laborHours?: number;
    partsUsed?: Array<{
        partNumber: string;
        description: string;
        quantity: number;
        cost: number;
    }>;
    notes?: string;
    attachments?: string[];
    nextScheduledDate?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Asset transfer interface
 */
export interface AssetTransfer {
    id: string;
    assetId: string;
    fromLocationId: string;
    toLocationId: string;
    fromUserId?: string;
    toUserId?: string;
    status: TransferStatus;
    requestedByUserId: string;
    approvedByUserId?: string;
    requestDate: Date;
    approvalDate?: Date;
    transferDate?: Date;
    completionDate?: Date;
    reason?: string;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Asset valuation interface
 */
export interface AssetValuation {
    id: string;
    assetId: string;
    valuationDate: Date;
    marketValue: number;
    bookValue: number;
    depreciatedValue: number;
    assessedByUserId?: string;
    valuationMethod?: string;
    externalAppraiserId?: string;
    appraisalDocumentUrl?: string;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Asset warranty interface
 */
export interface AssetWarranty {
    id: string;
    assetId: string;
    warrantyType: 'manufacturer' | 'extended' | 'service_contract';
    provider: string;
    policyNumber?: string;
    startDate: Date;
    expiryDate: Date;
    coverageDetails?: string;
    cost?: number;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
    documentUrl?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Asset disposal interface
 */
export interface AssetDisposal {
    id: string;
    assetId: string;
    disposalMethod: DisposalMethod;
    disposalDate: Date;
    reason: string;
    approvedByUserId: string;
    salePrice?: number;
    buyerInformation?: string;
    certificateOfDestruction?: string;
    environmentalCompliance?: boolean;
    dataWipingConfirmed?: boolean;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Asset audit log interface
 */
export interface AssetAuditLog {
    id: string;
    assetId: string;
    action: string;
    performedByUserId: string;
    previousState?: Record<string, any>;
    newState?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
}
/**
 * Depreciation calculation result
 */
export interface DepreciationResult {
    assetId: string;
    method: DepreciationMethod;
    purchasePrice: number;
    currentValue: number;
    accumulatedDepreciation: number;
    annualDepreciation: number;
    monthlyDepreciation: number;
    remainingLifeYears: number;
    depreciationSchedule: Array<{
        year: number;
        beginningValue: number;
        depreciation: number;
        endingValue: number;
    }>;
}
/**
 * Asset creation schema
 */
export declare const AssetCreateSchema: any;
/**
 * Asset update schema
 */
export declare const AssetUpdateSchema: any;
/**
 * Maintenance record creation schema
 */
export declare const MaintenanceRecordCreateSchema: any;
/**
 * Asset transfer creation schema
 */
export declare const AssetTransferCreateSchema: any;
/**
 * Asset location creation schema
 */
export declare const AssetLocationCreateSchema: any;
/**
 * Asset disposal creation schema
 */
export declare const AssetDisposalCreateSchema: any;
/**
 * Asset warranty creation schema
 */
export declare const AssetWarrantyCreateSchema: any;
/**
 * Register a new asset in the inventory system
 *
 * @param data - Asset creation data
 * @returns Created asset
 *
 * @example
 * ```typescript
 * const asset = await registerAsset({
 *   assetTag: 'MED-2024-001',
 *   name: 'X-Ray Machine',
 *   category: AssetCategory.MEDICAL_EQUIPMENT,
 *   purchasePrice: 50000,
 *   locationId: 'loc-123',
 *   purchaseDate: new Date('2024-01-15'),
 * });
 * ```
 */
export declare function registerAsset(data: z.infer<typeof AssetCreateSchema>): Promise<Asset>;
/**
 * Update an existing asset
 *
 * @param assetId - Asset ID
 * @param data - Asset update data
 * @returns Updated asset
 *
 * @example
 * ```typescript
 * const updated = await updateAsset('asset-123', {
 *   status: AssetStatus.MAINTENANCE,
 *   condition: AssetCondition.FAIR,
 * });
 * ```
 */
export declare function updateAsset(assetId: string, data: z.infer<typeof AssetUpdateSchema>): Promise<Asset>;
/**
 * Retrieve an asset by ID
 *
 * @param assetId - Asset ID
 * @returns Asset details
 *
 * @example
 * ```typescript
 * const asset = await getAssetById('asset-123');
 * console.log(`Asset: ${asset.name}`);
 * ```
 */
export declare function getAssetById(assetId: string): Promise<Asset>;
/**
 * Search assets with filtering and pagination
 *
 * @param filters - Search filters
 * @returns List of matching assets
 *
 * @example
 * ```typescript
 * const assets = await searchAssets({
 *   category: AssetCategory.MEDICAL_EQUIPMENT,
 *   status: AssetStatus.ACTIVE,
 *   locationId: 'loc-123',
 * });
 * ```
 */
export declare function searchAssets(filters: {
    category?: AssetCategory;
    status?: AssetStatus;
    condition?: AssetCondition;
    locationId?: string;
    departmentId?: string;
    assignedToUserId?: string;
    minValue?: number;
    maxValue?: number;
    search?: string;
    limit?: number;
    offset?: number;
}): Promise<{
    assets: Asset[];
    total: number;
}>;
/**
 * Delete an asset (soft delete)
 *
 * @param assetId - Asset ID
 * @param userId - User performing the deletion
 * @returns Deleted asset
 *
 * @example
 * ```typescript
 * await deleteAsset('asset-123', 'user-456');
 * ```
 */
export declare function deleteAsset(assetId: string, userId: string): Promise<Asset>;
/**
 * Track asset lifecycle status changes
 *
 * @param assetId - Asset ID
 * @param newStatus - New status
 * @param userId - User making the change
 * @param reason - Reason for status change
 * @returns Updated asset
 *
 * @example
 * ```typescript
 * await updateAssetStatus('asset-123', AssetStatus.MAINTENANCE, 'user-456', 'Scheduled maintenance');
 * ```
 */
export declare function updateAssetStatus(assetId: string, newStatus: AssetStatus, userId: string, reason?: string): Promise<Asset>;
/**
 * Get asset lifecycle history
 *
 * @param assetId - Asset ID
 * @returns List of lifecycle events
 *
 * @example
 * ```typescript
 * const history = await getAssetLifecycleHistory('asset-123');
 * ```
 */
export declare function getAssetLifecycleHistory(assetId: string): Promise<AssetAuditLog[]>;
/**
 * Retire an asset from active service
 *
 * @param assetId - Asset ID
 * @param userId - User performing retirement
 * @param reason - Retirement reason
 * @returns Retired asset
 *
 * @example
 * ```typescript
 * await retireAsset('asset-123', 'user-456', 'End of useful life');
 * ```
 */
export declare function retireAsset(assetId: string, userId: string, reason: string): Promise<Asset>;
/**
 * Reactivate a retired asset
 *
 * @param assetId - Asset ID
 * @param userId - User performing reactivation
 * @param reason - Reactivation reason
 * @returns Reactivated asset
 *
 * @example
 * ```typescript
 * await reactivateAsset('asset-123', 'user-456', 'Still functional, needed for backup');
 * ```
 */
export declare function reactivateAsset(assetId: string, userId: string, reason: string): Promise<Asset>;
/**
 * Calculate asset depreciation using straight-line method
 *
 * @param asset - Asset data
 * @returns Depreciation result
 *
 * @example
 * ```typescript
 * const depreciation = calculateStraightLineDepreciation(asset);
 * console.log(`Annual depreciation: $${depreciation.annualDepreciation}`);
 * ```
 */
export declare function calculateStraightLineDepreciation(asset: Asset): DepreciationResult;
/**
 * Calculate asset depreciation using declining balance method
 *
 * @param asset - Asset data
 * @param rate - Depreciation rate (e.g., 2 for double-declining)
 * @returns Depreciation result
 *
 * @example
 * ```typescript
 * const depreciation = calculateDecliningBalanceDepreciation(asset, 2);
 * ```
 */
export declare function calculateDecliningBalanceDepreciation(asset: Asset, rate?: number): DepreciationResult;
/**
 * Calculate asset depreciation using sum-of-years-digits method
 *
 * @param asset - Asset data
 * @returns Depreciation result
 *
 * @example
 * ```typescript
 * const depreciation = calculateSumOfYearsDigitsDepreciation(asset);
 * ```
 */
export declare function calculateSumOfYearsDigitsDepreciation(asset: Asset): DepreciationResult;
/**
 * Calculate current asset value based on depreciation method
 *
 * @param asset - Asset data
 * @returns Current depreciated value
 *
 * @example
 * ```typescript
 * const currentValue = await calculateCurrentAssetValue(asset);
 * ```
 */
export declare function calculateCurrentAssetValue(asset: Asset): Promise<number>;
/**
 * Create a maintenance record for an asset
 *
 * @param data - Maintenance record data
 * @returns Created maintenance record
 *
 * @example
 * ```typescript
 * const maintenance = await createMaintenanceRecord({
 *   assetId: 'asset-123',
 *   type: MaintenanceType.PREVENTIVE,
 *   scheduledDate: new Date('2024-02-01'),
 *   description: 'Annual calibration',
 * });
 * ```
 */
export declare function createMaintenanceRecord(data: z.infer<typeof MaintenanceRecordCreateSchema>): Promise<MaintenanceRecord>;
/**
 * Complete a maintenance record
 *
 * @param recordId - Maintenance record ID
 * @param data - Completion data
 * @returns Updated maintenance record
 *
 * @example
 * ```typescript
 * await completeMaintenanceRecord('maint-123', {
 *   performedByUserId: 'user-456',
 *   cost: 150,
 *   laborHours: 2,
 *   notes: 'Calibration completed successfully',
 * });
 * ```
 */
export declare function completeMaintenanceRecord(recordId: string, data: {
    performedByUserId: string;
    cost?: number;
    laborHours?: number;
    partsUsed?: Array<{
        partNumber: string;
        description: string;
        quantity: number;
        cost: number;
    }>;
    notes?: string;
}): Promise<MaintenanceRecord>;
/**
 * Get maintenance history for an asset
 *
 * @param assetId - Asset ID
 * @param filters - Optional filters
 * @returns List of maintenance records
 *
 * @example
 * ```typescript
 * const history = await getAssetMaintenanceHistory('asset-123', {
 *   type: MaintenanceType.PREVENTIVE,
 *   status: MaintenanceStatus.COMPLETED,
 * });
 * ```
 */
export declare function getAssetMaintenanceHistory(assetId: string, filters?: {
    type?: MaintenanceType;
    status?: MaintenanceStatus;
    startDate?: Date;
    endDate?: Date;
}): Promise<MaintenanceRecord[]>;
/**
 * Schedule preventive maintenance for an asset
 *
 * @param assetId - Asset ID
 * @param intervalDays - Maintenance interval in days
 * @param type - Maintenance type
 * @param description - Maintenance description
 * @returns Scheduled maintenance records
 *
 * @example
 * ```typescript
 * await schedulePreventiveMaintenance('asset-123', 90, MaintenanceType.CALIBRATION, 'Quarterly calibration');
 * ```
 */
export declare function schedulePreventiveMaintenance(assetId: string, intervalDays: number, type: MaintenanceType, description: string): Promise<MaintenanceRecord[]>;
/**
 * Get overdue maintenance records
 *
 * @param filters - Optional filters
 * @returns List of overdue maintenance records
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueMaintenanceRecords({ locationId: 'loc-123' });
 * ```
 */
export declare function getOverdueMaintenanceRecords(filters?: {
    locationId?: string;
    departmentId?: string;
    assetCategory?: AssetCategory;
}): Promise<MaintenanceRecord[]>;
/**
 * Create a new asset location
 *
 * @param data - Location data
 * @returns Created location
 *
 * @example
 * ```typescript
 * const location = await createAssetLocation({
 *   name: 'Building A - Floor 3',
 *   code: 'BLD-A-F3',
 *   type: 'floor',
 * });
 * ```
 */
export declare function createAssetLocation(data: z.infer<typeof AssetLocationCreateSchema>): Promise<AssetLocation>;
/**
 * Transfer an asset to a new location
 *
 * @param data - Transfer data
 * @returns Created transfer record
 *
 * @example
 * ```typescript
 * const transfer = await transferAsset({
 *   assetId: 'asset-123',
 *   fromLocationId: 'loc-1',
 *   toLocationId: 'loc-2',
 *   requestedByUserId: 'user-456',
 * });
 * ```
 */
export declare function transferAsset(data: z.infer<typeof AssetTransferCreateSchema>): Promise<AssetTransfer>;
/**
 * Approve an asset transfer
 *
 * @param transferId - Transfer ID
 * @param approvedByUserId - User approving the transfer
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await approveAssetTransfer('transfer-123', 'manager-456');
 * ```
 */
export declare function approveAssetTransfer(transferId: string, approvedByUserId: string): Promise<AssetTransfer>;
/**
 * Complete an asset transfer
 *
 * @param transferId - Transfer ID
 * @returns Updated transfer and asset
 *
 * @example
 * ```typescript
 * await completeAssetTransfer('transfer-123');
 * ```
 */
export declare function completeAssetTransfer(transferId: string): Promise<{
    transfer: AssetTransfer;
    asset: Asset;
}>;
/**
 * Get asset location history
 *
 * @param assetId - Asset ID
 * @returns List of location transfers
 *
 * @example
 * ```typescript
 * const history = await getAssetLocationHistory('asset-123');
 * ```
 */
export declare function getAssetLocationHistory(assetId: string): Promise<AssetTransfer[]>;
/**
 * Get all assets at a location
 *
 * @param locationId - Location ID
 * @param includeSubLocations - Include assets in sub-locations
 * @returns List of assets
 *
 * @example
 * ```typescript
 * const assets = await getAssetsAtLocation('loc-123', true);
 * ```
 */
export declare function getAssetsAtLocation(locationId: string, includeSubLocations?: boolean): Promise<Asset[]>;
/**
 * Update asset condition
 *
 * @param assetId - Asset ID
 * @param condition - New condition
 * @param assessedByUserId - User performing assessment
 * @param notes - Assessment notes
 * @returns Updated asset
 *
 * @example
 * ```typescript
 * await updateAssetCondition('asset-123', AssetCondition.FAIR, 'user-456', 'Minor wear observed');
 * ```
 */
export declare function updateAssetCondition(assetId: string, condition: AssetCondition, assessedByUserId: string, notes?: string): Promise<Asset>;
/**
 * Perform comprehensive asset inspection
 *
 * @param assetId - Asset ID
 * @param inspection - Inspection data
 * @returns Inspection record and updated asset
 *
 * @example
 * ```typescript
 * await performAssetInspection('asset-123', {
 *   inspectedByUserId: 'user-456',
 *   condition: AssetCondition.GOOD,
 *   functionalityScore: 8,
 *   appearanceScore: 7,
 *   findings: ['Minor scratches', 'All functions operational'],
 * });
 * ```
 */
export declare function performAssetInspection(assetId: string, inspection: {
    inspectedByUserId: string;
    condition: AssetCondition;
    functionalityScore?: number;
    appearanceScore?: number;
    safetyScore?: number;
    findings?: string[];
    recommendations?: string[];
    photos?: string[];
}): Promise<{
    asset: Asset;
    maintenanceRecord: MaintenanceRecord;
}>;
/**
 * Get assets due for inspection
 *
 * @param inspectionIntervalDays - Days between inspections
 * @returns List of assets due for inspection
 *
 * @example
 * ```typescript
 * const dueForInspection = await getAssetsDueForInspection(90);
 * ```
 */
export declare function getAssetsDueForInspection(inspectionIntervalDays?: number): Promise<Asset[]>;
/**
 * Create asset disposal record
 *
 * @param data - Disposal data
 * @returns Created disposal record
 *
 * @example
 * ```typescript
 * const disposal = await createAssetDisposal({
 *   assetId: 'asset-123',
 *   disposalMethod: DisposalMethod.RECYCLING,
 *   disposalDate: new Date(),
 *   reason: 'End of useful life',
 *   approvedByUserId: 'manager-456',
 *   environmentalCompliance: true,
 * });
 * ```
 */
export declare function createAssetDisposal(data: z.infer<typeof AssetDisposalCreateSchema>): Promise<AssetDisposal>;
/**
 * Get disposal records with filtering
 *
 * @param filters - Optional filters
 * @returns List of disposal records
 *
 * @example
 * ```typescript
 * const disposals = await getDisposalRecords({
 *   method: DisposalMethod.SALE,
 *   startDate: new Date('2024-01-01'),
 * });
 * ```
 */
export declare function getDisposalRecords(filters?: {
    method?: DisposalMethod;
    startDate?: Date;
    endDate?: Date;
    approvedByUserId?: string;
}): Promise<AssetDisposal[]>;
/**
 * Generate barcode for an asset
 *
 * @param assetId - Asset ID
 * @param format - Barcode format
 * @returns Barcode string
 *
 * @example
 * ```typescript
 * const barcode = generateAssetBarcode('asset-123', 'CODE128');
 * ```
 */
export declare function generateAssetBarcode(assetId: string, format?: 'CODE128' | 'CODE39' | 'EAN13' | 'UPC'): string;
/**
 * Generate QR code data for an asset
 *
 * @param asset - Asset data
 * @returns QR code data string
 *
 * @example
 * ```typescript
 * const qrData = generateAssetQRCode(asset);
 * // Use with QR code library to generate image
 * ```
 */
export declare function generateAssetQRCode(asset: Asset): string;
/**
 * Generate RFID tag identifier for an asset
 *
 * @param assetId - Asset ID
 * @param protocol - RFID protocol
 * @returns RFID tag identifier
 *
 * @example
 * ```typescript
 * const rfidTag = generateAssetRFIDTag('asset-123', 'EPC');
 * ```
 */
export declare function generateAssetRFIDTag(assetId: string, protocol?: 'EPC' | 'ISO14443A' | 'ISO15693'): string;
/**
 * Scan and retrieve asset by identifier
 *
 * @param identifier - Barcode, QR code, or RFID tag
 * @param identifierType - Type of identifier
 * @returns Asset details
 *
 * @example
 * ```typescript
 * const asset = await scanAssetIdentifier('WC12345ABC', IdentifierType.BARCODE);
 * ```
 */
export declare function scanAssetIdentifier(identifier: string, identifierType: IdentifierType): Promise<Asset>;
/**
 * Bulk assign identifiers to assets
 *
 * @param assignments - List of asset ID and identifier pairs
 * @returns Updated assets
 *
 * @example
 * ```typescript
 * await bulkAssignIdentifiers([
 *   { assetId: 'asset-1', barcode: 'BC001', rfidTag: 'RFID001' },
 *   { assetId: 'asset-2', barcode: 'BC002', rfidTag: 'RFID002' },
 * ]);
 * ```
 */
export declare function bulkAssignIdentifiers(assignments: Array<{
    assetId: string;
    barcode?: string;
    rfidTag?: string;
    qrCode?: string;
}>): Promise<Asset[]>;
/**
 * Create warranty record for an asset
 *
 * @param data - Warranty data
 * @returns Created warranty record
 *
 * @example
 * ```typescript
 * const warranty = await createAssetWarranty({
 *   assetId: 'asset-123',
 *   warrantyType: 'manufacturer',
 *   provider: 'MedEquip Inc.',
 *   startDate: new Date('2024-01-01'),
 *   expiryDate: new Date('2026-01-01'),
 * });
 * ```
 */
export declare function createAssetWarranty(data: z.infer<typeof AssetWarrantyCreateSchema>): Promise<AssetWarranty>;
/**
 * Get warranties for an asset
 *
 * @param assetId - Asset ID
 * @returns List of warranties
 *
 * @example
 * ```typescript
 * const warranties = await getAssetWarranties('asset-123');
 * ```
 */
export declare function getAssetWarranties(assetId: string): Promise<AssetWarranty[]>;
/**
 * Get assets with expiring warranties
 *
 * @param daysUntilExpiry - Number of days until expiry
 * @returns List of assets with expiring warranties
 *
 * @example
 * ```typescript
 * const expiring = await getAssetsWithExpiringWarranties(30);
 * ```
 */
export declare function getAssetsWithExpiringWarranties(daysUntilExpiry?: number): Promise<Array<{
    asset: Asset;
    warranty: AssetWarranty;
}>>;
/**
 * Check if asset is under warranty
 *
 * @param assetId - Asset ID
 * @param checkDate - Date to check (defaults to now)
 * @returns Warranty status
 *
 * @example
 * ```typescript
 * const status = await isAssetUnderWarranty('asset-123');
 * if (status.isUnderWarranty) {
 *   console.log(`Covered by: ${status.warranty.provider}`);
 * }
 * ```
 */
export declare function isAssetUnderWarranty(assetId: string, checkDate?: Date): Promise<{
    isUnderWarranty: boolean;
    warranty?: AssetWarranty;
}>;
/**
 * Create asset valuation record
 *
 * @param assetId - Asset ID
 * @param valuation - Valuation data
 * @returns Created valuation record
 *
 * @example
 * ```typescript
 * const valuation = await createAssetValuation('asset-123', {
 *   marketValue: 45000,
 *   assessedByUserId: 'user-456',
 *   valuationMethod: 'Market comparison',
 * });
 * ```
 */
export declare function createAssetValuation(assetId: string, valuation: {
    marketValue: number;
    assessedByUserId?: string;
    valuationMethod?: string;
    externalAppraiserId?: string;
    appraisalDocumentUrl?: string;
    notes?: string;
}): Promise<AssetValuation>;
/**
 * Get valuation history for an asset
 *
 * @param assetId - Asset ID
 * @returns List of valuations
 *
 * @example
 * ```typescript
 * const history = await getAssetValuationHistory('asset-123');
 * ```
 */
export declare function getAssetValuationHistory(assetId: string): Promise<AssetValuation[]>;
/**
 * Bulk update asset valuations based on depreciation
 *
 * @param assetIds - List of asset IDs (optional, defaults to all)
 * @returns Number of assets updated
 *
 * @example
 * ```typescript
 * const updated = await bulkUpdateAssetValuations();
 * console.log(`Updated ${updated} assets`);
 * ```
 */
export declare function bulkUpdateAssetValuations(assetIds?: string[]): Promise<number>;
/**
 * Generate unique asset tag
 *
 * @param category - Asset category
 * @param sequence - Sequence number
 * @returns Asset tag
 *
 * @example
 * ```typescript
 * const tag = generateUniqueAssetTag(AssetCategory.MEDICAL_EQUIPMENT, 123);
 * // Returns: 'MED-2024-00123'
 * ```
 */
export declare function generateUniqueAssetTag(category: AssetCategory, sequence: number): string;
/**
 * Calculate total asset value for a location or department
 *
 * @param filters - Location or department filter
 * @returns Total asset value
 *
 * @example
 * ```typescript
 * const totalValue = await calculateTotalAssetValue({ locationId: 'loc-123' });
 * ```
 */
export declare function calculateTotalAssetValue(filters: {
    locationId?: string;
    departmentId?: string;
    category?: AssetCategory;
}): Promise<{
    totalPurchaseValue: number;
    totalCurrentValue: number;
    count: number;
}>;
/**
 * Get asset utilization metrics
 *
 * @param assetId - Asset ID
 * @param startDate - Start date for metrics
 * @param endDate - End date for metrics
 * @returns Utilization metrics
 *
 * @example
 * ```typescript
 * const metrics = await getAssetUtilizationMetrics('asset-123', startDate, endDate);
 * ```
 */
export declare function getAssetUtilizationMetrics(assetId: string, startDate: Date, endDate: Date): Promise<{
    assetId: string;
    totalDays: number;
    daysInUse: number;
    daysInMaintenance: number;
    daysAvailable: number;
    utilizationRate: number;
}>;
/**
 * Asset model interface for Sequelize
 */
export interface AssetModel {
    id: string;
    assetTag: string;
    name: string;
    description?: string;
    category: AssetCategory;
    status: AssetStatus;
    condition: AssetCondition;
    serialNumber?: string;
    modelNumber?: string;
    manufacturer?: string;
    barcode?: string;
    rfidTag?: string;
    qrCode?: string;
    locationId: string;
    departmentId?: string;
    assignedToUserId?: string;
    purchasePrice: number;
    currentValue: number;
    salvageValue?: number;
    depreciationMethod: DepreciationMethod;
    usefulLifeYears?: number;
    purchaseDate: Date;
    warrantyExpiryDate?: Date;
    lastMaintenanceDate?: Date;
    nextMaintenanceDate?: Date;
    retirementDate?: Date;
    vendorId?: string;
    invoiceNumber?: string;
    insurancePolicyNumber?: string;
    notes?: string;
    metadata?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Asset location model interface for Sequelize
 */
export interface AssetLocationModel {
    id: string;
    name: string;
    code: string;
    type: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    parentLocationId?: string;
    responsibleUserId?: string;
    capacity?: number;
    metadata?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Maintenance record model interface for Sequelize
 */
export interface MaintenanceRecordModel {
    id: string;
    assetId: string;
    type: MaintenanceType;
    status: MaintenanceStatus;
    scheduledDate: Date;
    completedDate?: Date;
    performedByUserId?: string;
    vendorId?: string;
    description: string;
    workOrderNumber?: string;
    cost?: number;
    laborHours?: number;
    partsUsed?: string;
    notes?: string;
    attachments?: string;
    nextScheduledDate?: Date;
    metadata?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Asset transfer model interface for Sequelize
 */
export interface AssetTransferModel {
    id: string;
    assetId: string;
    fromLocationId: string;
    toLocationId: string;
    fromUserId?: string;
    toUserId?: string;
    status: TransferStatus;
    requestedByUserId: string;
    approvedByUserId?: string;
    requestDate: Date;
    approvalDate?: Date;
    transferDate?: Date;
    completionDate?: Date;
    reason?: string;
    notes?: string;
    metadata?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Asset valuation model interface for Sequelize
 */
export interface AssetValuationModel {
    id: string;
    assetId: string;
    valuationDate: Date;
    marketValue: number;
    bookValue: number;
    depreciatedValue: number;
    assessedByUserId?: string;
    valuationMethod?: string;
    externalAppraiserId?: string;
    appraisalDocumentUrl?: string;
    notes?: string;
    metadata?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Asset warranty model interface for Sequelize
 */
export interface AssetWarrantyModel {
    id: string;
    assetId: string;
    warrantyType: string;
    provider: string;
    policyNumber?: string;
    startDate: Date;
    expiryDate: Date;
    coverageDetails?: string;
    cost?: number;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
    documentUrl?: string;
    metadata?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Asset disposal model interface for Sequelize
 */
export interface AssetDisposalModel {
    id: string;
    assetId: string;
    disposalMethod: DisposalMethod;
    disposalDate: Date;
    reason: string;
    approvedByUserId: string;
    salePrice?: number;
    buyerInformation?: string;
    certificateOfDestruction?: string;
    environmentalCompliance?: boolean;
    dataWipingConfirmed?: boolean;
    notes?: string;
    metadata?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Asset audit log model interface for Sequelize
 */
export interface AssetAuditLogModel {
    id: string;
    assetId: string;
    action: string;
    performedByUserId: string;
    previousState?: string;
    newState?: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
}
/**
 * Swagger API tags for asset tracking endpoints
 */
export declare const AssetTrackingApiTags: {
    ASSETS: string;
    LOCATIONS: string;
    MAINTENANCE: string;
    TRANSFERS: string;
    VALUATIONS: string;
    WARRANTIES: string;
    DISPOSAL: string;
    IDENTIFIERS: string;
    DEPRECIATION: string;
};
/**
 * Example Swagger decorators for asset controller
 *
 * @ApiTags(AssetTrackingApiTags.ASSETS)
 * @Controller('assets')
 * export class AssetController {
 *   @Post()
 *   @ApiOperation({ summary: 'Register new asset' })
 *   @ApiResponse({ status: 201, description: 'Asset created successfully' })
 *   async create(@Body() data: AssetCreateSchema) {
 *     return registerAsset(data);
 *   }
 * }
 */
//# sourceMappingURL=property-asset-tracking-kit.d.ts.map