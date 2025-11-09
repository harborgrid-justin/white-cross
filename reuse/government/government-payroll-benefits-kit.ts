/**
 * LOC: GOVPB7654321
 * File: /reuse/government/government-payroll-benefits-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable government utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend payroll services
 *   - HR management modules
 *   - Benefits administration systems
 *   - Tax calculation services
 */

/**
 * File: /reuse/government/government-payroll-benefits-kit.ts
 * Locator: WC-GOV-PAYROLL-001
 * Purpose: Enterprise-grade Government Payroll & Benefits Management - employee compensation, step/grade systems, pension calculations, benefits, leave tracking
 *
 * Upstream: Independent utility module for government payroll operations
 * Downstream: ../backend/government/*, payroll controllers, HR services, benefits processors, tax modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50+ functions for government payroll/benefits competing with USACE CEFMS/Oracle HCM payroll systems
 *
 * LLM Context: Comprehensive government payroll and benefits utilities for production-ready applications.
 * Provides employee compensation management, step and grade pay systems (GS scale), defined benefit pension calculations,
 * health insurance enrollment, leave accrual and tracking (annual/sick/comp time), workers compensation processing,
 * payroll tax calculations (FICA/Medicare), union dues management, garnishment processing, overtime and compensatory time,
 * retirement contribution tracking (TSP/pension), and comprehensive reporting for government payroll compliance.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface GovernmentEmployeeData {
  employeeId: string;
  firstName: string;
  lastName: string;
  ssn: string;
  dateOfBirth: Date;
  hireDate: Date;
  departmentId: string;
  positionTitle: string;
  gradeLevel: string;
  stepLevel: number;
  payPlan: 'GS' | 'WG' | 'SES' | 'OTHER';
  salaryType: 'annual' | 'hourly';
  baseSalary: number;
  localityPay: number;
  status: 'active' | 'on_leave' | 'terminated' | 'retired';
  metadata?: Record<string, any>;
}

interface PayPeriodData {
  payPeriodId: string;
  periodNumber: number;
  fiscalYear: number;
  startDate: Date;
  endDate: Date;
  payDate: Date;
  status: 'open' | 'processing' | 'approved' | 'paid' | 'closed';
}

interface PayrollCalculation {
  employeeId: string;
  payPeriodId: string;
  regularHours: number;
  overtimeHours: number;
  regularPay: number;
  overtimePay: number;
  localityPay: number;
  grossPay: number;
  federalTax: number;
  stateTax: number;
  ficaTax: number;
  medicareTax: number;
  retirementContribution: number;
  healthInsurance: number;
  unionDues: number;
  garnishments: number;
  totalDeductions: number;
  netPay: number;
}

interface StepGradePayScale {
  payPlan: string;
  gradeLevel: string;
  stepLevel: number;
  annualSalary: number;
  hourlyRate: number;
  effectiveDate: Date;
  localityAdjustment: number;
}

interface PensionCalculation {
  employeeId: string;
  yearsOfService: number;
  highThreeAverage: number;
  serviceMultiplier: number;
  annualBenefit: number;
  monthlyBenefit: number;
  calculationMethod: 'FERS' | 'CSRS' | 'FERS_RAE' | 'FERS_FRAE';
  eligibilityAge: number;
  isEligible: boolean;
}

interface LeaveAccrual {
  employeeId: string;
  leaveType: 'annual' | 'sick' | 'compensatory' | 'military' | 'family';
  accrualRate: number;
  payPeriodsPerYear: number;
  hoursPerPayPeriod: number;
  maxAccrual: number;
  carryoverLimit: number;
}

interface LeaveBalance {
  employeeId: string;
  leaveType: string;
  currentBalance: number;
  accrued: number;
  used: number;
  carryover: number;
  maxBalance: number;
  asOfDate: Date;
}

interface LeaveRequest {
  requestId: string;
  employeeId: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  hoursRequested: number;
  status: 'pending' | 'approved' | 'denied' | 'cancelled';
  requestedBy: string;
  approvedBy?: string;
  reason?: string;
}

interface HealthInsurancePlan {
  planId: string;
  planName: string;
  planType: 'self' | 'self_plus_one' | 'family';
  carrier: string;
  monthlyPremium: number;
  employeeContribution: number;
  governmentContribution: number;
  effectiveDate: Date;
  isActive: boolean;
}

interface BenefitsEnrollment {
  employeeId: string;
  healthPlanId?: string;
  dentalPlanId?: string;
  visionPlanId?: string;
  lifeInsuranceAmount: number;
  tspElectionPercent: number;
  tspCatchupContribution: boolean;
  enrollmentDate: Date;
  effectiveDate: Date;
}

interface WorkersCompensationClaim {
  claimId: string;
  employeeId: string;
  injuryDate: Date;
  injuryDescription: string;
  claimStatus: 'reported' | 'under_review' | 'approved' | 'denied' | 'closed';
  compensationAmount: number;
  medicalExpenses: number;
  daysLost: number;
  returnToWorkDate?: Date;
}

interface UnionDuesDeduction {
  employeeId: string;
  unionId: string;
  duesAmount: number;
  deductionFrequency: 'per_pay_period' | 'monthly' | 'quarterly' | 'annual';
  effectiveDate: Date;
  endDate?: Date;
  isActive: boolean;
}

interface GarnishmentOrder {
  garnishmentId: string;
  employeeId: string;
  garnishmentType: 'child_support' | 'tax_levy' | 'student_loan' | 'bankruptcy' | 'creditor';
  orderDate: Date;
  totalAmount?: number;
  perPaymentAmount: number;
  priority: number;
  issuingAuthority: string;
  caseNumber: string;
  status: 'active' | 'completed' | 'suspended';
}

interface OvertimeRecord {
  employeeId: string;
  payPeriodId: string;
  overtimeHours: number;
  overtimeRate: number;
  overtimeType: 'time_and_half' | 'double_time' | 'holiday';
  approvedBy: string;
  approvalDate: Date;
}

interface CompensatoryTimeRecord {
  employeeId: string;
  earnedDate: Date;
  hoursEarned: number;
  hoursUsed: number;
  hoursRemaining: number;
  expirationDate: Date;
  earnedFor: string;
}

interface RetirementContribution {
  employeeId: string;
  payPeriodId: string;
  employeeContribution: number;
  agencyContribution: number;
  agencyMatchingContribution: number;
  contributionType: 'FERS' | 'CSRS' | 'TSP' | 'TSP_CATCHUP';
  vestingPercentage: number;
}

interface TaxWithholding {
  employeeId: string;
  federalAllowances: number;
  federalExtraWithholding: number;
  stateAllowances: number;
  stateExtraWithholding: number;
  filingStatus: 'single' | 'married' | 'head_of_household';
  w4OnFile: boolean;
  lastUpdated: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Government Employees with grade/step tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     GovernmentEmployee:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         employeeId:
 *           type: string
 *         firstName:
 *           type: string
 *         gradeLevel:
 *           type: string
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GovernmentEmployee model
 *
 * @example
 * ```typescript
 * const GovernmentEmployee = createGovernmentEmployeeModel(sequelize);
 * const employee = await GovernmentEmployee.create({
 *   employeeId: 'EMP-2024-001',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   ssn: '123-45-6789',
 *   dateOfBirth: new Date('1980-01-01'),
 *   hireDate: new Date('2020-01-15'),
 *   gradeLevel: 'GS-12',
 *   stepLevel: 5,
 *   payPlan: 'GS'
 * });
 * ```
 */
export const createGovernmentEmployeeModel = (sequelize: Sequelize) => {
  class GovernmentEmployee extends Model {
    public id!: string;
    public employeeId!: string;
    public firstName!: string;
    public lastName!: string;
    public ssn!: string;
    public dateOfBirth!: Date;
    public hireDate!: Date;
    public departmentId!: string;
    public positionTitle!: string;
    public gradeLevel!: string;
    public stepLevel!: number;
    public payPlan!: string;
    public salaryType!: string;
    public baseSalary!: number;
    public localityPay!: number;
    public status!: string;
    public terminationDate!: Date | null;
    public retirementDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GovernmentEmployee.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique employee identifier',
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'First name',
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Last name',
      },
      ssn: {
        type: DataTypes.STRING(11),
        allowNull: false,
        comment: 'Social security number (encrypted)',
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of birth',
      },
      hireDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Hire date',
      },
      departmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Department ID',
      },
      positionTitle: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Position title',
      },
      gradeLevel: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Grade level (e.g., GS-12)',
      },
      stepLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Step level (1-10)',
        validate: {
          min: 1,
          max: 10,
        },
      },
      payPlan: {
        type: DataTypes.ENUM('GS', 'WG', 'SES', 'OTHER'),
        allowNull: false,
        comment: 'Pay plan type',
      },
      salaryType: {
        type: DataTypes.ENUM('annual', 'hourly'),
        allowNull: false,
        comment: 'Salary type',
      },
      baseSalary: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Base salary amount',
      },
      localityPay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Locality pay adjustment',
      },
      status: {
        type: DataTypes.ENUM('active', 'on_leave', 'terminated', 'retired'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Employment status',
      },
      terminationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Termination date',
      },
      retirementDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Retirement date',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'government_employees',
      timestamps: true,
      indexes: [
        { fields: ['employeeId'], unique: true },
        { fields: ['ssn'] },
        { fields: ['departmentId'] },
        { fields: ['gradeLevel'] },
        { fields: ['status'] },
        { fields: ['hireDate'] },
      ],
    },
  );

  return GovernmentEmployee;
};

