/**
 * LOC: HRCKIT001
 * File: /reuse/server/health/health-revenue-cycle-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto (Node.js)
 *   - ./health-billing-claims-kit
 *
 * DOWNSTREAM (imported by):
 *   - Revenue cycle services
 *   - Financial reporting modules
 *   - Collections management
 *   - Contract management services
 *   - Analytics dashboards
 */
/**
 * Charge status enumeration
 */
export declare enum ChargeStatus {
    PENDING = "pending",
    VALIDATED = "validated",
    POSTED = "posted",
    BILLED = "billed",
    HOLD = "hold",
    CORRECTED = "corrected",
    DELETED = "deleted"
}
/**
 * Payment type enumeration
 */
export declare enum PaymentType {
    INSURANCE = "insurance",
    PATIENT = "patient",
    REFUND = "refund",
    ADJUSTMENT = "adjustment",
    WRITE_OFF = "write_off",
    BAD_DEBT = "bad_debt"
}
/**
 * Collection status enumeration
 */
export declare enum CollectionStatus {
    CURRENT = "current",
    FIRST_NOTICE = "first_notice",
    SECOND_NOTICE = "second_notice",
    FINAL_NOTICE = "final_notice",
    COLLECTIONS = "collections",
    BAD_DEBT = "bad_debt",
    PAID = "paid",
    WRITTEN_OFF = "written_off"
}
/**
 * Charge capture record
 */
export interface ChargeCapture {
    chargeId: string;
    encounterId: string;
    patientId: string;
    providerId: string;
    serviceDate: Date;
    captureDate: Date;
    procedureCode: string;
    modifiers?: string[];
    units: number;
    chargeAmount: number;
    status: ChargeStatus;
    departmentId?: string;
    locationId?: string;
    diagnosisCodes: string[];
    validationErrors?: string[];
}
/**
 * Charge posting record
 */
export interface ChargePosting {
    postingId: string;
    chargeId: string;
    accountId: string;
    postingDate: Date;
    chargeAmount: number;
    contractualAllowance?: number;
    netCharge: number;
    glAccountCode?: string;
    postedBy: string;
    batchId?: string;
}
/**
 * Payment transaction
 */
export interface PaymentTransaction {
    transactionId: string;
    accountId: string;
    transactionDate: Date;
    paymentType: PaymentType;
    amount: number;
    paymentMethod: 'cash' | 'check' | 'card' | 'ach' | 'wire';
    referenceNumber?: string;
    payerId?: string;
    checkNumber?: string;
    appliedToCharges: ChargePaymentApplication[];
    unappliedAmount?: number;
    notes?: string;
}
/**
 * Charge payment application
 */
export interface ChargePaymentApplication {
    chargeId: string;
    procedureCode: string;
    chargedAmount: number;
    paidAmount: number;
    adjustmentAmount: number;
    patientResponsibility: number;
}
/**
 * Account receivable record
 */
export interface AccountReceivable {
    accountId: string;
    patientId: string;
    guarantorId?: string;
    currentBalance: number;
    insuranceBalance: number;
    patientBalance: number;
    aging0to30: number;
    aging31to60: number;
    aging61to90: number;
    aging91to120: number;
    aging120Plus: number;
    lastPaymentDate?: Date;
    lastPaymentAmount?: number;
    lastStatementDate?: Date;
    collectionStatus: CollectionStatus;
    onPaymentPlan: boolean;
}
/**
 * Adjustment transaction
 */
export interface AdjustmentTransaction {
    adjustmentId: string;
    accountId: string;
    chargeId?: string;
    adjustmentDate: Date;
    adjustmentType: 'contractual' | 'courtesy' | 'administrative' | 'bad_debt' | 'timely_filing';
    amount: number;
    reasonCode: string;
    reasonDescription: string;
    approvedBy?: string;
    glAccountCode?: string;
    reversible: boolean;
}
/**
 * Write-off transaction
 */
export interface WriteOffTransaction {
    writeOffId: string;
    accountId: string;
    chargeId?: string;
    writeOffDate: Date;
    amount: number;
    writeOffReason: 'small_balance' | 'hardship' | 'charity_care' | 'uncollectible' | 'bankruptcy';
    approvalRequired: boolean;
    approvedBy?: string;
    glAccountCode?: string;
}
/**
 * Refund transaction
 */
export interface RefundTransaction {
    refundId: string;
    accountId: string;
    originalTransactionId: string;
    refundDate: Date;
    refundAmount: number;
    refundReason: string;
    refundMethod: 'check' | 'card_reversal' | 'ach';
    payee: string;
    approvedBy: string;
    status: 'pending' | 'approved' | 'issued' | 'cancelled';
}
/**
 * Payment plan
 */
