/**
 * LOC: CONS-TAL-MGT-001
 * File: /reuse/server/consulting/talent-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/talent.service.ts
 *   - backend/consulting/workforce-planning.controller.ts
 *   - backend/consulting/succession.service.ts
 */

/**
 * File: /reuse/server/consulting/talent-management-kit.ts
 * Locator: WC-CONS-TALENT-001
 * Purpose: Enterprise-grade Talent Management Kit - workforce planning, succession, competency frameworks, assessments, engagement, retention
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, talent controllers, HR analytics processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 43 production-ready functions for talent management competing with McKinsey, BCG, Bain HR consulting tools
 *
 * LLM Context: Comprehensive talent management utilities for production-ready management consulting applications.
 * Provides workforce planning, succession planning, competency framework design, talent assessment, engagement surveys,
 * retention analysis, learning development plans, skills gap analysis, high-potential identification, performance calibration,
 * talent pipeline analytics, and diversity & inclusion metrics.
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
 * Talent tier classifications
 */
export enum TalentTier {
  TOP_PERFORMER = 'top_performer',
  HIGH_PERFORMER = 'high_performer',
  SOLID_PERFORMER = 'solid_performer',
  NEEDS_IMPROVEMENT = 'needs_improvement',
  UNDERPERFORMER = 'underperformer',
}

/**
 * Succession readiness levels
 */
export enum SuccessionReadiness {
  READY_NOW = 'ready_now',
  READY_1_2_YEARS = 'ready_1_2_years',
  READY_3_5_YEARS = 'ready_3_5_years',
  NOT_READY = 'not_ready',
  EMERGENCY_ONLY = 'emergency_only',
}

/**
 * Competency proficiency levels
 */
export enum ProficiencyLevel {
  EXPERT = 'expert',
  ADVANCED = 'advanced',
  INTERMEDIATE = 'intermediate',
  BASIC = 'basic',
  NOVICE = 'novice',
  NOT_APPLICABLE = 'not_applicable',
}

/**
 * Engagement survey sentiment
 */
export enum EngagementLevel {
  HIGHLY_ENGAGED = 'highly_engaged',
  ENGAGED = 'engaged',
  NEUTRAL = 'neutral',
  DISENGAGED = 'disengaged',
  HIGHLY_DISENGAGED = 'highly_disengaged',
}

/**
 * Flight risk categories
 */
export enum FlightRisk {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Development need priority
 */
export enum DevelopmentPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Learning intervention types
 */
export enum InterventionType {
  FORMAL_TRAINING = 'formal_training',
  COACHING = 'coaching',
  MENTORING = 'mentoring',
  JOB_ROTATION = 'job_rotation',
  STRETCH_ASSIGNMENT = 'stretch_assignment',
  SELF_DIRECTED = 'self_directed',
  EXTERNAL_COURSE = 'external_course',
}

/**
 * Performance rating scale
 */
export enum PerformanceRating {
  EXCEPTIONAL = 'exceptional',
  EXCEEDS_EXPECTATIONS = 'exceeds_expectations',
  MEETS_EXPECTATIONS = 'meets_expectations',
  PARTIALLY_MEETS = 'partially_meets',
  DOES_NOT_MEET = 'does_not_meet',
}

/**
 * Potential assessment
 */
export enum PotentialRating {
  HIGH_POTENTIAL = 'high_potential',
  MEDIUM_POTENTIAL = 'medium_potential',
  LOW_POTENTIAL = 'low_potential',
  SPECIALIST = 'specialist',
}

/**
 * Workforce planning scenario
 */
export enum PlanningScenario {
  BASELINE = 'baseline',
  GROWTH = 'growth',
  CONTRACTION = 'contraction',
  TRANSFORMATION = 'transformation',
  ACQUISITION = 'acquisition',
}

/**
 * Talent review status
 */
export enum ReviewStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  ARCHIVED = 'archived',
}

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

interface WorkforcePlanData {
  planId: string;
  organizationId: string;
  departmentId?: string;
  scenario: PlanningScenario;
  planName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  currentHeadcount: number;
  targetHeadcount: number;
  hires: number;
  attrition: number;
  internalMoves: number;
  budget: number;
  status: ReviewStatus;
  assumptions: string[];
  metadata?: Record<string, any>;
}

interface SuccessionPlanData {
  successionId: string;
  organizationId: string;
  criticalPositionId: string;
  positionTitle: string;
  incumbentId?: string;
  readinessLevel: SuccessionReadiness;
  successors: Array<{ employeeId: string; readiness: SuccessionReadiness; developmentNeeds: string[] }>;
  riskOfLoss: FlightRisk;
  businessImpactScore: number;
  lastReviewDate: Date;
  nextReviewDate: Date;
  status: ReviewStatus;
  metadata?: Record<string, any>;
}

interface CompetencyFrameworkData {
  frameworkId: string;
  organizationId: string;
  name: string;
  description: string;
  applicableRoles: string[];
  competencies: Array<{
    competencyId: string;
    name: string;
    description: string;
    category: 'technical' | 'leadership' | 'behavioral' | 'functional';
    requiredLevel: ProficiencyLevel;
    weight: number;
  }>;
  effectiveDate: Date;
  isActive: boolean;
  metadata?: Record<string, any>;
}

interface TalentAssessmentData {
  assessmentId: string;
  organizationId: string;
  employeeId: string;
  assessmentType: 'performance' | 'potential' | '360' | 'competency' | 'psychometric';
  assessmentDate: Date;
  performanceRating?: PerformanceRating;
  potentialRating?: PotentialRating;
  talentTier: TalentTier;
  competencyScores: Array<{ competencyId: string; score: number; proficiency: ProficiencyLevel }>;
  strengths: string[];
  developmentAreas: string[];
  overallScore: number;
  assessorId: string;
  metadata?: Record<string, any>;
}

interface EngagementSurveyData {
  surveyId: string;
  organizationId: string;
  employeeId: string;
  surveyDate: Date;
  overallEngagement: EngagementLevel;
  engagementScore: number;
  dimensions: Array<{
    dimension: string;
    score: number;
    benchmark: number;
  }>;
  eNPS: number;
  comments?: string;
  flightRisk: FlightRisk;
  metadata?: Record<string, any>;
}

interface RetentionAnalysisData {
  analysisId: string;
  organizationId: string;
  employeeId: string;
  flightRisk: FlightRisk;
  riskScore: number;
  riskFactors: Array<{ factor: string; weight: number; score: number }>;
  tenureMonths: number;
  lastPromotion?: Date;
  lastRaise?: Date;
  engagementTrend: 'increasing' | 'stable' | 'declining';
  retentionRecommendations: string[];
  analysisDate: Date;
  metadata?: Record<string, any>;
}

interface DevelopmentPlanData {
  planId: string;
  organizationId: string;
  employeeId: string;
  planName: string;
  objectives: string[];
  competencyGaps: Array<{ competencyId: string; currentLevel: ProficiencyLevel; targetLevel: ProficiencyLevel; priority: DevelopmentPriority }>;
  interventions: Array<{
    interventionId: string;
    type: InterventionType;
    description: string;
    startDate: Date;
    endDate: Date;
    status: 'planned' | 'in_progress' | 'completed';
    cost?: number;
  }>;
  budget: number;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: ReviewStatus;
  metadata?: Record<string, any>;
}