/**
 * Sequelize model for Payroll records with comprehensive deductions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PayrollRecord model
 *
 * @example
 * ```typescript
 * const PayrollRecord = createPayrollRecordModel(sequelize);
 * const payroll = await PayrollRecord.create({
 *   employeeId: 'EMP-001',
 *   payPeriodId: 'PP-2024-01',
 *   grossPay: 5000.00,
 *   netPay: 3500.00
 * });
 * ```
 */
export const createPayrollRecordModel = (sequelize: Sequelize) => {
  class PayrollRecord extends Model {
    public id!: string;
    public employeeId!: string;
    public payPeriodId!: string;
    public regularHours!: number;
    public overtimeHours!: number;
    public regularPay!: number;
    public overtimePay!: number;
    public localityPay!: number;
    public grossPay!: number;
    public federalTax!: number;
    public stateTax!: number;
    public ficaTax!: number;
    public medicareTax!: number;
    public retirementContribution!: number;
    public healthInsurance!: number;
    public unionDues!: number;
    public garnishments!: number;
    public totalDeductions!: number;
    public netPay!: number;
    public status!: string;
    public processedAt!: Date | null;
    public readonly createdAt!: Date;
  }

  PayrollRecord.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee ID',
      },
      payPeriodId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Pay period ID',
      },
      regularHours: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Regular hours worked',
      },
      overtimeHours: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Overtime hours worked',
      },
      regularPay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Regular pay amount',
      },
      overtimePay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Overtime pay amount',
      },
      localityPay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Locality pay adjustment',
      },
      grossPay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Gross pay',
      },
      federalTax: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Federal tax withheld',
      },
      stateTax: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'State tax withheld',
      },
      ficaTax: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'FICA tax withheld',
      },
      medicareTax: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Medicare tax withheld',
      },
      retirementContribution: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Retirement contribution',
      },
      healthInsurance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Health insurance premium',
      },
      unionDues: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Union dues',
      },
      garnishments: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Garnishments',
      },
      totalDeductions: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Total deductions',
      },
      netPay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Net pay',
      },
      status: {
        type: DataTypes.ENUM('pending', 'processed', 'paid', 'void'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Payroll status',
      },
      processedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Processing timestamp',
      },
    },
    {
      sequelize,
      tableName: 'payroll_records',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['employeeId'] },
        { fields: ['payPeriodId'] },
        { fields: ['status'] },
        { fields: ['employeeId', 'payPeriodId'], unique: true },
      ],
    },
  );

  return PayrollRecord;
};

/**
 * Sequelize model for Leave Balances tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LeaveBalance model
 */
export const createLeaveBalanceModel = (sequelize: Sequelize) => {
  class EmployeeLeaveBalance extends Model {
    public id!: string;
    public employeeId!: string;
    public leaveType!: string;
    public currentBalance!: number;
    public accrued!: number;
    public used!: number;
    public carryover!: number;
    public maxBalance!: number;
    public fiscalYear!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EmployeeLeaveBalance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee ID',
      },
      leaveType: {
        type: DataTypes.ENUM('annual', 'sick', 'compensatory', 'military', 'family'),
        allowNull: false,
        comment: 'Leave type',
      },
      currentBalance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Current balance hours',
      },
      accrued: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total accrued hours',
      },
      used: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total used hours',
      },
      carryover: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Carryover from previous year',
      },
      maxBalance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Maximum balance allowed',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
    },
    {
      sequelize,
      tableName: 'leave_balances',
      timestamps: true,
      indexes: [
        { fields: ['employeeId'] },
        { fields: ['leaveType'] },
        { fields: ['fiscalYear'] },
        { fields: ['employeeId', 'leaveType', 'fiscalYear'], unique: true },
      ],
    },
  );

  return EmployeeLeaveBalance;
};

/**
 * Sequelize model for Benefits Enrollment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BenefitsEnrollment model
 */
export const createBenefitsEnrollmentModel = (sequelize: Sequelize) => {
  class EmployeeBenefitsEnrollment extends Model {
    public id!: string;
    public employeeId!: string;
    public healthPlanId!: string | null;
    public dentalPlanId!: string | null;
    public visionPlanId!: string | null;
    public lifeInsuranceAmount!: number;
    public tspElectionPercent!: number;
    public tspCatchupContribution!: boolean;
    public enrollmentDate!: Date;
    public effectiveDate!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EmployeeBenefitsEnrollment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee ID',
      },
      healthPlanId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Health plan ID',
      },
      dentalPlanId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Dental plan ID',
      },
      visionPlanId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Vision plan ID',
      },
      lifeInsuranceAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Life insurance coverage amount',
      },
      tspElectionPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'TSP election percentage',
      },
      tspCatchupContribution: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'TSP catch-up contribution flag',
      },
      enrollmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Enrollment date',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
      },
    },
    {
      sequelize,
      tableName: 'benefits_enrollments',
      timestamps: true,
      indexes: [
        { fields: ['employeeId'] },
        { fields: ['effectiveDate'] },
      ],
    },
  );

  return EmployeeBenefitsEnrollment;
};

/**
 * Sequelize model for Garnishment Orders.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GarnishmentOrder model
 */
export const createGarnishmentOrderModel = (sequelize: Sequelize) => {
  class EmployeeGarnishmentOrder extends Model {
    public id!: string;
    public garnishmentId!: string;
    public employeeId!: string;
    public garnishmentType!: string;
    public orderDate!: Date;
    public totalAmount!: number | null;
    public perPaymentAmount!: number;
    public priority!: number;
    public issuingAuthority!: string;
    public caseNumber!: string;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EmployeeGarnishmentOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      garnishmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Garnishment identifier',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee ID',
      },
      garnishmentType: {
        type: DataTypes.ENUM('child_support', 'tax_levy', 'student_loan', 'bankruptcy', 'creditor'),
        allowNull: false,
        comment: 'Garnishment type',
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Order date',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Total amount to garnish',
      },
      perPaymentAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Amount per payment',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Priority order (1 = highest)',
      },
      issuingAuthority: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Issuing authority',
      },
      caseNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Case number',
      },
      status: {
        type: DataTypes.ENUM('active', 'completed', 'suspended'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Garnishment status',
      },
    },
    {
      sequelize,
      tableName: 'garnishment_orders',
      timestamps: true,
      indexes: [
        { fields: ['garnishmentId'], unique: true },
        { fields: ['employeeId'] },
        { fields: ['status'] },
        { fields: ['priority'] },
      ],
    },
  );

  return EmployeeGarnishmentOrder;
};

// ============================================================================
// EMPLOYEE MANAGEMENT (1-5)
// ============================================================================

/**
 * Creates a new government employee record.
 *
 * @param {GovernmentEmployeeData} employeeData - Employee data
 * @param {Model} GovernmentEmployee - GovernmentEmployee model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created employee
 *
 * @example
 * ```typescript
 * const employee = await createGovernmentEmployee({
 *   employeeId: 'EMP-2024-001',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   ssn: '123-45-6789',
 *   dateOfBirth: new Date('1980-01-01'),
 *   hireDate: new Date(),
 *   gradeLevel: 'GS-12',
 *   stepLevel: 5,
 *   payPlan: 'GS',
 *   baseSalary: 85000
 * }, GovernmentEmployee);
 * ```
 */
export const createGovernmentEmployee = async (
  employeeData: GovernmentEmployeeData,
  GovernmentEmployee: any,
  transaction?: Transaction,
): Promise<any> => {
  const employee = await GovernmentEmployee.create(employeeData, { transaction });
  return employee;
};

/**
 * Updates employee grade and step level.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} newGrade - New grade level
 * @param {number} newStep - New step level
 * @param {Date} effectiveDate - Effective date
 * @param {Model} GovernmentEmployee - GovernmentEmployee model
 * @returns {Promise<any>} Updated employee
 *
 * @example
 * ```typescript
 * await updateEmployeeGradeStep('EMP-001', 'GS-13', 1, new Date(), GovernmentEmployee);
 * ```
 */
export const updateEmployeeGradeStep = async (
  employeeId: string,
  newGrade: string,
  newStep: number,
  effectiveDate: Date,
  GovernmentEmployee: any,
): Promise<any> => {
  const employee = await GovernmentEmployee.findOne({ where: { employeeId } });
  if (!employee) throw new Error('Employee not found');

  const oldGrade = employee.gradeLevel;
  const oldStep = employee.stepLevel;

  employee.gradeLevel = newGrade;
  employee.stepLevel = newStep;
  employee.metadata = {
    ...employee.metadata,
    gradeHistory: [
      ...(employee.metadata.gradeHistory || []),
      {
        effectiveDate,
        fromGrade: oldGrade,
        toGrade: newGrade,
        fromStep: oldStep,
        toStep: newStep,
      },
    ],
  };
  await employee.save();

  return employee;
};

/**
 * Calculates years of service for employee.
 *
 * @param {Date} hireDate - Hire date
 * @param {Date} [asOfDate=new Date()] - Calculation date
 * @returns {number} Years of service
 *
 * @example
 * ```typescript
 * const yearsOfService = calculateYearsOfService(new Date('2010-01-15'));
 * console.log(`Years: ${yearsOfService}`);
 * ```
 */
