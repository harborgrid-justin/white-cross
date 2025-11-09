/**
 * Asset-Liability Management Kit (FIN-ALM-001)
 *
 * Enterprise-grade financial asset and liability management system with 40 production-ready functions.
 * Supports asset lifecycle management, depreciation methods, impairment testing, debt scheduling,
 * lease accounting, and comprehensive ALM reporting.
 *
 * Target Competitors: Sage Fixed Assets, AssetWorks, IBM TRIRIGA
 * Framework: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 *
 * Features:
 * - Comprehensive asset lifecycle management (create, update, depreciate, dispose)
 * - 4 depreciation methods (straight-line, declining balance, units of production, sum of years)
 * - Real-time asset tracking (location, maintenance, condition, transfers)
 * - Impairment testing and recognition (IFRS/GAAP compliant)
 * - Liability and debt management with amortization
 * - Interest calculations (simple, compound, effective rates)
 * - IFRS 16 lease accounting with ROU asset recognition
 * - Asset revaluation with gain/loss recognition
 * - Comprehensive ALM reporting and analytics
 *
 * @module AssetLiabilityManagement
 * @version 1.0.0
 */
import { Sequelize } from 'sequelize';
interface Asset {
    id: string;
    code: string;
    description: string;
    category: AssetCategory;
    acquisitionDate: Date;
    acquisitionCost: number;
    salvageValue: number;
    usefulLife: number;
    depreciationMethod: DepreciationMethod;
    currentValue: number;
    accumulatedDepreciation: number;
    location: string;
    condition: AssetCondition;
    status: AssetStatus;
    createdAt: Date;
    updatedAt: Date;
}
interface Liability {
    id: string;
    code: string;
    type: LiabilityType;
    principal: number;
    interestRate: number;
    issueDate: Date;
    maturityDate: Date;
    frequency: InterestFrequency;
    status: LiabilityStatus;
    remainingBalance: number;
    accruedInterest: number;
    createdAt: Date;
    updatedAt: Date;
}
interface DepreciationRecord {
    assetId: string;
    period: Date;
    depreciationExpense: number;
    accumulatedDepreciation: number;
    bookValue: number;
    method: DepreciationMethod;
}
interface LeaseAgreement {
    id: string;
    lessee: string;
    lessor: string;
    classification: LeaseClassification;
    leaseCommencement: Date;
    leaseTermMonths: number;
    monthlyPayment: number;
    interestRate: number;
    rightOfUseAsset: number;
    leaseLIABILITY: number;
    status: string;
}
interface ImpairmentTest {
    assetId: string;
    testDate: Date;
    carryingAmount: number;
    recoverableAmount: number;
    fairValue: number;
    valueInUse: number;
    impairmentLoss: number;
    isImpaired: boolean;
}
interface DebtSchedule {
    id: string;
    liabilityId: string;
    period: number;
    periodDate: Date;
    openingBalance: number;
    payment: number;
    interest: number;
    principal: number;
    closingBalance: number;
}
interface AssetRegister {
    totalAssets: number;
    totalDepreciation: number;
    totalBookValue: number;
    assetsByCategory: Record<string, {
        count: number;
        bookValue: number;
    }>;
    lastUpdated: Date;
}
interface ALMReport {
    assetSummary: AssetRegister;
    liabilitySummary: {
        totalLiabilities: number;
        totalAccruedInterest: number;
    };
    depreciationSchedule: DepreciationRecord[];
    debtSchedule: DebtSchedule[];
    maturityAnalysis: {
        dueSoon: Liability[];
        overdue: Liability[];
    };
}
declare enum AssetCategory {
    PROPERTY = "PROPERTY",
    PLANT = "PLANT",
    EQUIPMENT = "EQUIPMENT",
    VEHICLE = "VEHICLE",
    LEASEHOLD = "LEASEHOLD",
    INTANGIBLE = "INTANGIBLE"
}
declare enum DepreciationMethod {
    STRAIGHT_LINE = "STRAIGHT_LINE",
    DECLINING_BALANCE = "DECLINING_BALANCE",
    UNITS_OF_PRODUCTION = "UNITS_OF_PRODUCTION",
    SUM_OF_YEARS = "SUM_OF_YEARS"
}
declare enum AssetCondition {
    EXCELLENT = "EXCELLENT",
    GOOD = "GOOD",
    FAIR = "FAIR",
    POOR = "POOR"
}
declare enum AssetStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DISPOSED = "DISPOSED",
    IMPAIRED = "IMPAIRED"
}
declare enum LiabilityType {
    LOAN = "LOAN",
    BOND = "BOND",
    LEASE = "LEASE",
    NOTE = "NOTE"
}
declare enum InterestFrequency {
    ANNUAL = "ANNUAL",
    SEMI_ANNUAL = "SEMI_ANNUAL",
    QUARTERLY = "QUARTERLY",
    MONTHLY = "MONTHLY"
}
declare enum LiabilityStatus {
    ACTIVE = "ACTIVE",
    MATURED = "MATURED",
    SETTLED = "SETTLED"
}
declare enum LeaseClassification {
    OPERATING = "OPERATING",
    FINANCE = "FINANCE"
}
/**
 * 1. Create Asset
 * Records a new asset in the fixed asset register with initial values.
 */
