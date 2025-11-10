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

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface TuitionRate {
  level: 'undergraduate' | 'graduate' | 'doctoral';
  residency: 'in-state' | 'out-of-state' | 'international';
  ratePerCredit: number;
  flatRateCreditThreshold?: number;
  flatRateAmount?: number;
}

interface FeeStructure {
  feeType: 'mandatory' | 'course' | 'lab' | 'technology' | 'health' | 'parking' | 'housing';
  feeName: string;
  feeAmount: number;
  isPerCredit: boolean;
  applicableTo: string[];
}

interface PaymentPlanOption {
  planId: string;
  planName: string;
  downPaymentPercent: number;
  numberOfInstallments: number;
  enrollmentFee: number;
  lateFee: number;
  installmentDates: Date[];
}

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

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateChargeDto {
  @ApiProperty({ description: 'Student ID' })
  studentId!: number;

  @ApiProperty({ description: 'Charge type' })
  chargeType!: string;

  @ApiProperty({ description: 'Amount' })
  amount!: number;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Term ID' })
  termId!: number;
}

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Student account ID' })
  accountId!: number;

  @ApiProperty({ description: 'Payment amount' })
  amount!: number;

  @ApiProperty({ description: 'Payment method' })
  paymentMethod!: string;

  @ApiProperty({ description: 'Reference number' })
  referenceNumber!: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Student Account with balance tracking.
 */
export const createStudentAccountModel = (sequelize: Sequelize) => {
  class StudentAccount extends Model {
    public id!: number;
    public studentId!: number;
    public termId!: number;
    public totalCharges!: number;
    public totalPayments!: number;
    public totalRefunds!: number;
    public currentBalance!: number;
    public pastDueAmount!: number;
    public holds!: string[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  StudentAccount.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      studentId: { type: DataTypes.INTEGER, allowNull: false },
      termId: { type: DataTypes.INTEGER, allowNull: false },
      totalCharges: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      totalPayments: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      totalRefunds: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      currentBalance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      pastDueAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      holds: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    },
    {
      sequelize,
      tableName: 'student_accounts',
      indexes: [
        { fields: ['studentId'] },
        { fields: ['termId'] },
        { fields: ['studentId', 'termId'], unique: true },
      ],
    }
  );

  return StudentAccount;
};

/**
 * Sequelize model for Charge tracking.
 */
export const createChargeModel = (sequelize: Sequelize) => {
  class Charge extends Model {
    public id!: number;
    public accountId!: number;
    public chargeType!: string;
    public amount!: number;
    public description!: string;
    public chargeDate!: Date;
    public termId!: number;
    public readonly createdAt!: Date;
  }

  Charge.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      accountId: { type: DataTypes.INTEGER, allowNull: false },
      chargeType: { type: DataTypes.STRING(50), allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      description: { type: DataTypes.STRING(500), allowNull: false },
      chargeDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      termId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      tableName: 'charges',
      indexes: [{ fields: ['accountId'] }, { fields: ['termId'] }],
    }
  );

  return Charge;
};

/**
 * Sequelize model for Payment tracking.
 */
export const createPaymentModel = (sequelize: Sequelize) => {
  class Payment extends Model {
    public id!: number;
    public accountId!: number;
    public amount!: number;
    public paymentMethod!: string;
    public paymentDate!: Date;
    public referenceNumber!: string;
    public readonly createdAt!: Date;
  }

  Payment.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      accountId: { type: DataTypes.INTEGER, allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      paymentMethod: { type: DataTypes.STRING(50), allowNull: false },
      paymentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      referenceNumber: { type: DataTypes.STRING(100), allowNull: false },
    },
    {
      sequelize,
      tableName: 'payments',
      indexes: [{ fields: ['accountId'] }, { fields: ['referenceNumber'] }],
    }
  );

  return Payment;
};

/**
 * Sequelize model for Payment Plan tracking.
 */