export const calculateYearsOfService = (
  hireDate: Date,
  asOfDate: Date = new Date(),
): number => {
  const years = (asOfDate.getTime() - hireDate.getTime()) / (365.25 * 86400000);
  return Math.max(0, years);
};

/**
 * Retrieves employee by employee ID.
 *
 * @param {string} employeeId - Employee ID
 * @param {Model} GovernmentEmployee - GovernmentEmployee model
 * @returns {Promise<any>} Employee record
 *
 * @example
 * ```typescript
 * const employee = await getEmployeeById('EMP-001', GovernmentEmployee);
 * ```
 */
export const getEmployeeById = async (
  employeeId: string,
  GovernmentEmployee: any,
): Promise<any> => {
  return await GovernmentEmployee.findOne({ where: { employeeId } });
};

/**
 * Retrieves all employees by department.
 *
 * @param {string} departmentId - Department ID
 * @param {Model} GovernmentEmployee - GovernmentEmployee model
 * @returns {Promise<any[]>} Employees in department
 *
 * @example
 * ```typescript
 * const employees = await getEmployeesByDepartment('DEPT001', GovernmentEmployee);
 * ```
 */
export const getEmployeesByDepartment = async (
  departmentId: string,
  GovernmentEmployee: any,
): Promise<any[]> => {
  return await GovernmentEmployee.findAll({
    where: { departmentId, status: 'active' },
  });
};

// ============================================================================
// STEP & GRADE PAY SYSTEMS (6-10)
// ============================================================================

/**
 * Retrieves pay scale for grade and step.
 *
 * @param {string} payPlan - Pay plan (GS, WG, etc)
 * @param {string} gradeLevel - Grade level
 * @param {number} stepLevel - Step level
 * @param {Date} [effectiveDate=new Date()] - Effective date
 * @returns {StepGradePayScale} Pay scale data
 *
 * @example
 * ```typescript
 * const payScale = getPayScaleForGradeStep('GS', 'GS-12', 5, new Date());
 * console.log(`Annual salary: ${payScale.annualSalary}`);
 * ```
 */
export const getPayScaleForGradeStep = (
  payPlan: string,
  gradeLevel: string,
  stepLevel: number,
  effectiveDate: Date = new Date(),
): StepGradePayScale => {
  // Simplified GS pay scale (2024 base rates)
  const gsPayScale: Record<string, number[]> = {
    'GS-1': [22140, 22880, 23622, 24362, 25102, 25480, 26220, 26960, 26997, 27705],
    'GS-5': [33024, 34125, 35226, 36327, 37428, 38529, 39630, 40731, 41832, 42933],
    'GS-7': [41131, 42502, 43873, 45244, 46615, 47986, 49357, 50728, 52099, 53470],
    'GS-9': [50973, 52672, 54371, 56070, 57769, 59468, 61167, 62866, 64565, 66264],
    'GS-11': [61698, 63755, 65812, 67869, 69926, 71983, 74040, 76097, 78154, 80211],
    'GS-12': [73963, 76428, 78893, 81358, 83823, 86288, 88753, 91218, 93683, 96148],
    'GS-13': [87926, 90891, 93856, 96821, 99786, 102751, 105716, 108681, 111646, 114611],
    'GS-14': [103914, 107379, 110844, 114309, 117774, 121239, 124704, 128169, 131634, 135099],
    'GS-15': [122198, 126338, 130478, 134618, 138758, 142898, 147038, 151178, 155318, 159458],
  };

  const steps = gsPayScale[gradeLevel] || gsPayScale['GS-5'];
  const annualSalary = steps[stepLevel - 1] || steps[0];
  const hourlyRate = annualSalary / 2087;

  return {
    payPlan,
    gradeLevel,
    stepLevel,
    annualSalary,
    hourlyRate,
    effectiveDate,
    localityAdjustment: 0,
  };
};

/**
 * Calculates locality pay adjustment.
 *
 * @param {number} baseSalary - Base salary
 * @param {string} localityCode - Locality code
 * @returns {number} Locality pay amount
 *
 * @example
 * ```typescript
 * const localityPay = calculateLocalityPay(85000, 'DC');
 * console.log(`Locality adjustment: ${localityPay}`);
 * ```
 */
export const calculateLocalityPay = (
  baseSalary: number,
  localityCode: string,
): number => {
  // Simplified locality pay percentages (2024)
  const localityRates: Record<string, number> = {
    'DC': 0.3279, // Washington-Baltimore-Arlington
    'SF': 0.4390, // San Francisco-Oakland-San Jose
    'NY': 0.3547, // New York-Newark
    'LA': 0.3075, // Los Angeles-Long Beach
    'REST': 0.1697, // Rest of US
  };

  const rate = localityRates[localityCode] || localityRates['REST'];
  return baseSalary * rate;
};

/**
 * Determines next step increase date.
 *
 * @param {Date} lastStepIncreaseDate - Last step increase
 * @param {number} currentStep - Current step level
 * @returns {Date} Next step increase date
 *
 * @example
 * ```typescript
 * const nextDate = determineNextStepIncreaseDate(new Date('2023-01-15'), 3);
 * ```
 */
export const determineNextStepIncreaseDate = (
  lastStepIncreaseDate: Date,
  currentStep: number,
): Date => {
  let waitingPeriod: number;

  if (currentStep >= 1 && currentStep <= 3) {
    waitingPeriod = 52; // 52 weeks (1 year)
  } else if (currentStep >= 4 && currentStep <= 6) {
    waitingPeriod = 104; // 104 weeks (2 years)
  } else {
    waitingPeriod = 156; // 156 weeks (3 years)
  }

  const nextDate = new Date(lastStepIncreaseDate);
  nextDate.setDate(nextDate.getDate() + waitingPeriod * 7);
  return nextDate;
};

/**
 * Validates grade/step combination.
 *
 * @param {string} gradeLevel - Grade level
 * @param {number} stepLevel - Step level
 * @returns {{ valid: boolean; message: string }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateGradeStepCombination('GS-12', 5);
 * ```
 */
export const validateGradeStepCombination = (
  gradeLevel: string,
  stepLevel: number,
): { valid: boolean; message: string } => {
  if (stepLevel < 1 || stepLevel > 10) {
    return { valid: false, message: 'Step must be between 1 and 10' };
  }

  const validGrades = ['GS-1', 'GS-2', 'GS-3', 'GS-4', 'GS-5', 'GS-6', 'GS-7',
                       'GS-8', 'GS-9', 'GS-10', 'GS-11', 'GS-12', 'GS-13', 'GS-14', 'GS-15'];

  if (!validGrades.includes(gradeLevel)) {
    return { valid: false, message: 'Invalid grade level' };
  }

  return { valid: true, message: 'Valid combination' };
};

/**
 * Calculates total compensation including locality.
 *
 * @param {number} baseSalary - Base salary
 * @param {string} localityCode - Locality code
 * @returns {{ baseSalary: number; localityPay: number; totalCompensation: number }} Compensation breakdown
 *
 * @example
 * ```typescript
 * const comp = calculateTotalCompensation(85000, 'DC');
 * console.log(`Total: ${comp.totalCompensation}`);
 * ```
 */
export const calculateTotalCompensation = (
  baseSalary: number,
  localityCode: string,
): { baseSalary: number; localityPay: number; totalCompensation: number } => {
  const localityPay = calculateLocalityPay(baseSalary, localityCode);
  const totalCompensation = baseSalary + localityPay;

  return { baseSalary, localityPay, totalCompensation };
};

// ============================================================================
// PENSION CALCULATIONS (11-15)
// ============================================================================

/**
 * Calculates FERS pension benefit.
 *
 * @param {number} yearsOfService - Years of service
 * @param {number} highThreeAverage - High-3 average salary
 * @param {number} retirementAge - Age at retirement
 * @returns {PensionCalculation} Pension calculation
 *
 * @example
 * ```typescript
 * const pension = calculateFERSPension(30, 95000, 62);
 * console.log(`Annual benefit: ${pension.annualBenefit}`);
 * ```
 */
export const calculateFERSPension = (
  yearsOfService: number,
  highThreeAverage: number,
  retirementAge: number,
): PensionCalculation => {
  let multiplier = 0.01; // 1% for most employees

  // 1.1% for employees retiring at 62+ with 20+ years
  if (retirementAge >= 62 && yearsOfService >= 20) {
    multiplier = 0.011;
  }

  const annualBenefit = yearsOfService * multiplier * highThreeAverage;
  const monthlyBenefit = annualBenefit / 12;

  const isEligible =
    (retirementAge >= 62 && yearsOfService >= 5) ||
    (retirementAge >= 60 && yearsOfService >= 20) ||
    (yearsOfService >= 30 && retirementAge >= 55);

  return {
    employeeId: '',
    yearsOfService,
    highThreeAverage,
    serviceMultiplier: multiplier,
    annualBenefit,
    monthlyBenefit,
    calculationMethod: 'FERS',
    eligibilityAge: retirementAge,
    isEligible,
  };
};

/**
 * Calculates CSRS pension benefit.
 *
 * @param {number} yearsOfService - Years of service
 * @param {number} highThreeAverage - High-3 average salary
 * @returns {PensionCalculation} Pension calculation
 *
 * @example
 * ```typescript
 * const pension = calculateCSRSPension(35, 100000);
 * ```
 */
