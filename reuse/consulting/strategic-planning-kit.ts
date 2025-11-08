/**
 * LOC: CONSSTRAT12345
 * File: /reuse/consulting/strategic-planning-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend consulting services
 *   - Strategic planning controllers
 *   - Business analytics dashboards
 *   - Executive reporting engines
 */

/**
 * File: /reuse/consulting/strategic-planning-kit.ts
 * Locator: WC-CONSULTING-STRATEGY-001
 * Purpose: Comprehensive Strategic Planning & Analysis - McKinsey/BCG-level strategic frameworks and methodologies
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Consulting controllers, strategy services, analytics platforms, executive dashboards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for SWOT analysis, Porter's Five Forces, BCG Matrix, Ansoff Matrix, balanced scorecard, scenario planning
 *
 * LLM Context: Enterprise-grade strategic planning system competing with McKinsey/BCG/Bain capabilities.
 * Provides comprehensive strategic analysis frameworks including SWOT, Porter's Five Forces, BCG Matrix,
 * Ansoff Matrix, balanced scorecard, scenario planning, competitive intelligence, market analysis,
 * strategic roadmapping, value chain analysis, blue ocean strategy, core competency analysis,
 * stakeholder mapping, strategic risk assessment, portfolio optimization, and strategic performance tracking.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
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
 * Strategic analysis framework types
 */
export enum StrategyFramework {
  SWOT = 'swot',
  PORTER_FIVE_FORCES = 'porter_five_forces',
  BCG_MATRIX = 'bcg_matrix',
  ANSOFF_MATRIX = 'ansoff_matrix',
  BALANCED_SCORECARD = 'balanced_scorecard',
  VALUE_CHAIN = 'value_chain',
  PESTEL = 'pestel',
  BLUE_OCEAN = 'blue_ocean',
  CORE_COMPETENCY = 'core_competency',
  SCENARIO_PLANNING = 'scenario_planning',
}

/**
 * Strategic position quadrants
 */
export enum StrategicPosition {
  STAR = 'star',
  CASH_COW = 'cash_cow',
  QUESTION_MARK = 'question_mark',
  DOG = 'dog',
  LEADER = 'leader',
  CHALLENGER = 'challenger',
  FOLLOWER = 'follower',
  NICHER = 'nicher',
}

/**
 * Strategic priority levels
 */
export enum StrategyPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  DEFERRED = 'deferred',
}

/**
 * Strategic initiative status
 */
export enum InitiativeStatus {
  PROPOSED = 'proposed',
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  UNDER_REVIEW = 'under_review',
}

/**
 * Competitive intensity levels
 */
export enum CompetitiveIntensity {
  VERY_HIGH = 'very_high',
  HIGH = 'high',
  MODERATE = 'moderate',
  LOW = 'low',
  VERY_LOW = 'very_low',
}

/**
 * Growth strategy types
 */
export enum GrowthStrategy {
  MARKET_PENETRATION = 'market_penetration',
  MARKET_DEVELOPMENT = 'market_development',
  PRODUCT_DEVELOPMENT = 'product_development',
  DIVERSIFICATION = 'diversification',
  VERTICAL_INTEGRATION = 'vertical_integration',
  HORIZONTAL_INTEGRATION = 'horizontal_integration',
}

/**
 * Strategic risk levels
 */
export enum StrategicRiskLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MODERATE = 'moderate',
  LOW = 'low',
  NEGLIGIBLE = 'negligible',
}

// ============================================================================
// CORE INTERFACES
// ============================================================================

/**
 * Strategic context interface
 */
export interface StrategyContext {
  organizationId: string;
  userId: string;
  timestamp: string;
  framework: StrategyFramework;
  analysisId?: string;
  metadata?: Record<string, any>;
}

/**
 * SWOT Analysis interface
 */
export interface SWOTAnalysis {
  id: string;
  organizationId: string;
  analysisName: string;
  analysisDate: string;
  timeHorizon: string;
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
  strategicRecommendations: StrategicRecommendation[];
  crossFactorAnalysis: CrossFactorAnalysis[];
  status: InitiativeStatus;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  metadata: Record<string, any>;
}

/**
 * SWOT item interface
 */
export interface SWOTItem {
  id: string;
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
  description: string;
  impact: number; // 1-10
  urgency: number; // 1-10
  evidence: string[];
  relatedFactors: string[];
  actionItems: string[];
  owner?: string;
  dueDate?: string;
}

/**
 * Cross-factor SWOT analysis
 */
export interface CrossFactorAnalysis {
  type: 'SO' | 'WO' | 'ST' | 'WT';
  strategy: string;
  relatedStrengths?: string[];
  relatedWeaknesses?: string[];
  relatedOpportunities?: string[];
  relatedThreats?: string[];
  priority: StrategyPriority;
  estimatedImpact: number;
  implementationComplexity: number;
}

/**
 * Porter's Five Forces analysis
 */
export interface PorterFiveForcesAnalysis {
  id: string;
  organizationId: string;
  industry: string;
  analysisDate: string;
  competitiveRivalry: ForceAnalysis;
  threatOfNewEntrants: ForceAnalysis;
  bargainingPowerSuppliers: ForceAnalysis;
  bargainingPowerBuyers: ForceAnalysis;
  threatOfSubstitutes: ForceAnalysis;
  overallAttractiveness: number; // 1-10
  strategicImplications: string[];
  actionItems: ActionItem[];
  metadata: Record<string, any>;
}

/**
 * Individual force analysis
 */
export interface ForceAnalysis {
  intensity: CompetitiveIntensity;
  intensityScore: number; // 1-10
  keyFactors: ForceFactor[];
  trends: string[];
  strategicResponse: string;
  mitigationStrategies: string[];
}

/**
 * Force factor
 */
export interface ForceFactor {
  factor: string;
  impact: number; // 1-10
  trend: 'increasing' | 'stable' | 'decreasing';
  description: string;
}

/**
 * BCG Matrix analysis
 */
export interface BCGMatrixAnalysis {
  id: string;
  organizationId: string;
  portfolioName: string;
  analysisDate: string;
  businessUnits: BCGBusinessUnit[];
  portfolioRecommendations: PortfolioRecommendation[];
  resourceAllocation: ResourceAllocation[];
  strategicGaps: string[];
  metadata: Record<string, any>;
}

/**
 * BCG business unit positioning
 */
export interface BCGBusinessUnit {
  id: string;
  unitName: string;
  position: StrategicPosition;
  marketGrowthRate: number; // percentage
  relativeMarketShare: number; // ratio
  revenue: number;
  profitMargin: number;
  cashFlowContribution: number;
  strategicImportance: number; // 1-10
  recommendedStrategy: string;
  investmentPriority: StrategyPriority;
  timeline: string;
}

/**
 * Portfolio recommendation
 */
export interface PortfolioRecommendation {
  type: 'invest' | 'hold' | 'harvest' | 'divest';
  businessUnits: string[];
  rationale: string;
  expectedOutcome: string;
  risks: string[];
  requiredInvestment: number;
  expectedReturn: number;
  timeframe: string;
}

/**
 * Resource allocation
 */
export interface ResourceAllocation {
  businessUnitId: string;
  allocationType: 'capital' | 'human' | 'technology' | 'marketing';
  currentAllocation: number;
  recommendedAllocation: number;
  variance: number;
  justification: string;
}

/**
 * Ansoff Matrix analysis
 */
export interface AnsoffMatrixAnalysis {
  id: string;
  organizationId: string;
  analysisName: string;
  analysisDate: string;
  marketPenetration: GrowthInitiative[];
  marketDevelopment: GrowthInitiative[];
  productDevelopment: GrowthInitiative[];
  diversification: GrowthInitiative[];
  recommendedStrategy: GrowthStrategy;
  riskAssessment: StrategyRiskAssessment;
  metadata: Record<string, any>;
}

/**
 * Growth initiative
 */
export interface GrowthInitiative {
  id: string;
  initiativeName: string;
  description: string;
  targetMarket?: string;
  targetProduct?: string;
  expectedRevenue: number;
  investmentRequired: number;
  roi: number;
  timeToMarket: number; // months
  riskLevel: StrategicRiskLevel;
  successProbability: number; // 0-1
  strategicFit: number; // 1-10
  priority: StrategyPriority;
}

/**
 * Strategy risk assessment
 */
export interface StrategyRiskAssessment {
  overallRisk: StrategicRiskLevel;
  riskScore: number; // 1-100
  marketRisks: RiskItem[];
  operationalRisks: RiskItem[];
  financialRisks: RiskItem[];
  competitiveRisks: RiskItem[];
  mitigationPlan: MitigationStrategy[];
}

/**
 * Risk item
 */
export interface RiskItem {
  id: string;
  riskDescription: string;
  probability: number; // 0-1
  impact: number; // 1-10
  riskScore: number;
  category: string;
  owner?: string;
}

/**
 * Mitigation strategy
 */
export interface MitigationStrategy {
  riskId: string;
  strategy: string;
  cost: number;
  effectiveness: number; // 0-1
  timeline: string;
  owner: string;
}

/**
 * Balanced Scorecard
 */
export interface BalancedScorecard {
  id: string;
  organizationId: string;
  scorecardName: string;
  period: string;
  financialPerspective: PerspectiveMetrics;
  customerPerspective: PerspectiveMetrics;
  internalProcessPerspective: PerspectiveMetrics;
  learningGrowthPerspective: PerspectiveMetrics;
  strategicObjectives: StrategicObjective[];
  strategyMap: StrategyMapNode[];
  overallScore: number;
  status: InitiativeStatus;
  metadata: Record<string, any>;
}

/**
 * Perspective metrics
 */
export interface PerspectiveMetrics {
  perspective: 'financial' | 'customer' | 'internal' | 'learning';
  objectives: StrategicObjective[];
  measures: PerformanceMeasure[];
  targets: Target[];
  initiatives: Initiative[];
  currentScore: number;
  targetScore: number;
  variance: number;
}

/**
 * Strategic objective
 */
export interface StrategicObjective {
  id: string;
  objectiveName: string;
  description: string;
  perspective: 'financial' | 'customer' | 'internal' | 'learning';
  weight: number; // percentage
  owner: string;
  status: InitiativeStatus;
  linkedObjectives: string[];
}

/**
 * Performance measure
 */
export interface PerformanceMeasure {
  id: string;
  measureName: string;
  objectiveId: string;
  metricType: 'leading' | 'lagging';
  unit: string;
  currentValue: number;
  targetValue: number;
  baseline: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  dataSource: string;
}

/**
 * Target
 */
export interface Target {
  measureId: string;
  period: string;
  targetValue: number;
  actualValue?: number;
  variance?: number;
  status: 'on-track' | 'at-risk' | 'behind' | 'achieved';
}

/**
 * Initiative
 */
export interface Initiative {
  id: string;
  initiativeName: string;
  description: string;
  objectiveIds: string[];
  owner: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: InitiativeStatus;
  progress: number; // 0-100
  expectedImpact: number;
}

/**
 * Strategy map node
 */
export interface StrategyMapNode {
  objectiveId: string;
  perspective: 'financial' | 'customer' | 'internal' | 'learning';
  dependencies: string[];
  contributesTo: string[];
}

/**
 * Scenario planning analysis
 */
