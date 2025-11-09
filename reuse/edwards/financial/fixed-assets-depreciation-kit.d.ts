/**
 * LOC: FIXASSET001
 * File: /reuse/edwards/financial/fixed-assets-depreciation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - date-fns (Date manipulation utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Asset management services
 *   - Depreciation calculation services
 *   - Financial reporting modules
 *   - Tax reporting services
 */
/**
 * File: /reuse/edwards/financial/fixed-assets-depreciation-kit.ts
 * Locator: WC-FIN-FIXASSET-001
 * Purpose: Comprehensive Fixed Assets and Depreciation Management - JD Edwards EnterpriseOne-level asset lifecycle, depreciation calculation, and compliance
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, date-fns 3.x
 * Downstream: ../backend/financial/*, Asset Management Services, Depreciation Services, Tax Reporting, Financial Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, date-fns 3.x
 * Exports: 45 functions for asset acquisition, disposal, transfers, depreciation calculation (straight-line, declining balance, MACRS, sum-of-years-digits), asset revaluation, impairment, asset tracking, inventory management, tax compliance
 *
 * LLM Context: Enterprise-grade fixed assets and depreciation management competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive asset lifecycle management from acquisition through disposal, automated depreciation calculations
 * using multiple methods (straight-line, declining balance, double-declining balance, MACRS, sum-of-years-digits, units-of-production),
 * asset transfers between locations/cost centers, revaluation and impairment testing, asset inventory reconciliation,
 * gain/loss calculations on disposal, tax basis tracking, compliance reporting, audit trails, and multi-book accounting.
 */
import { Sequelize, Transaction } from 'sequelize';
interface AssetDepreciationSchedule {
    scheduleId: number;
    assetId: number;
    periodYear: number;
    periodMonth: number;
    beginningBookValue: number;
    depreciationExpense: number;
    accumulatedDepreciation: number;
    endingBookValue: number;
    taxDepreciation?: number;
    taxBookValue?: number;
}
export declare class CreateAssetDto {
    assetNumber: string;
    assetTag: string;
    assetName: string;
    assetDescription: string;
    assetCategory: string;
    assetType: string;
    acquisitionDate: Date;
    acquisitionCost: number;
    residualValue: number;
    usefulLife: number;
    usefulLifeUnit: string;
    depreciationMethod: string;
    locationCode: string;
    departmentCode: string;
    costCenterCode: string;
}
export declare class CalculateDepreciationDto {
    assetId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    depreciationDate: Date;
    depreciationType?: string;
}
export declare class DisposeAssetDto {
    assetId: number;
    disposalDate: Date;
    disposalType: string;
    disposalAmount: number;
    disposalReason: string;
    approvedBy: string;
}
export declare class TransferAssetDto {
    assetId: number;
    transferDate: Date;
    toLocationCode: string;
    toDepartmentCode: string;
    toCostCenter: string;
    transferReason: string;
    transferredBy: string;
}
export declare class RevalueAssetDto {
    assetId: number;
    revaluationDate: Date;
    revaluedAmount: number;
    revaluationReason: string;
    accountingStandard: string;
    approvedBy: string;
}
/**
 * Sequelize model for Fixed Assets with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FixedAsset model
 *
 * @example
 * ```typescript
 * const FixedAsset = createFixedAssetModel(sequelize);
 * const asset = await FixedAsset.create({
 *   assetNumber: 'FA-2024-001',
 *   assetName: 'Server Equipment',
 *   acquisitionCost: 50000,
 *   usefulLife: 5,
 *   depreciationMethod: 'straight-line'
 * });
 * ```
 */
