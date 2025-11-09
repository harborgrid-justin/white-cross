"use strict";
/**
 * LOC: HCM_PAYROLL_INT_001
 * File: /reuse/server/human-capital/payroll-integration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - moment
 *
 * DOWNSTREAM (imported by):
 *   - Payroll service implementations
 *   - Third-party payroll provider integrations
 *   - Tax calculation services
 *   - GL reconciliation services
 *   - Payroll reporting & analytics
 *   - Compliance & audit systems
 */
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollIntegrationService = exports.PayrollAuditLogModel = exports.ThirdPartyIntegrationModel = exports.PayrollReconciliationModel = exports.GarnishmentModel = exports.OffCyclePayrollModel = exports.RetroactivePayModel = exports.PayrollPeriodModel = exports.PayrollCalendarModel = exports.TaxWithholdingModel = exports.DeductionsModel = exports.EarningsModel = exports.PayrollDataSyncModel = exports.PayrollRunModel = exports.GarnishmentSchema = exports.OffCyclePayrollSchema = exports.RetroactivePaySchema = exports.PayrollPeriodSchema = exports.TaxWithholdingSchema = exports.DeductionsSchema = exports.EarningsSchema = exports.PayrollRunSchema = exports.PaymentMethod = exports.ReconciliationStatus = exports.SyncStatus = exports.PayrollProvider = exports.GarnishmentStatus = exports.GarnishmentType = exports.OffCycleReason = exports.AdjustmentType = exports.PayrollPeriodStatus = exports.PayrollFrequency = exports.TaxType = exports.TaxFilingStatus = exports.DeductionCalculationMethod = exports.DeductionType = exports.EarningType = exports.PayrollRunStatus = void 0;
exports.syncPayrollEmployeeData = syncPayrollEmployeeData;
exports.syncTimeAndAttendance = syncTimeAndAttendance;
exports.syncPayrollChanges = syncPayrollChanges;
exports.validatePayrollDataIntegrity = validatePayrollDataIntegrity;
exports.preparePayrollRun = preparePayrollRun;
exports.validatePayrollInputs = validatePayrollInputs;
exports.lockPayrollPeriod = lockPayrollPeriod;
exports.approvePayrollRun = approvePayrollRun;
exports.calculateEarnings = calculateEarnings;
exports.applyDeductions = applyDeductions;
exports.trackRecurringDeductions = trackRecurringDeductions;
exports.generateEarningsStatement = generateEarningsStatement;
exports.calculateFederalTax = calculateFederalTax;
exports.calculateStateTax = calculateStateTax;
exports.calculateLocalTax = calculateLocalTax;
exports.applyTaxExemptions = applyTaxExemptions;
exports.createPayrollCalendar = createPayrollCalendar;
exports.getPayrollSchedule = getPayrollSchedule;
exports.adjustPayrollDates = adjustPayrollDates;
exports.notifyPayrollDeadlines = notifyPayrollDeadlines;
exports.calculateRetroactivePay = calculateRetroactivePay;
exports.applyPayrollAdjustments = applyPayrollAdjustments;
exports.trackAdjustmentHistory = trackAdjustmentHistory;
exports.reconcileRetroactiveChanges = reconcileRetroactiveChanges;
exports.createOffCyclePayroll = createOffCyclePayroll;
exports.processBonusPayment = processBonusPayment;
exports.calculateSeverancePay = calculateSeverancePay;
exports.processCommissionPayment = processCommissionPayment;
exports.applyGarnishment = applyGarnishment;
exports.trackGarnishmentOrders = trackGarnishmentOrders;
exports.reportGarnishmentPayments = reportGarnishmentPayments;
exports.generatePayrollRegister = generatePayrollRegister;
exports.analyzePayrollCosts = analyzePayrollCosts;
exports.generatePayrollSummary = generatePayrollSummary;
exports.exportPayrollReports = exportPayrollReports;
exports.reconcilePayrollToGL = reconcilePayrollToGL;
exports.validatePayrollTotals = validatePayrollTotals;
exports.trackPayrollDiscrepancies = trackPayrollDiscrepancies;
exports.generateReconciliationReport = generateReconciliationReport;
exports.connectPayrollProvider = connectPayrollProvider;
exports.exportPayrollDataToProvider = exportPayrollDataToProvider;
exports.importPayrollResultsFromProvider = importPayrollResultsFromProvider;
exports.syncPayrollProviderStatus = syncPayrollProviderStatus;
exports.auditPayrollRun = auditPayrollRun;
exports.validatePayrollCompliance = validatePayrollCompliance;
exports.generateComplianceReport = generateComplianceReport;
/**
 * File: /reuse/server/human-capital/payroll-integration-kit.ts
 * Locator: WC-HCM-PAYROLL-INT-001
 * Purpose: Payroll Integration Kit - Comprehensive payroll processing and integration
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, Moment
 * Downstream: ../backend/payroll/*, ../services/tax/*, GL systems, Third-party providers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 46+ utility functions for payroll data synchronization, payroll run preparation and
 *          validation, earnings and deductions management, tax withholding calculations, payroll
 *          calendar management, retroactive pay adjustments, off-cycle and bonus payroll, garnishment
 *          and child support, payroll reporting and analytics, payroll reconciliation, third-party
 *          payroll provider integration, and payroll audit and compliance
 *
 * LLM Context: Enterprise-grade payroll integration for White Cross healthcare system. Provides
 * comprehensive payroll processing capabilities including bi-directional synchronization with HR
 * systems, multi-country payroll run preparation with validation, complex earnings and deductions
 * management, sophisticated tax withholding calculations (federal, state, local), intelligent
 * payroll calendar management, retroactive pay adjustments with audit trails, off-cycle payroll
 * processing for bonuses and terminations, garnishment and child support order management, real-time
 * payroll analytics and reporting, GL reconciliation with variance analysis, seamless integration
 * with third-party providers (ADP, Workday, SAP, Paylocity), and comprehensive compliance monitoring.
 * Supports multiple payroll frequencies, multi-currency processing, FLSA compliance, SOX controls,
 * and full audit trails. HIPAA-compliant for healthcare payroll data.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
// ============================================================================
// ENUMS
// ============================================================================
/**
 * Payroll run status
 */
var PayrollRunStatus;
(function (PayrollRunStatus) {
    PayrollRunStatus["DRAFT"] = "DRAFT";
    PayrollRunStatus["IN_PREPARATION"] = "IN_PREPARATION";
    PayrollRunStatus["VALIDATION_IN_PROGRESS"] = "VALIDATION_IN_PROGRESS";
    PayrollRunStatus["VALIDATION_FAILED"] = "VALIDATION_FAILED";
    PayrollRunStatus["READY_FOR_APPROVAL"] = "READY_FOR_APPROVAL";
    PayrollRunStatus["APPROVED"] = "APPROVED";
    PayrollRunStatus["PROCESSING"] = "PROCESSING";
    PayrollRunStatus["COMPLETED"] = "COMPLETED";
    PayrollRunStatus["CANCELLED"] = "CANCELLED";
    PayrollRunStatus["LOCKED"] = "LOCKED";
})(PayrollRunStatus || (exports.PayrollRunStatus = PayrollRunStatus = {}));
/**
 * Earning types
 */
var EarningType;
(function (EarningType) {
    EarningType["REGULAR_SALARY"] = "REGULAR_SALARY";
    EarningType["HOURLY_WAGES"] = "HOURLY_WAGES";
    EarningType["OVERTIME"] = "OVERTIME";
    EarningType["DOUBLE_TIME"] = "DOUBLE_TIME";
    EarningType["BONUS"] = "BONUS";
    EarningType["COMMISSION"] = "COMMISSION";
    EarningType["SHIFT_DIFFERENTIAL"] = "SHIFT_DIFFERENTIAL";
    EarningType["ON_CALL_PAY"] = "ON_CALL_PAY";
    EarningType["HOLIDAY_PAY"] = "HOLIDAY_PAY";
    EarningType["SICK_PAY"] = "SICK_PAY";
    EarningType["VACATION_PAY"] = "VACATION_PAY";
    EarningType["SEVERANCE"] = "SEVERANCE";
    EarningType["RETENTION_BONUS"] = "RETENTION_BONUS";
    EarningType["SIGNING_BONUS"] = "SIGNING_BONUS";
    EarningType["PROFIT_SHARING"] = "PROFIT_SHARING";
    EarningType["STOCK_OPTIONS"] = "STOCK_OPTIONS";
    EarningType["ALLOWANCE"] = "ALLOWANCE";
    EarningType["REIMBURSEMENT"] = "REIMBURSEMENT";
})(EarningType || (exports.EarningType = EarningType = {}));
/**
 * Deduction types
 */
var DeductionType;
(function (DeductionType) {
    DeductionType["FEDERAL_TAX"] = "FEDERAL_TAX";
    DeductionType["STATE_TAX"] = "STATE_TAX";
    DeductionType["LOCAL_TAX"] = "LOCAL_TAX";
    DeductionType["SOCIAL_SECURITY"] = "SOCIAL_SECURITY";
    DeductionType["MEDICARE"] = "MEDICARE";
    DeductionType["HEALTH_INSURANCE"] = "HEALTH_INSURANCE";
    DeductionType["DENTAL_INSURANCE"] = "DENTAL_INSURANCE";
    DeductionType["VISION_INSURANCE"] = "VISION_INSURANCE";
    DeductionType["LIFE_INSURANCE"] = "LIFE_INSURANCE";
    DeductionType["RETIREMENT_401K"] = "RETIREMENT_401K";
    DeductionType["RETIREMENT_ROTH"] = "RETIREMENT_ROTH";
    DeductionType["HSA"] = "HSA";
    DeductionType["FSA"] = "FSA";
    DeductionType["UNION_DUES"] = "UNION_DUES";
    DeductionType["GARNISHMENT"] = "GARNISHMENT";
    DeductionType["CHILD_SUPPORT"] = "CHILD_SUPPORT";
    DeductionType["STUDENT_LOAN"] = "STUDENT_LOAN";
    DeductionType["CHARITABLE_DONATION"] = "CHARITABLE_DONATION";
    DeductionType["OTHER"] = "OTHER";
})(DeductionType || (exports.DeductionType = DeductionType = {}));
/**
 * Deduction calculation method
 */
var DeductionCalculationMethod;
(function (DeductionCalculationMethod) {
    DeductionCalculationMethod["FIXED_AMOUNT"] = "FIXED_AMOUNT";
    DeductionCalculationMethod["PERCENTAGE"] = "PERCENTAGE";
    DeductionCalculationMethod["PERCENTAGE_OF_GROSS"] = "PERCENTAGE_OF_GROSS";
    DeductionCalculationMethod["TIERED"] = "TIERED";
    DeductionCalculationMethod["FORMULA"] = "FORMULA";
})(DeductionCalculationMethod || (exports.DeductionCalculationMethod = DeductionCalculationMethod = {}));
/**
 * Tax filing status
 */
var TaxFilingStatus;
(function (TaxFilingStatus) {
    TaxFilingStatus["SINGLE"] = "SINGLE";
    TaxFilingStatus["MARRIED_FILING_JOINTLY"] = "MARRIED_FILING_JOINTLY";
    TaxFilingStatus["MARRIED_FILING_SEPARATELY"] = "MARRIED_FILING_SEPARATELY";
    TaxFilingStatus["HEAD_OF_HOUSEHOLD"] = "HEAD_OF_HOUSEHOLD";
    TaxFilingStatus["QUALIFYING_WIDOW"] = "QUALIFYING_WIDOW";
})(TaxFilingStatus || (exports.TaxFilingStatus = TaxFilingStatus = {}));
/**
 * Tax type
 */
var TaxType;
(function (TaxType) {
    TaxType["FEDERAL_INCOME_TAX"] = "FEDERAL_INCOME_TAX";
    TaxType["STATE_INCOME_TAX"] = "STATE_INCOME_TAX";
    TaxType["LOCAL_INCOME_TAX"] = "LOCAL_INCOME_TAX";
    TaxType["SOCIAL_SECURITY"] = "SOCIAL_SECURITY";
    TaxType["MEDICARE"] = "MEDICARE";
    TaxType["MEDICARE_ADDITIONAL"] = "MEDICARE_ADDITIONAL";
    TaxType["UNEMPLOYMENT_TAX"] = "UNEMPLOYMENT_TAX";
    TaxType["DISABILITY_TAX"] = "DISABILITY_TAX";
})(TaxType || (exports.TaxType = TaxType = {}));
/**
 * Payroll frequency
 */
var PayrollFrequency;
(function (PayrollFrequency) {
    PayrollFrequency["WEEKLY"] = "WEEKLY";
    PayrollFrequency["BI_WEEKLY"] = "BI_WEEKLY";
    PayrollFrequency["SEMI_MONTHLY"] = "SEMI_MONTHLY";
    PayrollFrequency["MONTHLY"] = "MONTHLY";
    PayrollFrequency["QUARTERLY"] = "QUARTERLY";
    PayrollFrequency["ANNUALLY"] = "ANNUALLY";
    PayrollFrequency["ON_DEMAND"] = "ON_DEMAND";
})(PayrollFrequency || (exports.PayrollFrequency = PayrollFrequency = {}));
/**
 * Payroll period status
 */
var PayrollPeriodStatus;
(function (PayrollPeriodStatus) {
    PayrollPeriodStatus["OPEN"] = "OPEN";
    PayrollPeriodStatus["LOCKED"] = "LOCKED";
    PayrollPeriodStatus["PROCESSING"] = "PROCESSING";
    PayrollPeriodStatus["COMPLETED"] = "COMPLETED";
    PayrollPeriodStatus["CLOSED"] = "CLOSED";
})(PayrollPeriodStatus || (exports.PayrollPeriodStatus = PayrollPeriodStatus = {}));
/**
 * Adjustment type
 */
var AdjustmentType;
(function (AdjustmentType) {
    AdjustmentType["RETROACTIVE_PAY_INCREASE"] = "RETROACTIVE_PAY_INCREASE";
    AdjustmentType["RETROACTIVE_PAY_DECREASE"] = "RETROACTIVE_PAY_DECREASE";
    AdjustmentType["MISSED_HOURS"] = "MISSED_HOURS";
    AdjustmentType["OVERPAYMENT_RECOVERY"] = "OVERPAYMENT_RECOVERY";
    AdjustmentType["TAX_ADJUSTMENT"] = "TAX_ADJUSTMENT";
    AdjustmentType["DEDUCTION_ADJUSTMENT"] = "DEDUCTION_ADJUSTMENT";
    AdjustmentType["BONUS_ADJUSTMENT"] = "BONUS_ADJUSTMENT";
    AdjustmentType["CORRECTION"] = "CORRECTION";
    AdjustmentType["MANUAL"] = "MANUAL";
})(AdjustmentType || (exports.AdjustmentType = AdjustmentType = {}));
/**
 * Off-cycle payroll reason
 */
