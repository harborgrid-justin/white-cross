/**
 * LOC: EDU-COMP-BILLING-001
 * File: /reuse/education/composites/student-billing-accounts-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../student-billing-kit
 *   - ../student-enrollment-kit
 *   - ../student-records-kit
 *   - ../financial-aid-kit
 *
 * DOWNSTREAM (imported by):
 *   - Bursar office controllers
 *   - Student financial services
 *   - Payment processing modules
 *   - Collections management systems
 *   - Student account portals
 */
import { Sequelize } from 'sequelize';
/**
 * Student account status
 */
export type AccountStatus = 'active' | 'suspended' | 'hold' | 'collections' | 'closed';
/**
 * Payment method types
 */
export type PaymentMethod = 'credit_card' | 'debit_card' | 'ach' | 'check' | 'cash' | 'wire' | 'financial_aid';
/**
 * Charge types
 */
export type ChargeType = 'tuition' | 'fees' | 'housing' | 'meal_plan' | 'parking' | 'health' | 'technology' | 'lab' | 'other';
/**
 * Refund status
 */
export type RefundStatus = 'pending' | 'approved' | 'processing' | 'issued' | 'rejected';
/**
 * Collection status
 */
export type CollectionStatus = 'not_in_collections' | 'pending_review' | 'in_collections' | 'payment_plan' | 'settled' | 'written_off';
/**
 * Student account information
 */
export interface StudentAccountData {
    studentId: string;
    accountNumber: string;
    accountStatus: AccountStatus;
    currentBalance: number;
    totalCharges: number;
    totalPayments: number;
    totalCredits: number;
    totalRefunds: number;
    pastDueBalance: number;
    financialHold: boolean;
    registrationHold: boolean;
    transcriptHold: boolean;
    diplomaHold: boolean;
    lastPaymentDate?: Date;
    lastPaymentAmount?: number;
    paymentPlanActive: boolean;
    inCollections: boolean;
    collectionStatus?: CollectionStatus;
}
/**
 * Tuition calculation data
 */
export interface TuitionCalculation {
    studentId: string;
    termId: string;
    academicYear: string;
    creditHours: number;
    level: 'undergraduate' | 'graduate' | 'doctoral';
    residency: 'in-state' | 'out-of-state' | 'international';
    program?: string;
    ratePerCredit: number;
    flatRateThreshold?: number;
    flatRateAmount?: number;
    tuitionAmount: number;
    discounts: number;
    scholarships: number;
    netTuition: number;
}
/**
 * Fee assessment data
 */
export interface FeeAssessment {
    feeId: string;
    studentId: string;
    termId: string;
    feeType: ChargeType;
    feeName: string;
    feeAmount: number;
    isRequired: boolean;
    isPerCredit: boolean;
    creditHours?: number;
    assessedDate: Date;
    dueDate?: Date;
    waived: boolean;
    waiverReason?: string;
}
/**
 * Payment data
 */
export interface PaymentData {
    paymentId: string;
    studentId: string;
    accountNumber: string;
    paymentMethod: PaymentMethod;
    paymentAmount: number;
    paymentDate: Date;
    referenceNumber?: string;
    checkNumber?: string;
    transactionId?: string;
    processedBy: string;
    notes?: string;
    allocations: Array<{
        chargeId: string;
        allocatedAmount: number;
    }>;
}
/**
 * Payment plan configuration
 */
export interface PaymentPlanConfig {
    planId: string;
    planName: string;
    studentId: string;
    termId: string;
    totalAmount: number;
    downPaymentAmount: number;
    downPaymentDueDate: Date;
    numberOfInstallments: number;
    installmentAmount: number;
    enrollmentFee: number;
    lateFee: number;
    interestRate: number;
    installmentDates: Date[];
    autoPayEnabled: boolean;
    status: 'active' | 'complete' | 'cancelled' | 'defaulted';
}
/**
 * Refund calculation data
 */
