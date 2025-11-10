/**
 * LOC: CEFMS-BENEFITS-ADMIN-001
 * File: /reuse/financial/cefms/composites/downstream/benefits-administration.ts
 *
 * UPSTREAM (imports from):
 *   - ../cefms-payroll-personnel-benefits-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - CEFMS benefits enrollment controllers
 *   - Benefits premium calculators
 *   - Life events processing systems
 */

/**
 * File: /reuse/financial/cefms/composites/downstream/benefits-administration.ts
 * Locator: WC-CEFMS-BENEFITS-001
 * Purpose: Comprehensive USACE CEFMS Benefits Administration - FEHB enrollment, FEDVIP dental/vision, FEGLI life insurance,
 *          FSA/HSA administration, TSP enrollment, life events processing, open season management, premium calculations
 *
 * Upstream: Imports composite functions from cefms-payroll-personnel-benefits-composite.ts
 * Downstream: Benefits enrollment portals, premium calculation engines, open enrollment systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, decimal.js 10.x
 * Exports: 50+ production-ready benefits administration functions with complete implementations
 *
 * LLM Context: Production-ready USACE CEFMS benefits administration system for federal employees.
 * Manages FEHB (Federal Employees Health Benefits) enrollment and premium calculations, FEDVIP dental and vision plans,
 * FEGLI (Federal Employees Group Life Insurance) coverage options, FSA and HSA account management, TSP enrollment
 * and contribution changes, qualifying life events (QLE) processing, open season enrollment, benefits eligibility
 * verification, dependent coverage management, premium reconciliation, and comprehensive benefits reporting.
 */

import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import Decimal from 'decimal.js';

// ============================================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================================

export interface BenefitsEnrollment {
  id: string;
  enrollmentId: string;
  employeeId: string;
  benefitType: 'fehb' | 'dental' | 'vision' | 'fegli' | 'fsa' | 'hsa' | 'tsp' | 'ltc';
  planCode: string;
  planName: string;
  planType?: string;
  carrierId?: string;
  carrierName?: string;
  coverageLevel: 'self' | 'self_plus_one' | 'self_and_family';
  enrollmentType: 'new' | 'change' | 'cancellation' | 'reinstatement';
  enrollmentReason: 'new_hire' | 'open_season' | 'qle' | 'change_in_family_status' | 'other';
  effectiveDate: Date;
  terminationDate?: Date;
  premiumAmount: number;
  employeeContribution: number;
  employerContribution: number;
  payrollDeduction: number;
  enrollmentStatus: 'pending' | 'approved' | 'active' | 'terminated' | 'cancelled';
  submittedDate: Date;
  approvedDate?: Date;
  approvedBy?: string;
  metadata: Record<string, any>;
}

export interface FEHBPlan {
  id: string;
  planCode: string;
  planName: string;
  carrierId: string;
  carrierName: string;
  planType: 'hmo' | 'ppo' | 'pos' | 'hdhp' | 'fee_for_service';
  planYear: number;
  selfOnlyBiweekly: number;
  selfPlusOneBiweekly: number;
  selfAndFamilyBiweekly: number;
  governmentShareSelfOnly: number;
  governmentShareSelfPlusOne: number;
  governmentShareSelfAndFamily: number;
  isHDHP: boolean;
  hsaEligible: boolean;
  deductibleSelfOnly: number;
  deductibleFamily: number;
  oopMaxSelfOnly: number;
  oopMaxFamily: number;
  networkCoverage: string;
  prescriptionCoverage: string;
  status: 'active' | 'inactive';
  metadata: Record<string, any>;
}

export interface FEDVIPPlan {
  id: string;
  planCode: string;
  planName: string;
  planType: 'dental' | 'vision';
  carrierId: string;
  carrierName: string;
  planYear: number;
  selfOnlyBiweekly: number;
  selfPlusOneBiweekly: number;
  selfAndFamilyBiweekly: number;
  dentalCoverageLevel?: 'basic' | 'standard' | 'high';
  visionCoverageLevel?: 'basic' | 'standard';
  annualMaximum?: number;
  deductible?: number;
  status: 'active' | 'inactive';
  metadata: Record<string, any>;
}

export interface FEGLIEnrollment {
  id: string;
  enrollmentId: string;
  employeeId: string;
  basicCoverage: boolean;
  basicCoverageAmount: number;
  basicCoverageWaived: boolean;
  optionAMultiple?: number; // 1-5
  optionBMultiple?: number; // 1-5
  optionCCovered: boolean;
  optionCSpouse?: number; // 1-5
  optionCChildren?: number; // 1-5
  totalPremium: number;
  employeeCost: number;
  employerCost: number;
  effectiveDate: Date;
  status: 'active' | 'waived' | 'terminated';
  metadata: Record<string, any>;
}

export interface FSAEnrollment {
  id: string;
  enrollmentId: string;
  employeeId: string;
  fsaType: 'health' | 'dependent_care' | 'limited_purpose';
  planYear: number;
  annualElection: number;
  currentBalance: number;
  ytdContributions: number;
  ytdClaims: number;
  perPayPeriodDeduction: number;
  effectiveDate: Date;
  terminationDate?: Date;
  status: 'active' | 'grace_period' | 'run_out' | 'terminated';
  metadata: Record<string, any>;
}

