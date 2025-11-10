"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssetRegister = exports.removeSurplusListing = exports.generateSurplusCatalog = exports.updateSurplusStatus = exports.getSurplusPropertyListings = exports.listSurplusProperty = exports.calculateImpairmentLoss = exports.identifyImpairedAssets = exports.getLatestValuation = exports.updateAssetValuation = exports.performImpairmentTest = exports.identifyAssetsRequiringMaintenance = exports.schedulePreventiveMaintenance = exports.calculateMaintenanceCost = exports.getMaintenanceHistory = exports.recordAssetMaintenance = exports.cancelAssetTransfer = exports.getAssetTransferHistory = exports.completeAssetTransfer = exports.approveAssetTransfer = exports.initiateAssetTransfer = exports.processRFIDInventoryScan = exports.generateInventoryVarianceReport = exports.identifyMissingAssets = exports.completeInventorySession = exports.recordInventoryScan = exports.createPhysicalInventorySession = exports.generateAssetClassificationReport = exports.determineGLAccount = exports.searchAssetsByTags = exports.applyAssetTags = exports.categorizeAsset = exports.calculateTotalDepreciationExpense = exports.getDepreciationSchedule = exports.processDepreciationBatch = exports.calculateUnitsOfProductionDepreciation = exports.calculateSumOfYearsDepreciation = exports.calculateDecliningBalanceDepreciation = exports.calculateStraightLineDepreciation = exports.validateAssetAcquisition = exports.assignRFIDTag = exports.generateAssetBarcode = exports.processAssetDisposal = exports.validateCapitalizationThreshold = exports.createCapitalAsset = exports.createAssetMaintenanceModel = exports.createPhysicalInventoryModel = exports.createAssetTransferModel = exports.createAssetDepreciationModel = exports.createCapitalAssetModel = void 0;
exports.AssetInventoryService = exports.generateAssetLifecycleAnalysis = exports.identifyHighValueAssets = exports.exportAssetsToCSV = exports.generateDepreciationReport = exports.calculateAssetUtilization = void 0;
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
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
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
const createCapitalAssetModel = (sequelize) => {
    class CapitalAsset extends sequelize_1.Model {
    }
    CapitalAsset.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        assetNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique asset identifier',
            validate: {
                notEmpty: true,
            },
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Asset description',
        },
        assetCategory: {
            type: sequelize_1.DataTypes.ENUM('land', 'building', 'equipment', 'vehicle', 'infrastructure', 'software', 'furniture'),
            allowNull: false,
            comment: 'Asset category',
        },
        acquisitionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date asset was acquired',
        },
        acquisitionCost: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Original acquisition cost',
            validate: {
                min: 0,
            },
        },
        usefulLifeYears: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Estimated useful life in years',
            validate: {
                min: 1,
            },
        },
        depreciationMethod: {
            type: sequelize_1.DataTypes.ENUM('straight_line', 'declining_balance', 'units_of_production', 'sum_of_years'),
            allowNull: false,
            comment: 'Depreciation calculation method',
        },
        salvageValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Estimated salvage value',
        },
        departmentId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Owning department',
        },
        locationId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Physical location',
        },
        serialNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Serial number',
        },
        manufacturer: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            comment: 'Manufacturer name',
        },
        model: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            comment: 'Model number',
        },
        warrantyExpiration: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Warranty expiration date',
        },
        accumulatedDepreciation: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total accumulated depreciation',
        },
        bookValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Current book value',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'in_service', 'maintenance', 'surplus', 'disposed', 'stolen', 'lost'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Asset status',
        },
        barcode: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            unique: true,
            comment: 'Barcode identifier',
        },
        rfidTag: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            unique: true,
            comment: 'RFID tag identifier',
        },
        lastInventoryDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last physical inventory date',
        },
        lastMaintenanceDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last maintenance date',
        },
        disposalDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date asset was disposed',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year of acquisition',
        },
        glAccountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'General ledger account code',
        },
        responsiblePerson: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Person responsible for asset',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'capital_assets',
        timestamps: true,
        indexes: [
            { fields: ['assetNumber'], unique: true },
            { fields: ['assetCategory'] },
            { fields: ['departmentId'] },
            { fields: ['locationId'] },
            { fields: ['status'] },
            { fields: ['barcode'] },
            { fields: ['rfidTag'] },
            { fields: ['fiscalYear'] },
            { fields: ['serialNumber'] },
        ],
    });
    return CapitalAsset;
};
exports.createCapitalAssetModel = createCapitalAssetModel;
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
const createAssetDepreciationModel = (sequelize) => {
    class AssetDepreciation extends sequelize_1.Model {
    }
    AssetDepreciation.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        assetId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Related asset ID',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
        },
        fiscalPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal period (1-12)',
            validate: {
                min: 1,
                max: 12,
            },
        },
        periodDepreciation: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Depreciation for period',
        },
        accumulatedDepreciation: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Total accumulated depreciation',
        },
        bookValue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Book value after depreciation',
        },
        depreciationMethod: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Method used for calculation',
        },
        calculationBasis: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Calculation details',
        },
    }, {
        sequelize,
        tableName: 'asset_depreciation',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['assetId'] },
            { fields: ['fiscalYear', 'fiscalPeriod'] },
        ],
    });
    return AssetDepreciation;
};
exports.createAssetDepreciationModel = createAssetDepreciationModel;
/**
 * Sequelize model for Asset Transfers between departments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetTransfer model
 */