export interface PaymentPlan {
    planId: string;
    accountId: string;
    patientId: string;
    totalAmount: number;
    downPayment: number;
    remainingBalance: number;
    monthlyPayment: number;
    numberOfPayments: number;
    paymentsMade: number;
    startDate: Date;
    nextPaymentDate: Date;
    status: 'active' | 'completed' | 'defaulted' | 'cancelled';
    autoPayEnabled: boolean;
}
/**
 * Collection activity
 */
export interface CollectionActivity {
    activityId: string;
    accountId: string;
    activityDate: Date;
    activityType: 'statement' | 'phone_call' | 'email' | 'letter' | 'text_message';
    description: string;
    performedBy: string;
    notes?: string;
    nextFollowUp?: Date;
}
/**
 * Bad debt account
 */
export interface BadDebtAccount {
    badDebtId: string;
    accountId: string;
    patientId: string;
    badDebtDate: Date;
    originalBalance: number;
    remainingBalance: number;
    agencyName?: string;
    agencyPlacementDate?: Date;
    recoveryAmount: number;
    status: 'placed' | 'active' | 'recovered' | 'recalled' | 'written_off';
}
/**
 * Payer contract
 */
export interface PayerContract {
    contractId: string;
    payerId: string;
    payerName: string;
    contractType: 'fee_for_service' | 'capitated' | 'case_rate' | 'percent_of_charges';
    effectiveDate: Date;
    terminationDate?: Date;
    reimbursementRate: number;
    rateType: 'percentage' | 'fixed' | 'fee_schedule';
    timlyFilingDays: number;
    paymentTermsDays: number;
    status: 'active' | 'expired' | 'terminated';
}
/**
 * Fee schedule entry
 */
export interface FeeScheduleEntry {
    scheduleId: string;
    scheduleName: string;
    procedureCode: string;
    description?: string;
    effectiveDate: Date;
    terminationDate?: Date;
    standardFee: number;
    medicaidFee?: number;
    medicareFee?: number;
    modifierAdjustments?: Record<string, number>;
}
/**
 * Revenue cycle KPI
 */
export interface RevenueCycleKPI {
    kpiId: string;
    calculationDate: Date;
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
    daysInAR: number;
    collectionRate: number;
    denialRate: number;
    cleanClaimRate: number;
    netCollectionRate: number;
    costToCollect: number;
    badDebtPercentage: number;
    patientCollectionRate: number;
}
/**
 * Denial trend analysis
 */
export interface DenialTrendAnalysis {
    analysisId: string;
    analysisPeriod: {
        start: Date;
        end: Date;
    };
    totalDenials: number;
    totalDeniedAmount: number;
    denialRate: number;
    topDenialReasons: Array<{
        reasonCode: string;
        description: string;
        count: number;
        amount: number;
        percentage: number;
    }>;
    topDenialPayers: Array<{
        payerId: string;
        payerName: string;
        denialCount: number;
        denialAmount: number;
    }>;
    overturnedDenials: number;
    recoveredAmount: number;
    overturnRate: number;
}
/**
 * Revenue report
 */
export interface RevenueReport {
    reportId: string;
    reportDate: Date;
    reportPeriod: {
        start: Date;
        end: Date;
    };
    totalCharges: number;
    totalPayments: number;
    totalAdjustments: number;
    netRevenue: number;
    outstandingAR: number;
    insuranceAR: number;
    patientAR: number;
    paymentsByType: Record<PaymentType, number>;
    topProcedures: Array<{
        procedureCode: string;
        volume: number;
        charges: number;
        payments: number;
    }>;
}
/**
 * Reconciliation result
 */
export interface ReconciliationResult {
    reconciliationId: string;
    reconciliationDate: Date;
    periodStart: Date;
    periodEnd: Date;
    expectedDeposits: number;
    actualDeposits: number;
    variance: number;
    reconciled: boolean;
    discrepancies: Array<{
        description: string;
        amount: number;
        resolved: boolean;
    }>;
}
/**
 * 1. Captures charges from encounter or service documentation.
 *
 * @param {object} encounterData - Encounter service information
 * @returns {ChargeCapture} Captured charge record
 *
 * @example
 * ```typescript
 * const charge = captureChargeFromEncounter({
 *   encounterId: 'ENC-123',
 *   patientId: 'PAT-456',
 *   providerId: 'PRV-789',
 *   serviceDate: new Date(),
 *   procedureCode: '99213',
 *   units: 1,
 *   diagnosisCodes: ['E11.9']
 * });
 * ```
 */
export declare function captureChargeFromEncounter(encounterData: Partial<ChargeCapture>): ChargeCapture;
/**
 * 2. Validates charges against fee schedules and payer contracts.
 *
 * @param {ChargeCapture} charge - Charge to validate
 * @param {FeeScheduleEntry[]} feeSchedule - Applicable fee schedule
 * @returns {object} Validation result with expected reimbursement
 *
 * @example
 * ```typescript
 * const validation = validateChargeAgainstFeeSchedule(charge, feeSchedule);
 * if (validation.isValid) {
 *   console.log('Expected reimbursement:', validation.expectedReimbursement);
 * }
 * ```
 */
