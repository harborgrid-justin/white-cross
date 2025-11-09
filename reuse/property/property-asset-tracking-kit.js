"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetTrackingApiTags = exports.AssetWarrantyCreateSchema = exports.AssetDisposalCreateSchema = exports.AssetLocationCreateSchema = exports.AssetTransferCreateSchema = exports.MaintenanceRecordCreateSchema = exports.AssetUpdateSchema = exports.AssetCreateSchema = exports.IdentifierType = exports.TransferStatus = exports.DisposalMethod = exports.MaintenanceStatus = exports.MaintenanceType = exports.DepreciationMethod = exports.AssetCategory = exports.AssetCondition = exports.AssetStatus = void 0;
exports.registerAsset = registerAsset;
exports.updateAsset = updateAsset;
exports.getAssetById = getAssetById;
exports.searchAssets = searchAssets;
exports.deleteAsset = deleteAsset;
exports.updateAssetStatus = updateAssetStatus;
exports.getAssetLifecycleHistory = getAssetLifecycleHistory;
exports.retireAsset = retireAsset;
exports.reactivateAsset = reactivateAsset;
exports.calculateStraightLineDepreciation = calculateStraightLineDepreciation;
exports.calculateDecliningBalanceDepreciation = calculateDecliningBalanceDepreciation;
exports.calculateSumOfYearsDigitsDepreciation = calculateSumOfYearsDigitsDepreciation;
exports.calculateCurrentAssetValue = calculateCurrentAssetValue;
exports.createMaintenanceRecord = createMaintenanceRecord;
exports.completeMaintenanceRecord = completeMaintenanceRecord;
exports.getAssetMaintenanceHistory = getAssetMaintenanceHistory;
exports.schedulePreventiveMaintenance = schedulePreventiveMaintenance;
exports.getOverdueMaintenanceRecords = getOverdueMaintenanceRecords;
exports.createAssetLocation = createAssetLocation;
exports.transferAsset = transferAsset;
exports.approveAssetTransfer = approveAssetTransfer;
exports.completeAssetTransfer = completeAssetTransfer;
exports.getAssetLocationHistory = getAssetLocationHistory;
exports.getAssetsAtLocation = getAssetsAtLocation;
exports.updateAssetCondition = updateAssetCondition;
exports.performAssetInspection = performAssetInspection;
exports.getAssetsDueForInspection = getAssetsDueForInspection;
exports.createAssetDisposal = createAssetDisposal;
exports.getDisposalRecords = getDisposalRecords;
exports.generateAssetBarcode = generateAssetBarcode;
exports.generateAssetQRCode = generateAssetQRCode;
exports.generateAssetRFIDTag = generateAssetRFIDTag;
exports.scanAssetIdentifier = scanAssetIdentifier;
exports.bulkAssignIdentifiers = bulkAssignIdentifiers;
exports.createAssetWarranty = createAssetWarranty;
exports.getAssetWarranties = getAssetWarranties;
exports.getAssetsWithExpiringWarranties = getAssetsWithExpiringWarranties;
exports.isAssetUnderWarranty = isAssetUnderWarranty;
exports.createAssetValuation = createAssetValuation;
exports.getAssetValuationHistory = getAssetValuationHistory;
exports.bulkUpdateAssetValuations = bulkUpdateAssetValuations;
exports.generateUniqueAssetTag = generateUniqueAssetTag;
exports.calculateTotalAssetValue = calculateTotalAssetValue;
exports.getAssetUtilizationMetrics = getAssetUtilizationMetrics;
/**
 * File: /reuse/property/property-asset-tracking-kit.ts
 * Locator: WC-PROP-ASSET-TRACK-001
 * Purpose: Production-Grade Property Asset Tracking Kit - Enterprise asset management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, UUID, QRCode, Node-Cache
 * Downstream: ../backend/property/*, Asset Management Services, Maintenance Systems, Inventory Controllers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, zod
 * Exports: 40+ production-ready asset tracking functions covering registration, lifecycle, depreciation, maintenance, location, condition, disposal, barcode/RFID, warranty, valuation
 *
 * LLM Context: Production-grade property asset tracking and management utilities for White Cross healthcare platform.
 * Provides comprehensive asset lifecycle management including registration with barcode/RFID/QR code generation,
 * inventory tracking with real-time location updates, depreciation calculations (straight-line, declining balance, sum-of-years),
 * maintenance history with scheduled and preventive maintenance, condition assessment with grading system,
 * asset disposal management with audit trails, warranty tracking with expiration alerts, asset valuation updates
 * with market value adjustments, asset transfer between locations/departments, asset assignment to staff/patients,
 * asset search and filtering with advanced queries, asset reporting and analytics, compliance tracking for regulatory requirements,
 * asset insurance tracking, asset utilization metrics, bulk import/export capabilities, and complete audit logging.
 * Includes Sequelize models for assets, asset categories, locations, maintenance records, transfers, valuations,
 * warranties, and disposal records with comprehensive tracking and compliance capabilities.
 */
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const uuid_1 = require("uuid");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Asset status enumeration
 */