export const calculateCSRSPension = (
  yearsOfService: number,
  highThreeAverage: number,
): PensionCalculation => {
  // CSRS uses tiered multipliers
  let benefit = 0;

  // First 5 years: 1.5%
  const first5 = Math.min(5, yearsOfService);
  benefit += first5 * 0.015 * highThreeAverage;

  // Next 5 years (6-10): 1.75%
  if (yearsOfService > 5) {
    const next5 = Math.min(5, yearsOfService - 5);
    benefit += next5 * 0.0175 * highThreeAverage;
  }

  // Over 10 years: 2%
  if (yearsOfService > 10) {
    const remaining = yearsOfService - 10;
    benefit += remaining * 0.02 * highThreeAverage;
  }

  const annualBenefit = benefit;
  const monthlyBenefit = annualBenefit / 12;

  return {
    employeeId: '',
    yearsOfService,
    highThreeAverage,
    serviceMultiplier: 0, // Tiered
    annualBenefit,
    monthlyBenefit,
    calculationMethod: 'CSRS',
    eligibilityAge: 0,
    isEligible: yearsOfService >= 5,
  };
};

/**
 * Calculates high-3 average salary.
 *
 * @param {number[]} salaries - Array of annual salaries (chronological)
 * @returns {number} High-3 average
 *
 * @example
 * ```typescript
 * const high3 = calculateHighThreeAverage([90000, 92000, 95000, 98000]);
 * console.log(`High-3: ${high3}`);
 * ```
 */
export const calculateHighThreeAverage = (salaries: number[]): number => {
  if (salaries.length < 3) {
    const sum = salaries.reduce((acc, sal) => acc + sal, 0);
    return sum / salaries.length;
  }

  // Get the highest consecutive 3 years
  let maxAverage = 0;
  for (let i = 0; i <= salaries.length - 3; i++) {
    const avg = (salaries[i] + salaries[i + 1] + salaries[i + 2]) / 3;
    if (avg > maxAverage) maxAverage = avg;
  }

  return maxAverage;
};

/**
 * Determines pension eligibility.
 *
 * @param {number} age - Current age
 * @param {number} yearsOfService - Years of service
 * @param {string} retirementSystem - FERS or CSRS
 * @returns {{ eligible: boolean; reason: string; earliestRetirementAge?: number }} Eligibility
 *
 * @example
 * ```typescript
 * const eligibility = determinePensionEligibility(60, 25, 'FERS');
 * ```
 */
export const determinePensionEligibility = (
  age: number,
  yearsOfService: number,
  retirementSystem: 'FERS' | 'CSRS',
): { eligible: boolean; reason: string; earliestRetirementAge?: number } => {
  if (retirementSystem === 'FERS') {
    if (age >= 62 && yearsOfService >= 5) {
      return { eligible: true, reason: 'Age 62 with 5 years service' };
    }
    if (age >= 60 && yearsOfService >= 20) {
      return { eligible: true, reason: 'Age 60 with 20 years service' };
    }
    if (yearsOfService >= 30 && age >= 55) {
      return { eligible: true, reason: 'MRA with 30 years service' };
    }
    return { eligible: false, reason: 'Does not meet eligibility criteria', earliestRetirementAge: 62 };
  } else {
    // CSRS
    if (age >= 55 && yearsOfService >= 30) {
      return { eligible: true, reason: 'Age 55 with 30 years service' };
    }
    if (age >= 60 && yearsOfService >= 20) {
      return { eligible: true, reason: 'Age 60 with 20 years service' };
    }
    if (age >= 62 && yearsOfService >= 5) {
      return { eligible: true, reason: 'Age 62 with 5 years service' };
    }
    return { eligible: false, reason: 'Does not meet eligibility criteria', earliestRetirementAge: 62 };
  }
};

/**
 * Calculates survivor annuity reduction.
 *
 * @param {number} annualPension - Annual pension amount
 * @param {boolean} fullSurvivorBenefit - Full or partial survivor benefit
 * @returns {{ reduction: number; netPension: number }} Survivor benefit calculation
 *
 * @example
 * ```typescript
 * const survivor = calculateSurvivorAnnuityReduction(50000, true);
 * console.log(`Net pension: ${survivor.netPension}`);
 * ```
 */
export const calculateSurvivorAnnuityReduction = (
  annualPension: number,
  fullSurvivorBenefit: boolean,
): { reduction: number; netPension: number } => {
  const reductionPercent = fullSurvivorBenefit ? 0.10 : 0.05; // 10% for full, 5% for half
  const reduction = annualPension * reductionPercent;
  const netPension = annualPension - reduction;

  return { reduction, netPension };
};

// ============================================================================
// LEAVE ACCRUAL & TRACKING (16-21)
// ============================================================================

/**
 * Calculates leave accrual rate based on years of service.
 *
 * @param {number} yearsOfService - Years of service
 * @param {string} leaveType - Leave type
 * @returns {LeaveAccrual} Accrual configuration
 *
 * @example
 * ```typescript
 * const accrual = calculateLeaveAccrualRate(5, 'annual');
 * console.log(`Hours per pay period: ${accrual.hoursPerPayPeriod}`);
 * ```
 */
export const calculateLeaveAccrualRate = (
  yearsOfService: number,
  leaveType: string,
): LeaveAccrual => {
  if (leaveType === 'annual') {
    let hoursPerPayPeriod = 4; // 0-3 years: 4 hours

    if (yearsOfService >= 3 && yearsOfService < 15) {
      hoursPerPayPeriod = 6; // 3-15 years: 6 hours
    } else if (yearsOfService >= 15) {
      hoursPerPayPeriod = 8; // 15+ years: 8 hours
    }

    return {
      employeeId: '',
      leaveType: 'annual',
      accrualRate: hoursPerPayPeriod,
      payPeriodsPerYear: 26,
      hoursPerPayPeriod,
      maxAccrual: hoursPerPayPeriod * 26,
      carryoverLimit: 240, // Standard annual leave carryover
    };
  } else if (leaveType === 'sick') {
    return {
      employeeId: '',
      leaveType: 'sick',
      accrualRate: 4,
      payPeriodsPerYear: 26,
      hoursPerPayPeriod: 4,
      maxAccrual: 999999, // No limit on sick leave
      carryoverLimit: 999999,
    };
  }

  return {
    employeeId: '',
    leaveType,
    accrualRate: 0,
    payPeriodsPerYear: 26,
    hoursPerPayPeriod: 0,
    maxAccrual: 0,
    carryoverLimit: 0,
  };
};

/**
 * Processes leave accrual for pay period.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} payPeriodId - Pay period ID
 * @param {Model} GovernmentEmployee - GovernmentEmployee model
 * @param {Model} LeaveBalance - LeaveBalance model
 * @returns {Promise<any>} Updated leave balances
 *
 * @example
 * ```typescript
 * await processLeaveAccrual('EMP-001', 'PP-2024-01', GovernmentEmployee, LeaveBalance);
 * ```
 */
export const processLeaveAccrual = async (
  employeeId: string,
  payPeriodId: string,
  GovernmentEmployee: any,
  LeaveBalance: any,
): Promise<any> => {
  const employee = await GovernmentEmployee.findOne({ where: { employeeId } });
  if (!employee) throw new Error('Employee not found');

  const yearsOfService = calculateYearsOfService(employee.hireDate);
  const fiscalYear = new Date().getFullYear();

  // Annual leave
  const annualAccrual = calculateLeaveAccrualRate(yearsOfService, 'annual');
  let annualBalance = await LeaveBalance.findOne({
    where: { employeeId, leaveType: 'annual', fiscalYear },
  });

  if (!annualBalance) {
    annualBalance = await LeaveBalance.create({
      employeeId,
      leaveType: 'annual',
      currentBalance: 0,
      accrued: 0,
      used: 0,
      carryover: 0,
      maxBalance: annualAccrual.carryoverLimit,
      fiscalYear,
    });
  }

  annualBalance.accrued += annualAccrual.hoursPerPayPeriod;
  annualBalance.currentBalance += annualAccrual.hoursPerPayPeriod;
  await annualBalance.save();

  // Sick leave
  const sickAccrual = calculateLeaveAccrualRate(yearsOfService, 'sick');
  let sickBalance = await LeaveBalance.findOne({
    where: { employeeId, leaveType: 'sick', fiscalYear },
  });

  if (!sickBalance) {
    sickBalance = await LeaveBalance.create({
      employeeId,
      leaveType: 'sick',
      currentBalance: 0,
      accrued: 0,
      used: 0,
      carryover: 0,
      maxBalance: 999999,
      fiscalYear,
    });
  }

  sickBalance.accrued += sickAccrual.hoursPerPayPeriod;
  sickBalance.currentBalance += sickAccrual.hoursPerPayPeriod;
  await sickBalance.save();

  return { annualBalance, sickBalance };
};

/**
 * Processes leave request and updates balance.
 *
 * @param {LeaveRequest} requestData - Leave request
 * @param {Model} LeaveBalance - LeaveBalance model
 * @returns {Promise<any>} Updated leave balance
 *
 * @example
 * ```typescript
 * await processLeaveRequest({
 *   requestId: 'LR-001',
 *   employeeId: 'EMP-001',
 *   leaveType: 'annual',
 *   startDate: new Date(),
 *   endDate: new Date(),
 *   hoursRequested: 8,
 *   status: 'approved',
 *   requestedBy: 'EMP-001'
 * }, LeaveBalance);
 * ```
 */
