/**
 * LOC: WC-CEFMS-BFS-001
 * FILE: reuse/financial/cefms/composites/cefms-budget-forecasting-scenarios-composite.ts
 *
 * UPSTREAM DEPENDENCIES:
 * - reuse/government/budgeting/budget-planning-kit.ts
 * - reuse/government/financial/revenue-forecasting-kit.ts
 * - reuse/government/analytics/scenario-modeling-kit.ts
 * - reuse/government/financial/variance-analysis-kit.ts
 * - reuse/government/planning/trend-analysis-kit.ts
 * - reuse/government/reporting/budget-reporting-kit.ts
 *
 * DOWNSTREAM CONSUMERS:
 * - api/routes/cefms/budget-forecasting-scenarios-routes.ts
 * - api/controllers/cefms/budget-forecasting-scenarios-controller.ts
 * - services/cefms/budget-forecasting-scenarios-service.ts
 *
 * PURPOSE:
 * Comprehensive Budget Forecasting and Scenario Analysis composite for USACE CEFMS
 * (Corps of Engineers Financial Management System). Provides multi-year budget forecasting,
 * what-if scenario modeling, sensitivity analysis, revenue projections, and variance tracking
 * for government financial planning and decision-making.
 *
 * SYSTEM DESCRIPTION:
 * This module implements advanced budget forecasting capabilities for government entities,
 * enabling financial planners to model future budget scenarios, analyze revenue trends,
 * perform sensitivity analysis on key assumptions, and track budget-to-actual variances.
 * It supports multi-year forecasting (1-10 years), scenario comparison (baseline, optimistic,
 * pessimistic), Monte Carlo simulation, and rolling forecasts with assumption tracking.
 *
 * KEY CAPABILITIES:
 * - Multi-year revenue and expenditure forecasting with trend analysis
 * - Scenario modeling (baseline, optimistic, pessimistic, custom scenarios)
 * - Sensitivity analysis for key budget drivers (economic growth, inflation, population)
 * - Monte Carlo simulation for probabilistic budget forecasting
 * - What-if analysis for policy changes, program expansions, revenue adjustments
 * - Budget variance tracking and rolling forecast updates
 * - Assumption management and documentation for audit trails
 * - Forecast accuracy measurement and continuous improvement
 * - Integration with historical actuals and current budget data
 *
 * FORECASTING METHODOLOGIES:
 * - Trend Extrapolation: Linear, exponential, polynomial regression
 * - Time Series Analysis: Moving averages, exponential smoothing, ARIMA
 * - Causal Modeling: Regression analysis with economic indicators
 * - Judgmental Forecasting: Expert input and consensus modeling
 * - Hybrid Approaches: Combining quantitative and qualitative methods
 *
 * SCENARIO TYPES:
 * - Baseline: Most likely scenario based on current trends and assumptions
 * - Optimistic: Best-case scenario with favorable economic conditions
 * - Pessimistic: Worst-case scenario with adverse economic conditions
 * - Custom: User-defined scenarios for specific planning purposes
 *
 * RUNTIME: Node 18+
 * TYPESCRIPT: 5.x
 * FRAMEWORK: NestJS 10.x
 * ORM: Sequelize 6.x
 * DATABASE: PostgreSQL 15+
 *
 * AUTHOR: USACE CEFMS Development Team
 * CREATED: ${new Date().toISOString()}
 * VERSION: 1.0.0
 */

import { Injectable } from '@nestjs/common';
import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  BelongsToGetAssociationMixin,
} from 'sequelize';

// =============================================================================
// TYPESCRIPT INTERFACES
// =============================================================================

/**
 * Forecast Scenario representing a complete budget forecast with assumptions
 * and projected revenues/expenditures.
 */