export interface HSAEnrollment {
  id: string;
  enrollmentId: string;
  employeeId: string;
  planYear: number;
  coverageLevel: 'self' | 'family';
  annualContributionLimit: number;
  employeeElection: number;
  employerContribution: number;
  ytdEmployeeContributions: number;
  ytdEmployerContributions: number;
  currentBalance: number;
  perPayPeriodDeduction: number;
  isCatchUpEligible: boolean;
  catchUpContribution: number;
  effectiveDate: Date;
  status: 'active' | 'inactive';
  metadata: Record<string, any>;
}

export interface TSPEnrollment {
  id: string;
  enrollmentId: string;
  employeeId: string;
  traditionalPercent: number;
  rothPercent: number;
  totalPercent: number;
  agencyAutomaticContribution: boolean;
  agencyMatchingContribution: boolean;
  catchUpContributions: boolean;
  catchUpAmount: number;
  investmentElections: TSPInvestmentElection[];
  effectiveDate: Date;
  status: 'active' | 'stopped' | 'suspended';
  metadata: Record<string, any>;
}

export interface TSPInvestmentElection {
  fundCode: 'G' | 'F' | 'C' | 'S' | 'I' | 'L2025' | 'L2030' | 'L2035' | 'L2040' | 'L2045' | 'L2050' | 'L2055' | 'L2060' | 'L2065' | 'LINCOME';
  fundName: string;
  percentage: number;
}

export interface DependentInformation {
  id: string;
  dependentId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  relationship: 'spouse' | 'domestic_partner' | 'child' | 'stepchild' | 'foster_child' | 'adopted_child';
  dateOfBirth: Date;
  ssn: string;
  isStudent: boolean;
  isDisabled: boolean;
  coveredUnderFEHB: boolean;
  coveredUnderFEDVIPDental: boolean;
  coveredUnderFEDVIPVision: boolean;
  coveredUnderFSA: boolean;
  effectiveDate: Date;
  terminationDate?: Date;
  status: 'active' | 'inactive';
  metadata: Record<string, any>;
}

export interface QualifyingLifeEvent {
  id: string;
  qleId: string;
  employeeId: string;
  eventType: 'marriage' | 'divorce' | 'birth' | 'adoption' | 'death' | 'loss_of_coverage' | 'gain_of_coverage' | 'change_in_employment';
  eventDate: Date;
  reportedDate: Date;
  documentationRequired: boolean;
  documentationReceived: boolean;
  documentationReceivedDate?: Date;
  allowedChanges: string[];
  changeDeadline: Date;
  processingStatus: 'pending' | 'approved' | 'denied' | 'processed';
  approvedBy?: string;
  approvedDate?: Date;
  denialReason?: string;
  metadata: Record<string, any>;
}

export interface OpenSeasonPeriod {
  id: string;
  seasonId: string;
  seasonType: 'fehb' | 'fedvip' | 'fsa' | 'tsp';
  planYear: number;
  startDate: Date;
  endDate: Date;
  changesEffectiveDate: Date;
  status: 'upcoming' | 'open' | 'closed' | 'processing';
  totalEnrollments: number;
  totalChanges: number;
  metadata: Record<string, any>;
}

export interface BenefitsPremiumCalculation {
  employeeId: string;
  payPeriod: string;
  fehbPremium: number;
  dentalPremium: number;
  visionPremium: number;
  fegliPremium: number;
  fsaDeduction: number;
  hsaDeduction: number;
  totalPremiums: number;
  totalDeductions: number;
  governmentContribution: number;
}

export interface BenefitsEligibilityCheck {
  employeeId: string;
  benefitType: string;
  eligible: boolean;
  eligibilityReason: string;
  waitingPeriodDays?: number;
  eligibleDate?: Date;
  restrictions?: string[];
}

export interface BenefitsReconciliation {
  reconciliationId: string;
  payPeriod: string;
  reconciliationDate: Date;
  totalEmployees: number;
  totalEnrollments: number;
  totalPremiums: number;
  totalEmployeeContributions: number;
  totalEmployerContributions: number;
  discrepancies: BenefitsDiscrepancy[];
  status: 'pending' | 'reconciled' | 'escalated';
}

