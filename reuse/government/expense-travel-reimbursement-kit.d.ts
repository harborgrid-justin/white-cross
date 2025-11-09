/**
 * LOC: GOVTRVL1234567
 * File: /reuse/government/expense-travel-reimbursement-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS government finance controllers
 *   - Backend travel services
 *   - API expense endpoints
 *   - Government compliance modules
 */
import { Sequelize } from 'sequelize';
interface ExpenseTravelContext {
    userId: string;
    employeeId: string;
    departmentId: string;
    agencyId: string;
    fiscalYear: number;
    timestamp: string;
    metadata?: Record<string, any>;
}
interface ExpenseReport {
    id?: string;
    reportNumber: string;
    employeeId: string;
    reportTitle: string;
    reportPurpose: string;
    reportType: ExpenseReportType;
    status: ExpenseStatus;
    submittedDate?: string;
    approvedDate?: string;
    paidDate?: string;
    totalAmount: number;
    reimbursableAmount: number;
    advanceAmount: number;
    amountDue: number;
    currency: string;
    fiscalYear: number;
    lineItems: ExpenseLineItem[];
    receipts: Receipt[];
    approvalWorkflow: ApprovalStep[];
    auditTrail: AuditEntry[];
    policyViolations: PolicyViolation[];
    notes?: string;
    metadata?: Record<string, any>;
}
interface ExpenseLineItem {
    id?: string;
    expenseDate: string;
    category: ExpenseCategory;
    subcategory?: string;
    description: string;
    amount: number;
    taxAmount?: number;
    totalAmount: number;
    vendor: string;
    vendorLocation?: string;
    accountCode: string;
    projectCode?: string;
    receiptRequired: boolean;
    receiptId?: string;
    receiptAttached: boolean;
    reimbursable: boolean;
    policyCompliant: boolean;
    complianceNotes?: string;
    approvalRequired: boolean;
    metadata?: Record<string, any>;
}
interface TravelAuthorization {
    id?: string;
    authorizationNumber: string;
    employeeId: string;
    travelPurpose: string;
    travelType: TravelType;
    departureDate: string;
    returnDate: string;
    destinations: TravelDestination[];
    estimatedCost: number;
    status: AuthorizationStatus;
    fundingSource: string;
    accountingCode: string;
    approvedBy?: string;
    approvedDate?: string;
    authorizationDate?: string;
    expirationDate?: string;
    blanketAuthorization: boolean;
    emergencyTravel: boolean;
    requiredApprovals: ApprovalStep[];
    metadata?: Record<string, any>;
}
interface TravelDestination {
    sequence: number;
    city: string;
    state?: string;
    country: string;
    arrivalDate: string;
    departureDate: string;
    purpose: string;
    lodgingRequired: boolean;
    mealsIncluded: boolean;
    transportationMode: TransportationMode;
}
interface PerDiemCalculation {
    destination: string;
    checkInDate: string;
    checkOutDate: string;
    totalDays: number;
    lodgingRate: number;
    mealsRate: number;
    incidentalsRate: number;
    totalLodging: number;
    totalMeals: number;
    totalIncidentals: number;
    totalPerDiem: number;
    gsaLocation: string;
    gsaEffectiveDate: string;
    prorationApplied: boolean;
    prorationDetails?: ProrationDetails;
}
interface ProrationDetails {
    firstDayProration: number;
    lastDayProration: number;
    firstDayAmount: number;
    lastDayAmount: number;
}
interface MileageReimbursement {
    id?: string;
    employeeId: string;
    travelDate: string;
    fromLocation: string;
    toLocation: string;
    purpose: string;
    mileage: number;
    reimbursementRate: number;
    reimbursementAmount: number;
    vehicleType: VehicleType;
    odometryStart?: number;
    odometryEnd?: number;
    routeMap?: string;
    authorized: boolean;
    authorizedBy?: string;
    receiptsRequired: boolean;
    metadata?: Record<string, any>;
}
interface Receipt {
    id?: string;
    receiptNumber: string;
    receiptDate: string;
    vendor: string;
    amount: number;
    taxAmount?: number;
    paymentMethod: PaymentMethod;
    receiptType: ReceiptType;
    imageUrl?: string;
    ocrProcessed: boolean;
    ocrData?: OcrData;
    validated: boolean;
    validationNotes?: string;
    expenseLineItemId?: string;
    metadata?: Record<string, any>;
}
interface OcrData {
    vendor?: string;
    date?: string;
    totalAmount?: number;
    taxAmount?: number;
    paymentMethod?: string;
    confidence: number;
    rawText?: string;
}
interface CardTransaction {
    id?: string;
    transactionId: string;
    cardId: string;
    employeeId: string;
    transactionDate: string;
    postDate: string;
    vendor: string;
    amount: number;
    description?: string;
    merchantCategory: string;
    reconciled: boolean;
    reconciledDate?: string;
    expenseReportId?: string;
    expenseLineItemId?: string;
    disputed: boolean;
    disputeReason?: string;
    metadata?: Record<string, any>;
}
interface TravelAdvance {
    id?: string;
    advanceNumber: string;
    employeeId: string;
    travelAuthorizationId: string;
    advanceAmount: number;
    advanceDate: string;
    purpose: string;
    dueDate: string;
    reconciled: boolean;
    reconciledDate?: string;
    reconciledAmount?: number;
    amountOwed?: number;
    amountRefunded?: number;
    status: AdvanceStatus;
    paymentMethod: PaymentMethod;
    paymentReference?: string;
    metadata?: Record<string, any>;
}
interface GsaRate {
    locationId: string;
    locationName: string;
    state: string;
    county?: string;
    city?: string;
    fiscalYear: number;
    effectiveDate: string;
    expirationDate: string;
    lodgingRate: number;
    mealsRate: number;
    incidentalsRate: number;
    totalRate: number;
    season?: string;
    notes?: string;
}
interface ApprovalStep {
    level: number;
    approverId: string;
    approverName: string;
    approverTitle: string;
    status: ApprovalStatus;
    approvedDate?: string;
    rejectedDate?: string;
    comments?: string;
    delegatedTo?: string;
    notifiedDate?: string;
}
interface PolicyViolation {
    ruleId: string;
    ruleName: string;
    severity: ViolationSeverity;
    description: string;
    lineItemId?: string;
    suggestedAction?: string;
    overridden: boolean;
    overrideReason?: string;
    overriddenBy?: string;
    overriddenDate?: string;
}
interface AuditEntry {
    timestamp: string;
    userId: string;
    userName: string;
    action: string;
    entityType: string;
    entityId: string;
    changes?: Record<string, any>;
    ipAddress?: string;
    metadata?: Record<string, any>;
}
interface ReimbursementPayment {
    id?: string;
    paymentNumber: string;
    expenseReportId: string;
    employeeId: string;
    paymentAmount: number;
    paymentDate: string;
    paymentMethod: PaymentMethod;
    paymentReference: string;
    bankAccount?: string;
    routingNumber?: string;
    status: PaymentStatus;
    batchId?: string;
    reconciled: boolean;
    metadata?: Record<string, any>;
}
type ExpenseReportType = 'travel' | 'local' | 'training' | 'conference' | 'miscellaneous' | 'relocation';
type ExpenseStatus = 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected' | 'paid' | 'cancelled';
type ExpenseCategory = 'lodging' | 'meals' | 'airfare' | 'ground_transport' | 'rental_car' | 'fuel' | 'parking' | 'tolls' | 'registration' | 'supplies' | 'other';
type TravelType = 'domestic' | 'international' | 'local' | 'emergency';
type AuthorizationStatus = 'draft' | 'pending' | 'approved' | 'denied' | 'expired' | 'cancelled';
type TransportationMode = 'air' | 'train' | 'bus' | 'rental_car' | 'personal_vehicle' | 'taxi' | 'rideshare' | 'other';
type VehicleType = 'personal_car' | 'personal_motorcycle' | 'personal_van' | 'rental_car' | 'government_vehicle';
type PaymentMethod = 'corporate_card' | 'personal_card' | 'cash' | 'check' | 'direct_deposit' | 'wire_transfer';
type ReceiptType = 'hotel' | 'meal' | 'airfare' | 'rental_car' | 'fuel' | 'parking' | 'toll' | 'registration' | 'other';
type AdvanceStatus = 'requested' | 'approved' | 'paid' | 'reconciled' | 'refunded' | 'written_off';
type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'delegated' | 'expired';
type ViolationSeverity = 'info' | 'warning' | 'error' | 'critical';
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
 *   reportTitle: 'DC Conference Travel',
 *   reportType: 'travel',
 *   status: 'draft'
 * });
 * ```
 */
export declare const createExpenseReportModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        reportNumber: string;
        employeeId: string;
        reportTitle: string;
        reportPurpose: string;
        reportType: string;
        status: string;
        submittedDate: Date | null;
        approvedDate: Date | null;
        paidDate: Date | null;
        totalAmount: number;
        reimbursableAmount: number;
        advanceAmount: number;
        amountDue: number;
        currency: string;
        fiscalYear: number;
        lineItems: ExpenseLineItem[];
        receipts: Receipt[];
        approvalWorkflow: ApprovalStep[];
        auditTrail: AuditEntry[];
        policyViolations: PolicyViolation[];
        notes: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Travel Authorizations with multi-level approval.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TravelAuthorization model
 *
 * @example
 * ```typescript
 * const TravelAuth = createTravelAuthorizationModel(sequelize);
 * const auth = await TravelAuth.create({
 *   authorizationNumber: 'TA-2025-001234',
 *   employeeId: 'EMP123',
 *   travelPurpose: 'Annual Conference',
 *   travelType: 'domestic',
 *   departureDate: '2025-02-15',
 *   returnDate: '2025-02-18'
 * });
 * ```
 */
export declare const createTravelAuthorizationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        authorizationNumber: string;
        employeeId: string;
        travelPurpose: string;
        travelType: string;
        departureDate: Date;
        returnDate: Date;
        destinations: TravelDestination[];
        estimatedCost: number;
        status: string;
        fundingSource: string;
        accountingCode: string;
        approvedBy: string | null;
        approvedDate: Date | null;
        authorizationDate: Date | null;
        expirationDate: Date | null;
        blanketAuthorization: boolean;
        emergencyTravel: boolean;
        requiredApprovals: ApprovalStep[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Corporate Card Transactions with reconciliation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CardTransaction model
 *
 * @example
 * ```typescript
 * const CardTxn = createCardTransactionModel(sequelize);
 * const transaction = await CardTxn.create({
 *   transactionId: 'TXN-2025-001234',
 *   cardId: 'CARD-123',
 *   employeeId: 'EMP123',
 *   transactionDate: '2025-01-15',
 *   vendor: 'Hotel ABC',
 *   amount: 250.00
 * });
 * ```
 */
export declare const createCardTransactionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        transactionId: string;
        cardId: string;
        employeeId: string;
        transactionDate: Date;
        postDate: Date;
        vendor: string;
        amount: number;
        description: string | null;
        merchantCategory: string;
        reconciled: boolean;
        reconciledDate: Date | null;
        expenseReportId: number | null;
        expenseLineItemId: string | null;
        disputed: boolean;
        disputeReason: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for GSA Per Diem Rates with location and date tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GsaRate model
 *
 * @example
 * ```typescript
 * const GsaRate = createGsaRateModel(sequelize);
 * const rate = await GsaRate.create({
 *   locationId: 'DC-001',
 *   locationName: 'Washington, DC',
 *   state: 'DC',
 *   fiscalYear: 2025,
 *   lodgingRate: 194.00,
 *   mealsRate: 79.00,
 *   incidentalsRate: 5.00
 * });
 * ```
 */
export declare const createGsaRateModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        locationId: string;
        locationName: string;
        state: string;
        county: string | null;
        city: string | null;
        fiscalYear: number;
        effectiveDate: Date;
        expirationDate: Date;
        lodgingRate: number;
        mealsRate: number;
        incidentalsRate: number;
        totalRate: number;
        season: string | null;
        notes: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates expense report with initial line items.
 *
 * @param {Partial<ExpenseReport>} reportData - Expense report data
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Created expense report
 *
 * @example
 * ```typescript
 * const report = await createExpenseReport({
 *   employeeId: 'EMP123',
 *   reportTitle: 'Annual Conference - Washington DC',
 *   reportPurpose: 'Attend federal IT conference',
 *   reportType: 'travel'
 * }, context);
 * ```
 */
export declare function createExpenseReport(reportData: Partial<ExpenseReport>, context: ExpenseTravelContext): Promise<ExpenseReport>;
/**
 * Adds expense line item to report with policy validation.
 *
 * @param {string} reportId - Expense report ID
 * @param {ExpenseLineItem} lineItem - Line item to add
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Updated expense report
 *
 * @example
 * ```typescript
 * const updated = await addExpenseLineItem('EXP-2025-001234', {
 *   expenseDate: '2025-01-15',
 *   category: 'lodging',
 *   description: 'Hotel - Marriott DC',
 *   amount: 194.00,
 *   vendor: 'Marriott Hotels',
 *   accountCode: 'ACCT-5100',
 *   receiptRequired: true,
 *   reimbursable: true
 * }, context);
 * ```
 */
export declare function addExpenseLineItem(reportId: string, lineItem: ExpenseLineItem, context: ExpenseTravelContext): Promise<ExpenseReport>;
/**
 * Validates expense line item against travel policies.
 *
 * @param {ExpenseLineItem} lineItem - Line item to validate
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ExpenseLineItem>} Validated line item
 *
 * @example
 * ```typescript
 * const validated = await validateExpenseLineItem(lineItem, context);
 * console.log('Policy compliant:', validated.policyCompliant);
 * ```
 */
export declare function validateExpenseLineItem(lineItem: ExpenseLineItem, context: ExpenseTravelContext): Promise<ExpenseLineItem>;
/**
 * Submits expense report for approval workflow.
 *
 * @param {string} reportId - Expense report ID
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Submitted expense report
 *
 * @example
 * ```typescript
 * const submitted = await submitExpenseReport('EXP-2025-001234', context);
 * console.log('Status:', submitted.status); // 'submitted'
 * ```
 */
export declare function submitExpenseReport(reportId: string, context: ExpenseTravelContext): Promise<ExpenseReport>;
/**
 * Approves expense report.
 *
 * @param {string} reportId - Expense report ID
 * @param {string} approverId - Approver user ID
 * @param {string} [comments] - Approval comments
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Approved expense report
 *
 * @example
 * ```typescript
 * const approved = await approveExpenseReport('EXP-2025-001234', 'MGR456', 'Approved', context);
 * ```
 */
export declare function approveExpenseReport(reportId: string, approverId: string, comments: string | undefined, context: ExpenseTravelContext): Promise<ExpenseReport>;
/**
 * Calculates total expense amounts including advances.
 *
 * @param {ExpenseReport} report - Expense report
 * @returns {object} Calculated totals
 *
 * @example
 * ```typescript
 * const totals = calculateExpenseTotals(report);
 * // { totalAmount: 1500, reimbursableAmount: 1400, amountDue: 900 }
 * ```
 */
export declare function calculateExpenseTotals(report: ExpenseReport): {
    totalAmount: number;
    reimbursableAmount: number;
    nonReimbursableAmount: number;
    amountDue: number;
};
/**
 * Attaches receipt to expense line item.
 *
 * @param {string} reportId - Expense report ID
 * @param {string} lineItemId - Line item ID
 * @param {Receipt} receipt - Receipt data
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ExpenseReport>} Updated expense report
 *
 * @example
 * ```typescript
 * const updated = await attachReceipt('EXP-2025-001234', 'LINE-001', {
 *   receiptNumber: 'REC-001',
 *   receiptDate: '2025-01-15',
 *   vendor: 'Marriott Hotels',
 *   amount: 194.00,
 *   receiptType: 'hotel',
 *   imageUrl: 'https://storage.example.com/receipt.jpg'
 * }, context);
 * ```
 */
export declare function attachReceipt(reportId: string, lineItemId: string, receipt: Receipt, context: ExpenseTravelContext): Promise<ExpenseReport>;
/**
 * Generates unique expense report number.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<string>} Unique report number
 *
 * @example
 * ```typescript
 * const reportNumber = await generateExpenseReportNumber('EMP123', 2025);
 * // 'EXP-2025-001234'
 * ```
 */
export declare function generateExpenseReportNumber(employeeId: string, fiscalYear: number): Promise<string>;
/**
 * Creates travel authorization request.
 *
 * @param {Partial<TravelAuthorization>} authData - Authorization data
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<TravelAuthorization>} Created travel authorization
 *
 * @example
 * ```typescript
 * const auth = await createTravelAuthorization({
 *   employeeId: 'EMP123',
 *   travelPurpose: 'Annual IT Security Conference',
 *   travelType: 'domestic',
 *   departureDate: '2025-03-10',
 *   returnDate: '2025-03-14',
 *   destinations: [{
 *     sequence: 1,
 *     city: 'San Francisco',
 *     state: 'CA',
 *     country: 'USA',
 *     arrivalDate: '2025-03-10',
 *     departureDate: '2025-03-14',
 *     purpose: 'Conference attendance',
 *     lodgingRequired: true,
 *     mealsIncluded: false,
 *     transportationMode: 'air'
 *   }],
 *   fundingSource: 'Training Budget',
 *   accountingCode: 'ACCT-7200'
 * }, context);
 * ```
 */
export declare function createTravelAuthorization(authData: Partial<TravelAuthorization>, context: ExpenseTravelContext): Promise<TravelAuthorization>;
/**
 * Estimates travel costs for authorization.
 *
 * @param {TravelAuthorization} authorization - Travel authorization
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<number>} Estimated total cost
 *
 * @example
 * ```typescript
 * const estimatedCost = await estimateTravelCost(auth, context);
 * console.log(`Estimated cost: $${estimatedCost}`);
 * ```
 */
export declare function estimateTravelCost(authorization: TravelAuthorization, context: ExpenseTravelContext): Promise<number>;
/**
 * Approves travel authorization.
 *
 * @param {string} authId - Authorization ID
 * @param {string} approverId - Approver user ID
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<TravelAuthorization>} Approved authorization
 *
 * @example
 * ```typescript
 * const approved = await approveTravelAuthorization('TA-2025-001234', 'MGR456', context);
 * ```
 */
export declare function approveTravelAuthorization(authId: string, approverId: string, context: ExpenseTravelContext): Promise<TravelAuthorization>;
/**
 * Validates travel authorization against policies.
 *
 * @param {TravelAuthorization} authorization - Authorization to validate
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<{isValid: boolean; violations: PolicyViolation[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTravelAuthorization(auth, context);
 * if (!validation.isValid) {
 *   console.log('Violations:', validation.violations);
 * }
 * ```
 */