interface SkillsGapData {
  gapId: string;
  organizationId: string;
  departmentId?: string;
  skillCategory: string;
  skillName: string;
  currentSupply: number;
  requiredDemand: number;
  gap: number;
  gapPercent: number;
  criticalityScore: number;
  timeToFill: number;
  closureStrategy: 'hire' | 'develop' | 'contract' | 'automate';
  analysisDate: Date;
  metadata?: Record<string, any>;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

/**
 * DTO for creating workforce plan
 */
export class CreateWorkforcePlanDto {
  @ApiProperty({ description: 'Organization ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Department ID', required: false })
  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ description: 'Planning scenario', enum: PlanningScenario })
  @IsEnum(PlanningScenario)
  @IsNotEmpty()
  scenario!: PlanningScenario;

  @ApiProperty({ description: 'Plan name', example: '2025 Growth Plan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  planName!: string;

  @ApiProperty({ description: 'Plan description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'Plan start date' })
  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty({ description: 'Plan end date' })
  @IsDate()
  @Type(() => Date)
  endDate!: Date;

  @ApiProperty({ description: 'Current headcount', example: 250 })
  @IsNumber()
  @Min(0)
  currentHeadcount!: number;

  @ApiProperty({ description: 'Target headcount', example: 300 })
  @IsNumber()
  @Min(0)
  targetHeadcount!: number;

  @ApiProperty({ description: 'Planned hires', example: 60 })
  @IsNumber()
  @Min(0)
  hires!: number;

  @ApiProperty({ description: 'Expected attrition', example: 10 })
  @IsNumber()
  @Min(0)
  attrition!: number;

  @ApiProperty({ description: 'Internal moves', example: 5 })
  @IsNumber()
  @Min(0)
  internalMoves!: number;

  @ApiProperty({ description: 'Budget allocation', example: 5000000 })
  @IsNumber()
  @Min(0)
  budget!: number;

  @ApiProperty({ description: 'Planning assumptions' })
  @IsArray()
  @IsString({ each: true })
  assumptions!: string[];

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for creating succession plan
 */
export class CreateSuccessionPlanDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Critical position ID' })
  @IsUUID()
  @IsNotEmpty()
  criticalPositionId!: string;

  @ApiProperty({ description: 'Position title', example: 'VP of Engineering' })
  @IsString()
  @IsNotEmpty()
  positionTitle!: string;

  @ApiProperty({ description: 'Current incumbent ID', required: false })
  @IsUUID()
  @IsOptional()
  incumbentId?: string;

  @ApiProperty({ description: 'Readiness level', enum: SuccessionReadiness })
  @IsEnum(SuccessionReadiness)
  @IsNotEmpty()
  readinessLevel!: SuccessionReadiness;

  @ApiProperty({ description: 'Potential successors' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  successors!: Array<{ employeeId: string; readiness: SuccessionReadiness; developmentNeeds: string[] }>;

  @ApiProperty({ description: 'Risk of incumbent loss', enum: FlightRisk })
  @IsEnum(FlightRisk)
  @IsNotEmpty()
  riskOfLoss!: FlightRisk;

  @ApiProperty({ description: 'Business impact score (0-100)', example: 95 })
  @IsNumber()
  @Min(0)
  @Max(100)
  businessImpactScore!: number;

  @ApiProperty({ description: 'Last review date' })
  @IsDate()
  @Type(() => Date)
  lastReviewDate!: Date;

  @ApiProperty({ description: 'Next review date' })
  @IsDate()
  @Type(() => Date)
  nextReviewDate!: Date;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for creating competency framework
 */
export class CreateCompetencyFrameworkDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Framework name', example: 'Engineering Competency Framework' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ description: 'Framework description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'Applicable roles' })
  @IsArray()
  @IsString({ each: true })
  applicableRoles!: string[];

  @ApiProperty({ description: 'Competency definitions' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  competencies!: Array<{
    competencyId: string;
    name: string;
    description: string;
    category: 'technical' | 'leadership' | 'behavioral' | 'functional';
    requiredLevel: ProficiencyLevel;
    weight: number;
  }>;

  @ApiProperty({ description: 'Effective date' })
  @IsDate()
  @Type(() => Date)
  effectiveDate!: Date;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for creating talent assessment
 */
export class CreateTalentAssessmentDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Employee ID' })
  @IsUUID()
  @IsNotEmpty()
  employeeId!: string;

  @ApiProperty({ description: 'Assessment type' })
  @IsEnum(['performance', 'potential', '360', 'competency', 'psychometric'])
  @IsNotEmpty()
  assessmentType!: 'performance' | 'potential' | '360' | 'competency' | 'psychometric';

  @ApiProperty({ description: 'Assessment date' })
  @IsDate()
  @Type(() => Date)
  assessmentDate!: Date;

  @ApiProperty({ description: 'Performance rating', enum: PerformanceRating, required: false })
  @IsEnum(PerformanceRating)
  @IsOptional()
  performanceRating?: PerformanceRating;

  @ApiProperty({ description: 'Potential rating', enum: PotentialRating, required: false })
  @IsEnum(PotentialRating)
  @IsOptional()
  potentialRating?: PotentialRating;

  @ApiProperty({ description: 'Talent tier', enum: TalentTier })
  @IsEnum(TalentTier)
  @IsNotEmpty()
  talentTier!: TalentTier;

  @ApiProperty({ description: 'Competency scores' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  competencyScores!: Array<{ competencyId: string; score: number; proficiency: ProficiencyLevel }>;

  @ApiProperty({ description: 'Key strengths' })
  @IsArray()
  @IsString({ each: true })
  strengths!: string[];

  @ApiProperty({ description: 'Development areas' })
  @IsArray()
  @IsString({ each: true })
  developmentAreas!: string[];

  @ApiProperty({ description: 'Overall assessment score (0-100)', example: 85 })
  @IsNumber()
  @Min(0)
  @Max(100)
  overallScore!: number;

  @ApiProperty({ description: 'Assessor ID' })
  @IsUUID()
  @IsNotEmpty()
  assessorId!: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for engagement survey
 */
export class CreateEngagementSurveyDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Employee ID' })
  @IsUUID()
  @IsNotEmpty()
  employeeId!: string;

  @ApiProperty({ description: 'Survey date' })
  @IsDate()
  @Type(() => Date)
  surveyDate!: Date;

  @ApiProperty({ description: 'Overall engagement level', enum: EngagementLevel })
  @IsEnum(EngagementLevel)
  @IsNotEmpty()
  overallEngagement!: EngagementLevel;

  @ApiProperty({ description: 'Engagement score (0-100)', example: 78 })
  @IsNumber()
  @Min(0)
  @Max(100)
  engagementScore!: number;

  @ApiProperty({ description: 'Engagement dimensions with scores' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  dimensions!: Array<{ dimension: string; score: number; benchmark: number }>;

  @ApiProperty({ description: 'Employee Net Promoter Score (-100 to 100)', example: 50 })
  @IsNumber()
  @Min(-100)
  @Max(100)
  eNPS!: number;

  @ApiProperty({ description: 'Optional comments', required: false })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiProperty({ description: 'Flight risk assessment', enum: FlightRisk })
  @IsEnum(FlightRisk)
  @IsNotEmpty()
  flightRisk!: FlightRisk;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for retention analysis
 */
export class CreateRetentionAnalysisDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Employee ID' })
  @IsUUID()
  @IsNotEmpty()
  employeeId!: string;

  @ApiProperty({ description: 'Flight risk level', enum: FlightRisk })
  @IsEnum(FlightRisk)
  @IsNotEmpty()
  flightRisk!: FlightRisk;

  @ApiProperty({ description: 'Risk score (0-100)', example: 65 })
  @IsNumber()
  @Min(0)
  @Max(100)
  riskScore!: number;

  @ApiProperty({ description: 'Risk factors with weights' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  riskFactors!: Array<{ factor: string; weight: number; score: number }>;

  @ApiProperty({ description: 'Tenure in months', example: 36 })
  @IsNumber()
  @Min(0)
  tenureMonths!: number;

  @ApiProperty({ description: 'Last promotion date', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lastPromotion?: Date;

  @ApiProperty({ description: 'Last raise date', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lastRaise?: Date;

  @ApiProperty({ description: 'Engagement trend' })
  @IsEnum(['increasing', 'stable', 'declining'])
  @IsNotEmpty()
  engagementTrend!: 'increasing' | 'stable' | 'declining';

  @ApiProperty({ description: 'Retention recommendations' })
  @IsArray()
  @IsString({ each: true })
  retentionRecommendations!: string[];

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for development plan
 */
export class CreateDevelopmentPlanDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Employee ID' })
  @IsUUID()
  @IsNotEmpty()
  employeeId!: string;

  @ApiProperty({ description: 'Plan name', example: 'Leadership Development Plan 2025' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  planName!: string;

  @ApiProperty({ description: 'Development objectives' })
  @IsArray()
  @IsString({ each: true })
  objectives!: string[];

  @ApiProperty({ description: 'Competency gaps to address' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  competencyGaps!: Array<{
    competencyId: string;
    currentLevel: ProficiencyLevel;
    targetLevel: ProficiencyLevel;
    priority: DevelopmentPriority;
  }>;

  @ApiProperty({ description: 'Learning interventions' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  interventions!: Array<{
    interventionId: string;
    type: InterventionType;
    description: string;
    startDate: Date;
    endDate: Date;
    status: 'planned' | 'in_progress' | 'completed';
    cost?: number;
  }>;

  @ApiProperty({ description: 'Total budget', example: 15000 })
  @IsNumber()
  @Min(0)
  budget!: number;

  @ApiProperty({ description: 'Plan start date' })
  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty({ description: 'Plan end date' })
  @IsDate()
  @Type(() => Date)
  endDate!: Date;

  @ApiProperty({ description: 'Current progress (0-100)', example: 35 })
  @IsNumber()
  @Min(0)
  @Max(100)
  progress!: number;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for skills gap analysis
 */
export class CreateSkillsGapDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Department ID', required: false })
  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ description: 'Skill category', example: 'Technical Skills' })
  @IsString()
  @IsNotEmpty()
  skillCategory!: string;

  @ApiProperty({ description: 'Skill name', example: 'Machine Learning' })
  @IsString()
  @IsNotEmpty()
  skillName!: string;

  @ApiProperty({ description: 'Current supply (number of employees)', example: 12 })
  @IsNumber()
  @Min(0)
  currentSupply!: number;

  @ApiProperty({ description: 'Required demand', example: 20 })
  @IsNumber()
  @Min(0)
  requiredDemand!: number;

  @ApiProperty({ description: 'Criticality score (0-100)', example: 85 })
  @IsNumber()
  @Min(0)
  @Max(100)
  criticalityScore!: number;

  @ApiProperty({ description: 'Time to fill gap (months)', example: 6 })
  @IsNumber()
  @Min(0)
  timeToFill!: number;

  @ApiProperty({ description: 'Gap closure strategy' })
  @IsEnum(['hire', 'develop', 'contract', 'automate'])
  @IsNotEmpty()
  closureStrategy!: 'hire' | 'develop' | 'contract' | 'automate';

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Workforce Plan Model
 */
export class WorkforcePlanModel extends Model<WorkforcePlanData> implements WorkforcePlanData {
  declare planId: string;
  declare organizationId: string;
  declare departmentId?: string;
  declare scenario: PlanningScenario;
  declare planName: string;
  declare description: string;
  declare startDate: Date;
  declare endDate: Date;
  declare currentHeadcount: number;
  declare targetHeadcount: number;
  declare hires: number;
  declare attrition: number;
  declare internalMoves: number;
  declare budget: number;
  declare status: ReviewStatus;
  declare assumptions: string[];
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof WorkforcePlanModel {
    WorkforcePlanModel.init(
      {
        planId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        departmentId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        scenario: {
          type: DataTypes.ENUM(...Object.values(PlanningScenario)),
          allowNull: false,
        },
        planName: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        currentHeadcount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        targetHeadcount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        hires: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        attrition: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        internalMoves: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        budget: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(ReviewStatus)),
          allowNull: false,
          defaultValue: ReviewStatus.DRAFT,
        },
        assumptions: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: false,
          defaultValue: [],
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'workforce_plans',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['departmentId'] },
          { fields: ['scenario'] },
          { fields: ['startDate', 'endDate'] },
        ],
      }
    );

    return WorkforcePlanModel;
  }
}

/**
 * Succession Plan Model
 */
export class SuccessionPlanModel extends Model<SuccessionPlanData> implements SuccessionPlanData {
  declare successionId: string;
  declare organizationId: string;
  declare criticalPositionId: string;
  declare positionTitle: string;
  declare incumbentId?: string;
  declare readinessLevel: SuccessionReadiness;
  declare successors: Array<{ employeeId: string; readiness: SuccessionReadiness; developmentNeeds: string[] }>;
  declare riskOfLoss: FlightRisk;
  declare businessImpactScore: number;
  declare lastReviewDate: Date;
  declare nextReviewDate: Date;
  declare status: ReviewStatus;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof SuccessionPlanModel {
    SuccessionPlanModel.init(
      {
        successionId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        criticalPositionId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        positionTitle: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        incumbentId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        readinessLevel: {
          type: DataTypes.ENUM(...Object.values(SuccessionReadiness)),
          allowNull: false,
        },
        successors: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
        },
        riskOfLoss: {
          type: DataTypes.ENUM(...Object.values(FlightRisk)),
          allowNull: false,
        },
        businessImpactScore: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
        },
        lastReviewDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        nextReviewDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(ReviewStatus)),
          allowNull: false,
          defaultValue: ReviewStatus.DRAFT,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'succession_plans',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['criticalPositionId'] },
          { fields: ['incumbentId'] },
          { fields: ['riskOfLoss'] },
          { fields: ['nextReviewDate'] },
        ],
      }
    );

    return SuccessionPlanModel;
  }
}

/**
 * Competency Framework Model
 */
export class CompetencyFrameworkModel extends Model<CompetencyFrameworkData> implements CompetencyFrameworkData {
  declare frameworkId: string;
  declare organizationId: string;
  declare name: string;
  declare description: string;
  declare applicableRoles: string[];
  declare competencies: Array<{
    competencyId: string;
    name: string;
    description: string;
    category: 'technical' | 'leadership' | 'behavioral' | 'functional';
    requiredLevel: ProficiencyLevel;
    weight: number;
  }>;
  declare effectiveDate: Date;
  declare isActive: boolean;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof CompetencyFrameworkModel {
    CompetencyFrameworkModel.init(
      {
        frameworkId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        applicableRoles: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
        },
        competencies: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        effectiveDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'competency_frameworks',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['isActive'] },
          { fields: ['effectiveDate'] },
        ],
      }
    );

    return CompetencyFrameworkModel;
  }
}

/**
 * Talent Assessment Model
 */
export class TalentAssessmentModel extends Model<TalentAssessmentData> implements TalentAssessmentData {
  declare assessmentId: string;
  declare organizationId: string;
  declare employeeId: string;
  declare assessmentType: 'performance' | 'potential' | '360' | 'competency' | 'psychometric';
  declare assessmentDate: Date;
  declare performanceRating?: PerformanceRating;
  declare potentialRating?: PotentialRating;
  declare talentTier: TalentTier;
  declare competencyScores: Array<{ competencyId: string; score: number; proficiency: ProficiencyLevel }>;
  declare strengths: string[];
  declare developmentAreas: string[];
  declare overallScore: number;
  declare assessorId: string;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof TalentAssessmentModel {
    TalentAssessmentModel.init(
      {
        assessmentId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        employeeId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        assessmentType: {
          type: DataTypes.ENUM('performance', 'potential', '360', 'competency', 'psychometric'),
          allowNull: false,
        },
        assessmentDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        performanceRating: {
          type: DataTypes.ENUM(...Object.values(PerformanceRating)),
          allowNull: true,
        },
        potentialRating: {
          type: DataTypes.ENUM(...Object.values(PotentialRating)),
          allowNull: true,
        },
        talentTier: {
          type: DataTypes.ENUM(...Object.values(TalentTier)),
          allowNull: false,
        },
        competencyScores: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        strengths: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: false,
          defaultValue: [],
        },
        developmentAreas: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: false,
          defaultValue: [],
        },
        overallScore: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
        },
        assessorId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'talent_assessments',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['employeeId'] },
          { fields: ['assessmentType'] },
          { fields: ['talentTier'] },
          { fields: ['assessmentDate'] },
        ],
      }
    );

    return TalentAssessmentModel;
  }
}

/**
 * Engagement Survey Model
 */
export class EngagementSurveyModel extends Model<EngagementSurveyData> implements EngagementSurveyData {
  declare surveyId: string;
  declare organizationId: string;
  declare employeeId: string;
  declare surveyDate: Date;
  declare overallEngagement: EngagementLevel;
  declare engagementScore: number;
  declare dimensions: Array<{ dimension: string; score: number; benchmark: number }>;
  declare eNPS: number;
  declare comments?: string;
  declare flightRisk: FlightRisk;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof EngagementSurveyModel {
    EngagementSurveyModel.init(
      {
        surveyId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        employeeId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        surveyDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        overallEngagement: {
          type: DataTypes.ENUM(...Object.values(EngagementLevel)),
          allowNull: false,
        },
        engagementScore: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
        },
        dimensions: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        eNPS: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        comments: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        flightRisk: {
          type: DataTypes.ENUM(...Object.values(FlightRisk)),
          allowNull: false,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'engagement_surveys',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['employeeId'] },
          { fields: ['surveyDate'] },
          { fields: ['overallEngagement'] },
          { fields: ['flightRisk'] },
        ],
      }
    );

    return EngagementSurveyModel;
  }
}

/**
 * Retention Analysis Model
 */
export class RetentionAnalysisModel extends Model<RetentionAnalysisData> implements RetentionAnalysisData {
  declare analysisId: string;
  declare organizationId: string;
  declare employeeId: string;
  declare flightRisk: FlightRisk;
  declare riskScore: number;
  declare riskFactors: Array<{ factor: string; weight: number; score: number }>;
  declare tenureMonths: number;
  declare lastPromotion?: Date;
  declare lastRaise?: Date;
  declare engagementTrend: 'increasing' | 'stable' | 'declining';
  declare retentionRecommendations: string[];
  declare analysisDate: Date;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof RetentionAnalysisModel {
    RetentionAnalysisModel.init(
      {
        analysisId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        employeeId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        flightRisk: {
          type: DataTypes.ENUM(...Object.values(FlightRisk)),
          allowNull: false,
        },
        riskScore: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
        },
        riskFactors: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        tenureMonths: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        lastPromotion: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        lastRaise: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        engagementTrend: {
          type: DataTypes.ENUM('increasing', 'stable', 'declining'),
          allowNull: false,
        },
        retentionRecommendations: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: false,
          defaultValue: [],
        },
        analysisDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'retention_analyses',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['employeeId'] },
          { fields: ['flightRisk'] },
          { fields: ['analysisDate'] },
        ],
      }
    );

    return RetentionAnalysisModel;
  }
}

