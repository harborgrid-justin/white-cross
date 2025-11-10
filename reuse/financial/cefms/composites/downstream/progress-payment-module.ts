/**
 * LOC: CEFMS-PROGRESS-PAY-DS-002
 * File: /reuse/financial/cefms/composites/downstream/progress-payment-module.ts
 *
 * UPSTREAM (imports from):
 *   - ../cefms-construction-progress-billing-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - Progress billing controllers
 *   - Percentage completion calculators
 *   - Contractor payment processors
 */

/**
 * File: /reuse/financial/cefms/composites/downstream/progress-payment-module.ts
 * Locator: WC-CEFMS-PROGRESS-PAY-DS-002
 * Purpose: Production-ready Progress Payment Module for USACE CEFMS - percentage completion calculations,
 *          progress billing schedules, earned value analysis, mobilization payments, and payment forecasting
 *
 * Upstream: Imports from cefms-construction-progress-billing-composite.ts
 * Downstream: Payment processors, billing controllers, forecasting engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, decimal.js 10.x
 * Exports: 50+ functions for progress payment operations
 *
 * LLM Context: Complete progress payment processing module with advanced percentage completion algorithms.
 * Implements earned value management, S-curve analysis, weighted progress calculations, milestone-based billing,
 * and comprehensive payment forecasting for USACE construction contracts.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import Decimal from 'decimal.js';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Percentage completion calculation method
 */
export interface PercentCompleteCalculation {
  calculationId: string;
  contractId: string;
  costCode: string;
  method: 'units_complete' | 'cost_to_cost' | 'labor_hours' | 'weighted_units' | 'milestone';
  scheduledValue: number;
  earnedValue: number;
  percentComplete: number;
  calculationDate: Date;
  calculatedBy: string;
  notes?: string;
}

/**
 * Progress billing curve (S-curve) data point
 */
export interface SCurveDataPoint {
  period: number;
  periodDate: Date;
  plannedValue: number;
  earnedValue: number;
  actualCost: number;
  cumulativePlanned: number;
  cumulativeEarned: number;
  cumulativeActual: number;
  scheduleVariance: number;
  costVariance: number;
}

/**
 * Earned value metrics
 */
export interface EarnedValueMetrics {
  contractId: string;
  asOfDate: Date;
  budgetAtCompletion: number; // BAC
  plannedValue: number; // PV
  earnedValue: number; // EV
  actualCost: number; // AC
  costVariance: number; // CV = EV - AC
  scheduleVariance: number; // SV = EV - PV
  costPerformanceIndex: number; // CPI = EV / AC
  schedulePerformanceIndex: number; // SPI = EV / PV
  estimateAtCompletion: number; // EAC
  estimateToComplete: number; // ETC
  varianceAtCompletion: number; // VAC
  toCompletePerformanceIndex: number; // TCPI
}

/**
 * Weighted progress calculation
 */
export interface WeightedProgressItem {
  itemId: string;
  description: string;
  weight: number; // Percentage weight (0-100)
  plannedCompletion: number; // Percentage
  actualCompletion: number; // Percentage
  weightedPlanned: number;
  weightedActual: number;
}

/**
 * Milestone payment schedule
 */
export interface MilestonePaymentSchedule {
  scheduleId: string;
  contractId: string;
  milestones: MilestonePayment[];
  totalContractValue: number;
  totalMilestoneBilling: number;
}

export interface MilestonePayment {
  milestoneId: string;
  milestoneName: string;
  milestoneDate: Date;
  paymentPercentage: number;
  paymentAmount: number;
  completionStatus: 'not_started' | 'in_progress' | 'complete';
  paymentStatus: 'pending' | 'billed' | 'paid';
  paymentDate?: Date;
}

/**
 * Payment forecast
 */
export interface PaymentForecast {
  contractId: string;
  forecastDate: Date;
  forecastHorizon: number; // Months
  monthlyForecasts: MonthlyForecast[];
  totalForecastAmount: number;
  confidenceLevel: 'high' | 'medium' | 'low';
}

export interface MonthlyForecast {
  month: number;
  monthDate: Date;
  forecastAmount: number;
  cumulativeForecast: number;
  basis: string;
  assumptions: string[];
}

/**
 * Units of work tracking
 */
export interface UnitsOfWork {
  unitId: string;
  contractId: string;
  costCode: string;
  description: string;
  unitOfMeasure: string;
  totalUnitsScheduled: number;
  unitsCompletedPrevious: number;
  unitsCompletedThisPeriod: number;
  unitsCompletedToDate: number;
  percentComplete: number;
  unitPrice: number;
  valueComplete: number;
}

/**
 * Labor hour tracking
 */
export interface LaborHourTracking {
  trackingId: string;
  contractId: string;
  costCode: string;
  classification: string;
  budgetedHours: number;
  hoursWorkedPrevious: number;
  hoursWorkedThisPeriod: number;
  hoursWorkedToDate: number;
  percentComplete: number;
  laborRate: number;
  laborCost: number;
}

/**
 * Payment application schedule
 */
export interface PaymentApplicationSchedule {
  scheduleId: string;
  contractId: string;
  fiscalYear: number;
  applications: ScheduledApplication[];
  totalScheduledBilling: number;
}

export interface ScheduledApplication {
  applicationNumber: number;
  scheduledDate: Date;
  scheduledAmount: number;
  actualDate?: Date;
  actualAmount?: number;
  variance?: number;
  status: 'scheduled' | 'submitted' | 'approved' | 'paid';
}

/**
 * Progress measurement criteria
 */
export interface ProgressMeasurementCriteria {
  criteriaId: string;
  costCode: string;
  measurementMethod: 'physical' | 'cost' | 'milestone' | 'time_based';
  measurementFrequency: 'daily' | 'weekly' | 'monthly';
  acceptanceCriteria: string[];
  qualityThresholds: {
    minimum: number;
    target: number;
    maximum: number;
  };
  documentationRequired: string[];
}

/**
 * Retainage calculation rule
 */
export interface RetainageCalculationRule {
  ruleId: string;
  contractId: string;
  retainageRate: number;
  applicableFrom: Date;
  applicableTo?: Date;
  threshold?: number; // Retainage stops after this amount
  releaseConditions: string[];
  specialProvisions?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Percentage Complete Calculation model
 */
export const createPercentCompleteModel = (sequelize: Sequelize) => {
  class PercentComplete extends Model {
    public id!: string;
    public calculationId!: string;
    public contractId!: string;
    public costCode!: string;
    public method!: string;
    public scheduledValue!: number;
    public earnedValue!: number;
    public percentComplete!: number;
    public calculationDate!: Date;
    public calculatedBy!: string;
    public notes!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PercentComplete.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      calculationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      contractId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      costCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      method: {
        type: DataTypes.ENUM('units_complete', 'cost_to_cost', 'labor_hours', 'weighted_units', 'milestone'),
        allowNull: false,
      },
      scheduledValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      earnedValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      percentComplete: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      calculationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      calculatedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'cefms_percent_complete',
      timestamps: true,
      indexes: [
        { fields: ['calculationId'], unique: true },
        { fields: ['contractId'] },
        { fields: ['costCode'] },
        { fields: ['calculationDate'] },
      ],
    },
  );

  return PercentComplete;
};

/**
 * Earned Value Metrics model
 */
export const createEarnedValueMetricsModel = (sequelize: Sequelize) => {
  class EarnedValueMetrics extends Model {
    public id!: string;
    public contractId!: string;
    public asOfDate!: Date;
    public budgetAtCompletion!: number;
    public plannedValue!: number;
    public earnedValue!: number;
    public actualCost!: number;
    public costVariance!: number;
    public scheduleVariance!: number;
    public costPerformanceIndex!: number;
    public schedulePerformanceIndex!: number;
    public estimateAtCompletion!: number;
    public estimateToComplete!: number;
    public varianceAtCompletion!: number;
    public toCompletePerformanceIndex!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EarnedValueMetrics.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      contractId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      asOfDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      budgetAtCompletion: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      plannedValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      earnedValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      actualCost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      costVariance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      scheduleVariance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      costPerformanceIndex: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: false,
      },
      schedulePerformanceIndex: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: false,
      },
      estimateAtCompletion: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      estimateToComplete: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      varianceAtCompletion: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      toCompletePerformanceIndex: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'cefms_earned_value_metrics',
      timestamps: true,
      indexes: [
        { fields: ['contractId'] },
        { fields: ['asOfDate'] },
        { fields: ['contractId', 'asOfDate'] },
      ],
    },
  );

  return EarnedValueMetrics;
};

/**
 * Units of Work model
 */
export const createUnitsOfWorkModel = (sequelize: Sequelize) => {
  class UnitsOfWork extends Model {
    public id!: string;
    public unitId!: string;
    public contractId!: string;
    public costCode!: string;
    public description!: string;
    public unitOfMeasure!: string;
    public totalUnitsScheduled!: number;
    public unitsCompletedPrevious!: number;
    public unitsCompletedThisPeriod!: number;
    public unitsCompletedToDate!: number;
    public percentComplete!: number;
    public unitPrice!: number;
    public valueComplete!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  UnitsOfWork.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      unitId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      contractId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      costCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      unitOfMeasure: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      totalUnitsScheduled: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      unitsCompletedPrevious: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      unitsCompletedThisPeriod: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      unitsCompletedToDate: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      percentComplete: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      unitPrice: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      valueComplete: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'cefms_units_of_work',
      timestamps: true,
      indexes: [
        { fields: ['unitId'], unique: true },
        { fields: ['contractId'] },
        { fields: ['costCode'] },
      ],
    },
  );

  return UnitsOfWork;
};

// ============================================================================
// PERCENTAGE COMPLETION CALCULATIONS (Functions 1-10)
// ============================================================================