export declare function validateChargeAgainstFeeSchedule(charge: ChargeCapture, feeSchedule: FeeScheduleEntry[]): {
    isValid: boolean;
    expectedReimbursement?: number;
    standardFee?: number;
    errors: string[];
};
/**
 * 3. Performs automated charge scrubbing and correction.
 *
 * @param {ChargeCapture} charge - Charge to scrub
 * @returns {object} Scrubbed charge with corrections
 *
 * @example
 * ```typescript
 * const { scrubbedCharge, corrections } = scrubCharge(charge);
 * console.log('Applied corrections:', corrections);
 * ```
 */
export declare function scrubCharge(charge: ChargeCapture): {
    scrubbedCharge: ChargeCapture;
    corrections: string[];
};
/**
 * 4. Posts validated charges to patient account.
 *
 * @param {ChargeCapture} charge - Validated charge
 * @param {string} accountId - Patient account ID
 * @returns {ChargePosting} Charge posting record
 *
 * @example
 * ```typescript
 * const posting = postChargeToAccount(validatedCharge, 'ACC-123');
 * await updateAccountBalance(posting);
 * ```
 */
export declare function postChargeToAccount(charge: ChargeCapture, accountId: string): ChargePosting;
/**
 * 5. Calculates charge lag time (service date to posting date).
 *
 * @param {ChargeCapture} charge - Charge record
 * @param {ChargePosting} posting - Posting record
 * @returns {number} Lag time in days
 *
 * @example
 * ```typescript
 * const lagDays = calculateChargeLagTime(charge, posting);
 * if (lagDays > 3) {
 *   console.warn('Charge lag exceeds 3-day target:', lagDays);
 * }
 * ```
 */
export declare function calculateChargeLagTime(charge: ChargeCapture, posting: ChargePosting): number;
/**
 * 6. Generates charge posting batch for bulk operations.
 *
 * @param {ChargeCapture[]} charges - Charges to post
 * @param {string} batchName - Batch identifier
 * @returns {object} Charge posting batch
 *
 * @example
 * ```typescript
 * const batch = generateChargePostingBatch(charges, 'DAILY-BATCH-2024-01-15');
 * await processBatch(batch);
 * ```
 */
export declare function generateChargePostingBatch(charges: ChargeCapture[], batchName: string): {
    batchId: string;
    batchName: string;
    charges: ChargeCapture[];
    totalCharges: number;
    totalAmount: number;
    createdDate: Date;
};
/**
 * 7. Records payment transaction to patient account.
 *
 * @param {object} paymentData - Payment information
 * @returns {PaymentTransaction} Payment transaction record
 *
 * @example
 * ```typescript
 * const payment = recordPaymentTransaction({
 *   accountId: 'ACC-123',
 *   paymentType: PaymentType.PATIENT,
 *   amount: 50.00,
 *   paymentMethod: 'card',
 *   referenceNumber: 'CC-789'
 * });
 * ```
 */
export declare function recordPaymentTransaction(paymentData: Partial<PaymentTransaction>): PaymentTransaction;
/**
 * 8. Applies payment to specific charges with allocation logic.
 *
 * @param {PaymentTransaction} payment - Payment to apply
 * @param {ChargeCapture[]} outstandingCharges - Outstanding charges
 * @returns {PaymentTransaction} Updated payment with allocations
 *
 * @example
 * ```typescript
 * const allocated = applyPaymentToCharges(payment, outstandingCharges);
 * console.log('Unapplied amount:', allocated.unappliedAmount);
 * ```
 */
export declare function applyPaymentToCharges(payment: PaymentTransaction, outstandingCharges: ChargeCapture[]): PaymentTransaction;
/**
 * 9. Reconciles daily deposits with payment transactions.
 *
 * @param {PaymentTransaction[]} payments - Payment transactions for period
 * @param {number} actualDeposit - Actual bank deposit amount
 * @returns {ReconciliationResult} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = reconcileDailyDeposits(payments, 1500.00);
 * if (!reconciliation.reconciled) {
 *   console.error('Variance detected:', reconciliation.variance);
 * }
 * ```
 */
export declare function reconcileDailyDeposits(payments: PaymentTransaction[], actualDeposit: number): ReconciliationResult;
/**
 * 10. Identifies unapplied payments requiring allocation.
 *
 * @param {PaymentTransaction[]} payments - Payment transactions
 * @returns {PaymentTransaction[]} Payments with unapplied amounts
 *
 * @example
 * ```typescript
 * const unapplied = identifyUnappliedPayments(allPayments);
 * unapplied.forEach(payment => {
 *   console.log('Unapplied:', payment.unappliedAmount, 'on', payment.transactionId);
 * });
 * ```
 */