export declare function validateTravelAuthorization(authorization: TravelAuthorization, context: ExpenseTravelContext): Promise<{
    isValid: boolean;
    violations: PolicyViolation[];
}>;
/**
 * Cancels travel authorization.
 *
 * @param {string} authId - Authorization ID
 * @param {string} reason - Cancellation reason
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<TravelAuthorization>} Cancelled authorization
 *
 * @example
 * ```typescript
 * const cancelled = await cancelTravelAuthorization('TA-2025-001234', 'Conference postponed', context);
 * ```
 */
export declare function cancelTravelAuthorization(authId: string, reason: string, context: ExpenseTravelContext): Promise<TravelAuthorization>;
/**
 * Extends travel authorization expiration date.
 *
 * @param {string} authId - Authorization ID
 * @param {string} newExpirationDate - New expiration date
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<TravelAuthorization>} Updated authorization
 *
 * @example
 * ```typescript
 * const extended = await extendTravelAuthorization('TA-2025-001234', '2026-12-31', context);
 * ```
 */
export declare function extendTravelAuthorization(authId: string, newExpirationDate: string, context: ExpenseTravelContext): Promise<TravelAuthorization>;
/**
 * Checks if travel authorization is valid and not expired.
 *
 * @param {string} authId - Authorization ID
 * @returns {Promise<boolean>} True if valid
 *
 * @example
 * ```typescript
 * const isValid = await checkAuthorizationValidity('TA-2025-001234');
 * ```
 */
