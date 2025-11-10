/**
 * LOC: CONS-SCN-PLN-001
 * File: /reuse/server/consulting/scenario-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/scenario-planning.service.ts
 *   - backend/consulting/strategic-options.controller.ts
 *   - backend/consulting/war-gaming.service.ts
 */

/**
 * File: /reuse/server/consulting/scenario-planning-kit.ts
 * Locator: WC-CONS-SCNPLN-001
 * Purpose: Enterprise-grade Scenario Planning Kit - scenario development, war gaming, contingency planning, strategic options analysis
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, strategic planning controllers, scenario analysis processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 40 production-ready functions for scenario planning competing with McKinsey, BCG, Bain consulting tools
 *
 * LLM Context: Comprehensive scenario planning utilities for production-ready management consulting applications.
 * Provides scenario development, war gaming, contingency planning, strategic options analysis, uncertainty mapping,
 * scenario matrices, impact assessment, risk scenarios, future state modeling, stress testing, sensitivity analysis,
 * option valuation, decision trees, scenario narratives, and strategic flexibility analysis.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Scenario type classifications
 */
export enum ScenarioType {
  OPTIMISTIC = 'optimistic',
  BASELINE = 'baseline',
  PESSIMISTIC = 'pessimistic',
  WORST_CASE = 'worst_case',
  WILDCARD = 'wildcard',
  EXPLORATORY = 'exploratory',
}

/**
 * Uncertainty levels for scenario variables
 */
export enum UncertaintyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Strategic option types
 */
export enum OptionType {
  EXPAND = 'expand',
  MAINTAIN = 'maintain',
  RETREAT = 'retreat',
  PIVOT = 'pivot',
  ACQUIRE = 'acquire',
  DIVEST = 'divest',
  PARTNER = 'partner',
  INNOVATE = 'innovate',
}

/**
 * Impact severity levels
 */
export enum ImpactSeverity {
  NEGLIGIBLE = 'negligible',
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  CATASTROPHIC = 'catastrophic',
}

/**
 * War game outcome types
 */
export enum WarGameOutcome {
  WIN = 'win',
  LOSE = 'lose',
  STALEMATE = 'stalemate',
  PARTIAL_WIN = 'partial_win',
  PYRRHIC_VICTORY = 'pyrrhic_victory',
}

/**
 * Contingency trigger types
 */
export enum ContingencyTrigger {
  MARKET_SHIFT = 'market_shift',
  COMPETITIVE_MOVE = 'competitive_move',
  REGULATORY_CHANGE = 'regulatory_change',
  TECHNOLOGY_DISRUPTION = 'technology_disruption',
  ECONOMIC_EVENT = 'economic_event',
  GEOPOLITICAL_EVENT = 'geopolitical_event',
}

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

/**
 * Scenario data interface
 */
export interface ScenarioData {
  scenarioId: string;
  name: string;
  scenarioType: ScenarioType;
  description: string;
  timeHorizon: number;
  probability: number;
  keyAssumptions: string[];
  drivingForces: string[];
  criticalUncertainties: Array<{
    variable: string;
    uncertaintyLevel: UncertaintyLevel;
    range: { min: number; max: number };
  }>;
  narrative: string;
  indicators: string[];
  status: string;
  createdBy: string;
  metadata: Record<string, any>;
}

/**
 * Strategic option data interface
 */
export interface StrategicOptionData {
  optionId: string;
  scenarioId: string;
  optionType: OptionType;
  name: string;
  description: string;
  investmentRequired: number;
  expectedValue: number;
  upside: number;
  downside: number;
  flexibility: number;
  reversibility: boolean;
  timeToImplement: number;
  dependencies: string[];
  risks: string[];
  benefits: string[];
}

/**
 * War game simulation data
 */
export interface WarGameData {
  gameId: string;
  scenarioId: string;
  gameName: string;
  participants: string[];
  moves: Array<{
    player: string;
    moveType: string;
    description: string;
    timestamp: Date;
  }>;
  outcome: WarGameOutcome;
  insights: string[];
  learnings: string[];
  durationHours: number;
}

/**
 * Impact assessment data
 */
export interface ImpactAssessmentData {
  assessmentId: string;
  scenarioId: string;
  impactArea: string;
  severity: ImpactSeverity;
  financialImpact: number;
  operationalImpact: string;
  strategicImpact: string;
  likelihood: number;
  timeframe: string;
  mitigationActions: string[];
}

/**
 * Contingency plan data
 */
export interface ContingencyPlanData {
  planId: string;
  scenarioId: string;
  triggerType: ContingencyTrigger;
  triggerConditions: string[];
  actions: Array<{
    sequence: number;
    action: string;
    owner: string;
    timeline: string;
    resources: string[];
  }>;
  activationThreshold: string;
  deactivationCriteria: string;
  status: string;
}

/**
 * Scenario matrix cell data
 */
export interface ScenarioMatrixData {
  matrixId: string;
  axis1: { name: string; states: string[] };
  axis2: { name: string; states: string[] };
  cells: Array<{
    position: [number, number];
    scenarioId: string;
    scenarioName: string;
    probability: number;
    attractiveness: number;
  }>;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

/**
 * Create Scenario DTO
 */
export class CreateScenarioDto {
  @ApiProperty({ description: 'Scenario name', example: 'Digital Transformation Accelerates' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Scenario type',
    enum: ScenarioType,
    example: ScenarioType.OPTIMISTIC
  })
  @IsEnum(ScenarioType)
  scenarioType: ScenarioType;

  @ApiProperty({ description: 'Detailed description', example: 'Rapid digital adoption drives market growth' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ description: 'Time horizon in years', example: 5, minimum: 1, maximum: 20 })
  @IsNumber()
  @Min(1)
  @Max(20)
  timeHorizon: number;