const createAssetTransferModel = (sequelize) => {
    class AssetTransfer extends sequelize_1.Model {
    }
    AssetTransfer.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        assetId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Asset being transferred',
        },
        fromDepartmentId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Source department',
        },
        toDepartmentId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Destination department',
        },
        fromLocationId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Source location',
        },
        toLocationId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Destination location',
        },
        transferDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Transfer date',
        },
        transferReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Reason for transfer',
        },
        transferredBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User initiating transfer',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Approving authority',
        },
        condition: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'good',
            comment: 'Asset condition at transfer',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
            comment: 'Transfer notes',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'in_transit', 'completed', 'rejected'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Transfer status',
        },
    }, {
        sequelize,
        tableName: 'asset_transfers',
        timestamps: true,
        indexes: [
            { fields: ['assetId'] },
            { fields: ['fromDepartmentId'] },
            { fields: ['toDepartmentId'] },
            { fields: ['status'] },
            { fields: ['transferDate'] },
        ],
    });
    return AssetTransfer;
};
exports.createAssetTransferModel = createAssetTransferModel;
/**
 * Sequelize model for Physical Inventory Sessions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PhysicalInventory model
 */
const createPhysicalInventoryModel = (sequelize) => {
    class PhysicalInventory extends sequelize_1.Model {
    }
    PhysicalInventory.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        sessionId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Inventory session identifier',
        },
        sessionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Inventory date',
        },
        locationId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Location being inventoried',
        },
        conductedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Person conducting inventory',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('in_progress', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'in_progress',
            comment: 'Session status',
        },
        assetsExpected: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Expected asset count',
        },
        assetsFound: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Assets found during inventory',
        },
        assetsMissing: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Missing assets',
        },
        assetsSurplus: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Surplus assets found',
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Completion timestamp',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
            comment: 'Inventory notes',
        },
    }, {
        sequelize,
        tableName: 'physical_inventories',
        timestamps: true,
        indexes: [
            { fields: ['sessionId'], unique: true },
            { fields: ['locationId'] },
            { fields: ['sessionDate'] },
            { fields: ['status'] },
        ],
    });
    return PhysicalInventory;
};
exports.createPhysicalInventoryModel = createPhysicalInventoryModel;
/**
 * Sequelize model for Asset Maintenance Records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetMaintenance model
 */
