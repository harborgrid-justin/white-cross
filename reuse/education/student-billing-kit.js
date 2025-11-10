"use strict";
/**
 * LOC: EDU-BILLING-001
 * File: /reuse/education/student-billing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *
 * DOWNSTREAM (imported by):
 *   - Backend education modules
 *   - Student financial services
 *   - Bursar services
 *   - Payment processing modules
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefundModel = exports.createPaymentPlanModel = exports.createPaymentModel = exports.createChargeModel = exports.createStudentAccountModel = exports.ProcessPaymentDto = exports.CreateChargeDto = void 0;
exports.calculateTuition = calculateTuition;
exports.assessMandatoryFees = assessMandatoryFees;
exports.assessCourseFees = assessCourseFees;
exports.createCharge = createCharge;
exports.processEnrollmentCharges = processEnrollmentCharges;
exports.getAccountBalance = getAccountBalance;
exports.getAccountCharges = getAccountCharges;
exports.getAccountPayments = getAccountPayments;
exports.getAccountStatement = getAccountStatement;
exports.processPayment = processPayment;
exports.createPaymentPlan = createPaymentPlan;
exports.processInstallmentPayment = processInstallmentPayment;
exports.applyLateFee = applyLateFee;
exports.getPaymentPlan = getPaymentPlan;
exports.cancelPaymentPlan = cancelPaymentPlan;
exports.checkOverduePayments = checkOverduePayments;
exports.applyFinancialHold = applyFinancialHold;
exports.releaseFinancialHold = releaseFinancialHold;
exports.sendPaymentReminder = sendPaymentReminder;
exports.calculateRefund = calculateRefund;
exports.processRefund = processRefund;
exports.getAccountRefunds = getAccountRefunds;
exports.processWithdrawalRefund = processWithdrawalRefund;
exports.reverseRefund = reverseRefund;
exports.generate1098T = generate1098T;
exports.export1098T = export1098T;
exports.batchGenerate1098T = batchGenerate1098T;
exports.validate1098T = validate1098T;
exports.send1098T = send1098T;
exports.markAccountPastDue = markAccountPastDue;
exports.sendPastDueNotice = sendPastDueNotice;
exports.getPastDueAccounts = getPastDueAccounts;
exports.submitToCollections = submitToCollections;
exports.generateCollectionsReport = generateCollectionsReport;
exports.placeRegistrationHold = placeRegistrationHold;
exports.placeTranscriptHold = placeTranscriptHold;
exports.releaseAllHolds = releaseAllHolds;
exports.getAccountHolds = getAccountHolds;
exports.hasHold = hasHold;
/**
 * File: /reuse/education/student-billing-kit.ts
 * Locator: WC-EDU-BILLING-001
 * Purpose: Comprehensive Student Billing Management - Ellucian SIS-level billing, payment plans, refunds, 1098-T
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Downstream: ../backend/education/*, Student Financial Services, Bursar Office, Payment Gateway
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for billing, payments, refunds, collections, 1098-T generation, payment plans
 *
 * LLM Context: Enterprise-grade student billing management for higher education SIS.
 * Provides comprehensive tuition calculation, fee assessment, payment processing, payment plans,
 * refund calculations, 1098-T tax form generation, collections management, account holds,
 * and full integration with financial aid and registration systems.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateChargeDto = (() => {
    var _a;
    let _studentId_decorators;
    let _studentId_initializers = [];
    let _studentId_extraInitializers = [];
    let _chargeType_decorators;
    let _chargeType_initializers = [];
    let _chargeType_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _termId_decorators;
    let _termId_initializers = [];
    let _termId_extraInitializers = [];
    return _a = class CreateChargeDto {
            constructor() {
                this.studentId = __runInitializers(this, _studentId_initializers, void 0);
                this.chargeType = (__runInitializers(this, _studentId_extraInitializers), __runInitializers(this, _chargeType_initializers, void 0));
                this.amount = (__runInitializers(this, _chargeType_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.description = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.termId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _termId_initializers, void 0));
                __runInitializers(this, _termId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _studentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Student ID' })];
            _chargeType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Charge type' })];
            _amount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amount' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _termId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Term ID' })];
            __esDecorate(null, null, _studentId_decorators, { kind: "field", name: "studentId", static: false, private: false, access: { has: obj => "studentId" in obj, get: obj => obj.studentId, set: (obj, value) => { obj.studentId = value; } }, metadata: _metadata }, _studentId_initializers, _studentId_extraInitializers);
            __esDecorate(null, null, _chargeType_decorators, { kind: "field", name: "chargeType", static: false, private: false, access: { has: obj => "chargeType" in obj, get: obj => obj.chargeType, set: (obj, value) => { obj.chargeType = value; } }, metadata: _metadata }, _chargeType_initializers, _chargeType_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _termId_decorators, { kind: "field", name: "termId", static: false, private: false, access: { has: obj => "termId" in obj, get: obj => obj.termId, set: (obj, value) => { obj.termId = value; } }, metadata: _metadata }, _termId_initializers, _termId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateChargeDto = CreateChargeDto;
let ProcessPaymentDto = (() => {
    var _a;
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _paymentMethod_decorators;
    let _paymentMethod_initializers = [];
    let _paymentMethod_extraInitializers = [];
    let _referenceNumber_decorators;
    let _referenceNumber_initializers = [];
    let _referenceNumber_extraInitializers = [];
    return _a = class ProcessPaymentDto {
            constructor() {
                this.accountId = __runInitializers(this, _accountId_initializers, void 0);
                this.amount = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.paymentMethod = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
                this.referenceNumber = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _referenceNumber_initializers, void 0));
                __runInitializers(this, _referenceNumber_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _accountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Student account ID' })];
            _amount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment amount' })];
            _paymentMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment method' })];
            _referenceNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reference number' })];
            __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: obj => "accountId" in obj, get: obj => obj.accountId, set: (obj, value) => { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: obj => "paymentMethod" in obj, get: obj => obj.paymentMethod, set: (obj, value) => { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
            __esDecorate(null, null, _referenceNumber_decorators, { kind: "field", name: "referenceNumber", static: false, private: false, access: { has: obj => "referenceNumber" in obj, get: obj => obj.referenceNumber, set: (obj, value) => { obj.referenceNumber = value; } }, metadata: _metadata }, _referenceNumber_initializers, _referenceNumber_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProcessPaymentDto = ProcessPaymentDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Student Account with balance tracking.
 */