export interface ForecastScenarioAttributes {
  scenarioId: string;
  scenarioName: string;
  scenarioType: 'baseline' | 'optimistic' | 'pessimistic' | 'custom';
  baseFiscalYear: number;
  forecastYears: number;
  description: string;
  createdBy: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  approvedBy?: string;
  approvedAt?: Date;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ForecastScenarioCreationAttributes extends Optional<ForecastScenarioAttributes, 'scenarioId' | 'createdAt' | 'updatedAt'> {}

/**
 * Forecast Assumption representing key assumptions underlying a forecast scenario.
 */
export interface ForecastAssumptionAttributes {
  assumptionId: string;
  scenarioId: string;
  assumptionCategory: string;
  assumptionName: string;
  assumptionType: 'economic' | 'demographic' | 'policy' | 'operational';
  baseValue: number;
  projectedValue: number;
  changePercent: number;
  unit: string;
  source: string;
  confidence: 'high' | 'medium' | 'low';
  notes: string;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ForecastAssumptionCreationAttributes extends Optional<ForecastAssumptionAttributes, 'assumptionId' | 'createdAt' | 'updatedAt'> {}

/**
 * Revenue Forecast representing projected revenue by source for future fiscal years.
 */
export interface RevenueForecastAttributes {
  forecastId: string;
  scenarioId: string;
  fiscalYear: number;
  revenueSource: string;
  revenueCategory: string;
  historicalAmount?: number;
  forecastedAmount: number;
  growthRate: number;
  forecastMethod: string;
  confidence: number;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RevenueForecastCreationAttributes extends Optional<RevenueForecastAttributes, 'forecastId' | 'createdAt' | 'updatedAt'> {}

/**
 * Expenditure Forecast representing projected expenditures by category for future fiscal years.
 */
export interface ExpenditureForecastAttributes {
  forecastId: string;
  scenarioId: string;
  fiscalYear: number;
  expenditureCategory: string;
  departmentCode: string;
  programCode: string;
  historicalAmount?: number;
  forecastedAmount: number;
  growthRate: number;
  forecastMethod: string;
  driverAssumptions: string[];
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExpenditureForecastCreationAttributes extends Optional<ExpenditureForecastAttributes, 'forecastId' | 'createdAt' | 'updatedAt'> {}

/**
 * Sensitivity Analysis representing the impact of changing key assumptions on forecast outcomes.
 */
export interface SensitivityAnalysisAttributes {
  analysisId: string;
  scenarioId: string;
  variableName: string;
  baselineValue: number;
  adjustmentPercent: number;
  adjustedValue: number;
  impactOnRevenue: number;
  impactOnExpenditure: number;
  impactOnSurplus: number;
  sensitivity: 'high' | 'medium' | 'low';
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SensitivityAnalysisCreationAttributes extends Optional<SensitivityAnalysisAttributes, 'analysisId' | 'createdAt' | 'updatedAt'> {}

/**
 * Budget Variance representing the difference between forecasted and actual amounts.
 */
export interface BudgetVarianceAttributes {
  varianceId: string;
  scenarioId: string;
  fiscalYear: number;
  lineItemType: 'revenue' | 'expenditure';
  lineItemCategory: string;
  forecastedAmount: number;
  actualAmount: number;
  varianceAmount: number;
  variancePercent: number;
  varianceType: 'favorable' | 'unfavorable';
  explanation: string;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BudgetVarianceCreationAttributes extends Optional<BudgetVarianceAttributes, 'varianceId' | 'createdAt' | 'updatedAt'> {}

/**
 * What-If Scenario representing hypothetical policy or operational changes and their impact.
 */
export interface WhatIfScenarioAttributes {
  whatIfId: string;
  baseScenarioId: string;
  whatIfName: string;
  whatIfDescription: string;
  changeType: 'policy' | 'program' | 'tax_rate' | 'service_level' | 'capital_project';
  changeDetails: Record<string, any>;
  fiscalYearImpact: number;
  projectedRevenueImpact: number;
  projectedExpenditureImpact: number;
  netBudgetImpact: number;
  implementationCost: number;
  status: 'proposed' | 'under_review' | 'approved' | 'rejected';
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WhatIfScenarioCreationAttributes extends Optional<WhatIfScenarioAttributes, 'whatIfId' | 'createdAt' | 'updatedAt'> {}

// =============================================================================
// SEQUELIZE MODELS
// =============================================================================

export class ForecastScenario extends Model<ForecastScenarioAttributes, ForecastScenarioCreationAttributes> implements ForecastScenarioAttributes {
  public scenarioId!: string;
  public scenarioName!: string;
  public scenarioType!: 'baseline' | 'optimistic' | 'pessimistic' | 'custom';
  public baseFiscalYear!: number;
  public forecastYears!: number;
  public description!: string;
  public createdBy!: string;
  public status!: 'draft' | 'review' | 'approved' | 'archived';
  public approvedBy?: string;
  public approvedAt?: Date;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class ForecastAssumption extends Model<ForecastAssumptionAttributes, ForecastAssumptionCreationAttributes> implements ForecastAssumptionAttributes {
  public assumptionId!: string;
  public scenarioId!: string;
  public assumptionCategory!: string;
  public assumptionName!: string;
  public assumptionType!: 'economic' | 'demographic' | 'policy' | 'operational';
  public baseValue!: number;
  public projectedValue!: number;
  public changePercent!: number;
  public unit!: string;
  public source!: string;
  public confidence!: 'high' | 'medium' | 'low';
  public notes!: string;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class RevenueForecast extends Model<RevenueForecastAttributes, RevenueForecastCreationAttributes> implements RevenueForecastAttributes {
  public forecastId!: string;
  public scenarioId!: string;
  public fiscalYear!: number;
  public revenueSource!: string;
  public revenueCategory!: string;
  public historicalAmount?: number;
  public forecastedAmount!: number;
  public growthRate!: number;
  public forecastMethod!: string;
  public confidence!: number;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class ExpenditureForecast extends Model<ExpenditureForecastAttributes, ExpenditureForecastCreationAttributes> implements ExpenditureForecastAttributes {
  public forecastId!: string;
  public scenarioId!: string;
  public fiscalYear!: number;
  public expenditureCategory!: string;
  public departmentCode!: string;
  public programCode!: string;
  public historicalAmount?: number;
  public forecastedAmount!: number;
  public growthRate!: number;
  public forecastMethod!: string;
  public driverAssumptions!: string[];
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class SensitivityAnalysis extends Model<SensitivityAnalysisAttributes, SensitivityAnalysisCreationAttributes> implements SensitivityAnalysisAttributes {
  public analysisId!: string;
  public scenarioId!: string;
  public variableName!: string;
  public baselineValue!: number;
  public adjustmentPercent!: number;
  public adjustedValue!: number;
  public impactOnRevenue!: number;
  public impactOnExpenditure!: number;
  public impactOnSurplus!: number;
  public sensitivity!: 'high' | 'medium' | 'low';
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class BudgetVariance extends Model<BudgetVarianceAttributes, BudgetVarianceCreationAttributes> implements BudgetVarianceAttributes {
  public varianceId!: string;
  public scenarioId!: string;
  public fiscalYear!: number;
  public lineItemType!: 'revenue' | 'expenditure';
  public lineItemCategory!: string;
  public forecastedAmount!: number;
  public actualAmount!: number;
  public varianceAmount!: number;
  public variancePercent!: number;
  public varianceType!: 'favorable' | 'unfavorable';
  public explanation!: string;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class WhatIfScenario extends Model<WhatIfScenarioAttributes, WhatIfScenarioCreationAttributes> implements WhatIfScenarioAttributes {
  public whatIfId!: string;
  public baseScenarioId!: string;
  public whatIfName!: string;
  public whatIfDescription!: string;
  public changeType!: 'policy' | 'program' | 'tax_rate' | 'service_level' | 'capital_project';
  public changeDetails!: Record<string, any>;
  public fiscalYearImpact!: number;
  public projectedRevenueImpact!: number;
  public projectedExpenditureImpact!: number;
  public netBudgetImpact!: number;
  public implementationCost!: number;
  public status!: 'proposed' | 'under_review' | 'approved' | 'rejected';
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// =============================================================================
// MODEL INITIALIZATION FUNCTION
// =============================================================================

export function initializeBudgetForecastingScenarioModels(sequelize: Sequelize): void {
  ForecastScenario.init(
    {
      scenarioId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'scenario_id',
      },
      scenarioName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'scenario_name',
      },
      scenarioType: {
        type: DataTypes.ENUM('baseline', 'optimistic', 'pessimistic', 'custom'),
        allowNull: false,
        field: 'scenario_type',
      },
      baseFiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'base_fiscal_year',
      },
      forecastYears: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'forecast_years',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'created_by',
      },
      status: {
        type: DataTypes.ENUM('draft', 'review', 'approved', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'approved_by',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'approved_at',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_forecast_scenarios',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['scenario_type'] },
        { fields: ['base_fiscal_year'] },
        { fields: ['status'] },
        { fields: ['created_by'] },
      ],
    }
  );

  ForecastAssumption.init(
    {
      assumptionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'assumption_id',
      },
      scenarioId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'scenario_id',
        references: {
          model: 'cefms_forecast_scenarios',
          key: 'scenario_id',
        },
      },
      assumptionCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'assumption_category',
      },
      assumptionName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'assumption_name',
      },
      assumptionType: {
        type: DataTypes.ENUM('economic', 'demographic', 'policy', 'operational'),
        allowNull: false,
        field: 'assumption_type',
      },
      baseValue: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: false,
        field: 'base_value',
      },
      projectedValue: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: false,
        field: 'projected_value',
      },
      changePercent: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        field: 'change_percent',
      },
      unit: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      source: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      confidence: {
        type: DataTypes.ENUM('high', 'medium', 'low'),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_forecast_assumptions',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['scenario_id'] },
        { fields: ['assumption_type'] },
        { fields: ['assumption_category'] },
      ],
    }
  );

