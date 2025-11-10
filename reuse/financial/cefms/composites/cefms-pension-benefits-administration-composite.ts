/**
 * Lines of Code (LOC) Accounting - Composite File
 *
 * Locator: WC-CEFMS-PBA-001
 * Title: CEFMS Pension Benefits Administration Composite
 * Description: Production-ready composite for USACE pension and OPEB benefits administration
 *
 * This file is part of the White Cross project.
 * Path: reuse/financial/cefms/composites/cefms-pension-benefits-administration-composite.ts
 */

/**
 * UPSTREAM DEPENDENCIES:
 * - reuse/government/government-payroll-benefits-kit.ts (Payroll & benefits processing functions)
 * - reuse/government/fund-accounting-operations-kit.ts (Fund accounting and allocation functions)
 * - reuse/government/compliance-regulatory-tracking-kit.ts (Regulatory compliance tracking)
 *
 * DOWNSTREAM CONSUMERS:
 * - USACE CEFMS financial management system
 * - Federal pension and benefits reporting systems
 * - Actuarial analysis and forecasting systems
 * - Retirement processing workflows
 * - OPEB (Other Post-Employment Benefits) tracking systems
 */

/**
 * COMPREHENSIVE LLM CONTEXT FOR PENSION BENEFITS ADMINISTRATION:
 *
 * This composite provides complete pension and post-employment benefits administration
 * for USACE financial management under GASB 67/68 and GASB 74/75 standards.
 *
 * FUNCTIONAL DOMAINS COVERED:
 * 1. Pension Plan Management - Plan setup, participant enrollment, tier management
 * 2. Actuarial Valuations - Asset/liability calculations, assumption updates, experience studies
 * 3. Employer Contributions - Contribution calculations, rate setting, funding schedules
 * 4. Benefit Calculations - Service credits, benefit formulas, retirement calculations
 * 5. OPEB Administration - Health/life insurance benefits, subsidy tracking, retiree management
 * 6. Liability Tracking - Net pension/OPEB liability, deferred inflows/outflows, amortization
 * 7. Compliance & Reporting - GASB disclosures, funding ratios, sensitivity analysis
 *
 * KEY ACCOUNTING STANDARDS:
 * - GASB 67: Financial Reporting for Pension Plans
 * - GASB 68: Accounting and Financial Reporting for Pensions
 * - GASB 74: Financial Reporting for OPEB Plans
 * - GASB 75: Accounting and Financial Reporting for OPEB
 *
 * ACTUARIAL CONCEPTS:
 * - Entry Age Normal (EAN) actuarial cost method
 * - Total Pension Liability (TPL) and Plan Fiduciary Net Position
 * - Net Pension Liability (NPL) = TPL - Plan Assets
 * - Discount rates, mortality tables, salary increase assumptions
 * - Service cost, interest cost, expected return on assets
 * - Deferred inflows/outflows for assumption/experience changes
 *
 * TECHNICAL INTEGRATIONS:
 * - Pension plan actuarial systems
 * - Payroll systems for contribution deductions
 * - Investment management systems for asset tracking
 * - Human resources systems for employee data
 * - General ledger for pension expense recognition
 *
 * API DESIGN PATTERNS:
 * - Create/update pension plan configurations
 * - Calculate employer contribution requirements
 * - Process actuarial valuations and assumptions
 * - Track benefit service credits and vesting
 * - Generate GASB-compliant disclosure reports
 * - Monitor funding ratios and liability trends
 * - Process retirement benefit payments
 *
 * ERROR HANDLING & VALIDATION:
 * - Validate participant eligibility and vesting requirements
 * - Ensure actuarial assumptions are reasonable and documented
 * - Verify contribution calculations against funding policies
 * - Validate benefit formulas and service credit accruals
 * - Check OPEB subsidy rates and retiree contributions
 * - Ensure compliance with GASB disclosure requirements
 * - Audit trail for all actuarial valuations and assumptions
 */

import { Injectable } from '@nestjs/core';
import { DataTypes, Model, Sequelize, Op } from 'sequelize';

/**
 * ================================
 * TYPESCRIPT TYPE DEFINITIONS
 * ================================
 */

/**
 * Pension plan configuration and setup data
 */
export interface PensionPlanData {
  planId: string;
  planName: string;
  planType: 'defined_benefit' | 'defined_contribution' | 'hybrid';
  sponsorEntityId: string;
  planEffectiveDate: Date;
  planYearEnd: Date;
  benefitFormula?: string;
  vestingSchedule?: string;
  normalRetirementAge: number;
  earlyRetirementAge?: number;
  planStatus: 'active' | 'frozen' | 'terminated';
  participantCount?: number;
  activeParticipants?: number;
  retiredParticipants?: number;
  metadata?: any;
}

/**
 * Actuarial valuation data and assumptions
 */
export interface ActuarialValuationData {
  valuationId: string;
  planId: string;
  valuationDate: Date;
  measurementDate: Date;
  actuaryFirmId?: string;
  actuaryName?: string;
  totalPensionLiability: number;
  planFiduciaryNetPosition: number;
  netPensionLiability: number;
  discountRate: number;
  salaryIncreaseRate?: number;
  inflationRate?: number;
  mortalityTable?: string;
  fundedRatio: number;
  unfundedLiability: number;
  valuationMethod: 'entry_age_normal' | 'projected_unit_credit' | 'aggregate';
  valuationStatus: 'draft' | 'preliminary' | 'final' | 'approved';
  metadata?: any;
}

/**
 * Employer contribution tracking and rate setting
 */
export interface EmployerContributionData {
  contributionId: string;
  planId: string;
  fiscalYear: number;
  payPeriodId?: string;
  contributionType: 'normal_cost' | 'uaal_payment' | 'special_funding' | 'adc';
  contributionRate?: number;
  contributionAmount: number;
  payrollBase?: number;
  contributionDate?: Date;
  fundingMethod?: string;
  amortizationPeriod?: number;
  contributionStatus: 'calculated' | 'accrued' | 'paid' | 'overdue';
  metadata?: any;
}

/**
 * Participant benefit calculation and service credit data
 */
export interface BenefitCalculationData {
  calculationId: string;
  planId: string;
  participantId: string;
  employeeId: string;
  calculationDate: Date;
  retirementDate?: Date;
  totalServiceYears: number;
  creditableService: number;
  finalAverageSalary?: number;
  salaryPeriod?: number;
  benefitMultiplier?: number;
  monthlyBenefitAmount?: number;
  annualBenefitAmount?: number;
  benefitFormula?: string;
  vestingStatus: 'not_vested' | 'partially_vested' | 'fully_vested';
  vestingPercentage: number;
  calculationStatus: 'estimate' | 'preliminary' | 'final' | 'certified';
  metadata?: any;
}

/**
 * OPEB (Other Post-Employment Benefits) plan and tracking data
 */
export interface OPEBPlanData {
  opebId: string;
  planName: string;
  benefitType: 'healthcare' | 'life_insurance' | 'disability' | 'other';
  sponsorEntityId: string;
  planEffectiveDate: Date;
  eligibilityRequirements?: string;
  employerSubsidyRate?: number;
  retireeContributionRate?: number;
  totalOPEBLiability?: number;
  planAssets?: number;
  netOPEBLiability?: number;
  discountRate?: number;
  healthcareTrendRate?: number;
  planStatus: 'active' | 'frozen' | 'terminated';
  metadata?: any;
}

/**
 * Pension and OPEB liability tracking with deferred inflows/outflows
 */
export interface PensionLiabilityData {
  liabilityId: string;
  planId: string;
  fiscalYear: number;
  measurementDate: Date;
  totalPensionLiability: number;
  planFiduciaryNetPosition: number;
  netPensionLiability: number;
  deferredOutflows?: number;
  deferredInflows?: number;
  pensionExpense: number;
  serviceCost?: number;
  interestCost?: number;
  expectedReturnOnAssets?: number;
  amortizationExpense?: number;
  liabilityStatus: 'preliminary' | 'final' | 'audited';
  metadata?: any;
}

/**
 * Retirement processing and benefit payment data
 */
export interface RetirementProcessingData {
  retirementId: string;
  planId: string;
  participantId: string;
  employeeId: string;
  applicationDate: Date;
  retirementDate: Date;
  retirementType: 'normal' | 'early' | 'disability' | 'deferred';
  serviceYears: number;
  monthlyBenefit: number;
  paymentOption: 'single_life' | 'joint_survivor' | 'period_certain';
  beneficiaryId?: string;
  survivorPercentage?: number;
  firstPaymentDate?: Date;
  processingStatus: 'application' | 'calculation' | 'approval' | 'active' | 'suspended';
  approvedBy?: string;
  approvalDate?: Date;
  metadata?: any;
}

