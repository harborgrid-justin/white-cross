"use strict";
/**
 * LOC: LEGAL_BILLING_TIMEKEEPING_KIT_001
 * File: /reuse/legal/legal-billing-timekeeping-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Legal billing modules
 *   - Time tracking controllers
 *   - Invoice management services
 *   - Trust accounting services
 *   - WIP management services
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustTransactionDto = exports.ExpenseDto = exports.InvoiceDto = exports.TimeEntryDto = exports.BillingTimekeepingService = exports.PaymentModel = exports.WIPEntryModel = exports.TrustTransactionModel = exports.TrustAccountModel = exports.ExpenseModel = exports.InvoiceLineItemModel = exports.InvoiceModel = exports.BillingRateModel = exports.TimeEntryModel = exports.PaymentCreateSchema = exports.TrustTransactionCreateSchema = exports.ExpenseCreateSchema = exports.InvoiceCreateSchema = exports.BillingRateCreateSchema = exports.TimeEntryCreateSchema = exports.PaymentMethod = exports.PaymentStatus = exports.WIPStatus = exports.TrustAccountTransactionType = exports.ExpenseCategory = exports.InvoiceStatus = exports.BillingRateType = exports.TimeEntryStatus = void 0;
exports.registerBillingConfig = registerBillingConfig;
exports.createBillingConfigModule = createBillingConfigModule;
exports.createTimeEntry = createTimeEntry;
exports.updateTimeEntry = updateTimeEntry;
exports.deleteTimeEntry = deleteTimeEntry;
exports.getTimeEntriesByMatter = getTimeEntriesByMatter;
exports.getTimeEntriesByTimekeeper = getTimeEntriesByTimekeeper;
exports.calculateBillableHours = calculateBillableHours;
exports.createBillingRate = createBillingRate;
exports.getBillingRateForTimekeeper = getBillingRateForTimekeeper;
exports.updateBillingRate = updateBillingRate;
exports.calculateBillingAmount = calculateBillingAmount;
exports.generateInvoiceNumber = generateInvoiceNumber;
exports.createInvoice = createInvoice;
exports.addLineItemToInvoice = addLineItemToInvoice;
exports.calculateInvoiceTotal = calculateInvoiceTotal;
exports.finalizeInvoice = finalizeInvoice;
exports.sendInvoice = sendInvoice;
exports.markInvoiceAsPaid = markInvoiceAsPaid;
exports.voidInvoice = voidInvoice;
exports.getInvoicesByMatter = getInvoicesByMatter;
exports.getInvoicesByClient = getInvoicesByClient;
exports.createExpense = createExpense;
exports.getExpensesByMatter = getExpensesByMatter;
exports.reimburseExpense = reimburseExpense;
exports.createTrustAccount = createTrustAccount;
exports.depositToTrust = depositToTrust;
exports.withdrawFromTrust = withdrawFromTrust;
exports.transferBetweenTrust = transferBetweenTrust;
exports.getTrustBalance = getTrustBalance;
exports.getTrustTransactionHistory = getTrustTransactionHistory;
exports.reconcileTrustAccount = reconcileTrustAccount;
exports.createWIPEntry = createWIPEntry;
exports.convertWIPToInvoice = convertWIPToInvoice;
exports.getWIPByMatter = getWIPByMatter;
exports.writeOffWIP = writeOffWIP;
exports.generateAgingReport = generateAgingReport;
/**
 * File: /reuse/legal/legal-billing-timekeeping-kit.ts
 * Locator: WC-LEGAL-BILLING-TIMEKEEPING-KIT-001
 * Purpose: Production-Grade Legal Billing and Timekeeping Kit - Enterprise legal billing management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod
 * Downstream: ../backend/modules/legal/*, Billing controllers, Trust accounting services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 38 production-ready legal billing and timekeeping functions for legal platforms
 *
 * LLM Context: Production-grade legal billing and timekeeping toolkit for White Cross platform.
 * Provides comprehensive time entry recording with billable/non-billable tracking, billing rate
 * management with hourly/flat/contingency rates, invoice generation with automatic calculations,
 * expense tracking with reimbursable costs, trust accounting with IOLTA compliance, WIP (Work in
 * Progress) tracking with matter-based aggregation, Sequelize models for time entries/invoices/
 * trust accounts, NestJS services with dependency injection, Swagger API documentation, payment
 * processing with multiple payment methods, aging report generation, automatic invoice numbering,
 * tax calculation, discount management, retainer tracking, billing adjustments, write-offs,
 * time entry validation with minimum/maximum hours, billing rate tiers, multi-currency support,
 * trust account reconciliation, LEDES format export, legal ethics compliance checks, and
 * healthcare legal billing specifics (provider agreements, medical malpractice, HIPAA compliance).
 */
const crypto = __importStar(require("crypto"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Time entry status lifecycle
 */
var TimeEntryStatus;
(function (TimeEntryStatus) {
    TimeEntryStatus["DRAFT"] = "draft";
    TimeEntryStatus["SUBMITTED"] = "submitted";
    TimeEntryStatus["APPROVED"] = "approved";
    TimeEntryStatus["REJECTED"] = "rejected";
    TimeEntryStatus["BILLED"] = "billed";
    TimeEntryStatus["WRITTEN_OFF"] = "written_off";
})(TimeEntryStatus || (exports.TimeEntryStatus = TimeEntryStatus = {}));
/**
 * Billing rate types
 */
var BillingRateType;
(function (BillingRateType) {
    BillingRateType["HOURLY"] = "hourly";
    BillingRateType["FLAT_FEE"] = "flat_fee";
    BillingRateType["CONTINGENCY"] = "contingency";
    BillingRateType["BLENDED"] = "blended";
    BillingRateType["STATUTORY"] = "statutory";
    BillingRateType["CUSTOM"] = "custom";
})(BillingRateType || (exports.BillingRateType = BillingRateType = {}));
/**
 * Invoice status lifecycle
 */
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "draft";
    InvoiceStatus["PENDING_REVIEW"] = "pending_review";
    InvoiceStatus["APPROVED"] = "approved";
    InvoiceStatus["SENT"] = "sent";
    InvoiceStatus["PARTIALLY_PAID"] = "partially_paid";
    InvoiceStatus["PAID"] = "paid";
    InvoiceStatus["OVERDUE"] = "overdue";
    InvoiceStatus["VOID"] = "void";
    InvoiceStatus["WRITTEN_OFF"] = "written_off";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
/**
 * Expense categories
 */
var ExpenseCategory;
(function (ExpenseCategory) {
    ExpenseCategory["FILING_FEES"] = "filing_fees";
    ExpenseCategory["COURT_COSTS"] = "court_costs";
    ExpenseCategory["EXPERT_WITNESS"] = "expert_witness";
    ExpenseCategory["DEPOSITION"] = "deposition";
    ExpenseCategory["COPYING"] = "copying";
    ExpenseCategory["POSTAGE"] = "postage";
    ExpenseCategory["TRAVEL"] = "travel";
    ExpenseCategory["MEALS"] = "meals";
    ExpenseCategory["RESEARCH"] = "research";
    ExpenseCategory["MEDICAL_RECORDS"] = "medical_records";
    ExpenseCategory["TRANSCRIPTS"] = "transcripts";
    ExpenseCategory["PROCESS_SERVICE"] = "process_service";
    ExpenseCategory["OTHER"] = "other";
})(ExpenseCategory || (exports.ExpenseCategory = ExpenseCategory = {}));
/**
 * Trust account transaction types
 */
var TrustAccountTransactionType;
(function (TrustAccountTransactionType) {
    TrustAccountTransactionType["DEPOSIT"] = "deposit";
    TrustAccountTransactionType["WITHDRAWAL"] = "withdrawal";
    TrustAccountTransactionType["TRANSFER"] = "transfer";
    TrustAccountTransactionType["INTEREST"] = "interest";
    TrustAccountTransactionType["FEE"] = "fee";
    TrustAccountTransactionType["REFUND"] = "refund";
    TrustAccountTransactionType["ADJUSTMENT"] = "adjustment";
})(TrustAccountTransactionType || (exports.TrustAccountTransactionType = TrustAccountTransactionType = {}));
/**
 * WIP (Work in Progress) status
 */
var WIPStatus;
(function (WIPStatus) {
    WIPStatus["UNBILLED"] = "unbilled";
    WIPStatus["BILLED"] = "billed";
    WIPStatus["WRITTEN_OFF"] = "written_off";
    WIPStatus["TRANSFERRED"] = "transferred";
})(WIPStatus || (exports.WIPStatus = WIPStatus = {}));
/**
 * Payment status
 */
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PROCESSING"] = "processing";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
    PaymentStatus["CANCELLED"] = "cancelled";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
/**
 * Payment methods
 */
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CREDIT_CARD"] = "credit_card";
    PaymentMethod["ACH"] = "ach";
    PaymentMethod["WIRE_TRANSFER"] = "wire_transfer";
    PaymentMethod["CHECK"] = "check";
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["TRUST_TRANSFER"] = "trust_transfer";
    PaymentMethod["OTHER"] = "other";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Time entry creation schema
 */
exports.TimeEntryCreateSchema = zod_1.z.object({
    timekeeperId: zod_1.z.string().uuid(),
    matterId: zod_1.z.string().uuid(),
    clientId: zod_1.z.string().uuid(),
    date: zod_1.z.date(),
    hours: zod_1.z.number().min(0).max(24),
    description: zod_1.z.string().min(1).max(2000),
    taskCode: zod_1.z.string().optional(),
    activityCode: zod_1.z.string().optional(),
    billable: zod_1.z.boolean().default(true),
    billingRate: zod_1.z.number().min(0).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
/**
 * Billing rate creation schema
 */
exports.BillingRateCreateSchema = zod_1.z.object({
    timekeeperId: zod_1.z.string().uuid().optional(),
    clientId: zod_1.z.string().uuid().optional(),
    matterId: zod_1.z.string().uuid().optional(),
    matterTypeId: zod_1.z.string().uuid().optional(),
    rateType: zod_1.z.nativeEnum(BillingRateType),
    hourlyRate: zod_1.z.number().min(0).optional(),
    flatFeeAmount: zod_1.z.number().min(0).optional(),
    contingencyPercentage: zod_1.z.number().min(0).max(100).optional(),
    currency: zod_1.z.string().length(3).default('USD'),
    effectiveDate: zod_1.z.date(),
    expirationDate: zod_1.z.date().optional(),
    isActive: zod_1.z.boolean().default(true),
    description: zod_1.z.string().max(500).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
/**
 * Invoice creation schema
 */
exports.InvoiceCreateSchema = zod_1.z.object({
    matterId: zod_1.z.string().uuid(),
    clientId: zod_1.z.string().uuid(),
    invoiceDate: zod_1.z.date(),
    dueDate: zod_1.z.date(),
    periodStart: zod_1.z.date(),
    periodEnd: zod_1.z.date(),
    taxRate: zod_1.z.number().min(0).max(100).optional(),
    discountAmount: zod_1.z.number().min(0).optional(),
    currency: zod_1.z.string().length(3).default('USD'),
    notes: zod_1.z.string().max(2000).optional(),
    termsAndConditions: zod_1.z.string().max(5000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
/**
 * Expense creation schema
 */
exports.ExpenseCreateSchema = zod_1.z.object({
    matterId: zod_1.z.string().uuid(),
    clientId: zod_1.z.string().uuid(),
    category: zod_1.z.nativeEnum(ExpenseCategory),
    description: zod_1.z.string().min(1).max(1000),
    amount: zod_1.z.number().min(0),
    currency: zod_1.z.string().length(3).default('USD'),
    expenseDate: zod_1.z.date(),
    reimbursable: zod_1.z.boolean().default(true),
    billable: zod_1.z.boolean().default(true),
    receiptUrl: zod_1.z.string().url().optional(),
    vendorName: zod_1.z.string().max(255).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
/**
 * Trust transaction schema
 */
exports.TrustTransactionCreateSchema = zod_1.z.object({
    trustAccountId: zod_1.z.string().uuid(),
    transactionType: zod_1.z.nativeEnum(TrustAccountTransactionType),
    amount: zod_1.z.number().min(0),
    transactionDate: zod_1.z.date(),
    description: zod_1.z.string().min(1).max(1000),
    reference: zod_1.z.string().max(255).optional(),
    relatedInvoiceId: zod_1.z.string().uuid().optional(),
    relatedPaymentId: zod_1.z.string().uuid().optional(),
    fromAccountId: zod_1.z.string().uuid().optional(),
    toAccountId: zod_1.z.string().uuid().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
/**
 * Payment creation schema
 */
exports.PaymentCreateSchema = zod_1.z.object({
    invoiceId: zod_1.z.string().uuid(),
    clientId: zod_1.z.string().uuid(),
    amount: zod_1.z.number().min(0),
    currency: zod_1.z.string().length(3).default('USD'),
    paymentMethod: zod_1.z.nativeEnum(PaymentMethod),
    paymentDate: zod_1.z.date(),
    reference: zod_1.z.string().max(255).optional(),
    transactionId: zod_1.z.string().max(255).optional(),
    checkNumber: zod_1.z.string().max(100).optional(),
    trustAccountId: zod_1.z.string().uuid().optional(),
    notes: zod_1.z.string().max(1000).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Time Entry Sequelize Model
 */
let TimeEntryModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'time_entries',
            timestamps: true,
            paranoid: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _timekeeperId_decorators;
    let _timekeeperId_initializers = [];
    let _timekeeperId_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _date_decorators;
    let _date_initializers = [];
    let _date_extraInitializers = [];
    let _hours_decorators;
    let _hours_initializers = [];
    let _hours_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _taskCode_decorators;
    let _taskCode_initializers = [];
    let _taskCode_extraInitializers = [];
    let _activityCode_decorators;
    let _activityCode_initializers = [];
    let _activityCode_extraInitializers = [];
    let _billable_decorators;
    let _billable_initializers = [];
    let _billable_extraInitializers = [];
    let _billingRate_decorators;
    let _billingRate_initializers = [];
    let _billingRate_extraInitializers = [];
    let _billingAmount_decorators;
    let _billingAmount_initializers = [];
    let _billingAmount_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _billedAt_decorators;
    let _billedAt_initializers = [];
    let _billedAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var TimeEntryModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.timekeeperId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _timekeeperId_initializers, void 0));
            this.matterId = (__runInitializers(this, _timekeeperId_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.clientId = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.date = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _date_initializers, void 0));
            this.hours = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _hours_initializers, void 0));
            this.description = (__runInitializers(this, _hours_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.taskCode = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _taskCode_initializers, void 0));
            this.activityCode = (__runInitializers(this, _taskCode_extraInitializers), __runInitializers(this, _activityCode_initializers, void 0));
            this.billable = (__runInitializers(this, _activityCode_extraInitializers), __runInitializers(this, _billable_initializers, void 0));
            this.billingRate = (__runInitializers(this, _billable_extraInitializers), __runInitializers(this, _billingRate_initializers, void 0));
            this.billingAmount = (__runInitializers(this, _billingRate_extraInitializers), __runInitializers(this, _billingAmount_initializers, void 0));
            this.status = (__runInitializers(this, _billingAmount_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.invoiceId = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _invoiceId_initializers, void 0));
            this.billedAt = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _billedAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _billedAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TimeEntryModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _timekeeperId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _matterId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _date_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _hours_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _taskCode_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _activityCode_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _billable_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            })];
        _billingRate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _billingAmount_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TimeEntryStatus)),
                defaultValue: TimeEntryStatus.DRAFT,
            })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _invoiceId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _billedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _timekeeperId_decorators, { kind: "field", name: "timekeeperId", static: false, private: false, access: { has: obj => "timekeeperId" in obj, get: obj => obj.timekeeperId, set: (obj, value) => { obj.timekeeperId = value; } }, metadata: _metadata }, _timekeeperId_initializers, _timekeeperId_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: obj => "date" in obj, get: obj => obj.date, set: (obj, value) => { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
        __esDecorate(null, null, _hours_decorators, { kind: "field", name: "hours", static: false, private: false, access: { has: obj => "hours" in obj, get: obj => obj.hours, set: (obj, value) => { obj.hours = value; } }, metadata: _metadata }, _hours_initializers, _hours_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _taskCode_decorators, { kind: "field", name: "taskCode", static: false, private: false, access: { has: obj => "taskCode" in obj, get: obj => obj.taskCode, set: (obj, value) => { obj.taskCode = value; } }, metadata: _metadata }, _taskCode_initializers, _taskCode_extraInitializers);
        __esDecorate(null, null, _activityCode_decorators, { kind: "field", name: "activityCode", static: false, private: false, access: { has: obj => "activityCode" in obj, get: obj => obj.activityCode, set: (obj, value) => { obj.activityCode = value; } }, metadata: _metadata }, _activityCode_initializers, _activityCode_extraInitializers);
        __esDecorate(null, null, _billable_decorators, { kind: "field", name: "billable", static: false, private: false, access: { has: obj => "billable" in obj, get: obj => obj.billable, set: (obj, value) => { obj.billable = value; } }, metadata: _metadata }, _billable_initializers, _billable_extraInitializers);
        __esDecorate(null, null, _billingRate_decorators, { kind: "field", name: "billingRate", static: false, private: false, access: { has: obj => "billingRate" in obj, get: obj => obj.billingRate, set: (obj, value) => { obj.billingRate = value; } }, metadata: _metadata }, _billingRate_initializers, _billingRate_extraInitializers);
        __esDecorate(null, null, _billingAmount_decorators, { kind: "field", name: "billingAmount", static: false, private: false, access: { has: obj => "billingAmount" in obj, get: obj => obj.billingAmount, set: (obj, value) => { obj.billingAmount = value; } }, metadata: _metadata }, _billingAmount_initializers, _billingAmount_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
        __esDecorate(null, null, _billedAt_decorators, { kind: "field", name: "billedAt", static: false, private: false, access: { has: obj => "billedAt" in obj, get: obj => obj.billedAt, set: (obj, value) => { obj.billedAt = value; } }, metadata: _metadata }, _billedAt_initializers, _billedAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TimeEntryModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TimeEntryModel = _classThis;
})();
exports.TimeEntryModel = TimeEntryModel;
/**
 * Billing Rate Sequelize Model
 */
let BillingRateModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'billing_rates',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _timekeeperId_decorators;
    let _timekeeperId_initializers = [];
    let _timekeeperId_extraInitializers = [];
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _matterTypeId_decorators;
    let _matterTypeId_initializers = [];
    let _matterTypeId_extraInitializers = [];
    let _rateType_decorators;
    let _rateType_initializers = [];
    let _rateType_extraInitializers = [];
    let _hourlyRate_decorators;
    let _hourlyRate_initializers = [];
    let _hourlyRate_extraInitializers = [];
    let _flatFeeAmount_decorators;
    let _flatFeeAmount_initializers = [];
    let _flatFeeAmount_extraInitializers = [];
    let _contingencyPercentage_decorators;
    let _contingencyPercentage_initializers = [];
    let _contingencyPercentage_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var BillingRateModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.timekeeperId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _timekeeperId_initializers, void 0));
            this.clientId = (__runInitializers(this, _timekeeperId_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.matterId = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.matterTypeId = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _matterTypeId_initializers, void 0));
            this.rateType = (__runInitializers(this, _matterTypeId_extraInitializers), __runInitializers(this, _rateType_initializers, void 0));
            this.hourlyRate = (__runInitializers(this, _rateType_extraInitializers), __runInitializers(this, _hourlyRate_initializers, void 0));
            this.flatFeeAmount = (__runInitializers(this, _hourlyRate_extraInitializers), __runInitializers(this, _flatFeeAmount_initializers, void 0));
            this.contingencyPercentage = (__runInitializers(this, _flatFeeAmount_extraInitializers), __runInitializers(this, _contingencyPercentage_initializers, void 0));
            this.currency = (__runInitializers(this, _contingencyPercentage_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.isActive = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.description = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.metadata = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "BillingRateModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _timekeeperId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _matterId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _matterTypeId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _rateType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(BillingRateType)),
                allowNull: false,
            })];
        _hourlyRate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _flatFeeAmount_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _contingencyPercentage_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _currency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                defaultValue: 'USD',
            })];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _expirationDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _timekeeperId_decorators, { kind: "field", name: "timekeeperId", static: false, private: false, access: { has: obj => "timekeeperId" in obj, get: obj => obj.timekeeperId, set: (obj, value) => { obj.timekeeperId = value; } }, metadata: _metadata }, _timekeeperId_initializers, _timekeeperId_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _matterTypeId_decorators, { kind: "field", name: "matterTypeId", static: false, private: false, access: { has: obj => "matterTypeId" in obj, get: obj => obj.matterTypeId, set: (obj, value) => { obj.matterTypeId = value; } }, metadata: _metadata }, _matterTypeId_initializers, _matterTypeId_extraInitializers);
        __esDecorate(null, null, _rateType_decorators, { kind: "field", name: "rateType", static: false, private: false, access: { has: obj => "rateType" in obj, get: obj => obj.rateType, set: (obj, value) => { obj.rateType = value; } }, metadata: _metadata }, _rateType_initializers, _rateType_extraInitializers);
        __esDecorate(null, null, _hourlyRate_decorators, { kind: "field", name: "hourlyRate", static: false, private: false, access: { has: obj => "hourlyRate" in obj, get: obj => obj.hourlyRate, set: (obj, value) => { obj.hourlyRate = value; } }, metadata: _metadata }, _hourlyRate_initializers, _hourlyRate_extraInitializers);
        __esDecorate(null, null, _flatFeeAmount_decorators, { kind: "field", name: "flatFeeAmount", static: false, private: false, access: { has: obj => "flatFeeAmount" in obj, get: obj => obj.flatFeeAmount, set: (obj, value) => { obj.flatFeeAmount = value; } }, metadata: _metadata }, _flatFeeAmount_initializers, _flatFeeAmount_extraInitializers);
        __esDecorate(null, null, _contingencyPercentage_decorators, { kind: "field", name: "contingencyPercentage", static: false, private: false, access: { has: obj => "contingencyPercentage" in obj, get: obj => obj.contingencyPercentage, set: (obj, value) => { obj.contingencyPercentage = value; } }, metadata: _metadata }, _contingencyPercentage_initializers, _contingencyPercentage_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BillingRateModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BillingRateModel = _classThis;
})();
exports.BillingRateModel = BillingRateModel;
/**
 * Invoice Sequelize Model
 */
let InvoiceModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'invoices',
            timestamps: true,
            paranoid: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _invoiceNumber_decorators;
    let _invoiceNumber_initializers = [];
    let _invoiceNumber_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _invoiceDate_decorators;
    let _invoiceDate_initializers = [];
    let _invoiceDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _subtotal_decorators;
    let _subtotal_initializers = [];
    let _subtotal_extraInitializers = [];
    let _taxRate_decorators;
    let _taxRate_initializers = [];
    let _taxRate_extraInitializers = [];
    let _taxAmount_decorators;
    let _taxAmount_initializers = [];
    let _taxAmount_extraInitializers = [];
    let _discountAmount_decorators;
    let _discountAmount_initializers = [];
    let _discountAmount_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _amountPaid_decorators;
    let _amountPaid_initializers = [];
    let _amountPaid_extraInitializers = [];
    let _amountDue_decorators;
    let _amountDue_initializers = [];
    let _amountDue_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _termsAndConditions_decorators;
    let _termsAndConditions_initializers = [];
    let _termsAndConditions_extraInitializers = [];
    let _sentAt_decorators;
    let _sentAt_initializers = [];
    let _sentAt_extraInitializers = [];
    let _paidAt_decorators;
    let _paidAt_initializers = [];
    let _paidAt_extraInitializers = [];
    let _voidedAt_decorators;
    let _voidedAt_initializers = [];
    let _voidedAt_extraInitializers = [];
    let _voidReason_decorators;
    let _voidReason_initializers = [];
    let _voidReason_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _lineItems_decorators;
    let _lineItems_initializers = [];
    let _lineItems_extraInitializers = [];
    var InvoiceModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.invoiceNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _invoiceNumber_initializers, void 0));
            this.matterId = (__runInitializers(this, _invoiceNumber_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.clientId = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.invoiceDate = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _invoiceDate_initializers, void 0));
            this.dueDate = (__runInitializers(this, _invoiceDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.periodStart = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
            this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
            this.status = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.subtotal = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _subtotal_initializers, void 0));
            this.taxRate = (__runInitializers(this, _subtotal_extraInitializers), __runInitializers(this, _taxRate_initializers, void 0));
            this.taxAmount = (__runInitializers(this, _taxRate_extraInitializers), __runInitializers(this, _taxAmount_initializers, void 0));
            this.discountAmount = (__runInitializers(this, _taxAmount_extraInitializers), __runInitializers(this, _discountAmount_initializers, void 0));
            this.totalAmount = (__runInitializers(this, _discountAmount_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
            this.amountPaid = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _amountPaid_initializers, void 0));
            this.amountDue = (__runInitializers(this, _amountPaid_extraInitializers), __runInitializers(this, _amountDue_initializers, void 0));
            this.currency = (__runInitializers(this, _amountDue_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.notes = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.termsAndConditions = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _termsAndConditions_initializers, void 0));
            this.sentAt = (__runInitializers(this, _termsAndConditions_extraInitializers), __runInitializers(this, _sentAt_initializers, void 0));
            this.paidAt = (__runInitializers(this, _sentAt_extraInitializers), __runInitializers(this, _paidAt_initializers, void 0));
            this.voidedAt = (__runInitializers(this, _paidAt_extraInitializers), __runInitializers(this, _voidedAt_initializers, void 0));
            this.voidReason = (__runInitializers(this, _voidedAt_extraInitializers), __runInitializers(this, _voidReason_initializers, void 0));
            this.metadata = (__runInitializers(this, _voidReason_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.lineItems = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _lineItems_initializers, void 0));
            __runInitializers(this, _lineItems_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "InvoiceModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _invoiceNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                unique: true,
                allowNull: false,
            })];
        _matterId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _invoiceDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _periodStart_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _periodEnd_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(InvoiceStatus)),
                defaultValue: InvoiceStatus.DRAFT,
            })];
        _subtotal_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                defaultValue: 0,
            })];
        _taxRate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _taxAmount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                defaultValue: 0,
            })];
        _discountAmount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                defaultValue: 0,
            })];
        _totalAmount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                defaultValue: 0,
            })];
        _amountPaid_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                defaultValue: 0,
            })];
        _amountDue_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                defaultValue: 0,
            })];
        _currency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                defaultValue: 'USD',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _termsAndConditions_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _sentAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _paidAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _voidedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _voidReason_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _lineItems_decorators = [(0, sequelize_typescript_1.HasMany)(() => InvoiceLineItemModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _invoiceNumber_decorators, { kind: "field", name: "invoiceNumber", static: false, private: false, access: { has: obj => "invoiceNumber" in obj, get: obj => obj.invoiceNumber, set: (obj, value) => { obj.invoiceNumber = value; } }, metadata: _metadata }, _invoiceNumber_initializers, _invoiceNumber_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _invoiceDate_decorators, { kind: "field", name: "invoiceDate", static: false, private: false, access: { has: obj => "invoiceDate" in obj, get: obj => obj.invoiceDate, set: (obj, value) => { obj.invoiceDate = value; } }, metadata: _metadata }, _invoiceDate_initializers, _invoiceDate_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
        __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _subtotal_decorators, { kind: "field", name: "subtotal", static: false, private: false, access: { has: obj => "subtotal" in obj, get: obj => obj.subtotal, set: (obj, value) => { obj.subtotal = value; } }, metadata: _metadata }, _subtotal_initializers, _subtotal_extraInitializers);
        __esDecorate(null, null, _taxRate_decorators, { kind: "field", name: "taxRate", static: false, private: false, access: { has: obj => "taxRate" in obj, get: obj => obj.taxRate, set: (obj, value) => { obj.taxRate = value; } }, metadata: _metadata }, _taxRate_initializers, _taxRate_extraInitializers);
        __esDecorate(null, null, _taxAmount_decorators, { kind: "field", name: "taxAmount", static: false, private: false, access: { has: obj => "taxAmount" in obj, get: obj => obj.taxAmount, set: (obj, value) => { obj.taxAmount = value; } }, metadata: _metadata }, _taxAmount_initializers, _taxAmount_extraInitializers);
        __esDecorate(null, null, _discountAmount_decorators, { kind: "field", name: "discountAmount", static: false, private: false, access: { has: obj => "discountAmount" in obj, get: obj => obj.discountAmount, set: (obj, value) => { obj.discountAmount = value; } }, metadata: _metadata }, _discountAmount_initializers, _discountAmount_extraInitializers);
        __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
        __esDecorate(null, null, _amountPaid_decorators, { kind: "field", name: "amountPaid", static: false, private: false, access: { has: obj => "amountPaid" in obj, get: obj => obj.amountPaid, set: (obj, value) => { obj.amountPaid = value; } }, metadata: _metadata }, _amountPaid_initializers, _amountPaid_extraInitializers);
        __esDecorate(null, null, _amountDue_decorators, { kind: "field", name: "amountDue", static: false, private: false, access: { has: obj => "amountDue" in obj, get: obj => obj.amountDue, set: (obj, value) => { obj.amountDue = value; } }, metadata: _metadata }, _amountDue_initializers, _amountDue_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _termsAndConditions_decorators, { kind: "field", name: "termsAndConditions", static: false, private: false, access: { has: obj => "termsAndConditions" in obj, get: obj => obj.termsAndConditions, set: (obj, value) => { obj.termsAndConditions = value; } }, metadata: _metadata }, _termsAndConditions_initializers, _termsAndConditions_extraInitializers);
        __esDecorate(null, null, _sentAt_decorators, { kind: "field", name: "sentAt", static: false, private: false, access: { has: obj => "sentAt" in obj, get: obj => obj.sentAt, set: (obj, value) => { obj.sentAt = value; } }, metadata: _metadata }, _sentAt_initializers, _sentAt_extraInitializers);
        __esDecorate(null, null, _paidAt_decorators, { kind: "field", name: "paidAt", static: false, private: false, access: { has: obj => "paidAt" in obj, get: obj => obj.paidAt, set: (obj, value) => { obj.paidAt = value; } }, metadata: _metadata }, _paidAt_initializers, _paidAt_extraInitializers);
        __esDecorate(null, null, _voidedAt_decorators, { kind: "field", name: "voidedAt", static: false, private: false, access: { has: obj => "voidedAt" in obj, get: obj => obj.voidedAt, set: (obj, value) => { obj.voidedAt = value; } }, metadata: _metadata }, _voidedAt_initializers, _voidedAt_extraInitializers);
        __esDecorate(null, null, _voidReason_decorators, { kind: "field", name: "voidReason", static: false, private: false, access: { has: obj => "voidReason" in obj, get: obj => obj.voidReason, set: (obj, value) => { obj.voidReason = value; } }, metadata: _metadata }, _voidReason_initializers, _voidReason_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _lineItems_decorators, { kind: "field", name: "lineItems", static: false, private: false, access: { has: obj => "lineItems" in obj, get: obj => obj.lineItems, set: (obj, value) => { obj.lineItems = value; } }, metadata: _metadata }, _lineItems_initializers, _lineItems_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InvoiceModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InvoiceModel = _classThis;
})();
exports.InvoiceModel = InvoiceModel;
/**
 * Invoice Line Item Sequelize Model
 */
let InvoiceLineItemModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'invoice_line_items',
            timestamps: false,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _unitPrice_decorators;
    let _unitPrice_initializers = [];
    let _unitPrice_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _timeEntryId_decorators;
    let _timeEntryId_initializers = [];
    let _timeEntryId_extraInitializers = [];
    let _expenseId_decorators;
    let _expenseId_initializers = [];
    let _expenseId_extraInitializers = [];
    let _taxable_decorators;
    let _taxable_initializers = [];
    let _taxable_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _invoice_decorators;
    let _invoice_initializers = [];
    let _invoice_extraInitializers = [];
    var InvoiceLineItemModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.invoiceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _invoiceId_initializers, void 0));
            this.type = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.description = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.quantity = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
            this.unitPrice = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _unitPrice_initializers, void 0));
            this.amount = (__runInitializers(this, _unitPrice_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.timeEntryId = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _timeEntryId_initializers, void 0));
            this.expenseId = (__runInitializers(this, _timeEntryId_extraInitializers), __runInitializers(this, _expenseId_initializers, void 0));
            this.taxable = (__runInitializers(this, _expenseId_extraInitializers), __runInitializers(this, _taxable_initializers, void 0));
            this.metadata = (__runInitializers(this, _taxable_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.invoice = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _invoice_initializers, void 0));
            __runInitializers(this, _invoice_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "InvoiceLineItemModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _invoiceId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => InvoiceModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('time', 'expense', 'fee', 'adjustment'),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _quantity_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
                allowNull: false,
            })];
        _unitPrice_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _amount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _timeEntryId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _expenseId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _taxable_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _invoice_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => InvoiceModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
        __esDecorate(null, null, _unitPrice_decorators, { kind: "field", name: "unitPrice", static: false, private: false, access: { has: obj => "unitPrice" in obj, get: obj => obj.unitPrice, set: (obj, value) => { obj.unitPrice = value; } }, metadata: _metadata }, _unitPrice_initializers, _unitPrice_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _timeEntryId_decorators, { kind: "field", name: "timeEntryId", static: false, private: false, access: { has: obj => "timeEntryId" in obj, get: obj => obj.timeEntryId, set: (obj, value) => { obj.timeEntryId = value; } }, metadata: _metadata }, _timeEntryId_initializers, _timeEntryId_extraInitializers);
        __esDecorate(null, null, _expenseId_decorators, { kind: "field", name: "expenseId", static: false, private: false, access: { has: obj => "expenseId" in obj, get: obj => obj.expenseId, set: (obj, value) => { obj.expenseId = value; } }, metadata: _metadata }, _expenseId_initializers, _expenseId_extraInitializers);
        __esDecorate(null, null, _taxable_decorators, { kind: "field", name: "taxable", static: false, private: false, access: { has: obj => "taxable" in obj, get: obj => obj.taxable, set: (obj, value) => { obj.taxable = value; } }, metadata: _metadata }, _taxable_initializers, _taxable_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _invoice_decorators, { kind: "field", name: "invoice", static: false, private: false, access: { has: obj => "invoice" in obj, get: obj => obj.invoice, set: (obj, value) => { obj.invoice = value; } }, metadata: _metadata }, _invoice_initializers, _invoice_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InvoiceLineItemModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InvoiceLineItemModel = _classThis;
})();
exports.InvoiceLineItemModel = InvoiceLineItemModel;
/**
 * Expense Sequelize Model
 */
let ExpenseModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'expenses',
            timestamps: true,
            paranoid: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _expenseDate_decorators;
    let _expenseDate_initializers = [];
    let _expenseDate_extraInitializers = [];
    let _reimbursable_decorators;
    let _reimbursable_initializers = [];
    let _reimbursable_extraInitializers = [];
    let _billable_decorators;
    let _billable_initializers = [];
    let _billable_extraInitializers = [];
    let _receiptUrl_decorators;
    let _receiptUrl_initializers = [];
    let _receiptUrl_extraInitializers = [];
    let _vendorName_decorators;
    let _vendorName_initializers = [];
    let _vendorName_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _billedAt_decorators;
    let _billedAt_initializers = [];
    let _billedAt_extraInitializers = [];
    let _reimbursedAt_decorators;
    let _reimbursedAt_initializers = [];
    let _reimbursedAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var ExpenseModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.clientId = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.category = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.amount = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.expenseDate = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _expenseDate_initializers, void 0));
            this.reimbursable = (__runInitializers(this, _expenseDate_extraInitializers), __runInitializers(this, _reimbursable_initializers, void 0));
            this.billable = (__runInitializers(this, _reimbursable_extraInitializers), __runInitializers(this, _billable_initializers, void 0));
            this.receiptUrl = (__runInitializers(this, _billable_extraInitializers), __runInitializers(this, _receiptUrl_initializers, void 0));
            this.vendorName = (__runInitializers(this, _receiptUrl_extraInitializers), __runInitializers(this, _vendorName_initializers, void 0));
            this.status = (__runInitializers(this, _vendorName_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.invoiceId = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _invoiceId_initializers, void 0));
            this.billedAt = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _billedAt_initializers, void 0));
            this.reimbursedAt = (__runInitializers(this, _billedAt_extraInitializers), __runInitializers(this, _reimbursedAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _reimbursedAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ExpenseModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _matterId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _category_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ExpenseCategory)),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _amount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _currency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                defaultValue: 'USD',
            })];
        _expenseDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _reimbursable_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            })];
        _billable_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            })];
        _receiptUrl_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _vendorName_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('pending', 'approved', 'rejected', 'reimbursed', 'billed'),
                defaultValue: 'pending',
            })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _invoiceId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _billedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _reimbursedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _expenseDate_decorators, { kind: "field", name: "expenseDate", static: false, private: false, access: { has: obj => "expenseDate" in obj, get: obj => obj.expenseDate, set: (obj, value) => { obj.expenseDate = value; } }, metadata: _metadata }, _expenseDate_initializers, _expenseDate_extraInitializers);
        __esDecorate(null, null, _reimbursable_decorators, { kind: "field", name: "reimbursable", static: false, private: false, access: { has: obj => "reimbursable" in obj, get: obj => obj.reimbursable, set: (obj, value) => { obj.reimbursable = value; } }, metadata: _metadata }, _reimbursable_initializers, _reimbursable_extraInitializers);
        __esDecorate(null, null, _billable_decorators, { kind: "field", name: "billable", static: false, private: false, access: { has: obj => "billable" in obj, get: obj => obj.billable, set: (obj, value) => { obj.billable = value; } }, metadata: _metadata }, _billable_initializers, _billable_extraInitializers);
        __esDecorate(null, null, _receiptUrl_decorators, { kind: "field", name: "receiptUrl", static: false, private: false, access: { has: obj => "receiptUrl" in obj, get: obj => obj.receiptUrl, set: (obj, value) => { obj.receiptUrl = value; } }, metadata: _metadata }, _receiptUrl_initializers, _receiptUrl_extraInitializers);
        __esDecorate(null, null, _vendorName_decorators, { kind: "field", name: "vendorName", static: false, private: false, access: { has: obj => "vendorName" in obj, get: obj => obj.vendorName, set: (obj, value) => { obj.vendorName = value; } }, metadata: _metadata }, _vendorName_initializers, _vendorName_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
        __esDecorate(null, null, _billedAt_decorators, { kind: "field", name: "billedAt", static: false, private: false, access: { has: obj => "billedAt" in obj, get: obj => obj.billedAt, set: (obj, value) => { obj.billedAt = value; } }, metadata: _metadata }, _billedAt_initializers, _billedAt_extraInitializers);
        __esDecorate(null, null, _reimbursedAt_decorators, { kind: "field", name: "reimbursedAt", static: false, private: false, access: { has: obj => "reimbursedAt" in obj, get: obj => obj.reimbursedAt, set: (obj, value) => { obj.reimbursedAt = value; } }, metadata: _metadata }, _reimbursedAt_initializers, _reimbursedAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExpenseModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExpenseModel = _classThis;
})();
exports.ExpenseModel = ExpenseModel;
/**
 * Trust Account Sequelize Model
 */
let TrustAccountModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'trust_accounts',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _accountNumber_decorators;
    let _accountNumber_initializers = [];
    let _accountNumber_extraInitializers = [];
    let _accountName_decorators;
    let _accountName_initializers = [];
    let _accountName_extraInitializers = [];
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _accountType_decorators;
    let _accountType_initializers = [];
    let _accountType_extraInitializers = [];
    let _balance_decorators;
    let _balance_initializers = [];
    let _balance_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _bankName_decorators;
    let _bankName_initializers = [];
    let _bankName_extraInitializers = [];
    let _bankAccountNumber_decorators;
    let _bankAccountNumber_initializers = [];
    let _bankAccountNumber_extraInitializers = [];
    let _routingNumber_decorators;
    let _routingNumber_initializers = [];
    let _routingNumber_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _openedDate_decorators;
    let _openedDate_initializers = [];
    let _openedDate_extraInitializers = [];
    let _closedDate_decorators;
    let _closedDate_initializers = [];
    let _closedDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _transactions_decorators;
    let _transactions_initializers = [];
    let _transactions_extraInitializers = [];
    var TrustAccountModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.accountNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _accountNumber_initializers, void 0));
            this.accountName = (__runInitializers(this, _accountNumber_extraInitializers), __runInitializers(this, _accountName_initializers, void 0));
            this.clientId = (__runInitializers(this, _accountName_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.matterId = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.accountType = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _accountType_initializers, void 0));
            this.balance = (__runInitializers(this, _accountType_extraInitializers), __runInitializers(this, _balance_initializers, void 0));
            this.currency = (__runInitializers(this, _balance_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.bankName = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _bankName_initializers, void 0));
            this.bankAccountNumber = (__runInitializers(this, _bankName_extraInitializers), __runInitializers(this, _bankAccountNumber_initializers, void 0));
            this.routingNumber = (__runInitializers(this, _bankAccountNumber_extraInitializers), __runInitializers(this, _routingNumber_initializers, void 0));
            this.isActive = (__runInitializers(this, _routingNumber_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.openedDate = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _openedDate_initializers, void 0));
            this.closedDate = (__runInitializers(this, _openedDate_extraInitializers), __runInitializers(this, _closedDate_initializers, void 0));
            this.metadata = (__runInitializers(this, _closedDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.transactions = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _transactions_initializers, void 0));
            __runInitializers(this, _transactions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TrustAccountModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _accountNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING,
                unique: true,
                allowNull: false,
            })];
        _accountName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _matterId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _accountType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('iolta', 'client_trust', 'operating'),
                allowNull: false,
            })];
        _balance_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                defaultValue: 0,
            })];
        _currency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                defaultValue: 'USD',
            })];
        _bankName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _bankAccountNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _routingNumber_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            })];
        _openedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _closedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _transactions_decorators = [(0, sequelize_typescript_1.HasMany)(() => TrustTransactionModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _accountNumber_decorators, { kind: "field", name: "accountNumber", static: false, private: false, access: { has: obj => "accountNumber" in obj, get: obj => obj.accountNumber, set: (obj, value) => { obj.accountNumber = value; } }, metadata: _metadata }, _accountNumber_initializers, _accountNumber_extraInitializers);
        __esDecorate(null, null, _accountName_decorators, { kind: "field", name: "accountName", static: false, private: false, access: { has: obj => "accountName" in obj, get: obj => obj.accountName, set: (obj, value) => { obj.accountName = value; } }, metadata: _metadata }, _accountName_initializers, _accountName_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _accountType_decorators, { kind: "field", name: "accountType", static: false, private: false, access: { has: obj => "accountType" in obj, get: obj => obj.accountType, set: (obj, value) => { obj.accountType = value; } }, metadata: _metadata }, _accountType_initializers, _accountType_extraInitializers);
        __esDecorate(null, null, _balance_decorators, { kind: "field", name: "balance", static: false, private: false, access: { has: obj => "balance" in obj, get: obj => obj.balance, set: (obj, value) => { obj.balance = value; } }, metadata: _metadata }, _balance_initializers, _balance_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _bankName_decorators, { kind: "field", name: "bankName", static: false, private: false, access: { has: obj => "bankName" in obj, get: obj => obj.bankName, set: (obj, value) => { obj.bankName = value; } }, metadata: _metadata }, _bankName_initializers, _bankName_extraInitializers);
        __esDecorate(null, null, _bankAccountNumber_decorators, { kind: "field", name: "bankAccountNumber", static: false, private: false, access: { has: obj => "bankAccountNumber" in obj, get: obj => obj.bankAccountNumber, set: (obj, value) => { obj.bankAccountNumber = value; } }, metadata: _metadata }, _bankAccountNumber_initializers, _bankAccountNumber_extraInitializers);
        __esDecorate(null, null, _routingNumber_decorators, { kind: "field", name: "routingNumber", static: false, private: false, access: { has: obj => "routingNumber" in obj, get: obj => obj.routingNumber, set: (obj, value) => { obj.routingNumber = value; } }, metadata: _metadata }, _routingNumber_initializers, _routingNumber_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _openedDate_decorators, { kind: "field", name: "openedDate", static: false, private: false, access: { has: obj => "openedDate" in obj, get: obj => obj.openedDate, set: (obj, value) => { obj.openedDate = value; } }, metadata: _metadata }, _openedDate_initializers, _openedDate_extraInitializers);
        __esDecorate(null, null, _closedDate_decorators, { kind: "field", name: "closedDate", static: false, private: false, access: { has: obj => "closedDate" in obj, get: obj => obj.closedDate, set: (obj, value) => { obj.closedDate = value; } }, metadata: _metadata }, _closedDate_initializers, _closedDate_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _transactions_decorators, { kind: "field", name: "transactions", static: false, private: false, access: { has: obj => "transactions" in obj, get: obj => obj.transactions, set: (obj, value) => { obj.transactions = value; } }, metadata: _metadata }, _transactions_initializers, _transactions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TrustAccountModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TrustAccountModel = _classThis;
})();
exports.TrustAccountModel = TrustAccountModel;
/**
 * Trust Transaction Sequelize Model
 */
let TrustTransactionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'trust_transactions',
            timestamps: false,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _trustAccountId_decorators;
    let _trustAccountId_initializers = [];
    let _trustAccountId_extraInitializers = [];
    let _transactionType_decorators;
    let _transactionType_initializers = [];
    let _transactionType_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _balance_decorators;
    let _balance_initializers = [];
    let _balance_extraInitializers = [];
    let _transactionDate_decorators;
    let _transactionDate_initializers = [];
    let _transactionDate_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _reference_decorators;
    let _reference_initializers = [];
    let _reference_extraInitializers = [];
    let _relatedInvoiceId_decorators;
    let _relatedInvoiceId_initializers = [];
    let _relatedInvoiceId_extraInitializers = [];
    let _relatedPaymentId_decorators;
    let _relatedPaymentId_initializers = [];
    let _relatedPaymentId_extraInitializers = [];
    let _fromAccountId_decorators;
    let _fromAccountId_initializers = [];
    let _fromAccountId_extraInitializers = [];
    let _toAccountId_decorators;
    let _toAccountId_initializers = [];
    let _toAccountId_extraInitializers = [];
    let _reconciledAt_decorators;
    let _reconciledAt_initializers = [];
    let _reconciledAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _trustAccount_decorators;
    let _trustAccount_initializers = [];
    let _trustAccount_extraInitializers = [];
    var TrustTransactionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.trustAccountId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _trustAccountId_initializers, void 0));
            this.transactionType = (__runInitializers(this, _trustAccountId_extraInitializers), __runInitializers(this, _transactionType_initializers, void 0));
            this.amount = (__runInitializers(this, _transactionType_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.balance = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _balance_initializers, void 0));
            this.transactionDate = (__runInitializers(this, _balance_extraInitializers), __runInitializers(this, _transactionDate_initializers, void 0));
            this.description = (__runInitializers(this, _transactionDate_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.reference = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _reference_initializers, void 0));
            this.relatedInvoiceId = (__runInitializers(this, _reference_extraInitializers), __runInitializers(this, _relatedInvoiceId_initializers, void 0));
            this.relatedPaymentId = (__runInitializers(this, _relatedInvoiceId_extraInitializers), __runInitializers(this, _relatedPaymentId_initializers, void 0));
            this.fromAccountId = (__runInitializers(this, _relatedPaymentId_extraInitializers), __runInitializers(this, _fromAccountId_initializers, void 0));
            this.toAccountId = (__runInitializers(this, _fromAccountId_extraInitializers), __runInitializers(this, _toAccountId_initializers, void 0));
            this.reconciledAt = (__runInitializers(this, _toAccountId_extraInitializers), __runInitializers(this, _reconciledAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _reconciledAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.trustAccount = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _trustAccount_initializers, void 0));
            __runInitializers(this, _trustAccount_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TrustTransactionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _trustAccountId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => TrustAccountModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _transactionType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TrustAccountTransactionType)),
                allowNull: false,
            })];
        _amount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _balance_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _transactionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _reference_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _relatedInvoiceId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _relatedPaymentId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _fromAccountId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _toAccountId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _reconciledAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _createdAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            })];
        _trustAccount_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => TrustAccountModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _trustAccountId_decorators, { kind: "field", name: "trustAccountId", static: false, private: false, access: { has: obj => "trustAccountId" in obj, get: obj => obj.trustAccountId, set: (obj, value) => { obj.trustAccountId = value; } }, metadata: _metadata }, _trustAccountId_initializers, _trustAccountId_extraInitializers);
        __esDecorate(null, null, _transactionType_decorators, { kind: "field", name: "transactionType", static: false, private: false, access: { has: obj => "transactionType" in obj, get: obj => obj.transactionType, set: (obj, value) => { obj.transactionType = value; } }, metadata: _metadata }, _transactionType_initializers, _transactionType_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _balance_decorators, { kind: "field", name: "balance", static: false, private: false, access: { has: obj => "balance" in obj, get: obj => obj.balance, set: (obj, value) => { obj.balance = value; } }, metadata: _metadata }, _balance_initializers, _balance_extraInitializers);
        __esDecorate(null, null, _transactionDate_decorators, { kind: "field", name: "transactionDate", static: false, private: false, access: { has: obj => "transactionDate" in obj, get: obj => obj.transactionDate, set: (obj, value) => { obj.transactionDate = value; } }, metadata: _metadata }, _transactionDate_initializers, _transactionDate_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _reference_decorators, { kind: "field", name: "reference", static: false, private: false, access: { has: obj => "reference" in obj, get: obj => obj.reference, set: (obj, value) => { obj.reference = value; } }, metadata: _metadata }, _reference_initializers, _reference_extraInitializers);
        __esDecorate(null, null, _relatedInvoiceId_decorators, { kind: "field", name: "relatedInvoiceId", static: false, private: false, access: { has: obj => "relatedInvoiceId" in obj, get: obj => obj.relatedInvoiceId, set: (obj, value) => { obj.relatedInvoiceId = value; } }, metadata: _metadata }, _relatedInvoiceId_initializers, _relatedInvoiceId_extraInitializers);
        __esDecorate(null, null, _relatedPaymentId_decorators, { kind: "field", name: "relatedPaymentId", static: false, private: false, access: { has: obj => "relatedPaymentId" in obj, get: obj => obj.relatedPaymentId, set: (obj, value) => { obj.relatedPaymentId = value; } }, metadata: _metadata }, _relatedPaymentId_initializers, _relatedPaymentId_extraInitializers);
        __esDecorate(null, null, _fromAccountId_decorators, { kind: "field", name: "fromAccountId", static: false, private: false, access: { has: obj => "fromAccountId" in obj, get: obj => obj.fromAccountId, set: (obj, value) => { obj.fromAccountId = value; } }, metadata: _metadata }, _fromAccountId_initializers, _fromAccountId_extraInitializers);
        __esDecorate(null, null, _toAccountId_decorators, { kind: "field", name: "toAccountId", static: false, private: false, access: { has: obj => "toAccountId" in obj, get: obj => obj.toAccountId, set: (obj, value) => { obj.toAccountId = value; } }, metadata: _metadata }, _toAccountId_initializers, _toAccountId_extraInitializers);
        __esDecorate(null, null, _reconciledAt_decorators, { kind: "field", name: "reconciledAt", static: false, private: false, access: { has: obj => "reconciledAt" in obj, get: obj => obj.reconciledAt, set: (obj, value) => { obj.reconciledAt = value; } }, metadata: _metadata }, _reconciledAt_initializers, _reconciledAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _trustAccount_decorators, { kind: "field", name: "trustAccount", static: false, private: false, access: { has: obj => "trustAccount" in obj, get: obj => obj.trustAccount, set: (obj, value) => { obj.trustAccount = value; } }, metadata: _metadata }, _trustAccount_initializers, _trustAccount_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TrustTransactionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TrustTransactionModel = _classThis;
})();
exports.TrustTransactionModel = TrustTransactionModel;
/**
 * WIP Entry Sequelize Model
 */
let WIPEntryModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'wip_entries',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _timekeeperId_decorators;
    let _timekeeperId_initializers = [];
    let _timekeeperId_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _date_decorators;
    let _date_initializers = [];
    let _date_extraInitializers = [];
    let _hours_decorators;
    let _hours_initializers = [];
    let _hours_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _timeEntryId_decorators;
    let _timeEntryId_initializers = [];
    let _timeEntryId_extraInitializers = [];
    let _expenseId_decorators;
    let _expenseId_initializers = [];
    let _expenseId_extraInitializers = [];
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _billedAt_decorators;
    let _billedAt_initializers = [];
    let _billedAt_extraInitializers = [];
    let _writtenOffAt_decorators;
    let _writtenOffAt_initializers = [];
    let _writtenOffAt_extraInitializers = [];
    let _writeOffReason_decorators;
    let _writeOffReason_initializers = [];
    let _writeOffReason_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var WIPEntryModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.clientId = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.timekeeperId = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _timekeeperId_initializers, void 0));
            this.type = (__runInitializers(this, _timekeeperId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.description = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.date = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _date_initializers, void 0));
            this.hours = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _hours_initializers, void 0));
            this.amount = (__runInitializers(this, _hours_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.status = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.timeEntryId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _timeEntryId_initializers, void 0));
            this.expenseId = (__runInitializers(this, _timeEntryId_extraInitializers), __runInitializers(this, _expenseId_initializers, void 0));
            this.invoiceId = (__runInitializers(this, _expenseId_extraInitializers), __runInitializers(this, _invoiceId_initializers, void 0));
            this.billedAt = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _billedAt_initializers, void 0));
            this.writtenOffAt = (__runInitializers(this, _billedAt_extraInitializers), __runInitializers(this, _writtenOffAt_initializers, void 0));
            this.writeOffReason = (__runInitializers(this, _writtenOffAt_extraInitializers), __runInitializers(this, _writeOffReason_initializers, void 0));
            this.metadata = (__runInitializers(this, _writeOffReason_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WIPEntryModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _matterId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _timekeeperId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('time', 'expense', 'fee'),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _date_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _hours_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _amount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WIPStatus)),
                defaultValue: WIPStatus.UNBILLED,
            })];
        _timeEntryId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _expenseId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _invoiceId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _billedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _writtenOffAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _writeOffReason_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _timekeeperId_decorators, { kind: "field", name: "timekeeperId", static: false, private: false, access: { has: obj => "timekeeperId" in obj, get: obj => obj.timekeeperId, set: (obj, value) => { obj.timekeeperId = value; } }, metadata: _metadata }, _timekeeperId_initializers, _timekeeperId_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: obj => "date" in obj, get: obj => obj.date, set: (obj, value) => { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
        __esDecorate(null, null, _hours_decorators, { kind: "field", name: "hours", static: false, private: false, access: { has: obj => "hours" in obj, get: obj => obj.hours, set: (obj, value) => { obj.hours = value; } }, metadata: _metadata }, _hours_initializers, _hours_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _timeEntryId_decorators, { kind: "field", name: "timeEntryId", static: false, private: false, access: { has: obj => "timeEntryId" in obj, get: obj => obj.timeEntryId, set: (obj, value) => { obj.timeEntryId = value; } }, metadata: _metadata }, _timeEntryId_initializers, _timeEntryId_extraInitializers);
        __esDecorate(null, null, _expenseId_decorators, { kind: "field", name: "expenseId", static: false, private: false, access: { has: obj => "expenseId" in obj, get: obj => obj.expenseId, set: (obj, value) => { obj.expenseId = value; } }, metadata: _metadata }, _expenseId_initializers, _expenseId_extraInitializers);
        __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
        __esDecorate(null, null, _billedAt_decorators, { kind: "field", name: "billedAt", static: false, private: false, access: { has: obj => "billedAt" in obj, get: obj => obj.billedAt, set: (obj, value) => { obj.billedAt = value; } }, metadata: _metadata }, _billedAt_initializers, _billedAt_extraInitializers);
        __esDecorate(null, null, _writtenOffAt_decorators, { kind: "field", name: "writtenOffAt", static: false, private: false, access: { has: obj => "writtenOffAt" in obj, get: obj => obj.writtenOffAt, set: (obj, value) => { obj.writtenOffAt = value; } }, metadata: _metadata }, _writtenOffAt_initializers, _writtenOffAt_extraInitializers);
        __esDecorate(null, null, _writeOffReason_decorators, { kind: "field", name: "writeOffReason", static: false, private: false, access: { has: obj => "writeOffReason" in obj, get: obj => obj.writeOffReason, set: (obj, value) => { obj.writeOffReason = value; } }, metadata: _metadata }, _writeOffReason_initializers, _writeOffReason_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WIPEntryModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WIPEntryModel = _classThis;
})();
exports.WIPEntryModel = WIPEntryModel;
/**
 * Payment Sequelize Model
 */
let PaymentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'payments',
            timestamps: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _paymentMethod_decorators;
    let _paymentMethod_initializers = [];
    let _paymentMethod_extraInitializers = [];
    let _paymentDate_decorators;
    let _paymentDate_initializers = [];
    let _paymentDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _reference_decorators;
    let _reference_initializers = [];
    let _reference_extraInitializers = [];
    let _transactionId_decorators;
    let _transactionId_initializers = [];
    let _transactionId_extraInitializers = [];
    let _checkNumber_decorators;
    let _checkNumber_initializers = [];
    let _checkNumber_extraInitializers = [];
    let _trustAccountId_decorators;
    let _trustAccountId_initializers = [];
    let _trustAccountId_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _processedAt_decorators;
    let _processedAt_initializers = [];
    let _processedAt_extraInitializers = [];
    let _failureReason_decorators;
    let _failureReason_initializers = [];
    let _failureReason_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var PaymentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.invoiceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _invoiceId_initializers, void 0));
            this.clientId = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.amount = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.paymentMethod = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
            this.paymentDate = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _paymentDate_initializers, void 0));
            this.status = (__runInitializers(this, _paymentDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.reference = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _reference_initializers, void 0));
            this.transactionId = (__runInitializers(this, _reference_extraInitializers), __runInitializers(this, _transactionId_initializers, void 0));
            this.checkNumber = (__runInitializers(this, _transactionId_extraInitializers), __runInitializers(this, _checkNumber_initializers, void 0));
            this.trustAccountId = (__runInitializers(this, _checkNumber_extraInitializers), __runInitializers(this, _trustAccountId_initializers, void 0));
            this.notes = (__runInitializers(this, _trustAccountId_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.processedAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _processedAt_initializers, void 0));
            this.failureReason = (__runInitializers(this, _processedAt_extraInitializers), __runInitializers(this, _failureReason_initializers, void 0));
            this.metadata = (__runInitializers(this, _failureReason_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PaymentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _invoiceId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _amount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _currency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                defaultValue: 'USD',
            })];
        _paymentMethod_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PaymentMethod)),
                allowNull: false,
            })];
        _paymentDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PaymentStatus)),
                defaultValue: PaymentStatus.PENDING,
            })];
        _reference_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _transactionId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _checkNumber_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _trustAccountId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _notes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _processedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _failureReason_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: obj => "paymentMethod" in obj, get: obj => obj.paymentMethod, set: (obj, value) => { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
        __esDecorate(null, null, _paymentDate_decorators, { kind: "field", name: "paymentDate", static: false, private: false, access: { has: obj => "paymentDate" in obj, get: obj => obj.paymentDate, set: (obj, value) => { obj.paymentDate = value; } }, metadata: _metadata }, _paymentDate_initializers, _paymentDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _reference_decorators, { kind: "field", name: "reference", static: false, private: false, access: { has: obj => "reference" in obj, get: obj => obj.reference, set: (obj, value) => { obj.reference = value; } }, metadata: _metadata }, _reference_initializers, _reference_extraInitializers);
        __esDecorate(null, null, _transactionId_decorators, { kind: "field", name: "transactionId", static: false, private: false, access: { has: obj => "transactionId" in obj, get: obj => obj.transactionId, set: (obj, value) => { obj.transactionId = value; } }, metadata: _metadata }, _transactionId_initializers, _transactionId_extraInitializers);
        __esDecorate(null, null, _checkNumber_decorators, { kind: "field", name: "checkNumber", static: false, private: false, access: { has: obj => "checkNumber" in obj, get: obj => obj.checkNumber, set: (obj, value) => { obj.checkNumber = value; } }, metadata: _metadata }, _checkNumber_initializers, _checkNumber_extraInitializers);
        __esDecorate(null, null, _trustAccountId_decorators, { kind: "field", name: "trustAccountId", static: false, private: false, access: { has: obj => "trustAccountId" in obj, get: obj => obj.trustAccountId, set: (obj, value) => { obj.trustAccountId = value; } }, metadata: _metadata }, _trustAccountId_initializers, _trustAccountId_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _processedAt_decorators, { kind: "field", name: "processedAt", static: false, private: false, access: { has: obj => "processedAt" in obj, get: obj => obj.processedAt, set: (obj, value) => { obj.processedAt = value; } }, metadata: _metadata }, _processedAt_initializers, _processedAt_extraInitializers);
        __esDecorate(null, null, _failureReason_decorators, { kind: "field", name: "failureReason", static: false, private: false, access: { has: obj => "failureReason" in obj, get: obj => obj.failureReason, set: (obj, value) => { obj.failureReason = value; } }, metadata: _metadata }, _failureReason_initializers, _failureReason_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentModel = _classThis;
})();
exports.PaymentModel = PaymentModel;
// ============================================================================
// CONFIGURATION MANAGEMENT
// ============================================================================
/**
 * Register billing and timekeeping configuration namespace
 *
 * @returns Configuration factory for NestJS
 *
 * @example
 * ```typescript
 * ConfigModule.forRoot({
 *   load: [registerBillingConfig()],
 * })
 * ```
 */
