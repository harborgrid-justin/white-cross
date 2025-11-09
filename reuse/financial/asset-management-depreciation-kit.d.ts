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
import { Sequelize, Transaction } from 'sequelize';
import Decimal from 'decimal.js';
interface AssetMetadata {
    assetTag?: string;
    serialNumber?: string;
    manufacturer?: string;
    model?: string;
    purchaseOrderNumber?: string;
    warrantyExpiration?: Date;
    insurancePolicyNumber?: string;
    customFields?: Record<string, any>;
}
interface AssetLocation {
    facilityId: string;
    facilityName: string;
    buildingId?: string;
    buildingName?: string;
    roomNumber?: string;
    responsiblePerson?: string;
    departmentCode?: string;
    costCenter?: string;
}
interface DepreciationParameters {
    method: DepreciationMethod;
    usefulLifeYears: number;
    salvageValue: Decimal;
    depreciableBase: Decimal;
    acquisitionDate: Date;
    inServiceDate: Date;
    fiscalYearEnd: number;
    convention?: 'full-year' | 'half-year' | 'mid-quarter' | 'mid-month';
    macrsClass?: '3-year' | '5-year' | '7-year' | '10-year' | '15-year' | '20-year' | '27.5-year' | '39-year';
    decliningBalanceRate?: number;
}
type DepreciationMethod = 'straight-line' | 'declining-balance' | 'double-declining-balance' | 'sum-of-years-digits' | 'units-of-production' | 'macrs' | 'macrs-alt' | '150-declining-balance';
type AssetStatus = 'in-service' | 'pending-disposal' | 'disposed' | 'under-construction' | 'retired' | 'impaired' | 'transferred' | 'lost-stolen' | 'donated';
type AssetCategory = 'land' | 'buildings' | 'leasehold-improvements' | 'machinery-equipment' | 'vehicles' | 'furniture-fixtures' | 'computers-it' | 'software' | 'infrastructure' | 'construction-in-progress';
interface DepreciationScheduleEntry {
    fiscalYear: number;
    periodNumber: number;
    periodStartDate: Date;
    periodEndDate: Date;
    openingBookValue: Decimal;
    depreciationExpense: Decimal;
    accumulatedDepreciation: Decimal;
    closingBookValue: Decimal;
    depreciationRate?: number;
}
interface AssetDisposal {
    disposalDate: Date;
    disposalMethod: 'sale' | 'trade-in' | 'scrap' | 'donation' | 'abandonment' | 'casualty-loss';
    saleProceeds?: Decimal;
    bookValue: Decimal;
    accumulatedDepreciation: Decimal;
    gainLoss: Decimal;
    disposedBy: string;
    approvedBy?: string;
    reason: string;
    notes?: string;
}
interface AssetTransfer {
    transferDate: Date;
    fromLocation: AssetLocation;
    toLocation: AssetLocation;
    transferredBy: string;
    approvedBy: string;
    reason: string;
    effectiveDate: Date;
}
interface AssetImpairment {
    impairmentDate: Date;
    carryingAmount: Decimal;
    recoverableAmount: Decimal;
    impairmentLoss: Decimal;
    reasonForImpairment: string;
    approvedBy: string;
    reversalAllowed: boolean;
}
interface AssetRevaluation {
    revaluationDate: Date;
    previousCarryingAmount: Decimal;
    fairValue: Decimal;
    revaluationSurplus: Decimal;
    valuationMethod: string;
    valuerId: string;
    approvedBy: string;
}
interface ComponentAsset {
    componentId: string;
    componentName: string;
    componentCost: Decimal;
    componentLife: number;
    separateDepreciation: boolean;
    replacementDate?: Date;
}
interface CapitalizationPolicy {
    minimumValue: Decimal;
    assetCategory: AssetCategory;
    requiresApproval: boolean;
    approvalThreshold?: Decimal;
    poolingAllowed: boolean;
}
interface AssetValuation {
    valuationDate: Date;
    costBasis: Decimal;
    accumulatedDepreciation: Decimal;
    netBookValue: Decimal;
    fairMarketValue?: Decimal;
    replacementCost?: Decimal;
    residualValue?: Decimal;
}
interface UnitsOfProductionData {
    totalEstimatedUnits: number;
    unitsProducedToDate: number;
    currentPeriodUnits: number;
    unitType: string;
}
type CalculationResult<T> = {
    success: boolean;
    result?: T;
    error?: string;
    warnings?: string[];
    metadata?: Record<string, any>;
};
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
export declare const createFixedAssetModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        assetNumber: string;
        description: string;
        category: AssetCategory;
        subCategory: string | null;
        acquisitionCost: number;
        acquisitionDate: Date;
        inServiceDate: Date;
        usefulLifeYears: number;
        salvageValue: number;
        depreciationMethod: DepreciationMethod;
        currentBookValue: number;
        accumulatedDepreciation: number;
        status: AssetStatus;
        location: AssetLocation;
        metadata: AssetMetadata;
        parentAssetId: number | null;
        isComponentized: boolean;
        components: ComponentAsset[];
        responsibleDepartment: string;
        custodian: string | null;
        fundingSource: string | null;
        projectCode: string | null;
        grantNumber: string | null;
        lastPhysicalInventoryDate: Date | null;
        lastRevaluationDate: Date | null;
        impairmentIndicator: boolean;
        fullyDepreciated: boolean;
        depreciationSuspended: boolean;
        suspensionReason: string | null;
        disposalId: number | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
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
export declare const createDepreciationScheduleModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        assetId: number;
        fiscalYear: number;
        periodNumber: number;
        periodStartDate: Date;
        periodEndDate: Date;
        openingBookValue: number;
        depreciationExpense: number;
        accumulatedDepreciation: number;
        closingBookValue: number;
        depreciationRate: number | null;
        calculationMethod: DepreciationMethod;
        adjustmentAmount: number;
        adjustmentReason: string | null;
        posted: boolean;
        postedDate: Date | null;
        postedBy: string | null;
        journalEntryId: string | null;
        readonly createdAt: Date;
    };
};
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
export declare const createAssetDisposalModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        assetId: number;
        disposalDate: Date;
        disposalMethod: string;
        saleProceeds: number | null;
        bookValue: number;
        accumulatedDepreciation: number;
        gainLoss: number;
        disposedBy: string;
        approvedBy: string | null;
        approvalDate: Date | null;
        reason: string;
        notes: string | null;
        buyerInformation: Record<string, any> | null;
        disposalCosts: number;
        netProceeds: number;
        taxImplications: Record<string, any> | null;
        glPosted: boolean;
        glJournalEntry: string | null;
        documentationPath: string | null;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Asset Transfers tracking location and custodian changes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AssetTransfer model
 */