export declare function createAsset(sequelize: Sequelize, assetData: Omit<Asset, 'id' | 'accumulatedDepreciation' | 'createdAt' | 'updatedAt'>): Promise<Asset>;
/**
 * 2. Update Asset
 * Updates asset details like location, condition, cost basis.
 */
export declare function updateAsset(sequelize: Sequelize, assetId: string, updates: Partial<Asset>): Promise<Asset>;
/**
 * 3. Depreciate Asset
 * Calculates and records depreciation expense using selected method.
 */
export declare function depreciateAsset(sequelize: Sequelize, assetId: string, asset: Asset, periodDate: Date): Promise<DepreciationRecord>;
/**
 * 4. Dispose Asset
 * Records asset disposal and calculates gain/loss on disposition.
 */
export declare function disposeAsset(sequelize: Sequelize, assetId: string, asset: Asset, disposalPrice: number, disposalDate: Date): Promise<{
    gain: number;
    loss: number;
    bookValue: number;
}>;
/**
 * 5. Calculate Straight-Line Depreciation
 * Annual depreciation = (Cost - Salvage) / Useful Life
 */
export declare function calculateStraightLineDepreciation(acquisitionCost: number, salvageValue: number, usefulLife: number): number;
/**
 * 6. Calculate Declining Balance Depreciation
 * Annual depreciation = Book Value × (2 / Useful Life)
 */
export declare function calculateDecliningBalanceDepreciation(bookValue: number, usefulLife: number, factor?: number): number;
/**
 * 7. Calculate Units of Production Depreciation
 * Depreciation per unit = (Cost - Salvage) / Total Units
 */
export declare function calculateUnitsOfProductionDepreciation(acquisitionCost: number, salvageValue: number, totalUnits: number, unitsProducedThisPeriod: number): number;
/**
 * 8. Calculate Sum-of-Years-Digits Depreciation
 * Annual depreciation = (Cost - Salvage) × (Years Remaining / Sum of Years)
 */
export declare function calculateSumOfYearsDigitsDepreciation(acquisitionCost: number, salvageValue: number, usefulLife: number, yearNumber: number): number;
/**
 * 9. Track Asset Location
 * Records asset physical location and movement history.
 */
export declare function trackAssetLocation(sequelize: Sequelize, assetId: string, location: string, trackingDate: Date): Promise<{
    assetId: string;
    location: string;
    trackedAt: Date;
}>;
/**
 * 10. Track Maintenance
 * Records maintenance activities and costs.
 */
export declare function trackMaintenance(sequelize: Sequelize, assetId: string, maintenanceDetails: {
    date: Date;
    cost: number;
    description: string;
}): Promise<{
    assetId: string;
    totalMaintenanceCost: number;
}>;
/**
 * 11. Track Asset Condition
 * Updates asset physical condition assessment.
 */
