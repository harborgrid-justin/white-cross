/**
 * LOC: PAYPRO001
 * File: /reuse/edwards/financial/payment-processing-collections-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./invoice-management-matching-kit (Invoice data for payment processing)
 *
 * DOWNSTREAM (imported by):
 *   - Backend payment modules
 *   - ACH processing services
 *   - Payment reconciliation services
 *   - Treasury management modules
 */
/**
 * File: /reuse/edwards/financial/payment-processing-collections-kit.ts
 * Locator: WC-EDWARDS-PAYPRO-001
 * Purpose: Comprehensive Payment Processing & Collections - JD Edwards EnterpriseOne-level payment runs, ACH, wire transfers, check processing, payment reconciliation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, invoice-management-matching-kit
 * Downstream: ../backend/payments/*, ACH Processing Services, Wire Transfer Services, Check Processing, Payment Reconciliation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for payment runs, ACH processing, wire transfers, check processing, electronic payments, payment scheduling, payment cancellation, void/reissue, positive pay, payment reconciliation
 *
 * LLM Context: Enterprise-grade payment processing for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive payment run management, ACH/NACHA file generation, wire transfer processing, check printing,
 * electronic payment processing, payment scheduling, payment cancellation, void and reissue workflows, positive pay file generation,
 * payment reconciliation, multi-currency payments, payment approval workflows, payment method management, payment holds,
 * payment reversals, payment audit trails, and bank integration.
 */
import { Sequelize, Transaction } from 'sequelize';
interface PaymentMethod {
    paymentMethodId: number;
    methodCode: string;
    methodName: string;
    methodType: 'ACH' | 'Wire' | 'Check' | 'EFT' | 'Credit_Card' | 'Virtual_Card' | 'Electronic';
    bankAccountId: number;
    isActive: boolean;
    requiresApproval: boolean;
    approvalThreshold: number;
    defaultProcessingDays: number;
    configuration: Record<string, any>;
}
interface BankAccount {
    bankAccountId: number;
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string;
    routingNumber: string;
    swiftCode?: string;
    iban?: string;
    currency: string;
    accountType: 'checking' | 'savings' | 'money_market';
    isActive: boolean;
    balance: number;
    availableBalance: number;
}
export declare class CreatePaymentRunDto {
    runDate: Date;
    scheduledDate: Date;
    paymentMethodId: number;
    bankAccountId: number;
    currency: string;
    invoiceIds: number[];
}
export declare class CreatePaymentDto {
    paymentDate: Date;
    paymentMethodId: number;
    supplierId: number;
    supplierSiteId: number;
    bankAccountId: number;
    amount: number;
    currency: string;
    invoiceAllocations: {
        invoiceId: number;
        amount: number;
        discountAmount?: number;
    }[];
}
export declare class ProcessACHBatchDto {
    paymentRunId: number;
    effectiveDate: Date;
    originatorId: string;
    originatorName: string;
}
export declare class CreateWireTransferDto {
    paymentId: number;
    wireType: string;
    beneficiaryName: string;
    beneficiaryAccountNumber: string;
    beneficiaryBankName: string;
    beneficiaryBankSwift?: string;
    beneficiaryBankABA?: string;
    instructions: string;
}
export declare class VoidPaymentDto {
    paymentId: number;
    voidReason: string;
    voidDate: Date;
    reissuePayment: boolean;
}
export declare class ReconcilePaymentDto {
    paymentId: number;
    bankStatementId: number;
    clearedDate: Date;
    clearedAmount: number;
}
export declare class ApprovePaymentDto {
    paymentId: number;
    approvalLevel: number;
    comments?: string;
}
export declare class CreatePaymentScheduleDto {
    scheduleName: string;
    scheduleType: string;
    frequency: string;
    startDate: Date;
    endDate?: Date;
    paymentMethodId: number;
    bankAccountId: number;
}
/**
 * Sequelize model for Payment Runs with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PaymentRun model
 *
 * @example
 * ```typescript
 * const PaymentRun = createPaymentRunModel(sequelize);
 * const run = await PaymentRun.create({
 *   runNumber: 'PR-2024-001',
 *   runDate: new Date(),
 *   paymentMethodId: 1,
 *   status: 'draft'
 * });
 * ```
 */