export declare function identifyUnappliedPayments(payments: PaymentTransaction[]): PaymentTransaction[];
/**
 * 11. Processes credit balance refunds.
 *
 * @param {string} accountId - Account with credit balance
 * @param {number} creditAmount - Credit balance amount
 * @returns {RefundTransaction} Refund transaction
 *
 * @example
 * ```typescript
 * const refund = processCreditBalanceRefund('ACC-123', 25.00);
 * await issueRefundCheck(refund);
 * ```
 */
export declare function processCreditBalanceRefund(accountId: string, creditAmount: number): RefundTransaction;
/**
 * 12. Generates payment reconciliation report.
 *
 * @param {PaymentTransaction[]} payments - Payments for period
 * @param {Date} periodStart - Report period start
 * @param {Date} periodEnd - Report period end
 * @returns {object} Payment reconciliation summary
 *
 * @example
 * ```typescript
 * const report = generatePaymentReconciliationReport(payments, startDate, endDate);
 * console.log('Total payments:', report.totalPayments);
 * ```
 */
export declare function generatePaymentReconciliationReport(payments: PaymentTransaction[], periodStart: Date, periodEnd: Date): {
    periodStart: Date;
    periodEnd: Date;
    totalPayments: number;
    paymentsByType: Record<PaymentType, number>;
    paymentsByMethod: Record<string, number>;
    appliedAmount: number;
    unappliedAmount: number;
};
/**
 * 13. Calculates accounts receivable aging buckets.
 *
 * @param {ChargeCapture[]} charges - Outstanding charges
 * @returns {AccountReceivable} A/R summary with aging
 *
 * @example
 * ```typescript
 * const ar = calculateAccountsReceivableAging(outstandingCharges);
 * console.log('Total A/R:', ar.currentBalance);
 * console.log('Over 90 days:', ar.aging91to120 + ar.aging120Plus);
 * ```
 */
export declare function calculateAccountsReceivableAging(charges: ChargeCapture[]): AccountReceivable;
/**
 * 14. Calculates days in A/R (average collection period).
 *
 * @param {number} totalAR - Total accounts receivable
 * @param {number} averageDailyCharges - Average daily charge volume
 * @returns {number} Days in A/R
 *
 * @example
 * ```typescript
 * const daysInAR = calculateDaysInAR(50000, 2000);
 * console.log('Days in A/R:', daysInAR);
 * // Target: < 45 days
 * ```
 */
export declare function calculateDaysInAR(totalAR: number, averageDailyCharges: number): number;
/**
 * 15. Identifies accounts requiring escalation based on aging.
 *
 * @param {AccountReceivable[]} accounts - A/R accounts
 * @param {number} agingThresholdDays - Days threshold for escalation
 * @returns {AccountReceivable[]} Accounts requiring escalation
 *
 * @example
 * ```typescript
 * const escalate = identifyAccountsForEscalation(accounts, 90);
 * escalate.forEach(account => {
 *   console.log('Escalate account:', account.accountId);
 * });
 * ```
 */
export declare function identifyAccountsForEscalation(accounts: AccountReceivable[], agingThresholdDays: number): AccountReceivable[];
/**
 * 16. Generates A/R aging report by payer.
 *
 * @param {Array<{payerId: string; payerName: string; charges: ChargeCapture[]}>} payerData - A/R by payer
 * @returns {object} A/R aging report
 *
 * @example
 * ```typescript
 * const report = generateARAgingByPayer(payerCharges);
 * report.payerAging.forEach(payer => {
 *   console.log(payer.payerName, 'Total:', payer.totalAR);
 * });
 * ```
 */
export declare function generateARAgingByPayer(payerData: Array<{
    payerId: string;
    payerName: string;
    charges: ChargeCapture[];
}>): {
    reportDate: Date;
    totalAR: number;
    payerAging: Array<{
        payerId: string;
        payerName: string;
        totalAR: number;
        aging0to30: number;
        aging31to60: number;
        aging61to90: number;
        aging91to120: number;
        aging120Plus: number;
    }>;
};
/**
 * 17. Calculates collection effectiveness index (CEI).
 *
 * @param {number} paymentsCollected - Payments collected in period
 * @param {number} totalCharges - Total charges in period
 * @param {number} beginningAR - A/R at period start
 * @param {number} endingAR - A/R at period end
 * @returns {number} CEI percentage
 *
 * @example
 * ```typescript
 * const cei = calculateCollectionEffectivenessIndex(95000, 100000, 50000, 55000);
 * console.log('Collection effectiveness:', cei + '%');
 * // Target: > 95%
 * ```
 */
export declare function calculateCollectionEffectivenessIndex(paymentsCollected: number, totalCharges: number, beginningAR: number, endingAR: number): number;
/**
 * 18. Monitors high-value accounts for priority follow-up.
 *
 * @param {AccountReceivable[]} accounts - A/R accounts
 * @param {number} highValueThreshold - Dollar threshold
 * @returns {AccountReceivable[]} High-value accounts
 *
 * @example
 * ```typescript
 * const highValue = monitorHighValueAccounts(accounts, 5000);
 * highValue.forEach(account => {
 *   console.log('Priority account:', account.accountId, account.currentBalance);
 * });
 * ```
 */