/**
 * Calculates percentage complete using units complete method.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} costCode - Cost code
 * @param {number} totalUnits - Total units scheduled
 * @param {number} unitsComplete - Units completed to date
 * @param {number} unitPrice - Price per unit
 * @param {string} calculatedBy - User performing calculation
 * @param {any} PercentCompleteModel - Percent complete model
 * @returns {Promise<PercentCompleteCalculation>} Calculation result
 *
 * @example
 * ```typescript
 * const calc = await calculatePercentCompleteByUnits(
 *   'CONT-2024-001',
 *   '01-100',
 *   1000,
 *   500,
 *   100,
 *   'user123',
 *   PercentCompleteModel
 * );
 * console.log(`${calc.percentComplete}% complete`);
 * ```
 */
export const calculatePercentCompleteByUnits = async (
  contractId: string,
  costCode: string,
  totalUnits: number,
  unitsComplete: number,
  unitPrice: number,
  calculatedBy: string,
  PercentCompleteModel: any,
): Promise<PercentCompleteCalculation> => {
  if (totalUnits <= 0) {
    throw new BadRequestException('Total units must be positive');
  }

  const percentComplete = (unitsComplete / totalUnits) * 100;
  const scheduledValue = totalUnits * unitPrice;
  const earnedValue = unitsComplete * unitPrice;

  const calculation: PercentCompleteCalculation = {
    calculationId: `PC-${contractId}-${costCode}-${Date.now()}`,
    contractId,
    costCode,
    method: 'units_complete',
    scheduledValue,
    earnedValue,
    percentComplete: Math.min(percentComplete, 100),
    calculationDate: new Date(),
    calculatedBy,
  };

  await PercentCompleteModel.create(calculation);

  return calculation;
};

/**
 * Calculates percentage complete using cost-to-cost method.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} costCode - Cost code
 * @param {number} budgetedCost - Total budgeted cost
 * @param {number} actualCost - Actual cost incurred
 * @param {number} estimatedCostToComplete - Estimated cost to complete
 * @param {string} calculatedBy - User performing calculation
 * @param {any} PercentCompleteModel - Percent complete model
 * @returns {Promise<PercentCompleteCalculation>} Calculation result
 *
 * @example
 * ```typescript
 * const calc = await calculatePercentCompleteByCost(
 *   'CONT-2024-001',
 *   '02-200',
 *   1000000,
 *   400000,
 *   500000,
 *   'user123',
 *   PercentCompleteModel
 * );
 * ```
 */
export const calculatePercentCompleteByCost = async (
  contractId: string,
  costCode: string,
  budgetedCost: number,
  actualCost: number,
  estimatedCostToComplete: number,
  calculatedBy: string,
  PercentCompleteModel: any,
): Promise<PercentCompleteCalculation> => {
  if (budgetedCost <= 0) {
    throw new BadRequestException('Budgeted cost must be positive');
  }

  const estimatedTotalCost = actualCost + estimatedCostToComplete;
  const percentComplete = (actualCost / estimatedTotalCost) * 100;
  const earnedValue = (percentComplete / 100) * budgetedCost;

  const calculation: PercentCompleteCalculation = {
    calculationId: `PC-${contractId}-${costCode}-${Date.now()}`,
    contractId,
    costCode,
    method: 'cost_to_cost',
    scheduledValue: budgetedCost,
    earnedValue,
    percentComplete: Math.min(percentComplete, 100),
    calculationDate: new Date(),
    calculatedBy,
  };

  await PercentCompleteModel.create(calculation);

  return calculation;
};

/**
 * Calculates percentage complete using labor hours method.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} costCode - Cost code
 * @param {number} budgetedHours - Total budgeted labor hours
 * @param {number} hoursWorked - Labor hours worked to date
 * @param {number} estimatedHoursToComplete - Estimated hours to complete
 * @param {number} budgetedValue - Budgeted value
 * @param {string} calculatedBy - User performing calculation
 * @param {any} PercentCompleteModel - Percent complete model
 * @returns {Promise<PercentCompleteCalculation>} Calculation result
 *
 * @example
 * ```typescript
 * const calc = await calculatePercentCompleteByLaborHours(
 *   'CONT-2024-001',
 *   '03-300',
 *   1000,
 *   500,
 *   400,
 *   100000,
 *   'user123',
 *   PercentCompleteModel
 * );
 * ```
 */
export const calculatePercentCompleteByLaborHours = async (
  contractId: string,
  costCode: string,
  budgetedHours: number,
  hoursWorked: number,
  estimatedHoursToComplete: number,
  budgetedValue: number,
  calculatedBy: string,
  PercentCompleteModel: any,
): Promise<PercentCompleteCalculation> => {
  if (budgetedHours <= 0) {
    throw new BadRequestException('Budgeted hours must be positive');
  }

  const estimatedTotalHours = hoursWorked + estimatedHoursToComplete;
  const percentComplete = (hoursWorked / estimatedTotalHours) * 100;
  const earnedValue = (percentComplete / 100) * budgetedValue;

  const calculation: PercentCompleteCalculation = {
    calculationId: `PC-${contractId}-${costCode}-${Date.now()}`,
    contractId,
    costCode,
    method: 'labor_hours',
    scheduledValue: budgetedValue,
    earnedValue,
    percentComplete: Math.min(percentComplete, 100),
    calculationDate: new Date(),
    calculatedBy,
  };

  await PercentCompleteModel.create(calculation);

  return calculation;
};

/**
 * Calculates weighted percentage complete across multiple items.
 *
 * @param {string} contractId - Contract identifier
 * @param {WeightedProgressItem[]} items - Weighted progress items
 * @param {string} calculatedBy - User performing calculation
 * @returns {Promise<any>} Weighted calculation result
 *
 * @example
 * ```typescript
 * const weighted = await calculateWeightedPercentComplete('CONT-2024-001', [
 *   { itemId: '1', description: 'Foundation', weight: 30, plannedCompletion: 100, actualCompletion: 100 },
 *   { itemId: '2', description: 'Structure', weight: 50, plannedCompletion: 50, actualCompletion: 30 },
 *   { itemId: '3', description: 'Finishes', weight: 20, plannedCompletion: 0, actualCompletion: 0 }
 * ], 'user123');
 * console.log(`Weighted completion: ${weighted.weightedActual}%`);
 * ```
 */
export const calculateWeightedPercentComplete = async (
  contractId: string,
  items: WeightedProgressItem[],
  calculatedBy: string,
): Promise<any> => {
  if (items.length === 0) {
    throw new BadRequestException('Must provide at least one weighted item');
  }

  // Validate weights sum to 100
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (Math.abs(totalWeight - 100) > 0.01) {
    throw new BadRequestException(`Weights must sum to 100 (current: ${totalWeight})`);
  }

  let weightedPlannedTotal = 0;
  let weightedActualTotal = 0;

  const calculatedItems = items.map((item) => {
    const weightedPlanned = (item.weight / 100) * item.plannedCompletion;
    const weightedActual = (item.weight / 100) * item.actualCompletion;

    weightedPlannedTotal += weightedPlanned;
    weightedActualTotal += weightedActual;

    return {
      ...item,
      weightedPlanned,
      weightedActual,
    };
  });

  return {
    contractId,
    calculationDate: new Date(),
    calculatedBy,
    weightedPlanned: weightedPlannedTotal,
    weightedActual: weightedActualTotal,
    items: calculatedItems,
  };
};

/**
 * Updates units of work progress tracking.
 *
 * @param {string} unitId - Unit identifier
 * @param {number} unitsCompletedThisPeriod - Units completed this period
 * @param {any} UnitsOfWorkModel - Units of work model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated units of work
 *
 * @example
 * ```typescript
 * const updated = await updateUnitsOfWorkProgress('UNIT-001', 100, UnitsOfWorkModel);
 * console.log(`Total units complete: ${updated.unitsCompletedToDate}`);
 * ```
 */
export const updateUnitsOfWorkProgress = async (
  unitId: string,
  unitsCompletedThisPeriod: number,
  UnitsOfWorkModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const unit = await UnitsOfWorkModel.findOne({ where: { unitId } });

  if (!unit) {
    throw new NotFoundException(`Unit ${unitId} not found`);
  }

  unit.unitsCompletedPrevious = parseFloat(unit.unitsCompletedToDate);
  unit.unitsCompletedThisPeriod = unitsCompletedThisPeriod;
  unit.unitsCompletedToDate =
    parseFloat(unit.unitsCompletedPrevious) + unitsCompletedThisPeriod;

  // Calculate percentage complete
  unit.percentComplete =
    (parseFloat(unit.unitsCompletedToDate) / parseFloat(unit.totalUnitsScheduled)) * 100;

  // Calculate value complete
  unit.valueComplete = parseFloat(unit.unitsCompletedToDate) * parseFloat(unit.unitPrice);

  await unit.save({ transaction });

  return unit;
};

/**
 * Tracks labor hours for progress measurement.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} costCode - Cost code
 * @param {string} classification - Labor classification
 * @param {number} hoursWorkedThisPeriod - Hours worked this period
 * @param {number} budgetedHours - Total budgeted hours
 * @param {number} laborRate - Labor rate per hour
 * @returns {Promise<LaborHourTracking>} Labor hour tracking
 *
 * @example
 * ```typescript
 * const labor = await trackLaborHoursForProgress(
 *   'CONT-2024-001',
 *   '04-400',
 *   'Carpenter',
 *   40,
 *   1000,
 *   50,
 * );
 * ```
 */
export const trackLaborHoursForProgress = async (
  contractId: string,
  costCode: string,
  classification: string,
  hoursWorkedThisPeriod: number,
  budgetedHours: number,
  laborRate: number,
): Promise<LaborHourTracking> => {
  const trackingId = `LH-${contractId}-${costCode}-${classification}-${Date.now()}`;

  const laborTracking: LaborHourTracking = {
    trackingId,
    contractId,
    costCode,
    classification,
    budgetedHours,
    hoursWorkedPrevious: 0,
    hoursWorkedThisPeriod,
    hoursWorkedToDate: hoursWorkedThisPeriod,
    percentComplete: (hoursWorkedThisPeriod / budgetedHours) * 100,
    laborRate,
    laborCost: hoursWorkedThisPeriod * laborRate,
  };

  return laborTracking;
};

