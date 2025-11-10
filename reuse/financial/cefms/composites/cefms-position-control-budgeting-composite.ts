/**
 * LOC: CEFMSPCB001
 * File: /reuse/financial/cefms/composites/cefms-position-control-budgeting-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../government/position-control-workforce-kit.ts
 *   - ../../government/budget-appropriations-kit.ts
 *   - ../../government/government-payroll-benefits-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS position management services
 *   - USACE workforce planning systems
 *   - Position budgeting modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-position-control-budgeting-composite.ts
 * Locator: WC-CEFMS-PCB-001
 * Purpose: USACE CEFMS Position Control & Budgeting - position management, headcount tracking, salary planning, vacancy management
 *
 * Upstream: Composes utilities from government kits for position control and budgeting
 * Downstream: ../../../backend/cefms/*, Position controllers, workforce planning, budget allocation, organizational management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 41+ composite functions for USACE CEFMS position control and budgeting operations
 *
 * LLM Context: Production-ready USACE CEFMS position control and budgeting system.
 * Comprehensive position lifecycle management, authorized headcount tracking, position budgeting and salary planning,
 * vacancy analysis, position authorization workflows, workforce forecasting, FTE calculations, position funding allocation,
 * classification management, organizational structure hierarchy, position requisition processing, and salary administration.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PositionData {
  positionId: string;
  positionNumber: string;
  positionTitle: string;
  classificationCode: string;
  gradeLevel: string;
  step: number;
  organizationCode: string;
  departmentCode: string;
  supervisorPositionId?: string;
  positionType: 'permanent' | 'temporary' | 'term' | 'seasonal';
  employmentType: 'full_time' | 'part_time' | 'intermittent';
  fte: number;
  status: 'authorized' | 'filled' | 'vacant' | 'frozen' | 'abolished';
  budgetedSalary: number;
  fiscalYear: number;
}

interface PositionBudgetData {
  positionId: string;
  fiscalYear: number;
  budgetedSalary: number;
  budgetedBenefits: number;
  otherCosts: number;
  totalBudgeted: number;
  actualSalary: number;
  actualBenefits: number;
  variance: number;
  fundingSources: FundingSourceData[];
}

interface FundingSourceData {
  fundCode: string;
  accountCode: string;
  percentage: number;
  amount: number;
}

interface PositionClassificationData {
  classificationCode: string;
  classificationTitle: string;
  series: string;
  gradeLevel: string;
  minSalary: number;
  maxSalary: number;
  midSalary: number;
}

interface VacancyData {
  vacancyId: string;
  positionId: string;
  vacancyDate: Date;
  estimatedFillDate?: Date;
  recruitmentStatus: 'open' | 'in_progress' | 'filled' | 'cancelled';
  annualSavings: number;
}

interface PositionRequisitionData {
  requisitionId: string;
  positionId: string;
  requestedBy: string;
  requestDate: Date;
  justification: string;
  status: 'pending' | 'approved' | 'denied' | 'cancelled';
  approvedBy?: string;
  approvedDate?: Date;
}

interface HeadcountData {
  organizationCode: string;
  fiscalYear: number;
  authorizedFTE: number;
  filledFTE: number;
  vacantFTE: number;
  frozenFTE: number;
}

interface SalaryRangeData {
  gradeLevel: string;
  step: number;
  minSalary: number;
  maxSalary: number;
  currentSalary: number;
  localityAdjustment: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Positions with organizational hierarchy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Position model
 *
 * @example
 * ```typescript
 * const Position = createPositionModel(sequelize);
 * const position = await Position.create({
 *   positionNumber: 'POS-001',
 *   positionTitle: 'Civil Engineer',
 *   classificationCode: 'GS-0810',
 *   gradeLevel: 'GS-12',
 *   step: 5,
 *   status: 'authorized',
 *   fte: 1.0
 * });
 * ```
 */
export const createPositionModel = (sequelize: Sequelize) => {
  class Position extends Model {
    public id!: string;
    public positionId!: string;
    public positionNumber!: string;
    public positionTitle!: string;
    public classificationCode!: string;
    public gradeLevel!: string;
    public step!: number;
    public organizationCode!: string;
    public departmentCode!: string;
    public divisionCode!: string | null;
    public supervisorPositionId!: string | null;
    public positionType!: string;
    public employmentType!: string;
    public fte!: number;
    public status!: string;
    public budgetedSalary!: number;
    public actualSalary!: number;
    public incumbentEmployeeId!: string | null;
    public fiscalYear!: number;
    public authorizedDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Position.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      positionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Position identifier',
      },
      positionNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Position number',
      },
      positionTitle: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Position title',
      },
      classificationCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Classification code',
      },
      gradeLevel: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Grade level',
      },
      step: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Step level',
        validate: {
          min: 1,
          max: 10,
        },
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
      supervisorPositionId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Supervisor position',
      },
      positionType: {
        type: DataTypes.ENUM('permanent', 'temporary', 'term', 'seasonal'),
        allowNull: false,
        comment: 'Position type',
      },
      employmentType: {
        type: DataTypes.ENUM('full_time', 'part_time', 'intermittent'),
        allowNull: false,
        comment: 'Employment type',
      },
      fte: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 1.0,
        comment: 'Full-time equivalent',
        validate: {
          min: 0.01,
          max: 1.0,
        },
      },
      status: {
        type: DataTypes.ENUM('authorized', 'filled', 'vacant', 'frozen', 'abolished'),
        allowNull: false,
        defaultValue: 'authorized',
        comment: 'Position status',
      },
      budgetedSalary: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budgeted annual salary',
      },
      actualSalary: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual annual salary',
      },
      incumbentEmployeeId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Current employee',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      authorizedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Authorization date',
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
      tableName: 'positions',
      timestamps: true,
      indexes: [
        { fields: ['positionId'], unique: true },
        { fields: ['positionNumber'], unique: true },
        { fields: ['organizationCode'] },
        { fields: ['departmentCode'] },
        { fields: ['status'] },
        { fields: ['fiscalYear'] },
        { fields: ['classificationCode'] },
        { fields: ['supervisorPositionId'] },
      ],
    },
  );

  return Position;
};

/**
 * Sequelize model for Position Budgets with funding source tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PositionBudget model
 */