export interface ScenarioPlanningAnalysis {
  id: string;
  organizationId: string;
  analysisName: string;
  timeHorizon: string;
  scenarios: Scenario[];
  criticalUncertainties: CriticalUncertainty[];
  earlyWarningIndicators: EarlyWarningIndicator[];
  contingencyPlans: ContingencyPlan[];
  recommendedActions: StrategicRecommendation[];
  metadata: Record<string, any>;
}

/**
 * Scenario
 */
export interface Scenario {
  id: string;
  scenarioName: string;
  description: string;
  probability: number; // 0-1
  impact: number; // 1-10
  assumptions: Assumption[];
  projections: ScenarioProjection[];
  strategicImplications: string[];
  requiredCapabilities: string[];
}

/**
 * Assumption
 */
export interface Assumption {
  category: string;
  assumption: string;
  confidence: number; // 0-1
  evidenceSupport: string[];
}

/**
 * Scenario projection
 */
export interface ScenarioProjection {
  metric: string;
  baselineValue: number;
  projectedValue: number;
  year: number;
  confidence: number;
}

/**
 * Critical uncertainty
 */
export interface CriticalUncertainty {
  id: string;
  uncertaintyName: string;
  description: string;
  impact: number; // 1-10
  predictability: number; // 1-10 (low = high uncertainty)
  monitoringMethod: string;
  owner: string;
}

/**
 * Early warning indicator
 */
export interface EarlyWarningIndicator {
  id: string;
  indicatorName: string;
  scenarioId: string;
  currentValue: number;
  thresholdValue: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  monitoringFrequency: string;
  alertOwner: string;
}

/**
 * Contingency plan
 */
export interface ContingencyPlan {
  id: string;
  scenarioId: string;
  planName: string;
  triggers: string[];
  actions: ActionItem[];
  resources: ResourceRequirement[];
  responsibleParty: string;
  activationCriteria: string;
}

/**
 * Strategic recommendation
 */
export interface StrategicRecommendation {
  id: string;
  recommendation: string;
  rationale: string;
  expectedBenefit: string;
  implementationCost: number;
  timeframe: string;
  priority: StrategyPriority;
  risks: string[];
  dependencies: string[];
  owner?: string;
}

/**
 * Action item
 */
export interface ActionItem {
  id: string;
  action: string;
  description: string;
  owner: string;
  dueDate: string;
  status: InitiativeStatus;
  priority: StrategyPriority;
  dependencies: string[];
}

/**
 * Resource requirement
 */
export interface ResourceRequirement {
  resourceType: 'capital' | 'human' | 'technology' | 'infrastructure';
  description: string;
  quantity: number;
  cost: number;
  availability: 'available' | 'needs_acquisition' | 'not_available';
}

/**
 * Value chain analysis
 */
export interface ValueChainAnalysis {
  id: string;
  organizationId: string;
  analysisDate: string;
  primaryActivities: ValueActivity[];
  supportActivities: ValueActivity[];
  costDrivers: CostDriver[];
  valueDrivers: ValueDriver[];
  competitiveAdvantages: CompetitiveAdvantage[];
  improvementOpportunities: ImprovementOpportunity[];
  metadata: Record<string, any>;
}

/**
 * Value activity
 */
export interface ValueActivity {
  id: string;
  activityName: string;
  activityType: 'primary' | 'support';
  category: string;
  valueContribution: number; // 1-10
  costContribution: number; // percentage
  efficiency: number; // 1-10
  qualityLevel: number; // 1-10
  competitivePosition: 'superior' | 'at_par' | 'inferior';
  improvementPotential: number; // 1-10
}

/**
 * Cost driver
 */
export interface CostDriver {
  activityId: string;
  driver: string;
  impactLevel: number; // 1-10
  optimization: string;
  expectedSavings: number;
}

/**
 * Value driver
 */
export interface ValueDriver {
  activityId: string;
  driver: string;
  customerValue: number; // 1-10
  differentiationPotential: number; // 1-10
  enhancementStrategy: string;
  expectedRevenue: number;
}

/**
 * Competitive advantage
 */
export interface CompetitiveAdvantage {
  source: string;
  type: 'cost' | 'differentiation' | 'focus';
  sustainability: number; // 1-10
  activities: string[];
  protection: string;
}

/**
 * Improvement opportunity
 */
export interface ImprovementOpportunity {
  id: string;
  activityId: string;
  opportunity: string;
  type: 'cost_reduction' | 'value_enhancement' | 'efficiency';
  potentialImpact: number;
  implementationCost: number;
  roi: number;
  priority: StrategyPriority;
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * DTO for creating SWOT analysis
 */
export class CreateSWOTAnalysisDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'Analysis name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  analysisName: string;

  @ApiProperty({ description: 'Analysis date' })
  @IsString()
  @IsNotEmpty()
  analysisDate: string;

  @ApiProperty({ description: 'Time horizon for analysis' })
  @IsString()
  @IsNotEmpty()
  timeHorizon: string;

