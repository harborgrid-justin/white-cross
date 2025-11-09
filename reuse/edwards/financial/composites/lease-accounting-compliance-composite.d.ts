/**
 * LOC: LSECMP001
 * File: /reuse/edwards/financial/composites/lease-accounting-compliance-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../lease-accounting-management-kit
 *   - ../fixed-assets-depreciation-kit
 *   - ../audit-trail-compliance-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../accounts-payable-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Lease accounting REST API controllers
 *   - ASC 842/IFRS 16 compliance services
 *   - ROU asset management services
 *   - Lease payment processing services
 *   - Financial statement preparation modules
 */
import { Transaction } from 'sequelize';
import { type LeaseContract, type ROUAsset, type LeaseLiability, type LeasePaymentSchedule, type LeaseModification, type LeaseTermination, type Sublease, type LeaseClassification, type LeaseComplianceReport, type LeaseDisclosure, type LeaseType } from '../lease-accounting-management-kit';
import { type DepreciationSchedule, type AssetImpairment } from '../fixed-assets-depreciation-kit';
import { type AuditEntry, type ComplianceReport } from '../audit-trail-compliance-kit';
import { type BalanceSheetReport, type IncomeStatementReport, type FinancialKPI } from '../financial-reporting-analytics-kit';
import { type Payment } from '../accounts-payable-management-kit';
/**
 * Lease accounting API configuration
 */
export interface LeaseApiConfig {
    baseUrl: string;
    complianceStandard: 'ASC842' | 'IFRS16' | 'BOTH';
    autoClassifyLeases: boolean;
    autoGenerateSchedules: boolean;
    enableImpairmentTesting: boolean;
    defaultDiscountRate: number;
}
/**
 * Comprehensive lease details
 */
export interface ComprehensiveLeaseDetails {
    lease: LeaseContract;
    classification: LeaseClassification;
    rouAsset: ROUAsset;
    leaseLiability: LeaseLiability;
    paymentSchedule: LeasePaymentSchedule[];
    compliance: LeaseComplianceReport;
    metrics: LeaseMetrics;
}
/**
 * Lease metrics and analytics
 */
export interface LeaseMetrics {
    totalLeaseValue: number;
    presentValueOfPayments: number;
    averageMonthlyPayment: number;
    remainingTerm: number;
    remainingLiability: number;
    currentROUValue: number;
    utilizationRate: number;
    complianceScore: number;
}
/**
 * Lease modification impact
 */
export interface LeaseModificationImpact {
    modification: LeaseModification;
    modificationType: 'Type A' | 'Type B';
    rouAssetAdjustment: number;
    liabilityAdjustment: number;
    gainLoss: number;
    newPaymentSchedule: LeasePaymentSchedule[];
    accountingEntries: any[];
}
/**
 * Lease termination details
 */
export interface LeaseTerminationDetails {
    termination: LeaseTermination;
    finalROUValue: number;
    finalLiabilityValue: number;
    terminationGainLoss: number;
    disposalEntries: any[];
    audit: AuditEntry;
}
/**
 * Lease portfolio summary
 */
export interface LeasePortfolioSummary {
    totalLeases: number;
    operatingLeases: number;
    financeLeases: number;
    totalROUAssets: number;
    totalLeaseLiabilities: number;
    averageRemainingTerm: number;
    complianceRate: number;
    monthlyPaymentTotal: number;
}
/**
 * Lease payment processing result
 */
export interface LeasePaymentProcessingResult {
    payment: Payment;
    leasePayment: any;
    liabilityUpdate: LeaseLiability;
    interestExpense: number;
    principalReduction: number;
    remainingBalance: number;
    audit: AuditEntry;
}
/**
 * Creates comprehensive lease with classification and accounting setup
 * Composes: createLeaseContract, classifyLease, createROUAsset, createLeaseLiability, generateLeasePaymentSchedule
 *
 * @param leaseData - Lease contract data
 * @param userId - User creating the lease
 * @param transaction - Database transaction
 * @returns Complete lease setup with all accounting components
 */