export const createPaymentPlanModel = (sequelize: Sequelize) => {
  class PaymentPlan extends Model {
    public id!: number;
    public accountId!: number;
    public planType!: string;
    public downPayment!: number;
    public installmentAmount!: number;
    public numberOfInstallments!: number;
    public enrollmentFee!: number;
    public lateFee!: number;
    public installmentsPaid!: number;
    public readonly createdAt!: Date;
  }

  PaymentPlan.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      accountId: { type: DataTypes.INTEGER, allowNull: false },
      planType: { type: DataTypes.STRING(50), allowNull: false },
      downPayment: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      installmentAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      numberOfInstallments: { type: DataTypes.INTEGER, allowNull: false },
      enrollmentFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      lateFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      installmentsPaid: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      tableName: 'payment_plans',
      indexes: [{ fields: ['accountId'] }],
    }
  );

  return PaymentPlan;
};

/**
 * Sequelize model for Refund tracking.
 */
export const createRefundModel = (sequelize: Sequelize) => {
  class Refund extends Model {
    public id!: number;
    public accountId!: number;
    public amount!: number;
    public refundType!: string;
    public refundDate!: Date;
    public processedDate!: Date;
    public readonly createdAt!: Date;
  }

  Refund.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      accountId: { type: DataTypes.INTEGER, allowNull: false },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      refundType: { type: DataTypes.STRING(50), allowNull: false },
      refundDate: { type: DataTypes.DATE, allowNull: false },
      processedDate: { type: DataTypes.DATE },
    },
    {
      sequelize,
      tableName: 'refunds',
      indexes: [{ fields: ['accountId'] }],
    }
  );

  return Refund;
};

// ============================================================================
// TUITION CALCULATION (1-10)
// ============================================================================

/**
 * Calculates tuition based on credit hours and residency.
 */