export declare const createAssetTransferModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        assetId: number;
        transferDate: Date;
        effectiveDate: Date;
        fromLocation: AssetLocation;
        toLocation: AssetLocation;
        transferredBy: string;
        approvedBy: string;
        approvalDate: Date;
        reason: string;
        notes: string | null;
        transferType: "location" | "department" | "custodian" | "cost-center";
        bookValue: number;
        condition: string | null;
        physicallyMoved: boolean;
        receivedBy: string | null;
        receiptDate: Date | null;
        readonly createdAt: Date;
    };
};
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
export declare function calculateStraightLineDepreciation(params: DepreciationParameters, periodEndDate: Date): CalculationResult<Decimal>;
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
export declare function calculateDecliningBalanceDepreciation(params: DepreciationParameters, currentBookValue: Decimal, year: number): CalculationResult<Decimal>;
/**
 * Calculates double declining balance depreciation (200% declining balance).
 *
 * @param {DepreciationParameters} params - Depreciation parameters
 * @param {Decimal} currentBookValue - Current book value
 * @param {number} year - Current year of depreciation
 * @returns {CalculationResult<Decimal>} Depreciation amount
 */
export declare function calculateDoubleDecliningBalance(params: DepreciationParameters, currentBookValue: Decimal, year: number): CalculationResult<Decimal>;
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
export declare function calculateSumOfYearsDigitsDepreciation(params: DepreciationParameters, year: number): CalculationResult<Decimal>;
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
export declare function calculateUnitsOfProductionDepreciation(params: DepreciationParameters, productionData: UnitsOfProductionData): CalculationResult<Decimal>;
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
export declare function getMACRSRate(macrsClass: string, year: number): number;
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
export declare function calculateMACRSDepreciation(params: DepreciationParameters, year: number): CalculationResult<Decimal>;
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
export declare function generateDepreciationSchedule(params: DepreciationParameters, accumulatedDepreciation?: Decimal): CalculationResult<DepreciationScheduleEntry[]>;
/**
 * Calculates mid-year convention depreciation adjustment.
 *
 * @param {Decimal} annualDepreciation - Full year depreciation amount
 * @param {Date} inServiceDate - Date asset placed in service
 * @param {Date} fiscalYearEnd - Fiscal year end date
 * @returns {Decimal} Adjusted depreciation amount
 */