/**
 * Development Plan Model
 */
export class DevelopmentPlanModel extends Model<DevelopmentPlanData> implements DevelopmentPlanData {
  declare planId: string;
  declare organizationId: string;
  declare employeeId: string;
  declare planName: string;
  declare objectives: string[];
  declare competencyGaps: Array<{
    competencyId: string;
    currentLevel: ProficiencyLevel;
    targetLevel: ProficiencyLevel;
    priority: DevelopmentPriority;
  }>;
  declare interventions: Array<{
    interventionId: string;
    type: InterventionType;
    description: string;
    startDate: Date;
    endDate: Date;
    status: 'planned' | 'in_progress' | 'completed';
    cost?: number;
  }>;
  declare budget: number;
  declare startDate: Date;
  declare endDate: Date;
  declare progress: number;
  declare status: ReviewStatus;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof DevelopmentPlanModel {
    DevelopmentPlanModel.init(
      {
        planId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        employeeId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        planName: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        objectives: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: false,
          defaultValue: [],
        },
        competencyGaps: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        interventions: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        budget: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        progress: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 0,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(ReviewStatus)),
          allowNull: false,
          defaultValue: ReviewStatus.DRAFT,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'development_plans',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['employeeId'] },
          { fields: ['status'] },
          { fields: ['startDate', 'endDate'] },
        ],
      }
    );

    return DevelopmentPlanModel;
  }
}

/**
 * Skills Gap Model
 */