export declare function monitorHighValueAccounts(accounts: AccountReceivable[], highValueThreshold: number): AccountReceivable[];
/**
 * 19. Processes contractual adjustment from payer contract.
 *
 * @param {number} chargedAmount - Original charge amount
 * @param {number} allowedAmount - Payer-allowed amount
 * @param {string} accountId - Account ID
 * @returns {AdjustmentTransaction} Contractual adjustment
 *
 * @example
 * ```typescript
 * const adjustment = processContractualAdjustment(150.00, 120.00, 'ACC-123');
 * await postAdjustmentToAccount(adjustment);
 * ```
 */
export declare function processContractualAdjustment(chargedAmount: number, allowedAmount: number, accountId: string): AdjustmentTransaction;
/**
 * 20. Processes small balance write-off.
 *
 * @param {number} balance - Account balance
 * @param {number} threshold - Small balance threshold
 * @param {string} accountId - Account ID
 * @returns {WriteOffTransaction | null} Write-off if balance below threshold
 *
 * @example
 * ```typescript
 * const writeOff = processSmallBalanceWriteOff(4.50, 5.00, 'ACC-123');
 * if (writeOff) {
 *   await postWriteOffToAccount(writeOff);
 * }
 * ```
 */
export declare function processSmallBalanceWriteOff(balance: number, threshold: number, accountId: string): WriteOffTransaction | null;
/**
 * 21. Processes charity care write-off with approval workflow.
 *
 * @param {object} charityCareData - Charity care application
 * @returns {WriteOffTransaction} Charity care write-off
 *
 * @example
 * ```typescript
 * const writeOff = processCharityCareWriteOff({
 *   accountId: 'ACC-123',
 *   amount: 500.00,
 *   approvedBy: 'MANAGER-456'
 * });
 * ```
 */
export declare function processCharityCareWriteOff(charityCareData: {
    accountId: string;
    amount: number;
    approvedBy: string;
}): WriteOffTransaction;
/**
 * 22. Processes bad debt write-off after collection efforts exhausted.
 *
 * @param {string} accountId - Account ID
 * @param {number} amount - Bad debt amount
 * @returns {WriteOffTransaction} Bad debt write-off
 *
 * @example
 * ```typescript
 * const writeOff = processBadDebtWriteOff('ACC-123', 750.00);
 * await transferToCollections(accountId);
 * ```
 */
export declare function processBadDebtWriteOff(accountId: string, amount: number): WriteOffTransaction;
/**
 * 23. Reverses adjustment or write-off transaction.
 *
 * @param {AdjustmentTransaction | WriteOffTransaction} transaction - Transaction to reverse
 * @returns {AdjustmentTransaction} Reversal transaction
 *
 * @example
 * ```typescript
 * const reversal = reverseAdjustmentTransaction(originalAdjustment);
 * await postReversalToAccount(reversal);
 * ```
 */
export declare function reverseAdjustmentTransaction(transaction: AdjustmentTransaction | WriteOffTransaction): AdjustmentTransaction;
/**
 * 24. Calculates total adjustments by type for reporting.
 *
 * @param {AdjustmentTransaction[]} adjustments - Adjustment transactions
 * @returns {object} Adjustment summary by type
 *
 * @example
 * ```typescript
 * const summary = calculateAdjustmentSummary(adjustments);
 * console.log('Contractual adjustments:', summary.contractual);
 * console.log('Total adjustments:', summary.total);
 * ```
 */
export declare function calculateAdjustmentSummary(adjustments: AdjustmentTransaction[]): {
    contractual: number;
    courtesy: number;
    administrative: number;
    badDebt: number;
    timelyFiling: number;
    total: number;
};
/**
 * 25. Creates patient payment plan.
 *
 * @param {object} planData - Payment plan parameters
 * @returns {PaymentPlan} Created payment plan
 *
 * @example
 * ```typescript
 * const plan = createPatientPaymentPlan({
 *   accountId: 'ACC-123',
 *   patientId: 'PAT-456',
 *   totalAmount: 1200.00,
 *   downPayment: 200.00,
 *   numberOfPayments: 10
 * });
 * ```
 */
export declare function createPatientPaymentPlan(planData: {
    accountId: string;
    patientId: string;
    totalAmount: number;
    downPayment: number;
    numberOfPayments: number;
}): PaymentPlan;
/**
 * 26. Processes payment plan installment.
 *
 * @param {PaymentPlan} plan - Active payment plan
 * @param {number} paymentAmount - Installment payment amount
 * @returns {PaymentPlan} Updated payment plan
 *
 * @example
 * ```typescript
 * const updated = processPaymentPlanInstallment(plan, 120.00);
 * if (updated.status === 'completed') {
 *   console.log('Payment plan completed!');
 * }
 * ```
 */