export const createPositionBudgetModel = (sequelize: Sequelize) => {
  class PositionBudget extends Model {
    public id!: string;
    public positionId!: string;
    public fiscalYear!: number;
    public budgetedSalary!: number;
    public budgetedBenefits!: number;
    public otherCosts!: number;
    public totalBudgeted!: number;
    public actualSalary!: number;
    public actualBenefits!: number;
    public actualOtherCosts!: number;
    public totalActual!: number;
    public variance!: number;
    public fundingSources!: any[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PositionBudget.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      positionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Position identifier',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      budgetedSalary: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budgeted salary',
      },
      budgetedBenefits: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budgeted benefits',
      },
      otherCosts: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Other budgeted costs',
      },
      totalBudgeted: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total budgeted amount',
      },
      actualSalary: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual salary',
      },
      actualBenefits: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual benefits',
      },
      actualOtherCosts: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual other costs',
      },
      totalActual: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total actual amount',
      },
      variance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budget variance',
      },
      fundingSources: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Funding sources',
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
      tableName: 'position_budgets',
      timestamps: true,
      indexes: [
        { fields: ['positionId', 'fiscalYear'], unique: true },
        { fields: ['positionId'] },
        { fields: ['fiscalYear'] },
      ],
    },
  );

  return PositionBudget;
};

/**
 * Sequelize model for Position Classifications with salary ranges.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PositionClassification model
 */
export const createPositionClassificationModel = (sequelize: Sequelize) => {
  class PositionClassification extends Model {
    public id!: string;
    public classificationCode!: string;
    public classificationTitle!: string;
    public series!: string;
    public occupationalCategory!: string;
    public gradeLevel!: string;
    public minSalary!: number;
    public maxSalary!: number;
    public midSalary!: number;
    public standardDuties!: string;
    public qualifications!: string;
    public effectiveDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PositionClassification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      classificationCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Classification code',
      },
      classificationTitle: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Classification title',
      },
      series: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Occupational series',
      },
      occupationalCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Occupational category',
      },
      gradeLevel: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Grade level',
      },
      minSalary: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Minimum salary',
      },
      maxSalary: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Maximum salary',
      },
      midSalary: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Mid-point salary',
      },
      standardDuties: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Standard duties',
      },
      qualifications: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Required qualifications',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
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
      tableName: 'position_classifications',
      timestamps: true,
      indexes: [
        { fields: ['classificationCode'], unique: true },
        { fields: ['series'] },
        { fields: ['gradeLevel'] },
        { fields: ['occupationalCategory'] },
      ],
    },
  );

  return PositionClassification;
};

/**
 * Sequelize model for Position Vacancies with recruitment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PositionVacancy model
 */
export const createPositionVacancyModel = (sequelize: Sequelize) => {
  class PositionVacancy extends Model {
    public id!: string;
    public vacancyId!: string;
    public positionId!: string;
    public vacancyDate!: Date;
    public estimatedFillDate!: Date | null;
    public actualFillDate!: Date | null;
    public vacancyReason!: string;
    public recruitmentStatus!: string;
    public annualSavings!: number;
    public cumulativeSavings!: number;
    public postingDate!: Date | null;
    public closingDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PositionVacancy.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      vacancyId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Vacancy identifier',
      },
      positionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Position identifier',
      },
      vacancyDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Vacancy start date',
      },
      estimatedFillDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Estimated fill date',
      },
      actualFillDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual fill date',
      },
      vacancyReason: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: 'Reason for vacancy',
      },
      recruitmentStatus: {
        type: DataTypes.ENUM('open', 'in_progress', 'filled', 'cancelled'),
        allowNull: false,
        defaultValue: 'open',
        comment: 'Recruitment status',
      },
      annualSavings: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Annual savings from vacancy',
      },
      cumulativeSavings: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Cumulative savings',
      },
      postingDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Job posting date',
      },
      closingDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Application closing date',
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
      tableName: 'position_vacancies',
      timestamps: true,
      indexes: [
        { fields: ['vacancyId'], unique: true },
        { fields: ['positionId'] },
        { fields: ['recruitmentStatus'] },
        { fields: ['vacancyDate'] },
      ],
    },
  );

  return PositionVacancy;
};

/**
 * Sequelize model for Position Requisitions with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PositionRequisition model
 */
export const createPositionRequisitionModel = (sequelize: Sequelize) => {
  class PositionRequisition extends Model {
    public id!: string;
    public requisitionId!: string;
    public positionId!: string;
    public requestedBy!: string;
    public requestDate!: Date;
    public justification!: string;
    public status!: string;
    public approvedBy!: string | null;
    public approvedDate!: Date | null;
    public deniedBy!: string | null;
    public deniedDate!: Date | null;
    public denialReason!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PositionRequisition.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      requisitionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Requisition identifier',
      },
      positionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Position identifier',
      },
      requestedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Requesting user',
      },
      requestDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Request date',
      },
      justification: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Business justification',
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'denied', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Requisition status',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approving user',
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      deniedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Denying user',
      },
      deniedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Denial date',
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
      tableName: 'position_requisitions',
      timestamps: true,
      indexes: [
        { fields: ['requisitionId'], unique: true },
        { fields: ['positionId'] },
        { fields: ['status'] },
        { fields: ['requestedBy'] },
      ],
    },
  );

  return PositionRequisition;
};

/**
 * Sequelize model for Organizational Headcount with FTE tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OrganizationalHeadcount model
 */
export const createOrganizationalHeadcountModel = (sequelize: Sequelize) => {
  class OrganizationalHeadcount extends Model {
    public id!: string;
    public organizationCode!: string;
    public fiscalYear!: number;
    public authorizedFTE!: number;
    public filledFTE!: number;
    public vacantFTE!: number;
    public frozenFTE!: number;
    public authorizedPositions!: number;
    public filledPositions!: number;
    public vacantPositions!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  OrganizationalHeadcount.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      organizationCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Organization code',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      authorizedFTE: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Authorized FTE',
      },
      filledFTE: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Filled FTE',
      },
      vacantFTE: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Vacant FTE',
      },
      frozenFTE: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Frozen FTE',
      },
      authorizedPositions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Authorized positions count',
      },
      filledPositions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Filled positions count',
      },
      vacantPositions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Vacant positions count',
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
      tableName: 'organizational_headcount',
      timestamps: true,
      indexes: [
        { fields: ['organizationCode', 'fiscalYear'], unique: true },
        { fields: ['organizationCode'] },
        { fields: ['fiscalYear'] },
      ],
    },
  );

  return OrganizationalHeadcount;
};