export declare function checkAuthorizationValidity(authId: string): Promise<boolean>;
/**
 * Generates unique travel authorization number.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<string>} Unique authorization number
 *
 * @example
 * ```typescript
 * const authNumber = await generateTravelAuthNumber(2025);
 * // 'TA-2025-001234'
 * ```
 */
export declare function generateTravelAuthNumber(fiscalYear: number): Promise<string>;
/**
 * Calculates per diem allowance using GSA rates.
 *
 * @param {string} destination - Destination city/state
 * @param {string} checkInDate - Check-in date
 * @param {string} checkOutDate - Check-out date
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<PerDiemCalculation>} Per diem calculation
 *
 * @example
 * ```typescript
 * const perDiem = await calculatePerDiem(
 *   'Washington, DC',
 *   '2025-03-10',
 *   '2025-03-14',
 *   context
 * );
 * console.log(`Total per diem: $${perDiem.totalPerDiem}`);
 * ```
 */
export declare function calculatePerDiem(destination: string, checkInDate: string, checkOutDate: string, context: ExpenseTravelContext): Promise<PerDiemCalculation>;
/**
 * Retrieves current GSA per diem rates for location.
 *
 * @param {string} destination - Destination city/state
 * @param {string} effectiveDate - Effective date for rate lookup
 * @returns {Promise<GsaRate>} GSA rate information
 *
 * @example
 * ```typescript
 * const rate = await getGsaRate('Washington, DC', '2025-03-10');
 * console.log(`Lodging rate: $${rate.lodgingRate}`);
 * ```
 */