export declare const createComprehensiveLeaseWithAccounting: (leaseData: Partial<LeaseContract>, userId: string, transaction?: Transaction) => Promise<ComprehensiveLeaseDetails>;
/**
 * Retrieves comprehensive lease details with current balances
 * Composes: getLeaseContract, getROUAsset, getLeaseLiability, validateLeaseCompliance
 *
 * @param leaseId - Lease identifier
 * @returns Complete lease details with current accounting values
 */
export declare const getComprehensiveLeaseDetails: (leaseId: number) => Promise<ComprehensiveLeaseDetails>;
/**
 * Updates lease contract with validation and audit
 * Composes: updateLeaseContract, validateLeaseCompliance, createAuditEntry
 *
 * @param leaseId - Lease identifier
 * @param updates - Lease update data
 * @param userId - User making update
 * @returns Updated lease with audit trail
 */
export declare const updateLeaseWithValidationAndAudit: (leaseId: number, updates: Partial<LeaseContract>, userId: string) => Promise<{
    lease: LeaseContract;
    compliance: LeaseComplianceReport;
    audit: AuditEntry;
}>;
/**
 * Classifies lease with compliance validation
 * Composes: classifyLease, calculateLeaseClassification, validateComplianceRule, createAuditEntry
 *
 * @param leaseId - Lease identifier
 * @param complianceStandard - ASC842 or IFRS16
 * @param userId - User classifying lease
 * @returns Classification result with compliance status
 */
export declare const classifyLeaseWithCompliance: (leaseId: number, complianceStandard: "ASC842" | "IFRS16", userId: string) => Promise<{
    classification: LeaseClassification;
    compliance: boolean;
    rationale: string[];
    audit: AuditEntry;
}>;
/**
 * Reclassifies lease with impact analysis
 * Composes: reclassifyLease, calculateModificationImpact, updateROUAsset, updateLeaseLiability
 *
 * @param leaseId - Lease identifier
 * @param newLeaseType - New lease type
 * @param userId - User reclassifying lease
 * @returns Reclassification result with accounting impact
 */
export declare const reclassifyLeaseWithImpactAnalysis: (leaseId: number, newLeaseType: LeaseType, userId: string) => Promise<{
    classification: LeaseClassification;
    rouAssetAdjustment: number;
    liabilityAdjustment: number;
    accountingEntries: any[];
    audit: AuditEntry;
}>;
/**
 * Creates ROU asset with depreciation schedule
 * Composes: createROUAsset, calculateDepreciation, processDepreciation
 *
 * @param leaseId - Lease identifier
 * @param userId - User creating asset
 * @returns ROU asset with depreciation schedule
 */
export declare const createROUAssetWithDepreciation: (leaseId: number, userId: string) => Promise<{
    rouAsset: ROUAsset;
    depreciationSchedule: DepreciationSchedule;
    audit: AuditEntry;
}>;
/**
 * Updates ROU asset value with validation
 * Composes: updateROUAsset, testROUAssetImpairment, createAuditEntry
 *
 * @param leaseId - Lease identifier
 * @param newValue - New asset value
 * @param userId - User updating asset
 * @returns Updated ROU asset with impairment test
 */
export declare const updateROUAssetWithImpairmentTest: (leaseId: number, newValue: number, userId: string) => Promise<{
    rouAsset: ROUAsset;
    impairment: AssetImpairment | null;
    audit: AuditEntry;
}>;
/**
 * Depreciates ROU asset with accounting entries
 * Composes: depreciateROUAsset, processDepreciation, createAuditEntry
 *
 * @param leaseId - Lease identifier
 * @param periodDate - Depreciation period date
 * @param userId - User processing depreciation
 * @returns Depreciation result with accounting entries
 */
