/**
 * LOC: GOVAM8765432
 * File: /reuse/government/asset-inventory-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable government utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend asset management services
 *   - Property management modules
 *   - Depreciation calculation services
 *   - Barcode/RFID tracking systems
 */
/**
 * File: /reuse/government/asset-inventory-management-kit.ts
 * Locator: WC-GOV-ASSET-001
 * Purpose: Enterprise-grade Government Asset Inventory Management - capital assets, depreciation, physical inventory, transfers, maintenance, barcode/RFID
 *
 * Upstream: Independent utility module for government asset operations
 * Downstream: ../backend/government/*, asset controllers, inventory services, transfer processors, reporting modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50+ functions for government asset management competing with USACE CEFMS/SAP asset tracking
 *
 * LLM Context: Comprehensive government asset inventory utilities for production-ready applications.
 * Provides capital asset tracking, acquisition/disposal processing, multiple depreciation methods (straight-line, declining balance),
 * asset categorization and tagging, physical inventory management, interdepartmental transfers, maintenance scheduling,
 * capitalization threshold management, asset impairment testing, barcode/RFID integration, valuation updates, and surplus property management.
 */
import { Sequelize, Transaction } from 'sequelize';
interface CapitalAssetData {
    assetNumber: string;
    description: string;
    assetCategory: 'land' | 'building' | 'equipment' | 'vehicle' | 'infrastructure' | 'software' | 'furniture';
    acquisitionDate: Date;
    acquisitionCost: number;
    usefulLifeYears: number;
    depreciationMethod: 'straight_line' | 'declining_balance' | 'units_of_production' | 'sum_of_years';
    salvageValue: number;
    departmentId: string;
    locationId: string;
    serialNumber?: string;
    manufacturer?: string;
    model?: string;
    warrantyExpiration?: Date;
    metadata?: Record<string, any>;
}
interface DepreciationResult {
    assetId: string;
    fiscalYear: number;
    periodDepreciation: number;
    accumulatedDepreciation: number;
    bookValue: number;
    method: string;
    calculatedAt: Date;
}
interface AssetTransferData {
    assetId: string;
    fromDepartmentId: string;
    toDepartmentId: string;
    fromLocationId: string;
    toLocationId: string;
    transferDate: Date;
    transferReason: string;
    transferredBy: string;
    approvedBy?: string;
    condition?: string;
    notes?: string;
}
interface AssetMaintenanceRecord {
    assetId: string;
    maintenanceType: 'preventive' | 'corrective' | 'predictive' | 'emergency';
    maintenanceDate: Date;
    performedBy: string;
    cost: number;
    description: string;
    nextMaintenanceDate?: Date;
    downtimeHours?: number;
    partsReplaced?: string[];
}
interface AssetValuation {
    assetId: string;
    valuationDate: Date;
    valuationType: 'market' | 'replacement' | 'liquidation' | 'insurance';
    valuationAmount: number;
    valuedBy: string;
    certifiedBy?: string;
    validUntil?: Date;
    notes?: string;
}
interface AssetDisposalData {
    assetId: string;
    disposalDate: Date;
    disposalMethod: 'sale' | 'trade' | 'donation' | 'scrap' | 'auction' | 'surplus';
    proceedsAmount: number;
    bookValueAtDisposal: number;
    gainLoss: number;
    approvedBy: string;
    disposalReason: string;
    recipientOrBuyer?: string;
}
interface AssetImpairmentTest {
    assetId: string;
    testDate: Date;
    estimatedFairValue: number;
    currentBookValue: number;
    impairmentLoss: number;
    isImpaired: boolean;
    testedBy: string;
    impairmentReason?: string;
}
interface BarcodeScanData {
    barcode: string;
    assetId?: string;
    scannedAt: Date;
    scannedBy: string;
    locationId: string;
    deviceId: string;
    scanType: 'inventory' | 'transfer' | 'checkout' | 'checkin';
}
interface RFIDTagData {
    rfidTag: string;
    assetId: string;
    lastReadTime: Date;
    lastReadLocation: string;
    readerDeviceId: string;
    signalStrength?: number;
}
interface AssetCategorizationRule {
    categoryName: string;
    capitalizationThreshold: number;
    depreciationMethod: string;
    usefulLifeYears: number;
    glAccountCode: string;
    requiresApproval: boolean;
}
interface SurplusPropertyListing {
    assetId: string;
    listedDate: Date;
    estimatedValue: number;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    availableFor: 'sale' | 'donation' | 'transfer' | 'all';
    contactPerson: string;
    status: 'listed' | 'pending' | 'sold' | 'withdrawn';
}
/**
 * Sequelize model for Capital Assets with full lifecycle tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     CapitalAsset:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         assetNumber:
 *           type: string
 *         description:
 *           type: string
 *         acquisitionCost:
 *           type: number
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CapitalAsset model
 *
 * @example
 * ```typescript
 * const CapitalAsset = createCapitalAssetModel(sequelize);
 * const asset = await CapitalAsset.create({
 *   assetNumber: 'AST-2024-001',
 *   description: 'Dell Laptop Computer',
 *   assetCategory: 'equipment',
 *   acquisitionDate: new Date(),
 *   acquisitionCost: 1500.00,
 *   usefulLifeYears: 5,
 *   depreciationMethod: 'straight_line',
 *   salvageValue: 100.00
 * });
 * ```
 */