/**
 * ================================
 * SEQUELIZE MODEL DEFINITIONS
 * ================================
 */

/**
 * PensionPlan Model - Pension plan configurations
 */
export const createPensionPlanModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'PensionPlan',
    {
      planId: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false,
        comment: 'Unique pension plan identifier',
      },
      planName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Full name of the pension plan',
      },
      planType: {
        type: DataTypes.ENUM('defined_benefit', 'defined_contribution', 'hybrid'),
        allowNull: false,
        comment: 'Type of pension plan',
      },
      sponsorEntityId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'USACE entity sponsoring the plan',
      },
      planEffectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date plan became effective',
      },
      planYearEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Plan fiscal year end date',
      },
      benefitFormula: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Benefit calculation formula description',
      },
      vestingSchedule: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Vesting schedule description',
      },
      normalRetirementAge: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Normal retirement age for participants',
      },
      earlyRetirementAge: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Early retirement age if applicable',
      },
      planStatus: {
        type: DataTypes.ENUM('active', 'frozen', 'terminated'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Current status of pension plan',
      },
      participantCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Total number of plan participants',
      },
      activeParticipants: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Number of active participants',
      },
      retiredParticipants: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Number of retired participants receiving benefits',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional plan metadata',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'pension_plans',
      timestamps: true,
      indexes: [
        { fields: ['sponsorEntityId'] },
        { fields: ['planType'] },
        { fields: ['planStatus'] },
        { fields: ['planYearEnd'] },
      ],
    }
  );
};

/**
 * ActuarialValuation Model - Actuarial valuations and assumptions
 */
export const createActuarialValuationModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'ActuarialValuation',
    {
      valuationId: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false,
        comment: 'Unique valuation identifier',
      },
      planId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Associated pension plan',
      },
      valuationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of actuarial valuation',
      },
      measurementDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'GASB measurement date',
      },
      actuaryFirmId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Actuarial firm performing valuation',
      },
      actuaryName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Name of actuary',
      },
      totalPensionLiability: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total pension liability (TPL)',
      },
      planFiduciaryNetPosition: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Plan fiduciary net position (assets)',
      },
      netPensionLiability: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Net pension liability (NPL) = TPL - Assets',
      },
      discountRate: {
        type: DataTypes.DECIMAL(5, 3),
        allowNull: false,
        comment: 'Discount rate assumption (e.g., 7.000%)',
      },
      salaryIncreaseRate: {
        type: DataTypes.DECIMAL(5, 3),
        allowNull: true,
        comment: 'Salary increase rate assumption',
      },
      inflationRate: {
        type: DataTypes.DECIMAL(5, 3),
        allowNull: true,
        comment: 'Inflation rate assumption',
      },
      mortalityTable: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Mortality table used (e.g., RP-2014)',
      },
      fundedRatio: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Funded ratio (Assets / TPL)',
      },
      unfundedLiability: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Unfunded actuarial accrued liability',
      },
      valuationMethod: {
        type: DataTypes.ENUM('entry_age_normal', 'projected_unit_credit', 'aggregate'),
        allowNull: false,
        comment: 'Actuarial cost method used',
      },
      valuationStatus: {
        type: DataTypes.ENUM('draft', 'preliminary', 'final', 'approved'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Status of actuarial valuation',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional valuation data',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'actuarial_valuations',
      timestamps: true,
      indexes: [
        { fields: ['planId'] },
        { fields: ['valuationDate'] },
        { fields: ['measurementDate'] },
        { fields: ['valuationStatus'] },
        { fields: ['fundedRatio'] },
      ],
    }
  );
};

/**
 * EmployerContribution Model - Employer pension contributions
 */
export const createEmployerContributionModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'EmployerContribution',
    {
      contributionId: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false,
        comment: 'Unique contribution record identifier',
      },
      planId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Associated pension plan',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year for contribution',
      },
      payPeriodId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Pay period if applicable',
      },
      contributionType: {
        type: DataTypes.ENUM('normal_cost', 'uaal_payment', 'special_funding', 'adc'),
        allowNull: false,
        comment: 'Type of contribution (ADC = Actuarially Determined Contribution)',
      },
      contributionRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Contribution rate as percentage of payroll',
      },
      contributionAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Dollar amount of contribution',
      },
      payrollBase: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Payroll base for rate calculation',
      },
      contributionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date contribution was made',
      },
      fundingMethod: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Funding method description',
      },
      amortizationPeriod: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'UAAL amortization period in years',
      },
      contributionStatus: {
        type: DataTypes.ENUM('calculated', 'accrued', 'paid', 'overdue'),
        allowNull: false,
        defaultValue: 'calculated',
        comment: 'Status of contribution',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional contribution metadata',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'employer_contributions',
      timestamps: true,
      indexes: [
        { fields: ['planId'] },
        { fields: ['fiscalYear'] },
        { fields: ['contributionType'] },
        { fields: ['contributionStatus'] },
        { fields: ['contributionDate'] },
      ],
    }
  );
};

/**
 * BenefitCalculation Model - Participant benefit calculations
 */
export const createBenefitCalculationModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'BenefitCalculation',
    {
      calculationId: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false,
        comment: 'Unique calculation identifier',
      },
      planId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Associated pension plan',
      },
      participantId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Unique participant identifier',
      },
      employeeId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Employee ID in HR system',
      },
      calculationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date calculation was performed',
      },
      retirementDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Projected or actual retirement date',
      },
      totalServiceYears: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total years of service',
      },
      creditableService: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Creditable service years for benefit',
      },
      finalAverageSalary: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Final average salary for benefit formula',
      },
      salaryPeriod: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Number of years averaged for FAS (e.g., 3)',
      },
      benefitMultiplier: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: true,
        comment: 'Benefit multiplier (e.g., 0.0200 = 2%)',
      },
      monthlyBenefitAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Calculated monthly benefit amount',
      },
      annualBenefitAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Calculated annual benefit amount',
      },
      benefitFormula: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Benefit formula used for calculation',
      },
      vestingStatus: {
        type: DataTypes.ENUM('not_vested', 'partially_vested', 'fully_vested'),
        allowNull: false,
        comment: 'Current vesting status',
      },
      vestingPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Percentage vested (0-100)',
      },
      calculationStatus: {
        type: DataTypes.ENUM('estimate', 'preliminary', 'final', 'certified'),
        allowNull: false,
        defaultValue: 'estimate',
        comment: 'Status of benefit calculation',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional calculation data',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'benefit_calculations',
      timestamps: true,
      indexes: [
        { fields: ['planId'] },
        { fields: ['participantId'] },
        { fields: ['employeeId'] },
        { fields: ['vestingStatus'] },
        { fields: ['calculationStatus'] },
        { fields: ['retirementDate'] },
      ],
    }
  );
};

/**
 * OPEBPlan Model - Other Post-Employment Benefits plans
 */
export const createOPEBPlanModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'OPEBPlan',
    {
      opebId: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false,
        comment: 'Unique OPEB plan identifier',
      },
      planName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Name of OPEB plan',
      },
      benefitType: {
        type: DataTypes.ENUM('healthcare', 'life_insurance', 'disability', 'other'),
        allowNull: false,
        comment: 'Type of OPEB benefit',
      },
      sponsorEntityId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'USACE entity sponsoring the plan',
      },
      planEffectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date plan became effective',
      },
      eligibilityRequirements: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Eligibility requirements description',
      },
      employerSubsidyRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Employer subsidy rate percentage',
      },
      retireeContributionRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Retiree contribution rate percentage',
      },
      totalOPEBLiability: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Total OPEB liability (GASB 74/75)',
      },
      planAssets: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Plan fiduciary net position',
      },
      netOPEBLiability: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Net OPEB liability',
      },
      discountRate: {
        type: DataTypes.DECIMAL(5, 3),
        allowNull: true,
        comment: 'Discount rate for OPEB liability',
      },
      healthcareTrendRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Healthcare cost trend rate',
      },
      planStatus: {
        type: DataTypes.ENUM('active', 'frozen', 'terminated'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Current status of OPEB plan',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional OPEB plan metadata',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'opeb_plans',
      timestamps: true,
      indexes: [
        { fields: ['benefitType'] },
        { fields: ['sponsorEntityId'] },
        { fields: ['planStatus'] },
      ],
    }
  );
};

/**
 * PensionLiability Model - Pension and OPEB liability tracking
 */