export declare function trackAssetCondition(sequelize: Sequelize, assetId: string, condition: AssetCondition, assessmentDate: Date): Promise<{
    assetId: string;
    condition: AssetCondition;
}>;
/**
 * 12. Track Asset Transfers
 * Records internal transfers between departments/locations.
 */
export declare function trackAssetTransfer(sequelize: Sequelize, assetId: string, fromLocation: string, toLocation: string, transferDate: Date): Promise<{
    assetId: string;
    from: string;
    to: string;
    transferDate: Date;
}>;
/**
 * 13. Test Asset Impairment
 * Compares carrying amount to recoverable amount (IFRS/GAAP compliant).
 */
export declare function testAssetImpairment(asset: Asset, fairValue: number, valueInUse: number, testDate: Date): ImpairmentTest;
/**
 * 14. Recognize Impairment Loss
 * Records impairment loss and updates asset value.
 */
export declare function recognizeImpairmentLoss(sequelize: Sequelize, assetId: string, impairmentLoss: number, recognitionDate: Date): Promise<{
    assetId: string;
    impairmentLoss: number;
    newValue: number;
}>;
/**
 * 15. Reverse Impairment Loss
 * Reverses previously recognized impairment loss (up to original amount).
 */
export declare function reverseImpairmentLoss(sequelize: Sequelize, assetId: string, reversalAmount: number, reversalDate: Date): Promise<{
    assetId: string;
    reversalAmount: number;
}>;
/**
 * 16. Disclose Impairment
 * Generates disclosures for financial statements.
 */
export declare function discloseImpairment(impairmentTests: ImpairmentTest[], period: string): {
    totalImpairmentLoss: number;
    impairmentsByAsset: ImpairmentTest[];
    period: string;
};
/**
 * 17. Create Liability
 * Records new debt or obligation in the liability register.
 */
export declare function createLiability(sequelize: Sequelize, liabilityData: Omit<Liability, 'id' | 'accruedInterest' | 'remainingBalance' | 'createdAt' | 'updatedAt'>): Promise<Liability>;
/**
 * 18. Accrue Interest
 * Calculates and records accrued interest on outstanding liability.
 */
export declare function accrueInterest(principal: number, interestRate: number, frequency: InterestFrequency, periodDays?: number): number;
/**
 * 19. Amortize Liability
 * Allocates payment between principal and interest.
 */
export declare function amortizeLiability(payment: number, remainingBalance: number, monthlyRate: number): {
    principal: number;
    interest: number;
};
/**
 * 20. Settle Liability
 * Records full payment and closes liability.
 */
export declare function settleLiability(sequelize: Sequelize, liabilityId: string, settlementAmount: number, settlementDate: Date): Promise<{
    liabilityId: string;
    settled: boolean;
    settlementDate: Date;
}>;
/**
 * 21. Create Debt Schedule
 * Generates amortization schedule for loan or bond.
 */
export declare function createDebtSchedule(liabilityId: string, principal: number, annualRate: number, termMonths: number): DebtSchedule[];
/**
 * 22. Calculate Debt Payment
 * Calculates payment amount for period.
 */
export declare function calculateDebtPayment(principal: number, annualRate: number, termMonths: number): number;
/**
 * 23. Track Debt Balance
 * Updates remaining balance after payment.
 */
export declare function trackDebtBalance(currentBalance: number, principalPayment: number, interestPayment: number): number;
/**
 * 24. Early Payoff Analysis
 * Calculates savings from early repayment.
 */
export declare function analyzeEarlyPayoff(remainingBalance: number, remainingMonths: number, monthlyRate: number): {
    totalInterestSaved: number;
    payoffAmount: number;
};
/**
 * 25. Calculate Simple Interest
 * Interest = Principal × Rate × Time (in years)
 */
export declare function calculateSimpleInterest(principal: number, annualRate: number, years: number): number;
/**
 * 26. Calculate Compound Interest
 * Future Value = Principal × (1 + Rate/n)^(n*t)
 */