export declare const createCapitalAssetModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        assetNumber: string;
        description: string;
        assetCategory: string;
        acquisitionDate: Date;
        acquisitionCost: number;
        usefulLifeYears: number;
        depreciationMethod: string;
        salvageValue: number;
        departmentId: string;
        locationId: string;
        serialNumber: string | null;
        manufacturer: string | null;
        model: string | null;
        warrantyExpiration: Date | null;
        accumulatedDepreciation: number;
        bookValue: number;
        status: string;
        barcode: string | null;
        rfidTag: string | null;
        lastInventoryDate: Date | null;
        lastMaintenanceDate: Date | null;
        disposalDate: Date | null;
        fiscalYear: number;
        glAccountCode: string;
        responsiblePerson: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Asset Depreciation records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetDepreciation model
 *
 * @example
 * ```typescript
 * const AssetDepreciation = createAssetDepreciationModel(sequelize);
 * const depreciation = await AssetDepreciation.create({
 *   assetId: 'asset-uuid',
 *   fiscalYear: 2024,
 *   fiscalPeriod: 12,
 *   periodDepreciation: 250.00,
 *   accumulatedDepreciation: 1250.00,
 *   bookValue: 250.00
 * });
 * ```
 */
export declare const createAssetDepreciationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        assetId: string;
        fiscalYear: number;
        fiscalPeriod: number;
        periodDepreciation: number;
        accumulatedDepreciation: number;
        bookValue: number;
        depreciationMethod: string;
        calculationBasis: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Asset Transfers between departments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetTransfer model
 */
export declare const createAssetTransferModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        assetId: string;
        fromDepartmentId: string;
        toDepartmentId: string;
        fromLocationId: string;
        toLocationId: string;
        transferDate: Date;
        transferReason: string;
        transferredBy: string;
        approvedBy: string | null;
        condition: string;
        notes: string;
        status: string;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Physical Inventory Sessions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PhysicalInventory model
 */
export declare const createPhysicalInventoryModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        sessionId: string;
        sessionDate: Date;
        locationId: string;
        conductedBy: string;
        status: string;
        assetsExpected: number;
        assetsFound: number;
        assetsMissing: number;
        assetsSurplus: number;
        completedAt: Date | null;
        notes: string;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Asset Maintenance Records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetMaintenance model
 */
export declare const createAssetMaintenanceModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        assetId: string;
        maintenanceType: string;
        maintenanceDate: Date;
        performedBy: string;
        cost: number;
        description: string;
        nextMaintenanceDate: Date | null;
        downtimeHours: number;
        partsReplaced: string[];
        readonly createdAt: Date;
    };
};
/**
 * Creates a new capital asset with validation.
 *
 * @param {CapitalAssetData} assetData - Asset data
 * @param {Model} CapitalAsset - CapitalAsset model
 * @param {string} userId - User creating asset
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created asset
 *
 * @example
 * ```typescript
 * const asset = await createCapitalAsset({
 *   assetNumber: 'AST-2024-001',
 *   description: 'Dell Laptop',
 *   assetCategory: 'equipment',
 *   acquisitionDate: new Date(),
 *   acquisitionCost: 1500.00,
 *   usefulLifeYears: 5,
 *   depreciationMethod: 'straight_line',
 *   salvageValue: 100.00,
 *   departmentId: 'DEPT001',
 *   locationId: 'LOC001'
 * }, CapitalAsset, 'user123');
 * ```
 */