const createAssetMaintenanceModel = (sequelize) => {
    class AssetMaintenance extends sequelize_1.Model {
    }
    AssetMaintenance.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        assetId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Asset ID',
        },
        maintenanceType: {
            type: sequelize_1.DataTypes.ENUM('preventive', 'corrective', 'predictive', 'emergency'),
            allowNull: false,
            comment: 'Type of maintenance',
        },
        maintenanceDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date maintenance performed',
        },
        performedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Person or vendor',
        },
        cost: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Maintenance cost',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Work performed',
        },
        nextMaintenanceDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Next scheduled maintenance',
        },
        downtimeHours: {
            type: sequelize_1.DataTypes.DECIMAL(8, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Hours of downtime',
        },
        partsReplaced: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'List of parts replaced',
        },
    }, {
        sequelize,
        tableName: 'asset_maintenance',
        timestamps: true,
        indexes: [
            { fields: ['assetId'] },
            { fields: ['maintenanceType'] },
            { fields: ['maintenanceDate'] },
        ],
    });
    return AssetMaintenance;
};
exports.createAssetMaintenanceModel = createAssetMaintenanceModel;
// ============================================================================
// ASSET ACQUISITION & DISPOSAL (1-6)
// ============================================================================
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
const createCapitalAsset = async (assetData, CapitalAsset, userId, transaction) => {
    const fiscalYear = assetData.acquisitionDate.getFullYear();
    const bookValue = assetData.acquisitionCost;
    const asset = await CapitalAsset.create({
        ...assetData,
        fiscalYear,
        bookValue,
        accumulatedDepreciation: 0,
        status: 'active',
        responsiblePerson: userId,
        glAccountCode: (0, exports.determineGLAccount)(assetData.assetCategory),
    }, { transaction });
    return asset;
};
exports.createCapitalAsset = createCapitalAsset;
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
const validateCapitalizationThreshold = (assetData, threshold = 5000) => {
    if (assetData.acquisitionCost < threshold) {
        return {
            shouldCapitalize: false,
            reason: `Cost ${assetData.acquisitionCost} below threshold ${threshold}`,
        };
    }
    if (assetData.usefulLifeYears < 1) {
        return {
            shouldCapitalize: false,
            reason: 'Useful life less than 1 year',
        };
    }
    return {
        shouldCapitalize: true,
        reason: 'Meets capitalization criteria',
    };
};
exports.validateCapitalizationThreshold = validateCapitalizationThreshold;
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
const processAssetDisposal = async (disposalData, CapitalAsset, userId) => {
    const asset = await CapitalAsset.findByPk(disposalData.assetId);
    if (!asset)
        throw new Error('Asset not found');
    asset.status = 'disposed';
    asset.disposalDate = disposalData.disposalDate;
    asset.metadata = {
        ...asset.metadata,
        disposal: {
            method: disposalData.disposalMethod,
            proceeds: disposalData.proceedsAmount,
            gainLoss: disposalData.gainLoss,
            approvedBy: disposalData.approvedBy,
            reason: disposalData.disposalReason,
            processedBy: userId,
        },
    };
    await asset.save();
    return {
        asset,
        gainLoss: disposalData.gainLoss,
        journalEntry: generateDisposalJournalEntry(asset, disposalData),
    };
};
exports.processAssetDisposal = processAssetDisposal;
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
const generateAssetBarcode = (assetNumber, prefix = 'GOV') => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const checksum = calculateBarcodeChecksum(assetNumber);
    return `${prefix}-${assetNumber}-${timestamp}-${checksum}`;
};
exports.generateAssetBarcode = generateAssetBarcode;
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
const assignRFIDTag = async (assetId, rfidTag, CapitalAsset) => {
    const asset = await CapitalAsset.findByPk(assetId);
    if (!asset)
        throw new Error('Asset not found');
    asset.rfidTag = rfidTag;
    await asset.save();
    return asset;
};
exports.assignRFIDTag = assignRFIDTag;
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
const validateAssetAcquisition = (assetData) => {
    const errors = [];
    if (!assetData.assetNumber)
        errors.push('Asset number required');
    if (!assetData.description)
        errors.push('Description required');
    if (assetData.acquisitionCost <= 0)
        errors.push('Cost must be positive');
    if (assetData.usefulLifeYears <= 0)
        errors.push('Useful life must be positive');
    if (assetData.salvageValue < 0)
        errors.push('Salvage value cannot be negative');
    if (assetData.salvageValue >= assetData.acquisitionCost) {
        errors.push('Salvage value must be less than acquisition cost');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateAssetAcquisition = validateAssetAcquisition;
// ============================================================================
// DEPRECIATION CALCULATIONS (7-13)
// ============================================================================
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
const calculateStraightLineDepreciation = (acquisitionCost, salvageValue, usefulLifeYears, periodsElapsed) => {
    const annualDepreciation = (acquisitionCost - salvageValue) / usefulLifeYears;
    const accumulatedDepreciation = Math.min(annualDepreciation * periodsElapsed, acquisitionCost - salvageValue);
    const bookValue = acquisitionCost - accumulatedDepreciation;
    return {
        assetId: '',
        fiscalYear: new Date().getFullYear(),
        periodDepreciation: annualDepreciation,
        accumulatedDepreciation,
        bookValue,
        method: 'straight_line',
        calculatedAt: new Date(),
    };
};
exports.calculateStraightLineDepreciation = calculateStraightLineDepreciation;
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
const calculateDecliningBalanceDepreciation = (acquisitionCost, salvageValue, usefulLifeYears, periodsElapsed, rate = 2) => {
    const depreciationRate = rate / usefulLifeYears;
    let bookValue = acquisitionCost;
    let accumulatedDepreciation = 0;
    for (let i = 0; i < periodsElapsed; i++) {
        const periodDepreciation = Math.max(0, Math.min(bookValue * depreciationRate, bookValue - salvageValue));
        accumulatedDepreciation += periodDepreciation;
        bookValue -= periodDepreciation;
    }
    return {
        assetId: '',
        fiscalYear: new Date().getFullYear(),
        periodDepreciation: bookValue * depreciationRate,
        accumulatedDepreciation,
        bookValue,
        method: 'declining_balance',
        calculatedAt: new Date(),
    };
};
exports.calculateDecliningBalanceDepreciation = calculateDecliningBalanceDepreciation;
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
const calculateSumOfYearsDepreciation = (acquisitionCost, salvageValue, usefulLifeYears, periodsElapsed) => {
    const depreciableBase = acquisitionCost - salvageValue;
    const sumOfYears = (usefulLifeYears * (usefulLifeYears + 1)) / 2;
    let accumulatedDepreciation = 0;
    for (let year = 1; year <= periodsElapsed; year++) {
        const remainingLife = usefulLifeYears - year + 1;
        const yearDepreciation = (remainingLife / sumOfYears) * depreciableBase;
        accumulatedDepreciation += yearDepreciation;
    }
    const bookValue = acquisitionCost - accumulatedDepreciation;
    const currentYearFraction = (usefulLifeYears - periodsElapsed + 1) / sumOfYears;
    const periodDepreciation = currentYearFraction * depreciableBase;
    return {
        assetId: '',
        fiscalYear: new Date().getFullYear(),
        periodDepreciation,
        accumulatedDepreciation,
        bookValue,
        method: 'sum_of_years',
        calculatedAt: new Date(),
    };
};
exports.calculateSumOfYearsDepreciation = calculateSumOfYearsDepreciation;
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
const calculateUnitsOfProductionDepreciation = (acquisitionCost, salvageValue, totalEstimatedUnits, unitsProduced, totalUnitsToDate) => {
    const depreciableBase = acquisitionCost - salvageValue;
    const perUnitDepreciation = depreciableBase / totalEstimatedUnits;
    const periodDepreciation = perUnitDepreciation * unitsProduced;
    const accumulatedDepreciation = perUnitDepreciation * totalUnitsToDate;
    const bookValue = acquisitionCost - accumulatedDepreciation;
    return {
        assetId: '',
        fiscalYear: new Date().getFullYear(),
        periodDepreciation,
        accumulatedDepreciation,
        bookValue,
        method: 'units_of_production',
        calculatedAt: new Date(),
    };
};
exports.calculateUnitsOfProductionDepreciation = calculateUnitsOfProductionDepreciation;
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
const processDepreciationBatch = async (fiscalYear, fiscalPeriod, CapitalAsset, AssetDepreciation) => {
    const assets = await CapitalAsset.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['active', 'in_service'] },
        },
    });
    const depreciationRecords = [];
    for (const asset of assets) {
        const yearsElapsed = fiscalYear - asset.fiscalYear + fiscalPeriod / 12;
        let result;
        switch (asset.depreciationMethod) {
            case 'straight_line':
                result = (0, exports.calculateStraightLineDepreciation)(parseFloat(asset.acquisitionCost), parseFloat(asset.salvageValue), asset.usefulLifeYears, yearsElapsed);
                break;
            case 'declining_balance':
                result = (0, exports.calculateDecliningBalanceDepreciation)(parseFloat(asset.acquisitionCost), parseFloat(asset.salvageValue), asset.usefulLifeYears, yearsElapsed);
                break;
            case 'sum_of_years':
                result = (0, exports.calculateSumOfYearsDepreciation)(parseFloat(asset.acquisitionCost), parseFloat(asset.salvageValue), asset.usefulLifeYears, yearsElapsed);
                break;
            default:
                continue;
        }
        const record = await AssetDepreciation.create({
            assetId: asset.id,
            fiscalYear,
            fiscalPeriod,
            periodDepreciation: result.periodDepreciation,
            accumulatedDepreciation: result.accumulatedDepreciation,
            bookValue: result.bookValue,
            depreciationMethod: asset.depreciationMethod,
            calculationBasis: {
                acquisitionCost: asset.acquisitionCost,
                salvageValue: asset.salvageValue,
                usefulLifeYears: asset.usefulLifeYears,
            },
        });
        // Update asset
        asset.accumulatedDepreciation = result.accumulatedDepreciation;
        asset.bookValue = result.bookValue;
        await asset.save();
        depreciationRecords.push(record);
    }
    return depreciationRecords;
};
exports.processDepreciationBatch = processDepreciationBatch;
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
const getDepreciationSchedule = async (assetId, AssetDepreciation) => {
    return await AssetDepreciation.findAll({
        where: { assetId },
        order: [['fiscalYear', 'ASC'], ['fiscalPeriod', 'ASC']],
    });
};
exports.getDepreciationSchedule = getDepreciationSchedule;
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
const calculateTotalDepreciationExpense = async (fiscalYear, fiscalPeriod, departmentId, AssetDepreciation) => {
    const where = { fiscalYear, fiscalPeriod };
    const records = await AssetDepreciation.findAll({ where });
    return records.reduce((sum, r) => sum + parseFloat(r.periodDepreciation), 0);
};
exports.calculateTotalDepreciationExpense = calculateTotalDepreciationExpense;
// ============================================================================
// ASSET CATEGORIZATION & TAGGING (14-18)
// ============================================================================
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
const categorizeAsset = (assetData) => {
    const rules = {
        equipment: {
            categoryName: 'Equipment',
            capitalizationThreshold: 5000,
            depreciationMethod: 'straight_line',
            usefulLifeYears: 5,
            glAccountCode: '1700-00',
            requiresApproval: true,
        },
        vehicle: {
            categoryName: 'Vehicles',
            capitalizationThreshold: 5000,
            depreciationMethod: 'declining_balance',
            usefulLifeYears: 5,
            glAccountCode: '1710-00',
            requiresApproval: true,
        },
        building: {
            categoryName: 'Buildings',
            capitalizationThreshold: 50000,
            depreciationMethod: 'straight_line',
            usefulLifeYears: 40,
            glAccountCode: '1600-00',
            requiresApproval: true,
        },
        land: {
            categoryName: 'Land',
            capitalizationThreshold: 0,
            depreciationMethod: 'straight_line',
            usefulLifeYears: 0,
            glAccountCode: '1500-00',
            requiresApproval: true,
        },
        infrastructure: {
            categoryName: 'Infrastructure',
            capitalizationThreshold: 100000,
            depreciationMethod: 'straight_line',
            usefulLifeYears: 50,
            glAccountCode: '1800-00',
            requiresApproval: true,
        },
    };
    return rules[assetData.assetCategory] || rules.equipment;
};
exports.categorizeAsset = categorizeAsset;
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
const applyAssetTags = async (assetId, tags, CapitalAsset) => {
    const asset = await CapitalAsset.findByPk(assetId);
    if (!asset)
        throw new Error('Asset not found');
    asset.metadata = {
        ...asset.metadata,
        tags: [...new Set([...(asset.metadata.tags || []), ...tags])],
    };
    await asset.save();
    return asset;
};
exports.applyAssetTags = applyAssetTags;
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
const searchAssetsByTags = async (tags, CapitalAsset) => {
    const assets = await CapitalAsset.findAll();
    return assets.filter((asset) => {
        const assetTags = asset.metadata?.tags || [];
        return tags.some(tag => assetTags.includes(tag));
    });
};
exports.searchAssetsByTags = searchAssetsByTags;
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
const determineGLAccount = (category) => {
    const glAccounts = {
        land: '1500-00',
        building: '1600-00',
        equipment: '1700-00',
        vehicle: '1710-00',
        infrastructure: '1800-00',
        software: '1750-00',
        furniture: '1720-00',
    };
    return glAccounts[category] || '1700-00';
};
exports.determineGLAccount = determineGLAccount;
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
const generateAssetClassificationReport = async (CapitalAsset) => {
    const assets = await CapitalAsset.findAll({
        where: { status: { [sequelize_1.Op.in]: ['active', 'in_service'] } },
    });
    const byCategory = assets.reduce((acc, asset) => {
        const cat = asset.assetCategory;
        if (!acc[cat]) {
            acc[cat] = { count: 0, totalCost: 0, totalBookValue: 0 };
        }
        acc[cat].count++;
        acc[cat].totalCost += parseFloat(asset.acquisitionCost);
        acc[cat].totalBookValue += parseFloat(asset.bookValue);
        return acc;
    }, {});
    return byCategory;
};
exports.generateAssetClassificationReport = generateAssetClassificationReport;
// ============================================================================
// PHYSICAL INVENTORY MANAGEMENT (19-24)
// ============================================================================
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
const createPhysicalInventorySession = async (locationId, conductedBy, PhysicalInventory, CapitalAsset) => {
    const expectedAssets = await CapitalAsset.count({
        where: {
            locationId,
            status: { [sequelize_1.Op.in]: ['active', 'in_service'] },
        },
    });
    const sessionId = `INV-${Date.now()}`;
    return await PhysicalInventory.create({
        sessionId,
        sessionDate: new Date(),
        locationId,
        conductedBy,
        status: 'in_progress',
        assetsExpected: expectedAssets,
        assetsFound: 0,
        assetsMissing: 0,
        assetsSurplus: 0,
    });
};
exports.createPhysicalInventorySession = createPhysicalInventorySession;
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
const recordInventoryScan = async (sessionId, scanData, PhysicalInventory, CapitalAsset) => {
    const session = await PhysicalInventory.findOne({ where: { sessionId } });
    if (!session)
        throw new Error('Session not found');
    const asset = await CapitalAsset.findOne({
        where: { barcode: scanData.barcode },
    });
    if (asset) {
        asset.lastInventoryDate = new Date();
        await asset.save();
        session.assetsFound++;
        await session.save();
        return { found: true, asset };
    }
    session.assetsSurplus++;
    await session.save();
    return { found: false, barcode: scanData.barcode };
};
exports.recordInventoryScan = recordInventoryScan;
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
const completeInventorySession = async (sessionId, PhysicalInventory) => {
    const session = await PhysicalInventory.findOne({ where: { sessionId } });
    if (!session)
        throw new Error('Session not found');
    session.status = 'completed';
    session.completedAt = new Date();
    session.assetsMissing = session.assetsExpected - session.assetsFound;
    await session.save();
    return session;
};
exports.completeInventorySession = completeInventorySession;
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
const identifyMissingAssets = async (sessionId, PhysicalInventory, CapitalAsset) => {
    const session = await PhysicalInventory.findOne({ where: { sessionId } });
    if (!session)
        throw new Error('Session not found');
    const expectedAssets = await CapitalAsset.findAll({
        where: {
            locationId: session.locationId,
            status: { [sequelize_1.Op.in]: ['active', 'in_service'] },
        },
    });
    const inventoriedAssets = await CapitalAsset.findAll({
        where: {
            locationId: session.locationId,
            lastInventoryDate: { [sequelize_1.Op.gte]: session.sessionDate },
        },
    });
    const inventoriedIds = new Set(inventoriedAssets.map((a) => a.id));
    return expectedAssets.filter((a) => !inventoriedIds.has(a.id));
};
exports.identifyMissingAssets = identifyMissingAssets;
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
const generateInventoryVarianceReport = async (sessionId, PhysicalInventory) => {
    const session = await PhysicalInventory.findOne({ where: { sessionId } });
    if (!session)
        throw new Error('Session not found');
    const variancePercent = session.assetsExpected > 0
        ? ((session.assetsFound / session.assetsExpected) * 100)
        : 0;
    return {
        sessionId,
        locationId: session.locationId,
        conductedBy: session.conductedBy,
        sessionDate: session.sessionDate,
        expected: session.assetsExpected,
        found: session.assetsFound,
        missing: session.assetsMissing,
        surplus: session.assetsSurplus,
        variancePercent,
        accuracy: variancePercent,
    };
};
exports.generateInventoryVarianceReport = generateInventoryVarianceReport;
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
const processRFIDInventoryScan = async (rfidData, CapitalAsset) => {
    const asset = await CapitalAsset.findOne({
        where: { rfidTag: rfidData.rfidTag },
    });
    if (!asset) {
        return { found: false, rfidTag: rfidData.rfidTag };
    }
    asset.lastInventoryDate = rfidData.lastReadTime;
    asset.locationId = rfidData.lastReadLocation;
    await asset.save();
    return { found: true, asset };
};
exports.processRFIDInventoryScan = processRFIDInventoryScan;
// ============================================================================
// ASSET TRANSFERS (25-29)
// ============================================================================
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
const initiateAssetTransfer = async (transferData, AssetTransfer, CapitalAsset) => {
    const asset = await CapitalAsset.findByPk(transferData.assetId);
    if (!asset)
        throw new Error('Asset not found');
    const transfer = await AssetTransfer.create({
        ...transferData,
        status: 'pending',
        condition: 'good',
    });
    return transfer;
};
exports.initiateAssetTransfer = initiateAssetTransfer;
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
const approveAssetTransfer = async (transferId, approverId, AssetTransfer) => {
    const transfer = await AssetTransfer.findByPk(transferId);
    if (!transfer)
        throw new Error('Transfer not found');
    transfer.status = 'approved';
    transfer.approvedBy = approverId;
    await transfer.save();
    return transfer;
};
exports.approveAssetTransfer = approveAssetTransfer;
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
const completeAssetTransfer = async (transferId, AssetTransfer, CapitalAsset) => {
    const transfer = await AssetTransfer.findByPk(transferId);
    if (!transfer)
        throw new Error('Transfer not found');
    if (transfer.status !== 'approved') {
        throw new Error('Transfer must be approved first');
    }
    const asset = await CapitalAsset.findByPk(transfer.assetId);
    if (!asset)
        throw new Error('Asset not found');
    asset.departmentId = transfer.toDepartmentId;
    asset.locationId = transfer.toLocationId;
    await asset.save();
    transfer.status = 'completed';
    await transfer.save();
    return transfer;
};
exports.completeAssetTransfer = completeAssetTransfer;
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
const getAssetTransferHistory = async (assetId, AssetTransfer) => {
    return await AssetTransfer.findAll({
        where: { assetId },
        order: [['transferDate', 'DESC']],
    });
};
exports.getAssetTransferHistory = getAssetTransferHistory;
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
const cancelAssetTransfer = async (transferId, reason, AssetTransfer) => {
    const transfer = await AssetTransfer.findByPk(transferId);
    if (!transfer)
        throw new Error('Transfer not found');
    transfer.status = 'rejected';
    transfer.notes = `Cancelled: ${reason}`;
    await transfer.save();
    return transfer;
};
exports.cancelAssetTransfer = cancelAssetTransfer;
// ============================================================================
// ASSET MAINTENANCE TRACKING (30-34)
// ============================================================================
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
const recordAssetMaintenance = async (maintenanceData, AssetMaintenance, CapitalAsset) => {
    const record = await AssetMaintenance.create(maintenanceData);
    const asset = await CapitalAsset.findByPk(maintenanceData.assetId);
    if (asset) {
        asset.lastMaintenanceDate = maintenanceData.maintenanceDate;
        await asset.save();
    }
    return record;
};
exports.recordAssetMaintenance = recordAssetMaintenance;
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
const getMaintenanceHistory = async (assetId, AssetMaintenance) => {
    return await AssetMaintenance.findAll({
        where: { assetId },
        order: [['maintenanceDate', 'DESC']],
    });
};
exports.getMaintenanceHistory = getMaintenanceHistory;
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
const calculateMaintenanceCost = async (assetId, startDate, endDate, AssetMaintenance) => {
    const where = { assetId };
    if (startDate && endDate) {
        where.maintenanceDate = { [sequelize_1.Op.between]: [startDate, endDate] };
    }
    const records = await AssetMaintenance.findAll({ where });
    return records.reduce((sum, r) => sum + parseFloat(r.cost), 0);
};
exports.calculateMaintenanceCost = calculateMaintenanceCost;
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
const schedulePreventiveMaintenance = (assetId, scheduledDate, description) => {
    return {
        assetId,
        scheduledDate,
        description,
        status: 'scheduled',
        notificationSent: false,
    };
};
exports.schedulePreventiveMaintenance = schedulePreventiveMaintenance;
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
const identifyAssetsRequiringMaintenance = async (daysAhead, CapitalAsset, AssetMaintenance) => {
    const cutoffDate = new Date(Date.now() + daysAhead * 86400000);
    const assets = await CapitalAsset.findAll({
        where: { status: { [sequelize_1.Op.in]: ['active', 'in_service'] } },
    });
    const requiring = [];
    for (const asset of assets) {
        const lastMaintenance = await AssetMaintenance.findOne({
            where: { assetId: asset.id },
            order: [['maintenanceDate', 'DESC']],
        });
        if (lastMaintenance?.nextMaintenanceDate) {
            if (lastMaintenance.nextMaintenanceDate <= cutoffDate) {
                requiring.push({
                    asset,
                    lastMaintenance: lastMaintenance.maintenanceDate,
                    nextDue: lastMaintenance.nextMaintenanceDate,
                });
            }
        }
    }
    return requiring;
};
exports.identifyAssetsRequiringMaintenance = identifyAssetsRequiringMaintenance;
// ============================================================================
// ASSET IMPAIRMENT & VALUATION (35-39)
// ============================================================================
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
const performImpairmentTest = async (testData, CapitalAsset) => {
    const asset = await CapitalAsset.findByPk(testData.assetId);
    if (!asset)
        throw new Error('Asset not found');
    if (testData.isImpaired) {
        asset.bookValue = testData.estimatedFairValue;
        asset.metadata = {
            ...asset.metadata,
            impairment: {
                testDate: testData.testDate,
                impairmentLoss: testData.impairmentLoss,
                reason: testData.impairmentReason,
                testedBy: testData.testedBy,
            },
        };
        await asset.save();
    }
    return { asset, testResult: testData };
};
exports.performImpairmentTest = performImpairmentTest;
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
const updateAssetValuation = async (valuationData, CapitalAsset) => {
    const asset = await CapitalAsset.findByPk(valuationData.assetId);
    if (!asset)
        throw new Error('Asset not found');
    asset.metadata = {
        ...asset.metadata,
        valuations: [
            ...(asset.metadata.valuations || []),
            valuationData,
        ],
    };
    await asset.save();
    return asset;
};
exports.updateAssetValuation = updateAssetValuation;
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
const getLatestValuation = async (assetId, CapitalAsset) => {
    const asset = await CapitalAsset.findByPk(assetId);
    if (!asset)
        return null;
    const valuations = asset.metadata?.valuations || [];
    if (valuations.length === 0)
        return null;
    return valuations[valuations.length - 1];
};
exports.getLatestValuation = getLatestValuation;
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
const identifyImpairedAssets = async (CapitalAsset) => {
    const assets = await CapitalAsset.findAll({
        where: { status: { [sequelize_1.Op.in]: ['active', 'in_service'] } },
    });
    return assets.filter((asset) => asset.metadata?.impairment);
};
exports.identifyImpairedAssets = identifyImpairedAssets;
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
const calculateImpairmentLoss = async (startDate, endDate, CapitalAsset) => {
    const assets = await CapitalAsset.findAll();
    return assets.reduce((sum, asset) => {
        const impairment = asset.metadata?.impairment;
        if (impairment) {
            const testDate = new Date(impairment.testDate);
            if (testDate >= startDate && testDate <= endDate) {
                return sum + parseFloat(impairment.impairmentLoss || 0);
            }
        }
        return sum;
    }, 0);
};
exports.calculateImpairmentLoss = calculateImpairmentLoss;
// ============================================================================
// SURPLUS PROPERTY MANAGEMENT (40-44)
// ============================================================================
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
const listSurplusProperty = async (listingData, CapitalAsset) => {
    const asset = await CapitalAsset.findByPk(listingData.assetId);
    if (!asset)
        throw new Error('Asset not found');
    asset.status = 'surplus';
    asset.metadata = {
        ...asset.metadata,
        surplusListing: listingData,
    };
    await asset.save();
    return asset;
};
exports.listSurplusProperty = listSurplusProperty;
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
const getSurplusPropertyListings = async (status, CapitalAsset) => {
    const where = { status: 'surplus' };
    const assets = await CapitalAsset.findAll({ where });
    if (status) {
        return assets.filter((a) => a.metadata?.surplusListing?.status === status);
    }
    return assets;
};
exports.getSurplusPropertyListings = getSurplusPropertyListings;
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
const updateSurplusStatus = async (assetId, newStatus, CapitalAsset) => {
    const asset = await CapitalAsset.findByPk(assetId);
    if (!asset)
        throw new Error('Asset not found');
    if (asset.metadata?.surplusListing) {
        asset.metadata.surplusListing.status = newStatus;
        await asset.save();
    }
    return asset;
};
exports.updateSurplusStatus = updateSurplusStatus;
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
const generateSurplusCatalog = async (CapitalAsset) => {
    const surplus = await (0, exports.getSurplusPropertyListings)(undefined, CapitalAsset);
    return surplus.map((asset) => ({
        assetNumber: asset.assetNumber,
        description: asset.description,
        category: asset.assetCategory,
        estimatedValue: asset.metadata?.surplusListing?.estimatedValue,
        condition: asset.metadata?.surplusListing?.condition,
        availableFor: asset.metadata?.surplusListing?.availableFor,
        contactPerson: asset.metadata?.surplusListing?.contactPerson,
        listedDate: asset.metadata?.surplusListing?.listedDate,
    }));
};
exports.generateSurplusCatalog = generateSurplusCatalog;
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
const removeSurplusListing = async (assetId, reason, CapitalAsset) => {
    const asset = await CapitalAsset.findByPk(assetId);
    if (!asset)
        throw new Error('Asset not found');
    asset.status = 'active';
    if (asset.metadata?.surplusListing) {
        asset.metadata.surplusListing.status = 'withdrawn';
        asset.metadata.surplusListing.withdrawalReason = reason;
    }
    await asset.save();
    return asset;
};
exports.removeSurplusListing = removeSurplusListing;
// ============================================================================
// REPORTING & ANALYTICS (45-50)
// ============================================================================
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
const generateAssetRegister = async (departmentId, CapitalAsset) => {
    const where = {};
    if (departmentId)
        where.departmentId = departmentId;
    const assets = await CapitalAsset.findAll({
        where,
        order: [['assetNumber', 'ASC']],
    });
    const summary = {
        totalAssets: assets.length,
        totalAcquisitionCost: assets.reduce((sum, a) => sum + parseFloat(a.acquisitionCost), 0),
        totalAccumulatedDepreciation: assets.reduce((sum, a) => sum + parseFloat(a.accumulatedDepreciation), 0),
        totalBookValue: assets.reduce((sum, a) => sum + parseFloat(a.bookValue), 0),
    };
    return { summary, assets };
};
exports.generateAssetRegister = generateAssetRegister;
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
const calculateAssetUtilization = async (assetId, AssetMaintenance) => {
    const maintenance = await AssetMaintenance.findAll({ where: { assetId } });
    const totalDowntime = maintenance.reduce((sum, m) => sum + parseFloat(m.downtimeHours || 0), 0);
    const daysInService = 365; // Simplified
    const availableHours = daysInService * 24;
    const utilization = ((availableHours - totalDowntime) / availableHours) * 100;
    return Math.max(0, Math.min(100, utilization));
};
exports.calculateAssetUtilization = calculateAssetUtilization;
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
const generateDepreciationReport = async (fiscalYear, AssetDepreciation) => {
    const records = await AssetDepreciation.findAll({
        where: { fiscalYear },
        order: [['fiscalPeriod', 'ASC']],
    });
    const byPeriod = records.reduce((acc, r) => {
        const period = r.fiscalPeriod;
        if (!acc[period])
            acc[period] = 0;
        acc[period] += parseFloat(r.periodDepreciation);
        return acc;
    }, {});
    const totalExpense = Object.values(byPeriod).reduce((sum, val) => sum + val, 0);
    return { fiscalYear, byPeriod, totalExpense };
};
exports.generateDepreciationReport = generateDepreciationReport;
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
const exportAssetsToCSV = (assets) => {
    const headers = 'Asset Number,Description,Category,Acquisition Date,Cost,Book Value,Department,Location,Status\n';
    const rows = assets.map((a) => `${a.assetNumber},"${a.description}",${a.assetCategory},${a.acquisitionDate.toISOString().split('T')[0]},${a.acquisitionCost},${a.bookValue},${a.departmentId},${a.locationId},${a.status}`);
    return headers + rows.join('\n');
};
exports.exportAssetsToCSV = exportAssetsToCSV;
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
const identifyHighValueAssets = async (threshold, CapitalAsset) => {
    return await CapitalAsset.findAll({
        where: {
            acquisitionCost: { [sequelize_1.Op.gte]: threshold },
            status: { [sequelize_1.Op.in]: ['active', 'in_service'] },
        },
        order: [['acquisitionCost', 'DESC']],
    });
};
exports.identifyHighValueAssets = identifyHighValueAssets;
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
const generateAssetLifecycleAnalysis = async (assetId, CapitalAsset, AssetDepreciation, AssetMaintenance) => {
    const asset = await CapitalAsset.findByPk(assetId);
    if (!asset)
        throw new Error('Asset not found');
    const depreciation = await AssetDepreciation.findAll({ where: { assetId } });
    const maintenance = await AssetMaintenance.findAll({ where: { assetId } });
    const totalDepreciation = depreciation.reduce((sum, d) => sum + parseFloat(d.periodDepreciation), 0);
    const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + parseFloat(m.cost), 0);
    const age = (new Date().getTime() - asset.acquisitionDate.getTime()) /
        (365.25 * 86400000);
    const remainingLife = Math.max(0, asset.usefulLifeYears - age);
    return {
        asset: {
            assetNumber: asset.assetNumber,
            description: asset.description,
            acquisitionCost: parseFloat(asset.acquisitionCost),
            bookValue: parseFloat(asset.bookValue),
        },
        age,
        remainingLife,
        totalDepreciation,
        totalMaintenanceCost,
        totalCostOfOwnership: parseFloat(asset.acquisitionCost) + totalMaintenanceCost,
        maintenanceEvents: maintenance.length,
    };
};
exports.generateAssetLifecycleAnalysis = generateAssetLifecycleAnalysis;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Calculates barcode checksum for validation.
 *
 * @param {string} data - Data to checksum
 * @returns {string} Checksum
 */