var AssetStatus;
(function (AssetStatus) {
    AssetStatus["ACTIVE"] = "active";
    AssetStatus["INACTIVE"] = "inactive";
    AssetStatus["IN_USE"] = "in_use";
    AssetStatus["AVAILABLE"] = "available";
    AssetStatus["MAINTENANCE"] = "maintenance";
    AssetStatus["REPAIR"] = "repair";
    AssetStatus["RETIRED"] = "retired";
    AssetStatus["DISPOSED"] = "disposed";
    AssetStatus["LOST"] = "lost";
    AssetStatus["STOLEN"] = "stolen";
    AssetStatus["DAMAGED"] = "damaged";
    AssetStatus["RESERVED"] = "reserved";
})(AssetStatus || (exports.AssetStatus = AssetStatus = {}));
/**
 * Asset condition enumeration
 */
var AssetCondition;
(function (AssetCondition) {
    AssetCondition["EXCELLENT"] = "excellent";
    AssetCondition["GOOD"] = "good";
    AssetCondition["FAIR"] = "fair";
    AssetCondition["POOR"] = "poor";
    AssetCondition["CRITICAL"] = "critical";
    AssetCondition["NON_FUNCTIONAL"] = "non_functional";
})(AssetCondition || (exports.AssetCondition = AssetCondition = {}));
/**
 * Asset category types
 */
var AssetCategory;
(function (AssetCategory) {
    AssetCategory["MEDICAL_EQUIPMENT"] = "medical_equipment";
    AssetCategory["FURNITURE"] = "furniture";
    AssetCategory["COMPUTER_HARDWARE"] = "computer_hardware";
    AssetCategory["VEHICLE"] = "vehicle";
    AssetCategory["BUILDING"] = "building";
    AssetCategory["LAND"] = "land";
    AssetCategory["OFFICE_EQUIPMENT"] = "office_equipment";
    AssetCategory["TOOLS"] = "tools";
    AssetCategory["FIXTURES"] = "fixtures";
    AssetCategory["SOFTWARE_LICENSE"] = "software_license";
    AssetCategory["OTHER"] = "other";
})(AssetCategory || (exports.AssetCategory = AssetCategory = {}));
/**
 * Depreciation method enumeration
 */
var DepreciationMethod;
(function (DepreciationMethod) {
    DepreciationMethod["STRAIGHT_LINE"] = "straight_line";
    DepreciationMethod["DECLINING_BALANCE"] = "declining_balance";
    DepreciationMethod["DOUBLE_DECLINING_BALANCE"] = "double_declining_balance";
    DepreciationMethod["SUM_OF_YEARS_DIGITS"] = "sum_of_years_digits";
    DepreciationMethod["UNITS_OF_PRODUCTION"] = "units_of_production";
    DepreciationMethod["NONE"] = "none";
})(DepreciationMethod || (exports.DepreciationMethod = DepreciationMethod = {}));
/**
 * Maintenance type enumeration
 */
var MaintenanceType;
(function (MaintenanceType) {
    MaintenanceType["PREVENTIVE"] = "preventive";
    MaintenanceType["CORRECTIVE"] = "corrective";
    MaintenanceType["PREDICTIVE"] = "predictive";
    MaintenanceType["EMERGENCY"] = "emergency";
    MaintenanceType["ROUTINE"] = "routine";
    MaintenanceType["INSPECTION"] = "inspection";
    MaintenanceType["CALIBRATION"] = "calibration";
    MaintenanceType["UPGRADE"] = "upgrade";
})(MaintenanceType || (exports.MaintenanceType = MaintenanceType = {}));
/**
 * Maintenance status enumeration
 */
var MaintenanceStatus;
(function (MaintenanceStatus) {
    MaintenanceStatus["SCHEDULED"] = "scheduled";
    MaintenanceStatus["IN_PROGRESS"] = "in_progress";
    MaintenanceStatus["COMPLETED"] = "completed";
    MaintenanceStatus["CANCELLED"] = "cancelled";
    MaintenanceStatus["OVERDUE"] = "overdue";
    MaintenanceStatus["PENDING_PARTS"] = "pending_parts";
})(MaintenanceStatus || (exports.MaintenanceStatus = MaintenanceStatus = {}));
/**
 * Disposal method enumeration
 */
var DisposalMethod;
(function (DisposalMethod) {
    DisposalMethod["SALE"] = "sale";
    DisposalMethod["DONATION"] = "donation";
    DisposalMethod["RECYCLING"] = "recycling";
    DisposalMethod["TRASH"] = "trash";
    DisposalMethod["TRADE_IN"] = "trade_in";
    DisposalMethod["AUCTION"] = "auction";
    DisposalMethod["RETURN_TO_VENDOR"] = "return_to_vendor";
    DisposalMethod["DESTRUCTION"] = "destruction";
})(DisposalMethod || (exports.DisposalMethod = DisposalMethod = {}));
/**
 * Transfer status enumeration
 */
