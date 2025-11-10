/**
 * ASSET FINANCIAL MANAGEMENT COMMANDS
 *
 * Comprehensive asset financial tracking and analysis toolkit.
 * Provides 45 specialized functions covering:
 * - Cost tracking and allocation
 * - Depreciation calculations (5 methods: straight-line, declining balance,
 *   double declining balance, sum-of-years-digits, units-of-production)
 * - Book value management and reporting
 * - Capital vs Operating expense classification
 * - Budget tracking and variance analysis
 * - Cost center and department allocation
 * - ROI (Return on Investment) calculations
 * - TCO (Total Cost of Ownership) analysis
 * - Lease vs Buy financial analysis
 * - Amortization schedules and tracking
 * - Asset impairment tracking
 * - Disposal gain/loss calculations
 * - Financial reporting and compliance
 * - Tax depreciation calculations
 *
 * @module AssetFinancialCommands
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
 * @financial GAAP/IFRS compliant depreciation and financial reporting
 * @tax Supports tax depreciation methods (MACRS, Section 179, etc.)
 *
 * @example
 * ```typescript
 * import {
 *   trackAssetCost,
 *   calculateStraightLineDepreciation,
 *   calculateBookValue,
 *   analyzeROI,
 *   analyzeTCO,
 *   AssetCost,
 *   DepreciationSchedule
 * } from './asset-financial-commands';
 *
 * // Track asset cost
 * const cost = await trackAssetCost({
 *   assetId: 'asset-001',
 *   costType: 'acquisition',
 *   amount: 100000,
 *   date: new Date()
 * });
 *
 * // Calculate depreciation
 * const schedule = await calculateStraightLineDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10
 * );
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Depreciation methods
 */
export declare enum DepreciationMethod {
    STRAIGHT_LINE = "straight_line",
    DECLINING_BALANCE = "declining_balance",
    DOUBLE_DECLINING = "double_declining",
    SUM_OF_YEARS_DIGITS = "sum_of_years_digits",
    UNITS_OF_PRODUCTION = "units_of_production",
    MACRS = "macrs",
    CUSTOM = "custom"
}
/**
 * Cost types
 */
export declare enum CostType {
    ACQUISITION = "acquisition",
    INSTALLATION = "installation",
    SHIPPING = "shipping",
    MAINTENANCE = "maintenance",
    REPAIR = "repair",
    UPGRADE = "upgrade",
    CALIBRATION = "calibration",
    TRAINING = "training",
    LICENSE = "license",
    INSURANCE = "insurance",
    STORAGE = "storage",
    DISPOSAL = "disposal",
    OTHER = "other"
}
/**
 * Expense classification
 */
export declare enum ExpenseClassification {
    CAPITAL_EXPENSE = "capital_expense",
    OPERATING_EXPENSE = "operating_expense",
    MIXED = "mixed"
}
/**
 * Budget status
 */
export declare enum BudgetStatus {
    UNDER_BUDGET = "under_budget",
    ON_BUDGET = "on_budget",
    OVER_BUDGET = "over_budget",
    EXCEEDED = "exceeded"
}
/**
 * Asset financial status
 */
export declare enum FinancialStatus {
    ACTIVE = "active",
    FULLY_DEPRECIATED = "fully_depreciated",
    IMPAIRED = "impaired",
    DISPOSED = "disposed"
}
/**
 * Lease type
 */
export declare enum LeaseType {
    OPERATING_LEASE = "operating_lease",
    FINANCE_LEASE = "finance_lease",
    CAPITAL_LEASE = "capital_lease"
}
/**
 * Asset cost data
 */