// ============================================================================
// POSITION MANAGEMENT (1-7)
// ============================================================================

/**
 * Creates new position with authorization.
 *
 * @param {PositionData} positionData - Position data
 * @param {Model} Position - Position model
 * @returns {Promise<any>} Created position
 */
export const createPosition = async (
  positionData: PositionData,
  Position: any,
): Promise<any> => {
  return await Position.create({
    ...positionData,
    status: 'authorized',
    authorizedDate: new Date(),
  });
};

/**
 * Updates position classification.
 *
 * @param {string} positionId - Position ID
 * @param {string} classificationCode - New classification code
 * @param {string} gradeLevel - New grade level
 * @param {Model} Position - Position model
 * @returns {Promise<any>} Updated position
 */
export const updatePositionClassification = async (
  positionId: string,
  classificationCode: string,
  gradeLevel: string,
  Position: any,
): Promise<any> => {
  const position = await Position.findOne({ where: { positionId } });
  if (!position) throw new Error('Position not found');

  position.classificationCode = classificationCode;
  position.gradeLevel = gradeLevel;
  await position.save();

  return position;
};

/**
 * Fills position with employee assignment.
 *
 * @param {string} positionId - Position ID
 * @param {string} employeeId - Employee ID
 * @param {number} actualSalary - Actual salary
 * @param {Model} Position - Position model
 * @returns {Promise<any>} Filled position
 */
export const fillPosition = async (
  positionId: string,
  employeeId: string,
  actualSalary: number,
  Position: any,
): Promise<any> => {
  const position = await Position.findOne({ where: { positionId } });
  if (!position) throw new Error('Position not found');

  if (position.status !== 'vacant' && position.status !== 'authorized') {
    throw new Error('Position is not available to fill');
  }

  position.status = 'filled';
  position.incumbentEmployeeId = employeeId;
  position.actualSalary = actualSalary;
  await position.save();

  return position;
};

/**
 * Vacates position when employee leaves.
 *
 * @param {string} positionId - Position ID
 * @param {string} vacancyReason - Reason for vacancy
 * @param {Model} Position - Position model
 * @param {Model} PositionVacancy - PositionVacancy model
 * @returns {Promise<any>} Vacancy record
 */
export const vacatePosition = async (
  positionId: string,
  vacancyReason: string,
  Position: any,
  PositionVacancy: any,
): Promise<any> => {
  const position = await Position.findOne({ where: { positionId } });
  if (!position) throw new Error('Position not found');

  position.status = 'vacant';
  position.incumbentEmployeeId = null;
  position.actualSalary = 0;
  await position.save();

  const vacancy = await PositionVacancy.create({
    vacancyId: `VAC-${positionId}-${Date.now()}`,
    positionId,
    vacancyDate: new Date(),
    vacancyReason,
    recruitmentStatus: 'open',
    annualSavings: position.budgetedSalary,
  });

  return vacancy;
};

/**
 * Freezes position to prevent filling.
 *
 * @param {string} positionId - Position ID
 * @param {string} reason - Freeze reason
 * @param {Model} Position - Position model
 * @returns {Promise<any>} Frozen position
 */
export const freezePosition = async (
  positionId: string,
  reason: string,
  Position: any,
): Promise<any> => {
  const position = await Position.findOne({ where: { positionId } });
  if (!position) throw new Error('Position not found');

  position.status = 'frozen';
  position.metadata = {
    ...position.metadata,
    freezeReason: reason,
    frozenAt: new Date(),
  };
  await position.save();

  return position;
};

/**
 * Abolishes position permanently.
 *
 * @param {string} positionId - Position ID
 * @param {string} reason - Abolishment reason
 * @param {Model} Position - Position model
 * @returns {Promise<any>} Abolished position
 */
export const abolishPosition = async (
  positionId: string,
  reason: string,
  Position: any,
): Promise<any> => {
  const position = await Position.findOne({ where: { positionId } });
  if (!position) throw new Error('Position not found');

  if (position.status === 'filled') {
    throw new Error('Cannot abolish filled position');
  }

  position.status = 'abolished';
  position.metadata = {
    ...position.metadata,
    abolishReason: reason,
    abolishedAt: new Date(),
  };
  await position.save();

  return position;
};

/**
 * Retrieves positions by organizational unit.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} Position - Position model
 * @returns {Promise<any[]>} Positions
 */
export const getPositionsByOrganization = async (
  organizationCode: string,
  fiscalYear: number,
  Position: any,
): Promise<any[]> => {
  return await Position.findAll({
    where: {
      organizationCode,
      fiscalYear,
      status: { [Op.ne]: 'abolished' },
    },
    order: [['positionNumber', 'ASC']],
  });
};

// ============================================================================
// POSITION BUDGETING (8-14)
// ============================================================================

/**
 * Creates position budget for fiscal year.
 *
 * @param {PositionBudgetData} budgetData - Budget data
 * @param {Model} PositionBudget - PositionBudget model
 * @returns {Promise<any>} Created budget
 */
export const createPositionBudget = async (
  budgetData: PositionBudgetData,
  PositionBudget: any,
): Promise<any> => {
  const totalBudgeted = budgetData.budgetedSalary + budgetData.budgetedBenefits + budgetData.otherCosts;

  return await PositionBudget.create({
    ...budgetData,
    totalBudgeted,
    variance: totalBudgeted,
  });
};

/**
 * Calculates total position budget including benefits.
 *
 * @param {number} baseSalary - Base salary
 * @param {number} benefitRate - Benefit rate percentage
 * @param {number} otherCosts - Other costs
 * @returns {{ salary: number; benefits: number; otherCosts: number; total: number }}
 */
export const calculatePositionBudget = (
  baseSalary: number,
  benefitRate: number,
  otherCosts: number,
): { salary: number; benefits: number; otherCosts: number; total: number } => {
  const benefits = baseSalary * (benefitRate / 100);
  const total = baseSalary + benefits + otherCosts;

  return {
    salary: baseSalary,
    benefits,
    otherCosts,
    total,
  };
};

/**
 * Updates position budget actuals.
 *
 * @param {string} positionId - Position ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} actualSalary - Actual salary
 * @param {number} actualBenefits - Actual benefits
 * @param {Model} PositionBudget - PositionBudget model
 * @returns {Promise<any>} Updated budget
 */