export declare const createCapitalAsset: (assetData: CapitalAssetData, CapitalAsset: any, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Validates asset data against capitalization thresholds.
 *
 * @param {CapitalAssetData} assetData - Asset data
 * @param {number} [threshold=5000] - Capitalization threshold
 * @returns {{ shouldCapitalize: boolean; reason: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCapitalizationThreshold(assetData, 5000);
 * if (!result.shouldCapitalize) {
 *   console.log('Expense instead:', result.reason);
 * }
 * ```
 */
export declare const validateCapitalizationThreshold: (assetData: CapitalAssetData, threshold?: number) => {
    shouldCapitalize: boolean;
    reason: string;
};
/**
 * Processes asset disposal with gain/loss calculation.
 *
 * @param {AssetDisposalData} disposalData - Disposal data
 * @param {Model} CapitalAsset - CapitalAsset model
 * @param {string} userId - User processing disposal
 * @returns {Promise<any>} Disposal result
 *
 * @example
 * ```typescript
 * const disposal = await processAssetDisposal({
 *   assetId: 'asset-uuid',
 *   disposalDate: new Date(),
 *   disposalMethod: 'sale',
 *   proceedsAmount: 500.00,
 *   bookValueAtDisposal: 250.00,
 *   gainLoss: 250.00,
 *   approvedBy: 'manager123',
 *   disposalReason: 'Obsolete'
 * }, CapitalAsset, 'user456');
 * ```
 */
export declare const processAssetDisposal: (disposalData: AssetDisposalData, CapitalAsset: any, userId: string) => Promise<any>;
/**
 * Generates barcode for new asset.
 *
 * @param {string} assetNumber - Asset number
 * @param {string} prefix - Barcode prefix
 * @returns {string} Generated barcode
 *
 * @example
 * ```typescript
 * const barcode = generateAssetBarcode('AST-2024-001', 'GOV');
 * // Returns: GOV-AST-2024-001-CHECKSUM
 * ```
 */
export declare const generateAssetBarcode: (assetNumber: string, prefix?: string) => string;
/**
 * Assigns RFID tag to asset.
 *
 * @param {string} assetId - Asset ID
 * @param {string} rfidTag - RFID tag identifier
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * await assignRFIDTag('asset-uuid', 'RFID-123456789', CapitalAsset);
 * ```
 */
export declare const assignRFIDTag: (assetId: string, rfidTag: string, CapitalAsset: any) => Promise<any>;
/**
 * Validates asset acquisition data.
 *
 * @param {CapitalAssetData} assetData - Asset data
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateAssetAcquisition(assetData);
 * if (!validation.valid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
export declare const validateAssetAcquisition: (assetData: CapitalAssetData) => {
    valid: boolean;
    errors: string[];
};
/**
 * Calculates straight-line depreciation for a period.
 *
 * @param {number} acquisitionCost - Original cost
 * @param {number} salvageValue - Salvage value
 * @param {number} usefulLifeYears - Useful life
 * @param {number} periodsElapsed - Periods elapsed
 * @returns {DepreciationResult} Depreciation calculation
 *
 * @example
 * ```typescript
 * const result = calculateStraightLineDepreciation(10000, 1000, 5, 1);
 * console.log(`Annual depreciation: ${result.periodDepreciation}`);
 * ```
 */
export declare const calculateStraightLineDepreciation: (acquisitionCost: number, salvageValue: number, usefulLifeYears: number, periodsElapsed: number) => DepreciationResult;
/**
 * Calculates declining balance depreciation.
 *
 * @param {number} acquisitionCost - Original cost
 * @param {number} salvageValue - Salvage value
 * @param {number} usefulLifeYears - Useful life
 * @param {number} periodsElapsed - Periods elapsed
 * @param {number} [rate=2] - Declining balance rate (200% = 2)
 * @returns {DepreciationResult} Depreciation calculation
 *
 * @example
 * ```typescript
 * const result = calculateDecliningBalanceDepreciation(10000, 1000, 5, 1, 2);
 * ```
 */
export declare const calculateDecliningBalanceDepreciation: (acquisitionCost: number, salvageValue: number, usefulLifeYears: number, periodsElapsed: number, rate?: number) => DepreciationResult;
/**
 * Calculates sum-of-years-digits depreciation.
 *
 * @param {number} acquisitionCost - Original cost
 * @param {number} salvageValue - Salvage value
 * @param {number} usefulLifeYears - Useful life
 * @param {number} periodsElapsed - Periods elapsed
 * @returns {DepreciationResult} Depreciation calculation
 *
 * @example
 * ```typescript
 * const result = calculateSumOfYearsDepreciation(10000, 1000, 5, 1);
 * ```
 */
export declare const calculateSumOfYearsDepreciation: (acquisitionCost: number, salvageValue: number, usefulLifeYears: number, periodsElapsed: number) => DepreciationResult;
/**
 * Calculates units-of-production depreciation.
 *
 * @param {number} acquisitionCost - Original cost
 * @param {number} salvageValue - Salvage value
 * @param {number} totalEstimatedUnits - Total estimated production
 * @param {number} unitsProduced - Units produced this period
 * @param {number} totalUnitsToDate - Total units produced to date
 * @returns {DepreciationResult} Depreciation calculation
 *
 * @example
 * ```typescript
 * const result = calculateUnitsOfProductionDepreciation(50000, 5000, 100000, 10000, 10000);
 * ```
 */
export declare const calculateUnitsOfProductionDepreciation: (acquisitionCost: number, salvageValue: number, totalEstimatedUnits: number, unitsProduced: number, totalUnitsToDate: number) => DepreciationResult;
/**
 * Processes depreciation for all active assets.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} CapitalAsset - CapitalAsset model
 * @param {Model} AssetDepreciation - AssetDepreciation model
 * @returns {Promise<any[]>} Depreciation records
 *
 * @example
 * ```typescript
 * const records = await processDepreciationBatch(2024, 12, CapitalAsset, AssetDepreciation);
 * ```
 */
export declare const processDepreciationBatch: (fiscalYear: number, fiscalPeriod: number, CapitalAsset: any, AssetDepreciation: any) => Promise<any[]>;
/**
 * Retrieves depreciation schedule for an asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} AssetDepreciation - AssetDepreciation model
 * @returns {Promise<any[]>} Depreciation history
 *
 * @example
 * ```typescript
 * const schedule = await getDepreciationSchedule('asset-uuid', AssetDepreciation);
 * ```
 */
export declare const getDepreciationSchedule: (assetId: string, AssetDepreciation: any) => Promise<any[]>;
/**
 * Calculates total depreciation expense for period.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} [departmentId] - Optional department filter
 * @param {Model} AssetDepreciation - AssetDepreciation model
 * @returns {Promise<number>} Total depreciation expense
 *
 * @example
 * ```typescript
 * const expense = await calculateTotalDepreciationExpense(2024, 12, 'DEPT001', AssetDepreciation);
 * ```
 */
export declare const calculateTotalDepreciationExpense: (fiscalYear: number, fiscalPeriod: number, departmentId: string | undefined, AssetDepreciation: any) => Promise<number>;
/**
 * Categorizes asset based on type and cost.
 *
 * @param {CapitalAssetData} assetData - Asset data
 * @returns {AssetCategorizationRule} Categorization rule
 *
 * @example
 * ```typescript
 * const rule = categorizeAsset(assetData);
 * console.log(`Category: ${rule.categoryName}, GL: ${rule.glAccountCode}`);
 * ```
 */
export declare const categorizeAsset: (assetData: CapitalAssetData) => AssetCategorizationRule;
/**
 * Applies custom tags to asset.
 *
 * @param {string} assetId - Asset ID
 * @param {string[]} tags - Tags to apply
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * await applyAssetTags('asset-uuid', ['mission-critical', 'high-value'], CapitalAsset);
 * ```
 */
export declare const applyAssetTags: (assetId: string, tags: string[], CapitalAsset: any) => Promise<any>;
/**
 * Searches assets by tags.
 *
 * @param {string[]} tags - Tags to search
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any[]>} Matching assets
 *
 * @example
 * ```typescript
 * const assets = await searchAssetsByTags(['mission-critical'], CapitalAsset);
 * ```
 */
export declare const searchAssetsByTags: (tags: string[], CapitalAsset: any) => Promise<any[]>;
/**
 * Determines GL account code for asset category.
 *
 * @param {string} category - Asset category
 * @returns {string} GL account code
 *
 * @example
 * ```typescript
 * const glCode = determineGLAccount('equipment'); // Returns: '1700-00'
 * ```
 */
export declare const determineGLAccount: (category: string) => string;
/**
 * Generates asset classification report.
 *
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Classification summary
 *
 * @example
 * ```typescript
 * const report = await generateAssetClassificationReport(CapitalAsset);
 * ```
 */
export declare const generateAssetClassificationReport: (CapitalAsset: any) => Promise<any>;
/**
 * Creates physical inventory session.
 *
 * @param {string} locationId - Location to inventory
 * @param {string} conductedBy - Person conducting
 * @param {Model} PhysicalInventory - PhysicalInventory model
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Inventory session
 *
 * @example
 * ```typescript
 * const session = await createPhysicalInventorySession('LOC001', 'user123', PhysicalInventory, CapitalAsset);
 * ```
 */
export declare const createPhysicalInventorySession: (locationId: string, conductedBy: string, PhysicalInventory: any, CapitalAsset: any) => Promise<any>;
/**
 * Records asset scan during inventory.
 *
 * @param {string} sessionId - Inventory session ID
 * @param {BarcodeScanData} scanData - Scan data
 * @param {Model} PhysicalInventory - PhysicalInventory model
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Scan result
 *
 * @example
 * ```typescript
 * const result = await recordInventoryScan('INV-123', scanData, PhysicalInventory, CapitalAsset);
 * ```
 */
export declare const recordInventoryScan: (sessionId: string, scanData: BarcodeScanData, PhysicalInventory: any, CapitalAsset: any) => Promise<any>;
/**
 * Completes physical inventory session.
 *
 * @param {string} sessionId - Session ID
 * @param {Model} PhysicalInventory - PhysicalInventory model
 * @returns {Promise<any>} Completed session
 *
 * @example
 * ```typescript
 * const completed = await completeInventorySession('INV-123', PhysicalInventory);
 * ```
 */
export declare const completeInventorySession: (sessionId: string, PhysicalInventory: any) => Promise<any>;
/**
 * Identifies missing assets from inventory.
 *
 * @param {string} sessionId - Session ID
 * @param {Model} PhysicalInventory - PhysicalInventory model
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any[]>} Missing assets
 *
 * @example
 * ```typescript
 * const missing = await identifyMissingAssets('INV-123', PhysicalInventory, CapitalAsset);
 * ```
 */
export declare const identifyMissingAssets: (sessionId: string, PhysicalInventory: any, CapitalAsset: any) => Promise<any[]>;
/**
 * Generates inventory variance report.
 *
 * @param {string} sessionId - Session ID
 * @param {Model} PhysicalInventory - PhysicalInventory model
 * @returns {Promise<any>} Variance report
 *
 * @example
 * ```typescript
 * const report = await generateInventoryVarianceReport('INV-123', PhysicalInventory);
 * ```
 */
export declare const generateInventoryVarianceReport: (sessionId: string, PhysicalInventory: any) => Promise<any>;
/**
 * Processes RFID inventory scan.
 *
 * @param {RFIDTagData} rfidData - RFID scan data
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Scan result
 *
 * @example
 * ```typescript
 * const result = await processRFIDInventoryScan(rfidData, CapitalAsset);
 * ```
 */
export declare const processRFIDInventoryScan: (rfidData: RFIDTagData, CapitalAsset: any) => Promise<any>;
/**
 * Initiates asset transfer between departments.
 *
 * @param {AssetTransferData} transferData - Transfer data
 * @param {Model} AssetTransfer - AssetTransfer model
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Transfer record
 *
 * @example
 * ```typescript
 * const transfer = await initiateAssetTransfer({
 *   assetId: 'asset-uuid',
 *   fromDepartmentId: 'DEPT001',
 *   toDepartmentId: 'DEPT002',
 *   fromLocationId: 'LOC001',
 *   toLocationId: 'LOC002',
 *   transferDate: new Date(),
 *   transferReason: 'Relocation',
 *   transferredBy: 'user123'
 * }, AssetTransfer, CapitalAsset);
 * ```
 */
export declare const initiateAssetTransfer: (transferData: AssetTransferData, AssetTransfer: any, CapitalAsset: any) => Promise<any>;
/**
 * Approves asset transfer.
 *
 * @param {string} transferId - Transfer ID
 * @param {string} approverId - Approver user ID
 * @param {Model} AssetTransfer - AssetTransfer model
 * @returns {Promise<any>} Approved transfer
 *
 * @example
 * ```typescript
 * await approveAssetTransfer('transfer-uuid', 'manager123', AssetTransfer);
 * ```
 */
export declare const approveAssetTransfer: (transferId: string, approverId: string, AssetTransfer: any) => Promise<any>;
/**
 * Completes asset transfer and updates asset location.
 *
 * @param {string} transferId - Transfer ID
 * @param {Model} AssetTransfer - AssetTransfer model
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Completed transfer
 *
 * @example
 * ```typescript
 * await completeAssetTransfer('transfer-uuid', AssetTransfer, CapitalAsset);
 * ```
 */
export declare const completeAssetTransfer: (transferId: string, AssetTransfer: any, CapitalAsset: any) => Promise<any>;
/**
 * Retrieves transfer history for asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} AssetTransfer - AssetTransfer model
 * @returns {Promise<any[]>} Transfer history
 *
 * @example
 * ```typescript
 * const history = await getAssetTransferHistory('asset-uuid', AssetTransfer);
 * ```
 */
export declare const getAssetTransferHistory: (assetId: string, AssetTransfer: any) => Promise<any[]>;
/**
 * Cancels pending asset transfer.
 *
 * @param {string} transferId - Transfer ID
 * @param {string} reason - Cancellation reason
 * @param {Model} AssetTransfer - AssetTransfer model
 * @returns {Promise<any>} Cancelled transfer
 *
 * @example
 * ```typescript
 * await cancelAssetTransfer('transfer-uuid', 'No longer needed', AssetTransfer);
 * ```
 */
export declare const cancelAssetTransfer: (transferId: string, reason: string, AssetTransfer: any) => Promise<any>;
/**
 * Records asset maintenance activity.
 *
 * @param {AssetMaintenanceRecord} maintenanceData - Maintenance data
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Maintenance record
 *
 * @example
 * ```typescript
 * const maintenance = await recordAssetMaintenance({
 *   assetId: 'asset-uuid',
 *   maintenanceType: 'preventive',
 *   maintenanceDate: new Date(),
 *   performedBy: 'Technician A',
 *   cost: 250.00,
 *   description: 'Oil change and filter replacement',
 *   nextMaintenanceDate: new Date(Date.now() + 90 * 86400000)
 * }, AssetMaintenance, CapitalAsset);
 * ```
 */
export declare const recordAssetMaintenance: (maintenanceData: AssetMaintenanceRecord, AssetMaintenance: any, CapitalAsset: any) => Promise<any>;
/**
 * Retrieves maintenance history for asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @returns {Promise<any[]>} Maintenance history
 *
 * @example
 * ```typescript
 * const history = await getMaintenanceHistory('asset-uuid', AssetMaintenance);
 * ```
 */
export declare const getMaintenanceHistory: (assetId: string, AssetMaintenance: any) => Promise<any[]>;
/**
 * Calculates total maintenance cost for asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Date} [startDate] - Optional start date
 * @param {Date} [endDate] - Optional end date
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @returns {Promise<number>} Total maintenance cost
 *
 * @example
 * ```typescript
 * const cost = await calculateMaintenanceCost('asset-uuid', startDate, endDate, AssetMaintenance);
 * ```
 */
export declare const calculateMaintenanceCost: (assetId: string, startDate: Date | undefined, endDate: Date | undefined, AssetMaintenance: any) => Promise<number>;
/**
 * Schedules preventive maintenance for asset.
 *
 * @param {string} assetId - Asset ID
 * @param {Date} scheduledDate - Scheduled date
 * @param {string} description - Maintenance description
 * @returns {any} Scheduled maintenance
 *
 * @example
 * ```typescript
 * const scheduled = schedulePreventiveMaintenance('asset-uuid', futureDate, 'Annual inspection');
 * ```
 */
export declare const schedulePreventiveMaintenance: (assetId: string, scheduledDate: Date, description: string) => any;
/**
 * Identifies assets requiring maintenance.
 *
 * @param {number} daysAhead - Days to look ahead
 * @param {Model} CapitalAsset - CapitalAsset model
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @returns {Promise<any[]>} Assets requiring maintenance
 *
 * @example
 * ```typescript
 * const assets = await identifyAssetsRequiringMaintenance(30, CapitalAsset, AssetMaintenance);
 * ```
 */
export declare const identifyAssetsRequiringMaintenance: (daysAhead: number, CapitalAsset: any, AssetMaintenance: any) => Promise<any[]>;
/**
 * Performs asset impairment test.
 *
 * @param {AssetImpairmentTest} testData - Test data
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Impairment test result
 *
 * @example
 * ```typescript
 * const result = await performImpairmentTest({
 *   assetId: 'asset-uuid',
 *   testDate: new Date(),
 *   estimatedFairValue: 5000,
 *   currentBookValue: 8000,
 *   impairmentLoss: 3000,
 *   isImpaired: true,
 *   testedBy: 'user123',
 *   impairmentReason: 'Obsolete technology'
 * }, CapitalAsset);
 * ```
 */
export declare const performImpairmentTest: (testData: AssetImpairmentTest, CapitalAsset: any) => Promise<any>;
/**
 * Updates asset valuation.
 *
 * @param {AssetValuation} valuationData - Valuation data
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * await updateAssetValuation({
 *   assetId: 'asset-uuid',
 *   valuationDate: new Date(),
 *   valuationType: 'market',
 *   valuationAmount: 12000,
 *   valuedBy: 'Appraiser Inc',
 *   validUntil: new Date(Date.now() + 365 * 86400000)
 * }, CapitalAsset);
 * ```
 */
export declare const updateAssetValuation: (valuationData: AssetValuation, CapitalAsset: any) => Promise<any>;
/**
 * Retrieves latest asset valuation.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<AssetValuation | null>} Latest valuation
 *
 * @example
 * ```typescript
 * const valuation = await getLatestValuation('asset-uuid', CapitalAsset);
 * ```
 */
export declare const getLatestValuation: (assetId: string, CapitalAsset: any) => Promise<AssetValuation | null>;
/**
 * Identifies impaired assets.
 *
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any[]>} Impaired assets
 *
 * @example
 * ```typescript
 * const impaired = await identifyImpairedAssets(CapitalAsset);
 * ```
 */
export declare const identifyImpairedAssets: (CapitalAsset: any) => Promise<any[]>;
/**
 * Calculates total impairment loss for period.
 *
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<number>} Total impairment loss
 *
 * @example
 * ```typescript
 * const loss = await calculateImpairmentLoss(startDate, endDate, CapitalAsset);
 * ```
 */
export declare const calculateImpairmentLoss: (startDate: Date, endDate: Date, CapitalAsset: any) => Promise<number>;
/**
 * Lists asset as surplus property.
 *
 * @param {SurplusPropertyListing} listingData - Listing data
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * await listSurplusProperty({
 *   assetId: 'asset-uuid',
 *   listedDate: new Date(),
 *   estimatedValue: 5000,
 *   condition: 'good',
 *   availableFor: 'sale',
 *   contactPerson: 'John Doe',
 *   status: 'listed'
 * }, CapitalAsset);
 * ```
 */
export declare const listSurplusProperty: (listingData: SurplusPropertyListing, CapitalAsset: any) => Promise<any>;
/**
 * Retrieves all surplus property listings.
 *
 * @param {string} [status] - Optional status filter
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any[]>} Surplus properties
 *
 * @example
 * ```typescript
 * const surplus = await getSurplusPropertyListings('listed', CapitalAsset);
 * ```
 */
export declare const getSurplusPropertyListings: (status: string | undefined, CapitalAsset: any) => Promise<any[]>;
/**
 * Updates surplus property status.
 *
 * @param {string} assetId - Asset ID
 * @param {string} newStatus - New status
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * await updateSurplusStatus('asset-uuid', 'sold', CapitalAsset);
 * ```
 */
export declare const updateSurplusStatus: (assetId: string, newStatus: string, CapitalAsset: any) => Promise<any>;
/**
 * Generates surplus property catalog.
 *
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any[]>} Surplus catalog
 *
 * @example
 * ```typescript
 * const catalog = await generateSurplusCatalog(CapitalAsset);
 * ```
 */
export declare const generateSurplusCatalog: (CapitalAsset: any) => Promise<any[]>;
/**
 * Removes asset from surplus listings.
 *
 * @param {string} assetId - Asset ID
 * @param {string} reason - Removal reason
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * await removeSurplusListing('asset-uuid', 'Returned to service', CapitalAsset);
 * ```
 */
export declare const removeSurplusListing: (assetId: string, reason: string, CapitalAsset: any) => Promise<any>;
/**
 * Generates comprehensive asset register report.
 *
 * @param {string} [departmentId] - Optional department filter
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any>} Asset register
 *
 * @example
 * ```typescript
 * const register = await generateAssetRegister('DEPT001', CapitalAsset);
 * ```
 */
export declare const generateAssetRegister: (departmentId: string | undefined, CapitalAsset: any) => Promise<any>;
/**
 * Calculates asset utilization rate.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @returns {Promise<number>} Utilization percentage
 *
 * @example
 * ```typescript
 * const utilization = await calculateAssetUtilization('asset-uuid', AssetMaintenance);
 * ```
 */
export declare const calculateAssetUtilization: (assetId: string, AssetMaintenance: any) => Promise<number>;
/**
 * Generates depreciation expense report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} AssetDepreciation - AssetDepreciation model
 * @returns {Promise<any>} Depreciation report
 *
 * @example
 * ```typescript
 * const report = await generateDepreciationReport(2024, AssetDepreciation);
 * ```
 */
export declare const generateDepreciationReport: (fiscalYear: number, AssetDepreciation: any) => Promise<any>;
/**
 * Exports asset data to CSV format.
 *
 * @param {any[]} assets - Assets to export
 * @returns {string} CSV formatted data
 *
 * @example
 * ```typescript
 * const csv = exportAssetsToCSV(assets);
 * fs.writeFileSync('assets.csv', csv);
 * ```
 */
export declare const exportAssetsToCSV: (assets: any[]) => string;
/**
 * Identifies high-value assets requiring special attention.
 *
 * @param {number} threshold - Value threshold
 * @param {Model} CapitalAsset - CapitalAsset model
 * @returns {Promise<any[]>} High-value assets
 *
 * @example
 * ```typescript
 * const highValue = await identifyHighValueAssets(100000, CapitalAsset);
 * ```
 */
export declare const identifyHighValueAssets: (threshold: number, CapitalAsset: any) => Promise<any[]>;
/**
 * Generates asset lifecycle analysis.
 *
 * @param {string} assetId - Asset ID
 * @param {Model} CapitalAsset - CapitalAsset model
 * @param {Model} AssetDepreciation - AssetDepreciation model
 * @param {Model} AssetMaintenance - AssetMaintenance model
 * @returns {Promise<any>} Lifecycle analysis
 *
 * @example
 * ```typescript
 * const analysis = await generateAssetLifecycleAnalysis('asset-uuid', CapitalAsset, AssetDepreciation, AssetMaintenance);
 * ```
 */
export declare const generateAssetLifecycleAnalysis: (assetId: string, CapitalAsset: any, AssetDepreciation: any, AssetMaintenance: any) => Promise<any>;
/**
 * NestJS Injectable service for Government Asset Inventory Management.
 *
 * @example
 * ```typescript
 * @Controller('assets')
 * export class AssetController {
 *   constructor(private readonly assetService: AssetInventoryService) {}
 *
 *   @Post()
 *   async createAsset(@Body() data: CapitalAssetData) {
 *     return this.assetService.createAsset(data);
 *   }
 * }
 * ```
 */
export declare class AssetInventoryService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    createAsset(data: CapitalAssetData, userId: string): Promise<any>;
    processDepreciation(fiscalYear: number, fiscalPeriod: number): Promise<any[]>;
    createInventorySession(locationId: string, conductedBy: string): Promise<any>;
    initiateTransfer(transferData: AssetTransferData): Promise<any>;
}
/**
 * Default export with all asset management utilities.
 */
declare const _default: {
    createCapitalAssetModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            assetNumber: string;
            description: string;
            assetCategory: string;
            acquisitionDate: Date;
            acquisitionCost: number;
            usefulLifeYears: number;
            depreciationMethod: string;
            salvageValue: number;
            departmentId: string;
            locationId: string;
            serialNumber: string | null;
            manufacturer: string | null;
            model: string | null;
            warrantyExpiration: Date | null;
            accumulatedDepreciation: number;
            bookValue: number;
            status: string;
            barcode: string | null;
            rfidTag: string | null;
            lastInventoryDate: Date | null;
            lastMaintenanceDate: Date | null;
            disposalDate: Date | null;
            fiscalYear: number;
            glAccountCode: string;
            responsiblePerson: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createAssetDepreciationModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            assetId: string;
            fiscalYear: number;
            fiscalPeriod: number;
            periodDepreciation: number;
            accumulatedDepreciation: number;
            bookValue: number;
            depreciationMethod: string;
            calculationBasis: Record<string, any>;
            readonly createdAt: Date;
        };
    };
    createAssetTransferModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            assetId: string;
            fromDepartmentId: string;
            toDepartmentId: string;
            fromLocationId: string;
            toLocationId: string;
            transferDate: Date;
            transferReason: string;
            transferredBy: string;
            approvedBy: string | null;
            condition: string;
            notes: string;
            status: string;
            readonly createdAt: Date;
        };
    };
    createPhysicalInventoryModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            sessionId: string;
            sessionDate: Date;
            locationId: string;
            conductedBy: string;
            status: string;
            assetsExpected: number;
            assetsFound: number;
            assetsMissing: number;
            assetsSurplus: number;
            completedAt: Date | null;
            notes: string;
            readonly createdAt: Date;
        };
    };
    createAssetMaintenanceModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            assetId: string;
            maintenanceType: string;
            maintenanceDate: Date;
            performedBy: string;
            cost: number;
            description: string;
            nextMaintenanceDate: Date | null;
            downtimeHours: number;
            partsReplaced: string[];
            readonly createdAt: Date;
        };
    };
    createCapitalAsset: (assetData: CapitalAssetData, CapitalAsset: any, userId: string, transaction?: Transaction) => Promise<any>;
    validateCapitalizationThreshold: (assetData: CapitalAssetData, threshold?: number) => {
        shouldCapitalize: boolean;
        reason: string;
    };
    processAssetDisposal: (disposalData: AssetDisposalData, CapitalAsset: any, userId: string) => Promise<any>;
    generateAssetBarcode: (assetNumber: string, prefix?: string) => string;
    assignRFIDTag: (assetId: string, rfidTag: string, CapitalAsset: any) => Promise<any>;
    validateAssetAcquisition: (assetData: CapitalAssetData) => {
        valid: boolean;
        errors: string[];
    };
    calculateStraightLineDepreciation: (acquisitionCost: number, salvageValue: number, usefulLifeYears: number, periodsElapsed: number) => DepreciationResult;
    calculateDecliningBalanceDepreciation: (acquisitionCost: number, salvageValue: number, usefulLifeYears: number, periodsElapsed: number, rate?: number) => DepreciationResult;
    calculateSumOfYearsDepreciation: (acquisitionCost: number, salvageValue: number, usefulLifeYears: number, periodsElapsed: number) => DepreciationResult;
    calculateUnitsOfProductionDepreciation: (acquisitionCost: number, salvageValue: number, totalEstimatedUnits: number, unitsProduced: number, totalUnitsToDate: number) => DepreciationResult;
    processDepreciationBatch: (fiscalYear: number, fiscalPeriod: number, CapitalAsset: any, AssetDepreciation: any) => Promise<any[]>;
    getDepreciationSchedule: (assetId: string, AssetDepreciation: any) => Promise<any[]>;
    calculateTotalDepreciationExpense: (fiscalYear: number, fiscalPeriod: number, departmentId: string | undefined, AssetDepreciation: any) => Promise<number>;
    categorizeAsset: (assetData: CapitalAssetData) => AssetCategorizationRule;
    applyAssetTags: (assetId: string, tags: string[], CapitalAsset: any) => Promise<any>;
    searchAssetsByTags: (tags: string[], CapitalAsset: any) => Promise<any[]>;
    determineGLAccount: (category: string) => string;
    generateAssetClassificationReport: (CapitalAsset: any) => Promise<any>;
    createPhysicalInventorySession: (locationId: string, conductedBy: string, PhysicalInventory: any, CapitalAsset: any) => Promise<any>;
    recordInventoryScan: (sessionId: string, scanData: BarcodeScanData, PhysicalInventory: any, CapitalAsset: any) => Promise<any>;
    completeInventorySession: (sessionId: string, PhysicalInventory: any) => Promise<any>;
    identifyMissingAssets: (sessionId: string, PhysicalInventory: any, CapitalAsset: any) => Promise<any[]>;
    generateInventoryVarianceReport: (sessionId: string, PhysicalInventory: any) => Promise<any>;
    processRFIDInventoryScan: (rfidData: RFIDTagData, CapitalAsset: any) => Promise<any>;
    initiateAssetTransfer: (transferData: AssetTransferData, AssetTransfer: any, CapitalAsset: any) => Promise<any>;
    approveAssetTransfer: (transferId: string, approverId: string, AssetTransfer: any) => Promise<any>;
    completeAssetTransfer: (transferId: string, AssetTransfer: any, CapitalAsset: any) => Promise<any>;
    getAssetTransferHistory: (assetId: string, AssetTransfer: any) => Promise<any[]>;
    cancelAssetTransfer: (transferId: string, reason: string, AssetTransfer: any) => Promise<any>;
    recordAssetMaintenance: (maintenanceData: AssetMaintenanceRecord, AssetMaintenance: any, CapitalAsset: any) => Promise<any>;
    getMaintenanceHistory: (assetId: string, AssetMaintenance: any) => Promise<any[]>;
    calculateMaintenanceCost: (assetId: string, startDate: Date | undefined, endDate: Date | undefined, AssetMaintenance: any) => Promise<number>;
    schedulePreventiveMaintenance: (assetId: string, scheduledDate: Date, description: string) => any;
    identifyAssetsRequiringMaintenance: (daysAhead: number, CapitalAsset: any, AssetMaintenance: any) => Promise<any[]>;
    performImpairmentTest: (testData: AssetImpairmentTest, CapitalAsset: any) => Promise<any>;
    updateAssetValuation: (valuationData: AssetValuation, CapitalAsset: any) => Promise<any>;
    getLatestValuation: (assetId: string, CapitalAsset: any) => Promise<AssetValuation | null>;
    identifyImpairedAssets: (CapitalAsset: any) => Promise<any[]>;
    calculateImpairmentLoss: (startDate: Date, endDate: Date, CapitalAsset: any) => Promise<number>;
    listSurplusProperty: (listingData: SurplusPropertyListing, CapitalAsset: any) => Promise<any>;
    getSurplusPropertyListings: (status: string | undefined, CapitalAsset: any) => Promise<any[]>;
    updateSurplusStatus: (assetId: string, newStatus: string, CapitalAsset: any) => Promise<any>;
    generateSurplusCatalog: (CapitalAsset: any) => Promise<any[]>;
    removeSurplusListing: (assetId: string, reason: string, CapitalAsset: any) => Promise<any>;
    generateAssetRegister: (departmentId: string | undefined, CapitalAsset: any) => Promise<any>;
    calculateAssetUtilization: (assetId: string, AssetMaintenance: any) => Promise<number>;
    generateDepreciationReport: (fiscalYear: number, AssetDepreciation: any) => Promise<any>;
    exportAssetsToCSV: (assets: any[]) => string;
    identifyHighValueAssets: (threshold: number, CapitalAsset: any) => Promise<any[]>;
    generateAssetLifecycleAnalysis: (assetId: string, CapitalAsset: any, AssetDepreciation: any, AssetMaintenance: any) => Promise<any>;
    AssetInventoryService: typeof AssetInventoryService;
};
export default _default;
//# sourceMappingURL=asset-inventory-management-kit.d.ts.map