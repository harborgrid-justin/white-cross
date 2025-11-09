/**
 * LOC: FALCCOMP001
 * File: /reuse/edwards/financial/composites/fixed-assets-lifecycle-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../fixed-assets-depreciation-kit
 *   - ../procurement-financial-integration-kit
 *   - ../audit-trail-compliance-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../dimension-management-kit
 *   - ../project-accounting-costing-kit
 *   - ../lease-accounting-management-kit
 *   - ../financial-close-automation-kit
 *
 * DOWNSTREAM (imported by):
 *   - Fixed Assets REST API controllers
 *   - Asset management GraphQL resolvers
 *   - Depreciation calculation services
 *   - Asset tracking dashboards
 *   - Tax reporting modules
 */
import { Transaction } from 'sequelize';
/**
 * Asset acquisition with procurement integration
 */
export interface AssetAcquisitionRequest {
    assetName: string;
    assetDescription: string;
    assetCategory: string;
    assetClass: string;
    assetType: 'tangible' | 'intangible' | 'land' | 'building' | 'equipment' | 'vehicle' | 'furniture' | 'software';
    purchaseOrderId?: number;
    vendorId?: number;
    vendorName: string;
    purchasePrice: number;
    acquisitionDate: Date;
    usefulLife: number;
    usefulLifeUnit: 'years' | 'months' | 'units' | 'hours';
    depreciationMethod: 'straight-line' | 'declining-balance' | 'double-declining' | 'sum-of-years' | 'units-of-production' | 'MACRS';
    residualValue: number;
    locationCode: string;
    departmentCode: string;
    costCenterCode: string;
    dimensions: Record<string, string>;
}
/**
 * Asset lifecycle status
 */
export interface AssetLifecycleStatus {
    assetId: number;
    assetNumber: string;
    currentStatus: 'active' | 'disposed' | 'fully-depreciated' | 'impaired' | 'under-construction' | 'retired';
    acquisitionDate: Date;
    inServiceDate: Date;
    disposalDate?: Date;
    daysSinceAcquisition: number;
    remainingUsefulLife: number;
    accumulatedDepreciation: number;
    currentBookValue: number;
    depreciationToDate: number;
    nextDepreciationDate?: Date;
}
/**
 * Depreciation batch result
 */
export interface DepreciationBatchResult {
    batchId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    assetsProcessed: number;
    totalDepreciationExpense: number;
    journalEntryId: number;
    errors: DepreciationError[];
}
/**
 * Depreciation error
 */
export interface DepreciationError {
    assetId: number;
    assetNumber: string;
    errorType: string;
    errorMessage: string;
}
/**
 * Asset transfer request
 */
export interface AssetTransferRequest {
    assetId: number;
    fromLocationCode: string;
    toLocationCode: string;
    fromDepartmentCode: string;
    toDepartmentCode: string;
    fromCostCenterCode: string;
    toCostCenterCode: string;
    transferDate: Date;
    transferReason: string;
    approvedBy?: string;
    newDimensions?: Record<string, string>;
}
/**
 * Asset disposal result
 */
export interface AssetDisposalResult {
    assetId: number;
    disposalDate: Date;
    disposalMethod: 'sale' | 'scrap' | 'trade-in' | 'donation' | 'write-off';
    originalCost: number;
    accumulatedDepreciation: number;
    bookValue: number;
    disposalProceeds: number;
    gainLoss: number;
    journalEntryId: number;
    taxImplications: TaxImplication[];
}
/**
 * Tax implication
 */
export interface TaxImplication {
    taxType: 'federal' | 'state' | 'local' | 'depreciation_recapture';
    taxableAmount: number;
    taxRate: number;
    estimatedTax: number;
}
/**
 * Asset maintenance record
 */
export interface AssetMaintenanceRecord {
    maintenanceId: number;
    assetId: number;
    maintenanceDate: Date;
    maintenanceType: 'preventive' | 'corrective' | 'predictive' | 'emergency';
    description: string;
    cost: number;
    isCapitalizable: boolean;
    capitalizedAmount?: number;
    vendorId?: number;
    technician?: string;
    nextMaintenanceDate?: Date;
}
/**
 * Asset insurance record
 */