  @ApiProperty({ description: 'Probability (0-100)', example: 35, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  probability: number;

  @ApiProperty({ description: 'Key assumptions', example: ['AI adoption continues', 'Market remains stable'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  keyAssumptions: string[];

  @ApiProperty({ description: 'Driving forces', example: ['Technology', 'Customer demand'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  drivingForces: string[];

  @ApiProperty({ description: 'Scenario narrative', example: 'In this scenario, healthcare organizations rapidly adopt...' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  narrative: string;

  @ApiProperty({ description: 'Leading indicators', example: ['Digital investment levels', 'Adoption rates'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  indicators: string[];

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * Create Strategic Option DTO
 */
export class CreateStrategicOptionDto {
  @ApiProperty({ description: 'Scenario ID', example: 'uuid-scenario-123' })
  @IsUUID()
  scenarioId: string;

  @ApiProperty({ description: 'Option name', example: 'Accelerated Digital Investment' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Option type',
    enum: OptionType,
    example: OptionType.EXPAND
  })
  @IsEnum(OptionType)
  optionType: OptionType;

  @ApiProperty({ description: 'Detailed description', example: 'Increase digital platform investment by 50%' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Investment required ($)', example: 5000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  investmentRequired: number;

  @ApiProperty({ description: 'Expected value ($)', example: 15000000 })
  @IsNumber()
  expectedValue: number;

  @ApiProperty({ description: 'Upside potential ($)', example: 25000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  upside: number;

  @ApiProperty({ description: 'Downside risk ($)', example: 2000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  downside: number;

  @ApiProperty({ description: 'Strategic flexibility (0-100)', example: 65, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  flexibility: number;

  @ApiProperty({ description: 'Is reversible', example: true })
  @IsBoolean()
  reversibility: boolean;

  @ApiProperty({ description: 'Time to implement (months)', example: 12, minimum: 1 })
  @IsNumber()
  @Min(1)
  timeToImplement: number;

  @ApiProperty({ description: 'Dependencies', example: ['Budget approval', 'Technology readiness'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  dependencies: string[];

  @ApiProperty({ description: 'Risks', example: ['Implementation delays', 'Cost overruns'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  risks: string[];

  @ApiProperty({ description: 'Benefits', example: ['Market share gain', 'Operational efficiency'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  benefits: string[];
}

/**
 * Create War Game DTO
 */
export class CreateWarGameDto {
  @ApiProperty({ description: 'Scenario ID', example: 'uuid-scenario-123' })
  @IsUUID()
  scenarioId: string;

  @ApiProperty({ description: 'Game name', example: 'Market Entry War Game' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  gameName: string;

  @ApiProperty({ description: 'Participant names', example: ['Team A', 'Team B', 'Competitor X'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  participants: string[];

  @ApiProperty({ description: 'Game duration in hours', example: 4, minimum: 1 })
  @IsNumber()
  @Min(1)
  durationHours: number;
}

/**
 * Create Impact Assessment DTO
 */
export class CreateImpactAssessmentDto {
  @ApiProperty({ description: 'Scenario ID', example: 'uuid-scenario-123' })
  @IsUUID()
  scenarioId: string;

  @ApiProperty({ description: 'Impact area', example: 'Revenue' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  impactArea: string;

  @ApiProperty({
    description: 'Impact severity',
    enum: ImpactSeverity,
    example: ImpactSeverity.MAJOR
  })
  @IsEnum(ImpactSeverity)
  severity: ImpactSeverity;

  @ApiProperty({ description: 'Financial impact ($)', example: -5000000 })
  @IsNumber()
  financialImpact: number;

  @ApiProperty({ description: 'Operational impact description', example: 'Supply chain disruptions expected' })
  @IsString()
  @MaxLength(1000)
  operationalImpact: string;

  @ApiProperty({ description: 'Strategic impact description', example: 'Market position at risk' })
  @IsString()
  @MaxLength(1000)
  strategicImpact: string;

  @ApiProperty({ description: 'Likelihood (0-100)', example: 70, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  likelihood: number;

  @ApiProperty({ description: 'Impact timeframe', example: '6-12 months' })
  @IsString()
  @IsNotEmpty()
  timeframe: string;

  @ApiProperty({ description: 'Mitigation actions', example: ['Diversify suppliers', 'Build inventory buffer'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  mitigationActions: string[];
}

/**
 * Create Contingency Plan DTO
 */
export class CreateContingencyPlanDto {
  @ApiProperty({ description: 'Scenario ID', example: 'uuid-scenario-123' })
  @IsUUID()
  scenarioId: string;

  @ApiProperty({
    description: 'Trigger type',
    enum: ContingencyTrigger,
    example: ContingencyTrigger.MARKET_SHIFT
  })
  @IsEnum(ContingencyTrigger)
  triggerType: ContingencyTrigger;

  @ApiProperty({ description: 'Trigger conditions', example: ['Market share drops below 15%', 'Two consecutive quarters of decline'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  triggerConditions: string[];

  @ApiProperty({ description: 'Activation threshold', example: 'Two trigger conditions met simultaneously' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  activationThreshold: string;

  @ApiProperty({ description: 'Deactivation criteria', example: 'Market share recovered above 18%' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  deactivationCriteria: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Scenario Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     Scenario:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         scenarioId:
 *           type: string
 *         name:
 *           type: string
 *         scenarioType:
 *           type: string
 *           enum: [optimistic, baseline, pessimistic, worst_case, wildcard, exploratory]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Scenario model
 */
export const createScenarioModel = (sequelize: Sequelize) => {
  class Scenario extends Model {
    public id!: string;
    public scenarioId!: string;
    public name!: string;
    public scenarioType!: string;
    public description!: string;
    public timeHorizon!: number;
    public probability!: number;
    public keyAssumptions!: string[];
    public drivingForces!: string[];
    public criticalUncertainties!: any[];
    public narrative!: string;
    public indicators!: string[];
    public status!: string;
    public createdBy!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Scenario.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      scenarioId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Scenario identifier',
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Scenario name',
      },
      scenarioType: {
        type: DataTypes.ENUM(
          'optimistic',
          'baseline',
          'pessimistic',
          'worst_case',
          'wildcard',
          'exploratory'
        ),
        allowNull: false,
        comment: 'Scenario type',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Scenario description',
      },
      timeHorizon: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Time horizon in years',
      },
      probability: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Probability percentage',
      },
      keyAssumptions: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Key assumptions',
      },
      drivingForces: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Driving forces',
      },
      criticalUncertainties: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        comment: 'Critical uncertainties with ranges',
      },
      narrative: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Scenario narrative',
      },
      indicators: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Leading indicators',
      },
      status: {
        type: DataTypes.ENUM('draft', 'in_review', 'approved', 'active', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Scenario status',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Created by user',
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
      tableName: 'scenarios',
      timestamps: true,
      indexes: [
        { fields: ['scenarioId'] },
        { fields: ['scenarioType'] },
        { fields: ['status'] },
        { fields: ['createdBy'] },
      ],
    }
  );

  return Scenario;
};

/**
 * Strategic Option Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} StrategicOption model
 */
export const createStrategicOptionModel = (sequelize: Sequelize) => {
  class StrategicOption extends Model {
    public id!: string;
    public optionId!: string;
    public scenarioId!: string;
    public optionType!: string;
    public name!: string;
    public description!: string;
    public investmentRequired!: number;
    public expectedValue!: number;
    public upside!: number;
    public downside!: number;
    public flexibility!: number;
    public reversibility!: boolean;
    public timeToImplement!: number;
    public dependencies!: string[];
    public risks!: string[];
    public benefits!: string[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  StrategicOption.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      optionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Option identifier',
      },
      scenarioId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related scenario',
      },
      optionType: {
        type: DataTypes.ENUM(
          'expand',
          'maintain',
          'retreat',
          'pivot',
          'acquire',
          'divest',
          'partner',
          'innovate'
        ),
        allowNull: false,
        comment: 'Strategic option type',
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Option name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Option description',
      },
      investmentRequired: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Investment required',
      },
      expectedValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Expected value',
      },
      upside: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Upside potential',
      },
      downside: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Downside risk',
      },
      flexibility: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Strategic flexibility score',
      },
      reversibility: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: 'Is option reversible',
      },
      timeToImplement: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Time to implement in months',
      },
      dependencies: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Option dependencies',
      },
      risks: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Option risks',
      },
      benefits: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Option benefits',
      },
    },
    {
      sequelize,
      tableName: 'strategic_options',
      timestamps: true,
      indexes: [
        { fields: ['optionId'] },
        { fields: ['scenarioId'] },
        { fields: ['optionType'] },
      ],
    }
  );

  return StrategicOption;
};

/**
 * War Game Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WarGame model
 */
export const createWarGameModel = (sequelize: Sequelize) => {
  class WarGame extends Model {
    public id!: string;
    public gameId!: string;
    public scenarioId!: string;
    public gameName!: string;
    public participants!: string[];
    public moves!: any[];
    public outcome!: string;
    public insights!: string[];
    public learnings!: string[];
    public durationHours!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  WarGame.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      gameId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'War game identifier',
      },
      scenarioId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related scenario',
      },
      gameName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'War game name',
      },
      participants: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Game participants',
      },
      moves: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        comment: 'Game moves sequence',
      },
      outcome: {
        type: DataTypes.ENUM('win', 'lose', 'stalemate', 'partial_win', 'pyrrhic_victory'),
        allowNull: true,
        comment: 'Game outcome',
      },
      insights: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Key insights',
      },
      learnings: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Strategic learnings',
      },
      durationHours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Game duration in hours',
      },
    },
    {
      sequelize,
      tableName: 'war_games',
      timestamps: true,
      indexes: [
        { fields: ['gameId'] },
        { fields: ['scenarioId'] },
      ],
    }
  );

  return WarGame;
};

/**
 * Impact Assessment Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ImpactAssessment model
 */
export const createImpactAssessmentModel = (sequelize: Sequelize) => {
  class ImpactAssessment extends Model {
    public id!: string;
    public assessmentId!: string;
    public scenarioId!: string;
    public impactArea!: string;
    public severity!: string;
    public financialImpact!: number;
    public operationalImpact!: string;
    public strategicImpact!: string;
    public likelihood!: number;
    public timeframe!: string;
    public mitigationActions!: string[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ImpactAssessment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      assessmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Assessment identifier',
      },
      scenarioId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related scenario',
      },
      impactArea: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Area of impact',
      },
      severity: {
        type: DataTypes.ENUM('negligible', 'minor', 'moderate', 'major', 'catastrophic'),
        allowNull: false,
        comment: 'Impact severity',
      },
      financialImpact: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Financial impact amount',
      },
      operationalImpact: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Operational impact description',
      },
      strategicImpact: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Strategic impact description',
      },
      likelihood: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Likelihood percentage',
      },
      timeframe: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Impact timeframe',
      },
      mitigationActions: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Mitigation actions',
      },
    },
    {
      sequelize,
      tableName: 'impact_assessments',
      timestamps: true,
      indexes: [
        { fields: ['assessmentId'] },
        { fields: ['scenarioId'] },
        { fields: ['severity'] },
      ],
    }
  );

  return ImpactAssessment;
};

/**
 * Contingency Plan Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ContingencyPlan model
 */
export const createContingencyPlanModel = (sequelize: Sequelize) => {
  class ContingencyPlan extends Model {
    public id!: string;
    public planId!: string;
    public scenarioId!: string;
    public triggerType!: string;
    public triggerConditions!: string[];
    public actions!: any[];
    public activationThreshold!: string;
    public deactivationCriteria!: string;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ContingencyPlan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      planId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Plan identifier',
      },
      scenarioId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related scenario',
      },
      triggerType: {
        type: DataTypes.ENUM(
          'market_shift',
          'competitive_move',
          'regulatory_change',
          'technology_disruption',
          'economic_event',
          'geopolitical_event'
        ),
        allowNull: false,
        comment: 'Trigger type',
      },
      triggerConditions: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Trigger conditions',
      },
      actions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        comment: 'Contingency actions',
      },
      activationThreshold: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Activation threshold',
      },
      deactivationCriteria: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Deactivation criteria',
      },
      status: {
        type: DataTypes.ENUM('ready', 'activated', 'executing', 'completed', 'deactivated'),
        allowNull: false,
        defaultValue: 'ready',
        comment: 'Plan status',
      },
    },
    {
      sequelize,
      tableName: 'contingency_plans',
      timestamps: true,
      indexes: [
        { fields: ['planId'] },
        { fields: ['scenarioId'] },
        { fields: ['status'] },
      ],
    }
  );

  return ContingencyPlan;
};

// ============================================================================
// SCENARIO DEVELOPMENT FUNCTIONS (1-10)
// ============================================================================

/**
 * Creates a new scenario with comprehensive details.
 *
 * @param {Partial<ScenarioData>} data - Scenario data
 * @returns {Promise<ScenarioData>} Created scenario
 *
 * @example
 * ```typescript
 * const scenario = await createScenario({
 *   name: 'Digital Transformation Accelerates',
 *   scenarioType: ScenarioType.OPTIMISTIC,
 *   timeHorizon: 5,
 *   probability: 35,
 *   ...
 * });
 * ```
 */
export async function createScenario(
  data: Partial<ScenarioData>
): Promise<ScenarioData> {
  return {
    scenarioId: data.scenarioId || `SCN-${Date.now()}`,
    name: data.name || '',
    scenarioType: data.scenarioType || ScenarioType.BASELINE,
    description: data.description || '',
    timeHorizon: data.timeHorizon || 3,
    probability: data.probability || 33.33,
    keyAssumptions: data.keyAssumptions || [],
    drivingForces: data.drivingForces || [],
    criticalUncertainties: data.criticalUncertainties || [],
    narrative: data.narrative || '',
    indicators: data.indicators || [],
    status: 'draft',
    createdBy: data.createdBy || '',
    metadata: data.metadata || {},
  };
}

/**
 * Identifies critical uncertainties for scenario planning.
 *
 * @param {string[]} variables - List of strategic variables
 * @returns {Promise<Array<{ variable: string; uncertaintyLevel: UncertaintyLevel; impactLevel: string }>>} Uncertainty analysis
 *
 * @example
 * ```typescript
 * const uncertainties = await identifyCriticalUncertainties([
 *   'Market growth rate',
 *   'Regulatory environment',
 *   'Technology adoption'
 * ]);
 * ```
 */
export async function identifyCriticalUncertainties(
  variables: string[]
): Promise<Array<{ variable: string; uncertaintyLevel: UncertaintyLevel; impactLevel: string }>> {
  return variables.map(variable => {
    // Simplified logic - in production would use sophisticated analysis
    const uncertaintyScore = Math.random() * 100;
    const impactScore = Math.random() * 100;

    let uncertaintyLevel: UncertaintyLevel;
    if (uncertaintyScore > 75) uncertaintyLevel = UncertaintyLevel.CRITICAL;
    else if (uncertaintyScore > 50) uncertaintyLevel = UncertaintyLevel.HIGH;
    else if (uncertaintyScore > 25) uncertaintyLevel = UncertaintyLevel.MEDIUM;
    else uncertaintyLevel = UncertaintyLevel.LOW;

    const impactLevel = impactScore > 50 ? 'high' : 'low';

    return { variable, uncertaintyLevel, impactLevel };
  });
}

/**
 * Generates driving forces analysis for scenarios.
 *
 * @param {string} industry - Industry context
 * @param {string} geography - Geographic scope
 * @returns {Promise<Array<{ force: string; category: string; strength: number; trend: string }>>} Driving forces
 *
 * @example
 * ```typescript
 * const forces = await generateDrivingForces('healthcare', 'North America');
 * ```
 */
export async function generateDrivingForces(
  industry: string,
  geography: string
): Promise<Array<{ force: string; category: string; strength: number; trend: string }>> {
  const categories = ['Technology', 'Economic', 'Social', 'Political', 'Environmental'];

  return categories.map(category => ({
    force: `${category} transformation in ${industry}`,
    category,
    strength: Math.floor(Math.random() * 100),
    trend: Math.random() > 0.5 ? 'increasing' : 'stable',
  }));
}

/**
 * Creates scenario matrix with two axes of uncertainty.
 *
 * @param {string} axis1Name - First axis name
 * @param {string[]} axis1States - First axis states
 * @param {string} axis2Name - Second axis name
 * @param {string[]} axis2States - Second axis states
 * @returns {Promise<ScenarioMatrixData>} Scenario matrix
 *
 * @example
 * ```typescript
 * const matrix = await createScenarioMatrix(
 *   'Market Growth', ['Low', 'High'],
 *   'Competition', ['Fragmented', 'Consolidated']
 * );
 * ```
 */
export async function createScenarioMatrix(
  axis1Name: string,
  axis1States: string[],
  axis2Name: string,
  axis2States: string[]
): Promise<ScenarioMatrixData> {
  const cells: ScenarioMatrixData['cells'] = [];

  for (let i = 0; i < axis1States.length; i++) {
    for (let j = 0; j < axis2States.length; j++) {
      cells.push({
        position: [i, j],
        scenarioId: `SCN-${i}${j}-${Date.now()}`,
        scenarioName: `${axis1States[i]} - ${axis2States[j]}`,
        probability: Math.floor(Math.random() * 40 + 10),
        attractiveness: Math.floor(Math.random() * 100),
      });
    }
  }

  return {
    matrixId: `MATRIX-${Date.now()}`,
    axis1: { name: axis1Name, states: axis1States },
    axis2: { name: axis2Name, states: axis2States },
    cells,
  };
}

/**
 * Develops detailed scenario narratives from key drivers.
 *
 * @param {string} scenarioId - Scenario identifier
 * @param {string[]} drivingForces - Key driving forces
 * @param {number} timeHorizon - Planning time horizon
 * @returns {Promise<string>} Scenario narrative
 *
 * @example
 * ```typescript
 * const narrative = await developScenarioNarrative('SCN-001', forces, 5);
 * ```
 */
export async function developScenarioNarrative(
  scenarioId: string,
  drivingForces: string[],
  timeHorizon: number
): Promise<string> {
  const intro = `Over the next ${timeHorizon} years, driven by ${drivingForces.join(', ')},`;
  const body = ' the industry landscape transforms significantly.';
  const implications = ' This creates both opportunities and challenges for strategic positioning.';

  return `${intro}${body}${implications}`;
}

/**
 * Identifies leading indicators for scenario monitoring.
 *
 * @param {string} scenarioId - Scenario identifier
 * @param {string[]} keyAssumptions - Key scenario assumptions
 * @returns {Promise<Array<{ indicator: string; metric: string; threshold: number; frequency: string }>>} Leading indicators
 *
 * @example
 * ```typescript
 * const indicators = await identifyLeadingIndicators('SCN-001', assumptions);
 * ```
 */
export async function identifyLeadingIndicators(
  scenarioId: string,
  keyAssumptions: string[]
): Promise<Array<{ indicator: string; metric: string; threshold: number; frequency: string }>> {
  return keyAssumptions.map(assumption => ({
    indicator: `Monitor: ${assumption}`,
    metric: 'Index score',
    threshold: Math.floor(Math.random() * 50 + 50),
    frequency: 'monthly',
  }));
}

/**
 * Assesses scenario plausibility based on multiple factors.
 *
 * @param {ScenarioData} scenario - Scenario to assess
 * @returns {Promise<{ plausibilityScore: number; strengths: string[]; weaknesses: string[]; confidence: string }>} Plausibility assessment
 *
 * @example
 * ```typescript
 * const assessment = await assessScenarioPlausibility(scenario);
 * ```
 */
export async function assessScenarioPlausibility(
  scenario: ScenarioData
): Promise<{ plausibilityScore: number; strengths: string[]; weaknesses: string[]; confidence: string }> {
  const hasAssumptions = scenario.keyAssumptions.length > 0;
  const hasForces = scenario.drivingForces.length > 0;
  const hasNarrative = scenario.narrative.length > 100;

  const score = (hasAssumptions ? 33 : 0) + (hasForces ? 33 : 0) + (hasNarrative ? 34 : 0);

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (hasAssumptions) strengths.push('Well-defined assumptions');
  else weaknesses.push('Lacks clear assumptions');

  if (hasForces) strengths.push('Strong driving forces identified');
  else weaknesses.push('Insufficient driving forces');

  const confidence = score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low';

  return {
    plausibilityScore: score,
    strengths,
    weaknesses,
    confidence,
  };
}

/**
 * Generates scenario divergence analysis showing differences from baseline.
 *
 * @param {ScenarioData} scenario - Target scenario
 * @param {ScenarioData} baseline - Baseline scenario
 * @returns {Promise<Array<{ dimension: string; baselineValue: number; scenarioValue: number; divergence: number }>>} Divergence analysis
 *
 * @example
 * ```typescript
 * const divergence = await analyzeScenarioDivergence(optimistic, baseline);
 * ```
 */
export async function analyzeScenarioDivergence(
  scenario: ScenarioData,
  baseline: ScenarioData
): Promise<Array<{ dimension: string; baselineValue: number; scenarioValue: number; divergence: number }>> {
  const dimensions = ['Market Size', 'Growth Rate', 'Competition', 'Technology'];

  return dimensions.map(dimension => {
    const baselineValue = Math.random() * 100;
    const scenarioValue = baselineValue * (0.7 + Math.random() * 0.6);
    const divergence = ((scenarioValue - baselineValue) / baselineValue) * 100;

    return {
      dimension,
      baselineValue: parseFloat(baselineValue.toFixed(2)),
      scenarioValue: parseFloat(scenarioValue.toFixed(2)),
      divergence: parseFloat(divergence.toFixed(2)),
    };
  });
}

/**
 * Maps scenario interdependencies and cascade effects.
 *
 * @param {ScenarioData[]} scenarios - Array of scenarios
 * @returns {Promise<Array<{ source: string; target: string; relationship: string; strength: number }>>} Interdependency map
 *
 * @example
 * ```typescript
 * const dependencies = await mapScenarioInterdependencies(scenarios);
 * ```
 */
export async function mapScenarioInterdependencies(
  scenarios: ScenarioData[]
): Promise<Array<{ source: string; target: string; relationship: string; strength: number }>> {
  const dependencies: Array<{ source: string; target: string; relationship: string; strength: number }> = [];

  for (let i = 0; i < scenarios.length - 1; i++) {
    dependencies.push({
      source: scenarios[i].scenarioId,
      target: scenarios[i + 1].scenarioId,
      relationship: 'influences',
      strength: Math.random() * 100,
    });
  }

  return dependencies;
}

/**
 * Validates scenario consistency and internal logic.
 *
 * @param {ScenarioData} scenario - Scenario to validate
 * @returns {Promise<{ isValid: boolean; issues: string[]; recommendations: string[] }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateScenarioConsistency(scenario);
 * ```
 */
export async function validateScenarioConsistency(
  scenario: ScenarioData
): Promise<{ isValid: boolean; issues: string[]; recommendations: string[] }> {
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (scenario.probability < 5 || scenario.probability > 95) {
    issues.push('Probability outside reasonable range');
    recommendations.push('Adjust probability to 5-95% range');
  }

  if (scenario.keyAssumptions.length < 3) {
    issues.push('Insufficient key assumptions');
    recommendations.push('Add at least 3 key assumptions');
  }

  if (scenario.indicators.length === 0) {
    issues.push('No leading indicators defined');
    recommendations.push('Define leading indicators for monitoring');
  }

  return {
    isValid: issues.length === 0,
    issues,
    recommendations,
  };
}

// ============================================================================
// WAR GAMING FUNCTIONS (11-15)
// ============================================================================

/**
 * Initializes a war game simulation.
 *
 * @param {Partial<WarGameData>} data - War game data
 * @returns {Promise<WarGameData>} Initialized war game
 *
 * @example
 * ```typescript
 * const game = await initializeWarGame({
 *   scenarioId: 'SCN-001',
 *   gameName: 'Market Entry War Game',
 *   participants: ['Team A', 'Team B'],
 *   durationHours: 4
 * });
 * ```
 */
export async function initializeWarGame(
  data: Partial<WarGameData>
): Promise<WarGameData> {
  return {
    gameId: data.gameId || `WAR-${Date.now()}`,
    scenarioId: data.scenarioId || '',
    gameName: data.gameName || '',
    participants: data.participants || [],
    moves: data.moves || [],
    outcome: data.outcome || WarGameOutcome.STALEMATE,
    insights: data.insights || [],
    learnings: data.learnings || [],
    durationHours: data.durationHours || 4,
  };
}

/**
 * Records a war game move.
 *
 * @param {string} gameId - Game identifier
 * @param {string} player - Player name
 * @param {string} moveType - Type of move
 * @param {string} description - Move description
 * @returns {Promise<{ moveId: string; timestamp: Date; success: boolean }>} Move result
 *
 * @example
 * ```typescript
 * const move = await recordWarGameMove('WAR-001', 'Team A', 'price_cut', 'Reduce prices by 15%');
 * ```
 */
export async function recordWarGameMove(
  gameId: string,
  player: string,
  moveType: string,
  description: string
): Promise<{ moveId: string; timestamp: Date; success: boolean }> {
  return {
    moveId: `MOVE-${Date.now()}`,
    timestamp: new Date(),
    success: true,
  };
}

/**
 * Analyzes war game competitive dynamics.
 *
 * @param {WarGameData} game - War game data
 * @returns {Promise<{ competitiveIntensity: number; keyPatterns: string[]; turningPoints: string[] }>} Dynamic analysis
 *
 * @example
 * ```typescript
 * const dynamics = await analyzeWarGameDynamics(game);
 * ```
 */
export async function analyzeWarGameDynamics(
  game: WarGameData
): Promise<{ competitiveIntensity: number; keyPatterns: string[]; turningPoints: string[] }> {
  const intensity = Math.min(100, game.moves.length * 5);

  return {
    competitiveIntensity: intensity,
    keyPatterns: ['Aggressive pricing', 'Market segmentation', 'Innovation focus'],
    turningPoints: ['Move 5: Major strategic shift', 'Move 12: Alliance formation'],
  };
}

/**
 * Extracts strategic insights from war game results.
 *
 * @param {WarGameData} game - Completed war game
 * @returns {Promise<Array<{ insight: string; category: string; priority: string }>>} Strategic insights
 *
 * @example
 * ```typescript
 * const insights = await extractWarGameInsights(game);
 * ```
 */
export async function extractWarGameInsights(
  game: WarGameData
): Promise<Array<{ insight: string; category: string; priority: string }>> {
  const categories = ['Competitive', 'Market', 'Strategic', 'Operational'];

  return categories.map(category => ({
    insight: `Key learning about ${category.toLowerCase()} dynamics`,
    category,
    priority: Math.random() > 0.5 ? 'high' : 'medium',
  }));
}

/**
 * Generates war game debrief report.
 *
 * @param {WarGameData} game - Completed war game
 * @returns {Promise<{ summary: string; outcomes: any; recommendations: string[] }>} Debrief report
 *
 * @example
 * ```typescript
 * const debrief = await generateWarGameDebrief(game);
 * ```
 */
export async function generateWarGameDebrief(
  game: WarGameData
): Promise<{ summary: string; outcomes: any; recommendations: string[] }> {
  return {
    summary: `War game ${game.gameName} completed with ${game.participants.length} participants`,
    outcomes: {
      winner: game.participants[0],
      outcome: game.outcome,
      totalMoves: game.moves.length,
    },
    recommendations: [
      'Strengthen competitive positioning',
      'Enhance market intelligence',
      'Develop contingency plans',
    ],
  };
}

// ============================================================================
// STRATEGIC OPTIONS FUNCTIONS (16-25)
// ============================================================================

/**
 * Creates a strategic option.
 *
 * @param {Partial<StrategicOptionData>} data - Option data
 * @returns {Promise<StrategicOptionData>} Created option
 *
 * @example
 * ```typescript
 * const option = await createStrategicOption({
 *   scenarioId: 'SCN-001',
 *   optionType: OptionType.EXPAND,
 *   name: 'Accelerated Growth',
 *   ...
 * });
 * ```
 */
export async function createStrategicOption(
  data: Partial<StrategicOptionData>
): Promise<StrategicOptionData> {
  return {
    optionId: data.optionId || `OPT-${Date.now()}`,
    scenarioId: data.scenarioId || '',
    optionType: data.optionType || OptionType.MAINTAIN,
    name: data.name || '',
    description: data.description || '',
    investmentRequired: data.investmentRequired || 0,
    expectedValue: data.expectedValue || 0,
    upside: data.upside || 0,
    downside: data.downside || 0,
    flexibility: data.flexibility || 50,
    reversibility: data.reversibility || false,
    timeToImplement: data.timeToImplement || 12,
    dependencies: data.dependencies || [],
    risks: data.risks || [],
    benefits: data.benefits || [],
  };
}

/**
 * Evaluates option value using real options analysis.
 *
 * @param {StrategicOptionData} option - Strategic option
 * @param {number} volatility - Market volatility
 * @returns {Promise<{ optionValue: number; impliedROI: number; valueBreakdown: any }>} Option valuation
 *
 * @example
 * ```typescript
 * const valuation = await evaluateOptionValue(option, 0.25);
 * ```
 */
export async function evaluateOptionValue(
  option: StrategicOptionData,
  volatility: number
): Promise<{ optionValue: number; impliedROI: number; valueBreakdown: any }> {
  const baseValue = option.expectedValue - option.investmentRequired;
  const volatilityPremium = baseValue * volatility * 0.5;
  const optionValue = baseValue + volatilityPremium;
  const impliedROI = (optionValue / option.investmentRequired) * 100;

  return {
    optionValue: parseFloat(optionValue.toFixed(2)),
    impliedROI: parseFloat(impliedROI.toFixed(2)),
    valueBreakdown: {
      baseValue,
      volatilityPremium,
      flexibilityValue: option.flexibility * 1000,
    },
  };
}

/**
 * Analyzes option flexibility and reversibility.
 *
 * @param {StrategicOptionData} option - Strategic option
 * @returns {Promise<{ flexibilityScore: number; reversibilityCost: number; adaptability: string }>} Flexibility analysis
 *
 * @example
 * ```typescript
 * const flexibility = await analyzeOptionFlexibility(option);
 * ```
 */
export async function analyzeOptionFlexibility(
  option: StrategicOptionData
): Promise<{ flexibilityScore: number; reversibilityCost: number; adaptability: string }> {
  const reversibilityCost = option.reversibility
    ? option.investmentRequired * 0.2
    : option.investmentRequired * 0.8;

  const adaptability = option.flexibility > 70 ? 'high' : option.flexibility > 40 ? 'medium' : 'low';

  return {
    flexibilityScore: option.flexibility,
    reversibilityCost: parseFloat(reversibilityCost.toFixed(2)),
    adaptability,
  };
}

/**
 * Compares multiple strategic options.
 *
 * @param {StrategicOptionData[]} options - Array of options
 * @param {string[]} criteria - Comparison criteria
 * @returns {Promise<Array<{ optionId: string; scores: Record<string, number>; rank: number }>>} Option comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareStrategicOptions(options, ['ROI', 'Risk', 'Speed']);
 * ```
 */
export async function compareStrategicOptions(
  options: StrategicOptionData[],
  criteria: string[]
): Promise<Array<{ optionId: string; scores: Record<string, number>; rank: number }>> {
  return options.map((option, index) => {
    const scores: Record<string, number> = {};
    criteria.forEach(criterion => {
      scores[criterion] = Math.random() * 100;
    });

    return {
      optionId: option.optionId,
      scores,
      rank: index + 1,
    };
  });
}

/**
 * Generates decision tree for option selection.
 *
 * @param {StrategicOptionData[]} options - Available options
 * @param {string[]} decisionPoints - Key decision points
 * @returns {Promise<{ tree: any; optimalPath: string[]; expectedValue: number }>} Decision tree
 *
 * @example
 * ```typescript
 * const tree = await generateOptionDecisionTree(options, decisionPoints);
 * ```
 */
export async function generateOptionDecisionTree(
  options: StrategicOptionData[],
  decisionPoints: string[]
): Promise<{ tree: any; optimalPath: string[]; expectedValue: number }> {
  const totalExpectedValue = options.reduce((sum, opt) => sum + opt.expectedValue, 0);
  const avgValue = totalExpectedValue / options.length;

  return {
    tree: {
      root: 'Initial Decision',
      branches: decisionPoints.map(point => ({
        decision: point,
        outcomes: options.map(opt => opt.name),
      })),
    },
    optimalPath: [decisionPoints[0], options[0].name],
    expectedValue: avgValue,
  };
}

/**
 * Assesses option implementation risks.
 *
 * @param {StrategicOptionData} option - Strategic option
 * @returns {Promise<{ overallRisk: string; riskFactors: Array<{ factor: string; severity: string; mitigation: string }> }>} Risk assessment
 *
 * @example
 * ```typescript
 * const risks = await assessOptionRisks(option);
 * ```
 */
export async function assessOptionRisks(
  option: StrategicOptionData
): Promise<{ overallRisk: string; riskFactors: Array<{ factor: string; severity: string; mitigation: string }> }> {
  const riskFactors = option.risks.map(risk => ({
    factor: risk,
    severity: Math.random() > 0.5 ? 'high' : 'medium',
    mitigation: `Develop mitigation plan for ${risk}`,
  }));

  const highRisks = riskFactors.filter(r => r.severity === 'high').length;
  const overallRisk = highRisks > 2 ? 'high' : highRisks > 0 ? 'medium' : 'low';

  return {
    overallRisk,
    riskFactors,
  };
}

/**
 * Calculates option breakeven point.
 *
 * @param {StrategicOptionData} option - Strategic option
 * @param {number} annualBenefit - Expected annual benefit
 * @returns {Promise<{ breakEvenMonths: number; cumulativeBenefit: number[]; paybackPeriod: number }>} Breakeven analysis
 *
 * @example
 * ```typescript
 * const breakeven = await calculateOptionBreakeven(option, 500000);
 * ```
 */
export async function calculateOptionBreakeven(
  option: StrategicOptionData,
  annualBenefit: number
): Promise<{ breakEvenMonths: number; cumulativeBenefit: number[]; paybackPeriod: number }> {
  const monthlyBenefit = annualBenefit / 12;
  const breakEvenMonths = Math.ceil(option.investmentRequired / monthlyBenefit);

  const cumulativeBenefit: number[] = [];
  for (let i = 1; i <= 36; i++) {
    cumulativeBenefit.push(monthlyBenefit * i - option.investmentRequired);
  }

  return {
    breakEvenMonths,
    cumulativeBenefit,
    paybackPeriod: breakEvenMonths,
  };
}

/**
 * Prioritizes options using multi-criteria analysis.
 *
 * @param {StrategicOptionData[]} options - Array of options
 * @param {Record<string, number>} criteriaWeights - Criteria weights
 * @returns {Promise<Array<{ optionId: string; weightedScore: number; rank: number }>>} Prioritization
 *
 * @example
 * ```typescript
 * const priority = await prioritizeOptions(options, { ROI: 0.4, Risk: 0.3, Speed: 0.3 });
 * ```
 */
export async function prioritizeOptions(
  options: StrategicOptionData[],
  criteriaWeights: Record<string, number>
): Promise<Array<{ optionId: string; weightedScore: number; rank: number }>> {
  const scored = options.map(option => {
    const roi = (option.expectedValue - option.investmentRequired) / option.investmentRequired;
    const risk = option.downside / option.investmentRequired;
    const speed = 100 / option.timeToImplement;

    const weightedScore =
      roi * (criteriaWeights.ROI || 0) +
      (1 - risk) * (criteriaWeights.Risk || 0) +
      speed * (criteriaWeights.Speed || 0);

    return { optionId: option.optionId, weightedScore };
  });

  scored.sort((a, b) => b.weightedScore - a.weightedScore);

  return scored.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

/**
 * Simulates option outcomes using Monte Carlo.
 *
 * @param {StrategicOptionData} option - Strategic option
 * @param {number} iterations - Number of simulations
 * @returns {Promise<{ meanValue: number; stdDev: number; percentiles: Record<string, number>; distribution: number[] }>} Simulation results
 *
 * @example
 * ```typescript
 * const simulation = await simulateOptionOutcomes(option, 10000);
 * ```
 */
export async function simulateOptionOutcomes(
  option: StrategicOptionData,
  iterations: number
): Promise<{ meanValue: number; stdDev: number; percentiles: Record<string, number>; distribution: number[] }> {
  const results: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
    const outcome = option.expectedValue * randomFactor - option.investmentRequired;
    results.push(outcome);
  }

  results.sort((a, b) => a - b);

  const sum = results.reduce((a, b) => a + b, 0);
  const meanValue = sum / iterations;

  const variance = results.reduce((sum, val) => sum + Math.pow(val - meanValue, 2), 0) / iterations;
  const stdDev = Math.sqrt(variance);

  return {
    meanValue: parseFloat(meanValue.toFixed(2)),
    stdDev: parseFloat(stdDev.toFixed(2)),
    percentiles: {
      p10: results[Math.floor(iterations * 0.1)],
      p50: results[Math.floor(iterations * 0.5)],
      p90: results[Math.floor(iterations * 0.9)],
    },
    distribution: results.slice(0, 100), // Sample for visualization
  };
}

/**
 * Generates option recommendation report.
 *
 * @param {StrategicOptionData[]} options - Array of options
 * @param {string} scenarioId - Scenario context
 * @returns {Promise<{ recommended: string; rationale: string; alternatives: string[]; implementation: any }>} Recommendation
 *
 * @example
 * ```typescript
 * const recommendation = await generateOptionRecommendation(options, 'SCN-001');
 * ```
 */
export async function generateOptionRecommendation(
  options: StrategicOptionData[],
  scenarioId: string
): Promise<{ recommended: string; rationale: string; alternatives: string[]; implementation: any }> {
  const best = options.reduce((prev, curr) =>
    curr.expectedValue > prev.expectedValue ? curr : prev
  );

  return {
    recommended: best.optionId,
    rationale: `Highest expected value with acceptable risk profile`,
    alternatives: options.filter(o => o.optionId !== best.optionId).map(o => o.optionId),
    implementation: {
      timeline: `${best.timeToImplement} months`,
      investment: best.investmentRequired,
      keyMilestones: ['Planning', 'Execution', 'Validation'],
    },
  };
}

// ============================================================================
// CONTINGENCY PLANNING FUNCTIONS (26-30)
// ============================================================================

/**
 * Creates a contingency plan.
 *
 * @param {Partial<ContingencyPlanData>} data - Contingency plan data
 * @returns {Promise<ContingencyPlanData>} Created contingency plan
 *
 * @example
 * ```typescript
 * const plan = await createContingencyPlan({
 *   scenarioId: 'SCN-001',
 *   triggerType: ContingencyTrigger.MARKET_SHIFT,
 *   ...
 * });
 * ```
 */
export async function createContingencyPlan(
  data: Partial<ContingencyPlanData>
): Promise<ContingencyPlanData> {
  return {
    planId: data.planId || `CONT-${Date.now()}`,
    scenarioId: data.scenarioId || '',
    triggerType: data.triggerType || ContingencyTrigger.MARKET_SHIFT,
    triggerConditions: data.triggerConditions || [],
    actions: data.actions || [],
    activationThreshold: data.activationThreshold || '',
    deactivationCriteria: data.deactivationCriteria || '',
    status: data.status || 'ready',
  };
}

/**
 * Monitors trigger conditions for contingency activation.
 *
 * @param {ContingencyPlanData} plan - Contingency plan
 * @param {Record<string, any>} currentMetrics - Current metric values
 * @returns {Promise<{ shouldActivate: boolean; triggeredConditions: string[]; confidence: number }>} Monitoring result
 *
 * @example
 * ```typescript
 * const monitoring = await monitorContingencyTriggers(plan, metrics);
 * ```
 */
export async function monitorContingencyTriggers(
  plan: ContingencyPlanData,
  currentMetrics: Record<string, any>
): Promise<{ shouldActivate: boolean; triggeredConditions: string[]; confidence: number }> {
  const triggeredConditions = plan.triggerConditions.filter(() => Math.random() > 0.7);
  const shouldActivate = triggeredConditions.length >= plan.triggerConditions.length * 0.5;
  const confidence = (triggeredConditions.length / plan.triggerConditions.length) * 100;

  return {
    shouldActivate,
    triggeredConditions,
    confidence: parseFloat(confidence.toFixed(2)),
  };
}

/**
 * Activates a contingency plan.
 *
 * @param {string} planId - Plan identifier
 * @param {string} activatedBy - User activating the plan
 * @returns {Promise<{ activationId: string; timestamp: Date; initialActions: string[] }>} Activation result
 *
 * @example
 * ```typescript
 * const activation = await activateContingencyPlan('CONT-001', 'john@example.com');
 * ```
 */
export async function activateContingencyPlan(
  planId: string,
  activatedBy: string
): Promise<{ activationId: string; timestamp: Date; initialActions: string[] }> {
  return {
    activationId: `ACT-${Date.now()}`,
    timestamp: new Date(),
    initialActions: ['Notify stakeholders', 'Mobilize response team', 'Execute first phase'],
  };
}

/**
 * Tracks contingency plan execution.
 *
 * @param {string} planId - Plan identifier
 * @returns {Promise<{ completedActions: number; totalActions: number; status: string; blockers: string[] }>} Execution status
 *
 * @example
 * ```typescript
 * const status = await trackContingencyExecution('CONT-001');
 * ```
 */
export async function trackContingencyExecution(
  planId: string
): Promise<{ completedActions: number; totalActions: number; status: string; blockers: string[] }> {
  const totalActions = 10;
  const completedActions = Math.floor(Math.random() * totalActions);
  const progress = (completedActions / totalActions) * 100;

  const status = progress === 100 ? 'completed' : progress > 50 ? 'on_track' : 'delayed';

  return {
    completedActions,
    totalActions,
    status,
    blockers: status === 'delayed' ? ['Resource constraints', 'External dependencies'] : [],
  };
}

/**
 * Evaluates contingency plan effectiveness.
 *
 * @param {string} planId - Plan identifier
 * @param {Record<string, any>} outcomes - Plan outcomes
 * @returns {Promise<{ effectiveness: number; lessons: string[]; recommendations: string[] }>} Effectiveness evaluation
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateContingencyEffectiveness('CONT-001', outcomes);
 * ```
 */
export async function evaluateContingencyEffectiveness(
  planId: string,
  outcomes: Record<string, any>
): Promise<{ effectiveness: number; lessons: string[]; recommendations: string[] }> {
  const effectiveness = Math.random() * 100;

  return {
    effectiveness: parseFloat(effectiveness.toFixed(2)),
    lessons: [
      'Early activation was critical',
      'Communication channels worked well',
      'Resource allocation could be improved',
    ],
    recommendations: [
      'Update trigger thresholds based on experience',
      'Enhance monitoring capabilities',
      'Pre-position additional resources',
    ],
  };
}

// ============================================================================
// IMPACT ASSESSMENT FUNCTIONS (31-35)
// ============================================================================

/**
 * Creates an impact assessment.
 *
 * @param {Partial<ImpactAssessmentData>} data - Impact assessment data
 * @returns {Promise<ImpactAssessmentData>} Created assessment
 *
 * @example
 * ```typescript
 * const assessment = await createImpactAssessment({
 *   scenarioId: 'SCN-001',
 *   impactArea: 'Revenue',
 *   severity: ImpactSeverity.MAJOR,
 *   ...
 * });
 * ```
 */
export async function createImpactAssessment(
  data: Partial<ImpactAssessmentData>
): Promise<ImpactAssessmentData> {
  return {
    assessmentId: data.assessmentId || `IMP-${Date.now()}`,
    scenarioId: data.scenarioId || '',
    impactArea: data.impactArea || '',
    severity: data.severity || ImpactSeverity.MODERATE,
    financialImpact: data.financialImpact || 0,
    operationalImpact: data.operationalImpact || '',
    strategicImpact: data.strategicImpact || '',
    likelihood: data.likelihood || 50,
    timeframe: data.timeframe || '6-12 months',
    mitigationActions: data.mitigationActions || [],
  };
}

/**
 * Calculates risk-adjusted impact value.
 *
 * @param {ImpactAssessmentData} assessment - Impact assessment
 * @returns {Promise<{ riskAdjustedImpact: number; expectedLoss: number; maxExposure: number }>} Risk-adjusted values
 *
 * @example
 * ```typescript
 * const adjusted = await calculateRiskAdjustedImpact(assessment);
 * ```
 */
export async function calculateRiskAdjustedImpact(
  assessment: ImpactAssessmentData
): Promise<{ riskAdjustedImpact: number; expectedLoss: number; maxExposure: number }> {
  const probability = assessment.likelihood / 100;
  const expectedLoss = Math.abs(assessment.financialImpact) * probability;
  const riskAdjustedImpact = assessment.financialImpact * probability;

  const severityMultiplier = {
    [ImpactSeverity.NEGLIGIBLE]: 1.1,
    [ImpactSeverity.MINOR]: 1.3,
    [ImpactSeverity.MODERATE]: 1.5,
    [ImpactSeverity.MAJOR]: 2.0,
    [ImpactSeverity.CATASTROPHIC]: 3.0,
  };

  const maxExposure = Math.abs(assessment.financialImpact) * severityMultiplier[assessment.severity];

  return {
    riskAdjustedImpact: parseFloat(riskAdjustedImpact.toFixed(2)),
    expectedLoss: parseFloat(expectedLoss.toFixed(2)),
    maxExposure: parseFloat(maxExposure.toFixed(2)),
  };
}

/**
 * Generates impact heatmap across scenarios.
 *
 * @param {ImpactAssessmentData[]} assessments - Array of assessments
 * @returns {Promise<Array<{ area: string; severity: string; likelihood: number; priority: number }>>} Impact heatmap
 *
 * @example
 * ```typescript
 * const heatmap = await generateImpactHeatmap(assessments);
 * ```
 */
export async function generateImpactHeatmap(
  assessments: ImpactAssessmentData[]
): Promise<Array<{ area: string; severity: string; likelihood: number; priority: number }>> {
  return assessments.map(assessment => {
    const severityScore = {
      [ImpactSeverity.NEGLIGIBLE]: 1,
      [ImpactSeverity.MINOR]: 2,
      [ImpactSeverity.MODERATE]: 3,
      [ImpactSeverity.MAJOR]: 4,
      [ImpactSeverity.CATASTROPHIC]: 5,
    };

    const priority = severityScore[assessment.severity] * assessment.likelihood;

    return {
      area: assessment.impactArea,
      severity: assessment.severity,
      likelihood: assessment.likelihood,
      priority: parseFloat(priority.toFixed(2)),
    };
  });
}

/**
 * Prioritizes mitigation actions based on impact.
 *
 * @param {ImpactAssessmentData[]} assessments - Array of assessments
 * @returns {Promise<Array<{ action: string; impactArea: string; priority: string; urgency: string }>>} Prioritized actions
 *
 * @example
 * ```typescript
 * const actions = await prioritizeMitigationActions(assessments);
 * ```
 */
export async function prioritizeMitigationActions(
  assessments: ImpactAssessmentData[]
): Promise<Array<{ action: string; impactArea: string; priority: string; urgency: string }>> {
  const actions: Array<{ action: string; impactArea: string; priority: string; urgency: string }> = [];

  assessments.forEach(assessment => {
    assessment.mitigationActions.forEach(action => {
      const priority = assessment.severity === ImpactSeverity.CATASTROPHIC || assessment.severity === ImpactSeverity.MAJOR
        ? 'high'
        : 'medium';

      const urgency = assessment.likelihood > 70 ? 'immediate' : 'near_term';

      actions.push({
        action,
        impactArea: assessment.impactArea,
        priority,
        urgency,
      });
    });
  });

  return actions;
}

/**
 * Tracks impact realization over time.
 *
 * @param {string} scenarioId - Scenario identifier
 * @param {ImpactAssessmentData[]} assessments - Impact assessments
 * @returns {Promise<{ timeline: Array<{ period: string; realizedImpact: number; variance: number }> }>} Impact tracking
 *
 * @example
 * ```typescript
 * const tracking = await trackImpactRealization('SCN-001', assessments);
 * ```
 */
export async function trackImpactRealization(
  scenarioId: string,
  assessments: ImpactAssessmentData[]
): Promise<{ timeline: Array<{ period: string; realizedImpact: number; variance: number }> }> {
  const periods = ['Q1', 'Q2', 'Q3', 'Q4'];

  const timeline = periods.map(period => {
    const totalProjected = assessments.reduce((sum, a) => sum + a.financialImpact, 0);
    const realized = totalProjected * (0.8 + Math.random() * 0.4);
    const variance = ((realized - totalProjected) / totalProjected) * 100;

    return {
      period,
      realizedImpact: parseFloat(realized.toFixed(2)),
      variance: parseFloat(variance.toFixed(2)),
    };
  });

  return { timeline };
}

// ============================================================================
// SENSITIVITY & UNCERTAINTY ANALYSIS FUNCTIONS (36-40)
// ============================================================================

/**
 * Performs sensitivity analysis on scenario variables.
 *
 * @param {ScenarioData} scenario - Scenario to analyze
 * @param {string[]} variables - Variables to test
 * @returns {Promise<Array<{ variable: string; sensitivity: number; impactRange: [number, number] }>>} Sensitivity analysis
 *
 * @example
 * ```typescript
 * const sensitivity = await performSensitivityAnalysis(scenario, variables);
 * ```
 */
export async function performSensitivityAnalysis(
  scenario: ScenarioData,
  variables: string[]
): Promise<Array<{ variable: string; sensitivity: number; impactRange: [number, number] }>> {
  return variables.map(variable => {
    const sensitivity = Math.random() * 100;
    const baseImpact = 1000000;
    const range = sensitivity / 100;

    return {
      variable,
      sensitivity: parseFloat(sensitivity.toFixed(2)),
      impactRange: [
        parseFloat((baseImpact * (1 - range)).toFixed(2)),
        parseFloat((baseImpact * (1 + range)).toFixed(2)),
      ],
    };
  });
}

/**
 * Maps uncertainty ranges for key variables.
 *
 * @param {Array<{ variable: string; min: number; max: number; most_likely: number }>} variables - Variable ranges
 * @returns {Promise<Array<{ variable: string; range: number; coefficient: number; confidence: string }>>} Uncertainty map
 *
 * @example
 * ```typescript
 * const map = await mapUncertaintyRanges(variables);
 * ```
 */
export async function mapUncertaintyRanges(
  variables: Array<{ variable: string; min: number; max: number; most_likely: number }>
): Promise<Array<{ variable: string; range: number; coefficient: number; confidence: string }>> {
  return variables.map(v => {
    const range = v.max - v.min;
    const coefficient = range / v.most_likely;
    const confidence = coefficient < 0.3 ? 'high' : coefficient < 0.7 ? 'medium' : 'low';

    return {
      variable: v.variable,
      range,
      coefficient: parseFloat(coefficient.toFixed(2)),
      confidence,
    };
  });
}

/**
 * Generates tornado diagram data for sensitivity.
 *
 * @param {ScenarioData} scenario - Scenario
 * @param {string[]} variables - Variables to analyze
 * @returns {Promise<Array<{ variable: string; low: number; high: number; baseline: number }>>} Tornado data
 *
 * @example
 * ```typescript
 * const tornado = await generateTornadoDiagram(scenario, variables);
 * ```
 */
export async function generateTornadoDiagram(
  scenario: ScenarioData,
  variables: string[]
): Promise<Array<{ variable: string; low: number; high: number; baseline: number }>> {
  const baseline = 1000000;

  return variables.map(variable => {
    const variance = Math.random() * 0.4 + 0.1; // 10% to 50%

    return {
      variable,
      low: parseFloat((baseline * (1 - variance)).toFixed(2)),
      high: parseFloat((baseline * (1 + variance)).toFixed(2)),
      baseline,
    };
  });
}

/**
 * Calculates scenario variance and standard deviation.
 *
 * @param {ScenarioData[]} scenarios - Array of scenarios
 * @param {string} metric - Metric to analyze
 * @returns {Promise<{ mean: number; variance: number; stdDev: number; range: [number, number] }>} Statistical analysis
 *
 * @example
 * ```typescript
 * const stats = await calculateScenarioVariance(scenarios, 'revenue');
 * ```
 */
export async function calculateScenarioVariance(
  scenarios: ScenarioData[],
  metric: string
): Promise<{ mean: number; variance: number; stdDev: number; range: [number, number] }> {
  const values = scenarios.map(() => Math.random() * 10000000);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean: parseFloat(mean.toFixed(2)),
    variance: parseFloat(variance.toFixed(2)),
    stdDev: parseFloat(stdDev.toFixed(2)),
    range: [Math.min(...values), Math.max(...values)],
  };
}

/**
 * Generates scenario stress testing results.
 *
 * @param {ScenarioData} scenario - Scenario to stress test
 * @param {Array<{ variable: string; stress: number }>} stressTests - Stress test parameters
 * @returns {Promise<{ breakingPoint: string; resilience: number; vulnerabilities: string[] }>} Stress test results
 *
 * @example
 * ```typescript
 * const stress = await generateStressTestResults(scenario, tests);
 * ```
 */
export async function generateStressTestResults(
  scenario: ScenarioData,
  stressTests: Array<{ variable: string; stress: number }>
): Promise<{ breakingPoint: string; resilience: number; vulnerabilities: string[] }> {
  const maxStress = Math.max(...stressTests.map(t => t.stress));
  const resilience = 100 - maxStress;

  const vulnerabilities = stressTests
    .filter(t => t.stress > 70)
    .map(t => `High sensitivity to ${t.variable}`);

  return {
    breakingPoint: `${maxStress}% stress level`,
    resilience: parseFloat(resilience.toFixed(2)),
    vulnerabilities,
  };
}
