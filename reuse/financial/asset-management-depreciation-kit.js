"use strict";
/**
 * LOC: ASSTMGMT001
 * File: /reuse/financial/asset-management-depreciation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - CEFMS financial modules
 *   - Asset management services
 *   - Depreciation calculation engines
 *   - Fixed asset controllers
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssetTransferModel = exports.createAssetDisposalModel = exports.createDepreciationScheduleModel = exports.createFixedAssetModel = void 0;
exports.calculateStraightLineDepreciation = calculateStraightLineDepreciation;
exports.calculateDecliningBalanceDepreciation = calculateDecliningBalanceDepreciation;
exports.calculateDoubleDecliningBalance = calculateDoubleDecliningBalance;
exports.calculateSumOfYearsDigitsDepreciation = calculateSumOfYearsDigitsDepreciation;
exports.calculateUnitsOfProductionDepreciation = calculateUnitsOfProductionDepreciation;
exports.getMACRSRate = getMACRSRate;
exports.calculateMACRSDepreciation = calculateMACRSDepreciation;
exports.generateDepreciationSchedule = generateDepreciationSchedule;
exports.applyHalfYearConvention = applyHalfYearConvention;
exports.calculateProRatedDepreciation = calculateProRatedDepreciation;
exports.switchDepreciationMethod = switchDepreciationMethod;
exports.determineOptimalMethodSwitch = determineOptimalMethodSwitch;
exports.capitalizeAsset = capitalizeAsset;
exports.processAssetDisposal = processAssetDisposal;
exports.transferAsset = transferAsset;
exports.testAssetImpairment = testAssetImpairment;
exports.revalueAsset = revalueAsset;
exports.componentizeAsset = componentizeAsset;
exports.calculateAssetValuation = calculateAssetValuation;
exports.validateAssetData = validateAssetData;
exports.generateAssetTag = generateAssetTag;
exports.calculateRemainingUsefulLife = calculateRemainingUsefulLife;
exports.groupAssets = groupAssets;
exports.reconcilePhysicalInventory = reconcilePhysicalInventory;
exports.calculateInsuranceValue = calculateInsuranceValue;
exports.estimateSalvageValue = estimateSalvageValue;
exports.generateReplacementForecast = generateReplacementForecast;
exports.calculateTotalCostOfOwnership = calculateTotalCostOfOwnership;
exports.generateAssetRegister = generateAssetRegister;
exports.calculateDepreciationExpenseSummary = calculateDepreciationExpenseSummary;
exports.generateAcquisitionReport = generateAcquisitionReport;
exports.generateDisposalReport = generateDisposalReport;
exports.calculatePortfolioSummary = calculatePortfolioSummary;
exports.generateFullyDepreciatedReport = generateFullyDepreciatedReport;
exports.generateInventoryVerificationList = generateInventoryVerificationList;
exports.calculateDepreciationVariance = calculateDepreciationVariance;
exports.exportAssetData = exportAssetData;
exports.generateAssetAgeAnalysis = generateAssetAgeAnalysis;
exports.calculateAssetUtilization = calculateAssetUtilization;
exports.analyzeMaintenanceCosts = analyzeMaintenanceCosts;
exports.generateComplianceReport = generateComplianceReport;
exports.calculateAssetROI = calculateAssetROI;
exports.compareAssetLifecycleCosts = compareAssetLifecycleCosts;
exports.generateGrantAssetsReport = generateGrantAssetsReport;
exports.performYearEndDepreciationClosing = performYearEndDepreciationClosing;
/**
 * File: /reuse/financial/asset-management-depreciation-kit.ts
 * Locator: WC-FIN-ASSET-001
 * Purpose: Comprehensive Fixed Asset Management & Depreciation Utilities - USACE CEFMS-level enterprise asset tracking, depreciation methods, disposal, capitalization
 *
 * Upstream: Independent financial utility module for asset lifecycle management
 * Downstream: ../backend/*, CEFMS integration, asset controllers, financial reporting, audit trails
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Decimal.js
 * Exports: 45+ utility functions for asset management, depreciation calculations, disposal, capitalization, inventory, valuation
 *
 * LLM Context: Enterprise-grade fixed asset management utilities for USACE CEFMS-level financial systems.
 * Provides complete asset lifecycle management, multiple depreciation methods (straight-line, declining balance, MACRS,
 * sum-of-years-digits, units-of-production), asset tracking, disposal management, capitalization thresholds, impairment
 * testing, revaluation, transfer management, inventory reconciliation, depreciation schedules, salvage value calculations,
 * useful life estimation, asset grouping, component accounting, and comprehensive audit trails.
 */
const sequelize_1 = require("sequelize");
const decimal_js_1 = __importDefault(require("decimal.js"));
// ============================================================================
// SEQUELIZE MODELS (1-4)
// ============================================================================
/**
 * Sequelize model for Fixed Assets with comprehensive tracking and lifecycle management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FixedAsset model
 *
 * @example
 * ```typescript
 * const FixedAsset = createFixedAssetModel(sequelize);
 * const asset = await FixedAsset.create({
 *   assetNumber: 'ASSET-2024-001',
 *   description: 'Dell PowerEdge Server',
 *   category: 'computers-it',
 *   acquisitionCost: new Decimal('15000.00'),
 *   acquisitionDate: new Date('2024-01-15'),
 *   inServiceDate: new Date('2024-02-01'),
 *   usefulLifeYears: 5,
 *   salvageValue: new Decimal('1500.00'),
 *   depreciationMethod: 'straight-line'
 * });
 * ```
 */
const createFixedAssetModel = (sequelize) => {
    class FixedAsset extends sequelize_1.Model {
    }
    FixedAsset.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        assetNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique asset identifier/tag number',
        },
        description: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Detailed asset description',
        },
        category: {
            type: sequelize_1.DataTypes.ENUM('land', 'buildings', 'leasehold-improvements', 'machinery-equipment', 'vehicles', 'furniture-fixtures', 'computers-it', 'software', 'infrastructure', 'construction-in-progress'),
            allowNull: false,
            comment: 'Primary asset category',
        },
        subCategory: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Detailed sub-category classification',
        },
        acquisitionCost: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Original acquisition cost',
            validate: {
                min: 0,
            },
        },
        acquisitionDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Date asset was acquired',
        },
        inServiceDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Date asset was placed in service',
        },
        usefulLifeYears: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Estimated useful life in years',
            validate: {
                min: 0,
            },
        },
        salvageValue: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Estimated salvage/residual value',
            validate: {
                min: 0,
            },
        },
        depreciationMethod: {
            type: sequelize_1.DataTypes.ENUM('straight-line', 'declining-balance', 'double-declining-balance', 'sum-of-years-digits', 'units-of-production', 'macrs', 'macrs-alt', '150-declining-balance'),
            allowNull: false,
            comment: 'Depreciation calculation method',
        },
        currentBookValue: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Current net book value',
            validate: {
                min: 0,
            },
        },
        accumulatedDepreciation: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total accumulated depreciation',
            validate: {
                min: 0,
            },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('in-service', 'pending-disposal', 'disposed', 'under-construction', 'retired', 'impaired', 'transferred', 'lost-stolen', 'donated'),
            allowNull: false,
            defaultValue: 'in-service',
            comment: 'Current asset status',
        },
        location: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'Current physical location details',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional asset metadata (tag, serial, manufacturer, etc.)',
        },
        parentAssetId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Parent asset ID for component assets',
            references: {
                model: 'fixed_assets',
                key: 'id',
            },
        },
        isComponentized: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether asset has separately tracked components',
        },
        components: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Component asset details',
        },
        responsibleDepartment: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Department responsible for asset',
        },
        custodian: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Individual custodian name',
        },
        fundingSource: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Funding source (grant, capital budget, etc.)',
        },
        projectCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Associated project code',
        },
        grantNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Grant number if grant-funded',
        },
        lastPhysicalInventoryDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Last physical inventory verification date',
        },
        lastRevaluationDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Last revaluation date',
        },
        impairmentIndicator: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether asset shows impairment indicators',
        },
        fullyDepreciated: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether asset is fully depreciated',
        },
        depreciationSuspended: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether depreciation is currently suspended',
        },
        suspensionReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for depreciation suspension',
        },
        disposalId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Reference to disposal record',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the record',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the record',
        },
    }, {
        sequelize,
        tableName: 'fixed_assets',
        timestamps: true,
        paranoid: true, // Soft deletes
        indexes: [
            { fields: ['assetNumber'], unique: true },
            { fields: ['category'] },
            { fields: ['status'] },
            { fields: ['responsibleDepartment'] },
            { fields: ['inServiceDate'] },
            { fields: ['parentAssetId'] },
            { fields: ['projectCode'] },
            { fields: ['grantNumber'] },
            { fields: ['fullyDepreciated'] },
            { fields: ['createdAt'] },
        ],
    });
    return FixedAsset;
};
exports.createFixedAssetModel = createFixedAssetModel;
/**
 * Sequelize model for Depreciation Schedule tracking periodic depreciation calculations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DepreciationSchedule model
 *
 * @example
 * ```typescript
 * const DepreciationSchedule = createDepreciationScheduleModel(sequelize);
 * const schedule = await DepreciationSchedule.create({
 *   assetId: 123,
 *   fiscalYear: 2024,
 *   periodNumber: 1,
 *   depreciationExpense: new Decimal('250.00'),
 *   accumulatedDepreciation: new Decimal('250.00'),
 *   bookValue: new Decimal('14750.00')
 * });
 * ```
 */