export const processLeaveRequest = async (
  requestData: LeaveRequest,
  LeaveBalance: any,
): Promise<any> => {
  if (requestData.status !== 'approved') {
    return null;
  }

  const fiscalYear = requestData.startDate.getFullYear();
  const balance = await LeaveBalance.findOne({
    where: {
      employeeId: requestData.employeeId,
      leaveType: requestData.leaveType,
      fiscalYear,
    },
  });

  if (!balance) throw new Error('Leave balance not found');

  if (balance.currentBalance < requestData.hoursRequested) {
    throw new Error('Insufficient leave balance');
  }

  balance.used += requestData.hoursRequested;
  balance.currentBalance -= requestData.hoursRequested;
  await balance.save();

  return balance;
};

/**
 * Retrieves leave balance for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} leaveType - Leave type
 * @param {Model} LeaveBalance - LeaveBalance model
 * @returns {Promise<LeaveBalance>} Leave balance
 *
 * @example
 * ```typescript
 * const balance = await getLeaveBalance('EMP-001', 'annual', LeaveBalance);
 * ```
 */
export const getLeaveBalance = async (
  employeeId: string,
  leaveType: string,
  LeaveBalance: any,
): Promise<LeaveBalance> => {
  const fiscalYear = new Date().getFullYear();
  const balance = await LeaveBalance.findOne({
    where: { employeeId, leaveType, fiscalYear },
  });

  return balance;
};

/**
 * Processes end-of-year leave carryover.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} LeaveBalance - LeaveBalance model
 * @returns {Promise<any>} New year balances
 *
 * @example
 * ```typescript
 * await processLeaveCarryover('EMP-001', 2024, LeaveBalance);
 * ```
 */
export const processLeaveCarryover = async (
  employeeId: string,
  fiscalYear: number,
  LeaveBalance: any,
): Promise<any> => {
  const currentBalance = await LeaveBalance.findOne({
    where: { employeeId, leaveType: 'annual', fiscalYear },
  });

  if (!currentBalance) return null;

  const carryoverAmount = Math.min(
    currentBalance.currentBalance,
    currentBalance.maxBalance,
  );

  const forfeitedAmount = Math.max(
    0,
    currentBalance.currentBalance - carryoverAmount,
  );

  // Create next year balance
  const nextYearBalance = await LeaveBalance.create({
    employeeId,
    leaveType: 'annual',
    currentBalance: carryoverAmount,
    accrued: 0,
    used: 0,
    carryover: carryoverAmount,
    maxBalance: currentBalance.maxBalance,
    fiscalYear: fiscalYear + 1,
  });

  return { carryoverAmount, forfeitedAmount, nextYearBalance };
};

/**
 * Validates leave request against balance.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} leaveType - Leave type
 * @param {number} hoursRequested - Hours requested
 * @param {Model} LeaveBalance - LeaveBalance model
 * @returns {Promise<{ valid: boolean; availableHours: number; message: string }>} Validation
 *
 * @example
 * ```typescript
 * const validation = await validateLeaveRequest('EMP-001', 'annual', 40, LeaveBalance);
 * ```
 */
export const validateLeaveRequest = async (
  employeeId: string,
  leaveType: string,
  hoursRequested: number,
  LeaveBalance: any,
): Promise<{ valid: boolean; availableHours: number; message: string }> => {
  const balance = await getLeaveBalance(employeeId, leaveType, LeaveBalance);

  if (!balance) {
    return { valid: false, availableHours: 0, message: 'No leave balance found' };
  }

  if (balance.currentBalance < hoursRequested) {
    return {
      valid: false,
      availableHours: parseFloat(balance.currentBalance.toString()),
      message: `Insufficient balance. Available: ${balance.currentBalance} hours`,
    };
  }

  return {
    valid: true,
    availableHours: parseFloat(balance.currentBalance.toString()),
    message: 'Sufficient balance',
  };
};

// ============================================================================
// PAYROLL CALCULATIONS (22-28)
// ============================================================================

/**
 * Calculates gross pay for pay period.
 *
 * @param {number} annualSalary - Annual salary
 * @param {number} regularHours - Regular hours worked
 * @param {number} overtimeHours - Overtime hours
 * @param {number} localityPay - Locality pay
 * @returns {{ regularPay: number; overtimePay: number; grossPay: number }} Pay calculation
 *
 * @example
 * ```typescript
 * const pay = calculateGrossPay(85000, 80, 5, 15000);
 * console.log(`Gross pay: ${pay.grossPay}`);
 * ```
 */
export const calculateGrossPay = (
  annualSalary: number,
  regularHours: number,
  overtimeHours: number,
  localityPay: number,
): { regularPay: number; overtimePay: number; grossPay: number } => {
  const totalAnnualComp = annualSalary + localityPay;
  const hourlyRate = totalAnnualComp / 2087;
  const regularPay = (regularHours / 80) * (totalAnnualComp / 26);
  const overtimePay = overtimeHours * hourlyRate * 1.5;
  const grossPay = regularPay + overtimePay;

  return { regularPay, overtimePay, grossPay };
};

/**
 * Calculates FICA tax withholding.
 *
 * @param {number} grossPay - Gross pay amount
 * @param {number} yearToDateEarnings - YTD earnings
 * @param {number} [taxYear=2024] - Tax year for wage base
 * @returns {number} FICA tax amount
 *
 * @example
 * ```typescript
 * const ficaTax = calculateFICATax(5000, 50000, 2024);
 * ```
 */
export const calculateFICATax = (
  grossPay: number,
  yearToDateEarnings: number,
  taxYear: number = 2024,
): number => {
  const ficaRate = 0.062; // 6.2%
  const ficaWageBase = 168600; // 2024 wage base

  const remainingWageBase = Math.max(0, ficaWageBase - yearToDateEarnings);
  const taxableAmount = Math.min(grossPay, remainingWageBase);

  return taxableAmount * ficaRate;
};

/**
 * Calculates Medicare tax withholding.
 *
 * @param {number} grossPay - Gross pay amount
 * @param {number} yearToDateEarnings - YTD earnings
 * @returns {number} Medicare tax amount
 *
 * @example
 * ```typescript
 * const medicareTax = calculateMedicareTax(5000, 50000);
 * ```
 */
export const calculateMedicareTax = (
  grossPay: number,
  yearToDateEarnings: number,
): number => {
  const medicareRate = 0.0145; // 1.45%
  const additionalMedicareRate = 0.009; // 0.9% additional
  const additionalMedicareThreshold = 200000;

  let tax = grossPay * medicareRate;

  // Additional Medicare tax for high earners
  if (yearToDateEarnings + grossPay > additionalMedicareThreshold) {
    const amountOverThreshold = Math.min(
      grossPay,
      yearToDateEarnings + grossPay - additionalMedicareThreshold,
    );
    tax += amountOverThreshold * additionalMedicareRate;
  }

  return tax;
};

/**
 * Calculates federal income tax withholding.
 *
 * @param {number} grossPay - Gross pay amount
 * @param {TaxWithholding} taxInfo - Tax withholding information
 * @param {number} payPeriodsPerYear - Pay periods per year
 * @returns {number} Federal tax amount
 *
 * @example
 * ```typescript
 * const fedTax = calculateFederalTax(5000, taxInfo, 26);
 * ```
 */
export const calculateFederalTax = (
  grossPay: number,
  taxInfo: TaxWithholding,
  payPeriodsPerYear: number,
): number => {
  // Simplified federal tax calculation (2024 rates)
  const annualizedPay = grossPay * payPeriodsPerYear;
  const standardDeduction = taxInfo.filingStatus === 'married' ? 29200 : 14600;
  const taxableIncome = Math.max(0, annualizedPay - standardDeduction);

  let annualTax = 0;

  // 2024 tax brackets (simplified for single filer)
  if (taxableIncome <= 11600) {
    annualTax = taxableIncome * 0.10;
  } else if (taxableIncome <= 47150) {
    annualTax = 1160 + (taxableIncome - 11600) * 0.12;
  } else if (taxableIncome <= 100525) {
    annualTax = 5426 + (taxableIncome - 47150) * 0.22;
  } else {
    annualTax = 17168.50 + (taxableIncome - 100525) * 0.24;
  }

  const perPayPeriodTax = annualTax / payPeriodsPerYear;
  return perPayPeriodTax + taxInfo.federalExtraWithholding;
};

/**
 * Calculates FERS retirement contribution.
 *
 * @param {number} grossPay - Gross pay amount
 * @param {Date} hireDate - Hire date
 * @returns {RetirementContribution} Retirement contribution
 *
 * @example
 * ```typescript
 * const retirement = calculateFERSContribution(5000, new Date('2015-01-01'));
 * ```
 */
export const calculateFERSContribution = (
  grossPay: number,
  hireDate: Date,
): RetirementContribution => {
  let employeeRate = 0.008; // 0.8% for employees hired before 2013

  // FERS-RAE: 3.1% for employees hired in 2013
  if (hireDate >= new Date('2013-01-01') && hireDate < new Date('2014-01-01')) {
    employeeRate = 0.031;
  }

  // FERS-FRAE: 4.4% for employees hired after 2013
  if (hireDate >= new Date('2014-01-01')) {
    employeeRate = 0.044;
  }

  const employeeContribution = grossPay * employeeRate;
  const agencyContribution = grossPay * 0.16; // Agency contributes 16%

  return {
    employeeId: '',
    payPeriodId: '',
    employeeContribution,
    agencyContribution,
    agencyMatchingContribution: 0,
    contributionType: 'FERS',
    vestingPercentage: 100,
  };
};