export declare const depreciateROUAssetWithAccounting: (leaseId: number, periodDate: Date, userId: string) => Promise<{
    rouAsset: ROUAsset;
    depreciationAmount: number;
    accumulatedDepreciation: number;
    accountingEntries: any[];
    audit: AuditEntry;
}>;
/**
 * Tests ROU asset impairment with loss calculation
 * Composes: testROUAssetImpairment, calculateImpairmentLoss, createAuditEntry
 *
 * @param leaseId - Lease identifier
 * @param userId - User testing impairment
 * @returns Impairment test result with loss calculation
 */
export declare const testROUAssetImpairmentWithLoss: (leaseId: number, userId: string) => Promise<{
    impairment: AssetImpairment;
    impairmentLoss: number;
    accountingEntries: any[];
    audit: AuditEntry;
}>;
/**
 * Creates lease liability with amortization schedule
 * Composes: createLeaseLiability, calculateLeaseLiability, generateLeasePaymentSchedule
 *
 * @param leaseId - Lease identifier
 * @param userId - User creating liability
 * @returns Lease liability with amortization schedule
 */
export declare const createLeaseLiabilityWithAmortization: (leaseId: number, userId: string) => Promise<{
    leaseLiability: LeaseLiability;
    amortizationSchedule: LeasePaymentSchedule[];
    audit: AuditEntry;
}>;
/**
 * Updates lease liability with recalculation
 * Composes: updateLeaseLiability, calculateLeaseLiability, createAuditEntry
 *
 * @param leaseId - Lease identifier
 * @param userId - User updating liability
 * @returns Updated lease liability
 */
export declare const updateLeaseLiabilityWithRecalculation: (leaseId: number, userId: string) => Promise<{
    leaseLiability: LeaseLiability;
    adjustment: number;
    audit: AuditEntry;
}>;
/**
 * Amortizes lease liability for period
 * Composes: amortizeLeaseLiability, updateLeaseLiability, createAuditEntry
 *
 * @param leaseId - Lease identifier
 * @param periodDate - Period date
 * @param userId - User processing amortization
 * @returns Amortization result with accounting entries
 */
export declare const amortizeLeaseLiabilityWithAccounting: (leaseId: number, periodDate: Date, userId: string) => Promise<{
    leaseLiability: LeaseLiability;
    interestExpense: number;
    principalReduction: number;
    accountingEntries: any[];
    audit: AuditEntry;
}>;
/**
 * Processes lease payment with full accounting
 * Composes: processLeasePayment, recordLeasePayment, amortizeLeaseLiability, createAuditEntry
 *
 * @param leaseId - Lease identifier
 * @param paymentAmount - Payment amount
 * @param paymentDate - Payment date
 * @param userId - User processing payment
 * @returns Payment processing result with accounting entries
 */
export declare const processLeasePaymentWithAccounting: (leaseId: number, paymentAmount: number, paymentDate: Date, userId: string) => Promise<LeasePaymentProcessingResult>;
/**
 * Generates and validates lease payment schedule
 * Composes: generateLeasePaymentSchedule, calculateLeasePayment, validateLeaseCompliance
 *
 * @param leaseId - Lease identifier
 * @param userId - User generating schedule
 * @returns Payment schedule with validation
 */
export declare const generateValidatedLeasePaymentSchedule: (leaseId: number, userId: string) => Promise<{
    schedule: LeasePaymentSchedule[];
    totalPayments: number;
    totalInterest: number;
    compliance: LeaseComplianceReport;
    audit: AuditEntry;
}>;
/**
 * Updates payment schedule after modification
 * Composes: updateLeasePaymentSchedule, generateLeasePaymentSchedule, calculateLeasePayment
 *
 * @param leaseId - Lease identifier
 * @param userId - User updating schedule
 * @returns Updated payment schedule
 */