export const createPensionLiabilityModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'PensionLiability',
    {
      liabilityId: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false,
        comment: 'Unique liability record identifier',
      },
      planId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Associated pension/OPEB plan',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year for liability',
      },
      measurementDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'GASB measurement date',
      },
      totalPensionLiability: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total pension/OPEB liability',
      },
      planFiduciaryNetPosition: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Plan assets (fiduciary net position)',
      },
      netPensionLiability: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Net pension/OPEB liability',
      },
      deferredOutflows: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Deferred outflows of resources',
      },
      deferredInflows: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Deferred inflows of resources',
      },
      pensionExpense: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total pension/OPEB expense recognized',
      },
      serviceCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Service cost component',
      },
      interestCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Interest cost component',
      },
      expectedReturnOnAssets: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Expected return on plan assets',
      },
      amortizationExpense: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        comment: 'Amortization of deferred amounts',
      },
      liabilityStatus: {
        type: DataTypes.ENUM('preliminary', 'final', 'audited'),
        allowNull: false,
        defaultValue: 'preliminary',
        comment: 'Status of liability calculation',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional liability tracking data',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'pension_liabilities',
      timestamps: true,
      indexes: [
        { fields: ['planId'] },
        { fields: ['fiscalYear'] },
        { fields: ['measurementDate'] },
        { fields: ['liabilityStatus'] },
      ],
    }
  );
};

/**
 * RetirementProcessing Model - Retirement applications and benefit payments
 */
export const createRetirementProcessingModel = (sequelize: Sequelize) => {
  return sequelize.define(
    'RetirementProcessing',
    {
      retirementId: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false,
        comment: 'Unique retirement record identifier',
      },
      planId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Associated pension plan',
      },
      participantId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Participant identifier',
      },
      employeeId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Employee ID',
      },
      applicationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date retirement application was submitted',
      },
      retirementDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective retirement date',
      },
      retirementType: {
        type: DataTypes.ENUM('normal', 'early', 'disability', 'deferred'),
        allowNull: false,
        comment: 'Type of retirement',
      },
      serviceYears: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Years of creditable service',
      },
      monthlyBenefit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Monthly benefit amount',
      },
      paymentOption: {
        type: DataTypes.ENUM('single_life', 'joint_survivor', 'period_certain'),
        allowNull: false,
        comment: 'Payment option selected',
      },
      beneficiaryId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Beneficiary identifier if applicable',
      },
      survivorPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Survivor benefit percentage (e.g., 50.00%)',
      },
      firstPaymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date of first benefit payment',
      },
      processingStatus: {
        type: DataTypes.ENUM('application', 'calculation', 'approval', 'active', 'suspended'),
        allowNull: false,
        defaultValue: 'application',
        comment: 'Status of retirement processing',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who approved retirement',
      },
      approvalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date retirement was approved',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional retirement data',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'retirement_processing',
      timestamps: true,
      indexes: [
        { fields: ['planId'] },
        { fields: ['participantId'] },
        { fields: ['employeeId'] },
        { fields: ['retirementDate'] },
        { fields: ['retirementType'] },
        { fields: ['processingStatus'] },
      ],
    }
  );
};

/**
 * ================================
 * COMPOSITE FUNCTIONS (39+ Functions)
 * ================================
 */

// ========================================
// GROUP 1: PENSION PLAN MANAGEMENT (1-6)
// ========================================

/**
 * 1. Create a new pension plan configuration
 */
export const createPensionPlan = async (
  planData: PensionPlanData,
  PensionPlan: any,
): Promise<any> => {
  const plan = await PensionPlan.create({
    planId: planData.planId,
    planName: planData.planName,
    planType: planData.planType,
    sponsorEntityId: planData.sponsorEntityId,
    planEffectiveDate: planData.planEffectiveDate,
    planYearEnd: planData.planYearEnd,
    benefitFormula: planData.benefitFormula,
    vestingSchedule: planData.vestingSchedule,
    normalRetirementAge: planData.normalRetirementAge,
    earlyRetirementAge: planData.earlyRetirementAge,
    planStatus: planData.planStatus || 'active',
    participantCount: planData.participantCount || 0,
    activeParticipants: planData.activeParticipants || 0,
    retiredParticipants: planData.retiredParticipants || 0,
    metadata: planData.metadata,
  });
  return plan;
};

/**
 * 2. Update pension plan configuration
 */
export const updatePensionPlan = async (
  planId: string,
  updates: Partial<PensionPlanData>,
  PensionPlan: any,
): Promise<any> => {
  const plan = await PensionPlan.findOne({ where: { planId } });
  if (!plan) throw new Error('Pension plan not found');

  await plan.update(updates);
  return plan;
};

/**
 * 3. Enroll participant in pension plan
 */
export const enrollParticipantInPlan = async (
  planId: string,
  participantId: string,
  employeeId: string,
  enrollmentDate: Date,
  PensionPlan: any,
  BenefitCalculation: any,
): Promise<any> => {
  const plan = await PensionPlan.findOne({ where: { planId } });
  if (!plan) throw new Error('Pension plan not found');

  const enrollment = await BenefitCalculation.create({
    calculationId: `ENROLL-${participantId}-${Date.now()}`,
    planId,
    participantId,
    employeeId,
    calculationDate: enrollmentDate,
    totalServiceYears: 0,
    creditableService: 0,
    vestingStatus: 'not_vested',
    vestingPercentage: 0,
    calculationStatus: 'estimate',
  });

  plan.activeParticipants = (plan.activeParticipants || 0) + 1;
  plan.participantCount = (plan.participantCount || 0) + 1;
  await plan.save();

  return enrollment;
};

/**
 * 4. Update participant service credits
 */
export const updateServiceCredits = async (
  participantId: string,
  serviceYears: number,
  creditableService: number,
  BenefitCalculation: any,
): Promise<any> => {
  const calculations = await BenefitCalculation.findAll({
    where: { participantId },
    order: [['calculationDate', 'DESC']],
  });

  if (calculations.length === 0) throw new Error('No benefit calculations found for participant');

  const latestCalc = calculations[0];
  latestCalc.totalServiceYears = serviceYears;
  latestCalc.creditableService = creditableService;

  // Update vesting based on service years (example: 5-year cliff vesting)
  if (serviceYears >= 5) {
    latestCalc.vestingStatus = 'fully_vested';
    latestCalc.vestingPercentage = 100;
  } else {
    latestCalc.vestingStatus = 'not_vested';
    latestCalc.vestingPercentage = 0;
  }

  await latestCalc.save();
  return latestCalc;
};

/**
 * 5. Calculate participant vesting status
 */
export const calculateVestingStatus = async (
  participantId: string,
  serviceYears: number,
  BenefitCalculation: any,
): Promise<{ vestingStatus: string; vestingPercentage: number }> => {
  // Example vesting schedule: 5-year cliff
  let vestingStatus = 'not_vested';
  let vestingPercentage = 0;

  if (serviceYears >= 5) {
    vestingStatus = 'fully_vested';
    vestingPercentage = 100;
  } else if (serviceYears >= 3) {
    vestingStatus = 'partially_vested';
    vestingPercentage = (serviceYears - 3) * 33.33; // Graded vesting example
  }

  const calculations = await BenefitCalculation.findAll({
    where: { participantId },
    order: [['calculationDate', 'DESC']],
  });

  if (calculations.length > 0) {
    const latestCalc = calculations[0];
    latestCalc.vestingStatus = vestingStatus as any;
    latestCalc.vestingPercentage = vestingPercentage;
    await latestCalc.save();
  }

  return { vestingStatus, vestingPercentage };
};

/**
 * 6. Get pension plan summary with participant counts
 */
export const getPensionPlanSummary = async (
  planId: string,
  PensionPlan: any,
  BenefitCalculation: any,
  RetirementProcessing: any,
): Promise<any> => {
  const plan = await PensionPlan.findOne({ where: { planId } });
  if (!plan) throw new Error('Pension plan not found');

  const totalParticipants = await BenefitCalculation.count({ where: { planId } });
  const vestedParticipants = await BenefitCalculation.count({
    where: {
      planId,
      vestingStatus: { [Op.in]: ['partially_vested', 'fully_vested'] },
    },
  });
  const activeRetirements = await RetirementProcessing.count({
    where: { planId, processingStatus: 'active' },
  });

  return {
    planId: plan.planId,
    planName: plan.planName,
    planType: plan.planType,
    planStatus: plan.planStatus,
    totalParticipants,
    vestedParticipants,
    activeRetirements,
    normalRetirementAge: plan.normalRetirementAge,
  };
};