export class SkillsGapModel extends Model<SkillsGapData> implements SkillsGapData {
  declare gapId: string;
  declare organizationId: string;
  declare departmentId?: string;
  declare skillCategory: string;
  declare skillName: string;
  declare currentSupply: number;
  declare requiredDemand: number;
  declare gap: number;
  declare gapPercent: number;
  declare criticalityScore: number;
  declare timeToFill: number;
  declare closureStrategy: 'hire' | 'develop' | 'contract' | 'automate';
  declare analysisDate: Date;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof SkillsGapModel {
    SkillsGapModel.init(
      {
        gapId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        departmentId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        skillCategory: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        skillName: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        currentSupply: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        requiredDemand: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        gap: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        gapPercent: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
        },
        criticalityScore: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
        },
        timeToFill: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        closureStrategy: {
          type: DataTypes.ENUM('hire', 'develop', 'contract', 'automate'),
          allowNull: false,
        },
        analysisDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'skills_gaps',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['departmentId'] },
          { fields: ['skillCategory'] },
          { fields: ['criticalityScore'] },
          { fields: ['analysisDate'] },
        ],
      }
    );

    return SkillsGapModel;
  }
}

// ============================================================================
// TALENT MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * 1. Create workforce plan
 */
export async function createWorkforcePlan(
  dto: CreateWorkforcePlanDto,
  transaction?: Transaction
): Promise<WorkforcePlanModel> {
  return await WorkforcePlanModel.create(
    {
      planId: '',
      ...dto,
      status: ReviewStatus.DRAFT,
    },
    { transaction }
  );
}

/**
 * 2. Calculate workforce gap
 */
export function calculateWorkforceGap(
  current: number,
  target: number,
  attrition: number
): { netGap: number; totalNeed: number; attritionImpact: number } {
  const attritionImpact = current * (attrition / 100);
  const netGap = target - current;
  const totalNeed = netGap + attritionImpact;

  return { netGap, totalNeed, attritionImpact };
}

/**
 * 3. Project headcount over time
 */
export function projectHeadcount(
  baseline: number,
  monthlyHires: number,
  monthlyAttritionRate: number,
  months: number
): Array<{ month: number; headcount: number; hires: number; attrition: number }> {
  const projections: Array<any> = [];
  let currentHeadcount = baseline;

  for (let month = 1; month <= months; month++) {
    const attrition = Math.round(currentHeadcount * monthlyAttritionRate);
    const hires = monthlyHires;
    currentHeadcount = currentHeadcount + hires - attrition;

    projections.push({ month, headcount: currentHeadcount, hires, attrition });
  }

  return projections;
}

/**
 * 4. Calculate span of control metrics
 */
export function calculateSpanOfControl(
  managers: number,
  directReports: number
): { avgSpan: number; recommendation: 'narrow' | 'optimal' | 'wide'; efficiency: number } {
  const avgSpan = managers > 0 ? directReports / managers : 0;

  let recommendation: 'narrow' | 'optimal' | 'wide';
  if (avgSpan < 5) {
    recommendation = 'narrow';
  } else if (avgSpan >= 5 && avgSpan <= 9) {
    recommendation = 'optimal';
  } else {
    recommendation = 'wide';
  }

  const efficiency = Math.min(100, (avgSpan / 7) * 100);

  return { avgSpan, recommendation, efficiency };
}

/**
 * 5. Create succession plan
 */
export async function createSuccessionPlan(
  dto: CreateSuccessionPlanDto,
  transaction?: Transaction
): Promise<SuccessionPlanModel> {
  return await SuccessionPlanModel.create(
    {
      successionId: '',
      ...dto,
      status: ReviewStatus.DRAFT,
    },
    { transaction }
  );
}

/**
 * 6. Calculate succession bench strength
 */
export function calculateBenchStrength(
  criticalPositions: number,
  readyNowSuccessors: number,
  ready1to2Successors: number
): { benchStrength: number; coverageRatio: number; riskLevel: 'low' | 'medium' | 'high' } {
  const totalReadySuccessors = readyNowSuccessors + ready1to2Successors * 0.7;
  const coverageRatio = criticalPositions > 0 ? totalReadySuccessors / criticalPositions : 0;
  const benchStrength = Math.min(100, coverageRatio * 100);

  let riskLevel: 'low' | 'medium' | 'high';
  if (coverageRatio >= 2) {
    riskLevel = 'low';
  } else if (coverageRatio >= 1) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }

  return { benchStrength, coverageRatio, riskLevel };
}

/**
 * 7. Identify succession gaps
 */
export async function identifySuccessionGaps(
  organizationId: string
): Promise<Array<{ positionId: string; title: string; successorCount: number; readyNow: number; gapSeverity: 'critical' | 'high' | 'medium' }>> {
  const plans = await SuccessionPlanModel.findAll({
    where: { organizationId, status: ReviewStatus.APPROVED },
  });

  return plans
    .map((plan) => {
      const readyNow = plan.successors.filter((s) => s.readiness === SuccessionReadiness.READY_NOW).length;
      const successorCount = plan.successors.length;

      let gapSeverity: 'critical' | 'high' | 'medium';
      if (readyNow === 0 && plan.businessImpactScore > 80) {
        gapSeverity = 'critical';
      } else if (readyNow < 2 && plan.businessImpactScore > 60) {
        gapSeverity = 'high';
      } else {
        gapSeverity = 'medium';
      }

      return {
        positionId: plan.criticalPositionId,
        title: plan.positionTitle,
        successorCount,
        readyNow,
        gapSeverity,
      };
    })
    .filter((gap) => gap.readyNow < 2)
    .sort((a, b) => {
      const severityOrder = { critical: 3, high: 2, medium: 1 };
      return severityOrder[b.gapSeverity] - severityOrder[a.gapSeverity];
    });
}

/**
 * 8. Create competency framework
 */
export async function createCompetencyFramework(
  dto: CreateCompetencyFrameworkDto,
  transaction?: Transaction
): Promise<CompetencyFrameworkModel> {
  return await CompetencyFrameworkModel.create(
    {
      frameworkId: '',
      ...dto,
      isActive: true,
    },
    { transaction }
  );
}

/**
 * 9. Calculate competency gap score
 */
export function calculateCompetencyGap(
  currentLevel: ProficiencyLevel,
  requiredLevel: ProficiencyLevel
): { gapScore: number; priority: DevelopmentPriority } {
  const proficiencyMap = {
    [ProficiencyLevel.NOVICE]: 1,
    [ProficiencyLevel.BASIC]: 2,
    [ProficiencyLevel.INTERMEDIATE]: 3,
    [ProficiencyLevel.ADVANCED]: 4,
    [ProficiencyLevel.EXPERT]: 5,
    [ProficiencyLevel.NOT_APPLICABLE]: 0,
  };

  const currentScore = proficiencyMap[currentLevel];
  const requiredScore = proficiencyMap[requiredLevel];
  const gapScore = Math.max(0, requiredScore - currentScore);

  let priority: DevelopmentPriority;
  if (gapScore >= 3) {
    priority = DevelopmentPriority.CRITICAL;
  } else if (gapScore === 2) {
    priority = DevelopmentPriority.HIGH;
  } else if (gapScore === 1) {
    priority = DevelopmentPriority.MEDIUM;
  } else {
    priority = DevelopmentPriority.LOW;
  }

  return { gapScore, priority };
}

/**
 * 10. Aggregate competency scores
 */
export function aggregateCompetencyScores(
  scores: Array<{ competencyId: string; score: number; weight: number }>
): { weightedAverage: number; totalWeight: number; distribution: Record<string, number> } {
  const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
  const weightedSum = scores.reduce((sum, s) => sum + s.score * s.weight, 0);
  const weightedAverage = totalWeight > 0 ? weightedSum / totalWeight : 0;

  const distribution: Record<string, number> = {
    expert: 0,
    advanced: 0,
    intermediate: 0,
    basic: 0,
    novice: 0,
  };

  for (const score of scores) {
    if (score.score >= 90) distribution.expert++;
    else if (score.score >= 75) distribution.advanced++;
    else if (score.score >= 60) distribution.intermediate++;
    else if (score.score >= 40) distribution.basic++;
    else distribution.novice++;
  }

  return { weightedAverage, totalWeight, distribution };
}

/**
 * 11. Create talent assessment
 */
export async function createTalentAssessment(
  dto: CreateTalentAssessmentDto,
  transaction?: Transaction
): Promise<TalentAssessmentModel> {
  return await TalentAssessmentModel.create(
    {
      assessmentId: '',
      ...dto,
    },
    { transaction }
  );
}

/**
 * 12. Build 9-box grid placement
 */
export function build9BoxGrid(
  performance: PerformanceRating,
  potential: PotentialRating
): { box: string; category: string; talentAction: string } {
  const performanceScore =
    performance === PerformanceRating.EXCEPTIONAL
      ? 3
      : performance === PerformanceRating.EXCEEDS_EXPECTATIONS
      ? 2
      : 1;

  const potentialScore =
    potential === PotentialRating.HIGH_POTENTIAL ? 3 : potential === PotentialRating.MEDIUM_POTENTIAL ? 2 : 1;

  const boxMap: Record<string, { category: string; talentAction: string }> = {
    '3-3': { category: 'Star / High Potential', talentAction: 'Accelerate development, retain at all costs' },
    '3-2': { category: 'Core Player', talentAction: 'Develop for current role excellence' },
    '3-1': { category: 'Specialist', talentAction: 'Leverage expertise, limited advancement' },
    '2-3': { category: 'Growth Employee', talentAction: 'Invest in development, monitor progress' },
    '2-2': { category: 'Solid Performer', talentAction: 'Maintain performance, selective development' },
    '2-1': { category: 'Effective Contributor', talentAction: 'Support in current role' },
    '1-3': { category: 'Inconsistent Player', talentAction: 'Coach for performance, reassess potential' },
    '1-2': { category: 'Dilemma', talentAction: 'Performance improvement plan required' },
    '1-1': { category: 'Low Performer', talentAction: 'Exit or significant intervention' },
  };

  const box = `${performanceScore}-${potentialScore}`;
  const result = boxMap[box] || { category: 'Unknown', talentAction: 'Review required' };

  return { box, ...result };
}