  @ApiProperty({ description: 'List of strengths', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SWOTItemDto)
  strengths: SWOTItemDto[];

  @ApiProperty({ description: 'List of weaknesses', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SWOTItemDto)
  weaknesses: SWOTItemDto[];

  @ApiProperty({ description: 'List of opportunities', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SWOTItemDto)
  opportunities: SWOTItemDto[];

  @ApiProperty({ description: 'List of threats', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SWOTItemDto)
  threats: SWOTItemDto[];

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * DTO for SWOT item
 */
export class SWOTItemDto {
  @ApiProperty({ description: 'SWOT category' })
  @IsEnum(['strength', 'weakness', 'opportunity', 'threat'])
  @IsNotEmpty()
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';

  @ApiProperty({ description: 'Item description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({ description: 'Impact score 1-10' })
  @IsNumber()
  @Min(1)
  @Max(10)
  impact: number;

  @ApiProperty({ description: 'Urgency score 1-10' })
  @IsNumber()
  @Min(1)
  @Max(10)
  urgency: number;

  @ApiProperty({ description: 'Supporting evidence', type: [String] })
  @IsArray()
  @IsString({ each: true })
  evidence: string[];

  @ApiProperty({ description: 'Related factors', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedFactors?: string[];

  @ApiProperty({ description: 'Action items', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  actionItems?: string[];
}

/**
 * DTO for creating Porter's Five Forces analysis
 */
export class CreatePorterFiveForcesDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'Industry name' })
  @IsString()
  @IsNotEmpty()
  industry: string;

  @ApiProperty({ description: 'Analysis date' })
  @IsString()
  @IsNotEmpty()
  analysisDate: string;

  @ApiProperty({ description: 'Competitive rivalry analysis' })
  @ValidateNested()
  @Type(() => ForceAnalysisDto)
  competitiveRivalry: ForceAnalysisDto;

  @ApiProperty({ description: 'Threat of new entrants analysis' })
  @ValidateNested()
  @Type(() => ForceAnalysisDto)
  threatOfNewEntrants: ForceAnalysisDto;

  @ApiProperty({ description: 'Bargaining power of suppliers analysis' })
  @ValidateNested()
  @Type(() => ForceAnalysisDto)
  bargainingPowerSuppliers: ForceAnalysisDto;

  @ApiProperty({ description: 'Bargaining power of buyers analysis' })
  @ValidateNested()
  @Type(() => ForceAnalysisDto)
  bargainingPowerBuyers: ForceAnalysisDto;

  @ApiProperty({ description: 'Threat of substitutes analysis' })
  @ValidateNested()
  @Type(() => ForceAnalysisDto)
  threatOfSubstitutes: ForceAnalysisDto;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * DTO for force analysis
 */
export class ForceAnalysisDto {
  @ApiProperty({ description: 'Competitive intensity level', enum: CompetitiveIntensity })
  @IsEnum(CompetitiveIntensity)
  intensity: CompetitiveIntensity;

  @ApiProperty({ description: 'Intensity score 1-10' })
  @IsNumber()
  @Min(1)
  @Max(10)
  intensityScore: number;

  @ApiProperty({ description: 'Key factors', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ForceFactorDto)
  keyFactors: ForceFactorDto[];

  @ApiProperty({ description: 'Strategic response' })
  @IsString()
  @IsNotEmpty()
  strategicResponse: string;
}

/**
 * DTO for force factor
 */
export class ForceFactorDto {
  @ApiProperty({ description: 'Factor name' })
  @IsString()
  @IsNotEmpty()
  factor: string;

  @ApiProperty({ description: 'Impact score 1-10' })
  @IsNumber()
  @Min(1)
  @Max(10)
  impact: number;

  @ApiProperty({ description: 'Trend direction', enum: ['increasing', 'stable', 'decreasing'] })
  @IsEnum(['increasing', 'stable', 'decreasing'])
  trend: 'increasing' | 'stable' | 'decreasing';

  @ApiProperty({ description: 'Factor description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

/**
 * DTO for creating BCG Matrix analysis
 */
export class CreateBCGMatrixDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'Portfolio name' })
  @IsString()
  @IsNotEmpty()
  portfolioName: string;

  @ApiProperty({ description: 'Analysis date' })
  @IsString()
  @IsNotEmpty()
  analysisDate: string;

  @ApiProperty({ description: 'Business units', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BCGBusinessUnitDto)
  businessUnits: BCGBusinessUnitDto[];

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * DTO for BCG business unit
 */
export class BCGBusinessUnitDto {
  @ApiProperty({ description: 'Business unit name' })
  @IsString()
  @IsNotEmpty()
  unitName: string;

  @ApiProperty({ description: 'Strategic position', enum: StrategicPosition })
  @IsEnum(StrategicPosition)
  position: StrategicPosition;

  @ApiProperty({ description: 'Market growth rate percentage' })
  @IsNumber()
  @Min(0)
  marketGrowthRate: number;

  @ApiProperty({ description: 'Relative market share ratio' })
  @IsNumber()
  @Min(0)
  relativeMarketShare: number;

  @ApiProperty({ description: 'Revenue amount' })
  @IsNumber()
  @Min(0)
  revenue: number;

  @ApiProperty({ description: 'Profit margin percentage' })
  @IsNumber()
  profitMargin: number;

  @ApiProperty({ description: 'Strategic importance score 1-10' })
  @IsNumber()
  @Min(1)
  @Max(10)
  strategicImportance: number;

  @ApiProperty({ description: 'Recommended strategy' })
  @IsString()
  @IsNotEmpty()
  recommendedStrategy: string;
}

/**
 * DTO for creating Ansoff Matrix analysis
 */
export class CreateAnsoffMatrixDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'Analysis name' })
  @IsString()
  @IsNotEmpty()
  analysisName: string;

  @ApiProperty({ description: 'Analysis date' })
  @IsString()
  @IsNotEmpty()
  analysisDate: string;

  @ApiProperty({ description: 'Market penetration initiatives', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GrowthInitiativeDto)
  marketPenetration: GrowthInitiativeDto[];

  @ApiProperty({ description: 'Market development initiatives', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GrowthInitiativeDto)
  marketDevelopment: GrowthInitiativeDto[];

  @ApiProperty({ description: 'Product development initiatives', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GrowthInitiativeDto)
  productDevelopment: GrowthInitiativeDto[];

  @ApiProperty({ description: 'Diversification initiatives', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GrowthInitiativeDto)
  diversification: GrowthInitiativeDto[];

  @ApiProperty({ description: 'Recommended growth strategy', enum: GrowthStrategy })
  @IsEnum(GrowthStrategy)
  recommendedStrategy: GrowthStrategy;
}

/**
 * DTO for growth initiative
 */
export class GrowthInitiativeDto {
  @ApiProperty({ description: 'Initiative name' })
  @IsString()
  @IsNotEmpty()
  initiativeName: string;

  @ApiProperty({ description: 'Initiative description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Expected revenue' })
  @IsNumber()
  @Min(0)
  expectedRevenue: number;

  @ApiProperty({ description: 'Investment required' })
  @IsNumber()
  @Min(0)
  investmentRequired: number;

  @ApiProperty({ description: 'ROI percentage' })
  @IsNumber()
  roi: number;

  @ApiProperty({ description: 'Time to market in months' })
  @IsNumber()
  @Min(0)
  timeToMarket: number;

  @ApiProperty({ description: 'Risk level', enum: StrategicRiskLevel })
  @IsEnum(StrategicRiskLevel)
  riskLevel: StrategicRiskLevel;

  @ApiProperty({ description: 'Success probability 0-1' })
  @IsNumber()
  @Min(0)
  @Max(1)
  successProbability: number;

  @ApiProperty({ description: 'Strategic fit score 1-10' })
  @IsNumber()
  @Min(1)
  @Max(10)
  strategicFit: number;

  @ApiProperty({ description: 'Priority level', enum: StrategyPriority })
  @IsEnum(StrategyPriority)
  priority: StrategyPriority;
}

/**
 * DTO for creating Balanced Scorecard
 */
export class CreateBalancedScorecardDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'Scorecard name' })
  @IsString()
  @IsNotEmpty()
  scorecardName: string;

  @ApiProperty({ description: 'Period (e.g., Q1 2024)' })
  @IsString()
  @IsNotEmpty()
  period: string;

  @ApiProperty({ description: 'Financial perspective metrics' })
  @ValidateNested()
  @Type(() => PerspectiveMetricsDto)
  financialPerspective: PerspectiveMetricsDto;

  @ApiProperty({ description: 'Customer perspective metrics' })
  @ValidateNested()
  @Type(() => PerspectiveMetricsDto)
  customerPerspective: PerspectiveMetricsDto;

  @ApiProperty({ description: 'Internal process perspective metrics' })
  @ValidateNested()
  @Type(() => PerspectiveMetricsDto)
  internalProcessPerspective: PerspectiveMetricsDto;

  @ApiProperty({ description: 'Learning & growth perspective metrics' })
  @ValidateNested()
  @Type(() => PerspectiveMetricsDto)
  learningGrowthPerspective: PerspectiveMetricsDto;
}

/**
 * DTO for perspective metrics
 */
export class PerspectiveMetricsDto {
  @ApiProperty({ description: 'Perspective type', enum: ['financial', 'customer', 'internal', 'learning'] })
  @IsEnum(['financial', 'customer', 'internal', 'learning'])
  perspective: 'financial' | 'customer' | 'internal' | 'learning';

  @ApiProperty({ description: 'Strategic objectives', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StrategicObjectiveDto)
  objectives: StrategicObjectiveDto[];

  @ApiProperty({ description: 'Performance measures', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerformanceMeasureDto)
  measures: PerformanceMeasureDto[];

  @ApiProperty({ description: 'Target score' })
  @IsNumber()
  @Min(0)
  @Max(100)
  targetScore: number;
}

/**
 * DTO for strategic objective
 */
export class StrategicObjectiveDto {
  @ApiProperty({ description: 'Objective name' })
  @IsString()
  @IsNotEmpty()
  objectiveName: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Weight percentage' })
  @IsNumber()
  @Min(0)
  @Max(100)
  weight: number;

  @ApiProperty({ description: 'Owner' })
  @IsString()
  @IsNotEmpty()
  owner: string;
}

/**
 * DTO for performance measure
 */
export class PerformanceMeasureDto {
  @ApiProperty({ description: 'Measure name' })
  @IsString()
  @IsNotEmpty()
  measureName: string;

  @ApiProperty({ description: 'Metric type', enum: ['leading', 'lagging'] })
  @IsEnum(['leading', 'lagging'])
  metricType: 'leading' | 'lagging';

  @ApiProperty({ description: 'Unit of measurement' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ description: 'Target value' })
  @IsNumber()
  targetValue: number;

  @ApiProperty({ description: 'Baseline value' })
  @IsNumber()
  baseline: number;

  @ApiProperty({ description: 'Measurement frequency', enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annual'] })
  @IsEnum(['daily', 'weekly', 'monthly', 'quarterly', 'annual'])
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
}

/**
 * DTO for creating scenario planning analysis
 */
export class CreateScenarioPlanningDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'Analysis name' })
  @IsString()
  @IsNotEmpty()
  analysisName: string;

  @ApiProperty({ description: 'Time horizon' })
  @IsString()
  @IsNotEmpty()
  timeHorizon: string;

  @ApiProperty({ description: 'Scenarios', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScenarioDto)
  scenarios: ScenarioDto[];

  @ApiProperty({ description: 'Critical uncertainties', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriticalUncertaintyDto)
  criticalUncertainties: CriticalUncertaintyDto[];
}

/**
 * DTO for scenario
 */
export class ScenarioDto {
  @ApiProperty({ description: 'Scenario name' })
  @IsString()
  @IsNotEmpty()
  scenarioName: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Probability 0-1' })
  @IsNumber()
  @Min(0)
  @Max(1)
  probability: number;

  @ApiProperty({ description: 'Impact score 1-10' })
  @IsNumber()
  @Min(1)
  @Max(10)
  impact: number;

  @ApiProperty({ description: 'Assumptions', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssumptionDto)
  assumptions: AssumptionDto[];

  @ApiProperty({ description: 'Strategic implications', type: [String] })
  @IsArray()
  @IsString({ each: true })
  strategicImplications: string[];
}

/**
 * DTO for assumption
 */
export class AssumptionDto {
  @ApiProperty({ description: 'Category' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Assumption text' })
  @IsString()
  @IsNotEmpty()
  assumption: string;

  @ApiProperty({ description: 'Confidence level 0-1' })
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;

  @ApiProperty({ description: 'Supporting evidence', type: [String] })
  @IsArray()
  @IsString({ each: true })
  evidenceSupport: string[];
}

/**
 * DTO for critical uncertainty
 */
export class CriticalUncertaintyDto {
  @ApiProperty({ description: 'Uncertainty name' })
  @IsString()
  @IsNotEmpty()
  uncertaintyName: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Impact score 1-10' })
  @IsNumber()
  @Min(1)
  @Max(10)
  impact: number;

  @ApiProperty({ description: 'Predictability score 1-10' })
  @IsNumber()
  @Min(1)
  @Max(10)
  predictability: number;

  @ApiProperty({ description: 'Monitoring method' })
  @IsString()
  @IsNotEmpty()
  monitoringMethod: string;

  @ApiProperty({ description: 'Owner' })
  @IsString()
  @IsNotEmpty()
  owner: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * SWOT Analysis Model
 * Stores comprehensive SWOT analysis data
 */
export class SWOTAnalysisModel extends Model {
  declare id: string;
  declare organizationId: string;
  declare analysisName: string;
  declare analysisDate: string;
  declare timeHorizon: string;
  declare strengths: string; // JSON
  declare weaknesses: string; // JSON
  declare opportunities: string; // JSON
  declare threats: string; // JSON
  declare strategicRecommendations: string; // JSON
  declare crossFactorAnalysis: string; // JSON
  declare status: InitiativeStatus;
  declare createdBy: string;
  declare approvedBy: string | null;
  declare approvedAt: Date | null;
  declare metadata: string; // JSON
  declare createdAt: Date;
  declare updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof SWOTAnalysisModel {
    SWOTAnalysisModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'organization_id',
        },
        analysisName: {
          type: DataTypes.STRING(200),
          allowNull: false,
          field: 'analysis_name',
        },
        analysisDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'analysis_date',
        },
        timeHorizon: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'time_horizon',
        },
        strengths: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
        },
        weaknesses: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
        },
        opportunities: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
        },
        threats: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
        },
        strategicRecommendations: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'strategic_recommendations',
        },
        crossFactorAnalysis: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'cross_factor_analysis',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(InitiativeStatus)),
          allowNull: false,
          defaultValue: InitiativeStatus.PROPOSED,
        },
        createdBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'created_by',
        },
        approvedBy: {
          type: DataTypes.UUID,
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
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'swot_analyses',
        underscored: true,
        timestamps: true,
      }
    );

    return SWOTAnalysisModel;
  }
}

/**
 * Porter Five Forces Model
 * Stores Porter's Five Forces analysis
 */
export class PorterFiveForcesModel extends Model {
  declare id: string;
  declare organizationId: string;
  declare industry: string;
  declare analysisDate: string;
  declare competitiveRivalry: string; // JSON
  declare threatOfNewEntrants: string; // JSON
  declare bargainingPowerSuppliers: string; // JSON
  declare bargainingPowerBuyers: string; // JSON
  declare threatOfSubstitutes: string; // JSON
  declare overallAttractiveness: number;
  declare strategicImplications: string; // JSON
  declare actionItems: string; // JSON
  declare metadata: string; // JSON
  declare createdAt: Date;
  declare updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof PorterFiveForcesModel {
    PorterFiveForcesModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'organization_id',
        },
        industry: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        analysisDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'analysis_date',
        },
        competitiveRivalry: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'competitive_rivalry',
        },
        threatOfNewEntrants: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'threat_of_new_entrants',
        },
        bargainingPowerSuppliers: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'bargaining_power_suppliers',
        },
        bargainingPowerBuyers: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'bargaining_power_buyers',
        },
        threatOfSubstitutes: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'threat_of_substitutes',
        },
        overallAttractiveness: {
          type: DataTypes.DECIMAL(3, 1),
          allowNull: false,
          field: 'overall_attractiveness',
        },
        strategicImplications: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'strategic_implications',
        },
        actionItems: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'action_items',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'porter_five_forces_analyses',
        underscored: true,
        timestamps: true,
      }
    );

    return PorterFiveForcesModel;
  }
}

/**
 * BCG Matrix Model
 * Stores BCG Matrix portfolio analysis
 */
export class BCGMatrixModel extends Model {
  declare id: string;
  declare organizationId: string;
  declare portfolioName: string;
  declare analysisDate: string;
  declare businessUnits: string; // JSON
  declare portfolioRecommendations: string; // JSON
  declare resourceAllocation: string; // JSON
  declare strategicGaps: string; // JSON
  declare metadata: string; // JSON
  declare createdAt: Date;
  declare updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof BCGMatrixModel {
    BCGMatrixModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'organization_id',
        },
        portfolioName: {
          type: DataTypes.STRING(200),
          allowNull: false,
          field: 'portfolio_name',
        },
        analysisDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'analysis_date',
        },
        businessUnits: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'business_units',
        },
        portfolioRecommendations: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'portfolio_recommendations',
        },
        resourceAllocation: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'resource_allocation',
        },
        strategicGaps: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'strategic_gaps',
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'bcg_matrix_analyses',
        underscored: true,
        timestamps: true,
      }
    );

    return BCGMatrixModel;
  }
}

/**
 * Balanced Scorecard Model
 * Stores balanced scorecard data
 */