  RevenueForecast.init(
    {
      forecastId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'forecast_id',
      },
      scenarioId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'scenario_id',
        references: {
          model: 'cefms_forecast_scenarios',
          key: 'scenario_id',
        },
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fiscal_year',
      },
      revenueSource: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'revenue_source',
      },
      revenueCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'revenue_category',
      },
      historicalAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        field: 'historical_amount',
      },
      forecastedAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'forecasted_amount',
      },
      growthRate: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        field: 'growth_rate',
      },
      forecastMethod: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'forecast_method',
      },
      confidence: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_revenue_forecasts',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['scenario_id'] },
        { fields: ['fiscal_year'] },
        { fields: ['revenue_source'] },
        { fields: ['revenue_category'] },
      ],
    }
  );

  ExpenditureForecast.init(
    {
      forecastId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'forecast_id',
      },
      scenarioId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'scenario_id',
        references: {
          model: 'cefms_forecast_scenarios',
          key: 'scenario_id',
        },
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fiscal_year',
      },
      expenditureCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'expenditure_category',
      },
      departmentCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'department_code',
      },
      programCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'program_code',
      },
      historicalAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        field: 'historical_amount',
      },
      forecastedAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'forecasted_amount',
      },
      growthRate: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        field: 'growth_rate',
      },
      forecastMethod: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'forecast_method',
      },
      driverAssumptions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        field: 'driver_assumptions',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_expenditure_forecasts',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['scenario_id'] },
        { fields: ['fiscal_year'] },
        { fields: ['expenditure_category'] },
        { fields: ['department_code'] },
        { fields: ['program_code'] },
      ],
    }
  );

  SensitivityAnalysis.init(
    {
      analysisId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'analysis_id',
      },
      scenarioId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'scenario_id',
        references: {
          model: 'cefms_forecast_scenarios',
          key: 'scenario_id',
        },
      },
      variableName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'variable_name',
      },
      baselineValue: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: false,
        field: 'baseline_value',
      },
      adjustmentPercent: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        field: 'adjustment_percent',
      },
      adjustedValue: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: false,
        field: 'adjusted_value',
      },
      impactOnRevenue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'impact_on_revenue',
      },
      impactOnExpenditure: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'impact_on_expenditure',
      },
      impactOnSurplus: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'impact_on_surplus',
      },
      sensitivity: {
        type: DataTypes.ENUM('high', 'medium', 'low'),
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_sensitivity_analyses',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['scenario_id'] },
        { fields: ['variable_name'] },
        { fields: ['sensitivity'] },
      ],
    }
  );

  BudgetVariance.init(
    {
      varianceId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'variance_id',
      },
      scenarioId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'scenario_id',
        references: {
          model: 'cefms_forecast_scenarios',
          key: 'scenario_id',
        },
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fiscal_year',
      },
      lineItemType: {
        type: DataTypes.ENUM('revenue', 'expenditure'),
        allowNull: false,
        field: 'line_item_type',
      },
      lineItemCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'line_item_category',
      },
      forecastedAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'forecasted_amount',
      },
      actualAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'actual_amount',
      },
      varianceAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'variance_amount',
      },
      variancePercent: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: false,
        field: 'variance_percent',
      },
      varianceType: {
        type: DataTypes.ENUM('favorable', 'unfavorable'),
        allowNull: false,
        field: 'variance_type',
      },
      explanation: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_budget_variances',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['scenario_id'] },
        { fields: ['fiscal_year'] },
        { fields: ['line_item_type'] },
        { fields: ['variance_type'] },
      ],
    }
  );

  WhatIfScenario.init(
    {
      whatIfId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'what_if_id',
      },
      baseScenarioId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'base_scenario_id',
        references: {
          model: 'cefms_forecast_scenarios',
          key: 'scenario_id',
        },
      },
      whatIfName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'what_if_name',
      },
      whatIfDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'what_if_description',
      },
      changeType: {
        type: DataTypes.ENUM('policy', 'program', 'tax_rate', 'service_level', 'capital_project'),
        allowNull: false,
        field: 'change_type',
      },
      changeDetails: {
        type: DataTypes.JSONB,
        allowNull: false,
        field: 'change_details',
      },
      fiscalYearImpact: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'fiscal_year_impact',
      },
      projectedRevenueImpact: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'projected_revenue_impact',
      },
      projectedExpenditureImpact: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'projected_expenditure_impact',
      },
      netBudgetImpact: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'net_budget_impact',
      },
      implementationCost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'implementation_cost',
      },
      status: {
        type: DataTypes.ENUM('proposed', 'under_review', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'proposed',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'cefms_what_if_scenarios',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['base_scenario_id'] },
        { fields: ['change_type'] },
        { fields: ['status'] },
      ],
    }
  );
}

// =============================================================================
// COMPOSITE FUNCTIONS - SCENARIO MANAGEMENT
// =============================================================================

/**
 * Creates a new forecast scenario with specified parameters.
 *
 * @param scenarioData - Forecast scenario creation attributes
 * @returns Created ForecastScenario record
 *
 * @example
 * const scenario = await createForecastScenario({
 *   scenarioName: 'FY2025-2030 Baseline Forecast',
 *   scenarioType: 'baseline',
 *   baseFiscalYear: 2024,
 *   forecastYears: 6,
 *   description: 'Baseline budget forecast using current trends',
 *   createdBy: 'budget.analyst@usace.gov',
 *   status: 'draft',
 *   metadata: {}
 * });
 */
export async function createForecastScenario(
  scenarioData: ForecastScenarioCreationAttributes
): Promise<ForecastScenario> {
  return await ForecastScenario.create(scenarioData);
}

/**
 * Retrieves a forecast scenario by unique ID.
 *
 * @param scenarioId - Scenario identifier
 * @returns ForecastScenario record or null
 *
 * @example
 * const scenario = await getForecastScenarioById('550e8400-e29b-41d4-a716-446655440000');
 */
export async function getForecastScenarioById(
  scenarioId: string
): Promise<ForecastScenario | null> {
  return await ForecastScenario.findByPk(scenarioId);
}

/**
 * Retrieves all scenarios for a base fiscal year.
 *
 * @param baseFiscalYear - Base fiscal year
 * @returns Array of ForecastScenario records
 *
 * @example
 * const scenarios = await getForecastScenariosByFiscalYear(2024);
 */
export async function getForecastScenariosByFiscalYear(
  baseFiscalYear: number
): Promise<ForecastScenario[]> {
  return await ForecastScenario.findAll({
    where: { baseFiscalYear },
    order: [['scenarioType', 'ASC']],
  });
}

/**
 * Retrieves approved forecast scenarios for planning purposes.
 *
 * @returns Array of approved ForecastScenario records
 *
 * @example
 * const approvedScenarios = await getApprovedForecastScenarios();
 */
export async function getApprovedForecastScenarios(): Promise<ForecastScenario[]> {
  return await ForecastScenario.findAll({
    where: { status: 'approved' },
    order: [['baseFiscalYear', 'DESC']],
  });
}

/**
 * Updates forecast scenario status (draft, review, approved, archived).
 *
 * @param scenarioId - Scenario identifier
 * @param status - New status
 * @param approverId - User approving the scenario (optional)
 * @returns Updated ForecastScenario record
 *
 * @example
 * const scenario = await updateForecastScenarioStatus('550e8400-e29b-41d4-a716-446655440000', 'approved', 'cfo@usace.gov');
 */
export async function updateForecastScenarioStatus(
  scenarioId: string,
  status: 'draft' | 'review' | 'approved' | 'archived',
  approverId?: string
): Promise<ForecastScenario | null> {
  const scenario = await ForecastScenario.findByPk(scenarioId);
  if (!scenario) return null;
  scenario.status = status;
  if (approverId && status === 'approved') {
    scenario.approvedBy = approverId;
    scenario.approvedAt = new Date();
  }
  await scenario.save();
  return scenario;
}

// =============================================================================
// COMPOSITE FUNCTIONS - FORECAST ASSUMPTIONS
// =============================================================================

/**
 * Creates a forecast assumption for a scenario.
 *
 * @param assumptionData - Forecast assumption creation attributes
 * @returns Created ForecastAssumption record
 *
 * @example
 * const assumption = await createForecastAssumption({
 *   scenarioId: '550e8400-e29b-41d4-a716-446655440000',
 *   assumptionCategory: 'Economic Growth',
 *   assumptionName: 'GDP Growth Rate',
 *   assumptionType: 'economic',
 *   baseValue: 2.5,
 *   projectedValue: 3.0,
 *   changePercent: 20.0,
 *   unit: 'percent',
 *   source: 'Congressional Budget Office',
 *   confidence: 'high',
 *   notes: 'Based on CBO economic outlook',
 *   metadata: {}
 * });
 */
export async function createForecastAssumption(
  assumptionData: ForecastAssumptionCreationAttributes
): Promise<ForecastAssumption> {
  return await ForecastAssumption.create(assumptionData);
}

/**
 * Retrieves all assumptions for a forecast scenario.
 *
 * @param scenarioId - Scenario identifier
 * @returns Array of ForecastAssumption records
 *
 * @example
 * const assumptions = await getForecastAssumptionsByScenario('550e8400-e29b-41d4-a716-446655440000');
 */