/**
 * 13. Calculate performance calibration
 */
export function calibratePerformanceRatings(
  ratings: Array<{ employeeId: string; rating: PerformanceRating; score: number }>,
  targetDistribution: Record<PerformanceRating, number>
): { calibratedRatings: Array<{ employeeId: string; original: PerformanceRating; calibrated: PerformanceRating }>; deviation: number } {
  const sorted = [...ratings].sort((a, b) => b.score - a.score);
  const total = sorted.length;

  const calibratedRatings: Array<any> = [];
  let currentIndex = 0;

  const ratingOrder = [
    PerformanceRating.EXCEPTIONAL,
    PerformanceRating.EXCEEDS_EXPECTATIONS,
    PerformanceRating.MEETS_EXPECTATIONS,
    PerformanceRating.PARTIALLY_MEETS,
    PerformanceRating.DOES_NOT_MEET,
  ];

  for (const rating of ratingOrder) {
    const targetCount = Math.round((targetDistribution[rating] / 100) * total);
    for (let i = 0; i < targetCount && currentIndex < sorted.length; i++) {
      calibratedRatings.push({
        employeeId: sorted[currentIndex].employeeId,
        original: sorted[currentIndex].rating,
        calibrated: rating,
      });
      currentIndex++;
    }
  }

  while (currentIndex < sorted.length) {
    calibratedRatings.push({
      employeeId: sorted[currentIndex].employeeId,
      original: sorted[currentIndex].rating,
      calibrated: PerformanceRating.MEETS_EXPECTATIONS,
    });
    currentIndex++;
  }

  const changes = calibratedRatings.filter((r) => r.original !== r.calibrated).length;
  const deviation = (changes / total) * 100;

  return { calibratedRatings, deviation };
}

/**
 * 14. Identify high potentials
 */
export async function identifyHighPotentials(
  organizationId: string,
  criteria: { minPerformanceScore: number; minPotentialRating: PotentialRating; minTenureMonths: number }
): Promise<Array<{ employeeId: string; score: number; talentTier: TalentTier; reasoning: string[] }>> {
  const assessments = await TalentAssessmentModel.findAll({
    where: {
      organizationId,
      overallScore: { [Op.gte]: criteria.minPerformanceScore },
      potentialRating: criteria.minPotentialRating,
    },
    order: [['overallScore', 'DESC']],
  });

  return assessments.map((assessment) => {
    const reasoning: string[] = [];
    if (assessment.overallScore >= 90) reasoning.push('Exceptional performance scores');
    if (assessment.potentialRating === PotentialRating.HIGH_POTENTIAL) reasoning.push('High potential rating');
    if (assessment.strengths.length >= 5) reasoning.push('Multiple validated strengths');

    return {
      employeeId: assessment.employeeId,
      score: Number(assessment.overallScore),
      talentTier: assessment.talentTier,
      reasoning,
    };
  });
}

/**
 * 15. Create engagement survey
 */
export async function createEngagementSurvey(
  dto: CreateEngagementSurveyDto,
  transaction?: Transaction
): Promise<EngagementSurveyModel> {
  return await EngagementSurveyModel.create(
    {
      surveyId: '',
      ...dto,
    },
    { transaction }
  );
}

/**
 * 16. Calculate engagement index
 */
export function calculateEngagementIndex(
  dimensions: Array<{ dimension: string; score: number }>
): { index: number; level: EngagementLevel; topDimensions: string[]; bottomDimensions: string[] } {
  const avgScore = dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length;

  let level: EngagementLevel;
  if (avgScore >= 80) level = EngagementLevel.HIGHLY_ENGAGED;
  else if (avgScore >= 65) level = EngagementLevel.ENGAGED;
  else if (avgScore >= 50) level = EngagementLevel.NEUTRAL;
  else if (avgScore >= 35) level = EngagementLevel.DISENGAGED;
  else level = EngagementLevel.HIGHLY_DISENGAGED;

  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const topDimensions = sorted.slice(0, 3).map((d) => d.dimension);
  const bottomDimensions = sorted.slice(-3).map((d) => d.dimension);

  return { index: avgScore, level, topDimensions, bottomDimensions };
}

/**
 * 17. Calculate eNPS (Employee Net Promoter Score)
 */
export function calculateENPS(
  scores: number[]
): { eNPS: number; promoters: number; passives: number; detractors: number; distribution: Record<string, number> } {
  const total = scores.length;
  const promoters = scores.filter((s) => s >= 9).length;
  const passives = scores.filter((s) => s >= 7 && s < 9).length;
  const detractors = scores.filter((s) => s < 7).length;

  const eNPS = total > 0 ? ((promoters - detractors) / total) * 100 : 0;

  const distribution = {
    promotersPercent: (promoters / total) * 100,
    passivesPercent: (passives / total) * 100,
    detractorsPercent: (detractors / total) * 100,
  };

  return { eNPS, promoters, passives, detractors, distribution };
}

/**
 * 18. Analyze engagement trends
 */
export async function analyzeEngagementTrends(
  organizationId: string,
  employeeId: string,
  months: number = 12
): Promise<{ trend: 'improving' | 'stable' | 'declining'; changePercent: number; surveys: number }> {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);

  const surveys = await EngagementSurveyModel.findAll({
    where: {
      organizationId,
      employeeId,
      surveyDate: { [Op.gte]: cutoffDate },
    },
    order: [['surveyDate', 'ASC']],
  });

  if (surveys.length < 2) {
    return { trend: 'stable', changePercent: 0, surveys: surveys.length };
  }

  const firstScore = Number(surveys[0].engagementScore);
  const lastScore = Number(surveys[surveys.length - 1].engagementScore);
  const changePercent = ((lastScore - firstScore) / firstScore) * 100;

  let trend: 'improving' | 'stable' | 'declining';
  if (changePercent > 5) trend = 'improving';
  else if (changePercent < -5) trend = 'declining';
  else trend = 'stable';

  return { trend, changePercent, surveys: surveys.length };
}

/**
 * 19. Create retention analysis
 */
export async function createRetentionAnalysis(
  dto: CreateRetentionAnalysisDto,
  transaction?: Transaction
): Promise<RetentionAnalysisModel> {
  return await RetentionAnalysisModel.create(
    {
      analysisId: '',
      ...dto,
      analysisDate: new Date(),
    },
    { transaction }
  );
}

/**
 * 20. Calculate flight risk score
 */
export function calculateFlightRiskScore(
  factors: Array<{ factor: string; weight: number; score: number }>
): { riskScore: number; flightRisk: FlightRisk; topFactors: Array<{ factor: string; contribution: number }> } {
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const weightedScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0);
  const riskScore = totalWeight > 0 ? weightedScore / totalWeight : 0;

  let flightRisk: FlightRisk;
  if (riskScore >= 75) flightRisk = FlightRisk.CRITICAL;
  else if (riskScore >= 60) flightRisk = FlightRisk.HIGH;
  else if (riskScore >= 40) flightRisk = FlightRisk.MODERATE;
  else flightRisk = FlightRisk.LOW;

  const topFactors = factors
    .map((f) => ({ factor: f.factor, contribution: f.score * f.weight }))
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 5);

  return { riskScore, flightRisk, topFactors };
}

/**
 * 21. Predict voluntary attrition
 */
export function predictVoluntaryAttrition(
  indicators: {
    engagementScore: number;
    tenureMonths: number;
    timeSinceLastPromotion: number;
    timeSinceLastRaise: number;
    performanceRating: PerformanceRating;
  }
): { attritionProbability: number; primaryReasons: string[]; recommendedActions: string[] } {
  let probability = 0;

  // Engagement impact
  if (indicators.engagementScore < 50) probability += 40;
  else if (indicators.engagementScore < 65) probability += 20;

  // Tenure impact (higher risk in early tenure and long tenure)
  if (indicators.tenureMonths < 12) probability += 15;
  else if (indicators.tenureMonths > 60) probability += 10;

  // Promotion stagnation
  if (indicators.timeSinceLastPromotion > 36) probability += 15;
  else if (indicators.timeSinceLastPromotion > 24) probability += 10;

  // Compensation stagnation
  if (indicators.timeSinceLastRaise > 18) probability += 10;
  else if (indicators.timeSinceLastRaise > 12) probability += 5;

  // Performance paradox (high performers more likely to leave if not progressing)
  if (
    (indicators.performanceRating === PerformanceRating.EXCEPTIONAL ||
      indicators.performanceRating === PerformanceRating.EXCEEDS_EXPECTATIONS) &&
    indicators.timeSinceLastPromotion > 24
  ) {
    probability += 15;
  }

  const primaryReasons: string[] = [];
  const recommendedActions: string[] = [];

  if (indicators.engagementScore < 50) {
    primaryReasons.push('Low engagement');
    recommendedActions.push('Conduct stay interview');
  }
  if (indicators.timeSinceLastPromotion > 24) {
    primaryReasons.push('Career stagnation');
    recommendedActions.push('Discuss career path and advancement opportunities');
  }
  if (indicators.timeSinceLastRaise > 12) {
    primaryReasons.push('Compensation concerns');
    recommendedActions.push('Review compensation against market');
  }

  return { attritionProbability: Math.min(100, probability), primaryReasons, recommendedActions };
}

/**
 * 22. Calculate retention cost impact
 */