// ========================================
// GROUP 2: ACTUARIAL VALUATIONS (7-13)
// ========================================

/**
 * 7. Create actuarial valuation record
 */
export const createActuarialValuation = async (
  valuationData: ActuarialValuationData,
  ActuarialValuation: any,
): Promise<any> => {
  const valuation = await ActuarialValuation.create({
    valuationId: valuationData.valuationId,
    planId: valuationData.planId,
    valuationDate: valuationData.valuationDate,
    measurementDate: valuationData.measurementDate,
    actuaryFirmId: valuationData.actuaryFirmId,
    actuaryName: valuationData.actuaryName,
    totalPensionLiability: valuationData.totalPensionLiability,
    planFiduciaryNetPosition: valuationData.planFiduciaryNetPosition,
    netPensionLiability: valuationData.netPensionLiability,
    discountRate: valuationData.discountRate,
    salaryIncreaseRate: valuationData.salaryIncreaseRate,
    inflationRate: valuationData.inflationRate,
    mortalityTable: valuationData.mortalityTable,
    fundedRatio: valuationData.fundedRatio,
    unfundedLiability: valuationData.unfundedLiability,
    valuationMethod: valuationData.valuationMethod,
    valuationStatus: valuationData.valuationStatus || 'draft',
    metadata: valuationData.metadata,
  });
  return valuation;
};

/**
 * 8. Calculate funded ratio from valuation
 */
export const calculateFundedRatio = async (
  planId: string,
  measurementDate: Date,
  ActuarialValuation: any,
): Promise<number> => {
  const valuation = await ActuarialValuation.findOne({
    where: { planId, measurementDate },
    order: [['valuationDate', 'DESC']],
  });

  if (!valuation) throw new Error('No actuarial valuation found for this date');

  const tpl = parseFloat(valuation.totalPensionLiability);
  const assets = parseFloat(valuation.planFiduciaryNetPosition);

  if (tpl === 0) return 0;

  const fundedRatio = (assets / tpl) * 100;
  valuation.fundedRatio = fundedRatio;
  await valuation.save();

  return fundedRatio;
};

/**
 * 9. Update actuarial assumptions
 */
export const updateActuarialAssumptions = async (
  valuationId: string,
  assumptions: {
    discountRate?: number;
    salaryIncreaseRate?: number;
    inflationRate?: number;
    mortalityTable?: string;
  },
  ActuarialValuation: any,
): Promise<any> => {
  const valuation = await ActuarialValuation.findOne({ where: { valuationId } });
  if (!valuation) throw new Error('Actuarial valuation not found');

  if (assumptions.discountRate !== undefined) {
    valuation.discountRate = assumptions.discountRate;
  }
  if (assumptions.salaryIncreaseRate !== undefined) {
    valuation.salaryIncreaseRate = assumptions.salaryIncreaseRate;
  }
  if (assumptions.inflationRate !== undefined) {
    valuation.inflationRate = assumptions.inflationRate;
  }
  if (assumptions.mortalityTable !== undefined) {
    valuation.mortalityTable = assumptions.mortalityTable;
  }

  await valuation.save();
  return valuation;
};

/**
 * 10. Calculate net pension liability (NPL)
 */
export const calculateNetPensionLiability = async (
  valuationId: string,
  ActuarialValuation: any,
): Promise<number> => {
  const valuation = await ActuarialValuation.findOne({ where: { valuationId } });
  if (!valuation) throw new Error('Actuarial valuation not found');

  const tpl = parseFloat(valuation.totalPensionLiability);
  const assets = parseFloat(valuation.planFiduciaryNetPosition);
  const npl = tpl - assets;

  valuation.netPensionLiability = npl;
  valuation.unfundedLiability = Math.max(0, npl);
  await valuation.save();

  return npl;
};

/**
 * 11. Perform actuarial experience study
 */
export const performExperienceStudy = async (
  planId: string,
  studyPeriodStart: Date,
  studyPeriodEnd: Date,
  ActuarialValuation: any,
): Promise<any> => {
  const valuations = await ActuarialValuation.findAll({
    where: {
      planId,
      valuationDate: {
        [Op.between]: [studyPeriodStart, studyPeriodEnd],
      },
    },
    order: [['valuationDate', 'ASC']],
  });

  if (valuations.length === 0) {
    throw new Error('No valuations found in study period');
  }

  const discountRates = valuations.map((v: any) => parseFloat(v.discountRate));
  const avgDiscountRate = discountRates.reduce((sum: number, r: number) => sum + r, 0) / discountRates.length;

  const fundedRatios = valuations.map((v: any) => parseFloat(v.fundedRatio));
  const avgFundedRatio = fundedRatios.reduce((sum: number, r: number) => sum + r, 0) / fundedRatios.length;

  return {
    planId,
    studyPeriod: { start: studyPeriodStart, end: studyPeriodEnd },
    valuationCount: valuations.length,
    avgDiscountRate,
    avgFundedRatio,
    latestFundedRatio: fundedRatios[fundedRatios.length - 1],
    trend: fundedRatios[fundedRatios.length - 1] - fundedRatios[0],
  };
};

/**
 * 12. Generate GASB 67 pension plan disclosure
 */
export const generateGASB67Disclosure = async (
  planId: string,
  measurementDate: Date,
  PensionPlan: any,
  ActuarialValuation: any,
): Promise<any> => {
  const plan = await PensionPlan.findOne({ where: { planId } });
  const valuation = await ActuarialValuation.findOne({
    where: { planId, measurementDate },
    order: [['valuationDate', 'DESC']],
  });

  if (!plan || !valuation) {
    throw new Error('Plan or valuation not found for GASB 67 disclosure');
  }

  return {
    planName: plan.planName,
    measurementDate: valuation.measurementDate,
    totalPensionLiability: valuation.totalPensionLiability,
    planFiduciaryNetPosition: valuation.planFiduciaryNetPosition,
    netPensionLiability: valuation.netPensionLiability,
    fundedRatio: valuation.fundedRatio,
    discountRate: valuation.discountRate,
    mortalityTable: valuation.mortalityTable,
    valuationMethod: valuation.valuationMethod,
    activeMembers: plan.activeParticipants,
    retiredMembers: plan.retiredParticipants,
  };
};

/**
 * 13. Calculate sensitivity analysis for discount rate changes
 */
export const performDiscountRateSensitivity = async (
  valuationId: string,
  rateChangePercentage: number,
  ActuarialValuation: any,
): Promise<any> => {
  const valuation = await ActuarialValuation.findOne({ where: { valuationId } });
  if (!valuation) throw new Error('Actuarial valuation not found');

  const baseRate = parseFloat(valuation.discountRate);
  const baseTpl = parseFloat(valuation.totalPensionLiability);
  const assets = parseFloat(valuation.planFiduciaryNetPosition);

  // Simplified sensitivity: TPL inversely related to discount rate
  const rateIncrease = baseRate + rateChangePercentage;
  const rateDecrease = baseRate - rateChangePercentage;

  const tplIfRateIncreases = baseTpl * (baseRate / rateIncrease);
  const tplIfRateDecreases = baseTpl * (baseRate / rateDecrease);

  return {
    baseDiscountRate: baseRate,
    baseTotalPensionLiability: baseTpl,
    baseNetPensionLiability: baseTpl - assets,
    rateIncreaseScenario: {
      discountRate: rateIncrease,
      totalPensionLiability: tplIfRateIncreases,
      netPensionLiability: tplIfRateIncreases - assets,
    },
    rateDecreaseScenario: {
      discountRate: rateDecrease,
      totalPensionLiability: tplIfRateDecreases,
      netPensionLiability: tplIfRateDecreases - assets,
    },
  };
};

// ========================================
// GROUP 3: EMPLOYER CONTRIBUTIONS (14-20)
// ========================================

/**
 * 14. Calculate annual required contribution (ARC/ADC)
 */