/**
 * Processes complete payroll for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} payPeriodId - Pay period ID
 * @param {number} regularHours - Regular hours
 * @param {number} overtimeHours - Overtime hours
 * @param {Model} GovernmentEmployee - GovernmentEmployee model
 * @param {Model} PayrollRecord - PayrollRecord model
 * @returns {Promise<PayrollCalculation>} Payroll calculation
 *
 * @example
 * ```typescript
 * const payroll = await processEmployeePayroll('EMP-001', 'PP-2024-01', 80, 5, GovernmentEmployee, PayrollRecord);
 * ```
 */
export const processEmployeePayroll = async (
  employeeId: string,
  payPeriodId: string,
  regularHours: number,
  overtimeHours: number,
  GovernmentEmployee: any,
  PayrollRecord: any,
): Promise<PayrollCalculation> => {
  const employee = await GovernmentEmployee.findOne({ where: { employeeId } });
  if (!employee) throw new Error('Employee not found');

  const payCalc = calculateGrossPay(
    parseFloat(employee.baseSalary),
    regularHours,
    overtimeHours,
    parseFloat(employee.localityPay),
  );

  // Get YTD earnings (simplified)
  const ytdEarnings = 50000; // Should be calculated from prior payroll records

  const ficaTax = calculateFICATax(payCalc.grossPay, ytdEarnings);
  const medicareTax = calculateMedicareTax(payCalc.grossPay, ytdEarnings);
  const retirement = calculateFERSContribution(payCalc.grossPay, employee.hireDate);

  const taxInfo: TaxWithholding = {
    employeeId,
    federalAllowances: 1,
    federalExtraWithholding: 0,
    stateAllowances: 1,
    stateExtraWithholding: 0,
    filingStatus: 'single',
    w4OnFile: true,
    lastUpdated: new Date(),
  };

  const federalTax = calculateFederalTax(payCalc.grossPay, taxInfo, 26);
  const stateTax = payCalc.grossPay * 0.05; // Simplified 5% state tax

  const totalDeductions =
    ficaTax +
    medicareTax +
    federalTax +
    stateTax +
    retirement.employeeContribution;

  const netPay = payCalc.grossPay - totalDeductions;

  const payrollRecord = await PayrollRecord.create({
    employeeId,
    payPeriodId,
    regularHours,
    overtimeHours,
    regularPay: payCalc.regularPay,
    overtimePay: payCalc.overtimePay,
    localityPay: parseFloat(employee.localityPay),
    grossPay: payCalc.grossPay,
    federalTax,
    stateTax,
    ficaTax,
    medicareTax,
    retirementContribution: retirement.employeeContribution,
    healthInsurance: 0,
    unionDues: 0,
    garnishments: 0,
    totalDeductions,
    netPay,
    status: 'processed',
    processedAt: new Date(),
  });

  return {
    employeeId,
    payPeriodId,
    regularHours,
    overtimeHours,
    regularPay: payCalc.regularPay,
    overtimePay: payCalc.overtimePay,
    localityPay: parseFloat(employee.localityPay),
    grossPay: payCalc.grossPay,
    federalTax,
    stateTax,
    ficaTax,
    medicareTax,
    retirementContribution: retirement.employeeContribution,
    healthInsurance: 0,
    unionDues: 0,
    garnishments: 0,
    totalDeductions,
    netPay,
  };
};

/**
 * Generates payroll summary for pay period.
 *
 * @param {string} payPeriodId - Pay period ID
 * @param {Model} PayrollRecord - PayrollRecord model
 * @returns {Promise<any>} Payroll summary
 *
 * @example
 * ```typescript
 * const summary = await generatePayrollSummary('PP-2024-01', PayrollRecord);
 * ```
 */
export const generatePayrollSummary = async (
  payPeriodId: string,
  PayrollRecord: any,
): Promise<any> => {
  const records = await PayrollRecord.findAll({ where: { payPeriodId } });

  const summary = {
    payPeriodId,
    employeeCount: records.length,
    totalGrossPay: records.reduce((sum: number, r: any) => sum + parseFloat(r.grossPay), 0),
    totalDeductions: records.reduce((sum: number, r: any) => sum + parseFloat(r.totalDeductions), 0),
    totalNetPay: records.reduce((sum: number, r: any) => sum + parseFloat(r.netPay), 0),
    totalFederalTax: records.reduce((sum: number, r: any) => sum + parseFloat(r.federalTax), 0),
    totalStateTax: records.reduce((sum: number, r: any) => sum + parseFloat(r.stateTax), 0),
    totalFICA: records.reduce((sum: number, r: any) => sum + parseFloat(r.ficaTax), 0),
    totalMedicare: records.reduce((sum: number, r: any) => sum + parseFloat(r.medicareTax), 0),
    totalRetirement: records.reduce((sum: number, r: any) => sum + parseFloat(r.retirementContribution), 0),
  };

  return summary;
};

// ============================================================================
// BENEFITS MANAGEMENT (29-34)
// ============================================================================

/**
 * Enrolls employee in health insurance plan.
 *
 * @param {BenefitsEnrollment} enrollmentData - Enrollment data
 * @param {Model} BenefitsEnrollment - BenefitsEnrollment model
 * @returns {Promise<any>} Enrollment record
 *
 * @example
 * ```typescript
 * const enrollment = await enrollHealthInsurance({
 *   employeeId: 'EMP-001',
 *   healthPlanId: 'PLAN-123',
 *   enrollmentDate: new Date(),
 *   effectiveDate: new Date()
 * }, BenefitsEnrollment);
 * ```
 */
export const enrollHealthInsurance = async (
  enrollmentData: BenefitsEnrollment,
  BenefitsEnrollment: any,
): Promise<any> => {
  return await BenefitsEnrollment.create(enrollmentData);
};

/**
 * Calculates health insurance premium split.
 *
 * @param {number} totalPremium - Total monthly premium
 * @param {string} planType - Plan type
 * @returns {{ employeeShare: number; governmentShare: number }} Premium split
 *
 * @example
 * ```typescript
 * const split = calculateHealthPremiumSplit(600, 'self_plus_one');
 * console.log(`Employee pays: ${split.employeeShare}`);
 * ```
 */
export const calculateHealthPremiumSplit = (
  totalPremium: number,
  planType: string,
): { employeeShare: number; governmentShare: number } => {
  // Government typically pays 72-75% of premium
  const governmentPercent = 0.72;
  const governmentShare = totalPremium * governmentPercent;
  const employeeShare = totalPremium - governmentShare;

  return { employeeShare, governmentShare };
};

/**
 * Calculates TSP contribution with matching.
 *
 * @param {number} grossPay - Gross pay
 * @param {number} employeeElectionPercent - Employee election %
 * @param {boolean} catchupContribution - Catch-up flag
 * @param {number} age - Employee age
 * @returns {{ employeeContribution: number; agencyMatch: number; total: number }} TSP calculation
 *
 * @example
 * ```typescript
 * const tsp = calculateTSPContribution(5000, 5, false, 35);
 * console.log(`Total TSP: ${tsp.total}`);
 * ```
 */
export const calculateTSPContribution = (
  grossPay: number,
  employeeElectionPercent: number,
  catchupContribution: boolean,
  age: number,
): { employeeContribution: number; agencyMatch: number; total: number } => {
  const maxElection = Math.min(employeeElectionPercent, 100);
  let employeeContribution = (grossPay * maxElection) / 100;

  // 2024 annual limit: $23,000
  const annualLimit = 23000;
  const perPayPeriodLimit = annualLimit / 26;
  employeeContribution = Math.min(employeeContribution, perPayPeriodLimit);

  // Catch-up contribution for age 50+
  if (catchupContribution && age >= 50) {
    const catchupLimit = 7500 / 26; // $7,500 annual catch-up / 26 pay periods
    employeeContribution = Math.min(
      employeeContribution + catchupLimit,
      perPayPeriodLimit + catchupLimit,
    );
  }

  // Agency matching: 1% automatic, up to 4% match
  const agencyAutomatic = grossPay * 0.01;
  const agencyMatch = Math.min((grossPay * maxElection) / 100, grossPay * 0.04);
  const totalAgencyMatch = agencyAutomatic + agencyMatch;

  return {
    employeeContribution,
    agencyMatch: totalAgencyMatch,
    total: employeeContribution + totalAgencyMatch,
  };
};

/**
 * Retrieves employee benefits enrollment.
 *
 * @param {string} employeeId - Employee ID
 * @param {Model} BenefitsEnrollment - BenefitsEnrollment model
 * @returns {Promise<any>} Current enrollment
 *
 * @example
 * ```typescript
 * const enrollment = await getEmployeeBenefits('EMP-001', BenefitsEnrollment);
 * ```
 */
export const getEmployeeBenefits = async (
  employeeId: string,
  BenefitsEnrollment: any,
): Promise<any> => {
  return await BenefitsEnrollment.findOne({
    where: { employeeId },
    order: [['effectiveDate', 'DESC']],
  });
};

/**
 * Updates TSP election percentage.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} newElectionPercent - New election %
 * @param {Date} effectiveDate - Effective date
 * @param {Model} BenefitsEnrollment - BenefitsEnrollment model
 * @returns {Promise<any>} Updated enrollment
 *
 * @example
 * ```typescript
 * await updateTSPElection('EMP-001', 10, new Date(), BenefitsEnrollment);
 * ```
 */