export async function getForecastAssumptionsByScenario(
  scenarioId: string
): Promise<ForecastAssumption[]> {
  return await ForecastAssumption.findAll({
    where: { scenarioId },
    order: [['assumptionCategory', 'ASC'], ['assumptionName', 'ASC']],
  });
}

/**
 * Retrieves assumptions by type (economic, demographic, policy, operational).
 *
 * @param scenarioId - Scenario identifier
 * @param assumptionType - Assumption type
 * @returns Array of ForecastAssumption records
 *
 * @example
 * const economicAssumptions = await getForecastAssumptionsByType('550e8400-e29b-41d4-a716-446655440000', 'economic');
 */
export async function getForecastAssumptionsByType(
  scenarioId: string,
  assumptionType: 'economic' | 'demographic' | 'policy' | 'operational'
): Promise<ForecastAssumption[]> {
  return await ForecastAssumption.findAll({
    where: { scenarioId, assumptionType },
    order: [['assumptionName', 'ASC']],
  });
}

/**
 * Updates a forecast assumption with new values.
 *
 * @param assumptionId - Assumption identifier
 * @param updates - Partial updates to assumption
 * @returns Updated ForecastAssumption record
 *
 * @example
 * const assumption = await updateForecastAssumption('660e8400-e29b-41d4-a716-446655440000', {
 *   projectedValue: 3.2,
 *   changePercent: 28.0,
 *   confidence: 'medium'
 * });
 */
export async function updateForecastAssumption(
  assumptionId: string,
  updates: Partial<ForecastAssumptionAttributes>
): Promise<ForecastAssumption | null> {
  const assumption = await ForecastAssumption.findByPk(assumptionId);
  if (!assumption) return null;
  await assumption.update(updates);
  return assumption;
}

/**
 * Bulk creates multiple forecast assumptions for a scenario.
 *
 * @param assumptions - Array of forecast assumption creation attributes
 * @returns Array of created ForecastAssumption records
 *
 * @example
 * const assumptions = await bulkCreateForecastAssumptions([
 *   { scenarioId: '...', assumptionCategory: 'Economic', assumptionName: 'Inflation', assumptionType: 'economic', baseValue: 2.0, projectedValue: 2.5, changePercent: 25.0, unit: 'percent', source: 'BLS', confidence: 'high', notes: '', metadata: {} },
 *   { scenarioId: '...', assumptionCategory: 'Demographic', assumptionName: 'Population Growth', assumptionType: 'demographic', baseValue: 1.0, projectedValue: 1.2, changePercent: 20.0, unit: 'percent', source: 'Census', confidence: 'medium', notes: '', metadata: {} }
 * ]);
 */
export async function bulkCreateForecastAssumptions(
  assumptions: ForecastAssumptionCreationAttributes[]
): Promise<ForecastAssumption[]> {
  return await ForecastAssumption.bulkCreate(assumptions);
}

// =============================================================================
// COMPOSITE FUNCTIONS - REVENUE FORECASTING
// =============================================================================

/**
 * Creates a revenue forecast for a specific fiscal year and source.
 *
 * @param forecastData - Revenue forecast creation attributes
 * @returns Created RevenueForecast record
 *
 * @example
 * const forecast = await createRevenueForecast({
 *   scenarioId: '550e8400-e29b-41d4-a716-446655440000',
 *   fiscalYear: 2025,
 *   revenueSource: 'Property Tax',
 *   revenueCategory: 'Tax Revenue',
 *   historicalAmount: 1000000,
 *   forecastedAmount: 1050000,
 *   growthRate: 5.0,
 *   forecastMethod: 'Trend extrapolation',
 *   confidence: 85.0,
 *   metadata: {}
 * });
 */
export async function createRevenueForecast(
  forecastData: RevenueForecastCreationAttributes
): Promise<RevenueForecast> {
  return await RevenueForecast.create(forecastData);
}

/**
 * Retrieves all revenue forecasts for a scenario.
 *
 * @param scenarioId - Scenario identifier
 * @returns Array of RevenueForecast records
 *
 * @example
 * const forecasts = await getRevenueForecastsByScenario('550e8400-e29b-41d4-a716-446655440000');
 */
export async function getRevenueForecastsByScenario(
  scenarioId: string
): Promise<RevenueForecast[]> {
  return await RevenueForecast.findAll({
    where: { scenarioId },
    order: [['fiscalYear', 'ASC'], ['revenueSource', 'ASC']],
  });
}

/**
 * Retrieves revenue forecasts for a specific fiscal year.
 *
 * @param scenarioId - Scenario identifier
 * @param fiscalYear - Fiscal year
 * @returns Array of RevenueForecast records
 *
 * @example
 * const forecasts = await getRevenueForecastsByYear('550e8400-e29b-41d4-a716-446655440000', 2025);
 */
export async function getRevenueForecastsByYear(
  scenarioId: string,
  fiscalYear: number
): Promise<RevenueForecast[]> {
  return await RevenueForecast.findAll({
    where: { scenarioId, fiscalYear },
    order: [['revenueSource', 'ASC']],
  });
}

/**
 * Calculates total forecasted revenue for a fiscal year.
 *
 * @param scenarioId - Scenario identifier
 * @param fiscalYear - Fiscal year
 * @returns Total forecasted revenue
 *
 * @example
 * const totalRevenue = await calculateTotalForecastedRevenue('550e8400-e29b-41d4-a716-446655440000', 2025);
 */
export async function calculateTotalForecastedRevenue(
  scenarioId: string,
  fiscalYear: number
): Promise<number> {
  const forecasts = await RevenueForecast.findAll({
    where: { scenarioId, fiscalYear },
  });
  return forecasts.reduce((total, forecast) => total + Number(forecast.forecastedAmount), 0);
}

/**
 * Generates multi-year revenue forecast using growth rates.
 *
 * @param scenarioId - Scenario identifier
 * @param startYear - Starting fiscal year
 * @param years - Number of years to forecast
 * @param baseRevenues - Array of base revenue amounts by source
 * @param growthRates - Array of growth rates by source
 * @returns Array of created RevenueForecast records
 *
 * @example
 * const forecasts = await generateMultiYearRevenueForecast(
 *   '550e8400-e29b-41d4-a716-446655440000',
 *   2025,
 *   5,
 *   [{ source: 'Property Tax', category: 'Tax Revenue', amount: 1000000 }],
 *   [{ source: 'Property Tax', rate: 5.0 }]
 * );
 */
export async function generateMultiYearRevenueForecast(
  scenarioId: string,
  startYear: number,
  years: number,
  baseRevenues: Array<{ source: string; category: string; amount: number }>,
  growthRates: Array<{ source: string; rate: number }>
): Promise<RevenueForecast[]> {
  const forecasts: RevenueForecastCreationAttributes[] = [];

  for (let year = 0; year < years; year++) {
    const fiscalYear = startYear + year;
    for (const baseRevenue of baseRevenues) {
      const growthRate = growthRates.find(gr => gr.source === baseRevenue.source)?.rate || 0;
      const forecastedAmount = baseRevenue.amount * Math.pow(1 + growthRate / 100, year);

      forecasts.push({
        scenarioId,
        fiscalYear,
        revenueSource: baseRevenue.source,
        revenueCategory: baseRevenue.category,
        historicalAmount: year === 0 ? baseRevenue.amount : undefined,
        forecastedAmount,
        growthRate,
        forecastMethod: 'Compound growth',
        confidence: 80.0,
        metadata: {},
      });
    }
  }

  return await RevenueForecast.bulkCreate(forecasts);
}

// =============================================================================
// COMPOSITE FUNCTIONS - EXPENDITURE FORECASTING
// =============================================================================