export declare function calculateCompoundInterest(principal: number, annualRate: number, compoundingPeriods: number, years: number): number;
/**
 * 27. Calculate Effective Interest Rate
 * Converts nominal rate to effective annual rate.
 */
export declare function calculateEffectiveInterestRate(nominalRate: number, compoundingPeriods: number): number;
/**
 * 28. Calculate APR
 * Annual Percentage Rate from monthly payment.
 */
export declare function calculateAPR(monthlyPayment: number, principal: number, termMonths: number): number;
/**
 * 29. Classify Lease
 * Determines if lease is operating or finance under IFRS 16.
 */
export declare function classifyLease(leasePayments: number, assetFairValue: number, leaseTermYears: number, residualValuePercent?: number): LeaseClassification;
/**
 * 30. Recognize Right-of-Use Asset
 * Calculates ROU asset for finance leases under IFRS 16.
 */
export declare function recognizeRightOfUseAsset(presentValueOfPayments: number, directCosts: number, estimatedResidualValue: number): number;
/**
 * 31. Calculate Lease Liability
 * Calculates initial lease liability (PV of future payments).
 */
export declare function calculateLeaseLiability(monthlyPayment: number, termMonths: number, discountRate: number): number;
/**
 * 32. Amortize Lease
 * Records lease expense (interest and ROU depreciation).
 */
export declare function amortizeLeaseExpense(liabilityBalance: number, monthlyInterestRate: number, rouAsset: number, leaseTermMonths: number): {
    interestExpense: number;
    depreciationExpense: number;
};
/**
 * 33. Revalue Asset
 * Updates asset to fair value under revaluation model.
 */
export declare function revalueAsset(sequelize: Sequelize, assetId: string, fairValue: number, revaluationDate: Date, asset: Asset): Promise<{
    assetId: string;
    previousValue: number;
    newValue: number;
    gain: number;
}>;
/**
 * 34. Recognize Revaluation Gain
 * Records gains on asset revaluation (OCI/equity).
 */
export declare function recognizeRevaluationGain(fairValue: number, previousCarryingAmount: number): {
    gainAmount: number;
    gainType: 'OCI' | 'P&L';
};
/**
 * 35. Recognize Revaluation Loss
 * Records losses on asset revaluation (reverse previous gains, then P&L).
 */
export declare function recognizeRevaluationLoss(fairValue: number, previousCarryingAmount: number, previousGainInOCI: number): {
    lossAmount: number;
    ociReverse: number;
    plLoss: number;
};
/**
 * 36. Update Revaluation Records
 * Maintains historical revaluation adjustments.
 */
export declare function updateRevaluationRecords(sequelize: Sequelize, assetId: string, fairValue: number, revaluationDate: Date): Promise<{
    assetId: string;
    revaluations: number;
}>;
/**
 * 37. Generate Asset Register
 * Comprehensive listing of all assets with book values.
 */
export declare function generateAssetRegister(assets: Asset[]): AssetRegister;
/**
 * 38. Generate Depreciation Schedule
 * Period-by-period depreciation expense report.
 */
export declare function generateDepreciationSchedule(deprecations: DepreciationRecord[]): DepreciationRecord[];
/**
 * 39. Generate Liability Schedule
 * Maturity and interest accrual summary.
 */
export declare function generateLiabilitySchedule(debtSchedules: DebtSchedule[]): DebtSchedule[];
/**
 * 40. Generate Maturity Analysis
 * Identifies liabilities due soon and overdue items.
 */
export declare function generateMaturityAnalysis(liabilities: Liability[], currentDate?: Date, daysWarning?: number): {
    dueSoon: Liability[];
    overdue: Liability[];
};
export { Asset, Liability, DepreciationRecord, LeaseAgreement, ImpairmentTest, DebtSchedule, AssetRegister, ALMReport, AssetCategory, DepreciationMethod, AssetCondition, AssetStatus, LiabilityType, InterestFrequency, LiabilityStatus, LeaseClassification, };
//# sourceMappingURL=asset-liability-management-kit.d.ts.map