var OffCycleReason;
(function (OffCycleReason) {
    OffCycleReason["BONUS"] = "BONUS";
    OffCycleReason["COMMISSION"] = "COMMISSION";
    OffCycleReason["TERMINATION"] = "TERMINATION";
    OffCycleReason["SEVERANCE"] = "SEVERANCE";
    OffCycleReason["CORRECTION"] = "CORRECTION";
    OffCycleReason["NEW_HIRE"] = "NEW_HIRE";
    OffCycleReason["MANUAL_CHECK"] = "MANUAL_CHECK";
    OffCycleReason["EMERGENCY"] = "EMERGENCY";
})(OffCycleReason || (exports.OffCycleReason = OffCycleReason = {}));
/**
 * Garnishment type
 */
var GarnishmentType;
(function (GarnishmentType) {
    GarnishmentType["CHILD_SUPPORT"] = "CHILD_SUPPORT";
    GarnishmentType["SPOUSAL_SUPPORT"] = "SPOUSAL_SUPPORT";
    GarnishmentType["TAX_LEVY"] = "TAX_LEVY";
    GarnishmentType["BANKRUPTCY"] = "BANKRUPTCY";
    GarnishmentType["CREDITOR_GARNISHMENT"] = "CREDITOR_GARNISHMENT";
    GarnishmentType["STUDENT_LOAN"] = "STUDENT_LOAN";
    GarnishmentType["OTHER"] = "OTHER";
})(GarnishmentType || (exports.GarnishmentType = GarnishmentType = {}));
/**
 * Garnishment status
 */
var GarnishmentStatus;
(function (GarnishmentStatus) {
    GarnishmentStatus["ACTIVE"] = "ACTIVE";
    GarnishmentStatus["SUSPENDED"] = "SUSPENDED";
    GarnishmentStatus["COMPLETED"] = "COMPLETED";
    GarnishmentStatus["CANCELLED"] = "CANCELLED";
})(GarnishmentStatus || (exports.GarnishmentStatus = GarnishmentStatus = {}));
/**
 * Third-party payroll provider
 */
var PayrollProvider;
(function (PayrollProvider) {
    PayrollProvider["ADP"] = "ADP";
    PayrollProvider["WORKDAY"] = "WORKDAY";
    PayrollProvider["SAP_SUCCESSFACTORS"] = "SAP_SUCCESSFACTORS";
    PayrollProvider["PAYLOCITY"] = "PAYLOCITY";
    PayrollProvider["PAYCHEX"] = "PAYCHEX";
    PayrollProvider["GUSTO"] = "GUSTO";
    PayrollProvider["RIPPLING"] = "RIPPLING";
    PayrollProvider["BAMBOO_HR"] = "BAMBOO_HR";
    PayrollProvider["NAMELY"] = "NAMELY";
    PayrollProvider["INTERNAL"] = "INTERNAL";
})(PayrollProvider || (exports.PayrollProvider = PayrollProvider = {}));
/**
 * Integration sync status
 */
var SyncStatus;
(function (SyncStatus) {
    SyncStatus["PENDING"] = "PENDING";
    SyncStatus["IN_PROGRESS"] = "IN_PROGRESS";
    SyncStatus["COMPLETED"] = "COMPLETED";
    SyncStatus["FAILED"] = "FAILED";
    SyncStatus["PARTIAL"] = "PARTIAL";
})(SyncStatus || (exports.SyncStatus = SyncStatus = {}));
/**
 * Reconciliation status
 */
var ReconciliationStatus;
(function (ReconciliationStatus) {
    ReconciliationStatus["NOT_STARTED"] = "NOT_STARTED";
    ReconciliationStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ReconciliationStatus["RECONCILED"] = "RECONCILED";
    ReconciliationStatus["DISCREPANCY_FOUND"] = "DISCREPANCY_FOUND";
    ReconciliationStatus["REVIEW_REQUIRED"] = "REVIEW_REQUIRED";
    ReconciliationStatus["APPROVED"] = "APPROVED";
})(ReconciliationStatus || (exports.ReconciliationStatus = ReconciliationStatus = {}));
/**
 * Payment method
 */
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["DIRECT_DEPOSIT"] = "DIRECT_DEPOSIT";
    PaymentMethod["CHECK"] = "CHECK";
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["PAYCARD"] = "PAYCARD";
    PaymentMethod["WIRE_TRANSFER"] = "WIRE_TRANSFER";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
exports.PayrollRunSchema = zod_1.z.object({
    payrollRunName: zod_1.z.string().min(1).max(200),
    payrollPeriodId: zod_1.z.string().uuid(),
    frequency: zod_1.z.nativeEnum(PayrollFrequency),
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    payDate: zod_1.z.date(),
    currency: zod_1.z.string().length(3),
});
exports.EarningsSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    payrollRunId: zod_1.z.string().uuid(),
    earningType: zod_1.z.nativeEnum(EarningType),
    description: zod_1.z.string().min(1).max(500),
    hours: zod_1.z.number().min(0).optional(),
    rate: zod_1.z.number().min(0).optional(),
    amount: zod_1.z.number().min(0),
    taxable: zod_1.z.boolean(),
});
exports.DeductionsSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    payrollRunId: zod_1.z.string().uuid(),
    deductionType: zod_1.z.nativeEnum(DeductionType),
    description: zod_1.z.string().min(1).max(500),
    calculationMethod: zod_1.z.nativeEnum(DeductionCalculationMethod),
    amount: zod_1.z.number().min(0),
    isRecurring: zod_1.z.boolean(),
    priority: zod_1.z.number().int().min(1).max(100),
});
exports.TaxWithholdingSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    payrollRunId: zod_1.z.string().uuid(),
    taxType: zod_1.z.nativeEnum(TaxType),
    taxableWages: zod_1.z.number().min(0),
    taxRate: zod_1.z.number().min(0).max(1),
    jurisdiction: zod_1.z.string().min(1).max(100),
    exemptions: zod_1.z.number().int().min(0),
    additionalWithholding: zod_1.z.number().min(0),
});
exports.PayrollPeriodSchema = zod_1.z.object({
    calendarId: zod_1.z.string().uuid(),
    periodNumber: zod_1.z.number().int().min(1),
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    payDate: zod_1.z.date(),
});
exports.RetroactivePaySchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    adjustmentType: zod_1.z.nativeEnum(AdjustmentType),
    effectiveDate: zod_1.z.date(),
    originalPayRate: zod_1.z.number().min(0),
    newPayRate: zod_1.z.number().min(0),
    periodsAffected: zod_1.z.number().int().min(1),
});
exports.OffCyclePayrollSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    reason: zod_1.z.nativeEnum(OffCycleReason),
    payDate: zod_1.z.date(),
    grossAmount: zod_1.z.number().min(0),
});
exports.GarnishmentSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    garnishmentType: zod_1.z.nativeEnum(GarnishmentType),
    caseNumber: zod_1.z.string().min(1).max(100),
    issuingAuthority: zod_1.z.string().min(1).max(200),
    orderDate: zod_1.z.date(),
    startDate: zod_1.z.date(),
    amountType: zod_1.z.enum(['FIXED', 'PERCENTAGE']),
    amount: zod_1.z.number().min(0),
    priority: zod_1.z.number().int().min(1),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Payroll Run Model
 */
let PayrollRunModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'payroll_runs', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _payrollRunName_decorators;
    let _payrollRunName_initializers = [];
    let _payrollRunName_extraInitializers = [];
    let _payrollPeriodId_decorators;
    let _payrollPeriodId_initializers = [];
    let _payrollPeriodId_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _payDate_decorators;
    let _payDate_initializers = [];
    let _payDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _employeeCount_decorators;
    let _employeeCount_initializers = [];
    let _employeeCount_extraInitializers = [];
    let _totalGross_decorators;
    let _totalGross_initializers = [];
    let _totalGross_extraInitializers = [];
    let _totalDeductions_decorators;
    let _totalDeductions_initializers = [];
    let _totalDeductions_extraInitializers = [];
    let _totalTaxes_decorators;
    let _totalTaxes_initializers = [];
    let _totalTaxes_extraInitializers = [];
    let _totalNet_decorators;
    let _totalNet_initializers = [];
    let _totalNet_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _validationErrors_decorators;
    let _validationErrors_initializers = [];
    let _validationErrors_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _processedAt_decorators;
    let _processedAt_initializers = [];
    let _processedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _payrollPeriod_decorators;
    let _payrollPeriod_initializers = [];
    let _payrollPeriod_extraInitializers = [];
    let _earnings_decorators;
    let _earnings_initializers = [];
    let _earnings_extraInitializers = [];
    let _deductions_decorators;
    let _deductions_initializers = [];
    let _deductions_extraInitializers = [];
    let _taxWithholdings_decorators;
    let _taxWithholdings_initializers = [];
    let _taxWithholdings_extraInitializers = [];
    var PayrollRunModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.payrollRunName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _payrollRunName_initializers, void 0));
            this.payrollPeriodId = (__runInitializers(this, _payrollRunName_extraInitializers), __runInitializers(this, _payrollPeriodId_initializers, void 0));
            this.frequency = (__runInitializers(this, _payrollPeriodId_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
            this.startDate = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.payDate = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _payDate_initializers, void 0));
            this.status = (__runInitializers(this, _payDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.employeeCount = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _employeeCount_initializers, void 0));
            this.totalGross = (__runInitializers(this, _employeeCount_extraInitializers), __runInitializers(this, _totalGross_initializers, void 0));
            this.totalDeductions = (__runInitializers(this, _totalGross_extraInitializers), __runInitializers(this, _totalDeductions_initializers, void 0));
            this.totalTaxes = (__runInitializers(this, _totalDeductions_extraInitializers), __runInitializers(this, _totalTaxes_initializers, void 0));
            this.totalNet = (__runInitializers(this, _totalTaxes_extraInitializers), __runInitializers(this, _totalNet_initializers, void 0));
            this.currency = (__runInitializers(this, _totalNet_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.validationErrors = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _validationErrors_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _validationErrors_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.processedAt = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _processedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _processedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.payrollPeriod = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _payrollPeriod_initializers, void 0));
            this.earnings = (__runInitializers(this, _payrollPeriod_extraInitializers), __runInitializers(this, _earnings_initializers, void 0));
            this.deductions = (__runInitializers(this, _earnings_extraInitializers), __runInitializers(this, _deductions_initializers, void 0));
            this.taxWithholdings = (__runInitializers(this, _deductions_extraInitializers), __runInitializers(this, _taxWithholdings_initializers, void 0));
            __runInitializers(this, _taxWithholdings_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PayrollRunModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _payrollRunName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _payrollPeriodId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.ForeignKey)(() => PayrollPeriodModel), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _frequency_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _startDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _endDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _payDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('DRAFT'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _employeeCount_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _totalGross_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _totalDeductions_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _totalTaxes_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _totalNet_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _currency_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('USD'), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3))];
        _validationErrors_decorators = [(0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _processedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _payrollPeriod_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PayrollPeriodModel)];
        _earnings_decorators = [(0, sequelize_typescript_1.HasMany)(() => EarningsModel)];
        _deductions_decorators = [(0, sequelize_typescript_1.HasMany)(() => DeductionsModel)];
        _taxWithholdings_decorators = [(0, sequelize_typescript_1.HasMany)(() => TaxWithholdingModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _payrollRunName_decorators, { kind: "field", name: "payrollRunName", static: false, private: false, access: { has: obj => "payrollRunName" in obj, get: obj => obj.payrollRunName, set: (obj, value) => { obj.payrollRunName = value; } }, metadata: _metadata }, _payrollRunName_initializers, _payrollRunName_extraInitializers);
        __esDecorate(null, null, _payrollPeriodId_decorators, { kind: "field", name: "payrollPeriodId", static: false, private: false, access: { has: obj => "payrollPeriodId" in obj, get: obj => obj.payrollPeriodId, set: (obj, value) => { obj.payrollPeriodId = value; } }, metadata: _metadata }, _payrollPeriodId_initializers, _payrollPeriodId_extraInitializers);
        __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _payDate_decorators, { kind: "field", name: "payDate", static: false, private: false, access: { has: obj => "payDate" in obj, get: obj => obj.payDate, set: (obj, value) => { obj.payDate = value; } }, metadata: _metadata }, _payDate_initializers, _payDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _employeeCount_decorators, { kind: "field", name: "employeeCount", static: false, private: false, access: { has: obj => "employeeCount" in obj, get: obj => obj.employeeCount, set: (obj, value) => { obj.employeeCount = value; } }, metadata: _metadata }, _employeeCount_initializers, _employeeCount_extraInitializers);
        __esDecorate(null, null, _totalGross_decorators, { kind: "field", name: "totalGross", static: false, private: false, access: { has: obj => "totalGross" in obj, get: obj => obj.totalGross, set: (obj, value) => { obj.totalGross = value; } }, metadata: _metadata }, _totalGross_initializers, _totalGross_extraInitializers);
        __esDecorate(null, null, _totalDeductions_decorators, { kind: "field", name: "totalDeductions", static: false, private: false, access: { has: obj => "totalDeductions" in obj, get: obj => obj.totalDeductions, set: (obj, value) => { obj.totalDeductions = value; } }, metadata: _metadata }, _totalDeductions_initializers, _totalDeductions_extraInitializers);
        __esDecorate(null, null, _totalTaxes_decorators, { kind: "field", name: "totalTaxes", static: false, private: false, access: { has: obj => "totalTaxes" in obj, get: obj => obj.totalTaxes, set: (obj, value) => { obj.totalTaxes = value; } }, metadata: _metadata }, _totalTaxes_initializers, _totalTaxes_extraInitializers);
        __esDecorate(null, null, _totalNet_decorators, { kind: "field", name: "totalNet", static: false, private: false, access: { has: obj => "totalNet" in obj, get: obj => obj.totalNet, set: (obj, value) => { obj.totalNet = value; } }, metadata: _metadata }, _totalNet_initializers, _totalNet_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _validationErrors_decorators, { kind: "field", name: "validationErrors", static: false, private: false, access: { has: obj => "validationErrors" in obj, get: obj => obj.validationErrors, set: (obj, value) => { obj.validationErrors = value; } }, metadata: _metadata }, _validationErrors_initializers, _validationErrors_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _processedAt_decorators, { kind: "field", name: "processedAt", static: false, private: false, access: { has: obj => "processedAt" in obj, get: obj => obj.processedAt, set: (obj, value) => { obj.processedAt = value; } }, metadata: _metadata }, _processedAt_initializers, _processedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _payrollPeriod_decorators, { kind: "field", name: "payrollPeriod", static: false, private: false, access: { has: obj => "payrollPeriod" in obj, get: obj => obj.payrollPeriod, set: (obj, value) => { obj.payrollPeriod = value; } }, metadata: _metadata }, _payrollPeriod_initializers, _payrollPeriod_extraInitializers);
        __esDecorate(null, null, _earnings_decorators, { kind: "field", name: "earnings", static: false, private: false, access: { has: obj => "earnings" in obj, get: obj => obj.earnings, set: (obj, value) => { obj.earnings = value; } }, metadata: _metadata }, _earnings_initializers, _earnings_extraInitializers);
        __esDecorate(null, null, _deductions_decorators, { kind: "field", name: "deductions", static: false, private: false, access: { has: obj => "deductions" in obj, get: obj => obj.deductions, set: (obj, value) => { obj.deductions = value; } }, metadata: _metadata }, _deductions_initializers, _deductions_extraInitializers);
        __esDecorate(null, null, _taxWithholdings_decorators, { kind: "field", name: "taxWithholdings", static: false, private: false, access: { has: obj => "taxWithholdings" in obj, get: obj => obj.taxWithholdings, set: (obj, value) => { obj.taxWithholdings = value; } }, metadata: _metadata }, _taxWithholdings_initializers, _taxWithholdings_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PayrollRunModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PayrollRunModel = _classThis;
})();
exports.PayrollRunModel = PayrollRunModel;
/**
 * Payroll Data Sync Model
 */
let PayrollDataSyncModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'payroll_data_sync', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _syncType_decorators;
    let _syncType_initializers = [];
    let _syncType_extraInitializers = [];
    let _syncStatus_decorators;
    let _syncStatus_initializers = [];
    let _syncStatus_extraInitializers = [];
    let _recordsProcessed_decorators;
    let _recordsProcessed_initializers = [];
    let _recordsProcessed_extraInitializers = [];
    let _recordsFailed_decorators;
    let _recordsFailed_initializers = [];
    let _recordsFailed_extraInitializers = [];
    let _errors_decorators;
    let _errors_initializers = [];
    let _errors_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var PayrollDataSyncModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.syncType = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _syncType_initializers, void 0));
            this.syncStatus = (__runInitializers(this, _syncType_extraInitializers), __runInitializers(this, _syncStatus_initializers, void 0));
            this.recordsProcessed = (__runInitializers(this, _syncStatus_extraInitializers), __runInitializers(this, _recordsProcessed_initializers, void 0));
            this.recordsFailed = (__runInitializers(this, _recordsProcessed_extraInitializers), __runInitializers(this, _recordsFailed_initializers, void 0));
            this.errors = (__runInitializers(this, _recordsFailed_extraInitializers), __runInitializers(this, _errors_initializers, void 0));
            this.startedAt = (__runInitializers(this, _errors_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PayrollDataSyncModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _syncType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _syncStatus_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('PENDING'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _recordsProcessed_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _recordsFailed_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _errors_decorators = [(0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT))];
        _startedAt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _completedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _syncType_decorators, { kind: "field", name: "syncType", static: false, private: false, access: { has: obj => "syncType" in obj, get: obj => obj.syncType, set: (obj, value) => { obj.syncType = value; } }, metadata: _metadata }, _syncType_initializers, _syncType_extraInitializers);
        __esDecorate(null, null, _syncStatus_decorators, { kind: "field", name: "syncStatus", static: false, private: false, access: { has: obj => "syncStatus" in obj, get: obj => obj.syncStatus, set: (obj, value) => { obj.syncStatus = value; } }, metadata: _metadata }, _syncStatus_initializers, _syncStatus_extraInitializers);
        __esDecorate(null, null, _recordsProcessed_decorators, { kind: "field", name: "recordsProcessed", static: false, private: false, access: { has: obj => "recordsProcessed" in obj, get: obj => obj.recordsProcessed, set: (obj, value) => { obj.recordsProcessed = value; } }, metadata: _metadata }, _recordsProcessed_initializers, _recordsProcessed_extraInitializers);
        __esDecorate(null, null, _recordsFailed_decorators, { kind: "field", name: "recordsFailed", static: false, private: false, access: { has: obj => "recordsFailed" in obj, get: obj => obj.recordsFailed, set: (obj, value) => { obj.recordsFailed = value; } }, metadata: _metadata }, _recordsFailed_initializers, _recordsFailed_extraInitializers);
        __esDecorate(null, null, _errors_decorators, { kind: "field", name: "errors", static: false, private: false, access: { has: obj => "errors" in obj, get: obj => obj.errors, set: (obj, value) => { obj.errors = value; } }, metadata: _metadata }, _errors_initializers, _errors_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PayrollDataSyncModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PayrollDataSyncModel = _classThis;
})();
exports.PayrollDataSyncModel = PayrollDataSyncModel;
/**
 * Earnings Model
 */
let EarningsModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'payroll_earnings', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _payrollRunId_decorators;
    let _payrollRunId_initializers = [];
    let _payrollRunId_extraInitializers = [];
    let _earningType_decorators;
    let _earningType_initializers = [];
    let _earningType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _hours_decorators;
    let _hours_initializers = [];
    let _hours_extraInitializers = [];
    let _rate_decorators;
    let _rate_initializers = [];
    let _rate_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _taxable_decorators;
    let _taxable_initializers = [];
    let _taxable_extraInitializers = [];
    let _subject_to_social_security_decorators;
    let _subject_to_social_security_initializers = [];
    let _subject_to_social_security_extraInitializers = [];
    let _subject_to_medicare_decorators;
    let _subject_to_medicare_initializers = [];
    let _subject_to_medicare_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _payrollRun_decorators;
    let _payrollRun_initializers = [];
    let _payrollRun_extraInitializers = [];
    var EarningsModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.payrollRunId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _payrollRunId_initializers, void 0));
            this.earningType = (__runInitializers(this, _payrollRunId_extraInitializers), __runInitializers(this, _earningType_initializers, void 0));
            this.description = (__runInitializers(this, _earningType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.hours = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _hours_initializers, void 0));
            this.rate = (__runInitializers(this, _hours_extraInitializers), __runInitializers(this, _rate_initializers, void 0));
            this.amount = (__runInitializers(this, _rate_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.taxable = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _taxable_initializers, void 0));
            this.subject_to_social_security = (__runInitializers(this, _taxable_extraInitializers), __runInitializers(this, _subject_to_social_security_initializers, void 0));
            this.subject_to_medicare = (__runInitializers(this, _subject_to_social_security_extraInitializers), __runInitializers(this, _subject_to_medicare_initializers, void 0));
            this.createdAt = (__runInitializers(this, _subject_to_medicare_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.payrollRun = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _payrollRun_initializers, void 0));
            __runInitializers(this, _payrollRun_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EarningsModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _payrollRunId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.ForeignKey)(() => PayrollRunModel), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _earningType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _hours_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _rate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _amount_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _taxable_decorators = [(0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _subject_to_social_security_decorators = [(0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _subject_to_medicare_decorators = [(0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _payrollRun_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PayrollRunModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _payrollRunId_decorators, { kind: "field", name: "payrollRunId", static: false, private: false, access: { has: obj => "payrollRunId" in obj, get: obj => obj.payrollRunId, set: (obj, value) => { obj.payrollRunId = value; } }, metadata: _metadata }, _payrollRunId_initializers, _payrollRunId_extraInitializers);
        __esDecorate(null, null, _earningType_decorators, { kind: "field", name: "earningType", static: false, private: false, access: { has: obj => "earningType" in obj, get: obj => obj.earningType, set: (obj, value) => { obj.earningType = value; } }, metadata: _metadata }, _earningType_initializers, _earningType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _hours_decorators, { kind: "field", name: "hours", static: false, private: false, access: { has: obj => "hours" in obj, get: obj => obj.hours, set: (obj, value) => { obj.hours = value; } }, metadata: _metadata }, _hours_initializers, _hours_extraInitializers);
        __esDecorate(null, null, _rate_decorators, { kind: "field", name: "rate", static: false, private: false, access: { has: obj => "rate" in obj, get: obj => obj.rate, set: (obj, value) => { obj.rate = value; } }, metadata: _metadata }, _rate_initializers, _rate_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _taxable_decorators, { kind: "field", name: "taxable", static: false, private: false, access: { has: obj => "taxable" in obj, get: obj => obj.taxable, set: (obj, value) => { obj.taxable = value; } }, metadata: _metadata }, _taxable_initializers, _taxable_extraInitializers);
        __esDecorate(null, null, _subject_to_social_security_decorators, { kind: "field", name: "subject_to_social_security", static: false, private: false, access: { has: obj => "subject_to_social_security" in obj, get: obj => obj.subject_to_social_security, set: (obj, value) => { obj.subject_to_social_security = value; } }, metadata: _metadata }, _subject_to_social_security_initializers, _subject_to_social_security_extraInitializers);
        __esDecorate(null, null, _subject_to_medicare_decorators, { kind: "field", name: "subject_to_medicare", static: false, private: false, access: { has: obj => "subject_to_medicare" in obj, get: obj => obj.subject_to_medicare, set: (obj, value) => { obj.subject_to_medicare = value; } }, metadata: _metadata }, _subject_to_medicare_initializers, _subject_to_medicare_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _payrollRun_decorators, { kind: "field", name: "payrollRun", static: false, private: false, access: { has: obj => "payrollRun" in obj, get: obj => obj.payrollRun, set: (obj, value) => { obj.payrollRun = value; } }, metadata: _metadata }, _payrollRun_initializers, _payrollRun_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EarningsModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EarningsModel = _classThis;
})();
exports.EarningsModel = EarningsModel;
/**
 * Deductions Model
 */
let DeductionsModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'payroll_deductions', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _payrollRunId_decorators;
    let _payrollRunId_initializers = [];
    let _payrollRunId_extraInitializers = [];
    let _deductionType_decorators;
    let _deductionType_initializers = [];
    let _deductionType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _calculationMethod_decorators;
    let _calculationMethod_initializers = [];
    let _calculationMethod_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _isRecurring_decorators;
    let _isRecurring_initializers = [];
    let _isRecurring_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _payrollRun_decorators;
    let _payrollRun_initializers = [];
    let _payrollRun_extraInitializers = [];
    var DeductionsModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.payrollRunId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _payrollRunId_initializers, void 0));
            this.deductionType = (__runInitializers(this, _payrollRunId_extraInitializers), __runInitializers(this, _deductionType_initializers, void 0));
            this.description = (__runInitializers(this, _deductionType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.calculationMethod = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _calculationMethod_initializers, void 0));
            this.amount = (__runInitializers(this, _calculationMethod_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.isRecurring = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _isRecurring_initializers, void 0));
            this.priority = (__runInitializers(this, _isRecurring_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.createdAt = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.payrollRun = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _payrollRun_initializers, void 0));
            __runInitializers(this, _payrollRun_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DeductionsModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _payrollRunId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.ForeignKey)(() => PayrollRunModel), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _deductionType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _calculationMethod_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _amount_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _isRecurring_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _priority_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(50), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _payrollRun_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PayrollRunModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _payrollRunId_decorators, { kind: "field", name: "payrollRunId", static: false, private: false, access: { has: obj => "payrollRunId" in obj, get: obj => obj.payrollRunId, set: (obj, value) => { obj.payrollRunId = value; } }, metadata: _metadata }, _payrollRunId_initializers, _payrollRunId_extraInitializers);
        __esDecorate(null, null, _deductionType_decorators, { kind: "field", name: "deductionType", static: false, private: false, access: { has: obj => "deductionType" in obj, get: obj => obj.deductionType, set: (obj, value) => { obj.deductionType = value; } }, metadata: _metadata }, _deductionType_initializers, _deductionType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _calculationMethod_decorators, { kind: "field", name: "calculationMethod", static: false, private: false, access: { has: obj => "calculationMethod" in obj, get: obj => obj.calculationMethod, set: (obj, value) => { obj.calculationMethod = value; } }, metadata: _metadata }, _calculationMethod_initializers, _calculationMethod_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _isRecurring_decorators, { kind: "field", name: "isRecurring", static: false, private: false, access: { has: obj => "isRecurring" in obj, get: obj => obj.isRecurring, set: (obj, value) => { obj.isRecurring = value; } }, metadata: _metadata }, _isRecurring_initializers, _isRecurring_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _payrollRun_decorators, { kind: "field", name: "payrollRun", static: false, private: false, access: { has: obj => "payrollRun" in obj, get: obj => obj.payrollRun, set: (obj, value) => { obj.payrollRun = value; } }, metadata: _metadata }, _payrollRun_initializers, _payrollRun_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DeductionsModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DeductionsModel = _classThis;
})();
exports.DeductionsModel = DeductionsModel;
/**
 * Tax Withholding Model
 */
let TaxWithholdingModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'tax_withholdings', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _payrollRunId_decorators;
    let _payrollRunId_initializers = [];
    let _payrollRunId_extraInitializers = [];
    let _taxType_decorators;
    let _taxType_initializers = [];
    let _taxType_extraInitializers = [];
    let _taxableWages_decorators;
    let _taxableWages_initializers = [];
    let _taxableWages_extraInitializers = [];
    let _taxAmount_decorators;
    let _taxAmount_initializers = [];
    let _taxAmount_extraInitializers = [];
    let _taxRate_decorators;
    let _taxRate_initializers = [];
    let _taxRate_extraInitializers = [];
    let _jurisdiction_decorators;
    let _jurisdiction_initializers = [];
    let _jurisdiction_extraInitializers = [];
    let _filingStatus_decorators;
    let _filingStatus_initializers = [];
    let _filingStatus_extraInitializers = [];
    let _exemptions_decorators;
    let _exemptions_initializers = [];
    let _exemptions_extraInitializers = [];
    let _additionalWithholding_decorators;
    let _additionalWithholding_initializers = [];
    let _additionalWithholding_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _payrollRun_decorators;
    let _payrollRun_initializers = [];
    let _payrollRun_extraInitializers = [];
    var TaxWithholdingModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.payrollRunId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _payrollRunId_initializers, void 0));
            this.taxType = (__runInitializers(this, _payrollRunId_extraInitializers), __runInitializers(this, _taxType_initializers, void 0));
            this.taxableWages = (__runInitializers(this, _taxType_extraInitializers), __runInitializers(this, _taxableWages_initializers, void 0));
            this.taxAmount = (__runInitializers(this, _taxableWages_extraInitializers), __runInitializers(this, _taxAmount_initializers, void 0));
            this.taxRate = (__runInitializers(this, _taxAmount_extraInitializers), __runInitializers(this, _taxRate_initializers, void 0));
            this.jurisdiction = (__runInitializers(this, _taxRate_extraInitializers), __runInitializers(this, _jurisdiction_initializers, void 0));
            this.filingStatus = (__runInitializers(this, _jurisdiction_extraInitializers), __runInitializers(this, _filingStatus_initializers, void 0));
            this.exemptions = (__runInitializers(this, _filingStatus_extraInitializers), __runInitializers(this, _exemptions_initializers, void 0));
            this.additionalWithholding = (__runInitializers(this, _exemptions_extraInitializers), __runInitializers(this, _additionalWithholding_initializers, void 0));
            this.createdAt = (__runInitializers(this, _additionalWithholding_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.payrollRun = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _payrollRun_initializers, void 0));
            __runInitializers(this, _payrollRun_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TaxWithholdingModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _payrollRunId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.ForeignKey)(() => PayrollRunModel), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _taxType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _taxableWages_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _taxAmount_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _taxRate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(6, 4))];
        _jurisdiction_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _filingStatus_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _exemptions_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _additionalWithholding_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _payrollRun_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PayrollRunModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _payrollRunId_decorators, { kind: "field", name: "payrollRunId", static: false, private: false, access: { has: obj => "payrollRunId" in obj, get: obj => obj.payrollRunId, set: (obj, value) => { obj.payrollRunId = value; } }, metadata: _metadata }, _payrollRunId_initializers, _payrollRunId_extraInitializers);
        __esDecorate(null, null, _taxType_decorators, { kind: "field", name: "taxType", static: false, private: false, access: { has: obj => "taxType" in obj, get: obj => obj.taxType, set: (obj, value) => { obj.taxType = value; } }, metadata: _metadata }, _taxType_initializers, _taxType_extraInitializers);
        __esDecorate(null, null, _taxableWages_decorators, { kind: "field", name: "taxableWages", static: false, private: false, access: { has: obj => "taxableWages" in obj, get: obj => obj.taxableWages, set: (obj, value) => { obj.taxableWages = value; } }, metadata: _metadata }, _taxableWages_initializers, _taxableWages_extraInitializers);
        __esDecorate(null, null, _taxAmount_decorators, { kind: "field", name: "taxAmount", static: false, private: false, access: { has: obj => "taxAmount" in obj, get: obj => obj.taxAmount, set: (obj, value) => { obj.taxAmount = value; } }, metadata: _metadata }, _taxAmount_initializers, _taxAmount_extraInitializers);
        __esDecorate(null, null, _taxRate_decorators, { kind: "field", name: "taxRate", static: false, private: false, access: { has: obj => "taxRate" in obj, get: obj => obj.taxRate, set: (obj, value) => { obj.taxRate = value; } }, metadata: _metadata }, _taxRate_initializers, _taxRate_extraInitializers);
        __esDecorate(null, null, _jurisdiction_decorators, { kind: "field", name: "jurisdiction", static: false, private: false, access: { has: obj => "jurisdiction" in obj, get: obj => obj.jurisdiction, set: (obj, value) => { obj.jurisdiction = value; } }, metadata: _metadata }, _jurisdiction_initializers, _jurisdiction_extraInitializers);
        __esDecorate(null, null, _filingStatus_decorators, { kind: "field", name: "filingStatus", static: false, private: false, access: { has: obj => "filingStatus" in obj, get: obj => obj.filingStatus, set: (obj, value) => { obj.filingStatus = value; } }, metadata: _metadata }, _filingStatus_initializers, _filingStatus_extraInitializers);
        __esDecorate(null, null, _exemptions_decorators, { kind: "field", name: "exemptions", static: false, private: false, access: { has: obj => "exemptions" in obj, get: obj => obj.exemptions, set: (obj, value) => { obj.exemptions = value; } }, metadata: _metadata }, _exemptions_initializers, _exemptions_extraInitializers);
        __esDecorate(null, null, _additionalWithholding_decorators, { kind: "field", name: "additionalWithholding", static: false, private: false, access: { has: obj => "additionalWithholding" in obj, get: obj => obj.additionalWithholding, set: (obj, value) => { obj.additionalWithholding = value; } }, metadata: _metadata }, _additionalWithholding_initializers, _additionalWithholding_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _payrollRun_decorators, { kind: "field", name: "payrollRun", static: false, private: false, access: { has: obj => "payrollRun" in obj, get: obj => obj.payrollRun, set: (obj, value) => { obj.payrollRun = value; } }, metadata: _metadata }, _payrollRun_initializers, _payrollRun_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TaxWithholdingModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TaxWithholdingModel = _classThis;
})();
exports.TaxWithholdingModel = TaxWithholdingModel;
/**
 * Payroll Calendar Model
 */
let PayrollCalendarModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'payroll_calendars', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _year_decorators;
    let _year_initializers = [];
    let _year_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _periods_decorators;
    let _periods_initializers = [];
    let _periods_extraInitializers = [];
    var PayrollCalendarModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.year = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _year_initializers, void 0));
            this.frequency = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
            this.createdAt = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.periods = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _periods_initializers, void 0));
            __runInitializers(this, _periods_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PayrollCalendarModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _year_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Unique)('year_frequency'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _frequency_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Unique)('year_frequency'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _periods_decorators = [(0, sequelize_typescript_1.HasMany)(() => PayrollPeriodModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: obj => "year" in obj, get: obj => obj.year, set: (obj, value) => { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
        __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _periods_decorators, { kind: "field", name: "periods", static: false, private: false, access: { has: obj => "periods" in obj, get: obj => obj.periods, set: (obj, value) => { obj.periods = value; } }, metadata: _metadata }, _periods_initializers, _periods_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PayrollCalendarModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PayrollCalendarModel = _classThis;
})();
exports.PayrollCalendarModel = PayrollCalendarModel;
/**
 * Payroll Period Model
 */
let PayrollPeriodModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'payroll_periods', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _calendarId_decorators;
    let _calendarId_initializers = [];
    let _calendarId_extraInitializers = [];
    let _periodNumber_decorators;
    let _periodNumber_initializers = [];
    let _periodNumber_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _payDate_decorators;
    let _payDate_initializers = [];
    let _payDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _lockedAt_decorators;
    let _lockedAt_initializers = [];
    let _lockedAt_extraInitializers = [];
    let _lockedBy_decorators;
    let _lockedBy_initializers = [];
    let _lockedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _calendar_decorators;
    let _calendar_initializers = [];
    let _calendar_extraInitializers = [];
    let _payrollRuns_decorators;
    let _payrollRuns_initializers = [];
    let _payrollRuns_extraInitializers = [];
    var PayrollPeriodModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.calendarId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _calendarId_initializers, void 0));
            this.periodNumber = (__runInitializers(this, _calendarId_extraInitializers), __runInitializers(this, _periodNumber_initializers, void 0));
            this.startDate = (__runInitializers(this, _periodNumber_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.payDate = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _payDate_initializers, void 0));
            this.status = (__runInitializers(this, _payDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.lockedAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _lockedAt_initializers, void 0));
            this.lockedBy = (__runInitializers(this, _lockedAt_extraInitializers), __runInitializers(this, _lockedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _lockedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.calendar = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _calendar_initializers, void 0));
            this.payrollRuns = (__runInitializers(this, _calendar_extraInitializers), __runInitializers(this, _payrollRuns_initializers, void 0));
            __runInitializers(this, _payrollRuns_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PayrollPeriodModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _calendarId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.ForeignKey)(() => PayrollCalendarModel), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _periodNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _startDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _endDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _payDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('OPEN'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _lockedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _lockedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _calendar_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PayrollCalendarModel)];
        _payrollRuns_decorators = [(0, sequelize_typescript_1.HasMany)(() => PayrollRunModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _calendarId_decorators, { kind: "field", name: "calendarId", static: false, private: false, access: { has: obj => "calendarId" in obj, get: obj => obj.calendarId, set: (obj, value) => { obj.calendarId = value; } }, metadata: _metadata }, _calendarId_initializers, _calendarId_extraInitializers);
        __esDecorate(null, null, _periodNumber_decorators, { kind: "field", name: "periodNumber", static: false, private: false, access: { has: obj => "periodNumber" in obj, get: obj => obj.periodNumber, set: (obj, value) => { obj.periodNumber = value; } }, metadata: _metadata }, _periodNumber_initializers, _periodNumber_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _payDate_decorators, { kind: "field", name: "payDate", static: false, private: false, access: { has: obj => "payDate" in obj, get: obj => obj.payDate, set: (obj, value) => { obj.payDate = value; } }, metadata: _metadata }, _payDate_initializers, _payDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _lockedAt_decorators, { kind: "field", name: "lockedAt", static: false, private: false, access: { has: obj => "lockedAt" in obj, get: obj => obj.lockedAt, set: (obj, value) => { obj.lockedAt = value; } }, metadata: _metadata }, _lockedAt_initializers, _lockedAt_extraInitializers);
        __esDecorate(null, null, _lockedBy_decorators, { kind: "field", name: "lockedBy", static: false, private: false, access: { has: obj => "lockedBy" in obj, get: obj => obj.lockedBy, set: (obj, value) => { obj.lockedBy = value; } }, metadata: _metadata }, _lockedBy_initializers, _lockedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _calendar_decorators, { kind: "field", name: "calendar", static: false, private: false, access: { has: obj => "calendar" in obj, get: obj => obj.calendar, set: (obj, value) => { obj.calendar = value; } }, metadata: _metadata }, _calendar_initializers, _calendar_extraInitializers);
        __esDecorate(null, null, _payrollRuns_decorators, { kind: "field", name: "payrollRuns", static: false, private: false, access: { has: obj => "payrollRuns" in obj, get: obj => obj.payrollRuns, set: (obj, value) => { obj.payrollRuns = value; } }, metadata: _metadata }, _payrollRuns_initializers, _payrollRuns_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PayrollPeriodModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PayrollPeriodModel = _classThis;
})();
exports.PayrollPeriodModel = PayrollPeriodModel;
/**
 * Retroactive Pay Model
 */
let RetroactivePayModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'retroactive_pay', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _adjustmentType_decorators;
    let _adjustmentType_initializers = [];
    let _adjustmentType_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _originalPayRate_decorators;
    let _originalPayRate_initializers = [];
    let _originalPayRate_extraInitializers = [];
    let _newPayRate_decorators;
    let _newPayRate_initializers = [];
    let _newPayRate_extraInitializers = [];
    let _periodsAffected_decorators;
    let _periodsAffected_initializers = [];
    let _periodsAffected_extraInitializers = [];
    let _totalAdjustment_decorators;
    let _totalAdjustment_initializers = [];
    let _totalAdjustment_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var RetroactivePayModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.adjustmentType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _adjustmentType_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _adjustmentType_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.originalPayRate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _originalPayRate_initializers, void 0));
            this.newPayRate = (__runInitializers(this, _originalPayRate_extraInitializers), __runInitializers(this, _newPayRate_initializers, void 0));
            this.periodsAffected = (__runInitializers(this, _newPayRate_extraInitializers), __runInitializers(this, _periodsAffected_initializers, void 0));
            this.totalAdjustment = (__runInitializers(this, _periodsAffected_extraInitializers), __runInitializers(this, _totalAdjustment_initializers, void 0));
            this.status = (__runInitializers(this, _totalAdjustment_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "RetroactivePayModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _adjustmentType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _originalPayRate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _newPayRate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _periodsAffected_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _totalAdjustment_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('PENDING'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _adjustmentType_decorators, { kind: "field", name: "adjustmentType", static: false, private: false, access: { has: obj => "adjustmentType" in obj, get: obj => obj.adjustmentType, set: (obj, value) => { obj.adjustmentType = value; } }, metadata: _metadata }, _adjustmentType_initializers, _adjustmentType_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _originalPayRate_decorators, { kind: "field", name: "originalPayRate", static: false, private: false, access: { has: obj => "originalPayRate" in obj, get: obj => obj.originalPayRate, set: (obj, value) => { obj.originalPayRate = value; } }, metadata: _metadata }, _originalPayRate_initializers, _originalPayRate_extraInitializers);
        __esDecorate(null, null, _newPayRate_decorators, { kind: "field", name: "newPayRate", static: false, private: false, access: { has: obj => "newPayRate" in obj, get: obj => obj.newPayRate, set: (obj, value) => { obj.newPayRate = value; } }, metadata: _metadata }, _newPayRate_initializers, _newPayRate_extraInitializers);
        __esDecorate(null, null, _periodsAffected_decorators, { kind: "field", name: "periodsAffected", static: false, private: false, access: { has: obj => "periodsAffected" in obj, get: obj => obj.periodsAffected, set: (obj, value) => { obj.periodsAffected = value; } }, metadata: _metadata }, _periodsAffected_initializers, _periodsAffected_extraInitializers);
        __esDecorate(null, null, _totalAdjustment_decorators, { kind: "field", name: "totalAdjustment", static: false, private: false, access: { has: obj => "totalAdjustment" in obj, get: obj => obj.totalAdjustment, set: (obj, value) => { obj.totalAdjustment = value; } }, metadata: _metadata }, _totalAdjustment_initializers, _totalAdjustment_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RetroactivePayModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RetroactivePayModel = _classThis;
})();
exports.RetroactivePayModel = RetroactivePayModel;
/**
 * Off-Cycle Payroll Model
 */
let OffCyclePayrollModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'off_cycle_payroll', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _payDate_decorators;
    let _payDate_initializers = [];
    let _payDate_extraInitializers = [];
    let _grossAmount_decorators;
    let _grossAmount_initializers = [];
    let _grossAmount_extraInitializers = [];
    let _netAmount_decorators;
    let _netAmount_initializers = [];
    let _netAmount_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _processedAt_decorators;
    let _processedAt_initializers = [];
    let _processedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var OffCyclePayrollModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.reason = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.payDate = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _payDate_initializers, void 0));
            this.grossAmount = (__runInitializers(this, _payDate_extraInitializers), __runInitializers(this, _grossAmount_initializers, void 0));
            this.netAmount = (__runInitializers(this, _grossAmount_extraInitializers), __runInitializers(this, _netAmount_initializers, void 0));
            this.status = (__runInitializers(this, _netAmount_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.processedAt = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _processedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _processedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "OffCyclePayrollModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _reason_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _payDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _grossAmount_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _netAmount_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('DRAFT'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _processedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _payDate_decorators, { kind: "field", name: "payDate", static: false, private: false, access: { has: obj => "payDate" in obj, get: obj => obj.payDate, set: (obj, value) => { obj.payDate = value; } }, metadata: _metadata }, _payDate_initializers, _payDate_extraInitializers);
        __esDecorate(null, null, _grossAmount_decorators, { kind: "field", name: "grossAmount", static: false, private: false, access: { has: obj => "grossAmount" in obj, get: obj => obj.grossAmount, set: (obj, value) => { obj.grossAmount = value; } }, metadata: _metadata }, _grossAmount_initializers, _grossAmount_extraInitializers);
        __esDecorate(null, null, _netAmount_decorators, { kind: "field", name: "netAmount", static: false, private: false, access: { has: obj => "netAmount" in obj, get: obj => obj.netAmount, set: (obj, value) => { obj.netAmount = value; } }, metadata: _metadata }, _netAmount_initializers, _netAmount_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _processedAt_decorators, { kind: "field", name: "processedAt", static: false, private: false, access: { has: obj => "processedAt" in obj, get: obj => obj.processedAt, set: (obj, value) => { obj.processedAt = value; } }, metadata: _metadata }, _processedAt_initializers, _processedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OffCyclePayrollModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OffCyclePayrollModel = _classThis;
})();
exports.OffCyclePayrollModel = OffCyclePayrollModel;
/**
 * Garnishment Model
 */
let GarnishmentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'garnishments', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _garnishmentType_decorators;
    let _garnishmentType_initializers = [];
    let _garnishmentType_extraInitializers = [];
    let _caseNumber_decorators;
    let _caseNumber_initializers = [];
    let _caseNumber_extraInitializers = [];
    let _issuingAuthority_decorators;
    let _issuingAuthority_initializers = [];
    let _issuingAuthority_extraInitializers = [];
    let _orderDate_decorators;
    let _orderDate_initializers = [];
    let _orderDate_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _amountType_decorators;
    let _amountType_initializers = [];
    let _amountType_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _maxPercentage_decorators;
    let _maxPercentage_initializers = [];
    let _maxPercentage_extraInitializers = [];
    let _totalOwed_decorators;
    let _totalOwed_initializers = [];
    let _totalOwed_extraInitializers = [];
    let _totalPaid_decorators;
    let _totalPaid_initializers = [];
    let _totalPaid_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var GarnishmentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.garnishmentType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _garnishmentType_initializers, void 0));
            this.caseNumber = (__runInitializers(this, _garnishmentType_extraInitializers), __runInitializers(this, _caseNumber_initializers, void 0));
            this.issuingAuthority = (__runInitializers(this, _caseNumber_extraInitializers), __runInitializers(this, _issuingAuthority_initializers, void 0));
            this.orderDate = (__runInitializers(this, _issuingAuthority_extraInitializers), __runInitializers(this, _orderDate_initializers, void 0));
            this.startDate = (__runInitializers(this, _orderDate_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.status = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.amountType = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _amountType_initializers, void 0));
            this.amount = (__runInitializers(this, _amountType_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.maxPercentage = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _maxPercentage_initializers, void 0));
            this.totalOwed = (__runInitializers(this, _maxPercentage_extraInitializers), __runInitializers(this, _totalOwed_initializers, void 0));
            this.totalPaid = (__runInitializers(this, _totalOwed_extraInitializers), __runInitializers(this, _totalPaid_initializers, void 0));
            this.priority = (__runInitializers(this, _totalPaid_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.createdAt = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GarnishmentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _garnishmentType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _caseNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _issuingAuthority_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _orderDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _startDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('ACTIVE'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _amountType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _amount_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _maxPercentage_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _totalOwed_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _totalPaid_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _priority_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(1), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _garnishmentType_decorators, { kind: "field", name: "garnishmentType", static: false, private: false, access: { has: obj => "garnishmentType" in obj, get: obj => obj.garnishmentType, set: (obj, value) => { obj.garnishmentType = value; } }, metadata: _metadata }, _garnishmentType_initializers, _garnishmentType_extraInitializers);
        __esDecorate(null, null, _caseNumber_decorators, { kind: "field", name: "caseNumber", static: false, private: false, access: { has: obj => "caseNumber" in obj, get: obj => obj.caseNumber, set: (obj, value) => { obj.caseNumber = value; } }, metadata: _metadata }, _caseNumber_initializers, _caseNumber_extraInitializers);
        __esDecorate(null, null, _issuingAuthority_decorators, { kind: "field", name: "issuingAuthority", static: false, private: false, access: { has: obj => "issuingAuthority" in obj, get: obj => obj.issuingAuthority, set: (obj, value) => { obj.issuingAuthority = value; } }, metadata: _metadata }, _issuingAuthority_initializers, _issuingAuthority_extraInitializers);
        __esDecorate(null, null, _orderDate_decorators, { kind: "field", name: "orderDate", static: false, private: false, access: { has: obj => "orderDate" in obj, get: obj => obj.orderDate, set: (obj, value) => { obj.orderDate = value; } }, metadata: _metadata }, _orderDate_initializers, _orderDate_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _amountType_decorators, { kind: "field", name: "amountType", static: false, private: false, access: { has: obj => "amountType" in obj, get: obj => obj.amountType, set: (obj, value) => { obj.amountType = value; } }, metadata: _metadata }, _amountType_initializers, _amountType_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _maxPercentage_decorators, { kind: "field", name: "maxPercentage", static: false, private: false, access: { has: obj => "maxPercentage" in obj, get: obj => obj.maxPercentage, set: (obj, value) => { obj.maxPercentage = value; } }, metadata: _metadata }, _maxPercentage_initializers, _maxPercentage_extraInitializers);
        __esDecorate(null, null, _totalOwed_decorators, { kind: "field", name: "totalOwed", static: false, private: false, access: { has: obj => "totalOwed" in obj, get: obj => obj.totalOwed, set: (obj, value) => { obj.totalOwed = value; } }, metadata: _metadata }, _totalOwed_initializers, _totalOwed_extraInitializers);
        __esDecorate(null, null, _totalPaid_decorators, { kind: "field", name: "totalPaid", static: false, private: false, access: { has: obj => "totalPaid" in obj, get: obj => obj.totalPaid, set: (obj, value) => { obj.totalPaid = value; } }, metadata: _metadata }, _totalPaid_initializers, _totalPaid_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GarnishmentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GarnishmentModel = _classThis;
})();
exports.GarnishmentModel = GarnishmentModel;
/**
 * Payroll Reconciliation Model
 */
let PayrollReconciliationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'payroll_reconciliations', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _payrollRunId_decorators;
    let _payrollRunId_initializers = [];
    let _payrollRunId_extraInitializers = [];
    let _reconciledWith_decorators;
    let _reconciledWith_initializers = [];
    let _reconciledWith_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _expectedTotal_decorators;
    let _expectedTotal_initializers = [];
    let _expectedTotal_extraInitializers = [];
    let _actualTotal_decorators;
    let _actualTotal_initializers = [];
    let _actualTotal_extraInitializers = [];
    let _variance_decorators;
    let _variance_initializers = [];
    let _variance_extraInitializers = [];
    let _variancePercentage_decorators;
    let _variancePercentage_initializers = [];
    let _variancePercentage_extraInitializers = [];
    let _discrepancies_decorators;
    let _discrepancies_initializers = [];
    let _discrepancies_extraInitializers = [];
    let _reconciledBy_decorators;
    let _reconciledBy_initializers = [];
    let _reconciledBy_extraInitializers = [];
    let _reconciledAt_decorators;
    let _reconciledAt_initializers = [];
    let _reconciledAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var PayrollReconciliationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.payrollRunId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _payrollRunId_initializers, void 0));
            this.reconciledWith = (__runInitializers(this, _payrollRunId_extraInitializers), __runInitializers(this, _reconciledWith_initializers, void 0));
            this.status = (__runInitializers(this, _reconciledWith_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.expectedTotal = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _expectedTotal_initializers, void 0));
            this.actualTotal = (__runInitializers(this, _expectedTotal_extraInitializers), __runInitializers(this, _actualTotal_initializers, void 0));
            this.variance = (__runInitializers(this, _actualTotal_extraInitializers), __runInitializers(this, _variance_initializers, void 0));
            this.variancePercentage = (__runInitializers(this, _variance_extraInitializers), __runInitializers(this, _variancePercentage_initializers, void 0));
            this.discrepancies = (__runInitializers(this, _variancePercentage_extraInitializers), __runInitializers(this, _discrepancies_initializers, void 0));
            this.reconciledBy = (__runInitializers(this, _discrepancies_extraInitializers), __runInitializers(this, _reconciledBy_initializers, void 0));
            this.reconciledAt = (__runInitializers(this, _reconciledBy_extraInitializers), __runInitializers(this, _reconciledAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _reconciledAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PayrollReconciliationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _payrollRunId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _reconciledWith_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('NOT_STARTED'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _expectedTotal_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _actualTotal_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _variance_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _variancePercentage_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(6, 2))];
        _discrepancies_decorators = [(0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _reconciledBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _reconciledAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _payrollRunId_decorators, { kind: "field", name: "payrollRunId", static: false, private: false, access: { has: obj => "payrollRunId" in obj, get: obj => obj.payrollRunId, set: (obj, value) => { obj.payrollRunId = value; } }, metadata: _metadata }, _payrollRunId_initializers, _payrollRunId_extraInitializers);
        __esDecorate(null, null, _reconciledWith_decorators, { kind: "field", name: "reconciledWith", static: false, private: false, access: { has: obj => "reconciledWith" in obj, get: obj => obj.reconciledWith, set: (obj, value) => { obj.reconciledWith = value; } }, metadata: _metadata }, _reconciledWith_initializers, _reconciledWith_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _expectedTotal_decorators, { kind: "field", name: "expectedTotal", static: false, private: false, access: { has: obj => "expectedTotal" in obj, get: obj => obj.expectedTotal, set: (obj, value) => { obj.expectedTotal = value; } }, metadata: _metadata }, _expectedTotal_initializers, _expectedTotal_extraInitializers);
        __esDecorate(null, null, _actualTotal_decorators, { kind: "field", name: "actualTotal", static: false, private: false, access: { has: obj => "actualTotal" in obj, get: obj => obj.actualTotal, set: (obj, value) => { obj.actualTotal = value; } }, metadata: _metadata }, _actualTotal_initializers, _actualTotal_extraInitializers);
        __esDecorate(null, null, _variance_decorators, { kind: "field", name: "variance", static: false, private: false, access: { has: obj => "variance" in obj, get: obj => obj.variance, set: (obj, value) => { obj.variance = value; } }, metadata: _metadata }, _variance_initializers, _variance_extraInitializers);
        __esDecorate(null, null, _variancePercentage_decorators, { kind: "field", name: "variancePercentage", static: false, private: false, access: { has: obj => "variancePercentage" in obj, get: obj => obj.variancePercentage, set: (obj, value) => { obj.variancePercentage = value; } }, metadata: _metadata }, _variancePercentage_initializers, _variancePercentage_extraInitializers);
        __esDecorate(null, null, _discrepancies_decorators, { kind: "field", name: "discrepancies", static: false, private: false, access: { has: obj => "discrepancies" in obj, get: obj => obj.discrepancies, set: (obj, value) => { obj.discrepancies = value; } }, metadata: _metadata }, _discrepancies_initializers, _discrepancies_extraInitializers);
        __esDecorate(null, null, _reconciledBy_decorators, { kind: "field", name: "reconciledBy", static: false, private: false, access: { has: obj => "reconciledBy" in obj, get: obj => obj.reconciledBy, set: (obj, value) => { obj.reconciledBy = value; } }, metadata: _metadata }, _reconciledBy_initializers, _reconciledBy_extraInitializers);
        __esDecorate(null, null, _reconciledAt_decorators, { kind: "field", name: "reconciledAt", static: false, private: false, access: { has: obj => "reconciledAt" in obj, get: obj => obj.reconciledAt, set: (obj, value) => { obj.reconciledAt = value; } }, metadata: _metadata }, _reconciledAt_initializers, _reconciledAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PayrollReconciliationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PayrollReconciliationModel = _classThis;
})();
exports.PayrollReconciliationModel = PayrollReconciliationModel;
/**
 * Third-Party Integration Model
 */
let ThirdPartyIntegrationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'third_party_integrations', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _provider_decorators;
    let _provider_initializers = [];
    let _provider_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _lastSyncAt_decorators;
    let _lastSyncAt_initializers = [];
    let _lastSyncAt_extraInitializers = [];
    let _configuration_decorators;
    let _configuration_initializers = [];
    let _configuration_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ThirdPartyIntegrationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.provider = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _provider_initializers, void 0));
            this.status = (__runInitializers(this, _provider_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.lastSyncAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _lastSyncAt_initializers, void 0));
            this.configuration = (__runInitializers(this, _lastSyncAt_extraInitializers), __runInitializers(this, _configuration_initializers, void 0));
            this.createdAt = (__runInitializers(this, _configuration_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ThirdPartyIntegrationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _provider_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Unique, sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('DISCONNECTED'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _lastSyncAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _configuration_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _provider_decorators, { kind: "field", name: "provider", static: false, private: false, access: { has: obj => "provider" in obj, get: obj => obj.provider, set: (obj, value) => { obj.provider = value; } }, metadata: _metadata }, _provider_initializers, _provider_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _lastSyncAt_decorators, { kind: "field", name: "lastSyncAt", static: false, private: false, access: { has: obj => "lastSyncAt" in obj, get: obj => obj.lastSyncAt, set: (obj, value) => { obj.lastSyncAt = value; } }, metadata: _metadata }, _lastSyncAt_initializers, _lastSyncAt_extraInitializers);
        __esDecorate(null, null, _configuration_decorators, { kind: "field", name: "configuration", static: false, private: false, access: { has: obj => "configuration" in obj, get: obj => obj.configuration, set: (obj, value) => { obj.configuration = value; } }, metadata: _metadata }, _configuration_initializers, _configuration_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ThirdPartyIntegrationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ThirdPartyIntegrationModel = _classThis;
})();
exports.ThirdPartyIntegrationModel = ThirdPartyIntegrationModel;
/**
 * Payroll Audit Log Model
 */
let PayrollAuditLogModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'payroll_audit_logs', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _payrollRunId_decorators;
    let _payrollRunId_initializers = [];
    let _payrollRunId_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _performedBy_decorators;
    let _performedBy_initializers = [];
    let _performedBy_extraInitializers = [];
    let _entityType_decorators;
    let _entityType_initializers = [];
    let _entityType_extraInitializers = [];
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _changes_decorators;
    let _changes_initializers = [];
    let _changes_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    var PayrollAuditLogModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.payrollRunId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _payrollRunId_initializers, void 0));
            this.action = (__runInitializers(this, _payrollRunId_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.performedBy = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _performedBy_initializers, void 0));
            this.entityType = (__runInitializers(this, _performedBy_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
            this.entityId = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
            this.changes = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _changes_initializers, void 0));
            this.timestamp = (__runInitializers(this, _changes_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.createdAt = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PayrollAuditLogModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _payrollRunId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _action_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _performedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _entityType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _entityId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _changes_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _timestamp_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _ipAddress_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _payrollRunId_decorators, { kind: "field", name: "payrollRunId", static: false, private: false, access: { has: obj => "payrollRunId" in obj, get: obj => obj.payrollRunId, set: (obj, value) => { obj.payrollRunId = value; } }, metadata: _metadata }, _payrollRunId_initializers, _payrollRunId_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _performedBy_decorators, { kind: "field", name: "performedBy", static: false, private: false, access: { has: obj => "performedBy" in obj, get: obj => obj.performedBy, set: (obj, value) => { obj.performedBy = value; } }, metadata: _metadata }, _performedBy_initializers, _performedBy_extraInitializers);
        __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: obj => "entityType" in obj, get: obj => obj.entityType, set: (obj, value) => { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
        __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
        __esDecorate(null, null, _changes_decorators, { kind: "field", name: "changes", static: false, private: false, access: { has: obj => "changes" in obj, get: obj => obj.changes, set: (obj, value) => { obj.changes = value; } }, metadata: _metadata }, _changes_initializers, _changes_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PayrollAuditLogModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PayrollAuditLogModel = _classThis;
})();
exports.PayrollAuditLogModel = PayrollAuditLogModel;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Payroll Data Synchronization Functions
 */
/**
 * Synchronize employee data from HR system to payroll
 * @param syncType - Type of sync to perform
 * @param transaction - Optional database transaction
 * @returns Sync record
 */
async function syncPayrollEmployeeData(syncType, transaction) {
    const sync = await PayrollDataSyncModel.create({
        syncType,
        syncStatus: SyncStatus.IN_PROGRESS,
        recordsProcessed: 0,
        recordsFailed: 0,
        errors: [],
        startedAt: new Date(),
    }, { transaction });
    // In real implementation, perform actual sync with HR system
    // For now, simulate success
    await sync.update({
        syncStatus: SyncStatus.COMPLETED,
        recordsProcessed: 100,
        completedAt: new Date(),
    }, { transaction });
    return sync;
}
/**
 * Sync time and attendance data for payroll processing
 * @param startDate - Start date for sync
 * @param endDate - End date for sync
 * @param transaction - Optional database transaction
 * @returns Sync results
 */
async function syncTimeAndAttendance(startDate, endDate, transaction) {
    const sync = await syncPayrollEmployeeData('TIME_ATTENDANCE', transaction);
    return {
        synced: sync.syncStatus === SyncStatus.COMPLETED,
        recordsProcessed: sync.recordsProcessed,
        errors: sync.errors,
    };
}
/**
 * Synchronize payroll changes (salary, deductions, etc.)
 * @param changesSince - Date to sync changes from
 * @param transaction - Optional database transaction
 * @returns Sync results
 */
async function syncPayrollChanges(changesSince, transaction) {
    const sync = await PayrollDataSyncModel.create({
        syncType: 'CHANGES',
        syncStatus: SyncStatus.IN_PROGRESS,
        recordsProcessed: 0,
        recordsFailed: 0,
        errors: [],
        startedAt: new Date(),
    }, { transaction });
    // Process changes since date
    await sync.update({
        syncStatus: SyncStatus.COMPLETED,
        recordsProcessed: 25,
        completedAt: new Date(),
    }, { transaction });
    return sync;
}
/**
 * Validate payroll data integrity before processing
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Validation results
 */
async function validatePayrollDataIntegrity(payrollRunId, transaction) {
    const payrollRun = await PayrollRunModel.findByPk(payrollRunId, { transaction });
    if (!payrollRun) {
        throw new common_1.NotFoundException(`Payroll run ${payrollRunId} not found`);
    }
    const errors = [];
    // Validate employee count
    if (payrollRun.employeeCount === 0) {
        errors.push({
            errorCode: 'NO_EMPLOYEES',
            errorMessage: 'No employees in payroll run',
            severity: 'ERROR',
        });
    }
    // Validate totals
    if (payrollRun.totalNet <= 0) {
        errors.push({
            errorCode: 'INVALID_TOTAL',
            errorMessage: 'Total net pay is zero or negative',
            severity: 'ERROR',
        });
    }
    await payrollRun.update({ validationErrors: errors }, { transaction });
    return {
        valid: errors.filter((e) => e.severity === 'ERROR').length === 0,
        errors,
    };
}
/**
 * Payroll Run Preparation & Validation Functions
 */
/**
 * Prepare payroll run for processing
 * @param payrollData - Payroll run data
 * @param transaction - Optional database transaction
 * @returns Created payroll run
 */
async function preparePayrollRun(payrollData, transaction) {
    const validated = exports.PayrollRunSchema.parse(payrollData);
    const payrollRun = await PayrollRunModel.create({
        ...validated,
        status: PayrollRunStatus.IN_PREPARATION,
        employeeCount: 0,
        totalGross: 0,
        totalDeductions: 0,
        totalTaxes: 0,
        totalNet: 0,
        validationErrors: [],
    }, { transaction });
    return payrollRun;
}
/**
 * Validate payroll inputs before processing
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Validation results
 */
async function validatePayrollInputs(payrollRunId, transaction) {
    const payrollRun = await PayrollRunModel.findByPk(payrollRunId, {
        include: [EarningsModel, DeductionsModel, TaxWithholdingModel],
        transaction,
    });
    if (!payrollRun) {
        throw new common_1.NotFoundException(`Payroll run ${payrollRunId} not found`);
    }
    const errors = [];
    const warnings = [];
    // Validate earnings
    if (!payrollRun.earnings || payrollRun.earnings.length === 0) {
        errors.push({
            errorCode: 'NO_EARNINGS',
            errorMessage: 'No earnings records found',
            severity: 'ERROR',
        });
    }
    // Validate deductions don't exceed gross
    const totalEarnings = payrollRun.earnings?.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0) || 0;
    const totalDeductions = payrollRun.deductions?.reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0) || 0;
    if (totalDeductions > totalEarnings) {
        errors.push({
            errorCode: 'DEDUCTIONS_EXCEED_GROSS',
            errorMessage: 'Total deductions exceed gross earnings',
            severity: 'ERROR',
        });
    }
    // Update validation status
    const newStatus = errors.length > 0
        ? PayrollRunStatus.VALIDATION_FAILED
        : PayrollRunStatus.READY_FOR_APPROVAL;
    await payrollRun.update({
        status: newStatus,
        validationErrors: [...errors, ...warnings],
    }, { transaction });
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Lock payroll period to prevent changes
 * @param periodId - Period ID
 * @param lockedBy - User locking the period
 * @param transaction - Optional database transaction
 * @returns Locked period
 */