const calculateBarcodeChecksum = (data) => {
    const sum = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (sum % 97).toString(16).toUpperCase().padStart(2, '0');
};
/**
 * Generates disposal journal entry.
 *
 * @param {any} asset - Asset data
 * @param {AssetDisposalData} disposal - Disposal data
 * @returns {any} Journal entry
 */
const generateDisposalJournalEntry = (asset, disposal) => {
    return {
        date: disposal.disposalDate,
        entries: [
            {
                account: 'Cash',
                debit: disposal.proceedsAmount,
                credit: 0,
            },
            {
                account: 'Accumulated Depreciation',
                debit: parseFloat(asset.accumulatedDepreciation),
                credit: 0,
            },
            {
                account: asset.glAccountCode,
                debit: 0,
                credit: parseFloat(asset.acquisitionCost),
            },
            {
                account: disposal.gainLoss >= 0 ? 'Gain on Disposal' : 'Loss on Disposal',
                debit: disposal.gainLoss < 0 ? Math.abs(disposal.gainLoss) : 0,
                credit: disposal.gainLoss >= 0 ? disposal.gainLoss : 0,
            },
        ],
    };
};
// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================
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
let AssetInventoryService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AssetInventoryService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        async createAsset(data, userId) {
            const CapitalAsset = (0, exports.createCapitalAssetModel)(this.sequelize);
            return (0, exports.createCapitalAsset)(data, CapitalAsset, userId);
        }
        async processDepreciation(fiscalYear, fiscalPeriod) {
            const CapitalAsset = (0, exports.createCapitalAssetModel)(this.sequelize);
            const AssetDepreciation = (0, exports.createAssetDepreciationModel)(this.sequelize);
            return (0, exports.processDepreciationBatch)(fiscalYear, fiscalPeriod, CapitalAsset, AssetDepreciation);
        }
        async createInventorySession(locationId, conductedBy) {
            const PhysicalInventory = (0, exports.createPhysicalInventoryModel)(this.sequelize);
            const CapitalAsset = (0, exports.createCapitalAssetModel)(this.sequelize);
            return (0, exports.createPhysicalInventorySession)(locationId, conductedBy, PhysicalInventory, CapitalAsset);
        }
        async initiateTransfer(transferData) {
            const AssetTransfer = (0, exports.createAssetTransferModel)(this.sequelize);
            const CapitalAsset = (0, exports.createCapitalAssetModel)(this.sequelize);
            return (0, exports.initiateAssetTransfer)(transferData, AssetTransfer, CapitalAsset);
        }
    };
    __setFunctionName(_classThis, "AssetInventoryService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssetInventoryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssetInventoryService = _classThis;
})();
exports.AssetInventoryService = AssetInventoryService;
/**
 * Default export with all asset management utilities.
 */