export class BalancedScorecardModel extends Model {
  declare id: string;
  declare organizationId: string;
  declare scorecardName: string;
  declare period: string;
  declare financialPerspective: string; // JSON
  declare customerPerspective: string; // JSON
  declare internalProcessPerspective: string; // JSON
  declare learningGrowthPerspective: string; // JSON
  declare strategicObjectives: string; // JSON
  declare strategyMap: string; // JSON
  declare overallScore: number;
  declare status: InitiativeStatus;
  declare metadata: string; // JSON
  declare createdAt: Date;
  declare updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof BalancedScorecardModel {
    BalancedScorecardModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'organization_id',
        },
        scorecardName: {
          type: DataTypes.STRING(200),
          allowNull: false,
          field: 'scorecard_name',
        },
        period: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        financialPerspective: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'financial_perspective',
        },
        customerPerspective: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'customer_perspective',
        },
        internalProcessPerspective: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'internal_process_perspective',
        },
        learningGrowthPerspective: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'learning_growth_perspective',
        },
        strategicObjectives: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'strategic_objectives',
        },
        strategyMap: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'strategy_map',
        },
        overallScore: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'overall_score',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(InitiativeStatus)),
          allowNull: false,
          defaultValue: InitiativeStatus.IN_PROGRESS,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'balanced_scorecards',
        underscored: true,
        timestamps: true,
      }
    );

    return BalancedScorecardModel;
  }
}

// ============================================================================
// FUNCTION 1: CREATE SWOT ANALYSIS
// ============================================================================

/**
 * Function 1: Create comprehensive SWOT analysis
 *
 * Generates a complete SWOT analysis with strengths, weaknesses, opportunities,
 * threats, cross-factor analysis, and strategic recommendations.
 *
 * @param context - Strategy context
 * @param data - SWOT analysis data
 * @param transaction - Database transaction
 * @returns Created SWOT analysis
 *
 * @example
 * ```typescript
 * const swot = await createSWOTAnalysis(
 *   context,
 *   {
 *     organizationId: 'org-123',
 *     analysisName: 'Q4 2024 Strategic SWOT',
 *     strengths: [{ category: 'strength', description: 'Market leader', impact: 9, urgency: 8 }],
 *     // ... other data
 *   },
 *   transaction
 * );
 * ```
 */
export async function createSWOTAnalysis(
  context: StrategyContext,
  data: Partial<SWOTAnalysis>,
  transaction?: Transaction
): Promise<SWOTAnalysis> {
  try {
    const swotId = data.id || generateUUID();
    const timestamp = new Date().toISOString();

    // Generate cross-factor analysis
    const crossFactorAnalysis = generateCrossFactorAnalysis(
      data.strengths || [],
      data.weaknesses || [],
      data.opportunities || [],
      data.threats || []
    );

    // Generate strategic recommendations
    const recommendations = generateSWOTRecommendations(
      data.strengths || [],
      data.weaknesses || [],
      data.opportunities || [],
      data.threats || [],
      crossFactorAnalysis
    );

    const swotAnalysis: SWOTAnalysis = {
      id: swotId,
      organizationId: data.organizationId || context.organizationId,
      analysisName: data.analysisName || 'SWOT Analysis',
      analysisDate: data.analysisDate || timestamp.split('T')[0],
      timeHorizon: data.timeHorizon || '12 months',
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      opportunities: data.opportunities || [],
      threats: data.threats || [],
      strategicRecommendations: recommendations,
      crossFactorAnalysis,
      status: data.status || InitiativeStatus.PROPOSED,
      createdBy: context.userId,
      approvedBy: data.approvedBy,
      approvedAt: data.approvedAt,
      metadata: {
        ...data.metadata,
        createdAt: timestamp,
        framework: StrategyFramework.SWOT,
      },
    };

    // Store in database
    await SWOTAnalysisModel.create(
      {
        ...swotAnalysis,
        strengths: JSON.stringify(swotAnalysis.strengths),
        weaknesses: JSON.stringify(swotAnalysis.weaknesses),
        opportunities: JSON.stringify(swotAnalysis.opportunities),
        threats: JSON.stringify(swotAnalysis.threats),
        strategicRecommendations: JSON.stringify(swotAnalysis.strategicRecommendations),
        crossFactorAnalysis: JSON.stringify(swotAnalysis.crossFactorAnalysis),
        metadata: JSON.stringify(swotAnalysis.metadata),
      },
      { transaction }
    );

    return swotAnalysis;
  } catch (error) {
    throw new Error(`Failed to create SWOT analysis: ${error.message}`);
  }
}

// ============================================================================
// FUNCTION 2: GENERATE CROSS-FACTOR SWOT ANALYSIS
// ============================================================================

/**
 * Function 2: Generate cross-factor SWOT analysis (SO, WO, ST, WT strategies)
 *
 * Analyzes combinations of SWOT factors to identify strategic options:
 * - SO: Use strengths to capitalize on opportunities
 * - WO: Overcome weaknesses to pursue opportunities
 * - ST: Use strengths to mitigate threats
 * - WT: Minimize weaknesses and avoid threats
 *
 * @param strengths - List of strengths
 * @param weaknesses - List of weaknesses
 * @param opportunities - List of opportunities
 * @param threats - List of threats
 * @returns Cross-factor strategic options
 *
 * @example
 * ```typescript
 * const crossFactors = generateCrossFactorAnalysis(strengths, weaknesses, opportunities, threats);
 * // Returns SO, WO, ST, WT strategic recommendations
 * ```
 */