export declare const createFixedAssetModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        assetNumber: string;
        assetTag: string;
        assetName: string;
        assetDescription: string;
        assetCategory: string;
        assetClass: string;
        assetType: string;
        serialNumber: string | null;
        manufacturer: string | null;
        model: string | null;
        acquisitionDate: Date;
        acquisitionCost: number;
        residualValue: number;
        usefulLife: number;
        usefulLifeUnit: string;
        depreciationMethod: string;
        depreciationRate: number | null;
        macrsClass: string | null;
        status: string;
        locationId: number;
        locationCode: string;
        departmentId: number;
        departmentCode: string;
        costCenterCode: string;
        responsiblePerson: string | null;
        currentBookValue: number;
        accumulatedDepreciation: number;
        taxBasis: number;
        taxDepreciation: number;
        disposalDate: Date | null;
        disposalAmount: number | null;
        disposalGainLoss: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
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
 *   assetId: 1,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   depreciationAmount: 833.33,
 *   depreciationType: 'book'
 * });
 * ```
 */
export declare const createAssetDepreciationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        assetId: number;
        fiscalYear: number;
        fiscalPeriod: number;
        depreciationDate: Date;
        depreciationType: string;
        depreciationMethod: string;
        depreciationAmount: number;
        accumulatedDepreciation: number;
        netBookValue: number;
        taxDepreciation: number | null;
        taxAccumulatedDepreciation: number | null;
        taxNetBookValue: number | null;
        calculationBasis: string;
        isAdjustment: boolean;
        adjustmentReason: string | null;
        journalEntryId: number | null;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
    };
};
/**
 * Creates a new fixed asset record with full acquisition details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateAssetDto} assetData - Asset creation data
 * @param {string} userId - User creating the asset
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created asset record
 *
 * @example
 * ```typescript
 * const asset = await createFixedAsset(sequelize, {
 *   assetNumber: 'FA-2024-001',
 *   assetName: 'Dell Server',
 *   acquisitionCost: 15000,
 *   usefulLife: 5,
 *   depreciationMethod: 'straight-line'
 * }, 'user123');
 * ```
 */
export declare const createFixedAsset: (sequelize: Sequelize, assetData: CreateAssetDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates an existing fixed asset record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {Partial<CreateAssetDto>} updateData - Update data
 * @param {string} userId - User updating the asset
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * const updated = await updateFixedAsset(sequelize, 1, {
 *   locationCode: 'LOC-002',
 *   responsiblePerson: 'John Doe'
 * }, 'user123');
 * ```
 */