/**
 * Calculates milestone-based percentage complete.
 *
 * @param {string} contractId - Contract identifier
 * @param {MilestonePayment[]} milestones - Milestone payments
 * @param {string} calculatedBy - User performing calculation
 * @param {any} PercentCompleteModel - Percent complete model
 * @returns {Promise<any>} Milestone calculation
 *
 * @example
 * ```typescript
 * const milestoneCalc = await calculateMilestonePercentComplete('CONT-2024-001', milestones, 'user123', PercentCompleteModel);
 * ```
 */
export const calculateMilestonePercentComplete = async (
  contractId: string,
  milestones: MilestonePayment[],
  calculatedBy: string,
  PercentCompleteModel: any,
): Promise<any> => {
  if (milestones.length === 0) {
    throw new BadRequestException('Must provide at least one milestone');
  }

  const completedMilestones = milestones.filter((m) => m.completionStatus === 'complete');
  const totalPercentage = milestones.reduce((sum, m) => sum + m.paymentPercentage, 0);
  const completedPercentage = completedMilestones.reduce(
    (sum, m) => sum + m.paymentPercentage,
    0,
  );

  const percentComplete = (completedPercentage / totalPercentage) * 100;

  const calculation = {
    contractId,
    method: 'milestone',
    totalMilestones: milestones.length,
    completedMilestones: completedMilestones.length,
    percentComplete: Math.min(percentComplete, 100),
    calculationDate: new Date(),
    calculatedBy,
    milestones: milestones.map((m) => ({
      milestoneId: m.milestoneId,
      milestoneName: m.milestoneName,
      paymentPercentage: m.paymentPercentage,
      completionStatus: m.completionStatus,
    })),
  };

  return calculation;
};

/**
 * Validates percentage complete calculation against schedule.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} calculatedPercent - Calculated percentage
 * @param {number} scheduledPercent - Scheduled percentage
 * @returns {Promise<{ valid: boolean; variance: number; status: string }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePercentCompleteAgainstSchedule('CONT-2024-001', 45, 50);
 * if (validation.status === 'behind_schedule') {
 *   console.log(`Behind by ${validation.variance}%`);
 * }
 * ```
 */
export const validatePercentCompleteAgainstSchedule = async (
  contractId: string,
  calculatedPercent: number,
  scheduledPercent: number,
): Promise<{ valid: boolean; variance: number; status: string }> => {
  const variance = calculatedPercent - scheduledPercent;

  let status = 'on_schedule';
  if (variance < -5) {
    status = 'behind_schedule';
  } else if (variance > 5) {
    status = 'ahead_of_schedule';
  }

  return {
    valid: Math.abs(variance) <= 10, // Within 10% tolerance
    variance,
    status,
  };
};

/**
 * Generates percentage complete trend analysis.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} periods - Number of periods to analyze
 * @param {any} PercentCompleteModel - Percent complete model
 * @returns {Promise<any>} Trend analysis
 *
 * @example
 * ```typescript
 * const trend = await generatePercentCompleteTrend('CONT-2024-001', 6, PercentCompleteModel);
 * console.log('Monthly progress:', trend.monthlyProgress);
 * ```
 */
export const generatePercentCompleteTrend = async (
  contractId: string,
  periods: number,
  PercentCompleteModel: any,
): Promise<any> => {
  const calculations = await PercentCompleteModel.findAll({
    where: { contractId },
    order: [['calculationDate', 'DESC']],
    limit: periods,
  });

  if (calculations.length === 0) {
    return {
      contractId,
      periods: 0,
      trend: [],
    };
  }

  const trend = calculations.reverse().map((calc: any) => ({
    calculationDate: calc.calculationDate,
    percentComplete: parseFloat(calc.percentComplete),
    earnedValue: parseFloat(calc.earnedValue),
  }));

  // Calculate average monthly progress
  const monthlyProgress =
    trend.length > 1
      ? (trend[trend.length - 1].percentComplete - trend[0].percentComplete) / (trend.length - 1)
      : 0;

  return {
    contractId,
    periods: trend.length,
    trend,
    monthlyProgress,
    currentPercent: trend[trend.length - 1].percentComplete,
  };
};

/**
 * Reconciles percentage complete across calculation methods.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} costCode - Cost code
 * @param {any} PercentCompleteModel - Percent complete model
 * @returns {Promise<any>} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcilePercentCompleteMethod('CONT-2024-001', '01-100', PercentCompleteModel);
 * console.log('Average across methods:', reconciliation.averagePercent);
 * ```
 */
export const reconcilePercentCompleteMethod = async (
  contractId: string,
  costCode: string,
  PercentCompleteModel: any,
): Promise<any> => {
  const calculations = await PercentCompleteModel.findAll({
    where: { contractId, costCode },
    order: [['calculationDate', 'DESC']],
    limit: 10,
  });

  if (calculations.length === 0) {
    return {
      contractId,
      costCode,
      calculations: [],
      averagePercent: 0,
    };
  }

  const byMethod: Record<string, number[]> = {};

  calculations.forEach((calc: any) => {
    if (!byMethod[calc.method]) {
      byMethod[calc.method] = [];
    }
    byMethod[calc.method].push(parseFloat(calc.percentComplete));
  });

  const methodAverages: Record<string, number> = {};
  Object.keys(byMethod).forEach((method) => {
    const avg = byMethod[method].reduce((sum, val) => sum + val, 0) / byMethod[method].length;
    methodAverages[method] = avg;
  });

  const overallAverage =
    Object.values(methodAverages).reduce((sum, val) => sum + val, 0) /
    Object.values(methodAverages).length;

  return {
    contractId,
    costCode,
    byMethod: methodAverages,
    averagePercent: overallAverage,
    recommendedMethod: Object.keys(methodAverages).sort(
      (a, b) => methodAverages[b] - methodAverages[a],
    )[0],
  };
};

// ============================================================================
// EARNED VALUE MANAGEMENT (Functions 11-20)
// ============================================================================

/**
 * Calculates comprehensive earned value metrics for contract.
 *
 * @param {string} contractId - Contract identifier
 * @param {Date} asOfDate - Calculation date
 * @param {number} budgetAtCompletion - Total budget at completion
 * @param {number} plannedValue - Planned value to date
 * @param {number} earnedValue - Earned value to date
 * @param {number} actualCost - Actual cost to date
 * @param {any} EarnedValueMetricsModel - Earned value model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<EarnedValueMetrics>} Earned value metrics
 *
 * @example
 * ```typescript
 * const evm = await calculateEarnedValueMetrics(
 *   'CONT-2024-001',
 *   new Date(),
 *   5000000,
 *   2000000,
 *   1800000,
 *   1900000,
 *   EarnedValueMetricsModel
 * );
 * console.log(`CPI: ${evm.costPerformanceIndex}, SPI: ${evm.schedulePerformanceIndex}`);
 * ```
 */
export const calculateEarnedValueMetrics = async (
  contractId: string,
  asOfDate: Date,
  budgetAtCompletion: number,
  plannedValue: number,
  earnedValue: number,
  actualCost: number,
  EarnedValueMetricsModel: any,
  transaction?: Transaction,
): Promise<EarnedValueMetrics> => {
  if (budgetAtCompletion <= 0) {
    throw new BadRequestException('Budget at completion must be positive');
  }

  // Calculate variances
  const costVariance = earnedValue - actualCost;
  const scheduleVariance = earnedValue - plannedValue;

  // Calculate performance indices
  const costPerformanceIndex = actualCost > 0 ? earnedValue / actualCost : 1;
  const schedulePerformanceIndex = plannedValue > 0 ? earnedValue / plannedValue : 1;

  // Calculate estimates
  const estimateAtCompletion =
    costPerformanceIndex > 0 ? budgetAtCompletion / costPerformanceIndex : budgetAtCompletion;

  const estimateToComplete = estimateAtCompletion - actualCost;
  const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;

  // Calculate TCPI (To Complete Performance Index)
  const workRemaining = budgetAtCompletion - earnedValue;
  const fundsRemaining = budgetAtCompletion - actualCost;
  const toCompletePerformanceIndex =
    fundsRemaining > 0 ? workRemaining / fundsRemaining : 0;

  const metrics: EarnedValueMetrics = {
    contractId,
    asOfDate,
    budgetAtCompletion,
    plannedValue,
    earnedValue,
    actualCost,
    costVariance,
    scheduleVariance,
    costPerformanceIndex,
    schedulePerformanceIndex,
    estimateAtCompletion,
    estimateToComplete,
    varianceAtCompletion,
    toCompletePerformanceIndex,
  };

  await EarnedValueMetricsModel.create(metrics, { transaction });

  return metrics;
};

/**
 * Generates S-curve (progress curve) data for contract.
 *
 * @param {string} contractId - Contract identifier
 * @param {Date} startDate - Contract start date
 * @param {Date} endDate - Contract end date
 * @param {number} totalValue - Total contract value
 * @param {any} EarnedValueMetricsModel - Earned value model
 * @returns {Promise<SCurveDataPoint[]>} S-curve data points
 *
 * @example
 * ```typescript
 * const sCurve = await generateSCurveData(
 *   'CONT-2024-001',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   5000000,
 *   EarnedValueMetricsModel
 * );
 * ```
 */
export const generateSCurveData = async (
  contractId: string,
  startDate: Date,
  endDate: Date,
  totalValue: number,
  EarnedValueMetricsModel: any,
): Promise<SCurveDataPoint[]> => {
  const totalDays = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const dataPoints: SCurveDataPoint[] = [];

  // Generate monthly data points
  const monthlyPeriods = Math.ceil(totalDays / 30);

  for (let period = 0; period <= monthlyPeriods; period++) {
    const periodDate = new Date(startDate);
    periodDate.setDate(periodDate.getDate() + period * 30);

    // S-curve formula: value = totalValue * (days / totalDays)^2 * (3 - 2 * (days / totalDays))
    const daysElapsed = Math.min(period * 30, totalDays);
    const progress = daysElapsed / totalDays;
    const sCurveProgress = progress * progress * (3 - 2 * progress);

    const plannedValue = totalValue * sCurveProgress;

    dataPoints.push({
      period,
      periodDate,
      plannedValue,
      earnedValue: 0, // Would be populated from actual data
      actualCost: 0, // Would be populated from actual data
      cumulativePlanned: plannedValue,
      cumulativeEarned: 0,
      cumulativeActual: 0,
      scheduleVariance: 0,
      costVariance: 0,
    });
  }

  return dataPoints;
};