export declare function getGsaRate(destination: string, effectiveDate: string): Promise<GsaRate>;
/**
 * Imports GSA per diem rates from official source.
 *
 * @param {GsaRate[]} rates - GSA rates to import
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<{imported: number; updated: number}>} Import results
 *
 * @example
 * ```typescript
 * const result = await importGsaRates(gsaRateData, context);
 * console.log(`Imported: ${result.imported}, Updated: ${result.updated}`);
 * ```
 */
export declare function importGsaRates(rates: GsaRate[], context: ExpenseTravelContext): Promise<{
    imported: number;
    updated: number;
}>;
/**
 * Validates per diem claim against GSA rates.
 *
 * @param {PerDiemCalculation} claim - Per diem claim
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<{isValid: boolean; violations: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePerDiemClaim(claim, context);
 * ```
 */
export declare function validatePerDiemClaim(claim: PerDiemCalculation, context: ExpenseTravelContext): Promise<{
    isValid: boolean;
    violations: string[];
}>;
/**
 * Calculates meal breakdown for per diem (breakfast, lunch, dinner).
 *
 * @param {number} totalMealsRate - Total M&IE rate
 * @returns {object} Meal breakdown
 *
 * @example
 * ```typescript
 * const breakdown = calculateMealBreakdown(79.00);
 * // { breakfast: 15.01, lunch: 17.76, dinner: 40.23, incidentals: 5.00 }
 * ```
 */