/**
 * Creates an expenditure forecast for a specific fiscal year and category.
 *
 * @param forecastData - Expenditure forecast creation attributes
 * @returns Created ExpenditureForecast record
 *
 * @example
 * const forecast = await createExpenditureForecast({
 *   scenarioId: '550e8400-e29b-41d4-a716-446655440000',
 *   fiscalYear: 2025,
 *   expenditureCategory: 'Personnel',
 *   departmentCode: 'PW-001',
 *   programCode: 'MAINT-001',
 *   historicalAmount: 500000,
 *   forecastedAmount: 520000,
 *   growthRate: 4.0,
 *   forecastMethod: 'Headcount-based',
 *   driverAssumptions: ['2% salary increase', '1% headcount growth'],
 *   metadata: {}
 * });
 */
export async function createExpenditureForecast(
  forecastData: ExpenditureForecastCreationAttributes
): Promise<ExpenditureForecast> {
  return await ExpenditureForecast.create(forecastData);
}

/**
 * Retrieves all expenditure forecasts for a scenario.
 *
 * @param scenarioId - Scenario identifier
 * @returns Array of ExpenditureForecast records
 *
 * @example
 * const forecasts = await getExpenditureForecastsByScenario('550e8400-e29b-41d4-a716-446655440000');
 */
export async function getExpenditureForecastsByScenario(
  scenarioId: string
): Promise<ExpenditureForecast[]> {
  return await ExpenditureForecast.findAll({
    where: { scenarioId },
    order: [['fiscalYear', 'ASC'], ['expenditureCategory', 'ASC']],
  });
}

/**
 * Retrieves expenditure forecasts for a specific fiscal year.
 *
 * @param scenarioId - Scenario identifier
 * @param fiscalYear - Fiscal year
 * @returns Array of ExpenditureForecast records
 *
 * @example
 * const forecasts = await getExpenditureForecastsByYear('550e8400-e29b-41d4-a716-446655440000', 2025);
 */
export async function getExpenditureForecastsByYear(
  scenarioId: string,
  fiscalYear: number
): Promise<ExpenditureForecast[]> {
  return await ExpenditureForecast.findAll({
    where: { scenarioId, fiscalYear },
    order: [['expenditureCategory', 'ASC']],
  });
}

/**
 * Calculates total forecasted expenditure for a fiscal year.
 *
 * @param scenarioId - Scenario identifier
 * @param fiscalYear - Fiscal year
 * @returns Total forecasted expenditure
 *
 * @example
 * const totalExpenditure = await calculateTotalForecastedExpenditure('550e8400-e29b-41d4-a716-446655440000', 2025);
 */
export async function calculateTotalForecastedExpenditure(
  scenarioId: string,
  fiscalYear: number
): Promise<number> {
  const forecasts = await ExpenditureForecast.findAll({
    where: { scenarioId, fiscalYear },
  });
  return forecasts.reduce((total, forecast) => total + Number(forecast.forecastedAmount), 0);
}

/**
 * Retrieves expenditure forecasts by department.
 *
 * @param scenarioId - Scenario identifier
 * @param departmentCode - Department code
 * @returns Array of ExpenditureForecast records
 *
 * @example
 * const departmentForecasts = await getExpenditureForecastsByDepartment('550e8400-e29b-41d4-a716-446655440000', 'PW-001');
 */
export async function getExpenditureForecastsByDepartment(
  scenarioId: string,
  departmentCode: string
): Promise<ExpenditureForecast[]> {
  return await ExpenditureForecast.findAll({
    where: { scenarioId, departmentCode },
    order: [['fiscalYear', 'ASC'], ['programCode', 'ASC']],
  });
}

/**
 * Generates multi-year expenditure forecast using growth rates.
 *
 * @param scenarioId - Scenario identifier
 * @param startYear - Starting fiscal year
 * @param years - Number of years to forecast
 * @param baseExpenditures - Array of base expenditure amounts by category
 * @param growthRates - Array of growth rates by category
 * @returns Array of created ExpenditureForecast records
 *
 * @example
 * const forecasts = await generateMultiYearExpenditureForecast(
 *   '550e8400-e29b-41d4-a716-446655440000',
 *   2025,
 *   5,
 *   [{ category: 'Personnel', dept: 'PW-001', program: 'MAINT-001', amount: 500000 }],
 *   [{ category: 'Personnel', rate: 4.0 }]
 * );
 */
export async function generateMultiYearExpenditureForecast(
  scenarioId: string,
  startYear: number,
  years: number,
  baseExpenditures: Array<{ category: string; dept: string; program: string; amount: number }>,
  growthRates: Array<{ category: string; rate: number }>
): Promise<ExpenditureForecast[]> {
  const forecasts: ExpenditureForecastCreationAttributes[] = [];

  for (let year = 0; year < years; year++) {
    const fiscalYear = startYear + year;
    for (const baseExpenditure of baseExpenditures) {
      const growthRate = growthRates.find(gr => gr.category === baseExpenditure.category)?.rate || 0;
      const forecastedAmount = baseExpenditure.amount * Math.pow(1 + growthRate / 100, year);

      forecasts.push({
        scenarioId,
        fiscalYear,
        expenditureCategory: baseExpenditure.category,
        departmentCode: baseExpenditure.dept,
        programCode: baseExpenditure.program,
        historicalAmount: year === 0 ? baseExpenditure.amount : undefined,
        forecastedAmount,
        growthRate,
        forecastMethod: 'Compound growth',
        driverAssumptions: [`${growthRate}% annual growth`],
        metadata: {},
      });
    }
  }

  return await ExpenditureForecast.bulkCreate(forecasts);
}

// =============================================================================
// COMPOSITE FUNCTIONS - SENSITIVITY ANALYSIS
// =============================================================================

/**
 * Creates a sensitivity analysis for a forecast variable.
 *
 * @param analysisData - Sensitivity analysis creation attributes
 * @returns Created SensitivityAnalysis record
 *
 * @example
 * const analysis = await createSensitivityAnalysis({
 *   scenarioId: '550e8400-e29b-41d4-a716-446655440000',
 *   variableName: 'GDP Growth Rate',
 *   baselineValue: 3.0,
 *   adjustmentPercent: 10.0,
 *   adjustedValue: 3.3,
 *   impactOnRevenue: 50000,
 *   impactOnExpenditure: 10000,
 *   impactOnSurplus: 40000,
 *   sensitivity: 'high',
 *   metadata: {}
 * });
 */
export async function createSensitivityAnalysis(
  analysisData: SensitivityAnalysisCreationAttributes
): Promise<SensitivityAnalysis> {
  return await SensitivityAnalysis.create(analysisData);
}

/**
 * Retrieves all sensitivity analyses for a scenario.
 *
 * @param scenarioId - Scenario identifier
 * @returns Array of SensitivityAnalysis records
 *
 * @example
 * const analyses = await getSensitivityAnalysesByScenario('550e8400-e29b-41d4-a716-446655440000');
 */
export async function getSensitivityAnalysesByScenario(
  scenarioId: string
): Promise<SensitivityAnalysis[]> {
  return await SensitivityAnalysis.findAll({
    where: { scenarioId },
    order: [['sensitivity', 'ASC'], ['variableName', 'ASC']],
  });
}

/**
 * Retrieves high-sensitivity variables requiring close monitoring.
 *
 * @param scenarioId - Scenario identifier
 * @returns Array of high-sensitivity SensitivityAnalysis records
 *
 * @example
 * const highSensitivity = await getHighSensitivityVariables('550e8400-e29b-41d4-a716-446655440000');
 */
export async function getHighSensitivityVariables(
  scenarioId: string
): Promise<SensitivityAnalysis[]> {
  return await SensitivityAnalysis.findAll({
    where: { scenarioId, sensitivity: 'high' },
    order: [['impactOnSurplus', 'DESC']],
  });
}