export const updateTSPElection = async (
  employeeId: string,
  newElectionPercent: number,
  effectiveDate: Date,
  BenefitsEnrollment: any,
): Promise<any> => {
  const current = await getEmployeeBenefits(employeeId, BenefitsEnrollment);

  if (current) {
    current.tspElectionPercent = newElectionPercent;
    current.effectiveDate = effectiveDate;
    await current.save();
    return current;
  }

  return null;
};

/**
 * Calculates life insurance premium.
 *
 * @param {number} coverageAmount - Coverage amount
 * @param {number} age - Employee age
 * @returns {number} Monthly premium
 *
 * @example
 * ```typescript
 * const premium = calculateLifeInsurancePremium(100000, 45);
 * ```
 */
export const calculateLifeInsurancePremium = (
  coverageAmount: number,
  age: number,
): number => {
  // Simplified rate per $1,000 of coverage
  let ratePerThousand = 0.15;

  if (age >= 35 && age < 45) {
    ratePerThousand = 0.20;
  } else if (age >= 45 && age < 55) {
    ratePerThousand = 0.30;
  } else if (age >= 55) {
    ratePerThousand = 0.65;
  }

  return (coverageAmount / 1000) * ratePerThousand;
};

// ============================================================================
// WORKERS COMPENSATION (35-38)
// ============================================================================

/**
 * Creates workers compensation claim.
 *
 * @param {WorkersCompensationClaim} claimData - Claim data
 * @returns {WorkersCompensationClaim} Created claim
 *
 * @example
 * ```typescript
 * const claim = createWorkersCompClaim({
 *   claimId: 'WC-2024-001',
 *   employeeId: 'EMP-001',
 *   injuryDate: new Date(),
 *   injuryDescription: 'Back injury from lifting',
 *   claimStatus: 'reported',
 *   compensationAmount: 0,
 *   medicalExpenses: 500,
 *   daysLost: 3
 * });
 * ```
 */
export const createWorkersCompClaim = (
  claimData: WorkersCompensationClaim,
): WorkersCompensationClaim => {
  return claimData;
};

/**
 * Calculates workers comp continuation of pay.
 *
 * @param {number} dailyWage - Daily wage
 * @param {number} daysLost - Days lost
 * @returns {{ continuationPay: number; maxDays: number }} COP calculation
 *
 * @example
 * ```typescript
 * const cop = calculateContinuationOfPay(300, 15);
 * console.log(`COP amount: ${cop.continuationPay}`);
 * ```
 */
export const calculateContinuationOfPay = (
  dailyWage: number,
  daysLost: number,
): { continuationPay: number; maxDays: number } => {
  const maxCOPDays = 45; // Federal COP is up to 45 days
  const payableDays = Math.min(daysLost, maxCOPDays);
  const continuationPay = dailyWage * payableDays;

  return { continuationPay, maxDays: maxCOPDays };
};

/**
 * Updates workers comp claim status.
 *
 * @param {string} claimId - Claim ID
 * @param {string} newStatus - New status
 * @param {number} [compensationAmount] - Compensation amount
 * @returns {any} Updated claim
 *
 * @example
 * ```typescript
 * updateWorkersCompStatus('WC-001', 'approved', 5000);
 * ```
 */
export const updateWorkersCompStatus = (
  claimId: string,
  newStatus: string,
  compensationAmount?: number,
): any => {
  return {
    claimId,
    status: newStatus,
    compensationAmount: compensationAmount || 0,
    updatedAt: new Date(),
  };
};

/**
 * Calculates OWCP compensation rate.
 *
 * @param {number} weeklyWage - Weekly wage
 * @param {number} dependents - Number of dependents
 * @returns {{ weeklyCompensation: number; compensationRate: number }} OWCP calculation
 *
 * @example
 * ```typescript
 * const owcp = calculateOWCPCompensationRate(1500, 2);
 * ```
 */
export const calculateOWCPCompensationRate = (
  weeklyWage: number,
  dependents: number,
): { weeklyCompensation: number; compensationRate: number } => {
  // OWCP pays 66.67% for no dependents, 75% with dependents
  const compensationRate = dependents > 0 ? 0.75 : 0.6667;
  const weeklyCompensation = weeklyWage * compensationRate;

  return { weeklyCompensation, compensationRate };
};

// ============================================================================
// GARNISHMENTS & DEDUCTIONS (39-43)
// ============================================================================

/**
 * Processes garnishment deduction.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} netPay - Net pay before garnishment
 * @param {Model} GarnishmentOrder - GarnishmentOrder model
 * @returns {Promise<{ totalGarnishment: number; orders: any[] }>} Garnishment calculation
 *
 * @example
 * ```typescript
 * const garnishment = await processGarnishmentDeduction('EMP-001', 3500, GarnishmentOrder);
 * ```
 */
export const processGarnishmentDeduction = async (
  employeeId: string,
  netPay: number,
  GarnishmentOrder: any,
): Promise<{ totalGarnishment: number; orders: any[] }> => {
  const orders = await GarnishmentOrder.findAll({
    where: { employeeId, status: 'active' },
    order: [['priority', 'ASC']],
  });

  let remainingPay = netPay;
  let totalGarnishment = 0;
  const processedOrders = [];

  for (const order of orders) {
    const maxGarnishment = remainingPay * 0.25; // Federal limit typically 25%
    const garnishmentAmount = Math.min(
      parseFloat(order.perPaymentAmount),
      maxGarnishment,
    );

    if (garnishmentAmount > 0) {
      totalGarnishment += garnishmentAmount;
      remainingPay -= garnishmentAmount;

      processedOrders.push({
        garnishmentId: order.garnishmentId,
        type: order.garnishmentType,
        amount: garnishmentAmount,
      });
    }
  }

  return { totalGarnishment, orders: processedOrders };
};

/**
 * Calculates union dues deduction.
 *
 * @param {string} employeeId - Employee ID
 * @param {Model} UnionDues - UnionDues model (hypothetical)
 * @returns {Promise<number>} Union dues amount
 *
 * @example
 * ```typescript
 * const dues = await calculateUnionDues('EMP-001', UnionDues);
 * ```
 */
export const calculateUnionDues = async (
  employeeId: string,
  UnionDues: any,
): Promise<number> => {
  // Simplified - would query union dues table
  return 45.00; // Typical bi-weekly union dues
};

/**
 * Determines garnishment priority order.
 *
 * @param {string} garnishmentType - Garnishment type
 * @returns {number} Priority (1 = highest)
 *
 * @example
 * ```typescript
 * const priority = determineGarnishmentPriority('child_support');
 * ```
 */
export const determineGarnishmentPriority = (
  garnishmentType: string,
): number => {
  const priorities: Record<string, number> = {
    child_support: 1,
    tax_levy: 2,
    bankruptcy: 3,
    student_loan: 4,
    creditor: 5,
  };

  return priorities[garnishmentType] || 99;
};

/**
 * Validates garnishment amount against limits.
 *
 * @param {number} garnishmentAmount - Proposed garnishment
 * @param {number} disposableIncome - Disposable income
 * @param {string} garnishmentType - Garnishment type
 * @returns {{ valid: boolean; maxAllowed: number }} Validation
 *
 * @example
 * ```typescript
 * const validation = validateGarnishmentLimits(500, 2000, 'child_support');
 * ```
 */
export const validateGarnishmentLimits = (
  garnishmentAmount: number,
  disposableIncome: number,
  garnishmentType: string,
): { valid: boolean; maxAllowed: number } => {
  let maxPercent = 0.25; // Default 25%

  // Child support can be up to 50-65%
  if (garnishmentType === 'child_support') {
    maxPercent = 0.50;
  }

  const maxAllowed = disposableIncome * maxPercent;
  const valid = garnishmentAmount <= maxAllowed;

  return { valid, maxAllowed };
};

/**
 * Creates garnishment order.
 *
 * @param {GarnishmentOrder} orderData - Order data
 * @param {Model} GarnishmentOrder - GarnishmentOrder model
 * @returns {Promise<any>} Created order
 *
 * @example
 * ```typescript
 * const order = await createGarnishmentOrder(orderData, GarnishmentOrder);
 * ```
 */
export const createGarnishmentOrder = async (
  orderData: GarnishmentOrder,
  GarnishmentOrder: any,
): Promise<any> => {
  return await GarnishmentOrder.create(orderData);
};

// ============================================================================
// OVERTIME & COMP TIME (44-48)
// ============================================================================

/**
 * Calculates overtime pay rate.
 *
 * @param {number} hourlyRate - Base hourly rate
 * @param {string} overtimeType - Overtime type
 * @returns {number} Overtime rate
 *
 * @example
 * ```typescript
 * const rate = calculateOvertimeRate(40, 'time_and_half');
 * console.log(`OT rate: ${rate}`);
 * ```
 */
export const calculateOvertimeRate = (
  hourlyRate: number,
  overtimeType: string,
): number => {
  const rates: Record<string, number> = {
    time_and_half: 1.5,
    double_time: 2.0,
    holiday: 2.0,
  };

  const multiplier = rates[overtimeType] || 1.5;
  return hourlyRate * multiplier;
};