export interface RefundCalculation {
    studentId: string;
    termId: string;
    withdrawalDate: Date;
    totalCharges: number;
    totalPayments: number;
    totalFinancialAid: number;
    refundPercentage: number;
    tuitionRefund: number;
    feeRefund: number;
    housingRefund: number;
    mealPlanRefund: number;
    totalRefund: number;
    refundMethod: 'original_payment' | 'check' | 'direct_deposit';
    refundStatus: RefundStatus;
}
/**
 * Form 1098-T tax data
 */
export interface Form1098TData {
    studentId: string;
    taxYear: number;
    firstName: string;
    lastName: string;
    middleInitial?: string;
    ssn?: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    box1PaymentsReceived: number;
    box2PriorYearAdjustments: number;
    box4AdjustmentsPriorYear: number;
    box5Scholarships: number;
    box6PriorYearScholarships: number;
    box7CheckedIfAmountInBox1: boolean;
    box8CheckedIfHalfTime: boolean;
    box9CheckedIfGraduate: boolean;
    electronicConsentProvided: boolean;
    generatedDate: Date;
}
/**
 * Account hold data
 */
export interface AccountHold {
    holdId: string;
    studentId: string;
    holdType: 'financial' | 'registration' | 'transcript' | 'diploma' | 'library' | 'conduct' | 'parking';
    holdReason: string;
    holdAmount?: number;
    appliedDate: Date;
    appliedBy: string;
    clearedDate?: Date;
    clearedBy?: string;
    active: boolean;
    notes?: string;
}
/**
 * Collections account data
 */
export interface CollectionsAccount {
    collectionId: string;
    studentId: string;
    accountNumber: string;
    originalBalance: number;
    currentBalance: number;
    collectionStatus: CollectionStatus;
    assignedDate: Date;
    assignedTo?: string;
    agencyName?: string;
    lastContactDate?: Date;
    paymentArrangementActive: boolean;
    settlementAmount?: number;
    notes?: string[];
}
/**
 * Statement data
 */
export interface AccountStatement {
    statementId: string;
    studentId: string;
    accountNumber: string;
    statementDate: Date;
    dueDate: Date;
    previousBalance: number;
    charges: Array<{
        date: Date;
        description: string;
        amount: number;
    }>;
    payments: Array<{
        date: Date;
        description: string;
        amount: number;
    }>;
    currentBalance: number;
    minimumPaymentDue: number;
    pastDueAmount: number;
}
/**
 * Sequelize model for Student Account with balance tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     StudentAccount:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         accountNumber:
 *           type: string
 *         accountStatus:
 *           type: string
 *           enum: [active, suspended, hold, collections, closed]
 *         currentBalance:
 *           type: number
 *         financialHold:
 *           type: boolean
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} StudentAccount model
 *
 * @example
 * ```typescript
 * const StudentAccount = createStudentAccountModel(sequelize);
 * const account = await StudentAccount.create({
 *   studentId: 'STU123456',
 *   accountNumber: 'ACC-2024-001234',
 *   accountStatus: 'active',
 *   currentBalance: 15000.00
 * });
 * ```
 */
export declare const createStudentAccountModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        accountNumber: string;
        accountStatus: AccountStatus;
        currentBalance: number;
        totalCharges: number;
        totalPayments: number;
        totalCredits: number;
        financialHold: boolean;
        registrationHold: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Student Charges.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     StudentCharge:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         chargeType:
 *           type: string
 *         amount:
 *           type: number
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} StudentCharge model
 */
export declare const createStudentChargeModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        termId: string;
        chargeType: ChargeType;
        chargeDescription: string;
        chargeAmount: number;
        chargeDate: Date;
        dueDate: Date;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Student Payments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} StudentPayment model
 */
export declare const createStudentPaymentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        paymentMethod: PaymentMethod;
        paymentAmount: number;
        paymentDate: Date;
        transactionId: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Payment Plans.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PaymentPlan model
 */
export declare const createPaymentPlanModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        planName: string;
        totalAmount: number;
        downPaymentAmount: number;
        numberOfInstallments: number;
        status: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Account Holds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AccountHoldModel model
 */