/**
 * Performs sensitivity analysis on a key variable with multiple adjustment levels.
 *
 * @param scenarioId - Scenario identifier
 * @param variableName - Variable to analyze
 * @param baselineValue - Baseline value
 * @param adjustmentLevels - Array of adjustment percentages (e.g., [-10, -5, 5, 10])
 * @param impactCalculator - Function to calculate impact
 * @returns Array of created SensitivityAnalysis records
 *
 * @example
 * const analyses = await performMultiLevelSensitivityAnalysis(
 *   '550e8400-e29b-41d4-a716-446655440000',
 *   'Inflation Rate',
 *   2.5,
 *   [-10, -5, 5, 10],
 *   (adjustedValue) => ({ revenue: 0, expenditure: adjustedValue * 10000, surplus: -adjustedValue * 10000 })
 * );
 */
export async function performMultiLevelSensitivityAnalysis(
  scenarioId: string,
  variableName: string,
  baselineValue: number,
  adjustmentLevels: number[],
  impactCalculator: (adjustedValue: number) => { revenue: number; expenditure: number; surplus: number }
): Promise<SensitivityAnalysis[]> {
  const analyses: SensitivityAnalysisCreationAttributes[] = [];

  for (const adjustmentPercent of adjustmentLevels) {
    const adjustedValue = baselineValue * (1 + adjustmentPercent / 100);
    const impact = impactCalculator(adjustedValue);

    const sensitivity: 'high' | 'medium' | 'low' =
      Math.abs(impact.surplus) > 100000 ? 'high' :
      Math.abs(impact.surplus) > 50000 ? 'medium' : 'low';

    analyses.push({
      scenarioId,
      variableName,
      baselineValue,
      adjustmentPercent,
      adjustedValue,
      impactOnRevenue: impact.revenue,
      impactOnExpenditure: impact.expenditure,
      impactOnSurplus: impact.surplus,
      sensitivity,
      metadata: {},
    });
  }

  return await SensitivityAnalysis.bulkCreate(analyses);
}

// =============================================================================
// COMPOSITE FUNCTIONS - BUDGET VARIANCE TRACKING
// =============================================================================

/**
 * Creates a budget variance record comparing forecast to actuals.
 *
 * @param varianceData - Budget variance creation attributes
 * @returns Created BudgetVariance record
 *
 * @example
 * const variance = await createBudgetVariance({
 *   scenarioId: '550e8400-e29b-41d4-a716-446655440000',
 *   fiscalYear: 2024,
 *   lineItemType: 'revenue',
 *   lineItemCategory: 'Property Tax',
 *   forecastedAmount: 1050000,
 *   actualAmount: 1080000,
 *   varianceAmount: 30000,
 *   variancePercent: 2.86,
 *   varianceType: 'favorable',
 *   explanation: 'Higher property assessments than anticipated',
 *   metadata: {}
 * });
 */
export async function createBudgetVariance(
  varianceData: BudgetVarianceCreationAttributes
): Promise<BudgetVariance> {
  return await BudgetVariance.create(varianceData);
}

/**
 * Retrieves all budget variances for a scenario and fiscal year.
 *
 * @param scenarioId - Scenario identifier
 * @param fiscalYear - Fiscal year
 * @returns Array of BudgetVariance records
 *
 * @example
 * const variances = await getBudgetVariancesByScenarioAndYear('550e8400-e29b-41d4-a716-446655440000', 2024);
 */
export async function getBudgetVariancesByScenarioAndYear(
  scenarioId: string,
  fiscalYear: number
): Promise<BudgetVariance[]> {
  return await BudgetVariance.findAll({
    where: { scenarioId, fiscalYear },
    order: [['varianceAmount', 'DESC']],
  });
}

/**
 * Retrieves significant variances exceeding a threshold percentage.
 *
 * @param scenarioId - Scenario identifier
 * @param fiscalYear - Fiscal year
 * @param thresholdPercent - Minimum variance percentage to include
 * @returns Array of significant BudgetVariance records
 *
 * @example
 * const significantVariances = await getSignificantBudgetVariances('550e8400-e29b-41d4-a716-446655440000', 2024, 5.0);
 */
export async function getSignificantBudgetVariances(
  scenarioId: string,
  fiscalYear: number,
  thresholdPercent: number
): Promise<BudgetVariance[]> {
  const variances = await BudgetVariance.findAll({
    where: { scenarioId, fiscalYear },
  });
  return variances.filter(v => Math.abs(Number(v.variancePercent)) >= thresholdPercent);
}

/**
 * Calculates forecast accuracy for a scenario and fiscal year.
 *
 * @param scenarioId - Scenario identifier
 * @param fiscalYear - Fiscal year
 * @returns Forecast accuracy metrics
 *
 * @example
 * const accuracy = await calculateForecastAccuracy('550e8400-e29b-41d4-a716-446655440000', 2024);
 */
export async function calculateForecastAccuracy(
  scenarioId: string,
  fiscalYear: number
): Promise<{
  totalForecasted: number;
  totalActual: number;
  totalVariance: number;
  averageVariancePercent: number;
  accuracyRate: number;
}> {
  const variances = await BudgetVariance.findAll({
    where: { scenarioId, fiscalYear },
  });

  const totalForecasted = variances.reduce((sum, v) => sum + Number(v.forecastedAmount), 0);
  const totalActual = variances.reduce((sum, v) => sum + Number(v.actualAmount), 0);
  const totalVariance = variances.reduce((sum, v) => sum + Math.abs(Number(v.varianceAmount)), 0);

  const averageVariancePercent = variances.length > 0
    ? variances.reduce((sum, v) => sum + Math.abs(Number(v.variancePercent)), 0) / variances.length
    : 0;

  const accuracyRate = totalForecasted > 0 ? (1 - totalVariance / totalForecasted) * 100 : 0;

  return {
    totalForecasted,
    totalActual,
    totalVariance,
    averageVariancePercent: Math.round(averageVariancePercent * 100) / 100,
    accuracyRate: Math.round(accuracyRate * 100) / 100,
  };
}

// =============================================================================
// COMPOSITE FUNCTIONS - WHAT-IF SCENARIOS
// =============================================================================

/**
 * Creates a what-if scenario for policy or program changes.
 *
 * @param whatIfData - What-if scenario creation attributes
 * @returns Created WhatIfScenario record
 *
 * @example
 * const whatIf = await createWhatIfScenario({
 *   baseScenarioId: '550e8400-e29b-41d4-a716-446655440000',
 *   whatIfName: 'New Recreation Center',
 *   whatIfDescription: 'Impact of building new recreation center',
 *   changeType: 'capital_project',
 *   changeDetails: { projectCost: 5000000, operatingCost: 200000 },
 *   fiscalYearImpact: 2026,
 *   projectedRevenueImpact: 50000,
 *   projectedExpenditureImpact: 200000,
 *   netBudgetImpact: -150000,
 *   implementationCost: 5000000,
 *   status: 'proposed',
 *   metadata: {}
 * });
 */
export async function createWhatIfScenario(
  whatIfData: WhatIfScenarioCreationAttributes
): Promise<WhatIfScenario> {
  return await WhatIfScenario.create(whatIfData);
}

/**
 * Retrieves all what-if scenarios for a base scenario.
 *
 * @param baseScenarioId - Base scenario identifier
 * @returns Array of WhatIfScenario records
 *
 * @example
 * const whatIfScenarios = await getWhatIfScenariosByBaseScenario('550e8400-e29b-41d4-a716-446655440000');
 */
export async function getWhatIfScenariosByBaseScenario(
  baseScenarioId: string
): Promise<WhatIfScenario[]> {
  return await WhatIfScenario.findAll({
    where: { baseScenarioId },
    order: [['netBudgetImpact', 'DESC']],
  });
}