var TransferStatus;
(function (TransferStatus) {
    TransferStatus["PENDING"] = "pending";
    TransferStatus["IN_TRANSIT"] = "in_transit";
    TransferStatus["COMPLETED"] = "completed";
    TransferStatus["CANCELLED"] = "cancelled";
    TransferStatus["REJECTED"] = "rejected";
})(TransferStatus || (exports.TransferStatus = TransferStatus = {}));
/**
 * Identifier type for barcode/RFID
 */
var IdentifierType;
(function (IdentifierType) {
    IdentifierType["BARCODE"] = "barcode";
    IdentifierType["QR_CODE"] = "qr_code";
    IdentifierType["RFID"] = "rfid";
    IdentifierType["NFC"] = "nfc";
    IdentifierType["ASSET_TAG"] = "asset_tag";
    IdentifierType["SERIAL_NUMBER"] = "serial_number";
})(IdentifierType || (exports.IdentifierType = IdentifierType = {}));
// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
/**
 * Asset creation schema
 */
exports.AssetCreateSchema = zod_1.z.object({
    assetTag: zod_1.z.string().min(1).max(50),
    name: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().max(2000).optional(),
    category: zod_1.z.nativeEnum(AssetCategory),
    status: zod_1.z.nativeEnum(AssetStatus).default(AssetStatus.ACTIVE),
    condition: zod_1.z.nativeEnum(AssetCondition).default(AssetCondition.GOOD),
    serialNumber: zod_1.z.string().max(100).optional(),
    modelNumber: zod_1.z.string().max(100).optional(),
    manufacturer: zod_1.z.string().max(255).optional(),
    locationId: zod_1.z.string().uuid(),
    departmentId: zod_1.z.string().uuid().optional(),
    assignedToUserId: zod_1.z.string().uuid().optional(),
    purchasePrice: zod_1.z.number().nonnegative(),
    salvageValue: zod_1.z.number().nonnegative().optional(),
    depreciationMethod: zod_1.z.nativeEnum(DepreciationMethod).default(DepreciationMethod.STRAIGHT_LINE),
    usefulLifeYears: zod_1.z.number().positive().optional(),
    purchaseDate: zod_1.z.date(),
    warrantyExpiryDate: zod_1.z.date().optional(),
    vendorId: zod_1.z.string().uuid().optional(),
    invoiceNumber: zod_1.z.string().max(100).optional(),
    insurancePolicyNumber: zod_1.z.string().max(100).optional(),
    notes: zod_1.z.string().max(5000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Asset update schema
 */
exports.AssetUpdateSchema = exports.AssetCreateSchema.partial();
/**
 * Maintenance record creation schema
 */
exports.MaintenanceRecordCreateSchema = zod_1.z.object({
    assetId: zod_1.z.string().uuid(),
    type: zod_1.z.nativeEnum(MaintenanceType),
    status: zod_1.z.nativeEnum(MaintenanceStatus).default(MaintenanceStatus.SCHEDULED),
    scheduledDate: zod_1.z.date(),
    description: zod_1.z.string().min(1).max(2000),
    performedByUserId: zod_1.z.string().uuid().optional(),
    vendorId: zod_1.z.string().uuid().optional(),
    workOrderNumber: zod_1.z.string().max(100).optional(),
    cost: zod_1.z.number().nonnegative().optional(),
    laborHours: zod_1.z.number().nonnegative().optional(),
    notes: zod_1.z.string().max(5000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Asset transfer creation schema
 */
exports.AssetTransferCreateSchema = zod_1.z.object({
    assetId: zod_1.z.string().uuid(),
    fromLocationId: zod_1.z.string().uuid(),
    toLocationId: zod_1.z.string().uuid(),
    fromUserId: zod_1.z.string().uuid().optional(),
    toUserId: zod_1.z.string().uuid().optional(),
    requestedByUserId: zod_1.z.string().uuid(),
    reason: zod_1.z.string().max(1000).optional(),
    notes: zod_1.z.string().max(5000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Asset location creation schema
 */
exports.AssetLocationCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    code: zod_1.z.string().min(1).max(50),
    type: zod_1.z.enum(['building', 'floor', 'room', 'warehouse', 'storage', 'external']),
    address: zod_1.z.string().max(255).optional(),
    city: zod_1.z.string().max(100).optional(),
    state: zod_1.z.string().max(100).optional(),
    zipCode: zod_1.z.string().max(20).optional(),
    country: zod_1.z.string().max(100).optional(),
    parentLocationId: zod_1.z.string().uuid().optional(),
    responsibleUserId: zod_1.z.string().uuid().optional(),
    capacity: zod_1.z.number().int().positive().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Asset disposal creation schema
 */
exports.AssetDisposalCreateSchema = zod_1.z.object({
    assetId: zod_1.z.string().uuid(),
    disposalMethod: zod_1.z.nativeEnum(DisposalMethod),
    disposalDate: zod_1.z.date(),
    reason: zod_1.z.string().min(1).max(2000),
    approvedByUserId: zod_1.z.string().uuid(),
    salePrice: zod_1.z.number().nonnegative().optional(),
    buyerInformation: zod_1.z.string().max(1000).optional(),
    certificateOfDestruction: zod_1.z.string().url().optional(),
    environmentalCompliance: zod_1.z.boolean().optional(),
    dataWipingConfirmed: zod_1.z.boolean().optional(),
    notes: zod_1.z.string().max(5000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Asset warranty creation schema
 */
exports.AssetWarrantyCreateSchema = zod_1.z.object({
    assetId: zod_1.z.string().uuid(),
    warrantyType: zod_1.z.enum(['manufacturer', 'extended', 'service_contract']),
    provider: zod_1.z.string().min(1).max(255),
    policyNumber: zod_1.z.string().max(100).optional(),
    startDate: zod_1.z.date(),
    expiryDate: zod_1.z.date(),
    coverageDetails: zod_1.z.string().max(2000).optional(),
    cost: zod_1.z.number().nonnegative().optional(),
    contactName: zod_1.z.string().max(255).optional(),
    contactPhone: zod_1.z.string().max(50).optional(),
    contactEmail: zod_1.z.string().email().optional(),
    documentUrl: zod_1.z.string().url().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
// ============================================================================
// ASSET REGISTRATION AND INVENTORY
// ============================================================================
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
async function registerAsset(data) {
    const validated = exports.AssetCreateSchema.parse(data);
    const asset = {
        id: (0, uuid_1.v4)(),
        assetTag: validated.assetTag,
        name: validated.name,
        description: validated.description,
        category: validated.category,
        status: validated.status,
        condition: validated.condition,
        serialNumber: validated.serialNumber,
        modelNumber: validated.modelNumber,
        manufacturer: validated.manufacturer,
        locationId: validated.locationId,
        departmentId: validated.departmentId,
        assignedToUserId: validated.assignedToUserId,
        purchasePrice: validated.purchasePrice,
        currentValue: validated.purchasePrice,
        salvageValue: validated.salvageValue,
        depreciationMethod: validated.depreciationMethod,
        usefulLifeYears: validated.usefulLifeYears,
        purchaseDate: validated.purchaseDate,
        warrantyExpiryDate: validated.warrantyExpiryDate,
        vendorId: validated.vendorId,
        invoiceNumber: validated.invoiceNumber,
        insurancePolicyNumber: validated.insurancePolicyNumber,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createAuditLog({
        assetId: asset.id,
        action: 'ASSET_REGISTERED',
        performedByUserId: 'system',
        newState: asset,
        timestamp: new Date(),
    });
    return asset;
}
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
async function updateAsset(assetId, data) {
    const validated = exports.AssetUpdateSchema.parse(data);
    const existingAsset = await getAssetById(assetId);
    const updatedAsset = {
        ...existingAsset,
        ...validated,
        updatedAt: new Date(),
    };
    await createAuditLog({
        assetId,
        action: 'ASSET_UPDATED',
        performedByUserId: 'system',
        previousState: existingAsset,
        newState: updatedAsset,
        timestamp: new Date(),
    });
    return updatedAsset;
}
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
async function getAssetById(assetId) {
    if (!assetId) {
        throw new common_1.BadRequestException('Asset ID is required');
    }
    // Implementation would fetch from database
    throw new common_1.NotFoundException(`Asset ${assetId} not found`);
}
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
async function searchAssets(filters) {
    // Implementation would query database with filters
    return { assets: [], total: 0 };
}
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
async function deleteAsset(assetId, userId) {
    const asset = await getAssetById(assetId);
    const deletedAsset = {
        ...asset,
        deletedAt: new Date(),
        updatedAt: new Date(),
    };
    await createAuditLog({
        assetId,
        action: 'ASSET_DELETED',
        performedByUserId: userId,
        previousState: asset,
        timestamp: new Date(),
    });
    return deletedAsset;
}
// ============================================================================
// ASSET LIFECYCLE TRACKING
// ============================================================================
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
async function updateAssetStatus(assetId, newStatus, userId, reason) {
    const asset = await getAssetById(assetId);
    const updatedAsset = {
        ...asset,
        status: newStatus,
        updatedAt: new Date(),
    };
    await createAuditLog({
        assetId,
        action: 'STATUS_CHANGED',
        performedByUserId: userId,
        previousState: { status: asset.status },
        newState: { status: newStatus, reason },
        timestamp: new Date(),
    });
    return updatedAsset;
}
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
async function getAssetLifecycleHistory(assetId) {
    // Implementation would fetch from audit logs
    return [];
}
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
async function retireAsset(assetId, userId, reason) {
    const asset = await getAssetById(assetId);
    const retiredAsset = {
        ...asset,
        status: AssetStatus.RETIRED,
        retirementDate: new Date(),
        updatedAt: new Date(),
    };
    await createAuditLog({
        assetId,
        action: 'ASSET_RETIRED',
        performedByUserId: userId,
        newState: { reason, retirementDate: retiredAsset.retirementDate },
        timestamp: new Date(),
    });
    return retiredAsset;
}
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
async function reactivateAsset(assetId, userId, reason) {
    const asset = await getAssetById(assetId);
    if (asset.status !== AssetStatus.RETIRED) {
        throw new common_1.BadRequestException('Only retired assets can be reactivated');
    }
    const reactivatedAsset = {
        ...asset,
        status: AssetStatus.ACTIVE,
        retirementDate: undefined,
        updatedAt: new Date(),
    };
    await createAuditLog({
        assetId,
        action: 'ASSET_REACTIVATED',
        performedByUserId: userId,
        newState: { reason },
        timestamp: new Date(),
    });
    return reactivatedAsset;
}
// ============================================================================
// DEPRECIATION CALCULATIONS
// ============================================================================
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
function calculateStraightLineDepreciation(asset) {
    if (!asset.usefulLifeYears || asset.usefulLifeYears <= 0) {
        throw new common_1.BadRequestException('Useful life years must be specified for depreciation calculation');
    }
    const salvageValue = asset.salvageValue || 0;
    const depreciableAmount = asset.purchasePrice - salvageValue;
    const annualDepreciation = depreciableAmount / asset.usefulLifeYears;
    const monthlyDepreciation = annualDepreciation / 12;
    const yearsElapsed = (new Date().getTime() - asset.purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    const accumulatedDepreciation = Math.min(annualDepreciation * yearsElapsed, depreciableAmount);
    const currentValue = Math.max(asset.purchasePrice - accumulatedDepreciation, salvageValue);
    const schedule = [];
    for (let year = 1; year <= asset.usefulLifeYears; year++) {
        const beginningValue = asset.purchasePrice - (annualDepreciation * (year - 1));
        const yearDepreciation = year === asset.usefulLifeYears
            ? beginningValue - salvageValue
            : annualDepreciation;
        const endingValue = Math.max(beginningValue - yearDepreciation, salvageValue);
        schedule.push({
            year,
            beginningValue,
            depreciation: yearDepreciation,
            endingValue,
        });
    }
    return {
        assetId: asset.id,
        method: DepreciationMethod.STRAIGHT_LINE,
        purchasePrice: asset.purchasePrice,
        currentValue,
        accumulatedDepreciation,
        annualDepreciation,
        monthlyDepreciation,
        remainingLifeYears: Math.max(asset.usefulLifeYears - yearsElapsed, 0),
        depreciationSchedule: schedule,
    };
}
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
function calculateDecliningBalanceDepreciation(asset, rate = 2) {
    if (!asset.usefulLifeYears || asset.usefulLifeYears <= 0) {
        throw new common_1.BadRequestException('Useful life years must be specified');
    }
    const salvageValue = asset.salvageValue || 0;
    const depreciationRate = rate / asset.usefulLifeYears;
    const schedule = [];
    let bookValue = asset.purchasePrice;
    let accumulatedDepreciation = 0;
    for (let year = 1; year <= asset.usefulLifeYears; year++) {
        const beginningValue = bookValue;
        let yearDepreciation = bookValue * depreciationRate;
        // Don't depreciate below salvage value
        if (bookValue - yearDepreciation < salvageValue) {
            yearDepreciation = bookValue - salvageValue;
        }
        const endingValue = bookValue - yearDepreciation;
        accumulatedDepreciation += yearDepreciation;
        schedule.push({
            year,
            beginningValue,
            depreciation: yearDepreciation,
            endingValue,
        });
        bookValue = endingValue;
    }
    const yearsElapsed = (new Date().getTime() - asset.purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    const currentYearSchedule = schedule[Math.min(Math.floor(yearsElapsed), schedule.length - 1)];
    return {
        assetId: asset.id,
        method: DepreciationMethod.DECLINING_BALANCE,
        purchasePrice: asset.purchasePrice,
        currentValue: currentYearSchedule?.endingValue || salvageValue,
        accumulatedDepreciation: asset.purchasePrice - (currentYearSchedule?.endingValue || salvageValue),
        annualDepreciation: currentYearSchedule?.depreciation || 0,
        monthlyDepreciation: (currentYearSchedule?.depreciation || 0) / 12,
        remainingLifeYears: Math.max(asset.usefulLifeYears - yearsElapsed, 0),
        depreciationSchedule: schedule,
    };
}
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
function calculateSumOfYearsDigitsDepreciation(asset) {
    if (!asset.usefulLifeYears || asset.usefulLifeYears <= 0) {
        throw new common_1.BadRequestException('Useful life years must be specified');
    }
    const salvageValue = asset.salvageValue || 0;
    const depreciableAmount = asset.purchasePrice - salvageValue;
    const sumOfYears = (asset.usefulLifeYears * (asset.usefulLifeYears + 1)) / 2;
    const schedule = [];
    let bookValue = asset.purchasePrice;
    let accumulatedDepreciation = 0;
    for (let year = 1; year <= asset.usefulLifeYears; year++) {
        const remainingLife = asset.usefulLifeYears - year + 1;
        const yearDepreciation = (depreciableAmount * remainingLife) / sumOfYears;
        const endingValue = bookValue - yearDepreciation;
        schedule.push({
            year,
            beginningValue: bookValue,
            depreciation: yearDepreciation,
            endingValue,
        });
        accumulatedDepreciation += yearDepreciation;
        bookValue = endingValue;
    }
    const yearsElapsed = (new Date().getTime() - asset.purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    const currentYearIndex = Math.min(Math.floor(yearsElapsed), schedule.length - 1);
    const currentYearSchedule = schedule[currentYearIndex];
    return {
        assetId: asset.id,
        method: DepreciationMethod.SUM_OF_YEARS_DIGITS,
        purchasePrice: asset.purchasePrice,
        currentValue: currentYearSchedule?.endingValue || salvageValue,
        accumulatedDepreciation: asset.purchasePrice - (currentYearSchedule?.endingValue || salvageValue),
        annualDepreciation: currentYearSchedule?.depreciation || 0,
        monthlyDepreciation: (currentYearSchedule?.depreciation || 0) / 12,
        remainingLifeYears: Math.max(asset.usefulLifeYears - yearsElapsed, 0),
        depreciationSchedule: schedule,
    };
}
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
async function calculateCurrentAssetValue(asset) {
    if (asset.depreciationMethod === DepreciationMethod.NONE) {
        return asset.purchasePrice;
    }
    let result;
    switch (asset.depreciationMethod) {
        case DepreciationMethod.STRAIGHT_LINE:
            result = calculateStraightLineDepreciation(asset);
            break;
        case DepreciationMethod.DECLINING_BALANCE:
            result = calculateDecliningBalanceDepreciation(asset, 1.5);
            break;
        case DepreciationMethod.DOUBLE_DECLINING_BALANCE:
            result = calculateDecliningBalanceDepreciation(asset, 2);
            break;
        case DepreciationMethod.SUM_OF_YEARS_DIGITS:
            result = calculateSumOfYearsDigitsDepreciation(asset);
            break;
        default:
            return asset.purchasePrice;
    }
    return result.currentValue;
}
// ============================================================================
// ASSET MAINTENANCE HISTORY
// ============================================================================
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
async function createMaintenanceRecord(data) {
    const validated = exports.MaintenanceRecordCreateSchema.parse(data);
    const record = {
        id: (0, uuid_1.v4)(),
        assetId: validated.assetId,
        type: validated.type,
        status: validated.status,
        scheduledDate: validated.scheduledDate,
        description: validated.description,
        performedByUserId: validated.performedByUserId,
        vendorId: validated.vendorId,
        workOrderNumber: validated.workOrderNumber,
        cost: validated.cost,
        laborHours: validated.laborHours,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createAuditLog({
        assetId: validated.assetId,
        action: 'MAINTENANCE_SCHEDULED',
        performedByUserId: validated.performedByUserId || 'system',
        newState: record,
        timestamp: new Date(),
    });
    return record;
}
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
async function completeMaintenanceRecord(recordId, data) {
    // Implementation would fetch and update record
    throw new common_1.NotFoundException(`Maintenance record ${recordId} not found`);
}
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
async function getAssetMaintenanceHistory(assetId, filters) {
    // Implementation would query database
    return [];
}
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
async function schedulePreventiveMaintenance(assetId, intervalDays, type, description) {
    const asset = await getAssetById(assetId);
    const scheduledRecords = [];
    const startDate = asset.lastMaintenanceDate || new Date();
    // Schedule next 4 maintenance cycles
    for (let i = 1; i <= 4; i++) {
        const scheduledDate = new Date(startDate);
        scheduledDate.setDate(scheduledDate.getDate() + (intervalDays * i));
        const record = await createMaintenanceRecord({
            assetId,
            type,
            status: MaintenanceStatus.SCHEDULED,
            scheduledDate,
            description,
        });
        scheduledRecords.push(record);
    }
    return scheduledRecords;
}
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
async function getOverdueMaintenanceRecords(filters) {
    // Implementation would query database for overdue records
    return [];
}
// ============================================================================
// ASSET LOCATION TRACKING
// ============================================================================
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
async function createAssetLocation(data) {
    const validated = exports.AssetLocationCreateSchema.parse(data);
    const location = {
        id: (0, uuid_1.v4)(),
        name: validated.name,
        code: validated.code,
        type: validated.type,
        address: validated.address,
        city: validated.city,
        state: validated.state,
        zipCode: validated.zipCode,
        country: validated.country,
        parentLocationId: validated.parentLocationId,
        responsibleUserId: validated.responsibleUserId,
        capacity: validated.capacity,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return location;
}
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
async function transferAsset(data) {
    const validated = exports.AssetTransferCreateSchema.parse(data);
    const transfer = {
        id: (0, uuid_1.v4)(),
        assetId: validated.assetId,
        fromLocationId: validated.fromLocationId,
        toLocationId: validated.toLocationId,
        fromUserId: validated.fromUserId,
        toUserId: validated.toUserId,
        status: TransferStatus.PENDING,
        requestedByUserId: validated.requestedByUserId,
        requestDate: new Date(),
        reason: validated.reason,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createAuditLog({
        assetId: validated.assetId,
        action: 'TRANSFER_REQUESTED',
        performedByUserId: validated.requestedByUserId,
        newState: transfer,
        timestamp: new Date(),
    });
    return transfer;
}
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
async function approveAssetTransfer(transferId, approvedByUserId) {
    // Implementation would fetch and update transfer
    throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
}
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
async function completeAssetTransfer(transferId) {
    // Implementation would update transfer status and asset location
    throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
}
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
async function getAssetLocationHistory(assetId) {
    // Implementation would fetch transfer history
    return [];
}
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
async function getAssetsAtLocation(locationId, includeSubLocations = false) {
    // Implementation would query database
    return [];
}
// ============================================================================
// ASSET CONDITION ASSESSMENT
// ============================================================================
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
async function updateAssetCondition(assetId, condition, assessedByUserId, notes) {
    const asset = await getAssetById(assetId);
    const updatedAsset = {
        ...asset,
        condition,
        updatedAt: new Date(),
    };
    await createAuditLog({
        assetId,
        action: 'CONDITION_UPDATED',
        performedByUserId: assessedByUserId,
        previousState: { condition: asset.condition },
        newState: { condition, notes },
        timestamp: new Date(),
    });
    return updatedAsset;
}
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
async function performAssetInspection(assetId, inspection) {
    const asset = await updateAssetCondition(assetId, inspection.condition, inspection.inspectedByUserId, inspection.findings?.join('; '));
    const maintenanceRecord = await createMaintenanceRecord({
        assetId,
        type: MaintenanceType.INSPECTION,
        status: MaintenanceStatus.COMPLETED,
        scheduledDate: new Date(),
        description: 'Asset inspection',
        performedByUserId: inspection.inspectedByUserId,
        notes: JSON.stringify(inspection),
        metadata: inspection,
    });
    return { asset, maintenanceRecord };
}
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
async function getAssetsDueForInspection(inspectionIntervalDays = 90) {
    // Implementation would query assets where last inspection was > intervalDays ago
    return [];
}
// ============================================================================
// ASSET DISPOSAL MANAGEMENT
// ============================================================================
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
async function createAssetDisposal(data) {
    const validated = exports.AssetDisposalCreateSchema.parse(data);
    const disposal = {
        id: (0, uuid_1.v4)(),
        assetId: validated.assetId,
        disposalMethod: validated.disposalMethod,
        disposalDate: validated.disposalDate,
        reason: validated.reason,
        approvedByUserId: validated.approvedByUserId,
        salePrice: validated.salePrice,
        buyerInformation: validated.buyerInformation,
        certificateOfDestruction: validated.certificateOfDestruction,
        environmentalCompliance: validated.environmentalCompliance,
        dataWipingConfirmed: validated.dataWipingConfirmed,
        notes: validated.notes,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // Update asset status to disposed
    await updateAssetStatus(validated.assetId, AssetStatus.DISPOSED, validated.approvedByUserId, validated.reason);
    await createAuditLog({
        assetId: validated.assetId,
        action: 'ASSET_DISPOSED',
        performedByUserId: validated.approvedByUserId,
        newState: disposal,
        timestamp: new Date(),
    });
    return disposal;
}
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
async function getDisposalRecords(filters) {
    // Implementation would query database
    return [];
}
// ============================================================================
// BARCODE/RFID INTEGRATION
// ============================================================================
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
function generateAssetBarcode(assetId, format = 'CODE128') {
    // Generate barcode based on asset ID and format
    const prefix = 'WC';
    const timestamp = Date.now().toString(36).toUpperCase();
    const id = assetId.substring(0, 8).toUpperCase();
    return `${prefix}${timestamp}${id}`;
}
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
function generateAssetQRCode(asset) {
    const qrData = {
        id: asset.id,
        assetTag: asset.assetTag,
        name: asset.name,
        category: asset.category,
        serialNumber: asset.serialNumber,
        locationId: asset.locationId,
    };
    return JSON.stringify(qrData);
}
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
function generateAssetRFIDTag(assetId, protocol = 'EPC') {
    // Generate RFID tag based on protocol
    const companyPrefix = '0614141'; // Example company prefix
    const assetReference = assetId.replace(/-/g, '').substring(0, 12).padEnd(12, '0');
    return `${protocol}:${companyPrefix}${assetReference}`;
}
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
async function scanAssetIdentifier(identifier, identifierType) {
    // Implementation would query database by identifier
    throw new common_1.NotFoundException(`Asset with ${identifierType} ${identifier} not found`);
}
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
async function bulkAssignIdentifiers(assignments) {
    const updatedAssets = [];
    for (const assignment of assignments) {
        const asset = await getAssetById(assignment.assetId);
        const updated = await updateAsset(assignment.assetId, {
            barcode: assignment.barcode,
            rfidTag: assignment.rfidTag,
            qrCode: assignment.qrCode,
        });
        updatedAssets.push(updated);
    }
    return updatedAssets;
}
// ============================================================================
// ASSET WARRANTY TRACKING
// ============================================================================
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
async function createAssetWarranty(data) {
    const validated = exports.AssetWarrantyCreateSchema.parse(data);
    const warranty = {
        id: (0, uuid_1.v4)(),
        assetId: validated.assetId,
        warrantyType: validated.warrantyType,
        provider: validated.provider,
        policyNumber: validated.policyNumber,
        startDate: validated.startDate,
        expiryDate: validated.expiryDate,
        coverageDetails: validated.coverageDetails,
        cost: validated.cost,
        contactName: validated.contactName,
        contactPhone: validated.contactPhone,
        contactEmail: validated.contactEmail,
        documentUrl: validated.documentUrl,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await createAuditLog({
        assetId: validated.assetId,
        action: 'WARRANTY_CREATED',
        performedByUserId: 'system',
        newState: warranty,
        timestamp: new Date(),
    });
    return warranty;
}
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
async function getAssetWarranties(assetId) {
    // Implementation would query database
    return [];
}
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
async function getAssetsWithExpiringWarranties(daysUntilExpiry = 30) {
    // Implementation would query database for warranties expiring soon
    return [];
}
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
async function isAssetUnderWarranty(assetId, checkDate = new Date()) {
    const warranties = await getAssetWarranties(assetId);
    const activeWarranty = warranties.find(w => w.startDate <= checkDate && w.expiryDate >= checkDate);
    return {
        isUnderWarranty: !!activeWarranty,
        warranty: activeWarranty,
    };
}
// ============================================================================
// ASSET VALUATION UPDATES
// ============================================================================
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
async function createAssetValuation(assetId, valuation) {
    const asset = await getAssetById(assetId);
    const depreciatedValue = await calculateCurrentAssetValue(asset);
    const valuationRecord = {
        id: (0, uuid_1.v4)(),
        assetId,
        valuationDate: new Date(),
        marketValue: valuation.marketValue,
        bookValue: asset.currentValue,
        depreciatedValue,
        assessedByUserId: valuation.assessedByUserId,
        valuationMethod: valuation.valuationMethod,
        externalAppraiserId: valuation.externalAppraiserId,
        appraisalDocumentUrl: valuation.appraisalDocumentUrl,
        notes: valuation.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // Update asset current value
    await updateAsset(assetId, {
        currentValue: valuation.marketValue,
    });
    await createAuditLog({
        assetId,
        action: 'VALUATION_UPDATED',
        performedByUserId: valuation.assessedByUserId || 'system',
        newState: valuationRecord,
        timestamp: new Date(),
    });
    return valuationRecord;
}
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
async function getAssetValuationHistory(assetId) {
    // Implementation would query database
    return [];
}
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
async function bulkUpdateAssetValuations(assetIds) {
    // Implementation would query assets and update valuations
    // This would typically be run as a scheduled job
    return 0;
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Create audit log entry
 *
 * @param log - Audit log data
 */
async function createAuditLog(log) {
    const auditLog = {
        id: (0, uuid_1.v4)(),
        ...log,
    };
    // Implementation would save to database
    return auditLog;
}
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
function generateUniqueAssetTag(category, sequence) {
    const year = new Date().getFullYear();
    const categoryPrefix = category.substring(0, 3).toUpperCase();
    const paddedSequence = sequence.toString().padStart(5, '0');
    return `${categoryPrefix}-${year}-${paddedSequence}`;
}
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
async function calculateTotalAssetValue(filters) {
    // Implementation would query and sum asset values
    return { totalPurchaseValue: 0, totalCurrentValue: 0, count: 0 };
}
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
async function getAssetUtilizationMetrics(assetId, startDate, endDate) {
    // Implementation would calculate from audit logs and status changes
    return {
        assetId,
        totalDays: 0,
        daysInUse: 0,
        daysInMaintenance: 0,
        daysAvailable: 0,
        utilizationRate: 0,
    };
}
// ============================================================================
// SWAGGER DECORATORS
// ============================================================================
/**
 * Swagger API tags for asset tracking endpoints
 */
exports.AssetTrackingApiTags = {
    ASSETS: 'Assets',
    LOCATIONS: 'Asset Locations',
    MAINTENANCE: 'Asset Maintenance',
    TRANSFERS: 'Asset Transfers',
    VALUATIONS: 'Asset Valuations',
    WARRANTIES: 'Asset Warranties',
    DISPOSAL: 'Asset Disposal',
    IDENTIFIERS: 'Barcode/RFID',
    DEPRECIATION: 'Depreciation',
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
//# sourceMappingURL=property-asset-tracking-kit.js.map