export const updatePositionBudgetActuals = async (
  positionId: string,
  fiscalYear: number,
  actualSalary: number,
  actualBenefits: number,
  PositionBudget: any,
): Promise<any> => {
  const budget = await PositionBudget.findOne({
    where: { positionId, fiscalYear },
  });

  if (!budget) throw new Error('Budget not found');

  budget.actualSalary = actualSalary;
  budget.actualBenefits = actualBenefits;
  budget.totalActual = actualSalary + actualBenefits + budget.actualOtherCosts;
  budget.variance = budget.totalBudgeted - budget.totalActual;
  await budget.save();

  return budget;
};

/**
 * Allocates position funding across sources.
 *
 * @param {string} positionId - Position ID
 * @param {number} fiscalYear - Fiscal year
 * @param {FundingSourceData[]} fundingSources - Funding sources
 * @param {Model} PositionBudget - PositionBudget model
 * @returns {Promise<any>} Updated budget
 */
export const allocatePositionFunding = async (
  positionId: string,
  fiscalYear: number,
  fundingSources: FundingSourceData[],
  PositionBudget: any,
): Promise<any> => {
  const budget = await PositionBudget.findOne({
    where: { positionId, fiscalYear },
  });

  if (!budget) throw new Error('Budget not found');

  const totalPercentage = fundingSources.reduce((sum, fs) => sum + fs.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error('Funding source percentages must total 100%');
  }

  budget.fundingSources = fundingSources;
  await budget.save();

  return budget;
};

/**
 * Generates position budget forecast.
 *
 * @param {number} currentFiscalYear - Current fiscal year
 * @param {number} forecastYears - Number of years to forecast
 * @param {number} annualIncrease - Annual salary increase percentage
 * @param {Model} PositionBudget - PositionBudget model
 * @returns {Promise<any[]>} Forecast data
 */
export const generatePositionBudgetForecast = async (
  currentFiscalYear: number,
  forecastYears: number,
  annualIncrease: number,
  PositionBudget: any,
): Promise<any[]> => {
  const currentBudgets = await PositionBudget.findAll({
    where: { fiscalYear: currentFiscalYear },
  });

  const forecasts = [];
  for (let year = 1; year <= forecastYears; year++) {
    const fiscalYear = currentFiscalYear + year;
    const yearForecast = currentBudgets.map((budget: any) => {
      const increaseMultiplier = Math.pow(1 + annualIncrease / 100, year);
      return {
        positionId: budget.positionId,
        fiscalYear,
        forecastedSalary: budget.budgetedSalary * increaseMultiplier,
        forecastedBenefits: budget.budgetedBenefits * increaseMultiplier,
        forecastedTotal: budget.totalBudgeted * increaseMultiplier,
      };
    });
    forecasts.push(...yearForecast);
  }

  return forecasts;
};

/**
 * Calculates position budget variance.
 *
 * @param {string} positionId - Position ID
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} PositionBudget - PositionBudget model
 * @returns {Promise<any>} Variance analysis
 */
export const calculatePositionBudgetVariance = async (
  positionId: string,
  fiscalYear: number,
  PositionBudget: any,
): Promise<any> => {
  const budget = await PositionBudget.findOne({
    where: { positionId, fiscalYear },
  });

  if (!budget) throw new Error('Budget not found');

  const salaryVariance = budget.budgetedSalary - budget.actualSalary;
  const benefitsVariance = budget.budgetedBenefits - budget.actualBenefits;
  const totalVariance = budget.totalBudgeted - budget.totalActual;

  return {
    positionId,
    fiscalYear,
    budgeted: {
      salary: budget.budgetedSalary,
      benefits: budget.budgetedBenefits,
      total: budget.totalBudgeted,
    },
    actual: {
      salary: budget.actualSalary,
      benefits: budget.actualBenefits,
      total: budget.totalActual,
    },
    variance: {
      salary: salaryVariance,
      benefits: benefitsVariance,
      total: totalVariance,
    },
    variancePercent: {
      salary: budget.budgetedSalary > 0 ? (salaryVariance / budget.budgetedSalary) * 100 : 0,
      benefits: budget.budgetedBenefits > 0 ? (benefitsVariance / budget.budgetedBenefits) * 100 : 0,
      total: budget.totalBudgeted > 0 ? (totalVariance / budget.totalBudgeted) * 100 : 0,
    },
  };
};

/**
 * Generates organizational budget summary.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} Position - Position model
 * @param {Model} PositionBudget - PositionBudget model
 * @returns {Promise<any>} Budget summary
 */
export const generateOrganizationalBudgetSummary = async (
  organizationCode: string,
  fiscalYear: number,
  Position: any,
  PositionBudget: any,
): Promise<any> => {
  const positions = await Position.findAll({
    where: { organizationCode, fiscalYear },
  });

  const positionIds = positions.map((p: any) => p.positionId);
  const budgets = await PositionBudget.findAll({
    where: {
      positionId: { [Op.in]: positionIds },
      fiscalYear,
    },
  });

  const totalBudgeted = budgets.reduce((sum: number, b: any) => sum + parseFloat(b.totalBudgeted), 0);
  const totalActual = budgets.reduce((sum: number, b: any) => sum + parseFloat(b.totalActual), 0);

  return {
    organizationCode,
    fiscalYear,
    positionCount: positions.length,
    totalBudgeted,
    totalActual,
    variance: totalBudgeted - totalActual,
    utilizationRate: totalBudgeted > 0 ? (totalActual / totalBudgeted) * 100 : 0,
  };
};

// ============================================================================
// VACANCY MANAGEMENT (15-21)
// ============================================================================

/**
 * Creates vacancy record.
 *
 * @param {VacancyData} vacancyData - Vacancy data
 * @param {Model} PositionVacancy - PositionVacancy model
 * @returns {Promise<any>} Created vacancy
 */
export const createVacancy = async (
  vacancyData: VacancyData,
  PositionVacancy: any,
): Promise<any> => {
  return await PositionVacancy.create(vacancyData);
};

/**
 * Calculates vacancy savings.
 *
 * @param {string} vacancyId - Vacancy ID
 * @param {Model} PositionVacancy - PositionVacancy model
 * @returns {Promise<any>} Updated vacancy with savings
 */