export declare const updateLeasePaymentScheduleAfterModification: (leaseId: number, userId: string) => Promise<{
    oldSchedule: LeasePaymentSchedule[];
    newSchedule: LeasePaymentSchedule[];
    scheduleDifference: number;
    audit: AuditEntry;
}>;
/**
 * Processes lease modification with full impact analysis
 * Composes: modifyLease, accountForLeaseModification, calculateModificationImpact, updateROUAsset, updateLeaseLiability
 *
 * @param leaseId - Lease identifier
 * @param modificationData - Modification data
 * @param userId - User processing modification
 * @returns Modification impact with accounting entries
 */
export declare const processLeaseModificationWithImpact: (leaseId: number, modificationData: Partial<LeaseModification>, userId: string) => Promise<LeaseModificationImpact>;
/**
 * Validates lease modification compliance
 * Composes: validateLeaseCompliance, calculateModificationImpact, createAuditEntry
 *
 * @param leaseId - Lease identifier
 * @param modificationId - Modification identifier
 * @returns Compliance validation result
 */
export declare const validateLeaseModificationCompliance: (leaseId: number, modificationId: number) => Promise<{
    compliance: LeaseComplianceReport;
    impact: any;
    approved: boolean;
    issues: string[];
}>;
/**
 * Terminates lease with full accounting treatment
 * Composes: terminateLease, calculateTerminationGainLoss, processEarlyTermination, recordAssetDisposal
 *
 * @param leaseId - Lease identifier
 * @param terminationDate - Termination date
 * @param terminationReason - Reason for termination
 * @param userId - User terminating lease
 * @returns Termination details with accounting entries
 */
export declare const terminateLeaseWithAccounting: (leaseId: number, terminationDate: Date, terminationReason: string, userId: string) => Promise<LeaseTerminationDetails>;
/**
 * Calculates early termination penalty
 * Composes: calculateTerminationGainLoss, getLeaseContract, getLeaseLiability
 *
 * @param leaseId - Lease identifier
 * @param terminationDate - Proposed termination date
 * @returns Termination penalty calculation
 */
export declare const calculateEarlyTerminationPenalty: (leaseId: number, terminationDate: Date) => Promise<{
    penalty: number;
    remainingLiability: number;
    gainLoss: number;
    totalCost: number;
}>;
/**
 * Creates sublease with accounting treatment
 * Composes: createSublease, accountForSublease, createLeaseContract, createAuditEntry
 *
 * @param headLeaseId - Head lease identifier
 * @param subleaseData - Sublease data
 * @param userId - User creating sublease
 * @returns Sublease with accounting entries
 */
export declare const createSubleaseWithAccounting: (headLeaseId: number, subleaseData: Partial<Sublease>, userId: string) => Promise<{
    sublease: Sublease;
    subleaseContract: LeaseContract;
    accountingEntries: any[];
    audit: AuditEntry;
}>;
/**
 * Processes sale-leaseback transaction
 * Composes: processSaleLeasebackTransaction, createLeaseContract, recordAssetDisposal, createAuditEntry
 *
 * @param assetId - Asset identifier
 * @param salePrice - Sale price
 * @param leaseData - Leaseback data
 * @param userId - User processing transaction
 * @returns Sale-leaseback result with accounting
 */
export declare const processSaleLeasebackWithAccounting: (assetId: number, salePrice: number, leaseData: Partial<LeaseContract>, userId: string) => Promise<{
    saleGainLoss: number;
    leasebackContract: LeaseContract;
    accountingEntries: any[];
    audit: AuditEntry;
}>;
/**
 * Validates comprehensive lease compliance
 * Composes: validateLeaseCompliance, validateComplianceRule, generateComplianceReport
 *
 * @param leaseId - Lease identifier
 * @param complianceStandard - Compliance standard
 * @returns Comprehensive compliance validation
 */