/**
 * Analyzes earned value trends and forecasts.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} periods - Number of periods to analyze
 * @param {any} EarnedValueMetricsModel - Earned value model
 * @returns {Promise<any>} Trend analysis
 *
 * @example
 * ```typescript
 * const trend = await analyzeEarnedValueTrends('CONT-2024-001', 12, EarnedValueMetricsModel);
 * console.log('Forecast completion:', trend.forecastCompletion);
 * ```
 */
export const analyzeEarnedValueTrends = async (
  contractId: string,
  periods: number,
  EarnedValueMetricsModel: any,
): Promise<any> => {
  const metrics = await EarnedValueMetricsModel.findAll({
    where: { contractId },
    order: [['asOfDate', 'DESC']],
    limit: periods,
  });

  if (metrics.length === 0) {
    return {
      contractId,
      trend: [],
      averageCPI: 0,
      averageSPI: 0,
    };
  }

  const trend = metrics.reverse().map((m: any) => ({
    asOfDate: m.asOfDate,
    costPerformanceIndex: parseFloat(m.costPerformanceIndex),
    schedulePerformanceIndex: parseFloat(m.schedulePerformanceIndex),
    estimateAtCompletion: parseFloat(m.estimateAtCompletion),
  }));

  const averageCPI =
    trend.reduce((sum: number, t: any) => sum + t.costPerformanceIndex, 0) / trend.length;

  const averageSPI =
    trend.reduce((sum: number, t: any) => sum + t.schedulePerformanceIndex, 0) / trend.length;

  return {
    contractId,
    trend,
    averageCPI,
    averageSPI,
    performanceStatus: averageCPI >= 0.95 && averageSPI >= 0.95 ? 'good' : 'concern',
  };
};

/**
 * Calculates estimate at completion using multiple methods.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} budgetAtCompletion - Budget at completion
 * @param {number} earnedValue - Earned value to date
 * @param {number} actualCost - Actual cost to date
 * @param {number} costPerformanceIndex - Cost performance index
 * @returns {Promise<any>} EAC calculations
 *
 * @example
 * ```typescript
 * const eac = await calculateEstimateAtCompletion('CONT-2024-001', 5000000, 2000000, 2100000, 0.95);
 * console.log('EAC methods:', eac);
 * ```
 */
export const calculateEstimateAtCompletion = async (
  contractId: string,
  budgetAtCompletion: number,
  earnedValue: number,
  actualCost: number,
  costPerformanceIndex: number,
): Promise<any> => {
  // Method 1: BAC / CPI
  const eacMethod1 = costPerformanceIndex > 0 ? budgetAtCompletion / costPerformanceIndex : budgetAtCompletion;

  // Method 2: AC + (BAC - EV)
  const eacMethod2 = actualCost + (budgetAtCompletion - earnedValue);

  // Method 3: AC + [(BAC - EV) / CPI]
  const eacMethod3 =
    costPerformanceIndex > 0
      ? actualCost + (budgetAtCompletion - earnedValue) / costPerformanceIndex
      : actualCost + (budgetAtCompletion - earnedValue);

  const averageEAC = (eacMethod1 + eacMethod2 + eacMethod3) / 3;

  return {
    contractId,
    budgetAtCompletion,
    earnedValue,
    actualCost,
    eacMethod1,
    eacMethod2,
    eacMethod3,
    averageEAC,
    recommendedEAC: eacMethod1, // Most commonly used
  };
};

/**
 * Validates earned value metrics thresholds.
 *
 * @param {EarnedValueMetrics} metrics - Earned value metrics
 * @returns {Promise<{ valid: boolean; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateEarnedValueThresholds(metrics);
 * if (!validation.valid) {
 *   console.log('Warnings:', validation.warnings);
 * }
 * ```
 */