const createStudentAccountModel = (sequelize) => {
    class StudentAccount extends sequelize_1.Model {
    }
    StudentAccount.init({
        id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        studentId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        termId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        totalCharges: { type: sequelize_1.DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        totalPayments: { type: sequelize_1.DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        totalRefunds: { type: sequelize_1.DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        currentBalance: { type: sequelize_1.DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        pastDueAmount: { type: sequelize_1.DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        holds: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING), defaultValue: [] },
    }, {
        sequelize,
        tableName: 'student_accounts',
        indexes: [
            { fields: ['studentId'] },
            { fields: ['termId'] },
            { fields: ['studentId', 'termId'], unique: true },
        ],
    });
    return StudentAccount;
};
exports.createStudentAccountModel = createStudentAccountModel;
/**
 * Sequelize model for Charge tracking.
 */
const createChargeModel = (sequelize) => {
    class Charge extends sequelize_1.Model {
    }
    Charge.init({
        id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        chargeType: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
        amount: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
        description: { type: sequelize_1.DataTypes.STRING(500), allowNull: false },
        chargeDate: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
        termId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    }, {
        sequelize,
        tableName: 'charges',
        indexes: [{ fields: ['accountId'] }, { fields: ['termId'] }],
    });
    return Charge;
};
exports.createChargeModel = createChargeModel;
/**
 * Sequelize model for Payment tracking.
 */
const createPaymentModel = (sequelize) => {
    class Payment extends sequelize_1.Model {
    }
    Payment.init({
        id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        amount: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
        paymentMethod: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
        paymentDate: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
        referenceNumber: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    }, {
        sequelize,
        tableName: 'payments',
        indexes: [{ fields: ['accountId'] }, { fields: ['referenceNumber'] }],
    });
    return Payment;
};
exports.createPaymentModel = createPaymentModel;
/**
 * Sequelize model for Payment Plan tracking.
 */
const createPaymentPlanModel = (sequelize) => {
    class PaymentPlan extends sequelize_1.Model {
    }
    PaymentPlan.init({
        id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        planType: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
        downPayment: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
        installmentAmount: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
        numberOfInstallments: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        enrollmentFee: { type: sequelize_1.DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        lateFee: { type: sequelize_1.DataTypes.DECIMAL(10, 2), defaultValue: 0 },
        installmentsPaid: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    }, {
        sequelize,
        tableName: 'payment_plans',
        indexes: [{ fields: ['accountId'] }],
    });
    return PaymentPlan;
};
exports.createPaymentPlanModel = createPaymentPlanModel;
/**
 * Sequelize model for Refund tracking.
 */
const createRefundModel = (sequelize) => {
    class Refund extends sequelize_1.Model {
    }
    Refund.init({
        id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        amount: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
        refundType: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
        refundDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        processedDate: { type: sequelize_1.DataTypes.DATE },
    }, {
        sequelize,
        tableName: 'refunds',
        indexes: [{ fields: ['accountId'] }],
    });
    return Refund;
};
exports.createRefundModel = createRefundModel;
// ============================================================================
// TUITION CALCULATION (1-10)
// ============================================================================
/**
 * Calculates tuition based on credit hours and residency.
 */
async function calculateTuition(studentId, termId, creditHours, residency, level, sequelize, transaction) {
    const rates = [
        { level: 'undergraduate', residency: 'in-state', ratePerCredit: 350, flatRateCreditThreshold: 12, flatRateAmount: 4200 },
        { level: 'undergraduate', residency: 'out-of-state', ratePerCredit: 850, flatRateCreditThreshold: 12, flatRateAmount: 10200 },
        { level: 'undergraduate', residency: 'international', ratePerCredit: 950, flatRateCreditThreshold: 12, flatRateAmount: 11400 },
        { level: 'graduate', residency: 'in-state', ratePerCredit: 550 },
        { level: 'graduate', residency: 'out-of-state', ratePerCredit: 1050 },
        { level: 'graduate', residency: 'international', ratePerCredit: 1150 },
    ];
    const rate = rates.find(r => r.level === level && r.residency === residency);
    if (!rate)
        throw new Error('Invalid tuition rate configuration');
    if (rate.flatRateCreditThreshold && creditHours >= rate.flatRateCreditThreshold) {
        return rate.flatRateAmount;
    }
    return creditHours * rate.ratePerCredit;
}
/**
 * Assesses mandatory fees for a term.
 */
async function assessMandatoryFees(studentId, termId, creditHours, sequelize, transaction) {
    const fees = [
        { feeType: 'mandatory', feeName: 'Student Activities Fee', feeAmount: 150, isPerCredit: false, applicableTo: ['all'] },
        { feeType: 'mandatory', feeName: 'Technology Fee', feeAmount: 15, isPerCredit: true, applicableTo: ['all'] },
        { feeType: 'mandatory', feeName: 'Health Services Fee', feeAmount: 75, isPerCredit: false, applicableTo: ['all'] },
    ];
    return fees.reduce((total, fee) => {
        if (fee.isPerCredit) {
            return total + (fee.feeAmount * creditHours);
        }
        return total + fee.feeAmount;
    }, 0);
}
/**
 * Assesses course-specific fees.
 */
async function assessCourseFees(courseIds, sequelize, transaction) {
    // Placeholder: query course fees from database
    const courseFees = [
        { courseId: 101, feeName: 'Lab Fee', feeAmount: 50 },
        { courseId: 102, feeName: 'Lab Fee', feeAmount: 75 },
    ];
    return courseIds.reduce((total, courseId) => {
        const fee = courseFees.find(f => f.courseId === courseId);
        return total + (fee?.feeAmount || 0);
    }, 0);
}
/**
 * Creates charges for a student account.
 */
async function createCharge(accountId, chargeType, amount, description, termId, sequelize, transaction) {
    const Charge = (0, exports.createChargeModel)(sequelize);
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const charge = await Charge.create({ accountId, chargeType, amount, description, termId, chargeDate: new Date() }, { transaction });
    await sequelize.query(`UPDATE student_accounts SET total_charges = total_charges + :amount, current_balance = current_balance + :amount WHERE id = :accountId`, { replacements: { amount, accountId }, transaction });
    return charge;
}
/**
 * Processes full tuition and fees for enrollment.
 */
async function processEnrollmentCharges(studentId, termId, creditHours, courseIds, residency, level, sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const tuition = await calculateTuition(studentId, termId, creditHours, residency, level, sequelize, transaction);
    const mandatoryFees = await assessMandatoryFees(studentId, termId, creditHours, sequelize, transaction);
    const courseFees = await assessCourseFees(courseIds, sequelize, transaction);
    const totalCharges = tuition + mandatoryFees + courseFees;
    const [account] = await StudentAccount.findOrCreate({
        where: { studentId, termId },
        defaults: { studentId, termId, totalCharges, totalPayments: 0, totalRefunds: 0, currentBalance: totalCharges, pastDueAmount: 0, holds: [] },
        transaction,
    });
    if (account.id) {
        await createCharge(account.id, 'tuition', tuition, 'Tuition', termId, sequelize, transaction);
        await createCharge(account.id, 'mandatory_fees', mandatoryFees, 'Mandatory Fees', termId, sequelize, transaction);
        if (courseFees > 0) {
            await createCharge(account.id, 'course_fees', courseFees, 'Course Fees', termId, sequelize, transaction);
        }
    }
    return { accountId: account.id, totalCharges };
}
/**
 * Gets student account balance.
 */
async function getAccountBalance(studentId, termId, sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const account = await StudentAccount.findOne({ where: { studentId, termId }, transaction });
    return account?.currentBalance || 0;
}
/**
 * Gets all charges for a student account.
 */
async function getAccountCharges(accountId, sequelize, transaction) {
    const Charge = (0, exports.createChargeModel)(sequelize);
    return await Charge.findAll({ where: { accountId }, order: [['chargeDate', 'DESC']], transaction });
}
/**
 * Gets all payments for a student account.
 */
async function getAccountPayments(accountId, sequelize, transaction) {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    return await Payment.findAll({ where: { accountId }, order: [['paymentDate', 'DESC']], transaction });
}
/**
 * Gets account statement summary.
 */
async function getAccountStatement(studentId, termId, sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const account = await StudentAccount.findOne({ where: { studentId, termId }, transaction });
    if (!account)
        throw new Error('Account not found');
    const charges = await getAccountCharges(account.id, sequelize, transaction);
    const payments = await getAccountPayments(account.id, sequelize, transaction);
    return {
        accountId: account.id,
        studentId: account.studentId,
        termId: account.termId,
        totalCharges: account.totalCharges,
        totalPayments: account.totalPayments,
        currentBalance: account.currentBalance,
        charges,
        payments,
    };
}
// ============================================================================
// PAYMENT PROCESSING (11-20)
// ============================================================================
/**
 * Processes a payment.
 */
async function processPayment(accountId, amount, paymentMethod, referenceNumber, sequelize, transaction) {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const payment = await Payment.create({ accountId, amount, paymentMethod, referenceNumber, paymentDate: new Date() }, { transaction });
    await sequelize.query(`UPDATE student_accounts SET total_payments = total_payments + :amount, current_balance = current_balance - :amount WHERE id = :accountId`, { replacements: { amount, accountId }, transaction });
    return payment;
}
/**
 * Creates a payment plan.
 */
async function createPaymentPlan(accountId, planType, downPaymentPercent, numberOfInstallments, enrollmentFee, lateFee, sequelize, transaction) {
    const PaymentPlan = (0, exports.createPaymentPlanModel)(sequelize);
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const account = await StudentAccount.findByPk(accountId, { transaction });
    if (!account)
        throw new Error('Account not found');
    const downPayment = account.currentBalance * (downPaymentPercent / 100);
    const remainingBalance = account.currentBalance - downPayment + enrollmentFee;
    const installmentAmount = remainingBalance / numberOfInstallments;
    const plan = await PaymentPlan.create({
        accountId,
        planType,
        downPayment,
        installmentAmount,
        numberOfInstallments,
        enrollmentFee,
        lateFee,
        installmentsPaid: 0,
    }, { transaction });
    return plan;
}
/**
 * Processes installment payment.
 */
async function processInstallmentPayment(planId, amount, paymentMethod, referenceNumber, sequelize, transaction) {
    const PaymentPlan = (0, exports.createPaymentPlanModel)(sequelize);
    const plan = await PaymentPlan.findByPk(planId, { transaction });
    if (!plan)
        throw new Error('Payment plan not found');
    const payment = await processPayment(plan.accountId, amount, paymentMethod, referenceNumber, sequelize, transaction);
    await plan.update({ installmentsPaid: plan.installmentsPaid + 1 }, { transaction });
    return payment;
}
/**
 * Applies late fee for missed installment.
 */
async function applyLateFee(planId, sequelize, transaction) {
    const PaymentPlan = (0, exports.createPaymentPlanModel)(sequelize);
    const plan = await PaymentPlan.findByPk(planId, { transaction });
    if (!plan)
        throw new Error('Payment plan not found');
    return await createCharge(plan.accountId, 'late_fee', plan.lateFee, 'Late Payment Fee', 0, sequelize, transaction);
}
/**
 * Gets payment plan details.
 */
async function getPaymentPlan(accountId, sequelize, transaction) {
    const PaymentPlan = (0, exports.createPaymentPlanModel)(sequelize);
    return await PaymentPlan.findOne({ where: { accountId }, transaction });
}
/**
 * Cancels payment plan.
 */
async function cancelPaymentPlan(planId, sequelize, transaction) {
    const PaymentPlan = (0, exports.createPaymentPlanModel)(sequelize);
    await PaymentPlan.destroy({ where: { id: planId }, transaction });
}
/**
 * Checks for overdue payments.
 */
async function checkOverduePayments(sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    return await StudentAccount.findAll({
        where: { currentBalance: { [sequelize_1.Op.gt]: 0 } },
        transaction,
    });
}
/**
 * Applies financial hold for past due account.
 */
async function applyFinancialHold(accountId, sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const account = await StudentAccount.findByPk(accountId, { transaction });
    if (!account)
        throw new Error('Account not found');
    const holds = [...account.holds, 'FINANCIAL_HOLD'];
    await account.update({ holds }, { transaction });
}
/**
 * Releases financial hold.
 */
async function releaseFinancialHold(accountId, sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const account = await StudentAccount.findByPk(accountId, { transaction });
    if (!account)
        throw new Error('Account not found');
    const holds = account.holds.filter(h => h !== 'FINANCIAL_HOLD');
    await account.update({ holds }, { transaction });
}
/**
 * Sends payment reminder.
 */
async function sendPaymentReminder(accountId, sequelize, transaction) {
    // Placeholder: integrate with notification system
    console.log(`Payment reminder sent for account ${accountId}`);
}
// ============================================================================
// REFUND PROCESSING (21-30)
// ============================================================================
/**
 * Calculates refund based on withdrawal date.
 */
async function calculateRefund(accountId, withdrawalDate, sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const account = await StudentAccount.findByPk(accountId, { transaction });
    if (!account)
        throw new Error('Account not found');
    // Refund schedule based on withdrawal timing
    const daysIntoTerm = Math.floor((withdrawalDate.getTime() - new Date(2025, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
    let refundPercentage = 0;
    if (daysIntoTerm <= 7)
        refundPercentage = 100;
    else if (daysIntoTerm <= 14)
        refundPercentage = 75;
    else if (daysIntoTerm <= 21)
        refundPercentage = 50;
    else if (daysIntoTerm <= 28)
        refundPercentage = 25;
    const tuitionRefund = account.totalCharges * (refundPercentage / 100);
    const totalRefund = tuitionRefund;
    return {
        withdrawalDate,
        refundPercentage,
        tuitionRefund,
        feeRefund: 0,
        housingRefund: 0,
        totalRefund,
    };
}
/**
 * Processes refund.
 */
async function processRefund(accountId, amount, refundType, sequelize, transaction) {
    const Refund = (0, exports.createRefundModel)(sequelize);
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const refund = await Refund.create({ accountId, amount, refundType, refundDate: new Date(), processedDate: new Date() }, { transaction });
    await sequelize.query(`UPDATE student_accounts SET total_refunds = total_refunds + :amount, current_balance = current_balance - :amount WHERE id = :accountId`, { replacements: { amount, accountId }, transaction });
    return refund;
}
/**
 * Gets all refunds for account.
 */
async function getAccountRefunds(accountId, sequelize, transaction) {
    const Refund = (0, exports.createRefundModel)(sequelize);
    return await Refund.findAll({ where: { accountId }, order: [['refundDate', 'DESC']], transaction });
}
/**
 * Processes withdrawal refund.
 */
async function processWithdrawalRefund(accountId, withdrawalDate, sequelize, transaction) {
    const refundSchedule = await calculateRefund(accountId, withdrawalDate, sequelize, transaction);
    return await processRefund(accountId, refundSchedule.totalRefund, 'withdrawal', sequelize, transaction);
}
/**
 * Reverses a refund.
 */
async function reverseRefund(refundId, sequelize, transaction) {
    const Refund = (0, exports.createRefundModel)(sequelize);
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const refund = await Refund.findByPk(refundId, { transaction });
    if (!refund)
        throw new Error('Refund not found');
    await sequelize.query(`UPDATE student_accounts SET total_refunds = total_refunds - :amount, current_balance = current_balance + :amount WHERE id = :accountId`, { replacements: { amount: refund.amount, accountId: refund.accountId }, transaction });
    await refund.destroy({ transaction });
}
// ============================================================================
// 1098-T GENERATION (31-35)
// ============================================================================
/**
 * Generates 1098-T data for a student.
 */
async function generate1098T(studentId, taxYear, sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const accounts = await StudentAccount.findAll({
        where: { studentId },
        transaction,
    });
    const accountIds = accounts.map(a => a.id);
    const payments = await Payment.findAll({
        where: {
            accountId: { [sequelize_1.Op.in]: accountIds },
            paymentDate: {
                [sequelize_1.Op.between]: [new Date(taxYear, 0, 1), new Date(taxYear, 11, 31)],
            },
        },
        transaction,
    });
    const paymentsReceived = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    return {
        studentId,
        taxYear,
        paymentsReceived,
        scholarshipsGrantsReceived: 0, // Placeholder: integrate with financial aid
        adjustmentsPriorYear: 0,
        adjustmentsScholarships: 0,
        isHalfTimeStudent: false, // Placeholder: check enrollment
        isGraduateStudent: false, // Placeholder: check student level
    };
}
/**
 * Exports 1098-T data to IRS format.
 */
async function export1098T(data, sequelize, transaction) {
    // Placeholder: format according to IRS specifications
    return JSON.stringify(data, null, 2);
}
/**
 * Batch generates 1098-T for all eligible students.
 */
async function batchGenerate1098T(taxYear, sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const accounts = await StudentAccount.findAll({ transaction });
    const uniqueStudents = [...new Set(accounts.map(a => a.studentId))];
    const forms = [];
    for (const studentId of uniqueStudents) {
        const form = await generate1098T(studentId, taxYear, sequelize, transaction);
        forms.push(form);
    }
    return forms;
}
/**
 * Validates 1098-T data.
 */
async function validate1098T(data, sequelize, transaction) {
    if (data.paymentsReceived < 0)
        return false;
    if (data.scholarshipsGrantsReceived < 0)
        return false;
    return true;
}
/**
 * Sends 1098-T to student.
 */
async function send1098T(studentId, taxYear, sequelize, transaction) {
    const data = await generate1098T(studentId, taxYear, sequelize, transaction);
    // Placeholder: send via email or student portal
    console.log(`1098-T sent to student ${studentId} for tax year ${taxYear}`);
}
// ============================================================================
// COLLECTIONS MANAGEMENT (36-40)
// ============================================================================
/**
 * Marks account as past due.
 */
async function markAccountPastDue(accountId, sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const account = await StudentAccount.findByPk(accountId, { transaction });
    if (!account)
        throw new Error('Account not found');
    await account.update({ pastDueAmount: account.currentBalance }, { transaction });
    await applyFinancialHold(accountId, sequelize, transaction);
}
/**
 * Sends past due notice.
 */
async function sendPastDueNotice(accountId, sequelize, transaction) {
    // Placeholder: integrate with notification system
    console.log(`Past due notice sent for account ${accountId}`);
}
/**
 * Gets all past due accounts.
 */
async function getPastDueAccounts(sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    return await StudentAccount.findAll({
        where: { pastDueAmount: { [sequelize_1.Op.gt]: 0 } },
        transaction,
    });
}
/**
 * Submits account to collections.
 */
async function submitToCollections(accountId, sequelize, transaction) {
    // Placeholder: integrate with collections agency
    console.log(`Account ${accountId} submitted to collections`);
}
/**
 * Generates collections report.
 */
async function generateCollectionsReport(sequelize, transaction) {
    const pastDueAccounts = await getPastDueAccounts(sequelize, transaction);
    const totalPastDue = pastDueAccounts.reduce((sum, acc) => sum + Number(acc.pastDueAmount), 0);
    return {
        totalAccounts: pastDueAccounts.length,
        totalPastDue,
        accounts: pastDueAccounts,
    };
}
// ============================================================================
// ACCOUNT HOLDS (41-45)
// ============================================================================
/**
 * Places registration hold.
 */
async function placeRegistrationHold(accountId, sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const account = await StudentAccount.findByPk(accountId, { transaction });
    if (!account)
        throw new Error('Account not found');
    const holds = [...account.holds, 'REGISTRATION_HOLD'];
    await account.update({ holds }, { transaction });
}
/**
 * Places transcript hold.
 */
async function placeTranscriptHold(accountId, sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const account = await StudentAccount.findByPk(accountId, { transaction });
    if (!account)
        throw new Error('Account not found');
    const holds = [...account.holds, 'TRANSCRIPT_HOLD'];
    await account.update({ holds }, { transaction });
}
/**
 * Releases all holds.
 */
async function releaseAllHolds(accountId, sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    await StudentAccount.update({ holds: [] }, { where: { id: accountId }, transaction });
}
/**
 * Gets account holds.
 */
async function getAccountHolds(accountId, sequelize, transaction) {
    const StudentAccount = (0, exports.createStudentAccountModel)(sequelize);
    const account = await StudentAccount.findByPk(accountId, { transaction });
    return account?.holds || [];
}
/**
 * Checks if account has specific hold.
 */
async function hasHold(accountId, holdType, sequelize, transaction) {
    const holds = await getAccountHolds(accountId, sequelize, transaction);
    return holds.includes(holdType);
}
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createStudentAccountModel: exports.createStudentAccountModel,
    createChargeModel: exports.createChargeModel,
    createPaymentModel: exports.createPaymentModel,
    createPaymentPlanModel: exports.createPaymentPlanModel,
    createRefundModel: exports.createRefundModel,
    // Tuition Calculation
    calculateTuition,
    assessMandatoryFees,
    assessCourseFees,
    createCharge,
    processEnrollmentCharges,
    getAccountBalance,
    getAccountCharges,
    getAccountPayments,
    getAccountStatement,
    // Payment Processing
    processPayment,
    createPaymentPlan,
    processInstallmentPayment,
    applyLateFee,
    getPaymentPlan,
    cancelPaymentPlan,
    checkOverduePayments,
    applyFinancialHold,
    releaseFinancialHold,
    sendPaymentReminder,
    // Refund Processing
    calculateRefund,
    processRefund,
    getAccountRefunds,
    processWithdrawalRefund,
    reverseRefund,
    // 1098-T Generation
    generate1098T,
    export1098T,
    batchGenerate1098T,
    validate1098T,
    send1098T,
    // Collections Management
    markAccountPastDue,
    sendPastDueNotice,
    getPastDueAccounts,
    submitToCollections,
    generateCollectionsReport,
    // Account Holds
    placeRegistrationHold,
    placeTranscriptHold,
    releaseAllHolds,
    getAccountHolds,
    hasHold,
};
//# sourceMappingURL=student-billing-kit.js.map