export function calculateRetentionCostImpact(
  salary: number,
  replacementCostMultiplier: number = 1.5,
  productivityLossMonths: number = 3
): { replacementCost: number; productivityLoss: number; totalImpact: number } {
  const replacementCost = salary * replacementCostMultiplier;
  const monthlyProductivity = salary / 12;
  const productivityLoss = monthlyProductivity * productivityLossMonths;
  const totalImpact = replacementCost + productivityLoss;

  return { replacementCost, productivityLoss, totalImpact };
}

/**
 * 23. Create development plan
 */
export async function createDevelopmentPlan(
  dto: CreateDevelopmentPlanDto,
  transaction?: Transaction
): Promise<DevelopmentPlanModel> {
  return await DevelopmentPlanModel.create(
    {
      planId: '',
      ...dto,
      status: ReviewStatus.DRAFT,
    },
    { transaction }
  );
}

/**
 * 24. Prioritize development interventions
 */
export function prioritizeDevelopmentInterventions(
  gaps: Array<{ competency: string; gap: number; businessImpact: number; urgency: number }>
): Array<{ competency: string; priorityScore: number; rank: number; recommendedIntervention: InterventionType }> {
  const prioritized = gaps
    .map((gap) => {
      const priorityScore = gap.gap * 0.3 + gap.businessImpact * 0.4 + gap.urgency * 0.3;

      let recommendedIntervention: InterventionType;
      if (gap.gap >= 3 && gap.urgency > 70) {
        recommendedIntervention = InterventionType.FORMAL_TRAINING;
      } else if (gap.businessImpact > 80) {
        recommendedIntervention = InterventionType.COACHING;
      } else if (gap.gap === 1) {
        recommendedIntervention = InterventionType.SELF_DIRECTED;
      } else {
        recommendedIntervention = InterventionType.MENTORING;
      }

      return { competency: gap.competency, priorityScore, rank: 0, recommendedIntervention };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  return prioritized;
}

/**
 * 25. Calculate development ROI
 */
export function calculateDevelopmentROI(
  investment: { trainingCost: number; timeInvestmentHours: number; hourlyRate: number },
  outcomes: { productivityGain: number; performanceImprovement: number; retentionImpact: number }
): { totalCost: number; totalBenefit: number; roi: number; paybackMonths: number } {
  const totalCost = investment.trainingCost + investment.timeInvestmentHours * investment.hourlyRate;

  const annualBenefit = outcomes.productivityGain + outcomes.performanceImprovement + outcomes.retentionImpact;
  const totalBenefit = annualBenefit;

  const roi = totalCost > 0 ? ((totalBenefit - totalCost) / totalCost) * 100 : 0;
  const paybackMonths = totalBenefit > 0 ? (totalCost / totalBenefit) * 12 : 0;

  return { totalCost, totalBenefit, roi, paybackMonths };
}

/**
 * 26. Track development plan progress
 */
export async function trackDevelopmentProgress(
  planId: string
): Promise<{ overallProgress: number; completedInterventions: number; onTrack: boolean; nextMilestones: string[] }> {
  const plan = await DevelopmentPlanModel.findByPk(planId);

  if (!plan) {
    throw new Error('Development plan not found');
  }

  const completedInterventions = plan.interventions.filter((i) => i.status === 'completed').length;
  const totalInterventions = plan.interventions.length;
  const calculatedProgress = totalInterventions > 0 ? (completedInterventions / totalInterventions) * 100 : 0;

  const now = new Date();
  const totalDuration = plan.endDate.getTime() - plan.startDate.getTime();
  const elapsed = now.getTime() - plan.startDate.getTime();
  const expectedProgress = Math.min(100, (elapsed / totalDuration) * 100);

  const onTrack = calculatedProgress >= expectedProgress * 0.9;

  const nextMilestones = plan.interventions
    .filter((i) => i.status !== 'completed' && new Date(i.startDate) <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000))
    .map((i) => i.description)
    .slice(0, 3);

  return {
    overallProgress: calculatedProgress,
    completedInterventions,
    onTrack,
    nextMilestones,
  };
}

/**
 * 27. Create skills gap analysis
 */
export async function createSkillsGap(
  dto: CreateSkillsGapDto,
  transaction?: Transaction
): Promise<SkillsGapModel> {
  const gap = dto.requiredDemand - dto.currentSupply;
  const gapPercent = dto.requiredDemand > 0 ? (gap / dto.requiredDemand) * 100 : 0;

  return await SkillsGapModel.create(
    {
      gapId: '',
      ...dto,
      gap,
      gapPercent,
      analysisDate: new Date(),
    },
    { transaction }
  );
}

/**
 * 28. Prioritize skills gaps
 */
export async function prioritizeSkillsGaps(
  organizationId: string
): Promise<Array<{ skillName: string; gap: number; criticalityScore: number; priorityRank: number; closureStrategy: string }>> {
  const gaps = await SkillsGapModel.findAll({
    where: { organizationId },
    order: [
      ['criticalityScore', 'DESC'],
      ['gap', 'DESC'],
    ],
  });

  return gaps.map((gap, index) => ({
    skillName: gap.skillName,
    gap: gap.gap,
    criticalityScore: Number(gap.criticalityScore),
    priorityRank: index + 1,
    closureStrategy: gap.closureStrategy,
  }));
}

/**
 * 29. Calculate skills supply-demand ratio
 */
export function calculateSkillsSupplyDemand(
  supply: number,
  demand: number
): { ratio: number; status: 'surplus' | 'balanced' | 'shortage' | 'critical_shortage'; actionRequired: string } {
  const ratio = demand > 0 ? supply / demand : supply > 0 ? Infinity : 1;

  let status: 'surplus' | 'balanced' | 'shortage' | 'critical_shortage';
  let actionRequired: string;

  if (ratio >= 1.2) {
    status = 'surplus';
    actionRequired = 'Consider redeployment or skill diversification';
  } else if (ratio >= 0.9) {
    status = 'balanced';
    actionRequired = 'Monitor and maintain current levels';
  } else if (ratio >= 0.6) {
    status = 'shortage';
    actionRequired = 'Accelerate hiring or training programs';
  } else {
    status = 'critical_shortage';
    actionRequired = 'Immediate action required - hire externally or contract';
  }

  return { ratio, status, actionRequired };
}

/**
 * 30. Recommend skills closure strategy
 */
export function recommendSkillsClosureStrategy(
  gap: { size: number; criticalityScore: number; timeToFill: number; currentMarketAvailability: number }
): { strategy: 'hire' | 'develop' | 'contract' | 'automate'; rationale: string; estimatedTimeframe: number } {
  let strategy: 'hire' | 'develop' | 'contract' | 'automate';
  let rationale: string;
  let estimatedTimeframe: number;

  if (gap.criticalityScore > 80 && gap.timeToFill < 3) {
    strategy = 'contract';
    rationale = 'Critical need with short timeline requires external contractors';
    estimatedTimeframe = 1;
  } else if (gap.currentMarketAvailability > 70 && gap.size > 5) {
    strategy = 'hire';
    rationale = 'Strong market availability supports external hiring';
    estimatedTimeframe = gap.timeToFill;
  } else if (gap.size < 5 && gap.timeToFill > 6) {
    strategy = 'develop';
    rationale = 'Small gap with adequate timeline supports internal development';
    estimatedTimeframe = gap.timeToFill;
  } else if (gap.criticalityScore < 40) {
    strategy = 'automate';
    rationale = 'Low criticality skill may be automated or eliminated';
    estimatedTimeframe = 6;
  } else {
    strategy = 'hire';
    rationale = 'Default to external hiring given constraints';
    estimatedTimeframe = gap.timeToFill;
  }

  return { strategy, rationale, estimatedTimeframe };
}

/**
 * 31. Build talent pipeline metrics
 */
export async function buildTalentPipelineMetrics(
  organizationId: string
): Promise<{
  pipelineDepth: number;
  readyNowCount: number;
  highPotentialCount: number;
  criticalRoleCoverage: number;
  pipelineHealth: 'strong' | 'adequate' | 'weak';
}> {
  const [successionPlans, assessments] = await Promise.all([
    SuccessionPlanModel.findAll({ where: { organizationId } }),
    TalentAssessmentModel.findAll({
      where: { organizationId, potentialRating: PotentialRating.HIGH_POTENTIAL },
    }),
  ]);

  const readyNowCount = successionPlans.reduce(
    (sum, plan) => sum + plan.successors.filter((s) => s.readiness === SuccessionReadiness.READY_NOW).length,
    0
  );

  const highPotentialCount = assessments.length;
  const criticalRoles = successionPlans.length;
  const criticalRoleCoverage = criticalRoles > 0 ? (readyNowCount / criticalRoles) * 100 : 0;
  const pipelineDepth = highPotentialCount + readyNowCount;

  let pipelineHealth: 'strong' | 'adequate' | 'weak';
  if (criticalRoleCoverage >= 150) pipelineHealth = 'strong';
  else if (criticalRoleCoverage >= 80) pipelineHealth = 'adequate';
  else pipelineHealth = 'weak';

  return {
    pipelineDepth,
    readyNowCount,
    highPotentialCount,
    criticalRoleCoverage,
    pipelineHealth,
  };
}

/**
 * 32. Calculate diversity metrics
 */
export function calculateDiversityMetrics(
  workforce: Array<{ gender: string; ethnicity: string; age: number; level: string }>
): {
  genderDiversity: Record<string, number>;
  ethnicDiversity: Record<string, number>;
  ageDistribution: Record<string, number>;
  leadershipDiversity: number;
} {
  const total = workforce.length;

  const genderCounts: Record<string, number> = {};
  const ethnicityCounts: Record<string, number> = {};
  const ageBuckets = { 'Under 30': 0, '30-40': 0, '40-50': 0, '50-60': 0, 'Over 60': 0 };

  let leadershipCount = 0;
  let diverseLeadership = 0;

  for (const person of workforce) {
    genderCounts[person.gender] = (genderCounts[person.gender] || 0) + 1;
    ethnicityCounts[person.ethnicity] = (ethnicityCounts[person.ethnicity] || 0) + 1;

    if (person.age < 30) ageBuckets['Under 30']++;
    else if (person.age < 40) ageBuckets['30-40']++;
    else if (person.age < 50) ageBuckets['40-50']++;
    else if (person.age < 60) ageBuckets['50-60']++;
    else ageBuckets['Over 60']++;

    if (person.level.includes('Director') || person.level.includes('VP') || person.level.includes('C-')) {
      leadershipCount++;
      if (person.gender !== 'Male' || person.ethnicity !== 'White') {
        diverseLeadership++;
      }
    }
  }

  const genderDiversity: Record<string, number> = {};
  for (const [gender, count] of Object.entries(genderCounts)) {
    genderDiversity[gender] = (count / total) * 100;
  }

  const ethnicDiversity: Record<string, number> = {};
  for (const [ethnicity, count] of Object.entries(ethnicityCounts)) {
    ethnicDiversity[ethnicity] = (count / total) * 100;
  }

  const ageDistribution: Record<string, number> = {};
  for (const [bucket, count] of Object.entries(ageBuckets)) {
    ageDistribution[bucket] = (count / total) * 100;
  }

  const leadershipDiversity = leadershipCount > 0 ? (diverseLeadership / leadershipCount) * 100 : 0;

  return { genderDiversity, ethnicDiversity, ageDistribution, leadershipDiversity };
}

/**
 * 33. Calculate talent density
 */
export function calculateTalentDensity(
  topPerformers: number,
  totalWorkforce: number
): { densityPercent: number; benchmark: number; rating: 'exceptional' | 'strong' | 'adequate' | 'weak' } {
  const densityPercent = totalWorkforce > 0 ? (topPerformers / totalWorkforce) * 100 : 0;
  const benchmark = 20; // Industry benchmark: 20% top performers

  let rating: 'exceptional' | 'strong' | 'adequate' | 'weak';
  if (densityPercent >= 30) rating = 'exceptional';
  else if (densityPercent >= 20) rating = 'strong';
  else if (densityPercent >= 15) rating = 'adequate';
  else rating = 'weak';

  return { densityPercent, benchmark, rating };
}

/**
 * 34. Analyze performance distribution
 */
export function analyzePerformanceDistribution(
  ratings: PerformanceRating[]
): {
  distribution: Record<PerformanceRating, number>;
  mean: number;
  median: PerformanceRating;
  skew: 'positive' | 'neutral' | 'negative';
} {
  const distribution: Record<string, number> = {
    [PerformanceRating.EXCEPTIONAL]: 0,
    [PerformanceRating.EXCEEDS_EXPECTATIONS]: 0,
    [PerformanceRating.MEETS_EXPECTATIONS]: 0,
    [PerformanceRating.PARTIALLY_MEETS]: 0,
    [PerformanceRating.DOES_NOT_MEET]: 0,
  };

  const ratingValues: Record<PerformanceRating, number> = {
    [PerformanceRating.EXCEPTIONAL]: 5,
    [PerformanceRating.EXCEEDS_EXPECTATIONS]: 4,
    [PerformanceRating.MEETS_EXPECTATIONS]: 3,
    [PerformanceRating.PARTIALLY_MEETS]: 2,
    [PerformanceRating.DOES_NOT_MEET]: 1,
  };

  for (const rating of ratings) {
    distribution[rating] = (distribution[rating] || 0) + 1;
  }

  const total = ratings.length;
  for (const key in distribution) {
    distribution[key] = (distribution[key] / total) * 100;
  }

  const sum = ratings.reduce((acc, rating) => acc + ratingValues[rating], 0);
  const mean = sum / total;

  const sorted = [...ratings].sort((a, b) => ratingValues[a] - ratingValues[b]);
  const median = sorted[Math.floor(sorted.length / 2)];

  let skew: 'positive' | 'neutral' | 'negative';
  if (mean > ratingValues[median] + 0.3) skew = 'positive';
  else if (mean < ratingValues[median] - 0.3) skew = 'negative';
  else skew = 'neutral';

  return { distribution: distribution as any, mean, median, skew };
}

/**
 * 35. Calculate learning velocity
 */
export function calculateLearningVelocity(
  interventions: Array<{ startDate: Date; endDate: Date; completed: boolean }>,
  competencyGainMonths: number
): { interventionsPerMonth: number; completionRate: number; learningVelocity: number } {
  const completed = interventions.filter((i) => i.completed).length;
  const total = interventions.length;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  const interventionsPerMonth = completed / competencyGainMonths;
  const learningVelocity = interventionsPerMonth * (completionRate / 100);

  return { interventionsPerMonth, completionRate, learningVelocity };
}

/**
 * 36. Model talent acquisition needs
 */
export function modelTalentAcquisitionNeeds(
  plan: { targetHeadcount: number; currentHeadcount: number; attritionRate: number; internalMobility: number },
  timeline: number
): {
  externalHires: number;
  internalPromotions: number;
  monthlyHiringRate: number;
  recruitingCapacityNeeded: number;
} {
  const attrition = Math.round(plan.currentHeadcount * (plan.attritionRate / 100));
  const netGrowth = plan.targetHeadcount - plan.currentHeadcount;
  const totalNeed = netGrowth + attrition;

  const internalPromotions = Math.round(totalNeed * (plan.internalMobility / 100));
  const externalHires = totalNeed - internalPromotions;

  const monthlyHiringRate = externalHires / timeline;
  const recruitingCapacityNeeded = Math.ceil(externalHires / 50); // Assume 1 recruiter per 50 hires/year

  return { externalHires, internalPromotions, monthlyHiringRate, recruitingCapacityNeeded };
}

/**
 * 37. Calculate talent mobility index
 */
export function calculateTalentMobilityIndex(
  movements: { promotions: number; lateralMoves: number; crossFunctional: number },
  workforce: number
): { mobilityIndex: number; promotionRate: number; crossFunctionalRate: number; mobilityHealth: 'high' | 'moderate' | 'low' } {
  const totalMoves = movements.promotions + movements.lateralMoves + movements.crossFunctional;
  const mobilityIndex = workforce > 0 ? (totalMoves / workforce) * 100 : 0;
  const promotionRate = workforce > 0 ? (movements.promotions / workforce) * 100 : 0;
  const crossFunctionalRate = workforce > 0 ? (movements.crossFunctional / workforce) * 100 : 0;

  let mobilityHealth: 'high' | 'moderate' | 'low';
  if (mobilityIndex >= 15) mobilityHealth = 'high';
  else if (mobilityIndex >= 8) mobilityHealth = 'moderate';
  else mobilityHealth = 'low';

  return { mobilityIndex, promotionRate, crossFunctionalRate, mobilityHealth };
}

/**
 * 38. Analyze compensation competitiveness
 */
export function analyzeCompensationCompetitiveness(
  internal: { salary: number; bonus: number; equity: number },
  market: { p50: number; p75: number; p90: number }
): { totalComp: number; marketPosition: number; competitiveness: 'leading' | 'competitive' | 'lagging'; gap: number } {
  const totalComp = internal.salary + internal.bonus + internal.equity;
  const marketPosition = (totalComp / market.p50) * 100;

  let competitiveness: 'leading' | 'competitive' | 'lagging';
  if (marketPosition >= 110) competitiveness = 'leading';
  else if (marketPosition >= 90) competitiveness = 'competitive';
  else competitiveness = 'lagging';

  const gap = totalComp - market.p50;

  return { totalComp, marketPosition, competitiveness, gap };
}

/**
 * 39. Calculate time-to-fill metrics
 */
export function calculateTimeToFill(
  requisitions: Array<{ openedDate: Date; filledDate: Date; role: string; level: string }>
): { avgTimeToFill: number; medianTimeToFill: number; byLevel: Record<string, number>; efficiency: number } {
  const timeToFills = requisitions.map((req) => {
    const days = Math.floor((req.filledDate.getTime() - req.openedDate.getTime()) / (1000 * 60 * 60 * 24));
    return { days, level: req.level };
  });

  const avgTimeToFill = timeToFills.reduce((sum, t) => sum + t.days, 0) / timeToFills.length;

  const sorted = [...timeToFills].sort((a, b) => a.days - b.days);
  const medianTimeToFill = sorted[Math.floor(sorted.length / 2)]?.days || 0;

  const byLevel: Record<string, number> = {};
  for (const ttf of timeToFills) {
    if (!byLevel[ttf.level]) {
      byLevel[ttf.level] = 0;
    }
    byLevel[ttf.level] += ttf.days;
  }

  for (const level in byLevel) {
    const count = timeToFills.filter((t) => t.level === level).length;
    byLevel[level] = byLevel[level] / count;
  }

  const benchmark = 45; // Industry benchmark: 45 days
  const efficiency = Math.max(0, ((benchmark - avgTimeToFill) / benchmark) * 100);

  return { avgTimeToFill, medianTimeToFill, byLevel, efficiency };
}

/**
 * 40. Generate talent review insights
 */
export async function generateTalentReviewInsights(
  organizationId: string
): Promise<{
  topTalentCount: number;
  flightRiskCount: number;
  successionCoverage: number;
  developmentInvestment: number;
  keyInsights: string[];
  recommendations: string[];
}> {
  const [assessments, retentionAnalyses, successionPlans, developmentPlans] = await Promise.all([
    TalentAssessmentModel.findAll({ where: { organizationId } }),
    RetentionAnalysisModel.findAll({ where: { organizationId } }),
    SuccessionPlanModel.findAll({ where: { organizationId } }),
    DevelopmentPlanModel.findAll({ where: { organizationId } }),
  ]);

  const topTalentCount = assessments.filter(
    (a) => a.talentTier === TalentTier.TOP_PERFORMER || a.talentTier === TalentTier.HIGH_PERFORMER
  ).length;

  const flightRiskCount = retentionAnalyses.filter(
    (r) => r.flightRisk === FlightRisk.HIGH || r.flightRisk === FlightRisk.CRITICAL
  ).length;

  const criticalRoles = successionPlans.length;
  const coveredRoles = successionPlans.filter(
    (p) => p.successors.some((s) => s.readiness === SuccessionReadiness.READY_NOW)
  ).length;
  const successionCoverage = criticalRoles > 0 ? (coveredRoles / criticalRoles) * 100 : 0;

  const developmentInvestment = developmentPlans.reduce((sum, p) => sum + Number(p.budget), 0);

  const keyInsights: string[] = [];
  const recommendations: string[] = [];

  if (topTalentCount < assessments.length * 0.2) {
    keyInsights.push(`Top talent represents only ${((topTalentCount / assessments.length) * 100).toFixed(1)}% of workforce`);
    recommendations.push('Increase investment in talent acquisition and development');
  }

  if (flightRiskCount > assessments.length * 0.1) {
    keyInsights.push(`${flightRiskCount} employees at high flight risk`);
    recommendations.push('Implement retention strategies for high-risk talent');
  }

  if (successionCoverage < 80) {
    keyInsights.push(`Only ${successionCoverage.toFixed(1)}% succession coverage for critical roles`);
    recommendations.push('Accelerate succession planning and development programs');
  }

  return {
    topTalentCount,
    flightRiskCount,
    successionCoverage,
    developmentInvestment,
    keyInsights,
    recommendations,
  };
}

/**
 * 41. Calculate workforce productivity index
 */
export function calculateWorkforceProductivityIndex(
  metrics: { revenuePerEmployee: number; profitPerEmployee: number; utilizationRate: number }
): { productivityIndex: number; rating: 'exceptional' | 'strong' | 'average' | 'below_average' } {
  // Normalize metrics to 0-100 scale
  const revenueScore = Math.min(100, (metrics.revenuePerEmployee / 200000) * 100);
  const profitScore = Math.min(100, (metrics.profitPerEmployee / 50000) * 100);
  const utilizationScore = metrics.utilizationRate;

  const productivityIndex = (revenueScore * 0.4 + profitScore * 0.4 + utilizationScore * 0.2);

  let rating: 'exceptional' | 'strong' | 'average' | 'below_average';
  if (productivityIndex >= 85) rating = 'exceptional';
  else if (productivityIndex >= 70) rating = 'strong';
  else if (productivityIndex >= 55) rating = 'average';
  else rating = 'below_average';

  return { productivityIndex, rating };
}

/**
 * 42. Model organizational change impact
 */
export function modelOrganizationalChangeImpact(
  change: { affectedHeadcount: number; typeOfChange: 'restructure' | 'merger' | 'layoff' | 'expansion' },
  workforce: { totalHeadcount: number; avgTenure: number; engagementScore: number }
): {
  impactScore: number;
  attritionRisk: number;
  productivityDip: number;
  recoveryMonths: number;
  recommendations: string[];
} {
  const affectedPercent = (change.affectedHeadcount / workforce.totalHeadcount) * 100;

  let baseImpact = 0;
  let baseAttritionRisk = 0;
  let baseProductivityDip = 0;
  let baseRecoveryMonths = 0;

  switch (change.typeOfChange) {
    case 'restructure':
      baseImpact = 60;
      baseAttritionRisk = 15;
      baseProductivityDip = 20;
      baseRecoveryMonths = 6;
      break;
    case 'merger':
      baseImpact = 75;
      baseAttritionRisk = 25;
      baseProductivityDip = 30;
      baseRecoveryMonths = 12;
      break;
    case 'layoff':
      baseImpact = 80;
      baseAttritionRisk = 30;
      baseProductivityDip = 25;
      baseRecoveryMonths = 9;
      break;
    case 'expansion':
      baseImpact = 40;
      baseAttritionRisk = 10;
      baseProductivityDip = 15;
      baseRecoveryMonths = 3;
      break;
  }

  const scaleMultiplier = 1 + (affectedPercent / 100);
  const engagementMultiplier = workforce.engagementScore < 60 ? 1.3 : workforce.engagementScore > 75 ? 0.8 : 1.0;

  const impactScore = Math.min(100, baseImpact * scaleMultiplier * engagementMultiplier);
  const attritionRisk = Math.min(100, baseAttritionRisk * scaleMultiplier * engagementMultiplier);
  const productivityDip = Math.min(100, baseProductivityDip * scaleMultiplier);
  const recoveryMonths = Math.round(baseRecoveryMonths * scaleMultiplier);

  const recommendations: string[] = [
    'Implement comprehensive change management program',
    'Increase communication frequency and transparency',
    'Provide support resources for affected employees',
  ];

  if (attritionRisk > 20) {
    recommendations.push('Develop retention strategies for key talent');
  }

  if (impactScore > 70) {
    recommendations.push('Consider phased implementation to reduce disruption');
  }

  return { impactScore, attritionRisk, productivityDip, recoveryMonths, recommendations };
}

/**
 * 43. Generate workforce scenario planning
 */
export function generateWorkforceScenarios(
  baseline: { headcount: number; avgSalary: number; budget: number },
  scenarios: Array<{ name: string; growthRate: number; attritionRate: number; salaryInflation: number }>
): Array<{
  scenario: string;
  projectedHeadcount: number;
  projectedCost: number;
  budgetVariance: number;
  feasibility: 'within_budget' | 'over_budget' | 'significantly_over';
}> {
  return scenarios.map((scenario) => {
    const netGrowth = baseline.headcount * (scenario.growthRate / 100);
    const attritionLoss = baseline.headcount * (scenario.attritionRate / 100);
    const projectedHeadcount = Math.round(baseline.headcount + netGrowth - attritionLoss);

    const inflatedSalary = baseline.avgSalary * (1 + scenario.salaryInflation / 100);
    const projectedCost = projectedHeadcount * inflatedSalary;
    const budgetVariance = projectedCost - baseline.budget;
    const variancePercent = (budgetVariance / baseline.budget) * 100;

    let feasibility: 'within_budget' | 'over_budget' | 'significantly_over';
    if (variancePercent <= 5) feasibility = 'within_budget';
    else if (variancePercent <= 15) feasibility = 'over_budget';
    else feasibility = 'significantly_over';

    return {
      scenario: scenario.name,
      projectedHeadcount,
      projectedCost,
      budgetVariance,
      feasibility,
    };
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export const TalentManagementKit = {
  // Models
  WorkforcePlanModel,
  SuccessionPlanModel,
  CompetencyFrameworkModel,
  TalentAssessmentModel,
  EngagementSurveyModel,
  RetentionAnalysisModel,
  DevelopmentPlanModel,
  SkillsGapModel,

  // DTOs
  CreateWorkforcePlanDto,
  CreateSuccessionPlanDto,
  CreateCompetencyFrameworkDto,
  CreateTalentAssessmentDto,
  CreateEngagementSurveyDto,
  CreateRetentionAnalysisDto,
  CreateDevelopmentPlanDto,
  CreateSkillsGapDto,

  // Functions (43 total)
  createWorkforcePlan,
  calculateWorkforceGap,
  projectHeadcount,
  calculateSpanOfControl,
  createSuccessionPlan,
  calculateBenchStrength,
  identifySuccessionGaps,
  createCompetencyFramework,
  calculateCompetencyGap,
  aggregateCompetencyScores,
  createTalentAssessment,
  build9BoxGrid,
  calibratePerformanceRatings,
  identifyHighPotentials,
  createEngagementSurvey,
  calculateEngagementIndex,
  calculateENPS,
  analyzeEngagementTrends,
  createRetentionAnalysis,
  calculateFlightRiskScore,
  predictVoluntaryAttrition,
  calculateRetentionCostImpact,
  createDevelopmentPlan,
  prioritizeDevelopmentInterventions,
  calculateDevelopmentROI,
  trackDevelopmentProgress,
  createSkillsGap,
  prioritizeSkillsGaps,
  calculateSkillsSupplyDemand,
  recommendSkillsClosureStrategy,
  buildTalentPipelineMetrics,
  calculateDiversityMetrics,
  calculateTalentDensity,
  analyzePerformanceDistribution,
  calculateLearningVelocity,
  modelTalentAcquisitionNeeds,
  calculateTalentMobilityIndex,
  analyzeCompensationCompetitiveness,
  calculateTimeToFill,
  generateTalentReviewInsights,
  calculateWorkforceProductivityIndex,
  modelOrganizationalChangeImpact,
  generateWorkforceScenarios,
};

export default TalentManagementKit;