export declare function processPaymentPlanInstallment(plan: PaymentPlan, paymentAmount: number): PaymentPlan;
/**
 * 27. Initiates collection workflow for delinquent account.
 *
 * @param {AccountReceivable} account - Delinquent account
 * @returns {CollectionActivity} Initial collection activity
 *
 * @example
 * ```typescript
 * const activity = initiateCollectionWorkflow(delinquentAccount);
 * await sendCollectionNotice(activity);
 * ```
 */
export declare function initiateCollectionWorkflow(account: AccountReceivable): CollectionActivity;
/**
 * 28. Escalates collection status based on aging and payment history.
 *
 * @param {AccountReceivable} account - Account to escalate
 * @returns {AccountReceivable} Updated account with new collection status
 *
 * @example
 * ```typescript
 * const escalated = escalateCollectionStatus(account);
 * console.log('New status:', escalated.collectionStatus);
 * ```
 */
export declare function escalateCollectionStatus(account: AccountReceivable): AccountReceivable;
/**
 * 29. Places account with external collection agency.
 *
 * @param {AccountReceivable} account - Account to place
 * @param {string} agencyName - Collection agency name
 * @returns {BadDebtAccount} Bad debt account record
 *
 * @example
 * ```typescript
 * const badDebt = placeAccountWithCollectionAgency(account, 'ABC Collections');
 * await transferAccountData(badDebt);
 * ```
 */
export declare function placeAccountWithCollectionAgency(account: AccountReceivable, agencyName: string): BadDebtAccount;
/**
 * 30. Generates collection effectiveness report.
 *
 * @param {CollectionActivity[]} activities - Collection activities
 * @param {number} totalCollected - Total amount collected
 * @param {number} totalDelinquent - Total delinquent amount
 * @returns {object} Collection effectiveness metrics
 *
 * @example
 * ```typescript
 * const report = generateCollectionEffectivenessReport(activities, 5000, 10000);
 * console.log('Collection rate:', report.collectionRate);
 * ```
 */
export declare function generateCollectionEffectivenessReport(activities: CollectionActivity[], totalCollected: number, totalDelinquent: number): {
    totalActivities: number;
    activitiesByType: Record<string, number>;
    collectionRate: number;
    averageTimeToCollect: number;
};
/**
 * 31. Calculates net collection rate.
 *
 * @param {number} paymentsCollected - Total payments collected
 * @param {number} chargesBooked - Total charges booked
 * @param {number} contractualAdjustments - Total contractual adjustments
 * @returns {number} Net collection rate percentage
 *
 * @example
 * ```typescript
 * const ncr = calculateNetCollectionRate(95000, 100000, 10000);
 * console.log('Net collection rate:', ncr + '%');
 * // Target: > 95%
 * ```
 */
export declare function calculateNetCollectionRate(paymentsCollected: number, chargesBooked: number, contractualAdjustments: number): number;
/**
 * 32. Generates comprehensive revenue cycle KPI dashboard.
 *
 * @param {object} metricData - Revenue cycle metrics
 * @returns {RevenueCycleKPI} KPI dashboard data
 *
 * @example
 * ```typescript
 * const kpis = generateRevenueCycleKPIs({
 *   totalAR: 50000,
 *   averageDailyCharges: 2000,
 *   paymentsCollected: 95000,
 *   chargesBooked: 100000,
 *   denials: 50,
 *   totalClaims: 1000
 * });
 * ```
 */
export declare function generateRevenueCycleKPIs(metricData: {
    totalAR: number;
    averageDailyCharges: number;
    paymentsCollected: number;
    chargesBooked: number;
    contractualAdjustments: number;
    denials: number;
    totalClaims: number;
    badDebtAmount: number;
    costToCollect: number;
}): RevenueCycleKPI;
/**
 * 33. Analyzes denial trends and identifies root causes.
 *
 * @param {Array<{denialReason: string; amount: number; payerId: string}>} denials - Denial data
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @returns {DenialTrendAnalysis} Denial trend analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeDenialTrends(denialData, startDate, endDate);
 * console.log('Top denial reason:', analysis.topDenialReasons[0]);
 * ```
 */
export declare function analyzeDenialTrends(denials: Array<{
    denialReason: string;
    denialReasonCode: string;
    amount: number;
    payerId: string;
    payerName: string;
}>, periodStart: Date, periodEnd: Date): DenialTrendAnalysis;
/**
 * 34. Generates comprehensive revenue report.
 *
 * @param {object} reportData - Revenue data
 * @param {Date} periodStart - Report period start
 * @param {Date} periodEnd - Report period end
 * @returns {RevenueReport} Revenue report
 *
 * @example
 * ```typescript
 * const report = generateRevenueReport(revenueData, startDate, endDate);
 * console.log('Net revenue:', report.netRevenue);
 * console.log('Outstanding A/R:', report.outstandingAR);
 * ```
 */
