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
import { Sequelize, Transaction } from 'sequelize';
interface RefundSchedule {
    withdrawalDate: Date;
    refundPercentage: number;
    tuitionRefund: number;
    feeRefund: number;
    housingRefund: number;
    totalRefund: number;
}
interface Form1098TData {
    studentId: number;
    taxYear: number;
    paymentsReceived: number;
    scholarshipsGrantsReceived: number;
    adjustmentsPriorYear: number;
    adjustmentsScholarships: number;
    isHalfTimeStudent: boolean;
    isGraduateStudent: boolean;
}
export declare class CreateChargeDto {
    studentId: number;
    chargeType: string;
    amount: number;
    description: string;
    termId: number;
}
export declare class ProcessPaymentDto {
    accountId: number;
    amount: number;
    paymentMethod: string;
    referenceNumber: string;
}
/**
 * Sequelize model for Student Account with balance tracking.
 */
export declare const createStudentAccountModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        studentId: number;
        termId: number;
        totalCharges: number;
        totalPayments: number;
        totalRefunds: number;
        currentBalance: number;
        pastDueAmount: number;
        holds: string[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Charge tracking.
 */
export declare const createChargeModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        accountId: number;
        chargeType: string;
        amount: number;
        description: string;
        chargeDate: Date;
        termId: number;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Payment tracking.
 */
export declare const createPaymentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        accountId: number;
        amount: number;
        paymentMethod: string;
        paymentDate: Date;
        referenceNumber: string;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Payment Plan tracking.
 */
export declare const createPaymentPlanModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        accountId: number;
        planType: string;
        downPayment: number;
        installmentAmount: number;
        numberOfInstallments: number;
        enrollmentFee: number;
        lateFee: number;
        installmentsPaid: number;
        readonly createdAt: Date;
    };
};
/**
 * Sequelize model for Refund tracking.
 */
export declare const createRefundModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        accountId: number;
        amount: number;
        refundType: string;
        refundDate: Date;
        processedDate: Date;
        readonly createdAt: Date;
    };
};
/**
 * Calculates tuition based on credit hours and residency.
 */
export declare function calculateTuition(studentId: number, termId: number, creditHours: number, residency: 'in-state' | 'out-of-state' | 'international', level: 'undergraduate' | 'graduate' | 'doctoral', sequelize: Sequelize, transaction?: Transaction): Promise<number>;
/**
 * Assesses mandatory fees for a term.
 */
export declare function assessMandatoryFees(studentId: number, termId: number, creditHours: number, sequelize: Sequelize, transaction?: Transaction): Promise<number>;
/**
 * Assesses course-specific fees.
 */
export declare function assessCourseFees(courseIds: number[], sequelize: Sequelize, transaction?: Transaction): Promise<number>;
/**
 * Creates charges for a student account.
 */
export declare function createCharge(accountId: number, chargeType: string, amount: number, description: string, termId: number, sequelize: Sequelize, transaction?: Transaction): Promise<any>;
/**
 * Processes full tuition and fees for enrollment.
 */
export declare function processEnrollmentCharges(studentId: number, termId: number, creditHours: number, courseIds: number[], residency: 'in-state' | 'out-of-state' | 'international', level: 'undergraduate' | 'graduate' | 'doctoral', sequelize: Sequelize, transaction?: Transaction): Promise<{
    accountId: number;
    totalCharges: number;
}>;
/**
 * Gets student account balance.
 */
export declare function getAccountBalance(studentId: number, termId: number, sequelize: Sequelize, transaction?: Transaction): Promise<number>;
/**
 * Gets all charges for a student account.
 */
export declare function getAccountCharges(accountId: number, sequelize: Sequelize, transaction?: Transaction): Promise<any[]>;
/**
 * Gets all payments for a student account.
 */
export declare function getAccountPayments(accountId: number, sequelize: Sequelize, transaction?: Transaction): Promise<any[]>;
/**
 * Gets account statement summary.
 */