export declare const validateComprehensiveLeaseCompliance: (leaseId: number, complianceStandard: "ASC842" | "IFRS16") => Promise<{
    compliance: LeaseComplianceReport;
    rules: boolean;
    report: ComplianceReport;
    score: number;
}>;
/**
 * Generates lease disclosure report
 * Composes: generateLeaseDisclosureReport, calculateLeaseMetrics, getAuditTrail
 *
 * @param leaseId - Lease identifier
 * @returns Comprehensive disclosure report
 */
export declare const generateComprehensiveLeaseDisclosureReport: (leaseId: number) => Promise<{
    disclosure: LeaseDisclosure;
    metrics: LeaseMetrics;
    auditTrail: AuditEntry[];
}>;
/**
 * Generates lease portfolio summary
 * Composes: Multiple lease queries and calculations
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @returns Portfolio summary with metrics
 */
export declare const generateLeasePortfolioSummary: (entityId: number, fiscalYear: number) => Promise<LeasePortfolioSummary>;
/**
 * Generates lease financial impact report
 * Composes: generateBalanceSheet, generateIncomeStatement, calculateFinancialKPI
 *
 * @param entityId - Entity identifier
 * @param fiscalYear - Fiscal year
 * @returns Financial impact report
 */
export declare const generateLeaseFinancialImpactReport: (entityId: number, fiscalYear: number) => Promise<{
    balanceSheet: BalanceSheetReport;
    incomeStatement: IncomeStatementReport;
    kpis: FinancialKPI[];
}>;
/**
 * Processes monthly lease accounting batch
 * Composes: depreciateROUAsset, amortizeLeaseLiability, processLeasePayment, createAuditEntry
 *
 * @param entityId - Entity identifier
 * @param periodDate - Period date
 * @param userId - User processing batch
 * @returns Batch processing results
 */
export declare const processMonthlyLeaseAccountingBatch: (entityId: number, periodDate: Date, userId: string) => Promise<{
    processed: number;
    depreciation: number;
    interest: number;
    payments: number;
    errors: any[];
    audit: AuditEntry;
}>;
/**
 * Tests impairment for lease portfolio
 * Composes: testROUAssetImpairment, calculateImpairmentLoss, createAuditEntry
 *
 * @param entityId - Entity identifier
 * @param userId - User testing impairment
 * @returns Impairment testing results
 */
export declare const testLeasePortfolioImpairment: (entityId: number, userId: string) => Promise<{
    tested: number;
    impaired: number;
    totalImpairmentLoss: number;
    impairments: AssetImpairment[];
    audit: AuditEntry;
}>;
export { createComprehensiveLeaseWithAccounting, getComprehensiveLeaseDetails, updateLeaseWithValidationAndAudit, classifyLeaseWithCompliance, reclassifyLeaseWithImpactAnalysis, createROUAssetWithDepreciation, updateROUAssetWithImpairmentTest, depreciateROUAssetWithAccounting, testROUAssetImpairmentWithLoss, createLeaseLiabilityWithAmortization, updateLeaseLiabilityWithRecalculation, amortizeLeaseLiabilityWithAccounting, processLeasePaymentWithAccounting, generateValidatedLeasePaymentSchedule, updateLeasePaymentScheduleAfterModification, processLeaseModificationWithImpact, validateLeaseModificationCompliance, terminateLeaseWithAccounting, calculateEarlyTerminationPenalty, createSubleaseWithAccounting, processSaleLeasebackWithAccounting, validateComprehensiveLeaseCompliance, generateComprehensiveLeaseDisclosureReport, generateLeasePortfolioSummary, generateLeaseFinancialImpactReport, processMonthlyLeaseAccountingBatch, testLeasePortfolioImpairment, type LeaseApiConfig, type ComprehensiveLeaseDetails, type LeaseMetrics, type LeaseModificationImpact, type LeaseTerminationDetails, type LeasePortfolioSummary, type LeasePaymentProcessingResult, };
//# sourceMappingURL=lease-accounting-compliance-composite.d.ts.map