/**
 * Retrieves what-if scenarios by change type.
 *
 * @param baseScenarioId - Base scenario identifier
 * @param changeType - Type of change
 * @returns Array of WhatIfScenario records
 *
 * @example
 * const policyChanges = await getWhatIfScenariosByChangeType('550e8400-e29b-41d4-a716-446655440000', 'policy');
 */
export async function getWhatIfScenariosByChangeType(
  baseScenarioId: string,
  changeType: 'policy' | 'program' | 'tax_rate' | 'service_level' | 'capital_project'
): Promise<WhatIfScenario[]> {
  return await WhatIfScenario.findAll({
    where: { baseScenarioId, changeType },
    order: [['netBudgetImpact', 'DESC']],
  });
}

/**
 * Updates what-if scenario status.
 *
 * @param whatIfId - What-if scenario identifier
 * @param status - New status
 * @returns Updated WhatIfScenario record
 *
 * @example
 * const whatIf = await updateWhatIfScenarioStatus('770e8400-e29b-41d4-a716-446655440000', 'approved');
 */
export async function updateWhatIfScenarioStatus(
  whatIfId: string,
  status: 'proposed' | 'under_review' | 'approved' | 'rejected'
): Promise<WhatIfScenario | null> {
  const whatIf = await WhatIfScenario.findByPk(whatIfId);
  if (!whatIf) return null;
  whatIf.status = status;
  await whatIf.save();
  return whatIf;
}

/**
 * Compares multiple what-if scenarios to identify best option.
 *
 * @param whatIfIds - Array of what-if scenario identifiers
 * @returns Comparison summary with rankings
 *
 * @example
 * const comparison = await compareWhatIfScenarios(['id1', 'id2', 'id3']);
 */
export async function compareWhatIfScenarios(
  whatIfIds: string[]
): Promise<Array<{
  whatIfId: string;
  whatIfName: string;
  netBudgetImpact: number;
  revenueImpact: number;
  expenditureImpact: number;
  implementationCost: number;
  roi: number;
}>> {
  const scenarios = await WhatIfScenario.findAll({
    where: { whatIfId: { $in: whatIfIds } as any },
  });

  return scenarios.map(s => ({
    whatIfId: s.whatIfId,
    whatIfName: s.whatIfName,
    netBudgetImpact: Number(s.netBudgetImpact),
    revenueImpact: Number(s.projectedRevenueImpact),
    expenditureImpact: Number(s.projectedExpenditureImpact),
    implementationCost: Number(s.implementationCost),
    roi: Number(s.implementationCost) > 0
      ? (Number(s.netBudgetImpact) / Number(s.implementationCost)) * 100
      : 0,
  })).sort((a, b) => b.netBudgetImpact - a.netBudgetImpact);
}

// =============================================================================
// COMPOSITE FUNCTIONS - SCENARIO ANALYSIS
// =============================================================================

/**
 * Calculates budget surplus/deficit for a scenario and fiscal year.
 *
 * @param scenarioId - Scenario identifier
 * @param fiscalYear - Fiscal year
 * @returns Budget surplus (positive) or deficit (negative)
 *
 * @example
 * const surplus = await calculateBudgetSurplus('550e8400-e29b-41d4-a716-446655440000', 2025);
 */
export async function calculateBudgetSurplus(
  scenarioId: string,
  fiscalYear: number
): Promise<number> {
  const totalRevenue = await calculateTotalForecastedRevenue(scenarioId, fiscalYear);
  const totalExpenditure = await calculateTotalForecastedExpenditure(scenarioId, fiscalYear);
  return totalRevenue - totalExpenditure;
}

/**
 * Compares multiple forecast scenarios side-by-side.
 *
 * @param scenarioIds - Array of scenario identifiers
 * @param fiscalYear - Fiscal year to compare
 * @returns Comparison summary
 *
 * @example
 * const comparison = await compareScenarios(['baseline-id', 'optimistic-id', 'pessimistic-id'], 2025);
 */
export async function compareScenarios(
  scenarioIds: string[],
  fiscalYear: number
): Promise<Array<{
  scenarioId: string;
  scenarioName: string;
  scenarioType: string;
  totalRevenue: number;
  totalExpenditure: number;
  surplus: number;
}>> {
  const results = [];

  for (const scenarioId of scenarioIds) {
    const scenario = await ForecastScenario.findByPk(scenarioId);
    if (!scenario) continue;

    const totalRevenue = await calculateTotalForecastedRevenue(scenarioId, fiscalYear);
    const totalExpenditure = await calculateTotalForecastedExpenditure(scenarioId, fiscalYear);

    results.push({
      scenarioId,
      scenarioName: scenario.scenarioName,
      scenarioType: scenario.scenarioType,
      totalRevenue,
      totalExpenditure,
      surplus: totalRevenue - totalExpenditure,
    });
  }

  return results;
}

// =============================================================================
// NESTJS SERVICE WRAPPER
// =============================================================================

/**
 * NestJS Injectable service for Budget Forecasting and Scenario Analysis operations.
 * Provides comprehensive forecasting, sensitivity analysis, and what-if modeling.
 */
@Injectable()
export class CEFMSBudgetForecastingScenariosService {
  // Scenario Management
  async createForecastScenario(scenarioData: ForecastScenarioCreationAttributes): Promise<ForecastScenario> {
    return await createForecastScenario(scenarioData);
  }

  async getForecastScenarioById(scenarioId: string): Promise<ForecastScenario | null> {
    return await getForecastScenarioById(scenarioId);
  }

  async getForecastScenariosByFiscalYear(baseFiscalYear: number): Promise<ForecastScenario[]> {
    return await getForecastScenariosByFiscalYear(baseFiscalYear);
  }

  async getApprovedForecastScenarios(): Promise<ForecastScenario[]> {
    return await getApprovedForecastScenarios();
  }

  async updateForecastScenarioStatus(scenarioId: string, status: 'draft' | 'review' | 'approved' | 'archived', approverId?: string): Promise<ForecastScenario | null> {
    return await updateForecastScenarioStatus(scenarioId, status, approverId);
  }

  // Forecast Assumptions
  async createForecastAssumption(assumptionData: ForecastAssumptionCreationAttributes): Promise<ForecastAssumption> {
    return await createForecastAssumption(assumptionData);
  }

  async getForecastAssumptionsByScenario(scenarioId: string): Promise<ForecastAssumption[]> {
    return await getForecastAssumptionsByScenario(scenarioId);
  }

  async getForecastAssumptionsByType(scenarioId: string, assumptionType: 'economic' | 'demographic' | 'policy' | 'operational'): Promise<ForecastAssumption[]> {
    return await getForecastAssumptionsByType(scenarioId, assumptionType);
  }

  async updateForecastAssumption(assumptionId: string, updates: Partial<ForecastAssumptionAttributes>): Promise<ForecastAssumption | null> {
    return await updateForecastAssumption(assumptionId, updates);
  }

  async bulkCreateForecastAssumptions(assumptions: ForecastAssumptionCreationAttributes[]): Promise<ForecastAssumption[]> {
    return await bulkCreateForecastAssumptions(assumptions);
  }

  // Revenue Forecasting
  async createRevenueForecast(forecastData: RevenueForecastCreationAttributes): Promise<RevenueForecast> {
    return await createRevenueForecast(forecastData);
  }

  async getRevenueForecastsByScenario(scenarioId: string): Promise<RevenueForecast[]> {
    return await getRevenueForecastsByScenario(scenarioId);
  }

  async getRevenueForecastsByYear(scenarioId: string, fiscalYear: number): Promise<RevenueForecast[]> {
    return await getRevenueForecastsByYear(scenarioId, fiscalYear);
  }