export declare function calculateMealBreakdown(totalMealsRate: number): {
    breakfast: number;
    lunch: number;
    dinner: number;
    incidentals: number;
};
/**
 * Searches GSA rates by location criteria.
 *
 * @param {object} criteria - Search criteria
 * @returns {Promise<GsaRate[]>} Matching GSA rates
 *
 * @example
 * ```typescript
 * const rates = await searchGsaRates({ state: 'CA', fiscalYear: 2025 });
 * ```
 */
export declare function searchGsaRates(criteria: {
    state?: string;
    city?: string;
    fiscalYear?: number;
}): Promise<GsaRate[]>;
/**
 * Calculates prorated per diem for partial travel days.
 *
 * @param {number} fullDayRate - Full day per diem rate
 * @param {string} travelTime - Travel time (departure/arrival)
 * @returns {number} Prorated amount
 *
 * @example
 * ```typescript
 * const prorated = calculateProration(79.00, 'departure');
 * // Returns 59.25 (75% of full rate)
 * ```
 */
export declare function calculateProration(fullDayRate: number, travelTime: 'departure' | 'arrival'): number;
/**
 * Calculates travel days for per diem (includes travel days).
 *
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {number} Number of travel days
 *
 * @example
 * ```typescript
 * const days = calculateTravelDays('2025-03-10', '2025-03-14');
 * // Returns 5
 * ```
 */
