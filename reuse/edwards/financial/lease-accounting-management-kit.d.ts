/**
 * LOC: LSEACCT001
 * File: /reuse/edwards/financial/lease-accounting-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - crypto (encryption for sensitive lease data)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Asset management services
 *   - Healthcare facility lease services
 *   - Financial reporting modules
 */
/**
 * File: /reuse/edwards/financial/lease-accounting-management-kit.ts
 * Locator: WC-EDWARDS-LSEACCT-001
 * Purpose: Comprehensive Lease Accounting Management - ASC 842/IFRS 16 compliant lease classification, ROU assets, lease liabilities, schedules, modifications
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, Node crypto
 * Downstream: ../backend/financial/*, Asset Management, Healthcare Facility Services, Financial Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for lease classification, lease schedules, ROU assets, lease liabilities, ASC 842/IFRS 16 compliance, modifications, terminations, impairment
 *
 * LLM Context: Enterprise-grade lease accounting for White Cross Healthcare Platform competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive ASC 842/IFRS 16 compliant lease accounting including lease classification (operating vs finance),
 * lease schedule generation, right-of-use asset management, lease liability tracking, payment processing,
 * lease modifications, early terminations, impairment testing, compliance reporting, and audit trails.
 * Supports healthcare-specific leases: medical equipment, facility space, ambulances, imaging equipment.
 */
import { Transaction } from 'sequelize';
interface LeaseContract {
    leaseId: number;
    leaseNumber: string;
    lessorId: number;
    lessorName: string;
    lesseeId: number;
    lesseeLegalEntity: string;
    leaseType: 'operating' | 'finance' | 'short-term' | 'low-value';
    leaseClassification: 'ASC842-Operating' | 'ASC842-Finance' | 'IFRS16-Operating' | 'IFRS16-Finance';
    assetCategory: 'real-estate' | 'medical-equipment' | 'vehicle' | 'it-equipment' | 'other';
    assetDescription: string;
    commencementDate: Date;
    expirationDate: Date;
    leaseTerm: number;
    renewalOptions: RenewalOption[];
    purchaseOption?: PurchaseOption;
    terminationOption?: TerminationOption;
    status: 'draft' | 'active' | 'modified' | 'terminated' | 'expired';
    complianceStandard: 'ASC842' | 'IFRS16';
    encryptedContractData?: string;
}
interface RenewalOption {
    optionNumber: number;
    renewalPeriod: number;
    renewalRate: number;
    reasonablyCertain: boolean;
}
interface PurchaseOption {
    purchasePrice: number;
    reasonablyCertain: boolean;
    exercisableDate: Date;
}
interface TerminationOption {
    terminationPenalty: number;
    noticePeriod: number;
    exercisableDate: Date;
}
interface LeasePaymentSchedule {
    scheduleId: number;
    leaseId: number;
    paymentNumber: number;
    paymentDate: Date;
    baseRent: number;
    variableRent: number;
    commonAreaMaintenance: number;
    propertyTax: number;
    insurance: number;
    totalPayment: number;
    principalPortion: number;
    interestPortion: number;
    leaseType: 'operating' | 'finance';
    fiscalYear: number;
    fiscalPeriod: number;
    isPaid: boolean;
    paidDate?: Date;
}
interface RightOfUseAsset {
    rouAssetId: number;
    leaseId: number;
    assetCode: string;
    assetDescription: string;
    commencementDate: Date;
    initialCost: number;
    accumulatedDepreciation: number;
    netBookValue: number;
    depreciationMethod: 'straight-line' | 'reducing-balance';
    usefulLife: number;
    impairmentLoss: number;
    disposalDate?: Date;
    disposalValue?: number;
}
interface LeaseLiability {
    liabilityId: number;
    leaseId: number;
    commencementDate: Date;
    initialLiability: number;
    currentLiability: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
    discountRate: number;
    incrementalBorrowingRate: number;
    presentValueFactor: number;
}
interface LeaseClassificationTest {
    leaseId: number;
    testDate: Date;
    transferOfOwnership: boolean;
    purchaseOptionReasonablyCertain: boolean;
    leaseTermMajorPartOfLife: boolean;
    presentValueSubstantiallyAll: boolean;
    specializedAsset: boolean;
    classificationResult: 'operating' | 'finance';
    economicLifeYears: number;
    fairValueAtCommencement: number;
    presentValueOfPayments: number;
    notes: string;
}
interface LeaseModification {
    modificationId: number;
    leaseId: number;
    modificationDate: Date;
    modificationType: 'scope-increase' | 'scope-decrease' | 'payment-change' | 'term-extension' | 'term-reduction';
    description: string;
    originalLeaseTerm: number;
    revisedLeaseTerm: number;
    originalPayment: number;
    revisedPayment: number;
    remeasurementRequired: boolean;
    newDiscountRate?: number;
    accountingTreatment: 'separate-contract' | 'modify-existing';
    approvedBy: string;
    approvalDate: Date;
}
interface LeaseTermination {
    terminationId: number;
    leaseId: number;
    terminationDate: Date;
    terminationReason: 'early-termination' | 'expiration' | 'default' | 'mutual-agreement';
    terminationPenalty: number;
    settlementAmount: number;
    rouAssetDisposalGainLoss: number;
    liabilitySettlementGainLoss: number;
    totalGainLoss: number;
    processedBy: string;
    processedDate: Date;
}
interface LeaseImpairmentTest {
    impairmentTestId: number;
    rouAssetId: number;
    leaseId: number;
    testDate: Date;
    carryingAmount: number;
    recoverableAmount: number;
    fairValueLessCostsToSell: number;
    valueInUse: number;
    impairmentLoss: number;
    impairmentIndicators: string[];
    reversalOfImpairment: number;
    testedBy: string;
}
interface LeaseDisclosure {
    disclosureId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    totalOperatingLeaseExpense: number;
    totalFinanceLeaseDepreciation: number;
    totalFinanceLeaseInterest: number;
    totalShortTermLeaseExpense: number;
    totalVariableLeaseExpense: number;
    cashPaidForOperatingLeases: number;
    cashPaidForFinanceLeases: number;
    weightedAverageDiscountRate: number;
    weightedAverageRemainingTerm: number;
}
interface LeaseMaturityAnalysis {
    fiscalYear: number;
    year1Payments: number;
    year2Payments: number;
    year3Payments: number;
    year4Payments: number;
    year5Payments: number;
    thereafter: number;
    totalUndiscountedCashFlows: number;
}
/**
 * Classifies lease as operating or finance under ASC 842
 * @param leaseData - Lease contract data
 * @param economicLife - Economic life of asset in years
 * @param fairValue - Fair value at commencement
 * @returns Classification result with test criteria
 */