export const calculateAnnualRequiredContribution = async (
  planId: string,
  fiscalYear: number,
  ActuarialValuation: any,
  EmployerContribution: any,
): Promise<any> => {
  const latestValuation = await ActuarialValuation.findOne({
    where: { planId },
    order: [['valuationDate', 'DESC']],
  });

  if (!latestValuation) throw new Error('No actuarial valuation found for plan');

  const unfundedLiability = parseFloat(latestValuation.unfundedLiability);
  const amortizationPeriod = 30; // Example: 30 years
  const discountRate = parseFloat(latestValuation.discountRate) / 100;

  // Simplified ARC calculation: Normal Cost + UAAL Payment
  const normalCost = parseFloat(latestValuation.totalPensionLiability) * 0.05; // Example: 5% of TPL
  const uaalPayment = unfundedLiability * (discountRate / (1 - Math.pow(1 + discountRate, -amortizationPeriod)));

  const adcAmount = normalCost + uaalPayment;

  const contribution = await EmployerContribution.create({
    contributionId: `ADC-${planId}-${fiscalYear}`,
    planId,
    fiscalYear,
    contributionType: 'adc',
    contributionAmount: adcAmount,
    fundingMethod: 'Entry Age Normal with 30-year amortization',
    amortizationPeriod,
    contributionStatus: 'calculated',
    metadata: { normalCost, uaalPayment },
  });

  return contribution;
};

/**
 * 15. Record employer contribution payment
 */
export const recordEmployerContribution = async (
  contributionData: EmployerContributionData,
  EmployerContribution: any,
): Promise<any> => {
  const contribution = await EmployerContribution.create({
    contributionId: contributionData.contributionId,
    planId: contributionData.planId,
    fiscalYear: contributionData.fiscalYear,
    payPeriodId: contributionData.payPeriodId,
    contributionType: contributionData.contributionType,
    contributionRate: contributionData.contributionRate,
    contributionAmount: contributionData.contributionAmount,
    payrollBase: contributionData.payrollBase,
    contributionDate: contributionData.contributionDate,
    fundingMethod: contributionData.fundingMethod,
    amortizationPeriod: contributionData.amortizationPeriod,
    contributionStatus: contributionData.contributionStatus || 'accrued',
    metadata: contributionData.metadata,
  });
  return contribution;
};

/**
 * 16. Update contribution status to paid
 */
export const markContributionAsPaid = async (
  contributionId: string,
  paymentDate: Date,
  EmployerContribution: any,
): Promise<any> => {
  const contribution = await EmployerContribution.findOne({ where: { contributionId } });
  if (!contribution) throw new Error('Contribution record not found');

  contribution.contributionStatus = 'paid';
  contribution.contributionDate = paymentDate;
  await contribution.save();

  return contribution;
};

/**
 * 17. Calculate contribution rate as percentage of payroll
 */
export const calculateContributionRate = async (
  planId: string,
  fiscalYear: number,
  projectedPayroll: number,
  EmployerContribution: any,
): Promise<number> => {
  const contributions = await EmployerContribution.findAll({
    where: { planId, fiscalYear, contributionType: 'adc' },
  });

  if (contributions.length === 0) {
    throw new Error('No ADC calculated for this plan and fiscal year');
  }

  const totalADC = contributions.reduce(
    (sum: number, c: any) => sum + parseFloat(c.contributionAmount),
    0
  );

  const contributionRate = (totalADC / projectedPayroll) * 100;
  return contributionRate;
};

/**
 * 18. Get contribution funding schedule
 */
export const getContributionSchedule = async (
  planId: string,
  fiscalYear: number,
  EmployerContribution: any,
): Promise<any[]> => {
  const contributions = await EmployerContribution.findAll({
    where: { planId, fiscalYear },
    order: [['contributionDate', 'ASC']],
  });

  return contributions.map((c: any) => ({
    contributionId: c.contributionId,
    contributionType: c.contributionType,
    contributionDate: c.contributionDate,
    contributionAmount: c.contributionAmount,
    contributionStatus: c.contributionStatus,
    payPeriodId: c.payPeriodId,
  }));
};

/**
 * 19. Calculate UAAL (Unfunded Actuarial Accrued Liability) payment
 */
export const calculateUAALPayment = async (
  planId: string,
  unfundedLiability: number,
  amortizationYears: number,
  discountRate: number,
  EmployerContribution: any,
): Promise<any> => {
  const rate = discountRate / 100;
  const uaalPayment = unfundedLiability * (rate / (1 - Math.pow(1 + rate, -amortizationYears)));

  const contribution = await EmployerContribution.create({
    contributionId: `UAAL-${planId}-${Date.now()}`,
    planId,
    fiscalYear: new Date().getFullYear(),
    contributionType: 'uaal_payment',
    contributionAmount: uaalPayment,
    fundingMethod: `Level dollar amortization over ${amortizationYears} years`,
    amortizationPeriod: amortizationYears,
    contributionStatus: 'calculated',
    metadata: { unfundedLiability, discountRate },
  });

  return contribution;
};

/**
 * 20. Track contribution funding progress
 */
export const trackFundingProgress = async (
  planId: string,
  fiscalYear: number,
  EmployerContribution: any,
  ActuarialValuation: any,
): Promise<any> => {
  const adcContributions = await EmployerContribution.findAll({
    where: { planId, fiscalYear, contributionType: 'adc' },
  });

  const paidContributions = await EmployerContribution.findAll({
    where: { planId, fiscalYear, contributionStatus: 'paid' },
  });

  const totalADC = adcContributions.reduce(
    (sum: number, c: any) => sum + parseFloat(c.contributionAmount),
    0
  );

  const totalPaid = paidContributions.reduce(
    (sum: number, c: any) => sum + parseFloat(c.contributionAmount),
    0
  );

  const fundingPercentage = totalADC > 0 ? (totalPaid / totalADC) * 100 : 0;

  const latestValuation = await ActuarialValuation.findOne({
    where: { planId },
    order: [['valuationDate', 'DESC']],
  });

  return {
    planId,
    fiscalYear,
    totalADC,
    totalPaid,
    fundingPercentage,
    fundedRatio: latestValuation ? latestValuation.fundedRatio : null,
  };
};

// ========================================
// GROUP 4: BENEFIT CALCULATIONS (21-27)
// ========================================

/**
 * 21. Calculate final average salary (FAS)
 */
export const calculateFinalAverageSalary = async (
  employeeId: string,
  salaryHistory: number[],
  averagingPeriod: number,
): Promise<number> => {
  if (salaryHistory.length < averagingPeriod) {
    throw new Error('Insufficient salary history for FAS calculation');
  }

  const recentSalaries = salaryHistory.slice(-averagingPeriod);
  const totalSalary = recentSalaries.reduce((sum: number, s: number) => sum + s, 0);
  const fas = totalSalary / averagingPeriod;

  return fas;
};

/**
 * 22. Calculate monthly pension benefit
 */
export const calculateMonthlyPensionBenefit = async (
  calculationId: string,
  finalAverageSalary: number,
  serviceYears: number,
  benefitMultiplier: number,
  BenefitCalculation: any,
): Promise<any> => {
  const calculation = await BenefitCalculation.findOne({ where: { calculationId } });
  if (!calculation) throw new Error('Benefit calculation not found');

  const annualBenefit = finalAverageSalary * serviceYears * benefitMultiplier;
  const monthlyBenefit = annualBenefit / 12;

  calculation.finalAverageSalary = finalAverageSalary;
  calculation.benefitMultiplier = benefitMultiplier;
  calculation.annualBenefitAmount = annualBenefit;
  calculation.monthlyBenefitAmount = monthlyBenefit;
  calculation.calculationStatus = 'final';
  await calculation.save();

  return calculation;
};

/**
 * 23. Apply early retirement reduction factor
 */
export const applyEarlyRetirementReduction = async (
  calculationId: string,
  retirementAge: number,
  normalRetirementAge: number,
  reductionPercentagePerYear: number,
  BenefitCalculation: any,
): Promise<any> => {
  const calculation = await BenefitCalculation.findOne({ where: { calculationId } });
  if (!calculation) throw new Error('Benefit calculation not found');

  const yearsEarly = normalRetirementAge - retirementAge;
  if (yearsEarly <= 0) {
    return calculation; // No reduction if retiring at or after normal retirement age
  }

  const reductionPercentage = yearsEarly * reductionPercentagePerYear;
  const reductionFactor = 1 - reductionPercentage / 100;

  const reducedMonthlyBenefit = parseFloat(calculation.monthlyBenefitAmount) * reductionFactor;
  const reducedAnnualBenefit = reducedMonthlyBenefit * 12;

  calculation.monthlyBenefitAmount = reducedMonthlyBenefit;
  calculation.annualBenefitAmount = reducedAnnualBenefit;
  calculation.metadata = {
    ...calculation.metadata,
    earlyRetirementReduction: {
      yearsEarly,
      reductionPercentage,
      reductionFactor,
    },
  };
  await calculation.save();

  return calculation;
};

/**
 * 24. Calculate disability retirement benefit
 */