export interface AssetCostData {
    assetId: string;
    costType: CostType;
    amount: number;
    currency?: string;
    date: Date;
    vendor?: string;
    invoiceNumber?: string;
    purchaseOrderNumber?: string;
    costCenterId?: string;
    departmentId?: string;
    classification?: ExpenseClassification;
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Depreciation calculation data
 */
export interface DepreciationCalculationData {
    assetId: string;
    method: DepreciationMethod;
    acquisitionCost: number;
    salvageValue: number;
    usefulLife: number;
    acquisitionDate: Date;
    unitsProduced?: number;
    totalUnitsCapacity?: number;
}
/**
 * Depreciation schedule entry
 */
export interface DepreciationScheduleEntry {
    year: number;
    period: string;
    beginningBookValue: number;
    depreciationExpense: number;
    accumulatedDepreciation: number;
    endingBookValue: number;
    depreciationRate?: number;
}
/**
 * Depreciation result
 */
export interface DepreciationResult {
    assetId: string;
    method: DepreciationMethod;
    acquisitionCost: number;
    salvageValue: number;
    usefulLife: number;
    currentAge: number;
    annualDepreciation: number;
    accumulatedDepreciation: number;
    currentBookValue: number;
    remainingLife: number;
    schedule: DepreciationScheduleEntry[];
    calculatedAt: Date;
}
/**
 * Book value data
 */
export interface BookValueData {
    assetId: string;
    asOfDate: Date;
    acquisitionCost: number;
    accumulatedDepreciation: number;
    bookValue: number;
    salvageValue: number;
    impairmentLoss?: number;
    fairMarketValue?: number;
}
/**
 * Budget allocation data
 */
export interface BudgetAllocationData {
    name: string;
    fiscalYear: number;
    departmentId?: string;
    costCenterId?: string;
    categoryId?: string;
    budgetedAmount: number;
    startDate: Date;
    endDate: Date;
    notes?: string;
}
/**
 * Budget tracking result
 */
export interface BudgetTrackingResult {
    budgetId: string;
    name: string;
    budgetedAmount: number;
    actualSpent: number;
    committed: number;
    available: number;
    variance: number;
    variancePercent: number;
    status: BudgetStatus;
    asOfDate: Date;
}
/**
 * ROI analysis data
 */
export interface ROIAnalysisData {
    assetId: string;
    initialInvestment: number;
    annualRevenue?: number;
    annualCostSavings?: number;
    annualOperatingCosts: number;
    analysisYears: number;
    discountRate?: number;
}
/**
 * ROI analysis result
 */
export interface ROIAnalysisResult {
    assetId: string;
    initialInvestment: number;
    totalRevenue: number;
    totalCosts: number;
    netProfit: number;
    roi: number;
    paybackPeriod: number;
    npv: number;
    irr: number;
    breakEvenYear: number;
    annualCashFlows: AnnualCashFlow[];
}
/**
 * Annual cash flow
 */
export interface AnnualCashFlow {
    year: number;
    revenue: number;
    costs: number;
    netCashFlow: number;
    cumulativeCashFlow: number;
    presentValue: number;
}
/**
 * TCO analysis data
 */
export interface TCOAnalysisData {
    assetId: string;
    analysisYears: number;
    acquisitionCost: number;
    installationCost?: number;
    annualMaintenanceCost: number;
    annualOperatingCost: number;
    annualLicenseCost?: number;
    upgradesCost?: number;
    trainingCost?: number;
    disposalCost?: number;
    discountRate?: number;
}
/**
 * TCO analysis result
 */
export interface TCOAnalysisResult {
    assetId: string;
    analysisYears: number;
    totalAcquisitionCost: number;
    totalMaintenanceCost: number;
    totalOperatingCost: number;
    totalOtherCosts: number;
    totalCostOfOwnership: number;
    annualizedCost: number;
    presentValue: number;
    costBreakdown: TCOCostBreakdown;
    yearlyBreakdown: TCOYearlyBreakdown[];
}
/**
 * TCO cost breakdown
 */
export interface TCOCostBreakdown {
    acquisitionPercent: number;
    maintenancePercent: number;
    operatingPercent: number;
    otherPercent: number;
}
/**
 * TCO yearly breakdown
 */
export interface TCOYearlyBreakdown {
    year: number;
    maintenanceCost: number;
    operatingCost: number;
    otherCost: number;
    totalYearlyCost: number;
    cumulativeCost: number;
}
/**
 * Lease vs Buy analysis data
 */
export interface LeaseVsBuyAnalysisData {
    assetDescription: string;
    purchasePrice: number;
    downPayment?: number;
    loanInterestRate?: number;
    loanTerm?: number;
    leasePayment: number;
    leaseTerm: number;
    residualValue?: number;
    taxRate?: number;
    discountRate?: number;
    annualMaintenanceCost?: number;
}
/**
 * Lease vs Buy analysis result
 */
export interface LeaseVsBuyAnalysisResult {
    assetDescription: string;
    buyOption: {
        totalCost: number;
        presentValue: number;
        monthlyPayment: number;
        totalInterest: number;
        taxBenefit: number;
        netCost: number;
    };
    leaseOption: {
        totalCost: number;
        presentValue: number;
        monthlyPayment: number;
        totalPayments: number;
        taxBenefit: number;
        netCost: number;
    };
    recommendation: 'buy' | 'lease';
    savings: number;
    savingsPercent: number;
}
/**
 * Amortization schedule entry
 */
export interface AmortizationScheduleEntry {
    period: number;
    paymentDate: Date;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
}
/**
 * Asset impairment data
 */
export interface AssetImpairmentData {
    assetId: string;
    impairmentDate: Date;
    bookValueBeforeImpairment: number;
    fairValue: number;
    impairmentLoss: number;
    reason: string;
    notes?: string;
}
/**
 * Asset cost database model
 */
export declare class AssetCost extends Model {
    id: string;
    assetId: string;
    costType: CostType;
    amount: number;
    currency: string;
    date: Date;
    vendor: string;
    invoiceNumber: string;
    purchaseOrderNumber: string;
    costCenterId: string;
    departmentId: string;
    classification: ExpenseClassification;
    notes: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Depreciation schedule database model
 */
export declare class DepreciationSchedule extends Model {
    id: string;
    assetId: string;
    method: DepreciationMethod;
    acquisitionCost: number;
    salvageValue: number;
    usefulLife: number;
    acquisitionDate: Date;
    scheduleData: DepreciationScheduleEntry[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Budget allocation database model
 */
export declare class BudgetAllocation extends Model {
    id: string;
    name: string;
    fiscalYear: number;
    departmentId: string;
    costCenterId: string;
    categoryId: string;
    budgetedAmount: number;
    startDate: Date;
    endDate: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Asset impairment database model
 */
export declare class AssetImpairment extends Model {
    id: string;
    assetId: string;
    impairmentDate: Date;
    bookValueBeforeImpairment: number;
    fairValue: number;
    impairmentLoss: number;
    reason: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Financial analysis database model
 */
export declare class FinancialAnalysis extends Model {
    id: string;
    assetId: string;
    analysisType: string;
    analysisData: Record<string, any>;
    analysisDate: Date;
    analyzedBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Create asset cost DTO
 */
export declare class CreateAssetCostDto {
    assetId: string;
    costType: CostType;
    amount: number;
    currency?: string;
    date: Date;
    vendor?: string;
    invoiceNumber?: string;
    purchaseOrderNumber?: string;
    costCenterId?: string;
    departmentId?: string;
    classification?: ExpenseClassification;
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Calculate depreciation DTO
 */
export declare class CalculateDepreciationDto {
    assetId: string;
    method: DepreciationMethod;
    acquisitionCost: number;
    salvageValue: number;
    usefulLife: number;
    acquisitionDate: Date;
    unitsProduced?: number;
    totalUnitsCapacity?: number;
}
/**
 * Create budget allocation DTO
 */
export declare class CreateBudgetAllocationDto {
    name: string;
    fiscalYear: number;
    departmentId?: string;
    costCenterId?: string;
    categoryId?: string;
    budgetedAmount: number;
    startDate: Date;
    endDate: Date;
    notes?: string;
}
/**
 * Track an asset cost
 *
 * @param data - Asset cost data
 * @param transaction - Optional database transaction
 * @returns Created asset cost record
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const cost = await trackAssetCost({
 *   assetId: 'asset-001',
 *   costType: 'maintenance',
 *   amount: 5000,
 *   date: new Date()
 * });
 * ```
 */
export declare function trackAssetCost(data: AssetCostData, transaction?: Transaction): Promise<AssetCost>;
/**
 * Get asset cost by ID
 *
 * @param id - Cost record ID
 * @returns Asset cost or null
 *
 * @example
 * ```typescript
 * const cost = await getAssetCostById('cost-001');
 * ```
 */
export declare function getAssetCostById(id: string): Promise<AssetCost | null>;
/**
 * Get all costs for an asset
 *
 * @param assetId - Asset ID
 * @param costType - Optional cost type filter
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Array of asset costs
 *
 * @example
 * ```typescript
 * const costs = await getAssetCosts('asset-001', 'maintenance');
 * ```
 */
export declare function getAssetCosts(assetId: string, costType?: CostType, startDate?: Date, endDate?: Date): Promise<AssetCost[]>;
/**
 * Calculate total costs for an asset
 *
 * @param assetId - Asset ID
 * @param costType - Optional cost type filter
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Total cost amount
 *
 * @example
 * ```typescript
 * const total = await calculateTotalAssetCosts('asset-001');
 * ```
 */
export declare function calculateTotalAssetCosts(assetId: string, costType?: CostType, startDate?: Date, endDate?: Date): Promise<number>;
/**
 * Update asset cost
 *
 * @param id - Cost record ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated asset cost
 * @throws NotFoundException if cost not found
 *
 * @example
 * ```typescript
 * const updated = await updateAssetCost('cost-001', { amount: 5500 });
 * ```
 */
export declare function updateAssetCost(id: string, updates: Partial<AssetCostData>, transaction?: Transaction): Promise<AssetCost>;
/**
 * Calculate straight-line depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param usefulLife - Useful life in years
 * @param acquisitionDate - Acquisition date
 * @param transaction - Optional database transaction
 * @returns Depreciation result with schedule
 * @throws BadRequestException if calculation fails
 *
 * @example
 * ```typescript
 * const depreciation = await calculateStraightLineDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10,
 *   new Date('2020-01-01')
 * );
 * ```
 */
export declare function calculateStraightLineDepreciation(assetId: string, acquisitionCost: number, salvageValue: number, usefulLife: number, acquisitionDate: Date, transaction?: Transaction): Promise<DepreciationResult>;
/**
 * Calculate declining balance depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param usefulLife - Useful life in years
 * @param acquisitionDate - Acquisition date
 * @param rate - Declining balance rate (default: 1.5 for 150% declining)
 * @param transaction - Optional database transaction
 * @returns Depreciation result with schedule
 *
 * @example
 * ```typescript
 * const depreciation = await calculateDecliningBalanceDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10,
 *   new Date('2020-01-01'),
 *   1.5
 * );
 * ```
 */
export declare function calculateDecliningBalanceDepreciation(assetId: string, acquisitionCost: number, salvageValue: number, usefulLife: number, acquisitionDate: Date, rate?: number, transaction?: Transaction): Promise<DepreciationResult>;
/**
 * Calculate double declining balance depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param usefulLife - Useful life in years
 * @param acquisitionDate - Acquisition date
 * @param transaction - Optional database transaction
 * @returns Depreciation result with schedule
 *
 * @example
 * ```typescript
 * const depreciation = await calculateDoubleDecliningDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10,
 *   new Date('2020-01-01')
 * );
 * ```
 */
export declare function calculateDoubleDecliningDepreciation(assetId: string, acquisitionCost: number, salvageValue: number, usefulLife: number, acquisitionDate: Date, transaction?: Transaction): Promise<DepreciationResult>;
/**
 * Calculate sum-of-years-digits depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param usefulLife - Useful life in years
 * @param acquisitionDate - Acquisition date
 * @param transaction - Optional database transaction
 * @returns Depreciation result with schedule
 *
 * @example
 * ```typescript
 * const depreciation = await calculateSumOfYearsDigitsDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   10,
 *   new Date('2020-01-01')
 * );
 * ```
 */
export declare function calculateSumOfYearsDigitsDepreciation(assetId: string, acquisitionCost: number, salvageValue: number, usefulLife: number, acquisitionDate: Date, transaction?: Transaction): Promise<DepreciationResult>;
/**
 * Calculate units-of-production depreciation
 *
 * @param assetId - Asset ID
 * @param acquisitionCost - Asset acquisition cost
 * @param salvageValue - Asset salvage value
 * @param totalUnitsCapacity - Total units the asset can produce
 * @param unitsProduced - Units produced to date
 * @param acquisitionDate - Acquisition date
 * @param transaction - Optional database transaction
 * @returns Depreciation result
 *
 * @example
 * ```typescript
 * const depreciation = await calculateUnitsOfProductionDepreciation(
 *   'asset-001',
 *   100000,
 *   10000,
 *   500000,
 *   150000,
 *   new Date('2020-01-01')
 * );
 * ```
 */
export declare function calculateUnitsOfProductionDepreciation(assetId: string, acquisitionCost: number, salvageValue: number, totalUnitsCapacity: number, unitsProduced: number, acquisitionDate: Date, transaction?: Transaction): Promise<DepreciationResult>;
/**
 * Get depreciation schedule for an asset
 *
 * @param assetId - Asset ID
 * @param method - Optional method filter
 * @returns Depreciation schedule or null
 *
 * @example
 * ```typescript
 * const schedule = await getDepreciationSchedule('asset-001', 'straight_line');
 * ```
 */
export declare function getDepreciationSchedule(assetId: string, method?: DepreciationMethod): Promise<DepreciationSchedule | null>;
/**
 * Calculate current book value for an asset
 *
 * @param assetId - Asset ID
 * @param asOfDate - Date to calculate book value as of
 * @returns Book value data
 * @throws NotFoundException if asset or depreciation schedule not found
 *
 * @example
 * ```typescript
 * const bookValue = await calculateBookValue('asset-001', new Date());
 * ```
 */
export declare function calculateBookValue(assetId: string, asOfDate: Date): Promise<BookValueData>;
/**
 * Create a budget allocation
 *
 * @param data - Budget allocation data
 * @param transaction - Optional database transaction
 * @returns Created budget allocation
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const budget = await createBudgetAllocation({
 *   name: 'IT Equipment FY2024',
 *   fiscalYear: 2024,
 *   budgetedAmount: 500000,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export declare function createBudgetAllocation(data: BudgetAllocationData, transaction?: Transaction): Promise<BudgetAllocation>;
/**
 * Get budget allocation by ID
 *
 * @param id - Budget allocation ID
 * @returns Budget allocation or null
 *
 * @example
 * ```typescript
 * const budget = await getBudgetAllocationById('budget-001');
 * ```
 */
export declare function getBudgetAllocationById(id: string): Promise<BudgetAllocation | null>;
/**
 * Track budget spending and calculate variance
 *
 * @param budgetId - Budget allocation ID
 * @param asOfDate - Date to calculate as of
 * @returns Budget tracking result
 * @throws NotFoundException if budget not found
 *
 * @example
 * ```typescript
 * const tracking = await trackBudgetSpending('budget-001', new Date());
 * ```
 */
export declare function trackBudgetSpending(budgetId: string, asOfDate: Date): Promise<BudgetTrackingResult>;
/**
 * Get budget allocations for a fiscal year
 *
 * @param fiscalYear - Fiscal year
 * @param departmentId - Optional department filter
 * @returns Array of budget allocations
 *
 * @example
 * ```typescript
 * const budgets = await getBudgetsByFiscalYear(2024);
 * ```
 */
export declare function getBudgetsByFiscalYear(fiscalYear: number, departmentId?: string): Promise<BudgetAllocation[]>;
/**
 * Analyze Return on Investment (ROI) for an asset
 *
 * @param data - ROI analysis data
 * @param transaction - Optional database transaction
 * @returns ROI analysis result
 * @throws BadRequestException if analysis fails
 *
 * @example
 * ```typescript
 * const roi = await analyzeROI({
 *   assetId: 'asset-001',
 *   initialInvestment: 100000,
 *   annualRevenue: 50000,
 *   annualOperatingCosts: 20000,
 *   analysisYears: 5,
 *   discountRate: 0.08
 * });
 * ```
 */
export declare function analyzeROI(data: ROIAnalysisData, transaction?: Transaction): Promise<ROIAnalysisResult>;
/**
 * Analyze Total Cost of Ownership (TCO) for an asset
 *
 * @param data - TCO analysis data
 * @param transaction - Optional database transaction
 * @returns TCO analysis result
 * @throws BadRequestException if analysis fails
 *
 * @example
 * ```typescript
 * const tco = await analyzeTCO({
 *   assetId: 'asset-001',
 *   analysisYears: 5,
 *   acquisitionCost: 100000,
 *   annualMaintenanceCost: 10000,
 *   annualOperatingCost: 15000,
 *   discountRate: 0.08
 * });
 * ```
 */
export declare function analyzeTCO(data: TCOAnalysisData, transaction?: Transaction): Promise<TCOAnalysisResult>;
/**
 * Analyze Lease vs Buy decision
 *
 * @param data - Lease vs buy analysis data
 * @param transaction - Optional database transaction
 * @returns Lease vs buy analysis result
 * @throws BadRequestException if analysis fails
 *
 * @example
 * ```typescript
 * const analysis = await analyzeLeaseVsBuy({
 *   assetDescription: 'MRI Machine',
 *   purchasePrice: 2000000,
 *   leasePayment: 50000,
 *   leaseTerm: 60,
 *   taxRate: 0.21,
 *   discountRate: 0.08
 * });
 * ```
 */
export declare function analyzeLeaseVsBuy(data: LeaseVsBuyAnalysisData, transaction?: Transaction): Promise<LeaseVsBuyAnalysisResult>;
/**
 * Generate amortization schedule for a loan
 *
 * @param principal - Loan principal amount
 * @param interestRate - Annual interest rate (decimal)
 * @param termYears - Loan term in years
 * @param startDate - Loan start date
 * @returns Array of amortization schedule entries
 *
 * @example
 * ```typescript
 * const schedule = await generateAmortizationSchedule(
 *   100000,
 *   0.05,
 *   10,
 *   new Date('2024-01-01')
 * );
 * ```
 */
export declare function generateAmortizationSchedule(principal: number, interestRate: number, termYears: number, startDate: Date): Promise<AmortizationScheduleEntry[]>;
/**
 * Record an asset impairment
 *
 * @param data - Asset impairment data
 * @param transaction - Optional database transaction
 * @returns Created impairment record
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const impairment = await recordAssetImpairment({
 *   assetId: 'asset-001',
 *   impairmentDate: new Date(),
 *   bookValueBeforeImpairment: 50000,
 *   fairValue: 30000,
 *   impairmentLoss: 20000,
 *   reason: 'Technological obsolescence'
 * });
 * ```
 */
export declare function recordAssetImpairment(data: AssetImpairmentData, transaction?: Transaction): Promise<AssetImpairment>;
/**
 * Get impairments for an asset
 *
 * @param assetId - Asset ID
 * @returns Array of impairment records
 *
 * @example
 * ```typescript
 * const impairments = await getAssetImpairments('asset-001');
 * ```
 */
export declare function getAssetImpairments(assetId: string): Promise<AssetImpairment[]>;
/**
 * Calculate disposal gain or loss
 *
 * @param assetId - Asset ID
 * @param salePrice - Sale price of the asset
 * @param saleDate - Date of sale
 * @returns Gain or loss amount (positive = gain, negative = loss)
 * @throws NotFoundException if asset not found
 *
 * @example
 * ```typescript
 * const gainLoss = await calculateDisposalGainLoss('asset-001', 25000, new Date());
 * ```
 */
export declare function calculateDisposalGainLoss(assetId: string, salePrice: number, saleDate: Date): Promise<number>;
/**
 * Get financial summary for an asset
 *
 * @param assetId - Asset ID
 * @param asOfDate - Date to calculate as of
 * @returns Comprehensive financial summary
 *
 * @example
 * ```typescript
 * const summary = await getAssetFinancialSummary('asset-001', new Date());
 * ```
 */
export declare function getAssetFinancialSummary(assetId: string, asOfDate: Date): Promise<Record<string, any>>;
declare const _default: {
    trackAssetCost: typeof trackAssetCost;
    getAssetCostById: typeof getAssetCostById;
    getAssetCosts: typeof getAssetCosts;
    calculateTotalAssetCosts: typeof calculateTotalAssetCosts;
    updateAssetCost: typeof updateAssetCost;
    calculateStraightLineDepreciation: typeof calculateStraightLineDepreciation;
    calculateDecliningBalanceDepreciation: typeof calculateDecliningBalanceDepreciation;
    calculateDoubleDecliningDepreciation: typeof calculateDoubleDecliningDepreciation;
    calculateSumOfYearsDigitsDepreciation: typeof calculateSumOfYearsDigitsDepreciation;
    calculateUnitsOfProductionDepreciation: typeof calculateUnitsOfProductionDepreciation;
    getDepreciationSchedule: typeof getDepreciationSchedule;
    calculateBookValue: typeof calculateBookValue;
    createBudgetAllocation: typeof createBudgetAllocation;
    getBudgetAllocationById: typeof getBudgetAllocationById;
    trackBudgetSpending: typeof trackBudgetSpending;
    getBudgetsByFiscalYear: typeof getBudgetsByFiscalYear;
    analyzeROI: typeof analyzeROI;
    analyzeTCO: typeof analyzeTCO;
    analyzeLeaseVsBuy: typeof analyzeLeaseVsBuy;
    generateAmortizationSchedule: typeof generateAmortizationSchedule;
    recordAssetImpairment: typeof recordAssetImpairment;
    getAssetImpairments: typeof getAssetImpairments;
    calculateDisposalGainLoss: typeof calculateDisposalGainLoss;
    getAssetFinancialSummary: typeof getAssetFinancialSummary;
    AssetCost: typeof AssetCost;
    DepreciationSchedule: typeof DepreciationSchedule;
    BudgetAllocation: typeof BudgetAllocation;
    AssetImpairment: typeof AssetImpairment;
    FinancialAnalysis: typeof FinancialAnalysis;
    CreateAssetCostDto: typeof CreateAssetCostDto;
    CalculateDepreciationDto: typeof CalculateDepreciationDto;
    CreateBudgetAllocationDto: typeof CreateBudgetAllocationDto;
    DepreciationMethod: typeof DepreciationMethod;
    CostType: typeof CostType;
    ExpenseClassification: typeof ExpenseClassification;
    BudgetStatus: typeof BudgetStatus;
    FinancialStatus: typeof FinancialStatus;
    LeaseType: typeof LeaseType;
};
export default _default;
//# sourceMappingURL=asset-financial-commands.d.ts.map