export declare function classifyLeaseASC842(leaseData: Partial<LeaseContract>, economicLife: number, fairValue: number, transaction?: Transaction): Promise<LeaseClassificationTest>;
/**
 * Classifies lease under IFRS 16 (all leases are finance leases except short-term and low-value)
 * @param leaseData - Lease contract data
 * @param assetValue - Asset value
 * @returns Classification result
 */
export declare function classifyLeaseIFRS16(leaseData: Partial<LeaseContract>, assetValue: number, transaction?: Transaction): Promise<LeaseClassificationTest>;
/**
 * Determines if asset is specialized with no alternative use
 * @param assetCategory - Asset category
 * @param description - Asset description
 * @returns True if specialized asset
 */
export declare function isSpecializedAsset(assetCategory: string, description: string): Promise<boolean>;
/**
 * Calculates incremental borrowing rate for lease
 * @param lesseeId - Lessee identifier
 * @param leaseTerm - Lease term in months
 * @param currency - Currency code
 * @returns Incremental borrowing rate
 */
export declare function calculateIncrementalBorrowingRate(lesseeId: number, leaseTerm: number, currency?: string, transaction?: Transaction): Promise<number>;
/**
 * Evaluates renewal options for reasonable certainty
 * @param leaseId - Lease identifier
 * @param renewalOptions - Renewal options
 * @returns Options reasonably certain to be exercised
 */
export declare function evaluateRenewalOptions(leaseId: number, renewalOptions: RenewalOption[], transaction?: Transaction): Promise<RenewalOption[]>;
/**
 * Generates complete lease payment schedule
 * @param leaseId - Lease identifier
 * @param commencementDate - Lease commencement date
 * @param payments - Payment details
 * @returns Array of payment schedule entries
 */