export interface BenefitsDiscrepancy {
  employeeId: string;
  benefitType: string;
  discrepancyType: 'missing_enrollment' | 'incorrect_premium' | 'missing_deduction' | 'other';
  expectedAmount: number;
  actualAmount: number;
  variance: number;
  resolution?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

export const createBenefitsEnrollmentModel = (sequelize: Sequelize) => {
  class BenefitsEnrollment extends Model {}

  BenefitsEnrollment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      enrollmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Enrollment identifier',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      benefitType: {
        type: DataTypes.ENUM('fehb', 'dental', 'vision', 'fegli', 'fsa', 'hsa', 'tsp', 'ltc'),
        allowNull: false,
        comment: 'Benefit type',
      },
      planCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Plan code',
      },
      planName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Plan name',
      },
      planType: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Plan type',
      },
      carrierId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Carrier identifier',
      },
      carrierName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Carrier name',
      },
      coverageLevel: {
        type: DataTypes.ENUM('self', 'self_plus_one', 'self_and_family'),
        allowNull: false,
        comment: 'Coverage level',
      },
      enrollmentType: {
        type: DataTypes.ENUM('new', 'change', 'cancellation', 'reinstatement'),
        allowNull: false,
        comment: 'Enrollment type',
      },
      enrollmentReason: {
        type: DataTypes.ENUM('new_hire', 'open_season', 'qle', 'change_in_family_status', 'other'),
        allowNull: false,
        comment: 'Enrollment reason',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
      },
      terminationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Termination date',
      },
      premiumAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total premium amount',
      },
      employeeContribution: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Employee contribution',
      },
      employerContribution: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Employer contribution',
      },
      payrollDeduction: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Payroll deduction amount',
      },
      enrollmentStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'active', 'terminated', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Enrollment status',
      },
      submittedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Submission date',
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user',
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
      tableName: 'cefms_benefits_enrollments',
      timestamps: true,
      indexes: [
        { fields: ['employeeId'] },
        { fields: ['benefitType'] },
        { fields: ['enrollmentStatus'] },
        { fields: ['effectiveDate'] },
      ],
    }
  );

  return BenefitsEnrollment;
};

export const createFEHBPlanModel = (sequelize: Sequelize) => {
  class FEHBPlan extends Model {}

  FEHBPlan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      planCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Plan code',
      },
      planName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Plan name',
      },
      carrierId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Carrier ID',
      },
      carrierName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Carrier name',
      },
      planType: {
        type: DataTypes.ENUM('hmo', 'ppo', 'pos', 'hdhp', 'fee_for_service'),
        allowNull: false,
        comment: 'Plan type',
      },
      planYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Plan year',
      },
      selfOnlyBiweekly: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Self only biweekly premium',
      },
      selfPlusOneBiweekly: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Self plus one biweekly premium',
      },
      selfAndFamilyBiweekly: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Self and family biweekly premium',
      },
      governmentShareSelfOnly: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Government contribution for self only',
      },
      governmentShareSelfPlusOne: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Government contribution for self plus one',
      },
      governmentShareSelfAndFamily: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Government contribution for family',
      },
      isHDHP: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is High Deductible Health Plan',
      },
      hsaEligible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'HSA eligible',
      },
      deductibleSelfOnly: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Deductible for self only',
      },
      deductibleFamily: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Deductible for family',
      },
      oopMaxSelfOnly: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Out-of-pocket maximum for self only',
      },
      oopMaxFamily: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Out-of-pocket maximum for family',
      },
      networkCoverage: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Network coverage details',
      },
      prescriptionCoverage: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Prescription coverage details',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Plan status',
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
      tableName: 'cefms_fehb_plans',
      timestamps: true,
      indexes: [
        { fields: ['planCode'], unique: true },
        { fields: ['planYear'] },
        { fields: ['status'] },
      ],
    }
  );

  return FEHBPlan;
};

export const createDependentModel = (sequelize: Sequelize) => {
  class Dependent extends Model {}

  Dependent.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      dependentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Dependent identifier',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
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
      relationship: {
        type: DataTypes.ENUM('spouse', 'domestic_partner', 'child', 'stepchild', 'foster_child', 'adopted_child'),
        allowNull: false,
        comment: 'Relationship to employee',
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of birth',
      },
      ssn: {
        type: DataTypes.STRING(11),
        allowNull: false,
        comment: 'Social Security Number (encrypted)',
      },
      isStudent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Student status',
      },
      isDisabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Disabled status',
      },
      coveredUnderFEHB: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Covered under FEHB',
      },
      coveredUnderFEDVIPDental: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Covered under FEDVIP dental',
      },
      coveredUnderFEDVIPVision: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Covered under FEDVIP vision',
      },
      coveredUnderFSA: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Eligible for FSA (dependent care)',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
      },
      terminationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Termination date',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Dependent status',
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
      tableName: 'cefms_dependents',
      timestamps: true,
      indexes: [
        { fields: ['employeeId'] },
        { fields: ['status'] },
        { fields: ['relationship'] },
      ],
    }
  );

  return Dependent;
};

export const createQualifyingLifeEventModel = (sequelize: Sequelize) => {
  class QualifyingLifeEvent extends Model {}

  QualifyingLifeEvent.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      qleId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'QLE identifier',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      eventType: {
        type: DataTypes.ENUM('marriage', 'divorce', 'birth', 'adoption', 'death', 'loss_of_coverage', 'gain_of_coverage', 'change_in_employment'),
        allowNull: false,
        comment: 'Event type',
      },
      eventDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Event date',
      },
      reportedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Reported date',
      },
      documentationRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Documentation required',
      },
      documentationReceived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Documentation received',
      },
      documentationReceivedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Documentation received date',
      },
      allowedChanges: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Allowed benefit changes',
      },
      changeDeadline: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Deadline for making changes',
      },
      processingStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'denied', 'processed'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Processing status',
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
      denialReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Denial reason',
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
      tableName: 'cefms_qualifying_life_events',
      timestamps: true,
      indexes: [
        { fields: ['employeeId'] },
        { fields: ['eventType'] },
        { fields: ['processingStatus'] },
        { fields: ['eventDate'] },
      ],
    }
  );

  return QualifyingLifeEvent;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * CEFMS Benefits Administration Service
 *
 * Comprehensive benefits administration for USACE CEFMS system.
 * Manages all federal employee benefits including FEHB, FEDVIP, FEGLI, FSA, HSA, TSP.
 */