export interface AssetInsuranceRecord {
    insuranceId: number;
    assetId: number;
    policyNumber: string;
    insuranceProvider: string;
    coverageType: string;
    coverageAmount: number;
    premium: number;
    effectiveDate: Date;
    expirationDate: Date;
    status: 'active' | 'expired' | 'cancelled';
}
export declare class FixedAssetsLifecycleComposite {
    /**
     * Acquires asset from purchase order with capitalization and audit trail
     * Composes: integratePurchaseToAsset, createFixedAsset, validateCapitalizationThreshold, logAssetTransaction
     */
    acquireAssetFromPurchaseOrder(purchaseOrderId: number, acquisitionRequest: AssetAcquisitionRequest, transaction?: Transaction): Promise<{
        assetId: number;
        assetNumber: string;
        capitalized: boolean;
        auditId: number;
    }>;
    /**
     * Creates asset directly with dimension validation
     * Composes: validateDimensionCombination, generateAssetNumber, createFixedAsset, createAuditTrail
     */
    createAssetWithDimensionValidation(request: AssetAcquisitionRequest, transaction?: Transaction): Promise<{
        assetId: number;
        assetNumber: string;
        dimensionsValid: boolean;
    }>;
    /**
     * Capitalizes project costs to asset
     * Composes: capitalizeProjectCosts, transferProjectToAsset, createFixedAsset, closeCapitalProject
     */
    capitalizeProjectToAsset(projectId: number, assetRequest: AssetAcquisitionRequest, transaction?: Transaction): Promise<{
        assetId: number;
        projectClosed: boolean;
        capitalizedAmount: number;
    }>;
    /**
     * Calculates and posts monthly depreciation batch
     * Composes: batchCalculateDepreciation, recordAssetDepreciation, createCloseTask, logAssetTransaction
     */
    calculateMonthlyDepreciationBatch(fiscalYear: number, fiscalPeriod: number, assetFilter?: any, transaction?: Transaction): Promise<DepreciationBatchResult>;
    /**
     * Generates comprehensive depreciation schedule for asset
     * Composes: generateDepreciationSchedule, calculateStraightLineDepreciation, exportAssetReport
     */
    generateAssetDepreciationSchedule(assetId: number, includeTaxBasis?: boolean, transaction?: Transaction): Promise<{
        schedule: any;
        exportPath: string;
    }>;
    /**
     * Calculates depreciation with multiple methods for comparison
     * Composes: calculateStraightLineDepreciation, calculateDecliningBalanceDepreciation, calculateMACRSDepreciation
     */
    compareDepreciationMethods(assetId: number, periodDate: Date, transaction?: Transaction): Promise<{
        straightLine: number;
        decliningBalance: number;
        macrs: number;
        recommended: string;
    }>;
    /**
     * Processes catch-up depreciation for missed periods
     * Composes: calculateStraightLineDepreciation, recordAssetDepreciation, createAuditTrail
     */
    processCatchUpDepreciation(assetId: number, fromPeriod: Date, toPeriod: Date, transaction?: Transaction): Promise<{
        periodsProcessed: number;
        totalDepreciation: number;
        journalEntries: number[];
    }>;
    /**
     * Transfers asset with dimension updates and audit trail
     * Composes: transferFixedAsset, updateAssetDimensions, validateDimensionCombination, trackAssetHistory
     */
    transferAssetWithDimensions(transferRequest: AssetTransferRequest, transaction?: Transaction): Promise<{
        transferId: number;
        dimensionsUpdated: boolean;
        auditId: number;
    }>;
    /**
     * Bulk transfers assets between locations
     * Composes: bulkTransferAssets, validateDimensionCombination, createAuditTrail
     */
    bulkTransferAssetsBetweenLocations(assetIds: number[], fromLocationCode: string, toLocationCode: string, transferDate: Date, transaction?: Transaction): Promise<{
        totalAssets: number;
        transferred: number;
        failed: number;
        errors: any[];
    }>;
    /**
     * Transfers asset between cost centers with financial impact analysis
     * Composes: transferFixedAsset, drilldownToAssetTransactions, generateAssetBalanceReport
     */
    transferAssetBetweenCostCenters(assetId: number, fromCostCenter: string, toCostCenter: string, transferDate: Date, transaction?: Transaction): Promise<{
        transferId: number;
        financialImpact: any;
        balanceReport: any;
    }>;
    /**
     * Disposes asset with gain/loss calculation and tax implications
     * Composes: calculateDisposalGainLoss, disposeFixedAsset, exportAssetTaxData, logAssetTransaction
     */
    disposeAssetWithTaxImplications(assetId: number, disposalDate: Date, disposalMethod: 'sale' | 'scrap' | 'trade-in' | 'donation' | 'write-off', disposalProceeds: number, transaction?: Transaction): Promise<AssetDisposalResult>;
    /**
     * Processes asset write-off with approval workflow
     * Composes: disposeFixedAsset, createAuditTrail, generateAuditReport
     */
    writeOffAsset(assetId: number, writeOffDate: Date, writeOffReason: string, approvedBy: string, transaction?: Transaction): Promise<{
        disposalId: number;
        writeOffAmount: number;
        auditTrailId: number;
        approved: boolean;
    }>;
    /**
     * Processes asset trade-in for new asset acquisition
     * Composes: disposeFixedAsset, createFixedAsset, calculateDisposalGainLoss
     */
    processAssetTradeIn(oldAssetId: number, tradeInValue: number, newAssetRequest: AssetAcquisitionRequest, transaction?: Transaction): Promise<{
        oldAssetDisposed: boolean;
        newAssetId: number;
        tradeInCredit: number;
        netPurchasePrice: number;
    }>;
    /**
     * Revalues asset with impairment testing
     * Composes: testAssetImpairment, revalueFixedAsset, createAuditTrail
     */
    revalueAssetWithImpairmentTest(assetId: number, fairValue: number, revaluationDate: Date, transaction?: Transaction): Promise<{
        revaluationId: number;
        impaired: boolean;
        impairmentLoss: number;
        revaluedAmount: number;
    }>;
    /**
     * Performs annual impairment testing for asset portfolio
     * Composes: testAssetImpairment, generateAuditReport, exportAssetReport
     */
    performAnnualImpairmentTesting(assetCategory: string, testDate: Date, transaction?: Transaction): Promise<{
        assetsTestedCount: number;
        impairedCount: number;
        totalImpairmentLoss: number;
        reportPath: string;
    }>;
    /**
     * Records maintenance with capitalization decision
     * Composes: validateCapitalizationThreshold, updateFixedAsset, logAssetTransaction
     */
    recordAssetMaintenance(assetId: number, maintenance: AssetMaintenanceRecord, transaction?: Transaction): Promise<{
        maintenanceId: number;
        capitalized: boolean;
        capitalizedAmount: number;
        expensed: number;
    }>;
    /**
     * Manages asset insurance with expiration tracking
     * Composes: updateFixedAsset, createAuditTrail, trackAssetHistory
     */
    manageAssetInsurance(assetId: number, insurance: AssetInsuranceRecord, transaction?: Transaction): Promise<{
        insuranceId: number;
        coverageAdequate: boolean;
        expirationWarning: boolean;
    }>;
    /**
     * Reconciles asset register to general ledger
     * Composes: generateAssetRegister, generateAssetBalanceReport, validateAssetReconciliation
     */
    reconcileAssetRegisterToGL(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        assetRegisterTotal: number;
        glBalance: number;
        variance: number;
        reconciled: boolean;
    }>;
    /**
     * Generates comprehensive asset reporting package
     * Composes: generateAssetRegister, generateDepreciationExpenseReport, exportAssetTaxData, exportAssetReport
     */
    generateAssetReportingPackage(fiscalYear: number, fiscalPeriod: number, includeTaxReports?: boolean, transaction?: Transaction): Promise<{
        assetRegister: any;
        depreciationReport: any;
        taxData?: any;
        packagePath: string;
    }>;
    /**
     * Analyzes asset lifecycle metrics
     * Composes: trackAssetHistory, generateAssetRegister, drilldownToAssetTransactions
     */
    analyzeAssetLifecycleMetrics(assetCategory: string, periodStart: Date, periodEnd: Date, transaction?: Transaction): Promise<{
        totalAssets: number;
        averageAge: number;
        averageRemainingLife: number;
        fullyDepreciated: number;
        disposedAssets: number;
        replacementNeeded: number;
    }>;
    /**
     * Creates right-of-use asset from lease
     * Composes: createLeaseAsset, createFixedAsset, calculateLeaseDepreciation
     */
    createROUAssetFromLease(leaseId: number, assetRequest: AssetAcquisitionRequest, transaction?: Transaction): Promise<{
        rouAssetId: number;
        fixedAssetId: number;
        initialValue: number;
    }>;
    /**
     * Processes lease termination with asset disposal
     * Composes: terminateLease, disposeFixedAsset, calculateDisposalGainLoss
     */
    terminateLeaseAndDisposeROUAsset(leaseId: number, rouAssetId: number, terminationDate: Date, transaction?: Transaction): Promise<{
        leaseTerminated: boolean;
        assetDisposed: boolean;
        gainLoss: number;
    }>;
    /**
     * Processes asset componentization for complex assets
     * Composes: createFixedAsset, transferFixedAsset, generateAssetNumber
     */
    componentizeComplexAsset(parentAssetId: number, components: AssetAcquisitionRequest[], transaction?: Transaction): Promise<{
        parentAssetId: number;
        componentIds: number[];
        totalComponentValue: number;
    }>;
    /**
     * Generates asset replacement forecast
     * Composes: generateAssetRegister, calculateStraightLineDepreciation, exportAssetReport
     */
    generateAssetReplacementForecast(assetCategory: string, forecastYears: number, transaction?: Transaction): Promise<{
        forecastPeriods: any[];
        totalReplacementCost: number;
        reportPath: string;
    }>;
    /**
     * Performs asset utilization analysis
     * Composes: trackAssetHistory, drilldownToAssetTransactions, generateAuditReport
     */
    analyzeAssetUtilization(departmentCode: string, periodStart: Date, periodEnd: Date, transaction?: Transaction): Promise<{
        totalAssets: number;
        activeAssets: number;
        utilizationRate: number;
        underutilizedAssets: any[];
    }>;
}
export { AssetAcquisitionRequest, AssetLifecycleStatus, DepreciationBatchResult, DepreciationError, AssetTransferRequest, AssetDisposalResult, TaxImplication, AssetMaintenanceRecord, AssetInsuranceRecord, };
//# sourceMappingURL=fixed-assets-lifecycle-composite.d.ts.map