export declare function calculateTravelDays(startDate: string, endDate: string): number;
/**
 * Calculates mileage reimbursement at IRS standard rate.
 *
 * @param {Partial<MileageReimbursement>} mileageData - Mileage data
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<MileageReimbursement>} Mileage reimbursement calculation
 *
 * @example
 * ```typescript
 * const mileage = await calculateMileageReimbursement({
 *   employeeId: 'EMP123',
 *   travelDate: '2025-01-15',
 *   fromLocation: 'Office - 123 Main St',
 *   toLocation: 'Client Site - 456 Oak Ave',
 *   purpose: 'Client meeting',
 *   mileage: 45,
 *   vehicleType: 'personal_car'
 * }, context);
 * console.log(`Reimbursement: $${mileage.reimbursementAmount}`);
 * ```
 */
export declare function calculateMileageReimbursement(mileageData: Partial<MileageReimbursement>, context: ExpenseTravelContext): Promise<MileageReimbursement>;
/**
 * Retrieves current IRS mileage reimbursement rate.
 *
 * @param {string} effectiveDate - Effective date
 * @param {VehicleType} vehicleType - Type of vehicle
 * @returns {Promise<number>} Mileage rate per mile
 *
 * @example
 * ```typescript
 * const rate = await getIrsMileageRate('2025-01-15', 'personal_car');
 * // Returns 0.67
 * ```
 */
export declare function getIrsMileageRate(effectiveDate: string, vehicleType: VehicleType): Promise<number>;
/**
 * Validates mileage claim against map data.
 *
 * @param {MileageReimbursement} claim - Mileage claim
 * @returns {Promise<{isValid: boolean; actualMileage?: number; variance?: number}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateMileageClaim(claim);
 * if (validation.variance && validation.variance > 10) {
 *   console.log('Mileage discrepancy detected');
 * }
 * ```
 */
export declare function validateMileageClaim(claim: MileageReimbursement): Promise<{
    isValid: boolean;
    actualMileage?: number;
    variance?: number;
}>;
/**
 * Authorizes mileage reimbursement.
 *
 * @param {string} mileageId - Mileage reimbursement ID
 * @param {string} authorizerId - Authorizer user ID
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<MileageReimbursement>} Authorized mileage reimbursement
 *
 * @example
 * ```typescript
 * const authorized = await authorizeMileage('MIL-001', 'MGR456', context);
 * ```
 */
export declare function authorizeMileage(mileageId: string, authorizerId: string, context: ExpenseTravelContext): Promise<MileageReimbursement>;
/**
 * Calculates round-trip mileage automatically.
 *
 * @param {number} oneWayMileage - One-way mileage
 * @returns {number} Round-trip mileage
 *
 * @example
 * ```typescript
 * const roundTrip = calculateRoundTripMileage(25);
 * // Returns 50
 * ```
 */
export declare function calculateRoundTripMileage(oneWayMileage: number): number;
/**
 * Validates odometry readings for accuracy.
 *
 * @param {number} startOdometry - Starting odometer reading
 * @param {number} endOdometry - Ending odometer reading
 * @param {number} claimedMileage - Claimed mileage
 * @returns {boolean} True if readings match claim
 *
 * @example
 * ```typescript
 * const valid = validateOdometry(10000, 10050, 50);
 * // Returns true
 * ```
 */