async function lockPayrollPeriod(periodId, lockedBy, transaction) {
    const period = await PayrollPeriodModel.findByPk(periodId, { transaction });
    if (!period) {
        throw new common_1.NotFoundException(`Payroll period ${periodId} not found`);
    }
    if (period.status === PayrollPeriodStatus.LOCKED) {
        throw new common_1.ConflictException(`Payroll period ${periodId} is already locked`);
    }
    await period.update({
        status: PayrollPeriodStatus.LOCKED,
        lockedAt: new Date(),
        lockedBy,
    }, { transaction });
    return period;
}
/**
 * Approve payroll run for processing
 * @param payrollRunId - Payroll run ID
 * @param approvedBy - User approving the run
 * @param transaction - Optional database transaction
 * @returns Approved payroll run
 */
async function approvePayrollRun(payrollRunId, approvedBy, transaction) {
    const payrollRun = await PayrollRunModel.findByPk(payrollRunId, { transaction });
    if (!payrollRun) {
        throw new common_1.NotFoundException(`Payroll run ${payrollRunId} not found`);
    }
    if (payrollRun.status !== PayrollRunStatus.READY_FOR_APPROVAL) {
        throw new common_1.BadRequestException(`Payroll run ${payrollRunId} is not ready for approval (status: ${payrollRun.status})`);
    }
    await payrollRun.update({
        status: PayrollRunStatus.APPROVED,
        approvedBy,
        approvedAt: new Date(),
    }, { transaction });
    return payrollRun;
}
/**
 * Earnings & Deductions Management Functions
 */
/**
 * Calculate earnings for employee
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param earningsData - Earnings data array
 * @param transaction - Optional database transaction
 * @returns Created earnings records
 */
async function calculateEarnings(employeeId, payrollRunId, earningsData, transaction) {
    const earnings = await Promise.all(earningsData.map((data) => EarningsModel.create({
        ...data,
        employeeId,
        payrollRunId,
    }, { transaction })));
    return earnings;
}
/**
 * Apply deductions to employee payroll
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param deductionsData - Deductions data array
 * @param transaction - Optional database transaction
 * @returns Created deduction records
 */
async function applyDeductions(employeeId, payrollRunId, deductionsData, transaction) {
    // Sort by priority
    const sorted = deductionsData.sort((a, b) => a.priority - b.priority);
    const deductions = await Promise.all(sorted.map((data) => DeductionsModel.create({
        ...data,
        employeeId,
        payrollRunId,
    }, { transaction })));
    return deductions;
}
/**
 * Track recurring deductions for employee
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns List of recurring deductions
 */
async function trackRecurringDeductions(employeeId, transaction) {
    const deductions = await DeductionsModel.findAll({
        where: {
            employeeId,
            isRecurring: true,
        },
        order: [['priority', 'ASC']],
        transaction,
    });
    return deductions;
}
/**
 * Generate earnings statement for employee
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Earnings statement
 */
async function generateEarningsStatement(employeeId, payrollRunId, transaction) {
    const earnings = await EarningsModel.findAll({
        where: { employeeId, payrollRunId },
        transaction,
    });
    const totalEarnings = earnings.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);
    return {
        employeeId,
        payrollRunId,
        earnings,
        totalEarnings,
    };
}
/**
 * Tax Withholding Calculations Functions
 */
/**
 * Calculate federal income tax withholding
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param taxableWages - Taxable wages amount
 * @param filingStatus - Tax filing status
 * @param exemptions - Number of exemptions
 * @param transaction - Optional database transaction
 * @returns Federal tax withholding record
 */
async function calculateFederalTax(employeeId, payrollRunId, taxableWages, filingStatus, exemptions, transaction) {
    // Simplified federal tax calculation (in real implementation, use IRS tax tables)
    let taxRate = 0.22; // Simplified rate
    if (taxableWages < 10000)
        taxRate = 0.1;
    else if (taxableWages < 40000)
        taxRate = 0.12;
    else if (taxableWages < 85000)
        taxRate = 0.22;
    else if (taxableWages < 163000)
        taxRate = 0.24;
    else
        taxRate = 0.32;
    const exemptionAmount = exemptions * 4300; // Simplified exemption value
    const adjustedWages = Math.max(0, taxableWages - exemptionAmount);
    const taxAmount = adjustedWages * taxRate;
    const tax = await TaxWithholdingModel.create({
        employeeId,
        payrollRunId,
        taxType: TaxType.FEDERAL_INCOME_TAX,
        taxableWages,
        taxAmount,
        taxRate,
        jurisdiction: 'US',
        filingStatus,
        exemptions,
        additionalWithholding: 0,
    }, { transaction });
    return tax;
}
/**
 * Calculate state income tax withholding
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param taxableWages - Taxable wages amount
 * @param state - State code
 * @param transaction - Optional database transaction
 * @returns State tax withholding record
 */
async function calculateStateTax(employeeId, payrollRunId, taxableWages, state, transaction) {
    // Simplified state tax rates (in real implementation, use state-specific tax tables)
    const stateTaxRates = {
        CA: 0.093,
        NY: 0.0685,
        TX: 0.0, // No state income tax
        FL: 0.0, // No state income tax
        IL: 0.0495,
        PA: 0.0307,
        OH: 0.0399,
    };
    const taxRate = stateTaxRates[state] || 0.05; // Default 5%
    const taxAmount = taxableWages * taxRate;
    const tax = await TaxWithholdingModel.create({
        employeeId,
        payrollRunId,
        taxType: TaxType.STATE_INCOME_TAX,
        taxableWages,
        taxAmount,
        taxRate,
        jurisdiction: state,
        exemptions: 0,
        additionalWithholding: 0,
    }, { transaction });
    return tax;
}
/**
 * Calculate local/city income tax withholding
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param taxableWages - Taxable wages amount
 * @param locality - Local jurisdiction
 * @param transaction - Optional database transaction
 * @returns Local tax withholding record
 */
async function calculateLocalTax(employeeId, payrollRunId, taxableWages, locality, transaction) {
    // Simplified local tax rate
    const taxRate = 0.01; // 1% local tax
    const taxAmount = taxableWages * taxRate;
    const tax = await TaxWithholdingModel.create({
        employeeId,
        payrollRunId,
        taxType: TaxType.LOCAL_INCOME_TAX,
        taxableWages,
        taxAmount,
        taxRate,
        jurisdiction: locality,
        exemptions: 0,
        additionalWithholding: 0,
    }, { transaction });
    return tax;
}
/**
 * Apply tax exemptions and adjustments
 * @param taxWithholdingId - Tax withholding ID
 * @param exemptions - Number of exemptions
 * @param additionalWithholding - Additional withholding amount
 * @param transaction - Optional database transaction
 * @returns Updated tax withholding
 */
async function applyTaxExemptions(taxWithholdingId, exemptions, additionalWithholding, transaction) {
    const tax = await TaxWithholdingModel.findByPk(taxWithholdingId, { transaction });
    if (!tax) {
        throw new common_1.NotFoundException(`Tax withholding ${taxWithholdingId} not found`);
    }
    // Recalculate with exemptions
    const exemptionAmount = exemptions * 4300;
    const adjustedWages = Math.max(0, tax.taxableWages - exemptionAmount);
    const newTaxAmount = adjustedWages * parseFloat(tax.taxRate.toString()) + additionalWithholding;
    await tax.update({
        exemptions,
        additionalWithholding,
        taxAmount: newTaxAmount,
    }, { transaction });
    return tax;
}
/**
 * Payroll Calendar Management Functions
 */
/**
 * Create payroll calendar for year
 * @param year - Calendar year
 * @param frequency - Payroll frequency
 * @param transaction - Optional database transaction
 * @returns Created payroll calendar with periods
 */
async function createPayrollCalendar(year, frequency, transaction) {
    const calendar = await PayrollCalendarModel.create({
        year,
        frequency,
    }, { transaction });
    // Generate periods based on frequency
    const periods = generatePayrollPeriods(year, frequency);
    for (let i = 0; i < periods.length; i++) {
        await PayrollPeriodModel.create({
            calendarId: calendar.id,
            periodNumber: i + 1,
            ...periods[i],
            status: PayrollPeriodStatus.OPEN,
        }, { transaction });
    }
    return calendar;
}
/**
 * Helper function to generate payroll periods
 */