export const calculateVacancySavings = async (
  vacancyId: string,
  PositionVacancy: any,
): Promise<any> => {
  const vacancy = await PositionVacancy.findOne({ where: { vacancyId } });
  if (!vacancy) throw new Error('Vacancy not found');

  const vacancyDays = Math.floor((new Date().getTime() - vacancy.vacancyDate.getTime()) / (1000 * 60 * 60 * 24));
  const cumulativeSavings = (vacancy.annualSavings / 365) * vacancyDays;

  vacancy.cumulativeSavings = cumulativeSavings;
  await vacancy.save();

  return vacancy;
};

/**
 * Retrieves vacant positions by organization.
 *
 * @param {string} organizationCode - Organization code
 * @param {Model} Position - Position model
 * @param {Model} PositionVacancy - PositionVacancy model
 * @returns {Promise<any[]>} Vacant positions with vacancy details
 */
export const getVacantPositionsByOrganization = async (
  organizationCode: string,
  Position: any,
  PositionVacancy: any,
): Promise<any[]> => {
  const vacantPositions = await Position.findAll({
    where: { organizationCode, status: 'vacant' },
  });

  const positionIds = vacantPositions.map((p: any) => p.positionId);
  const vacancies = await PositionVacancy.findAll({
    where: {
      positionId: { [Op.in]: positionIds },
      recruitmentStatus: { [Op.ne]: 'filled' },
    },
  });

  return vacantPositions.map((position: any) => {
    const vacancy = vacancies.find((v: any) => v.positionId === position.positionId);
    return {
      ...position.toJSON(),
      vacancy: vacancy ? vacancy.toJSON() : null,
    };
  });
};

/**
 * Updates vacancy recruitment status.
 *
 * @param {string} vacancyId - Vacancy ID
 * @param {string} recruitmentStatus - New recruitment status
 * @param {Model} PositionVacancy - PositionVacancy model
 * @returns {Promise<any>} Updated vacancy
 */
export const updateVacancyRecruitmentStatus = async (
  vacancyId: string,
  recruitmentStatus: string,
  PositionVacancy: any,
): Promise<any> => {
  const vacancy = await PositionVacancy.findOne({ where: { vacancyId } });
  if (!vacancy) throw new Error('Vacancy not found');

  vacancy.recruitmentStatus = recruitmentStatus;

  if (recruitmentStatus === 'filled') {
    vacancy.actualFillDate = new Date();
  }

  await vacancy.save();
  return vacancy;
};

/**
 * Generates vacancy report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} PositionVacancy - PositionVacancy model
 * @returns {Promise<any>} Vacancy report
 */