export declare function applyHalfYearConvention(annualDepreciation: Decimal, inServiceDate: Date, fiscalYearEnd: Date): Decimal;
/**
 * Calculates pro-rated depreciation for partial periods.
 *
 * @param {Decimal} annualDepreciation - Full year depreciation
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @returns {Decimal} Pro-rated depreciation amount
 */
export declare function calculateProRatedDepreciation(annualDepreciation: Decimal, startDate: Date, endDate: Date): Decimal;
/**
 * Switches depreciation method mid-lifecycle (e.g., DDB to straight-line).
 *
 * @param {DepreciationParameters} currentParams - Current depreciation parameters
 * @param {DepreciationMethod} newMethod - New depreciation method
 * @param {Decimal} currentBookValue - Current book value
 * @param {number} remainingLife - Remaining useful life in years
 * @returns {CalculationResult<DepreciationParameters>} Updated parameters
 */
export declare function switchDepreciationMethod(currentParams: DepreciationParameters, newMethod: DepreciationMethod, currentBookValue: Decimal, remainingLife: number): CalculationResult<DepreciationParameters>;
/**
 * Calculates optimal depreciation method switch point (e.g., DDB to SL).
 *
 * @param {DepreciationParameters} params - Depreciation parameters
 * @param {Decimal} currentBookValue - Current book value
 * @param {number} year - Current year
 * @returns {CalculationResult<{shouldSwitch: boolean; newMethod?: DepreciationMethod}>}
 */
export declare function determineOptimalMethodSwitch(params: DepreciationParameters, currentBookValue: Decimal, year: number): CalculationResult<{
    shouldSwitch: boolean;
    newMethod?: DepreciationMethod;
    reason?: string;
}>;
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
export declare function capitalizeAsset(assetData: any, policy: CapitalizationPolicy, transaction: Transaction): Promise<CalculationResult<any>>;
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
export declare function processAssetDisposal(assetId: number, disposalData: AssetDisposal, transaction: Transaction): Promise<CalculationResult<AssetDisposal>>;
/**
 * Transfers asset to new location/department with audit trail.
 *
 * @param {number} assetId - Asset ID
 * @param {AssetTransfer} transferData - Transfer details
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<CalculationResult<AssetTransfer>>} Transfer result
 */
export declare function transferAsset(assetId: number, transferData: AssetTransfer, transaction: Transaction): Promise<CalculationResult<AssetTransfer>>;
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
export declare function testAssetImpairment(assetId: number, carryingAmount: Decimal, recoverableAmount: Decimal): CalculationResult<AssetImpairment | null>;
/**
 * Revalues asset to fair value and calculates revaluation surplus/deficit.
 *
 * @param {number} assetId - Asset ID
 * @param {AssetRevaluation} revaluationData - Revaluation details
 * @returns {CalculationResult<AssetRevaluation>} Revaluation result
 */
export declare function revalueAsset(assetId: number, revaluationData: AssetRevaluation): CalculationResult<AssetRevaluation>;
/**
 * Splits asset into componentized parts for separate depreciation.
 *
 * @param {number} assetId - Parent asset ID
 * @param {ComponentAsset[]} components - Component breakdown
 * @returns {CalculationResult<ComponentAsset[]>} Componentization result
 */
export declare function componentizeAsset(assetId: number, components: ComponentAsset[]): CalculationResult<ComponentAsset[]>;
/**
 * Calculates current asset valuation including book value and fair market value.
 *
 * @param {number} assetId - Asset ID
 * @param {Decimal} originalCost - Original cost
 * @param {Decimal} accumulatedDepreciation - Accumulated depreciation
 * @param {Decimal} fairMarketValue - Fair market value (optional)
 * @returns {AssetValuation} Complete valuation
 */
export declare function calculateAssetValuation(assetId: number, originalCost: Decimal, accumulatedDepreciation: Decimal, fairMarketValue?: Decimal): AssetValuation;
/**
 * Validates asset data against business rules and constraints.
 *
 * @param {any} assetData - Asset data to validate
 * @returns {CalculationResult<boolean>} Validation result with errors
 */