const createDepreciationScheduleModel = (sequelize) => {
    class DepreciationSchedule extends sequelize_1.Model {
    }
    DepreciationSchedule.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        assetId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to fixed asset',
            references: {
                model: 'fixed_assets',
                key: 'id',
            },
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
        },
        periodNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Period within fiscal year (1-12)',
            validate: {
                min: 1,
                max: 12,
            },
        },
        periodStartDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Period start date',
        },
        periodEndDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Period end date',
        },
        openingBookValue: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Book value at period start',
        },
        depreciationExpense: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Depreciation expense for period',
            validate: {
                min: 0,
            },
        },
        accumulatedDepreciation: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Accumulated depreciation at period end',
        },
        closingBookValue: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Book value at period end',
        },
        depreciationRate: {
            type: sequelize_1.DataTypes.DECIMAL(8, 6),
            allowNull: true,
            comment: 'Depreciation rate applied',
        },
        calculationMethod: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Method used for calculation',
        },
        adjustmentAmount: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Manual adjustment amount',
        },
        adjustmentReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for manual adjustment',
        },
        posted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether posted to general ledger',
        },
        postedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date posted to GL',
        },
        postedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who posted',
        },
        journalEntryId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Associated journal entry ID',
        },
    }, {
        sequelize,
        tableName: 'depreciation_schedules',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['assetId', 'fiscalYear', 'periodNumber'], unique: true },
            { fields: ['fiscalYear'] },
            { fields: ['posted'] },
            { fields: ['periodStartDate'] },
            { fields: ['periodEndDate'] },
        ],
    });
    return DepreciationSchedule;
};
exports.createDepreciationScheduleModel = createDepreciationScheduleModel;
/**
 * Sequelize model for Asset Disposals tracking sale, retirement, and other disposals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetDisposal model
 *
 * @example
 * ```typescript
 * const AssetDisposal = createAssetDisposalModel(sequelize);
 * const disposal = await AssetDisposal.create({
 *   assetId: 123,
 *   disposalDate: new Date(),
 *   disposalMethod: 'sale',
 *   saleProceeds: new Decimal('12000.00'),
 *   bookValue: new Decimal('10000.00'),
 *   gainLoss: new Decimal('2000.00')
 * });
 * ```
 */
const createAssetDisposalModel = (sequelize) => {
    class AssetDisposal extends sequelize_1.Model {
    }
    AssetDisposal.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        assetId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to disposed asset',
            references: {
                model: 'fixed_assets',
                key: 'id',
            },
        },
        disposalDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Date of disposal',
        },
        disposalMethod: {
            type: sequelize_1.DataTypes.ENUM('sale', 'trade-in', 'scrap', 'donation', 'abandonment', 'casualty-loss'),
            allowNull: false,
            comment: 'Method of disposal',
        },
        saleProceeds: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: true,
            comment: 'Proceeds from sale/trade-in',
        },
        bookValue: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Book value at disposal',
        },
        accumulatedDepreciation: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Total accumulated depreciation',
        },
        gainLoss: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Gain or loss on disposal (negative = loss)',
        },
        disposedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who initiated disposal',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who approved disposal',
        },
        approvalDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date of approval',
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Reason for disposal',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Additional notes',
        },
        buyerInformation: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Buyer details for sales',
        },
        disposalCosts: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Costs associated with disposal',
        },
        netProceeds: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Net proceeds after costs',
        },
        taxImplications: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Tax treatment details',
        },
        glPosted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether posted to GL',
        },
        glJournalEntry: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Journal entry number',
        },
        documentationPath: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Path to supporting documentation',
        },
    }, {
        sequelize,
        tableName: 'asset_disposals',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['assetId'] },
            { fields: ['disposalDate'] },
            { fields: ['disposalMethod'] },
            { fields: ['glPosted'] },
            { fields: ['approvedBy'] },
        ],
    });
    return AssetDisposal;
};
exports.createAssetDisposalModel = createAssetDisposalModel;
/**
 * Sequelize model for Asset Transfers tracking location and custodian changes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetTransfer model
 */
const createAssetTransferModel = (sequelize) => {
    class AssetTransfer extends sequelize_1.Model {
    }
    AssetTransfer.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        assetId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'fixed_assets',
                key: 'id',
            },
        },
        transferDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date transfer was initiated',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Effective date of transfer',
        },
        fromLocation: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'Source location details',
        },
        toLocation: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'Destination location details',
        },
        transferredBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who initiated transfer',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who approved transfer',
        },
        approvalDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date of approval',
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Reason for transfer',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        transferType: {
            type: sequelize_1.DataTypes.ENUM('location', 'department', 'custodian', 'cost-center'),
            allowNull: false,
            comment: 'Type of transfer',
        },
        bookValue: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Book value at transfer',
        },
        condition: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            comment: 'Asset condition at transfer',
        },
        physicallyMoved: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether asset physically relocated',
        },
        receivedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who received asset',
        },
        receiptDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date asset received',
        },
    }, {
        sequelize,
        tableName: 'asset_transfers',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['assetId'] },
            { fields: ['transferDate'] },
            { fields: ['effectiveDate'] },
            { fields: ['transferType'] },
        ],
    });
    return AssetTransfer;
};
exports.createAssetTransferModel = createAssetTransferModel;
// ============================================================================
// DEPRECIATION CALCULATION FUNCTIONS (1-12)
// ============================================================================
/**
 * Calculates straight-line depreciation for a given period.
 *
 * @param {DepreciationParameters} params - Depreciation parameters
 * @param {Date} periodEndDate - End date of depreciation period
 * @returns {CalculationResult<Decimal>} Depreciation amount for the period
 *
 * @example
 * ```typescript
 * const depreciation = calculateStraightLineDepreciation({
 *   method: 'straight-line',
 *   usefulLifeYears: 5,
 *   salvageValue: new Decimal('1000'),
 *   depreciableBase: new Decimal('10000'),
 *   acquisitionDate: new Date('2024-01-01'),
 *   inServiceDate: new Date('2024-01-01'),
 *   fiscalYearEnd: 12
 * }, new Date('2024-12-31'));
 * // Returns: { success: true, result: Decimal('1800'), metadata: {...} }
 * ```
 */