export declare const createPaymentRunModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        runNumber: string;
        runDate: Date;
        scheduledDate: Date;
        paymentMethodId: number;
        paymentMethodType: string;
        bankAccountId: number;
        status: string;
        invoiceCount: number;
        totalAmount: number;
        currency: string;
        paymentCount: number;
        createdBy: string;
        approvedBy: string | null;
        approvedAt: Date | null;
        transmittedAt: Date | null;
        completedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Payments with multi-currency support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Payment model
 *
 * @example
 * ```typescript
 * const Payment = createPaymentModel(sequelize);
 * const payment = await Payment.create({
 *   paymentNumber: 'PAY-2024-001',
 *   paymentDate: new Date(),
 *   supplierId: 100,
 *   amount: 5000.00,
 *   status: 'draft'
 * });
 * ```
 */
export declare const createPaymentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        paymentNumber: string;
        paymentRunId: number | null;
        paymentDate: Date;
        paymentMethodId: number;
        paymentMethodType: string;
        supplierId: number;
        supplierName: string;
        supplierSiteId: number;
        bankAccountId: number;
        amount: number;
        currency: string;
        exchangeRate: number;
        baseAmount: number;
        status: string;
        checkNumber: string | null;
        referenceNumber: string;
        description: string;
        invoiceCount: number;
        approvalStatus: string;
        clearedDate: Date | null;
        voidDate: Date | null;
        voidReason: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for ACH Batches with NACHA compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ACHBatch model
 *
 * @example
 * ```typescript
 * const ACHBatch = createACHBatchModel(sequelize);
 * const batch = await ACHBatch.create({
 *   batchNumber: 'ACH-2024-001',
 *   originatorId: 'COMP001',
 *   effectiveDate: new Date()
 * });
 * ```
 */
export declare const createACHBatchModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        batchNumber: string;
        fileCreationDate: Date;
        fileCreationTime: string;
        originatorId: string;
        originatorName: string;
        batchCount: number;
        entryCount: number;
        totalDebit: number;
        totalCredit: number;
        effectiveDate: Date;
        fileContent: string;
        fileName: string;
        status: string;
        transmittedAt: Date | null;
        settledAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new payment run for batch payment processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePaymentRunDto} runData - Payment run data
 * @param {string} userId - User creating the run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created payment run
 *
 * @example
 * ```typescript
 * const run = await createPaymentRun(sequelize, {
 *   runDate: new Date(),
 *   scheduledDate: new Date('2024-01-20'),
 *   paymentMethodId: 1,
 *   bankAccountId: 5,
 *   currency: 'USD',
 *   invoiceIds: [101, 102, 103]
 * }, 'user123');
 * ```
 */
export declare const createPaymentRun: (sequelize: Sequelize, runData: CreatePaymentRunDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates a unique payment run number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} runDate - Run date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated run number
 *
 * @example
 * ```typescript
 * const runNumber = await generatePaymentRunNumber(sequelize, new Date());
 * // Returns: 'PR-2024-001'
 * ```
 */
export declare const generatePaymentRunNumber: (sequelize: Sequelize, runDate: Date, transaction?: Transaction) => Promise<string>;
/**
 * Retrieves payment method details by ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentMethodId - Payment method ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PaymentMethod>} Payment method details
 *
 * @example
 * ```typescript
 * const method = await getPaymentMethod(sequelize, 1);
 * console.log(method.methodType); // 'ACH'
 * ```
 */
export declare const getPaymentMethod: (sequelize: Sequelize, paymentMethodId: number, transaction?: Transaction) => Promise<PaymentMethod>;
/**
 * Calculates payment run totals from invoice list.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number[]} invoiceIds - Invoice IDs
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{invoiceCount: number; totalAmount: number}>} Totals
 *
 * @example
 * ```typescript
 * const totals = await calculatePaymentRunTotals(sequelize, [101, 102, 103]);
 * console.log(totals.totalAmount); // 15000.00
 * ```
 */