export declare function generateRevenueReport(reportData: {
    charges: ChargeCapture[];
    payments: PaymentTransaction[];
    adjustments: AdjustmentTransaction[];
    outstandingAR: AccountReceivable[];
}, periodStart: Date, periodEnd: Date): RevenueReport;
/**
 * 35. Calculates cost to collect ratio.
 *
 * @param {number} collectionCosts - Total collection operational costs
 * @param {number} paymentsCollected - Total payments collected
 * @returns {number} Cost to collect percentage
 *
 * @example
 * ```typescript
 * const costToCollect = calculateCostToCollect(5000, 100000);
 * console.log('Cost to collect:', costToCollect + '%');
 * // Target: < 3%
 * ```
 */
export declare function calculateCostToCollect(collectionCosts: number, paymentsCollected: number): number;
/**
 * 36. Generates provider productivity report.
 *
 * @param {Array<{providerId: string; charges: ChargeCapture[]}>} providerData - Provider charge data
 * @returns {object} Provider productivity metrics
 *
 * @example
 * ```typescript
 * const productivity = generateProviderProductivityReport(providerCharges);
 * productivity.providers.forEach(p => {
 *   console.log(p.providerId, 'RVUs:', p.totalRVUs);
 * });
 * ```
 */
export declare function generateProviderProductivityReport(providerData: Array<{
    providerId: string;
    providerName?: string;
    charges: ChargeCapture[];
}>): {
    reportDate: Date;
    providers: Array<{
        providerId: string;
        providerName?: string;
        totalCharges: number;
        totalVolume: number;
        totalRVUs: number;
        averageChargePerEncounter: number;
    }>;
};
/**
 * 37. Creates payer contract with reimbursement terms.
 *
 * @param {object} contractData - Contract information
 * @returns {PayerContract} Payer contract record
 *
 * @example
 * ```typescript
 * const contract = createPayerContract({
 *   payerId: 'BCBS001',
 *   payerName: 'Blue Cross Blue Shield',
 *   contractType: 'fee_for_service',
 *   reimbursementRate: 80,
 *   rateType: 'percentage',
 *   effectiveDate: new Date('2024-01-01')
 * });
 * ```
 */
export declare function createPayerContract(contractData: Partial<PayerContract>): PayerContract;
/**
 * 38. Calculates expected reimbursement based on contract.
 *
 * @param {number} chargedAmount - Charged amount
 * @param {PayerContract} contract - Payer contract
 * @returns {number} Expected reimbursement
 *
 * @example
 * ```typescript
 * const expected = calculateContractReimbursement(150.00, payerContract);
 * console.log('Expected payment:', expected);
 * ```
 */
export declare function calculateContractReimbursement(chargedAmount: number, contract: PayerContract): number;
/**
 * 39. Updates fee schedule with new pricing.
 *
 * @param {object} feeData - Fee schedule entry data
 * @returns {FeeScheduleEntry} Fee schedule entry
 *
 * @example
 * ```typescript
 * const fee = updateFeeSchedule({
 *   scheduleName: 'Standard 2024',
 *   procedureCode: '99213',
 *   standardFee: 155.00,
 *   effectiveDate: new Date('2024-01-01')
 * });
 * ```
 */
export declare function updateFeeSchedule(feeData: Partial<FeeScheduleEntry>): FeeScheduleEntry;
/**
 * 40. Validates contract is active for service date.
 *
 * @param {PayerContract} contract - Payer contract
 * @param {Date} serviceDate - Service date
 * @returns {boolean} True if contract is active
 *
 * @example
 * ```typescript
 * if (!validateContractActive(contract, serviceDate)) {
 *   console.error('Contract not active for service date');
 * }
 * ```
 */
export declare function validateContractActive(contract: PayerContract, serviceDate: Date): boolean;
/**
 * 41. Analyzes contract performance and reimbursement rates.
 *
 * @param {PayerContract} contract - Payer contract
 * @param {Array<{chargedAmount: number; paidAmount: number}>} claims - Claims under contract
 * @returns {object} Contract performance metrics
 *
 * @example
 * ```typescript
 * const performance = analyzeContractPerformance(contract, claimData);
 * console.log('Actual reimbursement rate:', performance.actualRate);
 * ```
 */