function registerBillingConfig() {
    return (0, config_1.registerAs)('billing', () => ({
        invoiceNumberPrefix: process.env.INVOICE_NUMBER_PREFIX || 'INV',
        defaultCurrency: process.env.BILLING_DEFAULT_CURRENCY || 'USD',
        defaultPaymentTermsDays: parseInt(process.env.BILLING_PAYMENT_TERMS_DAYS || '30', 10),
        defaultTaxRate: parseFloat(process.env.BILLING_DEFAULT_TAX_RATE || '0'),
        minimumBillableHours: parseFloat(process.env.BILLING_MIN_HOURS || '0.1'),
        timeIncrementMinutes: parseInt(process.env.BILLING_TIME_INCREMENT || '6', 10),
        enableAutoTimeRounding: process.env.BILLING_AUTO_ROUND !== 'false',
        allowNegativeAdjustments: process.env.BILLING_ALLOW_NEGATIVE === 'true',
        requireExpenseReceipts: process.env.BILLING_REQUIRE_RECEIPTS !== 'false',
        trustAccountingEnabled: process.env.TRUST_ACCOUNTING_ENABLED !== 'false',
        trustAccountIOLTACompliant: process.env.TRUST_IOLTA_COMPLIANT !== 'false',
        overdueInvoiceDays: parseInt(process.env.BILLING_OVERDUE_DAYS || '30', 10),
        invoiceReminderDays: process.env.BILLING_REMINDER_DAYS?.split(',').map(Number) || [7, 14, 30],
        enableWIPTracking: process.env.BILLING_WIP_TRACKING !== 'false',
        ledisExportEnabled: process.env.BILLING_LEDIS_EXPORT === 'true',
    }));
}
/**
 * Create billing and timekeeping configuration module
 *
 * @returns DynamicModule for billing config
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [createBillingConfigModule()],
 * })
 * export class BillingModule {}
 * ```
 */
function createBillingConfigModule() {
    return config_1.ConfigModule.forRoot({
        load: [registerBillingConfig()],
        isGlobal: true,
        cache: true,
    });
}
// ============================================================================
// TIME ENTRY FUNCTIONS
// ============================================================================
/**
 * Create time entry
 *
 * @param data - Time entry creation data
 * @param userId - User creating the time entry
 * @param configService - Configuration service
 * @returns Created time entry
 *
 * @example
 * ```typescript
 * const timeEntry = await createTimeEntry({
 *   timekeeperId: 'user_123',
 *   matterId: 'matter_456',
 *   clientId: 'client_789',
 *   date: new Date(),
 *   hours: 2.5,
 *   description: 'Client consultation regarding case strategy',
 *   billable: true,
 *   billingRate: 350,
 * }, 'user_123', configService);
 * ```
 */
async function createTimeEntry(data, userId, configService) {
    const logger = new common_1.Logger('TimeEntry');
    // Validate input
    const validated = exports.TimeEntryCreateSchema.parse(data);
    // Round hours based on configuration
    const timeIncrement = configService.get('billing.timeIncrementMinutes', 6);
    const roundedHours = roundTimeEntry(validated.hours, timeIncrement);
    // Calculate billing amount
    const billingAmount = validated.billable && validated.billingRate
        ? roundedHours * validated.billingRate
        : 0;
    const timeEntry = {
        id: crypto.randomUUID(),
        timekeeperId: validated.timekeeperId,
        matterId: validated.matterId,
        clientId: validated.clientId,
        date: validated.date,
        hours: roundedHours,
        description: validated.description,
        taskCode: validated.taskCode,
        activityCode: validated.activityCode,
        billable: validated.billable,
        billingRate: validated.billingRate,
        billingAmount,
        status: TimeEntryStatus.DRAFT,
        metadata: validated.metadata,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    logger.log(`Time entry created: ${roundedHours} hours for matter ${validated.matterId}`);
    return timeEntry;
}
/**
 * Round time entry hours based on increment
 */
function roundTimeEntry(hours, incrementMinutes) {
    const incrementHours = incrementMinutes / 60;
    return Math.ceil(hours / incrementHours) * incrementHours;
}
/**
 * Update time entry
 *
 * @param timeEntryId - Time entry ID
 * @param updates - Fields to update
 * @param userId - User updating the entry
 * @param repository - Time entry repository
 *
 * @example
 * ```typescript
 * await updateTimeEntry('entry_123', { hours: 3.0, description: 'Updated description' }, 'user_456', timeEntryRepo);
 * ```
 */
async function updateTimeEntry(timeEntryId, updates, userId, repository) {
    const logger = new common_1.Logger('TimeEntry');
    const timeEntry = await repository.findByPk(timeEntryId);
    if (!timeEntry) {
        throw new common_1.NotFoundException(`Time entry ${timeEntryId} not found`);
    }
    if (timeEntry.status === TimeEntryStatus.BILLED) {
        throw new common_1.BadRequestException('Cannot update billed time entry');
    }
    await repository.update({ ...updates, updatedBy: userId }, { where: { id: timeEntryId } });
    logger.log(`Time entry ${timeEntryId} updated`);
}
/**
 * Delete time entry
 *
 * @param timeEntryId - Time entry ID
 * @param userId - User deleting the entry
 * @param repository - Time entry repository
 *
 * @example
 * ```typescript
 * await deleteTimeEntry('entry_123', 'user_456', timeEntryRepo);
 * ```
 */
async function deleteTimeEntry(timeEntryId, userId, repository) {
    const logger = new common_1.Logger('TimeEntry');
    const timeEntry = await repository.findByPk(timeEntryId);
    if (!timeEntry) {
        throw new common_1.NotFoundException(`Time entry ${timeEntryId} not found`);
    }
    if (timeEntry.status === TimeEntryStatus.BILLED) {
        throw new common_1.BadRequestException('Cannot delete billed time entry');
    }
    await repository.destroy({ where: { id: timeEntryId } });
    logger.log(`Time entry ${timeEntryId} deleted by ${userId}`);
}
/**
 * Get time entries by matter
 *
 * @param matterId - Matter ID
 * @param filters - Additional filters
 * @param repository - Time entry repository
 * @returns Array of time entries
 *
 * @example
 * ```typescript
 * const entries = await getTimeEntriesByMatter('matter_123', { billable: true }, timeEntryRepo);
 * ```
 */
async function getTimeEntriesByMatter(matterId, filters, repository) {
    const where = { matterId };
    if (filters.timekeeperId) {
        where.timekeeperId = filters.timekeeperId;
    }
    if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate) {
            where.date[sequelize_1.Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
            where.date[sequelize_1.Op.lte] = filters.endDate;
        }
    }
    if (filters.statuses?.length) {
        where.status = { [sequelize_1.Op.in]: filters.statuses };
    }
    if (filters.billable !== undefined) {
        where.billable = filters.billable;
    }
    if (filters.tenantId) {
        where.tenantId = filters.tenantId;
    }
    const entries = await repository.findAll({
        where,
        order: [['date', 'DESC']],
    });
    return entries.map((e) => e.toJSON());
}
/**
 * Get time entries by timekeeper
 *
 * @param timekeeperId - Timekeeper ID
 * @param filters - Additional filters
 * @param repository - Time entry repository
 * @returns Array of time entries
 *
 * @example
 * ```typescript
 * const entries = await getTimeEntriesByTimekeeper('user_123', { startDate: new Date('2025-01-01') }, timeEntryRepo);
 * ```
 */
async function getTimeEntriesByTimekeeper(timekeeperId, filters, repository) {
    const where = { timekeeperId };
    if (filters.matterId) {
        where.matterId = filters.matterId;
    }
    if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate) {
            where.date[sequelize_1.Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
            where.date[sequelize_1.Op.lte] = filters.endDate;
        }
    }
    if (filters.statuses?.length) {
        where.status = { [sequelize_1.Op.in]: filters.statuses };
    }
    if (filters.billable !== undefined) {
        where.billable = filters.billable;
    }
    if (filters.tenantId) {
        where.tenantId = filters.tenantId;
    }
    const entries = await repository.findAll({
        where,
        order: [['date', 'DESC']],
    });
    return entries.map((e) => e.toJSON());
}
/**
 * Calculate billable hours for a matter or timekeeper
 *
 * @param filters - Filters to apply
 * @param repository - Time entry repository
 * @returns Total billable hours and amount
 *
 * @example
 * ```typescript
 * const totals = await calculateBillableHours({ matterId: 'matter_123', billable: true }, timeEntryRepo);
 * console.log(`Total: ${totals.hours} hours, $${totals.amount}`);
 * ```
 */
async function calculateBillableHours(filters, repository) {
    const where = {};
    if (filters.timekeeperId) {
        where.timekeeperId = filters.timekeeperId;
    }
    if (filters.matterId) {
        where.matterId = filters.matterId;
    }
    if (filters.clientId) {
        where.clientId = filters.clientId;
    }
    if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate) {
            where.date[sequelize_1.Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
            where.date[sequelize_1.Op.lte] = filters.endDate;
        }
    }
    if (filters.statuses?.length) {
        where.status = { [sequelize_1.Op.in]: filters.statuses };
    }
    if (filters.billable !== undefined) {
        where.billable = filters.billable;
    }
    if (filters.tenantId) {
        where.tenantId = filters.tenantId;
    }
    const entries = await repository.findAll({ where });
    const totals = entries.reduce((acc, entry) => ({
        hours: acc.hours + parseFloat(entry.hours || 0),
        amount: acc.amount + parseFloat(entry.billingAmount || 0),
    }), { hours: 0, amount: 0 });
    return totals;
}
// ============================================================================
// BILLING RATE FUNCTIONS
// ============================================================================
/**
 * Create billing rate
 *
 * @param data - Billing rate creation data
 * @returns Created billing rate
 *
 * @example
 * ```typescript
 * const rate = await createBillingRate({
 *   timekeeperId: 'user_123',
 *   rateType: BillingRateType.HOURLY,
 *   hourlyRate: 350,
 *   currency: 'USD',
 *   effectiveDate: new Date(),
 * });
 * ```
 */