export const calculateDisabilityBenefit = async (
  participantId: string,
  planId: string,
  serviceYears: number,
  finalAverageSalary: number,
  disabilityPercentage: number,
  BenefitCalculation: any,
): Promise<any> => {
  const calculationId = `DISABILITY-${participantId}-${Date.now()}`;

  // Disability benefit is typically a percentage of FAS or service-based
  const annualBenefit = finalAverageSalary * (disabilityPercentage / 100);
  const monthlyBenefit = annualBenefit / 12;

  const calculation = await BenefitCalculation.create({
    calculationId,
    planId,
    participantId,
    employeeId: participantId, // Simplified
    calculationDate: new Date(),
    totalServiceYears: serviceYears,
    creditableService: serviceYears,
    finalAverageSalary,
    monthlyBenefitAmount: monthlyBenefit,
    annualBenefitAmount: annualBenefit,
    vestingStatus: 'fully_vested', // Disability typically grants full vesting
    vestingPercentage: 100,
    calculationStatus: 'final',
    metadata: { disabilityPercentage },
  });

  return calculation;
};

/**
 * 25. Calculate survivor benefit for joint and survivor option
 */
export const calculateSurvivorBenefit = async (
  retirementId: string,
  survivorPercentage: number,
  RetirementProcessing: any,
): Promise<number> => {
  const retirement = await RetirementProcessing.findOne({ where: { retirementId } });
  if (!retirement) throw new Error('Retirement record not found');

  const monthlyBenefit = parseFloat(retirement.monthlyBenefit);
  const survivorBenefit = monthlyBenefit * (survivorPercentage / 100);

  retirement.survivorPercentage = survivorPercentage;
  retirement.metadata = {
    ...retirement.metadata,
    survivorMonthlyBenefit: survivorBenefit,
  };
  await retirement.save();

  return survivorBenefit;
};

/**
 * 26. Project future benefit at retirement date
 */
export const projectFutureBenefit = async (
  participantId: string,
  projectedRetirementDate: Date,
  currentSalary: number,
  salaryIncreaseRate: number,
  benefitMultiplier: number,
  BenefitCalculation: any,
): Promise<any> => {
  const currentCalculation = await BenefitCalculation.findOne({
    where: { participantId },
    order: [['calculationDate', 'DESC']],
  });

  if (!currentCalculation) throw new Error('No benefit calculation found for participant');

  const yearsToRetirement =
    (projectedRetirementDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 365);

  const projectedServiceYears = parseFloat(currentCalculation.totalServiceYears) + yearsToRetirement;
  const projectedSalary = currentSalary * Math.pow(1 + salaryIncreaseRate / 100, yearsToRetirement);
  const projectedAnnualBenefit = projectedSalary * projectedServiceYears * benefitMultiplier;
  const projectedMonthlyBenefit = projectedAnnualBenefit / 12;

  return {
    participantId,
    projectedRetirementDate,
    projectedServiceYears,
    projectedFinalAverageSalary: projectedSalary,
    projectedMonthlyBenefit,
    projectedAnnualBenefit,
    assumptions: { salaryIncreaseRate, benefitMultiplier },
  };
};

/**
 * 27. Recalculate benefit with updated service credits
 */
export const recalculateBenefitWithUpdatedCredits = async (
  calculationId: string,
  newServiceYears: number,
  newCreditableService: number,
  BenefitCalculation: any,
): Promise<any> => {
  const calculation = await BenefitCalculation.findOne({ where: { calculationId } });
  if (!calculation) throw new Error('Benefit calculation not found');

  calculation.totalServiceYears = newServiceYears;
  calculation.creditableService = newCreditableService;

  if (calculation.finalAverageSalary && calculation.benefitMultiplier) {
    const annualBenefit =
      parseFloat(calculation.finalAverageSalary) *
      newCreditableService *
      parseFloat(calculation.benefitMultiplier);
    calculation.annualBenefitAmount = annualBenefit;
    calculation.monthlyBenefitAmount = annualBenefit / 12;
  }

  await calculation.save();
  return calculation;
};

// ========================================
// GROUP 5: OPEB ADMINISTRATION (28-33)
// ========================================

/**
 * 28. Create OPEB plan
 */
export const createOPEBPlan = async (
  opebData: OPEBPlanData,
  OPEBPlan: any,
): Promise<any> => {
  const plan = await OPEBPlan.create({
    opebId: opebData.opebId,
    planName: opebData.planName,
    benefitType: opebData.benefitType,
    sponsorEntityId: opebData.sponsorEntityId,
    planEffectiveDate: opebData.planEffectiveDate,
    eligibilityRequirements: opebData.eligibilityRequirements,
    employerSubsidyRate: opebData.employerSubsidyRate,
    retireeContributionRate: opebData.retireeContributionRate,
    totalOPEBLiability: opebData.totalOPEBLiability,
    planAssets: opebData.planAssets,
    netOPEBLiability: opebData.netOPEBLiability,
    discountRate: opebData.discountRate,
    healthcareTrendRate: opebData.healthcareTrendRate,
    planStatus: opebData.planStatus || 'active',
    metadata: opebData.metadata,
  });
  return plan;
};

/**
 * 29. Calculate net OPEB liability
 */
export const calculateNetOPEBLiability = async (
  opebId: string,
  totalOPEBLiability: number,
  planAssets: number,
  OPEBPlan: any,
): Promise<number> => {
  const plan = await OPEBPlan.findOne({ where: { opebId } });
  if (!plan) throw new Error('OPEB plan not found');

  const netOPEBLiability = totalOPEBLiability - planAssets;
  plan.totalOPEBLiability = totalOPEBLiability;
  plan.planAssets = planAssets;
  plan.netOPEBLiability = netOPEBLiability;
  await plan.save();

  return netOPEBLiability;
};

/**
 * 30. Track retiree healthcare subsidy
 */
export const trackRetireeHealthcareSubsidy = async (
  opebId: string,
  retireeId: string,
  monthlyPremium: number,
  employerSubsidyRate: number,
  OPEBPlan: any,
): Promise<any> => {
  const plan = await OPEBPlan.findOne({ where: { opebId } });
  if (!plan) throw new Error('OPEB plan not found');

  const employerSubsidy = monthlyPremium * (employerSubsidyRate / 100);
  const retireeContribution = monthlyPremium - employerSubsidy;

  return {
    opebId,
    retireeId,
    monthlyPremium,
    employerSubsidy,
    retireeContribution,
    employerSubsidyRate,
  };
};

/**
 * 31. Calculate OPEB actuarial liability
 */
export const calculateOPEBActuarialLiability = async (
  opebId: string,
  projectedBenefitPayments: number[],
  discountRate: number,
  OPEBPlan: any,
): Promise<number> => {
  const plan = await OPEBPlan.findOne({ where: { opebId } });
  if (!plan) throw new Error('OPEB plan not found');

  const rate = discountRate / 100;
  let totalLiability = 0;

  projectedBenefitPayments.forEach((payment, year) => {
    const presentValue = payment / Math.pow(1 + rate, year + 1);
    totalLiability += presentValue;
  });

  plan.totalOPEBLiability = totalLiability;
  plan.netOPEBLiability = totalLiability - (parseFloat(plan.planAssets) || 0);
  await plan.save();

  return totalLiability;
};

/**
 * 32. Generate GASB 74/75 OPEB disclosure
 */
export const generateGASB74_75Disclosure = async (
  opebId: string,
  measurementDate: Date,
  OPEBPlan: any,
): Promise<any> => {
  const plan = await OPEBPlan.findOne({ where: { opebId } });
  if (!plan) throw new Error('OPEB plan not found');

  return {
    planName: plan.planName,
    benefitType: plan.benefitType,
    measurementDate,
    totalOPEBLiability: plan.totalOPEBLiability,
    planFiduciaryNetPosition: plan.planAssets,
    netOPEBLiability: plan.netOPEBLiability,
    discountRate: plan.discountRate,
    healthcareTrendRate: plan.healthcareTrendRate,
    employerSubsidyRate: plan.employerSubsidyRate,
    planStatus: plan.planStatus,
  };
};

/**
 * 33. Update healthcare cost trend rates
 */
export const updateHealthcareTrendRate = async (
  opebId: string,
  newTrendRate: number,
  OPEBPlan: any,
): Promise<any> => {
  const plan = await OPEBPlan.findOne({ where: { opebId } });
  if (!plan) throw new Error('OPEB plan not found');

  plan.healthcareTrendRate = newTrendRate;
  await plan.save();

  return plan;
};

// ========================================
// GROUP 6: LIABILITY TRACKING (34-37)
// ========================================

/**
 * 34. Record pension liability for fiscal year
 */