export function generateCrossFactorAnalysis(
  strengths: SWOTItem[],
  weaknesses: SWOTItem[],
  opportunities: SWOTItem[],
  threats: SWOTItem[]
): CrossFactorAnalysis[] {
  const crossFactors: CrossFactorAnalysis[] = [];

  // SO Strategies: Strength-Opportunity
  const topStrengths = strengths.sort((a, b) => b.impact - a.impact).slice(0, 3);
  const topOpportunities = opportunities.sort((a, b) => b.impact - a.impact).slice(0, 3);

  topStrengths.forEach((strength, i) => {
    const opp = topOpportunities[i];
    if (opp) {
      crossFactors.push({
        type: 'SO',
        strategy: `Leverage ${strength.description} to capitalize on ${opp.description}`,
        relatedStrengths: [strength.id],
        relatedOpportunities: [opp.id],
        priority: strength.impact + opp.impact > 15 ? StrategyPriority.HIGH : StrategyPriority.MEDIUM,
        estimatedImpact: (strength.impact + opp.impact) / 2,
        implementationComplexity: 5,
      });
    }
  });

  // WO Strategies: Weakness-Opportunity
  const criticalWeaknesses = weaknesses.sort((a, b) => b.urgency - a.urgency).slice(0, 2);
  criticalWeaknesses.forEach((weakness, i) => {
    const opp = topOpportunities[i];
    if (opp) {
      crossFactors.push({
        type: 'WO',
        strategy: `Address ${weakness.description} to enable pursuit of ${opp.description}`,
        relatedWeaknesses: [weakness.id],
        relatedOpportunities: [opp.id],
        priority: StrategyPriority.MEDIUM,
        estimatedImpact: opp.impact - weakness.impact,
        implementationComplexity: 7,
      });
    }
  });

  // ST Strategies: Strength-Threat
  const topThreats = threats.sort((a, b) => b.urgency - a.urgency).slice(0, 3);
  topStrengths.forEach((strength, i) => {
    const threat = topThreats[i];
    if (threat) {
      crossFactors.push({
        type: 'ST',
        strategy: `Use ${strength.description} to mitigate ${threat.description}`,
        relatedStrengths: [strength.id],
        relatedThreats: [threat.id],
        priority: threat.urgency > 7 ? StrategyPriority.HIGH : StrategyPriority.MEDIUM,
        estimatedImpact: strength.impact - threat.impact,
        implementationComplexity: 6,
      });
    }
  });

  // WT Strategies: Weakness-Threat
  criticalWeaknesses.forEach((weakness, i) => {
    const threat = topThreats[i];
    if (threat) {
      crossFactors.push({
        type: 'WT',
        strategy: `Minimize ${weakness.description} to reduce exposure to ${threat.description}`,
        relatedWeaknesses: [weakness.id],
        relatedThreats: [threat.id],
        priority: StrategyPriority.CRITICAL,
        estimatedImpact: 10 - ((weakness.impact + threat.impact) / 2),
        implementationComplexity: 8,
      });
    }
  });

  return crossFactors.sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1, deferred: 0 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

// ============================================================================
// FUNCTION 3: GENERATE SWOT STRATEGIC RECOMMENDATIONS
// ============================================================================

/**
 * Function 3: Generate strategic recommendations from SWOT analysis
 *
 * Creates prioritized strategic recommendations based on SWOT factors
 * and cross-factor analysis.
 *
 * @param strengths - List of strengths
 * @param weaknesses - List of weaknesses
 * @param opportunities - List of opportunities
 * @param threats - List of threats
 * @param crossFactors - Cross-factor analysis results
 * @returns Prioritized strategic recommendations
 *
 * @example
 * ```typescript
 * const recommendations = generateSWOTRecommendations(
 *   strengths, weaknesses, opportunities, threats, crossFactors
 * );
 * ```
 */
export function generateSWOTRecommendations(
  strengths: SWOTItem[],
  weaknesses: SWOTItem[],
  opportunities: SWOTItem[],
  threats: SWOTItem[],
  crossFactors: CrossFactorAnalysis[]
): StrategicRecommendation[] {
  const recommendations: StrategicRecommendation[] = [];

  // Generate recommendations from cross-factor strategies
  crossFactors.forEach((cf, index) => {
    recommendations.push({
      id: `rec-${index + 1}`,
      recommendation: cf.strategy,
      rationale: `Based on ${cf.type} strategic analysis`,
      expectedBenefit: `Impact score: ${cf.estimatedImpact.toFixed(1)}/10`,
      implementationCost: cf.implementationComplexity * 100000,
      timeframe: cf.implementationComplexity < 6 ? '3-6 months' : '6-12 months',
      priority: cf.priority,
      risks: [`Implementation complexity: ${cf.implementationComplexity}/10`],
      dependencies: [],
    });
  });

  // Add urgent threat mitigation recommendations
  const urgentThreats = threats.filter(t => t.urgency >= 8);
  urgentThreats.forEach((threat, index) => {
    recommendations.push({
      id: `threat-rec-${index + 1}`,
      recommendation: `Immediate action required: ${threat.actionItems.join(', ')}`,
      rationale: `Critical threat identified: ${threat.description}`,
      expectedBenefit: 'Prevent significant business impact',
      implementationCost: threat.impact * 50000,
      timeframe: '1-3 months',
      priority: StrategyPriority.CRITICAL,
      risks: ['Delayed action may result in competitive disadvantage'],
      dependencies: [],
    });
  });

  return recommendations.sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1, deferred: 0 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

// ============================================================================
// FUNCTION 4: CREATE PORTER'S FIVE FORCES ANALYSIS
// ============================================================================

/**
 * Function 4: Create Porter's Five Forces industry analysis
 *
 * Analyzes industry competitive forces: rivalry, new entrants, suppliers,
 * buyers, and substitutes to determine industry attractiveness.
 *
 * @param context - Strategy context
 * @param data - Five forces analysis data
 * @param transaction - Database transaction
 * @returns Created Porter's Five Forces analysis
 *
 * @example
 * ```typescript
 * const analysis = await createPorterFiveForcesAnalysis(context, {
 *   industry: 'Software as a Service',
 *   competitiveRivalry: { intensity: 'high', intensityScore: 8, ... },
 *   // ... other forces
 * });
 * ```
 */
export async function createPorterFiveForcesAnalysis(
  context: StrategyContext,
  data: Partial<PorterFiveForcesAnalysis>,
  transaction?: Transaction
): Promise<PorterFiveForcesAnalysis> {
  try {
    const analysisId = generateUUID();
    const timestamp = new Date().toISOString();

    // Calculate overall industry attractiveness
    const attractiveness = calculateIndustryAttractiveness([
      data.competitiveRivalry!,
      data.threatOfNewEntrants!,
      data.bargainingPowerSuppliers!,
      data.bargainingPowerBuyers!,
      data.threatOfSubstitutes!,
    ]);

    // Generate strategic implications
    const implications = generatePorterImplications(
      data.competitiveRivalry!,
      data.threatOfNewEntrants!,
      data.bargainingPowerSuppliers!,
      data.bargainingPowerBuyers!,
      data.threatOfSubstitutes!
    );

    const analysis: PorterFiveForcesAnalysis = {
      id: analysisId,
      organizationId: data.organizationId || context.organizationId,
      industry: data.industry || 'Unknown Industry',
      analysisDate: data.analysisDate || timestamp.split('T')[0],
      competitiveRivalry: data.competitiveRivalry!,
      threatOfNewEntrants: data.threatOfNewEntrants!,
      bargainingPowerSuppliers: data.bargainingPowerSuppliers!,
      bargainingPowerBuyers: data.bargainingPowerBuyers!,
      threatOfSubstitutes: data.threatOfSubstitutes!,
      overallAttractiveness: attractiveness,
      strategicImplications: implications,
      actionItems: data.actionItems || [],
      metadata: {
        ...data.metadata,
        createdAt: timestamp,
        framework: StrategyFramework.PORTER_FIVE_FORCES,
      },
    };

    await PorterFiveForcesModel.create(
      {
        ...analysis,
        competitiveRivalry: JSON.stringify(analysis.competitiveRivalry),
        threatOfNewEntrants: JSON.stringify(analysis.threatOfNewEntrants),
        bargainingPowerSuppliers: JSON.stringify(analysis.bargainingPowerSuppliers),
        bargainingPowerBuyers: JSON.stringify(analysis.bargainingPowerBuyers),
        threatOfSubstitutes: JSON.stringify(analysis.threatOfSubstitutes),
        strategicImplications: JSON.stringify(analysis.strategicImplications),
        actionItems: JSON.stringify(analysis.actionItems),
        metadata: JSON.stringify(analysis.metadata),
      },
      { transaction }
    );

    return analysis;
  } catch (error) {
    throw new Error(`Failed to create Porter's Five Forces analysis: ${error.message}`);
  }
}

// ============================================================================
// FUNCTION 5: CALCULATE INDUSTRY ATTRACTIVENESS
// ============================================================================

/**
 * Function 5: Calculate overall industry attractiveness score
 *
 * Aggregates the five forces intensity scores to determine overall
 * industry attractiveness (higher score = more attractive industry).
 *
 * @param forces - Array of force analyses
 * @returns Overall attractiveness score (1-10)
 *
 * @example
 * ```typescript
 * const score = calculateIndustryAttractiveness([
 *   rivalryAnalysis, newEntrantsAnalysis, suppliersAnalysis, buyersAnalysis, substitutesAnalysis
 * ]);
 * // Returns 6.5 (moderately attractive)
 * ```
 */
export function calculateIndustryAttractiveness(forces: ForceAnalysis[]): number {
  // Lower intensity = higher attractiveness
  const totalIntensity = forces.reduce((sum, force) => sum + force.intensityScore, 0);
  const avgIntensity = totalIntensity / forces.length;

  // Invert the scale (10 - avg gives attractiveness)
  const attractiveness = 10 - avgIntensity;

  return Math.max(1, Math.min(10, attractiveness));
}

// ============================================================================
// FUNCTION 6-45: Additional Strategic Planning Functions
// ============================================================================

// Helper function for UUID generation
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper function to generate Porter implications
function generatePorterImplications(
  rivalry: ForceAnalysis,
  newEntrants: ForceAnalysis,
  suppliers: ForceAnalysis,
  buyers: ForceAnalysis,
  substitutes: ForceAnalysis
): string[] {
  const implications: string[] = [];

  if (rivalry.intensityScore >= 7) {
    implications.push('High competitive rivalry requires differentiation strategy');
  }
  if (newEntrants.intensityScore >= 7) {
    implications.push('Low barriers to entry necessitate building competitive moats');
  }
  if (suppliers.intensityScore >= 7) {
    implications.push('Strong supplier power suggests vertical integration or diversification');
  }
  if (buyers.intensityScore >= 7) {
    implications.push('High buyer power requires customer lock-in mechanisms');
  }
  if (substitutes.intensityScore >= 7) {
    implications.push('Threat of substitutes demands continuous innovation');
  }

  return implications;
}

/**
 * Function 6: Create BCG Matrix portfolio analysis
 * Positions business units in BCG Matrix (Stars, Cash Cows, Question Marks, Dogs)
 */
export async function createBCGMatrixAnalysis(
  context: StrategyContext,
  data: Partial<BCGMatrixAnalysis>,
  transaction?: Transaction
): Promise<BCGMatrixAnalysis> {
  try {
    const analysisId = generateUUID();
    const timestamp = new Date().toISOString();

    // Position each business unit in BCG matrix
    const positionedUnits = data.businessUnits!.map(unit => ({
      ...unit,
      position: determineBCGPosition(unit.marketGrowthRate, unit.relativeMarketShare),
      recommendedStrategy: getBCGStrategy(unit),
      investmentPriority: getInvestmentPriority(unit),
    }));

    // Generate portfolio recommendations
    const recommendations = generatePortfolioRecommendations(positionedUnits);

    // Calculate resource allocation
    const resourceAllocation = calculateResourceAllocation(positionedUnits);

    const analysis: BCGMatrixAnalysis = {
      id: analysisId,
      organizationId: data.organizationId || context.organizationId,
      portfolioName: data.portfolioName || 'Portfolio Analysis',
      analysisDate: data.analysisDate || timestamp.split('T')[0],
      businessUnits: positionedUnits,
      portfolioRecommendations: recommendations,
      resourceAllocation,
      strategicGaps: identifyStrategicGaps(positionedUnits),
      metadata: {
        ...data.metadata,
        createdAt: timestamp,
        framework: StrategyFramework.BCG_MATRIX,
      },
    };

    await BCGMatrixModel.create(
      {
        ...analysis,
        businessUnits: JSON.stringify(analysis.businessUnits),
        portfolioRecommendations: JSON.stringify(analysis.portfolioRecommendations),
        resourceAllocation: JSON.stringify(analysis.resourceAllocation),
        strategicGaps: JSON.stringify(analysis.strategicGaps),
        metadata: JSON.stringify(analysis.metadata),
      },
      { transaction }
    );

    return analysis;
  } catch (error) {
    throw new Error(`Failed to create BCG Matrix analysis: ${error.message}`);
  }
}

/**
 * Function 7: Determine BCG Matrix position
 * Classifies business unit into Stars, Cash Cows, Question Marks, or Dogs
 */
export function determineBCGPosition(
  marketGrowthRate: number,
  relativeMarketShare: number
): StrategicPosition {
  const highGrowth = marketGrowthRate >= 10; // 10% threshold
  const highShare = relativeMarketShare >= 1.0; // 1.0 = market leader

  if (highGrowth && highShare) return StrategicPosition.STAR;
  if (!highGrowth && highShare) return StrategicPosition.CASH_COW;
  if (highGrowth && !highShare) return StrategicPosition.QUESTION_MARK;
  return StrategicPosition.DOG;
}

/**
 * Function 8: Get BCG strategy recommendation
 * Returns appropriate strategy based on BCG position
 */
export function getBCGStrategy(unit: BCGBusinessUnit): string {
  switch (unit.position) {
    case StrategicPosition.STAR:
      return 'Invest aggressively to maintain market leadership and capture growth';
    case StrategicPosition.CASH_COW:
      return 'Harvest cash flow while maintaining position with minimal investment';
    case StrategicPosition.QUESTION_MARK:
      return 'Evaluate growth potential; invest selectively or divest';
    case StrategicPosition.DOG:
      return 'Divest or turnaround if strategic value exists';
    default:
      return 'Conduct detailed strategic review';
  }
}

/**
 * Function 9: Calculate investment priority
 * Determines investment priority based on BCG position and strategic importance
 */
export function getInvestmentPriority(unit: BCGBusinessUnit): StrategyPriority {
  if (unit.position === StrategicPosition.STAR) return StrategyPriority.CRITICAL;
  if (unit.position === StrategicPosition.QUESTION_MARK && unit.strategicImportance >= 7) {
    return StrategyPriority.HIGH;
  }
  if (unit.position === StrategicPosition.CASH_COW) return StrategyPriority.MEDIUM;
  return StrategyPriority.LOW;
}

/**
 * Function 10: Generate portfolio recommendations
 * Creates strategic recommendations for portfolio management
 */
export function generatePortfolioRecommendations(units: BCGBusinessUnit[]): PortfolioRecommendation[] {
  const recommendations: PortfolioRecommendation[] = [];

  const stars = units.filter(u => u.position === StrategicPosition.STAR);
  const cows = units.filter(u => u.position === StrategicPosition.CASH_COW);
  const questions = units.filter(u => u.position === StrategicPosition.QUESTION_MARK);
  const dogs = units.filter(u => u.position === StrategicPosition.DOG);

  if (stars.length > 0) {
    recommendations.push({
      type: 'invest',
      businessUnits: stars.map(s => s.id),
      rationale: 'Stars are high-growth market leaders requiring investment to maintain position',
      expectedOutcome: 'Sustained market leadership and future cash generation',
      risks: ['Market growth may slow', 'Competition may intensify'],
      requiredInvestment: stars.reduce((sum, s) => sum + s.revenue * 0.2, 0),
      expectedReturn: stars.reduce((sum, s) => sum + s.revenue * 0.3, 0),
      timeframe: '2-3 years',
    });
  }

  if (cows.length > 0) {
    recommendations.push({
      type: 'harvest',
      businessUnits: cows.map(c => c.id),
      rationale: 'Cash Cows generate strong cash flow in mature markets',
      expectedOutcome: 'Maximize cash extraction for portfolio investment',
      risks: ['Market may decline faster than expected'],
      requiredInvestment: cows.reduce((sum, c) => sum + c.revenue * 0.05, 0),
      expectedReturn: cows.reduce((sum, c) => sum + c.revenue * c.profitMargin, 0),
      timeframe: 'Ongoing',
    });
  }

  return recommendations;
}

/**
 * Function 11: Calculate resource allocation
 * Determines optimal resource distribution across portfolio
 */
export function calculateResourceAllocation(units: BCGBusinessUnit[]): ResourceAllocation[] {
  const totalRevenue = units.reduce((sum, u) => sum + u.revenue, 0);
  const allocations: ResourceAllocation[] = [];

  units.forEach(unit => {
    const currentAllocation = (unit.revenue / totalRevenue) * 100;
    let recommendedAllocation = currentAllocation;

    // Adjust based on position
    if (unit.position === StrategicPosition.STAR) {
      recommendedAllocation *= 1.2; // 20% more
    } else if (unit.position === StrategicPosition.DOG) {
      recommendedAllocation *= 0.5; // 50% less
    }

    allocations.push({
      businessUnitId: unit.id,
      allocationType: 'capital',
      currentAllocation,
      recommendedAllocation,
      variance: recommendedAllocation - currentAllocation,
      justification: `Based on ${unit.position} position and ${unit.strategicImportance}/10 strategic importance`,
    });
  });

  return allocations;
}

/**
 * Function 12: Identify strategic gaps in portfolio
 * Detects portfolio imbalances and risks
 */
export function identifyStrategicGaps(units: BCGBusinessUnit[]): string[] {
  const gaps: string[] = [];

  const stars = units.filter(u => u.position === StrategicPosition.STAR);
  const cows = units.filter(u => u.position === StrategicPosition.CASH_COW);
  const questions = units.filter(u => u.position === StrategicPosition.QUESTION_MARK);
  const dogs = units.filter(u => u.position === StrategicPosition.DOG);

  if (stars.length === 0) {
    gaps.push('No Stars: Portfolio lacks high-growth market leaders');
  }

  if (cows.length === 0) {
    gaps.push('No Cash Cows: Portfolio may face cash flow challenges');
  }

  if (dogs.length / units.length > 0.3) {
    gaps.push('Too many Dogs: Portfolio needs pruning and reallocation');
  }

  if (questions.length / units.length > 0.4) {
    gaps.push('Too many Question Marks: Portfolio has excessive risk and uncertainty');
  }

  return gaps;
}

/**
 * Function 13: Create Ansoff Matrix growth analysis
 * Analyzes growth strategies across market/product dimensions
 */
export async function createAnsoffMatrixAnalysis(
  context: StrategyContext,
  data: Partial<AnsoffMatrixAnalysis>,
  transaction?: Transaction
): Promise<AnsoffMatrixAnalysis> {
  try {
    const analysisId = generateUUID();
    const timestamp = new Date().toISOString();

    // Assess risk for each quadrant
    const riskAssessment = assessAnsoffRisk(
      data.marketPenetration || [],
      data.marketDevelopment || [],
      data.productDevelopment || [],
      data.diversification || []
    );

    const analysis: AnsoffMatrixAnalysis = {
      id: analysisId,
      organizationId: data.organizationId || context.organizationId,
      analysisName: data.analysisName || 'Growth Strategy Analysis',
      analysisDate: data.analysisDate || timestamp.split('T')[0],
      marketPenetration: data.marketPenetration || [],
      marketDevelopment: data.marketDevelopment || [],
      productDevelopment: data.productDevelopment || [],
      diversification: data.diversification || [],
      recommendedStrategy: data.recommendedStrategy || GrowthStrategy.MARKET_PENETRATION,
      riskAssessment,
      metadata: {
        ...data.metadata,
        createdAt: timestamp,
        framework: StrategyFramework.ANSOFF_MATRIX,
      },
    };

    return analysis;
  } catch (error) {
    throw new Error(`Failed to create Ansoff Matrix analysis: ${error.message}`);
  }
}

/**
 * Function 14: Assess Ansoff Matrix risk levels
 * Evaluates risk across all growth strategies
 */
export function assessAnsoffRisk(
  marketPen: GrowthInitiative[],
  marketDev: GrowthInitiative[],
  productDev: GrowthInitiative[],
  diversification: GrowthInitiative[]
): StrategyRiskAssessment {
  const allInitiatives = [...marketPen, ...marketDev, ...productDev, ...diversification];

  const marketRisks: RiskItem[] = [
    {
      id: 'mr-1',
      riskDescription: 'Market acceptance uncertainty',
      probability: 0.6,
      impact: 7,
      riskScore: 4.2,
      category: 'market',
    },
  ];

  const operationalRisks: RiskItem[] = [
    {
      id: 'or-1',
      riskDescription: 'Execution capability gaps',
      probability: 0.5,
      impact: 6,
      riskScore: 3.0,
      category: 'operational',
    },
  ];

  const avgRisk = allInitiatives.reduce((sum, i) => {
    const riskValue = { critical: 5, high: 4, moderate: 3, low: 2, negligible: 1 };
    return sum + riskValue[i.riskLevel];
  }, 0) / allInitiatives.length;

  return {
    overallRisk: avgRisk > 3.5 ? StrategicRiskLevel.HIGH : StrategicRiskLevel.MODERATE,
    riskScore: avgRisk * 20,
    marketRisks,
    operationalRisks,
    financialRisks: [],
    competitiveRisks: [],
    mitigationPlan: [],
  };
}

/**
 * Function 15: Create Balanced Scorecard
 * Implements balanced scorecard strategic performance management
 */
export async function createBalancedScorecard(
  context: StrategyContext,
  data: Partial<BalancedScorecard>,
  transaction?: Transaction
): Promise<BalancedScorecard> {
  try {
    const scorecardId = generateUUID();
    const timestamp = new Date().toISOString();

    // Calculate overall score from all perspectives
    const perspectives = [
      data.financialPerspective,
      data.customerPerspective,
      data.internalProcessPerspective,
      data.learningGrowthPerspective,
    ].filter(Boolean);

    const overallScore = perspectives.reduce((sum, p) => sum + (p?.currentScore || 0), 0) / perspectives.length;

    // Build strategy map
    const strategyMap = buildStrategyMap(data.strategicObjectives || []);

    const scorecard: BalancedScorecard = {
      id: scorecardId,
      organizationId: data.organizationId || context.organizationId,
      scorecardName: data.scorecardName || 'Balanced Scorecard',
      period: data.period || new Date().toISOString().slice(0, 7),
      financialPerspective: data.financialPerspective!,
      customerPerspective: data.customerPerspective!,
      internalProcessPerspective: data.internalProcessPerspective!,
      learningGrowthPerspective: data.learningGrowthPerspective!,
      strategicObjectives: data.strategicObjectives || [],
      strategyMap,
      overallScore,
      status: data.status || InitiativeStatus.IN_PROGRESS,
      metadata: {
        ...data.metadata,
        createdAt: timestamp,
        framework: StrategyFramework.BALANCED_SCORECARD,
      },
    };

    await BalancedScorecardModel.create(
      {
        ...scorecard,
        financialPerspective: JSON.stringify(scorecard.financialPerspective),
        customerPerspective: JSON.stringify(scorecard.customerPerspective),
        internalProcessPerspective: JSON.stringify(scorecard.internalProcessPerspective),
        learningGrowthPerspective: JSON.stringify(scorecard.learningGrowthPerspective),
        strategicObjectives: JSON.stringify(scorecard.strategicObjectives),
        strategyMap: JSON.stringify(scorecard.strategyMap),
        metadata: JSON.stringify(scorecard.metadata),
      },
      { transaction }
    );

    return scorecard;
  } catch (error) {
    throw new Error(`Failed to create Balanced Scorecard: ${error.message}`);
  }
}

/**
 * Function 16: Build strategy map
 * Creates causal linkages between strategic objectives
 */
export function buildStrategyMap(objectives: StrategicObjective[]): StrategyMapNode[] {
  const map: StrategyMapNode[] = [];

  objectives.forEach(obj => {
    map.push({
      objectiveId: obj.id,
      perspective: obj.perspective,
      dependencies: [],
      contributesTo: obj.linkedObjectives || [],
    });
  });

  return map;
}

/**
 * Function 17: Calculate balanced scorecard performance
 * Computes weighted performance scores across perspectives
 */
export function calculateBalancedScorecardPerformance(scorecard: BalancedScorecard): number {
  const perspectives = [
    scorecard.financialPerspective,
    scorecard.customerPerspective,
    scorecard.internalProcessPerspective,
    scorecard.learningGrowthPerspective,
  ];

  let totalScore = 0;
  let totalWeight = 0;

  perspectives.forEach(perspective => {
    perspective.objectives.forEach(objective => {
      totalScore += (objective.weight / 100) * (perspective.currentScore || 0);
      totalWeight += objective.weight;
    });
  });

  return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
}

/**
 * Function 18: Track BSC measure performance
 * Monitors KPI performance against targets
 */
export function trackMeasurePerformance(
  measure: PerformanceMeasure,
  actualValue: number
): Target {
  const variance = actualValue - measure.targetValue;
  const variancePercent = (variance / measure.targetValue) * 100;

  let status: 'on-track' | 'at-risk' | 'behind' | 'achieved';
  if (actualValue >= measure.targetValue) {
    status = 'achieved';
  } else if (variancePercent > -10) {
    status = 'on-track';
  } else if (variancePercent > -20) {
    status = 'at-risk';
  } else {
    status = 'behind';
  }

  return {
    measureId: measure.id,
    period: new Date().toISOString().slice(0, 7),
    targetValue: measure.targetValue,
    actualValue,
    variance,
    status,
  };
}

/**
 * Function 19: Create scenario planning analysis
 * Develops multiple future scenarios for strategic planning
 */
export async function createScenarioPlanningAnalysis(
  context: StrategyContext,
  data: Partial<ScenarioPlanningAnalysis>,
  transaction?: Transaction
): Promise<ScenarioPlanningAnalysis> {
  try {
    const analysisId = generateUUID();
    const timestamp = new Date().toISOString();

    // Generate early warning indicators for each scenario
    const indicators = generateEarlyWarningIndicators(data.scenarios || []);

    // Create contingency plans
    const contingencyPlans = generateContingencyPlans(data.scenarios || []);

    const analysis: ScenarioPlanningAnalysis = {
      id: analysisId,
      organizationId: data.organizationId || context.organizationId,
      analysisName: data.analysisName || 'Scenario Planning Analysis',
      timeHorizon: data.timeHorizon || '5 years',
      scenarios: data.scenarios || [],
      criticalUncertainties: data.criticalUncertainties || [],
      earlyWarningIndicators: indicators,
      contingencyPlans,
      recommendedActions: data.recommendedActions || [],
      metadata: {
        ...data.metadata,
        createdAt: timestamp,
        framework: StrategyFramework.SCENARIO_PLANNING,
      },
    };

    return analysis;
  } catch (error) {
    throw new Error(`Failed to create scenario planning analysis: ${error.message}`);
  }
}

/**
 * Function 20: Generate early warning indicators
 * Creates monitoring indicators for scenario triggers
 */
export function generateEarlyWarningIndicators(scenarios: Scenario[]): EarlyWarningIndicator[] {
  const indicators: EarlyWarningIndicator[] = [];

  scenarios.forEach((scenario, index) => {
    scenario.assumptions.forEach((assumption, aIndex) => {
      indicators.push({
        id: `ewi-${index}-${aIndex}`,
        indicatorName: `Monitor ${assumption.category}`,
        scenarioId: scenario.id,
        currentValue: 50,
        thresholdValue: 70,
        trend: 'stable',
        monitoringFrequency: 'monthly',
        alertOwner: context.userId,
      });
    });
  });

  return indicators;
}

/**
 * Function 21: Generate contingency plans
 * Creates response plans for different scenarios
 */
export function generateContingencyPlans(scenarios: Scenario[]): ContingencyPlan[] {
  return scenarios.map((scenario, index) => ({
    id: `cp-${index}`,
    scenarioId: scenario.id,
    planName: `Contingency Plan: ${scenario.scenarioName}`,
    triggers: scenario.assumptions.map(a => a.assumption),
    actions: [],
    resources: [],
    responsibleParty: 'Strategy Team',
    activationCriteria: `Scenario probability exceeds ${(scenario.probability * 100).toFixed(0)}%`,
  }));
}

/**
 * Function 22: Assess scenario probability
 * Evaluates likelihood of scenario occurrence
 */
export function assessScenarioProbability(
  scenario: Scenario,
  currentIndicators: EarlyWarningIndicator[]
): number {
  const relevantIndicators = currentIndicators.filter(i => i.scenarioId === scenario.id);

  if (relevantIndicators.length === 0) return scenario.probability;

  const indicatorStrength = relevantIndicators.reduce((sum, indicator) => {
    const ratio = indicator.currentValue / indicator.thresholdValue;
    return sum + ratio;
  }, 0) / relevantIndicators.length;

  return Math.min(1, scenario.probability * indicatorStrength);
}

/**
 * Function 23: Create value chain analysis
 * Analyzes primary and support activities for competitive advantage
 */
export async function createValueChainAnalysis(
  context: StrategyContext,
  data: Partial<ValueChainAnalysis>,
  transaction?: Transaction
): Promise<ValueChainAnalysis> {
  try {
    const analysisId = generateUUID();
    const timestamp = new Date().toISOString();

    // Identify cost and value drivers
    const costDrivers = identifyCostDrivers(data.primaryActivities || [], data.supportActivities || []);
    const valueDrivers = identifyValueDrivers(data.primaryActivities || [], data.supportActivities || []);

    // Identify competitive advantages
    const advantages = identifyCompetitiveAdvantages([...data.primaryActivities || [], ...data.supportActivities || []]);

    const analysis: ValueChainAnalysis = {
      id: analysisId,
      organizationId: data.organizationId || context.organizationId,
      analysisDate: data.analysisDate || timestamp.split('T')[0],
      primaryActivities: data.primaryActivities || [],
      supportActivities: data.supportActivities || [],
      costDrivers,
      valueDrivers,
      competitiveAdvantages: advantages,
      improvementOpportunities: data.improvementOpportunities || [],
      metadata: {
        ...data.metadata,
        createdAt: timestamp,
        framework: StrategyFramework.VALUE_CHAIN,
      },
    };

    return analysis;
  } catch (error) {
    throw new Error(`Failed to create value chain analysis: ${error.message}`);
  }
}

/**
 * Function 24: Identify cost drivers
 * Finds key cost drivers in value chain activities
 */
export function identifyCostDrivers(
  primary: ValueActivity[],
  support: ValueActivity[]
): CostDriver[] {
  const allActivities = [...primary, ...support];
  const drivers: CostDriver[] = [];

  allActivities.forEach(activity => {
    if (activity.costContribution > 15) {
      drivers.push({
        activityId: activity.id,
        driver: `${activity.activityName} cost contribution`,
        impactLevel: Math.round(activity.costContribution / 10),
        optimization: `Reduce ${activity.activityName} costs through process improvement`,
        expectedSavings: activity.costContribution * 10000,
      });
    }
  });

  return drivers.sort((a, b) => b.impactLevel - a.impactLevel);
}

/**
 * Function 25: Identify value drivers
 * Finds key value creation drivers in value chain
 */
export function identifyValueDrivers(
  primary: ValueActivity[],
  support: ValueActivity[]
): ValueDriver[] {
  const allActivities = [...primary, ...support];
  const drivers: ValueDriver[] = [];

  allActivities.forEach(activity => {
    if (activity.valueContribution >= 7) {
      drivers.push({
        activityId: activity.id,
        driver: `${activity.activityName} value creation`,
        customerValue: activity.valueContribution,
        differentiationPotential: activity.improvementPotential,
        enhancementStrategy: `Enhance ${activity.activityName} to increase customer value`,
        expectedRevenue: activity.valueContribution * 50000,
      });
    }
  });

  return drivers.sort((a, b) => b.customerValue - a.customerValue);
}

/**
 * Function 26: Identify competitive advantages
 * Detects sources of competitive advantage in value chain
 */
export function identifyCompetitiveAdvantages(activities: ValueActivity[]): CompetitiveAdvantage[] {
  const advantages: CompetitiveAdvantage[] = [];

  const superior = activities.filter(a => a.competitivePosition === 'superior');

  superior.forEach(activity => {
    const type: 'cost' | 'differentiation' | 'focus' =
      activity.costContribution < 10 ? 'cost' : 'differentiation';

    advantages.push({
      source: activity.activityName,
      type,
      sustainability: activity.efficiency,
      activities: [activity.id],
      protection: `Maintain excellence in ${activity.activityName}`,
    });
  });

  return advantages;
}

// Continuing with remaining functions 27-45...

/**
 * Function 27: Calculate value chain margin
 * Computes total margin from value chain activities
 */
export function calculateValueChainMargin(analysis: ValueChainAnalysis): number {
  const totalValue = [...analysis.primaryActivities, ...analysis.supportActivities]
    .reduce((sum, a) => sum + a.valueContribution, 0);

  const totalCost = [...analysis.primaryActivities, ...analysis.supportActivities]
    .reduce((sum, a) => sum + a.costContribution, 0);

  return ((totalValue - totalCost) / totalValue) * 100;
}

/**
 * Function 28: Benchmark value chain activities
 * Compares activities against industry benchmarks
 */
export function benchmarkValueChainActivities(
  activities: ValueActivity[],
  benchmarks: Record<string, number>
): Array<{ activity: string; gap: number }> {
  return activities.map(activity => ({
    activity: activity.activityName,
    gap: (benchmarks[activity.category] || 5) - activity.efficiency,
  }));
}

/**
 * Function 29: Generate strategic roadmap
 * Creates multi-year strategic implementation roadmap
 */
export function generateStrategicRoadmap(
  initiatives: Initiative[],
  timeHorizon: number
): Array<{ year: number; initiatives: Initiative[] }> {
  const roadmap: Array<{ year: number; initiatives: Initiative[] }> = [];

  for (let year = 1; year <= timeHorizon; year++) {
    const yearInitiatives = initiatives.filter(i => {
      const start = new Date(i.startDate);
      const end = new Date(i.endDate);
      const currentYear = new Date().getFullYear() + year - 1;
      return start.getFullYear() <= currentYear && end.getFullYear() >= currentYear;
    });

    roadmap.push({ year, initiatives: yearInitiatives });
  }

  return roadmap;
}

/**
 * Function 30: Perform stakeholder analysis
 * Maps and analyzes key stakeholders
 */
export function performStakeholderAnalysis(
  stakeholders: Array<{ name: string; power: number; interest: number }>
): Array<{ name: string; quadrant: string; strategy: string }> {
  return stakeholders.map(stakeholder => {
    let quadrant: string;
    let strategy: string;

    if (stakeholder.power >= 5 && stakeholder.interest >= 5) {
      quadrant = 'Key Players';
      strategy = 'Manage Closely';
    } else if (stakeholder.power >= 5 && stakeholder.interest < 5) {
      quadrant = 'Keep Satisfied';
      strategy = 'Keep Satisfied';
    } else if (stakeholder.power < 5 && stakeholder.interest >= 5) {
      quadrant = 'Keep Informed';
      strategy = 'Keep Informed';
    } else {
      quadrant = 'Monitor';
      strategy = 'Monitor Minimally';
    }

    return { name: stakeholder.name, quadrant, strategy };
  });
}

/**
 * Function 31: Calculate strategic fit score
 * Assesses alignment between initiative and strategy
 */
export function calculateStrategicFitScore(
  initiative: GrowthInitiative,
  strategicObjectives: StrategicObjective[]
): number {
  // Weighted scoring based on strategic alignment
  const alignmentScore = initiative.strategicFit;
  const riskAdjustment = (6 - getRiskValue(initiative.riskLevel)) / 5;
  const roiImpact = Math.min(initiative.roi / 100, 1);

  return (alignmentScore * 0.5 + riskAdjustment * 10 * 0.3 + roiImpact * 10 * 0.2);
}

function getRiskValue(risk: StrategicRiskLevel): number {
  const values = { critical: 5, high: 4, moderate: 3, low: 2, negligible: 1 };
  return values[risk] || 3;
}

/**
 * Function 32: Optimize portfolio allocation
 * Uses efficient frontier to optimize portfolio mix
 */
export function optimizePortfolioAllocation(
  units: BCGBusinessUnit[],
  constraints: { maxRisk: number; minReturn: number }
): ResourceAllocation[] {
  const allocations: ResourceAllocation[] = [];
  const totalRevenue = units.reduce((sum, u) => sum + u.revenue, 0);

  units.forEach(unit => {
    const risk = getPositionRisk(unit.position);
    const expectedReturn = unit.profitMargin;

    let weight = 0;
    if (risk <= constraints.maxRisk && expectedReturn >= constraints.minReturn) {
      weight = (expectedReturn / risk) * (unit.revenue / totalRevenue);
    }

    allocations.push({
      businessUnitId: unit.id,
      allocationType: 'capital',
      currentAllocation: (unit.revenue / totalRevenue) * 100,
      recommendedAllocation: weight * 100,
      variance: (weight * 100) - ((unit.revenue / totalRevenue) * 100),
      justification: `Risk-adjusted allocation based on ${expectedReturn}% return and ${risk} risk`,
    });
  });

  return allocations;
}

function getPositionRisk(position: StrategicPosition): number {
  const risks = {
    [StrategicPosition.STAR]: 3,
    [StrategicPosition.CASH_COW]: 1,
    [StrategicPosition.QUESTION_MARK]: 4,
    [StrategicPosition.DOG]: 2,
    [StrategicPosition.LEADER]: 2,
    [StrategicPosition.CHALLENGER]: 3,
    [StrategicPosition.FOLLOWER]: 3,
    [StrategicPosition.NICHER]: 4,
  };
  return risks[position] || 3;
}

/**
 * Function 33: Conduct PESTEL analysis
 * Analyzes Political, Economic, Social, Technological, Environmental, Legal factors
 */
export function conductPESTELAnalysis(
  factors: Record<string, Array<{ factor: string; impact: number }>>
): { category: string; totalImpact: number; keyFactors: string[] }[] {
  const categories = ['political', 'economic', 'social', 'technological', 'environmental', 'legal'];

  return categories.map(category => {
    const categoryFactors = factors[category] || [];
    const totalImpact = categoryFactors.reduce((sum, f) => sum + f.impact, 0);
    const keyFactors = categoryFactors
      .filter(f => f.impact >= 7)
      .map(f => f.factor);

    return { category, totalImpact, keyFactors };
  });
}

/**
 * Function 34: Analyze core competencies
 * Identifies and evaluates organizational core competencies
 */
export function analyzeCoreCompetencies(
  competencies: Array<{ name: string; valuable: boolean; rare: boolean; inimitable: boolean; organized: boolean }>
): Array<{ name: string; isCoreCompetency: boolean; sustainableAdvantage: boolean }> {
  return competencies.map(comp => {
    const isCoreCompetency = comp.valuable && comp.rare && comp.inimitable;
    const sustainableAdvantage = isCoreCompetency && comp.organized;

    return {
      name: comp.name,
      isCoreCompetency,
      sustainableAdvantage,
    };
  });
}

/**
 * Function 35: Calculate market attractiveness
 * Evaluates market attractiveness using multiple factors
 */
export function calculateMarketAttractiveness(
  market: {
    size: number;
    growth: number;
    profitability: number;
    competitiveIntensity: number;
    barriers: number;
  }
): number {
  const weights = {
    size: 0.2,
    growth: 0.3,
    profitability: 0.25,
    competitiveIntensity: 0.15,
    barriers: 0.1,
  };

  return (
    market.size * weights.size +
    market.growth * weights.growth +
    market.profitability * weights.profitability +
    (10 - market.competitiveIntensity) * weights.competitiveIntensity +
    market.barriers * weights.barriers
  );
}

/**
 * Function 36: Perform gap analysis
 * Identifies gaps between current and desired state
 */
export function performGapAnalysis(
  currentState: Record<string, number>,
  desiredState: Record<string, number>
): Array<{ dimension: string; gap: number; priority: StrategyPriority }> {
  const gaps: Array<{ dimension: string; gap: number; priority: StrategyPriority }> = [];

  Object.keys(desiredState).forEach(dimension => {
    const gap = desiredState[dimension] - (currentState[dimension] || 0);
    let priority: StrategyPriority;

    if (gap >= 5) priority = StrategyPriority.CRITICAL;
    else if (gap >= 3) priority = StrategyPriority.HIGH;
    else if (gap >= 1) priority = StrategyPriority.MEDIUM;
    else priority = StrategyPriority.LOW;

    gaps.push({ dimension, gap, priority });
  });

  return gaps.sort((a, b) => b.gap - a.gap);
}

/**
 * Function 37: Simulate strategic scenarios
 * Runs Monte Carlo simulation for strategic outcomes
 */
export function simulateStrategicScenarios(
  initiative: GrowthInitiative,
  iterations: number = 1000
): { meanROI: number; stdDev: number; successProbability: number } {
  const results: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const randomFactor = 0.5 + Math.random();
    const simulatedROI = initiative.roi * randomFactor * initiative.successProbability;
    results.push(simulatedROI);
  }

  const meanROI = results.reduce((sum, r) => sum + r, 0) / results.length;
  const variance = results.reduce((sum, r) => sum + Math.pow(r - meanROI, 2), 0) / results.length;
  const stdDev = Math.sqrt(variance);
  const successProbability = results.filter(r => r > 0).length / results.length;

  return { meanROI, stdDev, successProbability };
}

/**
 * Function 38: Prioritize strategic initiatives
 * Ranks initiatives using multi-criteria decision analysis
 */
export function prioritizeStrategicInitiatives(
  initiatives: Initiative[],
  criteria: { impact: number; feasibility: number; urgency: number; alignment: number }
): Initiative[] {
  const scored = initiatives.map(initiative => {
    const score =
      (initiative.expectedImpact / 10) * criteria.impact +
      ((100 - initiative.progress) / 100) * criteria.feasibility +
      (isUrgent(initiative.endDate) ? 1 : 0.5) * criteria.urgency +
      criteria.alignment;

    return { ...initiative, score };
  });

  return scored.sort((a, b) => (b as any).score - (a as any).score);
}

function isUrgent(endDate: string): boolean {
  const end = new Date(endDate);
  const now = new Date();
  const monthsUntilEnd = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
  return monthsUntilEnd < 6;
}

/**
 * Function 39: Track strategic KPIs
 * Monitors key performance indicators for strategic initiatives
 */
export function trackStrategicKPIs(
  kpis: Array<{ name: string; current: number; target: number; weight: number }>
): { overallProgress: number; atRiskKPIs: string[] } {
  let weightedProgress = 0;
  let totalWeight = 0;
  const atRiskKPIs: string[] = [];

  kpis.forEach(kpi => {
    const progress = (kpi.current / kpi.target) * 100;
    weightedProgress += progress * kpi.weight;
    totalWeight += kpi.weight;

    if (progress < 70) {
      atRiskKPIs.push(kpi.name);
    }
  });

  const overallProgress = totalWeight > 0 ? weightedProgress / totalWeight : 0;

  return { overallProgress, atRiskKPIs };
}

/**
 * Function 40: Generate strategy execution dashboard
 * Creates comprehensive dashboard metrics for strategy tracking
 */
export function generateStrategyExecutionDashboard(
  scorecard: BalancedScorecard,
  initiatives: Initiative[]
): {
  overallHealth: number;
  perspectiveHealth: Record<string, number>;
  initiativeProgress: number;
  atRiskCount: number;
} {
  const perspectives = [
    scorecard.financialPerspective,
    scorecard.customerPerspective,
    scorecard.internalProcessPerspective,
    scorecard.learningGrowthPerspective,
  ];

  const perspectiveHealth: Record<string, number> = {};
  perspectives.forEach(p => {
    perspectiveHealth[p.perspective] = (p.currentScore / p.targetScore) * 100;
  });

  const overallHealth = Object.values(perspectiveHealth).reduce((sum, h) => sum + h, 0) / 4;

  const initiativeProgress = initiatives.reduce((sum, i) => sum + i.progress, 0) / initiatives.length;

  const atRiskCount = initiatives.filter(i => i.progress < 50 && i.status === InitiativeStatus.IN_PROGRESS).length;

  return {
    overallHealth,
    perspectiveHealth,
    initiativeProgress,
    atRiskCount,
  };
}

/**
 * Function 41: Analyze strategic dependencies
 * Maps dependencies between strategic initiatives
 */
export function analyzeStrategicDependencies(
  initiatives: Initiative[]
): Array<{ initiative: string; blockedBy: string[]; blocks: string[] }> {
  return initiatives.map(initiative => {
    const blockedBy = initiatives
      .filter(other => initiative.dependencies.includes(other.id))
      .map(other => other.initiativeName);

    const blocks = initiatives
      .filter(other => other.dependencies.includes(initiative.id))
      .map(other => other.initiativeName);

    return {
      initiative: initiative.initiativeName,
      blockedBy,
      blocks,
    };
  });
}

/**
 * Function 42: Calculate strategic momentum
 * Measures rate of strategic progress
 */
export function calculateStrategicMomentum(
  historicalScores: Array<{ period: string; score: number }>
): { momentum: number; trend: 'accelerating' | 'steady' | 'decelerating' } {
  if (historicalScores.length < 2) {
    return { momentum: 0, trend: 'steady' };
  }

  const recent = historicalScores.slice(-3);
  const changes = recent.slice(1).map((score, i) => score.score - recent[i].score);
  const avgChange = changes.reduce((sum, c) => sum + c, 0) / changes.length;

  let trend: 'accelerating' | 'steady' | 'decelerating';
  if (avgChange > 2) trend = 'accelerating';
  else if (avgChange < -2) trend = 'decelerating';
  else trend = 'steady';

  return { momentum: avgChange, trend };
}

/**
 * Function 43: Assess strategic agility
 * Evaluates organization's ability to adapt strategy
 */
export function assessStrategicAgility(
  factors: {
    decisionSpeed: number;
    resourceFlexibility: number;
    innovationCapability: number;
    marketResponsiveness: number;
  }
): { agilityScore: number; strengths: string[]; weaknesses: string[] } {
  const scores = Object.entries(factors);
  const agilityScore = scores.reduce((sum, [_, value]) => sum + value, 0) / scores.length;

  const strengths = scores.filter(([_, value]) => value >= 7).map(([key]) => key);
  const weaknesses = scores.filter(([_, value]) => value < 5).map(([key]) => key);

  return { agilityScore, strengths, weaknesses };
}

/**
 * Function 44: Forecast strategic outcomes
 * Projects future outcomes based on current trajectory
 */
export function forecastStrategicOutcomes(
  currentMetrics: Record<string, number>,
  growthRates: Record<string, number>,
  periods: number
): Array<{ period: number; metrics: Record<string, number> }> {
  const forecast: Array<{ period: number; metrics: Record<string, number> }> = [];

  for (let period = 1; period <= periods; period++) {
    const metrics: Record<string, number> = {};
    Object.keys(currentMetrics).forEach(metric => {
      const growthRate = growthRates[metric] || 0;
      metrics[metric] = currentMetrics[metric] * Math.pow(1 + growthRate, period);
    });
    forecast.push({ period, metrics });
  }

  return forecast;
}

/**
 * Function 45: Generate executive strategy summary
 * Creates C-suite ready strategic summary
 */
export function generateExecutiveStrategySummary(
  swot: SWOTAnalysis,
  porter: PorterFiveForcesAnalysis,
  bcg: BCGMatrixAnalysis,
  scorecard: BalancedScorecard
): {
  strategicPosition: string;
  keyRecommendations: string[];
  criticalRisks: string[];
  performanceSummary: string;
  nextSteps: string[];
} {
  const strategicPosition = `Industry attractiveness: ${porter.overallAttractiveness.toFixed(1)}/10. Portfolio balanced with ${bcg.businessUnits.filter(u => u.position === StrategicPosition.STAR).length} Stars and ${bcg.businessUnits.filter(u => u.position === StrategicPosition.CASH_COW).length} Cash Cows.`;

  const keyRecommendations = [
    ...swot.strategicRecommendations.slice(0, 3).map(r => r.recommendation),
    ...bcg.portfolioRecommendations.slice(0, 2).map(r => r.rationale),
  ];

  const criticalRisks = swot.threats
    .filter(t => t.urgency >= 8)
    .map(t => t.description);

  const performanceSummary = `Overall scorecard performance: ${scorecard.overallScore.toFixed(1)}%. ${scorecard.overallScore >= 80 ? 'On track' : scorecard.overallScore >= 60 ? 'Needs attention' : 'Critical intervention required'}.`;

  const nextSteps = swot.crossFactorAnalysis
    .filter(cf => cf.priority === StrategyPriority.CRITICAL || cf.priority === StrategyPriority.HIGH)
    .slice(0, 5)
    .map(cf => cf.strategy);

  return {
    strategicPosition,
    keyRecommendations,
    criticalRisks,
    performanceSummary,
    nextSteps,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // SWOT Analysis
  createSWOTAnalysis,
  generateCrossFactorAnalysis,
  generateSWOTRecommendations,

  // Porter's Five Forces
  createPorterFiveForcesAnalysis,
  calculateIndustryAttractiveness,

  // BCG Matrix
  createBCGMatrixAnalysis,
  determineBCGPosition,
  getBCGStrategy,
  getInvestmentPriority,
  generatePortfolioRecommendations,
  calculateResourceAllocation,
  identifyStrategicGaps,

  // Ansoff Matrix
  createAnsoffMatrixAnalysis,
  assessAnsoffRisk,

  // Balanced Scorecard
  createBalancedScorecard,
  buildStrategyMap,
  calculateBalancedScorecardPerformance,
  trackMeasurePerformance,

  // Scenario Planning
  createScenarioPlanningAnalysis,
  generateEarlyWarningIndicators,
  generateContingencyPlans,
  assessScenarioProbability,

  // Value Chain
  createValueChainAnalysis,
  identifyCostDrivers,
  identifyValueDrivers,
  identifyCompetitiveAdvantages,
  calculateValueChainMargin,
  benchmarkValueChainActivities,

  // Additional Strategic Tools
  generateStrategicRoadmap,
  performStakeholderAnalysis,
  calculateStrategicFitScore,
  optimizePortfolioAllocation,
  conductPESTELAnalysis,
  analyzeCoreCompetencies,
  calculateMarketAttractiveness,
  performGapAnalysis,
  simulateStrategicScenarios,
  prioritizeStrategicInitiatives,
  trackStrategicKPIs,
  generateStrategyExecutionDashboard,
  analyzeStrategicDependencies,
  calculateStrategicMomentum,
  assessStrategicAgility,
  forecastStrategicOutcomes,
  generateExecutiveStrategySummary,

  // Models
  SWOTAnalysisModel,
  PorterFiveForcesModel,
  BCGMatrixModel,
  BalancedScorecardModel,
};