async function createBillingRate(data) {
    const logger = new common_1.Logger('BillingRate');
    const validated = exports.BillingRateCreateSchema.parse(data);
    // Validate rate type has corresponding rate value
    if (validated.rateType === BillingRateType.HOURLY && !validated.hourlyRate) {
        throw new common_1.BadRequestException('Hourly rate is required for hourly billing rate type');
    }
    if (validated.rateType === BillingRateType.FLAT_FEE && !validated.flatFeeAmount) {
        throw new common_1.BadRequestException('Flat fee amount is required for flat fee billing rate type');
    }
    if (validated.rateType === BillingRateType.CONTINGENCY && !validated.contingencyPercentage) {
        throw new common_1.BadRequestException('Contingency percentage is required for contingency billing rate type');
    }
    const billingRate = {
        id: crypto.randomUUID(),
        timekeeperId: validated.timekeeperId,
        clientId: validated.clientId,
        matterId: validated.matterId,
        matterTypeId: validated.matterTypeId,
        rateType: validated.rateType,
        hourlyRate: validated.hourlyRate,
        flatFeeAmount: validated.flatFeeAmount,
        contingencyPercentage: validated.contingencyPercentage,
        currency: validated.currency,
        effectiveDate: validated.effectiveDate,
        expirationDate: validated.expirationDate,
        isActive: validated.isActive,
        description: validated.description,
        metadata: validated.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    logger.log(`Billing rate created: ${validated.rateType} for timekeeper ${validated.timekeeperId}`);
    return billingRate;
}
/**
 * Get billing rate for timekeeper
 *
 * @param timekeeperId - Timekeeper ID
 * @param matterId - Matter ID (optional)
 * @param clientId - Client ID (optional)
 * @param date - Effective date (defaults to today)
 * @param repository - Billing rate repository
 * @returns Applicable billing rate
 *
 * @example
 * ```typescript
 * const rate = await getBillingRateForTimekeeper('user_123', 'matter_456', 'client_789', new Date(), rateRepo);
 * ```
 */
async function getBillingRateForTimekeeper(timekeeperId, matterId, clientId, date, repository) {
    const where = {
        timekeeperId,
        isActive: true,
        effectiveDate: { [sequelize_1.Op.lte]: date },
        [sequelize_1.Op.or]: [
            { expirationDate: null },
            { expirationDate: { [sequelize_1.Op.gte]: date } },
        ],
    };
    // Most specific rate: matter-specific
    if (matterId) {
        const matterRate = await repository.findOne({
            where: { ...where, matterId },
            order: [['effectiveDate', 'DESC']],
        });
        if (matterRate) {
            return matterRate.toJSON();
        }
    }
    // Client-specific rate
    if (clientId) {
        const clientRate = await repository.findOne({
            where: { ...where, clientId, matterId: null },
            order: [['effectiveDate', 'DESC']],
        });
        if (clientRate) {
            return clientRate.toJSON();
        }
    }
    // Default timekeeper rate
    const defaultRate = await repository.findOne({
        where: { ...where, clientId: null, matterId: null },
        order: [['effectiveDate', 'DESC']],
    });
    return defaultRate ? defaultRate.toJSON() : null;
}
/**
 * Update billing rate
 *
 * @param rateId - Billing rate ID
 * @param updates - Fields to update
 * @param repository - Billing rate repository
 *
 * @example
 * ```typescript
 * await updateBillingRate('rate_123', { hourlyRate: 375, isActive: true }, rateRepo);
 * ```
 */
async function updateBillingRate(rateId, updates, repository) {
    const logger = new common_1.Logger('BillingRate');
    const rate = await repository.findByPk(rateId);
    if (!rate) {
        throw new common_1.NotFoundException(`Billing rate ${rateId} not found`);
    }
    await repository.update(updates, { where: { id: rateId } });
    logger.log(`Billing rate ${rateId} updated`);
}
/**
 * Calculate billing amount based on rate
 *
 * @param hours - Hours worked
 * @param rate - Billing rate
 * @param settlementAmount - Settlement amount (for contingency)
 * @returns Calculated billing amount
 *
 * @example
 * ```typescript
 * const amount = calculateBillingAmount(5.5, billingRate);
 * ```
 */
function calculateBillingAmount(hours, rate, settlementAmount) {
    switch (rate.rateType) {
        case BillingRateType.HOURLY:
            return hours * (rate.hourlyRate || 0);
        case BillingRateType.FLAT_FEE:
            return rate.flatFeeAmount || 0;
        case BillingRateType.CONTINGENCY:
            if (!settlementAmount) {
                throw new common_1.BadRequestException('Settlement amount is required for contingency billing');
            }
            return settlementAmount * ((rate.contingencyPercentage || 0) / 100);
        default:
            return 0;
    }
}
// ============================================================================
// INVOICE FUNCTIONS
// ============================================================================
/**
 * Generate unique invoice number
 *
 * @param configService - Configuration service
 * @returns Unique invoice number
 *
 * @example
 * ```typescript
 * const invoiceNumber = await generateInvoiceNumber(configService);
 * // 'INV-2025-001234'
 * ```
 */
async function generateInvoiceNumber(configService) {
    const prefix = configService.get('billing.invoiceNumberPrefix', 'INV');
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${year}${month}-${timestamp}${randomPart}`;
}
/**
 * Create invoice
 *
 * @param data - Invoice creation data
 * @param userId - User creating the invoice
 * @param configService - Configuration service
 * @returns Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createInvoice({
 *   matterId: 'matter_123',
 *   clientId: 'client_456',
 *   invoiceDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
 *   periodStart: new Date('2025-01-01'),
 *   periodEnd: new Date('2025-01-31'),
 * }, 'user_789', configService);
 * ```
 */
async function createInvoice(data, userId, configService) {
    const logger = new common_1.Logger('Invoice');
    const validated = exports.InvoiceCreateSchema.parse(data);
    const invoiceNumber = await generateInvoiceNumber(configService);
    const invoice = {
        id: crypto.randomUUID(),
        invoiceNumber,
        matterId: validated.matterId,
        clientId: validated.clientId,
        invoiceDate: validated.invoiceDate,
        dueDate: validated.dueDate,
        periodStart: validated.periodStart,
        periodEnd: validated.periodEnd,
        status: InvoiceStatus.DRAFT,
        lineItems: [],
        subtotal: 0,
        taxRate: validated.taxRate,
        taxAmount: 0,
        discountAmount: validated.discountAmount || 0,
        totalAmount: 0,
        amountPaid: 0,
        amountDue: 0,
        currency: validated.currency,
        notes: validated.notes,
        termsAndConditions: validated.termsAndConditions,
        metadata: validated.metadata,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    logger.log(`Invoice ${invoiceNumber} created for matter ${validated.matterId}`);
    return invoice;
}
/**
 * Add line item to invoice
 *
 * @param invoiceId - Invoice ID
 * @param lineItem - Line item data
 * @param repository - Invoice repository
 * @returns Updated invoice
 *
 * @example
 * ```typescript
 * await addLineItemToInvoice('invoice_123', {
 *   type: 'time',
 *   description: 'Legal research',
 *   quantity: 5.5,
 *   unitPrice: 350,
 *   amount: 1925,
 *   taxable: true,
 * }, invoiceRepo);
 * ```
 */
async function addLineItemToInvoice(invoiceId, lineItem, repository) {
    const logger = new common_1.Logger('Invoice');
    const invoice = await repository.findByPk(invoiceId);
    if (!invoice) {
        throw new common_1.NotFoundException(`Invoice ${invoiceId} not found`);
    }
    if (invoice.status === InvoiceStatus.SENT || invoice.status === InvoiceStatus.PAID) {
        throw new common_1.BadRequestException('Cannot add line items to sent or paid invoice');
    }
    const newLineItem = {
        id: crypto.randomUUID(),
        invoiceId,
        ...lineItem,
    };
    // Would add to database here
    logger.log(`Line item added to invoice ${invoiceId}`);
}
/**
 * Calculate invoice total
 *
 * @param invoice - Invoice to calculate
 * @returns Updated invoice with calculated totals
 *
 * @example
 * ```typescript
 * const updatedInvoice = calculateInvoiceTotal(invoice);
 * ```
 */
function calculateInvoiceTotal(invoice) {
    const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const taxableAmount = invoice.lineItems
        .filter(item => item.taxable)
        .reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = invoice.taxRate ? (taxableAmount * invoice.taxRate) / 100 : 0;
    const totalAmount = subtotal + taxAmount - (invoice.discountAmount || 0);
    const amountDue = totalAmount - invoice.amountPaid;
    return {
        ...invoice,
        subtotal,
        taxAmount,
        totalAmount,
        amountDue,
    };
}
/**
 * Finalize invoice for sending
 *
 * @param invoiceId - Invoice ID
 * @param userId - User finalizing invoice
 * @param repository - Invoice repository
 *
 * @example
 * ```typescript
 * await finalizeInvoice('invoice_123', 'user_456', invoiceRepo);
 * ```
 */
async function finalizeInvoice(invoiceId, userId, repository) {
    const logger = new common_1.Logger('Invoice');
    const invoice = await repository.findByPk(invoiceId);
    if (!invoice) {
        throw new common_1.NotFoundException(`Invoice ${invoiceId} not found`);
    }
    if (invoice.status !== InvoiceStatus.DRAFT && invoice.status !== InvoiceStatus.PENDING_REVIEW) {
        throw new common_1.BadRequestException('Invoice cannot be finalized from current status');
    }
    await repository.update({
        status: InvoiceStatus.APPROVED,
        updatedBy: userId,
    }, { where: { id: invoiceId } });
    logger.log(`Invoice ${invoiceId} finalized`);
}
/**
 * Send invoice to client
 *
 * @param invoiceId - Invoice ID
 * @param userId - User sending invoice
 * @param repository - Invoice repository
 *
 * @example
 * ```typescript
 * await sendInvoice('invoice_123', 'user_456', invoiceRepo);
 * ```
 */
async function sendInvoice(invoiceId, userId, repository) {
    const logger = new common_1.Logger('Invoice');
    const invoice = await repository.findByPk(invoiceId);
    if (!invoice) {
        throw new common_1.NotFoundException(`Invoice ${invoiceId} not found`);
    }
    if (invoice.status !== InvoiceStatus.APPROVED) {
        throw new common_1.BadRequestException('Only approved invoices can be sent');
    }
    await repository.update({
        status: InvoiceStatus.SENT,
        sentAt: new Date(),
        updatedBy: userId,
    }, { where: { id: invoiceId } });
    logger.log(`Invoice ${invoiceId} sent to client`);
    // Integration point: would send email/notification here
}
/**
 * Mark invoice as paid
 *
 * @param invoiceId - Invoice ID
 * @param paymentAmount - Payment amount
 * @param userId - User recording payment
 * @param repository - Invoice repository
 *
 * @example
 * ```typescript
 * await markInvoiceAsPaid('invoice_123', 5000, 'user_456', invoiceRepo);
 * ```
 */
async function markInvoiceAsPaid(invoiceId, paymentAmount, userId, repository) {
    const logger = new common_1.Logger('Invoice');
    const invoice = await repository.findByPk(invoiceId);
    if (!invoice) {
        throw new common_1.NotFoundException(`Invoice ${invoiceId} not found`);
    }
    const newAmountPaid = parseFloat(invoice.amountPaid || 0) + paymentAmount;
    const newAmountDue = parseFloat(invoice.totalAmount) - newAmountPaid;
    let newStatus = invoice.status;
    let paidAt = invoice.paidAt;
    if (newAmountDue <= 0) {
        newStatus = InvoiceStatus.PAID;
        paidAt = new Date();
    }
    else if (newAmountPaid > 0) {
        newStatus = InvoiceStatus.PARTIALLY_PAID;
    }
    await repository.update({
        amountPaid: newAmountPaid,
        amountDue: newAmountDue,
        status: newStatus,
        paidAt,
        updatedBy: userId,
    }, { where: { id: invoiceId } });
    logger.log(`Invoice ${invoiceId} payment recorded: $${paymentAmount}`);
}
/**
 * Void invoice
 *
 * @param invoiceId - Invoice ID
 * @param reason - Reason for voiding
 * @param userId - User voiding invoice
 * @param repository - Invoice repository
 *
 * @example
 * ```typescript
 * await voidInvoice('invoice_123', 'Duplicate invoice created', 'user_456', invoiceRepo);
 * ```
 */
async function voidInvoice(invoiceId, reason, userId, repository) {
    const logger = new common_1.Logger('Invoice');
    const invoice = await repository.findByPk(invoiceId);
    if (!invoice) {
        throw new common_1.NotFoundException(`Invoice ${invoiceId} not found`);
    }
    if (invoice.status === InvoiceStatus.PAID) {
        throw new common_1.BadRequestException('Cannot void a paid invoice');
    }
    await repository.update({
        status: InvoiceStatus.VOID,
        voidedAt: new Date(),
        voidReason: reason,
        updatedBy: userId,
    }, { where: { id: invoiceId } });
    logger.log(`Invoice ${invoiceId} voided: ${reason}`);
}
/**
 * Get invoices by matter
 *
 * @param matterId - Matter ID
 * @param filters - Additional filters
 * @param repository - Invoice repository
 * @returns Array of invoices
 *
 * @example
 * ```typescript
 * const invoices = await getInvoicesByMatter('matter_123', { statuses: [InvoiceStatus.SENT] }, invoiceRepo);
 * ```
 */
async function getInvoicesByMatter(matterId, filters, repository) {
    const where = { matterId };
    if (filters.statuses?.length) {
        where.status = { [sequelize_1.Op.in]: filters.statuses };
    }
    if (filters.startDate || filters.endDate) {
        where.invoiceDate = {};
        if (filters.startDate) {
            where.invoiceDate[sequelize_1.Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
            where.invoiceDate[sequelize_1.Op.lte] = filters.endDate;
        }
    }
    if (filters.minAmount !== undefined) {
        where.totalAmount = { [sequelize_1.Op.gte]: filters.minAmount };
    }
    if (filters.maxAmount !== undefined) {
        where.totalAmount = { ...where.totalAmount, [sequelize_1.Op.lte]: filters.maxAmount };
    }
    if (filters.tenantId) {
        where.tenantId = filters.tenantId;
    }
    const invoices = await repository.findAll({
        where,
        order: [['invoiceDate', 'DESC']],
    });
    return invoices.map((i) => i.toJSON());
}
/**
 * Get invoices by client
 *
 * @param clientId - Client ID
 * @param filters - Additional filters
 * @param repository - Invoice repository
 * @returns Array of invoices
 *
 * @example
 * ```typescript
 * const invoices = await getInvoicesByClient('client_123', {}, invoiceRepo);
 * ```
 */
async function getInvoicesByClient(clientId, filters, repository) {
    const where = { clientId };
    if (filters.matterId) {
        where.matterId = filters.matterId;
    }
    if (filters.statuses?.length) {
        where.status = { [sequelize_1.Op.in]: filters.statuses };
    }
    if (filters.startDate || filters.endDate) {
        where.invoiceDate = {};
        if (filters.startDate) {
            where.invoiceDate[sequelize_1.Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
            where.invoiceDate[sequelize_1.Op.lte] = filters.endDate;
        }
    }
    if (filters.minAmount !== undefined) {
        where.totalAmount = { [sequelize_1.Op.gte]: filters.minAmount };
    }
    if (filters.maxAmount !== undefined) {
        where.totalAmount = { ...where.totalAmount, [sequelize_1.Op.lte]: filters.maxAmount };
    }
    if (filters.tenantId) {
        where.tenantId = filters.tenantId;
    }
    const invoices = await repository.findAll({
        where,
        order: [['invoiceDate', 'DESC']],
    });
    return invoices.map((i) => i.toJSON());
}
// ============================================================================
// EXPENSE FUNCTIONS
// ============================================================================
/**
 * Create expense
 *
 * @param data - Expense creation data
 * @param userId - User creating expense
 * @returns Created expense
 *
 * @example
 * ```typescript
 * const expense = await createExpense({
 *   matterId: 'matter_123',
 *   clientId: 'client_456',
 *   category: ExpenseCategory.FILING_FEES,
 *   description: 'Court filing fee for motion',
 *   amount: 425,
 *   expenseDate: new Date(),
 *   billable: true,
 * }, 'user_789');
 * ```
 */
async function createExpense(data, userId) {
    const logger = new common_1.Logger('Expense');
    const validated = exports.ExpenseCreateSchema.parse(data);
    const expense = {
        id: crypto.randomUUID(),
        matterId: validated.matterId,
        clientId: validated.clientId,
        category: validated.category,
        description: validated.description,
        amount: validated.amount,
        currency: validated.currency,
        expenseDate: validated.expenseDate,
        reimbursable: validated.reimbursable,
        billable: validated.billable,
        receiptUrl: validated.receiptUrl,
        vendorName: validated.vendorName,
        status: 'pending',
        metadata: validated.metadata,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    logger.log(`Expense created: ${validated.category} for $${validated.amount}`);
    return expense;
}
/**
 * Get expenses by matter
 *
 * @param matterId - Matter ID
 * @param filters - Additional filters
 * @param repository - Expense repository
 * @returns Array of expenses
 *
 * @example
 * ```typescript
 * const expenses = await getExpensesByMatter('matter_123', { billable: true }, expenseRepo);
 * ```
 */
async function getExpensesByMatter(matterId, filters, repository) {
    const where = { matterId };
    if (filters.category) {
        where.category = filters.category;
    }
    if (filters.billable !== undefined) {
        where.billable = filters.billable;
    }
    if (filters.status) {
        where.status = filters.status;
    }
    const expenses = await repository.findAll({
        where,
        order: [['expenseDate', 'DESC']],
    });
    return expenses.map((e) => e.toJSON());
}
/**
 * Reimburse expense
 *
 * @param expenseId - Expense ID
 * @param userId - User processing reimbursement
 * @param repository - Expense repository
 *
 * @example
 * ```typescript
 * await reimburseExpense('expense_123', 'user_456', expenseRepo);
 * ```
 */
async function reimburseExpense(expenseId, userId, repository) {
    const logger = new common_1.Logger('Expense');
    const expense = await repository.findByPk(expenseId);
    if (!expense) {
        throw new common_1.NotFoundException(`Expense ${expenseId} not found`);
    }
    if (!expense.reimbursable) {
        throw new common_1.BadRequestException('Expense is not marked as reimbursable');
    }
    await repository.update({
        status: 'reimbursed',
        reimbursedAt: new Date(),
        updatedBy: userId,
    }, { where: { id: expenseId } });
    logger.log(`Expense ${expenseId} reimbursed`);
}
// ============================================================================
// TRUST ACCOUNTING FUNCTIONS
// ============================================================================
/**
 * Create trust account
 *
 * @param accountData - Trust account data
 * @returns Created trust account
 *
 * @example
 * ```typescript
 * const trustAccount = await createTrustAccount({
 *   accountNumber: 'TRUST-001',
 *   accountName: 'Client Trust Account',
 *   accountType: 'client_trust',
 *   bankName: 'First National Bank',
 *   bankAccountNumber: '123456789',
 *   openedDate: new Date(),
 * });
 * ```
 */
async function createTrustAccount(accountData) {
    const logger = new common_1.Logger('TrustAccount');
    const trustAccount = {
        id: crypto.randomUUID(),
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...accountData,
    };
    logger.log(`Trust account created: ${accountData.accountNumber}`);
    return trustAccount;
}
/**
 * Deposit to trust account
 *
 * @param accountId - Trust account ID
 * @param amount - Deposit amount
 * @param description - Transaction description
 * @param userId - User making deposit
 * @param repository - Trust account repository
 * @returns Trust transaction
 *
 * @example
 * ```typescript
 * await depositToTrust('account_123', 5000, 'Retainer payment from client', 'user_456', trustRepo);
 * ```
 */
async function depositToTrust(accountId, amount, description, userId, repository) {
    const logger = new common_1.Logger('TrustAccount');
    if (amount <= 0) {
        throw new common_1.BadRequestException('Deposit amount must be positive');
    }
    const account = await repository.findByPk(accountId);
    if (!account) {
        throw new common_1.NotFoundException(`Trust account ${accountId} not found`);
    }
    if (!account.isActive) {
        throw new common_1.BadRequestException('Cannot deposit to inactive trust account');
    }
    const newBalance = parseFloat(account.balance) + amount;
    const transaction = {
        id: crypto.randomUUID(),
        trustAccountId: accountId,
        transactionType: TrustAccountTransactionType.DEPOSIT,
        amount,
        balance: newBalance,
        transactionDate: new Date(),
        description,
        metadata: {},
        createdBy: userId,
        createdAt: new Date(),
    };
    // Would update account balance and save transaction here
    logger.log(`Trust deposit: $${amount} to account ${accountId}`);
    return transaction;
}
/**
 * Withdraw from trust account
 *
 * @param accountId - Trust account ID
 * @param amount - Withdrawal amount
 * @param description - Transaction description
 * @param userId - User making withdrawal
 * @param repository - Trust account repository
 * @returns Trust transaction
 *
 * @example
 * ```typescript
 * await withdrawFromTrust('account_123', 1500, 'Payment to expert witness', 'user_456', trustRepo);
 * ```
 */
async function withdrawFromTrust(accountId, amount, description, userId, repository) {
    const logger = new common_1.Logger('TrustAccount');
    if (amount <= 0) {
        throw new common_1.BadRequestException('Withdrawal amount must be positive');
    }
    const account = await repository.findByPk(accountId);
    if (!account) {
        throw new common_1.NotFoundException(`Trust account ${accountId} not found`);
    }
    if (!account.isActive) {
        throw new common_1.BadRequestException('Cannot withdraw from inactive trust account');
    }
    const currentBalance = parseFloat(account.balance);
    if (currentBalance < amount) {
        throw new common_1.BadRequestException('Insufficient trust account balance');
    }
    const newBalance = currentBalance - amount;
    const transaction = {
        id: crypto.randomUUID(),
        trustAccountId: accountId,
        transactionType: TrustAccountTransactionType.WITHDRAWAL,
        amount,
        balance: newBalance,
        transactionDate: new Date(),
        description,
        metadata: {},
        createdBy: userId,
        createdAt: new Date(),
    };
    // Would update account balance and save transaction here
    logger.log(`Trust withdrawal: $${amount} from account ${accountId}`);
    return transaction;
}
/**
 * Transfer between trust accounts
 *
 * @param fromAccountId - Source trust account ID
 * @param toAccountId - Destination trust account ID
 * @param amount - Transfer amount
 * @param description - Transfer description
 * @param userId - User making transfer
 * @param repository - Trust account repository
 * @returns Array of trust transactions (withdrawal and deposit)
 *
 * @example
 * ```typescript
 * await transferBetweenTrust('account_123', 'account_456', 2000, 'Transfer to client matter account', 'user_789', trustRepo);
 * ```
 */
async function transferBetweenTrust(fromAccountId, toAccountId, amount, description, userId, repository) {
    const logger = new common_1.Logger('TrustAccount');
    if (amount <= 0) {
        throw new common_1.BadRequestException('Transfer amount must be positive');
    }
    if (fromAccountId === toAccountId) {
        throw new common_1.BadRequestException('Cannot transfer to same account');
    }
    // Verify both accounts exist
    const fromAccount = await repository.findByPk(fromAccountId);
    const toAccount = await repository.findByPk(toAccountId);
    if (!fromAccount || !toAccount) {
        throw new common_1.NotFoundException('One or both trust accounts not found');
    }
    if (!fromAccount.isActive || !toAccount.isActive) {
        throw new common_1.BadRequestException('Cannot transfer to/from inactive trust accounts');
    }
    const fromBalance = parseFloat(fromAccount.balance);
    if (fromBalance < amount) {
        throw new common_1.BadRequestException('Insufficient balance in source trust account');
    }
    // Create withdrawal transaction
    const withdrawalTx = {
        id: crypto.randomUUID(),
        trustAccountId: fromAccountId,
        transactionType: TrustAccountTransactionType.TRANSFER,
        amount,
        balance: fromBalance - amount,
        transactionDate: new Date(),
        description: `Transfer to ${toAccount.accountNumber}: ${description}`,
        toAccountId,
        metadata: {},
        createdBy: userId,
        createdAt: new Date(),
    };
    // Create deposit transaction
    const depositTx = {
        id: crypto.randomUUID(),
        trustAccountId: toAccountId,
        transactionType: TrustAccountTransactionType.TRANSFER,
        amount,
        balance: parseFloat(toAccount.balance) + amount,
        transactionDate: new Date(),
        description: `Transfer from ${fromAccount.accountNumber}: ${description}`,
        fromAccountId,
        metadata: {},
        createdBy: userId,
        createdAt: new Date(),
    };
    // Would update both account balances and save transactions here
    logger.log(`Trust transfer: $${amount} from ${fromAccountId} to ${toAccountId}`);
    return [withdrawalTx, depositTx];
}
/**
 * Get trust account balance
 *
 * @param accountId - Trust account ID
 * @param repository - Trust account repository
 * @returns Current balance
 *
 * @example
 * ```typescript
 * const balance = await getTrustBalance('account_123', trustRepo);
 * ```
 */
async function getTrustBalance(accountId, repository) {
    const account = await repository.findByPk(accountId);
    if (!account) {
        throw new common_1.NotFoundException(`Trust account ${accountId} not found`);
    }
    return parseFloat(account.balance);
}
/**
 * Get trust transaction history
 *
 * @param accountId - Trust account ID
 * @param startDate - Start date for history
 * @param endDate - End date for history
 * @param repository - Trust transaction repository
 * @returns Array of trust transactions
 *
 * @example
 * ```typescript
 * const history = await getTrustTransactionHistory('account_123', new Date('2025-01-01'), new Date('2025-01-31'), txRepo);
 * ```
 */
async function getTrustTransactionHistory(accountId, startDate, endDate, repository) {
    const where = {
        trustAccountId: accountId,
        transactionDate: {
            [sequelize_1.Op.between]: [startDate, endDate],
        },
    };
    const transactions = await repository.findAll({
        where,
        order: [['transactionDate', 'ASC']],
    });
    return transactions.map((tx) => tx.toJSON());
}
/**
 * Reconcile trust account
 *
 * @param accountId - Trust account ID
 * @param bankBalance - Balance from bank statement
 * @param reconciliationDate - Reconciliation date
 * @param userId - User performing reconciliation
 * @param repository - Trust account repository
 * @returns Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileTrustAccount('account_123', 45000, new Date(), 'user_456', trustRepo);
 * ```
 */
async function reconcileTrustAccount(accountId, bankBalance, reconciliationDate, userId, repository) {
    const logger = new common_1.Logger('TrustAccount');
    const account = await repository.findByPk(accountId);
    if (!account) {
        throw new common_1.NotFoundException(`Trust account ${accountId} not found`);
    }
    const systemBalance = parseFloat(account.balance);
    const difference = Math.abs(systemBalance - bankBalance);
    const reconciled = difference < 0.01; // Within 1 cent
    if (reconciled) {
        logger.log(`Trust account ${accountId} reconciled successfully`);
    }
    else {
        logger.warn(`Trust account ${accountId} reconciliation discrepancy: $${difference.toFixed(2)}`);
    }
    return {
        systemBalance,
        bankBalance,
        difference,
        reconciled,
    };
}
// ============================================================================
// WIP (WORK IN PROGRESS) FUNCTIONS
// ============================================================================
/**
 * Create WIP entry
 *
 * @param wipData - WIP entry data
 * @returns Created WIP entry
 *
 * @example
 * ```typescript
 * const wip = await createWIPEntry({
 *   matterId: 'matter_123',
 *   clientId: 'client_456',
 *   timekeeperId: 'user_789',
 *   type: 'time',
 *   description: 'Legal research',
 *   date: new Date(),
 *   hours: 3.5,
 *   amount: 1225,
 * });
 * ```
 */
async function createWIPEntry(wipData) {
    const logger = new common_1.Logger('WIP');
    const wipEntry = {
        id: crypto.randomUUID(),
        status: WIPStatus.UNBILLED,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...wipData,
    };
    logger.log(`WIP entry created: ${wipData.type} for $${wipData.amount}`);
    return wipEntry;
}
/**
 * Convert WIP to invoice
 *
 * @param matterId - Matter ID
 * @param invoiceId - Invoice ID
 * @param repository - WIP repository
 * @returns Number of WIP entries converted
 *
 * @example
 * ```typescript
 * const count = await convertWIPToInvoice('matter_123', 'invoice_456', wipRepo);
 * ```
 */
async function convertWIPToInvoice(matterId, invoiceId, repository) {
    const logger = new common_1.Logger('WIP');
    const wipEntries = await repository.findAll({
        where: {
            matterId,
            status: WIPStatus.UNBILLED,
        },
    });
    await repository.update({
        status: WIPStatus.BILLED,
        invoiceId,
        billedAt: new Date(),
    }, {
        where: {
            matterId,
            status: WIPStatus.UNBILLED,
        },
    });
    logger.log(`Converted ${wipEntries.length} WIP entries to invoice ${invoiceId}`);
    return wipEntries.length;
}
/**
 * Get WIP by matter
 *
 * @param matterId - Matter ID
 * @param filters - Additional filters
 * @param repository - WIP repository
 * @returns Array of WIP entries
 *
 * @example
 * ```typescript
 * const wip = await getWIPByMatter('matter_123', { status: WIPStatus.UNBILLED }, wipRepo);
 * ```
 */
async function getWIPByMatter(matterId, filters, repository) {
    const where = { matterId };
    if (filters.status) {
        where.status = filters.status;
    }
    if (filters.type) {
        where.type = filters.type;
    }
    const wipEntries = await repository.findAll({
        where,
        order: [['date', 'DESC']],
    });
    return wipEntries.map((w) => w.toJSON());
}
/**
 * Write off WIP entry
 *
 * @param wipId - WIP entry ID
 * @param reason - Write-off reason
 * @param userId - User writing off WIP
 * @param repository - WIP repository
 *
 * @example
 * ```typescript
 * await writeOffWIP('wip_123', 'Client dispute - goodwill write-off', 'user_456', wipRepo);
 * ```
 */
async function writeOffWIP(wipId, reason, userId, repository) {
    const logger = new common_1.Logger('WIP');
    const wip = await repository.findByPk(wipId);
    if (!wip) {
        throw new common_1.NotFoundException(`WIP entry ${wipId} not found`);
    }
    if (wip.status === WIPStatus.BILLED) {
        throw new common_1.BadRequestException('Cannot write off billed WIP');
    }
    await repository.update({
        status: WIPStatus.WRITTEN_OFF,
        writtenOffAt: new Date(),
        writeOffReason: reason,
    }, { where: { id: wipId } });
    logger.log(`WIP entry ${wipId} written off: ${reason}`);
}
// ============================================================================
// REPORTING FUNCTIONS
// ============================================================================
/**
 * Generate aging report for outstanding invoices
 *
 * @param tenantId - Tenant ID (optional)
 * @param repository - Invoice repository
 * @returns Aging report
 *
 * @example
 * ```typescript
 * const report = await generateAgingReport('tenant_123', invoiceRepo);
 * console.log(`Total outstanding: $${report.totalOutstanding}`);
 * ```
 */
async function generateAgingReport(tenantId, repository) {
    const logger = new common_1.Logger('Reporting');
    const where = {
        status: {
            [sequelize_1.Op.in]: [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE],
        },
    };
    if (tenantId) {
        where.tenantId = tenantId;
    }
    const invoices = await repository.findAll({ where });
    const now = new Date();
    const buckets = {
        current: [],
        days30: [],
        days60: [],
        days90: [],
        days120Plus: [],
    };
    let totalOutstanding = 0;
    for (const invoice of invoices) {
        const daysOutstanding = Math.floor((now.getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        const amountDue = parseFloat(invoice.amountDue);
        totalOutstanding += amountDue;
        if (daysOutstanding < 0) {
            buckets.current.push(invoice.toJSON());
        }
        else if (daysOutstanding < 30) {
            buckets.current.push(invoice.toJSON());
        }
        else if (daysOutstanding < 60) {
            buckets.days30.push(invoice.toJSON());
        }
        else if (daysOutstanding < 90) {
            buckets.days60.push(invoice.toJSON());
        }
        else if (daysOutstanding < 120) {
            buckets.days90.push(invoice.toJSON());
        }
        else {
            buckets.days120Plus.push(invoice.toJSON());
        }
    }
    const report = {
        generatedAt: new Date(),
        totalOutstanding,
        currency: 'USD',
        buckets: {
            current: buckets.current.reduce((sum, inv) => sum + parseFloat(inv.amountDue), 0),
            days30: buckets.days30.reduce((sum, inv) => sum + parseFloat(inv.amountDue), 0),
            days60: buckets.days60.reduce((sum, inv) => sum + parseFloat(inv.amountDue), 0),
            days90: buckets.days90.reduce((sum, inv) => sum + parseFloat(inv.amountDue), 0),
            days120Plus: buckets.days120Plus.reduce((sum, inv) => sum + parseFloat(inv.amountDue), 0),
        },
        invoicesByBucket: buckets,
    };
    logger.log(`Aging report generated: $${totalOutstanding} outstanding`);
    return report;
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
/**
 * Billing and Timekeeping Service
 * NestJS service for billing operations with dependency injection
 */
let BillingTimekeepingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BillingTimekeepingService = _classThis = class {
        constructor(timeEntryRepo, billingRateRepo, invoiceRepo, expenseRepo, trustAccountRepo, trustTxRepo, wipRepo, paymentRepo, configService) {
            this.timeEntryRepo = timeEntryRepo;
            this.billingRateRepo = billingRateRepo;
            this.invoiceRepo = invoiceRepo;
            this.expenseRepo = expenseRepo;
            this.trustAccountRepo = trustAccountRepo;
            this.trustTxRepo = trustTxRepo;
            this.wipRepo = wipRepo;
            this.paymentRepo = paymentRepo;
            this.configService = configService;
            this.logger = new common_1.Logger(BillingTimekeepingService.name);
        }
        /**
         * Create time entry
         */
        async createTimeEntry(data, userId) {
            this.logger.log(`Creating time entry for matter ${data.matterId}`);
            return createTimeEntry(data, userId, this.configService);
        }
        /**
         * Get time entries by matter
         */
        async getTimeEntriesByMatter(matterId, filters) {
            return getTimeEntriesByMatter(matterId, filters, this.timeEntryRepo);
        }
        /**
         * Create invoice
         */
        async createInvoice(data, userId) {
            this.logger.log(`Creating invoice for matter ${data.matterId}`);
            return createInvoice(data, userId, this.configService);
        }
        /**
         * Send invoice
         */
        async sendInvoice(invoiceId, userId) {
            return sendInvoice(invoiceId, userId, this.invoiceRepo);
        }
        /**
         * Create expense
         */
        async createExpense(data, userId) {
            return createExpense(data, userId);
        }
        /**
         * Deposit to trust
         */
        async depositToTrust(accountId, amount, description, userId) {
            return depositToTrust(accountId, amount, description, userId, this.trustAccountRepo);
        }
        /**
         * Generate aging report
         */
        async generateAgingReport(tenantId) {
            return generateAgingReport(tenantId, this.invoiceRepo);
        }
    };
    __setFunctionName(_classThis, "BillingTimekeepingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BillingTimekeepingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BillingTimekeepingService = _classThis;
})();
exports.BillingTimekeepingService = BillingTimekeepingService;
// ============================================================================
// SWAGGER API DOCUMENTATION
// ============================================================================
/**
 * Time Entry DTO
 */
let TimeEntryDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _timekeeperId_decorators;
    let _timekeeperId_initializers = [];
    let _timekeeperId_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _date_decorators;
    let _date_initializers = [];
    let _date_extraInitializers = [];
    let _hours_decorators;
    let _hours_initializers = [];
    let _hours_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _billable_decorators;
    let _billable_initializers = [];
    let _billable_extraInitializers = [];
    let _billingRate_decorators;
    let _billingRate_initializers = [];
    let _billingRate_extraInitializers = [];
    let _billingAmount_decorators;
    let _billingAmount_initializers = [];
    let _billingAmount_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    return _a = class TimeEntryDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.timekeeperId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _timekeeperId_initializers, void 0));
                this.matterId = (__runInitializers(this, _timekeeperId_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
                this.date = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _date_initializers, void 0));
                this.hours = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _hours_initializers, void 0));
                this.description = (__runInitializers(this, _hours_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.billable = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _billable_initializers, void 0));
                this.billingRate = (__runInitializers(this, _billable_extraInitializers), __runInitializers(this, _billingRate_initializers, void 0));
                this.billingAmount = (__runInitializers(this, _billingRate_extraInitializers), __runInitializers(this, _billingAmount_initializers, void 0));
                this.status = (__runInitializers(this, _billingAmount_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Time entry ID' })];
            _timekeeperId_decorators = [(0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Timekeeper ID' })];
            _matterId_decorators = [(0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Matter ID' })];
            _date_decorators = [(0, swagger_1.ApiProperty)({ type: Date, description: 'Entry date' })];
            _hours_decorators = [(0, swagger_1.ApiProperty)({ example: 5.5, description: 'Hours worked' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work description' })];
            _billable_decorators = [(0, swagger_1.ApiProperty)({ example: true, description: 'Billable flag' })];
            _billingRate_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 350, description: 'Billing rate' })];
            _billingAmount_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 1925, description: 'Billing amount' })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: TimeEntryStatus, description: 'Entry status' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _timekeeperId_decorators, { kind: "field", name: "timekeeperId", static: false, private: false, access: { has: obj => "timekeeperId" in obj, get: obj => obj.timekeeperId, set: (obj, value) => { obj.timekeeperId = value; } }, metadata: _metadata }, _timekeeperId_initializers, _timekeeperId_extraInitializers);
            __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: obj => "date" in obj, get: obj => obj.date, set: (obj, value) => { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _hours_decorators, { kind: "field", name: "hours", static: false, private: false, access: { has: obj => "hours" in obj, get: obj => obj.hours, set: (obj, value) => { obj.hours = value; } }, metadata: _metadata }, _hours_initializers, _hours_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _billable_decorators, { kind: "field", name: "billable", static: false, private: false, access: { has: obj => "billable" in obj, get: obj => obj.billable, set: (obj, value) => { obj.billable = value; } }, metadata: _metadata }, _billable_initializers, _billable_extraInitializers);
            __esDecorate(null, null, _billingRate_decorators, { kind: "field", name: "billingRate", static: false, private: false, access: { has: obj => "billingRate" in obj, get: obj => obj.billingRate, set: (obj, value) => { obj.billingRate = value; } }, metadata: _metadata }, _billingRate_initializers, _billingRate_extraInitializers);
            __esDecorate(null, null, _billingAmount_decorators, { kind: "field", name: "billingAmount", static: false, private: false, access: { has: obj => "billingAmount" in obj, get: obj => obj.billingAmount, set: (obj, value) => { obj.billingAmount = value; } }, metadata: _metadata }, _billingAmount_initializers, _billingAmount_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TimeEntryDto = TimeEntryDto;
/**
 * Invoice DTO
 */
let InvoiceDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _invoiceNumber_decorators;
    let _invoiceNumber_initializers = [];
    let _invoiceNumber_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _invoiceDate_decorators;
    let _invoiceDate_initializers = [];
    let _invoiceDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _amountPaid_decorators;
    let _amountPaid_initializers = [];
    let _amountPaid_extraInitializers = [];
    let _amountDue_decorators;
    let _amountDue_initializers = [];
    let _amountDue_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    return _a = class InvoiceDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.invoiceNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _invoiceNumber_initializers, void 0));
                this.matterId = (__runInitializers(this, _invoiceNumber_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
                this.invoiceDate = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _invoiceDate_initializers, void 0));
                this.dueDate = (__runInitializers(this, _invoiceDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.status = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.totalAmount = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
                this.amountPaid = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _amountPaid_initializers, void 0));
                this.amountDue = (__runInitializers(this, _amountPaid_extraInitializers), __runInitializers(this, _amountDue_initializers, void 0));
                this.currency = (__runInitializers(this, _amountDue_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Invoice ID' })];
            _invoiceNumber_decorators = [(0, swagger_1.ApiProperty)({ example: 'INV-202501-001234', description: 'Invoice number' })];
            _matterId_decorators = [(0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Matter ID' })];
            _invoiceDate_decorators = [(0, swagger_1.ApiProperty)({ type: Date, description: 'Invoice date' })];
            _dueDate_decorators = [(0, swagger_1.ApiProperty)({ type: Date, description: 'Due date' })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: InvoiceStatus, description: 'Invoice status' })];
            _totalAmount_decorators = [(0, swagger_1.ApiProperty)({ example: 5000, description: 'Total amount' })];
            _amountPaid_decorators = [(0, swagger_1.ApiProperty)({ example: 1250, description: 'Amount paid' })];
            _amountDue_decorators = [(0, swagger_1.ApiProperty)({ example: 3750, description: 'Amount due' })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ example: 'USD', description: 'Currency code' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _invoiceNumber_decorators, { kind: "field", name: "invoiceNumber", static: false, private: false, access: { has: obj => "invoiceNumber" in obj, get: obj => obj.invoiceNumber, set: (obj, value) => { obj.invoiceNumber = value; } }, metadata: _metadata }, _invoiceNumber_initializers, _invoiceNumber_extraInitializers);
            __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
            __esDecorate(null, null, _invoiceDate_decorators, { kind: "field", name: "invoiceDate", static: false, private: false, access: { has: obj => "invoiceDate" in obj, get: obj => obj.invoiceDate, set: (obj, value) => { obj.invoiceDate = value; } }, metadata: _metadata }, _invoiceDate_initializers, _invoiceDate_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
            __esDecorate(null, null, _amountPaid_decorators, { kind: "field", name: "amountPaid", static: false, private: false, access: { has: obj => "amountPaid" in obj, get: obj => obj.amountPaid, set: (obj, value) => { obj.amountPaid = value; } }, metadata: _metadata }, _amountPaid_initializers, _amountPaid_extraInitializers);
            __esDecorate(null, null, _amountDue_decorators, { kind: "field", name: "amountDue", static: false, private: false, access: { has: obj => "amountDue" in obj, get: obj => obj.amountDue, set: (obj, value) => { obj.amountDue = value; } }, metadata: _metadata }, _amountDue_initializers, _amountDue_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.InvoiceDto = InvoiceDto;
/**
 * Expense DTO
 */
let ExpenseDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _expenseDate_decorators;
    let _expenseDate_initializers = [];
    let _expenseDate_extraInitializers = [];
    let _billable_decorators;
    let _billable_initializers = [];
    let _billable_extraInitializers = [];
    return _a = class ExpenseDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
                this.category = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.amount = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.expenseDate = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _expenseDate_initializers, void 0));
                this.billable = (__runInitializers(this, _expenseDate_extraInitializers), __runInitializers(this, _billable_initializers, void 0));
                __runInitializers(this, _billable_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _matterId_decorators = [(0, swagger_1.ApiProperty)()];
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: ExpenseCategory })];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _amount_decorators = [(0, swagger_1.ApiProperty)({ example: 425.00 })];
            _expenseDate_decorators = [(0, swagger_1.ApiProperty)({ type: Date })];
            _billable_decorators = [(0, swagger_1.ApiProperty)({ default: true })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _expenseDate_decorators, { kind: "field", name: "expenseDate", static: false, private: false, access: { has: obj => "expenseDate" in obj, get: obj => obj.expenseDate, set: (obj, value) => { obj.expenseDate = value; } }, metadata: _metadata }, _expenseDate_initializers, _expenseDate_extraInitializers);
            __esDecorate(null, null, _billable_decorators, { kind: "field", name: "billable", static: false, private: false, access: { has: obj => "billable" in obj, get: obj => obj.billable, set: (obj, value) => { obj.billable = value; } }, metadata: _metadata }, _billable_initializers, _billable_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ExpenseDto = ExpenseDto;
/**
 * Trust Transaction DTO
 */
let TrustTransactionDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _trustAccountId_decorators;
    let _trustAccountId_initializers = [];
    let _trustAccountId_extraInitializers = [];
    let _transactionType_decorators;
    let _transactionType_initializers = [];
    let _transactionType_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _balance_decorators;
    let _balance_initializers = [];
    let _balance_extraInitializers = [];
    let _transactionDate_decorators;
    let _transactionDate_initializers = [];
    let _transactionDate_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    return _a = class TrustTransactionDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.trustAccountId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _trustAccountId_initializers, void 0));
                this.transactionType = (__runInitializers(this, _trustAccountId_extraInitializers), __runInitializers(this, _transactionType_initializers, void 0));
                this.amount = (__runInitializers(this, _transactionType_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.balance = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _balance_initializers, void 0));
                this.transactionDate = (__runInitializers(this, _balance_extraInitializers), __runInitializers(this, _transactionDate_initializers, void 0));
                this.description = (__runInitializers(this, _transactionDate_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _trustAccountId_decorators = [(0, swagger_1.ApiProperty)()];
            _transactionType_decorators = [(0, swagger_1.ApiProperty)({ enum: TrustAccountTransactionType })];
            _amount_decorators = [(0, swagger_1.ApiProperty)({ example: 5000 })];
            _balance_decorators = [(0, swagger_1.ApiProperty)({ example: 45000 })];
            _transactionDate_decorators = [(0, swagger_1.ApiProperty)({ type: Date })];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _trustAccountId_decorators, { kind: "field", name: "trustAccountId", static: false, private: false, access: { has: obj => "trustAccountId" in obj, get: obj => obj.trustAccountId, set: (obj, value) => { obj.trustAccountId = value; } }, metadata: _metadata }, _trustAccountId_initializers, _trustAccountId_extraInitializers);
            __esDecorate(null, null, _transactionType_decorators, { kind: "field", name: "transactionType", static: false, private: false, access: { has: obj => "transactionType" in obj, get: obj => obj.transactionType, set: (obj, value) => { obj.transactionType = value; } }, metadata: _metadata }, _transactionType_initializers, _transactionType_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _balance_decorators, { kind: "field", name: "balance", static: false, private: false, access: { has: obj => "balance" in obj, get: obj => obj.balance, set: (obj, value) => { obj.balance = value; } }, metadata: _metadata }, _balance_initializers, _balance_extraInitializers);
            __esDecorate(null, null, _transactionDate_decorators, { kind: "field", name: "transactionDate", static: false, private: false, access: { has: obj => "transactionDate" in obj, get: obj => obj.transactionDate, set: (obj, value) => { obj.transactionDate = value; } }, metadata: _metadata }, _transactionDate_initializers, _transactionDate_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TrustTransactionDto = TrustTransactionDto;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Configuration
    registerBillingConfig,
    createBillingConfigModule,
    // Time Entry Functions
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    getTimeEntriesByMatter,
    getTimeEntriesByTimekeeper,
    calculateBillableHours,
    // Billing Rate Functions
    createBillingRate,
    getBillingRateForTimekeeper,
    updateBillingRate,
    calculateBillingAmount,
    // Invoice Functions
    generateInvoiceNumber,
    createInvoice,
    addLineItemToInvoice,
    calculateInvoiceTotal,
    finalizeInvoice,
    sendInvoice,
    markInvoiceAsPaid,
    voidInvoice,
    getInvoicesByMatter,
    getInvoicesByClient,
    // Expense Functions
    createExpense,
    getExpensesByMatter,
    reimburseExpense,
    // Trust Accounting Functions
    createTrustAccount,
    depositToTrust,
    withdrawFromTrust,
    transferBetweenTrust,
    getTrustBalance,
    getTrustTransactionHistory,
    reconcileTrustAccount,
    // WIP Functions
    createWIPEntry,
    convertWIPToInvoice,
    getWIPByMatter,
    writeOffWIP,
    // Reporting Functions
    generateAgingReport,
    // Service
    BillingTimekeepingService,
};
//# sourceMappingURL=legal-billing-timekeeping-kit.js.map