export const recordPensionLiability = async (
  liabilityData: PensionLiabilityData,
  PensionLiability: any,
): Promise<any> => {
  const liability = await PensionLiability.create({
    liabilityId: liabilityData.liabilityId,
    planId: liabilityData.planId,
    fiscalYear: liabilityData.fiscalYear,
    measurementDate: liabilityData.measurementDate,
    totalPensionLiability: liabilityData.totalPensionLiability,
    planFiduciaryNetPosition: liabilityData.planFiduciaryNetPosition,
    netPensionLiability: liabilityData.netPensionLiability,
    deferredOutflows: liabilityData.deferredOutflows,
    deferredInflows: liabilityData.deferredInflows,
    pensionExpense: liabilityData.pensionExpense,
    serviceCost: liabilityData.serviceCost,
    interestCost: liabilityData.interestCost,
    expectedReturnOnAssets: liabilityData.expectedReturnOnAssets,
    amortizationExpense: liabilityData.amortizationExpense,
    liabilityStatus: liabilityData.liabilityStatus || 'preliminary',
    metadata: liabilityData.metadata,
  });
  return liability;
};

/**
 * 35. Calculate pension expense components (GASB 68)
 */
export const calculatePensionExpense = async (
  liabilityId: string,
  serviceCost: number,
  interestCost: number,
  expectedReturnOnAssets: number,
  amortizationExpense: number,
  PensionLiability: any,
): Promise<any> => {
  const liability = await PensionLiability.findOne({ where: { liabilityId } });
  if (!liability) throw new Error('Pension liability record not found');

  const totalExpense = serviceCost + interestCost - expectedReturnOnAssets + amortizationExpense;

  liability.serviceCost = serviceCost;
  liability.interestCost = interestCost;
  liability.expectedReturnOnAssets = expectedReturnOnAssets;
  liability.amortizationExpense = amortizationExpense;
  liability.pensionExpense = totalExpense;
  await liability.save();

  return liability;
};

/**
 * 36. Track deferred inflows and outflows
 */
export const trackDeferredInflowsOutflows = async (
  liabilityId: string,
  deferredOutflows: number,
  deferredInflows: number,
  PensionLiability: any,
): Promise<any> => {
  const liability = await PensionLiability.findOne({ where: { liabilityId } });
  if (!liability) throw new Error('Pension liability record not found');

  liability.deferredOutflows = deferredOutflows;
  liability.deferredInflows = deferredInflows;
  await liability.save();

  return liability;
};

/**
 * 37. Get pension liability trend analysis
 */
export const getPensionLiabilityTrend = async (
  planId: string,
  yearsBack: number,
  PensionLiability: any,
): Promise<any[]> => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - yearsBack;

  const liabilities = await PensionLiability.findAll({
    where: {
      planId,
      fiscalYear: { [Op.gte]: startYear },
    },
    order: [['fiscalYear', 'ASC']],
  });

  return liabilities.map((l: any) => ({
    fiscalYear: l.fiscalYear,
    totalPensionLiability: l.totalPensionLiability,
    planFiduciaryNetPosition: l.planFiduciaryNetPosition,
    netPensionLiability: l.netPensionLiability,
    pensionExpense: l.pensionExpense,
    fundedRatio: (parseFloat(l.planFiduciaryNetPosition) / parseFloat(l.totalPensionLiability)) * 100,
  }));
};

// ========================================
// GROUP 7: RETIREMENT PROCESSING (38-39)
// ========================================

/**
 * 38. Process retirement application
 */
export const processRetirementApplication = async (
  retirementData: RetirementProcessingData,
  RetirementProcessing: any,
  BenefitCalculation: any,
): Promise<any> => {
  // Get latest benefit calculation for participant
  const benefitCalc = await BenefitCalculation.findOne({
    where: { participantId: retirementData.participantId },
    order: [['calculationDate', 'DESC']],
  });

  if (!benefitCalc) throw new Error('No benefit calculation found for participant');

  const retirement = await RetirementProcessing.create({
    retirementId: retirementData.retirementId,
    planId: retirementData.planId,
    participantId: retirementData.participantId,
    employeeId: retirementData.employeeId,
    applicationDate: retirementData.applicationDate,
    retirementDate: retirementData.retirementDate,
    retirementType: retirementData.retirementType,
    serviceYears: benefitCalc.totalServiceYears,
    monthlyBenefit: benefitCalc.monthlyBenefitAmount || 0,
    paymentOption: retirementData.paymentOption,
    beneficiaryId: retirementData.beneficiaryId,
    survivorPercentage: retirementData.survivorPercentage,
    firstPaymentDate: retirementData.firstPaymentDate,
    processingStatus: retirementData.processingStatus || 'application',
    approvedBy: retirementData.approvedBy,
    approvalDate: retirementData.approvalDate,
    metadata: retirementData.metadata,
  });

  return retirement;
};

/**
 * 39. Approve retirement and activate benefit payments
 */
export const approveRetirement = async (
  retirementId: string,
  approvedBy: string,
  firstPaymentDate: Date,
  RetirementProcessing: any,
  PensionPlan: any,
): Promise<any> => {
  const retirement = await RetirementProcessing.findOne({ where: { retirementId } });
  if (!retirement) throw new Error('Retirement record not found');

  retirement.processingStatus = 'active';
  retirement.approvedBy = approvedBy;
  retirement.approvalDate = new Date();
  retirement.firstPaymentDate = firstPaymentDate;
  await retirement.save();

  // Update plan participant counts
  const plan = await PensionPlan.findOne({ where: { planId: retirement.planId } });
  if (plan) {
    plan.activeParticipants = Math.max(0, (plan.activeParticipants || 0) - 1);
    plan.retiredParticipants = (plan.retiredParticipants || 0) + 1;
    await plan.save();
  }

  return retirement;
};

/**
 * ================================
 * NESTJS SERVICE CLASS
 * ================================
 */

@Injectable()
export class CEFMSPensionBenefitsAdministrationService {
  constructor(
    private PensionPlan: any,
    private ActuarialValuation: any,
    private EmployerContribution: any,
    private BenefitCalculation: any,
    private OPEBPlan: any,
    private PensionLiability: any,
    private RetirementProcessing: any,
  ) {}

  // Pension Plan Management
  async createPensionPlan(planData: PensionPlanData) {
    return createPensionPlan(planData, this.PensionPlan);
  }

  async updatePensionPlan(planId: string, updates: Partial<PensionPlanData>) {
    return updatePensionPlan(planId, updates, this.PensionPlan);
  }

  async enrollParticipantInPlan(
    planId: string,
    participantId: string,
    employeeId: string,
    enrollmentDate: Date,
  ) {
    return enrollParticipantInPlan(
      planId,
      participantId,
      employeeId,
      enrollmentDate,
      this.PensionPlan,
      this.BenefitCalculation,
    );
  }

  async updateServiceCredits(participantId: string, serviceYears: number, creditableService: number) {
    return updateServiceCredits(participantId, serviceYears, creditableService, this.BenefitCalculation);
  }

  async calculateVestingStatus(participantId: string, serviceYears: number) {
    return calculateVestingStatus(participantId, serviceYears, this.BenefitCalculation);
  }

  async getPensionPlanSummary(planId: string) {
    return getPensionPlanSummary(
      planId,
      this.PensionPlan,
      this.BenefitCalculation,
      this.RetirementProcessing,
    );
  }

  // Actuarial Valuations
  async createActuarialValuation(valuationData: ActuarialValuationData) {
    return createActuarialValuation(valuationData, this.ActuarialValuation);
  }

  async calculateFundedRatio(planId: string, measurementDate: Date) {
    return calculateFundedRatio(planId, measurementDate, this.ActuarialValuation);
  }

  async updateActuarialAssumptions(valuationId: string, assumptions: any) {
    return updateActuarialAssumptions(valuationId, assumptions, this.ActuarialValuation);
  }

  async calculateNetPensionLiability(valuationId: string) {
    return calculateNetPensionLiability(valuationId, this.ActuarialValuation);
  }

  async performExperienceStudy(planId: string, studyPeriodStart: Date, studyPeriodEnd: Date) {
    return performExperienceStudy(planId, studyPeriodStart, studyPeriodEnd, this.ActuarialValuation);
  }

  async generateGASB67Disclosure(planId: string, measurementDate: Date) {
    return generateGASB67Disclosure(planId, measurementDate, this.PensionPlan, this.ActuarialValuation);
  }

  async performDiscountRateSensitivity(valuationId: string, rateChangePercentage: number) {
    return performDiscountRateSensitivity(valuationId, rateChangePercentage, this.ActuarialValuation);
  }