export declare function validateOdometry(startOdometry: number, endOdometry: number, claimedMileage: number): boolean;
/**
 * Compares personal vehicle vs rental cost for trip.
 *
 * @param {number} mileage - Trip mileage
 * @param {number} days - Number of rental days
 * @returns {Promise<{personalVehicleCost: number; rentalCost: number; recommendation: string}>} Cost comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareTravelCosts(500, 3);
 * console.log(comparison.recommendation);
 * ```
 */
export declare function compareTravelCosts(mileage: number, days: number): Promise<{
    personalVehicleCost: number;
    rentalCost: number;
    recommendation: string;
}>;
/**
 * Generates mileage log report for period.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @returns {Promise<object>} Mileage log report
 *
 * @example
 * ```typescript
 * const log = await generateMileageLog('EMP123', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export declare function generateMileageLog(employeeId: string, startDate: Date, endDate: Date): Promise<{
    totalMileage: number;
    totalReimbursement: number;
    trips: MileageReimbursement[];
}>;
/**
 * Imports corporate card transactions for reconciliation.
 *
 * @param {CardTransaction[]} transactions - Transactions to import
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<{imported: number; errors: any[]}>} Import results
 *
 * @example
 * ```typescript
 * const result = await importCardTransactions(transactionData, context);
 * console.log(`Imported ${result.imported} transactions`);
 * ```
 */
export declare function importCardTransactions(transactions: CardTransaction[], context: ExpenseTravelContext): Promise<{
    imported: number;
    errors: any[];
}>;
/**
 * Reconciles card transaction to expense report.
 *
 * @param {string} transactionId - Transaction ID
 * @param {string} expenseReportId - Expense report ID
 * @param {string} lineItemId - Line item ID
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<CardTransaction>} Reconciled transaction
 *
 * @example
 * ```typescript
 * const reconciled = await reconcileCardTransaction('TXN-001', 'EXP-2025-001234', 'LINE-001', context);
 * ```
 */
export declare function reconcileCardTransaction(transactionId: string, expenseReportId: string, lineItemId: string, context: ExpenseTravelContext): Promise<CardTransaction>;
/**
 * Finds unreconciled corporate card transactions.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} startDate - Search start date
 * @param {Date} endDate - Search end date
 * @returns {Promise<CardTransaction[]>} Unreconciled transactions
 *
 * @example
 * ```typescript
 * const unreconciled = await findUnreconciledTransactions('EMP123', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export declare function findUnreconciledTransactions(employeeId: string, startDate: Date, endDate: Date): Promise<CardTransaction[]>;
/**
 * Disputes corporate card transaction.
 *
 * @param {string} transactionId - Transaction ID
 * @param {string} disputeReason - Dispute reason
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<CardTransaction>} Disputed transaction
 *
 * @example
 * ```typescript
 * const disputed = await disputeTransaction('TXN-001', 'Duplicate charge', context);
 * ```
 */
export declare function disputeTransaction(transactionId: string, disputeReason: string, context: ExpenseTravelContext): Promise<CardTransaction>;
/**
 * Generates corporate card reconciliation report.
 *
 * @param {string} cardId - Corporate card ID
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @returns {Promise<object>} Reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generateCardReconciliationReport('CARD-123', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export declare function generateCardReconciliationReport(cardId: string, periodStart: Date, periodEnd: Date): Promise<{
    cardId: string;
    totalTransactions: number;
    totalAmount: number;
    reconciledCount: number;
    unreconciledCount: number;
    disputedCount: number;
}>;
/**
 * Validates card transaction against merchant category limits.
 *
 * @param {CardTransaction} transaction - Transaction to validate
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<{isValid: boolean; warnings: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCardTransaction(transaction, context);
 * ```
 */
export declare function validateCardTransaction(transaction: CardTransaction, context: ExpenseTravelContext): Promise<{
    isValid: boolean;
    warnings: string[];
}>;
/**
 * Auto-matches card transactions to expense line items.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @returns {Promise<Array<{transaction: CardTransaction; matches: ExpenseLineItem[]}>>} Match suggestions
 *
 * @example
 * ```typescript
 * const matches = await autoMatchTransactions('EMP123', new Date('2025-01-01'), new Date('2025-01-31'));
 * ```
 */
export declare function autoMatchTransactions(employeeId: string, periodStart: Date, periodEnd: Date): Promise<Array<{
    transaction: CardTransaction;
    matches: ExpenseLineItem[];
}>>;
/**
 * Sends reconciliation reminders to cardholders.
 *
 * @param {string[]} employeeIds - Employee IDs
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<number>} Number of reminders sent
 *
 * @example
 * ```typescript
 * const sent = await sendReconciliationReminders(['EMP123', 'EMP456'], context);
 * ```
 */