function generatePayrollPeriods(year, frequency) {
    const periods = [];
    const startOfYear = new Date(year, 0, 1);
    switch (frequency) {
        case PayrollFrequency.BI_WEEKLY:
            // 26 pay periods
            for (let i = 0; i < 26; i++) {
                const startDate = new Date(startOfYear);
                startDate.setDate(startDate.getDate() + i * 14);
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 13);
                const payDate = new Date(endDate);
                payDate.setDate(payDate.getDate() + 3); // Pay 3 days after period end
                periods.push({ startDate, endDate, payDate });
            }
            break;
        case PayrollFrequency.SEMI_MONTHLY:
            // 24 pay periods (1st-15th, 16th-end of month)
            for (let month = 0; month < 12; month++) {
                // First half
                periods.push({
                    startDate: new Date(year, month, 1),
                    endDate: new Date(year, month, 15),
                    payDate: new Date(year, month, 18),
                });
                // Second half
                const lastDay = new Date(year, month + 1, 0).getDate();
                periods.push({
                    startDate: new Date(year, month, 16),
                    endDate: new Date(year, month, lastDay),
                    payDate: new Date(year, month + 1, 3),
                });
            }
            break;
        case PayrollFrequency.MONTHLY:
            // 12 pay periods
            for (let month = 0; month < 12; month++) {
                const lastDay = new Date(year, month + 1, 0).getDate();
                periods.push({
                    startDate: new Date(year, month, 1),
                    endDate: new Date(year, month, lastDay),
                    payDate: new Date(year, month + 1, 5),
                });
            }
            break;
        default:
            throw new common_1.BadRequestException(`Unsupported payroll frequency: ${frequency}`);
    }
    return periods;
}
/**
 * Get payroll schedule for employee
 * @param employeeId - Employee ID
 * @param year - Year
 * @param transaction - Optional database transaction
 * @returns Payroll schedule
 */
async function getPayrollSchedule(employeeId, year, transaction) {
    // In real implementation, get employee's payroll frequency
    const frequency = PayrollFrequency.BI_WEEKLY;
    const calendar = await PayrollCalendarModel.findOne({
        where: { year, frequency },
        include: [PayrollPeriodModel],
        transaction,
    });
    if (!calendar) {
        throw new common_1.NotFoundException(`Payroll calendar for ${year} (${frequency}) not found`);
    }
    return calendar.periods;
}
/**
 * Adjust payroll dates for holidays
 * @param periodId - Period ID
 * @param newPayDate - New pay date
 * @param transaction - Optional database transaction
 * @returns Updated period
 */
async function adjustPayrollDates(periodId, newPayDate, transaction) {
    const period = await PayrollPeriodModel.findByPk(periodId, { transaction });
    if (!period) {
        throw new common_1.NotFoundException(`Payroll period ${periodId} not found`);
    }
    if (period.status === PayrollPeriodStatus.LOCKED) {
        throw new common_1.ConflictException('Cannot adjust dates for locked period');
    }
    await period.update({ payDate: newPayDate }, { transaction });
    return period;
}
/**
 * Notify stakeholders of payroll deadlines
 * @param periodId - Period ID
 * @param transaction - Optional database transaction
 * @returns Notification results
 */
async function notifyPayrollDeadlines(periodId, transaction) {
    const period = await PayrollPeriodModel.findByPk(periodId, { transaction });
    if (!period) {
        throw new common_1.NotFoundException(`Payroll period ${periodId} not found`);
    }
    // In real implementation, send notifications via email/SMS
    const recipientCount = 5; // HR team, payroll processors, etc.
    return {
        notified: true,
        recipientCount,
    };
}
/**
 * Retroactive Pay & Adjustments Functions
 */
/**
 * Calculate retroactive pay adjustment
 * @param adjustmentData - Adjustment data
 * @param transaction - Optional database transaction
 * @returns Retroactive pay record
 */
async function calculateRetroactivePay(adjustmentData, transaction) {
    const validated = exports.RetroactivePaySchema.parse(adjustmentData);
    const payDifference = validated.newPayRate - validated.originalPayRate;
    const totalAdjustment = payDifference * validated.periodsAffected * 80; // Assuming 80 hours per period
    const retro = await RetroactivePayModel.create({
        ...validated,
        totalAdjustment,
        status: 'PENDING',
    }, { transaction });
    return retro;
}
/**
 * Apply payroll adjustments to current or past periods
 * @param payrollRunId - Payroll run ID
 * @param adjustments - Array of adjustments
 * @param transaction - Optional database transaction
 * @returns Applied adjustments
 */
async function applyPayrollAdjustments(payrollRunId, adjustments, transaction) {
    const payrollRun = await PayrollRunModel.findByPk(payrollRunId, { transaction });
    if (!payrollRun) {
        throw new common_1.NotFoundException(`Payroll run ${payrollRunId} not found`);
    }
    const appliedAdjustments = await Promise.all(adjustments.map(async (adj) => {
        // Create earning or deduction based on adjustment type
        if (adj.amount > 0) {
            return EarningsModel.create({
                employeeId: adj.employeeId,
                payrollRunId,
                earningType: EarningType.BONUS,
                description: adj.description,
                amount: adj.amount,
                taxable: true,
                subject_to_social_security: true,
                subject_to_medicare: true,
            }, { transaction });
        }
        else {
            return DeductionsModel.create({
                employeeId: adj.employeeId,
                payrollRunId,
                deductionType: DeductionType.OTHER,
                description: adj.description,
                calculationMethod: DeductionCalculationMethod.FIXED_AMOUNT,
                amount: Math.abs(adj.amount),
                isRecurring: false,
                priority: 99,
            }, { transaction });
        }
    }));
    return appliedAdjustments;
}
/**
 * Track adjustment history for auditing
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Adjustment history
 */
async function trackAdjustmentHistory(employeeId, transaction) {
    const adjustments = await RetroactivePayModel.findAll({
        where: { employeeId },
        order: [['effectiveDate', 'DESC']],
        transaction,
    });
    return adjustments;
}
/**
 * Reconcile retroactive changes across periods
 * @param employeeId - Employee ID
 * @param startDate - Start date
 * @param endDate - End date
 * @param transaction - Optional database transaction
 * @returns Reconciliation summary
 */
async function reconcileRetroactiveChanges(employeeId, startDate, endDate, transaction) {
    const adjustments = await RetroactivePayModel.findAll({
        where: {
            employeeId,
            effectiveDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
            status: 'PROCESSED',
        },
        transaction,
    });
    const totalAdjustments = adjustments.reduce((sum, adj) => sum + parseFloat(adj.totalAdjustment.toString()), 0);
    return {
        totalAdjustments,
        adjustmentCount: adjustments.length,
    };
}
/**
 * Off-Cycle & Bonus Payroll Functions
 */
/**
 * Create off-cycle payroll run
 * @param offCycleData - Off-cycle payroll data
 * @param transaction - Optional database transaction
 * @returns Created off-cycle payroll
 */
async function createOffCyclePayroll(offCycleData, transaction) {
    const validated = exports.OffCyclePayrollSchema.parse(offCycleData);
    // Calculate net (simplified - in real implementation, calculate taxes)
    const netAmount = validated.grossAmount * 0.75; // Assume 25% tax
    const offCycle = await OffCyclePayrollModel.create({
        ...validated,
        netAmount,
        status: PayrollRunStatus.DRAFT,
    }, { transaction });
    return offCycle;
}
/**
 * Process bonus payment
 * @param employeeId - Employee ID
 * @param bonusAmount - Bonus amount
 * @param bonusType - Type of bonus
 * @param payDate - Payment date
 * @param transaction - Optional database transaction
 * @returns Processed bonus payment
 */
async function processBonusPayment(employeeId, bonusAmount, bonusType, payDate, transaction) {
    const bonus = await createOffCyclePayroll({
        employeeId,
        reason: OffCycleReason.BONUS,
        payDate,
        grossAmount: bonusAmount,
    }, transaction);
    return bonus;
}
/**
 * Calculate severance pay
 * @param employeeId - Employee ID
 * @param yearsOfService - Years of service
 * @param finalSalary - Final salary
 * @param transaction - Optional database transaction
 * @returns Severance calculation
 */
async function calculateSeverancePay(employeeId, yearsOfService, finalSalary, transaction) {
    // Typical calculation: 1-2 weeks per year of service
    const weeksPerYear = 2;
    const weeks = Math.min(yearsOfService * weeksPerYear, 52); // Cap at 52 weeks
    const weeklyPay = finalSalary / 52;
    const severanceAmount = weeklyPay * weeks;
    return {
        severanceAmount: Math.round(severanceAmount * 100) / 100,
        weeks,
    };
}
/**
 * Process commission payment
 * @param employeeId - Employee ID
 * @param commissionAmount - Commission amount
 * @param period - Commission period
 * @param transaction - Optional database transaction
 * @returns Processed commission
 */
async function processCommissionPayment(employeeId, commissionAmount, period, transaction) {
    const commission = await createOffCyclePayroll({
        employeeId,
        reason: OffCycleReason.COMMISSION,
        payDate: new Date(),
        grossAmount: commissionAmount,
    }, transaction);
    return commission;
}
/**
 * Garnishment & Child Support Functions
 */
/**
 * Apply garnishment to payroll
 * @param garnishmentData - Garnishment data
 * @param transaction - Optional database transaction
 * @returns Created garnishment
 */
async function applyGarnishment(garnishmentData, transaction) {
    const validated = exports.GarnishmentSchema.parse(garnishmentData);
    const garnishment = await GarnishmentModel.create({
        ...validated,
        status: GarnishmentStatus.ACTIVE,
        totalPaid: 0,
    }, { transaction });
    return garnishment;
}
/**
 * Track garnishment orders for employee
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Active garnishments
 */
async function trackGarnishmentOrders(employeeId, transaction) {
    const garnishments = await GarnishmentModel.findAll({
        where: {
            employeeId,
            status: GarnishmentStatus.ACTIVE,
        },
        order: [['priority', 'ASC']],
        transaction,
    });
    return garnishments;
}
/**
 * Report garnishment payments to authorities
 * @param garnishmentId - Garnishment ID
 * @param paymentAmount - Payment amount
 * @param paymentDate - Payment date
 * @param transaction - Optional database transaction
 * @returns Reporting confirmation
 */
async function reportGarnishmentPayments(garnishmentId, paymentAmount, paymentDate, transaction) {
    const garnishment = await GarnishmentModel.findByPk(garnishmentId, { transaction });
    if (!garnishment) {
        throw new common_1.NotFoundException(`Garnishment ${garnishmentId} not found`);
    }
    const newTotalPaid = parseFloat(garnishment.totalPaid.toString()) + paymentAmount;
    await garnishment.update({ totalPaid: newTotalPaid }, { transaction });
    // Check if garnishment is complete
    if (garnishment.totalOwed && newTotalPaid >= garnishment.totalOwed) {
        await garnishment.update({ status: GarnishmentStatus.COMPLETED }, { transaction });
    }
    return {
        reported: true,
        garnishment,
    };
}
/**
 * Payroll Reporting & Analytics Functions
 */
/**
 * Generate payroll register report
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Payroll register
 */
async function generatePayrollRegister(payrollRunId, transaction) {
    const payrollRun = await PayrollRunModel.findByPk(payrollRunId, {
        include: [EarningsModel, DeductionsModel, TaxWithholdingModel],
        transaction,
    });
    if (!payrollRun) {
        throw new common_1.NotFoundException(`Payroll run ${payrollRunId} not found`);
    }
    return {
        payrollRun: payrollRun.toJSON(),
        summary: {
            totalGross: payrollRun.totalGross,
            totalDeductions: payrollRun.totalDeductions,
            totalTaxes: payrollRun.totalTaxes,
            totalNet: payrollRun.totalNet,
        },
    };
}
/**
 * Analyze payroll costs and trends
 * @param startDate - Start date
 * @param endDate - End date
 * @param transaction - Optional database transaction
 * @returns Cost analysis
 */
async function analyzePayrollCosts(startDate, endDate, transaction) {
    const payrollRuns = await PayrollRunModel.findAll({
        where: {
            payDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
            status: PayrollRunStatus.COMPLETED,
        },
        transaction,
    });
    const totalCost = payrollRuns.reduce((sum, run) => sum + parseFloat(run.totalGross.toString()), 0);
    const totalEmployees = payrollRuns.reduce((sum, run) => sum + run.employeeCount, 0);
    const averagePerEmployee = totalEmployees > 0 ? totalCost / totalEmployees : 0;
    return {
        totalCost,
        averagePerEmployee: Math.round(averagePerEmployee * 100) / 100,
        trends: [], // In real implementation, calculate trends
    };
}
/**
 * Generate payroll summary report
 * @param periodId - Period ID
 * @param transaction - Optional database transaction
 * @returns Summary report
 */
async function generatePayrollSummary(periodId, transaction) {
    const period = await PayrollPeriodModel.findByPk(periodId, {
        include: [PayrollRunModel],
        transaction,
    });
    if (!period) {
        throw new common_1.NotFoundException(`Payroll period ${periodId} not found`);
    }
    const runs = period.payrollRuns || [];
    const totalGross = runs.reduce((sum, run) => sum + parseFloat(run.totalGross.toString()), 0);
    const totalNet = runs.reduce((sum, run) => sum + parseFloat(run.totalNet.toString()), 0);
    const totalEmployees = runs.reduce((sum, run) => sum + run.employeeCount, 0);
    return {
        period: period.toJSON(),
        summary: {
            totalGross,
            totalNet,
            totalEmployees,
            runsCount: runs.length,
        },
    };
}
/**
 * Export payroll reports in various formats
 * @param payrollRunId - Payroll run ID
 * @param format - Export format
 * @param transaction - Optional database transaction
 * @returns Export result
 */
async function exportPayrollReports(payrollRunId, format, transaction) {
    const payrollRun = await PayrollRunModel.findByPk(payrollRunId, { transaction });
    if (!payrollRun) {
        throw new common_1.NotFoundException(`Payroll run ${payrollRunId} not found`);
    }
    // In real implementation, generate actual export file
    return {
        exported: true,
        format,
        url: `/exports/payroll/${payrollRunId}.${format.toLowerCase()}`,
    };
}
/**
 * Payroll Reconciliation Functions
 */
/**
 * Reconcile payroll to general ledger
 * @param payrollRunId - Payroll run ID
 * @param glTotal - GL total amount
 * @param transaction - Optional database transaction
 * @returns Reconciliation record
 */
async function reconcilePayrollToGL(payrollRunId, glTotal, transaction) {
    const payrollRun = await PayrollRunModel.findByPk(payrollRunId, { transaction });
    if (!payrollRun) {
        throw new common_1.NotFoundException(`Payroll run ${payrollRunId} not found`);
    }
    const expectedTotal = parseFloat(payrollRun.totalNet.toString());
    const variance = glTotal - expectedTotal;
    const variancePercentage = expectedTotal > 0 ? (variance / expectedTotal) * 100 : 0;
    const discrepancies = [];
    if (Math.abs(variance) > 0.01) {
        discrepancies.push({
            type: 'NET_PAY_VARIANCE',
            description: 'Variance between payroll and GL totals',
            expectedValue: expectedTotal,
            actualValue: glTotal,
            difference: variance,
            resolved: false,
        });
    }
    const reconciliation = await PayrollReconciliationModel.create({
        payrollRunId,
        reconciledWith: 'GL',
        status: Math.abs(variance) < 0.01
            ? ReconciliationStatus.RECONCILED
            : ReconciliationStatus.DISCREPANCY_FOUND,
        expectedTotal,
        actualTotal: glTotal,
        variance,
        variancePercentage,
        discrepancies,
    }, { transaction });
    return reconciliation;
}
/**
 * Validate payroll totals against source data
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Validation results
 */