export declare function analyzeContractPerformance(contract: PayerContract, claims: Array<{
    chargedAmount: number;
    paidAmount: number;
}>): {
    contractId: string;
    totalClaims: number;
    totalCharged: number;
    totalPaid: number;
    expectedRate: number;
    actualRate: number;
    variance: number;
};
/**
 * 42. Identifies underpayments based on contract terms.
 *
 * @param {Array<{chargedAmount: number; paidAmount: number; contractId: string}>} payments - Payment data
 * @param {PayerContract[]} contracts - Payer contracts
 * @returns {Array<{chargedAmount: number; paidAmount: number; expectedAmount: number; variance: number}>} Underpayments
 *
 * @example
 * ```typescript
 * const underpayments = identifyContractUnderpayments(payments, contracts);
 * underpayments.forEach(up => {
 *   console.log('Underpaid by:', up.variance);
 * });
 * ```
 */
export declare function identifyContractUnderpayments(payments: Array<{
    chargedAmount: number;
    paidAmount: number;
    contractId: string;
}>, contracts: PayerContract[]): Array<{
    chargedAmount: number;
    paidAmount: number;
    expectedAmount: number;
    variance: number;
}>;
/**
 * 43. Generates contract compliance report.
 *
 * @param {PayerContract[]} contracts - Active contracts
 * @param {Array<{contractId: string; claims: any[]}>} contractClaims - Claims by contract
 * @returns {object} Contract compliance summary
 *
 * @example
 * ```typescript
 * const compliance = generateContractComplianceReport(contracts, claimData);
 * console.log('Contracts in compliance:', compliance.compliantCount);
 * ```
 */
export declare function generateContractComplianceReport(contracts: PayerContract[], contractClaims: Array<{
    contractId: string;
    claims: Array<{
        chargedAmount: number;
        paidAmount: number;
    }>;
}>): {
    reportDate: Date;
    totalContracts: number;
    compliantCount: number;
    underperformingCount: number;
    contractDetails: Array<{
        contractId: string;
        payerName: string;
        expectedRate: number;
        actualRate: number;
        compliant: boolean;
    }>;
};
declare const _default: {
    captureChargeFromEncounter: typeof captureChargeFromEncounter;
    validateChargeAgainstFeeSchedule: typeof validateChargeAgainstFeeSchedule;
    scrubCharge: typeof scrubCharge;
    postChargeToAccount: typeof postChargeToAccount;
    calculateChargeLagTime: typeof calculateChargeLagTime;
    generateChargePostingBatch: typeof generateChargePostingBatch;
    recordPaymentTransaction: typeof recordPaymentTransaction;
    applyPaymentToCharges: typeof applyPaymentToCharges;
    reconcileDailyDeposits: typeof reconcileDailyDeposits;
    identifyUnappliedPayments: typeof identifyUnappliedPayments;
    processCreditBalanceRefund: typeof processCreditBalanceRefund;
    generatePaymentReconciliationReport: typeof generatePaymentReconciliationReport;
    calculateAccountsReceivableAging: typeof calculateAccountsReceivableAging;
    calculateDaysInAR: typeof calculateDaysInAR;
    identifyAccountsForEscalation: typeof identifyAccountsForEscalation;
    generateARAgingByPayer: typeof generateARAgingByPayer;
    calculateCollectionEffectivenessIndex: typeof calculateCollectionEffectivenessIndex;
    monitorHighValueAccounts: typeof monitorHighValueAccounts;
    processContractualAdjustment: typeof processContractualAdjustment;
    processSmallBalanceWriteOff: typeof processSmallBalanceWriteOff;
    processCharityCareWriteOff: typeof processCharityCareWriteOff;
    processBadDebtWriteOff: typeof processBadDebtWriteOff;
    reverseAdjustmentTransaction: typeof reverseAdjustmentTransaction;
    calculateAdjustmentSummary: typeof calculateAdjustmentSummary;
    createPatientPaymentPlan: typeof createPatientPaymentPlan;
    processPaymentPlanInstallment: typeof processPaymentPlanInstallment;
    initiateCollectionWorkflow: typeof initiateCollectionWorkflow;
    escalateCollectionStatus: typeof escalateCollectionStatus;
    placeAccountWithCollectionAgency: typeof placeAccountWithCollectionAgency;
    generateCollectionEffectivenessReport: typeof generateCollectionEffectivenessReport;
    calculateNetCollectionRate: typeof calculateNetCollectionRate;
    generateRevenueCycleKPIs: typeof generateRevenueCycleKPIs;
    analyzeDenialTrends: typeof analyzeDenialTrends;
    generateRevenueReport: typeof generateRevenueReport;
    calculateCostToCollect: typeof calculateCostToCollect;
    generateProviderProductivityReport: typeof generateProviderProductivityReport;
    createPayerContract: typeof createPayerContract;
    calculateContractReimbursement: typeof calculateContractReimbursement;
    updateFeeSchedule: typeof updateFeeSchedule;
    validateContractActive: typeof validateContractActive;
    analyzeContractPerformance: typeof analyzeContractPerformance;
    identifyContractUnderpayments: typeof identifyContractUnderpayments;
    generateContractComplianceReport: typeof generateContractComplianceReport;
};
export default _default;
//# sourceMappingURL=health-revenue-cycle-kit.d.ts.map