  // Employer Contributions
  async calculateAnnualRequiredContribution(planId: string, fiscalYear: number) {
    return calculateAnnualRequiredContribution(
      planId,
      fiscalYear,
      this.ActuarialValuation,
      this.EmployerContribution,
    );
  }

  async recordEmployerContribution(contributionData: EmployerContributionData) {
    return recordEmployerContribution(contributionData, this.EmployerContribution);
  }

  async markContributionAsPaid(contributionId: string, paymentDate: Date) {
    return markContributionAsPaid(contributionId, paymentDate, this.EmployerContribution);
  }

  async calculateContributionRate(planId: string, fiscalYear: number, projectedPayroll: number) {
    return calculateContributionRate(planId, fiscalYear, projectedPayroll, this.EmployerContribution);
  }

  async getContributionSchedule(planId: string, fiscalYear: number) {
    return getContributionSchedule(planId, fiscalYear, this.EmployerContribution);
  }

  async calculateUAALPayment(
    planId: string,
    unfundedLiability: number,
    amortizationYears: number,
    discountRate: number,
  ) {
    return calculateUAALPayment(
      planId,
      unfundedLiability,
      amortizationYears,
      discountRate,
      this.EmployerContribution,
    );
  }

  async trackFundingProgress(planId: string, fiscalYear: number) {
    return trackFundingProgress(planId, fiscalYear, this.EmployerContribution, this.ActuarialValuation);
  }

  // Benefit Calculations
  async calculateFinalAverageSalary(employeeId: string, salaryHistory: number[], averagingPeriod: number) {
    return calculateFinalAverageSalary(employeeId, salaryHistory, averagingPeriod);
  }

  async calculateMonthlyPensionBenefit(
    calculationId: string,
    finalAverageSalary: number,
    serviceYears: number,
    benefitMultiplier: number,
  ) {
    return calculateMonthlyPensionBenefit(
      calculationId,
      finalAverageSalary,
      serviceYears,
      benefitMultiplier,
      this.BenefitCalculation,
    );
  }

  async applyEarlyRetirementReduction(
    calculationId: string,
    retirementAge: number,
    normalRetirementAge: number,
    reductionPercentagePerYear: number,
  ) {
    return applyEarlyRetirementReduction(
      calculationId,
      retirementAge,
      normalRetirementAge,
      reductionPercentagePerYear,
      this.BenefitCalculation,
    );
  }

  async calculateDisabilityBenefit(
    participantId: string,
    planId: string,
    serviceYears: number,
    finalAverageSalary: number,
    disabilityPercentage: number,
  ) {
    return calculateDisabilityBenefit(
      participantId,
      planId,
      serviceYears,
      finalAverageSalary,
      disabilityPercentage,
      this.BenefitCalculation,
    );
  }

  async calculateSurvivorBenefit(retirementId: string, survivorPercentage: number) {
    return calculateSurvivorBenefit(retirementId, survivorPercentage, this.RetirementProcessing);
  }

  async projectFutureBenefit(
    participantId: string,
    projectedRetirementDate: Date,
    currentSalary: number,
    salaryIncreaseRate: number,
    benefitMultiplier: number,
  ) {
    return projectFutureBenefit(
      participantId,
      projectedRetirementDate,
      currentSalary,
      salaryIncreaseRate,
      benefitMultiplier,
      this.BenefitCalculation,
    );
  }

  async recalculateBenefitWithUpdatedCredits(
    calculationId: string,
    newServiceYears: number,
    newCreditableService: number,
  ) {
    return recalculateBenefitWithUpdatedCredits(
      calculationId,
      newServiceYears,
      newCreditableService,
      this.BenefitCalculation,
    );
  }

  // OPEB Administration
  async createOPEBPlan(opebData: OPEBPlanData) {
    return createOPEBPlan(opebData, this.OPEBPlan);
  }

  async calculateNetOPEBLiability(opebId: string, totalOPEBLiability: number, planAssets: number) {
    return calculateNetOPEBLiability(opebId, totalOPEBLiability, planAssets, this.OPEBPlan);
  }

  async trackRetireeHealthcareSubsidy(
    opebId: string,
    retireeId: string,
    monthlyPremium: number,
    employerSubsidyRate: number,
  ) {
    return trackRetireeHealthcareSubsidy(
      opebId,
      retireeId,
      monthlyPremium,
      employerSubsidyRate,
      this.OPEBPlan,
    );
  }

  async calculateOPEBActuarialLiability(
    opebId: string,
    projectedBenefitPayments: number[],
    discountRate: number,
  ) {
    return calculateOPEBActuarialLiability(opebId, projectedBenefitPayments, discountRate, this.OPEBPlan);
  }

  async generateGASB74_75Disclosure(opebId: string, measurementDate: Date) {
    return generateGASB74_75Disclosure(opebId, measurementDate, this.OPEBPlan);
  }

  async updateHealthcareTrendRate(opebId: string, newTrendRate: number) {
    return updateHealthcareTrendRate(opebId, newTrendRate, this.OPEBPlan);
  }

  // Liability Tracking
  async recordPensionLiability(liabilityData: PensionLiabilityData) {
    return recordPensionLiability(liabilityData, this.PensionLiability);
  }

  async calculatePensionExpense(
    liabilityId: string,
    serviceCost: number,
    interestCost: number,
    expectedReturnOnAssets: number,
    amortizationExpense: number,
  ) {
    return calculatePensionExpense(
      liabilityId,
      serviceCost,
      interestCost,
      expectedReturnOnAssets,
      amortizationExpense,
      this.PensionLiability,
    );
  }

  async trackDeferredInflowsOutflows(
    liabilityId: string,
    deferredOutflows: number,
    deferredInflows: number,
  ) {
    return trackDeferredInflowsOutflows(
      liabilityId,
      deferredOutflows,
      deferredInflows,
      this.PensionLiability,
    );
  }

  async getPensionLiabilityTrend(planId: string, yearsBack: number) {
    return getPensionLiabilityTrend(planId, yearsBack, this.PensionLiability);
  }

  // Retirement Processing
  async processRetirementApplication(retirementData: RetirementProcessingData) {
    return processRetirementApplication(
      retirementData,
      this.RetirementProcessing,
      this.BenefitCalculation,
    );
  }

  async approveRetirement(retirementId: string, approvedBy: string, firstPaymentDate: Date) {
    return approveRetirement(
      retirementId,
      approvedBy,
      firstPaymentDate,
      this.RetirementProcessing,
      this.PensionPlan,
    );
  }
}

/**
 * ================================
 * DEFAULT EXPORT
 * ================================
 */

export default {
  // Models
  createPensionPlanModel,
  createActuarialValuationModel,
  createEmployerContributionModel,
  createBenefitCalculationModel,
  createOPEBPlanModel,
  createPensionLiabilityModel,
  createRetirementProcessingModel,

  // Pension Plan Management Functions (1-6)
  createPensionPlan,
  updatePensionPlan,
  enrollParticipantInPlan,
  updateServiceCredits,
  calculateVestingStatus,
  getPensionPlanSummary,

  // Actuarial Valuations Functions (7-13)
  createActuarialValuation,
  calculateFundedRatio,
  updateActuarialAssumptions,
  calculateNetPensionLiability,
  performExperienceStudy,
  generateGASB67Disclosure,
  performDiscountRateSensitivity,

  // Employer Contributions Functions (14-20)
  calculateAnnualRequiredContribution,
  recordEmployerContribution,
  markContributionAsPaid,
  calculateContributionRate,
  getContributionSchedule,
  calculateUAALPayment,
  trackFundingProgress,

  // Benefit Calculations Functions (21-27)
  calculateFinalAverageSalary,
  calculateMonthlyPensionBenefit,
  applyEarlyRetirementReduction,
  calculateDisabilityBenefit,
  calculateSurvivorBenefit,
  projectFutureBenefit,
  recalculateBenefitWithUpdatedCredits,

  // OPEB Administration Functions (28-33)
  createOPEBPlan,
  calculateNetOPEBLiability,
  trackRetireeHealthcareSubsidy,
  calculateOPEBActuarialLiability,
  generateGASB74_75Disclosure,
  updateHealthcareTrendRate,

  // Liability Tracking Functions (34-37)
  recordPensionLiability,
  calculatePensionExpense,
  trackDeferredInflowsOutflows,
  getPensionLiabilityTrend,

  // Retirement Processing Functions (38-39)
  processRetirementApplication,
  approveRetirement,

  // Service Class
  CEFMSPensionBenefitsAdministrationService,
};