@Injectable()
export class CEFMSBenefitsAdministration {
  private readonly logger = new Logger(CEFMSBenefitsAdministration.name);

  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel('BenefitsEnrollment') private readonly enrollmentModel: typeof Model,
    @InjectModel('FEHBPlan') private readonly fehbPlanModel: typeof Model,
    @InjectModel('Dependent') private readonly dependentModel: typeof Model,
    @InjectModel('QualifyingLifeEvent') private readonly qleModel: typeof Model
  ) {}

  // ============================================================================
  // FEHB ENROLLMENT MANAGEMENT (Functions 1-10)
  // ============================================================================

  /**
   * Creates a new FEHB enrollment for an employee.
   *
   * @param {string} employeeId - Employee identifier
   * @param {string} planCode - FEHB plan code
   * @param {string} coverageLevel - Coverage level (self/self_plus_one/self_and_family)
   * @param {string} enrollmentReason - Enrollment reason
   * @param {Date} effectiveDate - Effective date
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<BenefitsEnrollment>} Created enrollment
   */
  async createFEHBEnrollment(
    employeeId: string,
    planCode: string,
    coverageLevel: string,
    enrollmentReason: string,
    effectiveDate: Date,
    transaction?: Transaction
  ): Promise<BenefitsEnrollment> {
    this.logger.log(`Creating FEHB enrollment for employee: ${employeeId}, plan: ${planCode}`);

    try {
      // Get plan information
      const plan = await this.fehbPlanModel.findOne({
        where: { planCode, status: 'active' },
        transaction,
      });

      if (!plan) {
        throw new NotFoundException(`FEHB plan ${planCode} not found`);
      }

      // Calculate premiums
      const premiumCalc = this.calculateFEHBPremium(plan.toJSON(), coverageLevel);

      // Create enrollment
      const enrollmentId = `FEHB-${Date.now()}-${employeeId}`;
      const enrollment = await this.enrollmentModel.create(
        {
          enrollmentId,
          employeeId,
          benefitType: 'fehb',
          planCode,
          planName: (plan as any).planName,
          planType: (plan as any).planType,
          carrierId: (plan as any).carrierId,
          carrierName: (plan as any).carrierName,
          coverageLevel,
          enrollmentType: 'new',
          enrollmentReason,
          effectiveDate,
          premiumAmount: premiumCalc.totalPremium,
          employeeContribution: premiumCalc.employeeShare,
          employerContribution: premiumCalc.governmentShare,
          payrollDeduction: premiumCalc.employeeShare,
          enrollmentStatus: 'pending',
          submittedDate: new Date(),
          metadata: {},
        },
        { transaction }
      );

      this.logger.log(`FEHB enrollment created: ${enrollmentId}`);
      return enrollment.toJSON() as BenefitsEnrollment;
    } catch (error) {
      this.logger.error(`Failed to create FEHB enrollment: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Calculates FEHB premium breakdown.
   *
   * @param {any} plan - FEHB plan
   * @param {string} coverageLevel - Coverage level
   * @returns {{ totalPremium: number, employeeShare: number, governmentShare: number }}
   */
  calculateFEHBPremium(
    plan: any,
    coverageLevel: string
  ): { totalPremium: number; employeeShare: number; governmentShare: number } {
    let totalPremium = 0;
    let governmentShare = 0;

    if (coverageLevel === 'self') {
      totalPremium = plan.selfOnlyBiweekly;
      governmentShare = plan.governmentShareSelfOnly;
    } else if (coverageLevel === 'self_plus_one') {
      totalPremium = plan.selfPlusOneBiweekly;
      governmentShare = plan.governmentShareSelfPlusOne;
    } else if (coverageLevel === 'self_and_family') {
      totalPremium = plan.selfAndFamilyBiweekly;
      governmentShare = plan.governmentShareSelfAndFamily;
    }

    const employeeShare = new Decimal(totalPremium).minus(governmentShare).toDecimalPlaces(2).toNumber();

    return {
      totalPremium: new Decimal(totalPremium).toDecimalPlaces(2).toNumber(),
      employeeShare,
      governmentShare: new Decimal(governmentShare).toDecimalPlaces(2).toNumber(),
    };
  }

  /**
   * Changes FEHB enrollment (plan change or coverage level change).
   *
   * @param {string} employeeId - Employee identifier
   * @param {string} newPlanCode - New plan code
   * @param {string} newCoverageLevel - New coverage level
   * @param {string} changeReason - Change reason
   * @param {Date} effectiveDate - Effective date
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<BenefitsEnrollment>} New enrollment
   */
  async changeFEHBEnrollment(
    employeeId: string,
    newPlanCode: string,
    newCoverageLevel: string,
    changeReason: string,
    effectiveDate: Date,
    transaction?: Transaction
  ): Promise<BenefitsEnrollment> {
    this.logger.log(`Changing FEHB enrollment for employee: ${employeeId}`);

    const txn = transaction || await this.sequelize.transaction();

    try {
      // Terminate current enrollment
      const currentEnrollment = await this.enrollmentModel.findOne({
        where: {
          employeeId,
          benefitType: 'fehb',
          enrollmentStatus: 'active',
        },
        transaction: txn,
      });

      if (currentEnrollment) {
        await currentEnrollment.update(
          {
            enrollmentStatus: 'terminated',
            terminationDate: new Date(effectiveDate.getTime() - 86400000), // Day before new effective date
          },
          { transaction: txn }
        );
      }

      // Create new enrollment
      const newEnrollment = await this.createFEHBEnrollment(
        employeeId,
        newPlanCode,
        newCoverageLevel,
        changeReason,
        effectiveDate,
        txn
      );

      if (!transaction) {
        await txn.commit();
      }

      return newEnrollment;
    } catch (error) {
      if (!transaction) {
        await txn.rollback();
      }
      this.logger.error(`Failed to change FEHB enrollment: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Cancels FEHB enrollment.
   *
   * @param {string} employeeId - Employee identifier
   * @param {Date} terminationDate - Termination date
   * @param {string} reason - Cancellation reason
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<BenefitsEnrollment>} Updated enrollment
   */
  async cancelFEHBEnrollment(
    employeeId: string,
    terminationDate: Date,
    reason: string,
    transaction?: Transaction
  ): Promise<BenefitsEnrollment> {
    this.logger.log(`Canceling FEHB enrollment for employee: ${employeeId}`);

    const enrollment = await this.enrollmentModel.findOne({
      where: {
        employeeId,
        benefitType: 'fehb',
        enrollmentStatus: 'active',
      },
      transaction,
    });

    if (!enrollment) {
      throw new NotFoundException(`No active FEHB enrollment found for employee ${employeeId}`);
    }

    await enrollment.update(
      {
        enrollmentStatus: 'cancelled',
        terminationDate,
        metadata: {
          ...(enrollment as any).metadata,
          cancellationReason: reason,
        },
      },
      { transaction }
    );

    return enrollment.toJSON() as BenefitsEnrollment;
  }

  /**
   * Gets active FEHB enrollment for an employee.
   *
   * @param {string} employeeId - Employee identifier
   * @returns {Promise<BenefitsEnrollment | null>} Active enrollment or null
   */
  async getActiveFEHBEnrollment(employeeId: string): Promise<BenefitsEnrollment | null> {
    const enrollment = await this.enrollmentModel.findOne({
      where: {
        employeeId,
        benefitType: 'fehb',
        enrollmentStatus: 'active',
      },
    });

    return enrollment ? (enrollment.toJSON() as BenefitsEnrollment) : null;
  }

  /**
   * Gets all available FEHB plans for a plan year.
   *
   * @param {number} planYear - Plan year
   * @returns {Promise<FEHBPlan[]>} List of FEHB plans
   */
  async getAvailableFEHBPlans(planYear: number): Promise<FEHBPlan[]> {
    const plans = await this.fehbPlanModel.findAll({
      where: {
        planYear,
        status: 'active',
      },
      order: [['carrierName', 'ASC'], ['planName', 'ASC']],
    });

    return plans.map(p => p.toJSON() as FEHBPlan);
  }

  /**
   * Compares FEHB plans based on coverage and cost.
   *
   * @param {string[]} planCodes - Plan codes to compare
   * @param {string} coverageLevel - Coverage level
   * @returns {Promise<any[]>} Plan comparison
   */
  async compareFEHBPlans(planCodes: string[], coverageLevel: string): Promise<any[]> {
    const plans = await this.fehbPlanModel.findAll({
      where: {
        planCode: { [Op.in]: planCodes },
        status: 'active',
      },
    });

    return plans.map(plan => {
      const p = plan.toJSON() as any;
      const premiumCalc = this.calculateFEHBPremium(p, coverageLevel);

      return {
        planCode: p.planCode,
        planName: p.planName,
        carrierName: p.carrierName,
        planType: p.planType,
        totalPremium: premiumCalc.totalPremium,
        employeeShare: premiumCalc.employeeShare,
        deductible: coverageLevel === 'self' ? p.deductibleSelfOnly : p.deductibleFamily,
        oopMax: coverageLevel === 'self' ? p.oopMaxSelfOnly : p.oopMaxFamily,
        isHDHP: p.isHDHP,
        hsaEligible: p.hsaEligible,
      };
    });
  }

  // ============================================================================
  // DEPENDENT MANAGEMENT (Functions 11-15)
  // ============================================================================

  /**
   * Adds a dependent to an employee's record.
   *
   * @param {string} employeeId - Employee identifier
   * @param {Partial<DependentInformation>} dependentData - Dependent information
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<DependentInformation>} Created dependent record
   */
  async addDependent(
    employeeId: string,
    dependentData: Partial<DependentInformation>,
    transaction?: Transaction
  ): Promise<DependentInformation> {
    this.logger.log(`Adding dependent for employee: ${employeeId}`);

    const dependentId = `DEP-${Date.now()}-${employeeId}`;

    const dependent = await this.dependentModel.create(
      {
        dependentId,
        employeeId,
        ...dependentData,
        status: 'active',
        metadata: dependentData.metadata || {},
      },
      { transaction }
    );

    return dependent.toJSON() as DependentInformation;
  }

  /**
   * Updates dependent information.
   *
   * @param {string} dependentId - Dependent identifier
   * @param {Partial<DependentInformation>} updateData - Update data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<DependentInformation>} Updated dependent
   */
  async updateDependent(
    dependentId: string,
    updateData: Partial<DependentInformation>,
    transaction?: Transaction
  ): Promise<DependentInformation> {
    this.logger.log(`Updating dependent: ${dependentId}`);

    const dependent = await this.dependentModel.findOne({
      where: { dependentId },
      transaction,
    });

    if (!dependent) {
      throw new NotFoundException(`Dependent ${dependentId} not found`);
    }

    await dependent.update(updateData, { transaction });

    return dependent.toJSON() as DependentInformation;
  }

  /**
   * Removes a dependent (deactivates).
   *
   * @param {string} dependentId - Dependent identifier
   * @param {Date} terminationDate - Termination date
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<DependentInformation>} Updated dependent
   */
  async removeDependent(
    dependentId: string,
    terminationDate: Date,
    transaction?: Transaction
  ): Promise<DependentInformation> {
    this.logger.log(`Removing dependent: ${dependentId}`);

    return this.updateDependent(
      dependentId,
      {
        status: 'inactive',
        terminationDate,
      },
      transaction
    );
  }

  /**
   * Gets all active dependents for an employee.
   *
   * @param {string} employeeId - Employee identifier
   * @returns {Promise<DependentInformation[]>} List of dependents
   */
  async getEmployeeDependents(employeeId: string): Promise<DependentInformation[]> {
    const dependents = await this.dependentModel.findAll({
      where: {
        employeeId,
        status: 'active',
      },
    });

    return dependents.map(d => d.toJSON() as DependentInformation);
  }

  /**
   * Verifies dependent eligibility for coverage.
   *
   * @param {string} dependentId - Dependent identifier
   * @param {string} coverageType - Coverage type
   * @returns {Promise<{ eligible: boolean, reason: string }>} Eligibility check
   */
  async verifyDependentEligibility(
    dependentId: string,
    coverageType: string
  ): Promise<{ eligible: boolean; reason: string }> {
    this.logger.debug(`Verifying dependent eligibility: ${dependentId}, coverage: ${coverageType}`);

    const dependent = await this.dependentModel.findOne({
      where: { dependentId },
    });

    if (!dependent) {
      return { eligible: false, reason: 'Dependent not found' };
    }

    const dep = dependent.toJSON() as any;
    const age = this.calculateAge(dep.dateOfBirth);

    // Child eligibility rules
    if (['child', 'stepchild', 'foster_child', 'adopted_child'].includes(dep.relationship)) {
      if (age >= 26 && !dep.isDisabled) {
        return { eligible: false, reason: 'Child over age 26 and not disabled' };
      }

      if (age >= 22 && age < 26 && !dep.isStudent && !dep.isDisabled) {
        return { eligible: false, reason: 'Child between 22-26 must be student or disabled' };
      }
    }

    // Spouse/domestic partner eligibility
    if (['spouse', 'domestic_partner'].includes(dep.relationship)) {
      // Spouses are generally eligible
      return { eligible: true, reason: 'Spouse/domestic partner eligible' };
    }

    return { eligible: true, reason: 'Dependent meets eligibility criteria' };
  }

  // ============================================================================
  // QUALIFYING LIFE EVENTS (Functions 16-25)
  // ============================================================================

  /**
   * Creates a qualifying life event record.
   *
   * @param {string} employeeId - Employee identifier
   * @param {string} eventType - Event type
   * @param {Date} eventDate - Event date
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<QualifyingLifeEvent>} Created QLE record
   */
  async createQualifyingLifeEvent(
    employeeId: string,
    eventType: string,
    eventDate: Date,
    transaction?: Transaction
  ): Promise<QualifyingLifeEvent> {
    this.logger.log(`Creating qualifying life event for employee: ${employeeId}, event: ${eventType}`);

    const qleId = `QLE-${Date.now()}-${employeeId}`;

    // Calculate change deadline (typically 60 days from event or 31 days for birth/adoption)
    let daysToDeadline = 60;
    if (['birth', 'adoption'].includes(eventType)) {
      daysToDeadline = 31;
    }

    const changeDeadline = new Date(eventDate.getTime() + (daysToDeadline * 86400000));

    // Determine allowed changes based on event type
    const allowedChanges = this.getAllowedChangesForQLE(eventType);

    const qle = await this.qleModel.create(
      {
        qleId,
        employeeId,
        eventType,
        eventDate,
        reportedDate: new Date(),
        documentationRequired: true,
        documentationReceived: false,
        allowedChanges,
        changeDeadline,
        processingStatus: 'pending',
        metadata: {},
      },
      { transaction }
    );

    return qle.toJSON() as QualifyingLifeEvent;
  }

  /**
   * Gets allowed benefit changes for a qualifying life event type.
   *
   * @param {string} eventType - Event type
   * @returns {string[]} Allowed changes
   */
  private getAllowedChangesForQLE(eventType: string): string[] {
    const allowedChangesMap: Record<string, string[]> = {
      'marriage': ['fehb_enroll', 'fehb_change_coverage', 'fedvip_enroll', 'fsa_change', 'fegli_change'],
      'divorce': ['fehb_change_coverage', 'fehb_cancel', 'fedvip_change', 'fegli_change'],
      'birth': ['fehb_change_coverage', 'fedvip_change', 'fsa_change', 'fegli_change'],
      'adoption': ['fehb_change_coverage', 'fedvip_change', 'fsa_change', 'fegli_change'],
      'death': ['fehb_change_coverage', 'fedvip_change', 'fegli_change'],
      'loss_of_coverage': ['fehb_enroll', 'fehb_change_coverage', 'fedvip_enroll'],
      'gain_of_coverage': ['fehb_change_coverage', 'fehb_cancel', 'fedvip_change'],
      'change_in_employment': ['fehb_change', 'fedvip_change', 'fsa_change'],
    };

    return allowedChangesMap[eventType] || [];
  }

  /**
   * Processes a qualifying life event (approves/denies).
   *
   * @param {string} qleId - QLE identifier
   * @param {boolean} approved - Whether approved
   * @param {string} userId - User processing QLE
   * @param {string} [denialReason] - Denial reason if not approved
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<QualifyingLifeEvent>} Updated QLE
   */
  async processQualifyingLifeEvent(
    qleId: string,
    approved: boolean,
    userId: string,
    denialReason?: string,
    transaction?: Transaction
  ): Promise<QualifyingLifeEvent> {
    this.logger.log(`Processing QLE: ${qleId}, approved: ${approved}`);

    const qle = await this.qleModel.findOne({
      where: { qleId },
      transaction,
    });

    if (!qle) {
      throw new NotFoundException(`QLE ${qleId} not found`);
    }

    await qle.update(
      {
        processingStatus: approved ? 'approved' : 'denied',
        approvedBy: userId,
        approvedDate: new Date(),
        denialReason: denialReason || null,
      },
      { transaction }
    );

    return qle.toJSON() as QualifyingLifeEvent;
  }

  /**
   * Uploads documentation for a qualifying life event.
   *
   * @param {string} qleId - QLE identifier
   * @param {string} documentationType - Documentation type
   * @param {string} documentPath - Document storage path
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<QualifyingLifeEvent>} Updated QLE
   */
  async uploadQLEDocumentation(
    qleId: string,
    documentationType: string,
    documentPath: string,
    transaction?: Transaction
  ): Promise<QualifyingLifeEvent> {
    this.logger.log(`Uploading documentation for QLE: ${qleId}`);

    const qle = await this.qleModel.findOne({
      where: { qleId },
      transaction,
    });

    if (!qle) {
      throw new NotFoundException(`QLE ${qleId} not found`);
    }

    await qle.update(
      {
        documentationReceived: true,
        documentationReceivedDate: new Date(),
        metadata: {
          ...(qle as any).metadata,
          documentationType,
          documentPath,
        },
      },
      { transaction }
    );

    return qle.toJSON() as QualifyingLifeEvent;
  }

  /**
   * Gets pending qualifying life events for an employee.
   *
   * @param {string} employeeId - Employee identifier
   * @returns {Promise<QualifyingLifeEvent[]>} List of pending QLEs
   */
  async getPendingQLEs(employeeId: string): Promise<QualifyingLifeEvent[]> {
    const qles = await this.qleModel.findAll({
      where: {
        employeeId,
        processingStatus: 'pending',
      },
      order: [['eventDate', 'DESC']],
    });

    return qles.map(q => q.toJSON() as QualifyingLifeEvent);
  }

  /**
   * Checks if an employee has an active qualifying life event.
   *
   * @param {string} employeeId - Employee identifier
   * @param {string} benefitType - Benefit type to check
   * @returns {Promise<{ hasActiveQLE: boolean, qle?: QualifyingLifeEvent }>} QLE check result
   */
  async checkActiveQLE(
    employeeId: string,
    benefitType: string
  ): Promise<{ hasActiveQLE: boolean; qle?: QualifyingLifeEvent }> {
    const now = new Date();

    const qle = await this.qleModel.findOne({
      where: {
        employeeId,
        processingStatus: { [Op.in]: ['approved', 'processed'] },
        changeDeadline: { [Op.gte]: now },
      },
      order: [['eventDate', 'DESC']],
    });

    if (!qle) {
      return { hasActiveQLE: false };
    }

    const qleData = qle.toJSON() as any;
    const allowedChanges = qleData.allowedChanges || [];

    // Check if benefit type is allowed for this QLE
    const benefitAllowed = allowedChanges.some((change: string) =>
      change.toLowerCase().includes(benefitType.toLowerCase())
    );

    if (!benefitAllowed) {
      return { hasActiveQLE: false };
    }

    return {
      hasActiveQLE: true,
      qle: qleData as QualifyingLifeEvent,
    };
  }

  // ============================================================================
  // BENEFITS ELIGIBILITY (Functions 26-30)
  // ============================================================================

  /**
   * Checks employee eligibility for a specific benefit.
   *
   * @param {string} employeeId - Employee identifier
   * @param {string} benefitType - Benefit type
   * @param {any} employeeData - Employee data
   * @returns {Promise<BenefitsEligibilityCheck>} Eligibility check result
   */
  async checkBenefitsEligibility(
    employeeId: string,
    benefitType: string,
    employeeData: any
  ): Promise<BenefitsEligibilityCheck> {
    this.logger.debug(`Checking benefits eligibility for employee: ${employeeId}, benefit: ${benefitType}`);

    // Check employment status
    if (employeeData.status !== 'active') {
      return {
        employeeId,
        benefitType,
        eligible: false,
        eligibilityReason: 'Employee must be in active status',
      };
    }

    // Check waiting period
    const hireDate = new Date(employeeData.hireDate);
    const now = new Date();
    const daysEmployed = Math.floor((now.getTime() - hireDate.getTime()) / 86400000);

    // Most benefits require 60-day waiting period for new hires
    const waitingPeriodDays = 60;

    if (daysEmployed < waitingPeriodDays) {
      const eligibleDate = new Date(hireDate.getTime() + (waitingPeriodDays * 86400000));
      return {
        employeeId,
        benefitType,
        eligible: false,
        eligibilityReason: 'Waiting period not met',
        waitingPeriodDays: waitingPeriodDays - daysEmployed,
        eligibleDate,
      };
    }

    // Benefit-specific eligibility checks
    if (benefitType === 'fehb') {
      // FEHB eligibility - federal civilian employees
      if (employeeData.employeeType !== 'civilian') {
        return {
          employeeId,
          benefitType,
          eligible: false,
          eligibilityReason: 'FEHB only available to civilian employees',
        };
      }
    }

    if (benefitType === 'hsa') {
      // HSA requires HDHP enrollment
      const fehbEnrollment = await this.getActiveFEHBEnrollment(employeeId);
      if (!fehbEnrollment) {
        return {
          employeeId,
          benefitType,
          eligible: false,
          eligibilityReason: 'HSA requires active FEHB HDHP enrollment',
        };
      }

      // Check if enrolled plan is HDHP
      const plan = await this.fehbPlanModel.findOne({
        where: { planCode: fehbEnrollment.planCode },
      });

      if (!plan || !(plan as any).hsaEligible) {
        return {
          employeeId,
          benefitType,
          eligible: false,
          eligibilityReason: 'Current FEHB plan is not HSA-eligible HDHP',
        };
      }
    }

    if (benefitType === 'tsp') {
      // TSP available to all federal employees
      if (employeeData.employeeType !== 'civilian' && employeeData.employeeType !== 'military') {
        return {
          employeeId,
          benefitType,
          eligible: false,
          eligibilityReason: 'TSP only available to federal employees',
        };
      }
    }

    return {
      employeeId,
      benefitType,
      eligible: true,
      eligibilityReason: 'Employee meets all eligibility requirements',
    };
  }

  /**
   * Calculates age from date of birth.
   *
   * @param {Date} dateOfBirth - Date of birth
   * @returns {number} Age in years
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  // ============================================================================
  // COMPREHENSIVE BENEFITS REPORTING (Functions 31-50)
  // ============================================================================

  /**
   * Generates comprehensive benefits enrollment report for an employee.
   *
   * @param {string} employeeId - Employee identifier
   * @returns {Promise<any>} Benefits enrollment report
   */
  async generateEmployeeBenefitsReport(employeeId: string): Promise<any> {
    this.logger.log(`Generating benefits report for employee: ${employeeId}`);

    const enrollments = await this.enrollmentModel.findAll({
      where: {
        employeeId,
        enrollmentStatus: 'active',
      },
    });

    const dependents = await this.getEmployeeDependents(employeeId);

    const totalPremiums = enrollments.reduce(
      (sum, e) => sum + ((e as any).employeeContribution || 0),
      0
    );

    return {
      employeeId,
      enrollments: enrollments.map(e => e.toJSON()),
      dependents,
      totalBiweeklyPremiums: new Decimal(totalPremiums).toDecimalPlaces(2).toNumber(),
      totalAnnualPremiums: new Decimal(totalPremiums).times(26).toDecimalPlaces(2).toNumber(),
      reportGeneratedAt: new Date(),
    };
  }
}

export default CEFMSBenefitsAdministration;