export declare function validateAssetData(assetData: any): CalculationResult<boolean>;
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
export declare function generateAssetTag(category: AssetCategory, sequenceNumber: number, prefix?: string): string;
/**
 * Calculates remaining useful life based on current date and original parameters.
 *
 * @param {Date} inServiceDate - In-service date
 * @param {number} originalUsefulLife - Original useful life in years
 * @returns {number} Remaining useful life in years
 */
export declare function calculateRemainingUsefulLife(inServiceDate: Date, originalUsefulLife: number): number;
/**
 * Groups assets by specified criteria for mass operations.
 *
 * @param {any[]} assets - Array of assets
 * @param {keyof any} groupBy - Field to group by
 * @returns {Record<string, any[]>} Grouped assets
 */
export declare function groupAssets(assets: any[], groupBy: string): Record<string, any[]>;
/**
 * Performs physical inventory reconciliation.
 *
 * @param {any[]} systemAssets - Assets from system
 * @param {any[]} physicalAssets - Assets from physical count
 * @returns {CalculationResult<{matches: any[]; missing: any[]; unrecorded: any[]}>}
 */
export declare function reconcilePhysicalInventory(systemAssets: any[], physicalAssets: any[]): CalculationResult<{
    matches: any[];
    missing: any[];
    unrecorded: any[];
}>;
/**
 * Calculates insurance value for asset portfolio.
 *
 * @param {any[]} assets - Array of assets
 * @param {number} inflationFactor - Inflation adjustment factor
 * @returns {CalculationResult<Decimal>} Total insurance value
 */
export declare function calculateInsuranceValue(assets: any[], inflationFactor?: number): CalculationResult<Decimal>;
/**
 * Estimates salvage value based on asset category and condition.
 *
 * @param {AssetCategory} category - Asset category
 * @param {Decimal} originalCost - Original cost
 * @param {number} age - Asset age in years
 * @param {string} condition - Asset condition
 * @returns {Decimal} Estimated salvage value
 */
export declare function estimateSalvageValue(category: AssetCategory, originalCost: Decimal, age: number, condition?: 'excellent' | 'good' | 'fair' | 'poor'): Decimal;
/**
 * Generates asset replacement forecast based on remaining life.
 *
 * @param {any[]} assets - Array of assets
 * @param {number} forecastYears - Years to forecast
 * @returns {Record<number, any[]>} Assets requiring replacement by year
 */
export declare function generateReplacementForecast(assets: any[], forecastYears?: number): Record<number, any[]>;
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
export declare function calculateTotalCostOfOwnership(acquisitionCost: Decimal, annualMaintenanceCost: Decimal, usefulLife: number, disposalValue: Decimal, discountRate?: number): CalculationResult<Decimal>;
/**
 * Generates asset register report with all active assets.
 *
 * @param {any[]} assets - Array of assets
 * @param {Object} filters - Filter criteria
 * @returns {CalculationResult<any[]>} Filtered asset register
 */
export declare function generateAssetRegister(assets: any[], filters?: {
    category?: AssetCategory;
    status?: AssetStatus;
    department?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
}): CalculationResult<any[]>;
/**
 * Calculates depreciation expense summary for period.
 *
 * @param {any[]} schedules - Depreciation schedules
 * @param {number} fiscalYear - Fiscal year
 * @param {number} periodNumber - Period number
 * @returns {CalculationResult<{totalExpense: Decimal; byCategory: Record<string, Decimal>}>}
 */
export declare function calculateDepreciationExpenseSummary(schedules: any[], fiscalYear: number, periodNumber?: number): CalculationResult<{
    totalExpense: Decimal;
    byCategory: Record<string, Decimal>;
}>;
/**
 * Generates asset acquisition report for period.
 *
 * @param {any[]} assets - Assets
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {CalculationResult<{assets: any[]; totalCost: Decimal}>}
 */
export declare function generateAcquisitionReport(assets: any[], startDate: Date, endDate: Date): CalculationResult<{
    assets: any[];
    totalCost: Decimal;
    byCategory: Record<string, Decimal>;
}>;
/**
 * Generates disposal report with gains/losses.
 *
 * @param {any[]} disposals - Disposal records
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {CalculationResult<any>} Disposal report with totals
 */
export declare function generateDisposalReport(disposals: any[], startDate: Date, endDate: Date): CalculationResult<any>;
/**
 * Calculates asset portfolio summary statistics.
 *
 * @param {any[]} assets - Array of assets
 * @returns {CalculationResult<any>} Portfolio statistics
 */
export declare function calculatePortfolioSummary(assets: any[]): CalculationResult<any>;
/**
 * Generates fully depreciated assets report.
 *
 * @param {any[]} assets - Array of assets
 * @returns {CalculationResult<any[]>} Fully depreciated assets
 */