export declare function sendReconciliationReminders(employeeIds: string[], context: ExpenseTravelContext): Promise<number>;
/**
 * Creates travel advance request.
 *
 * @param {Partial<TravelAdvance>} advanceData - Advance data
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<TravelAdvance>} Created travel advance
 *
 * @example
 * ```typescript
 * const advance = await createTravelAdvance({
 *   employeeId: 'EMP123',
 *   travelAuthorizationId: 'TA-2025-001234',
 *   advanceAmount: 1500.00,
 *   purpose: 'Conference lodging and meals',
 *   dueDate: '2025-04-30',
 *   paymentMethod: 'direct_deposit'
 * }, context);
 * ```
 */
export declare function createTravelAdvance(advanceData: Partial<TravelAdvance>, context: ExpenseTravelContext): Promise<TravelAdvance>;
/**
 * Processes travel advance payment.
 *
 * @param {string} advanceId - Advance ID
 * @param {string} paymentReference - Payment reference number
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<TravelAdvance>} Processed advance
 *
 * @example
 * ```typescript
 * const processed = await processTravelAdvancePayment('ADV-2025-001234', 'PAY-987654', context);
 * ```
 */
export declare function processTravelAdvancePayment(advanceId: string, paymentReference: string, context: ExpenseTravelContext): Promise<TravelAdvance>;
/**
 * Reconciles travel advance against expense report.
 *
 * @param {string} advanceId - Advance ID
 * @param {string} expenseReportId - Expense report ID
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<TravelAdvance>} Reconciled advance
 *
 * @example
 * ```typescript
 * const reconciled = await reconcileTravelAdvance('ADV-2025-001234', 'EXP-2025-001234', context);
 * console.log(`Amount owed: $${reconciled.amountOwed || 0}`);
 * ```
 */
export declare function reconcileTravelAdvance(advanceId: string, expenseReportId: string, context: ExpenseTravelContext): Promise<TravelAdvance>;
/**
 * Processes reimbursement payment to employee.
 *
 * @param {Partial<ReimbursementPayment>} paymentData - Payment data
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ReimbursementPayment>} Created reimbursement payment
 *
 * @example
 * ```typescript
 * const payment = await processReimbursementPayment({
 *   expenseReportId: 'EXP-2025-001234',
 *   employeeId: 'EMP123',
 *   paymentAmount: 450.00,
 *   paymentMethod: 'direct_deposit'
 * }, context);
 * ```
 */
export declare function processReimbursementPayment(paymentData: Partial<ReimbursementPayment>, context: ExpenseTravelContext): Promise<ReimbursementPayment>;
/**
 * Generates payment batch for multiple reimbursements.
 *
 * @param {string[]} expenseReportIds - Expense report IDs
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<string>} Batch ID
 *
 * @example
 * ```typescript
 * const batchId = await generatePaymentBatch(['EXP-001', 'EXP-002', 'EXP-003'], context);
 * ```
 */
export declare function generatePaymentBatch(expenseReportIds: string[], context: ExpenseTravelContext): Promise<string>;
/**
 * Validates reimbursement payment eligibility.
 *
 * @param {string} expenseReportId - Expense report ID
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<{eligible: boolean; reasons: string[]}>} Eligibility result
 *
 * @example
 * ```typescript
 * const eligibility = await validateReimbursementEligibility('EXP-2025-001234', context);
 * ```
 */
export declare function validateReimbursementEligibility(expenseReportId: string, context: ExpenseTravelContext): Promise<{
    eligible: boolean;
    reasons: string[];
}>;
/**
 * Tracks reimbursement payment status.
 *
 * @param {string} paymentNumber - Payment number
 * @returns {Promise<PaymentStatus>} Payment status
 *
 * @example
 * ```typescript
 * const status = await trackPaymentStatus('PAY-2025-001234');
 * console.log(`Status: ${status}`);
 * ```
 */
export declare function trackPaymentStatus(paymentNumber: string): Promise<PaymentStatus>;
/**
 * Formats currency amount.
 *
 * @param {number} amount - Amount
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency
 *
 * @example
 * ```typescript
 * const formatted = formatCurrency(1234.56, 'USD');
 * // '$1,234.56'
 * ```
 */
export declare function formatCurrency(amount: number, currency?: string): string;
/**
 * NestJS controller for expense and travel management.
 */
export declare class ExpenseTravelController {
    createReport(reportData: any): Promise<ExpenseReport>;
    createAuth(authData: any): Promise<TravelAuthorization>;
    calculatePerDiemEndpoint(data: {
        destination: string;
        checkInDate: string;
        checkOutDate: string;
    }): Promise<PerDiemCalculation>;
    getGsaRateEndpoint(destination: string, date: string): Promise<GsaRate>;
    calculateMileageEndpoint(mileageData: any): Promise<MileageReimbursement>;
}
export {};
//# sourceMappingURL=expense-travel-reimbursement-kit.d.ts.map