export const generateVacancyReport = async (
  startDate: Date,
  endDate: Date,
  PositionVacancy: any,
): Promise<any> => {
  const vacancies = await PositionVacancy.findAll({
    where: {
      vacancyDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalVacancies = vacancies.length;
  const filled = vacancies.filter((v: any) => v.recruitmentStatus === 'filled').length;
  const totalSavings = vacancies.reduce((sum: number, v: any) => sum + parseFloat(v.cumulativeSavings), 0);

  const avgDaysToFill = vacancies
    .filter((v: any) => v.actualFillDate)
    .reduce((sum: number, v: any) => {
      const days = Math.floor((v.actualFillDate.getTime() - v.vacancyDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0) / (filled || 1);

  return {
    period: { startDate, endDate },
    totalVacancies,
    filled,
    open: totalVacancies - filled,
    fillRate: totalVacancies > 0 ? (filled / totalVacancies) * 100 : 0,
    avgDaysToFill,
    totalSavings,
  };
};

/**
 * Identifies long-term vacancies.
 *
 * @param {number} daysThreshold - Days threshold for long-term
 * @param {Model} PositionVacancy - PositionVacancy model
 * @returns {Promise<any[]>} Long-term vacancies
 */
export const identifyLongTermVacancies = async (
  daysThreshold: number,
  PositionVacancy: any,
): Promise<any[]> => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

  return await PositionVacancy.findAll({
    where: {
      vacancyDate: { [Op.lte]: thresholdDate },
      recruitmentStatus: { [Op.in]: ['open', 'in_progress'] },
    },
    order: [['vacancyDate', 'ASC']],
  });
};

/**
 * Exports vacancy data to CSV.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} PositionVacancy - PositionVacancy model
 * @returns {Promise<string>} CSV content
 */
export const exportVacancyDataCSV = async (
  startDate: Date,
  endDate: Date,
  PositionVacancy: any,
): Promise<string> => {
  const vacancies = await PositionVacancy.findAll({
    where: {
      vacancyDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['vacancyDate', 'ASC']],
  });

  const headers = 'Vacancy ID,Position ID,Vacancy Date,Recruitment Status,Annual Savings,Cumulative Savings\n';
  const rows = vacancies.map((v: any) =>
    `${v.vacancyId},${v.positionId},${v.vacancyDate.toISOString().split('T')[0]},${v.recruitmentStatus},${v.annualSavings},${v.cumulativeSavings}`
  );

  return headers + rows.join('\n');
};

// ============================================================================
// HEADCOUNT MANAGEMENT (22-28)
// ============================================================================

/**
 * Calculates organizational headcount.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} Position - Position model
 * @param {Model} OrganizationalHeadcount - OrganizationalHeadcount model
 * @returns {Promise<any>} Headcount summary
 */
export const calculateOrganizationalHeadcount = async (
  organizationCode: string,
  fiscalYear: number,
  Position: any,
  OrganizationalHeadcount: any,
): Promise<any> => {
  const positions = await Position.findAll({
    where: { organizationCode, fiscalYear },
  });

  const authorized = positions.filter((p: any) => p.status !== 'abolished');
  const filled = positions.filter((p: any) => p.status === 'filled');
  const vacant = positions.filter((p: any) => p.status === 'vacant');
  const frozen = positions.filter((p: any) => p.status === 'frozen');

  const authorizedFTE = authorized.reduce((sum: number, p: any) => sum + parseFloat(p.fte), 0);
  const filledFTE = filled.reduce((sum: number, p: any) => sum + parseFloat(p.fte), 0);
  const vacantFTE = vacant.reduce((sum: number, p: any) => sum + parseFloat(p.fte), 0);
  const frozenFTE = frozen.reduce((sum: number, p: any) => sum + parseFloat(p.fte), 0);

  const headcount = await OrganizationalHeadcount.findOne({
    where: { organizationCode, fiscalYear },
  });

  if (headcount) {
    headcount.authorizedFTE = authorizedFTE;
    headcount.filledFTE = filledFTE;
    headcount.vacantFTE = vacantFTE;
    headcount.frozenFTE = frozenFTE;
    headcount.authorizedPositions = authorized.length;
    headcount.filledPositions = filled.length;
    headcount.vacantPositions = vacant.length;
    await headcount.save();
    return headcount;
  }

  return await OrganizationalHeadcount.create({
    organizationCode,
    fiscalYear,
    authorizedFTE,
    filledFTE,
    vacantFTE,
    frozenFTE,
    authorizedPositions: authorized.length,
    filledPositions: filled.length,
    vacantPositions: vacant.length,
  });
};

/**
 * Retrieves headcount trends.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} startYear - Start fiscal year
 * @param {number} endYear - End fiscal year
 * @param {Model} OrganizationalHeadcount - OrganizationalHeadcount model
 * @returns {Promise<any[]>} Headcount trends
 */
export const getHeadcountTrends = async (
  organizationCode: string,
  startYear: number,
  endYear: number,
  OrganizationalHeadcount: any,
): Promise<any[]> => {
  return await OrganizationalHeadcount.findAll({
    where: {
      organizationCode,
      fiscalYear: { [Op.between]: [startYear, endYear] },
    },
    order: [['fiscalYear', 'ASC']],
  });
};

/**
 * Calculates FTE utilization rate.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} OrganizationalHeadcount - OrganizationalHeadcount model
 * @returns {Promise<number>} Utilization rate percentage
 */
export const calculateFTEUtilizationRate = async (
  organizationCode: string,
  fiscalYear: number,
  OrganizationalHeadcount: any,
): Promise<number> => {
  const headcount = await OrganizationalHeadcount.findOne({
    where: { organizationCode, fiscalYear },
  });

  if (!headcount || headcount.authorizedFTE === 0) return 0;

  return (parseFloat(headcount.filledFTE) / parseFloat(headcount.authorizedFTE)) * 100;
};

/**
 * Generates headcount dashboard.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} OrganizationalHeadcount - OrganizationalHeadcount model
 * @returns {Promise<any>} Headcount dashboard
 */
export const generateHeadcountDashboard = async (
  fiscalYear: number,
  OrganizationalHeadcount: any,
): Promise<any> => {
  const allHeadcounts = await OrganizationalHeadcount.findAll({
    where: { fiscalYear },
  });

  const totalAuthorizedFTE = allHeadcounts.reduce(
    (sum: number, h: any) => sum + parseFloat(h.authorizedFTE),
    0,
  );
  const totalFilledFTE = allHeadcounts.reduce(
    (sum: number, h: any) => sum + parseFloat(h.filledFTE),
    0,
  );
  const totalVacantFTE = allHeadcounts.reduce(
    (sum: number, h: any) => sum + parseFloat(h.vacantFTE),
    0,
  );

  return {
    fiscalYear,
    summary: {
      totalAuthorizedFTE,
      totalFilledFTE,
      totalVacantFTE,
      utilizationRate: totalAuthorizedFTE > 0 ? (totalFilledFTE / totalAuthorizedFTE) * 100 : 0,
      vacancyRate: totalAuthorizedFTE > 0 ? (totalVacantFTE / totalAuthorizedFTE) * 100 : 0,
    },
    byOrganization: allHeadcounts,
  };
};

/**
 * Forecasts future headcount needs.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} currentYear - Current fiscal year
 * @param {number} yearsAhead - Years to forecast
 * @param {number} growthRate - Annual growth rate percentage
 * @param {Model} OrganizationalHeadcount - OrganizationalHeadcount model
 * @returns {Promise<any[]>} Headcount forecast
 */
export const forecastHeadcountNeeds = async (
  organizationCode: string,
  currentYear: number,
  yearsAhead: number,
  growthRate: number,
  OrganizationalHeadcount: any,
): Promise<any[]> => {
  const currentHeadcount = await OrganizationalHeadcount.findOne({
    where: { organizationCode, fiscalYear: currentYear },
  });

  if (!currentHeadcount) throw new Error('Current headcount not found');

  const forecasts = [];
  for (let year = 1; year <= yearsAhead; year++) {
    const multiplier = Math.pow(1 + growthRate / 100, year);
    forecasts.push({
      fiscalYear: currentYear + year,
      forecastedAuthorizedFTE: parseFloat(currentHeadcount.authorizedFTE) * multiplier,
      forecastedFilledFTE: parseFloat(currentHeadcount.filledFTE) * multiplier,
    });
  }

  return forecasts;
};

/**
 * Validates headcount against authorized ceiling.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} authorizedCeiling - Authorized FTE ceiling
 * @param {Model} OrganizationalHeadcount - OrganizationalHeadcount model
 * @returns {Promise<{ compliant: boolean; currentFTE: number; ceiling: number; variance: number }>}
 */
export const validateHeadcountCeiling = async (
  organizationCode: string,
  fiscalYear: number,
  authorizedCeiling: number,
  OrganizationalHeadcount: any,
): Promise<{ compliant: boolean; currentFTE: number; ceiling: number; variance: number }> => {
  const headcount = await OrganizationalHeadcount.findOne({
    where: { organizationCode, fiscalYear },
  });

  if (!headcount) {
    return { compliant: true, currentFTE: 0, ceiling: authorizedCeiling, variance: authorizedCeiling };
  }

  const currentFTE = parseFloat(headcount.authorizedFTE);
  const variance = authorizedCeiling - currentFTE;

  return {
    compliant: currentFTE <= authorizedCeiling,
    currentFTE,
    ceiling: authorizedCeiling,
    variance,
  };
};

// ============================================================================
// POSITION REQUISITION (29-34)
// ============================================================================

/**
 * Creates position requisition request.
 *
 * @param {PositionRequisitionData} requisitionData - Requisition data
 * @param {Model} PositionRequisition - PositionRequisition model
 * @returns {Promise<any>} Created requisition
 */
export const createPositionRequisition = async (
  requisitionData: PositionRequisitionData,
  PositionRequisition: any,
): Promise<any> => {
  return await PositionRequisition.create(requisitionData);
};

/**
 * Approves position requisition.
 *
 * @param {string} requisitionId - Requisition ID
 * @param {string} approverId - Approver user ID
 * @param {Model} PositionRequisition - PositionRequisition model
 * @returns {Promise<any>} Approved requisition
 */
export const approvePositionRequisition = async (
  requisitionId: string,
  approverId: string,
  PositionRequisition: any,
): Promise<any> => {
  const requisition = await PositionRequisition.findOne({ where: { requisitionId } });
  if (!requisition) throw new Error('Requisition not found');

  if (requisition.status !== 'pending') {
    throw new Error('Only pending requisitions can be approved');
  }

  requisition.status = 'approved';
  requisition.approvedBy = approverId;
  requisition.approvedDate = new Date();
  await requisition.save();

  return requisition;
};

/**
 * Denies position requisition.
 *
 * @param {string} requisitionId - Requisition ID
 * @param {string} approverId - Approver user ID
 * @param {string} reason - Denial reason
 * @param {Model} PositionRequisition - PositionRequisition model
 * @returns {Promise<any>} Denied requisition
 */
export const denyPositionRequisition = async (
  requisitionId: string,
  approverId: string,
  reason: string,
  PositionRequisition: any,
): Promise<any> => {
  const requisition = await PositionRequisition.findOne({ where: { requisitionId } });
  if (!requisition) throw new Error('Requisition not found');

  requisition.status = 'denied';
  requisition.deniedBy = approverId;
  requisition.deniedDate = new Date();
  requisition.denialReason = reason;
  await requisition.save();

  return requisition;
};

/**
 * Retrieves pending requisitions for approval.
 *
 * @param {string} approverId - Approver user ID
 * @param {Model} PositionRequisition - PositionRequisition model
 * @returns {Promise<any[]>} Pending requisitions
 */
export const getPendingRequisitions = async (
  approverId: string,
  PositionRequisition: any,
): Promise<any[]> => {
  return await PositionRequisition.findAll({
    where: { status: 'pending' },
    order: [['requestDate', 'ASC']],
  });
};

/**
 * Generates requisition approval report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} PositionRequisition - PositionRequisition model
 * @returns {Promise<any>} Approval report
 */
export const generateRequisitionApprovalReport = async (
  startDate: Date,
  endDate: Date,
  PositionRequisition: any,
): Promise<any> => {
  const requisitions = await PositionRequisition.findAll({
    where: {
      requestDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const total = requisitions.length;
  const approved = requisitions.filter((r: any) => r.status === 'approved').length;
  const denied = requisitions.filter((r: any) => r.status === 'denied').length;
  const pending = requisitions.filter((r: any) => r.status === 'pending').length;

  return {
    period: { startDate, endDate },
    total,
    approved,
    denied,
    pending,
    approvalRate: total > 0 ? (approved / total) * 100 : 0,
  };
};

/**
 * Validates requisition business justification.
 *
 * @param {string} justification - Business justification
 * @returns {{ valid: boolean; errors: string[] }}
 */
export const validateRequisitionJustification = (
  justification: string,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!justification || justification.trim().length === 0) {
    errors.push('Justification is required');
  }

  if (justification && justification.length < 50) {
    errors.push('Justification must be at least 50 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// SALARY ADMINISTRATION (35-41)
// ============================================================================

/**
 * Calculates salary for grade and step.
 *
 * @param {string} gradeLevel - Grade level
 * @param {number} step - Step number
 * @param {number} localityAdjustment - Locality adjustment percentage
 * @param {Model} PositionClassification - PositionClassification model
 * @returns {Promise<number>} Calculated salary
 */
export const calculateSalaryForGradeStep = async (
  gradeLevel: string,
  step: number,
  localityAdjustment: number,
  PositionClassification: any,
): Promise<number> => {
  const classification = await PositionClassification.findOne({
    where: { gradeLevel },
  });

  if (!classification) throw new Error('Classification not found');

  const baseSalary = classification.minSalary +
    ((classification.maxSalary - classification.minSalary) / 10) * (step - 1);

  const localityPay = baseSalary * (localityAdjustment / 100);
  return baseSalary + localityPay;
};

/**
 * Processes step increase.
 *
 * @param {string} positionId - Position ID
 * @param {number} newStep - New step level
 * @param {Model} Position - Position model
 * @param {Model} PositionClassification - PositionClassification model
 * @returns {Promise<any>} Updated position
 */
export const processStepIncrease = async (
  positionId: string,
  newStep: number,
  Position: any,
  PositionClassification: any,
): Promise<any> => {
  const position = await Position.findOne({ where: { positionId } });
  if (!position) throw new Error('Position not found');

  if (newStep <= position.step) {
    throw new Error('New step must be higher than current step');
  }

  if (newStep > 10) {
    throw new Error('Step cannot exceed 10');
  }

  const newSalary = await calculateSalaryForGradeStep(
    position.gradeLevel,
    newStep,
    0, // Would fetch locality from employee record
    PositionClassification,
  );

  position.step = newStep;
  position.budgetedSalary = newSalary;
  if (position.status === 'filled') {
    position.actualSalary = newSalary;
  }
  await position.save();

  return position;
};

/**
 * Retrieves salary range for classification.
 *
 * @param {string} classificationCode - Classification code
 * @param {Model} PositionClassification - PositionClassification model
 * @returns {Promise<SalaryRangeData>} Salary range
 */
export const getSalaryRangeForClassification = async (
  classificationCode: string,
  PositionClassification: any,
): Promise<SalaryRangeData> => {
  const classification = await PositionClassification.findOne({
    where: { classificationCode },
  });

  if (!classification) throw new Error('Classification not found');

  return {
    gradeLevel: classification.gradeLevel,
    step: 1,
    minSalary: classification.minSalary,
    maxSalary: classification.maxSalary,
    currentSalary: classification.midSalary,
    localityAdjustment: 0,
  };
};

/**
 * Validates salary against range.
 *
 * @param {string} classificationCode - Classification code
 * @param {number} proposedSalary - Proposed salary
 * @param {Model} PositionClassification - PositionClassification model
 * @returns {Promise<{ valid: boolean; reason?: string }>}
 */
export const validateSalaryAgainstRange = async (
  classificationCode: string,
  proposedSalary: number,
  PositionClassification: any,
): Promise<{ valid: boolean; reason?: string }> => {
  const classification = await PositionClassification.findOne({
    where: { classificationCode },
  });

  if (!classification) {
    return { valid: false, reason: 'Classification not found' };
  }

  if (proposedSalary < classification.minSalary) {
    return { valid: false, reason: 'Salary below minimum for classification' };
  }

  if (proposedSalary > classification.maxSalary) {
    return { valid: false, reason: 'Salary exceeds maximum for classification' };
  }

  return { valid: true };
};

/**
 * Generates salary administration report.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} Position - Position model
 * @returns {Promise<any>} Salary report
 */
export const generateSalaryAdministrationReport = async (
  organizationCode: string,
  fiscalYear: number,
  Position: any,
): Promise<any> => {
  const positions = await Position.findAll({
    where: { organizationCode, fiscalYear, status: { [Op.ne]: 'abolished' } },
  });

  const totalBudgetedSalary = positions.reduce(
    (sum: number, p: any) => sum + parseFloat(p.budgetedSalary),
    0,
  );
  const totalActualSalary = positions.reduce(
    (sum: number, p: any) => sum + parseFloat(p.actualSalary),
    0,
  );

  const byGrade = new Map<string, any>();
  positions.forEach((p: any) => {
    if (!byGrade.has(p.gradeLevel)) {
      byGrade.set(p.gradeLevel, { count: 0, totalSalary: 0, avgSalary: 0 });
    }
    const grade = byGrade.get(p.gradeLevel);
    grade.count++;
    grade.totalSalary += parseFloat(p.budgetedSalary);
    grade.avgSalary = grade.totalSalary / grade.count;
  });

  return {
    organizationCode,
    fiscalYear,
    totalPositions: positions.length,
    totalBudgetedSalary,
    totalActualSalary,
    avgSalary: positions.length > 0 ? totalBudgetedSalary / positions.length : 0,
    byGrade: Array.from(byGrade.entries()).map(([grade, data]) => ({
      gradeLevel: grade,
      ...data,
    })),
  };
};

/**
 * Calculates cost of living adjustment.
 *
 * @param {number} currentSalary - Current salary
 * @param {number} colaPercentage - COLA percentage
 * @returns {number} Adjusted salary
 */
export const calculateCOLAAdjustment = (
  currentSalary: number,
  colaPercentage: number,
): number => {
  return currentSalary * (1 + colaPercentage / 100);
};

/**
 * Exports comprehensive position control report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} Position - Position model
 * @param {Model} PositionBudget - PositionBudget model
 * @param {Model} OrganizationalHeadcount - OrganizationalHeadcount model
 * @returns {Promise<any>} Comprehensive report
 */
export const exportPositionControlReport = async (
  fiscalYear: number,
  Position: any,
  PositionBudget: any,
  OrganizationalHeadcount: any,
): Promise<any> => {
  const allPositions = await Position.findAll({ where: { fiscalYear } });
  const allBudgets = await PositionBudget.findAll({ where: { fiscalYear } });
  const allHeadcounts = await OrganizationalHeadcount.findAll({ where: { fiscalYear } });

  return {
    fiscalYear,
    generatedAt: new Date(),
    summary: {
      totalPositions: allPositions.length,
      totalBudget: allBudgets.reduce((sum: number, b: any) => sum + parseFloat(b.totalBudgeted), 0),
      totalFTE: allHeadcounts.reduce((sum: number, h: any) => sum + parseFloat(h.authorizedFTE), 0),
    },
    positions: allPositions,
    budgets: allBudgets,
    headcounts: allHeadcounts,
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSPositionControlBudgetingService {
  constructor(private readonly sequelize: Sequelize) {}

  async createPosition(positionData: PositionData) {
    const Position = createPositionModel(this.sequelize);
    return createPosition(positionData, Position);
  }

  async calculateOrganizationalHeadcount(organizationCode: string, fiscalYear: number) {
    const Position = createPositionModel(this.sequelize);
    const OrganizationalHeadcount = createOrganizationalHeadcountModel(this.sequelize);
    return calculateOrganizationalHeadcount(organizationCode, fiscalYear, Position, OrganizationalHeadcount);
  }

  async createPositionBudget(budgetData: PositionBudgetData) {
    const PositionBudget = createPositionBudgetModel(this.sequelize);
    return createPositionBudget(budgetData, PositionBudget);
  }

  async vacatePosition(positionId: string, vacancyReason: string) {
    const Position = createPositionModel(this.sequelize);
    const PositionVacancy = createPositionVacancyModel(this.sequelize);
    return vacatePosition(positionId, vacancyReason, Position, PositionVacancy);
  }
}

export default {
  // Models
  createPositionModel,
  createPositionBudgetModel,
  createPositionClassificationModel,
  createPositionVacancyModel,
  createPositionRequisitionModel,
  createOrganizationalHeadcountModel,

  // Position Management
  createPosition,
  updatePositionClassification,
  fillPosition,
  vacatePosition,
  freezePosition,
  abolishPosition,
  getPositionsByOrganization,

  // Position Budgeting
  createPositionBudget,
  calculatePositionBudget,
  updatePositionBudgetActuals,
  allocatePositionFunding,
  generatePositionBudgetForecast,
  calculatePositionBudgetVariance,
  generateOrganizationalBudgetSummary,

  // Vacancy Management
  createVacancy,
  calculateVacancySavings,
  getVacantPositionsByOrganization,
  updateVacancyRecruitmentStatus,
  generateVacancyReport,
  identifyLongTermVacancies,
  exportVacancyDataCSV,

  // Headcount Management
  calculateOrganizationalHeadcount,
  getHeadcountTrends,
  calculateFTEUtilizationRate,
  generateHeadcountDashboard,
  forecastHeadcountNeeds,
  validateHeadcountCeiling,

  // Position Requisition
  createPositionRequisition,
  approvePositionRequisition,
  denyPositionRequisition,
  getPendingRequisitions,
  generateRequisitionApprovalReport,
  validateRequisitionJustification,

  // Salary Administration
  calculateSalaryForGradeStep,
  processStepIncrease,
  getSalaryRangeForClassification,
  validateSalaryAgainstRange,
  generateSalaryAdministrationReport,
  calculateCOLAAdjustment,
  exportPositionControlReport,

  // Service
  CEFMSPositionControlBudgetingService,
};