export const validateEarnedValueThresholds = async (
  metrics: EarnedValueMetrics,
): Promise<{ valid: boolean; warnings: string[] }> => {
  const warnings: string[] = [];

  // CPI thresholds
  if (metrics.costPerformanceIndex < 0.9) {
    warnings.push('Cost Performance Index below 0.9 - significant cost overrun');
  } else if (metrics.costPerformanceIndex < 0.95) {
    warnings.push('Cost Performance Index below 0.95 - cost overrun warning');
  }

  // SPI thresholds
  if (metrics.schedulePerformanceIndex < 0.9) {
    warnings.push('Schedule Performance Index below 0.9 - significant schedule delay');
  } else if (metrics.schedulePerformanceIndex < 0.95) {
    warnings.push('Schedule Performance Index below 0.95 - schedule delay warning');
  }

  // TCPI threshold
  if (metrics.toCompletePerformanceIndex > 1.1) {
    warnings.push(
      'To Complete Performance Index above 1.1 - unrealistic performance required',
    );
  }

  // VAC threshold
  if (metrics.varianceAtCompletion < -metrics.budgetAtCompletion * 0.1) {
    warnings.push('Variance at Completion exceeds 10% of budget');
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
};

/**
 * Generates earned value dashboard summary.
 *
 * @param {string} contractId - Contract identifier
 * @param {any} EarnedValueMetricsModel - Earned value model
 * @returns {Promise<any>} Dashboard summary
 *
 * @example
 * ```typescript
 * const dashboard = await generateEarnedValueDashboard('CONT-2024-001', EarnedValueMetricsModel);
 * ```
 */
export const generateEarnedValueDashboard = async (
  contractId: string,
  EarnedValueMetricsModel: any,
): Promise<any> => {
  const latestMetrics = await EarnedValueMetricsModel.findOne({
    where: { contractId },
    order: [['asOfDate', 'DESC']],
  });

  if (!latestMetrics) {
    throw new NotFoundException(`No earned value metrics found for contract ${contractId}`);
  }

  const validation = await validateEarnedValueThresholds(latestMetrics);

  return {
    contractId,
    asOfDate: latestMetrics.asOfDate,
    performanceIndicators: {
      cpi: parseFloat(latestMetrics.costPerformanceIndex),
      spi: parseFloat(latestMetrics.schedulePerformanceIndex),
      tcpi: parseFloat(latestMetrics.toCompletePerformanceIndex),
    },
    financials: {
      budgetAtCompletion: parseFloat(latestMetrics.budgetAtCompletion),
      plannedValue: parseFloat(latestMetrics.plannedValue),
      earnedValue: parseFloat(latestMetrics.earnedValue),
      actualCost: parseFloat(latestMetrics.actualCost),
      estimateAtCompletion: parseFloat(latestMetrics.estimateAtCompletion),
    },
    variances: {
      costVariance: parseFloat(latestMetrics.costVariance),
      scheduleVariance: parseFloat(latestMetrics.scheduleVariance),
      varianceAtCompletion: parseFloat(latestMetrics.varianceAtCompletion),
    },
    status: validation.valid ? 'healthy' : 'attention_required',
    warnings: validation.warnings,
  };
};

/**
 * Calculates variance analysis for earned value.
 *
 * @param {string} contractId - Contract identifier
 * @param {any} EarnedValueMetricsModel - Earned value model
 * @returns {Promise<any>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await calculateEarnedValueVarianceAnalysis('CONT-2024-001', EarnedValueMetricsModel);
 * ```
 */
export const calculateEarnedValueVarianceAnalysis = async (
  contractId: string,
  EarnedValueMetricsModel: any,
): Promise<any> => {
  const metrics = await EarnedValueMetricsModel.findAll({
    where: { contractId },
    order: [['asOfDate', 'ASC']],
  });

  if (metrics.length === 0) {
    throw new NotFoundException(`No metrics found for contract ${contractId}`);
  }

  const varianceTrend = metrics.map((m: any) => ({
    asOfDate: m.asOfDate,
    costVariance: parseFloat(m.costVariance),
    scheduleVariance: parseFloat(m.scheduleVariance),
    costVariancePercent:
      (parseFloat(m.costVariance) / parseFloat(m.earnedValue)) * 100,
    scheduleVariancePercent:
      (parseFloat(m.scheduleVariance) / parseFloat(m.plannedValue)) * 100,
  }));

  const latestMetrics = metrics[metrics.length - 1];

  return {
    contractId,
    currentVariances: {
      costVariance: parseFloat(latestMetrics.costVariance),
      scheduleVariance: parseFloat(latestMetrics.scheduleVariance),
    },
    varianceTrend,
    analysis: {
      costTrend:
        varianceTrend[varianceTrend.length - 1].costVariance > 0 ? 'under_budget' : 'over_budget',
      scheduleTrend:
        varianceTrend[varianceTrend.length - 1].scheduleVariance > 0
          ? 'ahead_of_schedule'
          : 'behind_schedule',
    },
  };
};

/**
 * Forecasts project completion date based on earned value.
 *
 * @param {string} contractId - Contract identifier
 * @param {Date} plannedCompletionDate - Planned completion date
 * @param {number} schedulePerformanceIndex - Schedule performance index
 * @returns {Promise<any>} Completion forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastProjectCompletionDate('CONT-2024-001', new Date('2024-12-31'), 0.85);
 * console.log('Forecasted completion:', forecast.forecastedDate);
 * ```
 */
export const forecastProjectCompletionDate = async (
  contractId: string,
  plannedCompletionDate: Date,
  schedulePerformanceIndex: number,
): Promise<any> => {
  if (schedulePerformanceIndex <= 0) {
    throw new BadRequestException('Schedule Performance Index must be positive');
  }

  const now = new Date();
  const remainingDays = Math.floor(
    (plannedCompletionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Adjust remaining days by SPI
  const forecastRemainingDays = Math.ceil(remainingDays / schedulePerformanceIndex);

  const forecastedDate = new Date(now);
  forecastedDate.setDate(forecastedDate.getDate() + forecastRemainingDays);

  const delayDays = Math.floor(
    (forecastedDate.getTime() - plannedCompletionDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    contractId,
    plannedCompletionDate,
    forecastedDate,
    schedulePerformanceIndex,
    delayDays,
    status: delayDays > 0 ? 'delayed' : 'on_track',
  };
};

/**
 * Generates comprehensive earned value report.
 *
 * @param {string} contractId - Contract identifier
 * @param {Date} reportDate - Report date
 * @param {any} EarnedValueMetricsModel - Earned value model
 * @returns {Promise<any>} Comprehensive report
 *
 * @example
 * ```typescript
 * const report = await generateComprehensiveEarnedValueReport('CONT-2024-001', new Date(), EarnedValueMetricsModel);
 * ```
 */
export const generateComprehensiveEarnedValueReport = async (
  contractId: string,
  reportDate: Date,
  EarnedValueMetricsModel: any,
): Promise<any> => {
  const dashboard = await generateEarnedValueDashboard(contractId, EarnedValueMetricsModel);
  const variance = await calculateEarnedValueVarianceAnalysis(contractId, EarnedValueMetricsModel);
  const trends = await analyzeEarnedValueTrends(contractId, 12, EarnedValueMetricsModel);

  return {
    contractId,
    reportDate,
    dashboard,
    variance,
    trends,
    executiveSummary: {
      overallStatus: dashboard.status,
      costHealth:
        dashboard.performanceIndicators.cpi >= 0.95 ? 'healthy' : 'at_risk',
      scheduleHealth:
        dashboard.performanceIndicators.spi >= 0.95 ? 'healthy' : 'at_risk',
      keyIssues: dashboard.warnings,
    },
  };
};

/**
 * Compares earned value across multiple contracts.
 *
 * @param {string[]} contractIds - Contract identifiers
 * @param {any} EarnedValueMetricsModel - Earned value model
 * @returns {Promise<any>} Comparison report
 *
 * @example
 * ```typescript
 * const comparison = await compareEarnedValueAcrossContracts(
 *   ['CONT-2024-001', 'CONT-2024-002'],
 *   EarnedValueMetricsModel
 * );
 * ```
 */
export const compareEarnedValueAcrossContracts = async (
  contractIds: string[],
  EarnedValueMetricsModel: any,
): Promise<any> => {
  const comparisons = [];

  for (const contractId of contractIds) {
    const latestMetrics = await EarnedValueMetricsModel.findOne({
      where: { contractId },
      order: [['asOfDate', 'DESC']],
    });

    if (latestMetrics) {
      comparisons.push({
        contractId,
        cpi: parseFloat(latestMetrics.costPerformanceIndex),
        spi: parseFloat(latestMetrics.schedulePerformanceIndex),
        costVariance: parseFloat(latestMetrics.costVariance),
        scheduleVariance: parseFloat(latestMetrics.scheduleVariance),
      });
    }
  }

  const averageCPI = comparisons.reduce((sum, c) => sum + c.cpi, 0) / comparisons.length;
  const averageSPI = comparisons.reduce((sum, c) => sum + c.spi, 0) / comparisons.length;

  return {
    contractCount: comparisons.length,
    comparisons,
    portfolioMetrics: {
      averageCPI,
      averageSPI,
      performingWell: comparisons.filter((c) => c.cpi >= 0.95 && c.spi >= 0.95).length,
      needsAttention: comparisons.filter((c) => c.cpi < 0.95 || c.spi < 0.95).length,
    },
  };
};

// ============================================================================
// PAYMENT FORECASTING (Functions 21-30)
// ============================================================================

/**
 * Generates payment forecast based on historical billing patterns.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} forecastHorizon - Forecast horizon in months
 * @param {number} totalContractValue - Total contract value
 * @param {any} PayApplicationModel - Pay application model
 * @returns {Promise<PaymentForecast>} Payment forecast
 *
 * @example
 * ```typescript
 * const forecast = await generatePaymentForecast('CONT-2024-001', 12, 5000000, PayApplicationModel);
 * console.log('Total forecast:', forecast.totalForecastAmount);
 * ```
 */
export const generatePaymentForecast = async (
  contractId: string,
  forecastHorizon: number,
  totalContractValue: number,
  PayApplicationModel: any,
): Promise<PaymentForecast> => {
  // Get historical payment data
  const historicalPayments = await PayApplicationModel.findAll({
    where: { contractId, status: 'paid' },
    order: [['periodEnding', 'ASC']],
  });

  const monthlyForecasts: MonthlyForecast[] = [];
  let cumulativeForecast = 0;

  // Calculate average monthly payment from historical data
  const avgMonthlyPayment =
    historicalPayments.length > 0
      ? historicalPayments.reduce((sum: number, p: any) => sum + parseFloat(p.totalEarned), 0) /
        historicalPayments.length
      : totalContractValue / forecastHorizon;

  for (let month = 1; month <= forecastHorizon; month++) {
    const forecastDate = new Date();
    forecastDate.setMonth(forecastDate.getMonth() + month);

    // Use S-curve for more realistic forecast
    const progress = month / forecastHorizon;
    const sCurveProgress = progress * progress * (3 - 2 * progress);
    const forecastAmount = totalContractValue * sCurveProgress - cumulativeForecast;

    cumulativeForecast += forecastAmount;

    monthlyForecasts.push({
      month,
      monthDate: forecastDate,
      forecastAmount,
      cumulativeForecast,
      basis: 'S-curve projection',
      assumptions: ['Normal work progression', 'No major delays', 'Weather permitting'],
    });
  }

  return {
    contractId,
    forecastDate: new Date(),
    forecastHorizon,
    monthlyForecasts,
    totalForecastAmount: cumulativeForecast,
    confidenceLevel: historicalPayments.length >= 3 ? 'high' : 'medium',
  };
};

/**
 * Creates milestone payment schedule.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} totalContractValue - Total contract value
 * @param {MilestonePayment[]} milestones - Milestone payments
 * @returns {Promise<MilestonePaymentSchedule>} Payment schedule
 *
 * @example
 * ```typescript
 * const schedule = await createMilestonePaymentSchedule('CONT-2024-001', 5000000, milestones);
 * ```
 */
export const createMilestonePaymentSchedule = async (
  contractId: string,
  totalContractValue: number,
  milestones: MilestonePayment[],
): Promise<MilestonePaymentSchedule> => {
  if (milestones.length === 0) {
    throw new BadRequestException('Must provide at least one milestone');
  }

  // Validate percentages sum to 100
  const totalPercentage = milestones.reduce((sum, m) => sum + m.paymentPercentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new BadRequestException(`Milestone percentages must sum to 100 (current: ${totalPercentage})`);
  }

  // Calculate payment amounts
  const milestonesWithAmounts = milestones.map((m) => ({
    ...m,
    paymentAmount: (totalContractValue * m.paymentPercentage) / 100,
  }));

  const totalMilestoneBilling = milestonesWithAmounts.reduce(
    (sum, m) => sum + m.paymentAmount,
    0,
  );

  return {
    scheduleId: `MS-SCHED-${contractId}`,
    contractId,
    milestones: milestonesWithAmounts,
    totalContractValue,
    totalMilestoneBilling,
  };
};

/**
 * Generates payment application schedule for fiscal year.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} fiscalYear - Fiscal year
 * @param {Date} contractStartDate - Contract start date
 * @param {Date} contractEndDate - Contract end date
 * @param {number} totalValue - Total contract value
 * @returns {Promise<PaymentApplicationSchedule>} Application schedule
 *
 * @example
 * ```typescript
 * const schedule = await generatePaymentApplicationSchedule(
 *   'CONT-2024-001',
 *   2024,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   5000000
 * );
 * ```
 */
export const generatePaymentApplicationSchedule = async (
  contractId: string,
  fiscalYear: number,
  contractStartDate: Date,
  contractEndDate: Date,
  totalValue: number,
): Promise<PaymentApplicationSchedule> => {
  const applications: ScheduledApplication[] = [];

  const totalMonths = Math.ceil(
    (contractEndDate.getTime() - contractStartDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
  );

  const monthlyBilling = totalValue / totalMonths;

  let applicationNumber = 1;
  let currentDate = new Date(contractStartDate);

  while (currentDate <= contractEndDate && currentDate.getFullYear() === fiscalYear) {
    applications.push({
      applicationNumber,
      scheduledDate: new Date(currentDate),
      scheduledAmount: monthlyBilling,
      status: 'scheduled',
    });

    currentDate.setMonth(currentDate.getMonth() + 1);
    applicationNumber++;
  }

  const totalScheduledBilling = applications.reduce((sum, app) => sum + app.scheduledAmount, 0);

  return {
    scheduleId: `PA-SCHED-${contractId}-${fiscalYear}`,
    contractId,
    fiscalYear,
    applications,
    totalScheduledBilling,
  };
};

/**
 * Updates milestone payment status.
 *
 * @param {string} milestoneId - Milestone identifier
 * @param {'complete' | 'in_progress' | 'not_started'} completionStatus - Completion status
 * @param {'paid' | 'billed' | 'pending'} paymentStatus - Payment status
 * @param {Date} [paymentDate] - Payment date
 * @returns {Promise<any>} Updated milestone
 *
 * @example
 * ```typescript
 * const updated = await updateMilestonePaymentStatus('MS-001', 'complete', 'paid', new Date());
 * ```
 */
export const updateMilestonePaymentStatus = async (
  milestoneId: string,
  completionStatus: 'complete' | 'in_progress' | 'not_started',
  paymentStatus: 'paid' | 'billed' | 'pending',
  paymentDate?: Date,
): Promise<any> => {
  return {
    milestoneId,
    completionStatus,
    paymentStatus,
    paymentDate,
    updatedAt: new Date(),
  };
};

/**
 * Validates payment forecast against budget constraints.
 *
 * @param {PaymentForecast} forecast - Payment forecast
 * @param {number} availableBudget - Available budget
 * @returns {Promise<{ valid: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePaymentForecastAgainstBudget(forecast, 5000000);
 * if (!validation.valid) {
 *   console.log('Budget issues:', validation.issues);
 * }
 * ```
 */
export const validatePaymentForecastAgainstBudget = async (
  forecast: PaymentForecast,
  availableBudget: number,
): Promise<{ valid: boolean; issues: string[] }> => {
  const issues: string[] = [];

  if (forecast.totalForecastAmount > availableBudget) {
    issues.push(
      `Forecast amount ($${forecast.totalForecastAmount}) exceeds available budget ($${availableBudget})`,
    );
  }

  // Check for monthly budget spikes
  const avgMonthly =
    forecast.monthlyForecasts.reduce((sum, f) => sum + f.forecastAmount, 0) /
    forecast.monthlyForecasts.length;

  const spikes = forecast.monthlyForecasts.filter((f) => f.forecastAmount > avgMonthly * 1.5);

  if (spikes.length > 0) {
    issues.push(`${spikes.length} months with payment spikes detected`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};

/**
 * Adjusts payment forecast based on actual performance.
 *
 * @param {string} contractId - Contract identifier
 * @param {PaymentForecast} originalForecast - Original forecast
 * @param {number} actualToDate - Actual payments to date
 * @param {number} schedulePerformanceIndex - Schedule performance index
 * @returns {Promise<PaymentForecast>} Adjusted forecast
 *
 * @example
 * ```typescript
 * const adjusted = await adjustPaymentForecastByPerformance(
 *   'CONT-2024-001',
 *   originalForecast,
 *   2000000,
 *   0.9
 * );
 * ```
 */
export const adjustPaymentForecastByPerformance = async (
  contractId: string,
  originalForecast: PaymentForecast,
  actualToDate: number,
  schedulePerformanceIndex: number,
): Promise<PaymentForecast> => {
  const adjustedForecasts: MonthlyForecast[] = [];
  let cumulativeForecast = actualToDate;

  for (const monthForecast of originalForecast.monthlyForecasts) {
    // Adjust future forecasts by SPI
    const adjustedAmount = monthForecast.forecastAmount / schedulePerformanceIndex;
    cumulativeForecast += adjustedAmount;

    adjustedForecasts.push({
      ...monthForecast,
      forecastAmount: adjustedAmount,
      cumulativeForecast,
      basis: 'SPI-adjusted projection',
      assumptions: [
        ...monthForecast.assumptions,
        `Adjusted by SPI ${schedulePerformanceIndex}`,
      ],
    });
  }

  return {
    ...originalForecast,
    monthlyForecasts: adjustedForecasts,
    totalForecastAmount: cumulativeForecast,
    confidenceLevel: schedulePerformanceIndex >= 0.95 ? 'high' : 'medium',
  };
};

/**
 * Generates cash flow projection for contract.
 *
 * @param {string} contractId - Contract identifier
 * @param {PaymentForecast} forecast - Payment forecast
 * @param {number} retainageRate - Retainage rate percentage
 * @returns {Promise<any>} Cash flow projection
 *
 * @example
 * ```typescript
 * const cashFlow = await generateCashFlowProjection('CONT-2024-001', forecast, 10);
 * ```
 */
export const generateCashFlowProjection = async (
  contractId: string,
  forecast: PaymentForecast,
  retainageRate: number,
): Promise<any> => {
  const cashFlowProjections = forecast.monthlyForecasts.map((monthForecast) => {
    const grossPayment = monthForecast.forecastAmount;
    const retainageWithheld = (grossPayment * retainageRate) / 100;
    const netPayment = grossPayment - retainageWithheld;

    return {
      month: monthForecast.month,
      monthDate: monthForecast.monthDate,
      grossPayment,
      retainageWithheld,
      netPayment,
      cumulativeNet: monthForecast.cumulativeForecast - (monthForecast.cumulativeForecast * retainageRate) / 100,
    };
  });

  const totalGross = cashFlowProjections.reduce((sum, cf) => sum + cf.grossPayment, 0);
  const totalRetainage = cashFlowProjections.reduce((sum, cf) => sum + cf.retainageWithheld, 0);
  const totalNet = cashFlowProjections.reduce((sum, cf) => sum + cf.netPayment, 0);

  return {
    contractId,
    retainageRate,
    projections: cashFlowProjections,
    totals: {
      grossPayments: totalGross,
      retainageWithheld: totalRetainage,
      netPayments: totalNet,
    },
  };
};

/**
 * Compares forecast vs actual billing performance.
 *
 * @param {string} contractId - Contract identifier
 * @param {PaymentForecast} forecast - Original forecast
 * @param {any} PayApplicationModel - Pay application model
 * @returns {Promise<any>} Comparison analysis
 *
 * @example
 * ```typescript
 * const comparison = await compareForecastVsActualBilling('CONT-2024-001', forecast, PayApplicationModel);
 * ```
 */
export const compareForecastVsActualBilling = async (
  contractId: string,
  forecast: PaymentForecast,
  PayApplicationModel: any,
): Promise<any> => {
  const actualPayments = await PayApplicationModel.findAll({
    where: { contractId },
    order: [['periodEnding', 'ASC']],
  });

  const comparisons = [];

  for (const monthForecast of forecast.monthlyForecasts) {
    const matchingActual = actualPayments.find((p: any) => {
      const paymentDate = new Date(p.periodEnding);
      return (
        paymentDate.getMonth() === monthForecast.monthDate.getMonth() &&
        paymentDate.getFullYear() === monthForecast.monthDate.getFullYear()
      );
    });

    const actualAmount = matchingActual ? parseFloat(matchingActual.totalEarned) : 0;
    const variance = actualAmount - monthForecast.forecastAmount;
    const variancePercent =
      monthForecast.forecastAmount > 0
        ? (variance / monthForecast.forecastAmount) * 100
        : 0;

    comparisons.push({
      month: monthForecast.month,
      monthDate: monthForecast.monthDate,
      forecast: monthForecast.forecastAmount,
      actual: actualAmount,
      variance,
      variancePercent,
    });
  }

  const totalForecast = comparisons.reduce((sum, c) => sum + c.forecast, 0);
  const totalActual = comparisons.reduce((sum, c) => sum + c.actual, 0);
  const totalVariance = totalActual - totalForecast;

  return {
    contractId,
    comparisons,
    totals: {
      forecast: totalForecast,
      actual: totalActual,
      variance: totalVariance,
      variancePercent: totalForecast > 0 ? (totalVariance / totalForecast) * 100 : 0,
    },
    forecastAccuracy: totalForecast > 0 ? 100 - Math.abs((totalVariance / totalForecast) * 100) : 0,
  };
};

/**
 * Generates payment schedule variance report.
 *
 * @param {string} contractId - Contract identifier
 * @param {PaymentApplicationSchedule} schedule - Payment schedule
 * @param {any} PayApplicationModel - Pay application model
 * @returns {Promise<any>} Variance report
 *
 * @example
 * ```typescript
 * const variance = await generatePaymentScheduleVarianceReport('CONT-2024-001', schedule, PayApplicationModel);
 * ```
 */
export const generatePaymentScheduleVarianceReport = async (
  contractId: string,
  schedule: PaymentApplicationSchedule,
  PayApplicationModel: any,
): Promise<any> => {
  const actualApplications = await PayApplicationModel.findAll({
    where: { contractId },
    order: [['applicationNumber', 'ASC']],
  });

  const variances = schedule.applications.map((scheduledApp) => {
    const actualApp = actualApplications.find(
      (a: any) => a.applicationNumber === scheduledApp.applicationNumber,
    );

    if (actualApp) {
      const amountVariance = parseFloat(actualApp.totalEarned) - scheduledApp.scheduledAmount;
      const dateVariance = actualApp.periodEnding
        ? Math.floor(
            (new Date(actualApp.periodEnding).getTime() - scheduledApp.scheduledDate.getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : null;

      return {
        applicationNumber: scheduledApp.applicationNumber,
        scheduledDate: scheduledApp.scheduledDate,
        actualDate: actualApp.periodEnding,
        scheduledAmount: scheduledApp.scheduledAmount,
        actualAmount: parseFloat(actualApp.totalEarned),
        amountVariance,
        dateVariance,
        status: actualApp.status,
      };
    }

    return {
      applicationNumber: scheduledApp.applicationNumber,
      scheduledDate: scheduledApp.scheduledDate,
      actualDate: null,
      scheduledAmount: scheduledApp.scheduledAmount,
      actualAmount: 0,
      amountVariance: -scheduledApp.scheduledAmount,
      dateVariance: null,
      status: 'not_submitted',
    };
  });

  return {
    contractId,
    fiscalYear: schedule.fiscalYear,
    variances,
    summary: {
      totalScheduled: schedule.totalScheduledBilling,
      totalActual: variances.reduce((sum, v) => sum + v.actualAmount, 0),
      totalVariance: variances.reduce((sum, v) => sum + v.amountVariance, 0),
    },
  };
};

// ============================================================================
// MOBILIZATION & SPECIALTY PAYMENTS (Functions 31-40)
// ============================================================================

/**
 * Processes mobilization payment advance.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} mobilizationAmount - Total mobilization amount
 * @param {number} advancePercentage - Advance payment percentage
 * @returns {Promise<any>} Mobilization payment
 *
 * @example
 * ```typescript
 * const mobilization = await processMobilizationPaymentAdvance('CONT-2024-001', 500000, 80);
 * console.log('Advance payment:', mobilization.advancePaymentAmount);
 * ```
 */
export const processMobilizationPaymentAdvance = async (
  contractId: string,
  mobilizationAmount: number,
  advancePercentage: number,
): Promise<any> => {
  if (advancePercentage < 0 || advancePercentage > 100) {
    throw new BadRequestException('Advance percentage must be between 0 and 100');
  }

  const advancePaymentAmount = (mobilizationAmount * advancePercentage) / 100;

  return {
    mobilizationId: `MOB-${contractId}`,
    contractId,
    totalMobilizationAmount: mobilizationAmount,
    advancePaymentAmount,
    advancePaymentDate: new Date(),
    equipmentDelivered: false,
    siteEstablished: false,
    balanceRecouped: 0,
    balanceRemaining: advancePaymentAmount,
    recoupmentSchedule: [],
  };
};

/**
 * Creates mobilization recoupment schedule.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} advanceAmount - Advance amount to recoup
 * @param {number} numberOfPayments - Number of payments for recoupment
 * @returns {Promise<any>} Recoupment schedule
 *
 * @example
 * ```typescript
 * const schedule = await createMobilizationRecoupmentSchedule('CONT-2024-001', 400000, 10);
 * ```
 */
export const createMobilizationRecoupmentSchedule = async (
  contractId: string,
  advanceAmount: number,
  numberOfPayments: number,
): Promise<any> => {
  if (numberOfPayments <= 0) {
    throw new BadRequestException('Number of payments must be positive');
  }

  const recoupmentPerPayment = advanceAmount / numberOfPayments;

  const schedule: RecoupmentSchedule[] = [];

  for (let i = 1; i <= numberOfPayments; i++) {
    schedule.push({
      paymentNumber: i,
      recoupmentAmount: recoupmentPerPayment,
      status: 'pending',
    });
  }

  return {
    contractId,
    advanceAmount,
    numberOfPayments,
    recoupmentPerPayment,
    schedule,
  };
};

/**
 * Processes mobilization recoupment from progress payment.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} paymentNumber - Payment application number
 * @param {number} recoupmentAmount - Amount to recoup
 * @returns {Promise<any>} Recoupment transaction
 *
 * @example
 * ```typescript
 * const recouped = await processMobilizationRecoupment('CONT-2024-001', 1, 40000);
 * ```
 */
export const processMobilizationRecoupment = async (
  contractId: string,
  paymentNumber: number,
  recoupmentAmount: number,
): Promise<any> => {
  return {
    contractId,
    paymentNumber,
    recoupmentAmount,
    recoupmentDate: new Date(),
    status: 'recouped',
  };
};

/**
 * Validates mobilization requirements compliance.
 *
 * @param {string} contractId - Contract identifier
 * @param {boolean} equipmentDelivered - Equipment delivery status
 * @param {boolean} siteEstablished - Site establishment status
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateMobilizationRequirements('CONT-2024-001', true, false);
 * ```
 */
export const validateMobilizationRequirements = async (
  contractId: string,
  equipmentDelivered: boolean,
  siteEstablished: boolean,
): Promise<{ compliant: boolean; issues: string[] }> => {
  const issues: string[] = [];

  if (!equipmentDelivered) {
    issues.push('Required equipment not delivered to site');
  }

  if (!siteEstablished) {
    issues.push('Site mobilization not complete');
  }

  return {
    compliant: issues.length === 0,
    issues,
  };
};

/**
 * Processes stored materials billing payment.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} materialDescription - Material description
 * @param {number} quantity - Quantity stored
 * @param {number} unitPrice - Unit price
 * @param {string} storageLocation - Storage location
 * @param {boolean} inspectionCompleted - Inspection completion status
 * @returns {Promise<any>} Stored materials payment
 *
 * @example
 * ```typescript
 * const materials = await processStoredMaterialsBillingPayment(
 *   'CONT-2024-001',
 *   'Structural steel beams',
 *   100,
 *   500,
 *   'On-site warehouse',
 *   true
 * );
 * ```
 */
export const processStoredMaterialsBillingPayment = async (
  contractId: string,
  materialDescription: string,
  quantity: number,
  unitPrice: number,
  storageLocation: string,
  inspectionCompleted: boolean,
): Promise<any> => {
  if (!inspectionCompleted) {
    throw new BadRequestException('Stored materials must be inspected before billing');
  }

  const totalValue = quantity * unitPrice;

  return {
    materialId: `MAT-${contractId}-${Date.now()}`,
    contractId,
    materialDescription,
    quantity,
    unitPrice,
    totalValue,
    storageLocation,
    inspectionCompleted,
    approvedForPayment: true,
    billingDate: new Date(),
  };
};

/**
 * Calculates early completion incentive payment.
 *
 * @param {string} contractId - Contract identifier
 * @param {Date} plannedCompletionDate - Planned completion date
 * @param {Date} actualCompletionDate - Actual completion date
 * @param {number} incentiveRate - Daily incentive rate
 * @returns {Promise<any>} Incentive calculation
 *
 * @example
 * ```typescript
 * const incentive = await calculateEarlyCompletionIncentive(
 *   'CONT-2024-001',
 *   new Date('2024-12-31'),
 *   new Date('2024-11-15'),
 *   5000
 * );
 * ```
 */
export const calculateEarlyCompletionIncentive = async (
  contractId: string,
  plannedCompletionDate: Date,
  actualCompletionDate: Date,
  incentiveRate: number,
): Promise<any> => {
  const daysEarly = Math.floor(
    (plannedCompletionDate.getTime() - actualCompletionDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysEarly <= 0) {
    return {
      contractId,
      daysEarly: 0,
      incentiveAmount: 0,
      eligible: false,
      reason: 'Not completed early',
    };
  }

  const incentiveAmount = daysEarly * incentiveRate;

  return {
    contractId,
    plannedCompletionDate,
    actualCompletionDate,
    daysEarly,
    incentiveRate,
    incentiveAmount,
    eligible: true,
  };
};

/**
 * Processes subcontractor payment flow-through.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} subcontractorId - Subcontractor identifier
 * @param {number} paymentAmount - Payment amount
 * @param {string} workDescription - Work description
 * @returns {Promise<any>} Subcontractor payment
 *
 * @example
 * ```typescript
 * const subPayment = await processSubcontractorPaymentFlowThrough(
 *   'CONT-2024-001',
 *   'SUB-001',
 *   50000,
 *   'Electrical work - Phase 1'
 * );
 * ```
 */
export const processSubcontractorPaymentFlowThrough = async (
  contractId: string,
  subcontractorId: string,
  paymentAmount: number,
  workDescription: string,
): Promise<any> => {
  return {
    subPaymentId: `SUB-PAY-${contractId}-${subcontractorId}-${Date.now()}`,
    primeContractId: contractId,
    subcontractorId,
    paymentAmount,
    workDescription,
    paymentDate: new Date(),
    status: 'approved',
  };
};

/**
 * Validates payment against contract funding limits.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} paymentAmount - Requested payment amount
 * @param {number} availableFunding - Available contract funding
 * @param {number} totalPaidToDate - Total paid to date
 * @returns {Promise<{ approved: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePaymentAgainstFundingLimits('CONT-2024-001', 100000, 5000000, 2000000);
 * ```
 */
export const validatePaymentAgainstFundingLimits = async (
  contractId: string,
  paymentAmount: number,
  availableFunding: number,
  totalPaidToDate: number,
): Promise<{ approved: boolean; issues: string[] }> => {
  const issues: string[] = [];

  const projectedTotal = totalPaidToDate + paymentAmount;

  if (projectedTotal > availableFunding) {
    issues.push(
      `Payment would exceed available funding ($${projectedTotal} > $${availableFunding})`,
    );
  }

  const remainingFunding = availableFunding - projectedTotal;
  if (remainingFunding < availableFunding * 0.1) {
    issues.push('Less than 10% funding remaining after this payment');
  }

  return {
    approved: issues.length === 0,
    issues,
  };
};

/**
 * Generates payment voucher for disbursement.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} payApplicationId - Pay application identifier
 * @param {number} grossAmount - Gross payment amount
 * @param {number} retainageAmount - Retainage amount
 * @param {number} netAmount - Net payment amount
 * @returns {Promise<any>} Payment voucher
 *
 * @example
 * ```typescript
 * const voucher = await generatePaymentVoucher('CONT-2024-001', 'PA-001', 100000, 10000, 90000);
 * ```
 */
export const generatePaymentVoucher = async (
  contractId: string,
  payApplicationId: string,
  grossAmount: number,
  retainageAmount: number,
  netAmount: number,
): Promise<any> => {
  return {
    voucherId: `VOUCH-${contractId}-${Date.now()}`,
    contractId,
    payApplicationId,
    grossAmount,
    retainageAmount,
    netAmount,
    voucherDate: new Date(),
    status: 'ready_for_disbursement',
  };
};

/**
 * Tracks payment processing status through disbursement.
 *
 * @param {string} voucherId - Voucher identifier
 * @param {'pending' | 'approved' | 'disbursed' | 'cancelled'} status - Payment status
 * @param {Date} [disbursementDate] - Disbursement date
 * @returns {Promise<any>} Status update
 *
 * @example
 * ```typescript
 * const status = await trackPaymentDisbursementStatus('VOUCH-001', 'disbursed', new Date());
 * ```
 */
export const trackPaymentDisbursementStatus = async (
  voucherId: string,
  status: 'pending' | 'approved' | 'disbursed' | 'cancelled',
  disbursementDate?: Date,
): Promise<any> => {
  return {
    voucherId,
    status,
    disbursementDate,
    updatedAt: new Date(),
  };
};

// ============================================================================
// PROGRESS MEASUREMENT & QUALITY (Functions 41-50)
// ============================================================================

/**
 * Defines progress measurement criteria for cost code.
 *
 * @param {string} costCode - Cost code
 * @param {string} measurementMethod - Measurement method
 * @param {string} measurementFrequency - Measurement frequency
 * @param {string[]} acceptanceCriteria - Acceptance criteria
 * @param {any} qualityThresholds - Quality thresholds
 * @returns {Promise<ProgressMeasurementCriteria>} Measurement criteria
 *
 * @example
 * ```typescript
 * const criteria = await defineProgressMeasurementCriteria(
 *   '01-100',
 *   'physical',
 *   'weekly',
 *   ['Visual inspection', 'Quantity verification'],
 *   { minimum: 90, target: 95, maximum: 100 }
 * );
 * ```
 */
export const defineProgressMeasurementCriteria = async (
  costCode: string,
  measurementMethod: 'physical' | 'cost' | 'milestone' | 'time_based',
  measurementFrequency: 'daily' | 'weekly' | 'monthly',
  acceptanceCriteria: string[],
  qualityThresholds: any,
): Promise<ProgressMeasurementCriteria> => {
  return {
    criteriaId: `PMC-${costCode}`,
    costCode,
    measurementMethod,
    measurementFrequency,
    acceptanceCriteria,
    qualityThresholds,
    documentationRequired: ['Progress photos', 'Quantity logs', 'Quality reports'],
  };
};

/**
 * Validates progress measurement against quality standards.
 *
 * @param {string} costCode - Cost code
 * @param {number} measuredProgress - Measured progress percentage
 * @param {number} qualityScore - Quality score
 * @param {ProgressMeasurementCriteria} criteria - Measurement criteria
 * @returns {Promise<{ accepted: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateProgressMeasurementQuality('01-100', 50, 92, criteria);
 * ```
 */
export const validateProgressMeasurementQuality = async (
  costCode: string,
  measuredProgress: number,
  qualityScore: number,
  criteria: ProgressMeasurementCriteria,
): Promise<{ accepted: boolean; issues: string[] }> => {
  const issues: string[] = [];

  if (qualityScore < criteria.qualityThresholds.minimum) {
    issues.push(
      `Quality score ${qualityScore} below minimum ${criteria.qualityThresholds.minimum}`,
    );
  }

  if (measuredProgress > 100) {
    issues.push('Progress cannot exceed 100%');
  }

  return {
    accepted: issues.length === 0,
    issues,
  };
};

/**
 * Documents progress measurement evidence.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} costCode - Cost code
 * @param {number} percentComplete - Percentage complete
 * @param {string[]} documentation - Documentation files
 * @param {string} measuredBy - User performing measurement
 * @returns {Promise<any>} Documented measurement
 *
 * @example
 * ```typescript
 * const documented = await documentProgressMeasurementEvidence(
 *   'CONT-2024-001',
 *   '01-100',
 *   50,
 *   ['photo1.jpg', 'quantity-log.pdf'],
 *   'user123'
 * );
 * ```
 */
export const documentProgressMeasurementEvidence = async (
  contractId: string,
  costCode: string,
  percentComplete: number,
  documentation: string[],
  measuredBy: string,
): Promise<any> => {
  return {
    documentId: `PME-${contractId}-${costCode}-${Date.now()}`,
    contractId,
    costCode,
    percentComplete,
    documentation,
    measuredBy,
    measurementDate: new Date(),
  };
};

/**
 * Reconciles progress measurements across multiple sources.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} costCode - Cost code
 * @param {any[]} measurements - Array of measurements from different sources
 * @returns {Promise<any>} Reconciled measurement
 *
 * @example
 * ```typescript
 * const reconciled = await reconcileProgressMeasurements('CONT-2024-001', '01-100', measurements);
 * console.log('Reconciled percentage:', reconciled.reconciledPercent);
 * ```
 */
export const reconcileProgressMeasurements = async (
  contractId: string,
  costCode: string,
  measurements: any[],
): Promise<any> => {
  if (measurements.length === 0) {
    return {
      contractId,
      costCode,
      reconciledPercent: 0,
      measurements: [],
    };
  }

  // Calculate average and identify outliers
  const percentages = measurements.map((m) => m.percentComplete);
  const average = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;

  const outliers = measurements.filter((m) => Math.abs(m.percentComplete - average) > 10);

  return {
    contractId,
    costCode,
    measurements,
    reconciledPercent: average,
    outliers,
    confidence: outliers.length === 0 ? 'high' : 'medium',
  };
};

/**
 * Generates comprehensive progress payment summary.
 *
 * @param {string} contractId - Contract identifier
 * @param {Date} reportDate - Report date
 * @param {any} PercentCompleteModel - Percent complete model
 * @param {any} EarnedValueMetricsModel - Earned value model
 * @returns {Promise<any>} Progress summary
 *
 * @example
 * ```typescript
 * const summary = await generateProgressPaymentSummary(
 *   'CONT-2024-001',
 *   new Date(),
 *   PercentCompleteModel,
 *   EarnedValueMetricsModel
 * );
 * ```
 */
export const generateProgressPaymentSummary = async (
  contractId: string,
  reportDate: Date,
  PercentCompleteModel: any,
  EarnedValueMetricsModel: any,
): Promise<any> => {
  const latestProgress = await PercentCompleteModel.findOne({
    where: { contractId },
    order: [['calculationDate', 'DESC']],
  });

  const latestEVM = await EarnedValueMetricsModel.findOne({
    where: { contractId },
    order: [['asOfDate', 'DESC']],
  });

  return {
    contractId,
    reportDate,
    progressMetrics: latestProgress
      ? {
          percentComplete: parseFloat(latestProgress.percentComplete),
          earnedValue: parseFloat(latestProgress.earnedValue),
          method: latestProgress.method,
        }
      : null,
    earnedValueMetrics: latestEVM
      ? {
          cpi: parseFloat(latestEVM.costPerformanceIndex),
          spi: parseFloat(latestEVM.schedulePerformanceIndex),
          estimateAtCompletion: parseFloat(latestEVM.estimateAtCompletion),
        }
      : null,
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable service for Progress Payment Module.
 */
@Injectable()
export class ProgressPaymentModuleService {
  private readonly logger = new Logger(ProgressPaymentModuleService.name);

  constructor(private readonly sequelize: Sequelize) {}

  async calculatePercentComplete(
    contractId: string,
    costCode: string,
    method: string,
    data: any,
    calculatedBy: string,
  ) {
    const PercentCompleteModel = createPercentCompleteModel(this.sequelize);

    switch (method) {
      case 'units_complete':
        return calculatePercentCompleteByUnits(
          contractId,
          costCode,
          data.totalUnits,
          data.unitsComplete,
          data.unitPrice,
          calculatedBy,
          PercentCompleteModel,
        );
      case 'cost_to_cost':
        return calculatePercentCompleteByCost(
          contractId,
          costCode,
          data.budgetedCost,
          data.actualCost,
          data.estimatedCostToComplete,
          calculatedBy,
          PercentCompleteModel,
        );
      case 'labor_hours':
        return calculatePercentCompleteByLaborHours(
          contractId,
          costCode,
          data.budgetedHours,
          data.hoursWorked,
          data.estimatedHoursToComplete,
          data.budgetedValue,
          calculatedBy,
          PercentCompleteModel,
        );
      default:
        throw new BadRequestException(`Unsupported calculation method: ${method}`);
    }
  }

  async calculateEarnedValue(
    contractId: string,
    budgetAtCompletion: number,
    plannedValue: number,
    earnedValue: number,
    actualCost: number,
  ) {
    const EarnedValueMetricsModel = createEarnedValueMetricsModel(this.sequelize);

    return this.sequelize.transaction(async (transaction) => {
      return calculateEarnedValueMetrics(
        contractId,
        new Date(),
        budgetAtCompletion,
        plannedValue,
        earnedValue,
        actualCost,
        EarnedValueMetricsModel,
        transaction,
      );
    });
  }

  async generatePaymentForecast(contractId: string, forecastHorizon: number, totalValue: number) {
    const PayApplicationModel = createPayApplicationModel(this.sequelize);

    return generatePaymentForecast(contractId, forecastHorizon, totalValue, PayApplicationModel);
  }

  async getEarnedValueDashboard(contractId: string) {
    const EarnedValueMetricsModel = createEarnedValueMetricsModel(this.sequelize);

    return generateEarnedValueDashboard(contractId, EarnedValueMetricsModel);
  }
}

/**
 * Default export with all progress payment utilities.
 */
export default {
  // Models
  createPercentCompleteModel,
  createEarnedValueMetricsModel,
  createUnitsOfWorkModel,

  // Percentage Completion (1-10)
  calculatePercentCompleteByUnits,
  calculatePercentCompleteByCost,
  calculatePercentCompleteByLaborHours,
  calculateWeightedPercentComplete,
  updateUnitsOfWorkProgress,
  trackLaborHoursForProgress,
  calculateMilestonePercentComplete,
  validatePercentCompleteAgainstSchedule,
  generatePercentCompleteTrend,
  reconcilePercentCompleteMethod,

  // Earned Value Management (11-20)
  calculateEarnedValueMetrics,
  generateSCurveData,
  analyzeEarnedValueTrends,
  calculateEstimateAtCompletion,
  validateEarnedValueThresholds,
  generateEarnedValueDashboard,
  calculateEarnedValueVarianceAnalysis,
  forecastProjectCompletionDate,
  generateComprehensiveEarnedValueReport,
  compareEarnedValueAcrossContracts,

  // Payment Forecasting (21-30)
  generatePaymentForecast,
  createMilestonePaymentSchedule,
  generatePaymentApplicationSchedule,
  updateMilestonePaymentStatus,
  validatePaymentForecastAgainstBudget,
  adjustPaymentForecastByPerformance,
  generateCashFlowProjection,
  compareForecastVsActualBilling,
  generatePaymentScheduleVarianceReport,

  // Mobilization & Specialty (31-40)
  processMobilizationPaymentAdvance,
  createMobilizationRecoupmentSchedule,
  processMobilizationRecoupment,
  validateMobilizationRequirements,
  processStoredMaterialsBillingPayment,
  calculateEarlyCompletionIncentive,
  processSubcontractorPaymentFlowThrough,
  validatePaymentAgainstFundingLimits,
  generatePaymentVoucher,
  trackPaymentDisbursementStatus,

  // Progress Measurement (41-50)
  defineProgressMeasurementCriteria,
  validateProgressMeasurementQuality,
  documentProgressMeasurementEvidence,
  reconcileProgressMeasurements,
  generateProgressPaymentSummary,

  // Service
  ProgressPaymentModuleService,
};