export declare function generateLeaseSchedule(leaseId: number, commencementDate: Date, payments: {
    amount: number;
    frequency: 'monthly' | 'quarterly' | 'annual';
}[], leaseTerm: number, discountRate: number, leaseType: 'operating' | 'finance', transaction?: Transaction): Promise<LeasePaymentSchedule[]>;
/**
 * Calculates lease payment amortization for finance lease
 * @param initialLiability - Initial lease liability
 * @param discountRate - Discount rate
 * @param leaseTerm - Lease term in months
 * @returns Amortization schedule
 */
export declare function calculateLeaseAmortization(initialLiability: number, discountRate: number, leaseTerm: number, transaction?: Transaction): Promise<{
    period: number;
    payment: number;
    interest: number;
    principal: number;
    balance: number;
}[]>;
/**
 * Processes lease payment and updates liability
 * @param scheduleId - Payment schedule ID
 * @param paymentDate - Actual payment date
 * @param paymentAmount - Payment amount
 * @returns Updated payment record
 */
export declare function processLeasePayment(scheduleId: number, paymentDate: Date, paymentAmount: number, transaction?: Transaction): Promise<LeasePaymentSchedule>;
/**
 * Calculates variable lease payments
 * @param leaseId - Lease identifier
 * @param paymentDate - Payment date
 * @param variableFactors - Variable payment factors
 * @returns Calculated variable payment
 */
export declare function calculateVariableLeasePayments(leaseId: number, paymentDate: Date, variableFactors: {
    salesRevenue?: number;
    indexRate?: number;
    usage?: number;
}, transaction?: Transaction): Promise<number>;
/**
 * Creates initial right-of-use asset
 * @param leaseId - Lease identifier
 * @param initialCost - Initial cost (PV of lease payments + initial direct costs)
 * @returns ROU asset record
 */
export declare function createRightOfUseAsset(leaseId: number, initialCost: number, usefulLife: number, transaction?: Transaction): Promise<RightOfUseAsset>;
/**
 * Calculates ROU asset depreciation
 * @param rouAssetId - ROU asset identifier
 * @param depreciationDate - Depreciation date
 * @returns Depreciation amount
 */
export declare function calculateROUDepreciation(rouAssetId: number, depreciationDate: Date, transaction?: Transaction): Promise<number>;
/**
 * Records ROU asset depreciation
 * @param rouAssetId - ROU asset identifier
 * @param depreciationAmount - Depreciation amount
 * @param depreciationDate - Depreciation date
 * @returns Updated ROU asset
 */
export declare function recordROUDepreciation(rouAssetId: number, depreciationAmount: number, depreciationDate: Date, transaction?: Transaction): Promise<RightOfUseAsset>;
/**
 * Disposes ROU asset on lease termination
 * @param rouAssetId - ROU asset identifier
 * @param disposalDate - Disposal date
 * @returns Disposal gain/loss
 */
export declare function disposeROUAsset(rouAssetId: number, disposalDate: Date, transaction?: Transaction): Promise<number>;
/**
 * Creates initial lease liability
 * @param leaseId - Lease identifier
 * @param presentValueOfPayments - PV of lease payments
 * @param discountRate - Discount rate
 * @returns Lease liability record
 */
export declare function createLeaseLiability(leaseId: number, presentValueOfPayments: number, discountRate: number, transaction?: Transaction): Promise<LeaseLiability>;
/**
 * Updates lease liability after payment
 * @param leaseId - Lease identifier
 * @param principalPortion - Principal portion of payment
 * @param interestPortion - Interest portion of payment
 * @returns Updated liability
 */
export declare function updateLeaseLiability(leaseId: number, principalPortion: number, interestPortion: number, transaction?: Transaction): Promise<LeaseLiability>;
/**
 * Calculates present value of lease payments
 * @param leaseId - Lease identifier
 * @param commencementDate - Commencement date
 * @returns Present value
 */
export declare function calculatePresentValueOfPayments(leaseId: number, commencementDate: Date, transaction?: Transaction): Promise<number>;
/**
 * Remeasures lease liability on modification
 * @param leaseId - Lease identifier
 * @param modificationDate - Modification date
 * @param newDiscountRate - New discount rate
 * @returns Remeasured liability
 */