/**
 * Processes compensatory time earned.
 *
 * @param {CompensatoryTimeRecord} compTimeData - Comp time data
 * @returns {CompensatoryTimeRecord} Comp time record
 *
 * @example
 * ```typescript
 * const compTime = processCompensatoryTime({
 *   employeeId: 'EMP-001',
 *   earnedDate: new Date(),
 *   hoursEarned: 8,
 *   hoursUsed: 0,
 *   hoursRemaining: 8,
 *   expirationDate: new Date(Date.now() + 180 * 86400000),
 *   earnedFor: 'Emergency response'
 * });
 * ```
 */
export const processCompensatoryTime = (
  compTimeData: CompensatoryTimeRecord,
): CompensatoryTimeRecord => {
  return compTimeData;
};

/**
 * Uses compensatory time for leave.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} hoursUsed - Hours to use
 * @returns {any} Updated comp time balance
 *
 * @example
 * ```typescript
 * const balance = useCompensatoryTime('EMP-001', 4);
 * ```
 */
export const useCompensatoryTime = (
  employeeId: string,
  hoursUsed: number,
): any => {
  return {
    employeeId,
    hoursUsed,
    remainingBalance: 0, // Would calculate from existing balance
    usedAt: new Date(),
  };
};

/**
 * Calculates FLSA overtime eligibility.
 *
 * @param {string} positionTitle - Position title
 * @param {number} annualSalary - Annual salary
 * @returns {{ exempt: boolean; reason: string }} FLSA determination
 *
 * @example
 * ```typescript
 * const flsa = determineFLSAStatus('IT Specialist', 45000);
 * console.log(`Exempt: ${flsa.exempt}`);
 * ```
 */
export const determineFLSAStatus = (
  positionTitle: string,
  annualSalary: number,
): { exempt: boolean; reason: string } => {
  const exemptSalaryThreshold = 35568; // 2024 FLSA threshold

  if (annualSalary < exemptSalaryThreshold) {
    return { exempt: false, reason: 'Below salary threshold' };
  }

  // Simplified - would check duties test
  const exemptTitles = ['manager', 'director', 'supervisor', 'professional'];
  const isExemptTitle = exemptTitles.some(title =>
    positionTitle.toLowerCase().includes(title),
  );

  if (isExemptTitle) {
    return { exempt: true, reason: 'Meets executive/professional exemption' };
  }

  return { exempt: false, reason: 'Does not meet duties test' };
};

/**
 * Validates overtime hours request.
 *
 * @param {number} regularHours - Regular hours
 * @param {number} overtimeHours - OT hours requested
 * @param {number} maxWeeklyHours - Max weekly hours
 * @returns {{ valid: boolean; message: string }} Validation
 *
 * @example
 * ```typescript
 * const validation = validateOvertimeRequest(80, 10, 100);
 * ```
 */
export const validateOvertimeRequest = (
  regularHours: number,
  overtimeHours: number,
  maxWeeklyHours: number,
): { valid: boolean; message: string } => {
  const totalHours = regularHours + overtimeHours;

  if (totalHours > maxWeeklyHours) {
    return {
      valid: false,
      message: `Total hours ${totalHours} exceeds maximum ${maxWeeklyHours}`,
    };
  }

  if (overtimeHours > regularHours * 0.5) {
    return {
      valid: false,
      message: 'Overtime exceeds 50% of regular hours - requires approval',
    };
  }

  return { valid: true, message: 'Valid overtime request' };
};

// ============================================================================
// REPORTING & COMPLIANCE (49-50)
// ============================================================================

/**
 * Generates W-2 data for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} taxYear - Tax year
 * @param {Model} PayrollRecord - PayrollRecord model
 * @returns {Promise<any>} W-2 data
 *
 * @example
 * ```typescript
 * const w2 = await generateW2Data('EMP-001', 2024, PayrollRecord);
 * ```
 */
export const generateW2Data = async (
  employeeId: string,
  taxYear: number,
  PayrollRecord: any,
): Promise<any> => {
  const records = await PayrollRecord.findAll({ where: { employeeId } });

  const totals = {
    employeeId,
    taxYear,
    wages: records.reduce((sum: number, r: any) => sum + parseFloat(r.grossPay), 0),
    federalTaxWithheld: records.reduce((sum: number, r: any) => sum + parseFloat(r.federalTax), 0),
    socialSecurityWages: records.reduce((sum: number, r: any) => sum + parseFloat(r.grossPay), 0),
    socialSecurityTax: records.reduce((sum: number, r: any) => sum + parseFloat(r.ficaTax), 0),
    medicareWages: records.reduce((sum: number, r: any) => sum + parseFloat(r.grossPay), 0),
    medicareTax: records.reduce((sum: number, r: any) => sum + parseFloat(r.medicareTax), 0),
    stateTaxWithheld: records.reduce((sum: number, r: any) => sum + parseFloat(r.stateTax), 0),
  };

  return totals;
};

/**
 * Exports payroll register for reporting.
 *
 * @param {string} payPeriodId - Pay period ID
 * @param {Model} PayrollRecord - PayrollRecord model
 * @returns {Promise<string>} CSV export
 *
 * @example
 * ```typescript
 * const csv = await exportPayrollRegister('PP-2024-01', PayrollRecord);
 * fs.writeFileSync('payroll.csv', csv);
 * ```
 */
export const exportPayrollRegister = async (
  payPeriodId: string,
  PayrollRecord: any,
): Promise<string> => {
  const records = await PayrollRecord.findAll({ where: { payPeriodId } });

  const headers =
    'Employee ID,Gross Pay,Federal Tax,State Tax,FICA,Medicare,Retirement,Net Pay\n';

  const rows = records.map(
    (r: any) =>
      `${r.employeeId},${r.grossPay},${r.federalTax},${r.stateTax},${r.ficaTax},${r.medicareTax},${r.retirementContribution},${r.netPay}`,
  );

  return headers + rows.join('\n');
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable service for Government Payroll & Benefits.
 *
 * @example
 * ```typescript
 * @Controller('payroll')
 * export class PayrollController {
 *   constructor(private readonly payrollService: GovernmentPayrollService) {}
 *
 *   @Post('process')
 *   async processPayroll(@Body() data: any) {
 *     return this.payrollService.processPayroll(data);
 *   }
 * }
 * ```
 */
@Injectable()
export class GovernmentPayrollService {
  constructor(private readonly sequelize: Sequelize) {}

  async createEmployee(data: GovernmentEmployeeData) {
    const GovernmentEmployee = createGovernmentEmployeeModel(this.sequelize);
    return createGovernmentEmployee(data, GovernmentEmployee);
  }

  async processPayroll(employeeId: string, payPeriodId: string, hours: { regular: number; overtime: number }) {
    const GovernmentEmployee = createGovernmentEmployeeModel(this.sequelize);
    const PayrollRecord = createPayrollRecordModel(this.sequelize);
    return processEmployeePayroll(
      employeeId,
      payPeriodId,
      hours.regular,
      hours.overtime,
      GovernmentEmployee,
      PayrollRecord,
    );
  }

  async calculatePension(yearsOfService: number, highThree: number, age: number) {
    return calculateFERSPension(yearsOfService, highThree, age);
  }

  async processLeaveAccrual(employeeId: string, payPeriodId: string) {
    const GovernmentEmployee = createGovernmentEmployeeModel(this.sequelize);
    const LeaveBalance = createLeaveBalanceModel(this.sequelize);
    return processLeaveAccrual(employeeId, payPeriodId, GovernmentEmployee, LeaveBalance);
  }
}

/**
 * Default export with all payroll utilities.
 */
export default {
  // Models
  createGovernmentEmployeeModel,
  createPayrollRecordModel,
  createLeaveBalanceModel,
  createBenefitsEnrollmentModel,
  createGarnishmentOrderModel,

  // Employee Management
  createGovernmentEmployee,
  updateEmployeeGradeStep,
  calculateYearsOfService,
  getEmployeeById,
  getEmployeesByDepartment,

  // Step & Grade
  getPayScaleForGradeStep,
  calculateLocalityPay,
  determineNextStepIncreaseDate,
  validateGradeStepCombination,
  calculateTotalCompensation,

  // Pension
  calculateFERSPension,
  calculateCSRSPension,
  calculateHighThreeAverage,
  determinePensionEligibility,
  calculateSurvivorAnnuityReduction,

  // Leave
  calculateLeaveAccrualRate,
  processLeaveAccrual,
  processLeaveRequest,
  getLeaveBalance,
  processLeaveCarryover,
  validateLeaveRequest,

  // Payroll
  calculateGrossPay,
  calculateFICATax,
  calculateMedicareTax,
  calculateFederalTax,
  calculateFERSContribution,
  processEmployeePayroll,
  generatePayrollSummary,

  // Benefits
  enrollHealthInsurance,
  calculateHealthPremiumSplit,
  calculateTSPContribution,
  getEmployeeBenefits,
  updateTSPElection,
  calculateLifeInsurancePremium,

  // Workers Comp
  createWorkersCompClaim,
  calculateContinuationOfPay,
  updateWorkersCompStatus,
  calculateOWCPCompensationRate,

  // Garnishments
  processGarnishmentDeduction,
  calculateUnionDues,
  determineGarnishmentPriority,
  validateGarnishmentLimits,
  createGarnishmentOrder,

  // Overtime
  calculateOvertimeRate,
  processCompensatoryTime,
  useCompensatoryTime,
  determineFLSAStatus,
  validateOvertimeRequest,

  // Reporting
  generateW2Data,
  exportPayrollRegister,

  // Service
  GovernmentPayrollService,
};