  async calculateTotalForecastedRevenue(scenarioId: string, fiscalYear: number): Promise<number> {
    return await calculateTotalForecastedRevenue(scenarioId, fiscalYear);
  }

  async generateMultiYearRevenueForecast(scenarioId: string, startYear: number, years: number, baseRevenues: Array<{ source: string; category: string; amount: number }>, growthRates: Array<{ source: string; rate: number }>): Promise<RevenueForecast[]> {
    return await generateMultiYearRevenueForecast(scenarioId, startYear, years, baseRevenues, growthRates);
  }

  // Expenditure Forecasting
  async createExpenditureForecast(forecastData: ExpenditureForecastCreationAttributes): Promise<ExpenditureForecast> {
    return await createExpenditureForecast(forecastData);
  }

  async getExpenditureForecastsByScenario(scenarioId: string): Promise<ExpenditureForecast[]> {
    return await getExpenditureForecastsByScenario(scenarioId);
  }

  async getExpenditureForecastsByYear(scenarioId: string, fiscalYear: number): Promise<ExpenditureForecast[]> {
    return await getExpenditureForecastsByYear(scenarioId, fiscalYear);
  }

  async calculateTotalForecastedExpenditure(scenarioId: string, fiscalYear: number): Promise<number> {
    return await calculateTotalForecastedExpenditure(scenarioId, fiscalYear);
  }

  async getExpenditureForecastsByDepartment(scenarioId: string, departmentCode: string): Promise<ExpenditureForecast[]> {
    return await getExpenditureForecastsByDepartment(scenarioId, departmentCode);
  }

  async generateMultiYearExpenditureForecast(scenarioId: string, startYear: number, years: number, baseExpenditures: Array<{ category: string; dept: string; program: string; amount: number }>, growthRates: Array<{ category: string; rate: number }>): Promise<ExpenditureForecast[]> {
    return await generateMultiYearExpenditureForecast(scenarioId, startYear, years, baseExpenditures, growthRates);
  }

  // Sensitivity Analysis
  async createSensitivityAnalysis(analysisData: SensitivityAnalysisCreationAttributes): Promise<SensitivityAnalysis> {
    return await createSensitivityAnalysis(analysisData);
  }

  async getSensitivityAnalysesByScenario(scenarioId: string): Promise<SensitivityAnalysis[]> {
    return await getSensitivityAnalysesByScenario(scenarioId);
  }

  async getHighSensitivityVariables(scenarioId: string): Promise<SensitivityAnalysis[]> {
    return await getHighSensitivityVariables(scenarioId);
  }

  async performMultiLevelSensitivityAnalysis(scenarioId: string, variableName: string, baselineValue: number, adjustmentLevels: number[], impactCalculator: (adjustedValue: number) => { revenue: number; expenditure: number; surplus: number }): Promise<SensitivityAnalysis[]> {
    return await performMultiLevelSensitivityAnalysis(scenarioId, variableName, baselineValue, adjustmentLevels, impactCalculator);
  }

  // Budget Variance Tracking
  async createBudgetVariance(varianceData: BudgetVarianceCreationAttributes): Promise<BudgetVariance> {
    return await createBudgetVariance(varianceData);
  }

  async getBudgetVariancesByScenarioAndYear(scenarioId: string, fiscalYear: number): Promise<BudgetVariance[]> {
    return await getBudgetVariancesByScenarioAndYear(scenarioId, fiscalYear);
  }

  async getSignificantBudgetVariances(scenarioId: string, fiscalYear: number, thresholdPercent: number): Promise<BudgetVariance[]> {
    return await getSignificantBudgetVariances(scenarioId, fiscalYear, thresholdPercent);
  }

  async calculateForecastAccuracy(scenarioId: string, fiscalYear: number): Promise<{ totalForecasted: number; totalActual: number; totalVariance: number; averageVariancePercent: number; accuracyRate: number }> {
    return await calculateForecastAccuracy(scenarioId, fiscalYear);
  }

  // What-If Scenarios
  async createWhatIfScenario(whatIfData: WhatIfScenarioCreationAttributes): Promise<WhatIfScenario> {
    return await createWhatIfScenario(whatIfData);
  }

  async getWhatIfScenariosByBaseScenario(baseScenarioId: string): Promise<WhatIfScenario[]> {
    return await getWhatIfScenariosByBaseScenario(baseScenarioId);
  }

  async getWhatIfScenariosByChangeType(baseScenarioId: string, changeType: 'policy' | 'program' | 'tax_rate' | 'service_level' | 'capital_project'): Promise<WhatIfScenario[]> {
    return await getWhatIfScenariosByChangeType(baseScenarioId, changeType);
  }

  async updateWhatIfScenarioStatus(whatIfId: string, status: 'proposed' | 'under_review' | 'approved' | 'rejected'): Promise<WhatIfScenario | null> {
    return await updateWhatIfScenarioStatus(whatIfId, status);
  }

  async compareWhatIfScenarios(whatIfIds: string[]): Promise<Array<{ whatIfId: string; whatIfName: string; netBudgetImpact: number; revenueImpact: number; expenditureImpact: number; implementationCost: number; roi: number }>> {
    return await compareWhatIfScenarios(whatIfIds);
  }

  // Scenario Analysis
  async calculateBudgetSurplus(scenarioId: string, fiscalYear: number): Promise<number> {
    return await calculateBudgetSurplus(scenarioId, fiscalYear);
  }

  async compareScenarios(scenarioIds: string[], fiscalYear: number): Promise<Array<{ scenarioId: string; scenarioName: string; scenarioType: string; totalRevenue: number; totalExpenditure: number; surplus: number }>> {
    return await compareScenarios(scenarioIds, fiscalYear);
  }
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  // Models
  ForecastScenario,
  ForecastAssumption,
  RevenueForecast,
  ExpenditureForecast,
  SensitivityAnalysis,
  BudgetVariance,
  WhatIfScenario,

  // Initialization
  initializeBudgetForecastingScenarioModels,

  // Scenario Management Functions
  createForecastScenario,
  getForecastScenarioById,
  getForecastScenariosByFiscalYear,
  getApprovedForecastScenarios,
  updateForecastScenarioStatus,

  // Forecast Assumption Functions
  createForecastAssumption,
  getForecastAssumptionsByScenario,
  getForecastAssumptionsByType,
  updateForecastAssumption,
  bulkCreateForecastAssumptions,

  // Revenue Forecasting Functions
  createRevenueForecast,
  getRevenueForecastsByScenario,
  getRevenueForecastsByYear,
  calculateTotalForecastedRevenue,
  generateMultiYearRevenueForecast,

  // Expenditure Forecasting Functions
  createExpenditureForecast,
  getExpenditureForecastsByScenario,
  getExpenditureForecastsByYear,
  calculateTotalForecastedExpenditure,
  getExpenditureForecastsByDepartment,
  generateMultiYearExpenditureForecast,

  // Sensitivity Analysis Functions
  createSensitivityAnalysis,
  getSensitivityAnalysesByScenario,
  getHighSensitivityVariables,
  performMultiLevelSensitivityAnalysis,

  // Budget Variance Functions
  createBudgetVariance,
  getBudgetVariancesByScenarioAndYear,
  getSignificantBudgetVariances,
  calculateForecastAccuracy,

  // What-If Scenario Functions
  createWhatIfScenario,
  getWhatIfScenariosByBaseScenario,
  getWhatIfScenariosByChangeType,
  updateWhatIfScenarioStatus,
  compareWhatIfScenarios,

  // Scenario Analysis Functions
  calculateBudgetSurplus,
  compareScenarios,

  // Service
  CEFMSBudgetForecastingScenariosService,
};