export declare function remeasureLeaseLiability(leaseId: number, modificationDate: Date, newDiscountRate?: number, transaction?: Transaction): Promise<LeaseLiability>;
/**
 * Processes lease modification
 * @param leaseId - Lease identifier
 * @param modification - Modification details
 * @returns Modification record
 */
export declare function processLeaseModification(leaseId: number, modification: Partial<LeaseModification>, transaction?: Transaction): Promise<LeaseModification>;
/**
 * Evaluates if modification should be accounted as separate contract
 * @param modification - Modification details
 * @returns True if separate contract
 */
export declare function evaluateIfSeparateContract(modification: Partial<LeaseModification>, transaction?: Transaction): Promise<boolean>;
/**
 * Processes lease term extension
 * @param leaseId - Lease identifier
 * @param extensionMonths - Months to extend
 * @param newPaymentAmount - New payment amount
 * @returns Modified lease
 */
export declare function processLeaseExtension(leaseId: number, extensionMonths: number, newPaymentAmount: number, transaction?: Transaction): Promise<LeaseContract>;
/**
 * Processes early lease termination
 * @param leaseId - Lease identifier
 * @param terminationDate - Termination date
 * @param terminationReason - Reason for termination
 * @returns Termination record
 */
export declare function processLeaseTermination(leaseId: number, terminationDate: Date, terminationReason: string, transaction?: Transaction): Promise<LeaseTermination>;
/**
 * Calculates lease termination penalty
 * @param leaseId - Lease identifier
 * @param terminationDate - Termination date
 * @returns Penalty amount
 */
export declare function calculateTerminationPenalty(leaseId: number, terminationDate: Date, transaction?: Transaction): Promise<number>;
/**
 * Processes lease expiration
 * @param leaseId - Lease identifier
 * @returns Updated lease
 */
export declare function processLeaseExpiration(leaseId: number, transaction?: Transaction): Promise<LeaseContract>;
/**
 * Performs ROU asset impairment test
 * @param rouAssetId - ROU asset identifier
 * @param testDate - Test date
 * @returns Impairment test results
 */
export declare function performImpairmentTest(rouAssetId: number, testDate: Date, transaction?: Transaction): Promise<LeaseImpairmentTest>;
/**
 * Identifies impairment indicators for ROU asset
 * @param rouAssetId - ROU asset identifier
 * @returns Array of impairment indicators
 */
export declare function identifyImpairmentIndicators(rouAssetId: number, transaction?: Transaction): Promise<string[]>;
/**
 * Records impairment loss for ROU asset
 * @param rouAssetId - ROU asset identifier
 * @param impairmentLoss - Impairment loss amount
 * @returns Updated ROU asset
 */
export declare function recordImpairmentLoss(rouAssetId: number, impairmentLoss: number, transaction?: Transaction): Promise<RightOfUseAsset>;
/**
 * Generates ASC 842 lease disclosure
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Disclosure data
 */
export declare function generateASC842Disclosure(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<LeaseDisclosure>;
/**
 * Generates lease maturity analysis
 * @param asOfDate - Analysis date
 * @returns Maturity analysis
 */
export declare function generateLeaseMaturityAnalysis(asOfDate: Date, transaction?: Transaction): Promise<LeaseMaturityAnalysis>;
/**
 * Validates lease accounting compliance with ASC 842/IFRS 16
 * @param leaseId - Lease identifier
 * @returns Validation results
 */
export declare function validateLeaseCompliance(leaseId: number, transaction?: Transaction): Promise<{
    isCompliant: boolean;
    issues: string[];
}>;
/**
 * Encrypts sensitive lease contract data
 * @param contractData - Contract data to encrypt
 * @param encryptionKey - Encryption key
 * @returns Encrypted contract data
 */
export declare function encryptLeaseContractData(contractData: string, encryptionKey: string): Promise<string>;
/**
 * Decrypts sensitive lease contract data
 * @param encryptedData - Encrypted data
 * @param encryptionKey - Encryption key
 * @returns Decrypted contract data
 */
export declare function decryptLeaseContractData(encryptedData: string, encryptionKey: string): Promise<string>;
export {};
//# sourceMappingURL=lease-accounting-management-kit.d.ts.map