function calculateStraightLineDepreciation(params, periodEndDate) {
    try {
        const { depreciableBase, salvageValue, usefulLifeYears, inServiceDate, convention = 'full-year' } = params;
        const depreciableAmount = depreciableBase.minus(salvageValue);
        const annualDepreciation = depreciableAmount.dividedBy(usefulLifeYears);
        // Apply convention for first year
        const yearsSinceInService = (periodEndDate.getTime() - inServiceDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        let periodDepreciation = annualDepreciation;
        if (yearsSinceInService < 1) {
            if (convention === 'half-year') {
                periodDepreciation = annualDepreciation.dividedBy(2);
            }
            else if (convention === 'mid-month') {
                const monthsInService = Math.floor(yearsSinceInService * 12);
                periodDepreciation = annualDepreciation.times(monthsInService).dividedBy(12);
            }
        }
        return {
            success: true,
            result: periodDepreciation,
            metadata: {
                annualDepreciation: annualDepreciation.toFixed(2),
                depreciableAmount: depreciableAmount.toFixed(2),
                rate: new decimal_js_1.default(1).dividedBy(usefulLifeYears).toFixed(6),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Straight-line calculation failed: ${error.message}`,
        };
    }
}
/**
 * Calculates declining balance depreciation with configurable rate.
 *
 * @param {DepreciationParameters} params - Depreciation parameters
 * @param {Decimal} currentBookValue - Current book value
 * @param {number} year - Current year of depreciation
 * @returns {CalculationResult<Decimal>} Depreciation amount for the period
 *
 * @example
 * ```typescript
 * const depreciation = calculateDecliningBalanceDepreciation({
 *   method: 'double-declining-balance',
 *   usefulLifeYears: 5,
 *   salvageValue: new Decimal('1000'),
 *   depreciableBase: new Decimal('10000'),
 *   decliningBalanceRate: 200,
 *   acquisitionDate: new Date('2024-01-01'),
 *   inServiceDate: new Date('2024-01-01'),
 *   fiscalYearEnd: 12
 * }, new Decimal('10000'), 1);
 * ```
 */
function calculateDecliningBalanceDepreciation(params, currentBookValue, year) {
    try {
        const { usefulLifeYears, salvageValue, decliningBalanceRate = 200 } = params;
        const straightLineRate = new decimal_js_1.default(1).dividedBy(usefulLifeYears);
        const decliningRate = straightLineRate.times(decliningBalanceRate).dividedBy(100);
        let depreciation = currentBookValue.times(decliningRate);
        // Ensure we don't depreciate below salvage value
        const minimumBookValue = salvageValue;
        const maxDepreciation = currentBookValue.minus(minimumBookValue);
        if (depreciation.greaterThan(maxDepreciation)) {
            depreciation = maxDepreciation;
        }
        return {
            success: true,
            result: depreciation,
            metadata: {
                decliningRate: decliningRate.toFixed(6),
                currentBookValue: currentBookValue.toFixed(2),
                year,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Declining balance calculation failed: ${error.message}`,
        };
    }
}
/**
 * Calculates double declining balance depreciation (200% declining balance).
 *
 * @param {DepreciationParameters} params - Depreciation parameters
 * @param {Decimal} currentBookValue - Current book value
 * @param {number} year - Current year of depreciation
 * @returns {CalculationResult<Decimal>} Depreciation amount
 */
function calculateDoubleDecliningBalance(params, currentBookValue, year) {
    return calculateDecliningBalanceDepreciation({ ...params, decliningBalanceRate: 200 }, currentBookValue, year);
}
/**
 * Calculates sum-of-years-digits depreciation.
 *
 * @param {DepreciationParameters} params - Depreciation parameters
 * @param {number} year - Current year of depreciation (1-based)
 * @returns {CalculationResult<Decimal>} Depreciation amount for the year
 *
 * @example
 * ```typescript
 * const depreciation = calculateSumOfYearsDigitsDepreciation({
 *   method: 'sum-of-years-digits',
 *   usefulLifeYears: 5,
 *   salvageValue: new Decimal('1000'),
 *   depreciableBase: new Decimal('10000'),
 *   acquisitionDate: new Date('2024-01-01'),
 *   inServiceDate: new Date('2024-01-01'),
 *   fiscalYearEnd: 12
 * }, 1);
 * // Year 1: 5/15 of depreciable amount
 * // Year 2: 4/15 of depreciable amount, etc.
 * ```
 */
function calculateSumOfYearsDigitsDepreciation(params, year) {
    try {
        const { depreciableBase, salvageValue, usefulLifeYears } = params;
        const depreciableAmount = depreciableBase.minus(salvageValue);
        const sumOfYears = (usefulLifeYears * (usefulLifeYears + 1)) / 2;
        const remainingLife = usefulLifeYears - year + 1;
        const depreciation = depreciableAmount.times(remainingLife).dividedBy(sumOfYears);
        return {
            success: true,
            result: depreciation,
            metadata: {
                year,
                remainingLife,
                sumOfYears,
                fraction: `${remainingLife}/${sumOfYears}`,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Sum-of-years-digits calculation failed: ${error.message}`,
        };
    }
}
/**
 * Calculates units of production depreciation based on usage.
 *
 * @param {DepreciationParameters} params - Depreciation parameters
 * @param {UnitsOfProductionData} productionData - Production/usage data
 * @returns {CalculationResult<Decimal>} Depreciation amount for the period
 *
 * @example
 * ```typescript
 * const depreciation = calculateUnitsOfProductionDepreciation({
 *   method: 'units-of-production',
 *   usefulLifeYears: 5,
 *   salvageValue: new Decimal('5000'),
 *   depreciableBase: new Decimal('50000'),
 *   acquisitionDate: new Date('2024-01-01'),
 *   inServiceDate: new Date('2024-01-01'),
 *   fiscalYearEnd: 12
 * }, {
 *   totalEstimatedUnits: 100000,
 *   unitsProducedToDate: 15000,
 *   currentPeriodUnits: 5000,
 *   unitType: 'miles'
 * });
 * ```
 */
function calculateUnitsOfProductionDepreciation(params, productionData) {
    try {
        const { depreciableBase, salvageValue } = params;
        const { totalEstimatedUnits, currentPeriodUnits } = productionData;
        const depreciableAmount = depreciableBase.minus(salvageValue);
        const ratePerUnit = depreciableAmount.dividedBy(totalEstimatedUnits);
        const depreciation = ratePerUnit.times(currentPeriodUnits);
        return {
            success: true,
            result: depreciation,
            metadata: {
                ratePerUnit: ratePerUnit.toFixed(4),
                currentPeriodUnits,
                totalEstimatedUnits,
                unitType: productionData.unitType,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Units of production calculation failed: ${error.message}`,
        };
    }
}
/**
 * Gets MACRS depreciation rate table for specified asset class.
 *
 * @param {string} macrsClass - MACRS asset class
 * @param {number} year - Year of depreciation
 * @returns {number} Depreciation rate percentage
 *
 * @example
 * ```typescript
 * const rate = getMACRSRate('5-year', 1); // Returns 20.00 (20%)
 * const rate = getMACRSRate('7-year', 3); // Returns 17.49
 * ```
 */
function getMACRSRate(macrsClass, year) {
    const macrsRates = {
        '3-year': [33.33, 44.45, 14.81, 7.41],
        '5-year': [20.00, 32.00, 19.20, 11.52, 11.52, 5.76],
        '7-year': [14.29, 24.49, 17.49, 12.49, 8.93, 8.92, 8.93, 4.46],
        '10-year': [10.00, 18.00, 14.40, 11.52, 9.22, 7.37, 6.55, 6.55, 6.56, 6.55, 3.28],
        '15-year': [5.00, 9.50, 8.55, 7.70, 6.93, 6.23, 5.90, 5.90, 5.91, 5.90, 5.91, 5.90, 5.91, 5.90, 5.91, 2.95],
        '20-year': [3.750, 7.219, 6.677, 6.177, 5.713, 5.285, 4.888, 4.522, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 4.462, 4.461, 2.231],
    };
    const rates = macrsRates[macrsClass];
    if (!rates || year < 1 || year > rates.length) {
        return 0;
    }
    return rates[year - 1];
}
/**
 * Calculates MACRS (Modified Accelerated Cost Recovery System) depreciation.
 *
 * @param {DepreciationParameters} params - Depreciation parameters
 * @param {number} year - Current year of depreciation
 * @returns {CalculationResult<Decimal>} Depreciation amount for the year
 *
 * @example
 * ```typescript
 * const depreciation = calculateMACRSDepreciation({
 *   method: 'macrs',
 *   macrsClass: '5-year',
 *   depreciableBase: new Decimal('10000'),
 *   salvageValue: new Decimal('0'),
 *   usefulLifeYears: 5,
 *   acquisitionDate: new Date('2024-01-01'),
 *   inServiceDate: new Date('2024-01-01'),
 *   fiscalYearEnd: 12
 * }, 1);
 * // Returns 20% of $10,000 = $2,000 for year 1
 * ```
 */
function calculateMACRSDepreciation(params, year) {
    try {
        const { depreciableBase, macrsClass } = params;
        if (!macrsClass) {
            return {
                success: false,
                error: 'MACRS class is required for MACRS depreciation',
            };
        }
        const rate = getMACRSRate(macrsClass, year);
        if (rate === 0) {
            return {
                success: true,
                result: new decimal_js_1.default(0),
                metadata: { year, macrsClass, rate: 0 },
            };
        }
        const depreciation = depreciableBase.times(rate).dividedBy(100);
        return {
            success: true,
            result: depreciation,
            metadata: {
                year,
                macrsClass,
                rate,
                depreciableBase: depreciableBase.toFixed(2),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `MACRS calculation failed: ${error.message}`,
        };
    }
}
/**
 * Generates complete depreciation schedule for asset lifetime.
 *
 * @param {DepreciationParameters} params - Depreciation parameters
 * @param {Decimal} accumulatedDepreciation - Current accumulated depreciation
 * @returns {CalculationResult<DepreciationScheduleEntry[]>} Full depreciation schedule
 *
 * @example
 * ```typescript
 * const schedule = generateDepreciationSchedule({
 *   method: 'straight-line',
 *   usefulLifeYears: 5,
 *   salvageValue: new Decimal('1000'),
 *   depreciableBase: new Decimal('10000'),
 *   acquisitionDate: new Date('2024-01-01'),
 *   inServiceDate: new Date('2024-01-01'),
 *   fiscalYearEnd: 12
 * }, new Decimal('0'));
 * ```
 */
function generateDepreciationSchedule(params, accumulatedDepreciation = new decimal_js_1.default(0)) {
    try {
        const { method, usefulLifeYears, inServiceDate, fiscalYearEnd } = params;
        const schedule = [];
        let currentBookValue = params.depreciableBase;
        let totalAccumulated = accumulatedDepreciation;
        const years = Math.ceil(usefulLifeYears);
        for (let year = 1; year <= years; year++) {
            let depreciation;
            switch (method) {
                case 'straight-line':
                    const slResult = calculateStraightLineDepreciation(params, new Date(inServiceDate.getFullYear() + year, fiscalYearEnd - 1, 31));
                    depreciation = slResult.result || new decimal_js_1.default(0);
                    break;
                case 'double-declining-balance':
                case 'declining-balance':
                    const dbResult = calculateDecliningBalanceDepreciation(params, currentBookValue, year);
                    depreciation = dbResult.result || new decimal_js_1.default(0);
                    break;
                case 'sum-of-years-digits':
                    const sydResult = calculateSumOfYearsDigitsDepreciation(params, year);
                    depreciation = sydResult.result || new decimal_js_1.default(0);
                    break;
                case 'macrs':
                    const macrsResult = calculateMACRSDepreciation(params, year);
                    depreciation = macrsResult.result || new decimal_js_1.default(0);
                    break;
                default:
                    depreciation = new decimal_js_1.default(0);
            }
            totalAccumulated = totalAccumulated.plus(depreciation);
            const newBookValue = params.depreciableBase.minus(totalAccumulated);
            schedule.push({
                fiscalYear: inServiceDate.getFullYear() + year - 1,
                periodNumber: year,
                periodStartDate: new Date(inServiceDate.getFullYear() + year - 1, 0, 1),
                periodEndDate: new Date(inServiceDate.getFullYear() + year - 1, fiscalYearEnd - 1, 31),
                openingBookValue: currentBookValue,
                depreciationExpense: depreciation,
                accumulatedDepreciation: totalAccumulated,
                closingBookValue: newBookValue.greaterThan(0) ? newBookValue : new decimal_js_1.default(0),
            });
            currentBookValue = newBookValue;
            // Stop if fully depreciated
            if (currentBookValue.lessThanOrEqualTo(params.salvageValue)) {
                break;
            }
        }
        return {
            success: true,
            result: schedule,
            metadata: {
                totalYears: schedule.length,
                method,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Schedule generation failed: ${error.message}`,
        };
    }
}
/**
 * Calculates mid-year convention depreciation adjustment.
 *
 * @param {Decimal} annualDepreciation - Full year depreciation amount
 * @param {Date} inServiceDate - Date asset placed in service
 * @param {Date} fiscalYearEnd - Fiscal year end date
 * @returns {Decimal} Adjusted depreciation amount
 */
function applyHalfYearConvention(annualDepreciation, inServiceDate, fiscalYearEnd) {
    const monthsInService = (fiscalYearEnd.getTime() - inServiceDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    if (monthsInService < 12) {
        return annualDepreciation.dividedBy(2);
    }
    return annualDepreciation;
}
/**
 * Calculates pro-rated depreciation for partial periods.
 *
 * @param {Decimal} annualDepreciation - Full year depreciation
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @returns {Decimal} Pro-rated depreciation amount
 */
function calculateProRatedDepreciation(annualDepreciation, startDate, endDate) {
    const daysInPeriod = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysInYear = 365.25;
    return annualDepreciation.times(daysInPeriod).dividedBy(daysInYear);
}
/**
 * Switches depreciation method mid-lifecycle (e.g., DDB to straight-line).
 *
 * @param {DepreciationParameters} currentParams - Current depreciation parameters
 * @param {DepreciationMethod} newMethod - New depreciation method
 * @param {Decimal} currentBookValue - Current book value
 * @param {number} remainingLife - Remaining useful life in years
 * @returns {CalculationResult<DepreciationParameters>} Updated parameters
 */
function switchDepreciationMethod(currentParams, newMethod, currentBookValue, remainingLife) {
    try {
        const newParams = {
            ...currentParams,
            method: newMethod,
            depreciableBase: currentBookValue,
            usefulLifeYears: remainingLife,
        };
        return {
            success: true,
            result: newParams,
            metadata: {
                switchedFrom: currentParams.method,
                switchedTo: newMethod,
                newDepreciableBase: currentBookValue.toFixed(2),
                remainingLife,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Method switch failed: ${error.message}`,
        };
    }
}
/**
 * Calculates optimal depreciation method switch point (e.g., DDB to SL).
 *
 * @param {DepreciationParameters} params - Depreciation parameters
 * @param {Decimal} currentBookValue - Current book value
 * @param {number} year - Current year
 * @returns {CalculationResult<{shouldSwitch: boolean; newMethod?: DepreciationMethod}>}
 */
function determineOptimalMethodSwitch(params, currentBookValue, year) {
    try {
        if (params.method !== 'double-declining-balance' && params.method !== 'declining-balance') {
            return {
                success: true,
                result: { shouldSwitch: false },
                metadata: { currentMethod: params.method },
            };
        }
        const remainingLife = params.usefulLifeYears - year + 1;
        // Calculate DDB depreciation
        const dbResult = calculateDecliningBalanceDepreciation(params, currentBookValue, year);
        const dbDepreciation = dbResult.result || new decimal_js_1.default(0);
        // Calculate straight-line on remaining basis
        const slDepreciation = currentBookValue.minus(params.salvageValue).dividedBy(remainingLife);
        // Switch when straight-line exceeds declining balance
        if (slDepreciation.greaterThan(dbDepreciation)) {
            return {
                success: true,
                result: {
                    shouldSwitch: true,
                    newMethod: 'straight-line',
                    reason: 'Straight-line depreciation now exceeds declining balance',
                },
                metadata: {
                    dbDepreciation: dbDepreciation.toFixed(2),
                    slDepreciation: slDepreciation.toFixed(2),
                    year,
                    remainingLife,
                },
            };
        }
        return {
            success: true,
            result: { shouldSwitch: false },
            metadata: {
                dbDepreciation: dbDepreciation.toFixed(2),
                slDepreciation: slDepreciation.toFixed(2),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Optimal switch determination failed: ${error.message}`,
        };
    }
}
// ============================================================================
// ASSET MANAGEMENT FUNCTIONS (13-28)
// ============================================================================
/**
 * Capitalizes a new fixed asset with validation and audit trail.
 *
 * @param {Object} assetData - Asset data
 * @param {CapitalizationPolicy} policy - Capitalization policy
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<CalculationResult<any>>} Capitalization result
 *
 * @example
 * ```typescript
 * const result = await capitalizeAsset({
 *   description: 'Server Equipment',
 *   category: 'computers-it',
 *   acquisitionCost: new Decimal('5000'),
 *   acquisitionDate: new Date(),
 *   responsibleDepartment: 'IT'
 * }, {
 *   minimumValue: new Decimal('1000'),
 *   assetCategory: 'computers-it',
 *   requiresApproval: true,
 *   approvalThreshold: new Decimal('5000')
 * }, transaction);
 * ```
 */
async function capitalizeAsset(assetData, policy, transaction) {
    try {
        const acquisitionCost = new decimal_js_1.default(assetData.acquisitionCost);
        // Validate against capitalization threshold
        if (acquisitionCost.lessThan(policy.minimumValue)) {
            return {
                success: false,
                error: `Asset cost ${acquisitionCost.toFixed(2)} below capitalization threshold ${policy.minimumValue.toFixed(2)}`,
                warnings: ['Consider expensing this item instead of capitalizing'],
            };
        }
        // Check approval requirements
        if (policy.requiresApproval && policy.approvalThreshold) {
            if (acquisitionCost.greaterThanOrEqualTo(policy.approvalThreshold) && !assetData.approvedBy) {
                return {
                    success: false,
                    error: 'Approval required for assets exceeding approval threshold',
                };
            }
        }
        return {
            success: true,
            result: assetData,
            metadata: {
                meetsCapitalizationCriteria: true,
                requiresApproval: policy.requiresApproval,
                acquisitionCost: acquisitionCost.toFixed(2),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Capitalization validation failed: ${error.message}`,
        };
    }
}
/**
 * Processes asset disposal and calculates gain/loss.
 *
 * @param {number} assetId - Asset ID
 * @param {AssetDisposal} disposalData - Disposal information
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<CalculationResult<AssetDisposal>>} Disposal result with gain/loss
 *
 * @example
 * ```typescript
 * const disposal = await processAssetDisposal(123, {
 *   disposalDate: new Date(),
 *   disposalMethod: 'sale',
 *   saleProceeds: new Decimal('8000'),
 *   bookValue: new Decimal('7000'),
 *   accumulatedDepreciation: new Decimal('3000'),
 *   gainLoss: new Decimal('1000'),
 *   disposedBy: 'john.doe',
 *   reason: 'Upgrade to newer model'
 * }, transaction);
 * ```
 */
async function processAssetDisposal(assetId, disposalData, transaction) {
    try {
        const saleProceeds = disposalData.saleProceeds ? new decimal_js_1.default(disposalData.saleProceeds.toString()) : new decimal_js_1.default(0);
        const bookValue = new decimal_js_1.default(disposalData.bookValue.toString());
        // Calculate gain or loss
        const gainLoss = saleProceeds.minus(bookValue);
        const disposal = {
            ...disposalData,
            gainLoss,
            netProceeds: saleProceeds,
        };
        return {
            success: true,
            result: disposal,
            metadata: {
                gainLoss: gainLoss.toFixed(2),
                isGain: gainLoss.greaterThan(0),
                disposalMethod: disposalData.disposalMethod,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Disposal processing failed: ${error.message}`,
        };
    }
}
/**
 * Transfers asset to new location/department with audit trail.
 *
 * @param {number} assetId - Asset ID
 * @param {AssetTransfer} transferData - Transfer details
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<CalculationResult<AssetTransfer>>} Transfer result
 */
async function transferAsset(assetId, transferData, transaction) {
    try {
        if (!transferData.approvedBy) {
            return {
                success: false,
                error: 'Asset transfer requires approval',
            };
        }
        return {
            success: true,
            result: transferData,
            metadata: {
                assetId,
                effectiveDate: transferData.effectiveDate,
                transferType: transferData.transferType,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Asset transfer failed: ${error.message}`,
        };
    }
}
/**
 * Tests asset for impairment and calculates impairment loss.
 *
 * @param {number} assetId - Asset ID
 * @param {Decimal} carryingAmount - Current carrying amount
 * @param {Decimal} recoverableAmount - Estimated recoverable amount
 * @returns {CalculationResult<AssetImpairment | null>} Impairment result
 *
 * @example
 * ```typescript
 * const impairment = testAssetImpairment(
 *   123,
 *   new Decimal('50000'),
 *   new Decimal('35000')
 * );
 * // Returns impairment loss of $15,000
 * ```
 */
function testAssetImpairment(assetId, carryingAmount, recoverableAmount) {
    try {
        if (recoverableAmount.greaterThanOrEqualTo(carryingAmount)) {
            return {
                success: true,
                result: null,
                metadata: {
                    impairmentRequired: false,
                    carryingAmount: carryingAmount.toFixed(2),
                    recoverableAmount: recoverableAmount.toFixed(2),
                },
            };
        }
        const impairmentLoss = carryingAmount.minus(recoverableAmount);
        const impairment = {
            impairmentDate: new Date(),
            carryingAmount,
            recoverableAmount,
            impairmentLoss,
            reasonForImpairment: 'Recoverable amount less than carrying amount',
            approvedBy: '',
            reversalAllowed: true,
        };
        return {
            success: true,
            result: impairment,
            metadata: {
                impairmentRequired: true,
                impairmentLoss: impairmentLoss.toFixed(2),
                impairmentPercentage: impairmentLoss.dividedBy(carryingAmount).times(100).toFixed(2),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Impairment test failed: ${error.message}`,
        };
    }
}
/**
 * Revalues asset to fair value and calculates revaluation surplus/deficit.
 *
 * @param {number} assetId - Asset ID
 * @param {AssetRevaluation} revaluationData - Revaluation details
 * @returns {CalculationResult<AssetRevaluation>} Revaluation result
 */
function revalueAsset(assetId, revaluationData) {
    try {
        const previousAmount = new decimal_js_1.default(revaluationData.previousCarryingAmount.toString());
        const fairValue = new decimal_js_1.default(revaluationData.fairValue.toString());
        const revaluationSurplus = fairValue.minus(previousAmount);
        const revaluation = {
            ...revaluationData,
            revaluationSurplus,
        };
        return {
            success: true,
            result: revaluation,
            metadata: {
                revaluationSurplus: revaluationSurplus.toFixed(2),
                isSurplus: revaluationSurplus.greaterThan(0),
                percentageChange: revaluationSurplus.dividedBy(previousAmount).times(100).toFixed(2),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Asset revaluation failed: ${error.message}`,
        };
    }
}
/**
 * Splits asset into componentized parts for separate depreciation.
 *
 * @param {number} assetId - Parent asset ID
 * @param {ComponentAsset[]} components - Component breakdown
 * @returns {CalculationResult<ComponentAsset[]>} Componentization result
 */
function componentizeAsset(assetId, components) {
    try {
        const totalComponentCost = components.reduce((sum, comp) => sum.plus(comp.componentCost), new decimal_js_1.default(0));
        return {
            success: true,
            result: components,
            metadata: {
                componentCount: components.length,
                totalComponentCost: totalComponentCost.toFixed(2),
                assetId,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Asset componentization failed: ${error.message}`,
        };
    }
}
/**
 * Calculates current asset valuation including book value and fair market value.
 *
 * @param {number} assetId - Asset ID
 * @param {Decimal} originalCost - Original cost
 * @param {Decimal} accumulatedDepreciation - Accumulated depreciation
 * @param {Decimal} fairMarketValue - Fair market value (optional)
 * @returns {AssetValuation} Complete valuation
 */
function calculateAssetValuation(assetId, originalCost, accumulatedDepreciation, fairMarketValue) {
    const netBookValue = originalCost.minus(accumulatedDepreciation);
    return {
        valuationDate: new Date(),
        costBasis: originalCost,
        accumulatedDepreciation,
        netBookValue,
        fairMarketValue,
        replacementCost: undefined,
        residualValue: undefined,
    };
}
/**
 * Validates asset data against business rules and constraints.
 *
 * @param {any} assetData - Asset data to validate
 * @returns {CalculationResult<boolean>} Validation result with errors
 */
function validateAssetData(assetData) {
    const errors = [];
    if (!assetData.assetNumber) {
        errors.push('Asset number is required');
    }
    if (!assetData.description) {
        errors.push('Asset description is required');
    }
    if (!assetData.acquisitionCost || assetData.acquisitionCost <= 0) {
        errors.push('Acquisition cost must be greater than zero');
    }
    if (assetData.salvageValue && new decimal_js_1.default(assetData.salvageValue).greaterThanOrEqualTo(assetData.acquisitionCost)) {
        errors.push('Salvage value must be less than acquisition cost');
    }
    if (!assetData.usefulLifeYears || assetData.usefulLifeYears <= 0) {
        errors.push('Useful life must be greater than zero');
    }
    if (assetData.acquisitionDate && assetData.inServiceDate) {
        if (new Date(assetData.inServiceDate) < new Date(assetData.acquisitionDate)) {
            errors.push('In-service date cannot be before acquisition date');
        }
    }
    if (errors.length > 0) {
        return {
            success: false,
            error: 'Asset data validation failed',
            warnings: errors,
        };
    }
    return {
        success: true,
        result: true,
    };
}
/**
 * Generates asset tag number using configurable format.
 *
 * @param {AssetCategory} category - Asset category
 * @param {number} sequenceNumber - Sequence number
 * @param {string} prefix - Optional prefix
 * @returns {string} Generated asset tag
 *
 * @example
 * ```typescript
 * const tag = generateAssetTag('computers-it', 123, 'USACE');
 * // Returns: 'USACE-IT-2024-00123'
 * ```
 */
function generateAssetTag(category, sequenceNumber, prefix = 'ASSET') {
    const categoryCode = {
        'land': 'LND',
        'buildings': 'BLD',
        'leasehold-improvements': 'LHI',
        'machinery-equipment': 'MCH',
        'vehicles': 'VEH',
        'furniture-fixtures': 'FUR',
        'computers-it': 'IT',
        'software': 'SFT',
        'infrastructure': 'INF',
        'construction-in-progress': 'CIP',
    };
    const year = new Date().getFullYear();
    const code = categoryCode[category];
    const sequence = sequenceNumber.toString().padStart(5, '0');
    return `${prefix}-${code}-${year}-${sequence}`;
}
/**
 * Calculates remaining useful life based on current date and original parameters.
 *
 * @param {Date} inServiceDate - In-service date
 * @param {number} originalUsefulLife - Original useful life in years
 * @returns {number} Remaining useful life in years
 */
function calculateRemainingUsefulLife(inServiceDate, originalUsefulLife) {
    const currentDate = new Date();
    const yearsInService = (currentDate.getTime() - inServiceDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    const remainingLife = originalUsefulLife - yearsInService;
    return Math.max(0, remainingLife);
}
/**
 * Groups assets by specified criteria for mass operations.
 *
 * @param {any[]} assets - Array of assets
 * @param {keyof any} groupBy - Field to group by
 * @returns {Record<string, any[]>} Grouped assets
 */
function groupAssets(assets, groupBy) {
    return assets.reduce((groups, asset) => {
        const key = asset[groupBy] || 'uncategorized';
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(asset);
        return groups;
    }, {});
}
/**
 * Performs physical inventory reconciliation.
 *
 * @param {any[]} systemAssets - Assets from system
 * @param {any[]} physicalAssets - Assets from physical count
 * @returns {CalculationResult<{matches: any[]; missing: any[]; unrecorded: any[]}>}
 */
function reconcilePhysicalInventory(systemAssets, physicalAssets) {
    try {
        const systemMap = new Map(systemAssets.map(a => [a.assetNumber, a]));
        const physicalMap = new Map(physicalAssets.map(a => [a.assetNumber, a]));
        const matches = [];
        const missing = [];
        const unrecorded = [];
        // Find matches and missing
        for (const [assetNumber, asset] of systemMap) {
            if (physicalMap.has(assetNumber)) {
                matches.push(asset);
            }
            else {
                missing.push(asset);
            }
        }
        // Find unrecorded
        for (const [assetNumber, asset] of physicalMap) {
            if (!systemMap.has(assetNumber)) {
                unrecorded.push(asset);
            }
        }
        return {
            success: true,
            result: { matches, missing, unrecorded },
            metadata: {
                totalSystem: systemAssets.length,
                totalPhysical: physicalAssets.length,
                matchCount: matches.length,
                missingCount: missing.length,
                unrecordedCount: unrecorded.length,
                reconciliationRate: (matches.length / systemAssets.length * 100).toFixed(2),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Inventory reconciliation failed: ${error.message}`,
        };
    }
}
/**
 * Calculates insurance value for asset portfolio.
 *
 * @param {any[]} assets - Array of assets
 * @param {number} inflationFactor - Inflation adjustment factor
 * @returns {CalculationResult<Decimal>} Total insurance value
 */
function calculateInsuranceValue(assets, inflationFactor = 1.0) {
    try {
        const totalValue = assets.reduce((sum, asset) => {
            const bookValue = new decimal_js_1.default(asset.currentBookValue || 0);
            const adjustedValue = bookValue.times(inflationFactor);
            return sum.plus(adjustedValue);
        }, new decimal_js_1.default(0));
        return {
            success: true,
            result: totalValue,
            metadata: {
                assetCount: assets.length,
                inflationFactor,
                totalValue: totalValue.toFixed(2),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Insurance value calculation failed: ${error.message}`,
        };
    }
}
/**
 * Estimates salvage value based on asset category and condition.
 *
 * @param {AssetCategory} category - Asset category
 * @param {Decimal} originalCost - Original cost
 * @param {number} age - Asset age in years
 * @param {string} condition - Asset condition
 * @returns {Decimal} Estimated salvage value
 */
function estimateSalvageValue(category, originalCost, age, condition = 'good') {
    const salvageRates = {
        'land': 1.0, // Land typically doesn't depreciate
        'buildings': 0.10,
        'leasehold-improvements': 0.0,
        'machinery-equipment': 0.10,
        'vehicles': 0.15,
        'furniture-fixtures': 0.05,
        'computers-it': 0.05,
        'software': 0.0,
        'infrastructure': 0.20,
        'construction-in-progress': 0.0,
    };
    const conditionMultiplier = {
        'excellent': 1.5,
        'good': 1.0,
        'fair': 0.6,
        'poor': 0.3,
    };
    const baseRate = salvageRates[category];
    const multiplier = conditionMultiplier[condition];
    return originalCost.times(baseRate).times(multiplier);
}
/**
 * Generates asset replacement forecast based on remaining life.
 *
 * @param {any[]} assets - Array of assets
 * @param {number} forecastYears - Years to forecast
 * @returns {Record<number, any[]>} Assets requiring replacement by year
 */
function generateReplacementForecast(assets, forecastYears = 5) {
    const forecast = {};
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= forecastYears; i++) {
        forecast[currentYear + i] = [];
    }
    assets.forEach(asset => {
        const remainingLife = calculateRemainingUsefulLife(new Date(asset.inServiceDate), asset.usefulLifeYears);
        const replacementYear = currentYear + Math.ceil(remainingLife);
        if (replacementYear <= currentYear + forecastYears) {
            forecast[replacementYear].push(asset);
        }
    });
    return forecast;
}
/**
 * Calculates total cost of ownership including acquisition, maintenance, disposal.
 *
 * @param {Decimal} acquisitionCost - Initial cost
 * @param {Decimal} annualMaintenanceCost - Annual maintenance
 * @param {number} usefulLife - Useful life in years
 * @param {Decimal} disposalValue - Expected disposal value
 * @param {number} discountRate - Discount rate for NPV
 * @returns {CalculationResult<Decimal>} Total cost of ownership (NPV)
 */
function calculateTotalCostOfOwnership(acquisitionCost, annualMaintenanceCost, usefulLife, disposalValue, discountRate = 0.05) {
    try {
        let totalCost = acquisitionCost;
        // Add NPV of maintenance costs
        for (let year = 1; year <= usefulLife; year++) {
            const discountFactor = Math.pow(1 + discountRate, year);
            const npvMaintenance = annualMaintenanceCost.dividedBy(discountFactor);
            totalCost = totalCost.plus(npvMaintenance);
        }
        // Subtract NPV of disposal value
        const discountFactor = Math.pow(1 + discountRate, usefulLife);
        const npvDisposal = disposalValue.dividedBy(discountFactor);
        totalCost = totalCost.minus(npvDisposal);
        return {
            success: true,
            result: totalCost,
            metadata: {
                acquisitionCost: acquisitionCost.toFixed(2),
                totalMaintenanceNPV: totalCost.minus(acquisitionCost).plus(npvDisposal).toFixed(2),
                disposalValueNPV: npvDisposal.toFixed(2),
                usefulLife,
                discountRate,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `TCO calculation failed: ${error.message}`,
        };
    }
}
// ============================================================================
// REPORTING & ANALYTICS FUNCTIONS (29-45)
// ============================================================================
/**
 * Generates asset register report with all active assets.
 *
 * @param {any[]} assets - Array of assets
 * @param {Object} filters - Filter criteria
 * @returns {CalculationResult<any[]>} Filtered asset register
 */
function generateAssetRegister(assets, filters = {}) {
    try {
        let filtered = assets;
        if (filters.category) {
            filtered = filtered.filter(a => a.category === filters.category);
        }
        if (filters.status) {
            filtered = filtered.filter(a => a.status === filters.status);
        }
        if (filters.department) {
            filtered = filtered.filter(a => a.responsibleDepartment === filters.department);
        }
        if (filters.dateRange) {
            filtered = filtered.filter(a => {
                const inServiceDate = new Date(a.inServiceDate);
                return inServiceDate >= filters.dateRange.start && inServiceDate <= filters.dateRange.end;
            });
        }
        return {
            success: true,
            result: filtered,
            metadata: {
                totalAssets: assets.length,
                filteredAssets: filtered.length,
                filters,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Asset register generation failed: ${error.message}`,
        };
    }
}
/**
 * Calculates depreciation expense summary for period.
 *
 * @param {any[]} schedules - Depreciation schedules
 * @param {number} fiscalYear - Fiscal year
 * @param {number} periodNumber - Period number
 * @returns {CalculationResult<{totalExpense: Decimal; byCategory: Record<string, Decimal>}>}
 */
function calculateDepreciationExpenseSummary(schedules, fiscalYear, periodNumber) {
    try {
        let filtered = schedules.filter(s => s.fiscalYear === fiscalYear);
        if (periodNumber) {
            filtered = filtered.filter(s => s.periodNumber === periodNumber);
        }
        const totalExpense = filtered.reduce((sum, s) => sum.plus(new decimal_js_1.default(s.depreciationExpense)), new decimal_js_1.default(0));
        const byCategory = {};
        // Would need asset category data joined in real implementation
        return {
            success: true,
            result: { totalExpense, byCategory },
            metadata: {
                fiscalYear,
                periodNumber,
                scheduleCount: filtered.length,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Depreciation summary calculation failed: ${error.message}`,
        };
    }
}
/**
 * Generates asset acquisition report for period.
 *
 * @param {any[]} assets - Assets
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {CalculationResult<{assets: any[]; totalCost: Decimal}>}
 */
function generateAcquisitionReport(assets, startDate, endDate) {
    try {
        const acquired = assets.filter(a => {
            const acqDate = new Date(a.acquisitionDate);
            return acqDate >= startDate && acqDate <= endDate;
        });
        const totalCost = acquired.reduce((sum, a) => sum.plus(new decimal_js_1.default(a.acquisitionCost)), new decimal_js_1.default(0));
        const byCategory = {};
        acquired.forEach(a => {
            if (!byCategory[a.category]) {
                byCategory[a.category] = new decimal_js_1.default(0);
            }
            byCategory[a.category] = byCategory[a.category].plus(new decimal_js_1.default(a.acquisitionCost));
        });
        return {
            success: true,
            result: { assets: acquired, totalCost, byCategory },
            metadata: {
                period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
                assetCount: acquired.length,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Acquisition report generation failed: ${error.message}`,
        };
    }
}
/**
 * Generates disposal report with gains/losses.
 *
 * @param {any[]} disposals - Disposal records
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {CalculationResult<any>} Disposal report with totals
 */
function generateDisposalReport(disposals, startDate, endDate) {
    try {
        const filtered = disposals.filter(d => {
            const dispDate = new Date(d.disposalDate);
            return dispDate >= startDate && dispDate <= endDate;
        });
        const totalProceeds = filtered.reduce((sum, d) => sum.plus(new decimal_js_1.default(d.saleProceeds || 0)), new decimal_js_1.default(0));
        const totalGainLoss = filtered.reduce((sum, d) => sum.plus(new decimal_js_1.default(d.gainLoss)), new decimal_js_1.default(0));
        const byMethod = groupAssets(filtered, 'disposalMethod');
        return {
            success: true,
            result: {
                disposals: filtered,
                totalProceeds,
                totalGainLoss,
                byMethod,
            },
            metadata: {
                disposalCount: filtered.length,
                period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Disposal report generation failed: ${error.message}`,
        };
    }
}
/**
 * Calculates asset portfolio summary statistics.
 *
 * @param {any[]} assets - Array of assets
 * @returns {CalculationResult<any>} Portfolio statistics
 */
function calculatePortfolioSummary(assets) {
    try {
        const totalAcquisitionCost = assets.reduce((sum, a) => sum.plus(new decimal_js_1.default(a.acquisitionCost)), new decimal_js_1.default(0));
        const totalAccumulatedDepreciation = assets.reduce((sum, a) => sum.plus(new decimal_js_1.default(a.accumulatedDepreciation || 0)), new decimal_js_1.default(0));
        const totalBookValue = assets.reduce((sum, a) => sum.plus(new decimal_js_1.default(a.currentBookValue)), new decimal_js_1.default(0));
        const byCategory = groupAssets(assets, 'category');
        const byStatus = groupAssets(assets, 'status');
        const fullyDepreciated = assets.filter(a => a.fullyDepreciated).length;
        const averageAge = assets.reduce((sum, a) => {
            const age = (new Date().getTime() - new Date(a.inServiceDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
            return sum + age;
        }, 0) / assets.length;
        return {
            success: true,
            result: {
                totalAssets: assets.length,
                totalAcquisitionCost,
                totalAccumulatedDepreciation,
                totalBookValue,
                byCategory,
                byStatus,
                fullyDepreciatedCount: fullyDepreciated,
                averageAge,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Portfolio summary calculation failed: ${error.message}`,
        };
    }
}
/**
 * Generates fully depreciated assets report.
 *
 * @param {any[]} assets - Array of assets
 * @returns {CalculationResult<any[]>} Fully depreciated assets
 */
function generateFullyDepreciatedReport(assets) {
    try {
        const fullyDepreciated = assets.filter(a => a.fullyDepreciated && a.status === 'in-service');
        return {
            success: true,
            result: fullyDepreciated,
            metadata: {
                count: fullyDepreciated.length,
                totalOriginalCost: fullyDepreciated.reduce((sum, a) => sum.plus(new decimal_js_1.default(a.acquisitionCost)), new decimal_js_1.default(0)).toFixed(2),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Fully depreciated report failed: ${error.message}`,
        };
    }
}
/**
 * Generates assets requiring physical inventory verification.
 *
 * @param {any[]} assets - Array of assets
 * @param {number} monthsThreshold - Months since last verification
 * @returns {CalculationResult<any[]>} Assets needing verification
 */
function generateInventoryVerificationList(assets, monthsThreshold = 12) {
    try {
        const thresholdDate = new Date();
        thresholdDate.setMonth(thresholdDate.getMonth() - monthsThreshold);
        const needsVerification = assets.filter(a => {
            if (!a.lastPhysicalInventoryDate)
                return true;
            return new Date(a.lastPhysicalInventoryDate) < thresholdDate;
        });
        return {
            success: true,
            result: needsVerification,
            metadata: {
                count: needsVerification.length,
                monthsThreshold,
                thresholdDate: thresholdDate.toISOString(),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Verification list generation failed: ${error.message}`,
        };
    }
}
/**
 * Calculates depreciation variance analysis (actual vs. budgeted).
 *
 * @param {Decimal} actualDepreciation - Actual depreciation
 * @param {Decimal} budgetedDepreciation - Budgeted depreciation
 * @returns {CalculationResult<any>} Variance analysis
 */
function calculateDepreciationVariance(actualDepreciation, budgetedDepreciation) {
    try {
        const variance = actualDepreciation.minus(budgetedDepreciation);
        const variancePercent = variance.dividedBy(budgetedDepreciation).times(100);
        return {
            success: true,
            result: {
                actual: actualDepreciation,
                budgeted: budgetedDepreciation,
                variance,
                variancePercent,
                isFavorable: variance.lessThan(0),
            },
            metadata: {
                varianceAmount: variance.toFixed(2),
                variancePercentage: variancePercent.toFixed(2),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Variance calculation failed: ${error.message}`,
        };
    }
}
/**
 * Exports asset data to specified format (CSV, JSON, Excel).
 *
 * @param {any[]} assets - Assets to export
 * @param {string} format - Export format
 * @returns {CalculationResult<any>} Exported data
 */
function exportAssetData(assets, format) {
    try {
        if (format === 'json') {
            return {
                success: true,
                result: JSON.stringify(assets, null, 2),
                metadata: { format, recordCount: assets.length },
            };
        }
        // CSV and Excel exports would require additional libraries
        return {
            success: true,
            result: assets,
            metadata: { format, recordCount: assets.length },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Export failed: ${error.message}`,
        };
    }
}
/**
 * Generates asset age analysis report.
 *
 * @param {any[]} assets - Array of assets
 * @returns {CalculationResult<Record<string, any[]>>} Assets grouped by age ranges
 */
function generateAssetAgeAnalysis(assets) {
    try {
        const ageRanges = {
            '0-2 years': [],
            '3-5 years': [],
            '6-10 years': [],
            '11+ years': [],
        };
        assets.forEach(asset => {
            const age = (new Date().getTime() - new Date(asset.inServiceDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
            if (age <= 2) {
                ageRanges['0-2 years'].push(asset);
            }
            else if (age <= 5) {
                ageRanges['3-5 years'].push(asset);
            }
            else if (age <= 10) {
                ageRanges['6-10 years'].push(asset);
            }
            else {
                ageRanges['11+ years'].push(asset);
            }
        });
        return {
            success: true,
            result: ageRanges,
            metadata: {
                totalAssets: assets.length,
                distribution: Object.entries(ageRanges).reduce((acc, [range, assets]) => {
                    acc[range] = assets.length;
                    return acc;
                }, {}),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Age analysis failed: ${error.message}`,
        };
    }
}
/**
 * Calculates asset utilization metrics.
 *
 * @param {any} asset - Asset data
 * @param {UnitsOfProductionData} usageData - Usage data
 * @returns {CalculationResult<any>} Utilization metrics
 */
function calculateAssetUtilization(asset, usageData) {
    try {
        if (!usageData) {
            return {
                success: false,
                error: 'Usage data required for utilization calculation',
            };
        }
        const utilizationRate = (usageData.unitsProducedToDate / usageData.totalEstimatedUnits) * 100;
        const remainingCapacity = usageData.totalEstimatedUnits - usageData.unitsProducedToDate;
        return {
            success: true,
            result: {
                utilizationRate,
                remainingCapacity,
                totalCapacity: usageData.totalEstimatedUnits,
                usedCapacity: usageData.unitsProducedToDate,
                unitType: usageData.unitType,
            },
            metadata: {
                assetId: asset.id,
                utilizationPercentage: utilizationRate.toFixed(2),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Utilization calculation failed: ${error.message}`,
        };
    }
}
/**
 * Generates asset maintenance cost analysis.
 *
 * @param {any} asset - Asset data
 * @param {any[]} maintenanceRecords - Maintenance history
 * @returns {CalculationResult<any>} Maintenance cost analysis
 */
function analyzeMaintenanceCosts(asset, maintenanceRecords) {
    try {
        const totalCost = maintenanceRecords.reduce((sum, record) => sum.plus(new decimal_js_1.default(record.cost || 0)), new decimal_js_1.default(0));
        const age = (new Date().getTime() - new Date(asset.inServiceDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        const annualizedCost = totalCost.dividedBy(age);
        return {
            success: true,
            result: {
                totalMaintenanceCost: totalCost,
                annualizedCost,
                maintenanceCount: maintenanceRecords.length,
                costPerMaintenance: totalCost.dividedBy(maintenanceRecords.length || 1),
                assetAge: age,
            },
            metadata: {
                assetId: asset.id,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Maintenance analysis failed: ${error.message}`,
        };
    }
}
/**
 * Generates asset compliance report for regulatory requirements.
 *
 * @param {any[]} assets - Array of assets
 * @param {string[]} complianceRequirements - Required compliance items
 * @returns {CalculationResult<any>} Compliance report
 */
function generateComplianceReport(assets, complianceRequirements) {
    try {
        const compliant = [];
        const nonCompliant = [];
        assets.forEach(asset => {
            // Check if asset meets all compliance requirements
            // This is a simplified example - real implementation would check specific fields
            const meetsRequirements = complianceRequirements.every(req => {
                // Example: check if required fields are present
                return asset[req] !== null && asset[req] !== undefined;
            });
            if (meetsRequirements) {
                compliant.push(asset);
            }
            else {
                nonCompliant.push(asset);
            }
        });
        return {
            success: true,
            result: {
                compliant,
                nonCompliant,
                complianceRate: (compliant.length / assets.length) * 100,
            },
            metadata: {
                totalAssets: assets.length,
                compliantCount: compliant.length,
                nonCompliantCount: nonCompliant.length,
                requirements: complianceRequirements,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Compliance report failed: ${error.message}`,
        };
    }
}
/**
 * Calculates asset ROI (Return on Investment).
 *
 * @param {Decimal} acquisitionCost - Initial investment
 * @param {Decimal} totalRevenue - Revenue generated by asset
 * @param {Decimal} totalOperatingCosts - Operating costs
 * @param {number} years - Years in service
 * @returns {CalculationResult<any>} ROI analysis
 */
function calculateAssetROI(acquisitionCost, totalRevenue, totalOperatingCosts, years) {
    try {
        const netBenefit = totalRevenue.minus(totalOperatingCosts).minus(acquisitionCost);
        const roi = netBenefit.dividedBy(acquisitionCost).times(100);
        const annualizedROI = roi.dividedBy(years);
        return {
            success: true,
            result: {
                roi,
                annualizedROI,
                netBenefit,
                acquisitionCost,
                totalRevenue,
                totalOperatingCosts,
                years,
            },
            metadata: {
                roiPercentage: roi.toFixed(2),
                annualizedROIPercentage: annualizedROI.toFixed(2),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `ROI calculation failed: ${error.message}`,
        };
    }
}
/**
 * Generates asset lifecycle cost comparison for replacement decisions.
 *
 * @param {any} currentAsset - Current asset
 * @param {any} replacementAsset - Potential replacement
 * @param {number} analysisYears - Years to analyze
 * @returns {CalculationResult<any>} Lifecycle comparison
 */
function compareAssetLifecycleCosts(currentAsset, replacementAsset, analysisYears = 10) {
    try {
        const currentTCO = calculateTotalCostOfOwnership(new decimal_js_1.default(0), // Already owned
        new decimal_js_1.default(currentAsset.annualMaintenanceCost || 0), analysisYears, new decimal_js_1.default(currentAsset.estimatedDisposalValue || 0));
        const replacementTCO = calculateTotalCostOfOwnership(new decimal_js_1.default(replacementAsset.acquisitionCost), new decimal_js_1.default(replacementAsset.annualMaintenanceCost || 0), analysisYears, new decimal_js_1.default(replacementAsset.estimatedDisposalValue || 0));
        const savings = currentTCO.result.minus(replacementTCO.result);
        return {
            success: true,
            result: {
                currentAssetTCO: currentTCO.result,
                replacementAssetTCO: replacementTCO.result,
                potentialSavings: savings,
                recommendReplacement: savings.greaterThan(0),
                analysisYears,
            },
            metadata: {
                currentAssetId: currentAsset.id,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Lifecycle comparison failed: ${error.message}`,
        };
    }
}
/**
 * Generates grant-funded assets report for compliance tracking.
 *
 * @param {any[]} assets - Array of assets
 * @param {string} grantNumber - Grant number to filter
 * @returns {CalculationResult<any>} Grant assets report
 */
function generateGrantAssetsReport(assets, grantNumber) {
    try {
        let grantAssets = assets.filter(a => a.grantNumber);
        if (grantNumber) {
            grantAssets = grantAssets.filter(a => a.grantNumber === grantNumber);
        }
        const byGrant = groupAssets(grantAssets, 'grantNumber');
        const summary = Object.entries(byGrant).reduce((acc, [grant, assets]) => {
            acc[grant] = {
                assetCount: assets.length,
                totalCost: assets.reduce((sum, a) => sum.plus(new decimal_js_1.default(a.acquisitionCost)), new decimal_js_1.default(0)),
                totalBookValue: assets.reduce((sum, a) => sum.plus(new decimal_js_1.default(a.currentBookValue)), new decimal_js_1.default(0)),
            };
            return acc;
        }, {});
        return {
            success: true,
            result: {
                assets: grantAssets,
                byGrant,
                summary,
            },
            metadata: {
                totalGrantAssets: grantAssets.length,
                grantCount: Object.keys(byGrant).length,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Grant assets report failed: ${error.message}`,
        };
    }
}
/**
 * Performs year-end depreciation closing procedures.
 *
 * @param {any[]} schedules - Depreciation schedules for the year
 * @param {number} fiscalYear - Fiscal year to close
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<CalculationResult<any>>} Closing summary
 */
async function performYearEndDepreciationClosing(schedules, fiscalYear, transaction) {
    try {
        const yearSchedules = schedules.filter(s => s.fiscalYear === fiscalYear);
        const totalDepreciation = yearSchedules.reduce((sum, s) => sum.plus(new decimal_js_1.default(s.depreciationExpense)), new decimal_js_1.default(0));
        const unpostedSchedules = yearSchedules.filter(s => !s.posted);
        return {
            success: true,
            result: {
                fiscalYear,
                totalSchedules: yearSchedules.length,
                totalDepreciation,
                postedCount: yearSchedules.length - unpostedSchedules.length,
                unpostedCount: unpostedSchedules.length,
                readyForClose: unpostedSchedules.length === 0,
            },
            warnings: unpostedSchedules.length > 0 ? ['Unposted depreciation schedules exist'] : undefined,
        };
    }
    catch (error) {
        return {
            success: false,
            error: `Year-end closing failed: ${error.message}`,
        };
    }
}
//# sourceMappingURL=asset-management-depreciation-kit.js.map