export declare const updateFixedAsset: (sequelize: Sequelize, assetId: number, updateData: Partial<CreateAssetDto>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves a fixed asset by ID with full details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Asset record
 *
 * @example
 * ```typescript
 * const asset = await getFixedAssetById(sequelize, 1);
 * ```
 */
export declare const getFixedAssetById: (sequelize: Sequelize, assetId: number, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves a fixed asset by asset number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} assetNumber - Asset number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Asset record
 *
 * @example
 * ```typescript
 * const asset = await getFixedAssetByNumber(sequelize, 'FA-2024-001');
 * ```
 */
export declare const getFixedAssetByNumber: (sequelize: Sequelize, assetNumber: string, transaction?: Transaction) => Promise<any>;
/**
 * Lists fixed assets with filtering and pagination.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Filter criteria
 * @param {number} [limit=100] - Maximum results
 * @param {number} [offset=0] - Results offset
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of assets
 *
 * @example
 * ```typescript
 * const assets = await listFixedAssets(sequelize, {
 *   assetType: 'equipment',
 *   status: 'active',
 *   locationCode: 'LOC-001'
 * }, 50, 0);
 * ```
 */
export declare const listFixedAssets: (sequelize: Sequelize, filters?: any, limit?: number, offset?: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Generates a unique asset number based on type and sequence.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} assetType - Asset type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated asset number
 *
 * @example
 * ```typescript
 * const assetNumber = await generateAssetNumber(sequelize, 'equipment');
 * // Returns: 'EQ-2024-00001'
 * ```
 */
export declare const generateAssetNumber: (sequelize: Sequelize, assetType: string, transaction?: Transaction) => Promise<string>;
/**
 * Calculates straight-line depreciation for an asset.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {Date} depreciationDate - Depreciation date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Depreciation amount
 *
 * @example
 * ```typescript
 * const depreciation = await calculateStraightLineDepreciation(
 *   sequelize,
 *   1,
 *   new Date('2024-01-31')
 * );
 * // For $10,000 asset with 5-year life: returns 166.67 (monthly)
 * ```
 */
export declare const calculateStraightLineDepreciation: (sequelize: Sequelize, assetId: number, depreciationDate: Date, transaction?: Transaction) => Promise<number>;
/**
 * Calculates declining balance depreciation for an asset.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {Date} depreciationDate - Depreciation date
 * @param {number} [rate] - Depreciation rate (if not using asset's default)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Depreciation amount
 *
 * @example
 * ```typescript
 * const depreciation = await calculateDecliningBalanceDepreciation(
 *   sequelize,
 *   1,
 *   new Date('2024-01-31'),
 *   0.20 // 20% declining balance
 * );
 * ```
 */
export declare const calculateDecliningBalanceDepreciation: (sequelize: Sequelize, assetId: number, depreciationDate: Date, rate?: number, transaction?: Transaction) => Promise<number>;
/**
 * Calculates double-declining balance depreciation for an asset.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {Date} depreciationDate - Depreciation date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Depreciation amount
 *
 * @example
 * ```typescript
 * const depreciation = await calculateDoubleDecliningDepreciation(
 *   sequelize,
 *   1,
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare const calculateDoubleDecliningDepreciation: (sequelize: Sequelize, assetId: number, depreciationDate: Date, transaction?: Transaction) => Promise<number>;
/**
 * Calculates sum-of-years-digits depreciation for an asset.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {Date} depreciationDate - Depreciation date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Depreciation amount
 *
 * @example
 * ```typescript
 * const depreciation = await calculateSumOfYearsDigitsDepreciation(
 *   sequelize,
 *   1,
 *   new Date('2024-06-30')
 * );
 * ```
 */
export declare const calculateSumOfYearsDigitsDepreciation: (sequelize: Sequelize, assetId: number, depreciationDate: Date, transaction?: Transaction) => Promise<number>;
/**
 * Calculates units-of-production depreciation for an asset.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {number} unitsProduced - Units produced in period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Depreciation amount
 *
 * @example
 * ```typescript
 * const depreciation = await calculateUnitsOfProductionDepreciation(
 *   sequelize,
 *   1,
 *   1000 // units produced this period
 * );
 * ```
 */
export declare const calculateUnitsOfProductionDepreciation: (sequelize: Sequelize, assetId: number, unitsProduced: number, transaction?: Transaction) => Promise<number>;
/**
 * Calculates MACRS depreciation for an asset (US tax purposes).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {number} taxYear - Tax year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Annual MACRS depreciation amount
 *
 * @example
 * ```typescript
 * const depreciation = await calculateMACRSDepreciation(
 *   sequelize,
 *   1,
 *   2024
 * );
 * ```
 */
export declare const calculateMACRSDepreciation: (sequelize: Sequelize, assetId: number, taxYear: number, transaction?: Transaction) => Promise<number>;
/**
 * Gets the MACRS depreciation rate for a given class and year.
 *
 * @param {string} macrsClass - MACRS asset class
 * @param {number} year - Year in service (1-based)
 * @returns {number} Depreciation rate (decimal)
 *
 * @example
 * ```typescript
 * const rate = getMACRSRate('5-year', 2); // Returns 0.32 for year 2
 * ```
 */
export declare const getMACRSRate: (macrsClass: string, year: number) => number;
/**
 * Records depreciation for an asset for a specific period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CalculateDepreciationDto} depreciationData - Depreciation data
 * @param {string} userId - User recording depreciation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Depreciation record
 *
 * @example
 * ```typescript
 * const depreciation = await recordAssetDepreciation(sequelize, {
 *   assetId: 1,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   depreciationDate: new Date('2024-01-31'),
 *   depreciationType: 'book'
 * }, 'user123');
 * ```
 */
export declare const recordAssetDepreciation: (sequelize: Sequelize, depreciationData: CalculateDepreciationDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Calculates and records depreciation for multiple assets in a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Date} depreciationDate - Depreciation date
 * @param {string} userId - User running depreciation
 * @param {object} [filters] - Optional asset filters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of depreciation records
 *
 * @example
 * ```typescript
 * const depreciations = await batchCalculateDepreciation(
 *   sequelize,
 *   2024,
 *   1,
 *   new Date('2024-01-31'),
 *   'user123',
 *   { locationCode: 'LOC-001' }
 * );
 * ```
 */
export declare const batchCalculateDepreciation: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, depreciationDate: Date, userId: string, filters?: any, transaction?: Transaction) => Promise<any[]>;
/**
 * Disposes of a fixed asset and calculates gain/loss.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DisposeAssetDto} disposalData - Disposal data
 * @param {string} userId - User disposing the asset
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Disposal record
 *
 * @example
 * ```typescript
 * const disposal = await disposeFixedAsset(sequelize, {
 *   assetId: 1,
 *   disposalDate: new Date('2024-06-30'),
 *   disposalType: 'sale',
 *   disposalAmount: 5000,
 *   disposalReason: 'Upgraded to new model',
 *   approvedBy: 'manager123'
 * }, 'user123');
 * ```
 */
