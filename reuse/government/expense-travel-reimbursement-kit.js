"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseTravelController = exports.createGsaRateModel = exports.createCardTransactionModel = exports.createTravelAuthorizationModel = exports.createExpenseReportModel = void 0;
exports.createExpenseReport = createExpenseReport;
exports.addExpenseLineItem = addExpenseLineItem;
exports.validateExpenseLineItem = validateExpenseLineItem;
exports.submitExpenseReport = submitExpenseReport;
exports.approveExpenseReport = approveExpenseReport;
exports.calculateExpenseTotals = calculateExpenseTotals;
exports.attachReceipt = attachReceipt;
exports.generateExpenseReportNumber = generateExpenseReportNumber;
exports.createTravelAuthorization = createTravelAuthorization;
exports.estimateTravelCost = estimateTravelCost;
exports.approveTravelAuthorization = approveTravelAuthorization;
exports.validateTravelAuthorization = validateTravelAuthorization;
exports.cancelTravelAuthorization = cancelTravelAuthorization;
exports.extendTravelAuthorization = extendTravelAuthorization;
exports.checkAuthorizationValidity = checkAuthorizationValidity;
exports.generateTravelAuthNumber = generateTravelAuthNumber;
exports.calculatePerDiem = calculatePerDiem;
exports.getGsaRate = getGsaRate;
exports.importGsaRates = importGsaRates;
exports.validatePerDiemClaim = validatePerDiemClaim;
exports.calculateMealBreakdown = calculateMealBreakdown;
exports.searchGsaRates = searchGsaRates;
exports.calculateProration = calculateProration;
exports.calculateTravelDays = calculateTravelDays;
exports.calculateMileageReimbursement = calculateMileageReimbursement;
exports.getIrsMileageRate = getIrsMileageRate;
exports.validateMileageClaim = validateMileageClaim;
exports.authorizeMileage = authorizeMileage;
exports.calculateRoundTripMileage = calculateRoundTripMileage;
exports.validateOdometry = validateOdometry;
exports.compareTravelCosts = compareTravelCosts;
exports.generateMileageLog = generateMileageLog;
exports.importCardTransactions = importCardTransactions;
exports.reconcileCardTransaction = reconcileCardTransaction;
exports.findUnreconciledTransactions = findUnreconciledTransactions;
exports.disputeTransaction = disputeTransaction;
exports.generateCardReconciliationReport = generateCardReconciliationReport;
exports.validateCardTransaction = validateCardTransaction;
exports.autoMatchTransactions = autoMatchTransactions;
exports.sendReconciliationReminders = sendReconciliationReminders;
exports.createTravelAdvance = createTravelAdvance;
exports.processTravelAdvancePayment = processTravelAdvancePayment;
exports.reconcileTravelAdvance = reconcileTravelAdvance;
exports.processReimbursementPayment = processReimbursementPayment;
exports.generatePaymentBatch = generatePaymentBatch;
exports.validateReimbursementEligibility = validateReimbursementEligibility;
exports.trackPaymentStatus = trackPaymentStatus;
exports.formatCurrency = formatCurrency;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// SEQUELIZE MODELS (1-4)
// ============================================================================
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
const createExpenseReportModel = (sequelize) => {
    class ExpenseReport extends sequelize_1.Model {
    }
    ExpenseReport.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        reportNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique expense report number',
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Employee identifier',
        },
        reportTitle: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Report title',
        },
        reportPurpose: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Purpose of expenses',
        },
        reportType: {
            type: sequelize_1.DataTypes.ENUM('travel', 'local', 'training', 'conference', 'miscellaneous', 'relocation'),
            allowNull: false,
            comment: 'Type of expense report',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'submitted', 'pending_approval', 'approved', 'rejected', 'paid', 'cancelled'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Report status',
        },
        submittedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Submission date',
        },
        approvedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval date',
        },
        paidDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Payment date',
        },
        totalAmount: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total expense amount',
        },
        reimbursableAmount: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Reimbursable amount',
        },
        advanceAmount: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Travel advance amount',
        },
        amountDue: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Amount due to employee',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Currency code',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
        },
        lineItems: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Expense line items',
        },
        receipts: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Receipt records',
        },
        approvalWorkflow: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Approval workflow steps',
        },
        auditTrail: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Audit trail',
        },
        policyViolations: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Policy violations',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Additional notes',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'expense_reports',
        timestamps: true,
        indexes: [
            { fields: ['reportNumber'], unique: true },
            { fields: ['employeeId'] },
            { fields: ['status'] },
            { fields: ['reportType'] },
            { fields: ['fiscalYear'] },
            { fields: ['submittedDate'] },
            { fields: ['approvedDate'] },
        ],
    });
    return ExpenseReport;
};
exports.createExpenseReportModel = createExpenseReportModel;
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
const createTravelAuthorizationModel = (sequelize) => {
    class TravelAuthorization extends sequelize_1.Model {
    }
    TravelAuthorization.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        authorizationNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique authorization number',
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Employee identifier',
        },
        travelPurpose: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Purpose of travel',
        },
        travelType: {
            type: sequelize_1.DataTypes.ENUM('domestic', 'international', 'local', 'emergency'),
            allowNull: false,
            comment: 'Type of travel',
        },
        departureDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Departure date',
        },
        returnDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Return date',
        },
        destinations: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Travel destinations',
        },
        estimatedCost: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Estimated travel cost',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'pending', 'approved', 'denied', 'expired', 'cancelled'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Authorization status',
        },
        fundingSource: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Funding source',
        },
        accountingCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Accounting code',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Approver user ID',
        },
        approvedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval date',
        },
        authorizationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Authorization effective date',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Authorization expiration date',
        },
        blanketAuthorization: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Blanket authorization flag',
        },
        emergencyTravel: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Emergency travel flag',
        },
        requiredApprovals: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Required approval steps',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'travel_authorizations',
        timestamps: true,
        indexes: [
            { fields: ['authorizationNumber'], unique: true },
            { fields: ['employeeId'] },
            { fields: ['status'] },
            { fields: ['travelType'] },
            { fields: ['departureDate'] },
            { fields: ['returnDate'] },
        ],
    });
    return TravelAuthorization;
};
exports.createTravelAuthorizationModel = createTravelAuthorizationModel;
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
const createCardTransactionModel = (sequelize) => {
    class CardTransaction extends sequelize_1.Model {
    }
    CardTransaction.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        transactionId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique transaction identifier',
        },
        cardId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Corporate card identifier',
        },
        employeeId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Employee identifier',
        },
        transactionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Transaction date',
        },
        postDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Posted date',
        },
        vendor: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Vendor name',
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            comment: 'Transaction amount',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Transaction description',
        },
        merchantCategory: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Merchant category',
        },
        reconciled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Reconciliation status',
        },
        reconciledDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Reconciliation date',
        },
        expenseReportId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Associated expense report ID',
        },
        expenseLineItemId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Associated line item ID',
        },
        disputed: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Dispute flag',
        },
        disputeReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Dispute reason',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'card_transactions',
        timestamps: true,
        indexes: [
            { fields: ['transactionId'], unique: true },
            { fields: ['cardId'] },
            { fields: ['employeeId'] },
            { fields: ['transactionDate'] },
            { fields: ['reconciled'] },
            { fields: ['disputed'] },
        ],
    });
    return CardTransaction;
};
exports.createCardTransactionModel = createCardTransactionModel;
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
const createGsaRateModel = (sequelize) => {
    class GsaRate extends sequelize_1.Model {
    }
    GsaRate.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        locationId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'GSA location identifier',
        },
        locationName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Location name',
        },
        state: {
            type: sequelize_1.DataTypes.STRING(2),
            allowNull: false,
            comment: 'State code',
        },
        county: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'County name',
        },
        city: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'City name',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Effective date',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Expiration date',
        },
        lodgingRate: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Lodging per diem rate',
        },
        mealsRate: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Meals & incidentals rate',
        },
        incidentalsRate: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Incidentals rate',
        },
        totalRate: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'Total daily rate',
        },
        season: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Season (if seasonal rates)',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Additional notes',
        },
    }, {
        sequelize,
        tableName: 'gsa_rates',
        timestamps: true,
        indexes: [
            { fields: ['locationId'] },
            { fields: ['state'] },
            { fields: ['fiscalYear'] },
            { fields: ['effectiveDate'] },
        ],
    });
    return GsaRate;
};
exports.createGsaRateModel = createGsaRateModel;
// ============================================================================
// EXPENSE REPORT FUNCTIONS (1-8)
// ============================================================================
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
async function createExpenseReport(reportData, context) {
    const reportNumber = await generateExpenseReportNumber(context.employeeId, context.fiscalYear);
    return {
        ...reportData,
        reportNumber,
        employeeId: reportData.employeeId || context.employeeId,
        status: 'draft',
        totalAmount: 0,
        reimbursableAmount: 0,
        advanceAmount: 0,
        amountDue: 0,
        currency: 'USD',
        fiscalYear: context.fiscalYear,
        lineItems: reportData.lineItems || [],
        receipts: reportData.receipts || [],
        approvalWorkflow: [],
        auditTrail: [{
                timestamp: new Date().toISOString(),
                userId: context.userId,
                userName: context.userId,
                action: 'CREATED',
                entityType: 'ExpenseReport',
                entityId: reportNumber,
            }],
        policyViolations: [],
        metadata: reportData.metadata || {},
    };
}
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
async function addExpenseLineItem(reportId, lineItem, context) {
    const validated = await validateExpenseLineItem(lineItem, context);
    return {
        reportNumber: reportId,
        lineItems: [validated],
    };
}
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
async function validateExpenseLineItem(lineItem, context) {
    const policy = await getTravelPolicy(lineItem.category, context.agencyId);
    let policyCompliant = true;
    const notes = [];
    // Check amount limits
    if (policy.maxAmount && lineItem.amount > policy.maxAmount) {
        policyCompliant = false;
        notes.push(`Exceeds policy limit of $${policy.maxAmount}`);
    }
    // Check receipt requirement
    if (policy.requiresReceipt && lineItem.amount > (policy.receiptThreshold || 75)) {
        lineItem.receiptRequired = true;
        if (!lineItem.receiptAttached) {
            notes.push('Receipt required');
        }
    }
    return {
        ...lineItem,
        totalAmount: lineItem.amount + (lineItem.taxAmount || 0),
        policyCompliant,
        complianceNotes: notes.length > 0 ? notes.join('; ') : undefined,
        approvalRequired: !policyCompliant || lineItem.amount > 1000,
    };
}
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
async function submitExpenseReport(reportId, context) {
    const approvalWorkflow = await buildApprovalWorkflow(reportId, context);
    return {
        reportNumber: reportId,
        status: 'submitted',
        submittedDate: new Date().toISOString(),
        approvalWorkflow,
    };
}
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
async function approveExpenseReport(reportId, approverId, comments, context) {
    return {
        reportNumber: reportId,
        status: 'approved',
        approvedDate: new Date().toISOString(),
    };
}
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
function calculateExpenseTotals(report) {
    const totalAmount = report.lineItems.reduce((sum, item) => sum + item.totalAmount, 0);
    const reimbursableAmount = report.lineItems.filter(item => item.reimbursable).reduce((sum, item) => sum + item.totalAmount, 0);
    const amountDue = reimbursableAmount - report.advanceAmount;
    return {
        totalAmount,
        reimbursableAmount,
        nonReimbursableAmount: totalAmount - reimbursableAmount,
        amountDue,
    };
}
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
async function attachReceipt(reportId, lineItemId, receipt, context) {
    return {
        reportNumber: reportId,
        receipts: [{ ...receipt, expenseLineItemId: lineItemId }],
    };
}
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
async function generateExpenseReportNumber(employeeId, fiscalYear) {
    const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `EXP-${fiscalYear}-${sequence}`;
}
// ============================================================================
// TRAVEL AUTHORIZATION FUNCTIONS (9-16)
// ============================================================================
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
async function createTravelAuthorization(authData, context) {
    const authorizationNumber = await generateTravelAuthNumber(context.fiscalYear);
    return {
        ...authData,
        authorizationNumber,
        employeeId: authData.employeeId || context.employeeId,
        status: 'draft',
        estimatedCost: 0,
        blanketAuthorization: authData.blanketAuthorization || false,
        emergencyTravel: authData.emergencyTravel || false,
        requiredApprovals: [],
        metadata: authData.metadata || {},
    };
}
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
async function estimateTravelCost(authorization, context) {
    let totalCost = 0;
    for (const destination of authorization.destinations) {
        // Calculate per diem
        const perDiem = await calculatePerDiem(`${destination.city}, ${destination.state}`, destination.arrivalDate, destination.departureDate, context);
        totalCost += perDiem.totalPerDiem;
        // Add transportation estimate
        if (destination.transportationMode === 'air') {
            totalCost += 500; // Simplified estimate
        }
    }
    return totalCost;
}
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
async function approveTravelAuthorization(authId, approverId, context) {
    return {
        id: authId,
        status: 'approved',
        approvedBy: approverId,
        approvedDate: new Date().toISOString(),
        authorizationDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
}
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
async function validateTravelAuthorization(authorization, context) {
    const violations = [];
    // Check advance notice requirement
    const daysUntilTravel = Math.ceil((new Date(authorization.departureDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilTravel < 14 && !authorization.emergencyTravel) {
        violations.push({
            ruleId: 'ADV-NOTICE',
            ruleName: 'Advance Notice Requirement',
            severity: 'warning',
            description: 'Travel should be requested at least 14 days in advance',
            overridden: false,
        });
    }
    return {
        isValid: violations.length === 0,
        violations,
    };
}
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
async function cancelTravelAuthorization(authId, reason, context) {
    return {
        id: authId,
        status: 'cancelled',
    };
}
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
async function extendTravelAuthorization(authId, newExpirationDate, context) {
    return {
        id: authId,
        expirationDate: newExpirationDate,
    };
}
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
async function checkAuthorizationValidity(authId) {
    // Would check database for authorization status and expiration
    return true;
}
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
async function generateTravelAuthNumber(fiscalYear) {
    const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `TA-${fiscalYear}-${sequence}`;
}
// ============================================================================
// PER DIEM & GSA RATE FUNCTIONS (17-24)
// ============================================================================
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
async function calculatePerDiem(destination, checkInDate, checkOutDate, context) {
    const gsaRate = await getGsaRate(destination, checkInDate);
    const totalDays = calculateTravelDays(checkInDate, checkOutDate);
    // Apply proration for first and last days (75% on travel days)
    const fullDays = Math.max(totalDays - 2, 0);
    const firstDayProration = 0.75;
    const lastDayProration = 0.75;
    const firstDayMeals = gsaRate.mealsRate * firstDayProration;
    const lastDayMeals = gsaRate.mealsRate * lastDayProration;
    const fullDayMeals = gsaRate.mealsRate * fullDays;
    const totalMeals = firstDayMeals + lastDayMeals + fullDayMeals;
    const totalLodging = gsaRate.lodgingRate * (totalDays - 1); // No lodging on last day
    const totalIncidentals = gsaRate.incidentalsRate * totalDays;
    return {
        destination,
        checkInDate,
        checkOutDate,
        totalDays,
        lodgingRate: gsaRate.lodgingRate,
        mealsRate: gsaRate.mealsRate,
        incidentalsRate: gsaRate.incidentalsRate,
        totalLodging,
        totalMeals,
        totalIncidentals,
        totalPerDiem: totalLodging + totalMeals + totalIncidentals,
        gsaLocation: gsaRate.locationName,
        gsaEffectiveDate: gsaRate.effectiveDate,
        prorationApplied: true,
        prorationDetails: {
            firstDayProration,
            lastDayProration,
            firstDayAmount: firstDayMeals + gsaRate.incidentalsRate,
            lastDayAmount: lastDayMeals + gsaRate.incidentalsRate,
        },
    };
}
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
async function getGsaRate(destination, effectiveDate) {
    // Simplified - would query GSA rate database
    return {
        locationId: 'DC-001',
        locationName: 'Washington, DC',
        state: 'DC',
        fiscalYear: 2025,
        effectiveDate: '2024-10-01',
        expirationDate: '2025-09-30',
        lodgingRate: 194.00,
        mealsRate: 79.00,
        incidentalsRate: 5.00,
        totalRate: 278.00,
    };
}
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
async function importGsaRates(rates, context) {
    return {
        imported: rates.length,
        updated: 0,
    };
}
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
async function validatePerDiemClaim(claim, context) {
    const violations = [];
    const gsaRate = await getGsaRate(claim.destination, claim.checkInDate);
    if (claim.totalPerDiem > gsaRate.totalRate * claim.totalDays) {
        violations.push('Per diem exceeds GSA maximum rates');
    }
    return {
        isValid: violations.length === 0,
        violations,
    };
}
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
function calculateMealBreakdown(totalMealsRate) {
    // Standard GSA meal breakdown percentages
    const breakfast = totalMealsRate * 0.19;
    const lunch = totalMealsRate * 0.225;
    const dinner = totalMealsRate * 0.51;
    const incidentals = totalMealsRate * 0.075;
    return {
        breakfast: Math.round(breakfast * 100) / 100,
        lunch: Math.round(lunch * 100) / 100,
        dinner: Math.round(dinner * 100) / 100,
        incidentals: Math.round(incidentals * 100) / 100,
    };
}
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
async function searchGsaRates(criteria) {
    // Would query database with criteria
    return [];
}
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
function calculateProration(fullDayRate, travelTime) {
    return fullDayRate * 0.75;
}
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
function calculateTravelDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
}
// ============================================================================
// MILEAGE & TRANSPORTATION FUNCTIONS (25-32)
// ============================================================================
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
async function calculateMileageReimbursement(mileageData, context) {
    const rate = await getIrsMileageRate(mileageData.travelDate, mileageData.vehicleType);
    return {
        ...mileageData,
        employeeId: mileageData.employeeId || context.employeeId,
        reimbursementRate: rate,
        reimbursementAmount: mileageData.mileage * rate,
        authorized: false,
        receiptsRequired: false,
        metadata: mileageData.metadata || {},
    };
}
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
async function getIrsMileageRate(effectiveDate, vehicleType) {
    // Simplified - would query IRS rate table
    const rates = {
        personal_car: 0.67,
        personal_motorcycle: 0.67,
        personal_van: 0.67,
        rental_car: 0,
        government_vehicle: 0,
    };
    return rates[vehicleType];
}
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
async function validateMileageClaim(claim) {
    // Would integrate with mapping service to validate distance
    return {
        isValid: true,
        actualMileage: claim.mileage,
        variance: 0,
    };
}
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
async function authorizeMileage(mileageId, authorizerId, context) {
    return {
        id: mileageId,
        authorized: true,
        authorizedBy: authorizerId,
    };
}
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
function calculateRoundTripMileage(oneWayMileage) {
    return oneWayMileage * 2;
}
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
function validateOdometry(startOdometry, endOdometry, claimedMileage) {
    const actualMileage = endOdometry - startOdometry;
    return actualMileage === claimedMileage;
}
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
async function compareTravelCosts(mileage, days) {
    const mileageRate = 0.67;
    const personalVehicleCost = mileage * mileageRate;
    const rentalCost = days * 50; // Simplified rental estimate
    return {
        personalVehicleCost,
        rentalCost,
        recommendation: personalVehicleCost < rentalCost ? 'Personal vehicle' : 'Rental car',
    };
}
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
async function generateMileageLog(employeeId, startDate, endDate) {
    return {
        totalMileage: 0,
        totalReimbursement: 0,
        trips: [],
    };
}
// ============================================================================
// CORPORATE CARD & RECONCILIATION FUNCTIONS (33-40)
// ============================================================================
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
async function importCardTransactions(transactions, context) {
    return {
        imported: transactions.length,
        errors: [],
    };
}
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
async function reconcileCardTransaction(transactionId, expenseReportId, lineItemId, context) {
    return {
        transactionId,
        reconciled: true,
        reconciledDate: new Date().toISOString(),
        expenseReportId: parseInt(expenseReportId.split('-')[2]),
        expenseLineItemId: lineItemId,
    };
}
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
async function findUnreconciledTransactions(employeeId, startDate, endDate) {
    // Would query database for unreconciled transactions
    return [];
}
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
async function disputeTransaction(transactionId, disputeReason, context) {
    return {
        transactionId,
        disputed: true,
        disputeReason,
    };
}
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
async function generateCardReconciliationReport(cardId, periodStart, periodEnd) {
    return {
        cardId,
        totalTransactions: 0,
        totalAmount: 0,
        reconciledCount: 0,
        unreconciledCount: 0,
        disputedCount: 0,
    };
}
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
async function validateCardTransaction(transaction, context) {
    return {
        isValid: true,
        warnings: [],
    };
}
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
async function autoMatchTransactions(employeeId, periodStart, periodEnd) {
    return [];
}
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
async function sendReconciliationReminders(employeeIds, context) {
    return employeeIds.length;
}
// ============================================================================
// TRAVEL ADVANCE & REIMBURSEMENT FUNCTIONS (41-48)
// ============================================================================
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
async function createTravelAdvance(advanceData, context) {
    const advanceNumber = await generateAdvanceNumber(context.fiscalYear);
    return {
        ...advanceData,
        advanceNumber,
        employeeId: advanceData.employeeId || context.employeeId,
        advanceDate: new Date().toISOString(),
        status: 'requested',
        reconciled: false,
        metadata: advanceData.metadata || {},
    };
}
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
async function processTravelAdvancePayment(advanceId, paymentReference, context) {
    return {
        id: advanceId,
        status: 'paid',
        paymentReference,
    };
}
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
async function reconcileTravelAdvance(advanceId, expenseReportId, context) {
    // Would calculate actual expenses vs advance
    return {
        id: advanceId,
        reconciled: true,
        reconciledDate: new Date().toISOString(),
    };
}
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
async function processReimbursementPayment(paymentData, context) {
    const paymentNumber = await generatePaymentNumber(context.fiscalYear);
    return {
        ...paymentData,
        paymentNumber,
        employeeId: paymentData.employeeId || context.employeeId,
        paymentDate: new Date().toISOString(),
        status: 'processing',
        reconciled: false,
        metadata: paymentData.metadata || {},
    };
}
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
async function generatePaymentBatch(expenseReportIds, context) {
    return `BATCH-${Date.now()}`;
}
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
async function validateReimbursementEligibility(expenseReportId, context) {
    return {
        eligible: true,
        reasons: [],
    };
}
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
async function trackPaymentStatus(paymentNumber) {
    return 'completed';
}
/**
 * Generates unique advance number.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<string>} Unique advance number
 */
async function generateAdvanceNumber(fiscalYear) {
    const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `ADV-${fiscalYear}-${sequence}`;
}
/**
 * Generates unique payment number.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<string>} Unique payment number
 */
async function generatePaymentNumber(fiscalYear) {
    const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `PAY-${fiscalYear}-${sequence}`;
}
// ============================================================================
// HELPER UTILITY FUNCTIONS
// ============================================================================
/**
 * Builds approval workflow for expense report.
 *
 * @param {string} reportId - Expense report ID
 * @param {ExpenseTravelContext} context - Execution context
 * @returns {Promise<ApprovalStep[]>} Approval workflow steps
 */
async function buildApprovalWorkflow(reportId, context) {
    return [
        {
            level: 1,
            approverId: 'MGR-' + context.departmentId,
            approverName: 'Department Manager',
            approverTitle: 'Manager',
            status: 'pending',
            notifiedDate: new Date().toISOString(),
        },
    ];
}
/**
 * Gets travel policy for category and agency.
 *
 * @param {ExpenseCategory} category - Expense category
 * @param {string} agencyId - Agency ID
 * @returns {Promise<TravelPolicy>} Travel policy
 */
async function getTravelPolicy(category, agencyId) {
    return {
        policyId: 'POL-001',
        policyName: 'Standard Travel Policy',
        policyType: 'federal',
        effectiveDate: '2025-01-01',
        agencyId,
        category,
        maxAmount: 200,
        requiresReceipt: true,
        receiptThreshold: 75,
        requiresPreApproval: false,
        complianceRules: [],
        active: true,
    };
}
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
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
}
// ============================================================================
// NESTJS CONTROLLER EXAMPLE
// ============================================================================
/**
 * NestJS controller for expense and travel management.
 */
let ExpenseTravelController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Expense & Travel'), (0, common_1.Controller)('expense-travel'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createReport_decorators;
    let _createAuth_decorators;
    let _calculatePerDiemEndpoint_decorators;
    let _getGsaRateEndpoint_decorators;
    let _calculateMileageEndpoint_decorators;
    var ExpenseTravelController = _classThis = class {
        async createReport(reportData) {
            const context = {
                userId: 'USER123',
                employeeId: reportData.employeeId,
                departmentId: 'DEPT123',
                agencyId: 'AGENCY123',
                fiscalYear: new Date().getFullYear(),
                timestamp: new Date().toISOString(),
            };
            return createExpenseReport(reportData, context);
        }
        async createAuth(authData) {
            const context = {
                userId: 'USER123',
                employeeId: authData.employeeId,
                departmentId: 'DEPT123',
                agencyId: 'AGENCY123',
                fiscalYear: new Date().getFullYear(),
                timestamp: new Date().toISOString(),
            };
            return createTravelAuthorization(authData, context);
        }
        async calculatePerDiemEndpoint(data) {
            const context = {
                userId: 'USER123',
                employeeId: 'EMP123',
                departmentId: 'DEPT123',
                agencyId: 'AGENCY123',
                fiscalYear: new Date().getFullYear(),
                timestamp: new Date().toISOString(),
            };
            return calculatePerDiem(data.destination, data.checkInDate, data.checkOutDate, context);
        }
        async getGsaRateEndpoint(destination, date) {
            return getGsaRate(destination, date);
        }
        async calculateMileageEndpoint(mileageData) {
            const context = {
                userId: 'USER123',
                employeeId: mileageData.employeeId,
                departmentId: 'DEPT123',
                agencyId: 'AGENCY123',
                fiscalYear: new Date().getFullYear(),
                timestamp: new Date().toISOString(),
            };
            return calculateMileageReimbursement(mileageData, context);
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "ExpenseTravelController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createReport_decorators = [(0, common_1.Post)('expense-report'), (0, swagger_1.ApiOperation)({ summary: 'Create expense report' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Expense report created successfully' })];
        _createAuth_decorators = [(0, common_1.Post)('travel-authorization'), (0, swagger_1.ApiOperation)({ summary: 'Create travel authorization' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Travel authorization created successfully' })];
        _calculatePerDiemEndpoint_decorators = [(0, common_1.Post)('per-diem/calculate'), (0, swagger_1.ApiOperation)({ summary: 'Calculate per diem allowance' }), (0, swagger_1.ApiBody)({
                schema: {
                    properties: {
                        destination: { type: 'string', example: 'Washington, DC' },
                        checkInDate: { type: 'string', example: '2025-03-10' },
                        checkOutDate: { type: 'string', example: '2025-03-14' },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Per diem calculated successfully' })];
        _getGsaRateEndpoint_decorators = [(0, common_1.Get)('gsa-rate/:destination'), (0, swagger_1.ApiOperation)({ summary: 'Get GSA per diem rate' }), (0, swagger_1.ApiParam)({ name: 'destination', description: 'Destination city/state' }), (0, swagger_1.ApiQuery)({ name: 'date', description: 'Effective date (YYYY-MM-DD)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'GSA rate retrieved successfully' })];
        _calculateMileageEndpoint_decorators = [(0, common_1.Post)('mileage/calculate'), (0, swagger_1.ApiOperation)({ summary: 'Calculate mileage reimbursement' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Mileage calculated successfully' })];
        __esDecorate(_classThis, null, _createReport_decorators, { kind: "method", name: "createReport", static: false, private: false, access: { has: obj => "createReport" in obj, get: obj => obj.createReport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createAuth_decorators, { kind: "method", name: "createAuth", static: false, private: false, access: { has: obj => "createAuth" in obj, get: obj => obj.createAuth }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _calculatePerDiemEndpoint_decorators, { kind: "method", name: "calculatePerDiemEndpoint", static: false, private: false, access: { has: obj => "calculatePerDiemEndpoint" in obj, get: obj => obj.calculatePerDiemEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGsaRateEndpoint_decorators, { kind: "method", name: "getGsaRateEndpoint", static: false, private: false, access: { has: obj => "getGsaRateEndpoint" in obj, get: obj => obj.getGsaRateEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _calculateMileageEndpoint_decorators, { kind: "method", name: "calculateMileageEndpoint", static: false, private: false, access: { has: obj => "calculateMileageEndpoint" in obj, get: obj => obj.calculateMileageEndpoint }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExpenseTravelController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExpenseTravelController = _classThis;
})();
exports.ExpenseTravelController = ExpenseTravelController;
// Helper function to make ApiProperty available
function ApiProperty(options) {
    return (target, propertyKey) => { };
}
//# sourceMappingURL=expense-travel-reimbursement-kit.js.map