export declare const calculatePaymentRunTotals: (sequelize: Sequelize, invoiceIds: number[], transaction?: Transaction) => Promise<{
    invoiceCount: number;
    totalAmount: number;
}>;
/**
 * Approves a payment run for processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentRunId - Payment run ID
 * @param {string} userId - User approving the run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved payment run
 *
 * @example
 * ```typescript
 * const approved = await approvePaymentRun(sequelize, 1, 'manager123');
 * ```
 */
export declare const approvePaymentRun: (sequelize: Sequelize, paymentRunId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates individual payments from a payment run.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentRunId - Payment run ID
 * @param {string} userId - User creating payments
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created payments
 *
 * @example
 * ```typescript
 * const payments = await createPaymentsFromRun(sequelize, 1, 'user123');
 * console.log(payments.length); // 5
 * ```
 */
export declare const createPaymentsFromRun: (sequelize: Sequelize, paymentRunId: number, userId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * Generates a unique payment number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} paymentDate - Payment date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated payment number
 *
 * @example
 * ```typescript
 * const paymentNumber = await generatePaymentNumber(sequelize, new Date());
 * // Returns: 'PAY-2024-001'
 * ```
 */
export declare const generatePaymentNumber: (sequelize: Sequelize, paymentDate: Date, transaction?: Transaction) => Promise<string>;
/**
 * Processes ACH batch for electronic payment transmission.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessACHBatchDto} batchData - ACH batch data
 * @param {string} userId - User processing the batch
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created ACH batch
 *
 * @example
 * ```typescript
 * const batch = await processACHBatch(sequelize, {
 *   paymentRunId: 1,
 *   effectiveDate: new Date('2024-01-20'),
 *   originatorId: 'COMP001',
 *   originatorName: 'Company Name Inc'
 * }, 'user123');
 * ```
 */
export declare const processACHBatch: (sequelize: Sequelize, batchData: ProcessACHBatchDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates ACH batch number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated batch number
 *
 * @example
 * ```typescript
 * const batchNumber = await generateACHBatchNumber(sequelize);
 * // Returns: 'ACH-2024-001'
 * ```
 */
export declare const generateACHBatchNumber: (sequelize: Sequelize, transaction?: Transaction) => Promise<string>;
/**
 * Generates NACHA formatted ACH file content.
 *
 * @param {any[]} payments - Payments to include
 * @param {string} originatorId - Originator company ID
 * @param {string} originatorName - Originator company name
 * @param {Date} effectiveDate - Effective entry date
 * @returns {Promise<string>} NACHA file content
 *
 * @example
 * ```typescript
 * const content = await generateNACHAFile(payments, 'COMP001', 'Company Inc', new Date());
 * ```
 */
export declare const generateNACHAFile: (payments: any[], originatorId: string, originatorName: string, effectiveDate: Date) => Promise<string>;
/**
 * Validates ACH batch before transmission.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} achBatchId - ACH batch ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{isValid: boolean; errors: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateACHBatch(sequelize, 1);
 * if (!validation.isValid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
export declare const validateACHBatch: (sequelize: Sequelize, achBatchId: number, transaction?: Transaction) => Promise<{
    isValid: boolean;
    errors: string[];
}>;
/**
 * Transmits ACH batch to bank.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} achBatchId - ACH batch ID
 * @param {string} userId - User transmitting the batch
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transmitted ACH batch
 *
 * @example
 * ```typescript
 * const transmitted = await transmitACHBatch(sequelize, 1, 'user123');
 * ```
 */
export declare const transmitACHBatch: (sequelize: Sequelize, achBatchId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates a wire transfer for payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateWireTransferDto} wireData - Wire transfer data
 * @param {string} userId - User creating the wire
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created wire transfer
 *
 * @example
 * ```typescript
 * const wire = await createWireTransfer(sequelize, {
 *   paymentId: 1,
 *   wireType: 'Domestic',
 *   beneficiaryName: 'Supplier Inc',
 *   beneficiaryAccountNumber: '123456789',
 *   beneficiaryBankName: 'Bank of America',
 *   beneficiaryBankABA: '026009593',
 *   instructions: 'Payment for invoice 12345'
 * }, 'user123');
 * ```
 */
export declare const createWireTransfer: (sequelize: Sequelize, wireData: CreateWireTransferDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Processes check run for check printing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentRunId - Payment run ID
 * @param {string} startingCheckNumber - Starting check number
 * @param {string} userId - User processing the check run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created check run
 *
 * @example
 * ```typescript
 * const checkRun = await processCheckRun(sequelize, 1, '100001', 'user123');
 * ```
 */
export declare const processCheckRun: (sequelize: Sequelize, paymentRunId: number, startingCheckNumber: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates check run number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated check run number
 *
 * @example
 * ```typescript
 * const runNumber = await generateCheckRunNumber(sequelize);
 * // Returns: 'CHK-2024-001'
 * ```
 */
export declare const generateCheckRunNumber: (sequelize: Sequelize, transaction?: Transaction) => Promise<string>;
/**
 * Prints individual check for payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} checkNumber - Check number
 * @param {number} checkRunId - Check run ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created check
 *
 * @example
 * ```typescript
 * const check = await printCheck(sequelize, 1, '100001', 5);
 * ```
 */
export declare const printCheck: (sequelize: Sequelize, paymentId: number, checkNumber: string, checkRunId: number, transaction?: Transaction) => Promise<any>;
/**
 * Converts numeric amount to words for check printing.
 *
 * @param {number} amount - Amount to convert
 * @returns {string} Amount in words
 *
 * @example
 * ```typescript
 * const words = convertAmountToWords(1234.56);
 * // Returns: 'One Thousand Two Hundred Thirty Four and 56/100'
 * ```
 */
export declare const convertAmountToWords: (amount: number) => string;
/**
 * Voids a payment and optionally reissues it.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {VoidPaymentDto} voidData - Void payment data
 * @param {string} userId - User voiding the payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Voided payment
 *
 * @example
 * ```typescript
 * const voided = await voidPayment(sequelize, {
 *   paymentId: 1,
 *   voidReason: 'Incorrect amount',
 *   voidDate: new Date(),
 *   reissuePayment: true
 * }, 'user123');
 * ```
 */
export declare const voidPayment: (sequelize: Sequelize, voidData: VoidPaymentDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Reconciles a payment with bank statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ReconcilePaymentDto} reconData - Reconciliation data
 * @param {string} userId - User reconciling the payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment reconciliation record
 *
 * @example
 * ```typescript
 * const recon = await reconcilePayment(sequelize, {
 *   paymentId: 1,
 *   bankStatementId: 10,
 *   clearedDate: new Date(),
 *   clearedAmount: 5000.00
 * }, 'user123');
 * ```
 */
export declare const reconcilePayment: (sequelize: Sequelize, reconData: ReconcilePaymentDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates positive pay file for bank fraud prevention.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {Date} fileDate - File date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Positive pay file
 *
 * @example
 * ```typescript
 * const posPayFile = await generatePositivePayFile(sequelize, 1, new Date());
 * ```
 */
export declare const generatePositivePayFile: (sequelize: Sequelize, bankAccountId: number, fileDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Places a hold on a payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} holdType - Hold type
 * @param {string} holdReason - Hold reason
 * @param {string} userId - User placing the hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment hold record
 *
 * @example
 * ```typescript
 * const hold = await placePaymentHold(sequelize, 1, 'manual', 'Pending verification', 'user123');
 * ```
 */
export declare const placePaymentHold: (sequelize: Sequelize, paymentId: number, holdType: string, holdReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Releases a hold on a payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} holdId - Hold ID
 * @param {string} releaseNotes - Release notes
 * @param {string} userId - User releasing the hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Released payment hold
 *
 * @example
 * ```typescript
 * const released = await releasePaymentHold(sequelize, 1, 'Verification complete', 'user123');
 * ```
 */
export declare const releasePaymentHold: (sequelize: Sequelize, holdId: number, releaseNotes: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates a payment approval record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ApprovePaymentDto} approvalData - Approval data
 * @param {string} userId - User approving the payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment approval record
 *
 * @example
 * ```typescript
 * const approval = await approvePayment(sequelize, {
 *   paymentId: 1,
 *   approvalLevel: 1,
 *   comments: 'Approved for payment'
 * }, 'manager123');
 * ```
 */
export declare const approvePayment: (sequelize: Sequelize, approvalData: ApprovePaymentDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates a payment schedule for recurring payments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePaymentScheduleDto} scheduleData - Schedule data
 * @param {string} userId - User creating the schedule
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created payment schedule
 *
 * @example
 * ```typescript
 * const schedule = await createPaymentSchedule(sequelize, {
 *   scheduleName: 'Monthly Rent Payment',
 *   scheduleType: 'recurring',
 *   frequency: 'monthly',
 *   startDate: new Date('2024-01-01'),
 *   paymentMethodId: 1,
 *   bankAccountId: 5
 * }, 'user123');
 * ```
 */
export declare const createPaymentSchedule: (sequelize: Sequelize, scheduleData: CreatePaymentScheduleDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Calculates next run date based on frequency.
 *
 * @param {Date} startDate - Start date
 * @param {string} frequency - Frequency (daily, weekly, monthly, etc.)
 * @returns {Date} Next run date
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextRunDate(new Date('2024-01-01'), 'monthly');
 * // Returns: 2024-02-01
 * ```
 */
export declare const calculateNextRunDate: (startDate: Date, frequency: string) => Date;
/**
 * Creates a payment audit trail entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} action - Action performed
 * @param {string} userId - User performing action
 * @param {Record<string, any>} oldValues - Old values
 * @param {Record<string, any>} newValues - New values
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Audit trail entry
 *
 * @example
 * ```typescript
 * await createPaymentAuditTrail(sequelize, 1, 'APPROVE', 'user123',
 *   { status: 'pending' }, { status: 'approved' });
 * ```
 */
export declare const createPaymentAuditTrail: (sequelize: Sequelize, paymentId: number, action: string, userId: string, oldValues: Record<string, any>, newValues: Record<string, any>, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves payment history with audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Payment audit trail
 *
 * @example
 * ```typescript
 * const history = await getPaymentHistory(sequelize, 1);
 * console.log(history.length); // Number of audit entries
 * ```
 */
export declare const getPaymentHistory: (sequelize: Sequelize, paymentId: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Cancels a payment run before processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentRunId - Payment run ID
 * @param {string} userId - User cancelling the run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled payment run
 *
 * @example
 * ```typescript
 * const cancelled = await cancelPaymentRun(sequelize, 1, 'user123');
 * ```
 */
export declare const cancelPaymentRun: (sequelize: Sequelize, paymentRunId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves bank account details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BankAccount>} Bank account details
 *
 * @example
 * ```typescript
 * const account = await getBankAccount(sequelize, 1);
 * console.log(account.accountNumber);
 * ```
 */
export declare const getBankAccount: (sequelize: Sequelize, bankAccountId: number, transaction?: Transaction) => Promise<BankAccount>;
/**
 * Updates bank account balance after payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {number} amount - Amount to deduct
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated bank account
 *
 * @example
 * ```typescript
 * await updateBankAccountBalance(sequelize, 1, 5000.00);
 * ```
 */
export declare const updateBankAccountBalance: (sequelize: Sequelize, bankAccountId: number, amount: number, transaction?: Transaction) => Promise<any>;
/**
 * NestJS Controller for Payment Run operations.
 */
export declare class PaymentRunsController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    createRun(createDto: CreatePaymentRunDto, userId: string): Promise<any>;
    approve(id: number, userId: string): Promise<any>;
    cancel(id: number, userId: string): Promise<any>;
}
/**
 * NestJS Controller for Payment operations.
 */
export declare class PaymentsController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    create(createDto: CreatePaymentDto, userId: string): Promise<any>;
    void(voidDto: VoidPaymentDto, userId: string): Promise<any>;
    reconcile(reconDto: ReconcilePaymentDto, userId: string): Promise<any>;
    getHistory(id: number): Promise<any[]>;
}
/**
 * NestJS Controller for ACH processing.
 */
export declare class ACHProcessingController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    processBatch(batchDto: ProcessACHBatchDto, userId: string): Promise<any>;
    transmit(id: number, userId: string): Promise<any>;
    validate(id: number): Promise<any>;
}
export {};
//# sourceMappingURL=payment-processing-collections-kit.d.ts.map