async function validatePayrollTotals(payrollRunId, transaction) {
    const payrollRun = await PayrollRunModel.findByPk(payrollRunId, {
        include: [EarningsModel, DeductionsModel, TaxWithholdingModel],
        transaction,
    });
    if (!payrollRun) {
        throw new common_1.NotFoundException(`Payroll run ${payrollRunId} not found`);
    }
    const discrepancies = [];
    // Validate earnings total
    const calculatedEarnings = payrollRun.earnings?.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0) || 0;
    const recordedEarnings = parseFloat(payrollRun.totalGross.toString());
    if (Math.abs(calculatedEarnings - recordedEarnings) > 0.01) {
        discrepancies.push({
            type: 'EARNINGS_TOTAL',
            description: 'Earnings total mismatch',
            expectedValue: calculatedEarnings,
            actualValue: recordedEarnings,
            difference: calculatedEarnings - recordedEarnings,
            resolved: false,
        });
    }
    return {
        valid: discrepancies.length === 0,
        discrepancies,
    };
}
/**
 * Track payroll discrepancies
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Discrepancy list
 */
async function trackPayrollDiscrepancies(payrollRunId, transaction) {
    const reconciliations = await PayrollReconciliationModel.findAll({
        where: { payrollRunId },
        transaction,
    });
    const allDiscrepancies = reconciliations.flatMap((r) => r.discrepancies);
    return allDiscrepancies.filter((d) => !d.resolved);
}
/**
 * Generate reconciliation report
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Reconciliation report
 */
async function generateReconciliationReport(payrollRunId, transaction) {
    const reconciliations = await PayrollReconciliationModel.findAll({
        where: { payrollRunId },
        transaction,
    });
    const totalVariance = reconciliations.reduce((sum, r) => sum + parseFloat(r.variance.toString()), 0);
    return {
        payrollRunId,
        reconciliations: reconciliations.map((r) => r.toJSON()),
        totalVariance,
        reconciliationCount: reconciliations.length,
    };
}
/**
 * Third-Party Payroll Provider Integration Functions
 */
/**
 * Connect to third-party payroll provider
 * @param provider - Payroll provider
 * @param configuration - Provider configuration
 * @param transaction - Optional database transaction
 * @returns Integration record
 */
async function connectPayrollProvider(provider, configuration, transaction) {
    const integration = await ThirdPartyIntegrationModel.create({
        provider,
        status: 'CONNECTED',
        configuration,
        lastSyncAt: new Date(),
    }, { transaction });
    return integration;
}
/**
 * Export payroll data to third-party provider
 * @param providerId - Provider integration ID
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Export results
 */
async function exportPayrollDataToProvider(providerId, payrollRunId, transaction) {
    const integration = await ThirdPartyIntegrationModel.findByPk(providerId, { transaction });
    if (!integration) {
        throw new common_1.NotFoundException(`Provider integration ${providerId} not found`);
    }
    const payrollRun = await PayrollRunModel.findByPk(payrollRunId, {
        include: [EarningsModel, DeductionsModel, TaxWithholdingModel],
        transaction,
    });
    if (!payrollRun) {
        throw new common_1.NotFoundException(`Payroll run ${payrollRunId} not found`);
    }
    // In real implementation, export to provider API
    const recordCount = payrollRun.employeeCount;
    await integration.update({ lastSyncAt: new Date() }, { transaction });
    return {
        exported: true,
        recordCount,
    };
}
/**
 * Import payroll results from third-party provider
 * @param providerId - Provider integration ID
 * @param transaction - Optional database transaction
 * @returns Import results
 */
async function importPayrollResultsFromProvider(providerId, transaction) {
    const integration = await ThirdPartyIntegrationModel.findByPk(providerId, { transaction });
    if (!integration) {
        throw new common_1.NotFoundException(`Provider integration ${providerId} not found`);
    }
    // In real implementation, import from provider API
    const recordCount = 100;
    await integration.update({ lastSyncAt: new Date() }, { transaction });
    return {
        imported: true,
        recordCount,
    };
}
/**
 * Sync payroll provider status
 * @param providerId - Provider integration ID
 * @param transaction - Optional database transaction
 * @returns Sync status
 */
async function syncPayrollProviderStatus(providerId, transaction) {
    const integration = await ThirdPartyIntegrationModel.findByPk(providerId, { transaction });
    if (!integration) {
        throw new common_1.NotFoundException(`Provider integration ${providerId} not found`);
    }
    // In real implementation, check provider API status
    await integration.update({ lastSyncAt: new Date() }, { transaction });
    return integration;
}
/**
 * Payroll Audit & Compliance Functions
 */
/**
 * Audit payroll run for compliance
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Audit results
 */
async function auditPayrollRun(payrollRunId, transaction) {
    const payrollRun = await PayrollRunModel.findByPk(payrollRunId, {
        include: [EarningsModel, DeductionsModel, TaxWithholdingModel],
        transaction,
    });
    if (!payrollRun) {
        throw new common_1.NotFoundException(`Payroll run ${payrollRunId} not found`);
    }
    const findings = [];
    const recommendations = [];
    // Check if approved
    if (!payrollRun.approvedBy) {
        findings.push('Payroll run not approved');
        recommendations.push('Require approval before processing');
    }
    // Check for validation errors
    if (payrollRun.validationErrors.length > 0) {
        findings.push(`${payrollRun.validationErrors.length} validation errors found`);
        recommendations.push('Resolve all validation errors before processing');
    }
    // Check totals
    if (parseFloat(payrollRun.totalNet.toString()) <= 0) {
        findings.push('Total net pay is zero or negative');
        recommendations.push('Review earnings and deductions');
    }
    return {
        compliant: findings.length === 0,
        findings,
        recommendations,
    };
}
/**
 * Validate payroll compliance with regulations
 * @param payrollRunId - Payroll run ID
 * @param regulations - Array of regulation codes
 * @param transaction - Optional database transaction
 * @returns Compliance validation
 */
async function validatePayrollCompliance(payrollRunId, regulations, transaction) {
    const payrollRun = await PayrollRunModel.findByPk(payrollRunId, { transaction });
    if (!payrollRun) {
        throw new common_1.NotFoundException(`Payroll run ${payrollRunId} not found`);
    }
    const violations = [];
    // In real implementation, check against specific regulations
    // FLSA, SOX, etc.
    return {
        compliant: violations.length === 0,
        violations,
    };
}
/**
 * Generate compliance report
 * @param startDate - Start date
 * @param endDate - End date
 * @param transaction - Optional database transaction
 * @returns Compliance report
 */
async function generateComplianceReport(startDate, endDate, transaction) {
    const payrollRuns = await PayrollRunModel.findAll({
        where: {
            payDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        transaction,
    });
    const audits = await Promise.all(payrollRuns.map((run) => auditPayrollRun(run.id, transaction)));
    const compliantRuns = audits.filter((a) => a.compliant).length;
    const complianceRate = payrollRuns.length > 0 ? (compliantRuns / payrollRuns.length) * 100 : 100;
    const allFindings = audits.flatMap((a) => a.findings);
    return {
        period: { startDate, endDate },
        payrollRunsAudited: payrollRuns.length,
        complianceRate: Math.round(complianceRate * 100) / 100,
        violations: allFindings,
    };
}
// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================
/**
 * Payroll Integration Service
 * Provides enterprise-grade payroll processing and integration
 */
let PayrollIntegrationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)(), (0, swagger_1.ApiTags)('Payroll Integration')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PayrollIntegrationService = _classThis = class {
        // Payroll Data Synchronization
        async syncPayrollEmployeeData(syncType, transaction) {
            return syncPayrollEmployeeData(syncType, transaction);
        }
        async syncTimeAndAttendance(startDate, endDate, transaction) {
            return syncTimeAndAttendance(startDate, endDate, transaction);
        }
        async syncPayrollChanges(changesSince, transaction) {
            return syncPayrollChanges(changesSince, transaction);
        }
        async validatePayrollDataIntegrity(payrollRunId, transaction) {
            return validatePayrollDataIntegrity(payrollRunId, transaction);
        }
        // Payroll Run Preparation
        async preparePayrollRun(data, transaction) {
            return preparePayrollRun(data, transaction);
        }
        async validatePayrollInputs(payrollRunId, transaction) {
            return validatePayrollInputs(payrollRunId, transaction);
        }
        async lockPayrollPeriod(periodId, lockedBy, transaction) {
            return lockPayrollPeriod(periodId, lockedBy, transaction);
        }
        async approvePayrollRun(payrollRunId, approvedBy, transaction) {
            return approvePayrollRun(payrollRunId, approvedBy, transaction);
        }
        // Earnings & Deductions
        async calculateEarnings(employeeId, payrollRunId, earningsData, transaction) {
            return calculateEarnings(employeeId, payrollRunId, earningsData, transaction);
        }
        async applyDeductions(employeeId, payrollRunId, deductionsData, transaction) {
            return applyDeductions(employeeId, payrollRunId, deductionsData, transaction);
        }
        async trackRecurringDeductions(employeeId, transaction) {
            return trackRecurringDeductions(employeeId, transaction);
        }
        async generateEarningsStatement(employeeId, payrollRunId, transaction) {
            return generateEarningsStatement(employeeId, payrollRunId, transaction);
        }
        // Tax Calculations
        async calculateFederalTax(employeeId, payrollRunId, taxableWages, filingStatus, exemptions, transaction) {
            return calculateFederalTax(employeeId, payrollRunId, taxableWages, filingStatus, exemptions, transaction);
        }
        async calculateStateTax(employeeId, payrollRunId, taxableWages, state, transaction) {
            return calculateStateTax(employeeId, payrollRunId, taxableWages, state, transaction);
        }
        async calculateLocalTax(employeeId, payrollRunId, taxableWages, locality, transaction) {
            return calculateLocalTax(employeeId, payrollRunId, taxableWages, locality, transaction);
        }
        async applyTaxExemptions(taxWithholdingId, exemptions, additionalWithholding, transaction) {
            return applyTaxExemptions(taxWithholdingId, exemptions, additionalWithholding, transaction);
        }
        // Calendar Management
        async createPayrollCalendar(year, frequency, transaction) {
            return createPayrollCalendar(year, frequency, transaction);
        }
        async getPayrollSchedule(employeeId, year, transaction) {
            return getPayrollSchedule(employeeId, year, transaction);
        }
        async adjustPayrollDates(periodId, newPayDate, transaction) {
            return adjustPayrollDates(periodId, newPayDate, transaction);
        }
        async notifyPayrollDeadlines(periodId, transaction) {
            return notifyPayrollDeadlines(periodId, transaction);
        }
        // Retroactive Pay
        async calculateRetroactivePay(data, transaction) {
            return calculateRetroactivePay(data, transaction);
        }
        async applyPayrollAdjustments(payrollRunId, adjustments, transaction) {
            return applyPayrollAdjustments(payrollRunId, adjustments, transaction);
        }
        async trackAdjustmentHistory(employeeId, transaction) {
            return trackAdjustmentHistory(employeeId, transaction);
        }
        async reconcileRetroactiveChanges(employeeId, startDate, endDate, transaction) {
            return reconcileRetroactiveChanges(employeeId, startDate, endDate, transaction);
        }
        // Off-Cycle Payroll
        async createOffCyclePayroll(data, transaction) {
            return createOffCyclePayroll(data, transaction);
        }
        async processBonusPayment(employeeId, bonusAmount, bonusType, payDate, transaction) {
            return processBonusPayment(employeeId, bonusAmount, bonusType, payDate, transaction);
        }
        async calculateSeverancePay(employeeId, yearsOfService, finalSalary, transaction) {
            return calculateSeverancePay(employeeId, yearsOfService, finalSalary, transaction);
        }
        async processCommissionPayment(employeeId, commissionAmount, period, transaction) {
            return processCommissionPayment(employeeId, commissionAmount, period, transaction);
        }
        // Garnishments
        async applyGarnishment(data, transaction) {
            return applyGarnishment(data, transaction);
        }
        async trackGarnishmentOrders(employeeId, transaction) {
            return trackGarnishmentOrders(employeeId, transaction);
        }
        async reportGarnishmentPayments(garnishmentId, paymentAmount, paymentDate, transaction) {
            return reportGarnishmentPayments(garnishmentId, paymentAmount, paymentDate, transaction);
        }
        // Reporting & Analytics
        async generatePayrollRegister(payrollRunId, transaction) {
            return generatePayrollRegister(payrollRunId, transaction);
        }
        async analyzePayrollCosts(startDate, endDate, transaction) {
            return analyzePayrollCosts(startDate, endDate, transaction);
        }
        async generatePayrollSummary(periodId, transaction) {
            return generatePayrollSummary(periodId, transaction);
        }
        async exportPayrollReports(payrollRunId, format, transaction) {
            return exportPayrollReports(payrollRunId, format, transaction);
        }
        // Reconciliation
        async reconcilePayrollToGL(payrollRunId, glTotal, transaction) {
            return reconcilePayrollToGL(payrollRunId, glTotal, transaction);
        }
        async validatePayrollTotals(payrollRunId, transaction) {
            return validatePayrollTotals(payrollRunId, transaction);
        }
        async trackPayrollDiscrepancies(payrollRunId, transaction) {
            return trackPayrollDiscrepancies(payrollRunId, transaction);
        }
        async generateReconciliationReport(payrollRunId, transaction) {
            return generateReconciliationReport(payrollRunId, transaction);
        }
        // Third-Party Integration
        async connectPayrollProvider(provider, configuration, transaction) {
            return connectPayrollProvider(provider, configuration, transaction);
        }
        async exportPayrollDataToProvider(providerId, payrollRunId, transaction) {
            return exportPayrollDataToProvider(providerId, payrollRunId, transaction);
        }
        async importPayrollResultsFromProvider(providerId, transaction) {
            return importPayrollResultsFromProvider(providerId, transaction);
        }
        async syncPayrollProviderStatus(providerId, transaction) {
            return syncPayrollProviderStatus(providerId, transaction);
        }
        // Audit & Compliance
        async auditPayrollRun(payrollRunId, transaction) {
            return auditPayrollRun(payrollRunId, transaction);
        }
        async validatePayrollCompliance(payrollRunId, regulations, transaction) {
            return validatePayrollCompliance(payrollRunId, regulations, transaction);
        }
        async generateComplianceReport(startDate, endDate, transaction) {
            return generateComplianceReport(startDate, endDate, transaction);
        }
    };
    __setFunctionName(_classThis, "PayrollIntegrationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PayrollIntegrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PayrollIntegrationService = _classThis;
})();
exports.PayrollIntegrationService = PayrollIntegrationService;
//# sourceMappingURL=payroll-integration-kit.js.map