export declare const disposeFixedAsset: (sequelize: Sequelize, disposalData: DisposeAssetDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Calculates gain or loss on asset disposal.
 *
 * @param {number} acquisitionCost - Original acquisition cost
 * @param {number} accumulatedDepreciation - Accumulated depreciation
 * @param {number} disposalAmount - Disposal proceeds
 * @returns {number} Gain (positive) or loss (negative)
 *
 * @example
 * ```typescript
 * const gainLoss = calculateDisposalGainLoss(10000, 6000, 5000);
 * // Returns: 1000 (gain)
 * ```
 */
export declare const calculateDisposalGainLoss: (acquisitionCost: number, accumulatedDepreciation: number, disposalAmount: number) => number;
/**
 * Reverses an asset disposal (before period close).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing the disposal
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated asset
 *
 * @example
 * ```typescript
 * const asset = await reverseAssetDisposal(
 *   sequelize,
 *   1,
 *   'Disposal cancelled - asset returned',
 *   'user123'
 * );
 * ```
 */
export declare const reverseAssetDisposal: (sequelize: Sequelize, assetId: number, reversalReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Transfers an asset to a new location/department/cost center.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TransferAssetDto} transferData - Transfer data
 * @param {string} userId - User initiating transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transfer record
 *
 * @example
 * ```typescript
 * const transfer = await transferFixedAsset(sequelize, {
 *   assetId: 1,
 *   transferDate: new Date(),
 *   toLocationCode: 'LOC-002',
 *   toDepartmentCode: 'DEPT-SALES',
 *   toCostCenter: 'CC-200',
 *   transferReason: 'Departmental reorganization',
 *   transferredBy: 'user123'
 * }, 'user123');
 * ```
 */
export declare const transferFixedAsset: (sequelize: Sequelize, transferData: TransferAssetDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Bulk transfers multiple assets to a new location.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number[]} assetIds - Array of asset IDs
 * @param {string} toLocationCode - Target location code
 * @param {string} toDepartmentCode - Target department code
 * @param {string} toCostCenter - Target cost center
 * @param {string} transferReason - Reason for transfer
 * @param {string} userId - User initiating transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of transfer records
 *
 * @example
 * ```typescript
 * const transfers = await bulkTransferAssets(
 *   sequelize,
 *   [1, 2, 3],
 *   'LOC-003',
 *   'DEPT-IT',
 *   'CC-300',
 *   'Office relocation',
 *   'user123'
 * );
 * ```
 */
export declare const bulkTransferAssets: (sequelize: Sequelize, assetIds: number[], toLocationCode: string, toDepartmentCode: string, toCostCenter: string, transferReason: string, userId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * Revalues a fixed asset (IFRS compliance).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RevalueAssetDto} revaluationData - Revaluation data
 * @param {string} userId - User performing revaluation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Revaluation record
 *
 * @example
 * ```typescript
 * const revaluation = await revalueFixedAsset(sequelize, {
 *   assetId: 1,
 *   revaluationDate: new Date(),
 *   revaluedAmount: 12000,
 *   revaluationReason: 'Fair value adjustment per IFRS 13',
 *   accountingStandard: 'IFRS',
 *   approvedBy: 'cfo123'
 * }, 'user123');
 * ```
 */
export declare const revalueFixedAsset: (sequelize: Sequelize, revaluationData: RevalueAssetDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Tests an asset for impairment and records impairment loss if necessary.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {Date} testingDate - Impairment testing date
 * @param {number} recoverableAmount - Recoverable amount (higher of fair value or value in use)
 * @param {string[]} impairmentIndicators - Indicators that triggered the test
 * @param {string} userId - User performing impairment test
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Impairment record (or null if no impairment)
 *
 * @example
 * ```typescript
 * const impairment = await testAssetImpairment(
 *   sequelize,
 *   1,
 *   new Date(),
 *   8000,
 *   ['Technological obsolescence', 'Market decline'],
 *   'user123'
 * );
 * ```
 */
export declare const testAssetImpairment: (sequelize: Sequelize, assetId: number, testingDate: Date, recoverableAmount: number, impairmentIndicators: string[], userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates a depreciation schedule for an asset.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} assetId - Asset ID
 * @param {number} [numberOfPeriods=12] - Number of periods to project
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<AssetDepreciationSchedule[]>} Depreciation schedule
 *
 * @example
 * ```typescript
 * const schedule = await generateDepreciationSchedule(sequelize, 1, 60);
 * // Returns 60-month depreciation projection
 * ```
 */
export declare const generateDepreciationSchedule: (sequelize: Sequelize, assetId: number, numberOfPeriods?: number, transaction?: Transaction) => Promise<AssetDepreciationSchedule[]>;
/**
 * Generates an asset register report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} [filters] - Report filters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Asset register data
 *
 * @example
 * ```typescript
 * const register = await generateAssetRegister(sequelize, {
 *   assetType: 'equipment',
 *   status: 'active',
 *   locationCode: 'LOC-001'
 * });
 * ```
 */
export declare const generateAssetRegister: (sequelize: Sequelize, filters?: any, transaction?: Transaction) => Promise<any>;
/**
 * Calculates total depreciation expense for a fiscal period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Total depreciation expense
 *
 * @example
 * ```typescript
 * const totalDepreciation = await calculatePeriodDepreciationExpense(
 *   sequelize,
 *   2024,
 *   1
 * );
 * ```
 */
export declare const calculatePeriodDepreciationExpense: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<number>;
/**
 * Lists all assets due for disposal based on age or condition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [ageThresholdYears=10] - Age threshold in years
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Assets recommended for disposal
 *
 * @example
 * ```typescript
 * const assetsForDisposal = await listAssetsForDisposal(sequelize, 8);
 * ```
 */
export declare const listAssetsForDisposal: (sequelize: Sequelize, ageThresholdYears?: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Exports asset data for tax reporting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} taxYear - Tax year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Tax-ready asset data
 *
 * @example
 * ```typescript
 * const taxData = await exportAssetTaxData(sequelize, 2024);
 * ```
 */
export declare const exportAssetTaxData: (sequelize: Sequelize, taxYear: number, transaction?: Transaction) => Promise<any[]>;
export {};
//# sourceMappingURL=fixed-assets-depreciation-kit.d.ts.map