exports.default = {
    // Models
    createCapitalAssetModel: exports.createCapitalAssetModel,
    createAssetDepreciationModel: exports.createAssetDepreciationModel,
    createAssetTransferModel: exports.createAssetTransferModel,
    createPhysicalInventoryModel: exports.createPhysicalInventoryModel,
    createAssetMaintenanceModel: exports.createAssetMaintenanceModel,
    // Acquisition & Disposal
    createCapitalAsset: exports.createCapitalAsset,
    validateCapitalizationThreshold: exports.validateCapitalizationThreshold,
    processAssetDisposal: exports.processAssetDisposal,
    generateAssetBarcode: exports.generateAssetBarcode,
    assignRFIDTag: exports.assignRFIDTag,
    validateAssetAcquisition: exports.validateAssetAcquisition,
    // Depreciation
    calculateStraightLineDepreciation: exports.calculateStraightLineDepreciation,
    calculateDecliningBalanceDepreciation: exports.calculateDecliningBalanceDepreciation,
    calculateSumOfYearsDepreciation: exports.calculateSumOfYearsDepreciation,
    calculateUnitsOfProductionDepreciation: exports.calculateUnitsOfProductionDepreciation,
    processDepreciationBatch: exports.processDepreciationBatch,
    getDepreciationSchedule: exports.getDepreciationSchedule,
    calculateTotalDepreciationExpense: exports.calculateTotalDepreciationExpense,
    // Categorization
    categorizeAsset: exports.categorizeAsset,
    applyAssetTags: exports.applyAssetTags,
    searchAssetsByTags: exports.searchAssetsByTags,
    determineGLAccount: exports.determineGLAccount,
    generateAssetClassificationReport: exports.generateAssetClassificationReport,
    // Physical Inventory
    createPhysicalInventorySession: exports.createPhysicalInventorySession,
    recordInventoryScan: exports.recordInventoryScan,
    completeInventorySession: exports.completeInventorySession,
    identifyMissingAssets: exports.identifyMissingAssets,
    generateInventoryVarianceReport: exports.generateInventoryVarianceReport,
    processRFIDInventoryScan: exports.processRFIDInventoryScan,
    // Transfers
    initiateAssetTransfer: exports.initiateAssetTransfer,
    approveAssetTransfer: exports.approveAssetTransfer,
    completeAssetTransfer: exports.completeAssetTransfer,
    getAssetTransferHistory: exports.getAssetTransferHistory,
    cancelAssetTransfer: exports.cancelAssetTransfer,
    // Maintenance
    recordAssetMaintenance: exports.recordAssetMaintenance,
    getMaintenanceHistory: exports.getMaintenanceHistory,
    calculateMaintenanceCost: exports.calculateMaintenanceCost,
    schedulePreventiveMaintenance: exports.schedulePreventiveMaintenance,
    identifyAssetsRequiringMaintenance: exports.identifyAssetsRequiringMaintenance,
    // Impairment & Valuation
    performImpairmentTest: exports.performImpairmentTest,
    updateAssetValuation: exports.updateAssetValuation,
    getLatestValuation: exports.getLatestValuation,
    identifyImpairedAssets: exports.identifyImpairedAssets,
    calculateImpairmentLoss: exports.calculateImpairmentLoss,
    // Surplus Property
    listSurplusProperty: exports.listSurplusProperty,
    getSurplusPropertyListings: exports.getSurplusPropertyListings,
    updateSurplusStatus: exports.updateSurplusStatus,
    generateSurplusCatalog: exports.generateSurplusCatalog,
    removeSurplusListing: exports.removeSurplusListing,
    // Reporting
    generateAssetRegister: exports.generateAssetRegister,
    calculateAssetUtilization: exports.calculateAssetUtilization,
    generateDepreciationReport: exports.generateDepreciationReport,
    exportAssetsToCSV: exports.exportAssetsToCSV,
    identifyHighValueAssets: exports.identifyHighValueAssets,
    generateAssetLifecycleAnalysis: exports.generateAssetLifecycleAnalysis,
    // Service
    AssetInventoryService,
};
//# sourceMappingURL=asset-inventory-management-kit.js.map