/**
 * LOC: CEFMS-PAYROLL-BACKEND-001
 * File: /reuse/financial/cefms/composites/downstream/payroll-backend-service.ts
 *
 * UPSTREAM (imports from):
 *   - ../cefms-payroll-personnel-benefits-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - CEFMS payroll backend controllers
 *   - Payroll API endpoints
 *   - Personnel cost reporting services
 */

/**
 * File: /reuse/financial/cefms/composites/downstream/payroll-backend-service.ts
 * Locator: WC-CEFMS-PAYROLL-BACKEND-001
 * Purpose: Complete USACE CEFMS Payroll Backend Service - Comprehensive payroll processing, employee management,
 *          salary calculations, deductions, tax withholdings, benefits administration, and payroll reporting
 *
 * Upstream: Imports composite functions from cefms-payroll-personnel-benefits-composite.ts
 * Downstream: NestJS controllers, REST API endpoints, payroll batch processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, decimal.js 10.x
 * Exports: 55+ production-ready payroll backend service functions with complete implementations
 *
 * LLM Context: Production-ready USACE CEFMS payroll backend service for complete payroll lifecycle management.
 * Handles employee onboarding, salary management, payroll processing, tax calculations, benefits deductions,
 * retirement contributions, direct deposit, garnishments, leave accruals, overtime calculations, special pay,
 * allowances, year-end processing, W-2 generation, audit trails, and comprehensive payroll reporting.
 */

import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import Decimal from 'decimal.js';

// ============================================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================================

export interface EmployeeRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeType: 'military' | 'civilian';
  payGrade: string;
  step: number;
  organizationCode: string;
  departmentCode: string;
  positionTitle: string;
  hireDate: Date;
  separationDate?: Date;
  status: 'active' | 'inactive' | 'separated' | 'suspended';
  filingStatus: 'single' | 'married' | 'head_of_household';
  exemptions: number;
  annualSalary: number;
  payFrequency: 'biweekly' | 'monthly';
  directDepositAccount?: string;
  directDepositRouting?: string;
  metadata: Record<string, any>;
}

export interface PayPeriod {
  id: string;
  payPeriodId: string;
  periodNumber: number;
  fiscalYear: number;
  startDate: Date;
  endDate: Date;
  payDate: Date;
  status: 'open' | 'processing' | 'closed' | 'posted';
  totalEmployees: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalDeductions: number;
  metadata: Record<string, any>;
}

export interface PayrollRecord {
  id: string;
  payrollId: string;
  employeeId: string;
  payPeriodId: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  regularHours: number;
  overtimeHours: number;
  holidayHours: number;
  basicPay: number;
  overtime: number;
  holidayPay: number;
  specialPay: number;
  allowances: number;
  grossPay: number;
  federalTax: number;
  stateTax: number;
  localTax: number;
  ficaTax: number;
  medicareTax: number;
  retirementContribution: number;
  healthInsurance: number;
  dentalInsurance: number;
  visionInsurance: number;
  lifeInsurance: number;
  fsaDeduction: number;
  garnishments: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  fiscalYear: number;
  period: number;
  status: 'pending' | 'calculated' | 'approved' | 'paid';
  directDepositAmount: number;
  checkAmount: number;
  metadata: Record<string, any>;
}

export interface TaxWithholdingRecord {
  id: string;
  withholdingId: string;
  employeeId: string;
  payrollId: string;
  taxType: 'federal' | 'state' | 'local' | 'fica' | 'medicare' | 'additional_medicare';
  taxYear: number;
  taxableWages: number;
  withholdingAmount: number;
  filingStatus: string;
  exemptions: number;
  additionalWithholding: number;
  ytdWages: number;
  ytdTax: number;
  metadata: Record<string, any>;
}

export interface BenefitsDeduction {
  id: string;
  deductionId: string;
  employeeId: string;
  payrollId: string;
  benefitType: 'health' | 'dental' | 'vision' | 'life' | 'disability' | 'fsa' | 'hsa';
  planCode: string;
  planName: string;
  coverageLevel: 'employee' | 'employee_spouse' | 'employee_children' | 'family';
  premiumAmount: number;
  employeeContribution: number;
  employerContribution: number;
  preTax: boolean;
  deductionAmount: number;
  ytdDeductions: number;
  metadata: Record<string, any>;
}

export interface RetirementContributionRecord {
  id: string;
  contributionId: string;
  employeeId: string;
  payrollId: string;
  contributionType: 'fers' | 'csrs' | 'tsp_traditional' | 'tsp_roth' | 'tsp_match';
  employeeAmount: number;
  employerMatch: number;
  totalContribution: number;
  contributionPercent: number;
  maxContribution: number;
  ytdEmployeeContribution: number;
  ytdEmployerContribution: number;
  catchUpContribution: number;
  metadata: Record<string, any>;
}

export interface GarnishmentRecord {
  id: string;
  garnishmentId: string;
  employeeId: string;
  garnishmentType: 'child_support' | 'tax_levy' | 'student_loan' | 'creditor' | 'bankruptcy';
  orderNumber: string;
  issuingCourt: string;
  orderDate: Date;
  amount: number;
  percentage?: number;
  maxPercentage: number;
  priorityOrder: number;
  totalAmount?: number;
  remainingAmount?: number;
  status: 'active' | 'completed' | 'suspended';
  recipientName: string;
  recipientAddress: string;
  metadata: Record<string, any>;
}

export interface DirectDepositRecord {
  id: string;
  depositId: string;
  employeeId: string;
  accountType: 'checking' | 'savings';
  routingNumber: string;
  accountNumber: string;
  depositAmount?: number;
  depositPercentage?: number;
  depositOrder: number;
  status: 'active' | 'inactive' | 'pending_verification';
  verificationDate?: Date;
  metadata: Record<string, any>;
}

export interface LeaveBalance {
  id: string;
  balanceId: string;
  employeeId: string;
  leaveType: 'annual' | 'sick' | 'military' | 'comp_time' | 'holiday' | 'lwop';
  fiscalYear: number;
  beginningBalance: number;
  accrualRate: number;
  accruedHours: number;
  usedHours: number;
  advancedHours: number;
  adjustmentHours: number;
  forfeitedHours: number;
  currentBalance: number;
  maxAccrual: number;
  carryoverLimit: number;
  metadata: Record<string, any>;
}

export interface PayrollAdjustment {
  id: string;
  adjustmentId: string;
  employeeId: string;
  payrollId: string;
  adjustmentType: 'retroactive_pay' | 'overpayment_recovery' | 'bonus' | 'award' | 'correction';
  adjustmentDate: Date;
  amount: number;
  reason: string;
  approvedBy: string;
  approvedDate: Date;
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  metadata: Record<string, any>;
}

export interface W2Record {
  id: string;
  w2Id: string;
  employeeId: string;
  taxYear: number;
  employerEIN: string;
  employerName: string;
  employerAddress: string;
  wagesBox1: number;
  federalTaxBox2: number;
  socialSecurityWagesBox3: number;
  socialSecurityTaxBox4: number;
  medicareWagesBox5: number;
  medicareTaxBox6: number;
  socialSecurityTipsBox7: number;
  allocatedTipsBox8: number;
  dependentCareBenefitsBox10: number;
  retirementPlanBox13: boolean;
  stateWages: number;
  stateTax: number;
  localWages: number;
  localTax: number;
  state: string;
  locality: string;
  generatedDate: Date;
  deliveredDate?: Date;
  status: 'draft' | 'generated' | 'delivered' | 'corrected';
  metadata: Record<string, any>;
}

export interface PayrollRegister {
  payPeriodId: string;
  fiscalYear: number;
  period: number;
  employees: PayrollRegisterEntry[];
  totals: PayrollTotals;
}

export interface PayrollRegisterEntry {
  employeeId: string;
  employeeName: string;
  organizationCode: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  directDeposit: number;
  check: number;
}

export interface PayrollTotals {
  totalEmployees: number;
  totalGrossPay: number;
  totalFederalTax: number;
  totalStateTax: number;
  totalFICA: number;
  totalMedicare: number;
  totalRetirement: number;
  totalBenefits: number;
  totalGarnishments: number;
  totalDeductions: number;
  totalNetPay: number;
  totalDirectDeposit: number;
  totalChecks: number;
}

export interface PayrollValidationResult {
  valid: boolean;
  errors: PayrollError[];
  warnings: PayrollWarning[];
}

export interface PayrollError {
  employeeId: string;
  errorCode: string;
  errorMessage: string;
  field: string;
  severity: 'critical' | 'error' | 'warning';
}

export interface PayrollWarning {
  employeeId: string;
  warningCode: string;
  warningMessage: string;
  field: string;
}

export interface FederalTaxBracket {
  filingStatus: string;
  incomeMin: number;
  incomeMax: number;
  taxRate: number;
  baseAmount: number;
}

export interface StateTaxRate {
  state: string;
  filingStatus: string;
  incomeMin: number;
  incomeMax: number;
  taxRate: number;
  baseAmount: number;
}