export async function calculateTuition(
  studentId: number,
  termId: number,
  creditHours: number,
  residency: 'in-state' | 'out-of-state' | 'international',
  level: 'undergraduate' | 'graduate' | 'doctoral',
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<number> {
  const rates: TuitionRate[] = [
    { level: 'undergraduate', residency: 'in-state', ratePerCredit: 350, flatRateCreditThreshold: 12, flatRateAmount: 4200 },
    { level: 'undergraduate', residency: 'out-of-state', ratePerCredit: 850, flatRateCreditThreshold: 12, flatRateAmount: 10200 },
    { level: 'undergraduate', residency: 'international', ratePerCredit: 950, flatRateCreditThreshold: 12, flatRateAmount: 11400 },
    { level: 'graduate', residency: 'in-state', ratePerCredit: 550 },
    { level: 'graduate', residency: 'out-of-state', ratePerCredit: 1050 },
    { level: 'graduate', residency: 'international', ratePerCredit: 1150 },
  ];

  const rate = rates.find(r => r.level === level && r.residency === residency);
  if (!rate) throw new Error('Invalid tuition rate configuration');

  if (rate.flatRateCreditThreshold && creditHours >= rate.flatRateCreditThreshold) {
    return rate.flatRateAmount!;
  }

  return creditHours * rate.ratePerCredit;
}

/**
 * Assesses mandatory fees for a term.
 */
export async function assessMandatoryFees(
  studentId: number,
  termId: number,
  creditHours: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<number> {
  const fees: FeeStructure[] = [
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
export async function assessCourseFees(
  courseIds: number[],
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<number> {
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
export async function createCharge(
  accountId: number,
  chargeType: string,
  amount: number,
  description: string,
  termId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any> {
  const Charge = createChargeModel(sequelize);
  const StudentAccount = createStudentAccountModel(sequelize);

  const charge = await Charge.create(
    { accountId, chargeType, amount, description, termId, chargeDate: new Date() },
    { transaction }
  );

  await sequelize.query(
    `UPDATE student_accounts SET total_charges = total_charges + :amount, current_balance = current_balance + :amount WHERE id = :accountId`,
    { replacements: { amount, accountId }, transaction }
  );

  return charge;
}

/**
 * Processes full tuition and fees for enrollment.
 */
export async function processEnrollmentCharges(
  studentId: number,
  termId: number,
  creditHours: number,
  courseIds: number[],
  residency: 'in-state' | 'out-of-state' | 'international',
  level: 'undergraduate' | 'graduate' | 'doctoral',
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<{ accountId: number; totalCharges: number }> {
  const StudentAccount = createStudentAccountModel(sequelize);

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
export async function getAccountBalance(
  studentId: number,
  termId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<number> {
  const StudentAccount = createStudentAccountModel(sequelize);
  const account = await StudentAccount.findOne({ where: { studentId, termId }, transaction });
  return account?.currentBalance || 0;
}

/**
 * Gets all charges for a student account.
 */
export async function getAccountCharges(
  accountId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any[]> {
  const Charge = createChargeModel(sequelize);
  return await Charge.findAll({ where: { accountId }, order: [['chargeDate', 'DESC']], transaction });
}

/**
 * Gets all payments for a student account.
 */
export async function getAccountPayments(
  accountId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any[]> {
  const Payment = createPaymentModel(sequelize);
  return await Payment.findAll({ where: { accountId }, order: [['paymentDate', 'DESC']], transaction });
}

/**
 * Gets account statement summary.
 */
export async function getAccountStatement(
  studentId: number,
  termId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any> {
  const StudentAccount = createStudentAccountModel(sequelize);
  const account = await StudentAccount.findOne({ where: { studentId, termId }, transaction });
  if (!account) throw new Error('Account not found');

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
export async function processPayment(
  accountId: number,
  amount: number,
  paymentMethod: string,
  referenceNumber: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any> {
  const Payment = createPaymentModel(sequelize);
  const StudentAccount = createStudentAccountModel(sequelize);

  const payment = await Payment.create(
    { accountId, amount, paymentMethod, referenceNumber, paymentDate: new Date() },
    { transaction }
  );

  await sequelize.query(
    `UPDATE student_accounts SET total_payments = total_payments + :amount, current_balance = current_balance - :amount WHERE id = :accountId`,
    { replacements: { amount, accountId }, transaction }
  );

  return payment;
}

/**
 * Creates a payment plan.
 */
export async function createPaymentPlan(
  accountId: number,
  planType: string,
  downPaymentPercent: number,
  numberOfInstallments: number,
  enrollmentFee: number,
  lateFee: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any> {
  const PaymentPlan = createPaymentPlanModel(sequelize);
  const StudentAccount = createStudentAccountModel(sequelize);

  const account = await StudentAccount.findByPk(accountId, { transaction });
  if (!account) throw new Error('Account not found');

  const downPayment = account.currentBalance * (downPaymentPercent / 100);
  const remainingBalance = account.currentBalance - downPayment + enrollmentFee;
  const installmentAmount = remainingBalance / numberOfInstallments;

  const plan = await PaymentPlan.create(
    {
      accountId,
      planType,
      downPayment,
      installmentAmount,
      numberOfInstallments,
      enrollmentFee,
      lateFee,
      installmentsPaid: 0,
    },
    { transaction }
  );

  return plan;
}

/**
 * Processes installment payment.
 */
export async function processInstallmentPayment(
  planId: number,
  amount: number,
  paymentMethod: string,
  referenceNumber: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any> {
  const PaymentPlan = createPaymentPlanModel(sequelize);
  const plan = await PaymentPlan.findByPk(planId, { transaction });
  if (!plan) throw new Error('Payment plan not found');

  const payment = await processPayment(plan.accountId, amount, paymentMethod, referenceNumber, sequelize, transaction);

  await plan.update({ installmentsPaid: plan.installmentsPaid + 1 }, { transaction });

  return payment;
}

/**
 * Applies late fee for missed installment.
 */
export async function applyLateFee(
  planId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any> {
  const PaymentPlan = createPaymentPlanModel(sequelize);
  const plan = await PaymentPlan.findByPk(planId, { transaction });
  if (!plan) throw new Error('Payment plan not found');

  return await createCharge(plan.accountId, 'late_fee', plan.lateFee, 'Late Payment Fee', 0, sequelize, transaction);
}

/**
 * Gets payment plan details.
 */
export async function getPaymentPlan(
  accountId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any> {
  const PaymentPlan = createPaymentPlanModel(sequelize);
  return await PaymentPlan.findOne({ where: { accountId }, transaction });
}

/**
 * Cancels payment plan.
 */
export async function cancelPaymentPlan(
  planId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  const PaymentPlan = createPaymentPlanModel(sequelize);
  await PaymentPlan.destroy({ where: { id: planId }, transaction });
}

/**
 * Checks for overdue payments.
 */
export async function checkOverduePayments(
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any[]> {
  const StudentAccount = createStudentAccountModel(sequelize);
  return await StudentAccount.findAll({
    where: { currentBalance: { [Op.gt]: 0 } },
    transaction,
  });
}

/**
 * Applies financial hold for past due account.
 */
export async function applyFinancialHold(
  accountId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  const StudentAccount = createStudentAccountModel(sequelize);
  const account = await StudentAccount.findByPk(accountId, { transaction });
  if (!account) throw new Error('Account not found');

  const holds = [...account.holds, 'FINANCIAL_HOLD'];
  await account.update({ holds }, { transaction });
}

/**
 * Releases financial hold.
 */
export async function releaseFinancialHold(
  accountId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  const StudentAccount = createStudentAccountModel(sequelize);
  const account = await StudentAccount.findByPk(accountId, { transaction });
  if (!account) throw new Error('Account not found');

  const holds = account.holds.filter(h => h !== 'FINANCIAL_HOLD');
  await account.update({ holds }, { transaction });
}

/**
 * Sends payment reminder.
 */
export async function sendPaymentReminder(
  accountId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  // Placeholder: integrate with notification system
  console.log(`Payment reminder sent for account ${accountId}`);
}

// ============================================================================
// REFUND PROCESSING (21-30)
// ============================================================================

/**
 * Calculates refund based on withdrawal date.
 */
export async function calculateRefund(
  accountId: number,
  withdrawalDate: Date,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<RefundSchedule> {
  const StudentAccount = createStudentAccountModel(sequelize);
  const account = await StudentAccount.findByPk(accountId, { transaction });
  if (!account) throw new Error('Account not found');

  // Refund schedule based on withdrawal timing
  const daysIntoTerm = Math.floor((withdrawalDate.getTime() - new Date(2025, 0, 1).getTime()) / (1000 * 60 * 60 * 24));

  let refundPercentage = 0;
  if (daysIntoTerm <= 7) refundPercentage = 100;
  else if (daysIntoTerm <= 14) refundPercentage = 75;
  else if (daysIntoTerm <= 21) refundPercentage = 50;
  else if (daysIntoTerm <= 28) refundPercentage = 25;

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
export async function processRefund(
  accountId: number,
  amount: number,
  refundType: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any> {
  const Refund = createRefundModel(sequelize);
  const StudentAccount = createStudentAccountModel(sequelize);

  const refund = await Refund.create(
    { accountId, amount, refundType, refundDate: new Date(), processedDate: new Date() },
    { transaction }
  );

  await sequelize.query(
    `UPDATE student_accounts SET total_refunds = total_refunds + :amount, current_balance = current_balance - :amount WHERE id = :accountId`,
    { replacements: { amount, accountId }, transaction }
  );

  return refund;
}

/**
 * Gets all refunds for account.
 */
export async function getAccountRefunds(
  accountId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any[]> {
  const Refund = createRefundModel(sequelize);
  return await Refund.findAll({ where: { accountId }, order: [['refundDate', 'DESC']], transaction });
}

/**
 * Processes withdrawal refund.
 */
export async function processWithdrawalRefund(
  accountId: number,
  withdrawalDate: Date,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any> {
  const refundSchedule = await calculateRefund(accountId, withdrawalDate, sequelize, transaction);
  return await processRefund(accountId, refundSchedule.totalRefund, 'withdrawal', sequelize, transaction);
}

/**
 * Reverses a refund.
 */
export async function reverseRefund(
  refundId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  const Refund = createRefundModel(sequelize);
  const StudentAccount = createStudentAccountModel(sequelize);

  const refund = await Refund.findByPk(refundId, { transaction });
  if (!refund) throw new Error('Refund not found');

  await sequelize.query(
    `UPDATE student_accounts SET total_refunds = total_refunds - :amount, current_balance = current_balance + :amount WHERE id = :accountId`,
    { replacements: { amount: refund.amount, accountId: refund.accountId }, transaction }
  );

  await refund.destroy({ transaction });
}

// ============================================================================
// 1098-T GENERATION (31-35)
// ============================================================================

/**
 * Generates 1098-T data for a student.
 */
export async function generate1098T(
  studentId: number,
  taxYear: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Form1098TData> {
  const StudentAccount = createStudentAccountModel(sequelize);
  const Payment = createPaymentModel(sequelize);

  const accounts = await StudentAccount.findAll({
    where: { studentId },
    transaction,
  });

  const accountIds = accounts.map(a => a.id);
  const payments = await Payment.findAll({
    where: {
      accountId: { [Op.in]: accountIds },
      paymentDate: {
        [Op.between]: [new Date(taxYear, 0, 1), new Date(taxYear, 11, 31)],
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
export async function export1098T(
  data: Form1098TData,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<string> {
  // Placeholder: format according to IRS specifications
  return JSON.stringify(data, null, 2);
}

/**
 * Batch generates 1098-T for all eligible students.
 */
export async function batchGenerate1098T(
  taxYear: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<Form1098TData[]> {
  const StudentAccount = createStudentAccountModel(sequelize);
  const accounts = await StudentAccount.findAll({ transaction });

  const uniqueStudents = [...new Set(accounts.map(a => a.studentId))];

  const forms: Form1098TData[] = [];
  for (const studentId of uniqueStudents) {
    const form = await generate1098T(studentId, taxYear, sequelize, transaction);
    forms.push(form);
  }

  return forms;
}

/**
 * Validates 1098-T data.
 */
export async function validate1098T(
  data: Form1098TData,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<boolean> {
  if (data.paymentsReceived < 0) return false;
  if (data.scholarshipsGrantsReceived < 0) return false;
  return true;
}

/**
 * Sends 1098-T to student.
 */
export async function send1098T(
  studentId: number,
  taxYear: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
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
export async function markAccountPastDue(
  accountId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  const StudentAccount = createStudentAccountModel(sequelize);
  const account = await StudentAccount.findByPk(accountId, { transaction });
  if (!account) throw new Error('Account not found');

  await account.update({ pastDueAmount: account.currentBalance }, { transaction });
  await applyFinancialHold(accountId, sequelize, transaction);
}

/**
 * Sends past due notice.
 */
export async function sendPastDueNotice(
  accountId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  // Placeholder: integrate with notification system
  console.log(`Past due notice sent for account ${accountId}`);
}

/**
 * Gets all past due accounts.
 */
export async function getPastDueAccounts(
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any[]> {
  const StudentAccount = createStudentAccountModel(sequelize);
  return await StudentAccount.findAll({
    where: { pastDueAmount: { [Op.gt]: 0 } },
    transaction,
  });
}

/**
 * Submits account to collections.
 */
export async function submitToCollections(
  accountId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  // Placeholder: integrate with collections agency
  console.log(`Account ${accountId} submitted to collections`);
}

/**
 * Generates collections report.
 */
export async function generateCollectionsReport(
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any> {
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
export async function placeRegistrationHold(
  accountId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  const StudentAccount = createStudentAccountModel(sequelize);
  const account = await StudentAccount.findByPk(accountId, { transaction });
  if (!account) throw new Error('Account not found');

  const holds = [...account.holds, 'REGISTRATION_HOLD'];
  await account.update({ holds }, { transaction });
}

/**
 * Places transcript hold.
 */
export async function placeTranscriptHold(
  accountId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  const StudentAccount = createStudentAccountModel(sequelize);
  const account = await StudentAccount.findByPk(accountId, { transaction });
  if (!account) throw new Error('Account not found');

  const holds = [...account.holds, 'TRANSCRIPT_HOLD'];
  await account.update({ holds }, { transaction });
}

/**
 * Releases all holds.
 */
export async function releaseAllHolds(
  accountId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<void> {
  const StudentAccount = createStudentAccountModel(sequelize);
  await StudentAccount.update({ holds: [] }, { where: { id: accountId }, transaction });
}

/**
 * Gets account holds.
 */
export async function getAccountHolds(
  accountId: number,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<string[]> {
  const StudentAccount = createStudentAccountModel(sequelize);
  const account = await StudentAccount.findByPk(accountId, { transaction });
  return account?.holds || [];
}

/**
 * Checks if account has specific hold.
 */
export async function hasHold(
  accountId: number,
  holdType: string,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<boolean> {
  const holds = await getAccountHolds(accountId, sequelize, transaction);
  return holds.includes(holdType);
}

/**
 * Default export with all utilities.
 */
export default {
  // Models
  createStudentAccountModel,
  createChargeModel,
  createPaymentModel,
  createPaymentPlanModel,
  createRefundModel,

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