export declare const createAccountHoldModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        holdType: string;
        holdReason: string;
        holdAmount: number;
        active: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Student Billing & Accounts Composite Service
 *
 * Provides comprehensive billing, payments, refunds, collections, and account management
 * for higher education student information systems.
 */
export declare class StudentBillingAccountsCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Creates a new student account with initial setup.
     *
     * @param {string} studentId - Student identifier
     * @param {string} academicYear - Academic year
     * @returns {Promise<StudentAccountData>} Created account
     *
     * @example
     * ```typescript
     * const account = await service.createStudentAccount('STU123456', '2024-2025');
     * console.log(`Account created: ${account.accountNumber}`);
     * ```
     */
    createStudentAccount(studentId: string, academicYear: string): Promise<StudentAccountData>;
    /**
     * 2. Retrieves student account with all balances and holds.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<StudentAccountData>} Account data
     *
     * @example
     * ```typescript
     * const account = await service.getStudentAccount('STU123456');
     * console.log(`Current balance: $${account.currentBalance}`);
     * ```
     */
    getStudentAccount(studentId: string): Promise<StudentAccountData>;
    /**
     * 3. Updates student account balance after transactions.
     *
     * @param {string} studentId - Student identifier
     * @param {number} chargeAmount - Charge amount (positive)
     * @param {number} paymentAmount - Payment amount (positive)
     * @returns {Promise<StudentAccountData>} Updated account
     *
     * @example
     * ```typescript
     * await service.updateAccountBalance('STU123456', 1000, 500);
     * ```
     */
    updateAccountBalance(studentId: string, chargeAmount: number, paymentAmount: number): Promise<StudentAccountData>;
    /**
     * 4. Calculates past due balance based on due dates.
     *
     * @param {string} studentId - Student identifier
     * @param {Date} asOfDate - Date to calculate as of
     * @returns {Promise<number>} Past due amount
     *
     * @example
     * ```typescript
     * const pastDue = await service.calculatePastDueBalance('STU123456', new Date());
     * console.log(`Past due: $${pastDue}`);
     * ```
     */
    calculatePastDueBalance(studentId: string, asOfDate: Date): Promise<number>;
    /**
     * 5. Generates student account statement with transaction history.
     *
     * @param {string} studentId - Student identifier
     * @param {Date} startDate - Statement start date
     * @param {Date} endDate - Statement end date
     * @returns {Promise<AccountStatement>} Account statement
     *
     * @example
     * ```typescript
     * const statement = await service.generateAccountStatement(
     *   'STU123456',
     *   new Date('2024-01-01'),
     *   new Date('2024-12-31')
     * );
     * ```
     */
    generateAccountStatement(studentId: string, startDate: Date, endDate: Date): Promise<AccountStatement>;
    /**
     * 6. Sends account statement to student via email.
     *
     * @param {string} studentId - Student identifier
     * @param {string} email - Email address
     * @returns {Promise<boolean>} Success status
     *
     * @example
     * ```typescript
     * await service.emailAccountStatement('STU123456', 'student@university.edu');
     * ```
     */
    emailAccountStatement(studentId: string, email: string): Promise<boolean>;
    /**
     * 7. Exports account data for financial reporting.
     *
     * @param {string} studentId - Student identifier
     * @param {string} format - Export format
     * @returns {Promise<Buffer>} Exported data
     *
     * @example
     * ```typescript
     * const csv = await service.exportAccountData('STU123456', 'csv');
     * ```
     */
    exportAccountData(studentId: string, format: 'csv' | 'pdf' | 'json'): Promise<Buffer>;
    /**
     * 8. Archives closed student accounts for compliance.
     *
     * @param {string} studentId - Student identifier
     * @param {string} reason - Archive reason
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.archiveStudentAccount('STU123456', 'Graduation - All balances settled');
     * ```
     */
    archiveStudentAccount(studentId: string, reason: string): Promise<void>;
    /**
     * 9. Calculates tuition based on credit hours and rates.
     *
     * @param {string} studentId - Student identifier
     * @param {string} termId - Term identifier
     * @param {number} creditHours - Credit hours enrolled
     * @param {string} level - Academic level
     * @param {string} residency - Residency status
     * @returns {Promise<TuitionCalculation>} Tuition calculation
     *
     * @example
     * ```typescript
     * const tuition = await service.calculateTuition(
     *   'STU123456',
     *   'FALL2024',
     *   15,
     *   'undergraduate',
     *   'in-state'
     * );
     * console.log(`Tuition: $${tuition.tuitionAmount}`);
     * ```
     */
    calculateTuition(studentId: string, termId: string, creditHours: number, level: 'undergraduate' | 'graduate' | 'doctoral', residency: 'in-state' | 'out-of-state' | 'international'): Promise<TuitionCalculation>;
    /**
     * 10. Assesses mandatory fees for term enrollment.
     *
     * @param {string} studentId - Student identifier
     * @param {string} termId - Term identifier
     * @param {number} creditHours - Credit hours
     * @returns {Promise<FeeAssessment[]>} Fee assessments
     *
     * @example
     * ```typescript
     * const fees = await service.assessMandatoryFees('STU123456', 'FALL2024', 15);
     * const total = fees.reduce((sum, fee) => sum + fee.feeAmount, 0);
     * ```
     */
    assessMandatoryFees(studentId: string, termId: string, creditHours: number): Promise<FeeAssessment[]>;
    /**
     * 11. Assesses course-specific fees (labs, materials).
     *
     * @param {string} studentId - Student identifier
     * @param {string} courseId - Course identifier
     * @returns {Promise<FeeAssessment>} Course fee
     *
     * @example
     * ```typescript
     * const labFee = await service.assessCourseFee('STU123456', 'CHEM101');
     * ```
     */
    assessCourseFee(studentId: string, courseId: string): Promise<FeeAssessment>;
    /**
     * 12. Processes fee waiver requests.
     *
     * @param {string} feeId - Fee identifier
     * @param {string} reason - Waiver reason
     * @param {string} approvedBy - Approver identifier
     * @returns {Promise<FeeAssessment>} Updated fee
     *
     * @example
     * ```typescript
     * await service.processFeeWaiver('FEE-001', 'Financial hardship', 'ADMIN123');
     * ```
     */
    processFeeWaiver(feeId: string, reason: string, approvedBy: string): Promise<FeeAssessment>;
    /**
     * 13. Applies late registration fee.
     *
     * @param {string} studentId - Student identifier
     * @param {string} termId - Term identifier
     * @returns {Promise<FeeAssessment>} Late fee
     *
     * @example
     * ```typescript
     * await service.applyLateRegistrationFee('STU123456', 'FALL2024');
     * ```
     */
    applyLateRegistrationFee(studentId: string, termId: string): Promise<FeeAssessment>;
    /**
     * 14. Assesses housing charges for term.
     *
     * @param {string} studentId - Student identifier
     * @param {string} termId - Term identifier
     * @param {string} housingType - Housing type
     * @returns {Promise<FeeAssessment>} Housing charge
     *
     * @example
     * ```typescript
     * const housing = await service.assessHousingCharge('STU123456', 'FALL2024', 'double');
     * ```
     */
    assessHousingCharge(studentId: string, termId: string, housingType: 'single' | 'double' | 'suite' | 'apartment'): Promise<FeeAssessment>;
    /**
     * 15. Assesses meal plan charges.
     *
     * @param {string} studentId - Student identifier
     * @param {string} termId - Term identifier
     * @param {string} planType - Meal plan type
     * @returns {Promise<FeeAssessment>} Meal plan charge
     *
     * @example
     * ```typescript
     * await service.assessMealPlanCharge('STU123456', 'FALL2024', 'unlimited');
     * ```
     */
    assessMealPlanCharge(studentId: string, termId: string, planType: 'unlimited' | '14-meals' | '10-meals' | '5-meals'): Promise<FeeAssessment>;
    /**
     * 16. Generates comprehensive charge summary for term.
     *
     * @param {string} studentId - Student identifier
     * @param {string} termId - Term identifier
     * @returns {Promise<{totalCharges: number; breakdown: Array<any>}>} Charge summary
     *
     * @example
     * ```typescript
     * const summary = await service.generateChargeSummary('STU123456', 'FALL2024');
     * console.log(`Total charges: $${summary.totalCharges}`);
     * ```
     */
    generateChargeSummary(studentId: string, termId: string): Promise<{
        totalCharges: number;
        breakdown: Array<any>;
    }>;
    /**
     * 17. Processes student payment and allocates to charges.
     *
     * @param {PaymentData} paymentData - Payment information
     * @returns {Promise<PaymentData>} Processed payment
     *
     * @example
     * ```typescript
     * const payment = await service.processPayment({
     *   paymentId: 'PAY-001',
     *   studentId: 'STU123456',
     *   accountNumber: 'ACC-2024-001',
     *   paymentMethod: 'credit_card',
     *   paymentAmount: 1000.00,
     *   paymentDate: new Date(),
     *   processedBy: 'SYSTEM',
     *   allocations: []
     * });
     * ```
     */
    processPayment(paymentData: PaymentData): Promise<PaymentData>;
    /**
     * 18. Processes credit card payment with gateway integration.
     *
     * @param {string} studentId - Student identifier
     * @param {number} amount - Payment amount
     * @param {object} cardInfo - Credit card information
     * @returns {Promise<{success: boolean; transactionId: string}>} Payment result
     *
     * @example
     * ```typescript
     * const result = await service.processCreditCardPayment('STU123456', 1500.00, {
     *   cardNumber: '****1234',
     *   expiryMonth: 12,
     *   expiryYear: 2025
     * });
     * ```
     */
    processCreditCardPayment(studentId: string, amount: number, cardInfo: {
        cardNumber: string;
        expiryMonth: number;
        expiryYear: number;
        cvv: string;
    }): Promise<{
        success: boolean;
        transactionId: string;
        authCode?: string;
    }>;
    /**
     * 19. Processes ACH/bank transfer payment.
     *
     * @param {string} studentId - Student identifier
     * @param {number} amount - Payment amount
     * @param {object} bankInfo - Bank account information
     * @returns {Promise<{success: boolean; transactionId: string}>} Payment result
     *
     * @example
     * ```typescript
     * await service.processACHPayment('STU123456', 2000.00, {
     *   routingNumber: '123456789',
     *   accountNumber: '****7890',
     *   accountType: 'checking'
     * });
     * ```
     */
    processACHPayment(studentId: string, amount: number, bankInfo: {
        routingNumber: string;
        accountNumber: string;
        accountType: 'checking' | 'savings';
    }): Promise<{
        success: boolean;
        transactionId: string;
    }>;
    /**
     * 20. Records check payment.
     *
     * @param {string} studentId - Student identifier
     * @param {number} amount - Check amount
     * @param {string} checkNumber - Check number
     * @param {string} bankName - Bank name
     * @returns {Promise<PaymentData>} Payment record
     *
     * @example
     * ```typescript
     * await service.recordCheckPayment('STU123456', 500.00, '1234', 'First National Bank');
     * ```
     */
    recordCheckPayment(studentId: string, amount: number, checkNumber: string, bankName: string): Promise<PaymentData>;
    /**
     * 21. Processes payment refund.
     *
     * @param {string} studentId - Student identifier
     * @param {number} refundAmount - Refund amount
     * @param {string} reason - Refund reason
     * @returns {Promise<{refundId: string; amount: number; status: RefundStatus}>} Refund record
     *
     * @example
     * ```typescript
     * const refund = await service.processPaymentRefund('STU123456', 250.00, 'Course drop');
     * ```
     */
    processPaymentRefund(studentId: string, refundAmount: number, reason: string): Promise<{
        refundId: string;
        amount: number;
        status: RefundStatus;
    }>;
    /**
     * 22. Reverses payment transaction.
     *
     * @param {string} paymentId - Payment identifier
     * @param {string} reason - Reversal reason
     * @returns {Promise<boolean>} Success status
     *
     * @example
     * ```typescript
     * await service.reversePayment('PAY-001', 'Duplicate payment');
     * ```
     */
    reversePayment(paymentId: string, reason: string): Promise<boolean>;
    /**
     * 23. Allocates payment to specific charges.
     *
     * @param {string} paymentId - Payment identifier
     * @param {Array<{chargeId: string; amount: number}>} allocations - Charge allocations
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.allocatePaymentToCharges('PAY-001', [
     *   { chargeId: 'CHG-001', amount: 500 },
     *   { chargeId: 'CHG-002', amount: 500 }
     * ]);
     * ```
     */
    allocatePaymentToCharges(paymentId: string, allocations: Array<{
        chargeId: string;
        amount: number;
    }>): Promise<void>;
    /**
     * 24. Generates payment receipt.
     *
     * @param {string} paymentId - Payment identifier
     * @returns {Promise<Buffer>} Receipt PDF
     *
     * @example
     * ```typescript
     * const receipt = await service.generatePaymentReceipt('PAY-001');
     * ```
     */
    generatePaymentReceipt(paymentId: string): Promise<Buffer>;
    /**
     * 25. Creates payment plan for student.
     *
     * @param {PaymentPlanConfig} planConfig - Payment plan configuration
     * @returns {Promise<PaymentPlanConfig>} Created plan
     *
     * @example
     * ```typescript
     * const plan = await service.createPaymentPlan({
     *   planId: 'PLAN-001',
     *   planName: '4-Month Plan',
     *   studentId: 'STU123456',
     *   termId: 'FALL2024',
     *   totalAmount: 5000,
     *   downPaymentAmount: 1000,
     *   downPaymentDueDate: new Date(),
     *   numberOfInstallments: 4,
     *   installmentAmount: 1000,
     *   enrollmentFee: 50,
     *   lateFee: 25,
     *   interestRate: 0,
     *   installmentDates: [],
     *   autoPayEnabled: false,
     *   status: 'active'
     * });
     * ```
     */
    createPaymentPlan(planConfig: PaymentPlanConfig): Promise<PaymentPlanConfig>;
    /**
     * 26. Processes payment plan installment.
     *
     * @param {string} planId - Plan identifier
     * @param {number} installmentNumber - Installment number
     * @param {number} amount - Payment amount
     * @returns {Promise<{success: boolean; remainingBalance: number}>} Processing result
     *
     * @example
     * ```typescript
     * await service.processInstallmentPayment('PLAN-001', 1, 1000);
     * ```
     */
    processInstallmentPayment(planId: string, installmentNumber: number, amount: number): Promise<{
        success: boolean;
        remainingBalance: number;
    }>;
    /**
     * 27. Applies late fee to overdue installment.
     *
     * @param {string} planId - Plan identifier
     * @param {number} installmentNumber - Installment number
     * @returns {Promise<number>} Late fee amount
     *
     * @example
     * ```typescript
     * const lateFee = await service.applyPaymentPlanLateFee('PLAN-001', 2);
     * ```
     */
    applyPaymentPlanLateFee(planId: string, installmentNumber: number): Promise<number>;
    /**
     * 28. Cancels payment plan.
     *
     * @param {string} planId - Plan identifier
     * @param {string} reason - Cancellation reason
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.cancelPaymentPlan('PLAN-001', 'Student paid in full');
     * ```
     */
    cancelPaymentPlan(planId: string, reason: string): Promise<void>;
    /**
     * 29. Retrieves payment plan status and history.
     *
     * @param {string} planId - Plan identifier
     * @returns {Promise<PaymentPlanConfig & {paidInstallments: number; missedInstallments: number}>} Plan status
     *
     * @example
     * ```typescript
     * const status = await service.getPaymentPlanStatus('PLAN-001');
     * console.log(`Paid: ${status.paidInstallments}/${status.numberOfInstallments}`);
     * ```
     */
    getPaymentPlanStatus(planId: string): Promise<PaymentPlanConfig & {
        paidInstallments: number;
        missedInstallments: number;
    }>;
    /**
     * 30. Sends payment plan reminder notifications.
     *
     * @param {string} planId - Plan identifier
     * @param {number} daysBeforeDue - Days before due date
     * @returns {Promise<boolean>} Success status
     *
     * @example
     * ```typescript
     * await service.sendPaymentPlanReminder('PLAN-001', 7);
     * ```
     */
    sendPaymentPlanReminder(planId: string, daysBeforeDue: number): Promise<boolean>;
    /**
     * 31. Calculates refund based on withdrawal date and refund policy.
     *
     * @param {string} studentId - Student identifier
     * @param {string} termId - Term identifier
     * @param {Date} withdrawalDate - Withdrawal date
     * @returns {Promise<RefundCalculation>} Refund calculation
     *
     * @example
     * ```typescript
     * const refund = await service.calculateWithdrawalRefund(
     *   'STU123456',
     *   'FALL2024',
     *   new Date('2024-09-15')
     * );
     * console.log(`Total refund: $${refund.totalRefund}`);
     * ```
     */
    calculateWithdrawalRefund(studentId: string, termId: string, withdrawalDate: Date): Promise<RefundCalculation>;
    /**
     * 32. Processes refund request and approval workflow.
     *
     * @param {string} studentId - Student identifier
     * @param {RefundCalculation} refundCalc - Refund calculation
     * @param {string} approvedBy - Approver identifier
     * @returns {Promise<{refundId: string; status: RefundStatus}>} Refund status
     *
     * @example
     * ```typescript
     * const refund = await service.processRefundRequest(
     *   'STU123456',
     *   refundCalculation,
     *   'BURSAR123'
     * );
     * ```
     */
    processRefundRequest(studentId: string, refundCalc: RefundCalculation, approvedBy: string): Promise<{
        refundId: string;
        status: RefundStatus;
    }>;
    /**
     * 33. Issues refund via check or direct deposit.
     *
     * @param {string} refundId - Refund identifier
     * @param {string} method - Refund method
     * @returns {Promise<{issued: boolean; issuedDate: Date; checkNumber?: string}>} Issuance result
     *
     * @example
     * ```typescript
     * await service.issueRefund('REF-001', 'direct_deposit');
     * ```
     */
    issueRefund(refundId: string, method: 'check' | 'direct_deposit' | 'original_payment'): Promise<{
        issued: boolean;
        issuedDate: Date;
        checkNumber?: string;
    }>;
    /**
     * 34. Applies account credit for future use.
     *
     * @param {string} studentId - Student identifier
     * @param {number} creditAmount - Credit amount
     * @param {string} reason - Credit reason
     * @returns {Promise<{creditId: string; amount: number; expirationDate?: Date}>} Credit record
     *
     * @example
     * ```typescript
     * await service.applyAccountCredit('STU123456', 500, 'Overpayment');
     * ```
     */
    applyAccountCredit(studentId: string, creditAmount: number, reason: string): Promise<{
        creditId: string;
        amount: number;
        expirationDate?: Date;
    }>;
    /**
     * 35. Applies credit to future term charges.
     *
     * @param {string} studentId - Student identifier
     * @param {string} creditId - Credit identifier
     * @param {string} termId - Term identifier
     * @returns {Promise<boolean>} Success status
     *
     * @example
     * ```typescript
     * await service.applyCreditToCharges('STU123456', 'CRD-001', 'SPRING2025');
     * ```
     */
    applyCreditToCharges(studentId: string, creditId: string, termId: string): Promise<boolean>;
    /**
     * 36. Places financial hold on student account.
     *
     * @param {string} studentId - Student identifier
     * @param {string} reason - Hold reason
     * @param {number} amount - Balance amount
     * @returns {Promise<AccountHold>} Hold record
     *
     * @example
     * ```typescript
     * await service.placeFinancialHold('STU123456', 'Past due balance', 1500);
     * ```
     */
    placeFinancialHold(studentId: string, reason: string, amount: number): Promise<AccountHold>;
    /**
     * 37. Places registration hold preventing enrollment.
     *
     * @param {string} studentId - Student identifier
     * @param {string} reason - Hold reason
     * @returns {Promise<AccountHold>} Hold record
     *
     * @example
     * ```typescript
     * await service.placeRegistrationHold('STU123456', 'Unpaid balance over $500');
     * ```
     */
    placeRegistrationHold(studentId: string, reason: string): Promise<AccountHold>;
    /**
     * 38. Places transcript hold preventing transcript release.
     *
     * @param {string} studentId - Student identifier
     * @param {string} reason - Hold reason
     * @returns {Promise<AccountHold>} Hold record
     *
     * @example
     * ```typescript
     * await service.placeTranscriptHold('STU123456', 'Outstanding balance');
     * ```
     */
    placeTranscriptHold(studentId: string, reason: string): Promise<AccountHold>;
    /**
     * 39. Removes hold from student account.
     *
     * @param {string} holdId - Hold identifier
     * @param {string} clearedBy - Clearer identifier
     * @returns {Promise<AccountHold>} Updated hold
     *
     * @example
     * ```typescript
     * await service.removeAccountHold('HOLD-001', 'BURSAR123');
     * ```
     */
    removeAccountHold(holdId: string, clearedBy: string): Promise<AccountHold>;
    /**
     * 40. Retrieves all active holds for student.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<AccountHold[]>} Active holds
     *
     * @example
     * ```typescript
     * const holds = await service.getActiveHolds('STU123456');
     * if (holds.length > 0) {
     *   console.log('Student has active holds');
     * }
     * ```
     */
    getActiveHolds(studentId: string): Promise<AccountHold[]>;
    /**
     * 41. Transfers account to collections.
     *
     * @param {string} studentId - Student identifier
     * @param {number} balance - Outstanding balance
     * @param {string} agencyName - Collection agency
     * @returns {Promise<CollectionsAccount>} Collections account
     *
     * @example
     * ```typescript
     * await service.transferToCollections('STU123456', 2500, 'University Collections');
     * ```
     */
    transferToCollections(studentId: string, balance: number, agencyName: string): Promise<CollectionsAccount>;
    /**
     * 42. Creates payment arrangement for collections account.
     *
     * @param {string} collectionId - Collection identifier
     * @param {number} monthlyPayment - Monthly payment amount
     * @param {number} numberOfMonths - Number of months
     * @returns {Promise<{arrangementId: string; schedule: Date[]}>} Payment arrangement
     *
     * @example
     * ```typescript
     * await service.createCollectionsPaymentArrangement('COL-001', 200, 12);
     * ```
     */
    createCollectionsPaymentArrangement(collectionId: string, monthlyPayment: number, numberOfMonths: number): Promise<{
        arrangementId: string;
        schedule: Date[];
    }>;
    /**
     * 43. Processes collections payment.
     *
     * @param {string} collectionId - Collection identifier
     * @param {number} amount - Payment amount
     * @returns {Promise<{newBalance: number; status: CollectionStatus}>} Payment result
     *
     * @example
     * ```typescript
     * await service.processCollectionsPayment('COL-001', 200);
     * ```
     */
    processCollectionsPayment(collectionId: string, amount: number): Promise<{
        newBalance: number;
        status: CollectionStatus;
    }>;
    /**
     * 44. Settles collections account.
     *
     * @param {string} collectionId - Collection identifier
     * @param {number} settlementAmount - Settlement amount
     * @param {string} reason - Settlement reason
     * @returns {Promise<boolean>} Success status
     *
     * @example
     * ```typescript
     * await service.settleCollectionsAccount('COL-001', 1500, 'Settlement agreement');
     * ```
     */
    settleCollectionsAccount(collectionId: string, settlementAmount: number, reason: string): Promise<boolean>;
    /**
     * 45. Generates comprehensive Form 1098-T for tax reporting.
     *
     * @param {string} studentId - Student identifier
     * @param {number} taxYear - Tax year
     * @returns {Promise<Form1098TData>} 1098-T form data
     *
     * @example
     * ```typescript
     * const form1098T = await service.generate1098TForm('STU123456', 2024);
     * console.log(`Payments received: $${form1098T.box1PaymentsReceived}`);
     * ```
     */
    generate1098TForm(studentId: string, taxYear: number): Promise<Form1098TData>;
}
export default StudentBillingAccountsCompositeService;
//# sourceMappingURL=student-billing-accounts-composite.d.ts.map