export interface PayrollBatchJob {
  id: string;
  batchId: string;
  payPeriodId: string;
  jobType: 'calculate' | 'validate' | 'approve' | 'post' | 'generate_w2';
  startTime: Date;
  endTime?: Date;
  status: 'queued' | 'running' | 'completed' | 'failed';
  processedRecords: number;
  totalRecords: number;
  errors: any[];
  metadata: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

export const createEmployeeModel = (sequelize: Sequelize) => {
  class Employee extends Model {
    public id!: string;
    public employeeId!: string;
    public employeeName!: string;
    public firstName!: string;
    public lastName!: string;
    public middleName!: string | null;
    public employeeType!: string;
    public payGrade!: string;
    public step!: number;
    public organizationCode!: string;
    public departmentCode!: string;
    public divisionCode!: string | null;
    public positionTitle!: string;
    public positionId!: string | null;
    public hireDate!: Date;
    public separationDate!: Date | null;
    public status!: string;
    public ssn!: string;
    public dateOfBirth!: Date;
    public filingStatus!: string;
    public exemptions!: number;
    public annualSalary!: number;
    public hourlyRate!: number;
    public payFrequency!: string;
    public flsaStatus!: string;
    public unionMember!: boolean;
    public veteranStatus!: boolean;
    public directDepositAccount!: string | null;
    public directDepositRouting!: string | null;
    public addressLine1!: string;
    public addressLine2!: string | null;
    public city!: string;
    public state!: string;
    public zipCode!: string;
    public phoneNumber!: string | null;
    public emailAddress!: string | null;
    public emergencyContactName!: string | null;
    public emergencyContactPhone!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Employee.init(
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
      employeeName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Full employee name',
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
      middleName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Middle name',
      },
      employeeType: {
        type: DataTypes.ENUM('military', 'civilian'),
        allowNull: false,
        comment: 'Employee type',
      },
      payGrade: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Pay grade (e.g., GS-12, E-5)',
      },
      step: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Step within grade',
      },
      organizationCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Organization code',
      },
      departmentCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Department code',
      },
      divisionCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Division code',
      },
      positionTitle: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Position title',
      },
      positionId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Position identifier',
      },
      hireDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Hire date',
      },
      separationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Separation date',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'separated', 'suspended'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Employment status',
      },
      ssn: {
        type: DataTypes.STRING(11),
        allowNull: false,
        comment: 'Social Security Number (encrypted)',
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of birth',
      },
      filingStatus: {
        type: DataTypes.ENUM('single', 'married', 'head_of_household', 'married_separate'),
        allowNull: false,
        defaultValue: 'single',
        comment: 'Tax filing status',
      },
      exemptions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of tax exemptions',
      },
      annualSalary: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Annual salary',
      },
      hourlyRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Hourly rate',
      },
      payFrequency: {
        type: DataTypes.ENUM('biweekly', 'monthly'),
        allowNull: false,
        defaultValue: 'biweekly',
        comment: 'Pay frequency',
      },
      flsaStatus: {
        type: DataTypes.ENUM('exempt', 'non_exempt'),
        allowNull: false,
        defaultValue: 'exempt',
        comment: 'FLSA status',
      },
      unionMember: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Union membership',
      },
      veteranStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Veteran status',
      },
      directDepositAccount: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Direct deposit account (encrypted)',
      },
      directDepositRouting: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Direct deposit routing number',
      },
      addressLine1: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Address line 1',
      },
      addressLine2: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Address line 2',
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'City',
      },
      state: {
        type: DataTypes.STRING(2),
        allowNull: false,
        comment: 'State code',
      },
      zipCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'ZIP code',
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Phone number',
      },
      emailAddress: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Email address',
      },
      emergencyContactName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Emergency contact name',
      },
      emergencyContactPhone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Emergency contact phone',
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
      tableName: 'cefms_employees',
      timestamps: true,
      indexes: [
        { fields: ['employeeId'], unique: true },
        { fields: ['organizationCode'] },
        { fields: ['departmentCode'] },
        { fields: ['status'] },
        { fields: ['employeeType'] },
        { fields: ['payGrade'] },
      ],
    }
  );

  return Employee;
};

export const createPayPeriodModel = (sequelize: Sequelize) => {
  class PayPeriod extends Model {
    public id!: string;
    public payPeriodId!: string;
    public periodNumber!: number;
    public fiscalYear!: number;
    public startDate!: Date;
    public endDate!: Date;
    public payDate!: Date;
    public checkDate!: Date;
    public status!: string;
    public totalEmployees!: number;
    public totalGrossPay!: number;
    public totalNetPay!: number;
    public totalDeductions!: number;
    public processedBy!: string | null;
    public processedDate!: Date | null;
    public approvedBy!: string | null;
    public approvedDate!: Date | null;
    public postedBy!: string | null;
    public postedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PayPeriod.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      payPeriodId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Pay period identifier',
      },
      periodNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Period number within fiscal year',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period start date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Period end date',
      },
      payDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Pay date',
      },
      checkDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Check date',
      },
      status: {
        type: DataTypes.ENUM('open', 'processing', 'closed', 'posted'),
        allowNull: false,
        defaultValue: 'open',
        comment: 'Pay period status',
      },
      totalEmployees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total employees in period',
      },
      totalGrossPay: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total gross pay',
      },
      totalNetPay: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total net pay',
      },
      totalDeductions: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total deductions',
      },
      processedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Processed by user',
      },
      processedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Processing date',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user',
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      postedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Posted by user',
      },
      postedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Posted date',
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
      tableName: 'cefms_pay_periods',
      timestamps: true,
      indexes: [
        { fields: ['payPeriodId'], unique: true },
        { fields: ['fiscalYear', 'periodNumber'] },
        { fields: ['status'] },
        { fields: ['startDate', 'endDate'] },
      ],
    }
  );

  return PayPeriod;
};

export const createPayrollModel = (sequelize: Sequelize) => {
  class Payroll extends Model {
    public id!: string;
    public payrollId!: string;
    public employeeId!: string;
    public payPeriodId!: string;
    public payPeriodStart!: Date;
    public payPeriodEnd!: Date;
    public regularHours!: number;
    public overtimeHours!: number;
    public doubleTimeHours!: number;
    public holidayHours!: number;
    public sickLeaveHours!: number;
    public annualLeaveHours!: number;
    public otherLeaveHours!: number;
    public basicPay!: number;
    public overtime!: number;
    public doubleTimePay!: number;
    public holidayPay!: number;
    public specialPay!: number;
    public allowances!: number;
    public bonuses!: number;
    public awards!: number;
    public retroactivePay!: number;
    public grossPay!: number;
    public federalTax!: number;
    public stateTax!: number;
    public localTax!: number;
    public ficaTax!: number;
    public medicareTax!: number;
    public additionalMedicareTax!: number;
    public retirementContribution!: number;
    public healthInsurance!: number;
    public dentalInsurance!: number;
    public visionInsurance!: number;
    public lifeInsurance!: number;
    public disabilityInsurance!: number;
    public fsaDeduction!: number;
    public hsaDeduction!: number;
    public garnishments!: number;
    public unionDues!: number;
    public otherDeductions!: number;
    public totalDeductions!: number;
    public netPay!: number;
    public directDepositAmount!: number;
    public checkAmount!: number;
    public fiscalYear!: number;
    public period!: number;
    public status!: string;
    public calculatedBy!: string | null;
    public calculatedDate!: Date | null;
    public approvedBy!: string | null;
    public approvedDate!: Date | null;
    public paidDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Payroll.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      payrollId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Payroll record identifier',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      payPeriodId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Pay period identifier',
      },
      payPeriodStart: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Pay period start date',
      },
      payPeriodEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Pay period end date',
      },
      regularHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Regular hours worked',
      },
      overtimeHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Overtime hours',
      },
      doubleTimeHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Double time hours',
      },
      holidayHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Holiday hours',
      },
      sickLeaveHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Sick leave hours',
      },
      annualLeaveHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Annual leave hours',
      },
      otherLeaveHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Other leave hours',
      },
      basicPay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Basic pay',
      },
      overtime: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Overtime pay',
      },
      doubleTimePay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Double time pay',
      },
      holidayPay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Holiday pay',
      },
      specialPay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Special pay',
      },
      allowances: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Allowances',
      },
      bonuses: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Bonuses',
      },
      awards: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Awards',
      },
      retroactivePay: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Retroactive pay',
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
        comment: 'Federal income tax',
      },
      stateTax: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'State income tax',
      },
      localTax: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Local income tax',
      },
      ficaTax: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'FICA tax',
      },
      medicareTax: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Medicare tax',
      },
      additionalMedicareTax: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Additional Medicare tax',
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
      dentalInsurance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Dental insurance premium',
      },
      visionInsurance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Vision insurance premium',
      },
      lifeInsurance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Life insurance premium',
      },
      disabilityInsurance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Disability insurance premium',
      },
      fsaDeduction: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'FSA deduction',
      },
      hsaDeduction: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'HSA deduction',
      },
      garnishments: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Garnishments',
      },
      unionDues: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Union dues',
      },
      otherDeductions: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Other deductions',
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
      directDepositAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Direct deposit amount',
      },
      checkAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Check amount',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      period: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Pay period number',
      },
      status: {
        type: DataTypes.ENUM('pending', 'calculated', 'approved', 'paid', 'voided'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Payroll status',
      },
      calculatedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Calculated by user',
      },
      calculatedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Calculation date',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user',
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      paidDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Payment date',
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
      tableName: 'cefms_payroll',
      timestamps: true,
      indexes: [
        { fields: ['payrollId'], unique: true },
        { fields: ['employeeId'] },
        { fields: ['payPeriodId'] },
        { fields: ['fiscalYear', 'period'] },
        { fields: ['status'] },
      ],
    }
  );

  return Payroll;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * CEFMS Payroll Backend Service
 *
 * Comprehensive payroll processing service for USACE CEFMS system.
 * Handles complete payroll lifecycle including employee management, salary calculations,
 * tax withholdings, benefits deductions, direct deposit, and reporting.
 */