export declare function generateFullyDepreciatedReport(assets: any[]): CalculationResult<any[]>;
/**
 * Generates assets requiring physical inventory verification.
 *
 * @param {any[]} assets - Array of assets
 * @param {number} monthsThreshold - Months since last verification
 * @returns {CalculationResult<any[]>} Assets needing verification
 */
export declare function generateInventoryVerificationList(assets: any[], monthsThreshold?: number): CalculationResult<any[]>;
/**
 * Calculates depreciation variance analysis (actual vs. budgeted).
 *
 * @param {Decimal} actualDepreciation - Actual depreciation
 * @param {Decimal} budgetedDepreciation - Budgeted depreciation
 * @returns {CalculationResult<any>} Variance analysis
 */
export declare function calculateDepreciationVariance(actualDepreciation: Decimal, budgetedDepreciation: Decimal): CalculationResult<any>;
/**
 * Exports asset data to specified format (CSV, JSON, Excel).
 *
 * @param {any[]} assets - Assets to export
 * @param {string} format - Export format
 * @returns {CalculationResult<any>} Exported data
 */
export declare function exportAssetData(assets: any[], format: 'csv' | 'json' | 'excel'): CalculationResult<any>;
/**
 * Generates asset age analysis report.
 *
 * @param {any[]} assets - Array of assets
 * @returns {CalculationResult<Record<string, any[]>>} Assets grouped by age ranges
 */
export declare function generateAssetAgeAnalysis(assets: any[]): CalculationResult<Record<string, any[]>>;
/**
 * Calculates asset utilization metrics.
 *
 * @param {any} asset - Asset data
 * @param {UnitsOfProductionData} usageData - Usage data
 * @returns {CalculationResult<any>} Utilization metrics
 */
export declare function calculateAssetUtilization(asset: any, usageData?: UnitsOfProductionData): CalculationResult<any>;
/**
 * Generates asset maintenance cost analysis.
 *
 * @param {any} asset - Asset data
 * @param {any[]} maintenanceRecords - Maintenance history
 * @returns {CalculationResult<any>} Maintenance cost analysis
 */
export declare function analyzeMaintenanceCosts(asset: any, maintenanceRecords: any[]): CalculationResult<any>;
/**
 * Generates asset compliance report for regulatory requirements.
 *
 * @param {any[]} assets - Array of assets
 * @param {string[]} complianceRequirements - Required compliance items
 * @returns {CalculationResult<any>} Compliance report
 */
export declare function generateComplianceReport(assets: any[], complianceRequirements: string[]): CalculationResult<any>;
/**
 * Calculates asset ROI (Return on Investment).
 *
 * @param {Decimal} acquisitionCost - Initial investment
 * @param {Decimal} totalRevenue - Revenue generated by asset
 * @param {Decimal} totalOperatingCosts - Operating costs
 * @param {number} years - Years in service
 * @returns {CalculationResult<any>} ROI analysis
 */
export declare function calculateAssetROI(acquisitionCost: Decimal, totalRevenue: Decimal, totalOperatingCosts: Decimal, years: number): CalculationResult<any>;
/**
 * Generates asset lifecycle cost comparison for replacement decisions.
 *
 * @param {any} currentAsset - Current asset
 * @param {any} replacementAsset - Potential replacement
 * @param {number} analysisYears - Years to analyze
 * @returns {CalculationResult<any>} Lifecycle comparison
 */
export declare function compareAssetLifecycleCosts(currentAsset: any, replacementAsset: any, analysisYears?: number): CalculationResult<any>;
/**
 * Generates grant-funded assets report for compliance tracking.
 *
 * @param {any[]} assets - Array of assets
 * @param {string} grantNumber - Grant number to filter
 * @returns {CalculationResult<any>} Grant assets report
 */
export declare function generateGrantAssetsReport(assets: any[], grantNumber?: string): CalculationResult<any>;
/**
 * Performs year-end depreciation closing procedures.
 *
 * @param {any[]} schedules - Depreciation schedules for the year
 * @param {number} fiscalYear - Fiscal year to close
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<CalculationResult<any>>} Closing summary
 */
export declare function performYearEndDepreciationClosing(schedules: any[], fiscalYear: number, transaction: Transaction): Promise<CalculationResult<any>>;
export {};
//# sourceMappingURL=asset-management-depreciation-kit.d.ts.map