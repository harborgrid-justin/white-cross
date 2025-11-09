/**
 * LOC: FINEXP1234567
 * File: /reuse/financial/expense-management-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS financial management controllers
 *   - Backend expense services
 *   - API financial endpoints
 *   - USACE CEFMS integration modules
 */
import { Sequelize } from 'sequelize';
interface ExpenseContext {
    userId: string;
    employeeId: string;
    departmentId: string;
    projectId?: string;
    costCenter?: string;
    requestId?: string;
    timestamp: string;
    metadata?: Record<string, any>;
}
interface ExpenseLineItem {
    id?: string;
    category: ExpenseCategory;
    subcategory?: string;
    date: string;
    amount: number;
    currency: string;
    merchantName: string;
    merchantLocation?: string;
    description: string;
    receiptUrl?: string;
    receiptId?: string;
    taxAmount?: number;
    taxRate?: number;
    billable: boolean;
    clientId?: string;
    projectCode?: string;
    accountingCode?: string;
    policyCompliant: boolean;
    policyViolations?: string[];
    approvalRequired: boolean;
    reimbursable: boolean;
    paymentMethod?: PaymentMethod;
    cardLastFour?: string;
    metadata?: Record<string, any>;
}
interface ExpenseReport {
    id?: string;
    reportNumber: string;
    employeeId: string;
    submitterId: string;
    title: string;
    purpose: string;
    reportType: ExpenseReportType;
    status: ExpenseReportStatus;
    totalAmount: number;
    reimbursableAmount: number;
    nonReimbursableAmount: number;
    currency: string;
    lineItems: ExpenseLineItem[];
    approvalChain: ApprovalStep[];
    currentApproverId?: string;
    submittedAt?: string;
    approvedAt?: string;
    paidAt?: string;
    dueDate?: string;
    paymentMethod?: string;
    paymentReference?: string;
    notes?: string;
    attachments?: AttachmentInfo[];
    auditLog: AuditEntry[];
    policyViolations: PolicyViolation[];
    flags: ExpenseFlag[];
    metadata?: Record<string, any>;
}
interface ApprovalStep {
    level: number;
    approverId: string;
    approverName: string;
    approverEmail: string;
    approverRole: string;
    status: ApprovalStatus;
    approvedAt?: string;
    rejectedAt?: string;
    comments?: string;
    delegatedTo?: string;
    autoApproved: boolean;
    notifiedAt?: string;
    remindersSent: number;
}
interface PolicyViolation {
    ruleId: string;
    ruleName: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    lineItemId?: string;
    description: string;
    suggestedCorrection?: string;
    overrideReason?: string;
    overriddenBy?: string;
    overriddenAt?: string;
}
interface ExpenseFlag {
    type: FlagType;
    severity: 'info' | 'warning' | 'error';
    description: string;
    raiseAt: string;
    resolvedAt?: string;
    resolvedBy?: string;
    resolution?: string;
}
interface TravelExpense {
    tripId?: string;
    tripPurpose: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    travelType: TravelType;
    accommodationExpenses: ExpenseLineItem[];
    transportationExpenses: ExpenseLineItem[];
    mealExpenses: ExpenseLineItem[];
    perDiemAmount?: number;
    perDiemRate?: number;
    perDiemDays?: number;
    mileage?: MileageInfo;
    receiptsRequired: boolean;
    advanceReceived?: number;
    advanceReconciled: boolean;
}
interface MileageInfo {
    totalMiles: number;
    reimbursementRate: number;
    reimbursementAmount: number;
    vehicleType: string;
    odometryStart?: number;
    odometryEnd?: number;
    route?: string;
    purpose: string;
    date: string;
}
interface CorporateCardTransaction {
    transactionId: string;
    cardId: string;
    cardLastFour: string;
    cardHolderName: string;
    merchantName: string;
    merchantCategory: string;
    transactionDate: string;
    postDate: string;
    amount: number;
    currency: string;
    description?: string;
    reconciled: boolean;
    reconciledAt?: string;
    expenseReportId?: string;
    expenseLineItemId?: string;
    personalExpense: boolean;
    disputed: boolean;
    disputeReason?: string;
    category?: ExpenseCategory;
    receiptAttached: boolean;
    metadata?: Record<string, any>;
}
interface ReimbursementRequest {
    id?: string;
    requestNumber: string;
    employeeId: string;
    expenseReportId: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    bankAccountId?: string;
    paymentStatus: PaymentStatus;
    scheduledPaymentDate?: string;
    actualPaymentDate?: string;
    paymentReference?: string;
    paymentBatchId?: string;
    taxWithheld?: number;
    netAmount: number;
    notes?: string;
    metadata?: Record<string, any>;
}
interface AttachmentInfo {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
    uploadedBy: string;
    url: string;
    thumbnailUrl?: string;
    ocrProcessed: boolean;
    ocrData?: OCRData;
    virusScanStatus: 'pending' | 'clean' | 'infected';
}
interface OCRData {
    merchantName?: string;
    transactionDate?: string;
    totalAmount?: number;
    taxAmount?: number;
    currency?: string;
    confidence: number;
    rawText?: string;
}
interface AuditEntry {
    timestamp: string;
    userId: string;
    userName: string;
    action: string;
    changes?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
interface PerDiemRate {
    locationId: string;
    locationName: string;
    country: string;
    state?: string;
    city?: string;
    effectiveDate: string;
    expirationDate?: string;
    lodgingRate: number;
    mealRate: number;
    incidentalRate: number;
    totalDailyRate: number;
    currency: string;
    season?: string;
}
type ExpenseCategory = 'travel' | 'lodging' | 'meals' | 'transportation' | 'fuel' | 'parking' | 'tolls' | 'airfare' | 'car_rental' | 'taxi_rideshare' | 'office_supplies' | 'software_subscriptions' | 'training_education' | 'client_entertainment' | 'marketing' | 'telecommunications' | 'shipping' | 'equipment' | 'maintenance' | 'professional_services' | 'other';
type ExpenseReportType = 'standard' | 'travel' | 'mileage' | 'corporate_card' | 'project_based' | 'per_diem';
type ExpenseReportStatus = 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected' | 'pending_payment' | 'paid' | 'cancelled' | 'under_review' | 'requires_information';
type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'delegated' | 'auto_approved' | 'escalated' | 'expired';
type PaymentMethod = 'direct_deposit' | 'check' | 'wire_transfer' | 'corporate_card' | 'payroll_integration' | 'digital_wallet';
type PaymentStatus = 'pending' | 'scheduled' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'on_hold';
type TravelType = 'domestic' | 'international' | 'local';
type FlagType = 'duplicate_expense' | 'unusual_amount' | 'missing_receipt' | 'policy_violation' | 'fraud_alert' | 'stale_report' | 'multiple_submissions' | 'unreconciled_card';
/**
 * Sequelize model for Expense Reports with approval workflow and audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ExpenseReport model
 *
 * @example
 * ```typescript
 * const ExpenseReport = createExpenseReportModel(sequelize);
 * const report = await ExpenseReport.create({
 *   reportNumber: 'EXP-2025-001234',
 *   employeeId: 'EMP123',
 *   title: 'NYC Business Trip',
 *   totalAmount: 1500.00,
 *   status: 'submitted'
 * });
 * ```
 */
export declare const createExpenseReportModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        reportNumber: string;
        employeeId: string;
        submitterId: string;
        title: string;
        purpose: string;
        reportType: string;
        status: string;
        totalAmount: number;
        reimbursableAmount: number;
        nonReimbursableAmount: number;
        currency: string;
        lineItems: ExpenseLineItem[];
        approvalChain: ApprovalStep[];
        currentApproverId: string | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        paidAt: Date | null;
        dueDate: Date | null;
        paymentMethod: string | null;
        paymentReference: string | null;
        notes: string | null;
        attachments: AttachmentInfo[];
        auditLog: AuditEntry[];
        policyViolations: PolicyViolation[];
        flags: ExpenseFlag[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Corporate Card Transactions with reconciliation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CorporateCardTransaction model
 *
 * @example
 * ```typescript
 * const CardTransaction = createCorporateCardTransactionModel(sequelize);
 * const transaction = await CardTransaction.create({
 *   transactionId: 'TXN-123456',
 *   cardLastFour: '1234',
 *   merchantName: 'Hotel XYZ',
 *   amount: 250.00,
 *   reconciled: false
 * });
 * ```
 */
export declare const createCorporateCardTransactionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        transactionId: string;
        cardId: string;
        cardLastFour: string;
        cardHolderName: string;
        merchantName: string;
        merchantCategory: string;
        transactionDate: Date;
        postDate: Date;
        amount: number;
        currency: string;
        description: string | null;
        reconciled: boolean;
        reconciledAt: Date | null;
        expenseReportId: number | null;
        expenseLineItemId: string | null;
        personalExpense: boolean;
        disputed: boolean;
        disputeReason: string | null;
        category: string | null;
        receiptAttached: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Reimbursement Requests with payment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ReimbursementRequest model
 *
 * @example
 * ```typescript
 * const Reimbursement = createReimbursementRequestModel(sequelize);
 * const request = await Reimbursement.create({
 *   requestNumber: 'REIMB-2025-001234',
 *   employeeId: 'EMP123',
 *   amount: 1500.00,
 *   paymentStatus: 'pending'
 * });
 * ```
 */
export declare const createReimbursementRequestModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        requestNumber: string;
        employeeId: string;
        expenseReportId: number;
        amount: number;
        currency: string;
        paymentMethod: string;
        bankAccountId: string | null;
        paymentStatus: string;
        scheduledPaymentDate: Date | null;
        actualPaymentDate: Date | null;
        paymentReference: string | null;
        paymentBatchId: string | null;
        taxWithheld: number;
        netAmount: number;
        notes: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Expense Policy Rules with compliance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ExpensePolicyRule model
 *
 * @example
 * ```typescript
 * const PolicyRule = createExpensePolicyRuleModel(sequelize);
 * const rule = await PolicyRule.create({
 *   ruleId: 'RULE-MEAL-001',
 *   ruleName: 'Meal Expense Limit',
 *   category: 'meals',
 *   maxAmount: 75.00,
 *   requiresReceipt: true
 * });
 * ```
 */
export declare const createExpensePolicyRuleModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        ruleId: string;
        ruleName: string;
        category: string | null;
        maxAmount: number | null;
        requiresReceipt: boolean;
        receiptThreshold: number | null;
        requiresJustification: boolean;
        allowedMerchants: string[];
        blockedMerchants: string[];
        allowedLocations: string[];
        advanceApprovalRequired: boolean;
        reimbursable: boolean;
        taxDeductible: boolean;
        severity: string;
        active: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new expense report with initial line items and metadata.
 *
 * @param {Partial<ExpenseReport>} reportData - Expense report data
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Created expense report
 *
 * @example
 * ```typescript
 * const report = await createExpenseReport({
 *   employeeId: 'EMP123',
 *   title: 'NYC Business Trip - Q1 2025',
 *   purpose: 'Client meeting and conference attendance',
 *   reportType: 'travel',
 *   lineItems: [
 *     { category: 'airfare', amount: 450, merchantName: 'United Airlines', date: '2025-01-15' }
 *   ]
 * }, context);
 * ```
 */
export declare function createExpenseReport(reportData: Partial<ExpenseReport>, context: ExpenseContext): Promise<ExpenseReport>;
/**
 * Adds expense line items to an existing expense report with policy validation.
 *
 * @param {string} reportId - Expense report ID
 * @param {ExpenseLineItem[]} lineItems - Line items to add
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Updated expense report
 *
 * @example
 * ```typescript
 * const updated = await addExpenseLineItems('EXP-2025-001234', [
 *   {
 *     category: 'meals',
 *     date: '2025-01-16',
 *     amount: 45.00,
 *     merchantName: 'Restaurant ABC',
 *     description: 'Client dinner',
 *     billable: true,
 *     reimbursable: true
 *   }
 * ], context);
 * ```
 */
export declare function addExpenseLineItems(reportId: string, lineItems: ExpenseLineItem[], context: ExpenseContext): Promise<ExpenseReport>;
/**
 * Validates expense line item against policy rules and compliance requirements.
 *
 * @param {ExpenseLineItem} lineItem - Line item to validate
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseLineItem>} Validated line item with compliance flags
 *
 * @example
 * ```typescript
 * const validated = await validateExpenseLineItem({
 *   category: 'meals',
 *   amount: 150,
 *   merchantName: 'Fine Dining Restaurant',
 *   date: '2025-01-15',
 *   description: 'Team dinner',
 *   billable: false,
 *   reimbursable: true
 * }, context);
 * console.log(validated.policyCompliant); // false
 * console.log(validated.policyViolations); // ['Exceeds meal limit of $75']
 * ```
 */
export declare function validateExpenseLineItem(lineItem: ExpenseLineItem, context: ExpenseContext): Promise<ExpenseLineItem>;
/**
 * Submits expense report for approval workflow initiation.
 *
 * @param {string} reportId - Expense report ID
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Submitted expense report with approval chain
 *
 * @example
 * ```typescript
 * const submitted = await submitExpenseReport('EXP-2025-001234', context);
 * console.log(submitted.status); // 'pending_approval'
 * console.log(submitted.approvalChain.length); // 2 (multi-level approval)
 * ```
 */
export declare function submitExpenseReport(reportId: string, context: ExpenseContext): Promise<ExpenseReport>;
/**
 * Builds multi-level approval chain based on expense amount and department rules.
 *
 * @param {string} reportId - Expense report ID
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ApprovalStep[]>} Approval chain steps
 *
 * @example
 * ```typescript
 * const chain = await buildApprovalChain('EXP-2025-001234', context);
 * // [
 * //   { level: 1, approverId: 'MGR123', approverRole: 'Manager', status: 'pending' },
 * //   { level: 2, approverId: 'DIR456', approverRole: 'Director', status: 'pending' }
 * // ]
 * ```
 */
export declare function buildApprovalChain(reportId: string, context: ExpenseContext): Promise<ApprovalStep[]>;
/**
 * Processes expense report approval or rejection by designated approver.
 *
 * @param {string} reportId - Expense report ID
 * @param {string} approverId - Approver user ID
 * @param {boolean} approved - Approval decision
 * @param {string} [comments] - Approval comments
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Updated expense report
 *
 * @example
 * ```typescript
 * const approved = await processExpenseApproval(
 *   'EXP-2025-001234',
 *   'MGR123',
 *   true,
 *   'Approved - all expenses justified',
 *   context
 * );
 * ```
 */
export declare function processExpenseApproval(reportId: string, approverId: string, approved: boolean, comments: string | undefined, context: ExpenseContext): Promise<ExpenseReport>;
/**
 * Calculates expense report totals including tax, reimbursable, and non-reimbursable amounts.
 *
 * @param {ExpenseReport} report - Expense report
 * @returns {object} Calculated totals
 *
 * @example
 * ```typescript
 * const totals = calculateExpenseReportTotals(report);
 * // {
 * //   totalAmount: 1500.00,
 * //   totalTax: 120.00,
 * //   reimbursableAmount: 1400.00,
 * //   nonReimbursableAmount: 100.00,
 * //   billableAmount: 800.00
 * // }
 * ```
 */
export declare function calculateExpenseReportTotals(report: ExpenseReport): {
    totalAmount: number;
    totalTax: number;
    reimbursableAmount: number;
    nonReimbursableAmount: number;
    billableAmount: number;
};
/**
 * Duplicates expense report for recurring expense scenarios.
 *
 * @param {string} reportId - Source expense report ID
 * @param {Partial<ExpenseReport>} overrides - Override values for new report
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseReport>} New expense report
 *
 * @example
 * ```typescript
 * const duplicate = await duplicateExpenseReport('EXP-2025-001234', {
 *   title: 'NYC Business Trip - Q2 2025',
 *   purpose: 'Quarterly client review meeting'
 * }, context);
 * ```
 */
export declare function duplicateExpenseReport(reportId: string, overrides: Partial<ExpenseReport>, context: ExpenseContext): Promise<ExpenseReport>;
/**
 * Generates unique expense report number with prefix and sequential numbering.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<string>} Unique report number
 *
 * @example
 * ```typescript
 * const reportNumber = await generateExpenseReportNumber('EMP123');
 * // 'EXP-2025-001234'
 * ```
 */
export declare function generateExpenseReportNumber(employeeId: string): Promise<string>;
/**
 * Recalls submitted expense report back to draft status for corrections.
 *
 * @param {string} reportId - Expense report ID
 * @param {string} reason - Reason for recall
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Recalled expense report
 *
 * @example
 * ```typescript
 * const recalled = await recallExpenseReport(
 *   'EXP-2025-001234',
 *   'Need to add missing receipts',
 *   context
 * );
 * ```
 */
export declare function recallExpenseReport(reportId: string, reason: string, context: ExpenseContext): Promise<ExpenseReport>;
/**
 * Archives completed or cancelled expense reports for long-term storage.
 *
 * @param {string} reportId - Expense report ID
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<boolean>} Archive success status
 *
 * @example
 * ```typescript
 * const archived = await archiveExpenseReport('EXP-2025-001234', context);
 * ```
 */
export declare function archiveExpenseReport(reportId: string, context: ExpenseContext): Promise<boolean>;
/**
 * Searches expense reports with advanced filtering and pagination.
 *
 * @param {object} filters - Search filters
 * @param {object} pagination - Pagination options
 * @returns {Promise<object>} Search results with metadata
 *
 * @example
 * ```typescript
 * const results = await searchExpenseReports(
 *   { status: 'pending_approval', employeeId: 'EMP123', minAmount: 500 },
 *   { page: 1, limit: 20 }
 * );
 * ```
 */
export declare function searchExpenseReports(filters: Record<string, any>, pagination: {
    page: number;
    limit: number;
}): Promise<{
    reports: ExpenseReport[];
    total: number;
    page: number;
    totalPages: number;
}>;
/**
 * Imports corporate card transactions from card provider feed for reconciliation.
 *
 * @param {CorporateCardTransaction[]} transactions - Transaction data from provider
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<number>} Number of imported transactions
 *
 * @example
 * ```typescript
 * const count = await importCorporateCardTransactions([
 *   {
 *     transactionId: 'TXN-123456',
 *     cardLastFour: '1234',
 *     merchantName: 'Hotel XYZ',
 *     amount: 250.00,
 *     transactionDate: '2025-01-15'
 *   }
 * ], context);
 * ```
 */
export declare function importCorporateCardTransactions(transactions: CorporateCardTransaction[], context: ExpenseContext): Promise<number>;
/**
 * Reconciles corporate card transaction to expense line item.
 *
 * @param {string} transactionId - Card transaction ID
 * @param {string} expenseReportId - Expense report ID
 * @param {string} lineItemId - Line item ID
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<CorporateCardTransaction>} Reconciled transaction
 *
 * @example
 * ```typescript
 * const reconciled = await reconcileCardTransaction(
 *   'TXN-123456',
 *   'EXP-2025-001234',
 *   'LINE-001',
 *   context
 * );
 * ```
 */
export declare function reconcileCardTransaction(transactionId: string, expenseReportId: string, lineItemId: string, context: ExpenseContext): Promise<CorporateCardTransaction>;
/**
 * Identifies unreconciled corporate card transactions requiring expense reports.
 *
 * @param {string} cardId - Corporate card ID
 * @param {Date} startDate - Start date for search
 * @param {Date} endDate - End date for search
 * @returns {Promise<CorporateCardTransaction[]>} Unreconciled transactions
 *
 * @example
 * ```typescript
 * const unreconciled = await findUnreconciledCardTransactions(
 *   'CARD-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * ```
 */
export declare function findUnreconciledCardTransactions(cardId: string, startDate: Date, endDate: Date): Promise<CorporateCardTransaction[]>;
/**
 * Flags corporate card transaction as personal expense requiring reimbursement to company.
 *
 * @param {string} transactionId - Transaction ID
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<CorporateCardTransaction>} Flagged transaction
 *
 * @example
 * ```typescript
 * const flagged = await flagPersonalExpense('TXN-123456', context);
 * ```
 */
export declare function flagPersonalExpense(transactionId: string, context: ExpenseContext): Promise<CorporateCardTransaction>;
/**
 * Disputes corporate card transaction with card provider.
 *
 * @param {string} transactionId - Transaction ID
 * @param {string} disputeReason - Reason for dispute
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<CorporateCardTransaction>} Disputed transaction
 *
 * @example
 * ```typescript
 * const disputed = await disputeCardTransaction(
 *   'TXN-123456',
 *   'Duplicate charge - already paid',
 *   context
 * );
 * ```
 */
export declare function disputeCardTransaction(transactionId: string, disputeReason: string, context: ExpenseContext): Promise<CorporateCardTransaction>;
/**
 * Auto-matches corporate card transactions to expense line items using AI/ML.
 *
 * @param {string[]} transactionIds - Transaction IDs to match
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<Array<{transactionId: string; matches: any[]}>>} Suggested matches
 *
 * @example
 * ```typescript
 * const suggestions = await autoMatchCardTransactions(['TXN-123', 'TXN-456'], context);
 * ```
 */
export declare function autoMatchCardTransactions(transactionIds: string[], context: ExpenseContext): Promise<Array<{
    transactionId: string;
    matches: any[];
}>>;
/**
 * Generates corporate card reconciliation report for accounting period.
 *
 * @param {string} cardId - Corporate card ID
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @returns {Promise<object>} Reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generateCardReconciliationReport(
 *   'CARD-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * ```
 */
export declare function generateCardReconciliationReport(cardId: string, periodStart: Date, periodEnd: Date): Promise<{
    cardId: string;
    period: {
        start: string;
        end: string;
    };
    totalTransactions: number;
    totalAmount: number;
    reconciledCount: number;
    unreconciledCount: number;
    personalExpenseCount: number;
    disputedCount: number;
}>;
/**
 * Sends reconciliation reminders to cardholders for pending transactions.
 *
 * @param {string[]} cardIds - Corporate card IDs
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<number>} Number of reminders sent
 *
 * @example
 * ```typescript
 * const sent = await sendCardReconciliationReminders(['CARD-123', 'CARD-456'], context);
 * ```
 */
export declare function sendCardReconciliationReminders(cardIds: string[], context: ExpenseContext): Promise<number>;
/**
 * Creates reimbursement request from approved expense report.
 *
 * @param {string} expenseReportId - Expense report ID
 * @param {PaymentMethod} paymentMethod - Payment method
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ReimbursementRequest>} Created reimbursement request
 *
 * @example
 * ```typescript
 * const reimbursement = await createReimbursementRequest(
 *   'EXP-2025-001234',
 *   'direct_deposit',
 *   context
 * );
 * ```
 */
export declare function createReimbursementRequest(expenseReportId: string, paymentMethod: PaymentMethod, context: ExpenseContext): Promise<ReimbursementRequest>;
/**
 * Processes reimbursement payment through payment gateway.
 *
 * @param {string} reimbursementId - Reimbursement request ID
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ReimbursementRequest>} Processed reimbursement
 *
 * @example
 * ```typescript
 * const processed = await processReimbursementPayment('REIMB-2025-001234', context);
 * ```
 */
export declare function processReimbursementPayment(reimbursementId: string, context: ExpenseContext): Promise<ReimbursementRequest>;
/**
 * Generates payment batch for multiple reimbursement requests.
 *
 * @param {string[]} reimbursementIds - Reimbursement request IDs
 * @param {Date} scheduledDate - Scheduled payment date
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<string>} Payment batch ID
 *
 * @example
 * ```typescript
 * const batchId = await generatePaymentBatch(
 *   ['REIMB-001', 'REIMB-002'],
 *   new Date('2025-01-31'),
 *   context
 * );
 * ```
 */
export declare function generatePaymentBatch(reimbursementIds: string[], scheduledDate: Date, context: ExpenseContext): Promise<string>;
/**
 * Calculates tax withholding for reimbursement based on jurisdiction rules.
 *
 * @param {number} amount - Reimbursement amount
 * @param {string} employeeId - Employee ID
 * @param {string} jurisdiction - Tax jurisdiction
 * @returns {Promise<number>} Tax withholding amount
 *
 * @example
 * ```typescript
 * const taxWithheld = await calculateTaxWithholding(1500.00, 'EMP123', 'US-CA');
 * ```
 */
export declare function calculateTaxWithholding(amount: number, employeeId: string, jurisdiction: string): Promise<number>;
/**
 * Tracks reimbursement payment status from payment processor.
 *
 * @param {string} reimbursementId - Reimbursement request ID
 * @returns {Promise<PaymentStatus>} Current payment status
 *
 * @example
 * ```typescript
 * const status = await trackReimbursementPaymentStatus('REIMB-2025-001234');
 * ```
 */
export declare function trackReimbursementPaymentStatus(reimbursementId: string): Promise<PaymentStatus>;
/**
 * Cancels pending reimbursement request before payment processing.
 *
 * @param {string} reimbursementId - Reimbursement request ID
 * @param {string} reason - Cancellation reason
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ReimbursementRequest>} Cancelled reimbursement
 *
 * @example
 * ```typescript
 * const cancelled = await cancelReimbursementRequest(
 *   'REIMB-2025-001234',
 *   'Expense report rejected',
 *   context
 * );
 * ```
 */
export declare function cancelReimbursementRequest(reimbursementId: string, reason: string, context: ExpenseContext): Promise<ReimbursementRequest>;
/**
 * Retries failed reimbursement payment with updated payment details.
 *
 * @param {string} reimbursementId - Reimbursement request ID
 * @param {Partial<ReimbursementRequest>} updates - Updated payment details
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ReimbursementRequest>} Retried reimbursement
 *
 * @example
 * ```typescript
 * const retried = await retryFailedReimbursement('REIMB-2025-001234', {
 *   bankAccountId: 'BANK-NEW-123'
 * }, context);
 * ```
 */
export declare function retryFailedReimbursement(reimbursementId: string, updates: Partial<ReimbursementRequest>, context: ExpenseContext): Promise<ReimbursementRequest>;
/**
 * Generates unique reimbursement request number.
 *
 * @returns {Promise<string>} Unique reimbursement number
 *
 * @example
 * ```typescript
 * const number = await generateReimbursementNumber();
 * // 'REIMB-2025-001234'
 * ```
 */
export declare function generateReimbursementNumber(): Promise<string>;
/**
 * Creates travel expense report with trip details and per diem calculations.
 *
 * @param {TravelExpense} travelData - Travel expense data
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Created travel expense report
 *
 * @example
 * ```typescript
 * const travelReport = await createTravelExpenseReport({
 *   tripPurpose: 'Client meeting in NYC',
 *   destination: 'New York, NY',
 *   departureDate: '2025-01-15',
 *   returnDate: '2025-01-17',
 *   travelType: 'domestic'
 * }, context);
 * ```
 */
export declare function createTravelExpenseReport(travelData: TravelExpense, context: ExpenseContext): Promise<ExpenseReport>;
/**
 * Calculates per diem allowance based on location and travel dates.
 *
 * @param {string} destination - Travel destination
 * @param {Date} startDate - Trip start date
 * @param {Date} endDate - Trip end date
 * @returns {Promise<object>} Per diem calculation details
 *
 * @example
 * ```typescript
 * const perDiem = await calculatePerDiem(
 *   'New York, NY',
 *   new Date('2025-01-15'),
 *   new Date('2025-01-17')
 * );
 * // { days: 3, rate: 79.00, totalAmount: 237.00 }
 * ```
 */
export declare function calculatePerDiem(destination: string, startDate: Date, endDate: Date): Promise<{
    days: number;
    rate: number;
    totalAmount: number;
    breakdown: any;
}>;
/**
 * Tracks mileage reimbursement with route and odometry details.
 *
 * @param {MileageInfo} mileageData - Mileage information
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<ExpenseLineItem>} Mileage expense line item
 *
 * @example
 * ```typescript
 * const mileageExpense = await trackMileageExpense({
 *   totalMiles: 150,
 *   reimbursementRate: 0.67,
 *   vehicleType: 'Personal Vehicle',
 *   purpose: 'Client site visit',
 *   date: '2025-01-15'
 * }, context);
 * ```
 */
export declare function trackMileageExpense(mileageData: MileageInfo, context: ExpenseContext): Promise<ExpenseLineItem>;
/**
 * Retrieves per diem rates for specific location and date range.
 *
 * @param {string} location - Location identifier
 * @param {Date} effectiveDate - Effective date for rate lookup
 * @returns {Promise<PerDiemRate>} Per diem rate information
 *
 * @example
 * ```typescript
 * const rate = await getPerDiemRates('US-NY-NYC', new Date('2025-01-15'));
 * ```
 */
export declare function getPerDiemRates(location: string, effectiveDate: Date): Promise<PerDiemRate>;
/**
 * Validates travel expense against travel policy rules.
 *
 * @param {TravelExpense} travelExpense - Travel expense to validate
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<PolicyViolation[]>} Policy violations
 *
 * @example
 * ```typescript
 * const violations = await validateTravelExpense(travelData, context);
 * ```
 */
export declare function validateTravelExpense(travelExpense: TravelExpense, context: ExpenseContext): Promise<PolicyViolation[]>;
/**
 * Reconciles travel advance payments against actual expenses.
 *
 * @param {string} tripId - Trip identifier
 * @param {number} advanceAmount - Advance payment amount
 * @param {number} actualExpenses - Actual expense total
 * @returns {Promise<object>} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileTravelAdvance('TRIP-123', 1000.00, 850.00);
 * // { advanceAmount: 1000, actualExpenses: 850, owedToCompany: 150, owedToEmployee: 0 }
 * ```
 */
export declare function reconcileTravelAdvance(tripId: string, advanceAmount: number, actualExpenses: number): Promise<{
    advanceAmount: number;
    actualExpenses: number;
    owedToCompany: number;
    owedToEmployee: number;
}>;
/**
 * Generates travel expense summary report for trip analysis.
 *
 * @param {string} tripId - Trip identifier
 * @returns {Promise<object>} Travel expense summary
 *
 * @example
 * ```typescript
 * const summary = await generateTravelExpenseSummary('TRIP-123');
 * ```
 */
export declare function generateTravelExpenseSummary(tripId: string): Promise<{
    tripId: string;
    totalExpenses: number;
    byCategory: Record<string, number>;
    perDiemAmount: number;
    advanceAmount: number;
    reimbursableAmount: number;
}>;
/**
 * Updates mileage reimbursement rates for policy compliance.
 *
 * @param {string} vehicleType - Vehicle type
 * @param {number} newRate - New reimbursement rate per mile
 * @param {Date} effectiveDate - Effective date for new rate
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<boolean>} Update success status
 *
 * @example
 * ```typescript
 * const updated = await updateMileageReimbursementRate('Personal Vehicle', 0.67, new Date('2025-01-01'), context);
 * ```
 */
export declare function updateMileageReimbursementRate(vehicleType: string, newRate: number, effectiveDate: Date, context: ExpenseContext): Promise<boolean>;
/**
 * Validates expense against all applicable policy rules.
 *
 * @param {ExpenseLineItem} expense - Expense to validate
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<PolicyViolation[]>} Policy violations
 *
 * @example
 * ```typescript
 * const violations = await validateExpenseAgainstPolicy(lineItem, context);
 * ```
 */
export declare function validateExpenseAgainstPolicy(expense: ExpenseLineItem, context: ExpenseContext): Promise<PolicyViolation[]>;
/**
 * Detects potential duplicate expense submissions for fraud prevention.
 *
 * @param {ExpenseLineItem} expense - Expense to check
 * @param {string} employeeId - Employee ID
 * @returns {Promise<ExpenseLineItem[]>} Potential duplicate expenses
 *
 * @example
 * ```typescript
 * const duplicates = await detectDuplicateExpenses(lineItem, 'EMP123');
 * ```
 */
export declare function detectDuplicateExpenses(expense: ExpenseLineItem, employeeId: string): Promise<ExpenseLineItem[]>;
/**
 * Flags suspicious expense patterns for fraud investigation.
 *
 * @param {ExpenseReport} report - Expense report to analyze
 * @returns {Promise<ExpenseFlag[]>} Suspicious activity flags
 *
 * @example
 * ```typescript
 * const flags = await flagSuspiciousExpensePatterns(report);
 * ```
 */
export declare function flagSuspiciousExpensePatterns(report: ExpenseReport): Promise<ExpenseFlag[]>;
/**
 * Checks if expense category requires receipt based on amount threshold.
 *
 * @param {ExpenseCategory} category - Expense category
 * @param {number} amount - Expense amount
 * @returns {Promise<boolean>} Receipt required status
 *
 * @example
 * ```typescript
 * const required = await checkReceiptRequirement('meals', 75.00);
 * ```
 */
export declare function checkReceiptRequirement(category: ExpenseCategory, amount: number): Promise<boolean>;
/**
 * Calculates expense category limit for employee based on role and policy.
 *
 * @param {ExpenseCategory} category - Expense category
 * @param {string} employeeId - Employee ID
 * @returns {Promise<number | null>} Category limit or null if unlimited
 *
 * @example
 * ```typescript
 * const limit = await getCategoryLimit('meals', 'EMP123');
 * ```
 */
export declare function getCategoryLimit(category: ExpenseCategory): number | null;
/**
 * Creates policy violation override with justification and approval.
 *
 * @param {string} reportId - Expense report ID
 * @param {PolicyViolation} violation - Policy violation to override
 * @param {string} justification - Override justification
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<PolicyViolation>} Overridden violation
 *
 * @example
 * ```typescript
 * const overridden = await overridePolicyViolation(
 *   'EXP-2025-001234',
 *   violation,
 *   'Emergency travel required for critical client issue',
 *   context
 * );
 * ```
 */
export declare function overridePolicyViolation(reportId: string, violation: PolicyViolation, justification: string, context: ExpenseContext): Promise<PolicyViolation>;
/**
 * Generates expense policy compliance report for audit purposes.
 *
 * @param {Date} startDate - Report period start
 * @param {Date} endDate - Report period end
 * @param {string} [departmentId] - Optional department filter
 * @returns {Promise<object>} Compliance report
 *
 * @example
 * ```typescript
 * const complianceReport = await generatePolicyComplianceReport(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   'DEPT-123'
 * );
 * ```
 */
export declare function generatePolicyComplianceReport(startDate: Date, endDate: Date, departmentId?: string): Promise<{
    period: {
        start: string;
        end: string;
    };
    totalReports: number;
    compliantReports: number;
    violationCount: number;
    topViolations: Array<{
        ruleId: string;
        count: number;
    }>;
    complianceRate: number;
}>;
/**
 * Sends approval notification to designated approver.
 *
 * @param {string} approverId - Approver user ID
 * @param {string} reportId - Expense report ID
 * @param {ExpenseContext} context - Execution context
 * @returns {Promise<boolean>} Notification sent status
 *
 * @example
 * ```typescript
 * const sent = await sendApprovalNotification('MGR123', 'EXP-2025-001234', context);
 * ```
 */
export declare function sendApprovalNotification(approverId: string, reportId: string, context: ExpenseContext): Promise<boolean>;
/**
 * Formats currency amount for display.
 *
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 *
 * @example
 * ```typescript
 * const formatted = formatCurrency(1500.50, 'USD');
 * // '$1,500.50'
 * ```
 */
export declare function formatCurrency(amount: number, currency?: string): string;
/**
 * Converts expense amount between currencies using exchange rates.
 *
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @param {Date} date - Exchange rate date
 * @returns {Promise<number>} Converted amount
 *
 * @example
 * ```typescript
 * const converted = await convertCurrency(100, 'EUR', 'USD', new Date());
 * ```
 */
export declare function convertCurrency(amount: number, fromCurrency: string, toCurrency: string, date: Date): Promise<number>;
export {};
//# sourceMappingURL=expense-management-tracking-kit.d.ts.map