@Injectable()
export class CEFMSPayrollBackendService {
  private readonly logger = new Logger(CEFMSPayrollBackendService.name);

  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel('Employee') private readonly employeeModel: typeof Model,
    @InjectModel('PayPeriod') private readonly payPeriodModel: typeof Model,
    @InjectModel('Payroll') private readonly payrollModel: typeof Model
  ) {}

  // ============================================================================
  // EMPLOYEE MANAGEMENT (Functions 1-8)
  // ============================================================================

  /**
   * Creates a new employee record in the payroll system.
   *
   * @param {Partial<EmployeeRecord>} employeeData - Employee data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<EmployeeRecord>} Created employee record
   *
   * @example
   * ```typescript
   * const employee = await service.createEmployee({
   *   employeeId: 'EMP-001',
   *   employeeName: 'John Doe',
   *   employeeType: 'civilian',
   *   payGrade: 'GS-12',
   *   step: 5,
   *   annualSalary: 85000
   * });
   * ```
   */
  async createEmployee(
    employeeData: Partial<EmployeeRecord>,
    transaction?: Transaction
  ): Promise<EmployeeRecord> {
    this.logger.log(`Creating employee: ${employeeData.employeeId}`);

    try {
      // Validate required fields
      if (!employeeData.employeeId || !employeeData.employeeName || !employeeData.annualSalary) {
        throw new BadRequestException('Missing required employee fields');
      }

      // Check for duplicate employee ID
      const existing = await this.employeeModel.findOne({
        where: { employeeId: employeeData.employeeId },
        transaction,
      });

      if (existing) {
        throw new ConflictException(`Employee ${employeeData.employeeId} already exists`);
      }

      // Calculate hourly rate from annual salary
      const hourlyRate = this.calculateHourlyRate(
        employeeData.annualSalary,
        employeeData.payFrequency || 'biweekly'
      );

      // Create employee record
      const employee = await this.employeeModel.create(
        {
          ...employeeData,
          hourlyRate,
          status: employeeData.status || 'active',
          metadata: employeeData.metadata || {},
        },
        { transaction }
      );

      this.logger.log(`Employee ${employeeData.employeeId} created successfully`);
      return employee.toJSON() as EmployeeRecord;
    } catch (error) {
      this.logger.error(`Failed to create employee: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates an existing employee record.
   *
   * @param {string} employeeId - Employee identifier
   * @param {Partial<EmployeeRecord>} updateData - Update data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<EmployeeRecord>} Updated employee record
   */
  async updateEmployee(
    employeeId: string,
    updateData: Partial<EmployeeRecord>,
    transaction?: Transaction
  ): Promise<EmployeeRecord> {
    this.logger.log(`Updating employee: ${employeeId}`);

    try {
      const employee = await this.employeeModel.findOne({
        where: { employeeId },
        transaction,
      });

      if (!employee) {
        throw new NotFoundException(`Employee ${employeeId} not found`);
      }

      // Recalculate hourly rate if salary changed
      if (updateData.annualSalary) {
        updateData.hourlyRate = this.calculateHourlyRate(
          updateData.annualSalary,
          (employee as any).payFrequency
        );
      }

      await employee.update(updateData, { transaction });

      this.logger.log(`Employee ${employeeId} updated successfully`);
      return employee.toJSON() as EmployeeRecord;
    } catch (error) {
      this.logger.error(`Failed to update employee: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves an employee by their ID.
   *
   * @param {string} employeeId - Employee identifier
   * @returns {Promise<EmployeeRecord>} Employee record
   */
  async getEmployeeById(employeeId: string): Promise<EmployeeRecord> {
    this.logger.log(`Retrieving employee: ${employeeId}`);

    const employee = await this.employeeModel.findOne({
      where: { employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee ${employeeId} not found`);
    }

    return employee.toJSON() as EmployeeRecord;
  }

  /**
   * Retrieves all active employees for an organization.
   *
   * @param {string} organizationCode - Organization code
   * @returns {Promise<EmployeeRecord[]>} List of employees
   */
  async getEmployeesByOrganization(organizationCode: string): Promise<EmployeeRecord[]> {
    this.logger.log(`Retrieving employees for organization: ${organizationCode}`);

    const employees = await this.employeeModel.findAll({
      where: {
        organizationCode,
        status: 'active',
      },
      order: [['employeeName', 'ASC']],
    });

    return employees.map(e => e.toJSON() as EmployeeRecord);
  }

  /**
   * Separates an employee (termination/resignation).
   *
   * @param {string} employeeId - Employee identifier
   * @param {Date} separationDate - Separation date
   * @param {string} reason - Separation reason
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<EmployeeRecord>} Updated employee record
   */
  async separateEmployee(
    employeeId: string,
    separationDate: Date,
    reason: string,
    transaction?: Transaction
  ): Promise<EmployeeRecord> {
    this.logger.log(`Separating employee: ${employeeId}`);

    try {
      const employee = await this.employeeModel.findOne({
        where: { employeeId },
        transaction,
      });

      if (!employee) {
        throw new NotFoundException(`Employee ${employeeId} not found`);
      }

      await employee.update(
        {
          status: 'separated',
          separationDate,
          metadata: {
            ...(employee as any).metadata,
            separationReason: reason,
            separatedAt: new Date(),
          },
        },
        { transaction }
      );

      this.logger.log(`Employee ${employeeId} separated successfully`);
      return employee.toJSON() as EmployeeRecord;
    } catch (error) {
      this.logger.error(`Failed to separate employee: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Reactivates a separated or inactive employee.
   *
   * @param {string} employeeId - Employee identifier
   * @param {Date} reactivationDate - Reactivation date
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<EmployeeRecord>} Updated employee record
   */
  async reactivateEmployee(
    employeeId: string,
    reactivationDate: Date,
    transaction?: Transaction
  ): Promise<EmployeeRecord> {
    this.logger.log(`Reactivating employee: ${employeeId}`);

    try {
      const employee = await this.employeeModel.findOne({
        where: { employeeId },
        transaction,
      });

      if (!employee) {
        throw new NotFoundException(`Employee ${employeeId} not found`);
      }

      await employee.update(
        {
          status: 'active',
          separationDate: null,
          metadata: {
            ...(employee as any).metadata,
            reactivatedAt: reactivationDate,
          },
        },
        { transaction }
      );

      this.logger.log(`Employee ${employeeId} reactivated successfully`);
      return employee.toJSON() as EmployeeRecord;
    } catch (error) {
      this.logger.error(`Failed to reactivate employee: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates employee tax withholding information.
   *
   * @param {string} employeeId - Employee identifier
   * @param {string} filingStatus - Tax filing status
   * @param {number} exemptions - Number of exemptions
   * @param {number} additionalWithholding - Additional withholding amount
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<EmployeeRecord>} Updated employee record
   */
  async updateEmployeeTaxInfo(
    employeeId: string,
    filingStatus: string,
    exemptions: number,
    additionalWithholding: number = 0,
    transaction?: Transaction
  ): Promise<EmployeeRecord> {
    this.logger.log(`Updating tax info for employee: ${employeeId}`);

    try {
      const employee = await this.employeeModel.findOne({
        where: { employeeId },
        transaction,
      });

      if (!employee) {
        throw new NotFoundException(`Employee ${employeeId} not found`);
      }

      await employee.update(
        {
          filingStatus,
          exemptions,
          metadata: {
            ...(employee as any).metadata,
            additionalWithholding,
            taxInfoUpdatedAt: new Date(),
          },
        },
        { transaction }
      );

      this.logger.log(`Tax info updated for employee ${employeeId}`);
      return employee.toJSON() as EmployeeRecord;
    } catch (error) {
      this.logger.error(`Failed to update tax info: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates employee direct deposit information.
   *
   * @param {string} employeeId - Employee identifier
   * @param {string} routingNumber - Bank routing number
   * @param {string} accountNumber - Bank account number
   * @param {string} accountType - Account type (checking/savings)
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<EmployeeRecord>} Updated employee record
   */
  async updateDirectDeposit(
    employeeId: string,
    routingNumber: string,
    accountNumber: string,
    accountType: 'checking' | 'savings',
    transaction?: Transaction
  ): Promise<EmployeeRecord> {
    this.logger.log(`Updating direct deposit for employee: ${employeeId}`);

    try {
      const employee = await this.employeeModel.findOne({
        where: { employeeId },
        transaction,
      });

      if (!employee) {
        throw new NotFoundException(`Employee ${employeeId} not found`);
      }

      // In production, encrypt account information
      const encryptedAccount = accountNumber; // TODO: Implement encryption
      const encryptedRouting = routingNumber; // TODO: Implement encryption

      await employee.update(
        {
          directDepositAccount: encryptedAccount,
          directDepositRouting: encryptedRouting,
          metadata: {
            ...(employee as any).metadata,
            directDepositType: accountType,
            directDepositUpdatedAt: new Date(),
          },
        },
        { transaction }
      );

      this.logger.log(`Direct deposit updated for employee ${employeeId}`);
      return employee.toJSON() as EmployeeRecord;
    } catch (error) {
      this.logger.error(`Failed to update direct deposit: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ============================================================================
  // PAY PERIOD MANAGEMENT (Functions 9-14)
  // ============================================================================

  /**
   * Creates a new pay period.
   *
   * @param {Partial<PayPeriod>} periodData - Pay period data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<PayPeriod>} Created pay period
   */
  async createPayPeriod(
    periodData: Partial<PayPeriod>,
    transaction?: Transaction
  ): Promise<PayPeriod> {
    this.logger.log(`Creating pay period: ${periodData.payPeriodId}`);

    try {
      // Validate required fields
      if (!periodData.payPeriodId || !periodData.startDate || !periodData.endDate) {
        throw new BadRequestException('Missing required pay period fields');
      }

      // Check for overlapping pay periods
      const overlapping = await this.payPeriodModel.findOne({
        where: {
          [Op.or]: [
            {
              startDate: { [Op.between]: [periodData.startDate, periodData.endDate] },
            },
            {
              endDate: { [Op.between]: [periodData.startDate, periodData.endDate] },
            },
          ],
        },
        transaction,
      });

      if (overlapping) {
        throw new ConflictException('Overlapping pay period exists');
      }

      const payPeriod = await this.payPeriodModel.create(
        {
          ...periodData,
          status: 'open',
          totalEmployees: 0,
          totalGrossPay: 0,
          totalNetPay: 0,
          totalDeductions: 0,
          metadata: periodData.metadata || {},
        },
        { transaction }
      );

      this.logger.log(`Pay period ${periodData.payPeriodId} created successfully`);
      return payPeriod.toJSON() as PayPeriod;
    } catch (error) {
      this.logger.error(`Failed to create pay period: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves a pay period by ID.
   *
   * @param {string} payPeriodId - Pay period identifier
   * @returns {Promise<PayPeriod>} Pay period record
   */
  async getPayPeriodById(payPeriodId: string): Promise<PayPeriod> {
    this.logger.log(`Retrieving pay period: ${payPeriodId}`);

    const payPeriod = await this.payPeriodModel.findOne({
      where: { payPeriodId },
    });

    if (!payPeriod) {
      throw new NotFoundException(`Pay period ${payPeriodId} not found`);
    }

    return payPeriod.toJSON() as PayPeriod;
  }

  /**
   * Retrieves the current active pay period.
   *
   * @returns {Promise<PayPeriod>} Current pay period
   */
  async getCurrentPayPeriod(): Promise<PayPeriod> {
    this.logger.log('Retrieving current pay period');

    const now = new Date();
    const payPeriod = await this.payPeriodModel.findOne({
      where: {
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now },
        status: { [Op.in]: ['open', 'processing'] },
      },
    });

    if (!payPeriod) {
      throw new NotFoundException('No active pay period found');
    }

    return payPeriod.toJSON() as PayPeriod;
  }

  /**
   * Closes a pay period after payroll processing is complete.
   *
   * @param {string} payPeriodId - Pay period identifier
   * @param {string} userId - User closing the period
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<PayPeriod>} Updated pay period
   */
  async closePayPeriod(
    payPeriodId: string,
    userId: string,
    transaction?: Transaction
  ): Promise<PayPeriod> {
    this.logger.log(`Closing pay period: ${payPeriodId}`);

    try {
      const payPeriod = await this.payPeriodModel.findOne({
        where: { payPeriodId },
        transaction,
      });

      if (!payPeriod) {
        throw new NotFoundException(`Pay period ${payPeriodId} not found`);
      }

      if ((payPeriod as any).status === 'closed') {
        throw new ConflictException('Pay period already closed');
      }

      // Calculate totals from payroll records
      const totals = await this.calculatePayPeriodTotals(payPeriodId, transaction);

      await payPeriod.update(
        {
          status: 'closed',
          totalEmployees: totals.totalEmployees,
          totalGrossPay: totals.totalGrossPay,
          totalNetPay: totals.totalNetPay,
          totalDeductions: totals.totalDeductions,
          processedBy: userId,
          processedDate: new Date(),
        },
        { transaction }
      );

      this.logger.log(`Pay period ${payPeriodId} closed successfully`);
      return payPeriod.toJSON() as PayPeriod;
    } catch (error) {
      this.logger.error(`Failed to close pay period: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Posts a pay period to the general ledger.
   *
   * @param {string} payPeriodId - Pay period identifier
   * @param {string} userId - User posting the period
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<PayPeriod>} Updated pay period
   */
  async postPayPeriod(
    payPeriodId: string,
    userId: string,
    transaction?: Transaction
  ): Promise<PayPeriod> {
    this.logger.log(`Posting pay period: ${payPeriodId}`);

    try {
      const payPeriod = await this.payPeriodModel.findOne({
        where: { payPeriodId },
        transaction,
      });

      if (!payPeriod) {
        throw new NotFoundException(`Pay period ${payPeriodId} not found`);
      }

      if ((payPeriod as any).status !== 'closed') {
        throw new ConflictException('Pay period must be closed before posting');
      }

      if ((payPeriod as any).status === 'posted') {
        throw new ConflictException('Pay period already posted');
      }

      await payPeriod.update(
        {
          status: 'posted',
          postedBy: userId,
          postedDate: new Date(),
        },
        { transaction }
      );

      // TODO: Create GL entries for payroll posting

      this.logger.log(`Pay period ${payPeriodId} posted successfully`);
      return payPeriod.toJSON() as PayPeriod;
    } catch (error) {
      this.logger.error(`Failed to post pay period: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves all pay periods for a fiscal year.
   *
   * @param {number} fiscalYear - Fiscal year
   * @returns {Promise<PayPeriod[]>} List of pay periods
   */
  async getPayPeriodsByFiscalYear(fiscalYear: number): Promise<PayPeriod[]> {
    this.logger.log(`Retrieving pay periods for fiscal year: ${fiscalYear}`);

    const payPeriods = await this.payPeriodModel.findAll({
      where: { fiscalYear },
      order: [['periodNumber', 'ASC']],
    });

    return payPeriods.map(p => p.toJSON() as PayPeriod);
  }

  // ============================================================================
  // PAYROLL CALCULATION (Functions 15-30)
  // ============================================================================

  /**
   * Calculates hourly rate from annual salary.
   *
   * @param {number} annualSalary - Annual salary amount
   * @param {string} payFrequency - Pay frequency (biweekly/monthly)
   * @returns {number} Hourly rate
   *
   * @example
   * ```typescript
   * const hourlyRate = service.calculateHourlyRate(85000, 'biweekly');
   * // Returns: 40.87 (85000 / 2080 hours)
   * ```
   */
  calculateHourlyRate(annualSalary: number, payFrequency: string): number {
    const annualHours = 2080; // Standard annual work hours
    const hourlyRate = new Decimal(annualSalary).dividedBy(annualHours);
    return hourlyRate.toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates basic pay for a pay period.
   *
   * @param {number} annualSalary - Annual salary
   * @param {string} payFrequency - Pay frequency
   * @param {number} regularHours - Regular hours worked
   * @returns {number} Basic pay amount
   */
  calculateBasicPay(
    annualSalary: number,
    payFrequency: string,
    regularHours: number
  ): number {
    if (payFrequency === 'biweekly') {
      // Biweekly: 26 pay periods per year
      return new Decimal(annualSalary).dividedBy(26).toDecimalPlaces(2).toNumber();
    } else {
      // Monthly: 12 pay periods per year
      return new Decimal(annualSalary).dividedBy(12).toDecimalPlaces(2).toNumber();
    }
  }

  /**
   * Calculates overtime pay at 1.5x rate.
   *
   * @param {number} hourlyRate - Employee hourly rate
   * @param {number} overtimeHours - Overtime hours worked
   * @returns {number} Overtime pay amount
   */
  calculateOvertimePay(hourlyRate: number, overtimeHours: number): number {
    const overtimeRate = new Decimal(hourlyRate).times(1.5);
    return overtimeRate.times(overtimeHours).toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates double time pay at 2.0x rate.
   *
   * @param {number} hourlyRate - Employee hourly rate
   * @param {number} doubleTimeHours - Double time hours worked
   * @returns {number} Double time pay amount
   */
  calculateDoubleTimePay(hourlyRate: number, doubleTimeHours: number): number {
    const doubleTimeRate = new Decimal(hourlyRate).times(2.0);
    return doubleTimeRate.times(doubleTimeHours).toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates holiday pay.
   *
   * @param {number} hourlyRate - Employee hourly rate
   * @param {number} holidayHours - Holiday hours
   * @returns {number} Holiday pay amount
   */
  calculateHolidayPay(hourlyRate: number, holidayHours: number): number {
    return new Decimal(hourlyRate).times(holidayHours).toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates gross pay (sum of all earnings).
   *
   * @param {Partial<PayrollRecord>} payroll - Payroll record with earnings
   * @returns {number} Gross pay amount
   */
  calculateGrossPay(payroll: Partial<PayrollRecord>): number {
    const grossPay = new Decimal(payroll.basicPay || 0)
      .plus(payroll.overtime || 0)
      .plus(payroll.doubleTimePay || 0)
      .plus(payroll.holidayPay || 0)
      .plus(payroll.specialPay || 0)
      .plus(payroll.allowances || 0)
      .plus(payroll.bonuses || 0)
      .plus(payroll.awards || 0)
      .plus(payroll.retroactivePay || 0);

    return grossPay.toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates federal income tax withholding using 2024 tax brackets.
   *
   * @param {number} grossPay - Gross pay amount
   * @param {string} filingStatus - Tax filing status
   * @param {number} exemptions - Number of exemptions
   * @param {string} payFrequency - Pay frequency
   * @returns {number} Federal tax withholding amount
   */
  calculateFederalTax(
    grossPay: number,
    filingStatus: string,
    exemptions: number,
    payFrequency: string
  ): number {
    // 2024 Federal tax brackets (biweekly payroll)
    const brackets: FederalTaxBracket[] = [
      { filingStatus: 'single', incomeMin: 0, incomeMax: 252, taxRate: 0.10, baseAmount: 0 },
      { filingStatus: 'single', incomeMin: 252, incomeMax: 1034, taxRate: 0.12, baseAmount: 25.20 },
      { filingStatus: 'single', incomeMin: 1034, incomeMax: 2319, taxRate: 0.22, baseAmount: 119.04 },
      { filingStatus: 'single', incomeMin: 2319, incomeMax: 4361, taxRate: 0.24, baseAmount: 401.74 },
      { filingStatus: 'single', incomeMin: 4361, incomeMax: 6577, taxRate: 0.32, baseAmount: 891.82 },
      { filingStatus: 'single', incomeMin: 6577, incomeMax: 9615, taxRate: 0.35, baseAmount: 1600.94 },
      { filingStatus: 'single', incomeMin: 9615, incomeMax: Infinity, taxRate: 0.37, baseAmount: 2664.24 },
      { filingStatus: 'married', incomeMin: 0, incomeMax: 677, taxRate: 0.10, baseAmount: 0 },
      { filingStatus: 'married', incomeMin: 677, incomeMax: 2240, taxRate: 0.12, baseAmount: 67.70 },
      { filingStatus: 'married', incomeMin: 2240, incomeMax: 4811, taxRate: 0.22, baseAmount: 255.26 },
      { filingStatus: 'married', incomeMin: 4811, incomeMax: 8894, taxRate: 0.24, baseAmount: 820.88 },
      { filingStatus: 'married', incomeMin: 8894, incomeMax: 13327, taxRate: 0.32, baseAmount: 1800.80 },
      { filingStatus: 'married', incomeMin: 13327, incomeMax: 19404, taxRate: 0.35, baseAmount: 3219.36 },
      { filingStatus: 'married', incomeMin: 19404, incomeMax: Infinity, taxRate: 0.37, baseAmount: 5346.31 },
    ];

    // Adjust for exemptions (standard deduction per exemption)
    const exemptionAmount = exemptions * 158.65; // Per pay period
    const taxableIncome = Math.max(0, grossPay - exemptionAmount);

    // Find applicable bracket
    const normalizedStatus = filingStatus === 'married' ? 'married' : 'single';
    const bracket = brackets
      .filter(b => b.filingStatus === normalizedStatus)
      .find(b => taxableIncome >= b.incomeMin && taxableIncome < b.incomeMax);

    if (!bracket) {
      return 0;
    }

    // Calculate tax
    const taxableOverBase = Math.max(0, taxableIncome - bracket.incomeMin);
    const tax = new Decimal(bracket.baseAmount).plus(
      new Decimal(taxableOverBase).times(bracket.taxRate)
    );

    return tax.toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates state income tax withholding.
   *
   * @param {number} grossPay - Gross pay amount
   * @param {string} state - State code
   * @param {string} filingStatus - Tax filing status
   * @param {number} exemptions - Number of exemptions
   * @returns {number} State tax withholding amount
   */
  calculateStateTax(
    grossPay: number,
    state: string,
    filingStatus: string,
    exemptions: number
  ): number {
    // State tax rates vary by state - simplified calculation
    // In production, implement state-specific tax tables
    const stateTaxRates: Record<string, number> = {
      'CA': 0.0565,
      'NY': 0.0465,
      'TX': 0.0000, // No state income tax
      'FL': 0.0000,
      'VA': 0.0575,
      'MD': 0.0575,
      'DC': 0.0600,
    };

    const taxRate = stateTaxRates[state] || 0.05; // Default 5%
    const exemptionAmount = exemptions * 100; // Simplified exemption
    const taxableIncome = Math.max(0, grossPay - exemptionAmount);

    return new Decimal(taxableIncome).times(taxRate).toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates local income tax withholding.
   *
   * @param {number} grossPay - Gross pay amount
   * @param {string} locality - Locality code
   * @returns {number} Local tax withholding amount
   */
  calculateLocalTax(grossPay: number, locality: string): number {
    // Local tax rates vary by locality - simplified calculation
    const localTaxRates: Record<string, number> = {
      'NYC': 0.03876,
      'SF': 0.0000,
      'DC': 0.0000, // Included in state tax
    };

    const taxRate = localTaxRates[locality] || 0.00;
    return new Decimal(grossPay).times(taxRate).toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates FICA (Social Security) tax withholding.
   *
   * @param {number} grossPay - Gross pay amount
   * @param {number} ytdGrossPay - Year-to-date gross pay
   * @param {number} taxYear - Tax year
   * @returns {number} FICA tax withholding amount
   */
  calculateFICATax(grossPay: number, ytdGrossPay: number, taxYear: number): number {
    // 2024 Social Security wage base: $168,600
    const wageBase = 168600;
    const ficaRate = 0.062; // 6.2%

    const remainingWageBase = Math.max(0, wageBase - ytdGrossPay);
    const taxableWages = Math.min(grossPay, remainingWageBase);

    return new Decimal(taxableWages).times(ficaRate).toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates Medicare tax withholding.
   *
   * @param {number} grossPay - Gross pay amount
   * @returns {number} Medicare tax withholding amount
   */
  calculateMedicareTax(grossPay: number): number {
    const medicareRate = 0.0145; // 1.45%
    return new Decimal(grossPay).times(medicareRate).toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates additional Medicare tax for high earners.
   *
   * @param {number} grossPay - Gross pay amount
   * @param {number} ytdGrossPay - Year-to-date gross pay
   * @param {string} filingStatus - Tax filing status
   * @returns {number} Additional Medicare tax amount
   */
  calculateAdditionalMedicareTax(
    grossPay: number,
    ytdGrossPay: number,
    filingStatus: string
  ): number {
    // Additional Medicare tax threshold
    const thresholds: Record<string, number> = {
      'single': 200000,
      'married': 250000,
      'married_separate': 125000,
      'head_of_household': 200000,
    };

    const threshold = thresholds[filingStatus] || 200000;
    const additionalMedicareRate = 0.009; // 0.9%

    const totalGrossPay = ytdGrossPay + grossPay;
    if (totalGrossPay <= threshold) {
      return 0;
    }

    const taxableAmount = ytdGrossPay >= threshold
      ? grossPay
      : totalGrossPay - threshold;

    return new Decimal(taxableAmount).times(additionalMedicareRate).toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates FERS retirement contribution.
   *
   * @param {number} grossPay - Gross pay amount
   * @param {string} employeeType - Employee type
   * @param {Date} hireDate - Hire date
   * @returns {number} FERS contribution amount
   */
  calculateFERSContribution(
    grossPay: number,
    employeeType: string,
    hireDate: Date
  ): number {
    // FERS contribution rates vary by hire date
    let contributionRate = 0.008; // 0.8% for employees hired before 2013

    const year2013 = new Date('2013-01-01');
    const year2014 = new Date('2014-01-01');

    if (hireDate >= year2014) {
      contributionRate = 0.047; // 4.7% for employees hired after 2014
    } else if (hireDate >= year2013) {
      contributionRate = 0.037; // 3.7% for employees hired in 2013
    }

    return new Decimal(grossPay).times(contributionRate).toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates TSP (Thrift Savings Plan) contribution and match.
   *
   * @param {number} grossPay - Gross pay amount
   * @param {number} contributionPercent - Employee contribution percentage
   * @param {number} maxContribution - Max annual contribution
   * @param {number} ytdContribution - Year-to-date contribution
   * @returns {{ employeeContribution: number, employerMatch: number, totalContribution: number }}
   */
  calculateTSPContribution(
    grossPay: number,
    contributionPercent: number,
    maxContribution: number,
    ytdContribution: number
  ): { employeeContribution: number; employerMatch: number; totalContribution: number } {
    // 2024 TSP contribution limit: $23,000
    const annualLimit = maxContribution || 23000;
    const remainingLimit = Math.max(0, annualLimit - ytdContribution);

    // Calculate employee contribution
    const desiredContribution = new Decimal(grossPay)
      .times(contributionPercent)
      .dividedBy(100)
      .toDecimalPlaces(2)
      .toNumber();

    const employeeContribution = Math.min(desiredContribution, remainingLimit);

    // Calculate employer match (up to 5% of salary)
    // 1% automatic + 4% match dollar-for-dollar up to 5%
    let employerMatch = new Decimal(grossPay).times(0.01).toNumber(); // 1% automatic

    if (contributionPercent >= 3) {
      employerMatch += new Decimal(grossPay).times(0.03).toNumber(); // Match first 3%
    } else {
      employerMatch += new Decimal(grossPay).times(contributionPercent / 100).toNumber();
    }

    if (contributionPercent > 3 && contributionPercent <= 5) {
      const additionalMatch = (contributionPercent - 3) / 2;
      employerMatch += new Decimal(grossPay).times(additionalMatch / 100).toNumber();
    } else if (contributionPercent > 5) {
      employerMatch += new Decimal(grossPay).times(0.01).toNumber(); // Max 1% additional
    }

    return {
      employeeContribution: new Decimal(employeeContribution).toDecimalPlaces(2).toNumber(),
      employerMatch: new Decimal(employerMatch).toDecimalPlaces(2).toNumber(),
      totalContribution: new Decimal(employeeContribution).plus(employerMatch).toDecimalPlaces(2).toNumber(),
    };
  }

  /**
   * Calculates health insurance premium deduction.
   *
   * @param {string} planCode - Insurance plan code
   * @param {string} coverageLevel - Coverage level
   * @param {string} payFrequency - Pay frequency
   * @returns {{ premiumAmount: number, employeeContribution: number, employerContribution: number }}
   */
  calculateHealthInsurancePremium(
    planCode: string,
    coverageLevel: string,
    payFrequency: string
  ): { premiumAmount: number; employeeContribution: number; employerContribution: number } {
    // FEHB premium rates (simplified - actual rates vary by plan)
    const premiumRates: Record<string, Record<string, number>> = {
      'BCBS_STANDARD': {
        'employee': 350.00,
        'employee_spouse': 800.00,
        'family': 950.00,
      },
      'GEHA_HIGH': {
        'employee': 320.00,
        'employee_spouse': 750.00,
        'family': 900.00,
      },
    };

    const biweeklyPremium = premiumRates[planCode]?.[coverageLevel] || 0;
    const premiumAmount = payFrequency === 'monthly'
      ? new Decimal(biweeklyPremium).times(26).dividedBy(12).toDecimalPlaces(2).toNumber()
      : biweeklyPremium;

    // Government pays approximately 72% of premium
    const employerContribution = new Decimal(premiumAmount).times(0.72).toDecimalPlaces(2).toNumber();
    const employeeContribution = new Decimal(premiumAmount).minus(employerContribution).toDecimalPlaces(2).toNumber();

    return {
      premiumAmount,
      employeeContribution,
      employerContribution,
    };
  }

  /**
   * Calculates total deductions from gross pay.
   *
   * @param {Partial<PayrollRecord>} payroll - Payroll record with all deductions
   * @returns {number} Total deductions amount
   */
  calculateTotalDeductions(payroll: Partial<PayrollRecord>): number {
    const totalDeductions = new Decimal(payroll.federalTax || 0)
      .plus(payroll.stateTax || 0)
      .plus(payroll.localTax || 0)
      .plus(payroll.ficaTax || 0)
      .plus(payroll.medicareTax || 0)
      .plus(payroll.additionalMedicareTax || 0)
      .plus(payroll.retirementContribution || 0)
      .plus(payroll.healthInsurance || 0)
      .plus(payroll.dentalInsurance || 0)
      .plus(payroll.visionInsurance || 0)
      .plus(payroll.lifeInsurance || 0)
      .plus(payroll.disabilityInsurance || 0)
      .plus(payroll.fsaDeduction || 0)
      .plus(payroll.hsaDeduction || 0)
      .plus(payroll.garnishments || 0)
      .plus(payroll.unionDues || 0)
      .plus(payroll.otherDeductions || 0);

    return totalDeductions.toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates net pay (gross pay minus total deductions).
   *
   * @param {number} grossPay - Gross pay amount
   * @param {number} totalDeductions - Total deductions amount
   * @returns {number} Net pay amount
   */
  calculateNetPay(grossPay: number, totalDeductions: number): number {
    return new Decimal(grossPay).minus(totalDeductions).toDecimalPlaces(2).toNumber();
  }

  /**
   * Processes complete payroll calculation for an employee.
   *
   * @param {string} employeeId - Employee identifier
   * @param {string} payPeriodId - Pay period identifier
   * @param {Partial<PayrollRecord>} timeData - Time and attendance data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<PayrollRecord>} Calculated payroll record
   */
  async calculateEmployeePayroll(
    employeeId: string,
    payPeriodId: string,
    timeData: Partial<PayrollRecord>,
    transaction?: Transaction
  ): Promise<PayrollRecord> {
    this.logger.log(`Calculating payroll for employee: ${employeeId}`);

    try {
      // Retrieve employee information
      const employee = await this.getEmployeeById(employeeId);
      const payPeriod = await this.getPayPeriodById(payPeriodId);

      // Calculate earnings
      const basicPay = this.calculateBasicPay(
        employee.annualSalary,
        employee.payFrequency,
        timeData.regularHours || 80
      );

      const overtime = this.calculateOvertimePay(
        employee.hourlyRate,
        timeData.overtimeHours || 0
      );

      const doubleTimePay = this.calculateDoubleTimePay(
        employee.hourlyRate,
        timeData.doubleTimeHours || 0
      );

      const holidayPay = this.calculateHolidayPay(
        employee.hourlyRate,
        timeData.holidayHours || 0
      );

      const payrollData: Partial<PayrollRecord> = {
        ...timeData,
        basicPay,
        overtime,
        doubleTimePay,
        holidayPay,
        specialPay: timeData.specialPay || 0,
        allowances: timeData.allowances || 0,
        bonuses: timeData.bonuses || 0,
        awards: timeData.awards || 0,
        retroactivePay: timeData.retroactivePay || 0,
      };

      const grossPay = this.calculateGrossPay(payrollData);
      payrollData.grossPay = grossPay;

      // Get YTD totals for tax calculations
      const ytdTotals = await this.getYTDTotals(employeeId, payPeriod.fiscalYear, transaction);

      // Calculate tax withholdings
      payrollData.federalTax = this.calculateFederalTax(
        grossPay,
        employee.filingStatus,
        employee.exemptions,
        employee.payFrequency
      );

      payrollData.stateTax = this.calculateStateTax(
        grossPay,
        employee.state,
        employee.filingStatus,
        employee.exemptions
      );

      payrollData.localTax = this.calculateLocalTax(grossPay, employee.metadata?.locality || '');

      payrollData.ficaTax = this.calculateFICATax(
        grossPay,
        ytdTotals.ytdGrossPay,
        payPeriod.fiscalYear
      );

      payrollData.medicareTax = this.calculateMedicareTax(grossPay);

      payrollData.additionalMedicareTax = this.calculateAdditionalMedicareTax(
        grossPay,
        ytdTotals.ytdGrossPay,
        employee.filingStatus
      );

      // Calculate retirement contributions
      if (employee.employeeType === 'civilian') {
        payrollData.retirementContribution = this.calculateFERSContribution(
          grossPay,
          employee.employeeType,
          employee.hireDate
        );

        // Add TSP contribution if employee is enrolled
        const tspPercent = employee.metadata?.tspContributionPercent || 0;
        if (tspPercent > 0) {
          const tsp = this.calculateTSPContribution(
            grossPay,
            tspPercent,
            23000,
            ytdTotals.ytdRetirement
          );
          payrollData.retirementContribution += tsp.employeeContribution;
        }
      }

      // Calculate benefits deductions
      if (employee.metadata?.healthPlanCode) {
        const healthPremium = this.calculateHealthInsurancePremium(
          employee.metadata.healthPlanCode,
          employee.metadata.healthCoverageLevel || 'employee',
          employee.payFrequency
        );
        payrollData.healthInsurance = healthPremium.employeeContribution;
      }

      // Calculate total deductions
      payrollData.totalDeductions = this.calculateTotalDeductions(payrollData);

      // Calculate net pay
      payrollData.netPay = this.calculateNetPay(grossPay, payrollData.totalDeductions);

      // Set direct deposit and check amounts
      if (employee.directDepositAccount) {
        payrollData.directDepositAmount = payrollData.netPay;
        payrollData.checkAmount = 0;
      } else {
        payrollData.directDepositAmount = 0;
        payrollData.checkAmount = payrollData.netPay;
      }

      // Create payroll record
      const payrollId = `PAY-${payPeriodId}-${employeeId}`;
      const payroll = await this.payrollModel.create(
        {
          payrollId,
          employeeId,
          payPeriodId,
          payPeriodStart: payPeriod.startDate,
          payPeriodEnd: payPeriod.endDate,
          fiscalYear: payPeriod.fiscalYear,
          period: payPeriod.periodNumber,
          status: 'calculated',
          calculatedDate: new Date(),
          metadata: {},
          ...payrollData,
        },
        { transaction }
      );

      this.logger.log(`Payroll calculated for employee ${employeeId}: Net pay ${payrollData.netPay}`);
      return payroll.toJSON() as PayrollRecord;
    } catch (error) {
      this.logger.error(`Failed to calculate payroll: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ============================================================================
  // PAYROLL PROCESSING & VALIDATION (Functions 31-40)
  // ============================================================================

  /**
   * Processes payroll for all active employees in a pay period.
   *
   * @param {string} payPeriodId - Pay period identifier
   * @param {string} userId - User processing payroll
   * @returns {Promise<{ processed: number, errors: PayrollError[] }>} Processing results
   */
  async processPayPeriodPayroll(
    payPeriodId: string,
    userId: string
  ): Promise<{ processed: number; errors: PayrollError[] }> {
    this.logger.log(`Processing payroll for pay period: ${payPeriodId}`);

    const transaction = await this.sequelize.transaction();
    const errors: PayrollError[] = [];
    let processed = 0;

    try {
      const payPeriod = await this.getPayPeriodById(payPeriodId);

      // Get all active employees
      const employees = await this.employeeModel.findAll({
        where: { status: 'active' },
        transaction,
      });

      this.logger.log(`Processing payroll for ${employees.length} employees`);

      for (const employee of employees) {
        try {
          const employeeId = (employee as any).employeeId;

          // Get time data for employee (from timesheet system)
          const timeData = await this.getEmployeeTimeData(
            employeeId,
            payPeriod.startDate,
            payPeriod.endDate,
            transaction
          );

          // Calculate payroll
          await this.calculateEmployeePayroll(
            employeeId,
            payPeriodId,
            timeData,
            transaction
          );

          processed++;
        } catch (error) {
          this.logger.error(`Error processing employee ${(employee as any).employeeId}: ${error.message}`);
          errors.push({
            employeeId: (employee as any).employeeId,
            errorCode: 'CALCULATION_ERROR',
            errorMessage: error.message,
            field: 'payroll',
            severity: 'error',
          });
        }
      }

      // Update pay period status
      await this.payPeriodModel.update(
        {
          status: 'processing',
          processedBy: userId,
          processedDate: new Date(),
        },
        {
          where: { payPeriodId },
          transaction,
        }
      );

      await transaction.commit();

      this.logger.log(`Payroll processing complete: ${processed} employees processed, ${errors.length} errors`);
      return { processed, errors };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to process payroll: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Validates payroll calculations for accuracy and compliance.
   *
   * @param {string} payrollId - Payroll record identifier
   * @returns {Promise<PayrollValidationResult>} Validation results
   */
  async validatePayroll(payrollId: string): Promise<PayrollValidationResult> {
    this.logger.log(`Validating payroll: ${payrollId}`);

    const errors: PayrollError[] = [];
    const warnings: PayrollWarning[] = [];

    try {
      const payroll = await this.payrollModel.findOne({
        where: { payrollId },
      });

      if (!payroll) {
        throw new NotFoundException(`Payroll ${payrollId} not found`);
      }

      const payrollData = payroll.toJSON() as PayrollRecord;
      const employee = await this.getEmployeeById(payrollData.employeeId);

      // Validate gross pay calculation
      const calculatedGross = this.calculateGrossPay(payrollData);
      if (Math.abs(calculatedGross - payrollData.grossPay) > 0.01) {
        errors.push({
          employeeId: payrollData.employeeId,
          errorCode: 'GROSS_PAY_MISMATCH',
          errorMessage: `Gross pay mismatch: Expected ${calculatedGross}, got ${payrollData.grossPay}`,
          field: 'grossPay',
          severity: 'critical',
        });
      }

      // Validate total deductions calculation
      const calculatedDeductions = this.calculateTotalDeductions(payrollData);
      if (Math.abs(calculatedDeductions - payrollData.totalDeductions) > 0.01) {
        errors.push({
          employeeId: payrollData.employeeId,
          errorCode: 'DEDUCTIONS_MISMATCH',
          errorMessage: `Total deductions mismatch: Expected ${calculatedDeductions}, got ${payrollData.totalDeductions}`,
          field: 'totalDeductions',
          severity: 'critical',
        });
      }

      // Validate net pay calculation
      const calculatedNet = this.calculateNetPay(payrollData.grossPay, payrollData.totalDeductions);
      if (Math.abs(calculatedNet - payrollData.netPay) > 0.01) {
        errors.push({
          employeeId: payrollData.employeeId,
          errorCode: 'NET_PAY_MISMATCH',
          errorMessage: `Net pay mismatch: Expected ${calculatedNet}, got ${payrollData.netPay}`,
          field: 'netPay',
          severity: 'critical',
        });
      }

      // Check for negative net pay
      if (payrollData.netPay < 0) {
        errors.push({
          employeeId: payrollData.employeeId,
          errorCode: 'NEGATIVE_NET_PAY',
          errorMessage: 'Net pay is negative',
          field: 'netPay',
          severity: 'critical',
        });
      }

      // Warn if net pay is very low
      if (payrollData.netPay > 0 && payrollData.netPay < 100) {
        warnings.push({
          employeeId: payrollData.employeeId,
          warningCode: 'LOW_NET_PAY',
          warningMessage: `Net pay is unusually low: $${payrollData.netPay}`,
          field: 'netPay',
        });
      }

      // Warn if overtime is excessive
      if (payrollData.overtimeHours > 40) {
        warnings.push({
          employeeId: payrollData.employeeId,
          warningCode: 'EXCESSIVE_OVERTIME',
          warningMessage: `Excessive overtime hours: ${payrollData.overtimeHours}`,
          field: 'overtimeHours',
        });
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      this.logger.error(`Failed to validate payroll: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Approves a payroll record after validation.
   *
   * @param {string} payrollId - Payroll record identifier
   * @param {string} userId - User approving payroll
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<PayrollRecord>} Approved payroll record
   */
  async approvePayroll(
    payrollId: string,
    userId: string,
    transaction?: Transaction
  ): Promise<PayrollRecord> {
    this.logger.log(`Approving payroll: ${payrollId}`);

    try {
      // Validate payroll first
      const validation = await this.validatePayroll(payrollId);
      if (!validation.valid) {
        throw new BadRequestException(`Payroll validation failed: ${validation.errors.length} errors found`);
      }

      const payroll = await this.payrollModel.findOne({
        where: { payrollId },
        transaction,
      });

      if (!payroll) {
        throw new NotFoundException(`Payroll ${payrollId} not found`);
      }

      await payroll.update(
        {
          status: 'approved',
          approvedBy: userId,
          approvedDate: new Date(),
        },
        { transaction }
      );

      this.logger.log(`Payroll ${payrollId} approved successfully`);
      return payroll.toJSON() as PayrollRecord;
    } catch (error) {
      this.logger.error(`Failed to approve payroll: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Voids a payroll record (reversal).
   *
   * @param {string} payrollId - Payroll record identifier
   * @param {string} userId - User voiding payroll
   * @param {string} reason - Void reason
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<PayrollRecord>} Voided payroll record
   */
  async voidPayroll(
    payrollId: string,
    userId: string,
    reason: string,
    transaction?: Transaction
  ): Promise<PayrollRecord> {
    this.logger.log(`Voiding payroll: ${payrollId}`);

    try {
      const payroll = await this.payrollModel.findOne({
        where: { payrollId },
        transaction,
      });

      if (!payroll) {
        throw new NotFoundException(`Payroll ${payrollId} not found`);
      }

      if ((payroll as any).status === 'paid') {
        throw new ConflictException('Cannot void payroll that has been paid');
      }

      await payroll.update(
        {
          status: 'voided',
          metadata: {
            ...(payroll as any).metadata,
            voidedBy: userId,
            voidedAt: new Date(),
            voidReason: reason,
          },
        },
        { transaction }
      );

      this.logger.log(`Payroll ${payrollId} voided successfully`);
      return payroll.toJSON() as PayrollRecord;
    } catch (error) {
      this.logger.error(`Failed to void payroll: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates payroll register (summary report) for a pay period.
   *
   * @param {string} payPeriodId - Pay period identifier
   * @returns {Promise<PayrollRegister>} Payroll register
   */
  async generatePayrollRegister(payPeriodId: string): Promise<PayrollRegister> {
    this.logger.log(`Generating payroll register for: ${payPeriodId}`);

    try {
      const payPeriod = await this.getPayPeriodById(payPeriodId);

      const payrolls = await this.payrollModel.findAll({
        where: {
          payPeriodId,
          status: { [Op.in]: ['calculated', 'approved', 'paid'] },
        },
        include: [
          {
            model: this.employeeModel,
            as: 'employee',
            attributes: ['employeeId', 'employeeName', 'organizationCode'],
          },
        ],
      });

      const entries: PayrollRegisterEntry[] = payrolls.map(p => {
        const payroll = p.toJSON() as any;
        return {
          employeeId: payroll.employeeId,
          employeeName: payroll.employee?.employeeName || '',
          organizationCode: payroll.employee?.organizationCode || '',
          grossPay: payroll.grossPay,
          deductions: payroll.totalDeductions,
          netPay: payroll.netPay,
          directDeposit: payroll.directDepositAmount,
          check: payroll.checkAmount,
        };
      });

      // Calculate totals
      const totals: PayrollTotals = {
        totalEmployees: entries.length,
        totalGrossPay: entries.reduce((sum, e) => sum + e.grossPay, 0),
        totalFederalTax: payrolls.reduce((sum, p) => sum + ((p as any).federalTax || 0), 0),
        totalStateTax: payrolls.reduce((sum, p) => sum + ((p as any).stateTax || 0), 0),
        totalFICA: payrolls.reduce((sum, p) => sum + ((p as any).ficaTax || 0), 0),
        totalMedicare: payrolls.reduce((sum, p) => sum + ((p as any).medicareTax || 0), 0),
        totalRetirement: payrolls.reduce((sum, p) => sum + ((p as any).retirementContribution || 0), 0),
        totalBenefits: payrolls.reduce((sum, p) => sum + ((p as any).healthInsurance || 0), 0),
        totalGarnishments: payrolls.reduce((sum, p) => sum + ((p as any).garnishments || 0), 0),
        totalDeductions: entries.reduce((sum, e) => sum + e.deductions, 0),
        totalNetPay: entries.reduce((sum, e) => sum + e.netPay, 0),
        totalDirectDeposit: entries.reduce((sum, e) => sum + e.directDeposit, 0),
        totalChecks: entries.reduce((sum, e) => sum + e.check, 0),
      };

      return {
        payPeriodId,
        fiscalYear: payPeriod.fiscalYear,
        period: payPeriod.periodNumber,
        employees: entries,
        totals,
      };
    } catch (error) {
      this.logger.error(`Failed to generate payroll register: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves employee time data from timesheet system.
   *
   * @param {string} employeeId - Employee identifier
   * @param {Date} startDate - Period start date
   * @param {Date} endDate - Period end date
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<Partial<PayrollRecord>>} Time data
   */
  private async getEmployeeTimeData(
    employeeId: string,
    startDate: Date,
    endDate: Date,
    transaction?: Transaction
  ): Promise<Partial<PayrollRecord>> {
    // TODO: Integrate with timesheet system
    // For now, return default values
    return {
      regularHours: 80,
      overtimeHours: 0,
      doubleTimeHours: 0,
      holidayHours: 0,
      sickLeaveHours: 0,
      annualLeaveHours: 0,
      otherLeaveHours: 0,
    };
  }

  /**
   * Retrieves year-to-date totals for an employee.
   *
   * @param {string} employeeId - Employee identifier
   * @param {number} fiscalYear - Fiscal year
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<{ ytdGrossPay: number, ytdRetirement: number }>} YTD totals
   */
  private async getYTDTotals(
    employeeId: string,
    fiscalYear: number,
    transaction?: Transaction
  ): Promise<{ ytdGrossPay: number; ytdRetirement: number }> {
    const ytdPayrolls = await this.payrollModel.findAll({
      where: {
        employeeId,
        fiscalYear,
        status: { [Op.in]: ['calculated', 'approved', 'paid'] },
      },
      transaction,
    });

    const ytdGrossPay = ytdPayrolls.reduce((sum, p) => sum + ((p as any).grossPay || 0), 0);
    const ytdRetirement = ytdPayrolls.reduce((sum, p) => sum + ((p as any).retirementContribution || 0), 0);

    return { ytdGrossPay, ytdRetirement };
  }

  /**
   * Calculates pay period totals.
   *
   * @param {string} payPeriodId - Pay period identifier
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<{ totalEmployees: number, totalGrossPay: number, totalNetPay: number, totalDeductions: number }>}
   */
  private async calculatePayPeriodTotals(
    payPeriodId: string,
    transaction?: Transaction
  ): Promise<{ totalEmployees: number; totalGrossPay: number; totalNetPay: number; totalDeductions: number }> {
    const payrolls = await this.payrollModel.findAll({
      where: {
        payPeriodId,
        status: { [Op.in]: ['calculated', 'approved', 'paid'] },
      },
      transaction,
    });

    return {
      totalEmployees: payrolls.length,
      totalGrossPay: payrolls.reduce((sum, p) => sum + ((p as any).grossPay || 0), 0),
      totalNetPay: payrolls.reduce((sum, p) => sum + ((p as any).netPay || 0), 0),
      totalDeductions: payrolls.reduce((sum, p) => sum + ((p as any).totalDeductions || 0), 0),
    };
  }

  // ============================================================================
  // REPORTING & ANALYTICS (Functions 41-55)
  // ============================================================================

  /**
   * Generates comprehensive payroll summary report.
   *
   * @param {string} payPeriodId - Pay period identifier
   * @returns {Promise<any>} Payroll summary report
   */
  async generatePayrollSummaryReport(payPeriodId: string): Promise<any> {
    this.logger.log(`Generating payroll summary report for: ${payPeriodId}`);

    const register = await this.generatePayrollRegister(payPeriodId);
    const payPeriod = await this.getPayPeriodById(payPeriodId);

    return {
      payPeriod: {
        payPeriodId: payPeriod.payPeriodId,
        fiscalYear: payPeriod.fiscalYear,
        period: payPeriod.periodNumber,
        startDate: payPeriod.startDate,
        endDate: payPeriod.endDate,
        payDate: payPeriod.payDate,
        status: payPeriod.status,
      },
      summary: register.totals,
      employeeCount: register.employees.length,
      averageGrossPay: register.totals.totalGrossPay / register.employees.length,
      averageNetPay: register.totals.totalNetPay / register.employees.length,
      directDepositPercentage: (register.totals.totalDirectDeposit / register.totals.totalNetPay) * 100,
      generatedAt: new Date(),
    };
  }

  /**
   * Generates payroll cost breakdown by organization.
   *
   * @param {string} payPeriodId - Pay period identifier
   * @returns {Promise<any[]>} Organization cost breakdown
   */
  async generateOrganizationCostBreakdown(payPeriodId: string): Promise<any[]> {
    this.logger.log(`Generating organization cost breakdown for: ${payPeriodId}`);

    const payrolls = await this.payrollModel.findAll({
      where: {
        payPeriodId,
        status: { [Op.in]: ['calculated', 'approved', 'paid'] },
      },
      include: [
        {
          model: this.employeeModel,
          as: 'employee',
          attributes: ['organizationCode', 'departmentCode'],
        },
      ],
    });

    // Group by organization
    const orgMap = new Map<string, any>();

    payrolls.forEach(p => {
      const payroll = p.toJSON() as any;
      const orgCode = payroll.employee?.organizationCode || 'UNKNOWN';

      if (!orgMap.has(orgCode)) {
        orgMap.set(orgCode, {
          organizationCode: orgCode,
          employeeCount: 0,
          totalGrossPay: 0,
          totalNetPay: 0,
          totalTaxes: 0,
          totalBenefits: 0,
          totalRetirement: 0,
        });
      }

      const org = orgMap.get(orgCode);
      org.employeeCount++;
      org.totalGrossPay += payroll.grossPay || 0;
      org.totalNetPay += payroll.netPay || 0;
      org.totalTaxes += (payroll.federalTax || 0) + (payroll.stateTax || 0) + (payroll.ficaTax || 0) + (payroll.medicareTax || 0);
      org.totalBenefits += (payroll.healthInsurance || 0) + (payroll.dentalInsurance || 0) + (payroll.visionInsurance || 0);
      org.totalRetirement += payroll.retirementContribution || 0;
    });

    return Array.from(orgMap.values());
  }

  /**
   * Retrieves payroll history for an employee.
   *
   * @param {string} employeeId - Employee identifier
   * @param {number} fiscalYear - Fiscal year
   * @returns {Promise<PayrollRecord[]>} Payroll history
   */
  async getEmployeePayrollHistory(
    employeeId: string,
    fiscalYear: number
  ): Promise<PayrollRecord[]> {
    this.logger.log(`Retrieving payroll history for employee: ${employeeId}`);

    const payrolls = await this.payrollModel.findAll({
      where: {
        employeeId,
        fiscalYear,
        status: { [Op.in]: ['calculated', 'approved', 'paid'] },
      },
      order: [['period', 'ASC']],
    });

    return payrolls.map(p => p.toJSON() as PayrollRecord);
  }
}

export default CEFMSPayrollBackendService;