export declare function getAccountStatement(studentId: number, termId: number, sequelize: Sequelize, transaction?: Transaction): Promise<any>;
/**
 * Processes a payment.
 */
export declare function processPayment(accountId: number, amount: number, paymentMethod: string, referenceNumber: string, sequelize: Sequelize, transaction?: Transaction): Promise<any>;
/**
 * Creates a payment plan.
 */
export declare function createPaymentPlan(accountId: number, planType: string, downPaymentPercent: number, numberOfInstallments: number, enrollmentFee: number, lateFee: number, sequelize: Sequelize, transaction?: Transaction): Promise<any>;
/**
 * Processes installment payment.
 */
export declare function processInstallmentPayment(planId: number, amount: number, paymentMethod: string, referenceNumber: string, sequelize: Sequelize, transaction?: Transaction): Promise<any>;
/**
 * Applies late fee for missed installment.
 */
export declare function applyLateFee(planId: number, sequelize: Sequelize, transaction?: Transaction): Promise<any>;
/**
 * Gets payment plan details.
 */
export declare function getPaymentPlan(accountId: number, sequelize: Sequelize, transaction?: Transaction): Promise<any>;
/**
 * Cancels payment plan.
 */
export declare function cancelPaymentPlan(planId: number, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Checks for overdue payments.
 */
export declare function checkOverduePayments(sequelize: Sequelize, transaction?: Transaction): Promise<any[]>;
/**
 * Applies financial hold for past due account.
 */
export declare function applyFinancialHold(accountId: number, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Releases financial hold.
 */
export declare function releaseFinancialHold(accountId: number, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Sends payment reminder.
 */
export declare function sendPaymentReminder(accountId: number, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Calculates refund based on withdrawal date.
 */
export declare function calculateRefund(accountId: number, withdrawalDate: Date, sequelize: Sequelize, transaction?: Transaction): Promise<RefundSchedule>;
/**
 * Processes refund.
 */
export declare function processRefund(accountId: number, amount: number, refundType: string, sequelize: Sequelize, transaction?: Transaction): Promise<any>;
/**
 * Gets all refunds for account.
 */
export declare function getAccountRefunds(accountId: number, sequelize: Sequelize, transaction?: Transaction): Promise<any[]>;
/**
 * Processes withdrawal refund.
 */
export declare function processWithdrawalRefund(accountId: number, withdrawalDate: Date, sequelize: Sequelize, transaction?: Transaction): Promise<any>;
/**
 * Reverses a refund.
 */
export declare function reverseRefund(refundId: number, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Generates 1098-T data for a student.
 */
export declare function generate1098T(studentId: number, taxYear: number, sequelize: Sequelize, transaction?: Transaction): Promise<Form1098TData>;
/**
 * Exports 1098-T data to IRS format.
 */
export declare function export1098T(data: Form1098TData, sequelize: Sequelize, transaction?: Transaction): Promise<string>;
/**
 * Batch generates 1098-T for all eligible students.
 */
export declare function batchGenerate1098T(taxYear: number, sequelize: Sequelize, transaction?: Transaction): Promise<Form1098TData[]>;
/**
 * Validates 1098-T data.
 */
export declare function validate1098T(data: Form1098TData, sequelize: Sequelize, transaction?: Transaction): Promise<boolean>;
/**
 * Sends 1098-T to student.
 */
export declare function send1098T(studentId: number, taxYear: number, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Marks account as past due.
 */
export declare function markAccountPastDue(accountId: number, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Sends past due notice.
 */
export declare function sendPastDueNotice(accountId: number, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Gets all past due accounts.
 */
export declare function getPastDueAccounts(sequelize: Sequelize, transaction?: Transaction): Promise<any[]>;
/**
 * Submits account to collections.
 */
export declare function submitToCollections(accountId: number, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Generates collections report.
 */
export declare function generateCollectionsReport(sequelize: Sequelize, transaction?: Transaction): Promise<any>;
/**
 * Places registration hold.
 */
export declare function placeRegistrationHold(accountId: number, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Places transcript hold.
 */
export declare function placeTranscriptHold(accountId: number, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Releases all holds.
 */
export declare function releaseAllHolds(accountId: number, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Gets account holds.
 */
export declare function getAccountHolds(accountId: number, sequelize: Sequelize, transaction?: Transaction): Promise<string[]>;
/**
 * Checks if account has specific hold.
 */
export declare function hasHold(accountId: number, holdType: string, sequelize: Sequelize, transaction?: Transaction): Promise<boolean>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createStudentAccountModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            studentId: number;
            termId: number;
            totalCharges: number;
            totalPayments: number;
            totalRefunds: number;
            currentBalance: number;
            pastDueAmount: number;
            holds: string[];
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createChargeModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            accountId: number;
            chargeType: string;
            amount: number;
            description: string;
            chargeDate: Date;
            termId: number;
            readonly createdAt: Date;
        };
    };
    createPaymentModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            accountId: number;
            amount: number;
            paymentMethod: string;
            paymentDate: Date;
            referenceNumber: string;
            readonly createdAt: Date;
        };
    };
    createPaymentPlanModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            accountId: number;
            planType: string;
            downPayment: number;
            installmentAmount: number;
            numberOfInstallments: number;
            enrollmentFee: number;
            lateFee: number;
            installmentsPaid: number;
            readonly createdAt: Date;
        };
    };
    createRefundModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            accountId: number;
            amount: number;
            refundType: string;
            refundDate: Date;
            processedDate: Date;
            readonly createdAt: Date;
        };
    };
    calculateTuition: typeof calculateTuition;
    assessMandatoryFees: typeof assessMandatoryFees;
    assessCourseFees: typeof assessCourseFees;
    createCharge: typeof createCharge;
    processEnrollmentCharges: typeof processEnrollmentCharges;
    getAccountBalance: typeof getAccountBalance;
    getAccountCharges: typeof getAccountCharges;
    getAccountPayments: typeof getAccountPayments;
    getAccountStatement: typeof getAccountStatement;
    processPayment: typeof processPayment;
    createPaymentPlan: typeof createPaymentPlan;
    processInstallmentPayment: typeof processInstallmentPayment;
    applyLateFee: typeof applyLateFee;
    getPaymentPlan: typeof getPaymentPlan;
    cancelPaymentPlan: typeof cancelPaymentPlan;
    checkOverduePayments: typeof checkOverduePayments;
    applyFinancialHold: typeof applyFinancialHold;
    releaseFinancialHold: typeof releaseFinancialHold;
    sendPaymentReminder: typeof sendPaymentReminder;
    calculateRefund: typeof calculateRefund;
    processRefund: typeof processRefund;
    getAccountRefunds: typeof getAccountRefunds;
    processWithdrawalRefund: typeof processWithdrawalRefund;
    reverseRefund: typeof reverseRefund;
    generate1098T: typeof generate1098T;
    export1098T: typeof export1098T;
    batchGenerate1098T: typeof batchGenerate1098T;
    validate1098T: typeof validate1098T;
    send1098T: typeof send1098T;
    markAccountPastDue: typeof markAccountPastDue;
    sendPastDueNotice: typeof sendPastDueNotice;
    getPastDueAccounts: typeof getPastDueAccounts;
    submitToCollections: typeof submitToCollections;
    generateCollectionsReport: typeof generateCollectionsReport;
    placeRegistrationHold: typeof placeRegistrationHold;
    placeTranscriptHold: typeof placeTranscriptHold;
    releaseAllHolds: typeof releaseAllHolds;
    getAccountHolds: typeof getAccountHolds;
    hasHold: typeof hasHold;
};
export default _default;
//# sourceMappingURL=student-billing-kit.d.ts.map